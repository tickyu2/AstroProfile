"""
western_engine/spec_models.py

Canonical dataclass representation of TicBot's Birth Time Tuning Lab v1 spec.
Defines dimension weights, sub-component weights, user profiles, scoring config,
volatility penalty rules, and confidence envelope parameters.

This is the SINGLE SOURCE OF TRUTH for all scoring weights and thresholds.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any


@dataclass
class OrbDegrees:
    major: float = 6.0
    angles: float = 5.0
    tight: float = 2.0


@dataclass
class TimeSweep:
    stepMinutes: int = 1
    stabilityWindowsMinutes: List[int] = field(default_factory=lambda: [1, 2, 5])
    orbDegrees: OrbDegrees = field(default_factory=OrbDegrees)


@dataclass
class DerivedMetric:
    weight: float
    components: Dict[str, float] = field(default_factory=dict)
    notes: Optional[str] = None
    planets: Optional[List[str]] = None
    perPlanetComponents: Optional[Dict[str, float]] = None
    planetWeights: Optional[Dict[str, float]] = None
    enabledWhenEventsProvided: Optional[bool] = None


@dataclass
class VolatilityPenalty:
    enabled: bool = True
    penaltyRange: List[float] = field(default_factory=lambda: [0, 12])
    triggers: List[str] = field(default_factory=lambda: [
        "asc_sign_flip",
        "multiple_house_flips_same_minute",
        "angle_aspect_churn_high",
    ])


@dataclass
class ConfidenceEnvelope:
    method: str = "top_score_band"
    bandPercentBelowPeak: float = 3.0
    minContinuousMinutes: int = 3


@dataclass
class ScoringConfig:
    scale: str = "0-100"
    normalizeEachMetric: bool = True
    aggregateMethod: str = "weighted_sum"
    volatilityPenalty: VolatilityPenalty = field(default_factory=VolatilityPenalty)
    confidenceEnvelope: ConfidenceEnvelope = field(default_factory=ConfidenceEnvelope)


@dataclass
class BirthTimeSpec:
    version: str = "birthtime-tuning-lab-v1"
    description: str = (
        "Universal minute-by-minute birth time ranking "
        "with stability + preference weighting"
    )
    timeSweep: TimeSweep = field(default_factory=TimeSweep)
    requiredInputs: Dict[str, List[str]] = field(default_factory=dict)
    derivedMetrics: Dict[str, DerivedMetric] = field(default_factory=dict)
    scoring: ScoringConfig = field(default_factory=ScoringConfig)
    userProfiles: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    reasonCodes: List[str] = field(default_factory=list)


def build_default_spec() -> BirthTimeSpec:
    """Build the canonical default spec with all dimensions and profiles."""
    spec = BirthTimeSpec()

    spec.requiredInputs = {
        "birthMeta": ["date_local", "timezone", "latitude", "longitude"],
        "perMinute": [
            "datetime_local", "datetime_utc",
            "asc_lon", "mc_lon", "house_cusps_lon",
            "sun_lon", "moon_lon", "mercury_lon", "venus_lon", "mars_lon",
            "jupiter_lon", "saturn_lon", "uranus_lon", "neptune_lon", "pluto_lon",
            "planet_house_map", "planet_retrograde_map",
        ],
    }

    spec.derivedMetrics = {
        "identityStability": DerivedMetric(
            weight=0.16,
            components={
                "ascDriftSmoothness": 0.45,
                "mcDriftSmoothness": 0.15,
                "houseJumpPenalty": 0.30,
                "angleAspectChurnPenalty": 0.10,
            },
            notes="Higher score = fewer abrupt interpretation changes minute-to-minute",
        ),
        "chartCoherence": DerivedMetric(
            weight=0.10,
            components={
                "elementBalance": 0.35,
                "modalityBalance": 0.25,
                "angularDistribution": 0.20,
                "hemisphereBalance": 0.20,
            },
        ),
        "planetConditionComposite": DerivedMetric(
            weight=0.16,
            planets=["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"],
            perPlanetComponents={
                "essentialDignity": 0.35,
                "accidentalDignity": 0.25,
                "retrogradeAdjustment": 0.10,
                "combustionOrCazimi": 0.10,
                "aspectSupportVsStress": 0.20,
            },
            planetWeights={
                "sun": 0.18, "moon": 0.18, "mercury": 0.14, "venus": 0.14,
                "mars": 0.14, "jupiter": 0.11, "saturn": 0.11,
            },
        ),
        "luminaryQuality": DerivedMetric(
            weight=0.10,
            components={
                "sunCondition": 0.35,
                "moonCondition": 0.35,
                "sunMoonAspectQuality": 0.20,
                "sunMoonPhaseCoherence": 0.10,
            },
        ),
        "angularDynamics": DerivedMetric(
            weight=0.12,
            components={
                "aspectsToAscMcIcDsc": 0.40,
                "chartRulerCondition": 0.35,
                "mcRulerCondition": 0.25,
            },
        ),
        "aspectArchitecture": DerivedMetric(
            weight=0.10,
            components={
                "tightAspectDensity": 0.30,
                "hardSoftBalance": 0.25,
                "majorPatternBonus": 0.25,
                "orbWeightedHarmony": 0.20,
            },
        ),
        "lifeAreaEmphasis": DerivedMetric(
            weight=0.08,
            components={
                "relationshipAxis": 0.25,
                "careerAxis": 0.25,
                "creativityAxis": 0.20,
                "serviceHealthAxis": 0.15,
                "spiritualityAxis": 0.15,
            },
            notes="These are user-adjustable via preference profile",
        ),
        "eventBacktesting": DerivedMetric(
            weight=0.06,
            enabledWhenEventsProvided=True,
            components={
                "eventTimingFit": 0.60,
                "eventThemeFit": 0.40,
            },
        ),
        "interpretationRobustness": DerivedMetric(
            weight=0.12,
            components={
                "plusMinus1mConsistency": 0.40,
                "plusMinus2mConsistency": 0.35,
                "plusMinus5mConsistency": 0.25,
            },
            notes="Penalize fragile peaks; reward stable plateaus",
        ),
    }

    spec.userProfiles = {
        "defaultBalanced": {"overrides": {}},
        "relationalAesthetic": {
            "overrides": {
                "lifeAreaEmphasis.weight": 0.12,
                "angularDynamics.weight": 0.14,
                "chartCoherence.weight": 0.12,
                "aspectArchitecture.weight": 0.12,
            }
        },
        "careerStrategic": {
            "overrides": {
                "angularDynamics.weight": 0.16,
                "planetConditionComposite.weight": 0.18,
                "lifeAreaEmphasis.components.careerAxis": 0.40,
            }
        },
        "spiritualIntuitive": {
            "overrides": {
                "luminaryQuality.weight": 0.14,
                "aspectArchitecture.weight": 0.14,
                "lifeAreaEmphasis.components.spiritualityAxis": 0.30,
            }
        },
    }

    spec.reasonCodes = [
        "ASC_STABLE",
        "HOUSE_FLIP_RISK",
        "LUMINARY_STRONG",
        "LUMINARY_STRESSED",
        "CHART_RULER_STRONG",
        "ANGLE_SUPPORT_HIGH",
        "PATTERN_COHERENT",
        "VOLATILE_ZONE",
        "EVENT_FIT_HIGH",
    ]

    return spec
