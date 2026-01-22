"""
P8 Secondary Progressions Engine
Progressed planets + Progressed Moon → evolved personality

Secondary progressions use the "day-for-a-year" method:
- Each day after birth = one year of life
- Progressed Moon moves ~1° per month (changes sign every 2.5 years)
- Slower planets show gradual life themes

The Progressed Moon is the "emotional heartbeat" of the chart.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta

from ..core.constants import (
    DIMENSIONS_30, FACET_SHORT_CODES, FACET_NAMES,
    ASPECT_TYPES, ASPECT_ORBS, PLANETS
)
from ..core.vector_utils import (
    create_zero_vector, clip_vector, apply_domain_modifiers,
    apply_facet_modifiers, weighted_blend, calculate_orb_weight
)
from ..core.swiss_ephemeris import (
    birth_data_to_jd, get_all_planet_positions, calculate_angle_difference,
    identify_aspect, calculate_progressed_date, get_progressed_positions
)


# ============================================
# PROGRESSED MOON ASPECT ORBS (Tighter)
# ============================================
# Moon moves ~1° per month, so tighter orbs for precision

PROG_MOON_ASPECT_TYPES = {
    'Conjunction': {'angle': 0, 'orb': 4.0, 'weight': 1.00},
    'Opposition': {'angle': 180, 'orb': 4.0, 'weight': 0.90},
    'Trine': {'angle': 120, 'orb': 3.0, 'weight': 0.80},
    'Square': {'angle': 90, 'orb': 3.0, 'weight': 0.85},
    'Sextile': {'angle': 60, 'orb': 2.5, 'weight': 0.60},
    'Quincunx': {'angle': 150, 'orb': 1.5, 'weight': 0.40}
}


# ============================================
# PROGRESSED PLANET MEANINGS
# ============================================
# How progressed planets affect personality evolution

PROGRESSED_PLANET_MEANINGS = {
    'Sun': {
        'principle': 'Evolving identity and life purpose',
        'description': 'Core self gradually transforming over decades',
        'facets': {
            'E3': 0.12,      # Assertiveness evolution
            'C4': 0.10,      # Achievement focus
            'O6': 0.08       # Evolving values
        },
        'progression_rate': '1° per year'
    },
    'Moon': {
        'principle': 'Emotional needs and inner rhythm',
        'description': 'Emotional focus changes every 2-3 years',
        'facets': {
            'O3': 0.18,      # Feelings - primary
            'N6': 0.15,      # Vulnerability
            'E1': 0.12,      # Warmth cycles
            'A6': 0.10       # Tender-mindedness
        },
        'progression_rate': '1° per month'
    },
    'Mercury': {
        'principle': 'Evolving communication and thinking',
        'description': 'Mental focus and communication style changes',
        'facets': {
            'O5': 0.12,      # Ideas
            'C6': 0.10,      # Deliberation
            'E2': 0.08       # Communication style
        },
        'progression_rate': '1° per year (variable)'
    },
    'Venus': {
        'principle': 'Evolving values and relationship needs',
        'description': 'What you love and value transforms over time',
        'facets': {
            'A1': 0.12,      # Trust in relationships
            'O2': 0.10,      # Aesthetic sense
            'E1': 0.10,      # Warmth expression
            'A3': 0.08       # Altruism
        },
        'progression_rate': '1° per year (variable)'
    },
    'Mars': {
        'principle': 'Evolving drive and assertion style',
        'description': 'How you take action and express will',
        'facets': {
            'E3': 0.15,      # Assertiveness
            'E4': 0.12,      # Activity level
            'C4': 0.10,      # Achievement striving
            'N2': 0.08       # Anger expression
        },
        'progression_rate': '0.5° per year'
    }
}


# ============================================
# PROGRESSED MOON SIGN INFLUENCES
# ============================================
# Emotional coloring based on Moon's progressed sign

PROG_MOON_SIGN_INFLUENCE = {
    'Aries': {
        'description': 'Emotional need for independence and action',
        'facets': {'E3': 0.15, 'E4': 0.12, 'N2': 0.08, 'A4': -0.08}
    },
    'Taurus': {
        'description': 'Emotional need for stability and comfort',
        'facets': {'C2': 0.12, 'A1': 0.10, 'E5': -0.08, 'O4': -0.05}
    },
    'Gemini': {
        'description': 'Emotional need for variety and communication',
        'facets': {'O5': 0.12, 'E2': 0.12, 'E5': 0.08, 'C5': -0.08}
    },
    'Cancer': {
        'description': 'Emotional need for security and nurturing',
        'facets': {'A6': 0.15, 'O3': 0.12, 'N6': 0.10, 'E1': 0.10}
    },
    'Leo': {
        'description': 'Emotional need for recognition and creativity',
        'facets': {'E3': 0.12, 'E6': 0.12, 'O2': 0.08, 'A5': -0.08}
    },
    'Virgo': {
        'description': 'Emotional need for order and improvement',
        'facets': {'C2': 0.15, 'C3': 0.10, 'C6': 0.10, 'O1': -0.08}
    },
    'Libra': {
        'description': 'Emotional need for harmony and partnership',
        'facets': {'A1': 0.12, 'A4': 0.12, 'O2': 0.10, 'E3': -0.08}
    },
    'Scorpio': {
        'description': 'Emotional need for depth and transformation',
        'facets': {'O3': 0.15, 'N3': 0.08, 'C4': 0.10, 'A2': -0.08}
    },
    'Sagittarius': {
        'description': 'Emotional need for freedom and meaning',
        'facets': {'O4': 0.15, 'O6': 0.12, 'E5': 0.10, 'C2': -0.08}
    },
    'Capricorn': {
        'description': 'Emotional need for achievement and structure',
        'facets': {'C4': 0.15, 'C5': 0.12, 'C3': 0.10, 'E6': -0.08}
    },
    'Aquarius': {
        'description': 'Emotional need for independence and innovation',
        'facets': {'O5': 0.15, 'O4': 0.12, 'A4': -0.10, 'E2': 0.08}
    },
    'Pisces': {
        'description': 'Emotional need for transcendence and compassion',
        'facets': {'O1': 0.15, 'O3': 0.12, 'A6': 0.12, 'C5': -0.10}
    }
}


# ============================================
# PROGRESSED ASPECT IMPACT VECTORS (30-facet)
# ============================================

PROG_ASPECT_IMPACT = {
    'Conjunction': {
        'description': 'Fusion - powerful activation of both planets',
        'base_modifier': 1.0,
        'facets': {
            'O3': 0.15,      # Heightened feeling
            'E4': 0.10,      # Increased activity
            'C4': 0.08       # Focus on achievement
        }
    },
    'Opposition': {
        'description': 'Awareness - tension between inner and outer',
        'base_modifier': 0.9,
        'facets': {
            'N1': 0.12,      # Tension/anxiety
            'O3': 0.10,      # Emotional awareness
            'E3': 0.08       # Projection onto others
        }
    },
    'Square': {
        'description': 'Challenge - growth through friction',
        'base_modifier': 0.85,
        'facets': {
            'N1': 0.15,      # Stress
            'C4': 0.12,      # Drive to overcome
            'N2': 0.08       # Frustration potential
        }
    },
    'Trine': {
        'description': 'Flow - easy integration and expression',
        'base_modifier': 0.8,
        'facets': {
            'E6': 0.12,      # Ease and optimism
            'O4': 0.10,      # Natural action
            'N1': -0.08      # Reduced anxiety
        }
    },
    'Sextile': {
        'description': 'Opportunity - potential requiring effort',
        'base_modifier': 0.6,
        'facets': {
            'O5': 0.10,      # New ideas
            'O4': 0.08,      # Action possibilities
            'A4': 0.06       # Cooperation
        }
    },
    'Quincunx': {
        'description': 'Adjustment - blind spot requiring adaptation',
        'base_modifier': 0.5,
        'facets': {
            'N1': 0.10,      # Discomfort
            'O4': 0.08,      # Need to adapt
            'C6': 0.08       # Deliberation required
        }
    }
}


# ============================================
# PROGRESSED MOON IMPACT VECTORS (30-facet)
# ============================================
# Moon-specific aspects have stronger emotional coloring

PROG_MOON_IMPACT_30 = {
    'Conjunction': np.array([
        0.25, 0.20, 0.25, 0.30, 0.18, 0.28,   # N: Strong emotional activation
        0.35, 0.28, 0.20, 0.22, 0.18, 0.38,   # E: Warmth, positive emotions
        0.22, 0.28, 0.35, 0.20, 0.22, 0.18,   # O: Feelings, fantasy heightened
        0.35, 0.32, 0.38, 0.28, 0.22, 0.35,   # A: Altruism, tender-mindedness
        0.15, 0.12, 0.10, 0.18, 0.15, 0.12    # C: Minor influence
    ]),
    'Opposition': np.array([
        0.30, 0.25, 0.28, 0.22, 0.20, 0.32,   # N: Tension, awareness
        0.18, 0.22, 0.28, 0.20, 0.15, 0.20,   # E: Projection outward
        0.20, 0.25, 0.30, 0.18, 0.20, 0.22,   # O: Emotional clarity
        0.22, 0.28, 0.25, 0.20, 0.18, 0.25,   # A: Relationship focus
        0.10, 0.12, 0.08, 0.15, 0.12, 0.10    # C: Minor
    ]),
    'Square': np.array([
        0.35, 0.30, 0.32, 0.28, 0.25, 0.35,   # N: Emotional friction
        0.15, 0.18, 0.25, 0.22, 0.20, 0.15,   # E: Tension in expression
        0.18, 0.22, 0.28, 0.15, 0.18, 0.20,   # O: Growth pressure
        0.18, 0.20, 0.22, 0.25, 0.15, 0.20,   # A: Relationship challenges
        0.12, 0.15, 0.10, 0.20, 0.18, 0.12    # C: Drive to resolve
    ]),
    'Trine': np.array([
        0.10, 0.08, 0.12, 0.15, 0.10, 0.12,   # N: Emotional ease
        0.30, 0.28, 0.25, 0.28, 0.22, 0.35,   # E: Flow, positive expression
        0.22, 0.25, 0.28, 0.22, 0.20, 0.18,   # O: Creative feeling
        0.28, 0.30, 0.32, 0.25, 0.22, 0.30,   # A: Harmonious relating
        0.15, 0.18, 0.12, 0.20, 0.18, 0.15    # C: Gentle discipline
    ]),
    'Sextile': np.array([
        0.12, 0.10, 0.15, 0.18, 0.12, 0.15,   # N: Mild activation
        0.25, 0.22, 0.20, 0.22, 0.18, 0.28,   # E: Opportunity energy
        0.20, 0.22, 0.25, 0.18, 0.22, 0.18,   # O: Mental-emotional blend
        0.25, 0.28, 0.28, 0.22, 0.20, 0.25,   # A: Social harmony
        0.18, 0.20, 0.15, 0.22, 0.20, 0.18    # C: Productive focus
    ]),
    'Quincunx': np.array([
        0.22, 0.18, 0.25, 0.28, 0.20, 0.25,   # N: Adjustment stress
        0.15, 0.18, 0.20, 0.18, 0.15, 0.18,   # E: Uncertain expression
        0.18, 0.20, 0.28, 0.15, 0.20, 0.22,   # O: Seeking understanding
        0.20, 0.22, 0.25, 0.20, 0.18, 0.22,   # A: Relating challenges
        0.15, 0.18, 0.12, 0.18, 0.15, 0.15    # C: Need for adaptation
    ])
}


# ============================================
# COMBINATION WEIGHTS
# ============================================
# How to weight different progression types

PROGRESSION_WEIGHTS = {
    'prog_to_natal': 0.40,      # Core life themes - most important
    'prog_to_prog': 0.30,       # Inner dynamics evolution
    'moon_specific': 0.30       # Emotional weather - very personal
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def calculate_progressions(birth_data: Dict, target_date: datetime = None) -> Dict:
    """
    Calculate secondary progressions for a given date.

    Uses the day-for-year method:
    - Each day after birth = one year of life
    - At age 30, look at positions 30 days after birth

    Args:
        birth_data: Dict with year, month, day, hour, minute, timezone_offset
        target_date: Date to calculate progressions for (defaults to today)

    Returns:
        Dict with progressed positions, aspects, and Moon data
    """
    if target_date is None:
        target_date = datetime.utcnow()

    # Calculate natal Julian Day
    natal_jd = birth_data_to_jd(
        birth_data['year'], birth_data['month'], birth_data['day'],
        birth_data.get('hour', 12), birth_data.get('minute', 0),
        birth_data.get('timezone_offset', 0)
    )

    # Get natal positions
    natal_positions = get_all_planet_positions(natal_jd)

    # Calculate current Julian Day for progressions
    from ..core.swiss_ephemeris import datetime_to_jd
    current_jd = datetime_to_jd(target_date)

    # Calculate progressed positions using day-for-year
    progressed_positions = get_progressed_positions(natal_jd, current_jd)

    # Calculate progressed-to-natal aspects
    prog_to_natal = _calculate_prog_to_natal_aspects(
        progressed_positions, natal_positions
    )

    # Calculate progressed-to-progressed aspects
    prog_to_prog = _calculate_prog_to_prog_aspects(progressed_positions)

    # Calculate progressed Moon specifics
    prog_moon = _calculate_progressed_moon(
        progressed_positions, natal_positions, birth_data, target_date
    )

    return {
        'target_date': target_date.isoformat(),
        'progressed_positions': progressed_positions,
        'natal_positions': natal_positions,
        'prog_to_natal_aspects': prog_to_natal,
        'prog_to_prog_aspects': prog_to_prog,
        'progressed_moon': prog_moon,
        'age': _calculate_age(birth_data, target_date)
    }


def _calculate_age(birth_data: Dict, target_date: datetime) -> float:
    """Calculate age in years."""
    birth_date = datetime(
        birth_data['year'], birth_data['month'], birth_data['day']
    )
    delta = target_date - birth_date
    return round(delta.days / 365.25, 2)


def _calculate_prog_to_natal_aspects(progressed: Dict, natal: Dict) -> List[Dict]:
    """Calculate aspects from progressed planets to natal positions."""
    aspects = []

    for prog_planet, prog_pos in progressed.items():
        for natal_planet, natal_pos in natal.items():
            # Skip same planet (handled separately for some planets)
            # But include prog Sun to natal Moon, etc.

            angle = calculate_angle_difference(
                prog_pos['longitude'],
                natal_pos['longitude']
            )

            # Use standard aspect orbs
            aspect = identify_aspect(angle, orb_multiplier=0.8)  # Slightly tighter for progressions

            if aspect:
                aspects.append({
                    'progressed_planet': {
                        'name': prog_planet,
                        'longitude': prog_pos['longitude'],
                        'sign': prog_pos.get('sign', '')
                    },
                    'natal_planet': {
                        'name': natal_planet,
                        'longitude': natal_pos['longitude'],
                        'sign': natal_pos.get('sign', '')
                    },
                    'aspect': aspect['aspect'],
                    'orb': aspect['orb'],
                    'max_orb': aspect.get('max_orb', 8),
                    'type': 'prog_to_natal'
                })

    return aspects


def _calculate_prog_to_prog_aspects(progressed: Dict) -> List[Dict]:
    """Calculate aspects between progressed planets."""
    aspects = []
    planets = list(progressed.keys())

    for i, p1 in enumerate(planets):
        for p2 in planets[i+1:]:
            pos1 = progressed[p1]
            pos2 = progressed[p2]

            angle = calculate_angle_difference(
                pos1['longitude'],
                pos2['longitude']
            )

            aspect = identify_aspect(angle, orb_multiplier=0.7)  # Tighter for prog-prog

            if aspect:
                aspects.append({
                    'planet1': {
                        'name': p1,
                        'longitude': pos1['longitude'],
                        'sign': pos1.get('sign', '')
                    },
                    'planet2': {
                        'name': p2,
                        'longitude': pos2['longitude'],
                        'sign': pos2.get('sign', '')
                    },
                    'aspect': aspect['aspect'],
                    'orb': aspect['orb'],
                    'type': 'prog_to_prog'
                })

    return aspects


def _calculate_progressed_moon(progressed: Dict, natal: Dict,
                               birth_data: Dict, target_date: datetime) -> Dict:
    """
    Calculate detailed progressed Moon information.

    The Moon is the emotional heartbeat - moves ~1° per month.
    Changes sign every 2.5 years approximately.
    """
    prog_moon = progressed.get('Moon', {})
    natal_moon = natal.get('Moon', {})

    if not prog_moon:
        return {}

    prog_moon_sign = prog_moon.get('sign', '')
    prog_moon_degree = prog_moon.get('degree_in_sign', 0)

    # Calculate Moon-specific aspects with tighter orbs
    moon_aspects = []
    for natal_planet, natal_pos in natal.items():
        angle = calculate_angle_difference(
            prog_moon['longitude'],
            natal_pos['longitude']
        )

        # Use tighter Moon-specific orbs
        aspect = _identify_moon_aspect(angle)
        if aspect:
            moon_aspects.append({
                'natal_planet': natal_planet,
                'aspect': aspect['aspect'],
                'orb': aspect['orb'],
                'weight': aspect['weight'],
                'description': PROG_MOON_ASPECT_TYPES[aspect['aspect']].get(
                    'description', ''
                )
            })

    # Get sign influence
    sign_influence = PROG_MOON_SIGN_INFLUENCE.get(prog_moon_sign, {})

    # Calculate time in current sign and time to next sign
    degrees_remaining = 30 - prog_moon_degree
    months_to_sign_change = round(degrees_remaining, 1)  # ~1° per month

    # Previous sign change (approximate)
    months_in_current_sign = round(prog_moon_degree, 1)

    return {
        'sign': prog_moon_sign,
        'degree': round(prog_moon_degree, 2),
        'longitude': prog_moon['longitude'],
        'natal_sign': natal_moon.get('sign', ''),
        'sign_description': sign_influence.get('description', ''),
        'sign_facet_influence': sign_influence.get('facets', {}),
        'aspects_to_natal': moon_aspects,
        'months_in_sign': months_in_current_sign,
        'months_to_sign_change': months_to_sign_change,
        'emotional_theme': _get_moon_emotional_theme(prog_moon_sign, moon_aspects)
    }


def _identify_moon_aspect(angle: float) -> Optional[Dict]:
    """Identify aspect using Moon-specific tighter orbs."""
    for asp_name, asp_data in PROG_MOON_ASPECT_TYPES.items():
        target = asp_data['angle']
        orb = asp_data['orb']

        diff = abs(angle - target)
        if diff > 180:
            diff = 360 - diff

        if diff <= orb:
            return {
                'aspect': asp_name,
                'orb': round(diff, 2),
                'weight': asp_data['weight']
            }

    return None


def _get_moon_emotional_theme(sign: str, aspects: List[Dict]) -> str:
    """Generate a brief emotional theme description."""
    sign_themes = {
        'Aries': 'Emotional independence and initiative',
        'Taurus': 'Emotional security and groundedness',
        'Gemini': 'Emotional curiosity and communication',
        'Cancer': 'Deep nurturing and protective feelings',
        'Leo': 'Emotional expression and creativity',
        'Virgo': 'Emotional refinement and service',
        'Libra': 'Emotional harmony and partnership',
        'Scorpio': 'Emotional depth and transformation',
        'Sagittarius': 'Emotional expansion and meaning',
        'Capricorn': 'Emotional maturity and achievement',
        'Aquarius': 'Emotional independence and innovation',
        'Pisces': 'Emotional sensitivity and transcendence'
    }

    base_theme = sign_themes.get(sign, 'Emotional evolution')

    # Add aspect coloring
    challenging_count = sum(1 for a in aspects if a['aspect'] in ['Square', 'Opposition'])
    supportive_count = sum(1 for a in aspects if a['aspect'] in ['Trine', 'Sextile'])

    if challenging_count > supportive_count:
        return f"{base_theme} with growth challenges"
    elif supportive_count > challenging_count:
        return f"{base_theme} with natural flow"
    else:
        return f"{base_theme} in balance"


def progressions_to_30_facets(progression_data: Dict,
                              intensity_scale: float = 1.0) -> np.ndarray:
    """
    Convert progressions to 30-facet personality evolution vector.

    Combines three weighted sources:
    - 40% progressed-to-natal (core life themes)
    - 30% progressed-to-progressed (inner dynamics)
    - 30% Moon-specific (emotional weather)

    Args:
        progression_data: Result from calculate_progressions
        intensity_scale: Overall scaling (0.0 to 1.0)

    Returns:
        30-dimensional numpy array of facet modifiers
    """
    # Calculate each component vector
    prog_natal_vector = _prog_to_natal_to_facets(
        progression_data.get('prog_to_natal_aspects', [])
    )

    prog_prog_vector = _prog_to_prog_to_facets(
        progression_data.get('prog_to_prog_aspects', [])
    )

    moon_vector = _moon_to_facets(
        progression_data.get('progressed_moon', {})
    )

    # Weighted combination
    combined = weighted_blend(
        [prog_natal_vector, prog_prog_vector, moon_vector],
        [
            PROGRESSION_WEIGHTS['prog_to_natal'],
            PROGRESSION_WEIGHTS['prog_to_prog'],
            PROGRESSION_WEIGHTS['moon_specific']
        ]
    )

    # Apply intensity scaling
    combined *= intensity_scale

    # Progressions are gradual influences - moderate range
    return clip_vector(combined, -0.25, 0.25)


def _prog_to_natal_to_facets(aspects: List[Dict]) -> np.ndarray:
    """Convert progressed-to-natal aspects to facets."""
    vector = create_zero_vector()

    for asp in aspects:
        prog_planet = asp['progressed_planet']['name']
        natal_planet = asp['natal_planet']['name']
        aspect_type = asp['aspect']
        orb = asp.get('orb', 0)
        max_orb = asp.get('max_orb', 8)

        # Get planet meanings
        prog_meaning = PROGRESSED_PLANET_MEANINGS.get(prog_planet, {})
        aspect_impact = PROG_ASPECT_IMPACT.get(aspect_type, {})

        # Calculate weight
        orb_weight = calculate_orb_weight(orb, max_orb)
        aspect_modifier = aspect_impact.get('base_modifier', 0.5)
        combined_weight = orb_weight * aspect_modifier

        # Apply progressed planet facets
        for facet, value in prog_meaning.get('facets', {}).items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * combined_weight

        # Apply aspect-type facets
        for facet, value in aspect_impact.get('facets', {}).items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * combined_weight

    return vector


def _prog_to_prog_to_facets(aspects: List[Dict]) -> np.ndarray:
    """Convert progressed-to-progressed aspects to facets."""
    vector = create_zero_vector()

    for asp in aspects:
        p1 = asp['planet1']['name']
        p2 = asp['planet2']['name']
        aspect_type = asp['aspect']
        orb = asp.get('orb', 0)

        # Inner dynamics - use general aspect impact
        aspect_impact = PROG_ASPECT_IMPACT.get(aspect_type, {})
        orb_weight = calculate_orb_weight(orb, 6.0)  # Tighter orb assumption
        modifier = aspect_impact.get('base_modifier', 0.5)

        weight = orb_weight * modifier * 0.8  # Slightly reduced for prog-prog

        for facet, value in aspect_impact.get('facets', {}).items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * weight

    return vector


def _moon_to_facets(moon_data: Dict) -> np.ndarray:
    """Convert progressed Moon data to facets."""
    vector = create_zero_vector()

    if not moon_data:
        return vector

    # Apply sign influence
    sign_facets = moon_data.get('sign_facet_influence', {})
    for facet, value in sign_facets.items():
        if facet in FACET_SHORT_CODES:
            idx = FACET_SHORT_CODES[facet]
            vector[idx] += value

    # Apply Moon aspect influences using pre-computed vectors
    for asp in moon_data.get('aspects_to_natal', []):
        aspect_type = asp['aspect']
        weight = asp.get('weight', 0.5)
        orb_weight = calculate_orb_weight(asp.get('orb', 0), 4.0)

        if aspect_type in PROG_MOON_IMPACT_30:
            moon_vector = PROG_MOON_IMPACT_30[aspect_type]
            vector += moon_vector * weight * orb_weight * 0.3  # Scale down

    return vector


def get_progression_interpretation(progression_data: Dict,
                                   progression_vector: np.ndarray = None) -> Dict:
    """
    Generate human-readable interpretation of progressions.

    Args:
        progression_data: Result from calculate_progressions
        progression_vector: Pre-computed vector (optional)

    Returns:
        Interpretation dictionary
    """
    if progression_vector is None:
        progression_vector = progressions_to_30_facets(progression_data)

    moon = progression_data.get('progressed_moon', {})
    prog_to_natal = progression_data.get('prog_to_natal_aspects', [])
    age = progression_data.get('age', 0)

    interpretation = {
        'age': age,
        'life_phase': _get_life_phase(age),
        'moon_cycle': {},
        'major_themes': [],
        'evolution_summary': ''
    }

    # Moon cycle interpretation
    if moon:
        interpretation['moon_cycle'] = {
            'current_sign': moon.get('sign', ''),
            'emotional_theme': moon.get('emotional_theme', ''),
            'months_remaining': moon.get('months_to_sign_change', 0),
            'description': _get_moon_cycle_description(moon)
        }

    # Major themes from significant aspects
    significant = [a for a in prog_to_natal
                   if a['aspect'] in ['Conjunction', 'Opposition', 'Square']
                   and a['orb'] < 2.0]

    for asp in significant[:3]:
        prog = asp['progressed_planet']['name']
        natal = asp['natal_planet']['name']
        asp_type = asp['aspect']

        prog_meaning = PROGRESSED_PLANET_MEANINGS.get(prog, {})
        theme = {
            'aspect': f"Progressed {prog} {asp_type} natal {natal}",
            'orb': asp['orb'],
            'meaning': prog_meaning.get('description', ''),
            'life_area': _get_life_area(prog, natal, asp_type)
        }
        interpretation['major_themes'].append(theme)

    # Generate summary
    interpretation['evolution_summary'] = _generate_evolution_summary(
        interpretation, moon, prog_to_natal
    )

    return interpretation


def _get_life_phase(age: float) -> str:
    """Get general life phase description."""
    if age < 18:
        return 'Formation - identity developing'
    elif age < 29:
        return 'Emergence - establishing self'
    elif age < 30:
        return 'Saturn Return approach - major life review'
    elif age < 40:
        return 'Building - creating life structure'
    elif age < 50:
        return 'Midlife - re-evaluation and depth'
    elif age < 60:
        return 'Integration - wisdom emerging'
    else:
        return 'Mastery - sharing accumulated wisdom'


def _get_moon_cycle_description(moon: Dict) -> str:
    """Generate Moon cycle description."""
    sign = moon.get('sign', '')
    months = moon.get('months_to_sign_change', 0)
    aspects = moon.get('aspects_to_natal', [])

    if months < 3:
        timing = "nearing a shift in emotional focus"
    elif months < 12:
        timing = "in the middle of this emotional phase"
    else:
        timing = "in the early stages of this emotional cycle"

    aspect_count = len(aspects)
    if aspect_count > 3:
        activity = "highly active emotionally"
    elif aspect_count > 1:
        activity = "moderately active"
    else:
        activity = "quietly processing"

    return f"Progressed Moon in {sign}: {timing}, {activity}"


def _get_life_area(prog_planet: str, natal_planet: str, aspect: str) -> str:
    """Get life area affected by this aspect."""
    areas = {
        'Sun': 'identity and life direction',
        'Moon': 'emotional needs and inner life',
        'Mercury': 'communication and thinking',
        'Venus': 'relationships and values',
        'Mars': 'action and assertion',
        'Jupiter': 'growth and meaning',
        'Saturn': 'responsibility and structure'
    }

    prog_area = areas.get(prog_planet, 'personal evolution')
    natal_area = areas.get(natal_planet, 'core patterns')

    if aspect == 'Conjunction':
        return f"Activation of {natal_area} through evolving {prog_area}"
    elif aspect == 'Opposition':
        return f"Tension between {prog_area} and {natal_area}"
    elif aspect == 'Square':
        return f"Growth challenge in {prog_area} affecting {natal_area}"
    else:
        return f"Connection between {prog_area} and {natal_area}"


def _generate_evolution_summary(interpretation: Dict, moon: Dict,
                                aspects: List[Dict]) -> str:
    """Generate overall evolution summary."""
    parts = []

    # Life phase
    phase = interpretation.get('life_phase', '')
    if phase:
        parts.append(f"Currently in a phase of {phase.lower()}")

    # Moon influence
    if moon:
        sign = moon.get('sign', '')
        theme = moon.get('emotional_theme', '')
        if sign and theme:
            parts.append(f"with {theme.lower()} as the emotional background")

    # Major aspect themes
    themes = interpretation.get('major_themes', [])
    if themes:
        first_theme = themes[0]
        parts.append(f"Key focus: {first_theme['life_area'].lower()}")

    return '. '.join(parts) + '.' if parts else 'Personality evolving naturally.'


def calculate_progression_intensity(progression_data: Dict) -> Dict[str, float]:
    """
    Calculate overall progression intensity by domain.

    Args:
        progression_data: Result from calculate_progressions

    Returns:
        Dict with intensity scores by domain
    """
    intensities = {'N': 0, 'E': 0, 'O': 0, 'A': 0, 'C': 0}

    # Count and weight aspects
    all_aspects = (
        progression_data.get('prog_to_natal_aspects', []) +
        progression_data.get('prog_to_prog_aspects', [])
    )

    for asp in all_aspects:
        aspect_type = asp['aspect']
        orb = asp.get('orb', 0)
        max_orb = asp.get('max_orb', 8)

        impact = PROG_ASPECT_IMPACT.get(aspect_type, {})
        base_mod = impact.get('base_modifier', 0.5)
        orb_weight = calculate_orb_weight(orb, max_orb)

        weight = base_mod * orb_weight

        # Distribute to domains based on aspect type
        if aspect_type in ['Square', 'Opposition']:
            intensities['N'] += weight * 0.4
            intensities['C'] += weight * 0.3
        elif aspect_type in ['Trine', 'Sextile']:
            intensities['E'] += weight * 0.3
            intensities['O'] += weight * 0.3
        elif aspect_type == 'Conjunction':
            intensities['O'] += weight * 0.25
            intensities['E'] += weight * 0.25
            intensities['C'] += weight * 0.25

    # Add Moon sign influence
    moon = progression_data.get('progressed_moon', {})
    moon_facets = moon.get('sign_facet_influence', {})
    for facet, value in moon_facets.items():
        domain = facet[0]  # First letter is domain
        if domain in intensities:
            intensities[domain] += abs(value) * 0.5

    return {k: round(v, 3) for k, v in intensities.items()}
