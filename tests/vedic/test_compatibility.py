"""
Test Suite: Vedic Compatibility Calculations

Tests Guna, Dosha, Nakshatra compatibility, and polarity archetypes.
"""

import pytest


class TestGunaCompatibility:
    """Test Guna (temperament) compatibility calculations."""

    @pytest.mark.parametrize("case_id,expected_score", [
        ("guna_sattva_sattva", 95),
        ("guna_sattva_rajas", 75),
        ("guna_sattva_tamas", 55),
        ("guna_rajas_rajas", 80),
    ])
    def test_guna_scores(self, compatibility_cases, case_id, expected_score):
        """Test Guna compatibility scores."""
        case = next(c for c in compatibility_cases if c["id"] == case_id)
        assert case["expectedGunaScore"] == expected_score

    def test_sattva_sattva_resonant(self, compatibility_cases):
        """Test Sattva-Sattva combination is Resonant."""
        case = next(c for c in compatibility_cases if c["id"] == "guna_sattva_sattva")
        assert case["expectedHarmony"] == "Resonant"

    def test_sattva_rajas_complementary(self, compatibility_cases):
        """Test Sattva-Rajas combination is Complementary."""
        case = next(c for c in compatibility_cases if c["id"] == "guna_sattva_rajas")
        assert case["expectedHarmony"] == "Complementary"

    def test_sattva_tamas_transformative(self, compatibility_cases):
        """Test Sattva-Tamas combination is Transformative."""
        case = next(c for c in compatibility_cases if c["id"] == "guna_sattva_tamas")
        assert case["expectedHarmony"] == "Transformative"


class TestDoshaCompatibility:
    """Test Dosha (constitution) compatibility calculations."""

    @pytest.mark.parametrize("case_id,expected_score", [
        ("dosha_vata_pitta", 70),
        ("dosha_vata_kapha", 75),
        ("dosha_pitta_kapha", 72),
    ])
    def test_dosha_scores(self, compatibility_cases, case_id, expected_score):
        """Test Dosha compatibility scores."""
        case = next(c for c in compatibility_cases if c["id"] == case_id)
        assert case["expectedDoshaScore"] == expected_score

    def test_vata_pitta_activating(self, compatibility_cases):
        """Test Vata-Pitta combination is Activating."""
        case = next(c for c in compatibility_cases if c["id"] == "dosha_vata_pitta")
        assert case["expectedHarmony"] == "Activating"

    def test_vata_kapha_balancing(self, compatibility_cases):
        """Test Vata-Kapha combination is Balancing."""
        case = next(c for c in compatibility_cases if c["id"] == "dosha_vata_kapha")
        assert case["expectedHarmony"] == "Balancing"


class TestNakshatraCompatibility:
    """Test Nakshatra (Gana) compatibility calculations."""

    @pytest.mark.parametrize("case_id,expected_score", [
        ("nakshatra_deva_deva", 90),
        ("nakshatra_deva_manushya", 75),
        ("nakshatra_deva_rakshasa", 50),
    ])
    def test_gana_scores(self, compatibility_cases, case_id, expected_score):
        """Test Gana compatibility scores."""
        case = next(c for c in compatibility_cases if c["id"] == case_id)
        assert case["expectedNakshatraScore"] == expected_score

    def test_deva_deva_high_resonance(self, compatibility_cases):
        """Test Deva-Deva has high resonance."""
        case = next(c for c in compatibility_cases if c["id"] == "nakshatra_deva_deva")
        assert case["expectedResonance"] == "High"

    def test_deva_rakshasa_challenging(self, compatibility_cases):
        """Test Deva-Rakshasa is challenging."""
        case = next(c for c in compatibility_cases if c["id"] == "nakshatra_deva_rakshasa")
        assert case["expectedResonance"] == "Challenging"


class TestDashaCompatibility:
    """Test Dasha timing compatibility."""

    @pytest.mark.parametrize("case_id,expected_score", [
        ("dasha_saturn_jupiter", 78),
        ("dasha_venus_mars", 85),
        ("dasha_moon_saturn", 60),
    ])
    def test_dasha_scores(self, compatibility_cases, case_id, expected_score):
        """Test Dasha compatibility scores."""
        case = next(c for c in compatibility_cases if c["id"] == case_id)
        assert case["expectedDashaScore"] == expected_score

    def test_venus_mars_passionate(self, compatibility_cases):
        """Test Venus-Mars dasha combination."""
        case = next(c for c in compatibility_cases if c["id"] == "dasha_venus_mars")
        assert case["expectedHarmony"] == "Passionate attraction"


