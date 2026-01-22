"""
bazi_engine/growth_phases.py

Twelve Growth Phases (十二長生) calculation.
Determines the life phase energy for each pillar based on Day Master.

Following Joey Yap conventions:
- Yang stems: count forward through branches
- Yin stems: count backward through branches
- Each element has a specific starting branch for ChangSheng
"""

from typing import Dict, List, Tuple
from .utils import (
    HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_MAP,
    GROWTH_PHASES, GROWTH_PHASES_CN, stem_polarity
)


# =============================================================================
# GROWTH PHASE STARTING BRANCHES
# =============================================================================
# Each element starts its ChangSheng (長生) phase at a specific branch
# Yang elements count forward, Yin elements count backward

CHANGSHENG_BRANCH: Dict[str, str] = {
    # Yang elements - count forward
    "Jia": "Hai",   # 甲 (Yang Wood) starts at 亥
    "Bing": "Yin",  # 丙 (Yang Fire) starts at 寅
    "Wu": "Yin",    # 戊 (Yang Earth) follows Yang Fire
    "Geng": "Si",   # 庚 (Yang Metal) starts at 巳
    "Ren": "Shen",  # 壬 (Yang Water) starts at 申

    # Yin elements - count backward
    "Yi": "Wu",     # 乙 (Yin Wood) starts at 午
    "Ding": "You",  # 丁 (Yin Fire) starts at 酉
    "Ji": "You",    # 己 (Yin Earth) follows Yin Fire
    "Xin": "Zi",    # 辛 (Yin Metal) starts at 子
    "Gui": "Mao",   # 癸 (Yin Water) starts at 卯
}


def get_growth_phase_index(day_master: str, branch: str) -> int:
    """
    Calculate the growth phase index for a given Day Master and branch.

    Args:
        day_master: The Day Master stem (e.g., "Jia", "Yi")
        branch: The Earthly Branch to evaluate (e.g., "Zi", "Chou")

    Returns:
        Index into GROWTH_PHASES (0-11)
    """
    if day_master not in CHANGSHENG_BRANCH:
        return 0

    if branch not in EARTHLY_BRANCHES:
        return 0

    # Get starting branch for this stem's ChangSheng
    start_branch = CHANGSHENG_BRANCH[day_master]
    start_idx = EARTHLY_BRANCHES.index(start_branch)
    branch_idx = EARTHLY_BRANCHES.index(branch)

    # Determine direction based on polarity
    polarity = stem_polarity(day_master)

    if polarity == "Yang":
        # Yang: count forward
        offset = (branch_idx - start_idx) % 12
    else:
        # Yin: count backward
        offset = (start_idx - branch_idx) % 12

    return offset


def get_growth_phase(day_master: str, branch: str) -> Dict[str, str]:
    """
    Get the growth phase for a branch relative to the Day Master.

    Args:
        day_master: The Day Master stem
        branch: The Earthly Branch to evaluate

    Returns:
        Dict with phase name, Chinese name, and interpretation
    """
    idx = get_growth_phase_index(day_master, branch)
    phase = GROWTH_PHASES[idx]
    phase_cn = GROWTH_PHASES_CN[idx]

    return {
        "phase": phase,
        "phase_cn": phase_cn,
        "index": idx,
        "interpretation": PHASE_INTERPRETATIONS.get(phase, ""),
        "energy_level": PHASE_ENERGY_LEVELS.get(phase, 0.5)
    }


def get_all_pillar_phases(
    day_master: str,
    pillars: List[Tuple[str, str]]
) -> Dict[str, Dict]:
    """
    Calculate growth phases for all four pillars.

    Args:
        day_master: The Day Master stem
        pillars: List of (stem, branch) tuples for [year, month, day, hour]

    Returns:
        Dict mapping pillar names to their growth phase info
    """
    pillar_names = ["year", "month", "day", "hour"]
    result = {}

    for i, (stem, branch) in enumerate(pillars):
        pillar_name = pillar_names[i] if i < len(pillar_names) else f"pillar_{i}"
        result[pillar_name] = get_growth_phase(day_master, branch)
        result[pillar_name]["branch"] = branch

    return result


