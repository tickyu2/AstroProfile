"""
bazi_engine/symbolic_stars.py

Symbolic Stars (神煞) detection aligned with Joey Yap conventions.
These are special markers in a BaZi chart that indicate specific traits or events.

Major stars implemented:
- 桃花 (Peach Blossom) - Romance, attraction, charisma
- 天乙貴人 (Heavenly Noble) - Helpful people, support
- 文昌 (Academic Star) - Academic success, writing talent
- 驛馬 (Traveling Horse) - Movement, travel, relocation
- 劫煞 (Robbery Star) - Loss, competition
- 天德/月德 (Heavenly/Monthly Virtue) - Protection, blessings
- 太極貴人 (Tai Ji Noble) - Spiritual awareness
"""

from typing import Dict, List, Tuple, Any, Set
from functools import lru_cache
from .utils import EARTHLY_BRANCHES, HEAVENLY_STEMS, ELEMENT_MAP


# =============================================================================
# BITMASK OPTIMIZATION
# =============================================================================
# Using bitmasks for O(1) branch membership checks instead of set operations.
# Each branch gets a unique bit position, enabling fast bitwise AND checks.

# Branch to bit position mapping (0-11)
BRANCH_BIT: Dict[str, int] = {b: 1 << i for i, b in enumerate(EARTHLY_BRANCHES)}

# Stem to bit position mapping (0-9)
STEM_BIT: Dict[str, int] = {s: 1 << i for i, s in enumerate(HEAVENLY_STEMS)}

# Precomputed San He (三合) groups as bitmasks
# Tiger-Horse-Dog, Monkey-Rat-Dragon, Snake-Rooster-Ox, Pig-Rabbit-Goat
SANHE_GROUPS = {
    "fire": BRANCH_BIT["Yin"] | BRANCH_BIT["Wu"] | BRANCH_BIT["Xu"],      # 寅午戌
    "water": BRANCH_BIT["Shen"] | BRANCH_BIT["Zi"] | BRANCH_BIT["Chen"],  # 申子辰
    "metal": BRANCH_BIT["Si"] | BRANCH_BIT["You"] | BRANCH_BIT["Chou"],   # 巳酉丑
    "wood": BRANCH_BIT["Hai"] | BRANCH_BIT["Mao"] | BRANCH_BIT["Wei"]     # 亥卯未
}

# Precomputed Liu Chong (六冲) pairs as bitmasks
LIUCHONG_PAIRS = [
    BRANCH_BIT["Zi"] | BRANCH_BIT["Wu"],     # 子午冲
    BRANCH_BIT["Chou"] | BRANCH_BIT["Wei"],  # 丑未冲
    BRANCH_BIT["Yin"] | BRANCH_BIT["Shen"],  # 寅申冲
    BRANCH_BIT["Mao"] | BRANCH_BIT["You"],   # 卯酉冲
    BRANCH_BIT["Chen"] | BRANCH_BIT["Xu"],   # 辰戌冲
    BRANCH_BIT["Si"] | BRANCH_BIT["Hai"]     # 巳亥冲
]


def _branches_to_mask(branches: List[str]) -> int:
    """Convert list of branches to bitmask."""
    mask = 0
    for b in branches:
        mask |= BRANCH_BIT.get(b, 0)
    return mask


def _stems_to_mask(stems: List[str]) -> int:
    """Convert list of stems to bitmask."""
    mask = 0
    for s in stems:
        mask |= STEM_BIT.get(s, 0)
    return mask


def _pillars_to_branch_mask(pillars: List[Tuple[str, str]]) -> int:
    """Convert pillars to branch bitmask (O(1) membership check)."""
    mask = 0
    for _, branch in pillars:
        mask |= BRANCH_BIT.get(branch, 0)
    return mask


def _pillars_to_stem_mask(pillars: List[Tuple[str, str]]) -> int:
    """Convert pillars to stem bitmask."""
    mask = 0
    for stem, _ in pillars:
        mask |= STEM_BIT.get(stem, 0)
    return mask


