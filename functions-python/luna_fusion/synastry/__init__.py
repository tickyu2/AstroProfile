"""
Luna Fusion Synastry Module
P6 Relational Synastry + Composite Chart

Contains:
1. synastry_engine - NEO PI-R 30-facet personality vector comparison
2. composite_engine - Western astrology composite charts
3. bazi_synastry - BaZi pillar-to-pillar compatibility (六合, 三合, 沖, etc.)
"""

from .synastry_engine import (
    compute_synastry_fusion,
    generate_insights,
    get_behavioral_adjustments,
    DOMAIN_WEIGHTS,
    BEHAVIOR_RULES
)
from .composite_engine import (
    calculate_composite_chart,
    composite_to_30_facets,
    get_composite_interpretation
)
from .bazi_synastry import (
    # Branch interaction detection
    is_liu_he,
    is_san_he,
    is_chong,
    is_hai,
    is_xing,
    produces,
    controls,
    get_branch_element,
    # Synastry matrix
    synastry_matrix,
    synastry_insights,
    analyze_branch_interaction,
    explain_synastry_cell,
    # Relationship axes
    calculate_relationship_axes,
    RELATIONSHIP_AXES,
    # Main compatibility function
    compute_bazi_compatibility,
    # Constants
    LIU_HE_PAIRS,
    SAN_HE_GROUPS,
    CHONG_PAIRS,
    HAI_PAIRS,
    XING_GROUPS
)

__all__ = [
    # NEO PI-R synastry
    'compute_synastry_fusion',
    'generate_insights',
    'get_behavioral_adjustments',
    'DOMAIN_WEIGHTS',
    'BEHAVIOR_RULES',
    # Western composite
    'calculate_composite_chart',
    'composite_to_30_facets',
    'get_composite_interpretation',
    # BaZi branch interactions
    'is_liu_he',
    'is_san_he',
    'is_chong',
    'is_hai',
    'is_xing',
    'produces',
    'controls',
    'get_branch_element',
    # BaZi synastry matrix
    'synastry_matrix',
    'synastry_insights',
    'analyze_branch_interaction',
    'explain_synastry_cell',
    # BaZi relationship axes
    'calculate_relationship_axes',
    'RELATIONSHIP_AXES',
    # Main BaZi compatibility
    'compute_bazi_compatibility',
    # BaZi constants
    'LIU_HE_PAIRS',
    'SAN_HE_GROUPS',
    'CHONG_PAIRS',
    'HAI_PAIRS',
    'XING_GROUPS'
]
