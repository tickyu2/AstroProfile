"""
Vedic Astrology Interpretation Layer
Transforms raw chart data into meaningful interpretations
"""

from typing import Dict, List, Optional

from .vedic_constants import (
    LAGNA_INTERPRETATIONS,
    NAKSHATRA_INTERPRETATIONS,
    GRAHA_BASE_THEMES,
    BHAVA_MEANINGS,
    DASHA_PLANET_THEMES,
    GUNA_BY_SIGN,
    GUNA_INTERPRETATIONS,
    DOSHA_BY_SIGN,
    DOSHA_INTERPRETATIONS,
    GRAHA_OWN_SIGNS,
    GRAHA_EXALTATION,
    GRAHA_DEBILITATION,
)


def interpret_lagna(lagna: Dict) -> str:
    """Generate interpretation for the Lagna (Ascendant)"""
    if not lagna or not lagna.get("rashi"):
        return ""

    rashi_sanskrit = lagna["rashi"].get("sanskrit", "")
    base = LAGNA_INTERPRETATIONS.get(rashi_sanskrit, "")

    if not base:
        # Fallback to English name
        rashi_english = lagna["rashi"].get("english", "")
        for key, val in LAGNA_INTERPRETATIONS.items():
            if rashi_english.lower() in val.lower():
                return val
        return f"Your Lagna is in {rashi_sanskrit}, shaping your approach to life and self-expression."

    return base


def interpret_moon_nakshatra(moon_nakshatra: Dict) -> str:
    """Generate interpretation for the Moon's Nakshatra (Janma Nakshatra)"""
    if not moon_nakshatra:
        return ""

    nak_name = moon_nakshatra.get("name", "")
    base = NAKSHATRA_INTERPRETATIONS.get(nak_name, "")

    if not base:
        return f"Your Moon is in {nak_name} Nakshatra, influencing your emotional nature and inner world."

    return base


def interpret_sun_nakshatra(grahas: Dict) -> str:
    """Generate interpretation for the Sun's Nakshatra"""
    sun = grahas.get("surya", {})
    if not sun or not sun.get("nakshatra"):
        return ""

    nak_name = sun["nakshatra"].get("name", "")
    base = NAKSHATRA_INTERPRETATIONS.get(nak_name, "")

    if not base:
        return f"Your Sun is in {nak_name} Nakshatra, shaping your identity and life purpose."

    # Adapt for Sun context
    return f"Sun in {nak_name}: {base}"


def get_graha_dignity(graha_name: str, rashi_sanskrit: str) -> str:
    """Determine the dignity of a graha in its current sign"""
    own_signs = GRAHA_OWN_SIGNS.get(graha_name, [])
    exaltation = GRAHA_EXALTATION.get(graha_name)
    debilitation = GRAHA_DEBILITATION.get(graha_name)

    if rashi_sanskrit in own_signs:
        return "own"
    elif rashi_sanskrit == exaltation:
        return "exalted"
    elif rashi_sanskrit == debilitation:
        return "debilitated"
    else:
        return "neutral"


def interpret_graha_strengths(grahas: Dict) -> List[str]:
    """Generate interpretations for planetary strengths and placements"""
    lines: List[str] = []

    for graha_name, graha_data in grahas.items():
        if not isinstance(graha_data, dict) or "rashi" not in graha_data:
            continue

        rashi = graha_data.get("rashi", {})
        rashi_sanskrit = rashi.get("sanskrit", "")
        rashi_english = rashi.get("english", "")

        base_theme = GRAHA_BASE_THEMES.get(graha_name, "")
        dignity = get_graha_dignity(graha_name, rashi_sanskrit)

        english_name = graha_data.get("english", graha_name.capitalize())

        if dignity == "own":
            lines.append(
                f"{english_name} is in its own sign ({rashi_english}), strengthening its natural qualities and giving confidence in its domain. {base_theme}"
            )
        elif dignity == "exalted":
            lines.append(
                f"{english_name} is exalted in {rashi_english}, powerfully expressing its highest nature. This is a significant strength. {base_theme}"
            )
        elif dignity == "debilitated":
            lines.append(
                f"{english_name} is debilitated in {rashi_english}, requiring conscious effort to balance its energy. Growth comes through working with this challenge. {base_theme}"
            )
        # Skip neutral placements to keep output focused on notable positions

    return lines


