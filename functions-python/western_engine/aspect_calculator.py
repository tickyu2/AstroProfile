"""
western_engine/aspect_calculator.py

Aspect detection and pattern recognition.

Detects:
- Major aspects (conjunction, opposition, trine, square, sextile)
- Minor aspects (quincunx, semi-sextile, etc.)
- Aspect patterns (Grand Trine, T-Square, Grand Cross, Yod, Stellium)
"""

from typing import List, Dict, Optional, Tuple
from .models import PlanetPosition, AspectResult, AspectPatternResult, DetectedAspect, PatternStrengths
from .constants import (
    ASPECT_TYPES, ASPECT_ORBS, PLANET_ORB_ADJUSTMENTS,
    SIGN_ELEMENT, SIGN_MODALITY, PERSONAL_PLANETS
)


# =============================================================================
# PROFESSIONAL ORB-AWARE ASPECT DETECTION (From Longitudes)
# =============================================================================

# Aspect definitions: (name, ideal_angle, default_max_orb)
ASPECT_DEFINITIONS = [
    ('conjunction', 0.0, 8.0),
    ('opposition', 180.0, 8.0),
    ('trine', 120.0, 7.0),
    ('square', 90.0, 7.0),
    ('sextile', 60.0, 5.0),
    ('quincunx', 150.0, 3.0),
    ('semi-sextile', 30.0, 2.0),
    ('semi-square', 45.0, 2.0),
    ('sesquiquadrate', 135.0, 2.0),
]

# Planet orb modifiers (added to base orb)
PLANET_ORB_MODS = {
    'Sun': 1.0,
    'Moon': 1.0,
    'Ascendant': 2.0,
    'Midheaven': 2.0,
    'MC': 2.0,
    'Mercury': 0.0,
    'Venus': 0.0,
    'Mars': 0.0,
    'Jupiter': 0.0,
    'Saturn': 0.0,
    'Uranus': -1.0,
    'Neptune': -1.0,
    'Pluto': -1.0,
    'North Node': -1.0,
    'Chiron': -1.0,
}


def smallest_angle(lon1: float, lon2: float) -> float:
    """Calculate the smallest angle between two longitudes (0-180)."""
    diff = abs(lon1 - lon2) % 360.0
    return diff if diff <= 180.0 else 360.0 - diff


def calc_aspect_tightness(actual_angle: float, ideal_angle: float, max_orb: float) -> Tuple[float, float]:
    """
    Calculate orb error and tightness for an aspect.

    Returns: (orb_error, tightness)
        - orb_error: absolute difference from ideal angle
        - tightness: 0.0-1.0 (1.0 = exact aspect, 0.0 = outside orb)
    """
    orb_error = abs(actual_angle - ideal_angle)
    if orb_error > max_orb:
        return orb_error, 0.0
    return orb_error, 1.0 - (orb_error / max_orb)


def get_effective_max_orb(planet1: str, planet2: str, base_orb: float) -> float:
    """Get effective max orb, adjusted for planet types."""
    mod1 = PLANET_ORB_MODS.get(planet1, 0.0)
    mod2 = PLANET_ORB_MODS.get(planet2, 0.0)
    # Use average of both modifiers
    return max(1.0, base_orb + (mod1 + mod2) / 2)


