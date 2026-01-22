"""
unified_engine/unified_fusion.py

Cross-System Fusion Normalizer for GENESIS Unified Metaphysics Engine.

Combines BaZi and Western astrology vectors into a single unified vector space
suitable for holistic compatibility scoring and persona modeling.

Formula: unified_vector = α × normalized_western + β × normalized_bazi
         where α + β = 1.0 (default: α=0.5, β=0.5)

The fusion creates a coherent metaphysical identity that captures both
Eastern and Western astrological signatures.
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
import math

from .bazi_normalization import NormalizedBaZiVector, normalize_bazi_chart


# =============================================================================
# FUSION CONSTANTS
# =============================================================================

# Default fusion weights
DEFAULT_WESTERN_WEIGHT = 0.5
DEFAULT_BAZI_WEIGHT = 0.5

# Western vector expected dimension (from western_engine)
WESTERN_ARCHETYPE_DIM = 16  # 16-axis archetype system
WESTERN_PATTERN_DIM = 6     # Pattern strengths
WESTERN_ELEMENT_DIM = 4     # Fire, Earth, Air, Water
WESTERN_MODALITY_DIM = 3    # Cardinal, Fixed, Mutable
WESTERN_HOUSE_DIM = 12      # House intensities
WESTERN_PLANET_DIM = 10     # Planetary weights

# Total Western dimensions (simplified to archetype + patterns)
WESTERN_CORE_DIM = WESTERN_ARCHETYPE_DIM + WESTERN_PATTERN_DIM  # 22

# BaZi vector dimension (from bazi_normalization)
BAZI_CORE_DIM = 61  # Without luck pillar
BAZI_FULL_DIM = 64  # With luck pillar


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class UnifiedVector:
    """
    Unified metaphysical vector combining Western and BaZi signatures.

    This is the core data structure for cross-system analysis.
    """
    # Source vectors (preserved for debugging/explainability)
    western_archetype: List[float]   # 16-dim archetype
    western_patterns: List[float]    # 6-dim pattern strengths
    bazi_vector: List[float]         # 61-64 dim BaZi

    # Fusion weights used
    western_weight: float
    bazi_weight: float

    # Fused unified vector
    unified: List[float]

    # Metadata
    western_dimension: int = 0
    bazi_dimension: int = 0
    unified_dimension: int = 0

    def __post_init__(self):
        """Calculate dimensions after initialization."""
        self.western_dimension = len(self.western_archetype) + len(self.western_patterns)
        self.bazi_dimension = len(self.bazi_vector)
        self.unified_dimension = len(self.unified)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "western_archetype": self.western_archetype,
            "western_patterns": self.western_patterns,
            "bazi_vector": self.bazi_vector,
            "unified": self.unified,
            "weights": {
                "western": self.western_weight,
                "bazi": self.bazi_weight,
            },
            "dimensions": {
                "western": self.western_dimension,
                "bazi": self.bazi_dimension,
                "unified": self.unified_dimension,
            },
        }


@dataclass
class FusionConfig:
    """Configuration for vector fusion."""
    western_weight: float = DEFAULT_WESTERN_WEIGHT
    bazi_weight: float = DEFAULT_BAZI_WEIGHT
    normalize_output: bool = True
    include_patterns: bool = True
    include_extended_western: bool = False  # Elements, modalities, houses

    def __post_init__(self):
        """Ensure weights sum to 1.0."""
        total = self.western_weight + self.bazi_weight
        if total != 1.0:
            self.western_weight /= total
            self.bazi_weight /= total


# =============================================================================
# NORMALIZATION UTILITIES
# =============================================================================

def l2_normalize(vec: List[float]) -> List[float]:
    """Normalize vector to unit L2 norm."""
    norm = math.sqrt(sum(x * x for x in vec))
    if norm == 0:
        return vec
    return [x / norm for x in vec]


def min_max_normalize(vec: List[float]) -> List[float]:
    """Normalize vector to [0, 1] range using min-max scaling."""
    if not vec:
        return vec
    min_val = min(vec)
    max_val = max(vec)
    if max_val == min_val:
        return [0.5] * len(vec)
    return [(x - min_val) / (max_val - min_val) for x in vec]


def weighted_concatenate(
    vec_a: List[float],
    vec_b: List[float],
    weight_a: float,
    weight_b: float
) -> List[float]:
    """
    Concatenate two vectors with weights applied to each section.

    This preserves the dimensional structure while applying relative importance.
    """
    scaled_a = [x * weight_a for x in vec_a]
    scaled_b = [x * weight_b for x in vec_b]
    return scaled_a + scaled_b


def weighted_blend(
    vec_a: List[float],
    vec_b: List[float],
    weight_a: float,
    weight_b: float
) -> List[float]:
    """
    Blend two vectors of equal dimension with weights.

    For vectors of different dimensions, pads shorter with zeros.
    """
    max_len = max(len(vec_a), len(vec_b))

    # Pad if needed
    padded_a = vec_a + [0.0] * (max_len - len(vec_a))
    padded_b = vec_b + [0.0] * (max_len - len(vec_b))

    return [weight_a * a + weight_b * b for a, b in zip(padded_a, padded_b)]


# =============================================================================
# WESTERN VECTOR PREPARATION
# =============================================================================

def prepare_western_vector(
    archetype: List[float],
    patterns: Optional[Dict[str, float]] = None,
    include_patterns: bool = True,
) -> Tuple[List[float], List[float]]:
    """
    Prepare Western astrology vector for fusion.

    Args:
        archetype: 16-dimensional archetype vector
        patterns: Optional pattern strengths dict
        include_patterns: Whether to include pattern vector

    Returns:
        Tuple of (archetype_vector, pattern_vector)
    """
    # Ensure archetype is 16-dim
    archetype_vec = list(archetype)
    if len(archetype_vec) < WESTERN_ARCHETYPE_DIM:
        archetype_vec += [0.0] * (WESTERN_ARCHETYPE_DIM - len(archetype_vec))
    elif len(archetype_vec) > WESTERN_ARCHETYPE_DIM:
        archetype_vec = archetype_vec[:WESTERN_ARCHETYPE_DIM]

    # Pattern vector
    pattern_vec = [0.0] * WESTERN_PATTERN_DIM
    if include_patterns and patterns:
        pattern_order = [
            "grand_trine", "t_square", "stellium",
            "yod", "kite", "opposition_chain"
        ]
        for i, pattern_name in enumerate(pattern_order):
            if i < len(pattern_vec):
                pattern_vec[i] = patterns.get(pattern_name, 0.0)

    return archetype_vec, pattern_vec


# =============================================================================
# FUSION FUNCTIONS
# =============================================================================

def fuse_vectors(
    western_archetype: List[float],
    western_patterns: List[float],
    bazi_vector: List[float],
    config: Optional[FusionConfig] = None,
) -> UnifiedVector:
    """
    Fuse Western and BaZi vectors into unified metaphysical vector.

    Args:
        western_archetype: 16-dim Western archetype vector
        western_patterns: 6-dim pattern strengths vector
        bazi_vector: 61-64 dim normalized BaZi vector
        config: Fusion configuration

    Returns:
        UnifiedVector with fused representation
    """
    if config is None:
        config = FusionConfig()

    # Combine Western components
    western_combined = list(western_archetype)
    if config.include_patterns:
        western_combined += list(western_patterns)

    # Create weighted concatenation
    unified = weighted_concatenate(
        western_combined,
        bazi_vector,
        config.western_weight,
        config.bazi_weight
    )

    # Optionally normalize the output
    if config.normalize_output:
        unified = l2_normalize(unified)

    return UnifiedVector(
        western_archetype=list(western_archetype),
        western_patterns=list(western_patterns),
        bazi_vector=list(bazi_vector),
        western_weight=config.western_weight,
        bazi_weight=config.bazi_weight,
        unified=unified,
    )


def create_unified_vector(
    western_data: Dict[str, Any],
    bazi_chart: Dict[str, Any],
    current_age: Optional[int] = None,
    config: Optional[FusionConfig] = None,
) -> UnifiedVector:
    """
    Main entry point: create unified vector from raw Western and BaZi data.

    Args:
        western_data: Western analysis result with 'archetype' and 'patterns'
        bazi_chart: BaZi chart dictionary
        current_age: Age for luck pillar calculation
        config: Fusion configuration

    Returns:
        UnifiedVector ready for compatibility scoring
    """
    if config is None:
        config = FusionConfig()

    # Extract and prepare Western components
    western_archetype = western_data.get("modified_archetype", [])
    if not western_archetype:
        western_archetype = western_data.get("archetype", [])
    if not western_archetype:
        western_archetype = western_data.get("base_archetype", [0.0] * WESTERN_ARCHETYPE_DIM)

    patterns = western_data.get("pattern_strengths", {})
    western_arch, western_pat = prepare_western_vector(
        western_archetype,
        patterns,
        config.include_patterns
    )

    # Normalize BaZi chart
    bazi_normalized = normalize_bazi_chart(bazi_chart, current_age)
    bazi_vec = bazi_normalized.to_vector()

    # Fuse
    return fuse_vectors(western_arch, western_pat, bazi_vec, config)


# =============================================================================
# SIMILARITY FUNCTIONS
# =============================================================================

def unified_cosine_similarity(vec_a: UnifiedVector, vec_b: UnifiedVector) -> float:
    """
    Calculate cosine similarity between two unified vectors.

    Args:
        vec_a: First unified vector
        vec_b: Second unified vector

    Returns:
        Similarity score in [0, 1]
    """
    a = vec_a.unified
    b = vec_b.unified

    # Handle dimension mismatch
    min_len = min(len(a), len(b))
    a = a[:min_len]
    b = b[:min_len]

    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        return 0.5  # Neutral for zero vectors

    cosine = dot / (norm_a * norm_b)
    # Map from [-1, 1] to [0, 1]
    return (cosine + 1) / 2


def component_similarities(vec_a: UnifiedVector, vec_b: UnifiedVector) -> Dict[str, float]:
    """
    Calculate similarity for each component separately.

    Returns breakdown of Western archetype, patterns, and BaZi similarities.
    """
    def cosine(a: List[float], b: List[float]) -> float:
        min_len = min(len(a), len(b))
        a, b = a[:min_len], b[:min_len]
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.5
        return (dot / (norm_a * norm_b) + 1) / 2

    return {
        "western_archetype": cosine(vec_a.western_archetype, vec_b.western_archetype),
        "western_patterns": cosine(vec_a.western_patterns, vec_b.western_patterns),
        "bazi": cosine(vec_a.bazi_vector, vec_b.bazi_vector),
        "unified": unified_cosine_similarity(vec_a, vec_b),
    }


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Types
    "UnifiedVector",
    "FusionConfig",

    # Main functions
    "fuse_vectors",
    "create_unified_vector",

    # Similarity functions
    "unified_cosine_similarity",
    "component_similarities",

    # Utilities
    "prepare_western_vector",
    "l2_normalize",
    "min_max_normalize",
    "weighted_concatenate",
    "weighted_blend",

    # Constants
    "DEFAULT_WESTERN_WEIGHT",
    "DEFAULT_BAZI_WEIGHT",
    "WESTERN_ARCHETYPE_DIM",
    "WESTERN_PATTERN_DIM",
]
