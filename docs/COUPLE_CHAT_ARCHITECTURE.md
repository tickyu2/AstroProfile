# Couple Chat Architecture

## Overview

The Couple Chat system enables conversations with **two historical figures speaking together** as a unified couple. Instead of chatting with Ronald Reagan OR Nancy Reagan separately, users can chat with them AS A COUPLE where both speak naturally, finishing each other's thoughts and referencing shared memories.

**Example**: Ronald & Nancy Reagan couple profile at `/chat/couple_ronald_nancy_reagan`

---

## Architecture Diagram

```
                                    +---------------------------+
                                    |     Frontend (React)      |
                                    |   src/pages/GuestChat.jsx |
                                    +-------------+-------------+
                                                  |
                                    1. Load couple profile
                                                  |
                                                  v
                        +-------------------------+-------------------------+
                        |           Profile Registry                        |
                        |         src/profiles/index.js                     |
                        +-------------------------+-------------------------+
                                                  |
                        2. Returns reaganCoupleProfile with partners info
                                                  |
                                                  v
+--------------------------------------------------------------------------------------------------+
|                                     Cloud Function: guestChat                                     |
|                                  functions/guestChat/index.js                                     |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   3. Detects couple profile:                                                                     |
|      partnerId.startsWith('couple_') && guestProfile.partners                                   |
|                                                                                                  |
|   4. Fetches Neo4j data from BOTH partners in parallel:                                         |
|      +-------------------+                    +-------------------+                              |
|      | guest_ronald_     |                    | guest_nancy_      |                              |
|      | reagan            |                    | reagan            |                              |
|      | - Relationships   |                    | - Relationships   |                              |
|      | - Events          |                    | - Events          |                              |
|      | - Eras            |                    | - Eras            |                              |
|      | - Compatibility   |                    | - Compatibility   |                              |
|      +-------------------+                    +-------------------+                              |
|                \                                      /                                          |
|                 \                                    /                                           |
|                  v                                  v                                            |
|              +--------------------------------------+                                            |
|              |     MERGED COUPLE ENRICHMENT        |                                            |
|              | - Combined relationships (deduped)  |                                            |
|              | - Merged events (sorted by date)    |                                            |
|              | - Both partners' eras               |                                            |
|              | - Averaged compatibility score      |                                            |
|              +--------------------------------------+                                            |
|                                                                                                  |
|   5. Builds AI prompt with:                                                                      |
|      - Couple's system_prompt_template (dual voice)                                             |
|      - User's constitutional data                                                                |
|      - Merged Neo4j enrichment                                                                   |
|                                                                                                  |
|   6. Calls Claude API for couple response                                                        |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## File Structure

```
src/profiles/
├── couples/
│   └── reaganCouple.js          # Ronald & Nancy Reagan couple profile
├── historical/
│   ├── ronaldReagan.js          # Individual Ronald Reagan profile (if exists)
│   └── nancyReagan.js           # Individual Nancy Reagan profile
└── index.js                      # Profile registry

functions/
├── guestChat/
│   └── index.js                  # Main chat handler with couple detection
├── services/
│   └── neo4jGuestService.js      # Neo4j enrichment fetcher
└── dataLoaders/
    └── loadReaganToNeo4j.js      # Loads Reagan data to Neo4j
```

---

## Couple Profile Structure

### File: `src/profiles/couples/reaganCouple.js`

```javascript
export const reaganCoupleProfile = {
  // METADATA
  profile_id: "couple_ronald_nancy_reagan",  // MUST start with "couple_"
  profile_name: "Ronald & Nancy Reagan",
  profile_type: "couple",
  profile_category: "guest",

  // PARTNER REFERENCES - Critical for Neo4j lookup
  partners: {
    person1: {
      profile_id: "historical_ronald_reagan",  // Maps to Neo4j: guest_ronald_reagan
      name: "Ronald Reagan",
      nickname: "Ronnie",
      role: "The Great Communicator"
    },
    person2: {
      profile_id: "historical_nancy_reagan",   // Maps to Neo4j: guest_nancy_reagan
      name: "Nancy Reagan",
      nickname: "Nancy",
      role: "The Devoted Heart"
    }
  },

  // RELATIONSHIP DYNAMICS
  relationship: {
    type: "married",
    years_together: "52 years (1952-2004)",
    their_love_story: "...",
    dynamic: "...",
    shared_values: [...],
    signature_interactions: [
      { type: "finishing_sentences", description: "..." },
      { type: "the_gaze", description: "..." },
      { type: "hand_holding", description: "..." }
    ]
  },

  // CONVERSATION MODE
  conversation_mode: {
    format: "dual_voice",
    turn_taking: "natural",
    leadership_triggers: {
      ronald_leads: ["politics", "optimism", "storytelling"],
      nancy_leads: ["love", "family", "protection"],
      both_together: ["their relationship", "couple advice"]
    }
  },

  // AI CONFIGURATION
  ai_config: {
    model_preference: "claude-3-opus",
    temperature: 0.8,
    system_prompt_template: `
You are both Ronald Reagan and Nancy Reagan speaking together...

CONVERSATION FORMAT:
Write responses where BOTH speak. Use their names:
**Ronald:** [His words]
**Nancy:** [Her words]
**Ronald:** [Response to Nancy]

{{USER_CONSTITUTIONAL_DATA}}
{{YOUR_LEARNED_FACTS}}
{{CONVERSATION_HISTORY}}
    `
  }
};
```

---

## Neo4j Integration for Couples

### Detection Logic (guestChat/index.js)

```javascript
// Check if this is a couple profile
const isCoupleProfile = partnerId.startsWith('couple_') && guestProfile?.partners;