def _branch_in_mask(branch: str, mask: int) -> bool:
    """Check if branch is in bitmask (O(1))."""
    return (BRANCH_BIT.get(branch, 0) & mask) != 0


def _stem_in_mask(stem: str, mask: int) -> bool:
    """Check if stem is in bitmask (O(1))."""
    return (STEM_BIT.get(stem, 0) & mask) != 0


# =============================================================================
# STAR DETECTION RULES
# =============================================================================

# Peach Blossom (桃花) - Based on Year/Day Branch
# Day/Year Branch -> Peach Blossom is at this branch
PEACH_BLOSSOM_MAP: Dict[str, str] = {
    # Tiger, Horse, Dog group -> Mao (Rabbit)
    "Yin": "Mao", "Wu": "Mao", "Xu": "Mao",
    # Monkey, Rat, Dragon group -> You (Rooster)
    "Shen": "You", "Zi": "You", "Chen": "You",
    # Snake, Rooster, Ox group -> Wu (Horse)
    "Si": "Wu", "You": "Wu", "Chou": "Wu",
    # Pig, Rabbit, Goat group -> Zi (Rat)
    "Hai": "Zi", "Mao": "Zi", "Wei": "Zi"
}

# Heavenly Noble (天乙貴人) - Based on Day Stem
# Day Stem -> Heavenly Noble appears at these branches
HEAVENLY_NOBLE_MAP: Dict[str, List[str]] = {
    "Jia": ["Chou", "Wei"],
    "Yi": ["Zi", "Shen"],
    "Bing": ["Hai", "You"],
    "Ding": ["Hai", "You"],
    "Wu": ["Chou", "Wei"],
    "Ji": ["Zi", "Shen"],
    "Geng": ["Chou", "Wei"],
    "Xin": ["Yin", "Wu"],
    "Ren": ["Mao", "Si"],
    "Gui": ["Mao", "Si"]
}

# Academic Star (文昌) - Based on Day Stem
ACADEMIC_STAR_MAP: Dict[str, str] = {
    "Jia": "Si", "Yi": "Wu", "Bing": "Shen", "Ding": "You",
    "Wu": "Shen", "Ji": "You", "Geng": "Hai", "Xin": "Zi",
    "Ren": "Yin", "Gui": "Mao"
}

# Traveling Horse (驛馬) - Based on Year/Day Branch
TRAVELING_HORSE_MAP: Dict[str, str] = {
    # Tiger, Horse, Dog -> Shen (Monkey)
    "Yin": "Shen", "Wu": "Shen", "Xu": "Shen",
    # Monkey, Rat, Dragon -> Yin (Tiger)
    "Shen": "Yin", "Zi": "Yin", "Chen": "Yin",
    # Snake, Rooster, Ox -> Hai (Pig)
    "Si": "Hai", "You": "Hai", "Chou": "Hai",
    # Pig, Rabbit, Goat -> Si (Snake)
    "Hai": "Si", "Mao": "Si", "Wei": "Si"
}

# Robbery Star (劫煞) - Based on Year/Day Branch
ROBBERY_STAR_MAP: Dict[str, str] = {
    "Yin": "Hai", "Wu": "Hai", "Xu": "Hai",
    "Shen": "Si", "Zi": "Si", "Chen": "Si",
    "Si": "Yin", "You": "Yin", "Chou": "Yin",
    "Hai": "Shen", "Mao": "Shen", "Wei": "Shen"
}

# Heavenly Virtue (天德) - Based on Month Branch
HEAVENLY_VIRTUE_MAP: Dict[str, str] = {
    "Yin": "Ding", "Mao": "Shen", "Chen": "Ren", "Si": "Xin",
    "Wu": "Hai", "Wei": "Jia", "Shen": "Gui", "You": "Yin",
    "Xu": "Bing", "Hai": "Yi", "Zi": "Geng", "Chou": "Ji"
}

