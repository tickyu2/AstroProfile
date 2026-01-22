"""
third_chart.py - The Relationship Being Generator

Generates the "Third Chart" - the unique entity that emerges when two
unified expression vectors combine. This represents the relationship
itself as a distinct being with its own characteristics.

The Third Chart concept:
- Averaged archetype vectors create a composite personality
- Averaged pattern strengths define relationship dynamics
- Stress Chamber analysis reveals behavior under pressure
- Lifecycle timeline predicts relationship evolution

Usage:
    from unified_engine import generate_third_chart, ThirdChartAnalyzer

    third_chart = generate_third_chart(expr_a, expr_b)
    analyzer = ThirdChartAnalyzer()
    analysis = analyzer.full_analysis(expr_a, expr_b)
"""

from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Optional
import math


# Archetype axis names (16 axes)
ARCHETYPE_AXES = [
    "Initiator", "Stabilizer", "Relational", "MindCentered",
    "Intuitive", "Concrete", "Expressive", "Transpersonal",
    "RiskSeeking", "OrderOriented", "FluidIdentity", "Warm",
    "Direct", "DepthOriented", "Sustainer", "BoundaryAware"
]

# Archetype names based on dominant axis combinations
RELATIONSHIP_ARCHETYPES = {
    # High Stabilizer + High Sustainer + High Warm
    ("Stabilizer", "Sustainer", "Warm"): "The Hearth-Temple",
    ("Stabilizer", "Sustainer"): "The Foundation",
    ("Stabilizer", "Warm"): "The Safe Harbor",
    ("Sustainer", "Warm"): "The Nurturing Ground",

    # High Initiator combinations
    ("Initiator", "RiskSeeking"): "The Adventure Duo",
    ("Initiator", "Direct"): "The Power Couple",
    ("Initiator", "Expressive"): "The Creative Force",

    # High Relational combinations
    ("Relational", "Warm"): "The Harmony Weave",
    ("Relational", "Intuitive"): "The Soul Mirror",
    ("Relational", "DepthOriented"): "The Deep Dive",

    # High Intuitive combinations
    ("Intuitive", "DepthOriented"): "The Mystic Union",
    ("Intuitive", "Transpersonal"): "The Cosmic Pair",
    ("Intuitive", "FluidIdentity"): "The Shape-Shifters",

    # High Concrete combinations
    ("Concrete", "OrderOriented"): "The Builder's Guild",
    ("Concrete", "BoundaryAware"): "The Structured Alliance",
    ("Concrete", "Stabilizer"): "The Rock Formation",

    # High MindCentered combinations
    ("MindCentered", "OrderOriented"): "The Think Tank",
    ("MindCentered", "Direct"): "The Debate Club",
    ("MindCentered", "DepthOriented"): "The Research Partners",

    # Default
    (): "The Unique Blend"
}

# Stress response patterns
STRESS_PATTERNS = {
    "coherent_under_load": {
        "description": "Tightens structure rather than breaking. Becomes more 'us' under pressure.",
        "requirements": {"Stabilizer": 0.7, "Sustainer": 0.7}
    },
    "emotionally_available": {
        "description": "Stays emotionally connected. Doesn't weaponize silence.",
        "requirements": {"Warm": 0.7, "Relational": 0.6}
    },
    "purpose_sharpening": {
        "description": "Stress sharpens purpose instead of dissolving it. River becomes canal.",
        "requirements": {"Direct": 0.5, "DepthOriented": 0.5}
    },
    "adaptive_flexibility": {
        "description": "Bends without breaking. Adapts to changing circumstances.",
        "requirements": {"FluidIdentity": 0.6, "Intuitive": 0.5}
    },
    "boundary_protection": {
        "description": "Maintains healthy boundaries under external pressure.",
        "requirements": {"BoundaryAware": 0.7, "Concrete": 0.5}
    },
    "creative_release": {
        "description": "Transforms stress into creative expression.",
        "requirements": {"Expressive": 0.6, "Initiator": 0.5}
    }
}

