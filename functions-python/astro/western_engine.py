"""
Western Engine - Complete Western Astrology Calculations

This module provides:
- Elements (Fire/Earth/Air/Water)
- Modalities (Cardinal/Fixed/Mutable)
- Yin/Yang polarity
- Dominant element
- Planetary dignity (Exaltation, Domicile, Detriment, Debilitation)
- Synastry overlays
- Yin/Yang polarity comparison for relationships

Production-ready, deterministic, classical Western astrology engine.
"""

from typing import Dict, List, Optional, Tuple

# =============================================================================
# SIGN CONSTANTS
# =============================================================================

SIGN_ELEMENT = {
    "Aries": "Fire",
    "Taurus": "Earth",
    "Gemini": "Air",
    "Cancer": "Water",
    "Leo": "Fire",
    "Virgo": "Earth",
    "Libra": "Air",
    "Scorpio": "Water",
    "Sagittarius": "Fire",
    "Capricorn": "Earth",
    "Aquarius": "Air",
    "Pisces": "Water",
}

SIGN_MODALITY = {
    "Aries": "Cardinal",
    "Taurus": "Fixed",
    "Gemini": "Mutable",
    "Cancer": "Cardinal",
    "Leo": "Fixed",
    "Virgo": "Mutable",
    "Libra": "Cardinal",
    "Scorpio": "Fixed",
    "Sagittarius": "Mutable",
    "Capricorn": "Cardinal",
    "Aquarius": "Fixed",
    "Pisces": "Mutable",
}

# Western Yin/Yang Polarity
# Yang (Masculine/Active/Positive): Fire + Air signs
# Yin (Feminine/Receptive/Negative): Earth + Water signs
SIGN_POLARITY = {
    "Aries": "Yang",
    "Taurus": "Yin",
    "Gemini": "Yang",
    "Cancer": "Yin",
    "Leo": "Yang",
    "Virgo": "Yin",
    "Libra": "Yang",
    "Scorpio": "Yin",
    "Sagittarius": "Yang",
    "Capricorn": "Yin",
    "Aquarius": "Yang",
    "Pisces": "Yin",
}

# =============================================================================
# PLANETARY DIGNITIES
# =============================================================================

EXALTATION = {
    "Sun": "Aries",
    "Moon": "Taurus",
    "Mercury": "Virgo",
    "Venus": "Pisces",
    "Mars": "Capricorn",
    "Jupiter": "Cancer",
    "Saturn": "Libra",
}

DEBILITATION = {
    "Sun": "Libra",
    "Moon": "Scorpio",
    "Mercury": "Pisces",
    "Venus": "Virgo",
    "Mars": "Cancer",
    "Jupiter": "Capricorn",
    "Saturn": "Aries",
}

