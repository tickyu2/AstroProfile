"""
western_engine/swiss_adapter.py

Adapter to convert GENESIS Swiss Ephemeris output to RawChart format
for the 16-axis archetype derivation pipeline.

Swiss output format (from swissEphemerisService.js):
- planets: Dict[str, SwissPlanet] - keyed by lowercase name (sun, moon, etc.)
- houses.houses: List[SwissHouse] - 12 houses with cusps
- houses.angles.ascendant: Dict with sign, longitude, etc.
"""

from typing import Dict, List, Tuple, Optional, Any
from .models import PlanetPosition, HouseCusps, RawChart, AspectPatternResult
from .constants import ZODIAC_SIGNS

# =============================================================================
# HOUSE ASSIGNMENT
# =============================================================================

def find_house_for_longitude(longitude: float, house_cusps: List[float]) -> int:
    """
    Given a planet longitude (0-360) and list of 12 house cusps,
    return the house number (1-12).

    Houses can progress either increasing or decreasing through the zodiac
    depending on the house system and latitude.

    Args:
        longitude: Planet longitude (0-360)
        house_cusps: List of 12 cusp longitudes

    Returns:
        House number (1-12)
    """
    if len(house_cusps) < 12:
        return 1

    longitude = longitude % 360

    for i in range(12):
        start = house_cusps[i]
        end = house_cusps[(i + 1) % 12]

        if start <= end:
            # Normal case: house spans increasing degrees
            if start <= longitude < end:
                return i + 1
        else:
            # Wrap around 360°
            if longitude >= start or longitude < end:
                return i + 1

    return 1  # Fallback


def extract_house_cusps(swiss_houses: List[Dict]) -> List[float]:
    """Extract cusp longitudes from Swiss house array."""
    if not swiss_houses:
        return [i * 30.0 for i in range(12)]  # Equal houses fallback

    # Sort by house number and extract cusps
    sorted_houses = sorted(swiss_houses, key=lambda h: h.get('house', 1))
    return [h.get('cusp', i * 30.0) for i, h in enumerate(sorted_houses)]


# =============================================================================
# ASPECT CALCULATION
# =============================================================================

ASPECT_ANGLES = {
    'conjunction': 0,
    'opposition': 180,
    'trine': 120,
    'square': 90,
    'sextile': 60,
    'quincunx': 150,
    'semi-sextile': 30,
    'semi-square': 45,
    'sesquiquadrate': 135,
}

ASPECT_ORBS = {
    'conjunction': 10,
    'opposition': 10,
    'trine': 8,
    'square': 8,
    'sextile': 6,
    'quincunx': 3,
    'semi-sextile': 3,
    'semi-square': 3,
    'sesquiquadrate': 3,
}


def calculate_angle_difference(lon1: float, lon2: float) -> float:
    """Calculate shortest angular difference between two longitudes."""
    diff = abs(lon1 - lon2)
    if diff > 180:
        diff = 360 - diff
    return diff


def calculate_aspects_from_planets(
    planets: Dict[str, Dict]
) -> List[Tuple[str, str, str]]:
    """
    Calculate aspects between planets from Swiss chart data.

    Args:
        planets: Dict of planet data keyed by name (sun, moon, etc.)

    Returns:
        List of (planet1_name, planet2_name, aspect_type) tuples
    """
    aspects = []
    planet_list = list(planets.items())

    for i, (key1, p1) in enumerate(planet_list):
        for key2, p2 in planet_list[i + 1:]:
            lon1 = p1.get('longitude', 0)
            lon2 = p2.get('longitude', 0)

            angle = calculate_angle_difference(lon1, lon2)

            # Check each aspect type
            for aspect_name, target_angle in ASPECT_ANGLES.items():
                orb = abs(angle - target_angle)
                max_orb = ASPECT_ORBS.get(aspect_name, 8)

                # Wider orbs for luminaries
                if key1 in ['sun', 'moon'] or key2 in ['sun', 'moon']:
                    max_orb *= 1.25

                if orb <= max_orb:
                    name1 = p1.get('planet', key1.capitalize())
                    name2 = p2.get('planet', key2.capitalize())
                    aspects.append((name1, name2, aspect_name))
                    break  # Only one aspect per pair

    return aspects


# =============================================================================
# CHART SHAPE DETECTION
# =============================================================================

