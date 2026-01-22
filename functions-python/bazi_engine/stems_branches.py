"""
bazi_engine/stems_branches.py

Four Pillars (四柱) generation using solar-term-aware calculations.
Follows Joey Yap conventions:
- Year pillar: Based on Lichun (Start of Spring), not Jan 1
- Month pillar: Based on Jie (节) solar terms, not lunar month
- Day pillar: Accurate Gan-Zhi cycle (sxtwl preferred)
- Hour pillar: 12 two-hour periods with stem derived from day stem
"""

from datetime import datetime
from typing import List, Tuple, Dict, Any
import logging

from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_MAP
from .calendar_conv import (
    get_year_gan_zhi,
    get_month_gan_zhi,
    get_gan_zhi_for_date,
    get_hour_gan_zhi,
    has_sxtwl
)
from .solar_terms import lichun_datetime_for_year

logger = logging.getLogger(__name__)


def four_pillars_from_datetime(dt: datetime) -> List[Tuple[str, str]]:
    """
    Generate the Four Pillars (四柱) for a given datetime.

    Returns pillars in order: Year, Month, Day, Hour
    Each pillar is a tuple of (Heavenly Stem, Earthly Branch).

    Args:
        dt: Birth datetime (should include time for accurate hour pillar)

    Returns:
        List of 4 tuples: [(year_stem, year_branch), (month_stem, month_branch),
                          (day_stem, day_branch), (hour_stem, hour_branch)]

    Example:
        >>> from datetime import datetime
        >>> pillars = four_pillars_from_datetime(datetime(1990, 5, 15, 14, 30))
        >>> print(pillars)
        [('Geng', 'Wu'), ('Xin', 'Si'), ('Gui', 'Hai'), ('Gui', 'Wei')]
    """
    year_pillar = year_pillar_from_datetime(dt)
    month_pillar = month_pillar_from_solar_term(dt)
    day_pillar_result = day_pillar(dt)
    hour_pillar_result = hour_pillar(day_pillar_result[0], dt.hour)

    return [year_pillar, month_pillar, day_pillar_result, hour_pillar_result]


def year_pillar_from_datetime(dt: datetime) -> Tuple[str, str]:
    """
    Calculate the Year Pillar for a datetime.

    Joey Yap convention: Year changes at Lichun (立春), not Jan 1.

    Args:
        dt: Datetime to calculate for

    Returns:
        Tuple of (stem, branch)
    """
    return get_year_gan_zhi(dt)


def year_pillar_from_lunar_year(lunar_year: int) -> Tuple[str, str]:
    """
    Calculate the Year Pillar from a lunar year number.

    Uses the 60-year Jia-Zi cycle anchored to 1984 (Jia-Zi year).

    Args:
        lunar_year: Lunar year number

    Returns:
        Tuple of (stem, branch)
    """
    base_year = 1984  # Jia-Zi year
    offset = lunar_year - base_year

    stem_idx = offset % 10
    branch_idx = offset % 12

    # Handle negative offsets
    if stem_idx < 0:
        stem_idx += 10
    if branch_idx < 0:
        branch_idx += 12

    return (HEAVENLY_STEMS[stem_idx], EARTHLY_BRANCHES[branch_idx])


def month_pillar_from_solar_term(dt: datetime) -> Tuple[str, str]:
    """
    Calculate the Month Pillar using solar term boundaries.

    Joey Yap convention: Month changes at Jie (节) solar terms:
    - Month 1 (Tiger): Lichun to Jingzhe
    - Month 2 (Rabbit): Jingzhe to Qingming
    - etc.

    The month stem is derived from the year stem using:
    month_stem = (year_stem_idx * 2 + month_index) % 10

    Args:
        dt: Datetime to calculate for

    Returns:
        Tuple of (stem, branch)
    """
    return get_month_gan_zhi(dt)


def day_pillar(dt: datetime) -> Tuple[str, str]:
    """
    Calculate the Day Pillar.

    Uses sxtwl for accuracy if available, otherwise falls back to
    epoch-based calculation.

    Args:
        dt: Datetime to calculate for

    Returns:
        Tuple of (stem, branch)
    """
    return get_gan_zhi_for_date(dt)


