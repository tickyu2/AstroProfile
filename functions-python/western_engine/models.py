"""
western_engine/models.py

Unified data models for Western astrology charts.

Using dataclasses provides:
1. Type safety and documentation
2. Immutable data by default (frozen=True)
3. Easy serialization to dict/JSON
4. Reduced glue code across modules

Following the BaZi Engine pattern from bazi_engine/models.py.
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
from functools import cached_property


# =============================================================================
# BASIC MODELS
# =============================================================================

@dataclass(frozen=True)
class PlanetPosition:
    """Position of a planet in the chart."""
    planet: str
    longitude: float  # 0-360 degrees
    sign: str
    degree_in_sign: float  # 0-30 degrees within sign
    retrograde: bool = False
    house: Optional[int] = None  # 1-12

    @property
    def formatted_position(self) -> str:
        """Get formatted position string like '15°32' Aries'."""
        deg = int(self.degree_in_sign)
        min = int((self.degree_in_sign - deg) * 60)
        r = " R" if self.retrograde else ""
        return f"{deg}°{min:02d}' {self.sign}{r}"


@dataclass(frozen=True)
class HouseCusps:
    """House cusp positions (Porphyry or other system)."""
    system: str  # "Porphyry", "Placidus", "Equal", "Whole Sign"
    cusps: Tuple[float, ...]  # 12 cusp longitudes (0-360)
    ascendant: float
    midheaven: float

    def get_house_for_degree(self, longitude: float) -> int:
        """Determine which house a given longitude falls in."""
        for i in range(12):
            next_i = (i + 1) % 12
            cusp_start = self.cusps[i]
            cusp_end = self.cusps[next_i]

            # Handle wrap-around at 0/360
            if cusp_start > cusp_end:
                if longitude >= cusp_start or longitude < cusp_end:
                    return i + 1
            else:
                if cusp_start <= longitude < cusp_end:
                    return i + 1

        return 1  # Fallback


@dataclass(frozen=True)
class AspectResult:
    """A detected aspect between two planets."""
    planet1: str
    planet2: str
    aspect_type: str  # "conjunction", "trine", "square", etc.
    exact_angle: float  # Actual angle between planets
    orb: float  # Deviation from exact aspect
    applying: bool  # True if aspect is applying, False if separating
    strength: float  # 0-1 based on orb tightness

    @property
    def is_major(self) -> bool:
        return self.aspect_type in ["conjunction", "opposition", "trine", "square", "sextile"]

    @property
    def is_harmonious(self) -> bool:
        return self.aspect_type in ["trine", "sextile", "quintile", "biquintile"]

    @property
    def is_challenging(self) -> bool:
        return self.aspect_type in ["opposition", "square", "quincunx", "semi-square", "sesquiquadrate"]


@dataclass
class AspectPatternResult:
    """A detected aspect pattern (Grand Trine, T-Square, etc.)."""
    pattern_type: str  # "grand_trine", "t_square", "grand_cross", "yod", "stellium"
    planets: List[str]
    element: Optional[str] = None  # For Grand Trines
    modality: Optional[str] = None  # For Grand Crosses
    strength: float = 0.0  # 0-1 based on orb tightness
    description: str = ""


@dataclass(frozen=True)
class DetectedAspect:
    """
    A detected aspect with full orb and tightness information.

    This is the output of the professional orb-aware aspect detector.
    Used as input to the pattern detection system.
    """
    planet1: str
    planet2: str
    aspect_type: str   # 'conjunction','opposition','trine','square','sextile','quincunx'
    angle: float       # actual angle (0-180)
    orb: float         # |angle - ideal| (orb error in degrees)
    tightness: float   # 0-1 (1.0 = exact aspect, 0.0 = at orb limit)

    @property
    def is_tight(self) -> bool:
        """Aspect is considered tight if tightness > 0.7."""
        return self.tightness > 0.7

    @property
    def is_major(self) -> bool:
        return self.aspect_type in ['conjunction', 'opposition', 'trine', 'square', 'sextile']