def detect_aspects_from_longitudes(
    longitudes: Dict[str, float],
    include_minor: bool = False
) -> List[DetectedAspect]:
    """
    Detect all aspects from a dict of planet longitudes.

    This is the professional orb-aware aspect detector that produces
    DetectedAspect objects with full tightness information.

    Args:
        longitudes: Dict mapping planet name to longitude (0-360)
        include_minor: Whether to include minor aspects (semi-sextile, etc.)

    Returns:
        List of DetectedAspect objects, sorted by tightness (tightest first)

    Example:
        >>> longs = {'Sun': 0.0, 'Moon': 120.0, 'Mars': 180.0}
        >>> aspects = detect_aspects_from_longitudes(longs)
        >>> for a in aspects:
        ...     print(f"{a.planet1}-{a.planet2}: {a.aspect_type} ({a.tightness:.2f})")
    """
    names = list(longitudes.keys())
    aspects: List[DetectedAspect] = []

    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            p1, p2 = names[i], names[j]
            angle = smallest_angle(longitudes[p1], longitudes[p2])

            # Find the best matching aspect
            best_aspect: Optional[DetectedAspect] = None

            for aspect_type, ideal_angle, default_orb in ASPECT_DEFINITIONS:
                # Skip minor aspects if not requested
                if not include_minor and aspect_type in ['semi-sextile', 'semi-square', 'sesquiquadrate']:
                    continue

                effective_orb = get_effective_max_orb(p1, p2, default_orb)
                orb_error, tightness = calc_aspect_tightness(angle, ideal_angle, effective_orb)

                if tightness > 0:
                    if best_aspect is None or tightness > best_aspect.tightness:
                        best_aspect = DetectedAspect(
                            planet1=p1,
                            planet2=p2,
                            aspect_type=aspect_type,
                            angle=angle,
                            orb=round(orb_error, 2),
                            tightness=round(tightness, 3),
                        )

            if best_aspect:
                aspects.append(best_aspect)

    # Sort by tightness (tightest first)
    aspects.sort(key=lambda a: -a.tightness)

    return aspects


def calculate_aspects_from_swiss(swiss_planets: Dict[str, dict]) -> List[DetectedAspect]:
    """
    Calculate aspects directly from Swiss Ephemeris planet data.

    Args:
        swiss_planets: Dict from Swiss chart, e.g. {'sun': {'longitude': 45.0, ...}, ...}

    Returns:
        List of DetectedAspect objects
    """
    # Extract longitudes, normalizing planet names
    longitudes = {}
    for key, data in swiss_planets.items():
        lon = data.get('longitude')
        if lon is not None:
            # Normalize name: 'sun' -> 'Sun'
            name = data.get('planet', key.capitalize())
            longitudes[name] = lon

    return detect_aspects_from_longitudes(longitudes)


def normalize_degree(degree: float) -> float:
    """Normalize degree to 0-360 range."""
    return degree % 360


def angle_between(long1: float, long2: float) -> float:
    """
    Calculate the smallest angle between two longitudes.

    Always returns value between 0 and 180.
    """
    diff = abs(long1 - long2)
    if diff > 180:
        diff = 360 - diff
    return diff


def calculate_aspects(
    planets: List[PlanetPosition],
    include_minor: bool = True
) -> List[AspectResult]:
    """
    Calculate all aspects between planets.

    Args:
        planets: List of planet positions
        include_minor: Whether to include minor aspects

    Returns:
        List of detected aspects
    """
    aspects = []

    # Get list of planet names to skip duplicates
    planet_names = [p.planet for p in planets]

    for i, planet1 in enumerate(planets):
        for j, planet2 in enumerate(planets):
            if j <= i:
                continue  # Skip self and already-checked pairs

            # Calculate angle
            angle = angle_between(planet1.longitude, planet2.longitude)

            # Check each aspect type
            for aspect_name, aspect_info in ASPECT_TYPES.items():
                if not include_minor and aspect_info["nature"] == "minor":
                    continue

                exact_angle = aspect_info["angle"]
                max_orb = get_max_orb(aspect_name, planet1.planet, planet2.planet)

                orb = abs(angle - exact_angle)

                # Handle conjunction (0 degrees)
                if aspect_name == "conjunction":
                    orb = angle

                if orb <= max_orb:
                    # Calculate strength based on orb tightness
                    tight_orb = ASPECT_ORBS[aspect_name]["tight"]
                    strength = max(0, 1 - (orb / max_orb))

                    # Determine if applying or separating (simplified)
                    applying = planet1.longitude < planet2.longitude

                    aspects.append(AspectResult(
                        planet1=planet1.planet,
                        planet2=planet2.planet,
                        aspect_type=aspect_name,
                        exact_angle=angle,
                        orb=round(orb, 2),
                        applying=applying,
                        strength=round(strength, 3)
                    ))

    # Sort by strength (tightest aspects first)
    aspects.sort(key=lambda a: -a.strength)

    return aspects