if (isCoupleProfile) {
  // Get partner IDs from couple profile
  const partner1Id = guestProfile.partners?.person1?.profile_id;  // "historical_ronald_reagan"
  const partner2Id = guestProfile.partners?.person2?.profile_id;  // "historical_nancy_reagan"

  // Convert to Neo4j guest IDs
  const neo4jPartner1Id = `guest_${partner1Id.replace('historical_', '')}`;  // "guest_ronald_reagan"
  const neo4jPartner2Id = `guest_${partner2Id.replace('historical_', '')}`;  // "guest_nancy_reagan"

  // Fetch from both in parallel
  const [enrichment1, enrichment2] = await Promise.all([
    neo4jGuestService.getEnrichedGuestProfile(neo4jPartner1Id, options),
    neo4jGuestService.getEnrichedGuestProfile(neo4jPartner2Id, options)
  ]);

  // Merge the enrichment data
  neo4jEnrichment = mergeCopleEnrichment(enrichment1, enrichment2, guestProfile);
}
```

### Merged Enrichment Structure

```javascript
neo4jEnrichment = {
  isCoupleEnrichment: true,  // Flag for prompt builder

  partner1: enrichment1,     // Full enrichment from Ronald
  partner2: enrichment2,     // Full enrichment from Nancy

  // Merged relationships with attribution
  relationships: [
    { person: { name: "Margaret Thatcher" }, type: "POLITICAL_ALLY", fromPartner: "Ronald Reagan" },
    { person: { name: "Frank Sinatra" }, type: "FRIEND", fromPartner: "Nancy Reagan" },
    // ... deduplicated by person name
  ],

  // Merged events sorted chronologically
  events: [
    { title: "Wedding", year: 1952, description: "..." },
    { title: "Inaugural Address", year: 1981, description: "..." },
    // ... deduplicated by title
  ],

  // Eras kept separate per partner
  eras: {
    "Ronald Reagan": [
      { eraTitle: "Hollywood Years", years: "1937-1966", primaryFocus: "Acting" },
      { eraTitle: "Governor Years", years: "1967-1975", primaryFocus: "California" },
      { eraTitle: "White House Years", years: "1981-1989", primaryFocus: "Presidency" }
    ],
    "Nancy Reagan": [
      { eraTitle: "Hollywood Years", years: "1949-1962", primaryFocus: "Acting" },
      { eraTitle: "First Lady Years", years: "1981-1989", primaryFocus: "Just Say No" }
    ]
  },

  // Averaged compatibility
  bestMatch: {
    era: enrichment1?.bestMatch?.era || enrichment2?.bestMatch?.era,
    compatibility: Math.round((compat1 + compat2) / 2)  // e.g., 78%
  }
};
```

---

## AI Prompt Enhancement for Couples

The `buildGuestPrompt` function adds Neo4j enrichment to the AI prompt differently for couples:

### Single Profile Prompt Addition:
```
NEO4J ERA CONTEXT (Speak from this perspective):
- Era: Hollywood Years (1937-1966)
- Primary Focus: Acting and SAG Leadership
```

### Couple Profile Prompt Addition:
```
NEO4J COUPLE ENRICHMENT (Data from both partners merged):
You are speaking AS BOTH partners together. Use knowledge from both individuals.

