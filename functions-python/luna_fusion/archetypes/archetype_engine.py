"""
P7 Archetypal Narrative Layer
30-facet vector → 12 Jungian archetypes

Maps personality vectors to archetypal patterns using cosine similarity,
returning dominant archetypes with scores and narrative descriptions.
"""

import numpy as np
from typing import Dict, List, Optional, Tuple

from ..core.constants import DIMENSIONS_30, FACET_SHORT_CODES
from ..core.vector_utils import cosine_similarity, create_zero_vector


# ============================================
# 12 JUNGIAN ARCHETYPES
# ============================================
# Each archetype defined by 30-facet signature vector

ARCHETYPES = {
    'Hero': {
        'description': 'The courageous warrior who overcomes challenges',
        'core_traits': 'Brave, determined, achievement-driven, protective',
        'shadow': 'Arrogance, ruthlessness, need to prove worth',
        'motto': 'Where there\'s a will, there\'s a way'
    },
    'Caregiver': {
        'description': 'The nurturing protector who helps others',
        'core_traits': 'Compassionate, generous, protective, selfless',
        'shadow': 'Martyrdom, enabling, manipulation through guilt',
        'motto': 'Love your neighbor as yourself'
    },
    'Creator': {
        'description': 'The imaginative innovator who brings vision to life',
        'core_traits': 'Creative, artistic, visionary, non-conforming',
        'shadow': 'Perfectionism, impracticality, drama',
        'motto': 'If it can be imagined, it can be created'
    },
    'Sage': {
        'description': 'The wise truth-seeker who understands deeply',
        'core_traits': 'Wise, analytical, knowledgeable, thoughtful',
        'shadow': 'Disconnection, dogmatism, ivory tower isolation',
        'motto': 'The truth will set you free'
    },
    'Lover': {
        'description': 'The passionate romantic who seeks intimacy',
        'core_traits': 'Passionate, committed, appreciative, sensual',
        'shadow': 'Obsession, jealousy, loss of identity',
        'motto': 'You\'re the only one'
    },
    'Magician': {
        'description': 'The transformative visionary who makes things happen',
        'core_traits': 'Transformative, visionary, charismatic, catalytic',
        'shadow': 'Manipulation, disconnection from reality',
        'motto': 'I make things happen'
    },
    'Ruler': {
        'description': 'The authoritative leader who takes charge',
        'core_traits': 'Responsible, organized, authoritative, decisive',
        'shadow': 'Tyranny, rigidity, controlling behavior',
        'motto': 'Power isn\'t everything, it\'s the only thing'
    },
    'Rebel': {
        'description': 'The revolutionary who disrupts the status quo',
        'core_traits': 'Radical, free-thinking, disruptive, independent',
        'shadow': 'Self-destruction, anarchy for its own sake',
        'motto': 'Rules are made to be broken'
    },
    'Explorer': {
        'description': 'The adventurous seeker who discovers new paths',
        'core_traits': 'Adventurous, independent, pioneering, restless',
        'shadow': 'Aimlessness, inability to commit, chronic dissatisfaction',
        'motto': 'Don\'t fence me in'
    },
    'Innocent': {
        'description': 'The optimistic believer who sees the good',
        'core_traits': 'Optimistic, trusting, pure, faithful',
        'shadow': 'Naivety, denial, dependence on others',
        'motto': 'Free to be you and me'
    },
    'Jester': {
        'description': 'The playful spirit who brings joy and humor',
        'core_traits': 'Joyful, humorous, playful, irreverent',
        'shadow': 'Frivolity, irresponsibility, cruelty in humor',
        'motto': 'You only live once'
    },
    'Orphan': {
        'description': 'The resilient survivor who connects through shared struggles',
        'core_traits': 'Resilient, empathetic, realistic, grounded',
        'shadow': 'Victimhood, cynicism, chronic complaint',
        'motto': 'All people are created equal'
    }
}


# ============================================
# ARCHETYPE SIGNATURE VECTORS
# ============================================
# 30-facet signatures for each archetype (cosine similarity targets)

