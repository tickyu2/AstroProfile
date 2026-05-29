"""
Luna Fusion Swiss Ephemeris Utilities
Shared astronomical calculations using pyswisseph

Used by P4 Aspects, P5 Transits, P6 Composite, P8 Progressions
"""

import swisseph as swe
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import math

from .constants import PLANETS, PLANET_NAMES, ASPECT_TYPES, ASPECT_ORBS, LUMINARY_ORB_BONUS

# Initialize Swiss Ephemeris — reuse ephemeris path from astro.calculator if available
from astro.calculator import _EPHE_DIR as _CALC_EPHE_DIR
if _CALC_EPHE_DIR:
    swe.set_ephe_path(_CALC_EPHE_DIR)
else:
    swe.set_ephe_path(None)

# Planet ID mapping for swisseph
SWISSEPH_PLANETS = {
    'Sun': swe.SUN,
    'Moon': swe.MOON,
    'Mercury': swe.MERCURY,
    'Venus': swe.VENUS,
    'Mars': swe.MARS,
    'Jupiter': swe.JUPITER,
    'Saturn': swe.SATURN,
    'Uranus': swe.URANUS,
    'Neptune': swe.NEPTUNE,
    'Pluto': swe.PLUTO
}


def datetime_to_jd(dt: datetime) -> float:
    """
    Convert datetime to Julian Day number.

    Args:
        dt: Python datetime object

    Returns:
        Julian Day number
    """
    year = dt.year
    month = dt.month
    day = dt.day
    hour = dt.hour + dt.minute / 60.0 + dt.second / 3600.0

    return swe.julday(year, month, day, hour)


def jd_to_datetime(jd: float) -> datetime:
    """
    Convert Julian Day to datetime.

    Args:
        jd: Julian Day number

    Returns:
        Python datetime object
    """
    result = swe.revjul(jd)
    year, month, day, hour_float = result

    hours = int(hour_float)
    minutes = int((hour_float - hours) * 60)
    seconds = int(((hour_float - hours) * 60 - minutes) * 60)

    return datetime(year, month, day, hours, minutes, seconds)


def get_planet_position(planet_name: str, jd: float) -> Dict:
    """
    Get planet position at Julian Day.

    Args:
        planet_name: Name of planet (Sun, Moon, etc.)
        jd: Julian Day number

    Returns:
        Dict with longitude, latitude, distance, speed
    """
    if planet_name not in SWISSEPH_PLANETS:
        raise ValueError(f"Unknown planet: {planet_name}")

    planet_id = SWISSEPH_PLANETS[planet_name]

    # Calculate position (tropical zodiac)
    result, ret_flag = swe.calc_ut(jd, planet_id)

    return {
        'planet': planet_name,
        'longitude': result[0],  # 0-360 degrees
        'latitude': result[1],
        'distance': result[2],
        'speed': result[3],      # degrees per day
        'sign': get_sign_from_longitude(result[0]),
        'degree_in_sign': result[0] % 30
    }


def get_all_planet_positions(jd: float,
                             planets: List[str] = None) -> Dict[str, Dict]:
    """
    Get positions for multiple planets.

    Args:
        jd: Julian Day number
        planets: List of planet names (defaults to all)

    Returns:
        Dict mapping planet names to position data
    """
    if planets is None:
        planets = PLANET_NAMES

    return {planet: get_planet_position(planet, jd) for planet in planets}


def get_sign_from_longitude(longitude: float) -> str:
    """
    Get zodiac sign from ecliptic longitude.

    Args:
        longitude: Ecliptic longitude (0-360)

    Returns:
        Sign name
    """
    signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
    sign_index = int(longitude / 30) % 12
    return signs[sign_index]


def calculate_angle_difference(lon1: float, lon2: float) -> float:
    """
    Calculate the shortest angular difference between two longitudes.

    Args:
        lon1: First longitude (0-360)
        lon2: Second longitude (0-360)

    Returns:
        Absolute angular difference (0-180)
    """
    diff = abs(lon1 - lon2)
    if diff > 180:
        diff = 360 - diff
    return diff


