"""
Test script for BaZi Synastry Engine
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime

print("=" * 60)
print("BaZi Synastry Engine Test")
print("=" * 60)

# Test 1: Import bazi_engine
print("\n1. Testing bazi_engine import...")
try:
    from bazi_engine import analyze_bazi, has_sxtwl
    print(f"   [OK] bazi_engine imported successfully")
    print(f"   [OK] sxtwl available: {has_sxtwl()}")
except ImportError as e:
    print(f"   [FAIL] Import error: {e}")
    sys.exit(1)

# Test 2: Import bazi_synastry
print("\n2. Testing bazi_synastry import...")
try:
    from luna_fusion.synastry.bazi_synastry import (
        is_liu_he, is_san_he, is_chong, is_hai, is_xing,
        synastry_matrix, synastry_insights,
        calculate_relationship_axes, compute_bazi_compatibility,
        LIU_HE_PAIRS, SAN_HE_GROUPS, CHONG_PAIRS
    )
    print(f"   [OK] bazi_synastry imported successfully")
except ImportError as e:
    print(f"   [FAIL] Import error: {e}")
    sys.exit(1)

# Test 3: Test branch interaction detection
print("\n3. Testing branch interaction detection...")

# Liu He tests
liu_he_test = is_liu_he("Zi", "Chou")
print(f"   Zi-Chou Liu He: {liu_he_test} (expected: True, Earth)")

san_he_test = is_san_he("Shen", "Zi")
print(f"   Shen-Zi San He: {san_he_test} (expected: True, Water)")

chong_test = is_chong("Zi", "Wu")
print(f"   Zi-Wu Chong: {chong_test} (expected: True)")

hai_test = is_hai("Zi", "Wei")
print(f"   Zi-Wei Hai: {hai_test} (expected: True, Harm of Resentment)")

xing_test = is_xing("Yin", "Shen")
print(f"   Yin-Shen Xing: {xing_test} (expected: True, Ungrateful)")

# Test 4: Generate BaZi charts for two people
print("\n4. Generating test BaZi charts...")

# Person A: May 15, 1990, 14:30
birth_dt_a = datetime(1990, 5, 15, 14, 30)
chart_a = analyze_bazi(birth_dt_a, is_male=True, include_dayun=False)
print(f"   Person A (1990-05-15 14:30):")
print(f"      Day Master: {chart_a['day_master']}")
print(f"      Year: {chart_a['pillars'][0]}")
print(f"      Month: {chart_a['pillars'][1]}")
print(f"      Day: {chart_a['pillars'][2]}")
print(f"      Hour: {chart_a['pillars'][3]}")

# Person B: August 22, 1988, 09:15
birth_dt_b = datetime(1988, 8, 22, 9, 15)
chart_b = analyze_bazi(birth_dt_b, is_male=False, include_dayun=False)
print(f"\n   Person B (1988-08-22 09:15):")
print(f"      Day Master: {chart_b['day_master']}")
print(f"      Year: {chart_b['pillars'][0]}")
print(f"      Month: {chart_b['pillars'][1]}")
print(f"      Day: {chart_b['pillars'][2]}")
print(f"      Hour: {chart_b['pillars'][3]}")

# Test 5: Generate synastry matrix
print("\n5. Generating synastry matrix...")
matrix = synastry_matrix(chart_a, chart_b)
print(f"   Matrix size: {len(matrix)}x{len(matrix[0])}")

# Print a few interesting cells
pillar_names = ["Year", "Month", "Day", "Hour", "DM"]
print("\n   Sample interactions:")
for i, row in enumerate(matrix):
    for j, cell in enumerate(row):
        if cell.get("interaction") != "neutral" and cell.get("score", 0) != 0:
            print(f"      {pillar_names[i]} <-> {pillar_names[j]}: {cell.get('interaction')} (score: {cell.get('score')})")

# Test 6: Generate insights
print("\n6. Generating synastry insights...")
insights = synastry_insights(matrix)
print(f"   Total score: {insights['total_score']}")
print(f"   Pattern: {insights['overall_pattern']}")
print(f"   Positive interactions: {insights['positive_interactions']}")
print(f"   Negative interactions: {insights['negative_interactions']}")

if insights.get('strongest_support'):
    print("\n   Top supports:")
    for s in insights['strongest_support']:
        print(f"      {s['pillars']}: {s['type']} (+{s['score']})")

if insights.get('strongest_challenges'):
    print("\n   Top challenges:")
    for c in insights['strongest_challenges']:
        print(f"      {c['pillars']}: {c['type']} ({c['score']})")

# Test 7: Calculate relationship axes
print("\n7. Calculating relationship axes...")
axes = calculate_relationship_axes(chart_a, chart_b, matrix)
print(f"   Overall compatibility: {axes['overall_compatibility']}")
print(f"   Level: {axes['compatibility_level']}")
print("\n   Axes scores:")
for axis, data in axes['axes'].items():
    print(f"      {axis}: {data['score']}")

# Test 8: Full compatibility function
print("\n8. Running full compatibility analysis...")
full_result = compute_bazi_compatibility(chart_a, chart_b)
print(f"   [OK] compute_bazi_compatibility completed")
print(f"   Overall: {full_result['overall_compatibility']}")
print(f"   Level: {full_result['compatibility_level']}")

print("\n" + "=" * 60)
print("All tests completed successfully!")
print("=" * 60)
