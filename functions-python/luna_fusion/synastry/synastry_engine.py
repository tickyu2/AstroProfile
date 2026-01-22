"""
P6 Synastry Engine
Two-user compatibility → behavioral adjustments + insights

Compares two users' 30-facet personality vectors to generate:
1. Compatibility score (0-1)
2. Behavioral adjustments for Luna's interaction style
3. Relationship insights (strengths, challenges, growth areas)
"""

import numpy as np
from typing import Dict, List, Optional, Tuple, Callable

from ..core.constants import DIMENSIONS_30, DOMAIN_RANGES, FACET_SHORT_CODES
from ..core.vector_utils import (
    cosine_similarity, euclidean_distance,
    get_domain_scores, create_zero_vector
)


# ============================================
# DOMAIN WEIGHTS FOR COMPATIBILITY
# ============================================
# How much each domain/trait contributes to overall compatibility

DOMAIN_WEIGHTS = {
    'openness': 0.20,           # Intellectual harmony
    'conscientiousness': 0.15, # Practical alignment
    'extraversion': 0.15,      # Social energy match
    'agreeableness': 0.20,     # Emotional rapport
    'neuroticism': 0.10,       # Emotional stability match
    # Extended traits (calculated from facets)
    'emotional_intensity': 0.10,  # O3 + N facets
    'insightful': 0.05,           # O5 + C6
    'nurturing': 0.05             # A3 + A6
}


# ============================================
# COMPATIBILITY FACET GROUPS
# ============================================
# Facets grouped for specific compatibility dimensions

FACET_GROUPS = {
    'emotional_intensity': ['O3', 'N6', 'N3', 'N1'],
    'insightful': ['O5', 'C6', 'O6'],
    'nurturing': ['A3', 'A6', 'E1'],
    'playful': ['E5', 'E6', 'O1'],
    'ambitious': ['C4', 'E3', 'C5'],
    'adventurous': ['O4', 'E5', 'O1'],
    'romantic': ['O3', 'E1', 'A1', 'O2']
}


# ============================================
# BEHAVIOR ADJUSTMENT RULES
# ============================================
# How Luna adjusts behavior based on user differences

def _warmth_rule(diff: Dict[str, float]) -> float:
    """Calculate warmth adjustment from user differences."""
    return diff.get('agreeableness', 0) * 0.5 + diff.get('nurturing', 0) * 0.5


def _directness_rule(diff: Dict[str, float]) -> float:
    """Calculate directness adjustment."""
    return (diff.get('extraversion', 0) * 0.4 +
            diff.get('ambitious', 0) * 0.3 -
            diff.get('agreeableness', 0) * 0.3)


def _playfulness_rule(diff: Dict[str, float]) -> float:
    """Calculate playfulness adjustment."""
    return diff.get('playful', 0) * 0.6 + diff.get('adventurous', 0) * 0.4


def _depth_rule(diff: Dict[str, float]) -> float:
    """Calculate conversation depth adjustment."""
    return (diff.get('insightful', 0) * 0.5 +
            diff.get('emotional_intensity', 0) * 0.3 +
            diff.get('openness', 0) * 0.2)


def _challenge_rule(diff: Dict[str, float]) -> float:
    """Calculate challenge level adjustment."""
    return (diff.get('ambitious', 0) * 0.4 +
            diff.get('conscientiousness', 0) * 0.3 -
            diff.get('neuroticism', 0) * 0.3)


BEHAVIOR_RULES = {
    'warmth': _warmth_rule,
    'directness': _directness_rule,
    'playfulness': _playfulness_rule,
    'depth_level': _depth_rule,
    'challenge_level': _challenge_rule
}


# ============================================
# COMPATIBILITY THRESHOLDS
# ============================================

