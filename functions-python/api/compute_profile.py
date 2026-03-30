"""
api/compute_profile.py

Unified profile computation endpoint.
Computes BaZi + Western + Vedic + Unified vector in ONE call.

Output is canonical schema - store directly in Firebase, read directly in frontend.
"""

from datetime import datetime
from typing import Dict, Any, Optional, List
import traceback

import math

from .schemas import (
    ComputeProfileRequest,
    ComputedProfileSchema,
    BaZiChartSchema,
    PillarsSchema,
    PillarSchema,
    DayMasterSchema,
    ElementDistributionSchema,
    TenGodSchema,
    SymbolicStarSchema,
    DaYunSchema,
    DaYunPillarSchema,
    WesternChartSchema,
    PlanetPositionSchema,
    HouseCuspSchema,
    AscendantSchema,
    MidheavenSchema,
    MoonPhaseSchema,
    AspectSchema,
    WesternElementsSchema,
    WesternModalitiesSchema,
    ArabicPartSchema,
    ArabicPartsSchema,
    VedicChartSchema,
    NakshatraSchema,
    RashiSchema,
    GrahaSchema,
    UnifiedProfileSchema,
    UnifiedVectorSchema,
    PersonaSchema,
    VenusConditionSchema,
)


# =============================================================================
# BAZI COMPUTATION
# =============================================================================

# Chinese character mappings
STEM_CN = {
    "Jia": "甲", "Yi": "乙", "Bing": "丙", "Ding": "丁", "Wu": "戊",
    "Ji": "己", "Geng": "庚", "Xin": "辛", "Ren": "壬", "Gui": "癸"
}
BRANCH_CN = {
    "Zi": "子", "Chou": "丑", "Yin": "寅", "Mao": "卯",
    "Chen": "辰", "Si": "巳", "Wu": "午", "Wei": "未",
    "Shen": "申", "You": "酉", "Xu": "戌", "Hai": "亥"
}
TEN_GOD_CN = {
    "Companion": "比肩", "Rob Wealth": "劫财",
    "Direct Resource": "正印", "Indirect Resource": "偏印",
    "Eating God": "食神", "Hurting Officer": "伤官",
    "Direct Wealth": "正财", "Indirect Wealth": "偏财",
    "Direct Officer": "正官", "7 Killings": "七杀"
}


