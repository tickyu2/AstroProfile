"""
P4 Natal Aspect Engine
Birth chart planetary aspects → 30-facet personality modifiers

Maps natal aspects between planets to NEO PI-R facet adjustments.
Includes aspect pattern detection (Grand Trine, T-Square, Yod, etc.)
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Set
from datetime import datetime

from ..core.constants import (
    DIMENSIONS_30, FACET_SHORT_CODES, DOMAIN_RANGES,
    CRITICAL_PAIRS, PLANETS, PLANET_NAMES
)
from ..core.vector_utils import (
    create_zero_vector, clip_vector, apply_domain_modifiers,
    apply_facet_modifiers, calculate_orb_weight
)
from ..core.swiss_ephemeris import (
    datetime_to_jd, get_all_planet_positions, calculate_aspects,
    birth_data_to_jd
)


# ============================================
# ASPECT TYPE MODIFIERS
# ============================================
# How each aspect type affects the 30-facet personality vector

ASPECT_TYPE_MODIFIERS = {
    'Conjunction': {
        'quality': 'fusion',
        'intensity': 1.0,
        'description': 'Planets merge energies - amplified expression',
        # Domain effects depend on planets involved
        'base_mods': {}  # Neutral base - planet energies determine direction
    },
    'Opposition': {
        'quality': 'challenging',
        'intensity': 0.9,
        'description': 'Polarity - inner vs outer conflict',
        'base_mods': {
            'N_mod': 0.12,        # Inner tension
            'E_mod': 0.05         # Projection onto others
        }
    },
    'Trine': {
        'quality': 'harmonious',
        'intensity': 0.85,
        'description': 'Natural talent, ease of expression',
        'base_mods': {
            'N_mod': -0.08,       # Ease, less anxiety
            'E_mod': 0.10,        # Natural flow
            'O_mod': 0.05         # Creative expansion
        }
    },
    'Square': {
        'quality': 'challenging',
        'intensity': 0.95,
        'description': 'Growth through friction',
        'base_mods': {
            'N_mod': 0.15,        # Friction, tension
            'C_mod': 0.08         # Drive to overcome
        }
    },
    'Sextile': {
        'quality': 'harmonious',
        'intensity': 0.7,
        'description': 'Opportunities requiring effort',
        'base_mods': {
            'O_mod': 0.08,        # Opportunities for growth
            'A_mod': 0.05         # Cooperation
        }
    },
    'Quincunx': {
        'quality': 'adjustment',
        'intensity': 0.6,
        'description': 'Blind spot requiring adjustment',
        'base_mods': {
            'N_mod': 0.10,        # Discomfort
            'O_mod': 0.08         # Need for adaptation
        }
    },
    'SemiSextile': {
        'quality': 'minor',
        'intensity': 0.4,
        'description': 'Subtle irritation or minor opportunity',
        'base_mods': {
            'N_mod': 0.03,
            'O_mod': 0.03
        }
    }
}


# ============================================
# PLANET PERSONALITY MEANINGS
# ============================================
# Each planet's psychological principle and facet associations

PLANET_MEANINGS = {
    'Sun': {
        'principle': 'Identity, ego, vitality, conscious self',
        'facets': {
            'E3': 0.15,      # Assertiveness - core identity expression
            'E6': 0.10,      # Positive Emotions - vitality
            'C1': 0.08,      # Competence - ego strength
            'C4': 0.08       # Achievement Striving - life purpose
        }
    },
    'Moon': {
        'principle': 'Emotions, instincts, nurturing, unconscious',
        'facets': {
            'O3': 0.15,      # Feelings - emotional depth
            'N6': 0.10,      # Vulnerability - emotional sensitivity
            'A6': 0.12,      # Tender-Mindedness - nurturing
            'E1': 0.08       # Warmth - emotional connection
        }
    },
    'Mercury': {
        'principle': 'Communication, intellect, analysis, learning',
        'facets': {
            'O5': 0.15,      # Ideas - intellectual curiosity
            'E2': 0.08,      # Gregariousness - social communication
            'C6': 0.10,      # Deliberation - analytical thinking
            'O4': 0.05       # Actions - mental agility
        }
    },
    'Venus': {
        'principle': 'Love, beauty, values, harmony, attraction',
        'facets': {
            'A1': 0.10,      # Trust - relationship openness
            'O2': 0.15,      # Aesthetics - beauty appreciation
            'E1': 0.12,      # Warmth - affection
            'A3': 0.08       # Altruism - giving in relationships
        }
    },
    'Mars': {
        'principle': 'Drive, action, aggression, courage, desire',
        'facets': {
            'E3': 0.15,      # Assertiveness - action drive
            'N2': 0.10,      # Angry Hostility - aggression
            'E4': 0.12,      # Activity - physical energy
            'E5': 0.08       # Excitement Seeking - risk taking
        }
    },
    'Jupiter': {
        'principle': 'Expansion, optimism, wisdom, abundance',
        'facets': {
            'O4': 0.12,      # Actions - willingness to explore
            'E6': 0.12,      # Positive Emotions - optimism
            'O6': 0.10,      # Values - philosophical breadth
            'A1': 0.08       # Trust - faith in life
        }
    },
    'Saturn': {
        'principle': 'Structure, discipline, limitation, responsibility',
        'facets': {
            'C5': 0.15,      # Self-Discipline - restraint
            'C2': 0.12,      # Order - structure
            'N1': 0.08,      # Anxiety - fear of failure
            'C3': 0.10       # Dutifulness - responsibility
        }
    },
    'Uranus': {
        'principle': 'Innovation, rebellion, sudden change, individuality',
        'facets': {
            'O5': 0.15,      # Ideas - unconventional thinking
            'O4': 0.10,      # Actions - unpredictability
            'A4': -0.12,     # Compliance - rebellion (negative)
            'E5': 0.10       # Excitement Seeking - novelty
        }
    },
    'Neptune': {
        'principle': 'Dreams, intuition, spirituality, illusion',
        'facets': {
            'O1': 0.18,      # Fantasy - imagination
            'O3': 0.12,      # Feelings - sensitivity
            'C5': -0.08,     # Self-Discipline - dissolution (negative)
            'O6': 0.08       # Values - spiritual ideals
        }
    },
    'Pluto': {
        'principle': 'Transformation, power, depth, rebirth',
        'facets': {
            'N3': 0.08,      # Depression - depth/intensity
            'O3': 0.12,      # Feelings - emotional intensity
            'C4': 0.10,      # Achievement Striving - will to power
            'N6': 0.08       # Vulnerability - fear of powerlessness
        }
    }
}


# ============================================
# PLANET PAIR ASPECT MODIFIERS
# ============================================
# Specific meanings for key planet combinations
# These override/modify base aspect effects

PLANET_PAIR_ASPECTS = {
    # TIER 1: Core Identity/Emotional
    'Sun-Moon': {
        'Conjunction': {
            'mods': {'E_mod': 0.12, 'N_mod': -0.10},
            'facets': {'E1': 0.10, 'N4': -0.08},
            'description': 'Integrated personality, emotional-ego harmony'
        },
        'Opposition': {
            'mods': {'N_mod': 0.15, 'E_mod': 0.08},
            'facets': {'N4': 0.12, 'O3': 0.08},
            'description': 'Inner vs outer self tension'
        },
        'Square': {
            'mods': {'N_mod': 0.18, 'C_mod': 0.10},
            'facets': {'N1': 0.12, 'N4': 0.10},
            'description': 'Emotional vs ego friction'
        },
        'Trine': {
            'mods': {'E_mod': 0.10, 'N_mod': -0.08},
            'facets': {'E6': 0.10, 'A1': 0.08},
            'description': 'Easy emotional expression'
        }
    },
    'Sun-Saturn': {
        'Conjunction': {
            'mods': {'C_mod': 0.15, 'N_mod': 0.10},
            'facets': {'C5': 0.12, 'C3': 0.10, 'N1': 0.08},
            'description': 'Disciplined identity, serious nature'
        },
        'Opposition': {
            'mods': {'N_mod': 0.18, 'C_mod': 0.08},
            'facets': {'N1': 0.15, 'C4': 0.10},
            'description': 'Authority conflicts, self-doubt'
        },
        'Square': {
            'mods': {'N_mod': 0.20, 'C_mod': 0.12},
            'facets': {'N1': 0.18, 'N4': 0.12, 'C4': 0.10},
            'description': 'Harsh self-criticism, drive to prove'
        },
        'Trine': {
            'mods': {'C_mod': 0.12, 'N_mod': -0.05},
            'facets': {'C1': 0.12, 'C5': 0.10},
            'description': 'Natural authority, grounded confidence'
        }
    },
    'Moon-Saturn': {
        'Conjunction': {
            'mods': {'N_mod': 0.15, 'C_mod': 0.10},
            'facets': {'N3': 0.12, 'C5': 0.10, 'A6': -0.08},
            'description': 'Emotional restraint, controlled feelings'
        },
        'Opposition': {
            'mods': {'N_mod': 0.18, 'A_mod': -0.08},
            'facets': {'N3': 0.15, 'N6': 0.12},
            'description': 'Emotional isolation, coldness'
        },
        'Square': {
            'mods': {'N_mod': 0.22, 'E_mod': -0.08},
            'facets': {'N3': 0.18, 'N1': 0.12, 'E1': -0.10},
            'description': 'Emotional depression, difficulty nurturing'
        },
        'Trine': {
            'mods': {'C_mod': 0.10, 'N_mod': -0.05},
            'facets': {'C6': 0.10, 'N1': -0.05},
            'description': 'Emotional maturity, patient feelings'
        }
    },
    'Moon-Pluto': {
        'Conjunction': {
            'mods': {'N_mod': 0.18, 'O_mod': 0.12},
            'facets': {'O3': 0.15, 'N6': 0.12, 'N3': 0.08},
            'description': 'Intense emotions, emotional power'
        },
        'Opposition': {
            'mods': {'N_mod': 0.20, 'A_mod': -0.10},
            'facets': {'N6': 0.15, 'N2': 0.10, 'A1': -0.12},
            'description': 'Power struggles in emotions, manipulation'
        },
        'Square': {
            'mods': {'N_mod': 0.22, 'C_mod': 0.08},
            'facets': {'N6': 0.18, 'N2': 0.12, 'O3': 0.10},
            'description': 'Emotional crises, transformation through pain'
        },
        'Trine': {
            'mods': {'O_mod': 0.12, 'N_mod': 0.05},
            'facets': {'O3': 0.12, 'C4': 0.08},
            'description': 'Emotional depth, regenerative capacity'
        }
    },

    # TIER 2: Relationship/Drive
    'Venus-Mars': {
        'Conjunction': {
            'mods': {'E_mod': 0.15, 'A_mod': 0.08},
            'facets': {'E1': 0.12, 'E5': 0.10, 'O3': 0.08},
            'description': 'Passionate, magnetic, integrated desire'
        },
        'Opposition': {
            'mods': {'N_mod': 0.12, 'E_mod': 0.10},
            'facets': {'E5': 0.12, 'N5': 0.08},
            'description': 'Attraction/repulsion dynamics'
        },
        'Square': {
            'mods': {'N_mod': 0.15, 'E_mod': 0.08},
            'facets': {'N5': 0.12, 'E5': 0.10, 'A4': -0.08},
            'description': 'Push-pull in relationships, frustration'
        },
        'Trine': {
            'mods': {'E_mod': 0.12, 'A_mod': 0.08},
            'facets': {'E1': 0.10, 'E6': 0.08, 'A1': 0.08},
            'description': 'Easy romantic expression'
        }
    },
    'Sun-Mars': {
        'Conjunction': {
            'mods': {'E_mod': 0.18, 'N_mod': 0.05},
            'facets': {'E3': 0.15, 'E4': 0.12, 'N2': 0.08},
            'description': 'Strong will, assertive, energetic'
        },
        'Opposition': {
            'mods': {'N_mod': 0.15, 'E_mod': 0.10},
            'facets': {'N2': 0.12, 'E3': 0.10},
            'description': 'Projected aggression, competitiveness'
        },
        'Square': {
            'mods': {'N_mod': 0.18, 'E_mod': 0.08},
            'facets': {'N2': 0.15, 'N5': 0.10, 'E4': 0.08},
            'description': 'Frustrated energy, anger issues'
        },
        'Trine': {
            'mods': {'E_mod': 0.15, 'C_mod': 0.08},
            'facets': {'E3': 0.12, 'E4': 0.10, 'C4': 0.08},
            'description': 'Confident action, natural leadership'
        }
    },
    'Mars-Saturn': {
        'Conjunction': {
            'mods': {'C_mod': 0.15, 'N_mod': 0.12},
            'facets': {'C5': 0.12, 'N2': 0.10, 'C4': 0.08},
            'description': 'Disciplined energy, controlled aggression'
        },
        'Opposition': {
            'mods': {'N_mod': 0.18, 'E_mod': -0.08},
            'facets': {'N2': 0.15, 'N1': 0.10, 'E4': -0.10},
            'description': 'Blocked energy, frustration'
        },
        'Square': {
            'mods': {'N_mod': 0.22, 'C_mod': 0.10},
            'facets': {'N2': 0.18, 'N1': 0.12, 'N5': 0.08},
            'description': 'Severe frustration, endurance through hardship'
        },
        'Trine': {
            'mods': {'C_mod': 0.12, 'E_mod': 0.05},
            'facets': {'C5': 0.10, 'C4': 0.10, 'E4': 0.05},
            'description': 'Sustained effort, strategic action'
        }
    }
}


# ============================================
# ASPECT PATTERNS
# ============================================
# Major configurations with personality implications

ASPECT_PATTERNS = {
    'GrandTrine': {
        'structure': '3 planets forming 3 trines (each ~120° apart)',
        'required_aspects': ['Trine', 'Trine', 'Trine'],
        'required_planets': 3,
        'element': 'same',  # All in same element (Fire/Earth/Air/Water)
        'modifiers': {
            'O_mod': 0.15,        # Natural talent flow
            'C_mod': -0.08,       # Complacency risk
            'N_mod': -0.10        # Ease, less friction
        },
        'facets': {
            'E6': 0.12,           # Positive Emotions
            'O4': 0.10,           # Actions (ease)
            'C4': -0.08           # Achievement Striving (may coast)
        },
        'description': 'Natural talent, potential complacency'
    },
    'TSquare': {
        'structure': '2 planets in opposition, both square a 3rd (apex)',
        'required_aspects': ['Opposition', 'Square', 'Square'],
        'required_planets': 3,
        'modifiers': {
            'N_mod': 0.18,        # Constant tension
            'C_mod': 0.15,        # Drive to resolve
            'E_mod': 0.08         # Energy for action
        },
        'facets': {
            'N1': 0.12,           # Anxiety (tension)
            'C4': 0.15,           # Achievement Striving
            'E4': 0.10            # Activity
        },
        'description': 'Dynamic tension, strong drive'
    },
    'GrandCross': {
        'structure': '4 planets forming 2 oppositions and 4 squares',
        'required_aspects': ['Opposition', 'Opposition', 'Square', 'Square', 'Square', 'Square'],
        'required_planets': 4,
        'modifiers': {
            'N_mod': 0.22,        # Maximum tension
            'C_mod': 0.18,        # Tremendous drive
            'A_mod': -0.10        # Difficulty compromising
        },
        'facets': {
            'N1': 0.18,           # Anxiety
            'C4': 0.18,           # Achievement
            'A4': -0.12,          # Compliance (stubbornness)
            'E4': 0.12            # Activity
        },
        'description': 'Maximum challenge, maximum potential'
    },
    'Kite': {
        'structure': 'Grand Trine with 4th planet opposite apex, sextile other 2',
        'required_aspects': ['Trine', 'Trine', 'Trine', 'Opposition', 'Sextile', 'Sextile'],
        'required_planets': 4,
        'modifiers': {
            'O_mod': 0.15,        # Talent with focus
            'C_mod': 0.10,        # Directed energy
            'E_mod': 0.08         # Expression outlet
        },
        'facets': {
            'C4': 0.12,           # Achievement (focused)
            'E6': 0.10,           # Positive Emotions
            'O4': 0.10            # Actions
        },
        'description': 'Talent with outlet for expression'
    },
    'Yod': {
        'structure': '2 planets sextile each other, both quincunx a 3rd (apex)',
        'required_aspects': ['Sextile', 'Quincunx', 'Quincunx'],
        'required_planets': 3,
        'modifiers': {
            'O_mod': 0.18,        # Fated feeling, unique path
            'N_mod': 0.12,        # Adjustment pressure
            'C_mod': 0.08         # Sense of mission
        },
        'facets': {
            'O6': 0.15,           # Values (special purpose)
            'N4': 0.10,           # Self-Consciousness
            'C3': 0.10            # Dutifulness (mission)
        },
        'description': 'Finger of God - fated mission'
    }
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def calculate_natal_aspects(birth_year: int, birth_month: int, birth_day: int,
                            birth_hour: int = 12, birth_minute: int = 0,
                            timezone_offset: float = 0.0,
                            pairs: List[Tuple[str, str]] = None) -> List[Dict]:
    """
    Calculate natal aspects from birth data.

    Args:
        birth_year, birth_month, birth_day: Birth date
        birth_hour, birth_minute: Birth time (local)
        timezone_offset: Hours from UTC
        pairs: Specific planet pairs to check (defaults to all)

    Returns:
        List of aspect dictionaries
    """
    jd = birth_data_to_jd(birth_year, birth_month, birth_day,
                          birth_hour, birth_minute, timezone_offset)

    positions = get_all_planet_positions(jd)
    aspects = calculate_aspects(positions, pairs)

    return aspects


def detect_aspect_patterns(aspects: List[Dict]) -> List[Dict]:
    """
    Detect major aspect patterns (Grand Trine, T-Square, etc.).

    Args:
        aspects: List of aspect dictionaries from calculate_aspects

    Returns:
        List of detected pattern dictionaries
    """
    patterns = []

    # Build adjacency for pattern detection
    aspect_map = {}  # (planet1, planet2) -> aspect_type
    planet_aspects = {}  # planet -> [(other_planet, aspect_type)]

    for asp in aspects:
        p1 = asp['planet1']['name']
        p2 = asp['planet2']['name']
        asp_type = asp['aspect']

        key = tuple(sorted([p1, p2]))
        aspect_map[key] = asp_type

        if p1 not in planet_aspects:
            planet_aspects[p1] = []
        if p2 not in planet_aspects:
            planet_aspects[p2] = []

        planet_aspects[p1].append((p2, asp_type))
        planet_aspects[p2].append((p1, asp_type))

    # Detect Grand Trine
    trines = [a for a in aspects if a['aspect'] == 'Trine']
    if len(trines) >= 3:
        grand_trines = _find_grand_trines(trines, aspect_map)
        patterns.extend(grand_trines)

    # Detect T-Square
    oppositions = [a for a in aspects if a['aspect'] == 'Opposition']
    squares = [a for a in aspects if a['aspect'] == 'Square']
    if len(oppositions) >= 1 and len(squares) >= 2:
        t_squares = _find_t_squares(oppositions, squares, aspect_map)
        patterns.extend(t_squares)

    # Detect Yod
    sextiles = [a for a in aspects if a['aspect'] == 'Sextile']
    quincunxes = [a for a in aspects if a['aspect'] == 'Quincunx']
    if len(sextiles) >= 1 and len(quincunxes) >= 2:
        yods = _find_yods(sextiles, quincunxes, aspect_map)
        patterns.extend(yods)

    # Detect Grand Cross (extension of T-Square)
    if len(oppositions) >= 2 and len(squares) >= 4:
        grand_crosses = _find_grand_crosses(oppositions, squares, aspect_map)
        patterns.extend(grand_crosses)

    return patterns


def _find_grand_trines(trines: List[Dict], aspect_map: Dict) -> List[Dict]:
    """Find Grand Trine patterns."""
    grand_trines = []
    trine_planets = set()

    for t in trines:
        trine_planets.add(t['planet1']['name'])
        trine_planets.add(t['planet2']['name'])

    # Need at least 3 planets
    if len(trine_planets) < 3:
        return []

    planet_list = list(trine_planets)
    # Check all combinations of 3
    from itertools import combinations
    for combo in combinations(planet_list, 3):
        p1, p2, p3 = combo
        # Check if all three pairs are trines
        pair1 = tuple(sorted([p1, p2]))
        pair2 = tuple(sorted([p2, p3]))
        pair3 = tuple(sorted([p1, p3]))

        if (aspect_map.get(pair1) == 'Trine' and
            aspect_map.get(pair2) == 'Trine' and
            aspect_map.get(pair3) == 'Trine'):

            grand_trines.append({
                'pattern': 'GrandTrine',
                'planets': list(combo),
                **ASPECT_PATTERNS['GrandTrine']
            })

    return grand_trines


def _find_t_squares(oppositions: List[Dict], squares: List[Dict],
                    aspect_map: Dict) -> List[Dict]:
    """Find T-Square patterns."""
    t_squares = []

    for opp in oppositions:
        p1 = opp['planet1']['name']
        p2 = opp['planet2']['name']

        # Find planet that squares both
        for sq in squares:
            sq_p1 = sq['planet1']['name']
            sq_p2 = sq['planet2']['name']

            apex = None
            if sq_p1 in [p1, p2]:
                apex = sq_p2
            elif sq_p2 in [p1, p2]:
                apex = sq_p1

            if apex and apex not in [p1, p2]:
                # Check if apex squares BOTH opposition planets
                key1 = tuple(sorted([apex, p1]))
                key2 = tuple(sorted([apex, p2]))

                if (aspect_map.get(key1) == 'Square' and
                    aspect_map.get(key2) == 'Square'):

                    t_squares.append({
                        'pattern': 'TSquare',
                        'planets': [p1, p2, apex],
                        'apex': apex,
                        **ASPECT_PATTERNS['TSquare']
                    })

    return t_squares


def _find_yods(sextiles: List[Dict], quincunxes: List[Dict],
               aspect_map: Dict) -> List[Dict]:
    """Find Yod (Finger of God) patterns."""
    yods = []

    for sex in sextiles:
        base1 = sex['planet1']['name']
        base2 = sex['planet2']['name']

        # Find planet that quincunxes both
        for qui in quincunxes:
            q_p1 = qui['planet1']['name']
            q_p2 = qui['planet2']['name']

            apex = None
            if q_p1 in [base1, base2]:
                apex = q_p2
            elif q_p2 in [base1, base2]:
                apex = q_p1

            if apex and apex not in [base1, base2]:
                # Check if apex quincunxes BOTH base planets
                key1 = tuple(sorted([apex, base1]))
                key2 = tuple(sorted([apex, base2]))

                if (aspect_map.get(key1) == 'Quincunx' and
                    aspect_map.get(key2) == 'Quincunx'):

                    yods.append({
                        'pattern': 'Yod',
                        'planets': [base1, base2, apex],
                        'apex': apex,
                        **ASPECT_PATTERNS['Yod']
                    })

    return yods


def _find_grand_crosses(oppositions: List[Dict], squares: List[Dict],
                        aspect_map: Dict) -> List[Dict]:
    """Find Grand Cross patterns."""
    grand_crosses = []

    if len(oppositions) < 2:
        return []

    # Get all planets in oppositions
    opp_planets = set()
    for opp in oppositions:
        opp_planets.add(opp['planet1']['name'])
        opp_planets.add(opp['planet2']['name'])

    if len(opp_planets) < 4:
        return []

    from itertools import combinations
    for combo in combinations(opp_planets, 4):
        p1, p2, p3, p4 = combo

        # Check for 2 oppositions and 4 squares
        pairs = [
            (p1, p2), (p1, p3), (p1, p4),
            (p2, p3), (p2, p4), (p3, p4)
        ]

        opp_count = 0
        sq_count = 0
        for pair in pairs:
            key = tuple(sorted(pair))
            asp = aspect_map.get(key)
            if asp == 'Opposition':
                opp_count += 1
            elif asp == 'Square':
                sq_count += 1

        if opp_count == 2 and sq_count == 4:
            grand_crosses.append({
                'pattern': 'GrandCross',
                'planets': list(combo),
                **ASPECT_PATTERNS['GrandCross']
            })

    return grand_crosses


def aspects_to_30_facets(aspects: List[Dict],
                         include_patterns: bool = True) -> np.ndarray:
    """
    Convert natal aspects to 30-facet personality modifier vector.

    Args:
        aspects: List of aspect dictionaries
        include_patterns: Whether to detect and include pattern effects

    Returns:
        30-dimensional numpy array of facet modifiers
    """
    vector = create_zero_vector()

    # Process each individual aspect
    for aspect in aspects:
        aspect_type = aspect['aspect']
        p1_name = aspect['planet1']['name']
        p2_name = aspect['planet2']['name']
        orb = aspect.get('orb', 0)
        max_orb = aspect.get('max_orb', 8)

        # Calculate orb-based weight
        orb_weight = calculate_orb_weight(orb, max_orb)
        if orb_weight == 0:
            continue

        # Get base aspect type modifiers
        type_mods = ASPECT_TYPE_MODIFIERS.get(aspect_type, {})
        base_mods = type_mods.get('base_mods', {})
        intensity = type_mods.get('intensity', 1.0)

        # Get planet-pair specific modifiers
        pair_key = '-'.join(sorted([p1_name, p2_name]))
        pair_data = PLANET_PAIR_ASPECTS.get(pair_key, {}).get(aspect_type, {})

        # Combine modifiers
        combined_mods = {**base_mods}
        if 'mods' in pair_data:
            for k, v in pair_data['mods'].items():
                combined_mods[k] = combined_mods.get(k, 0) + v

        # Apply domain modifiers
        scaled_mods = {k: v * orb_weight * intensity for k, v in combined_mods.items()}
        vector = apply_domain_modifiers(vector, scaled_mods)

        # Apply facet-specific modifiers from planet meanings
        planet1_facets = PLANET_MEANINGS.get(p1_name, {}).get('facets', {})
        planet2_facets = PLANET_MEANINGS.get(p2_name, {}).get('facets', {})

        # Blend planet influences based on aspect quality
        quality = type_mods.get('quality', 'neutral')
        if quality == 'harmonious':
            # Enhance positive facets
            for facet, value in planet1_facets.items():
                if value > 0:
                    vector = apply_facet_modifiers(vector, {facet: value * orb_weight * 0.5})
            for facet, value in planet2_facets.items():
                if value > 0:
                    vector = apply_facet_modifiers(vector, {facet: value * orb_weight * 0.5})
        elif quality == 'challenging':
            # Tension increases N facets, but also C drive
            pass  # Already handled by base_mods
        elif quality == 'fusion':
            # Conjunction - both planets amplified
            for facet, value in planet1_facets.items():
                vector = apply_facet_modifiers(vector, {facet: value * orb_weight * 0.7})
            for facet, value in planet2_facets.items():
                vector = apply_facet_modifiers(vector, {facet: value * orb_weight * 0.7})

        # Apply pair-specific facet modifiers
        if 'facets' in pair_data:
            pair_facets = {k: v * orb_weight for k, v in pair_data['facets'].items()}
            vector = apply_facet_modifiers(vector, pair_facets)

    # Detect and apply aspect patterns
    if include_patterns:
        patterns = detect_aspect_patterns(aspects)
        for pattern in patterns:
            # Apply pattern domain modifiers
            if 'modifiers' in pattern:
                vector = apply_domain_modifiers(vector, pattern['modifiers'])
            # Apply pattern facet modifiers
            if 'facets' in pattern:
                vector = apply_facet_modifiers(vector, pattern['facets'])

    # Scale to reasonable range (aspects are modifiers, not absolute values)
    # Typical range: -0.3 to +0.3 for each facet
    vector = np.clip(vector, -0.5, 0.5)

    return vector


def get_aspect_summary(aspects: List[Dict]) -> Dict:
    """
    Generate summary statistics for natal aspects.

    Args:
        aspects: List of aspect dictionaries

    Returns:
        Summary dictionary with counts and notable features
    """
    summary = {
        'total_aspects': len(aspects),
        'by_type': {},
        'by_quality': {'harmonious': 0, 'challenging': 0, 'neutral': 0},
        'critical_pairs': [],
        'patterns': []
    }

    for asp in aspects:
        asp_type = asp['aspect']
        summary['by_type'][asp_type] = summary['by_type'].get(asp_type, 0) + 1

        quality = ASPECT_TYPE_MODIFIERS.get(asp_type, {}).get('quality', 'neutral')
        if quality in ['harmonious']:
            summary['by_quality']['harmonious'] += 1
        elif quality in ['challenging']:
            summary['by_quality']['challenging'] += 1
        else:
            summary['by_quality']['neutral'] += 1

        # Check if this is a critical pair
        p1 = asp['planet1']['name']
        p2 = asp['planet2']['name']
        pair = tuple(sorted([p1, p2]))
        if pair in [(p[0], p[1]) if p[0] < p[1] else (p[1], p[0]) for p in CRITICAL_PAIRS]:
            summary['critical_pairs'].append({
                'planets': [p1, p2],
                'aspect': asp_type,
                'orb': asp.get('orb', 0)
            })

    # Detect patterns
    summary['patterns'] = detect_aspect_patterns(aspects)

    return summary
