"""
GENESIS Python Cloud Functions
Wood House Architecture - Swiss Ephemeris + Neo4j Integration

Firebase Cloud Functions (2nd Gen) with Python support
"""

from firebase_functions import https_fn, options
from firebase_functions.params import SecretParam
from firebase_admin import initialize_app, firestore
import json
import os
from datetime import datetime

# Initialize Firebase Admin
initialize_app()

# Import our modules
from astro.calculator import SwissEphemerisCalculator
from astro.interpretation import build_interpretations
from graph.neo4j_service import Neo4jService
from graph.schema import initialize_schema, verify_schema
from graph.graphrag_queries import GraphRAGService, GraphContext

# Import BaZi Joey Yap Engine
try:
    from bazi_engine import (
        analyze_bazi,
        four_pillars_from_datetime,
        derive_ten_gods,
        detect_symbolic_stars,
        element_distribution,
        day_master_strength,
        dayun_for_birth,
        has_sxtwl,
        ELEMENT_MAP
    )
    BAZI_ENGINE_AVAILABLE = True
except ImportError as e:
    BAZI_ENGINE_AVAILABLE = False
    BAZI_ENGINE_ERROR = str(e)

# Import BaZi Synastry Module (P6 Chinese Metaphysics)
try:
    from luna_fusion.synastry.bazi_synastry import (
        compute_bazi_compatibility,
        synastry_matrix,
        synastry_insights,
        calculate_relationship_axes,
        explain_synastry_cell,
        is_liu_he, is_san_he, is_chong, is_hai, is_xing
    )
    BAZI_SYNASTRY_AVAILABLE = True
except ImportError as e:
    BAZI_SYNASTRY_AVAILABLE = False
    BAZI_SYNASTRY_ERROR = str(e)

# Import Biographic Extraction Engine (Brain 1B → 2 Consolidation)
try:
    from consolidation import (
        extract_biography,
        consolidate_memory,
        ingest_into_graph,
        BiographicExtractor
    )
    BIOGRAPHER_AVAILABLE = True
except ImportError as e:
    BIOGRAPHER_AVAILABLE = False
    BIOGRAPHER_ERROR = str(e)

# Import Western Cusp Engine (72-dim Expression Vector)
try:
    from western_engine import (
        analyze_western,
        build_western_expression_vector,
        calculate_porphyry_houses,
        calculate_aspects,
        detect_aspect_patterns,
        detect_chart_shape,
        calculate_planetary_psychology,
        WesternExpressionVector,
        WesternChart,
        SynastryResult,
        WesternCompatibilityScore
    )
    from western_engine.synastry import (
        calculate_synastry,
        western_compatibility_detailed
    )
    from western_engine.explainability import (
        explain_western_chart,
        explain_synastry,
        explain_compatibility
    )
    WESTERN_ENGINE_AVAILABLE = True
except ImportError as e:
    WESTERN_ENGINE_AVAILABLE = False
    WESTERN_ENGINE_ERROR = str(e)

# Import Unified API Module (Phase 1 - Python-First Architecture)
try:
    from api import (
        compute_profile as api_compute_profile,
        compute_compatibility as api_compute_compatibility,
        ComputeProfileRequest,
        ComputeCompatibilityRequest,
        BirthDataInput,
    )
    UNIFIED_API_AVAILABLE = True
except ImportError as e:
    UNIFIED_API_AVAILABLE = False
    UNIFIED_API_ERROR = str(e)

# Define secrets
NEO4J_URI_SECRET = SecretParam("NEO4J_URI")
NEO4J_PASSWORD_SECRET = SecretParam("NEO4J_PASSWORD")
OPENAI_API_KEY_SECRET = SecretParam("OPENAI_API_KEY")
ANTHROPIC_API_KEY_SECRET = SecretParam("ANTHROPIC_API_KEY")


def get_neo4j_service():
    """Get Neo4j service with credentials from environment/secrets"""
    return Neo4jService(
        uri=os.environ.get("NEO4J_URI"),
        user=os.environ.get("NEO4J_USER", "neo4j"),
        password=os.environ.get("NEO4J_PASSWORD")
    )


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


