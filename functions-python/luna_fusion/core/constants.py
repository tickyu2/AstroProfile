"""
Luna Fusion Core Constants
30 NEO PI-R Facets, Source Weights, Aspect Types, Planet Definitions

Brain 7A → Brain 7B Architecture Foundation
"""

import numpy as np
from typing import Dict, List, Tuple

# ============================================
# 30 NEO PI-R FACETS (DIMENSIONS_30)
# ============================================
# Standard ordering: N1-N6, E1-E6, O1-O6, A1-A6, C1-C6

FACET_NAMES = [
    # Neuroticism (N) - indices 0-5
    'N1_Anxiety', 'N2_AngryHostility', 'N3_Depression',
    'N4_SelfConsciousness', 'N5_Impulsiveness', 'N6_Vulnerability',
    # Extraversion (E) - indices 6-11
    'E1_Warmth', 'E2_Gregariousness', 'E3_Assertiveness',
    'E4_Activity', 'E5_ExcitementSeeking', 'E6_PositiveEmotions',
    # Openness (O) - indices 12-17
    'O1_Fantasy', 'O2_Aesthetics', 'O3_Feelings',
    'O4_Actions', 'O5_Ideas', 'O6_Values',
    # Agreeableness (A) - indices 18-23
    'A1_Trust', 'A2_Straightforwardness', 'A3_Altruism',
    'A4_Compliance', 'A5_Modesty', 'A6_TenderMindedness',
    # Conscientiousness (C) - indices 24-29
    'C1_Competence', 'C2_Order', 'C3_Dutifulness',
    'C4_AchievementStriving', 'C5_SelfDiscipline', 'C6_Deliberation'
]

# Dimension count
DIMENSIONS_30 = 30

# Facet to index mapping for quick lookups
FACET_INDEX_MAP = {name: idx for idx, name in enumerate(FACET_NAMES)}

# Short facet codes (without domain prefix)
FACET_SHORT_CODES = {
    'N1': 0, 'N2': 1, 'N3': 2, 'N4': 3, 'N5': 4, 'N6': 5,
    'E1': 6, 'E2': 7, 'E3': 8, 'E4': 9, 'E5': 10, 'E6': 11,
    'O1': 12, 'O2': 13, 'O3': 14, 'O4': 15, 'O5': 16, 'O6': 17,
    'A1': 18, 'A2': 19, 'A3': 20, 'A4': 21, 'A5': 22, 'A6': 23,
    'C1': 24, 'C2': 25, 'C3': 26, 'C4': 27, 'C5': 28, 'C6': 29
}

# Domain ranges
DOMAIN_RANGES = {
    'N': (0, 6),   # Neuroticism
    'E': (6, 12),  # Extraversion
    'O': (12, 18), # Openness
    'A': (18, 24), # Agreeableness
    'C': (24, 30)  # Conscientiousness
}

# ============================================
# SOURCE WEIGHTS (Modular - Dynamic Recalculation)
# ============================================
# Base weights when ALL sources available

BASE_WEIGHTS = {
    'big5': 0.22,        # Most direct NEO PI-R mapping
    'bazi': 0.28,        # Rich elemental system
    'enneagram': 0.16,   # Deep motivational insights
    'mbti': 0.08,        # Cognitive preferences
    'natal': 0.08,       # Zodiac sign placements
    'aspects': 0.12,     # P4 planetary aspects
    'numerology': 0.06   # Life path influences
}

# Auto-derived sources (always available from birth data)
AUTO_DERIVED_SOURCES = ['bazi', 'natal', 'aspects', 'numerology']

# Optional sources (require questionnaires)
OPTIONAL_SOURCES = ['big5', 'enneagram', 'mbti']

# ============================================
# ASPECT TYPES AND ORBS
# ============================================