# Element interaction patterns for closed-loop analysis
ELEMENT_INTERACTIONS = {
    "Wood": {"produces": "Fire", "controls": "Earth", "controlled_by": "Metal"},
    "Fire": {"produces": "Earth", "controls": "Metal", "controlled_by": "Water"},
    "Earth": {"produces": "Metal", "controls": "Water", "controlled_by": "Wood"},
    "Metal": {"produces": "Water", "controls": "Wood", "controlled_by": "Fire"},
    "Water": {"produces": "Wood", "controls": "Fire", "controlled_by": "Earth"}
}


@dataclass
class ThirdChartResult:
    """Complete Third Chart analysis result"""

    # Identity
    partners: List[str]
    day_masters: List[str]
    archetype_name: str
    description: str

    # Averaged vectors
    archetype_vector_16: List[float]
    archetype_scores: Dict[str, float]

    # Pattern analysis
    pattern_strengths: Dict[str, float]
    pattern_signature: str

    # Element analysis
    western_elements: Dict[str, float]
    bazi_elements: Dict[str, float]
    element_loop_status: str
    element_metabolism: Dict[str, str]

    # Stress chamber
    stress_patterns: List[Dict]
    stress_classification: str

    # Lifecycle
    lifecycle_stages: List[Dict]

    def to_dict(self) -> dict:
        """Convert to JSON-serializable dictionary"""
        return {
            "partners": self.partners,
            "day_masters": self.day_masters,
            "archetype_name": self.archetype_name,
            "description": self.description,
            "archetype_vector_16": self.archetype_vector_16,
            "archetype_scores": self.archetype_scores,
            "pattern_strengths": self.pattern_strengths,
            "pattern_signature": self.pattern_signature,
            "western_elements": self.western_elements,
            "bazi_elements": self.bazi_elements,
            "element_loop_status": self.element_loop_status,
            "element_metabolism": self.element_metabolism,
            "stress_patterns": self.stress_patterns,
            "stress_classification": self.stress_classification,
            "lifecycle_stages": self.lifecycle_stages
        }


def average_vectors(vec_a: List[float], vec_b: List[float]) -> List[float]:
    """Element-wise average of two vectors"""
    if len(vec_a) != len(vec_b):
        raise ValueError(f"Vector length mismatch: {len(vec_a)} vs {len(vec_b)}")
    return [(a + b) / 2 for a, b in zip(vec_a, vec_b)]


def average_dicts(dict_a: Dict[str, float], dict_b: Dict[str, float]) -> Dict[str, float]:
    """Average values from two dictionaries"""
    all_keys = set(dict_a.keys()) | set(dict_b.keys())
    return {
        k: (dict_a.get(k, 0) + dict_b.get(k, 0)) / 2
        for k in all_keys
    }


def derive_relationship_archetype(archetype_vector: List[float]) -> Tuple[str, str]:
    """
    Derive relationship archetype name from averaged vector.

    Returns:
        Tuple of (archetype_name, description)
    """
    # Map to axis scores
    axis_scores = {
        ARCHETYPE_AXES[i]: archetype_vector[i]
        for i in range(min(len(archetype_vector), len(ARCHETYPE_AXES)))
    }

    # Find dominant axes (> 0.7)
    dominant = sorted(
        [(k, v) for k, v in axis_scores.items() if v >= 0.7],
        key=lambda x: -x[1]
    )

    dominant_names = tuple(d[0] for d in dominant[:3])

    # Try to match archetype
    for key_combo, name in RELATIONSHIP_ARCHETYPES.items():
        if set(key_combo).issubset(set(dominant_names)):
            # Build description
            desc_parts = []
            for axis, val in dominant[:3]:
                desc_parts.append(f"{axis.lower()} ({val:.2f})")

            description = f"A {', '.join(desc_parts)} relational field."
            return name, description

    # Default case
    if dominant:
        desc_parts = [f"{d[0].lower()} ({d[1]:.2f})" for d in dominant[:3]]
        return "The Unique Blend", f"A unique combination of {', '.join(desc_parts)}."

    return "The Balanced Union", "A harmoniously balanced relationship."


