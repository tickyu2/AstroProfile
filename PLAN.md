# Vedic Astrology Implementation Plan

## Overview
Add Vedic (Jyotish) astrology as a separate page using the existing Swiss Ephemeris engine, switching from Tropical to Sidereal zodiac with Lahiri ayanamsha.

---

## Phase 1: Backend - Add Sidereal Support to Calculator

### File: `functions-python/astro/calculator.py`

**Modifications needed:**

1. **Add ayanamsha constants** (Lahiri = 1, Raman = 3, Krishnamurti = 5, etc.)

2. **New method: `calculate_vedic_chart()`**
   ```python
   def calculate_vedic_chart(self, birth_data: Dict, ayanamsha: int = 1) -> Dict:
       # Set sidereal mode with chosen ayanamsha
       swe.set_sid_mode(ayanamsha)

       # Calculate planets with SIDEREAL flag
       result, flag = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL | swe.FLG_SPEED)

       # Use Whole Sign houses (common in Vedic)
       cusps, ascmc = swe.houses(jd, lat, lon, b'W')
   ```

3. **Add Nakshatra calculation**
   - 27 lunar mansions, each 13°20' (13.333...°)
   - Calculate: `nakshatra_index = int(moon_longitude / 13.333333)`
   - Include pada (quarter): `pada = int((moon_longitude % 13.333333) / 3.333333) + 1`

4. **Vedic-specific response structure:**
   ```json
   {
     "zodiacSystem": "sidereal",
     "ayanamsha": "Lahiri",
     "ayanamshaValue": 24.123,
     "planets": {
       "sun": {
         "longitude": 30.12,
         "rashi": "Mesha",
         "rashiWestern": "Aries",
         "nakshatra": "Ashwini",
         "pada": 2,
         "lordship": "Sun"
       }
     },
     "houses": { /* Whole Sign houses */ },
     "ascendant": {
       "rashi": "Simha",
       "nakshatra": "Magha"
     }
   }
   ```

### File: `functions-python/main.py`

**Add new endpoint:**
```python
@functions_framework.http
def calculate_vedic_chart(request):
    # Parse birth data
    # Call calculator.calculate_vedic_chart()
    # Return Vedic chart JSON
```

---

## Phase 2: Frontend Service Layer

### New File: `src/services/vedicAstrologyService.js`

```javascript
export async function calculateVedicChart(birthData) {
  const response = await fetch('/api/calculate_vedic_chart', {
    method: 'POST',
    body: JSON.stringify({
      birthDate: birthData.date,
      birthTime: birthData.time,
      latitude: birthData.lat,
      longitude: birthData.lng,
      timezone: birthData.timezone,
      ayanamsha: 'lahiri'
    })
  });
  return response.json();
}
```

---

## Phase 3: Frontend - Vedic Astrology Page

### New File: `src/pages/VedicAstrologyPage.jsx`

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Header: 🕉️ VEDIC ASTROLOGY (Jyotish)               │
│ Profile selector | Ayanamsha dropdown              │
├─────────────────────────────────────────────────────┤
│ LEFT COLUMN                │ RIGHT COLUMN           │
│ ┌─────────────────────┐   │ ┌──────────────────┐   │
│ │ RASHI CHART         │   │ │ NAKSHATRA MOON   │   │
│ │ (South Indian or    │   │ │ Moon's mansion   │   │
│ │  North Indian style)│   │ │ + Pada + Lord    │   │
│ └─────────────────────┘   │ └──────────────────┘   │
│ ┌─────────────────────┐   │ ┌──────────────────┐   │
│ │ PLANETARY POSITIONS │   │ │ ASCENDANT INFO   │   │
│ │ All 9 grahas with   │   │ │ Lagna rashi +    │   │
│ │ rashi + nakshatra   │   │ │ nakshatra        │   │
│ └─────────────────────┘   │ └──────────────────┘   │
│                           │ ┌──────────────────┐   │
│                           │ │ YOGA DETECTION   │   │
│                           │ │ (Future phase)   │   │
│                           │ └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key Components:**

