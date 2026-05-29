/**
 * Reverse Engine — find birth-date candidates that satisfy planet-in-sign
 * constraints. Uses the `all_planet_ingresses` Swiss Ephemeris endpoint to
 * build per-planet sign-window timelines, then intersects them year by year.
 *
 * Designed for the Natal Wheel LAB "Reverse" mode.
 */

import { getAllPlanetIngresses, batchChartPositions } from './pythonFunctionsService';

export const PLANET_ORDER = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

// Ascendant ("Rising") is not a planet — it's location+time-dependent. Handled
// separately from sign-ingress intersection (which only uses ecliptic planets).
export const ASCENDANT_KEY = 'Ascendant';

/**
 * Compatibility priority — higher = more important, dropped last during
 * progressive relaxation. Matches conventional astrological weighting:
 * Rising is the "interface/mask", Sun is core identity, Moon is emotional
 * needs; outer planets matter less for personal chemistry.
 */
export const CONSTRAINT_PRIORITY = {
  [ASCENDANT_KEY]: 110, // Rising — highest
  Sun:     100,
  Moon:     90,
  Venus:    80,
  Mars:     70,
  Mercury:  60,
  Saturn:   50,
  Jupiter:  40,
  Pluto:    30,
  Uranus:   20,
  Neptune:  10, // lowest — dropped first
};

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Element / modality lookups for partial-credit scoring on Moon/Venus/Mars.
// Same-element (trine family) → 0.5×, same-modality only → 0.25×, else 0.
const ELEMENT_OF = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};
const MODALITY_OF = {
  Aries: 'cardinal', Cancer: 'cardinal', Libra: 'cardinal', Capricorn: 'cardinal',
  Taurus: 'fixed', Leo: 'fixed', Scorpio: 'fixed', Aquarius: 'fixed',
  Gemini: 'mutable', Virgo: 'mutable', Sagittarius: 'mutable', Pisces: 'mutable',
};

// Planets that benefit from element/modality partial credit (chemistry planets).
// Other planets remain binary match — element-match for Saturn/Jupiter is too
// noisy to count as real compatibility.
const PARTIAL_CREDIT_PLANETS = new Set(['Moon', 'Venus', 'Mars']);

// Flat weight used for HARD constraints (Sun + Rising). Previously 100, which
// compressed all Weighted results into 86-100%. Dropping to 30 widens the
// natural score spread to roughly 55-100 so soft-constraint differences
// actually move the score.
const HARD_EFFECTIVE_WEIGHT = 30;

function signPartialCredit(candidateSign, wantedSet) {
  if (!candidateSign || !wantedSet || wantedSet.size === 0) return 0;
  if (wantedSet.has(candidateSign)) return 1.0;
  const candEl = ELEMENT_OF[candidateSign];
  const candMod = MODALITY_OF[candidateSign];
  for (const s of wantedSet) {
    if (ELEMENT_OF[s] === candEl) return 0.5;   // trine family
  }
  for (const s of wantedSet) {
    if (MODALITY_OF[s] === candMod) return 0.25; // same modality, different element
  }
  return 0;
}

// -------- cache: ingresses are deterministic per (year, planets set) --------
const _ingressCache = new Map();
const _cacheKey = (year, planets) => `${year}::${[...planets].sort().join(',')}`;

async function fetchYearIngresses(year, planets) {
  const key = _cacheKey(year, planets);
  if (_ingressCache.has(key)) return _ingressCache.get(key);
  const data = await getAllPlanetIngresses(year, planets);
  _ingressCache.set(key, data);
  return data;
}

export function clearReverseEngineCache() {
  _ingressCache.clear();
}

/**
 * For a given year range, fetch ingresses for the outer/slow planets and
 * compute the set of signs each planet occupied during the range. Useful as
 * a UI affordance: if Pluto only touched Scorpio + Sagittarius in 1980-1995,
 * the user knows to constrain Pluto to exactly those two.
 *
 * @param {number} startYear
 * @param {number} endYear
 * @param {string[]} [planets] - default: slow planets (Jupiter+)
 * @returns {Promise<Object<string,string[]>>} planet -> chronological unique signs
 */
export async function getEraSignsForYearRange(
  startYear,
  endYear,
  planets = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
) {
  const byPlanet = {};
  for (const p of planets) byPlanet[p] = [];

  for (let year = startYear; year <= endYear; year++) {
    let yearData;
    try {
      yearData = await fetchYearIngresses(year, planets);
    } catch {
      continue;
    }
    for (const p of planets) {
      const startSign = yearData.startingSigns?.[p];
      if (startSign && !byPlanet[p].includes(startSign)) byPlanet[p].push(startSign);
      const events = yearData.byPlanet?.[p] || [];
      for (const ev of events) {
        if (!byPlanet[p].includes(ev.to_sign)) byPlanet[p].push(ev.to_sign);
      }
    }
  }
  return byPlanet;
}

// -------- interval math --------

