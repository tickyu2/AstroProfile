"""
Test Suite: Graha Position Calculations

Tests planetary sign placement, nakshatra, and retrograde status.
"""

import pytest


class TestGrahaSignPlacement:
    """Test Graha sign placement calculations."""

    @pytest.mark.parametrize("case_id,expected_sign", [
        ("sun_aries_exalted", "Aries"),
        ("moon_taurus_exalted", "Taurus"),
        ("mars_capricorn_exalted", "Capricorn"),
        ("mercury_virgo_exalted", "Virgo"),
        ("jupiter_cancer_exalted", "Cancer"),
        ("venus_pisces_exalted", "Pisces"),
        ("saturn_libra_exalted", "Libra"),
    ])
    def test_graha_exaltation_signs(self, graha_cases, mock_vedic_calculator, case_id, expected_sign):
        """Test that grahas in exaltation are in correct signs."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        result = mock_vedic_calculator.degree_to_sign(case["degree"])
        assert result == expected_sign

    @pytest.mark.parametrize("case_id,expected_sign", [
        ("sun_libra_debilitated", "Libra"),
        ("moon_scorpio_debilitated", "Scorpio"),
        ("mars_cancer_debilitated", "Cancer"),
        ("jupiter_capricorn_debilitated", "Capricorn"),
        ("venus_virgo_debilitated", "Virgo"),
        ("saturn_aries_debilitated", "Aries"),
    ])
    def test_graha_debilitation_signs(self, graha_cases, mock_vedic_calculator, case_id, expected_sign):
        """Test that grahas in debilitation are in correct signs."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        result = mock_vedic_calculator.degree_to_sign(case["degree"])
        assert result == expected_sign

    @pytest.mark.parametrize("case_id,expected_sign", [
        ("sun_leo_own", "Leo"),
        ("moon_cancer_own", "Cancer"),
        ("mars_aries_own", "Aries"),
        ("mars_scorpio_own", "Scorpio"),
        ("jupiter_sagittarius_own", "Sagittarius"),
        ("venus_taurus_own", "Taurus"),
        ("saturn_aquarius_own", "Aquarius"),
    ])
    def test_graha_own_signs(self, graha_cases, mock_vedic_calculator, case_id, expected_sign):
        """Test that grahas in own sign are in correct signs."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        result = mock_vedic_calculator.degree_to_sign(case["degree"])
        assert result == expected_sign


class TestGrahaNakshatraPlacement:
    """Test Graha nakshatra placement calculations."""

    def test_sun_in_ashwini(self, graha_cases, mock_vedic_calculator):
        """Test Sun in Ashwini nakshatra."""
        case = next(c for c in graha_cases if c["id"] == "sun_aries_exalted")
        result = mock_vedic_calculator.degree_to_nakshatra(case["degree"])
        assert result["nakshatra"] == case["expectedNakshatra"]

    def test_jupiter_in_pushya(self, graha_cases, mock_vedic_calculator):
        """Test Jupiter in Pushya nakshatra (near exaltation)."""
        case = next(c for c in graha_cases if c["id"] == "jupiter_cancer_exalted")
        result = mock_vedic_calculator.degree_to_nakshatra(case["degree"])
        assert result["nakshatra"] == case["expectedNakshatra"]

    @pytest.mark.parametrize("case_id", [
        "sun_aries_exalted",
        "moon_taurus_exalted",
        "mars_capricorn_exalted",
        "venus_pisces_exalted",
        "saturn_libra_exalted",
    ])
    def test_graha_nakshatra_calculation(self, graha_cases, mock_vedic_calculator, case_id):
        """Test nakshatra calculation for various grahas."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        result = mock_vedic_calculator.degree_to_nakshatra(case["degree"])
        assert result["nakshatra"] == case["expectedNakshatra"]


class TestGrahaHousePlacement:
    """Test Graha house placement (from Aries = 1)."""

    SIGN_TO_HOUSE = {
        "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
        "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
        "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
    }

    @pytest.mark.parametrize("case_id,expected_house", [
        ("sun_aries_exalted", 1),
        ("moon_taurus_exalted", 2),
        ("jupiter_cancer_exalted", 4),
        ("sun_leo_own", 5),
        ("venus_virgo_debilitated", 6),
        ("saturn_libra_exalted", 7),
        ("mars_scorpio_own", 8),
        ("jupiter_sagittarius_own", 9),
        ("mars_capricorn_exalted", 10),
        ("saturn_aquarius_own", 11),
        ("venus_pisces_exalted", 12),
    ])
    def test_graha_house_from_aries(self, graha_cases, case_id, expected_house):
        """Test house placement using Aries as first house."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        assert case["expectedHouse"] == expected_house


class TestShadowPlanets:
    """Test Rahu and Ketu (shadow planets) calculations."""

    def test_rahu_always_retrograde(self, graha_cases):
        """Test that Rahu is always retrograde."""
        case = next(c for c in graha_cases if c["id"] == "rahu_gemini")
        assert case.get("retrograde", False) is True

    def test_ketu_always_retrograde(self, graha_cases):
        """Test that Ketu is always retrograde."""
        case = next(c for c in graha_cases if c["id"] == "ketu_sagittarius")
        assert case.get("retrograde", False) is True

    def test_rahu_ketu_opposite(self, graha_cases, mock_vedic_calculator):
        """Test that Rahu and Ketu are always 180 degrees apart."""
        rahu = next(c for c in graha_cases if c["id"] == "rahu_gemini")
        ketu = next(c for c in graha_cases if c["id"] == "ketu_sagittarius")

        degree_diff = abs(rahu["degree"] - ketu["degree"])
        assert abs(degree_diff - 180) < 1, "Rahu and Ketu should be 180 degrees apart"


class TestGrahaPada:
    """Test Graha pada (quarter within nakshatra) calculations."""

    @pytest.mark.parametrize("case_id", [
        "sun_aries_exalted",
        "moon_taurus_exalted",
        "mars_capricorn_exalted",
        "jupiter_cancer_exalted",
        "venus_pisces_exalted",
        "saturn_libra_exalted",
    ])
    def test_graha_pada_in_range(self, graha_cases, case_id):
        """Test that all pada values are in valid range (1-4)."""
        case = next(c for c in graha_cases if c["id"] == case_id)
        assert 1 <= case["expectedPada"] <= 4, f"Pada must be 1-4, got {case['expectedPada']}"


class TestNineGrahaSet:
    """Test that all 9 traditional grahas are represented."""

    NINE_GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]

    def test_all_grahas_present(self, graha_cases):
        """Test that test cases cover all 9 grahas."""
        grahas_in_cases = set(c["graha"] for c in graha_cases)
        for graha in self.NINE_GRAHAS:
            assert graha in grahas_in_cases, f"Missing test cases for {graha}"

    def test_graha_count(self):
        """Test that there are exactly 9 traditional grahas."""
        assert len(self.NINE_GRAHAS) == 9