PARTNER ERA CONTEXTS:
Partner 1 - White House Years: Leading the nation with optimism
Partner 2 - First Lady Years: Just Say No campaign and supporting Ronnie

CONSTITUTIONAL COMPATIBILITY: 78% (averaged from both partners)
User Elements: Fire 20%, Wood 15%, Water 30%, Metal 20%, Earth 15%
Insight: Good compatibility. Your experiences can guide them effectively.

YOUR COMBINED RELATIONSHIPS (Reference naturally when relevant):
- Margaret Thatcher (POLITICAL_ALLY) [via Ronald Reagan]: Iron Lady partnership
- Frank Sinatra (FRIEND) [via Nancy Reagan]: Hollywood connection
- Mikhail Gorbachev (DIPLOMATIC_PARTNER) [via Ronald Reagan]: End of Cold War

KEY EVENTS IN YOUR LIVES (Draw from these experiences):
- Wedding (1952): Small ceremony with two friends
- Inaugural Address (1981): "Government is not the solution"
- Berlin Wall Speech (1987): "Mr. Gorbachev, tear down this wall!"
```

---

## Response Format

The couple's AI response uses dual-voice format:

```
**Ronald:** *adjusts imaginary suspenders* Well now, let me tell you something about leadership...

**Nancy:** *places hand on his arm* Ronnie always did have a way with words.

**Ronald:** *squeezes her hand* That's because I married the best editor in Hollywood.

**Nancy:** *gives him "the gaze"* Oh, stop it. *turns to visitor* What he means is...
```

---

## Creating a New Couple Profile

### Step 1: Create the Couple Profile File

```javascript
// src/profiles/couples/kennedyCouple.js
export const kennedyCoupleProfile = {
  profile_id: "couple_john_jackie_kennedy",  // MUST start with "couple_"
  profile_name: "John & Jackie Kennedy",
  profile_type: "couple",

  partners: {
    person1: {
      profile_id: "historical_john_kennedy",
      name: "John F. Kennedy",
      nickname: "Jack"
    },
    person2: {
      profile_id: "historical_jackie_kennedy",
      name: "Jacqueline Kennedy",
      nickname: "Jackie"
    }
  },

  ai_config: {
    system_prompt_template: `You are both JFK and Jackie speaking together...`
  }
};
```

### Step 2: Register in Profile Index

```javascript
// src/profiles/index.js
import { kennedyCoupleProfile } from './couples/kennedyCouple';

const PROFILE_REGISTRY = {
  // ... existing profiles
  'couple_john_jackie_kennedy': kennedyCoupleProfile
};
```

### Step 3: Ensure Neo4j Data Exists

Make sure both individual partners have data in Neo4j:
- `guest_john_kennedy` - with relationships, events, eras
- `guest_jackie_kennedy` - with relationships, events, eras

The guestChat function will automatically merge them when the couple is selected.

---

## Debugging

### Console Logs to Watch

```
[Neo4j] Couple profile detected: couple_ronald_nancy_reagan
[Neo4j] Fetching data for both partners: guest_ronald_reagan, guest_nancy_reagan
[Neo4j] Partner 1 (Ronald Reagan): Found
[Neo4j] Partner 2 (Nancy Reagan): Found
[Neo4j] Combined relationships: 12
[Neo4j] Combined events: 8
[Neo4j] Avg compatibility: 78%
```

### Common Issues

1. **Neo4j data not found for a partner**
   - Check that Neo4j guest ID matches: `guest_<name>` (lowercase, underscores)
   - Verify data was loaded with `loadReaganToNeo4j.js` or similar

2. **Couple not detected**
   - Ensure `profile_id` starts with `couple_`
   - Ensure `partners` object exists with `person1` and `person2`

3. **Only one partner speaking**
   - Check `system_prompt_template` includes dual-voice instructions
   - Verify format examples show both partners with `**Name:**` markers

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/profiles/couples/reaganCouple.js` | Couple profile definition |
| `src/profiles/index.js` | Profile registry |
| `functions/guestChat/index.js` | Main handler with couple detection & Neo4j merge |
| `functions/services/neo4jGuestService.js` | Neo4j data fetcher |
| `src/pages/GuestChat.jsx` | Frontend chat interface |
| `src/components/chat/MessageList.jsx` | Message rendering |

---

## Version History

- **January 12, 2026**: Initial couple chat implementation with Neo4j merge
- **January 12, 2026**: Added dual-partner Neo4j enrichment for couple profiles

---

*Documentation for Brother Sonnet - GENESIS AstroProfile*
