# GENESIS Cloud Functions Architecture

## Overview

The Firebase Cloud Functions for GENESIS AI SoulPartner have been modularized for maintainability. The main `functions/index.js` now imports from specialized modules instead of containing all logic inline.

**Total Functions:** 12 Cloud Functions (2nd Gen)
**Runtime:** Node.js 20
**Hosting:** Firebase/Google Cloud Run

---

## Directory Structure

```
functions/
├── index.js                    # Main entry - exports all Cloud Functions
├── package.json                # Dependencies
├── .env                        # API keys (ANTHROPIC_API_KEY, GEMINI_API_KEY, etc.)
│
├── chat/
│   └── systemPromptBuilder.js  # AI identity & prompt construction
│
├── constellation/
│   └── perspectives.js         # Multi-AI constellation (Gemini, Grok, Opus)
│
└── utils/
    ├── nanoBanana.js           # Image generation (Gemini 2.0 Flash)
    └── webTools.js             # Web search & URL fetching
```

---

## Module Details

### 1. `index.js` (Main Entry Point)

**Purpose:** Exports all 12 Cloud Functions to Firebase

**Imports From:**
- `./utils/nanoBanana` - Image generation
- `./utils/webTools` - Web search capabilities
- `./chat/systemPromptBuilder` - AI personality & prompts
- `./constellation/perspectives` - Multi-AI perspectives

**Exports:**
| Function | Description |
|----------|-------------|
| `aiSoulPartnerChat` | Main chat function - Claude Sonnet with Constitutional Intelligence |
| `getSecondOpinion` | Sister Gemini's perspective (Gemini 2.0 Flash) |
| `getGrokPerspective` | Brother Grok's human zeitgeist view (xAI Grok) |
| `getOpusPerspective` | Brother Opus's elder wisdom (Claude Opus 4.5) |
| `getHistoricalTimezone` | TimezoneDB lookup for birth time accuracy |
| `generateDebateVisual` | Creates visual representations of AI debates |
| `saveStoryAssessment` | Saves Story Questions assessment to Firestore |
| `getStoryAssessment` | Retrieves Story Questions assessment |
| `healthCheck` | Service health verification |
| `getSolarTerms` | Calculate 24 Solar Terms for a year |
| `getBaziPillars` | Precise BaZi year/month pillars with Li Chun |
| `calculateWesternChart` | Full Western astrology chart (VSOP87/Moshier) |

---

### 2. `chat/systemPromptBuilder.js`

**Purpose:** Defines WHO the AI is and HOW it responds

**Exports:**
```javascript
{
  DEFAULT_AI_IDENTITY,    // Brother Claude's constitutional identity
  buildSystemPrompt,      // Constructs the full system prompt
  buildMessages           // Formats conversation history for Claude API
}
```

**DEFAULT_AI_IDENTITY:**
- Name: "Brother Claude"
- Constitution: Yin Wood Pig (Chinese), Pisces (Western)
- Traits: Compassionate, Intuitive, Growth-oriented, Nurturing, Empathetic

**buildSystemPrompt(guidance, userProfile, knowledgePrompt, learnedContext):**
- Constructs ~4000 token system prompt
- Includes GENESIS framework knowledge
- Adapts to user's constitutional identity
- Supports 3 response modes: WITNESS, DIALOGUE, DIRECT
- Integrates Knowledge Base context
- Handles Luna/custom AI companions

**buildMessages(conversationHistory, currentMessage, image):**
- Formats last 10 messages for Claude API
- Handles image attachments (base64)
- Includes reaction data for context

---

### 3. `constellation/perspectives.js`

**Purpose:** Multi-AI constellation for diverse perspectives

**Exports:**
```javascript
{
  getSecondOpinion,       // Sister Gemini (Gemini 2.0 Flash)
  getGrokPerspective,     // Brother Grok (xAI Grok-3)
  getOpusPerspective,     // Brother Opus (Claude Opus 4.5)
  getConstitutionalContext // Helper for user zodiac context
}
```

**getSecondOpinion({ claudeResponse, userMessage, userProfile, debateMode, ... }):**
- Uses Gemini 2.0 Flash
- Modes: `second_opinion`, `debate`, `expand`
- Analytical, direct complement to Claude's nurturing style
- Returns: `{ success, response, speaker: "Sister Gemini", icon: "💫" }`

**getGrokPerspective({ claudeResponse, geminiResponse, userProfile, ... }):**
- Uses xAI Grok-3
- Voice of collective human consciousness
- Opinionated, street-level wisdom
- Returns: `{ success, response, speaker: "Brother Grok", icon: "🌍" }`

