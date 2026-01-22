"""
Western Interpretation Layer

Narrative generation for Western astrology profiles:
- Planet in sign interpretations
- Element balance narratives
- Dignity summaries
- Synastry overlay interpretations
"""

from typing import Dict, List, Optional

# =============================================================================
# KEYWORD DICTIONARIES
# =============================================================================

PLANET_KEYWORDS = {
    "Sun": "core identity, vitality, ego, purpose",
    "Moon": "emotions, needs, habits, instinct",
    "Mercury": "mind, communication, learning",
    "Venus": "love, pleasure, aesthetics, bonding",
    "Mars": "drive, assertion, conflict, passion",
    "Jupiter": "growth, faith, expansion, wisdom",
    "Saturn": "structure, limits, responsibility, time",
    "Uranus": "innovation, freedom, sudden change",
    "Neptune": "spirituality, dreams, illusion, transcendence",
    "Pluto": "transformation, power, depth, rebirth",
    "Ascendant": "outer personality, first impressions, approach to life",
    "Midheaven": "career, public image, life direction",
    "North Node": "soul growth direction, karmic path forward",
    "South Node": "past life gifts, comfort zone patterns",
    "Chiron": "core wound, healing journey, teaching ability",
}

ELEMENT_KEYWORDS = {
    "Fire": "action, inspiration, courage, spontaneity",
    "Earth": "stability, practicality, material reality",
    "Air": "ideas, communication, social connection",
    "Water": "emotion, intuition, depth, sensitivity",
}

ELEMENT_QUALITIES = {
    "Fire": "active, dynamic, self-expressive",
    "Earth": "grounded, reliable, sensory",
    "Air": "intellectual, social, adaptive",
    "Water": "emotional, intuitive, empathic",
}

MODALITY_KEYWORDS = {
    "Cardinal": "initiating, leadership, action-oriented",
    "Fixed": "stable, persistent, determined",
    "Mutable": "adaptable, flexible, changeable",
}

DIGNITY_KEYWORDS = {
    "Exalted": "expresses its gifts with ease and strength",
    "Domicile": "feels at home and functions reliably",
    "Neutral": "behaves in a balanced, ordinary way",
    "Detriment": "struggles to express itself cleanly",
    "Debilitated": "feels weakened or conflicted",
}

DIGNITY_STRENGTHS = {
    "Exalted": "highly supported",
    "Domicile": "naturally strong",
    "Neutral": "balanced",
    "Detriment": "challenged",
    "Debilitated": "requiring conscious work",
}

POLARITY_KEYWORDS = {
    "Yang": "active, outward, initiating, masculine",
    "Yin": "receptive, inward, responsive, feminine",
}

# =============================================================================
# PLANET INTERPRETATION
# =============================================================================

def interpret_planet_in_sign(planet_obj: Dict) -> Dict:
    """
    Generate interpretation for a planet in its sign.

    planet_obj = {
        "planet": "Sun",
        "sign": "Leo",
        "element": "Fire",
        "modality": "Fixed",
        "polarity": "Yang",
        "dignity": "Domicile"
    }
    """
    planet = planet_obj.get("planet", "Unknown")
    sign = planet_obj.get("sign", "Unknown")
    element = planet_obj.get("element", "Fire")
    modality = planet_obj.get("modality", "Fixed")
    polarity = planet_obj.get("polarity", "Yang")
    dignity = planet_obj.get("dignity", "Neutral")

    pk = PLANET_KEYWORDS.get(planet, "life themes")
    ek = ELEMENT_KEYWORDS.get(element, "energy")
    eq = ELEMENT_QUALITIES.get(element, "expressive")
    mk = MODALITY_KEYWORDS.get(modality, "balanced")
    dk = DIGNITY_KEYWORDS.get(dignity, "behaves in a neutral way")
    ds = DIGNITY_STRENGTHS.get(dignity, "balanced")
    polarity_desc = POLARITY_KEYWORDS.get(polarity, "balanced")

    narrative = (
        f"{planet} in {sign} expresses your {pk} through {element.lower()} energy "
        f"({ek}). This placement is {eq} and {mk.lower()} in approach. "
        f"With {polarity.lower()} polarity ({polarity_desc}), the planet {dk}."
    )

    short_narrative = (
        f"{planet} in {sign}: {pk} expressed through {element.lower()} energy, {ds}."
    )

    return {
        "planet": planet,
        "sign": sign,
        "element": element,
        "modality": modality,
        "polarity": polarity,
        "dignity": dignity,
        "narrative": narrative,
        "shortNarrative": short_narrative,
        "keywords": pk,
        "elementKeywords": ek,
        "dignityStatus": ds,
    }