/**
 * Build the list of [start,end) UTC intervals within a year during which a
 * given planet is in ANY of the target signs. Accepts a Set for O(1) lookup.
 * Merges adjacent intervals (so e.g. Cancer→Leo crossing is one window if both
 * signs are accepted).
 */
function signIntervalsForPlanet(yearData, planet, targetSignsSet) {
  const events = yearData.byPlanet?.[planet] || [];
  const year = yearData.year;
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const intervals = [];
  let currentSign = yearData.startingSigns?.[planet];
  let currentStart = yearStart;

  for (const ev of events) {
    const evDate = new Date(ev.datetime_utc);
    if (targetSignsSet.has(currentSign)) {
      intervals.push({ start: currentStart, end: evDate });
    }
    currentSign = ev.to_sign;
    currentStart = evDate;
  }
  if (targetSignsSet.has(currentSign)) {
    intervals.push({ start: currentStart, end: yearEnd });
  }

  // Merge any abutting intervals (sign A → sign B where both are accepted)
  if (intervals.length < 2) return intervals;
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i].start.getTime() === last.end.getTime()) {
      last.end = intervals[i].end;
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}

/**
 * Intersect two lists of sorted, non-overlapping [start,end) intervals.
 */
function intersectIntervalLists(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    const start = a[i].start > b[j].start ? a[i].start : b[j].start;
    const end = a[i].end < b[j].end ? a[i].end : b[j].end;
    if (start < end) out.push({ start, end });
    if (a[i].end < b[j].end) i++; else j++;
  }
  return out;
}

function intersectManyIntervalLists(lists) {
  if (lists.length === 0) return [];
  return lists.reduce((acc, cur) => intersectIntervalLists(acc, cur));
}

// -------- public API --------

/**
 * Find birth-date candidate windows that satisfy all provided sign constraints,
 * optionally refined to time-of-day windows by house constraints.
 *
 * @param {Object} params
 * @param {number} params.startYear - inclusive (>=1800)
 * @param {number} params.endYear   - inclusive (<=2200)
 * @param {Object<string,string|string[]>} params.signConstraints
 *   Map of planet -> sign OR array of signs (e.g. { Sun: ['Capricorn','Virgo'] }).
 *   Missing / empty entries are ignored (no constraint on that planet).
 * @param {Object<string,number>} [params.houseConstraints]
 *   Map of planet -> house number 1..12 (optional per planet).
 *   When any house constraint is set, `location` and `timezone` are required.
 * @param {{lat:number,lng:number}} [params.location] - birth location
 * @param {string} [params.timezone] - IANA timezone (e.g. "Asia/Shanghai")
 * @param {number} [params.sweepStepMinutes=5] - time sweep resolution (1 or 5)
 * @param {Object} [params.referenceDate] - date used for age calc (default: today)
 * @param {function} [params.onProgress] - called with (done, total, phase)
 * @returns {Promise<{candidates, constrainedPlanets, houseConstrained, failedYears}>}
 */
