"""
western_engine/derive_western_expression.py

Full derivation pipeline for EnhancedWesternExpressionVector.

Takes raw chart data and produces complete expression vectors
using the 16-axis archetype system.
"""

from typing import List, Dict, Optional, Tuple
import math

from .models import (
    PlanetPosition,
    HouseCusps,
    RawChart,
    EnhancedWesternExpressionVector,
    EnhancedCompatibilityScore
)
from .constants import (
    SIGN_ELEMENT,
    SIGN_MODALITY,
    PLANET_WEIGHTS,
    ARCHETYPE_AXES,
    SIGN_ARCHETYPE_VECTORS,
    ENHANCED_SECTION_WEIGHTS
)
from .archetype_calculator import (
    calculate_chart_archetype,
    calculate_synastry_receptivity,
    derive_planet_vectors,
    get_dominant_archetype_traits,
    calculate_archetype_similarity
)


def normalize_dict(d: Dict[str, float]) -> Dict[str, float]:
    """Normalize dict values to sum to 1."""
    total = sum(d.values())
    if total == 0:
        return {k: 0.0 for k in d}
    return {k: v / total for k, v in d.items()}


def normalize_list(lst: List[float]) -> List[float]:
    """Normalize list values to sum to 1."""
    total = sum(lst)
    if total == 0:
        return [0.0] * len(lst)
    return [v / total for v in lst]


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    if len(a) != len(b) or len(a) == 0:
        return 0.0

    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot / (norm_a * norm_b)


# =============================================================================
# DERIVATION FUNCTIONS
# =============================================================================

def derive_elements(chart: RawChart) -> Dict[str, float]:
    """
    Derive element distribution from planet placements.

    Args:
        chart: Raw chart data

    Returns:
        Dict with Fire, Earth, Air, Water percentages
    """
    acc: Dict[str, float] = {'Fire': 0.0, 'Earth': 0.0, 'Air': 0.0, 'Water': 0.0}

    for planet in chart.planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        element = SIGN_ELEMENT.get(planet.sign, 'Fire')
        acc[element] += weight

    return normalize_dict(acc)


def derive_modalities(chart: RawChart) -> Dict[str, float]:
    """
    Derive modality distribution from planet placements.

    Args:
        chart: Raw chart data

    Returns:
        Dict with Cardinal, Fixed, Mutable percentages
    """
    acc: Dict[str, float] = {'Cardinal': 0.0, 'Fixed': 0.0, 'Mutable': 0.0}

    for planet in chart.planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        modality = SIGN_MODALITY.get(planet.sign, 'Cardinal')
        acc[modality] += weight

    return normalize_dict(acc)


def derive_houses(chart: RawChart) -> List[float]:
    """
    Derive house intensity distribution from planet placements.

    Args:
        chart: Raw chart data

    Returns:
        List of 12 house intensities (sum to 1)
    """
    acc = [0.0] * 12

    for planet in chart.planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        if planet.house is not None:
            idx = max(1, min(12, planet.house)) - 1
            acc[idx] += weight

    return normalize_list(acc)


def derive_aspect_pattern_vector(chart: RawChart) -> List[float]:
    """
    Derive aspect pattern vector from chart data.

    Uses orb-aware, strength-weighted pattern detection.
    Returns 6-dim vector: [grand_trine, t_square, stellium, yod, kite, opposition_chain]

    Each value is 0.0-1.0 representing pattern strength (not binary).
    """
    return detect_aspect_patterns_weighted(chart)


# =============================================================================
# PROFESSIONAL ORB-AWARE ASPECT PATTERN DETECTION
# =============================================================================

# Aspect definitions: ideal angle and default orb
ASPECT_CONFIG = {
    'conjunction': {'angle': 0, 'orb': 8},
    'opposition': {'angle': 180, 'orb': 8},
    'trine': {'angle': 120, 'orb': 7},
    'square': {'angle': 90, 'orb': 7},
    'sextile': {'angle': 60, 'orb': 5},
    'quincunx': {'angle': 150, 'orb': 3},
    'semi-sextile': {'angle': 30, 'orb': 2},
}

