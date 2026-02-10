"""
Western Cusp Engine endpoints.
Handles Western Expression Vector calculation, compatibility, and engine status.
"""

from firebase_functions import https_fn, options
import json
from datetime import datetime
from routes.shared import (
    WESTERN_ENGINE_AVAILABLE,
    WESTERN_ENGINE_ERROR,
    analyze_western,
    explain_western_chart,
    explain_compatibility,
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