# Monthly Virtue (月德) - Based on Month Branch
MONTHLY_VIRTUE_MAP: Dict[str, str] = {
    "Yin": "Bing", "Mao": "Jia", "Chen": "Ren", "Si": "Geng",
    "Wu": "Bing", "Wei": "Jia", "Shen": "Ren", "You": "Geng",
    "Xu": "Bing", "Hai": "Jia", "Zi": "Ren", "Chou": "Geng"
}

# Tai Ji Noble (太極貴人) - Based on Day Stem
TAIJI_NOBLE_MAP: Dict[str, List[str]] = {
    "Jia": ["Zi", "Wu"], "Yi": ["Zi", "Wu"],
    "Bing": ["Mao", "You"], "Ding": ["Mao", "You"],
    "Wu": ["Chen", "Xu", "Chou", "Wei"], "Ji": ["Chen", "Xu", "Chou", "Wei"],
    "Geng": ["Yin", "Hai"], "Xin": ["Yin", "Hai"],
    "Ren": ["Si", "Shen"], "Gui": ["Si", "Shen"]
}


def _get_all_branches(pillars: List[Tuple[str, str]]) -> Set[str]:
    """Extract all branches from pillars."""
    return {branch for _, branch in pillars}


def _get_all_stems(pillars: List[Tuple[str, str]]) -> Set[str]:
    """Extract all stems from pillars."""
    return {stem for stem, _ in pillars}


