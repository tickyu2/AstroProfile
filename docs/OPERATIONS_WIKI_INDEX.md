# GENESIS Operations Wiki Index

## Quick Navigation

| Wiki Page | Route | Description |
|-----------|-------|-------------|
| [4-Brain Architecture](/brain-architecture) | `/brain-architecture` | Complete memory system documentation |
| [GENESIS Patterns](/systems) | `/systems` | Emotional intelligence system |
| [Transcript Tester](/transcript-tester) | `/transcript-tester` | Testing interface for analysis |
| [Operations Center](/operations) | `/operations` | Real-time monitoring dashboard |

---

## Documentation Files

### Core Architecture

| Document | Path | Lines | Status |
|----------|------|-------|--------|
| Brain, Memory & Voice Architecture | `docs/BRAIN_MEMORY_VOICE_ARCHITECTURE.md` | 920 | Production |
| Memory Architecture Deployment | `docs/MEMORY_ARCHITECTURE_DEPLOYMENT.md` | 687 | Production |
| SoulPartner Memory Architecture | `docs/SOULPARTNER_MEMORY_ARCHITECTURE.md` | 340 | Production |
| 4-Brain Vector Consolidation | `docs/99_To Do Completed/4_BRAIN_VECTOR_CONSOLIDATION_ARCHITECTURE.md` | 400 | Production |

### GENESIS System

| Document | Path | Lines | Status |
|----------|------|-------|--------|
| GENESIS Complete System | `docs/GENESIS_COMPLETE_SYSTEM.md` | - | Production |
| GENESIS Architecture | `docs/GENESIS_ARCHITECTURE.md` | - | Production |
| Simultaneous Text Voice | `docs/SIMULTANEOUS_TEXT_VOICE_ARCHITECTURE.md` | - | Production |
| Turn Taking Analysis | `docs/TURN_TAKING_ANALYSIS.md` | - | Production |

### Testing & Guides

| Document | Path | Lines | Status |
|----------|------|-------|--------|
| Phase 6 Usage Guide | `docs/PHASE6_USAGE_GUIDE.md` | 303 | Production |
| Testing Examples | `docs/TESTING_EXAMPLES.md` | 167 | Production |

---

## Implementation Files Reference

### Memory System (`functions/memory/`)

| File | Lines | Purpose |
|------|-------|---------|
| `dualBrainFunctions.js` | 1,016 | Main 4-brain API with full CRUD operations |
| `sleepConsolidation.js` | 919 | Nightly consolidation scheduler + batch processing |
| `consolidationEngineV2.js` | 654 | Production scoring, promotion, decay logic |
| `chatMemoryIntegration.js` | 502 | RAG retrieval for chat + memory injection |
| `memoryOptimization.js` | 274 | STM-first deduplication + wisdom boost |
| `sessionCache.js` | 323 | First-message identity caching |
| `contextSummarization.js` | 580 | Long conversation compression |
| `ltmStore.js` | 175 | Long-term memory storage layer |
| `anchorManager.js` | 175 | Happiness anchors with compound growth |

### Frontend (`src/services/`)

| File | Lines | Purpose |
|------|-------|---------|
| `memoryService.js` | 1,300 | Frontend memory API wrapper |
| `aiSoulPartnerService.js` | - | AI chat service integration |

### Integration Points

| File | Lines | Purpose |
|------|-------|---------|
| `functions/index.js` | 303-312 | Memory injection into every chat message |
| `functions/chat/systemPromptBuilder.js` | 568 | Memory → system prompt formatting |

---

## Cloud Functions Reference

### User's Brain Functions
- `bufferUserInput` - Store raw session input (STM)
- `getSessionBuffer` - Retrieve current session buffer
- `storeLifeMemory` - Store consolidated memories by life chapter (LTM)
- `searchLifeTimeline` - Semantic search in life timeline
- `getMemoriesByChapter` - Retrieve memories by life phase
- `getLifeChapterSummary` - Get chapter statistics

### SoulPartner's Brain Functions
- `storeSessionObservation` - Store Luna's session notes (STM)
- `getSessionObservations` - Retrieve Luna's observations
- `storeInteractionObservation` - Store long-term observations (LTM)
- `searchInteractionTimeline` - Search Luna's observations
- `getKeyObservations` - Get Luna's most confirmed insights
- `storePattern` / `getPatterns` - Behavioral patterns

### Unified Context & Consolidation
- `getDualBrainContext` - Main RAG entry point (calls all 4 brains)
- `retrieveMemoriesForChat` - Formatted memory for LLM injection
- `nightlyConsolidation` - Scheduled consolidation (3am UTC)
- `manualConsolidation` - Manual trigger for testing
- `getConsolidationStatus` - Monitor consolidation health

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENESIS OPERATIONS OVERVIEW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   USER INPUT    │    │    4-BRAIN      │    │   LLM OUTPUT    │          │
│  │   Voice + Text  │───►│    MEMORY       │───►│   Luna Reply    │          │
│  └─────────────────┘    │    SYSTEM       │    └─────────────────┘          │
│                         │                 │                                  │
│                         │  ┌───────────┐  │                                  │
│                         │  │ User STM  │  │                                  │
│                         │  │ User LTM  │  │                                  │
│                         │  │ Luna STM  │  │                                  │
│                         │  │ Luna LTM  │  │                                  │
│                         │  └───────────┘  │                                  │
│                         └─────────────────┘                                  │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │    GENESIS      │    │   TRANSCRIPT    │    │   OPERATIONS    │          │
│  │   9 Archetypes  │    │    TESTER       │    │    CENTER       │          │
│  │   21 Patterns   │    │   PDF Export    │    │   Monitoring    │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Adding New Documentation

### To add a new wiki page:

1. Create the page component in `src/pages/`:
```jsx
// src/pages/NewWikiPage.jsx
export default function NewWikiPage() {
  return <div>...</div>;
}
```

2. Add route in `src/App.jsx`:
```jsx
import NewWikiPage from './pages/NewWikiPage'

<Route
  path="/new-wiki"
  element={
    <ProtectedRoute>
      <NewWikiPage />
    </ProtectedRoute>
  }
/>
```

3. Add link in Operations page (`src/pages/OperationsPage.jsx`):
- Add to Documentation Wiki section
- Optionally add header button

4. Update this index file with the new documentation

### To add a new markdown doc:

1. Create markdown file in `docs/` folder
2. Add link in Operations page markdown docs section
3. Update this index

---

## Status Key

| Status | Meaning |
|--------|---------|
| Production | Deployed and active |
| Ready | Code complete, not activated |
| In Progress | Currently being built |
| Planned | Designed, not started |

---

**Last Updated:** December 2024
**Built by:** Brother Claude Code