def interpret_all_planets(planets: List[Dict]) -> List[Dict]:
    """Generate interpretations for all planets."""
    return [interpret_planet_in_sign(p) for p in planets]


# =============================================================================
# ELEMENT BALANCE INTERPRETATION
# =============================================================================

def interpret_element_balance(planets: List[Dict]) -> Dict:
    """
    Generate narrative for element balance across the chart.
    """
    counts = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0}

    for p in planets:
        element = p.get("element")
        if element in counts:
            counts[element] += 1

    total = sum(counts.values())
    if total == 0:
        total = 1  # Prevent division by zero

    ratios = {k: round((counts[k] / total) * 100, 1) for k in counts}

    # Find dominant and weakest
    sorted_elements = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    dominant = sorted_elements[0][0]
    weakest = sorted_elements[-1][0]

    # Determine balance type
    max_ratio = max(ratios.values())
    if max_ratio >= 50:
        balance_type = "strongly emphasized"
    elif max_ratio >= 35:
        balance_type = "moderately emphasized"
    else:
        balance_type = "relatively balanced"

    narrative = (
        f"Your chart leans toward {dominant.lower()} energy, suggesting a natural "
        f"orientation toward {ELEMENT_KEYWORDS[dominant]}. "
        f"This element is {balance_type} ({ratios[dominant]}% of placements). "
        f"Your chart may benefit from developing more {weakest.lower()} qualities "
        f"({ELEMENT_KEYWORDS[weakest]}) for balance."
    )

    detailed_breakdown = []
    for elem, count in sorted_elements:
        if count > 0:
            detailed_breakdown.append(
                f"{elem} ({ratios[elem]}%): {ELEMENT_QUALITIES.get(elem, 'expressive')} energy"
            )

    return {
        "counts": counts,
        "ratios": ratios,
        "dominantElement": dominant,
        "weakestElement": weakest,
        "balanceType": balance_type,
        "narrative": narrative,
        "breakdown": detailed_breakdown,
    }


# =============================================================================
# MODALITY BALANCE INTERPRETATION
# =============================================================================

def interpret_modality_balance(planets: List[Dict]) -> Dict:
    """
    Generate narrative for modality balance.
    """
    counts = {"Cardinal": 0, "Fixed": 0, "Mutable": 0}

    for p in planets:
        modality = p.get("modality")
        if modality in counts:
            counts[modality] += 1

    total = sum(counts.values())
    if total == 0:
        total = 1

    ratios = {k: round((counts[k] / total) * 100, 1) for k in counts}

    sorted_modalities = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    dominant = sorted_modalities[0][0]

    descriptions = {
        "Cardinal": "You naturally initiate action, lead projects, and start new ventures.",
        "Fixed": "You naturally sustain effort, maintain focus, and see things through.",
        "Mutable": "You naturally adapt to change, adjust perspectives, and embrace flexibility.",
    }

    narrative = (
        f"Your chart emphasizes {dominant.lower()} energy ({ratios[dominant]}%). "
        f"{descriptions[dominant]} "
        f"The other modalities ({', '.join([m for m in counts.keys() if m != dominant])}) "
        "play supporting roles in how you approach life challenges."
    )

    return {
        "counts": counts,
        "ratios": ratios,
        "dominantModality": dominant,
        "narrative": narrative,
        "description": descriptions.get(dominant, ""),
    }


# =============================================================================
# DIGNITY SUMMARY
# =============================================================================

