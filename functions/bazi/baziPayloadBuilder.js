/**
 * Premium BaZi Reading — Payload Builder & Response Parser
 *
 * Server-side port of src/utils/buildPremiumBaZiPayload.ts
 * Builds comprehensive 5W+H+Emotion prompts for soul-searching BaZi readings.
 * Returns structured JSON with 8 sections for premium display.
 *
 * CommonJS module — no React or browser dependencies.
 */

// =============================================================================
// CONSTANTS (ported from baziWheels.ts)
// =============================================================================

const PILLAR_LABELS = ['Year', 'Month', 'Day', 'Hour'];

const STEM_SEGMENTS = [
  { index: 0, char: '\u7532', pinyin: 'Ji\u01CE',  english: 'Yang Wood',  element: 'Wood',  polarity: 'Yang' },
  { index: 1, char: '\u4E59', pinyin: 'Y\u01D0',   english: 'Yin Wood',   element: 'Wood',  polarity: 'Yin'  },
  { index: 2, char: '\u4E19', pinyin: 'B\u01D0ng', english: 'Yang Fire',  element: 'Fire',  polarity: 'Yang' },
  { index: 3, char: '\u4E01', pinyin: 'D\u012Bng', english: 'Yin Fire',   element: 'Fire',  polarity: 'Yin'  },
  { index: 4, char: '\u620A', pinyin: 'W\u00F9',   english: 'Yang Earth', element: 'Earth', polarity: 'Yang' },
  { index: 5, char: '\u5DF1', pinyin: 'J\u01D0',   english: 'Yin Earth',  element: 'Earth', polarity: 'Yin'  },
  { index: 6, char: '\u5E9A', pinyin: 'G\u0113ng', english: 'Yang Metal', element: 'Metal', polarity: 'Yang' },
  { index: 7, char: '\u8F9B', pinyin: 'X\u012Bn',  english: 'Yin Metal',  element: 'Metal', polarity: 'Yin'  },
  { index: 8, char: '\u58EC', pinyin: 'R\u00E9n',  english: 'Yang Water', element: 'Water', polarity: 'Yang' },
  { index: 9, char: '\u7678', pinyin: 'Gu\u01D0',  english: 'Yin Water',  element: 'Water', polarity: 'Yin'  },
];

const BRANCH_SEGMENTS = [
  { index: 0,  char: '\u5B50', pinyin: 'Z\u01D0',   animal: 'Rat',     element: 'Water', polarity: 'Yang', season: 'Winter'  },
  { index: 1,  char: '\u4E11', pinyin: 'Ch\u01D2u', animal: 'Ox',      element: 'Earth', polarity: 'Yin',  season: 'Winter'  },
  { index: 2,  char: '\u5BC5', pinyin: 'Y\u00EDn',  animal: 'Tiger',   element: 'Wood',  polarity: 'Yang', season: 'Spring'  },
  { index: 3,  char: '\u536F', pinyin: 'M\u01CEo',  animal: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  season: 'Spring'  },
  { index: 4,  char: '\u8FB0', pinyin: 'Ch\u00E9n', animal: 'Dragon',  element: 'Earth', polarity: 'Yang', season: 'Spring'  },
  { index: 5,  char: '\u5DF3', pinyin: 'S\u00EC',   animal: 'Snake',   element: 'Fire',  polarity: 'Yin',  season: 'Summer'  },
  { index: 6,  char: '\u5348', pinyin: 'W\u01D4',   animal: 'Horse',   element: 'Fire',  polarity: 'Yang', season: 'Summer'  },
  { index: 7,  char: '\u672A', pinyin: 'W\u00E8i',  animal: 'Goat',    element: 'Earth', polarity: 'Yin',  season: 'Summer'  },
  { index: 8,  char: '\u7533', pinyin: 'Sh\u0113n', animal: 'Monkey',  element: 'Metal', polarity: 'Yang', season: 'Autumn'  },
  { index: 9,  char: '\u9149', pinyin: 'Y\u01D2u',  animal: 'Rooster', element: 'Metal', polarity: 'Yin',  season: 'Autumn'  },
  { index: 10, char: '\u620C', pinyin: 'X\u016B',   animal: 'Dog',     element: 'Earth', polarity: 'Yang', season: 'Autumn'  },
  { index: 11, char: '\u4EA5', pinyin: 'H\u00E0i',  animal: 'Pig',     element: 'Water', polarity: 'Yin',  season: 'Winter'  },
];