ASPECT_TYPES = {
    'Conjunction': {'angle': 0, 'quality': 'fusion', 'symbol': '☌'},
    'Opposition': {'angle': 180, 'quality': 'challenging', 'symbol': '☍'},
    'Trine': {'angle': 120, 'quality': 'harmonious', 'symbol': '△'},
    'Square': {'angle': 90, 'quality': 'challenging', 'symbol': '□'},
    'Sextile': {'angle': 60, 'quality': 'harmonious', 'symbol': '⚹'},
    'Quincunx': {'angle': 150, 'quality': 'adjustment', 'symbol': '⚻'},
    'SemiSextile': {'angle': 30, 'quality': 'minor', 'symbol': '⚺'}
}

# Standard orbs by aspect type
ASPECT_ORBS = {
    'Conjunction': 8.0,
    'Opposition': 8.0,
    'Trine': 8.0,
    'Square': 8.0,
    'Sextile': 6.0,
    'Quincunx': 3.0,
    'SemiSextile': 2.0
}

# Luminaries (Sun/Moon) get wider orbs
LUMINARY_ORB_BONUS = 2.0

# ============================================
# PLANETS
# ============================================

PLANETS = {
    'Sun': {'id': 0, 'type': 'luminary', 'speed': 'fast'},
    'Moon': {'id': 1, 'type': 'luminary', 'speed': 'fast'},
    'Mercury': {'id': 2, 'type': 'personal', 'speed': 'fast'},
    'Venus': {'id': 3, 'type': 'personal', 'speed': 'fast'},
    'Mars': {'id': 4, 'type': 'personal', 'speed': 'medium'},
    'Jupiter': {'id': 5, 'type': 'social', 'speed': 'slow'},
    'Saturn': {'id': 6, 'type': 'social', 'speed': 'slow'},
    'Uranus': {'id': 7, 'type': 'outer', 'speed': 'very_slow'},
    'Neptune': {'id': 8, 'type': 'outer', 'speed': 'very_slow'},
    'Pluto': {'id': 9, 'type': 'outer', 'speed': 'very_slow'}
}

# Planet names list for iteration
PLANET_NAMES = list(PLANETS.keys())

# Outer planets (for transits - P5)
OUTER_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

# Personal planets
PERSONAL_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

# ============================================
# CRITICAL PLANET PAIRS (P4 Aspect Engine)
# ============================================
# Tier 1+2: 7 key pairs with psychological significance

CRITICAL_PAIRS = [
    # Tier 1: Core Identity/Emotional
    ('Sun', 'Moon'),      # Ego vs Emotions - core personality integration
    ('Sun', 'Saturn'),    # Identity vs Structure - authority relationship
    ('Moon', 'Saturn'),   # Emotions vs Discipline - emotional control
    ('Moon', 'Pluto'),    # Emotions vs Power - emotional intensity/transformation
    # Tier 2: Relationship/Drive
    ('Venus', 'Mars'),    # Love vs Desire - relationship dynamics
    ('Sun', 'Mars'),      # Identity vs Drive - action/assertion style
    ('Mars', 'Saturn'),   # Drive vs Limitation - frustration/discipline
]

# ============================================
# ACCURACY TIERS (for user messaging)
# ============================================

ACCURACY_TIERS = {
    'birth_only': {
        'confidence': 0.60,
        'message': 'For greater accuracy, complete personality questionnaires'
    },
    'plus_one': {
        'confidence': 0.75,
        'message': 'Good foundation! Add more assessments for deeper insights'
    },
    'plus_two': {
        'confidence': 0.85,
        'message': 'Strong profile! One more assessment for maximum accuracy'
    },
    'complete': {
        'confidence': 0.95,
        'message': 'Complete profile! Maximum personality accuracy achieved'
    }
}

# ============================================
# LUNA PERSONALITY PRESETS (AI Character)
# ============================================

