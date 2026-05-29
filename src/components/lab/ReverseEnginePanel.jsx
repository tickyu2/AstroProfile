import React, { useEffect, useMemo, useState } from 'react';
import LocationPicker from '../common/LocationPicker';
import {
  findBirthDateCandidates,
  findProgressively,
  findWeighted,
  getEraSignsForYearRange,
  PLANET_ORDER,
  ASCENDANT_KEY,
  CONSTRAINT_PRIORITY,
  SIGNS,
} from '../../services/reverseEngineService';
import { getHistoricalTimezone } from '../../services/timezoneService';
import {
  suggestPresets,
  detectCoreNeeds,
  computePlanetWeights,
  PRESET_TRADEOFFS,
} from '../../services/compatibilityPresetService';

const YEAR_MIN = 1950;
const YEAR_MAX = 2026;

const PLANET_GLYPHS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  [ASCENDANT_KEY]: '↑',
};

function makeInitialConstraints() {
  const base = PLANET_ORDER.reduce((acc, p) => ({ ...acc, [p]: [] }), {});
  base[ASCENDANT_KEY] = [];
  return base;
}

function makeInitialHouses() {
  return PLANET_ORDER.reduce((acc, p) => ({ ...acc, [p]: '' }), {});
}
function parseHouseConstraints(raw) {
  const out = {};
  for (const p of PLANET_ORDER) {
    const v = raw?.[p];
    if (v && v !== '') {
      const n = parseInt(v, 10);
      if (n >= 1 && n <= 12) out[p] = n;
    }
  }
  return out;
}

// Age-offset presets: partner-relative-to-self. Returns [youngestOffset, oldestOffset]
// where positive = partner is N years younger (born later), negative = older.
const AGE_RANGE_PRESETS = {
  'For male partner': { younger: 1, older: 25 }, // 1y younger → 25y older
  'Peer range (±5y)': { younger: 5, older: 5 },
  'For female partner': { younger: 25, older: 2 }, // 25y younger → 2y older
};

