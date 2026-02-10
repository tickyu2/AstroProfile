# Python Swiss Ephemeris vs JS Approximate Ephemeris

## Engine Comparison - GENESIS AstroProfile

**Date:** February 2026
**Status:** Python-first with JS fallback (production)

---

## Architecture Overview

```
User Request
    |
    v
Frontend (React)
    |
    +--[async]--> Python Cloud Function (Swiss Ephemeris)
    |                 |
    |                 v
    |             pyswisseph (C library)
    |             Sub-arc-second precision
    |             30-facet personality vectors
    |                 |
    |                 v
    |             JSON response
    |
    +--[fallback]--> JS Approximate Ephemeris
                      |
                      v
                  J2000 epoch + perturbation
                  ~1 degree precision
                  Local computation (no network)
```

---

## 1. Planetary Position Calculation

### Python (swiss_ephemeris.py)

| Property | Detail |
|----------|--------|
| **Library** | `pyswisseph >= 2.10.0` (Swiss Ephemeris C bindings) |
| **Precision** | 0.0001 degrees (sub-arc-second) |
| **Method** | Full numerical integration of planetary orbits |
| **Planets** | Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, Chiron |
| **Output per planet** | longitude, latitude, distance (AU), speed (deg/day), sign, degree_in_sign |
| **Retrograde** | Exact detection via negative daily speed |
| **House systems** | Placidus, Whole Sign, Koch, Porphyry, Equal (configurable) |
| **Ayanamsha** | Lahiri (for Vedic sidereal mode) |
| **Seasonal ingress** | Newton-Raphson iteration to 1/3600 degree convergence |

```python
# Core call
jd = datetime_to_jd(birth_datetime)
flags = swe.FLG_SWIEPH | swe.FLG_SPEED
result = swe.calc_ut(jd, planet_id, flags)
# Returns: (longitude, latitude, distance, speed_lon, speed_lat, speed_dist)
```

### JS (transitCalculator.js)

| Property | Detail |
|----------|--------|
| **Library** | None (custom implementation) |
| **Precision** | ~1-2 degrees |
| **Method** | J2000 base position + daily motion + sinusoidal perturbation |
| **Planets** | Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, Chiron |
| **Output per planet** | absoluteDegree, sign, degree (in sign), formattedPosition, retrograde |
| **Retrograde** | Sinusoidal approximation within estimated retrograde windows |
| **House systems** | None (position-only) |
| **Perturbation** | Jupiter: +/-0.5 deg sine, Saturn: +/-0.8 deg sine, others: none |

```javascript
// Core calculation
const daysSinceJ2000 = (targetDate - j2000) / MS_PER_DAY;
let rawPosition = basePosition + (dailyMotion * daysSinceJ2000);

// Perturbation corrections (Jupiter & Saturn only)
rawPosition += amplitude * Math.sin(daysSinceJ2000 / orbitalPeriod * 2 * Math.PI);

// Normalize to 0-360
const longitude = ((rawPosition % 360) + 360) % 360;
```

### Precision Comparison

| Scenario | Python | JS | Difference |
|----------|--------|----|------------|
| Sun position today | 312.4523 deg | 312.0 deg | ~0.45 deg |
| Moon position today | 187.2341 deg | 185.5 deg | ~1.7 deg |
| Saturn position | 346.8912 deg | 346.3 deg | ~0.6 deg |
| Pluto position | 303.4156 deg | 302.1 deg | ~1.3 deg |
| Aspect orb detection | +/-0.01 deg | +/-1 deg | 100x less precise |

**Impact:** For aspect detection with 6-8 degree orbs, the JS engine rarely misses an aspect entirely, but the orb values it reports are approximate. The Python engine provides exact orb values critical for timing predictions and tight-orb interpretations.

---

## 2. Aspect Detection

### Python (swiss_ephemeris.py + aspects.py)

| Property | Detail |
|----------|--------|
| **Aspects** | Conjunction (0), Opposition (180), Trine (120), Square (90), Sextile (60), Quincunx (150), Semi-Sextile (30) |
| **Orbs** | Conjunction 8, Opposition 8, Trine 8, Square 8, Sextile 6, Quincunx 3, Semi-Sextile 2 |
| **Luminary bonus** | +2 deg orb for Sun/Moon aspects |
| **Applying/Separating** | Calculated from planet speeds (exact) |
| **Quality** | harmonious / challenging / fusion (from aspect type) |
| **Orb weight** | `1.0 - (orb / max_orb) * 0.7` (tighter = stronger, min 0.3) |

### JS (transitCalculator.js + aspectPatternDetector.js)

| Property | Detail |
|----------|--------|
| **Aspects** | Conjunction (0), Opposition (180), Trine (120), Square (90), Sextile (60), Quincunx (150), Semi-Square (45), Sesquiquadrate (135) |
| **Orbs** | Conjunction 8, Opposition 8, Trine 6, Square 6, Sextile 4, Quincunx 3, Semi-Square 2 |
| **Luminary bonus** | None |
| **Applying/Separating** | Estimated (not speed-based) |
| **Importance** | 0-100 score based on planet pair + aspect type |

### Key Differences

- Python detects **applying vs separating** from actual planetary speeds; JS estimates
- Python uses **wider orbs** for trines (8 vs 6) and sextiles (6 vs 4)
- Python gives **luminaries wider orbs** (+2 deg bonus for Sun/Moon)
- JS includes **semi-square and sesquiquadrate** (minor aspects); Python uses semi-sextile instead
- Python calculates **orb weight** (0.3-1.0) for precision weighting; JS uses importance (0-100) for display

---

## 3. Transit Analysis

### Python (transits_engine.py - P5)

| Property | Detail |
|----------|--------|
| **Transit planets** | Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Natal receivers** | Sun (1.0), Moon (0.95), Mars (0.70), Venus (0.65), Mercury (0.60), Saturn (0.50), Jupiter (0.40) |
| **Orbs** | 0.5x standard (tighter for transit immediacy) |
| **Output** | activeTransits, transitAspects, facetVector (30-dim), forecast (30-day) |
| **Personality impact** | 30-facet NEO PI-R delta vector (range +/-0.3) |
| **Forecast** | 30-day look-ahead with date-specific predictions |

**Transit planet personality impacts (30-facet deltas):**
```
Jupiter:  E_mod +0.08, O_mod +0.10, N_mod -0.05  (expansion, optimism)
Saturn:   C_mod +0.12, N_mod +0.08, E_mod -0.05  (discipline, anxiety)
Uranus:   O_mod +0.15, N_mod +0.10, A_mod -0.05  (disruption, innovation)
Neptune:  O_mod +0.12, C_mod -0.08, N_mod +0.08  (imagination, confusion)
Pluto:    O_mod +0.10, N_mod +0.12, C_mod +0.08  (transformation, intensity)
```

**Weight formula:**
```
combined_weight = orb_weight * aspect_modifier * receiver_weight * duration_factor
```

### JS (transitCalculator.js + currentSkyAnalysis.js)

| Property | Detail |
|----------|--------|
| **Transit planets** | All 12 (Sun through Chiron) |
| **Natal receivers** | All natal planets |
| **Orbs** | Standard orbs (same as natal) |
| **Output** | transit list with aspect/orb/importance, sky snapshot, Saturn cycle |
| **Personality impact** | None (interpretation text only) |
| **Forecast** | 7-day and 30-day via repeated position calculation |

**Importance calculation:**
```javascript
importance = basePlanetWeight + aspectTypeModifier + orbFactor
// Result: 0-100 score used for display sorting
```

### Key Differences

- Python produces a **30-facet personality delta vector** showing how transits temporarily shift personality traits. JS only produces interpretive text.
- Python uses **tighter orbs (0.5x)** for transit immediacy; JS uses standard natal orbs
- Python has **receiver weights** (Sun receives transit energy at 1.0, Jupiter at 0.4); JS treats all receivers equally
- Python calculates a **30-day forecast** with date-specific events; JS recalculates positions for each day independently
- JS tracks **all 12 planets** as transiting bodies; Python focuses on the **5 slow-movers** that create lasting effects

---

## 4. Progressions (Python-only)

### Python (progressions_engine.py - P8)

| Property | Detail |
|----------|--------|
| **Method** | Secondary progressions (day-for-a-year) |
| **Precision** | Sub-arc-second (Swiss Ephemeris for progressed date) |
| **Progressed Moon** | Primary focus (changes sign every ~2.5 years) |
| **Aspects** | Progressed-to-natal (40%) + progressed-to-progressed (30%) + Moon-specific (30%) |
| **Output** | 30-facet delta vector (range +/-0.25), life phase, Moon cycle, themes |

**Progressed Moon orbs (tighter than natal):**
```
Conjunction: 4 deg, weight 1.00
Opposition:  4 deg, weight 0.90
Square:      3 deg, weight 0.85
Trine:       3 deg, weight 0.80
Sextile:     2.5 deg, weight 0.60
Quincunx:    1.5 deg, weight 0.40
```

**Progressed Moon sign emotional coloring:**
```
Aries:       Independence, initiative
Taurus:      Stability, comfort needs
Gemini:      Communication hunger
Cancer:      Security, nurturing
Leo:         Creativity, recognition
Virgo:       Order, self-improvement
Libra:       Harmony, partnership
Scorpio:     Depth, transformation
Sagittarius: Freedom, meaning-seeking
Capricorn:   Achievement, structure
Aquarius:    Independence, innovation
Pisces:      Transcendence, compassion
```

### JS

No progressions engine exists in JS. The `ProgressionsPanel.jsx` component calls the Python endpoint exclusively via `lunaFusionService.js`.

---

## 5. Composite & Synastry

### Python (composite_engine.py + synastry_engine.py)

| Property | Detail |
|----------|--------|
| **Composite method** | Midpoint via Swiss Ephemeris positions |
| **Synastry scoring** | Domain-weighted similarity (OCEAN + extended traits) |
| **Composite aspects** | Dignity-modified weights (rulership +1.2x, detriment 0.85x) |
| **Output** | 30-facet relationship vector, compatibility score (0-1), behavioral adjustments |

**Synastry domain weights:**
```
Openness:            0.20
Agreeableness:       0.20
Conscientiousness:   0.15
Extraversion:        0.15
Neuroticism:         0.10
Emotional intensity: 0.10
Insightful:          0.05
Nurturing:           0.05
```

### JS (compositeGenerator.js + synastryFateEngine.js)

| Property | Detail |
|----------|--------|
| **Composite method** | Near-midpoint (shorter arc), multiple input format support |
| **Synastry** | Fate-focused (nodal axis, karmic contracts, projection loops) |
| **Composite aspects** | Standard orbs (no dignity modifiers) |
| **Output** | Composite chart object, relationship archetype, fate vs choice index (0-100) |

### Key Differences

- Python synastry produces a **quantitative compatibility score** (0-1) based on personality vector similarity. JS produces a **qualitative analysis** (karmic contracts, fate threads, projection loops).
- Python includes **planetary dignity modifiers** for composite aspects (e.g., composite Venus in Pisces gets exaltation bonus). JS uses flat orbs.
- JS has a unique **Fate vs Choice Index** (0-100) and **relationship archetype classification** (Soul Mates, Karmic Teachers, etc.) that Python does not provide.
- Both systems are complementary: Python provides the quantitative backbone, JS provides the narrative/mythic layer.

---

## 6. Composite Transits

### Python (composite_transits.py)

| Property | Detail |
|----------|--------|
| **Endpoint** | `/luna_composite_transits` |
| **Scan range** | Configurable (default 12 months) |
| **Sample interval** | Biweekly (26 samples per year) |
| **Transit planets** | Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Precision** | Swiss Ephemeris positions |
| **Output** | TransitEvent[] with chamber impact deltas, story beats, seasonal chapters, summary stats |

### JS (compositeTransitBridge.ts)

| Property | Detail |
|----------|--------|
| **Function** | `scanCompositeTransits()` (fallback) |
| **Scan range** | Configurable (default 12 months) |
| **Sample interval** | Biweekly (14-day intervals) |
| **Transit planets** | Jupiter, Saturn, Uranus, Neptune, Pluto |
| **Precision** | J2000 approximate positions |
| **Output** | TransitEvent[] with chamber impact deltas |

**Shared chamber impact model (both engines):**
```
Composite Point -> Primary Chamber:
  Sun/Moon     -> core
  Mercury      -> communication
  Venus/Mars   -> passion
  Jupiter/Saturn -> growth
  Uranus/Neptune/Pluto -> transformation

Transit Weights:
  Pluto: 15  |  Uranus: 14  |  Neptune: 13  |  Saturn: 12  |  Jupiter: 8

Aspect Direction:
  Conjunction/Trine/Sextile = +weight (opens chamber)
  Square/Opposition         = -weight (tests chamber)
```

The chamber impact model is identical between Python and JS - the only difference is the precision of the underlying planetary positions.

---

## 7. BaZi (Python-only)

### Python (bazi/ directory)

| Property | Detail |
|----------|--------|
| **Library** | `sxtwl >= 1.1.0` (Joey Yap standard) |
| **Output** | 4 pillars, day master, elements, ten gods, hidden stems, symbolic stars, growth phases, luck pillars (dayun), life palace, conception palace |
| **Seasonal precision** | Solar term transitions precise to the hour |
| **DM strength** | 0-1.0 scale with seasonal context |

No JS equivalent exists. BaZi calculations require the `sxtwl` library for accurate Chinese calendar conversions and solar term timing.

---

## 8. Vedic Astrology (Python-only)

### Python (via swiss_ephemeris.py sidereal mode)

| Property | Detail |
|----------|--------|
| **Ayanamsha** | Lahiri |
| **Output** | Grahas (planets), Rashis (signs), Nakshatras (27 lunar mansions), Bhavas (houses) |
| **Nakshatra detail** | Index, name, lord, deity, quality, pada, degree |

No JS equivalent exists. Vedic calculations require the sidereal coordinate system with precise ayanamsha correction.

---

## 9. 30-Facet Personality Fusion (Python-only)

### Python (fusion_engine.py)

The crown jewel of the Python engine - combines all astrological sources into a unified 30-dimensional personality vector based on the NEO PI-R model.

**Source weights:**
```
Big5 (direct):    0.22
BaZi:             0.28
Enneagram:        0.16
Aspects (P4):     0.12
Natal:            0.08
MBTI:             0.08
Numerology:       0.06
```

**Dynamic sources (overlaid on base vector):**
```
Transits (P5):      +/-0.30 per facet (temporary)
Progressions (P8):  +/-0.25 per facet (gradual)
Aspects (P4):       +/-0.50 per facet (natal, permanent)
```

**Confidence tiers:**
```
Birth only:           60% (auto-derived sources only)
+ 1 questionnaire:    75%
+ 2 questionnaires:   85%
Complete (3+):        95%
```

No JS equivalent exists for fusion. The JS layer receives pre-computed vectors from the Python API.

---

## 10. Frontend Integration Map

| Frontend Component | Python Endpoint | JS Fallback |
|--------------------|----------------|-------------|
| `TransitsPanel` (personality) | `/luna_transits` via lunaFusionService | None (Python-only) |
| `ProgressionsPanel` | `/luna_progressions` via lunaFusionService | None (Python-only) |
| `TransitsPanel` (cathedral) | `/luna_transits` via currentSkyAnalysis | transitCalculator.js |
| `SynastryCompositePanel` | `/luna_composite_transits` via compositeTransitBridge | scanCompositeTransits() |
| `DynamicPersonalityPage` | `/luna_fusion`, `/luna_complete_profile` | None (Python-only) |
| `Results` (BaZi) | `/compute_profile` | None (Python-only) |
| `Results` (Western) | `/compute_profile` | None (Python-only) |
| `Results` (Vedic) | `/compute_profile` | None (Python-only) |
| Saturn Journey | None (JS-only) | saturnJourneyEngine.js |
| Aspect Patterns | None (JS-only) | aspectPatternDetector.js |
| Synastry Fate | None (JS-only) | synastryFateEngine.js |
| Composite Chart | None (JS-only) | compositeGenerator.js |

