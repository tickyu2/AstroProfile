"""
bazi_engine/life_palace.py

Life Palace (命宮) and Conception Palace (胎元) calculations.
Following Joey Yap conventions.

Life Palace: Derived from birth month and hour
Conception Palace: The month pillar 10 months before birth
"""

from typing import Dict, Tuple
from .utils import (
    HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_MAP,
    BRANCH_ELEMENT_MAP, stem_polarity
)


# =============================================================================
# LIFE PALACE (命宮) CALCULATION
# =============================================================================

def calculate_life_palace(
    month_branch: str,
    hour_branch: str
) -> Dict[str, any]:
    """
    Calculate the Life Palace (命宮) from month and hour branches.

    Formula: Life Palace Branch Index = (14 - month_idx - hour_idx) % 12
    Then find the Life Palace Stem based on the year stem.

    Args:
        month_branch: The Earthly Branch of the month pillar
        hour_branch: The Earthly Branch of the hour pillar

    Returns:
        Dict with Life Palace branch and interpretation
    """
    if month_branch not in EARTHLY_BRANCHES or hour_branch not in EARTHLY_BRANCHES:
        return {"error": "Invalid branch provided"}

    # Get branch indices (1-indexed for traditional calculation)
    # Zi=1, Chou=2, ... Hai=12
    month_idx = EARTHLY_BRANCHES.index(month_branch) + 1
    hour_idx = EARTHLY_BRANCHES.index(hour_branch) + 1

    # Life Palace formula
    life_palace_idx = (14 - month_idx - hour_idx)
    if life_palace_idx <= 0:
        life_palace_idx += 12
    if life_palace_idx > 12:
        life_palace_idx -= 12

    # Convert back to 0-indexed for array access
    life_palace_branch = EARTHLY_BRANCHES[life_palace_idx - 1]
    life_palace_element = BRANCH_ELEMENT_MAP.get(life_palace_branch, "")

    return {
        "branch": life_palace_branch,
        "branch_cn": BRANCH_TO_CN.get(life_palace_branch, ""),
        "element": life_palace_element,
        "interpretation": LIFE_PALACE_INTERPRETATIONS.get(life_palace_branch, ""),
        "characteristics": LIFE_PALACE_CHARACTERISTICS.get(life_palace_branch, [])
    }


def calculate_life_palace_stem(
    year_stem: str,
    month_branch: str,
    hour_branch: str
) -> Dict[str, any]:
    """
    Calculate the complete Life Palace with both stem and branch.

    The stem is derived from the year stem using the 五虎遁 (Five Tigers) formula.

    Args:
        year_stem: The Heavenly Stem of the year pillar
        month_branch: The Earthly Branch of the month pillar
        hour_branch: The Earthly Branch of the hour pillar

    Returns:
        Dict with complete Life Palace information
    """
    # Get the branch first
    palace = calculate_life_palace(month_branch, hour_branch)
    if "error" in palace:
        return palace

    # Calculate stem using Five Tigers formula
    # Same formula used for month stem from year stem
    if year_stem not in HEAVENLY_STEMS:
        palace["stem"] = None
        return palace

    year_stem_idx = HEAVENLY_STEMS.index(year_stem)

    # Five Tigers starting stems:
    # Jia/Ji year -> Bing starts at Yin
    # Yi/Geng year -> Wu starts at Yin
    # Bing/Xin year -> Geng starts at Yin
    # Ding/Ren year -> Ren starts at Yin
    # Wu/Gui year -> Jia starts at Yin
    five_tigers_base = [2, 4, 6, 8, 0]  # Bing, Wu, Geng, Ren, Jia
    base_stem_idx = five_tigers_base[year_stem_idx % 5]

    # Life palace branch offset from Yin
    palace_branch_idx = EARTHLY_BRANCHES.index(palace["branch"])
    yin_idx = EARTHLY_BRANCHES.index("Yin")
    offset = (palace_branch_idx - yin_idx) % 12

    # Calculate life palace stem
    life_palace_stem_idx = (base_stem_idx + offset) % 10
    life_palace_stem = HEAVENLY_STEMS[life_palace_stem_idx]

    palace["stem"] = life_palace_stem
    palace["stem_cn"] = STEM_TO_CN.get(life_palace_stem, "")
    palace["stem_element"] = ELEMENT_MAP.get(life_palace_stem, "")
    palace["gan_zhi"] = f"{life_palace_stem}-{palace['branch']}"

    return palace


# =============================================================================
# CONCEPTION PALACE (胎元) CALCULATION
# =============================================================================

