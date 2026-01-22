"""
P6 Composite Chart Engine
Midpoint method → relationship personality vector

Creates a composite chart using the midpoint method:
Each composite planet = midpoint of both partners' planet positions

The composite chart represents the "personality" of the relationship itself.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime

from ..core.constants import DIMENSIONS_30, PLANET_NAMES, FACET_SHORT_CODES
from ..core.vector_utils import (
    create_zero_vector, clip_vector, apply_domain_modifiers,
    apply_facet_modifiers, weighted_blend
)
from ..core.swiss_ephemeris import (
    calculate_composite_positions, calculate_aspects,
    birth_data_to_jd, get_all_planet_positions
)
from ..sources.aspects import (
    aspects_to_30_facets, PLANET_MEANINGS, ASPECT_TYPE_MODIFIERS
)


# ============================================
# COMPOSITE PLANET MEANINGS
# ============================================
# How composite planets manifest in relationship dynamics

COMPOSITE_PLANET_MEANINGS = {
    'Sun': {
        'principle': 'Relationship identity, shared purpose, vitality',
        'description': 'The core identity and life direction of the relationship',
        'facets': {
            'E3': 0.12,      # Assertiveness - joint direction
            'C4': 0.10,      # Achievement - shared goals
            'E6': 0.08       # Positive Emotions - relationship joy
        }
    },
    'Moon': {
        'principle': 'Emotional foundation, nurturing style, security needs',
        'description': 'How the couple processes emotions and creates safety',
        'facets': {
            'O3': 0.15,      # Feelings - emotional depth
            'A6': 0.12,      # Tender-Mindedness - nurturing
            'E1': 0.10,      # Warmth - emotional connection
            'N6': 0.08       # Vulnerability - shared sensitivity
        }
    },
    'Mercury': {
        'principle': 'Communication style, mental connection, daily interaction',
        'description': 'How the couple talks, thinks, and shares ideas',
        'facets': {
            'O5': 0.12,      # Ideas - intellectual sharing
            'E2': 0.10,      # Gregariousness - social communication
            'A2': 0.08       # Straightforwardness - honesty
        }
    },
    'Venus': {
        'principle': 'Love expression, values, pleasure, harmony',
        'description': 'How the couple shows love and what they value together',
        'facets': {
            'A1': 0.12,      # Trust - relationship trust
            'O2': 0.12,      # Aesthetics - shared beauty
            'E1': 0.10,      # Warmth - affection
            'A3': 0.08       # Altruism - giving
        }
    },
    'Mars': {
        'principle': 'Drive, passion, conflict style, energy',
        'description': 'How the couple takes action and handles conflict',
        'facets': {
            'E4': 0.12,      # Activity - shared energy
            'E3': 0.10,      # Assertiveness - initiative
            'N2': 0.08,      # Angry Hostility - conflict potential
            'E5': 0.06       # Excitement Seeking - passion
        }
    },
    'Jupiter': {
        'principle': 'Growth, expansion, shared philosophy, abundance',
        'description': 'How the couple grows together and finds meaning',
        'facets': {
            'O6': 0.12,      # Values - shared beliefs
            'O4': 0.10,      # Actions - growth direction
            'E6': 0.10,      # Positive Emotions - optimism
            'A1': 0.06       # Trust - faith in each other
        }
    },
    'Saturn': {
        'principle': 'Commitment, structure, challenges, longevity',
        'description': 'The relationship\'s staying power and responsibilities',
        'facets': {
            'C3': 0.15,      # Dutifulness - commitment
            'C5': 0.12,      # Self-Discipline - endurance
            'C2': 0.08,      # Order - structure
            'N1': 0.06       # Anxiety - relationship concerns
        }
    }
}


# ============================================
# COMPOSITE ASPECT WEIGHTS
# ============================================
# How composite aspects affect relationship dynamics

COMPOSITE_ASPECT_WEIGHTS = {
    'Conjunction': 1.2,   # Intensified in composite
    'Opposition': 1.1,   # Major dynamic tension
    'Trine': 0.9,        # Easy flow in relationship
    'Square': 1.0,       # Growth challenges
    'Sextile': 0.7,      # Opportunities
    'Quincunx': 0.6      # Adjustment needs
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def calculate_composite_chart(user1_birth: Dict, user2_birth: Dict) -> Dict:
    """
    Calculate composite chart from two birth data sets.

    Args:
        user1_birth: Dict with year, month, day, hour, minute, timezone_offset
        user2_birth: Same structure as user1_birth

    Returns:
        Composite chart data including positions and aspects
    """
    # Calculate Julian Days
    jd1 = birth_data_to_jd(
        user1_birth['year'], user1_birth['month'], user1_birth['day'],
        user1_birth.get('hour', 12), user1_birth.get('minute', 0),
        user1_birth.get('timezone_offset', 0)
    )
    jd2 = birth_data_to_jd(
        user2_birth['year'], user2_birth['month'], user2_birth['day'],
        user2_birth.get('hour', 12), user2_birth.get('minute', 0),
        user2_birth.get('timezone_offset', 0)
    )

    # Get individual positions
    positions1 = get_all_planet_positions(jd1)
    positions2 = get_all_planet_positions(jd2)

    # Calculate composite positions (midpoints)
    composite_positions = calculate_composite_positions(positions1, positions2)

    # Calculate composite aspects
    composite_aspects = calculate_aspects(composite_positions)

    return {
        'positions': composite_positions,
        'aspects': composite_aspects,
        'user1_positions': positions1,
        'user2_positions': positions2
    }


def composite_to_30_facets(composite_chart: Dict) -> np.ndarray:
    """
    Convert composite chart to 30-facet relationship personality vector.

    Args:
        composite_chart: Result from calculate_composite_chart

    Returns:
        30-dimensional numpy array representing relationship personality
    """
    vector = create_zero_vector()

    positions = composite_chart.get('positions', {})
    aspects = composite_chart.get('aspects', [])

    # Apply composite planet positions
    for planet, pos_data in positions.items():
        if planet not in COMPOSITE_PLANET_MEANINGS:
            continue

        meaning = COMPOSITE_PLANET_MEANINGS[planet]
        facets = meaning.get('facets', {})

        # Planet position influence (based on sign/dignity - simplified)
        sign = pos_data.get('sign', '')
        sign_modifier = _get_sign_dignity_modifier(planet, sign)

        for facet, value in facets.items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * sign_modifier

    # Apply composite aspects
    if aspects:
        aspect_vector = aspects_to_30_facets(aspects, include_patterns=True)

        # Scale aspect vector for composite context
        for i, asp in enumerate(aspects):
            asp_type = asp.get('aspect', '')
            weight = COMPOSITE_ASPECT_WEIGHTS.get(asp_type, 1.0)
            # Composite aspects are weighted differently
            aspect_vector *= weight

        # Blend with planet positions
        vector = weighted_blend([vector, aspect_vector * 0.5], [0.7, 0.3])

    # Normalize to reasonable range
    vector = clip_vector(vector, 0.0, 1.0)

    return vector


def _get_sign_dignity_modifier(planet: str, sign: str) -> float:
    """
    Get modifier based on planet's dignity in sign.

    Simplified planetary dignities - rulership/exaltation boost,
    detriment/fall penalty.
    """
    dignities = {
        'Sun': {'ruler': 'Leo', 'exalt': 'Aries', 'detriment': 'Aquarius', 'fall': 'Libra'},
        'Moon': {'ruler': 'Cancer', 'exalt': 'Taurus', 'detriment': 'Capricorn', 'fall': 'Scorpio'},
        'Mercury': {'ruler': ['Gemini', 'Virgo'], 'exalt': 'Virgo', 'detriment': ['Sagittarius', 'Pisces'], 'fall': 'Pisces'},
        'Venus': {'ruler': ['Taurus', 'Libra'], 'exalt': 'Pisces', 'detriment': ['Scorpio', 'Aries'], 'fall': 'Virgo'},
        'Mars': {'ruler': ['Aries', 'Scorpio'], 'exalt': 'Capricorn', 'detriment': ['Libra', 'Taurus'], 'fall': 'Cancer'},
        'Jupiter': {'ruler': ['Sagittarius', 'Pisces'], 'exalt': 'Cancer', 'detriment': ['Gemini', 'Virgo'], 'fall': 'Capricorn'},
        'Saturn': {'ruler': ['Capricorn', 'Aquarius'], 'exalt': 'Libra', 'detriment': ['Cancer', 'Leo'], 'fall': 'Aries'}
    }

    if planet not in dignities:
        return 1.0

    dig = dignities[planet]

    # Check rulership
    ruler = dig.get('ruler', [])
    if isinstance(ruler, str):
        ruler = [ruler]
    if sign in ruler:
        return 1.2

    # Check exaltation
    exalt = dig.get('exalt', '')
    if sign == exalt:
        return 1.15

    # Check detriment
    detriment = dig.get('detriment', [])
    if isinstance(detriment, str):
        detriment = [detriment]
    if sign in detriment:
        return 0.85

    # Check fall
    fall = dig.get('fall', '')
    if sign == fall:
        return 0.8

    return 1.0


def get_composite_interpretation(composite_chart: Dict,
                                 relationship_vector: np.ndarray = None) -> Dict:
    """
    Generate human-readable interpretation of composite chart.

    Args:
        composite_chart: Result from calculate_composite_chart
        relationship_vector: Pre-computed vector (optional)

    Returns:
        Interpretation dictionary with descriptions
    """
    if relationship_vector is None:
        relationship_vector = composite_to_30_facets(composite_chart)

    positions = composite_chart.get('positions', {})
    aspects = composite_chart.get('aspects', [])

    interpretation = {
        'overview': '',
        'planets': {},
        'key_aspects': [],
        'relationship_style': {}
    }

    # Planet interpretations
    for planet, pos_data in positions.items():
        if planet not in COMPOSITE_PLANET_MEANINGS:
            continue

        meaning = COMPOSITE_PLANET_MEANINGS[planet]
        sign = pos_data.get('sign', 'Unknown')
        degree = pos_data.get('degree_in_sign', 0)

        interpretation['planets'][planet] = {
            'sign': sign,
            'degree': round(degree, 1),
            'meaning': meaning['principle'],
            'description': f"{planet} in {sign}: {_get_planet_sign_meaning(planet, sign)}"
        }

    # Key aspects interpretation
    significant_aspects = [a for a in aspects if a['aspect'] in ['Conjunction', 'Opposition', 'Square', 'Trine']]
    for asp in significant_aspects[:5]:  # Top 5 significant
        p1 = asp['planet1']['name']
        p2 = asp['planet2']['name']
        asp_type = asp['aspect']

        interpretation['key_aspects'].append({
            'planets': [p1, p2],
            'aspect': asp_type,
            'orb': round(asp.get('orb', 0), 1),
            'meaning': _get_composite_aspect_meaning(p1, p2, asp_type)
        })

    # Relationship style from vector
    from ..core.vector_utils import get_domain_scores
    domains = get_domain_scores(relationship_vector)

    interpretation['relationship_style'] = {
        'emotional_warmth': 'High' if domains['E'] > 0.6 else ('Moderate' if domains['E'] > 0.4 else 'Reserved'),
        'stability_focus': 'High' if domains['C'] > 0.6 else ('Moderate' if domains['C'] > 0.4 else 'Flexible'),
        'growth_orientation': 'High' if domains['O'] > 0.6 else ('Moderate' if domains['O'] > 0.4 else 'Traditional'),
        'harmony_priority': 'High' if domains['A'] > 0.6 else ('Moderate' if domains['A'] > 0.4 else 'Direct'),
        'intensity_level': 'High' if domains['N'] > 0.6 else ('Moderate' if domains['N'] > 0.4 else 'Calm')
    }

    # Generate overview
    interpretation['overview'] = _generate_relationship_overview(
        interpretation['relationship_style'],
        interpretation['planets']
    )

    return interpretation


def _get_planet_sign_meaning(planet: str, sign: str) -> str:
    """Get brief meaning of planet in sign for composite."""
    # Simplified interpretations
    meanings = {
        'Sun': {
            'Aries': 'A pioneering, action-oriented relationship identity',
            'Taurus': 'A stable, sensual relationship focused on security',
            'Gemini': 'A communicative, intellectually curious partnership',
            'Cancer': 'A nurturing, emotionally protective bond',
            'Leo': 'A creative, proud, and expressive relationship',
            'Virgo': 'A practical, service-oriented partnership',
            'Libra': 'A harmonious, partnership-focused relationship',
            'Scorpio': 'An intense, transformative bond',
            'Sagittarius': 'An adventurous, growth-oriented relationship',
            'Capricorn': 'An ambitious, structured partnership',
            'Aquarius': 'A unique, friendship-based relationship',
            'Pisces': 'A spiritual, compassionate bond'
        },
        'Moon': {
            'Aries': 'Emotional needs are met through action and independence',
            'Taurus': 'Security comes from stability and physical comfort',
            'Gemini': 'Emotional connection through conversation',
            'Cancer': 'Deep nurturing and protective emotional bond',
            'Leo': 'Emotional warmth expressed dramatically',
            'Virgo': 'Care shown through practical help',
            'Libra': 'Emotional balance and harmony prioritized',
            'Scorpio': 'Intense emotional depth and bonding',
            'Sagittarius': 'Freedom within emotional connection',
            'Capricorn': 'Emotional expression is measured but loyal',
            'Aquarius': 'Friendship forms the emotional foundation',
            'Pisces': 'Deeply empathic emotional connection'
        }
    }

    planet_meanings = meanings.get(planet, {})
    return planet_meanings.get(sign, f'{planet} expresses through {sign} energy')


def _get_composite_aspect_meaning(planet1: str, planet2: str, aspect: str) -> str:
    """Get meaning of composite aspect."""
    aspect_meanings = {
        'Conjunction': 'intensifies and merges',
        'Opposition': 'creates dynamic tension between',
        'Square': 'challenges growth through',
        'Trine': 'flows easily between',
        'Sextile': 'offers opportunities through'
    }

    meaning = COMPOSITE_PLANET_MEANINGS.get(planet1, {}).get('principle', planet1)
    meaning2 = COMPOSITE_PLANET_MEANINGS.get(planet2, {}).get('principle', planet2)

    verb = aspect_meanings.get(aspect, 'connects')

    return f"The relationship's {meaning.split(',')[0].lower()} {verb} {meaning2.split(',')[0].lower()}"


def _generate_relationship_overview(style: Dict, planets: Dict) -> str:
    """Generate overview paragraph from style and planets."""
    parts = []

    # Opening based on Sun sign
    if 'Sun' in planets:
        sun_sign = planets['Sun'].get('sign', '')
        parts.append(f"This is a {sun_sign}-flavored relationship")

    # Add style descriptors
    descriptors = []
    if style.get('emotional_warmth') == 'High':
        descriptors.append('emotionally expressive')
    if style.get('stability_focus') == 'High':
        descriptors.append('stability-focused')
    if style.get('growth_orientation') == 'High':
        descriptors.append('growth-oriented')
    if style.get('harmony_priority') == 'High':
        descriptors.append('harmony-seeking')

    if descriptors:
        parts.append(f"characterized by a {', '.join(descriptors)} dynamic")

    # Moon for emotional foundation
    if 'Moon' in planets:
        moon_sign = planets['Moon'].get('sign', '')
        parts.append(f"with a {moon_sign} emotional foundation")

    return ' '.join(parts) + '.' if parts else 'A unique relationship dynamic.'
