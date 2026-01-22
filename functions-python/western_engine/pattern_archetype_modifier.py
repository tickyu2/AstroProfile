"""
western_engine/pattern_archetype_modifier.py

Pattern-aware archetype modification for persona modeling.

This module provides the mathematical bridge between:
- Pattern strengths (0.0-1.0 values from aspect_calculator)
- The 16-axis archetype vector

Each aspect pattern modifies the base archetype vector according to its
psychological signature, producing a pattern-aware persona identity.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import math

from .models import PatternStrengths
from .constants import (
    PATTERN_INFLUENCE_VECTORS,
    PATTERN_ARCHETYPE_NAMES,
    PATTERN_INFLUENCE_WEIGHT,
    ARCHETYPE_AXES,
    SIGN_ARCHETYPE_VECTORS,
)
from .western_normalization import (
    normalize_archetype_vector,
    clamp_vector as norm_clamp_vector,
)


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class PatternModifiedArchetype:
    """Result of applying pattern strengths to an archetype vector."""
    base_vector: List[float]
    modified_vector: List[float]
    pattern_contributions: Dict[str, List[float]]  # Each pattern's contribution
    dominant_patterns: List[str]  # Patterns with strength > 0.3
    archetype_name: str  # e.g., "Natural Flow + Sacred Tension Archetype"
    dominant_axes: List[Tuple[str, float, str]]  # (axis_name, value, direction)


@dataclass
class PatternPersona:
    """Full persona model with pattern awareness."""
    sign: str
    sign_archetype: List[float]
    pattern_strengths: PatternStrengths
    pattern_modified_archetype: List[float]
    persona_narrative: str
    dominant_traits: List[Tuple[str, float, str]]
    pattern_signature: str  # e.g., "Flow-Dominant with Moderate Friction"


# =============================================================================
# VECTOR OPERATIONS
# =============================================================================

def normalize_vector(vec: List[float]) -> List[float]:
    """Normalize vector to unit length while preserving direction."""
    magnitude = math.sqrt(sum(x * x for x in vec))
    if magnitude == 0:
        return vec
    return [x / magnitude for x in vec]


def clamp_vector(vec: List[float], min_val: float = 0.0, max_val: float = 1.0) -> List[float]:
    """Clamp vector values to specified range. Default [0, 1] for unipolar axes."""
    return [max(min_val, min(max_val, x)) for x in vec]


def vector_add(a: List[float], b: List[float]) -> List[float]:
    """Add two vectors element-wise."""
    return [x + y for x, y in zip(a, b)]


def vector_scale(vec: List[float], scalar: float) -> List[float]:
    """Scale vector by a scalar."""
    return [x * scalar for x in vec]


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


# =============================================================================
# PATTERN MODIFICATION FUNCTIONS
# =============================================================================

def apply_pattern_to_archetype(
    base_vector: List[float],
    pattern_type: str,
    pattern_strength: float,
    influence_weight: float = PATTERN_INFLUENCE_WEIGHT
) -> List[float]:
    """
    Apply a single pattern's influence to an archetype vector.

    Args:
        base_vector: The 16-dimensional base archetype vector
        pattern_type: Name of the pattern (e.g., 'grand_trine')
        pattern_strength: Strength of the pattern (0.0-1.0)
        influence_weight: How strongly patterns modify the base (default 0.3)

    Returns:
        Modified 16-dimensional vector
    """
    if pattern_strength <= 0:
        return base_vector

    influence = PATTERN_INFLUENCE_VECTORS.get(pattern_type)
    if not influence:
        return base_vector

    # Scale influence by pattern strength and global weight
    scaled_influence = vector_scale(influence, pattern_strength * influence_weight)

    # Add to base vector
    modified = vector_add(base_vector, scaled_influence)

    # Clamp to valid range [-1, 1]
    return clamp_vector(modified)


def apply_all_patterns_to_archetype(
    base_vector: List[float],
    patterns: PatternStrengths,
    influence_weight: float = PATTERN_INFLUENCE_WEIGHT
) -> PatternModifiedArchetype:
    """
    Apply all pattern strengths to modify an archetype vector.

    This is the main function for pattern-aware persona modeling.

    Args:
        base_vector: The 16-dimensional base archetype vector (from sign)
        patterns: PatternStrengths object with all pattern strengths
        influence_weight: How strongly patterns modify the base

    Returns:
        PatternModifiedArchetype with full modification details
    """
    modified = list(base_vector)
    contributions: Dict[str, List[float]] = {}
    dominant_patterns: List[str] = []

    pattern_dict = patterns.to_dict()

    for pattern_type, strength in pattern_dict.items():
        if strength <= 0:
            continue

        influence = PATTERN_INFLUENCE_VECTORS.get(pattern_type)
        if not influence:
            continue

        # Track dominant patterns (strength > 0.3)
        if strength > 0.3:
            dominant_patterns.append(pattern_type)

        # Calculate this pattern's contribution
        scaled = vector_scale(influence, strength * influence_weight)
        contributions[pattern_type] = scaled

        # Apply to modified vector
        modified = vector_add(modified, scaled)

    # Clamp final result
    modified = clamp_vector(modified)

    # Build archetype name
    if dominant_patterns:
        names = [PATTERN_ARCHETYPE_NAMES.get(p, p) for p in dominant_patterns[:2]]
        archetype_name = " + ".join(names)
    else:
        archetype_name = "Base Archetype"

    # Find dominant axes
    dominant_axes = get_dominant_axes(modified)

    return PatternModifiedArchetype(
        base_vector=base_vector,
        modified_vector=modified,
        pattern_contributions=contributions,
        dominant_patterns=dominant_patterns,
        archetype_name=archetype_name,
        dominant_axes=dominant_axes,
    )


def get_dominant_axes(vector: List[float], threshold: float = 0.6) -> List[Tuple[str, float, str]]:
    """
    Find the most dominant (highest value) axes in a vector.

    For unipolar axes [0, 1], higher values indicate stronger expression.

    Returns list of (axis_name, value, strength_level) tuples, sorted by value.
    """
    axes = []
    for i, value in enumerate(vector):
        if value >= threshold:
            axis_name = ARCHETYPE_AXES[i] if i < len(ARCHETYPE_AXES) else f"Axis_{i}"
            # Determine strength level
            if value >= 0.8:
                strength = "Very High"
            elif value >= 0.6:
                strength = "High"
            else:
                strength = "Moderate"
            axes.append((axis_name, value, strength))

    # Sort by value, descending
    axes.sort(key=lambda x: x[1], reverse=True)
    return axes


# =============================================================================
# PERSONA MODELING
# =============================================================================

def build_pattern_persona(
    sign: str,
    patterns: PatternStrengths,
    influence_weight: float = PATTERN_INFLUENCE_WEIGHT
) -> PatternPersona:
    """
    Build a complete pattern-aware persona from sign and patterns.

    Args:
        sign: Zodiac sign (e.g., "Taurus")
        patterns: PatternStrengths from aspect pattern detection
        influence_weight: How strongly patterns modify the base archetype

    Returns:
        PatternPersona with full persona model
    """
    # Get base sign archetype
    base_vector = SIGN_ARCHETYPE_VECTORS.get(sign, [0.0] * 16)

    # Apply patterns
    modified = apply_all_patterns_to_archetype(base_vector, patterns, influence_weight)

    # Generate pattern signature
    signature = generate_pattern_signature(patterns)

    # Generate narrative
    narrative = generate_persona_narrative(sign, patterns, modified)

    return PatternPersona(
        sign=sign,
        sign_archetype=base_vector,
        pattern_strengths=patterns,
        pattern_modified_archetype=modified.modified_vector,
        persona_narrative=narrative,
        dominant_traits=modified.dominant_axes,
        pattern_signature=signature,
    )


def generate_pattern_signature(patterns: PatternStrengths) -> str:
    """
    Generate a human-readable pattern signature.

    Examples:
        - "Flow-Dominant with Moderate Friction"
        - "Destiny-Marked Specialist"
        - "Paradox Navigator with Mission Activation"
    """
    pattern_dict = patterns.to_dict()

    # Classify pattern strengths
    dominant = [k for k, v in pattern_dict.items() if v >= 0.6]
    strong = [k for k, v in pattern_dict.items() if 0.4 <= v < 0.6]
    moderate = [k for k, v in pattern_dict.items() if 0.2 <= v < 0.4]

    # Pattern name mappings for signatures
    short_names = {
        'grand_trine': 'Flow',
        't_square': 'Friction',
        'stellium': 'Focus',
        'yod': 'Destiny',
        'kite': 'Mission',
        'opposition_chain': 'Paradox',
    }

    parts = []

    if dominant:
        names = [short_names.get(p, p.title()) for p in dominant]
        parts.append(f"{'-'.join(names)}-Dominant")

    if strong:
        names = [short_names.get(p, p.title()) for p in strong]
        if dominant:
            parts.append(f"with {'-'.join(names)} Activation")
        else:
            parts.append(f"{'-'.join(names)}-Strong")

    if moderate and not (dominant or strong):
        names = [short_names.get(p, p.title()) for p in moderate]
        parts.append(f"Moderate {'-'.join(names)}")

    if not parts:
        return "Balanced Pattern Distribution"

    return " ".join(parts)


def generate_persona_narrative(
    sign: str,
    patterns: PatternStrengths,
    modified: PatternModifiedArchetype
) -> str:
    """
    Generate a mythic persona narrative from sign and patterns.
    """
    lines = []

    # Opening based on dominant patterns
    if patterns.grand_trine > 0.5:
        lines.append(f"In the soul of {sign}, rivers flow through ancient channels.")

    if patterns.stellium > 0.5:
        lines.append(f"One chamber of the cathedral holds many voices singing the same note.")

    if patterns.kite > 0.4:
        lines.append(f"The flow catches wind and becomes a banner visible from far away.")

    if patterns.t_square > 0.3:
        lines.append(f"Sacred friction keeps the structure alive, never fully at rest.")

    if patterns.yod > 0.2:
        lines.append(f"Somewhere in the vault, a finger of light points to a single stone.")

    if patterns.opposition_chain > 0.2:
        lines.append(f"The corridor of mirrors reflects both faces of every truth.")

    # Trait synthesis
    if modified.dominant_axes:
        traits = ", ".join([f"{d[2]}" for d in modified.dominant_axes[:3]])
        lines.append(f"The dominant energies are: {traits}.")

    # Pattern signature
    if modified.dominant_patterns:
        names = [PATTERN_ARCHETYPE_NAMES.get(p, p) for p in modified.dominant_patterns]
        lines.append(f"This is the {' and '.join(names)}.")

    return " ".join(lines) if lines else f"A {sign} soul with balanced patterns."


# =============================================================================
# COMPATIBILITY FUNCTIONS
# =============================================================================

def calculate_pattern_similarity(
    patterns_a: PatternStrengths,
    patterns_b: PatternStrengths
) -> float:
    """
    Calculate cosine similarity between two pattern strength vectors.

    This is used in compatibility scoring to determine how similarly
    two people move through life (their psychological geometry).

    Args:
        patterns_a: PatternStrengths for person A
        patterns_b: PatternStrengths for person B

    Returns:
        Similarity score from 0.0 to 1.0
    """
    vec_a = patterns_a.to_vector()
    vec_b = patterns_b.to_vector()

    # Cosine similarity, shifted to 0-1 range
    sim = cosine_similarity(vec_a, vec_b)
    return (sim + 1) / 2  # Map from [-1,1] to [0,1]


def interpret_pattern_similarity(similarity: float) -> str:
    """
    Generate interpretation text for pattern similarity score.

    Args:
        similarity: Value from 0.0 to 1.0

    Returns:
        Human-readable interpretation
    """
    if similarity >= 0.8:
        return "We move through life the same way - deep structural resonance."
    elif similarity >= 0.6:
        return "We understand each other's rhythm - compatible geometries."
    elif similarity >= 0.4:
        return "We have different but complementary patterns - growth potential."
    elif similarity >= 0.2:
        return "We grow in different geometries - requires conscious bridging."
    else:
        return "Our patterns diverge significantly - challenging but potentially transformative."


def calculate_archetype_compatibility(
    archetype_a: List[float],
    archetype_b: List[float]
) -> Tuple[float, List[Tuple[str, float]]]:
    """
    Calculate compatibility between two pattern-modified archetype vectors.

    Returns both overall similarity and significant axis differences.
    """
    similarity = cosine_similarity(archetype_a, archetype_b)
    similarity_normalized = (similarity + 1) / 2  # Map to 0-1

    # Find significant differences
    differences = []
    for i, (a, b) in enumerate(zip(archetype_a, archetype_b)):
        diff = abs(a - b)
        if diff > 0.5:  # Significant difference
            axis = ARCHETYPE_AXES[i] if i < len(ARCHETYPE_AXES) else f"Axis_{i}"
            differences.append((axis, diff))

    differences.sort(key=lambda x: x[1], reverse=True)

    return similarity_normalized, differences[:5]


# =============================================================================
# MAIN ENTRY POINTS
# =============================================================================

def derive_pattern_aware_archetype(
    sign: str,
    patterns: PatternStrengths
) -> Dict:
    """
    Main entry point: derive a complete pattern-aware archetype.

    Returns a dictionary suitable for JSON serialization.
    """
    persona = build_pattern_persona(sign, patterns)

    return {
        'sign': persona.sign,
        'pattern_signature': persona.pattern_signature,
        'pattern_strengths': patterns.to_dict(),
        'base_archetype': persona.sign_archetype,
        'modified_archetype': persona.pattern_modified_archetype,
        'dominant_traits': [
            {'axis': t[0], 'value': t[1], 'direction': t[2]}
            for t in persona.dominant_traits
        ],
        'narrative': persona.persona_narrative,
    }


def derive_pattern_compatibility(
    patterns_a: PatternStrengths,
    patterns_b: PatternStrengths,
    sign_a: str,
    sign_b: str
) -> Dict:
    """
    Derive pattern-based compatibility between two charts.

    Returns a dictionary with pattern similarity and archetype compatibility.
    """
    # Pattern similarity
    pattern_sim = calculate_pattern_similarity(patterns_a, patterns_b)
    pattern_interp = interpret_pattern_similarity(pattern_sim)

    # Build modified archetypes
    persona_a = build_pattern_persona(sign_a, patterns_a)
    persona_b = build_pattern_persona(sign_b, patterns_b)

    # Archetype compatibility
    arch_sim, differences = calculate_archetype_compatibility(
        persona_a.pattern_modified_archetype,
        persona_b.pattern_modified_archetype
    )

    return {
        'pattern_similarity': pattern_sim,
        'pattern_interpretation': pattern_interp,
        'archetype_similarity': arch_sim,
        'significant_differences': [
            {'axis': d[0], 'difference': d[1]}
            for d in differences
        ],
        'signature_a': persona_a.pattern_signature,
        'signature_b': persona_b.pattern_signature,
        'combined_narrative': generate_compatibility_narrative(
            persona_a, persona_b, pattern_sim
        ),
    }


def generate_compatibility_narrative(
    persona_a: PatternPersona,
    persona_b: PatternPersona,
    pattern_sim: float
) -> str:
    """Generate a narrative about how two pattern-aware personas interact."""
    lines = []

    if pattern_sim >= 0.7:
        lines.append(f"The {persona_a.sign} and {persona_b.sign} share similar psychological geometry.")
        lines.append("Their rivers flow in the same direction.")
    elif pattern_sim >= 0.4:
        lines.append(f"The {persona_a.sign} and {persona_b.sign} have complementary patterns.")
        lines.append("Where one has flow, the other may have friction - this creates dynamic exchange.")
    else:
        lines.append(f"The {persona_a.sign} and {persona_b.sign} move through life differently.")
        lines.append("This requires conscious bridging but offers transformation potential.")

    # Pattern-specific insights
    if (persona_a.pattern_strengths.grand_trine > 0.5 and
        persona_b.pattern_strengths.t_square > 0.4):
        lines.append("One brings natural ease, the other brings sacred friction - a growth catalyst.")

    if (persona_a.pattern_strengths.yod > 0.3 and
        persona_b.pattern_strengths.yod > 0.3):
        lines.append("Both carry the finger of destiny - fate has designs for this connection.")

    return " ".join(lines)
