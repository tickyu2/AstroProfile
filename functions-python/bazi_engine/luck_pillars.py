"""
bazi_engine/luck_pillars.py

DaYun (大運) - Luck Pillars calculation following Joey Yap conventions.

The Luck Pillars represent 10-year periods of influence in a person's life.
Direction of counting (forward/backward from month pillar) depends on:
- Gender (male/female)
- Year Stem polarity (Yang/Yin)

Formula:
- Yang male or Yin female: Count FORWARD from month pillar
- Yin male or Yang female: Count BACKWARD from month pillar

Starting age calculation:
- Days from birth to next/previous Jie (solar term boundary)
- 3 days = 1 year of luck pillar onset
"""

from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Any, Optional
import logging

from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES
from .solar_terms import (
    lichun_datetime_for_year,
    get_jie_boundaries_for_month,
    get_next_jie_datetime,
    get_prev_jie_datetime
)
from .stems_branches import month_pillar_from_solar_term

logger = logging.getLogger(__name__)


def is_yang_stem(stem: str) -> bool:
    """
    Check if a Heavenly Stem is Yang (positive polarity).

    Yang stems: Jia, Bing, Wu, Geng, Ren (odd indices)
    Yin stems: Yi, Ding, Ji, Xin, Gui (even indices)
    """
    yang_stems = {"Jia", "Bing", "Wu", "Geng", "Ren"}
    return stem in yang_stems


def get_luck_direction(year_stem: str, is_male: bool) -> str:
    """
    Determine the direction to count luck pillars.

    Rules:
    - Yang year stem + male = Forward (顺行)
    - Yin year stem + female = Forward (顺行)
    - Yang year stem + female = Backward (逆行)
    - Yin year stem + male = Backward (逆行)

    Args:
        year_stem: Year pillar's Heavenly Stem
        is_male: True for male, False for female

    Returns:
        "forward" or "backward"
    """
    is_yang = is_yang_stem(year_stem)

    # Yang male or Yin female = Forward
    if (is_yang and is_male) or (not is_yang and not is_male):
        return "forward"
    else:
        return "backward"


def calculate_onset_age(
    birth_dt: datetime,
    direction: str
) -> Tuple[int, int, int]:
    """
    Calculate the age when the first luck pillar begins.

    Based on days between birth and the relevant Jie (solar term boundary):
    - Forward: Count to NEXT Jie
    - Backward: Count to PREVIOUS Jie

    Conversion: 3 days = 1 year, 1 day = 4 months

    Args:
        birth_dt: Birth datetime
        direction: "forward" or "backward"

    Returns:
        Tuple of (years, months, days) until first luck pillar
    """
    if direction == "forward":
        target_jie = get_next_jie_datetime(birth_dt)
    else:
        target_jie = get_prev_jie_datetime(birth_dt)

    if target_jie is None:
        # Fallback: approximate 3 years
        logger.warning("Could not determine Jie boundary, using default onset age")
        return (3, 0, 0)

    # Calculate days difference
    delta = abs((target_jie - birth_dt).total_seconds() / 86400)
    total_days = int(delta)

    # 3 days = 1 year of luck pillar onset
    years = total_days // 3
    remaining_days = total_days % 3

    # 1 day = 4 months
    months = remaining_days * 4

    # Handle edge case: if exactly on Jie, first pillar starts at 0
    if total_days == 0:
        return (0, 0, 0)

    return (years, months, 0)


def generate_luck_pillars(
    month_stem: str,
    month_branch: str,
    direction: str,
    count: int = 8
) -> List[Tuple[str, str]]:
    """
    Generate the sequence of luck pillars.

    Args:
        month_stem: Month pillar's Heavenly Stem
        month_branch: Month pillar's Earthly Branch
        direction: "forward" or "backward"
        count: Number of luck pillars to generate (default 8 = 80 years)

    Returns:
        List of (stem, branch) tuples representing each 10-year luck pillar
    """
    pillars = []

    stem_idx = HEAVENLY_STEMS.index(month_stem)
    branch_idx = EARTHLY_BRANCHES.index(month_branch)

    step = 1 if direction == "forward" else -1

    for i in range(1, count + 1):
        new_stem_idx = (stem_idx + (i * step)) % 10
        new_branch_idx = (branch_idx + (i * step)) % 12

        pillars.append((
            HEAVENLY_STEMS[new_stem_idx],
            EARTHLY_BRANCHES[new_branch_idx]
        ))

    return pillars


