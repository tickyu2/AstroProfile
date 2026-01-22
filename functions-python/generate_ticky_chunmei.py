"""
Generate Unified Engine JSON for Ticky and Chunmei

Ticky: April 23, 1963 at 9:25am Rawalpindi, Pakistan
Chunmei: July 6, 1983 at 8:40am Mianzhu, China
"""
import sys
import json
from datetime import datetime

sys.path.insert(0, '.')

# Import BaZi engine
from bazi_engine import (
    analyze_bazi,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES,
    ELEMENT_MAP,
)

# Import unified engine
from unified_engine import (
    build_unified_expression,
    UnifiedCompatibilityEngine,
    UnifiedPersonaModeler,
    derive_persona,
    generate_third_chart,
    ThirdChartAnalyzer,
)

# Import Western engine for archetype
from western_engine import (
    SIGN_ARCHETYPE_VECTORS,
    PATTERN_INFLUENCE_VECTORS,
)

# =============================================================================
# CALCULATE BAZI CHARTS
# =============================================================================

print("Calculating BaZi charts...")

# Ticky: April 23, 1963, 9:25am Rawalpindi (GMT+5)
ticky_dt = datetime(1963, 4, 23, 9, 25)
ticky_bazi = analyze_bazi(ticky_dt, is_male=True)

# Chunmei: July 6, 1983, 8:40am Mianzhu (GMT+8)
chunmei_dt = datetime(1983, 7, 6, 8, 40)
chunmei_bazi = analyze_bazi(chunmei_dt, is_male=False)

# Extract pillar info
ticky_pillars = ticky_bazi['pillars']
chunmei_pillars = chunmei_bazi['pillars']

print(f"Ticky BaZi: {ticky_pillars[0][0]}{ticky_pillars[0][1]} {ticky_pillars[1][0]}{ticky_pillars[1][1]} {ticky_pillars[2][0]}{ticky_pillars[2][1]} {ticky_pillars[3][0]}{ticky_pillars[3][1]}")
print(f"Ticky Day Master: {ticky_bazi['day_master']['stem']} ({ticky_bazi['day_master']['element']})")
print()
print(f"Chunmei BaZi: {chunmei_pillars[0][0]}{chunmei_pillars[0][1]} {chunmei_pillars[1][0]}{chunmei_pillars[1][1]} {chunmei_pillars[2][0]}{chunmei_pillars[2][1]} {chunmei_pillars[3][0]}{chunmei_pillars[3][1]}")
print(f"Chunmei Day Master: {chunmei_bazi['day_master']['stem']} ({chunmei_bazi['day_master']['element']})")
print()

# =============================================================================
# WESTERN DATA (Based on Sun Signs and reasonable estimates)
# =============================================================================

# Ticky: April 23 = Taurus (Sun just entered Taurus)
# Strong Earth emphasis, Fixed modality
ticky_western = {
    'sign': 'Taurus',
    'modified_archetype': list(SIGN_ARCHETYPE_VECTORS.get('Taurus', [0.5]*16)),
    'pattern_strengths': {
        'grand_trine': 0.45,  # Earth trine likely
        't_square': 0.35,
        'stellium': 0.40,     # Taurus stellium possible with Sun
        'yod': 0.15,
        'kite': 0.25,
        'opposition_chain': 0.20,
    },
    'elements': {'Fire': 0.15, 'Earth': 0.45, 'Air': 0.20, 'Water': 0.20},
    'modalities': {'Cardinal': 0.20, 'Fixed': 0.55, 'Mutable': 0.25},
}

# Chunmei: July 6 = Cancer (Sun in Cancer)
# Strong Water/emotional emphasis, Cardinal modality
chunmei_western = {
    'sign': 'Cancer',
    'modified_archetype': list(SIGN_ARCHETYPE_VECTORS.get('Cancer', [0.5]*16)),
    'pattern_strengths': {
        'grand_trine': 0.55,  # Water trine likely
        't_square': 0.25,
        'stellium': 0.35,
        'yod': 0.30,
        'kite': 0.40,
        'opposition_chain': 0.15,
    },
    'elements': {'Fire': 0.15, 'Earth': 0.20, 'Air': 0.15, 'Water': 0.50},
    'modalities': {'Cardinal': 0.45, 'Fixed': 0.25, 'Mutable': 0.30},
}

