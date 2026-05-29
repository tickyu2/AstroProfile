/**
 * Chart Adapter — Normalizes Python bazi_joey_yap response
 * into the chart shape expected by buildPremiumBaZiPayload().
 *
 * Python response keys:
 *   pillars, pillars_dict, pillars_info, day_master, hidden_stems, hidden_stems_raw,
 *   element_distribution, dm_strength, ten_gods, symbolic_stars, growth_phases,
 *   dayun, explanation
 *
 * Target shape (frontend chart):
 *   pillars[0-3].stem.{index, char, element, polarity}
 *   pillars[0-3].branch.{index, char, animal, element, polarity}
 *   pillars[0-3].tenGod.{name, chinese, category, relationship}
 *   pillars[0-3].significance, pillars[0-3].ages
 *   dayMaster.{element}
 *   elements.{percentages, dominant, missing, weaknesses, strengths}
 *   interactions[]
 *   metaphor
 *   yinYang
 */

const { STEM_SEGMENTS, BRANCH_SEGMENTS, HIDDEN_STEMS, getTenGod } = require('./baziPayloadBuilder');

// Pinyin → stem index mapping (lowercase first chars for fuzzy matching)
const STEM_PINYIN_MAP = {};
STEM_SEGMENTS.forEach((s, i) => {
  // Store multiple lookup keys
  STEM_PINYIN_MAP[s.pinyin.toLowerCase()] = i;
  // Also store without diacritics for Python output which uses plain ASCII
  const plain = s.pinyin.replace(/[\u0300-\u036f\u01CE\u01D0\u01D2\u01D4\u00E9\u00E8\u00EC\u00ED\u00F2\u00F3\u00F9\u00FA\u016B\u012B]/gi, (ch) => {
    const map = {
      '\u01CE': 'a', '\u01D0': 'i', '\u01D2': 'o', '\u01D4': 'u',
      '\u00E9': 'e', '\u00E8': 'e', '\u00EC': 'i', '\u00ED': 'i',
      '\u00F2': 'o', '\u00F3': 'o', '\u00F9': 'u', '\u00FA': 'u',
      '\u016B': 'u', '\u012B': 'i',
    };
    return map[ch] || ch;
  }).toLowerCase();
  STEM_PINYIN_MAP[plain] = i;
});

// Chinese char → stem index
const STEM_CHAR_MAP = {};
STEM_SEGMENTS.forEach((s, i) => { STEM_CHAR_MAP[s.char] = i; });

// Branch pinyin/char → branch index
const BRANCH_PINYIN_MAP = {};
BRANCH_SEGMENTS.forEach((s, i) => {
  BRANCH_PINYIN_MAP[s.pinyin.toLowerCase()] = i;
  // Plain ASCII variants
  const plain = s.pinyin.replace(/[\u0300-\u036f\u01CE\u01D0\u01D2\u01D4\u00E9\u00E8\u00EC\u00ED\u00F2\u00F3\u00F9\u00FA\u016B\u012B]/gi, (ch) => {
    const map = {
      '\u01CE': 'a', '\u01D0': 'i', '\u01D2': 'o', '\u01D4': 'u',
      '\u00E9': 'e', '\u00E8': 'e', '\u00EC': 'i', '\u00ED': 'i',
      '\u00F2': 'o', '\u00F3': 'o', '\u00F9': 'u', '\u00FA': 'u',
      '\u016B': 'u', '\u012B': 'i',
    };
    return map[ch] || ch;
  }).toLowerCase();
  BRANCH_PINYIN_MAP[plain] = i;
  // Also store animal name
  if (s.animal) BRANCH_PINYIN_MAP[s.animal.toLowerCase()] = i;
});

const BRANCH_CHAR_MAP = {};
BRANCH_SEGMENTS.forEach((s, i) => { BRANCH_CHAR_MAP[s.char] = i; });

/** Resolve a stem identifier (Chinese char, pinyin, or name) to a stem index */
function resolveStemIndex(stemStr) {
  if (typeof stemStr !== 'string') return 0;
  // Chinese character
  if (STEM_CHAR_MAP[stemStr] !== undefined) return STEM_CHAR_MAP[stemStr];
  // Pinyin (exact or lowercase)
  const lower = stemStr.toLowerCase();
  if (STEM_PINYIN_MAP[lower] !== undefined) return STEM_PINYIN_MAP[lower];
  // Prefix match
  for (const [key, idx] of Object.entries(STEM_PINYIN_MAP)) {
    if (key.startsWith(lower) || lower.startsWith(key)) return idx;
  }
  return 0;
}