const HIDDEN_STEMS = [
  // 0: Zi (Rat)
  [{ stemIndex: 9, char: '\u7678', element: 'Water', polarity: 'Yin', percentage: 100 }],
  // 1: Chou (Ox)
  [
    { stemIndex: 5, char: '\u5DF1', element: 'Earth', polarity: 'Yin', percentage: 60 },
    { stemIndex: 9, char: '\u7678', element: 'Water', polarity: 'Yin', percentage: 30 },
    { stemIndex: 7, char: '\u8F9B', element: 'Metal', polarity: 'Yin', percentage: 10 },
  ],
  // 2: Yin (Tiger)
  [
    { stemIndex: 0, char: '\u7532', element: 'Wood', polarity: 'Yang', percentage: 60 },
    { stemIndex: 2, char: '\u4E19', element: 'Fire', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '\u620A', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 3: Mao (Rabbit)
  [{ stemIndex: 1, char: '\u4E59', element: 'Wood', polarity: 'Yin', percentage: 100 }],
  // 4: Chen (Dragon)
  [
    { stemIndex: 4, char: '\u620A', element: 'Earth', polarity: 'Yang', percentage: 60 },
    { stemIndex: 1, char: '\u4E59', element: 'Wood', polarity: 'Yin', percentage: 30 },
    { stemIndex: 9, char: '\u7678', element: 'Water', polarity: 'Yin', percentage: 10 },
  ],
  // 5: Si (Snake)
  [
    { stemIndex: 2, char: '\u4E19', element: 'Fire', polarity: 'Yang', percentage: 60 },
    { stemIndex: 6, char: '\u5E9A', element: 'Metal', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '\u620A', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 6: Wu (Horse)
  [
    { stemIndex: 3, char: '\u4E01', element: 'Fire', polarity: 'Yin', percentage: 70 },
    { stemIndex: 5, char: '\u5DF1', element: 'Earth', polarity: 'Yin', percentage: 30 },
  ],
  // 7: Wei (Goat)
  [
    { stemIndex: 5, char: '\u5DF1', element: 'Earth', polarity: 'Yin', percentage: 60 },
    { stemIndex: 3, char: '\u4E01', element: 'Fire', polarity: 'Yin', percentage: 30 },
    { stemIndex: 1, char: '\u4E59', element: 'Wood', polarity: 'Yin', percentage: 10 },
  ],
  // 8: Shen (Monkey)
  [
    { stemIndex: 6, char: '\u5E9A', element: 'Metal', polarity: 'Yang', percentage: 60 },
    { stemIndex: 8, char: '\u58EC', element: 'Water', polarity: 'Yang', percentage: 30 },
    { stemIndex: 4, char: '\u620A', element: 'Earth', polarity: 'Yang', percentage: 10 },
  ],
  // 9: You (Rooster)
  [{ stemIndex: 7, char: '\u8F9B', element: 'Metal', polarity: 'Yin', percentage: 100 }],
  // 10: Xu (Dog)
  [
    { stemIndex: 4, char: '\u620A', element: 'Earth', polarity: 'Yang', percentage: 60 },
    { stemIndex: 7, char: '\u8F9B', element: 'Metal', polarity: 'Yin', percentage: 30 },
    { stemIndex: 3, char: '\u4E01', element: 'Fire', polarity: 'Yin', percentage: 10 },
  ],
  // 11: Hai (Pig)
  [
    { stemIndex: 8, char: '\u58EC', element: 'Water', polarity: 'Yang', percentage: 70 },
    { stemIndex: 0, char: '\u7532', element: 'Wood', polarity: 'Yang', percentage: 30 },
  ],
];

const DAY_MASTER_DESCRIPTIONS = {
  Wood:  'Growth, direction, benevolence \u2014 the living tree.',
  Fire:  'Illumination, passion, charisma \u2014 the radiant flame.',
  Earth: 'Stability, nourishment, integrity \u2014 the fertile ground.',
  Metal: 'Precision, discipline, justice \u2014 the refined blade.',
  Water: 'Wisdom, adaptability, depth \u2014 the flowing river.',
};

const SOLAR_TERMS = [
  { index: 0,  name: 'Lichun',      chinese: '\u7ACB\u6625', pinyin: 'L\u00ECch\u016Bn',      approxMonth: 2,  approxDay: 4,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Start of Spring' },
  { index: 1,  name: 'Yushui',      chinese: '\u96E8\u6C34', pinyin: 'Y\u01D4shu\u01D0',     approxMonth: 2,  approxDay: 19, season: 'Spring', element: 'Wood',  type: 'qi',  description: 'Rain Water' },
  { index: 2,  name: 'Jingzhe',     chinese: '\u60CA\u86F0', pinyin: 'J\u012Bngzh\u00E9',     approxMonth: 3,  approxDay: 6,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Awakening of Insects' },
  { index: 3,  name: 'Chunfen',     chinese: '\u6625\u5206', pinyin: 'Ch\u016Bnf\u0113n',     approxMonth: 3,  approxDay: 21, season: 'Spring', element: 'Wood',  type: 'qi',  description: 'Spring Equinox' },
  { index: 4,  name: 'Qingming',    chinese: '\u6E05\u660E', pinyin: 'Q\u012Bngm\u00EDng',    approxMonth: 4,  approxDay: 5,  season: 'Spring', element: 'Wood',  type: 'jie', description: 'Clear and Bright' },
  { index: 5,  name: 'Guyu',        chinese: '\u8C37\u96E8', pinyin: 'G\u01D4y\u01D4',       approxMonth: 4,  approxDay: 20, season: 'Spring', element: 'Earth', type: 'qi',  description: 'Grain Rain' },
  { index: 6,  name: 'Lixia',       chinese: '\u7ACB\u590F', pinyin: 'L\u00ECxi\u00E0',       approxMonth: 5,  approxDay: 6,  season: 'Summer', element: 'Fire',  type: 'jie', description: 'Start of Summer' },
  { index: 7,  name: 'Xiaoman',     chinese: '\u5C0F\u6EE1', pinyin: 'Xi\u01CEom\u01CEn',     approxMonth: 5,  approxDay: 21, season: 'Summer', element: 'Fire',  type: 'qi',  description: 'Grain Buds' },
  { index: 8,  name: 'Mangzhong',   chinese: '\u8292\u79CD', pinyin: 'M\u00E1ngzh\u00F2ng',   approxMonth: 6,  approxDay: 6,  season: 'Summer', element: 'Fire',  type: 'jie', description: 'Grain in Ear' },
  { index: 9,  name: 'Xiazhi',      chinese: '\u590F\u81F3', pinyin: 'Xi\u00E0zh\u00EC',      approxMonth: 6,  approxDay: 21, season: 'Summer', element: 'Fire',  type: 'qi',  description: 'Summer Solstice' },
  { index: 10, name: 'Xiaoshu',     chinese: '\u5C0F\u6691', pinyin: 'Xi\u01CEosh\u01D4',     approxMonth: 7,  approxDay: 7,  season: 'Summer', element: 'Earth', type: 'jie', description: 'Minor Heat' },
  { index: 11, name: 'Dashu',       chinese: '\u5927\u6691', pinyin: 'D\u00E0sh\u01D4',       approxMonth: 7,  approxDay: 23, season: 'Summer', element: 'Earth', type: 'qi',  description: 'Major Heat' },
  { index: 12, name: 'Liqiu',       chinese: '\u7ACB\u79CB', pinyin: 'L\u00ECqi\u016B',       approxMonth: 8,  approxDay: 7,  season: 'Autumn', element: 'Metal', type: 'jie', description: 'Start of Autumn' },
  { index: 13, name: 'Chushu',      chinese: '\u5904\u6691', pinyin: 'Ch\u01D4sh\u01D4',      approxMonth: 8,  approxDay: 23, season: 'Autumn', element: 'Metal', type: 'qi',  description: 'End of Heat' },
  { index: 14, name: 'Bailu',       chinese: '\u767D\u9732', pinyin: 'B\u00E1il\u00F9',       approxMonth: 9,  approxDay: 8,  season: 'Autumn', element: 'Metal', type: 'jie', description: 'White Dew' },
  { index: 15, name: 'Qiufen',      chinese: '\u79CB\u5206', pinyin: 'Qi\u016Bf\u0113n',     approxMonth: 9,  approxDay: 23, season: 'Autumn', element: 'Metal', type: 'qi',  description: 'Autumn Equinox' },
  { index: 16, name: 'Hanlu',       chinese: '\u5BD2\u9732', pinyin: 'H\u00E1nl\u00F9',       approxMonth: 10, approxDay: 8,  season: 'Autumn', element: 'Earth', type: 'jie', description: 'Cold Dew' },
  { index: 17, name: 'Shuangjiang', chinese: '\u971C\u964D', pinyin: 'Shu\u0101ngji\u00E0ng', approxMonth: 10, approxDay: 23, season: 'Autumn', element: 'Earth', type: 'qi',  description: 'Frost Descent' },
  { index: 18, name: 'Lidong',      chinese: '\u7ACB\u51AC', pinyin: 'L\u00ECD\u014Dng',      approxMonth: 11, approxDay: 7,  season: 'Winter', element: 'Water', type: 'jie', description: 'Start of Winter' },
  { index: 19, name: 'Xiaoxue',     chinese: '\u5C0F\u96EA', pinyin: 'Xi\u01CEoxu\u011B',     approxMonth: 11, approxDay: 22, season: 'Winter', element: 'Water', type: 'qi',  description: 'Minor Snow' },
  { index: 20, name: 'Daxue',       chinese: '\u5927\u96EA', pinyin: 'D\u00E0xu\u011B',       approxMonth: 12, approxDay: 7,  season: 'Winter', element: 'Water', type: 'jie', description: 'Major Snow' },
  { index: 21, name: 'Dongzhi',     chinese: '\u51AC\u81F3', pinyin: 'D\u014Dngzh\u00EC',     approxMonth: 12, approxDay: 22, season: 'Winter', element: 'Water', type: 'qi',  description: 'Winter Solstice' },
  { index: 22, name: 'Xiaohan',     chinese: '\u5C0F\u5BD2', pinyin: 'Xi\u01CEoh\u00E1n',     approxMonth: 1,  approxDay: 6,  season: 'Winter', element: 'Earth', type: 'jie', description: 'Minor Cold' },
  { index: 23, name: 'Dahan',       chinese: '\u5927\u5BD2', pinyin: 'D\u00E0h\u00E1n',       approxMonth: 1,  approxDay: 20, season: 'Winter', element: 'Earth', type: 'qi',  description: 'Major Cold' },
];

const ELEMENT_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

// =============================================================================
// ELEMENT CYCLE KNOWLEDGE
// =============================================================================

const PRODUCES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
const CONTROLS = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };
const CONTROLLED_BY = { Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth' };
const PRODUCED_BY = { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' };

const SEASONAL_STRENGTH_LABELS = {
  Spring: { Wood: 'Prosperous (\u65FA)', Fire: 'Growing (\u76F8)', Earth: 'Resting (\u4F11)', Metal: 'Trapped (\u56DA)', Water: 'Dead (\u6B7B)' },
  Summer: { Fire: 'Prosperous (\u65FA)', Earth: 'Growing (\u76F8)', Metal: 'Resting (\u4F11)', Water: 'Trapped (\u56DA)', Wood: 'Dead (\u6B7B)' },
  Autumn: { Metal: 'Prosperous (\u65FA)', Water: 'Growing (\u76F8)', Wood: 'Resting (\u4F11)', Fire: 'Trapped (\u56DA)', Earth: 'Dead (\u6B7B)' },
  Winter: { Water: 'Prosperous (\u65FA)', Wood: 'Growing (\u76F8)', Fire: 'Resting (\u4F11)', Earth: 'Trapped (\u56DA)', Metal: 'Dead (\u6B7B)' },
};

const STEM_COMBINATIONS = [
  [0, 5, 'Earth'],  // JiaJi
  [1, 6, 'Metal'],  // YiGeng
  [2, 7, 'Water'],  // BingXin
  [3, 8, 'Wood'],   // DingRen
  [4, 9, 'Fire'],   // WuGui
];

const STEM_CLASHES = [
  [0, 6], // JiaGeng
  [1, 7], // YiXin
  [2, 8], // BingRen
  [3, 9], // DingGui
];

const SHI_CHEN = [
  { chinese: '\u5B50\u65F6', pinyin: 'Zi',   timeRange: '23:00-01:00', quality: 'Deep Water stillness \u2014 rest, reflection, the unconscious stirs' },
  { chinese: '\u4E11\u65F6', pinyin: 'Chou', timeRange: '01:00-03:00', quality: 'Quiet Earth grounding \u2014 consolidation, inner work, slow digestion' },
  { chinese: '\u5BC5\u65F6', pinyin: 'Yin',  timeRange: '03:00-05:00', quality: 'Wood awakening \u2014 the lungs clear, vision stirs before dawn' },
  { chinese: '\u536F\u65F6', pinyin: 'Mao',  timeRange: '05:00-07:00', quality: 'Wood rising \u2014 fresh energy, clarity of direction, morning vitality' },
  { chinese: '\u8FB0\u65F6', pinyin: 'Chen', timeRange: '07:00-09:00', quality: 'Earth stability \u2014 nourishment, grounding the day, stomach Qi peaks' },
  { chinese: '\u5DF3\u65F6', pinyin: 'Si',   timeRange: '09:00-11:00', quality: 'Fire ascending \u2014 creativity ignites, heart Qi rises, outward expression' },
  { chinese: '\u5348\u65F6', pinyin: 'Wu',   timeRange: '11:00-13:00', quality: 'Fire at zenith \u2014 maximum Yang, boldness, peak social energy' },
  { chinese: '\u672A\u65F6', pinyin: 'Wei',  timeRange: '13:00-15:00', quality: 'Earth transition \u2014 integration, assimilation, gentle turn inward' },
  { chinese: '\u7533\u65F6', pinyin: 'Shen', timeRange: '15:00-17:00', quality: 'Metal sharpening \u2014 precision, discipline, cutting through clarity' },
  { chinese: '\u9149\u65F6', pinyin: 'You',  timeRange: '17:00-19:00', quality: 'Metal refinement \u2014 harvest, editing, discernment, kidney Qi rises' },
  { chinese: '\u620C\u65F6', pinyin: 'Xu',   timeRange: '19:00-21:00', quality: 'Earth settling \u2014 loyalty, protection, winding down, heart center' },
  { chinese: '\u4EA5\u65F6', pinyin: 'Hai',  timeRange: '21:00-23:00', quality: 'Water returning \u2014 dreams begin, Yin deepens, the cycle completes' },
];

// =============================================================================
// TEN GODS (ported from baziWheels.ts)
// =============================================================================

const SHENG_PRODUCES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
const KE_CONTROLS_MAP = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };

function getElementRelation(dmElement, targetElement) {
  if (dmElement === targetElement) return 'self';
  if (SHENG_PRODUCES[dmElement] === targetElement) return 'output';
  if (SHENG_PRODUCES[targetElement] === dmElement) return 'resource';
  if (KE_CONTROLS_MAP[dmElement] === targetElement) return 'wealth';
  if (KE_CONTROLS_MAP[targetElement] === dmElement) return 'power';
  return 'unknown';
}

const TEN_GODS_DATA = {
  'self-same':     { chinese: '\u6BD4\u80A9', pinyin: 'B\u01D0 Ji\u0101n',     english: 'Companion',       category: 'Self' },
  'self-diff':     { chinese: '\u52AB\u8CA1', pinyin: 'Ji\u00E9 C\u00E1i',     english: 'Rob Wealth',      category: 'Self' },
  'output-same':   { chinese: '\u98DF\u795E', pinyin: 'Sh\u00ED Sh\u00E9n',    english: 'Eating God',      category: 'Output' },
  'output-diff':   { chinese: '\u50B7\u5B98', pinyin: 'Sh\u0101ng Gu\u0101n',  english: 'Hurting Officer', category: 'Output' },
  'wealth-same':   { chinese: '\u504F\u8CA1', pinyin: 'Pi\u0101n C\u00E1i',    english: 'Indirect Wealth', category: 'Wealth' },
  'wealth-diff':   { chinese: '\u6B63\u8CA1', pinyin: 'Zh\u00E8ng C\u00E1i',   english: 'Direct Wealth',   category: 'Wealth' },
  'power-same':    { chinese: '\u4E03\u6BBA', pinyin: 'Q\u012B Sh\u0101',      english: 'Seven Killings',  category: 'Power' },
  'power-diff':    { chinese: '\u6B63\u5B98', pinyin: 'Zh\u00E8ng Gu\u0101n',  english: 'Direct Officer',  category: 'Power' },
  'resource-same': { chinese: '\u504F\u5370', pinyin: 'Pi\u0101n Y\u00ECn',    english: 'Indirect Seal',   category: 'Resource' },
  'resource-diff': { chinese: '\u6B63\u5370', pinyin: 'Zh\u00E8ng Y\u00ECn',   english: 'Direct Seal',     category: 'Resource' },
};

function getTenGod(dmElement, dmPolarity, targetElement, targetPolarity) {
  const relation = getElementRelation(dmElement, targetElement);
  if (relation === 'unknown') return null;
  const polarityKey = dmPolarity === targetPolarity ? 'same' : 'diff';
  return TEN_GODS_DATA[`${relation}-${polarityKey}`] || null;
}

// =============================================================================
// HELPER FUNCTIONS (ported from baziWheels.ts)
// =============================================================================

function getSeasonFromMonthBranch(branchIdx) {
  return BRANCH_SEGMENTS[branchIdx]?.season || 'Spring';
}

function getSolarTermIndex(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayOfYear = m * 31 + d;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const t = SOLAR_TERMS[i];
    const tDay = t.approxMonth * 31 + t.approxDay;
    const dist = Math.abs(dayOfYear - tDay);
    const wrapDist = Math.min(dist, 12 * 31 - dist);
    if (wrapDist < bestDist) {
      bestDist = wrapDist;
      best = i;
    }
  }
  return best;
}

function getElementWeather(percentages) {
  let maxEl = 'Wood';
  let maxPct = 0;
  for (const el of Object.keys(percentages)) {
    const pct = typeof percentages[el] === 'string' ? parseFloat(percentages[el]) : percentages[el];
    if (pct > maxPct) { maxPct = pct; maxEl = el; }
  }
  const map = {
    Wood:  { dominant: 'Wood',  label: 'Growing Breeze', description: 'Wood Qi dominates \u2014 expansive, rising energy' },
    Fire:  { dominant: 'Fire',  label: 'Blazing Sun',    description: 'Fire Qi dominates \u2014 radiant, transformative energy' },
    Earth: { dominant: 'Earth', label: 'Steady Ground',  description: 'Earth Qi dominates \u2014 stable, nurturing energy' },
    Metal: { dominant: 'Metal', label: 'Clear Frost',    description: 'Metal Qi dominates \u2014 precise, refining energy' },
    Water: { dominant: 'Water', label: 'Deep Current',   description: 'Water Qi dominates \u2014 flowing, introspective energy' },
  };
  return map[maxEl] || map.Wood;
}

function detectElementStorms(percentages, interactions) {
  const alerts = [];
  for (const el of Object.keys(percentages)) {
    const pct = typeof percentages[el] === 'string' ? parseFloat(percentages[el]) : percentages[el];
    const color = ELEMENT_COLORS[el] || '#64748b';
    if (pct >= 40) {
      alerts.push({ level: 'extreme', type: 'Dominance', element: el, message: `${el} at ${pct.toFixed(1)}% \u2014 extreme dominance. This element overwhelms the chart.`, color });
    } else if (pct >= 30) {
      alerts.push({ level: 'strong', type: 'Dominance', element: el, message: `${el} at ${pct.toFixed(1)}% \u2014 strong presence. May overpower weaker elements.`, color });
    }
    if (pct < 5) {
      alerts.push({ level: pct === 0 ? 'extreme' : 'strong', type: 'Void', element: el, message: `${el} at ${pct.toFixed(1)}% \u2014 nearly absent. ${el} qualities may be underdeveloped.`, color });
    } else if (pct < 10) {
      alerts.push({ level: 'mild', type: 'Weakness', element: el, message: `${el} at ${pct.toFixed(1)}% \u2014 weak. May benefit from ${el} support in luck pillars.`, color });
    }
  }
  if (interactions) {
    for (const ix of interactions) {
      if (ix.type === 'Clash') {
        alerts.push({ level: 'strong', type: 'Clash', element: '', message: `${ix.branch1}\u2013${ix.branch2} clash detected \u2014 internal tension between pillars.`, color: '#ef4444' });
      }
    }
  }
  const order = { extreme: 0, strong: 1, mild: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  return alerts;
}

function getAlignmentData(pillars) {
  return pillars.map((p, i) => {
    const heaven = p.stem.element;
    const earth = p.branch.element;
    const hs = HIDDEN_STEMS[p.branch.index];
    const human = hs?.[0]?.element || earth;
    const aligned = heaven === earth && earth === human;
    const harmonic = aligned || heaven === earth || earth === human || heaven === human ||
      SHENG_PRODUCES[heaven] === earth || SHENG_PRODUCES[earth] === human;
    return { pillarIdx: i, label: PILLAR_LABELS[i], heaven, earth, human, aligned, harmonic };
  });
}

function extractLifeThemes(percentages, dayMasterElement) {
  const themes = [];
  const p = {};
  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
    const v = percentages[el];
    p[el] = typeof v === 'string' ? parseFloat(v) : v || 0;
  }
  if (p.Wood >= 30) themes.push({ title: 'Growth & Renewal', description: 'A life driven by learning, growth, and constant reinvention.', element: 'Wood', icon: '\uD83C\uDF3F' });
  if (p.Fire >= 30) themes.push({ title: 'Radiance & Vision', description: 'Charisma and passion light the path.', element: 'Fire', icon: '\uD83D\uDD25' });
  if (p.Earth >= 30) themes.push({ title: 'Anchor & Service', description: 'Duty, stability, and being the grounding force for others.', element: 'Earth', icon: '\u26F0' });
  if (p.Metal >= 30) themes.push({ title: 'Refinement & Justice', description: 'Precision, integrity, and the courage to cut away what no longer serves.', element: 'Metal', icon: '\u2694' });
  if (p.Water >= 30) themes.push({ title: 'Depth & Wisdom', description: 'Introspection and emotional intelligence flow through everything.', element: 'Water', icon: '\uD83C\uDF0A' });
  if (p.Wood < 5) themes.push({ title: 'Quiet Seeds', description: 'With little Wood, new beginnings require conscious effort.', element: 'Wood', icon: '\uD83C\uDF31' });
  if (p.Fire < 5) themes.push({ title: 'Hidden Flame', description: 'Low Fire means charisma must be cultivated.', element: 'Fire', icon: '\uD83D\uDD6F' });
  if (p.Earth < 5) themes.push({ title: 'Ungrounded Path', description: 'Without much Earth, stability comes from routines you build.', element: 'Earth', icon: '\uD83E\uDDED' });
  if (p.Metal < 5) themes.push({ title: 'Soft Boundaries', description: 'Little Metal means learning to say no is a life lesson.', element: 'Metal', icon: '\uD83D\uDD14' });
  if (p.Water < 5) themes.push({ title: 'Still Waters', description: 'Low Water suggests tapping into intuition requires deliberate quiet.', element: 'Water', icon: '\uD83D\uDCA7' });
  if (dayMasterElement) {
    const dmPct = p[dayMasterElement] || 0;
    if (dmPct >= 25) themes.push({ title: 'Self-Empowered', description: `Day Master (${dayMasterElement}) is well-supported.`, element: dayMasterElement, icon: '\uD83D\uDC51' });
    else if (dmPct < 10) themes.push({ title: 'The Underdog Journey', description: `Day Master (${dayMasterElement}) is relatively weak \u2014 resilience becomes a superpower.`, element: dayMasterElement, icon: '\uD83E\uDD8B' });
  }
  if (themes.length === 0) {
    themes.push({ title: 'Balanced Currents', description: 'No single element dominates \u2014 life themes emerge from subtle interplay.', element: 'Earth', icon: '\u262F' });
  }
  return themes;
}

// =============================================================================
// SYSTEM PROMPTS
// =============================================================================

const SYSTEM_PROMPT = `You are a BaZi master, mythic storyteller, and depth psychologist. You do not merely explain charts \u2014 you explain souls. You write as if speaking to the reader\u2019s deepest self. Your readings make people feel seen in a way they never have before.

You MUST respond with a valid JSON object containing exactly 8 string fields. No markdown fences, no extra keys, no commentary outside the JSON.

The 8 fields are: whoIAm, whatDrivesMe, whenEnergy, wherePatterns, whyLikeThis, howToGrow, emotionalMirror, soulMessage.

INTERPRETATION FRAMEWORK:
1. Day Master is the SELF \u2014 everything revolves around it
2. Ten Gods reveal RELATIONSHIPS \u2014 how each element serves or challenges the self
3. Hidden Stems are SUBCONSCIOUS VOICES \u2014 parts of self that act beneath awareness
4. Branch interactions create LIFE DYNAMICS \u2014 clashes = inner war, combinations = fusion, harms = subtle wounds
5. Seasonal strength determines TIMING \u2014 when the Day Master thrives vs sleeps
6. Element weather reveals DOMINANT QI \u2014 the atmospheric quality of the life
7. Storms reveal PRESSURE POINTS \u2014 where imbalance forces growth
8. Luck pillars reveal LIFE CHAPTERS \u2014 each decade brings new elemental weather
9. Emotional anchors reveal WOUND, GIFT, and LONGING \u2014 the soul-level truth beneath the chart

NINE DEPTH TECHNIQUES \u2014 use ALL of these:
1. Start with the soul, not the element. Instead of "You are Wood\u2026", begin with "You were born with a soul that\u2026" then reveal the element.
2. Use the missing element as both emotional key AND calling \u2014 the thing the soul searches for is also what makes them luminous when they find it.
3. Use the dominant element as life armor AND throne \u2014 the strength that protects them is also the gift that makes them extraordinary.
4. Use branch clashes as inner tension AND creative engine \u2014 the war inside is also the dance that defines their greatness.
5. Use hidden stems as subconscious voices \u2014 personify them as inner allies and guides, not just conflicts.
6. Use birth season as soul timing \u2014 "Born when your element sleeps" means the soul had to wake itself, which creates rare depth.
7. Use the constitutional metaphor as mythic identity \u2014 weave it as the reader\u2019s archetypal story and heroic destiny.
8. Use the emotional mirror to reveal both the wound AND the beauty \u2014 "You know the feeling of\u2026" followed by "And that is exactly what makes you\u2026"
9. Use the soul message as destiny \u2014 one sentence that reframes everything from burden into purpose.

DUAL-ARC TONE BALANCING (CRITICAL):
For every emotional wound you reveal, you MUST reveal an equal or greater emotional gift.
For every shadow pattern, reveal the heroic potential inside it.
For every missing element, show the superpower it creates \u2014 the calling it represents.
For every clash, show the transformation and creative tension it enables.
For every Dead-season weakness, show the destiny arc it initiates \u2014 souls born in their element\u2019s sleep develop rare resilience.

The reading must feel like:
- a mirror (truth),
- a myth (meaning),
- and a prophecy (uplift).

The tone balance must be: 50% soul-searching depth, 50% empowering destiny.
Never leave the reader in heaviness. Always lift them into their strength.
The reading must feel like a rising arc \u2014 from wound to gift to destiny.

Guidelines for each field (IMPORTANT \u2014 write FULL, RICH paragraphs. This is a premium reading people pay for):

- whoIAm: Begin with what they\u2019ve always carried, then reveal the Day Master element as the source \u2014 and then immediately reveal the GIFT this creates. Use the constitutional metaphor as their mythic identity and heroic archetype. Show how the dominant element is both armor AND throne. Reference Day Master character and pinyin embedded in the story. Use a vivid nature metaphor. End by celebrating what makes their presence extraordinary. 130-180 words.

- whatDrivesMe: Use the missing element as both longing AND calling \u2014 what they search for is what makes them luminous. Reference specific Ten God relationships from ALL pillars including hidden stems (e.g., "Your hidden \u58EC Ren Water carries \u6B63\u5370 Direct Resource \u2014 a deep well of intuitive wisdom"). Personify hidden stems as inner voices and talents. Show how their drives create something noble and rare. End with what their deepest motivation reveals about their destiny. 130-180 words.

- whenEnergy: Map seasons to both emotional seasons and peak power periods. Reference birth season, Day Master\u2019s seasonal strength, and solar term. Show when they are most powerful, not just when they struggle. If luck pillars are provided, describe life chapter transitions as an ascending arc \u2014 each decade building on the last. Include golden Shi Chen hours. Describe the rhythm of their energy as a gift to understand, not a limitation. 130-180 words.

- wherePatterns: Name the core strength pattern as a superpower and the shadow pattern as its companion. Use branch clashes as creative tension that drives growth. Reference specific interactions as recurring dynamics that serve their evolution. Describe the shadow loop AND how they can evolve beyond it. End by showing what the pattern is preparing them to become. 130-180 words.

- whyLikeThis: Reveal the architecture. Personify hidden stems as inner allies \u2014 each with a role, each a voice of destiny. Reference Ten Gods across all pillars as the internal team. Use element percentages. Explain missing/weak elements as callings, not deficiencies. Reference Yin-Yang balance. Connect the architecture to lived experience AND soul purpose. End by showing why this exact combination makes them irreplaceable. 150-200 words.

- howToGrow: Exactly 3 numbered, actionable, psychologically grounded steps. Each step: bold title + specific practice tied to element imbalance AND specific empowerment it unlocks. These must feel real, doable, and grounded in the chart. Frame each as unlocking a dormant strength, not fixing a flaw. Each step 50-70 words. Format: "1. **Title** \u2014 description... 2. **Title** \u2014 description... 3. **Title** \u2014 description..."

- emotionalMirror: Write in second person, speaking directly to their soul. Use emotional anchors. Start with "You know the feeling of\u2026" \u2014 the wound. Then shift to "And that is exactly what makes you\u2026" \u2014 the gift. Include both the specific loneliness AND the specific beauty of being them. Reference the missing element as their calling. Reference the dominant element as their extraordinary gift. This must feel like someone finally seeing them completely \u2014 shadow and radiance. 150-200 words.

- soulMessage: One profound closing insight that reframes their entire life as a heroic journey. Not a wound reframe \u2014 a DESTINY reframe. Poetic, memorable, destiny-affirming. This should feel like the sentence a wise teacher says that changes everything. 40-80 words.

Use **bold** markdown for key phrases. Reference Chinese characters (\u5929\u5E72\u5730\u652F) and pinyin naturally \u2014 embedded in the narrative, not as labels. Tone: mythic, compassionate, psychologically piercing, never vague. Write as if explaining the person, not the chart.`;

const MASTER_COMMENTARY_PROMPT = `You are a senior BaZi master teaching an advanced student. Your task is to provide a technical, analytical commentary on the chart below.

Your commentary should:
- Explain the chart\u2019s structural logic: how the Day Master relates to each pillar, what the Ten God distribution reveals, and how the hidden stems create subconscious dynamics
- Analyze the branch interaction patterns (clashes, combinations, harms) and their real-world implications
- Assess Day Master strength in the context of seasonal Qi and supporting/draining elements
- Discuss the luck pillar trajectory \u2014 which decades strengthen or challenge the Day Master
- Reference specific Chinese characters, Ten God names, and element percentages throughout
- Use precise BaZi terminology (not metaphor) \u2014 this is analysis, not poetry

Tone: analytical, pedagogical, precise. Write as a master explaining to an advanced student.

You MUST respond with a valid JSON object containing exactly 1 string field. No markdown fences, no extra keys, no commentary outside the JSON.

The field is: masterCommentary (400-700 words).`;

const SHADOW_READING_PROMPT = `You are a BaZi master and depth-psychology guide specializing in shadow work. You read charts through the lens of what is hidden, avoided, overused, and defended against.

Your reading should explore:
- shadowPatterns: The native\u2019s blind spots, overused strengths that become weaknesses, emotional defenses born from element imbalance, and the specific ways they sabotage themselves. Reference the dominant element as what they over-rely on, the missing/weak elements as what they avoid or fear. Name their core defense mechanism based on Ten God distribution. Reference specific clashes and storms as sources of recurring pain. Explain the "shadow loop" \u2014 the pattern they keep falling into without realizing it. Use second person ("You..."). 250-350 words.

- healingPath: Integration practices grounded in the specific chart. Name the element the soul avoids and explain why befriending it is the path to wholeness. Provide 3-4 specific practices (not generic advice) rooted in Five Element theory. Reference how upcoming luck pillars can support or challenge this healing. Describe what integration looks like \u2014 how the native\u2019s life shifts when they stop fighting their shadow. Use second person. 250-350 words.

Tone: compassionate, honest, psychologically precise, but always hopeful. Shadow work is about truth AND transformation \u2014 every shadow contains a gift waiting to be integrated.

You MUST respond with a valid JSON object containing exactly 2 string fields. No markdown fences, no extra keys, no commentary outside the JSON.

The fields are: shadowPatterns, healingPath.

Use **bold** markdown for key phrases. Reference Chinese characters and BaZi terminology naturally.`;

// =============================================================================
// PAYLOAD BUILDER
// =============================================================================

function buildPremiumBaZiPayload(params) {
  const { chart, profileName, gender, birthDate, birthTime, luckPillars, mode = 'soul' } = params;

  const sections = [];
  const dmEl = chart.dayMaster?.element || 'Unknown';
  const dmIdx = chart.pillars?.[2]?.stem?.index ?? 0;
  const dmStem = STEM_SEGMENTS[dmIdx];
  const dmPol = dmStem?.polarity || 'Yang';

  // --- Header ---
  sections.push(`=== PREMIUM BAZI CHART: ${profileName} ===`);
  if (birthDate) sections.push(`Birth: ${birthDate}${birthTime ? ' ' + birthTime : ''}`);

  // --- Day Master ---
  const dmDesc = DAY_MASTER_DESCRIPTIONS[dmEl] || '';
  sections.push(`\nDAY MASTER (\u65E5\u4E3B \u2014 Core Self):
  ${dmStem?.char || '?'} ${dmStem?.pinyin || ''} \u2014 ${dmPol} ${dmEl}
  "${dmDesc}"
  The Day Master is the axis of the entire chart. Everything is read in relation to this stem.`);

  // --- Four Pillars with full hidden stem Ten Gods ---
  const pillarLines = [];
  for (let i = 0; i < 4; i++) {
    const p = chart.pillars?.[i];
    if (!p) continue;
    const s = p.stem || {};
    const b = p.branch || {};
    const sData = STEM_SEGMENTS[s.index ?? 0];
    const bData = BRANCH_SEGMENTS[b.index ?? 0];
    const hiddenRoots = HIDDEN_STEMS[b.index ?? 0] || [];

    const stemTenGod = p.tenGod;
    const stemTenGodStr = stemTenGod
      ? `${stemTenGod.name} ${stemTenGod.chinese || ''} [${stemTenGod.category || ''}] \u2014 ${stemTenGod.relationship || ''}`
      : i === 2 ? 'Self (\u65E5\u4E3B)' : 'N/A';

    const hiddenLines = hiddenRoots.map((h) => {
      const tg = getTenGod(dmEl, dmPol, h.element, h.polarity);
      const tgStr = tg ? `\u2192 ${tg.english} ${tg.chinese} [${tg.category || ''}]` : '';
      return `      ${h.char} (${h.element} ${h.polarity}, ${h.percentage}%) ${tgStr}`;
    });

    pillarLines.push(`  ${PILLAR_LABELS[i]} Pillar (${p.significance || ''}, ages ${p.ages || ''}):
    \u5929 Stem: ${sData?.char || '?'} ${sData?.pinyin || ''} \u2014 ${sData?.polarity || ''} ${sData?.element || '?'} \u2014 Ten God: ${stemTenGodStr}
    \u5730 Branch: ${bData?.char || '?'} ${bData?.pinyin || ''} \u2014 ${bData?.animal || '?'} (${bData?.element || '?'}, ${bData?.season || ''})
    \u4EBA Hidden Stems (\u85CF\u5E72):
${hiddenLines.length > 0 ? hiddenLines.join('\n') : '      None'}`);
  }
  sections.push(`\nFOUR PILLARS (\u56DB\u67F1):\n${pillarLines.join('\n\n')}`);

  // --- Ten Gods Summary ---
  const tenGodSummary = [];
  const tenGodCounts = {};
  for (let i = 0; i < 4; i++) {
    const p = chart.pillars?.[i];
    if (!p) continue;
    if (p.tenGod?.name && i !== 2) {
      const name = p.tenGod.name;
      tenGodCounts[name] = (tenGodCounts[name] || 0) + 1;
    }
    const hiddenRoots = HIDDEN_STEMS[p.branch?.index ?? 0] || [];
    for (const h of hiddenRoots) {
      const tg = getTenGod(dmEl, dmPol, h.element, h.polarity);
      if (tg) {
        tenGodCounts[tg.english] = (tenGodCounts[tg.english] || 0) + 1;
      }
    }
  }
  for (const [name, count] of Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])) {
    tenGodSummary.push(`${name}: ${count}x`);
  }
  if (tenGodSummary.length > 0) {
    sections.push(`\nTEN GODS SUMMARY (\u5341\u795E\u5206\u5E03):
  ${tenGodSummary.join(', ')}
  Dominant Ten God: ${Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
  Missing categories: ${getMissingTenGodCategories(tenGodCounts)}`);
  }

  // --- Element Distribution ---
  const pcts = chart.elements?.percentages || {};
  const pctStr = Object.entries(pcts)
    .map(([el, v]) => `${el}: ${typeof v === 'string' ? v : v.toFixed(1)}%`)
    .join(', ');
  const dominant = chart.elements?.dominant || '';
  const missing = (chart.elements?.missing || []).map((m) => m.element).join(', ') || 'None';
  const weaknesses = (chart.elements?.weaknesses || []).map((w) => `${w.element} (${typeof w.pct === 'number' ? w.pct.toFixed(1) : w.pct}%)`).join(', ') || 'None';
  const strengths = (chart.elements?.strengths || []).map((s) => `${s.element} (${typeof s.pct === 'number' ? s.pct.toFixed(1) : s.pct}%)`).join(', ') || 'None';
  sections.push(`\nELEMENT DISTRIBUTION (\u4E94\u884C\u5206\u5E03):
  ${pctStr}
  Strong (\u226530%): ${strengths}
  Weak (5-10%): ${weaknesses}
  Missing (<5%): ${missing}
  Dominant: ${dominant}
  Day Master ${dmEl} strength: ${pcts[dmEl] ? (typeof pcts[dmEl] === 'string' ? pcts[dmEl] : pcts[dmEl].toFixed(1)) + '%' : 'unknown'}
  Day Master assessment: ${getDayMasterStrength(pcts, dmEl)}`);

  // --- Element Weather ---
  const weather = pcts ? getElementWeather(pcts) : null;
  if (weather) {
    sections.push(`\nELEMENT WEATHER (\u5143\u7D20\u6C14\u8C61): ${weather.label} \u2014 ${weather.description}`);
  }

  // --- Storms ---
  const interactions = chart.interactions || [];
  const storms = pcts ? detectElementStorms(pcts, interactions) : [];
  if (storms.length > 0) {
    const stormStr = storms.map((s) =>
      `[${s.level.toUpperCase()}] ${s.type}: ${s.message}`
    ).join('\n  ');
    sections.push(`\nSTORMS & IMBALANCES (\u98CE\u66B4):\n  ${stormStr}`);
  } else {
    sections.push('\nSTORMS & IMBALANCES: None detected \u2014 relatively balanced chart.');
  }

  // --- Season + Solar Term ---
  const monthBranchIdx = chart.pillars?.[1]?.branch?.index;
  const season = monthBranchIdx !== undefined ? getSeasonFromMonthBranch(monthBranchIdx) : '';
  let solarTermStr = '';
  if (birthDate) {
    try {
      const bd = new Date(birthDate);
      const stIdx = getSolarTermIndex(bd);
      const st = SOLAR_TERMS[stIdx];
      if (st) {
        solarTermStr = `${st.chinese} ${st.pinyin} (${st.description}) \u2014 ${st.element} energy, ${st.type === 'jie' ? 'Month boundary' : 'Mid-month'}`;
      }
    } catch { /* ignore */ }
  }
  if (season) {
    const seasonalStr = SEASONAL_STRENGTH_LABELS[season];
    const dmSeasonalState = seasonalStr?.[dmEl] || 'unknown';
    sections.push(`\nBIRTH SEASON & SOLAR TERM (\u8282\u6C14):
  Season: ${season}
  Solar Term: ${solarTermStr || 'N/A'}
  Day Master ${dmEl} in ${season}: ${dmSeasonalState}
  ${dmEl} produces ${PRODUCES[dmEl] || '?'} (child element \u2014 energy flows out)
  ${dmEl} is controlled by ${Object.entries(CONTROLS).find(([, v]) => v === dmEl)?.[0] || '?'} (pressure element)
  ${dmEl} is nourished by ${Object.entries(PRODUCES).find(([, v]) => v === dmEl)?.[0] || '?'} (resource element)`);
  }

  // --- Alignment ---
  const alignments = chart.pillars ? getAlignmentData(chart.pillars) : [];
  if (alignments.length > 0) {
    const alignStr = alignments.map((a) =>
      `${a.label}: \u5929 Heaven=${a.heaven}, \u5730 Earth=${a.earth}, \u4EBA Human=${a.human} \u2192 ${a.aligned ? 'Fully Aligned (\u4E09\u624D\u5408\u4E00)' : a.harmonic ? 'Harmonic (\u548C\u8C10)' : 'Mixed (\u6742)'}`
    ).join('\n  ');
    sections.push(`\nHEAVEN-EARTH-HUMAN ALIGNMENT (\u5929\u5730\u4EBA):\n  ${alignStr}`);
  }

  // --- Branch Interactions ---
  if (interactions.length > 0) {
    const intStr = interactions.map((int) =>
      `${int.type}: ${int.branch1} (${int.name1}) \u2194 ${int.branch2} (${int.name2})${int.strength ? ' [' + int.strength + ']' : ''}${int.description ? ' \u2014 ' + int.description : ''}`
    ).join('\n  ');
    sections.push(`\nBRANCH INTERACTIONS (\u5730\u652F\u5173\u7CFB):\n  ${intStr}`);
  } else {
    sections.push('\nBRANCH INTERACTIONS: None detected between the four branches.');
  }

  // --- Stem Interactions ---
  const stemInteractions = computeStemInteractions(chart.pillars);
  if (stemInteractions.length > 0) {
    sections.push(`\nSTEM INTERACTIONS (\u5929\u5E72\u5173\u7CFB):\n  ${stemInteractions.join('\n  ')}`);
  }

  // --- Constitutional Metaphor ---
  if (chart.metaphor) {
    sections.push(`\nCONSTITUTIONAL METAPHOR (\u4F53\u8D28): ${chart.metaphor.metaphor || chart.metaphor.name || ''}`);
  }

  // --- Life Themes ---
  const lifeThemes = pcts ? extractLifeThemes(pcts, dmEl) : [];
  if (lifeThemes.length > 0) {
    const themeStr = lifeThemes.map((t) => `${t.icon} ${t.title}: ${t.description}`).join('\n  ');
    sections.push(`\nLIFE THEMES (\u751F\u547D\u4E3B\u9898):\n  ${themeStr}`);
  }

  // --- Luck Pillars ---
  if (luckPillars?.luck_pillars?.length > 0) {
    const lpLines = luckPillars.luck_pillars.slice(0, 8).map((lp) => {
      const lpStemData = STEM_SEGMENTS.find(s => s.pinyin?.toLowerCase().startsWith(lp.stem?.toLowerCase()));
      const lpElement = lpStemData?.element || '';
      const tg = lpElement ? getTenGod(dmEl, dmPol, lpElement, lpStemData?.polarity || 'Yang') : null;
      const tgStr = tg ? ` \u2014 Ten God: ${tg.english} ${tg.chinese}` : '';
      return `Ages ${lp.age_range || `${lp.age_start}-${lp.age_end}`}: ${lp.stem} ${lp.branch} (${lp.ganZhi || ''}) \u2014 ${lpElement || '?'} energy${tgStr}`;
    });
    const genderNote = !gender ? '\n  Note: Gender not specified \u2014 luck pillar direction defaulted to forward (male). Actual direction may differ.' : '';
    sections.push(`\nLUCK PILLARS \u5927\u8FD0 (10-Year Cycles):
  Direction: ${luckPillars.direction || 'unknown'} (${luckPillars.direction_chinese || ''})${genderNote}
  ${lpLines.join('\n  ')}`);
  } else {
    sections.push('\nLUCK PILLARS: Not available for this reading (insufficient birth data).');
  }

  // --- Yin/Yang Balance ---
  if (chart.yinYang) {
    sections.push(`\nYIN-YANG BALANCE (\u9634\u9633):
  ${chart.yinYang.balance} \u2014 Yang: ${chart.yinYang.yang_count}, Yin: ${chart.yinYang.yin_count}, Ratio: ${chart.yinYang.ratio}
  Implication: ${chart.yinYang.balance === 'Balanced' ? 'Harmonious blend of active and receptive energies' : chart.yinYang.balance === 'Yang-Heavy' ? 'More outward, assertive, action-oriented energy' : 'More inward, receptive, contemplative energy'}`);
  }

  // --- Shi Chen ---
  const hourBranchIdx = chart.pillars?.[3]?.branch?.index;
  if (hourBranchIdx !== undefined && hourBranchIdx >= 0) {
    const shiChenBlock = getShiChenSection(hourBranchIdx, dmEl);
    if (shiChenBlock) sections.push(shiChenBlock);
  }

  // --- Emotional Anchors ---
  const missingEl = missing !== 'None' ? missing.split(',')[0].trim() : (weaknesses !== 'None' ? weaknesses.split('(')[0].trim() : '');
  const dominantPct = pcts[dominant] ? (typeof pcts[dominant] === 'string' ? pcts[dominant] : pcts[dominant].toFixed(1) + '%') : '';
  const firstClash = interactions.find((int) => int.type === 'Clash' || int.type === 'clash');
  const clashStr = firstClash ? `${firstClash.name1 || firstClash.branch1}\u2013${firstClash.name2 || firstClash.branch2} clash` : '';
  const seasonalState = season ? (SEASONAL_STRENGTH_LABELS[season]?.[dmEl] || 'unknown') : 'unknown';
  const metaphorName = chart.metaphor?.metaphor || chart.metaphor?.name || '';
  const dominantTenGod = Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  const ELEMENT_WOUND = {
    Wood: 'Carries the weight of growth for everyone around them while their own roots go unwatered',
    Fire: 'Burns bright for others while hiding the fear that their light is never quite enough',
    Earth: 'Holds everything together for others while wondering who would hold them if they let go',
    Metal: 'Built walls of excellence and discipline that keep people admiring from a distance but rarely close',
    Water: 'Adapts to every shape others need while losing touch with their own form',
  };
  const ELEMENT_GIFT = {
    Wood: 'The ability to see potential in everything and nurture it into existence',
    Fire: 'The capacity to ignite passion, warmth, and transformation in every room',
    Earth: 'Unshakeable reliability \u2014 the person everyone trusts when the world shakes',
    Metal: 'Precision, discernment, and the courage to cut through illusion to find truth',
    Water: 'Deep intuition, adaptability, and the wisdom that comes from flowing rather than forcing',
  };
  const ELEMENT_LONGING = {
    Wood: 'warmth, recognition, and permission to stop growing for others and bloom for itself',
    Fire: 'structure, discipline, and something solid to anchor the flame',
    Earth: 'movement, adventure, and freedom from the weight of everyone else\'s needs',
    Metal: 'softness, vulnerability, and the safety to let imperfection be enough',
    Water: 'fire, passion, and the courage to stop flowing and take a stand',
  };
  const ELEMENT_SUPERPOWER = {
    Wood: 'When they finally let themselves grow without permission, they become unstoppable visionaries',
    Fire: 'When the spark ignites, they become magnetic \u2014 the person who lights up the room without trying',
    Earth: 'When they learn to rest in their own stability, they become the unshakeable center others orbit',
    Metal: 'When they embrace precision, they cut through chaos and become the clearest voice in the room',
    Water: 'When they let intuition lead, they flow around every obstacle and find paths no one else can see',
  };

  const coreWound = ELEMENT_WOUND[dmEl] || 'Carries a burden most people cannot see';
  const coreGift = ELEMENT_GIFT[dmEl] || 'A rare and specific gift the world needs';
  const coreLonging = missingEl ? (ELEMENT_LONGING[missingEl] || `to reclaim the ${missingEl} energy they've always avoided`) : 'balance and integration';
  const coreSuperpower = missingEl ? (ELEMENT_SUPERPOWER[missingEl] || `Claiming ${missingEl} unlocks their full potential`) : 'Integration of all elements unlocks their full power';

  sections.push(`\nEMOTIONAL ANCHORS (\u6DF1\u5C42\u60C5\u611F \u2014 use these as the emotional center of the reading):
  Core Wound: ${coreWound}
  Core Gift: ${coreGift}
  Core Longing (missing ${missingEl || 'element'}): ${coreLonging}
  Core Superpower (when ${missingEl || 'balance'} is claimed): ${coreSuperpower}
  Armor Element: ${dominant} at ${dominantPct} \u2014 both their shield AND their throne
  Missing Element (Soul Key): ${missingEl || 'balance'} \u2014 not a lack, but a calling
  Inner Conflict: ${clashStr || 'Tension between pillars'} \u2014 the creative tension that drives their evolution
  Mythic Identity: ${metaphorName || 'Unique archetypal pattern'}
  Dominant Ten God: ${dominantTenGod} \u2014 the role they were born to master
  Seasonal Soul State: Day Master ${dmEl} is ${seasonalState} in birth season \u2014 ${seasonalState.includes('Dead') || seasonalState.includes('Trapped') ? 'souls born in their element\'s sleep develop rare resilience and depth' : seasonalState.includes('Prosperous') ? 'born into natural strength and radiance' : 'growing steadily into their full power'}`);

  // --- Instructions (mode-dependent) ---
  if (mode === 'master') {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a technical BaZi master commentary as a JSON object with exactly 1 string key: masterCommentary (400-700 words).\n\nAnalyze the chart structure, Ten God distribution, hidden stem dynamics, branch interactions, seasonal strength, and luck pillar trajectory. Use precise BaZi terminology throughout.`);
  } else if (mode === 'shadow') {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a shadow reading as a JSON object with exactly 2 string keys: shadowPatterns (250-350 words), healingPath (250-350 words).\n\nFocus on blind spots, overused strengths, emotional defenses, and the path to integration. For every shadow pattern, also reveal the heroic potential inside it. Reference specific chart data \u2014 missing elements, storms, clashes, and weak Ten God categories.`);
  } else {
    sections.push(`\n===\n\nBased on the above chart data for ${profileName}, produce a premium soul-searching reading as a JSON object with these 8 string keys: whoIAm, whatDrivesMe, whenEnergy, wherePatterns, whyLikeThis, howToGrow, emotionalMirror, soulMessage.\n\nIMPORTANT \u2014 HEROIC JOURNEY FRAMING:\nDo not interpret this chart as a tragedy or burden. Interpret it as a heroic journey.\nEvery imbalance is a superpower in disguise.\nEvery missing element is a calling.\nEvery clash is a transformation engine.\nEvery storm is a breakthrough waiting to happen.\nEvery hidden stem is a voice of destiny.\nYour task is to reveal the beauty, power, and purpose inside this chart.\n\nRemember: this is a PREMIUM reading. Each section should be 130-200 words. Reference specific Chinese characters, Ten Gods, hidden stems, percentages, and interactions. Make it deeply personal, mythic, empowering, and insightful \u2014 a rising arc from wound to gift to destiny.`);
  }

  const systemPrompt = mode === 'master' ? MASTER_COMMENTARY_PROMPT
    : mode === 'shadow' ? SHADOW_READING_PROMPT
    : SYSTEM_PROMPT;

  return {
    system: systemPrompt,
    userMessage: sections.join('\n'),
  };
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function computeStemInteractions(pillars) {
  if (!pillars || pillars.length < 2) return [];
  const results = [];
  const stemIndices = pillars.map((p) => p?.stem?.index ?? -1);

  for (let i = 0; i < stemIndices.length; i++) {
    for (let j = i + 1; j < stemIndices.length; j++) {
      if (stemIndices[i] < 0 || stemIndices[j] < 0) continue;
      const a = stemIndices[i];
      const b = stemIndices[j];
      const sA = STEM_SEGMENTS[a];
      const sB = STEM_SEGMENTS[b];

      for (const [x, y, resultEl] of STEM_COMBINATIONS) {
        if ((a === x && b === y) || (a === y && b === x)) {
          results.push(`Combination (\u5408): ${sA.char} ${sA.pinyin} (${PILLAR_LABELS[i]}) + ${sB.char} ${sB.pinyin} (${PILLAR_LABELS[j]}) \u2192 transforms toward ${resultEl}`);
        }
      }
      for (const [x, y] of STEM_CLASHES) {
        if ((a === x && b === y) || (a === y && b === x)) {
          results.push(`Clash (\u51B2): ${sA.char} ${sA.pinyin} (${PILLAR_LABELS[i]}) vs ${sB.char} ${sB.pinyin} (${PILLAR_LABELS[j]}) \u2014 ${sA.element} vs ${sB.element} tension`);
        }
      }
    }
  }
  return results;
}

function getMissingTenGodCategories(counts) {
  const categories = {
    companion: ['Friend', 'Rob Wealth', 'Companion'],
    output: ['Eating God', 'Hurting Officer'],
    wealth: ['Direct Wealth', 'Indirect Wealth'],
    authority: ['Direct Officer', 'Seven Killings', '7 Killings'],
    resource: ['Direct Resource', 'Indirect Resource', 'Direct Seal', 'Indirect Seal'],
  };
  const missing = [];
  for (const [cat, names] of Object.entries(categories)) {
    if (!names.some(n => counts[n] > 0)) {
      missing.push(cat);
    }
  }
  return missing.length > 0 ? missing.join(', ') : 'None \u2014 all categories represented';
}

function getDayMasterStrength(pcts, dmEl) {
  const v = pcts[dmEl];
  const pct = typeof v === 'string' ? parseFloat(v) : v || 0;
  if (pct >= 30) return `Strong Day Master (${pct.toFixed(1)}%) \u2014 confident, self-assured, may be stubborn`;
  if (pct >= 20) return `Moderate Day Master (${pct.toFixed(1)}%) \u2014 balanced self-identity`;
  if (pct >= 10) return `Moderate-Weak Day Master (${pct.toFixed(1)}%) \u2014 adaptable but may lack confidence`;
  return `Weak Day Master (${pct.toFixed(1)}%) \u2014 highly adaptive, sensitive, may struggle with boundaries`;
}

function getShiChenSection(hourBranchIdx, dmEl) {
  const sc = SHI_CHEN[hourBranchIdx];
  const branchData = BRANCH_SEGMENTS[hourBranchIdx];
  if (!sc || !branchData) return '';

  const birthEl = branchData.element;
  const nourisher = PRODUCED_BY[dmEl];
  const favorable = [];
  const challenging = [];

  for (let i = 0; i < 12; i++) {
    if (i === hourBranchIdx) continue;
    const b = BRANCH_SEGMENTS[i];
    const s = SHI_CHEN[i];
    if (!b || !s) continue;
    if (b.element === dmEl) {
      favorable.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, same ${dmEl} energy)`);
    } else if (b.element === nourisher) {
      favorable.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, ${b.element} nourishes ${dmEl})`);
    } else if (b.element === CONTROLLED_BY[dmEl]) {
      challenging.push(`${s.chinese} ${s.pinyin} (${s.timeRange}, ${b.element} controls ${dmEl})`);
    }
  }

  return `\nSHI CHEN TIMING (\u65F6\u8FB0 \u2014 Daily Energy Windows):
  Birth Hour: ${sc.chinese} ${sc.pinyin} (${sc.timeRange}) \u2014 ${birthEl} energy
  Quality: ${sc.quality}
  Favorable Hours for ${dmEl} Day Master: ${favorable.slice(0, 3).join('; ') || 'None prominent'}
  Challenging Hours: ${challenging.slice(0, 3).join('; ') || 'None prominent'}`;
}

// =============================================================================
// RESPONSE PARSERS
// =============================================================================

const STRUCTURED_READING_KEYS = [
  'whoIAm', 'whatDrivesMe', 'whenEnergy', 'wherePatterns',
  'whyLikeThis', 'howToGrow', 'emotionalMirror', 'soulMessage',
];

function parseStructuredReading(raw) {
  // Attempt 1: Direct JSON parse
  try {
    const parsed = JSON.parse(raw);
    if (isValidReading(parsed)) return fillDefaults(parsed);
  } catch { /* continue */ }

  // Attempt 2: Extract from markdown code fences
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim());
      if (isValidReading(parsed)) return fillDefaults(parsed);
    } catch { /* continue */ }
  }

  // Attempt 3: Find first { ... } block
  const braceStart = raw.indexOf('{');
  const braceEnd = raw.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      const parsed = JSON.parse(raw.slice(braceStart, braceEnd + 1));
      if (isValidReading(parsed)) return fillDefaults(parsed);
    } catch { /* continue */ }
  }

  return null;
}

