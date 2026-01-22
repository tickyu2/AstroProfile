"""
western_engine/house_calculator.py

House cusp calculations using Porphyry system (default).

Porphyry is chosen as default because:
1. Simple and deterministic (no trig tables needed)
2. Works at all latitudes
3. Historically significant
4. Good balance between Equal and Placidus
"""

from typing import List, Tuple, Optional
from .models import HouseCusps, PlanetPosition
from .constants import ZODIAC_SIGNS

import math


def normalize_degree(degree: float) -> float:
    """Normalize degree to 0-360 range."""
    return degree % 360


def calculate_porphyry_houses(
    ascendant: float,
    midheaven: float
) -> HouseCusps:
    """
    Calculate house cusps using Porphyry system.

    Porphyry divides each quadrant into three equal parts.

    Args:
        ascendant: Ascendant longitude (0-360)
        midheaven: Midheaven (MC) longitude (0-360)

    Returns:
        HouseCusps with 12 cusp positions
    """
    asc = normalize_degree(ascendant)
    mc = normalize_degree(midheaven)

    # Calculate IC (opposite MC) and Descendant (opposite Asc)
    ic = normalize_degree(mc + 180)
    desc = normalize_degree(asc + 180)

    cusps = [0.0] * 12

    # House 1 = Ascendant
    cusps[0] = asc

    # Calculate quadrant sizes
    # Q1: Asc to IC (houses 1, 2, 3)
    # Q2: IC to Desc (houses 4, 5, 6)
    # Q3: Desc to MC (houses 7, 8, 9)
    # Q4: MC to Asc (houses 10, 11, 12)

    def arc_between(start: float, end: float) -> float:
        """Calculate arc from start to end going counterclockwise."""
        diff = end - start
        if diff < 0:
            diff += 360
        return diff

    # Quadrant 1: Asc → IC (houses 1, 2, 3 → cusp 1, 2, 3)
    q1_arc = arc_between(asc, ic)
    q1_step = q1_arc / 3
    cusps[0] = asc
    cusps[1] = normalize_degree(asc + q1_step)
    cusps[2] = normalize_degree(asc + 2 * q1_step)

    # Quadrant 2: IC → Desc (houses 4, 5, 6 → cusp 4, 5, 6)
    q2_arc = arc_between(ic, desc)
    q2_step = q2_arc / 3
    cusps[3] = ic
    cusps[4] = normalize_degree(ic + q2_step)
    cusps[5] = normalize_degree(ic + 2 * q2_step)

    # Quadrant 3: Desc → MC (houses 7, 8, 9 → cusp 7, 8, 9)
    q3_arc = arc_between(desc, mc)
    q3_step = q3_arc / 3
    cusps[6] = desc
    cusps[7] = normalize_degree(desc + q3_step)
    cusps[8] = normalize_degree(desc + 2 * q3_step)

    # Quadrant 4: MC → Asc (houses 10, 11, 12 → cusp 10, 11, 12)
    q4_arc = arc_between(mc, asc)
    q4_step = q4_arc / 3
    cusps[9] = mc
    cusps[10] = normalize_degree(mc + q4_step)
    cusps[11] = normalize_degree(mc + 2 * q4_step)

    return HouseCusps(
        system="Porphyry",
        cusps=tuple(cusps),
        ascendant=asc,
        midheaven=mc
    )


def calculate_equal_houses(ascendant: float) -> HouseCusps:
    """
    Calculate house cusps using Equal House system.

    Each house is exactly 30 degrees starting from Ascendant.
    """
    asc = normalize_degree(ascendant)
    cusps = [normalize_degree(asc + i * 30) for i in range(12)]

    # MC calculation for equal houses (approximation)
    mc = normalize_degree(asc + 270)  # 9 houses = 270 degrees

    return HouseCusps(
        system="Equal",
        cusps=tuple(cusps),
        ascendant=asc,
        midheaven=mc
    )


