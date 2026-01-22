"""
unified_engine/unified_compatibility.py

UnifiedCompatibilityEngine - Complete compatibility scoring using unified vectors.

Computes multi-dimensional compatibility scores:
1. Overall unified similarity (cosine of full vectors)
2. Western component similarity (archetype + patterns)
3. BaZi component similarity (elements + ten gods + pillars)
4. Section-by-section breakdown for explainability

The engine produces both:
- Quantitative scores (0-1 normalized)
- Qualitative interpretations (grades, narratives)
"""

from typing import Dict, List, Tuple, Optional, Any, NamedTuple
from dataclasses import dataclass, field
from enum import Enum
import math

from .unified_expression import (
    UnifiedExpressionVector,
    unified_expression_similarity,
    section_similarities,
    SECTION_INDICES,
    build_unified_expression,
)
from .compatibility_normalizer import (
    ComponentScores,
    WeightConfig,
    NormalizedCompatibility,
    normalize_compatibility,
    normalize_compatibility_adaptive,
    score_to_grade,
    score_to_interpretation,
)


# =============================================================================
# CONSTANTS
# =============================================================================

# Section groupings for Western vs BaZi
WESTERN_SECTIONS = [
    "western_archetype",
    "western_patterns",
    "western_elements",
    "western_modalities",
]

BAZI_SECTIONS = [
    "bazi_elements",
    "bazi_ten_gods",
    "bazi_ten_god_groups",
    "bazi_stems",
    "bazi_branches",
    "bazi_growth_phases",
    "bazi_dm_strength",
    "bazi_symbolic_stars",
    "bazi_palaces",
]

# Section weights for compatibility scoring
DEFAULT_SECTION_WEIGHTS = {
    "western_archetype": 0.15,
    "western_patterns": 0.08,
    "western_elements": 0.05,
    "western_modalities": 0.04,
    "bazi_elements": 0.12,
    "bazi_ten_gods": 0.12,
    "bazi_ten_god_groups": 0.10,
    "bazi_stems": 0.08,
    "bazi_branches": 0.10,
    "bazi_growth_phases": 0.06,
    "bazi_dm_strength": 0.03,
    "bazi_symbolic_stars": 0.04,
    "bazi_palaces": 0.03,
}


# =============================================================================
# DATA STRUCTURES
# =============================================================================

class CompatibilityLevel(Enum):
    """Enumeration of compatibility levels."""
    SOULMATE = "soulmate"           # >= 0.90
    EXCELLENT = "excellent"         # >= 0.80
    GOOD = "good"                   # >= 0.70
    MODERATE = "moderate"           # >= 0.60
    MIXED = "mixed"                 # >= 0.50
    CHALLENGING = "challenging"     # >= 0.40
    DIFFICULT = "difficult"         # < 0.40


@dataclass
class SectionScore:
    """Score for a single section with interpretation."""
    name: str
    score: float
    weight: float
    contribution: float  # score * weight
    interpretation: str


@dataclass
class UnifiedCompatibilityResult:
    """
    Complete compatibility result from the unified engine.

    Contains overall score, system breakdowns, and section details.
    """
    # Overall scores
    overall_score: float
    overall_grade: str
    overall_level: CompatibilityLevel
    overall_interpretation: str

    # System-level scores
    western_score: float
    bazi_score: float

    # Section breakdown
    section_scores: List[SectionScore]

    # Raw similarities (before weighting)
    raw_similarities: Dict[str, float]

    # Profiles metadata
    profile_a_sign: str
    profile_a_day_master: str
    profile_b_sign: str
    profile_b_day_master: str

    # Narrative
    narrative: str

    # Strengths and challenges
    strengths: List[str]
    challenges: List[str]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "overall": {
                "score": round(self.overall_score, 4),
                "grade": self.overall_grade,
                "level": self.overall_level.value,
                "interpretation": self.overall_interpretation,
            },
            "system_scores": {
                "western": round(self.western_score, 4),
                "bazi": round(self.bazi_score, 4),
            },
            "sections": [
                {
                    "name": s.name,
                    "score": round(s.score, 4),
                    "weight": s.weight,
                    "contribution": round(s.contribution, 4),
                    "interpretation": s.interpretation,
                }
                for s in self.section_scores
            ],
            "profiles": {
                "a": {
                    "sign": self.profile_a_sign,
                    "day_master": self.profile_a_day_master,
                },
                "b": {
                    "sign": self.profile_b_sign,
                    "day_master": self.profile_b_day_master,
                },
            },
            "narrative": self.narrative,
            "strengths": self.strengths,
            "challenges": self.challenges,
        }


# =============================================================================
# COMPATIBILITY ENGINE
# =============================================================================

