"""
bazi_engine/hidden_stems.py

Hidden Stems (藏干) analysis and element distribution calculations.
Implements Joey Yap's approach to hidden stem strength and Day Master analysis.

Hidden stems represent the internal energies within each Earthly Branch:
- Main Qi (本气): Primary hidden stem, strongest influence
- Medium Qi (中气): Secondary hidden stem, moderate influence
- Residual Qi (余气): Tertiary hidden stem, minor influence
"""

from typing import List, Dict, Tuple, Optional
from functools import lru_cache
from .utils import (
    BRANCH_HIDDEN_STEMS,
    HIDDEN_STEM_WEIGHTS,
    ELEMENT_MAP,
    ELEMENTS,
    PRODUCES,
    CONTROLS
)


@lru_cache(maxsize=16)
def get_hidden_stems(branch: str) -> Tuple[str, ...]:
    """
    Get the hidden stems for an Earthly Branch.

    Args:
        branch: Earthly Branch (e.g., "Zi", "Chou", etc.)

    Returns:
        Tuple of hidden stems in order: (Main, Medium, Residual)
        CACHED: Only 12 possible branches, perfect for LRU cache.

    Example:
        >>> get_hidden_stems("Chou")
        ('Ji', 'Gui', 'Xin')  # 丑: 己 (Main), 癸 (Medium), 辛 (Residual)
    """
    if branch not in BRANCH_HIDDEN_STEMS:
        raise ValueError(f"Invalid branch: {branch}")
    return tuple(BRANCH_HIDDEN_STEMS[branch])


def get_hidden_stem_weights(branch: str) -> List[float]:
    """
    Get the strength weights for hidden stems in a branch.

    Args:
        branch: Earthly Branch

    Returns:
        List of weights matching the hidden stems order

    Example:
        >>> get_hidden_stem_weights("Chou")
        [0.6, 0.3, 0.1]  # Main: 60%, Medium: 30%, Residual: 10%
    """
    if branch not in HIDDEN_STEM_WEIGHTS:
        raise ValueError(f"Invalid branch: {branch}")
    return HIDDEN_STEM_WEIGHTS[branch].copy()


def get_weighted_hidden_stems(branch: str) -> List[Tuple[str, float]]:
    """
    Get hidden stems with their weights for a branch.

    Args:
        branch: Earthly Branch

    Returns:
        List of (stem, weight) tuples

    Example:
        >>> get_weighted_hidden_stems("Chou")
        [('Ji', 0.6), ('Gui', 0.3), ('Xin', 0.1)]
    """
    stems = get_hidden_stems(branch)
    weights = get_hidden_stem_weights(branch)
    return list(zip(stems, weights))


def element_distribution(pillars: List[Tuple[str, str]]) -> Dict[str, float]:
    """
    Calculate the element distribution across all Four Pillars.

    Considers:
    - Heavenly Stems (full weight of 1.0 each)
    - Hidden Stems within Earthly Branches (weighted by Main/Medium/Residual)

    Args:
        pillars: Four Pillars as [(stem, branch), ...]

    Returns:
        Dictionary of element -> percentage (0-100)

    Example:
        >>> pillars = [('Geng', 'Wu'), ('Xin', 'Si'), ('Gui', 'Hai'), ('Gui', 'Wei')]
        >>> dist = element_distribution(pillars)
        >>> print(dist)
        {'Wood': 12.5, 'Fire': 25.0, 'Earth': 18.75, 'Metal': 25.0, 'Water': 18.75}
    """
    element_scores = {e: 0.0 for e in ELEMENTS}

    for stem, branch in pillars:
        # Add Heavenly Stem element (weight 1.0)
        stem_element = ELEMENT_MAP[stem]
        element_scores[stem_element] += 1.0

        # Add Hidden Stem elements (weighted)
        for hidden_stem, weight in get_weighted_hidden_stems(branch):
            hidden_element = ELEMENT_MAP[hidden_stem]
            element_scores[hidden_element] += weight

    # Convert to percentages
    total = sum(element_scores.values())
    if total > 0:
        percentages = {e: (v / total) * 100 for e, v in element_scores.items()}
    else:
        percentages = {e: 20.0 for e in ELEMENTS}  # Equal distribution

    return percentages


def get_dominant_element(pillars: List[Tuple[str, str]]) -> str:
    """
    Get the dominant (strongest) element in the chart.

    Args:
        pillars: Four Pillars

    Returns:
        Name of dominant element
    """
    dist = element_distribution(pillars)
    return max(dist.items(), key=lambda x: x[1])[0]


def get_weakest_element(pillars: List[Tuple[str, str]]) -> str:
    """
    Get the weakest element in the chart.

    Args:
        pillars: Four Pillars

    Returns:
        Name of weakest element
    """
    dist = element_distribution(pillars)
    return min(dist.items(), key=lambda x: x[1])[0]