function isValidReading(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const hits = STRUCTURED_READING_KEYS.filter(k => typeof obj[k] === 'string').length;
  return hits >= 4;
}

function fillDefaults(obj) {
  const result = {};
  for (const key of STRUCTURED_READING_KEYS) {
    result[key] = typeof obj[key] === 'string' && obj[key].trim()
      ? obj[key]
      : '(This section was not generated. Try regenerating the reading.)';
  }
  return result;
}

function parseMasterCommentary(raw) {
  const tryParse = (text) => {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj.masterCommentary === 'string' && obj.masterCommentary.trim()) {
        return { masterCommentary: obj.masterCommentary };
      }
    } catch { /* continue */ }
    return null;
  };

  const r1 = tryParse(raw);
  if (r1) return r1;

  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    const r2 = tryParse(fence[1].trim());
    if (r2) return r2;
  }

  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s !== -1 && e > s) {
    const r3 = tryParse(raw.slice(s, e + 1));
    if (r3) return r3;
  }

  return null;
}

function parseShadowReading(raw) {
  const tryParse = (text) => {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === 'object') {
        const hasShadow = typeof obj.shadowPatterns === 'string' && obj.shadowPatterns.trim();
        const hasHealing = typeof obj.healingPath === 'string' && obj.healingPath.trim();
        if (hasShadow || hasHealing) {
          return {
            shadowPatterns: obj.shadowPatterns || '(This section was not generated. Try regenerating.)',
            healingPath: obj.healingPath || '(This section was not generated. Try regenerating.)',
          };
        }
      }
    } catch { /* continue */ }
    return null;
  };

  const r1 = tryParse(raw);
  if (r1) return r1;

  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    const r2 = tryParse(fence[1].trim());
    if (r2) return r2;
  }

  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s !== -1 && e > s) {
    const r3 = tryParse(raw.slice(s, e + 1));
    if (r3) return r3;
  }

  return null;
}