def get_max_orb(aspect_name: str, planet1: str, planet2: str) -> float:
    """
    Get maximum orb for an aspect between two planets.

    Luminaries (Sun, Moon) get wider orbs.
    """
    base_orb = ASPECT_ORBS.get(aspect_name, {}).get("max", 5)

    # Get adjustments for each planet
    adj1 = PLANET_ORB_ADJUSTMENTS.get(planet1, 1.0)
    adj2 = PLANET_ORB_ADJUSTMENTS.get(planet2, 1.0)

    # Average the adjustments
    adjustment = (adj1 + adj2) / 2

    return base_orb * adjustment


def detect_aspect_patterns(
    planets: List[PlanetPosition],
    aspects: List[AspectResult]
) -> List[AspectPatternResult]:
    """
    Detect aspect patterns from a list of aspects.

    Patterns:
    - Grand Trine: Three planets in trine (120°) forming a triangle
    - T-Square: Two planets in opposition with a third in square to both
    - Grand Cross: Four planets in two oppositions forming a cross
    - Yod (Finger of God): Two planets in sextile, both quincunx a third
    - Stellium: 3+ planets in the same sign or house

    Args:
        planets: Planet positions
        aspects: Pre-calculated aspects

    Returns:
        List of detected patterns
    """
    patterns = []

    # Build aspect lookup
    aspect_lookup = build_aspect_lookup(aspects)

    # Detect Grand Trines
    patterns.extend(detect_grand_trines(planets, aspect_lookup))

    # Detect T-Squares
    patterns.extend(detect_t_squares(planets, aspect_lookup))

    # Detect Grand Crosses
    patterns.extend(detect_grand_crosses(planets, aspect_lookup))

    # Detect Yods
    patterns.extend(detect_yods(planets, aspect_lookup))

    # Detect Stelliums
    patterns.extend(detect_stelliums(planets))

    return patterns


def build_aspect_lookup(aspects: List[AspectResult]) -> Dict[str, Dict[str, str]]:
    """
    Build a lookup dictionary for quick aspect checking.

    Returns dict like: {"Sun": {"Moon": "trine", "Mars": "square"}, ...}
    """
    lookup: Dict[str, Dict[str, str]] = {}

    for aspect in aspects:
        if aspect.planet1 not in lookup:
            lookup[aspect.planet1] = {}
        if aspect.planet2 not in lookup:
            lookup[aspect.planet2] = {}

        lookup[aspect.planet1][aspect.planet2] = aspect.aspect_type
        lookup[aspect.planet2][aspect.planet1] = aspect.aspect_type

    return lookup


def detect_grand_trines(
    planets: List[PlanetPosition],
    aspect_lookup: Dict[str, Dict[str, str]]
) -> List[AspectPatternResult]:
    """Detect Grand Trine patterns (3 planets in mutual trines)."""
    patterns = []
    planet_names = [p.planet for p in planets]
    planet_signs = {p.planet: p.sign for p in planets}

    # Check all combinations of 3 planets
    for i in range(len(planet_names)):
        for j in range(i + 1, len(planet_names)):
            for k in range(j + 1, len(planet_names)):
                p1, p2, p3 = planet_names[i], planet_names[j], planet_names[k]

                # Check if all three are in mutual trines
                if (aspect_lookup.get(p1, {}).get(p2) == "trine" and
                    aspect_lookup.get(p2, {}).get(p3) == "trine" and
                    aspect_lookup.get(p1, {}).get(p3) == "trine"):

                    # Determine element
                    elements = [SIGN_ELEMENT.get(planet_signs.get(p, "Aries"), "Fire")
                               for p in [p1, p2, p3]]

                    # Most common element
                    element = max(set(elements), key=elements.count)

                    patterns.append(AspectPatternResult(
                        pattern_type="grand_trine",
                        planets=[p1, p2, p3],
                        element=element,
                        strength=0.9,
                        description=f"Grand Trine in {element} signs"
                    ))

    return patterns