def compute_bazi(
    birth_date: str,
    birth_time: str,
    gender: str = "male",
    latitude: float = 0.0,
    longitude: float = 0.0,
    timezone: str = "UTC"
) -> Optional[BaZiChartSchema]:
    """
    Compute BaZi chart using the Joey Yap-accurate bazi_engine.

    Returns canonical BaZiChartSchema or None if engine unavailable.
    """
    try:
        from bazi_engine import (
            analyze_bazi,
            ELEMENT_MAP
        )

        # Parse birth datetime
        dt = datetime.strptime(f"{birth_date} {birth_time}", "%Y-%m-%d %H:%M")

        # Compute full BaZi analysis (returns dict)
        is_male = gender.lower() == "male"
        chart = analyze_bazi(dt, is_male=is_male)

        # Extract pillars from dict - pillars is list of (stem, branch) tuples
        pillars_list = chart.get("pillars", [])
        pillars_dict = chart.get("pillars_dict", {})
        pillars_info = chart.get("pillars_info", {})

        # Build pillar schemas from tuples
        def make_pillar_from_tuple(stem: str, branch: str, pillar_name: str) -> PillarSchema:
            hidden = chart.get("hidden_stems_raw", {}).get(pillar_name, {})
            return PillarSchema(
                stem=stem,
                branch=branch,
                stemChinese=STEM_CN.get(stem, ""),
                branchChinese=BRANCH_CN.get(branch, ""),
                ganzhi=f"{stem}{branch}",
                ganzhiChinese=STEM_CN.get(stem, "") + BRANCH_CN.get(branch, ""),
                hiddenStems=hidden if isinstance(hidden, dict) else {}
            )

        # Get pillars from dict or list
        if pillars_dict:
            year_p = pillars_dict.get("year", ("", ""))
            month_p = pillars_dict.get("month", ("", ""))
            day_p = pillars_dict.get("day", ("", ""))
            hour_p = pillars_dict.get("hour", ("", ""))
        else:
            year_p = pillars_list[0] if len(pillars_list) > 0 else ("", "")
            month_p = pillars_list[1] if len(pillars_list) > 1 else ("", "")
            day_p = pillars_list[2] if len(pillars_list) > 2 else ("", "")
            hour_p = pillars_list[3] if len(pillars_list) > 3 else ("", "")

        pillars = PillarsSchema(
            year=make_pillar_from_tuple(year_p[0], year_p[1], "year"),
            month=make_pillar_from_tuple(month_p[0], month_p[1], "month"),
            day=make_pillar_from_tuple(day_p[0], day_p[1], "day"),
            hour=make_pillar_from_tuple(hour_p[0], hour_p[1], "hour")
        )

        # Day Master from dict
        dm_data = chart.get("day_master", {})
        dm_stem = dm_data.get("stem", "") if isinstance(dm_data, dict) else ""
        dm_element = dm_data.get("element", "") if isinstance(dm_data, dict) else ELEMENT_MAP.get(dm_stem, "")
        yin_stems = ["Yi", "Ding", "Ji", "Xin", "Gui"]

        # DM Strength from dict
        dm_strength_data = chart.get("dm_strength", {})
        strength_category = dm_strength_data.get("category", "balanced") if isinstance(dm_strength_data, dict) else "balanced"
        strength_score = dm_strength_data.get("score", 0.5) if isinstance(dm_strength_data, dict) else 0.5
        seasonal_strength = dm_strength_data.get("seasonal_strength", "") if isinstance(dm_strength_data, dict) else ""

        day_master = DayMasterSchema(
            stem=dm_stem,
            element=dm_element,
            yinYang="Yin" if dm_stem in yin_stems else "Yang",
            strength=strength_category,
            strengthScore=strength_score,
            seasonalStrength=seasonal_strength
        )

        # Element distribution from dict
        elem_data = chart.get("element_distribution", {})
        if isinstance(elem_data, dict):
            elements = ElementDistributionSchema(
                Wood=elem_data.get("Wood", 0),
                Fire=elem_data.get("Fire", 0),
                Earth=elem_data.get("Earth", 0),
                Metal=elem_data.get("Metal", 0),
                Water=elem_data.get("Water", 0),
                dominant=elem_data.get("dominant", ""),
                weakest=elem_data.get("weakest", "")
            )
        else:
            elements = ElementDistributionSchema(
                Wood=0.2, Fire=0.2, Earth=0.2, Metal=0.2, Water=0.2,
                dominant="", weakest=""
            )

        # Ten Gods from dict
        ten_gods = []
        ten_gods_data = chart.get("ten_gods", {})
        if isinstance(ten_gods_data, dict):
            for pillar_name, tg_data in ten_gods_data.items():
                if isinstance(tg_data, dict):
                    ten_gods.append(TenGodSchema(
                        pillar=pillar_name,
                        position="stem",
                        tenGod=tg_data.get("stem_god", tg_data.get("ten_god", "")),
                        tenGodChinese=TEN_GOD_CN.get(tg_data.get("stem_god", ""), ""),
                        group=tg_data.get("group", "")
                    ))

        # Hidden stems from dict - convert list of tuples to dict
        hidden_stems = {}
        hidden_stems_data = chart.get("hidden_stems_raw", chart.get("hidden_stems", {}))
        if isinstance(hidden_stems_data, dict):
            for pillar_name, hs in hidden_stems_data.items():
                if isinstance(hs, dict):
                    # Already a dict - but might have tuple keys, convert to string keys
                    converted = {}
                    for k, v in hs.items():
                        if isinstance(k, tuple):
                            # Tuple like ("Ren", 0.7) - the first element is the stem name
                            converted[k[0]] = k[1] if len(k) > 1 else v
                        else:
                            converted[str(k)] = float(v) if isinstance(v, (int, float)) else v
                    hidden_stems[pillar_name] = converted
                elif isinstance(hs, list):
                    # List of tuples like [("Ren", 0.7), ("Jia", 0.3)]
                    converted = {}
                    for item in hs:
                        if isinstance(item, tuple) and len(item) >= 2:
                            converted[item[0]] = item[1]
                        elif isinstance(item, str):
                            converted[item] = 1.0
                    hidden_stems[pillar_name] = converted

        # Symbolic stars from dict (list of dicts)
        symbolic_stars = []
        stars_data = chart.get("symbolic_stars", [])
        if isinstance(stars_data, list):
            for star in stars_data:
                if isinstance(star, dict):
                    symbolic_stars.append(SymbolicStarSchema(
                        name=star.get("name", ""),
                        nameChinese=star.get("name_cn", ""),
                        category=star.get("category", "neutral"),
                        pillar=star.get("pillar", ""),
                        description=star.get("description", "")
                    ))

        # Growth phases from dict
        growth_phases = {}
        growth_data = chart.get("growth_phases", {})
        if isinstance(growth_data, dict):
            for pillar_name, gp in growth_data.items():
                if isinstance(gp, dict):
                    growth_phases[pillar_name] = {
                        "phase": gp.get("phase", ""),
                        "phaseChinese": gp.get("phase_cn", ""),
                        "energyLevel": gp.get("energy_level", 0.5),
                        "interpretation": gp.get("interpretation", "")
                    }

        # DaYun (Luck Pillars) from dict
        dayun = None
        dayun_data = chart.get("dayun", {})
        if isinstance(dayun_data, dict) and dayun_data:
            dayun_pillars = []
            pillars_data = dayun_data.get("pillars", [])
            for p in pillars_data:
                if isinstance(p, dict):
                    dayun_pillars.append(DaYunPillarSchema(
                        pillarNumber=p.get("pillar_number", 0),
                        stem=p.get("stem", ""),
                        branch=p.get("branch", ""),
                        ganzhi=p.get("ganzhi", f"{p.get('stem', '')}{p.get('branch', '')}"),
                        ageStart=p.get("age_start", 0),
                        ageEnd=p.get("age_end", 0)
                    ))
            onset_years = dayun_data.get("onset_years", 0)
            onset_months = dayun_data.get("onset_months", 0)
            onset_age = onset_years + onset_months / 12
            dayun = DaYunSchema(
                direction=dayun_data.get("direction", "forward"),
                onsetAge=round(onset_age, 2),
                pillars=dayun_pillars
            )

        # Life Palace from dict - extract only the fields we need
        life_palace = None
        life_palace_data = chart.get("life_palace")
        if life_palace_data:
            if isinstance(life_palace_data, dict):
                life_palace = {
                    "stem": life_palace_data.get("stem", ""),
                    "branch": life_palace_data.get("branch", ""),
                    "ganzhi": life_palace_data.get("ganzhi", f"{life_palace_data.get('stem', '')}{life_palace_data.get('branch', '')}"),
                    "interpretation": life_palace_data.get("interpretation", str(life_palace_data.get("characteristics", "")))
                }
            elif isinstance(life_palace_data, tuple) and len(life_palace_data) >= 2:
                life_palace = {
                    "stem": life_palace_data[0],
                    "branch": life_palace_data[1],
                    "ganzhi": f"{life_palace_data[0]}{life_palace_data[1]}",
                    "interpretation": ""
                }

        # Conception Palace from dict - extract only the fields we need
        conception_palace = None
        conception_data = chart.get("conception_palace")
        if conception_data:
            if isinstance(conception_data, dict):
                conception_palace = {
                    "stem": conception_data.get("stem", ""),
                    "branch": conception_data.get("branch", ""),
                    "ganzhi": conception_data.get("ganzhi", f"{conception_data.get('stem', '')}{conception_data.get('branch', '')}"),
                    "interpretation": conception_data.get("interpretation", "")
                }
            elif isinstance(conception_data, tuple) and len(conception_data) >= 2:
                conception_palace = {
                    "stem": conception_data[0],
                    "branch": conception_data[1],
                    "ganzhi": f"{conception_data[0]}{conception_data[1]}",
                    "interpretation": ""
                }

        # Check if sxtwl was used
        sxtwl_used = chart.get("metadata", {}).get("sxtwl_used", False) if isinstance(chart.get("metadata"), dict) else False

        return BaZiChartSchema(
            pillars=pillars,
            dayMaster=day_master,
            elements=elements,
            tenGods=ten_gods,
            hiddenStems=hidden_stems,
            symbolicStars=symbolic_stars,
            growthPhases=growth_phases,
            dayun=dayun,
            lifePalace=life_palace,
            conceptionPalace=conception_palace,
            sxtwlUsed=sxtwl_used,
            computedAt=datetime.now().isoformat()
        )

    except ImportError as e:
        print(f"[compute_bazi] BaZi engine not available: {e}")
        return None
    except Exception as e:
        print(f"[compute_bazi] Error: {e}")
        traceback.print_exc()
        return None


