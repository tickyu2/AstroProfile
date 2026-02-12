"""
BaZi Joey Yap Engine Endpoints
Four Pillars, DaYun, full chart analysis, and synastry/compatibility.
"""

from firebase_functions import https_fn, options
import json
from datetime import datetime

from routes.shared import (
    verify_auth, error_response,
    ALLOWED_ORIGINS,
    BAZI_ENGINE_AVAILABLE,
    BAZI_ENGINE_ERROR,
    BAZI_SYNASTRY_AVAILABLE,
    BAZI_SYNASTRY_ERROR,
)

if BAZI_ENGINE_AVAILABLE:
    from routes.shared import (
        analyze_bazi,
        four_pillars_from_datetime,
        dayun_for_birth,
        has_sxtwl,
        ELEMENT_MAP,
    )

if BAZI_SYNASTRY_AVAILABLE:
    from routes.shared import (
        compute_bazi_compatibility,
        synastry_matrix,
        synastry_insights,
        explain_synastry_cell,
    )


# =============================================================================
# BAZI JOEY YAP ENGINE ENDPOINTS
# =============================================================================

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
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

        user, err = verify_auth(req)
        if err:
            return err

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
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
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

        user, err = verify_auth(req)
        if err:
            return err

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
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
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

        user, err = verify_auth(req)
        if err:
            return err

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
        return error_response(e)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins=ALLOWED_ORIGINS, cors_methods=["GET", "POST"]),
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

        user, err = verify_auth(req)
        if err:
            return err

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
        return error_response(e)