def analyze_stress_chamber(archetype_scores: Dict[str, float]) -> Tuple[List[Dict], str]:
    """
    Analyze how the relationship behaves under stress.

    Returns:
        Tuple of (list of active patterns, classification)
    """
    active_patterns = []

    for pattern_name, pattern_info in STRESS_PATTERNS.items():
        requirements = pattern_info["requirements"]

        # Check if all requirements are met
        met = all(
            archetype_scores.get(axis, 0) >= threshold
            for axis, threshold in requirements.items()
        )

        if met:
            # Calculate strength (average of relevant axes)
            strength = sum(
                archetype_scores.get(axis, 0)
                for axis in requirements.keys()
            ) / len(requirements)

            active_patterns.append({
                "pattern": pattern_name,
                "description": pattern_info["description"],
                "strength": round(strength, 2),
                "axes": list(requirements.keys())
            })

    # Sort by strength
    active_patterns.sort(key=lambda x: -x["strength"])

    # Classify overall stress response
    if len(active_patterns) >= 3:
        classification = "Highly Resilient"
    elif len(active_patterns) >= 2:
        classification = "Coherent Under Load"
    elif len(active_patterns) >= 1:
        classification = "Moderately Stable"
    else:
        classification = "Stress-Sensitive"

    return active_patterns, classification


def analyze_element_metabolism(
    bazi_elements_a: Dict[str, float],
    bazi_elements_b: Dict[str, float]
) -> Tuple[str, Dict[str, str]]:
    """
    Analyze elemental interaction between two charts.

    Checks for:
    - Closed production loop (generative cycle)
    - Control relationships (destructive cycle)
    - Balance of elements

    Returns:
        Tuple of (loop_status, metabolism_description)
    """
    # Combine element strengths
    combined = average_dicts(bazi_elements_a, bazi_elements_b)

    # Find dominant and weak elements
    sorted_elements = sorted(combined.items(), key=lambda x: -x[1])
    dominant = [e[0] for e in sorted_elements[:2]]
    weak = [e[0] for e in sorted_elements[-2:]]

    metabolism = {}

    # Check production cycle
    production_count = 0
    for elem, info in ELEMENT_INTERACTIONS.items():
        if combined.get(elem, 0) > 0.1 and combined.get(info["produces"], 0) > 0.1:
            production_count += 1
            metabolism[f"{elem}_produces"] = f"{elem} feeds {info['produces']}"

    # Check control cycle
    control_count = 0
    for elem, info in ELEMENT_INTERACTIONS.items():
        if combined.get(elem, 0) > 0.2 and combined.get(info["controls"], 0) > 0.2:
            # Strong element controlling another strong element
            control_count += 1
            metabolism[f"{elem}_controls"] = f"{elem} restrains {info['controls']}"

    # Determine loop status
    if production_count >= 4 and control_count == 0:
        loop_status = "Closed Production Loop"
    elif production_count >= 3 and control_count <= 1:
        loop_status = "Mostly Generative"
    elif control_count >= 2:
        loop_status = "Control Dynamics Present"
    else:
        loop_status = "Mixed Cycle"

    return loop_status, metabolism


def generate_lifecycle_stages(
    archetype_scores: Dict[str, float],
    stress_classification: str
) -> List[Dict]:
    """
    Generate predicted lifecycle stages for the relationship.

    Based on archetype configuration and stress resilience.
    """
    stages = []

    # Stage 1: Formation (0-2 years)
    formation_energy = (
        archetype_scores.get("Initiator", 0.5) +
        archetype_scores.get("Warm", 0.5) +
        archetype_scores.get("Relational", 0.5)
    ) / 3

    stages.append({
        "stage": "Formation",
        "period": "0-2 years",
        "energy": round(formation_energy, 2),
        "description": "Initial bonding and pattern establishment.",
        "key_axes": ["Initiator", "Warm", "Relational"]
    })

    # Stage 2: Deepening (2-7 years)
    deepening_energy = (
        archetype_scores.get("DepthOriented", 0.5) +
        archetype_scores.get("Stabilizer", 0.5) +
        archetype_scores.get("Intuitive", 0.5)
    ) / 3

    stages.append({
        "stage": "Deepening",
        "period": "2-7 years",
        "energy": round(deepening_energy, 2),
        "description": "Building trust and emotional intimacy.",
        "key_axes": ["DepthOriented", "Stabilizer", "Intuitive"]
    })

    # Stage 3: Stabilization (7-15 years)
    stabilization_energy = (
        archetype_scores.get("Sustainer", 0.5) +
        archetype_scores.get("BoundaryAware", 0.5) +
        archetype_scores.get("OrderOriented", 0.5)
    ) / 3

    stages.append({
        "stage": "Stabilization",
        "period": "7-15 years",
        "energy": round(stabilization_energy, 2),
        "description": "Establishing long-term patterns and boundaries.",
        "key_axes": ["Sustainer", "BoundaryAware", "OrderOriented"]
    })

    # Stage 4: Maturation (15+ years)
    maturation_energy = (
        archetype_scores.get("Transpersonal", 0.5) +
        archetype_scores.get("Sustainer", 0.5) +
        archetype_scores.get("Warm", 0.5)
    ) / 3

    # Bonus for stress resilience
    if stress_classification in ["Highly Resilient", "Coherent Under Load"]:
        maturation_energy = min(1.0, maturation_energy + 0.1)

    stages.append({
        "stage": "Maturation",
        "period": "15+ years",
        "energy": round(maturation_energy, 2),
        "description": "Legacy building and transcendent connection.",
        "key_axes": ["Transpersonal", "Sustainer", "Warm"]
    })

    return stages