ARCHETYPE_SIGNATURES = {
    'Hero': np.array([
        # N: Low anxiety, moderate hostility (fighting spirit), low depression
        0.30, 0.50, 0.25, 0.30, 0.45, 0.35,
        # E: High warmth (protective), moderate gregarious, HIGH assertive, HIGH activity
        0.70, 0.55, 0.90, 0.85, 0.65, 0.70,
        # O: Moderate fantasy, moderate aesthetics, high feelings, HIGH actions, moderate ideas
        0.50, 0.45, 0.65, 0.85, 0.55, 0.60,
        # A: High trust (in self), moderate straightforward, high altruism (protective)
        0.65, 0.70, 0.75, 0.55, 0.40, 0.65,
        # C: HIGH competence, high order, high dutifulness, HIGH achievement, HIGH discipline
        0.90, 0.70, 0.75, 0.90, 0.85, 0.70
    ]),

    'Caregiver': np.array([
        # N: Moderate anxiety (worry for others), low hostility, low depression, high vulnerability (empathy)
        0.45, 0.25, 0.35, 0.50, 0.40, 0.65,
        # E: HIGH warmth, moderate gregarious, moderate assertive, moderate activity, moderate excitement, HIGH positive
        0.90, 0.60, 0.50, 0.55, 0.40, 0.80,
        # O: Moderate fantasy, moderate aesthetics, HIGH feelings, moderate actions
        0.50, 0.55, 0.85, 0.50, 0.45, 0.65,
        # A: HIGH trust, HIGH straightforward, HIGH altruism, HIGH compliance, HIGH modesty, HIGH tender
        0.85, 0.80, 0.95, 0.75, 0.75, 0.95,
        # C: High competence, moderate order, HIGH dutifulness, moderate achievement, high discipline
        0.75, 0.60, 0.85, 0.55, 0.70, 0.65
    ]),

    'Creator': np.array([
        # N: Moderate anxiety (artistic temperament), moderate hostility, moderate depression (depth)
        0.50, 0.45, 0.55, 0.55, 0.55, 0.60,
        # E: Moderate warmth, low-moderate gregarious (introverted creative), moderate assertive
        0.55, 0.40, 0.55, 0.50, 0.60, 0.65,
        # O: HIGH fantasy, HIGH aesthetics, HIGH feelings, HIGH actions (creative risks), HIGH ideas
        0.95, 0.95, 0.85, 0.80, 0.90, 0.75,
        # A: Moderate trust, moderate straightforward, moderate altruism, LOW compliance (non-conforming)
        0.55, 0.50, 0.55, 0.30, 0.50, 0.60,
        # C: Moderate-low (free-spirited), except HIGH achievement striving for creative goals
        0.60, 0.40, 0.50, 0.75, 0.55, 0.45
    ]),

    'Sage': np.array([
        # N: Low-moderate anxiety, low hostility, low depression, moderate vulnerability
        0.35, 0.30, 0.30, 0.40, 0.30, 0.45,
        # E: Moderate warmth (teaching), low gregarious (contemplative), moderate assertive
        0.55, 0.35, 0.55, 0.40, 0.30, 0.55,
        # O: Moderate fantasy, moderate aesthetics, high feelings, moderate actions, HIGH ideas, HIGH values
        0.55, 0.60, 0.70, 0.50, 0.95, 0.90,
        # A: High trust (in truth), high straightforward, moderate altruism
        0.70, 0.80, 0.60, 0.60, 0.55, 0.65,
        # C: HIGH competence, high order, high dutifulness, moderate achievement, high discipline, HIGH deliberation
        0.85, 0.70, 0.75, 0.60, 0.75, 0.95
    ]),

    'Lover': np.array([
        # N: Moderate anxiety, low hostility, moderate depression (romantic melancholy), HIGH vulnerability
        0.50, 0.30, 0.50, 0.55, 0.50, 0.80,
        # E: HIGH warmth, HIGH gregarious, moderate assertive, moderate activity, high excitement, HIGH positive
        0.95, 0.75, 0.50, 0.55, 0.70, 0.90,
        # O: High fantasy, HIGH aesthetics, HIGH feelings, moderate actions
        0.75, 0.90, 0.95, 0.55, 0.55, 0.70,
        # A: HIGH trust, moderate straightforward, HIGH altruism, high compliance, moderate modesty, HIGH tender
        0.90, 0.60, 0.85, 0.70, 0.55, 0.90,
        # C: Moderate (passion over practicality)
        0.55, 0.50, 0.60, 0.55, 0.50, 0.45
    ]),

    'Magician': np.array([
        # N: Low anxiety, low hostility, low depression
        0.30, 0.35, 0.30, 0.35, 0.40, 0.40,
        # E: High warmth (charisma), moderate gregarious, HIGH assertive, HIGH activity, HIGH excitement
        0.75, 0.60, 0.85, 0.80, 0.75, 0.75,
        # O: HIGH fantasy (vision), high aesthetics, high feelings, HIGH actions, HIGH ideas
        0.85, 0.70, 0.75, 0.90, 0.90, 0.80,
        # A: Moderate (independent operator)
        0.55, 0.55, 0.55, 0.45, 0.45, 0.55,
        # C: HIGH competence, moderate order, moderate duty, HIGH achievement, HIGH discipline
        0.90, 0.55, 0.55, 0.85, 0.80, 0.70
    ]),

    'Ruler': np.array([
        # N: Low anxiety, moderate hostility (asserting dominance), low depression
        0.25, 0.50, 0.25, 0.30, 0.35, 0.30,
        # E: High warmth (leadership), high gregarious, HIGH assertive, HIGH activity
        0.70, 0.70, 0.95, 0.85, 0.55, 0.65,
        # O: Low-moderate (traditional/conventional), except actions (decisive)
        0.40, 0.45, 0.50, 0.75, 0.55, 0.50,
        # A: Moderate trust, high straightforward, moderate altruism, LOW compliance (gives orders)
        0.60, 0.75, 0.55, 0.25, 0.30, 0.50,
        # C: HIGH competence, HIGH order, HIGH dutifulness, HIGH achievement, HIGH discipline, HIGH deliberation
        0.95, 0.90, 0.85, 0.90, 0.90, 0.85
    ]),

    'Rebel': np.array([
        # N: Moderate anxiety, HIGH hostility (anger at injustice), moderate depression
        0.50, 0.75, 0.45, 0.45, 0.65, 0.50,
        # E: Moderate warmth, moderate gregarious, HIGH assertive, HIGH activity, HIGH excitement
        0.50, 0.55, 0.85, 0.80, 0.90, 0.60,
        # O: High fantasy, moderate aesthetics, high feelings, HIGH actions, high ideas, HIGH values (own values)
        0.70, 0.55, 0.70, 0.95, 0.75, 0.85,
        # A: Low trust (of authority), low straightforward, moderate altruism, VERY LOW compliance
        0.35, 0.40, 0.55, 0.10, 0.30, 0.45,
        # C: LOW order (anti-structure), but high achievement striving (for causes)
        0.55, 0.25, 0.40, 0.70, 0.45, 0.35
    ]),

    'Explorer': np.array([
        # N: Low anxiety, low hostility, low depression
        0.30, 0.35, 0.30, 0.35, 0.50, 0.40,
        # E: Moderate warmth, moderate gregarious, high assertive, HIGH activity, HIGH excitement, high positive
        0.55, 0.50, 0.70, 0.90, 0.95, 0.75,
        # O: HIGH fantasy (imagination), high aesthetics, high feelings, HIGH actions, high ideas
        0.85, 0.70, 0.70, 0.95, 0.75, 0.70,
        # A: Moderate trust, moderate straightforward, moderate altruism, LOW compliance (freedom)
        0.55, 0.55, 0.50, 0.30, 0.45, 0.50,
        # C: LOW-moderate (resists routine)
        0.55, 0.30, 0.40, 0.55, 0.40, 0.35
    ]),

    'Innocent': np.array([
        # N: LOW anxiety, LOW hostility, LOW depression, moderate vulnerability
        0.25, 0.20, 0.25, 0.35, 0.40, 0.50,
        # E: HIGH warmth, high gregarious, low assertive, moderate activity, moderate excitement, HIGH positive
        0.85, 0.70, 0.35, 0.55, 0.50, 0.95,
        # O: Moderate-low (traditional worldview)
        0.50, 0.55, 0.60, 0.45, 0.40, 0.55,
        # A: HIGH trust, HIGH straightforward, HIGH altruism, HIGH compliance, HIGH modesty, HIGH tender
        0.95, 0.85, 0.85, 0.80, 0.80, 0.90,
        # C: Moderate (follows rules naturally)
        0.60, 0.60, 0.70, 0.50, 0.55, 0.55
    ]),

    'Jester': np.array([
        # N: LOW anxiety, low hostility, LOW depression, low vulnerability
        0.25, 0.35, 0.20, 0.35, 0.60, 0.35,
        # E: HIGH warmth, HIGH gregarious, moderate assertive, HIGH activity, HIGH excitement, HIGH positive
        0.85, 0.90, 0.55, 0.80, 0.90, 0.95,
        # O: HIGH fantasy (imagination), moderate aesthetics, high feelings, high actions
        0.90, 0.60, 0.70, 0.80, 0.60, 0.55,
        # A: High trust, moderate straightforward (trickster), moderate altruism, low compliance
        0.75, 0.50, 0.60, 0.35, 0.50, 0.65,
        # C: LOW (spontaneous, lives in moment)
        0.45, 0.30, 0.35, 0.40, 0.30, 0.25
    ]),

    'Orphan': np.array([
        # N: HIGH anxiety, moderate hostility, HIGH depression, HIGH vulnerability
        0.70, 0.50, 0.65, 0.65, 0.50, 0.80,
        # E: Moderate warmth, moderate gregarious (seeks connection), low assertive
        0.55, 0.55, 0.35, 0.45, 0.35, 0.45,
        # O: Moderate (realistic worldview)
        0.45, 0.45, 0.65, 0.40, 0.45, 0.55,
        # A: Moderate trust (cautious), high straightforward, moderate altruism, high modesty
        0.45, 0.65, 0.60, 0.55, 0.75, 0.70,
        # C: Moderate (survivor pragmatism)
        0.55, 0.50, 0.55, 0.50, 0.55, 0.50
    ])
}


