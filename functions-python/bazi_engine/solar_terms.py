"""
bazi_engine/solar_terms.py

Solar term (节气) calculations for accurate BaZi month boundaries.
Uses sxtwl for exact times when available.

Joey Yap convention:
- Year starts at Lichun (立春 - Start of Spring)
- Months are defined by "Jie" (节) solar terms, not lunar calendar
- DaYun start age is calculated from days to nearest Lichun
"""

from datetime import datetime, timedelta
from typing import Optional, List, Tuple, Dict
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

# Try importing sxtwl
try:
    import sxtwl
    _HAS_SXTWL = True
except ImportError:
    _HAS_SXTWL = False

# =============================================================================
# APPROXIMATE SOLAR TERM DATES (FALLBACK)
# =============================================================================
# These are approximate dates when sxtwl is not available
# Format: (month, day) for each solar term starting from Lichun

APPROX_SOLAR_TERMS = {
    "Lichun": (2, 4),      # 立春
    "Yushui": (2, 19),     # 雨水
    "Jingzhe": (3, 6),     # 惊蛰
    "Chunfen": (3, 21),    # 春分
    "Qingming": (4, 5),    # 清明
    "Guyu": (4, 20),       # 谷雨
    "Lixia": (5, 6),       # 立夏
    "Xiaoman": (5, 21),    # 小满
    "Mangzhong": (6, 6),   # 芒种
    "Xiazhi": (6, 21),     # 夏至
    "Xiaoshu": (7, 7),     # 小暑
    "Dashu": (7, 23),      # 大暑
    "Liqiu": (8, 7),       # 立秋
    "Chushu": (8, 23),     # 处暑
    "Bailu": (9, 8),       # 白露
    "Qiufen": (9, 23),     # 秋分
    "Hanlu": (10, 8),      # 寒露
    "Shuangjiang": (10, 23), # 霜降
    "Lidong": (11, 7),     # 立冬
    "Xiaoxue": (11, 22),   # 小雪
    "Daxue": (12, 7),      # 大雪
    "Dongzhi": (12, 22),   # 冬至
    "Xiaohan": (1, 6),     # 小寒
    "Dahan": (1, 20)       # 大寒
}

# Month-starting solar terms (Jie 节) - these define BaZi month boundaries
MONTH_JIE_TERMS = [
    "Lichun",      # Month 1 - Tiger (寅)
    "Jingzhe",     # Month 2 - Rabbit (卯)
    "Qingming",    # Month 3 - Dragon (辰)
    "Lixia",       # Month 4 - Snake (巳)
    "Mangzhong",   # Month 5 - Horse (午)
    "Xiaoshu",     # Month 6 - Goat (未)
    "Liqiu",       # Month 7 - Monkey (申)
    "Bailu",       # Month 8 - Rooster (酉)
    "Hanlu",       # Month 9 - Dog (戌)
    "Lidong",      # Month 10 - Pig (亥)
    "Daxue",       # Month 11 - Rat (子)
    "Xiaohan"      # Month 12 - Ox (丑)
]

# Chinese names for solar term lookup in sxtwl
SOLAR_TERM_CN = {
    "Lichun": "立春",
    "Yushui": "雨水",
    "Jingzhe": "惊蛰",
    "Chunfen": "春分",
    "Qingming": "清明",
    "Guyu": "谷雨",
    "Lixia": "立夏",
    "Xiaoman": "小满",
    "Mangzhong": "芒种",
    "Xiazhi": "夏至",
    "Xiaoshu": "小暑",
    "Dashu": "大暑",
    "Liqiu": "立秋",
    "Chushu": "处暑",
    "Bailu": "白露",
    "Qiufen": "秋分",
    "Hanlu": "寒露",
    "Shuangjiang": "霜降",
    "Lidong": "立冬",
    "Xiaoxue": "小雪",
    "Daxue": "大雪",
    "Dongzhi": "冬至",
    "Xiaohan": "小寒",
    "Dahan": "大寒"
}


