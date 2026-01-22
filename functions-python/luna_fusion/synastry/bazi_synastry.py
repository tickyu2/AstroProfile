"""
BaZi Synastry Engine
Pillar-to-pillar compatibility analysis for Chinese metaphysics.

This module implements:
1. Branch interaction detection (六合, 三合, 沖, 害, 刑)
2. Synastry matrix generation (5x5 pillar comparison)
3. Relationship axes scoring
4. BaZi-specific compatibility insights

References:
- Liu He (六合): Six Harmonies
- San He (三合): Three Harmonies (Seasonal Trines)
- Chong (沖): Six Clashes
- Hai (害): Six Harms
- Xing (刑): Three Punishments
- He (合): General Combinations
"""

from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass
import sys
import os

# Add parent path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from bazi_engine.utils import (
    HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_MAP, PRODUCES, CONTROLS
)


# ============================================
# BRANCH INTERACTION CONSTANTS
# ============================================

# 六合 Liu He - Six Harmonies (pairs that combine)
LIU_HE_PAIRS = {
    ("Zi", "Chou"): "Earth",   # 子丑合土
    ("Yin", "Hai"): "Wood",    # 寅亥合木
    ("Mao", "Xu"): "Fire",     # 卯戌合火
    ("Chen", "You"): "Metal",  # 辰酉合金
    ("Si", "Shen"): "Water",   # 巳申合水
    ("Wu", "Wei"): "Fire",     # 午未合火
}

# 三合 San He - Three Harmonies (Seasonal Trines)
SAN_HE_GROUPS = {
    "Water": ("Shen", "Zi", "Chen"),  # 申子辰 Water Frame
    "Wood": ("Hai", "Mao", "Wei"),    # 亥卯未 Wood Frame
    "Fire": ("Yin", "Wu", "Xu"),      # 寅午戌 Fire Frame
    "Metal": ("Si", "You", "Chou"),   # 巳酉丑 Metal Frame
}

# Inverse lookup for San He
SAN_HE_BRANCH_TO_ELEMENT = {}
for element, branches in SAN_HE_GROUPS.items():
    for b in branches:
        SAN_HE_BRANCH_TO_ELEMENT[b] = element

# 沖 Chong - Six Clashes (opposite branches)
CHONG_PAIRS = {
    "Zi": "Wu",    # 子午沖
    "Chou": "Wei", # 丑未沖
    "Yin": "Shen", # 寅申沖
    "Mao": "You",  # 卯酉沖
    "Chen": "Xu",  # 辰戌沖
    "Si": "Hai",   # 巳亥沖
}

# 害 Hai - Six Harms
HAI_PAIRS = {
    ("Zi", "Wei"): "Harm of Resentment",     # 子未害
    ("Chou", "Wu"): "Harm of Conflict",      # 丑午害
    ("Yin", "Si"): "Harm of Punishment",     # 寅巳害
    ("Mao", "Chen"): "Harm of Ungrateful",   # 卯辰害
    ("Shen", "Hai"): "Harm of Rivalry",      # 申亥害
    ("You", "Xu"): "Harm of Jealousy",       # 酉戌害
}

# 刑 Xing - Three Punishments (三刑)
XING_GROUPS = {
    "Ungrateful": ("Yin", "Si", "Shen"),    # 寅巳申 - 恃势之刑
    "Uncivilized": ("Chou", "Xu", "Wei"),   # 丑戌未 - 无恩之刑
    "Self": ("Chen", "Wu", "You", "Hai"),   # 辰午酉亥 - 自刑
}

# Reverse lookup for Xing
XING_BRANCH_TO_GROUP = {}
for group_name, branches in XING_GROUPS.items():
    for b in branches:
        if b not in XING_BRANCH_TO_GROUP:
            XING_BRANCH_TO_GROUP[b] = []
        XING_BRANCH_TO_GROUP[b].append(group_name)


# ============================================
# BRANCH INTERACTION DETECTION FUNCTIONS
# ============================================