# ============================================
# MAIN FUNCTIONS
# ============================================

def vector_to_archetypes(personality_vector: np.ndarray) -> Dict[str, float]:
    """
    Calculate archetype scores for a personality vector.

    Uses cosine similarity between personality vector and archetype signatures.

    Args:
        personality_vector: 30-facet NEO PI-R vector

    Returns:
        Dict mapping archetype names to similarity scores (0-1)
    """
    scores = {}

    for archetype_name, signature in ARCHETYPE_SIGNATURES.items():
        similarity = cosine_similarity(personality_vector, signature)
        # Normalize to 0-1 range (cosine can be negative)
        normalized_score = (similarity + 1) / 2
        scores[archetype_name] = round(normalized_score, 4)

    return scores


def get_dominant_archetypes(personality_vector: np.ndarray,
                            top_n: int = 3) -> List[Dict]:
    """
    Get the top N dominant archetypes for a personality.

    Args:
        personality_vector: 30-facet NEO PI-R vector
        top_n: Number of top archetypes to return

    Returns:
        List of dicts with archetype info, sorted by score
    """
    scores = vector_to_archetypes(personality_vector)

    # Sort by score descending
    sorted_archetypes = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    results = []
    for name, score in sorted_archetypes[:top_n]:
        archetype_info = ARCHETYPES.get(name, {})
        results.append({
            'archetype': name,
            'score': score,
            'description': archetype_info.get('description', ''),
            'core_traits': archetype_info.get('core_traits', ''),
            'shadow': archetype_info.get('shadow', ''),
            'motto': archetype_info.get('motto', '')
        })

    return results