DOMICILE = {
    "Sun": ["Leo"],
    "Moon": ["Cancer"],
    "Mercury": ["Gemini", "Virgo"],
    "Venus": ["Taurus", "Libra"],
    "Mars": ["Aries", "Scorpio"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Saturn": ["Capricorn", "Aquarius"],
    "Uranus": ["Aquarius"],
    "Neptune": ["Pisces"],
    "Pluto": ["Scorpio"],
}

DETRIMENT = {
    "Sun": ["Aquarius"],
    "Moon": ["Capricorn"],
    "Mercury": ["Sagittarius", "Pisces"],
    "Venus": ["Aries", "Scorpio"],
    "Mars": ["Taurus", "Libra"],
    "Jupiter": ["Gemini", "Virgo"],
    "Saturn": ["Cancer", "Leo"],
    "Uranus": ["Leo"],
    "Neptune": ["Virgo"],
    "Pluto": ["Taurus"],
}

# =============================================================================
# PLANET WEIGHTS FOR POLARITY CALCULATIONS
# =============================================================================

PLANET_WEIGHTS = {
    "Sun": 1.0,
    "Moon": 1.0,
    "Mercury": 0.8,
    "Venus": 0.8,
    "Mars": 0.8,
    "Jupiter": 0.6,
    "Saturn": 0.6,
    "Uranus": 0.4,
    "Neptune": 0.4,
    "Pluto": 0.4,
    "Ascendant": 1.0,
    "Midheaven": 0.6,
    "North Node": 0.3,
    "South Node": 0.3,
    "Chiron": 0.3,
}

# =============================================================================
# SYNASTRY OVERLAY MEANINGS
# =============================================================================

SYNASTRY_OVERLAY_MEANINGS = {
    1: "Identity resonance, attraction, recognition.",
    2: "Value alignment, resource sharing.",
    3: "Communication flow, mental connection.",
    4: "Emotional bonding, home resonance.",
    5: "Romance, play, creativity.",
    6: "Daily life, routines, service.",
    7: "Partnership, commitment, mirroring.",
    8: "Intensity, sexuality, transformation.",
    9: "Philosophy, travel, expansion.",
    10: "Career alignment, public image.",
    11: "Friendship, community, shared goals.",
    12: "Karmic ties, subconscious patterns.",
}

# Synastry overlay intensity by planet
SYNASTRY_PLANET_INTENSITY = {
    "Sun": "Core identity activation",
    "Moon": "Emotional resonance",
    "Mercury": "Mental connection",
    "Venus": "Attraction and harmony",
    "Mars": "Passion and drive",
    "Jupiter": "Growth and expansion",
    "Saturn": "Karmic lessons, stability",
    "Uranus": "Excitement, disruption",
    "Neptune": "Spiritual connection, illusion",
    "Pluto": "Transformation, power dynamics",
}


# =============================================================================
# BASIC PROPERTY FUNCTIONS
# =============================================================================

def compute_sign_properties(sign: str) -> Dict:
    """Get element, modality, and polarity for a sign."""
    sign_normalized = sign.strip().title()
    return {
        "element": SIGN_ELEMENT.get(sign_normalized, "Unknown"),
        "modality": SIGN_MODALITY.get(sign_normalized, "Unknown"),
        "polarity": SIGN_POLARITY.get(sign_normalized, "Unknown"),
    }


def compute_dignity(planet: str, sign: str) -> str:
    """
    Determine planetary dignity for a planet in a given sign.

    Returns: Exalted, Domicile, Detriment, Debilitated, or Neutral
    """
    planet_normalized = planet.strip().title()
    sign_normalized = sign.strip().title()

    if sign_normalized == EXALTATION.get(planet_normalized):
        return "Exalted"
    if sign_normalized == DEBILITATION.get(planet_normalized):
        return "Debilitated"
    if sign_normalized in DOMICILE.get(planet_normalized, []):
        return "Domicile"
    if sign_normalized in DETRIMENT.get(planet_normalized, []):
        return "Detriment"
    return "Neutral"


def get_dignity_strength_modifier(dignity: str) -> float:
    """
    Get strength modifier based on dignity.

    Returns a multiplier for planet influence:
    - Exalted: +20%
    - Domicile: +15%
    - Neutral: 0%
    - Detriment: -10%
    - Debilitated: -20%
    """
    modifiers = {
        "Exalted": 1.20,
        "Domicile": 1.15,
        "Neutral": 1.00,
        "Detriment": 0.90,
        "Debilitated": 0.80,
    }
    return modifiers.get(dignity, 1.0)


# =============================================================================
# ELEMENT & MODALITY CALCULATIONS
# =============================================================================

def compute_element_distribution(planets: List[Dict]) -> Dict:
    """
    Compute weighted element distribution across all planets.

    planets = [
        {"planet": "Sun", "sign": "Leo"},
        {"planet": "Moon", "sign": "Pisces"},
        ...
    ]

    Returns element percentages and dominant element.
    """
    element_scores = {"Fire": 0.0, "Earth": 0.0, "Air": 0.0, "Water": 0.0}
    total_weight = 0.0

    for p in planets:
        planet = p.get("planet", "").strip().title()
        sign = p.get("sign", "").strip().title()

        if not sign or sign not in SIGN_ELEMENT:
            continue

        weight = PLANET_WEIGHTS.get(planet, 0.5)
        element = SIGN_ELEMENT[sign]

        # Apply dignity modifier
        dignity = compute_dignity(planet, sign)
        dignity_mod = get_dignity_strength_modifier(dignity)

        element_scores[element] += weight * dignity_mod
        total_weight += weight * dignity_mod

    # Convert to percentages
    if total_weight > 0:
        for elem in element_scores:
            element_scores[elem] = round((element_scores[elem] / total_weight) * 100, 1)

    # Find dominant element
    dominant = max(element_scores, key=element_scores.get) if element_scores else "Unknown"

    # Find weakest element
    weakest = min(element_scores, key=element_scores.get) if element_scores else "Unknown"

    return {
        "distribution": element_scores,
        "dominant": dominant,
        "weakest": weakest,
        "firePercent": element_scores.get("Fire", 0),
        "earthPercent": element_scores.get("Earth", 0),
        "airPercent": element_scores.get("Air", 0),
        "waterPercent": element_scores.get("Water", 0),
    }


def compute_modality_distribution(planets: List[Dict]) -> Dict:
    """
    Compute weighted modality distribution across all planets.

    Returns modality percentages and dominant modality.
    """
    modality_scores = {"Cardinal": 0.0, "Fixed": 0.0, "Mutable": 0.0}
    total_weight = 0.0

    for p in planets:
        planet = p.get("planet", "").strip().title()
        sign = p.get("sign", "").strip().title()

        if not sign or sign not in SIGN_MODALITY:
            continue

        weight = PLANET_WEIGHTS.get(planet, 0.5)
        modality = SIGN_MODALITY[sign]

        modality_scores[modality] += weight
        total_weight += weight

    # Convert to percentages
    if total_weight > 0:
        for mod in modality_scores:
            modality_scores[mod] = round((modality_scores[mod] / total_weight) * 100, 1)

    dominant = max(modality_scores, key=modality_scores.get) if modality_scores else "Unknown"

    return {
        "distribution": modality_scores,
        "dominant": dominant,
        "cardinalPercent": modality_scores.get("Cardinal", 0),
        "fixedPercent": modality_scores.get("Fixed", 0),
        "mutablePercent": modality_scores.get("Mutable", 0),
    }


# =============================================================================
# YIN/YANG POLARITY CALCULATIONS
# =============================================================================

def compute_yinyang_distribution(planets: List[Dict]) -> Dict:
    """
    Compute weighted Yin/Yang polarity distribution.

    Yang (Masculine/Active): Fire + Air signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius)
    Yin (Feminine/Receptive): Earth + Water signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces)

    Returns polarity balance and classification.
    """
    yang_score = 0.0
    yin_score = 0.0
    total_weight = 0.0

    for p in planets:
        planet = p.get("planet", "").strip().title()
        sign = p.get("sign", "").strip().title()

        if not sign or sign not in SIGN_POLARITY:
            continue

        weight = PLANET_WEIGHTS.get(planet, 0.5)
        polarity = SIGN_POLARITY[sign]

        # Apply dignity modifier
        dignity = compute_dignity(planet, sign)
        dignity_mod = get_dignity_strength_modifier(dignity)

        if polarity == "Yang":
            yang_score += weight * dignity_mod
        else:
            yin_score += weight * dignity_mod

        total_weight += weight * dignity_mod

    # Calculate percentages
    yang_percent = round((yang_score / total_weight) * 100, 1) if total_weight > 0 else 50
    yin_percent = round((yin_score / total_weight) * 100, 1) if total_weight > 0 else 50

    # Determine balance category
    if yang_percent >= 70:
        category = "Very Yang"
        description = "Strongly active, initiating, assertive energy"
    elif yang_percent >= 55:
        category = "Yang-Dominant"
        description = "Active energy with receptive undertones"
    elif yin_percent >= 70:
        category = "Very Yin"
        description = "Strongly receptive, nurturing, introspective energy"
    elif yin_percent >= 55:
        category = "Yin-Dominant"
        description = "Receptive energy with active undertones"
    else:
        category = "Balanced"
        description = "Harmonious blend of active and receptive energies"

    return {
        "yangPercent": yang_percent,
        "yinPercent": yin_percent,
        "yangScore": round(yang_score, 2),
        "yinScore": round(yin_score, 2),
        "category": category,
        "description": description,
        "dominantPolarity": "Yang" if yang_score > yin_score else "Yin" if yin_score > yang_score else "Balanced",
    }


def compare_yinyang_polarity(profile_a: Dict, profile_b: Dict) -> Dict:
    """
    Compare Yin/Yang profiles between two people for relationship compatibility.

    Returns relationship polarity classification:
    - Magnetic: Opposite polarities attract (Yang + Yin or Yin + Yang)
    - Parallel: Same polarities (Yang + Yang or Yin + Yin)
    - Balanced: Both are balanced, or mixed
    """
    yang_a = profile_a.get("yangPercent", 50)
    yang_b = profile_b.get("yangPercent", 50)
    yin_a = profile_a.get("yinPercent", 50)
    yin_b = profile_b.get("yinPercent", 50)

    dom_a = profile_a.get("dominantPolarity", "Balanced")
    dom_b = profile_b.get("dominantPolarity", "Balanced")

    # Calculate polarity difference
    polarity_diff = abs(yang_a - yang_b)

    # Determine relationship type
    if dom_a == "Balanced" or dom_b == "Balanced":
        relationship = "Adaptable"
        description = "One or both partners are balanced, allowing flexible dynamic adjustment."
        attraction_type = "Versatile"
        polarity_score = 70
    elif dom_a != dom_b:
        # Opposite polarities - Magnetic attraction
        relationship = "Magnetic"
        description = "Opposite polarities create dynamic attraction and complementary energies."
        attraction_type = "Complementary"
        # Higher score for stronger opposition
        polarity_score = min(95, 70 + polarity_diff * 0.5)
    else:
        # Same polarities - Parallel
        relationship = "Parallel"
        if dom_a == "Yang":
            description = "Both partners are Yang-dominant — dynamic, active, but may compete for leadership."
            attraction_type = "Competitive"
        else:
            description = "Both partners are Yin-dominant — receptive, nurturing, but may lack initiative."
            attraction_type = "Harmonious"
        # Lower score for very similar (can be stagnant)
        polarity_score = max(40, 80 - polarity_diff * 0.5)

    # Calculate complementarity score
    # Best when one is Yang and one is Yin
    ideal_diff = 40  # Ideal difference for magnetic polarity
    complementarity = 100 - abs(polarity_diff - ideal_diff)

    return {
        "relationship": relationship,
        "attractionType": attraction_type,
        "description": description,
        "polarityScore": round(polarity_score, 1),
        "complementarity": round(complementarity, 1),
        "personAPolarity": dom_a,
        "personBPolarity": dom_b,
        "polarityDifference": round(polarity_diff, 1),
        "personAYangPercent": yang_a,
        "personBYangPercent": yang_b,
    }


# =============================================================================
# SYNASTRY OVERLAYS
# =============================================================================

def compute_synastry_overlays(
    person_a_planets: List[Dict],
    person_b_houses: Dict
) -> List[Dict]:
    """
    Compute synastry overlays: where Person A's planets fall in Person B's houses.

    person_a_planets = [
        {"planet": "Sun", "sign": "Leo", "degree": 15.5},
        ...
    ]

    person_b_houses = {
        1: {"sign": "Aries", "degree": 0, "endDegree": 30},
        ...
    }

    Returns list of overlay interpretations.
    """
    overlays = []

    for p in person_a_planets:
        planet = p.get("planet", "")
        sign = p.get("sign", "")
        degree = p.get("degree", 0)

        # Determine which house this planet falls into
        # For simplicity, use whole-sign houses based on planet sign
        house = p.get("house", 1)  # Use provided house or default

        if not planet:
            continue

        overlay = {
            "planet": planet,
            "sign": sign,
            "house": house,
            "houseMeaning": SYNASTRY_OVERLAY_MEANINGS.get(house, "Unknown house influence"),
            "planetIntensity": SYNASTRY_PLANET_INTENSITY.get(planet, "General influence"),
            "interpretation": f"{planet} in House {house}: {SYNASTRY_OVERLAY_MEANINGS.get(house, '')}",
        }

        # Add special interpretations for key placements
        if planet == "Venus" and house == 7:
            overlay["special"] = "Venus in the 7th house — classic partnership indicator"
        elif planet == "Mars" and house == 8:
            overlay["special"] = "Mars in the 8th house — intense passion and transformation"
        elif planet == "Moon" and house == 4:
            overlay["special"] = "Moon in the 4th house — deep emotional bonding"
        elif planet == "Sun" and house == 1:
            overlay["special"] = "Sun in the 1st house — strong identity recognition"
        elif planet == "Saturn" and house == 7:
            overlay["special"] = "Saturn in the 7th house — karmic partnership lessons"

        overlays.append(overlay)

    return overlays


def compute_western_synastry(person_a: Dict, person_b: Dict) -> Dict:
    """
    Full synastry analysis between two people.

    Returns overlays in both directions plus compatibility analysis.
    """
    planets_a = person_a.get("planets", [])
    planets_b = person_b.get("planets", [])

    # Compute overlays in both directions
    overlays_a_to_b = compute_synastry_overlays(planets_a, person_b.get("houses", {}))
    overlays_b_to_a = compute_synastry_overlays(planets_b, person_a.get("houses", {}))

    # Compute element compatibility
    elements_a = compute_element_distribution(planets_a)
    elements_b = compute_element_distribution(planets_b)

    # Compute Yin/Yang compatibility
    yinyang_a = compute_yinyang_distribution(planets_a)
    yinyang_b = compute_yinyang_distribution(planets_b)
    yinyang_comparison = compare_yinyang_polarity(yinyang_a, yinyang_b)

    # Compute element harmony
    element_harmony = compute_element_harmony(elements_a, elements_b)

    return {
        "overlaysAtoB": overlays_a_to_b,
        "overlaysBtoA": overlays_b_to_a,
        "elementsA": elements_a,
        "elementsB": elements_b,
        "elementHarmony": element_harmony,
        "yinyangA": yinyang_a,
        "yinyangB": yinyang_b,
        "yinyangComparison": yinyang_comparison,
    }


def compute_element_harmony(elements_a: Dict, elements_b: Dict) -> Dict:
    """
    Compute element harmony between two element distributions.

    Fire + Air = Harmonizing (both Yang)
    Earth + Water = Harmonizing (both Yin)
    Fire + Earth = Stabilizing (practicality meets action)
    Air + Water = Creative tension (ideas meet emotion)
    Fire + Water = Volatile (steam)
    Air + Earth = Frictional (abstraction vs concreteness)
    """
    dom_a = elements_a.get("dominant", "Fire")
    dom_b = elements_b.get("dominant", "Fire")

    # Element compatibility matrix
    harmony_matrix = {
        ("Fire", "Fire"): ("Amplifying", 75, "Intense energy, mutual inspiration, but may burn out"),
        ("Fire", "Air"): ("Harmonizing", 90, "Dynamic synergy — ideas fuel action, action inspires ideas"),
        ("Fire", "Earth"): ("Stabilizing", 70, "Grounding meets drive — productive tension"),
        ("Fire", "Water"): ("Volatile", 50, "Steam — passionate but turbulent"),
        ("Air", "Fire"): ("Harmonizing", 90, "Dynamic synergy — ideas fuel action, action inspires ideas"),
        ("Air", "Air"): ("Amplifying", 75, "Mental connection, but may lack grounding"),
        ("Air", "Earth"): ("Frictional", 55, "Abstract meets concrete — requires effort"),
        ("Air", "Water"): ("Creative", 65, "Imagination flows, but communication styles differ"),
        ("Earth", "Fire"): ("Stabilizing", 70, "Grounding meets drive — productive tension"),
        ("Earth", "Air"): ("Frictional", 55, "Concrete meets abstract — requires patience"),
        ("Earth", "Earth"): ("Amplifying", 80, "Stable and practical, but may resist change"),
        ("Earth", "Water"): ("Harmonizing", 85, "Nurturing synergy — emotion meets security"),
        ("Water", "Fire"): ("Volatile", 50, "Steam — passionate but turbulent"),
        ("Water", "Air"): ("Creative", 65, "Imagination flows, but emotional needs differ"),
        ("Water", "Earth"): ("Harmonizing", 85, "Nurturing synergy — emotion meets security"),
        ("Water", "Water"): ("Amplifying", 70, "Deep emotional bond, but may overwhelm"),
    }

    key = (dom_a, dom_b)
    harmony_type, score, description = harmony_matrix.get(key, ("Mixed", 60, "Varied elemental interaction"))

    return {
        "type": harmony_type,
        "score": score,
        "description": description,
        "dominantA": dom_a,
        "dominantB": dom_b,
    }


# =============================================================================
# COMPLETE WESTERN PROFILE
# =============================================================================

def compute_western_profile(planets: List[Dict]) -> Dict:
    """
    Compute complete Western astrology profile for a person.

    planets = [
        {"planet": "Sun", "sign": "Leo"},
        {"planet": "Moon", "sign": "Pisces"},
        ...
    ]

    Returns comprehensive profile with all calculations.
    """
    enriched_planets = []

    for p in planets:
        planet = p.get("planet", "").strip().title()
        sign = p.get("sign", "").strip().title()

        if not sign:
            continue

        props = compute_sign_properties(sign)
        dignity = compute_dignity(planet, sign)
        dignity_mod = get_dignity_strength_modifier(dignity)

        enriched_planets.append({
            **p,
            "planet": planet,
            "sign": sign,
            **props,
            "dignity": dignity,
            "dignityModifier": dignity_mod,
        })

    elements = compute_element_distribution(planets)
    modalities = compute_modality_distribution(planets)
    yinyang = compute_yinyang_distribution(planets)

    return {
        "planets": enriched_planets,
        "elements": elements,
        "modalities": modalities,
        "yinyang": yinyang,
        "dominantElement": elements.get("dominant"),
        "dominantModality": modalities.get("dominant"),
        "dominantPolarity": yinyang.get("dominantPolarity"),
    }


# =============================================================================
# WESTERN POLARITY MAP (For Integration with Vedic Polarity System)
# =============================================================================

def build_western_polarity_axis(person_a: Dict, person_b: Dict) -> Dict:
    """
    Build Western Yin/Yang polarity axis for the relationship polarity map.

    This function integrates with the Vedic polarity map system,
    adding a Western Yin/Yang axis.
    """
    planets_a = person_a.get("planets", [])
    planets_b = person_b.get("planets", [])

    yinyang_a = compute_yinyang_distribution(planets_a)
    yinyang_b = compute_yinyang_distribution(planets_b)
    comparison = compare_yinyang_polarity(yinyang_a, yinyang_b)

    # Determine polarity label for the axis
    relationship_type = comparison.get("relationship", "Adaptable")

    if relationship_type == "Magnetic":
        polarity = "Magnetic"
        interpretation = "Opposite polarities create dynamic attraction."
    elif relationship_type == "Parallel":
        if yinyang_a.get("dominantPolarity") == "Yang":
            polarity = "Yang-Parallel"
            interpretation = "Both partners share active, initiating energy."
        else:
            polarity = "Yin-Parallel"
            interpretation = "Both partners share receptive, nurturing energy."
    else:
        polarity = "Balanced"
        interpretation = "Flexible polarity allows adaptive dynamics."

    return {
        "axis": "Western Yin/Yang",
        "name": "Western Yin/Yang",
        "polarity": polarity,
        "score": comparison.get("polarityScore", 70),
        "personA": {
            "label": yinyang_a.get("category"),
            "yangPercent": yinyang_a.get("yangPercent"),
            "yinPercent": yinyang_a.get("yinPercent"),
        },
        "personB": {
            "label": yinyang_b.get("category"),
            "yangPercent": yinyang_b.get("yangPercent"),
            "yinPercent": yinyang_b.get("yinPercent"),
        },
        "relationship": relationship_type,
        "attractionType": comparison.get("attractionType"),
        "interpretation": interpretation,
        "narrative": comparison.get("description"),
    }
