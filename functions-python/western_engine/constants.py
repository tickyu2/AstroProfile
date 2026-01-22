"""
western_engine/constants.py

Constants for Western astrology calculations.
Mirrors structure from westernEngineService.js for consistency.
"""

from typing import Dict, List, Tuple

# =============================================================================
# ZODIAC SIGNS
# =============================================================================

ZODIAC_SIGNS: List[str] = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Sign boundaries (month, day) - start of each sign
SIGN_BOUNDARIES: List[Tuple[int, int]] = [
    (3, 21),   # Aries
    (4, 20),   # Taurus
    (5, 21),   # Gemini
    (6, 21),   # Cancer
    (7, 23),   # Leo
    (8, 23),   # Virgo
    (9, 23),   # Libra
    (10, 23),  # Scorpio
    (11, 22),  # Sagittarius
    (12, 22),  # Capricorn
    (1, 20),   # Aquarius
    (2, 19),   # Pisces
]

# =============================================================================
# ELEMENTS & MODALITIES
# =============================================================================

SIGN_ELEMENT: Dict[str, str] = {
    "Aries": "Fire",
    "Taurus": "Earth",
    "Gemini": "Air",
    "Cancer": "Water",
    "Leo": "Fire",
    "Virgo": "Earth",
    "Libra": "Air",
    "Scorpio": "Water",
    "Sagittarius": "Fire",
    "Capricorn": "Earth",
    "Aquarius": "Air",
    "Pisces": "Water"
}

SIGN_MODALITY: Dict[str, str] = {
    "Aries": "Cardinal",
    "Taurus": "Fixed",
    "Gemini": "Mutable",
    "Cancer": "Cardinal",
    "Leo": "Fixed",
    "Virgo": "Mutable",
    "Libra": "Cardinal",
    "Scorpio": "Fixed",
    "Sagittarius": "Mutable",
    "Capricorn": "Cardinal",
    "Aquarius": "Fixed",
    "Pisces": "Mutable"
}

SIGN_POLARITY: Dict[str, str] = {
    "Aries": "Yang",
    "Taurus": "Yin",
    "Gemini": "Yang",
    "Cancer": "Yin",
    "Leo": "Yang",
    "Virgo": "Yin",
    "Libra": "Yang",
    "Scorpio": "Yin",
    "Sagittarius": "Yang",
    "Capricorn": "Yin",
    "Aquarius": "Yang",
    "Pisces": "Yin"
}

# =============================================================================
# PLANETARY DATA
# =============================================================================

PLANETS: List[str] = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
    "Ascendant", "Midheaven", "North Node", "Chiron", "Lilith"
]

PERSONAL_PLANETS: List[str] = ["Sun", "Moon", "Mercury", "Venus", "Mars"]
SOCIAL_PLANETS: List[str] = ["Jupiter", "Saturn"]
OUTER_PLANETS: List[str] = ["Uranus", "Neptune", "Pluto"]
ANGLES: List[str] = ["Ascendant", "Midheaven"]

# Weights for element/modality/polarity calculations
PLANET_WEIGHTS: Dict[str, float] = {
    "Sun": 1.0,
    "Moon": 1.0,
    "Mercury": 0.8,
    "Venus": 0.8,
    "Mars": 0.8,
    "Jupiter": 0.6,
    "Saturn": 0.6,
    "Uranus": 0.4,
    "Neptune": 0.4,
    "Pluto": 0.4,
    "Ascendant": 1.0,
    "Midheaven": 0.6,
    "North Node": 0.3,
    "South Node": 0.3,
    "Chiron": 0.3,
    "Lilith": 0.2
}

# =============================================================================
# PLANETARY DIGNITIES
# =============================================================================

EXALTATION: Dict[str, str] = {
    "Sun": "Aries",
    "Moon": "Taurus",
    "Mercury": "Virgo",
    "Venus": "Pisces",
    "Mars": "Capricorn",
    "Jupiter": "Cancer",
    "Saturn": "Libra"
}

DEBILITATION: Dict[str, str] = {
    "Sun": "Libra",
    "Moon": "Scorpio",
    "Mercury": "Pisces",
    "Venus": "Virgo",
    "Mars": "Cancer",
    "Jupiter": "Capricorn",
    "Saturn": "Aries"
}

