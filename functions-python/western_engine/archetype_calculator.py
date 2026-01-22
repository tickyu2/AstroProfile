"""
western_engine/archetype_calculator.py

16-Axis Archetype Calculation System.

Derives chart-level and planet-level archetype vectors using the
mythic psychology space defined in constants.py.
"""

from typing import List, Dict, Optional, Tuple
from .constants import (
    ARCHETYPE_AXES,
    SIGN_ARCHETYPE_VECTORS,
    CUSP_ZONES,
    SIGN_ELEMENT,
    SIGN_MODALITY,
    PLANET_WEIGHTS,
    CUSP_BLEND_DAYS,
    CUSP_BLEND_POWER
)
from .models import PlanetPosition, HouseCusps


def get_sign_archetype(sign: str) -> List[float]:
    """
    Get the 16-dimensional archetype vector for a zodiac sign.

    Args:
        sign: Zodiac sign name

    Returns:
        16-element list of archetype axis values [-1, 1]
    """
    return SIGN_ARCHETYPE_VECTORS.get(sign, [0.0] * 16)


def blend_archetypes(
    primary: str,
    secondary: Optional[str],
    alpha: float = 0.7
) -> List[float]:
    """
    Blend two sign archetypes for cusp calculations.

    Args:
        primary: Primary sign name
        secondary: Secondary sign name (optional)
        alpha: Weight for primary sign (0-1)

    Returns:
        Blended 16-dimensional archetype vector
    """
    base = get_sign_archetype(primary)

    if secondary is None:
        return base[:]

    sec = get_sign_archetype(secondary)
    return [alpha * b + (1 - alpha) * s for b, s in zip(base, sec)]


def calculate_cusp_blend_weight(
    degree_in_sign: float,
    cusp_days: int = CUSP_BLEND_DAYS,
    power: float = CUSP_BLEND_POWER
) -> Tuple[float, Optional[str]]:
    """
    Calculate cusp blending weight based on degree position in sign.

    The 6-6 model: First 6 degrees blend with previous sign,
    last 6 degrees blend with next sign.

    Args:
        degree_in_sign: Degree position within the sign (0-30)
        cusp_days: Number of degrees considered cusp zone
        power: Nonlinear blending exponent

    Returns:
        Tuple of (blend_weight, blend_direction)
        - blend_weight: 0-1, how much to blend
        - blend_direction: 'back', 'forward', or None
    """
    if degree_in_sign < cusp_days:
        # Entering cusp - blend with previous sign
        t = 1 - (degree_in_sign / cusp_days)
        weight = t ** power
        return (weight, 'back')

    elif degree_in_sign > (30 - cusp_days):
        # Exiting cusp - blend with next sign
        t = (degree_in_sign - (30 - cusp_days)) / cusp_days
        weight = t ** power
        return (weight, 'forward')

    return (0.0, None)


def get_adjacent_sign(sign: str, direction: str) -> str:
    """
    Get the adjacent sign in the zodiac wheel.

    Args:
        sign: Current sign name
        direction: 'back' or 'forward'

    Returns:
        Adjacent sign name
    """
    from .constants import ZODIAC_SIGNS

    try:
        idx = ZODIAC_SIGNS.index(sign)
    except ValueError:
        return sign

    if direction == 'back':
        return ZODIAC_SIGNS[(idx - 1) % 12]
    else:  # forward
        return ZODIAC_SIGNS[(idx + 1) % 12]


def calculate_planet_archetype_vector(
    planet: PlanetPosition,
    apply_cusp_blend: bool = True
) -> List[float]:
    """
    Calculate the 16-dimensional archetype vector for a planet placement.

    Includes cusp blending if the planet is near a sign boundary.

    Args:
        planet: Planet position data
        apply_cusp_blend: Whether to apply cusp blending

    Returns:
        16-element archetype vector
    """
    base_archetype = get_sign_archetype(planet.sign)

    if not apply_cusp_blend:
        return base_archetype

    # Calculate degree within sign
    degree_in_sign = planet.longitude % 30

    blend_weight, direction = calculate_cusp_blend_weight(degree_in_sign)

    if blend_weight > 0 and direction:
        adjacent = get_adjacent_sign(planet.sign, direction)
        adjacent_archetype = get_sign_archetype(adjacent)

        # Blend: (1 - weight) * base + weight * adjacent
        blended = [
            (1 - blend_weight) * b + blend_weight * a
            for b, a in zip(base_archetype, adjacent_archetype)
        ]
        return blended

    return base_archetype