def interpret_house_themes(grahas: Dict, bhavas: Dict) -> Dict[str, str]:
    """Generate interpretations for each house based on planets present"""
    house_map: Dict[int, List[str]] = {i: [] for i in range(1, 13)}

    # Map grahas to houses based on their rashi placement in whole sign
    lagna_index = bhavas.get("lagna", {}).get("rashi", {}).get("index", 0)

    for graha_name, graha_data in grahas.items():
        if not isinstance(graha_data, dict) or "rashi" not in graha_data:
            continue

        graha_rashi_index = graha_data.get("rashi", {}).get("index", 0)
        house_num = ((graha_rashi_index - lagna_index + 12) % 12) + 1
        english_name = graha_data.get("english", graha_name.capitalize())
        house_map[house_num].append(english_name)

    result: Dict[str, str] = {}
    for h in range(1, 13):
        base = BHAVA_MEANINGS.get(h, f"House {h}")
        planets_here = house_map[h]

        if planets_here:
            planet_str = ", ".join(planets_here)
            text = f"{base} Activated by: {planet_str}."
        else:
            text = f"{base} No planets here; themes expressed through its lord."

        result[str(h)] = text

    return result


def interpret_dasha_summary(current_dasha: Optional[Dict], grahas: Dict) -> str:
    """Generate interpretation for current Mahadasha period"""
    if not current_dasha:
        return "Dasha information not available."

    planet = current_dasha.get("planet", "")
    start = current_dasha.get("start", "")
    end = current_dasha.get("end", "")

    # Map English planet name to graha key
    planet_key_map = {
        "Sun": "surya", "Moon": "chandra", "Mars": "mangala",
        "Mercury": "budha", "Jupiter": "guru", "Venus": "shukra",
        "Saturn": "shani", "Rahu": "rahu", "Ketu": "ketu"
    }
    graha_key = planet_key_map.get(planet, planet.lower())

    base_theme = DASHA_PLANET_THEMES.get(graha_key, f"{planet} period brings its characteristic themes.")

    # Find placement
    placement = grahas.get(graha_key, {})
    placement_text = ""
    if placement and placement.get("rashi"):
        rashi = placement["rashi"].get("english", "")
        placement_text = f" In your chart, {planet} is placed in {rashi}, shaping how this period unfolds for you."

    return f"Current period: {planet} Mahadasha ({start} to {end}). {base_theme}{placement_text}"


def compute_guna_dosha(lagna: Dict, moon_graha: Dict) -> Dict:
    """Calculate Guna and Dosha temperament from Lagna and Moon signs"""
    lagna_rashi = lagna.get("rashi", {}).get("sanskrit", "")
    moon_rashi = moon_graha.get("rashi", {}).get("sanskrit", "") if moon_graha else ""

    lagna_guna = GUNA_BY_SIGN.get(lagna_rashi, "Rajas")
    moon_guna = GUNA_BY_SIGN.get(moon_rashi, "Rajas")

    lagna_dosha = DOSHA_BY_SIGN.get(lagna_rashi, "Vata")
    moon_dosha = DOSHA_BY_SIGN.get(moon_rashi, "Vata")

    # Weight: Moon has more influence on temperament
    guna_counts = {"Sattva": 0, "Rajas": 0, "Tamas": 0}
    dosha_counts = {"Vata": 0, "Pitta": 0, "Kapha": 0}

    guna_counts[lagna_guna] = guna_counts.get(lagna_guna, 0) + 1
    guna_counts[moon_guna] = guna_counts.get(moon_guna, 0) + 2

    dosha_counts[lagna_dosha] = dosha_counts.get(lagna_dosha, 0) + 1
    dosha_counts[moon_dosha] = dosha_counts.get(moon_dosha, 0) + 2

    dominant_guna = max(guna_counts, key=guna_counts.get)
    dominant_dosha = max(dosha_counts, key=dosha_counts.get)

    return {
        "lagnaGuna": lagna_guna,
        "moonGuna": moon_guna,
        "dominantGuna": dominant_guna,
        "gunaInterpretation": GUNA_INTERPRETATIONS.get(dominant_guna, ""),
        "lagnaDosha": lagna_dosha,
        "moonDosha": moon_dosha,
        "dominantDosha": dominant_dosha,
        "doshaInterpretation": DOSHA_INTERPRETATIONS.get(dominant_dosha, ""),
    }