def detect_t_squares(
    planets: List[PlanetPosition],
    aspect_lookup: Dict[str, Dict[str, str]]
) -> List[AspectPatternResult]:
    """Detect T-Square patterns (opposition + squares)."""
    patterns = []
    planet_names = [p.planet for p in planets]
    planet_signs = {p.planet: p.sign for p in planets}

    # Find oppositions first
    for i, p1 in enumerate(planet_names):
        for j, p2 in enumerate(planet_names):
            if j <= i:
                continue

            if aspect_lookup.get(p1, {}).get(p2) == "opposition":
                # Look for a third planet squaring both
                for p3 in planet_names:
                    if p3 in [p1, p2]:
                        continue

                    if (aspect_lookup.get(p1, {}).get(p3) == "square" and
                        aspect_lookup.get(p2, {}).get(p3) == "square"):

                        # Determine modality
                        modalities = [SIGN_MODALITY.get(planet_signs.get(p, "Aries"), "Cardinal")
                                     for p in [p1, p2, p3]]
                        modality = max(set(modalities), key=modalities.count)

                        patterns.append(AspectPatternResult(
                            pattern_type="t_square",
                            planets=[p1, p2, p3],
                            modality=modality,
                            strength=0.85,
                            description=f"T-Square in {modality} signs with {p3} as apex"
                        ))

    return patterns


def detect_grand_crosses(
    planets: List[PlanetPosition],
    aspect_lookup: Dict[str, Dict[str, str]]
) -> List[AspectPatternResult]:
    """Detect Grand Cross patterns (two oppositions forming a cross)."""
    patterns = []
    planet_names = [p.planet for p in planets]
    planet_signs = {p.planet: p.sign for p in planets}

    # Check all combinations of 4 planets
    for i in range(len(planet_names)):
        for j in range(i + 1, len(planet_names)):
            for k in range(j + 1, len(planet_names)):
                for l in range(k + 1, len(planet_names)):
                    p1, p2, p3, p4 = planet_names[i], planet_names[j], planet_names[k], planet_names[l]

                    # Check for two oppositions and four squares
                    aspects_found = []
                    for pa, pb in [(p1, p2), (p1, p3), (p1, p4), (p2, p3), (p2, p4), (p3, p4)]:
                        asp = aspect_lookup.get(pa, {}).get(pb)
                        if asp:
                            aspects_found.append(asp)

                    oppositions = aspects_found.count("opposition")
                    squares = aspects_found.count("square")

                    if oppositions == 2 and squares == 4:
                        modalities = [SIGN_MODALITY.get(planet_signs.get(p, "Aries"), "Cardinal")
                                     for p in [p1, p2, p3, p4]]
                        modality = max(set(modalities), key=modalities.count)

                        patterns.append(AspectPatternResult(
                            pattern_type="grand_cross",
                            planets=[p1, p2, p3, p4],
                            modality=modality,
                            strength=0.95,
                            description=f"Grand Cross in {modality} signs"
                        ))

    return patterns


def detect_yods(
    planets: List[PlanetPosition],
    aspect_lookup: Dict[str, Dict[str, str]]
) -> List[AspectPatternResult]:
    """Detect Yod patterns (Finger of God)."""
    patterns = []
    planet_names = [p.planet for p in planets]

    # Find sextiles first
    for i, p1 in enumerate(planet_names):
        for j, p2 in enumerate(planet_names):
            if j <= i:
                continue

            if aspect_lookup.get(p1, {}).get(p2) == "sextile":
                # Look for a third planet in quincunx to both
                for p3 in planet_names:
                    if p3 in [p1, p2]:
                        continue

                    if (aspect_lookup.get(p1, {}).get(p3) == "quincunx" and
                        aspect_lookup.get(p2, {}).get(p3) == "quincunx"):

                        patterns.append(AspectPatternResult(
                            pattern_type="yod",
                            planets=[p1, p2, p3],
                            strength=0.8,
                            description=f"Yod (Finger of God) with {p3} at apex"
                        ))

    return patterns


def detect_stelliums(planets: List[PlanetPosition]) -> List[AspectPatternResult]:
    """
    Detect Stellium patterns (3+ planets in same sign).

    Traditional definition: 3+ planets in the same sign.
    Modern definition often uses 4+.
    """
    patterns = []

    # Group planets by sign
    sign_groups: Dict[str, List[str]] = {}
    for planet in planets:
        if planet.sign not in sign_groups:
            sign_groups[planet.sign] = []
        sign_groups[planet.sign].append(planet.planet)

    # Find stelliums (3+ planets)
    for sign, planet_list in sign_groups.items():
        if len(planet_list) >= 3:
            patterns.append(AspectPatternResult(
                pattern_type="stellium",
                planets=planet_list,
                element=SIGN_ELEMENT.get(sign, "Fire"),
                strength=min(1.0, 0.7 + len(planet_list) * 0.1),
                description=f"Stellium in {sign} ({len(planet_list)} planets)"
            ))

    return patterns


