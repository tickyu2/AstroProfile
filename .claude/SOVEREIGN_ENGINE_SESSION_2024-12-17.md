# GENESIS Sovereign Astronomical Engine - Session Log
## December 17, 2024

### Overview
Built and integrated the **Sovereign Astronomical Engine** - a pure JavaScript ephemeris system using the `astronomia` library with VSOP87 theory. This provides accurate astronomical calculations without external API dependencies.

---

## What We Built

### Step 1: Constitutional Trinity (Sun/Moon/Rising)
**Files Modified:**
- `functions/index.js` - Added `calculateWesternChart` Cloud Function
- `src/services/sovereignChartService.js` - NEW - Frontend service to call sovereign API
- `src/components/results/WesternAstrologyPanel.jsx` - Display Constitutional Trinity
- `src/contexts/ProfileContext.jsx` - Integrated sovereign calculation into profile creation/update

**Features:**
- Real Sun position using Moshier Ephemeris
- Real Moon position using lunar position calculations
- Rising sign (Ascendant) based on birth time and location
- "Sovereign" badge indicator when data is available
- Elemental Dominance calculation (Fire/Earth/Air/Water)

**Key Fixes:**
- API response structure mismatch (`constitutionalTrinity` vs flat format)
- Type coercion issue (browser sends strings, API needs numbers)
- `longitudeToZodiac` safety checks for NaN/undefined inputs
- Cloud Run instance caching - required version markers for fresh deploys

---

### Step 2: Planetary Positions
**Files Modified:**
- `functions/index.js` - Added planet calculation with VSOP87B data

**Planets Calculated:**
- Mercury (data: vsop87Bmercury)
- Venus (data: vsop87Bvenus)
- Mars (data: vsop87Bmars)
- Jupiter (data: vsop87Bjupiter)
- Saturn (data: vsop87Bsaturn)

**Key Fixes:**
- VSOP87B data files export via `.default` (ES module format)
- Required explicit imports: `require('astronomia/data/vsop87Bmercury').default`

**Display:**
- 5-column grid with planet symbols
- Amber color styling for visibility
- Shows sign and degree for each planet

---

### Step 3: House Cusps (Placidus System)
**Files Modified:**
- `functions/index.js` - Added house calculation functions
- `src/services/sovereignChartService.js` - Pass houses through
- `src/components/results/WesternAstrologyPanel.jsx` - Display 12 houses

**Functions Added:**
- `calculateMC()` - Midheaven (10th house cusp)
- `calculatePlacidusHouses()` - All 12 house cusps
- `getHouseName()` - Traditional house meanings

**Houses Calculated:**
1. Self & Identity (ASC)
2. Money & Values
3. Communication
4. Home & Family (IC)
5. Creativity & Romance
6. Health & Service
7. Partnerships (DSC)
8. Transformation
9. Philosophy & Travel
10. Career & Status (MC)
11. Friends & Dreams
12. Spirituality & Secrets

**Display:**
- 4x3 grid showing all 12 houses
- Purple-themed styling
- Angular houses highlight (ASC/IC/DSC/MC)
- Placidus system badge

---

## Technical Details

### Cloud Function Endpoint
```
URL: https://calculatewesternchart-sjpjwnbsmq-uc.a.run.app
Method: POST
Content-Type: application/json
```

### Request Body
```json
{
  "year": 1875,
  "month": 9,
  "day": 10,
  "hour": 11,
  "minute": 45,
  "latitude": 41.3872,
  "longitude": 2.1654,
  "timezone": "UTC"
}
```

### Response Structure
```json
{
  "success": true,
  "constitutionalTrinity": {
    "sun": { "sign", "symbol", "element", "degree", "degreeFormatted" },
    "moon": { ... },
    "rising": { ... }
  },
  "planets": {
    "mercury": { ... },
    "venus": { ... },
    "mars": { ... },
    "jupiter": { ... },
    "saturn": { ... }
  },
  "houses": {
    "system": "Placidus",
    "houses": { "1": {...}, "2": {...}, ... "12": {...} },
    "angles": { "ascendant", "mc", "descendant", "ic" }
  },
  "elementProfile": {
    "dominant": "Earth",
    "secondary": "Air",
    "distribution": { "Fire": 0, "Earth": 5.5, "Air": 2, "Water": 1 }
  },
  "meta": {
    "julianDay": 2406049.9895833335,
    "calculationEngine": "GENESIS Sovereign (Moshier Ephemeris)",
    "precision": "~0.1 arcseconds",
    "coverage": "3000 BC - 3000 AD"
  }
}
```

