"""
Swiss Ephemeris Calculator for GENESIS
Precision natal chart calculations with sub-arc-second accuracy
"""

import swisseph as swe
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import pytz
from dateutil import parser as date_parser
import math
import os

# Initialize Swiss Ephemeris path — use bundled .se1 files for asteroid support
# Try multiple candidate paths for Cloud Run / local environments
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_THIS_DIR)
_EPHE_CANDIDATES = [
    os.path.join(_ROOT_DIR, 'ephe'),                        # astro/../ephe
    os.path.join(_THIS_DIR, '..', 'ephe'),                   # relative ..
    '/workspace/ephe',                                        # Cloud Run default
    os.path.join(os.getcwd(), 'ephe'),                       # cwd/ephe
    '/srv/ephe',                                              # alternative Cloud Run
    os.path.join(os.path.expanduser('~'), 'ephe'),           # home/ephe
]
_EPHE_DIR = None
_EPHE_DIAG = {
    '__file__': os.path.abspath(__file__),
    'cwd': os.getcwd(),
    'candidates_tried': [],
}
for _candidate in _EPHE_CANDIDATES:
    _abs = os.path.abspath(_candidate)
    _exists = os.path.isdir(_abs)
    _EPHE_DIAG['candidates_tried'].append({'path': _abs, 'exists': _exists})
    if _exists and _EPHE_DIR is None:
        _EPHE_DIR = _abs

if _EPHE_DIR:
    swe.set_ephe_path(_EPHE_DIR)
    _EPHE_DIAG['resolved'] = _EPHE_DIR
    _EPHE_DIAG['files'] = os.listdir(_EPHE_DIR)
    print(f"[SwissEph] Using ephemeris files from: {_EPHE_DIR}")
    print(f"[SwissEph] Files: {os.listdir(_EPHE_DIR)}")
else:
    swe.set_ephe_path(None)  # fallback to Moshier (no asteroid support)
    _EPHE_DIAG['resolved'] = None
    _EPHE_DIAG['files'] = []
    print(f"[SwissEph] WARNING: No ephe directory found.")
    print(f"[SwissEph] Diagnostics: {_EPHE_DIAG}")
    # Last resort: list contents of parent directory to see what's actually there
    try:
        _EPHE_DIAG['root_contents'] = os.listdir(_ROOT_DIR)
        print(f"[SwissEph] Root dir ({_ROOT_DIR}) contents: {_EPHE_DIAG['root_contents']}")
    except Exception as e:
        _EPHE_DIAG['root_contents'] = f"ERROR: {e}"


def get_ephe_diagnostics():
    """Return ephemeris path diagnostic info for debugging"""
    return _EPHE_DIAG


# ============================================================================
# VEDIC ASTROLOGY CONSTANTS
# ============================================================================

# Ayanamsha options (offset between Tropical and Sidereal zodiacs)
AYANAMSHA_OPTIONS = {
    'lahiri': swe.SIDM_LAHIRI,           # Most widely used (Chitrapaksha)
    'raman': swe.SIDM_RAMAN,             # B.V. Raman
    'krishnamurti': swe.SIDM_KRISHNAMURTI,  # KP system
    'fagan_bradley': swe.SIDM_FAGAN_BRADLEY,
    'deluce': swe.SIDM_DELUCE,
    'yukteshwar': swe.SIDM_YUKTESHWAR,
    'true_chitra': swe.SIDM_TRUE_CITRA,
}

# Sanskrit names for zodiac signs (Rashis)
RASHIS = [
    {'index': 0, 'sanskrit': 'Mesha', 'english': 'Aries', 'lord': 'Mars', 'element': 'Fire', 'symbol': '♈'},
    {'index': 1, 'sanskrit': 'Vrishabha', 'english': 'Taurus', 'lord': 'Venus', 'element': 'Earth', 'symbol': '♉'},
    {'index': 2, 'sanskrit': 'Mithuna', 'english': 'Gemini', 'lord': 'Mercury', 'element': 'Air', 'symbol': '♊'},
    {'index': 3, 'sanskrit': 'Karka', 'english': 'Cancer', 'lord': 'Moon', 'element': 'Water', 'symbol': '♋'},
    {'index': 4, 'sanskrit': 'Simha', 'english': 'Leo', 'lord': 'Sun', 'element': 'Fire', 'symbol': '♌'},
    {'index': 5, 'sanskrit': 'Kanya', 'english': 'Virgo', 'lord': 'Mercury', 'element': 'Earth', 'symbol': '♍'},
    {'index': 6, 'sanskrit': 'Tula', 'english': 'Libra', 'lord': 'Venus', 'element': 'Air', 'symbol': '♎'},
    {'index': 7, 'sanskrit': 'Vrishchika', 'english': 'Scorpio', 'lord': 'Mars', 'element': 'Water', 'symbol': '♏'},
    {'index': 8, 'sanskrit': 'Dhanu', 'english': 'Sagittarius', 'lord': 'Jupiter', 'element': 'Fire', 'symbol': '♐'},
    {'index': 9, 'sanskrit': 'Makara', 'english': 'Capricorn', 'lord': 'Saturn', 'element': 'Earth', 'symbol': '♑'},
    {'index': 10, 'sanskrit': 'Kumbha', 'english': 'Aquarius', 'lord': 'Saturn', 'element': 'Air', 'symbol': '♒'},
    {'index': 11, 'sanskrit': 'Meena', 'english': 'Pisces', 'lord': 'Jupiter', 'element': 'Water', 'symbol': '♓'},
]

