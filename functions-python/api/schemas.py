"""
api/schemas.py

Canonical Pydantic models for GENESIS Python API.
These schemas are the SINGLE SOURCE OF TRUTH - what Python outputs
is exactly what gets stored in Firebase and read by the frontend.

NO TRANSFORMATIONS. Store raw Python output directly.
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from enum import Enum


# =============================================================================
# INPUT SCHEMAS
# =============================================================================

class BirthDataInput(BaseModel):
    """Input birth data for profile computation."""
    birthDate: str = Field(..., description="Birth date (YYYY-MM-DD)")
    birthTime: str = Field(..., description="Birth time (HH:MM)")
    latitude: float = Field(..., description="Birth latitude")
    longitude: float = Field(..., description="Birth longitude")
    timezone: str = Field("UTC", description="Timezone string (e.g., 'America/New_York')")
    gender: str = Field("male", description="Gender: 'male' or 'female' (for BaZi DaYun direction)")


class ComputeProfileRequest(BaseModel):
    """Request for compute-profile endpoint."""
    birth: BirthDataInput
    profileId: Optional[str] = Field(None, description="Optional profile ID for storage")
    computeOptions: Optional[Dict[str, bool]] = Field(
        default_factory=lambda: {
            "includeBazi": True,
            "includeWestern": True,
            "includeVedic": True,
            "includeUnified": True,
        }
    )


class ComputeCompatibilityRequest(BaseModel):
    """Request for compute-compatibility endpoint."""
    profileA: BirthDataInput
    profileB: BirthDataInput
    options: Optional[Dict[str, Any]] = None


# =============================================================================
# BAZI OUTPUT SCHEMAS
# =============================================================================

class PillarSchema(BaseModel):
    """Single BaZi pillar (Year/Month/Day/Hour)."""
    stem: str = Field(..., description="Heavenly Stem (Jia, Yi, Bing, etc.)")
    branch: str = Field(..., description="Earthly Branch (Zi, Chou, Yin, etc.)")
    stemChinese: str = Field("", description="Chinese character for stem")
    branchChinese: str = Field("", description="Chinese character for branch")
    ganzhi: str = Field("", description="Combined GanZhi (e.g., 'JiaZi')")
    ganzhiChinese: str = Field("", description="Chinese GanZhi (e.g., '甲子')")
    hiddenStems: Dict[str, float] = Field(default_factory=dict, description="Hidden stems with weights")


class PillarsSchema(BaseModel):
    """Four Pillars (四柱)."""
    year: PillarSchema
    month: PillarSchema
    day: PillarSchema
    hour: PillarSchema


class DayMasterSchema(BaseModel):
    """Day Master (日主) analysis."""
    stem: str = Field(..., description="Day Master stem")
    element: str = Field(..., description="Day Master element")
    yinYang: str = Field(..., description="Yin or Yang")
    strength: str = Field(..., description="strong/weak/balanced")
    strengthScore: float = Field(..., description="Strength score 0-1")
    seasonalStrength: str = Field("", description="Strength based on birth season")


class TenGodSchema(BaseModel):
    """Single Ten God entry."""
    pillar: str = Field(..., description="Pillar name: year/month/day/hour")
    position: str = Field("stem", description="Position: stem or branch")
    tenGod: str = Field(..., description="Ten God name (English)")
    tenGodChinese: str = Field("", description="Ten God name (Chinese)")
    group: str = Field(..., description="Group: Performance/Resource/Output/Wealth/Authority")


class ElementDistributionSchema(BaseModel):
    """Five Element distribution."""
    Wood: float = Field(..., description="Wood percentage (0-1)")
    Fire: float = Field(..., description="Fire percentage (0-1)")
    Earth: float = Field(..., description="Earth percentage (0-1)")
    Metal: float = Field(..., description="Metal percentage (0-1)")
    Water: float = Field(..., description="Water percentage (0-1)")
    dominant: str = Field("", description="Dominant element")
    weakest: str = Field("", description="Weakest element")


class DaYunPillarSchema(BaseModel):
    """Single DaYun (10-year luck) pillar."""
    pillarNumber: int
    stem: str
    branch: str
    ganzhi: str
    ageStart: int
    ageEnd: int


class DaYunSchema(BaseModel):
    """DaYun (大运) luck pillars."""
    direction: str = Field(..., description="'forward' or 'backward'")
    onsetAge: float = Field(..., description="Age when DaYun starts")
    pillars: List[DaYunPillarSchema]


class SymbolicStarSchema(BaseModel):
    """Detected symbolic star."""
    name: str
    nameChinese: str = ""
    category: str = Field(..., description="auspicious/inauspicious/neutral")
    pillar: str
    description: str = ""


class BaZiChartSchema(BaseModel):
    """Complete BaZi chart - canonical output."""
    pillars: PillarsSchema
    dayMaster: DayMasterSchema
    elements: ElementDistributionSchema
    tenGods: List[TenGodSchema]
    hiddenStems: Dict[str, Dict[str, float]] = Field(default_factory=dict)
    symbolicStars: List[SymbolicStarSchema] = Field(default_factory=list)
    growthPhases: Dict[str, Any] = Field(default_factory=dict)
    dayun: Optional[DaYunSchema] = None
    lifePalace: Optional[Dict[str, str]] = None
    conceptionPalace: Optional[Dict[str, str]] = None

    # Metadata
    sxtwlUsed: bool = Field(False, description="Whether sxtwl library was used")
    computedAt: str = Field(default_factory=lambda: datetime.now().isoformat())


# =============================================================================
# WESTERN OUTPUT SCHEMAS
# =============================================================================

class PlanetPositionSchema(BaseModel):
    """Single planet position - v2.0 schema with pre-formatted display fields."""
    longitude: float = Field(..., description="Absolute ecliptic longitude (0-359.99)")
    latitude: float = Field(0, description="Ecliptic latitude")
    sign: str = Field(..., description="Zodiac sign name (capitalized)")
    degree: float = Field(..., description="Degree within sign (0-29.99)")
    degreeFormatted: str = Field("", description="Display string: '{degree}° {sign}'")
    isRetrograde: bool = Field(False, description="True if retrograde")
    element: str = Field(..., description="Fire, Earth, Air, Water")
    modality: str = Field(..., description="Cardinal, Fixed, Mutable")
    house: Optional[int] = Field(None, description="House number (1-12)")


class HouseCuspSchema(BaseModel):
    """House cusp data - v2.0 schema with pre-formatted display fields."""
    house: int = Field(..., description="House number (1-12)")
    longitude: float = Field(..., description="Absolute ecliptic longitude (0-359.99)")
    sign: str = Field(..., description="Zodiac sign on cusp")
    degree: float = Field(..., description="Degree within sign (0-29.99)")
    degreeFormatted: str = Field("", description="Display string: '{degree}° {sign}'")


class AspectSchema(BaseModel):
    """Single aspect between planets."""
    planet1: str
    planet2: str
    aspect: str = Field(..., description="conjunction/opposition/trine/square/sextile/quincunx")
    angle: float
    orb: float
    exactness: float
    applying: bool


class WesternElementsSchema(BaseModel):
    """Western elemental distribution."""
    fire: float
    earth: float
    air: float
    water: float
    dominant: str
    balance: str


class WesternModalitiesSchema(BaseModel):
    """Western modality distribution."""
    cardinal: float
    fixed: float
    mutable: float
    dominant: str


class AscendantSchema(BaseModel):
    """Ascendant (Rising Sign) data - v2.0 schema."""
    sign: str = Field(..., description="Zodiac sign name")
    degree: float = Field(..., description="Degree within sign (0-29.99)")
    longitude: float = Field(..., description="Absolute ecliptic longitude (0-359.99)")
    degreeFormatted: str = Field("", description="Display string: '{degree}° {sign}'")
    isAccurate: bool = Field(True, description="False if birth time unknown (noon default)")


class MidheavenSchema(BaseModel):
    """Midheaven (MC) data - v2.0 schema."""
    sign: str = Field(..., description="Zodiac sign name")
    degree: float = Field(..., description="Degree within sign (0-29.99)")
    longitude: float = Field(..., description="Absolute ecliptic longitude (0-359.99)")
    degreeFormatted: str = Field("", description="Display string: '{degree}° {sign}'")


class MoonPhaseSchema(BaseModel):
    """Moon phase data - v2.0 schema."""
    phase: str = Field(..., description="Phase name: New Moon, Waxing Crescent, First Quarter, etc.")
    illumination: float = Field(..., description="Illumination percentage (0-1)")
    angle: float = Field(..., description="Sun-Moon angle in degrees (0-360)")
    emoji: str = Field("", description="Moon phase emoji")


class ArabicPartSchema(BaseModel):
    """Single Arabic Part (Lot) position."""
    longitude: float = Field(..., description="Absolute ecliptic longitude (0-359.99)")
    sign: str = Field(..., description="Zodiac sign name")
    degreeInSign: float = Field(..., description="Degree within sign (0-29.99)")
    formatted: str = Field("", description="Display string: '{degree}° {sign}'")
    house: Optional[int] = Field(None, description="House number (1-12)")
    formula: str = Field("", description="Calculation formula used")
    zone: Optional[int] = Field(None, description="Zone number within sign (1-6)")


class ArabicPartsSchema(BaseModel):
    """Collection of Arabic Parts (Lots)."""
    isDayChart: bool = Field(..., description="True if Sun is above horizon")
    chartType: str = Field(..., description="'Day Chart' or 'Night Chart'")
    parts: Dict[str, ArabicPartSchema] = Field(default_factory=dict)


class VenusConditionSchema(BaseModel):
    """Venus condition summary — essential dignity, house, aspects, composite score."""
    sign: str
    degreeInSign: float
    longitude: float
    dignity: str = Field(..., description="Exalted | Domicile | Neutral | Detriment | Debilitated")
    dignityScore: float = Field(..., description="Multiplier: 0.80-1.20")
    dignityNarrative: str = ""
    element: str = ""
    modality: str = ""
    polarity: str = ""
    elementFlavor: str = ""
    combustionStatus: str = Field("none", description="none | cazimi | combust | under_beams")
    combustionMod: float = Field(1.0, description="Multiplier for Sun proximity")
    combustionNote: str = ""
    sunSeparation: Optional[float] = Field(None, description="Degrees from Sun (0-180)")
    house: Optional[int] = None
    houseStrength: str = ""
    houseTheme: str = ""
    houseNote: str = ""
    retrograde: bool = False
    retrogradeNote: str = ""
    aspects: List[Dict[str, str]] = Field(default_factory=list)
    harmoniousAspects: float = 0
    challengingAspects: float = 0
    harmonyRatio: float = 0.5
    compositeScore: float = Field(..., description="0-1 overall Venus condition")
    condition: str = Field(..., description="exceptional | strong | balanced | challenged | debilitated")
    summary: str = ""


class WesternChartSchema(BaseModel):
    """Complete Western chart - canonical v2.0 output with pre-formatted display fields."""
    # Core placements
    sun: PlanetPositionSchema
    moon: PlanetPositionSchema
    ascendant: Optional[AscendantSchema] = None
    midheaven: Optional[MidheavenSchema] = None

    # All planets
    planets: Dict[str, PlanetPositionSchema]

    # Houses - array of 12 house cusp objects
    houses: List[HouseCuspSchema] = Field(default_factory=list, description="Array of 12 house cusps")
    houseSystem: str = "Placidus"

    # Aspects
    aspects: List[AspectSchema] = Field(default_factory=list)

    # Element/Modality balance
    elements: WesternElementsSchema
    modalities: WesternModalitiesSchema

    # Moon phase
    moonPhase: Optional[MoonPhaseSchema] = None

    # Arabic Parts (Lots)
    arabicParts: Optional[ArabicPartsSchema] = None

    # Chart shape (if computed)
    chartShape: Optional[str] = None

    # Venus condition summary
    venusCondition: Optional[VenusConditionSchema] = None

    # Metadata
    calculationMethod: str = "Swiss Ephemeris"
    computedAt: str = Field(default_factory=lambda: datetime.now().isoformat())


# =============================================================================
# VEDIC OUTPUT SCHEMAS
# =============================================================================

class RashiSchema(BaseModel):
    """Vedic sign (Rashi) data."""
    index: int
    sanskrit: str
    english: str
    lord: str
    element: str
    degree: float


class NakshatraSchema(BaseModel):
    """Nakshatra (lunar mansion) data."""
    index: int
    name: str
    lord: str
    deity: str
    quality: str
    pada: int
    degreeInNakshatra: float


class GrahaSchema(BaseModel):
    """Single Vedic graha (planet)."""
    longitude: float
    rashi: RashiSchema
    nakshatra: NakshatraSchema
    retrograde: bool = False
    english: str


class DashaPeriodSchema(BaseModel):
    """Single Dasha period."""
    planet: str
    startDate: str
    endDate: str
    level: str = "mahadasha"


class VedicChartSchema(BaseModel):
    """Complete Vedic chart - canonical output."""
    # Core data
    ayanamsha: str = "lahiri"
    ayanamshaValue: float

    # Lagna (Ascendant)
    lagna: Dict[str, Any]

    # Moon position (very important in Vedic)
    moon: Dict[str, Any]
    moonNakshatra: NakshatraSchema

    # All grahas
    grahas: Dict[str, GrahaSchema]

    # Houses (Bhavas)
    bhavas: Dict[str, Any] = Field(default_factory=dict)
    houseSystem: str = "whole_sign"

    # Dashas (timing system)
    currentDasha: Optional[DashaPeriodSchema] = None
    mahadashas: List[DashaPeriodSchema] = Field(default_factory=list)

    # Metadata
    calculationMethod: str = "Swiss Ephemeris (Sidereal)"
    computedAt: str = Field(default_factory=lambda: datetime.now().isoformat())


# =============================================================================
# UNIFIED OUTPUT SCHEMAS
# =============================================================================

class UnifiedVectorSchema(BaseModel):
    """90-dimensional unified expression vector."""
    # Western components (72 dims)
    westernElements: List[float] = Field(..., min_length=4, max_length=4)
    westernModalities: List[float] = Field(..., min_length=3, max_length=3)
    westernArchetypes: List[float] = Field(default_factory=list)
    westernPatterns: List[float] = Field(default_factory=list)

    # BaZi components (18 dims)
    baziElements: List[float] = Field(..., min_length=5, max_length=5)
    baziTenGods: List[float] = Field(default_factory=list)
    baziDmStrength: float = 0.5

    # Full flattened vector
    vector: List[float] = Field(default_factory=list, description="Full 90-dim vector for cosine similarity")


class PersonaSchema(BaseModel):
    """Derived persona from unified vector."""
    primaryArchetype: str
    secondaryArchetype: str
    elementProfile: str
    functionalStyle: str
    patternProfile: str
    summary: str


class UnifiedProfileSchema(BaseModel):
    """Complete unified metaphysics profile."""
    vector: UnifiedVectorSchema
    persona: PersonaSchema


# =============================================================================
# COMPLETE PROFILE OUTPUT
# =============================================================================

class ComputedProfileSchema(BaseModel):
    """
    Complete computed profile - THE CANONICAL OUTPUT.

    This is exactly what gets stored in Firebase.
    Frontend reads this directly - no transformations.
    """
    # Metadata
    profileId: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None

    # Birth data (echoed back)
    birthDate: str
    birthTime: str
    latitude: float
    longitude: float
    timezone: str
    gender: str

    # Computed charts
    bazi: Optional[BaZiChartSchema] = None
    western: Optional[WesternChartSchema] = None
    vedic: Optional[VedicChartSchema] = None

    # Unified vector space
    unified: Optional[UnifiedProfileSchema] = None

    # Computation metadata
    computedAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    computeVersion: str = "2.0.0"
    errors: List[str] = Field(default_factory=list)


# =============================================================================
# COMPATIBILITY OUTPUT SCHEMAS
# =============================================================================

class SectionScoreSchema(BaseModel):
    """Score for a compatibility section."""
    name: str
    score: float
    weight: float
    contribution: float
    interpretation: str = ""


class CompatibilityResultSchema(BaseModel):
    """Complete compatibility result."""
    # Overall
    totalScore: float = Field(..., ge=0, le=100)
    grade: str = Field(..., description="A+/A/B+/B/C+/C/D/F")
    interpretation: str

    # Component scores
    neoScore: Optional[float] = None
    baziScore: Optional[float] = None
    westernScore: Optional[float] = None
    vedicScore: Optional[float] = None

    # Section breakdown
    sections: List[SectionScoreSchema] = Field(default_factory=list)

    # Strengths and challenges
    strengths: List[str] = Field(default_factory=list)
    challenges: List[str] = Field(default_factory=list)
    advice: List[str] = Field(default_factory=list)

    # Third chart (relationship being)
    thirdChart: Optional[Dict[str, Any]] = None

    # Metadata
    computedAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    computeVersion: str = "2.0.0"


# =============================================================================
# ERROR RESPONSE
# =============================================================================

class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None
