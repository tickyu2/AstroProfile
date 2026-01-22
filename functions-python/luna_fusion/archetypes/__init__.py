"""
Luna Fusion Archetypes Module
P7 Archetypal Narrative Layer - 12 Jungian Archetypes
"""

from .archetype_engine import (
    vector_to_archetypes,
    get_dominant_archetypes,
    ARCHETYPES,
    ARCHETYPE_SIGNATURES
)
from .narrative_templates import (
    get_archetype_narrative,
    get_combination_narrative,
    ARCHETYPE_NARRATIVES
)

__all__ = [
    'vector_to_archetypes',
    'get_dominant_archetypes',
    'ARCHETYPES',
    'ARCHETYPE_SIGNATURES',
    'get_archetype_narrative',
    'get_combination_narrative',
    'ARCHETYPE_NARRATIVES'
]