def hour_pillar(day_stem: str, hour: int) -> Tuple[str, str]:
    """
    Calculate the Hour Pillar.

    Hour branches (时辰) are 12 two-hour periods:
    - 23:00-00:59 = Zi (子) - Rat hour
    - 01:00-02:59 = Chou (丑) - Ox hour
    - 03:00-04:59 = Yin (寅) - Tiger hour
    - etc.

    The hour stem is derived from the day stem:
    hour_stem = (day_stem_idx * 2 + hour_branch_idx) % 10

    Note: 23:00-23:59 is early Zi hour (belongs to next day's stem calculation
    in some schools, but we follow Joey Yap's common convention here).

    Args:
        day_stem: The day's Heavenly Stem
        hour: Hour of day (0-23)

    Returns:
        Tuple of (stem, branch)
    """
    # Hour branch index
    if hour == 23:
        branch_idx = 0  # Zi hour starts at 23:00
    else:
        branch_idx = (hour + 1) // 2

    # Hour stem calculation
    day_stem_idx = HEAVENLY_STEMS.index(day_stem)
    stem_idx = (day_stem_idx * 2 + branch_idx) % 10

    return (HEAVENLY_STEMS[stem_idx], EARTHLY_BRANCHES[branch_idx])


def get_day_master(pillars: List[Tuple[str, str]]) -> str:
    """
    Get the Day Master (日主) from the Four Pillars.

    The Day Master is the Heavenly Stem of the Day Pillar.
    It represents the self in BaZi analysis.

    Args:
        pillars: Four Pillars as returned by four_pillars_from_datetime

    Returns:
        The Day Master stem (e.g., "Jia", "Yi", etc.)
    """
    if len(pillars) < 3:
        raise ValueError("Pillars must contain at least Year, Month, and Day")
    return pillars[2][0]


def get_day_master_element(pillars: List[Tuple[str, str]]) -> str:
    """
    Get the Day Master's element.

    Args:
        pillars: Four Pillars

    Returns:
        Element of the Day Master (e.g., "Wood", "Fire", etc.)
    """
    day_master = get_day_master(pillars)
    return ELEMENT_MAP[day_master]


def pillars_to_dict(pillars: List[Tuple[str, str]]) -> Dict[str, Any]:
    """
    Convert Four Pillars to a detailed dictionary format.

    Args:
        pillars: Four Pillars list

    Returns:
        Dictionary with full pillar information
    """
    pillar_names = ["year", "month", "day", "hour"]
    result = {
        "pillars": {},
        "day_master": get_day_master(pillars),
        "day_master_element": get_day_master_element(pillars),
        "using_sxtwl": has_sxtwl()
    }

    for i, (stem, branch) in enumerate(pillars):
        name = pillar_names[i] if i < len(pillar_names) else f"pillar_{i}"
        result["pillars"][name] = {
            "stem": stem,
            "branch": branch,
            "gan_zhi": f"{stem}-{branch}",
            "element": ELEMENT_MAP[stem]
        }

    return result


def pillars_to_gan_zhi_string(pillars: List[Tuple[str, str]]) -> str:
    """
    Convert Four Pillars to a compact Gan-Zhi string.

    Args:
        pillars: Four Pillars

    Returns:
        String like "Geng-Wu Xin-Si Gui-Hai Gui-Wei"
    """
    return " ".join(f"{stem}-{branch}" for stem, branch in pillars)


def validate_datetime_for_bazi(dt: datetime) -> Dict[str, Any]:
    """
    Validate a datetime for BaZi calculation and return metadata.

    Args:
        dt: Datetime to validate

    Returns:
        Dictionary with validation info and warnings
    """
    result = {
        "valid": True,
        "warnings": [],
        "info": {}
    }

    # Check if time is provided (not midnight)
    if dt.hour == 0 and dt.minute == 0:
        result["warnings"].append(
            "Time is exactly midnight - hour pillar may be inaccurate if "
            "actual birth time was not recorded. Consider using birth certificate time."
        )

    # Check if near Lichun boundary
    lichun = lichun_datetime_for_year(dt.year)
    days_to_lichun = abs((dt - lichun).days)
    if days_to_lichun <= 3:
        result["warnings"].append(
            f"Birth date is within 3 days of Lichun ({lichun.strftime('%Y-%m-%d')}). "
            "Year pillar accuracy depends on exact Lichun time."
        )
        result["info"]["near_lichun"] = True
        result["info"]["lichun_date"] = lichun.isoformat()

    # Check if near hour boundary (odd hour)
    if dt.minute >= 55 or dt.minute <= 5:
        result["warnings"].append(
            "Birth time is near an hour boundary. If the recorded time is "
            "approximate, the hour pillar may be for the adjacent period."
        )

    result["info"]["using_sxtwl"] = has_sxtwl()

    return result
