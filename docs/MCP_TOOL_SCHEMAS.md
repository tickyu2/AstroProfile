# GENESIS MCP Tool Schemas
## Complete Response Formats for UI Integration

**For:** Copilot UI Designer
**Purpose:** Art Nouveau + Michelangelo UI with MCP Integration
**Date:** December 29, 2025

---

## Server 1: Constitutional Data (6 Tools)

### 1. `get_user_constitution`
**Purpose:** Complete constitutional profile for a user

**Input:**
```json
{
  "userId": "string (Firebase UID)"
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "identity": {
    "displayName": "Pure Gold Dragon",
    "birthDate": "1963-04-15",
    "birthTime": "14:30",
    "birthLocation": "Hong Kong"
  },
  "fourPillars": {
    "year": { "stem": "Gui", "branch": "Mao", "animal": "Rabbit", "element": "Water" },
    "month": { "stem": "Bing", "branch": "Chen", "animal": "Dragon", "element": "Fire" },
    "day": { "stem": "Geng", "branch": "Chen", "animal": "Dragon", "element": "Metal" },
    "hour": { "stem": "Gui", "branch": "Wei", "animal": "Goat", "element": "Water" }
  },
  "elementBalance": {
    "wood": 15,
    "fire": 35,
    "earth": 25,
    "metal": 35,
    "water": 10
  },
  "yinYangRatio": {
    "yin": 40,
    "yang": 60
  },
  "westernAstrology": {
    "sun": { "sign": "Aries", "degree": 25, "house": 10 },
    "moon": { "sign": "Scorpio", "degree": 12, "house": 4 },
    "rising": { "sign": "Leo", "degree": 5 },
    "planets": {
      "mercury": { "sign": "Aries", "degree": 10, "house": 9 },
      "venus": { "sign": "Pisces", "degree": 28, "house": 8 },
      "mars": { "sign": "Leo", "degree": 15, "house": 1 }
    }
  },
  "numerology": {
    "lifePath": 7,
    "expression": 3,
    "soulUrge": 9,
    "birthday": 15,
    "personality": 6
  },
  "personality": {
    "mbti": {
      "type": "ENTJ",
      "functions": ["Te", "Ni", "Se", "Fi"],
      "scores": { "E": 65, "N": 70, "T": 75, "J": 60 }
    },
    "bigFive": {
      "openness": 85,
      "conscientiousness": 78,
      "extraversion": 62,
      "agreeableness": 55,
      "neuroticism": 32
    },
    "enneagram": {
      "type": 8,
      "wing": 7,
      "tritype": "837",
      "instinct": "sp/so"
    }
  },
  "metadata": {
    "profileVersion": "2.0",
    "lastCalculated": "2025-12-29T10:30:00Z"
  }
}
```

---