LUNA_PRESETS = {
    'nurturing_guide': {
        'name': 'Nurturing Guide',
        'description': 'Warm, supportive, patient - like a caring mentor',
        'tone_adjustments': {
            'warmth': 0.9,
            'directness': 0.4,
            'playfulness': 0.5,
            'depth': 0.6,
            'challenge': 0.3
        },
        # Key facet modifications
        'facet_mods': {
            'E1': 0.85, 'A3': 0.90, 'A6': 0.88, 'O3': 0.75
        }
    },
    'wise_sage': {
        'name': 'Wise Sage',
        'description': 'Thoughtful, insightful, measured - like a wise teacher',
        'tone_adjustments': {
            'warmth': 0.6,
            'directness': 0.7,
            'playfulness': 0.3,
            'depth': 0.9,
            'challenge': 0.5
        },
        'facet_mods': {
            'O5': 0.90, 'C6': 0.85, 'O6': 0.82, 'C1': 0.80
        }
    },
    'playful_companion': {
        'name': 'Playful Companion',
        'description': 'Fun, curious, lighthearted - like a creative friend',
        'tone_adjustments': {
            'warmth': 0.7,
            'directness': 0.5,
            'playfulness': 0.9,
            'depth': 0.4,
            'challenge': 0.3
        },
        'facet_mods': {
            'E5': 0.88, 'E6': 0.90, 'O1': 0.85, 'O4': 0.80
        }
    },
    'direct_challenger': {
        'name': 'Direct Challenger',
        'description': 'Honest, motivating, growth-focused - like a coach',
        'tone_adjustments': {
            'warmth': 0.5,
            'directness': 0.9,
            'playfulness': 0.3,
            'depth': 0.7,
            'challenge': 0.8
        },
        'facet_mods': {
            'E3': 0.90, 'C4': 0.85, 'A2': 0.82, 'C5': 0.80
        }
    },
    'empathic_listener': {
        'name': 'Empathic Listener',
        'description': 'Understanding, validating, present - like a therapist',
        'tone_adjustments': {
            'warmth': 0.85,
            'directness': 0.3,
            'playfulness': 0.4,
            'depth': 0.8,
            'challenge': 0.2
        },
        'facet_mods': {
            'O3': 0.90, 'A6': 0.88, 'A1': 0.85, 'E1': 0.82
        }
    }
}


def get_active_weights(available_sources: List[str]) -> Dict[str, float]:
    """
    Calculate dynamically recalculated weights based on available sources.

    Modular architecture: works with whatever data is provided.

    Args:
        available_sources: List of source names that have data

    Returns:
        Dictionary of normalized weights summing to 1.0
    """
    active = {}
    total_weight = 0.0

    for source in available_sources:
        if source in BASE_WEIGHTS:
            active[source] = BASE_WEIGHTS[source]
            total_weight += BASE_WEIGHTS[source]

    # Normalize to sum to 1.0
    if total_weight > 0:
        for source in active:
            active[source] = active[source] / total_weight

    return active


def get_accuracy_tier(available_sources: List[str]) -> dict:
    """
    Determine accuracy tier based on which optional sources are complete.

    Args:
        available_sources: List of available source names

    Returns:
        Accuracy tier info with confidence and message
    """
    optional_count = sum(1 for s in OPTIONAL_SOURCES if s in available_sources)

    if optional_count == 0:
        return ACCURACY_TIERS['birth_only']
    elif optional_count == 1:
        return ACCURACY_TIERS['plus_one']
    elif optional_count == 2:
        return ACCURACY_TIERS['plus_two']
    else:
        return ACCURACY_TIERS['complete']


def get_facet_index(facet_code: str) -> int:
    """
    Get numeric index for a facet code.

    Args:
        facet_code: Either short code ('N1') or full name ('N1_Anxiety')

    Returns:
        Index 0-29
    """
    if facet_code in FACET_SHORT_CODES:
        return FACET_SHORT_CODES[facet_code]
    elif facet_code in FACET_INDEX_MAP:
        return FACET_INDEX_MAP[facet_code]
    else:
        raise ValueError(f"Unknown facet code: {facet_code}")