def calculate_aspect_harmony(aspects: List[AspectResult]) -> float:
    """
    Calculate overall aspect harmony score.

    Harmonious aspects (trine, sextile) increase score.
    Challenging aspects (opposition, square) decrease it.

    Returns: Score from 0 (very challenging) to 1 (very harmonious)
    """
    harmonious = 0.0
    challenging = 0.0

    for aspect in aspects:
        weight = aspect.strength

        if aspect.is_harmonious:
            harmonious += weight
        elif aspect.is_challenging:
            challenging += weight

    total = harmonious + challenging
    if total == 0:
        return 0.5

    # Calculate ratio, biased toward middle
    harmony = harmonious / total
    return 0.3 + (harmony * 0.4)  # Range 0.3 to 0.7


def get_aspect_pattern_vector(patterns: List[AspectPatternResult]) -> Dict[str, float]:
    """
    Extract 8-dimensional aspect pattern vector from patterns.
    """
    vector = {
        "grand_trine": 0.0,
        "grand_cross": 0.0,
        "t_square": 0.0,
        "yod": 0.0,
        "stellium_count": 0,
        "opposition_tension": 0.0,
        "conjunction_power": 0.0,
        "aspect_harmony": 0.5
    }

    for pattern in patterns:
        if pattern.pattern_type == "grand_trine":
            vector["grand_trine"] = max(vector["grand_trine"], pattern.strength)
        elif pattern.pattern_type == "grand_cross":
            vector["grand_cross"] = max(vector["grand_cross"], pattern.strength)
        elif pattern.pattern_type == "t_square":
            vector["t_square"] = max(vector["t_square"], pattern.strength)
        elif pattern.pattern_type == "yod":
            vector["yod"] = max(vector["yod"], pattern.strength)
        elif pattern.pattern_type == "stellium":
            vector["stellium_count"] += 1

    return vector


# =============================================================================
# PATTERN STRENGTH DETECTOR (Uses DetectedAspect)
# =============================================================================