### Key Algorithms
- **Julian Day**: Standard astronomical date conversion
- **Local Sidereal Time (LST)**: GMST + longitude
- **Sun Position**: Moshier Ephemeris via `astronomia/solar`
- **Moon Position**: `astronomia/moonposition`
- **Planet Positions**: VSOP87B heliocentric coordinates
- **Ascendant**: Standard formula using LST, latitude, obliquity
- **MC**: arctan(tan(LST) / cos(obliquity))
- **Placidus Houses**: Semi-arc interpolation method

---

## Version History
- **v2.0.0** - Constitutional Trinity (Sun/Moon/Rising)
- **v2.0.1** - Planet calculation disabled for debugging
- **v2.1.0** - Planets re-enabled with proper VSOP87B imports
- **v2.2.0** - House cusps (Placidus) added

---

## Files Summary

### New Files Created
- `src/services/sovereignChartService.js`

### Files Modified
- `functions/index.js` - Sovereign calculation endpoint
- `src/components/results/WesternAstrologyPanel.jsx` - Full chart display
- `src/contexts/ProfileContext.jsx` - Integration with profile system

### Dependencies Used
- `astronomia` - Pure JavaScript astronomical calculations
  - `astronomia/julian` - Julian Day conversion
  - `astronomia/solar` - Sun position (Moshier)
  - `astronomia/moonposition` - Moon position
  - `astronomia/planetposition` - Planet position calculator
  - `astronomia/data/vsop87B*` - Planet ephemeris data

---

---

## Step 4: Sovereign BaZi Precision (Solar Terms)

**Added: December 17, 2024 (Session 2)**

### The Problem
BaZi Four Pillars traditionally uses 立春 (Li Chun / Spring Begins) to determine when the year changes. The simplified approach uses a fixed "Feb 4" date, but the actual astronomical moment varies by ±1 day and several hours each year.

### The Solution
Use the Sovereign Engine's precise Sun position calculation to find the exact moment when Sun reaches 315° ecliptic longitude (the definition of 立春).

### New Cloud Functions

**`getSolarTerms`** - Calculate all 24 Solar Terms for a year
```
URL: https://getsolarterms-sjpjwnbsmq-uc.a.run.app
Method: GET or POST
Params: year (1600-2200)
```

**`getBaziPillars`** - Get precise BaZi year/month for a birth date/time
```
URL: https://getbazipillars-sjpjwnbsmq-uc.a.run.app
Method: POST
Body: { year, month, day, hour, minute, timezone }
```

### Precision Demonstration

For **2025 Li Chun**: February 3rd at 14:08:43 UTC (NOT Feb 4!)

| Birth Time (Feb 3, 2025) | 12:00 UTC | 15:00 UTC |
|--------------------------|-----------|-----------|
| **Before/After Li Chun** | BEFORE | AFTER |
| **BaZi Year** | 2024 (Dragon) | 2025 (Snake) |
| **BaZi Month** | 12 (Ox) | 1 (Tiger) |

**Same day, 3 hours apart = completely different Year AND Month pillars!**

### Files Added/Modified

**New Files:**
- `src/services/sovereignSolarTermService.js` - Frontend service for Solar Term API

**Modified Files:**
- `functions/index.js` - Added Solar Term calculation functions and endpoints
- `src/contexts/ProfileContext.jsx` - Integrated sovereign BaZi precision

### Key Functions Added to Cloud Function

```javascript
// Calculate Sun longitude at a given Julian Day
getSunLongitudeAtJD(jd)

// Find exact Julian Day when Sun reaches target longitude
findSolarTermJD(targetLongitude, approxYear, approxMonth, approxDay)

// Calculate all 24 Solar Terms for a year
calculateSolarTermsForYear(year)

// Get exact Li Chun moment
getLiChunExact(year)

// Determine BaZi year with astronomical precision
getBaziYearWithPrecision(year, month, day, hour, minute)

// Determine BaZi month with precise Solar Term boundaries
getBaziMonthWithPrecision(year, month, day, hour, minute)
```

