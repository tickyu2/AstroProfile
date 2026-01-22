"""
Western Synastry Heatmap

Planet-vs-planet compatibility grid using rule-based scoring:
- Base planet synastry scores
- Element pair harmonics
- Dignity interactions
- Sign compatibility

Creates a visual heatmap of relational dynamics.
"""

from typing import Dict, List, Tuple, Optional

# =============================================================================
# BASE PLANET SYNASTRY SCORES
# =============================================================================

# Natural planet-planet affinity (symmetric matrix)
# Score range: -2 (conflict) to +2 (harmony)
BASE_PLANET_SYNASTRY = {
    # Sun interactions
    ("Sun", "Sun"): 1.0,      # Identity recognition
    ("Sun", "Moon"): 1.5,     # Classic luminaries harmony
    ("Sun", "Mercury"): 0.8,  # Mind-identity blend
    ("Sun", "Venus"): 1.2,    # Love-identity attraction
    ("Sun", "Mars"): 0.5,     # Dynamic tension
    ("Sun", "Jupiter"): 1.3,  # Expansion of self
    ("Sun", "Saturn"): -0.5,  # Growth through limits
    ("Sun", "Uranus"): 0.3,   # Awakening identity
    ("Sun", "Neptune"): 0.2,  # Spiritual identity
    ("Sun", "Pluto"): 0.0,    # Transformative tension

    # Moon interactions
    ("Moon", "Moon"): 1.2,    # Emotional resonance
    ("Moon", "Mercury"): 0.7, # Emotional communication
    ("Moon", "Venus"): 1.5,   # Tender love
    ("Moon", "Mars"): 0.3,    # Passion vs security
    ("Moon", "Jupiter"): 1.2, # Emotional growth
    ("Moon", "Saturn"): -0.3, # Emotional containment
    ("Moon", "Uranus"): 0.0,  # Emotional disruption
    ("Moon", "Neptune"): 1.0, # Psychic bond
    ("Moon", "Pluto"): 0.2,   # Emotional intensity

    # Mercury interactions
    ("Mercury", "Mercury"): 1.0,  # Mental harmony
    ("Mercury", "Venus"): 1.0,    # Sweet communication
    ("Mercury", "Mars"): 0.4,     # Mental sparring
    ("Mercury", "Jupiter"): 1.1,  # Expanded thinking
    ("Mercury", "Saturn"): 0.5,   # Structured thought
    ("Mercury", "Uranus"): 0.8,   # Brilliant insights
    ("Mercury", "Neptune"): 0.3,  # Imaginative thought
    ("Mercury", "Pluto"): 0.4,    # Deep perception

    # Venus interactions
    ("Venus", "Venus"): 1.3,  # Mutual attraction
    ("Venus", "Mars"): 1.8,   # Passion and desire
    ("Venus", "Jupiter"): 1.4, # Abundant love
    ("Venus", "Saturn"): 0.2,  # Committed love
    ("Venus", "Uranus"): 0.5,  # Exciting love
    ("Venus", "Neptune"): 1.2, # Romantic idealism
    ("Venus", "Pluto"): 0.8,   # Intense attraction

    # Mars interactions
    ("Mars", "Mars"): 0.0,     # Competitive energy
    ("Mars", "Jupiter"): 0.9,  # Enthusiastic action
    ("Mars", "Saturn"): -0.5,  # Frustrated action
    ("Mars", "Uranus"): 0.6,   # Sudden action
    ("Mars", "Neptune"): -0.2, # Confused action
    ("Mars", "Pluto"): 0.5,    # Powerful drive

    # Jupiter interactions
    ("Jupiter", "Jupiter"): 1.0,  # Shared optimism
    ("Jupiter", "Saturn"): 0.3,   # Balanced expansion
    ("Jupiter", "Uranus"): 0.8,   # Progressive growth
    ("Jupiter", "Neptune"): 0.9,  # Spiritual expansion
    ("Jupiter", "Pluto"): 0.6,    # Transformative growth

    # Saturn interactions
    ("Saturn", "Saturn"): 0.5,    # Shared responsibility
    ("Saturn", "Uranus"): -0.3,   # Tradition vs change
    ("Saturn", "Neptune"): 0.0,   # Dreams vs reality
    ("Saturn", "Pluto"): 0.2,     # Power structures

    # Outer planet interactions
    ("Uranus", "Uranus"): 0.7,
    ("Uranus", "Neptune"): 0.4,
    ("Uranus", "Pluto"): 0.3,
    ("Neptune", "Neptune"): 0.8,
    ("Neptune", "Pluto"): 0.5,
    ("Pluto", "Pluto"): 0.6,
}

