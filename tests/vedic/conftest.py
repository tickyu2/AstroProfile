"""
Vedic Test Suite - Pytest Configuration

Provides fixtures and utilities for all Vedic astrology tests.
"""

import json
import pytest
from pathlib import Path

# =============================================================================
# VECTOR LOADING FIXTURES
# =============================================================================

VECTORS_DIR = Path(__file__).parent / "vectors"


def load_vectors(filename: str) -> list:
    """Load test vectors from JSON file."""
    filepath = VECTORS_DIR / filename
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="session")
def lagna_cases():
    """Load Lagna calculation test cases."""
    return load_vectors("lagna_cases.json")


@pytest.fixture(scope="session")
def nakshatra_cases():
    """Load Nakshatra calculation test cases."""
    return load_vectors("nakshatra_cases.json")


@pytest.fixture(scope="session")
def graha_cases():
    """Load Graha position test cases."""
    return load_vectors("graha_cases.json")


@pytest.fixture(scope="session")
def dignity_cases():
    """Load dignity calculation test cases."""
    return load_vectors("dignity_cases.json")


@pytest.fixture(scope="session")
def dasha_cases():
    """Load Dasha timeline test cases."""
    return load_vectors("dasha_cases.json")


@pytest.fixture(scope="session")
def compatibility_cases():
    """Load compatibility test cases."""
    return load_vectors("compatibility_cases.json")


@pytest.fixture(scope="session")
def archetype_cases():
    """Load archetype classification test cases."""
    return load_vectors("archetype_cases.json")


# =============================================================================
# MOCK CALCULATOR FIXTURES (for unit testing without ephemeris)
# =============================================================================

@pytest.fixture
def mock_vedic_calculator():
    """
    Provides a mock calculator for testing without Swiss Ephemeris.
    Replace with actual calculator import when available.
    """
    class MockVedicCalculator:
        SIGNS = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]

        NAKSHATRAS = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
            "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
            "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
            "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
            "Uttara Bhadrapada", "Revati"
        ]

        NAKSHATRA_LORDS = [
            "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
            "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun",
            "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
            "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
            "Jupiter", "Saturn", "Mercury"
        ]

        def degree_to_sign(self, degree: float) -> str:
            """Convert ecliptic degree to zodiac sign."""
            sign_index = int(degree / 30) % 12
            return self.SIGNS[sign_index]

        def degree_to_nakshatra(self, degree: float) -> dict:
            """Convert ecliptic degree to nakshatra with pada."""
            nakshatra_span = 360 / 27  # 13.333...
            nakshatra_index = int(degree / nakshatra_span) % 27
            degree_in_nakshatra = degree % nakshatra_span
            pada = int(degree_in_nakshatra / (nakshatra_span / 4)) + 1

            return {
                "nakshatra": self.NAKSHATRAS[nakshatra_index],
                "pada": min(pada, 4),
                "lord": self.NAKSHATRA_LORDS[nakshatra_index]
            }

        def sign_degree_to_ecliptic(self, sign: str, degree: float) -> float:
            """Convert sign + degree to ecliptic degree."""
            sign_index = self.SIGNS.index(sign)
            return (sign_index * 30) + degree

    return MockVedicCalculator()


@pytest.fixture
def mock_dignity_calculator():
    """Provides dignity calculation logic."""

    EXALTATION = {
        "Sun": ("Aries", 10),
        "Moon": ("Taurus", 3),
        "Mars": ("Capricorn", 28),
        "Mercury": ("Virgo", 15),
        "Jupiter": ("Cancer", 5),
        "Venus": ("Pisces", 27),
        "Saturn": ("Libra", 20)
    }

    DEBILITATION = {
        "Sun": ("Libra", 10),
        "Moon": ("Scorpio", 3),
        "Mars": ("Cancer", 28),
        "Mercury": ("Pisces", 15),
        "Jupiter": ("Capricorn", 5),
        "Venus": ("Virgo", 27),
        "Saturn": ("Aries", 20)
    }

    OWN_SIGNS = {
        "Sun": ["Leo"],
        "Moon": ["Cancer"],
        "Mars": ["Aries", "Scorpio"],
        "Mercury": ["Gemini", "Virgo"],
        "Jupiter": ["Sagittarius", "Pisces"],
        "Venus": ["Taurus", "Libra"],
        "Saturn": ["Capricorn", "Aquarius"]
    }

    class DignityCalculator:
        def calculate_dignity(self, graha: str, sign: str, degree: float = None) -> str:
            # Check exaltation
            if graha in EXALTATION:
                ex_sign, ex_deg = EXALTATION[graha]
                if sign == ex_sign:
                    return "exalted"

            # Check debilitation
            if graha in DEBILITATION:
                deb_sign, deb_deg = DEBILITATION[graha]
                if sign == deb_sign:
                    return "debilitated"

            # Check own sign
            if graha in OWN_SIGNS and sign in OWN_SIGNS[graha]:
                return "own"

            # Default to neutral (full implementation would check friend/enemy)
            return "neutral"

    return DignityCalculator()


@pytest.fixture
def mock_dasha_calculator():
    """Provides Vimshottari Dasha calculation logic."""

    DASHA_YEARS = {
        "Ketu": 7,
        "Venus": 20,
        "Sun": 6,
        "Moon": 10,
        "Mars": 7,
        "Rahu": 18,
        "Jupiter": 16,
        "Saturn": 19,
        "Mercury": 17
    }

    DASHA_SEQUENCE = [
        "Ketu", "Venus", "Sun", "Moon", "Mars",
        "Rahu", "Jupiter", "Saturn", "Mercury"
    ]

    NAKSHATRA_LORDS = {
        "Ashwini": "Ketu", "Magha": "Ketu", "Mula": "Ketu",
        "Bharani": "Venus", "Purva Phalguni": "Venus", "Purva Ashadha": "Venus",
        "Krittika": "Sun", "Uttara Phalguni": "Sun", "Uttara Ashadha": "Sun",
        "Rohini": "Moon", "Hasta": "Moon", "Shravana": "Moon",
        "Mrigashira": "Mars", "Chitra": "Mars", "Dhanishta": "Mars",
        "Ardra": "Rahu", "Swati": "Rahu", "Shatabhisha": "Rahu",
        "Punarvasu": "Jupiter", "Vishakha": "Jupiter", "Purva Bhadrapada": "Jupiter",
        "Pushya": "Saturn", "Anuradha": "Saturn", "Uttara Bhadrapada": "Saturn",
        "Ashlesha": "Mercury", "Jyeshtha": "Mercury", "Revati": "Mercury"
    }

    class DashaCalculator:
        def get_nakshatra_lord(self, nakshatra: str) -> str:
            return NAKSHATRA_LORDS.get(nakshatra)

        def get_dasha_duration(self, planet: str) -> int:
            return DASHA_YEARS.get(planet, 0)

        def get_dasha_sequence(self, starting_planet: str) -> list:
            start_idx = DASHA_SEQUENCE.index(starting_planet)
            return DASHA_SEQUENCE[start_idx:] + DASHA_SEQUENCE[:start_idx]

    return DashaCalculator()


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def approx_equal(a: float, b: float, tolerance: float = 0.01) -> bool:
    """Check if two floats are approximately equal."""
    return abs(a - b) <= tolerance


def assert_score_in_range(score: float, expected: float, tolerance: int = 5):
    """Assert a score is within tolerance of expected value."""
    assert abs(score - expected) <= tolerance, \
        f"Score {score} not within {tolerance} of expected {expected}"
