from firebase_functions import https_fn, options
import json
from datetime import datetime
from routes.shared import (
    LUNA_FUSION_AVAILABLE, LUNA_FUSION_ERROR, _numpy_to_list,
    fuse_to_30_facets, get_luna_personality, adapt_luna_to_user, generate_complete_profile,
    _calculate_natal_aspects as calculate_natal_aspects,
    aspects_to_30_facets,
    _detect_aspect_patterns as detect_aspect_patterns,
    calculate_transit_aspects, transits_to_30_facets, get_active_transits, get_transit_forecast,
    compute_synastry_fusion, generate_insights, get_behavioral_adjustments,
    calculate_composite_chart, composite_to_30_facets, get_composite_interpretation,
    get_dominant_archetypes, get_archetype_profile,
    generate_full_narrative, get_archetype_question_prompts,
    calculate_progressions, progressions_to_30_facets, get_progression_interpretation,
    LUNA_PRESETS, ACCURACY_TIERS
)


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
