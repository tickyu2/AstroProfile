"""
bazi_engine - Joey Yap BaZi Standard Engine

A production-ready Chinese astrology engine following Joey Yap conventions.
Uses sxtwl (寿星万年历) for accurate solar term calculations when available.

Main exports:
- Four Pillars generation (four_pillars_from_datetime)
- Ten Gods derivation (derive_ten_gods)
- Hidden Stems analysis (get_hidden_stems, element_distribution)
- Symbolic Stars detection (detect_symbolic_stars)
- DaYun/Luck Pillars (calculate_dayun, dayun_for_birth)
- Explainability narratives (generate_full_explanation)

Core constants:
- HEAVENLY_STEMS, EARTHLY_BRANCHES, ELEMENT_MAP
- BRANCH_HIDDEN_STEMS, GROWTH_PHASES

Usage:
    from bazi_engine import four_pillars_from_datetime, analyze_bazi
    from datetime import datetime

    dt = datetime(1990, 5, 15, 14, 30)
    pillars = four_pillars_from_datetime(dt)
    # Returns: [(year_stem, year_branch), (month_stem, month_branch), ...]

    # Full analysis
    chart = analyze_bazi(dt, is_male=True)
"""

from .utils import (
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    ELEMENT_MAP,
    BRANCH_HIDDEN_STEMS,
    GROWTH_PHASES,
    BRANCH_ELEMENT_MAP,
    PRODUCES,
    CONTROLS
)

from .calendar_conv import (
    to_lunar,
    lunar_to_solar_info,
    has_sxtwl,
    get_gan_zhi_for_date,
    get_year_gan_zhi,
    get_month_gan_zhi,
    get_hour_gan_zhi
)

from .solar_terms import (
    lichun_datetime_for_year,
    nearest_lichun_after,
    nearest_lichun_before,
    get_solar_term_for_date,
    get_bazi_month_index,
    get_all_solar_terms_for_year,
    days_between_lichun,
    get_jie_boundaries_for_month,
    get_next_jie_datetime,
    get_prev_jie_datetime
)

from .stems_branches import (
    four_pillars_from_datetime,
    year_pillar_from_datetime,
    month_pillar_from_solar_term,
    day_pillar,
    hour_pillar,
    get_day_master,
    pillars_to_dict
)

from .hidden_stems import (
    get_hidden_stems,
    get_weighted_hidden_stems,
    element_distribution,
    day_master_strength
)

from .ten_gods import (
    ten_god_for,
    derive_ten_gods,
    ten_god_summary_5group,
    TEN_GOD_LABELS,
    TEN_GOD_TO_5GROUP
)

from .symbolic_stars import (
    detect_symbolic_stars,
    get_detected_stars_summary
)

from .luck_pillars import (
    calculate_dayun,
    dayun_for_birth,
    get_luck_direction,
    is_yang_stem,
    get_current_luck_pillar,
    # LiuNian (流年) - Annual Pillar
    calculate_liunian,
    calculate_liunian_precise,
    get_liunian_for_age,
    # XiaoYun (小運) - Minor Luck
    calculate_xiaoyun,
    calculate_xiaoyun_range,
    # Comprehensive helper
    get_current_luck_info
)

from .explainability import (
    generate_full_explanation,
    generate_l0_postcard,
    generate_l1_factors,
    generate_l2_math,
    generate_l3_debug,
    generate_narrative_paragraph,
    describe_dm_strength,
    ELEMENT_QUALITIES,
    TEN_GOD_MEANINGS,
    STAR_MEANINGS
)

from .growth_phases import (
    get_growth_phase,
    get_growth_phase_index,
    get_all_pillar_phases,
    get_phase_summary,
    CHANGSHENG_BRANCH,
    PHASE_INTERPRETATIONS,
    PHASE_ENERGY_LEVELS
)

from .life_palace import (
    calculate_life_palace,
    calculate_life_palace_stem,
    calculate_conception_palace,
    LIFE_PALACE_INTERPRETATIONS,
    LIFE_PALACE_CHARACTERISTICS
)

