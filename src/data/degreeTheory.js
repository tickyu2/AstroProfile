/**
 * Nikola Stojanovic's Degree Theory
 * Maps each degree (0-29) to a zodiac sign energy in a 2.5x repeating cycle.
 * Used for birth time rectification and identifying significant placements.
 *
 * Cycle 1: 0°=Aries Point, 1-12° = Aries→Pisces
 * Cycle 2: 13-24° = Aries→Pisces
 * Cycle 3 (partial): 25-29° = Aries→Leo
 */

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

// Full 0-29 Stojanovic degree → zodiac sign energy mapping
export const DEGREE_SIGN_MAP = {
  0:  'Aries',        // World Axis / Aries Point
  1:  'Aries',
  2:  'Taurus',
  3:  'Gemini',
  4:  'Cancer',
  5:  'Leo',
  6:  'Virgo',
  7:  'Libra',
  8:  'Scorpio',
  9:  'Sagittarius',
  10: 'Capricorn',
  11: 'Aquarius',
  12: 'Pisces',
  13: 'Aries',
  14: 'Taurus',
  15: 'Gemini',
  16: 'Cancer',
  17: 'Leo',
  18: 'Virgo',
  19: 'Libra',
  20: 'Scorpio',
  21: 'Sagittarius',
  22: 'Capricorn',
  23: 'Aquarius',
  24: 'Pisces',
  25: 'Aries',
  26: 'Taurus',
  27: 'Gemini',
  28: 'Cancer',
  29: 'Leo',
};

// Sign glyphs for display
const SIGN_GLYPH = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋',
  Leo:'♌', Virgo:'♍', Libra:'♎', Scorpio:'♏',
  Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓'
};

/**
 * Notable / special degrees — only degrees with distinct significance.
 * Each entry: { keywords, category, color, symbol, badge, shortBadge }
 */
export const NOTABLE_DEGREES = {
  0:  { keywords: ['World Axis', 'Aries Point'],                   category: 'world_axis', color: '#f59e0b', symbol: '🌍', badge: 'World Axis',    shortBadge: '0° AP' },
  4:  { keywords: ['Critical Mutable', 'Cancer/Flux'],             category: 'critical',   color: '#a78bfa', symbol: '◇',  badge: 'Critical',      shortBadge: '4° Crit' },
  5:  { keywords: ['Fame', 'Leo Energy', 'Eroticism'],             category: 'fame',       color: '#fbbf24', symbol: '★',  badge: 'Fame',          shortBadge: '★ Fame' },
  8:  { keywords: ['Wealth', 'Scorpio Power', 'Avatar'],           category: 'wealth',     color: '#10b981', symbol: '$',  badge: 'Wealth',        shortBadge: '$ Wealth' },
  9:  { keywords: ['Critical Fixed', 'Avatar'],                    category: 'critical',   color: '#a78bfa', symbol: '◇',  badge: 'Avatar',        shortBadge: '9° Avtr' },
  13: { keywords: ['Critical Cardinal', 'Aries Point'],            category: 'critical',   color: '#a78bfa', symbol: '◇',  badge: 'Critical',      shortBadge: '13° Crit' },
  15: { keywords: ['Sign Midpoint', 'Gemini Energy'],              category: 'midpoint',   color: '#94a3b8', symbol: '◎',  badge: 'Midpoint',      shortBadge: '15° Mid' },
  17: { keywords: ['Fame', 'Leo Energy', 'Critical Mutable'],      category: 'fame',       color: '#fbbf24', symbol: '★',  badge: 'Fame',          shortBadge: '★ Fame' },
  18: { keywords: ['Darkness', 'Virgo Degree'],                    category: 'darkness',   color: '#6b7280', symbol: '●',  badge: 'Darkness',      shortBadge: '18° Dark' },
  20: { keywords: ['Wealth', 'Scorpio Power'],                     category: 'wealth',     color: '#10b981', symbol: '$',  badge: 'Wealth',        shortBadge: '$ Wealth' },
  21: { keywords: ['Critical Fixed', 'Avatar'],                    category: 'critical',   color: '#a78bfa', symbol: '◇',  badge: 'Avatar',        shortBadge: '21° Avtr' },
  22: { keywords: ['Kill or Be Killed', 'Capricorn'],              category: 'kill',       color: '#ef4444', symbol: '⚡',  badge: 'Kill/Killed',   shortBadge: '⚡ 22°' },
  26: { keywords: ['Critical Cardinal', 'Completion'],             category: 'critical',   color: '#a78bfa', symbol: '◇',  badge: 'Critical',      shortBadge: '26° Crit' },
  29: { keywords: ['Anaretic', 'Fame', 'Leo', 'Karmic Mastery'],   category: 'anaretic',   color: '#f43f5e', symbol: '★⚠', badge: 'Anaretic/Fame', shortBadge: '★ 29°' },
};

/**
 * Get degree theory data for a given degree.
 * @param {number} degree - Degree within sign (0-29.99). Floors to integer.
 * @returns {{ degreeInt: number, stojanovicSign: string, stojanovicGlyph: string, notable: object|null }}
 */
export function getDegreeTheory(degree) {
  const degreeInt = Math.floor(degree) % 30;
  const sign = DEGREE_SIGN_MAP[degreeInt];
  return {
    degreeInt,
    stojanovicSign: sign,
    stojanovicGlyph: SIGN_GLYPH[sign] || '',
    notable: NOTABLE_DEGREES[degreeInt] || null,
  };
}

/**
 * Check all planets + angles for notable degrees. Returns sorted array of hits.
 * @param {Object} pObj - Planet data object (key -> { sign, degree, ... })
 * @param {Array} angles - Angles array [{ tag, sign, degree, lon }, ...]
 * @param {Object} PLANET_SYM - Symbol map
 * @param {Object} PLANET_NAME - Name map
 * @returns {Array} Sorted by category priority
 */
export function findNotableDegrees(pObj, angles, PLANET_SYM, PLANET_NAME) {
  const hits = [];

  // Check planets
  for (const [key, data] of Object.entries(pObj)) {
    if (!data?.sign) continue;
    const deg = data.degree ?? data.degreeInSign ?? 0;
    const theory = getDegreeTheory(deg);
    if (theory.notable) {
      hits.push({
        key,
        name: PLANET_NAME[key] || key,
        symbol: PLANET_SYM[key] || '?',
        sign: data.sign,
        degree: deg,
        theory,
      });
    }
  }

  // Check angles (ASC, MC, DSC, IC)
  for (const a of angles) {
    const theory = getDegreeTheory(a.degree);
    if (theory.notable) {
      hits.push({
        key: `angle_${a.tag}`,
        name: a.tag,
        symbol: a.tag,
        sign: a.sign,
        degree: a.degree,
        theory,
      });
    }
  }

  // Sort: anaretic/fame/wealth first, then critical
  const priority = { anaretic: 0, fame: 1, kill: 2, wealth: 3, world_axis: 4, darkness: 5, critical: 6, midpoint: 7 };
  hits.sort((a, b) => (priority[a.theory.notable.category] ?? 99) - (priority[b.theory.notable.category] ?? 99));

  return hits;
}