def calculate_dayun(
    birth_dt: datetime,
    year_pillar: Tuple[str, str],
    month_pillar: Tuple[str, str],
    is_male: bool,
    pillar_count: int = 8
) -> Dict[str, Any]:
    """
    Calculate complete DaYun (大運) information.

    Args:
        birth_dt: Birth datetime
        year_pillar: (stem, branch) of year pillar
        month_pillar: (stem, branch) of month pillar
        is_male: True for male, False for female
        pillar_count: Number of luck pillars to calculate (default 8)

    Returns:
        Dict with direction, onset_age, and luck_pillars with age ranges
    """
    year_stem = year_pillar[0]
    month_stem, month_branch = month_pillar

    # Determine direction
    direction = get_luck_direction(year_stem, is_male)

    # Calculate onset age
    onset_years, onset_months, onset_days = calculate_onset_age(birth_dt, direction)

    # Generate luck pillars
    raw_pillars = generate_luck_pillars(
        month_stem,
        month_branch,
        direction,
        pillar_count
    )

    # Add age ranges to each pillar
    luck_pillars = []
    start_age = onset_years
    if onset_months >= 6:
        start_age += 1  # Round up if 6+ months

    for i, (stem, branch) in enumerate(raw_pillars):
        pillar_start = start_age + (i * 10)
        pillar_end = pillar_start + 9

        luck_pillars.append({
            "pillar_number": i + 1,
            "stem": stem,
            "branch": branch,
            "ganZhi": f"{stem}{branch}",
            "age_start": pillar_start,
            "age_end": pillar_end,
            "age_range": f"{pillar_start}-{pillar_end}"
        })

    return {
        "direction": direction,
        "direction_chinese": "顺行" if direction == "forward" else "逆行",
        "onset_age": {
            "years": onset_years,
            "months": onset_months,
            "days": onset_days,
            "description": f"First luck pillar begins at age {onset_years}" +
                          (f" and {onset_months} months" if onset_months > 0 else "")
        },
        "luck_pillars": luck_pillars,
        "interpretation": {
            "is_male": is_male,
            "year_stem_polarity": "Yang" if is_yang_stem(year_stem) else "Yin",
            "explanation": _get_direction_explanation(year_stem, is_male)
        }
    }


def _get_direction_explanation(year_stem: str, is_male: bool) -> str:
    """Generate explanation for luck pillar direction."""
    polarity = "Yang" if is_yang_stem(year_stem) else "Yin"
    gender = "male" if is_male else "female"
    direction = get_luck_direction(year_stem, is_male)

    if direction == "forward":
        return (f"{polarity} {gender}: Luck pillars proceed forward from the month pillar. "
                f"Life experiences tend to accelerate and expand over time.")
    else:
        return (f"{polarity} {gender}: Luck pillars proceed backward from the month pillar. "
                f"Life experiences often involve revisiting and integrating past themes.")


def get_current_luck_pillar(
    dayun: Dict[str, Any],
    current_age: int
) -> Optional[Dict[str, Any]]:
    """
    Find which luck pillar is active at a given age.

    Args:
        dayun: DaYun result from calculate_dayun()
        current_age: Person's current age

    Returns:
        The active luck pillar dict, or None if before first pillar
    """
    for pillar in dayun["luck_pillars"]:
        if pillar["age_start"] <= current_age <= pillar["age_end"]:
            return pillar

    # If younger than first pillar onset
    if dayun["luck_pillars"] and current_age < dayun["luck_pillars"][0]["age_start"]:
        return {
            "pillar_number": 0,
            "status": "pre_onset",
            "message": f"Luck pillars begin at age {dayun['onset_age']['years']}",
            "next_pillar": dayun["luck_pillars"][0]
        }

    # If older than last calculated pillar
    return None


