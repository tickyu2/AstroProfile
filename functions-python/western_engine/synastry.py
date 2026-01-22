"""
western_engine/synastry.py

Synastry analysis between two Western charts.

Synastry examines:
- Cross-aspects (aspects between charts)
- House overlays (one person's planets in another's houses)
- Compatibility based on expression vectors
"""

from typing import List, Dict, Any, Optional, Tuple
from .models import (
    PlanetPosition, HouseCusps, WesternChart, WesternExpressionVector,
    AspectResult, SynastryResult, WesternCompatibilityScore
)
from .house_calculator import get_house_for_degree
from .aspect_calculator import calculate_aspects, angle_between
from .constants import ASPECT_TYPES, ASPECT_ORBS, PLANET_WEIGHTS, SYNASTRY_OVERLAY_MEANINGS


def calculate_cross_aspects(
    planets_a: List[PlanetPosition],
    planets_b: List[PlanetPosition],
    include_minor: bool = False
) -> List[AspectResult]:
    """
    Calculate aspects between planets of two different charts.

    Only major aspects by default for cleaner synastry.
    """
    aspects = []

    for planet_a in planets_a:
        for planet_b in planets_b:
            # Skip if same planet type (Sun-Sun is special, not excluded)
            angle = angle_between(planet_a.longitude, planet_b.longitude)

            for aspect_name, aspect_info in ASPECT_TYPES.items():
                if not include_minor and aspect_info["nature"] == "minor":
                    continue

                exact_angle = aspect_info["angle"]
                base_orb = ASPECT_ORBS[aspect_name]["wide"]  # Use wide orbs for synastry

                orb = abs(angle - exact_angle)
                if aspect_name == "conjunction":
                    orb = angle

                if orb <= base_orb:
                    strength = max(0, 1 - (orb / base_orb))

                    aspects.append(AspectResult(
                        planet1=f"A:{planet_a.planet}",
                        planet2=f"B:{planet_b.planet}",
                        aspect_type=aspect_name,
                        exact_angle=round(angle, 2),
                        orb=round(orb, 2),
                        applying=False,  # Cross-chart aspects don't apply/separate
                        strength=round(strength, 3)
                    ))

    # Sort by strength
    aspects.sort(key=lambda a: -a.strength)
    return aspects


def calculate_house_overlays(
    planets_from: List[PlanetPosition],
    houses_to: HouseCusps,
    label_from: str = "A",
    label_to: str = "B"
) -> List[Dict[str, Any]]:
    """
    Calculate which houses one person's planets fall into in another's chart.

    This shows what areas of life are activated in the relationship.
    """
    overlays = []

    for planet in planets_from:
        house = get_house_for_degree(planet.longitude, houses_to)
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)

        meaning = SYNASTRY_OVERLAY_MEANINGS.get(house, "Connection in this life area.")

        overlays.append({
            "planet": planet.planet,
            "from_person": label_from,
            "into_house": house,
            "of_person": label_to,
            "weight": weight,
            "meaning": meaning,
            "description": f"{label_from}'s {planet.planet} in {label_to}'s {house}th house: {meaning}"
        })

    return overlays


def calculate_synastry(
    chart_a: WesternChart,
    chart_b: WesternChart
) -> SynastryResult:
    """
    Calculate full synastry analysis between two charts.
    """
    # Cross-aspects
    cross_aspects = calculate_cross_aspects(chart_a.planets, chart_b.planets)

    # House overlays
    a_in_b = calculate_house_overlays(chart_a.planets, chart_b.houses, "A", "B")
    b_in_a = calculate_house_overlays(chart_b.planets, chart_a.houses, "B", "A")

    # Calculate aspect harmony
    harmonious = sum(1 for a in cross_aspects if a.is_harmonious)
    challenging = sum(1 for a in cross_aspects if a.is_challenging)
    total_aspects = harmonious + challenging
    aspect_harmony = harmonious / total_aspects if total_aspects > 0 else 0.5

    # Calculate house overlay score
    # Score based on 5th, 7th, 8th house activations (romantic houses)
    romantic_houses = {5, 7, 8}
    romantic_weight = sum(
        o["weight"] for o in (a_in_b + b_in_a)
        if o["into_house"] in romantic_houses
    )
    total_weight = sum(o["weight"] for o in (a_in_b + b_in_a))
    house_overlay_score = romantic_weight / total_weight if total_weight > 0 else 0.3

    # Generate insights
    strengths, challenges, growth = generate_synastry_insights(
        cross_aspects, a_in_b, b_in_a
    )

    return SynastryResult(
        chart_a_id="chart_a",
        chart_b_id="chart_b",
        cross_aspects=cross_aspects,
        a_planets_in_b_houses=a_in_b,
        b_planets_in_a_houses=b_in_a,
        aspect_harmony=round(aspect_harmony, 3),
        house_overlay_score=round(house_overlay_score, 3),
        strengths=strengths,
        challenges=challenges,
        growth_areas=growth
    )


