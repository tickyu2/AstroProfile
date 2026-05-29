"""
western_engine/birth_time_lab.py

Birth Time Tuning Lab — minute-by-minute birth time scoring engine.

Sweeps a time range around a given birth time, computes a lightweight chart
per minute via Swiss Ephemeris, scores each across 10 weighted dimensions,
and returns the best minute, top 5, stable windows, and sensitivity cliffs.

v1.1 — Upgraded with TicBot's refined formulas:
  - Entropy-based distribution balance scoring
  - Per-planet sub-component weights from spec (0.35/0.25/0.10/0.10/0.20)
  - MC drift tracking in identity stability
  - Volatility penalty system (ASC flips, house flips, angle churn)
  - Confidence score (0.60*total + 0.40*stability)
  - stddev-based interpretation robustness with fragility penalty
  - User preference profiles (defaultBalanced, relationalAesthetic, etc.)
  - Full reason code system from spec

Performance target: 61-minute sweep in < 10 seconds.
"""

import time
import math
import os
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any

import swisseph as swe
import pytz

from .tuning_lab_models import (
    TuningLabRequest, LightChart, DimensionScore, MinuteScore,
    SensitivityCliff, StableWindow, TuningLabResult,
)
from .tuning_lab_constants import (
    SIGN_RULER, SWE_PLANET_IDS,
    ANGULAR_HOUSES, SUCCEDENT_HOUSES,
    LIFE_AREA_AXES,
    TRADITIONAL_PLANETS, ZODIAC_SIGNS, PLANET_CONDITION_WEIGHTS,
    COMBUSTION_CAZIMI_ORB, COMBUSTION_COMBUST_ORB, COMBUSTION_UNDER_BEAMS_ORB,
    COMBUSTIBLE_PLANETS, CLIFF_THRESHOLD,
    STABLE_WINDOW_MIN_WIDTH, STABLE_WINDOW_MAX_VARIANCE,
)
from .spec_models import build_default_spec, BirthTimeSpec
from .constants import (
    SIGN_ELEMENT, SIGN_MODALITY,
    PLANET_WEIGHTS,
)
from .house_calculator import get_dignity
from .aspect_calculator import detect_aspects_from_longitudes, detect_pattern_strengths
from .models import PlanetPosition

# Ensure Swiss Ephemeris path is set
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_THIS_DIR)
_EPHE_CANDIDATES = [
    os.path.join(_ROOT_DIR, "ephe"),
    os.path.join(_THIS_DIR, "..", "ephe"),
    "/workspace/ephe",
    os.path.join(os.getcwd(), "ephe"),
]
for _c in _EPHE_CANDIDATES:
    if os.path.isdir(_c):
        swe.set_ephe_path(os.path.abspath(_c))
        break


# =============================================================================
# HELPERS
# =============================================================================

def _clamp(x: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, x))


def _sign_from_longitude(lon: float) -> str:
    idx = int(lon / 30) % 12
    return ZODIAC_SIGNS[idx]


def _sign_index(lon: float) -> int:
    return int(lon / 30) % 12


def _degree_in_sign(lon: float) -> float:
    return lon % 30


def _house_for_longitude(lon: float, cusps: Tuple[float, ...]) -> int:
    for i in range(12):
        next_i = (i + 1) % 12
        start = cusps[i]
        end = cusps[next_i]
        if start > end:
            if lon >= start or lon < end:
                return i + 1
        else:
            if start <= lon < end:
                return i + 1
    return 1


def _angular_separation(lon1: float, lon2: float) -> float:
    diff = abs(lon1 - lon2)
    return min(diff, 360 - diff)


def _orb_factor(orb: float, max_orb: float) -> float:
    """Tightness factor: 1.0 = exact, 0.0 = at orb limit."""
    return max(0.0, 1.0 - orb / max_orb)


def _parse_to_utc(date_str: str, time_str: str, tz_str: str) -> datetime:
    local_tz = pytz.timezone(tz_str)
    naive = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    local_dt = local_tz.localize(naive)
    return local_dt.astimezone(pytz.utc)


def _datetime_to_jd(dt_utc: datetime) -> float:
    hour_frac = dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, hour_frac)


def _normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
    """Normalize weights to sum to 1.0."""
    s = sum(weights.values())
    if s == 0:
        return weights
    return {k: v / s for k, v in weights.items()}


def _distribution_balance(counts: Dict[str, int], ideal_share: float) -> float:
    """
    Entropy-like balance score (0-100).
    100 = perfectly balanced, 0 = maximally skewed.
    """
    n = sum(counts.values())
    if n == 0:
        return 50.0
    max_dev = 2.0 * (1.0 - ideal_share)
    dev = sum(abs(c / n - ideal_share) for c in counts.values())
    return _clamp(100.0 * (1.0 - min(1.0, dev / max_dev)))


# =============================================================================
# ASPECT HELPERS (TicBot orb-weighted scoring)
# =============================================================================

SOFT_ASPECTS = {"trine", "sextile", "quintile", "biquintile"}
HARD_ASPECTS = {"square", "opposition", "quincunx", "semi-square", "sesquiquadrate"}

# Aspect base points for angle-to-planet scoring (TicBot spec)
ASPECT_POINTS = {
    "conjunction": 4.0,
    "sextile": 5.0,
    "trine": 7.0,
    "square": -7.0,
    "opposition": -8.0,
}