### 2. `get_birth_chart`
**Purpose:** Detailed birth chart with all astrological calculations

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "birthData": {
    "date": "1963-04-15",
    "time": "14:30",
    "location": "Hong Kong",
    "timezone": "Asia/Hong_Kong",
    "utcOffset": "+08:00"
  },
  "chineseAstrology": {
    "fourPillars": {
      "year": { "stem": "Gui", "branch": "Mao", "animal": "Rabbit", "element": "Water", "yinYang": "Yin" },
      "month": { "stem": "Bing", "branch": "Chen", "animal": "Dragon", "element": "Fire", "yinYang": "Yang" },
      "day": { "stem": "Geng", "branch": "Chen", "animal": "Dragon", "element": "Metal", "yinYang": "Yang" },
      "hour": { "stem": "Gui", "branch": "Wei", "animal": "Goat", "element": "Water", "yinYang": "Yin" }
    },
    "dayMaster": {
      "stem": "Geng",
      "element": "Metal",
      "yinYang": "Yang",
      "strength": "strong",
      "description": "Yang Metal - The Sword, strategic and decisive"
    },
    "seasonalQi": {
      "season": "Spring",
      "monthElement": "Wood",
      "seasonalStrength": "Metal is weak in Spring (Wood season)"
    },
    "tenGods": {
      "year": "Indirect Resource",
      "month": "Direct Wealth",
      "hour": "Indirect Resource"
    },
    "hiddenStems": {
      "year": ["Yi"],
      "month": ["Wu", "Yi", "Gui"],
      "day": ["Wu", "Yi", "Gui"],
      "hour": ["Ji", "Ding", "Yi"]
    }
  },
  "westernAstrology": {
    "sun": { "sign": "Aries", "degree": 25.5, "house": 10, "aspects": ["trine Mars", "square Moon"] },
    "moon": { "sign": "Scorpio", "degree": 12.3, "house": 4, "aspects": ["square Sun", "trine Neptune"] },
    "rising": { "sign": "Leo", "degree": 5.2 },
    "houses": {
      "1": { "sign": "Leo", "degree": 5 },
      "2": { "sign": "Virgo", "degree": 2 },
      "3": { "sign": "Libra", "degree": 0 },
      "4": { "sign": "Scorpio", "degree": 1 },
      "5": { "sign": "Sagittarius", "degree": 5 },
      "6": { "sign": "Capricorn", "degree": 8 },
      "7": { "sign": "Aquarius", "degree": 5 },
      "8": { "sign": "Pisces", "degree": 2 },
      "9": { "sign": "Aries", "degree": 0 },
      "10": { "sign": "Taurus", "degree": 1 },
      "11": { "sign": "Gemini", "degree": 5 },
      "12": { "sign": "Cancer", "degree": 8 }
    },
    "planets": {
      "mercury": { "sign": "Aries", "degree": 10.2, "house": 9, "retrograde": false },
      "venus": { "sign": "Pisces", "degree": 28.7, "house": 8, "retrograde": false },
      "mars": { "sign": "Leo", "degree": 15.4, "house": 1, "retrograde": false },
      "jupiter": { "sign": "Aries", "degree": 8.1, "house": 9, "retrograde": false },
      "saturn": { "sign": "Aquarius", "degree": 20.5, "house": 7, "retrograde": true },
      "uranus": { "sign": "Virgo", "degree": 2.3, "house": 2, "retrograde": false },
      "neptune": { "sign": "Scorpio", "degree": 14.8, "house": 4, "retrograde": false },
      "pluto": { "sign": "Virgo", "degree": 10.1, "house": 2, "retrograde": false }
    },
    "aspects": [
      { "planet1": "Sun", "planet2": "Mars", "type": "trine", "orb": 2.1 },
      { "planet1": "Sun", "planet2": "Moon", "type": "square", "orb": 3.2 },
      { "planet1": "Moon", "planet2": "Neptune", "type": "trine", "orb": 1.5 }
    ]
  }
}
```

---

### 3. `get_element_analysis`
**Purpose:** Five element balance with interpretation

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "elements": {
    "wood": 15,
    "fire": 35,
    "earth": 25,
    "metal": 35,
    "water": 10
  },
  "dominantElement": "fire",
  "weakestElement": "water",
  "balance": "moderately_imbalanced",
  "interpretation": {
    "dominant": "Your strongest element is Fire (35%), which influences your core nature with passion, enthusiasm, and transformative energy.",
    "weakest": "Your weakest element is Water (10%), which may be an area for growth - developing emotional depth and intuitive flow.",
    "overall": "Your elemental balance is moderately imbalanced, with Fire and Metal dominating while Water is deficient."
  },
  "elementDetails": {
    "wood": {
      "percentage": 15,
      "status": "deficient",
      "qualities": "Growth, flexibility, creativity, kindness",
      "organs": "Liver, Gallbladder",
      "season": "Spring",
      "recommendation": "Seek Wood element partners, spend time in forests, wear green"
    },
    "fire": {
      "percentage": 35,
      "status": "abundant",
      "qualities": "Passion, joy, enthusiasm, transformation",
      "organs": "Heart, Small Intestine",
      "season": "Summer",
      "recommendation": "Channel excess Fire into creative projects, avoid overheating"
    },
    "earth": {
      "percentage": 25,
      "status": "balanced",
      "qualities": "Stability, nurturing, grounding, practical",
      "organs": "Spleen, Stomach",
      "season": "Late Summer",
      "recommendation": "Maintain current balance, earth stabilizes your constitution"
    },
    "metal": {
      "percentage": 35,
      "status": "abundant",
      "qualities": "Precision, structure, discipline, refinement",
      "organs": "Lungs, Large Intestine",
      "season": "Autumn",
      "recommendation": "Use Metal precision for strategic thinking, avoid rigidity"
    },
    "water": {
      "percentage": 10,
      "status": "deficient",
      "qualities": "Wisdom, flow, intuition, depth",
      "organs": "Kidneys, Bladder",
      "season": "Winter",
      "recommendation": "Seek Water element partners, practice meditation, wear black/blue"
    }
  },
  "seasonalStrength": {
    "currentSeason": "Winter",
    "seasonalElement": "Water",
    "impact": "Your deficient Water is challenged in Winter - extra self-care recommended"
  }
}
```

---