# =============================================================================
# ELEMENT PAIR SCORES
# =============================================================================

# Element compatibility (used as modifier)
ELEMENT_PAIR_SCORES = {
    ("Fire", "Fire"): 0.8,    # Same element harmony
    ("Fire", "Earth"): -0.3,  # Tension
    ("Fire", "Air"): 1.0,     # Natural flow
    ("Fire", "Water"): -0.2,  # Steam/tension

    ("Earth", "Earth"): 0.8,
    ("Earth", "Air"): -0.2,   # Mild tension
    ("Earth", "Water"): 0.9,  # Nurturing flow

    ("Air", "Air"): 0.8,
    ("Air", "Water"): -0.3,   # Different wavelengths

    ("Water", "Water"): 0.8,
}

# =============================================================================
# SIGN COMPATIBILITY (by element/modality)
# =============================================================================

SIGN_ELEMENT = {
    "Aries": "Fire", "Taurus": "Earth", "Gemini": "Air", "Cancer": "Water",
    "Leo": "Fire", "Virgo": "Earth", "Libra": "Air", "Scorpio": "Water",
    "Sagittarius": "Fire", "Capricorn": "Earth", "Aquarius": "Air", "Pisces": "Water"
}

SIGN_MODALITY = {
    "Aries": "Cardinal", "Taurus": "Fixed", "Gemini": "Mutable", "Cancer": "Cardinal",
    "Leo": "Fixed", "Virgo": "Mutable", "Libra": "Cardinal", "Scorpio": "Fixed",
    "Sagittarius": "Mutable", "Capricorn": "Cardinal", "Aquarius": "Fixed", "Pisces": "Mutable"
}

# Modality interaction scores
MODALITY_PAIR_SCORES = {
    ("Cardinal", "Cardinal"): 0.5,   # Competition
    ("Cardinal", "Fixed"): 0.3,      # Leader vs stubborn
    ("Cardinal", "Mutable"): 0.7,    # Initiative + flexibility
    ("Fixed", "Fixed"): 0.4,         # Both stubborn
    ("Fixed", "Mutable"): 0.6,       # Stability + adaptation
    ("Mutable", "Mutable"): 0.5,     # Both changeable
}


# =============================================================================
# CORE SCORING FUNCTIONS
# =============================================================================

def base_planet_synastry_score(planet1: str, planet2: str) -> float:
    """
    Get base synastry score between two planets.

    Returns value between -2 and +2.
    """
    # Check both orderings (matrix is symmetric)
    key = (planet1, planet2)
    if key in BASE_PLANET_SYNASTRY:
        return BASE_PLANET_SYNASTRY[key]

    key_reversed = (planet2, planet1)
    if key_reversed in BASE_PLANET_SYNASTRY:
        return BASE_PLANET_SYNASTRY[key_reversed]

    # Default for unknown pairs
    return 0.0


def element_pair_score(element1: str, element2: str) -> float:
    """
    Get element compatibility score.

    Returns modifier between -0.5 and +1.0.
    """
    key = (element1, element2)
    if key in ELEMENT_PAIR_SCORES:
        return ELEMENT_PAIR_SCORES[key]

    key_reversed = (element2, element1)
    if key_reversed in ELEMENT_PAIR_SCORES:
        return ELEMENT_PAIR_SCORES[key_reversed]

    return 0.0


def modality_pair_score(modality1: str, modality2: str) -> float:
    """
    Get modality compatibility score.

    Returns modifier between 0 and 1.
    """
    key = (modality1, modality2)
    if key in MODALITY_PAIR_SCORES:
        return MODALITY_PAIR_SCORES[key]

    key_reversed = (modality2, modality1)
    if key_reversed in MODALITY_PAIR_SCORES:
        return MODALITY_PAIR_SCORES[key_reversed]

    return 0.5


