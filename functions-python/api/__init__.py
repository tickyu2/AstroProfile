"""
api/__init__.py

GENESIS Unified API Module

Provides canonical endpoints for profile and compatibility computation.
All outputs follow the canonical schema - store directly in Firebase, read directly in frontend.

Endpoints:
- compute_profile: Compute BaZi + Western + Vedic + Unified in one call
- compute_compatibility: Compute multi-system compatibility between two profiles

Usage:
    from api import compute_profile, compute_compatibility
    from api.schemas import ComputeProfileRequest, BirthDataInput

    # Compute a profile
    request = ComputeProfileRequest(
        birth=BirthDataInput(
            birthDate="1983-07-06",
            birthTime="08:40",
            latitude=13.7563,
            longitude=100.5018,
            timezone="Asia/Bangkok",
            gender="female"
        )
    )
    result = compute_profile(request)

    # Store result.model_dump() directly in Firebase
"""

from .schemas import (
    # Input schemas
    BirthDataInput,
    ComputeProfileRequest,
    ComputeCompatibilityRequest,

    # Output schemas - BaZi
    PillarSchema,
    PillarsSchema,
    DayMasterSchema,
    TenGodSchema,
    ElementDistributionSchema,
    DaYunSchema,
    DaYunPillarSchema,
    SymbolicStarSchema,
    BaZiChartSchema,

    # Output schemas - Western
    PlanetPositionSchema,
    HouseCuspSchema,
    AspectSchema,
    WesternElementsSchema,
    WesternModalitiesSchema,
    WesternChartSchema,

    # Output schemas - Vedic
    RashiSchema,
    NakshatraSchema,
    GrahaSchema,
    DashaPeriodSchema,
    VedicChartSchema,

    # Output schemas - Unified
    UnifiedVectorSchema,
    PersonaSchema,
    UnifiedProfileSchema,

    # Complete profile output
    ComputedProfileSchema,

    # Compatibility output
    SectionScoreSchema,
    CompatibilityResultSchema,

    # Error response
    ErrorResponse,
)

from .compute_profile import (
    compute_profile,
    compute_bazi,
    compute_western,
    compute_vedic,
    compute_unified,
)

from .compute_compatibility import (
    compute_compatibility,
    compute_bazi_compatibility,
    compute_western_compatibility,
    compute_unified_compatibility,
    score_to_grade,
    score_to_interpretation,
)

__version__ = "2.0.0"

__all__ = [
    # Version
    "__version__",

    # Input schemas
    "BirthDataInput",
    "ComputeProfileRequest",
    "ComputeCompatibilityRequest",

    # Output schemas - BaZi
    "PillarSchema",
    "PillarsSchema",
    "DayMasterSchema",
    "TenGodSchema",
    "ElementDistributionSchema",
    "DaYunSchema",
    "DaYunPillarSchema",
    "SymbolicStarSchema",
    "BaZiChartSchema",

    # Output schemas - Western
    "PlanetPositionSchema",
    "HouseCuspSchema",
    "AspectSchema",
    "WesternElementsSchema",
    "WesternModalitiesSchema",
    "WesternChartSchema",

    # Output schemas - Vedic
    "RashiSchema",
    "NakshatraSchema",
    "GrahaSchema",
    "DashaPeriodSchema",
    "VedicChartSchema",

    # Output schemas - Unified
    "UnifiedVectorSchema",
    "PersonaSchema",
    "UnifiedProfileSchema",

    # Complete profile output
    "ComputedProfileSchema",

    # Compatibility output
    "SectionScoreSchema",
    "CompatibilityResultSchema",

    # Error response
    "ErrorResponse",

    # Main functions
    "compute_profile",
    "compute_bazi",
    "compute_western",
    "compute_vedic",
    "compute_unified",
    "compute_compatibility",
    "compute_bazi_compatibility",
    "compute_western_compatibility",
    "compute_unified_compatibility",
    "score_to_grade",
    "score_to_interpretation",
]
