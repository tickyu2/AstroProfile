# GENESIS Luna API Documentation

**Version 1.0 - Week 12 Launch**

---

## Overview

GENESIS Luna is an AI companion with 14 integrated systems spanning emotional intelligence, therapeutic healing, and personality.

**Base URL:** `https://api.genesis-luna.com/v1`

---

## Authentication

All API requests require authentication via Bearer token.

```bash
Authorization: Bearer <your_api_token>
```

### Endpoints

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-02-15T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com"
  }
}
```

---

## Conversation API

### POST /conversation/message
Send a message to Luna and receive a response.

**Request:**
```json
{
  "message": "I had a really rough day today",
  "context": {
    "session_id": "ses_xyz789",
    "include_voice_analysis": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "Oh, I hear you. Those days can really wear you down. Want to tell me what happened?",
    "emotion_detected": {
      "primary": "sadness",
      "intensity": 6,
      "compounds": ["disappointment", "frustration"]
    },
    "mode_used": "GENTLE",
    "emotional_state": {
      "concern": 2,
      "affection": 6,
      "trust": 5,
      "curiosity": 4
    }
  },
  "metadata": {
    "response_time_ms": 847,
    "session_id": "ses_xyz789",
    "message_id": "msg_def456"
  }
}
```

### GET /conversation/history
Retrieve conversation history.

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50, max: 200)
- `offset` (optional): Pagination offset
- `session_id` (optional): Filter by session

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_def456",
      "role": "user",
      "content": "I had a really rough day today",
      "timestamp": "2026-02-15T14:30:00Z",
      "emotion": {
        "primary": "sadness",
        "intensity": 6
      }
    },
    {
      "id": "msg_ghi789",
      "role": "luna",
      "content": "Oh, I hear you...",
      "timestamp": "2026-02-15T14:30:01Z",
      "mode": "GENTLE"
    }
  ],
  "pagination": {
    "total": 127,
    "limit": 50,
    "offset": 0
  }
}
```

---

## Emotional State API

### GET /user/emotional-state
Get current emotional state for user.

**Response:**
```json
{
  "success": true,
  "state": {
    "affection": 7.2,
    "concern": 1.5,
    "trust": 8.1,
    "curiosity": 4.3
  },
  "levels": {
    "affection": "high",
    "concern": "low",
    "trust": "very high",
    "curiosity": "moderate"
  },
  "last_interaction": "2026-02-15T10:00:00Z",
  "days_since_interaction": 0
}
```

### GET /user/bathtub-state
Get current therapeutic state (Bathtub model).

**Response:**
```json
{
  "success": true,
  "bathtub": {
    "salt": 25,
    "water": 75,
    "concentration": 33.3,
    "state": "SAD_BUT_COPING"
  },
  "state_progression": [
    "DEPRESSED",
    "VERY_SAD",
    "SAD_BUT_COPING",
    "OKAY",
    "HAPPY",
    "THRIVING"
  ],
  "current_index": 2
}
```

---

## Memory API

### GET /user/happiness-anchors
Retrieve user's happiness anchors.

**Query Parameters:**
- `limit` (optional): Number of anchors (default: 20)
- `search` (optional): Hybrid search query

**Response:**
```json
{
  "success": true,
  "anchors": [
    {
      "id": "anc_001",
      "event": "Got promoted at work",
      "user_quote": "I finally did it!",
      "emotion": "joy",
      "intensity": 9,
      "timestamp": "2026-02-10T16:00:00Z",
      "tags": ["career", "achievement"]
    }
  ],
  "total": 15
}
```

### POST /memory/search
Hybrid search across all memory types.

**Request:**
```json
{
  "query": "beach vacation last summer",
  "types": ["anchors", "ltm", "jokes"],
  "limit": 10
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "anchors": [
      {
        "id": "anc_005",
        "event": "Beach vacation with family",
        "hybrid_score": 0.87,
        "score_breakdown": {
          "vector": 0.45,
          "keyword": 0.30,
          "fuzzy": 0.0,
          "recency": 0.12
        }
      }
    ],
    "ltm": [],
    "jokes": []
  },
  "total_results": 1
}
```

---

## Profile API

### GET /user/constitutional-profile
Get user's constitutional profile (Five Elements, MBTI, etc.).

**Response:**
```json
{
  "success": true,
  "profile": {
    "five_elements": {
      "dominant": "Wood",
      "supporting": "Fire",
      "challenging": "Metal"
    },
    "mbti": "ENFP",
    "bazi": {
      "day_master": "Yang Wood",
      "chart": "..."
    }
  }
}
```

### PUT /user/preferences
Update user preferences.

**Request:**
```json
{
  "notifications_enabled": true,
  "voice_enabled": false,
  "assertiveness_preference": "SUPPORTIVE",
  "banter_enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "notifications_enabled": true,
    "voice_enabled": false,
    "assertiveness_preference": "SUPPORTIVE",
    "banter_enabled": true
  }
}
```

---

## Milestones API

### GET /user/milestones
Get user's achieved milestones.

