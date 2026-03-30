"""
western_engine/planetary_psychology.py

Calculate planetary expression/psychology vectors.

Each planet represents a psychological function:
- Sun: Core identity, ego, vitality
- Moon: Emotional nature, instincts, needs
- Mercury: Communication, thinking, learning
- Venus: Love, values, aesthetics
- Mars: Drive, assertion, energy
- Jupiter: Expansion, beliefs, optimism
- Saturn: Structure, discipline, limitations
- Uranus: Innovation, rebellion, uniqueness
- Neptune: Spirituality, dreams, illusion
- Pluto: Transformation, power, depth
"""

from typing import List, Dict, Tuple, Optional
from .models import PlanetPosition, HouseCusps
from .constants import (
    PLANET_WEIGHTS, DIGNITY_MODIFIERS, PERSONAL_PLANETS,
    EXALTATION, DEBILITATION, DOMICILE, DETRIMENT,
    SIGN_ELEMENT, SIGN_MODALITY, SIGN_POLARITY
)
from .house_calculator import get_dignity


def calculate_planetary_psychology(
    planets: List[PlanetPosition],
    houses: Optional[HouseCusps] = None
) -> Dict[str, float]:
    """
    Calculate planetary psychology vector (15 dimensions).

    Each value represents how strongly that planetary function
    is expressed in the chart (0-1 scale).

    Factors:
    - Dignity (exalted/domicile vs detriment/debilitation)
    - House placement (angular houses amplify)
    - Aspects received
    - Retrograde status

    Args:
        planets: Planet positions
        houses: House cusps (optional, for house emphasis)

    Returns:
        Dict with 15 planetary expression values
    """
    psychology = {}

    # Angular houses (1, 4, 7, 10) amplify expression
    angular_houses = {1, 4, 7, 10}
    succedent_houses = {2, 5, 8, 11}

    for planet in planets:
        name = planet.planet.lower().replace(" ", "_")

        # Base expression from planet weight
        base_weight = PLANET_WEIGHTS.get(planet.planet, 0.5)

        # Dignity modifier
        dignity = get_dignity(planet.planet, planet.sign)
        dignity_mod = DIGNITY_MODIFIERS.get(dignity, 1.0)

        # House modifier
        house_mod = 1.0
        if planet.house:
            if planet.house in angular_houses:
                house_mod = 1.2  # Angular houses amplify
            elif planet.house in succedent_houses:
                house_mod = 1.0  # Succedent normal
            else:
                house_mod = 0.9  # Cadent houses slightly weaken

        # Retrograde modifier (internalized energy)
        retro_mod = 0.95 if planet.retrograde else 1.0

        # Calculate expression (normalize to 0-1)
        expression = base_weight * dignity_mod * house_mod * retro_mod
        expression = min(1.0, expression)  # Cap at 1.0

        psychology[name] = round(expression, 3)

    # Ensure all 15 planets have values
    all_planets = [
        "sun", "moon", "mercury", "venus", "mars",
        "jupiter", "saturn", "uranus", "neptune", "pluto",
        "ascendant", "midheaven", "north_node", "chiron", "lilith"
    ]

    for p in all_planets:
        if p not in psychology:
            psychology[p] = 0.5  # Default neutral value

    return psychology


def calculate_dominant_planet(
    planets: List[PlanetPosition],
    aspects_received: Optional[Dict[str, int]] = None
) -> Tuple[str, float]:
    """
    Determine the dominant planet in the chart.

    Factors:
    - Dignity
    - House placement
    - Number of aspects
    - Rulerships

    Returns:
        Tuple of (dominant planet name, strength score)
    """
    scores = {}

    for planet in planets:
        score = 0.0

        # Base weight
        score += PLANET_WEIGHTS.get(planet.planet, 0.5) * 0.3

        # Dignity bonus
        dignity = get_dignity(planet.planet, planet.sign)
        if dignity == "Exalted":
            score += 0.3
        elif dignity == "Domicile":
            score += 0.25
        elif dignity == "Detriment":
            score -= 0.1
        elif dignity == "Debilitated":
            score -= 0.15

        # Angular house bonus
        if planet.house in [1, 4, 7, 10]:
            score += 0.2
        elif planet.house in [2, 5, 8, 11]:
            score += 0.1

        # Aspect count bonus
        if aspects_received and planet.planet in aspects_received:
            aspect_count = aspects_received[planet.planet]
            score += min(0.3, aspect_count * 0.05)

        scores[planet.planet] = score

    if not scores:
        return ("Sun", 0.5)

    dominant = max(scores, key=scores.get)
    strength = min(1.0, scores[dominant])

    return (dominant, round(strength, 3))


