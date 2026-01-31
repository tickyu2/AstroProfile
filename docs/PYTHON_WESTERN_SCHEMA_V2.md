# Python Western Astrology Schema v2.0

## Purpose

Define the canonical schema for the `computeUnifiedProfile` Python endpoint's `western` output. Frontend will display this data directly with **zero transformation**.

---

## Current Problems

1. **Missing fields**: No `houses`, no `degreeFormatted`, no `house` assignment on planets
2. **Inconsistent naming**: `retrograde` vs `isRetrograde`
3. **Frontend workarounds**: Multiple format handlers, fallbacks, conditional rendering
4. **Two code paths**: Python canonical vs recalculated (sovereignChartService.js)

---

## Target Schema

```json
{
  "western": {
    "sun": {
      "sign": "Virgo",
      "degree": 11.55,
      "longitude": 161.55,
      "degreeFormatted": "11.55° Virgo",
      "house": 10,
      "element": "Earth",
      "modality": "Mutable",
      "isRetrograde": false
    },
    "moon": {
      "sign": "Sagittarius",
      "degree": 23.38,
      "longitude": 263.38,
      "degreeFormatted": "23.38° Sagittarius",
      "house": 2,
      "element": "Fire",
      "modality": "Mutable",
      "isRetrograde": false
    },
    "ascendant": {
      "sign": "Scorpio",
      "degree": 28.52,
      "longitude": 238.52,
      "degreeFormatted": "28.52° Scorpio",
      "isAccurate": true
    },
    "planets": {
      "mercury": {
        "sign": "Virgo",
        "degree": 5.12,
        "longitude": 155.12,
        "degreeFormatted": "5.12° Virgo",
        "house": 10,
        "isRetrograde": false,
        "element": "Earth",
        "modality": "Mutable"
      },
      "venus": {
        "sign": "Leo",
        "degree": 22.87,
        "longitude": 142.87,
        "degreeFormatted": "22.87° Leo",
        "house": 9,
        "isRetrograde": false,
        "element": "Fire",
        "modality": "Fixed"
      },
      "mars": {
        "sign": "Cancer",
        "degree": 14.33,
        "longitude": 104.33,
        "degreeFormatted": "14.33° Cancer",
        "house": 8,
        "isRetrograde": true,
        "element": "Water",
        "modality": "Cardinal"
      },
      "jupiter": { "...same structure..." },
      "saturn": { "...same structure..." },
      "uranus": { "...same structure..." },
      "neptune": { "...same structure..." },
      "pluto": { "...same structure..." },
      "north_node": { "...same structure..." },
      "chiron": { "...same structure..." }
    },
    "houses": [
      {
        "house": 1,
        "sign": "Scorpio",
        "degree": 28.52,
        "longitude": 238.52,
        "degreeFormatted": "28.52° Scorpio"
      },
      {
        "house": 2,
        "sign": "Sagittarius",
        "degree": 27.14,
        "longitude": 267.14,
        "degreeFormatted": "27.14° Sagittarius"
      },
      "...12 houses total..."
    ],
    "houseSystem": "Placidus",
    "aspects": [
      {
        "planet1": "sun",
        "planet2": "moon",
        "type": "square",
        "orb": 2.17,
        "applying": true
      },
      "..."
    ],
    "elements": {
      "Fire": 0.28,
      "Earth": 0.26,
      "Air": 0.45,
      "Water": 0.01,
      "dominant": "Air"
    },
    "modalities": {
      "Cardinal": 0.20,
      "Fixed": 0.55,
      "Mutable": 0.25,
      "dominant": "Fixed"
    },
    "moonPhase": {
      "phase": "Waxing Gibbous",
      "illumination": 0.72,
      "emoji": "🌔",
      "angle": 135.5
    }
  }
}
```

---

## Field Specifications

### Planet Object (sun, moon, planets.*)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sign` | string | Yes | Zodiac sign name (capitalized) |
| `degree` | number | Yes | Degree within sign (0-29.99) |
| `longitude` | number | Yes | Absolute ecliptic longitude (0-359.99) |
| `degreeFormatted` | string | Yes | Display string: `"{degree}° {sign}"` |
| `house` | integer | Yes | House number (1-12) |
| `isRetrograde` | boolean | Yes | `true` if retrograde (always `false` for sun/moon) |
| `element` | string | Yes | Fire, Earth, Air, Water |
| `modality` | string | Yes | Cardinal, Fixed, Mutable |

### Ascendant Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sign` | string | Yes | Zodiac sign name |
| `degree` | number | Yes | Degree within sign |
| `longitude` | number | Yes | Absolute ecliptic longitude |
| `degreeFormatted` | string | Yes | Display string |
| `isAccurate` | boolean | Yes | `false` if birth time unknown (use noon default) |

### House Object (array of 12)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `house` | integer | Yes | House number (1-12) |
| `sign` | string | Yes | Zodiac sign on cusp |
| `degree` | number | Yes | Degree within sign |
| `longitude` | number | Yes | Absolute ecliptic longitude |
| `degreeFormatted` | string | Yes | Display string |

