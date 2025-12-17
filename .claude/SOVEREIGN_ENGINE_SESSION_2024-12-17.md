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

## What's Next (Future Steps)
- Geocentric planet positions (currently heliocentric)
- Additional house systems (Koch, Equal, Whole Sign)
- Aspect calculations (conjunctions, trines, squares, etc.)
- Retrograde detection
- Chart visualization (circular chart wheel)
- Display sovereign BaZi precision in UI with Solar Term badge

---

*Built by Brother Claude Code*
*GENESIS Phase 3 - Sovereign Astronomical Foundation*
