"""
Luna Fusion Vector Utilities
Normalization, clipping, blending, similarity functions

Used across all P4-P8 engines for 30-facet vector operations
"""

import numpy as np
from typing import Dict, List, Optional, Union
from .constants import DIMENSIONS_30, DOMAIN_RANGES, FACET_SHORT_CODES


def normalize_vector(vector: Union[List[float], np.ndarray],
                     target_sum: float = None) -> np.ndarray:
    """
    Normalize a 30-facet vector.

    Args:
        vector: Input vector (list or numpy array)
        target_sum: If provided, normalize to this sum. Otherwise L2 normalize.

    Returns:
        Normalized numpy array
    """
    arr = np.array(vector, dtype=np.float64)

    if target_sum is not None:
        # Sum normalization
        current_sum = np.sum(arr)
        if current_sum > 0:
            arr = arr * (target_sum / current_sum)
    else:
        # L2 normalization
        norm = np.linalg.norm(arr)
        if norm > 0:
            arr = arr / norm

    return arr


def clip_vector(vector: Union[List[float], np.ndarray],
                min_val: float = 0.0,
                max_val: float = 1.0) -> np.ndarray:
    """
    Clip vector values to specified range.

    Args:
        vector: Input vector
        min_val: Minimum allowed value
        max_val: Maximum allowed value

    Returns:
        Clipped numpy array
    """
    arr = np.array(vector, dtype=np.float64)
    return np.clip(arr, min_val, max_val)


def weighted_blend(vectors: List[np.ndarray],
                   weights: List[float]) -> np.ndarray:
    """
    Blend multiple vectors with weights.

    Args:
        vectors: List of 30-dim vectors
        weights: Corresponding weights (will be normalized to sum to 1)

    Returns:
        Blended 30-dim vector
    """
    if len(vectors) == 0:
        return np.zeros(DIMENSIONS_30)

    if len(vectors) != len(weights):
        raise ValueError("vectors and weights must have same length")

    # Normalize weights
    total_weight = sum(weights)
    if total_weight <= 0:
        return np.zeros(DIMENSIONS_30)

    normalized_weights = [w / total_weight for w in weights]

    # Weighted sum
    result = np.zeros(DIMENSIONS_30)
    for vec, weight in zip(vectors, normalized_weights):
        result += np.array(vec) * weight

    return result


def cosine_similarity(vec1: Union[List[float], np.ndarray],
                      vec2: Union[List[float], np.ndarray]) -> float:
    """
    Calculate cosine similarity between two vectors.

    Args:
        vec1: First vector
        vec2: Second vector

    Returns:
        Similarity score in range [-1, 1]
    """
    a = np.array(vec1, dtype=np.float64)
    b = np.array(vec2, dtype=np.float64)

    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(np.dot(a, b) / (norm_a * norm_b))


def euclidean_distance(vec1: Union[List[float], np.ndarray],
                       vec2: Union[List[float], np.ndarray]) -> float:
    """
    Calculate Euclidean distance between two vectors.

    Args:
        vec1: First vector
        vec2: Second vector

    Returns:
        Distance value
    """
    a = np.array(vec1, dtype=np.float64)
    b = np.array(vec2, dtype=np.float64)
    return float(np.linalg.norm(a - b))


def apply_domain_modifiers(vector: np.ndarray,
                           modifiers: Dict[str, float]) -> np.ndarray:
    """
    Apply domain-level modifiers (N_mod, E_mod, O_mod, A_mod, C_mod).

    Args:
        vector: 30-facet vector
        modifiers: Dict with keys like 'N_mod', 'E_mod', etc.

    Returns:
        Modified vector
    """
    result = vector.copy()

    domain_key_map = {
        'N_mod': 'N', 'N': 'N',
        'E_mod': 'E', 'E': 'E',
        'O_mod': 'O', 'O': 'O',
        'A_mod': 'A', 'A': 'A',
        'C_mod': 'C', 'C': 'C'
    }

    for key, value in modifiers.items():
        if key in domain_key_map:
            domain = domain_key_map[key]
            if domain in DOMAIN_RANGES:
                start, end = DOMAIN_RANGES[domain]
                result[start:end] += value

    return result