def calculate_yang_yin_ratio(planets: List[PlanetPosition]) -> float:
    """
    Calculate Yang/Yin polarity ratio.

    Yang (masculine): Fire and Air signs
    Yin (feminine): Earth and Water signs

    Returns:
        Ratio from 0 (pure Yin) to 1 (pure Yang), 0.5 = balanced
    """
    yang_score = 0.0
    yin_score = 0.0

    for planet in planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        polarity = SIGN_POLARITY.get(planet.sign, "Yang")

        if polarity == "Yang":
            yang_score += weight
        else:
            yin_score += weight

    total = yang_score + yin_score
    if total == 0:
        return 0.5

    return round(yang_score / total, 3)


def calculate_element_distribution(
    planets: List[PlanetPosition]
) -> Dict[str, float]:
    """
    Calculate element distribution across planets.

    Returns:
        Dict with Fire, Earth, Air, Water percentages (sum to 1)
    """
    elements = {"Fire": 0.0, "Earth": 0.0, "Air": 0.0, "Water": 0.0}

    for planet in planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        element = SIGN_ELEMENT.get(planet.sign, "Fire")

        # Apply dignity modifier
        dignity = get_dignity(planet.planet, planet.sign)
        dignity_mod = DIGNITY_MODIFIERS.get(dignity, 1.0)

        elements[element] += weight * dignity_mod

    # Normalize to percentages
    total = sum(elements.values())
    if total > 0:
        for elem in elements:
            elements[elem] = round(elements[elem] / total, 3)

    return elements


def calculate_modality_distribution(
    planets: List[PlanetPosition]
) -> Dict[str, float]:
    """
    Calculate modality distribution across planets.

    Returns:
        Dict with Cardinal, Fixed, Mutable percentages (sum to 1)
    """
    modalities = {"Cardinal": 0.0, "Fixed": 0.0, "Mutable": 0.0}

    for planet in planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        modality = SIGN_MODALITY.get(planet.sign, "Cardinal")

        modalities[modality] += weight

    # Normalize
    total = sum(modalities.values())
    if total > 0:
        for mod in modalities:
            modalities[mod] = round(modalities[mod] / total, 3)

    return modalities


def calculate_element_purity(distribution: Dict[str, float]) -> float:
    """
    Calculate how concentrated the element distribution is.

    A chart with 100% Fire would have purity 1.0
    A chart with 25% each would have purity 0.25

    Returns:
        Purity score from 0.25 (even) to 1.0 (pure)
    """
    values = list(distribution.values())
    if not values:
        return 0.25

    max_val = max(values)
    return round(max_val, 3)


def calculate_modality_purity(distribution: Dict[str, float]) -> float:
    """
    Calculate how concentrated the modality distribution is.

    Returns:
        Purity score from 0.33 (even) to 1.0 (pure)
    """
    values = list(distribution.values())
    if not values:
        return 0.33

    max_val = max(values)
    return round(max_val, 3)


def calculate_retrograde_count(planets: List[PlanetPosition]) -> int:
    """Count retrograde planets (excluding Sun and Moon which don't retrograde)."""
    count = 0
    for planet in planets:
        if planet.retrograde and planet.planet not in ["Sun", "Moon", "Ascendant", "Midheaven"]:
            count += 1
    return count