1. **RashiChartPanel** - Traditional grid showing planet placements
2. **NakshatraPanel** - Moon's nakshatra with meaning
3. **VedicPlanetTable** - All grahas with sidereal positions
4. **LagnaPanel** - Ascendant details

---

## Phase 4: Constants & Data

### New File: `src/data/vedicConstants.js`

```javascript
export const RASHIS = [
  { index: 0, sanskrit: 'Mesha', english: 'Aries', lord: 'Mars', element: 'Fire' },
  { index: 1, sanskrit: 'Vrishabha', english: 'Taurus', lord: 'Venus', element: 'Earth' },
  // ... all 12
];

export const NAKSHATRAS = [
  { index: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: '🐴' },
  { index: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: '🔱' },
  // ... all 27
];

export const AYANAMSHAS = {
  lahiri: { id: 1, name: 'Lahiri/Chitrapaksha', description: 'Most widely used' },
  raman: { id: 3, name: 'B.V. Raman', description: 'Popular in South India' },
  krishnamurti: { id: 5, name: 'KP (Krishnamurti)', description: 'For KP system' }
};
```

---

## Phase 5: Routing

### File: `src/App.jsx`

Add route:
```javascript
const VedicAstrologyPage = lazy(() => import('./pages/VedicAstrologyPage'));

<Route path="/vedic" element={<ProtectedRoute><VedicAstrologyPage /></ProtectedRoute>} />
```

---

## Implementation Order

1. **Backend first**: Modify `calculator.py` to support sidereal calculations
2. **Add endpoint**: Create `calculate_vedic_chart` in `main.py`
3. **Create constants**: `vedicConstants.js` with rashis + nakshatras
4. **Build service**: `vedicAstrologyService.js`
5. **Create page**: `VedicAstrologyPage.jsx` with basic structure
6. **Add components**: RashiChartPanel, NakshatraPanel, etc.
7. **Add routing**: Update `App.jsx`

---

## Key Technical Details

### Ayanamsha Offset
- Lahiri ayanamsha in 2024 ≈ 24.2°
- Tropical longitude - ayanamsha = Sidereal longitude
- Swiss Ephemeris handles this automatically with `swe.set_sid_mode()`

### Nakshatra Calculation
```python
# Each nakshatra spans 13°20' (800 arc-minutes)
nakshatra_span = 360 / 27  # = 13.333...°
nakshatra_index = int(longitude / nakshatra_span)
pada = int((longitude % nakshatra_span) / (nakshatra_span / 4)) + 1
```

### House System Options
- **Whole Sign (recommended)**: Each sign = one house, starting from Lagna
- **Equal House**: Each house = 30°, starting from Ascendant degree
- **Placidus**: Not traditional for Vedic but available

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `functions-python/astro/calculator.py` | MODIFY | Add `calculate_vedic_chart()` method |
| `functions-python/main.py` | MODIFY | Add `calculate_vedic_chart` endpoint |
| `src/data/vedicConstants.js` | CREATE | Rashis, Nakshatras, Ayanamshas |
| `src/services/vedicAstrologyService.js` | CREATE | API calls for Vedic calculations |
| `src/pages/VedicAstrologyPage.jsx` | CREATE | Main page component |
| `src/components/vedic/RashiChartPanel.jsx` | CREATE | Chart visualization |
| `src/components/vedic/NakshatraPanel.jsx` | CREATE | Moon nakshatra display |
| `src/components/vedic/VedicPlanetTable.jsx` | CREATE | Planet positions table |
| `src/App.jsx` | MODIFY | Add route |

---

## Future Enhancements (Not in initial scope)

- Dasha periods (Vimshottari)
- Yoga detection
- Transit analysis
- Divisional charts (D9, D10, etc.)
- Compatibility (Kundli matching)
