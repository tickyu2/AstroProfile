# BaZi Engine Documentation

## Joey Yap Standard Implementation

This document details the **bazi_engine** Python package - a production-ready Chinese astrology engine following Joey Yap conventions with sxtwl (寿星万年历) for accurate solar term calculations.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Solar Calculation Backend](#solar-calculation-backend)
3. [Core Features](#core-features)
4. [API Reference](#api-reference)
5. [UI/UX Ready Outputs](#uiux-ready-outputs)
6. [Cloud Function Endpoints](#cloud-function-endpoints)

---

## Architecture Overview

```
bazi_engine/
├── __init__.py          # Main exports and analyze_bazi()
├── utils.py             # Constants: stems, branches, elements
├── calendar_conv.py     # Gregorian ↔ Lunar conversion (sxtwl)
├── solar_terms.py       # 24 Solar Terms calculation
├── stems_branches.py    # Four Pillars generation
├── hidden_stems.py      # 藏干 Hidden Stems analysis
├── ten_gods.py          # 十神 Ten Gods derivation
├── symbolic_stars.py    # 神煞 Symbolic Stars detection
├── luck_pillars.py      # 大運 DaYun/Luck Pillars
├── growth_phases.py     # 十二長生 Twelve Growth Phases
├── life_palace.py       # 命宮/胎元 Life & Conception Palace
└── explainability.py    # L0-L3 narrative generation
```

---

## Solar Calculation Backend

### sxtwl Integration (寿星万年历)

The engine uses **sxtwl 2.x** for astronomical accuracy:

```python
# Check availability
from bazi_engine import has_sxtwl
print(has_sxtwl())  # True if sxtwl is installed
```

### Key Solar Functions

| Function | Purpose | Accuracy |
|----------|---------|----------|
| `lichun_datetime_for_year(year)` | Get exact Lichun (立春) datetime | ±1 minute |
| `get_solar_term_for_date(dt)` | Current solar term | Astronomical |
| `get_bazi_month_index(dt)` | Joey Yap month (1-12 from Yin) | Solar-term based |
| `get_all_solar_terms_for_year(year)` | All 24 terms with datetimes | Full year |
| `get_jie_boundaries_for_month(dt)` | Month start/end Jie times | For UI display |

### Solar Term Calendar (二十四节气)

```python
from bazi_engine import get_all_solar_terms_for_year

terms_2024 = get_all_solar_terms_for_year(2024)
# Returns: [("Lichun", datetime(2024, 2, 4, 16, 27)), ...]
```

**Month-Starting Jie Terms (节):**
| BaZi Month | Branch | Jie Term | Approx Date |
|------------|--------|----------|-------------|
| 1 | Yin (寅) | Lichun (立春) | Feb 4 |
| 2 | Mao (卯) | Jingzhe (惊蛰) | Mar 6 |
| 3 | Chen (辰) | Qingming (清明) | Apr 5 |
| 4 | Si (巳) | Lixia (立夏) | May 6 |
| 5 | Wu (午) | Mangzhong (芒种) | Jun 6 |
| 6 | Wei (未) | Xiaoshu (小暑) | Jul 7 |
| 7 | Shen (申) | Liqiu (立秋) | Aug 8 |
| 8 | You (酉) | Bailu (白露) | Sep 8 |
| 9 | Xu (戌) | Hanlu (寒露) | Oct 8 |
| 10 | Hai (亥) | Lidong (立冬) | Nov 7 |
| 11 | Zi (子) | Daxue (大雪) | Dec 7 |
| 12 | Chou (丑) | Xiaohan (小寒) | Jan 6 |

---

## Core Features

### 1. Four Pillars (四柱)

```python
from bazi_engine import four_pillars_from_datetime
from datetime import datetime

pillars = four_pillars_from_datetime(datetime(1990, 5, 15, 14, 30))
# Returns: [("Geng", "Wu"), ("Xin", "Si"), ("Geng", "Chen"), ("Gui", "Wei")]
#          Year          Month         Day            Hour
```

**Output Structure:**
```json
{
  "pillars": [["Geng", "Wu"], ["Xin", "Si"], ["Geng", "Chen"], ["Gui", "Wei"]],
  "pillars_dict": {
    "year": ["Geng", "Wu"],
    "month": ["Xin", "Si"],
    "day": ["Geng", "Chen"],
    "hour": ["Gui", "Wei"]
  },
  "pillars_info": {
    "pillars": {
      "year": {"stem": "Geng", "branch": "Wu", "gan_zhi": "Geng-Wu", "element": "Metal"},
      "month": {"stem": "Xin", "branch": "Si", "gan_zhi": "Xin-Si", "element": "Metal"},
      "day": {"stem": "Geng", "branch": "Chen", "gan_zhi": "Geng-Chen", "element": "Metal"},
      "hour": {"stem": "Gui", "branch": "Wei", "gan_zhi": "Gui-Wei", "element": "Water"}
    },
    "day_master": "Geng",
    "day_master_element": "Metal",
    "using_sxtwl": true
  }
}
```

### 2. Day Master (日主)

```python
from bazi_engine import get_day_master

dm = get_day_master(pillars)  # Returns: "Geng"
```

**Output Structure:**
```json
{
  "day_master": {
    "stem": "Geng",
    "branch": "Chen",
    "element": "Metal"
  }
}
```

### 3. Hidden Stems (藏干)

Joey Yap canonical mapping with Main/Medium/Residual weights:

```python
from bazi_engine import get_hidden_stems, get_weighted_hidden_stems

hidden = get_hidden_stems("Chen")  # ["Wu", "Yi", "Gui"]
weighted = get_weighted_hidden_stems("Chen")  # [("Wu", 0.6), ("Yi", 0.3), ("Gui", 0.1)]
```

**Branch → Hidden Stems Mapping:**
| Branch | Hidden Stems (Main → Residual) |
|--------|-------------------------------|
| Zi (子) | Gui |
| Chou (丑) | Ji, Gui, Xin |
| Yin (寅) | Jia, Bing, Wu |
| Mao (卯) | Yi |
| Chen (辰) | Wu, Yi, Gui |
| Si (巳) | Bing, Wu, Geng |
| Wu (午) | Ding, Ji |
| Wei (未) | Ji, Ding, Yi |
| Shen (申) | Geng, Ren, Wu |
| You (酉) | Xin |
| Xu (戌) | Wu, Xin, Ding |
| Hai (亥) | Ren, Jia |

**Output Structure:**
```json
{
  "hidden_stems": {
    "year": ["Ding", "Ji"],
    "month": ["Bing", "Wu", "Geng"],
    "day": ["Wu", "Yi", "Gui"],
    "hour": ["Ji", "Ding", "Yi"]
  },
  "hidden_stems_raw": {
    "year": [["Ding", 0.7], ["Ji", 0.3]],
    "month": [["Bing", 0.6], ["Wu", 0.3], ["Geng", 0.1]],
    "day": [["Wu", 0.6], ["Yi", 0.3], ["Gui", 0.1]],
    "hour": [["Ji", 0.6], ["Ding", 0.3], ["Yi", 0.1]]
  }
}
```

### 4. Element Distribution (五行分布)

```python
from bazi_engine import element_distribution

dist = element_distribution(pillars)
# Returns: {"Wood": 5.0, "Fire": 20.0, "Earth": 22.5, "Metal": 38.75, "Water": 13.75}
```

**Output Structure:**
```json
{
  "element_distribution": {
    "Wood": 5.0,
    "Fire": 20.0,
    "Earth": 22.5,
    "Metal": 38.75,
    "Water": 13.75
  }
}
```

### 5. Day Master Strength (日主强弱)

```python
from bazi_engine import day_master_strength

strength = day_master_strength(pillars)
```

**Output Structure:**
```json
{
  "dm_strength": {
    "score": 1.0,
    "classification": "resource-abundant",
    "day_master": "Geng",
    "day_master_element": "Metal",
    "details": {
      "self_element_percentage": 38.75,
      "resource_element": "Earth",
      "resource_percentage": 22.5,
      "combined_support": 54.5
    }
  }
}
```

**Classifications:**
| Score Range | Classification | Meaning |
|-------------|---------------|---------|
| < 0.40 | under-supported | Weak Day Master, needs support |
| 0.40 - 0.65 | balanced | Harmonious energy distribution |
| > 0.65 | resource-abundant | Strong Day Master, leadership potential |

### 6. Ten Gods (十神)

```python
from bazi_engine import derive_ten_gods, ten_god_summary_5group

ten_gods = derive_ten_gods(dm_stem, pillars)
summary = ten_god_summary_5group(pillars)
```

**Ten Gods Mapping:**
| Ten God | Chinese | 5-Group | Meaning |
|---------|---------|---------|---------|
| BiJian | 比肩 | Companion | Same element, same polarity |
| JieCai | 劫财 | Companion | Same element, different polarity |
| ShiShen | 食神 | Output | Day Master produces, same polarity |
| ShangGuan | 伤官 | Output | Day Master produces, different polarity |
| ZhengCai | 正财 | Wealth | Day Master controls, different polarity |
| PianCai | 偏财 | Wealth | Day Master controls, same polarity |
| ZhengGuan | 正官 | Power | Controls Day Master, different polarity |
| QiSha | 七杀 | Power | Controls Day Master, same polarity |
| ZhengYin | 正印 | Resource | Produces Day Master, different polarity |
| PianYin | 偏印 | Resource | Produces Day Master, same polarity |

**Output Structure:**
```json
{
  "ten_gods": [
    {"pillar": "year", "stem": "Geng", "branch": "Wu", "ten_god": "BiJian", "label": "Companion (比肩)", "group_5": "Companion", "is_day_master": false},
    {"pillar": "month", "stem": "Xin", "branch": "Si", "ten_god": "JieCai", "label": "Rob Wealth (劫财)", "group_5": "Companion", "is_day_master": false},
    {"pillar": "day", "stem": "Geng", "branch": "Chen", "ten_god": "BiJian", "label": "Companion (比肩)", "group_5": "Companion", "is_day_master": true},
    {"pillar": "hour", "stem": "Gui", "branch": "Wei", "ten_god": "ShangGuan", "label": "Hurting Officer (伤官)", "group_5": "Output", "is_day_master": false}
  ],
  "ten_gods_summary": {
    "Companion": 0.667,
    "Output": 0.333,
    "Wealth": 0.0,
    "Power": 0.0,
    "Resource": 0.0
  }
}
```

### 7. Symbolic Stars (神煞)

```python
from bazi_engine import detect_symbolic_stars

stars = detect_symbolic_stars(pillars)
```

**Implemented Stars:**
| Star | Chinese | Meaning |
|------|---------|---------|
| Peach Blossom | 桃花 | Romance, attraction, charisma |
| Heavenly Noble | 天乙贵人 | Helpful people, protection |
| Academic Star | 文昌 | Academic success, writing talent |
| Traveling Horse | 驿马 | Travel, movement, relocation |
| Robbery Star | 劫煞 | Potential for loss, competition |
| Heavenly Virtue | 天德 | Divine protection, blessings |
| Monthly Virtue | 月德 | Monthly protection, kindness |
| Tai Ji Noble | 太极贵人 | Spiritual insight, wisdom |

**Output Structure:**
```json
{
  "symbolic_stars": {
    "PeachBlossom": {"detected": false, "chinese": "桃花", "english": "Peach Blossom", "meaning": "Romance, attraction, charisma, social appeal", "locations": []},
    "HeavenlyNoble": {"detected": true, "chinese": "天乙贵人", "english": "Heavenly Noble", "meaning": "Helpful people, support in times of need, protection", "noble_branches": ["Wei"]},
    "AcademicStar": {"detected": false, "chinese": "文昌", "english": "Academic Star", "meaning": "Academic success, writing talent, intellectual pursuits", "academic_branch": null},
    "TravelingHorse": {"detected": false, "chinese": "驿马", "english": "Traveling Horse", "meaning": "Travel, movement, relocation, active career", "locations": []},
    "RobberyStar": {"detected": false, "chinese": "劫煞", "english": "Robbery Star", "meaning": "Potential for loss, competition, need for caution", "robbery_branch": null},
    "HeavenlyVirtue": {"detected": true, "chinese": "天德", "english": "Heavenly Virtue", "meaning": "Divine protection, blessings, good fortune", "virtue_stem": "Xin"},
    "MonthlyVirtue": {"detected": true, "chinese": "月德", "english": "Monthly Virtue", "meaning": "Monthly protection, kindness, moral character", "virtue_stem": "Geng"},
    "TaiJiNoble": {"detected": false, "chinese": "太极贵人", "english": "Tai Ji Noble", "meaning": "Spiritual insight, wisdom, metaphysical interests", "taiji_branches": []}
  }
}
```

### 8. DaYun / Luck Pillars (大運)

```python
from bazi_engine import dayun_for_birth
from datetime import datetime

dayun = dayun_for_birth(datetime(1990, 5, 15, 14, 30), is_male=True, pillar_count=8)
```

**Direction Rules:**
| Year Stem | Gender | Direction |
|-----------|--------|-----------|
| Yang | Male | Forward (顺行) |
| Yang | Female | Backward (逆行) |
| Yin | Male | Backward (逆行) |
| Yin | Female | Forward (顺行) |

**Output Structure:**
```json
{
  "dayun": {
    "direction": "forward",
    "direction_chinese": "顺行",
    "onset_age": {
      "years": 7,
      "months": 0,
      "days": 0,
      "description": "First luck pillar begins at age 7"
    },
    "luck_pillars": [
      {"pillar_number": 1, "stem": "Ren", "branch": "Wu", "ganZhi": "RenWu", "age_start": 7, "age_end": 16, "age_range": "7-16"},
      {"pillar_number": 2, "stem": "Gui", "branch": "Wei", "ganZhi": "GuiWei", "age_start": 17, "age_end": 26, "age_range": "17-26"},
      {"pillar_number": 3, "stem": "Jia", "branch": "Shen", "ganZhi": "JiaShen", "age_start": 27, "age_end": 36, "age_range": "27-36"},
      {"pillar_number": 4, "stem": "Yi", "branch": "You", "ganZhi": "YiYou", "age_start": 37, "age_end": 46, "age_range": "37-46"},
      {"pillar_number": 5, "stem": "Bing", "branch": "Xu", "ganZhi": "BingXu", "age_start": 47, "age_end": 56, "age_range": "47-56"},
      {"pillar_number": 6, "stem": "Ding", "branch": "Hai", "ganZhi": "DingHai", "age_start": 57, "age_end": 66, "age_range": "57-66"},
      {"pillar_number": 7, "stem": "Wu", "branch": "Zi", "ganZhi": "WuZi", "age_start": 67, "age_end": 76, "age_range": "67-76"},
      {"pillar_number": 8, "stem": "Ji", "branch": "Chou", "ganZhi": "JiChou", "age_start": 77, "age_end": 86, "age_range": "77-86"}
    ],
    "interpretation": {
      "is_male": true,
      "year_stem_polarity": "Yang",
      "explanation": "Yang male: Luck pillars proceed forward from the month pillar. Life experiences tend to accelerate and expand over time."
    }
  }
}
```

### 9. Growth Phases (十二長生)

```python
from bazi_engine import get_all_pillar_phases, get_phase_summary

phases = get_all_pillar_phases(dm_stem, pillars)
summary = get_phase_summary(phases)
```

**Twelve Growth Phases:**
| Phase | Chinese | Energy | Meaning |
|-------|---------|--------|---------|
| ChangSheng | 长生 | 0.8 | Birth energy, new beginnings |
| MuYu | 沐浴 | 0.5 | Cleansing, vulnerability |
| GuanDai | 冠带 | 0.7 | Coming of age, independence |
| LinGuan | 临官 | 0.9 | Career peak, authority |
| DiWang | 帝旺 | 1.0 | Emperor, maximum power |
| Shuai | 衰 | 0.6 | Decline begins, wisdom |
| Bing | 病 | 0.3 | Illness, challenges |
| Si | 死 | 0.2 | Death/transformation |
| Mu | 墓 | 0.4 | Tomb, hidden resources |
| Jue | 绝 | 0.1 | Extinction, complete ending |
| Tai | 胎 | 0.3 | Embryo, conception |
| Yang | 养 | 0.5 | Nurturing, preparation |

**Output Structure:**
```json
{
  "growth_phases": {
    "year": {"phase": "MuYu", "phase_cn": "沐浴", "index": 1, "interpretation": "Cleansing phase - vulnerability, need for protection, preparation.", "energy_level": 0.5, "branch": "Wu"},
    "month": {"phase": "ChangSheng", "phase_cn": "长生", "index": 0, "interpretation": "Birth energy - new beginnings, potential, vitality.", "energy_level": 0.8, "branch": "Si"},
    "day": {"phase": "Yang", "phase_cn": "养", "index": 11, "interpretation": "Nurturing - protected growth, preparation.", "energy_level": 0.5, "branch": "Chen"},
    "hour": {"phase": "GuanDai", "phase_cn": "冠带", "index": 2, "interpretation": "Coming of age - gaining independence.", "energy_level": 0.7, "branch": "Wei"}
  },
  "growth_summary": {
    "average_energy": 0.62,
    "peak_phase": {"pillar": "month", "phase": "ChangSheng", "energy": 0.8},
    "low_phase": {"pillar": "year", "phase": "MuYu", "energy": 0.5},
    "favorable_pillars": 2,
    "pattern": "Balanced Life Force",
    "pattern_description": "Your chart shows steady, sustainable energy levels."
  }
}
```

### 10. Life Palace & Conception Palace (命宮 / 胎元)

```python
from bazi_engine import calculate_life_palace_stem, calculate_conception_palace

life_palace = calculate_life_palace_stem(year_stem, month_branch, hour_branch)
conception = calculate_conception_palace(month_stem, month_branch)
```

**Output Structure:**
```json
{
  "life_palace": {
    "stem": "Ding",
    "stem_cn": "丁",
    "branch": "Hai",
    "branch_cn": "亥",
    "element": "Water",
    "stem_element": "Fire",
    "gan_zhi": "Ding-Hai",
    "interpretation": "Intuitive and spiritual. You process life through feeling and inner knowing. Success in healing, counseling, or creative vision.",
    "characteristics": ["intuitive", "spiritual", "imaginative", "receptive"]
  },
  "conception_palace": {
    "stem": "Ren",
    "stem_cn": "壬",
    "branch": "Shen",
    "branch_cn": "申",
    "stem_element": "Water",
    "branch_element": "Metal",
    "gan_zhi": "Ren-Shen",
    "interpretation": "Represents the energy present at conception, influencing inherited traits and early life potential."
  }
}
```

---

## API Reference

### Main Analysis Function

```python
from bazi_engine import analyze_bazi
from datetime import datetime

chart = analyze_bazi(
    birth_dt=datetime(1990, 5, 15, 14, 30),
    is_male=True,
    include_dayun=True,
    dayun_pillar_count=8
)
```

**Returns complete chart with all features:**
- `birth_datetime` - ISO format birth time
- `gender` - "male" or "female"
- `pillars` - List of (stem, branch) tuples
- `pillars_dict` - Dict with year/month/day/hour keys
- `pillars_info` - Detailed pillar information
- `day_master` - Stem, branch, element
- `hidden_stems` - Per-pillar hidden stems
- `hidden_stems_raw` - With weights
- `element_distribution` - Five elements percentages
- `dm_strength` - Day Master strength analysis
- `ten_gods` - Full ten gods list
- `ten_gods_summary` - 5-group percentages
- `symbolic_stars` - Detected stars
- `growth_phases` - Per-pillar phases
- `growth_summary` - Energy pattern analysis
- `life_palace` - Life Palace calculation
- `conception_palace` - Conception Palace
- `dayun` - Luck pillars (if requested)
- `explanation` - L0-L3 narratives
- `sxtwl_available` - Solar calculation accuracy flag
- `calculated_at` - Timestamp

---

## UI/UX Ready Outputs

### Chart Display Cards

**1. Four Pillars Grid**
```
Year        Month       Day         Hour
庚午        辛巳        庚辰        癸未
Geng-Wu     Xin-Si      Geng-Chen   Gui-Wei
Metal Horse Metal Snake Metal Dragon Water Goat
```

**2. Day Master Card**
```json
{
  "display": {
    "stem": "Geng",
    "stem_cn": "庚",
    "element": "Metal",
    "element_cn": "金",
    "polarity": "Yang",
    "strength": "Resource-Abundant",
    "strength_score": 1.0
  }
}
```

**3. Element Balance Chart**
```json
{
  "chart_data": [
    {"element": "Wood", "value": 5.0, "color": "#4CAF50"},
    {"element": "Fire", "value": 20.0, "color": "#F44336"},
    {"element": "Earth", "value": 22.5, "color": "#FF9800"},
    {"element": "Metal", "value": 38.75, "color": "#9E9E9E"},
    {"element": "Water", "value": 13.75, "color": "#2196F3"}
  ]
}
```

**4. Ten Gods Radar Chart**
```json
{
  "radar_data": {
    "labels": ["Companion", "Output", "Wealth", "Power", "Resource"],
    "values": [0.667, 0.333, 0.0, 0.0, 0.0]
  }
}
```

**5. Luck Pillars Timeline**
```json
{
  "timeline": [
    {"age": "7-16", "pillar": "壬午", "element": "Water-Fire"},
    {"age": "17-26", "pillar": "癸未", "element": "Water-Earth"},
    {"age": "27-36", "pillar": "甲申", "element": "Wood-Metal"},
    // ... continues
  ],
  "current_pillar": {"index": 3, "age": 35}
}
```

**6. Growth Energy Gauge**
```json
{
  "gauge": {
    "value": 0.62,
    "max": 1.0,
    "label": "Balanced Life Force",
    "color_gradient": ["#ff4444", "#ffaa00", "#44ff44"]
  }
}
```

**7. Symbolic Stars Badges**
```json
{
  "badges": [
    {"name": "Heavenly Noble", "icon": "star", "color": "gold", "detected": true},
    {"name": "Heavenly Virtue", "icon": "shield", "color": "purple", "detected": true},
    {"name": "Monthly Virtue", "icon": "moon", "color": "silver", "detected": true}
  ]
}
```

### Explainability Layers

**L0 - Postcard (1-line summary)**
```
"A self-reliant Metal nature."
```

**L1 - Key Factors (bullet points)**
```json
[
  {"name": "Day Master: Metal", "influence": "neutral", "explanation": "clarifying and purposeful"},
  {"name": "Resource-Abundant Day Master", "influence": "notable", "explanation": "Natural leadership ability..."},
  {"name": "Dominant: Companion", "influence": "positive", "explanation": ""},
  {"name": "天乙贵人", "influence": "positive", "explanation": "Benefactor support and timely help"}
]
```

**L2 - Math/Calculations (for advanced users)**
```json
{
  "element_distribution": {"Wood": 5.0, "Fire": 20.0, "Earth": 22.5, "Metal": 38.75, "Water": 13.75},
  "dm_strength_calculation": {
    "score": 1.0,
    "method": "Weighted sum of same-element + resource-element percentages",
    "classification_thresholds": {"under-supported": "< 0.40", "balanced": "0.40 - 0.65", "resource-abundant": "> 0.65"}
  }
}
```

**L3 - Debug (for developers)**
```json
{
  "raw_pillars": [["Geng", "Wu"], ["Xin", "Si"], ["Geng", "Chen"], ["Gui", "Wei"]],
  "calculation_timestamp": "2026-01-11T05:40:03.199605",
  "sxtwl_used": true
}
```

---

## Cloud Function Endpoints

### Production URLs

| Endpoint | URL | Purpose |
|----------|-----|---------|
| `bazi_joey_yap` | https://bazi-joey-yap-sjpjwnbsmq-uc.a.run.app | Full BaZi analysis |
| `bazi_four_pillars` | https://bazi-four-pillars-sjpjwnbsmq-uc.a.run.app | Pillars only |
| `bazi_dayun` | https://bazi-dayun-sjpjwnbsmq-uc.a.run.app | DaYun/Luck Pillars |

### Request Format

```bash
curl -X POST https://bazi-joey-yap-sjpjwnbsmq-uc.a.run.app \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "isMale": true
  }'
```

### Response (Full Chart)

Complete JSON with all features as documented above.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-11 | Initial release with all core features |

---

## References

- Joey Yap BaZi Mastery Series
- 寿星万年历 (sxtwl) astronomical calculations
- Traditional Chinese metaphysics conventions