def calculate_overall_dignity_score(planets: List[PlanetPosition]) -> float:
    """
    Calculate overall dignity score for the chart.

    Returns:
        Score from 0 (all debilitated) to 1 (all exalted)
    """
    dignity_scores = {
        "Exalted": 1.0,
        "Domicile": 0.8,
        "Neutral": 0.5,
        "Detriment": 0.3,
        "Debilitated": 0.1
    }

    total_score = 0.0
    total_weight = 0.0

    for planet in planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        dignity = get_dignity(planet.planet, planet.sign)
        score = dignity_scores.get(dignity, 0.5)

        total_score += score * weight
        total_weight += weight

    if total_weight == 0:
        return 0.5

    return round(total_score / total_weight, 3)


def calculate_venus_condition(
    venus: PlanetPosition,
    aspects: Optional[List] = None,
    sun_longitude: Optional[float] = None,
) -> Dict[str, any]:
    """
    Compute comprehensive Venus condition summary.

    Evaluates Venus through multiple lenses:
    - Essential dignity (domicile/exaltation/detriment/debilitation)
    - Combustion / cazimi (proximity to Sun)
    - House placement strength (angular > succedent > cadent)
    - Retrograde status
    - Aspect harmony with planet-specific modifiers
    - Overall condition score (0-1)

    Args:
        venus: Venus PlanetPosition
        aspects: Optional list of aspects involving Venus
            Each item should have: planet1, planet2, aspect_type (or is_harmonious/is_challenging)
        sun_longitude: Optional Sun ecliptic longitude for combustion/cazimi detection

    Returns:
        Dict with dignity, house theme, retrograde flag, aspect summary,
        condition label, composite score, and narrative summary.
    """
    # --- Essential dignity ---
    dignity = get_dignity("Venus", venus.sign)
    dignity_score = DIGNITY_MODIFIERS.get(dignity, 1.0)

    dignity_keywords = {
        "Exalted": "transcendent grace — Venus radiates effortlessly",
        "Domicile": "at home — Venus expresses naturally and reliably",
        "Neutral": "balanced — Venus functions in a steady, ordinary way",
        "Detriment": "challenged — Venus must work harder to express love and beauty",
        "Debilitated": "weakened — Venus feels conflicted, hidden gifts await excavation",
    }
    dignity_narrative = dignity_keywords.get(dignity, "")

    # --- Combustion / cazimi (Sun proximity) ---
    combustion_status = "none"
    combustion_mod = 1.0
    combustion_note = ""
    sun_separation = None

    if sun_longitude is not None:
        diff = abs(venus.longitude - sun_longitude)
        sun_separation = round(min(diff, 360 - diff), 3)

        if sun_separation <= 0.28:
            combustion_status = "cazimi"
            combustion_mod = 1.25  # paradoxically exalted — "in the heart of the Sun"
            combustion_note = (
                f"Venus is cazimi ({sun_separation:.2f}° from Sun) — "
                "in the heart of the Sun, Venus gains extraordinary power and purity"
            )
        elif sun_separation <= 8.5:
            combustion_status = "combust"
            combustion_mod = 0.70  # significantly weakened
            combustion_note = (
                f"Venus is combust ({sun_separation:.2f}° from Sun) — "
                "overwhelmed by the Sun's light, Venus struggles to express freely"
            )
        elif sun_separation <= 17.0:
            combustion_status = "under_beams"
            combustion_mod = 0.88  # mildly weakened
            combustion_note = (
                f"Venus is under the beams ({sun_separation:.2f}° from Sun) — "
                "partially hidden by solar glare, Venus is somewhat muted"
            )

    # --- Element & modality context ---
    element = SIGN_ELEMENT.get(venus.sign, "")
    modality = SIGN_MODALITY.get(venus.sign, "")
    polarity = SIGN_POLARITY.get(venus.sign, "")

    element_flavor = {
        "Fire": "passionate, bold, spontaneous in love",
        "Earth": "sensual, loyal, values material beauty",
        "Air": "intellectual, social, drawn to harmony of ideas",
        "Water": "deeply emotional, intuitive, seeks soul-level bonds",
    }

    # --- House placement ---
    angular_houses = {1, 4, 7, 10}
    succedent_houses = {2, 5, 8, 11}
    house = venus.house

    if house in angular_houses:
        house_strength = "angular"
        house_mod = 1.2
        house_note = "Venus is prominently visible — love and aesthetics are front and center"
    elif house in succedent_houses:
        house_strength = "succedent"
        house_mod = 1.0
        house_note = "Venus has steady, resourceful expression"
    elif house:
        house_strength = "cadent"
        house_mod = 0.9
        house_note = "Venus works more subtly, behind the scenes"
    else:
        house_strength = "unknown"
        house_mod = 1.0
        house_note = "House unknown (birth time may be missing)"

    house_themes = {
        1: "self-image, personal charm, first impressions",
        2: "values, possessions, self-worth, sensual pleasure",
        3: "communication style, local connections, sibling bonds",
        4: "home, family roots, emotional foundation",
        5: "romance, creativity, playfulness, children",
        6: "daily routines, health aesthetics, service",
        7: "partnerships, marriage, one-on-one relationships",
        8: "deep intimacy, shared resources, transformation",
        9: "philosophy, travel, cross-cultural love",
        10: "public image, career aesthetics, reputation",
        11: "friendships, community, hopes and wishes",
        12: "hidden love, spiritual devotion, sacrifice",
    }
    house_theme = house_themes.get(house, "")

    # --- Retrograde ---
    retro_mod = 0.95 if venus.retrograde else 1.0
    retro_note = "Venus retrograde — love turns inward, revisiting past values and relationships" if venus.retrograde else ""

    # --- Aspect analysis ---
    harmonious_count = 0
    challenging_count = 0
    aspect_details = []

    # Planet-specific aspect modifiers — some planets amplify or
    # diminish the effect of their aspect to Venus
    planet_aspect_weight = {
        "jupiter": 1.2,   # greater benefic amplifies harmony
        "moon": 1.1,      # emotional resonance
        "neptune": 1.05,  # spiritual/artistic
        "mars": -0.15,    # passion but friction — reduces harmony credit
        "saturn": -0.2,   # restriction/duty — reduces harmony credit
        "pluto": -0.1,    # intensity/obsession
    }

    if aspects:
        for asp in aspects:
            # Support both dict and object with attributes
            if hasattr(asp, "planet1"):
                p1, p2, atype = asp.planet1, asp.planet2, asp.aspect_type
            elif isinstance(asp, dict):
                p1, p2, atype = asp.get("planet1", ""), asp.get("planet2", ""), asp.get("aspect", asp.get("aspect_type", ""))
            else:
                continue

            involves_venus = ("venus" in p1.lower() or "venus" in p2.lower() or
                              p1 == "Venus" or p2 == "Venus")
            if not involves_venus:
                continue

            other = p2 if ("venus" in p1.lower() or p1 == "Venus") else p1
            atype_lower = atype.lower()
            other_key = other.lower().strip()

            # Base weight with planet-specific modifier
            pw = planet_aspect_weight.get(other_key, 0)

            if atype_lower in ("trine", "sextile", "quintile", "biquintile"):
                weight = max(0.2, 1.0 + pw)  # floor at 0.2 so it stays positive
                harmonious_count += weight
                aspect_details.append({"planet": other, "aspect": atype, "nature": "harmonious", "weight": round(weight, 2)})
            elif atype_lower in ("square", "opposition", "quincunx", "semi-square", "sesquiquadrate"):
                weight = max(0.2, 1.0 - pw)  # challenging gets inverse modifier
                challenging_count += weight
                aspect_details.append({"planet": other, "aspect": atype, "nature": "challenging", "weight": round(weight, 2)})
            else:
                # conjunction — context-dependent, lean by planet modifier
                harmonious_count += 0.5
                challenging_count += 0.5
                aspect_details.append({"planet": other, "aspect": atype, "nature": "neutral", "weight": 0.5})

    total_asp = harmonious_count + challenging_count
    if total_asp > 0:
        harmony_ratio = round(harmonious_count / total_asp, 3)
    else:
        harmony_ratio = 0.5  # neutral when no aspects

    # --- Composite score ---
    raw_score = dignity_score * house_mod * retro_mod * combustion_mod
    # Blend with aspect harmony (70% dignity/house/retro/combustion, 30% aspect harmony)
    composite = (raw_score * 0.7) + (harmony_ratio * 1.2 * 0.3)  # scale harmony to ~1.0-1.2 range
    composite = round(min(1.0, max(0.0, composite / 1.2)), 3)  # normalize to 0-1

    # --- Condition label ---
    if composite >= 0.85:
        condition = "exceptional"
    elif composite >= 0.70:
        condition = "strong"
    elif composite >= 0.50:
        condition = "balanced"
    elif composite >= 0.35:
        condition = "challenged"
    else:
        condition = "debilitated"

    # --- Build narrative ---
    parts = [f"Venus in {venus.sign}"]
    if dignity != "Neutral":
        parts.append(f"({dignity})")
    parts.append(f"— {element_flavor.get(element, '')}")
    if combustion_status != "none":
        parts.append(f"| {combustion_note}")
    if house:
        parts.append(f"| House {house}: {house_theme}")
    if venus.retrograde:
        parts.append(f"| {retro_note}")
    summary = " ".join(parts)

    return {
        "sign": venus.sign,
        "degreeInSign": round(venus.degree_in_sign, 2),
        "longitude": round(venus.longitude, 2),
        "dignity": dignity,
        "dignityScore": round(dignity_score, 3),
        "dignityNarrative": dignity_narrative,
        "element": element,
        "modality": modality,
        "polarity": polarity,
        "elementFlavor": element_flavor.get(element, ""),
        "combustionStatus": combustion_status,
        "combustionMod": round(combustion_mod, 3),
        "combustionNote": combustion_note,
        "sunSeparation": sun_separation,
        "house": house,
        "houseStrength": house_strength,
        "houseTheme": house_theme,
        "houseNote": house_note,
        "retrograde": venus.retrograde,
        "retrogradeNote": retro_note,
        "aspects": aspect_details,
        "harmoniousAspects": round(harmonious_count, 2),
        "challengingAspects": round(challenging_count, 2),
        "harmonyRatio": harmony_ratio,
        "compositeScore": composite,
        "condition": condition,
        "summary": summary,
    }