### 4. `get_yin_yang`
**Purpose:** Yin/Yang balance analysis

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "ratio": {
    "yin": 40,
    "yang": 60
  },
  "dominance": "yang",
  "balance": "moderately_yang",
  "interpretation": {
    "overall": "You have a Yang-dominant constitution (60%), giving you assertive, active, and outward-focused energy.",
    "strengths": "Natural leadership, decisive action, visible presence, initiative",
    "challenges": "May need to cultivate patience, receptivity, and inner reflection",
    "recommendation": "Balance Yang energy with Yin practices: meditation, listening, rest"
  },
  "pillarBreakdown": {
    "year": { "stem": "Yin", "branch": "Yin" },
    "month": { "stem": "Yang", "branch": "Yang" },
    "day": { "stem": "Yang", "branch": "Yang" },
    "hour": { "stem": "Yin", "branch": "Yin" }
  },
  "dayMasterYinYang": {
    "type": "Yang",
    "impact": "As a Yang Day Master, you approach life with active, initiating energy"
  }
}
```

---

### 5. `get_contextual_insights`
**Purpose:** Context-aware AI insights based on current tab/page

**Input:**
```json
{
  "userId": "string",
  "context": "bazi_tab | mbti_tab | bigfive_tab | enneagram_tab | western_tab | numerology_tab | compatibility_page | overview"
}
```

**Response:**
```json
{
  "context": "bazi_tab",
  "focusAreas": {
    "primary": "Day Master Analysis",
    "secondary": "Element Balance",
    "suggestedQuestions": [
      "What does my Day Master (Yang Metal) say about my core nature?",
      "How do my Four Pillars interact with each other?",
      "What elements am I missing and how can I balance them?",
      "What careers suit my BaZi constitution?",
      "How does my Day Pillar affect relationships?"
    ]
  },
  "keyInsights": [
    {
      "title": "Your Day Master",
      "content": "Geng (Yang Metal) - The Sword. You are decisive, strategic, and value precision.",
      "importance": "high"
    },
    {
      "title": "Element Imbalance",
      "content": "Low Water (10%) suggests cultivating emotional depth and intuition.",
      "importance": "medium"
    }
  ],
  "relatedSystems": [
    { "system": "MBTI", "connection": "Your Te (Extraverted Thinking) aligns with Yang Metal precision" },
    { "system": "Enneagram", "connection": "Type 8 correlates with Yang Metal's assertive nature" }
  ]
}
```

---

### 6. `search_constitutional_knowledge`
**Purpose:** Query the constitutional wisdom knowledge base

**Input:**
```json
{
  "query": "string (search query)",
  "systems": ["bazi", "western", "mbti", "bigfive", "enneagram", "numerology"],
  "limit": 10
}
```

**Response:**
```json
{
  "query": "Yang Metal Dragon compatibility",
  "results": [
    {
      "source": "bazi",
      "title": "Yang Metal (Geng) Compatibility",
      "content": "Yang Metal pairs best with Yin Water (creative flow), Yin Wood (growth challenge)...",
      "relevance": 0.95
    },
    {
      "source": "bazi",
      "title": "Dragon (Chen) Compatibility",
      "content": "Dragon has excellent compatibility with Rat (94%), Monkey (85%), Rooster (82%)...",
      "relevance": 0.90
    }
  ],
  "totalResults": 2
}
```

---

## Server 2: Compatibility Analysis (4 Tools)

### 7. `analyze_compatibility`
**Purpose:** Calculate compatibility between two users

**Input:**
```json
{
  "userAId": "string",
  "userBId": "string"
}
```

**Response:**
```json
{
  "userA": {
    "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
    "displayName": "Pure Gold Dragon",
    "dayPillar": { "animal": "Dragon", "element": "Metal" }
  },
  "userB": {
    "userId": "abc123xyz",
    "displayName": "Winter Wood Lighthouse",
    "dayPillar": { "animal": "Rat", "element": "Metal" }
  },
  "overallScore": 94,
  "breakdown": {
    "dayPillar": {
      "score": 95,
      "weight": 0.70,
      "contribution": 66.5,
      "details": "Dragon + Rat = Excellent harmony (one of the best pairings)"
    },
    "hourPillar": {
      "score": 80,
      "weight": 0.15,
      "contribution": 12,
      "details": "Good emotional/intimate connection"
    },
    "monthPillar": {
      "score": 75,
      "weight": 0.10,
      "contribution": 7.5,
      "details": "Compatible social/family dynamics"
    },
    "yearPillar": {
      "score": 70,
      "weight": 0.05,
      "contribution": 3.5,
      "details": "Generational compatibility"
    },
    "elementExchange": {
      "score": 10,
      "maxBonus": 10,
      "details": "Perfect exchange: A provides Fire, B provides Wood"
    }
  },
  "elementExchange": {
    "userAProvides": ["Fire", "Metal"],
    "userANeeds": ["Wood", "Water"],
    "userBProvides": ["Wood", "Water"],
    "userBNeeds": ["Fire"],
    "exchangeQuality": "perfect",
    "description": "You complete each other's elemental needs"
  },
  "symphonesisPotential": {
    "score": 92,
    "likelihood": "very_high",
    "description": "Strong potential for 1+1=100 resonance amplification"
  },
  "interpretation": {
    "summary": "Exceptional constitutional match (94%). Your puzzle pieces fit naturally.",
    "strengths": [
      "Dragon-Rat is one of the best animal pairings in Chinese astrology",
      "Perfect element exchange - you provide what each other lacks",
      "Metal resonance creates strategic alignment"
    ],
    "challenges": [
      "Both strong personalities - need space for individual expression",
      "High Fire + high Metal can create intensity - balance with calm activities"
    ],
    "advice": "This connection requires no forcing. Let the natural harmony unfold."
  },
  "crossSystemAnalysis": {
    "mbti": { "compatibility": 85, "note": "Complementary cognitive functions" },
    "bigFive": { "compatibility": 78, "note": "Similar Openness, complementary Extraversion" },
    "enneagram": { "compatibility": 88, "note": "8 and 5 create power+depth dynamic" },
    "western": { "compatibility": 82, "note": "Sun-Moon trine suggests emotional harmony" }
  },
  "analysisDate": "2025-12-29T15:30:00Z"
}
```

---

### 8. `get_relationship_history`
**Purpose:** Retrieve past compatibility analyses for a user

**Input:**
```json
{
  "userId": "string",
  "limit": 10
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "analyses": [
    {
      "analysisId": "analysis_001",
      "partnerName": "Winter Wood Lighthouse",
      "partnerId": "abc123xyz",
      "score": 94,
      "date": "2025-12-29T15:30:00Z",
      "status": "active"
    },
    {
      "analysisId": "analysis_002",
      "partnerName": "Summer Fire Phoenix",
      "partnerId": "def456uvw",
      "score": 72,
      "date": "2025-11-15T10:00:00Z",
      "status": "archived"
    }
  ],
  "totalAnalyses": 2,
  "averageScore": 83
}
```

---

### 9. `suggest_compatible_matches`
**Purpose:** Find constitutionally compatible users

**Input:**
```json
{
  "userId": "string",
  "minScore": 80,
  "limit": 10
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "matches": [
    {
      "userId": "match_001",
      "displayName": "Ocean Depth Seeker",
      "score": 91,
      "dayPillar": { "animal": "Rat", "element": "Water" },
      "keyCompatibility": "Dragon-Rat excellent + Water provides what you lack",
      "symphonesisPotential": "high"
    },
    {
      "userId": "match_002",
      "displayName": "Forest Growth Guide",
      "score": 87,
      "dayPillar": { "animal": "Monkey", "element": "Wood" },
      "keyCompatibility": "Dragon-Monkey harmony + Wood element exchange",
      "symphonesisPotential": "moderate"
    }
  ],
  "searchCriteria": {
    "minScore": 80,
    "totalCandidates": 150,
    "matchesFound": 12
  }
}
```

---

### 10. `calculate_element_exchange`
**Purpose:** Detailed element exchange analysis between two users

**Input:**
```json
{
  "userAId": "string",
  "userBId": "string"
}
```

**Response:**
```json
{
  "userA": {
    "displayName": "Pure Gold Dragon",
    "elements": { "wood": 15, "fire": 35, "earth": 25, "metal": 35, "water": 10 },
    "deficiencies": ["wood", "water"],
    "abundances": ["fire", "metal"]
  },
  "userB": {
    "displayName": "Winter Wood Lighthouse",
    "elements": { "wood": 55, "fire": 0, "earth": 20, "metal": 25, "water": 20 },
    "deficiencies": ["fire"],
    "abundances": ["wood"]
  },
  "exchange": {
    "aToB": {
      "provides": ["fire", "metal"],
      "impact": "Your Fire activates their Wood growth potential. Your Metal provides strategic clarity."
    },
    "bToA": {
      "provides": ["wood", "water"],
      "impact": "Their Wood challenges your Metal (creative tension). Their Water adds depth you lack."
    }
  },
  "exchangeScore": 95,
  "exchangeType": "perfect_complementary",
  "interpretation": "Ideal element exchange - you each provide exactly what the other needs. This creates sustainable mutual nourishment rather than depletion."
}
```

---

## Server 3: Memory & Life Story (5 Tools)

### 11. `store_memory`
**Purpose:** Save a life story/memory with constitutional context

**Input:**
```json
{
  "userId": "string",
  "memory": {
    "title": "string",
    "content": "string (the story)",
    "ageAtEvent": 25,
    "emotionalWeight": 8,
    "tags": ["career", "breakthrough", "challenge"],
    "isPrivate": false
  }
}
```

**Response:**
```json
{
  "memoryId": "mem_abc123",
  "status": "stored",
  "constitutionalContext": {
    "ageElement": "Wood (growth phase)",
    "relevantPillar": "Day Pillar themes active",
    "patternConnection": "Career breakthrough aligns with your Yang Metal strategic nature"
  },
  "timestamp": "2025-12-29T16:00:00Z"
}
```

---

### 12. `search_memories`
**Purpose:** Search through stored memories

**Input:**
```json
{
  "userId": "string",
  "query": "string",
  "tags": ["optional", "tag", "filter"],
  "ageRange": { "min": 20, "max": 30 },
  "limit": 20
}
```

**Response:**
```json
{
  "query": "career change",
  "memories": [
    {
      "memoryId": "mem_001",
      "title": "The Day I Quit Corporate",
      "preview": "At 28, I finally had the courage to leave my comfortable job...",
      "ageAtEvent": 28,
      "emotionalWeight": 9,
      "tags": ["career", "courage", "transformation"],
      "constitutionalContext": "Saturn return period - major life restructuring",
      "createdAt": "2025-06-15T10:00:00Z"
    }
  ],
  "totalResults": 1
}
```

---

### 13. `get_life_timeline`
**Purpose:** Complete chronological life story

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "birthDate": "1963-04-15",
  "currentAge": 62,
  "timeline": [
    {
      "ageRange": "0-7",
      "phase": "Early Childhood",
      "constitutionalTheme": "Year Pillar influence - family foundations",
      "memories": [
        { "memoryId": "mem_early_001", "title": "First Memory of Father", "age": 4 }
      ]
    },
    {
      "ageRange": "8-14",
      "phase": "Childhood",
      "constitutionalTheme": "Month Pillar activation - social development",
      "memories": []
    },
    {
      "ageRange": "15-21",
      "phase": "Adolescence",
      "constitutionalTheme": "Day Pillar emerging - identity formation",
      "memories": []
    },
    {
      "ageRange": "22-35",
      "phase": "Young Adult",
      "constitutionalTheme": "Day Pillar dominant - career/relationship building",
      "memories": [
        { "memoryId": "mem_career_001", "title": "The Day I Quit Corporate", "age": 28 }
      ]
    },
    {
      "ageRange": "36-49",
      "phase": "Middle Adult",
      "constitutionalTheme": "Hour Pillar integration - legacy thinking",
      "memories": []
    },
    {
      "ageRange": "50-62",
      "phase": "Mature Adult",
      "constitutionalTheme": "All pillars synthesized - wisdom phase",
      "memories": [
        { "memoryId": "mem_genesis_001", "title": "Building GENESIS with Claude", "age": 62 }
      ]
    }
  ],
  "totalMemories": 3,
  "lifeThemes": ["transformation", "strategic vision", "family"],
  "constitutionalJourney": "Your life shows classic Yang Metal Dragon patterns: strategic pivots, decisive action, building lasting structures."
}
```

