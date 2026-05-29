"""
routes/tuning_lab.py

HTTP endpoint for the Birth Time Tuning Lab.
Firebase Cloud Function (2nd Gen) — minute-by-minute birth time scoring.
"""

from firebase_functions import https_fn, options
import json
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
    timeout_sec=540,
)
def birth_time_tuning_lab(req: https_fn.Request) -> https_fn.Response:
    """
    POST /birth_time_tuning_lab

    Sweep a time range around a given birth time, score each minute across
    10 dimensions (identity stability, chart coherence, planet conditions,
    luminary quality, angular dynamics, aspect architecture, life area emphasis,
    event backtesting, interpretation robustness), and return ranked results.

    Request body:
    {
        "birthDate": "1878-10-04",
        "birthTime": "06:30",
        "latitude": 41.3851,
        "longitude": 2.1734,
        "timezone": "Europe/Madrid",
        "sweepMinutes": 30,       // optional, default 30
        "stepSeconds": 60,        // optional, default 60
        "profile": "defaultBalanced",  // optional
        "events": [               // optional
            {"date": "1920-03-15", "theme": "career", "description": "..."}
        ]
    }

    Response:
    {
        "success": true,
        "result": { ...TuningLabResult... }
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
    birth_time = body.get("birthTime")
    latitude = body.get("latitude")
    longitude = body.get("longitude")
    timezone_str = body.get("timezone", "UTC")

    missing = []
    if not birth_date:
        missing.append("birthDate")
    if not birth_time:
        missing.append("birthTime")
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
    sweep_minutes = int(body.get("sweepMinutes", 30))
    step_seconds = int(body.get("stepSeconds", 60))
    profile = body.get("profile", "defaultBalanced")
    events = body.get("events")

    # Clamp sweep range to reasonable limits
    sweep_minutes = max(1, min(sweep_minutes, 720))   # 1 to 720 minutes (±12h = 24h)
    step_seconds = max(30, min(step_seconds, 900))    # 30s to 15min steps

    try:
        from western_engine.tuning_lab_models import TuningLabRequest
        from western_engine.birth_time_lab import run_tuning_lab

        request = TuningLabRequest(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=float(latitude),
            longitude=float(longitude),
            timezone=timezone_str,
            sweep_minutes=sweep_minutes,
            step_seconds=step_seconds,
            events=events,
            profile=profile,
        )

        result = run_tuning_lab(request)

        return https_fn.Response(
            json.dumps({"success": True, "result": result.to_dict()}),
            status=200,
            headers={"Content-Type": "application/json"},
        )

    except Exception as e:
        print(f"[tuning_lab] Error: {traceback.format_exc()}")
        return error_response(e, context="birth_time_tuning_lab")