# =============================================================================
# WESTERN COMPUTATION - v2.0 with pre-formatted display fields
# =============================================================================

def _format_degree(degree: float, sign: str) -> str:
    """Format degree as display string: '{degree}° {sign}'"""
    return f"{degree:.2f}° {sign}"


def _assign_planet_to_house(planet_longitude: float, house_cusps: List[Dict]) -> Optional[int]:
    """
    Assign a planet to a house based on its longitude and house cusps.
    Planet is in house N if: cusp[N] <= longitude < cusp[N+1]
    Handle 360° wrap-around for house 12 → house 1

    house_cusps: List of dicts with 'longitude' and optionally 'house' keys.
                 Index 0 should be House 1, Index 1 = House 2, etc.
    """
    if not house_cusps or len(house_cusps) < 12:
        return None

    for i in range(12):
        current_cusp = house_cusps[i]["longitude"]
        next_cusp = house_cusps[(i + 1) % 12]["longitude"]
        # Expected house number is i+1 (index 0 = House 1)
        expected_house = i + 1
        # If house number is in the data, use it for verification
        actual_house = house_cusps[i].get("house", expected_house)
        if actual_house != expected_house:
            print(f"[HOUSE_WARN] Index {i} has house={actual_house}, expected {expected_house}")

        if current_cusp <= next_cusp:
            # Normal case: cusp values increase
            if current_cusp <= planet_longitude < next_cusp:
                return actual_house
        else:
            # Wrap around 360° (e.g., house 12 spans from 350° to 20°)
            if planet_longitude >= current_cusp or planet_longitude < next_cusp:
                return actual_house

    return 1  # Should never reach here, default to house 1