/** Resolve a branch identifier to a branch index */
function resolveBranchIndex(branchStr) {
  if (typeof branchStr !== 'string') return 0;
  if (BRANCH_CHAR_MAP[branchStr] !== undefined) return BRANCH_CHAR_MAP[branchStr];
  const lower = branchStr.toLowerCase();
  if (BRANCH_PINYIN_MAP[lower] !== undefined) return BRANCH_PINYIN_MAP[lower];
  for (const [key, idx] of Object.entries(BRANCH_PINYIN_MAP)) {
    if (key.startsWith(lower) || lower.startsWith(key)) return idx;
  }
  return 0;
}

const PILLAR_NAMES = ['year', 'month', 'day', 'hour'];
const PILLAR_SIGNIFICANCE = ['Ancestry & outer world', 'Career & parents', 'Self & spouse', 'Children & legacy'];
const PILLAR_AGES = ['0-16', '17-32', '33-48', '49+'];

/**
 * Adapt Python bazi_joey_yap response → chart shape for buildPremiumBaZiPayload.
 *
 * @param {object} pythonChart — Raw response from Python bazi_joey_yap endpoint
 * @returns {object} Normalized chart object
 */
function adaptPythonChart(pythonChart) {
  if (!pythonChart) throw new Error('No chart data from Python engine');

  // --- Pillars ---
  const pillars = [];
  const rawPillars = pythonChart.pillars; // list of [stem, branch] tuples
  const pillarsDict = pythonChart.pillars_dict || {};
  const tenGodsList = pythonChart.ten_gods || [];

  // Day Master info
  const dmInfo = pythonChart.day_master || {};
  const dmElement = dmInfo.element || 'Unknown';
  const dmStemStr = dmInfo.stem || '';
  const dmStemIdx = resolveStemIndex(dmStemStr);
  const dmPolarity = STEM_SEGMENTS[dmStemIdx]?.polarity || 'Yang';

  for (let i = 0; i < 4; i++) {
    const name = PILLAR_NAMES[i];

    // Get stem and branch strings
    let stemStr, branchStr;
    if (Array.isArray(rawPillars) && rawPillars[i]) {
      // pillars is array of [stem, branch]
      stemStr = rawPillars[i][0];
      branchStr = rawPillars[i][1];
    } else if (pillarsDict[name]) {
      stemStr = pillarsDict[name][0] || pillarsDict[name].stem;
      branchStr = pillarsDict[name][1] || pillarsDict[name].branch;
    } else {
      stemStr = '';
      branchStr = '';
    }

    const stemIdx = resolveStemIndex(stemStr);
    const branchIdx = resolveBranchIndex(branchStr);
    const stemData = STEM_SEGMENTS[stemIdx];
    const branchData = BRANCH_SEGMENTS[branchIdx];

    // Ten God for this pillar's stem
    let tenGod = null;
    if (i !== 2) { // Skip day pillar (it's the Day Master itself)
      // Try from Python ten_gods list
      const pyTg = tenGodsList.find(t => t.pillar === name && !t.is_day_master);
      if (pyTg) {
        // Prefer English label (e.g. "Direct Wealth") over raw ten_god key (e.g. "ZhengCai")
        const labelName = pyTg.label?.split('(')[0]?.trim() || '';
        tenGod = {
          name: labelName || pyTg.ten_god || '',
          chinese: pyTg.label?.match(/\(([^)]+)\)/)?.[1] || '',
          category: pyTg.group_5 || '',
          relationship: `${stemData.element} ${stemData.polarity} ${pyTg.group_5 || ''} relationship`,
        };
      }
      // Fallback: compute from our own mapping
      if (!tenGod || !tenGod.name || tenGod.name === 'Day Master') {
        const computed = getTenGod(dmElement, dmPolarity, stemData.element, stemData.polarity);
        if (computed) {
          tenGod = {
            name: computed.english,
            chinese: computed.chinese,
            category: computed.category,
            relationship: `${stemData.element} ${stemData.polarity} as ${computed.english}`,
          };
        }
      }
    }

    pillars.push({
      stem: {
        index: stemIdx,
        char: stemData.char,
        element: stemData.element,
        polarity: stemData.polarity,
      },
      branch: {
        index: branchIdx,
        char: branchData.char,
        animal: branchData.animal,
        element: branchData.element,
        polarity: branchData.polarity,
      },
      tenGod,
      significance: PILLAR_SIGNIFICANCE[i],
      ages: PILLAR_AGES[i],
    });
  }

  // --- Element Distribution ---
  const rawDist = pythonChart.element_distribution || {};
  const percentages = {};
  let maxEl = '';
  let maxPct = 0;
  const missingEls = [];
  const weakEls = [];
  const strongEls = [];

  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
    const pct = typeof rawDist[el] === 'number' ? rawDist[el] : parseFloat(rawDist[el]) || 0;
    percentages[el] = pct;
    if (pct > maxPct) { maxPct = pct; maxEl = el; }
    if (pct < 5) missingEls.push({ element: el, pct });
    else if (pct < 10) weakEls.push({ element: el, pct });
    if (pct >= 30) strongEls.push({ element: el, pct });
  }

  const elements = {
    percentages,
    dominant: maxEl,
    missing: missingEls,
    weaknesses: weakEls,
    strengths: strongEls,
  };

  // --- Interactions ---
  // Python response may include interactions in explanation or as separate key
  const interactions = [];
  // Check if there are branch interaction data embedded
  if (pythonChart.interactions) {
    for (const ix of pythonChart.interactions) {
      interactions.push(ix);
    }
  }
  // Also check explanation.L1_factors for interaction info
  if (pythonChart.explanation?.L1_factors) {
    for (const factor of pythonChart.explanation.L1_factors) {
      if (factor.type === 'clash' || factor.type === 'Clash') {
        interactions.push({
          type: 'Clash',
          branch1: factor.branch1 || factor.from || '',
          branch2: factor.branch2 || factor.to || '',
          name1: factor.name1 || factor.from || '',
          name2: factor.name2 || factor.to || '',
          description: factor.description || factor.text || '',
        });
      }
    }
  }

  // --- Yin/Yang balance ---
  let yangCount = 0;
  let yinCount = 0;
  for (const p of pillars) {
    if (p.stem.polarity === 'Yang') yangCount++;
    else yinCount++;
    if (p.branch.polarity === 'Yang') yangCount++;
    else yinCount++;
  }
  const yinYang = {
    yang_count: yangCount,
    yin_count: yinCount,
    balance: yangCount === yinCount ? 'Balanced' : yangCount > yinCount ? 'Yang-Heavy' : 'Yin-Heavy',
    ratio: `${yangCount}:${yinCount}`,
  };

  // --- Metaphor (from Python explanation) ---
  let metaphor = null;
  if (pythonChart.explanation?.L0_postcard) {
    metaphor = { metaphor: pythonChart.explanation.L0_postcard };
  }

  return {
    pillars,
    dayMaster: { element: dmElement },
    elements,
    interactions,
    yinYang,
    metaphor,
  };
}

/**
 * Adapt Python dayun response → luck pillars shape for buildPremiumBaZiPayload.
 *
 * @param {object} pythonChart — Response containing dayun data
 * @returns {object|null} Luck pillars object or null
 */
function adaptLuckPillars(pythonChart) {
  const dayun = pythonChart?.dayun;
  if (!dayun || !dayun.pillars || dayun.pillars.length === 0) return null;

  return {
    direction: dayun.direction || 'forward',
    direction_chinese: dayun.direction_cn || (dayun.direction === 'forward' ? '\u987A\u884C' : '\u9006\u884C'),
    luck_pillars: dayun.pillars.map((lp) => ({
      stem: lp.stem || '',
      branch: lp.branch || '',
      ganZhi: lp.ganzhi || `${lp.stem || ''}${lp.branch || ''}`,
      age_start: lp.age_start,
      age_end: lp.age_end,
      age_range: lp.age_range || `${lp.age_start}-${lp.age_end}`,
    })),
  };
}

module.exports = {
  adaptPythonChart,
  adaptLuckPillars,
  resolveStemIndex,
  resolveBranchIndex,
};