def calculate_whole_sign_houses(ascendant: float) -> HouseCusps:
    """
    Calculate house cusps using Whole Sign system.

    Each sign IS a house. House 1 starts at 0 degrees of the Ascendant's sign.
    """
    asc = normalize_degree(ascendant)

    # Find the start of the Ascendant's sign
    asc_sign_idx = int(asc / 30)
    house_1_cusp = asc_sign_idx * 30

    cusps = [normalize_degree(house_1_cusp + i * 30) for i in range(12)]

    # MC approximation
    mc_sign_idx = (asc_sign_idx + 9) % 12
    mc = mc_sign_idx * 30

    return HouseCusps(
        system="Whole Sign",
        cusps=tuple(cusps),
        ascendant=asc,
        midheaven=mc
    )


def get_house_for_degree(longitude: float, houses: HouseCusps) -> int:
    """
    Determine which house a given longitude falls in.

    Args:
        longitude: Planet longitude (0-360)
        houses: HouseCusps object

    Returns:
        House number (1-12)
    """
    long = normalize_degree(longitude)

    for i in range(12):
        next_i = (i + 1) % 12
        cusp_start = houses.cusps[i]
        cusp_end = houses.cusps[next_i]

        # Handle wrap-around at 0/360
        if cusp_start > cusp_end:
            if long >= cusp_start or long < cusp_end:
                return i + 1
        else:
            if cusp_start <= long < cusp_end:
                return i + 1

    return 1  # Fallback


def calculate_house_intensities(
    planets: List[PlanetPosition],
    houses: HouseCusps
) -> Tuple[float, ...]:
    """
    Calculate intensity for each house based on planet placements.

    Args:
        planets: List of planet positions
        houses: House cusps

    Returns:
        Tuple of 12 normalized intensities (0-1 each, sum to 1)
    """
    from .constants import PLANET_WEIGHTS, DIGNITY_MODIFIERS, EXALTATION, DOMICILE, DETRIMENT, DEBILITATION

    intensities = [0.0] * 12

    for planet in planets:
        house = get_house_for_degree(planet.longitude, houses)

        # Get base weight
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)

        # Calculate dignity modifier
        dignity = get_dignity(planet.planet, planet.sign)
        dignity_mod = DIGNITY_MODIFIERS.get(dignity, 1.0)

        intensities[house - 1] += weight * dignity_mod

    # Normalize to sum to 1
    total = sum(intensities)
    if total > 0:
        intensities = [i / total for i in intensities]

    return tuple(intensities)


def get_dignity(planet: str, sign: str) -> str:
    """
    Determine planetary dignity for a planet in a sign.

    Returns: "Exalted", "Domicile", "Detriment", "Debilitated", or "Neutral"
    """
    from .constants import EXALTATION, DOMICILE, DETRIMENT, DEBILITATION

    if EXALTATION.get(planet) == sign:
        return "Exalted"
    if DEBILITATION.get(planet) == sign:
        return "Debilitated"
    if sign in DOMICILE.get(planet, []):
        return "Domicile"
    if sign in DETRIMENT.get(planet, []):
        return "Detriment"
    return "Neutral"


def get_angular_emphasis(
    planets: List[PlanetPosition],
    houses: HouseCusps,
    orb: float = 10.0
) -> dict:
    """
    Calculate emphasis on angular houses (1, 4, 7, 10).

    Planets near angles are more powerful.

    Args:
        planets: Planet positions
        houses: House cusps
        orb: Degrees from exact angle to consider "angular"

    Returns:
        Dict with angular, succedent, cadent weights
    """
    angular = 0.0  # Houses 1, 4, 7, 10
    succedent = 0.0  # Houses 2, 5, 8, 11
    cadent = 0.0  # Houses 3, 6, 9, 12

    angular_houses = [1, 4, 7, 10]
    succedent_houses = [2, 5, 8, 11]

    from .constants import PLANET_WEIGHTS

    for planet in planets:
        house = get_house_for_degree(planet.longitude, houses)
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)

        if house in angular_houses:
            angular += weight
        elif house in succedent_houses:
            succedent += weight
        else:
            cadent += weight

    total = angular + succedent + cadent
    if total > 0:
        angular /= total
        succedent /= total
        cadent /= total

    return {
        "angular": angular,
        "succedent": succedent,
        "cadent": cadent,
        "dominant": "angular" if angular > succedent and angular > cadent
                    else "succedent" if succedent > cadent
                    else "cadent"
    }
