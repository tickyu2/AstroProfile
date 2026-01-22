"""
api/compute_compatibility.py

Unified compatibility computation endpoint.
Computes compatibility across BaZi + Western + Unified systems.

Output is canonical schema - store directly, read directly.
"""

from datetime import datetime
from typing import Dict, Any, Optional, List
import traceback

from .schemas import (
    ComputeCompatibilityRequest,
    CompatibilityResultSchema,
    SectionScoreSchema,
    BirthDataInput,
)
from .compute_profile import compute_bazi, compute_western, compute_unified


# =============================================================================
# COMPATIBILITY SCORING
# =============================================================================

def compute_bazi_compatibility(bazi_a: Any, bazi_b: Any) -> Dict[str, Any]:
    """
    Compute BaZi compatibility using synastry matrix and relationship axes.

    Returns dict with score, sections, strengths, challenges.
    """
    try:
        from luna_fusion.synastry.bazi_synastry import (
            compute_bazi_compatibility as bazi_compat,
            synastry_matrix,
            synastry_insights,
            calculate_relationship_axes
        )

        # Build compatibility result
        # Note: bazi_a and bazi_b should be converted to format expected by synastry module
        pillars_a = [
            (bazi_a.pillars.year.stem, bazi_a.pillars.year.branch),
            (bazi_a.pillars.month.stem, bazi_a.pillars.month.branch),
            (bazi_a.pillars.day.stem, bazi_a.pillars.day.branch),
            (bazi_a.pillars.hour.stem, bazi_a.pillars.hour.branch),
        ]
        pillars_b = [
            (bazi_b.pillars.year.stem, bazi_b.pillars.year.branch),
            (bazi_b.pillars.month.stem, bazi_b.pillars.month.branch),
            (bazi_b.pillars.day.stem, bazi_b.pillars.day.branch),
            (bazi_b.pillars.hour.stem, bazi_b.pillars.hour.branch),
        ]

        dm_a = bazi_a.dayMaster.stem
        dm_b = bazi_b.dayMaster.stem

        # Compute synastry matrix
        matrix = synastry_matrix(pillars_a, pillars_b, dm_a, dm_b)

        # Get relationship axes
        axes = calculate_relationship_axes(pillars_a, pillars_b, dm_a, dm_b)

        # Compute overall compatibility
        compat_result = bazi_compat(pillars_a, pillars_b, dm_a, dm_b)

        # Get insights
        insights = synastry_insights(matrix, axes)

        return {
            "score": compat_result.get("overall_score", 50),
            "matrix": matrix,
            "axes": axes,
            "strengths": insights.get("strengths", []),
            "challenges": insights.get("challenges", []),
            "interpretation": compat_result.get("interpretation", "")
        }

    except ImportError as e:
        print(f"[compute_bazi_compatibility] Synastry module not available: {e}")
        # Fallback: simple element-based compatibility
        return compute_simple_bazi_compatibility(bazi_a, bazi_b)
    except Exception as e:
        print(f"[compute_bazi_compatibility] Error: {e}")
        traceback.print_exc()
        return compute_simple_bazi_compatibility(bazi_a, bazi_b)


def compute_simple_bazi_compatibility(bazi_a: Any, bazi_b: Any) -> Dict[str, Any]:
    """
    Simple fallback BaZi compatibility based on element matching.
    """
    # Element compatibility matrix
    elem_compat = {
        ("Wood", "Wood"): 0.8,
        ("Wood", "Fire"): 0.9,  # Wood feeds Fire (generative)
        ("Wood", "Earth"): 0.6,  # Wood controls Earth
        ("Wood", "Metal"): 0.5,  # Metal controls Wood
        ("Wood", "Water"): 0.9,  # Water feeds Wood (generative)

        ("Fire", "Fire"): 0.8,
        ("Fire", "Earth"): 0.9,  # Fire feeds Earth
        ("Fire", "Metal"): 0.5,  # Fire controls Metal
        ("Fire", "Water"): 0.4,  # Water controls Fire

        ("Earth", "Earth"): 0.8,
        ("Earth", "Metal"): 0.9,  # Earth feeds Metal
        ("Earth", "Water"): 0.5,  # Earth controls Water

        ("Metal", "Metal"): 0.8,
        ("Metal", "Water"): 0.9,  # Metal feeds Water

        ("Water", "Water"): 0.8,
    }

    # Get dominant elements
    dom_a = bazi_a.elements.dominant
    dom_b = bazi_b.elements.dominant

    # Look up compatibility (order-independent)
    key = tuple(sorted([dom_a, dom_b]))
    base_score = elem_compat.get(key, 0.7)

    # Day Master compatibility
    dm_a = bazi_a.dayMaster.element
    dm_b = bazi_b.dayMaster.element
    dm_key = tuple(sorted([dm_a, dm_b]))
    dm_score = elem_compat.get(dm_key, 0.7)

    # Weighted average
    score = (base_score * 0.4 + dm_score * 0.6) * 100

    strengths = []
    challenges = []

    if score >= 70:
        strengths.append(f"Good elemental harmony: {dom_a} and {dom_b}")
    if score < 50:
        challenges.append(f"Elemental tension: {dom_a} and {dom_b}")

    return {
        "score": round(score, 1),
        "matrix": None,
        "axes": None,
        "strengths": strengths,
        "challenges": challenges,
        "interpretation": f"BaZi compatibility based on {dom_a}-{dom_b} dynamics"
    }