def identify_aspect(angle: float, orb_multiplier: float = 1.0) -> Optional[Dict]:
    """
    Identify if an angle forms a recognized aspect.

    Args:
        angle: Angular difference in degrees
        orb_multiplier: Multiplier for orb (e.g., 1.25 for luminaries)

    Returns:
        Aspect info dict or None if no aspect
    """
    for aspect_name, aspect_info in ASPECT_TYPES.items():
        target_angle = aspect_info['angle']
        max_orb = ASPECT_ORBS[aspect_name] * orb_multiplier

        orb = abs(angle - target_angle)
        if orb <= max_orb:
            return {
                'aspect': aspect_name,
                'exact_angle': target_angle,
                'actual_angle': angle,
                'orb': orb,
                'max_orb': max_orb,
                'quality': aspect_info['quality'],
                'symbol': aspect_info['symbol'],
                'applying': None  # Set by caller if speeds known
            }

    return None


def calculate_aspects(positions: Dict[str, Dict],
                      pairs: List[Tuple[str, str]] = None) -> List[Dict]:
    """
    Calculate all aspects between planet positions.

    Args:
        positions: Dict of planet positions from get_all_planet_positions
        pairs: Optional list of specific pairs to check. If None, checks all.

    Returns:
        List of aspect dictionaries
    """
    aspects = []

    # Generate pairs if not provided
    if pairs is None:
        planet_list = list(positions.keys())
        pairs = []
        for i, p1 in enumerate(planet_list):
            for p2 in planet_list[i+1:]:
                pairs.append((p1, p2))

    for planet1, planet2 in pairs:
        if planet1 not in positions or planet2 not in positions:
            continue

        pos1 = positions[planet1]
        pos2 = positions[planet2]

        angle = calculate_angle_difference(pos1['longitude'], pos2['longitude'])

        # Wider orbs for luminaries
        orb_mult = 1.0
        if planet1 in ['Sun', 'Moon'] or planet2 in ['Sun', 'Moon']:
            orb_mult = 1.0 + (LUMINARY_ORB_BONUS / 8.0)  # Proportional increase

        aspect = identify_aspect(angle, orb_mult)

        if aspect:
            aspect['planet1'] = {
                'name': planet1,
                'longitude': pos1['longitude'],
                'sign': pos1['sign'],
                'speed': pos1['speed']
            }
            aspect['planet2'] = {
                'name': planet2,
                'longitude': pos2['longitude'],
                'sign': pos2['sign'],
                'speed': pos2['speed']
            }

            # Determine if applying (faster planet approaching exact aspect)
            # Simplified: comparing speeds
            if pos1['speed'] > pos2['speed']:
                faster = planet1
            else:
                faster = planet2

            aspect['applying'] = _is_applying(
                pos1['longitude'], pos2['longitude'],
                pos1['speed'], pos2['speed'],
                aspect['exact_angle']
            )

            aspects.append(aspect)

    return aspects


def _is_applying(lon1: float, lon2: float,
                 speed1: float, speed2: float,
                 aspect_angle: float) -> bool:
    """
    Determine if an aspect is applying (tightening) or separating.

    Args:
        lon1, lon2: Longitudes
        speed1, speed2: Speeds (degrees/day)
        aspect_angle: Target aspect angle

    Returns:
        True if applying, False if separating
    """
    current_diff = calculate_angle_difference(lon1, lon2)

    # Project forward slightly
    future_lon1 = (lon1 + speed1 * 0.1) % 360
    future_lon2 = (lon2 + speed2 * 0.1) % 360
    future_diff = calculate_angle_difference(future_lon1, future_lon2)

    # If orb is decreasing, aspect is applying
    current_orb = abs(current_diff - aspect_angle)
    future_orb = abs(future_diff - aspect_angle)

    return future_orb < current_orb