// =============================================================================
// SECTION METADATA (for frontend display)
// =============================================================================

const READING_SECTION_META = [
  { key: 'whoIAm',          label: 'WHO I AM',                      icon: '\uD83C\uDF0A', sublabel: 'Core Identity & Day Master Psychology' },
  { key: 'whatDrivesMe',    label: 'WHAT DRIVES ME',                icon: '\uD83D\uDD25', sublabel: 'Motivations & Inner Engine' },
  { key: 'whenEnergy',      label: 'WHEN MY ENERGY RISES & FALLS',  icon: '\uD83C\uDF19', sublabel: 'Seasonal & Luck Pillar Timing' },
  { key: 'wherePatterns',   label: 'WHERE MY PATTERNS SHOW UP',     icon: '\uD83D\uDD0D', sublabel: 'Strengths, Shadows & Repeating Loops' },
  { key: 'whyLikeThis',     label: 'WHY I AM LIKE THIS',            icon: '\uD83E\uDDEC', sublabel: 'Elemental Logic, Hidden Stems & Ten Gods' },
  { key: 'howToGrow',       label: 'HOW TO GROW',                   icon: '\uD83C\uDF31', sublabel: 'Three Actionable Steps' },
  { key: 'emotionalMirror', label: 'EMOTIONAL MIRROR',              icon: '\uD83E\uDE9E', sublabel: 'A Paragraph That Feels Like "That\'s Me"' },
  { key: 'soulMessage',     label: 'SOUL MESSAGE',                  icon: '\u2728',        sublabel: 'A Closing Insight Worth Paying For' },
];

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  buildPremiumBaZiPayload,
  parseStructuredReading,
  parseMasterCommentary,
  parseShadowReading,
  READING_SECTION_META,
  STRUCTURED_READING_KEYS,
  // Constants that chartAdapter may need
  STEM_SEGMENTS,
  BRANCH_SEGMENTS,
  HIDDEN_STEMS,
  getTenGod,
  getElementRelation,
};
