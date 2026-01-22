"""
bazi_engine/explainability.py

Narrative generation for BaZi readings.
Follows the L0-L3 explainability model for transparent, trauma-informed interpretations.

Explainability Levels:
- L0: Postcard - One-line summary
- L1: Factors - Key contributors with +/- influence
- L2: Math - Formulas and intermediate values
- L3: Debug - Raw data for audit

Language Guidelines (Trauma-Informed):
- "Under-supported DM" instead of "weak DM"
- "Resource-abundant DM" instead of "strong DM"
- "This suggests..." instead of "You are..."
- Focus on potential and growth, not limitation
"""

from typing import Dict, List, Any, Tuple, Optional
from .utils import ELEMENT_MAP, PRODUCES, CONTROLS


# =============================================================================
# ELEMENT DESCRIPTIONS
# =============================================================================

ELEMENT_QUALITIES = {
    "Wood": {
        "positive": ["growth-oriented", "visionary", "compassionate", "flexible"],
        "challenges": ["may need more follow-through", "can overextend"],
        "energy": "expansive and nurturing"
    },
    "Fire": {
        "positive": ["passionate", "charismatic", "inspiring", "warm"],
        "challenges": ["may burn bright then dim", "benefits from pacing"],
        "energy": "radiant and transformative"
    },
    "Earth": {
        "positive": ["stable", "reliable", "nurturing", "grounded"],
        "challenges": ["may resist necessary change", "benefits from flexibility"],
        "energy": "centering and supportive"
    },
    "Metal": {
        "positive": ["discerning", "principled", "precise", "refined"],
        "challenges": ["may be overly exacting", "benefits from softening"],
        "energy": "clarifying and purposeful"
    },
    "Water": {
        "positive": ["intuitive", "adaptable", "deep", "wise"],
        "challenges": ["may flow without direction", "benefits from structure"],
        "energy": "flowing and contemplative"
    }
}

# =============================================================================
# TEN GODS DESCRIPTIONS
# =============================================================================

TEN_GOD_MEANINGS = {
    "BiJian": {
        "english": "Companion",
        "meaning": "Self-reliance, independence, competitive spirit",
        "positive": "Strong sense of self, determination",
        "shadow": "May benefit from collaboration"
    },
    "JieCai": {
        "english": "Rob Wealth",
        "meaning": "Ambition, drive to achieve, competitive edge",
        "positive": "Entrepreneurial spirit, bold action",
        "shadow": "Benefits from considering long-term consequences"
    },
    "ShiShen": {
        "english": "Eating God",
        "meaning": "Creativity, enjoyment, artistic expression",
        "positive": "Natural talent for pleasure and creation",
        "shadow": "May benefit from practical application"
    },
    "ShangGuan": {
        "english": "Hurting Officer",
        "meaning": "Innovation, unconventional thinking, reform",
        "positive": "Ability to challenge status quo constructively",
        "shadow": "Benefits from diplomatic expression"
    },
    "ZhengCai": {
        "english": "Direct Wealth",
        "meaning": "Steady income, financial prudence, responsibility",
        "positive": "Reliable, methodical approach to resources",
        "shadow": "May benefit from calculated risks"
    },
    "PianCai": {
        "english": "Indirect Wealth",
        "meaning": "Unexpected gains, speculative success, generosity",
        "positive": "Ability to spot opportunities",
        "shadow": "Benefits from stability anchors"
    },
    "ZhengGuan": {
        "english": "Direct Officer",
        "meaning": "Authority, structure, ethical leadership",
        "positive": "Natural sense of duty and responsibility",
        "shadow": "May benefit from flexibility"
    },
    "QiSha": {
        "english": "Seven Killings",
        "meaning": "Power, intensity, transformative force",
        "positive": "Ability to handle pressure and crisis",
        "shadow": "Benefits from channeling intensity constructively"
    },
    "ZhengYin": {
        "english": "Direct Resource",
        "meaning": "Learning, support, nurturing wisdom",
        "positive": "Natural teacher and student, absorbs knowledge",
        "shadow": "May benefit from independent action"
    },
    "PianYin": {
        "english": "Indirect Resource",
        "meaning": "Unconventional wisdom, esoteric knowledge, intuition",
        "positive": "Access to hidden or specialized knowledge",
        "shadow": "Benefits from grounding in practical matters"
    }
}

# =============================================================================
# SYMBOLIC STAR DESCRIPTIONS
# =============================================================================

