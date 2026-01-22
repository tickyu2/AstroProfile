"""
western_engine/explainability.py

L0-L3 Explainability for Western astrology analysis.

Following the Cathedral pattern for progressive disclosure:
- L0: One-liner summary
- L1: Guided tour (key factors)
- L2: Full formulas and coefficients
- L3: Raw data for researchers
"""

from typing import Dict, Any, List, Optional
from .models import WesternExpressionVector, WesternChart, WesternCompatibilityScore


def generate_chart_explain(
    chart: WesternChart,
    level: str = "L1"
) -> Dict[str, Any]:
    """
    Generate explanation for a Western chart at specified level.

    Args:
        chart: WesternChart object
        level: "L0", "L1", "L2", or "L3"

    Returns:
        Explanation dict at requested level
    """
    if level == "L0":
        return generate_l0_chart(chart)
    elif level == "L1":
        return generate_l1_chart(chart)
    elif level == "L2":
        return generate_l2_chart(chart)
    else:
        return generate_l3_chart(chart)


def generate_l0_chart(chart: WesternChart) -> Dict[str, Any]:
    """One-liner summary."""
    vec = chart.expression_vector

    # Find dominant element
    elements = {
        "Fire": vec.fire_percent,
        "Earth": vec.earth_percent,
        "Air": vec.air_percent,
        "Water": vec.water_percent
    }
    dominant_element = max(elements, key=elements.get)

    # Find dominant modality
    modalities = {
        "Cardinal": vec.cardinal_percent,
        "Fixed": vec.fixed_percent,
        "Mutable": vec.mutable_percent
    }
    dominant_modality = max(modalities, key=modalities.get)

    # Chart shape
    shape = chart.chart_shape.primary_shape.title()

    summary = (
        f"{chart.sun_sign} Sun, {chart.moon_sign} Moon, "
        f"{chart.ascendant_sign} Rising. "
        f"Dominant {dominant_element}/{dominant_modality} energy. "
        f"{shape} chart pattern."
    )

    return {
        "level": "L0",
        "summary": summary,
        "sun_sign": chart.sun_sign,
        "moon_sign": chart.moon_sign,
        "ascendant": chart.ascendant_sign
    }


def generate_l1_chart(chart: WesternChart) -> Dict[str, Any]:
    """Guided tour with key factors."""
    vec = chart.expression_vector

    factors = []

    # Element balance
    elements = [
        ("Fire", vec.fire_percent),
        ("Earth", vec.earth_percent),
        ("Air", vec.air_percent),
        ("Water", vec.water_percent)
    ]
    elements.sort(key=lambda x: -x[1])

    factors.append({
        "factor": "Elemental Balance",
        "description": f"Strongest: {elements[0][0]} ({elements[0][1]*100:.0f}%), "
                      f"Weakest: {elements[3][0]} ({elements[3][1]*100:.0f}%)",
        "impact": "Shows temperament and approach to life"
    })

    # Modality balance
    modalities = [
        ("Cardinal", vec.cardinal_percent),
        ("Fixed", vec.fixed_percent),
        ("Mutable", vec.mutable_percent)
    ]
    modalities.sort(key=lambda x: -x[1])

    factors.append({
        "factor": "Modality Balance",
        "description": f"Strongest: {modalities[0][0]} ({modalities[0][1]*100:.0f}%)",
        "impact": "Shows action style and adaptability"
    })

    # Chart shape
    factors.append({
        "factor": "Chart Shape",
        "description": f"{chart.chart_shape.primary_shape.title()} pattern "
                      f"(confidence: {chart.chart_shape.confidence*100:.0f}%)",
        "impact": "Shows life focus and energy distribution"
    })

    # Key aspects
    if chart.aspects:
        top_aspects = chart.aspects[:3]
        aspect_desc = ", ".join(
            f"{a.planet1}-{a.planet2} {a.aspect_type}" for a in top_aspects
        )
        factors.append({
            "factor": "Key Aspects",
            "description": aspect_desc,
            "impact": "Shows internal dynamics and tensions"
        })

    # Aspect patterns
    if chart.aspect_patterns:
        patterns = [p.pattern_type.replace("_", " ").title() for p in chart.aspect_patterns]
        factors.append({
            "factor": "Aspect Patterns",
            "description": ", ".join(patterns[:3]),
            "impact": "Shows special configurations and talents"
        })

    return {
        "level": "L1",
        "factors": factors,
        "total_factors": len(factors)
    }


def generate_l2_chart(chart: WesternChart) -> Dict[str, Any]:
    """Full formulas and coefficients."""
    vec = chart.expression_vector

    return {
        "level": "L2",
        "formulas": {
            "element_distribution": "Sum(planet_weight × dignity_modifier) per element, normalized",
            "modality_distribution": "Sum(planet_weight) per modality, normalized",
            "house_intensity": "Sum(planet_weight × dignity_modifier) per house, normalized",
            "aspect_harmony": "harmonious_aspects / (harmonious + challenging)",
            "yang_yin_ratio": "yang_energy / total_energy"
        },
        "coefficients": {
            "planet_weights": {
                "Sun": 1.0, "Moon": 1.0, "Mercury": 0.8,
                "Venus": 0.8, "Mars": 0.8, "Jupiter": 0.6,
                "Saturn": 0.6, "Uranus": 0.4, "Neptune": 0.4, "Pluto": 0.4
            },
            "dignity_modifiers": {
                "Exalted": 1.20, "Domicile": 1.15, "Neutral": 1.00,
                "Detriment": 0.90, "Debilitated": 0.80
            }
        },
        "computed_values": {
            "elements": {
                "fire": vec.fire_percent,
                "earth": vec.earth_percent,
                "air": vec.air_percent,
                "water": vec.water_percent
            },
            "modalities": {
                "cardinal": vec.cardinal_percent,
                "fixed": vec.fixed_percent,
                "mutable": vec.mutable_percent
            },
            "house_intensities": list(vec.house_intensities),
            "aspect_harmony": vec.aspect_harmony_score,
            "dignity_score": vec.dignity_score
        }
    }