def is_liu_he(branch1: str, branch2: str) -> Tuple[bool, Optional[str]]:
    """
    Check if two branches form Liu He (六合 Six Harmonies).

    Returns:
        Tuple of (is_liu_he, resulting_element)
    """
    pair = (branch1, branch2)
    reverse_pair = (branch2, branch1)

    if pair in LIU_HE_PAIRS:
        return (True, LIU_HE_PAIRS[pair])
    if reverse_pair in LIU_HE_PAIRS:
        return (True, LIU_HE_PAIRS[reverse_pair])
    return (False, None)


def is_san_he(branch1: str, branch2: str) -> Tuple[bool, Optional[str]]:
    """
    Check if two branches share a San He (三合 Three Harmonies) frame.

    Note: Full San He requires all 3 branches, but partial (2/3)
    still shows affinity.

    Returns:
        Tuple of (shares_san_he_frame, element)
    """
    elem1 = SAN_HE_BRANCH_TO_ELEMENT.get(branch1)
    elem2 = SAN_HE_BRANCH_TO_ELEMENT.get(branch2)

    if elem1 and elem2 and elem1 == elem2 and branch1 != branch2:
        return (True, elem1)
    return (False, None)


def is_chong(branch1: str, branch2: str) -> bool:
    """
    Check if two branches form Chong (沖 Clash).

    Clashes are opposites in the 12-branch cycle.
    """
    if CHONG_PAIRS.get(branch1) == branch2:
        return True
    if CHONG_PAIRS.get(branch2) == branch1:
        return True
    return False


def is_hai(branch1: str, branch2: str) -> Tuple[bool, Optional[str]]:
    """
    Check if two branches form Hai (害 Harm).

    Returns:
        Tuple of (is_harm, harm_type)
    """
    pair = (branch1, branch2)
    reverse_pair = (branch2, branch1)

    if pair in HAI_PAIRS:
        return (True, HAI_PAIRS[pair])
    if reverse_pair in HAI_PAIRS:
        return (True, HAI_PAIRS[reverse_pair])
    return (False, None)


def is_xing(branch1: str, branch2: str) -> Tuple[bool, Optional[str]]:
    """
    Check if two branches form Xing (刑 Punishment).

    Returns:
        Tuple of (is_punishment, punishment_type)
    """
    # Check if both branches are in the same Xing group
    groups1 = XING_BRANCH_TO_GROUP.get(branch1, [])
    groups2 = XING_BRANCH_TO_GROUP.get(branch2, [])

    # Find common groups (both branches in same punishment group)
    common = set(groups1) & set(groups2)

    if common and branch1 != branch2:
        return (True, list(common)[0])

    # Self-punishment check (same branch)
    if branch1 == branch2 and "Self" in groups1:
        return (True, "Self")

    return (False, None)


def produces(element1: str, element2: str) -> bool:
    """Check if element1 produces element2."""
    return PRODUCES.get(element1) == element2


def controls(element1: str, element2: str) -> bool:
    """Check if element1 controls element2."""
    return CONTROLS.get(element1) == element2


def get_branch_element(branch: str) -> str:
    """Get the primary element of an Earthly Branch."""
    BRANCH_ELEMENT = {
        "Zi": "Water", "Chou": "Earth", "Yin": "Wood", "Mao": "Wood",
        "Chen": "Earth", "Si": "Fire", "Wu": "Fire", "Wei": "Earth",
        "Shen": "Metal", "You": "Metal", "Xu": "Earth", "Hai": "Water"
    }
    return BRANCH_ELEMENT.get(branch, "")


# ============================================
# SYNASTRY MATRIX GENERATION
# ============================================

@dataclass
class SynastryCell:
    """A single cell in the synastry matrix."""
    interaction: str     # "harmony", "trine", "combination", "clash", "harm", "punishment", "neutral"
    score: int           # -10 to +10
    explanation: str
    pillar_a: str
    pillar_b: str
    branch_a: str
    branch_b: str