def generate_synastry_insights(
    aspects: List[AspectResult],
    a_in_b: List[Dict],
    b_in_a: List[Dict]
) -> Tuple[List[str], List[str], List[str]]:
    """
    Generate human-readable synastry insights.
    """
    strengths = []
    challenges = []
    growth = []

    # Analyze key aspects
    for aspect in aspects[:10]:  # Top 10 aspects by strength
        p1 = aspect.planet1.replace("A:", "").replace("B:", "")
        p2 = aspect.planet2.replace("A:", "").replace("B:", "")

        if aspect.aspect_type == "conjunction":
            if p1 == p2:
                strengths.append(f"{p1} conjunction: Deep understanding of each other's {p1.lower()} nature.")
            else:
                strengths.append(f"{p1}-{p2} conjunction: Powerful energetic blend.")

        elif aspect.aspect_type == "trine":
            strengths.append(f"{p1}-{p2} trine: Natural flow and support.")

        elif aspect.aspect_type == "opposition":
            challenges.append(f"{p1}-{p2} opposition: Attraction through tension, requires balance.")

        elif aspect.aspect_type == "square":
            growth.append(f"{p1}-{p2} square: Growth through friction, potential for transformation.")

    # Analyze house overlays
    house_counts = {}
    for overlay in (a_in_b + b_in_a):
        house = overlay["into_house"]
        house_counts[house] = house_counts.get(house, 0) + 1

    # Highlight significant houses
    if house_counts.get(7, 0) >= 2:
        strengths.append("Strong 7th house activation: Partnership-oriented connection.")
    if house_counts.get(5, 0) >= 2:
        strengths.append("Strong 5th house activation: Romance and creative play.")
    if house_counts.get(8, 0) >= 2:
        challenges.append("Strong 8th house activation: Deep, transformative, potentially intense.")
    if house_counts.get(12, 0) >= 2:
        growth.append("Strong 12th house activation: Karmic connection, spiritual growth.")

    return strengths[:5], challenges[:3], growth[:3]


def western_compatibility_detailed(
    vector_a: WesternExpressionVector,
    vector_b: WesternExpressionVector,
    synastry: Optional[SynastryResult] = None
) -> WesternCompatibilityScore:
    """
    Calculate detailed Western compatibility score.

    Combines:
    1. Expression vector cosine similarity
    2. Section-wise breakdown
    3. Synastry overlay (if provided)
    """
    from .expression_vector import cosine_similarity
    from .constants import DEFAULT_SECTION_WEIGHTS

    vec_a = vector_a.to_vector()
    vec_b = vector_b.to_vector()

    # Overall cosine
    overall_cosine = cosine_similarity(vec_a, vec_b)

    # Section indices
    sections = {
        "element": (0, 4),
        "modality": (4, 7),
        "house": (7, 19),
        "planetary": (19, 34),
        "archetype": (34, 43),
        "aspect": (43, 51),
        "dominance": (51, 60),
        "shape": (60, 66)
    }

    section_scores = {}
    for name, (start, end) in sections.items():
        sec_a = vec_a[start:end]
        sec_b = vec_b[start:end]
        section_scores[name] = cosine_similarity(sec_a, sec_b)

    # Weighted total
    weights = DEFAULT_SECTION_WEIGHTS
    weighted = sum(section_scores[s] * weights.get(s, 0.1) for s in section_scores)

    # If synastry provided, blend in
    if synastry:
        synastry_weight = 0.2
        synastry_score = (synastry.aspect_harmony + synastry.house_overlay_score) / 2
        weighted = (1 - synastry_weight) * weighted + synastry_weight * synastry_score

    return WesternCompatibilityScore(
        total=round(weighted * 100, 1),
        vector_cosine=round(overall_cosine, 3),
        element_harmony=round(section_scores.get("element", 0.5) * 100, 1),
        modality_score=round(section_scores.get("modality", 0.5) * 100, 1),
        house_overlay=round(section_scores.get("house", 0.5) * 100, 1),
        planetary_interplay=round(section_scores.get("planetary", 0.5) * 100, 1),
        archetype_resonance=round(section_scores.get("archetype", 0.5) * 100, 1),
        aspect_pattern_compat=round(section_scores.get("aspect", 0.5) * 100, 1),
        dominance_alignment=round(section_scores.get("dominance", 0.5) * 100, 1),
        chart_shape_compat=round(section_scores.get("shape", 0.5) * 100, 1),
        vector_a_dims=len(vec_a),
        vector_b_dims=len(vec_b)
    )
