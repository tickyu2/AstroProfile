"""
unified_engine/unified_expression.py

UnifiedExpressionVector - The core data structure for GENESIS Unified Metaphysics.

Combines all metaphysical dimensions into a single coherent vector space:
- Western archetype (16 dims)
- Western patterns (6 dims)
- Western elements (4 dims)
- Western modalities (3 dims)
- BaZi elements (5 dims)
- BaZi ten gods (10 dims)
- BaZi stems/branches (22 dims)
- BaZi growth phases (12 dims)
- BaZi symbolic stars (4 dims)

Total: ~82 core dimensions (expandable)

This enables:
1. Holistic persona modeling
2. Cross-system compatibility scoring
3. Soul family constellation mapping
4. Unified explainability
"""

from typing import Dict, List, Tuple, Optional, Any, Union
from dataclasses import dataclass, field
import math
import json

from .bazi_normalization import (
    NormalizedBaZiVector,
    normalize_bazi_chart,
    ELEMENTS as BAZI_ELEMENTS,
    TEN_GODS,
    TEN_GOD_GROUPS,
)
from .unified_fusion import (
    UnifiedVector,
    FusionConfig,
    create_unified_vector,
    unified_cosine_similarity,
    l2_normalize,
)


# =============================================================================
# CONSTANTS
# =============================================================================

# Western dimension constants
WESTERN_ARCHETYPE_AXES = [
    "Initiator", "Stabilizer", "Relational", "MindCentered",
    "Intuitive", "Concrete", "Expressive", "Transpersonal",
    "RiskSeeking", "OrderOriented", "FluidIdentity", "Warm",
    "Direct", "DepthOriented", "Sustainer", "BoundaryAware",
]

WESTERN_PATTERNS = [
    "grand_trine", "t_square", "stellium",
    "yod", "kite", "opposition_chain",
]

WESTERN_ELEMENTS = ["Fire", "Earth", "Air", "Water"]
WESTERN_MODALITIES = ["Cardinal", "Fixed", "Mutable"]

# Section indices for the unified vector
SECTION_INDICES = {
    "western_archetype": (0, 16),
    "western_patterns": (16, 22),
    "western_elements": (22, 26),
    "western_modalities": (26, 29),
    "bazi_elements": (29, 34),
    "bazi_ten_gods": (34, 44),
    "bazi_ten_god_groups": (44, 49),
    "bazi_stems": (49, 59),
    "bazi_branches": (59, 71),
    "bazi_growth_phases": (71, 83),
    "bazi_dm_strength": (83, 84),
    "bazi_symbolic_stars": (84, 88),
    "bazi_palaces": (88, 90),
}