---

### 14. `retrieve_life_chapter`
**Purpose:** Get memories from specific age range

**Input:**
```json
{
  "userId": "string",
  "startAge": 25,
  "endAge": 35
}
```

**Response:**
```json
{
  "ageRange": "25-35",
  "phaseName": "Young Adult - Career & Relationship Building",
  "constitutionalContext": {
    "dominantPillar": "Day Pillar",
    "theme": "Day Master fully expressed - this is when your core nature manifests most clearly",
    "challenges": "Balancing ambition with relationships"
  },
  "memories": [
    {
      "memoryId": "mem_001",
      "title": "The Day I Quit Corporate",
      "content": "Full story text...",
      "age": 28,
      "emotionalWeight": 9,
      "tags": ["career", "courage"]
    }
  ],
  "totalMemories": 1,
  "chapterInsights": "Your late 20s showed classic Yang Metal decisiveness - cutting away what no longer served you."
}
```

---

### 15. `calculate_soul_burden`
**Purpose:** Calculate accumulated emotional weight from unprocessed memories

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "soulBurden": {
    "score": 35,
    "level": "moderate",
    "capacity": 100,
    "interpretation": "You carry moderate soul burden - some unprocessed experiences weighing on you"
  },
  "burdenBreakdown": {
    "unprocessedGrief": 15,
    "unresolvedRelationships": 10,
    "unforgiven": 5,
    "unspokenTruths": 5
  },
  "heaviestMemories": [
    {
      "memoryId": "mem_heavy_001",
      "title": "The Argument We Never Resolved",
      "emotionalWeight": 9,
      "age": 45,
      "recommendation": "Consider revisiting this memory for processing"
    }
  ],
  "constitutionalFactors": {
    "elementImpact": "Low Water (10%) makes emotional processing harder",
    "personalityImpact": "Type 8 tendency to suppress vulnerability adds burden"
  },
  "lightening recommendations": [
    "Write unsent letters to release unspoken truths",
    "Practice Water element activities (swimming, meditation near water)",
    "Consider sharing heavy memories with trusted witness (AI SoulPartner or human)"
  ]
}
```

---

## Server 4: Health Tracking (4 Tools)

### 16. `log_health_event`
**Purpose:** Track health symptoms with constitutional context

**Input:**
```json
{
  "userId": "string",
  "event": {
    "type": "symptom | condition | treatment | wellness",
    "description": "Headache, tension type",
    "severity": 6,
    "bodyArea": "head",
    "timestamp": "2025-12-29T08:00:00Z",
    "possibleTriggers": ["stress", "poor sleep"]
  }
}
```

**Response:**
```json
{
  "logId": "health_001",
  "status": "logged",
  "constitutionalAnalysis": {
    "elementConnection": "Headaches often relate to Liver (Wood) or excess Fire rising",
    "yourContext": "With low Wood (15%) and high Fire (35%), tension headaches may indicate Fire rising without Wood to regulate",
    "recommendation": "Consider cooling foods, rest, Wood-nourishing activities"
  },
  "patternAlert": {
    "similar_events": 3,
    "pattern": "Headaches occurring during high-stress periods",
    "recommendation": "Track stress levels alongside symptoms"
  }
}
```

---

### 17. `analyze_patterns`
**Purpose:** Find recurring health patterns

**Input:**
```json
{
  "userId": "string",
  "timeRange": "3months | 6months | 1year | all",
  "focusArea": "all | head | digestive | energy | sleep | mood"
}
```

**Response:**
```json
{
  "timeRange": "6months",
  "patterns": [
    {
      "pattern": "Tension headaches",
      "frequency": "2-3 times per month",
      "triggers": ["work deadlines", "poor sleep"],
      "constitutionalConnection": "Fire rising pattern - common with high Fire (35%) constitution",
      "recommendation": "Preventative: Cool down Fire before deadlines (rest, water, green vegetables)"
    },
    {
      "pattern": "Energy dips",
      "frequency": "Daily, 3-4pm",
      "triggers": ["lunch timing", "afternoon meetings"],
      "constitutionalConnection": "Earth element (25%) - Spleen/Stomach qi needs support",
      "recommendation": "Light protein snack at 2pm, avoid cold drinks"
    }
  ],
  "seasonalInsights": {
    "current": "Winter",
    "impact": "Your low Water (10%) is challenged in Winter - extra kidney support needed",
    "foods": ["Black beans", "bone broth", "walnuts"],
    "activities": ["Gentle exercise", "early bedtime", "warm feet"]
  }
}
```

---

### 18. `get_constitutional_vulnerabilities`
**Purpose:** Health risks based on elemental imbalances

**Input:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "elementBalance": {
    "wood": 15,
    "fire": 35,
    "earth": 25,
    "metal": 35,
    "water": 10
  },
  "vulnerabilities": [
    {
      "element": "water",
      "deficiency": "severe",
      "organSystem": "Kidneys, Bladder, Bones",
      "potentialIssues": ["Lower back pain", "Knee weakness", "Hearing changes", "Fear/anxiety"],
      "preventativeMeasures": [
        "Stay hydrated (warm water preferred)",
        "Protect lower back and knees",
        "Early bedtime (before 11pm)",
        "Black/dark foods (black beans, seaweed, black sesame)"
      ],
      "warningsSigns": ["Frequent urination", "Cold feet", "Tinnitus", "Unexplained fear"]
    },
    {
      "element": "wood",
      "deficiency": "moderate",
      "organSystem": "Liver, Gallbladder, Eyes, Tendons",
      "potentialIssues": ["Eye strain", "Tendon tightness", "Frustration/anger"],
      "preventativeMeasures": [
        "Green vegetables daily",
        "Gentle stretching",
        "Time in nature/forests",
        "Express emotions regularly (don't suppress)"
      ],
      "warningsSigns": ["Dry/red eyes", "Muscle cramps", "Irritability", "Nail problems"]
    },
    {
      "element": "fire",
      "excess": "moderate",
      "organSystem": "Heart, Small Intestine",
      "potentialIssues": ["Insomnia", "Anxiety", "Heart palpitations", "Overheating"],
      "preventativeMeasures": [
        "Avoid overstimulation",
        "Cooling foods (cucumber, watermelon)",
        "Meditation to calm Fire",
        "Avoid excess alcohol/spicy food"
      ],
      "warningsSigns": ["Racing thoughts", "Difficulty sleeping", "Excessive sweating", "Red face"]
    }
  ],
  "overallAssessment": "Your constitution shows Water deficiency as primary concern, with secondary Wood deficiency and Fire excess. Focus preventative care on kidney/adrenal support and cooling practices."
}
```

