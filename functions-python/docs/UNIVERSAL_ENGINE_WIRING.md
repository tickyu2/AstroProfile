# Universal Compatibility Engine - Frontend + Batch Wiring

## 1) Frontend wiring added
File: `src/services/pythonFunctionsService.js`

New exports:
- `compatibilityEngineStatus()`
- `compatibilityUpsertProfile(payload)`
- `compatibilityMatchUser(payload)`

Use `compatibilityMatchUser` to call Python endpoint `compatibility_match_user` from UI.

## 2) Batch precompute job added
File: `functions-python/scripts/precompute_vectors_batch.py`

Purpose:
- Read existing user profiles from Firestore
- Build Swiss-based vectors
- Upsert into Postgres pgvector + Neo4j user node

Run:
```bash
cd C:\astroprofile\functions-python
python scripts/precompute_vectors_batch.py --collection profiles --limit 5000
```

Expected profile document fields (or `birth` nested object):
- `birthDate`
- `birthTime`
- `latitude`
- `longitude`
- optional `timezone`
- optional `psych` with Big5 keys
## Pair Explain Endpoint

Added endpoint: `compatibility_explain_pair` (POST)

### Purpose
Compute a direct compatibility explanation for two specific profiles and return:
- score
- reason list
- component breakdown
- human-readable narrative

### Request example
```json
{
  "profileA": {
    "profileId": "yaxin",
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
  },
  "profileB": {
    "profileId": "candidate_42",
    "birth": {
      "birthDate": "2010-05-10",
      "birthTime": "10:15",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "timezone": "America/Los_Angeles"
    }
  }
}
```

### Response
- `score`
- `reasons[]`
- `explain{...}` includes ADS/HPS/RNS + Degree/Sabian scores
- `narrative` synthesized summary
