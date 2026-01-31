# Luna Brain Architecture - Complete Technical Reference

## For Brother Sonnet - January 2026

This document provides a comprehensive overview of Luna's personality and memory systems, including the P4-P8 Personality Cathedral and RAG (Retrieval-Augmented Generation) infrastructure.

---

## Table of Contents

1. [Brain Architecture Overview](#brain-architecture-overview)
2. [Brain 7A: CPU / Calculations](#brain-7a-cpu--calculations)
3. [Brain 7B: 30-Facet Personality Vector](#brain-7b-30-facet-personality-vector)
4. [Brain 7C: Current Conversations](#brain-7c-current-conversations)
5. [Brain 8: Long-Term Memory](#brain-8-long-term-memory)
6. [P4-P8 Personality Engines](#p4-p8-personality-engines)
7. [RAG Systems](#rag-systems)
8. [File Reference](#file-reference)
9. [API Endpoints](#api-endpoints)

---

## Brain Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER NATAL INPUTS                                   │
│  (Birth date, time, location, personality assessments)                       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BRAIN 7A: CPU / CALCULATIONS                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  STATIC SOURCES:                                                        ││
│  │  • Big 5 (NEO PI-R)    • Enneagram (1-9 health levels)                 ││
│  │  • MBTI                • Numerology                                     ││
│  │  • BaZi (Four Pillars) • Western Zodiac (Sun, Moon, Ascendant)         ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  DYNAMIC ENGINES (P4-P8):                                               ││
│  │  • P4: Natal Aspects      → Birth chart planetary aspects               ││
│  │  • P5: Transits           → Current sky influences (temporary)          ││
│  │  • P6: Synastry/Composite → Two-user compatibility                      ││
│  │  • P7: Archetypes         → 12 Jungian archetypal mapping               ││
│  │  • P8: Progressions       → Secondary progressions + Progressed Moon    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                           Python Cloud Functions                             │
│                           (Swiss Ephemeris, Neo4j)                           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BRAIN 7B: PERSONALITY PROFILE (30-FACET NEO PI-R)         │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  30 Facets derived from Brain 7A weighted fusion:                       ││
│  │  N1-N6: Neuroticism     │  E1-E6: Extraversion   │  O1-O6: Openness    ││
│  │  A1-A6: Agreeableness   │  C1-C6: Conscientiousness                    ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  Weighted Source Contributions (when ALL sources available):            ││
│  │  • big5: 0.22    • bazi: 0.28     • enneagram: 0.16                    ││
│  │  • mbti: 0.08    • natal: 0.08    • aspects (P4): 0.12                 ││
│  │  • numerology: 0.06              • transits (P5): temporary delta      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BRAIN 7C: CURRENT CONVERSATIONS                            │
│  • Hot resume window: 15 days retention                                      │
│  • Real-time conversation context                                            │
│  • Dynamic personality adjustments from P5 transits                          │
│  • P6 synastry behavioral adaptations for specific users                     │
│                           Firebase/Firestore                                 │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │  (after 15 days)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BRAIN 8: LONG TERM MEMORY (LTM)                            │
│  • Fed by Brain 7C after 15-day window                                       │
│  • Compressed semantic memories                                              │
│  • Vector embeddings for recall (PostgreSQL + pgvector)                      │
│  • Graph relationships between entities (Neo4j)                              │
│                           Neo4j + PostgreSQL Vector Store                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Brain 7A: CPU / Calculations

Brain 7A is the calculation layer that processes all available personality data sources.

### Source Categories

| Category | Sources | Description |
|----------|---------|-------------|
| **Auto-Derived** | natal, bazi, numerology, aspects | Calculated from birth data alone |
| **Questionnaire** | big5, mbti, enneagram | Requires user to complete assessments |
| **Dynamic** | transits, progressions | Changes over time |

### Modular Design Principle

The system works with **whatever data is available**:
- No skip flags - simply omit missing sources
- Dynamic weight recalculation when sources are missing
- Minimum viable profile with just birth data (~60% confidence)

### Accuracy Tiers

| Sources Available | Confidence | Message |
|-------------------|------------|---------|
| Birth data only | 60% | "For greater accuracy, complete personality questionnaires" |
| + 1 questionnaire | 75% | "Good foundation! Add more assessments for deeper insights" |
| + 2 questionnaires | 85% | "Strong profile! One more assessment for maximum accuracy" |
| All 3 questionnaires | 95% | "Complete profile! Maximum personality accuracy achieved" |

---

## Brain 7B: 30-Facet Personality Vector

The output of Brain 7A is a 30-dimensional NEO PI-R personality vector.

### The 30 Facets

```
NEUROTICISM (N)           EXTRAVERSION (E)          OPENNESS (O)
─────────────────         ─────────────────         ─────────────────
N1: Anxiety               E1: Warmth                O1: Fantasy
N2: Angry Hostility       E2: Gregariousness        O2: Aesthetics
N3: Depression            E3: Assertiveness         O3: Feelings
N4: Self-Consciousness    E4: Activity              O4: Actions
N5: Impulsiveness         E5: Excitement-Seeking    O5: Ideas
N6: Vulnerability         E6: Positive Emotions     O6: Values

AGREEABLENESS (A)         CONSCIENTIOUSNESS (C)
─────────────────         ─────────────────────
A1: Trust                 C1: Competence
A2: Straightforwardness   C2: Order
A3: Altruism              C3: Dutifulness
A4: Compliance            C4: Achievement-Striving
A5: Modesty               C5: Self-Discipline
A6: Tender-Mindedness     C6: Deliberation
```

### Vector Index Mapping

```javascript
FACET_SHORT_CODES = {
  'N1': 0,  'N2': 1,  'N3': 2,  'N4': 3,  'N5': 4,  'N6': 5,
  'E1': 6,  'E2': 7,  'E3': 8,  'E4': 9,  'E5': 10, 'E6': 11,
  'O1': 12, 'O2': 13, 'O3': 14, 'O4': 15, 'O5': 16, 'O6': 17,
  'A1': 18, 'A2': 19, 'A3': 20, 'A4': 21, 'A5': 22, 'A6': 23,
  'C1': 24, 'C2': 25, 'C3': 26, 'C4': 27, 'C5': 28, 'C6': 29
}
```

---

## Brain 7C: Current Conversations

- **Retention**: 15-day hot window
- **Storage**: Firebase/Firestore
- **Features**:
  - Real-time conversation context
  - P5 transit overlays (temporary personality shifts)
  - P6 synastry adaptations (Luna adjusts behavior per user)

---

## Brain 8: Long-Term Memory

After 15 days, conversations are compressed and stored in long-term memory.

### Storage Systems

| System | Purpose | Technology |
|--------|---------|------------|
| **Vector Store** | Semantic similarity search | PostgreSQL + pgvector |
| **Graph Store** | Entity relationships, hidden connections | Neo4j AuraDB |

---

## P4-P8 Personality Engines

### P4: Natal Aspect Engine

**Purpose**: Birth chart aspects → 30-facet personality modifiers

**Location**: `functions-python/luna_fusion/sources/aspects.py`

**Key Features**:
- 7 aspect types: Conjunction, Opposition, Trine, Square, Sextile, Quincunx, Semi-sextile
- Orb-weighted strength calculation: `strength = 1.0 - (orb / max_orb)`
- 7 critical planet pairs: Sun-Moon, Sun-Saturn, Moon-Saturn, Moon-Pluto, Venus-Mars, Sun-Mars, Mars-Saturn
- Pattern detection: Grand Trine, T-Square, Yod, Grand Cross, Kite

**Aspect Type Modifiers**:
```python
ASPECT_TYPE_MODIFIERS = {
    'Conjunction': { 'quality': 'fusion', 'intensity': 1.0 },
    'Opposition':  { 'quality': 'challenging', 'N_mod': 0.12, 'intensity': 0.9 },
    'Trine':       { 'quality': 'harmonious', 'N_mod': -0.08, 'E_mod': 0.10, 'intensity': 0.85 },
    'Square':      { 'quality': 'challenging', 'N_mod': 0.15, 'C_mod': 0.08, 'intensity': 0.95 },
    'Sextile':     { 'quality': 'harmonious', 'O_mod': 0.08, 'A_mod': 0.05, 'intensity': 0.7 },
    'Quincunx':    { 'quality': 'adjustment', 'N_mod': 0.10, 'O_mod': 0.08, 'intensity': 0.6 }
}
```

---

### P5: Transits Engine

**Purpose**: Current sky → temporary personality influences

**Location**: `functions-python/luna_fusion/transits/transits_engine.py`

**Key Features**:
- Outer planet transits only (Jupiter, Saturn, Uranus, Neptune, Pluto)
- Transit-to-natal aspect detection
- Temporary delta applied to base personality vector
- Transit forecast generation

**Transit Planet Weights**:
```python
TRANSIT_PLANET_WEIGHTS = {
    'Jupiter': 0.7,   # Expansion, optimism
    'Saturn':  0.85,  # Structure, limitation
    'Uranus':  0.8,   # Disruption, innovation
    'Neptune': 0.65,  # Dissolution, dreams
    'Pluto':   0.9    # Transformation, power
}
```

---

### P6: Relational Synastry Fusion

**Purpose**: Two-user compatibility + behavioral adjustments

**Location**:
- `functions-python/luna_fusion/synastry/synastry_engine.py`
- `functions-python/luna_fusion/synastry/composite_engine.py`
- `functions-python/luna_fusion/synastry/bazi_synastry.py`

**Key Features**:

#### Western Synastry
- Compares two 30-facet vectors
- Domain-weighted compatibility scoring
- Behavioral adjustment rules for Luna

**Domain Weights**:
```python
DOMAIN_WEIGHTS = {
    'openness': 0.2,
    'conscientiousness': 0.15,
    'extraversion': 0.15,
    'agreeableness': 0.2,
    'emotional_intensity': 0.1,
    'insightful': 0.1,
    'nurturing': 0.1
}
```

**Behavioral Adjustments** (how Luna adapts):
```python
BEHAVIOR_RULES = {
    'warmth':     lambda diff: diff['agreeableness'] * 0.5 + diff['nurturing'] * 0.5,
    'directness': lambda diff: diff['extraversion'] * 0.4 + diff['ambitious'] * 0.3 - diff['agreeableness'] * 0.3,
    'playfulness': lambda diff: diff['playful'] * 0.6 + diff['adventurous'] * 0.4,
    'depth_level': lambda diff: diff['insightful'] * 0.5 + diff['emotional_intensity'] * 0.3 + diff['openness'] * 0.2
}
```

#### BaZi Synastry (Chinese Metaphysics)
- Six Harmonies (六合 Liu He)
- Three Harmonies (三合 San He)
- Six Clashes (沖 Chong)
- Six Harms (害 Hai)
- Three Punishments (刑 Xing)
- Five Element production/control cycles

#### Composite Chart
- Midpoint method for relationship personality
- Composite aspects and interpretations

---

### P7: Archetypal Narrative Layer

**Purpose**: 30-facet vector → 12 Jungian archetypes

**Location**:
- `functions-python/luna_fusion/archetypes/archetype_engine.py`
- `functions-python/luna_fusion/archetypes/narrative_templates.py`

**The 12 Archetypes**:

| Archetype | Primary Facets | Description |
|-----------|---------------|-------------|
| **Hero** | E3, C4, low N1 | Courageous, achievement-driven |
| **Caregiver** | A3, A6, E1 | Nurturing, protective |
| **Creator** | O1, O2, O5 | Imaginative, artistic |
| **Sage** | O5, C6, O6 | Wise, truth-seeking |
| **Lover** | O3, E1, A1 | Passionate, intimate |
| **Magician** | O4, O5, C1 | Transformative, visionary |
| **Ruler** | E3, C2, C5 | Authoritative, structured |
| **Rebel** | O4, low A4, E5 | Revolutionary, disruptive |
| **Explorer** | O4, E5, O1 | Adventurous, freedom-seeking |
| **Innocent** | A1, E6, low N1 | Optimistic, faithful |
| **Jester** | E6, E5, O1 | Playful, humorous |
| **Orphan** | N6, A5, N3 | Resilient, empathetic |

**Algorithm**: Cosine similarity between user's 30-facet vector and archetype signatures → top 3 archetypes with scores

---

### P8: Secondary Progressions + Progressed Moon

**Purpose**: Progressed planets + Moon → evolved personality

**Location**: `functions-python/luna_fusion/progressions/progressions_engine.py`

**Key Features**:
- Day-for-year secondary progressions
- Dedicated Progressed Moon engine (emotional heartbeat)
- Progressed Moon changes sign every ~2.5 years

**Progressed Moon Aspect Orbs** (tighter than natal):
```python
PROG_MOON_ASPECT_TYPES = {
    'conjunction': { 'angle': 0,   'orb': 4.0 },
    'opposition':  { 'angle': 180, 'orb': 4.0 },
    'trine':       { 'angle': 120, 'orb': 3.0 },
    'square':      { 'angle': 90,  'orb': 3.0 },
    'sextile':     { 'angle': 60,  'orb': 2.5 },
    'quincunx':    { 'angle': 150, 'orb': 1.5 }
}
```

**Weighted Combination**:
- 40% progressed-to-natal (core life themes)
- 30% progressed-to-progressed (inner dynamics)
- 30% Moon-specific (emotional weather)

---

## RAG Systems

Luna has two complementary RAG systems for long-term memory and context retrieval.

### System 1: PostgreSQL Vector Search (Semantic RAG)

**Purpose**: Semantic similarity search across biography chunks

**Technology**: PostgreSQL + pgvector extension

**Database**: Cloud SQL `genesis_memory`

**Table Structure**:
```sql
CREATE TABLE biography_chunks (
    id SERIAL PRIMARY KEY,
    chunk_hash VARCHAR(64) UNIQUE,
    profile_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255),
    chunk_index INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    topics TEXT[],
    sentiment VARCHAR(50),
    entities TEXT[],
    constitutional_themes TEXT[],
    relationship_dynamics TEXT[],
    metadata JSONB,
    embedding vector(1536),  -- OpenAI text-embedding-3-small
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

**Indexes**:
- `idx_biography_chunks_profile_id` - Profile lookup
- `idx_biography_chunks_topics` - GIN index for topic filtering
- `idx_biography_chunks_entities` - GIN index for entity filtering
- `idx_biography_chunks_themes` - GIN index for constitutional themes

**Current Status**:
- 195 chunks ingested
- 35 profiles indexed
- 195 OpenAI embeddings (1536 dimensions)

**Query Example**:
```sql
SELECT profile_name, content,
       1 - (embedding <=> query_embedding) as similarity
FROM biography_chunks
WHERE 1 - (embedding <=> query_embedding) > 0.7
ORDER BY similarity DESC
LIMIT 5;
```

---

### System 2: Neo4j GraphRAG (Relationship Discovery)

**Purpose**: Discover hidden connections between entities

**Technology**: Neo4j AuraDB

**Node Types**:
- `Profile` - User/historical figure profiles
- `ZodiacSign` - Sun, Moon, Rising signs
- `Element` - Fire, Earth, Air, Water
- `BaZiElement` - Wood, Fire, Earth, Metal, Water
- `Archetype` - 12 Jungian archetypes

**Relationship Types**:
- `HAS_SUN_SIGN`, `HAS_MOON_SIGN`, `HAS_RISING_SIGN`
- `HAS_DOMINANT_ELEMENT`
- `HAS_DAY_MASTER`
- `HAS_ARCHETYPE`
- `COMPATIBLE_WITH` (synastry connections)
- `SOUL_FAMILY` (elemental harmony)

**Query Example** (Find Soul Family):
```cypher
MATCH (p1:Profile {id: $userId})-[:HAS_DOMINANT_ELEMENT]->(e:Element)
MATCH (p2:Profile)-[:HAS_DOMINANT_ELEMENT]->(e)
WHERE p1 <> p2
RETURN p2.name, p2.sunSign, e.name as sharedElement
LIMIT 10
```

---

### RAG Context Service Integration

**Location**: `functions/services/ragContextService.js`

The service combines both systems:

```javascript
async function getRAGContext(query, userId) {
  // 1. Vector search for semantic matches
  const semanticResults = await vectorSearch(query);

  // 2. Graph search for hidden connections
  const graphResults = await graphSearch(userId);

  // 3. Combine and rank results
  return combineResults(semanticResults, graphResults);
}
```

---

## File Reference

### Python Backend

```
functions-python/luna_fusion/
├── __init__.py
├── core/
│   ├── __init__.py
│   ├── constants.py           # 30 dims, weights, aspect types
│   ├── vector_utils.py        # Normalization, clipping, blending
│   ├── swiss_ephemeris.py     # Swiss Ephemeris utilities
│   └── fusion_engine.py       # Main weighted fusion
├── sources/
│   ├── __init__.py
│   └── aspects.py             # P4 Natal Aspect Engine
├── transits/
│   ├── __init__.py
│   └── transits_engine.py     # P5 Transits Engine
├── synastry/
│   ├── __init__.py
│   ├── synastry_engine.py     # P6 Western Synastry
│   ├── composite_engine.py    # P6 Composite Chart
│   └── bazi_synastry.py       # P6 BaZi Compatibility
├── archetypes/
│   ├── __init__.py
│   ├── archetype_engine.py    # P7 Archetype Mapping
│   └── narrative_templates.py # P7 Story Templates
└── progressions/
    ├── __init__.py
    └── progressions_engine.py # P8 Progressions + Moon
```

### JavaScript Frontend

```
src/data/
├── lunaFusionService.js       # API client for Python functions
├── personalityFusionService.js # Existing 10-dim service
├── personalitySourceMappings.js # Source → facet mappings
└── lunaCpuSynthesis.js        # CPU synthesis helpers

src/services/
├── ragContextService.js       # RAG context retrieval
└── voiceService.js            # Voice interaction
```

### RAG Infrastructure

```
functions-python/
├── ingestion/
│   ├── chunking.py            # Text chunking with overlap
│   ├── enrichment.py          # Topic/entity extraction
│   └── biography_ingester.py  # Full ingestion pipeline
├── graph/
│   ├── neo4j_service.py       # Neo4j operations
│   └── graphrag_queries.py    # GraphRAG query templates
└── scripts/
    ├── convert_profiles_to_chunks.py
    ├── ingest_profiles.py
    └── profile_chunks.json    # 195 pre-generated chunks
```

---

## API Endpoints

### Luna Fusion Endpoints (Python Cloud Functions)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/luna_fusion` | POST | Main 30-facet fusion |
| `/luna_complete_profile` | POST | Full profile + archetypes + Luna config |
| `/luna_natal_aspects` | POST | P4 natal aspects |
| `/luna_transits` | POST | P5 current transits |
| `/luna_synastry_fusion` | POST | P6 Western synastry |
| `/luna_composite_chart` | POST | P6 composite chart |
| `/luna_archetypes` | POST | P7 archetype mapping |
| `/luna_progressions` | POST | P8 progressions + Moon |
| `/luna_personality` | POST | Luna AI configuration |
| `/bazi_compatibility` | POST | P6 BaZi synastry |

### Example: Main Fusion Call

```javascript
const result = await fetch('/luna_fusion', {
  method: 'POST',
  body: JSON.stringify({
    sources: {
      big5: { N1: 0.6, N2: 0.4, ... },
      mbti: { type: 'INFJ' },
      enneagram: { type: 4, wing: 5, health_level: 4 },
      natal: { sun: { sign: 'Taurus' }, moon: { sign: 'Cancer' } },
      bazi: { day_master: { element: 'Wood' } },
      numerology: { life_path: 7, expression: 3 }
    },
    birthData: {
      year: 1990, month: 5, day: 15,
      hour: 14, minute: 30, timezone_offset: -5
    },
    includeDynamic: true
  })
});

// Response
{
  vector: [0.45, 0.32, ...],  // 30 values
  confidence: 'strong',
  confidence_percent: 85,
  active_sources: ['big5', 'mbti', 'enneagram', 'natal', 'bazi', 'numerology', 'aspects'],
  archetypes: [
    { archetype: 'Creator', score: 0.82 },
    { archetype: 'Sage', score: 0.75 },
    { archetype: 'Lover', score: 0.68 }
  ],
  domain_scores: { N: 0.42, E: 0.58, O: 0.75, A: 0.62, C: 0.55 },
  message: 'Strong profile! One more assessment for maximum accuracy'
}
```

---

## Luna Personality Presets

Luna (the AI) has configurable personality presets:

| Preset | Description | Key Traits |
|--------|-------------|------------|
| **Nurturing Guide** | Warm, supportive, patient | warmth: 0.9, directness: 0.4 |
| **Wise Sage** | Thoughtful, insightful, measured | depth: 0.9, directness: 0.7 |
| **Playful Companion** | Fun, curious, lighthearted | playfulness: 0.9, warmth: 0.7 |
| **Direct Challenger** | Honest, motivating, growth-focused | directness: 0.9, challenge: 0.8 |
| **Empathic Listener** | Understanding, validating, present | warmth: 0.85, depth: 0.8 |

Users can also adjust Luna via sliders:
- Warmth (Cold ↔ Warm)
- Directness (Gentle ↔ Direct)
- Playfulness (Serious ↔ Playful)
- Depth (Light ↔ Deep)
- Challenge (Supportive ↔ Challenging)

---

## Summary

Luna's brain is a sophisticated multi-layered system:

1. **Brain 7A** calculates personality from all available sources (modular, works with partial data)
2. **Brain 7B** outputs a 30-facet NEO PI-R vector
3. **Brain 7C** handles current conversations (15-day hot window)
4. **Brain 8** stores long-term memories via PostgreSQL vectors + Neo4j graphs

The **P4-P8 engines** add dynamic, time-sensitive, and relational dimensions:
- P4: Birth chart aspects
- P5: Current transits
- P6: Two-user synastry + composite
- P7: Jungian archetypes
- P8: Secondary progressions

The **RAG systems** enable semantic and graph-based retrieval:
- PostgreSQL: 195 biography chunks with OpenAI embeddings
- Neo4j: Relationship graph for hidden connections

All systems are implemented and ready for deployment.

---

*Document created: January 13, 2026*
*For: Brother Sonnet (Claude Sonnet 4)*
*From: Brother Opus (Claude Opus 4.5)*