def analyze_branch_interaction(branch_a: str, branch_b: str) -> Tuple[str, int, str]:
    """
    Analyze the interaction between two branches.

    Returns:
        Tuple of (interaction_type, score, explanation)
    """
    # Check San He (三合) - Seasonal Trine (+10)
    is_sh, sh_elem = is_san_he(branch_a, branch_b)
    if is_sh:
        return ("trine", 10, f"{branch_a}-{branch_b} form {sh_elem} San He (三合)")

    # Check Liu He (六合) - Six Harmonies (+8)
    is_lh, lh_elem = is_liu_he(branch_a, branch_b)
    if is_lh:
        return ("harmony", 8, f"{branch_a}-{branch_b} form {lh_elem} Liu He (六合)")

    # Check Chong (沖) - Clash (-10)
    if is_chong(branch_a, branch_b):
        return ("clash", -10, f"{branch_a}-{branch_b} form Chong (沖) clash")

    # Check Hai (害) - Harm (-6)
    is_h, h_type = is_hai(branch_a, branch_b)
    if is_h:
        return ("harm", -6, f"{branch_a}-{branch_b} form Hai (害): {h_type}")

    # Check Xing (刑) - Punishment (-4)
    is_x, x_type = is_xing(branch_a, branch_b)
    if is_x:
        return ("punishment", -4, f"{branch_a}-{branch_b} form Xing (刑): {x_type}")

    # Neutral
    return ("neutral", 0, f"{branch_a}-{branch_b}: neutral interaction")


def calculate_elemental_modifier(element_a: str, element_b: str) -> int:
    """
    Calculate elemental support/control modifier.

    Returns:
        Score modifier (-3 to +6)
    """
    modifier = 0

    # Check if A produces B
    if produces(element_a, element_b):
        modifier += 3

    # Check if B produces A
    if produces(element_b, element_a):
        modifier += 3

    # Check if A controls B (weakens B)
    if controls(element_a, element_b):
        modifier -= 3

    # Check if B controls A (weakens A)
    if controls(element_b, element_a):
        modifier -= 3

    return modifier


def synastry_matrix(chart_a: Dict, chart_b: Dict) -> List[List[Dict]]:
    """
    Generate a 5x5 synastry matrix comparing two BaZi charts.

    Compares: Year, Month, Day, Hour pillars + Day Master

    Args:
        chart_a: First person's BaZi chart (from analyze_bazi)
        chart_b: Second person's BaZi chart

    Returns:
        5x5 matrix of SynastryCell data
    """
    pillars_a = chart_a.get("pillars_dict", {})
    pillars_b = chart_b.get("pillars_dict", {})

    # Add Day Master as pseudo-pillar
    dm_a = chart_a.get("day_master", {})
    dm_b = chart_b.get("day_master", {})

    pillars_a["dm"] = {
        "branch": dm_a.get("branch", ""),
        "element": dm_a.get("element", ""),
        "stem": dm_a.get("stem", "")
    }
    pillars_b["dm"] = {
        "branch": dm_b.get("branch", ""),
        "element": dm_b.get("element", ""),
        "stem": dm_b.get("stem", "")
    }

    pillar_order = ["year", "month", "day", "hour", "dm"]
    matrix = []

    for pA in pillar_order:
        row = []
        for pB in pillar_order:
            # Get pillar data
            pillar_data_a = pillars_a.get(pA, {})
            pillar_data_b = pillars_b.get(pB, {})

            branch_a = pillar_data_a.get("branch", "") if isinstance(pillar_data_a, dict) else pillar_data_a[1] if isinstance(pillar_data_a, (list, tuple)) else ""
            branch_b = pillar_data_b.get("branch", "") if isinstance(pillar_data_b, dict) else pillar_data_b[1] if isinstance(pillar_data_b, (list, tuple)) else ""

            # Skip if missing data
            if not branch_a or not branch_b:
                row.append({
                    "interaction": "unknown",
                    "score": 0,
                    "explanation": f"Missing branch data for {pA} or {pB}",
                    "pillar_a": pA,
                    "pillar_b": pB,
                    "branch_a": branch_a,
                    "branch_b": branch_b
                })
                continue

            # Analyze branch interaction
            interaction, score, explanation = analyze_branch_interaction(branch_a, branch_b)

            # Apply elemental modifier
            elem_a = get_branch_element(branch_a)
            elem_b = get_branch_element(branch_b)
            elem_modifier = calculate_elemental_modifier(elem_a, elem_b)
            score += elem_modifier

            if elem_modifier > 0:
                explanation += f" (+{elem_modifier} elemental support)"
            elif elem_modifier < 0:
                explanation += f" ({elem_modifier} elemental control)"

            row.append({
                "interaction": interaction,
                "score": score,
                "explanation": explanation,
                "pillar_a": pA,
                "pillar_b": pB,
                "branch_a": branch_a,
                "branch_b": branch_b,
                "element_a": elem_a,
                "element_b": elem_b
            })

        matrix.append(row)

    return matrix