def dayun_for_birth(
    birth_dt: datetime,
    is_male: bool,
    pillar_count: int = 8
) -> Dict[str, Any]:
    """
    Convenience function to calculate DaYun from birth datetime.

    This function calculates the Four Pillars internally.

    Args:
        birth_dt: Birth datetime
        is_male: True for male, False for female
        pillar_count: Number of luck pillars to calculate

    Returns:
        Complete DaYun information
    """
    from .stems_branches import four_pillars_from_datetime

    pillars = four_pillars_from_datetime(birth_dt)

    return calculate_dayun(
        birth_dt=birth_dt,
        year_pillar=pillars[0],
        month_pillar=pillars[1],
        is_male=is_male,
        pillar_count=pillar_count
    )


# =============================================================================
# LIUNIAN (流年) - ANNUAL PILLAR
# =============================================================================

def calculate_liunian(year: int) -> Dict[str, Any]:
    """
    Calculate the LiuNian (流年) - Annual Pillar for a given year.

    The annual pillar is derived from the sexagenary cycle (60-year cycle).
    This is the same as the Year Pillar calculation.

    Note: BaZi year starts at Lichun (立春), typically Feb 4.
    For simplicity, this uses the Gregorian year. For precision
    around Lichun, use calculate_liunian_precise().

    Args:
        year: Gregorian year (e.g., 2026)

    Returns:
        Dict with stem, branch, element, and interpretations
    """
    from .utils import ELEMENT_MAP, stem_polarity

    # Sexagenary cycle calculation
    # Reference: 1984 = Jia Zi (甲子) year
    cycle_offset = (year - 1984) % 60

    stem_idx = cycle_offset % 10
    branch_idx = cycle_offset % 12

    stem = HEAVENLY_STEMS[stem_idx]
    branch = EARTHLY_BRANCHES[branch_idx]
    element = ELEMENT_MAP.get(stem, "")
    polarity = stem_polarity(stem)

    return {
        "year": year,
        "stem": stem,
        "branch": branch,
        "ganZhi": f"{stem}{branch}",
        "ganZhi_cn": _get_ganzhi_cn(stem, branch),
        "element": element,
        "polarity": polarity,
        "animal": _branch_to_animal(branch),
        "description": f"{year} is a {element} {_branch_to_animal(branch)} year"
    }


def calculate_liunian_precise(target_date: datetime) -> Dict[str, Any]:
    """
    Calculate LiuNian with Lichun (立春) precision.

    Before Lichun (~Feb 4), the year is still the previous BaZi year.

    Args:
        target_date: The date to calculate for

    Returns:
        Dict with stem, branch, and whether it's before Lichun
    """
    year = target_date.year

    # Get Lichun for this year
    lichun = lichun_datetime_for_year(year)

    # If before Lichun, use previous year
    if lichun and target_date < lichun:
        bazi_year = year - 1
        before_lichun = True
    else:
        bazi_year = year
        before_lichun = False

    result = calculate_liunian(bazi_year)
    result["gregorian_year"] = year
    result["bazi_year"] = bazi_year
    result["before_lichun"] = before_lichun
    if lichun:
        result["lichun_date"] = lichun.isoformat()

    return result


def get_liunian_for_age(birth_dt: datetime, age: int) -> Dict[str, Any]:
    """
    Get the LiuNian for when a person is a specific age.

    Args:
        birth_dt: Birth datetime
        age: Age to calculate for

    Returns:
        LiuNian for that age with additional context
    """
    target_year = birth_dt.year + age
    liunian = calculate_liunian(target_year)
    liunian["age"] = age

    return liunian


# =============================================================================
# XIAOYUN (小運) - MINOR LUCK / SMALL LUCK CYCLES
# =============================================================================