export async function findBirthDateCandidates({
  startYear,
  endYear,
  signConstraints,
  houseConstraints = {},
  location = null,
  timezone = null,
  sweepStepMinutes = 5,
  referenceDate = new Date(),
  onProgress = null,
  signal = null,
  // When set, sign-intersection phase only uses HARD (weight=Infinity)
  // constraints, and the time-sweep phase scores every frame against the
  // full constraint set. Frames passing the threshold are kept.
  scoreMode = null, // { threshold: number, weights: Object }
}) {
  const throwIfAborted = () => {
    if (signal?.aborted) {
      const err = new Error('Search cancelled');
      err.name = 'AbortError';
      throw err;
    }
  };
  // Normalize signConstraints: each value becomes a Set of target signs (or null)
  const normalizedSigns = {};
  for (const p of [...PLANET_ORDER, ASCENDANT_KEY]) {
    const raw = signConstraints?.[p];
    if (!raw) { normalizedSigns[p] = null; continue; }
    const arr = Array.isArray(raw) ? raw : [raw];
    const valid = arr.filter(s => SIGNS.includes(s));
    normalizedSigns[p] = valid.length > 0 ? new Set(valid) : null;
  }

  // In scoreMode, the sign-intersection phase only uses HARD-weight
  // constraints. This keeps date windows broad enough to actually contain
  // candidates; the time-sweep will then score each frame against the full
  // constraint set and filter by threshold.
  const sigsForIntersection = {};
  if (scoreMode?.weights) {
    for (const p of [...PLANET_ORDER, ASCENDANT_KEY]) {
      if (scoreMode.weights[p] === Infinity && normalizedSigns[p]) {
        sigsForIntersection[p] = normalizedSigns[p];
      }
    }
  } else {
    Object.assign(sigsForIntersection, normalizedSigns);
  }

  const constrainedPlanets = PLANET_ORDER.filter(p => sigsForIntersection[p]);

  if (constrainedPlanets.length === 0 && !scoreMode?.weights?.[ASCENDANT_KEY]) {
    return { candidates: [], constrainedPlanets: [] };
  }

  // Pre-flight: check each constrained planet's target signs against the
  // signs it *could* be in during the year range. Surfaces the exact reason
  // a search will return no matches — so the UI can offer a relax action.
  const infeasible = []; // [{planet, requested: [...], available: [...]}]

  const totalYears = endYear - startYear + 1;
  const candidates = [];
  const failedYears = [];
  let firstError = null;

  // Per-planet diagnostic accumulators, filled during the year walk.
  const _diagPerPlanetZeroYears = new Map();       // planet -> # of years with no matching interval
  const _diagPerPlanetAvailableSigns = new Map();  // planet -> Set<sign> (signs it actually touched)

  for (let year = startYear; year <= endYear; year++) {
    throwIfAborted();
    let yearData;
    try {
      yearData = await fetchYearIngresses(year, constrainedPlanets);
    } catch (err) {
      console.error(`[reverseEngine] year ${year} fetch failed:`, err);
      failedYears.push(year);
      if (!firstError) firstError = err;
      if (onProgress) onProgress(year - startYear + 1, totalYears);
      continue;
    }

    const perPlanetIntervals = constrainedPlanets.map(planet =>
      signIntervalsForPlanet(yearData, planet, sigsForIntersection[planet])
    );

    // Track, per planet, which years had zero matching intervals. Used below
    // to compute the diagnostic.
    for (let i = 0; i < constrainedPlanets.length; i++) {
      const planet = constrainedPlanets[i];
      const zeroThisYear = perPlanetIntervals[i].length === 0;
      if (!_diagPerPlanetZeroYears.has(planet)) _diagPerPlanetZeroYears.set(planet, 0);
      if (zeroThisYear) {
        _diagPerPlanetZeroYears.set(planet, _diagPerPlanetZeroYears.get(planet) + 1);
      }
      // Track union of signs this planet touched in the range (outer planets)
      const seen = _diagPerPlanetAvailableSigns.get(planet) || new Set();
      const startSign = yearData.startingSigns?.[planet];
      if (startSign) seen.add(startSign);
      for (const ev of (yearData.byPlanet?.[planet] || [])) seen.add(ev.to_sign);
      _diagPerPlanetAvailableSigns.set(planet, seen);
    }

    // Early-exit if any planet has no valid window this year
    if (perPlanetIntervals.some(list => list.length === 0)) {
      if (onProgress) onProgress(year - startYear + 1, totalYears);
      continue;
    }

    const intersected = intersectManyIntervalLists(perPlanetIntervals);

    for (const iv of intersected) {
      candidates.push({
        year,
        start: iv.start,
        end: iv.end,
        durationDays: (iv.end - iv.start) / 86400000,
        midDate: new Date((iv.start.getTime() + iv.end.getTime()) / 2),
        ageAtReference: computeAge(iv.start, referenceDate),
      });
    }

    if (onProgress) onProgress(year - startYear + 1, totalYears);
  }

  // Build per-planet infeasibility diagnostic. A planet is flagged when:
  //  (a) no requested sign was ever available in this range, OR
  //  (b) every year had zero matching intervals (too narrow a slice to catch).
  // In (b) the `available` list tells the user what signs they COULD use.
  for (const planet of constrainedPlanets) {
    const zeroYears = _diagPerPlanetZeroYears.get(planet) || 0;
    const requested = [...normalizedSigns[planet]];
    const availSet = _diagPerPlanetAvailableSigns.get(planet) || new Set();
    const available = [...availSet];
    const overlap = requested.filter(s => availSet.has(s));
    if (overlap.length === 0 || zeroYears === totalYears) {
      infeasible.push({ planet, requested, available, zeroYears });
    }
  }

  // If every year failed, surface the error so the user doesn't see a
  // misleading "No matches" when the real issue is a backend / auth failure.
  if (failedYears.length === totalYears && firstError) {
    const err = new Error(
      `All ${totalYears} year(s) failed to fetch ingresses. ` +
      `Is the 'all_planet_ingresses' Cloud Function deployed? ` +
      `Underlying: ${firstError.message}`
    );
    err.cause = firstError;
    throw err;
  }

  // ── Phase 2: refine by house / Rising constraints (time-of-day search) ──
  const activeHouseConstraints = filterActiveHouseConstraints(houseConstraints);
  const risingConstrained = !!normalizedSigns[ASCENDANT_KEY];
  const needsTimeSweep =
    Object.keys(activeHouseConstraints).length > 0 ||
    risingConstrained ||
    !!scoreMode; // scoreMode always needs frame-level scoring

  if (!needsTimeSweep) {
    return { candidates, constrainedPlanets, houseConstrained: false, failedYears, infeasible };
  }

  if (!location || location.lat == null || location.lng == null || !timezone) {
    throw new Error(
      'House or Rising constraints require a birth location and timezone. ' +
      'Set the Birth Location field before searching.'
    );
  }

  const refined = await refineCandidatesWithHouses({
    candidates,
    normalizedSigns,
    houseConstraints: activeHouseConstraints,
    location,
    timezone,
    stepMinutes: sweepStepMinutes,
    referenceDate,
    onProgress,
    scoreMode,
    signal,
  });

  return {
    candidates: refined,
    constrainedPlanets,
    houseConstrained: true, // kept truthy to trigger "Local start/end" columns
    failedYears,
    infeasible,
  };
}

