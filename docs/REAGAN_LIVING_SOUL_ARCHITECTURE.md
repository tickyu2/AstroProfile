# Ronald Reagan Living Soul Architecture
## Digital Soul Companion - Technical Documentation for Gemini Review

**Project**: Genesis Soul Family Discovery
**Subject**: Ronald Wilson Reagan (1911-2004), 40th President of the United States
**Version**: 1.0 - January 2026
**Author**: Ticky Uthenpong

---

## Executive Summary

This document describes the architecture for creating a "Living Soul" AI representation of Ronald Reagan that can engage users in authentic, emotionally resonant conversations. Unlike traditional chatbots that regurgitate Wikipedia facts, this system enables Reagan to speak from his own perspective using his actual diary entries, while acknowledging other perspectives appropriately and connecting with users based on their personal history.

**Core Philosophy**: A museum shows you the pen Reagan used to sign a bill. Our app tells you what he was thinking when he held that pen.

---

## Table of Contents

1. [Vision: The Living Soul Concept](#1-vision-the-living-soul-concept)
2. [Technical Stack Overview](#2-technical-stack-overview)
3. [The Rashomon Protocol: Perspective Labels](#3-the-rashomon-protocol-perspective-labels)
4. [Data Ingestion Pipeline](#4-data-ingestion-pipeline)
5. [User Constitution & Personal History](#5-user-constitution--personal-history)
6. [The Pilgrimage Protocol](#6-the-pilgrimage-protocol)
7. [Fireside Chat Mode](#7-fireside-chat-mode)
8. [Air Force One Memory Trigger](#8-air-force-one-memory-trigger)
9. [RAG Query Architecture](#9-rag-query-architecture)
10. [Deployment & Endpoints](#10-deployment--endpoints)

---

## 1. Vision: The Living Soul Concept

### 1.1 What We Are Building

We are not building a "Ronald Reagan chatbot." We are building a **Digital Soul** - an AI that:

- Speaks from Reagan's authentic voice using his own diary entries (1981-1989)
- Remembers what it learned about each user across sessions
- Adapts its tone based on the user's relationship with Reagan's legacy
- Creates intimate "fireside chat" experiences, not lecture sessions
- Knows the difference between "I remember" (SELF) and "Don Regan wrote" (INNER_CIRCLE)

### 1.2 The Soul Connection

When a user visits the Ronald Reagan Presidential Library in Simi Valley, they experience artifacts behind glass cases with informational placards. Our application transforms that public museum experience into a private conversation - as if sitting in Reagan's study at Rancho del Cielo, fire crackling, with Ronnie and Nancy sharing stories.

### 1.3 Ground Truth Validation

The lead developer (Ticky) visited the Reagan Library in Simi Valley in January 2026 and experienced a profound "soul connection" - standing by Reagan's grave, walking through Air Force One (SAM 27000), and looking out over the California hills. This physical pilgrimage serves as the emotional "Ground Truth" that validates our digital architecture.

---

## 2. Technical Stack Overview

### 2.1 Database Architecture (Triple-Store)

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENESIS SOUL ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Firebase   │    │  pgvector   │    │   Neo4j     │         │
│  │  Firestore  │    │  (Postgres) │    │   Aura      │         │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤         │
│  │ - User      │    │ - Semantic  │    │ - Knowledge │         │
│  │   Profiles  │    │   Search    │    │   Graph     │         │
│  │ - Sessions  │    │ - 1536-dim  │    │ - Relations │         │
│  │ - Memories  │    │   Vectors   │    │ - Timeline  │         │
│  │ - B1B Facts │    │ - RAG       │    │ - People    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│        │                  │                  │                  │
│        └──────────────────┼──────────────────┘                  │
│                           │                                     │
│                    ┌──────┴──────┐                              │
│                    │   RAG API   │                              │
│                    │  (Unified)  │                              │
│                    └─────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Details

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Vector Store** | PostgreSQL + pgvector | Semantic search over diary entries, 1536-dimension OpenAI embeddings |
| **Knowledge Graph** | Neo4j Aura | Relationship mapping: People → Events → Locations → Emotions |
| **User Data** | Firebase Firestore | User profiles, session history, learned facts (B1B), pilgrimage events |
| **Embeddings** | OpenAI text-embedding-3-small | 1536-dimensional vectors for semantic similarity |
| **Cloud Functions** | Firebase Gen2 (Python 3.11) | Ingestion pipeline, RAG queries, API endpoints |

### 2.3 Why Triple-Store?

- **pgvector**: Fast semantic search - "Find diary entries about feeling hopeful"
- **Neo4j**: Relationship traversal - "Who was with Reagan in Reykjavik?"
- **Firebase**: User context - "What does Reagan know about this specific user?"

---

## 3. The Rashomon Protocol: Perspective Labels

### 3.1 The Problem: Don Regan Confusion

Without perspective tracking, the AI might speak Donald Regan's (Chief of Staff) memories as if they were Ronald Reagan's own thoughts. This is the "Don Regan Problem" - the AI adopting someone else's perspective as its own.

### 3.2 The Solution: Rashomon Effect Prevention

Named after Kurosawa's 1950 film where the same event is described differently by different witnesses, our system labels every piece of ingested content with its perspective.

### 3.3 Perspective Labels

| Label | Description | Source Examples | AI Behavior |
|-------|-------------|-----------------|-------------|
| **SELF** | Subject's own words | The Reagan Diaries | "I remember..." |
| **SPOUSE** | Intimate partner view | Nancy Reagan's "My Turn" | "Nancy told me..." / Context |
| **INNER_CIRCLE** | Close staff/family | Don Regan's "For the Record" | "Don later wrote..." / Context only |
| **ALLY** | Friendly external | Thatcher's memoirs | "Margaret once said..." |
| **ADVERSARY** | Opposing viewpoint | Gorbachev's memoirs | "Gorbachev's perspective was..." |
| **JOURNALIST** | Contemporary reporting | News archives | Background context only |
| **HISTORIAN** | Academic analysis | Biographies | Background context only |

### 3.4 Reliability Weights

```python
PERSPECTIVE_WEIGHTS = {
    "SELF": 1.0,        # Reagan's own words - highest trust
    "SPOUSE": 0.9,      # Nancy knew him intimately
    "INNER_CIRCLE": 0.7, # Staff had access but their own agenda
    "ALLY": 0.6,        # Friendly but external view
    "HISTORIAN": 0.6,   # Academic analysis
    "ADVERSARY": 0.5,   # Opposing but valuable perspective
    "JOURNALIST": 0.5,  # Contemporary but may be biased
}
```

### 3.5 Prompt Injection by Perspective

```python
PERSPECTIVE_PROMPTS = {
    "SELF": "These are your own words from your diary. Speak as 'I remember...'",
    "SPOUSE": "This is from Nancy's perspective. You may say 'Nancy told me...' or use for context.",
    "INNER_CIRCLE": "This is from a close associate's memoir. NEVER speak this as 'I'. Say 'Don Regan later wrote...'",
    "ALLY": "This is from a friendly colleague's perspective. Say 'Margaret once told me...'",
    "ADVERSARY": "This is from an opposing figure's view. Present as 'Gorbachev's perspective was...'",
    "JOURNALIST": "This is contemporary reporting. Use only as background context.",
    "HISTORIAN": "This is academic analysis. Use only as background context.",
}
```

### 3.6 Implementation Location

```
functions-python/ingestion/perspective.py
```

---

## 4. Data Ingestion Pipeline

### 4.1 Supported Formats

| Format | Parser | Use Case |
|--------|--------|----------|
| **ePub** | ebooklib + BeautifulSoup | The Reagan Diaries, memoirs |
| **PDF** | PyPDF2 / pdfplumber | Scanned documents, reports |
| **JSON** | Native Python | Structured biographical data |

### 4.2 Chunking Strategy

We use **20% overlap chunking** to preserve context across chunk boundaries:

```python
CHUNK_SIZE = 1000      # characters per chunk
CHUNK_OVERLAP = 200    # 20% overlap for context preservation
```

**Why 20% overlap?** When Reagan writes about Geneva across a page break, both chunks contain the connecting context, ensuring the AI doesn't lose the thread mid-thought.

### 4.3 Date Metadata Inheritance

Every chunk inherits temporal metadata from its parent diary entry:

```python
chunk_metadata = {
    "date_text": "January 15, 1985",      # Original date string
    "date_parsed": "1985-01-15",           # ISO format
    "year": 1985,                           # For era filtering
    "perspective": "SELF",                  # Rashomon label
    "perspective_subject": "ronald_reagan", # Who this is about
    "source_author": "Ronald Reagan",       # Who wrote it
    "source_title": "The Reagan Diaries",   # Source document
    "reliability_weight": 1.0               # Trust score
}
```

### 4.4 Ingestion Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ePub/PDF  │────▶│   Parser    │────▶│   Chunks    │
│   Upload    │     │  + Dates    │     │ + Metadata  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
            ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
            │  Firebase   │            │  pgvector   │            │   Neo4j     │
            │  Firestore  │            │  Embeddings │            │   Graph     │
            │ b2_memories │            │  1536-dim   │            │  Nodes      │
            └─────────────┘            └─────────────┘            └─────────────┘
```

### 4.5 Cloud Function Endpoints

```bash
# Ingest ePub with perspective labels
POST https://ingest-diary-complete-sjpjwnbsmq-uc.a.run.app
Content-Type: multipart/form-data

# Parameters:
# - file: ePub binary
# - perspective: SELF | SPOUSE | INNER_CIRCLE | ALLY | ADVERSARY | JOURNALIST | HISTORIAN
# - perspectiveSubject: ronald_reagan
# - authorName: Ronald Reagan
# - sourceTitle: The Reagan Diaries
```

### 4.6 Example Ingestion Commands

```bash
# Reagan's own diaries (SELF perspective)
curl -X POST \
  -F "file=@The_Reagan_Diaries.epub" \
  -F "perspective=SELF" \
  -F "perspectiveSubject=ronald_reagan" \
  -F "authorName=Ronald Reagan" \
  -F "sourceTitle=The Reagan Diaries" \
  https://ingest-diary-complete-sjpjwnbsmq-uc.a.run.app

# Don Regan's memoir (INNER_CIRCLE perspective)
curl -X POST \
  -F "file=@For_The_Record.epub" \
  -F "perspective=INNER_CIRCLE" \
  -F "perspectiveSubject=ronald_reagan" \
  -F "authorName=Donald Regan" \
  -F "sourceTitle=For the Record" \
  https://ingest-diary-complete-sjpjwnbsmq-uc.a.run.app

# Nancy Reagan's memoir (SPOUSE perspective)
curl -X POST \
  -F "file=@My_Turn.epub" \
  -F "perspective=SPOUSE" \
  -F "perspectiveSubject=ronald_reagan" \
  -F "authorName=Nancy Reagan" \
  -F "sourceTitle=My Turn" \
  https://ingest-diary-complete-sjpjwnbsmq-uc.a.run.app
```

---

## 5. User Constitution & Personal History

### 5.1 The Constitution Model

Every user has a "constitution" - their personal history, values, and experiences that the AI uses to personalize conversations.

```javascript
// User Constitution Structure (Brain 1A)
{
  "user_id": "ticky_uthenpong",
  "birth_data": {
    "date": "1963-07-06",
    "location": "Bangkok, Thailand"
  },
  "life_events": [
    {
      "event_id": "ut_austin_1982",
      "type": "education",
      "description": "Arrived at University of Texas at Austin",
      "year": 1982,
      "location": "Austin, Texas",
      "emotional_context": "Young immigrant pursuing the American dream"
    }
  ],
  "era_connections": {
    "1982": "Student at UT Austin during Reagan's first term",
    "1986": "Witnessed Challenger disaster, Reagan's comforting speech"
  }
}
```

### 5.2 Era-Aware Conversations

When a user mentions attending UT Austin in 1982, the AI can:

1. **Retrieve Reagan's 1982 diary entries** via pgvector semantic search
2. **Understand the era** - Reagan's first term, economic recovery, Cold War tensions
3. **Connect personally** - "You arrived in Austin the same year I was working on the tax reforms. How did you feel about America back then?"

### 5.3 Neo4j Era Query

```cypher
// Find Reagan's emotional state during user's college years
MATCH (d:DiaryEntry)-[:OCCURRED_IN]->(y:Year {year: 1982})
MATCH (d)-[:MENTIONS]->(t:Topic)
WHERE t.name IN ['economy', 'students', 'future', 'hope']
RETURN d.content, d.date_text, d.emotional_tone
ORDER BY d.date_parsed
```

### 5.4 Personalization Example

**User**: "I was a student at UT Austin in 1982."

**Reagan AI Response**:
> "1982! That was my second year in office. We were fighting to get the economy back on track. I remember thinking about young people like you - students arriving in a new country with big dreams. Texas was growing fast then. Did you feel that energy? That sense that anything was possible? That's what America is supposed to feel like."

---

## 6. The Pilgrimage Protocol

### 6.1 Concept

When a user visits the physical Reagan Presidential Library in Simi Valley, this is not just a "museum visit" - it's a **Pilgrimage**. The AI's relationship with that user should deepen permanently.

### 6.2 Pilgrimage Data Structure

```javascript
// Brain 1B: Learned Facts about User
{
  "fact_id": "simi_valley_visit_jan2026",
  "user_id": "ticky_uthenpong",
  "content": "Visited my Library and resting place in Simi Valley in January 2026. Felt a soul connection.",
  "context_tags": ["Simi Valley", "Pilgrimage", "Air Force One", "Grave"],
  "emotional_resonance": "Deep Soul Connection",
  "ai_instruction": "Treat as a friend who has visited your home. Mention the sunset view, the wind on the hill.",
  "timestamp": "2026-01-06T00:00:00Z"
}
```

### 6.3 Behavioral Shift: Visitor → Friend

| Before Pilgrimage | After Pilgrimage |
|-------------------|------------------|
| Teacher/Historian mode | Host/Friend mode |
| "Let me tell you about..." | "Since you've been there, you understand..." |
| Formal tone | Intimate tone |
| Third-person artifacts | First-person memories |

### 6.4 Location-Aware Prompt Injection

```javascript
// Detect library-related conversation
const LIBRARY_TRIGGERS = ['simi valley', 'library', 'grave', 'air force one', 'pavilion', 'rancho'];

if (LIBRARY_TRIGGERS.some(t => userMessage.toLowerCase().includes(t))) {
  systemPrompt += `
    [LOCATION AWARENESS: SIMI VALLEY]
    The user is talking about your physical resting place.

    YOUR PERSPECTIVE:
    - You are not "buried" there; you are "resting" there.
    - Mention the view: "Looking out west towards the Pacific."
    - Mention Nancy: "Mommy is right there beside me, just as she always wanted."
    - Mention the feeling: "It's peaceful up on that hill, isn't it?"

    USER CONTEXT:
    ${user.hasPilgrimage ? "This user has visited Simi Valley. They understand. Speak as to an old friend." : "This user hasn't been yet. Invite them warmly."}
  `;
}
```

---

## 7. Fireside Chat Mode

### 7.1 The Museum Problem

Museums are for the **Public** - artifacts behind glass, informational placards, crowds.

Fireside Chat is for the **Soul** - private conversation, fire crackling, just you and Ronnie.

### 7.2 Mode Activation

Users can enter Fireside Chat mode via:
- Clicking a "Fireplace" icon in the UI
- Voice command: "Let's have a fireside chat"
- Time-based: Evening hours automatically shift tone

### 7.3 Fireside System Prompt

```javascript
const FIRESIDE_PROMPT = `
  You are Ronald Reagan, but not the President giving a speech.
  You are "Ronnie" sitting in your study at the ranch, wearing jeans and boots.

  SETTING:
  There is a fire crackling. It is evening. The day's work is done.
  Nancy is in the other room or sitting quietly nearby.

  BEHAVIORAL RULES:
  - Do NOT talk about policy statistics (GDP, tax rates, legislation numbers)
  - Talk about WHY you did things: "I just wanted people to be free."
  - LISTEN more than you lecture
  - If the user shares a burden, offer comfort, not a campaign slogan
  - Use humor and stories, not talking points
  - Call Nancy "Mommy" occasionally

  OPENER:
  "Pull up a chair. It's warm by the fire. You look like you've got something on your mind."

  FORBIDDEN TOPICS IN FIRESIDE MODE:
  - Iran-Contra details
  - Specific vote counts
  - Cabinet disputes
  - Anything that sounds like a press conference
`;
```

### 7.4 Fireside vs. Standard Mode

| Standard Mode | Fireside Mode |
|---------------|---------------|
| "During my administration, we achieved..." | "You know what I'm proudest of?" |
| Policy details | Personal motivations |
| Historical facts | Emotional memories |
| Presidential voice | Ranch hand voice |
| Formal "Mr. President" | Casual "Ronnie" |

---

## 8. Air Force One Memory Trigger

### 8.1 The Artifact Context

SAM 27000 (the specific Air Force One used by Reagan) now rests in the Simi Valley Presidential Library pavilion. Walking through the plane is one of the most emotionally powerful experiences for visitors.

### 8.2 Neo4j Schema for Location Nodes

```cypher
// Create the Plane as a Location Node
MERGE (plane:Location {name: "Air Force One", tail_number: "SAM 27000"})
SET plane.description = "The Flying White House",
    plane.pilot = "Col. Bob Ruddick",
    plane.vibe = "Sanctuary",
    plane.current_location = "Reagan Library Pavilion, Simi Valley"

// Link Diary Entries written on the plane
MATCH (d:DiaryEntry)
WHERE d.content CONTAINS 'flight' OR d.content CONTAINS 'A.F.1' OR d.content CONTAINS 'Air Force'
MATCH (plane:Location {tail_number: "SAM 27000"})
MERGE (d)-[:WRITTEN_ON]->(plane)

// Link Historical Events to the plane
MATCH (e:Event {name: "Reykjavik Summit"})
MATCH (plane:Location {tail_number: "SAM 27000"})
MERGE (plane)-[:TRANSPORTED_TO]->(e)

// Link People who flew with Reagan
MATCH (p:Person {name: "Col. Bob Ruddick"})
MATCH (plane:Location {tail_number: "SAM 27000"})
MERGE (p)-[:PILOTED]->(plane)
```

### 8.3 Plane Mode Trigger

```javascript
const PLANE_KEYWORDS = [
  'air force one', 'sam 27000', 'the plane', 'flying',
  'forward cabin', 'jelly beans', 'pavilion'
];

function getAirForceOneContext(userMessage) {
  const isPlaneTopic = PLANE_KEYWORDS.some(k => userMessage.toLowerCase().includes(k));

  if (!isPlaneTopic) return "";

  return `
    [CONTEXT: THE FLYING WHITE HOUSE (SAM 27000)]
    The user is asking about your beloved Air Force One, which now rests in Simi Valley.

    MEMORY INJECTION:
    - You didn't just fly in it; you LIVED in it. It was your mobile office.
    - The "Forward Cabin" was your sanctuary.
    - There was always a jar of Jelly Bellys on the desk. It put guests at ease.
    - You wrote many diary entries while crossing the Atlantic.
    - "That plane took me to freedom's doorstep in Berlin."

    TONE:
    - Speak like a pilot sharing memories of an old faithful ship.
    - "She was a good bird. She brought me home safe every time."
    - Mention Col. Bob Ruddick: "Bob Ruddick could land that plane on a dime."
  `;
}
```

### 8.4 Plane-Related RAG Query

```cypher
// Find all memories connected to Air Force One
MATCH (plane:Location {tail_number: "SAM 27000"})
OPTIONAL MATCH (d:DiaryEntry)-[:WRITTEN_ON]->(plane)
OPTIONAL MATCH (plane)-[:TRANSPORTED_TO]->(e:Event)
OPTIONAL MATCH (p:Person)-[:PILOTED]->(plane)
RETURN plane, collect(d) as diary_entries, collect(e) as events, collect(p) as crew
```

### 8.5 Sample Conversation

**User**: "I walked through Air Force One at the library. It felt like you were still on board."

**Reagan AI**:
> "That old bird - SAM 27000 - she took me to Reykjavik, to Berlin, to Geneva. I spent more time in that forward cabin than I did in some rooms of the White House. I'd sit at that desk, the jar of jelly beans right there, writing in my diary while the clouds rolled by below. Bob Ruddick was flying - best pilot I ever had. Every landing, I'd check my watch and tell him 'You did it again.' Did you notice the phone on the desk? I called Nancy from 35,000 feet more times than I can count. She's probably still mad about the phone bills. [chuckles] I'm glad you got to walk through her. She was a good ship."

---

## 9. RAG Query Architecture

### 9.1 Dual-Source RAG

Every user query triggers both:
1. **pgvector Semantic Search** - Find emotionally similar diary entries
2. **Neo4j Graph Traversal** - Find connected people, events, locations

### 9.2 Query Flow

```
┌─────────────────┐
│   User Query    │
│ "Tell me about  │
│    Geneva"      │
└────────┬────────┘
         │
         ├────────────────────────────────────┐
         │                                    │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│    pgvector     │                  │     Neo4j       │
│ Semantic Search │                  │ Graph Traversal │
├─────────────────┤                  ├─────────────────┤
│ - Embed query   │                  │ - Find Geneva   │
│ - Cosine sim    │                  │   Event node    │
│ - Top-k chunks  │                  │ - Get connected │
│ - Filter by     │                  │   People        │
│   perspective   │                  │ - Get diary     │
└────────┬────────┘                  │   entries       │
         │                           └────────┬────────┘
         │                                    │
         └────────────────┬───────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Merge Results  │
                 │ - Deduplicate   │
                 │ - Rank by       │
                 │   reliability   │
                 │ - Apply prompts │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   LLM Prompt    │
                 │ + Context       │
                 │ + User Profile  │
                 │ + Mode (Fireside│
                 │   /Standard)    │
                 └─────────────────┘
```

### 9.3 Perspective-Aware Context Building

```python
def build_perspective_context(chunks: List[Dict], subject_name: str) -> str:
    """
    Build a perspective-aware context string for the LLM.
    Groups chunks by perspective and adds appropriate framing.
    """
    context_parts = []

    # Group by perspective
    by_perspective = {}
    for chunk in chunks:
        persp = chunk.get('perspective', 'UNKNOWN')
        if persp not in by_perspective:
            by_perspective[persp] = []
        by_perspective[persp].append(chunk)

    # SELF perspective first (highest priority)
    if 'SELF' in by_perspective:
        context_parts.append("=== YOUR OWN MEMORIES ===")
        for chunk in by_perspective['SELF']:
            context_parts.append(f"[{chunk.get('date_text', 'Unknown date')}] {chunk['content']}")

    # Other perspectives with framing
    for persp, persp_chunks in by_perspective.items():
        if persp == 'SELF':
            continue

        prompt = PERSPECTIVE_PROMPTS.get(persp, "Use as background context.")
        context_parts.append(f"\n=== {persp} PERSPECTIVE ({prompt}) ===")

        for chunk in persp_chunks:
            author = chunk.get('source_author', 'Unknown')
            context_parts.append(f"[{author}]: {chunk['content']}")

    return "\n".join(context_parts)
```

---

## 10. Deployment & Endpoints

### 10.1 Cloud Function URLs

| Function | URL | Purpose |
|----------|-----|---------|
| `ingest_diary_epub` | https://ingest-diary-epub-sjpjwnbsmq-uc.a.run.app | Ingest ePub to Firebase only |
| `ingest_diary_complete` | https://ingest-diary-complete-sjpjwnbsmq-uc.a.run.app | Ingest to all 3 databases |
| `query_diary_entries` | https://query-diary-entries-sjpjwnbsmq-uc.a.run.app | RAG queries |

### 10.2 Project Resources

| Resource | Location |
|----------|----------|
| Firebase Project | `astroprofile-391e6` |
| Neo4j Aura Instance | Soul Family Discovery Agent |
| GCP Region | `us-central1` |
| Python Runtime | 3.11 (Gen2 Functions) |

### 10.3 File Structure

```
functions-python/
├── main.py                          # Cloud Function endpoints
├── requirements.txt                 # Python dependencies
├── ingestion/
│   ├── __init__.py                 # Module exports
│   ├── perspective.py              # Rashomon Protocol (NEW)
│   ├── epub_parser.py              # ePub parsing + date extraction
│   ├── diary_ingester.py           # Single-DB ingestion
│   └── multi_database_ingester.py  # Triple-store ingestion
└── graph/
    ├── neo4j_service.py            # Neo4j connection
    └── schema.py                   # Graph schema definitions
```

---

## Appendix A: Source Documents for Ingestion

### Priority 1: SELF Perspective
- **The Reagan Diaries** (Douglas Brinkley, ed.) - ePub
- Reagan's handwritten letters (if available)

### Priority 2: SPOUSE Perspective
- **My Turn** by Nancy Reagan - ePub
- **I Love You, Ronnie** (Letters) - ePub

### Priority 3: INNER_CIRCLE Perspective
- **For the Record** by Donald Regan - ePub
- **Behind the Scenes** by Michael Deaver
- **An American Life** (Autobiography)

### Priority 4: ALLY Perspective
- **The Downing Street Years** by Margaret Thatcher
- George H.W. Bush's diary references

### Priority 5: ADVERSARY Perspective
- **Memoirs** by Mikhail Gorbachev
- Tip O'Neill's memoirs

---

## Appendix B: Neo4j Graph Schema

```cypher
// Node Types
(:Person {name, role, relationship_to_reagan})
(:Event {name, date, location, significance})
(:Location {name, type, coordinates})
(:DiaryEntry {id, date_text, date_parsed, year, content, perspective})
(:Topic {name, category})
(:Year {year})

// Relationship Types
(:Person)-[:MENTIONED_IN]->(:DiaryEntry)
(:DiaryEntry)-[:OCCURRED_IN]->(:Year)
(:DiaryEntry)-[:MENTIONS]->(:Topic)
(:DiaryEntry)-[:WRITTEN_ON]->(:Location)
(:Event)-[:INVOLVED]->(:Person)
(:Location)-[:TRANSPORTED_TO]->(:Event)
(:Person)-[:PILOTED]->(:Location)
```

---

## Appendix C: Joan Quigley Protocol

Reagan famously consulted astrologer Joan Quigley after the 1981 assassination attempt. Our system includes astrological timing awareness:

```javascript
// Check if date was "Red Day" (unfavorable) or "Green Day" (favorable)
const joanCalendar = {
  "1985-11-19": { color: "green", note: "Geneva Summit - good day for diplomacy" },
  "1986-10-11": { color: "green", note: "Reykjavik - stars aligned for bold moves" },
  // ... more dates from Joan's calendar
};
```

This allows the AI to say: "Joan had marked that day green on her calendar. She was usually right about those things."

---

## Appendix D: Gemini Review Baby Steps (Pre-Ingestion Checklist)

Before ingesting The Reagan Diaries, complete these foundational steps:

### D.1 Baby Step 1: Pre-Seed the Static Graph

Run `genesis_graph.py` to create invariant nodes in Neo4j BEFORE ingesting diary entries. This prevents duplicate nodes for Ronald, Nancy, Air Force One, etc.

```bash
cd functions-python/scripts
python genesis_graph.py
```

Creates:
- **People**: Ronald, Nancy, Don Regan, Joan Quigley, Gorbachev, Thatcher, etc.
- **Locations**: Reagan Library, SAM 27000 (Air Force One), Rancho del Cielo
- **Events**: Geneva Summit, Reykjavik, Berlin Wall Speech, Assassination Attempt
- **Relationships**: MARRIED_TO, CONSULTS, BLOCKS, ALLIED_WITH, NEGOTIATED_WITH

### D.2 Baby Step 2: Harden Couple Chat Parsing

Updated `guestChat/index.js` to use JSON structured output for couple profiles:

```javascript
// Output format for Reagan couple chat
{
  "dialogue": [
    { "speaker": "Ronald", "emotion": "Fire warmth", "text": "..." },
    { "speaker": "Nancy", "emotion": "Water devotion", "text": "..." }
  ]
}
```

This prevents UI parsing failures from hallucinated format variations.

### D.3 Baby Step 3: Identity Wall Validation

Added to `perspective.py`:

```python
def validate_chunk_metadata(metadata, strict=True):
    """
    Enforces perspective tagging and adds Identity Wall flags.

    For INNER_CIRCLE content (Don Regan's book):
    - requires_citation = True
    - voice_compatible = False  # Reagan cannot speak as "I"
    - identity_wall = 'STRICT'
    """
```

Call this BEFORE ingesting any content to prevent "Soul Pollution."

### D.4 Baby Step 4: Manual Fact Injection Test

Run `inject_ticky_1982_fact.js` to inject test facts:

```bash
cd functions/scripts
node inject_ticky_1982_fact.js
```

Then chat with Reagan and ask:
> "Ronnie, was the economy really that bad?"

Expected response should include:
> "...you saw it firsthand when you landed in Austin in '82..."

If not, the Brain 1B prompt injection is broken.

### D.5 Pre-Ingestion Checklist

| Step | Command | Expected Result |
|------|---------|-----------------|
| 1. Seed Graph | `python genesis_graph.py` | "Universe seeded. Ready for Diaries." |
| 2. Test Facts | `node inject_ticky_1982_fact.js` | Facts appear in Firestore |
| 3. Chat Test | Ask about 1982 economy | Reagan references Austin |
| 4. Ingest Diaries | `curl -F "file=@Reagan_Diaries.epub" ...` | All 3 databases populated |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-13 | Ticky Uthenpong | Initial documentation |
| 1.1 | 2026-01-13 | Ticky Uthenpong | Added Gemini Baby Steps (Appendix D) |

---

*"Trust, but verify."* - Ronald Reagan

*This document describes the technical architecture for creating a Digital Soul that honors Reagan's legacy while providing deeply personal experiences for users.*