def synastry_insights(matrix: List[List[Dict]]) -> Dict:
    """
    Generate insights from synastry matrix.

    Returns:
        Dict with overall_pattern, strongest_support, strongest_challenges
    """
    all_cells = [cell for row in matrix for cell in row]

    # Sort by score
    sorted_cells = sorted(all_cells, key=lambda x: x.get("score", 0), reverse=True)

    # Calculate totals
    total_score = sum(cell.get("score", 0) for cell in all_cells)
    positive_count = sum(1 for cell in all_cells if cell.get("score", 0) > 0)
    negative_count = sum(1 for cell in all_cells if cell.get("score", 0) < 0)

    # Overall pattern
    if total_score > 50:
        pattern = "Highly harmonious - natural flow and mutual support"
    elif total_score > 20:
        pattern = "Generally supportive - good foundation with minor friction"
    elif total_score > -20:
        pattern = "Mixed dynamics - balance of harmony and challenge"
    elif total_score > -50:
        pattern = "Challenging - requires conscious effort and understanding"
    else:
        pattern = "Significant friction - deep work needed for harmony"

    # Get top 3 supports and challenges
    supports = [c for c in sorted_cells if c.get("score", 0) > 0][:3]
    challenges = [c for c in reversed(sorted_cells) if c.get("score", 0) < 0][:3]

    return {
        "total_score": total_score,
        "positive_interactions": positive_count,
        "negative_interactions": negative_count,
        "overall_pattern": pattern,
        "strongest_support": [
            {
                "pillars": f"{s['pillar_a'].title()} <-> {s['pillar_b'].title()}",
                "type": s.get("interaction", ""),
                "score": s.get("score", 0),
                "explanation": s.get("explanation", "")
            }
            for s in supports
        ],
        "strongest_challenges": [
            {
                "pillars": f"{c['pillar_a'].title()} <-> {c['pillar_b'].title()}",
                "type": c.get("interaction", ""),
                "score": c.get("score", 0),
                "explanation": c.get("explanation", "")
            }
            for c in challenges
        ]
    }


def explain_synastry_cell(pillar_a: str, pillar_b: str,
                          interaction: str, score: int) -> str:
    """
    Generate detailed explanation for a synastry cell.
    """
    pillar_meanings = {
        "year": "social circles, parents, early life",
        "month": "career, ambitions, relationships with siblings",
        "day": "self, spouse, inner character",
        "hour": "children, legacy, later life",
        "dm": "core identity, Day Master"
    }

    meaning_a = pillar_meanings.get(pillar_a, pillar_a)
    meaning_b = pillar_meanings.get(pillar_b, pillar_b)

    interaction_descriptions = {
        "trine": f"natural flow and mutual support between your {meaning_a} and their {meaning_b}",
        "harmony": f"harmonious blending between your {meaning_a} and their {meaning_b}",
        "combination": f"strong bonding energy between your {meaning_a} and their {meaning_b}",
        "clash": f"dynamic tension between your {meaning_a} and their {meaning_b}",
        "harm": f"subtle friction between your {meaning_a} and their {meaning_b}",
        "punishment": f"karmic lessons connected to your {meaning_a} and their {meaning_b}",
        "neutral": f"independent energies between your {meaning_a} and their {meaning_b}"
    }

    return interaction_descriptions.get(interaction, f"Interaction between {pillar_a} and {pillar_b}")


