"""
Vedic Compatibility Engine
Guna/Dosha compatibility matrices, relationship support/challenges analysis
"""

from typing import Dict, List, Tuple

# ============================================================================
# GUNA COMPATIBILITY MATRIX
# ============================================================================

GUNA_COMPATIBILITY_MATRIX = {
    ("Sattva", "Sattva"): ("Excellent", 90),
    ("Sattva", "Rajas"): ("Good", 75),
    ("Sattva", "Tamas"): ("Challenging", 55),

    ("Rajas", "Sattva"): ("Good", 75),
    ("Rajas", "Rajas"): ("Moderate", 65),
    ("Rajas", "Tamas"): ("Good", 70),

    ("Tamas", "Sattva"): ("Challenging", 55),
    ("Tamas", "Rajas"): ("Good", 70),
    ("Tamas", "Tamas"): ("Low", 50),
}

# ============================================================================
# DOSHA COMPATIBILITY MATRIX
# ============================================================================

DOSHA_COMPATIBILITY_MATRIX = {
    ("Vata", "Vata"): ("Low", 50),
    ("Vata", "Pitta"): ("Good", 75),
    ("Vata", "Kapha"): ("Excellent", 90),

    ("Pitta", "Vata"): ("Good", 75),
    ("Pitta", "Pitta"): ("Challenging", 55),
    ("Pitta", "Kapha"): ("Good", 70),

    ("Kapha", "Vata"): ("Excellent", 90),
    ("Kapha", "Pitta"): ("Good", 70),
    ("Kapha", "Kapha"): ("Moderate", 65),
}

# ============================================================================
# GUNA/DOSHA COMPATIBILITY FUNCTIONS
# ============================================================================