@dataclass
class PatternStrengths:
    """
    Strength scores (0-1) for each aspect pattern type.

    Used as the output of the pattern detection system.
    These values go into the aspect_pattern_vector of WesternExpressionVector.
    """
    grand_trine: float = 0.0
    t_square: float = 0.0
    stellium: float = 0.0
    yod: float = 0.0
    kite: float = 0.0
    opposition_chain: float = 0.0

    def to_vector(self) -> List[float]:
        """Convert to 6-dim vector for WesternExpressionVector."""
        return [
            self.grand_trine,
            self.t_square,
            self.stellium,
            self.yod,
            self.kite,
            self.opposition_chain,
        ]

    def to_dict(self) -> Dict[str, float]:
        return {
            'grand_trine': self.grand_trine,
            't_square': self.t_square,
            'stellium': self.stellium,
            'yod': self.yod,
            'kite': self.kite,
            'opposition_chain': self.opposition_chain,
        }


@dataclass
class ChartShapeResult:
    """Result of chart shape detection."""
    primary_shape: str  # "bowl", "bucket", "locomotive", etc.
    scores: Dict[str, float]  # Score for each shape type
    span: float  # Degrees of occupied arc
    max_gap: float  # Largest empty arc
    handle_planet: Optional[str] = None  # For bucket shape

    @property
    def confidence(self) -> float:
        """Confidence in primary shape detection."""
        return self.scores.get(self.primary_shape, 0.0)


# =============================================================================
# WESTERN EXPRESSION VECTOR (72 dimensions)
# =============================================================================

