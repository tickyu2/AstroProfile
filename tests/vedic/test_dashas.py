"""
Test Suite: Vimshottari Dasha Calculations

Tests Mahadasha periods, Antardasha sub-periods, and dasha sequence.
"""

import pytest
from datetime import datetime, timedelta


class TestDashaYears:
    """Test Vimshottari Dasha year allocations."""

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

    @pytest.mark.parametrize("planet,years", list(DASHA_YEARS.items()))
    def test_dasha_duration(self, mock_dasha_calculator, planet, years):
        """Test that each planet has correct dasha duration."""
        result = mock_dasha_calculator.get_dasha_duration(planet)
        assert result == years, f"{planet} dasha should be {years} years"

    def test_total_cycle_120_years(self):
        """Test that complete Vimshottari cycle is 120 years."""
        total = sum(self.DASHA_YEARS.values())
        assert total == 120, f"Total cycle should be 120 years, got {total}"


class TestDashaSequence:
    """Test Vimshottari Dasha sequence."""

    DASHA_SEQUENCE = [
        "Ketu", "Venus", "Sun", "Moon", "Mars",
        "Rahu", "Jupiter", "Saturn", "Mercury"
    ]

    def test_sequence_length(self):
        """Test that sequence has exactly 9 planets."""
        assert len(self.DASHA_SEQUENCE) == 9

    def test_sequence_order(self, mock_dasha_calculator):
        """Test that dasha sequence follows correct order."""
        sequence = mock_dasha_calculator.get_dasha_sequence("Ketu")
        assert sequence == self.DASHA_SEQUENCE

    def test_sequence_from_venus(self, mock_dasha_calculator):
        """Test sequence starting from Venus."""
        sequence = mock_dasha_calculator.get_dasha_sequence("Venus")
        expected = ["Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu"]
        assert sequence == expected

    def test_sequence_from_saturn(self, mock_dasha_calculator):
        """Test sequence starting from Saturn."""
        sequence = mock_dasha_calculator.get_dasha_sequence("Saturn")
        expected = ["Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter"]
        assert sequence == expected


class TestNakshatraToMahadasha:
    """Test determining starting Mahadasha from birth nakshatra."""

    @pytest.mark.parametrize("case_id,expected_planet", [
        ("ketu_dasha_start", "Ketu"),
        ("venus_dasha_rohini", "Moon"),
        ("sun_dasha_krittika", "Sun"),
        ("mars_dasha_mrigashira", "Mars"),
        ("rahu_dasha_ardra", "Rahu"),
        ("jupiter_dasha_punarvasu", "Jupiter"),
        ("saturn_dasha_pushya", "Saturn"),
        ("mercury_dasha_ashlesha", "Mercury"),
        ("venus_dasha_bharani", "Venus"),
    ])
    def test_nakshatra_lord_determines_dasha(self, dasha_cases, mock_dasha_calculator, case_id, expected_planet):
        """Test that nakshatra lord determines starting Mahadasha."""
        case = next(c for c in dasha_cases if c["id"] == case_id)
        nakshatra_lord = mock_dasha_calculator.get_nakshatra_lord(case["moonNakshatra"])
        assert nakshatra_lord == expected_planet


class TestDashaDurations:
    """Test Mahadasha duration calculations."""

    @pytest.mark.parametrize("case_id", [
        "ketu_dasha_start",
        "venus_dasha_rohini",
        "sun_dasha_krittika",
        "rahu_dasha_ardra",
        "saturn_dasha_pushya",
    ])
    def test_dasha_duration_matches(self, dasha_cases, mock_dasha_calculator, case_id):
        """Test that dasha duration matches expected years."""
        case = next(c for c in dasha_cases if c["id"] == case_id)
        planet = case["expectedMahadasha"]
        expected_years = mock_dasha_calculator.get_dasha_duration(planet)
        assert case["dashaDuration"] == expected_years