def _calculate_moon_phase(sun_longitude: float, moon_longitude: float) -> MoonPhaseSchema:
    """
    Calculate moon phase from Sun and Moon positions.

    The phase is determined by the angle between Moon and Sun (elongation).
    Illumination is approximated using the cosine of the elongation angle.
    """
    # Calculate elongation (Moon's angle ahead of Sun)
    angle = (moon_longitude - sun_longitude) % 360

    # Calculate illumination (0 = new moon, 1 = full moon)
    # Using formula: illumination = (1 - cos(angle)) / 2
    illumination = (1 - math.cos(math.radians(angle))) / 2

    # Determine phase name and emoji based on angle
    if angle < 22.5 or angle >= 337.5:
        phase = "New Moon"
        emoji = "🌑"
    elif angle < 67.5:
        phase = "Waxing Crescent"
        emoji = "🌒"
    elif angle < 112.5:
        phase = "First Quarter"
        emoji = "🌓"
    elif angle < 157.5:
        phase = "Waxing Gibbous"
        emoji = "🌔"
    elif angle < 202.5:
        phase = "Full Moon"
        emoji = "🌕"
    elif angle < 247.5:
        phase = "Waning Gibbous"
        emoji = "🌖"
    elif angle < 292.5:
        phase = "Last Quarter"
        emoji = "🌗"
    else:
        phase = "Waning Crescent"
        emoji = "🌘"

    return MoonPhaseSchema(
        phase=phase,
        illumination=round(illumination, 4),
        angle=round(angle, 2),
        emoji=emoji
    )


