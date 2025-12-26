# AI Coding Agent Instructions for AstroProfile/GENESIS

## Project Overview
**AstroProfile** is evolving into **GENESIS** - a React + Firebase social platform for astrological profiles, AI-powered compatibility matching, and constitutional intelligence. The codebase blends spiritual/astrological domain knowledge with modern web architecture.

**Current Phase**: Multi-feature active development (Auth, Profiles, AI Chat, Voice, Compatibility)

---

## Architecture & Data Flow

### Frontend (React 18 + Vite)
- **Entry**: `src/App.jsx` - Route hub with nested Context providers
- **Key Patterns**:
  - **Context Providers** (always nested in App): `AuthProvider` → `ProfileProvider` → `KnowledgeBaseProvider` → `ConversationsProvider`
  - **Pages** in `src/pages/` (major features) + **Components** in `src/components/` (reusable UI)
  - **Context hooks**: `useAuth()`, `useProfiles()`, `useKnowledgeBase()`, `useConversations()` - use these instead of direct Context consumption
  - **Custom hooks** in `src/hooks/` - `useConstitutionalIntelligence()`, `useSoulPartner()`, `useVoice()`

### Backend (Firebase + Cloud Functions)
- **Firebase Config**: `src/config/firebase.js` - all Firebase service exports (auth, db, storage, realtimeDb)
- **Cloud Functions**: `functions/index.js` + modular subdirectories
  - Main export: `aiSoulPartnerChat` - secure Claude API proxy with Constitutional Intelligence
  - Pattern: Use `onRequest()` for HTTP, `onCall()` for callable functions
  - Auth check: Always validate user in functions via `admin.auth().verifyIdToken()`
  - Example: `functions/voice/voiceFunctions.js`, `functions/chat/systemPromptBuilder.js`

### Data Model (Firestore)
- **Top-level collections**: `users/`, `profiles/`, `groups/`, `messages/`, `comparisons/`, `sharedProfiles/`
- **Subcollections**: `profiles/{id}/notes/`, `profiles/{id}/aiConversations/`, `profiles/{id}/reminders/`
- **Key design**: Profiles are NOT subcollections (flat structure enables efficient queries by userId)
- **Composite indexes**: Required for queries like `userId + filters + sorting` - Firebase will prompt in console when needed

---

## Critical Workflows & Commands

### Development
```bash
npm run dev        # Start Vite dev server (port 5173)
npm run build      # Build for production
npm run lint       # Run ESLint on codebase
npm run preview    # Preview production build locally
```

### Firebase Deployment
```bash
# Deploy Cloud Functions (from workspace root)
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules

# View function logs
firebase functions:log --project=astroprofile-391e6
```

### Environment Variables
- **Frontend** (`src/` files): Use `import.meta.env.VITE_*` - defined in `.env.local`
- **Backend** (`functions/` files): Use `process.env.*` - defined in `functions/.env`
- **Critical vars**: Firebase config, Anthropic API key, Google Generative AI key
- **Security**: Never commit `.env` or `.env.local` - validate in code before use

---

## Project-Specific Patterns

### 1. **Constitutional Identity Framework**
Every user profile includes astro-spiritual DNA derived from:
- **Chinese Zodiac (BaZi)**: Year, month, day, hour pillars → element + yin/yang polarity
- **Western Zodiac**: Sun sign + element + modality
- **MBTI**: Cognitive function preferences (mapped from BaZi)
- **Yin/Yang balance**: Percentage polarity affecting interaction style

**Key files**: `src/utils/calculations.js` (pure calculation functions), `src/services/sovereignChartService.js` (profile enrichment)

### 2. **AI Response Modes (Constitutional Intelligence)**
Claude (the "SoulPartner") has 3 context-sensitive modes - detected in `functions/chat/systemPromptBuilder.js`:
- **WITNESS mode**: User in emotional distress → hold space, validate, NO solutions
- **DIALOGUE mode**: User exploring ideas → ask questions, collaborate
- **GUIDANCE mode**: User asks for help → provide structured frameworks

**Pattern**: Build system prompts dynamically based on user's constitutional nature and conversation context. See `functions/chat/systemPromptBuilder.js` for implementation.

### 3. **Memory Architecture (5 Types)**
Persistent across sessions via Firestore + PostgreSQL:
- `/identity/` - Constitutional blueprint
- `/soul_burdens/` - Emotional patterns
- `/getting_to_know_me/` - Personal revelations
- `/pattern_recognition/` - What interaction style works
- `/evolution_tracking/` - Growth journey

**Key service**: `src/services/memoryService.js` + `functions/memory/chatMemoryIntegration.js`

### 4. **API Service Pattern**
Frontend services (e.g., `src/services/claudeApiService.js`) call Cloud Functions:
```javascript
// Frontend service
async generateInsights(profile) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, /* ... */ })
  });
  return response.json();
}

// Vite proxies /api/claude → Cloud Function
// Cloud Function calls Anthropic API securely
```

**Why**: Protects API keys, enables rate limiting, adds server-side intelligence.

### 5. **Voice Integration (Real-time)**
- `src/hooks/useVoice.js` - Frontend voice capture/playback
- `functions/voice/voiceFunctions.js` - Cloud Functions for session management
- `functions/voice/elevenLabsService.js` - Text-to-speech proxy
- **Real-time listeners** via Firestore to sync voice state across tabs