def build_planet_full_vector(planet: PlanetPosition) -> List[float]:
    """
    Build complete planet vector including element, modality, house, and archetype.

    Structure: [4 element] + [3 modality] + [12 house] + [16 archetype] = 35 dims

    Args:
        planet: Planet position data

    Returns:
        35-element vector
    """
    # Element one-hot (4 dims)
    element = SIGN_ELEMENT.get(planet.sign, "Fire")
    element_vec = [
        1.0 if e == element else 0.0
        for e in ['Fire', 'Earth', 'Air', 'Water']
    ]

    # Modality one-hot (3 dims)
    modality = SIGN_MODALITY.get(planet.sign, "Cardinal")
    modality_vec = [
        1.0 if m == modality else 0.0
        for m in ['Cardinal', 'Fixed', 'Mutable']
    ]

    # House one-hot (12 dims)
    house_vec = [
        1.0 if i == (planet.house - 1) else 0.0
        for i in range(12)
    ]

    # Archetype vector (16 dims)
    archetype_vec = calculate_planet_archetype_vector(planet)

    return element_vec + modality_vec + house_vec + archetype_vec


def calculate_chart_archetype(
    planets: List[PlanetPosition],
    asc_sign: str,
    weights: Optional[Dict[str, float]] = None
) -> List[float]:
    """
    Calculate the chart-level 16-dimensional archetype vector.

    Combines Sun, Moon, and Ascendant archetypes with optional weighting.

    Args:
        planets: List of planet positions
        asc_sign: Ascendant sign
        weights: Optional planet weights (default: Sun 0.4, Moon 0.3, Asc 0.3)

    Returns:
        16-element chart archetype vector
    """
    if weights is None:
        weights = {'Sun': 0.4, 'Moon': 0.3, 'Ascendant': 0.3}

    vec = [0.0] * len(ARCHETYPE_AXES)
    total_weight = 0.0

    # Add Sun archetype
    sun = next((p for p in planets if p.planet == 'Sun'), None)
    if sun and 'Sun' in weights:
        w = weights['Sun']
        sun_arch = calculate_planet_archetype_vector(sun)
        vec = [x + w * v for x, v in zip(vec, sun_arch)]
        total_weight += w

    # Add Moon archetype
    moon = next((p for p in planets if p.planet == 'Moon'), None)
    if moon and 'Moon' in weights:
        w = weights['Moon']
        moon_arch = calculate_planet_archetype_vector(moon)
        vec = [x + w * v for x, v in zip(vec, moon_arch)]
        total_weight += w

    # Add Ascendant archetype
    if asc_sign and 'Ascendant' in weights:
        w = weights['Ascendant']
        asc_arch = get_sign_archetype(asc_sign)
        vec = [x + w * v for x, v in zip(vec, asc_arch)]
        total_weight += w

    # Add Venus (relational style) with smaller weight
    venus = next((p for p in planets if p.planet == 'Venus'), None)
    if venus:
        w = 0.1
        venus_arch = calculate_planet_archetype_vector(venus)
        vec = [x + w * v for x, v in zip(vec, venus_arch)]
        total_weight += w

    # Add Mars (drive style) with smaller weight
    mars = next((p for p in planets if p.planet == 'Mars'), None)
    if mars:
        w = 0.1
        mars_arch = calculate_planet_archetype_vector(mars)
        vec = [x + w * v for x, v in zip(vec, mars_arch)]
        total_weight += w

    # Normalize
    if total_weight > 0:
        vec = [x / total_weight for x in vec]

    return vec


def calculate_archetype_similarity(
    vec_a: List[float],
    vec_b: List[float]
) -> float:
    """
    Calculate cosine similarity between two archetype vectors.

    Args:
        vec_a: First archetype vector
        vec_b: Second archetype vector

    Returns:
        Cosine similarity [-1, 1]
    """
    import math

    if len(vec_a) != len(vec_b) or len(vec_a) == 0:
        return 0.0

    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot / (norm_a * norm_b)