/**
 * Weighted match — runs the sign-intersection pre-pass for HARD planets only
 * (Rising + Sun), then time-sweeps the resulting windows and scores every
 * frame. Returns candidates at or above `threshold` (0-100), sorted by score.
 *
 * Extra params over findBirthDateCandidates:
 *   - threshold: 0..100 (default 75) — minimum pct to keep
 *   - weights: { planet: number } — overrides default weights
 *   - maxResults: cap returned candidates (default 100)
 */
export async function findWeighted(params) {
  const { threshold = 75, weights: weightsOverride, maxResults = 100, ...rest } = params;

  const weights = {
    Ascendant: Infinity, Sun: Infinity,
    Moon: 8, Venus: 6, Mars: 5, Mercury: 4,
    Saturn: 3, Jupiter: 3, Pluto: 2, Uranus: 1, Neptune: 1,
    ...(weightsOverride || {}),
  };

  const result = await findBirthDateCandidates({
    ...rest,
    scoreMode: { threshold, weights },
  });

  const sorted = [...(result.candidates || [])].sort(
    (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
  );

  return {
    ...result,
    candidates: sorted.slice(0, maxResults),
    totalFound: sorted.length,
    houseConstrained: true, // always true in weighted (we always time-sweep)
    mode: 'weighted',
    threshold,
    weights,
  };
}

// (legacy two-pass implementation kept below for reference — unused)
async function _findWeightedLegacy_unused(params) {
  const {
    signConstraints = {},
    houseConstraints = {},
    threshold = 75,
    weights: weightsOverride,
    maxResults = 100,
    location,
    timezone,
    ...rest
  } = params;

  // Derive weights: default planetary + user overrides
  const weights = {
    Ascendant: Infinity, Sun: Infinity,
    Moon: 8, Venus: 6, Mars: 5, Mercury: 4,
    Saturn: 3, Jupiter: 3, Pluto: 2, Uranus: 1, Neptune: 1,
    ...(weightsOverride || {}),
  };

  // Step 1: run a relaxed candidate-windows search using only HARD-constrained
  // planets (whatever has weight=Infinity). This gives the feasibility
  // envelope cheaply without needing every planet to match.
  const hardSigns = {};
  for (const p of [...PLANET_ORDER, ASCENDANT_KEY]) {
    if (weights[p] === Infinity && signConstraints[p]) {
      hardSigns[p] = signConstraints[p];
    }
  }
  const hardHouses = {};
  for (const p of PLANET_ORDER) {
    if (weights[p] === Infinity && houseConstraints[p]) {
      hardHouses[p] = houseConstraints[p];
    }
  }

  // If no hard constraints, fall back to the full signConstraints to avoid
  // scanning every year at every minute (too expensive).
  const hardHasAny = Object.keys(hardSigns).length > 0 || Object.keys(hardHouses).length > 0;
  const firstPass = await findBirthDateCandidates({
    ...rest,
    signConstraints: hardHasAny ? hardSigns : signConstraints,
    houseConstraints: hardHasAny ? hardHouses : houseConstraints,
    location, timezone,
  });

  // Step 2: if the hard pre-pass yielded candidates, re-score each frame in
  // them against the FULL (soft+hard) constraints. If no time-sweep happened
  // (no house/Rising constraints), fall back to the per-year scoring via a
  // day-sweep around each candidate window.
  if (firstPass.candidates.length === 0) {
    return {
      ...firstPass,
      mode: 'weighted',
      threshold,
      weights,
    };
  }

  // If firstPass already includes time-of-day precision (houseConstrained),
  // re-score each candidate in place. Otherwise we need to sweep time to get
  // frames. For MVP, only support the time-swept path for full scoring.
  if (!firstPass.houseConstrained) {
    // No time sweep happened → we only have date-level candidates.
    // Score them at noon-local as a sample to rank roughly.
    return {
      ...firstPass,
      mode: 'weighted',
      threshold,
      weights,
      weightedNote: 'Date-level scoring (no house/Rising constraint provided — scored at noon approximation).',
    };
  }

  // Re-sweep the firstPass candidate windows with scoring enabled.
  const normalizedSigns = {};
  for (const p of [...PLANET_ORDER, ASCENDANT_KEY]) {
    const raw = signConstraints?.[p];
    if (!raw) { normalizedSigns[p] = null; continue; }
    const arr = Array.isArray(raw) ? raw : [raw];
    normalizedSigns[p] = arr.length > 0 ? new Set(arr) : null;
  }
  const normHouses = {};
  for (const p of PLANET_ORDER) {
    const h = parseInt(houseConstraints[p], 10);
    if (h >= 1 && h <= 12) normHouses[p] = h;
  }

  // Gather unique local dates across all firstPass candidates and batch-fetch
  const localDatesSet = new Set();
  const perCandidateDates = firstPass.candidates.map(c => {
    const dates = listLocalDatesCovering(c.start, c.end, timezone);
    dates.forEach(d => localDatesSet.add(d));
    return dates;
  });

  const frameCache = new Map();
  const dateList = [...localDatesSet].sort();
  for (const d of dateList) {
    try {
      const resp = await batchChartPositions({
        birthDate: d,
        latitude: location.lat,
        longitude: location.lng,
        timezone,
        startMinutes: 0, endMinutes: 1439, stepMinutes: 5,
      });
      frameCache.set(d, resp?.result?.frames || []);
    } catch {
      frameCache.set(d, []);
    }
  }

  // Score every frame inside each candidate window
  const scoredCandidates = [];
  for (let i = 0; i < firstPass.candidates.length; i++) {
    const c = firstPass.candidates[i];
    const dates = perCandidateDates[i];
    const passing = [];
    for (const d of dates) {
      for (const frame of (frameCache.get(d) || [])) {
        const utcInstant = localWallClockToUtc(d, frame.minutes, timezone);
        if (utcInstant < c.start || utcInstant >= c.end) continue;
        const result = scoreFrame(frame, normalizedSigns, normHouses, weights);
        if (!result) continue; // hard fail
        if (result.pct < threshold) continue;
        passing.push({ frame, localDate: d, utcInstant, ...result });
      }
    }
    if (passing.length === 0) continue;
    passing.sort((a, b) => a.utcInstant - b.utcInstant);

    // Group contiguous (≤10 min gap) into sub-windows, keep each window's best score
    let runStart = passing[0], runEnd = passing[0], runBest = passing[0];
    const runs = [];
    for (let k = 1; k < passing.length; k++) {
      const pf = passing[k];
      if (pf.utcInstant - runEnd.utcInstant <= 10 * 60 * 1000) {
        runEnd = pf;
        if (pf.pct > runBest.pct) runBest = pf;
      } else {
        runs.push({ start: runStart, end: runEnd, best: runBest });
        runStart = pf; runEnd = pf; runBest = pf;
      }
    }
    runs.push({ start: runStart, end: runEnd, best: runBest });

    for (const r of runs) {
      scoredCandidates.push({
        year: c.year,
        start: r.start.utcInstant,
        end: new Date(r.end.utcInstant.getTime() + 5 * 60 * 1000),
        durationDays: ((r.end.utcInstant - r.start.utcInstant) + 5 * 60 * 1000) / 86400000,
        localStart: `${r.start.localDate} ${r.start.frame.timeLabel}`,
        localEnd: `${r.end.localDate} ${r.end.frame.timeLabel}`,
        ageAtReference: Math.max(0, new Date().getUTCFullYear() - c.year),
        matchScore: Math.round(r.best.pct),
        matched: r.best.matched,
        missed: r.best.missed,
      });
    }
  }

  // Collapse overlapping windows: one row per local date at its peak score.
  // Without this, a 2.4-hour passing window produces dozens of near-identical
  // 5-minute slices (same astrological moment, different sliding windows).
  const bestByDay = new Map();
  for (const c of scoredCandidates) {
    const dayKey = (c.localStart || c.start.toISOString()).slice(0, 10);
    const prev = bestByDay.get(dayKey);
    if (!prev || c.matchScore > prev.matchScore ||
        (c.matchScore === prev.matchScore && c.durationDays > prev.durationDays)) {
      bestByDay.set(dayKey, c);
    }
  }
  const deduped = [...bestByDay.values()];

  // Sort by score DESC, cap
  deduped.sort((a, b) => b.matchScore - a.matchScore);
  const capped = deduped.slice(0, maxResults);

  return {
    ...firstPass,
    candidates: capped,
    totalFound: scoredCandidates.length,
    distinctDays: deduped.length,
    mode: 'weighted',
    threshold,
    weights,
  };
}

/**
 * Progressive match — tries strict first; if 0 candidates, iteratively drops
 * the lowest-priority constraint (both sign and house of that planet) and
 * retries. Stops when candidates are found or only one constraint remains.
 *
 * Accepts the same params as findBirthDateCandidates plus:
 *   - minPriority (default 100) — never drop constraints at or above this
 *     level (so Rising=110 and Sun=100 are preserved).
 *
 * Returns the same result shape plus:
 *   - droppedConstraints: [{planet, tier}] — which items were relaxed
 *   - attempts: [{dropped, count}] — audit trail
 */
export async function findProgressively(params) {
  const { signConstraints = {}, houseConstraints = {}, minPriority = 100 } = params;

  // Collect all currently-set constraints, sorted by priority ASCENDING
  // (lowest priority first — these get dropped first).
  const droppable = [];
  for (const planet of [...PLANET_ORDER, ASCENDANT_KEY]) {
    const hasSign = !!signConstraints[planet] &&
      (Array.isArray(signConstraints[planet]) ? signConstraints[planet].length > 0 : true);
    const hasHouse = houseConstraints[planet] != null && houseConstraints[planet] !== '';
    if (hasSign || hasHouse) {
      const tier = CONSTRAINT_PRIORITY[planet] ?? 0;
      if (tier < minPriority) droppable.push({ planet, tier });
    }
  }
  droppable.sort((a, b) => a.tier - b.tier);

  const attempts = [];
  const droppedSoFar = [];
  let liveSignConstraints = { ...signConstraints };
  let liveHouseConstraints = { ...houseConstraints };

  // Attempt 0: full strict
  let result = await findBirthDateCandidates({
    ...params,
    signConstraints: liveSignConstraints,
    houseConstraints: liveHouseConstraints,
  });
  attempts.push({ dropped: [], count: result.candidates.length });
  if (result.candidates.length > 0) {
    return { ...result, droppedConstraints: [], attempts, progressive: true };
  }

  // Progressive drops
  for (const { planet, tier } of droppable) {
    liveSignConstraints = { ...liveSignConstraints, [planet]: [] };
    liveHouseConstraints = { ...liveHouseConstraints, [planet]: '' };
    droppedSoFar.push({ planet, tier });

    result = await findBirthDateCandidates({
      ...params,
      signConstraints: liveSignConstraints,
      houseConstraints: liveHouseConstraints,
    });
    attempts.push({
      dropped: droppedSoFar.map(d => d.planet),
      count: result.candidates.length,
    });
    if (result.candidates.length > 0) break;
  }

  return {
    ...result,
    droppedConstraints: droppedSoFar,
    attempts,
    progressive: true,
  };
}

function filterActiveHouseConstraints(houseConstraints) {
  const out = {};
  for (const p of PLANET_ORDER) {
    const h = houseConstraints?.[p];
    if (h && Number.isInteger(h) && h >= 1 && h <= 12) out[p] = h;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// House refinement — sweep time-of-day at the given location and filter frames
// ─────────────────────────────────────────────────────────────────────────────

const _planetFrameKey = (p) => p.toLowerCase();

/**
 * For a given local date (YYYY-MM-DD), compute the UTC start/end of that
 * calendar day in the specified timezone. Used to decide which date-batches
 * we need and to map frames back into the UTC candidate window.
 *
 * We use a direct conversion: batchChartPositions receives local date + minutes
 * + timezone, and internally converts to UTC. From the frame's perspective, we
 * can reconstruct the UTC instant by reverse-applying the offset. To avoid
 * messing with DST subtleties, we ask the endpoint to cover the full 0-1439 of
 * every local date that might touch the candidate window, then filter frames
 * back into the [start, end) UTC interval client-side.
 */
function listLocalDatesCovering(utcStart, utcEnd, timezone) {
  // Add ±1 day padding so a local date that bleeds into the window at one edge
  // gets included. Filtering later ensures we don't keep frames outside [start,end).
  const pad = 24 * 3600 * 1000;
  const s = new Date(utcStart.getTime() - pad);
  const e = new Date(utcEnd.getTime() + pad);
  const out = [];
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  // Walk in 6-hour steps — more than enough to visit every local date once.
  for (let t = s.getTime(); t <= e.getTime(); t += 6 * 3600 * 1000) {
    const d = fmt.format(new Date(t)); // YYYY-MM-DD
    if (!out.includes(d)) out.push(d);
  }
  return out;
}

/**
 * Convert a frame (local date + local minutes + IANA timezone) back to a UTC
 * Date. Uses Intl to determine the offset of that wall-clock instant in that zone.
 */
function localWallClockToUtc(localDate, localMinutes, timezone) {
  const h = Math.floor(localMinutes / 60);
  const m = localMinutes % 60;
  // Naive "as-UTC" instant — we then correct by the zone's offset at that moment.
  const naiveUtc = Date.UTC(
    Number(localDate.slice(0, 4)),
    Number(localDate.slice(5, 7)) - 1,
    Number(localDate.slice(8, 10)),
    h, m, 0, 0
  );
  const offsetMs = tzOffsetMsAt(naiveUtc, timezone);
  return new Date(naiveUtc - offsetMs);
}

/**
 * Return the timezone offset (ms east of UTC) at the given UTC instant.
 * Uses Intl parts to read the zone's wall-clock, then subtracts.
 */
function tzOffsetMsAt(utcInstant, timezone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(utcInstant)).map(p => [p.type, p.value])
  );
  const asUTC = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour === '24' ? '00' : parts.hour),
    Number(parts.minute), Number(parts.second)
  );
  return asUTC - utcInstant;
}