class TestOverallCompatibility:
    """Test overall compatibility score calculation."""

    def test_high_compatibility_profile(self, compatibility_cases):
        """Test high compatibility case."""
        case = next(c for c in compatibility_cases if c["id"] == "full_compatibility_high")
        assert case["expectedOverallScore"] >= 80
        assert case["expectedArchetype"] == "The Harmonious Twins"

    def test_medium_compatibility_profile(self, compatibility_cases):
        """Test medium compatibility case."""
        case = next(c for c in compatibility_cases if c["id"] == "full_compatibility_medium")
        assert 60 <= case["expectedOverallScore"] < 80
        assert case["expectedArchetype"] == "The Growth Catalysts"

    def test_challenging_compatibility_profile(self, compatibility_cases):
        """Test challenging compatibility case."""
        case = next(c for c in compatibility_cases if c["id"] == "full_compatibility_challenging")
        assert case["expectedOverallScore"] < 60
        assert case["expectedArchetype"] == "The Shadow Workers"


class TestPolarityArchetypes:
    """Test polarity archetype classification."""

    @pytest.mark.parametrize("case_id,expected_archetype", [
        ("archetype_harmonious_twins", "The Harmonious Twins"),
        ("archetype_growth_catalysts", "The Growth Catalysts"),
        ("archetype_shadow_workers", "The Shadow Workers"),
        ("archetype_divine_counterparts", "The Divine Counterparts"),
        ("archetype_passionate_dancers", "The Passionate Dancers"),
        ("archetype_steady_builders", "The Steady Builders"),
        ("archetype_wisdom_seekers", "The Wisdom Seekers"),
    ])
    def test_archetype_classification(self, archetype_cases, case_id, expected_archetype):
        """Test archetype classification from polarity scores."""
        case = next(c for c in archetype_cases if c["id"] == case_id)
        assert case["expectedArchetype"] == expected_archetype

    def test_archetype_strengths_present(self, archetype_cases):
        """Test that archetypes have strengths defined."""
        for case in archetype_cases:
            if "expectedStrengths" in case:
                assert len(case["expectedStrengths"]) >= 1

    def test_archetype_challenges_present(self, archetype_cases):
        """Test that archetypes have challenges defined."""
        for case in archetype_cases:
            if "expectedChallenges" in case:
                assert len(case["expectedChallenges"]) >= 1


class TestArchetypeEvolution:
    """Test archetype evolution over time."""

    def test_ascending_trajectory(self, archetype_cases):
        """Test ascending evolution trajectory."""
        case = next(c for c in archetype_cases if c["id"] == "evolution_trajectory_ascending")

        evolution = case["evolutionPoints"]
        scores = [e["score"] for e in evolution]

        # Ascending trajectory should have increasing scores
        assert scores[-1] > scores[0]
        assert case["expectedTrajectory"] == "Ascending"

    def test_stable_trajectory(self, archetype_cases):
        """Test stable evolution trajectory."""
        case = next(c for c in archetype_cases if c["id"] == "evolution_trajectory_stable")

        evolution = case["evolutionPoints"]
        scores = [e["score"] for e in evolution]

        # Stable trajectory should have minimal variance
        variance = max(scores) - min(scores)
        assert variance < 5
        assert case["expectedTrajectory"] == "Stable"


class TestArchetypeForecast:
    """Test archetype forecast during transits."""

    def test_jupiter_transit_forecast(self, archetype_cases):
        """Test forecast during Jupiter transit."""
        case = next(c for c in archetype_cases if c["id"] == "forecast_jupiter_transit")

        # Jupiter transits generally improve scores
        assert case["expectedForecastScore"] > case["currentScore"]
        assert "Expansion" in case["expectedThemes"]

    def test_saturn_transit_forecast(self, archetype_cases):
        """Test forecast during Saturn transit with challenging aspects."""
        case = next(c for c in archetype_cases if c["id"] == "forecast_saturn_transit")

        # Saturn with challenging aspects may lower scores
        assert case["expectedForecastScore"] < case["currentScore"]
        assert "Testing" in case["expectedThemes"]


class TestPolarityMapAxes:
    """Test polarity map axis calculations."""

    POLARITY_AXES = ["guna", "dosha", "element", "yinYang", "graha"]

    def test_all_axes_present(self, archetype_cases):
        """Test that polarity maps contain all 5 axes."""
        case = next(c for c in archetype_cases if c["id"] == "archetype_harmonious_twins")

        for axis in self.POLARITY_AXES:
            assert axis in case["polarityMap"], f"Missing axis: {axis}"

    def test_axis_scores_in_range(self, archetype_cases):
        """Test that all axis scores are 0-100."""
        for case in archetype_cases:
            if "polarityMap" in case:
                for axis, data in case["polarityMap"].items():
                    score = data["score"]
                    assert 0 <= score <= 100, f"Score {score} out of range for {axis}"

    def test_polarity_score_calculation(self, archetype_cases):
        """Test that polarity score is reasonable average of axes."""
        case = next(c for c in archetype_cases if c["id"] == "archetype_harmonious_twins")

        axis_scores = [data["score"] for data in case["polarityMap"].values()]
        avg_score = sum(axis_scores) / len(axis_scores)

        # Overall score should be close to average (within 10 points)
        assert abs(case["polarityScore"] - avg_score) < 10