def get_dominant_archetype_traits(
    archetype_vec: List[float],
    top_n: int = 3
) -> List[Dict[str, any]]:
    """
    Get the most prominent archetype traits from a vector.

    Args:
        archetype_vec: 16-element archetype vector
        top_n: Number of top traits to return

    Returns:
        List of dicts with axis name, value, and interpretation
    """
    if len(archetype_vec) != len(ARCHETYPE_AXES):
        return []

    # Create list of (value, index, axis_name)
    traits = [
        (abs(v), i, ARCHETYPE_AXES[i], v)
        for i, v in enumerate(archetype_vec)
    ]

    # Sort by absolute value descending
    traits.sort(key=lambda x: -x[0])

    results = []
    for abs_val, idx, axis, val in traits[:top_n]:
        # Parse axis name
        parts = axis.split('_vs_')
        if len(parts) == 2:
            positive_pole = parts[0].replace('_', ' ')
            negative_pole = parts[1].replace('_', ' ')

            if val >= 0:
                dominant = positive_pole
                direction = 'high'
            else:
                dominant = negative_pole
                direction = 'high'
        else:
            dominant = axis.replace('_', ' ')
            direction = 'positive' if val >= 0 else 'negative'

        results.append({
            'axis': axis,
            'value': round(val, 2),
            'dominant_pole': dominant,
            'strength': round(abs_val, 2),
            'direction': direction
        })

    return results


def calculate_synastry_receptivity(
    planets: List[PlanetPosition],
    houses: HouseCusps,
    aspects: List = None
) -> float:
    """
    Calculate synastry receptivity score for a chart.

    Higher score indicates easier integration with other charts.

    Args:
        planets: Planet positions
        houses: House cusps
        aspects: List of aspects (optional)

    Returns:
        Receptivity score (0-1)
    """
    score = 0.5  # Start neutral

    # Check 7th house emphasis (partnership)
    seventh_house_planets = sum(
        1 for p in planets
        if p.house == 7
    )
    score += 0.05 * min(seventh_house_planets, 3)

    # Check 11th house emphasis (social)
    eleventh_house_planets = sum(
        1 for p in planets
        if p.house == 11
    )
    score += 0.03 * min(eleventh_house_planets, 3)

    # Check Venus/Jupiter prominence
    venus = next((p for p in planets if p.planet == 'Venus'), None)
    if venus and venus.house in [1, 5, 7, 10]:
        score += 0.1

    jupiter = next((p for p in planets if p.planet == 'Jupiter'), None)
    if jupiter and jupiter.house in [1, 7, 9, 11]:
        score += 0.05

    # Check for 12th house complexity (reduces receptivity slightly)
    twelfth_house_planets = sum(
        1 for p in planets
        if p.house == 12
    )
    score -= 0.03 * min(twelfth_house_planets, 2)

    # Clamp to 0-1
    return max(0.0, min(1.0, score))


def derive_planet_vectors(
    planets: List[PlanetPosition]
) -> Dict[str, List[float]]:
    """
    Derive full vectors for all planets in a chart.

    Args:
        planets: List of planet positions

    Returns:
        Dict mapping planet name to 35-dim vector
    """
    return {
        p.planet: build_planet_full_vector(p)
        for p in planets
    }


def explain_archetype_vector(
    archetype_vec: List[float],
    level: str = 'L1'
) -> Dict[str, any]:
    """
    Generate explanation for an archetype vector.

    Args:
        archetype_vec: 16-element archetype vector
        level: Explanation level (L0, L1, L2, L3)

    Returns:
        Dict with explanations at requested level
    """
    traits = get_dominant_archetype_traits(archetype_vec, top_n=5)

    if level == 'L0':
        # Brief summary
        if traits:
            primary = traits[0]
            return {
                'summary': f"Primary trait: {primary['dominant_pole']} ({primary['strength']:.0%})"
            }
        return {'summary': 'Balanced archetype profile'}

    elif level == 'L1':
        # Key traits
        return {
            'summary': f"{len(traits)} dominant archetype traits",
            'traits': [
                {
                    'name': t['dominant_pole'],
                    'strength': f"{t['strength']:.0%}"
                }
                for t in traits[:3]
            ]
        }

    elif level == 'L2':
        # Detailed breakdown
        return {
            'summary': 'Full 16-axis archetype profile',
            'traits': traits,
            'axis_values': {
                ARCHETYPE_AXES[i]: round(v, 2)
                for i, v in enumerate(archetype_vec)
            }
        }

    else:  # L3
        # Complete technical detail
        return {
            'summary': 'Complete archetype analysis',
            'traits': traits,
            'axis_values': {
                ARCHETYPE_AXES[i]: round(v, 3)
                for i, v in enumerate(archetype_vec)
            },
            'axis_descriptions': {
                axis: {
                    'value': round(archetype_vec[i], 3),
                    'poles': axis.split('_vs_') if '_vs_' in axis else [axis],
                    'dominant': 'positive' if archetype_vec[i] >= 0 else 'negative'
                }
                for i, axis in enumerate(ARCHETYPE_AXES)
            }
        }