async function refineCandidatesWithHouses({
  candidates,
  normalizedSigns,
  houseConstraints,
  location,
  timezone,
  stepMinutes,
  referenceDate,
  onProgress,
  scoreMode = null,
  signal = null,
}) {
  const throwIfAborted = () => {
    if (signal?.aborted) {
      const err = new Error('Search cancelled');
      err.name = 'AbortError';
      throw err;
    }
  };
  // Gather unique local dates to batch across ALL candidate windows, so if two
  // windows share a day we only fetch it once.
  const allDates = new Set();
  const perCandidateDates = candidates.map(c => {
    const dates = listLocalDatesCovering(c.start, c.end, timezone);
    dates.forEach(d => allDates.add(d));
    return dates;
  });

  const dateList = [...allDates].sort();
  const frameCache = new Map(); // localDate -> frames array

  let done = 0;
  for (const localDate of dateList) {
    throwIfAborted();
    try {
      const resp = await batchChartPositions({
        birthDate: localDate,
        latitude: location.lat,
        longitude: location.lng,
        timezone,
        startMinutes: 0,
        endMinutes: 1439,
        stepMinutes,
      });
      const frames = resp?.result?.frames || [];
      frameCache.set(localDate, frames);
    } catch (err) {
      console.error(`[reverseEngine] sweep failed for ${localDate}:`, err);
      frameCache.set(localDate, []);
    }
    done++;
    if (onProgress) onProgress(done, dateList.length, 'houses');
  }

  // For each candidate, scan its frames, filter by constraints, group into runs.
  const refined = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const dates = perCandidateDates[i];
    const passingFrames = [];

    for (const d of dates) {
      const frames = frameCache.get(d) || [];
      for (const frame of frames) {
        const utcInstant = localWallClockToUtc(d, frame.minutes, timezone);
        if (utcInstant < c.start || utcInstant >= c.end) continue;
        if (scoreMode) {
          const result = scoreFrame(frame, normalizedSigns, houseConstraints, scoreMode.weights);
          if (!result) continue;
          if (result.pct < scoreMode.threshold) continue;
          passingFrames.push({ frame, localDate: d, utcInstant, ...result });
        } else {
          if (!framePassesConstraints(frame, normalizedSigns, houseConstraints)) continue;
          passingFrames.push({ frame, localDate: d, utcInstant });
        }
      }
    }

    if (passingFrames.length === 0) continue;
    passingFrames.sort((a, b) => a.utcInstant - b.utcInstant);

    // Group contiguous frames (gap <= 2 * stepMinutes) into sub-windows
    const gapMs = 2 * stepMinutes * 60 * 1000;
    let runStart = passingFrames[0];
    let runEnd = passingFrames[0];
    let runBest = passingFrames[0];
    const runs = [];
    for (let k = 1; k < passingFrames.length; k++) {
      const pf = passingFrames[k];
      if (pf.utcInstant - runEnd.utcInstant <= gapMs) {
        runEnd = pf;
        if (scoreMode && (pf.pct ?? 0) > (runBest.pct ?? 0)) runBest = pf;
      } else {
        runs.push({ start: runStart, end: runEnd, best: runBest });
        runStart = pf;
        runEnd = pf;
        runBest = pf;
      }
    }
    runs.push({ start: runStart, end: runEnd, best: runBest });

    for (const r of runs) {
      refined.push({
        year: c.year,
        start: r.start.utcInstant,
        end: new Date(r.end.utcInstant.getTime() + stepMinutes * 60 * 1000),
        durationDays:
          ((r.end.utcInstant - r.start.utcInstant) + stepMinutes * 60 * 1000) /
          86400000,
        midDate: new Date(
          (r.start.utcInstant.getTime() + r.end.utcInstant.getTime()) / 2
        ),
        ageAtReference: computeAge(r.start.utcInstant, referenceDate),
        localStart: `${r.start.localDate} ${r.start.frame.timeLabel}`,
        localEnd: `${r.end.localDate} ${r.end.frame.timeLabel}`,
        frameCount:
          1 +
          Math.round(
            (r.end.utcInstant - r.start.utcInstant) / (stepMinutes * 60 * 1000)
          ),
        ...(scoreMode && r.best ? {
          matchScore: Math.round(r.best.pct),
          softScore: Math.round(r.best.softPct ?? 0),
          matched: r.best.matched,
          missed: r.best.missed,
        } : {}),
      });
    }
  }

  return refined;
}