DOMICILE: Dict[str, List[str]] = {
    "Sun": ["Leo"],
    "Moon": ["Cancer"],
    "Mercury": ["Gemini", "Virgo"],
    "Venus": ["Taurus", "Libra"],
    "Mars": ["Aries", "Scorpio"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Saturn": ["Capricorn", "Aquarius"],
    "Uranus": ["Aquarius"],
    "Neptune": ["Pisces"],
    "Pluto": ["Scorpio"]
}

DETRIMENT: Dict[str, List[str]] = {
    "Sun": ["Aquarius"],
    "Moon": ["Capricorn"],
    "Mercury": ["Sagittarius", "Pisces"],
    "Venus": ["Aries", "Scorpio"],
    "Mars": ["Taurus", "Libra"],
    "Jupiter": ["Gemini", "Virgo"],
    "Saturn": ["Cancer", "Leo"],
    "Uranus": ["Leo"],
    "Neptune": ["Virgo"],
    "Pluto": ["Taurus"]
}

# Dignity strength modifiers
DIGNITY_MODIFIERS: Dict[str, float] = {
    "Exalted": 1.20,
    "Domicile": 1.15,
    "Neutral": 1.00,
    "Detriment": 0.90,
    "Debilitated": 0.80
}

# =============================================================================
# ASPECTS
# =============================================================================

ASPECT_TYPES: Dict[str, Dict] = {
    "conjunction": {"angle": 0, "symbol": "☌", "nature": "major", "harmony": "neutral"},
    "opposition": {"angle": 180, "symbol": "☍", "nature": "major", "harmony": "challenging"},
    "trine": {"angle": 120, "symbol": "△", "nature": "major", "harmony": "harmonious"},
    "square": {"angle": 90, "symbol": "□", "nature": "major", "harmony": "challenging"},
    "sextile": {"angle": 60, "symbol": "⚹", "nature": "major", "harmony": "harmonious"},
    "quincunx": {"angle": 150, "symbol": "⚻", "nature": "minor", "harmony": "challenging"},
    "semi-sextile": {"angle": 30, "symbol": "⚺", "nature": "minor", "harmony": "neutral"},
    "semi-square": {"angle": 45, "symbol": "∠", "nature": "minor", "harmony": "challenging"},
    "sesquiquadrate": {"angle": 135, "symbol": "⚼", "nature": "minor", "harmony": "challenging"},
    "quintile": {"angle": 72, "symbol": "Q", "nature": "minor", "harmony": "harmonious"},
    "biquintile": {"angle": 144, "symbol": "bQ", "nature": "minor", "harmony": "harmonious"}
}

# Orbs for aspects (degrees)
ASPECT_ORBS: Dict[str, Dict[str, float]] = {
    "conjunction": {"tight": 3, "wide": 8, "max": 10},
    "opposition": {"tight": 3, "wide": 8, "max": 10},
    "trine": {"tight": 3, "wide": 6, "max": 8},
    "square": {"tight": 3, "wide": 6, "max": 8},
    "sextile": {"tight": 2, "wide": 4, "max": 6},
    "quincunx": {"tight": 2, "wide": 3, "max": 5},
    "semi-sextile": {"tight": 1, "wide": 2, "max": 3},
    "semi-square": {"tight": 1, "wide": 2, "max": 3},
    "sesquiquadrate": {"tight": 1, "wide": 2, "max": 3},
    "quintile": {"tight": 1, "wide": 2, "max": 3},
    "biquintile": {"tight": 1, "wide": 2, "max": 3}
}

# Planet-specific orb adjustments (luminaries get wider orbs)
PLANET_ORB_ADJUSTMENTS: Dict[str, float] = {
    "Sun": 1.2,
    "Moon": 1.2,
    "Mercury": 1.0,
    "Venus": 1.0,
    "Mars": 1.0,
    "Jupiter": 1.0,
    "Saturn": 1.0,
    "Uranus": 0.8,
    "Neptune": 0.8,
    "Pluto": 0.8,
    "Ascendant": 1.0,
    "Midheaven": 1.0,
    "North Node": 0.8,
    "Chiron": 0.8,
    "Lilith": 0.7
}

# =============================================================================
# CHART SHAPES (Marc Edmund Jones)
# =============================================================================

CHART_SHAPES: Dict[str, Dict] = {
    "bowl": {
        "description": "All planets within 180 degrees",
        "interpretation": "Self-contained, focused, driven by what's missing",
        "span_range": (170, 200)
    },
    "bucket": {
        "description": "Bowl with one planet as 'handle' opposite",
        "interpretation": "Directed focus, one planet channels all energy",
        "span_range": (170, 200)
    },
    "locomotive": {
        "description": "Planets span 2/3 of chart, 1/3 empty",
        "interpretation": "Self-driving, determined, strong initiative",
        "span_range": (210, 280)
    },
    "bundle": {
        "description": "All planets within 120 degrees",
        "interpretation": "Highly focused, specialist, concentrated energy",
        "span_range": (0, 130)
    },
    "splash": {
        "description": "Planets distributed evenly around chart",
        "interpretation": "Versatile, scattered interests, universal awareness",
        "span_range": None  # Determined by low variance
    },
    "seesaw": {
        "description": "Two groups of planets opposite each other",
        "interpretation": "Balancing opposites, diplomatic, sees both sides",
        "span_range": None  # Determined by two large gaps
    },
    "splay": {
        "description": "Irregular distribution with stelliums",
        "interpretation": "Individual, nonconformist, strong focal points",
        "span_range": None
    }
}

# =============================================================================
# ARCHETYPE MAPPINGS
# =============================================================================

# Map signs to 9 archetypes (combining Capricorn/Aquarius/Pisces into 3)
SIGN_TO_ARCHETYPE: Dict[str, str] = {
    "Aries": "Warrior",
    "Taurus": "Builder",
    "Gemini": "Messenger",
    "Cancer": "Nurturer",
    "Leo": "Performer",
    "Virgo": "Analyst",
    "Libra": "Harmonizer",
    "Scorpio": "Transformer",
    "Sagittarius": "Philosopher",
    "Capricorn": "Architect",    # Combined with Builder archetype
    "Aquarius": "Visionary",     # Combined with Messenger archetype
    "Pisces": "Mystic"           # Combined with Nurturer archetype
}

# 9-dimensional archetype vector indices
ARCHETYPE_INDICES: Dict[str, int] = {
    "Warrior": 0,      # Aries
    "Builder": 1,      # Taurus, Capricorn
    "Messenger": 2,    # Gemini, Aquarius
    "Nurturer": 3,     # Cancer, Pisces
    "Performer": 4,    # Leo
    "Analyst": 5,      # Virgo
    "Harmonizer": 6,   # Libra
    "Transformer": 7,  # Scorpio
    "Philosopher": 8   # Sagittarius
}

# =============================================================================
# CUSP PARAMETERS (6-6 Model)
# =============================================================================

CUSP_BLEND_DAYS = 6  # Days of cusp influence
CUSP_BLEND_POWER = 1.6  # Nonlinear blending exponent

# Element interactions for cusp blending
ELEMENT_INTERACTIONS: Dict[str, str] = {
    "Fire-Fire": "Amplified Flame",
    "Fire-Earth": "Molten Core",
    "Fire-Air": "Rising Heat",
    "Fire-Water": "Steam Rising",
    "Earth-Fire": "Volcanic Foundation",
    "Earth-Earth": "Solid Ground",
    "Earth-Air": "Dust Storm",
    "Earth-Water": "Fertile Soil",
    "Air-Fire": "Wildfire Spread",
    "Air-Earth": "Eroding Wind",
    "Air-Air": "Whirlwind",
    "Air-Water": "Mist Rising",
    "Water-Fire": "Evaporation",
    "Water-Earth": "Nourishing Flow",
    "Water-Air": "Ocean Breeze",
    "Water-Water": "Deep Current"
}

# =============================================================================
# SECTION WEIGHTS FOR COMPATIBILITY
# =============================================================================

DEFAULT_SECTION_WEIGHTS: Dict[str, float] = {
    "element": 0.20,
    "modality": 0.10,
    "house": 0.15,
    "planetary": 0.20,
    "archetype": 0.10,
    "aspect": 0.10,
    "dominance": 0.10,
    "shape": 0.05
}

# Gamma weight for Western in total compatibility formula
DEFAULT_GAMMA = 0.15

# =============================================================================
# 16-AXIS ARCHETYPE BASIS (Mythic Psychology Space)
# =============================================================================

# Each axis represents a psychological dimension [0, 1]
# Higher values indicate stronger expression of that trait
ARCHETYPE_AXES: list[str] = [
    "Initiator",        # 0: Drive to start, pioneer energy, action-oriented
    "Stabilizer",       # 1: Capacity to maintain, preserve, hold steady
    "Relational",       # 2: Other-oriented focus, partnership, connection
    "MindCentered",     # 3: Mental/analytical, thought-oriented
    "Intuitive",        # 4: Feeling/symbolic, sensing, inner knowing
    "Concrete",         # 5: Sensory/real, practical, material focus
    "Expressive",       # 6: Outward display, communication, visibility
    "Transpersonal",    # 7: Collective themes, universal, beyond ego
    "RiskSeeking",      # 8: Exploration, adventure, pushing boundaries
    "OrderOriented",    # 9: Need for structure, control, organization
    "FluidIdentity",    # 10: Adaptive identity, flexibility, change-comfort
    "Warm",             # 11: Emotional warmth, connection, empathy
    "Direct",           # 12: Straightforward, honest, transparent approach
    "DepthOriented",    # 13: Psychological depth, intensity, transformation
    "Sustainer",        # 14: Supportive/holding, nurturing, maintaining
    "BoundaryAware",    # 15: Clear limits, self-definition, protection
]

# Sign archetypes mapped to 16-axis basis
# Values in [0, 1] representing strength of each trait
# New axis ordering:
#   0: Initiator, 1: Stabilizer, 2: Relational, 3: MindCentered,
#   4: Intuitive, 5: Concrete, 6: Expressive, 7: Transpersonal,
#   8: RiskSeeking, 9: OrderOriented, 10: FluidIdentity, 11: Warm,
#   12: Direct, 13: DepthOriented, 14: Sustainer, 15: BoundaryAware
SIGN_ARCHETYPE_VECTORS: Dict[str, list[float]] = {
    # Aries: Pioneer, warrior, initiator - high drive, risk-seeking, direct
    "Aries": [
        0.90,  # 0: Initiator - very high (pioneering energy)
        0.20,  # 1: Stabilizer - low (prefers action over maintenance)
        0.30,  # 2: Relational - moderate-low (independent)
        0.30,  # 3: MindCentered - low (action over thought)
        0.40,  # 4: Intuitive - moderate (instinctive)
        0.50,  # 5: Concrete - moderate (present-focused)
        0.80,  # 6: Expressive - high (outward energy)
        0.30,  # 7: Transpersonal - low (personal focus)
        0.90,  # 8: RiskSeeking - very high (courageous)
        0.20,  # 9: OrderOriented - low (spontaneous)
        0.40,  # 10: FluidIdentity - moderate (knows who they are)
        0.60,  # 11: Warm - moderate-high (passionate)
        0.90,  # 12: Direct - very high (straightforward)
        0.40,  # 13: DepthOriented - moderate (surface action)
        0.20,  # 14: Sustainer - low (starting over sustaining)
        0.70,  # 15: BoundaryAware - high (self-defined)
    ],
    # Taurus: Builder, stabilizer - grounded, sensual, persistent
    "Taurus": [
        0.30,  # 0: Initiator - low (prefers stability)
        0.90,  # 1: Stabilizer - very high (maintains)
        0.50,  # 2: Relational - moderate (loyal but slow to connect)
        0.40,  # 3: MindCentered - moderate (practical thinking)
        0.50,  # 4: Intuitive - moderate (body wisdom)
        0.90,  # 5: Concrete - very high (sensory, material)
        0.40,  # 6: Expressive - moderate (quiet presence)
        0.20,  # 7: Transpersonal - low (personal focus)
        0.10,  # 8: RiskSeeking - very low (security-oriented)
        0.80,  # 9: OrderOriented - high (structured)
        0.20,  # 10: FluidIdentity - low (fixed sense of self)
        0.70,  # 11: Warm - high (affectionate)
        0.50,  # 12: Direct - moderate (patient approach)
        0.50,  # 13: DepthOriented - moderate (sensory depth)
        0.90,  # 14: Sustainer - very high (nurturing through provision)
        0.80,  # 15: BoundaryAware - high (knows limits)
    ],
    # Gemini: Messenger, communicator - curious, adaptable, mental
    "Gemini": [
        0.60,  # 0: Initiator - moderate-high (starts conversations)
        0.30,  # 1: Stabilizer - low (variety-seeking)
        0.70,  # 2: Relational - high (socially oriented)
        0.90,  # 3: MindCentered - very high (intellectual)
        0.40,  # 4: Intuitive - moderate (more rational)
        0.30,  # 5: Concrete - low (abstract thinker)
        0.90,  # 6: Expressive - very high (communicative)
        0.40,  # 7: Transpersonal - moderate (curious about ideas)
        0.60,  # 8: RiskSeeking - moderate-high (tries new things)
        0.30,  # 9: OrderOriented - low (flexible)
        0.80,  # 10: FluidIdentity - high (adaptable self)
        0.50,  # 11: Warm - moderate (friendly but light)
        0.60,  # 12: Direct - moderate-high (says what thinks)
        0.30,  # 13: DepthOriented - low (breadth over depth)
        0.30,  # 14: Sustainer - low (moves on quickly)
        0.40,  # 15: BoundaryAware - moderate (flexible boundaries)
    ],
    # Cancer: Nurturer, protector - emotional, caring, intuitive
    "Cancer": [
        0.30,  # 0: Initiator - low (reactive)
        0.70,  # 1: Stabilizer - high (protects home)
        0.80,  # 2: Relational - very high (family-oriented)
        0.30,  # 3: MindCentered - low (emotional logic)
        0.90,  # 4: Intuitive - very high (emotional sensing)
        0.50,  # 5: Concrete - moderate (home/security)
        0.50,  # 6: Expressive - moderate (selective sharing)
        0.40,  # 7: Transpersonal - moderate (tribe-focused)
        0.20,  # 8: RiskSeeking - low (protective)
        0.50,  # 9: OrderOriented - moderate (home structure)
        0.50,  # 10: FluidIdentity - moderate (moods shift)
        0.90,  # 11: Warm - very high (nurturing warmth)
        0.40,  # 12: Direct - moderate-low (indirect/protective)
        0.70,  # 13: DepthOriented - high (emotional depth)
        0.90,  # 14: Sustainer - very high (caretaker)
        0.60,  # 15: BoundaryAware - moderate-high (shell protection)
    ],
    # Leo: Performer, creator - expressive, warm, confident
    "Leo": [
        0.80,  # 0: Initiator - high (creative spark)
        0.50,  # 1: Stabilizer - moderate (maintains pride)
        0.60,  # 2: Relational - moderate-high (needs audience)
        0.40,  # 3: MindCentered - moderate (heart over head)
        0.50,  # 4: Intuitive - moderate (creative instinct)
        0.50,  # 5: Concrete - moderate (physical presence)
        0.95,  # 6: Expressive - very high (theatrical)
        0.30,  # 7: Transpersonal - low (personal glory)
        0.70,  # 8: RiskSeeking - high (dramatic flair)
        0.40,  # 9: OrderOriented - moderate (royal court)
        0.30,  # 10: FluidIdentity - low (fixed self-image)
        0.80,  # 11: Warm - very high (generous warmth)
        0.80,  # 12: Direct - high (confident expression)
        0.50,  # 13: DepthOriented - moderate (heart depth)
        0.50,  # 14: Sustainer - moderate (protects pride)
        0.70,  # 15: BoundaryAware - high (self-respect)
    ],
    # Virgo: Analyst, healer - precise, practical, helpful
    "Virgo": [
        0.30,  # 0: Initiator - low (responds to need)
        0.80,  # 1: Stabilizer - high (maintains systems)
        0.50,  # 2: Relational - moderate (service-oriented)
        0.90,  # 3: MindCentered - very high (analytical)
        0.40,  # 4: Intuitive - moderate (practical sensing)
        0.90,  # 5: Concrete - very high (detail-focused)
        0.30,  # 6: Expressive - low (modest, reserved)
        0.30,  # 7: Transpersonal - low (practical focus)
        0.20,  # 8: RiskSeeking - low (cautious)
        0.95,  # 9: OrderOriented - very high (systematic)
        0.30,  # 10: FluidIdentity - low (defined by role)
        0.50,  # 11: Warm - moderate (shows through service)
        0.70,  # 12: Direct - high (precise communication)
        0.60,  # 13: DepthOriented - moderate-high (thorough)
        0.70,  # 14: Sustainer - high (maintains health)
        0.70,  # 15: BoundaryAware - high (discerning)
    ],
    # Libra: Harmonizer, diplomat - balanced, aesthetic, relational
    "Libra": [
        0.40,  # 0: Initiator - moderate (initiates harmony)
        0.50,  # 1: Stabilizer - moderate (balance-seeking)
        0.95,  # 2: Relational - very high (partnership-oriented)
        0.60,  # 3: MindCentered - moderate-high (weighing options)
        0.50,  # 4: Intuitive - moderate (aesthetic sense)
        0.40,  # 5: Concrete - moderate (beauty in form)
        0.70,  # 6: Expressive - high (social grace)
        0.50,  # 7: Transpersonal - moderate (justice-minded)
        0.40,  # 8: RiskSeeking - moderate (avoids conflict)
        0.50,  # 9: OrderOriented - moderate (seeks balance)
        0.60,  # 10: FluidIdentity - moderate-high (mirrors others)
        0.80,  # 11: Warm - very high (charming)
        0.40,  # 12: Direct - moderate-low (diplomatic)
        0.40,  # 13: DepthOriented - moderate (surface harmony)
        0.60,  # 14: Sustainer - moderate-high (maintains peace)
        0.40,  # 15: BoundaryAware - moderate-low (compromises)
    ],
    # Scorpio: Transformer, detective - intense, deep, penetrating
    "Scorpio": [
        0.50,  # 0: Initiator - moderate (strategic)
        0.70,  # 1: Stabilizer - high (holds intensity)
        0.60,  # 2: Relational - moderate-high (deep bonds)
        0.50,  # 3: MindCentered - moderate (emotional intelligence)
        0.90,  # 4: Intuitive - very high (psychic sensing)
        0.50,  # 5: Concrete - moderate (power in material)
        0.40,  # 6: Expressive - moderate-low (private)
        0.70,  # 7: Transpersonal - high (collective unconscious)
        0.60,  # 8: RiskSeeking - moderate-high (transformation)
        0.60,  # 9: OrderOriented - moderate-high (control)
        0.40,  # 10: FluidIdentity - moderate-low (core identity)
        0.50,  # 11: Warm - moderate (selective intimacy)
        0.60,  # 12: Direct - moderate-high (piercing truth)
        0.95,  # 13: DepthOriented - very high (psychological)
        0.50,  # 14: Sustainer - moderate (sustains intensity)
        0.80,  # 15: BoundaryAware - very high (protective)
    ],
    # Sagittarius: Philosopher, explorer - optimistic, expansive, adventurous
    "Sagittarius": [
        0.80,  # 0: Initiator - high (starts journeys)
        0.30,  # 1: Stabilizer - low (restless)
        0.60,  # 2: Relational - moderate-high (friendly)
        0.70,  # 3: MindCentered - high (philosophical)
        0.60,  # 4: Intuitive - moderate-high (vision)
        0.30,  # 5: Concrete - low (abstract focus)
        0.80,  # 6: Expressive - high (enthusiastic)
        0.80,  # 7: Transpersonal - very high (universal truths)
        0.90,  # 8: RiskSeeking - very high (adventurous)
        0.20,  # 9: OrderOriented - low (freedom-loving)
        0.70,  # 10: FluidIdentity - high (evolving)
        0.70,  # 11: Warm - high (generous spirit)
        0.80,  # 12: Direct - high (blunt honesty)
        0.50,  # 13: DepthOriented - moderate (breadth preference)
        0.30,  # 14: Sustainer - low (moves on)
        0.40,  # 15: BoundaryAware - moderate-low (open)
    ],
    # Capricorn: Architect, achiever - disciplined, responsible, ambitious
    "Capricorn": [
        0.50,  # 0: Initiator - moderate (strategic starts)
        0.90,  # 1: Stabilizer - very high (builds lasting)
        0.40,  # 2: Relational - moderate (reserved)
        0.70,  # 3: MindCentered - high (strategic)
        0.30,  # 4: Intuitive - low (practical logic)
        0.90,  # 5: Concrete - very high (material success)
        0.30,  # 6: Expressive - low (reserved)
        0.40,  # 7: Transpersonal - moderate (legacy)
        0.30,  # 8: RiskSeeking - low (calculated)
        0.95,  # 9: OrderOriented - very high (structured)
        0.20,  # 10: FluidIdentity - low (fixed goals)
        0.40,  # 11: Warm - moderate (earned warmth)
        0.70,  # 12: Direct - high (no nonsense)
        0.60,  # 13: DepthOriented - moderate-high (mastery)
        0.60,  # 14: Sustainer - moderate-high (endures)
        0.90,  # 15: BoundaryAware - very high (professional)
    ],
    # Aquarius: Visionary, innovator - progressive, humanitarian, unconventional
    "Aquarius": [
        0.60,  # 0: Initiator - moderate-high (innovations)
        0.40,  # 1: Stabilizer - moderate (holds ideals)
        0.60,  # 2: Relational - moderate-high (community)
        0.80,  # 3: MindCentered - very high (intellectual)
        0.60,  # 4: Intuitive - moderate-high (future vision)
        0.30,  # 5: Concrete - low (abstract ideas)
        0.60,  # 6: Expressive - moderate-high (unique style)
        0.90,  # 7: Transpersonal - very high (humanitarian)
        0.60,  # 8: RiskSeeking - moderate-high (unconventional)
        0.40,  # 9: OrderOriented - moderate (systems thinking)
        0.70,  # 10: FluidIdentity - high (evolving ideals)
        0.40,  # 11: Warm - moderate (detached caring)
        0.70,  # 12: Direct - high (honest about ideas)
        0.50,  # 13: DepthOriented - moderate (broad scope)
        0.40,  # 14: Sustainer - moderate (sustains vision)
        0.50,  # 15: BoundaryAware - moderate (group identity)
    ],
    # Pisces: Mystic, dreamer - compassionate, imaginative, spiritual
    "Pisces": [
        0.30,  # 0: Initiator - low (receptive)
        0.40,  # 1: Stabilizer - moderate (flowing)
        0.70,  # 2: Relational - high (empathic connection)
        0.30,  # 3: MindCentered - low (feeling-based)
        0.95,  # 4: Intuitive - very high (psychic)
        0.30,  # 5: Concrete - low (transcendent)
        0.50,  # 6: Expressive - moderate (artistic)
        0.90,  # 7: Transpersonal - very high (universal love)
        0.40,  # 8: RiskSeeking - moderate (surrender)
        0.20,  # 9: OrderOriented - low (fluid)
        0.80,  # 10: FluidIdentity - very high (permeable)
        0.80,  # 11: Warm - very high (compassionate)
        0.30,  # 12: Direct - low (indirect/symbolic)
        0.80,  # 13: DepthOriented - very high (soul depth)
        0.70,  # 14: Sustainer - high (holds space)
        0.30,  # 15: BoundaryAware - low (porous)
    ],
}

# =============================================================================
# CUSP ARCHETYPE BLENDING
# =============================================================================

# 12 cusp zones with primary and secondary signs
CUSP_ZONES: Dict[str, Dict[str, str]] = {
    "Aries-Taurus": {"primary": "Aries", "secondary": "Taurus", "name": "Pioneer-Builder"},
    "Taurus-Gemini": {"primary": "Taurus", "secondary": "Gemini", "name": "Grounded-Messenger"},
    "Gemini-Cancer": {"primary": "Gemini", "secondary": "Cancer", "name": "Storyteller-Empath"},
    "Cancer-Leo": {"primary": "Cancer", "secondary": "Leo", "name": "Nurturer-Performer"},
    "Leo-Virgo": {"primary": "Leo", "secondary": "Virgo", "name": "Creator-Analyst"},
    "Virgo-Libra": {"primary": "Virgo", "secondary": "Libra", "name": "Perfectionist-Harmonizer"},
    "Libra-Scorpio": {"primary": "Libra", "secondary": "Scorpio", "name": "Diplomat-Transformer"},
    "Scorpio-Sagittarius": {"primary": "Scorpio", "secondary": "Sagittarius", "name": "Phoenix-Philosopher"},
    "Sagittarius-Capricorn": {"primary": "Sagittarius", "secondary": "Capricorn", "name": "Seeker-Architect"},
    "Capricorn-Aquarius": {"primary": "Capricorn", "secondary": "Aquarius", "name": "Architect-Visionary"},
    "Aquarius-Pisces": {"primary": "Aquarius", "secondary": "Pisces", "name": "Innovator-Mystic"},
    "Pisces-Aries": {"primary": "Pisces", "secondary": "Aries", "name": "Dreamer-Warrior"},
}

# =============================================================================
# SYNASTRY HOUSE OVERLAY MEANINGS
# =============================================================================

SYNASTRY_OVERLAY_MEANINGS: Dict[int, str] = {
    1: "Identity activation - you affect how they see themselves",
    2: "Values and resources - financial/material connection",
    3: "Communication - mental stimulation and daily exchange",
    4: "Home and roots - emotional security and family connection",
    5: "Romance and creativity - playful, creative, romantic energy",
    6: "Service and health - daily routines and mutual support",
    7: "Partnership - direct relationship and commitment themes",
    8: "Transformation - deep intimacy, shared resources, psychology",
    9: "Expansion - shared beliefs, travel, higher learning",
    10: "Public life - career support, status, reputation",
    11: "Friendship - social circles, hopes, group activities",
    12: "Spirituality - karmic connection, hidden dynamics, dreams",
}

# =============================================================================
# ENHANCED COMPATIBILITY WEIGHTS (16-axis system)
# =============================================================================

ENHANCED_SECTION_WEIGHTS: Dict[str, float] = {
    "elements": 0.20,
    "modalities": 0.10,
    "houses": 0.15,
    "planets": 0.20,
    "archetypes": 0.10,      # 16-axis archetype comparison
    "patterns": 0.05,         # Aspect pattern similarity
    "dominance": 0.05,
    "shape": 0.05,
    "proximity": 0.05,        # Cusp proximity bonus
    "synastryReceptivity": 0.05,
}

# =============================================================================
# PATTERN INFLUENCE VECTORS (16-axis archetype modifiers)
# =============================================================================
#
# Each aspect pattern has a characteristic psychological signature that
# modifies the base archetype vector. These vectors represent how strongly
# each pattern influences each of the 16 archetype axes.
#
# NEW 16-AXIS ORDERING:
#   0: Initiator        - Drive to start, pioneer energy
#   1: Stabilizer       - Capacity to maintain, preserve
#   2: Relational       - Other-oriented, partnership
#   3: MindCentered     - Mental/analytical
#   4: Intuitive        - Feeling/symbolic, inner knowing
#   5: Concrete         - Sensory/real, practical
#   6: Expressive       - Outward display, communication
#   7: Transpersonal    - Collective themes, universal
#   8: RiskSeeking      - Exploration, adventure
#   9: OrderOriented    - Need for structure, control
#  10: FluidIdentity    - Adaptive identity, flexibility
#  11: Warm             - Emotional warmth, empathy
#  12: Direct           - Straightforward, transparent
#  13: DepthOriented    - Psychological depth, intensity
#  14: Sustainer        - Supportive/holding, nurturing
#  15: BoundaryAware    - Clear limits, self-definition
#
# Formula: A_final = A_base + Σ(pattern_strength × pattern_influence_vector)
# Values typically in range [-0.25, +0.25] to represent modifiers, not replacements.

PATTERN_INFLUENCE_VECTORS: Dict[str, list[float]] = {
    # Grand Trine: The Hidden River - natural flow, coherence, ease
    # Psychology: Internal harmony, self-sufficiency, natural talents flow effortlessly
    # Key boosts: +Stabilizer, +OrderOriented, +Sustainer, +Initiator
    "grand_trine": [
        +0.20,  # 0: Initiator - natural drive flows
        +0.25,  # 1: Stabilizer - flow maintains itself
        +0.05,  # 2: Relational - self-contained
        +0.05,  # 3: MindCentered - slight
        +0.05,  # 4: Intuitive - slight
        +0.10,  # 5: Concrete - grounded in ability
        +0.15,  # 6: Expressive - talents express naturally
        +0.05,  # 7: Transpersonal - slight
        -0.05,  # 8: RiskSeeking - comfort zone preference
        +0.20,  # 9: OrderOriented - flow knows its path
        -0.10,  # 10: FluidIdentity - stable self-image
        +0.10,  # 11: Warm - at ease with self
        +0.05,  # 12: Direct - slight
        +0.10,  # 13: DepthOriented - slight depth
        +0.15,  # 14: Sustainer - self-supporting
        +0.10,  # 15: BoundaryAware - clear container
    ],

    # T-Square: The Sacred Friction - tension, drive, mastery through challenge
    # Psychology: Internal pressure, growth through conflict, constant refinement
    # Key boosts: +RiskSeeking, +Direct, +DepthOriented, +Initiator
    # Key reductions: -Stabilizer, -Warm, -OrderOriented
    "t_square": [
        +0.15,  # 0: Initiator - driven to act
        -0.15,  # 1: Stabilizer - can't settle
        +0.05,  # 2: Relational - slight
        +0.10,  # 3: MindCentered - analyzing friction
        -0.05,  # 4: Intuitive - slight reduction
        +0.05,  # 5: Concrete - must deal with reality
        +0.05,  # 6: Expressive - slight
        +0.10,  # 7: Transpersonal - slight
        +0.20,  # 8: RiskSeeking - pushed out of comfort
        -0.15,  # 9: OrderOriented - chaos embracing
        +0.10,  # 10: FluidIdentity - reshaped by friction
        -0.10,  # 11: Warm - friction creates distance
        +0.20,  # 12: Direct - pressure demands action
        +0.20,  # 13: DepthOriented - forced transformation
        -0.10,  # 14: Sustainer - challenging over nurturing
        +0.05,  # 15: BoundaryAware - slight
    ],

    # Stellium: The Chamber of Echoes - concentrated power, focus, specialization
    # Psychology: Intensity, single theme dominates, vocational calling, mastery
    # Key boosts: +OrderOriented, +Concrete, +BoundaryAware
    # Key reductions: -FluidIdentity, -RiskSeeking
    "stellium": [
        +0.05,  # 0: Initiator - slight
        +0.15,  # 1: Stabilizer - concentration holds
        +0.00,  # 2: Relational - neutral
        +0.15,  # 3: MindCentered - focused discipline
        +0.00,  # 4: Intuitive - neutral
        +0.20,  # 5: Concrete - specialized knowledge
        +0.10,  # 6: Expressive - channeled expression
        +0.00,  # 7: Transpersonal - neutral
        -0.10,  # 8: RiskSeeking - security in mastery
        +0.20,  # 9: OrderOriented - focused discipline
        -0.15,  # 10: FluidIdentity - defined by focus
        +0.05,  # 11: Warm - slight
        +0.10,  # 12: Direct - knows its theme
        +0.10,  # 13: DepthOriented - deep in domain
        +0.05,  # 14: Sustainer - slight
        +0.15,  # 15: BoundaryAware - clear domain
    ],

    # Yod: The Finger of God - destiny pressure, course corrections, calling
    # Psychology: Feels fated, sudden redirections, spiritual summons
    # Key boosts: +Intuitive, +Transpersonal, +FluidIdentity
    # Key reductions: -OrderOriented, -MindCentered
    "yod": [
        -0.05,  # 0: Initiator - responding to call
        +0.05,  # 1: Stabilizer - slight
        +0.10,  # 2: Relational - connected to larger pattern
        -0.10,  # 3: MindCentered - beyond rational
        +0.25,  # 4: Intuitive - sensing destiny
        -0.10,  # 5: Concrete - abstract calling
        +0.05,  # 6: Expressive - slight
        +0.25,  # 7: Transpersonal - larger purpose
        +0.10,  # 8: RiskSeeking - fate pushes forward
        -0.15,  # 9: OrderOriented - surrenders to fate
        +0.20,  # 10: FluidIdentity - destiny reshapes self
        +0.10,  # 11: Warm - spiritual connection
        -0.15,  # 12: Direct - fate works mysteriously
        +0.15,  # 13: DepthOriented - profound meaning
        +0.05,  # 14: Sustainer - slight
        -0.10,  # 15: BoundaryAware - permeable to destiny
    ],

    # Kite: The Banner That Catches Wind - directed talent, mission, visible purpose
    # Psychology: Flow gains direction, talent meets calling, natural ability aimed
    # Key boosts: +Initiator, +Expressive, +Transpersonal, +RiskSeeking
    "kite": [
        +0.25,  # 0: Initiator - talent mobilized
        +0.10,  # 1: Stabilizer - grounded flow
        +0.10,  # 2: Relational - mission connects
        +0.05,  # 3: MindCentered - slight
        +0.10,  # 4: Intuitive - sensing direction
        +0.05,  # 5: Concrete - slight
        +0.20,  # 6: Expressive - talent visible
        +0.15,  # 7: Transpersonal - serving larger cause
        +0.15,  # 8: RiskSeeking - willing to aim high
        +0.10,  # 9: OrderOriented - directed flow
        +0.05,  # 10: FluidIdentity - slight
        +0.15,  # 11: Warm - engaged with mission
        +0.15,  # 12: Direct - pointed purpose
        +0.10,  # 13: DepthOriented - meaningful aim
        +0.10,  # 14: Sustainer - mission sustains
        +0.10,  # 15: BoundaryAware - clear purpose
    ],

    # Opposition Chain: The Corridor of Mirrors - polarity, paradox, integration
    # Psychology: Lives in paradox, holds contradictions, translator between worlds
    # Key boosts: +Relational, +Intuitive, +FluidIdentity
    # Key reductions: -Direct, -Concrete, -BoundaryAware
    "opposition_chain": [
        +0.00,  # 0: Initiator - neutral
        +0.05,  # 1: Stabilizer - slight
        +0.20,  # 2: Relational - sees both sides
        -0.05,  # 3: MindCentered - slight reduction
        +0.15,  # 4: Intuitive - feels polarities
        -0.15,  # 5: Concrete - symbolic understanding
        +0.05,  # 6: Expressive - slight
        +0.15,  # 7: Transpersonal - larger perspective
        +0.10,  # 8: RiskSeeking - explores paradox
        -0.10,  # 9: OrderOriented - tolerates ambiguity
        +0.20,  # 10: FluidIdentity - multiple selves
        +0.10,  # 11: Warm - empathy for paradox
        -0.20,  # 12: Direct - navigates indirectly
        +0.15,  # 13: DepthOriented - integrates opposites
        +0.10,  # 14: Sustainer - holds contradictions
        -0.15,  # 15: BoundaryAware - permeable boundaries
    ],
}

# Pattern archetype names (for persona modeling narratives)
PATTERN_ARCHETYPE_NAMES: Dict[str, str] = {
    "grand_trine": "Natural Flow Archetype",
    "t_square": "Sacred Tension Archetype",
    "stellium": "Focused Specialist Archetype",
    "yod": "Destiny-Marked Archetype",
    "kite": "Mission-Activated Archetype",
    "opposition_chain": "Paradox Weaver Archetype",
}

# Pattern influence weight (how strongly patterns modify the base archetype)
# Higher = patterns have more impact on final archetype vector
PATTERN_INFLUENCE_WEIGHT: float = 0.3