@dataclass
class WesternExpressionVector:
    """
    72-dimensional Western Expression Vector.

    This is the core output for compatibility calculations.
    All values are normalized to 0-1 range.

    Sections:
    1. Elements (4 dims): Fire, Earth, Air, Water percentages
    2. Modalities (3 dims): Cardinal, Fixed, Mutable percentages
    3. Houses (12 dims): Intensity per house
    4. Planetary Psychology (15 dims): Expression strength per planet
    5. Archetypes (9 dims): Archetype strengths
    6. Aspect Patterns (8 dims): Pattern indicators
    7. Dominance (9 dims): Dominance metrics
    8. Chart Shape (6 dims): Shape scores
    """

    # 1. Elemental Vector (4 dimensions)
    fire_percent: float = 0.25
    earth_percent: float = 0.25
    air_percent: float = 0.25
    water_percent: float = 0.25

    # 2. Modality Vector (3 dimensions)
    cardinal_percent: float = 0.33
    fixed_percent: float = 0.33
    mutable_percent: float = 0.34

    # 3. House Vector (12 dimensions)
    house_intensities: Tuple[float, ...] = field(
        default_factory=lambda: tuple([0.083] * 12)
    )

    # 4. Planetary Psychology Vector (15 dimensions)
    sun_expression: float = 0.5
    moon_expression: float = 0.5
    mercury_expression: float = 0.5
    venus_expression: float = 0.5
    mars_expression: float = 0.5
    jupiter_expression: float = 0.5
    saturn_expression: float = 0.5
    uranus_expression: float = 0.5
    neptune_expression: float = 0.5
    pluto_expression: float = 0.5
    ascendant_weight: float = 0.5
    midheaven_weight: float = 0.5
    north_node_weight: float = 0.5
    chiron_weight: float = 0.5
    lilith_weight: float = 0.5

    # 5. Archetype Vector (9 dimensions)
    warrior_archetype: float = 0.11    # Aries
    builder_archetype: float = 0.11    # Taurus/Capricorn
    messenger_archetype: float = 0.11  # Gemini/Aquarius
    nurturer_archetype: float = 0.11   # Cancer/Pisces
    performer_archetype: float = 0.11  # Leo
    analyst_archetype: float = 0.11    # Virgo
    harmonizer_archetype: float = 0.11 # Libra
    transformer_archetype: float = 0.11# Scorpio
    philosopher_archetype: float = 0.12# Sagittarius

    # 6. Aspect Pattern Vector (8 dimensions)
    grand_trine_strength: float = 0.0
    grand_cross_strength: float = 0.0
    t_square_strength: float = 0.0
    yod_strength: float = 0.0
    stellium_count: int = 0
    opposition_tension: float = 0.0
    conjunction_power: float = 0.0
    aspect_harmony_score: float = 0.5  # Overall balance

    # 7. Dominance Vector (9 dimensions)
    dominant_sign_strength: float = 0.0
    dominant_planet_strength: float = 0.0
    dominant_house_strength: float = 0.0
    dominant_element_purity: float = 0.25  # How concentrated
    dominant_modality_purity: float = 0.33
    yang_yin_ratio: float = 0.5  # 0=pure yin, 1=pure yang
    night_day_emphasis: float = 0.5  # Sect
    retrograde_count: int = 0
    dignity_score: float = 0.5  # Overall dignity

    # 8. Chart Shape Vector (6 dimensions)
    bowl_score: float = 0.0
    bucket_score: float = 0.0
    locomotive_score: float = 0.0
    bundle_score: float = 0.0
    splash_score: float = 0.0
    seesaw_score: float = 0.0

    def to_vector(self) -> List[float]:
        """
        Flatten to 72-dimensional vector for cosine similarity.

        Returns list of floats, all normalized to 0-1 range.
        """
        return [
            # Elements (4)
            self.fire_percent,
            self.earth_percent,
            self.air_percent,
            self.water_percent,

            # Modalities (3)
            self.cardinal_percent,
            self.fixed_percent,
            self.mutable_percent,

            # Houses (12)
            *self.house_intensities,

            # Planetary Psychology (15)
            self.sun_expression,
            self.moon_expression,
            self.mercury_expression,
            self.venus_expression,
            self.mars_expression,
            self.jupiter_expression,
            self.saturn_expression,
            self.uranus_expression,
            self.neptune_expression,
            self.pluto_expression,
            self.ascendant_weight,
            self.midheaven_weight,
            self.north_node_weight,
            self.chiron_weight,
            self.lilith_weight,

            # Archetypes (9)
            self.warrior_archetype,
            self.builder_archetype,
            self.messenger_archetype,
            self.nurturer_archetype,
            self.performer_archetype,
            self.analyst_archetype,
            self.harmonizer_archetype,
            self.transformer_archetype,
            self.philosopher_archetype,

            # Aspect Patterns (8)
            self.grand_trine_strength,
            self.grand_cross_strength,
            self.t_square_strength,
            self.yod_strength,
            min(1.0, self.stellium_count / 4.0),  # Normalize
            self.opposition_tension,
            self.conjunction_power,
            self.aspect_harmony_score,

            # Dominance (9)
            self.dominant_sign_strength,
            self.dominant_planet_strength,
            self.dominant_house_strength,
            self.dominant_element_purity,
            self.dominant_modality_purity,
            self.yang_yin_ratio,
            self.night_day_emphasis,
            min(1.0, self.retrograde_count / 10.0),  # Normalize
            self.dignity_score,

            # Chart Shape (6)
            self.bowl_score,
            self.bucket_score,
            self.locomotive_score,
            self.bundle_score,
            self.splash_score,
            self.seesaw_score,
        ]  # Total: 4+3+12+15+9+8+9+6 = 66 dimensions
        # Note: We have 66, padding to 72 if needed for future expansion

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "elements": {
                "fire": self.fire_percent,
                "earth": self.earth_percent,
                "air": self.air_percent,
                "water": self.water_percent
            },
            "modalities": {
                "cardinal": self.cardinal_percent,
                "fixed": self.fixed_percent,
                "mutable": self.mutable_percent
            },
            "house_intensities": list(self.house_intensities),
            "planetary_psychology": {
                "sun": self.sun_expression,
                "moon": self.moon_expression,
                "mercury": self.mercury_expression,
                "venus": self.venus_expression,
                "mars": self.mars_expression,
                "jupiter": self.jupiter_expression,
                "saturn": self.saturn_expression,
                "uranus": self.uranus_expression,
                "neptune": self.neptune_expression,
                "pluto": self.pluto_expression,
                "ascendant": self.ascendant_weight,
                "midheaven": self.midheaven_weight,
                "north_node": self.north_node_weight,
                "chiron": self.chiron_weight,
                "lilith": self.lilith_weight
            },
            "archetypes": {
                "warrior": self.warrior_archetype,
                "builder": self.builder_archetype,
                "messenger": self.messenger_archetype,
                "nurturer": self.nurturer_archetype,
                "performer": self.performer_archetype,
                "analyst": self.analyst_archetype,
                "harmonizer": self.harmonizer_archetype,
                "transformer": self.transformer_archetype,
                "philosopher": self.philosopher_archetype
            },
            "aspect_patterns": {
                "grand_trine": self.grand_trine_strength,
                "grand_cross": self.grand_cross_strength,
                "t_square": self.t_square_strength,
                "yod": self.yod_strength,
                "stellium_count": self.stellium_count,
                "opposition_tension": self.opposition_tension,
                "conjunction_power": self.conjunction_power,
                "aspect_harmony": self.aspect_harmony_score
            },
            "dominance": {
                "sign_strength": self.dominant_sign_strength,
                "planet_strength": self.dominant_planet_strength,
                "house_strength": self.dominant_house_strength,
                "element_purity": self.dominant_element_purity,
                "modality_purity": self.dominant_modality_purity,
                "yang_yin_ratio": self.yang_yin_ratio,
                "night_day_emphasis": self.night_day_emphasis,
                "retrograde_count": self.retrograde_count,
                "dignity_score": self.dignity_score
            },
            "chart_shape": {
                "bowl": self.bowl_score,
                "bucket": self.bucket_score,
                "locomotive": self.locomotive_score,
                "bundle": self.bundle_score,
                "splash": self.splash_score,
                "seesaw": self.seesaw_score
            },
            "vector": self.to_vector(),
            "vector_dimensions": len(self.to_vector())
        }


