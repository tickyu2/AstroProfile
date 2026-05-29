"""
western_engine/tuning_lab_constants.py

Constants for the Birth Time Tuning Lab scoring engine.
"""
from typing import Dict, List, Set, Tuple

# =============================================================================
# SIGN RULERS (traditional rulerships for chart ruler detection)
# =============================================================================
SIGN_RULER: Dict[str, str] = {
    "Aries": "Mars",
    "Taurus": "Venus",
    "Gemini": "Mercury",
    "Cancer": "Moon",
    "Leo": "Sun",
    "Virgo": "Mercury",
    "Libra": "Venus",
    "Scorpio": "Mars",       # Traditional ruler
    "Sagittarius": "Jupiter",
    "Capricorn": "Saturn",
    "Aquarius": "Saturn",    # Traditional ruler
    "Pisces": "Jupiter",     # Traditional ruler
}

# =============================================================================
# SCORING DIMENSION WEIGHTS (TicBot v1 Spec — sum = 1.00)
# =============================================================================
DIMENSION_WEIGHTS: Dict[str, float] = {
    "identityStability":        0.16,
    "chartCoherence":           0.10,
    "planetConditionComposite": 0.16,
    "luminaryQuality":          0.10,
    "angularDynamics":          0.12,
    "aspectArchitecture":       0.10,
    "lifeAreaEmphasis":         0.08,
    "eventBacktesting":         0.06,
    "interpretationRobustness": 0.12,
}

# =============================================================================
# PLANET CONDITION SUB-WEIGHTS (per-planet scoring)
# =============================================================================
PLANET_CONDITION_WEIGHTS: Dict[str, float] = {
    "Sun":     0.18,
    "Moon":    0.18,
    "Mercury": 0.14,
    "Venus":   0.14,
    "Mars":    0.14,
    "Jupiter": 0.11,
    "Saturn":  0.11,
}

# =============================================================================
# COMBUSTION THRESHOLDS (degrees from Sun)
# =============================================================================
COMBUSTION_CAZIMI_ORB = 0.28
COMBUSTION_COMBUST_ORB = 8.5
COMBUSTION_UNDER_BEAMS_ORB = 17.0

# Planets that can be combust (inner planets close to Sun)
COMBUSTIBLE_PLANETS = {"Mercury", "Venus"}

# =============================================================================
# HOUSE CLASSIFICATIONS
# =============================================================================
ANGULAR_HOUSES: Set[int] = {1, 4, 7, 10}
SUCCEDENT_HOUSES: Set[int] = {2, 5, 8, 11}
CADENT_HOUSES: Set[int] = {3, 6, 9, 12}

# =============================================================================
# ANGLE CUSP INDICES (0-indexed into 12-cusp tuple)
# ASC = cusp[0], IC = cusp[3], DSC = cusp[6], MC = cusp[9]
# =============================================================================
ANGLE_CUSP_INDICES: Dict[str, int] = {
    "ASC": 0,
    "IC": 3,
    "DSC": 6,
    "MC": 9,
}

# =============================================================================
# STABILITY ANALYSIS WINDOWS (minutes)
# =============================================================================
STABILITY_WINDOWS: List[int] = [1, 2, 5]

# =============================================================================
# LIFE AREA AXES (house pairs per life theme)
# =============================================================================
LIFE_AREA_AXES: Dict[str, Tuple[int, int]] = {
    "relationship": (5, 7),     # Romance + Partnership
    "career":       (6, 10),    # Work + Public life
    "creativity":   (3, 5),     # Communication + Creative expression
    "service":      (6, 12),    # Service + Spiritual service
    "spirituality": (9, 12),    # Philosophy + Transcendence
}

# =============================================================================
# TRADITIONAL PLANETS (scored in planet condition composite)
# =============================================================================
TRADITIONAL_PLANETS: List[str] = [
    "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
]

# =============================================================================
# SWE PLANET IDS (for lightweight chart calculator)
# =============================================================================
SWE_PLANET_IDS: Dict[str, int] = {
    "Sun":        0,
    "Moon":       1,
    "Mercury":    2,
    "Venus":      3,
    "Mars":       4,
    "Jupiter":    5,
    "Saturn":     6,
    "Uranus":     7,
    "Neptune":    8,
    "Pluto":      9,
    "North Node": 10,
    "Chiron":     15,
}

# =============================================================================
# ZODIAC SIGNS (in order, 0-11)
# =============================================================================
ZODIAC_SIGNS: List[str] = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

# =============================================================================
# SENSITIVITY CLIFF THRESHOLD (score delta between adjacent minutes)
# =============================================================================
CLIFF_THRESHOLD = 8.0

# =============================================================================
# STABLE WINDOW PARAMETERS
# =============================================================================
STABLE_WINDOW_MIN_WIDTH = 3       # Minimum minutes for a "stable" window
STABLE_WINDOW_MAX_VARIANCE = 4.0  # Max score variance within window