def compute_western(
    birth_date: str,
    birth_time: str,
    latitude: float,
    longitude: float,
    timezone: str = "UTC",
    birth_time_known: bool = True
) -> Optional[WesternChartSchema]:
    """
    Compute Western chart using Swiss Ephemeris.
    v2.0: Returns canonical WesternChartSchema with pre-formatted display fields,
    house assignments, and complete house cusp data.
    """
    try:
        from astro.calculator import SwissEphemerisCalculator

        calc = SwissEphemerisCalculator()
        chart = calc.calculate_natal_chart(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone
        )

        # =================================================================
        # BUILD HOUSE CUSPS ARRAY (required for planet house assignment)
        # =================================================================
        houses_data = chart.get("houses", {})
        cusps_data = houses_data.get("cusps", {})

        house_cusps_list = []
        # Debug: log cusps debug info from calculator
        cusps_debug = houses_data.get("_cusps_debug", {})
        print(f"[HOUSES_DEBUG] cusps_debug={cusps_debug}, cusps_data_keys={list(cusps_data.keys())}")
        for i in range(1, 13):
            cusp_key = f"house_{i}"
            cusp = cusps_data.get(cusp_key, {})
            if cusp:
                house_cusps_list.append(HouseCuspSchema(
                    house=i,
                    longitude=cusp.get("longitude", 0),
                    sign=cusp.get("sign", ""),
                    degree=cusp.get("degree", 0),
                    degreeFormatted=cusp.get("formatted", _format_degree(cusp.get("degree", 0), cusp.get("sign", "")))
                ))
        print(f"[HOUSES_DEBUG] house_cusps_list count={len(house_cusps_list)}, houses={[(h.house, h.sign) for h in house_cusps_list]}")

        # Validate house cusps are complete and properly ordered
        # CRITICAL: Must have exactly 12 houses in order 1-12 for correct planet assignment
        house_numbers = [h.house for h in house_cusps_list]
        if house_numbers != list(range(1, 13)):
            print(f"[HOUSES_ERROR] House cusps not in correct order! Expected [1..12], got {house_numbers}")
            # Attempt to fix by sorting
            house_cusps_list_sorted = sorted(house_cusps_list, key=lambda h: h.house)
            # Verify all 12 present
            if len(house_cusps_list_sorted) == 12 and [h.house for h in house_cusps_list_sorted] == list(range(1, 13)):
                print(f"[HOUSES_FIX] Reordered house cusps successfully")
                house_cusps_list = house_cusps_list_sorted
            else:
                print(f"[HOUSES_ERROR] Cannot fix house cusps - missing houses")

        # Prepare cusp data for house assignment (list of dicts with longitude)
        # Index 0 = House 1, Index 1 = House 2, etc.
        cusp_longitudes = [{"longitude": h.longitude, "house": h.house} for h in house_cusps_list] if house_cusps_list else []
        print(f"[HOUSES_DEBUG] cusp_longitudes: {[(c['house'], round(c['longitude'], 2)) for c in cusp_longitudes]}")

        # =================================================================
        # CONVERT PLANETS TO SCHEMA WITH HOUSE ASSIGNMENTS
        # =================================================================
        planets = {}
        _raw_planets = chart.get("planets", {})
        _asteroid_keys = ['chiron', 'ceres', 'pallas', 'juno', 'vesta']
        _failed_planets = {k: v for k, v in _raw_planets.items() if isinstance(v, dict) and "error" in v}
        if _failed_planets:
            from astro.calculator import get_ephe_diagnostics
            _diag = get_ephe_diagnostics()
            print(f"[ASTEROID_DEBUG] Failed planets: {_failed_planets}")
            print(f"[ASTEROID_DEBUG] Ephe diagnostics: {_diag}")
        for name, data in _raw_planets.items():
            if isinstance(data, dict) and "longitude" in data:
                planet_longitude = data["longitude"]
                planet_house = _assign_planet_to_house(planet_longitude, cusp_longitudes) if cusp_longitudes else None

                # Debug logging for asteroids
                if name in _asteroid_keys:
                    print(f"[HOUSE_ASSIGN] {name}: lon={planet_longitude:.2f}°, sign={data.get('sign')}, degree={data.get('degree'):.2f}°, assigned_house={planet_house}")
                    # Log relevant cusp boundaries
                    if planet_house and cusp_longitudes:
                        prev_idx = (planet_house - 2) % 12
                        curr_idx = planet_house - 1
                        next_idx = planet_house % 12
                        print(f"[HOUSE_ASSIGN] {name}: H{prev_idx+1}={cusp_longitudes[prev_idx]['longitude']:.2f}°, H{curr_idx+1}={cusp_longitudes[curr_idx]['longitude']:.2f}°, H{next_idx+1}={cusp_longitudes[next_idx]['longitude']:.2f}°")

                planets[name] = PlanetPositionSchema(
                    longitude=planet_longitude,
                    latitude=data.get("latitude", 0),
                    sign=data["sign"],
                    degree=data["degree"],
                    degreeFormatted=data.get("formatted", _format_degree(data["degree"], data["sign"])),
                    isRetrograde=data.get("retrograde", False),
                    element=data.get("element", ""),
                    modality=data.get("modality", ""),
                    house=planet_house
                )

        # =================================================================
        # SUN AND MOON (core placements)
        # =================================================================
        sun_data = chart["planets"].get("sun", {})
        moon_data = chart["planets"].get("moon", {})

        sun_longitude = sun_data.get("longitude", 0)
        sun_house = _assign_planet_to_house(sun_longitude, cusp_longitudes) if cusp_longitudes else None

        sun = PlanetPositionSchema(
            longitude=sun_longitude,
            latitude=sun_data.get("latitude", 0),
            sign=sun_data.get("sign", ""),
            degree=sun_data.get("degree", 0),
            degreeFormatted=sun_data.get("formatted", _format_degree(sun_data.get("degree", 0), sun_data.get("sign", ""))),
            isRetrograde=False,  # Sun never retrograde
            element=sun_data.get("element", ""),
            modality=sun_data.get("modality", ""),
            house=sun_house
        )

        moon_longitude = moon_data.get("longitude", 0)
        moon_house = _assign_planet_to_house(moon_longitude, cusp_longitudes) if cusp_longitudes else None

        moon = PlanetPositionSchema(
            longitude=moon_longitude,
            latitude=moon_data.get("latitude", 0),
            sign=moon_data.get("sign", ""),
            degree=moon_data.get("degree", 0),
            degreeFormatted=moon_data.get("formatted", _format_degree(moon_data.get("degree", 0), moon_data.get("sign", ""))),
            isRetrograde=False,  # Moon never retrograde
            element=moon_data.get("element", ""),
            modality=moon_data.get("modality", ""),
            house=moon_house
        )

        # =================================================================
        # ASCENDANT AND MIDHEAVEN
        # =================================================================
        asc_data = houses_data.get("ascendant", chart.get("ascendant", {}))
        mc_data = houses_data.get("midheaven", chart.get("midheaven", {}))

        ascendant = None
        if asc_data and isinstance(asc_data, dict):
            ascendant = AscendantSchema(
                sign=asc_data.get("sign", ""),
                degree=asc_data.get("degree", 0),
                longitude=asc_data.get("longitude", 0),
                degreeFormatted=_format_degree(asc_data.get("degree", 0), asc_data.get("sign", "")),
                isAccurate=birth_time_known
            )

        midheaven = None
        if mc_data and isinstance(mc_data, dict):
            midheaven = MidheavenSchema(
                sign=mc_data.get("sign", ""),
                degree=mc_data.get("degree", 0),
                longitude=mc_data.get("longitude", 0),
                degreeFormatted=_format_degree(mc_data.get("degree", 0), mc_data.get("sign", ""))
            )

        # =================================================================
        # ASPECTS
        # =================================================================
        aspects = []
        for asp in chart.get("aspects", []):
            aspects.append(AspectSchema(
                planet1=asp["planet1"],
                planet2=asp["planet2"],
                aspect=asp["aspect"],
                angle=asp["angle"],
                orb=asp["orb"],
                exactness=asp.get("exactness", 0),
                applying=asp.get("applying", False)
            ))

        # =================================================================
        # ELEMENTS AND MODALITIES
        # =================================================================
        elem = chart.get("elements", {})
        elements = WesternElementsSchema(
            fire=elem.get("fire", 0),
            earth=elem.get("earth", 0),
            air=elem.get("air", 0),
            water=elem.get("water", 0),
            dominant=elem.get("dominant", {}).get("element", "") if isinstance(elem.get("dominant"), dict) else elem.get("dominant", ""),
            balance=elem.get("balance", "")
        )

        mod = chart.get("modalities", {})
        modalities = WesternModalitiesSchema(
            cardinal=mod.get("cardinal", 0),
            fixed=mod.get("fixed", 0),
            mutable=mod.get("mutable", 0),
            dominant=mod.get("dominant", "")
        )

        # =================================================================
        # MOON PHASE
        # =================================================================
        moon_phase = _calculate_moon_phase(sun_longitude, moon_longitude)

        # =================================================================
        # ARABIC PARTS (LOTS)
        # =================================================================
        arabic_parts = None
        arabic_parts_data = chart.get("arabicParts", {})
        if arabic_parts_data and arabic_parts_data.get("parts"):
            parts_dict = {}
            for part_key, part_data in arabic_parts_data.get("parts", {}).items():
                if isinstance(part_data, dict) and "longitude" in part_data:
                    # Assign house to the Arabic Part
                    part_house = _assign_planet_to_house(part_data["longitude"], cusp_longitudes) if cusp_longitudes else None
                    parts_dict[part_key] = ArabicPartSchema(
                        longitude=part_data["longitude"],
                        sign=part_data.get("sign", ""),
                        degreeInSign=part_data.get("degreeInSign", 0),
                        formatted=part_data.get("formatted", ""),
                        house=part_house,
                        formula=part_data.get("formula", ""),
                        zone=part_data.get("zone")
                    )
            arabic_parts = ArabicPartsSchema(
                isDayChart=arabic_parts_data.get("isDayChart", True),
                chartType=arabic_parts_data.get("chartType", "Day Chart"),
                parts=parts_dict
            )

        # =================================================================
        # VENUS CONDITION SUMMARY
        # =================================================================
        venus_condition = None
        venus_schema_data = planets.get("venus")
        if venus_schema_data:
            try:
                from western_engine.models import PlanetPosition as WEPlanetPosition
                from western_engine.planetary_psychology import calculate_venus_condition

                venus_pp = WEPlanetPosition(
                    planet="Venus",
                    longitude=venus_schema_data.longitude,
                    sign=venus_schema_data.sign,
                    degree_in_sign=venus_schema_data.degree,
                    retrograde=venus_schema_data.isRetrograde,
                    house=venus_schema_data.house,
                )
                # Get Sun longitude for combustion/cazimi detection
                sun_schema_data = planets.get("sun")
                sun_lng = sun_schema_data.longitude if sun_schema_data else None
                # Pass raw aspect list so the function can filter Venus aspects
                vc = calculate_venus_condition(venus_pp, chart.get("aspects", []), sun_longitude=sun_lng)
                venus_condition = VenusConditionSchema(**vc)
            except Exception as vc_err:
                print(f"[compute_western] Venus condition warning: {vc_err}")

        # =================================================================
        # BUILD FINAL SCHEMA
        # =================================================================
        return WesternChartSchema(
            sun=sun,
            moon=moon,
            ascendant=ascendant,
            midheaven=midheaven,
            planets=planets,
            houses=house_cusps_list,
            aspects=aspects,
            elements=elements,
            modalities=modalities,
            moonPhase=moon_phase,
            arabicParts=arabic_parts,
            venusCondition=venus_condition,
            houseSystem=chart.get("houseSystem", "Placidus"),
            calculationMethod="Swiss Ephemeris",
            computedAt=datetime.now().isoformat()
        )

    except Exception as e:
        print(f"[compute_western] Error: {e}")
        traceback.print_exc()
        return None