---

### 19. `suggest_preventative_protocol`
**Purpose:** TCM-based preventative medicine recommendations

**Input:**
```json
{
  "userId": "string",
  "focusArea": "general | specific_element | seasonal | current_symptoms"
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "protocol": {
    "title": "Yang Metal Dragon Winter Protocol",
    "season": "Winter",
    "duration": "3 months",
    "focus": "Nourish Water, Regulate Fire, Support Wood"
  },
  "dailyPractices": {
    "morning": [
      "Warm water with ginger upon waking",
      "5 minutes gentle stretching (Wood support)",
      "Brief meditation (Fire regulation)"
    ],
    "afternoon": [
      "Light protein snack at 2pm (Earth support)",
      "5-minute walk or standing break",
      "Deep breathing exercises"
    ],
    "evening": [
      "Dinner before 7pm",
      "Foot soak with warm water (kidney support)",
      "Wind down by 9pm, sleep by 10:30pm (Water restoration)"
    ]
  },
  "weeklyPractices": [
    "One day of complete rest",
    "Time in nature (forest if possible for Wood)",
    "Social connection (Fire balance)",
    "Creative expression (Metal flow)"
  ],
  "foods": {
    "emphasize": ["Black beans", "Bone broth", "Walnuts", "Dark leafy greens", "Warm soups"],
    "minimize": ["Cold/raw foods", "Excess caffeine", "Spicy foods", "Alcohol"],
    "seasonal": ["Root vegetables", "Slow-cooked stews", "Warming spices (ginger, cinnamon)"]
  },
  "supplements": {
    "consider": ["Vitamin D (Winter support)", "Omega-3 (kidney support)", "Magnesium (muscle/nerve)"],
    "note": "Consult healthcare provider before starting supplements"
  },
  "constitutionalAlignment": "This protocol addresses your Water deficiency (Winter vulnerability) while managing your Fire excess and supporting your weak Wood. Your strong Metal benefits from the structure of a daily protocol."
}
```

