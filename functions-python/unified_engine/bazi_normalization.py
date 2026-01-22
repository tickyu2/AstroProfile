"""
unified_engine/bazi_normalization.py

BaZi Normalization Pipeline for Unified Metaphysics Engine.

Normalizes BaZi components into 0-1 vectors for fusion with Western astrology.
Each BaZi dimension becomes a normalized vector suitable for cosine similarity.

Pipeline: raw BaZi data → element normalization → ten gods normalization →
          stems/branches encoding → palace encoding → symbolic stars encoding
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
import math


# =============================================================================
# CONSTANTS
# =============================================================================

# Five Elements
ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"]

# Ten Gods
TEN_GODS = [
    "BiJian", "JieCai",  # Same element (Rob Wealth, Friend)
    "ShiShen", "ShangGuan",  # Output (Eating God, Hurting Officer)
    "ZhengCai", "PianCai",  # Wealth (Direct, Indirect)
    "ZhengGuan", "QiSha",  # Authority (Direct Officer, Seven Killings)
    "ZhengYin", "PianYin",  # Resource (Direct, Indirect Seal)
]

# Ten God Groups
TEN_GOD_GROUPS = ["Performance", "Output", "Wealth", "Authority", "Resource"]

# Heavenly Stems
HEAVENLY_STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"]

# Earthly Branches
EARTHLY_BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si",
                    "Wu", "Wei", "Shen", "You", "Xu", "Hai"]

# Twelve Growth Phases
GROWTH_PHASES = [
    "ChangSheng", "MuYu", "GuanDai", "LinGuan", "DiWang", "Shuai",
    "Bing", "Si", "Mu", "Jue", "Tai", "Yang"
]

# Symbolic Star Categories
STAR_CATEGORIES = ["auspicious", "inauspicious", "neutral", "special"]

# Element Yin/Yang
STEM_POLARITY = {
    "Jia": "yang", "Yi": "yin", "Bing": "yang", "Ding": "yin", "Wu": "yang",
    "Ji": "yin", "Geng": "yang", "Xin": "yin", "Ren": "yang", "Gui": "yin"
}

STEM_ELEMENT = {
    "Jia": "Wood", "Yi": "Wood", "Bing": "Fire", "Ding": "Fire",
    "Wu": "Earth", "Ji": "Earth", "Geng": "Metal", "Xin": "Metal",
    "Ren": "Water", "Gui": "Water"
}


# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class NormalizedBaZiVector:
    """Complete normalized BaZi vector for fusion."""

    # Element distribution (5 dims) - percentages normalized to [0, 1]
    elements: List[float]  # [wood, fire, earth, metal, water]

    # Ten Gods distribution (10 dims) - count/weight normalized
    ten_gods: List[float]  # [BiJian, JieCai, ShiShen, ...]

    # Ten God Groups (5 dims) - aggregated
    ten_god_groups: List[float]  # [Performance, Output, Wealth, Authority, Resource]

    # Heavenly Stems encoding (10 dims) - presence/absence or weighted
    stems: List[float]  # One-hot or weighted presence

    # Earthly Branches encoding (12 dims)
    branches: List[float]  # One-hot or weighted presence

    # Growth Phases (12 dims) - average energy across pillars
    growth_phases: List[float]

    # Day Master Strength (1 dim)
    dm_strength: float

    # Symbolic Stars (4 dims) - category counts normalized
    symbolic_stars: List[float]  # [auspicious, inauspicious, neutral, special]

    # Life/Conception Palace (2 dims) - encoded as branch index normalized
    palaces: List[float]  # [life_palace_idx, conception_palace_idx]

    # DaYun current phase influence (optional, 3 dims)
    luck_pillar: Optional[List[float]] = None  # [stem_idx, branch_idx, age_normalized]

    def to_vector(self) -> List[float]:
        """Flatten to complete vector for fusion."""
        vec = []
        vec.extend(self.elements)           # 5
        vec.extend(self.ten_gods)           # 10
        vec.extend(self.ten_god_groups)     # 5
        vec.extend(self.stems)              # 10
        vec.extend(self.branches)           # 12
        vec.extend(self.growth_phases)      # 12
        vec.append(self.dm_strength)        # 1
        vec.extend(self.symbolic_stars)     # 4
        vec.extend(self.palaces)            # 2
        if self.luck_pillar:
            vec.extend(self.luck_pillar)    # 3
        return vec

    @property
    def dimension(self) -> int:
        """Total vector dimension."""
        base = 5 + 10 + 5 + 10 + 12 + 12 + 1 + 4 + 2  # 61
        if self.luck_pillar:
            return base + 3  # 64
        return base

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "elements": self.elements,
            "ten_gods": self.ten_gods,
            "ten_god_groups": self.ten_god_groups,
            "stems": self.stems,
            "branches": self.branches,
            "growth_phases": self.growth_phases,
            "dm_strength": self.dm_strength,
            "symbolic_stars": self.symbolic_stars,
            "palaces": self.palaces,
            "luck_pillar": self.luck_pillar,
            "dimension": self.dimension,
        }


# =============================================================================
# NORMALIZATION FUNCTIONS
# =============================================================================

def normalize_elements(element_dist: Dict[str, float]) -> List[float]:
    """
    Normalize element distribution to [0, 1] vector.

    Args:
        element_dist: Dict with Wood, Fire, Earth, Metal, Water percentages

    Returns:
        5-dimensional vector with values in [0, 1]
    """
    total = sum(element_dist.values())
    if total == 0:
        return [0.2] * 5  # Equal distribution if no data

    # Normalize so max possible is 1.0
    # Since elements can be 0-100%, we divide by 100 or by total
    normalized = []
    for elem in ELEMENTS:
        val = element_dist.get(elem, 0.0)
        # Normalize to [0, 1] - values are typically percentages
        if isinstance(val, (int, float)):
            normalized.append(min(1.0, max(0.0, val / 100.0 if val > 1 else val)))
        else:
            normalized.append(0.0)

    return normalized


def normalize_ten_gods(ten_god_counts: Dict[str, float]) -> Tuple[List[float], List[float]]:
    """
    Normalize Ten Gods to vectors.

    Args:
        ten_god_counts: Dict mapping ten god names to counts/weights

    Returns:
        Tuple of (10-dim individual vector, 5-dim group vector)
    """
    # Individual ten gods vector
    individual = []
    max_count = max(ten_god_counts.values()) if ten_god_counts else 1.0
    if max_count == 0:
        max_count = 1.0

    for god in TEN_GODS:
        count = ten_god_counts.get(god, 0.0)
        # Normalize by max count to [0, 1]
        individual.append(min(1.0, count / max_count))

    # Group aggregation
    groups = {
        "Performance": ["BiJian", "JieCai"],
        "Output": ["ShiShen", "ShangGuan"],
        "Wealth": ["ZhengCai", "PianCai"],
        "Authority": ["ZhengGuan", "QiSha"],
        "Resource": ["ZhengYin", "PianYin"],
    }

    group_vector = []
    for group_name in TEN_GOD_GROUPS:
        gods_in_group = groups.get(group_name, [])
        group_sum = sum(ten_god_counts.get(g, 0.0) for g in gods_in_group)
        # Normalize group sum
        group_vector.append(min(1.0, group_sum / (2 * max_count)))

    return individual, group_vector


def normalize_stems(stems: List[str], weighted: bool = True) -> List[float]:
    """
    Encode heavenly stems to 10-dimensional vector.

    Args:
        stems: List of stem names (typically 4 from four pillars)
        weighted: If True, weight by position (year=0.2, month=0.3, day=0.35, hour=0.15)

    Returns:
        10-dimensional stem encoding
    """
    weights = [0.2, 0.3, 0.35, 0.15] if weighted else [0.25] * 4

    vector = [0.0] * 10
    for i, stem in enumerate(stems):
        if stem in HEAVENLY_STEMS:
            idx = HEAVENLY_STEMS.index(stem)
            w = weights[i] if i < len(weights) else 0.25
            vector[idx] += w

    # Clamp to [0, 1]
    return [min(1.0, v) for v in vector]


def normalize_branches(branches: List[str], weighted: bool = True) -> List[float]:
    """
    Encode earthly branches to 12-dimensional vector.

    Args:
        branches: List of branch names (typically 4 from four pillars)
        weighted: If True, weight by position

    Returns:
        12-dimensional branch encoding
    """
    weights = [0.2, 0.3, 0.35, 0.15] if weighted else [0.25] * 4

    vector = [0.0] * 12
    for i, branch in enumerate(branches):
        if branch in EARTHLY_BRANCHES:
            idx = EARTHLY_BRANCHES.index(branch)
            w = weights[i] if i < len(weights) else 0.25
            vector[idx] += w

    return [min(1.0, v) for v in vector]


def normalize_growth_phases(phases: Dict[str, Dict]) -> List[float]:
    """
    Normalize growth phases to 12-dimensional vector.

    Args:
        phases: Dict mapping pillar names to phase info with energy_level

    Returns:
        12-dimensional vector of phase energies
    """
    # Aggregate energy by phase type
    phase_energies = {phase: 0.0 for phase in GROWTH_PHASES}

    for pillar_name, phase_info in phases.items():
        phase_name = phase_info.get("phase", "")
        energy = phase_info.get("energy_level", 0.5)
        if phase_name in phase_energies:
            phase_energies[phase_name] += energy * 0.25  # Weight by pillar

    vector = [phase_energies.get(p, 0.0) for p in GROWTH_PHASES]

    # Normalize to [0, 1]
    max_val = max(vector) if vector else 1.0
    if max_val > 0:
        vector = [v / max_val for v in vector]

    return vector


def normalize_dm_strength(strength_data: Dict[str, Any]) -> float:
    """
    Normalize Day Master strength to [0, 1].

    Args:
        strength_data: Dict with 'score' key (0.0-1.0)

    Returns:
        Normalized DM strength
    """
    score = strength_data.get("score", 0.5)
    return min(1.0, max(0.0, float(score)))


def normalize_symbolic_stars(stars: List) -> List[float]:
    """
    Normalize symbolic stars to 4-dimensional category vector.

    Args:
        stars: List of star dicts/strings with 'category' field or star info

    Returns:
        4-dimensional vector [auspicious, inauspicious, neutral, special]
    """
    counts = {cat: 0 for cat in STAR_CATEGORIES}

    for star in stars:
        if isinstance(star, dict):
            # Format: {"category": "auspicious", "name": "...", ...}
            cat = star.get("category", "neutral")
            if cat in counts:
                counts[cat] += 1
        elif isinstance(star, str):
            # Format: just star name - count as neutral
            counts["neutral"] += 1
        elif isinstance(star, tuple) and len(star) >= 2:
            # Format: (name, category, ...)
            cat = star[1] if len(star) > 1 else "neutral"
            if cat in counts:
                counts[cat] += 1

    # Normalize by typical max (e.g., 10 stars per category)
    max_stars = 10.0
    vector = [min(1.0, counts.get(cat, 0) / max_stars) for cat in STAR_CATEGORIES]

    return vector


def normalize_palaces(life_palace: Dict, conception_palace: Optional[Dict] = None) -> List[float]:
    """
    Normalize life and conception palaces to 2-dimensional vector.

    Uses branch index normalized to [0, 1].

    Args:
        life_palace: Dict with 'branch' field
        conception_palace: Optional dict with 'branch' field

    Returns:
        2-dimensional vector
    """
    def branch_to_norm(palace: Optional[Dict]) -> float:
        if not palace:
            return 0.5  # Middle value for missing
        branch = palace.get("branch", "")
        if branch in EARTHLY_BRANCHES:
            idx = EARTHLY_BRANCHES.index(branch)
            return idx / 11.0  # Normalize 0-11 to 0-1
        return 0.5

    return [
        branch_to_norm(life_palace),
        branch_to_norm(conception_palace),
    ]


def normalize_luck_pillar(
    dayun: Optional[Dict],
    current_age: Optional[int] = None
) -> Optional[List[float]]:
    """
    Normalize current luck pillar to 3-dimensional vector.

    Args:
        dayun: DaYun result dict with 'pillars' list
        current_age: Current age to find active pillar

    Returns:
        3-dimensional vector [stem_norm, branch_norm, age_norm] or None
    """
    if not dayun or not current_age:
        return None

    pillars = dayun.get("pillars", [])
    if not pillars:
        return None

    # Find active pillar for current age
    active_pillar = None
    for p in pillars:
        age_start = p.get("age_start", 0)
        age_end = p.get("age_end", 0)
        if age_start <= current_age <= age_end:
            active_pillar = p
            break

    if not active_pillar:
        return None

    stem = active_pillar.get("stem", "")
    branch = active_pillar.get("branch", "")

    stem_norm = HEAVENLY_STEMS.index(stem) / 9.0 if stem in HEAVENLY_STEMS else 0.5
    branch_norm = EARTHLY_BRANCHES.index(branch) / 11.0 if branch in EARTHLY_BRANCHES else 0.5
    age_norm = min(1.0, current_age / 100.0)  # Normalize age to 0-1

    return [stem_norm, branch_norm, age_norm]


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def normalize_bazi_chart(
    chart_data: Dict[str, Any],
    current_age: Optional[int] = None,
    include_luck_pillar: bool = True,
) -> NormalizedBaZiVector:
    """
    Main entry point: normalize a complete BaZi chart to vector form.

    Args:
        chart_data: Complete BaZi chart dictionary (from BaZiChart.to_dict() or analyze_bazi())
        current_age: Current age for luck pillar calculation
        include_luck_pillar: Whether to include current luck pillar

    Returns:
        NormalizedBaZiVector ready for fusion
    """
    # Extract pillars - handle both formats
    pillars = chart_data.get("pillars", {})

    # Check if pillars is a list of tuples (from analyze_bazi) or dict (from BaZiChart)
    if isinstance(pillars, list):
        # Format: [(stem, branch), (stem, branch), ...]
        stems = [p[0] for p in pillars]
        branches = [p[1] for p in pillars]
    elif isinstance(pillars, dict):
        # Format: {"year": {"stem": ..., "branch": ...}, ...}
        # Could also be {"year": (stem, branch), ...}
        if "year" in pillars:
            year_p = pillars.get("year", {})
            month_p = pillars.get("month", {})
            day_p = pillars.get("day", {})
            hour_p = pillars.get("hour", {})

            # Check if values are tuples or dicts
            if isinstance(year_p, tuple):
                stems = [year_p[0], month_p[0], day_p[0], hour_p[0]]
                branches = [year_p[1], month_p[1], day_p[1], hour_p[1]]
            else:
                stems = [
                    year_p.get("stem", ""),
                    month_p.get("stem", ""),
                    day_p.get("stem", ""),
                    hour_p.get("stem", ""),
                ]
                branches = [
                    year_p.get("branch", ""),
                    month_p.get("branch", ""),
                    day_p.get("branch", ""),
                    hour_p.get("branch", ""),
                ]
        else:
            stems = ["", "", "", ""]
            branches = ["", "", "", ""]
    else:
        stems = ["", "", "", ""]
        branches = ["", "", "", ""]

    # Build ten gods count dict - handle both formats
    ten_gods_data = chart_data.get("ten_gods", [])
    ten_god_counts = {}

    if isinstance(ten_gods_data, list):
        for tg in ten_gods_data:
            if isinstance(tg, dict):
                god = tg.get("ten_god", "") or tg.get("god", "")
                if god:
                    ten_god_counts[god] = ten_god_counts.get(god, 0) + 1
            elif isinstance(tg, str):
                ten_god_counts[tg] = ten_god_counts.get(tg, 0) + 1
    elif isinstance(ten_gods_data, dict):
        ten_god_counts = ten_gods_data

    # Normalize each component
    elements = normalize_elements(chart_data.get("element_distribution", {}))
    ten_gods_vec, ten_god_groups = normalize_ten_gods(ten_god_counts)
    stems_vec = normalize_stems(stems)
    branches_vec = normalize_branches(branches)
    phases_vec = normalize_growth_phases(chart_data.get("growth_phases", {}))
    dm_strength = normalize_dm_strength(chart_data.get("dm_strength", {}))
    stars_vec = normalize_symbolic_stars(chart_data.get("symbolic_stars", []))
    palaces_vec = normalize_palaces(
        chart_data.get("life_palace", {}),
        chart_data.get("conception_palace")
    )

    # Luck pillar (optional)
    luck_vec = None
    if include_luck_pillar and current_age:
        luck_vec = normalize_luck_pillar(chart_data.get("dayun"), current_age)

    return NormalizedBaZiVector(
        elements=elements,
        ten_gods=ten_gods_vec,
        ten_god_groups=ten_god_groups,
        stems=stems_vec,
        branches=branches_vec,
        growth_phases=phases_vec,
        dm_strength=dm_strength,
        symbolic_stars=stars_vec,
        palaces=palaces_vec,
        luck_pillar=luck_vec,
    )


def bazi_vector_similarity(vec_a: NormalizedBaZiVector, vec_b: NormalizedBaZiVector) -> float:
    """
    Calculate cosine similarity between two normalized BaZi vectors.

    Args:
        vec_a: First normalized BaZi vector
        vec_b: Second normalized BaZi vector

    Returns:
        Similarity score in [0, 1]
    """
    a = vec_a.to_vector()
    b = vec_b.to_vector()

    # Handle dimension mismatch by truncating to shorter
    min_len = min(len(a), len(b))
    a = a[:min_len]
    b = b[:min_len]

    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    cosine = dot / (norm_a * norm_b)
    # Map from [-1, 1] to [0, 1]
    return (cosine + 1) / 2


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Main types
    "NormalizedBaZiVector",

    # Main functions
    "normalize_bazi_chart",
    "bazi_vector_similarity",

    # Component normalizers
    "normalize_elements",
    "normalize_ten_gods",
    "normalize_stems",
    "normalize_branches",
    "normalize_growth_phases",
    "normalize_dm_strength",
    "normalize_symbolic_stars",
    "normalize_palaces",
    "normalize_luck_pillar",

    # Constants
    "ELEMENTS",
    "TEN_GODS",
    "TEN_GOD_GROUPS",
    "HEAVENLY_STEMS",
    "EARTHLY_BRANCHES",
    "GROWTH_PHASES",
]