STAR_MEANINGS = {
    "PeachBlossom": {
        "chinese": "桃花",
        "meaning": "Natural charisma and social magnetism",
        "positive": "You naturally draw others to you with your warmth and appeal",
        "guidance": "Channel this attraction energy purposefully"
    },
    "HeavenlyNoble": {
        "chinese": "天乙贵人",
        "meaning": "Benefactor support and timely help",
        "positive": "Helpful people tend to appear when you need them most",
        "guidance": "Remain open to assistance from unexpected sources"
    },
    "AcademicStar": {
        "chinese": "文昌",
        "meaning": "Academic brilliance and writing talent",
        "positive": "Natural aptitude for learning and intellectual expression",
        "guidance": "Cultivate your scholarly and creative gifts"
    },
    "TravelingHorse": {
        "chinese": "驿马",
        "meaning": "Movement, change, and dynamic career",
        "positive": "Life involves meaningful travel and transitions",
        "guidance": "Embrace change as a source of growth"
    },
    "RobberyStar": {
        "chinese": "劫煞",
        "meaning": "Intensity and the need for discernment",
        "positive": "Awareness allows you to navigate challenges wisely",
        "guidance": "Apply extra care in matters requiring trust"
    },
    "HeavenlyVirtue": {
        "chinese": "天德",
        "meaning": "Divine protection and moral alignment",
        "positive": "A natural shield against misfortune",
        "guidance": "Your integrity serves as your protection"
    },
    "MonthlyVirtue": {
        "chinese": "月德",
        "meaning": "Monthly blessings and kindness",
        "positive": "Your kind nature attracts positive circumstances",
        "guidance": "Continue extending compassion to others"
    },
    "TaiJiNoble": {
        "chinese": "太极贵人",
        "meaning": "Spiritual insight and metaphysical awareness",
        "positive": "Natural connection to deeper wisdom and meaning",
        "guidance": "Trust your intuitive and spiritual inclinations"
    }
}


# =============================================================================
# DM STRENGTH DESCRIPTIONS
# =============================================================================

def describe_dm_strength(strength: float, classification: str) -> Dict[str, str]:
    """
    Generate trauma-informed description of Day Master strength.

    Uses:
    - "Under-supported" instead of "weak"
    - "Resource-abundant" instead of "strong"
    - "Well-balanced" for neutral

    Args:
        strength: 0.0-1.0 score
        classification: "under-supported", "balanced", or "resource-abundant"

    Returns:
        Dict with title, description, and guidance
    """
    if classification == "under-supported" or strength < 0.40:
        return {
            "title": "Under-Supported Day Master",
            "description": (
                "Your chart shows a Day Master that benefits from additional support. "
                "This suggests a sensitive, receptive nature that thrives with nurturing."
            ),
            "guidance": (
                "Seek environments and relationships that provide stability. "
                "Your receptive nature is a gift for deep connection."
            ),
            "favorable_elements": ["Resource (印)", "Companion (比劫)"]
        }
    elif classification == "resource-abundant" or strength > 0.65:
        return {
            "title": "Resource-Abundant Day Master",
            "description": (
                "Your chart shows a Day Master with abundant resources. "
                "This suggests natural leadership ability and self-reliance."
            ),
            "guidance": (
                "You can handle challenges that would overwhelm others. "
                "Consider directing your strength toward meaningful goals."
            ),
            "favorable_elements": ["Wealth (财)", "Output (食伤)", "Power (官杀)"]
        }
    else:
        return {
            "title": "Well-Balanced Day Master",
            "description": (
                "Your chart shows a Day Master in harmonious balance. "
                "This suggests adaptability and resilience across situations."
            ),
            "guidance": (
                "You have the flexibility to respond to various life circumstances. "
                "Trust your natural equilibrium."
            ),
            "favorable_elements": ["Varies by specific imbalances"]
        }


# =============================================================================
# FULL CHART EXPLANATION
# =============================================================================

def generate_l0_postcard(chart: Dict[str, Any]) -> str:
    """
    Generate L0 one-line postcard summary.

    Args:
        chart: Full BaZi chart data

    Returns:
        One-line summary suitable for display
    """
    dm = chart.get("day_master", {})
    dm_stem = dm.get("stem", "")
    dm_element = ELEMENT_MAP.get(dm_stem, "")

    strength = chart.get("dm_strength", {}).get("classification", "balanced")

    # Convert to display-friendly terms
    strength_display = {
        "under-supported": "receptive",
        "balanced": "balanced",
        "resource-abundant": "self-reliant"
    }.get(strength, "balanced")

    stars = chart.get("symbolic_stars", {})
    detected_stars = [name for name, data in stars.items() if data.get("detected")]

    star_note = ""
    if "PeachBlossom" in detected_stars:
        star_note = " with natural charisma"
    elif "AcademicStar" in detected_stars:
        star_note = " with scholarly gifts"
    elif "TravelingHorse" in detected_stars:
        star_note = " with a dynamic path"

    return f"A {strength_display} {dm_element} nature{star_note}."


