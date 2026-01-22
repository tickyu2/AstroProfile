"""
unified_engine/__init__.py

GENESIS Unified Metaphysics Engine

Combines BaZi and Western astrology into a single coherent vector space
for holistic compatibility scoring and persona modeling.

The unified engine stops GENESIS from being "two engines running side-by-side"
and becomes a unified metaphysics organism.

Core Components:
1. BaZi Normalization - Normalizes BaZi components into 0-1 vectors
2. Unified Fusion - Combines BaZi + Western into unified vector space
3. Compatibility Normalizer - Weighted combination of all systems
4. Unified Expression - Complete 90-dimensional unified vector
5. Unified Compatibility - Multi-dimensional compatibility scoring
6. Unified Persona - Derives persona labels from unified vectors
7. Constellation Mapper - Maps vectors into similarity graphs
8. Third Chart - Generates relationship being from two unified expressions

Usage:
    from unified_engine import (
        build_unified_expression,
        UnifiedCompatibilityEngine,
        UnifiedPersonaModeler,
        ConstellationMapper,
    )

    # Build unified expression from profile data
    expr = build_unified_expression(western_data, bazi_chart)

    # Compute compatibility
    engine = UnifiedCompatibilityEngine()
    result = engine.compute(expr_a, expr_b)

    # Derive persona
    modeler = UnifiedPersonaModeler()
    persona = modeler.derive_persona(expr)

    # Build constellation
    mapper = ConstellationMapper()
    mapper.add_profile("alice", expr_alice, "Alice")
    graph = mapper.build_graph()
"""

# =============================================================================
# BaZi Normalization
# =============================================================================

from .bazi_normalization import (
    # Main types
    NormalizedBaZiVector,

    # Main functions
    normalize_bazi_chart,
    bazi_vector_similarity,

    # Component normalizers
    normalize_elements,
    normalize_ten_gods,
    normalize_stems,
    normalize_branches,
    normalize_growth_phases,
    normalize_dm_strength,
    normalize_symbolic_stars,
    normalize_palaces,
    normalize_luck_pillar,

    # Constants
    ELEMENTS as BAZI_ELEMENTS,
    TEN_GODS,
    TEN_GOD_GROUPS,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    GROWTH_PHASES,
)

# =============================================================================
# Unified Fusion
# =============================================================================

from .unified_fusion import (
    # Types
    UnifiedVector,
    FusionConfig,

    # Main functions
    fuse_vectors,
    create_unified_vector,

    # Similarity functions
    unified_cosine_similarity,
    component_similarities,

    # Utilities
    prepare_western_vector,
    l2_normalize,
    min_max_normalize,
    weighted_concatenate,
    weighted_blend,

    # Constants
    DEFAULT_WESTERN_WEIGHT,
    DEFAULT_BAZI_WEIGHT,
    WESTERN_ARCHETYPE_DIM,
    WESTERN_PATTERN_DIM,
)

# =============================================================================
# Compatibility Normalizer
# =============================================================================

from .compatibility_normalizer import (
    # Types
    ComponentScores,
    WeightConfig,
    NormalizedCompatibility,

    # Main functions
    normalize_compatibility,
    normalize_compatibility_adaptive,

    # Component functions
    compute_bazi_component,
    compute_western_component,

    # Normalization utilities
    normalize_score,
    normalize_neo_score,
    normalize_bazi_score,
    normalize_western_score,

    # Modifier functions
    calculate_bazi_modifier,
    apply_modifier,

    # Grading
    score_to_grade,
    score_to_interpretation,

    # Weight adjustment
    adjust_weights_for_missing,

    # Constants
    DEFAULT_NEO_WEIGHT,
    DEFAULT_BAZI_WEIGHT as COMPAT_BAZI_WEIGHT,
    DEFAULT_WESTERN_WEIGHT as COMPAT_WESTERN_WEIGHT,
)

# =============================================================================
# Unified Expression
# =============================================================================

from .unified_expression import (
    # Main class
    UnifiedExpressionVector,

    # Factory functions
    build_unified_expression,
    from_profile,

    # Similarity functions
    unified_expression_similarity,
    section_similarities,

    # Constants
    WESTERN_ARCHETYPE_AXES,
    WESTERN_PATTERNS,
    WESTERN_ELEMENTS,
    WESTERN_MODALITIES,
    SECTION_INDICES,
    TOTAL_CORE_DIMENSION,
)

# =============================================================================
# Unified Compatibility
# =============================================================================

from .unified_compatibility import (
    # Main classes
    UnifiedCompatibilityEngine,
    UnifiedCompatibilityResult,
    CompatibilityLevel,
    SectionScore,

    # Convenience functions
    compute_unified_compatibility,
    quick_compatibility_score,
    compare_profiles,

    # Constants
    DEFAULT_SECTION_WEIGHTS,
    WESTERN_SECTIONS,
    BAZI_SECTIONS,
)

# =============================================================================
# Unified Persona
# =============================================================================

