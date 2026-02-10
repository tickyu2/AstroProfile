"""
Astrology Calculation Endpoints
Swiss Ephemeris-based natal chart, Vedic chart, planetary positions,
seasonal ingresses, and elemental balance.
"""

from firebase_functions import https_fn, options
import json
from datetime import datetime

from astro.calculator import SwissEphemerisCalculator
from astro.interpretation import build_interpretations


# =============================================================================
# ASTROLOGY CALCULATION ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_natal_chart(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate a complete natal chart using Swiss Ephemeris

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": "America/New_York"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        required = ["birthDate", "birthTime", "latitude", "longitude"]
        for field in required:
            if field not in data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field: {field}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

        # Calculate natal chart
        calculator = SwissEphemerisCalculator()
        chart = calculator.calculate_natal_chart(
            birth_date=data["birthDate"],
            birth_time=data["birthTime"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            timezone=data.get("timezone", "UTC")
        )

        return https_fn.Response(
            json.dumps(chart),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_vedic_chart(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate a complete Vedic (Jyotish) natal chart using sidereal zodiac.

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "timezone": "Asia/Kolkata",
        "ayanamsha": "lahiri",      // optional: lahiri, raman, krishnamurti, etc.
        "houseSystem": "whole_sign"  // optional: whole_sign, equal, placidus
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        required = ["birthDate", "birthTime", "latitude", "longitude"]
        for field in required:
            if field not in data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field: {field}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

        # Calculate Vedic chart
        calculator = SwissEphemerisCalculator()
        chart = calculator.calculate_vedic_chart(
            birth_date=data["birthDate"],
            birth_time=data["birthTime"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            timezone=data.get("timezone", "UTC"),
            ayanamsha=data.get("ayanamsha", "lahiri"),
            house_system=data.get("houseSystem", "whole_sign")
        )

        # Add interpretation layer
        interpretations = build_interpretations(chart)
        chart["interpretations"] = interpretations

        return https_fn.Response(
            json.dumps(chart),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256
)
def calculate_planetary_positions(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate planetary positions for a specific date/time

    POST body:
    {
        "datetime": "2024-01-15T14:30:00",
        "latitude": 40.7128,
        "longitude": -74.0060
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        calculator = SwissEphemerisCalculator()
        positions = calculator.get_planetary_positions(
            dt=data.get("datetime", datetime.utcnow().isoformat()),
            latitude=data.get("latitude", 0),
            longitude=data.get("longitude", 0)
        )

        return https_fn.Response(
            json.dumps(positions),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30
)
def seasonal_ingresses(req: https_fn.Request) -> https_fn.Response:
    """
    Return Swiss Ephemeris-precise Sun ingress dates for all 12 signs in a given year.

    POST body: { "year": 1963 }   or   GET ?year=1963

    Returns 12 ingress entries with exact UTC datetimes.
    """
    try:
        if req.method == "GET":
            year = int(req.args.get("year", datetime.utcnow().year))
        else:
            data = req.get_json() or {}
            year = int(data.get("year", datetime.utcnow().year))

        if year < 1800 or year > 2200:
            return https_fn.Response(
                json.dumps({"error": "Year must be between 1800 and 2200"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        from luna_fusion.core.swiss_ephemeris import calculate_seasonal_ingresses

        ingresses = calculate_seasonal_ingresses(year)

        serialized = []
        for ing in ingresses:
            serialized.append({
                "sign": ing["sign"],
                "longitude": ing["longitude"],
                "season": ing["season"],
                "phase": ing["phase"],
                "datetime_utc": ing["datetime_utc"].strftime("%Y-%m-%dT%H:%M:%SZ"),
                "month": ing["month"],
                "day": ing["day"],
                "hour": ing["hour"],
                "minute": ing["minute"],
                "is_equinox": ing["is_equinox"],
                "is_solstice": ing["is_solstice"],
                "event_name": ing.get("event_name"),
            })

        return https_fn.Response(
            json.dumps({"year": year, "ingresses": serialized}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256
)
def calculate_elemental_balance(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate Western elemental balance (Fire, Earth, Air, Water)

    POST body:
    {
        "planets": {
            "sun": {"sign": "Taurus", "degree": 15.5},
            "moon": {"sign": "Cancer", "degree": 22.3},
            ...
        }
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        calculator = SwissEphemerisCalculator()
        elements = calculator.calculate_elemental_balance(data.get("planets", {}))

        return https_fn.Response(
            json.dumps(elements),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )
