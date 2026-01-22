"""
western_engine/__init__.py

Western Cusp Engine - Complete Western Astrology calculations.

This engine produces a 72-dimensional Western Expression Vector for:
- Compatibility scoring via cosine similarity
- Persona modeling
- Cross-system fusion with BaZi

Enhanced with 16-axis archetype system for deeper psychological mapping.

Architecture follows the BaZi Engine pattern:
- Frozen dataclasses for type safety
- Modular calculation files
- JSON-serializable output
"""

from .models import (
    WesternExpressionVector,
    ChartShapeResult,
    AspectResult,
    AspectPatternResult,
    PlanetPosition,
    HouseCusps,
    WesternChart,
    SynastryResult,
    WesternCompatibilityScore,
    # Enhanced models
    EnhancedWesternExpressionVector,
    RawChart,
    EnhancedCompatibilityScore,
    create_planet_position,
    create_default_expression_vector,
    # Professional aspect detection models
    DetectedAspect,
    PatternStrengths,
)

from .constants import (
    ZODIAC_SIGNS,
    SIGN_ELEMENT,
    SIGN_MODALITY,
    SIGN_POLARITY,
    PLANET_WEIGHTS,
    ASPECT_TYPES,
    ASPECT_ORBS,
    CHART_SHAPES,
    # 16-axis archetype system
    ARCHETYPE_AXES,
    SIGN_ARCHETYPE_VECTORS,
    CUSP_ZONES,
    SYNASTRY_OVERLAY_MEANINGS,
    ENHANCED_SECTION_WEIGHTS,
    DEFAULT_GAMMA,
    # Pattern influence vectors (for archetype modification)
    PATTERN_INFLUENCE_VECTORS,
    PATTERN_ARCHETYPE_NAMES,
    PATTERN_INFLUENCE_WEIGHT,
)

from .expression_vector import (
    build_western_expression_vector,
    analyze_western
)

from .house_calculator import (
    calculate_porphyry_houses,
    get_house_for_degree
)

from .aspect_calculator import (
    calculate_aspects,
    detect_aspect_patterns,
    # Professional orb-aware detection
    detect_aspects_from_longitudes,
    calculate_aspects_from_swiss,
    detect_pattern_strengths,
    detect_patterns_from_swiss,
)

from .chart_shape_detector import (
    detect_chart_shape
)

from .planetary_psychology import (
    calculate_planetary_psychology
)

from .archetype_calculator import (
    get_sign_archetype,
    blend_archetypes,
    calculate_cusp_blend_weight,
    calculate_planet_archetype_vector,
    build_planet_full_vector,
    calculate_chart_archetype,
    calculate_archetype_similarity,
    get_dominant_archetype_traits,
    calculate_synastry_receptivity,
    derive_planet_vectors,
    explain_archetype_vector
)

from .derive_western_expression import (
    derive_western_expression,
    compute_enhanced_compatibility,
    quick_archetype_comparison,
    get_archetype_profile,
    derive_elements,
    derive_modalities,
    derive_houses
)

from .swiss_adapter import (
    swiss_to_raw_chart,
    swiss_to_enhanced_expression,
    calculate_aspects_from_planets,
    detect_chart_shape_from_planets,
    detect_aspect_patterns,
    find_house_for_longitude
)

from .visualization import (
    plot_pattern_strengths,
    plot_pattern_comparison,
    plot_aspect_network,
    print_pattern_summary,
)

from .pattern_interpretation import (
    PatternInterpretation,
    interpret_pattern,
    interpret_all_patterns,
    synthesize_archetype,
    generate_pattern_reading,
    PATTERN_ARCHETYPES,
    STRENGTH_THRESHOLDS,
    strength_level,
)

from .pattern_archetype_modifier import (
    PatternModifiedArchetype,
    PatternPersona,
    apply_pattern_to_archetype,
    apply_all_patterns_to_archetype,
    build_pattern_persona,
    calculate_pattern_similarity,
    calculate_archetype_compatibility,
    interpret_pattern_similarity,
    derive_pattern_aware_archetype,
    derive_pattern_compatibility,
)

from .western_normalization import (
    # Core normalization
    normalize_archetype_vector,
    normalize_for_compatibility,
    # Building blocks
    clamp_value,
    clamp_vector,
    l2_norm,
    l2_normalize,
    soft_normalize_value,
    soft_normalize_vector,
    logistic_sigmoid,
    # Pattern application with normalization
    apply_pattern_delta_normalized,
    apply_all_pattern_deltas_normalized,
    # Diagnostics
    vector_stats,
    compare_vectors,
    # Parameters
    SOFT_NORM_STEEPNESS,
    CLAMP_MIN,
    CLAMP_MAX,
    L2_TARGET_NORM,
)

__all__ = [
    # Models
    'WesternExpressionVector',
    'ChartShapeResult',
    'AspectResult',
    'AspectPatternResult',
    'PlanetPosition',
    'HouseCusps',
    'WesternChart',
    'SynastryResult',
    'WesternCompatibilityScore',
    # Enhanced models
    'EnhancedWesternExpressionVector',
    'RawChart',
    'EnhancedCompatibilityScore',
    'create_planet_position',
    'create_default_expression_vector',
    # Professional aspect detection models
    'DetectedAspect',
    'PatternStrengths',

    # Constants
    'ZODIAC_SIGNS',
    'SIGN_ELEMENT',
    'SIGN_MODALITY',
    'SIGN_POLARITY',
    'PLANET_WEIGHTS',
    'ASPECT_TYPES',
    'ASPECT_ORBS',
    'CHART_SHAPES',
    # 16-axis archetype system
    'ARCHETYPE_AXES',
    'SIGN_ARCHETYPE_VECTORS',
    'CUSP_ZONES',
    'SYNASTRY_OVERLAY_MEANINGS',
    'ENHANCED_SECTION_WEIGHTS',
    'DEFAULT_GAMMA',

    # Functions - Base
    'build_western_expression_vector',
    'analyze_western',
    'calculate_porphyry_houses',
    'get_house_for_degree',
    'calculate_aspects',
    'detect_aspect_patterns',
    'detect_chart_shape',
    'calculate_planetary_psychology',

    # Functions - Professional orb-aware aspect detection
    'detect_aspects_from_longitudes',
    'calculate_aspects_from_swiss',
    'detect_pattern_strengths',
    'detect_patterns_from_swiss',

    # Functions - Archetype system
    'get_sign_archetype',
    'blend_archetypes',
    'calculate_cusp_blend_weight',
    'calculate_planet_archetype_vector',
    'build_planet_full_vector',
    'calculate_chart_archetype',
    'calculate_archetype_similarity',
    'get_dominant_archetype_traits',
    'calculate_synastry_receptivity',
    'derive_planet_vectors',
    'explain_archetype_vector',

    # Functions - Enhanced derivation
    'derive_western_expression',
    'compute_enhanced_compatibility',
    'quick_archetype_comparison',
    'get_archetype_profile',
    'derive_elements',
    'derive_modalities',
    'derive_houses',

    # Functions - Swiss adapter
    'swiss_to_raw_chart',
    'swiss_to_enhanced_expression',
    'calculate_aspects_from_planets',
    'detect_chart_shape_from_planets',
    'detect_aspect_patterns',
    'find_house_for_longitude',

    # Functions - Visualization
    'plot_pattern_strengths',
    'plot_pattern_comparison',
    'plot_aspect_network',
    'print_pattern_summary',

    # Functions - Pattern Interpretation (L2 Explainability)
    'PatternInterpretation',
    'interpret_pattern',
    'interpret_all_patterns',
    'synthesize_archetype',
    'generate_pattern_reading',
    'PATTERN_ARCHETYPES',
    'STRENGTH_THRESHOLDS',
    'strength_level',

    # Pattern Influence Constants
    'PATTERN_INFLUENCE_VECTORS',
    'PATTERN_ARCHETYPE_NAMES',
    'PATTERN_INFLUENCE_WEIGHT',

    # Functions - Pattern-Aware Persona Modeling
    'PatternModifiedArchetype',
    'PatternPersona',
    'apply_pattern_to_archetype',
    'apply_all_patterns_to_archetype',
    'build_pattern_persona',
    'calculate_pattern_similarity',
    'calculate_archetype_compatibility',
    'interpret_pattern_similarity',
    'derive_pattern_aware_archetype',
    'derive_pattern_compatibility',

    # Functions - Normalization Pipeline
    'normalize_archetype_vector',
    'normalize_for_compatibility',
    'clamp_value',
    'clamp_vector',
    'l2_norm',
    'l2_normalize',
    'soft_normalize_value',
    'soft_normalize_vector',
    'logistic_sigmoid',
    'apply_pattern_delta_normalized',
    'apply_all_pattern_deltas_normalized',
    'vector_stats',
    'compare_vectors',
    'SOFT_NORM_STEEPNESS',
    'CLAMP_MIN',
    'CLAMP_MAX',
    'L2_TARGET_NORM',
]
