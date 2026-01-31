"""
Test Suite: Lagna (Ascendant) Calculations

Tests Lagna sign determination, degree positioning, and nakshatra placement.
"""

import pytest


class TestLagnaSignCalculation:
    """Test Lagna sign determination from ecliptic degree."""

    def test_lagna_aries(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Aries (0-30 degrees)."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_aries_early")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_sign(degree)
        assert result == case["expectedSign"]

    def test_lagna_taurus(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Taurus (30-60 degrees)."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_taurus_mid")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_sign(degree)
        assert result == case["expectedSign"]

    def test_lagna_leo(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Leo (120-150 degrees)."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_leo")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_sign(degree)
        assert result == case["expectedSign"]

    def test_lagna_scorpio(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Scorpio (210-240 degrees)."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_scorpio")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_sign(degree)
        assert result == case["expectedSign"]

    def test_lagna_pisces(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Pisces (330-360 degrees)."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_pisces_late")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_sign(degree)
        assert result == case["expectedSign"]


class TestLagnaNakshatraCalculation:
    """Test Lagna nakshatra determination."""

    def test_lagna_nakshatra_ashwini(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Ashwini nakshatra."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_aries_early")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_nakshatra(degree)
        assert result["nakshatra"] == case["expectedNakshatra"]
        assert result["pada"] == case["expectedPada"]

    def test_lagna_nakshatra_rohini(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Rohini nakshatra."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_taurus_mid")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_nakshatra(degree)
        assert result["nakshatra"] == case["expectedNakshatra"]

    def test_lagna_nakshatra_magha(self, lagna_cases, mock_vedic_calculator):
        """Test Lagna in Magha nakshatra."""
        case = next(c for c in lagna_cases if c["id"] == "lagna_leo")
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_nakshatra(degree)
        assert result["nakshatra"] == case["expectedNakshatra"]


class TestLagnaPadaCalculation:
    """Test Lagna pada (quarter) determination."""

    @pytest.mark.parametrize("case_id,expected_pada", [
        ("lagna_aries_early", 2),
        ("lagna_taurus_mid", 3),
        ("lagna_leo", 1),
        ("lagna_scorpio", 4),
    ])
    def test_lagna_pada_values(self, lagna_cases, mock_vedic_calculator, case_id, expected_pada):
        """Test pada calculation for various Lagna positions."""
        case = next(c for c in lagna_cases if c["id"] == case_id)
        degree = case["ascendantDegree"]

        result = mock_vedic_calculator.degree_to_nakshatra(degree)
        assert result["pada"] == expected_pada


class TestLagnaLord:
    """Test Lagna lord (sign ruler) determination."""

    SIGN_LORDS = {
        "Aries": "Mars",
        "Taurus": "Venus",
        "Gemini": "Mercury",
        "Cancer": "Moon",
        "Leo": "Sun",
        "Virgo": "Mercury",
        "Libra": "Venus",
        "Scorpio": "Mars",
        "Sagittarius": "Jupiter",
        "Capricorn": "Saturn",
        "Aquarius": "Saturn",
        "Pisces": "Jupiter"
    }

    def test_lagna_lord_aries(self, lagna_cases):
        """Test Lagna lord for Aries is Mars."""
        case = next(c for c in lagna_cases if c["expectedSign"] == "Aries")
        expected_lord = self.SIGN_LORDS[case["expectedSign"]]
        assert case["expectedLord"] == expected_lord

    def test_lagna_lord_leo(self, lagna_cases):
        """Test Lagna lord for Leo is Sun."""
        case = next(c for c in lagna_cases if c["expectedSign"] == "Leo")
        expected_lord = self.SIGN_LORDS[case["expectedSign"]]
        assert case["expectedLord"] == expected_lord

    @pytest.mark.parametrize("sign,expected_lord", list(SIGN_LORDS.items()))
    def test_all_lagna_lords(self, sign, expected_lord):
        """Test all sign-lord mappings."""
        assert self.SIGN_LORDS[sign] == expected_lord
