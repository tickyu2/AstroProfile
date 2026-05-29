"""
western_engine/tuning_lab_models.py

Data models for the Birth Time Tuning Lab.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Tuple


# =============================================================================
# INPUT
# =============================================================================

@dataclass
class TuningLabRequest:
    """Input request for birth time tuning lab."""
    birth_date: str             # "YYYY-MM-DD"
    birth_time: str             # "HH:MM" (center of sweep)
    latitude: float
    longitude: float
    timezone: str = "UTC"
    sweep_minutes: int = 30     # +/- from birth_time (total range = 2x)
    step_seconds: int = 60      # Step size in seconds (default: 1 minute)
    events: Optional[List[Dict[str, Any]]] = None
    profile: str = "defaultBalanced"  # User preference profile


# =============================================================================
# LIGHTWEIGHT CHART (minimal data for scoring — NOT a full WesternChart)
# =============================================================================

@dataclass
class LightChart:
    """
    Lightweight chart for a single minute. Contains only what scoring needs.
    """
    jd: float                              # Julian Day
    local_time_label: str                  # "HH:MM"
    offset_minutes: int                    # relative to center time
    planet_longitudes: Dict[str, float]    # planet_name -> longitude (0-360)
    planet_speeds: Dict[str, float]        # planet_name -> speed (deg/day)
    planet_retrogrades: Dict[str, bool]    # planet_name -> is_retrograde
    cusps: Tuple[float, ...]               # 12 house cusps (Placidus)
    ascendant: float                       # ASC longitude
    midheaven: float                       # MC longitude
    # Derived (populated after construction)
    planet_signs: Dict[str, str] = field(default_factory=dict)
    planet_houses: Dict[str, int] = field(default_factory=dict)
    planet_degrees: Dict[str, float] = field(default_factory=dict)


# =============================================================================
# SCORING OUTPUT
# =============================================================================

@dataclass
class DimensionScore:
    """Score for a single scoring dimension."""
    name: str
    raw_score: float        # 0-100
    weight: float           # from DIMENSION_WEIGHTS
    weighted_score: float   # raw_score * weight
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MinuteScore:
    """Complete score for a single minute offset."""
    offset_minutes: int         # -30 to +30 (relative to center)
    time_label: str             # "HH:MM" absolute local time
    total_score: float          # 0-100 weighted aggregate (after volatility penalty)
    confidence_score: float = 0.0   # 0-100 blended total + stability
    volatility_penalty: float = 0.0  # 0-12 deducted from raw total
    stability_score: float = 0.0     # avg of identity stability + robustness
    dimensions: Dict[str, DimensionScore] = field(default_factory=dict)
    # Populated in stability pass:
    stability_1min: Optional[float] = None
    stability_2min: Optional[float] = None
    stability_5min: Optional[float] = None
    # Transition flags for volatility penalty:
    transition_flags: Dict[str, Any] = field(default_factory=dict)
    # Key chart facts for display:
    asc_sign: str = ""
    asc_degree: float = 0.0
    mc_sign: str = ""
    mc_degree: float = 0.0
    reason_codes: List[str] = field(default_factory=list)


@dataclass
class SensitivityCliff:
    """A point where the score changes dramatically between adjacent minutes."""
    minute_offset: int
    score_before: float
    score_after: float
    delta: float
    likely_cause: str


@dataclass
class StableWindow:
    """A contiguous range of minutes with consistent high scores."""
    start_offset: int
    end_offset: int
    avg_score: float
    min_score: float
    max_score: float
    width_minutes: int


@dataclass
class TuningLabResult:
    """Complete output from the Birth Time Tuning Lab."""
    birth_date: str
    center_time: str
    latitude: float
    longitude: float
    timezone: str
    sweep_range: int
    minute_scores: List[MinuteScore]
    top_5: List[MinuteScore]
    best_minute: MinuteScore
    best_stable_window: Optional[StableWindow]
    sensitivity_cliffs: List[SensitivityCliff]
    total_minutes_evaluated: int
    computation_time_ms: float
    profile_used: str = "defaultBalanced"
    engine_version: str = "1.1.0"

    def to_dict(self) -> Dict[str, Any]:
        """JSON-serializable output."""
        return {
            "birthDate": self.birth_date,
            "centerTime": self.center_time,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "timezone": self.timezone,
            "sweepRange": self.sweep_range,
            "minuteScores": [_minute_to_dict(ms) for ms in self.minute_scores],
            "top5": [
                {
                    "offsetMinutes": ms.offset_minutes,
                    "timeLabel": ms.time_label,
                    "totalScore": round(ms.total_score, 2),
                    "confidenceScore": round(ms.confidence_score, 2),
                    "ascSign": ms.asc_sign,
                    "ascDegree": round(ms.asc_degree, 2),
                    "mcSign": ms.mc_sign,
                    "reasonCodes": ms.reason_codes[:3],
                }
                for ms in self.top_5
            ],
            "bestMinute": {
                "offsetMinutes": self.best_minute.offset_minutes,
                "timeLabel": self.best_minute.time_label,
                "totalScore": round(self.best_minute.total_score, 2),
                "confidenceScore": round(self.best_minute.confidence_score, 2),
                "volatilityPenaltyApplied": round(self.best_minute.volatility_penalty, 2),
                "stabilityScore": round(self.best_minute.stability_score, 2),
                "ascSign": self.best_minute.asc_sign,
                "ascDegree": round(self.best_minute.asc_degree, 2),
                "mcSign": self.best_minute.mc_sign,
                "dimensions": {
                    name: round(ds.raw_score, 2)
                    for name, ds in self.best_minute.dimensions.items()
                },
                "reasonCodes": self.best_minute.reason_codes,
            },
            "bestStableWindow": {
                "startOffset": self.best_stable_window.start_offset,
                "endOffset": self.best_stable_window.end_offset,
                "avgScore": round(self.best_stable_window.avg_score, 2),
                "minScore": round(self.best_stable_window.min_score, 2),
                "maxScore": round(self.best_stable_window.max_score, 2),
                "widthMinutes": self.best_stable_window.width_minutes,
            } if self.best_stable_window else None,
            "sensitivityCliffs": [
                {
                    "minuteOffset": c.minute_offset,
                    "scoreBefore": round(c.score_before, 2),
                    "scoreAfter": round(c.score_after, 2),
                    "delta": round(c.delta, 2),
                    "likelyCause": c.likely_cause,
                }
                for c in self.sensitivity_cliffs
            ],
            "totalMinutesEvaluated": self.total_minutes_evaluated,
            "computationTimeMs": round(self.computation_time_ms, 1),
            "profileUsed": self.profile_used,
            "engineVersion": self.engine_version,
        }


def _minute_to_dict(ms: MinuteScore) -> Dict[str, Any]:
    """Serialize a single MinuteScore."""
    return {
        "offsetMinutes": ms.offset_minutes,
        "timeLabel": ms.time_label,
        "totalScore": round(ms.total_score, 2),
        "confidenceScore": round(ms.confidence_score, 2),
        "volatilityPenaltyApplied": round(ms.volatility_penalty, 2),
        "stabilityScore": round(ms.stability_score, 2),
        "dimensions": {
            name: {
                "rawScore": round(ds.raw_score, 2),
                "weight": ds.weight,
                "weightedScore": round(ds.weighted_score, 2),
            }
            for name, ds in ms.dimensions.items()
        },
        "stability1min": round(ms.stability_1min, 3) if ms.stability_1min is not None else None,
        "stability2min": round(ms.stability_2min, 3) if ms.stability_2min is not None else None,
        "stability5min": round(ms.stability_5min, 3) if ms.stability_5min is not None else None,
        "transitionFlags": ms.transition_flags,
        "ascSign": ms.asc_sign,
        "ascDegree": round(ms.asc_degree, 2),
        "mcSign": ms.mc_sign,
        "mcDegree": round(ms.mc_degree, 2),
        "reasonCodes": ms.reason_codes,
    }