COMPATIBILITY_LEVELS = {
    'excellent': {'min': 0.85, 'description': 'Exceptional harmony and understanding'},
    'high': {'min': 0.70, 'description': 'Strong natural compatibility'},
    'good': {'min': 0.55, 'description': 'Solid foundation with room for growth'},
    'moderate': {'min': 0.40, 'description': 'Workable with conscious effort'},
    'challenging': {'min': 0.0, 'description': 'Significant differences to navigate'}
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def compute_synastry_fusion(user1_vector: np.ndarray,
                            user2_vector: np.ndarray,
                            weighted: bool = True) -> Dict:
    """
    Compute synastry compatibility between two users.

    Args:
        user1_vector: First user's 30-facet personality vector
        user2_vector: Second user's 30-facet personality vector
        weighted: Whether to use domain weighting

    Returns:
        Dict with compatibility score, breakdown, and analysis
    """
    # Get domain scores
    domains1 = get_domain_scores(user1_vector)
    domains2 = get_domain_scores(user2_vector)

    # Calculate extended traits
    extended1 = _calculate_extended_traits(user1_vector)
    extended2 = _calculate_extended_traits(user2_vector)

    # Merge domains and extended traits
    all_traits1 = {**domains1, **extended1}
    all_traits2 = {**domains2, **extended2}

    # Calculate compatibility scores per dimension
    dimension_scores = {}
    weighted_sum = 0.0
    total_weight = 0.0

    for trait, weight in DOMAIN_WEIGHTS.items():
        if trait in all_traits1 and trait in all_traits2:
            # Similarity = 1 - normalized difference
            diff = abs(all_traits1[trait] - all_traits2[trait])
            similarity = 1.0 - min(diff, 1.0)

            dimension_scores[trait] = {
                'user1': round(all_traits1[trait], 3),
                'user2': round(all_traits2[trait], 3),
                'difference': round(diff, 3),
                'similarity': round(similarity, 3),
                'weight': weight
            }

            if weighted:
                weighted_sum += similarity * weight
                total_weight += weight

    # Overall compatibility score
    if weighted and total_weight > 0:
        overall_score = weighted_sum / total_weight
    else:
        # Simple cosine similarity fallback
        overall_score = max(0, cosine_similarity(user1_vector, user2_vector))

    # Determine compatibility level
    compatibility_level = 'challenging'
    for level, info in COMPATIBILITY_LEVELS.items():
        if overall_score >= info['min']:
            compatibility_level = level
            break

    return {
        'overall_score': round(overall_score, 3),
        'level': compatibility_level,
        'level_description': COMPATIBILITY_LEVELS[compatibility_level]['description'],
        'dimension_scores': dimension_scores,
        'cosine_similarity': round(cosine_similarity(user1_vector, user2_vector), 3),
        'euclidean_distance': round(euclidean_distance(user1_vector, user2_vector), 3)
    }


def _calculate_extended_traits(vector: np.ndarray) -> Dict[str, float]:
    """Calculate extended traits from facet groups."""
    traits = {}

    for trait_name, facet_codes in FACET_GROUPS.items():
        values = []
        for code in facet_codes:
            if code in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[code]
                values.append(vector[idx])
        if values:
            traits[trait_name] = float(np.mean(values))

    return traits


def get_behavioral_adjustments(user_vector: np.ndarray,
                               luna_base_vector: np.ndarray) -> Dict[str, float]:
    """
    Calculate how Luna should adjust her behavior for this user.

    Args:
        user_vector: User's 30-facet personality vector
        luna_base_vector: Luna's base personality vector

    Returns:
        Dict of behavioral adjustment values (-1 to 1)
    """
    # Calculate domain and extended trait scores
    user_domains = get_domain_scores(user_vector)
    user_extended = _calculate_extended_traits(user_vector)
    user_traits = {**user_domains, **user_extended}

    luna_domains = get_domain_scores(luna_base_vector)
    luna_extended = _calculate_extended_traits(luna_base_vector)
    luna_traits = {**luna_domains, **luna_extended}

    # Calculate differences (user - luna)
    # Positive = user is higher, Luna should increase
    differences = {}
    for trait in user_traits:
        if trait in luna_traits:
            diff = user_traits[trait] - luna_traits[trait]
            differences[trait] = diff

    # Apply behavior rules
    adjustments = {}
    for behavior, rule_func in BEHAVIOR_RULES.items():
        try:
            adjustment = rule_func(differences)
            # Clip to reasonable range
            adjustments[behavior] = round(np.clip(adjustment, -1.0, 1.0), 3)
        except Exception:
            adjustments[behavior] = 0.0

    return adjustments


def generate_insights(user1_vector: np.ndarray,
                      user2_vector: np.ndarray,
                      synastry_result: Dict = None) -> Dict:
    """
    Generate relationship insights from synastry analysis.

    Args:
        user1_vector: First user's personality vector
        user2_vector: Second user's personality vector
        synastry_result: Pre-computed synastry result (optional)

    Returns:
        Dict with strengths, challenges, and growth areas
    """
    if synastry_result is None:
        synastry_result = compute_synastry_fusion(user1_vector, user2_vector)

    insights = {
        'strengths': [],
        'challenges': [],
        'growth_areas': [],
        'tips': []
    }

    dimension_scores = synastry_result.get('dimension_scores', {})

    # Identify strengths (high similarity)
    for dim, data in dimension_scores.items():
        similarity = data.get('similarity', 0)

        if similarity >= 0.8:
            insights['strengths'].append({
                'dimension': dim,
                'score': similarity,
                'description': _get_strength_description(dim, similarity)
            })
        elif similarity <= 0.4:
            insights['challenges'].append({
                'dimension': dim,
                'score': similarity,
                'description': _get_challenge_description(dim, data)
            })
        elif 0.4 < similarity < 0.6:
            insights['growth_areas'].append({
                'dimension': dim,
                'score': similarity,
                'description': _get_growth_description(dim)
            })

    # Generate tips based on challenges
    insights['tips'] = _generate_tips(insights['challenges'])

    return insights


def _get_strength_description(dim: str, score: float) -> str:
    """Get description for a compatibility strength."""
    descriptions = {
        'openness': 'You share intellectual curiosity and appreciation for new experiences',
        'conscientiousness': 'You align well on organization, planning, and responsibility',
        'extraversion': 'Your social energy levels complement each other naturally',
        'agreeableness': 'You both value harmony and show empathy in similar ways',
        'neuroticism': 'You have similar emotional regulation patterns',
        'emotional_intensity': 'You experience emotions at compatible depths',
        'insightful': 'You share a love for meaningful, thoughtful conversations',
        'nurturing': 'You both naturally care for and support others'
    }
    return descriptions.get(dim, f'Strong alignment in {dim}')


def _get_challenge_description(dim: str, data: Dict) -> str:
    """Get description for a compatibility challenge."""
    user1_val = data.get('user1', 0.5)
    user2_val = data.get('user2', 0.5)

    templates = {
        'openness': {
            'high_low': 'One seeks novelty while the other prefers familiarity',
            'low_high': 'Different comfort levels with change and new experiences'
        },
        'conscientiousness': {
            'high_low': 'Different approaches to planning and structure',
            'low_high': 'Varying levels of organization may cause friction'
        },
        'extraversion': {
            'high_low': 'Social energy differences - one needs more alone time',
            'low_high': 'Different needs for social interaction and stimulation'
        },
        'agreeableness': {
            'high_low': 'Different conflict styles - one more direct, one more accommodating',
            'low_high': 'Varying approaches to cooperation and compromise'
        },
        'neuroticism': {
            'high_low': 'Different stress responses may need understanding',
            'low_high': 'Emotional sensitivity levels differ significantly'
        }
    }

    dim_templates = templates.get(dim, {})
    direction = 'high_low' if user1_val > user2_val else 'low_high'
    return dim_templates.get(direction, f'Significant differences in {dim} to navigate')


def _get_growth_description(dim: str) -> str:
    """Get description for a growth area."""
    descriptions = {
        'openness': 'Opportunity to expand each other\'s perspectives',
        'conscientiousness': 'Chance to learn different approaches to goals',
        'extraversion': 'Balance each other\'s social and private needs',
        'agreeableness': 'Develop deeper understanding of each other\'s values',
        'neuroticism': 'Support each other through emotional ups and downs',
        'emotional_intensity': 'Learn to match emotional depth appropriately',
        'insightful': 'Grow together through meaningful conversations',
        'nurturing': 'Develop ways to care for each other effectively'
    }
    return descriptions.get(dim, f'Room for growth in {dim}')


def _generate_tips(challenges: List[Dict]) -> List[str]:
    """Generate practical tips based on challenges."""
    tips = []

    for challenge in challenges[:3]:  # Top 3 challenges
        dim = challenge.get('dimension', '')

        tip_map = {
            'openness': 'Take turns choosing activities - mix familiar with new',
            'conscientiousness': 'Agree on shared systems while respecting different styles',
            'extraversion': 'Schedule both social time and quiet time intentionally',
            'agreeableness': 'Practice "I feel" statements and active listening',
            'neuroticism': 'Develop signals for when one needs extra support',
            'emotional_intensity': 'Check in regularly about emotional needs',
            'insightful': 'Set aside dedicated time for deeper conversations',
            'nurturing': 'Learn each other\'s love languages'
        }

        if dim in tip_map:
            tips.append(tip_map[dim])

    if not tips:
        tips.append('Focus on celebrating your strengths while being patient with differences')

    return tips


def compute_luna_adaptation(user_vector: np.ndarray,
                            luna_preset: Dict) -> Dict:
    """
    Compute how Luna should adapt her personality for a specific user.

    Combines preset base with user-specific adjustments.

    Args:
        user_vector: User's personality vector
        luna_preset: Luna's preset configuration (from constants)

    Returns:
        Adapted Luna configuration
    """
    # Get preset adjustments
    preset_adjustments = luna_preset.get('tone_adjustments', {})

    # Calculate user-specific behavioral adjustments
    # Use a neutral Luna base for this calculation
    luna_base = create_zero_vector() + 0.5  # Neutral starting point
    preset_facets = luna_preset.get('facet_mods', {})
    for facet, value in preset_facets.items():
        if facet in FACET_SHORT_CODES:
            luna_base[FACET_SHORT_CODES[facet]] = value

    user_adjustments = get_behavioral_adjustments(user_vector, luna_base)

    # Blend preset with user adjustments (preset as base, user modifies)
    final_adjustments = {}
    for key in set(list(preset_adjustments.keys()) + list(user_adjustments.keys())):
        preset_val = preset_adjustments.get(key, 0.5)
        user_val = user_adjustments.get(key, 0.0)

        # User adjustment modifies preset (capped influence)
        final_adjustments[key] = round(np.clip(preset_val + user_val * 0.3, 0.0, 1.0), 3)

    return {
        'preset_name': luna_preset.get('name', 'Custom'),
        'description': luna_preset.get('description', ''),
        'base_adjustments': preset_adjustments,
        'user_adjustments': user_adjustments,
        'final_adjustments': final_adjustments
    }
