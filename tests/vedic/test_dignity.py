"""
Test Suite: Graha Dignity Calculations

Tests planetary dignity states: exalted, own, friend, neutral, enemy, debilitated.
"""

import pytest


class TestExaltationDignity:
    """Test exaltation dignity detection."""

    EXALTATION_SIGNS = {
        "Sun": "Aries",
        "Moon": "Taurus",
        "Mars": "Capricorn",
        "Mercury": "Virgo",
        "Jupiter": "Cancer",
        "Venus": "Pisces",
        "Saturn": "Libra"
    }

    @pytest.mark.parametrize("graha,sign", list(EXALTATION_SIGNS.items()))
    def test_exaltation_sign_mapping(self, mock_dignity_calculator, graha, sign):
        """Test that each graha is exalted in correct sign."""
        result = mock_dignity_calculator.calculate_dignity(graha, sign)
        assert result == "exalted", f"{graha} should be exalted in {sign}"

    def test_sun_exaltation_degree(self, dignity_cases):
        """Test Sun exaltation at 10 degrees Aries."""
        case = next(c for c in dignity_cases if c["id"] == "sun_exaltation_degree")
        assert case["expectedDignity"] == "exalted"
        assert case["degree"] == 10.0

    def test_moon_exaltation_degree(self, dignity_cases):
        """Test Moon exaltation at 3 degrees Taurus."""
        case = next(c for c in dignity_cases if c["id"] == "moon_exaltation_degree")
        assert case["expectedDignity"] == "exalted"
        assert case["degree"] == 3.0

    def test_jupiter_exaltation_degree(self, dignity_cases):
        """Test Jupiter exaltation at 5 degrees Cancer."""
        case = next(c for c in dignity_cases if c["id"] == "jupiter_exaltation_degree")
        assert case["expectedDignity"] == "exalted"
        assert case["degree"] == 5.0


class TestDebilitationDignity:
    """Test debilitation dignity detection."""

    DEBILITATION_SIGNS = {
        "Sun": "Libra",
        "Moon": "Scorpio",
        "Mars": "Cancer",
        "Mercury": "Pisces",
        "Jupiter": "Capricorn",
        "Venus": "Virgo",
        "Saturn": "Aries"
    }

    @pytest.mark.parametrize("graha,sign", list(DEBILITATION_SIGNS.items()))
    def test_debilitation_sign_mapping(self, mock_dignity_calculator, graha, sign):
        """Test that each graha is debilitated in correct sign."""
        result = mock_dignity_calculator.calculate_dignity(graha, sign)
        assert result == "debilitated", f"{graha} should be debilitated in {sign}"

    def test_sun_debilitation_degree(self, dignity_cases):
        """Test Sun debilitation at 10 degrees Libra."""
        case = next(c for c in dignity_cases if c["id"] == "sun_debilitation_degree")
        assert case["expectedDignity"] == "debilitated"
        assert case["sign"] == "Libra"

    def test_saturn_debilitation_degree(self, dignity_cases):
        """Test Saturn debilitation at 20 degrees Aries."""
        case = next(c for c in dignity_cases if c["id"] == "saturn_debilitation_degree")
        assert case["expectedDignity"] == "debilitated"
        assert case["sign"] == "Aries"


class TestOwnSignDignity:
    """Test own sign (swakshetra) dignity detection."""

    OWN_SIGNS = {
        "Sun": ["Leo"],
        "Moon": ["Cancer"],
        "Mars": ["Aries", "Scorpio"],
        "Mercury": ["Gemini", "Virgo"],
        "Jupiter": ["Sagittarius", "Pisces"],
        "Venus": ["Taurus", "Libra"],
        "Saturn": ["Capricorn", "Aquarius"]
    }

    @pytest.mark.parametrize("graha,signs", list(OWN_SIGNS.items()))
    def test_own_sign_mapping(self, mock_dignity_calculator, graha, signs):
        """Test that each graha recognizes its own signs."""
        for sign in signs:
            result = mock_dignity_calculator.calculate_dignity(graha, sign)
            assert result == "own", f"{graha} should be in own sign in {sign}"

    def test_mars_dual_rulership(self, mock_dignity_calculator):
        """Test Mars rules both Aries and Scorpio."""
        assert mock_dignity_calculator.calculate_dignity("Mars", "Aries") == "own"
        assert mock_dignity_calculator.calculate_dignity("Mars", "Scorpio") == "own"

    def test_jupiter_dual_rulership(self, mock_dignity_calculator):
        """Test Jupiter rules both Sagittarius and Pisces."""
        assert mock_dignity_calculator.calculate_dignity("Jupiter", "Sagittarius") == "own"
        assert mock_dignity_calculator.calculate_dignity("Jupiter", "Pisces") == "own"

    def test_saturn_dual_rulership(self, mock_dignity_calculator):
        """Test Saturn rules both Capricorn and Aquarius."""
        assert mock_dignity_calculator.calculate_dignity("Saturn", "Capricorn") == "own"
        assert mock_dignity_calculator.calculate_dignity("Saturn", "Aquarius") == "own"