def generate_l1_factors(chart: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Generate L1 key factors breakdown.

    Args:
        chart: Full BaZi chart data

    Returns:
        List of factor objects with name, influence (+/-), and explanation
    """
    factors = []

    # Day Master element
    dm = chart.get("day_master", {})
    dm_element = ELEMENT_MAP.get(dm.get("stem", ""), "")
    if dm_element:
        factors.append({
            "name": f"Day Master: {dm_element}",
            "influence": "neutral",
            "explanation": ELEMENT_QUALITIES.get(dm_element, {}).get("energy", "")
        })

    # DM Strength
    dm_strength = chart.get("dm_strength", {})
    classification = dm_strength.get("classification", "balanced")
    strength_desc = describe_dm_strength(
        dm_strength.get("score", 0.5),
        classification
    )
    factors.append({
        "name": strength_desc["title"],
        "influence": "positive" if classification == "balanced" else "notable",
        "explanation": strength_desc["description"][:100] + "..."
    })

    # Ten Gods summary
    ten_gods = chart.get("ten_gods_summary", {})
    if ten_gods:
        dominant = max(ten_gods.items(), key=lambda x: x[1], default=(None, 0))
        if dominant[0]:
            god_info = TEN_GOD_MEANINGS.get(dominant[0], {})
            factors.append({
                "name": f"Dominant: {god_info.get('english', dominant[0])}",
                "influence": "positive",
                "explanation": god_info.get("meaning", "")
            })

    # Detected stars
    stars = chart.get("symbolic_stars", {})
    for star_name, star_data in stars.items():
        if star_data.get("detected"):
            star_info = STAR_MEANINGS.get(star_name, {})
            factors.append({
                "name": star_info.get("chinese", star_name),
                "influence": "positive" if star_name != "RobberyStar" else "caution",
                "explanation": star_info.get("meaning", "")
            })

    return factors


def generate_l2_math(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate L2 mathematical breakdown.

    Args:
        chart: Full BaZi chart data

    Returns:
        Dict with formulas, inputs, and intermediate values
    """
    return {
        "element_distribution": chart.get("element_distribution", {}),
        "dm_strength_calculation": {
            "score": chart.get("dm_strength", {}).get("score", 0.5),
            "method": "Weighted sum of same-element + resource-element percentages",
            "classification_thresholds": {
                "under-supported": "< 0.40",
                "balanced": "0.40 - 0.65",
                "resource-abundant": "> 0.65"
            }
        },
        "ten_gods_counts": chart.get("ten_gods_summary", {}),
        "hidden_stems": chart.get("hidden_stems", {})
    }


def generate_l3_debug(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate L3 raw debug data.

    Args:
        chart: Full BaZi chart data

    Returns:
        Complete raw chart data for audit
    """
    return {
        "raw_pillars": chart.get("pillars", []),
        "raw_hidden_stems": chart.get("hidden_stems_raw", {}),
        "raw_ten_gods": chart.get("ten_gods_raw", {}),
        "raw_stars": chart.get("symbolic_stars", {}),
        "calculation_timestamp": chart.get("calculated_at", ""),
        "sxtwl_used": chart.get("sxtwl_available", False)
    }


def generate_full_explanation(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate complete multi-level explanation for a BaZi chart.

    Args:
        chart: Full BaZi chart data from analyze_bazi()

    Returns:
        Dict with L0, L1, L2, L3 explanations
    """
    return {
        "L0_postcard": generate_l0_postcard(chart),
        "L1_factors": generate_l1_factors(chart),
        "L2_math": generate_l2_math(chart),
        "L3_debug": generate_l3_debug(chart),
        "metadata": {
            "version": "1.0.0",
            "methodology": "Joey Yap BaZi with trauma-informed language",
            "disclaimer": (
                "This reading offers perspective, not prediction. "
                "You are the author of your own story."
            )
        }
    }


# =============================================================================
# NARRATIVE TEMPLATES
# =============================================================================

def generate_narrative_paragraph(chart: Dict[str, Any]) -> str:
    """
    Generate a flowing narrative paragraph about the chart.

    Args:
        chart: Full BaZi chart data

    Returns:
        Multi-sentence narrative
    """
    dm = chart.get("day_master", {})
    dm_stem = dm.get("stem", "")
    dm_element = ELEMENT_MAP.get(dm_stem, "")

    element_info = ELEMENT_QUALITIES.get(dm_element, {})
    positive_traits = element_info.get("positive", [])[:2]

    dm_strength = chart.get("dm_strength", {})
    strength_desc = describe_dm_strength(
        dm_strength.get("score", 0.5),
        dm_strength.get("classification", "balanced")
    )

    stars = chart.get("symbolic_stars", {})
    detected_stars = [
        STAR_MEANINGS.get(name, {}).get("positive", "")
        for name, data in stars.items()
        if data.get("detected")
    ][:2]

    # Build narrative
    parts = []

    # Opening
    if positive_traits:
        traits_str = " and ".join(positive_traits)
        parts.append(
            f"Your {dm_element} Day Master suggests a nature that is {traits_str}."
        )

    # DM Strength context
    parts.append(strength_desc["description"])

    # Stars
    for star_note in detected_stars:
        if star_note:
            parts.append(star_note + ".")

    # Closing guidance
    parts.append(strength_desc["guidance"])

    return " ".join(parts)