def day_master_strength(pillars: List[Tuple[str, str]]) -> Dict[str, any]:
    """
    Analyze the Day Master's strength based on seasonal and elemental support.

    This is a simplified version of Joey Yap's Day Master strength analysis.
    A full analysis would include:
    - Seasonal strength (month branch)
    - Support from other elements
    - Combinations and clashes

    Args:
        pillars: Four Pillars

    Returns:
        Dictionary with strength analysis:
        - score: 0.0 to 1.0 (0.5 = balanced)
        - classification: "under-supported" | "balanced" | "resource-abundant"
        - details: breakdown of supporting factors
    """
    day_master = pillars[2][0]  # Day stem
    dm_element = ELEMENT_MAP[day_master]

    # Get element distribution
    dist = element_distribution(pillars)

    # Calculate support score
    # Same element = strong support
    # Element that produces DM = support (Resource)
    # Element DM produces = slight drain (Output)
    # Element DM controls = energy spent (Wealth)
    # Element that controls DM = pressure (Power)

    dm_percentage = dist[dm_element]

    # Find supporting element (produces DM)
    resource_element = None
    for e, produces in PRODUCES.items():
        if produces == dm_element:
            resource_element = e
            break

    resource_percentage = dist.get(resource_element, 0) if resource_element else 0

    # Combined support
    support = dm_percentage + (resource_percentage * 0.7)

    # Normalize to 0-1 scale
    # Average balanced chart has ~20% per element
    # Support of 35+ suggests strong DM, support of 20- suggests weak DM
    score = min(1.0, max(0.0, (support - 15) / 30))

    # Classification
    if score < 0.40:
        classification = "under-supported"
    elif score > 0.60:
        classification = "resource-abundant"
    else:
        classification = "balanced"

    return {
        "score": round(score, 3),
        "classification": classification,
        "day_master": day_master,
        "day_master_element": dm_element,
        "details": {
            "self_element_percentage": round(dm_percentage, 2),
            "resource_element": resource_element,
            "resource_percentage": round(resource_percentage, 2),
            "combined_support": round(support, 2)
        }
    }


def get_seasonal_strength(month_branch: str, dm_element: str) -> str:
    """
    Determine the Day Master's seasonal strength.

    Each season strengthens or weakens certain elements:
    - Spring (Yin, Mao, Chen): Wood prospers, Metal weak
    - Summer (Si, Wu, Wei): Fire prospers, Water weak
    - Autumn (Shen, You, Xu): Metal prospers, Wood weak
    - Winter (Hai, Zi, Chou): Water prospers, Fire weak

    Args:
        month_branch: Month Earthly Branch
        dm_element: Day Master's element

    Returns:
        "prosperous" | "in-season" | "neutral" | "weak" | "dead"
    """
    season_strength = {
        # Spring
        "Yin": {"Wood": "prosperous", "Fire": "in-season", "Water": "neutral", "Metal": "weak", "Earth": "weak"},
        "Mao": {"Wood": "prosperous", "Fire": "in-season", "Water": "weak", "Metal": "dead", "Earth": "weak"},
        "Chen": {"Wood": "neutral", "Fire": "in-season", "Water": "weak", "Metal": "weak", "Earth": "in-season"},
        # Summer
        "Si": {"Fire": "prosperous", "Earth": "in-season", "Wood": "neutral", "Water": "weak", "Metal": "weak"},
        "Wu": {"Fire": "prosperous", "Earth": "in-season", "Wood": "weak", "Water": "dead", "Metal": "weak"},
        "Wei": {"Fire": "neutral", "Earth": "prosperous", "Wood": "weak", "Water": "weak", "Metal": "in-season"},
        # Autumn
        "Shen": {"Metal": "prosperous", "Water": "in-season", "Earth": "neutral", "Fire": "weak", "Wood": "weak"},
        "You": {"Metal": "prosperous", "Water": "in-season", "Earth": "weak", "Fire": "dead", "Wood": "weak"},
        "Xu": {"Metal": "neutral", "Water": "in-season", "Earth": "prosperous", "Fire": "weak", "Wood": "weak"},
        # Winter
        "Hai": {"Water": "prosperous", "Wood": "in-season", "Metal": "neutral", "Fire": "weak", "Earth": "weak"},
        "Zi": {"Water": "prosperous", "Wood": "in-season", "Metal": "weak", "Fire": "dead", "Earth": "weak"},
        "Chou": {"Water": "neutral", "Wood": "weak", "Metal": "in-season", "Fire": "weak", "Earth": "prosperous"}
    }

    if month_branch in season_strength:
        return season_strength[month_branch].get(dm_element, "neutral")

    return "neutral"


def all_hidden_stems_for_pillars(pillars: List[Tuple[str, str]]) -> Dict[str, List[Tuple[str, float]]]:
    """
    Get all hidden stems for each pillar.

    Args:
        pillars: Four Pillars

    Returns:
        Dictionary mapping pillar name to list of (hidden_stem, weight)
    """
    pillar_names = ["year", "month", "day", "hour"]
    result = {}

    for i, (stem, branch) in enumerate(pillars):
        name = pillar_names[i] if i < len(pillar_names) else f"pillar_{i}"
        result[name] = get_weighted_hidden_stems(branch)

    return result