class TestFullDashaSequence:
    """Test complete 120-year dasha sequence."""

    def test_full_sequence_from_magha(self, dasha_cases):
        """Test complete dasha sequence starting from Magha (Ketu)."""
        case = next(c for c in dasha_cases if c["id"] == "full_dasha_sequence_magha")

        expected_sequence = case["expectedSequence"]
        total_years = sum(d["years"] for d in expected_sequence)

        assert total_years == 120, f"Total should be 120 years, got {total_years}"
        assert len(expected_sequence) == 9, "Should have 9 Mahadashas"

    def test_sequence_planets_correct(self, dasha_cases):
        """Test that sequence contains all 9 planets in order."""
        case = next(c for c in dasha_cases if c["id"] == "full_dasha_sequence_magha")

        expected_order = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        actual_order = [d["planet"] for d in case["expectedSequence"]]

        assert actual_order == expected_order


class TestAntardashaCalculation:
    """Test Antardasha (sub-period) calculations."""

    def test_antardasha_within_saturn(self, dasha_cases):
        """Test Antardasha periods within Saturn Mahadasha."""
        case = next(c for c in dasha_cases if c["id"] == "antardasha_within_saturn")

        antardashas = case["expectedAntardashas"]
        assert len(antardashas) == 9, "Should have 9 Antardashas within any Mahadasha"

        # First Antardasha should be same planet as Mahadasha
        assert antardashas[0]["planet"] == "Saturn"

    def test_antardasha_sequence(self, dasha_cases):
        """Test that Antardashas follow correct sequence starting from Mahadasha lord."""
        case = next(c for c in dasha_cases if c["id"] == "antardasha_within_saturn")

        expected_sequence = ["Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter"]
        actual_sequence = [a["planet"] for a in case["expectedAntardashas"]]

        assert actual_sequence == expected_sequence


class TestDashaBalance:
    """Test dasha balance calculation for mid-nakshatra births."""

    def test_partial_first_dasha(self, dasha_cases):
        """Test that birth mid-nakshatra gives partial first dasha."""
        case = next(c for c in dasha_cases if c["id"] == "partial_dasha_birth")

        # If Moon is at 7.5° in 13.33° nakshatra, balance is (13.33 - 7.5) / 13.33 = 0.4375
        assert case["balanceRatio"] == pytest.approx(0.4375, rel=0.01)

        # Moon dasha is 10 years, 43.75% balance = 4.375 years remaining
        assert case["expectedFirstDashaBalance"] == pytest.approx(4.375, rel=0.01)


class TestPratyantardasha:
    """Test Pratyantardasha (sub-sub-period) calculations."""

    def test_pratyantardasha_count(self, dasha_cases):
        """Test that there are 9 Pratyantardashas within each Antardasha."""
        case = next(c for c in dasha_cases if c["id"] == "pratyantardasha_detail")

        pratyantardashas = case["expectedPratyantardashas"]
        assert len(pratyantardashas) == 9

    def test_pratyantardasha_sequence(self, dasha_cases):
        """Test Pratyantardasha sequence within Saturn-Mercury Antardasha."""
        case = next(c for c in dasha_cases if c["id"] == "pratyantardasha_detail")

        # Pratyantardasha starts with Antardasha lord (Mercury)
        first_pratyantardasha = case["expectedPratyantardashas"][0]["planet"]
        assert first_pratyantardasha == "Mercury"


class TestSpecialNakshatras:
    """Test dasha calculation for nakshatras at sign boundaries."""

    @pytest.mark.parametrize("case_id,nakshatra,lord", [
        ("ketu_mula_start", "Mula", "Ketu"),
        ("venus_purva_phalguni", "Purva Phalguni", "Venus"),
    ])
    def test_nakshatra_lord_mapping(self, dasha_cases, mock_dasha_calculator, case_id, nakshatra, lord):
        """Test nakshatra-to-lord mapping for various nakshatras."""
        result = mock_dasha_calculator.get_nakshatra_lord(nakshatra)
        assert result == lord