**Response:**
```json
{
  "success": true,
  "milestones": [
    {
      "type": "FIRST_WEEK",
      "achieved_at": "2026-02-08T10:00:00Z",
      "celebration": "One week together! Our conversations have been meaningful."
    },
    {
      "type": "FIRST_INSIDE_JOKE",
      "achieved_at": "2026-02-12T15:30:00Z",
      "content": "Victory dance moment"
    }
  ],
  "streak": {
    "current": 7,
    "longest": 7
  }
}
```

---

## Inside Jokes API

### GET /user/inside-jokes
Get confirmed inside jokes.

**Response:**
```json
{
  "success": true,
  "jokes": [
    {
      "id": "joke_001",
      "content": "victory dance",
      "category": "PHRASE",
      "times_used": 5,
      "last_used": "2026-02-14T20:00:00Z",
      "origin": "User's celebration phrase"
    }
  ]
}
```

---

## Analytics API

### GET /analytics/effectiveness
Get intervention effectiveness analytics.

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

**Response:**
```json
{
  "success": true,
  "effectiveness": {
    "overall_score": 0.76,
    "by_mode": {
      "GENTLE": 0.82,
      "SUPPORTIVE": 0.78,
      "PLAYFUL": 0.71,
      "DIRECT": 0.68,
      "FIRM": 0.90
    },
    "by_emotion": {
      "sadness": 0.79,
      "joy": 0.85,
      "fear": 0.72,
      "anger": 0.65
    },
    "trend": "improving"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTHENTICATION_FAILED | 401 | Invalid or expired token |
| UNAUTHORIZED | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 10/min |
| Conversation | 60/min |
| Search | 30/min |
| Analytics | 10/min |

---

## Webhooks

### Webhook Events

- `conversation.message` - New message sent/received
- `milestone.achieved` - User achieved a milestone
- `emotion.crisis` - Crisis-level emotion detected
- `streak.broken` - User streak broken

### Webhook Payload

```json
{
  "event": "milestone.achieved",
  "timestamp": "2026-02-15T10:00:00Z",
  "data": {
    "user_id": "usr_abc123",
    "milestone_type": "FIRST_MONTH",
    "celebration": "One month together!"
  }
}
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
const GenesisLuna = require('@genesis/luna-sdk');

const luna = new GenesisLuna({
  apiKey: process.env.LUNA_API_KEY
});

// Send message
const response = await luna.conversation.send({
  message: "How are you today?"
});

console.log(response.message);
// "I'm doing well! How about you?"
```

### Python

```python
from genesis_luna import Luna

luna = Luna(api_key=os.environ['LUNA_API_KEY'])

# Send message
response = luna.conversation.send(
    message="How are you today?"
)