def compute_planet_pair_score(
    planet1: str, sign1: str, dignity1: str,
    planet2: str, sign2: str, dignity2: str
) -> Dict:
    """
    Compute full synastry score between two planet placements.

    Combines:
    - Base planet synastry (60%)
    - Element pair score (25%)
    - Dignity modifier (15%)
    """
    # Base score
    base = base_planet_synastry_score(planet1, planet2)

    # Element compatibility
    elem1 = SIGN_ELEMENT.get(sign1, "Fire")
    elem2 = SIGN_ELEMENT.get(sign2, "Fire")
    element_mod = element_pair_score(elem1, elem2)

    # Modality compatibility
    mod1 = SIGN_MODALITY.get(sign1, "Cardinal")
    mod2 = SIGN_MODALITY.get(sign2, "Cardinal")
    modality_mod = modality_pair_score(mod1, mod2)

    # Dignity modifier
    dignity_scores = {
        "Exalted": 0.3,
        "Domicile": 0.2,
        "Neutral": 0.0,
        "Detriment": -0.15,
        "Debilitated": -0.25
    }
    dignity_mod = (
        dignity_scores.get(dignity1, 0) +
        dignity_scores.get(dignity2, 0)
    ) / 2

    # Combined score
    combined = (
        base * 0.50 +
        element_mod * 0.25 +
        modality_mod * 0.15 +
        dignity_mod * 0.10
    )

    # Normalize to 0-100 scale
    # Original range approximately -1.5 to +2.0
    normalized = ((combined + 1.5) / 3.5) * 100
    normalized = max(0, min(100, normalized))

    # Determine intensity label
    if normalized >= 75:
        intensity = "very_high"
        label = "Powerful Synergy"
    elif normalized >= 60:
        intensity = "high"
        label = "Strong Connection"
    elif normalized >= 45:
        intensity = "medium"
        label = "Balanced Dynamic"
    elif normalized >= 30:
        intensity = "low"
        label = "Mild Tension"
    else:
        intensity = "very_low"
        label = "Challenging Friction"

    return {
        "planet1": planet1,
        "sign1": sign1,
        "planet2": planet2,
        "sign2": sign2,
        "baseScore": round(base, 3),
        "elementModifier": round(element_mod, 3),
        "modalityModifier": round(modality_mod, 3),
        "dignityModifier": round(dignity_mod, 3),
        "combinedScore": round(combined, 3),
        "normalizedScore": round(normalized, 1),
        "intensity": intensity,
        "label": label
    }


# =============================================================================
# HEATMAP BUILDER
# =============================================================================