### 6. **Knowledge Base System**
- `src/contexts/KnowledgeBaseContext.jsx` - User-curated documents
- **Categories**: GENESIS Overview, Technical, Personal, Constitutional, Reference
- **Priority ranking**: Critical documents marked "Always Include" for token efficiency
- Used by Claude to personalize responses (dynamic knowledge base injection)

### 7. **Component Styling Convention**
- **Framework**: TailwindCSS with PostCSS
- **Theme**: Cosmic design (blues, purples, golds) + gradient backgrounds
- **Effects**: Backdrop blur, glow, smooth transitions
- **Files**: Config in `tailwind.config.js`, global in `src/index.css`

---

## Integration Points & Dependencies

### External Services
- **Firebase**: Auth, Firestore (DB), Cloud Functions, Storage
- **Anthropic Claude API**: Via `@anthropic-ai/sdk` in Cloud Functions
- **Google Generative AI**: Gemini for image generation (`@google/generative-ai`)
- **Mapbox GL**: Location picker (`@mapbox/mapbox-gl-geocoder`)
- **ElevenLabs**: Text-to-speech voice synthesis
- **Tavily AI**: Web search integration

### Key NPM Dependencies
- `react` 18, `vite` - Frontend tooling
- `firebase` - Backend services
- `react-router-dom` - Routing
- `tailwindcss` + `postcss` - Styling
- `framer-motion`, `react-spring`, `gsap` - Animations
- `recharts` - Data visualization
- `three` + `@react-three/fiber` - 3D rendering
- `lunar-javascript` - Chinese lunar calendar calculations

---

## Common Development Tasks

### Adding a New Profile Feature
1. Add Firestore field to profile schema (check `!TheGreatCosmicArchives/GENESIS_SCHEMA.md`)
2. Add calculation logic to `src/utils/calculations.js`
3. Add UI component to `src/components/`
4. Connect via `useProfiles()` context hook
5. Validate in Cloud Function if user-submitted

### Adding AI SoulPartner Capability
1. Update system prompt in `functions/chat/systemPromptBuilder.js`
2. Add context building logic if needed
3. Store conversation in Firestore via `ConversationsProvider`
4. Add Knowledge Base document if domain-specific
5. Test with different constitutional types

### Deploying a Cloud Function
1. Edit function in `functions/` (modular subdirs encouraged)
2. Run `firebase deploy --only functions`
3. Check logs: `firebase functions:log`
4. Test with Frontend via imported function calls

---

## Code Quality & Conventions

### File Organization
- **Pure functions** (`src/utils/*.js`): No side effects, export named functions
- **Services** (`src/services/*.js`): Business logic with external dependencies
- **Contexts** (`src/contexts/*.jsx`): State management + provider pattern
- **Hooks** (`src/hooks/*.js`): Reusable logic abstractions
- **Components** (`src/components/*.jsx`): UI only, use hooks for state
- **Pages** (`src/pages/*.jsx`): Full-page components with routing

### Error Handling
- Frontend: Try/catch in async functions, user feedback via toast/modal
- Cloud Functions: Throw `HttpsError` with specific error codes for client handling
- Validation: Check environment variables at startup (Firebase service export does this)

### Async Patterns
- Use `async/await` (not `.then()`)
- Always handle errors in async contexts
- Use Firestore listeners for real-time data (`onSnapshot()`)
- Consider unsubscribe cleanup in useEffect for listeners

### Testing
- **Current practice**: Not documented in CLAUDE.md - focus on manual testing via UI + Cloud Function logs
- **Recommendation**: When adding critical logic, add console logs for debugging

---

## When Uncertain, Reference These Files

| Task | File |
|------|------|
| Add calculation | `src/utils/calculations.js` |
| AI response logic | `functions/chat/systemPromptBuilder.js` |
| User data flow | `src/contexts/ProfileContext.jsx` |
| Voice features | `src/hooks/useVoice.js` + `functions/voice/voiceFunctions.js` |
| API calls | `src/services/claudeApiService.js` or similar service |
| Styling | `tailwind.config.js` + existing component examples |
| Firestore queries | `src/contexts/*.jsx` for patterns |

---

## Known Challenges & Solutions

1. **UTF-8 Encoding**: Remove BOM when editing files. Use UTF-8 without BOM.
2. **Chinese Zodiac Accuracy**: Uses Li Chun (Feb 4) boundary, not lunar new year. See `src/utils/chineseZodiacMathematical.js`.
3. **CORS & API Keys**: Frontend never calls external APIs directly - proxy through Cloud Functions.
4. **Real-time Sync**: Use Firestore listeners, not polling. Unsubscribe in cleanup.
5. **Timezone Handling**: Birth times stored in local timezone. Service: `src/services/timezoneService.js`.

---

## AI Agent Best Practices for This Codebase

- **Read CLAUDE.md first** (`!TheGreatCosmicArchives/CLAUDE.md`) - living documentation of architecture
- **Preserve constitutional framing** - when adding features, consider how they honor user's elemental nature
- **Check existing services** before creating new ones - avoid duplication
- **Test with real Firebase project** - mock Firebase in dev if needed, but production tests require real service
- **Document domain knowledge** - astrology/BaZi concepts should have comments explaining "why"
- **Keep Cloud Functions modular** - use subdirectories + require() for organization
- **Validate user context** - always verify userId in multi-user operations

---

**Last Updated**: December 21, 2025  
**GENESIS Phase**: 2 (Active Development)  
**Built by**: Brother Claude Code (Yin Wood Pig)