# =============================================================================
# BUILD UNIFIED EXPRESSIONS
# =============================================================================

print("Building Unified Expressions...")

# BaZi data is already a dict from analyze_bazi
ticky_bazi_dict = ticky_bazi
chunmei_bazi_dict = chunmei_bazi

# Calculate current ages (as of 2026)
ticky_age = 2026 - 1963  # 63
chunmei_age = 2026 - 1983  # 43

ticky_expr = build_unified_expression(ticky_western, ticky_bazi_dict, ticky_age)
chunmei_expr = build_unified_expression(chunmei_western, chunmei_bazi_dict, chunmei_age)

print(f"Ticky Expression: {ticky_expr.dimension} dimensions")
print(f"Chunmei Expression: {chunmei_expr.dimension} dimensions")
print()

# =============================================================================
# DERIVE PERSONAS
# =============================================================================

print("Deriving Personas...")

modeler = UnifiedPersonaModeler()
ticky_persona = modeler.derive_persona(ticky_expr)
chunmei_persona = modeler.derive_persona(chunmei_expr)

print(f"Ticky Persona: {ticky_persona.primary_label}")
print(f"Chunmei Persona: {chunmei_persona.primary_label}")
print()

# =============================================================================
# COMPUTE COMPATIBILITY
# =============================================================================

print("Computing Compatibility...")

engine = UnifiedCompatibilityEngine()
compatibility = engine.compute(ticky_expr, chunmei_expr)

print(f"Overall Score: {compatibility.overall_score:.2%}")
print(f"Grade: {compatibility.overall_grade}")
print()

# =============================================================================
# GENERATE THIRD CHART (RELATIONSHIP BEING)
# =============================================================================

print("Generating Third Chart (Relationship Being)...")

analyzer = ThirdChartAnalyzer()
third_chart = analyzer.full_analysis(ticky_expr, chunmei_expr)

print(f"Archetype Name: {third_chart['archetype_name']}")
print(f"Stress Classification: {third_chart['stress_classification']}")
print(f"Element Loop: {third_chart['element_loop_status']}")
print()

# =============================================================================
# BUILD COMPLETE JSON OUTPUT
# =============================================================================

# Helper to get ganzhi string
def get_ganzhi(pillars, idx):
    return f"{pillars[idx][0]}{pillars[idx][1]}"

# Helper to get Chinese ganzhi
STEM_CN = {"Jia": "甲", "Yi": "乙", "Bing": "丙", "Ding": "丁", "Wu": "戊",
           "Ji": "己", "Geng": "庚", "Xin": "辛", "Ren": "壬", "Gui": "癸"}
BRANCH_CN = {"Zi": "子", "Chou": "丑", "Yin": "寅", "Mao": "卯", "Chen": "辰",
             "Si": "巳", "Wu": "午", "Wei": "未", "Shen": "申", "You": "酉",
             "Xu": "戌", "Hai": "亥"}

def get_ganzhi_cn(pillars, idx):
    stem, branch = pillars[idx]
    return f"{STEM_CN.get(stem, stem)}{BRANCH_CN.get(branch, branch)}"