TOTAL_CORE_DIMENSION = 90


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class UnifiedExpressionVector:
    """
    Complete unified expression vector combining Western and BaZi systems.

    This is the master data structure for GENESIS metaphysical analysis.
    All persona modeling, compatibility scoring, and constellation mapping
    operates on this unified representation.
    """

    # === Western Components ===
    # 16-axis archetype (psychological type)
    archetype: List[float] = field(default_factory=lambda: [0.0] * 16)

    # Aspect pattern strengths
    patterns: List[float] = field(default_factory=lambda: [0.0] * 6)

    # Element distribution (Fire, Earth, Air, Water)
    western_elements: List[float] = field(default_factory=lambda: [0.25] * 4)

    # Modality distribution (Cardinal, Fixed, Mutable)
    modalities: List[float] = field(default_factory=lambda: [0.33, 0.34, 0.33])

    # === BaZi Components ===
    # Five elements (Wood, Fire, Earth, Metal, Water)
    bazi_elements: List[float] = field(default_factory=lambda: [0.2] * 5)

    # Ten Gods distribution
    ten_gods: List[float] = field(default_factory=lambda: [0.1] * 10)

    # Ten God Groups
    ten_god_groups: List[float] = field(default_factory=lambda: [0.2] * 5)

    # Heavenly Stems encoding
    stems: List[float] = field(default_factory=lambda: [0.0] * 10)

    # Earthly Branches encoding
    branches: List[float] = field(default_factory=lambda: [0.0] * 12)

    # Growth Phases
    growth_phases: List[float] = field(default_factory=lambda: [0.0] * 12)

    # Day Master Strength
    dm_strength: float = 0.5

    # Symbolic Stars category counts
    symbolic_stars: List[float] = field(default_factory=lambda: [0.0] * 4)

    # Life/Conception Palace indices
    palaces: List[float] = field(default_factory=lambda: [0.5, 0.5])

    # === Metadata ===
    sign: str = ""  # Western Sun sign
    day_master: str = ""  # BaZi Day Master
    pattern_signature: str = ""  # e.g., "Flow-Dominant with Mission"

    # Source tracking
    has_western: bool = False
    has_bazi: bool = False

    def to_vector(self) -> List[float]:
        """
        Flatten to complete unified vector.

        Returns 90-dimensional vector in consistent order.
        """
        vec = []
        vec.extend(self.archetype)          # 16
        vec.extend(self.patterns)           # 6
        vec.extend(self.western_elements)   # 4
        vec.extend(self.modalities)         # 3
        vec.extend(self.bazi_elements)      # 5
        vec.extend(self.ten_gods)           # 10
        vec.extend(self.ten_god_groups)     # 5
        vec.extend(self.stems)              # 10
        vec.extend(self.branches)           # 12
        vec.extend(self.growth_phases)      # 12
        vec.append(self.dm_strength)        # 1
        vec.extend(self.symbolic_stars)     # 4
        vec.extend(self.palaces)            # 2
        return vec

    @property
    def dimension(self) -> int:
        """Total vector dimension."""
        return len(self.to_vector())

    def get_section(self, section_name: str) -> List[float]:
        """
        Get a specific section of the vector by name.

        Args:
            section_name: One of SECTION_INDICES keys

        Returns:
            List of floats for that section
        """
        vec = self.to_vector()
        if section_name not in SECTION_INDICES:
            return []
        start, end = SECTION_INDICES[section_name]
        return vec[start:end]

    def normalized(self) -> 'UnifiedExpressionVector':
        """Return L2-normalized copy of this vector."""
        vec = l2_normalize(self.to_vector())
        return UnifiedExpressionVector.from_vector(
            vec,
            sign=self.sign,
            day_master=self.day_master,
            pattern_signature=self.pattern_signature,
            has_western=self.has_western,
            has_bazi=self.has_bazi,
        )

    @classmethod
    def from_vector(
        cls,
        vec: List[float],
        sign: str = "",
        day_master: str = "",
        pattern_signature: str = "",
        has_western: bool = True,
        has_bazi: bool = True,
    ) -> 'UnifiedExpressionVector':
        """
        Create UnifiedExpressionVector from flat vector.

        Args:
            vec: 90-dimensional vector
            sign: Western Sun sign
            day_master: BaZi Day Master
            pattern_signature: Pattern signature string
            has_western: Whether Western data was used
            has_bazi: Whether BaZi data was used

        Returns:
            UnifiedExpressionVector instance
        """
        # Pad if needed
        if len(vec) < TOTAL_CORE_DIMENSION:
            vec = vec + [0.0] * (TOTAL_CORE_DIMENSION - len(vec))

        return cls(
            archetype=vec[0:16],
            patterns=vec[16:22],
            western_elements=vec[22:26],
            modalities=vec[26:29],
            bazi_elements=vec[29:34],
            ten_gods=vec[34:44],
            ten_god_groups=vec[44:49],
            stems=vec[49:59],
            branches=vec[59:71],
            growth_phases=vec[71:83],
            dm_strength=vec[83] if len(vec) > 83 else 0.5,
            symbolic_stars=vec[84:88] if len(vec) >= 88 else [0.0] * 4,
            palaces=vec[88:90] if len(vec) >= 90 else [0.5, 0.5],
            sign=sign,
            day_master=day_master,
            pattern_signature=pattern_signature,
            has_western=has_western,
            has_bazi=has_bazi,
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "western": {
                "archetype": self.archetype,
                "archetype_axes": WESTERN_ARCHETYPE_AXES,
                "patterns": dict(zip(WESTERN_PATTERNS, self.patterns)),
                "elements": dict(zip(WESTERN_ELEMENTS, self.western_elements)),
                "modalities": dict(zip(WESTERN_MODALITIES, self.modalities)),
            },
            "bazi": {
                "elements": dict(zip(BAZI_ELEMENTS, self.bazi_elements)),
                "ten_gods": dict(zip(TEN_GODS, self.ten_gods)),
                "ten_god_groups": dict(zip(TEN_GOD_GROUPS, self.ten_god_groups)),
                "dm_strength": self.dm_strength,
                "symbolic_stars": self.symbolic_stars,
            },
            "metadata": {
                "sign": self.sign,
                "day_master": self.day_master,
                "pattern_signature": self.pattern_signature,
                "has_western": self.has_western,
                "has_bazi": self.has_bazi,
                "dimension": self.dimension,
            },
            "vector": self.to_vector(),
        }

    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)


# =============================================================================
# FACTORY FUNCTIONS
# =============================================================================