def calculate_xiaoyun(
    birth_dt: datetime,
    year_pillar: Tuple[str, str],
    hour_pillar: Tuple[str, str],
    is_male: bool,
    age: int
) -> Dict[str, Any]:
    """
    Calculate XiaoYun (小運) - Minor Luck for a specific age.

    XiaoYun represents the year-by-year luck before DaYun begins,
    and continues alongside DaYun as a supplementary influence.

    Calculation:
    - XiaoYun starts from the Hour Pillar
    - Direction follows same rule as DaYun (Yang male/Yin female = forward)
    - Each step = 1 year

    Args:
        birth_dt: Birth datetime
        year_pillar: Year pillar (stem, branch)
        hour_pillar: Hour pillar (stem, branch)
        is_male: True for male
        age: Age to calculate XiaoYun for

    Returns:
        XiaoYun pillar for the given age
    """
    from .utils import ELEMENT_MAP

    year_stem = year_pillar[0]
    hour_stem, hour_branch = hour_pillar

    # Direction follows same rules as DaYun
    direction = get_luck_direction(year_stem, is_male)
    step = 1 if direction == "forward" else -1

    # Calculate the XiaoYun pillar for this age
    # XiaoYun starts from hour pillar at age 1
    stem_idx = HEAVENLY_STEMS.index(hour_stem)
    branch_idx = EARTHLY_BRANCHES.index(hour_branch)

    # Move from hour pillar based on age
    new_stem_idx = (stem_idx + (age * step)) % 10
    new_branch_idx = (branch_idx + (age * step)) % 12

    stem = HEAVENLY_STEMS[new_stem_idx]
    branch = EARTHLY_BRANCHES[new_branch_idx]

    return {
        "age": age,
        "stem": stem,
        "branch": branch,
        "ganZhi": f"{stem}{branch}",
        "ganZhi_cn": _get_ganzhi_cn(stem, branch),
        "element": ELEMENT_MAP.get(stem, ""),
        "direction": direction,
        "description": f"Minor luck at age {age}: {stem}-{branch}"
    }


def calculate_xiaoyun_range(
    birth_dt: datetime,
    year_pillar: Tuple[str, str],
    hour_pillar: Tuple[str, str],
    is_male: bool,
    start_age: int = 1,
    end_age: int = 10
) -> List[Dict[str, Any]]:
    """
    Calculate XiaoYun for a range of ages.

    Args:
        birth_dt: Birth datetime
        year_pillar: Year pillar
        hour_pillar: Hour pillar
        is_male: True for male
        start_age: Starting age (default 1)
        end_age: Ending age (default 10)

    Returns:
        List of XiaoYun pillars for each age
    """
    return [
        calculate_xiaoyun(birth_dt, year_pillar, hour_pillar, is_male, age)
        for age in range(start_age, end_age + 1)
    ]


# =============================================================================
# COMPREHENSIVE CURRENT LUCK HELPER
# =============================================================================