print(response.message)
# "I'm doing well! How about you?"
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GENESIS Luna API                        │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│ Auth     │ Convo    │ Memory   │ Profile  │ Analytics      │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│                    14 Core Systems                          │
├──────────┬──────────┬──────────┬──────────────────────────┤
│ Week 5-8 │ Week 9-10│ Week 11  │                           │
│ Healing  │ Person-  │ Enhance- │ PostgreSQL + pgvector    │
│ Learning │ ality    │ ment     │                           │
└──────────┴──────────┴──────────┴──────────────────────────┘
```

---

---

## BaZi & Relationship API

### POST /bazi/chart
Calculate a BaZi (Four Pillars) natal chart.

**Request:**
```json
{
  "birth_date": "1911-02-06",
  "birth_time": "04:00",
  "timezone": "America/Los_Angeles"
}
```

**Response:**
```json
{
  "success": true,
  "chart": {
    "year_pillar": { "stem": "辛", "branch": "亥", "element": "Metal" },
    "month_pillar": { "stem": "庚", "branch": "寅", "element": "Metal" },
    "day_pillar": { "stem": "甲", "branch": "子", "element": "Wood" },
    "hour_pillar": { "stem": "丙", "branch": "寅", "element": "Fire" },
    "day_master": {
      "element": "Wood",
      "chinese_name": "甲木",
      "strength_score": 65,
      "strength_category": "balanced"
    }
  }
}
```

### POST /bazi/synastry
Calculate synastry (compatibility) between two charts.

**Request:**
```json
{
  "chart_a": {
    "birth_date": "1911-02-06",
    "name": "Ronald Reagan"
  },
  "chart_b": {
    "birth_date": "1921-07-06",
    "name": "Nancy Reagan"
  }
}
```

**Response:**
```json
{
  "success": true,
  "synastry": {
    "overall_score": 78,
    "grid": [
      [{ "score": 15, "harmony": ["Six Harmony"] }, ...],
      ...
    ],
    "strongest_harmony": {
      "a_pillar": "Day",
      "b_pillar": "Day",
      "score": 25,
      "summary": "Strong emotional resonance"
    },
    "romance_hotspots": 3
  }
}
```

### POST /bazi/composite
Calculate composite (relationship entity) chart.

**Request:**
```json
{
  "chart_a_birth_date": "1911-02-06",
  "chart_b_birth_date": "1921-07-06",
  "relationship_start_date": "1952-03-04"
}
```

**Response:**
```json
{
  "success": true,
  "composite": {
    "day_master": {
      "element": "Earth",
      "strength_score": 58,
      "strength_category": "balanced"
    },
    "useful_god": {
      "element": "Metal",
      "reason": "Balances Earth Day Master strength",
      "supporting_elements": ["Water"],
      "avoid_elements": ["Fire"]
    },
    "element_distribution": {
      "Wood": 15,
      "Fire": 20,
      "Earth": 30,
      "Metal": 20,
      "Water": 15,
      "dominant": "Earth"
    },
    "shen_sha": [
      {
        "name": "Heavenly Virtue",
        "chinese_name": "天德",
        "nature": "auspicious",
        "relationship_meaning": "Protected union"
      }
    ]
  }
}
```

### POST /bazi/forecast-report
Generate complete 10-chapter forecast report.

**Request:**
```json
{
  "partner_a": {
    "name": "Ronald Reagan",
    "birth_date": "1911-02-06"
  },
  "partner_b": {
    "name": "Nancy Reagan",
    "birth_date": "1921-07-06"
  },
  "include_chapters": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "format": "markdown"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "title": "Composite Relationship Forecast",
    "title_chinese": "合盘预测报告",
    "subtitle": "Ronald Reagan & Nancy Reagan",
    "generated_at": "2026-01-15T10:00:00Z",
    "chapters": [
      {
        "number": 1,
        "title": "Relationship Essence",
        "title_chinese": "关系本质",
        "content": "### Composite Day Master: Earth (土)...",
        "highlights": ["Earth Day Master", "Metal Useful God"]
      }
    ],
    "summary": "## Executive Summary...",
    "full_narrative": "# 合盘预测报告..."
  }
}
```

### POST /bazi/enhance-narrative
Enhance report narrative using AI.

**Request:**
```json
{
  "report_id": "rpt_abc123",
  "options": {
    "tone": "poetic",
    "depth": "intermediate",
    "include_metaphors": true,
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "enhanced_report": {
    "chapters": [
      {
        "chapter_number": 1,
        "enhanced_content": "Two souls, woven from the fabric of Earth...",
        "tone": "poetic",
        "depth": "intermediate",
        "word_count": 850
      }
    ],
    "enhanced_summary": "In the celestial dance...",
    "enhancement_stats": {
      "total_original_words": 5000,
      "total_enhanced_words": 12000,
      "expansion_ratio": 2.4
    }
  }
}
```

### GET /bazi/event-triggers
Get event trigger windows for a relationship.

**Query Parameters:**
- `composite_id` (required): Composite chart ID
- `year_start` (optional): Start year (default: current)
- `year_end` (optional): End year (default: +5 years)

**Response:**
```json
{
  "success": true,
  "event_triggers": {
    "strong_windows": [
      {
        "year": 2026,
        "type": "relationship",
        "type_chinese": "关系突破",
        "probability": 85,
        "description": "Major commitment window"
      }
    ],
    "likely_windows": [...],
    "mild_windows": [...]
  }
}
```

### GET /cathedral/index
Get cathedral index for a subject.

**Query Parameters:**
- `subject_id` (required): Subject identifier
- `type` (optional): 'individual' | 'couple' | 'family'

**Response:**
```json
{
  "success": true,
  "index": {
    "subject": {
      "id": "reagan-couple",
      "type": "couple",
      "label": "Ronald Reagan & Nancy Reagan"
    },
    "wings": [
      {
        "id": "coreIdentity",
        "label": "Core Identity Wing",
        "label_chinese": "核心身份翼",
        "sections": [...]
      }
    ],
    "metadata": {
      "version": "1.0.0",
      "total_modules": 45,
      "completed_modules": 42
    }
  }
}
```

### GET /cathedral/schema-map
Get complete system architecture.

**Response:**
```json
{
  "success": true,
  "schema_map": {
    "version": "1.0.0",
    "statistics": {
      "total_modules": 24,
      "by_category": {
        "engine": 17,
        "report": 3,
        "renderer": 1
      },
      "by_status": {
        "complete": 24
      }
    },
    "modules": [...],
    "types": [...],
    "data_flow": [...],
    "timing_flow": [...],
    "narrative_flow": [...]
  }
}
```

---

## BaZi Types Reference

### Element Names
```
Wood (木) | Fire (火) | Earth (土) | Metal (金) | Water (水)
```

### Ten Gods
```
Friend (比肩) | Rob Wealth (劫财)
Eating God (食神) | Hurting Officer (伤官)
Direct Wealth (正财) | Indirect Wealth (偏财)
Direct Officer (正官) | Seven Killings (七杀)
Direct Resource (正印) | Indirect Resource (偏印)
```

### Module Status
```
complete | implemented | partial | planned | future
```

### Narrative Tones
```
gentle | neutral | technical | poetic
```

### Narrative Depths
```
beginner | intermediate | expert
```

---

**Version:** 1.1
**Last Updated:** January 2026
**Status:** Production Ready