def compute_western_compatibility(western_a: Any, western_b: Any) -> Dict[str, Any]:
    """
    Compute Western compatibility using synastry aspects and elemental harmony.
    """
    try:
        from astro.calculator import SwissEphemerisCalculator

        calc = SwissEphemerisCalculator()

        # Build chart dicts for synastry
        chart_a = {
            "planets": {k: v.model_dump() for k, v in western_a.planets.items()},
            "elements": {
                "fire": western_a.elements.fire,
                "earth": western_a.elements.earth,
                "air": western_a.elements.air,
                "water": western_a.elements.water,
                "dominant": {"element": western_a.elements.dominant}
            }
        }
        chart_b = {
            "planets": {k: v.model_dump() for k, v in western_b.planets.items()},
            "elements": {
                "fire": western_b.elements.fire,
                "earth": western_b.elements.earth,
                "air": western_b.elements.air,
                "water": western_b.elements.water,
                "dominant": {"element": western_b.elements.dominant}
            }
        }

        # Calculate synastry
        synastry = calc.calculate_synastry(chart_a, chart_b)

        return {
            "score": synastry.get("overallScore", 50),
            "aspects": synastry.get("aspects", []),
            "elementalCompatibility": synastry.get("elementalCompatibility", {}),
            "interpretation": synastry.get("interpretation", {}),
            "strengths": [],
            "challenges": []
        }

    except Exception as e:
        print(f"[compute_western_compatibility] Error: {e}")
        traceback.print_exc()
        return compute_simple_western_compatibility(western_a, western_b)


def compute_simple_western_compatibility(western_a: Any, western_b: Any) -> Dict[str, Any]:
    """
    Simple fallback Western compatibility based on element matching.
    """
    # Element compatibility
    elem_compat = {
        ("fire", "fire"): 0.9,
        ("fire", "air"): 0.85,
        ("fire", "earth"): 0.6,
        ("fire", "water"): 0.5,
        ("earth", "earth"): 0.9,
        ("earth", "water"): 0.85,
        ("earth", "air"): 0.6,
        ("air", "air"): 0.9,
        ("air", "water"): 0.6,
        ("water", "water"): 0.9,
    }

    dom_a = western_a.elements.dominant.lower()
    dom_b = western_b.elements.dominant.lower()

    key = tuple(sorted([dom_a, dom_b]))
    score = elem_compat.get(key, 0.7) * 100

    return {
        "score": round(score, 1),
        "aspects": [],
        "elementalCompatibility": {
            "score": score,
            "person1_dominant": dom_a,
            "person2_dominant": dom_b
        },
        "interpretation": f"Western elemental compatibility: {dom_a.title()}-{dom_b.title()}",
        "strengths": [],
        "challenges": []
    }


def compute_unified_compatibility(unified_a: Any, unified_b: Any) -> Dict[str, Any]:
    """
    Compute unified vector compatibility using cosine similarity.
    """
    try:
        from unified_engine import (
            compute_unified_compatibility as unified_compat,
            generate_third_chart
        )

        # Get the unified expression vectors
        result = unified_compat(unified_a, unified_b)

        # Generate third chart (relationship being)
        third_chart = generate_third_chart(unified_a, unified_b)

        return {
            "score": getattr(result, 'total_score', 50) * 100,
            "sectionScores": getattr(result, 'section_scores', []),
            "thirdChart": third_chart.to_dict() if hasattr(third_chart, 'to_dict') else None,
            "interpretation": getattr(result, 'interpretation', ""),
            "level": getattr(result, 'level', "moderate")
        }

    except ImportError as e:
        print(f"[compute_unified_compatibility] Unified engine not available: {e}")
        return {"score": 50, "sectionScores": [], "thirdChart": None, "interpretation": "", "level": "moderate"}
    except Exception as e:
        print(f"[compute_unified_compatibility] Error: {e}")
        traceback.print_exc()
        return {"score": 50, "sectionScores": [], "thirdChart": None, "interpretation": "", "level": "moderate"}


# =============================================================================
# SCORE GRADING
# =============================================================================

def score_to_grade(score: float) -> str:
    """Convert numeric score (0-100) to letter grade."""
    if score >= 90:
        return "A+"
    elif score >= 85:
        return "A"
    elif score >= 80:
        return "B+"
    elif score >= 75:
        return "B"
    elif score >= 70:
        return "C+"
    elif score >= 65:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"


def score_to_interpretation(score: float) -> str:
    """Generate interpretation based on score."""
    if score >= 85:
        return "Exceptional compatibility with deep natural resonance across multiple dimensions."
    elif score >= 75:
        return "Strong compatibility with good potential for lasting harmony."
    elif score >= 65:
        return "Moderate compatibility with areas of natural connection and some differences to navigate."
    elif score >= 55:
        return "Mixed compatibility requiring conscious effort to bridge differences."
    else:
        return "Challenging compatibility with significant differences in approach and values."