# =============================================================================
# BAZI JOEY YAP ENGINE ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def bazi_joey_yap(req: https_fn.Request) -> https_fn.Response:
    """
    Complete BaZi chart analysis following Joey Yap conventions.

    Uses sxtwl (寿星万年历) for accurate solar term calculations when available.
    Year starts at Lichun (立春), months defined by Jie (节) solar terms.

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "isMale": true,
        "includeDayun": true,
        "dayunPillarCount": 8
    }

    Returns:
    {
        "pillars": {...},
        "day_master": {...},
        "ten_gods": {...},
        "symbolic_stars": {...},
        "element_distribution": {...},
        "dm_strength": {...},
        "dayun": {...},
        "explanation": {
            "L0_postcard": "...",
            "L1_factors": [...],
            "L2_math": {...},
            "L3_debug": {...}
        }
    }
    """
    if not BAZI_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": f"BaZi Engine not available: {BAZI_ENGINE_ERROR}",
                "hint": "Install sxtwl and lunardate: pip install sxtwl lunardate"
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        if "birthDate" not in data:
            return https_fn.Response(
                json.dumps({"error": "Missing required field: birthDate"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Parse birth datetime
        birth_date_str = data["birthDate"]
        birth_time_str = data.get("birthTime", "12:00")

        # Parse date parts
        date_parts = birth_date_str.split("-")
        year = int(date_parts[0])
        month = int(date_parts[1])
        day = int(date_parts[2])

        # Parse time parts
        time_parts = birth_time_str.split(":")
        hour = int(time_parts[0])
        minute = int(time_parts[1]) if len(time_parts) > 1 else 0

        # Create datetime
        birth_dt = datetime(year, month, day, hour, minute)

        # Run full analysis
        chart = analyze_bazi(
            birth_dt=birth_dt,
            is_male=data.get("isMale", True),
            include_dayun=data.get("includeDayun", True),
            dayun_pillar_count=data.get("dayunPillarCount", 8)
        )

        # Convert tuples to serializable format
        def serialize_chart(obj):
            if isinstance(obj, tuple):
                return list(obj)
            elif isinstance(obj, dict):
                return {k: serialize_chart(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [serialize_chart(item) for item in obj]
            return obj

        serializable_chart = serialize_chart(chart)

        # Add metadata
        serializable_chart["metadata"] = {
            "engine": "bazi_engine",
            "version": "1.0.0",
            "methodology": "Joey Yap BaZi Standard",
            "sxtwl_used": has_sxtwl(),
            "input": {
                "birthDate": birth_date_str,
                "birthTime": birth_time_str,
                "isMale": data.get("isMale", True)
            }
        }

        return https_fn.Response(
            json.dumps(serializable_chart),
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
def bazi_four_pillars(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate Four Pillars only (快速四柱)

    Lighter-weight endpoint for just the Four Pillars without full analysis.

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30"
    }
    """
    if not BAZI_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "BaZi Engine not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Parse birth datetime
        birth_date_str = data.get("birthDate", "")
        birth_time_str = data.get("birthTime", "12:00")

        date_parts = birth_date_str.split("-")
        year = int(date_parts[0])
        month = int(date_parts[1])
        day = int(date_parts[2])

        time_parts = birth_time_str.split(":")
        hour = int(time_parts[0])
        minute = int(time_parts[1]) if len(time_parts) > 1 else 0

        birth_dt = datetime(year, month, day, hour, minute)

        # Get Four Pillars
        pillars = four_pillars_from_datetime(birth_dt)

        # Format response
        pillar_names = ["year", "month", "day", "hour"]
        result = {
            "pillars": {
                name: {
                    "stem": pillars[i][0],
                    "branch": pillars[i][1],
                    "ganZhi": f"{pillars[i][0]}{pillars[i][1]}"
                }
                for i, name in enumerate(pillar_names)
            },
            "day_master": {
                "stem": pillars[2][0],
                "element": ELEMENT_MAP.get(pillars[2][0], "")
            },
            "sxtwl_used": has_sxtwl()
        }

        return https_fn.Response(
            json.dumps(result),
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
def bazi_dayun(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate DaYun (大運) Luck Pillars

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "isMale": true,
        "pillarCount": 8
    }
    """
    if not BAZI_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "BaZi Engine not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Parse birth datetime
        birth_date_str = data.get("birthDate", "")
        birth_time_str = data.get("birthTime", "12:00")

        date_parts = birth_date_str.split("-")
        year = int(date_parts[0])
        month = int(date_parts[1])
        day = int(date_parts[2])

        time_parts = birth_time_str.split(":")
        hour = int(time_parts[0])
        minute = int(time_parts[1]) if len(time_parts) > 1 else 0

        birth_dt = datetime(year, month, day, hour, minute)

        # Calculate DaYun
        dayun = dayun_for_birth(
            birth_dt=birth_dt,
            is_male=data.get("isMale", True),
            pillar_count=data.get("pillarCount", 8)
        )

        return https_fn.Response(
            json.dumps(dayun),
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
def bazi_compatibility(req: https_fn.Request) -> https_fn.Response:
    """
    BaZi Synastry/Compatibility Analysis (P6 Chinese Metaphysics)

    Calculates pillar-to-pillar compatibility using traditional Chinese methods:
    - 六合 (Liu He) - Six Harmonies
    - 三合 (San He) - Three Harmonies
    - 沖 (Chong) - Six Clashes
    - 害 (Hai) - Six Harms
    - 刑 (Xing) - Three Punishments
    - Five Element production/control cycles

    POST body - Option 1 (with birth data):
    {
        "user1": {
            "birthDate": "1990-05-15",
            "birthTime": "14:30",
            "isMale": true
        },
        "user2": {
            "birthDate": "1988-08-22",
            "birthTime": "09:15",
            "isMale": false
        },
        "includeMatrix": true,
        "includeInsights": true,
        "includeExplanations": true
    }

    POST body - Option 2 (with pre-computed charts):
    {
        "chart1": { ... full BaZi chart from bazi_joey_yap endpoint ... },
        "chart2": { ... full BaZi chart from bazi_joey_yap endpoint ... },
        "includeMatrix": true,
        "includeInsights": true,
        "includeExplanations": true
    }

    Returns:
    {
        "compatibility": {
            "overall_score": 0.72,
            "relationship_type": "Complementary Growth",
            "axes": { "elemental_harmony": 0.8, "day_master_affinity": 0.65, ... },
            "strengths": [...],
            "challenges": [...],
            "growth_areas": [...]
        },
        "matrix": [ 5x5 grid of pillar interactions ],
        "insights": { "harmonies": [...], "clashes": [...], "advice": [...] },
        "explanations": { "cell_explanations": [...] }
    }
    """
    if not BAZI_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": f"BaZi Engine not available: {BAZI_ENGINE_ERROR}"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    if not BAZI_SYNASTRY_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": f"BaZi Synastry not available: {BAZI_SYNASTRY_ERROR}"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Determine if we have birth data or pre-computed charts
        chart_a = None
        chart_b = None

        if "chart1" in data and "chart2" in data:
            # Use pre-computed charts
            chart_a = data["chart1"]
            chart_b = data["chart2"]
        elif "user1" in data and "user2" in data:
            # Generate charts from birth data
            def parse_birth_datetime(user_data):
                birth_date_str = user_data.get("birthDate", "")
                birth_time_str = user_data.get("birthTime", "12:00")

                date_parts = birth_date_str.split("-")
                year = int(date_parts[0])
                month = int(date_parts[1])
                day = int(date_parts[2])

                time_parts = birth_time_str.split(":")
                hour = int(time_parts[0])
                minute = int(time_parts[1]) if len(time_parts) > 1 else 0

                return datetime(year, month, day, hour, minute)

            birth_dt_a = parse_birth_datetime(data["user1"])
            birth_dt_b = parse_birth_datetime(data["user2"])

            chart_a = analyze_bazi(
                birth_dt=birth_dt_a,
                is_male=data["user1"].get("isMale", True),
                include_dayun=False
            )
            chart_b = analyze_bazi(
                birth_dt=birth_dt_b,
                is_male=data["user2"].get("isMale", True),
                include_dayun=False
            )
        else:
            return https_fn.Response(
                json.dumps({
                    "error": "Must provide either 'chart1'/'chart2' or 'user1'/'user2' with birth data"
                }),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Compute full BaZi compatibility
        compatibility = compute_bazi_compatibility(chart_a, chart_b)

        # Extract insights for strengths/challenges
        insights = compatibility.get("synastry_insights", {})

        # Build response
        result = {
            "compatibility": {
                "overall_score": compatibility.get("overall_compatibility", 0),
                "relationship_type": compatibility.get("compatibility_level", "Unknown"),
                "axes": compatibility.get("relationship_axes", {}),
                "total_interaction_score": insights.get("total_score", 0),
                "positive_interactions": insights.get("positive_interactions", 0),
                "negative_interactions": insights.get("negative_interactions", 0),
                "overall_pattern": insights.get("overall_pattern", ""),
                "strengths": insights.get("strongest_support", []),
                "challenges": insights.get("strongest_challenges", [])
            },
            "persons": {
                "person_a": compatibility.get("person_a", {}),
                "person_b": compatibility.get("person_b", {})
            }
        }

        # Include synastry matrix if requested
        if data.get("includeMatrix", True):
            matrix = synastry_matrix(chart_a, chart_b)
            result["matrix"] = matrix

        # Include insights if requested
        if data.get("includeInsights", True):
            if "matrix" not in result:
                matrix = synastry_matrix(chart_a, chart_b)
            else:
                matrix = result["matrix"]
            insights = synastry_insights(matrix)
            result["insights"] = insights

        # Include cell explanations if requested
        if data.get("includeExplanations", False):
            if "matrix" not in result:
                matrix = synastry_matrix(chart_a, chart_b)
            else:
                matrix = result["matrix"]

            explanations = []
            pillar_names = ["Year", "Month", "Day", "Hour", "DayMaster"]
            for i, row in enumerate(matrix):
                for j, cell in enumerate(row):
                    if cell.get("interaction") and cell.get("interaction") != "neutral":
                        explanation = explain_synastry_cell(
                            pillar_names[i], pillar_names[j],
                            cell.get("interaction", "neutral"),
                            cell.get("score", 0)
                        )
                        explanations.append({
                            "pillar_a": pillar_names[i],
                            "pillar_b": pillar_names[j],
                            "interaction": cell.get("interaction", ""),
                            "score": cell.get("score", 0),
                            "explanation": explanation
                        })
            result["explanations"] = {
                "cell_explanations": explanations
            }

        # Add metadata
        result["metadata"] = {
            "engine": "bazi_synastry",
            "version": "1.0.0",
            "methodology": "Joey Yap BaZi + Chinese Five Element Synastry",
            "sxtwl_used": has_sxtwl()
        }

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# NEO4J GRAPH ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def find_soul_family(req: https_fn.Request) -> https_fn.Response:
    """
    Find Soul Family connections using Neo4j graph queries

    POST body:
    {
        "userId": "user123",
        "elementalProfile": {
            "fire": 25,
            "earth": 30,
            "air": 20,
            "water": 25
        },
        "limit": 10
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

        neo4j_service = get_neo4j_service()
        matches = neo4j_service.find_soul_family(
            user_id=data.get("userId"),
            elemental_profile=data.get("elementalProfile", {}),
            limit=data.get("limit", 10)
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(matches),
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
def calculate_synastry(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate synastry (compatibility) between two natal charts

    POST body:
    {
        "chart1": { ... natal chart data ... },
        "chart2": { ... natal chart data ... }
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
        synastry = calculator.calculate_synastry(
            chart1=data.get("chart1", {}),
            chart2=data.get("chart2", {})
        )

        return https_fn.Response(
            json.dumps(synastry),
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
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def store_profile_node(req: https_fn.Request) -> https_fn.Response:
    """
    Store a user profile as a node in Neo4j graph

    POST body:
    {
        "userId": "user123",
        "profile": {
            "sunSign": "Taurus",
            "moonSign": "Cancer",
            "risingSign": "Leo",
            "elements": { "fire": 25, "earth": 30, "air": 20, "water": 25 }
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

        neo4j_service = get_neo4j_service()
        result = neo4j_service.create_profile_node(
            user_id=data.get("userId"),
            profile=data.get("profile", {})
        )
        neo4j_service.close()

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# HEALTH CHECK
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def python_health(req: https_fn.Request) -> https_fn.Response:
    """Health check endpoint for Python functions"""
    neo4j_configured = bool(os.environ.get("NEO4J_URI") and os.environ.get("NEO4J_PASSWORD"))

    # Check BaZi engine status
    bazi_status = {
        "available": BAZI_ENGINE_AVAILABLE,
        "sxtwl_available": has_sxtwl() if BAZI_ENGINE_AVAILABLE else False,
        "error": BAZI_ENGINE_ERROR if not BAZI_ENGINE_AVAILABLE else None
    }

    # Check BaZi Synastry status
    bazi_synastry_status = {
        "available": BAZI_SYNASTRY_AVAILABLE,
        "error": BAZI_SYNASTRY_ERROR if not BAZI_SYNASTRY_AVAILABLE else None
    }

    # Check Luna Fusion status
    luna_status = {
        "available": LUNA_FUSION_AVAILABLE,
        "error": LUNA_FUSION_ERROR if not LUNA_FUSION_AVAILABLE else None
    }

    # Check Biographer status
    biographer_status = {
        "available": BIOGRAPHER_AVAILABLE,
        "error": BIOGRAPHER_ERROR if not BIOGRAPHER_AVAILABLE else None
    }

    capabilities = [
        "Swiss Ephemeris calculations",
        "Neo4j graph queries",
        "Soul Family matching",
        "Synastry calculations"
    ]

    if BAZI_ENGINE_AVAILABLE:
        capabilities.extend([
            "BaZi Joey Yap analysis",
            "Four Pillars calculation",
            "Ten Gods derivation",
            "DaYun Luck Pillars",
            "Symbolic Stars detection"
        ])

    if BAZI_SYNASTRY_AVAILABLE:
        capabilities.extend([
            "BaZi Compatibility Analysis (P6)",
            "Six Harmonies (六合) Detection",
            "Three Harmonies (三合) Detection",
            "Six Clashes (沖) Detection",
            "Relationship Axes Scoring"
        ])

    if LUNA_FUSION_AVAILABLE:
        capabilities.extend([
            "Luna 30-Facet Fusion",
            "Natal Aspects (P4)",
            "Transits (P5)",
            "Synastry Fusion (P6)",
            "Archetypes (P7)",
            "Progressions (P8)"
        ])

    if BIOGRAPHER_AVAILABLE:
        capabilities.extend([
            "Biographic Extraction (Brain 1B → 2)",
            "Life Event Detection",
            "Relationship Mapping",
            "Emotional Signature Analysis",
            "Core Value Detection",
            "Speech Nuance Capture"
        ])

    return https_fn.Response(
        json.dumps({
            "status": "healthy",
            "service": "GENESIS Python Functions",
            "version": "1.3.0",
            "capabilities": capabilities,
            "neo4j_configured": neo4j_configured,
            "bazi_engine": bazi_status,
            "bazi_synastry": bazi_synastry_status,
            "luna_fusion": luna_status,
            "biographer": biographer_status,
            "timestamp": datetime.utcnow().isoformat()
        }),
        status=200,
        headers={"Content-Type": "application/json"}
    )


# =============================================================================
# ADMIN ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=120,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def init_neo4j_schema(req: https_fn.Request) -> https_fn.Response:
    """
    Initialize Neo4j schema with constraints, indexes, and base data.
    Run once after setting up Neo4j AuraDB.

    POST body:
    {
        "adminKey": "your-admin-key"  // Simple protection for admin endpoints
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

        # Simple admin key check (set via environment variable)
        admin_key = os.environ.get("ADMIN_KEY", "genesis-admin-2024")
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        uri = os.environ.get("NEO4J_URI")
        user = os.environ.get("NEO4J_USER", "neo4j")
        password = os.environ.get("NEO4J_PASSWORD")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j credentials not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize schema
        results = initialize_schema(uri, user, password)

        # Verify schema
        verification = verify_schema(uri, user, password)

        return https_fn.Response(
            json.dumps({
                "success": True,
                "initialization": results,
                "verification": verification
            }),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def neo4j_status(req: https_fn.Request) -> https_fn.Response:
    """Check Neo4j connection status and schema"""
    try:
        uri = os.environ.get("NEO4J_URI")
        user = os.environ.get("NEO4J_USER", "neo4j")
        password = os.environ.get("NEO4J_PASSWORD")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({
                    "configured": False,
                    "message": "Neo4j credentials not set"
                }),
                status=200,
                headers={"Content-Type": "application/json"}
            )

        verification = verify_schema(uri, user, password)

        return https_fn.Response(
            json.dumps({
                "configured": True,
                "connected": verification.get("success", False),
                "schema": verification
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({
                "configured": True,
                "connected": False,
                "error": str(e)
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# GRAPHRAG ENDPOINTS (Hello History Pattern)
# =============================================================================

def get_graphrag_service():
    """Get GraphRAG service with credentials from environment"""
    return GraphRAGService(
        uri=os.environ.get("NEO4J_URI"),
        user=os.environ.get("NEO4J_USER", "neo4j"),
        password=os.environ.get("NEO4J_PASSWORD")
    )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_context(req: https_fn.Request) -> https_fn.Response:
    """
    Get comprehensive GraphRAG context for RAG augmentation.

    Combines topic-based, entity-based, and theme-based retrieval
    into structured context for LLM prompt injection.

    POST body:
    {
        "topics": ["loyalty", "leadership"],
        "entities": ["Nancy Reagan", "Gorbachev"],
        "profileId": "historical_ronald_reagan",
        "maxChunks": 5,
        "includeTimeline": true,
        "includeConnections": true
    }

    Returns:
    {
        "context": {
            "chunks": [...],
            "entities_mentioned": [...],
            "themes_found": [...],
            "timeline": [...],
            "connections": [...],
            "summary": "..."
        },
        "formatted": "... formatted string for prompt injection ..."
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

        topics = data.get("topics", [])
        entities = data.get("entities", [])
        profile_id = data.get("profileId")
        max_chunks = data.get("maxChunks", 5)

        if not topics and not entities:
            return https_fn.Response(
                json.dumps({"error": "Must provide at least one topic or entity"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()

        # Get comprehensive RAG context
        context = service.get_rag_context(
            query_topics=topics,
            query_entities=entities,
            profile_id=profile_id,
            max_chunks=max_chunks
        )

        # Format for prompt injection
        formatted = service.format_context_for_prompt(context)

        service.close()

        return https_fn.Response(
            json.dumps({
                "context": {
                    "chunks": context.chunks,
                    "entities_mentioned": context.entities_mentioned,
                    "themes_found": context.themes_found,
                    "timeline": context.timeline if data.get("includeTimeline", True) else [],
                    "connections": context.connections if data.get("includeConnections", True) else [],
                    "summary": context.summary
                },
                "formatted": formatted
            }),
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
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_topic_context(req: https_fn.Request) -> https_fn.Response:
    """
    Get chunks discussing a specific topic.

    POST body:
    {
        "topic": "leadership",
        "profileId": "historical_ronald_reagan",
        "limit": 5
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
        topic = data.get("topic")

        if not topic:
            return https_fn.Response(
                json.dumps({"error": "topic is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        results = service.get_topic_context(
            topic_name=topic,
            profile_id=data.get("profileId"),
            limit=data.get("limit", 5)
        )
        service.close()

        return https_fn.Response(
            json.dumps({"results": results}),
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
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_entity_connections(req: https_fn.Request) -> https_fn.Response:
    """
    Find all profiles that mention a specific entity.

    Example: "Who mentions Nancy Reagan?"

    POST body:
    {
        "entity": "Nancy Reagan",
        "limit": 10
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
        entity = data.get("entity")

        if not entity:
            return https_fn.Response(
                json.dumps({"error": "entity is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        results = service.find_entity_connections(
            entity_name=entity,
            limit=data.get("limit", 10)
        )
        service.close()

        return https_fn.Response(
            json.dumps({"connections": results}),
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
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_sentiment_patterns(req: https_fn.Request) -> https_fn.Response:
    """
    Analyze sentiment patterns for a profile.

    Example: "What does Reagan say when angry?" or
             "How does Reagan feel about Gorbachev?"

    POST body:
    {
        "profileId": "historical_ronald_reagan",
        "entity": "Gorbachev"  // Optional
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
        profile_id = data.get("profileId")

        if not profile_id:
            return https_fn.Response(
                json.dumps({"error": "profileId is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        patterns = service.find_sentiment_patterns(
            profile_id=profile_id,
            entity_name=data.get("entity")
        )
        service.close()

        return https_fn.Response(
            json.dumps({"patterns": patterns}),
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
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_shared_themes(req: https_fn.Request) -> https_fn.Response:
    """
    Find constitutional themes shared between two profiles.

    Useful for couple compatibility analysis.

    POST body:
    {
        "profileId1": "historical_ronald_reagan",
        "profileId2": "historical_nancy_reagan"
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
        profile_id_1 = data.get("profileId1")
        profile_id_2 = data.get("profileId2")

        if not profile_id_1 or not profile_id_2:
            return https_fn.Response(
                json.dumps({"error": "profileId1 and profileId2 are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        themes = service.find_shared_themes(profile_id_1, profile_id_2)
        service.close()

        return https_fn.Response(
            json.dumps(themes),
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
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def graphrag_timeline(req: https_fn.Request) -> https_fn.Response:
    """
    Get chronological mentions of a topic.

    Useful for: "How did Reagan's view on communism evolve?"

    POST body:
    {
        "topic": "communism",
        "profileId": "historical_ronald_reagan"
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
        topic = data.get("topic")

        if not topic:
            return https_fn.Response(
                json.dumps({"error": "topic is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        service = get_graphrag_service()
        timeline = service.get_topic_timeline(
            topic_name=topic,
            profile_id=data.get("profileId")
        )
        service.close()

        return https_fn.Response(
            json.dumps({"timeline": timeline}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# LUNA FUSION ENDPOINTS (P4-P8 Personality Cathedral)
# =============================================================================

# Import Luna Fusion modules
try:
    from luna_fusion.core.fusion_engine import (
        fuse_to_30_facets, get_luna_personality,
        adapt_luna_to_user, generate_complete_profile
    )
    from luna_fusion.sources.aspects import (
        calculate_natal_aspects, aspects_to_30_facets, detect_aspect_patterns
    )
    from luna_fusion.transits.transits_engine import (
        calculate_transit_aspects, transits_to_30_facets,
        get_active_transits, get_transit_forecast
    )
    from luna_fusion.synastry.synastry_engine import (
        compute_synastry_fusion, generate_insights, get_behavioral_adjustments
    )
    from luna_fusion.synastry.composite_engine import (
        calculate_composite_chart, composite_to_30_facets, get_composite_interpretation
    )
    from luna_fusion.archetypes.archetype_engine import (
        vector_to_archetypes, get_dominant_archetypes, get_archetype_profile
    )
    from luna_fusion.archetypes.narrative_templates import (
        generate_full_narrative, get_archetype_question_prompts
    )
    from luna_fusion.progressions.progressions_engine import (
        calculate_progressions, progressions_to_30_facets, get_progression_interpretation
    )
    from luna_fusion.core.constants import LUNA_PRESETS, ACCURACY_TIERS
    LUNA_FUSION_AVAILABLE = True
except ImportError as e:
    LUNA_FUSION_AVAILABLE = False
    LUNA_FUSION_ERROR = str(e)


def _numpy_to_list(obj):
    """Convert numpy arrays to lists for JSON serialization"""
    import numpy as np
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: _numpy_to_list(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_numpy_to_list(item) for item in obj]
    return obj


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def luna_fusion(req: https_fn.Request) -> https_fn.Response:
    """
    Main Luna Fusion endpoint - fuse all sources to 30-facet personality vector

    POST body:
    {
        "sources": {
            "big5": { "N1": 0.6, "N2": 0.4, ... },
            "mbti": { "type": "INFJ" },
            "enneagram": { "type": 4, "wing": 5, "health_level": 4 },
            "natal": { "sun": { "sign": "Taurus" }, ... },
            "bazi": { "day_master": { "element": "Wood" }, ... },
            "numerology": { "life_path": 7, "expression": 3 },
            "aspects": [ ... natal aspects ... ]
        },
        "birthData": {
            "year": 1990, "month": 5, "day": 15,
            "hour": 14, "minute": 30, "timezone_offset": -5
        },
        "includeDynamic": true,
        "targetDate": "2024-01-15T00:00:00"
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": f"Luna Fusion not available: {LUNA_FUSION_ERROR}"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Parse target date if provided
        target_date = None
        if data.get("targetDate"):
            target_date = datetime.fromisoformat(data["targetDate"].replace("Z", "+00:00"))

        # Run fusion
        result = fuse_to_30_facets(
            sources=data.get("sources", {}),
            birth_data=data.get("birthData"),
            include_dynamic=data.get("includeDynamic", True),
            target_date=target_date
        )

        return https_fn.Response(
            json.dumps(_numpy_to_list(result)),
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
def luna_complete_profile(req: https_fn.Request) -> https_fn.Response:
    """
    Generate complete user profile with all analyses

    POST body:
    {
        "sources": { ... },
        "birthData": { ... },
        "lunaPreset": "Nurturing Guide"
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        result = generate_complete_profile(
            sources=data.get("sources", {}),
            birth_data=data.get("birthData", {}),
            luna_preset=data.get("lunaPreset", "Nurturing Guide")
        )

        return https_fn.Response(
            json.dumps(_numpy_to_list(result)),
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
def luna_natal_aspects(req: https_fn.Request) -> https_fn.Response:
    """
    P4: Calculate natal aspects and their personality impact

    POST body:
    {
        "natalPositions": {
            "Sun": { "longitude": 45.5, "sign": "Taurus" },
            "Moon": { "longitude": 120.3, "sign": "Cancer" },
            ...
        },
        "includePatterns": true
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        natal_positions = data.get("natalPositions", {})

        # Calculate aspects
        aspects = calculate_natal_aspects(natal_positions)

        # Detect patterns if requested
        patterns = []
        if data.get("includePatterns", True):
            patterns = detect_aspect_patterns(aspects, natal_positions)

        # Convert to 30-facet vector
        vector = aspects_to_30_facets(aspects, include_patterns=data.get("includePatterns", True))

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "aspects": aspects,
                "patterns": patterns,
                "facetVector": vector,
                "aspectCount": len(aspects)
            })),
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
def luna_transits(req: https_fn.Request) -> https_fn.Response:
    """
    P5: Calculate current transits and their temporary personality effects

    POST body:
    {
        "natalPositions": { ... },
        "forecastDays": 30
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        natal_positions = data.get("natalPositions", {})

        # Get active transits
        active = get_active_transits(natal_positions)

        # Get transit aspects
        transit_aspects = calculate_transit_aspects(natal_positions)

        # Convert to facet vector
        vector = transits_to_30_facets(transit_aspects)

        # Optional forecast
        forecast = []
        if data.get("forecastDays", 0) > 0:
            forecast = get_transit_forecast(natal_positions, data["forecastDays"])

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "activeTransits": active,
                "transitAspects": transit_aspects,
                "facetVector": vector,
                "forecast": forecast
            })),
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
def luna_synastry_fusion(req: https_fn.Request) -> https_fn.Response:
    """
    P6: Calculate synastry compatibility between two users

    POST body:
    {
        "user1Vector": [ ... 30 facets ... ],
        "user2Vector": [ ... 30 facets ... ],
        "includeInsights": true
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        import numpy as np

        user1_vector = np.array(data.get("user1Vector", [0.5] * 30))
        user2_vector = np.array(data.get("user2Vector", [0.5] * 30))

        # Compute synastry
        synastry = compute_synastry_fusion(user1_vector, user2_vector)

        # Generate insights if requested
        insights = {}
        if data.get("includeInsights", True):
            insights = generate_insights(user1_vector, user2_vector, synastry)

        # Get behavioral adjustments (how Luna should adapt)
        from luna_fusion.core.vector_utils import create_zero_vector
        luna_base = create_zero_vector() + 0.5
        adjustments = get_behavioral_adjustments(user1_vector, luna_base)

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "synastry": synastry,
                "insights": insights,
                "behavioralAdjustments": adjustments
            })),
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
def luna_composite_chart(req: https_fn.Request) -> https_fn.Response:
    """
    P6: Calculate composite chart (relationship personality)

    POST body:
    {
        "user1Birth": { "year": 1990, "month": 5, "day": 15, ... },
        "user2Birth": { "year": 1988, "month": 8, "day": 22, ... }
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Calculate composite
        composite = calculate_composite_chart(
            data.get("user1Birth", {}),
            data.get("user2Birth", {})
        )

        # Get relationship vector
        relationship_vector = composite_to_30_facets(composite)

        # Get interpretation
        interpretation = get_composite_interpretation(composite, relationship_vector)

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "compositeChart": composite,
                "relationshipVector": relationship_vector,
                "interpretation": interpretation
            })),
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
def luna_composite_transits(req: https_fn.Request) -> https_fn.Response:
    """
    P6b: Calculate transits to composite chart — relationship weather forecast.

    Uses Swiss Ephemeris for precise planetary positions across a 12-month
    scan window. Returns transit events, mythic story beats, and seasonal
    narrative chapters.

    POST body:
    {
        "compositeLongitudes": {
            "Sun": 45.2, "Moon": 123.5, "Mercury": 52.1,
            "Venus": 38.7, "Mars": 215.3, "Jupiter": 156.8,
            "Saturn": 298.2, "Uranus": 27.9, "Neptune": 352.1, "Pluto": 301.5
        },
        "months": 12
    }

    Response:
    {
        "events": [ { "date", "label", "impact", ... } ],
        "storyBeats": [ { "date", "label", "chamber", "direction", "narrative" } ],
        "seasonalChapters": [ { "season", "theme", "summary", "events" } ],
        "summary": { "totalEvents", "opensCount", "testsCount", "seasonCount", "dominantChamber" }
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        composite_longitudes = data.get("compositeLongitudes", {})

        if not composite_longitudes:
            return https_fn.Response(
                json.dumps({"error": "compositeLongitudes is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        months = data.get("months", 12)
        months = max(1, min(months, 24))  # Clamp to 1-24

        from luna_fusion.transits.composite_transits import build_composite_transit_story
        result = build_composite_transit_story(composite_longitudes, months=months)

        return https_fn.Response(
            json.dumps(result),
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
def luna_archetypes(req: https_fn.Request) -> https_fn.Response:
    """
    P7: Map personality vector to Jungian archetypes

    POST body:
    {
        "personalityVector": [ ... 30 facets ... ],
        "topN": 3,
        "includeNarrative": true
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        import numpy as np

        vector = np.array(data.get("personalityVector", [0.5] * 30))
        top_n = data.get("topN", 3)

        # Get archetype profile
        profile = get_archetype_profile(vector)

        # Get dominant archetypes
        dominant = get_dominant_archetypes(vector, top_n=top_n)

        # Generate narrative if requested
        narrative = {}
        if data.get("includeNarrative", True):
            narrative = generate_full_narrative(dominant)

        # Get question prompts for exploration
        primary_archetype = dominant[0]['archetype'] if dominant else 'Hero'
        prompts = get_archetype_question_prompts(primary_archetype)

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "profile": profile,
                "dominantArchetypes": dominant,
                "narrative": narrative,
                "explorationPrompts": prompts
            })),
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
def luna_progressions(req: https_fn.Request) -> https_fn.Response:
    """
    P8: Calculate secondary progressions and progressed Moon

    POST body:
    {
        "birthData": {
            "year": 1990, "month": 5, "day": 15,
            "hour": 14, "minute": 30, "timezone_offset": -5
        },
        "targetDate": "2024-01-15T00:00:00"
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Parse target date
        target_date = None
        if data.get("targetDate"):
            target_date = datetime.fromisoformat(data["targetDate"].replace("Z", "+00:00"))

        # Calculate progressions
        progressions = calculate_progressions(
            data.get("birthData", {}),
            target_date
        )

        # Convert to facet vector
        vector = progressions_to_30_facets(progressions)

        # Get interpretation
        interpretation = get_progression_interpretation(progressions, vector)

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "progressions": progressions,
                "facetVector": vector,
                "interpretation": interpretation
            })),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# RAG DATABASE MIGRATION ENDPOINT
# =============================================================================

# Define Cloud SQL secrets - TEMPORARILY COMMENTED OUT until PG_PASSWORD secret is set
# PG_PASSWORD_SECRET = SecretParam("PG_PASSWORD")


# TEMPORARILY COMMENTED OUT - set PG_PASSWORD secret first: firebase functions:secrets:set PG_PASSWORD
# @https_fn.on_request(
#     cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
#     memory=options.MemoryOption.MB_512,
#     timeout_sec=120,
#     secrets=[PG_PASSWORD_SECRET]
# )
def _run_rag_migration_disabled(req: https_fn.Request) -> https_fn.Response:
    """
    Run RAG database migration - creates biography_chunks table with pgvector.
    Run once after setting up Cloud SQL.

    POST body:
    {
        "adminKey": "your-admin-key"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json() or {}

        # Admin key check
        admin_key = os.environ.get("ADMIN_KEY", "genesis-admin-2024")
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Import pg8000 and sqlalchemy
        try:
            import pg8000
            import sqlalchemy
            from sqlalchemy import text
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Database libraries not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get connection params
        db_user = os.environ.get("PG_USER", "postgres")
        db_pass = os.environ.get("PG_PASSWORD", "")
        db_name = os.environ.get("PG_DATABASE", "genesis_memory")
        instance_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")

        if not instance_connection_name:
            return https_fn.Response(
                json.dumps({"error": "CLOUD_SQL_CONNECTION_NAME not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        unix_socket_path = f"/cloudsql/{instance_connection_name}"

        # Create connection
        pool = sqlalchemy.create_engine(
            sqlalchemy.engine.url.URL.create(
                drivername="postgresql+pg8000",
                username=db_user,
                password=db_pass,
                database=db_name,
                query={"unix_sock": f"{unix_socket_path}/.s.PGSQL.5432"}
            ),
            pool_size=1,
            max_overflow=0
        )

        # Migration SQL
        migration_sql = """
        -- Enable pgvector extension
        CREATE EXTENSION IF NOT EXISTS vector;

        -- Biography chunks table for RAG
        CREATE TABLE IF NOT EXISTS biography_chunks (
            id SERIAL PRIMARY KEY,
            chunk_hash VARCHAR(64) UNIQUE,
            profile_id VARCHAR(255) NOT NULL,
            profile_name VARCHAR(255),
            chunk_index INTEGER DEFAULT 0,
            content TEXT NOT NULL,
            topics TEXT[],
            sentiment VARCHAR(50),
            entities TEXT[],
            constitutional_themes TEXT[],
            relationship_dynamics TEXT[],
            metadata JSONB,
            embedding vector(1536),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_profile_id ON biography_chunks(profile_id);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
        CREATE INDEX IF NOT EXISTS idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);

        -- Update timestamp trigger
        CREATE OR REPLACE FUNCTION update_biography_chunks_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_biography_chunks_timestamp ON biography_chunks;
        CREATE TRIGGER trigger_update_biography_chunks_timestamp
            BEFORE UPDATE ON biography_chunks
            FOR EACH ROW
            EXECUTE FUNCTION update_biography_chunks_timestamp();
        """

        with pool.connect() as conn:
            conn.execute(text(migration_sql))
            conn.commit()

            # Verify
            result = conn.execute(text("""
                SELECT
                    (SELECT COUNT(*) FROM biography_chunks) as row_count,
                    (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'biography_chunks') as index_count
            """))
            row = result.fetchone()

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": "RAG migration completed successfully",
                "table": "biography_chunks",
                "rows": row[0] if row else 0,
                "indexes": row[1] if row else 0
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# BIOGRAPHY INGESTION ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=300,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_biography(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest biography text into Neo4j for GraphRAG.

    POST body:
    {
        "profileId": "historical_ronald_reagan",
        "profileName": "Ronald Reagan",
        "text": "Ronald Wilson Reagan was the 40th President...",
        "context": "Ronald Reagan, 40th President of the United States"
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
        if not data.get("profileId") or not data.get("text"):
            return https_fn.Response(
                json.dumps({"error": "profileId and text are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Import ingester
        try:
            from ingestion.biography_ingester import BiographyIngester
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Biography ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize ingester with Neo4j credentials from environment
        ingester = BiographyIngester(
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            openai_api_key=os.environ.get("OPENAI_API_KEY")
        )

        # Run ingestion
        from dataclasses import asdict
        result = ingester.ingest_text(
            text=data["text"],
            profile_id=data["profileId"],
            profile_name=data.get("profileName", data["profileId"]),
            profile_context=data.get("context"),
            source_file="api_ingestion"
        )

        ingester.close()

        return https_fn.Response(
            json.dumps(asdict(result)),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=300,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_sample_reagan(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest a sample Ronald Reagan biography for testing GraphRAG.

    POST body:
    {
        "adminKey": "your-admin-key"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json() or {}

        # Admin key check
        admin_key = os.environ.get("ADMIN_KEY", "genesis-admin-2024")
        if data.get("adminKey") != admin_key:
            return https_fn.Response(
                json.dumps({"error": "Unauthorized"}),
                status=401,
                headers={"Content-Type": "application/json"}
            )

        # Sample Reagan biography for testing
        REAGAN_SAMPLE_TEXT = """
Ronald Wilson Reagan was the 40th President of the United States, serving from 1981 to 1989.
Born on February 6, 1911, in Tampico, Illinois, Reagan's journey from small-town America to
the White House is a quintessential American success story.

Before entering politics, Reagan had a successful career in Hollywood, appearing in over 50 films.
His experience as an actor gave him exceptional communication skills, earning him the nickname
"The Great Communicator." His ability to connect with the American public was unparalleled.

Reagan married Nancy Davis in 1952, and their partnership became one of the most devoted
marriages in presidential history. Nancy was fiercely protective of her husband, serving as
his closest advisor and confidante. Their bond was described as "a love affair that lasted
a lifetime."

During his presidency, Reagan faced numerous challenges, including the Cold War with the Soviet Union.
His leadership style emphasized optimism, American exceptionalism, and a strong stance against
communism. He famously challenged Soviet leader Mikhail Gorbachev to "tear down this wall"
at the Berlin Wall in 1987.

The assassination attempt on March 30, 1981, tested both Reagan's resilience and the Reagans'
marriage. Nancy's devotion during his recovery became legendary, and she never left his side
during his hospital stay. Reagan's humor in the face of danger - telling Nancy "Honey, I forgot
to duck" - revealed his character and their intimate partnership.

Reagan's economic policies, known as "Reaganomics," focused on tax cuts, deregulation, and
reduced government spending. While controversial, these policies shaped American economic
policy for decades.

In his later years, Reagan was diagnosed with Alzheimer's disease. He disclosed his diagnosis
in a handwritten letter to the American people in 1994, displaying the same grace that had
defined his public life. Nancy became his devoted caregiver until his death on June 5, 2004.

Their love story endures as a testament to partnership, loyalty, and devotion. As Nancy
once said, "My life really began when I married my husband."
"""

        # Import ingester
        try:
            from ingestion.biography_ingester import BiographyIngester
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Biography ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Initialize ingester
        ingester = BiographyIngester(
            neo4j_uri=os.environ.get("NEO4J_URI"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD"),
            openai_api_key=os.environ.get("OPENAI_API_KEY")
        )

        # Run ingestion
        from dataclasses import asdict
        result = ingester.ingest_text(
            text=REAGAN_SAMPLE_TEXT,
            profile_id="historical_ronald_reagan",
            profile_name="Ronald Reagan",
            profile_context="Ronald Reagan, 40th President of the United States, married to Nancy Reagan",
            source_file="sample_test"
        )

        ingester.close()

        return https_fn.Response(
            json.dumps({
                **asdict(result),
                "message": "Sample Reagan biography ingested successfully"
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# DIARY INGESTION ENDPOINTS (Reagan Diaries ePub)
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_diary_epub(req: https_fn.Request) -> https_fn.Response:
    """
    Ingest a diary ePub file (e.g., The Reagan Diaries) into Neo4j.

    Creates DiaryEntry nodes with relationships:
    - (Person)-[:WROTE]->(DiaryEntry)
    - (DiaryEntry)-[:ON_DATE]->(Date)
    - (DiaryEntry)-[:MENTIONS]->(Person)
    - (DiaryEntry)-[:DISCUSSES]->(Topic)

    NOW WITH PERSPECTIVE LABELS (Rashomon Effect Prevention):
    - SELF: Subject's own words (Reagan Diaries)
    - SPOUSE: Nancy Reagan memoirs
    - INNER_CIRCLE: Don Regan, staff memoirs
    - ALLY: Thatcher, allied memoirs
    - ADVERSARY: Gorbachev, Soviet accounts
    - JOURNALIST: News reporting
    - HISTORIAN: Academic analysis

    POST body (multipart/form-data):
    - file: ePub file
    - authorName: "Ronald Reagan" (default)
    - sourceTitle: "The Reagan Diaries" (default)
    - perspective: "SELF" (default) - SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    - perspectiveSubject: "ronald_reagan" (default) - who the content is ABOUT

    OR POST body (JSON):
    {
        "epubBase64": "base64 encoded epub",
        "authorName": "Ronald Reagan",
        "sourceTitle": "The Reagan Diaries",
        "perspective": "SELF",
        "perspectiveSubject": "ronald_reagan"
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        # Import diary ingester
        try:
            from ingestion.diary_ingester import DiaryIngester
            from neo4j import GraphDatabase
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Diary ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")
        openai_api_key = os.environ.get("OPENAI_API_KEY")

        if not neo4j_uri or not neo4j_password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j credentials not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Create Neo4j driver
        driver = GraphDatabase.driver(
            neo4j_uri,
            auth=(os.environ.get("NEO4J_USER", "neo4j"), neo4j_password)
        )

        # Determine content type and extract epub bytes
        content_type = req.content_type or ""
        epub_bytes = None
        author_name = "Ronald Reagan"
        source_title = "The Reagan Diaries"
        # Perspective fields (Rashomon Effect prevention)
        perspective = "SELF"
        perspective_subject = "ronald_reagan"

        if "multipart" in content_type:
            # Handle file upload
            files = req.files
            if "file" not in files:
                return https_fn.Response(
                    json.dumps({"error": "No file uploaded. Use 'file' field."}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            epub_bytes = files["file"].read()
            author_name = req.form.get("authorName", author_name)
            source_title = req.form.get("sourceTitle", source_title)
            perspective = req.form.get("perspective", perspective)
            perspective_subject = req.form.get("perspectiveSubject", perspective_subject)
        else:
            # Handle JSON with base64 encoded epub
            data = req.get_json()
            if not data or "epubBase64" not in data:
                return https_fn.Response(
                    json.dumps({"error": "Must provide 'epubBase64' field or upload file"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            import base64
            epub_bytes = base64.b64decode(data["epubBase64"])
            author_name = data.get("authorName", author_name)
            source_title = data.get("sourceTitle", source_title)
            perspective = data.get("perspective", perspective)
            perspective_subject = data.get("perspectiveSubject", perspective_subject)

        # Create ingester and process with perspective
        ingester = DiaryIngester(driver, openai_api_key)
        result = ingester.ingest_epub_bytes(
            epub_bytes=epub_bytes,
            author_name=author_name,
            source_title=source_title,
            perspective=perspective,
            perspective_subject=perspective_subject
        )

        driver.close()

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": f"Diary ingestion complete: {result['entries_stored']}/{result['entries_parsed']} entries",
                **result
            }),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.GB_2,
    timeout_sec=540,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET, OPENAI_API_KEY_SECRET]
)
def ingest_diary_complete(req: https_fn.Request) -> https_fn.Response:
    """
    Complete multi-database ingestion: ePub → Firebase + pgvector + Neo4j

    This is the ONE endpoint to call for full Reagan Diaries ingestion.
    Stores chunks in all three databases simultaneously.

    NOW WITH PERSPECTIVE LABELS (Rashomon Effect Prevention):
    - SELF: Subject's own words (Reagan Diaries) - reliability 1.0
    - SPOUSE: Nancy Reagan memoirs - reliability 0.9
    - INNER_CIRCLE: Don Regan, staff memoirs - reliability 0.7
    - ALLY: Thatcher, allied memoirs - reliability 0.6
    - ADVERSARY: Gorbachev, Soviet accounts - reliability 0.5
    - JOURNALIST: News reporting - reliability 0.5
    - HISTORIAN: Academic analysis - reliability 0.6

    POST body (multipart/form-data):
    - file: ePub file
    - authorName: "Ronald Reagan" (default)
    - sourceTitle: "The Reagan Diaries" (default)
    - profileId: "historical_ronald_reagan" (default)
    - perspective: "SELF" (default) - SELF, SPOUSE, INNER_CIRCLE, ALLY, ADVERSARY, JOURNALIST, HISTORIAN
    - perspectiveSubject: "ronald_reagan" (default) - who the content is ABOUT

    OR POST body (JSON):
    {
        "epubBase64": "base64 encoded epub",
        "authorName": "Ronald Reagan",
        "sourceTitle": "The Reagan Diaries",
        "profileId": "historical_ronald_reagan",
        "perspective": "SELF",
        "perspectiveSubject": "ronald_reagan"
    }

    Returns:
    {
        "parsing": {"entries_found": 1000, "total_words": 150000, "perspective": "SELF"},
        "chunking": {"chunks_created": 2500, "overlap_enabled": true},
        "ingestion": {
            "firebase": {"success": 2500, "errors": []},
            "postgres": {"success": 2500, "errors": []},
            "neo4j": {"success": 2500, "errors": []}
        },
        "perspective": "SELF",
        "reliability_weight": 1.0
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        # Import multi-database ingester
        try:
            from ingestion.multi_database_ingester import (
                IngestionConfig,
                ingest_reagan_diaries_complete
            )
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Multi-DB ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Get credentials from environment
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")
        openai_api_key = os.environ.get("OPENAI_API_KEY")

        # Extract ePub and parameters
        content_type = req.content_type or ""
        epub_bytes = None
        author_name = "Ronald Reagan"
        source_title = "The Reagan Diaries"
        profile_id = "historical_ronald_reagan"
        # Perspective fields (Rashomon Effect prevention)
        perspective = "SELF"
        perspective_subject = "ronald_reagan"

        if "multipart" in content_type:
            files = req.files
            if "file" not in files:
                return https_fn.Response(
                    json.dumps({"error": "No file uploaded. Use 'file' field."}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            epub_bytes = files["file"].read()
            author_name = req.form.get("authorName", author_name)
            source_title = req.form.get("sourceTitle", source_title)
            profile_id = req.form.get("profileId", profile_id)
            perspective = req.form.get("perspective", perspective)
            perspective_subject = req.form.get("perspectiveSubject", perspective_subject)
        else:
            data = req.get_json()
            if not data or "epubBase64" not in data:
                return https_fn.Response(
                    json.dumps({"error": "Must provide 'epubBase64' field or upload file"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            import base64
            epub_bytes = base64.b64decode(data["epubBase64"])
            author_name = data.get("authorName", author_name)
            source_title = data.get("sourceTitle", source_title)
            profile_id = data.get("profileId", profile_id)
            perspective = data.get("perspective", perspective)
            perspective_subject = data.get("perspectiveSubject", perspective_subject)

        # Create config for multi-database ingestion with perspective
        config = IngestionConfig(
            # Firebase - uses default app credentials
            profile_id=profile_id,
            firestore_collection="profiles",
            firestore_subcollection="b2_memories",

            # PostgreSQL - optional (may not be configured)
            postgres_conn_string=os.environ.get("DATABASE_URL"),

            # Neo4j
            neo4j_uri=neo4j_uri,
            neo4j_password=neo4j_password,

            # OpenAI for embeddings
            openai_api_key=openai_api_key,

            # Processing
            batch_size=50,
            generate_embeddings=bool(openai_api_key),

            # Perspective (Rashomon Effect prevention)
            perspective=perspective,
            perspective_subject=perspective_subject,
            source_author=author_name,
            source_title=source_title
        )

        # Run complete pipeline with perspective
        results = ingest_reagan_diaries_complete(
            epub_path_or_bytes=epub_bytes,
            config=config,
            author_name=author_name,
            source_title=source_title,
            perspective=perspective,
            perspective_subject=perspective_subject
        )

        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": f"Multi-DB ingestion complete: {results['chunking']['chunks_created']} chunks to 3 databases",
                **results
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        import traceback
        return https_fn.Response(
            json.dumps({
                "error": str(e),
                "traceback": traceback.format_exc()
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def query_diary_entries(req: https_fn.Request) -> https_fn.Response:
    """
    Query diary entries from Neo4j.

    POST body:
    {
        "queryType": "by_date_range" | "by_person" | "by_topic" | "statistics",
        "startDate": "1981-01-01",  // for by_date_range
        "endDate": "1981-12-31",    // for by_date_range
        "personName": "Nancy Reagan", // for by_person
        "topic": "cold_war",         // for by_topic
        "authorName": "Ronald Reagan" // for statistics
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        # Import query helpers
        try:
            from ingestion.diary_ingester import (
                get_entries_by_date_range,
                get_entries_mentioning_person,
                get_entries_by_topic,
                get_diary_statistics
            )
            from neo4j import GraphDatabase
        except ImportError as e:
            return https_fn.Response(
                json.dumps({"error": f"Diary ingester not available: {e}"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        query_type = data.get("queryType", "statistics")

        # Get Neo4j driver
        neo4j_uri = os.environ.get("NEO4J_URI")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")

        driver = GraphDatabase.driver(
            neo4j_uri,
            auth=(os.environ.get("NEO4J_USER", "neo4j"), neo4j_password)
        )

        result = {}

        if query_type == "by_date_range":
            if not data.get("startDate") or not data.get("endDate"):
                return https_fn.Response(
                    json.dumps({"error": "startDate and endDate required for by_date_range"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_by_date_range(
                    driver,
                    data["startDate"],
                    data["endDate"]
                )
            }

        elif query_type == "by_person":
            if not data.get("personName"):
                return https_fn.Response(
                    json.dumps({"error": "personName required for by_person"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_mentioning_person(driver, data["personName"])
            }

        elif query_type == "by_topic":
            if not data.get("topic"):
                return https_fn.Response(
                    json.dumps({"error": "topic required for by_topic"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )
            result = {
                "entries": get_entries_by_topic(driver, data["topic"])
            }

        elif query_type == "statistics":
            result = get_diary_statistics(
                driver,
                data.get("authorName", "Ronald Reagan")
            )

        else:
            return https_fn.Response(
                json.dumps({"error": f"Unknown queryType: {query_type}"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        driver.close()

        return https_fn.Response(
            json.dumps(result),
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
def luna_personality(req: https_fn.Request) -> https_fn.Response:
    """
    Get Luna's personality configuration (presets + user tweaks)

    POST body:
    {
        "preset": "Nurturing Guide",
        "tweaks": {
            "warmth": 0.8,
            "directness": 0.5,
            "playfulness": 0.6,
            "depth": 0.7,
            "challenge": 0.4
        },
        "userVector": [ ... 30 facets ... ]  // Optional: adapt to user
    }
    """
    if not LUNA_FUSION_AVAILABLE:
        return https_fn.Response(
            json.dumps({"error": "Luna Fusion not available"}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Get base Luna personality
        luna_config = get_luna_personality(
            preset_name=data.get("preset", "Nurturing Guide"),
            user_tweaks=data.get("tweaks")
        )

        # Adapt to specific user if vector provided
        if data.get("userVector"):
            import numpy as np
            user_vector = np.array(data["userVector"])
            luna_config = adapt_luna_to_user(
                luna_config,
                user_vector,
                adaptation_strength=data.get("adaptationStrength", 0.3)
            )

        # Include available presets
        presets_info = {
            name: {
                "description": preset["description"],
                "tone_adjustments": preset["tone_adjustments"]
            }
            for name, preset in LUNA_PRESETS.items()
        }

        return https_fn.Response(
            json.dumps(_numpy_to_list({
                "lunaPersonality": luna_config,
                "availablePresets": presets_info,
                "accuracyTiers": ACCURACY_TIERS
            })),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# BIOGRAPHIC EXTRACTION ENDPOINTS (Brain 1B → Brain 2 Consolidation)
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=120,
    secrets=[ANTHROPIC_API_KEY_SECRET, NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def extract_biographic_data(req: https_fn.Request) -> https_fn.Response:
    """
    Extract biographic data from conversation text using LLM.

    This is the real-time extraction endpoint for AI SoulPartner.
    Called after each meaningful exchange to capture Life Events,
    People, Emotions, Values, and Speech Nuances.

    POST body:
    {
        "userId": "firebase-uid",
        "profileId": "astroprofile-id",
        "conversationText": "USER: I arrived in Austin in 1982...\nAI: That sounds...",
        "source": "text_chat",  // or "voice_chat"
        "sessionId": "optional-session-id",
        "storeToFirestore": true,  // Whether to persist to Brain 2
        "ingestToNeo4j": false     // Whether to add to Knowledge Graph
    }

    Returns:
    {
        "success": true,
        "extraction": {
            "events": [...],
            "people": [...],
            "emotions": [...],
            "values": [...],
            "nuances": {...}
        },
        "stored": true,
        "graphIngested": false
    }
    """
    if not BIOGRAPHER_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Biographer not available",
                "details": BIOGRAPHER_ERROR
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        if not data.get("conversationText"):
            return https_fn.Response(
                json.dumps({"error": "conversationText is required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        user_id = data.get("userId", "anonymous")
        profile_id = data.get("profileId", "default")
        conversation_text = data["conversationText"]
        source = data.get("source", "text_chat")
        session_id = data.get("sessionId", datetime.utcnow().strftime("%Y%m%d_%H%M%S"))
        store_to_firestore = data.get("storeToFirestore", True)
        ingest_to_neo4j = data.get("ingestToNeo4j", False)

        # Run the async extraction
        import asyncio

        async def run_extraction():
            extractor = BiographicExtractor()
            return await extractor.extract(conversation_text, source)

        # Run async in sync context
        extraction = asyncio.run(run_extraction())

        # Prepare response
        result = {
            "success": True,
            "extraction": {
                "events": [
                    {
                        "description": e.description,
                        "year": e.year,
                        "location": e.location,
                        "significance": e.significance
                    } for e in extraction.events
                ],
                "people": [
                    {
                        "name": p.name,
                        "relationship_type": p.relationship_type,
                        "sentiment": p.sentiment
                    } for p in extraction.people
                ],
                "emotions": [
                    {
                        "emotion": em.emotion,
                        "intensity": em.intensity,
                        "triggers": em.triggers
                    } for em in extraction.emotions
                ],
                "values": [
                    {
                        "value": v.value,
                        "strength": v.strength,
                        "evidence": v.evidence
                    } for v in extraction.values
                ],
                "nuances": {
                    "catchphrases": extraction.nuances.catchphrases if extraction.nuances else [],
                    "tone": extraction.nuances.tone if extraction.nuances else "",
                    "communication_style": extraction.nuances.communication_style if extraction.nuances else "",
                    "turn_taking_rhythm": extraction.nuances.turn_taking_rhythm if extraction.nuances else ""
                } if extraction.nuances else None,
                "raw_insights": extraction.raw_insights
            },
            "stored": False,
            "graphIngested": False
        }

        # Store to Firestore (Brain 2 - LTM Profile)
        if store_to_firestore and (extraction.events or extraction.people):
            try:
                db = firestore.client()
                doc_ref = db.collection('profiles').document(profile_id)\
                           .collection('brain2_biography').document(session_id)

                from dataclasses import asdict
                doc_ref.set({
                    'extracted_data': {
                        'events': [asdict(e) for e in extraction.events],
                        'people': [asdict(p) for p in extraction.people],
                        'emotions': [asdict(em) for em in extraction.emotions],
                        'values': [asdict(v) for v in extraction.values],
                        'nuances': asdict(extraction.nuances) if extraction.nuances else None,
                        'raw_insights': extraction.raw_insights
                    },
                    'source_session': session_id,
                    'source_type': source,
                    'timestamp': datetime.utcnow().isoformat()
                })
                result["stored"] = True

                # Also store as b1b_learned facts for immediate availability
                if extraction.events or extraction.people:
                    partner_id = "soulpartner_luna"
                    fact_ref = db.collection('profiles').document(profile_id)\
                                 .collection('b1b_learned').document(partner_id)

                    new_facts = []
                    for event in extraction.events:
                        new_facts.append({
                            "fact": event.description,
                            "learned_at": datetime.utcnow().isoformat(),
                            "source": "biographic_extraction",
                            "context_tags": [event.location, str(event.year)] if event.location or event.year else [],
                            "significance": event.significance
                        })

                    for person in extraction.people:
                        new_facts.append({
                            "fact": f"User has a {person.relationship_type} named {person.name}",
                            "learned_at": datetime.utcnow().isoformat(),
                            "source": "biographic_extraction",
                            "context_tags": [person.relationship_type],
                            "sentiment": person.sentiment
                        })

                    if new_facts:
                        # Get existing and append
                        existing_doc = fact_ref.get()
                        existing_facts = existing_doc.to_dict().get('learned_facts', []) if existing_doc.exists else []
                        fact_ref.set({
                            "learned_facts": existing_facts + new_facts,
                            "last_updated": datetime.utcnow().isoformat()
                        }, merge=True)

            except Exception as fs_error:
                result["firestoreError"] = str(fs_error)

        # Ingest to Neo4j (Knowledge Graph)
        if ingest_to_neo4j and (extraction.events or extraction.people):
            try:
                neo4j_service = get_neo4j_service()
                graph_stats = ingest_into_graph(
                    user_id, profile_id, extraction, neo4j_service.driver
                )
                neo4j_service.close()
                result["graphIngested"] = True
                result["graphStats"] = graph_stats
            except Exception as neo4j_error:
                result["neo4jError"] = str(neo4j_error)

        return https_fn.Response(
            json.dumps(result),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=300,  # 5 minutes for batch consolidation
    secrets=[ANTHROPIC_API_KEY_SECRET, NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def consolidate_session(req: https_fn.Request) -> https_fn.Response:
    """
    Nightly Consolidation - Batch process a full session.

    Extracts biographic data from a complete conversation session,
    stores in Firestore Brain 2 (LTM), and ingests into Neo4j.

    POST body:
    {
        "userId": "firebase-uid",
        "profileId": "astroprofile-id",
        "sessionId": "conversation-session-id",
        "conversationText": "Full conversation text...",
        "source": "text_chat"
    }
    """
    if not BIOGRAPHER_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Biographer not available",
                "details": BIOGRAPHER_ERROR
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        user_id = data.get("userId")
        profile_id = data.get("profileId")
        session_id = data.get("sessionId")
        conversation_text = data.get("conversationText")
        source = data.get("source", "text_chat")

        if not all([user_id, profile_id, session_id, conversation_text]):
            return https_fn.Response(
                json.dumps({"error": "userId, profileId, sessionId, and conversationText are required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Get services
        db = firestore.client()
        neo4j_driver = None
        try:
            neo4j_service = get_neo4j_service()
            neo4j_driver = neo4j_service.driver
        except:
            pass  # Continue without Neo4j if not configured

        # Run consolidation
        import asyncio

        async def run_consolidation():
            return await consolidate_memory(
                user_id=user_id,
                profile_id=profile_id,
                session_id=session_id,
                conversation_text=conversation_text,
                source=source,
                db=db,
                neo4j_driver=neo4j_driver
            )

        result = asyncio.run(run_consolidation())

        # Cleanup
        if neo4j_driver:
            try:
                neo4j_service.close()
            except:
                pass

        return https_fn.Response(
            json.dumps(result),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# NEO4J GRAPH SEEDING ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=120,  # 2 minutes for seeding
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def seed_reagan_universe(req: https_fn.Request) -> https_fn.Response:
    """
    Pre-seed the Reagan Universe in Neo4j.

    Creates the invariant nodes and relationships:
    - Core people (Ronald, Nancy, Staff, Advisors, World Leaders)
    - Relationship dynamics (The Nancy Protocol basis)
    - Sacred locations (Library, Ranch, Air Force One)
    - Historical events (Summits, Speeches)
    - Astrological calendar rules (Joan Quigley)

    POST body (optional):
    {
        "verify_only": false  // If true, only verify existing data
    }
    """
    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json() or {}
        verify_only = data.get("verify_only", False)

        # Import genesis graph functions
        from scripts.genesis_graph import pre_seed_reagan_universe, verify_universe
        from neo4j import GraphDatabase

        # Get Neo4j credentials from secrets
        uri = os.environ.get("NEO4J_URI")
        password = os.environ.get("NEO4J_PASSWORD")
        user = os.environ.get("NEO4J_USER", "neo4j")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({
                    "error": "Neo4j credentials not configured",
                    "message": "Set NEO4J_URI and NEO4J_PASSWORD secrets"
                }),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # Connect to Neo4j
        driver = GraphDatabase.driver(uri, auth=(user, password))

        try:
            if verify_only:
                # Just verify existing data
                verification = verify_universe(driver)
                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "action": "verify",
                        "verification": verification
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
            else:
                # Seed the universe
                results = pre_seed_reagan_universe(driver)
                verification = verify_universe(driver)

                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "action": "seed",
                        "seeding_results": results,
                        "verification": verification
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
        finally:
            driver.close()

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=30,
    secrets=[NEO4J_URI_SECRET, NEO4J_PASSWORD_SECRET]
)
def query_person_relationships(req: https_fn.Request) -> https_fn.Response:
    """
    Query relationships for a person in the Reagan Universe graph.

    GET/POST with query param or body:
    ?person_id=historical_joan_quigley
    or {"person_id": "historical_joan_quigley"}
    """
    try:
        from neo4j import GraphDatabase

        # Get person_id from query params or body
        person_id = req.args.get("person_id")
        if not person_id and req.method == "POST":
            data = req.get_json() or {}
            person_id = data.get("person_id")

        if not person_id:
            return https_fn.Response(
                json.dumps({"error": "person_id required"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Get Neo4j credentials
        uri = os.environ.get("NEO4J_URI")
        password = os.environ.get("NEO4J_PASSWORD")
        user = os.environ.get("NEO4J_USER", "neo4j")

        if not uri or not password:
            return https_fn.Response(
                json.dumps({"error": "Neo4j not configured"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        driver = GraphDatabase.driver(uri, auth=(user, password))

        try:
            with driver.session() as session:
                # Query outgoing relationships
                outgoing = session.run("""
                    MATCH (p:Person {id: $person_id})-[r]->(target)
                    RETURN type(r) as relationship_type,
                           properties(r) as relationship_props,
                           labels(target) as target_labels,
                           target.id as target_id,
                           target.name as target_name
                """, person_id=person_id)

                outgoing_rels = [dict(record) for record in outgoing]

                # Query incoming relationships
                incoming = session.run("""
                    MATCH (source)-[r]->(p:Person {id: $person_id})
                    RETURN type(r) as relationship_type,
                           properties(r) as relationship_props,
                           labels(source) as source_labels,
                           source.id as source_id,
                           source.name as source_name
                """, person_id=person_id)

                incoming_rels = [dict(record) for record in incoming]

                # Get person info
                person_result = session.run("""
                    MATCH (p:Person {id: $person_id})
                    RETURN p.name as name, p.role as role, properties(p) as props
                """, person_id=person_id)

                person_record = person_result.single()
                person_info = dict(person_record) if person_record else None

                return https_fn.Response(
                    json.dumps({
                        "success": True,
                        "person_id": person_id,
                        "person": person_info,
                        "outgoing_relationships": outgoing_rels,
                        "incoming_relationships": incoming_rels
                    }),
                    status=200,
                    headers={"Content-Type": "application/json"}
                )
        finally:
            driver.close()

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )


# =============================================================================
# WESTERN CUSP ENGINE ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.MB_512,
    timeout_sec=60
)
def calculate_western_expression_vector(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate 72-dimensional Western Expression Vector from natal chart data.

    POST body:
    {
        "birthDate": "1990-05-15",
        "birthTime": "14:30",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timezone": "America/New_York",
        "planetPositions": [
            {"planet": "Sun", "longitude": 54.23, "sign": "Taurus", "house": 10},
            ...
        ]
    }

    Returns:
    {
        "success": true,
        "westernChart": { ... full chart analysis ... },
        "expressionVector": { ... 72-dim vector ... },
        "explainability": { L0, L1, L2, L3 explanations }
    }
    """
    if not WESTERN_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Western Engine not available",
                "details": WESTERN_ENGINE_ERROR
            }),
            status=503,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        if not data:
            return https_fn.Response(
                json.dumps({"error": "No JSON body provided"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Extract parameters
        birth_date = data.get("birthDate")
        birth_time = data.get("birthTime", "12:00")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        timezone = data.get("timezone", "UTC")
        planet_positions = data.get("planetPositions", [])
        explain_level = data.get("explainLevel", "L1")

        if not birth_date or latitude is None or longitude is None:
            return https_fn.Response(
                json.dumps({
                    "error": "Missing required fields",
                    "required": ["birthDate", "latitude", "longitude"]
                }),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Parse birth datetime
        birth_datetime = datetime.strptime(f"{birth_date} {birth_time}", "%Y-%m-%d %H:%M")

        # Calculate Western chart
        western_chart = analyze_western(
            birth_datetime=birth_datetime,
            latitude=float(latitude),
            longitude=float(longitude),
            timezone=timezone,
            planet_positions=planet_positions
        )

        # Generate explainability
        explanations = explain_western_chart(western_chart, level=explain_level)

        # Convert to dict for JSON serialization
        chart_dict = {
            "planets": [
                {
                    "planet": p.planet,
                    "longitude": p.longitude,
                    "sign": p.sign,
                    "house": p.house,
                    "retrograde": p.retrograde
                }
                for p in western_chart.planets
            ],
            "houses": {
                "system": western_chart.houses.system,
                "cusps": list(western_chart.houses.cusps),
                "ascendant": western_chart.houses.ascendant,
                "midheaven": western_chart.houses.midheaven
            },
            "aspects": [
                {
                    "planet1": a.planet1,
                    "planet2": a.planet2,
                    "aspectType": a.aspect_type,
                    "orb": a.orb,
                    "strength": a.strength
                }
                for a in western_chart.aspects
            ],
            "aspectPatterns": [
                {
                    "patternType": p.pattern_type,
                    "planets": p.planets,
                    "strength": p.strength
                }
                for p in western_chart.aspect_patterns
            ],
            "chartShape": {
                "primaryShape": western_chart.chart_shape.primary_shape,
                "scores": western_chart.chart_shape.scores
            }
        }

        # Expression vector to dict
        vec = western_chart.expression_vector
        vector_dict = {
            "elements": {
                "fire": vec.fire_percent,
                "earth": vec.earth_percent,
                "air": vec.air_percent,
                "water": vec.water_percent
            },
            "modalities": {
                "cardinal": vec.cardinal_percent,
                "fixed": vec.fixed_percent,
                "mutable": vec.mutable_percent
            },
            "houseIntensities": list(vec.house_intensities),
            "planetaryPsychology": {
                "sun": vec.sun_expression,
                "moon": vec.moon_expression,
                "mercury": vec.mercury_expression,
                "venus": vec.venus_expression,
                "mars": vec.mars_expression,
                "jupiter": vec.jupiter_expression,
                "saturn": vec.saturn_expression,
                "uranus": vec.uranus_expression,
                "neptune": vec.neptune_expression,
                "pluto": vec.pluto_expression,
                "northNode": vec.north_node_expression,
                "chiron": vec.chiron_expression,
                "ascendant": vec.ascendant_expression,
                "midheaven": vec.midheaven_expression,
                "vertex": vec.vertex_expression
            },
            "archetypes": {
                "warrior": vec.warrior_archetype,
                "builder": vec.builder_archetype,
                "communicator": vec.communicator_archetype,
                "nurturer": vec.nurturer_archetype,
                "creator": vec.creator_archetype,
                "analyst": vec.analyst_archetype,
                "diplomat": vec.diplomat_archetype,
                "transformer": vec.transformer_archetype,
                "visionary": vec.visionary_archetype
            },
            "aspectPatterns": {
                "grandTrine": vec.grand_trine_strength,
                "tSquare": vec.t_square_strength,
                "grandCross": vec.grand_cross_strength,
                "yod": vec.yod_strength,
                "kite": vec.kite_strength,
                "mysticRectangle": vec.mystic_rectangle_strength,
                "stellium": vec.stellium_strength,
                "aspectDensity": vec.aspect_density
            },
            "dominance": {
                "dominantSign": vec.dominant_sign_strength,
                "dominantPlanet": vec.dominant_planet_strength,
                "dominantElement": vec.dominant_element_strength,
                "dominantModality": vec.dominant_modality_strength,
                "angularPower": vec.angular_power,
                "hemisphereEast": vec.hemisphere_east,
                "hemisphereNorth": vec.hemisphere_north,
                "diurnalNocturnal": vec.diurnal_nocturnal,
                "retrogradeCount": vec.retrograde_count
            },
            "chartShape": {
                "bowl": vec.bowl_score,
                "bucket": vec.bucket_score,
                "locomotive": vec.locomotive_score,
                "bundle": vec.bundle_score,
                "splash": vec.splash_score,
                "seesaw": vec.seesaw_score
            },
            "flatVector": vec.to_vector()
        }

        return https_fn.Response(
            json.dumps({
                "success": True,
                "westernChart": chart_dict,
                "expressionVector": vector_dict,
                "explainability": explanations
            }),
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
def calculate_western_compatibility(req: https_fn.Request) -> https_fn.Response:
    """
    Calculate Western compatibility between two expression vectors.

    POST body:
    {
        "vectorA": { ... expression vector A ... },
        "vectorB": { ... expression vector B ... },
        "includeSynastry": true,
        "chartA": { ... optional chart data for synastry ... },
        "chartB": { ... optional chart data for synastry ... }
    }

    Returns:
    {
        "success": true,
        "compatibility": { total, sections, strengths, challenges },
        "synastry": { ... if includeSynastry ... },
        "explainability": { L0, L1 explanations }
    }
    """
    if not WESTERN_ENGINE_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": "Western Engine not available",
                "details": WESTERN_ENGINE_ERROR
            }),
            status=503,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()
        if not data:
            return https_fn.Response(
                json.dumps({"error": "No JSON body provided"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        vector_a_data = data.get("vectorA")
        vector_b_data = data.get("vectorB")
        include_synastry = data.get("includeSynastry", False)

        if not vector_a_data or not vector_b_data:
            return https_fn.Response(
                json.dumps({
                    "error": "Missing required fields",
                    "required": ["vectorA", "vectorB"]
                }),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # Reconstruct vectors from flat arrays or structured data
        if isinstance(vector_a_data, list):
            # Flat vector provided
            flat_a = vector_a_data
            flat_b = vector_b_data if isinstance(vector_b_data, list) else vector_b_data.get("flatVector", [])
        else:
            flat_a = vector_a_data.get("flatVector", [])
            flat_b = vector_b_data.get("flatVector", [])

        # Calculate cosine similarity
        from western_engine.expression_vector import cosine_similarity, western_compatibility_score

        overall_cosine = cosine_similarity(flat_a, flat_b)
        compatibility_result = western_compatibility_score(flat_a, flat_b)

        # Generate explanations
        explanations = explain_compatibility(compatibility_result)

        result = {
            "success": True,
            "compatibility": {
                "total": compatibility_result.get("total", overall_cosine * 100),
                "vectorCosine": overall_cosine,
                "sections": compatibility_result.get("sections", {}),
                "strengths": compatibility_result.get("strengths", []),
                "challenges": compatibility_result.get("challenges", [])
            },
            "explainability": explanations
        }

        return https_fn.Response(
            json.dumps(result),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=10
)
def western_engine_status(req: https_fn.Request) -> https_fn.Response:
    """Check Western Engine availability and version."""
    return https_fn.Response(
        json.dumps({
            "available": WESTERN_ENGINE_AVAILABLE,
            "error": WESTERN_ENGINE_ERROR if not WESTERN_ENGINE_AVAILABLE else None,
            "version": "1.0.0",
            "vectorDimensions": 72,
            "features": [
                "72-dim Expression Vector",
                "Porphyry House System",
                "Aspect Pattern Detection",
                "Chart Shape Analysis",
                "Synastry",
                "L0-L3 Explainability"
            ] if WESTERN_ENGINE_AVAILABLE else []
        }),
        status=200,
        headers={"Content-Type": "application/json"}
    )


# =============================================================================
# UNIFIED API ENDPOINTS (Phase 1 - Python-First Architecture)
# =============================================================================
# These endpoints use the canonical schema - output stored directly in Firebase,
# read directly by frontend. No transformations.

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"]),
    memory=options.MemoryOption.GB_1,
    timeout_sec=120
)
def compute_unified_profile(req: https_fn.Request) -> https_fn.Response:
    """
    Compute complete profile: BaZi + Western + Vedic + Unified vector.

    This is the main endpoint for the Python-First Architecture.
    Output is canonical schema - store directly in Firebase, read directly in frontend.

    POST body:
    {
        "birth": {
            "birthDate": "1983-07-06",
            "birthTime": "08:40",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "female"
        },
        "profileId": "optional-profile-id",
        "computeOptions": {
            "includeBazi": true,
            "includeWestern": true,
            "includeVedic": true,
            "includeUnified": true
        }
    }

    Returns: ComputedProfileSchema (canonical output - store directly in Firebase)
    """
    if not UNIFIED_API_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": f"Unified API not available: {UNIFIED_API_ERROR}",
                "hint": "Check that api module is properly installed"
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        if "birth" not in data:
            return https_fn.Response(
                json.dumps({"error": "Missing required field: birth"}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        birth_data = data["birth"]
        required = ["birthDate", "birthTime", "latitude", "longitude"]
        for field in required:
            if field not in birth_data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field in birth: {field}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

        # Build request object
        request = ComputeProfileRequest(
            birth=BirthDataInput(
                birthDate=birth_data["birthDate"],
                birthTime=birth_data["birthTime"],
                latitude=birth_data["latitude"],
                longitude=birth_data["longitude"],
                timezone=birth_data.get("timezone", "UTC"),
                gender=birth_data.get("gender", "male")
            ),
            profileId=data.get("profileId"),
            computeOptions=data.get("computeOptions")
        )

        # Compute profile
        result = api_compute_profile(request)

        # Return canonical output with ephemeris diagnostics
        response_data = result.model_dump()
        try:
            from astro.calculator import get_ephe_diagnostics
            response_data['_ephe_diag'] = get_ephe_diagnostics()
            # Direct asteroid test to capture exact errors
            import swisseph as swe
            from astro.calculator import _EPHE_DIR
            if _EPHE_DIR:
                swe.set_ephe_path(_EPHE_DIR)  # re-assert before test
            jd = swe.julday(1911, 2, 6, 10.2667)  # Reagan birth approx
            asteroid_test = {}
            for name, body_id in [('chiron', 15), ('ceres', 17), ('pallas', 18), ('juno', 19), ('vesta', 20)]:
                try:
                    res, flag = swe.calc_ut(jd, body_id, swe.FLG_SPEED)
                    asteroid_test[name] = f"OK lon={res[0]:.4f}"
                except Exception as e:
                    asteroid_test[name] = f"ERROR: {str(e)}"
            response_data['_asteroid_test'] = asteroid_test
        except Exception as ex:
            response_data['_diag_error'] = str(ex)
        return https_fn.Response(
            json.dumps(response_data),
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
    memory=options.MemoryOption.GB_1,
    timeout_sec=180
)
def compute_unified_compatibility(req: https_fn.Request) -> https_fn.Response:
    """
    Compute complete compatibility: BaZi + Western + Unified.

    This endpoint computes compatibility between two birth profiles across
    all systems (BaZi, Western, Unified vector space).

    POST body:
    {
        "profileA": {
            "birthDate": "1983-07-06",
            "birthTime": "08:40",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "female"
        },
        "profileB": {
            "birthDate": "1960-05-25",
            "birthTime": "09:30",
            "latitude": 13.7563,
            "longitude": 100.5018,
            "timezone": "Asia/Bangkok",
            "gender": "male"
        },
        "options": {
            "weights": {
                "bazi": 0.35,
                "western": 0.25,
                "unified": 0.40
            }
        }
    }

    Returns: CompatibilityResultSchema (canonical output)
    """
    if not UNIFIED_API_AVAILABLE:
        return https_fn.Response(
            json.dumps({
                "error": f"Unified API not available: {UNIFIED_API_ERROR}",
                "hint": "Check that api module is properly installed"
            }),
            status=500,
            headers={"Content-Type": "application/json"}
        )

    try:
        if req.method != "POST":
            return https_fn.Response(
                json.dumps({"error": "Method not allowed"}),
                status=405,
                headers={"Content-Type": "application/json"}
            )

        data = req.get_json()

        # Validate required fields
        for profile_key in ["profileA", "profileB"]:
            if profile_key not in data:
                return https_fn.Response(
                    json.dumps({"error": f"Missing required field: {profile_key}"}),
                    status=400,
                    headers={"Content-Type": "application/json"}
                )

            profile_data = data[profile_key]
            required = ["birthDate", "birthTime", "latitude", "longitude"]
            for field in required:
                if field not in profile_data:
                    return https_fn.Response(
                        json.dumps({"error": f"Missing required field in {profile_key}: {field}"}),
                        status=400,
                        headers={"Content-Type": "application/json"}
                    )

        # Build request object
        request = ComputeCompatibilityRequest(
            profileA=BirthDataInput(
                birthDate=data["profileA"]["birthDate"],
                birthTime=data["profileA"]["birthTime"],
                latitude=data["profileA"]["latitude"],
                longitude=data["profileA"]["longitude"],
                timezone=data["profileA"].get("timezone", "UTC"),
                gender=data["profileA"].get("gender", "male")
            ),
            profileB=BirthDataInput(
                birthDate=data["profileB"]["birthDate"],
                birthTime=data["profileB"]["birthTime"],
                latitude=data["profileB"]["latitude"],
                longitude=data["profileB"]["longitude"],
                timezone=data["profileB"].get("timezone", "UTC"),
                gender=data["profileB"].get("gender", "male")
            ),
            options=data.get("options")
        )

        # Compute compatibility
        result = api_compute_compatibility(request)

        # Return canonical output
        return https_fn.Response(
            json.dumps(result.model_dump()),
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
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"]),
    memory=options.MemoryOption.MB_256,
    timeout_sec=10
)
def unified_api_status(req: https_fn.Request) -> https_fn.Response:
    """Check Unified API availability and version."""
    return https_fn.Response(
        json.dumps({
            "available": UNIFIED_API_AVAILABLE,
            "error": UNIFIED_API_ERROR if not UNIFIED_API_AVAILABLE else None,
            "version": "2.0.0",
            "architecture": "Python-First",
            "features": [
                "Canonical Schema (store directly in Firebase)",
                "BaZi Joey Yap Engine",
                "Western Swiss Ephemeris",
                "Vedic Jyotish (Sidereal)",
                "90-dim Unified Vector Space",
                "Unified Compatibility Scoring",
                "Third Chart (Relationship Being)"
            ] if UNIFIED_API_AVAILABLE else [],
            "engines": {
                "bazi": BAZI_ENGINE_AVAILABLE,
                "western": WESTERN_ENGINE_AVAILABLE,
                "synastry": BAZI_SYNASTRY_AVAILABLE
            }
        }),
        status=200,
        headers={"Content-Type": "application/json"}
    )