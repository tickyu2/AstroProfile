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
