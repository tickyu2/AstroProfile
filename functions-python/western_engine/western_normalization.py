"""
western_engine/western_normalization.py

Normalization utilities for the Western Expression Vector system.

This module provides the mathematical normalization pipeline that ensures
archetype vectors remain valid and comparable after pattern modifications.

Pipeline: clamp → soft-normalize → L2 normalize

Usage:
    from western_engine.western_normalization import normalize_archetype_vector

    modified = apply_all_patterns_to_archetype(base_vector, patterns)
    normalized = normalize_archetype_vector(modified.modified_vector)
"""

from typing import List, Tuple, Optional
import math


# =============================================================================
# NORMALIZATION PARAMETERS
# =============================================================================

# Logistic soft-normalization parameters
SOFT_NORM_STEEPNESS = 10.0  # Controls sigmoid steepness
SOFT_NORM_MIDPOINT = 0.5   # Sigmoid midpoint

# Clamp boundaries
CLAMP_MIN = 0.0
CLAMP_MAX = 1.0

# L2 normalization target (optional)
L2_TARGET_NORM = 1.0


# =============================================================================
# BASIC VECTOR OPERATIONS
# =============================================================================

def clamp_value(x: float, min_val: float = CLAMP_MIN, max_val: float = CLAMP_MAX) -> float:
    """Clamp a single value to the specified range."""
    return max(min_val, min(max_val, x))


def clamp_vector(vec: List[float], min_val: float = CLAMP_MIN, max_val: float = CLAMP_MAX) -> List[float]:
    """Clamp all values in a vector to the specified range."""
    return [clamp_value(x, min_val, max_val) for x in vec]


def l2_norm(vec: List[float]) -> float:
    """Calculate L2 norm (Euclidean length) of a vector."""
    return math.sqrt(sum(x * x for x in vec))


def l2_normalize(vec: List[float], target_norm: float = L2_TARGET_NORM) -> List[float]:
    """
    Normalize vector to target L2 norm.

    Args:
        vec: Input vector
        target_norm: Desired L2 norm (default 1.0 for unit vector)

    Returns:
        Normalized vector with specified L2 norm
    """
    current_norm = l2_norm(vec)
    if current_norm == 0:
        return vec
    scale = target_norm / current_norm
    return [x * scale for x in vec]


def vector_add(a: List[float], b: List[float]) -> List[float]:
    """Add two vectors element-wise."""
    return [x + y for x, y in zip(a, b)]


def vector_scale(vec: List[float], scalar: float) -> List[float]:
    """Scale vector by a scalar."""
    return [x * scalar for x in vec]


def vector_subtract(a: List[float], b: List[float]) -> List[float]:
    """Subtract vector b from vector a element-wise."""
    return [x - y for x, y in zip(a, b)]


# =============================================================================
# SOFT NORMALIZATION (Logistic Sigmoid)
# =============================================================================

def logistic_sigmoid(x: float, steepness: float = SOFT_NORM_STEEPNESS, midpoint: float = SOFT_NORM_MIDPOINT) -> float:
    """
    Apply logistic sigmoid transformation.

    Maps any real number to (0, 1) with smooth transitions.
    The steepness controls how sharp the transition is.
    The midpoint controls where the 0.5 value occurs.

    Args:
        x: Input value
        steepness: Controls sigmoid steepness (higher = sharper)
        midpoint: Input value that maps to 0.5

    Returns:
        Value in (0, 1)
    """
    # Shift by midpoint and scale
    z = steepness * (x - midpoint)
    # Prevent overflow
    if z > 100:
        return 1.0
    if z < -100:
        return 0.0
    return 1.0 / (1.0 + math.exp(-z))


def soft_normalize_value(x: float, steepness: float = SOFT_NORM_STEEPNESS) -> float:
    """
    Soft-normalize a single value using logistic sigmoid.

    For values already in [0, 1], this maintains their relative ordering
    while smoothing extreme values toward the boundaries.

    Args:
        x: Input value
        steepness: Controls sigmoid steepness

    Returns:
        Soft-normalized value in (0, 1)
    """
    return logistic_sigmoid(x, steepness, midpoint=0.5)


def soft_normalize_vector(vec: List[float], steepness: float = SOFT_NORM_STEEPNESS) -> List[float]:
    """
    Apply soft normalization to entire vector.

    Each element is independently transformed through logistic sigmoid.
    """
    return [soft_normalize_value(x, steepness) for x in vec]


# =============================================================================
# FULL NORMALIZATION PIPELINE
# =============================================================================

def normalize_archetype_vector(
    vec: List[float],
    apply_clamp: bool = True,
    apply_soft_norm: bool = True,
    apply_l2_norm: bool = True,
    clamp_range: Tuple[float, float] = (CLAMP_MIN, CLAMP_MAX),
    soft_norm_steepness: float = SOFT_NORM_STEEPNESS,
    l2_target: float = L2_TARGET_NORM,
) -> List[float]:
    """
    Full normalization pipeline for archetype vectors.

    Pipeline: clamp → soft-normalize → L2 normalize

    This ensures the vector:
    1. Has no values outside valid bounds
    2. Has smooth, well-behaved values (no extreme outliers)
    3. Has consistent magnitude for cosine similarity comparisons

    Args:
        vec: Input archetype vector (16-dimensional)
        apply_clamp: Whether to clamp values to range
        apply_soft_norm: Whether to apply soft normalization
        apply_l2_norm: Whether to L2 normalize
        clamp_range: (min, max) for clamping
        soft_norm_steepness: Steepness for sigmoid
        l2_target: Target L2 norm

    Returns:
        Fully normalized 16-dimensional vector
    """
    result = list(vec)

    # Step 1: Clamp to valid range
    if apply_clamp:
        result = clamp_vector(result, clamp_range[0], clamp_range[1])

    # Step 2: Soft normalize (smooth extreme values)
    if apply_soft_norm:
        result = soft_normalize_vector(result, soft_norm_steepness)

    # Step 3: L2 normalize (consistent magnitude)
    if apply_l2_norm:
        result = l2_normalize(result, l2_target)

    return result


