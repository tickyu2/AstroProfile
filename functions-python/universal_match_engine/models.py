from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class BirthInput:
    birth_date: str
    birth_time: str
    latitude: float
    longitude: float
    timezone: str = "UTC"

@dataclass
class ProfileVector:
    user_id: str
    vector: List[float]
    features: Dict[str, float]
    archetype_tags: List[str] = field(default_factory=list)

@dataclass
class MatchResult:
    user_id: str
    candidate_id: str
    total_score: float
    explain: Dict[str, float]
    reasons: List[str]
