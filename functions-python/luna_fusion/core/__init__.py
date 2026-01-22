"""
Luna Fusion Core Module
Constants, utilities, and shared infrastructure
"""

from .constants import (
    DIMENSIONS_30,
    FACET_NAMES,
    FACET_INDEX_MAP,
    BASE_WEIGHTS,
    ASPECT_TYPES,
    ASPECT_ORBS,
    PLANETS
)
from .vector_utils import (
    normalize_vector,
    clip_vector,
    weighted_blend,
    cosine_similarity,
    apply_domain_modifiers
)

__all__ = [
    'DIMENSIONS_30',
    'FACET_NAMES',
    'FACET_INDEX_MAP',
    'BASE_WEIGHTS',
    'ASPECT_TYPES',
    'ASPECT_ORBS',
    'PLANETS',
    'normalize_vector',
    'clip_vector',
    'weighted_blend',
    'cosine_similarity',
    'apply_domain_modifiers'
]