from .unified_persona import (
    # Main classes
    UnifiedPersonaModeler,
    UnifiedPersona,

    # Supporting types
    DominantTrait,
    ElementProfile,
    FunctionalStyle,
    PatternProfile,

    # Convenience functions
    derive_persona,
    quick_persona_label,

    # Constants
    ARCHETYPE_TRAITS,
    PATTERN_PERSONAS,
    TEN_GOD_PERSONAS,
    ELEMENT_TEMPERAMENTS,
)

# =============================================================================
# Constellation Mapper
# =============================================================================

from .constellation_mapper import (
    # Main class
    ConstellationMapper,

    # Data structures
    ConstellationGraph,
    Node,
    Edge,
    Cluster,
    MatchRecommendation,

    # Convenience functions
    build_constellation,
    find_soul_family,

    # Constants
    DEFAULT_STRONG_THRESHOLD,
    DEFAULT_MODERATE_THRESHOLD,
    DEFAULT_WEAK_THRESHOLD,
)

# =============================================================================
# Third Chart (Relationship Being)
# =============================================================================

from .third_chart import (
    # Main functions
    generate_third_chart,

    # Classes
    ThirdChartAnalyzer,
    ThirdChartResult,

    # Constants
    ARCHETYPE_AXES,
    RELATIONSHIP_ARCHETYPES,
)

# =============================================================================
# VERSION
# =============================================================================

__version__ = "1.0.0"

# =============================================================================
# ALL EXPORTS
# =============================================================================

__all__ = [
    # Version
    "__version__",

    # === BaZi Normalization ===
    "NormalizedBaZiVector",
    "normalize_bazi_chart",
    "bazi_vector_similarity",
    "normalize_elements",
    "normalize_ten_gods",
    "normalize_stems",
    "normalize_branches",
    "normalize_growth_phases",
    "normalize_dm_strength",
    "normalize_symbolic_stars",
    "normalize_palaces",
    "normalize_luck_pillar",
    "BAZI_ELEMENTS",
    "TEN_GODS",
    "TEN_GOD_GROUPS",
    "HEAVENLY_STEMS",
    "EARTHLY_BRANCHES",
    "GROWTH_PHASES",

    # === Unified Fusion ===
    "UnifiedVector",
    "FusionConfig",
    "fuse_vectors",
    "create_unified_vector",
    "unified_cosine_similarity",
    "component_similarities",
    "prepare_western_vector",
    "l2_normalize",
    "min_max_normalize",
    "weighted_concatenate",
    "weighted_blend",
    "DEFAULT_WESTERN_WEIGHT",
    "DEFAULT_BAZI_WEIGHT",
    "WESTERN_ARCHETYPE_DIM",
    "WESTERN_PATTERN_DIM",

    # === Compatibility Normalizer ===
    "ComponentScores",
    "WeightConfig",
    "NormalizedCompatibility",
    "normalize_compatibility",
    "normalize_compatibility_adaptive",
    "compute_bazi_component",
    "compute_western_component",
    "normalize_score",
    "normalize_neo_score",
    "normalize_bazi_score",
    "normalize_western_score",
    "calculate_bazi_modifier",
    "apply_modifier",
    "score_to_grade",
    "score_to_interpretation",
    "adjust_weights_for_missing",
    "DEFAULT_NEO_WEIGHT",
    "COMPAT_BAZI_WEIGHT",
    "COMPAT_WESTERN_WEIGHT",

    # === Unified Expression ===
    "UnifiedExpressionVector",
    "build_unified_expression",
    "from_profile",
    "unified_expression_similarity",
    "section_similarities",
    "WESTERN_ARCHETYPE_AXES",
    "WESTERN_PATTERNS",
    "WESTERN_ELEMENTS",
    "WESTERN_MODALITIES",
    "SECTION_INDICES",
    "TOTAL_CORE_DIMENSION",

    # === Unified Compatibility ===
    "UnifiedCompatibilityEngine",
    "UnifiedCompatibilityResult",
    "CompatibilityLevel",
    "SectionScore",
    "compute_unified_compatibility",
    "quick_compatibility_score",
    "compare_profiles",
    "DEFAULT_SECTION_WEIGHTS",
    "WESTERN_SECTIONS",
    "BAZI_SECTIONS",

    # === Unified Persona ===
    "UnifiedPersonaModeler",
    "UnifiedPersona",
    "DominantTrait",
    "ElementProfile",
    "FunctionalStyle",
    "PatternProfile",
    "derive_persona",
    "quick_persona_label",
    "ARCHETYPE_TRAITS",
    "PATTERN_PERSONAS",
    "TEN_GOD_PERSONAS",
    "ELEMENT_TEMPERAMENTS",

    # === Constellation Mapper ===
    "ConstellationMapper",
    "ConstellationGraph",
    "Node",
    "Edge",
    "Cluster",
    "MatchRecommendation",
    "build_constellation",
    "find_soul_family",
    "DEFAULT_STRONG_THRESHOLD",
    "DEFAULT_MODERATE_THRESHOLD",
    "DEFAULT_WEAK_THRESHOLD",

    # === Third Chart (Relationship Being) ===
    "generate_third_chart",
    "ThirdChartAnalyzer",
    "ThirdChartResult",
    "ARCHETYPE_AXES",
    "RELATIONSHIP_ARCHETYPES",
]