def compute_guna_compatibility(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Guna (mental temperament) compatibility between two people.

    Args:
        personA: Chart data with temperament.dominantGuna
        personB: Chart data with temperament.dominantGuna

    Returns:
        Compatibility result with score and explanation
    """
    gunaA = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    gunaB = personB.get("temperament", {}).get("dominantGuna", "Rajas")

    label, score = GUNA_COMPATIBILITY_MATRIX.get((gunaA, gunaB), ("Moderate", 65))

    return {
        "gunaA": gunaA,
        "gunaB": gunaB,
        "compatibilityLabel": label,
        "compatibilityScore": score,
        "explanation": f"{gunaA} + {gunaB} creates a {label.lower()} match with a score of {score}."
    }


def compute_dosha_compatibility(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Dosha (Ayurvedic constitution) compatibility between two people.

    Args:
        personA: Chart data with temperament.dominantDosha
        personB: Chart data with temperament.dominantDosha

    Returns:
        Compatibility result with score and explanation
    """
    doshaA = personA.get("temperament", {}).get("dominantDosha", "Vata")
    doshaB = personB.get("temperament", {}).get("dominantDosha", "Vata")

    label, score = DOSHA_COMPATIBILITY_MATRIX.get((doshaA, doshaB), ("Moderate", 65))

    return {
        "doshaA": doshaA,
        "doshaB": doshaB,
        "compatibilityLabel": label,
        "compatibilityScore": score,
        "explanation": f"{doshaA} + {doshaB} creates a {label.lower()} match with a score of {score}."
    }


def build_temperament_heatmap(personA: Dict, personB: Dict) -> Dict:
    """
    Build a temperament compatibility heatmap for visualization.

    Args:
        personA: Chart data with temperament
        personB: Chart data with temperament

    Returns:
        Heatmap data structure for frontend
    """
    gunaA = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    gunaB = personB.get("temperament", {}).get("dominantGuna", "Rajas")
    doshaA = personA.get("temperament", {}).get("dominantDosha", "Vata")
    doshaB = personB.get("temperament", {}).get("dominantDosha", "Vata")

    guna_label, guna_score = GUNA_COMPATIBILITY_MATRIX.get((gunaA, gunaB), ("Moderate", 65))
    dosha_label, dosha_score = DOSHA_COMPATIBILITY_MATRIX.get((doshaA, doshaB), ("Moderate", 65))

    return {
        "guna": {
            "A": gunaA,
            "B": gunaB,
            "score": guna_score,
            "label": guna_label
        },
        "dosha": {
            "A": doshaA,
            "B": doshaB,
            "score": dosha_score,
            "label": dosha_label
        },
        "overallScore": round((guna_score + dosha_score) / 2),
        "overallLabel": _get_overall_label((guna_score + dosha_score) / 2)
    }


def _get_overall_label(score: float) -> str:
    """Get label for overall score"""
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 60:
        return "Moderate"
    elif score >= 50:
        return "Challenging"
    else:
        return "Low"


# ============================================================================
# RELATIONSHIP SUPPORT ANALYSIS
# ============================================================================


def build_relationship_support(personA: Dict, personB: Dict) -> Dict:
    """
    Build the "What supports this relationship?" analysis.

    Synthesizes:
    - Guna compatibility
    - Dosha compatibility
    - Elemental synergy (Western)
    - Yin/Yang polarity
    - Graha strengths
    - House overlays
    - Nakshatra resonance
    - Dasha timing

    Args:
        personA: Complete chart data for person A
        personB: Complete chart data for person B

    Returns:
        Support analysis with factors and summary
    """
    support_lines: List[str] = []

    # --- Guna ---
    gunaA = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    gunaB = personB.get("temperament", {}).get("dominantGuna", "Rajas")
    _, guna_score = GUNA_COMPATIBILITY_MATRIX.get((gunaA, gunaB), ("Moderate", 65))

    if guna_score >= 80:
        support_lines.append("Your temperaments harmonize naturally, creating ease and mutual understanding.")
    elif guna_score >= 70:
        support_lines.append("Your temperaments complement each other, giving the relationship dynamism and balance.")
    else:
        support_lines.append("Your different temperaments create growth opportunities that strengthen the bond over time.")

    # --- Dosha ---
    doshaA = personA.get("temperament", {}).get("dominantDosha", "Vata")
    doshaB = personB.get("temperament", {}).get("dominantDosha", "Vata")
    dosha_pair = (doshaA, doshaB)

    if dosha_pair in [("Vata", "Kapha"), ("Kapha", "Vata")]:
        support_lines.append("One brings creativity while the other brings stability, forming a naturally supportive rhythm.")
    elif dosha_pair in [("Pitta", "Kapha"), ("Kapha", "Pitta")]:
        support_lines.append("One brings drive while the other brings calm, creating a balanced emotional climate.")
    elif dosha_pair in [("Vata", "Pitta"), ("Pitta", "Vata")]:
        support_lines.append("One brings creativity while the other brings direction, forming a dynamic partnership.")
    elif doshaA == doshaB:
        support_lines.append("You share a similar constitutional rhythm, making daily life flow more easily.")

    # --- Elemental synergy (Western) ---
    elemA = personA.get("western", {}).get("dominantElement", "")
    elemB = personB.get("western", {}).get("dominantElement", "")

    if (elemA, elemB) in [("Fire", "Air"), ("Air", "Fire")]:
        support_lines.append("There is strong inspiration and mental stimulation between you.")
    if (elemA, elemB) in [("Earth", "Water"), ("Water", "Earth")]:
        support_lines.append("You create emotional safety and long-term stability together.")
    if (elemA, elemB) in [("Fire", "Fire")]:
        support_lines.append("Shared fire energy creates passion, enthusiasm, and mutual inspiration.")
    if (elemA, elemB) in [("Water", "Water")]:
        support_lines.append("Shared water energy creates deep emotional understanding and empathy.")

    # --- Yin/Yang polarity ---
    polarityA = personA.get("western", {}).get("polarity", "")
    polarityB = personB.get("western", {}).get("polarity", "")

    if polarityA and polarityB and polarityA != polarityB:
        support_lines.append("Your differences create magnetic attraction and complementarity.")

    # --- Graha strengths ---
    grahasA = personA.get("grahas", {})
    grahasB = personB.get("grahas", {})

    strongA = _get_strong_grahas(grahasA)
    strongB = _get_strong_grahas(grahasB)

    if "shukra" in strongA and "shukra" in strongB:
        support_lines.append("Venus supports affection, harmony, and shared enjoyment.")
    if "guru" in strongA and "guru" in strongB:
        support_lines.append("Jupiter brings wisdom, generosity, and shared growth.")
    if "chandra" in strongA and "chandra" in strongB:
        support_lines.append("Strong Moons support emotional attunement and nurturing connection.")

    # --- House overlays ---
    lagnaA = personA.get("lagna", {}).get("rashi", {}).get("index", 0)

    for graha_name, graha_data in grahasB.items():
        if not isinstance(graha_data, dict) or "rashi" not in graha_data:
            continue
        graha_index = graha_data.get("rashi", {}).get("index", 0)
        house = ((graha_index - lagnaA + 12) % 12) + 1

        if house == 7 and graha_name in ["shukra", "guru", "chandra"]:
            support_lines.append("They activate your partnership house with benefic energy, supporting commitment and connection.")
            break

    # --- Nakshatra resonance ---
    moonNakA = personA.get("moonNakshatra", {}).get("lord", "")
    moonNakB = personB.get("moonNakshatra", {}).get("lord", "")

    if moonNakA and moonNakB and moonNakA == moonNakB:
        support_lines.append("You share a similar emotional language through your Nakshatra resonance.")

    # --- Dasha timing ---
    dashaA = personA.get("dashas", {}).get("current", {}).get("planet", "")
    dashaB = personB.get("dashas", {}).get("current", {}).get("planet", "")
    benefic_dashas = ["Jupiter", "Venus", "Moon", "Mercury"]

    if dashaA in benefic_dashas and dashaB in benefic_dashas:
        support_lines.append("Your current life chapters support harmony and mutual progress.")

    return {
        "supportingFactors": support_lines,
        "summary": " ".join(support_lines) if support_lines else "Your charts show potential for connection and growth."
    }


def _get_strong_grahas(grahas: Dict) -> set:
    """Extract grahas that are in own sign or exalted"""
    strong = set()

    own_signs = {
        "surya": ["Simha"],
        "chandra": ["Karka"],
        "mangala": ["Mesha", "Vrishchika"],
        "budha": ["Mithuna", "Kanya"],
        "guru": ["Dhanu", "Meena"],
        "shukra": ["Vrishabha", "Tula"],
        "shani": ["Makara", "Kumbha"],
    }

    exaltation = {
        "surya": "Mesha",
        "chandra": "Vrishabha",
        "mangala": "Makara",
        "budha": "Kanya",
        "guru": "Karka",
        "shukra": "Meena",
        "shani": "Tula",
    }

    for name, data in grahas.items():
        if not isinstance(data, dict) or "rashi" not in data:
            continue

        rashi = data.get("rashi", {}).get("sanskrit", "")

        if rashi in own_signs.get(name, []):
            strong.add(name)
        elif rashi == exaltation.get(name, ""):
            strong.add(name)

    return strong


# ============================================================================
# RELATIONSHIP CHALLENGES ANALYSIS
# ============================================================================


def build_relationship_challenges(personA: Dict, personB: Dict) -> Dict:
    """
    Build the "What challenges this relationship?" analysis.

    Synthesizes:
    - Guna friction
    - Dosha aggravation
    - Elemental clashes
    - Yin/Yang mismatch
    - Graha conflicts
    - House overlays (6th, 8th, 12th)
    - Nakshatra incompatibility
    - Dasha timing conflicts

    Args:
        personA: Complete chart data for person A
        personB: Complete chart data for person B

    Returns:
        Challenge analysis with factors and summary
    """
    challenges: List[str] = []

    # --- Guna friction ---
    gunaA = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    gunaB = personB.get("temperament", {}).get("dominantGuna", "Rajas")
    _, guna_score = GUNA_COMPATIBILITY_MATRIX.get((gunaA, gunaB), ("Moderate", 65))

    if guna_score <= 60:
        challenges.append("Your temperaments operate at different speeds, creating misunderstandings or mismatched expectations.")

    if (gunaA, gunaB) in [("Sattva", "Tamas"), ("Tamas", "Sattva")]:
        challenges.append("One seeks clarity while the other seeks depth, which can create emotional misalignment.")

    if gunaA == gunaB == "Rajas":
        challenges.append("Both of you have active, restless temperaments that can lead to conflict or competition.")

    # --- Dosha aggravation ---
    doshaA = personA.get("temperament", {}).get("dominantDosha", "Vata")
    doshaB = personB.get("temperament", {}).get("dominantDosha", "Vata")

    if doshaA == doshaB == "Vata":
        challenges.append("Both of you have fast, irregular rhythms that can lead to anxiety or instability.")
    if doshaA == doshaB == "Pitta":
        challenges.append("Both of you have strong wills and intensity, which can escalate into conflict.")
    if doshaA == doshaB == "Kapha":
        challenges.append("Both of you may avoid confrontation, leading to stagnation or unspoken issues.")

    # --- Elemental clashes ---
    elemA = personA.get("western", {}).get("dominantElement", "")
    elemB = personB.get("western", {}).get("dominantElement", "")

    if (elemA, elemB) in [("Fire", "Water"), ("Water", "Fire")]:
        challenges.append("Emotional intensity and passion may clash, creating volatility.")
    if (elemA, elemB) in [("Air", "Earth"), ("Earth", "Air")]:
        challenges.append("One seeks ideas while the other seeks stability, causing mismatched priorities.")

    # --- Yin/Yang mismatch ---
    polarityA = personA.get("western", {}).get("polarity", "")
    polarityB = personB.get("western", {}).get("polarity", "")

    if polarityA and polarityB and polarityA == polarityB:
        challenges.append("You share a similar polarity, which can create stagnation or lack of spark.")

    # --- Graha conflicts ---
    grahasA = personA.get("grahas", {})
    grahasB = personB.get("grahas", {})

    strongA = _get_strong_grahas(grahasA)
    strongB = _get_strong_grahas(grahasB)

    if "mangala" in strongA and "mangala" in strongB:
        challenges.append("Strong Mars in both charts can create arguments, competition, or power struggles.")

    if ("shani" in strongA and "chandra" in strongB) or ("chandra" in strongA and "shani" in strongB):
        challenges.append("Saturn-Moon tension can create emotional distance or differing needs for security.")

    if ("rahu" in strongA and "surya" in strongB) or ("surya" in strongA and "rahu" in strongB):
        challenges.append("Rahu-Sun dynamics may challenge ego balance or leadership roles.")

    # --- House overlays (challenging houses) ---
    lagnaA = personA.get("lagna", {}).get("rashi", {}).get("index", 0)

    challenging_overlays = {6: False, 8: False, 12: False}

    for graha_name, graha_data in grahasB.items():
        if not isinstance(graha_data, dict) or "rashi" not in graha_data:
            continue
        graha_index = graha_data.get("rashi", {}).get("index", 0)
        house = ((graha_index - lagnaA + 12) % 12) + 1

        if house in challenging_overlays:
            challenging_overlays[house] = True

    if challenging_overlays[6]:
        challenges.append("They activate your 6th house, bringing themes of work, conflict, or imbalance.")
    if challenging_overlays[8]:
        challenges.append("They activate your 8th house, intensifying emotions and triggering deep transformation.")
    if challenging_overlays[12]:
        challenges.append("They activate your 12th house, creating confusion, distance, or hidden dynamics.")

    # --- Nakshatra mismatch ---
    moonNakA = personA.get("moonNakshatra", {})
    moonNakB = personB.get("moonNakshatra", {})

    ganaA = _get_nakshatra_gana(moonNakA.get("name", ""))
    ganaB = _get_nakshatra_gana(moonNakB.get("name", ""))

    if ganaA and ganaB and ganaA != ganaB:
        if (ganaA == "Deva" and ganaB == "Rakshasa") or (ganaA == "Rakshasa" and ganaB == "Deva"):
            challenges.append("Your Nakshatra temperaments differ significantly, creating emotional misunderstandings.")

    # --- Dasha timing ---
    dashaA = personA.get("dashas", {}).get("current", {}).get("planet", "")
    dashaB = personB.get("dashas", {}).get("current", {}).get("planet", "")

    difficult_dashas = ["Saturn", "Ketu", "Rahu"]
    easy_dashas = ["Venus", "Jupiter", "Moon"]

    if (dashaA in difficult_dashas and dashaB in easy_dashas) or \
       (dashaB in difficult_dashas and dashaA in easy_dashas):
        challenges.append("Your current life chapters move at different emotional speeds, creating timing friction.")

    return {
        "challengeFactors": challenges,
        "summary": " ".join(challenges) if challenges else "Your charts show natural compatibility with minimal friction."
    }


def _get_nakshatra_gana(nakshatra_name: str) -> str:
    """Get the Gana (temperament type) for a nakshatra"""
    deva_nakshatras = [
        "Ashwini", "Mrigashira", "Punarvasu", "Pushya", "Hasta",
        "Swati", "Anuradha", "Shravana", "Revati"
    ]
    rakshasa_nakshatras = [
        "Krittika", "Ashlesha", "Magha", "Chitra", "Vishakha",
        "Jyeshtha", "Mula", "Dhanishta", "Shatabhisha"
    ]
    # Rest are Manushya

    if nakshatra_name in deva_nakshatras:
        return "Deva"
    elif nakshatra_name in rakshasa_nakshatras:
        return "Rakshasa"
    else:
        return "Manushya"


# ============================================================================
# COMPLETE VEDIC COMPATIBILITY ANALYSIS
# ============================================================================


def compute_vedic_compatibility(personA: Dict, personB: Dict) -> Dict:
    """
    Compute complete Vedic compatibility analysis between two people.

    Args:
        personA: Complete Vedic chart data for person A
        personB: Complete Vedic chart data for person B

    Returns:
        Complete compatibility analysis with all layers
    """
    guna = compute_guna_compatibility(personA, personB)
    dosha = compute_dosha_compatibility(personA, personB)
    heatmap = build_temperament_heatmap(personA, personB)
    support = build_relationship_support(personA, personB)
    challenges = build_relationship_challenges(personA, personB)

    # Calculate overall score
    overall_score = round((guna["compatibilityScore"] + dosha["compatibilityScore"]) / 2)

    return {
        "gunaCompatibility": guna,
        "doshaCompatibility": dosha,
        "temperamentHeatmap": heatmap,
        "relationshipSupport": support,
        "relationshipChallenges": challenges,
        "overallScore": overall_score,
        "overallLabel": _get_overall_label(overall_score)
    }


# ============================================================================
# RELATIONSHIP POLARITY MAP
# 5-axis compatibility diagram: Guna, Dosha, Element, Yin/Yang, Graha Dominance
# ============================================================================

# Polarity classification matrices
GUNA_POLARITY_MATRIX = {
    ("Sattva", "Sattva"): ("Resonant", "Deep alignment in values, clarity, and purpose"),
    ("Sattva", "Rajas"): ("Activating", "Clarity meets action, creating inspired movement"),
    ("Sattva", "Tamas"): ("Frictional", "Light and shadow create tension but potential growth"),
    ("Rajas", "Sattva"): ("Activating", "Action seeks guidance from clarity"),
    ("Rajas", "Rajas"): ("Amplifying", "Mutual drive creates intensity and competition"),
    ("Rajas", "Tamas"): ("Complementary", "Energy meets grounding, balancing extremes"),
    ("Tamas", "Sattva"): ("Frictional", "Depth resists clarity, creating transformation"),
    ("Tamas", "Rajas"): ("Complementary", "Grounding meets energy, stabilizing action"),
    ("Tamas", "Tamas"): ("Resonant", "Deep inertia, shared comfort in stillness"),
}

DOSHA_POLARITY_MATRIX = {
    ("Vata", "Vata"): ("Amplifying", "Double air creates instability, needs grounding"),
    ("Vata", "Pitta"): ("Activating", "Air feeds fire, creating inspiration and volatility"),
    ("Vata", "Kapha"): ("Balancing", "Movement meets stability, perfect complementarity"),
    ("Pitta", "Vata"): ("Activating", "Fire seeks air, dynamic but intense"),
    ("Pitta", "Pitta"): ("Amplifying", "Double fire creates passion and conflict"),
    ("Pitta", "Kapha"): ("Cooling", "Fire meets water/earth, tempering intensity"),
    ("Kapha", "Vata"): ("Balancing", "Stability grounds movement, nurturing flow"),
    ("Kapha", "Pitta"): ("Cooling", "Earth/water soothes fire, calming presence"),
    ("Kapha", "Kapha"): ("Amplifying", "Double earth/water creates stagnation risk"),
}

ELEMENT_POLARITY_MATRIX = {
    ("Fire", "Fire"): ("Amplifying", "Mutual passion and inspiration, risk of burnout"),
    ("Fire", "Earth"): ("Stabilizing", "Passion meets practicality, grounding enthusiasm"),
    ("Fire", "Air"): ("Harmonizing", "Natural synergy, ideas fuel action"),
    ("Fire", "Water"): ("Volatile", "Steam and tension, intense transformation"),
    ("Earth", "Fire"): ("Stabilizing", "Structure channels energy productively"),
    ("Earth", "Earth"): ("Resonant", "Shared values, stability, and patience"),
    ("Earth", "Air"): ("Frictional", "Practical vs theoretical tension"),
    ("Earth", "Water"): ("Harmonizing", "Natural nurturing, fertile ground"),
    ("Air", "Fire"): ("Harmonizing", "Inspiration meets action, creative synergy"),
    ("Air", "Earth"): ("Frictional", "Ideas vs reality, philosophical tension"),
    ("Air", "Air"): ("Dispersed", "Too much thought, needs grounding"),
    ("Air", "Water"): ("Mixed", "Mind meets emotion, variable connection"),
    ("Water", "Fire"): ("Volatile", "Emotion clashes with will, transformation"),
    ("Water", "Earth"): ("Harmonizing", "Emotion nurtures stability"),
    ("Water", "Air"): ("Mixed", "Feeling seeks understanding, variable"),
    ("Water", "Water"): ("Amplifying", "Deep emotional resonance, risk of drowning"),
}

YINYANG_POLARITY_MATRIX = {
    ("Yang", "Yang"): ("Parallel", "Both project outward, competition for space"),
    ("Yang", "Yin"): ("Magnetic", "Natural attraction, complementary energies"),
    ("Yin", "Yang"): ("Magnetic", "Receptive meets projective, balance"),
    ("Yin", "Yin"): ("Parallel", "Both receive, may lack initiative"),
}

# Graha dominance axis pairs
GRAHA_AXIS_PAIRS = {
    ("shukra", "mangala"): ("Passion Axis", "Venus-Mars creates romantic/sexual polarity"),
    ("mangala", "shukra"): ("Passion Axis", "Mars-Venus creates pursuit and desire"),
    ("shani", "chandra"): ("Stability-Emotion Axis", "Saturn-Moon creates security vs feeling tension"),
    ("chandra", "shani"): ("Stability-Emotion Axis", "Moon-Saturn creates nurturing vs structure"),
    ("guru", "budha"): ("Wisdom-Communication Axis", "Jupiter-Mercury creates teaching and learning"),
    ("budha", "guru"): ("Wisdom-Communication Axis", "Mercury-Jupiter creates inquiry and expansion"),
    ("surya", "chandra"): ("Identity-Emotion Axis", "Sun-Moon creates self vs needs dynamic"),
    ("chandra", "surya"): ("Identity-Emotion Axis", "Moon-Sun creates emotional attunement to will"),
    ("guru", "shukra"): ("Expansion-Pleasure Axis", "Jupiter-Venus creates abundance and joy"),
    ("shukra", "guru"): ("Expansion-Pleasure Axis", "Venus-Jupiter creates beauty and wisdom"),
}


def compute_guna_polarity(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Guna polarity between two people.
    Returns: Resonant, Complementary, Activating, or Frictional
    """
    gunaA = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    gunaB = personB.get("temperament", {}).get("dominantGuna", "Rajas")

    polarity, description = GUNA_POLARITY_MATRIX.get(
        (gunaA, gunaB),
        ("Mixed", "Variable guna interaction")
    )

    return {
        "axis": "Guna",
        "personA": gunaA,
        "personB": gunaB,
        "polarity": polarity,
        "description": description,
        "color": _get_polarity_color(polarity)
    }


def compute_dosha_polarity(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Dosha polarity between two people.
    Returns: Balancing, Cooling, Amplifying, or Mixed
    """
    doshaA = personA.get("temperament", {}).get("dominantDosha", "Vata")
    doshaB = personB.get("temperament", {}).get("dominantDosha", "Vata")

    polarity, description = DOSHA_POLARITY_MATRIX.get(
        (doshaA, doshaB),
        ("Mixed", "Variable dosha interaction")
    )

    return {
        "axis": "Dosha",
        "personA": doshaA,
        "personB": doshaB,
        "polarity": polarity,
        "description": description,
        "color": _get_polarity_color(polarity)
    }


def compute_element_polarity(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Western elemental polarity between two people.
    Returns: Harmonizing, Stabilizing, Volatile, Dispersed, or Mixed
    """
    elemA = personA.get("western", {}).get("dominantElement", "Fire")
    elemB = personB.get("western", {}).get("dominantElement", "Fire")

    polarity, description = ELEMENT_POLARITY_MATRIX.get(
        (elemA, elemB),
        ("Mixed", "Variable elemental interaction")
    )

    return {
        "axis": "Element",
        "personA": elemA,
        "personB": elemB,
        "polarity": polarity,
        "description": description,
        "color": _get_polarity_color(polarity)
    }


def compute_yinyang_polarity(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Yin/Yang polarity between two people.
    Returns: Magnetic or Parallel
    """
    polarityA = personA.get("western", {}).get("polarity", "Yang")
    polarityB = personB.get("western", {}).get("polarity", "Yang")

    polarity, description = YINYANG_POLARITY_MATRIX.get(
        (polarityA, polarityB),
        ("Mixed", "Variable polarity interaction")
    )

    return {
        "axis": "Yin/Yang",
        "personA": polarityA,
        "personB": polarityB,
        "polarity": polarity,
        "description": description,
        "color": _get_polarity_color(polarity)
    }


def compute_graha_polarity(personA: Dict, personB: Dict) -> Dict:
    """
    Compute Graha dominance polarity between two people.
    Identifies the strongest graha in each chart and determines the axis.
    """
    grahasA = personA.get("grahas", {})
    grahasB = personB.get("grahas", {})

    # Get strongest graha for each person
    strongA = _get_strongest_graha(grahasA)
    strongB = _get_strongest_graha(grahasB)

    # Check for known axis pairs
    axis_result = GRAHA_AXIS_PAIRS.get(
        (strongA, strongB),
        None
    )

    if axis_result:
        axis_name, description = axis_result
        return {
            "axis": "Graha Dominance",
            "personA": strongA.capitalize() if strongA else "Unknown",
            "personB": strongB.capitalize() if strongB else "Unknown",
            "polarity": axis_name,
            "description": description,
            "color": _get_graha_axis_color(axis_name)
        }

    # Default: determine based on graha natures
    polarity = _get_graha_nature_polarity(strongA, strongB)

    return {
        "axis": "Graha Dominance",
        "personA": strongA.capitalize() if strongA else "Unknown",
        "personB": strongB.capitalize() if strongB else "Unknown",
        "polarity": polarity,
        "description": f"{strongA.capitalize() if strongA else 'Unknown'}-{strongB.capitalize() if strongB else 'Unknown'} creates {polarity.lower()} dynamics",
        "color": _get_polarity_color(polarity)
    }


def _get_strongest_graha(grahas: Dict) -> str:
    """
    Determine the strongest graha in a chart based on dignity.
    Priority: exalted > own sign > other
    """
    exaltation = {
        "surya": "Mesha",
        "chandra": "Vrishabha",
        "mangala": "Makara",
        "budha": "Kanya",
        "guru": "Karka",
        "shukra": "Meena",
        "shani": "Tula",
    }

    own_signs = {
        "surya": ["Simha"],
        "chandra": ["Karka"],
        "mangala": ["Mesha", "Vrishchika"],
        "budha": ["Mithuna", "Kanya"],
        "guru": ["Dhanu", "Meena"],
        "shukra": ["Vrishabha", "Tula"],
        "shani": ["Makara", "Kumbha"],
    }

    exalted_grahas = []
    own_sign_grahas = []
    other_grahas = []

    for name, data in grahas.items():
        if not isinstance(data, dict) or "rashi" not in data:
            continue

        rashi = data.get("rashi", {}).get("sanskrit", "")

        if rashi == exaltation.get(name, ""):
            exalted_grahas.append(name)
        elif rashi in own_signs.get(name, []):
            own_sign_grahas.append(name)
        else:
            other_grahas.append(name)

    # Priority order
    if exalted_grahas:
        # Prefer relationship-relevant grahas
        priority = ["shukra", "chandra", "guru", "mangala", "surya", "budha", "shani"]
        for graha in priority:
            if graha in exalted_grahas:
                return graha
        return exalted_grahas[0]

    if own_sign_grahas:
        priority = ["shukra", "chandra", "guru", "mangala", "surya", "budha", "shani"]
        for graha in priority:
            if graha in own_sign_grahas:
                return graha
        return own_sign_grahas[0]

    # Default to Venus or Moon as relationship significators
    if "shukra" in grahas:
        return "shukra"
    if "chandra" in grahas:
        return "chandra"

    return list(grahas.keys())[0] if grahas else "chandra"


def _get_graha_nature_polarity(grahaA: str, grahaB: str) -> str:
    """Determine polarity based on graha natures"""
    benefics = {"guru", "shukra", "chandra", "budha"}
    malefics = {"surya", "mangala", "shani", "rahu", "ketu"}

    if grahaA in benefics and grahaB in benefics:
        return "Harmonious"
    elif grahaA in malefics and grahaB in malefics:
        return "Intense"
    else:
        return "Dynamic"


def _get_polarity_color(polarity: str) -> str:
    """Get color code for polarity type"""
    colors = {
        "Resonant": "#10B981",      # emerald
        "Harmonizing": "#10B981",   # emerald
        "Balancing": "#06B6D4",     # cyan
        "Cooling": "#06B6D4",       # cyan
        "Magnetic": "#8B5CF6",      # violet
        "Complementary": "#3B82F6", # blue
        "Activating": "#F59E0B",    # amber
        "Dynamic": "#F59E0B",       # amber
        "Stabilizing": "#6366F1",   # indigo
        "Amplifying": "#EF4444",    # red
        "Volatile": "#EF4444",      # red
        "Intense": "#EF4444",       # red
        "Frictional": "#F97316",    # orange
        "Parallel": "#94A3B8",      # slate
        "Dispersed": "#94A3B8",     # slate
        "Mixed": "#64748B",         # gray
        "Harmonious": "#10B981",    # emerald
    }
    return colors.get(polarity, "#64748B")


def _get_graha_axis_color(axis_name: str) -> str:
    """Get color code for graha axis type"""
    colors = {
        "Passion Axis": "#EC4899",           # pink
        "Stability-Emotion Axis": "#6366F1", # indigo
        "Wisdom-Communication Axis": "#8B5CF6", # violet
        "Identity-Emotion Axis": "#F59E0B",  # amber
        "Expansion-Pleasure Axis": "#10B981", # emerald
    }
    return colors.get(axis_name, "#64748B")


def build_polarity_map(personA: Dict, personB: Dict) -> Dict:
    """
    Build the complete 5-axis Relationship Polarity Map.

    Axes:
    1. Guna Polarity - Resonant/Complementary/Activating/Frictional
    2. Dosha Polarity - Balancing/Cooling/Amplifying/Mixed
    3. Element Polarity - Harmonizing/Stabilizing/Volatile/Dispersed
    4. Yin/Yang Polarity - Magnetic/Parallel
    5. Graha Dominance Polarity - Various axis types

    Args:
        personA: Complete chart data for person A
        personB: Complete chart data for person B

    Returns:
        Polarity map with all 5 axes and narrative summary
    """
    guna = compute_guna_polarity(personA, personB)
    dosha = compute_dosha_polarity(personA, personB)
    element = compute_element_polarity(personA, personB)
    yinyang = compute_yinyang_polarity(personA, personB)
    graha = compute_graha_polarity(personA, personB)

    axes = [guna, dosha, element, yinyang, graha]

    # Calculate harmony score (how many axes are positive)
    positive_polarities = {"Resonant", "Harmonizing", "Balancing", "Cooling", "Magnetic", "Complementary", "Harmonious"}
    challenging_polarities = {"Amplifying", "Volatile", "Frictional", "Intense"}

    positive_count = sum(1 for axis in axes if axis["polarity"] in positive_polarities)
    challenging_count = sum(1 for axis in axes if axis["polarity"] in challenging_polarities)

    harmony_score = round((positive_count / 5) * 100)

    # Build narrative summary
    narrative = _build_polarity_narrative(axes, harmony_score)

    # Compute weighted polarity score (0-100)
    weighted_score = compute_weighted_polarity_score(axes)

    # Build the base polarity map
    polarity_map = {
        "axes": axes,
        "harmonyScore": harmony_score,
        "positiveAxes": positive_count,
        "challengingAxes": challenging_count,
        "neutralAxes": 5 - positive_count - challenging_count,
        "narrative": narrative,
        "dominantPolarity": _get_dominant_polarity(axes),
        "polarityScore": weighted_score
    }

    # Compute the polarity archetype
    archetype = build_polarity_archetype(personA, personB, polarity_map)
    polarity_map["archetype"] = archetype

    return polarity_map


def _get_dominant_polarity(axes: List[Dict]) -> str:
    """Determine the dominant polarity across all axes"""
    polarity_counts = {}
    for axis in axes:
        p = axis["polarity"]
        polarity_counts[p] = polarity_counts.get(p, 0) + 1

    if polarity_counts:
        return max(polarity_counts, key=polarity_counts.get)
    return "Mixed"


def _build_polarity_narrative(axes: List[Dict], harmony_score: int) -> str:
    """Build a narrative summary of the polarity map"""
    narratives = []

    # Overall assessment
    if harmony_score >= 80:
        narratives.append("Your energies meet in remarkable harmony across multiple dimensions.")
    elif harmony_score >= 60:
        narratives.append("Your connection shows strong complementarity with room for conscious growth.")
    elif harmony_score >= 40:
        narratives.append("Your relationship is dynamic, with both harmonious and challenging polarities.")
    else:
        narratives.append("Your connection requires conscious effort to bridge different energetic frequencies.")

    # Specific axis highlights
    for axis in axes:
        polarity = axis["polarity"]
        axis_name = axis["axis"]

        if polarity in {"Resonant", "Harmonizing", "Magnetic"}:
            narratives.append(f"The {axis_name} axis shows natural alignment.")
        elif polarity in {"Amplifying", "Volatile", "Frictional"}:
            narratives.append(f"The {axis_name} axis invites conscious navigation.")

    return " ".join(narratives)


# ============================================================================
# WEIGHTED POLARITY SCORE (0-100)
# ============================================================================

# Axis weights for composite score
POLARITY_WEIGHTS = {
    "Guna": 0.30,
    "Dosha": 0.20,
    "Element": 0.20,
    "Yin/Yang": 0.15,
    "Graha Dominance": 0.15,
}

# Raw scores for polarity types (normalized to 0-100 scale)
POLARITY_TYPE_SCORES = {
    # Positive polarities (high scores)
    "Resonant": 95,
    "Harmonizing": 90,
    "Harmonious": 90,
    "Magnetic": 90,
    "Balancing": 88,
    "Cooling": 85,
    "Complementary": 82,
    "Stabilizing": 80,
    # Neutral/Dynamic polarities (mid scores)
    "Activating": 70,
    "Dynamic": 68,
    "Parallel": 65,
    "Mixed": 60,
    "Dispersed": 55,
    # Challenging polarities (lower scores)
    "Amplifying": 50,
    "Frictional": 45,
    "Volatile": 40,
    "Intense": 38,
}

# Graha Axis-specific scores
GRAHA_AXIS_SCORES = {
    "Passion Axis": 92,
    "Expansion-Pleasure Axis": 90,
    "Wisdom-Communication Axis": 85,
    "Identity-Emotion Axis": 78,
    "Stability-Emotion Axis": 72,
}

# Interpretation bands
POLARITY_SCORE_BANDS = [
    (90, 100, "Magnetic Polarity", "Powerful attraction with deep complementarity"),
    (80, 89, "Harmonious Polarity", "Strong synergy and natural flow"),
    (70, 79, "Balanced Polarity", "Stable, supportive, and mutually enriching"),
    (60, 69, "Dynamic Polarity", "Growth-oriented with stimulating friction"),
    (50, 59, "Challenging Polarity", "Mismatched rhythms requiring conscious work"),
    (0, 49, "Volatile Polarity", "Intense karmic activation, transformative but unstable"),
]


def _get_axis_score(axis: Dict) -> float:
    """Get the numeric score for an axis based on its polarity type."""
    polarity = axis.get("polarity", "Mixed")

    # Check for Graha axis-specific scores first
    if axis.get("axis") == "Graha Dominance" and polarity in GRAHA_AXIS_SCORES:
        return GRAHA_AXIS_SCORES[polarity]

    # Fall back to general polarity type scores
    return POLARITY_TYPE_SCORES.get(polarity, 60)


def compute_weighted_polarity_score(axes: List[Dict]) -> Dict:
    """
    Compute the weighted composite Relationship Polarity Score (0-100).

    Weights:
    - Guna: 0.30 (deep temperament compatibility)
    - Dosha: 0.20 (body-mind rhythm alignment)
    - Element: 0.20 (Western psychological synergy)
    - Yin/Yang: 0.15 (polarity & attraction)
    - Graha Dominance: 0.15 (planetary energetic balance)

    Args:
        axes: List of axis dictionaries from build_polarity_map

    Returns:
        Score dictionary with value, label, and interpretation
    """
    weighted_sum = 0.0
    total_weight = 0.0

    for axis in axes:
        axis_name = axis.get("axis", "")
        weight = POLARITY_WEIGHTS.get(axis_name, 0.15)
        score = _get_axis_score(axis)

        weighted_sum += score * weight
        total_weight += weight

    # Normalize in case weights don't sum to 1
    if total_weight > 0:
        final_score = round(weighted_sum / total_weight)
    else:
        final_score = 60  # Default

    # Clamp to 0-100
    final_score = max(0, min(100, final_score))

    # Get interpretation band
    label = "Mixed Polarity"
    interpretation = "Variable energetic interaction"

    for min_score, max_score, band_label, band_interp in POLARITY_SCORE_BANDS:
        if min_score <= final_score <= max_score:
            label = band_label
            interpretation = band_interp
            break

    return {
        "score": final_score,
        "label": label,
        "interpretation": interpretation,
        "breakdown": {
            axis["axis"]: {
                "score": _get_axis_score(axis),
                "weight": POLARITY_WEIGHTS.get(axis["axis"], 0.15),
                "weighted": round(_get_axis_score(axis) * POLARITY_WEIGHTS.get(axis["axis"], 0.15), 1)
            }
            for axis in axes
        }
    }


# ============================================================================
# POLARITY ARCHETYPE ENGINE
# The mythic identity of the relationship
# ============================================================================

ARCHETYPE_DESCRIPTIONS = {
    "The Magnetic Opposites": {
        "description": "A relationship built on polarity, attraction, and dynamic tension. You activate each other's growth and spark powerful chemistry.",
        "keywords": ["attraction", "polarity", "chemistry", "growth"],
        "icon": "🧲"
    },
    "The Harmonious Twins": {
        "description": "A relationship of resonance and ease. You share rhythms, values, and emotional language.",
        "keywords": ["harmony", "resonance", "ease", "shared rhythm"],
        "icon": "👯"
    },
    "The Fire-Air Circuit": {
        "description": "A relationship fueled by inspiration, ideas, and movement. You energize each other's creativity.",
        "keywords": ["inspiration", "creativity", "ideas", "energy"],
        "icon": "🔥"
    },
    "The Earth-Water Foundation": {
        "description": "A relationship rooted in stability, nurturing, and emotional safety. You build together.",
        "keywords": ["stability", "nurturing", "security", "building"],
        "icon": "🌱"
    },
    "The Stabilizer-Visionary Pair": {
        "description": "One grounds while the other imagines. Together you create balance, direction, and growth.",
        "keywords": ["balance", "vision", "grounding", "direction"],
        "icon": "⚖️"
    },
    "The Dharma Companions": {
        "description": "A relationship aligned with purpose, meaning, and shared spiritual or philosophical growth.",
        "keywords": ["purpose", "meaning", "spiritual", "philosophy"],
        "icon": "🕉️"
    },
    "The Passion Axis": {
        "description": "A relationship charged with romantic and physical chemistry. Strong attraction and emotional fire.",
        "keywords": ["passion", "romance", "chemistry", "desire"],
        "icon": "💫"
    },
    "The Transformational Pair": {
        "description": "A relationship that catalyzes deep emotional and karmic transformation. Intense, meaningful, evolving.",
        "keywords": ["transformation", "depth", "evolution", "intensity"],
        "icon": "🦋"
    },
    "The Parallel Travelers": {
        "description": "A relationship of comfort and predictability. You move through life at a similar pace.",
        "keywords": ["comfort", "stability", "predictability", "companionship"],
        "icon": "🚶"
    },
    "The Creative Disruptors": {
        "description": "A relationship that sparks innovation, change, and unconventional paths. Exciting and unpredictable.",
        "keywords": ["innovation", "change", "unconventional", "excitement"],
        "icon": "⚡"
    },
    "The Karmic Mirrors": {
        "description": "A relationship that reflects emotional patterns and karmic lessons. Growth through reflection.",
        "keywords": ["karma", "reflection", "lessons", "growth"],
        "icon": "🪞"
    },
    "The Sacred Counterweights": {
        "description": "A relationship where differences become medicine. You balance each other's extremes.",
        "keywords": ["balance", "healing", "complementary", "medicine"],
        "icon": "☯️"
    },
    "The Balanced Polarity Pair": {
        "description": "A relationship with a healthy mix of similarity and contrast. Supportive, dynamic, and adaptable.",
        "keywords": ["balance", "adaptable", "supportive", "dynamic"],
        "icon": "🎯"
    }
}


def _classify_polarity_archetype(
    guna_a: str, guna_b: str,
    dosha_a: str, dosha_b: str,
    elem_a: str, elem_b: str,
    polarity_a: str, polarity_b: str,
    strong_grahas_a: set, strong_grahas_b: set,
    yinyang_polarity: str,
    polarity_score: int
) -> str:
    """
    Classify the relationship into one of 12 polarity archetypes.

    Rules are applied in priority order.
    """
    # Rule 1: Magnetic Opposites (high score + magnetic yin/yang)
    if polarity_score >= 90 and yinyang_polarity == "Magnetic":
        return "The Magnetic Opposites"

    # Rule 2: Harmonious Twins (same guna + same dosha)
    if guna_a == guna_b and dosha_a == dosha_b:
        return "The Harmonious Twins"

    # Rule 3: Fire-Air Circuit
    if (elem_a, elem_b) in [("Fire", "Air"), ("Air", "Fire")]:
        return "The Fire-Air Circuit"

    # Rule 4: Earth-Water Foundation
    if (elem_a, elem_b) in [("Earth", "Water"), ("Water", "Earth")]:
        return "The Earth-Water Foundation"

    # Rule 5: Stabilizer-Visionary Pair (Vata + Kapha)
    if (dosha_a, dosha_b) in [("Vata", "Kapha"), ("Kapha", "Vata")]:
        return "The Stabilizer-Visionary Pair"

    # Rule 6: Passion Axis (Mars + Venus)
    if ("mangala" in strong_grahas_a and "shukra" in strong_grahas_b) or \
       ("shukra" in strong_grahas_a and "mangala" in strong_grahas_b):
        return "The Passion Axis"

    # Rule 7: Dharma Companions (Jupiter + Sun/Moon)
    if ("guru" in strong_grahas_a and ("surya" in strong_grahas_b or "chandra" in strong_grahas_b)) or \
       (("surya" in strong_grahas_a or "chandra" in strong_grahas_a) and "guru" in strong_grahas_b):
        return "The Dharma Companions"

    # Rule 8: Karmic Mirrors (Saturn + Moon)
    if ("shani" in strong_grahas_a and "chandra" in strong_grahas_b) or \
       ("chandra" in strong_grahas_a and "shani" in strong_grahas_b):
        return "The Karmic Mirrors"

    # Rule 9: Creative Disruptors (Rahu involved)
    if "rahu" in strong_grahas_a or "rahu" in strong_grahas_b:
        return "The Creative Disruptors"

    # Rule 10: Parallel Travelers (same element + same polarity)
    if elem_a == elem_b and polarity_a == polarity_b:
        return "The Parallel Travelers"

    # Rule 11: Sacred Counterweights (opposite guna + opposite dosha)
    if guna_a != guna_b and dosha_a != dosha_b:
        return "The Sacred Counterweights"

    # Rule 12: Transformational Pair (Tamas + Rajas with challenging polarities)
    if (guna_a, guna_b) in [("Tamas", "Rajas"), ("Rajas", "Tamas")] and polarity_score < 60:
        return "The Transformational Pair"

    # Default
    return "The Balanced Polarity Pair"


def build_polarity_archetype(personA: Dict, personB: Dict, polarity_map: Dict) -> Dict:
    """
    Build the polarity archetype for the relationship.

    Args:
        personA: Complete chart data for person A
        personB: Complete chart data for person B
        polarity_map: The computed polarity map

    Returns:
        Archetype dictionary with name, description, and metadata
    """
    # Extract temperament data
    guna_a = personA.get("temperament", {}).get("dominantGuna", "Rajas")
    guna_b = personB.get("temperament", {}).get("dominantGuna", "Rajas")
    dosha_a = personA.get("temperament", {}).get("dominantDosha", "Vata")
    dosha_b = personB.get("temperament", {}).get("dominantDosha", "Vata")

    # Extract Western data
    elem_a = personA.get("western", {}).get("dominantElement", "Fire")
    elem_b = personB.get("western", {}).get("dominantElement", "Fire")
    polarity_a = personA.get("western", {}).get("polarity", "Yang")
    polarity_b = personB.get("western", {}).get("polarity", "Yang")

    # Extract strong grahas
    strong_grahas_a = _get_strong_grahas(personA.get("grahas", {}))
    strong_grahas_b = _get_strong_grahas(personB.get("grahas", {}))

    # Get yin/yang polarity from the map
    yinyang_axis = next(
        (axis for axis in polarity_map.get("axes", []) if axis.get("axis") == "Yin/Yang"),
        {}
    )
    yinyang_polarity = yinyang_axis.get("polarity", "Mixed")

    # Get polarity score
    polarity_score = polarity_map.get("polarityScore", {}).get("score", 60)

    # Classify the archetype
    archetype_name = _classify_polarity_archetype(
        guna_a, guna_b,
        dosha_a, dosha_b,
        elem_a, elem_b,
        polarity_a, polarity_b,
        strong_grahas_a, strong_grahas_b,
        yinyang_polarity,
        polarity_score
    )

    # Get archetype details
    archetype_data = ARCHETYPE_DESCRIPTIONS.get(archetype_name, ARCHETYPE_DESCRIPTIONS["The Balanced Polarity Pair"])

    return {
        "name": archetype_name,
        "description": archetype_data["description"],
        "keywords": archetype_data["keywords"],
        "icon": archetype_data["icon"],
        "classification": {
            "guna": f"{guna_a}-{guna_b}",
            "dosha": f"{dosha_a}-{dosha_b}",
            "element": f"{elem_a}-{elem_b}",
            "yinYang": yinyang_polarity,
            "polarityScore": polarity_score
        }
    }


# ============================================================================
# POLARITY ARCHETYPE DIFF
# Side-by-side comparison of two relationships
# ============================================================================

ARCHETYPE_TEACHINGS = {
    "The Magnetic Opposites": "how to navigate polarity, passion, and dynamic tension.",
    "The Harmonious Twins": "how to cultivate resonance, ease, and shared rhythm.",
    "The Fire-Air Circuit": "how to channel inspiration and movement.",
    "The Earth-Water Foundation": "how to build stability and emotional grounding.",
    "The Stabilizer-Visionary Pair": "how to balance imagination with practicality.",
    "The Dharma Companions": "how to align purpose, meaning, and growth.",
    "The Passion Axis": "how to integrate chemistry with emotional depth.",
    "The Transformational Pair": "how to navigate intensity, shadow, and rebirth.",
    "The Parallel Travelers": "how to maintain steady companionship.",
    "The Creative Disruptors": "how to embrace change and innovation.",
    "The Karmic Mirrors": "how to face emotional patterns and karmic lessons.",
    "The Sacred Counterweights": "how to balance extremes and heal through difference.",
    "The Balanced Polarity Pair": "how to grow through conscious relational navigation."
}


def _extract_archetype_teaching(archetype: Dict) -> str:
    """Extract the teaching message for an archetype."""
    name = archetype.get("name", "The Balanced Polarity Pair")
    return ARCHETYPE_TEACHINGS.get(name, "how to grow through relational polarity.")


def _get_polarity_for_axis(polarity_map: Dict, axis_name: str) -> str:
    """Get the polarity value for a specific axis from the polarity map."""
    axes = polarity_map.get("axes", [])
    for axis in axes:
        if axis.get("axis") == axis_name:
            return axis.get("polarity", "Mixed")
    return "Mixed"


def build_polarity_archetype_diff(rel_a: Dict, rel_b: Dict) -> Dict:
    """
    Build a comparison diff between two relationships' polarity archetypes.

    Args:
        rel_a: First relationship data with archetype, polarityScore, polarityMap
        rel_b: Second relationship data with archetype, polarityScore, polarityMap

    Returns:
        Diff analysis with summary, differences, teachings, and energetic shift
    """
    archetype_a = rel_a.get("archetype", {"name": "Unknown"})
    archetype_b = rel_b.get("archetype", {"name": "Unknown"})

    # Get scores
    score_a_data = rel_a.get("polarityScore", {})
    score_b_data = rel_b.get("polarityScore", {})
    score_a = score_a_data.get("score", 0) if isinstance(score_a_data, dict) else score_a_data
    score_b = score_b_data.get("score", 0) if isinstance(score_b_data, dict) else score_b_data

    map_a = rel_a.get("polarityMap", rel_a)
    map_b = rel_b.get("polarityMap", rel_b)

    differences = []

    # Compare archetype names
    name_a = archetype_a.get("name", "Unknown")
    name_b = archetype_b.get("name", "Unknown")

    if name_a != name_b:
        differences.append(
            f"Relationship A expresses the '{name_a}' archetype, while Relationship B expresses the '{name_b}' archetype."
        )
    else:
        differences.append(
            f"Both relationships share the '{name_a}' archetype, but express it in distinct ways."
        )

    # Compare polarity scores
    score_diff = abs(score_a - score_b)
    if score_a > score_b + 5:
        differences.append("Relationship A has a stronger polarity charge and more natural energetic flow.")
    elif score_b > score_a + 5:
        differences.append("Relationship B has a stronger polarity charge and more natural energetic flow.")
    else:
        differences.append("Both relationships have similar polarity intensity.")

    # Compare each axis
    axis_labels = {
        "Guna": "The temperamental foundation differs: one relationship operates with a different Guna polarity than the other.",
        "Dosha": "The constitutional rhythm differs, affecting emotional pacing and daily flow.",
        "Element": "The elemental synergy shifts, changing how inspiration, stability, or emotion flows.",
        "Yin/Yang": "The attraction polarity differs, shifting the balance between magnetism and resonance.",
        "Graha Dominance": "Different planetary forces dominate each relationship, shaping its emotional and karmic tone."
    }

    for axis_name, diff_message in axis_labels.items():
        polarity_a = _get_polarity_for_axis(map_a, axis_name)
        polarity_b = _get_polarity_for_axis(map_b, axis_name)

        if polarity_a != polarity_b:
            differences.append(diff_message)

    # Teaching contrast
    teaching_a = _extract_archetype_teaching(archetype_a)
    teaching_b = _extract_archetype_teaching(archetype_b)

    teaching_contrast = [
        f"Relationship A teaches: {teaching_a}",
        f"Relationship B teaches: {teaching_b}"
    ]

    # Energetic shift
    energetic_shift = []

    if name_a != name_b:
        energetic_shift.append(
            f"Moving from Relationship A to Relationship B shifts the archetype from '{name_a}' to '{name_b}', altering the relational field."
        )
    else:
        energetic_shift.append(
            f"Both relationships embody the '{name_a}' archetype, maintaining a consistent relational field with subtle variations."
        )

    # Add score-based energy shift
    if score_diff >= 15:
        if score_a > score_b:
            energetic_shift.append("The shift represents a move from higher polarity charge to more grounded, stable energy.")
        else:
            energetic_shift.append("The shift represents a move from stable energy to higher polarity charge and intensity.")

    # Build summary
    summary = " ".join(differences[:3])

    return {
        "summary": summary,
        "differences": differences,
        "teachingContrast": teaching_contrast,
        "energeticShift": energetic_shift,
        "scoreComparison": {
            "scoreA": score_a,
            "scoreB": score_b,
            "difference": score_diff,
            "stronger": "A" if score_a > score_b else "B" if score_b > score_a else "equal"
        },
        "archetypeComparison": {
            "nameA": name_a,
            "nameB": name_b,
            "iconA": archetype_a.get("icon", "🎯"),
            "iconB": archetype_b.get("icon", "🎯"),
            "sameArchetype": name_a == name_b
        }
    }


# ============================================================================
# ARCHETYPE EVOLUTION TIMELINE
# Temporal dimension: how the relationship archetype shifts across Mahadasha periods
# ============================================================================

# Planet → Archetype mapping for Mahadasha periods
PLANET_ARCHETYPE_MAP = {
    "Venus": "The Passion Axis",
    "Shukra": "The Passion Axis",
    "Mars": "The Magnetic Opposites",
    "Mangala": "The Magnetic Opposites",
    "Saturn": "The Transformational Pair",
    "Shani": "The Transformational Pair",
    "Jupiter": "The Dharma Companions",
    "Guru": "The Dharma Companions",
    "Mercury": "The Creative Disruptors",
    "Budha": "The Creative Disruptors",
    "Rahu": "The Creative Disruptors",
    "Ketu": "The Karmic Mirrors",
    "Moon": "The Earth-Water Foundation",
    "Chandra": "The Earth-Water Foundation",
    "Sun": "The Fire-Air Circuit",
    "Surya": "The Fire-Air Circuit",
}

# Growth themes for each planetary period
PLANET_GROWTH_THEMES = {
    "Venus": "Connection, harmony, shared pleasure, and romantic renewal.",
    "Shukra": "Connection, harmony, shared pleasure, and romantic renewal.",
    "Mars": "Courage, passion, direct communication, and dynamic energy.",
    "Mangala": "Courage, passion, direct communication, and dynamic energy.",
    "Saturn": "Patience, responsibility, emotional maturity, and endurance.",
    "Shani": "Patience, responsibility, emotional maturity, and endurance.",
    "Jupiter": "Wisdom, generosity, shared purpose, and spiritual growth.",
    "Guru": "Wisdom, generosity, shared purpose, and spiritual growth.",
    "Mercury": "Communication, adaptability, learning, and mental connection.",
    "Budha": "Communication, adaptability, learning, and mental connection.",
    "Rahu": "Innovation, expansion, unconventional growth, and new horizons.",
    "Ketu": "Detachment, healing, spiritual clarity, and karmic resolution.",
    "Moon": "Emotional bonding, nurturing, safety, and intuitive connection.",
    "Chandra": "Emotional bonding, nurturing, safety, and intuitive connection.",
    "Sun": "Identity, confidence, shared direction, and mutual respect.",
    "Surya": "Identity, confidence, shared direction, and mutual respect.",
}

# Shadow themes for each planetary period
PLANET_SHADOW_THEMES = {
    "Venus": "Over-idealization, dependency, avoidance of difficult topics.",
    "Shukra": "Over-idealization, dependency, avoidance of difficult topics.",
    "Mars": "Conflict, impulsiveness, power struggles, and anger.",
    "Mangala": "Conflict, impulsiveness, power struggles, and anger.",
    "Saturn": "Distance, heaviness, emotional contraction, and rigidity.",
    "Shani": "Distance, heaviness, emotional contraction, and rigidity.",
    "Jupiter": "Overexpansion, unrealistic optimism, and excess.",
    "Guru": "Overexpansion, unrealistic optimism, and excess.",
    "Mercury": "Overthinking, inconsistency, and scattered energy.",
    "Budha": "Overthinking, inconsistency, and scattered energy.",
    "Rahu": "Instability, obsession, volatility, and confusion.",
    "Ketu": "Withdrawal, detachment, emotional gaps, and isolation.",
    "Moon": "Moodiness, emotional overwhelm, and hypersensitivity.",
    "Chandra": "Moodiness, emotional overwhelm, and hypersensitivity.",
    "Sun": "Ego clashes, stubbornness, and dominance struggles.",
    "Surya": "Ego clashes, stubbornness, and dominance struggles.",
}

# Planetary period summaries
PLANET_PERIOD_SUMMARIES = {
    "Venus": "Venus brings harmony, romance, and shared pleasure to the relationship.",
    "Shukra": "Venus brings harmony, romance, and shared pleasure to the relationship.",
    "Mars": "Mars activates passion, energy, and dynamic tension in the relationship.",
    "Mangala": "Mars activates passion, energy, and dynamic tension in the relationship.",
    "Saturn": "Saturn activates karmic lessons, emotional depth, and long-term restructuring.",
    "Shani": "Saturn activates karmic lessons, emotional depth, and long-term restructuring.",
    "Jupiter": "Jupiter expands wisdom, blessings, and shared purpose in the relationship.",
    "Guru": "Jupiter expands wisdom, blessings, and shared purpose in the relationship.",
    "Mercury": "Mercury brings communication shifts, mental stimulation, and new patterns.",
    "Budha": "Mercury brings communication shifts, mental stimulation, and new patterns.",
    "Rahu": "Rahu destabilizes, intensifies, and electrifies the relational field.",
    "Ketu": "Ketu reveals past-life patterns and emotional residues for healing.",
    "Moon": "Moon deepens emotional bonding, nurturing, and intuitive connection.",
    "Chandra": "Moon deepens emotional bonding, nurturing, and intuitive connection.",
    "Sun": "Sun illuminates identity, confidence, and shared direction.",
    "Surya": "Sun illuminates identity, confidence, and shared direction.",
}

# Planet icons
PLANET_ICONS = {
    "Venus": "♀️",
    "Shukra": "♀️",
    "Mars": "♂️",
    "Mangala": "♂️",
    "Saturn": "♄",
    "Shani": "♄",
    "Jupiter": "♃",
    "Guru": "♃",
    "Mercury": "☿",
    "Budha": "☿",
    "Rahu": "☊",
    "Ketu": "☋",
    "Moon": "☽",
    "Chandra": "☽",
    "Sun": "☉",
    "Surya": "☉",
}


def classify_archetype_for_planet(
    planet: str,
    polarity_map: Dict = None,
    graha_dominance: Dict = None
) -> str:
    """
    Classify the relationship archetype for a given Mahadasha planet.

    The archetype shifts based on which planet is "running" the relationship
    during that period.

    Args:
        planet: The Mahadasha planet name
        polarity_map: Optional polarity map for context
        graha_dominance: Optional graha dominance data

    Returns:
        Archetype name for the planetary period
    """
    # Normalize planet name
    planet_normalized = planet.capitalize()

    # Get base archetype from planet
    archetype = PLANET_ARCHETYPE_MAP.get(planet_normalized)

    if archetype:
        return archetype

    # Fallback: check for alternate spellings
    planet_lower = planet.lower()
    for key, value in PLANET_ARCHETYPE_MAP.items():
        if key.lower() == planet_lower:
            return value

    # Default
    return "The Balanced Polarity Pair"


def build_archetype_evolution_timeline(
    relationship: Dict,
    polarity_map: Dict = None
) -> List[Dict]:
    """
    Build the Archetype Evolution Timeline showing how the relationship's
    polarity archetype shifts across Vimshottari Mahadasha periods.

    Args:
        relationship: Relationship data containing dashas
        polarity_map: Optional polarity map for context

    Returns:
        List of timeline periods with archetype, growth, and shadow themes
    """
    timeline = []

    # Get Mahadasha periods from relationship data
    dashas = relationship.get("dashas", {})
    mahadashas = dashas.get("mahadashas", dashas.get("mahadasas", []))

    if not mahadashas:
        # Try alternate data structure
        mahadashas = relationship.get("mahadashas", [])

    for dasha in mahadashas:
        planet = dasha.get("planet", dasha.get("lord", ""))
        start = dasha.get("start", dasha.get("startDate", ""))
        end = dasha.get("end", dasha.get("endDate", ""))

        if not planet:
            continue

        # Get archetype for this planetary period
        archetype = classify_archetype_for_planet(
            planet,
            polarity_map,
            relationship.get("grahaDominance")
        )

        # Get archetype details
        archetype_data = ARCHETYPE_DESCRIPTIONS.get(
            archetype,
            ARCHETYPE_DESCRIPTIONS.get("The Balanced Polarity Pair", {})
        )

        # Get planet-specific themes
        planet_key = planet.capitalize()
        growth = PLANET_GROWTH_THEMES.get(planet_key, "Growth through relational awareness.")
        shadow = PLANET_SHADOW_THEMES.get(planet_key, "Shadow patterns requiring conscious navigation.")
        summary = PLANET_PERIOD_SUMMARIES.get(planet_key, f"{planet} shapes the relationship's evolution.")
        icon = PLANET_ICONS.get(planet_key, "🪐")

        timeline.append({
            "planet": planet,
            "planetIcon": icon,
            "start": start,
            "end": end,
            "archetype": archetype,
            "archetypeIcon": archetype_data.get("icon", "🎯"),
            "archetypeDescription": archetype_data.get("description", ""),
            "summary": summary,
            "growth": growth,
            "shadow": shadow,
            "keywords": archetype_data.get("keywords", [])
        })

    return timeline


def build_complete_relationship_analysis(personA: Dict, personB: Dict, dashas: Dict = None) -> Dict:
    """
    Build a complete relationship analysis including polarity map,
    archetype, and evolution timeline.

    Args:
        personA: Chart data for person A
        personB: Chart data for person B
        dashas: Optional Mahadasha data for the relationship

    Returns:
        Complete relationship analysis dictionary
    """
    # Build the polarity map (includes archetype)
    polarity_map = build_polarity_map(personA, personB)

    # Build the evolution timeline if dashas are provided
    timeline = []
    if dashas:
        relationship_data = {
            "dashas": dashas,
            "grahaDominance": polarity_map.get("axes", [{}])[-1]  # Graha axis
        }
        timeline = build_archetype_evolution_timeline(relationship_data, polarity_map)

    return {
        "polarityMap": polarity_map,
        "archetype": polarity_map.get("archetype"),
        "polarityScore": polarity_map.get("polarityScore"),
        "evolutionTimeline": timeline
    }


# ============================================================================
# ARCHETYPE EVOLUTION DIFF
# Side-by-side comparison of how two relationships evolve across Mahadasha periods
# ============================================================================

# Archetype shift narratives
ARCHETYPE_SHIFT_NARRATIVES = {
    ("The Transformational Pair", "The Passion Axis"): "moves from karmic intensity to romantic harmony.",
    ("The Transformational Pair", "The Dharma Companions"): "moves from emotional depth to purpose-driven alignment.",
    ("The Creative Disruptors", "The Dharma Companions"): "moves from innovation to purpose-driven stability.",
    ("The Creative Disruptors", "The Passion Axis"): "moves from experimentation to romantic chemistry.",
    ("The Karmic Mirrors", "The Harmonious Twins"): "moves from karmic reflection to natural resonance.",
    ("The Karmic Mirrors", "The Passion Axis"): "moves from karmic lessons to romantic renewal.",
    ("The Magnetic Opposites", "The Harmonious Twins"): "moves from dynamic tension to peaceful alignment.",
    ("The Magnetic Opposites", "The Dharma Companions"): "moves from attraction to shared purpose.",
    ("The Earth-Water Foundation", "The Fire-Air Circuit"): "moves from grounding stability to creative inspiration.",
    ("The Fire-Air Circuit", "The Earth-Water Foundation"): "moves from dynamic creativity to grounded nurturing.",
    ("The Passion Axis", "The Dharma Companions"): "moves from romantic intensity to spiritual partnership.",
    ("The Dharma Companions", "The Passion Axis"): "moves from shared purpose to renewed romance.",
    ("The Parallel Travelers", "The Magnetic Opposites"): "moves from comfortable companionship to dynamic attraction.",
    ("The Sacred Counterweights", "The Harmonious Twins"): "moves from conscious balancing to natural harmony.",
}


def _detect_archetype_shifts(timeline: List[Dict]) -> List[tuple]:
    """Detect archetype shifts between consecutive periods."""
    shifts = []
    for i in range(len(timeline) - 1):
        a1 = timeline[i].get("archetype", "")
        a2 = timeline[i + 1].get("archetype", "")
        if a1 and a2 and a1 != a2:
            shifts.append((a1, a2, timeline[i + 1].get("start", "")))
    return shifts


def _count_planet_periods(timeline: List[Dict], planets: List[str]) -> int:
    """Count how many periods are ruled by the specified planets."""
    count = 0
    for period in timeline:
        planet = period.get("planet", "").capitalize()
        if planet in planets or planet.lower() in [p.lower() for p in planets]:
            count += 1
    return count


def build_archetype_evolution_diff(rel_a: Dict, rel_b: Dict) -> Dict:
    """
    Build a comparison diff between two relationships' evolution timelines.

    Compares:
    - Timeline alignment (same periods, different archetypes)
    - Archetype shifts over time
    - Karmic rhythm (Saturn/Ketu/Rahu periods)
    - Growth periods (Jupiter/Venus)
    - Shadow periods (Saturn/Mars/Rahu)

    Args:
        rel_a: First relationship with timeline
        rel_b: Second relationship with timeline

    Returns:
        Evolution diff with comparison analysis
    """
    timeline_a = rel_a.get("timeline", rel_a.get("evolutionTimeline", []))
    timeline_b = rel_b.get("timeline", rel_b.get("evolutionTimeline", []))

    timeline_comparison = []
    archetype_shifts = []
    karmic_rhythm = []
    growth_contrast = []
    shadow_contrast = []

    # Compare each period (zip for aligned comparison)
    min_len = min(len(timeline_a), len(timeline_b))
    for i in range(min_len):
        p_a = timeline_a[i]
        p_b = timeline_b[i]

        arch_a = p_a.get("archetype", "Unknown")
        arch_b = p_b.get("archetype", "Unknown")

        if arch_a != arch_b:
            start = p_a.get("start", "")
            end = p_a.get("end", "")
            timeline_comparison.append(
                f"From {start} to {end}, Relationship A expresses '{arch_a}', "
                f"while Relationship B expresses '{arch_b}'."
            )

    # Detect and describe archetype shifts
    shifts_a = _detect_archetype_shifts(timeline_a)
    shifts_b = _detect_archetype_shifts(timeline_b)

    for (a1, a2, start) in shifts_a:
        narrative = ARCHETYPE_SHIFT_NARRATIVES.get((a1, a2))
        if narrative:
            archetype_shifts.append(f"Relationship A {narrative}")
        else:
            archetype_shifts.append(
                f"Relationship A shifts from '{a1}' to '{a2}' around {start}."
            )

    for (b1, b2, start) in shifts_b:
        narrative = ARCHETYPE_SHIFT_NARRATIVES.get((b1, b2))
        if narrative:
            archetype_shifts.append(f"Relationship B {narrative}")
        else:
            archetype_shifts.append(
                f"Relationship B shifts from '{b1}' to '{b2}' around {start}."
            )

    # Karmic rhythm comparison (Saturn/Ketu/Rahu)
    karmic_planets = ["Saturn", "Shani", "Ketu", "Rahu"]
    karmic_a = _count_planet_periods(timeline_a, karmic_planets)
    karmic_b = _count_planet_periods(timeline_b, karmic_planets)

    if karmic_a > karmic_b:
        karmic_rhythm.append(
            "Relationship A has a deeper karmic purification arc with more Saturn/Ketu/Rahu periods."
        )
    elif karmic_b > karmic_a:
        karmic_rhythm.append(
            "Relationship B has a deeper karmic purification arc with more Saturn/Ketu/Rahu periods."
        )
    else:
        karmic_rhythm.append(
            "Both relationships have similar karmic rhythm and purification phases."
        )

    # Growth period comparison (Jupiter/Venus)
    growth_planets = ["Jupiter", "Guru", "Venus", "Shukra"]
    growth_a = _count_planet_periods(timeline_a, growth_planets)
    growth_b = _count_planet_periods(timeline_b, growth_planets)

    if growth_a > growth_b:
        growth_contrast.append(
            "Relationship A experiences more harmonious and expansive periods (Jupiter/Venus)."
        )
    elif growth_b > growth_a:
        growth_contrast.append(
            "Relationship B experiences more harmonious and expansive periods (Jupiter/Venus)."
        )
    else:
        growth_contrast.append(
            "Both relationships have equal growth and expansion periods."
        )

    # Shadow period comparison (Saturn/Mars/Rahu)
    shadow_planets = ["Saturn", "Shani", "Mars", "Mangala", "Rahu"]
    shadow_a = _count_planet_periods(timeline_a, shadow_planets)
    shadow_b = _count_planet_periods(timeline_b, shadow_planets)

    if shadow_a > shadow_b:
        shadow_contrast.append(
            "Relationship A encounters more intense or challenging phases (Saturn/Mars/Rahu)."
        )
    elif shadow_b > shadow_a:
        shadow_contrast.append(
            "Relationship B encounters more intense or challenging phases (Saturn/Mars/Rahu)."
        )
    else:
        shadow_contrast.append(
            "Both relationships have similar intensity and shadow periods."
        )

    # Build summary
    summary_parts = []
    if timeline_comparison:
        summary_parts.append(timeline_comparison[0])
    if archetype_shifts:
        summary_parts.append(archetype_shifts[0])
    if karmic_rhythm:
        summary_parts.append(karmic_rhythm[0])

    summary = " ".join(summary_parts) if summary_parts else "Both relationships follow similar evolutionary arcs."

    return {
        "summary": summary,
        "timelineComparison": timeline_comparison,
        "archetypeShifts": archetype_shifts,
        "karmicRhythm": karmic_rhythm,
        "growthContrast": growth_contrast,
        "shadowContrast": shadow_contrast,
        "periodCounts": {
            "relationshipA": {
                "karmic": karmic_a,
                "growth": growth_a,
                "shadow": shadow_a,
                "total": len(timeline_a)
            },
            "relationshipB": {
                "karmic": karmic_b,
                "growth": growth_b,
                "shadow": shadow_b,
                "total": len(timeline_b)
            }
        }
    }


# ============================================================================
# COMPOSITE ARCHETYPE FORECAST
# Predicting future archetype based on Mahadasha (50%), Transits (30%),
# and Polarity Geometry (20%)
# ============================================================================

# Planet-to-archetype influence weights
PLANET_ARCHETYPE_INFLUENCE = {
    "Venus": {
        "The Passion Axis": 0.9,
        "The Harmonious Twins": 0.7,
        "The Earth-Water Foundation": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Shukra": {
        "The Passion Axis": 0.9,
        "The Harmonious Twins": 0.7,
        "The Earth-Water Foundation": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Mars": {
        "The Magnetic Opposites": 0.9,
        "The Fire-Air Circuit": 0.7,
        "The Creative Disruptors": 0.6,
        "The Passion Axis": 0.5
    },
    "Mangala": {
        "The Magnetic Opposites": 0.9,
        "The Fire-Air Circuit": 0.7,
        "The Creative Disruptors": 0.6,
        "The Passion Axis": 0.5
    },
    "Jupiter": {
        "The Dharma Companions": 0.9,
        "The Spiritual Counterparts": 0.8,
        "The Harmonious Twins": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Guru": {
        "The Dharma Companions": 0.9,
        "The Spiritual Counterparts": 0.8,
        "The Harmonious Twins": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Saturn": {
        "The Transformational Pair": 0.9,
        "The Karmic Mirrors": 0.8,
        "The Parallel Travelers": 0.5,
        "The Earth-Water Foundation": 0.4
    },
    "Shani": {
        "The Transformational Pair": 0.9,
        "The Karmic Mirrors": 0.8,
        "The Parallel Travelers": 0.5,
        "The Earth-Water Foundation": 0.4
    },
    "Mercury": {
        "The Creative Disruptors": 0.8,
        "The Fire-Air Circuit": 0.7,
        "The Parallel Travelers": 0.5,
        "The Balanced Polarity Pair": 0.4
    },
    "Budha": {
        "The Creative Disruptors": 0.8,
        "The Fire-Air Circuit": 0.7,
        "The Parallel Travelers": 0.5,
        "The Balanced Polarity Pair": 0.4
    },
    "Rahu": {
        "The Creative Disruptors": 0.9,
        "The Magnetic Opposites": 0.7,
        "The Karmic Mirrors": 0.6,
        "The Transformational Pair": 0.5
    },
    "Ketu": {
        "The Spiritual Counterparts": 0.9,
        "The Karmic Mirrors": 0.8,
        "The Transformational Pair": 0.6,
        "The Dharma Companions": 0.4
    },
    "Moon": {
        "The Earth-Water Foundation": 0.9,
        "The Harmonious Twins": 0.7,
        "The Passion Axis": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Chandra": {
        "The Earth-Water Foundation": 0.9,
        "The Harmonious Twins": 0.7,
        "The Passion Axis": 0.5,
        "The Sacred Counterweights": 0.4
    },
    "Sun": {
        "The Dharma Companions": 0.8,
        "The Fire-Air Circuit": 0.7,
        "The Magnetic Opposites": 0.5,
        "The Parallel Travelers": 0.4
    },
    "Surya": {
        "The Dharma Companions": 0.8,
        "The Fire-Air Circuit": 0.7,
        "The Magnetic Opposites": 0.5,
        "The Parallel Travelers": 0.4
    }
}

# Transit-to-archetype modifiers
TRANSIT_ARCHETYPE_MODIFIERS = {
    "Jupiter conjunct Venus": {
        "The Passion Axis": 0.3,
        "The Harmonious Twins": 0.2,
        "The Dharma Companions": 0.2
    },
    "Saturn conjunct Moon": {
        "The Transformational Pair": 0.3,
        "The Karmic Mirrors": 0.2,
        "The Earth-Water Foundation": 0.1
    },
    "Mars conjunct Venus": {
        "The Passion Axis": 0.4,
        "The Magnetic Opposites": 0.2,
        "The Fire-Air Circuit": 0.1
    },
    "Jupiter trine Sun": {
        "The Dharma Companions": 0.3,
        "The Fire-Air Circuit": 0.2,
        "The Spiritual Counterparts": 0.1
    },
    "Saturn square Mars": {
        "The Transformational Pair": 0.3,
        "The Magnetic Opposites": 0.2,
        "The Karmic Mirrors": 0.2
    },
    "Rahu conjunct Ascendant": {
        "The Creative Disruptors": 0.3,
        "The Karmic Mirrors": 0.2,
        "The Magnetic Opposites": 0.1
    },
    "Ketu conjunct Moon": {
        "The Spiritual Counterparts": 0.3,
        "The Karmic Mirrors": 0.2,
        "The Transformational Pair": 0.1
    },
    "Venus trine Jupiter": {
        "The Passion Axis": 0.2,
        "The Harmonious Twins": 0.2,
        "The Dharma Companions": 0.2
    },
    "Mercury conjunct Venus": {
        "The Creative Disruptors": 0.2,
        "The Parallel Travelers": 0.2,
        "The Fire-Air Circuit": 0.1
    },
    "Sun trine Moon": {
        "The Harmonious Twins": 0.3,
        "The Sacred Counterweights": 0.2,
        "The Balanced Polarity Pair": 0.1
    }
}

# Polarity geometry resonance with archetypes
POLARITY_ARCHETYPE_RESONANCE = {
    "high_guna_contrast": {
        "The Magnetic Opposites": 0.2,
        "The Karmic Mirrors": 0.15,
        "The Transformational Pair": 0.1
    },
    "low_guna_contrast": {
        "The Harmonious Twins": 0.2,
        "The Parallel Travelers": 0.15,
        "The Balanced Polarity Pair": 0.1
    },
    "fire_dominant": {
        "The Fire-Air Circuit": 0.2,
        "The Passion Axis": 0.15,
        "The Magnetic Opposites": 0.1
    },
    "earth_dominant": {
        "The Earth-Water Foundation": 0.2,
        "The Parallel Travelers": 0.15,
        "The Sacred Counterweights": 0.1
    },
    "water_dominant": {
        "The Earth-Water Foundation": 0.2,
        "The Passion Axis": 0.15,
        "The Transformational Pair": 0.1
    },
    "air_dominant": {
        "The Fire-Air Circuit": 0.2,
        "The Creative Disruptors": 0.15,
        "The Parallel Travelers": 0.1
    },
    "yang_dominant": {
        "The Fire-Air Circuit": 0.15,
        "The Magnetic Opposites": 0.15,
        "The Dharma Companions": 0.1
    },
    "yin_dominant": {
        "The Earth-Water Foundation": 0.15,
        "The Harmonious Twins": 0.15,
        "The Passion Axis": 0.1
    },
    "balanced_polarity": {
        "The Sacred Counterweights": 0.2,
        "The Balanced Polarity Pair": 0.15,
        "The Harmonious Twins": 0.1
    }
}

# Forecast narrative templates
FORECAST_NARRATIVES = {
    "The Magnetic Opposites": "The relationship is entering a phase of dynamic polarity — expect heightened attraction and creative tension. The opposite energies are activating, drawing you together through contrast.",
    "The Harmonious Twins": "A period of natural resonance is emerging. The relationship will flow more effortlessly, with shared understanding and mutual attunement becoming the dominant theme.",
    "The Fire-Air Circuit": "Creative inspiration and dynamic exchange are on the horizon. This is a time for bold ideas, passionate communication, and shared adventures.",
    "The Earth-Water Foundation": "The relationship is moving toward deeper nurturing and practical stability. Emotional security and grounded connection will strengthen.",
    "The Passion Axis": "Romantic and sensual energies are intensifying. This forecast period favors intimacy, creative collaboration, and heart-centered connection.",
    "The Dharma Companions": "Shared purpose is coming into focus. The relationship will be defined by aligned values, spiritual growth, and meaningful collaboration.",
    "The Transformational Pair": "Deep transformation is ahead. This period brings intensity, karmic lessons, and the potential for profound mutual evolution.",
    "The Karmic Mirrors": "The relationship enters a reflective phase where each partner mirrors the other's growth edges. Honest self-examination strengthens the bond.",
    "The Spiritual Counterparts": "Transcendent connection is activating. Expect deepening spiritual intimacy and a sense of shared higher purpose.",
    "The Creative Disruptors": "Innovation and unconventional expression are emerging. This is a time to break patterns and experiment with new relational dynamics.",
    "The Parallel Travelers": "Comfortable companionship defines this period. The relationship supports individual growth while maintaining steady connection.",
    "The Sacred Counterweights": "Balance through conscious navigation is the theme. Each partner's unique qualities help stabilize and complement the other.",
    "The Balanced Polarity Pair": "Equilibrium and measured harmony are forecast. The relationship maintains stability through mutual respect and proportional exchange."
}


def _get_next_mahadasha(relationship: Dict) -> Optional[Dict]:
    """Get the next (upcoming or current) Mahadasha period."""
    from datetime import datetime

    # Try multiple keys for dasha data
    dashas = (
        relationship.get("mahadashas") or
        relationship.get("mahadasas") or
        relationship.get("dashas") or
        relationship.get("vimshottari_mahadasha") or
        []
    )

    if not dashas:
        return None

    now = datetime.now()

    for dasha in dashas:
        start_str = dasha.get("start") or dasha.get("startDate") or ""
        end_str = dasha.get("end") or dasha.get("endDate") or ""

        try:
            start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            end = datetime.fromisoformat(end_str.replace("Z", "+00:00"))

            # If currently in this dasha or it's upcoming
            if end.replace(tzinfo=None) > now.replace(tzinfo=None):
                return dasha
        except (ValueError, TypeError):
            continue

    return dashas[0] if dashas else None


def _get_polarity_geometry(polarity_map: Dict) -> List[str]:
    """Extract polarity geometry traits from the polarity map."""
    traits = []

    axes = polarity_map.get("axes") or []

    # Check Guna contrast
    guna_axis = next((a for a in axes if a.get("name") == "Guna"), None)
    if guna_axis:
        contrast = guna_axis.get("contrast", 0)
        if contrast > 0.6:
            traits.append("high_guna_contrast")
        elif contrast < 0.3:
            traits.append("low_guna_contrast")

    # Check element dominance
    element_axis = next((a for a in axes if a.get("name") == "Element"), None)
    if element_axis:
        dominant = element_axis.get("dominant", "")
        if "Fire" in dominant:
            traits.append("fire_dominant")
        elif "Earth" in dominant:
            traits.append("earth_dominant")
        elif "Water" in dominant:
            traits.append("water_dominant")
        elif "Air" in dominant:
            traits.append("air_dominant")

    # Check Yin/Yang balance
    yinyang_axis = next((a for a in axes if a.get("name") == "Yin/Yang"), None)
    if yinyang_axis:
        balance = yinyang_axis.get("balance", 0.5)
        if balance > 0.65:
            traits.append("yang_dominant")
        elif balance < 0.35:
            traits.append("yin_dominant")
        else:
            traits.append("balanced_polarity")

    if not traits:
        traits.append("balanced_polarity")

    return traits


def forecast_composite_archetype(
    relationship: Dict,
    transits: List[str] = None,
    polarity_map: Dict = None
) -> Dict:
    """
    Forecast the relationship's future archetype based on:
    - Upcoming Mahadasha (50% weight)
    - Major transits (30% weight)
    - Composite polarity geometry (20% weight)

    Returns a forecast with the predicted archetype, confidence, and narrative.
    """
    if transits is None:
        transits = []

    if polarity_map is None:
        polarity_map = {}

    # Initialize archetype scores
    archetype_scores = {arch: 0.0 for arch in ARCHETYPE_DESCRIPTIONS.keys()}

    # ========================================
    # 1. Mahadasha Influence (50% weight)
    # ========================================
    next_dasha = _get_next_mahadasha(relationship)
    dasha_planet = None
    dasha_contribution = {}

    if next_dasha:
        dasha_planet = (
            next_dasha.get("planet") or
            next_dasha.get("lord") or
            next_dasha.get("ruler") or
            ""
        )

        # Normalize planet name
        if dasha_planet:
            dasha_planet = dasha_planet.strip().title()

            # Get planet's archetype influences
            planet_influences = PLANET_ARCHETYPE_INFLUENCE.get(dasha_planet, {})

            for archetype, weight in planet_influences.items():
                contribution = weight * 0.5  # 50% weight
                archetype_scores[archetype] = archetype_scores.get(archetype, 0) + contribution
                dasha_contribution[archetype] = contribution

    # ========================================
    # 2. Transit Influence (30% weight)
    # ========================================
    transit_contribution = {}

    for transit in transits:
        transit_modifiers = TRANSIT_ARCHETYPE_MODIFIERS.get(transit, {})

        for archetype, modifier in transit_modifiers.items():
            contribution = modifier * 0.3  # 30% weight (modifiers already normalized)
            archetype_scores[archetype] = archetype_scores.get(archetype, 0) + contribution
            transit_contribution[archetype] = transit_contribution.get(archetype, 0) + contribution

    # ========================================
    # 3. Polarity Geometry (20% weight)
    # ========================================
    geometry_traits = _get_polarity_geometry(polarity_map)
    geometry_contribution = {}

    for trait in geometry_traits:
        resonance = POLARITY_ARCHETYPE_RESONANCE.get(trait, {})

        for archetype, weight in resonance.items():
            contribution = weight * 0.2  # 20% weight (already normalized in mapping)
            archetype_scores[archetype] = archetype_scores.get(archetype, 0) + contribution
            geometry_contribution[archetype] = geometry_contribution.get(archetype, 0) + contribution

    # ========================================
    # 4. Determine Winner
    # ========================================
    sorted_archetypes = sorted(archetype_scores.items(), key=lambda x: x[1], reverse=True)

    forecast_archetype = sorted_archetypes[0][0] if sorted_archetypes else "The Balanced Polarity Pair"
    forecast_score = sorted_archetypes[0][1] if sorted_archetypes else 0

    # Calculate confidence (normalize to 0-100)
    max_possible_score = 0.5 + 0.3 + 0.2  # Maximum if all factors align perfectly
    confidence = min(100, int((forecast_score / max_possible_score) * 100))

    # Get archetype details
    archetype_data = ARCHETYPE_DESCRIPTIONS.get(forecast_archetype, {})

    # Get runner-up for comparison
    runner_up = sorted_archetypes[1][0] if len(sorted_archetypes) > 1 else None
    runner_up_score = sorted_archetypes[1][1] if len(sorted_archetypes) > 1 else 0

    # Build contribution breakdown
    contributions = {
        "mahadasha": {
            "planet": dasha_planet,
            "weight": "50%",
            "contributions": dasha_contribution
        },
        "transits": {
            "active": transits,
            "weight": "30%",
            "contributions": transit_contribution
        },
        "polarityGeometry": {
            "traits": geometry_traits,
            "weight": "20%",
            "contributions": geometry_contribution
        }
    }

    return {
        "forecastArchetype": forecast_archetype,
        "archetypeIcon": archetype_data.get("icon", "🎯"),
        "archetypeDescription": archetype_data.get("description", ""),
        "archetypeKeywords": archetype_data.get("keywords", []),
        "confidence": confidence,
        "narrative": FORECAST_NARRATIVES.get(forecast_archetype, ""),
        "runnerUp": {
            "archetype": runner_up,
            "score": round(runner_up_score, 3)
        } if runner_up else None,
        "contributions": contributions,
        "allScores": {arch: round(score, 3) for arch, score in sorted_archetypes[:5]}
    }


# ============================================================================
# COMPOSITE ARCHETYPE FORECAST TIMELINE
# Multi-chapter mythic future across the next 3 Mahadashas
# ============================================================================

# Chapter narrative templates based on archetype
CHAPTER_NARRATIVES = {
    "The Magnetic Opposites": "A chapter of dynamic polarity — attraction through difference activates creative tension and passionate engagement.",
    "The Harmonious Twins": "A chapter of natural resonance — the relationship flows with shared understanding and effortless attunement.",
    "The Fire-Air Circuit": "A chapter of inspiration and movement — bold ideas, passionate communication, and creative synergy define this period.",
    "The Earth-Water Foundation": "A chapter of nurturing stability — emotional security deepens as practical foundations strengthen.",
    "The Passion Axis": "A chapter of romantic intensity — intimacy, desire, and heart-centered connection become the central themes.",
    "The Dharma Companions": "A chapter of aligned purpose — shared mission, spiritual growth, and meaningful collaboration unfold.",
    "The Transformational Pair": "A chapter of deep transformation — intensity, karmic lessons, and profound mutual evolution are activated.",
    "The Karmic Mirrors": "A chapter of reflection — partners mirror each other's growth edges, teaching through honest confrontation.",
    "The Spiritual Counterparts": "A chapter of transcendence — spiritual intimacy deepens and a sense of shared higher purpose emerges.",
    "The Creative Disruptors": "A chapter of innovation — breaking patterns, experimenting with new dynamics, and embracing change.",
    "The Parallel Travelers": "A chapter of steady companionship — individual growth is supported while maintaining reliable connection.",
    "The Sacred Counterweights": "A chapter of conscious balance — each partner's unique qualities stabilize and complete the other.",
    "The Balanced Polarity Pair": "A chapter of measured harmony — stability through mutual respect and proportional exchange.",
    "The Stabilizer-Visionary Pair": "A chapter of complementary roles — imagination meets practicality as vision meets execution."
}

# Transit archetype influences for timeline periods
TRANSIT_TIMELINE_INFLUENCES = {
    "Saturn_Moon": ("The Transformational Pair", 0.25),
    "Jupiter_Venus": ("The Passion Axis", 0.25),
    "Mars_7thHouse": ("The Magnetic Opposites", 0.20),
    "Rahu_1stHouse": ("The Creative Disruptors", 0.20),
    "Jupiter_Sun": ("The Dharma Companions", 0.20),
    "Venus_Mars": ("The Passion Axis", 0.30),
    "Saturn_Saturn": ("The Transformational Pair", 0.25),
    "Ketu_Moon": ("The Spiritual Counterparts", 0.25)
}


def _get_upcoming_mahadashas(relationship: Dict, count: int = 3) -> List[Dict]:
    """Get the next N upcoming Mahadasha periods."""
    from datetime import datetime

    # Try multiple keys for dasha data
    dashas = (
        relationship.get("mahadashas") or
        relationship.get("mahadasas") or
        relationship.get("dashas") or
        relationship.get("vimshottari_mahadasha") or
        []
    )

    # Handle nested structure
    if isinstance(dashas, dict):
        dashas = dashas.get("mahadashas") or dashas.get("mahadasas") or []

    if not dashas:
        return []

    now = datetime.now()
    upcoming = []

    for dasha in dashas:
        end_str = dasha.get("end") or dasha.get("endDate") or ""

        try:
            end = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
            # If this dasha hasn't ended yet
            if end.replace(tzinfo=None) > now.replace(tzinfo=None):
                upcoming.append(dasha)
                if len(upcoming) >= count:
                    break
        except (ValueError, TypeError):
            continue

    # If not enough upcoming, take from the beginning
    if len(upcoming) < count and dashas:
        for dasha in dashas:
            if dasha not in upcoming:
                upcoming.append(dasha)
                if len(upcoming) >= count:
                    break

    return upcoming[:count]


def _score_archetype_for_period(
    planet: str,
    polarity_map: Dict,
    transits: List[str] = None
) -> Dict[str, float]:
    """Score all archetypes for a given Mahadasha period."""
    if transits is None:
        transits = []

    scores = {arch: 0.0 for arch in ARCHETYPE_DESCRIPTIONS.keys()}

    # 1. Mahadasha influence (50%)
    planet_normalized = planet.strip().title() if planet else ""
    planet_influences = PLANET_ARCHETYPE_INFLUENCE.get(planet_normalized, {})

    for archetype, weight in planet_influences.items():
        scores[archetype] += weight * 0.5

    # 2. Transit influence (30%)
    for transit in transits:
        transit_modifiers = TRANSIT_ARCHETYPE_MODIFIERS.get(transit, {})
        for archetype, modifier in transit_modifiers.items():
            scores[archetype] += modifier * 0.3

    # 3. Polarity geometry resonance (20%)
    geometry_traits = _get_polarity_geometry(polarity_map)
    for trait in geometry_traits:
        resonance = POLARITY_ARCHETYPE_RESONANCE.get(trait, {})
        for archetype, weight in resonance.items():
            scores[archetype] += weight * 0.2

    return scores


def build_composite_archetype_forecast_timeline(
    relationship: Dict,
    transits: List[str] = None,
    polarity_map: Dict = None,
    count: int = 3
) -> List[Dict]:
    """
    Build the Composite Archetype Forecast Timeline.

    Predicts the next N archetypes the relationship will become,
    across the next N Mahadasha periods.

    Returns a timeline of mythic chapters with:
    - Mahadasha planet and dates
    - Forecasted archetype
    - Chapter narrative
    - Growth and shadow themes
    - Score breakdown
    """
    if transits is None:
        transits = []

    if polarity_map is None:
        polarity_map = {}

    timeline = []
    upcoming_dashas = _get_upcoming_mahadashas(relationship, count)

    for idx, dasha in enumerate(upcoming_dashas):
        planet = (
            dasha.get("planet") or
            dasha.get("lord") or
            dasha.get("ruler") or
            ""
        )
        start = dasha.get("start") or dasha.get("startDate") or ""
        end = dasha.get("end") or dasha.get("endDate") or ""

        if not planet:
            continue

        # Normalize planet name
        planet_normalized = planet.strip().title()

        # Score all archetypes for this period
        scores = _score_archetype_for_period(planet_normalized, polarity_map, transits)

        # Find winning archetype
        sorted_archetypes = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        forecast_archetype = sorted_archetypes[0][0] if sorted_archetypes else "The Balanced Polarity Pair"
        forecast_score = sorted_archetypes[0][1] if sorted_archetypes else 0

        # Calculate confidence
        max_possible = 0.5 + 0.3 + 0.2
        confidence = min(100, int((forecast_score / max_possible) * 100))

        # Get archetype details
        archetype_data = ARCHETYPE_DESCRIPTIONS.get(forecast_archetype, {})

        # Get planet-specific themes
        growth = PLANET_GROWTH_THEMES.get(planet_normalized, "Growth through relational awareness.")
        shadow = PLANET_SHADOW_THEMES.get(planet_normalized, "Shadow patterns requiring conscious navigation.")
        planet_icon = PLANET_ICONS.get(planet_normalized, "🪐")

        # Get chapter narrative
        chapter_narrative = CHAPTER_NARRATIVES.get(forecast_archetype, FORECAST_NARRATIVES.get(forecast_archetype, ""))

        # Build score breakdown for top 5
        score_breakdown = {arch: round(score, 3) for arch, score in sorted_archetypes[:5]}

        # Determine chapter phase
        if idx == 0:
            phase = "Current/Emerging"
            phase_icon = "🌅"
        elif idx == 1:
            phase = "Middle Chapter"
            phase_icon = "🌞"
        else:
            phase = "Distant Future"
            phase_icon = "🌙"

        timeline.append({
            "chapterNumber": idx + 1,
            "phase": phase,
            "phaseIcon": phase_icon,
            "planet": planet_normalized,
            "planetIcon": planet_icon,
            "start": start,
            "end": end,
            "archetype": forecast_archetype,
            "archetypeIcon": archetype_data.get("icon", "🎯"),
            "archetypeDescription": archetype_data.get("description", ""),
            "archetypeKeywords": archetype_data.get("keywords", []),
            "chapterNarrative": chapter_narrative,
            "growth": growth,
            "shadow": shadow,
            "confidence": confidence,
            "scoreBreakdown": score_breakdown
        })

    # Add mythic arc summary
    if len(timeline) >= 2:
        arc_summary = _build_mythic_arc_summary(timeline)
    else:
        arc_summary = None

    return {
        "timeline": timeline,
        "arcSummary": arc_summary,
        "totalChapters": len(timeline)
    }


def _build_mythic_arc_summary(timeline: List[Dict]) -> Dict:
    """Build a summary of the mythic arc across all chapters."""
    if not timeline:
        return None

    archetypes = [t.get("archetype", "") for t in timeline]
    planets = [t.get("planet", "") for t in timeline]

    # Detect arc patterns
    arc_themes = []

    # Check for transformation arc
    transformation_archetypes = {"The Transformational Pair", "The Karmic Mirrors", "The Spiritual Counterparts"}
    if any(a in transformation_archetypes for a in archetypes):
        arc_themes.append("karmic transformation")

    # Check for passion arc
    passion_archetypes = {"The Passion Axis", "The Magnetic Opposites"}
    if any(a in passion_archetypes for a in archetypes):
        arc_themes.append("romantic intensity")

    # Check for stability arc
    stability_archetypes = {"The Earth-Water Foundation", "The Parallel Travelers", "The Sacred Counterweights"}
    if any(a in stability_archetypes for a in archetypes):
        arc_themes.append("grounded stability")

    # Check for growth arc
    growth_archetypes = {"The Dharma Companions", "The Harmonious Twins"}
    if any(a in growth_archetypes for a in archetypes):
        arc_themes.append("spiritual growth")

    # Check for creative arc
    creative_archetypes = {"The Fire-Air Circuit", "The Creative Disruptors"}
    if any(a in creative_archetypes for a in archetypes):
        arc_themes.append("creative evolution")

    # Build arc narrative
    if len(archetypes) >= 3:
        arc_narrative = (
            f"The relationship journeys from '{archetypes[0]}' through '{archetypes[1]}' "
            f"toward '{archetypes[2]}'. This mythic arc weaves themes of "
            f"{', '.join(arc_themes) if arc_themes else 'growth and evolution'}."
        )
    elif len(archetypes) == 2:
        arc_narrative = (
            f"The relationship transitions from '{archetypes[0]}' to '{archetypes[1]}'. "
            f"This arc emphasizes {', '.join(arc_themes) if arc_themes else 'relational evolution'}."
        )
    else:
        arc_narrative = f"The current chapter is defined by '{archetypes[0]}'."

    # Calculate overall intensity
    total_confidence = sum(t.get("confidence", 0) for t in timeline)
    avg_confidence = total_confidence / len(timeline) if timeline else 0

    return {
        "arcNarrative": arc_narrative,
        "arcThemes": arc_themes,
        "planetarySequence": planets,
        "archetypeSequence": archetypes,
        "averageConfidence": round(avg_confidence, 1)
    }
