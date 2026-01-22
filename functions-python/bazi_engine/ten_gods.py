"""
bazi_engine/ten_gods.py

Ten Gods (十神) derivation following Joey Yap conventions.
The Ten Gods describe the relationship between any stem and the Day Master.

Ten Gods Categories:
- 比肩 (BiJian) - Peer/Companion (same element, same polarity)
- 劫財 (JieCai) - Rob Wealth/Robbery (same element, different polarity)
- 食神 (ShiShen) - Eating God/Expression (produces, same polarity)
- 傷官 (ShangGuan) - Hurting Officer/Talent (produces, different polarity)
- 正印 (ZhengYin) - Direct Resource/Proper Seal (produced by, same polarity)
- 偏印 (PianYin) - Indirect Resource/Slanted Seal (produced by, different polarity)
- 正財 (ZhengCai) - Direct Wealth/Proper Wealth (controlled, different polarity)
- 偏財 (PianCai) - Indirect Wealth/Side Wealth (controlled, same polarity)
- 正官 (ZhengGuan) - Direct Officer/Proper Authority (controls, different polarity)
- 七殺 (QiSha) - Seven Killings/Aggression (controls, same polarity)
"""

from typing import List, Dict, Tuple, Any
from .utils import HEAVENLY_STEMS, ELEMENT_MAP, PRODUCES, CONTROLS


# =============================================================================
# TEN GOD LABELS - Joey Yap English conventions
# =============================================================================

TEN_GOD_LABELS: Dict[str, str] = {
    "BiJian": "Companion (比肩)",
    "JieCai": "Rob Wealth (劫財)",
    "ShiShen": "Eating God (食神)",
    "ShangGuan": "Hurting Officer (傷官)",
    "ZhengYin": "Direct Resource (正印)",
    "PianYin": "Indirect Resource (偏印)",
    "ZhengCai": "Direct Wealth (正財)",
    "PianCai": "Indirect Wealth (偏財)",
    "ZhengGuan": "Direct Officer (正官)",
    "QiSha": "Seven Killings (七殺)"
}

# Alternative English names (Joey Yap variations)
TEN_GOD_ALT_NAMES: Dict[str, List[str]] = {
    "BiJian": ["Peer", "Friend", "Companion"],
    "JieCai": ["Robbery", "Rob Wealth", "Blade"],
    "ShiShen": ["Expression", "Eating God", "Output (Yang)"],
    "ShangGuan": ["Talent", "Hurting Officer", "Output (Yin)"],
    "ZhengYin": ["Proper Resource", "Direct Seal", "Knowledge"],
    "PianYin": ["Slanted Resource", "Indirect Seal", "Unconventional Learning"],
    "ZhengCai": ["Proper Wealth", "Direct Wealth", "Steady Income"],
    "PianCai": ["Side Wealth", "Indirect Wealth", "Windfall"],
    "ZhengGuan": ["Proper Authority", "Direct Officer", "Structure"],
    "QiSha": ["Aggression", "7 Killings", "Power"]
}

# 5-Group mapping for compatibility scoring
TEN_GOD_TO_5GROUP: Dict[str, str] = {
    "BiJian": "Companion",
    "JieCai": "Companion",
    "ShiShen": "Output",
    "ShangGuan": "Output",
    "ZhengCai": "Wealth",
    "PianCai": "Wealth",
    "ZhengGuan": "Power",
    "QiSha": "Power",
    "ZhengYin": "Resource",
    "PianYin": "Resource"
}


def _parity(stem: str) -> int:
    """
    Get the Yin/Yang parity of a stem.

    Returns:
        0 for Yang (甲丙戊庚壬)
        1 for Yin (乙丁己辛癸)
    """
    return HEAVENLY_STEMS.index(stem) % 2


def _same_polarity(stem1: str, stem2: str) -> bool:
    """Check if two stems have the same polarity (both Yang or both Yin)."""
    return _parity(stem1) == _parity(stem2)


def ten_god_for(day_master_stem: str, other_stem: str) -> str:
    """
    Determine the Ten God relationship of other_stem to day_master_stem.

    The Ten God is determined by:
    1. Element relationship (same, produces, produced by, controls, controlled by)
    2. Polarity matching (same or different Yin/Yang)

    Args:
        day_master_stem: The Day Master's Heavenly Stem
        other_stem: The stem to analyze

    Returns:
        Ten God name (e.g., "BiJian", "ZhengGuan", etc.)

    Example:
        >>> ten_god_for("Jia", "Geng")  # Jia=Wood, Geng=Metal
        'QiSha'  # Metal controls Wood, same polarity (both Yang)
    """
    dm_element = ELEMENT_MAP[day_master_stem]
    other_element = ELEMENT_MAP[other_stem]
    same_pol = _same_polarity(day_master_stem, other_stem)

    # Same element
    if dm_element == other_element:
        return "BiJian" if same_pol else "JieCai"

    # DM produces other (Output)
    if PRODUCES[dm_element] == other_element:
        return "ShiShen" if same_pol else "ShangGuan"

    # Other produces DM (Resource)
    if PRODUCES[other_element] == dm_element:
        # Note: Joey Yap convention for Resource polarity
        return "PianYin" if same_pol else "ZhengYin"

    # DM controls other (Wealth)
    if CONTROLS[dm_element] == other_element:
        return "PianCai" if same_pol else "ZhengCai"

    # Other controls DM (Power/Officer)
    if CONTROLS[other_element] == dm_element:
        return "QiSha" if same_pol else "ZhengGuan"

    return "Unknown"