def calculate_conception_palace(
    month_stem: str,
    month_branch: str
) -> Dict[str, any]:
    """
    Calculate the Conception Palace (胎元).

    This represents the month of conception (approximately 10 lunar months before birth).
    Formula: Add 1 to month stem index, add 3 to month branch index (with wrap)

    Args:
        month_stem: The Heavenly Stem of the month pillar
        month_branch: The Earthly Branch of the month pillar

    Returns:
        Dict with Conception Palace information
    """
    if month_stem not in HEAVENLY_STEMS or month_branch not in EARTHLY_BRANCHES:
        return {"error": "Invalid stem or branch provided"}

    # Conception stem: month stem + 1 (wrap at 10)
    month_stem_idx = HEAVENLY_STEMS.index(month_stem)
    conception_stem_idx = (month_stem_idx + 1) % 10
    conception_stem = HEAVENLY_STEMS[conception_stem_idx]

    # Conception branch: month branch + 3 (wrap at 12)
    month_branch_idx = EARTHLY_BRANCHES.index(month_branch)
    conception_branch_idx = (month_branch_idx + 3) % 12
    conception_branch = EARTHLY_BRANCHES[conception_branch_idx]

    return {
        "stem": conception_stem,
        "stem_cn": STEM_TO_CN.get(conception_stem, ""),
        "branch": conception_branch,
        "branch_cn": BRANCH_TO_CN.get(conception_branch, ""),
        "stem_element": ELEMENT_MAP.get(conception_stem, ""),
        "branch_element": BRANCH_ELEMENT_MAP.get(conception_branch, ""),
        "gan_zhi": f"{conception_stem}-{conception_branch}",
        "interpretation": "Represents the energy present at conception, influencing inherited traits and early life potential."
    }


# =============================================================================
# HELPER MAPPINGS
# =============================================================================

STEM_TO_CN: Dict[str, str] = {
    "Jia": "甲", "Yi": "乙", "Bing": "丙", "Ding": "丁", "Wu": "戊",
    "Ji": "己", "Geng": "庚", "Xin": "辛", "Ren": "壬", "Gui": "癸"
}

BRANCH_TO_CN: Dict[str, str] = {
    "Zi": "子", "Chou": "丑", "Yin": "寅", "Mao": "卯",
    "Chen": "辰", "Si": "巳", "Wu": "午", "Wei": "未",
    "Shen": "申", "You": "酉", "Xu": "戌", "Hai": "亥"
}


# =============================================================================
# LIFE PALACE INTERPRETATIONS
# =============================================================================

LIFE_PALACE_INTERPRETATIONS: Dict[str, str] = {
    "Zi": "Wisdom and deep thinking. You process life through analysis and reflection. Career paths in research, consulting, or specialized knowledge suit you.",
    "Chou": "Steady and persistent. You build security through patient effort. Success comes through reliability and long-term planning.",
    "Yin": "Ambitious and courageous. You naturally take initiative and lead. Career advancement comes through bold action and vision.",
    "Mao": "Gentle refinement and artistic sensitivity. You navigate life with grace and diplomacy. Success in creative or relationship-oriented fields.",
    "Chen": "Dynamic and transformative. You experience life in cycles of breakthrough and change. Power positions and leadership roles suit you.",
    "Si": "Intelligent and sophisticated. You have natural eloquence and cultural awareness. Success in communication, arts, or intellectual pursuits.",
    "Wu": "Passionate and expressive. You live with intensity and emotional depth. Leadership roles where charisma matters suit you.",
    "Wei": "Nurturing and supportive. You process life through relationships and care. Success in helping professions or creative arts.",
    "Shen": "Versatile and active. You thrive with variety and movement. Success in dynamic environments requiring adaptability.",
    "You": "Precise and refined. You approach life with attention to detail and quality. Success in specialized skills or aesthetic fields.",
    "Xu": "Loyal and protective. You navigate life with strong principles and boundaries. Success in positions of trust and responsibility.",
    "Hai": "Intuitive and spiritual. You process life through feeling and inner knowing. Success in healing, counseling, or creative vision."
}

LIFE_PALACE_CHARACTERISTICS: Dict[str, list] = {
    "Zi": ["analytical", "introspective", "wise", "reserved"],
    "Chou": ["patient", "reliable", "grounded", "persistent"],
    "Yin": ["ambitious", "courageous", "pioneering", "energetic"],
    "Mao": ["diplomatic", "artistic", "gentle", "refined"],
    "Chen": ["powerful", "transformative", "dynamic", "commanding"],
    "Si": ["intelligent", "eloquent", "cultured", "perceptive"],
    "Wu": ["passionate", "expressive", "charismatic", "intense"],
    "Wei": ["nurturing", "supportive", "artistic", "intuitive"],
    "Shen": ["versatile", "active", "adaptable", "resourceful"],
    "You": ["precise", "refined", "meticulous", "aesthetic"],
    "Xu": ["loyal", "protective", "principled", "responsible"],
    "Hai": ["intuitive", "spiritual", "imaginative", "receptive"]
}