# =============================================================================
# MAIN COMPATIBILITY FUNCTION
# =============================================================================

def compute_compatibility(request: ComputeCompatibilityRequest) -> CompatibilityResultSchema:
    """
    Compute complete compatibility: BaZi + Western + Unified.

    This is the main entry point for the compute-compatibility endpoint.
    Output is canonical schema - store directly in Firebase.
    """
    profile_a = request.profileA
    profile_b = request.profileB
    options = request.options or {}

    errors: List[str] = []
    sections: List[SectionScoreSchema] = []
    strengths: List[str] = []
    challenges: List[str] = []
    advice: List[str] = []

    # Default weights
    weights = options.get("weights", {
        "bazi": 0.35,
        "western": 0.25,
        "unified": 0.40
    })

    # Compute BaZi charts
    bazi_a = compute_bazi(
        birth_date=profile_a.birthDate,
        birth_time=profile_a.birthTime,
        gender=profile_a.gender,
        latitude=profile_a.latitude,
        longitude=profile_a.longitude,
        timezone=profile_a.timezone
    )
    bazi_b = compute_bazi(
        birth_date=profile_b.birthDate,
        birth_time=profile_b.birthTime,
        gender=profile_b.gender,
        latitude=profile_b.latitude,
        longitude=profile_b.longitude,
        timezone=profile_b.timezone
    )

    # Compute Western charts
    western_a = compute_western(
        birth_date=profile_a.birthDate,
        birth_time=profile_a.birthTime,
        latitude=profile_a.latitude,
        longitude=profile_a.longitude,
        timezone=profile_a.timezone
    )
    western_b = compute_western(
        birth_date=profile_b.birthDate,
        birth_time=profile_b.birthTime,
        latitude=profile_b.latitude,
        longitude=profile_b.longitude,
        timezone=profile_b.timezone
    )

    # Component scores
    bazi_score = None
    western_score = None
    unified_score = None
    third_chart = None

    # BaZi compatibility
    if bazi_a and bazi_b:
        bazi_result = compute_bazi_compatibility(bazi_a, bazi_b)
        bazi_score = bazi_result["score"]
        strengths.extend(bazi_result.get("strengths", []))
        challenges.extend(bazi_result.get("challenges", []))
        sections.append(SectionScoreSchema(
            name="BaZi (Chinese Metaphysics)",
            score=bazi_score,
            weight=weights["bazi"],
            contribution=bazi_score * weights["bazi"],
            interpretation=bazi_result.get("interpretation", "")
        ))
    else:
        errors.append("BaZi charts unavailable for compatibility")

    # Western compatibility
    if western_a and western_b:
        western_result = compute_western_compatibility(western_a, western_b)
        western_score = western_result["score"]
        strengths.extend(western_result.get("strengths", []))
        challenges.extend(western_result.get("challenges", []))
        sections.append(SectionScoreSchema(
            name="Western Astrology",
            score=western_score,
            weight=weights["western"],
            contribution=western_score * weights["western"],
            interpretation=str(western_result.get("interpretation", ""))
        ))
    else:
        errors.append("Western charts unavailable for compatibility")

    # Unified compatibility
    if bazi_a and bazi_b and western_a and western_b:
        unified_a = compute_unified(bazi_a, western_a)
        unified_b = compute_unified(bazi_b, western_b)

        if unified_a and unified_b:
            unified_result = compute_unified_compatibility(unified_a, unified_b)
            unified_score = unified_result["score"]
            third_chart = unified_result.get("thirdChart")
            sections.append(SectionScoreSchema(
                name="Unified Vector Space",
                score=unified_score,
                weight=weights["unified"],
                contribution=unified_score * weights["unified"],
                interpretation=unified_result.get("interpretation", "")
            ))
        else:
            errors.append("Unified vectors unavailable")

    # Calculate total score
    total_contribution = sum(s.contribution for s in sections)
    total_weight = sum(s.weight for s in sections)
    total_score = total_contribution / total_weight if total_weight > 0 else 50

    # Generate advice based on challenges
    if challenges:
        advice.append("Focus on areas of natural connection while being mindful of differences.")
    if bazi_score and western_score:
        if abs(bazi_score - western_score) > 20:
            advice.append("Your Chinese and Western chart compatibility differ significantly - explore both perspectives.")

    return CompatibilityResultSchema(
        totalScore=round(total_score, 1),
        grade=score_to_grade(total_score),
        interpretation=score_to_interpretation(total_score),
        neoScore=None,  # NEO-PI-R not computed in this endpoint
        baziScore=bazi_score,
        westernScore=western_score,
        vedicScore=None,  # Vedic compatibility not yet implemented
        sections=sections,
        strengths=strengths[:5],  # Limit to top 5
        challenges=challenges[:5],
        advice=advice[:3],
        thirdChart=third_chart,
        computedAt=datetime.now().isoformat(),
        computeVersion="2.0.0"
    )
