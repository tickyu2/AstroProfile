# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AstroProfile is transforming from a single-user astrology calculator into **GENESIS** - a full-scale social platform for astrological profiles, compatibility matching, groups, AI conversations, and proximity search.

### Current State
The project has two codebases:
1. **React/Vite SPA** (primary, modern) - Located in `src/` directory - **ACTIVE DEVELOPMENT**
2. **Legacy HTML/Vanilla JS** - Files in root (`index.html`, `app.js`, `results.html`) - **REFERENCE ONLY**

### GENESIS Architecture

**This is the "Burj Khalifa foundation"** - built to scale from individual profiles to a multi-user social/matching platform.

**Key Documents:**
- `GENESIS_SCHEMA.md` - Complete Firestore data model with all 25 requirements
- Firebase configuration files (in development)
- Security rules for user data isolation

**Core Features (Phased):**
1. **Phase 1:** Firebase Auth (email/password) + basic profiles
2. **Phase 2:** Enhanced profiles (location, AI refinement, notes)
3. **Phase 3:** Groups, messaging, reminders
4. **Phase 4:** Compatibility matching, AI conversations, comparisons
5. **Phase 5:** Proximity search, real-time features, analytics

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### React Application Structure

**Main Components:**
- `src/App.jsx` - Root component managing state and navigation between InputForm and Results
- `src/components/InputForm.jsx` - Collects user birth data (name, sex, date, time, location, MBTI)
- `src/components/Results.jsx` - Displays comprehensive astrological profile with cosmic design
- `src/utils/calculations.js` - All astrological calculation logic (zodiac, numerology, yin/yang)

**Data Flow:**
1. User submits InputForm → data passed to App via `onSubmit` callback
2. App runs all calculations (Chinese zodiac, Western zodiac, numerology, day of week, yin/yang balance)
3. App sets state with profile data and calculations
4. Results component receives both data objects as props and renders the cosmic blueprint

### Calculations Module (`src/utils/calculations.js`)

Exports pure calculation functions:
- `calculateAge(birthDate)` - Returns years, months, days
- `getChineseZodiac(birthDate)` - Returns animal, element, yin/yang
- `getWesternZodiac(birthDate)` - Returns sun sign and element
- `getDayOfWeek(birthDate)` - Returns day, ruling planet, traits
- `calculateYinYang(chinese, western)` - Returns balance percentages and factors
- `calculateNumerology(firstName, lastName, birthDate)` - Returns life path, expression, soul urge, personal year

### Legacy System (Not Active)

The root directory contains the original implementation using vanilla JavaScript and localStorage:
- `app.js` - Profile management with localStorage persistence (ProfileManager class)
- `profileManager.js` - Handles saved profiles
- Uses sessionStorage for data transfer between pages
- Stores up to 10 profiles with full CRUD operations

## Styling

- **Framework:** Tailwind CSS with PostCSS
- **Theme:** Cosmic/space design with gradient backgrounds (blues, purples, indigos)
- **Colors:** Gold/amber accents (`#ffd700`, amber shades) for headings and highlights
- **Effects:** Backdrop blur, glow effects, hover animations, smooth transitions
- **Responsive:** Mobile-first design with grid layouts

## Data Encoding Issues

The codebase has had UTF-8 encoding issues, particularly with degree symbols (°). Recent commits address BOM removal and proper UTF-8 encoding. When editing files, ensure UTF-8 without BOM encoding is maintained.

## Chinese Zodiac Calculation Notes

- Uses simplified Chinese New Year approximation (Feb 4th cutoff)
- Births before Feb 4 use previous year for zodiac calculation
- 12-year animal cycle starting from 1900 (Rat)
- 5-element cycle: Metal, Water, Wood, Fire, Earth
- Each animal has inherent yin/yang polarity (even index = Yang, odd = Yin)

## Firebase & GENESIS Data Model

### Firestore Collections

**Primary Collections:**
- `users/{userId}` - User accounts, preferences, search settings, token usage
- `profiles/{profileId}` - All astrological profiles (with userId field for querying)
- `groups/{groupId}` - User-created groups for organizing profiles
- `messages/{messageId}` - Direct messages between users
- `comparisons/{comparisonId}` - Profile comparison history
- `sharedProfiles/{shareId}` - Publicly shared profiles with encrypted tokens

**Subcollections (under profiles):**
- `profiles/{profileId}/notes/{noteId}` - Personal notes about a profile
- `profiles/{profileId}/dailyGuidance/{date}` - Daily astrological guidance
- `profiles/{profileId}/aiConversations/{conversationId}` - AI conversation history
- `profiles/{profileId}/reminders/{reminderId}` - Keep-in-touch reminders

### Key Design Decisions

1. **Flat Structure:** Profiles are top-level with userId field (not subcollection) for easier queries
2. **Stored Calculations:** Astrological results stored in Firestore for fast reads
3. **Composite Indexes:** Enable complex queries (userId + filters + sorting)
4. **Real-time Listeners:** Use Firestore subscriptions for live updates
5. **Geohashing:** For proximity-based search (Phase 5)

### Enhanced Profile Fields (GENESIS)

Beyond basic birth data, profiles include:
- **Location:** Google Places integration, hospital-level precision, coordinates
- **Chinese Zodiac:** Year range explanation for pre-CNY births
- **Self-Description:** AI-refined text with extracted hobbies, interests, values, personality
- **Relationship Context:** Type (self, spouse, friend, etc.), groups, favorites
- **Sharing:** QR codes, encrypted tokens, shareable links
- **Statistics:** View count, share count, comparison count

### Security Rules

- User data isolation (userId filtering enforced)
- Profile ownership validation
- No cross-user data access
- Visibility settings control discoverability
- Encrypted tokens for safe sharing

See `GENESIS_SCHEMA.md` for complete data model with all fields, indexes, and design rationale.

## Future Development Plans

All features are documented in GENESIS_SCHEMA.md. Current phase: **Phase 1 (Firebase Setup)**

**Immediate Next Steps:**
- Install Firebase SDK and React Router
- Configure environment variables
- Set up Firebase Auth (email/password)
- Implement protected routes
- Create basic profile CRUD operations

**Coming Soon:**
- AI personality analysis using Anthropic SDK
- Compatibility matching algorithm
- Groups and messaging
- Proximity-based search
- Daily guidance generation