def build_unified_expression(
    western_data: Optional[Dict[str, Any]] = None,
    bazi_chart: Optional[Dict[str, Any]] = None,
    current_age: Optional[int] = None,
) -> UnifiedExpressionVector:
    """
    Build UnifiedExpressionVector from Western and/or BaZi data.

    Args:
        western_data: Western analysis result dict
        bazi_chart: BaZi chart dict
        current_age: Current age for luck pillar

    Returns:
        UnifiedExpressionVector
    """
    expr = UnifiedExpressionVector()

    # Process Western data
    if western_data:
        expr.has_western = True

        # Archetype
        archetype = western_data.get("modified_archetype") or \
                   western_data.get("archetype") or \
                   western_data.get("base_archetype", [])
        if archetype:
            expr.archetype = list(archetype)[:16]
            if len(expr.archetype) < 16:
                expr.archetype += [0.0] * (16 - len(expr.archetype))

        # Patterns
        patterns = western_data.get("pattern_strengths", {})
        expr.patterns = [patterns.get(p, 0.0) for p in WESTERN_PATTERNS]

        # Western elements
        elements = western_data.get("elements", {})
        if elements:
            expr.western_elements = [
                elements.get("Fire", 0.25),
                elements.get("Earth", 0.25),
                elements.get("Air", 0.25),
                elements.get("Water", 0.25),
            ]

        # Modalities
        modalities = western_data.get("modalities", {})
        if modalities:
            expr.modalities = [
                modalities.get("Cardinal", 0.33),
                modalities.get("Fixed", 0.34),
                modalities.get("Mutable", 0.33),
            ]

        # Metadata
        expr.sign = western_data.get("sign", "")
        expr.pattern_signature = western_data.get("pattern_signature", "")

    # Process BaZi data
    if bazi_chart:
        expr.has_bazi = True

        # Use the normalizer
        bazi_norm = normalize_bazi_chart(bazi_chart, current_age)

        expr.bazi_elements = bazi_norm.elements
        expr.ten_gods = bazi_norm.ten_gods
        expr.ten_god_groups = bazi_norm.ten_god_groups
        expr.stems = bazi_norm.stems
        expr.branches = bazi_norm.branches
        expr.growth_phases = bazi_norm.growth_phases
        expr.dm_strength = bazi_norm.dm_strength
        expr.symbolic_stars = bazi_norm.symbolic_stars
        expr.palaces = bazi_norm.palaces

        # Metadata
        expr.day_master = bazi_chart.get("day_master", {}).get("stem", "")

    return expr


def from_profile(
    profile: Dict[str, Any],
    current_age: Optional[int] = None,
) -> UnifiedExpressionVector:
    """
    Build UnifiedExpressionVector from a GENESIS profile.

    Args:
        profile: GENESIS profile dict with westernChart and/or baziChart
        current_age: Current age

    Returns:
        UnifiedExpressionVector
    """
    western_data = profile.get("westernChart") or profile.get("western_analysis")
    bazi_chart = profile.get("baziChart") or profile.get("bazi_chart")

    return build_unified_expression(western_data, bazi_chart, current_age)


# =============================================================================
# SIMILARITY FUNCTIONS
# =============================================================================

def unified_expression_similarity(
    expr_a: UnifiedExpressionVector,
    expr_b: UnifiedExpressionVector,
    normalize: bool = True,
) -> float:
    """
    Calculate cosine similarity between two unified expressions.

    Args:
        expr_a: First unified expression
        expr_b: Second unified expression
        normalize: Whether to L2 normalize before comparison

    Returns:
        Similarity score in [0, 1]
    """
    vec_a = expr_a.to_vector()
    vec_b = expr_b.to_vector()

    if normalize:
        vec_a = l2_normalize(vec_a)
        vec_b = l2_normalize(vec_b)

    dot = sum(x * y for x, y in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(x * x for x in vec_a))
    norm_b = math.sqrt(sum(x * x for x in vec_b))

    if norm_a == 0 or norm_b == 0:
        return 0.5

    cosine = dot / (norm_a * norm_b)
    return (cosine + 1) / 2


def section_similarities(
    expr_a: UnifiedExpressionVector,
    expr_b: UnifiedExpressionVector,
) -> Dict[str, float]:
    """
    Calculate similarity for each section separately.

    Returns breakdown by section (archetype, patterns, elements, etc.)
    """
    def cosine_sim(a: List[float], b: List[float]) -> float:
        if not a or not b:
            return 0.5
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.5
        return (dot / (norm_a * norm_b) + 1) / 2

    similarities = {}
    for section_name in SECTION_INDICES:
        sec_a = expr_a.get_section(section_name)
        sec_b = expr_b.get_section(section_name)
        similarities[section_name] = cosine_sim(sec_a, sec_b)

    # Add overall
    similarities["overall"] = unified_expression_similarity(expr_a, expr_b)

    return similarities


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Main class
    "UnifiedExpressionVector",

    # Factory functions
    "build_unified_expression",
    "from_profile",

    # Similarity functions
    "unified_expression_similarity",
    "section_similarities",

    # Constants
    "WESTERN_ARCHETYPE_AXES",
    "WESTERN_PATTERNS",
    "WESTERN_ELEMENTS",
    "WESTERN_MODALITIES",
    "SECTION_INDICES",
    "TOTAL_CORE_DIMENSION",
]