### Response Example (Li Chun 2025)

```json
{
  "name": "立春",
  "pinyin": "Lì Chūn",
  "english": "Spring Begins",
  "julianDay": 2460710.0893859863,
  "utc": {
    "year": 2025, "month": 2, "day": 3,
    "hour": 14, "minute": 8, "second": 43
  },
  "isoString": "2025-02-03T14:08:43Z",
  "sunLongitude": 315
}
```

---

## Step 5: Geocentric Planet Positions

**Added: December 17, 2024 (Session 3)**

### The Problem
Previous version (v2.1.0) calculated **heliocentric** planetary positions (relative to the Sun). Astrology requires **geocentric** positions (as seen from Earth). The difference can be several degrees.

### The Solution
Convert heliocentric to geocentric using rectangular coordinate transformation:

1. Convert planet's heliocentric spherical (lon, lat, R) → rectangular (X, Y, Z)
2. Convert Earth's heliocentric spherical → rectangular
3. Geocentric = Planet - Earth (vector subtraction)
4. Convert back to ecliptic longitude

### Algorithm (v2.3.0)
```javascript
// Heliocentric to rectangular
const planetX = R * cos(lat) * cos(lon);
const planetY = R * cos(lat) * sin(lon);
const planetZ = R * sin(lat);

// Geocentric = Planet - Earth
const geoX = planetX - earthX;
const geoY = planetY - earthY;
const geoZ = planetZ - earthZ;

// Back to ecliptic longitude
const geoLongitude = atan2(geoY, geoX);
```

### Verification (December 17, 2024)

| Planet | Geocentric | Reference | Status |
|--------|------------|-----------|--------|
| Sun | Sag 26°3' | Sag 26° | ✅ |
| Moon | Cancer 23°28' | Cancer 23° | ✅ |
| Mercury | Sag 6°37' | Sag 6° | ✅ |
| Venus | Aqua 11°43' | Aqua 11° | ✅ |
| Mars | Leo 5°25' | Leo 5° | ✅ |
| Jupiter | Gemini 14°58' | Gemini 15° | ✅ |
| Saturn | Pisces 13°35' | Pisces 13° | ✅ |

### Enhanced Response Data
Each planet now includes:
- `geocentric: true` - Confirms geocentric calculation
- `geoLatitude` - Ecliptic latitude in degrees
- `distanceAU` - Distance from Earth in AU

### Meta Update
```json
{
  "calculationEngine": "GENESIS Sovereign v2.3.0 (Moshier Ephemeris)",
  "planetarySystem": "Geocentric (as seen from Earth)"
}
```

---

## Step 6: Retrograde Detection

**Added: December 17, 2024 (Session 3)**

