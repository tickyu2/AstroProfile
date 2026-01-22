"""
Test script for GENESIS Unified Metaphysics Engine
"""
import sys
sys.path.insert(0, '.')

from unified_engine import (
    UnifiedExpressionVector,
    build_unified_expression,
    UnifiedCompatibilityEngine,
    UnifiedPersonaModeler,
    ConstellationMapper,
    derive_persona,
    compute_unified_compatibility,
)

print('=== GENESIS Unified Metaphysics Engine Test ===')
print()

# Create test Western data (Taurus with Grand Trine)
western_data_a = {
    'sign': 'Taurus',
    'modified_archetype': [0.3, 0.9, 0.5, 0.4, 0.3, 0.8, 0.4, 0.3, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.9, 0.8],
    'pattern_strengths': {
        'grand_trine': 0.7,
        't_square': 0.1,
        'stellium': 0.6,
        'yod': 0.2,
        'kite': 0.5,
        'opposition_chain': 0.1,
    },
    'elements': {'Fire': 0.15, 'Earth': 0.45, 'Air': 0.20, 'Water': 0.20},
    'modalities': {'Cardinal': 0.25, 'Fixed': 0.50, 'Mutable': 0.25},
}

# Create test BaZi data (Jia Wood Day Master)
bazi_chart_a = {
    'pillars': {
        'year': {'stem': 'Geng', 'branch': 'Shen'},
        'month': {'stem': 'Bing', 'branch': 'Xu'},
        'day': {'stem': 'Jia', 'branch': 'Chen'},
        'hour': {'stem': 'Yi', 'branch': 'Mao'},
    },
    'day_master': {'stem': 'Jia', 'element': 'Wood'},
    'element_distribution': {'Wood': 25, 'Fire': 20, 'Earth': 25, 'Metal': 15, 'Water': 15},
    'ten_gods': [
        {'ten_god': 'QiSha', 'pillar': 'year'},
        {'ten_god': 'ShiShen', 'pillar': 'month'},
        {'ten_god': 'BiJian', 'pillar': 'day'},
        {'ten_god': 'JieCai', 'pillar': 'hour'},
    ],
    'dm_strength': {'score': 0.65, 'category': 'balanced'},
    'growth_phases': {
        'year': {'phase': 'DiWang', 'energy_level': 0.9},
        'month': {'phase': 'MuYu', 'energy_level': 0.6},
        'day': {'phase': 'GuanDai', 'energy_level': 0.7},
        'hour': {'phase': 'LinGuan', 'energy_level': 0.8},
    },
    'symbolic_stars': [
        {'category': 'auspicious'},
        {'category': 'auspicious'},
        {'category': 'neutral'},
    ],
    'life_palace': {'branch': 'Yin'},
    'conception_palace': {'branch': 'Shen'},
}

# Create second profile (Scorpio with T-Square)
western_data_b = {
    'sign': 'Scorpio',
    'modified_archetype': [0.7, 0.4, 0.6, 0.5, 0.8, 0.3, 0.5, 0.7, 0.6, 0.4, 0.5, 0.6, 0.7, 0.9, 0.5, 0.6],
    'pattern_strengths': {
        'grand_trine': 0.2,
        't_square': 0.8,
        'stellium': 0.3,
        'yod': 0.5,
        'kite': 0.1,
        'opposition_chain': 0.4,
    },
    'elements': {'Fire': 0.10, 'Earth': 0.20, 'Air': 0.15, 'Water': 0.55},
    'modalities': {'Cardinal': 0.20, 'Fixed': 0.55, 'Mutable': 0.25},
}

bazi_chart_b = {
    'pillars': {
        'year': {'stem': 'Ren', 'branch': 'Zi'},
        'month': {'stem': 'Gui', 'branch': 'Hai'},
        'day': {'stem': 'Gui', 'branch': 'Chou'},
        'hour': {'stem': 'Jia', 'branch': 'Yin'},
    },
    'day_master': {'stem': 'Gui', 'element': 'Water'},
    'element_distribution': {'Wood': 15, 'Fire': 5, 'Earth': 15, 'Metal': 10, 'Water': 55},
    'ten_gods': [
        {'ten_god': 'JieCai', 'pillar': 'year'},
        {'ten_god': 'BiJian', 'pillar': 'month'},
        {'ten_god': 'BiJian', 'pillar': 'day'},
        {'ten_god': 'ShangGuan', 'pillar': 'hour'},
    ],
    'dm_strength': {'score': 0.85, 'category': 'strong'},
    'growth_phases': {
        'year': {'phase': 'DiWang', 'energy_level': 1.0},
        'month': {'phase': 'LinGuan', 'energy_level': 0.85},
        'day': {'phase': 'GuanDai', 'energy_level': 0.7},
        'hour': {'phase': 'Shuai', 'energy_level': 0.4},
    },
    'symbolic_stars': [
        {'category': 'auspicious'},
        {'category': 'special'},
    ],
    'life_palace': {'branch': 'Chen'},
    'conception_palace': {'branch': 'Xu'},
}

