"""
bazi_engine/calendar_conv.py

Gregorian <-> Lunar calendar conversion helpers.
Uses sxtwl (寿星万年历) if available for high accuracy.
Falls back to lunardate for basic conversions.

sxtwl provides:
- Accurate lunar/solar conversions
- Exact solar term (jieqi) times
- Leap month handling
"""

from datetime import datetime
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)

# =============================================================================
# TRY IMPORTING SXTWL (PREFERRED)
# =============================================================================
try:
    import sxtwl
    _HAS_SXTWL = True
    logger.info("sxtwl imported successfully - using accurate Chinese calendar calculations")
except ImportError:
    _HAS_SXTWL = False
    logger.warning("sxtwl not available - falling back to lunardate (less accurate)")

# =============================================================================
# FALLBACK TO LUNARDATE
# =============================================================================
if not _HAS_SXTWL:
    try:
        from lunardate import LunarDate
        _HAS_LUNARDATE = True
    except ImportError:
        _HAS_LUNARDATE = False
        logger.warning("lunardate not available - lunar conversions will fail")
else:
    _HAS_LUNARDATE = False


def has_sxtwl() -> bool:
    """Check if sxtwl is available for accurate calculations."""
    return _HAS_SXTWL


def to_lunar(dt: datetime) -> Tuple[int, int, int, bool]:
    """
    Convert Gregorian date to Lunar date.

    Args:
        dt: Gregorian datetime

    Returns:
        Tuple of (lunar_year, lunar_month, lunar_day, is_leap_month)
    """
    if _HAS_SXTWL:
        try:
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            lunar_year = day.getLunarYear()
            lunar_month = day.getLunarMonth()
            lunar_day = day.getLunarDay()
            is_leap = day.isLunarLeap()
            return (lunar_year, lunar_month, lunar_day, is_leap)
        except Exception as e:
            logger.warning(f"sxtwl lunar conversion failed: {e}")

    if _HAS_LUNARDATE:
        try:
            ld = LunarDate.fromSolarDate(dt.year, dt.month, dt.day)
            is_leap = getattr(ld, 'isleap', False) or getattr(ld, 'isLeap', False)
            return (ld.year, ld.month, ld.day, is_leap)
        except Exception as e:
            logger.warning(f"lunardate conversion failed: {e}")

    # Fallback: return approximate values
    logger.error("No lunar calendar library available")
    return (dt.year, dt.month, dt.day, False)


def lunar_to_solar_info(
    lunar_year: int,
    lunar_month: int,
    lunar_day: int,
    is_leap: bool = False
) -> Optional[datetime]:
    """
    Convert Lunar date to Gregorian date.

    Args:
        lunar_year: Lunar year
        lunar_month: Lunar month (1-12)
        lunar_day: Lunar day
        is_leap: Whether this is a leap month

    Returns:
        Gregorian datetime or None if conversion fails
    """
    if _HAS_SXTWL:
        try:
            lunar = sxtwl.Lunar(lunar_year, lunar_month, lunar_day, is_leap)
            solar = lunar.toSolar()
            return datetime(solar.getSolarYear(), solar.getSolarMonth(), solar.getSolarDay())
        except Exception as e:
            logger.warning(f"sxtwl lunar->solar conversion failed: {e}")

    if _HAS_LUNARDATE:
        try:
            ld = LunarDate(lunar_year, lunar_month, lunar_day)
            solar = ld.toSolarDate()
            return datetime(solar.year, solar.month, solar.day)
        except Exception as e:
            logger.warning(f"lunardate lunar->solar conversion failed: {e}")

    logger.error("No lunar calendar library available for conversion")
    return None


def get_lunar_year_info(year: int) -> dict:
    """
    Get information about a lunar year.

    Args:
        year: Gregorian year

    Returns:
        Dict with lunar year info (leap month, etc.)
    """
    info = {
        "gregorian_year": year,
        "leap_month": None,
        "has_sxtwl": _HAS_SXTWL
    }

    if _HAS_SXTWL:
        try:
            # Get leap month for this lunar year
            # sxtwl can provide this information
            for month in range(1, 13):
                try:
                    # Check if this month has a leap variant
                    lunar = sxtwl.Lunar(year, month, 1, True)
                    if lunar:
                        info["leap_month"] = month
                        break
                except:
                    continue
        except Exception as e:
            logger.debug(f"Error getting lunar year info: {e}")

    return info