def interpret_dignities(planets: List[Dict]) -> Dict:
    """
    Summarize planetary dignities across the chart.
    """
    summary = {
        "Exalted": [],
        "Domicile": [],
        "Neutral": [],
        "Detriment": [],
        "Debilitated": []
    }

    for p in planets:
        dignity = p.get("dignity", "Neutral")
        planet = p.get("planet", "Unknown")
        if dignity in summary:
            summary[dignity].append(planet)

    lines = []

    if summary["Exalted"]:
        lines.append(
            f"Strongly supported themes through exalted planets: {', '.join(summary['Exalted'])}. "
            "These areas flow with natural ease and power."
        )

    if summary["Domicile"]:
        lines.append(
            f"Stable, reliable themes through domicile planets: {', '.join(summary['Domicile'])}. "
            "These planets function at their best."
        )

    if summary["Detriment"]:
        lines.append(
            f"Areas of tension or learning through detriment planets: {', '.join(summary['Detriment'])}. "
            "These themes require conscious navigation."
        )

    if summary["Debilitated"]:
        lines.append(
            f"Deep work and growth around debilitated planets: {', '.join(summary['Debilitated'])}. "
            "These areas invite transformation through challenge."
        )

    # Calculate dignity score
    score_map = {"Exalted": 2, "Domicile": 1, "Neutral": 0, "Detriment": -1, "Debilitated": -2}
    total_score = 0
    planet_count = 0

    for dignity, planet_list in summary.items():
        for _ in planet_list:
            total_score += score_map.get(dignity, 0)
            planet_count += 1

    avg_dignity = round(total_score / planet_count, 2) if planet_count > 0 else 0

    if avg_dignity >= 1:
        overall = "Your chart has strong overall planetary dignity, supporting natural flow and ease."
    elif avg_dignity >= 0:
        overall = "Your chart has balanced planetary dignity, with some natural strengths and growth areas."
    else:
        overall = "Your chart contains several challenged placements, inviting conscious growth and development."

    return {
        "byDignity": summary,
        "narrative": " ".join(lines) if lines else "Your planetary dignities are relatively balanced.",
        "averageDignityScore": avg_dignity,
        "overallAssessment": overall,
        "strongPlanets": summary["Exalted"] + summary["Domicile"],
        "challengedPlanets": summary["Detriment"] + summary["Debilitated"],
    }


# =============================================================================
# SYNASTRY OVERLAY INTERPRETATION
# =============================================================================

PLANET_OVERLAY_KEYWORDS = {
    "Sun": "identity, purpose, and vitality",
    "Moon": "emotional needs and comfort",
    "Mercury": "communication and thinking",
    "Venus": "love, affection, and pleasure",
    "Mars": "desire, conflict, and drive",
    "Jupiter": "growth, faith, and optimism",
    "Saturn": "commitment, limits, and responsibility",
    "Uranus": "excitement, freedom, and change",
    "Neptune": "spirituality, dreams, and illusion",
    "Pluto": "transformation, power, and intensity",
}

HOUSE_ACTIVATION_THEMES = {
    1: "their sense of self and personal identity",
    2: "their resources, values, and self-worth",
    3: "their communication, learning, and daily connections",
    4: "their emotional foundation, home, and family",
    5: "their creativity, romance, and self-expression",
    6: "their daily routines, health, and service",
    7: "their partnerships and one-on-one relationships",
    8: "their intimacy, shared resources, and transformation",
    9: "their beliefs, expansion, and life philosophy",
    10: "their career, public image, and life direction",
    11: "their friendships, community, and future vision",
    12: "their spirituality, subconscious, and hidden patterns",
}