def get_archetype_profile(personality_vector: np.ndarray) -> Dict:
    """
    Generate full archetype profile for a personality.

    Args:
        personality_vector: 30-facet NEO PI-R vector

    Returns:
        Complete archetype analysis
    """
    all_scores = vector_to_archetypes(personality_vector)
    dominant = get_dominant_archetypes(personality_vector, top_n=3)

    # Identify archetype categories
    high_archetypes = [k for k, v in all_scores.items() if v >= 0.7]
    moderate_archetypes = [k for k, v in all_scores.items() if 0.5 <= v < 0.7]
    low_archetypes = [k for k, v in all_scores.items() if v < 0.5]

    # Calculate archetype blend description
    blend = _describe_archetype_blend(dominant)

    return {
        'dominant_archetypes': dominant,
        'all_scores': all_scores,
        'high_archetypes': high_archetypes,
        'moderate_archetypes': moderate_archetypes,
        'low_archetypes': low_archetypes,
        'blend_description': blend,
        'primary_archetype': dominant[0]['archetype'] if dominant else None,
        'secondary_archetype': dominant[1]['archetype'] if len(dominant) > 1 else None,
        'tertiary_archetype': dominant[2]['archetype'] if len(dominant) > 2 else None
    }


def _describe_archetype_blend(dominant: List[Dict]) -> str:
    """Generate a description of the archetype blend."""
    if not dominant:
        return "Balanced personality with no strongly dominant archetype"

    primary = dominant[0]
    primary_name = primary['archetype']
    primary_score = primary['score']

    if len(dominant) == 1 or primary_score > 0.85:
        return f"Strongly {primary_name}: {primary['description']}"

    secondary = dominant[1]
    secondary_name = secondary['archetype']

    # Check for complementary or contrasting archetypes
    if primary_score - secondary['score'] < 0.1:
        # Close scores - true blend
        return f"{primary_name}-{secondary_name} blend: Combining {_get_trait_words(primary_name)} with {_get_trait_words(secondary_name)}"
    else:
        # Primary with secondary influence
        return f"Primarily {primary_name} with {secondary_name} influences: {primary['description']}, colored by {_get_trait_words(secondary_name)}"