def normalize_for_compatibility(
    vec: List[float],
    preserve_magnitude: bool = False
) -> List[float]:
    """
    Normalize archetype vector specifically for compatibility scoring.

    For cosine similarity, we want:
    - Consistent direction comparison
    - Values in sensible range

    Args:
        vec: Input archetype vector
        preserve_magnitude: If True, skip L2 normalization

    Returns:
        Normalized vector suitable for cosine similarity
    """
    return normalize_archetype_vector(
        vec,
        apply_clamp=True,
        apply_soft_norm=True,
        apply_l2_norm=not preserve_magnitude,
    )


# =============================================================================
# PATTERN APPLICATION WITH NORMALIZATION
# =============================================================================

def apply_pattern_delta_normalized(
    base_vector: List[float],
    pattern_delta: List[float],
    pattern_strength: float,
    normalize_result: bool = True
) -> List[float]:
    """
    Apply a pattern influence delta to base vector with optional normalization.

    Formula: A_modified = A_base + (pattern_strength × pattern_delta)
    Then optionally normalize the result.

    Args:
        base_vector: Base archetype vector (16-dim)
        pattern_delta: Pattern influence vector (16-dim)
        pattern_strength: Strength of pattern (0.0 to 1.0)
        normalize_result: Whether to normalize the final result

    Returns:
        Modified (and optionally normalized) archetype vector
    """
    # Scale delta by pattern strength
    scaled_delta = vector_scale(pattern_delta, pattern_strength)

    # Add to base
    modified = vector_add(base_vector, scaled_delta)

    # Optionally normalize
    if normalize_result:
        modified = normalize_archetype_vector(modified)

    return modified


def apply_all_pattern_deltas_normalized(
    base_vector: List[float],
    pattern_deltas: dict,  # pattern_name -> delta vector
    pattern_strengths: dict,  # pattern_name -> strength
    normalize_result: bool = True
) -> Tuple[List[float], dict]:
    """
    Apply multiple pattern influence deltas to base vector.

    Formula: A_final = A_base + Σ(pattern_strength_i × pattern_delta_i)

    Args:
        base_vector: Base archetype vector (16-dim)
        pattern_deltas: Dict mapping pattern name to influence vector
        pattern_strengths: Dict mapping pattern name to strength (0-1)
        normalize_result: Whether to normalize the final result

    Returns:
        Tuple of (modified_vector, contributions_dict)
    """
    modified = list(base_vector)
    contributions = {}

    for pattern_name, delta in pattern_deltas.items():
        strength = pattern_strengths.get(pattern_name, 0.0)
        if strength > 0:
            scaled_delta = vector_scale(delta, strength)
            contributions[pattern_name] = scaled_delta
            modified = vector_add(modified, scaled_delta)

    if normalize_result:
        modified = normalize_archetype_vector(modified)

    return modified, contributions


# =============================================================================
# DIAGNOSTIC UTILITIES
# =============================================================================

def vector_stats(vec: List[float]) -> dict:
    """
    Calculate diagnostic statistics for a vector.

    Useful for debugging and monitoring the normalization pipeline.
    """
    if not vec:
        return {}

    return {
        'min': min(vec),
        'max': max(vec),
        'mean': sum(vec) / len(vec),
        'l2_norm': l2_norm(vec),
        'n_negative': sum(1 for x in vec if x < 0),
        'n_above_one': sum(1 for x in vec if x > 1),
        'dimension': len(vec),
    }


def compare_vectors(before: List[float], after: List[float]) -> dict:
    """
    Compare two vectors (e.g., before/after normalization).

    Returns diagnostic information about the transformation.
    """
    if len(before) != len(after):
        return {'error': 'Dimension mismatch'}

    diffs = vector_subtract(after, before)

    return {
        'before_stats': vector_stats(before),
        'after_stats': vector_stats(after),
        'max_change': max(abs(d) for d in diffs),
        'mean_change': sum(abs(d) for d in diffs) / len(diffs),
        'total_change': sum(d * d for d in diffs) ** 0.5,
    }


# =============================================================================
# CONVENIENCE EXPORTS
# =============================================================================

__all__ = [
    # Core normalization
    'normalize_archetype_vector',
    'normalize_for_compatibility',

    # Building blocks
    'clamp_value',
    'clamp_vector',
    'l2_norm',
    'l2_normalize',
    'soft_normalize_value',
    'soft_normalize_vector',
    'logistic_sigmoid',

    # Vector operations
    'vector_add',
    'vector_scale',
    'vector_subtract',

    # Pattern application
    'apply_pattern_delta_normalized',
    'apply_all_pattern_deltas_normalized',

    # Diagnostics
    'vector_stats',
    'compare_vectors',

    # Parameters
    'SOFT_NORM_STEEPNESS',
    'SOFT_NORM_MIDPOINT',
    'CLAMP_MIN',
    'CLAMP_MAX',
    'L2_TARGET_NORM',
]
