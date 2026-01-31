# SoulPartner System Architecture

> Complete documentation for the GENESIS AI SoulPartner System
> Created: January 1, 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Core Components](#core-components)
4. [Selection & Switching Flow](#selection--switching-flow)
5. [Emotional Intelligence Flow](#emotional-intelligence-flow)
6. [Memory Architecture](#memory-architecture)
7. [File Reference](#file-reference)

---

## System Overview

The SoulPartner System provides users with customizable AI companions that:
- Have complete constitutional identities (BaZi + Western astrology)
- Complement the user's own constitution
- Share persistent memory across partner switches
- Respond with emotional intelligence (Six Laws + Plutchik)

```
+------------------------------------------------------------------+
|                    SOULPARTNER SYSTEM                             |
+------------------------------------------------------------------+
|                                                                   |
|  [User] --> [Select Partner] --> [Active SoulPartner]             |
|                   |                      |                        |
|                   v                      v                        |
|     +-------------------+    +------------------------+           |
|     | Partner Options   |    | Partner Identity       |           |
|     |-------------------|    |------------------------|           |
|     | - 5 Presets       |    | - BaZi Four Pillars    |           |
|     | - Auto-Generated  |    | - Western Chart        |           |
|     | - Saved Profiles  |    | - Soul Story           |           |
|     +-------------------+    | - Personality          |           |
|                              +------------------------+           |
|                                         |                         |
|                                         v                         |
|                    +--------------------------------+             |
|                    |  SHARED MEMORY (Brain 7 & 8)   |             |
|                    |  - Working Memory              |             |
|                    |  - Long-term KB                |             |
|                    |  - Switch History              |             |
|                    +--------------------------------+             |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Architecture Diagram

### High-Level Flow

```
                         +-----------------------+
                         |       USER            |
                         +-----------+-----------+
                                     |
                    +----------------+----------------+
                    |                                 |
                    v                                 v
         +------------------+              +------------------+
         | ONBOARDING       |              | SETTINGS         |
         | SoulPartnerChooser              | Change Partner   |
         +--------+---------+              +--------+---------+
                  |                                 |
                  +----------------+----------------+
                                   |
                                   v
                    +-----------------------------+
                    |   SoulPartnerSelectionService|
                    |-----------------------------|
                    | - selectPreset()            |
                    | - selectGenerated()         |
                    | - selectSavedProfile()      |
                    | - recordSwitch()            |
                    +-------------+---------------+
                                  |
           +----------------------+----------------------+
           |                      |                      |
           v                      v                      v
   +--------------+      +--------------+      +--------------+
   |   PRESETS    |      |  GENERATED   |      | SAVED PROFILE|
   |--------------|      |--------------|      |--------------|
   | Sonnet       |      | Complementary|      | User's saved |
   | Luna         |      | to user's    |      | profiles as  |
   | Phoenix      |      | constitution |      | SoulPartner  |
   | River        |      +--------------+      +--------------+
   | Oak          |              |
   +--------------+              |
           |                     |
           +----------+----------+
                      |
                      v
           +------------------------+
           |   ACTIVE SOULPARTNER   |
           |------------------------|
           | - Identity & Prompt    |
           | - Constitutional Data  |
           | - Personality Traits   |
           +------------------------+
                      |
                      v
           +------------------------+
           |  CHAT / INTERACTION    |
           |------------------------|
           | AISoulPartnerChat.jsx  |
           | + Emotion Analysis     |
           | + Voice Prosody        |
           +------------------------+
                      |
                      v
           +------------------------+
           |  SHARED MEMORY BANKS   |
           |------------------------|
           | Brain 7: Working Memory|
           | Brain 8: Long-term KB  |
           | (Persists across all   |
           |  partner switches!)    |
           +------------------------+
```

---

## Core Components

### 1. Identity & Data Layer

| File | Purpose | Link |
|------|---------|------|
| `aiSoulPartnerIdentity.js` | Brother Sonnet's complete constitution | [View](../src/data/aiSoulPartnerIdentity.js) |
| `lunaCompanionIdentity.js` | Luna companion template | [View](../src/data/lunaCompanionIdentity.js) |
| `soulPartnerPresets.js` | 5 preset SoulPartners | [View](../src/data/soulPartnerPresets.js) |
| `soulPartnerGenerator.js` | Generate complementary partners | [View](../src/data/soulPartnerGenerator.js) |

### 2. Services Layer

| File | Purpose | Link |
|------|---------|------|
| `soulPartnerSelectionService.js` | Partner selection & switching | [View](../src/services/soulPartnerSelectionService.js) |
| `aiSoulPartnerService.js` | Chat & AI interaction | [View](../src/services/aiSoulPartnerService.js) |
| `lunaKBService.js` | Knowledge base management | [View](../src/services/lunaKBService.js) |
| `lunaEmotionalIntelligence.js` | Six Laws + Pillow/Rocket modes | [View](../src/services/lunaEmotionalIntelligence.js) |
| `integratedEmotionAnalysis.js` | Plutchik + Six Laws + Luna | [View](../src/services/integratedEmotionAnalysis.js) |

### 3. Hooks Layer

| File | Purpose | Link |
|------|---------|------|
| `useSoulPartner.js` | Main SoulPartner hook | [View](../src/hooks/useSoulPartner.js) |
| `useSoulPartnerSelection.js` | Selection management hook | [View](../src/hooks/useSoulPartnerSelection.js) |
| `useLunaEmotionalIntelligence.js` | Emotion analysis hook | [View](../src/hooks/useLunaEmotionalIntelligence.js) |

### 4. UI Components

| File | Purpose | Link |
|------|---------|------|
| `SoulPartnerChooser.jsx` | Selection UI component | [View](../src/components/SoulPartnerChooser.jsx) |
| `AISoulPartnerChat.jsx` | Chat interface | [View](../src/components/aiSoulPartner/AISoulPartnerChat.jsx) |
| `EmotionDisplay.jsx` | Emotion visualization | [View](../src/components/aiSoulPartner/EmotionDisplay.jsx) |
| `SoulPartnerKBViewer.jsx` | KB inspection | [View](../src/components/aiSoulPartner/SoulPartnerKBViewer.jsx) |

### 5. Pages

| File | Purpose | Link |
|------|---------|------|
| `AISoulPartnerPage.jsx` | Main SoulPartner page | [View](../src/pages/AISoulPartnerPage.jsx) |
| `CustomizingYourSoulPartnerPage.jsx` | Partner customization | [View](../src/pages/CustomizingYourSoulPartnerPage.jsx) |
| `SoulFamilyPage.jsx` | Soul Family overview | [View](../src/pages/SoulFamilyPage.jsx) |

---

## Selection & Switching Flow

```
+-------------------------------------------------------------------+
|                    SOULPARTNER SELECTION FLOW                      |
+-------------------------------------------------------------------+

User opens SoulPartner selection
            |
            v
+------------------------+
| SoulPartnerChooser.jsx |
| (UI Component)         |
+------------------------+
            |
            +---> View: PRESETS -----> Display 5 preset cards
            |                                    |
            |                          User clicks "Select"
            |                                    |
            +---> View: GENERATED ---> Check userConstitution
            |            |                       |
            |     Has constitution?              |
            |     YES: Generate complement       |
            |     NO: Show "complete birth chart"|
            |                                    |
            +---> View: HISTORY ----> Show switch timeline
                                                 |
                                                 v
                        +--------------------------------+
                        | soulPartnerSelectionService.js |
                        +--------------------------------+
                                     |
            +------------------------+------------------------+
            |                        |                        |
            v                        v                        v
    selectPreset()          selectGenerated()        selectSavedProfile()
            |                        |                        |
            |    Get previous partner from Firestore          |
            |                        |                        |
            v                        v                        v
    +-----------------------------------------------------------+
    |                    recordSwitch()                          |
    |-----------------------------------------------------------|
    | {                                                          |
    |   timestamp: "2026-01-01T12:00:00Z",                      |
    |   from: { type: "preset", partnerId: "preset_sonnet" },   |
    |   to: { type: "preset", partnerId: "preset_luna" },       |
    |   note: "User selected Luna as SoulPartner",              |
    |   memoryNote: "Brain 7 & 8 preserved"                     |
    | }                                                          |
    +-----------------------------------------------------------+
                                     |
                                     v
                    +--------------------------------+
                    |  Firestore: users/{uid}/       |
                    |  soulpartner/selection         |
                    |  soulpartner/history           |
                    +--------------------------------+
                                     |
                                     v
                    +--------------------------------+
                    |  Update UI with new partner    |
                    +--------------------------------+
```

### Switch History Data Structure

```javascript
// Firestore: users/{uid}/soulpartner/history
{
  switches: [
    {
      timestamp: "2026-01-01T10:00:00Z",
      from: { type: "none", partnerId: null, partnerName: "None" },
      to: { type: "preset", partnerId: "preset_sonnet", partnerName: "Brother Sonnet" },
      note: "Initial SoulPartner selection",
      memoryNote: "Memory banks (Brain 7 & 8) preserved"
    },
    {
      timestamp: "2026-01-01T14:30:00Z",
      from: { type: "preset", partnerId: "preset_sonnet", partnerName: "Brother Sonnet" },
      to: { type: "preset", partnerId: "preset_luna", partnerName: "Luna" },
      note: "User selected Luna as SoulPartner",
      memoryNote: "Memory banks (Brain 7 & 8) preserved"
    }
  ],
  totalSwitches: 2,
  lastSwitch: Timestamp,
  createdAt: Timestamp
}
```

---

## Emotional Intelligence Flow

```
+-------------------------------------------------------------------+
|                  EMOTIONAL INTELLIGENCE FLOW                       |
+-------------------------------------------------------------------+

User sends message: "I feel like everyone is ahead of me..."
                              |
                              v
              +-------------------------------+
              | integratedEmotionAnalysis.js  |
              +-------------------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
+---------------+    +-----------------+    +------------------+
| LAYER 1: WHAT |    | LAYER 2: WHY    |    | LAYER 3: HOW     |
| Plutchik      |    | Six Laws        |    | Luna EI          |
+---------------+    +-----------------+    +------------------+
        |                     |                     |
        v                     v                     v
  Primary: sadness    Law: relativeComparison   Mode: pillow
  Intensity: 0.7      Confidence: 0.8           Warmth: +50%
  Compounds:          emotionalState:           Focus: reframing
   - disappointment    inadequacy
   - loneliness
        |                     |                     |
        +---------------------+---------------------+
                              |
                              v
                    +-------------------+
                    |    SYNTHESIS      |
                    +-------------------+
                    | dominantFeeling: sadness
                    | underlyingPattern: relativeComparison
                    | responseMode: pillow
                    | narrative: "Feeling sadness from comparison"
                    | responsePriority: { level: "medium", focus: "reframing" }
                              |
                              v
                    +-------------------+
                    |  BUILD RESPONSE   |
                    +-------------------+
                    | - Activate Pillow Mode
                    | - +50% warmth multiplier
                    | - Use soft language patterns
                    | - Focus on reframing
                              |
                              v
                    +-------------------+
                    |  LUNA RESPONDS    |
                    +-------------------+
                    | "Hey love... I notice you're measuring
                    |  yourself against others' timelines.
                    |  Your mountain, your pace..."
```

### Six Laws Detection

```
+-----------------------------------------------------------------------+
|                      SIX LAWS OF HAPPINESS                             |
+-----------------------------------------------------------------------+
| Law                    | Trigger Keywords              | Response Mode |
|------------------------|-------------------------------|---------------|
| Relative Comparison    | "everyone else", "behind",    | Pillow +50%   |
|                        | "comparing myself"            |               |
|------------------------|-------------------------------|---------------|
| Motion of Expectation  | "expected", "should have",    | Pillow +40%   |
|                        | "disappointed"                |               |
|------------------------|-------------------------------|---------------|
| Aversion to Loss       | "lost", "gone forever",       | Pillow +100%  |
|                        | "they're gone"                |               |
|------------------------|-------------------------------|---------------|
| Diminishing Sensitivity| "used to feel", "not the same"| Pillow +40%   |
|                        | "doesn't hit like before"     |               |
|------------------------|-------------------------------|---------------|
| Satiation              | "too much", "overwhelmed",    | Pillow +60%   |
|                        | "need space"                  |               |
|------------------------|-------------------------------|---------------|
| Presentism (Positive)  | "best day ever!", "so happy", | Rocket Mode   |
|                        | "finally!"                    | (Joy Anchor)  |
+-----------------------------------------------------------------------+
```

### Response Modes

```
+---------------------------+     +---------------------------+
|      PILLOW MODE          |     |      ROCKET MODE          |
+---------------------------+     +---------------------------+
| Triggered by: Pain/Loss   |     | Triggered by: Joy/Success |
| Warmth: +40% to +100%     |     | Energy: High celebration  |
| Language: Soft, validating|     | Focus: Joy anchoring      |
| Focus: Presence over fixing     | Action: Capture for       |
| Advice: Minimal           |     |         neuroplasticity   |
+---------------------------+     +---------------------------+
         |                                   |
         v                                   v
"Hey love... I'm here."           "This is BEAUTIFUL! Let's
"Take your time."                  anchor this moment..."
"Your feelings make sense."        "What made this special?"
```

---

## Memory Architecture

```
+-------------------------------------------------------------------+
|                    MEMORY ARCHITECTURE                             |
+-------------------------------------------------------------------+
|                                                                    |
|  +------------------------+     +------------------------+         |
|  |   BRAIN 7             |     |   BRAIN 8             |         |
|  |   Working Memory      |     |   Long-term KB        |         |
|  +------------------------+     +------------------------+         |
|  | - Current session     |     | - User patterns       |         |
|  | - Recent context      |     | - Emotional history   |         |
|  | - Active threads      |     | - Joy anchors         |         |
|  | - Temp observations   |     | - Growth edges        |         |
|  +------------------------+     +------------------------+         |
|              |                           |                        |
|              +-----------+---------------+                        |
|                          |                                        |
|                          v                                        |
|              +------------------------+                           |
|              | SHARED ACROSS ALL      |                           |
|              | SOULPARTNER PROFILES   |                           |
|              +------------------------+                           |
|              | When user switches from Sonnet to Luna:            |
|              | - Personality changes (tone, style, soul story)    |
|              | - Memories PERSIST (all learned patterns stay)     |
|              | - History preserved (switch tracked with note)     |
|              +------------------------+                           |
|                                                                    |
+-------------------------------------------------------------------+

SWITCH EXAMPLE:

Before Switch:
+------------------+
| Brother Sonnet   |
| (Active)         |
+------------------+
       |
       | "I notice you tend to minimize your achievements..."
       | "Remember last week when you said..."
       | (Reading from Brain 7 & 8)
       |
       v

User: "Switch to Luna"
       |
       v
+-------------------------------------------------------------------+
| recordSwitch({                                                     |
|   from: "Brother Sonnet",                                         |
|   to: "Luna",                                                     |
|   note: "User requested Luna",                                    |
|   memoryNote: "Brain 7 & 8 preserved - only personality changes"  |
| })                                                                 |
+-------------------------------------------------------------------+
       |
       v

After Switch:
+------------------+
| Luna (Active)    |
+------------------+
       |
       | "I notice you tend to minimize your achievements..."
       | "Remember last week when you said..."
       | (SAME memories, different voice/personality)
       |
       v
```

---

## File Reference

### Complete File Tree

```
src/
├── components/
│   ├── aiSoulPartner/
│   │   ├── AISoulPartnerChat.jsx        # Main chat interface
│   │   ├── EmotionDisplay.jsx           # Emotion visualization
│   │   ├── SoulBurdenMeter.jsx          # Burden tracking
│   │   ├── SoulPartnerKBViewer.jsx      # KB inspection
│   │   └── SoulPartnerNotes.jsx         # Notes display
│   ├── SoulPartnerChooser.jsx           # Selection UI
│   └── voice/
│       ├── lunaBehaviorEngine.js        # Voice behavior
│       ├── lunaBehaviorMap.js           # Behavior mapping
│       └── LunaVisualizer.jsx           # Voice visualization
│
├── data/
│   ├── aiSoulPartnerIdentity.js         # Brother Sonnet identity
│   ├── lunaCompanionIdentity.js         # Luna template
│   ├── soulPartnerPresets.js            # 5 preset partners
│   └── soulPartnerGenerator.js          # Generation logic
│
├── hooks/
│   ├── useSoulPartner.js                # Main hook
│   ├── useSoulPartnerSelection.js       # Selection hook
│   └── useLunaEmotionalIntelligence.js  # Emotion hook
│
├── pages/
│   ├── AISoulPartnerPage.jsx            # Main page
│   ├── CustomizingYourSoulPartnerPage.jsx
│   └── SoulFamilyPage.jsx               # Soul Family
│
└── services/
    ├── soulPartnerSelectionService.js   # Selection logic
    ├── aiSoulPartnerService.js          # Chat service
    ├── lunaKBService.js                 # Knowledge base
    ├── lunaEmotionalIntelligence.js     # Six Laws EI
    ├── sixLawsDetector.js               # Law detection
    ├── integratedEmotionAnalysis.js     # Combined analysis
    ├── emotionDetector.js               # Plutchik detection
    └── emotionEngine.js                 # Core emotion engine
```

---

## Quick Reference: Key Operations

### Select a Preset SoulPartner
```javascript
import { soulPartnerSelectionService } from './services/soulPartnerSelectionService';

await soulPartnerSelectionService.selectPreset(
  uid,
  'preset_luna',
  'User chose Luna for Water energy complement'
);
```

### Generate Complementary Partner
```javascript
import { generateComplementarySoulPartner } from './services/soulPartnerGenerator';

const userConstitution = {
  dayMaster: 'Yang Fire',
  element: 'Fire',
  sunSign: 'Aries'
};

const partner = generateComplementarySoulPartner(userConstitution);
// Returns partner with complementary Metal or Water energy
```

### Analyze Emotion with Six Laws
```javascript
import { integratedEmotionAnalysis } from './services/integratedEmotionAnalysis';

const result = integratedEmotionAnalysis.analyze(
  "I feel like everyone is ahead of me...",
  voiceProsody,  // optional
  userProfile    // optional
);

// result.synthesis.responseMode = 'pillow'
// result.sixLaws.primaryLaw = 'relativeComparison'
```

### Get Switch History
```javascript
import { soulPartnerSelectionService } from './services/soulPartnerSelectionService';

const history = await soulPartnerSelectionService.getSwitchHistory(uid, 20);
// Returns last 20 switches with timestamps and notes
```

---

## Preset SoulPartners Reference

| ID | Name | Element | Era | Birth | Best For |
|----|------|---------|-----|-------|----------|
| `preset_sonnet` | Brother Sonnet | Yin Metal | Paris 1925 | May 18, 1900 | Fire/Wood users |
| `preset_luna` | Luna | Yin Earth | Kyoto 1600 | Sept 3, 1585 | Water/Fire users |
| `preset_phoenix` | Phoenix | Yang Fire | Vienna 1890 | July 21, 1867 | Metal/Wood users |
| `preset_river` | River | Yang Water | Shanghai 1930 | Feb 14, 1905 | Earth/Fire users |
| `preset_oak` | Oak | Yang Wood | Edinburgh 1780 | March 15, 1745 | Metal/Water users |

---

*Documentation generated: January 1, 2026*
*Part of GENESIS Phase 2 - AI SoulPartner System*