def calculate_progressed_date(birth_jd: float, current_jd: float) -> float:
    """
    Calculate progressed Julian Day using day-for-year method.

    Secondary Progressions: 1 day after birth = 1 year of life

    Args:
        birth_jd: Julian Day of birth
        current_jd: Current Julian Day

    Returns:
        Progressed Julian Day
    """
    years_lived = (current_jd - birth_jd) / 365.25
    # Progressed date = birth + (years_lived) days
    return birth_jd + years_lived


def get_progressed_positions(birth_jd: float,
                             current_jd: float,
                             planets: List[str] = None) -> Dict[str, Dict]:
    """
    Get secondary progressed planet positions.

    Args:
        birth_jd: Julian Day of birth
        current_jd: Current Julian Day
        planets: List of planets (defaults to all)

    Returns:
        Dict of progressed positions
    """
    progressed_jd = calculate_progressed_date(birth_jd, current_jd)
    return get_all_planet_positions(progressed_jd, planets)


def calculate_composite_positions(positions1: Dict[str, Dict],
                                  positions2: Dict[str, Dict]) -> Dict[str, Dict]:
    """
    Calculate composite chart positions using midpoint method.

    Args:
        positions1: First person's planet positions
        positions2: Second person's planet positions

    Returns:
        Composite positions (midpoints)
    """
    composite = {}

    for planet in positions1:
        if planet not in positions2:
            continue

        lon1 = positions1[planet]['longitude']
        lon2 = positions2[planet]['longitude']

        # Calculate midpoint (handling the 360° wrap)
        diff = lon2 - lon1
        if diff > 180:
            diff -= 360
        elif diff < -180:
            diff += 360

        midpoint = (lon1 + diff / 2) % 360

        composite[planet] = {
            'planet': planet,
            'longitude': midpoint,
            'sign': get_sign_from_longitude(midpoint),
            'degree_in_sign': midpoint % 30,
            'latitude': 0,  # Midpoints are on ecliptic
            'speed': (positions1[planet]['speed'] + positions2[planet]['speed']) / 2
        }

    return composite


def get_current_julian_day() -> float:
    """Get Julian Day for current moment."""
    return datetime_to_jd(datetime.utcnow())


def birth_data_to_jd(year: int, month: int, day: int,
                     hour: int = 12, minute: int = 0,
                     timezone_offset: float = 0.0) -> float:
    """
    Convert birth data to Julian Day.

    Args:
        year, month, day: Birth date
        hour, minute: Birth time (local time)
        timezone_offset: Hours offset from UTC (e.g., -5 for EST)

    Returns:
        Julian Day number
    """
    # Convert to UTC
    utc_hour = hour - timezone_offset
    utc_hour += minute / 60.0

    return swe.julday(year, month, day, utc_hour)


# =============================================================================
# SEASONAL INGRESS CALCULATIONS (Equinoxes, Solstices, Sign Ingresses)
# =============================================================================

# Sign ingress data: longitude, sign name, season, phase
SIGN_INGRESSES = [
    (0, 'Aries', 'Spring', 'begin'),       # Vernal Equinox
    (30, 'Taurus', 'Spring', 'core'),
    (60, 'Gemini', 'Spring', 'end'),
    (90, 'Cancer', 'Summer', 'begin'),     # Summer Solstice
    (120, 'Leo', 'Summer', 'core'),
    (150, 'Virgo', 'Summer', 'end'),
    (180, 'Libra', 'Autumn', 'begin'),     # Autumnal Equinox
    (210, 'Scorpio', 'Autumn', 'core'),
    (240, 'Sagittarius', 'Autumn', 'end'),
    (270, 'Capricorn', 'Winter', 'begin'), # Winter Solstice
    (300, 'Aquarius', 'Winter', 'core'),
    (330, 'Pisces', 'Winter', 'end'),
]


