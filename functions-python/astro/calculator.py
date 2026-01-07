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

# Initialize Swiss Ephemeris path (uses default ephemeris files)
swe.set_ephe_path(None)


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
        'chiron': swe.CHIRON
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
            "ascendant": houses.get("ascendant"),
            "midheaven": houses.get("midheaven"),
            "calculationMethod": "Swiss Ephemeris",
            "houseSystem": "Placidus"
        }

    def _calculate_planets(self, jd: float) -> Dict:
        """Calculate positions for all planets"""
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

            for i, cusp in enumerate(cusps[1:13], 1):  # Houses 1-12
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