def interpret_synastry_overlay(overlay: Dict) -> Dict:
    """
    Interpret a single synastry overlay.
    """
    planet = overlay.get("planet", "Unknown")
    house = overlay.get("house", 1)

    pk = PLANET_OVERLAY_KEYWORDS.get(planet, "life themes")
    house_theme = HOUSE_ACTIVATION_THEMES.get(house, "life area")
    house_meaning = overlay.get("meaning", "")

    narrative = (
        f"Their {planet} activates your House {house}, linking their {pk} "
        f"to {house_theme}. {house_meaning}"
    )

    special = overlay.get("special", "")

    return {
        "planet": planet,
        "house": house,
        "planetTheme": pk,
        "houseTheme": house_theme,
        "narrative": narrative,
        "special": special,
        "intensity": _get_overlay_intensity(planet, house),
    }


def _get_overlay_intensity(planet: str, house: int) -> str:
    """Determine intensity of a synastry overlay."""
    high_intensity = [
        ("Venus", 7), ("Mars", 8), ("Moon", 4), ("Sun", 1),
        ("Pluto", 8), ("Saturn", 7), ("Sun", 7)
    ]

    if (planet, house) in high_intensity:
        return "high"
    elif planet in ["Venus", "Mars", "Moon", "Sun"]:
        return "medium"
    else:
        return "low"


def interpret_synastry_overlays(overlays: List[Dict]) -> Dict:
    """
    Interpret all synastry overlays and generate summary.
    """
    interpreted = [interpret_synastry_overlay(o) for o in overlays]

    # Find high-intensity overlays
    high_intensity = [o for o in interpreted if o["intensity"] == "high"]
    medium_intensity = [o for o in interpreted if o["intensity"] == "medium"]

    # Generate summary
    summary_lines = []

    if high_intensity:
        planets = [o["planet"] for o in high_intensity]
        summary_lines.append(
            f"Key activations through {', '.join(planets)} create strong relational dynamics."
        )

    if medium_intensity:
        planets = [o["planet"] for o in medium_intensity]
        summary_lines.append(
            f"Supporting influences from {', '.join(planets)} add depth to the connection."
        )

    return {
        "overlays": interpreted,
        "highIntensity": high_intensity,
        "mediumIntensity": medium_intensity,
        "summary": " ".join(summary_lines) if summary_lines else "The overlays create a balanced relational dynamic.",
    }


# =============================================================================
# COMPLETE WESTERN INTERPRETATION
# =============================================================================

def build_western_interpretation(
    western_profile: Dict,
    synastry: Optional[Dict] = None
) -> Dict:
    """
    Build complete Western interpretation package.

    western_profile = {
        "planets": [{"planet": "Sun", "sign": "Leo", "element": "Fire", ...}, ...],
        "elements": {...},
        "modalities": {...},
        ...
    }

    synastry = {
        "overlaysAtoB": [...],
        "overlaysBtoA": [...],
    }
    """
    planets = western_profile.get("planets", [])

    # Generate all interpretations
    planet_interpretations = interpret_all_planets(planets)
    element_interpretation = interpret_element_balance(planets)
    modality_interpretation = interpret_modality_balance(planets)
    dignity_interpretation = interpret_dignities(planets)

    # Synastry interpretation if provided
    synastry_interpretation = None
    if synastry:
        a_to_b = interpret_synastry_overlays(synastry.get("overlaysAtoB", []))
        b_to_a = interpret_synastry_overlays(synastry.get("overlaysBtoA", []))
        synastry_interpretation = {
            "AtoB": a_to_b,
            "BtoA": b_to_a,
        }

    # Build overall narrative
    dominant_element = element_interpretation.get("dominantElement", "Fire")
    dominant_modality = modality_interpretation.get("dominantModality", "Cardinal")
    strong_planets = dignity_interpretation.get("strongPlanets", [])

    overall_narrative = (
        f"This chart emphasizes {dominant_element.lower()} energy with a {dominant_modality.lower()} approach. "
    )

    if strong_planets:
        overall_narrative += f"Planets like {', '.join(strong_planets[:3])} are particularly well-placed, "
        overall_narrative += "providing natural strengths and ease in their domains."

    return {
        "planets": planet_interpretations,
        "elements": element_interpretation,
        "modalities": modality_interpretation,
        "dignities": dignity_interpretation,
        "synastry": synastry_interpretation,
        "overallNarrative": overall_narrative,
    }