def find_sun_at_longitude(target_lon: float, start_jd: float,
                          direction: int = 1, max_iterations: int = 50) -> float:
    """
    Find the Julian Day when the Sun reaches a specific longitude.
    Uses Newton-Raphson iteration for precision.

    Args:
        target_lon: Target ecliptic longitude (0-360)
        start_jd: Starting Julian Day for search
        direction: 1 for forward search, -1 for backward
        max_iterations: Maximum iterations for convergence

    Returns:
        Julian Day when Sun reaches target longitude
    """
    jd = start_jd
    target_lon = target_lon % 360

    for _ in range(max_iterations):
        # Get current Sun position
        sun_pos = get_planet_position('Sun', jd)
        current_lon = sun_pos['longitude']

        # Calculate difference (handling 360° wrap)
        diff = target_lon - current_lon
        if diff > 180:
            diff -= 360
        elif diff < -180:
            diff += 360

        # Check convergence (within 1 second of arc = 1/3600 degree)
        if abs(diff) < 0.0003:
            return jd

        # Sun moves ~1 degree per day, adjust JD
        # Speed is degrees per day from ephemeris
        speed = sun_pos['speed']
        if speed <= 0:
            speed = 0.9856  # Fallback: mean solar motion

        jd += diff / speed

    return jd  # Return best estimate