def get_current_luck_info(
    birth_dt: datetime,
    is_male: bool,
    target_date: datetime = None
) -> Dict[str, Any]:
    """
    Get comprehensive current luck information.

    This is the main helper that returns:
    - Current DaYun (10-year luck pillar)
    - Current LiuNian (annual pillar)
    - Current XiaoYun (minor luck)
    - Years remaining in current DaYun
    - Upcoming transitions

    Args:
        birth_dt: Birth datetime
        is_male: True for male
        target_date: Date to calculate for (defaults to now)

    Returns:
        Comprehensive luck status dictionary
    """
    from .stems_branches import four_pillars_from_datetime
    from .utils import ELEMENT_MAP

    if target_date is None:
        target_date = datetime.now()

    # Calculate age
    age = target_date.year - birth_dt.year
    if (target_date.month, target_date.day) < (birth_dt.month, birth_dt.day):
        age -= 1

    # Get Four Pillars
    pillars = four_pillars_from_datetime(birth_dt)
    year_pillar = pillars[0]
    hour_pillar = pillars[3]

    # Calculate DaYun
    dayun = dayun_for_birth(birth_dt, is_male, pillar_count=10)

    # Get current DaYun pillar
    current_dayun = get_current_luck_pillar(dayun, age)

    # Calculate LiuNian
    current_liunian = calculate_liunian_precise(target_date)

    # Calculate XiaoYun
    current_xiaoyun = calculate_xiaoyun(
        birth_dt, year_pillar, hour_pillar, is_male, age
    )

    # Calculate years remaining in current DaYun
    years_remaining = None
    next_dayun_transition = None
    if current_dayun and current_dayun.get("age_end"):
        years_remaining = current_dayun["age_end"] - age + 1
        next_dayun_transition = {
            "age": current_dayun["age_end"] + 1,
            "year": birth_dt.year + current_dayun["age_end"] + 1
        }
        # Get the next DaYun pillar
        next_pillar_num = current_dayun.get("pillar_number", 0)
        if next_pillar_num < len(dayun["luck_pillars"]):
            next_dayun_transition["next_pillar"] = dayun["luck_pillars"][next_pillar_num]

    # Build comprehensive result
    result = {
        "calculation_date": target_date.isoformat(),
        "birth_date": birth_dt.isoformat(),
        "current_age": age,
        "is_male": is_male,

        # Current DaYun (10-year luck)
        "dayun": {
            "current": current_dayun,
            "direction": dayun["direction"],
            "direction_chinese": dayun["direction_chinese"],
            "years_remaining": years_remaining,
            "next_transition": next_dayun_transition,
            "onset_age": dayun["onset_age"]
        },

        # Current LiuNian (annual luck)
        "liunian": current_liunian,

        # Current XiaoYun (minor luck)
        "xiaoyun": current_xiaoyun,

        # Combined interpretation
        "summary": _generate_luck_summary(current_dayun, current_liunian, current_xiaoyun)
    }

    return result


def _generate_luck_summary(
    dayun: Optional[Dict],
    liunian: Dict,
    xiaoyun: Dict
) -> Dict[str, str]:
    """Generate a summary of current luck influences."""
    summary = {
        "annual": f"{liunian['year']} is a {liunian['element']} {liunian['animal']} year",
        "minor": f"Minor luck influence: {xiaoyun['ganZhi']}"
    }

    if dayun and dayun.get("stem"):
        from .utils import ELEMENT_MAP
        dayun_element = ELEMENT_MAP.get(dayun["stem"], "")
        summary["major"] = f"10-year period: {dayun['ganZhi']} ({dayun_element})"
        summary["full"] = (
            f"Currently in the {dayun['ganZhi']} DaYun period, "
            f"experiencing {liunian['ganZhi']} annual energy, "
            f"with {xiaoyun['ganZhi']} minor luck influence."
        )
    elif dayun and dayun.get("status") == "pre_onset":
        summary["major"] = f"DaYun begins at age {dayun.get('next_pillar', {}).get('age_start', 'N/A')}"
        summary["full"] = (
            f"Still in pre-DaYun phase. "
            f"Experiencing {liunian['ganZhi']} annual energy, "
            f"with {xiaoyun['ganZhi']} minor luck dominant."
        )

    return summary


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def _get_ganzhi_cn(stem: str, branch: str) -> str:
    """Get Chinese characters for GanZhi."""
    stem_cn = {
        "Jia": "甲", "Yi": "乙", "Bing": "丙", "Ding": "丁", "Wu": "戊",
        "Ji": "己", "Geng": "庚", "Xin": "辛", "Ren": "壬", "Gui": "癸"
    }
    branch_cn = {
        "Zi": "子", "Chou": "丑", "Yin": "寅", "Mao": "卯",
        "Chen": "辰", "Si": "巳", "Wu": "午", "Wei": "未",
        "Shen": "申", "You": "酉", "Xu": "戌", "Hai": "亥"
    }
    return f"{stem_cn.get(stem, stem)}{branch_cn.get(branch, branch)}"


def _branch_to_animal(branch: str) -> str:
    """Convert Earthly Branch to zodiac animal."""
    animals = {
        "Zi": "Rat", "Chou": "Ox", "Yin": "Tiger", "Mao": "Rabbit",
        "Chen": "Dragon", "Si": "Snake", "Wu": "Horse", "Wei": "Goat",
        "Shen": "Monkey", "You": "Rooster", "Xu": "Dog", "Hai": "Pig"
    }
    return animals.get(branch, branch)