# Planet orb modifiers
PLANET_ORB_MODIFIERS = {
    'Sun': 1.0,
    'Moon': 1.0,
    'Ascendant': 2.0,
    'Midheaven': 2.0,
    'Mercury': 0.0,
    'Venus': 0.0,
    'Mars': 0.0,
    'Jupiter': 0.0,
    'Saturn': 0.0,
    'Uranus': -1.0,
    'Neptune': -1.0,
    'Pluto': -1.0,
}


def aspect_tightness(actual_angle: float, ideal_angle: float, max_orb: float) -> float:
    """
    Calculate aspect tightness (0.0 to 1.0).

    1.0 = exact aspect
    0.0 = outside orb or no aspect
    """
    orb_error = abs(actual_angle - ideal_angle)
    # Handle 360° wrap for opposition/conjunction
    if orb_error > 180:
        orb_error = 360 - orb_error

    if orb_error > max_orb:
        return 0.0
    return 1.0 - (orb_error / max_orb)


def calculate_angle_between(lon1: float, lon2: float) -> float:
    """Calculate shortest angle between two longitudes."""
    diff = abs(lon1 - lon2)
    if diff > 180:
        diff = 360 - diff
    return diff


def get_effective_orb(planet1: str, planet2: str, base_orb: float) -> float:
    """Get effective orb with planet modifiers."""
    mod1 = PLANET_ORB_MODIFIERS.get(planet1, 0.0)
    mod2 = PLANET_ORB_MODIFIERS.get(planet2, 0.0)
    return base_orb + max(mod1, mod2)


def detect_aspect_patterns_weighted(chart: RawChart) -> List[float]:
    """
    Detect aspect patterns with orb-aware strength weighting.

    Returns: [grand_trine, t_square, stellium, yod, kite, opposition_chain]
    Each value 0.0-1.0 representing pattern strength.
    """
    # Build planet lookup
    planets = {p.planet: p for p in chart.planets}

    # Build aspect adjacency with tightness scores
    aspects_by_type: Dict[str, List[Dict]] = {}

    for p1_name, p2_name, aspect_type in chart.aspects:
        aspect_type = aspect_type.lower()
        if aspect_type not in ASPECT_CONFIG:
            continue

        p1 = planets.get(p1_name)
        p2 = planets.get(p2_name)
        if not p1 or not p2:
            continue

        config = ASPECT_CONFIG[aspect_type]
        actual_angle = calculate_angle_between(p1.longitude, p2.longitude)
        effective_orb = get_effective_orb(p1_name, p2_name, config['orb'])
        tightness = aspect_tightness(actual_angle, config['angle'], effective_orb)

        if tightness > 0:
            if aspect_type not in aspects_by_type:
                aspects_by_type[aspect_type] = []
            aspects_by_type[aspect_type].append({
                'p1': p1_name, 'p2': p2_name,
                'tightness': tightness,
                'actual_angle': actual_angle
            })

    # Build adjacency graphs for pattern detection
    trine_adj = _build_adjacency(aspects_by_type.get('trine', []))
    square_adj = _build_adjacency(aspects_by_type.get('square', []))
    opposition_adj = _build_adjacency(aspects_by_type.get('opposition', []))
    sextile_adj = _build_adjacency(aspects_by_type.get('sextile', []))
    quincunx_adj = _build_adjacency(aspects_by_type.get('quincunx', []))

    # Detect patterns with strength
    grand_trine_strength = _detect_grand_trine(trine_adj)
    t_square_strength = _detect_t_square(opposition_adj, square_adj)
    stellium_strength = _detect_stellium(chart.planets)
    yod_strength = _detect_yod(quincunx_adj, sextile_adj)
    kite_strength = _detect_kite(trine_adj, opposition_adj)
    opposition_chain_strength = _detect_opposition_chain(opposition_adj)

    return [
        grand_trine_strength,
        t_square_strength,
        stellium_strength,
        yod_strength,
        kite_strength,
        opposition_chain_strength,
    ]