def generate_l3_chart(chart: WesternChart) -> Dict[str, Any]:
    """Raw data for researchers."""
    return {
        "level": "L3",
        "raw_chart": chart.to_dict(),
        "expression_vector": chart.expression_vector.to_dict(),
        "vector_array": chart.expression_vector.to_vector(),
        "vector_dimensions": len(chart.expression_vector.to_vector())
    }


def generate_compatibility_explain(
    score: WesternCompatibilityScore,
    level: str = "L1"
) -> Dict[str, Any]:
    """
    Generate explanation for compatibility score.
    """
    if level == "L0":
        return generate_l0_compat(score)
    elif level == "L1":
        return generate_l1_compat(score)
    elif level == "L2":
        return generate_l2_compat(score)
    else:
        return generate_l3_compat(score)


def generate_l0_compat(score: WesternCompatibilityScore) -> Dict[str, Any]:
    """One-liner compatibility summary."""
    level = get_compat_level(score.total)

    return {
        "level": "L0",
        "summary": f"{level} compatibility ({score.total}%). "
                  f"Vector cosine: {score.vector_cosine:.2f}.",
        "total": score.total,
        "compatibility_level": level
    }


def generate_l1_compat(score: WesternCompatibilityScore) -> Dict[str, Any]:
    """Guided tour of compatibility factors."""
    factors = []

    # Element harmony
    factors.append({
        "factor": "Element Harmony",
        "score": score.element_harmony,
        "description": interpret_section_score(score.element_harmony),
        "impact": "How temperaments blend"
    })

    # Modality compatibility
    factors.append({
        "factor": "Modality Match",
        "score": score.modality_score,
        "description": interpret_section_score(score.modality_score),
        "impact": "How action styles align"
    })

    # Planetary interplay
    factors.append({
        "factor": "Planetary Interplay",
        "score": score.planetary_interplay,
        "description": interpret_section_score(score.planetary_interplay),
        "impact": "How psychological functions interact"
    })

    # Archetype resonance
    factors.append({
        "factor": "Archetype Resonance",
        "score": score.archetype_resonance,
        "description": interpret_section_score(score.archetype_resonance),
        "impact": "How life themes align"
    })

    # Chart shape
    factors.append({
        "factor": "Chart Shape Compatibility",
        "score": score.chart_shape_compat,
        "description": interpret_section_score(score.chart_shape_compat),
        "impact": "How energy patterns complement"
    })

    return {
        "level": "L1",
        "factors": factors,
        "strongest": max(factors, key=lambda f: f["score"])["factor"],
        "weakest": min(factors, key=lambda f: f["score"])["factor"]
    }


def generate_l2_compat(score: WesternCompatibilityScore) -> Dict[str, Any]:
    """Full formulas."""
    return {
        "level": "L2",
        "formula": "Total = Σ(section_cosine × section_weight)",
        "section_weights": {
            "element": 0.20,
            "modality": 0.10,
            "house": 0.15,
            "planetary": 0.20,
            "archetype": 0.10,
            "aspect": 0.10,
            "dominance": 0.10,
            "shape": 0.05
        },
        "computed_scores": {
            "element_harmony": score.element_harmony,
            "modality_score": score.modality_score,
            "house_overlay": score.house_overlay,
            "planetary_interplay": score.planetary_interplay,
            "archetype_resonance": score.archetype_resonance,
            "aspect_pattern_compat": score.aspect_pattern_compat,
            "dominance_alignment": score.dominance_alignment,
            "chart_shape_compat": score.chart_shape_compat
        },
        "vector_cosine": score.vector_cosine,
        "total": score.total
    }


def generate_l3_compat(score: WesternCompatibilityScore) -> Dict[str, Any]:
    """Raw data."""
    return {
        "level": "L3",
        "raw_score": score.to_dict(),
        "vector_a_dims": score.vector_a_dims,
        "vector_b_dims": score.vector_b_dims
    }


def get_compat_level(score: float) -> str:
    """Get compatibility level label from score."""
    if score >= 85:
        return "Exceptional"
    elif score >= 70:
        return "Strong"
    elif score >= 55:
        return "Moderate"
    elif score >= 40:
        return "Challenging"
    else:
        return "Difficult"


def interpret_section_score(score: float) -> str:
    """Interpret a section score."""
    if score >= 85:
        return "Excellent alignment"
    elif score >= 70:
        return "Strong compatibility"
    elif score >= 55:
        return "Good match with some differences"
    elif score >= 40:
        return "Moderate friction, growth potential"
    else:
        return "Significant differences to navigate"