# ============================================
# RELATIONSHIP AXES SCORING
# ============================================

RELATIONSHIP_AXES = {
    "elemental_harmony": {
        "weight": 0.25,
        "description": "How well your elemental compositions support each other"
    },
    "day_master_affinity": {
        "weight": 0.20,
        "description": "Core identity compatibility between Day Masters"
    },
    "emotional_connection": {
        "weight": 0.20,
        "description": "Depth of emotional and intuitive understanding"
    },
    "practical_alignment": {
        "weight": 0.15,
        "description": "Shared approach to daily life and responsibilities"
    },
    "growth_potential": {
        "weight": 0.10,
        "description": "Opportunities for mutual growth and development"
    },
    "timing_resonance": {
        "weight": 0.10,
        "description": "Alignment of life phases and luck cycles"
    }
}


def calculate_relationship_axes(chart_a: Dict, chart_b: Dict,
                                 matrix: List[List[Dict]] = None) -> Dict:
    """
    Calculate relationship axes scores.

    Args:
        chart_a: First person's BaZi chart
        chart_b: Second person's BaZi chart
        matrix: Pre-calculated synastry matrix (optional)

    Returns:
        Dict with axis scores and overall compatibility
    """
    if matrix is None:
        matrix = synastry_matrix(chart_a, chart_b)

    axes_scores = {}

    # 1. Elemental Harmony
    elem_a = chart_a.get("element_distribution", {})
    elem_b = chart_b.get("element_distribution", {})
    elemental_score = _calculate_elemental_harmony(elem_a, elem_b)
    axes_scores["elemental_harmony"] = {
        "score": round(elemental_score, 2),
        "description": RELATIONSHIP_AXES["elemental_harmony"]["description"]
    }

    # 2. Day Master Affinity (from matrix diagonal - Day vs Day)
    day_cell = matrix[2][2]  # day vs day in 5x5 matrix
    dm_cell = matrix[4][4]   # dm vs dm
    dm_score = (day_cell.get("score", 0) + dm_cell.get("score", 0) + 10) / 30  # Normalize to 0-1
    axes_scores["day_master_affinity"] = {
        "score": round(max(0, min(1, dm_score)), 2),
        "description": RELATIONSHIP_AXES["day_master_affinity"]["description"]
    }

    # 3. Emotional Connection (Month and Hour pillars)
    month_cells = [matrix[1][j] for j in range(5)]  # Month row
    hour_cells = [matrix[3][j] for j in range(5)]   # Hour row
    emotional_score = (sum(c.get("score", 0) for c in month_cells + hour_cells) + 100) / 200
    axes_scores["emotional_connection"] = {
        "score": round(max(0, min(1, emotional_score)), 2),
        "description": RELATIONSHIP_AXES["emotional_connection"]["description"]
    }

    # 4. Practical Alignment (Day and Month pillars)
    practical_cells = matrix[2]  # Day row
    practical_score = (sum(c.get("score", 0) for c in practical_cells) + 50) / 100
    axes_scores["practical_alignment"] = {
        "score": round(max(0, min(1, practical_score)), 2),
        "description": RELATIONSHIP_AXES["practical_alignment"]["description"]
    }

    # 5. Growth Potential (based on elemental production cycles)
    growth_score = _calculate_growth_potential(elem_a, elem_b)
    axes_scores["growth_potential"] = {
        "score": round(growth_score, 2),
        "description": RELATIONSHIP_AXES["growth_potential"]["description"]
    }

    # 6. Timing Resonance (would need DaYun comparison - simplified here)
    dm_strength_a = chart_a.get("dm_strength", {}).get("score", 0.5)
    dm_strength_b = chart_b.get("dm_strength", {}).get("score", 0.5)
    timing_score = 1 - abs(dm_strength_a - dm_strength_b)
    axes_scores["timing_resonance"] = {
        "score": round(timing_score, 2),
        "description": RELATIONSHIP_AXES["timing_resonance"]["description"]
    }

    # Calculate weighted overall
    weighted_sum = 0
    total_weight = 0
    for axis, info in RELATIONSHIP_AXES.items():
        if axis in axes_scores:
            weighted_sum += axes_scores[axis]["score"] * info["weight"]
            total_weight += info["weight"]

    overall = weighted_sum / total_weight if total_weight > 0 else 0.5

    return {
        "axes": axes_scores,
        "overall_compatibility": round(overall, 3),
        "compatibility_level": _get_compatibility_level(overall)
    }