class UnifiedCompatibilityEngine:
    """
    Engine for computing unified compatibility scores.

    Usage:
        engine = UnifiedCompatibilityEngine()
        result = engine.compute(expr_a, expr_b)
    """

    def __init__(
        self,
        section_weights: Optional[Dict[str, float]] = None,
        normalize_vectors: bool = True,
    ):
        """
        Initialize the compatibility engine.

        Args:
            section_weights: Custom weights for each section
            normalize_vectors: Whether to L2 normalize before comparison
        """
        self.section_weights = section_weights or DEFAULT_SECTION_WEIGHTS
        self.normalize_vectors = normalize_vectors

        # Ensure weights sum to 1.0
        total = sum(self.section_weights.values())
        if total != 1.0:
            self.section_weights = {
                k: v / total for k, v in self.section_weights.items()
            }

    def compute(
        self,
        expr_a: UnifiedExpressionVector,
        expr_b: UnifiedExpressionVector,
    ) -> UnifiedCompatibilityResult:
        """
        Compute full compatibility between two unified expressions.

        Args:
            expr_a: First unified expression vector
            expr_b: Second unified expression vector

        Returns:
            UnifiedCompatibilityResult with complete breakdown
        """
        # Get section similarities
        raw_sims = section_similarities(expr_a, expr_b)

        # Calculate section scores with weights
        section_scores = []
        total_weighted = 0.0

        for section_name, weight in self.section_weights.items():
            sim = raw_sims.get(section_name, 0.5)
            contribution = sim * weight
            total_weighted += contribution

            interpretation = self._interpret_section(section_name, sim)
            section_scores.append(SectionScore(
                name=section_name,
                score=sim,
                weight=weight,
                contribution=contribution,
                interpretation=interpretation,
            ))

        # Sort by contribution (highest first)
        section_scores.sort(key=lambda x: x.contribution, reverse=True)

        # Calculate system-level scores
        western_score = self._calculate_system_score(raw_sims, WESTERN_SECTIONS)
        bazi_score = self._calculate_system_score(raw_sims, BAZI_SECTIONS)

        # Overall score
        overall_score = total_weighted

        # Grade and level
        grade = score_to_grade(overall_score)
        level = self._score_to_level(overall_score)
        interpretation = score_to_interpretation(overall_score)

        # Generate narrative
        narrative = self._generate_narrative(
            expr_a, expr_b, overall_score, western_score, bazi_score, section_scores
        )

        # Identify strengths and challenges
        strengths = self._identify_strengths(section_scores)
        challenges = self._identify_challenges(section_scores)

        return UnifiedCompatibilityResult(
            overall_score=overall_score,
            overall_grade=grade,
            overall_level=level,
            overall_interpretation=interpretation,
            western_score=western_score,
            bazi_score=bazi_score,
            section_scores=section_scores,
            raw_similarities=raw_sims,
            profile_a_sign=expr_a.sign,
            profile_a_day_master=expr_a.day_master,
            profile_b_sign=expr_b.sign,
            profile_b_day_master=expr_b.day_master,
            narrative=narrative,
            strengths=strengths,
            challenges=challenges,
        )

    def _calculate_system_score(
        self,
        raw_sims: Dict[str, float],
        sections: List[str],
    ) -> float:
        """Calculate weighted score for a system (Western or BaZi)."""
        total_weight = 0.0
        weighted_sum = 0.0

        for section in sections:
            if section in raw_sims and section in self.section_weights:
                weight = self.section_weights[section]
                weighted_sum += raw_sims[section] * weight
                total_weight += weight

        if total_weight == 0:
            return 0.5

        return weighted_sum / total_weight

    def _score_to_level(self, score: float) -> CompatibilityLevel:
        """Convert score to compatibility level."""
        if score >= 0.90:
            return CompatibilityLevel.SOULMATE
        elif score >= 0.80:
            return CompatibilityLevel.EXCELLENT
        elif score >= 0.70:
            return CompatibilityLevel.GOOD
        elif score >= 0.60:
            return CompatibilityLevel.MODERATE
        elif score >= 0.50:
            return CompatibilityLevel.MIXED
        elif score >= 0.40:
            return CompatibilityLevel.CHALLENGING
        else:
            return CompatibilityLevel.DIFFICULT

    def _interpret_section(self, section_name: str, score: float) -> str:
        """Generate interpretation for a section score."""
        level = "Strong" if score >= 0.75 else "Moderate" if score >= 0.55 else "Challenging"

        interpretations = {
            "western_archetype": f"{level} psychological resonance",
            "western_patterns": f"{level} pattern alignment",
            "western_elements": f"{level} elemental harmony (Western)",
            "western_modalities": f"{level} modal compatibility",
            "bazi_elements": f"{level} five elements balance",
            "bazi_ten_gods": f"{level} ten gods interaction",
            "bazi_ten_god_groups": f"{level} functional group resonance",
            "bazi_stems": f"{level} heavenly stem harmony",
            "bazi_branches": f"{level} earthly branch connection",
            "bazi_growth_phases": f"{level} life phase alignment",
            "bazi_dm_strength": f"{level} day master complementarity",
            "bazi_symbolic_stars": f"{level} symbolic star resonance",
            "bazi_palaces": f"{level} palace alignment",
        }

        return interpretations.get(section_name, f"{level} compatibility")

    def _generate_narrative(
        self,
        expr_a: UnifiedExpressionVector,
        expr_b: UnifiedExpressionVector,
        overall: float,
        western: float,
        bazi: float,
        sections: List[SectionScore],
    ) -> str:
        """Generate a narrative description of the compatibility."""
        parts = []

        # Opening
        if overall >= 0.80:
            parts.append(f"The {expr_a.sign or 'first'} and {expr_b.sign or 'second'} share deep metaphysical resonance.")
        elif overall >= 0.60:
            parts.append(f"The {expr_a.sign or 'first'} and {expr_b.sign or 'second'} have complementary energies with growth potential.")
        else:
            parts.append(f"The {expr_a.sign or 'first'} and {expr_b.sign or 'second'} have different wavelengths that offer transformation.")

        # System comparison
        if abs(western - bazi) > 0.15:
            if western > bazi:
                parts.append("Western psychological dimensions show stronger alignment than Eastern elemental patterns.")
            else:
                parts.append("Eastern elemental patterns show stronger alignment than Western psychological dimensions.")
        else:
            parts.append("Both Eastern and Western dimensions show similar levels of resonance.")

        # Top strength
        if sections and sections[0].score >= 0.70:
            parts.append(f"Strongest connection: {sections[0].interpretation}.")

        # Day Master insight if available
        if expr_a.day_master and expr_b.day_master:
            parts.append(f"Day Master interaction ({expr_a.day_master}-{expr_b.day_master}) shapes the elemental dynamic.")

        return " ".join(parts)

    def _identify_strengths(self, sections: List[SectionScore]) -> List[str]:
        """Identify top compatibility strengths."""
        strengths = []
        for s in sections[:3]:  # Top 3
            if s.score >= 0.65:
                strengths.append(s.interpretation)
        return strengths

    def _identify_challenges(self, sections: List[SectionScore]) -> List[str]:
        """Identify compatibility challenges."""
        challenges = []
        for s in reversed(sections):  # Bottom scores
            if s.score < 0.45 and len(challenges) < 3:
                challenges.append(f"Work needed: {s.interpretation.replace('Strong', 'Weak').replace('Moderate', 'Developing')}")
        return challenges


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

