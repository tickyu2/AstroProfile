"""
western_engine/expression_vector.py

Build the complete 72-dimensional Western Expression Vector.

This is the main entry point for Western astrology analysis.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime

from .models import (
    PlanetPosition, HouseCusps, WesternExpressionVector,
    WesternChart, AspectResult, AspectPatternResult, ChartShapeResult,
    create_planet_position
)
from .constants import ZODIAC_SIGNS, PLANET_WEIGHTS
from .house_calculator import (
    calculate_porphyry_houses, calculate_house_intensities, get_angular_emphasis
)
from .aspect_calculator import (
    calculate_aspects, detect_aspect_patterns, calculate_aspect_harmony,
    get_aspect_pattern_vector
)
from .chart_shape_detector import detect_chart_shape, get_chart_shape_vector
from .planetary_psychology import (
    calculate_planetary_psychology,
    calculate_dominant_planet,
    calculate_yang_yin_ratio,
    calculate_element_distribution,
    calculate_modality_distribution,
    calculate_element_purity,
    calculate_modality_purity,
    calculate_retrograde_count,
    calculate_overall_dignity_score,
    calculate_archetype_vector
)


def build_western_expression_vector(
    planets: List[PlanetPosition],
    houses: Optional[HouseCusps] = None,
    aspects: Optional[List[AspectResult]] = None
) -> WesternExpressionVector:
    """
    Build complete 72-dimensional Western Expression Vector.

    Args:
        planets: List of planet positions
        houses: Optional house cusps (will calculate if not provided)
        aspects: Optional pre-calculated aspects

    Returns:
        WesternExpressionVector with all 72 dimensions
    """
    # Calculate houses if not provided
    if houses is None:
        # Use default angles (need ascendant/midheaven from natal chart)
        asc = next((p.longitude for p in planets if p.planet == "Ascendant"), 0)
        mc = next((p.longitude for p in planets if p.planet == "Midheaven"), 270)
        houses = calculate_porphyry_houses(asc, mc)

    # Calculate aspects if not provided
    if aspects is None:
        aspects = calculate_aspects(planets, include_minor=True)

    # 1. Element distribution (4 dims)
    elements = calculate_element_distribution(planets)

    # 2. Modality distribution (3 dims)
    modalities = calculate_modality_distribution(planets)

    # 3. House intensities (12 dims)
    house_intensities = calculate_house_intensities(planets, houses)

    # 4. Planetary psychology (15 dims)
    psychology = calculate_planetary_psychology(planets, houses)

    # 5. Archetypes (9 dims)
    archetypes = calculate_archetype_vector(planets)

    # 6. Aspect patterns (8 dims)
    patterns = detect_aspect_patterns(planets, aspects)
    pattern_vector = get_aspect_pattern_vector(patterns)
    aspect_harmony = calculate_aspect_harmony(aspects)

    # Count specific aspect types for vector
    opposition_count = sum(1 for a in aspects if a.aspect_type == "opposition")
    conjunction_count = sum(1 for a in aspects if a.aspect_type == "conjunction")

    # 7. Dominance metrics (9 dims)
    dominant_planet, dominant_planet_strength = calculate_dominant_planet(planets)

    # Find dominant sign
    sign_counts: Dict[str, float] = {}
    for p in planets:
        weight = PLANET_WEIGHTS.get(p.planet, 0.5)
        sign_counts[p.sign] = sign_counts.get(p.sign, 0) + weight
    dominant_sign = max(sign_counts, key=sign_counts.get) if sign_counts else "Aries"
    dominant_sign_strength = sign_counts.get(dominant_sign, 0) / sum(sign_counts.values()) if sign_counts else 0

    # Find dominant house
    dominant_house_idx = house_intensities.index(max(house_intensities))
    dominant_house_strength = max(house_intensities)

    element_purity = calculate_element_purity(elements)
    modality_purity = calculate_modality_purity(modalities)
    yang_yin_ratio = calculate_yang_yin_ratio(planets)
    retrograde_count = calculate_retrograde_count(planets)
    dignity_score = calculate_overall_dignity_score(planets)

    # Night/day emphasis (simplified - based on Sun position)
    sun_long = next((p.longitude for p in planets if p.planet == "Sun"), 0)
    night_day = 0.5 + (sun_long % 180 - 90) / 180  # Rough approximation

    # 8. Chart shape (6 dims)
    chart_shape = detect_chart_shape(planets)
    shape_vector = get_chart_shape_vector(chart_shape)

    return WesternExpressionVector(
        # Elements
        fire_percent=elements.get("Fire", 0.25),
        earth_percent=elements.get("Earth", 0.25),
        air_percent=elements.get("Air", 0.25),
        water_percent=elements.get("Water", 0.25),

        # Modalities
        cardinal_percent=modalities.get("Cardinal", 0.33),
        fixed_percent=modalities.get("Fixed", 0.33),
        mutable_percent=modalities.get("Mutable", 0.34),

        # Houses
        house_intensities=house_intensities,

        # Planetary Psychology
        sun_expression=psychology.get("sun", 0.5),
        moon_expression=psychology.get("moon", 0.5),
        mercury_expression=psychology.get("mercury", 0.5),
        venus_expression=psychology.get("venus", 0.5),
        mars_expression=psychology.get("mars", 0.5),
        jupiter_expression=psychology.get("jupiter", 0.5),
        saturn_expression=psychology.get("saturn", 0.5),
        uranus_expression=psychology.get("uranus", 0.5),
        neptune_expression=psychology.get("neptune", 0.5),
        pluto_expression=psychology.get("pluto", 0.5),
        ascendant_weight=psychology.get("ascendant", 0.5),
        midheaven_weight=psychology.get("midheaven", 0.5),
        north_node_weight=psychology.get("north_node", 0.5),
        chiron_weight=psychology.get("chiron", 0.5),
        lilith_weight=psychology.get("lilith", 0.5),

        # Archetypes
        warrior_archetype=archetypes.get("warrior", 0.11),
        builder_archetype=archetypes.get("builder", 0.11),
        messenger_archetype=archetypes.get("messenger", 0.11),
        nurturer_archetype=archetypes.get("nurturer", 0.11),
        performer_archetype=archetypes.get("performer", 0.11),
        analyst_archetype=archetypes.get("analyst", 0.11),
        harmonizer_archetype=archetypes.get("harmonizer", 0.11),
        transformer_archetype=archetypes.get("transformer", 0.11),
        philosopher_archetype=archetypes.get("philosopher", 0.12),

        # Aspect Patterns
        grand_trine_strength=pattern_vector.get("grand_trine", 0.0),
        grand_cross_strength=pattern_vector.get("grand_cross", 0.0),
        t_square_strength=pattern_vector.get("t_square", 0.0),
        yod_strength=pattern_vector.get("yod", 0.0),
        stellium_count=pattern_vector.get("stellium_count", 0),
        opposition_tension=min(1.0, opposition_count / 5),
        conjunction_power=min(1.0, conjunction_count / 5),
        aspect_harmony_score=aspect_harmony,

        # Dominance
        dominant_sign_strength=dominant_sign_strength,
        dominant_planet_strength=dominant_planet_strength,
        dominant_house_strength=dominant_house_strength,
        dominant_element_purity=element_purity,
        dominant_modality_purity=modality_purity,
        yang_yin_ratio=yang_yin_ratio,
        night_day_emphasis=night_day,
        retrograde_count=retrograde_count,
        dignity_score=dignity_score,

        # Chart Shape
        bowl_score=shape_vector.get("bowl", 0.0),
        bucket_score=shape_vector.get("bucket", 0.0),
        locomotive_score=shape_vector.get("locomotive", 0.0),
        bundle_score=shape_vector.get("bundle", 0.0),
        splash_score=shape_vector.get("splash", 0.0),
        seesaw_score=shape_vector.get("seesaw", 0.0)
    )


def analyze_western(
    birth_datetime: datetime,
    latitude: float,
    longitude: float,
    timezone: str,
    planet_positions: List[Dict[str, Any]]
) -> WesternChart:
    """
    Main entry point for Western astrology analysis.

    Args:
        birth_datetime: Birth date and time
        latitude: Birth location latitude
        longitude: Birth location longitude
        timezone: Timezone string
        planet_positions: List of dicts with planet positions:
            [{"planet": "Sun", "longitude": 15.5, "retrograde": False}, ...]

    Returns:
        Complete WesternChart with expression vector
    """
    # Convert planet dicts to PlanetPosition objects
    planets = []
    for pos in planet_positions:
        planet = create_planet_position(
            planet=pos["planet"],
            longitude=pos["longitude"],
            retrograde=pos.get("retrograde", False)
        )
        planets.append(planet)

    # Get angles from planet list
    asc = next((p["longitude"] for p in planet_positions if p["planet"] == "Ascendant"), 0)
    mc = next((p["longitude"] for p in planet_positions if p["planet"] == "Midheaven"), 270)

    # Calculate houses
    houses = calculate_porphyry_houses(asc, mc)

    # Assign houses to planets
    planets_with_houses = []
    for planet in planets:
        from .house_calculator import get_house_for_degree
        house = get_house_for_degree(planet.longitude, houses)
        planets_with_houses.append(PlanetPosition(
            planet=planet.planet,
            longitude=planet.longitude,
            sign=planet.sign,
            degree_in_sign=planet.degree_in_sign,
            retrograde=planet.retrograde,
            house=house
        ))

    # Calculate aspects
    aspects = calculate_aspects(planets_with_houses, include_minor=True)

    # Detect patterns
    patterns = detect_aspect_patterns(planets_with_houses, aspects)

    # Detect chart shape
    chart_shape = detect_chart_shape(planets_with_houses)

    # Build expression vector
    expression_vector = build_western_expression_vector(
        planets_with_houses, houses, aspects
    )

    return WesternChart(
        birth_datetime=birth_datetime,
        latitude=latitude,
        longitude=longitude,
        timezone=timezone,
        planets=planets_with_houses,
        houses=houses,
        aspects=aspects,
        aspect_patterns=patterns,
        chart_shape=chart_shape,
        expression_vector=expression_vector
    )


def cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
    """
    Calculate cosine similarity between two vectors.

    Returns value from 0 (opposite) to 1 (identical).
    """
    if len(vector_a) != len(vector_b):
        raise ValueError(f"Vector lengths must match: {len(vector_a)} vs {len(vector_b)}")

    dot = sum(a * b for a, b in zip(vector_a, vector_b))
    norm_a = sum(a * a for a in vector_a) ** 0.5
    norm_b = sum(b * b for b in vector_b) ** 0.5

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot / (norm_a * norm_b)


def western_compatibility_score(
    vector_a: WesternExpressionVector,
    vector_b: WesternExpressionVector
) -> Dict[str, Any]:
    """
    Calculate compatibility score between two Western Expression Vectors.

    Uses weighted cosine similarity across sections.
    """
    from .constants import DEFAULT_SECTION_WEIGHTS

    vec_a = vector_a.to_vector()
    vec_b = vector_b.to_vector()

    # Overall cosine similarity
    overall_cosine = cosine_similarity(vec_a, vec_b)

    # Section-wise similarity (using approximate indices)
    sections = {
        "elements": (0, 4),
        "modalities": (4, 7),
        "houses": (7, 19),
        "planetary": (19, 34),
        "archetypes": (34, 43),
        "aspects": (43, 51),
        "dominance": (51, 60),
        "shape": (60, 66)
    }

    section_scores = {}
    for section, (start, end) in sections.items():
        section_a = vec_a[start:end]
        section_b = vec_b[start:end]
        section_scores[section] = cosine_similarity(section_a, section_b)

    # Weighted total
    weights = DEFAULT_SECTION_WEIGHTS
    weighted_total = sum(
        section_scores[section] * weights.get(section, 0.1)
        for section in section_scores
    )

    return {
        "total": round(weighted_total * 100, 1),
        "vector_cosine": round(overall_cosine, 3),
        "sections": {k: round(v * 100, 1) for k, v in section_scores.items()},
        "vector_a_dims": len(vec_a),
        "vector_b_dims": len(vec_b)
    }
