"""
Luna Fusion Engine
Main weighted fusion of all personality sources → 30-facet NEO PI-R vector

This is the central integration layer that combines:
- Static sources (Big5, MBTI, Enneagram, BaZi, Numerology, Natal)
- Dynamic sources (P4 Aspects, P5 Transits, P8 Progressions)
- Derived layers (P7 Archetypes from final vector)

Architecture:
- Brain 7A: All calculations (this module coordinates)
- Brain 7B: Final 30-facet personality vector (output)
- Brain 7C: Current conversations (downstream)
- Brain 8: Long-term memory (downstream)

Critical Design Principle: MODULAR
- Works with whatever data is available
- No skip flags - simply omit missing sources
- Dynamic weight recalculation when sources missing
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Set
from datetime import datetime

from .constants import (
    DIMENSIONS_30, FACET_SHORT_CODES, FACET_NAMES,
    BASE_WEIGHTS, ACCURACY_TIERS, LUNA_PRESETS,
    get_active_weights
)
from .vector_utils import (
    normalize_vector, clip_vector, weighted_blend,
    create_zero_vector, cosine_similarity, get_domain_scores
)

# Import engines
from ..sources.aspects import aspects_to_30_facets, calculate_natal_aspects
from ..transits.transits_engine import (
    transits_to_30_facets, calculate_transit_aspects, calculate_current_positions
)
from ..progressions.progressions_engine import (
    progressions_to_30_facets, calculate_progressions
)
from ..archetypes.archetype_engine import (
    vector_to_archetypes, get_dominant_archetypes, get_archetype_profile
)


# ============================================
# SOURCE TYPE CATEGORIES
# ============================================

# Sources that can be auto-derived from birth data alone
AUTO_DERIVED_SOURCES = {
    'natal',        # Zodiac placements
    'bazi',         # Four Pillars (Chinese astrology)
    'numerology',   # Life path, expression numbers
    'aspects',      # P4 Natal aspects
}

# Sources that require user questionnaires
QUESTIONNAIRE_SOURCES = {
    'big5',         # NEO PI-R or similar
    'mbti',         # Myers-Briggs
    'enneagram',    # Enneagram type + health level
}

# Dynamic sources (change over time)
DYNAMIC_SOURCES = {
    'transits',     # P5 Current transits
    'progressions', # P8 Secondary progressions
}


# ============================================
# DEFAULT SOURCE VECTORS
# ============================================
# Fallback vectors when external sources not yet implemented

DEFAULT_VECTORS = {
    'natal': {
        # Simplified natal influence (Sun sign emphasis)
        'description': 'Western zodiac placements influence',
        'weight': 0.08
    },
    'bazi': {
        # BaZi Four Pillars (to be integrated from existing service)
        'description': 'Chinese Four Pillars elemental balance',
        'weight': 0.28
    },
    'numerology': {
        # Numerology (to be integrated from existing service)
        'description': 'Life path and expression numbers',
        'weight': 0.06
    }
}


# ============================================
# MAIN FUSION FUNCTIONS
# ============================================

def fuse_to_30_facets(sources: Dict,
                      birth_data: Dict = None,
                      include_dynamic: bool = True,
                      target_date: datetime = None) -> Dict:
    """
    Main fusion function - combines all available sources into 30-facet vector.

    This is the primary entry point for Luna's personality calculation.

    Args:
        sources: Dict with available source data:
            - 'big5': Dict with facet scores (N1-N6, E1-E6, etc.)
            - 'mbti': Dict with type and function scores
            - 'enneagram': Dict with type, wing, health_level
            - 'natal': Dict with planet placements
            - 'bazi': Dict with pillar data
            - 'numerology': Dict with number meanings
            - 'aspects': List of natal aspects OR birth_data to calculate
        birth_data: Required for auto-derived sources and dynamics
        include_dynamic: Whether to include transits/progressions
        target_date: Date for dynamic calculations (defaults to now)

    Returns:
        Dict with:
            - vector: 30-dimensional numpy array
            - confidence: Accuracy tier based on sources
            - active_sources: Which sources contributed
            - archetypes: Top archetypes from final vector
            - domain_scores: OCEAN domain averages
    """
    if target_date is None:
        target_date = datetime.utcnow()

    vectors = []
    weights = []
    active_sources = set()

    # Track what's available
    available_sources = _identify_available_sources(sources, birth_data)

    # Get dynamically recalculated weights
    active_weights = get_active_weights(list(available_sources))

    # ========================================
    # STATIC SOURCES (from questionnaires/data)
    # ========================================

    # Big 5 (most direct mapping to NEO PI-R)
    if 'big5' in sources and sources['big5']:
        big5_vector = _big5_to_30_facets(sources['big5'])
        vectors.append(big5_vector)
        weights.append(active_weights.get('big5', 0.22))
        active_sources.add('big5')

    # MBTI
    if 'mbti' in sources and sources['mbti']:
        mbti_vector = _mbti_to_30_facets(sources['mbti'])
        vectors.append(mbti_vector)
        weights.append(active_weights.get('mbti', 0.08))
        active_sources.add('mbti')

    # Enneagram (with health levels 1-9)
    if 'enneagram' in sources and sources['enneagram']:
        enneagram_vector = _enneagram_to_30_facets(sources['enneagram'])
        vectors.append(enneagram_vector)
        weights.append(active_weights.get('enneagram', 0.16))
        active_sources.add('enneagram')

    # ========================================
    # AUTO-DERIVED SOURCES (from birth data)
    # ========================================

    if birth_data:
        # Natal (Western zodiac placements)
        if 'natal' in sources and sources['natal']:
            natal_vector = _natal_to_30_facets(sources['natal'])
            vectors.append(natal_vector)
            weights.append(active_weights.get('natal', 0.08))
            active_sources.add('natal')

        # BaZi (Chinese Four Pillars)
        if 'bazi' in sources and sources['bazi']:
            bazi_vector = _bazi_to_30_facets(sources['bazi'])
            vectors.append(bazi_vector)
            weights.append(active_weights.get('bazi', 0.28))
            active_sources.add('bazi')

        # Numerology
        if 'numerology' in sources and sources['numerology']:
            numerology_vector = _numerology_to_30_facets(sources['numerology'])
            vectors.append(numerology_vector)
            weights.append(active_weights.get('numerology', 0.06))
            active_sources.add('numerology')

        # P4 Natal Aspects
        if 'aspects' in sources and sources['aspects']:
            # Can be pre-calculated aspects or we calculate from natal
            if isinstance(sources['aspects'], list):
                aspects = sources['aspects']
            else:
                # Calculate from natal data
                aspects = calculate_natal_aspects(sources.get('natal', {}))

            aspects_vector = aspects_to_30_facets(aspects)
            vectors.append(aspects_vector)
            weights.append(active_weights.get('aspects', 0.12))
            active_sources.add('aspects')

    # ========================================
    # DYNAMIC SOURCES (time-sensitive)
    # ========================================

    dynamic_delta = create_zero_vector()

    if include_dynamic and birth_data:
        # P5 Transits (temporary overlay)
        try:
            natal_positions = sources.get('natal', {}).get('positions', {})
            if natal_positions:
                transit_positions = calculate_current_positions()
                transit_aspects = calculate_transit_aspects(
                    natal_positions, transit_positions
                )
                transit_vector = transits_to_30_facets(transit_aspects)
                dynamic_delta += transit_vector * 0.5  # Transits are temporary
                active_sources.add('transits')
        except Exception as e:
            pass  # Transit calculation failed, continue without

        # P8 Progressions (gradual evolution)
        try:
            progression_data = calculate_progressions(birth_data, target_date)
            progression_vector = progressions_to_30_facets(progression_data)
            dynamic_delta += progression_vector
            active_sources.add('progressions')
        except Exception as e:
            pass  # Progression calculation failed, continue without

    # ========================================
    # WEIGHTED FUSION
    # ========================================

    if not vectors:
        # No sources available - return neutral vector
        base_vector = create_zero_vector() + 0.5
        confidence = _calculate_confidence(active_sources)
        return {
            'vector': base_vector,
            'confidence': confidence,
            'active_sources': list(active_sources),
            'archetypes': [],
            'domain_scores': get_domain_scores(base_vector),
            'message': ACCURACY_TIERS[confidence]['message']
        }

    # Normalize weights
    total_weight = sum(weights)
    if total_weight > 0:
        weights = [w / total_weight for w in weights]

    # Fuse static sources
    base_vector = weighted_blend(vectors, weights)

    # Add dynamic delta
    final_vector = base_vector + dynamic_delta

    # Clip to valid range
    final_vector = clip_vector(final_vector, 0.0, 1.0)

    # ========================================
    # POST-PROCESSING
    # ========================================

    # Calculate confidence tier
    confidence = _calculate_confidence(active_sources)

    # Get archetypes from final vector
    archetypes = get_dominant_archetypes(final_vector, top_n=3)

    # Get domain scores
    domain_scores = get_domain_scores(final_vector)

    return {
        'vector': final_vector,
        'confidence': confidence,
        'confidence_percent': ACCURACY_TIERS[confidence]['percent'],
        'active_sources': list(active_sources),
        'source_weights': {s: active_weights.get(s, 0) for s in active_sources},
        'archetypes': archetypes,
        'domain_scores': domain_scores,
        'message': ACCURACY_TIERS[confidence]['message']
    }


def _identify_available_sources(sources: Dict, birth_data: Dict = None) -> Set[str]:
    """Identify which sources are available."""
    available = set()

    # Questionnaire sources
    for source in QUESTIONNAIRE_SOURCES:
        if source in sources and sources[source]:
            available.add(source)

    # Auto-derived sources (require birth data)
    if birth_data:
        for source in AUTO_DERIVED_SOURCES:
            if source in sources and sources[source]:
                available.add(source)

    return available


def _calculate_confidence(active_sources: Set[str]) -> str:
    """Calculate confidence tier based on active sources."""
    questionnaire_count = len(active_sources & QUESTIONNAIRE_SOURCES)
    has_birth_data = bool(active_sources & AUTO_DERIVED_SOURCES)

    if questionnaire_count >= 3:
        return 'complete'
    elif questionnaire_count >= 2:
        return 'strong'
    elif questionnaire_count >= 1:
        return 'good'
    elif has_birth_data:
        return 'basic'
    else:
        return 'minimal'


# ============================================
# SOURCE CONVERSION FUNCTIONS
# ============================================

def _big5_to_30_facets(big5_data: Dict) -> np.ndarray:
    """
    Convert Big 5 data to 30-facet vector.

    Expects: Dict with facet codes (N1, N2, etc.) or domain scores (N, E, O, A, C)
    """
    vector = create_zero_vector()

    # Direct facet mapping if available
    for facet_code in FACET_SHORT_CODES:
        if facet_code in big5_data:
            idx = FACET_SHORT_CODES[facet_code]
            vector[idx] = float(big5_data[facet_code])

    # Domain-level fallback
    domains = ['N', 'E', 'O', 'A', 'C']
    for domain in domains:
        if domain in big5_data and not any(f'{domain}{i}' in big5_data for i in range(1, 7)):
            # No facets, use domain score for all facets
            domain_score = float(big5_data[domain])
            for i in range(1, 7):
                facet = f'{domain}{i}'
                if facet in FACET_SHORT_CODES:
                    idx = FACET_SHORT_CODES[facet]
                    vector[idx] = domain_score

    return clip_vector(vector, 0.0, 1.0)


def _mbti_to_30_facets(mbti_data: Dict) -> np.ndarray:
    """
    Convert MBTI data to 30-facet vector.

    Uses MBTI → NEO PI-R correlations from research.
    """
    vector = create_zero_vector() + 0.5  # Start at neutral

    type_code = mbti_data.get('type', '')
    if len(type_code) != 4:
        return vector

    # MBTI → NEO PI-R research correlations
    # E/I → Extraversion facets
    if type_code[0] == 'E':
        vector[FACET_SHORT_CODES['E1']] += 0.15  # Warmth
        vector[FACET_SHORT_CODES['E2']] += 0.20  # Gregariousness
        vector[FACET_SHORT_CODES['E3']] += 0.15  # Assertiveness
        vector[FACET_SHORT_CODES['E4']] += 0.10  # Activity
        vector[FACET_SHORT_CODES['E5']] += 0.15  # Excitement-Seeking
        vector[FACET_SHORT_CODES['E6']] += 0.12  # Positive Emotions
    else:  # I
        vector[FACET_SHORT_CODES['E1']] -= 0.10
        vector[FACET_SHORT_CODES['E2']] -= 0.20
        vector[FACET_SHORT_CODES['E3']] -= 0.10
        vector[FACET_SHORT_CODES['E5']] -= 0.12

    # S/N → Openness facets
    if type_code[1] == 'N':
        vector[FACET_SHORT_CODES['O1']] += 0.20  # Fantasy
        vector[FACET_SHORT_CODES['O2']] += 0.15  # Aesthetics
        vector[FACET_SHORT_CODES['O3']] += 0.12  # Feelings
        vector[FACET_SHORT_CODES['O4']] += 0.10  # Actions
        vector[FACET_SHORT_CODES['O5']] += 0.18  # Ideas
        vector[FACET_SHORT_CODES['O6']] += 0.12  # Values
    else:  # S
        vector[FACET_SHORT_CODES['O1']] -= 0.15
        vector[FACET_SHORT_CODES['O5']] -= 0.12

    # T/F → Agreeableness facets
    if type_code[2] == 'F':
        vector[FACET_SHORT_CODES['A1']] += 0.12  # Trust
        vector[FACET_SHORT_CODES['A3']] += 0.15  # Altruism
        vector[FACET_SHORT_CODES['A6']] += 0.18  # Tender-mindedness
        vector[FACET_SHORT_CODES['O3']] += 0.10  # Feelings (cross-loading)
    else:  # T
        vector[FACET_SHORT_CODES['A6']] -= 0.15
        vector[FACET_SHORT_CODES['A3']] -= 0.10

    # J/P → Conscientiousness facets
    if type_code[3] == 'J':
        vector[FACET_SHORT_CODES['C1']] += 0.12  # Competence
        vector[FACET_SHORT_CODES['C2']] += 0.18  # Order
        vector[FACET_SHORT_CODES['C3']] += 0.15  # Dutifulness
        vector[FACET_SHORT_CODES['C4']] += 0.12  # Achievement-Striving
        vector[FACET_SHORT_CODES['C5']] += 0.15  # Self-Discipline
        vector[FACET_SHORT_CODES['C6']] += 0.10  # Deliberation
    else:  # P
        vector[FACET_SHORT_CODES['C2']] -= 0.15
        vector[FACET_SHORT_CODES['C5']] -= 0.12
        vector[FACET_SHORT_CODES['O4']] += 0.10  # Actions (flexibility)

    return clip_vector(vector, 0.0, 1.0)


def _enneagram_to_30_facets(enneagram_data: Dict) -> np.ndarray:
    """
    Convert Enneagram data to 30-facet vector.

    Includes health levels 1-9 (1 = healthiest, 9 = least healthy).
    """
    vector = create_zero_vector() + 0.5  # Start neutral

    etype = enneagram_data.get('type', 0)
    wing = enneagram_data.get('wing', 0)
    health = enneagram_data.get('health_level', 5)  # Default to average

    # Health level modifier (1-9 scale)
    # 1-3: healthy, 4-6: average, 7-9: unhealthy
    health_modifier = (5 - health) / 8  # Range: -0.5 to +0.5

    # Enneagram type → facet mappings
    type_mappings = {
        1: {  # Reformer
            'C2': 0.20, 'C3': 0.18, 'C5': 0.15,
            'N2': 0.12, 'A2': 0.15
        },
        2: {  # Helper
            'A3': 0.22, 'A6': 0.20, 'E1': 0.18,
            'A5': -0.10  # Unhealthy: pride
        },
        3: {  # Achiever
            'C4': 0.22, 'E3': 0.18, 'C1': 0.15,
            'A2': -0.12  # Image-conscious
        },
        4: {  # Individualist
            'O3': 0.22, 'O2': 0.18, 'O1': 0.15,
            'N3': 0.12, 'N6': 0.10
        },
        5: {  # Investigator
            'O5': 0.22, 'C6': 0.18, 'E2': -0.15,
            'E1': -0.10
        },
        6: {  # Loyalist
            'A1': 0.15, 'N1': 0.18, 'C3': 0.15,
            'A4': 0.12
        },
        7: {  # Enthusiast
            'E5': 0.22, 'E6': 0.20, 'O4': 0.18,
            'O1': 0.15, 'C5': -0.12
        },
        8: {  # Challenger
            'E3': 0.22, 'N2': 0.15, 'A4': -0.18,
            'A1': -0.10
        },
        9: {  # Peacemaker
            'A4': 0.20, 'A1': 0.18, 'E3': -0.15,
            'N2': -0.12
        }
    }

    if etype in type_mappings:
        for facet, value in type_mappings[etype].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                # Apply value, modified by health level
                adjusted = value * (1 + health_modifier)
                vector[idx] += adjusted

    # Wing influence (30% of wing's pattern)
    if wing in type_mappings:
        for facet, value in type_mappings[wing].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.3 * (1 + health_modifier)

    return clip_vector(vector, 0.0, 1.0)


def _natal_to_30_facets(natal_data: Dict) -> np.ndarray:
    """
    Convert Western natal data to 30-facet vector.

    Uses Sun, Moon, Ascendant primarily.
    """
    vector = create_zero_vector() + 0.5

    # Sign → facet mappings (simplified)
    sign_facets = {
        'Aries': {'E3': 0.15, 'E4': 0.12, 'N2': 0.08},
        'Taurus': {'C2': 0.15, 'A1': 0.10, 'E5': -0.08},
        'Gemini': {'O5': 0.15, 'E2': 0.12, 'C5': -0.08},
        'Cancer': {'A6': 0.15, 'O3': 0.12, 'N6': 0.10},
        'Leo': {'E3': 0.12, 'E6': 0.15, 'A5': -0.08},
        'Virgo': {'C2': 0.15, 'C6': 0.12, 'O1': -0.08},
        'Libra': {'A1': 0.12, 'A4': 0.15, 'E3': -0.08},
        'Scorpio': {'O3': 0.15, 'N3': 0.08, 'A2': -0.10},
        'Sagittarius': {'O4': 0.15, 'O6': 0.12, 'C2': -0.08},
        'Capricorn': {'C4': 0.15, 'C5': 0.12, 'E6': -0.08},
        'Aquarius': {'O5': 0.15, 'O4': 0.12, 'A4': -0.10},
        'Pisces': {'O1': 0.15, 'O3': 0.12, 'C5': -0.10}
    }

    # Sun sign (40% weight)
    sun_sign = natal_data.get('sun', {}).get('sign', '')
    if sun_sign in sign_facets:
        for facet, value in sign_facets[sun_sign].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.4

    # Moon sign (35% weight)
    moon_sign = natal_data.get('moon', {}).get('sign', '')
    if moon_sign in sign_facets:
        for facet, value in sign_facets[moon_sign].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.35

    # Ascendant (25% weight)
    asc_sign = natal_data.get('ascendant', {}).get('sign', '')
    if asc_sign in sign_facets:
        for facet, value in sign_facets[asc_sign].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.25

    return clip_vector(vector, 0.0, 1.0)


def _bazi_to_30_facets(bazi_data: Dict) -> np.ndarray:
    """
    Convert BaZi (Chinese Four Pillars) to 30-facet vector.

    Uses elemental balance and day master.
    """
    vector = create_zero_vector() + 0.5

    # Element → facet mappings
    element_facets = {
        'Wood': {  # Growth, kindness
            'A3': 0.15, 'A1': 0.12, 'O4': 0.10, 'E6': 0.08
        },
        'Fire': {  # Passion, warmth
            'E1': 0.15, 'E5': 0.12, 'E6': 0.12, 'N2': 0.08
        },
        'Earth': {  # Stability, nurturing
            'C2': 0.15, 'A6': 0.12, 'A1': 0.10, 'C3': 0.08
        },
        'Metal': {  # Precision, justice
            'C6': 0.15, 'A2': 0.12, 'C5': 0.10, 'E3': 0.08
        },
        'Water': {  # Wisdom, adaptability
            'O5': 0.15, 'O1': 0.12, 'O3': 0.10, 'N6': 0.08
        }
    }

    # Day master element (primary influence)
    day_master = bazi_data.get('day_master', {}).get('element', '')
    if day_master in element_facets:
        for facet, value in element_facets[day_master].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.5

    # Element balance (supporting elements)
    balance = bazi_data.get('element_balance', {})
    for element, strength in balance.items():
        if element in element_facets and element != day_master:
            strength_mod = strength / 100.0  # Assuming 0-100 scale
            for facet, value in element_facets[element].items():
                if facet in FACET_SHORT_CODES:
                    idx = FACET_SHORT_CODES[facet]
                    vector[idx] += value * strength_mod * 0.3

    return clip_vector(vector, 0.0, 1.0)


def _numerology_to_30_facets(numerology_data: Dict) -> np.ndarray:
    """
    Convert Numerology data to 30-facet vector.

    Uses Life Path, Expression, and Soul Urge numbers.
    """
    vector = create_zero_vector() + 0.5

    # Number → facet mappings
    number_facets = {
        1: {'E3': 0.18, 'C4': 0.15, 'A4': -0.10},           # Leadership
        2: {'A1': 0.18, 'A4': 0.15, 'A6': 0.12},            # Diplomacy
        3: {'O2': 0.18, 'E6': 0.15, 'O1': 0.12},            # Creativity
        4: {'C2': 0.18, 'C3': 0.15, 'C5': 0.12},            # Structure
        5: {'O4': 0.18, 'E5': 0.15, 'C2': -0.10},           # Freedom
        6: {'A6': 0.18, 'A3': 0.15, 'C3': 0.12},            # Nurturing
        7: {'O5': 0.18, 'C6': 0.15, 'E2': -0.10},           # Seeker
        8: {'C4': 0.18, 'E3': 0.15, 'C1': 0.12},            # Power
        9: {'A3': 0.18, 'O6': 0.15, 'A6': 0.12},            # Humanitarian
        11: {'O5': 0.20, 'O1': 0.15, 'N6': 0.12},           # Master - Intuition
        22: {'C4': 0.20, 'C1': 0.18, 'O4': 0.15},           # Master - Builder
        33: {'A3': 0.20, 'A6': 0.18, 'O3': 0.15}            # Master - Teacher
    }

    # Life Path (50% weight)
    life_path = numerology_data.get('life_path', 0)
    if life_path in number_facets:
        for facet, value in number_facets[life_path].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.5

    # Expression (30% weight)
    expression = numerology_data.get('expression', 0)
    if expression in number_facets:
        for facet, value in number_facets[expression].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.3

    # Soul Urge (20% weight)
    soul_urge = numerology_data.get('soul_urge', 0)
    if soul_urge in number_facets:
        for facet, value in number_facets[soul_urge].items():
            if facet in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[facet]
                vector[idx] += value * 0.2

    return clip_vector(vector, 0.0, 1.0)


# ============================================
# LUNA PERSONALITY ADAPTATION
# ============================================

def get_luna_personality(preset_name: str = 'Nurturing Guide',
                         user_tweaks: Dict = None) -> Dict:
    """
    Get Luna's personality configuration.

    Args:
        preset_name: One of the preset names
        user_tweaks: Optional Dict with slider adjustments:
            - warmth: 0.0 to 1.0
            - directness: 0.0 to 1.0
            - playfulness: 0.0 to 1.0
            - depth: 0.0 to 1.0
            - challenge: 0.0 to 1.0

    Returns:
        Luna's personality configuration for conversation AI
    """
    preset = LUNA_PRESETS.get(preset_name, LUNA_PRESETS['Nurturing Guide'])

    # Start with preset adjustments
    adjustments = preset['tone_adjustments'].copy()

    # Apply user tweaks if provided
    if user_tweaks:
        for key, value in user_tweaks.items():
            if key in adjustments:
                # Blend preset (60%) with user tweak (40%)
                adjustments[key] = adjustments[key] * 0.6 + value * 0.4

    return {
        'preset': preset_name,
        'description': preset['description'],
        'adjustments': adjustments,
        'facet_mods': preset.get('facet_mods', {})
    }


def adapt_luna_to_user(luna_config: Dict,
                       user_vector: np.ndarray,
                       adaptation_strength: float = 0.3) -> Dict:
    """
    Adapt Luna's personality to complement a specific user.

    Uses P6 synastry principles to adjust Luna's behavior.

    Args:
        luna_config: Result from get_luna_personality
        user_vector: User's 30-facet personality vector
        adaptation_strength: How much to adapt (0.0 to 1.0)

    Returns:
        Adapted Luna configuration
    """
    from ..synastry.synastry_engine import get_behavioral_adjustments

    # Create Luna's base vector from config
    luna_vector = create_zero_vector() + 0.5
    for facet, mod in luna_config.get('facet_mods', {}).items():
        if facet in FACET_SHORT_CODES:
            idx = FACET_SHORT_CODES[facet]
            luna_vector[idx] = mod

    # Get behavioral adjustments
    adjustments = get_behavioral_adjustments(user_vector, luna_vector)

    # Apply adjustments to Luna's config
    adapted_adjustments = luna_config['adjustments'].copy()
    for behavior, adjustment in adjustments.items():
        if behavior in adapted_adjustments:
            # Blend original with adaptation
            original = adapted_adjustments[behavior]
            adapted = original + (adjustment * adaptation_strength)
            adapted_adjustments[behavior] = max(0.0, min(1.0, adapted))

    return {
        **luna_config,
        'adjustments': adapted_adjustments,
        'user_adaptations': adjustments,
        'adaptation_strength': adaptation_strength
    }


# ============================================
# COMPLETE PROFILE GENERATION
# ============================================

def generate_complete_profile(sources: Dict,
                              birth_data: Dict,
                              target_date: datetime = None,
                              luna_preset: str = 'Nurturing Guide') -> Dict:
    """
    Generate a complete user profile with all available data.

    This is the main entry point for comprehensive personality analysis.

    Args:
        sources: All available source data
        birth_data: User's birth data
        target_date: Date for dynamic calculations
        luna_preset: Luna's personality preset

    Returns:
        Complete profile with all analyses
    """
    if target_date is None:
        target_date = datetime.utcnow()

    # Main fusion
    fusion_result = fuse_to_30_facets(
        sources, birth_data,
        include_dynamic=True,
        target_date=target_date
    )

    # Get full archetype profile
    archetype_profile = get_archetype_profile(fusion_result['vector'])

    # Get Luna adaptation
    luna_config = get_luna_personality(luna_preset)
    adapted_luna = adapt_luna_to_user(
        luna_config,
        fusion_result['vector'],
        adaptation_strength=0.3
    )

    return {
        'personality': {
            'vector': fusion_result['vector'].tolist(),
            'domain_scores': fusion_result['domain_scores'],
            'confidence': fusion_result['confidence'],
            'confidence_percent': fusion_result['confidence_percent'],
            'message': fusion_result['message']
        },
        'sources': {
            'active': fusion_result['active_sources'],
            'weights': fusion_result['source_weights']
        },
        'archetypes': archetype_profile,
        'luna': adapted_luna,
        'metadata': {
            'generated_at': datetime.utcnow().isoformat(),
            'target_date': target_date.isoformat()
        }
    }