function birthYearFromProfile(p) {
  if (!p) return null;
  const bd = p.birthDate || p.birth?.birthDate || p.birthday;
  if (!bd) return null;
  const y = parseInt(String(bd).slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

// Haversine great-circle distance between two lat/lng points, in km.
function haversineKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some(v => v == null || isNaN(v))) return null;
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

function formatKm(km) {
  if (km == null) return '';
  if (km < 1) return '<1 km';
  if (km < 100) return `${km.toFixed(0)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

function selfLocationFromProfile(p) {
  if (!p) return null;
  const lat = p.birthLat ?? p.birth?.location?.latitude ?? p.location?.coordinates?.lat;
  const lng = p.birthLng ?? p.birth?.location?.longitude ?? p.location?.coordinates?.lng;
  const name = p.location?.fullAddress || p.location?.city || p.birthPlace || '';
  if (lat == null || lng == null) return null;
  return { lat: Number(lat), lng: Number(lng), name };
}

// ─── Cultural-affinity clusters ────────────────────────────────────────────
// Heuristic groupings where in-market dating pools overlap. These are soft
// hints, not hard filters — the UI flags "same affinity" vs "cross-cultural"
// so users can eyeball realism before trusting a high match score.
const CULTURAL_CLUSTERS = [
  { id: 'greater_china', label: 'Greater China',
    members: ['china', 'hong kong', 'taiwan', 'macau', 'macao', 'hongkong'],
    reps: [
      { name: 'Shanghai, China',  region: 'East · Beijing / seaboard',         lat: 31.2304, lng: 121.4737 },
      { name: 'Chongqing, China', region: 'West · Sichuan / Chengdu',          lat: 29.5630, lng: 106.5516 },
      { name: 'Shenzhen, China',  region: 'South · Guangdong / Hong Kong',     lat: 22.5431, lng: 114.0579 },
    ] },
  { id: 'japan', label: 'Japan', members: ['japan'],
    reps: [{ name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 }] },
  { id: 'korea', label: 'Korea', members: ['south korea', 'north korea', 'korea', 'republic of korea'],
    reps: [{ name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 }] },
  { id: 'thai_lao', label: 'Thai / Lao', members: ['thailand', 'laos', "lao people's democratic republic"],
    reps: [{ name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 }] },
  { id: 'vietnam', label: 'Vietnam', members: ['vietnam', 'viet nam'],
    reps: [{ name: 'Ho Chi Minh City, Vietnam', lat: 10.8231, lng: 106.6297 }] },
  { id: 'maritime_sea', label: 'Maritime SE Asia',
    members: ['indonesia', 'malaysia', 'singapore', 'brunei', 'philippines'],
    reps: [
      { name: 'Manila, Philippines', region: 'Philippines',                   lat: 14.5995, lng: 120.9842 },
      { name: 'Jakarta, Indonesia',  region: 'Indonesia',                     lat: -6.2088, lng: 106.8456 },
      { name: 'Singapore',           region: 'Singapore / Malaysia',          lat:  1.3521, lng: 103.8198 },
    ] },
  { id: 'south_asia', label: 'South Asia',
    members: ['india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan'],
    reps: [{ name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 }] },
  { id: 'hispanic_americas', label: 'Spanish-speaking Americas',
    members: ['mexico', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica',
              'panama', 'colombia', 'venezuela', 'ecuador', 'peru', 'bolivia', 'chile',
              'argentina', 'paraguay', 'uruguay', 'cuba', 'dominican republic',
              'puerto rico', 'spain'],
    reps: [
      { name: 'Mexico City, Mexico',     region: 'Mexico / Central America',  lat: 19.4326, lng: -99.1332 },
      { name: 'Bogotá, Colombia',        region: 'Northern South America',    lat:  4.7110, lng: -74.0721 },
      { name: 'Buenos Aires, Argentina', region: 'Southern Cone',             lat: -34.6037, lng: -58.3816 },
    ] },
  { id: 'brazil_pt', label: 'Lusophone', members: ['brazil', 'portugal'],
    reps: [{ name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 }] },
  { id: 'anglo_north_america', label: 'USA / Canada',
    members: ['united states', 'united states of america', 'usa', 'canada'],
    reps: [
      { name: 'Los Angeles, USA', region: 'West Coast',                       lat: 34.0522, lng: -118.2437 },
      { name: 'New York, USA',    region: 'East Coast',                       lat: 40.7128, lng:  -74.0060 },
      { name: 'Toronto, Canada',  region: 'Canada',                           lat: 43.6532, lng:  -79.3832 },
    ] },
  { id: 'uk_ireland', label: 'UK / Ireland',
    members: ['united kingdom', 'uk', 'england', 'scotland', 'wales', 'ireland', 'northern ireland'],
    reps: [{ name: 'London, UK', lat: 51.5074, lng: -0.1278 }] },
  { id: 'francophone', label: 'Francophone Europe',
    members: ['france', 'belgium', 'switzerland', 'luxembourg', 'monaco'],
    reps: [{ name: 'Paris, France', lat: 48.8566, lng: 2.3522 }] },
  { id: 'german_dach', label: 'German-speaking', members: ['germany', 'austria'],
    reps: [{ name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 }] },
  { id: 'nordic', label: 'Nordic',
    members: ['sweden', 'norway', 'denmark', 'finland', 'iceland'],
    reps: [{ name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686 }] },
  { id: 'eastern_europe', label: 'Eastern Europe',
    members: ['russia', 'ukraine', 'poland', 'czech republic', 'czechia', 'slovakia', 'hungary',
              'romania', 'bulgaria', 'serbia', 'croatia', 'bosnia and herzegovina', 'bosnia',
              'slovenia', 'north macedonia', 'macedonia', 'albania', 'moldova', 'belarus',
              'estonia', 'latvia', 'lithuania', 'montenegro', 'kosovo'],
    reps: [
      { name: 'Warsaw, Poland', region: 'Central Europe',                     lat: 52.2297, lng: 21.0122 },
      { name: 'Moscow, Russia', region: 'Russia / former USSR',               lat: 55.7558, lng: 37.6173 },
    ] },
  { id: 'mediterranean', label: 'Mediterranean Europe',
    members: ['italy', 'greece', 'cyprus', 'malta'],
    reps: [
      { name: 'Athens, Greece', region: 'Greece / Cyprus',                    lat: 37.9838, lng: 23.7275 },
      { name: 'Rome, Italy',    region: 'Italy / Malta',                      lat: 41.9028, lng: 12.4964 },
    ] },
  { id: 'arabic', label: 'Arabic-speaking',
    members: ['saudi arabia', 'uae', 'united arab emirates', 'egypt', 'morocco', 'algeria',
              'tunisia', 'jordan', 'lebanon', 'syria', 'iraq', 'qatar', 'kuwait', 'oman',
              'bahrain', 'yemen', 'libya', 'sudan'],
    reps: [{ name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 }] },
];

function countryFromFormatted(formatted) {
  if (!formatted) return null;
  const parts = String(formatted).split(',').map(s => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || null;
}

function clusterOfCountry(country) {
  const c = (country || '').toLowerCase().trim();
  if (!c) return null;
  for (const cluster of CULTURAL_CLUSTERS) {
    if (cluster.members.some(m => c === m || c.includes(m))) return cluster;
  }
  return null;
}

function affinityVerdict(selfCountry, searchCountry) {
  if (!selfCountry || !searchCountry) return null;
  const selfClean = selfCountry.toLowerCase().trim();
  const searchClean = searchCountry.toLowerCase().trim();
  if (selfClean === searchClean) {
    return { level: 'same_country', label: 'Same country', tone: 'emerald' };
  }
  const selfCluster = clusterOfCountry(selfCountry);
  const searchCluster = clusterOfCountry(searchCountry);
  if (selfCluster && searchCluster && selfCluster.id === searchCluster.id) {
    return {
      level: 'same_cluster',
      label: `Same affinity (${selfCluster.label})`,
      tone: 'cyan',
    };
  }
  return {
    level: 'cross_cultural',
    label: 'Cross-cultural',
    tone: 'amber',
  };
}

// When the user has declared partner-cultural preferences, override the
// birthplace-based verdict. Birthplace is a weak signal for anyone with a
// multicultural history (third-culture kids, immigrants, diaspora).
function verdictFromPrefs(searchCountry, prefs, fallbackSelfCountry) {
  const searchCluster = clusterOfCountry(searchCountry);
  const hasAnyPref = prefs && (prefs.preferred.length + prefs.open.length + prefs.excluded.length) > 0;
  if (!hasAnyPref) return affinityVerdict(fallbackSelfCountry, searchCountry);
  if (!searchCluster) {
    return { level: 'unknown_cluster', label: 'Cluster unknown', tone: 'slate' };
  }
  if (prefs.excluded.includes(searchCluster.id)) {
    return { level: 'excluded', label: `Excluded (${searchCluster.label})`, tone: 'red' };
  }
  if (prefs.preferred.includes(searchCluster.id)) {
    return { level: 'preferred', label: `Preferred (${searchCluster.label})`, tone: 'emerald' };
  }
  if (prefs.open.includes(searchCluster.id)) {
    return { level: 'open', label: `Open (${searchCluster.label})`, tone: 'cyan' };
  }
  return { level: 'not_listed', label: `Not in your preferences (${searchCluster.label})`, tone: 'slate' };
}

const EMPTY_PREFS = { preferred: [], open: [], excluded: [] };
function loadPrefs(profileId) {
  try {
    const raw = localStorage.getItem(`reverseEnginePrefs:${profileId || 'default'}`);
    if (!raw) return EMPTY_PREFS;
    const p = JSON.parse(raw);
    return {
      preferred: Array.isArray(p.preferred) ? p.preferred : [],
      open: Array.isArray(p.open) ? p.open : [],
      excluded: Array.isArray(p.excluded) ? p.excluded : [],
    };
  } catch { return EMPTY_PREFS; }
}
function savePrefs(profileId, prefs) {
  try { localStorage.setItem(`reverseEnginePrefs:${profileId || 'default'}`, JSON.stringify(prefs)); } catch {}
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '0s';
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

// Compute a { birthDate:'YYYY-MM-DD', birthTime:'HH:MM' } pair at the midpoint
// of a candidate window, expressed in the given IANA timezone.
function candidateMidLocal(c, timezone) {
  const midMs = (c.start.getTime() + c.end.getTime()) / 2;
  const mid = new Date(midMs);
  if (!timezone) {
    const iso = mid.toISOString();
    return { birthDate: iso.slice(0, 10), birthTime: iso.slice(11, 16) };
  }
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = fmt.formatToParts(mid);
    const get = (t) => parts.find(p => p.type === t)?.value || '';
    let hh = get('hour');
    if (hh === '24') hh = '00';
    return {
      birthDate: `${get('year')}-${get('month')}-${get('day')}`,
      birthTime: `${hh}:${get('minute')}`,
    };
  } catch {
    const iso = mid.toISOString();
    return { birthDate: iso.slice(0, 10), birthTime: iso.slice(11, 16) };
  }
}

export default function ReverseEnginePanel({ profiles = [], onLoadChart }) {
  const [location, setLocation] = useState(null);
  const [startYear, setStartYear] = useState(1950);
  const [endYear, setEndYear] = useState(2026);
  const [selfProfileId, setSelfProfileId] = useState('');
  const [constraints, setConstraints] = useState(makeInitialConstraints);
  const [houseConstraints, setHouseConstraints] = useState(makeInitialHouses);

  const [timezone, setTimezone] = useState(null);
  const [tzLoading, setTzLoading] = useState(false);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, phase: 'signs' });
  const [searchStartedAt, setSearchStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [matchQuality, setMatchQuality] = useState(75); // weighted threshold %
  const abortRef = React.useRef(null);

  // Cultural partner preferences — user-declared (overrides birthplace inference).
  // Persists per self-profile in localStorage.
  const [culturalPrefs, setCulturalPrefs] = useState(EMPTY_PREFS);
  useEffect(() => {
    setCulturalPrefs(loadPrefs(selfProfileId));
  }, [selfProfileId]);
  useEffect(() => {
    savePrefs(selfProfileId, culturalPrefs);
  }, [selfProfileId, culturalPrefs]);
  const cyclePref = (clusterId) => {
    setCulturalPrefs(prev => {
      const inP = prev.preferred.includes(clusterId);
      const inO = prev.open.includes(clusterId);
      const inX = prev.excluded.includes(clusterId);
      const stripped = {
        preferred: prev.preferred.filter(x => x !== clusterId),
        open: prev.open.filter(x => x !== clusterId),
        excluded: prev.excluded.filter(x => x !== clusterId),
      };
      // neutral → preferred → open → excluded → neutral
      if (!inP && !inO && !inX) stripped.preferred.push(clusterId);
      else if (inP) stripped.open.push(clusterId);
      else if (inO) stripped.excluded.push(clusterId);
      // if excluded → leave neutral (all stripped)
      return stripped;
    });
  };
  const clearPrefs = () => setCulturalPrefs(EMPTY_PREFS);
  const prefCount = culturalPrefs.preferred.length + culturalPrefs.open.length + culturalPrefs.excluded.length;

  // Tick the elapsed-time display every 250ms while searching
  useEffect(() => {
    if (!running || !searchStartedAt) return;
    const iv = setInterval(() => setElapsedMs(Date.now() - searchStartedAt), 250);
    return () => clearInterval(iv);
  }, [running, searchStartedAt]);

  const hasConstraint = (planet) =>
    Array.isArray(constraints[planet]) && constraints[planet].length > 0;
  const constrainedCount = useMemo(
    () => Object.keys(constraints).filter(p => hasConstraint(p)).length,
    [constraints]
  );
  const planetSignCount = useMemo(
    () => PLANET_ORDER.reduce((n, p) => n + (hasConstraint(p) ? 1 : 0), 0),
    [constraints]
  );
  const risingSet = hasConstraint(ASCENDANT_KEY);
  const houseCount = useMemo(
    () => Object.values(houseConstraints).filter(Boolean).length,
    [houseConstraints]
  );
  // Rising and house constraints both need location+timezone (time-of-day sweep)
  const needsLocation = houseCount > 0 || risingSet;
  const hasLocation = !!location && location.lat != null && location.lng != null;

  const canRun =
    planetSignCount > 0 &&
    !running &&
    startYear <= endYear &&
    (!needsLocation || (hasLocation && timezone));

  // Resolve timezone whenever location + year range change (uses midpoint year
  // so DST / historical offsets are reasonably accurate for the search span).
  useEffect(() => {
    if (!hasLocation) { setTimezone(null); return; }
    let cancelled = false;
    const midYear = Math.floor((startYear + endYear) / 2);
    const probeDate = `${midYear}-06-15`;
    setTzLoading(true);
    getHistoricalTimezone({
      latitude: location.lat,
      longitude: location.lng,
      birthDate: probeDate,
      birthTime: '12:00',
    })
      .then(res => {
        if (cancelled) return;
        const zone = res?.timezone?.zoneName || null;
        setTimezone(zone);
      })
      .catch(() => { if (!cancelled) setTimezone(null); })
      .finally(() => { if (!cancelled) setTzLoading(false); });
    return () => { cancelled = true; };
  }, [hasLocation, location?.lat, location?.lng, startYear, endYear]);

  const selfProfile = useMemo(
    () => profiles.find(p => p.id === selfProfileId) || null,
    [profiles, selfProfileId]
  );
  const selfBirthYear = useMemo(() => birthYearFromProfile(selfProfile), [selfProfile]);

  // Dynamic preset suggestions derived from the selected profile's chart.
  const suggestion = useMemo(
    () => (selfProfile ? suggestPresets(selfProfile) : null),
    [selfProfile]
  );

  // Core needs + planet weights for weighted scoring
  const coreNeeds = useMemo(
    () => (suggestion?.chart ? detectCoreNeeds(suggestion.chart) : null),
    [suggestion]
  );
  const planetWeights = useMemo(
    () => (suggestion?.chart ? computePlanetWeights(suggestion.chart) : null),
    [suggestion]
  );

  // Track which preset is currently "active" (its filters are loaded in the
  // UI). Clicking the same preset again toggles it off.
  const [activePresetId, setActivePresetId] = useState(null);

  const [presetAdjustments, setPresetAdjustments] = useState([]);

  const applyCompatPreset = (preset) => {
    // Toggle off if clicking the already-active preset
    if (activePresetId === preset.id) {
      setConstraints(makeInitialConstraints());
      setHouseConstraints(makeInitialHouses());
      setActivePresetId(null);
      setPresetAdjustments([]);
      return;
    }
    const next = makeInitialConstraints();
    const nextHouses = makeInitialHouses();
    const slowPlanets = new Set(['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']);
    const adjustments = [];

    for (const [planet, signs] of Object.entries(preset.filters || {})) {
      const key = planet === 'Ascendant' ? ASCENDANT_KEY : planet;

      // For slow planets, intersect with era signs loaded for the current
      // year range so the preset can't produce an empty search.
      if (slowPlanets.has(planet) && eraSigns?.[planet]?.length) {
        const avail = new Set(eraSigns[planet]);
        const intersect = signs.filter(s => avail.has(s));
        if (intersect.length === 0) {
          adjustments.push({ planet, from: signs, to: [], note: 'dropped — not in era' });
          next[key] = []; // drop this constraint
          continue;
        }
        if (intersect.length < signs.length) {
          adjustments.push({ planet, from: signs, to: intersect, note: 'narrowed to era' });
        }
        next[key] = intersect;
      } else {
        next[key] = [...signs];
      }
    }

    for (const [planet, house] of Object.entries(preset.houses || {})) {
      nextHouses[planet] = String(house);
    }
    setConstraints(next);
    setHouseConstraints(nextHouses);
    setActivePresetId(preset.id);
    setPresetAdjustments(adjustments);
  };

  // Clear the active-preset flag if user manually edits anything (signs no
  // longer match the preset bundle)
  useEffect(() => { setActivePresetId(null); }, [profiles.length]);
  const selfAge = useMemo(() => {
    if (!selfBirthYear) return null;
    return new Date().getFullYear() - selfBirthYear;
  }, [selfBirthYear]);

  const applyAgePreset = (preset) => {
    if (!selfBirthYear) return;
    const { younger, older } = preset;
    const s = Math.max(YEAR_MIN, Math.min(YEAR_MAX, selfBirthYear - older));
    const e = Math.max(YEAR_MIN, Math.min(YEAR_MAX, selfBirthYear + younger));
    setStartYear(Math.min(s, e));
    setEndYear(Math.max(s, e));
  };

  // Age steppers (profile-relative, SIGNED). "Years older" = how many years
  // the older edge sits before your birth (negative = actually younger).
  // "Years younger" = how many years the younger edge sits after your birth
  // (negative = actually older). Must satisfy yearsOlder + yearsYounger >= 0
  // so that startYear <= endYear.
  const yearsOlder = selfBirthYear ? selfBirthYear - startYear : 0;
  const yearsYounger = selfBirthYear ? endYear - selfBirthYear : 0;

  // Bounds: startYear must stay in [YEAR_MIN, endYear]  →
  //         yearsOlder in [birthYear - endYear, birthYear - YEAR_MIN]
  const yearsOlderMin = selfBirthYear ? selfBirthYear - endYear : 0;
  const yearsOlderMax = selfBirthYear ? selfBirthYear - YEAR_MIN : 0;
  const yearsYoungerMin = selfBirthYear ? startYear - selfBirthYear : 0;
  const yearsYoungerMax = selfBirthYear ? YEAR_MAX - selfBirthYear : 0;

  const setYearsOlder = (n) => {
    if (!selfBirthYear) return;
    const parsed = Number(n);
    if (!Number.isFinite(parsed)) return;
    const v = Math.max(yearsOlderMin, Math.min(yearsOlderMax, parsed));
    setStartYear(selfBirthYear - v);
  };
  const setYearsYounger = (n) => {
    if (!selfBirthYear) return;
    const parsed = Number(n);
    if (!Number.isFinite(parsed)) return;
    const v = Math.max(yearsYoungerMin, Math.min(yearsYoungerMax, parsed));
    setEndYear(selfBirthYear + v);
  };
  const resetAgeRange = () => {
    if (!selfBirthYear) return;
    setStartYear(selfBirthYear);
    setEndYear(selfBirthYear);
  };

  // Era signs (outer planets) for the current year range — computed live from
  // the cached ingress API. Debounced so dragging the slider doesn't spam calls.
  const [eraSigns, setEraSigns] = useState(null);
  const [eraLoading, setEraLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setEraLoading(true);
      try {
        const result = await getEraSignsForYearRange(startYear, endYear);
        if (!cancelled) setEraSigns(result);
      } catch {
        if (!cancelled) setEraSigns(null);
      } finally {
        if (!cancelled) setEraLoading(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(t); };
  }, [startYear, endYear]);

  const applyEraSigns = (planet) => {
    if (!eraSigns?.[planet]?.length) return;
    setConstraints(prev => ({ ...prev, [planet]: [...eraSigns[planet]] }));
  };

  const togglePlanetSign = (planet, sign) =>
    setConstraints(prev => {
      const cur = prev[planet] || [];
      const next = cur.includes(sign) ? cur.filter(s => s !== sign) : [...cur, sign];
      return { ...prev, [planet]: next };
    });
  const clearPlanetSigns = (planet) =>
    setConstraints(prev => ({ ...prev, [planet]: [] }));
  const setPlanetHouse = (planet, house) =>
    setHouseConstraints(prev => ({ ...prev, [planet]: house }));

  const clearAll = () => {
    setConstraints(makeInitialConstraints());
    setHouseConstraints(makeInitialHouses());
    setLocation(null);
    setResults(null);
    setError(null);
    setActivePresetId(null);
    setPresetAdjustments([]);
    // Year range: keep profile-centered if a profile is picked, else default
    if (selfBirthYear) {
      setStartYear(selfBirthYear);
      setEndYear(selfBirthYear);
    } else {
      setStartYear(1950);
      setEndYear(2026);
    }
  };

  const handleCancel = () => {
    if (abortRef.current) abortRef.current.abort();
  };

  const handleSearch = async (mode = 'strict') => {
    if (!canRun) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(true);
    setError(null);
    setResults(null);
    setProgress({ done: 0, total: endYear - startYear + 1, phase: 'signs' });
    const startedAt = Date.now();
    setSearchStartedAt(startedAt);
    setElapsedMs(0);

    const callParams = {
      startYear,
      endYear,
      signConstraints: constraints,
      houseConstraints: parseHouseConstraints(houseConstraints),
      location: hasLocation ? { lat: location.lat, lng: location.lng } : null,
      timezone,
      sweepStepMinutes: 5,
      referenceDate: new Date(),
      signal: controller.signal,
      onProgress: (done, total, phase = 'signs') =>
        setProgress({ done, total, phase }),
    };

    try {
      let result;
      if (mode === 'weighted') {
        result = await findWeighted({
          ...callParams,
          threshold: matchQuality,
          weights: planetWeights || undefined,
        });
      } else if (mode === 'progressive') {
        result = await findProgressively(callParams);
      } else {
        result = await findBirthDateCandidates(callParams);
      }
      const finalElapsed = Date.now() - startedAt;
      setResults({ ...result, mode, searchElapsedMs: finalElapsed });
    } catch (e) {
      if (e?.name === 'AbortError') {
        setError('Search cancelled.');
      } else {
        console.error(e);
        setError(e.message || 'Search failed');
      }
    } finally {
      abortRef.current = null;
      setRunning(false);
    }
  };

  // Ensure endYear >= startYear
  const handleStartYear = (v) => {
    const n = Math.min(Math.max(YEAR_MIN, Number(v) || YEAR_MIN), YEAR_MAX);
    setStartYear(n);
    if (n > endYear) setEndYear(n);
  };
  const handleEndYear = (v) => {
    const n = Math.min(Math.max(YEAR_MIN, Number(v) || YEAR_MIN), YEAR_MAX);
    setEndYear(n);
    if (n < startYear) setStartYear(n);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Reverse Engine</h3>
          <p className="text-xs text-white/40 mt-1">
            Find birth dates where your planets were in the specified signs.
          </p>
        </div>
        <button
          onClick={clearAll}
          title="Clear all signs, houses, location, year range, and results"
          className="text-xs font-semibold text-red-200 bg-red-600/20 hover:bg-red-600/40 px-3 py-1.5 rounded border border-red-500/60 hover:border-red-400 transition"
        >
          ⟲ RESET ALL
        </button>
      </div>

      {/* Self profile → age-range presets */}
      <div className="mb-4 p-3 bg-slate-900/40 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/70">Your profile (for age-relative range)</label>
          {selfAge != null && (
            <span className="text-xs text-cyan-400">
              born {selfBirthYear} &nbsp;·&nbsp; age {selfAge}
            </span>
          )}
        </div>
        <select
          value={selfProfileId}
          onChange={e => setSelfProfileId(e.target.value)}
          className="w-full text-sm bg-slate-950 border border-white/10 rounded px-2 py-1.5 text-white focus:border-purple-500 focus:outline-none mb-2"
        >
          <option value="">— none (use raw year range) —</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>
              {p.displayName || p.name || 'Unknown'}
              {birthYearFromProfile(p) ? ` (${birthYearFromProfile(p)})` : ''}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="text-white/40">Age presets:</span>
          {Object.entries(AGE_RANGE_PRESETS).map(([label, preset]) => (
            <button
              key={label}
              type="button"
              disabled={!selfBirthYear}
              onClick={() => applyAgePreset(preset)}
              className={`px-2 py-0.5 rounded border ${
                selfBirthYear
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                  : 'border-white/10 text-white/30 cursor-not-allowed'
              }`}
              title={
                selfBirthYear
                  ? `${selfBirthYear - preset.older} → ${selfBirthYear + preset.younger}`
                  : 'Select a profile first'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Year range + Era side panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/70">Age / year range</label>
            <span className="text-xs text-cyan-400">
              {startYear} → {endYear} &nbsp;·&nbsp; {endYear - startYear + 1} years
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-white/40 mb-1">From (older)</div>
              <input
                type="range"
                min={YEAR_MIN}
                max={YEAR_MAX}
                value={startYear}
                onChange={e => handleStartYear(e.target.value)}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <div className="text-[10px] text-white/40 mb-1">To (younger)</div>
              <input
                type="range"
                min={YEAR_MIN}
                max={YEAR_MAX}
                value={endYear}
                onChange={e => handleEndYear(e.target.value)}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Age steppers — profile-relative, signed. Negative means the
              edge has crossed your birth year to the other side. */}
          {selfBirthYear && (
            <>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className={`flex items-center gap-2 bg-slate-900/50 border rounded-lg px-2 py-1.5 ${yearsOlder < 0 ? 'border-amber-500/40' : 'border-white/10'}`}>
                  <span className="text-[10px] text-white/60 whitespace-nowrap">Years older</span>
                  <button
                    type="button"
                    onClick={() => setYearsOlder(yearsOlder - 1)}
                    disabled={yearsOlder <= yearsOlderMin}
                    className="w-6 h-6 rounded bg-slate-800 border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                  >−</button>
                  <input
                    type="number"
                    min={yearsOlderMin}
                    max={yearsOlderMax}
                    value={yearsOlder}
                    onChange={e => setYearsOlder(e.target.value)}
                    className={`w-16 text-center text-sm bg-slate-950 border border-white/10 rounded px-1 py-0.5 focus:border-purple-500 focus:outline-none ${yearsOlder < 0 ? 'text-amber-300' : 'text-white'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setYearsOlder(yearsOlder + 1)}
                    disabled={yearsOlder >= yearsOlderMax}
                    className="w-6 h-6 rounded bg-slate-800 border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                  >+</button>
                  <span className="text-[10px] text-cyan-400/70 ml-auto">→ {startYear}</span>
                </div>
                <div className={`flex items-center gap-2 bg-slate-900/50 border rounded-lg px-2 py-1.5 ${yearsYounger < 0 ? 'border-amber-500/40' : 'border-white/10'}`}>
                  <span className="text-[10px] text-white/60 whitespace-nowrap">Years younger</span>
                  <button
                    type="button"
                    onClick={() => setYearsYounger(yearsYounger - 1)}
                    disabled={yearsYounger <= yearsYoungerMin}
                    className="w-6 h-6 rounded bg-slate-800 border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                  >−</button>
                  <input
                    type="number"
                    min={yearsYoungerMin}
                    max={yearsYoungerMax}
                    value={yearsYounger}
                    onChange={e => setYearsYounger(e.target.value)}
                    className={`w-16 text-center text-sm bg-slate-950 border border-white/10 rounded px-1 py-0.5 focus:border-purple-500 focus:outline-none ${yearsYounger < 0 ? 'text-amber-300' : 'text-white'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setYearsYounger(yearsYounger + 1)}
                    disabled={yearsYounger >= yearsYoungerMax}
                    className="w-6 h-6 rounded bg-slate-800 border border-white/10 text-white/70 hover:text-white disabled:opacity-30"
                  >+</button>
                  <span className="text-[10px] text-cyan-400/70 ml-auto">→ {endYear}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px]">
                <span className="text-white/40">
                  Range width: {yearsOlder + yearsYounger} year(s)
                  {(yearsOlder < 0 || yearsYounger < 0) && (
                    <span className="text-amber-400 ml-2">
                      ⓘ amber = edge crossed your birth year
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={resetAgeRange}
                  className="px-2 py-0.5 rounded border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                  title="Snap both edges to your birth year"
                >
                  ↺ center on me
                </button>
              </div>
            </>
          )}
        </div>

        {/* Outer-planet era panel — which signs each slow planet occupied
            during the range, clickable to lock the constraint */}
        <div className="bg-slate-900/60 border border-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/70">Era signs</label>
            {eraLoading && <span className="text-[10px] text-cyan-400 animate-pulse">loading…</span>}
          </div>
          {!eraSigns && !eraLoading && (
            <div className="text-[10px] text-white/40">Range too narrow or no data.</div>
          )}
          {eraSigns && (
            <div className="space-y-1.5">
              {['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(planet => {
                const signs = eraSigns[planet] || [];
                const locked = (constraints[planet] || []).length > 0 &&
                  (constraints[planet] || []).every(s => signs.includes(s));
                const narrow = signs.length > 0 && signs.length <= 4;
                return (
                  <div key={planet} className="text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">
                        {PLANET_GLYPHS[planet]} {planet}
                        <span className="text-white/40 ml-1">({signs.length})</span>
                      </span>
                      {narrow && (
                        <button
                          type="button"
                          onClick={() => applyEraSigns(planet)}
                          className={`px-1.5 rounded border text-[9px] ${
                            locked
                              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                              : 'border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'
                          }`}
                        >
                          {locked ? 'applied' : 'apply'}
                        </button>
                      )}
                    </div>
                    <div className="text-white/50 truncate">
                      {signs.length === 0
                        ? '—'
                        : signs.length > 6
                          ? `${signs.slice(0, 3).join(', ')} … (${signs.length - 3} more)`
                          : signs.join(', ')}
                    </div>
                  </div>
                );
              })}
              <div className="pt-1 mt-1 border-t border-white/5 text-[9px] text-white/40">
                "apply" locks that planet to exactly the signs it touched in this range.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic compatibility presets — derived from the selected profile's
          chart. Placed here (after Age/Year range) so it visually connects to
          the planet grid it populates, rather than to the age slider above. */}
      {suggestion && suggestion.ranked.length > 0 && (
        <>
          <PresetSuggestionPanel
            suggestion={suggestion}
            onApply={applyCompatPreset}
            activePresetId={activePresetId}
          />
          {presetAdjustments.length > 0 && (
            <div className="mb-5 -mt-3 p-3 bg-amber-900/10 border border-amber-500/30 rounded-lg text-[11px]">
              <div className="font-semibold text-amber-200 mb-1.5">
                ⚙ Adjusted {presetAdjustments.length} slow-planet constraint(s) to fit the {startYear}–{endYear} era
              </div>
              <ul className="space-y-0.5">
                {presetAdjustments.map(a => (
                  <li key={a.planet} className="text-white/70">
                    <span className="font-medium text-amber-200">{a.planet}</span>:{' '}
                    <span className="text-white/50 line-through">{a.from.join(', ')}</span>
                    {' → '}
                    <span className="text-emerald-300">
                      {a.to.length ? a.to.join(', ') : '(cleared)'}
                    </span>
                    <span className="text-white/40 ml-1.5">({a.note})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Location (optional for v1 — required once house constraints are added) */}
      <div className="mb-5">
        <LocationPicker
          value={location}
          onChange={setLocation}
          label="Birth Location (optional for sign-only search)"
          placeholder="Start typing a city..."
        />
        {location && (
          <div className="mt-2 text-xs text-white/40">
            {location.formatted} &nbsp;·&nbsp;
            {location.lat?.toFixed(4)}°, {location.lng?.toFixed(4)}°
          </div>
        )}

        {/* Quick-jump to a representative city of each preferred/open cluster.
            The search uses ONE location per run — these buttons let the user
            re-run the search in a cluster they actually care about without
            typing a city each time. */}
        {(culturalPrefs.preferred.length > 0 || culturalPrefs.open.length > 0) && (() => {
          const currentCountry = countryFromFormatted(location?.formatted);
          const currentCluster = clusterOfCountry(currentCountry);
          const currentIsPreferred = currentCluster && culturalPrefs.preferred.includes(currentCluster.id);
          const currentIsOpen = currentCluster && culturalPrefs.open.includes(currentCluster.id);
          const currentIsExcluded = currentCluster && culturalPrefs.excluded.includes(currentCluster.id);
          const currentIsListed = currentIsPreferred || currentIsOpen;
          const mismatch = location && !currentIsListed;
          const setToRep = (rep) => {
            if (!rep) return;
            setLocation({
              formatted: rep.name,
              name: rep.name,
              lat: rep.lat,
              lng: rep.lng,
            });
          };
          // Flatten cluster → reps so multi-region clusters (e.g. Greater
          // China: Shanghai/Chongqing/Shenzhen) render one button per region.
          const flatten = (clusters) => clusters.flatMap(c =>
            (c.reps || []).map(r => ({ cluster: c, rep: r }))
          );
          const prefReps = flatten(CULTURAL_CLUSTERS.filter(c => culturalPrefs.preferred.includes(c.id)));
          const openReps = flatten(CULTURAL_CLUSTERS.filter(c => culturalPrefs.open.includes(c.id)));
          const renderRepBtn = ({ cluster, rep }, tone) => {
            const showRegion = (cluster.reps || []).length > 1 && rep.region;
            const cls = tone === 'preferred'
              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30'
              : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/25';
            return (
              <button
                key={`${cluster.id}::${rep.name}`}
                type="button"
                onClick={() => setToRep(rep)}
                className={`px-2 py-0.5 rounded border text-[11px] ${cls}`}
                title={`${cluster.label}${showRegion ? ` — ${rep.region}` : ''} → ${rep.name}`}
              >
                {showRegion ? (
                  <>
                    <span className="text-white/80">{cluster.label}</span>
                    <span className="text-white/50"> · {rep.region.split('·')[0].trim()}</span>
                    <span className="text-white/40"> → {rep.name.split(',')[0]}</span>
                  </>
                ) : (
                  <>
                    {cluster.label} <span className="text-white/50">→ {rep.name.split(',')[0]}</span>
                  </>
                )}
              </button>
            );
          };
          return (
            <div className="mt-3 p-2 bg-slate-900/40 border border-white/10 rounded-lg">
              {mismatch && (
                <div className="mb-2 text-[11px] text-amber-300">
                  ⚠ Current location is
                  {currentIsExcluded ? ' in a cluster you excluded' :
                   currentCluster ? ` in "${currentCluster.label}" which isn't in your preferences` :
                   ' in an unrecognized cluster'}.
                  Jump to a preferred cluster below:
                </div>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                {prefReps.length > 0 && (
                  <span className="text-[10px] text-emerald-300/70 mr-1">✓ Preferred:</span>
                )}
                {prefReps.map(item => renderRepBtn(item, 'preferred'))}
                {openReps.length > 0 && (
                  <span className="text-[10px] text-cyan-300/70 mx-1">~ Open:</span>
                )}
                {openReps.map(item => renderRepBtn(item, 'open'))}
              </div>
              <div className="mt-2 text-[9px] text-white/40">
                The search runs at one location per click. To cover multiple clusters, run the search once per button and compare the result sets.
              </div>
            </div>
          );
        })()}
      </div>

      {/* Partner cultural preferences — override birthplace inference.
          For immigrants, diaspora, third-culture people: birthplace ≠ affinity. */}
      <div className="mb-5 p-3 bg-slate-900/40 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <label className="text-sm text-white/70">
            Partner cultural preferences <span className="text-white/40">(optional — overrides birthplace guess)</span>
          </label>
          <span className="text-[9px] text-white/40">
            click to cycle: <span className="text-white/60">neutral</span> → <span className="text-emerald-300">✓ preferred</span> → <span className="text-cyan-300">~ open</span> → <span className="text-red-300">✗ excluded</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CULTURAL_CLUSTERS.map(c => {
            const isPref = culturalPrefs.preferred.includes(c.id);
            const isOpen = culturalPrefs.open.includes(c.id);
            const isExcluded = culturalPrefs.excluded.includes(c.id);
            const style = isPref
              ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-100'
              : isOpen
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100'
                : isExcluded
                  ? 'bg-red-500/20 border-red-500/50 text-red-200'
                  : 'bg-slate-800 border-white/10 text-white/60 hover:text-white hover:border-white/30';
            const icon = isPref ? '✓ ' : isOpen ? '~ ' : isExcluded ? '✗ ' : '';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => cyclePref(c.id)}
                className={`px-2 py-0.5 rounded border text-[11px] transition ${style}`}
                title={`${c.label} — ${c.members.slice(0, 6).join(', ')}${c.members.length > 6 ? '…' : ''}`}
              >
                {icon}{c.label}
              </button>
            );
          })}
          {prefCount > 0 && (
            <button
              type="button"
              onClick={clearPrefs}
              className="px-2 py-0.5 rounded border border-white/10 text-[10px] text-white/40 hover:text-white"
            >
              clear all
            </button>
          )}
        </div>
        {prefCount === 0 && (
          <div className="mt-2 text-[10px] text-white/40">
            Defaults to your birthplace's cluster. Click clusters above if your actual preferences differ (e.g. you're diaspora or third-culture).
          </div>
        )}
      </div>

      {/* Planet sign + house grid */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-white/70">Planet signs &amp; houses</label>
          <span className="text-xs text-white/40">
            signs: {constrainedCount}/{PLANET_ORDER.length + 1} &nbsp;·&nbsp;
            houses: {houseCount}/{PLANET_ORDER.length}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PLANET_ORDER.map(planet => {
            const isMoonExpensive = planet === 'Moon' && hasConstraint(planet);
            return (
              <div key={planet} className="bg-slate-900/60 border border-white/10 rounded-lg p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg text-amber-300" style={{ lineHeight: 1 }}>
                    {PLANET_GLYPHS[planet]}
                  </span>
                  <span className="text-xs font-medium text-white">{planet}</span>
                </div>
                <SignMultiSelect
                  selected={constraints[planet] || []}
                  onToggle={s => togglePlanetSign(planet, s)}
                  onClear={() => clearPlanetSigns(planet)}
                />
                <select
                  value={houseConstraints[planet]}
                  onChange={e => setPlanetHouse(planet, e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded px-1.5 py-1 text-white focus:border-purple-500 focus:outline-none mt-1"
                >
                  <option value="">Any house</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(h =>
                    <option key={h} value={h}>House {h}</option>
                  )}
                </select>
                {isMoonExpensive && (
                  <div className="text-[10px] text-amber-400/70 mt-1">
                    Moon adds ~0.7s/year
                  </div>
                )}
              </div>
            );
          })}
          {/* Rising (Ascendant) — sign only; house is always 1 by definition */}
          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-lg p-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg text-cyan-300" style={{ lineHeight: 1 }}>
                {PLANET_GLYPHS[ASCENDANT_KEY]}
              </span>
              <span className="text-xs font-medium text-white">Rising</span>
            </div>
            <SignMultiSelect
              selected={constraints[ASCENDANT_KEY] || []}
              onToggle={s => togglePlanetSign(ASCENDANT_KEY, s)}
              onClear={() => clearPlanetSigns(ASCENDANT_KEY)}
              accent="cyan"
            />
            {hasConstraint(ASCENDANT_KEY) && (
              <div className="text-[10px] text-cyan-400/70 mt-1">
                Needs location (time-sweep)
              </div>
            )}
          </div>
        </div>
        {needsLocation && !hasLocation && (
          <div className="mt-2 text-xs text-amber-400">
            ⚠ House constraints require a birth location — add one above.
          </div>
        )}
        {needsLocation && hasLocation && !timezone && !tzLoading && (
          <div className="mt-2 text-xs text-amber-400">
            ⚠ Could not resolve timezone for this location.
          </div>
        )}
        {needsLocation && tzLoading && (
          <div className="mt-2 text-xs text-cyan-400 animate-pulse">
            Looking up timezone...
          </div>
        )}
        {needsLocation && timezone && (
          <div className="mt-2 text-[10px] text-emerald-400/70">
            Using timezone: {timezone}
          </div>
        )}
      </div>

      {/* Core needs + Match quality slider */}
      {coreNeeds && coreNeeds.coreNeeds.length > 0 && (
        <div className="mb-4 p-3 bg-slate-900/40 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/80">
              🎯 Your non-negotiables (detected from chart)
            </span>
            <span className="text-[10px] text-white/40">
              {coreNeeds.coreNeeds.filter(n => n.hard).length} hard, {coreNeeds.coreNeeds.filter(n => !n.hard).length} soft
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {coreNeeds.coreNeeds.map(n => (
              <span
                key={n.id}
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  n.hard
                    ? 'bg-red-500/20 text-red-200 border-red-500/50'
                    : 'bg-amber-500/10 text-amber-200 border-amber-500/40'
                }`}
                title={n.description}
              >
                {n.hard ? '🔒 ' : ''}{n.label}
                <span className="text-white/40 ml-1">w{n.weight}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[11px] text-white/60 whitespace-nowrap">
              Weighted match quality:
            </label>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={matchQuality}
              onChange={e => setMatchQuality(Number(e.target.value))}
              className="flex-1 accent-amber-500"
            />
            <span className="text-xs font-semibold text-amber-300 w-12 text-right">
              ≥ {matchQuality}%
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-1">
            100 = unicorn • 85 = excellent • 75 = good • 60 = loose. Rising + Sun always hard-match.
          </div>
        </div>
      )}

      {/* Mode-help strip */}
      <div className="mb-2 text-[10px] text-white/50 leading-snug">
        <span className="text-purple-300 font-semibold">Strict</span> = all signs/houses must match exactly.
        &nbsp;<span className="text-emerald-300 font-semibold">Progressive</span> = drops low-priority constraints until matches appear.
        &nbsp;<span className="text-amber-300 font-semibold">Weighted</span> = scores each candidate by your chart's core needs, keeps anything above your quality threshold.
        <br />
        All three use the planet signs &amp; houses above, so pick a preset (Person A/B/C) or set them manually first.
      </div>

      {/* Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleSearch('strict')}
          disabled={!canRun}
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition ${
            canRun
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
              : 'bg-slate-700 text-white/40 cursor-not-allowed'
          }`}
          title="All constraints must match simultaneously"
        >
          {running ? 'Searching...' : 'Find matches (strict)'}
        </button>
        <button
          onClick={() => handleSearch('progressive')}
          disabled={!canRun}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition border ${
            canRun
              ? 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-100 border-emerald-500/50'
              : 'bg-slate-700 text-white/40 border-white/10 cursor-not-allowed'
          }`}
          title="Drops lowest-priority constraints (Neptune, Uranus, Pluto…) until matches appear. Rising and Sun are never dropped."
        >
          ⚡ Progressive
        </button>
        <button
          onClick={() => handleSearch('weighted')}
          disabled={!canRun}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition border ${
            canRun
              ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-100 border-amber-500/50'
              : 'bg-slate-700 text-white/40 border-white/10 cursor-not-allowed'
          }`}
          title="Weighted scoring needs a preset (Person A/B/C) or manually-set signs. Rising + Sun are hard-required; other planets contribute weighted points. Candidates ≥ threshold are kept."
        >
          ★ Weighted
        </button>
        {running && (() => {
          const pctNum = (progress.done / Math.max(progress.total, 1)) * 100;
          const etaMs = progress.done > 0 && elapsedMs > 0
            ? (elapsedMs / progress.done) * (progress.total - progress.done)
            : null;
          return (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>
                    {progress.phase === 'houses'
                      ? `Refining houses: ${progress.done} / ${progress.total} days`
                      : `Scanning signs: ${progress.done} / ${progress.total} years`}
                    <span className="text-white/40">
                      {' · '}{formatDuration(elapsedMs)} elapsed
                      {etaMs != null && ` · ~${formatDuration(etaMs)} remaining`}
                    </span>
                  </span>
                  <span>{Math.round(pctNum)}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded">
                  <div
                    className="h-1.5 bg-purple-500 rounded transition-all"
                    style={{ width: `${pctNum}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="shrink-0 px-3 py-1 rounded border border-red-500/50 bg-red-500/20 text-red-100 hover:bg-red-500/40 text-xs font-semibold"
                title="Cancel the running search"
              >
                ✕ Cancel
              </button>
            </div>
          );
        })()}
        {!running && results?.searchElapsedMs > 0 && (
          <span className="text-[11px] text-white/50">
            ✓ searched in <span className="text-emerald-300 font-mono">{formatDuration(results.searchElapsedMs)}</span>
          </span>
        )}
        {!running && constrainedCount === 0 && (
          <span className="text-xs text-white/40">
            Apply a preset above (Person A/B/C) or set planet signs manually first.
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-sm text-red-200">
          {error}
        </div>
      )}

      {results && (
        <ResultsTable
          results={results}
          searchLocation={location ? {
            name: location.formatted || location.name,
            lat: location.lat,
            lng: location.lng,
          } : null}
          selfLocation={selfLocationFromProfile(selfProfile)}
          culturalPrefs={culturalPrefs}
          onRelaxPlanet={(planet, mode) => {
            if (mode === 'clear') {
              setConstraints(prev => ({ ...prev, [planet]: [] }));
              setActivePresetId(null);
            } else if (mode === 'widen') {
              const avail = results.infeasible?.find(x => x.planet === planet)?.available || [];
              setConstraints(prev => ({ ...prev, [planet]: avail }));
              setActivePresetId(null);
            }
          }}
          onTryProgressive={() => handleSearch('progressive')}
          onLoadChart={onLoadChart && location ? (c) => {
            const { birthDate, birthTime } = candidateMidLocal(c, timezone);
            onLoadChart({
              birthDate,
              birthTime,
              latitude: location.lat,
              longitude: location.lng,
              timezone,
              name: `Candidate ${birthDate} ${birthTime}`,
            });
          } : null}
        />
      )}
    </div>
  );
}

/**
 * Compact multi-select for signs. Click a sign chip to toggle. Shows a count
 * chip + expandable chip grid. Keeps the planet card tight.
 */
function SignMultiSelect({ selected, onToggle, onClear, accent = 'purple' }) {
  const [open, setOpen] = React.useState(false);
  const count = selected.length;
  const label = count === 0 ? 'Any sign' : count === 1 ? selected[0] : `${count} signs`;
  const accentColors = {
    purple: 'border-purple-500/60 text-purple-300',
    cyan: 'border-cyan-500/60 text-cyan-300',
  }[accent] || '';
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full text-xs bg-slate-950 border border-white/10 rounded px-1.5 py-1 text-white text-left flex items-center justify-between ${count > 0 ? accentColors : ''}`}
      >
        <span className="truncate">{label}</span>
        <span className="text-white/40 ml-1">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 left-0 right-0 bg-slate-950 border border-white/20 rounded p-1.5 shadow-lg grid grid-cols-3 gap-1">
          {SIGNS.map(s => {
            const isOn = selected.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onToggle(s)}
                className={`text-[10px] px-1 py-0.5 rounded border transition ${
                  isOn
                    ? 'bg-purple-600/60 border-purple-400 text-white'
                    : 'bg-slate-900 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {s.slice(0, 3)}
              </button>
            );
          })}
          {count > 0 && (
            <button
              type="button"
              onClick={() => { onClear(); }}
              className="col-span-3 text-[10px] text-white/50 hover:text-white mt-0.5"
            >
              clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsTable({ results, onRelaxPlanet, onTryProgressive, onLoadChart, searchLocation, selfLocation, culturalPrefs }) {
  const {
    candidates, constrainedPlanets, failedYears = [], houseConstrained = false,
    infeasible = [], droppedConstraints = [], mode, searchElapsedMs,
  } = results;

  // Sort state: null = original order, or { key, dir } where dir is 'asc' | 'desc'
  const [sort, setSort] = React.useState(null);
  const toggleSort = (key) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null; // third click clears sort
    });
  };

  const sortedCandidates = React.useMemo(() => {
    if (!sort) return candidates;
    const arr = [...candidates];
    arr.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [candidates, sort]);

  const sortArrow = (key) => {
    if (!sort || sort.key !== key) return '';
    return sort.dir === 'asc' ? ' ▲' : ' ▼';
  };

  if (candidates.length === 0) {
    return (
      <div className="mt-5 p-4 bg-slate-900/50 border border-white/10 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-amber-300 font-medium">
            No matches
            {searchElapsedMs > 0 && (
              <span className="ml-2 text-[10px] text-white/40 font-normal">
                (searched {formatDuration(searchElapsedMs)})
              </span>
            )}
          </div>
          {mode !== 'progressive' && onTryProgressive && (
            <button
              type="button"
              onClick={onTryProgressive}
              className="text-[11px] px-2 py-1 rounded border border-emerald-500/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/40 font-semibold"
              title="Drops lowest-priority constraints until matches appear"
            >
              ⚡ Try progressive match
            </button>
          )}
        </div>
        <div className="text-xs text-white/60 mb-2">
          No dates in the selected range have all of these planets in the specified signs at the same time.
        </div>
        <div className="text-[10px] text-white/40 mb-2">
          Match priority (dropped last → first): Rising → Sun → Moon → Venus → Mars → Mercury → Saturn → Jupiter → Pluto → Uranus → Neptune
        </div>

        {infeasible.length > 0 && (
          <div className="mt-3 p-3 bg-amber-900/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-amber-200">
                ⚠ {infeasible.length} constraint{infeasible.length === 1 ? '' : 's'} can't be satisfied in this year range:
              </div>
              <button
                type="button"
                onClick={() => infeasible.forEach(({ planet }) => onRelaxPlanet(planet, 'widen'))}
                className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/40 font-semibold"
              >
                ⚡ Widen all to era
              </button>
            </div>
            <div className="space-y-1.5">
              {infeasible.map(({ planet, requested, available }) => (
                <div key={planet} className="flex items-center gap-2 text-[11px]">
                  <span className="font-medium text-amber-200 w-16">{planet}</span>
                  <span className="text-white/60">
                    wanted <span className="text-amber-300">{requested.join(', ')}</span>;
                    was in <span className="text-emerald-300">{available.length > 0 ? available.join(', ') : '(none)'}</span>
                  </span>
                  <div className="ml-auto flex gap-1">
                    {available.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onRelaxPlanet(planet, 'widen')}
                        className="px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-[10px]"
                      >
                        Widen to era
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRelaxPlanet(planet, 'clear')}
                      className="px-1.5 py-0.5 rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-white/40 mt-2">
              Tip: "Widen to era" sets that planet to every sign it actually occupied in this year range — guaranteed feasible.
            </div>
          </div>
        )}

        {infeasible.length === 0 && (
          <div className="text-xs text-white/40 mt-2">
            Each individual constraint is feasible, but their combination never overlaps. Try relaxing one of the inner planets (Sun/Moon/Mercury/Venus/Mars).
          </div>
        )}

        {failedYears.length > 0 && (
          <div className="mt-2 text-xs text-red-300">
            ⚠ {failedYears.length} year(s) failed to fetch: {failedYears.join(', ')}.
            If this is unexpected, check that the <code className="text-red-200">all_planet_ingresses</code> Cloud Function is deployed.
          </div>
        )}
      </div>
    );
  }

  const totalDays = candidates.reduce((s, c) => s + c.durationDays, 0);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/80">
          <span className="font-semibold text-emerald-400">{candidates.length}</span> candidate window{candidates.length === 1 ? '' : 's'}
          <span className="text-white/40 ml-2">(~{totalDays.toFixed(1)} total days)</span>
          {mode === 'progressive' && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-200">
              progressive
            </span>
          )}
          {mode === 'weighted' && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/50 bg-amber-500/10 text-amber-200">
              weighted
            </span>
          )}
          {searchElapsedMs > 0 && (
            <span className="ml-2 text-[10px] text-white/40">
              · searched in {formatDuration(searchElapsedMs)}
            </span>
          )}
        </div>
        <div className="text-[10px] text-white/40">
          constraints: {constrainedPlanets.join(', ')}
        </div>
      </div>

      {droppedConstraints.length > 0 && (
        <div className="mb-2 p-2 bg-emerald-900/10 border border-emerald-500/30 rounded text-[11px]">
          <span className="text-emerald-200 font-semibold">Relaxed {droppedConstraints.length}:</span>{' '}
          <span className="text-white/60">
            {droppedConstraints.map(d => d.planet).join(', ')} (lowest priority)
          </span>
          <span className="text-white/40 ml-2">
            — Rising and Sun preserved
          </span>
        </div>
      )}

      {searchLocation && (
        (() => {
          const dist = selfLocation && searchLocation.lat != null
            ? haversineKm(selfLocation.lat, selfLocation.lng, searchLocation.lat, searchLocation.lng)
            : null;
          const selfCountry = countryFromFormatted(selfLocation?.name);
          const searchCountry = countryFromFormatted(searchLocation.name);
          const searchCluster = clusterOfCountry(searchCountry);
          const verdict = verdictFromPrefs(searchCountry, culturalPrefs, selfCountry);
          const usingPrefs = culturalPrefs &&
            (culturalPrefs.preferred.length + culturalPrefs.open.length + culturalPrefs.excluded.length) > 0;
          const toneStyles = {
            emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200',
            cyan:    'bg-cyan-500/20 border-cyan-500/40 text-cyan-200',
            amber:   'bg-amber-500/20 border-amber-500/40 text-amber-200',
            red:     'bg-red-500/20 border-red-500/50 text-red-200',
            slate:   'bg-slate-700/40 border-white/20 text-white/70',
          };
          const verdictIcon = {
            same_country: '✓', same_cluster: '~', cross_cultural: '⚠',
            preferred: '✓', open: '~', excluded: '✗',
            not_listed: '◻', unknown_cluster: '?',
          }[verdict?.level] || '';
          return (
            <div className="mb-2 p-2 bg-slate-900/50 border border-white/10 rounded text-[11px] flex items-center gap-2 flex-wrap">
              <span className="text-white/80">
                📍 <span className="font-semibold">{searchLocation.name || 'Search location'}</span>
              </span>
              {searchLocation.lat != null && (
                <span className="font-mono text-white/40">
                  {searchLocation.lat.toFixed(2)}°, {searchLocation.lng.toFixed(2)}°
                </span>
              )}
              {searchCluster && !verdict && (
                <span className="px-1.5 py-0.5 rounded border bg-slate-700/40 border-white/20 text-white/70">
                  {searchCluster.label}
                </span>
              )}
              {verdict && (
                <span
                  className={`px-1.5 py-0.5 rounded border ${toneStyles[verdict.tone] || toneStyles.slate}`}
                  title={
                    verdict.level === 'excluded' ? 'You marked this cluster as excluded.' :
                    verdict.level === 'preferred' ? 'You marked this cluster as preferred.' :
                    verdict.level === 'open' ? 'You marked this cluster as open.' :
                    verdict.level === 'not_listed' ? 'Not in your declared preferences.' :
                    verdict.level === 'same_country' ? 'Same country as your birthplace — strongest cultural affinity.' :
                    verdict.level === 'same_cluster' ? 'Different country but same cultural / linguistic cluster.' :
                    'Different cultural cluster — match may be less realistic.'
                  }
                >
                  {verdictIcon} {verdict.label}
                </span>
              )}
              {usingPrefs && (
                <span className="text-[9px] text-white/40 italic">using your declared prefs</span>
              )}
              {dist != null && selfLocation && (
                <span className="ml-auto text-cyan-300">
                  <span className="font-mono">{formatKm(dist)}</span>
                  <span className="text-white/50"> from your birthplace{selfLocation.name ? ` (${selfLocation.name.split(',')[0]})` : ''}</span>
                </span>
              )}
              {!selfLocation && (
                <span className="ml-auto text-white/30 italic">pick a profile above to see distance & affinity</span>
              )}
            </div>
          );
        })()
      )}

      <div className="max-h-96 overflow-y-auto border border-white/10 rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-slate-900 sticky top-0">
            <tr className="text-left text-white/60">
              {mode === 'weighted' && <th className="px-3 py-2 font-medium">Score</th>}
              <th className="px-3 py-2 font-medium">Year</th>
              <th className="px-3 py-2 font-medium">Start (UTC)</th>
              <th className="px-3 py-2 font-medium">End (UTC)</th>
              {houseConstrained && (
                <>
                  <th className="px-3 py-2 font-medium">Local start</th>
                  <th className="px-3 py-2 font-medium">Local end</th>
                </>
              )}
              <th className="px-3 py-2 font-medium">Duration</th>
              <th
                className="px-3 py-2 font-medium cursor-pointer select-none hover:text-white"
                onClick={() => toggleSort('ageAtReference')}
                title="Click to sort by age"
              >
                Age today{sortArrow('ageAtReference')}
              </th>
              {searchLocation && selfLocation && (
                <th className="px-3 py-2 font-medium" title="Great-circle distance from your birthplace to the search location">
                  Distance
                </th>
              )}
              {onLoadChart && <th className="px-3 py-2 font-medium">Chart</th>}
              {mode === 'weighted' && <th className="px-3 py-2 font-medium">Details</th>}
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.map((c, i) => (
              <CandidateRow
                key={i}
                c={c}
                mode={mode}
                houseConstrained={houseConstrained}
                onLoadChart={onLoadChart}
                distanceKm={searchLocation && selfLocation
                  ? haversineKm(selfLocation.lat, selfLocation.lng, searchLocation.lat, searchLocation.lng)
                  : null}
                showDistance={!!(searchLocation && selfLocation)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CandidateRow({ c, mode, houseConstrained, onLoadChart, distanceKm, showDistance }) {
  const [open, setOpen] = React.useState(false);
  const days = c.durationDays;
  const dur = days < 1 ? `${(days * 24).toFixed(1)}h` : `${days.toFixed(1)}d`;
  const score = c.matchScore;
  const scoreColor =
    score >= 90 ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40'
    : score >= 80 ? 'text-amber-300 bg-amber-500/20 border-amber-500/40'
    : score >= 70 ? 'text-orange-300 bg-orange-500/20 border-orange-500/40'
    : 'text-white/60 bg-white/10 border-white/20';
  return (
    <>
      <tr className="border-t border-white/5 hover:bg-slate-900/50 text-white/80">
        {mode === 'weighted' && (
          <td className="px-3 py-1.5">
            {score != null
              ? <span className={`font-mono px-1.5 py-0.5 rounded border ${scoreColor}`}>{score}%</span>
              : <span className="text-white/30">—</span>}
          </td>
        )}
        <td className="px-3 py-1.5 font-mono text-cyan-300">{c.year}</td>
        <td className="px-3 py-1.5 font-mono">{c.start.toISOString().slice(0, 16).replace('T', ' ')}</td>
        <td className="px-3 py-1.5 font-mono">{c.end.toISOString().slice(0, 16).replace('T', ' ')}</td>
        {houseConstrained && (
          <>
            <td className="px-3 py-1.5 font-mono text-emerald-300">{c.localStart || '—'}</td>
            <td className="px-3 py-1.5 font-mono text-emerald-300">{c.localEnd || '—'}</td>
          </>
        )}
        <td className="px-3 py-1.5">{dur}</td>
        <td className="px-3 py-1.5 text-amber-300">{c.ageAtReference}</td>
        {showDistance && (
          <td className="px-3 py-1.5 font-mono text-cyan-300">
            {distanceKm != null ? formatKm(distanceKm) : '—'}
          </td>
        )}
        {onLoadChart && (
          <td className="px-3 py-1.5">
            <button
              type="button"
              onClick={() => onLoadChart(c)}
              className="text-[10px] px-2 py-0.5 rounded border border-purple-500/50 bg-purple-500/20 text-purple-100 hover:bg-purple-500/40 font-semibold"
              title="Load this window's midpoint into the Birth Wheel (uses location & timezone from the search)"
            >
              ↗ Load
            </button>
          </td>
        )}
        {mode === 'weighted' && (
          <td className="px-3 py-1.5">
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="text-[10px] text-white/50 hover:text-white underline"
            >
              {open ? 'hide' : 'why?'}
            </button>
          </td>
        )}
      </tr>
      {open && mode === 'weighted' && (
        <tr className="bg-slate-950/70">
          <td colSpan={11} className="px-3 py-2 text-[11px]">
            <WhyBreakdown matched={c.matched} missed={c.missed} />
          </td>
        </tr>
      )}
    </>
  );
}

// Back-compat: earlier `matched` was array of strings (planet names); now it's
// an array of { planet, points, maxPoints, credit, partial, ... }. Handle both.
function WhyBreakdown({ matched = [], missed = [] }) {
  const norm = (entry) =>
    typeof entry === 'string'
      ? { planet: entry, points: null, maxPoints: null, credit: 1, partial: false }
      : entry;
  const mRows = matched.map(norm);
  const missRows = missed.map(norm);
  const totalPts = mRows.reduce((s, r) => s + (r.points || 0), 0) +
                   missRows.reduce((s, r) => s + (r.points || 0), 0);
  const maxPts = mRows.reduce((s, r) => s + (r.maxPoints || 0), 0) +
                 missRows.reduce((s, r) => s + (r.maxPoints || 0), 0);
  const all = [...mRows, ...missRows]
    .sort((a, b) => (b.maxPoints || 0) - (a.maxPoints || 0));
  return (
    <div className="space-y-1.5">
      {maxPts > 0 && (
        <div className="text-[10px] text-white/50">
          <span className="text-white/70 font-semibold">{Math.round(totalPts * 10) / 10}</span>
          <span className="text-white/40"> / {Math.round(maxPts * 10) / 10} points</span>
          <span className="text-white/30 ml-2">partial credit: same-element = 0.5×, same-modality = 0.25× (Moon / Venus / Mars)</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {all.map((row, i) => {
          const gotSign = row.got?.sign;
          const isFull = row.credit >= 1;
          const isPartial = row.partial || (row.credit > 0 && row.credit < 1);
          const isMiss = !isFull && !isPartial;
          const style = isFull
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
            : isPartial
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
              : 'bg-red-500/15 border-red-500/40 text-red-200';
          const icon = isFull ? '✓' : isPartial ? '~' : '✗';
          const ptsLabel = row.maxPoints != null
            ? ` ${row.points}/${row.maxPoints}`
            : '';
          return (
            <span key={i} className={`px-1.5 py-0.5 rounded border ${style}`}>
              <span className="font-semibold">{icon} {row.planet}</span>
              <span className="font-mono text-[9px] text-white/60">{ptsLabel}</span>
              {row.wantedSigns && !isFull && (
                <span className="text-white/50"> wanted {row.wantedSigns.join('/')}</span>
              )}
              {gotSign && !isFull && (
                <span className="text-white/40">, got {gotSign}</span>
              )}
              {row.wantedHouse && row.got?.house && row.got.house !== row.wantedHouse && (
                <span className="text-white/40"> (house {row.got.house} ≠ {row.wantedHouse})</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic compatibility preset panel — reads user's chart, ranks 3 archetypes
// ─────────────────────────────────────────────────────────────────────────────
const RANK_BADGE = {
  primary:   { label: 'Best match',   style: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50' },
  secondary: { label: 'Alternative',  style: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50' },
  optional:  { label: 'Experimental', style: 'bg-rose-500/20 text-rose-200 border-rose-500/50' },
};
const ACCENT_RING = {
  emerald: 'hover:ring-emerald-500/40 border-emerald-500/30',
  cyan:    'hover:ring-cyan-500/40 border-cyan-500/30',
  rose:    'hover:ring-rose-500/40 border-rose-500/30',
};

function PresetSuggestionPanel({ suggestion, onApply, activePresetId }) {
  const { ranked, rationale = [] } = suggestion || {};
  if (!ranked || ranked.length === 0) return null;

  return (
    <div className="mb-5 p-4 bg-slate-900/40 border border-purple-500/20 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">
            ✨ Recommended partner archetypes for this profile
          </h4>
          <p className="text-[10px] text-white/50 mt-0.5">
            Ranked from your chart's elemental + relational needs. Apply one to fill filters below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        {ranked.map(({ preset, rank, score }) => {
          const badge = RANK_BADGE[rank] || RANK_BADGE.optional;
          const accent = ACCENT_RING[preset.accent] || ACCENT_RING.emerald;
          const isActive = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              className={`bg-slate-950/60 border rounded-lg p-3 transition ${
                isActive
                  ? 'ring-2 ring-emerald-400/80 border-emerald-400/60 bg-emerald-500/5'
                  : `hover:ring-2 ${accent}`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${badge.style}`}>
                  {badge.label}
                </span>
                <span className="text-[9px] text-white/40">score {score.toFixed(1)}</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">{preset.label}</div>
              <div className="text-[10px] text-white/60 italic mb-1.5">"{preset.tagline}"</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {preset.coreTraits.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <div className="text-[9px] text-white/40 mb-2 leading-snug">
                {preset.astroSignature}
              </div>

              {/* Trade-offs: positives + negatives for realism */}
              {PRESET_TRADEOFFS[preset.id] && (
                <div className="mb-2 space-y-1 text-[9px] leading-snug">
                  <div className="text-emerald-300/80">
                    <span className="font-semibold">+</span> {PRESET_TRADEOFFS[preset.id].positives[0]}
                  </div>
                  <div className="text-rose-300/80">
                    <span className="font-semibold">−</span> {PRESET_TRADEOFFS[preset.id].negatives[0]}
                  </div>
                  <details className="text-white/50">
                    <summary className="cursor-pointer text-[9px] hover:text-white/80">more trade-offs…</summary>
                    <div className="mt-1 space-y-0.5">
                      {PRESET_TRADEOFFS[preset.id].positives.slice(1).map((p, k) => (
                        <div key={`p${k}`} className="text-emerald-300/70">+ {p}</div>
                      ))}
                      {PRESET_TRADEOFFS[preset.id].negatives.slice(1).map((n, k) => (
                        <div key={`n${k}`} className="text-rose-300/70">− {n}</div>
                      ))}
                      <div className="pt-1 italic text-white/50">
                        {PRESET_TRADEOFFS[preset.id].summary}
                      </div>
                    </div>
                  </details>
                </div>
              )}

              <button
                type="button"
                onClick={() => onApply(preset)}
                className={`w-full text-[10px] font-semibold px-2 py-1 rounded border transition ${
                  isActive
                    ? 'bg-emerald-500/40 hover:bg-emerald-500/20 border-emerald-400 text-white'
                    : 'bg-purple-600/30 hover:bg-purple-600/60 border-purple-500/50 text-purple-100'
                }`}
              >
                {isActive ? '✓ Applied — click to clear' : 'Apply this preset'}
              </button>
            </div>
          );
        })}
      </div>

      {rationale.length > 0 && (
        <details className="text-[10px] text-white/50">
          <summary className="cursor-pointer text-white/60 hover:text-white">
            Why these presets?
          </summary>
          <ul className="mt-1.5 space-y-0.5 pl-3">
            {rationale.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}