# =============================================================================
# VEDIC COMPUTATION
# =============================================================================

def compute_vedic(
    birth_date: str,
    birth_time: str,
    latitude: float,
    longitude: float,
    timezone: str = "UTC",
    ayanamsha: str = "lahiri"
) -> Optional[VedicChartSchema]:
    """
    Compute Vedic (Jyotish) chart using Swiss Ephemeris sidereal mode.

    Returns canonical VedicChartSchema or None if computation fails.
    """
    try:
        from astro.calculator import SwissEphemerisCalculator

        calc = SwissEphemerisCalculator()
        chart = calc.calculate_vedic_chart(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone,
            ayanamsha=ayanamsha
        )

        # Convert grahas to schema
        grahas = {}
        for name, data in chart.get("grahas", {}).items():
            if isinstance(data, dict) and "longitude" in data:
                rashi_data = data.get("rashi", {})
                nakshatra_data = data.get("nakshatra", {})

                grahas[name] = GrahaSchema(
                    longitude=data["longitude"],
                    rashi=RashiSchema(
                        index=rashi_data.get("index", 0),
                        sanskrit=rashi_data.get("sanskrit", ""),
                        english=rashi_data.get("english", ""),
                        lord=rashi_data.get("lord", ""),
                        element=rashi_data.get("element", ""),
                        degree=rashi_data.get("degree", 0)
                    ),
                    nakshatra=NakshatraSchema(
                        index=nakshatra_data.get("index", 0),
                        name=nakshatra_data.get("name", ""),
                        lord=nakshatra_data.get("lord", ""),
                        deity=nakshatra_data.get("deity", ""),
                        quality=nakshatra_data.get("quality", ""),
                        pada=nakshatra_data.get("pada", 1),
                        degreeInNakshatra=nakshatra_data.get("degreeInNakshatra", 0)
                    ),
                    retrograde=data.get("retrograde", False),
                    english=data.get("english", "")
                )

        # Moon nakshatra
        moon_nak = chart.get("moonNakshatra", {})
        moon_nakshatra = NakshatraSchema(
            index=moon_nak.get("index", 0),
            name=moon_nak.get("name", ""),
            lord=moon_nak.get("lord", ""),
            deity=moon_nak.get("deity", ""),
            quality=moon_nak.get("quality", ""),
            pada=moon_nak.get("pada", 1),
            degreeInNakshatra=moon_nak.get("degreeInNakshatra", 0)
        )

        return VedicChartSchema(
            ayanamsha=chart.get("ayanamsha", "lahiri"),
            ayanamshaValue=chart.get("ayanamshaValue", 0),
            lagna=chart.get("lagna", {}),
            moon=chart.get("grahas", {}).get("chandra", {}),
            moonNakshatra=moon_nakshatra,
            grahas=grahas,
            bhavas=chart.get("bhavas", {}),
            houseSystem=chart.get("houseSystem", "whole_sign"),
            calculationMethod="Swiss Ephemeris (Sidereal)",
            computedAt=datetime.now().isoformat()
        )

    except Exception as e:
        print(f"[compute_vedic] Error: {e}")
        traceback.print_exc()
        return None