def interpret_overall_synthesis(
    lagna: Dict,
    grahas: Dict,
    moon_nakshatra: Dict,
    current_dasha: Optional[Dict]
) -> str:
    """Generate overall chart synthesis"""
    parts = []

    # Lagna
    lagna_rashi = lagna.get("rashi", {})
    lagna_sanskrit = lagna_rashi.get("sanskrit", "Unknown")
    lagna_english = lagna_rashi.get("english", "")
    parts.append(
        f"Your {lagna_english} ({lagna_sanskrit}) Lagna shapes how you approach life, presenting yourself with its characteristic qualities."
    )

    # Moon Nakshatra
    if moon_nakshatra:
        nak_name = moon_nakshatra.get("name", "")
        parts.append(
            f"Your Moon in {nak_name} Nakshatra describes your emotional wiring and instinctive responses."
        )

    # Strong planets
    strong_grahas = []
    for name, data in grahas.items():
        if not isinstance(data, dict) or "rashi" not in data:
            continue
        rashi_sanskrit = data.get("rashi", {}).get("sanskrit", "")
        dignity = get_graha_dignity(name, rashi_sanskrit)
        if dignity in ("own", "exalted"):
            english = data.get("english", name.capitalize())
            strong_grahas.append(english)

    if strong_grahas:
        parts.append(
            f"Notable strength in {', '.join(strong_grahas)} gives these planets a major role in your life story."
        )

    # Current Dasha
    if current_dasha:
        planet = current_dasha.get("planet", "")
        parts.append(
            f"Your current {planet} Mahadasha sets the overarching theme of this chapter in your life."
        )

    return " ".join(parts)


def build_interpretations(vedic_chart: Dict) -> Dict:
    """Build complete interpretation layer from Vedic chart data"""
    grahas = vedic_chart.get("grahas", {})
    bhavas = vedic_chart.get("bhavas", {})
    lagna = vedic_chart.get("lagna", bhavas.get("lagna", {}))
    moon_nakshatra = vedic_chart.get("moonNakshatra", {})

    # Get moon graha for temperament
    moon_graha = grahas.get("chandra", {})

    # Dasha info (if available)
    dashas = vedic_chart.get("dashas", {})
    current_dasha = dashas.get("current") if dashas else None

    # Build temperament
    temperament = compute_guna_dosha(lagna, moon_graha)

    return {
        "lagna": interpret_lagna(lagna),
        "moonNakshatra": interpret_moon_nakshatra(moon_nakshatra),
        "sunNakshatra": interpret_sun_nakshatra(grahas),
        "grahaStrengths": interpret_graha_strengths(grahas),
        "houseThemes": interpret_house_themes(grahas, bhavas),
        "dashaSummary": interpret_dasha_summary(current_dasha, grahas),
        "overallSynthesis": interpret_overall_synthesis(lagna, grahas, moon_nakshatra, current_dasha),
        "temperament": temperament,
    }