def _build_adjacency(aspects: List[Dict]) -> Dict[str, Dict[str, float]]:
    """Build adjacency dict with tightness scores."""
    adj: Dict[str, Dict[str, float]] = {}
    for a in aspects:
        p1, p2, tight = a['p1'], a['p2'], a['tightness']
        if p1 not in adj:
            adj[p1] = {}
        if p2 not in adj:
            adj[p2] = {}
        adj[p1][p2] = tight
        adj[p2][p1] = tight
    return adj


def _detect_grand_trine(trine_adj: Dict[str, Dict[str, float]]) -> float:
    """
    Grand Trine: 3 planets mutually in trine.
    Strength = average tightness of the 3 trines.
    """
    best_strength = 0.0
    names = list(trine_adj.keys())

    for i, a in enumerate(names):
        for j, b in enumerate(names[i+1:], i+1):
            for c in names[j+1:]:
                t_ab = trine_adj.get(a, {}).get(b, 0)
                t_ac = trine_adj.get(a, {}).get(c, 0)
                t_bc = trine_adj.get(b, {}).get(c, 0)

                if t_ab > 0 and t_ac > 0 and t_bc > 0:
                    strength = (t_ab + t_ac + t_bc) / 3
                    best_strength = max(best_strength, strength)

    return best_strength


def _detect_t_square(
    opposition_adj: Dict[str, Dict[str, float]],
    square_adj: Dict[str, Dict[str, float]]
) -> float:
    """
    T-Square: 2 planets in opposition, both square to apex.
    Strength = average tightness of the 3 aspects.
    """
    best_strength = 0.0

    for a, opp_partners in opposition_adj.items():
        for b, opp_tight in opp_partners.items():
            # Find apex planet that squares both
            for c in square_adj.keys():
                if c == a or c == b:
                    continue
                sq_ac = square_adj.get(a, {}).get(c, 0)
                sq_bc = square_adj.get(b, {}).get(c, 0)

                if sq_ac > 0 and sq_bc > 0:
                    strength = (opp_tight + sq_ac + sq_bc) / 3
                    best_strength = max(best_strength, strength)

    return best_strength


def _detect_stellium(planets: List) -> float:
    """
    Stellium: 3+ planets in same sign or house.
    Strength = (count - 2) / 3, capped at 1.0
    """
    from collections import Counter

    sign_counts = Counter(p.sign for p in planets)
    house_counts = Counter(p.house for p in planets if p.house)

    max_sign = max(sign_counts.values()) if sign_counts else 0
    max_house = max(house_counts.values()) if house_counts else 0
    max_count = max(max_sign, max_house)

    if max_count < 3:
        return 0.0

    # Strength scales with count: 3 planets = 0.33, 4 = 0.67, 5+ = 1.0
    return min(1.0, (max_count - 2) / 3)


def _detect_yod(
    quincunx_adj: Dict[str, Dict[str, float]],
    sextile_adj: Dict[str, Dict[str, float]]
) -> float:
    """
    Yod: Apex planet with 2 quincunxes, base planets in sextile.
    Strength = average tightness of 3 aspects.
    """
    best_strength = 0.0

    for apex, quin_partners in quincunx_adj.items():
        partners = list(quin_partners.items())
        if len(partners) < 2:
            continue

        # Check all pairs of quincunx partners
        for i, (b, q_ab) in enumerate(partners):
            for c, q_ac in partners[i+1:]:
                # Check if b and c are sextile
                s_bc = sextile_adj.get(b, {}).get(c, 0)

                if s_bc > 0:
                    strength = (q_ab + q_ac + s_bc) / 3
                    best_strength = max(best_strength, strength)

    return best_strength


