"""
Test Suite: Nakshatra Calculations

Tests Moon nakshatra (Janma Nakshatra) determination, pada, lord, and deity.
"""

import pytest


class TestMoonNakshatraCalculation:
    """Test Moon nakshatra determination from degree within sign."""

    def test_moon_ashwini(self, nakshatra_cases, mock_vedic_calculator):
        """Test Moon in Ashwini nakshatra (0-13.33 Aries)."""
        case = next(c for c in nakshatra_cases if c["id"] == "moon_ashwini")

        # Convert sign degree to ecliptic
        ecliptic_degree = mock_vedic_calculator.sign_degree_to_ecliptic(
            case["moonSign"], case["moonDegree"]
        )

        result = mock_vedic_calculator.degree_to_nakshatra(ecliptic_degree)
        assert result["nakshatra"] == case["expectedNakshatra"]

    def test_moon_rohini(self, nakshatra_cases, mock_vedic_calculator):
        """Test Moon in Rohini nakshatra (10-23.33 Taurus)."""
        case = next(c for c in nakshatra_cases if c["id"] == "moon_rohini")

        ecliptic_degree = mock_vedic_calculator.sign_degree_to_ecliptic(
            case["moonSign"], case["moonDegree"]
        )

        result = mock_vedic_calculator.degree_to_nakshatra(ecliptic_degree)
        assert result["nakshatra"] == case["expectedNakshatra"]

    def test_moon_magha(self, nakshatra_cases, mock_vedic_calculator):
        """Test Moon in Magha nakshatra (0-13.33 Leo)."""
        case = next(c for c in nakshatra_cases if c["id"] == "moon_magha")

        ecliptic_degree = mock_vedic_calculator.sign_degree_to_ecliptic(
            case["moonSign"], case["moonDegree"]
        )

        result = mock_vedic_calculator.degree_to_nakshatra(ecliptic_degree)
        assert result["nakshatra"] == case["expectedNakshatra"]

    def test_moon_revati(self, nakshatra_cases, mock_vedic_calculator):
        """Test Moon in Revati nakshatra (16.67-30 Pisces)."""
        case = next(c for c in nakshatra_cases if c["id"] == "moon_revati")

        ecliptic_degree = mock_vedic_calculator.sign_degree_to_ecliptic(
            case["moonSign"], case["moonDegree"]
        )

        result = mock_vedic_calculator.degree_to_nakshatra(ecliptic_degree)
        assert result["nakshatra"] == case["expectedNakshatra"]


class TestNakshatraPada:
    """Test nakshatra pada (quarter) calculation."""

    @pytest.mark.parametrize("case_id", [
        "moon_ashwini",
        "moon_rohini",
        "moon_magha",
        "moon_chitra",
        "moon_swati",
        "moon_jyeshtha",
        "moon_mula",
        "moon_shravana",
        "moon_shatabhisha",
        "moon_revati",
        "moon_pushya",
        "moon_vishakha"
    ])
    def test_nakshatra_pada_values(self, nakshatra_cases, mock_vedic_calculator, case_id):
        """Test pada values for all nakshatra test cases."""
        case = next(c for c in nakshatra_cases if c["id"] == case_id)

        ecliptic_degree = mock_vedic_calculator.sign_degree_to_ecliptic(
            case["moonSign"], case["moonDegree"]
        )

        result = mock_vedic_calculator.degree_to_nakshatra(ecliptic_degree)
        assert result["pada"] == case["expectedPada"], \
            f"Pada mismatch for {case_id}: expected {case['expectedPada']}, got {result['pada']}"


class TestNakshatraLord:
    """Test nakshatra lord (ruling planet) determination."""

    NAKSHATRA_LORDS = {
        "Ashwini": "Ketu",
        "Bharani": "Venus",
        "Krittika": "Sun",
        "Rohini": "Moon",
        "Mrigashira": "Mars",
        "Ardra": "Rahu",
        "Punarvasu": "Jupiter",
        "Pushya": "Saturn",
        "Ashlesha": "Mercury",
        "Magha": "Ketu",
        "Purva Phalguni": "Venus",
        "Uttara Phalguni": "Sun",
        "Hasta": "Moon",
        "Chitra": "Mars",
        "Swati": "Rahu",
        "Vishakha": "Jupiter",
        "Anuradha": "Saturn",
        "Jyeshtha": "Mercury",
        "Mula": "Ketu",
        "Purva Ashadha": "Venus",
        "Uttara Ashadha": "Sun",
        "Shravana": "Moon",
        "Dhanishta": "Mars",
        "Shatabhisha": "Rahu",
        "Purva Bhadrapada": "Jupiter",
        "Uttara Bhadrapada": "Saturn",
        "Revati": "Mercury"
    }

    @pytest.mark.parametrize("case_id", [
        "moon_ashwini",
        "moon_rohini",
        "moon_magha",
        "moon_pushya",
        "moon_swati",
        "moon_vishakha"
    ])
    def test_nakshatra_lord_values(self, nakshatra_cases, case_id):
        """Test nakshatra lord for various cases."""
        case = next(c for c in nakshatra_cases if c["id"] == case_id)
        expected_lord = self.NAKSHATRA_LORDS[case["expectedNakshatra"]]
        assert case["expectedLord"] == expected_lord

    @pytest.mark.parametrize("nakshatra,expected_lord", [
        ("Ashwini", "Ketu"),
        ("Rohini", "Moon"),
        ("Magha", "Ketu"),
        ("Mula", "Ketu"),
        ("Pushya", "Saturn"),
        ("Anuradha", "Saturn"),
        ("Revati", "Mercury"),
    ])
    def test_lord_mapping(self, nakshatra, expected_lord):
        """Test individual nakshatra-lord mappings."""
        assert self.NAKSHATRA_LORDS[nakshatra] == expected_lord