def derive_pattern_signature(patterns: Dict[str, float]) -> str:
    """Derive pattern signature from pattern strengths"""
    pattern_labels = {
        "grand_trine": "Flow Master",
        "t_square": "Tension Driver",
        "stellium": "Focused Specialist",
        "yod": "Fated Path",
        "kite": "Directed Flyer",
        "opposition_chain": "Polarity Dancer"
    }

    # Get top 2 patterns
    sorted_patterns = sorted(patterns.items(), key=lambda x: -x[1])
    top_patterns = [p for p in sorted_patterns[:2] if p[1] >= 0.3]

    if not top_patterns:
        return "Balanced Expression"

    labels = [pattern_labels.get(p[0], p[0]) for p in top_patterns]
    return " + ".join(labels)


def generate_third_chart(expr_a, expr_b) -> ThirdChartResult:
    """
    Generate the Third Chart from two unified expressions.

    The Third Chart represents the relationship itself as a distinct entity
    with its own personality, patterns, and lifecycle.

    Args:
        expr_a: First person's UnifiedExpressionVector or dict
        expr_b: Second person's UnifiedExpressionVector or dict

    Returns:
        ThirdChartResult containing complete analysis
    """
    # Extract data from expressions (handle both object and dict)
    def get_attr(obj, attr, default=None):
        if hasattr(obj, attr):
            return getattr(obj, attr)
        elif isinstance(obj, dict):
            return obj.get(attr, default)
        return default

    def get_nested(obj, *keys, default=None):
        for key in keys:
            if hasattr(obj, key):
                obj = getattr(obj, key)
            elif isinstance(obj, dict) and key in obj:
                obj = obj[key]
            else:
                return default
        return obj

    # Get partner info
    sign_a = get_nested(expr_a, "metadata", "sign") or get_attr(expr_a, "sign", "Unknown")
    sign_b = get_nested(expr_b, "metadata", "sign") or get_attr(expr_b, "sign", "Unknown")
    dm_a = get_nested(expr_a, "metadata", "day_master") or get_attr(expr_a, "day_master", "Unknown")
    dm_b = get_nested(expr_b, "metadata", "day_master") or get_attr(expr_b, "day_master", "Unknown")

    # Get archetype vectors
    archetype_a = get_nested(expr_a, "western", "archetype") or get_attr(expr_a, "archetype", [0.5] * 16)
    archetype_b = get_nested(expr_b, "western", "archetype") or get_attr(expr_b, "archetype", [0.5] * 16)

    # Ensure we have lists
    if not isinstance(archetype_a, list):
        archetype_a = list(archetype_a) if archetype_a else [0.5] * 16
    if not isinstance(archetype_b, list):
        archetype_b = list(archetype_b) if archetype_b else [0.5] * 16

    # Average archetype vectors
    avg_archetype = average_vectors(archetype_a, archetype_b)

    # Map to axis scores
    archetype_scores = {
        ARCHETYPE_AXES[i]: round(avg_archetype[i], 2)
        for i in range(min(len(avg_archetype), len(ARCHETYPE_AXES)))
    }

    # Get pattern strengths
    patterns_a = get_nested(expr_a, "western", "patterns") or {}
    patterns_b = get_nested(expr_b, "western", "patterns") or {}

    if isinstance(patterns_a, dict) and isinstance(patterns_b, dict):
        avg_patterns = average_dicts(patterns_a, patterns_b)
    else:
        avg_patterns = {
            "grand_trine": 0.5,
            "t_square": 0.3,
            "stellium": 0.35,
            "yod": 0.2,
            "kite": 0.3,
            "opposition_chain": 0.2
        }

    # Get element distributions
    western_elem_a = get_nested(expr_a, "western", "elements") or {}
    western_elem_b = get_nested(expr_b, "western", "elements") or {}
    bazi_elem_a = get_nested(expr_a, "bazi", "elements") or {}
    bazi_elem_b = get_nested(expr_b, "bazi", "elements") or {}

    avg_western_elements = average_dicts(western_elem_a, western_elem_b)
    avg_bazi_elements = average_dicts(bazi_elem_a, bazi_elem_b)

    # Derive archetype name
    archetype_name, description = derive_relationship_archetype(avg_archetype)

    # Pattern signature
    pattern_signature = derive_pattern_signature(avg_patterns)

    # Stress chamber analysis
    stress_patterns, stress_classification = analyze_stress_chamber(archetype_scores)

    # Element metabolism
    element_loop, element_metabolism = analyze_element_metabolism(bazi_elem_a, bazi_elem_b)

    # Lifecycle stages
    lifecycle_stages = generate_lifecycle_stages(archetype_scores, stress_classification)

    return ThirdChartResult(
        partners=[sign_a, sign_b],
        day_masters=[dm_a, dm_b],
        archetype_name=archetype_name,
        description=description,
        archetype_vector_16=avg_archetype,
        archetype_scores=archetype_scores,
        pattern_strengths=avg_patterns,
        pattern_signature=pattern_signature,
        western_elements=avg_western_elements,
        bazi_elements=avg_bazi_elements,
        element_loop_status=element_loop,
        element_metabolism=element_metabolism,
        stress_patterns=stress_patterns,
        stress_classification=stress_classification,
        lifecycle_stages=lifecycle_stages
    )