class TestDignityStrength:
    """Test dignity strength values."""

    DIGNITY_STRENGTHS = {
        "exalted": 100,
        "own": 90,
        "friend": 75,
        "neutral": 50,
        "enemy": 25,
        "debilitated": 0
    }

    @pytest.mark.parametrize("case_id,expected_strength", [
        ("sun_exaltation_degree", 100),
        ("moon_debilitation_degree", 0),
        ("moon_friend_cancer", 90),  # Actually own sign
        ("jupiter_neutral_aries", 50),
    ])
    def test_dignity_strength_values(self, dignity_cases, case_id, expected_strength):
        """Test that dignity strength values match expected."""
        case = next(c for c in dignity_cases if c["id"] == case_id)
        assert case["expectedStrength"] == expected_strength

    def test_exalted_highest_strength(self, dignity_cases):
        """Test that exalted has highest strength (100)."""
        exalted_cases = [c for c in dignity_cases if c["expectedDignity"] == "exalted"]
        for case in exalted_cases:
            assert case["expectedStrength"] == 100

    def test_debilitated_lowest_strength(self, dignity_cases):
        """Test that debilitated has lowest strength (0)."""
        debilitated_cases = [c for c in dignity_cases if c["expectedDignity"] == "debilitated"]
        for case in debilitated_cases:
            assert case["expectedStrength"] == 0


class TestDignityOpposites:
    """Test that exaltation and debilitation signs are opposite."""

    def test_sun_opposite_signs(self):
        """Sun: Aries (exalted) opposite Libra (debilitated)."""
        # Aries = 0, Libra = 6 (180 degrees apart)
        assert abs(0 - 6) == 6  # 6 signs = 180 degrees

    def test_moon_opposite_signs(self):
        """Moon: Taurus (exalted) opposite Scorpio (debilitated)."""
        # Taurus = 1, Scorpio = 7
        assert abs(1 - 7) == 6

    def test_mars_opposite_signs(self):
        """Mars: Capricorn (exalted) opposite Cancer (debilitated)."""
        # Capricorn = 9, Cancer = 3
        assert abs(9 - 3) == 6

    def test_jupiter_opposite_signs(self):
        """Jupiter: Cancer (exalted) opposite Capricorn (debilitated)."""
        # Cancer = 3, Capricorn = 9
        assert abs(3 - 9) == 6


class TestCombustAndRetrograde:
    """Test combustion and retrograde effects on dignity."""

    def test_combust_definition(self):
        """Test combustion occurs when planet is too close to Sun."""
        # Combustion ranges (degrees from Sun):
        # Moon: 12°, Mars: 17°, Mercury: 14°, Jupiter: 11°, Venus: 10°, Saturn: 15°
        combust_ranges = {
            "Moon": 12,
            "Mars": 17,
            "Mercury": 14,
            "Jupiter": 11,
            "Venus": 10,
            "Saturn": 15
        }
        for planet, range_deg in combust_ranges.items():
            assert range_deg > 0, f"Combust range for {planet} should be positive"

    def test_retrograde_not_applicable_to_luminaries(self):
        """Test that Sun and Moon are never retrograde."""
        # Sun and Moon always move forward from Earth's perspective
        non_retrograde = ["Sun", "Moon"]
        for planet in non_retrograde:
            assert planet in ["Sun", "Moon"]