def _detect_kite(
    trine_adj: Dict[str, Dict[str, float]],
    opposition_adj: Dict[str, Dict[str, float]]
) -> float:
    """
    Kite: Grand trine + opposition from 4th planet to one trine planet.
    Strength = average of 4 aspects.
    """
    best_strength = 0.0
    names = list(trine_adj.keys())

    for i, a in enumerate(names):
        for j, b in enumerate(names[i+1:], i+1):
            for c in names[j+1:]:
                t_ab = trine_adj.get(a, {}).get(b, 0)
                t_ac = trine_adj.get(a, {}).get(c, 0)
                t_bc = trine_adj.get(b, {}).get(c, 0)

                if t_ab > 0 and t_ac > 0 and t_bc > 0:
                    # Have grand trine, now check for opposition from 4th planet
                    tri = {a, b, c}
                    for trine_planet in tri:
                        for opp_planet, opp_tight in opposition_adj.get(trine_planet, {}).items():
                            if opp_planet not in tri:
                                strength = (t_ab + t_ac + t_bc + opp_tight) / 4
                                best_strength = max(best_strength, strength)

    return best_strength


def _detect_opposition_chain(opposition_adj: Dict[str, Dict[str, float]]) -> float:
    """
    Opposition chain: 3+ planets linked by oppositions (A-B, B-C).
    Strength = chain length / 4, capped at 1.0
    """
    if not opposition_adj:
        return 0.0

    # Find longest chain using DFS
    max_chain = 0
    visited = set()

    def dfs(planet: str, depth: int):
        nonlocal max_chain
        max_chain = max(max_chain, depth)

        for neighbor in opposition_adj.get(planet, {}):
            if neighbor not in visited:
                visited.add(neighbor)
                dfs(neighbor, depth + 1)
                visited.remove(neighbor)

    for start in opposition_adj:
        visited = {start}
        dfs(start, 1)

    if max_chain < 3:
        return 0.0

    return min(1.0, max_chain / 4)


def derive_dominance_vector(chart: RawChart) -> List[float]:
    """
    Derive dominance vector from chart data.

    Returns 4-dim compressed vector:
    [sign_dominance, planet_dominance, house_dominance, overall_strength]
    """
    # Sign dominance
    sign_counts: Dict[str, float] = {}
    for planet in chart.planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        sign_counts[planet.sign] = sign_counts.get(planet.sign, 0) + weight

    max_sign_weight = max(sign_counts.values()) if sign_counts else 0
    total_sign_weight = sum(sign_counts.values()) if sign_counts else 1
    sign_dominance = max_sign_weight / total_sign_weight if total_sign_weight else 0

    # Planet dominance (based on aspects)
    planet_aspect_counts: Dict[str, int] = {}
    for a in chart.aspects:
        planet_aspect_counts[a[0]] = planet_aspect_counts.get(a[0], 0) + 1
        planet_aspect_counts[a[1]] = planet_aspect_counts.get(a[1], 0) + 1

    max_aspects = max(planet_aspect_counts.values()) if planet_aspect_counts else 0
    planet_dominance = min(1.0, max_aspects / 10.0)

    # House dominance
    house_counts = [0.0] * 12
    for planet in chart.planets:
        if planet.house is not None:
            house_counts[planet.house - 1] += PLANET_WEIGHTS.get(planet.planet, 0.5)

    max_house_weight = max(house_counts) if house_counts else 0
    total_house_weight = sum(house_counts) if house_counts else 1
    house_dominance = max_house_weight / total_house_weight if total_house_weight else 0

    # Overall strength
    overall = (sign_dominance + planet_dominance + house_dominance) / 3

    return [sign_dominance, planet_dominance, house_dominance, overall]


def derive_chart_shape_vector(chart: RawChart) -> List[float]:
    """
    Derive chart shape vector from chart shape classification.

    Returns 6-dim vector: [bowl, bucket, locomotive, splash, bundle, seesaw]
    """
    shapes = ['Bowl', 'Bucket', 'Locomotive', 'Splash', 'Bundle', 'Seesaw']
    return [1.0 if chart.chart_shape == s else 0.0 for s in shapes]