# =============================================================================
# PHASE INTERPRETATIONS
# =============================================================================
PHASE_INTERPRETATIONS: Dict[str, str] = {
    "ChangSheng": "Birth energy - new beginnings, potential, vitality. Like a newborn, full of life force.",
    "MuYu": "Cleansing phase - vulnerability, need for protection, preparation. A time of exposure.",
    "GuanDai": "Coming of age - gaining independence, taking on responsibilities, recognition.",
    "LinGuan": "Career peak - authority, influence, professional success. Official recognition.",
    "DiWang": "Emperor energy - maximum power, peak achievement, full manifestation.",
    "Shuai": "Decline begins - wisdom from experience, need to conserve energy, transition.",
    "Bing": "Illness phase - challenges, obstacles, need for rest and recovery.",
    "Si": "Death phase - endings, completion, release. Not physical death but transformation.",
    "Mu": "Tomb/Storage - hidden resources, ancestral connection, preservation of legacy.",
    "Jue": "Extinction - complete ending, void before renewal, letting go completely.",
    "Tai": "Embryo - conception of new cycle, planning, invisible beginnings.",
    "Yang": "Nurturing - protected growth, preparation, building strength before emergence."
}

# Energy level for each phase (0.0-1.0)
PHASE_ENERGY_LEVELS: Dict[str, float] = {
    "ChangSheng": 0.8,   # Strong birth energy
    "MuYu": 0.5,         # Vulnerable, moderate
    "GuanDai": 0.7,      # Growing strength
    "LinGuan": 0.9,      # Peak career energy
    "DiWang": 1.0,       # Maximum power
    "Shuai": 0.6,        # Declining but still functional
    "Bing": 0.3,         # Low energy, challenges
    "Si": 0.2,           # Minimal energy
    "Mu": 0.4,           # Hidden/stored energy
    "Jue": 0.1,          # Lowest point
    "Tai": 0.3,          # Building from nothing
    "Yang": 0.5          # Moderate, nurturing
}


def get_phase_summary(pillar_phases: Dict[str, Dict]) -> Dict[str, any]:
    """
    Generate a summary of the growth phases across all pillars.

    Args:
        pillar_phases: Output from get_all_pillar_phases

    Returns:
        Summary with average energy, dominant phases, and interpretation
    """
    if not pillar_phases:
        return {}

    # Calculate average energy
    total_energy = sum(p["energy_level"] for p in pillar_phases.values())
    avg_energy = total_energy / len(pillar_phases)

    # Find peak and low phases
    peak_pillar = max(pillar_phases.items(), key=lambda x: x[1]["energy_level"])
    low_pillar = min(pillar_phases.items(), key=lambda x: x[1]["energy_level"])

    # Count favorable phases (energy >= 0.7)
    favorable_count = sum(1 for p in pillar_phases.values() if p["energy_level"] >= 0.7)

    # Determine overall pattern
    if avg_energy >= 0.7:
        pattern = "Strong Life Force"
        pattern_desc = "Your chart shows abundant vital energy across life areas."
    elif avg_energy >= 0.5:
        pattern = "Balanced Life Force"
        pattern_desc = "Your chart shows steady, sustainable energy levels."
    elif avg_energy >= 0.3:
        pattern = "Developing Life Force"
        pattern_desc = "Your chart shows potential that unfolds through effort and time."
    else:
        pattern = "Transformative Life Force"
        pattern_desc = "Your chart emphasizes endings and new beginnings."

    return {
        "average_energy": round(avg_energy, 2),
        "peak_phase": {
            "pillar": peak_pillar[0],
            "phase": peak_pillar[1]["phase"],
            "energy": peak_pillar[1]["energy_level"]
        },
        "low_phase": {
            "pillar": low_pillar[0],
            "phase": low_pillar[1]["phase"],
            "energy": low_pillar[1]["energy_level"]
        },
        "favorable_pillars": favorable_count,
        "pattern": pattern,
        "pattern_description": pattern_desc
    }