def derive_ten_gods(day_master_stem: str, pillars: List[Tuple[str, str]]) -> List[Dict[str, Any]]:
    """
    Derive Ten Gods for each stem in the Four Pillars relative to Day Master.

    Args:
        day_master_stem: The Day Master's Heavenly Stem
        pillars: List of (stem, branch) tuples

    Returns:
        List of dicts with Ten God analysis for each pillar

    Example:
        >>> pillars = [('Geng', 'Wu'), ('Xin', 'Si'), ('Gui', 'Hai'), ('Gui', 'Wei')]
        >>> derive_ten_gods('Gui', pillars)
        [
            {'pillar': 'year', 'stem': 'Geng', 'branch': 'Wu', 'ten_god': 'ZhengYin', ...},
            ...
        ]
    """
    pillar_names = ["year", "month", "day", "hour"]
    results = []

    for i, (stem, branch) in enumerate(pillars):
        pillar_name = pillar_names[i] if i < len(pillar_names) else f"pillar_{i}"
        ten_god = ten_god_for(day_master_stem, stem)

        results.append({
            "pillar": pillar_name,
            "stem": stem,
            "branch": branch,
            "ten_god": ten_god,
            "label": TEN_GOD_LABELS.get(ten_god, ten_god),
            "group_5": TEN_GOD_TO_5GROUP.get(ten_god, "Unknown"),
            "is_day_master": pillar_name == "day"
        })

    return results


def ten_god_summary(pillars: List[Tuple[str, str]]) -> Dict[str, int]:
    """
    Count occurrences of each Ten God in the chart (stems only).

    Args:
        pillars: Four Pillars

    Returns:
        Dictionary of Ten God -> count
    """
    day_master = pillars[2][0]  # Day stem
    ten_gods = derive_ten_gods(day_master, pillars)

    summary = {}
    for tg in ten_gods:
        name = tg["ten_god"]
        if tg["pillar"] != "day":  # Don't count Day Master itself
            summary[name] = summary.get(name, 0) + 1

    return summary


def ten_god_summary_5group(pillars: List[Tuple[str, str]]) -> Dict[str, float]:
    """
    Get Ten God distribution in 5-group format for compatibility scoring.

    Groups:
    - Companion (BiJian + JieCai)
    - Output (ShiShen + ShangGuan)
    - Wealth (ZhengCai + PianCai)
    - Power (ZhengGuan + QiSha)
    - Resource (ZhengYin + PianYin)

    Args:
        pillars: Four Pillars

    Returns:
        Dictionary of group -> normalized score (0-1)
    """
    summary = ten_god_summary(pillars)

    groups = {
        "Companion": 0,
        "Output": 0,
        "Wealth": 0,
        "Power": 0,
        "Resource": 0
    }

    for ten_god, count in summary.items():
        group = TEN_GOD_TO_5GROUP.get(ten_god)
        if group:
            groups[group] += count

    # Normalize
    total = sum(groups.values())
    if total > 0:
        normalized = {k: v / total for k, v in groups.items()}
    else:
        normalized = {k: 0.2 for k in groups}  # Equal distribution

    return normalized


def get_ten_gods_with_hidden_stems(
    day_master_stem: str,
    pillars: List[Tuple[str, str]]
) -> List[Dict[str, Any]]:
    """
    Get Ten Gods including hidden stems within the branches.

    This provides a more complete analysis by including the
    hidden stem relationships.

    Args:
        day_master_stem: Day Master stem
        pillars: Four Pillars

    Returns:
        Extended Ten God analysis including hidden stems
    """
    from .hidden_stems import get_weighted_hidden_stems

    pillar_names = ["year", "month", "day", "hour"]
    results = []

    for i, (stem, branch) in enumerate(pillars):
        pillar_name = pillar_names[i] if i < len(pillar_names) else f"pillar_{i}"

        # Heavenly Stem Ten God
        main_ten_god = ten_god_for(day_master_stem, stem)

        # Hidden Stems Ten Gods
        hidden_ten_gods = []
        for hidden_stem, weight in get_weighted_hidden_stems(branch):
            hidden_tg = ten_god_for(day_master_stem, hidden_stem)
            hidden_ten_gods.append({
                "stem": hidden_stem,
                "ten_god": hidden_tg,
                "label": TEN_GOD_LABELS.get(hidden_tg, hidden_tg),
                "weight": weight
            })

        results.append({
            "pillar": pillar_name,
            "stem": stem,
            "branch": branch,
            "ten_god": main_ten_god,
            "label": TEN_GOD_LABELS.get(main_ten_god, main_ten_god),
            "hidden_ten_gods": hidden_ten_gods,
            "is_day_master": pillar_name == "day"
        })

    return results


def describe_ten_god(ten_god: str) -> str:
    """
    Get a brief description of a Ten God's meaning.

    Args:
        ten_god: Ten God code (e.g., "BiJian", "ZhengGuan")

    Returns:
        Description string
    """
    descriptions = {
        "BiJian": "Peer energy - competition, rivalry, self-expression, independence",
        "JieCai": "Robbery - aggressive pursuit, competitiveness, risk-taking",
        "ShiShen": "Expression - creativity, output, children, artistic talent",
        "ShangGuan": "Talent - unconventional expression, rebellion, intelligence",
        "ZhengYin": "Direct Resource - academic success, mentorship, nurturing support",
        "PianYin": "Indirect Resource - unconventional learning, spirituality, research",
        "ZhengCai": "Direct Wealth - steady income, reliability, conservative finance",
        "PianCai": "Indirect Wealth - windfalls, investments, father figure",
        "ZhengGuan": "Direct Officer - authority, career, reputation, discipline",
        "QiSha": "Seven Killings - power, pressure, transformation, intensity"
    }
    return descriptions.get(ten_god, "Unknown Ten God")
