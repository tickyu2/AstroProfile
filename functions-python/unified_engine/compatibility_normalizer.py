"""
unified_engine/compatibility_normalizer.py

Compatibility Scoring Normalizer for GENESIS Unified Metaphysics Engine.

Normalizes component scores (NEO, BaZi, Western) to 0-1 and computes
weighted sum for final compatibility score.

Formula:
    Total = (1 - α - γ) × NEO + α × [(1 - β) × WuXing + β × TenGods] × modifiers + γ × Western

Where:
    α = BaZi weight (default 0.25)
    β = TenGods weight within BaZi (default 0.30)
    γ = Western weight (default 0.15)
    Remaining (1 - α - γ) = NEO weight (default 0.60)

This module provides:
1. Score normalization utilities
2. Weighted combination functions
3. Modifier application (clashes, harmonies)
4. Explainability breakdown
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
import math


# =============================================================================
# DEFAULT WEIGHTS
# =============================================================================

# Master weights (must sum to 1.0)
DEFAULT_NEO_WEIGHT = 0.60    # NEO personality
DEFAULT_BAZI_WEIGHT = 0.25   # BaZi total
DEFAULT_WESTERN_WEIGHT = 0.15  # Western astrology

# BaZi internal weights (must sum to 1.0)
DEFAULT_WUXING_WEIGHT = 0.70  # Five elements balance
DEFAULT_TENGODS_WEIGHT = 0.30  # Ten Gods compatibility

# Western internal weights (must sum to 1.0)
DEFAULT_ARCHETYPE_WEIGHT = 0.60  # Archetype similarity
DEFAULT_PATTERN_WEIGHT = 0.25    # Pattern similarity
DEFAULT_ELEMENT_WEIGHT = 0.15    # Element compatibility


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class ComponentScores:
    """Raw component scores before normalization."""
    neo_score: Optional[float] = None
    bazi_wuxing: Optional[float] = None
    bazi_tengods: Optional[float] = None
    western_archetype: Optional[float] = None
    western_pattern: Optional[float] = None
    western_element: Optional[float] = None

    # Modifiers (multiplicative)
    bazi_clash_modifier: float = 1.0
    bazi_harmony_modifier: float = 1.0

    def has_neo(self) -> bool:
        return self.neo_score is not None

    def has_bazi(self) -> bool:
        return self.bazi_wuxing is not None or self.bazi_tengods is not None

    def has_western(self) -> bool:
        return self.western_archetype is not None


@dataclass
class WeightConfig:
    """Configuration for compatibility weight blending."""
    # Master weights
    neo_weight: float = DEFAULT_NEO_WEIGHT
    bazi_weight: float = DEFAULT_BAZI_WEIGHT
    western_weight: float = DEFAULT_WESTERN_WEIGHT

    # BaZi internal
    wuxing_weight: float = DEFAULT_WUXING_WEIGHT
    tengods_weight: float = DEFAULT_TENGODS_WEIGHT

    # Western internal
    archetype_weight: float = DEFAULT_ARCHETYPE_WEIGHT
    pattern_weight: float = DEFAULT_PATTERN_WEIGHT
    element_weight: float = DEFAULT_ELEMENT_WEIGHT

    def __post_init__(self):
        """Ensure master weights sum to 1.0."""
        total = self.neo_weight + self.bazi_weight + self.western_weight
        if abs(total - 1.0) > 0.001:
            self.neo_weight /= total
            self.bazi_weight /= total
            self.western_weight /= total

        # Ensure BaZi internal weights sum to 1.0
        bazi_total = self.wuxing_weight + self.tengods_weight
        if abs(bazi_total - 1.0) > 0.001:
            self.wuxing_weight /= bazi_total
            self.tengods_weight /= bazi_total

        # Ensure Western internal weights sum to 1.0
        western_total = self.archetype_weight + self.pattern_weight + self.element_weight
        if abs(western_total - 1.0) > 0.001:
            self.archetype_weight /= western_total
            self.pattern_weight /= western_total
            self.element_weight /= western_total


@dataclass
class NormalizedCompatibility:
    """Final normalized compatibility result with breakdown."""
    # Final score
    total_score: float

    # Component contributions (after weighting)
    neo_contribution: float
    bazi_contribution: float
    western_contribution: float

    # Sub-component scores (normalized 0-1)
    neo_normalized: float
    bazi_wuxing_normalized: float
    bazi_tengods_normalized: float
    western_archetype_normalized: float
    western_pattern_normalized: float
    western_element_normalized: float

    # Modifiers applied
    bazi_modifier: float

    # Effective weights used
    weights: WeightConfig

    # Interpretation
    grade: str  # A+, A, B+, B, C+, C, D, F
    interpretation: str

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "total_score": round(self.total_score, 4),
            "grade": self.grade,
            "interpretation": self.interpretation,
            "contributions": {
                "neo": round(self.neo_contribution, 4),
                "bazi": round(self.bazi_contribution, 4),
                "western": round(self.western_contribution, 4),
            },
            "normalized_scores": {
                "neo": round(self.neo_normalized, 4),
                "bazi_wuxing": round(self.bazi_wuxing_normalized, 4),
                "bazi_tengods": round(self.bazi_tengods_normalized, 4),
                "western_archetype": round(self.western_archetype_normalized, 4),
                "western_pattern": round(self.western_pattern_normalized, 4),
                "western_element": round(self.western_element_normalized, 4),
            },
            "bazi_modifier": round(self.bazi_modifier, 4),
            "weights": {
                "neo": self.weights.neo_weight,
                "bazi": self.weights.bazi_weight,
                "western": self.weights.western_weight,
            },
        }


# =============================================================================
# NORMALIZATION FUNCTIONS
# =============================================================================

def normalize_score(
    score: Optional[float],
    min_val: float = 0.0,
    max_val: float = 100.0,
    default: float = 0.5
) -> float:
    """
    Normalize a raw score to [0, 1] range.

    Args:
        score: Raw score (can be in any range)
        min_val: Expected minimum of raw score
        max_val: Expected maximum of raw score
        default: Value to return if score is None

    Returns:
        Normalized score in [0, 1]
    """
    if score is None:
        return default

    # Handle already normalized scores
    if 0 <= score <= 1 and max_val > 1:
        return score

    # Normalize
    if max_val == min_val:
        return 0.5

    normalized = (score - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, normalized))


def normalize_neo_score(score: Optional[float]) -> float:
    """Normalize NEO compatibility score (typically 0-100)."""
    return normalize_score(score, min_val=0.0, max_val=100.0, default=0.5)


def normalize_bazi_score(score: Optional[float]) -> float:
    """Normalize BaZi score (typically 0-100 or 0-1)."""
    if score is None:
        return 0.5
    # Auto-detect range
    if score > 1:
        return normalize_score(score, min_val=0.0, max_val=100.0)
    return score


def normalize_western_score(score: Optional[float]) -> float:
    """Normalize Western score (typically cosine similarity 0-1)."""
    if score is None:
        return 0.5
    return max(0.0, min(1.0, score))


# =============================================================================
# MODIFIER FUNCTIONS
# =============================================================================

def calculate_bazi_modifier(
    clash_modifier: float = 1.0,
    harmony_modifier: float = 1.0
) -> float:
    """
    Calculate combined BaZi modifier.

    Clashes reduce compatibility (modifier < 1.0).
    Harmonies increase compatibility (modifier > 1.0).

    Args:
        clash_modifier: Clash penalty (0.7-1.0 typical)
        harmony_modifier: Harmony bonus (1.0-1.3 typical)

    Returns:
        Combined modifier, clamped to [0.5, 1.5]
    """
    combined = clash_modifier * harmony_modifier
    return max(0.5, min(1.5, combined))


def apply_modifier(score: float, modifier: float) -> float:
    """
    Apply modifier to a score, keeping result in [0, 1].

    Args:
        score: Base score in [0, 1]
        modifier: Multiplicative modifier

    Returns:
        Modified score clamped to [0, 1]
    """
    modified = score * modifier
    return max(0.0, min(1.0, modified))


# =============================================================================
# MAIN COMPATIBILITY FUNCTIONS
# =============================================================================

def compute_bazi_component(
    wuxing: float,
    tengods: float,
    modifier: float,
    weights: WeightConfig
) -> float:
    """
    Compute BaZi compatibility component.

    Formula: [(1 - β) × WuXing + β × TenGods] × modifier

    Args:
        wuxing: Normalized WuXing (element) score
        tengods: Normalized TenGods score
        modifier: Clash/harmony modifier
        weights: Weight configuration

    Returns:
        BaZi component score in [0, 1]
    """
    raw = (1 - weights.tengods_weight) * wuxing + weights.tengods_weight * tengods
    return apply_modifier(raw, modifier)


def compute_western_component(
    archetype: float,
    pattern: float,
    element: float,
    weights: WeightConfig
) -> float:
    """
    Compute Western astrology component.

    Args:
        archetype: Normalized archetype similarity
        pattern: Normalized pattern similarity
        element: Normalized element compatibility
        weights: Weight configuration

    Returns:
        Western component score in [0, 1]
    """
    return (
        weights.archetype_weight * archetype +
        weights.pattern_weight * pattern +
        weights.element_weight * element
    )


def normalize_compatibility(
    scores: ComponentScores,
    weights: Optional[WeightConfig] = None
) -> NormalizedCompatibility:
    """
    Main entry point: normalize and combine all compatibility components.

    This implements the full GENESIS compatibility formula:
    Total = (1 - α - γ) × NEO + α × BaZi × modifier + γ × Western

    Args:
        scores: Raw component scores
        weights: Optional weight configuration

    Returns:
        NormalizedCompatibility with full breakdown
    """
    if weights is None:
        weights = WeightConfig()

    # Normalize all components
    neo_norm = normalize_neo_score(scores.neo_score)
    wuxing_norm = normalize_bazi_score(scores.bazi_wuxing)
    tengods_norm = normalize_bazi_score(scores.bazi_tengods)
    archetype_norm = normalize_western_score(scores.western_archetype)
    pattern_norm = normalize_western_score(scores.western_pattern)
    element_norm = normalize_western_score(scores.western_element)

    # Calculate BaZi modifier
    bazi_modifier = calculate_bazi_modifier(
        scores.bazi_clash_modifier,
        scores.bazi_harmony_modifier
    )

    # Compute component scores
    bazi_component = compute_bazi_component(
        wuxing_norm, tengods_norm, bazi_modifier, weights
    )
    western_component = compute_western_component(
        archetype_norm, pattern_norm, element_norm, weights
    )

    # Calculate contributions (weighted)
    neo_contribution = weights.neo_weight * neo_norm
    bazi_contribution = weights.bazi_weight * bazi_component
    western_contribution = weights.western_weight * western_component

    # Final score
    total = neo_contribution + bazi_contribution + western_contribution

    # Grade and interpretation
    grade = score_to_grade(total)
    interpretation = score_to_interpretation(total)

    return NormalizedCompatibility(
        total_score=total,
        neo_contribution=neo_contribution,
        bazi_contribution=bazi_contribution,
        western_contribution=western_contribution,
        neo_normalized=neo_norm,
        bazi_wuxing_normalized=wuxing_norm,
        bazi_tengods_normalized=tengods_norm,
        western_archetype_normalized=archetype_norm,
        western_pattern_normalized=pattern_norm,
        western_element_normalized=element_norm,
        bazi_modifier=bazi_modifier,
        weights=weights,
        grade=grade,
        interpretation=interpretation,
    )


# =============================================================================
# GRADING AND INTERPRETATION
# =============================================================================

def score_to_grade(score: float) -> str:
    """Convert normalized score to letter grade."""
    if score >= 0.95:
        return "A+"
    elif score >= 0.90:
        return "A"
    elif score >= 0.85:
        return "A-"
    elif score >= 0.80:
        return "B+"
    elif score >= 0.75:
        return "B"
    elif score >= 0.70:
        return "B-"
    elif score >= 0.65:
        return "C+"
    elif score >= 0.60:
        return "C"
    elif score >= 0.55:
        return "C-"
    elif score >= 0.50:
        return "D+"
    elif score >= 0.45:
        return "D"
    elif score >= 0.40:
        return "D-"
    else:
        return "F"


def score_to_interpretation(score: float) -> str:
    """Generate human-readable interpretation of compatibility score."""
    if score >= 0.90:
        return "Exceptional resonance - deep soul-level harmony across all dimensions."
    elif score >= 0.80:
        return "Strong compatibility - natural understanding and mutual support."
    elif score >= 0.70:
        return "Good compatibility - complementary energies with growth potential."
    elif score >= 0.60:
        return "Moderate compatibility - requires conscious bridging in some areas."
    elif score >= 0.50:
        return "Mixed compatibility - significant differences requiring adaptation."
    elif score >= 0.40:
        return "Challenging compatibility - fundamental differences in approach."
    else:
        return "Divergent patterns - transformative potential through conscious work."


# =============================================================================
# ADAPTIVE WEIGHT ADJUSTMENT
# =============================================================================

def adjust_weights_for_missing(
    scores: ComponentScores,
    base_weights: WeightConfig
) -> WeightConfig:
    """
    Adjust weights when some components are missing.

    Redistributes weight from missing components to available ones.

    Args:
        scores: Component scores (some may be None)
        base_weights: Base weight configuration

    Returns:
        Adjusted weights that sum to 1.0
    """
    has_neo = scores.has_neo()
    has_bazi = scores.has_bazi()
    has_western = scores.has_western()

    if has_neo and has_bazi and has_western:
        return base_weights  # All present, no adjustment

    # Calculate available weight
    available_weight = 0.0
    if has_neo:
        available_weight += base_weights.neo_weight
    if has_bazi:
        available_weight += base_weights.bazi_weight
    if has_western:
        available_weight += base_weights.western_weight

    if available_weight == 0:
        # Nothing available, return defaults
        return base_weights

    # Redistribute
    adjusted = WeightConfig(
        neo_weight=base_weights.neo_weight / available_weight if has_neo else 0.0,
        bazi_weight=base_weights.bazi_weight / available_weight if has_bazi else 0.0,
        western_weight=base_weights.western_weight / available_weight if has_western else 0.0,
        wuxing_weight=base_weights.wuxing_weight,
        tengods_weight=base_weights.tengods_weight,
        archetype_weight=base_weights.archetype_weight,
        pattern_weight=base_weights.pattern_weight,
        element_weight=base_weights.element_weight,
    )

    return adjusted


def normalize_compatibility_adaptive(
    scores: ComponentScores,
    base_weights: Optional[WeightConfig] = None
) -> NormalizedCompatibility:
    """
    Normalize compatibility with adaptive weight adjustment.

    Automatically handles missing components by redistributing weights.

    Args:
        scores: Component scores (some may be None)
        base_weights: Optional base weight configuration

    Returns:
        NormalizedCompatibility with adjusted weights
    """
    if base_weights is None:
        base_weights = WeightConfig()

    adjusted_weights = adjust_weights_for_missing(scores, base_weights)
    return normalize_compatibility(scores, adjusted_weights)


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Types
    "ComponentScores",
    "WeightConfig",
    "NormalizedCompatibility",

    # Main functions
    "normalize_compatibility",
    "normalize_compatibility_adaptive",

    # Component functions
    "compute_bazi_component",
    "compute_western_component",

    # Normalization utilities
    "normalize_score",
    "normalize_neo_score",
    "normalize_bazi_score",
    "normalize_western_score",

    # Modifier functions
    "calculate_bazi_modifier",
    "apply_modifier",

    # Grading
    "score_to_grade",
    "score_to_interpretation",

    # Weight adjustment
    "adjust_weights_for_missing",

    # Constants
    "DEFAULT_NEO_WEIGHT",
    "DEFAULT_BAZI_WEIGHT",
    "DEFAULT_WESTERN_WEIGHT",
]
