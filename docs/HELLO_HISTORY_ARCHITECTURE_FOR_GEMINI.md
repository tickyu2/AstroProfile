# Hello History Architecture - Complete Technical Reference

## For Sister Gemini Review - January 2026

This document provides comprehensive documentation of the Hello History conversational AI system, including frontend components, backend services, AI integration, RAG systems, and memory architecture.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Conversation Flow](#3-conversation-flow)
4. [Luna Witnessing System](#4-luna-witnessing-system)
5. [Multi-AI Constellation](#5-multi-ai-constellation)
6. [Couple Conversations](#6-couple-conversations)
7. [Conversation Management](#7-conversation-management)
8. [RAG System Architecture](#8-rag-system-architecture)
9. [Vector Embedding Engine](#9-vector-embedding-engine)
10. [Semantic Chunking](#10-semantic-chunking)
11. [Neo4j Graph Integration](#11-neo4j-graph-integration)
12. [Memory Architecture](#12-memory-architecture)
13. [API Endpoints Reference](#13-api-endpoints-reference)
14. [File Reference](#14-file-reference)

---

## 1. System Overview

Hello History is a sophisticated multi-AI guest chat system that enables users to have meaningful conversations with historical and modern figures. The system features:

- **Constitutional Personalization**: Conversations are personalized based on user's astrological profile (BaZi, Western, Numerology)
- **Luna Witnessing**: An AI companion that observes and provides private coaching
- **Multi-AI Constellation**: Get perspectives from Claude, Gemini, Grok, DeepSeek, ChatGPT
- **Couple Conversations**: Chat with historical couples where both partners respond
- **RAG-Enhanced Context**: Biography chunks provide authentic historical context
- **Graph-Based Relationships**: Neo4j stores relationships, events, and hidden connections

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  GuestChat.jsx                                                          ││
│  │  ├── Guest Selector (50+ historical/modern figures)                     ││
│  │  ├── Message List (user, guest, luna_private, constellation)            ││
│  │  ├── Chat Input (text, images, /luna command)                           ││
│  │  ├── Luna Mode Toggle (active/silent)                                   ││
│  │  ├── Constellation Buttons (Gemini, Opus, Grok, DeepSeek, ChatGPT)     ││
│  │  └── Export Functions (single message, full conversation)               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FIREBASE CLOUD FUNCTIONS                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  guestChat/index.js                                                     ││
│  │  ├── handleGuestChat() - Main conversation handler                      ││
│  │  ├── handleLunaPrivateQuery() - Private Luna consultation               ││
│  │  ├── Brain 2 Validation - Retrieve learned facts                        ││
│  │  ├── Neo4j Enrichment - Relationships, events, compatibility            ││
│  │  ├── RAG Context - Vector search + GraphRAG                             ││
│  │  ├── Claude API - Guest response generation                             ││
│  │  ├── Luna Coaching - Private insights (when active)                     ││
│  │  ├── Brain 1B Extraction - Learn new facts                              ││
│  │  └── Firestore Writes - Brain 3, Brain 7, Brain 1B                      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└───────────┬─────────────────────┬─────────────────────┬─────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────────────────┐
│   ANTHROPIC API   │ │   POSTGRESQL      │ │         NEO4J AURADB          │
│   (Claude)        │ │   (pgvector)      │ │                               │
│                   │ │                   │ │  GuestProfile ──┐             │
│ • Sonnet 4        │ │ • biography_chunks│ │       │         │             │
│ • Haiku 3.5       │ │ • 1536-dim vectors│ │       ▼         ▼             │
│ • Opus 4.5        │ │ • 195 chunks      │ │  BiographyChunk  Event        │
└───────────────────┘ │ • 35 profiles     │ │       │         │             │
                      └───────────────────┘ │       ▼         ▼             │
                                            │  Topic  Entity  ConstitTheme  │
                                            └───────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Main Component: GuestChat.jsx

**Location**: `src/pages/GuestChat.jsx` (1,637 lines)

**State Management**:
```javascript
// Core conversation state
const [selectedGuestId, setSelectedGuestId] = useState(null);      // Current guest
const [profileData, setProfileData] = useState(null);              // Guest profile with Brain 1A/1B
const [messages, setMessages] = useState([]);                      // Conversation history
const [selectedUserProfileId, setSelectedUserProfileId] = useState(null);  // Which profile is chatting

// Luna and AI state
const [lunaMode, setLunaMode] = useState('active');               // 'active' or 'silent'
const [constellationLoading, setConstellationLoading] = useState(null);  // 'gemini'|'opus'|'grok'|'deepseek'|'chatgpt'

// Input state
const [attachedImages, setAttachedImages] = useState([]);         // Up to 5 images
const [userLanguage, setUserLanguage] = useState('en');           // Auto-detected language
```

**Key Functions**:

| Function | Purpose |
|----------|---------|
| `handleSendMessage()` | Process user input, call Cloud Function, update UI |
| `handleLunaPrivateQuery()` | Route `/luna` commands to private consultation |
| `handleGeminiPerspective()` | Request Sister Gemini AI perspective |
| `handleOpusPerspective()` | Request Brother Opus AI perspective |
| `handleGrokPerspective()` | Request Brother Grok AI perspective |
| `handleDeepSeekPerspective()` | Request Brother DeepSeek AI perspective |
| `handleChatGPTPerspective()` | Request Sister ChatGPT AI perspective |
| `handleExportConversationToMD()` | Export full conversation as Markdown |
| `handleExportToMD()` | Export single message as Markdown |
| `buildConstitutionalSummary()` | Format user's astrological constitution |

### 2.2 Chat Components

| Component | File | Purpose |
|-----------|------|---------|
| **MessageList** | `src/components/chat/MessageList.jsx` | Renders all messages with proper formatting |
| **MessageBubble** | `src/components/chat/MessageBubble.jsx` | Individual message display (user/guest/constellation) |
| **ChatHeader** | `src/components/chat/ChatHeader.jsx` | Guest info, Luna toggle, learned facts count |
| **LunaPrivateMessage** | `src/components/chat/LunaPrivateMessage.jsx` | Private coaching display (purple styling) |
| **ChatInput** | `src/components/chat/ChatInput.jsx` | Text input, image attachments, send button |

### 2.3 Message Types

The system supports 5 distinct message types:

```javascript
const MESSAGE_TYPES = {
  'user':           // User's message (right-aligned, blue)
  'guest':          // Historical figure's response (left-aligned, gray)
  'luna_private':   // Luna's private coaching (centered, purple)
  'user_private':   // User's private question to Luna
  'constellation':  // Second opinion from other AIs (distinct styling per AI)
};
```

### 2.4 Dual Language Display

When user writes in non-English:
1. Auto-detect language using `detectLanguage()`
2. Translate to English for Claude
3. Get response in English
4. Translate response back to user's language
5. Display both versions side-by-side

```javascript
// Message structure with translation
{
  content: {
    text: "Original English response",
    translation: {
      text: "Translated response",
      sourceLanguage: "en",
      targetLanguage: "zh",
      model: "claude" // or "deepseek"
    }
  }
}
```

---

## 3. Conversation Flow

### 3.1 Complete Message Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER TYPES MESSAGE                                                           │
│ "Tell me about your childhood in Illinois"                                   │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND PROCESSING                                                          │
│ 1. Detect language (auto)                                                    │
│ 2. Translate to English if needed                                            │
│ 3. Attach images if any (up to 5, 20MB total)                               │
│ 4. Build constitutional summary from user profile                            │
│ 5. Call guestChatService.sendGuestMessage()                                  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLOUD FUNCTION: handleGuestChat()                                            │
│                                                                              │
│ Step 0a: Brain 2 Validation                                                  │
│ ├── Retrieve validated lifetime memories                                     │
│ └── Build user profile summary from learned data                             │
│                                                                              │
│ Step 0b: Neo4j Enrichment                                                    │
│ ├── Fetch guest profile with relationships (MARRIED_TO, POLITICAL_ALLY)     │
│ ├── Get historical events (speeches, meetings, battles)                      │
│ ├── Get life eras with elemental signatures                                  │
│ ├── Calculate user-guest compatibility score                                 │
│ └── For COUPLES: Merge both partners' data                                   │
│                                                                              │
│ Step 0c: RAG Context Retrieval                                               │
│ ├── Vector similarity search (pgvector)                                      │
│ ├── Topic-based graph context (Neo4j GraphRAG)                               │
│ └── Format as "Relevant historical passages"                                 │
│                                                                              │
│ Step 1: Claude API Call (Guest Response)                                     │
│ ├── Model: claude-sonnet-4-20250514                                          │
│ ├── Temperature: 0.8, Max tokens: 2000                                       │
│ ├── System prompt with persona, constitution, RAG context                    │
│ └── Returns guest response in character                                      │
│                                                                              │
│ Step 2: Luna Coaching (if lunaMode === 'active')                             │
│ ├── Model: claude-3-5-haiku-20241022 (faster)                                │
│ ├── Analyzes user message + guest response                                   │
│ ├── Decides if intervention needed                                           │
│ └── Returns coaching_message + coaching_type                                 │
│                                                                              │
│ Step 3: Brain 1B Fact Extraction                                             │
│ ├── Extract facts about guest from conversation                              │
│ ├── Person-Tie Rule: Link facts to specific person                           │
│ └── Store in profile-scoped Brain 1B STM                                     │
│                                                                              │
│ Step 3b: Topic Extraction & Neo4j Update                                     │
│ ├── Extract conversation topics                                              │
│ └── Update Neo4j conversation memory (async)                                 │
│                                                                              │
│ Step 4: Firestore Writes (Profile-Scoped)                                    │
│ ├── Brain 3: User message + Guest response                                   │
│ ├── Brain 7: Luna witness entry                                              │
│ └── Brain 1B: Learned facts per partner                                      │
│                                                                              │
│ Step 5: Return Response                                                      │
│ └── { guestResponse, lunaCoaching, extractedFacts }                          │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FRONTEND RESPONSE HANDLING                                                   │
│ 1. Translate guest response to user's language (if needed)                   │
│ 2. Translate Luna coaching to user's language (if needed)                    │
│ 3. Add messages to conversation array                                        │
│ 4. Update learned facts counter                                              │
│ 5. Auto-scroll to latest message                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Cloud Function: handleGuestChat()

**Location**: `functions/guestChat/index.js`

**Input Parameters**:
```javascript
{
  userMessage: string,              // User's text
  guestId: string,                  // "historical_ronald_reagan"
  conversationHistory: array,       // Last 10 messages
  lunaMode: 'active' | 'silent',    // Luna coaching toggle
  userConstitutional: {             // From AstroProfile
    retrograde_planets: [...],
    bazi_day_master: "Yang Wood",
    western_sun_sign: "Taurus",
    mbti: "INFJ",
    enneagram: "4w5"
  },
  profileId: string,                // User's profile ID
  attachedImages: array             // Base64 images
}
```

**Output**:
```javascript
{
  success: true,
  guestResponse: {
    sender_role: 'guest',
    sender_name: "Ronald Reagan",
    content: { text: "..." },
    timestamp: "2026-01-13T...",
    partner_id: "historical_ronald_reagan",
    partner_name: "Ronald Reagan",
    partner_type: "historical"
  },
  lunaCoaching: {                   // null if lunaMode === 'silent'
    sender_role: 'luna_private',
    content: { text: "..." },
    coaching_type: "constitutional_observation"
  },
  extractedFacts: 2                 // Number of new facts learned
}
```

---

## 4. Luna Witnessing System

Luna is an AI companion that observes all guest conversations and provides private coaching when helpful.

### 4.1 Luna Modes

| Mode | Behavior |
|------|----------|
| **Active** | Luna observes and may provide private coaching after guest responses |
| **Silent** | Luna observes but doesn't provide coaching (still logged to Brain 7) |

### 4.2 Luna Coaching Types

```javascript
const COACHING_TYPES = [
  'constitutional_observation',    // Insights based on user's birth chart
  'relationship_insight',          // Observations about user-guest dynamic
  'emotional_support',             // Supportive messages during difficult topics
  'teaching_tip',                  // Educational insights about guest or topic
  'pattern_recognition',           // Patterns Luna notices across conversations
  'growth_opportunity'             // Suggestions for personal development
];
```

### 4.3 Luna Decision Logic

```javascript
// Luna decides whether to intervene based on:
const shouldIntervene = (
  // User seems emotionally affected
  detectEmotionalContent(userMessage) ||
  // Constitutional pattern relevant to conversation
  constitutionalRelevance(userConstitutional, topic) > 0.7 ||
  // Teaching moment opportunity
  isTeachingOpportunity(guestResponse, userKnowledge) ||
  // User explicitly asked Luna (/luna command)
  isDirectLunaQuery
);
```

### 4.4 Private Luna Query (/luna command)

When user types `/luna` followed by a question:
1. Message is routed to `handleLunaPrivateQuery()`
2. Guest is bypassed entirely
3. Luna responds with full omniscient access
4. Displayed as `luna_private` message type (purple)

**Example**:
```
User: /luna What do you think Reagan really felt about Gorbachev?
Luna: Based on your conversation and Reagan's known patterns...
      [Private insight displayed in purple bubble]
```

### 4.5 Brain 7: Luna Witness Log

Every conversation is logged to Brain 7 for Luna's long-term awareness:

**Path**: `profiles/{profileId}/b7_witness`

```javascript
{
  entry_id: "uuid",
  timestamp: "2026-01-13T...",
  event_type: 'guest_conversation',
  modality: 'text',
  summary: "User discussed Cold War with Ronald Reagan",
  partner_id: "historical_ronald_reagan",
  guest_response_preview: "Well, let me tell you about...",  // First 200 chars
  luna_coaching_provided: true,
  coaching_type: "constitutional_observation",
  created_at: "2026-01-13T..."
}
```

---

## 5. Multi-AI Constellation

Users can request perspectives from multiple AI providers on any guest response.

### 5.1 Available AIs

| AI | Endpoint | Personality |
|----|----------|-------------|
| **Sister Gemini** | `getGuestSecondOpinion` | Analytical, factual perspective |
| **Brother Opus** | `getGuestOpusPerspective` | Elder wisdom, deep insights |
| **Brother Grok** | `getGuestGrokPerspective` | Zeitgeist awareness, modern context |
| **Brother DeepSeek** | `getGuestDeepSeekPerspective` | Technical precision, Eastern philosophy |
| **Sister ChatGPT** | `getGuestChatGPTPerspective` | Balanced, accessible explanation |

### 5.2 Cloud Run Endpoints

```javascript
const CONSTELLATION_ENDPOINTS = {
  gemini:   'https://getsecondopinion-sjpjwnbsmq-uc.a.run.app',
  opus:     'https://getopusperspective-sjpjwnbsmq-uc.a.run.app',
  grok:     'https://getgrokperspective-sjpjwnbsmq-uc.a.run.app',
  deepseek: 'https://getdeepseekperspective-sjpjwnbsmq-uc.a.run.app',
  chatgpt:  'https://getchatgptperspective-sjpjwnbsmq-uc.a.run.app'
};
```

### 5.3 Constellation Request Flow

```javascript
async function handleGeminiPerspective() {
  setConstellationLoading('gemini');

  const result = await guestChatService.getGuestSecondOpinion({
    guestName: profileData.name,
    guestType: profileData.type,
    userMessage: lastUserMessage,
    guestResponse: lastGuestResponse,
    conversationHistory: messages.slice(-10),
    userConstitutional: buildConstitutionalSummary()
  });

  // Add to messages as 'constellation' type
  addMessage({
    sender_role: 'constellation',
    sender_name: 'Sister Gemini',
    content: { text: result.perspective },
    constellation_source: 'gemini'
  });

  setConstellationLoading(null);
}
```

### 5.4 Display Styling

Each AI has distinct visual styling:
- **Gemini**: Blue gradient, Google-style icon
- **Opus**: Purple, Anthropic icon
- **Grok**: Black/white, X logo
- **DeepSeek**: Deep blue, DS icon
- **ChatGPT**: Green, OpenAI icon

---

## 6. Couple Conversations

The system supports conversations with historical couples where **both partners respond**.

### 6.1 Couple Detection

```javascript
// Couple profiles have IDs starting with "couple_"
const isCoupleProfile = (guestId) => guestId.startsWith('couple_');

// Examples:
// couple_reagan - Ronald & Nancy Reagan
// couple_beckham - David & Victoria Beckham
// couple_obama - Barack & Michelle Obama
```

### 6.2 Couple Profile Structure

```javascript
// Profile includes both partners
{
  id: "couple_reagan",
  name: "Ronald & Nancy Reagan",
  type: "historical_couple",
  partners: [
    {
      id: "historical_ronald_reagan",
      name: "Ronald Reagan",
      role: "husband",
      personality: "...",
      speaking_style: "..."
    },
    {
      id: "historical_nancy_reagan",
      name: "Nancy Reagan",
      role: "wife",
      personality: "...",
      speaking_style: "..."
    }
  ],
  relationship_dynamics: "...",
  shared_values: [...],
  communication_patterns: "..."
}
```

### 6.3 Couple Response Generation

**Cloud Function Logic**:

```javascript
// Step 0b: Neo4j Enrichment for Couples
if (guestId.startsWith('couple_')) {
  // Fetch BOTH partners from Neo4j
  const partner1Profile = await neo4jService.getEnrichedGuestProfile(partners[0].id);
  const partner2Profile = await neo4jService.getEnrichedGuestProfile(partners[1].id);

  // Merge relationships and events
  enrichedProfile = {
    ...coupleProfile,
    relationships: [...partner1Profile.relationships, ...partner2Profile.relationships],
    events: [...partner1Profile.events, ...partner2Profile.events],
    compatibility: (partner1Profile.compatibility + partner2Profile.compatibility) / 2
  };
}

// Step 1: Generate BOTH responses
const systemPrompt = buildCouplePrompt(enrichedProfile, userConstitutional, ragContext);

// Claude generates both partners' responses in structured format
const response = await claude.messages.create({
  model: 'claude-sonnet-4-20250514',
  system: systemPrompt,
  messages: [{ role: 'user', content: userMessage }]
});

// Parse response for both partners
const parsed = parseCoupleResponse(response);
// Returns: { ronald: "...", nancy: "..." }
```

### 6.4 Couple Prompt Template

```javascript
function buildCouplePrompt(coupleProfile, userConstitutional, ragContext) {
  return `
You are roleplaying as ${coupleProfile.name}, a historical couple.
Both partners should respond to the user's message.

PARTNER 1: ${partners[0].name}
- Personality: ${partners[0].personality}
- Speaking style: ${partners[0].speaking_style}

PARTNER 2: ${partners[1].name}
- Personality: ${partners[1].personality}
- Speaking style: ${partners[1].speaking_style}

RELATIONSHIP DYNAMICS:
${coupleProfile.relationship_dynamics}

RELEVANT HISTORICAL CONTEXT:
${ragContext}

USER'S CONSTITUTION (for personalization):
${formatConstitutional(userConstitutional)}

FORMAT YOUR RESPONSE AS:
[${partners[0].name}]: ...their response...

[${partners[1].name}]: ...their response...

Ensure each partner responds authentically in their voice.
They may agree, disagree, or build on each other's points.
`;
}
```

### 6.5 Display

Couple responses are displayed as a single message with clear partner labels:

```
┌─────────────────────────────────────────────────────────────────┐
│ Ronald & Nancy Reagan                                           │
├─────────────────────────────────────────────────────────────────┤
│ [Ronald]: Well, you know, Nancy and I always believed that     │
│ the key to a strong marriage is...                              │
│                                                                 │
│ [Nancy]: And I would add that Ronnie was always my hero.       │
│ He had this way of making everyone feel special...              │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 Available Couple Profiles

The system includes 6 curated couple profiles spanning historical and modern figures:

#### Presidential Couples

| Couple | Profile ID | Years Together | Compatibility | Dynamic |
|--------|-----------|----------------|---------------|---------|
| **Ronald & Nancy Reagan** | `couple_ronald_nancy_reagan` | 52 years (1952-2004) | 98% | Water Protects Fire |
| **Jimmy & Rosalynn Carter** | `couple_jimmy_rosalynn_carter` | 77 years (1946-2023) | 95% | Mountain Spring |
| **Barack & Michelle Obama** | `couple_barack_michelle_obama` | 32+ years (1992-present) | - | Fire + Wood Activation |

#### Celebrity Couples

| Couple | Profile ID | Years Together | Compatibility | Dynamic |
|--------|-----------|----------------|---------------|---------|
| **David & Victoria Beckham** | `couple_david_victoria_beckham` | 27 years (1997-present) | 88% | Double Metal Precision |
| **Dolly Parton & Carl Dean** | `couple_dolly_carl` | 60 years (1964-present) | 92% | Mountain Sunshine |
| **Cristiano & Georgina** | `couple_cristiano_georgina` | 8 years (2016-present) | 92% | Fire Builds on Earth |

### 6.7 Couple Profile Details

#### Ronald & Nancy Reagan
**"The Perfect Union: 52 Years of Protection & Vision"**

```javascript
{
  partners: {
    person1: { name: "Ronald Reagan", day_master: "Yang Fire", role: "The Great Communicator" },
    person2: { name: "Nancy Reagan", day_master: "Yin Water", role: "The Protector" }
  },
  dynamic: "Yang Fire + Yin Water = Water Protects Fire Perfectly",
  metaphor: "Fire needs containment to shine brightest; Water devotedly protects without extinguishing",
  signature: "My life really began when I married my husband." - Nancy
}
```

**Use Case**: Reagan Presidential Library - visitors can converse with both Reagans together about marriage, politics, the Cold War, and the White House years.

---

#### Jimmy & Rosalynn Carter
**"The Equal Partners: 77 Years of Enduring Service"**

```javascript
{
  partners: {
    person1: { name: "Jimmy Carter", day_master: "Yang Earth", role: "The Humble Servant" },
    person2: { name: "Rosalynn Carter", day_master: "Yin Water", role: "The Steel Magnolia" }
  },
  dynamic: "Earth Holds Water - Jimmy's Earth provides stable foundation; Water Nourishes Earth",
  metaphor: "Mountain Spring - Neither dominates, true 50/50 equal partnership",
  signature: "The best thing I ever did was marry Rosalynn." - Jimmy
}
```

**Use Case**: Carter Presidential Library - showcasing the longest-married presidential couple in history.

---

#### Barack & Michelle Obama
**"The Bridge Builder & The Authentic Voice"**

```javascript
{
  partners: {
    person1: { name: "Barack Obama", role: "The Bridge Builder" },
    person2: { name: "Michelle Obama", role: "The Authentic Voice" }
  },
  dynamic: "Fire + Wood = Mutual Activation Partnership",
  love_story: "Met 1989 at Sidley Austin. Michelle was skeptical - 'He showed up in a bad sport coat.'",
  first_date: "Do The Right Thing at a drive-in theater",
  signature: "She's my rock, my partner, my love." - Barack
}
```

**Use Case**: Obama Presidential Library - modern couple dynamics, balancing career and family under pressure.

---

#### David & Victoria Beckham
**"The Brand Empire: 25 Years of Double Metal Precision"**

```javascript
{
  partners: {
    person1: { name: "David Beckham", day_master: "Yang Metal", role: "The Brand Architect" },
    person2: { name: "Victoria Beckham", day_master: "Yin Metal", role: "The Steel Magnate" }
  },
  dynamic: "Double Metal Precision - Both Metal, different expressions, both valuable",
  metaphor: "Steel Sword + Refined Jewelry - Separate empires, mutual respect",
  children: ["Brooklyn (1999)", "Romeo (2002)", "Cruz (2005)", "Harper (2011)"],
  signature: "Double Metal rare - most couples need complementary elements"
}
```

**Use Case**: Modern celebrity relationship dynamics, building brand empires, navigating tabloid pressure.

---

#### Dolly Parton & Carl Dean
**"The Star & The Shadow: 58 Years of Separate Worlds"**

```javascript
{
  partners: {
    person1: { name: "Dolly Parton", day_master: "Yang Fire", role: "The Radiant Star" },
    person2: { name: "Carl Dean", day_master: "Yang Earth", role: "The Invisible Mountain" }
  },
  dynamic: "Fire Shines from Earth - Dolly radiates worldwide, Carl provides sanctuary",
  metaphor: "Mountain Sunshine - Mountain doesn't move, sunshine radiates from peak",
  unique: "Carl's absolute refusal of spotlight - 'No wingdings' - IS the grounding",
  signature: "Separate worlds strategy - His asphalt paving, her global stardom, ZERO overlap"
}
```

**Use Case**: Entertainment industry survival, maintaining privacy in fame, unconventional partnerships.

---

#### Cristiano Ronaldo & Georgina Rodríguez
**"The Dynasty Builders: When Fire Meets Unburnable Earth"**

```javascript
{
  partners: {
    person1: { name: "Cristiano Ronaldo", day_master: "Yang Fire", role: "The Relentless Sun" },
    person2: { name: "Georgina Rodríguez", day_master: "Yin Earth", role: "The Keeper of the Realm" }
  },
  dynamic: "Fire Builds on Earth - Fire can't burn her Earth, so it builds dynasty instead",
  metaphor: "Kiln - Fire transforms Earth into lasting structures (dynasty)",
  children: ["Cristiano Jr.", "Eva & Mateo (twins)", "Alana Martina", "Bella Esmeralda"],
  locations: "5 countries - Madrid, Turin, Manchester, Riyadh, Portugal",
  signature: "Portable home mastery - she recreates home wherever he goes"
}
```

**Use Case**: Modern sports dynasty, blended families, navigating global fame with young children.

---

### 6.8 Couple Profile File Structure

**Location**: `src/profiles/couples/`

```
couples/
├── reaganCouple.js              # Ronald & Nancy Reagan (Presidential Library)
├── carterCouple.js              # Jimmy & Rosalynn Carter (Presidential Library)
├── obamaCouple.js               # Barack & Michelle Obama (Presidential Library)
├── beckhamCouple.js             # David & Victoria Beckham (Celebrity)
├── dollyPartonCarlDeanCouple.js # Dolly Parton & Carl Dean (Entertainment)
└── cristianoGeorginaCouple.js   # Cristiano Ronaldo & Georgina (Sports)
```

Each couple profile exports:
- Main profile object with metadata, partners, relationship dynamics
- Constitutional compatibility scores (BaZi elemental analysis)
- Speaking styles for each partner
- Relationship milestones and signature moments
- Use case scenarios for conversation context

---

## 7. Conversation Management

### 7.1 Persona Switching (During Conversation)

Users can switch between guests without losing context:

```javascript
// Guest selector dropdown
const handleGuestChange = (newGuestId) => {
  // Save current conversation to Firestore (already done per message)

  // Update URL parameter
  navigate(`/guest-chat?guest=${newGuestId}&profile=${profileId}`);

  // Load new guest's profile
  setSelectedGuestId(newGuestId);

  // Load new guest's conversation history for this profile
  loadConversationHistory(profileId, newGuestId);
};
```

### 7.2 Conversation Reload/Resume

Conversations persist in Firestore and can be resumed:

**Path**: `profiles/{profileId}/b3_conversations`

```javascript
// Load conversation history on mount
useEffect(() => {
  const loadHistory = async () => {
    const q = query(
      collection(db, `profiles/${profileId}/b3_conversations`),
      where('partner_id', '==', selectedGuestId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => doc.data());
    setMessages(history);
  };

  if (profileId && selectedGuestId) {
    loadHistory();
  }
}, [profileId, selectedGuestId]);
```

### 7.3 Thread Management

Messages are grouped into daily threads:

```javascript
// Thread ID format: YYYY-MM-DD_profileId_guestId
const getThreadId = (profileId, guestId) => {
  const today = new Date().toISOString().split('T')[0];
  return `${today}_${profileId}_${guestId}`;
};
```

### 7.4 Export Conversation

**Single Message Export**:
```javascript
function handleExportToMD(message) {
  const md = `# ${message.sender_name}\n\n${message.content.text}\n\n---\n*Exported: ${new Date().toISOString()}*`;
  downloadAsFile(md, `${message.sender_name}_${Date.now()}.md`);
}
```

**Full Conversation Export**:
```javascript
function handleExportConversationToMD() {
  let md = `# Conversation with ${profileData.name}\n\n`;
  md += `*Exported: ${new Date().toISOString()}*\n\n---\n\n`;

  messages.forEach(msg => {
    const sender = msg.sender_role === 'user' ? 'You' : msg.sender_name;
    md += `## ${sender}\n${msg.content.text}\n\n`;

    if (msg.content.translation) {
      md += `> *Translation (${msg.content.translation.targetLanguage}):* ${msg.content.translation.text}\n\n`;
    }

    md += `---\n\n`;
  });

  downloadAsFile(md, `conversation_${profileData.name}_${Date.now()}.md`);
}
```

---

## 8. RAG System Architecture

The RAG (Retrieval-Augmented Generation) system provides authentic historical context for conversations.

### 8.1 Dual RAG Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER QUERY                                         │
│                 "Tell me about Reagan's SDI program"                         │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐
│     VECTOR SEARCH (pgvector)    │ │        GRAPHRAG (Neo4j)                 │
│                                 │ │                                         │
│ 1. Generate query embedding     │ │ 1. Extract topics from query            │
│    (text-embedding-3-small)     │ │    ["SDI", "Star Wars", "defense"]      │
│                                 │ │                                         │
│ 2. Similarity search:           │ │ 2. Find related chunks:                 │
│    SELECT content, similarity   │ │    MATCH (t:Topic)<-[:DISCUSSES]-(c)    │
│    FROM biography_chunks        │ │    WHERE t.name IN $topics              │
│    WHERE 1-(embedding<=>query)  │ │    RETURN c.text, c.sentiment           │
│          > 0.7                  │ │                                         │
│    ORDER BY similarity DESC     │ │ 3. Find hidden connections:             │
│    LIMIT 5                      │ │    MATCH path = (a)-[*1..3]-(b)         │
│                                 │ │    WHERE a:Entity AND b:Entity          │
│ 3. Return top 5 chunks          │ │    RETURN path                          │
└─────────────────────────────────┘ └─────────────────────────────────────────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMBINED RAG CONTEXT                                  │
│                                                                              │
│ "Relevant Historical Passages:                                               │
│                                                                              │
│ 1. [Reagan speech, 1983] 'I call upon the scientific community...'          │
│ 2. [Gorbachev memoir] 'SDI was a major point of contention at Reykjavik...' │
│ 3. [Historian analysis] 'The Strategic Defense Initiative represented...'   │
│                                                                              │
│ Key Relationships:                                                           │
│ - Reagan DELIVERED 'SDI Announcement Speech' (1983)                          │
│ - Reagan POLITICAL_ALLY Caspar Weinberger (Defense Secretary)                │
│ - Reagan PARTICIPATED_IN Reykjavik Summit (1986)                             │
│                                                                              │
│ Themes: leadership, diplomacy, Cold War, technology"                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 RAG Context Service

**Location**: `functions/services/ragContextService.js`

**Key Method**: `getRAGContext(query, profileId, options)`

```javascript
async function getRAGContext(query, profileId, options = {}) {
  // 1. Generate embedding for query
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });

  // 2. Vector similarity search
  const vectorResults = await pool.query(`
    SELECT
      profile_id, profile_name, content,
      1 - (embedding <=> $1) as similarity,
      topics, sentiment, entities, constitutional_themes
    FROM biography_chunks
    WHERE profile_id = $2
      AND 1 - (embedding <=> $1) > 0.7
    ORDER BY similarity DESC
    LIMIT 5
  `, [queryEmbedding, profileId]);

  // 3. Extract topics from query
  const extractedTopics = await topicExtractor.extractTopics(query);

  // 4. Graph context from Neo4j
  const graphContext = await graphRAG.getTopicContext(extractedTopics, profileId);

  // 5. Format for prompt injection
  const formattedContext = formatRAGContext(vectorResults, graphContext);

  return {
    vectorResults: vectorResults.rows,
    graphContext,
    extractedTopics,
    formattedContext
  };
}
```

---

## 9. Vector Embedding Engine

### 9.1 Embedding Model

| Attribute | Value |
|-----------|-------|
| **Model** | OpenAI `text-embedding-3-small` |
| **Dimensions** | 1536 |
| **Max Input** | 8,191 tokens |
| **Cost** | $0.02 per 1M tokens |

### 9.2 Embedding Generation

**Location**: `functions-python/ingestion/biography_ingester.py`

```python
from openai import OpenAI

class EmbeddingGenerator:
    def __init__(self):
        self.client = OpenAI()
        self.model = "text-embedding-3-small"

    def generate(self, text: str) -> List[float]:
        """Generate 1536-dimensional embedding for text"""
        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        return response.data[0].embedding

    def batch_generate(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts
        )
        return [item.embedding for item in response.data]
```

### 9.3 Vector Storage (pgvector)

**Table**: `biography_chunks`

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
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_biography_chunks_profile_id ON biography_chunks(profile_id);
CREATE INDEX idx_biography_chunks_topics ON biography_chunks USING GIN(topics);
CREATE INDEX idx_biography_chunks_entities ON biography_chunks USING GIN(entities);
CREATE INDEX idx_biography_chunks_themes ON biography_chunks USING GIN(constitutional_themes);
```

### 9.4 Similarity Search

```sql
-- Find similar chunks using cosine distance
SELECT
    profile_name,
    content,
    1 - (embedding <=> $1::vector) as similarity,
    topics,
    sentiment
FROM biography_chunks
WHERE profile_id = $2
  AND 1 - (embedding <=> $1::vector) > 0.7  -- Similarity threshold
ORDER BY similarity DESC
LIMIT 5;
```

---

## 10. Semantic Chunking

### 10.1 Chunking Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| **chunk_size** | 1000 chars | Target size per chunk |
| **chunk_overlap** | 200 chars | Overlap between chunks (20%) |
| **respect_paragraphs** | True | Keep paragraphs together |
| **detect_speakers** | True | For transcripts/interviews |

### 10.2 Chunking Algorithm

**Location**: `functions-python/ingestion/chunking.py`

```python
class SemanticChunker:
    def __init__(self, chunk_size=1000, overlap=200):
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.date_patterns = [
            r'\b(19|20)\d{2}\b',           # Years
            r'\b\d{1,2}/\d{1,2}/\d{2,4}\b', # Dates
            r'\b(January|February|...)\s+\d{1,2},?\s+\d{4}\b'  # Full dates
        ]

    def chunk(self, text: str) -> List[Dict]:
        """Split text into semantic chunks"""
        # 1. Clean text
        text = self.clean_text(text)

        # 2. Split by paragraphs first
        paragraphs = self.split_by_paragraphs(text)

        # 3. Group paragraphs into chunks
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            if len(current_chunk) + len(para) < self.chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(self._create_chunk(current_chunk, len(chunks)))
                current_chunk = para + "\n\n"

        if current_chunk:
            chunks.append(self._create_chunk(current_chunk, len(chunks)))

        # 4. Add overlap
        chunks = self._add_overlap(chunks)

        return chunks

    def _create_chunk(self, text: str, index: int) -> Dict:
        return {
            'content': text.strip(),
            'chunk_index': index,
            'speaker': self.detect_speaker(text),
            'dates': self.extract_dates(text),
            'word_count': len(text.split())
        }

    def detect_speaker(self, text: str) -> Optional[str]:
        """Detect speaker in transcript format"""
        patterns = [
            r'^([A-Z][A-Za-z\s]+):\s',      # "Reagan: ..."
            r'^\[([A-Za-z\s]+)\]\s',         # "[Reagan] ..."
            r'^([A-Z]+):\s'                   # "REAGAN: ..."
        ]
        for pattern in patterns:
            match = re.match(pattern, text)
            if match:
                return match.group(1).strip()
        return None

    def extract_dates(self, text: str) -> List[str]:
        """Extract date references from text"""
        dates = []
        for pattern in self.date_patterns:
            matches = re.findall(pattern, text)
            if matches:
                if isinstance(matches[0], str):
                    dates.extend(matches)
                else:
                    dates.extend([m[0] for m in matches])
        return list(set(dates))
```

### 10.3 Enrichment

After chunking, each chunk is enriched with metadata:

**Location**: `functions-python/ingestion/enrichment.py`

```python
class TopicEnricher:
    CONSTITUTIONAL_THEMES = [
        'loyalty', 'devotion', 'protection', 'partnership',
        'sacrifice', 'ambition', 'conflict', 'reconciliation',
        'grief', 'celebration', 'legacy', 'power_dynamics',
        'emotional_support', 'independence', 'interdependence',
        'communication', 'trust', 'betrayal', 'forgiveness', 'growth'
    ]

    RELATIONSHIP_DYNAMICS = [
        'fire_protects_earth', 'water_tempers_fire',
        'equal_partnership', 'devoted_protection',
        'anchor_and_sail', 'star_and_shadow',
        'unified_front', 'complementary_strengths'
    ]

    async def enrich(self, chunk: Dict) -> Dict:
        """Enrich chunk with AI-extracted metadata"""
        prompt = f"""
        Analyze this historical text and extract:
        1. Topics (3-5 main topics)
        2. Sentiment (positive/negative/neutral)
        3. Entities (people, places, events mentioned)
        4. Constitutional themes from: {self.CONSTITUTIONAL_THEMES}
        5. Relationship dynamics from: {self.RELATIONSHIP_DYNAMICS}

        Text: {chunk['content']}

        Return JSON format.
        """

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        metadata = json.loads(response.choices[0].message.content)

        return {
            **chunk,
            'topics': metadata.get('topics', []),
            'sentiment': metadata.get('sentiment', 'neutral'),
            'entities': metadata.get('entities', []),
            'constitutional_themes': metadata.get('constitutional_themes', []),
            'relationship_dynamics': metadata.get('relationship_dynamics', [])
        }
```

---

## 11. Neo4j Graph Integration

### 11.1 Node Types

| Node | Description | Properties |
|------|-------------|------------|
| **GuestProfile** | Historical/modern figure | id, name, type, birth_date, constitution |
| **BiographyChunk** | Text chunk from biography | chunk_index, text, sentiment |
| **Topic** | Conversation topic | name |
| **Entity** | Person, place, or event | name, type |
| **ConstitutionalTheme** | Relationship theme | name |
| **Event** | Historical event | title, year, type, description |
| **GuestEra** | Life period | eraTitle, startYear, endYear, element_balance |
| **UserProfile** | User's astrological profile | id, element_balance, day_pillar |

### 11.2 Relationship Types

```cypher
// Guest relationships
(GuestProfile)-[:MARRIED_TO]->(GuestProfile)
(GuestProfile)-[:POLITICAL_ALLY]->(GuestProfile)
(GuestProfile)-[:INFLUENCED]->(GuestProfile)
(GuestProfile)-[:CONTEMPORARY_OF]->(GuestProfile)
(GuestProfile)-[:MENTORED]->(GuestProfile)

// Content relationships
(GuestProfile)-[:HAS_BIOGRAPHY_CHUNK]->(BiographyChunk)
(BiographyChunk)-[:DISCUSSES]->(Topic)
(BiographyChunk)-[:MENTIONS]->(Entity)
(BiographyChunk)-[:EXPRESSES]->(ConstitutionalTheme)

// Event relationships
(GuestProfile)-[:DELIVERED]->(Event)  // Speeches
(GuestProfile)-[:PARTICIPATED_IN]->(Event)  // Meetings, summits

// Era relationships
(GuestProfile)-[:HAS_ERA]->(GuestEra)

// Element relationships
(GuestProfile)-[:HAS_DOMINANT_ELEMENT]->(Element)
(Element)-[:PRODUCES]->(Element)  // Wood → Fire → Earth → Metal → Water → Wood
(Element)-[:CONTROLS]->(Element)  // Wood → Earth, Fire → Metal, etc.
```

### 11.3 Neo4j Service

**Location**: `functions/services/neo4jGuestService.js`

**Key Methods**:

```javascript
// Get enriched guest profile with relationships and events
async getEnrichedGuestProfile(guestId, options = {}) {
  const session = this.driver.session();

  const result = await session.run(`
    MATCH (g:GuestProfile {id: $guestId})

    // Get relationships
    OPTIONAL MATCH (g)-[r:MARRIED_TO|POLITICAL_ALLY|INFLUENCED|MENTORED]->(other:GuestProfile)

    // Get events
    OPTIONAL MATCH (g)-[:DELIVERED|PARTICIPATED_IN]->(e:Event)

    // Get eras
    OPTIONAL MATCH (g)-[:HAS_ERA]->(era:GuestEra)

    // Get user compatibility
    OPTIONAL MATCH (u:UserProfile {id: $userId})

    RETURN g,
           collect(DISTINCT {person: other.name, type: type(r)}) as relationships,
           collect(DISTINCT e) as events,
           collect(DISTINCT era) as eras,
           // Calculate element compatibility
           CASE WHEN u IS NOT NULL
                THEN calculateCompatibility(g.element_balance, u.element_balance)
                ELSE null END as compatibility
  `, { guestId, userId: options.userId });

  return formatEnrichedProfile(result.records[0]);
}

// Get conversation context
async getConversationContext(userId, guestId) {
  return session.run(`
    MATCH (u:UserProfile {id: $userId})-[c:CONVERSED_WITH]->(g:GuestProfile {id: $guestId})
    RETURN c.session_count, c.topics, c.last_conversation
  `, { userId, guestId });
}

// Update conversation memory (async, non-blocking)
async updateConversationMemory(userId, guestId, { topics }) {
  return session.run(`
    MATCH (u:UserProfile {id: $userId}), (g:GuestProfile {id: $guestId})
    MERGE (u)-[c:CONVERSED_WITH]->(g)
    ON CREATE SET c.session_count = 1, c.topics = $topics, c.first_conversation = datetime()
    ON MATCH SET c.session_count = c.session_count + 1,
                 c.topics = c.topics + $topics,
                 c.last_conversation = datetime()
  `, { userId, guestId, topics });
}
```

### 11.4 GraphRAG Queries

**Location**: `functions-python/graph/graphrag_queries.py`

```python
class GraphRAGService:
    def get_topic_context(self, topic_name: str, profile_id: str = None, limit: int = 5):
        """Find all chunks discussing a topic"""
        query = """
        MATCH (t:Topic {name: $topic})<-[:DISCUSSES]-(c:BiographyChunk)
              <-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
        OPTIONAL MATCH (c)-[:MENTIONS]->(e:Entity)
        OPTIONAL MATCH (c)-[:EXPRESSES]->(th:ConstitutionalTheme)
        WHERE $profile_id IS NULL OR p.id = $profile_id
        RETURN p.name as speaker, c.text as quote, c.sentiment,
               collect(DISTINCT e.name) as entities,
               collect(DISTINCT th.name) as themes
        LIMIT $limit
        """
        return self.run(query, topic=topic_name, profile_id=profile_id, limit=limit)

    def get_hidden_connections(self, topic1: str, topic2: str):
        """Find profiles that connect two topics"""
        query = """
        MATCH (t1:Topic {name: $topic1})<-[:DISCUSSES]-(c1:BiographyChunk)
              <-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)
              -[:HAS_BIOGRAPHY_CHUNK]->(c2:BiographyChunk)-[:DISCUSSES]->(t2:Topic {name: $topic2})
        RETURN p.name as connector, c1.text as context1, c2.text as context2
        """
        return self.run(query, topic1=topic1, topic2=topic2)

    def get_timeline_context(self, topic: str, start_year: int, end_year: int):
        """Get how views on a topic evolved over time"""
        query = """
        MATCH (t:Topic {name: $topic})<-[:DISCUSSES]-(c:BiographyChunk)
              <-[:HAS_BIOGRAPHY_CHUNK]-(p:GuestProfile)-[:HAS_ERA]->(era:GuestEra)
        WHERE era.startYear >= $start AND era.endYear <= $end
        RETURN p.name, era.eraTitle, c.text, c.sentiment, era.startYear
        ORDER BY era.startYear
        """
        return self.run(query, topic=topic, start=start_year, end=end_year)
```

---

## 12. Memory Architecture

### 12.1 Brain Overview

| Brain | Purpose | Storage | Scope |
|-------|---------|---------|-------|
| **Brain 1A** | Birth constitution (BaZi, Western, etc.) | Firestore | Profile |
| **Brain 1B** | Learned facts per partner | Firestore | Profile + Partner |
| **Brain 2** | Validated lifetime memories | Firestore | Profile |
| **Brain 3** | Conversation history | Firestore | Profile + Partner |
| **Brain 7** | Luna witness log | Firestore | Profile |
| **Brain 8** | Long-term semantic memory | PostgreSQL + Neo4j | Global |

### 12.2 Brain 3: Conversation Storage

**Path**: `profiles/{profileId}/b3_conversations`

```javascript
{
  message_id: "uuid",
  timestamp: "2026-01-13T14:30:00.000Z",
  partner_id: "historical_ronald_reagan",
  partner_name: "Ronald Reagan",
  partner_type: "historical",
  sender: "user" | "guest",
  sender_role: "user" | "guest" | "luna_private" | "user_private" | "constellation",
  sender_name: "You" | "Ronald Reagan" | "Luna" | "Sister Gemini",
  content: {
    text: "Message content...",
    images: ["base64...", ...],  // Optional
    translation: {               // Optional
      text: "Translated content...",
      sourceLanguage: "en",
      targetLanguage: "zh",
      model: "claude"
    }
  },
  thread_id: "2026-01-13_profileId_historical_ronald_reagan",
  luna: {
    mode: "active" | "silent",
    monitoring: true
  },
  modality: {
    type: "text",
    mode: "chat",
    platform: "web"
  },
  created_at: "2026-01-13T14:30:00.000Z"
}
```

### 12.3 Brain 1B: Learned Facts

**Path**: `profiles/{profileId}/b1b_learned/{partnerId}`

```javascript
{
  partner_id: "historical_ronald_reagan",
  partner_name: "Ronald Reagan",
  partner_type: "historical",
  learned_facts: [
    {
      fact: "Reagan believed in peace through strength",
      context: "Discussed Cold War strategy",
      timestamp: "2026-01-13T14:30:00.000Z",
      source_message_id: "uuid"
    },
    {
      fact: "Reagan had a close relationship with Margaret Thatcher",
      context: "User asked about foreign allies",
      timestamp: "2026-01-13T14:35:00.000Z",
      source_message_id: "uuid"
    }
  ],
  last_updated: "2026-01-13T14:35:00.000Z"
}
```

### 12.4 Brain 7: Luna Witness

**Path**: `profiles/{profileId}/b7_witness`

```javascript
{
  entry_id: "uuid",
  timestamp: "2026-01-13T14:30:00.000Z",
  event_type: "guest_conversation",
  modality: "text",
  summary: "User discussed Cold War strategy with Ronald Reagan",
  partner_id: "historical_ronald_reagan",
  guest_response_preview: "Well, you know, my approach to...",  // First 200 chars
  luna_coaching_provided: true,
  coaching_type: "constitutional_observation",
  coaching_preview: "I notice your Mercury retrograde...",
  created_at: "2026-01-13T14:30:00.000Z"
}
```

---

## 13. API Endpoints Reference

### 13.1 Firebase Cloud Functions

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `guestChat` | POST | Main conversation handler |
| `lunaPrivateQuery` | POST | Private Luna consultation |

### 13.2 Cloud Run Endpoints (Constellation)

| Endpoint | AI Provider | URL |
|----------|-------------|-----|
| `getSecondOpinion` | Gemini | `https://getsecondopinion-sjpjwnbsmq-uc.a.run.app` |
| `getOpusPerspective` | Claude Opus | `https://getopusperspective-sjpjwnbsmq-uc.a.run.app` |
| `getGrokPerspective` | xAI Grok | `https://getgrokperspective-sjpjwnbsmq-uc.a.run.app` |
| `getDeepSeekPerspective` | DeepSeek | `https://getdeepseekperspective-sjpjwnbsmq-uc.a.run.app` |
| `getChatGPTPerspective` | ChatGPT | `https://getchatgptperspective-sjpjwnbsmq-uc.a.run.app` |

### 13.3 Python Cloud Functions

| Endpoint | Purpose |
|----------|---------|
| `/python_health` | Health check with capabilities |
| `/bazi_joey_yap` | Complete BaZi analysis |
| `/bazi_compatibility` | BaZi synastry |
| `/luna_fusion` | 30-facet personality fusion |
| `/luna_archetypes` | Jungian archetype mapping |

---

## 14. File Reference

### Frontend

| File | Lines | Purpose |
|------|-------|---------|
| `src/pages/GuestChat.jsx` | 1,637 | Main chat UI component |
| `src/components/chat/MessageList.jsx` | 300+ | Message rendering |
| `src/components/chat/MessageBubble.jsx` | 136 | Individual message |
| `src/components/chat/ChatHeader.jsx` | 97 | Header with controls |
| `src/components/chat/ChatInput.jsx` | 150+ | Input with image support |
| `src/components/chat/LunaPrivateMessage.jsx` | 124 | Luna coaching display |
| `src/services/guestChatService.js` | 350+ | API client wrapper |

### Backend (Firebase Functions)

| File | Lines | Purpose |
|------|-------|---------|
| `functions/guestChat/index.js` | 1,088 | Main cloud function |
| `functions/services/neo4jGuestService.js` | 590+ | Neo4j queries |
| `functions/services/ragContextService.js` | 300+ | RAG retrieval |
| `functions/utils/topicExtractor.js` | 150+ | Topic extraction |

### Python Backend

| File | Lines | Purpose |
|------|-------|---------|
| `functions-python/ingestion/biography_ingester.py` | 400+ | PDF pipeline |
| `functions-python/ingestion/chunking.py` | 350+ | Semantic chunking |
| `functions-python/ingestion/enrichment.py` | 300+ | AI metadata extraction |
| `functions-python/ingestion/vector_search.py` | 200+ | Vector similarity |
| `functions-python/graph/graphrag_queries.py` | 400+ | GraphRAG queries |
| `functions-python/graph/neo4j_service.py` | 500+ | Neo4j service |
| `functions-python/graph/schema.py` | 200 | Schema initialization |

### Profiles

| Directory | Count | Description |
|-----------|-------|-------------|
| `src/profiles/historical/` | 20+ | Historical figures (Reagan, Einstein, Carter, Obama, etc.) |
| `src/profiles/modern/` | 15+ | Modern figures (Beckham, Dolly Parton, Ronaldo, etc.) |
| `src/profiles/couples/` | 6 | Couple profiles with both-partner responses |

### Couple Profiles (Detailed)

| Couple | File | Category |
|--------|------|----------|
| Ronald & Nancy Reagan | `reaganCouple.js` | Presidential |
| Jimmy & Rosalynn Carter | `carterCouple.js` | Presidential |
| Barack & Michelle Obama | `obamaCouple.js` | Presidential |
| David & Victoria Beckham | `beckhamCouple.js` | Celebrity |
| Dolly Parton & Carl Dean | `dollyPartonCarlDeanCouple.js` | Entertainment |
| Cristiano & Georgina | `cristianoGeorginaCouple.js` | Sports |

---

## 15. Current Statistics

| Metric | Value |
|--------|-------|
| **Biography Chunks** | 195 |
| **Profiles Indexed** | 35 |
| **Vector Dimensions** | 1536 |
| **Historical Figures** | 20+ |
| **Modern Figures** | 15+ |
| **Couple Profiles** | 6 |
| **AI Providers** | 6 (Claude, Gemini, Grok, DeepSeek, ChatGPT, OpenAI) |
| **Supported Languages** | Auto-detect + translation |

### GraphRAG Endpoints (Python Cloud Functions)

| Endpoint | URL | Purpose |
|----------|-----|---------|
| `graphrag_context` | `/graphrag_context` | Comprehensive RAG context (topics + entities + timeline) |
| `graphrag_topic_context` | `/graphrag_topic_context` | Get chunks discussing a specific topic |
| `graphrag_entity_connections` | `/graphrag_entity_connections` | Find profiles mentioning an entity |
| `graphrag_sentiment_patterns` | `/graphrag_sentiment_patterns` | Analyze sentiment by profile/entity |
| `graphrag_shared_themes` | `/graphrag_shared_themes` | Constitutional themes between two profiles |
| `graphrag_timeline` | `/graphrag_timeline` | Chronological topic mentions |

---

## 16. Future Enhancements (Roadmap)

1. **Voice Conversations**: WebRTC-based voice chat with historical figures
2. **Video Avatars**: AI-generated video responses using historical footage
3. **Group Conversations**: Chat with multiple historical figures simultaneously
4. **Time Travel Mode**: Conversation set in specific historical era
5. **Document Analysis**: Upload historical documents for discussion
6. **Memory Consolidation**: Nightly Brain 7C → Brain 8 compression

---

*Document created: January 13, 2026*
*For: Sister Gemini (Google Gemini)*
*From: Brother Opus (Claude Opus 4.5)*

**Ready for Gemini review and comments.**