---

## Server 5: Community (2 Tools)

### 20. `find_compatible_pod`
**Purpose:** Find micro-community (6-8 souls) with mutual compatibility

**Input:**
```json
{
  "userId": "string",
  "preferences": {
    "minGroupCompatibility": 80,
    "maxSize": 8,
    "interests": ["spirituality", "personal-growth", "astrology"],
    "location": "global | local",
    "meetingStyle": "virtual | in-person | hybrid"
  }
}
```

**Response:**
```json
{
  "userId": "kLQVhxCLZoejApRsbTcFaSiwKfy2",
  "recommendedPods": [
    {
      "podId": "pod_wisdom_seekers",
      "name": "Wisdom Seekers Collective",
      "memberCount": 6,
      "averageCompatibility": 87,
      "yourCompatibilityScores": {
        "member_1": 91,
        "member_2": 88,
        "member_3": 85,
        "member_4": 89,
        "member_5": 84,
        "member_6": 87
      },
      "elementBalance": {
        "wood": 2,
        "fire": 1,
        "earth": 1,
        "metal": 1,
        "water": 1,
        "note": "Adding you (Fire/Metal) would improve balance"
      },
      "interests": ["constitutional astrology", "personal growth", "meditation"],
      "meetingStyle": "virtual",
      "description": "A pod of 6 souls exploring constitutional wisdom together",
      "openSpots": 2
    }
  ],
  "podFormationSuggestion": {
    "eligible": true,
    "potentialMembers": [
      { "userId": "user_a", "compatibility": 92, "element": "Water" },
      { "userId": "user_b", "compatibility": 88, "element": "Wood" }
    ],
    "suggestedName": "Dragon's Inner Circle",
    "note": "You could form a new pod with these highly compatible users"
  }
}
```