# Performance optimizations
from .solar_context import (
    SolarContext,
    get_solar_context,
    get_cached_lichun,
    get_cached_year_ganzhi,
    SolarContextCache
)

from .models import (
    Pillar,
    FourPillars,
    BaZiChart,
    ElementDistribution,
    DayMasterStrength,
    DaYunPillar,
    DaYunResult,
    create_pillar,
    create_four_pillars
)


def analyze_bazi(
    birth_dt,
    is_male: bool = True,
    include_dayun: bool = True,
    dayun_pillar_count: int = 8
):
    """
    Complete BaZi chart analysis.

    This is the main entry point for generating a full BaZi reading.

    Args:
        birth_dt: Birth datetime
        is_male: True for male, False for female (affects DaYun direction)
        include_dayun: Whether to include luck pillars
        dayun_pillar_count: Number of luck pillars to calculate

    Returns:
        Complete chart data with pillars, ten gods, stars, strength, and explanation
    """
    from datetime import datetime

    # Generate Four Pillars - list of (stem, branch) tuples
    pillars = four_pillars_from_datetime(birth_dt)
    pillars_info = pillars_to_dict(pillars)  # Returns full info dict

    # Get Day Master (stem string) and Day Pillar
    dm_stem = get_day_master(pillars)  # Returns stem string like "Gui"
    day_pillar = pillars[2]  # (stem, branch) tuple

    # Create simple pillars dict for iteration: {"year": (stem, branch), ...}
    pillar_names = ["year", "month", "day", "hour"]
    simple_pillars_dict = {
        pillar_names[i]: pillars[i] for i in range(len(pillars))
    }

    # Hidden stems for all branches
    hidden_stems = {}
    for pillar_name, (stem, branch) in simple_pillars_dict.items():
        hidden_stems[pillar_name] = get_hidden_stems(branch)

    # Hidden stems with weights
    hidden_stems_weighted = {}
    for pillar_name, (stem, branch) in simple_pillars_dict.items():
        hidden_stems_weighted[pillar_name] = get_weighted_hidden_stems(branch)

    # Element distribution
    elem_dist = element_distribution(pillars)

    # Day Master strength
    dm_strength = day_master_strength(pillars)

    # Ten Gods
    ten_gods = derive_ten_gods(dm_stem, pillars)
    ten_gods_5group = ten_god_summary_5group(pillars)

    # Symbolic stars
    stars = detect_symbolic_stars(pillars)

    # Growth phases (十二長生)
    growth_phases = get_all_pillar_phases(dm_stem, pillars)
    growth_summary = get_phase_summary(growth_phases)

    # Life Palace (命宮) and Conception Palace (胎元)
    year_stem = pillars[0][0]
    month_stem = pillars[1][0]
    month_branch = pillars[1][1]
    hour_branch = pillars[3][1]
    life_palace = calculate_life_palace_stem(year_stem, month_branch, hour_branch)
    conception_palace = calculate_conception_palace(month_stem, month_branch)

    # Build chart object
    chart = {
        "birth_datetime": birth_dt.isoformat() if hasattr(birth_dt, 'isoformat') else str(birth_dt),
        "gender": "male" if is_male else "female",
        "pillars": pillars,
        "pillars_dict": simple_pillars_dict,
        "pillars_info": pillars_info,  # Full info from pillars_to_dict
        "day_master": {
            "stem": dm_stem,
            "branch": day_pillar[1],
            "element": ELEMENT_MAP.get(dm_stem, "")
        },
        "hidden_stems": hidden_stems,
        "hidden_stems_raw": hidden_stems_weighted,
        "element_distribution": elem_dist,
        "dm_strength": dm_strength,
        "ten_gods": ten_gods,
        "ten_gods_summary": ten_gods_5group,
        "ten_gods_raw": ten_gods,
        "symbolic_stars": stars,
        "growth_phases": growth_phases,
        "growth_summary": growth_summary,
        "life_palace": life_palace,
        "conception_palace": conception_palace,
        "sxtwl_available": has_sxtwl(),
        "calculated_at": datetime.now().isoformat()
    }

    # Add DaYun if requested
    if include_dayun:
        chart["dayun"] = dayun_for_birth(
            birth_dt,
            is_male=is_male,
            pillar_count=dayun_pillar_count
        )

    # Generate explanation
    chart["explanation"] = generate_full_explanation(chart)

    return chart