def get_gan_zhi_for_date(dt: datetime) -> Tuple[str, str]:
    """
    Get the Gan-Zhi (Heavenly Stem + Earthly Branch) for a date using sxtwl.

    This is more accurate than epoch-based calculation.

    Args:
        dt: Gregorian datetime

    Returns:
        Tuple of (stem, branch) in pinyin
    """
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES

    if _HAS_SXTWL:
        try:
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            # sxtwl 2.x uses GZ objects with tg (天干) and dz (地支) properties
            gz = day.getDayGZ()
            return (HEAVENLY_STEMS[gz.tg], EARTHLY_BRANCHES[gz.dz])
        except Exception as e:
            logger.warning(f"sxtwl Gan-Zhi calculation failed: {e}")

    # Fallback to epoch-based calculation
    return _epoch_gan_zhi(dt)


def _epoch_gan_zhi(dt: datetime) -> Tuple[str, str]:
    """
    Fallback epoch-based Gan-Zhi calculation.
    Less accurate than sxtwl but works without external libraries.
    """
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES

    # JiaZi anchor: February 2, 1984 was Jia-Zi day
    epoch = datetime(1984, 2, 2)
    delta_days = (dt.date() - epoch.date()).days

    stem_idx = delta_days % 10
    branch_idx = delta_days % 12

    return (HEAVENLY_STEMS[stem_idx], EARTHLY_BRANCHES[branch_idx])


def get_year_gan_zhi(dt: datetime) -> Tuple[str, str]:
    """
    Get the Gan-Zhi for the year pillar.
    Uses Lichun (Start of Spring) as year boundary per Joey Yap convention.

    Args:
        dt: Gregorian datetime

    Returns:
        Tuple of (stem, branch)
    """
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES
    from .solar_terms import lichun_datetime_for_year

    # Determine the BaZi year (based on Lichun)
    lichun = lichun_datetime_for_year(dt.year)
    if dt < lichun:
        bazi_year = dt.year - 1
    else:
        bazi_year = dt.year

    if _HAS_SXTWL:
        try:
            # Use sxtwl 2.x for accurate year Gan-Zhi
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            gz = day.getYearGZ()
            return (HEAVENLY_STEMS[gz.tg], EARTHLY_BRANCHES[gz.dz])
        except Exception as e:
            logger.warning(f"sxtwl year Gan-Zhi failed: {e}")

    # Fallback: 1984 was Jia-Zi year
    base_year = 1984
    offset = bazi_year - base_year
    stem_idx = offset % 10
    branch_idx = offset % 12

    return (HEAVENLY_STEMS[stem_idx], EARTHLY_BRANCHES[branch_idx])


def get_month_gan_zhi(dt: datetime) -> Tuple[str, str]:
    """
    Get the Gan-Zhi for the month pillar.
    Month boundaries are defined by solar terms (Jie 节).

    Args:
        dt: Gregorian datetime

    Returns:
        Tuple of (stem, branch)
    """
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES
    from .solar_terms import get_bazi_month_index

    if _HAS_SXTWL:
        try:
            # Use sxtwl 2.x for accurate month Gan-Zhi
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            gz = day.getMonthGZ()
            return (HEAVENLY_STEMS[gz.tg], EARTHLY_BRANCHES[gz.dz])
        except Exception as e:
            logger.warning(f"sxtwl month Gan-Zhi failed: {e}")

    # Fallback calculation
    year_stem, _ = get_year_gan_zhi(dt)
    month_idx = get_bazi_month_index(dt)

    year_stem_idx = HEAVENLY_STEMS.index(year_stem)
    # Month stem formula: (year_stem_idx * 2 + month_idx) % 10
    month_stem_idx = (year_stem_idx * 2 + month_idx) % 10
    # Month branch: Yin (Tiger) for month 1, Mao for month 2, etc.
    month_branch_idx = (month_idx + 2) % 12

    return (HEAVENLY_STEMS[month_stem_idx], EARTHLY_BRANCHES[month_branch_idx])


def get_hour_gan_zhi(dt: datetime, day_stem: str) -> Tuple[str, str]:
    """
    Get the Gan-Zhi for the hour pillar.

    Hour branches (12 two-hour periods):
    - 23:00-00:59 = Zi (子)
    - 01:00-02:59 = Chou (丑)
    - etc.

    Args:
        dt: Gregorian datetime
        day_stem: The day's Heavenly Stem

    Returns:
        Tuple of (stem, branch)
    """
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES

    hour = dt.hour

    # Determine hour branch index
    # 23:00-00:59 = Zi (index 0)
    if hour == 23:
        branch_idx = 0
    else:
        branch_idx = (hour + 1) // 2

    # Hour stem formula based on day stem
    day_stem_idx = HEAVENLY_STEMS.index(day_stem)
    # Hour stem = (day_stem_idx * 2 + branch_idx) % 10
    stem_idx = (day_stem_idx * 2 + branch_idx) % 10

    return (HEAVENLY_STEMS[stem_idx], EARTHLY_BRANCHES[branch_idx])