def build_western_synastry_heatmap(
    person_a_planets: List[Dict],
    person_b_planets: List[Dict],
    include_planets: Optional[List[str]] = None
) -> Dict:
    """
    Build complete synastry heatmap grid.

    person_a_planets = [
        {"planet": "Sun", "sign": "Leo", "dignity": "Domicile"},
        {"planet": "Moon", "sign": "Cancer", "dignity": "Domicile"},
        ...
    ]

    Returns 2D grid with scores and summary statistics.
    """
    # Default to personal planets + luminaries
    if include_planets is None:
        include_planets = [
            "Sun", "Moon", "Mercury", "Venus", "Mars",
            "Jupiter", "Saturn"
        ]

    # Filter planets
    a_planets = [p for p in person_a_planets if p.get("planet") in include_planets]
    b_planets = [p for p in person_b_planets if p.get("planet") in include_planets]

    # Build grid
    grid = []
    all_scores = []
    high_synergy = []
    challenging = []

    for a_p in a_planets:
        row = []
        for b_p in b_planets:
            cell = compute_planet_pair_score(
                a_p.get("planet", "Sun"),
                a_p.get("sign", "Aries"),
                a_p.get("dignity", "Neutral"),
                b_p.get("planet", "Sun"),
                b_p.get("sign", "Aries"),
                b_p.get("dignity", "Neutral")
            )
            row.append(cell)
            all_scores.append(cell["normalizedScore"])

            # Track extremes
            if cell["normalizedScore"] >= 75:
                high_synergy.append({
                    "planetA": a_p.get("planet"),
                    "planetB": b_p.get("planet"),
                    "score": cell["normalizedScore"],
                    "label": cell["label"]
                })
            elif cell["normalizedScore"] < 30:
                challenging.append({
                    "planetA": a_p.get("planet"),
                    "planetB": b_p.get("planet"),
                    "score": cell["normalizedScore"],
                    "label": cell["label"]
                })

        grid.append(row)

    # Calculate summary statistics
    avg_score = sum(all_scores) / len(all_scores) if all_scores else 50
    max_score = max(all_scores) if all_scores else 0
    min_score = min(all_scores) if all_scores else 0

    # Overall compatibility assessment
    if avg_score >= 65:
        overall = "Highly Compatible"
        overall_desc = "The synastry shows strong natural affinity between planetary energies."
    elif avg_score >= 50:
        overall = "Moderately Compatible"
        overall_desc = "The synastry shows balanced dynamics with areas of harmony and growth."
    elif avg_score >= 40:
        overall = "Mixed Dynamics"
        overall_desc = "The synastry contains both supportive and challenging aspects requiring conscious navigation."
    else:
        overall = "Challenging Dynamics"
        overall_desc = "The synastry shows significant friction that invites deep transformation work."

    # Generate narrative
    narrative_parts = []

    if high_synergy:
        top_synergy = sorted(high_synergy, key=lambda x: x["score"], reverse=True)[:3]
        planets = [f"{s['planetA']}-{s['planetB']}" for s in top_synergy]
        narrative_parts.append(
            f"Strong synergy flows through {', '.join(planets)} connections."
        )

    if challenging:
        top_challenge = sorted(challenging, key=lambda x: x["score"])[:2]
        planets = [f"{c['planetA']}-{c['planetB']}" for c in top_challenge]
        narrative_parts.append(
            f"Growth edges appear in {', '.join(planets)} dynamics."
        )

    narrative = " ".join(narrative_parts) if narrative_parts else overall_desc

    return {
        "grid": grid,
        "rowPlanets": [p.get("planet") for p in a_planets],
        "colPlanets": [p.get("planet") for p in b_planets],
        "averageScore": round(avg_score, 1),
        "maxScore": round(max_score, 1),
        "minScore": round(min_score, 1),
        "highSynergy": sorted(high_synergy, key=lambda x: x["score"], reverse=True),
        "challenging": sorted(challenging, key=lambda x: x["score"]),
        "overall": overall,
        "overallDescription": overall_desc,
        "narrative": narrative
    }


# =============================================================================
# HEATMAP VISUALIZATION DATA
# =============================================================================

def get_heatmap_color(score: float) -> Dict:
    """
    Get color data for heatmap cell based on score.

    Returns RGB values and CSS color string.
    """
    # Color gradient: red (0) -> yellow (50) -> green (100)
    if score < 50:
        # Red to yellow
        ratio = score / 50
        r = 220
        g = int(50 + (170 * ratio))
        b = 50
    else:
        # Yellow to green
        ratio = (score - 50) / 50
        r = int(220 - (170 * ratio))
        g = 220
        b = 50

    return {
        "r": r,
        "g": g,
        "b": b,
        "hex": f"#{r:02x}{g:02x}{b:02x}",
        "rgb": f"rgb({r}, {g}, {b})",
        "alpha": min(1.0, 0.3 + (score / 100) * 0.7)
    }


def build_heatmap_visualization(heatmap: Dict) -> Dict:
    """
    Add visualization data to heatmap.

    Includes colors, gradients, and display-ready data.
    """
    grid = heatmap.get("grid", [])
    colored_grid = []

    for row in grid:
        colored_row = []
        for cell in row:
            score = cell.get("normalizedScore", 50)
            color = get_heatmap_color(score)
            colored_row.append({
                **cell,
                "color": color
            })
        colored_grid.append(colored_row)

    return {
        **heatmap,
        "coloredGrid": colored_grid,
        "colorScale": {
            "min": {"score": 0, "color": get_heatmap_color(0)},
            "mid": {"score": 50, "color": get_heatmap_color(50)},
            "max": {"score": 100, "color": get_heatmap_color(100)}
        }
    }