def detect_chart_shape_from_planets(planets: Dict[str, Dict]) -> str:
    """
    Detect Marc Edmund Jones chart shape from planet longitudes.

    Args:
        planets: Dict of planet data

    Returns:
        Chart shape name: 'Bowl', 'Bucket', 'Locomotive', 'Splash', 'Bundle', 'Seesaw'
    """
    # Get sorted longitudes
    longitudes = sorted([
        p.get('longitude', 0) % 360
        for p in planets.values()
        if p.get('longitude') is not None
    ])

    if len(longitudes) < 5:
        return 'Splash'

    # Calculate gaps between consecutive planets
    gaps = []
    for i in range(len(longitudes)):
        next_idx = (i + 1) % len(longitudes)
        gap = longitudes[next_idx] - longitudes[i]
        if gap < 0:
            gap += 360
        gaps.append((gap, i))

    max_gap, max_gap_idx = max(gaps, key=lambda x: x[0])
    span = 360 - max_gap

    # Classify based on span and gap distribution
    if span <= 120:
        return 'Bundle'
    elif 150 <= span <= 200:
        # Check for handle planet
        second_max_gap = sorted(gaps, key=lambda x: -x[0])[1][0] if len(gaps) > 1 else 0
        if second_max_gap >= 60:
            return 'Bucket'
        return 'Bowl'
    elif 210 <= span <= 270:
        return 'Locomotive'
    elif span >= 300:
        # Check gap distribution for seesaw
        large_gaps = sum(1 for g, _ in gaps if g >= 60)
        if large_gaps >= 2:
            return 'Seesaw'
        return 'Splash'
    else:
        return 'Splash'


# =============================================================================
# ASPECT PATTERN DETECTION
# =============================================================================

def detect_aspect_patterns(
    aspects: List[Tuple[str, str, str]],
    planets: Dict[str, Dict]
) -> List[AspectPatternResult]:
    """
    Detect major aspect patterns from aspect list.

    Returns list of AspectPatternResult for grand trines, T-squares, stelliums, yods.
    """
    patterns = []

    # Build aspect graph
    aspect_graph: Dict[str, Dict[str, str]] = {}
    for p1, p2, aspect_type in aspects:
        if p1 not in aspect_graph:
            aspect_graph[p1] = {}
        if p2 not in aspect_graph:
            aspect_graph[p2] = {}
        aspect_graph[p1][p2] = aspect_type
        aspect_graph[p2][p1] = aspect_type

    # Detect Grand Trines (3 planets in trine to each other)
    planet_names = list(aspect_graph.keys())
    for i, p1 in enumerate(planet_names):
        for j, p2 in enumerate(planet_names[i+1:], i+1):
            for p3 in planet_names[j+1:]:
                if (aspect_graph.get(p1, {}).get(p2) == 'trine' and
                    aspect_graph.get(p2, {}).get(p3) == 'trine' and
                    aspect_graph.get(p1, {}).get(p3) == 'trine'):
                    patterns.append(AspectPatternResult(
                        pattern_type='grand_trine',
                        planets=[p1, p2, p3],
                        strength=0.9,
                        description=f'Grand Trine: {p1}, {p2}, {p3}'
                    ))

    # Detect T-Squares (2 planets in opposition, both square to a third)
    for i, p1 in enumerate(planet_names):
        for p2 in planet_names[i+1:]:
            if aspect_graph.get(p1, {}).get(p2) == 'opposition':
                for p3 in planet_names:
                    if p3 not in (p1, p2):
                        if (aspect_graph.get(p1, {}).get(p3) == 'square' and
                            aspect_graph.get(p2, {}).get(p3) == 'square'):
                            patterns.append(AspectPatternResult(
                                pattern_type='t_square',
                                planets=[p1, p2, p3],
                                strength=0.85,
                                description=f'T-Square: {p1}-{p2} opposition, {p3} apex'
                            ))

    # Detect Stelliums (3+ planets in same sign)
    sign_counts: Dict[str, List[str]] = {}
    for key, p in planets.items():
        sign = p.get('sign', '')
        if sign:
            if sign not in sign_counts:
                sign_counts[sign] = []
            sign_counts[sign].append(p.get('planet', key.capitalize()))

    for sign, planet_list in sign_counts.items():
        if len(planet_list) >= 3:
            patterns.append(AspectPatternResult(
                pattern_type='stellium',
                planets=planet_list,
                strength=0.8,
                description=f'Stellium in {sign}: {", ".join(planet_list)}'
            ))

    # Detect Yods (2 planets in sextile, both quincunx to a third)
    for i, p1 in enumerate(planet_names):
        for p2 in planet_names[i+1:]:
            if aspect_graph.get(p1, {}).get(p2) == 'sextile':
                for p3 in planet_names:
                    if p3 not in (p1, p2):
                        if (aspect_graph.get(p1, {}).get(p3) == 'quincunx' and
                            aspect_graph.get(p2, {}).get(p3) == 'quincunx'):
                            patterns.append(AspectPatternResult(
                                pattern_type='yod',
                                planets=[p1, p2, p3],
                                strength=0.75,
                                description=f'Yod: {p1}-{p2} sextile, {p3} apex'
                            ))

    return patterns