/**
 * Takes `normalizedSigns` (map of planet → Set<string> | null) and
 * `houseConstraints` (map of planet → integer).
 */
/**
 * Weighted frame score. Rising and Sun are HARD (failing either → null, frame
 * rejected). All other constrained planets contribute their weight if hit,
 * zero if missed. Returns { score, maxScore, pct, matched, missed }.
 */
export function scoreFrame(frame, normalizedSigns, houseConstraints, weights) {
  const matched = [];
  const missed = [];
  let score = 0;
  let maxScore = 0;
  // Separate tally for SOFT constraints only — lets the UI show a more
  // intuitive "compatibility %" that excludes the guaranteed Sun+Rising
  // (since those are hard-matched for every returned candidate).
  let softScore = 0;
  let softMax = 0;

  const check = (planet, framePlanet) => {
    const sSet = normalizedSigns?.[planet];
    const hConstraint = houseConstraints?.[planet];
    if (!sSet && !hConstraint) return true; // no constraint → ignore
    const w = weights?.[planet] ?? 1;
    const isHard = w === Infinity;
    const effectiveW = isHard ? HARD_EFFECTIVE_WEIGHT : w;
    maxScore += effectiveW;
    if (!isHard) softMax += effectiveW;

    // Sign scoring: hard = binary, soft chemistry planets = partial credit.
    let signCredit = 1;
    if (sSet) {
      if (isHard) {
        signCredit = sSet.has(framePlanet?.sign) ? 1 : 0;
      } else if (PARTIAL_CREDIT_PLANETS.has(planet)) {
        signCredit = signPartialCredit(framePlanet?.sign, sSet);
      } else {
        signCredit = sSet.has(framePlanet?.sign) ? 1 : 0;
      }
    }
    // House is binary — either in the required house or not.
    let houseOk = true;
    if (hConstraint && framePlanet?.house !== hConstraint) houseOk = false;

    const awarded = (houseOk ? signCredit : 0) * effectiveW;
    const isFullHit = signCredit === 1 && houseOk;

    if (isHard && !isFullHit) return false; // hard fail
    score += awarded;
    if (!isHard) softScore += awarded;

    const detail = {
      planet,
      wantedSigns: sSet ? [...sSet] : null,
      wantedHouse: hConstraint || null,
      got: framePlanet,
      points: Math.round(awarded * 10) / 10,
      maxPoints: effectiveW,
      credit: Math.round((awarded / Math.max(effectiveW, 0.0001)) * 100) / 100,
      partial: !isFullHit && awarded > 0,
    };
    if (isFullHit) matched.push(detail);
    else if (awarded > 0) matched.push(detail);   // partial credit still counts as matched (shown differently)
    else missed.push(detail);
    return true;
  };

  for (const planet of PLANET_ORDER) {
    const p = frame.planets?.[_planetFrameKey(planet)];
    if (!p) {
      // missing planet data = skip, don't penalize
      continue;
    }
    const ok = check(planet, p);
    if (!ok) return null; // hard fail
  }

  // Rising (ascendant) — house is always 1 by def, sign only
  const risingSet = normalizedSigns?.[ASCENDANT_KEY];
  if (risingSet) {
    const w = weights?.[ASCENDANT_KEY] ?? 1;
    const isHard = w === Infinity;
    const effectiveW = isHard ? HARD_EFFECTIVE_WEIGHT : w;
    maxScore += effectiveW;
    if (!isHard) softMax += effectiveW;
    const ascSign = frame.ascendant?.sign;
    const hit = risingSet.has(ascSign);
    const awarded = hit ? effectiveW : 0;
    if (isHard && !hit) return null;
    score += awarded;
    if (!isHard) softScore += awarded;
    const detail = {
      planet: ASCENDANT_KEY,
      wantedSigns: [...risingSet],
      got: frame.ascendant,
      points: awarded,
      maxPoints: effectiveW,
      credit: hit ? 1 : 0,
      partial: false,
    };
    if (hit) matched.push(detail); else missed.push(detail);
  }

  const pct = maxScore > 0 ? (score / maxScore) * 100 : 100;
  const softPct = softMax > 0 ? (softScore / softMax) * 100 : 100;
  return { score, maxScore, pct, softScore, softMax, softPct, matched, missed };
}