# =============================================================================
# MAIN DERIVATION FUNCTION
# =============================================================================

def derive_western_expression(chart: RawChart) -> EnhancedWesternExpressionVector:
    """
    Derive complete EnhancedWesternExpressionVector from raw chart data.

    This is the main entry point for the derivation pipeline.

    Args:
        chart: Raw chart data with planets, aspects, shape, etc.

    Returns:
        Complete EnhancedWesternExpressionVector
    """
    # 1. Elements
    elements = derive_elements(chart)

    # 2. Modalities
    modalities = derive_modalities(chart)

    # 3. Houses
    houses = derive_houses(chart)

    # 4. Planet vectors
    planets = derive_planet_vectors(chart.planets)

    # 5. Chart-level archetype vector (16 dims)
    archetype_vector = calculate_chart_archetype(
        chart.planets,
        chart.asc_sign
    )

    # 6. Aspect pattern vector
    aspect_pattern_vector = derive_aspect_pattern_vector(chart)

    # 7. Dominance vector
    dominance_vector = derive_dominance_vector(chart)

    # 8. Chart shape vector
    chart_shape_vector = derive_chart_shape_vector(chart)

    # 9. Synastry receptivity
    synastry_receptivity = calculate_synastry_receptivity(
        chart.planets,
        chart.houses
    )

    # 10. Get dominant traits for metadata
    dominant_traits = get_dominant_archetype_traits(archetype_vector, top_n=3)

    return EnhancedWesternExpressionVector(
        elements=elements,
        modalities=modalities,
        houses=houses,
        planets=planets,
        archetype_vector=archetype_vector,
        aspect_pattern_vector=aspect_pattern_vector,
        dominance_vector=dominance_vector,
        chart_shape_vector=chart_shape_vector,
        synastry_receptivity=synastry_receptivity,
        dominant_traits=dominant_traits
    )


# =============================================================================
# COMPATIBILITY CALCULATION
# =============================================================================