# 27 Nakshatras (Lunar Mansions) - each spans 13°20' (800 arc-minutes)
NAKSHATRAS = [
    {'index': 0, 'name': 'Ashwini', 'lord': 'Ketu', 'deity': 'Ashwini Kumaras', 'symbol': '🐴', 'quality': 'Light/Swift'},
    {'index': 1, 'name': 'Bharani', 'lord': 'Venus', 'deity': 'Yama', 'symbol': '🔺', 'quality': 'Fierce/Severe'},
    {'index': 2, 'name': 'Krittika', 'lord': 'Sun', 'deity': 'Agni', 'symbol': '🔥', 'quality': 'Mixed'},
    {'index': 3, 'name': 'Rohini', 'lord': 'Moon', 'deity': 'Brahma', 'symbol': '🐂', 'quality': 'Fixed/Permanent'},
    {'index': 4, 'name': 'Mrigashira', 'lord': 'Mars', 'deity': 'Soma', 'symbol': '🦌', 'quality': 'Soft/Mild'},
    {'index': 5, 'name': 'Ardra', 'lord': 'Rahu', 'deity': 'Rudra', 'symbol': '💎', 'quality': 'Sharp/Dreadful'},
    {'index': 6, 'name': 'Punarvasu', 'lord': 'Jupiter', 'deity': 'Aditi', 'symbol': '🏹', 'quality': 'Movable/Ephemeral'},
    {'index': 7, 'name': 'Pushya', 'lord': 'Saturn', 'deity': 'Brihaspati', 'symbol': '🌸', 'quality': 'Light/Swift'},
    {'index': 8, 'name': 'Ashlesha', 'lord': 'Mercury', 'deity': 'Sarpas', 'symbol': '🐍', 'quality': 'Sharp/Dreadful'},
    {'index': 9, 'name': 'Magha', 'lord': 'Ketu', 'deity': 'Pitris', 'symbol': '👑', 'quality': 'Fierce/Severe'},
    {'index': 10, 'name': 'Purva Phalguni', 'lord': 'Venus', 'deity': 'Bhaga', 'symbol': '🛏️', 'quality': 'Fierce/Severe'},
    {'index': 11, 'name': 'Uttara Phalguni', 'lord': 'Sun', 'deity': 'Aryaman', 'symbol': '🛏️', 'quality': 'Fixed/Permanent'},
    {'index': 12, 'name': 'Hasta', 'lord': 'Moon', 'deity': 'Savitar', 'symbol': '✋', 'quality': 'Light/Swift'},
    {'index': 13, 'name': 'Chitra', 'lord': 'Mars', 'deity': 'Vishvakarman', 'symbol': '💎', 'quality': 'Soft/Mild'},
    {'index': 14, 'name': 'Swati', 'lord': 'Rahu', 'deity': 'Vayu', 'symbol': '🌱', 'quality': 'Movable/Ephemeral'},
    {'index': 15, 'name': 'Vishakha', 'lord': 'Jupiter', 'deity': 'Indra-Agni', 'symbol': '🎯', 'quality': 'Mixed'},
    {'index': 16, 'name': 'Anuradha', 'lord': 'Saturn', 'deity': 'Mitra', 'symbol': '🪷', 'quality': 'Soft/Mild'},
    {'index': 17, 'name': 'Jyeshtha', 'lord': 'Mercury', 'deity': 'Indra', 'symbol': '👂', 'quality': 'Sharp/Dreadful'},
    {'index': 18, 'name': 'Mula', 'lord': 'Ketu', 'deity': 'Nirriti', 'symbol': '🦁', 'quality': 'Sharp/Dreadful'},
    {'index': 19, 'name': 'Purva Ashadha', 'lord': 'Venus', 'deity': 'Apas', 'symbol': '🐘', 'quality': 'Fierce/Severe'},
    {'index': 20, 'name': 'Uttara Ashadha', 'lord': 'Sun', 'deity': 'Vishvadevas', 'symbol': '🐘', 'quality': 'Fixed/Permanent'},
    {'index': 21, 'name': 'Shravana', 'lord': 'Moon', 'deity': 'Vishnu', 'symbol': '👂', 'quality': 'Movable/Ephemeral'},
    {'index': 22, 'name': 'Dhanishta', 'lord': 'Mars', 'deity': 'Vasus', 'symbol': '🥁', 'quality': 'Movable/Ephemeral'},
    {'index': 23, 'name': 'Shatabhisha', 'lord': 'Rahu', 'deity': 'Varuna', 'symbol': '⭕', 'quality': 'Movable/Ephemeral'},
    {'index': 24, 'name': 'Purva Bhadrapada', 'lord': 'Jupiter', 'deity': 'Aja Ekapada', 'symbol': '🛏️', 'quality': 'Fierce/Severe'},
    {'index': 25, 'name': 'Uttara Bhadrapada', 'lord': 'Saturn', 'deity': 'Ahir Budhnya', 'symbol': '🛏️', 'quality': 'Fixed/Permanent'},
    {'index': 26, 'name': 'Revati', 'lord': 'Mercury', 'deity': 'Pushan', 'symbol': '🐟', 'quality': 'Soft/Mild'},
]

# Vedic planets (Grahas) - traditional 9 grahas
VEDIC_GRAHAS = {
    'surya': swe.SUN,       # Sun
    'chandra': swe.MOON,    # Moon
    'mangala': swe.MARS,    # Mars
    'budha': swe.MERCURY,   # Mercury
    'guru': swe.JUPITER,    # Jupiter
    'shukra': swe.VENUS,    # Venus
    'shani': swe.SATURN,    # Saturn
    'rahu': swe.MEAN_NODE,  # North Node (ascending)
    'ketu': -1,             # South Node (calculated from Rahu)
}

# Graha English names mapping
GRAHA_ENGLISH = {
    'surya': 'Sun',
    'chandra': 'Moon',
    'mangala': 'Mars',
    'budha': 'Mercury',
    'guru': 'Jupiter',
    'shukra': 'Venus',
    'shani': 'Saturn',
    'rahu': 'Rahu (North Node)',
    'ketu': 'Ketu (South Node)',
}