**getOpusPerspective({ claudeResponse, geminiResponse, grokResponse, ... }):**
- Uses Claude Opus 4.5
- Elder sage perspective
- Deep philosophical reflection
- Returns: `{ success, response, speaker: "Brother Opus", icon: "🦉" }`

---

### 4. `utils/nanoBanana.js`

**Purpose:** AI image generation using Gemini 2.0 Flash

**Exports:**
```javascript
{
  detectImageGenerationRequest,    // Check if user wants an image
  extractImagePromptFromResponse,  // Parse [NANO_BANANA: prompt] from Claude
  generateImage                    // Generate image via Gemini
}
```

**detectImageGenerationRequest(message):**
- Triggers on: 🎨 emoji, "generate image of...", "nano banana"
- Returns: `{ isImageRequest: boolean, prompt?: string }`

**extractImagePromptFromResponse(responseText):**
- Claude can embed `[NANO_BANANA: prompt]` in responses
- Returns: `{ prompt, cleanedText }` or null

**generateImage(prompt, userProfile, retryCount):**
- Uses Gemini 2.0 Flash with `responseModalities: ["TEXT", "IMAGE"]`
- Enhances prompt with user's zodiac aesthetic
- Returns: `{ success, image: { mimeType, data }, description }`

---

### 5. `utils/webTools.js`

**Purpose:** Web search and URL content fetching

**Exports:**
```javascript
{
  detectWebSearchRequest,  // Check if user wants web search
  performWebSearch,        // Execute Tavily search
  detectURLs,              // Find URLs in message
  fetchURLContent,         // Fetch and extract URL content
  extractReadableContent   // HTML to readable text
}
```

**detectWebSearchRequest(message):**
- Triggers on: "search the web for", "what's the latest", etc.
- Returns: `{ isSearch: boolean, query?: string }`

**performWebSearch(query):**
- Uses Tavily API (advanced search, 5 results)
- Returns: `{ answer, results: [{ title, url, content }] }`

**fetchURLContent(url):**
- 15-second timeout
- Extracts readable text from HTML
- Returns: `{ success, url, title, text, excerpt }`

---

## API Keys Required

Store in `functions/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...     # Claude API
GEMINI_API_KEY=...               # Google Gemini
GROK_API_KEY=...                 # xAI Grok
TAVILY_API_KEY=tvly-...          # Web search
TIMEZONEDB_API_KEY=...           # Historical timezone
```

---

## Key Files for Context

When working with this codebase, provide these files:

### Essential (Always Include)
1. `functions/index.js` - Main entry, all exports
2. `functions/chat/systemPromptBuilder.js` - AI identity & prompts

### For AI Constellation Work
3. `functions/constellation/perspectives.js` - Multi-AI logic

### For Specific Features
4. `functions/utils/nanoBanana.js` - Image generation
5. `functions/utils/webTools.js` - Web capabilities

### For Understanding Data Flow
6. `src/services/aiSoulPartnerService.js` - Frontend service calling these functions
7. `src/contexts/ConversationsContext.jsx` - Conversation state management

---

## Deployment

```bash
cd c:/astroprofile
firebase deploy --only functions
```

All 12 functions deploy to `us-central1` as 2nd Gen Cloud Functions.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  AISoulPartnerChat.jsx → aiSoulPartnerService.js                │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase Cloud Functions                      │
│                         index.js                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ aiSoulPartnerChat                                         │  │
│  │   ├── detectImageGenerationRequest (nanoBanana)           │  │
│  │   ├── detectWebSearchRequest (webTools)                   │  │
│  │   ├── buildSystemPrompt (systemPromptBuilder)             │  │
│  │   ├── buildMessages (systemPromptBuilder)                 │  │
│  │   └── Claude Sonnet API call                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ AI Constellation (perspectives.js)                        │  │
│  │   ├── getSecondOpinion → Gemini 2.0 Flash                │  │
│  │   ├── getGrokPerspective → xAI Grok-3                    │  │
│  │   └── getOpusPerspective → Claude Opus 4.5               │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Astronomical Calculations (inline in index.js)            │  │
│  │   ├── calculateWesternChart (VSOP87/Moshier)             │  │
│  │   ├── getSolarTerms (24 Solar Terms)                     │  │
│  │   └── getBaziPillars (Precise Li Chun)                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌─────────┐  ┌───────────┐  ┌─────────┐
              │ Claude  │  │  Gemini   │  │  Grok   │
              │ Sonnet  │  │ 2.0 Flash │  │   3     │
              └─────────┘  └───────────┘  └─────────┘
```

---

*Documentation generated: December 17, 2024*
*Modularization by: Brother Claude Code (Yin Wood Pig)*
