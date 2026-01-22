"""
Luna Fusion Package - Complete Personality Cathedral
P4-P8 Engines for Luna's Brain 7A/7B Architecture

Engines:
- P4: Natal Aspect Engine - Birth chart aspects → 30-facet modifiers
- P5: Transits Engine - Current sky → temporary influences
- P6: Synastry/Composite - Two-user compatibility + behavioral adjustments
- P7: Archetypes - 30-facet vector → 12 Jungian archetypes
- P8: Progressions - Secondary progressions + Progressed Moon
"""

from .core.constants import (
    DIMENSIONS_30,
    FACET_NAMES,
    BASE_WEIGHTS,
    ASPECT_TYPES,
    ASPECT_ORBS
)
from .core.vector_utils import (
    normalize_vector,
    clip_vector,
    weighted_blend,
    cosine_similarity
)

__version__ = '1.0.0'
__all__ = [
    'DIMENSIONS_30',
    'FACET_NAMES',
    'BASE_WEIGHTS',
    'ASPECT_TYPES',
    'ASPECT_ORBS',
    'normalize_vector',
    'clip_vector',
    'weighted_blend',
    'cosine_similarity'
]
