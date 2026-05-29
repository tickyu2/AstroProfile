# Universal Compatibility Engine (Swiss + pgvector + Neo4j)

## What this ships
- Swiss ephemeris feature extraction (`feature_extractor.py`)
- pgvector ANN shortlist (`pgvector_store.py`)
- explainable scoring (`scorer.py`)
- Neo4j relationship graph persistence (`neo4j_graph_store.py`)
- orchestration service (`service.py`)
- Firebase endpoints (`routes/matchmaking.py`)

## Why this scales
You do **not** run full database matching every request.
Pipeline is:
1) vectorize user
2) retrieve top-K candidates from pgvector
3) run deep compatibility scoring only on shortlist
4) persist top results to Neo4j

## Endpoints
- `compatibility_engine_status` (GET)
- `compatibility_upsert_profile` (POST)
- `compatibility_match_user` (POST)

## Required env
- `MATCH_PG_DSN`
- `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
- optional: `MATCH_VECTOR_DIM`, `MATCH_SHORTLIST_K`, `MATCH_TOP_N`

## Example request body (match)
```json
{
  "userId": "yaxin",
  "birth": {
    "birthDate": "2011-02-01",
    "birthTime": "03:26",
    "latitude": 31.3439,
    "longitude": 104.2006,
    "timezone": "Asia/Shanghai"
  },
  "psych": {
    "openness": 0.72,
    "conscientiousness": 0.68,
    "extraversion": 0.54,
    "agreeableness": 0.66,
    "neuroticism": 0.42
  }
}
```

---

## New Scoring Blocks (to include House/Ruler/Angle mechanics)

Add these components to the deep scorer (v2):

### 1) AngleDynamicsScore (ADS)
Use ASC/MC/DSC/IC + major aspects.

Formula (0-1):
`ADS = 0.35*ascAspectQuality + 0.30*mcAspectQuality + 0.20*angleRulerCondition + 0.15*axisStability`

Inputs:
- aspects from luminaries/personal planets to angles
- sign/house condition of ASC ruler and MC ruler
- volatility near angle sign/cusp transitions

### 2) HousePlacementScore (HPS)
Measures life-domain harmony via house overlays and natal houses.

Formula (0-1):
`HPS = 0.30*coreHouseHarmony + 0.25*relationshipHouseFit + 0.25*careerPurposeFit + 0.20*frictionPenaltyAdjusted`

Core houses to weight:
- 1st/4th/7th/10th (identity/home/partnership/public role)
- 2nd/6th/8th/11th for value/work/intimacy/network support

### 3) RulershipNetworkScore (RNS)
Includes house rulers, dispositors, and ruler dignity/placement.

Formula (0-1):
`RNS = 0.40*houseRulerStrength + 0.25*rulerAspectSupport + 0.20*dispositorCoherence + 0.15*rulerHouseAlignment`

Must include:
- rulers of 1st, 4th, 7th, 10th
- ruler sign/house/aspects/retrograde state
- dispositor chain coherence (max depth configurable)

### Recommended universal compatibility blend (v2)

`TotalV2 = 0.22*SunMoonRising + 0.14*VenusMars + 0.12*MercuryIntel + 0.10*SaturnStability + 0.14*ADS + 0.14*HPS + 0.14*RNS`

This keeps sign-level accessibility while adding true chart mechanics.

---

## Implementation tasks for current codebase

1. Extend `feature_extractor.py` with:
- angle longitudes (ASC/MC/DSC/IC)
- house placements for key planets
- house rulers and ruler condition features
- optional dispositor chain fields

2. Extend `scorer.py` with:
- `compute_angle_dynamics_score(...)`
- `compute_house_placement_score(...)`
- `compute_rulership_network_score(...)`

3. Add config weights in `config.py`:
- `w_angles`, `w_houses`, `w_rulership`

4. Persist explainability fields:
- include ADS/HPS/RNS breakdown in `match_candidates.score_breakdown` and Neo4j edge `explain`.