class TestNakshatraDeity:
    """Test nakshatra deity associations."""

    NAKSHATRA_DEITIES = {
        "Ashwini": "Ashwini Kumaras",
        "Bharani": "Yama",
        "Krittika": "Agni",
        "Rohini": "Brahma",
        "Mrigashira": "Soma",
        "Ardra": "Rudra",
        "Punarvasu": "Aditi",
        "Pushya": "Brihaspati",
        "Ashlesha": "Nagas",
        "Magha": "Pitris",
        "Purva Phalguni": "Bhaga",
        "Uttara Phalguni": "Aryaman",
        "Hasta": "Savitar",
        "Chitra": "Vishwakarma",
        "Swati": "Vayu",
        "Vishakha": "Indra-Agni",
        "Anuradha": "Mitra",
        "Jyeshtha": "Indra",
        "Mula": "Nirriti",
        "Purva Ashadha": "Apas",
        "Uttara Ashadha": "Vishvedevas",
        "Shravana": "Vishnu",
        "Dhanishta": "Vasus",
        "Shatabhisha": "Varuna",
        "Purva Bhadrapada": "Ajaikapada",
        "Uttara Bhadrapada": "Ahirbudhnya",
        "Revati": "Pushan"
    }

    @pytest.mark.parametrize("case_id", [
        "moon_ashwini",
        "moon_rohini",
        "moon_magha",
        "moon_pushya",
        "moon_swati",
        "moon_revati"
    ])
    def test_nakshatra_deity_values(self, nakshatra_cases, case_id):
        """Test nakshatra deity for various cases."""
        case = next(c for c in nakshatra_cases if c["id"] == case_id)
        expected_deity = self.NAKSHATRA_DEITIES[case["expectedNakshatra"]]
        assert case["expectedDeity"] == expected_deity


class TestNakshatraGroups:
    """Test nakshatra groupings (Gana, Nadi, etc.)."""

    NAKSHATRA_GANA = {
        # Deva (Divine) Gana
        "Ashwini": "Deva", "Mrigashira": "Deva", "Punarvasu": "Deva",
        "Pushya": "Deva", "Hasta": "Deva", "Swati": "Deva",
        "Anuradha": "Deva", "Shravana": "Deva", "Revati": "Deva",
        # Manushya (Human) Gana
        "Bharani": "Manushya", "Rohini": "Manushya", "Ardra": "Manushya",
        "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya",
        "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya",
        "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya",
        # Rakshasa (Demon) Gana
        "Krittika": "Rakshasa", "Ashlesha": "Rakshasa", "Magha": "Rakshasa",
        "Chitra": "Rakshasa", "Vishakha": "Rakshasa", "Jyeshtha": "Rakshasa",
        "Mula": "Rakshasa", "Dhanishta": "Rakshasa", "Shatabhisha": "Rakshasa"
    }

    def test_gana_deva_count(self):
        """Test that there are exactly 9 Deva gana nakshatras."""
        deva_count = sum(1 for g in self.NAKSHATRA_GANA.values() if g == "Deva")
        assert deva_count == 9

    def test_gana_manushya_count(self):
        """Test that there are exactly 9 Manushya gana nakshatras."""
        manushya_count = sum(1 for g in self.NAKSHATRA_GANA.values() if g == "Manushya")
        assert manushya_count == 9

    def test_gana_rakshasa_count(self):
        """Test that there are exactly 9 Rakshasa gana nakshatras."""
        rakshasa_count = sum(1 for g in self.NAKSHATRA_GANA.values() if g == "Rakshasa")
        assert rakshasa_count == 9

    def test_total_nakshatras(self):
        """Test that all 27 nakshatras are accounted for."""
        assert len(self.NAKSHATRA_GANA) == 27