class SwissEphemerisCalculator:
    """
    Swiss Ephemeris Calculator for precision astrology calculations.
    Provides natal chart, planetary positions, aspects, and elemental analysis.
    """

    # Planet constants
    PLANETS = {
        'sun': swe.SUN,
        'moon': swe.MOON,
        'mercury': swe.MERCURY,
        'venus': swe.VENUS,
        'mars': swe.MARS,
        'jupiter': swe.JUPITER,
        'saturn': swe.SATURN,
        'uranus': swe.URANUS,
        'neptune': swe.NEPTUNE,
        'pluto': swe.PLUTO,
        'north_node': swe.MEAN_NODE,
        'chiron': swe.CHIRON,
        # Major asteroids (body IDs 17-20 in Swiss Ephemeris)
        'ceres': getattr(swe, 'CERES', 17),
        'pallas': getattr(swe, 'PALLAS', 18),
        'juno': getattr(swe, 'JUNO', 19),
        'vesta': getattr(swe, 'VESTA', 20),
    }

    # Zodiac signs
    SIGNS = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]

    # Element mappings
    ELEMENTS = {
        'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
        'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
        'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
        'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
    }

    # Modality mappings
    MODALITIES = {
        'Aries': 'cardinal', 'Cancer': 'cardinal', 'Libra': 'cardinal', 'Capricorn': 'cardinal',
        'Taurus': 'fixed', 'Leo': 'fixed', 'Scorpio': 'fixed', 'Aquarius': 'fixed',
        'Gemini': 'mutable', 'Virgo': 'mutable', 'Sagittarius': 'mutable', 'Pisces': 'mutable'
    }

    # Planet weights for elemental calculation (weighted by significance)
    PLANET_WEIGHTS = {
        'sun': 4.0,      # Core identity
        'moon': 4.0,     # Emotional nature
        'mercury': 3.0,  # Communication
        'venus': 3.0,    # Love/values
        'mars': 3.0,     # Drive/action
        'jupiter': 2.0,  # Expansion
        'saturn': 2.0,   # Structure
        'uranus': 1.5,   # Innovation
        'neptune': 1.5,  # Spirituality
        'pluto': 1.5,    # Transformation
        'north_node': 1.0,  # Destiny
        'chiron': 1.0    # Healing
    }

    # Aspect definitions (orbs in degrees)
    ASPECTS = {
        'conjunction': {'angle': 0, 'orb': 8},
        'opposition': {'angle': 180, 'orb': 8},
        'trine': {'angle': 120, 'orb': 8},
        'square': {'angle': 90, 'orb': 7},
        'sextile': {'angle': 60, 'orb': 6},
        'quincunx': {'angle': 150, 'orb': 3}
    }

    def __init__(self):
        """Initialize the calculator"""
        pass

    def _datetime_to_julian(self, dt: datetime) -> float:
        """Convert datetime to Julian Day number"""
        return swe.julday(
            dt.year, dt.month, dt.day,
            dt.hour + dt.minute / 60.0 + dt.second / 3600.0
        )

    def _degree_to_sign(self, degree: float) -> Tuple[str, float]:
        """Convert absolute degree to sign and degree within sign"""
        sign_index = int(degree / 30)
        degree_in_sign = degree % 30
        return self.SIGNS[sign_index], degree_in_sign

    def _parse_datetime(self, date_str: str, time_str: str, timezone: str = "UTC") -> datetime:
        """Parse date and time strings into timezone-aware datetime"""
        dt_str = f"{date_str} {time_str}"
        dt = date_parser.parse(dt_str)

        if timezone != "UTC":
            tz = pytz.timezone(timezone)
            dt = tz.localize(dt)
            dt = dt.astimezone(pytz.UTC)
        else:
            dt = pytz.UTC.localize(dt)

        return dt

    def calculate_natal_chart(
        self,
        birth_date: str,
        birth_time: str,
        latitude: float,
        longitude: float,
        timezone: str = "UTC"
    ) -> Dict:
        """
        Calculate a complete natal chart.

        Args:
            birth_date: Birth date in YYYY-MM-DD format
            birth_time: Birth time in HH:MM format
            latitude: Birth location latitude
            longitude: Birth location longitude
            timezone: Timezone string (e.g., "America/New_York")

        Returns:
            Complete natal chart with planets, houses, aspects, and elements
        """
        # Parse datetime
        dt = self._parse_datetime(birth_date, birth_time, timezone)
        jd = self._datetime_to_julian(dt)

        # Calculate planetary positions
        planets = self._calculate_planets(jd)

        # Calculate houses (Placidus system)
        houses = self._calculate_houses(jd, latitude, longitude)

        # Calculate aspects
        aspects = self._calculate_aspects(planets)

        # Calculate elemental balance
        elements = self.calculate_elemental_balance(planets)

        # Calculate modality balance
        modalities = self._calculate_modality_balance(planets)

        # Calculate Arabic Parts (Lots)
        arabic_parts = self.calculate_arabic_parts(planets, houses)

        return {
            "birthData": {
                "date": birth_date,
                "time": birth_time,
                "latitude": latitude,
                "longitude": longitude,
                "timezone": timezone,
                "julianDay": jd
            },
            "planets": planets,
            "houses": houses,
            "aspects": aspects,
            "elements": elements,
            "modalities": modalities,
            "arabicParts": arabic_parts,
            "ascendant": houses.get("ascendant"),
            "midheaven": houses.get("midheaven"),
            "calculationMethod": "Swiss Ephemeris",
            "houseSystem": "Placidus"
        }

    def _calculate_planets(self, jd: float) -> Dict:
        """Calculate positions for all planets"""
        # Re-assert ephemeris path before calculation (other modules may reset it)
        if _EPHE_DIR:
            swe.set_ephe_path(_EPHE_DIR)

        planets = {}

        for name, planet_id in self.PLANETS.items():
            try:
                # Calculate position (flags: SEFLG_SPEED for velocity)
                result, flag = swe.calc_ut(jd, planet_id, swe.FLG_SPEED)

                longitude = result[0]
                latitude = result[1]
                distance = result[2]
                lon_speed = result[3]

                sign, degree_in_sign = self._degree_to_sign(longitude)

                planets[name] = {
                    "longitude": longitude,
                    "latitude": latitude,
                    "distance": distance,
                    "speed": lon_speed,
                    "retrograde": lon_speed < 0,
                    "sign": sign,
                    "degree": degree_in_sign,
                    "element": self.ELEMENTS[sign],
                    "modality": self.MODALITIES[sign],
                    "formatted": f"{degree_in_sign:.2f}° {sign}"
                }
            except Exception as e:
                print(f"[SwissEph] ERROR calculating {name} (id={planet_id}): {e}")
                planets[name] = {"error": str(e)}

        return planets

    def _calculate_houses(self, jd: float, lat: float, lon: float) -> Dict:
        """Calculate house cusps using Placidus system"""
        try:
            # Placidus house system (P)
            cusps, ascmc = swe.houses(jd, lat, lon, b'P')

            houses = {
                "cusps": {},
                "ascendant": {
                    "longitude": ascmc[0],
                    "sign": self._degree_to_sign(ascmc[0])[0],
                    "degree": self._degree_to_sign(ascmc[0])[1]
                },
                "midheaven": {
                    "longitude": ascmc[1],
                    "sign": self._degree_to_sign(ascmc[1])[0],
                    "degree": self._degree_to_sign(ascmc[1])[1]
                }
            }

            # pyswisseph swe.houses() returns cusps as a tuple:
            #   Standard (Placidus etc.): 12 elements, 0-indexed (cusps[0]=H1 ... cusps[11]=H12)
            #   C-convention (some builds): 13 elements, 1-indexed (cusps[0] unused, cusps[1]=H1 ... cusps[12]=H12)
            #   Gauquelin sectors: 36 elements (not used here, Placidus only)
            cusps_len = len(cusps)
            if cusps_len >= 13:
                house_cusps = cusps[1:13]  # Skip unused index 0
            else:
                house_cusps = cusps[:12]   # 0-indexed, take all 12

            # Diagnostic: store tuple metadata for debugging
            houses["_cusps_debug"] = {
                "tuple_length": cusps_len,
                "slice_used": "1:13" if cusps_len >= 13 else "0:12",
                "house_cusps_count": len(house_cusps),
                "fix_version": "v2_2026-02-03"
            }

            for i, cusp in enumerate(house_cusps, 1):  # Houses 1-12
                sign, degree = self._degree_to_sign(cusp)
                houses["cusps"][f"house_{i}"] = {
                    "longitude": cusp,
                    "sign": sign,
                    "degree": degree,
                    "formatted": f"{degree:.2f}° {sign}"
                }

            return houses
        except Exception as e:
            return {"error": str(e)}

    def _calculate_aspects(self, planets: Dict) -> List[Dict]:
        """Calculate aspects between planets"""
        aspects = []
        planet_names = list(planets.keys())

        for i, p1_name in enumerate(planet_names):
            p1 = planets.get(p1_name, {})
            if "longitude" not in p1:
                continue

            for p2_name in planet_names[i + 1:]:
                p2 = planets.get(p2_name, {})
                if "longitude" not in p2:
                    continue

                # Calculate angle between planets
                angle = abs(p1["longitude"] - p2["longitude"])
                if angle > 180:
                    angle = 360 - angle

                # Check each aspect type
                for aspect_name, aspect_data in self.ASPECTS.items():
                    orb = abs(angle - aspect_data["angle"])
                    if orb <= aspect_data["orb"]:
                        aspects.append({
                            "planet1": p1_name,
                            "planet2": p2_name,
                            "aspect": aspect_name,
                            "angle": angle,
                            "orb": orb,
                            "exactness": 1 - (orb / aspect_data["orb"]),
                            "applying": self._is_applying(p1, p2, aspect_data["angle"])
                        })
                        break

        return aspects

    def _is_applying(self, p1: Dict, p2: Dict, target_angle: float) -> bool:
        """Determine if aspect is applying (getting closer) or separating"""
        current_angle = abs(p1["longitude"] - p2["longitude"])
        if current_angle > 180:
            current_angle = 360 - current_angle

        # Predict angle in 1 day based on speeds
        future_p1 = p1["longitude"] + p1["speed"]
        future_p2 = p2["longitude"] + p2["speed"]
        future_angle = abs(future_p1 - future_p2)
        if future_angle > 180:
            future_angle = 360 - future_angle

        return abs(future_angle - target_angle) < abs(current_angle - target_angle)

    def calculate_elemental_balance(self, planets: Dict) -> Dict:
        """
        Calculate elemental balance based on planetary positions.
        Uses weighted planet system for accurate elemental distribution.
        """
        elements = {"fire": 0.0, "earth": 0.0, "air": 0.0, "water": 0.0}
        total_weight = 0.0

        for planet_name, planet_data in planets.items():
            if isinstance(planet_data, dict) and "element" in planet_data:
                weight = self.PLANET_WEIGHTS.get(planet_name, 1.0)
                elements[planet_data["element"]] += weight
                total_weight += weight

        # Convert to percentages
        if total_weight > 0:
            for element in elements:
                elements[element] = round((elements[element] / total_weight) * 100, 2)

        # Determine dominant and weakest elements
        sorted_elements = sorted(elements.items(), key=lambda x: x[1], reverse=True)
        dominant = sorted_elements[0]
        weakest = sorted_elements[-1]

        return {
            "fire": elements["fire"],
            "earth": elements["earth"],
            "air": elements["air"],
            "water": elements["water"],
            "dominant": {
                "element": dominant[0],
                "percentage": dominant[1]
            },
            "weakest": {
                "element": weakest[0],
                "percentage": weakest[1]
            },
            "balance": self._assess_elemental_balance(elements)
        }

    def _calculate_modality_balance(self, planets: Dict) -> Dict:
        """Calculate modality balance (cardinal, fixed, mutable)"""
        modalities = {"cardinal": 0.0, "fixed": 0.0, "mutable": 0.0}
        total_weight = 0.0

        for planet_name, planet_data in planets.items():
            if isinstance(planet_data, dict) and "modality" in planet_data:
                weight = self.PLANET_WEIGHTS.get(planet_name, 1.0)
                modalities[planet_data["modality"]] += weight
                total_weight += weight

        if total_weight > 0:
            for modality in modalities:
                modalities[modality] = round((modalities[modality] / total_weight) * 100, 2)

        sorted_modalities = sorted(modalities.items(), key=lambda x: x[1], reverse=True)

        return {
            "cardinal": modalities["cardinal"],
            "fixed": modalities["fixed"],
            "mutable": modalities["mutable"],
            "dominant": sorted_modalities[0][0]
        }

    def _assess_elemental_balance(self, elements: Dict) -> str:
        """Assess overall elemental balance"""
        values = list(elements.values())
        max_val = max(values)
        min_val = min(values)
        spread = max_val - min_val

        if spread < 15:
            return "balanced"
        elif spread < 30:
            return "moderate"
        elif spread < 50:
            return "strong_emphasis"
        else:
            return "extreme_emphasis"

    def get_planetary_positions(self, dt: str, latitude: float, longitude: float) -> Dict:
        """Get planetary positions for a specific datetime"""
        parsed_dt = date_parser.parse(dt)
        if parsed_dt.tzinfo is None:
            parsed_dt = pytz.UTC.localize(parsed_dt)
        jd = self._datetime_to_julian(parsed_dt)
        return self._calculate_planets(jd)

    def calculate_synastry(self, chart1: Dict, chart2: Dict) -> Dict:
        """
        Calculate synastry (compatibility) between two natal charts.

        Returns aspects between the two charts and compatibility analysis.
        """
        synastry_aspects = []
        planets1 = chart1.get("planets", {})
        planets2 = chart2.get("planets", {})

        # Calculate cross-chart aspects
        for p1_name, p1_data in planets1.items():
            if not isinstance(p1_data, dict) or "longitude" not in p1_data:
                continue

            for p2_name, p2_data in planets2.items():
                if not isinstance(p2_data, dict) or "longitude" not in p2_data:
                    continue

                angle = abs(p1_data["longitude"] - p2_data["longitude"])
                if angle > 180:
                    angle = 360 - angle

                for aspect_name, aspect_data in self.ASPECTS.items():
                    orb = abs(angle - aspect_data["angle"])
                    if orb <= aspect_data["orb"]:
                        synastry_aspects.append({
                            "person1_planet": p1_name,
                            "person2_planet": p2_name,
                            "aspect": aspect_name,
                            "angle": angle,
                            "orb": orb,
                            "significance": self._aspect_significance(p1_name, p2_name, aspect_name)
                        })
                        break

        # Calculate elemental compatibility
        elem1 = chart1.get("elements", {})
        elem2 = chart2.get("elements", {})
        elemental_compatibility = self._calculate_elemental_compatibility(elem1, elem2)

        # Calculate overall compatibility score
        compatibility_score = self._calculate_compatibility_score(synastry_aspects, elemental_compatibility)

        return {
            "aspects": synastry_aspects,
            "aspectCount": len(synastry_aspects),
            "elementalCompatibility": elemental_compatibility,
            "overallScore": compatibility_score,
            "interpretation": self._interpret_synastry(synastry_aspects, elemental_compatibility)
        }

    def _aspect_significance(self, p1: str, p2: str, aspect: str) -> str:
        """Determine significance of a synastry aspect"""
        major_planets = ['sun', 'moon', 'venus', 'mars']
        harmonious = ['conjunction', 'trine', 'sextile']

        if p1 in major_planets and p2 in major_planets:
            if aspect in harmonious:
                return "very_significant_positive"
            else:
                return "very_significant_challenging"
        elif p1 in major_planets or p2 in major_planets:
            return "significant"
        else:
            return "moderate"

    def _calculate_elemental_compatibility(self, elem1: Dict, elem2: Dict) -> Dict:
        """Calculate elemental compatibility between two charts"""
        # Element compatibility matrix
        compat_matrix = {
            ('fire', 'fire'): 0.9,
            ('fire', 'air'): 0.85,
            ('fire', 'earth'): 0.6,
            ('fire', 'water'): 0.5,
            ('earth', 'earth'): 0.9,
            ('earth', 'water'): 0.85,
            ('earth', 'air'): 0.6,
            ('air', 'air'): 0.9,
            ('air', 'water'): 0.6,
            ('water', 'water'): 0.9
        }

        dom1 = elem1.get("dominant", {}).get("element", "fire")
        dom2 = elem2.get("dominant", {}).get("element", "fire")

        key = tuple(sorted([dom1, dom2]))
        base_compat = compat_matrix.get(key, 0.7)

        return {
            "score": round(base_compat * 100, 1),
            "person1_dominant": dom1,
            "person2_dominant": dom2,
            "dynamic": f"{dom1.title()} + {dom2.title()}"
        }

    def _calculate_compatibility_score(self, aspects: List, elemental: Dict) -> float:
        """Calculate overall compatibility score"""
        aspect_score = 50.0  # Base score

        for aspect in aspects:
            significance = aspect.get("significance", "moderate")
            if "positive" in significance:
                aspect_score += 5
            elif "challenging" in significance:
                aspect_score -= 2
            elif "significant" in significance:
                aspect_score += 2

        aspect_score = max(0, min(100, aspect_score))

        # Combine with elemental compatibility
        elemental_score = elemental.get("score", 70)
        final_score = (aspect_score * 0.6) + (elemental_score * 0.4)

        return round(final_score, 1)

    def _interpret_synastry(self, aspects: List, elemental: Dict) -> Dict:
        """Generate interpretation of synastry results"""
        positive_count = sum(1 for a in aspects if "positive" in a.get("significance", ""))
        challenging_count = sum(1 for a in aspects if "challenging" in a.get("significance", ""))

        if positive_count > challenging_count * 2:
            overall = "highly_harmonious"
        elif positive_count > challenging_count:
            overall = "harmonious"
        elif challenging_count > positive_count:
            overall = "growth_oriented"
        else:
            overall = "balanced"

        return {
            "overall": overall,
            "positiveAspects": positive_count,
            "challengingAspects": challenging_count,
            "elementalDynamic": elemental.get("dynamic", "Unknown")
        }

    # ========================================================================
    # VEDIC ASTROLOGY (JYOTISH) CALCULATIONS
    # ========================================================================

    def calculate_vedic_chart(
        self,
        birth_date: str,
        birth_time: str,
        latitude: float,
        longitude: float,
        timezone: str = "UTC",
        ayanamsha: str = "lahiri",
        house_system: str = "whole_sign"
    ) -> Dict:
        """
        Calculate a complete Vedic (Jyotish) natal chart using sidereal zodiac.

        Args:
            birth_date: Birth date in YYYY-MM-DD format
            birth_time: Birth time in HH:MM format
            latitude: Birth location latitude
            longitude: Birth location longitude
            timezone: Timezone string (e.g., "Asia/Kolkata")
            ayanamsha: Ayanamsha system ('lahiri', 'raman', 'krishnamurti', etc.)
            house_system: House system ('whole_sign', 'equal', 'placidus')

        Returns:
            Complete Vedic chart with grahas, rashis, nakshatras, and bhavas
        """
        # Parse datetime
        dt = self._parse_datetime(birth_date, birth_time, timezone)
        jd = self._datetime_to_julian(dt)

        # Set sidereal mode with chosen ayanamsha
        ayanamsha_id = AYANAMSHA_OPTIONS.get(ayanamsha, swe.SIDM_LAHIRI)
        swe.set_sid_mode(ayanamsha_id)

        # Get ayanamsha value for this date
        ayanamsha_value = swe.get_ayanamsa_ut(jd)

        # Calculate graha (planet) positions in sidereal zodiac
        grahas = self._calculate_vedic_grahas(jd)

        # Calculate houses (bhavas)
        bhavas = self._calculate_vedic_houses(jd, latitude, longitude, house_system)

        # Calculate Moon's nakshatra (most important in Vedic)
        moon_nakshatra = self._calculate_nakshatra(grahas.get('chandra', {}).get('longitude', 0))

        # Calculate Lagna (Ascendant) nakshatra
        lagna_longitude = bhavas.get('lagna', {}).get('longitude', 0)
        lagna_nakshatra = self._calculate_nakshatra(lagna_longitude)

        # Reset to tropical mode for subsequent Western calculations
        swe.set_sid_mode(swe.SIDM_FAGAN_BRADLEY)  # Reset

        return {
            "zodiacSystem": "sidereal",
            "ayanamsha": ayanamsha,
            "ayanamshaName": self._get_ayanamsha_name(ayanamsha),
            "ayanamshaValue": round(ayanamsha_value, 4),
            "birthData": {
                "date": birth_date,
                "time": birth_time,
                "latitude": latitude,
                "longitude": longitude,
                "timezone": timezone,
                "julianDay": jd
            },
            "grahas": grahas,
            "bhavas": bhavas,
            "lagna": {
                "longitude": lagna_longitude,
                "rashi": bhavas.get('lagna', {}).get('rashi', {}),
                "nakshatra": lagna_nakshatra
            },
            "moonNakshatra": moon_nakshatra,
            "calculationMethod": "Swiss Ephemeris (Sidereal)",
            "houseSystem": house_system
        }

    def _calculate_vedic_grahas(self, jd: float) -> Dict:
        """Calculate positions for all Vedic grahas (planets) in sidereal zodiac"""
        grahas = {}
        rahu_longitude = None

        for graha_name, graha_id in VEDIC_GRAHAS.items():
            try:
                if graha_name == 'ketu':
                    # Ketu is exactly opposite to Rahu (180°)
                    if rahu_longitude is not None:
                        ketu_longitude = (rahu_longitude + 180) % 360
                        rashi_data = self._longitude_to_rashi(ketu_longitude)
                        nakshatra_data = self._calculate_nakshatra(ketu_longitude)

                        grahas['ketu'] = {
                            "longitude": ketu_longitude,
                            "latitude": 0,
                            "speed": grahas['rahu']['speed'],  # Same speed as Rahu
                            "retrograde": True,  # Nodes always retrograde
                            "rashi": rashi_data,
                            "nakshatra": nakshatra_data,
                            "english": GRAHA_ENGLISH['ketu']
                        }
                    continue

                # Calculate position with sidereal flag
                result, flag = swe.calc_ut(jd, graha_id, swe.FLG_SIDEREAL | swe.FLG_SPEED)

                longitude = result[0]
                latitude = result[1]
                lon_speed = result[3]

                # Store Rahu longitude for Ketu calculation
                if graha_name == 'rahu':
                    rahu_longitude = longitude

                rashi_data = self._longitude_to_rashi(longitude)
                nakshatra_data = self._calculate_nakshatra(longitude)

                grahas[graha_name] = {
                    "longitude": longitude,
                    "latitude": latitude,
                    "speed": lon_speed,
                    "retrograde": lon_speed < 0 or graha_name == 'rahu',
                    "rashi": rashi_data,
                    "nakshatra": nakshatra_data,
                    "english": GRAHA_ENGLISH[graha_name]
                }

            except Exception as e:
                grahas[graha_name] = {"error": str(e)}

        return grahas

    def _longitude_to_rashi(self, longitude: float) -> Dict:
        """Convert sidereal longitude to Rashi (Vedic sign)"""
        rashi_index = int(longitude / 30) % 12
        degree_in_rashi = longitude % 30
        rashi = RASHIS[rashi_index]

        return {
            "index": rashi_index,
            "sanskrit": rashi['sanskrit'],
            "english": rashi['english'],
            "lord": rashi['lord'],
            "element": rashi['element'],
            "symbol": rashi['symbol'],
            "degree": round(degree_in_rashi, 4),
            "formatted": f"{degree_in_rashi:.2f}° {rashi['sanskrit']}"
        }

    def _calculate_nakshatra(self, longitude: float) -> Dict:
        """
        Calculate Nakshatra (lunar mansion) from sidereal longitude.
        Each nakshatra spans 13°20' (13.333...°), with 4 padas of 3°20' each.
        """
        nakshatra_span = 360 / 27  # 13.333...°
        pada_span = nakshatra_span / 4  # 3.333...°

        nakshatra_index = int(longitude / nakshatra_span) % 27
        degree_in_nakshatra = longitude % nakshatra_span
        pada = int(degree_in_nakshatra / pada_span) + 1

        nakshatra = NAKSHATRAS[nakshatra_index]

        return {
            "index": nakshatra_index,
            "name": nakshatra['name'],
            "lord": nakshatra['lord'],
            "deity": nakshatra['deity'],
            "symbol": nakshatra['symbol'],
            "quality": nakshatra['quality'],
            "pada": pada,
            "degreeInNakshatra": round(degree_in_nakshatra, 4),
            "formatted": f"{nakshatra['name']} Pada {pada}"
        }

    def _calculate_vedic_houses(self, jd: float, lat: float, lon: float, house_system: str) -> Dict:
        """Calculate Vedic houses (bhavas)"""
        try:
            # Map house system to Swiss Ephemeris code
            house_codes = {
                'whole_sign': b'W',
                'equal': b'E',
                'placidus': b'P',
                'koch': b'K'
            }
            house_code = house_codes.get(house_system, b'W')

            # Calculate houses with sidereal positions
            cusps, ascmc = swe.houses_ex(jd, lat, lon, house_code, swe.FLG_SIDEREAL)

            lagna_longitude = ascmc[0]
            lagna_rashi = self._longitude_to_rashi(lagna_longitude)

            bhavas = {
                "lagna": {
                    "longitude": lagna_longitude,
                    "rashi": lagna_rashi
                },
                "midheaven": {
                    "longitude": ascmc[1],
                    "rashi": self._longitude_to_rashi(ascmc[1])
                },
                "cusps": {}
            }

            # For Whole Sign houses, each house starts at 0° of a sign
            if house_system == 'whole_sign':
                lagna_sign_index = int(lagna_longitude / 30)
                for i in range(1, 13):
                    house_sign_index = (lagna_sign_index + i - 1) % 12
                    house_longitude = house_sign_index * 30
                    bhavas["cusps"][f"bhava_{i}"] = {
                        "longitude": house_longitude,
                        "rashi": self._longitude_to_rashi(house_longitude),
                        "number": i
                    }
            else:
                # Use calculated cusps
                for i, cusp in enumerate(cusps[1:13], 1):
                    bhavas["cusps"][f"bhava_{i}"] = {
                        "longitude": cusp,
                        "rashi": self._longitude_to_rashi(cusp),
                        "number": i
                    }

            return bhavas

        except Exception as e:
            return {"error": str(e)}

    def _get_ayanamsha_name(self, ayanamsha: str) -> str:
        """Get display name for ayanamsha"""
        names = {
            'lahiri': 'Lahiri (Chitrapaksha)',
            'raman': 'B.V. Raman',
            'krishnamurti': 'Krishnamurti (KP)',
            'fagan_bradley': 'Fagan-Bradley',
            'deluce': 'DeLuce',
            'yukteshwar': 'Sri Yukteshwar',
            'true_chitra': 'True Chitra'
        }
        return names.get(ayanamsha, ayanamsha.title())

    # ========================================================================
    # ARABIC PARTS (LOTS) CALCULATIONS
    # ========================================================================

    def _normalize_degrees(self, degrees: float) -> float:
        """Normalize degrees to 0-360 range"""
        normalized = degrees % 360
        return normalized if normalized >= 0 else normalized + 360

    def _is_day_chart(self, sun_longitude: float, asc_longitude: float) -> bool:
        """
        Determine if this is a day chart (Sun above horizon).

        Day chart: Sun is in houses 7-12 (above the ASC-DSC axis)
        Night chart: Sun is in houses 1-6 (below the ASC-DSC axis)

        Geometrically: Sun is above horizon if its longitude is between
        ASC and DSC going counter-clockwise (houses 12, 11, 10, 9, 8, 7).
        """
        dsc_longitude = self._normalize_degrees(asc_longitude + 180)

        # Normalize both to 0-360
        sun = self._normalize_degrees(sun_longitude)
        asc = self._normalize_degrees(asc_longitude)
        dsc = self._normalize_degrees(dsc_longitude)

        # Sun is above horizon if it's between DSC and ASC (going through MC)
        # This means: DSC <= Sun < ASC (with wrap-around handling)
        if asc > dsc:
            # Normal case: DSC is before ASC in the zodiac
            return dsc <= sun < asc
        else:
            # Wrap case: ASC is before DSC (e.g., ASC=350°, DSC=170°)
            return sun >= dsc or sun < asc

    def _calculate_part(self, point_a: float, point_b: float, point_c: float) -> float:
        """
        Generic Arabic Part calculation: A + B - C

        Args:
            point_a: First point in degrees (usually ASC)
            point_b: Second point in degrees
            point_c: Third point in degrees

        Returns:
            Calculated part position in degrees (0-360)
        """
        result = point_a + point_b - point_c
        return self._normalize_degrees(result)

    def _get_house_for_longitude(self, longitude: float, houses: Dict) -> int:
        """
        Determine which house a longitude falls into.

        Args:
            longitude: Ecliptic longitude (0-360)
            houses: Houses dict with cusps

        Returns:
            House number (1-12)
        """
        cusps = houses.get("cusps", {})
        normalized = self._normalize_degrees(longitude)

        # Build list of house cusps
        house_lons = []
        for i in range(1, 13):
            cusp_key = f"house_{i}"
            if cusp_key in cusps:
                house_lons.append((i, cusps[cusp_key].get("longitude", 0)))

        if not house_lons:
            return 1  # Default

        # Sort by house number
        house_lons.sort(key=lambda x: x[0])

        # Find which house the longitude falls into
        for i in range(len(house_lons)):
            current_house, current_cusp = house_lons[i]
            next_house, next_cusp = house_lons[(i + 1) % 12]

            # Handle wrap-around at 360/0 degrees
            if current_cusp > next_cusp:
                if normalized >= current_cusp or normalized < next_cusp:
                    return current_house
            else:
                if current_cusp <= normalized < next_cusp:
                    return current_house

        return 1  # Default to house 1

    def _format_part_data(self, degrees: float, formula: str, name: str, symbol: str, houses: Dict) -> Dict:
        """
        Format Arabic Part data with sign, zone, and house information.
        """
        sign, degree_in_sign = self._degree_to_sign(degrees)
        zone = int(degree_in_sign // 5) + 1  # 6 zones of 5° each
        house = self._get_house_for_longitude(degrees, houses)

        return {
            'name': name,
            'symbol': symbol,
            'longitude': degrees,
            'formula': formula,
            'sign': sign,
            'degreeInSign': degree_in_sign,
            'zone': zone,
            'house': house,
            'formatted': f"{degree_in_sign:.2f}° {sign}"
        }

    def calculate_arabic_parts(self, planets: Dict, houses: Dict) -> Dict:
        """
        Calculate essential Arabic Parts (Lots).

        Args:
            planets: Planetary positions dict
            houses: Houses dict with cusps and ascendant

        Returns:
            Dictionary of Arabic Parts with positions and interpretive data
        """
        # Extract required positions
        sun_lon = planets.get('sun', {}).get('longitude', 0)
        moon_lon = planets.get('moon', {}).get('longitude', 0)
        venus_lon = planets.get('venus', {}).get('longitude', 0)
        mars_lon = planets.get('mars', {}).get('longitude', 0)
        jupiter_lon = planets.get('jupiter', {}).get('longitude', 0)
        saturn_lon = planets.get('saturn', {}).get('longitude', 0)
        mercury_lon = planets.get('mercury', {}).get('longitude', 0)

        asc_lon = houses.get('ascendant', {}).get('longitude', 0)
        house_8_cusp = houses.get('cusps', {}).get('house_8', {}).get('longitude', 0)

        # Determine day/night chart
        is_day = self._is_day_chart(sun_lon, asc_lon)

        parts = {}

        # ═══════════════════════════════════════════════════════════════════
        # PART OF FORTUNE (Pars Fortunae) - Material happiness
        # Day: ASC + Moon - Sun | Night: ASC + Sun - Moon
        # ═══════════════════════════════════════════════════════════════════
        if is_day:
            fortune_lon = self._calculate_part(asc_lon, moon_lon, sun_lon)
            fortune_formula = "ASC + Moon - Sun (Day Chart)"
        else:
            fortune_lon = self._calculate_part(asc_lon, sun_lon, moon_lon)
            fortune_formula = "ASC + Sun - Moon (Night Chart)"

        parts['fortune'] = self._format_part_data(
            fortune_lon, fortune_formula, 'Part of Fortune', '⊕', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF SPIRIT (Pars Spiritus) - Spiritual purpose
        # Day: ASC + Sun - Moon | Night: ASC + Moon - Sun (opposite of Fortune)
        # ═══════════════════════════════════════════════════════════════════
        if is_day:
            spirit_lon = self._calculate_part(asc_lon, sun_lon, moon_lon)
            spirit_formula = "ASC + Sun - Moon (Day Chart)"
        else:
            spirit_lon = self._calculate_part(asc_lon, moon_lon, sun_lon)
            spirit_formula = "ASC + Moon - Sun (Night Chart)"

        parts['spirit'] = self._format_part_data(
            spirit_lon, spirit_formula, 'Part of Spirit', '⊙', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF EROS - Passion and desire
        # ASC + Venus - Mars
        # ═══════════════════════════════════════════════════════════════════
        eros_lon = self._calculate_part(asc_lon, venus_lon, mars_lon)
        parts['eros'] = self._format_part_data(
            eros_lon, "ASC + Venus - Mars", 'Part of Eros', '♥', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF MARRIAGE - Partnership destiny
        # ASC + Venus - Saturn (modern unified formula)
        # ═══════════════════════════════════════════════════════════════════
        marriage_lon = self._calculate_part(asc_lon, venus_lon, saturn_lon)
        parts['marriage'] = self._format_part_data(
            marriage_lon, "ASC + Venus - Saturn", 'Part of Marriage', '⚭', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF DEATH/TRANSFORMATION - Rebirth style
        # ASC + 8th House Cusp - Moon
        # ═══════════════════════════════════════════════════════════════════
        death_lon = self._calculate_part(asc_lon, house_8_cusp, moon_lon)
        parts['death'] = self._format_part_data(
            death_lon, "ASC + 8th Cusp - Moon", 'Part of Transformation', '⚸', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF CHILDREN - Creative offspring
        # ASC + Jupiter - Saturn
        # ═══════════════════════════════════════════════════════════════════
        children_lon = self._calculate_part(asc_lon, jupiter_lon, saturn_lon)
        parts['children'] = self._format_part_data(
            children_lon, "ASC + Jupiter - Saturn", 'Part of Children', '⚒', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF PASSION - Assertive desire
        # ASC + Mars - Venus (opposite of Eros)
        # ═══════════════════════════════════════════════════════════════════
        passion_lon = self._calculate_part(asc_lon, mars_lon, venus_lon)
        parts['passion'] = self._format_part_data(
            passion_lon, "ASC + Mars - Venus", 'Part of Passion', '⚡', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF NECESSITY (Moira) - Binding fate
        # ASC + Fortune - Mercury
        # ═══════════════════════════════════════════════════════════════════
        necessity_lon = self._calculate_part(asc_lon, fortune_lon, mercury_lon)
        parts['necessity'] = self._format_part_data(
            necessity_lon, "ASC + Fortune - Mercury", 'Part of Necessity', '⚛', houses
        )

        # ═══════════════════════════════════════════════════════════════════
        # PART OF COURAGE - Bravery activation
        # ASC + Fortune - Mars
        # ═══════════════════════════════════════════════════════════════════
        courage_lon = self._calculate_part(asc_lon, fortune_lon, mars_lon)
        parts['courage'] = self._format_part_data(
            courage_lon, "ASC + Fortune - Mars", 'Part of Courage', '⚔', houses
        )

        return {
            'isDayChart': is_day,
            'chartType': 'Day Chart' if is_day else 'Night Chart',
            'parts': parts
        }