# Build unified expressions
print('1. Building Unified Expressions...')
expr_a = build_unified_expression(western_data_a, bazi_chart_a)
expr_b = build_unified_expression(western_data_b, bazi_chart_b)

print(f'   Profile A: {expr_a.sign} / {expr_a.day_master} DM')
print(f'   Vector dimension: {expr_a.dimension}')
print(f'   Profile B: {expr_b.sign} / {expr_b.day_master} DM')
print(f'   Vector dimension: {expr_b.dimension}')
print()

# Derive personas
print('2. Deriving Personas...')
modeler = UnifiedPersonaModeler()
persona_a = modeler.derive_persona(expr_a)
persona_b = modeler.derive_persona(expr_b)

print(f'   Profile A: {persona_a.primary_label}')
print(f'   {persona_a.secondary_label}')
print(f'   Element: {persona_a.element_profile.combined_temperament}')
print()
print(f'   Profile B: {persona_b.primary_label}')
print(f'   {persona_b.secondary_label}')
print(f'   Element: {persona_b.element_profile.combined_temperament}')
print()

# Compute compatibility
print('3. Computing Unified Compatibility...')
engine = UnifiedCompatibilityEngine()
result = engine.compute(expr_a, expr_b)

print(f'   Overall Score: {result.overall_score:.2%}')
print(f'   Grade: {result.overall_grade}')
print(f'   Level: {result.overall_level.value}')
print(f'   Western Score: {result.western_score:.2%}')
print(f'   BaZi Score: {result.bazi_score:.2%}')
print()
print(f'   Interpretation: {result.overall_interpretation}')
print()

# Top strengths
print('   Strengths:')
for s in result.strengths[:3]:
    print(f'     - {s}')
print()

# Constellation mapping
print('4. Building Constellation...')
mapper = ConstellationMapper()
mapper.add_profile('taurus_jia', expr_a, 'Taurus/Jia')
mapper.add_profile('scorpio_gui', expr_b, 'Scorpio/Gui')

# Add a third profile for clustering
western_data_c = {
    'sign': 'Virgo',
    'modified_archetype': [0.4, 0.8, 0.6, 0.7, 0.4, 0.9, 0.5, 0.3, 0.3, 0.9, 0.4, 0.5, 0.5, 0.7, 0.8, 0.7],
    'pattern_strengths': {'grand_trine': 0.5, 't_square': 0.2, 'stellium': 0.4, 'yod': 0.1, 'kite': 0.3, 'opposition_chain': 0.1},
}
bazi_chart_c = {
    'pillars': {
        'year': {'stem': 'Ji', 'branch': 'Wei'},
        'month': {'stem': 'Geng', 'branch': 'Shen'},
        'day': {'stem': 'Ji', 'branch': 'Chou'},
        'hour': {'stem': 'Ding', 'branch': 'Si'},
    },
    'day_master': {'stem': 'Ji', 'element': 'Earth'},
    'element_distribution': {'Wood': 5, 'Fire': 20, 'Earth': 45, 'Metal': 20, 'Water': 10},
    'ten_gods': [],
    'dm_strength': {'score': 0.75},
    'growth_phases': {},
    'symbolic_stars': [],
    'life_palace': {'branch': 'Mao'},
}
expr_c = build_unified_expression(western_data_c, bazi_chart_c)
mapper.add_profile('virgo_ji', expr_c, 'Virgo/Ji')

graph = mapper.build_graph()
print(f'   Nodes: {graph.total_profiles}')
print(f'   Edges: {graph.total_edges}')
print(f'   Average Similarity: {graph.average_similarity:.2%}')
print(f'   Clusters: {len(graph.clusters)}')
print()

# Recommendations
print('5. Match Recommendations for Taurus/Jia...')
recommendations = mapper.get_recommendations('taurus_jia', limit=3)
for rec in recommendations:
    print(f'   {rec.profile_label}: {rec.similarity:.2%} ({rec.strength})')
    if rec.reasons:
        print(f'     Reasons: {rec.reasons[0]}')
print()

print('=== All Tests Passed ===')
print('GENESIS is now a unified metaphysics organism!')