class ThirdChartAnalyzer:
    """
    Comprehensive analyzer for Third Chart generation.

    Provides additional analysis methods and narrative generation.
    """

    def full_analysis(self, expr_a, expr_b) -> Dict:
        """Generate complete Third Chart analysis with narrative"""
        result = generate_third_chart(expr_a, expr_b)

        # Add narrative
        narrative = self._generate_narrative(result)

        output = result.to_dict()
        output["narrative"] = narrative

        return output

    def _generate_narrative(self, result: ThirdChartResult) -> str:
        """Generate poetic narrative for the Third Chart"""
        parts = []

        # Opening
        parts.append(f"**{result.archetype_name}**")
        parts.append(f"\n{result.description}")

        # Day Master interaction
        dm_a, dm_b = result.day_masters
        parts.append(f"\n\nThis union brings together {dm_a} and {dm_b} Day Masters.")

        # Dominant traits
        top_axes = sorted(result.archetype_scores.items(), key=lambda x: -x[1])[:3]
        trait_desc = ", ".join([f"{a} ({v})" for a, v in top_axes])
        parts.append(f"The relationship expresses dominantly through: {trait_desc}.")

        # Stress pattern
        if result.stress_patterns:
            stress_desc = result.stress_patterns[0]["description"]
            parts.append(f"\n\nUnder pressure: {stress_desc}")

        parts.append(f"\n\nStress Classification: **{result.stress_classification}**")

        # Element metabolism
        if result.element_metabolism:
            loop_items = list(result.element_metabolism.values())[:3]
            parts.append(f"\n\nElemental metabolism: {'; '.join(loop_items)}.")
            parts.append(f"Overall: {result.element_loop_status}.")

        return "\n".join(parts)


# Export for use
__all__ = [
    "generate_third_chart",
    "ThirdChartAnalyzer",
    "ThirdChartResult",
    "ARCHETYPE_AXES",
    "RELATIONSHIP_ARCHETYPES"
]