def detect_pattern_strengths(
    detected_aspects: List[DetectedAspect],
    planets: List[PlanetPosition]
) -> PatternStrengths:
    """
    Detect aspect patterns using DetectedAspect list and compute strength scores.

    This is the professional pattern detector that produces continuous
    strength values (0.0-1.0) based on aspect tightness.

    Args:
        detected_aspects: List of DetectedAspect from detect_aspects_from_longitudes()
        planets: List of PlanetPosition for stellium detection

    Returns:
        PatternStrengths dataclass with strength scores for each pattern type
    """
    from itertools import combinations

    # Build adjacency maps by aspect type
    def build_adj(aspect_type: str) -> Dict[str, Dict[str, float]]:
        adj: Dict[str, Dict[str, float]] = {}
        for asp in detected_aspects:
            if asp.aspect_type != aspect_type:
                continue
            if asp.planet1 not in adj:
                adj[asp.planet1] = {}
            if asp.planet2 not in adj:
                adj[asp.planet2] = {}
            adj[asp.planet1][asp.planet2] = asp.tightness
            adj[asp.planet2][asp.planet1] = asp.tightness
        return adj

    trine_adj = build_adj('trine')
    square_adj = build_adj('square')
    opp_adj = build_adj('opposition')
    sext_adj = build_adj('sextile')
    quin_adj = build_adj('quincunx')

    # --- Grand Trine ---
    grand_trine_strength = 0.0
    trine_planets = list(trine_adj.keys())
    for a, b, c in combinations(trine_planets, 3):
        t_ab = trine_adj.get(a, {}).get(b, 0)
        t_ac = trine_adj.get(a, {}).get(c, 0)
        t_bc = trine_adj.get(b, {}).get(c, 0)
        if t_ab > 0 and t_ac > 0 and t_bc > 0:
            strength = (t_ab + t_ac + t_bc) / 3
            grand_trine_strength = max(grand_trine_strength, strength)

    # --- T-Square ---
    t_square_strength = 0.0
    for a, opp_partners in opp_adj.items():
        for b, opp_tight in opp_partners.items():
            if b <= a:  # Avoid duplicates
                continue
            # Find apex planet that squares both
            for c in square_adj.keys():
                if c in (a, b):
                    continue
                sq_ac = square_adj.get(a, {}).get(c, 0)
                sq_bc = square_adj.get(b, {}).get(c, 0)
                if sq_ac > 0 and sq_bc > 0:
                    strength = (opp_tight + sq_ac + sq_bc) / 3
                    t_square_strength = max(t_square_strength, strength)

    # --- Stellium ---
    stellium_strength = 0.0
    sign_counts: Dict[str, int] = {}
    house_counts: Dict[int, int] = {}
    for p in planets:
        sign_counts[p.sign] = sign_counts.get(p.sign, 0) + 1
        if p.house:
            house_counts[p.house] = house_counts.get(p.house, 0) + 1

    max_sign = max(sign_counts.values()) if sign_counts else 0
    max_house = max(house_counts.values()) if house_counts else 0
    max_cluster = max(max_sign, max_house)
    if max_cluster >= 3:
        # Strength scales: 3=0.33, 4=0.67, 5+=1.0
        stellium_strength = min(1.0, (max_cluster - 2) / 3)

    # --- Yod ---
    yod_strength = 0.0
    for apex, quin_partners in quin_adj.items():
        partners = [(p, t) for p, t in quin_partners.items()]
        if len(partners) < 2:
            continue
        for (b, q_ab), (c, q_ac) in combinations(partners, 2):
            s_bc = sext_adj.get(b, {}).get(c, 0)
            if s_bc > 0:
                strength = (q_ab + q_ac + s_bc) / 3
                yod_strength = max(yod_strength, strength)

    # --- Kite ---
    kite_strength = 0.0
    for a, b, c in combinations(trine_planets, 3):
        t_ab = trine_adj.get(a, {}).get(b, 0)
        t_ac = trine_adj.get(a, {}).get(c, 0)
        t_bc = trine_adj.get(b, {}).get(c, 0)
        if not (t_ab > 0 and t_ac > 0 and t_bc > 0):
            continue
        tri_set = {a, b, c}
        grand_trine_tight = (t_ab + t_ac + t_bc) / 3
        # Look for 4th planet opposing one trine planet
        for trine_planet in tri_set:
            for opp_planet, opp_tight in opp_adj.get(trine_planet, {}).items():
                if opp_planet not in tri_set:
                    strength = (grand_trine_tight + opp_tight) / 2
                    kite_strength = max(kite_strength, strength)

    # --- Opposition Chain ---
    opp_chain_strength = 0.0
    if opp_adj:
        # Build simple graph and find longest chain via DFS
        def dfs(node: str, visited: set) -> int:
            best = 1
            for neighbor in opp_adj.get(node, {}):
                if neighbor not in visited:
                    visited.add(neighbor)
                    best = max(best, 1 + dfs(neighbor, visited))
                    visited.remove(neighbor)
            return best

        longest = 0
        for start in opp_adj:
            longest = max(longest, dfs(start, {start}))

        if longest >= 3:
            opp_chain_strength = min(1.0, longest / 4.0)

    return PatternStrengths(
        grand_trine=grand_trine_strength,
        t_square=t_square_strength,
        stellium=stellium_strength,
        yod=yod_strength,
        kite=kite_strength,
        opposition_chain=opp_chain_strength,
    )


def detect_patterns_from_swiss(
    swiss_planets: Dict[str, dict],
    planets: List[PlanetPosition]
) -> PatternStrengths:
    """
    Convenience function: detect patterns directly from Swiss chart data.

    Args:
        swiss_planets: Dict from Swiss chart
        planets: List of PlanetPosition for stellium detection

    Returns:
        PatternStrengths
    """
    detected_aspects = calculate_aspects_from_swiss(swiss_planets)
    return detect_pattern_strengths(detected_aspects, planets)
