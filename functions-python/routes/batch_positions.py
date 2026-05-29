"""
routes/batch_positions.py

Lightweight batch endpoint for chart position playback.
Computes planet positions + house cusps for a range of minutes
using Swiss Ephemeris (~15ms/chart). No scoring — positions only.
"""

from firebase_functions import https_fn, options
import json
import time
import traceback
from routes.shared import (
    ALLOWED_ORIGINS,
    verify_auth,
    error_response,
)


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=ALLOWED_ORIGINS,
        cors_methods=["GET", "POST"],
    ),
    memory=options.MemoryOption.GB_2,
    timeout_sec=300,
)
def batch_chart_positions(req: https_fn.Request) -> https_fn.Response:
    """
    POST /batch_chart_positions

    Compute lightweight chart positions for a range of birth times.
    Used by the LAB playback controls for smooth cassette-tape animation.

    Request body:
    {
        "birthDate": "1878-10-04",
        "latitude": 41.3851,
        "longitude": 2.1734,
        "timezone": "Europe/Madrid",
        "startMinutes": 0,        // 0-1439 (minutes from midnight)
        "endMinutes": 1439,       // 0-1439
        "stepMinutes": 5          // 1 or 5
    }

    Response:
    {
        "success": true,
        "result": {
            "frames": [ { minutes, timeLabel, ascendant, midheaven, planets, cusps } ... ],
            "totalFrames": 288,
            "computeMs": 4300
        }
    }
    """
    # Auth
    user, err = verify_auth(req)
    if err:
        return err

    # Parse
    try:
        body = req.get_json(silent=True) or {}
    except Exception:
        return https_fn.Response(
            json.dumps({"error": "Invalid JSON body"}),
            status=400,
            headers={"Content-Type": "application/json"},
        )

    # Validate required fields
    birth_date = body.get("birthDate")
    latitude = body.get("latitude")
    longitude = body.get("longitude")
    timezone_str = body.get("timezone", "UTC")

    missing = []
    if not birth_date:
        missing.append("birthDate")
    if latitude is None:
        missing.append("latitude")
    if longitude is None:
        missing.append("longitude")

    if missing:
        return https_fn.Response(
            json.dumps({"error": f"Missing required fields: {', '.join(missing)}"}),
            status=400,
            headers={"Content-Type": "application/json"},
        )

    # Optional params with defaults
    start_minutes = int(body.get("startMinutes", 0))
    end_minutes = int(body.get("endMinutes", 1439))
    step_minutes = int(body.get("stepMinutes", 5))

    # Clamp to sane limits
    start_minutes = max(0, min(start_minutes, 1439))
    end_minutes = max(start_minutes, min(end_minutes, 1439))
    step_minutes = max(1, min(step_minutes, 60))

    try:
        from western_engine.birth_time_lab import (
            compute_light_chart,
            _parse_to_utc,
            _datetime_to_jd,
        )
        from western_engine.tuning_lab_constants import ZODIAC_SIGNS

        lat = float(latitude)
        lon = float(longitude)

        t0 = time.time()
        frames = []

        minutes = start_minutes
        while minutes <= end_minutes:
            h, m = divmod(minutes, 60)
            time_str = f"{h:02d}:{m:02d}"

            utc_dt = _parse_to_utc(birth_date, time_str, timezone_str)
            jd = _datetime_to_jd(utc_dt)

            chart = compute_light_chart(
                jd, lat, lon,
                offset_minutes=minutes,
                time_label=time_str,
            )

            # Build planet positions dict (lowercase snake_case keys)
            planets = {}
            for name, lng in chart.planet_longitudes.items():
                key = name.lower().replace(" ", "_")
                planets[key] = {
                    "longitude": round(lng, 4),
                    "sign": chart.planet_signs.get(name, ""),
                    "degree": round(chart.planet_degrees.get(name, 0.0), 2),
                    "retrograde": chart.planet_retrogrades.get(name, False),
                    "house": chart.planet_houses.get(name, 1),
                }

            # Build cusps array
            cusps = []
            for i, cusp_lon in enumerate(chart.cusps):
                sign_idx = int(cusp_lon / 30) % 12
                cusps.append({
                    "house": i + 1,
                    "longitude": round(cusp_lon, 4),
                    "sign": ZODIAC_SIGNS[sign_idx],
                    "degree": round(cusp_lon % 30, 2),
                })

            # ASC and MC
            asc_sign_idx = int(chart.ascendant / 30) % 12
            mc_sign_idx = int(chart.midheaven / 30) % 12

            frames.append({
                "minutes": minutes,
                "timeLabel": time_str,
                "planets": planets,
                "cusps": cusps,
                "ascendant": {
                    "longitude": round(chart.ascendant, 4),
                    "sign": ZODIAC_SIGNS[asc_sign_idx],
                    "degree": round(chart.ascendant % 30, 2),
                },
                "midheaven": {
                    "longitude": round(chart.midheaven, 4),
                    "sign": ZODIAC_SIGNS[mc_sign_idx],
                    "degree": round(chart.midheaven % 30, 2),
                },
            })

            minutes += step_minutes

        compute_ms = round((time.time() - t0) * 1000, 1)

        return https_fn.Response(
            json.dumps({
                "success": True,
                "result": {
                    "frames": frames,
                    "totalFrames": len(frames),
                    "computeMs": compute_ms,
                },
            }),
            status=200,
            headers={"Content-Type": "application/json"},
        )

    except Exception as e:
        print(f"[batch_positions] Error: {traceback.format_exc()}")
        return error_response(e, context="batch_chart_positions")