def _get_trait_words(archetype: str) -> str:
    """Get key trait words for an archetype."""
    trait_words = {
        'Hero': 'courage and determination',
        'Caregiver': 'nurturing and compassion',
        'Creator': 'creativity and vision',
        'Sage': 'wisdom and insight',
        'Lover': 'passion and connection',
        'Magician': 'transformation and power',
        'Ruler': 'leadership and structure',
        'Rebel': 'independence and disruption',
        'Explorer': 'adventure and freedom',
        'Innocent': 'optimism and trust',
        'Jester': 'joy and spontaneity',
        'Orphan': 'resilience and empathy'
    }
    return trait_words.get(archetype, archetype.lower())


def calculate_archetype_compatibility(archetypes1: Dict[str, float],
                                      archetypes2: Dict[str, float]) -> Dict:
    """
    Calculate archetype-based compatibility between two profiles.

    Args:
        archetypes1: First person's archetype scores
        archetypes2: Second person's archetype scores

    Returns:
        Compatibility analysis
    """
    # Convert to vectors for comparison
    vec1 = np.array([archetypes1.get(arch, 0) for arch in ARCHETYPE_SIGNATURES.keys()])
    vec2 = np.array([archetypes2.get(arch, 0) for arch in ARCHETYPE_SIGNATURES.keys()])

    similarity = cosine_similarity(vec1, vec2)

    # Identify shared strong archetypes
    shared_strong = []
    for arch in ARCHETYPE_SIGNATURES.keys():
        if archetypes1.get(arch, 0) > 0.6 and archetypes2.get(arch, 0) > 0.6:
            shared_strong.append(arch)

    # Identify complementary archetypes
    complementary = _find_complementary_archetypes(archetypes1, archetypes2)

    return {
        'similarity_score': round((similarity + 1) / 2, 3),
        'shared_archetypes': shared_strong,
        'complementary_archetypes': complementary,
        'analysis': _generate_archetype_compatibility_analysis(
            archetypes1, archetypes2, shared_strong, complementary
        )
    }


def _find_complementary_archetypes(arch1: Dict, arch2: Dict) -> List[Tuple[str, str]]:
    """Find complementary archetype pairs."""
    # Archetypal complementary pairs
    complements = [
        ('Hero', 'Caregiver'),      # Protector + Nurturer
        ('Sage', 'Creator'),        # Knowledge + Innovation
        ('Ruler', 'Rebel'),         # Order + Change (dynamic tension)
        ('Explorer', 'Innocent'),   # Adventure + Trust
        ('Magician', 'Orphan'),     # Power + Humility
        ('Lover', 'Jester')         # Depth + Lightness
    ]

    found = []
    for c1, c2 in complements:
        if (arch1.get(c1, 0) > 0.6 and arch2.get(c2, 0) > 0.6):
            found.append((c1, c2))
        elif (arch1.get(c2, 0) > 0.6 and arch2.get(c1, 0) > 0.6):
            found.append((c2, c1))

    return found


def _generate_archetype_compatibility_analysis(arch1: Dict, arch2: Dict,
                                               shared: List, complementary: List) -> str:
    """Generate analysis text for archetype compatibility."""
    parts = []

    if shared:
        parts.append(f"Shared archetypal energy: {', '.join(shared)}")

    if complementary:
        comp_str = [f"{c[0]}/{c[1]}" for c in complementary]
        parts.append(f"Complementary dynamics: {', '.join(comp_str)}")

    if not parts:
        parts.append("Different archetypal orientations - potential for growth through difference")

    return '. '.join(parts)