__version__ = "1.0.0"
__author__ = "GENESIS / Metal Rat Lighthouse"

__all__ = [
    # Constants
    "HEAVENLY_STEMS",
    "EARTHLY_BRANCHES",
    "ELEMENT_MAP",
    "BRANCH_HIDDEN_STEMS",
    "GROWTH_PHASES",
    "BRANCH_ELEMENT_MAP",
    "PRODUCES",
    "CONTROLS",
    # Calendar
    "to_lunar",
    "lunar_to_solar_info",
    "has_sxtwl",
    "get_gan_zhi_for_date",
    "get_year_gan_zhi",
    "get_month_gan_zhi",
    "get_hour_gan_zhi",
    # Solar terms
    "lichun_datetime_for_year",
    "nearest_lichun_after",
    "nearest_lichun_before",
    "get_solar_term_for_date",
    "get_bazi_month_index",
    "get_all_solar_terms_for_year",
    "days_between_lichun",
    "get_jie_boundaries_for_month",
    "get_next_jie_datetime",
    "get_prev_jie_datetime",
    # Four Pillars
    "four_pillars_from_datetime",
    "year_pillar_from_datetime",
    "month_pillar_from_solar_term",
    "day_pillar",
    "hour_pillar",
    "get_day_master",
    "pillars_to_dict",
    # Hidden stems
    "get_hidden_stems",
    "get_weighted_hidden_stems",
    "element_distribution",
    "day_master_strength",
    # Ten Gods
    "ten_god_for",
    "derive_ten_gods",
    "ten_god_summary_5group",
    "TEN_GOD_LABELS",
    "TEN_GOD_TO_5GROUP",
    # Symbolic Stars
    "detect_symbolic_stars",
    "get_detected_stars_summary",
    # Luck Pillars - DaYun
    "calculate_dayun",
    "dayun_for_birth",
    "get_luck_direction",
    "is_yang_stem",
    "get_current_luck_pillar",
    # Luck Pillars - LiuNian (流年)
    "calculate_liunian",
    "calculate_liunian_precise",
    "get_liunian_for_age",
    # Luck Pillars - XiaoYun (小運)
    "calculate_xiaoyun",
    "calculate_xiaoyun_range",
    # Luck Pillars - Comprehensive
    "get_current_luck_info",
    # Explainability
    "generate_full_explanation",
    "generate_l0_postcard",
    "generate_l1_factors",
    "generate_l2_math",
    "generate_l3_debug",
    "generate_narrative_paragraph",
    "describe_dm_strength",
    "ELEMENT_QUALITIES",
    "TEN_GOD_MEANINGS",
    "STAR_MEANINGS",
    # Growth Phases
    "get_growth_phase",
    "get_growth_phase_index",
    "get_all_pillar_phases",
    "get_phase_summary",
    "CHANGSHENG_BRANCH",
    "PHASE_INTERPRETATIONS",
    "PHASE_ENERGY_LEVELS",
    # Life Palace
    "calculate_life_palace",
    "calculate_life_palace_stem",
    "calculate_conception_palace",
    "LIFE_PALACE_INTERPRETATIONS",
    "LIFE_PALACE_CHARACTERISTICS",
    # Performance Optimization - SolarContext
    "SolarContext",
    "get_solar_context",
    "get_cached_lichun",
    "get_cached_year_ganzhi",
    "SolarContextCache",
    # Unified Data Models
    "Pillar",
    "FourPillars",
    "BaZiChart",
    "ElementDistribution",
    "DayMasterStrength",
    "DaYunPillar",
    "DaYunResult",
    "create_pillar",
    "create_four_pillars",
    # Main analysis function
    "analyze_bazi",
]