@lru_cache(maxsize=256)
def lichun_datetime_for_year(year: int) -> datetime:
    """
    Get the exact datetime for Lichun (立春 - Start of Spring) for a given year.

    This is THE critical solar term for BaZi:
    - Year pillar changes at Lichun, not Jan 1
    - DaYun start age calculated from birth to Lichun

    CACHED: This function is called frequently and the result never changes
    for a given year. Caching eliminates 99% of repeated sxtwl calls.

    Args:
        year: Gregorian year

    Returns:
        Datetime of Lichun (exact if sxtwl available, approximate otherwise)
    """
    if _HAS_SXTWL:
        try:
            # sxtwl 2.x: getJieQiByYear returns JieQi objects with jqIndex and jd
            # jqIndex 3 = Lichun (立春)
            # The function returns JieQi for the given Gregorian year
            jqs = sxtwl.getJieQiByYear(year)
            for jq in jqs:
                if jq.jqIndex == 3:  # Lichun is index 3 in sxtwl
                    dd = sxtwl.JD2DD(jq.jd)
                    return datetime(dd.Y, dd.M, dd.D, int(dd.h), int(dd.m), int(dd.s))
        except Exception as e:
            logger.warning(f"sxtwl Lichun lookup failed: {e}")

    # Fallback: approximate Feb 4
    return datetime(year, 2, 4, 0, 0, 0)


def nearest_lichun_after(dt: datetime) -> datetime:
    """
    Get the nearest Lichun datetime AFTER the given date.

    Used for DaYun start age calculation.

    Args:
        dt: Reference datetime

    Returns:
        The next Lichun after dt
    """
    lichun_this_year = lichun_datetime_for_year(dt.year)

    if dt < lichun_this_year:
        return lichun_this_year
    else:
        return lichun_datetime_for_year(dt.year + 1)


def nearest_lichun_before(dt: datetime) -> datetime:
    """
    Get the nearest Lichun datetime BEFORE the given date.

    Used for determining BaZi year.

    Args:
        dt: Reference datetime

    Returns:
        The Lichun before or at dt
    """
    lichun_this_year = lichun_datetime_for_year(dt.year)

    if dt >= lichun_this_year:
        return lichun_this_year
    else:
        return lichun_datetime_for_year(dt.year - 1)


def get_solar_term_for_date(dt: datetime) -> Optional[str]:
    """
    Get the current solar term period for a date.

    Args:
        dt: Date to check

    Returns:
        Name of the solar term period (e.g., "Lichun", "Jingzhe")
    """
    if _HAS_SXTWL:
        try:
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            # sxtwl may provide current jieqi info
            # This varies by sxtwl version
            pass
        except Exception:
            pass

    # Fallback: find which solar term period we're in
    year = dt.year

    # Build list of solar term datetimes for this year
    terms_this_year = []
    for term_name, (month, day) in APPROX_SOLAR_TERMS.items():
        if month <= 2:  # Jan-Feb terms might be for next year's cycle
            term_year = year
        else:
            term_year = year
        terms_this_year.append((term_name, datetime(term_year, month, day)))

    # Sort by date
    terms_this_year.sort(key=lambda x: x[1])

    # Find current term
    current_term = terms_this_year[-1][0]  # Default to last term
    for i, (term_name, term_dt) in enumerate(terms_this_year):
        if dt < term_dt:
            if i > 0:
                current_term = terms_this_year[i - 1][0]
            break
        current_term = term_name

    return current_term