# =============================================================================
# COMPLETE WESTERN CHART
# =============================================================================

@dataclass
class WesternChart:
    """
    Complete Western astrology chart with all analysis.

    This is the unified output model containing all calculated data.
    """
    # Core data
    birth_datetime: datetime
    latitude: float
    longitude: float
    timezone: str

    # Calculated positions
    planets: List[PlanetPosition]
    houses: HouseCusps

    # Analysis results
    aspects: List[AspectResult]
    aspect_patterns: List[AspectPatternResult]
    chart_shape: ChartShapeResult
    expression_vector: WesternExpressionVector

    # Metadata
    calculated_at: datetime = field(default_factory=datetime.now)

    @property
    def sun_sign(self) -> str:
        """Get Sun sign."""
        for p in self.planets:
            if p.planet == "Sun":
                return p.sign
        return "Unknown"

    @property
    def moon_sign(self) -> str:
        """Get Moon sign."""
        for p in self.planets:
            if p.planet == "Moon":
                return p.sign
        return "Unknown"

    @property
    def ascendant_sign(self) -> str:
        """Get Ascendant sign."""
        for p in self.planets:
            if p.planet == "Ascendant":
                return p.sign
        return "Unknown"

    def to_dict(self) -> Dict[str, Any]:
        """Convert entire chart to dictionary for JSON serialization."""
        return {
            "birth_datetime": self.birth_datetime.isoformat(),
            "location": {
                "latitude": self.latitude,
                "longitude": self.longitude,
                "timezone": self.timezone
            },
            "planets": [
                {
                    "planet": p.planet,
                    "longitude": p.longitude,
                    "sign": p.sign,
                    "degree_in_sign": p.degree_in_sign,
                    "retrograde": p.retrograde,
                    "house": p.house,
                    "formatted": p.formatted_position
                }
                for p in self.planets
            ],
            "houses": {
                "system": self.houses.system,
                "cusps": list(self.houses.cusps),
                "ascendant": self.houses.ascendant,
                "midheaven": self.houses.midheaven
            },
            "aspects": [asdict(a) for a in self.aspects],
            "aspect_patterns": [asdict(p) for p in self.aspect_patterns],
            "chart_shape": asdict(self.chart_shape),
            "expression_vector": self.expression_vector.to_dict(),
            "summary": {
                "sun_sign": self.sun_sign,
                "moon_sign": self.moon_sign,
                "ascendant_sign": self.ascendant_sign
            },
            "calculated_at": self.calculated_at.isoformat()
        }