# =============================================================================
# UNIFIED VECTOR COMPUTATION
# =============================================================================

def compute_unified(
    bazi: Optional[BaZiChartSchema],
    western: Optional[WesternChartSchema]
) -> Optional[UnifiedProfileSchema]:
    """
    Build unified 90-dimensional expression vector from BaZi + Western charts.

    Returns UnifiedProfileSchema or None if insufficient data.
    """
    try:
        from unified_engine import (
            build_unified_expression,
            derive_persona
        )

        if not bazi or not western:
            print("[compute_unified] Missing BaZi or Western data")
            return None

        # Prepare western data dict for unified engine
        western_data = {
            "elements": {
                "fire": western.elements.fire,
                "earth": western.elements.earth,
                "air": western.elements.air,
                "water": western.elements.water
            },
            "modalities": {
                "cardinal": western.modalities.cardinal,
                "fixed": western.modalities.fixed,
                "mutable": western.modalities.mutable
            },
            "planets": {k: v.model_dump() for k, v in western.planets.items()},
            "aspects": [a.model_dump() for a in western.aspects]
        }

        # Prepare bazi data dict
        bazi_data = {
            "pillars": bazi.pillars.model_dump(),
            "dayMaster": bazi.dayMaster.model_dump(),
            "elements": {
                "Wood": bazi.elements.Wood,
                "Fire": bazi.elements.Fire,
                "Earth": bazi.elements.Earth,
                "Metal": bazi.elements.Metal,
                "Water": bazi.elements.Water
            },
            "tenGods": [tg.model_dump() for tg in bazi.tenGods],
            "dmStrength": bazi.dayMaster.strengthScore
        }

        # Build unified expression
        expr = build_unified_expression(western_data, bazi_data)

        # Extract vector components
        vector = UnifiedVectorSchema(
            westernElements=[
                western.elements.fire / 100,
                western.elements.earth / 100,
                western.elements.air / 100,
                western.elements.water / 100
            ],
            westernModalities=[
                western.modalities.cardinal / 100,
                western.modalities.fixed / 100,
                western.modalities.mutable / 100
            ],
            westernArchetypes=getattr(expr, 'western_archetypes', []),
            westernPatterns=getattr(expr, 'western_patterns', []),
            baziElements=[
                bazi.elements.Wood,
                bazi.elements.Fire,
                bazi.elements.Earth,
                bazi.elements.Metal,
                bazi.elements.Water
            ],
            baziTenGods=getattr(expr, 'ten_gods_vector', []),
            baziDmStrength=bazi.dayMaster.strengthScore,
            vector=getattr(expr, 'vector', []) if hasattr(expr, 'vector') else []
        )

        # Derive persona - extract string values from complex objects
        persona_result = derive_persona(expr)

        # Helper to extract string from object or use default
        def extract_str(obj, attr_name: str, default: str) -> str:
            val = getattr(obj, attr_name, default) if obj else default
            if isinstance(val, str):
                return val
            # If it's a complex object, try to get a summary or string representation
            if hasattr(val, 'summary'):
                return str(val.summary)
            if hasattr(val, 'label'):
                return str(val.label)
            if hasattr(val, 'name'):
                return str(val.name)
            if hasattr(val, '__str__'):
                return str(val)
            return default

        persona = PersonaSchema(
            primaryArchetype=extract_str(persona_result, 'primary_archetype', "Unknown"),
            secondaryArchetype=extract_str(persona_result, 'secondary_archetype', "Unknown"),
            elementProfile=extract_str(persona_result, 'element_profile', "Balanced"),
            functionalStyle=extract_str(persona_result, 'functional_style', "Adaptive"),
            patternProfile=extract_str(persona_result, 'pattern_profile', "Standard"),
            summary=extract_str(persona_result, 'summary', "")
        )

        return UnifiedProfileSchema(
            vector=vector,
            persona=persona
        )

    except ImportError as e:
        print(f"[compute_unified] Unified engine not available: {e}")
        return None
    except Exception as e:
        print(f"[compute_unified] Error: {e}")
        traceback.print_exc()
        return None


