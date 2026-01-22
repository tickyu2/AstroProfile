"""
bazi_engine/models.py

Unified data models for BaZi charts.

Using dataclasses provides:
1. Type safety and documentation
2. Immutable data by default (frozen=True)
3. Easy serialization to dict/JSON
4. Reduced glue code across modules
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
from functools import cached_property


@dataclass(frozen=True)
class Pillar:
    """Single BaZi pillar (stem + branch pair)."""
    stem: str
    branch: str
    stem_idx: int = 0
    branch_idx: int = 0

    @property
    def ganzhi(self) -> str:
        """Get GanZhi string."""
        return f"{self.stem}{self.branch}"

    @property
    def ganzhi_cn(self) -> str:
        """Get Chinese GanZhi."""
        stem_cn = {
            "Jia": "甲", "Yi": "乙", "Bing": "丙", "Ding": "丁", "Wu": "戊",
            "Ji": "己", "Geng": "庚", "Xin": "辛", "Ren": "壬", "Gui": "癸"
        }
        branch_cn = {
            "Zi": "子", "Chou": "丑", "Yin": "寅", "Mao": "卯",
            "Chen": "辰", "Si": "巳", "Wu": "午", "Wei": "未",
            "Shen": "申", "You": "酉", "Xu": "戌", "Hai": "亥"
        }
        return f"{stem_cn.get(self.stem, self.stem)}{branch_cn.get(self.branch, self.branch)}"

    def to_tuple(self) -> Tuple[str, str]:
        """Convert to (stem, branch) tuple for compatibility."""
        return (self.stem, self.branch)


@dataclass(frozen=True)
class FourPillars:
    """Four Pillars of Destiny (四柱)."""
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar

    @property
    def day_master(self) -> str:
        """Get Day Master (day stem)."""
        return self.day.stem

    @property
    def all_stems(self) -> List[str]:
        """List of all stems."""
        return [self.year.stem, self.month.stem, self.day.stem, self.hour.stem]

    @property
    def all_branches(self) -> List[str]:
        """List of all branches."""
        return [self.year.branch, self.month.branch, self.day.branch, self.hour.branch]

    def to_list(self) -> List[Tuple[str, str]]:
        """Convert to list of tuples for compatibility."""
        return [
            self.year.to_tuple(),
            self.month.to_tuple(),
            self.day.to_tuple(),
            self.hour.to_tuple()
        ]

    def to_dict(self) -> Dict[str, Dict[str, str]]:
        """Convert to nested dictionary."""
        return {
            "year": {"stem": self.year.stem, "branch": self.year.branch, "ganzhi": self.year.ganzhi},
            "month": {"stem": self.month.stem, "branch": self.month.branch, "ganzhi": self.month.ganzhi},
            "day": {"stem": self.day.stem, "branch": self.day.branch, "ganzhi": self.day.ganzhi},
            "hour": {"stem": self.hour.stem, "branch": self.hour.branch, "ganzhi": self.hour.ganzhi}
        }


@dataclass
class HiddenStems:
    """Hidden stems for a branch with weights."""
    branch: str
    stems: Dict[str, float]  # {stem: weight}

    @property
    def main_qi(self) -> str:
        """Get the main Qi (highest weight stem)."""
        if not self.stems:
            return ""
        return max(self.stems.items(), key=lambda x: x[1])[0]


@dataclass
class TenGodResult:
    """Ten Gods derivation result."""
    pillar: str  # year, month, day, hour
    stem: str
    ten_god: str
    ten_god_cn: str
    group: str  # Performance, Resource, Output, Wealth, Authority

    def to_dict(self) -> Dict[str, str]:
        return {
            "pillar": self.pillar,
            "stem": self.stem,
            "ten_god": self.ten_god,
            "ten_god_cn": self.ten_god_cn,
            "group": self.group
        }


@dataclass
class DaYunPillar:
    """Single DaYun (10-year luck) pillar."""
    pillar_number: int
    stem: str
    branch: str
    age_start: int
    age_end: int

    @property
    def ganzhi(self) -> str:
        return f"{self.stem}{self.branch}"

    @property
    def age_range(self) -> str:
        return f"{self.age_start}-{self.age_end}"


@dataclass
class DaYunResult:
    """Complete DaYun calculation result."""
    direction: str  # "forward" or "backward"
    onset_years: int
    onset_months: int
    pillars: List[DaYunPillar]

    @property
    def direction_cn(self) -> str:
        return "顺行" if self.direction == "forward" else "逆行"


@dataclass
class ElementDistribution:
    """Five element distribution analysis."""
    wood: float
    fire: float
    earth: float
    metal: float
    water: float
    total: float = 1.0

    def to_dict(self) -> Dict[str, float]:
        return {
            "Wood": self.wood,
            "Fire": self.fire,
            "Earth": self.earth,
            "Metal": self.metal,
            "Water": self.water
        }

    @property
    def dominant(self) -> str:
        """Get dominant element."""
        elements = self.to_dict()
        return max(elements.items(), key=lambda x: x[1])[0]

    @property
    def weakest(self) -> str:
        """Get weakest element."""
        elements = self.to_dict()
        return min(elements.items(), key=lambda x: x[1])[0]


@dataclass
class DayMasterStrength:
    """Day Master strength analysis."""
    score: float  # 0.0 to 1.0
    category: str  # "strong", "weak", "balanced"
    supporting_elements: int
    draining_elements: int
    seasonal_strength: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "score": self.score,
            "category": self.category,
            "supporting_elements": self.supporting_elements,
            "draining_elements": self.draining_elements,
            "seasonal_strength": self.seasonal_strength
        }


@dataclass
class SymbolicStar:
    """Detected symbolic star."""
    name: str
    name_cn: str
    category: str  # "auspicious", "inauspicious", "neutral"
    pillar: str  # Where it was detected
    description: str


@dataclass
class GrowthPhase:
    """Growth phase (十二長生) for a pillar."""
    pillar_name: str
    phase: str
    phase_cn: str
    energy_level: float
    interpretation: str


@dataclass
class LifePalace:
    """Life Palace (命宮) result."""
    stem: str
    branch: str
    interpretation: str

    @property
    def ganzhi(self) -> str:
        return f"{self.stem}{self.branch}"


@dataclass
class BaZiChart:
    """
    Complete BaZi chart with all analysis.

    This is the unified output model containing all calculated data.
    Use this instead of raw dictionaries for better maintainability.
    """
    # Core data
    birth_datetime: datetime
    gender: str  # "male" or "female"
    pillars: FourPillars

    # Analysis results
    hidden_stems: Dict[str, HiddenStems]
    element_distribution: ElementDistribution
    dm_strength: DayMasterStrength
    ten_gods: List[TenGodResult]
    symbolic_stars: List[SymbolicStar]
    growth_phases: Dict[str, GrowthPhase]
    life_palace: LifePalace
    conception_palace: Optional[LifePalace]

    # Luck pillars
    dayun: Optional[DaYunResult] = None

    # Metadata
    sxtwl_available: bool = False
    calculated_at: datetime = field(default_factory=datetime.now)

    @property
    def day_master(self) -> str:
        """Get Day Master stem."""
        return self.pillars.day_master

    @property
    def day_master_element(self) -> str:
        """Get Day Master element."""
        from .utils import ELEMENT_MAP
        return ELEMENT_MAP.get(self.day_master, "")

    def to_dict(self) -> Dict[str, Any]:
        """Convert entire chart to dictionary for JSON serialization."""
        return {
            "birth_datetime": self.birth_datetime.isoformat(),
            "gender": self.gender,
            "pillars": self.pillars.to_dict(),
            "day_master": {
                "stem": self.day_master,
                "element": self.day_master_element
            },
            "hidden_stems": {
                k: {"branch": v.branch, "stems": v.stems}
                for k, v in self.hidden_stems.items()
            },
            "element_distribution": self.element_distribution.to_dict(),
            "dm_strength": self.dm_strength.to_dict(),
            "ten_gods": [tg.to_dict() for tg in self.ten_gods],
            "symbolic_stars": [asdict(s) for s in self.symbolic_stars],
            "growth_phases": {
                k: asdict(v) for k, v in self.growth_phases.items()
            },
            "life_palace": {
                "stem": self.life_palace.stem,
                "branch": self.life_palace.branch,
                "ganzhi": self.life_palace.ganzhi,
                "interpretation": self.life_palace.interpretation
            },
            "conception_palace": {
                "stem": self.conception_palace.stem,
                "branch": self.conception_palace.branch,
                "ganzhi": self.conception_palace.ganzhi,
                "interpretation": self.conception_palace.interpretation
            } if self.conception_palace else None,
            "dayun": {
                "direction": self.dayun.direction,
                "direction_cn": self.dayun.direction_cn,
                "onset_years": self.dayun.onset_years,
                "onset_months": self.dayun.onset_months,
                "pillars": [
                    {
                        "pillar_number": p.pillar_number,
                        "ganzhi": p.ganzhi,
                        "age_range": p.age_range
                    }
                    for p in self.dayun.pillars
                ]
            } if self.dayun else None,
            "sxtwl_available": self.sxtwl_available,
            "calculated_at": self.calculated_at.isoformat()
        }


# =============================================================================
# FACTORY FUNCTIONS
# =============================================================================

def create_pillar(stem: str, branch: str) -> Pillar:
    """Create a Pillar from stem and branch strings."""
    from .utils import HEAVENLY_STEMS, EARTHLY_BRANCHES

    stem_idx = HEAVENLY_STEMS.index(stem) if stem in HEAVENLY_STEMS else 0
    branch_idx = EARTHLY_BRANCHES.index(branch) if branch in EARTHLY_BRANCHES else 0

    return Pillar(
        stem=stem,
        branch=branch,
        stem_idx=stem_idx,
        branch_idx=branch_idx
    )


def create_four_pillars(pillars_list: List[Tuple[str, str]]) -> FourPillars:
    """Create FourPillars from list of (stem, branch) tuples."""
    return FourPillars(
        year=create_pillar(pillars_list[0][0], pillars_list[0][1]),
        month=create_pillar(pillars_list[1][0], pillars_list[1][1]),
        day=create_pillar(pillars_list[2][0], pillars_list[2][1]),
        hour=create_pillar(pillars_list[3][0], pillars_list[3][1])
    )