---

## 11. Summary: What Each Engine Does Best

### Python Swiss Ephemeris - Strengths

1. **Precision**: Sub-arc-second planetary positions vs ~1 deg JS approximate
2. **30-facet personality vectors**: Quantitative personality modeling that JS cannot replicate
3. **Multi-system support**: Western + Vedic + BaZi in one pipeline
4. **Forecast accuracy**: 30-day transit forecasts with exact timing
5. **Progressive calculations**: Day-for-year secondary progressions
6. **Receiver weighting**: Differentiates how natal planets receive transit energy
7. **Planetary dignity**: Rulership/exaltation/detriment modifiers for composite aspects

### JS Approximate Ephemeris - Strengths

1. **Zero network dependency**: Works offline, no API call needed
2. **Instant computation**: No latency, synchronous calculation
3. **Daily granularity**: Can compute 7 daily positions without 7 API calls
4. **Rich narrative layer**: Liz Greene psychological interpretations, Luna guidance
5. **Fate/destiny analysis**: Nodal axis, karmic contracts, projection loops
6. **Aspect pattern detection**: Grand Trine, T-Square, Yod, Grand Cross, Kite
7. **Saturn journey**: Complete psychological maturation framework
8. **Composite generation**: Local midpoint calculation with multiple input formats

### Complementary Roles

The two engines are **not competing** - they are **complementary layers**:

```
Python = Precision Foundation + Quantitative Vectors
  |
  v
JS = Narrative Layer + Pattern Recognition + Offline Fallback
```

- Python provides the **numbers** (precise positions, personality vectors, compatibility scores)
- JS provides the **meaning** (psychological interpretations, mythic narratives, Luna guidance)
- When Python is unavailable, JS provides **approximate positions** with full interpretation

---

## 12. API Endpoints Reference

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/compute_profile` | POST | birthDate, birthTime, lat, lon, tz, gender | BaZi + Western + Vedic + Unified |
| `/luna_fusion` | POST | sources (big5, mbti, enneagram, natal, bazi, numerology, aspects) | 30-facet vector + archetypes |
| `/luna_complete_profile` | POST | sources + birth_data | Full profile + Luna adaptation |
| `/luna_natal_aspects` | POST | natal positions | Aspect analysis + 30-facet delta |
| `/luna_transits` | POST | natalPositions, forecastDays | activeTransits, transitAspects, facetVector, forecast |
| `/luna_progressions` | POST | birthData, targetDate | progressions, facetVector, interpretation |
| `/luna_synastry_fusion` | POST | user1_vector, user2_vector | compatibility score, dimension scores |
| `/luna_composite_chart` | POST | birth_data_1, birth_data_2 | composite positions, aspects, interpretation |
| `/luna_composite_transits` | POST | compositeLongitudes, months | events, storyBeats, seasonalChapters |
| `/luna_archetypes` | POST | 30-facet vector | dominant archetypes + narrative |
| `/luna_personality` | POST | user_vector, preset | Luna tone adjustments |

---

## 13. Precision Impact on User Experience

| Feature | With Python | Without Python (JS fallback) |
|---------|-------------|------------------------------|
| Transit aspect detection | Exact orbs to 0.01 deg | Approximate orbs (+/-1 deg) |
| Transit timing | Exact dates | Approximate (+/-7 days) |
| "Applying vs separating" | Accurate (from speeds) | Estimated |
| Personality impact | 30-facet delta vector | Text interpretation only |
| Compatibility score | 0-100 quantitative | Qualitative narrative only |
| BaZi chart | Full 4-pillar analysis | Not available |
| Vedic chart | Full graha/nakshatra | Not available |
| Progressions | Full secondary progressions | Not available |
| Composite transits | Sub-arc-second positions | ~1 deg approximate positions |
| Daily guidance | Data-rich + narrative | Narrative only |

The JS fallback ensures the application **never breaks** when Python is unavailable. Users get the full narrative experience with approximate positions, and when Python is available, they get precision-enhanced data underneath the same narrative layer.