# =============================================================================
# MAIN ADAPTER FUNCTION
# =============================================================================

def swiss_to_raw_chart(swiss_chart: Dict[str, Any]) -> RawChart:
    """
    Convert GENESIS Swiss Ephemeris output to RawChart format.

    Args:
        swiss_chart: Output from calculateFullChart() in swissEphemerisService.js
            {
                planets: { sun: {...}, moon: {...}, ... },
                houses: { houses: [...], angles: {...} },
                elements: {...},
                modalities: {...}
            }

    Returns:
        RawChart ready for derive_western_expression()
    """
    swiss_planets: Dict[str, Dict] = swiss_chart.get('planets', {})
    swiss_houses_data = swiss_chart.get('houses', {})
    swiss_houses: List[Dict] = swiss_houses_data.get('houses', [])
    swiss_angles: Dict = swiss_houses_data.get('angles', {})

    # Extract house cusps
    house_cusps = extract_house_cusps(swiss_houses)

    # Get ASC sign
    asc_sign = swiss_angles.get('ascendant', {}).get('sign', 'Aries')
    if asc_sign not in ZODIAC_SIGNS:
        asc_sign = 'Aries'

    # Convert planets to PlanetPosition list
    planets: List[PlanetPosition] = []
    for key, p in swiss_planets.items():
        sign = p.get('sign', 'Aries')
        if sign not in ZODIAC_SIGNS:
            continue

        longitude = float(p.get('longitude', 0))
        degree_in_sign = longitude % 30
        house = find_house_for_longitude(longitude, house_cusps)
        retrograde = p.get('isRetrograde', False)

        planets.append(PlanetPosition(
            planet=p.get('planet', key.capitalize()),
            longitude=longitude,
            sign=sign,
            degree_in_sign=degree_in_sign,
            retrograde=retrograde,
            house=house
        ))

    # Add Ascendant as a planet position if not present
    asc_data = swiss_angles.get('ascendant', {})
    if asc_data and not any(p.planet == 'Ascendant' for p in planets):
        asc_lon = asc_data.get('longitude', 0)
        planets.append(PlanetPosition(
            planet='Ascendant',
            longitude=asc_lon,
            sign=asc_sign,
            degree_in_sign=asc_lon % 30,
            retrograde=False,
            house=1
        ))

    # Add Midheaven if available
    mc_data = swiss_angles.get('midheaven', {})
    if mc_data and not any(p.planet == 'Midheaven' for p in planets):
        mc_lon = mc_data.get('longitude', 0)
        mc_sign = mc_data.get('sign', 'Aries')
        planets.append(PlanetPosition(
            planet='Midheaven',
            longitude=mc_lon,
            sign=mc_sign if mc_sign in ZODIAC_SIGNS else 'Aries',
            degree_in_sign=mc_lon % 30,
            retrograde=False,
            house=10
        ))

    # Calculate aspects
    aspects = calculate_aspects_from_planets(swiss_planets)

    # Detect chart shape
    chart_shape = detect_chart_shape_from_planets(swiss_planets)

    # Detect aspect patterns
    aspect_patterns = detect_aspect_patterns(aspects, swiss_planets)

    # Build HouseCusps object
    houses = HouseCusps(
        system='Porphyry',
        cusps=tuple(house_cusps),
        ascendant=asc_data.get('longitude', 0),
        midheaven=mc_data.get('longitude', 0)
    )

    return RawChart(
        planets=planets,
        chart_shape=chart_shape,
        aspects=aspects,
        asc_sign=asc_sign,
        houses=houses,
        aspect_patterns=aspect_patterns
    )


def swiss_to_enhanced_expression(swiss_chart: Dict[str, Any]):
    """
    Full pipeline: Swiss → RawChart → EnhancedWesternExpressionVector

    Args:
        swiss_chart: Output from calculateFullChart()

    Returns:
        EnhancedWesternExpressionVector
    """
    from .derive_western_expression import derive_western_expression

    raw = swiss_to_raw_chart(swiss_chart)
    return derive_western_expression(raw)