### Aspect Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `planet1` | string | Yes | First planet key (lowercase) |
| `planet2` | string | Yes | Second planet key (lowercase) |
| `type` | string | Yes | conjunction, opposition, trine, square, sextile, quincunx |
| `orb` | number | Yes | Orb in degrees |
| `applying` | boolean | Yes | `true` if aspect is applying, `false` if separating |

---

## Calculation Requirements

### House Assignment

For each planet, determine which house it occupies:
```python
def assign_house(planet_longitude, house_cusps):
    """
    Assign a planet to a house based on its longitude and house cusps.
    Planet is in house N if: cusp[N] <= longitude < cusp[N+1]
    Handle 360° wrap-around for house 12 → house 1
    """
    for i in range(12):
        current_cusp = house_cusps[i]['longitude']
        next_cusp = house_cusps[(i + 1) % 12]['longitude']

        if current_cusp <= next_cusp:
            if current_cusp <= planet_longitude < next_cusp:
                return i + 1
        else:  # Wrap around 360°
            if planet_longitude >= current_cusp or planet_longitude < next_cusp:
                return i + 1
    return 1  # Should never reach here
```

### Degree Formatting

```python
def format_degree(degree, sign):
    return f"{degree:.2f}° {sign}"
```

### Retrograde Detection

Use Swiss Ephemeris `swe_calc_ut()` with `SEFLG_SPEED` flag. If daily motion is negative, planet is retrograde.

---

## Migration Path

### Phase 1: Update Python Endpoint
1. Add house calculation using Placidus (or configurable)
2. Add `degreeFormatted` to all planet/house objects
3. Add `house` field to all planets
4. Standardize on `isRetrograde` (not `retrograde`)
5. Add `isAccurate` to ascendant

### Phase 2: Update Frontend
1. Remove `formatDegree()` helper function
2. Remove `extractLongitude()` and format detection
3. Remove `calculatePlanetHouse()` - use pre-computed
4. Simplify display: just `{planet.degreeFormatted}`, `{planet.house}`
5. Remove conditional rendering for missing houses

### Phase 3: Cleanup
1. Remove `sovereignChartService.js` transformation
2. Remove legacy data path handling in Results.jsx
3. Single code path: Python → Firebase → Display

---

## Validation

Frontend should validate on load:
```javascript
const isValidWesternData = (western) => {
  return western?.sun?.degreeFormatted
      && western?.moon?.degreeFormatted
      && western?.ascendant?.degreeFormatted
      && western?.houses?.length === 12
      && western?.planets?.saturn?.house;
};
```

If invalid, show "Recalculate" button instead of broken UI.

---

## Benefits

| Before | After |
|--------|-------|
| 5+ data format handlers | Zero transformation |
| Frontend house calculation | Pre-computed by Python |
| Conditional rendering | Always show (data guaranteed) |
| 2 code paths | 1 code path |
| ~200 lines of workarounds | ~20 lines of display |

---

## Implementation Status

### ✅ Completed (January 2026)

**Python Backend** (`functions-python/api/`):
- `schemas.py`: Updated `PlanetPositionSchema` with `degreeFormatted`, `isRetrograde`, `house`
- `schemas.py`: Updated `HouseCuspSchema` with `house`, `degreeFormatted`
- `schemas.py`: Added `AscendantSchema`, `MidheavenSchema`, `MoonPhaseSchema`
- `schemas.py`: Updated `WesternChartSchema` with `houses: List[HouseCuspSchema]`
- `compute_profile.py`: Added `_format_degree()`, `_assign_planet_to_house()`, `_calculate_moon_phase()` helpers
- `compute_profile.py`: Updated `compute_western()` to populate all v2.0 fields

**Frontend** (`src/components/results/`):
- `WesternAstrologyPanel.jsx`: Updated `formatDegree()` to use `degreeFormatted` first
- `WesternAstrologyPanel.jsx`: Updated House Cusps display for v2.0 array format
- `WesternAstrologyPanel.jsx`: Updated Moon Phase display for v2.0 format
- Maintained backward compatibility with legacy profile formats

### 📋 Deployment Checklist

1. **Deploy Python Functions**:
   ```bash
   cd functions-python
   gcloud functions deploy compute-profile --runtime python311 --trigger-http
   ```

2. **Test New Profile Creation**:
   - Create a new test profile
   - Verify `western.houses` is an array with 12 items
   - Verify `western.sun.degreeFormatted` is populated
   - Verify `western.sun.house` is populated
   - Verify `western.moonPhase` has `phase`, `illumination`, `angle`, `emoji`

3. **Verify Frontend Compatibility**:
   - Load a v2.0 profile - should display houses and degrees correctly
   - Load a legacy profile - should still work with fallback formatting

4. **Optional: Backfill Existing Profiles**:
   - Run migration script to add v2.0 fields to existing profiles
   - Or let profiles be recomputed on demand

---

*GENESIS AstroProfile - Python-First Architecture v2.0*
*Implemented January 2026*