# =============================================================================
# MAIN COMPUTATION FUNCTION
# =============================================================================

def compute_profile(request: ComputeProfileRequest) -> ComputedProfileSchema:
    """
    Compute complete profile: BaZi + Western + Vedic + Unified.

    This is the main entry point for the compute-profile endpoint.
    Output is canonical schema - store directly in Firebase.
    """
    birth = request.birth
    options = request.computeOptions or {}

    errors: List[str] = []

    # Initialize results
    bazi = None
    western = None
    vedic = None
    unified = None

    # Compute BaZi
    if options.get("includeBazi", True):
        try:
            bazi = compute_bazi(
                birth_date=birth.birthDate,
                birth_time=birth.birthTime,
                gender=birth.gender,
                latitude=birth.latitude,
                longitude=birth.longitude,
                timezone=birth.timezone
            )
            if not bazi:
                errors.append("BaZi computation returned no result")
        except Exception as e:
            errors.append(f"BaZi error: {str(e)}")

    # Compute Western
    if options.get("includeWestern", True):
        try:
            western = compute_western(
                birth_date=birth.birthDate,
                birth_time=birth.birthTime,
                latitude=birth.latitude,
                longitude=birth.longitude,
                timezone=birth.timezone
            )
            if not western:
                errors.append("Western computation returned no result")
        except Exception as e:
            errors.append(f"Western error: {str(e)}")

    # Compute Vedic
    if options.get("includeVedic", True):
        try:
            vedic = compute_vedic(
                birth_date=birth.birthDate,
                birth_time=birth.birthTime,
                latitude=birth.latitude,
                longitude=birth.longitude,
                timezone=birth.timezone
            )
            if not vedic:
                errors.append("Vedic computation returned no result")
        except Exception as e:
            errors.append(f"Vedic error: {str(e)}")

    # Compute Unified (requires BaZi + Western)
    if options.get("includeUnified", True) and bazi and western:
        try:
            unified = compute_unified(bazi, western)
            if not unified:
                errors.append("Unified computation returned no result")
        except Exception as e:
            errors.append(f"Unified error: {str(e)}")

    return ComputedProfileSchema(
        profileId=request.profileId,
        birthDate=birth.birthDate,
        birthTime=birth.birthTime,
        latitude=birth.latitude,
        longitude=birth.longitude,
        timezone=birth.timezone,
        gender=birth.gender,
        bazi=bazi,
        western=western,
        vedic=vedic,
        unified=unified,
        computedAt=datetime.now().isoformat(),
        computeVersion="2.0.0",
        errors=errors
    )