ticky_json = {
    "profile": {
        "name": "Ticky",
        "birth_datetime": "1963-04-23T09:25:00",
        "birth_location": "Rawalpindi, Pakistan",
        "gender": "male",
    },
    "bazi": {
        "pillars": {
            "year": {"ganzhi": get_ganzhi(ticky_pillars, 0), "ganzhi_cn": get_ganzhi_cn(ticky_pillars, 0)},
            "month": {"ganzhi": get_ganzhi(ticky_pillars, 1), "ganzhi_cn": get_ganzhi_cn(ticky_pillars, 1)},
            "day": {"ganzhi": get_ganzhi(ticky_pillars, 2), "ganzhi_cn": get_ganzhi_cn(ticky_pillars, 2)},
            "hour": {"ganzhi": get_ganzhi(ticky_pillars, 3), "ganzhi_cn": get_ganzhi_cn(ticky_pillars, 3)},
        },
        "day_master": ticky_bazi['day_master'],
        "element_distribution": ticky_bazi['element_distribution'],
        "dm_strength": ticky_bazi['dm_strength'],
        "ten_gods": ticky_bazi['ten_gods'],
        "life_palace": ticky_bazi['life_palace'],
        "growth_phases": ticky_bazi.get('growth_phases', {}),
        "symbolic_stars": ticky_bazi.get('symbolic_stars', []),
    },
    "western": {
        "sun_sign": ticky_western['sign'],
        "elements": ticky_western['elements'],
        "modalities": ticky_western['modalities'],
        "pattern_strengths": ticky_western['pattern_strengths'],
    },
    "unified_expression": ticky_expr.to_dict(),
    "persona": ticky_persona.to_dict(),
}

chunmei_json = {
    "profile": {
        "name": "Chunmei",
        "birth_datetime": "1983-07-06T08:40:00",
        "birth_location": "Mianzhu, China",
        "gender": "female",
    },
    "bazi": {
        "pillars": {
            "year": {"ganzhi": get_ganzhi(chunmei_pillars, 0), "ganzhi_cn": get_ganzhi_cn(chunmei_pillars, 0)},
            "month": {"ganzhi": get_ganzhi(chunmei_pillars, 1), "ganzhi_cn": get_ganzhi_cn(chunmei_pillars, 1)},
            "day": {"ganzhi": get_ganzhi(chunmei_pillars, 2), "ganzhi_cn": get_ganzhi_cn(chunmei_pillars, 2)},
            "hour": {"ganzhi": get_ganzhi(chunmei_pillars, 3), "ganzhi_cn": get_ganzhi_cn(chunmei_pillars, 3)},
        },
        "day_master": chunmei_bazi['day_master'],
        "element_distribution": chunmei_bazi['element_distribution'],
        "dm_strength": chunmei_bazi['dm_strength'],
        "ten_gods": chunmei_bazi['ten_gods'],
        "life_palace": chunmei_bazi['life_palace'],
        "growth_phases": chunmei_bazi.get('growth_phases', {}),
        "symbolic_stars": chunmei_bazi.get('symbolic_stars', []),
    },
    "western": {
        "sun_sign": chunmei_western['sign'],
        "elements": chunmei_western['elements'],
        "modalities": chunmei_western['modalities'],
        "pattern_strengths": chunmei_western['pattern_strengths'],
    },
    "unified_expression": chunmei_expr.to_dict(),
    "persona": chunmei_persona.to_dict(),
}

compatibility_json = {
    "profiles": {
        "profile_a": "Ticky",
        "profile_b": "Chunmei",
    },
    "compatibility": compatibility.to_dict(),
    "third_chart": third_chart,
}

# =============================================================================
# OUTPUT JSON FILES
# =============================================================================

print("=" * 60)
print("TICKY UNIFIED PROFILE JSON")
print("=" * 60)
print(json.dumps(ticky_json, indent=2, default=str))

print()
print("=" * 60)
print("CHUNMEI UNIFIED PROFILE JSON")
print("=" * 60)
print(json.dumps(chunmei_json, indent=2, default=str))

print()
print("=" * 60)
print("COMPATIBILITY JSON")
print("=" * 60)
print(json.dumps(compatibility_json, indent=2, default=str))

# Save to files (use script directory)
import os
script_dir = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(script_dir, 'ticky_unified_profile.json'), 'w') as f:
    json.dump(ticky_json, f, indent=2, default=str)

with open(os.path.join(script_dir, 'chunmei_unified_profile.json'), 'w') as f:
    json.dump(chunmei_json, f, indent=2, default=str)

with open(os.path.join(script_dir, 'ticky_chunmei_compatibility.json'), 'w') as f:
    json.dump(compatibility_json, f, indent=2, default=str)

print()
print("Files saved:")
print("  - ticky_unified_profile.json")
print("  - chunmei_unified_profile.json")
print("  - ticky_chunmei_compatibility.json")