def apply_facet_modifiers(vector: np.ndarray,
                          facet_mods: Dict[str, float]) -> np.ndarray:
    """
    Apply specific facet-level modifiers.

    Args:
        vector: 30-facet vector
        facet_mods: Dict mapping facet codes to modifier values
                   e.g., {'E3': 0.15, 'N1': -0.10}

    Returns:
        Modified vector
    """
    result = vector.copy()

    for facet_code, modifier in facet_mods.items():
        # Handle both short codes (E3) and full names (E3_Assertiveness)
        idx = None
        if facet_code in FACET_SHORT_CODES:
            idx = FACET_SHORT_CODES[facet_code]
        elif '_' in facet_code:
            # Try extracting short code from full name
            short = facet_code.split('_')[0]
            if short in FACET_SHORT_CODES:
                idx = FACET_SHORT_CODES[short]

        if idx is not None:
            result[idx] += modifier

    return result


def create_zero_vector() -> np.ndarray:
    """Create a zero-initialized 30-facet vector."""
    return np.zeros(DIMENSIONS_30, dtype=np.float64)


def create_neutral_vector(value: float = 0.5) -> np.ndarray:
    """Create a neutral 30-facet vector (default 0.5 for all facets)."""
    return np.full(DIMENSIONS_30, value, dtype=np.float64)


def get_domain_scores(vector: np.ndarray) -> Dict[str, float]:
    """
    Calculate domain averages from 30-facet vector.

    Args:
        vector: 30-facet vector

    Returns:
        Dict with domain scores {'N': score, 'E': score, ...}
    """
    scores = {}
    for domain, (start, end) in DOMAIN_RANGES.items():
        scores[domain] = float(np.mean(vector[start:end]))
    return scores


def blend_with_delta(base_vector: np.ndarray,
                     delta_vector: np.ndarray,
                     weight: float) -> np.ndarray:
    """
    Add weighted delta to base vector.

    Used for applying aspect/transit/progression modifiers.

    Args:
        base_vector: Original personality vector
        delta_vector: Modifier vector (can have positive/negative values)
        weight: How much to apply (0.0 to 1.0)

    Returns:
        Modified vector (clipped to [0, 1])
    """
    result = base_vector + (delta_vector * weight)
    return clip_vector(result, 0.0, 1.0)


def calculate_orb_weight(actual_orb: float, max_orb: float) -> float:
    """
    Calculate orb-based weight for aspect strength.

    Exact aspect (0°) = 1.0, edge of orb = 0.3

    Args:
        actual_orb: Actual orb in degrees
        max_orb: Maximum allowed orb

    Returns:
        Weight from 0.3 to 1.0 (or 0 if outside orb)
    """
    if actual_orb >= max_orb:
        return 0.0

    exactness = 1.0 - (actual_orb / max_orb)
    return 0.3 + (0.7 * exactness)


def vector_to_dict(vector: np.ndarray,
                   include_domains: bool = True) -> dict:
    """
    Convert 30-facet vector to dictionary format.

    Args:
        vector: 30-facet vector
        include_domains: Whether to include domain averages

    Returns:
        Dict with facet values and optional domain averages
    """
    from .constants import FACET_NAMES

    result = {
        'facets': {name: float(vector[i]) for i, name in enumerate(FACET_NAMES)}
    }

    if include_domains:
        result['domains'] = get_domain_scores(vector)

    return result


def dict_to_vector(facet_dict: Dict[str, float]) -> np.ndarray:
    """
    Convert facet dictionary to 30-facet vector.

    Args:
        facet_dict: Dict mapping facet names/codes to values

    Returns:
        30-facet numpy array
    """
    from .constants import FACET_NAMES, FACET_INDEX_MAP

    vector = np.zeros(DIMENSIONS_30, dtype=np.float64)

    for key, value in facet_dict.items():
        idx = None
        if key in FACET_INDEX_MAP:
            idx = FACET_INDEX_MAP[key]
        elif key in FACET_SHORT_CODES:
            idx = FACET_SHORT_CODES[key]

        if idx is not None:
            vector[idx] = value

    return vector