# =============================================================================
# SYNASTRY & COMPATIBILITY
# =============================================================================

@dataclass
class SynastryResult:
    """Synastry analysis between two charts."""
    chart_a_id: str
    chart_b_id: str

    # Cross-aspects
    cross_aspects: List[AspectResult]

    # House overlays
    a_planets_in_b_houses: List[Dict[str, Any]]
    b_planets_in_a_houses: List[Dict[str, Any]]

    # Overall metrics
    aspect_harmony: float  # 0-1
    house_overlay_score: float  # 0-1

    # Narrative
    strengths: List[str]
    challenges: List[str]
    growth_areas: List[str]


@dataclass
class WesternCompatibilityScore:
    """
    Western compatibility score between two Expression Vectors.

    Uses cosine similarity across sections.
    """
    total: float  # 0-100 overall score
    vector_cosine: float  # Raw cosine similarity 0-1

    # Section scores (0-100)
    element_harmony: float
    modality_score: float
    house_overlay: float
    planetary_interplay: float
    archetype_resonance: float
    aspect_pattern_compat: float
    dominance_alignment: float
    chart_shape_compat: float

    # Debug info
    vector_a_dims: int
    vector_b_dims: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total": self.total,
            "vector_cosine": self.vector_cosine,
            "sections": {
                "element_harmony": self.element_harmony,
                "modality_score": self.modality_score,
                "house_overlay": self.house_overlay,
                "planetary_interplay": self.planetary_interplay,
                "archetype_resonance": self.archetype_resonance,
                "aspect_pattern_compat": self.aspect_pattern_compat,
                "dominance_alignment": self.dominance_alignment,
                "chart_shape_compat": self.chart_shape_compat
            },
            "debug": {
                "vector_a_dims": self.vector_a_dims,
                "vector_b_dims": self.vector_b_dims
            }
        }


# =============================================================================
# FACTORY FUNCTIONS
# =============================================================================

def create_planet_position(
    planet: str,
    longitude: float,
    retrograde: bool = False,
    house: Optional[int] = None
) -> PlanetPosition:
    """Create a PlanetPosition from longitude."""
    from .constants import ZODIAC_SIGNS

    # Calculate sign and degree in sign
    sign_idx = int(longitude / 30) % 12
    sign = ZODIAC_SIGNS[sign_idx]
    degree_in_sign = longitude % 30

    return PlanetPosition(
        planet=planet,
        longitude=longitude,
        sign=sign,
        degree_in_sign=degree_in_sign,
        retrograde=retrograde,
        house=house
    )


def create_default_expression_vector() -> WesternExpressionVector:
    """Create a neutral/default expression vector."""
    return WesternExpressionVector()


# =============================================================================
# ENHANCED WESTERN EXPRESSION VECTOR (16-Axis Archetype System)
# =============================================================================