def get_bazi_month_index(dt: datetime) -> int:
    """
    Get the BaZi month index (0-11) for a date.

    Month 0 = Lichun to Jingzhe (Tiger month - 寅)
    Month 1 = Jingzhe to Qingming (Rabbit month - 卯)
    etc.

    Args:
        dt: Date to check

    Returns:
        Month index 0-11
    """
    if _HAS_SXTWL:
        try:
            day = sxtwl.fromSolar(dt.year, dt.month, dt.day)
            # sxtwl 2.x: getMonthGZ() returns GZ object with dz (地支 index 0-11)
            # dz: 0=Zi, 1=Chou, 2=Yin, 3=Mao...
            # BaZi month 0 starts at Yin (dz=2), so index = (dz - 2) % 12
            gz = day.getMonthGZ()
            return (gz.dz - 2) % 12
        except Exception as e:
            logger.warning(f"sxtwl month index failed: {e}")

    # Fallback: use approximate solar term dates
    year = dt.year

    # Get Jie (节) term dates for this year
    jie_dates = []
    for i, term_name in enumerate(MONTH_JIE_TERMS):
        month, day = APPROX_SOLAR_TERMS[term_name]

        # Handle year boundary (Xiaohan, Dahan are in Jan of next year for cycle)
        if term_name in ["Xiaohan", "Dahan"]:
            term_year = year
        elif term_name == "Lichun":
            term_year = year
        else:
            term_year = year

        jie_dates.append((i, datetime(term_year, month, day)))

    # Find which month we're in
    current_month = 11  # Default to last month
    for i in range(len(jie_dates)):
        jie_idx, jie_dt = jie_dates[i]
        if i + 1 < len(jie_dates):
            next_jie_dt = jie_dates[i + 1][1]
            if jie_dt <= dt < next_jie_dt:
                current_month = jie_idx
                break
        else:
            if dt >= jie_dt:
                current_month = jie_idx

    return current_month


# sxtwl 2.x jqIndex to term name mapping
# 0=Dongzhi, 1=Xiaohan, 2=Dahan, 3=Lichun, 4=Yushui, ...
SXTWL_JQ_INDEX_TO_NAME = {
    0: "Dongzhi",      # 冬至
    1: "Xiaohan",      # 小寒
    2: "Dahan",        # 大寒
    3: "Lichun",       # 立春
    4: "Yushui",       # 雨水
    5: "Jingzhe",      # 惊蛰
    6: "Chunfen",      # 春分
    7: "Qingming",     # 清明
    8: "Guyu",         # 谷雨
    9: "Lixia",        # 立夏
    10: "Xiaoman",     # 小满
    11: "Mangzhong",   # 芒种
    12: "Xiazhi",      # 夏至
    13: "Xiaoshu",     # 小暑
    14: "Dashu",       # 大暑
    15: "Liqiu",       # 立秋
    16: "Chushu",      # 处暑
    17: "Bailu",       # 白露
    18: "Qiufen",      # 秋分
    19: "Hanlu",       # 寒露
    20: "Shuangjiang", # 霜降
    21: "Lidong",      # 立冬
    22: "Xiaoxue",     # 小雪
    23: "Daxue",       # 大雪
}


@lru_cache(maxsize=128)
def get_all_solar_terms_for_year(year: int) -> Tuple[Tuple[str, datetime], ...]:
    """
    Get all 24 solar terms with their exact datetimes for a year.

    CACHED: Solar terms for a year never change. Returns tuple for hashability.

    Args:
        year: Gregorian year

    Returns:
        Tuple of (term_name, datetime) tuples
    """
    terms = []

    if _HAS_SXTWL:
        try:
            # sxtwl 2.x API
            jqs = sxtwl.getJieQiByYear(year)
            for jq in jqs:
                name_en = SXTWL_JQ_INDEX_TO_NAME.get(jq.jqIndex)
                if name_en:
                    dd = sxtwl.JD2DD(jq.jd)
                    terms.append((name_en, datetime(dd.Y, dd.M, dd.D, int(dd.h), int(dd.m), int(dd.s))))

            return tuple(sorted(terms, key=lambda x: x[1]))
        except Exception as e:
            logger.warning(f"sxtwl solar terms lookup failed: {e}")

    # Fallback: use approximate dates
    for term_name, (month, day) in APPROX_SOLAR_TERMS.items():
        if month >= 1:  # All months this year
            terms.append((term_name, datetime(year, month, day, 0, 0, 0)))

    return tuple(sorted(terms, key=lambda x: x[1]))