def _calculate_elemental_harmony(elem_a: Dict, elem_b: Dict) -> float:
    """Calculate elemental harmony score."""
    elements = ["Wood", "Fire", "Earth", "Metal", "Water"]

    # Normalize element distributions
    total_a = sum(elem_a.get(e, 0) for e in elements) or 1
    total_b = sum(elem_b.get(e, 0) for e in elements) or 1

    norm_a = {e: elem_a.get(e, 0) / total_a for e in elements}
    norm_b = {e: elem_b.get(e, 0) / total_b for e in elements}

    # Score based on complementary elements (production cycle)
    harmony_score = 0
    for e in elements:
        # Similarity bonus
        harmony_score += 1 - abs(norm_a[e] - norm_b[e])

        # Production bonus: if A has element that produces B's strong element
        produced = PRODUCES.get(e, "")
        if produced and norm_b.get(produced, 0) > 0.2:
            harmony_score += norm_a.get(e, 0) * 0.5

    # Normalize to 0-1
    return min(1, max(0, harmony_score / 7))


def _calculate_growth_potential(elem_a: Dict, elem_b: Dict) -> float:
    """Calculate growth potential based on elemental cycles."""
    elements = ["Wood", "Fire", "Earth", "Metal", "Water"]

    growth_score = 0

    for e in elements:
        # Check production cycles
        produced = PRODUCES.get(e, "")
        if produced:
            # A's element produces B's weak element = growth opportunity
            if elem_a.get(e, 0) > 0.2 and elem_b.get(produced, 0) < 0.15:
                growth_score += 0.2
            # B's element produces A's weak element
            if elem_b.get(e, 0) > 0.2 and elem_a.get(produced, 0) < 0.15:
                growth_score += 0.2

    return min(1, growth_score)


def _get_compatibility_level(score: float) -> str:
    """Get compatibility level description."""
    if score >= 0.85:
        return "Exceptional - Deep natural harmony"
    elif score >= 0.70:
        return "Strong - Natural compatibility with minor adjustments"
    elif score >= 0.55:
        return "Good - Solid foundation for growth together"
    elif score >= 0.40:
        return "Moderate - Requires conscious effort and understanding"
    else:
        return "Challenging - Significant work needed for harmony"


# ============================================
# MAIN COMPATIBILITY FUNCTION
# ============================================

def compute_bazi_compatibility(chart_a: Dict, chart_b: Dict) -> Dict:
    """
    Compute complete BaZi compatibility analysis.

    Args:
        chart_a: First person's BaZi chart (from analyze_bazi)
        chart_b: Second person's BaZi chart

    Returns:
        Complete compatibility analysis
    """
    # Generate synastry matrix
    matrix = synastry_matrix(chart_a, chart_b)

    # Get matrix insights
    insights = synastry_insights(matrix)

    # Calculate relationship axes
    axes_result = calculate_relationship_axes(chart_a, chart_b, matrix)

    return {
        "synastry_matrix": matrix,
        "synastry_insights": insights,
        "relationship_axes": axes_result["axes"],
        "overall_compatibility": axes_result["overall_compatibility"],
        "compatibility_level": axes_result["compatibility_level"],
        "person_a": {
            "day_master": chart_a.get("day_master", {}),
            "element_distribution": chart_a.get("element_distribution", {})
        },
        "person_b": {
            "day_master": chart_b.get("day_master", {}),
            "element_distribution": chart_b.get("element_distribution", {})
        }
    }