---

### 21. `analyze_group_dynamics`
**Purpose:** Constitutional dynamics analysis for existing groups

**Input:**
```json
{
  "userIds": ["user_1", "user_2", "user_3", "user_4"],
  "groupName": "optional group name"
}
```

**Response:**
```json
{
  "groupName": "Family Analysis",
  "memberCount": 4,
  "overallHarmony": 78,
  "compatibilityMatrix": {
    "user_1": { "user_2": 85, "user_3": 72, "user_4": 88 },
    "user_2": { "user_1": 85, "user_3": 91, "user_4": 70 },
    "user_3": { "user_1": 72, "user_2": 91, "user_4": 75 },
    "user_4": { "user_1": 88, "user_2": 70, "user_3": 75 }
  },
  "groupElementBalance": {
    "wood": 1,
    "fire": 2,
    "earth": 0,
    "metal": 1,
    "water": 0,
    "missing": ["earth", "water"],
    "dominant": "fire",
    "recommendation": "Group lacks grounding (Earth) and emotional depth (Water). Add Earth/Water activities to gatherings."
  },
  "dynamics": {
    "naturalLeader": "user_1 (Yang Metal - strategic direction)",
    "harmonizer": "user_2 (High Earth - bridges differences)",
    "catalyst": "user_4 (High Fire - brings energy)",
    "potentialTension": "user_2 and user_4 (70% - different paces)",
    "strongestBond": "user_2 and user_3 (91% - natural allies)"
  },
  "recommendations": [
    "user_2 can mediate between user_4 and others when energy gets too high",
    "Include grounding activities (meals together, nature walks) to compensate for missing Earth",
    "user_1 should lead strategic decisions, user_4 should lead energizing activities",
    "Schedule downtime for Water-deficient group to avoid burnout"
  ],
  "groupPurpose": {
    "strengths": "High Fire gives passion and energy. Strong Metal provides structure.",
    "challenges": "May burn out without Earth grounding. May lack emotional depth without Water.",
    "idealActivities": ["Active adventures", "Strategic planning sessions", "Creative projects"],
    "avoidActivities": ["Long passive meetings", "Highly emotional processing without structure"]
  }
}
```