@dataclass
class EnhancedWesternExpressionVector:
    """
    Enhanced Western Expression Vector with 16-axis archetype system.

    This extends the base WesternExpressionVector with:
    1. Full 16-dimensional archetype vector per sign
    2. Per-planet 35-dimensional vectors
    3. Chart-level archetype vector
    4. Synastry receptivity score
    5. Cusp blending support

    Total dimensions when flattened: 98+
    """

    # Base sections (from original WesternExpressionVector)
    # 1. Elements (4 dims)
    elements: Dict[str, float] = field(
        default_factory=lambda: {
            'Fire': 0.25, 'Earth': 0.25, 'Air': 0.25, 'Water': 0.25
        }
    )

    # 2. Modalities (3 dims)
    modalities: Dict[str, float] = field(
        default_factory=lambda: {
            'Cardinal': 0.33, 'Fixed': 0.33, 'Mutable': 0.34
        }
    )

    # 3. House intensities (12 dims)
    houses: List[float] = field(
        default_factory=lambda: [0.083] * 12
    )

    # 4. Planet vectors (each planet has 35 dims: 4 element + 3 modality + 12 house + 16 archetype)
    planets: Dict[str, List[float]] = field(default_factory=dict)

    # 5. Chart-level 16-axis archetype vector
    archetype_vector: List[float] = field(
        default_factory=lambda: [0.0] * 16
    )

    # 6. Aspect pattern vector (6 dims)
    aspect_pattern_vector: List[float] = field(
        default_factory=lambda: [0.0] * 6  # grand_trine, t_square, stellium, yod, kite, opposition_chain
    )

    # 7. Dominance vector (4 dims compressed)
    dominance_vector: List[float] = field(
        default_factory=lambda: [0.0] * 4
    )

    # 8. Chart shape vector (6 dims)
    chart_shape_vector: List[float] = field(
        default_factory=lambda: [0.0] * 6  # bowl, bucket, locomotive, splash, bundle, seesaw
    )

    # 9. Synastry receptivity (1 dim)
    synastry_receptivity: float = 0.5

    # Metadata
    cusp_info: Optional[Dict[str, Any]] = None  # Cusp blending info if applicable
    dominant_traits: Optional[List[Dict[str, Any]]] = None  # Top archetype traits

    def to_flat_vector(self) -> List[float]:
        """
        Flatten to vector for cosine similarity.

        Structure:
        - Elements: 4
        - Modalities: 3
        - Houses: 12
        - Archetype: 16
        - Aspect patterns: 6
        - Dominance: 4
        - Chart shape: 6
        - Synastry receptivity: 1
        Total base: 52 dims (excluding planet vectors)
        """
        vec = []

        # Elements (4)
        vec.extend([
            self.elements.get('Fire', 0.25),
            self.elements.get('Earth', 0.25),
            self.elements.get('Air', 0.25),
            self.elements.get('Water', 0.25),
        ])

        # Modalities (3)
        vec.extend([
            self.modalities.get('Cardinal', 0.33),
            self.modalities.get('Fixed', 0.33),
            self.modalities.get('Mutable', 0.34),
        ])

        # Houses (12)
        vec.extend(self.houses[:12] if len(self.houses) >= 12 else self.houses + [0.0] * (12 - len(self.houses)))

        # Archetype vector (16)
        vec.extend(self.archetype_vector[:16] if len(self.archetype_vector) >= 16 else self.archetype_vector + [0.0] * (16 - len(self.archetype_vector)))

        # Aspect patterns (6)
        vec.extend(self.aspect_pattern_vector[:6] if len(self.aspect_pattern_vector) >= 6 else self.aspect_pattern_vector + [0.0] * (6 - len(self.aspect_pattern_vector)))

        # Dominance (4)
        vec.extend(self.dominance_vector[:4] if len(self.dominance_vector) >= 4 else self.dominance_vector + [0.0] * (4 - len(self.dominance_vector)))

        # Chart shape (6)
        vec.extend(self.chart_shape_vector[:6] if len(self.chart_shape_vector) >= 6 else self.chart_shape_vector + [0.0] * (6 - len(self.chart_shape_vector)))

        # Synastry receptivity (1)
        vec.append(self.synastry_receptivity)

        return vec

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'elements': self.elements,
            'modalities': self.modalities,
            'houses': self.houses,
            'planets': self.planets,
            'archetypeVector': self.archetype_vector,
            'aspectPatternVector': self.aspect_pattern_vector,
            'dominanceVector': self.dominance_vector,
            'chartShapeVector': self.chart_shape_vector,
            'synastryReceptivity': self.synastry_receptivity,
            'cuspInfo': self.cusp_info,
            'dominantTraits': self.dominant_traits,
            'flatVector': self.to_flat_vector(),
            'dimensions': len(self.to_flat_vector())
        }

    @classmethod
    def from_base_vector(cls, base: WesternExpressionVector) -> 'EnhancedWesternExpressionVector':
        """Create EnhancedWesternExpressionVector from base WesternExpressionVector."""
        return cls(
            elements={
                'Fire': base.fire_percent,
                'Earth': base.earth_percent,
                'Air': base.air_percent,
                'Water': base.water_percent
            },
            modalities={
                'Cardinal': base.cardinal_percent,
                'Fixed': base.fixed_percent,
                'Mutable': base.mutable_percent
            },
            houses=list(base.house_intensities),
            archetype_vector=[
                base.warrior_archetype,
                base.builder_archetype,
                base.messenger_archetype,
                base.nurturer_archetype,
                base.performer_archetype,
                base.analyst_archetype,
                base.harmonizer_archetype,
                base.transformer_archetype,
                base.philosopher_archetype,
                0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0  # Pad to 16
            ],
            aspect_pattern_vector=[
                base.grand_trine_strength,
                base.t_square_strength,
                base.stellium_count / 4.0,
                base.yod_strength,
                0.0,  # kite
                base.opposition_tension
            ],
            dominance_vector=[
                base.dominant_sign_strength,
                base.dominant_planet_strength,
                base.dominant_house_strength,
                base.dignity_score
            ],
            chart_shape_vector=[
                base.bowl_score,
                base.bucket_score,
                base.locomotive_score,
                base.splash_score,
                base.bundle_score,
                base.seesaw_score
            ]
        )