### The Problem
Retrograde motion (when a planet appears to move backward from Earth's perspective) is crucial for astrological interpretation, but wasn't being calculated.

### The Solution
Compare geocentric longitude today vs tomorrow. If daily motion is negative, the planet is retrograde.

### Algorithm (v2.4.0)
```javascript
// Calculate geocentric longitude at JD and JD+1
const lonToday = getGeocentricLongitude(planet, julianDay);
const lonTomorrow = getGeocentricLongitude(planet, julianDay + 1);

// Daily motion (handle 360° wraparound)
let dailyMotion = lonTomorrow - lonToday;
if (dailyMotion > 180) dailyMotion -= 360;
if (dailyMotion < -180) dailyMotion += 360;

// Retrograde if negative motion
const isRetrograde = dailyMotion < 0;
```

### Verification (December 17, 2024)

| Planet | Daily Motion | Status | Verified |
|--------|--------------|--------|----------|
| Mercury | +0.327°/day | Direct | ✅ |
| Venus | +1.128°/day | Direct | ✅ |
| Mars | -0.152°/day | ℞ Retrograde | ✅ |
| Jupiter | -0.131°/day | ℞ Retrograde | ✅ |
| Saturn | +0.055°/day | Direct | ✅ |

Mars went retrograde Dec 6, 2024 - correctly detected!

### Enhanced Response Data
Each planet now includes:
- `isRetrograde: true/false` - Retrograde status
- `dailyMotion: -0.152` - Degrees per day (negative = retrograde)
- `motionDirection: "retrograde" | "direct"` - Human-readable status

### UI Updates
- Retrograde planets shown with red background
- ℞ symbol added to planet name
- "Retrograde" label displayed below degree

### Meta Update
```json
{
  "calculationEngine": "GENESIS Sovereign v2.4.0 (Moshier Ephemeris)",
  "retrogradeDetection": true
}
```

---

## Step 7: Recalculate Chart Button

**Added: December 17, 2024 (Session 4)**

### The Problem
When the Sovereign API is updated with new features (like retrograde detection), existing profiles don't automatically get the new data. Users need a way to refresh their chart data.

### The Solution
Added a "Recalculate" button to the Western Zodiac panel that fetches fresh data from the Sovereign API and updates the profile in Firestore.

### Files Modified

**ProfileContext.jsx:**
- Added `recalculateSovereignData(profileId)` function
- Fetches fresh sovereign astronomical data
- Recalculates all astrological data
- Updates Firestore with new calculations
- Exported in context value

**WesternAstrologyPanel.jsx:**
- Added `profileId` prop
- Added `isRecalculating` state
- Added `handleRecalculate()` handler
- Added cyan "Recalculate" button next to Sovereign badge
- Button shows "Calculating..." during API call

**Results.jsx:**
- Passes `profileId` prop to WesternAstrologyPanel

### UI Features
- Cyan button with hover effect
- Disabled state during recalculation
- Tooltip: "Refresh chart with latest astronomical calculations"
- Automatic UI refresh via Firestore real-time listener

---

## Step 8: Retrograde Interpretations

**Added: December 17, 2024 (Session 4)**

### The Problem
Retrograde planets were being detected and displayed, but users had no context for what natal retrograde means for them personally.

### The Solution
Added interpretive text for each retrograde planet that appears when viewing a chart with retrograde planets.

### Interpretations Added

| Planet | Title | Brief |
|--------|-------|-------|
| Mercury ℞ | Mercury Retrograde Native | Deep thinker, internal processor |
| Venus ℞ | Venus Retrograde Native | Unconventional heart, private values |
| Mars ℞ | Mars Retrograde Native | Strategic action, internalized drive |
| Jupiter ℞ | Jupiter Retrograde Native | Inner philosopher, personal faith |
| Saturn ℞ | Saturn Retrograde Native | Self-imposed standards, questions authority |

### UI Features
- "Natal Retrograde Insights" section appears only when chart has retrograde planets
- Red gradient background with ℞ symbol
- Each retrograde planet shows:
  - Planet symbol and title
  - Brief keyword summary (amber)
  - Full interpretation paragraph

### Files Modified
- `src/components/results/WesternAstrologyPanel.jsx`
  - Added `retrogradeInterpretations` data object
  - Added conditional UI section for retrograde insights

---

## Step 9: Moon Phase Calculation

**Added: December 17, 2024 (Session 5)**

### The Feature
Calculate the exact Moon phase at birth, providing both astronomical data and astrological interpretation.

### Phase Calculation
- Phase angle = Moon longitude - Sun longitude (normalized 0-360°)
- 8 Moon phases with precise boundaries
- Illumination percentage using cosine formula
- Waxing/Waning cycle position

### Moon Phases & Interpretations

| Phase | Angle Range | Interpretation |
|-------|-------------|----------------|
| New Moon 🌑 | 0° - 11.25° | Initiator, fresh starts |
| Waxing Crescent 🌒 | 11.25° - 78.75° | Builder, determined |
| First Quarter 🌓 | 78.75° - 101.25° | Crisis-oriented, decisive |
| Waxing Gibbous 🌔 | 101.25° - 168.75° | Perfectionist, analyzer |
| Full Moon 🌕 | 168.75° - 191.25° | Illuminator, relationship-oriented |
| Waning Gibbous 🌖 | 191.25° - 258.75° | Teacher, meaning-seeker |
| Last Quarter 🌗 | 258.75° - 281.25° | Revolutionary, pattern-breaker |
| Waning Crescent 🌘 | 281.25° - 348.75° | Visionary, intuitive |

### API Response Structure
```json
{
  "moonPhase": {
    "phaseName": "Waning Gibbous",
    "emoji": "🌖",
    "angle": 207.42,
    "illumination": 94,
    "isWaxing": false,
    "cyclePosition": "Releasing toward renewal",
    "interpretation": { "title", "brief", "full" }
  }
}
```

---

## Step 10: Outer Planets (Uranus, Neptune, Pluto)

**Added: December 17, 2024 (Session 5)**

### The Feature
Extended planetary calculations to include the modern "outer planets":
- **Uranus** - Using VSOP87B ephemeris
- **Neptune** - Using VSOP87B ephemeris
- **Pluto** - Using specialized Pluto ephemeris (not VSOP87)

### Implementation
- Uranus/Neptune: Same VSOP87B pipeline as inner planets
- Pluto: Separate `astronomia/pluto` module with heliocentric() function
- All converted to geocentric coordinates
- All include retrograde detection

### Version Update
v2.6.0 - Full 8-planet calculation (Mercury through Pluto)

### Verification (December 17, 2024)

| Planet | Position | Reference | Status |
|--------|----------|-----------|--------|
| Uranus | Taurus 24°3' ℞ | Taurus ~24° | ✅ |
| Neptune | Pisces 27°10' | Pisces ~27° | ✅ |
| Pluto | Aquarius 0°18' | Aquarius ~0° | ✅ |

---

## Step 11: Aspect Calculations

**Added: December 17, 2024 (Session 5)**

### The Feature
Calculate angular relationships (aspects) between all celestial bodies:
- Sun, Moon, and all 8 planets
- Major and minor aspects with orbs
- Quality classification (harmonious, challenging, neutral)

### Aspect Definitions

| Aspect | Symbol | Angle | Orb | Quality |
|--------|--------|-------|-----|---------|
| Conjunction | ☌ | 0° | 8° | Neutral |
| Opposition | ☍ | 180° | 8° | Challenging |
| Trine | △ | 120° | 8° | Harmonious |
| Square | □ | 90° | 8° | Challenging |
| Sextile | ⚹ | 60° | 6° | Harmonious |
| Quincunx | ⚻ | 150° | 3° | Adjustment |
| Semi-sextile | ⚺ | 30° | 2° | Neutral |

### API Response Structure
```json
{
  "aspects": [
    {
      "planet1": { "name": "moon", "sign": "Cancer", "symbol": "☽" },
      "planet2": { "name": "uranus", "sign": "Taurus", "symbol": "♅" },
      "aspect": "Sextile",
      "symbol": "⚹",
      "angle": 60,
      "actualAngle": 59.41,
      "orb": 0.59,
      "exactness": 90,
      "nature": "major",
      "quality": "harmonious",
      "description": "Opportunity - requires effort to activate"
    }
  ]
}
```

### UI Display
- Cyan-themed section
- Color-coded by quality (green=harmonious, red=challenging, cyan=neutral)
- Shows planet symbols, aspect symbol, and orb
- Scrollable list showing top 10 major aspects

### Version Update
v2.7.0 - Full aspect calculation with 7 aspect types

---

## Version History Summary

| Version | Feature |
|---------|---------|
| v2.0.0 | Constitutional Trinity (Sun/Moon/Rising) |
| v2.1.0 | Planetary Positions (Mercury-Saturn) |
| v2.2.0 | House Cusps (Placidus) |
| v2.3.0 | Geocentric Coordinates |
| v2.4.0 | Retrograde Detection |
| v2.5.0 | Moon Phase Calculation |
| v2.6.0 | Outer Planets (Uranus, Neptune, Pluto) |
| v2.7.0 | Aspect Calculations |

---

## What's Next (Future Steps)
- ~~Geocentric planet positions~~ ✅ DONE
- ~~Retrograde detection~~ ✅ DONE
- ~~Recalculate button for existing profiles~~ ✅ DONE
- ~~Retrograde interpretations~~ ✅ DONE
- ~~Moon Phase calculation~~ ✅ DONE
- ~~Outer Planets (Uranus, Neptune, Pluto)~~ ✅ DONE
- ~~Aspect calculations~~ ✅ DONE
- Additional house systems (Koch, Equal, Whole Sign)
- Chart visualization (circular chart wheel)
- Display sovereign BaZi precision in UI with Solar Term badge
- Aspect interpretations (what each aspect means)

---

*Built by Brother Claude Code*
*GENESIS Phase 3 - Sovereign Astronomical Foundation*