function framePassesConstraints(frame, normalizedSigns, houseConstraints) {
  for (const planet of PLANET_ORDER) {
    const sSet = normalizedSigns?.[planet];
    const hConstraint = houseConstraints?.[planet];
    if (!sSet && !hConstraint) continue;
    const p = frame.planets?.[_planetFrameKey(planet)];
    if (!p) return false;
    if (sSet && !sSet.has(p.sign)) return false;
    if (hConstraint && p.house !== hConstraint) return false;
  }
  const risingSet = normalizedSigns?.[ASCENDANT_KEY];
  if (risingSet && !risingSet.has(frame.ascendant?.sign)) return false;
  return true;
}

function computeAge(birthDate, referenceDate) {
  const bYear = birthDate.getUTCFullYear();
  const rYear = referenceDate.getUTCFullYear();
  const bMonth = birthDate.getUTCMonth();
  const rMonth = referenceDate.getUTCMonth();
  const bDay = birthDate.getUTCDate();
  const rDay = referenceDate.getUTCDate();
  let age = rYear - bYear;
  if (rMonth < bMonth || (rMonth === bMonth && rDay < bDay)) age -= 1;
  return age;
}

/**
 * Format a candidate as a human-readable string.
 */
export function formatCandidate(candidate) {
  const fmt = (d) => d.toISOString().slice(0, 10);
  const days = candidate.durationDays;
  const dur = days < 1
    ? `${(days * 24).toFixed(1)}h`
    : `${days.toFixed(1)}d`;
  return `${fmt(candidate.start)} → ${fmt(candidate.end)}  (${dur}, age ${candidate.ageAtReference})`;
}