def days_between_lichun(birth_dt: datetime) -> Tuple[int, str]:
    """
    Calculate days between birth and nearest Lichun.

    Used for DaYun start age calculation:
    - If born before Lichun: days to next Lichun (forward direction)
    - If born after Lichun: days from previous Lichun (backward direction)

    Args:
        birth_dt: Birth datetime

    Returns:
        Tuple of (days, direction) where direction is "forward" or "backward"
    """
    lichun_this_year = lichun_datetime_for_year(birth_dt.year)

    if birth_dt < lichun_this_year:
        # Born before Lichun - count to next Lichun
        days = (lichun_this_year - birth_dt).days
        direction = "forward"
    else:
        # Born after Lichun - count from Lichun
        days = (birth_dt - lichun_this_year).days
        direction = "backward"

    return (days, direction)


def get_jie_boundaries_for_month(dt: datetime) -> Tuple[datetime, datetime]:
    """
    Get the Jie (节) boundaries for the BaZi month containing the given date.

    Args:
        dt: Date to find month boundaries for

    Returns:
        Tuple of (start_jie_datetime, end_jie_datetime)
    """
    year = dt.year
    month_idx = get_bazi_month_index(dt)

    # Get current and next Jie term
    current_term = MONTH_JIE_TERMS[month_idx]
    next_term = MONTH_JIE_TERMS[(month_idx + 1) % 12]

    # Get approximate dates
    start_month, start_day = APPROX_SOLAR_TERMS[current_term]
    end_month, end_day = APPROX_SOLAR_TERMS[next_term]

    # Handle year boundary
    start_year = year
    end_year = year

    # If start term is in late year and end term is in early year
    if start_month > end_month:
        end_year = year + 1

    start_dt = datetime(start_year, start_month, start_day, 0, 0, 0)
    end_dt = datetime(end_year, end_month, end_day, 0, 0, 0)

    # Use sxtwl for exact times if available
    if _HAS_SXTWL:
        try:
            all_terms = get_all_solar_terms_for_year(year)
            for term_name, term_dt in all_terms:
                if term_name == current_term:
                    start_dt = term_dt
                if term_name == next_term:
                    end_dt = term_dt
        except Exception:
            pass

    return (start_dt, end_dt)


def get_next_jie_datetime(dt: datetime) -> Optional[datetime]:
    """
    Get the datetime of the next Jie (节) solar term after the given date.

    Used for DaYun onset calculation (forward direction).

    Args:
        dt: Reference datetime

    Returns:
        Datetime of next Jie, or None if not found
    """
    # Check this year and next year
    for year in [dt.year, dt.year + 1]:
        for term_name in MONTH_JIE_TERMS:
            month, day = APPROX_SOLAR_TERMS[term_name]
            term_dt = datetime(year, month, day, 0, 0, 0)

            # Get exact time if sxtwl available
            if _HAS_SXTWL:
                try:
                    all_terms = get_all_solar_terms_for_year(year)
                    for t_name, t_dt in all_terms:
                        if t_name == term_name:
                            term_dt = t_dt
                            break
                except Exception:
                    pass

            if term_dt > dt:
                return term_dt

    return None


def get_prev_jie_datetime(dt: datetime) -> Optional[datetime]:
    """
    Get the datetime of the previous Jie (节) solar term before the given date.

    Used for DaYun onset calculation (backward direction).

    Args:
        dt: Reference datetime

    Returns:
        Datetime of previous Jie, or None if not found
    """
    # Build list of all Jie terms for current and previous year
    jie_dates = []

    for year in [dt.year - 1, dt.year]:
        for term_name in MONTH_JIE_TERMS:
            month, day = APPROX_SOLAR_TERMS[term_name]
            term_dt = datetime(year, month, day, 0, 0, 0)

            # Get exact time if sxtwl available
            if _HAS_SXTWL:
                try:
                    all_terms = get_all_solar_terms_for_year(year)
                    for t_name, t_dt in all_terms:
                        if t_name == term_name:
                            term_dt = t_dt
                            break
                except Exception:
                    pass

            jie_dates.append(term_dt)

    # Sort and find the last one before dt
    jie_dates.sort()
    prev_jie = None

    for jie_dt in jie_dates:
        if jie_dt < dt:
            prev_jie = jie_dt
        else:
            break

    return prev_jie