def calculate_seasonal_ingresses(year: int) -> List[Dict]:
    """
    Calculate all 12 seasonal ingress times for a given year.

    This includes:
    - 4 Cardinal ingresses (Equinoxes & Solstices)
    - 4 Fixed ingresses (Core of each season)
    - 4 Mutable ingresses (End of each season)

    Args:
        year: Calendar year to calculate

    Returns:
        List of 12 ingress dictionaries with datetime and metadata
    """
    results = []

    for target_lon, sign, season, phase in SIGN_INGRESSES:
        # Estimate starting point based on typical dates
        # Aries (0°) around March 20 = day 79
        # Each sign is ~30 days later
        sign_index = target_lon // 30
        estimated_day = 79 + (sign_index * 30.44)

        # Handle year wrap for Capricorn, Aquarius, Pisces
        if sign_index >= 9:  # Capricorn onwards
            # These occur in winter, possibly next year for Aquarius/Pisces
            if sign_index == 9:  # Capricorn - December of current year
                start_jd = datetime_to_jd(datetime(year, 12, 15, 12, 0, 0))
            elif sign_index == 10:  # Aquarius - January of next year
                start_jd = datetime_to_jd(datetime(year + 1, 1, 15, 12, 0, 0))
            elif sign_index == 11:  # Pisces - February of next year
                start_jd = datetime_to_jd(datetime(year + 1, 2, 15, 12, 0, 0))
        else:
            # Estimate month from day of year
            month = int((estimated_day - 1) // 30.44) + 1
            month = max(1, min(12, month))
            day = 15  # Mid-month starting point
            start_jd = datetime_to_jd(datetime(year, month, day, 12, 0, 0))

        # Find exact ingress time
        ingress_jd = find_sun_at_longitude(target_lon, start_jd)
        ingress_dt = jd_to_datetime(ingress_jd)

        # Determine if this is a major astronomical event
        is_equinox = target_lon in [0, 180]
        is_solstice = target_lon in [90, 270]

        event_name = None
        if target_lon == 0:
            event_name = 'Vernal Equinox'
        elif target_lon == 90:
            event_name = 'Summer Solstice'
        elif target_lon == 180:
            event_name = 'Autumnal Equinox'
        elif target_lon == 270:
            event_name = 'Winter Solstice'

        results.append({
            'longitude': target_lon,
            'sign': sign,
            'season': season,
            'phase': phase,
            'datetime_utc': ingress_dt,
            'julian_day': ingress_jd,
            'year': ingress_dt.year,
            'month': ingress_dt.month,
            'day': ingress_dt.day,
            'hour': ingress_dt.hour,
            'minute': ingress_dt.minute,
            'is_equinox': is_equinox,
            'is_solstice': is_solstice,
            'event_name': event_name,
            'formatted': ingress_dt.strftime('%Y-%m-%d %H:%M UTC'),
        })

    return results


# =============================================================================
# ALL-PLANET SIGN INGRESSES (Reverse Engineering Engine)
# =============================================================================

SIGNS_LIST = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

# Conservative sampling step per planet (days). Each step must be small enough
# that the planet cannot traverse a whole 30° sign — safe for retrograde too.
_INGRESS_STEP_DAYS = {
    'Sun': 2.0,
    'Moon': 0.5,
    'Mercury': 1.0,
    'Venus': 1.0,
    'Mars': 2.0,
    'Jupiter': 5.0,
    'Saturn': 10.0,
    'Uranus': 20.0,
    'Neptune': 30.0,
    'Pluto': 30.0,
}

_DEFAULT_INGRESS_PLANETS = [
    'Sun', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
]


def _sign_index(longitude: float) -> int:
    return int((longitude % 360) / 30)


def _refine_sign_crossing(planet: str, jd_lo: float, jd_hi: float,
                          tolerance_seconds: float = 30.0) -> float:
    """
    Bisect to find the exact JD at which the planet leaves the sign it was in at jd_lo.
    Robust to retrograde motion (unlike Newton-Raphson with speed).
    """
    sign_lo = _sign_index(get_planet_position(planet, jd_lo)['longitude'])
    tol_jd = tolerance_seconds / 86400.0
    while (jd_hi - jd_lo) > tol_jd:
        jd_mid = (jd_lo + jd_hi) / 2.0
        sign_mid = _sign_index(get_planet_position(planet, jd_mid)['longitude'])
        if sign_mid == sign_lo:
            jd_lo = jd_mid
        else:
            jd_hi = jd_mid
    return jd_hi


def calculate_planet_ingresses_for_year(planet: str, year: int) -> List[Dict]:
    """
    Find every sign ingress (including retrograde re-crossings) for a single planet
    within a given calendar year (UTC). Returns events in chronological order.
    """
    if planet not in SWISSEPH_PLANETS:
        raise ValueError(f"Unknown planet: {planet}")
    if planet not in _INGRESS_STEP_DAYS:
        raise ValueError(f"No sampling step configured for planet: {planet}")

    step_days = _INGRESS_STEP_DAYS[planet]
    jd_start = datetime_to_jd(datetime(year, 1, 1, 0, 0, 0))
    jd_end = datetime_to_jd(datetime(year + 1, 1, 1, 0, 0, 0))

    crossings: List[Dict] = []
    jd_prev = jd_start
    prev_lon = get_planet_position(planet, jd_prev)['longitude']
    prev_sign = _sign_index(prev_lon)

    while jd_prev < jd_end:
        jd_next = min(jd_prev + step_days, jd_end)
        next_lon = get_planet_position(planet, jd_next)['longitude']
        next_sign = _sign_index(next_lon)

        if next_sign != prev_sign:
            exact_jd = _refine_sign_crossing(planet, jd_prev, jd_next)
            pos_at_cross = get_planet_position(planet, exact_jd)
            from_sign_idx = prev_sign
            to_sign_idx = _sign_index(pos_at_cross['longitude'])
            ingress_dt = jd_to_datetime(exact_jd)
            # Retrograde if direction goes from higher sign index to lower (mod 12)
            delta = (to_sign_idx - from_sign_idx) % 12
            is_retrograde = delta == 11  # e.g. Cancer(3) -> Gemini(2)
            crossings.append({
                'planet': planet,
                'from_sign': SIGNS_LIST[from_sign_idx],
                'to_sign': SIGNS_LIST[to_sign_idx],
                'longitude_at_cross': pos_at_cross['longitude'],
                'speed_at_cross': pos_at_cross['speed'],
                'datetime_utc': ingress_dt,
                'julian_day': exact_jd,
                'year': ingress_dt.year,
                'month': ingress_dt.month,
                'day': ingress_dt.day,
                'hour': ingress_dt.hour,
                'minute': ingress_dt.minute,
                'retrograde': is_retrograde,
            })
            prev_sign = next_sign

        jd_prev = jd_next
        prev_lon = next_lon

    return crossings


def calculate_all_planet_ingresses(year: int,
                                   planets: List[str] = None) -> Dict[str, object]:
    """
    Compute sign ingresses for multiple planets across a calendar year.

    Returns:
        {
          'year': int,
          'starting_signs': { planet: sign_at_jan_1_utc },
          'ingresses': [ ...chronologically merged events across requested planets... ],
          'by_planet': { planet: [events...] }
        }
    """
    if planets is None:
        planets = list(_DEFAULT_INGRESS_PLANETS)

    jd_jan1 = datetime_to_jd(datetime(year, 1, 1, 0, 0, 0))
    starting_signs: Dict[str, str] = {}
    by_planet: Dict[str, List[Dict]] = {}
    merged: List[Dict] = []

    for planet in planets:
        starting_signs[planet] = SIGNS_LIST[
            _sign_index(get_planet_position(planet, jd_jan1)['longitude'])
        ]
        events = calculate_planet_ingresses_for_year(planet, year)
        by_planet[planet] = events
        merged.extend(events)

    merged.sort(key=lambda e: e['julian_day'])

    return {
        'year': year,
        'planets': planets,
        'starting_signs': starting_signs,
        'ingresses': merged,
        'by_planet': by_planet,
    }


def get_equinoxes_solstices(year: int) -> Dict[str, Dict]:
    """
    Get just the 4 major astronomical events for a year.

    Args:
        year: Calendar year

    Returns:
        Dict with vernal_equinox, summer_solstice, autumnal_equinox, winter_solstice
    """
    all_ingresses = calculate_seasonal_ingresses(year)

    return {
        'vernal_equinox': next(i for i in all_ingresses if i['event_name'] == 'Vernal Equinox'),
        'summer_solstice': next(i for i in all_ingresses if i['event_name'] == 'Summer Solstice'),
        'autumnal_equinox': next(i for i in all_ingresses if i['event_name'] == 'Autumnal Equinox'),
        'winter_solstice': next(i for i in all_ingresses if i['event_name'] == 'Winter Solstice'),
    }


def get_season_boundaries(year: int) -> Dict[str, List[Dict]]:
    """
    Get seasonal boundaries organized by season.

    Args:
        year: Calendar year

    Returns:
        Dict with Spring, Summer, Autumn, Winter keys,
        each containing list of begin/core/end ingresses
    """
    all_ingresses = calculate_seasonal_ingresses(year)

    return {
        'Spring': [i for i in all_ingresses if i['season'] == 'Spring'],
        'Summer': [i for i in all_ingresses if i['season'] == 'Summer'],
        'Autumn': [i for i in all_ingresses if i['season'] == 'Autumn'],
        'Winter': [i for i in all_ingresses if i['season'] == 'Winter'],
    }


def format_seasonal_calendar(year: int) -> str:
    """
    Generate a formatted seasonal calendar for display.

    Args:
        year: Calendar year

    Returns:
        Formatted string with all seasonal dates
    """
    ingresses = calculate_seasonal_ingresses(year)

    lines = [
        f"═══════════════════════════════════════════════════════════════",
        f"  SEASONAL CALENDAR {year}/{year+1}",
        f"  Calculated by Swiss Ephemeris",
        f"═══════════════════════════════════════════════════════════════",
        "",
    ]

    current_season = None
    for ing in ingresses:
        if ing['season'] != current_season:
            current_season = ing['season']
            lines.append(f"  {current_season.upper()}")
            lines.append(f"  {'─' * 55}")

        phase_label = f"{ing['phase'].capitalize():6}"
        sign_label = f"{ing['sign']:12}"
        date_str = ing['datetime_utc'].strftime('%a %b %d, %Y  %H:%M UTC')

        event_marker = ""
        if ing['event_name']:
            event_marker = f"  ★ {ing['event_name']}"

        lines.append(f"    {phase_label} │ {sign_label} │ {date_str}{event_marker}")

        if ing['phase'] == 'end':
            lines.append("")

    return "\n".join(lines)