# Planet modifier for aspect quality
PLANET_ASPECT_MODIFIER = {
    "Sun": 1.0, "Moon": 1.0, "Mercury": 0.8, "Venus": 1.0,
    "Mars": -1.0, "Jupiter": 1.2, "Saturn": -1.1,
    "Uranus": -0.5, "Neptune": -0.4, "Pluto": -0.8,
}


# =============================================================================
# LIGHTWEIGHT CHART COMPUTATION
# =============================================================================

def compute_light_chart(
    jd: float, lat: float, lon: float,
    offset_minutes: int = 0, time_label: str = "",
) -> LightChart:
    """
    Compute a lightweight chart for a single Julian Day.
    Calls swe.calc_ut() for 12 bodies and swe.houses() once.
    ~15ms per call.
    """
    planet_longs = {}
    planet_speeds = {}
    planet_retro = {}

    for name, pid in SWE_PLANET_IDS.items():
        try:
            result, _flag = swe.calc_ut(jd, pid, swe.FLG_SPEED)
            planet_longs[name] = result[0]
            planet_speeds[name] = result[3]
            planet_retro[name] = result[3] < 0
        except Exception:
            planet_longs[name] = 0.0
            planet_speeds[name] = 0.0
            planet_retro[name] = False

    cusps_raw, ascmc = swe.houses(jd, lat, lon, b"P")
    if len(cusps_raw) >= 13:
        cusps = tuple(cusps_raw[1:13])
    else:
        cusps = tuple(cusps_raw[:12])

    asc_lon = ascmc[0]
    mc_lon = ascmc[1]

    chart = LightChart(
        jd=jd,
        local_time_label=time_label,
        offset_minutes=offset_minutes,
        planet_longitudes=planet_longs,
        planet_speeds=planet_speeds,
        planet_retrogrades=planet_retro,
        cusps=cusps,
        ascendant=asc_lon,
        midheaven=mc_lon,
    )

    for name, lng in planet_longs.items():
        chart.planet_signs[name] = _sign_from_longitude(lng)
        chart.planet_houses[name] = _house_for_longitude(lng, cusps)
        chart.planet_degrees[name] = _degree_in_sign(lng)

    return chart


def compute_charts_for_range(request: TuningLabRequest) -> List[LightChart]:
    """Compute LightCharts for every step in the sweep range."""
    center_utc = _parse_to_utc(request.birth_date, request.birth_time, request.timezone)
    local_tz = pytz.timezone(request.timezone)
    charts = []

    center_jd = _datetime_to_jd(center_utc)
    start = -request.sweep_minutes
    end = request.sweep_minutes
    step_min = request.step_seconds / 60.0

    offset = float(start)
    while offset <= end + 0.001:
        offset_int = round(offset)
        jd = center_jd + (offset * 60.0) / 86400.0
        local_dt = (center_utc + timedelta(minutes=offset)).astimezone(local_tz)
        label = local_dt.strftime("%H:%M")

        chart = compute_light_chart(
            jd, request.latitude, request.longitude,
            offset_minutes=offset_int, time_label=label,
        )
        charts.append(chart)
        offset += step_min

    return charts


# =============================================================================
# DIMENSION 1: IDENTITY STABILITY (weight 0.16)
# Sub-weights: ascDrift 0.45, mcDrift 0.15, houseJump 0.30, angleChurn 0.10
# =============================================================================

def score_identity_stability(
    chart: LightChart,
    prev_chart: Optional[LightChart],
    next_chart: Optional[LightChart],
    aspects: List,
    weight: float = 0.16,
) -> Tuple[DimensionScore, Dict[str, Any]]:
    """
    Returns (DimensionScore, transition_flags).
    Transition flags are used for volatility penalty.
    """
    flags: Dict[str, Any] = {}

    if prev_chart is None:
        return DimensionScore(
            name="identityStability", raw_score=75.0,
            weight=weight, weighted_score=75.0 * weight,
            details={"note": "first minute"},
        ), flags

    details = {}

    # ASC drift smoothness
    asc_drift = _angular_separation(chart.ascendant, prev_chart.ascendant)
    asc_smooth = _clamp(100 - min(100, asc_drift / 1.5 * 100))
    details["ascDrift"] = round(asc_drift, 3)

    # MC drift smoothness
    mc_drift = _angular_separation(chart.midheaven, prev_chart.midheaven)
    mc_smooth = _clamp(100 - min(100, mc_drift / 2.0 * 100))
    details["mcDrift"] = round(mc_drift, 3)

    # House jump penalty
    house_flips = 0
    for p in TRADITIONAL_PLANETS:
        h_curr = chart.planet_houses.get(p)
        h_prev = prev_chart.planet_houses.get(p)
        if h_curr and h_prev and h_curr != h_prev:
            house_flips += 1
    house_jump_score = _clamp(100 - 18 * house_flips)
    details["houseFlips"] = house_flips

    # Angle aspect churn
    prev_angle_count = 0
    curr_angle_count = 0
    for name in TRADITIONAL_PLANETS:
        lng = chart.planet_longitudes.get(name, 0)
        for angle_lon in [chart.ascendant, chart.midheaven]:
            sep = _angular_separation(lng, angle_lon)
            for ideal in [0, 60, 90, 120, 180]:
                if abs(sep - ideal) < 5.0:
                    curr_angle_count += 1
                    break
    if prev_chart:
        for name in TRADITIONAL_PLANETS:
            lng = prev_chart.planet_longitudes.get(name, 0)
            for angle_lon in [prev_chart.ascendant, prev_chart.midheaven]:
                sep = _angular_separation(lng, angle_lon)
                for ideal in [0, 60, 90, 120, 180]:
                    if abs(sep - ideal) < 5.0:
                        prev_angle_count += 1
                        break
    angle_churn = abs(curr_angle_count - prev_angle_count)
    angle_churn_score = _clamp(100 - 20 * angle_churn)

    # Weighted composite (TicBot spec sub-weights)
    score = (
        0.45 * asc_smooth +
        0.15 * mc_smooth +
        0.30 * house_jump_score +
        0.10 * angle_churn_score
    )
    score = _clamp(score)

    # Build transition flags for volatility penalty
    if _sign_index(chart.ascendant) != _sign_index(prev_chart.ascendant):
        flags["asc_sign_flip"] = True
        details["ascSignFlip"] = True
    if house_flips >= 2:
        flags["multiple_house_flips_same_minute"] = True
    if angle_churn >= 2:
        flags["angle_aspect_churn_high"] = True

    return DimensionScore(
        name="identityStability", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    ), flags