def calculate_archetype_vector(planets: List[PlanetPosition]) -> Dict[str, float]:
    """
    Calculate 9-dimensional archetype vector.

    Maps signs to 9 archetypes:
    - Warrior (Aries)
    - Builder (Taurus, Capricorn)
    - Messenger (Gemini, Aquarius)
    - Nurturer (Cancer, Pisces)
    - Performer (Leo)
    - Analyst (Virgo)
    - Harmonizer (Libra)
    - Transformer (Scorpio)
    - Philosopher (Sagittarius)
    """
    # Sign to archetype mapping
    sign_to_archetype = {
        "Aries": "warrior",
        "Taurus": "builder",
        "Gemini": "messenger",
        "Cancer": "nurturer",
        "Leo": "performer",
        "Virgo": "analyst",
        "Libra": "harmonizer",
        "Scorpio": "transformer",
        "Sagittarius": "philosopher",
        "Capricorn": "builder",      # Combines with Taurus
        "Aquarius": "messenger",     # Combines with Gemini
        "Pisces": "nurturer"         # Combines with Cancer
    }

    archetypes = {
        "warrior": 0.0,
        "builder": 0.0,
        "messenger": 0.0,
        "nurturer": 0.0,
        "performer": 0.0,
        "analyst": 0.0,
        "harmonizer": 0.0,
        "transformer": 0.0,
        "philosopher": 0.0
    }

    for planet in planets:
        weight = PLANET_WEIGHTS.get(planet.planet, 0.5)
        archetype = sign_to_archetype.get(planet.sign, "warrior")

        # Apply dignity modifier
        dignity = get_dignity(planet.planet, planet.sign)
        dignity_mod = DIGNITY_MODIFIERS.get(dignity, 1.0)

        archetypes[archetype] += weight * dignity_mod

    # Normalize to sum to 1
    total = sum(archetypes.values())
    if total > 0:
        for arch in archetypes:
            archetypes[arch] = round(archetypes[arch] / total, 3)

    return archetypes