def compute_enhanced_compatibility(
    user: EnhancedWesternExpressionVector,
    partner: EnhancedWesternExpressionVector,
    proximity_score: float = 0.5,
    weights: Optional[Dict[str, float]] = None
) -> EnhancedCompatibilityScore:
    """
    Compute enhanced compatibility between two expression vectors.

    Uses 16-axis archetype system and section-weighted scoring.

    Args:
        user: First expression vector
        partner: Second expression vector
        proximity_score: Cusp proximity bonus (0-1)
        weights: Optional section weights

    Returns:
        EnhancedCompatibilityScore with all components
    """
    if weights is None:
        weights = ENHANCED_SECTION_WEIGHTS

    # Element similarity
    user_el = [user.elements.get(e, 0.25) for e in ['Fire', 'Earth', 'Air', 'Water']]
    partner_el = [partner.elements.get(e, 0.25) for e in ['Fire', 'Earth', 'Air', 'Water']]
    elements_sim = cosine_similarity(user_el, partner_el)

    # Modality similarity
    user_mod = [user.modalities.get(m, 0.33) for m in ['Cardinal', 'Fixed', 'Mutable']]
    partner_mod = [partner.modalities.get(m, 0.33) for m in ['Cardinal', 'Fixed', 'Mutable']]
    modalities_sim = cosine_similarity(user_mod, partner_mod)

    # House similarity
    houses_sim = cosine_similarity(user.houses, partner.houses)

    # Planet vector similarity (average across shared planets)
    planet_sims = []
    for name, uvec in user.planets.items():
        if name in partner.planets:
            sim = cosine_similarity(uvec, partner.planets[name])
            planet_sims.append(sim)
    planets_sim = sum(planet_sims) / len(planet_sims) if planet_sims else 0.5

    # Archetype vector similarity (16-axis)
    archetypes_sim = cosine_similarity(user.archetype_vector, partner.archetype_vector)

    # Pattern similarity
    patterns_sim = cosine_similarity(
        user.aspect_pattern_vector,
        partner.aspect_pattern_vector
    )

    # Dominance similarity
    dominance_sim = cosine_similarity(user.dominance_vector, partner.dominance_vector)

    # Shape similarity
    shape_sim = cosine_similarity(user.chart_shape_vector, partner.chart_shape_vector)

    # Synastry receptivity (minimum of both)
    synastry_sim = min(user.synastry_receptivity, partner.synastry_receptivity)

    # Build components dict
    components = {
        'elements': elements_sim * 100,
        'modalities': modalities_sim * 100,
        'houses': houses_sim * 100,
        'planets': planets_sim * 100,
        'archetypes': archetypes_sim * 100,
        'patterns': patterns_sim * 100,
        'dominance': dominance_sim * 100,
        'shape': shape_sim * 100,
        'proximity': proximity_score * 100,
        'synastryReceptivity': synastry_sim * 100
    }

    # Calculate weighted total
    total = sum(
        components[k] * weights.get(k, 0.1)
        for k in components
    )

    return EnhancedCompatibilityScore(
        total=total,
        elements=components['elements'],
        modalities=components['modalities'],
        houses=components['houses'],
        planets=components['planets'],
        archetypes=components['archetypes'],
        patterns=components['patterns'],
        dominance=components['dominance'],
        shape=components['shape'],
        proximity=components['proximity'],
        synastry_receptivity=components['synastryReceptivity'],
        raw_components={
            'elements_sim': elements_sim,
            'modalities_sim': modalities_sim,
            'houses_sim': houses_sim,
            'planets_sim': planets_sim,
            'archetypes_sim': archetypes_sim,
            'patterns_sim': patterns_sim,
            'dominance_sim': dominance_sim,
            'shape_sim': shape_sim,
            'synastry_sim': synastry_sim
        }
    )


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

def quick_archetype_comparison(
    sign_a: str,
    sign_b: str
) -> Dict[str, any]:
    """
    Quick comparison of two sign archetypes.

    Args:
        sign_a: First zodiac sign
        sign_b: Second zodiac sign

    Returns:
        Dict with similarity score and dominant differences
    """
    vec_a = SIGN_ARCHETYPE_VECTORS.get(sign_a, [0.0] * 16)
    vec_b = SIGN_ARCHETYPE_VECTORS.get(sign_b, [0.0] * 16)

    similarity = cosine_similarity(vec_a, vec_b)

    # Find biggest differences
    differences = []
    for i, axis in enumerate(ARCHETYPE_AXES):
        diff = abs(vec_a[i] - vec_b[i])
        if diff > 0.5:  # Significant difference
            differences.append({
                'axis': axis,
                'sign_a_value': vec_a[i],
                'sign_b_value': vec_b[i],
                'difference': diff
            })

    differences.sort(key=lambda x: -x['difference'])

    return {
        'sign_a': sign_a,
        'sign_b': sign_b,
        'similarity': round(similarity, 3),
        'compatibility_percent': round(similarity * 100, 1),
        'significant_differences': differences[:3]
    }


def get_archetype_profile(sign: str) -> Dict[str, any]:
    """
    Get complete archetype profile for a sign.

    Args:
        sign: Zodiac sign name

    Returns:
        Dict with archetype values and interpretations
    """
    vec = SIGN_ARCHETYPE_VECTORS.get(sign, [0.0] * 16)
    traits = get_dominant_archetype_traits(vec, top_n=5)

    return {
        'sign': sign,
        'archetype_vector': vec,
        'dominant_traits': traits,
        'profile': {
            ARCHETYPE_AXES[i]: {
                'value': round(v, 2),
                'strength': 'high' if abs(v) > 0.6 else 'moderate' if abs(v) > 0.3 else 'low'
            }
            for i, v in enumerate(vec)
        }
    }