def compute_unified_compatibility(
    expr_a: UnifiedExpressionVector,
    expr_b: UnifiedExpressionVector,
    weights: Optional[Dict[str, float]] = None,
) -> UnifiedCompatibilityResult:
    """
    Convenience function to compute unified compatibility.

    Args:
        expr_a: First unified expression
        expr_b: Second unified expression
        weights: Optional custom section weights

    Returns:
        UnifiedCompatibilityResult
    """
    engine = UnifiedCompatibilityEngine(section_weights=weights)
    return engine.compute(expr_a, expr_b)


def quick_compatibility_score(
    expr_a: UnifiedExpressionVector,
    expr_b: UnifiedExpressionVector,
) -> float:
    """
    Get quick overall compatibility score without full breakdown.

    Args:
        expr_a: First unified expression
        expr_b: Second unified expression

    Returns:
        Compatibility score in [0, 1]
    """
    return unified_expression_similarity(expr_a, expr_b)


def compare_profiles(
    profile_a: Dict[str, Any],
    profile_b: Dict[str, Any],
    current_age_a: Optional[int] = None,
    current_age_b: Optional[int] = None,
) -> UnifiedCompatibilityResult:
    """
    Compare two GENESIS profiles directly.

    Args:
        profile_a: First profile dict
        profile_b: Second profile dict
        current_age_a: Current age for profile A
        current_age_b: Current age for profile B

    Returns:
        UnifiedCompatibilityResult
    """
    expr_a = build_unified_expression(
        profile_a.get("westernChart"),
        profile_a.get("baziChart"),
        current_age_a,
    )
    expr_b = build_unified_expression(
        profile_b.get("westernChart"),
        profile_b.get("baziChart"),
        current_age_b,
    )

    return compute_unified_compatibility(expr_a, expr_b)


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Main classes
    "UnifiedCompatibilityEngine",
    "UnifiedCompatibilityResult",
    "CompatibilityLevel",
    "SectionScore",

    # Convenience functions
    "compute_unified_compatibility",
    "quick_compatibility_score",
    "compare_profiles",

    # Constants
    "DEFAULT_SECTION_WEIGHTS",
    "WESTERN_SECTIONS",
    "BAZI_SECTIONS",
]