def detect_peach_blossom(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Peach Blossom (桃花) star.

    Based on Year or Day branch, check if Peach Blossom branch appears elsewhere.

    Returns:
        Dict with detection status and details
    """
    year_branch = pillars[0][1]
    day_branch = pillars[2][1]
    all_branches = _get_all_branches(pillars)

    pb_from_year = PEACH_BLOSSOM_MAP.get(year_branch)
    pb_from_day = PEACH_BLOSSOM_MAP.get(day_branch)

    detected = False
    locations = []

    if pb_from_year and pb_from_year in all_branches:
        detected = True
        locations.append({"source": "year", "peach_blossom_branch": pb_from_year})

    if pb_from_day and pb_from_day in all_branches:
        detected = True
        locations.append({"source": "day", "peach_blossom_branch": pb_from_day})

    return {
        "detected": detected,
        "chinese": "桃花",
        "english": "Peach Blossom",
        "meaning": "Romance, attraction, charisma, social appeal",
        "locations": locations
    }


def detect_heavenly_noble(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Heavenly Noble (天乙貴人) star.

    Based on Day Stem, check if noble branches appear in the chart.
    """
    day_stem = pillars[2][0]
    all_branches = _get_all_branches(pillars)

    noble_branches = HEAVENLY_NOBLE_MAP.get(day_stem, [])
    found_branches = [b for b in noble_branches if b in all_branches]

    return {
        "detected": len(found_branches) > 0,
        "chinese": "天乙貴人",
        "english": "Heavenly Noble",
        "meaning": "Helpful people, support in times of need, protection",
        "noble_branches": found_branches
    }


def detect_academic_star(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Academic Star (文昌) - Writing and academic success.
    """
    day_stem = pillars[2][0]
    all_branches = _get_all_branches(pillars)

    academic_branch = ACADEMIC_STAR_MAP.get(day_stem)
    detected = academic_branch in all_branches if academic_branch else False

    return {
        "detected": detected,
        "chinese": "文昌",
        "english": "Academic Star",
        "meaning": "Academic success, writing talent, intellectual pursuits",
        "academic_branch": academic_branch if detected else None
    }


def detect_traveling_horse(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Traveling Horse (驛馬) - Movement and travel.
    """
    year_branch = pillars[0][1]
    day_branch = pillars[2][1]
    all_branches = _get_all_branches(pillars)

    horse_from_year = TRAVELING_HORSE_MAP.get(year_branch)
    horse_from_day = TRAVELING_HORSE_MAP.get(day_branch)

    detected = False
    locations = []

    if horse_from_year and horse_from_year in all_branches:
        detected = True
        locations.append({"source": "year", "horse_branch": horse_from_year})

    if horse_from_day and horse_from_day in all_branches:
        detected = True
        locations.append({"source": "day", "horse_branch": horse_from_day})

    return {
        "detected": detected,
        "chinese": "驛馬",
        "english": "Traveling Horse",
        "meaning": "Travel, movement, relocation, active career",
        "locations": locations
    }


def detect_robbery_star(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Robbery Star (劫煞) - Potential for loss.
    """
    year_branch = pillars[0][1]
    all_branches = _get_all_branches(pillars)

    robbery_branch = ROBBERY_STAR_MAP.get(year_branch)
    detected = robbery_branch in all_branches if robbery_branch else False

    return {
        "detected": detected,
        "chinese": "劫煞",
        "english": "Robbery Star",
        "meaning": "Potential for loss, competition, need for caution",
        "robbery_branch": robbery_branch if detected else None
    }


def detect_heavenly_virtue(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Heavenly Virtue (天德) - Protective blessing.
    """
    month_branch = pillars[1][1]
    all_stems = _get_all_stems(pillars)

    virtue_stem = HEAVENLY_VIRTUE_MAP.get(month_branch)
    detected = virtue_stem in all_stems if virtue_stem else False

    return {
        "detected": detected,
        "chinese": "天德",
        "english": "Heavenly Virtue",
        "meaning": "Divine protection, blessings, good fortune",
        "virtue_stem": virtue_stem if detected else None
    }


def detect_monthly_virtue(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Monthly Virtue (月德) - Monthly blessing.
    """
    month_branch = pillars[1][1]
    all_stems = _get_all_stems(pillars)

    virtue_stem = MONTHLY_VIRTUE_MAP.get(month_branch)
    detected = virtue_stem in all_stems if virtue_stem else False

    return {
        "detected": detected,
        "chinese": "月德",
        "english": "Monthly Virtue",
        "meaning": "Monthly protection, kindness, moral character",
        "virtue_stem": virtue_stem if detected else None
    }


def detect_taiji_noble(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Detect Tai Ji Noble (太極貴人) - Spiritual awareness.
    """
    day_stem = pillars[2][0]
    all_branches = _get_all_branches(pillars)

    taiji_branches = TAIJI_NOBLE_MAP.get(day_stem, [])
    found_branches = [b for b in taiji_branches if b in all_branches]

    return {
        "detected": len(found_branches) > 0,
        "chinese": "太極貴人",
        "english": "Tai Ji Noble",
        "meaning": "Spiritual insight, wisdom, metaphysical interests",
        "taiji_branches": found_branches
    }


def detect_symbolic_stars(
    pillars: List[Tuple[str, str]],
    stems_optional: List[str] = None
) -> Dict[str, Dict[str, Any]]:
    """
    Detect all symbolic stars in a BaZi chart.

    Args:
        pillars: Four Pillars as [(stem, branch), ...]
        stems_optional: Optional list of additional stems to check

    Returns:
        Dictionary of star_name -> detection details
    """
    return {
        "PeachBlossom": detect_peach_blossom(pillars),
        "HeavenlyNoble": detect_heavenly_noble(pillars),
        "AcademicStar": detect_academic_star(pillars),
        "TravelingHorse": detect_traveling_horse(pillars),
        "RobberyStar": detect_robbery_star(pillars),
        "HeavenlyVirtue": detect_heavenly_virtue(pillars),
        "MonthlyVirtue": detect_monthly_virtue(pillars),
        "TaiJiNoble": detect_taiji_noble(pillars)
    }


def get_detected_stars_summary(pillars: List[Tuple[str, str]]) -> List[str]:
    """
    Get a simple list of detected star names.

    Args:
        pillars: Four Pillars

    Returns:
        List of detected star names
    """
    all_stars = detect_symbolic_stars(pillars)
    return [name for name, details in all_stars.items() if details.get("detected")]