# =============================================================================
# DIMENSION 2: CHART COHERENCE (weight 0.10)
# Sub-weights: element 0.35, modality 0.25, angular 0.20, hemisphere 0.20
# =============================================================================

def score_chart_coherence(chart: LightChart, weight: float = 0.10) -> DimensionScore:
    details = {}

    # Element balance (entropy-based)
    elem_counts = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0}
    mod_counts = {"Cardinal": 0, "Fixed": 0, "Mutable": 0}
    for p in TRADITIONAL_PLANETS:
        sign = chart.planet_signs.get(p, "")
        elem = SIGN_ELEMENT.get(sign, "")
        mod = SIGN_MODALITY.get(sign, "")
        if elem:
            elem_counts[elem] += 1
        if mod:
            mod_counts[mod] += 1

    elem_score = _distribution_balance(elem_counts, ideal_share=0.25)
    mod_score = _distribution_balance(mod_counts, ideal_share=1 / 3)
    details["elements"] = elem_counts
    details["modalities"] = mod_counts

    # Angular distribution — target ~40% of planets angular
    angular_count = sum(
        1 for p in TRADITIONAL_PLANETS
        if chart.planet_houses.get(p) in ANGULAR_HOUSES
    )
    total_p = len(TRADITIONAL_PLANETS)
    ratio = angular_count / total_p if total_p > 0 else 0
    angular_score = _clamp(100 - abs(ratio - 0.40) * 220)
    details["angularPlanets"] = angular_count

    # Hemisphere balance (above/below horizon via ASC)
    above = 0
    for p in TRADITIONAL_PLANETS:
        lng = chart.planet_longitudes.get(p, 0)
        arc = (lng - chart.ascendant) % 360
        if 0 <= arc < 180:
            above += 1
    hemi_ratio = above / total_p if total_p > 0 else 0.5
    hemi_score = _clamp(100 - abs(hemi_ratio - 0.5) * 200)
    details["hemisphereBalance"] = round(hemi_ratio, 3)

    score = _clamp(
        0.35 * elem_score +
        0.25 * mod_score +
        0.20 * angular_score +
        0.20 * hemi_score
    )

    return DimensionScore(
        name="chartCoherence", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 3: PLANET CONDITION COMPOSITE (weight 0.16)
# Per-planet sub-weights: essential 0.35, accidental 0.25, retro 0.10,
#                         combustion 0.10, aspect 0.20
# =============================================================================

def _score_single_planet_condition(
    planet_name: str,
    chart: LightChart,
    aspects: List,
) -> float:
    """Score a single planet's condition (0-100) using spec sub-weights."""
    sign = chart.planet_signs.get(planet_name, "")
    house = chart.planet_houses.get(planet_name)
    is_retro = chart.planet_retrogrades.get(planet_name, False)
    lon = chart.planet_longitudes.get(planet_name, 0.0)
    sun_lon = chart.planet_longitudes.get("Sun", 0.0)

    # Essential dignity (0-100)
    dignity = get_dignity(planet_name, sign)
    essential = {"Exalted": 90, "Domicile": 80, "Neutral": 55,
                 "Detriment": 30, "Debilitated": 20}.get(dignity, 55)

    # Accidental dignity (house)
    if house in ANGULAR_HOUSES:
        accidental = 80
    elif house in SUCCEDENT_HOUSES:
        accidental = 60
    else:
        accidental = 45

    # Retrograde adjustment
    if is_retro:
        retro = 50 if planet_name in ("Jupiter", "Saturn") else 45
    else:
        retro = 60

    # Combustion/cazimi
    combustion = 60  # default: not applicable
    if planet_name in COMBUSTIBLE_PLANETS:
        sep = _angular_separation(lon, sun_lon)
        if sep <= COMBUSTION_CAZIMI_ORB:
            combustion = 85
        elif sep <= COMBUSTION_COMBUST_ORB:
            combustion = 35
        elif sep <= COMBUSTION_UNDER_BEAMS_ORB:
            combustion = 45

    # Aspect support/stress (orb-weighted)
    aspect_score = 50.0
    planet_lower = planet_name.lower()
    for asp in aspects:
        p1_low = asp.planet1.lower()
        p2_low = asp.planet2.lower()
        if planet_lower not in (p1_low, p2_low):
            continue
        other = asp.planet2 if planet_lower == p1_low else asp.planet1
        atype = asp.aspect_type.lower()
        base = ASPECT_POINTS.get(atype, 0)
        mod = PLANET_ASPECT_MODIFIER.get(other, 1.0)
        aspect_score += base * mod * _orb_factor(asp.orb, 6.0)

    aspect_score = _clamp(aspect_score)

    # Weighted composite per spec
    return _clamp(
        0.35 * essential +
        0.25 * accidental +
        0.10 * retro +
        0.10 * combustion +
        0.20 * aspect_score
    )


def score_planet_condition_composite(
    chart: LightChart, aspects: List, weight: float = 0.16,
) -> DimensionScore:
    details = {}
    weighted_sum = 0.0
    total_w = 0.0

    for p in TRADITIONAL_PLANETS:
        ps = _score_single_planet_condition(p, chart, aspects)
        pw = PLANET_CONDITION_WEIGHTS.get(p, 0.1)
        weighted_sum += ps * pw
        total_w += pw
        details[p] = round(ps, 1)

    score = _clamp(weighted_sum / total_w if total_w > 0 else 50)

    return DimensionScore(
        name="planetConditionComposite", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 4: LUMINARY QUALITY (weight 0.10)
# Sub-weights: sun 0.35, moon 0.35, sunMoonAspect 0.20, phaseCoherence 0.10
# =============================================================================

def _sun_moon_aspect_quality(sun_lon: float, moon_lon: float) -> float:
    """Score Sun-Moon aspect quality (0-100)."""
    sep = _angular_separation(sun_lon, moon_lon)
    # Check each ideal angle
    for ideal, max_orb in [(120, 8), (60, 6), (0, 10), (180, 10), (90, 7)]:
        orb = abs(sep - ideal)
        if orb <= max_orb:
            f = _orb_factor(orb, max_orb)
            if ideal in (120, 60):
                return _clamp(72 + 18 * f)
            elif ideal == 0:
                return _clamp(65 + 15 * f)
            elif ideal == 180:
                return _clamp(50 + 15 * f)
            else:  # square
                return _clamp(40 + 15 * (1 - f))
    return 58.0  # no major aspect


def _sun_moon_phase_coherence(sun_lon: float, moon_lon: float) -> float:
    """Score phase coherence — clear phase anchors score higher."""
    sep = _angular_separation(sun_lon, moon_lon)
    anchors = [0, 60, 90, 120, 180]
    nearest = min(abs(sep - a) for a in anchors)
    return _clamp(85 - nearest * 0.8)


def score_luminary_quality(
    chart: LightChart, aspects: List, weight: float = 0.10,
) -> DimensionScore:
    details = {}

    sun_score = _score_single_planet_condition("Sun", chart, aspects)
    moon_score = _score_single_planet_condition("Moon", chart, aspects)
    details["sunCondition"] = round(sun_score, 1)
    details["moonCondition"] = round(moon_score, 1)

    sun_lon = chart.planet_longitudes.get("Sun", 0)
    moon_lon = chart.planet_longitudes.get("Moon", 0)

    smq = _sun_moon_aspect_quality(sun_lon, moon_lon)
    phs = _sun_moon_phase_coherence(sun_lon, moon_lon)
    details["sunMoonAspect"] = round(smq, 1)
    details["phaseCoherence"] = round(phs, 1)

    score = _clamp(
        0.35 * sun_score +
        0.35 * moon_score +
        0.20 * smq +
        0.10 * phs
    )

    return DimensionScore(
        name="luminaryQuality", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 5: ANGULAR DYNAMICS (weight 0.12)
# Sub-weights: anglesToAscMcIcDsc 0.40, chartRuler 0.35, mcRuler 0.25
# =============================================================================

def _aspects_to_angles_score(chart: LightChart, max_orb: float = 5.0) -> float:
    """Orb-weighted score for planet aspects to ASC/MC/IC/DSC."""
    angle_lons = {
        "ASC": chart.ascendant,
        "MC": chart.midheaven,
        "IC": (chart.midheaven + 180) % 360,
        "DSC": (chart.ascendant + 180) % 360,
    }
    score = 50.0
    for name in TRADITIONAL_PLANETS:
        lng = chart.planet_longitudes.get(name, 0)
        mod = PLANET_ASPECT_MODIFIER.get(name, 1.0)
        for _angle_name, angle_lon in angle_lons.items():
            sep = _angular_separation(lng, angle_lon)
            # Check standard aspects
            for ideal_name, ideal_angle in [("conjunction", 0), ("sextile", 60),
                                             ("square", 90), ("trine", 120),
                                             ("opposition", 180)]:
                orb = abs(sep - ideal_angle)
                if orb <= max_orb:
                    base = ASPECT_POINTS.get(ideal_name, 0)
                    score += base * mod * _orb_factor(orb, max_orb)
                    break
    return _clamp(score)


def score_angular_dynamics(
    chart: LightChart, aspects: List, weight: float = 0.12,
) -> DimensionScore:
    details = {}

    ang_score = _aspects_to_angles_score(chart)
    details["anglesScore"] = round(ang_score, 1)

    # Chart ruler condition
    asc_sign = _sign_from_longitude(chart.ascendant)
    chart_ruler = SIGN_RULER.get(asc_sign, "")
    ruler_score = 50.0
    if chart_ruler:
        ruler_score = _score_single_planet_condition(chart_ruler, chart, aspects)
        details["chartRuler"] = chart_ruler
        details["chartRulerScore"] = round(ruler_score, 1)

    # MC ruler condition
    mc_sign = _sign_from_longitude(chart.midheaven)
    mc_ruler = SIGN_RULER.get(mc_sign, "")
    mc_ruler_score = 50.0
    if mc_ruler:
        mc_ruler_score = _score_single_planet_condition(mc_ruler, chart, aspects)
        details["mcRuler"] = mc_ruler
        details["mcRulerScore"] = round(mc_ruler_score, 1)

    score = _clamp(
        0.40 * ang_score +
        0.35 * ruler_score +
        0.25 * mc_ruler_score
    )

    return DimensionScore(
        name="angularDynamics", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 6: ASPECT ARCHITECTURE (weight 0.10)
# Sub-weights: tightDensity 0.30, hardSoftBalance 0.25, pattern 0.25, orbHarmony 0.20
# =============================================================================

def score_aspect_architecture(
    chart: LightChart, aspects: List, patterns, weight: float = 0.10,
) -> DimensionScore:
    details = {}

    if not aspects:
        return DimensionScore(
            name="aspectArchitecture", raw_score=50,
            weight=weight, weighted_score=50 * weight,
            details={"note": "no aspects"},
        )

    # Tight density
    tight = sum(1 for a in aspects if a.orb < 2.0)
    tight_density = _clamp(100.0 * tight / 8.0)
    details["tightAspects"] = tight

    # Hard/soft balance
    h_count = sum(1 for a in aspects if a.aspect_type in SOFT_ASPECTS)
    c_count = sum(1 for a in aspects if a.aspect_type in HARD_ASPECTS)
    total = h_count + c_count
    if total > 0:
        soft_ratio = h_count / total
        hard_soft = _clamp(100 - abs(soft_ratio - 0.55) * 200)
    else:
        hard_soft = 55.0
    details["harmoniousCount"] = h_count
    details["challengingCount"] = c_count

    # Pattern bonuses
    pattern_bonus = 0
    if patterns:
        if patterns.grand_trine > 0.3:
            pattern_bonus += 12
        if patterns.t_square > 0.3:
            pattern_bonus += 8
        if patterns.yod > 0.3:
            pattern_bonus += 10
        if patterns.kite > 0.3:
            pattern_bonus += 12
        if patterns.stellium > 0.3:
            pattern_bonus += 6
    pattern_score = min(90, 40 + pattern_bonus)
    details["patternBonus"] = pattern_bonus

    # Orb-weighted harmony
    support_vals = [_orb_factor(a.orb, 6.0) for a in aspects if a.aspect_type in SOFT_ASPECTS]
    orb_harmony = _clamp(sum(support_vals) / len(support_vals) * 100) if support_vals else 50.0

    score = _clamp(
        0.30 * tight_density +
        0.25 * hard_soft +
        0.25 * pattern_score +
        0.20 * orb_harmony
    )

    return DimensionScore(
        name="aspectArchitecture", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 7: LIFE AREA EMPHASIS (weight 0.08)
# Uses house occupancy + ruler condition for each axis
# =============================================================================

def _house_strength(chart: LightChart, hnum: int) -> float:
    """Score house strength by planet occupancy."""
    occ = sum(1 for p in TRADITIONAL_PLANETS if chart.planet_houses.get(p) == hnum)
    return _clamp(45 + 10 * min(4, occ))


def _ruler_condition_of_house(
    chart: LightChart, hnum: int, aspects: List,
) -> float:
    """Condition of the planet that rules the sign on a house cusp."""
    if len(chart.cusps) < 12:
        return 55.0
    cusp_lon = chart.cusps[hnum - 1]
    sign = _sign_from_longitude(cusp_lon)
    ruler = SIGN_RULER.get(sign, "")
    if not ruler:
        return 55.0
    return _score_single_planet_condition(ruler, chart, aspects)


def score_life_area_emphasis(
    chart: LightChart, aspects: List,
    profile_axes_weights: Optional[Dict[str, float]] = None,
    weight: float = 0.08,
) -> DimensionScore:
    if profile_axes_weights is None:
        profile_axes_weights = {
            "relationshipAxis": 0.25,
            "careerAxis": 0.25,
            "creativityAxis": 0.20,
            "serviceHealthAxis": 0.15,
            "spiritualityAxis": 0.15,
        }

    details = {}

    # Each axis: 0.5*house_strength + 0.3*ruler_condition + 0.2*secondary_house
    relationship = (0.5 * _house_strength(chart, 7) +
                    0.3 * _ruler_condition_of_house(chart, 7, aspects) +
                    0.2 * _house_strength(chart, 5))
    career = (0.5 * _house_strength(chart, 10) +
              0.3 * _ruler_condition_of_house(chart, 10, aspects) +
              0.2 * _house_strength(chart, 2))
    creativity = (0.5 * _house_strength(chart, 5) +
                  0.3 * _ruler_condition_of_house(chart, 5, aspects) +
                  0.2 * _house_strength(chart, 1))
    service = (0.5 * _house_strength(chart, 6) +
               0.3 * _ruler_condition_of_house(chart, 6, aspects) +
               0.2 * _house_strength(chart, 12))
    spirituality = (0.5 * _house_strength(chart, 9) +
                    0.3 * _ruler_condition_of_house(chart, 12, aspects) +
                    0.2 * _house_strength(chart, 8))

    axes = {
        "relationshipAxis": _clamp(relationship),
        "careerAxis": _clamp(career),
        "creativityAxis": _clamp(creativity),
        "serviceHealthAxis": _clamp(service),
        "spiritualityAxis": _clamp(spirituality),
    }
    details.update(axes)

    s = sum(axes.get(k, 50) * w for k, w in profile_axes_weights.items())
    wsum = sum(profile_axes_weights.values())
    score = _clamp(s / wsum if wsum else 50.0)

    return DimensionScore(
        name="lifeAreaEmphasis", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details=details,
    )


# =============================================================================
# DIMENSION 8: EVENT BACKTESTING (weight 0.06)
# =============================================================================

def score_event_backtesting(
    chart: LightChart,
    events: Optional[List[Dict[str, Any]]],
    weight: float = 0.06,
) -> DimensionScore:
    if not events:
        return DimensionScore(
            name="eventBacktesting", raw_score=50,
            weight=weight, weighted_score=50 * weight,
            details={"note": "no events provided"},
        )

    theme_houses = {
        "career": {6, 10}, "relationship": {5, 7},
        "creativity": {3, 5}, "health": {6, 12},
        "spirituality": {9, 12}, "family": {4, 10},
        "education": {3, 9}, "travel": {9, 12},
    }

    total = 0
    matched = 0
    for ev in events:
        theme = ev.get("theme", "").lower()
        houses = theme_houses.get(theme, set())
        if not houses:
            continue
        total += 1
        for p in TRADITIONAL_PLANETS:
            if chart.planet_houses.get(p) in houses:
                matched += 1
                break

    score = _clamp(50 + (matched / max(total, 1)) * 40)

    return DimensionScore(
        name="eventBacktesting", raw_score=round(score, 2),
        weight=weight, weighted_score=round(score * weight, 2),
        details={"eventsTotal": total, "eventsMatched": matched},
    )


# =============================================================================
# VOLATILITY PENALTY (TicBot spec)
# =============================================================================

def _compute_volatility_penalty(flags: Dict[str, Any]) -> float:
    """Compute penalty (0-12) for volatile transitions."""
    pen = 0.0
    if flags.get("asc_sign_flip"):
        pen += 5.0
    if flags.get("multiple_house_flips_same_minute"):
        pen += 4.0
    if flags.get("angle_aspect_churn_high"):
        pen += 3.0
    return _clamp(pen, 0, 12)


# =============================================================================
# REASON CODES (TicBot spec — comprehensive)
# =============================================================================

def _build_reason_codes(
    dims: Dict[str, DimensionScore],
    flags: Dict[str, Any],
    volatility_penalty: float,
) -> List[str]:
    codes = []

    id_score = dims.get("identityStability")
    if id_score and id_score.raw_score >= 80:
        codes.append("ASC_STABLE")
    if flags.get("asc_sign_flip") or (id_score and id_score.details.get("houseFlips", 0) >= 1):
        codes.append("HOUSE_FLIP_RISK")

    lq = dims.get("luminaryQuality")
    if lq:
        if lq.raw_score >= 75:
            codes.append("LUMINARY_STRONG")
        if lq.raw_score < 45:
            codes.append("LUMINARY_STRESSED")

    ad = dims.get("angularDynamics")
    if ad:
        if ad.details.get("chartRulerScore", 0) >= 75:
            codes.append("CHART_RULER_STRONG")
        if ad.details.get("anglesScore", 0) >= 75:
            codes.append("ANGLE_SUPPORT_HIGH")

    aa = dims.get("aspectArchitecture")
    if aa and aa.raw_score >= 75:
        codes.append("PATTERN_COHERENT")

    if volatility_penalty > 0:
        codes.append("VOLATILE_ZONE")

    eb = dims.get("eventBacktesting")
    if eb and eb.raw_score >= 75:
        codes.append("EVENT_FIT_HIGH")

    return sorted(set(codes))


# =============================================================================
# USER PROFILE WEIGHT RESOLVER
# =============================================================================

def _resolve_weights(
    spec: BirthTimeSpec, profile: str, has_events: bool,
) -> Dict[str, float]:
    """Resolve dimension weights with profile overrides."""
    weights = {k: v.weight for k, v in spec.derivedMetrics.items()}

    # Apply profile overrides
    overrides = spec.userProfiles.get(profile, {}).get("overrides", {})
    for k, v in overrides.items():
        if k.endswith(".weight"):
            metric = k.split(".")[0]
            if metric in weights:
                weights[metric] = float(v)

    # Zero out event backtesting if no events
    if not has_events:
        weights["eventBacktesting"] = 0.0

    return _normalize_weights(weights)


def _get_profile_axes_weights(spec: BirthTimeSpec, profile: str) -> Dict[str, float]:
    """Get life area axes weights for a user profile."""
    base = {
        "relationshipAxis": 0.25,
        "careerAxis": 0.25,
        "creativityAxis": 0.20,
        "serviceHealthAxis": 0.15,
        "spiritualityAxis": 0.15,
    }
    overrides = spec.userProfiles.get(profile, {}).get("overrides", {})
    for k, v in overrides.items():
        if k.startswith("lifeAreaEmphasis.components."):
            axis = k.split(".")[-1]
            if axis in base:
                base[axis] = float(v)
    return base


# =============================================================================
# AGGREGATE SCORER (pre-pass: dimensions 1-8)
# =============================================================================

def score_chart(
    chart: LightChart,
    prev_chart: Optional[LightChart],
    next_chart: Optional[LightChart],
    events: Optional[List[Dict[str, Any]]] = None,
    resolved_weights: Optional[Dict[str, float]] = None,
    profile_axes: Optional[Dict[str, float]] = None,
) -> MinuteScore:
    """
    Compute dimensions 1-8 for a single minute.
    Dimension 9 (interpretationRobustness) computed in post-pass.
    """
    if resolved_weights is None:
        spec = build_default_spec()
        resolved_weights = _resolve_weights(spec, "defaultBalanced", bool(events))

    aspects = detect_aspects_from_longitudes(
        chart.planet_longitudes, include_minor=True,
    )

    planet_positions = []
    for name in TRADITIONAL_PLANETS:
        if name in chart.planet_longitudes:
            planet_positions.append(PlanetPosition(
                planet=name,
                longitude=chart.planet_longitudes[name],
                sign=chart.planet_signs.get(name, ""),
                degree_in_sign=chart.planet_degrees.get(name, 0),
                retrograde=chart.planet_retrogrades.get(name, False),
                house=chart.planet_houses.get(name),
            ))

    patterns = detect_pattern_strengths(aspects, planet_positions)

    # Score dimensions with resolved weights
    dims = {}
    id_dim, transition_flags = score_identity_stability(
        chart, prev_chart, next_chart, aspects,
        weight=resolved_weights.get("identityStability", 0.16),
    )
    dims["identityStability"] = id_dim
    dims["chartCoherence"] = score_chart_coherence(
        chart, weight=resolved_weights.get("chartCoherence", 0.10))
    dims["planetConditionComposite"] = score_planet_condition_composite(
        chart, aspects, weight=resolved_weights.get("planetConditionComposite", 0.16))
    dims["luminaryQuality"] = score_luminary_quality(
        chart, aspects, weight=resolved_weights.get("luminaryQuality", 0.10))
    dims["angularDynamics"] = score_angular_dynamics(
        chart, aspects, weight=resolved_weights.get("angularDynamics", 0.12))
    dims["aspectArchitecture"] = score_aspect_architecture(
        chart, aspects, patterns, weight=resolved_weights.get("aspectArchitecture", 0.10))
    dims["lifeAreaEmphasis"] = score_life_area_emphasis(
        chart, aspects, profile_axes_weights=profile_axes,
        weight=resolved_weights.get("lifeAreaEmphasis", 0.08))
    dims["eventBacktesting"] = score_event_backtesting(
        chart, events, weight=resolved_weights.get("eventBacktesting", 0.06))

    # Raw total (before volatility penalty, before dim 9)
    raw_total = sum(d.weighted_score for d in dims.values())

    # Volatility penalty
    vol_penalty = _compute_volatility_penalty(transition_flags)
    total = _clamp(raw_total - vol_penalty)

    # Reason codes
    reasons = _build_reason_codes(dims, transition_flags, vol_penalty)

    asc_sign = _sign_from_longitude(chart.ascendant)
    mc_sign = _sign_from_longitude(chart.midheaven)

    return MinuteScore(
        offset_minutes=chart.offset_minutes,
        time_label=chart.local_time_label,
        total_score=round(total, 2),
        volatility_penalty=round(vol_penalty, 2),
        transition_flags=transition_flags,
        dimensions=dims,
        asc_sign=asc_sign,
        asc_degree=round(_degree_in_sign(chart.ascendant), 2),
        mc_sign=mc_sign,
        mc_degree=round(_degree_in_sign(chart.midheaven), 2),
        reason_codes=reasons,
    )


# =============================================================================
# DIMENSION 9: INTERPRETATION ROBUSTNESS (post-pass)
# Uses stddev-based consistency + fragility penalty (TicBot formula)
# =============================================================================

def _consistency(vals: List[float], k: float = 5.0) -> float:
    """100 = perfectly consistent, penalized by stddev."""
    if not vals or len(vals) < 2:
        return 60.0
    sd = statistics.pstdev(vals)
    return _clamp(100 - sd * k)


def compute_interpretation_robustness(
    minute_scores: List[MinuteScore],
    resolved_weights: Dict[str, float],
) -> None:
    """
    Post-processing: stddev-based ±1/±2/±5 consistency with fragility penalty.
    Mutates minute_scores in place.
    """
    n = len(minute_scores)
    totals = [ms.total_score for ms in minute_scores]
    rob_weight = resolved_weights.get("interpretationRobustness", 0.12)

    for i, ms in enumerate(minute_scores):
        pm1 = [totals[j] for j in range(max(0, i - 1), min(n, i + 2)) if j != i]
        pm2 = [totals[j] for j in range(max(0, i - 2), min(n, i + 3)) if j != i]
        pm5 = [totals[j] for j in range(max(0, i - 5), min(n, i + 6)) if j != i]

        ms.stability_1min = round(_consistency(pm1) / 100, 3)
        ms.stability_2min = round(_consistency(pm2) / 100, 3)
        ms.stability_5min = round(_consistency(pm5) / 100, 3)

        # Fragility penalty for sitting on a cliff
        fragility = 0.0
        if ms.transition_flags.get("asc_sign_flip"):
            fragility += 10.0
        if ms.transition_flags.get("multiple_house_flips_same_minute"):
            fragility += 8.0

        rob_raw = (
            0.40 * _consistency(pm1) +
            0.35 * _consistency(pm2) +
            0.25 * _consistency(pm5)
            - fragility
        )
        rob_raw = _clamp(rob_raw)

        rob_dim = DimensionScore(
            name="interpretationRobustness",
            raw_score=round(rob_raw, 2),
            weight=rob_weight,
            weighted_score=round(rob_raw * rob_weight, 2),
        )
        ms.dimensions["interpretationRobustness"] = rob_dim

        # Re-aggregate total with all 9 dimensions
        raw_total = sum(d.weighted_score for d in ms.dimensions.values())
        ms.total_score = round(_clamp(raw_total - ms.volatility_penalty), 2)

        # Stability score = avg(identity + robustness)
        id_score = ms.dimensions.get("identityStability")
        id_raw = id_score.raw_score if id_score else 50
        ms.stability_score = round(_clamp((id_raw + rob_raw) / 2), 2)

        # Confidence score = 0.60 * total + 0.40 * stability
        ms.confidence_score = round(
            _clamp(0.60 * ms.total_score + 0.40 * ms.stability_score), 2
        )

        # Update reason codes
        if ms.stability_1min > 0.95 and "ASC_STABLE" not in ms.reason_codes:
            ms.reason_codes.append("ASC_STABLE")
            ms.reason_codes = sorted(set(ms.reason_codes))


# =============================================================================
# STABILITY ANALYSIS (post-sweep)
# =============================================================================

def detect_sensitivity_cliffs(
    minute_scores: List[MinuteScore],
    charts: List[LightChart],
) -> List[SensitivityCliff]:
    cliffs = []
    for i in range(1, len(minute_scores)):
        ms_prev = minute_scores[i - 1]
        ms_curr = minute_scores[i]
        delta = ms_curr.total_score - ms_prev.total_score
        if abs(delta) < CLIFF_THRESHOLD:
            continue

        cause = "score shift"
        if i < len(charts) and i - 1 < len(charts):
            c_prev = charts[i - 1]
            c_curr = charts[i]
            if _sign_index(c_prev.ascendant) != _sign_index(c_curr.ascendant):
                cause = f"ASC sign change ({_sign_from_longitude(c_prev.ascendant)} -> {_sign_from_longitude(c_curr.ascendant)})"
            else:
                for p in TRADITIONAL_PLANETS:
                    h_prev = c_prev.planet_houses.get(p)
                    h_curr = c_curr.planet_houses.get(p)
                    if h_prev and h_curr and h_prev != h_curr:
                        cause = f"{p} house change ({h_prev} -> {h_curr})"
                        break

        cliffs.append(SensitivityCliff(
            minute_offset=ms_curr.offset_minutes,
            score_before=ms_prev.total_score,
            score_after=ms_curr.total_score,
            delta=round(delta, 2),
            likely_cause=cause,
        ))

    return cliffs


def find_best_stable_window(
    minute_scores: List[MinuteScore],
) -> Optional[StableWindow]:
    n = len(minute_scores)
    if n < STABLE_WINDOW_MIN_WIDTH:
        return None

    best_window = None
    best_quality = -1.0

    for start in range(n):
        for end in range(start + STABLE_WINDOW_MIN_WIDTH - 1, n):
            window = minute_scores[start:end + 1]
            scores = [ms.total_score for ms in window]
            avg = sum(scores) / len(scores)
            variance = sum((s - avg) ** 2 for s in scores) / len(scores)

            if variance > STABLE_WINDOW_MAX_VARIANCE ** 2:
                break

            width = end - start + 1
            quality = avg * math.sqrt(width)

            if quality > best_quality:
                best_quality = quality
                best_window = StableWindow(
                    start_offset=window[0].offset_minutes,
                    end_offset=window[-1].offset_minutes,
                    avg_score=round(avg, 2),
                    min_score=round(min(scores), 2),
                    max_score=round(max(scores), 2),
                    width_minutes=width,
                )

    return best_window


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================

def run_tuning_lab(request: TuningLabRequest) -> TuningLabResult:
    """
    Main entry point. Orchestrates the full birth time tuning sweep.

    1. Build spec + resolve weights for user profile
    2. Compute LightCharts for every minute in range
    3. Score each chart (dimensions 1-8 + volatility penalty)
    4. Post-pass: interpretationRobustness (dim 9) + confidence score
    5. Detect sensitivity cliffs, find best stable window
    6. Build and return TuningLabResult
    """
    t0 = time.time()

    # Resolve spec + weights for this profile
    spec = build_default_spec()
    profile = request.profile or "defaultBalanced"
    has_events = bool(request.events)
    resolved_weights = _resolve_weights(spec, profile, has_events)
    profile_axes = _get_profile_axes_weights(spec, profile)

    # Step 1: Compute all lightweight charts
    charts = compute_charts_for_range(request)

    # Step 2: Score each chart (pass 1)
    minute_scores = []
    for i, chart in enumerate(charts):
        prev_c = charts[i - 1] if i > 0 else None
        next_c = charts[i + 1] if i < len(charts) - 1 else None
        ms = score_chart(
            chart, prev_c, next_c, request.events,
            resolved_weights=resolved_weights,
            profile_axes=profile_axes,
        )
        minute_scores.append(ms)

    # Step 3: Post-pass — interpretationRobustness + confidence
    compute_interpretation_robustness(minute_scores, resolved_weights)

    # Step 4: Analysis
    cliffs = detect_sensitivity_cliffs(minute_scores, charts)
    stable_window = find_best_stable_window(minute_scores)

    # Top 5 by total score
    sorted_by_score = sorted(minute_scores, key=lambda ms: ms.total_score, reverse=True)
    top_5 = sorted_by_score[:5]
    best = sorted_by_score[0] if sorted_by_score else minute_scores[0]

    elapsed_ms = (time.time() - t0) * 1000

    return TuningLabResult(
        birth_date=request.birth_date,
        center_time=request.birth_time,
        latitude=request.latitude,
        longitude=request.longitude,
        timezone=request.timezone,
        sweep_range=request.sweep_minutes,
        minute_scores=minute_scores,
        top_5=top_5,
        best_minute=best,
        best_stable_window=stable_window,
        sensitivity_cliffs=cliffs,
        total_minutes_evaluated=len(minute_scores),
        computation_time_ms=round(elapsed_ms, 1),
        profile_used=profile,
    )