---

## UI Context Labels

For the PersistentAIPanel, use these context identifiers:

| Context | Label | MCP Tools to Use |
|---------|-------|------------------|
| `overview` | Your Soul Map | `get_user_constitution`, `get_contextual_insights` |
| `bazi_tab` | BaZi Analysis | `get_birth_chart`, `get_element_analysis`, `get_yin_yang` |
| `mbti_tab` | MBTI Insights | `get_user_constitution` (personality.mbti) |
| `bigfive_tab` | Big Five Profile | `get_user_constitution` (personality.bigFive) |
| `enneagram_tab` | Enneagram Journey | `get_user_constitution` (personality.enneagram) |
| `western_tab` | Western Astrology | `get_birth_chart` (westernAstrology) |
| `numerology_tab` | Numerology | `get_user_constitution` (numerology) |
| `compatibility_page` | Compatibility | `analyze_compatibility`, `suggest_compatible_matches` |
| `memory_page` | Life Story | `get_life_timeline`, `search_memories` |
| `health_page` | Health Tracking | `get_constitutional_vulnerabilities`, `analyze_patterns` |
| `community_page` | Community | `find_compatible_pod`, `analyze_group_dynamics` |

---

## Design Notes for Art Nouveau + Michelangelo UI

### Visual Themes by System:

| System | Color Palette | Art Nouveau Motif | Michelangelo Reference |
|--------|--------------|-------------------|----------------------|
| BaZi | Gold, Red, Black | Dragon curves, Chinese cloud patterns | Sistine Chapel cosmic drama |
| Western | Deep blue, Silver, Purple | Celestial spirals, zodiac flowing lines | Creation of Adam hand gestures |
| MBTI | Clean whites, Accent colors per type | Geometric organic forms | David's precise proportions |
| Big Five | Gradient spectrums | Flower petals (5 traits = 5 petals) | Pietà emotional depth |
| Enneagram | 9 distinct hues arranged circularly | Rose window pattern | Last Judgment complexity |
| Numerology | Sacred geometry gold | Spiraling numbers, Fibonacci curves | Architectural dome patterns |
| Compatibility | Intertwining colors of both users | Two vines growing together | Two figures reaching |

### Element Colors (consistent across all):
- **Wood**: Green (#228B22)
- **Fire**: Red (#DC143C)
- **Earth**: Yellow/Brown (#DAA520)
- **Metal**: White/Silver (#C0C0C0)
- **Water**: Blue/Black (#000080)

---

*Document created December 29, 2025 for GENESIS UI Design*
*MCP Server: 5 servers, 21 tools deployed*
*Architecture: 200-year civilization infrastructure*