# =============================================================================
# RAW CHART MODEL (for derivation pipeline)
# =============================================================================

@dataclass
class RawChart:
    """
    Raw chart data structure for the derivation pipeline.

    This is the input format for deriving EnhancedWesternExpressionVector.
    """
    planets: List[PlanetPosition]
    chart_shape: str  # 'Bowl', 'Bucket', 'Locomotive', 'Splash', 'Bundle', 'Seesaw'
    aspects: List[Tuple[str, str, str]]  # (planet1, planet2, aspect_type)
    asc_sign: str  # Ascendant sign

    # Optional additional data
    houses: Optional[HouseCusps] = None
    aspect_patterns: Optional[List[AspectPatternResult]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'planets': [
                {
                    'name': p.planet,
                    'sign': p.sign,
                    'house': p.house,
                    'longitude': p.longitude,
                    'retrograde': p.retrograde
                }
                for p in self.planets
            ],
            'chartShape': self.chart_shape,
            'aspects': [
                {'planet1': a[0], 'planet2': a[1], 'type': a[2]}
                for a in self.aspects
            ],
            'ascSign': self.asc_sign
        }


# =============================================================================
# ENHANCED COMPATIBILITY RESULT
# =============================================================================

@dataclass
class EnhancedCompatibilityScore:
    """
    Enhanced compatibility score using 16-axis archetype system.

    Includes all section scores plus archetype similarity.
    """
    total: float  # 0-100 overall score

    # Section scores (0-100)
    elements: float
    modalities: float
    houses: float
    planets: float
    archetypes: float  # 16-axis archetype similarity
    patterns: float
    dominance: float
    shape: float
    proximity: float  # Cusp proximity bonus
    synastry_receptivity: float

    # Raw similarity values
    raw_components: Dict[str, float] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'total': self.total,
            'components': {
                'elements': self.elements,
                'modalities': self.modalities,
                'houses': self.houses,
                'planets': self.planets,
                'archetypes': self.archetypes,
                'patterns': self.patterns,
                'dominance': self.dominance,
                'shape': self.shape,
                'proximity': self.proximity,
                'synastryReceptivity': self.synastry_receptivity
            },
            'rawComponents': self.raw_components
        }
