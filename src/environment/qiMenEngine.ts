/**
 * ============================================================================
 * QI MEN DUN JIA ENGINE (奇门遁甲引擎)
 * ============================================================================
 *
 * Computes Qi Men Dun Jia charts for strategic timing and direction.
 *
 * Components:
 * - Nine Palaces (九宫) - Spatial arrangement
 * - Eight Doors (八门) - Outcome indicators
 * - Nine Stars (九星) - Celestial influence
 * - Eight Deities (八神) - Spiritual forces
 * - Ten Stems (天干) - Elemental energy
 * - Formations (格局) - Special patterns
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  CompassDirection,
  PalaceNumber,
  QiMenChart,
  QiMenDeity,
  QiMenDoor,
  QiMenFormation,
  QiMenPalace,
  QiMenRating,
  QiMenStar,
  QiMenStem,
  QIMEN_DOOR_INFO
} from './environmentTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Palace to direction mapping
 */
const PALACE_DIRECTIONS: Record<PalaceNumber, CompassDirection | 'Center'> = {
  1: 'N',
  2: 'SW',
  3: 'E',
  4: 'SE',
  5: 'Center',
  6: 'NW',
  7: 'W',
  8: 'NE',
  9: 'S'
};

/**
 * Base palace order (洛书 Luo Shu magic square)
 */
const LUO_SHU_ORDER: PalaceNumber[] = [1, 8, 3, 4, 9, 2, 7, 6, 1]; // Circular

/**
 * Eight Doors with info
 */
const DOORS: { name: QiMenDoor; chinese: string; nature: QiMenRating }[] = [
  { name: 'Open', chinese: '开门', nature: 'auspicious' },
  { name: 'Rest', chinese: '休门', nature: 'auspicious' },
  { name: 'Life', chinese: '生门', nature: 'auspicious' },
  { name: 'Harm', chinese: '伤门', nature: 'inauspicious' },
  { name: 'Block', chinese: '杜门', nature: 'neutral' },
  { name: 'Scenery', chinese: '景门', nature: 'neutral' },
  { name: 'Death', chinese: '死门', nature: 'inauspicious' },
  { name: 'Fear', chinese: '惊门', nature: 'inauspicious' }
];

/**
 * Nine Stars with info
 */
const STARS: { name: QiMenStar; chinese: string; nature: QiMenRating }[] = [
  { name: 'Canopy', chinese: '天蓬', nature: 'neutral' },
  { name: 'Reed', chinese: '天芮', nature: 'inauspicious' },
  { name: 'Impulse', chinese: '天冲', nature: 'neutral' },
  { name: 'Support', chinese: '天辅', nature: 'auspicious' },
  { name: 'Heart', chinese: '天心', nature: 'auspicious' },
  { name: 'Pillar', chinese: '天柱', nature: 'neutral' },
  { name: 'Ren', chinese: '天任', nature: 'auspicious' },
  { name: 'Hero', chinese: '天英', nature: 'auspicious' },
  { name: 'Void', chinese: '天禽', nature: 'neutral' }
];

/**
 * Eight Deities with info
 */
const DEITIES: { name: QiMenDeity; chinese: string; nature: QiMenRating }[] = [
  { name: 'Chief', chinese: '值符', nature: 'auspicious' },
  { name: 'Snake', chinese: '腾蛇', nature: 'neutral' },
  { name: 'Yin', chinese: '太阴', nature: 'auspicious' },
  { name: 'Harmony', chinese: '六合', nature: 'auspicious' },
  { name: 'Hook', chinese: '勾陈', nature: 'neutral' },
  { name: 'Sparrow', chinese: '朱雀', nature: 'neutral' },
  { name: 'Nine Earth', chinese: '九地', nature: 'auspicious' },
  { name: 'Nine Heaven', chinese: '九天', nature: 'auspicious' }
];

/**
 * Ten Stems (excluding Jia which hides)
 */
const STEMS: { name: QiMenStem; chinese: string; element: string }[] = [
  { name: 'Yi', chinese: '乙', element: 'Wood' },
  { name: 'Bing', chinese: '丙', element: 'Fire' },
  { name: 'Ding', chinese: '丁', element: 'Fire' },
  { name: 'Wu', chinese: '戊', element: 'Earth' },
  { name: 'Ji', chinese: '己', element: 'Earth' },
  { name: 'Geng', chinese: '庚', element: 'Metal' },
  { name: 'Xin', chinese: '辛', element: 'Metal' },
  { name: 'Ren', chinese: '壬', element: 'Water' },
  { name: 'Gui', chinese: '癸', element: 'Water' }
];

/**
 * Formation info
 */
const FORMATIONS: Record<QiMenFormation, {
  chinese: string;
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: string;
}> = {
  ThreeWonders: {
    chinese: '三奇得使',
    nature: 'auspicious',
    meaning: 'Three Wonders activated - excellent for all undertakings'
  },
  SixYi: {
    chinese: '六仪吉格',
    nature: 'auspicious',
    meaning: 'Six Yi auspicious - favorable timing'
  },
  JiaJi: {
    chinese: '甲己合',
    nature: 'auspicious',
    meaning: 'Jia-Ji combination - harmonious energy'
  },
  DragonReturn: {
    chinese: '青龙返首',
    nature: 'auspicious',
    meaning: 'Green Dragon returns - success in endeavors'
  },
  FlyingBird: {
    chinese: '飞鸟跌穴',
    nature: 'auspicious',
    meaning: 'Flying bird enters nest - finding the right place'
  },
  FuYin: {
    chinese: '伏吟',
    nature: 'inauspicious',
    meaning: 'Hidden crying - stagnation, delays expected'
  },
  FanYin: {
    chinese: '反吟',
    nature: 'inauspicious',
    meaning: 'Reverse crying - reversals, changes of plan'
  },
  TimeEmpty: {
    chinese: '时空亡',
    nature: 'inauspicious',
    meaning: 'Time emptiness - avoid major decisions'
  },
  GengObstacle: {
    chinese: '庚格',
    nature: 'inauspicious',
    meaning: 'Geng obstruction - obstacles and blocks'
  },
  WhiteTiger: {
    chinese: '白虎猖狂',
    nature: 'inauspicious',
    meaning: 'White Tiger rampant - potential for conflict'
  },
  None: {
    chinese: '无特殊格局',
    nature: 'neutral',
    meaning: 'No special formation'
  }
};

/**
 * Chinese hour names
 */
const HOUR_BRANCHES = [
  { start: 23, end: 1, name: 'Zi', chinese: '子' },
  { start: 1, end: 3, name: 'Chou', chinese: '丑' },
  { start: 3, end: 5, name: 'Yin', chinese: '寅' },
  { start: 5, end: 7, name: 'Mao', chinese: '卯' },
  { start: 7, end: 9, name: 'Chen', chinese: '辰' },
  { start: 9, end: 11, name: 'Si', chinese: '巳' },
  { start: 11, end: 13, name: 'Wu', chinese: '午' },
  { start: 13, end: 15, name: 'Wei', chinese: '未' },
  { start: 15, end: 17, name: 'Shen', chinese: '申' },
  { start: 17, end: 19, name: 'You', chinese: '酉' },
  { start: 19, end: 21, name: 'Xu', chinese: '戌' },
  { start: 21, end: 23, name: 'Hai', chinese: '亥' }
];

// ============================================================================
// COMPUTATION HELPERS
// ============================================================================

/**
 * Get the hour branch for a given hour
 */
function getHourBranch(hour: number): { name: string; chinese: string } {
  for (const hb of HOUR_BRANCHES) {
    if (hb.start > hb.end) {
      // Zi hour spans midnight
      if (hour >= hb.start || hour < hb.end) {
        return { name: hb.name, chinese: hb.chinese };
      }
    } else if (hour >= hb.start && hour < hb.end) {
      return { name: hb.name, chinese: hb.chinese };
    }
  }
  return { name: 'Zi', chinese: '子' }; // Default
}

/**
 * Determine Ju number (局数) based on solar term and hour
 * Simplified: uses date to estimate which of 18 Ju
 */
function computeJuNumber(timestamp: string): { juNumber: number; juType: 'yang' | 'yin' } {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simplified: Yang Dun (阳遁) from Winter Solstice to Summer Solstice
  // Yin Dun (阴遁) from Summer Solstice to Winter Solstice
  const isYang = month >= 1 && month <= 6;
  const juType: 'yang' | 'yin' = isYang ? 'yang' : 'yin';

  // Ju number 1-9 based on position in solar term
  // Simplified calculation
  const baseJu = ((month + day) % 9) + 1;
  const juNumber = isYang ? baseJu : (10 - baseJu);

  return { juNumber, juType };
}

/**
 * Compute palace arrangement based on Ju number
 */
function computePalaceArrangement(
  juNumber: number,
  hourIndex: number
): Map<PalaceNumber, { door: QiMenDoor; star: QiMenStar; deity: QiMenDeity; stem: QiMenStem }> {
  const arrangement = new Map<PalaceNumber, {
    door: QiMenDoor;
    star: QiMenStar;
    deity: QiMenDeity;
    stem: QiMenStem;
  }>();

  // Base rotation from Ju number
  const rotation = (juNumber + hourIndex) % 8;

  // Assign doors, stars, deities to palaces
  const palaces: PalaceNumber[] = [1, 2, 3, 4, 6, 7, 8, 9]; // Exclude 5 (center)

  for (let i = 0; i < palaces.length; i++) {
    const palace = palaces[i];
    const doorIdx = (i + rotation) % DOORS.length;
    const starIdx = (i + rotation) % (STARS.length - 1); // Exclude Void for non-center
    const deityIdx = (i + rotation) % DEITIES.length;
    const stemIdx = (i + rotation) % STEMS.length;

    arrangement.set(palace, {
      door: DOORS[doorIdx].name,
      star: STARS[starIdx].name,
      deity: DEITIES[deityIdx].name,
      stem: STEMS[stemIdx].name
    });
  }

  // Palace 5 (center) gets special assignment
  arrangement.set(5, {
    door: 'Block', // Center often has Block door
    star: 'Void',
    deity: 'Chief',
    stem: 'Wu'
  });

  return arrangement;
}

/**
 * Detect special formations
 */
function detectFormation(
  palaces: QiMenPalace[],
  juType: 'yang' | 'yin'
): QiMenFormation {
  // Check for Fu Yin (伏吟) - all elements in their home positions
  const fuYinCheck = palaces.filter(p =>
    (p.number === 1 && p.stem === 'Gui') || // Water in Water palace
    (p.number === 9 && p.stem === 'Bing')   // Fire in Fire palace
  );
  if (fuYinCheck.length >= 2) {
    return 'FuYin';
  }

  // Check for Three Wonders (三奇)
  // Yi, Bing, Ding in auspicious positions
  const threeWondersStems: QiMenStem[] = ['Yi', 'Bing', 'Ding'];
  const hasThreeWonders = palaces.filter(p =>
    threeWondersStems.includes(p.stem) &&
    p.door === 'Open' || p.door === 'Life' || p.door === 'Rest'
  ).length >= 2;

  if (hasThreeWonders) {
    return 'ThreeWonders';
  }

  // Check for Geng Obstruction
  const gengPalace = palaces.find(p => p.stem === 'Geng');
  if (gengPalace && (gengPalace.door === 'Open' || gengPalace.door === 'Life')) {
    return 'GengObstacle';
  }

  // Check for Dragon Return (青龙返首)
  // When Chief deity is in palace 1
  const chiefPalace = palaces.find(p => p.deity === 'Chief');
  if (chiefPalace && chiefPalace.number === 1) {
    return 'DragonReturn';
  }

  return 'None';
}

/**
 * Rate a single palace
 */
function ratePalace(
  door: QiMenDoor,
  star: QiMenStar,
  deity: QiMenDeity
): QiMenRating {
  const doorInfo = DOORS.find(d => d.name === door);
  const starInfo = STARS.find(s => s.name === star);
  const deityInfo = DEITIES.find(d => d.name === deity);

  let auspiciousCount = 0;
  let inauspiciousCount = 0;

  if (doorInfo?.nature === 'auspicious') auspiciousCount++;
  if (doorInfo?.nature === 'inauspicious') inauspiciousCount++;
  if (starInfo?.nature === 'auspicious') auspiciousCount++;
  if (starInfo?.nature === 'inauspicious') inauspiciousCount++;
  if (deityInfo?.nature === 'auspicious') auspiciousCount++;
  if (deityInfo?.nature === 'inauspicious') inauspiciousCount++;

  if (auspiciousCount >= 2 && inauspiciousCount === 0) return 'auspicious';
  if (inauspiciousCount >= 2) return 'inauspicious';
  return 'neutral';
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Compute complete Qi Men Dun Jia chart
 */
export function computeQiMenChart(timestamp: string): QiMenChart {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const hourBranch = getHourBranch(hour);

  // Compute Ju number
  const { juNumber, juType } = computeJuNumber(timestamp);

  // Hour index for rotation
  const hourIndex = HOUR_BRANCHES.findIndex(h => h.name === hourBranch.name);

  // Compute palace arrangement
  const arrangement = computePalaceArrangement(juNumber, hourIndex);

  // Build palace objects
  const palaces: QiMenPalace[] = [];
  const palaceNumbers: PalaceNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (const num of palaceNumbers) {
    const arr = arrangement.get(num)!;
    const doorInfo = DOORS.find(d => d.name === arr.door)!;
    const starInfo = STARS.find(s => s.name === arr.star)!;
    const deityInfo = DEITIES.find(d => d.name === arr.deity)!;
    const stemInfo = STEMS.find(s => s.name === arr.stem)!;

    const rating = ratePalace(arr.door, arr.star, arr.deity);

    palaces.push({
      number: num,
      direction: PALACE_DIRECTIONS[num],
      door: arr.door,
      doorChinese: doorInfo.chinese,
      star: arr.star,
      starChinese: starInfo.chinese,
      deity: arr.deity,
      deityChinese: deityInfo.chinese,
      stem: arr.stem,
      stemChinese: stemInfo.chinese,
      hidden: null, // Simplified
      rating
    });
  }

  // Detect formation
  const formation = detectFormation(palaces, juType);
  const formationInfo = FORMATIONS[formation];

  // Key palace (based on hour)
  const keyPalaceNum = ((hourIndex % 8) + 1) as PalaceNumber;
  const keyPalace = palaces.find(p => p.number === keyPalaceNum) || palaces[0];

  // Determine best and avoid palaces/directions
  const auspiciousPalaces = palaces.filter(p => p.rating === 'auspicious');
  const inauspiciousPalaces = palaces.filter(p => p.rating === 'inauspicious');

  const bestPalaces = auspiciousPalaces.map(p => p.number);
  const avoidPalaces = inauspiciousPalaces.map(p => p.number);

  const bestDirections = auspiciousPalaces
    .filter(p => p.direction !== 'Center')
    .map(p => p.direction as CompassDirection);

  const avoidDirections = inauspiciousPalaces
    .filter(p => p.direction !== 'Center')
    .map(p => p.direction as CompassDirection);

  // Overall rating
  let overallRating: QiMenRating;
  let ratingScore: number;

  if (formationInfo.nature === 'inauspicious') {
    overallRating = 'inauspicious';
    ratingScore = 30;
  } else if (formationInfo.nature === 'auspicious') {
    overallRating = 'auspicious';
    ratingScore = 80;
  } else if (keyPalace.rating === 'auspicious') {
    overallRating = 'auspicious';
    ratingScore = 70;
  } else if (keyPalace.rating === 'inauspicious') {
    overallRating = 'inauspicious';
    ratingScore = 40;
  } else {
    overallRating = 'neutral';
    ratingScore = 55;
  }

  // Adjust score based on auspicious/inauspicious palace count
  ratingScore += (auspiciousPalaces.length - inauspiciousPalaces.length) * 3;
  ratingScore = Math.max(0, Math.min(100, ratingScore));

  // Generate notes
  const notes: string[] = [];
  const notesChinese: string[] = [];

  notes.push(`Ju ${juNumber} (${juType === 'yang' ? 'Yang' : 'Yin'} Dun)`);
  notesChinese.push(`第${juNumber}局（${juType === 'yang' ? '阳' : '阴'}遁）`);

  if (formation !== 'None') {
    notes.push(`Formation: ${formationInfo.meaning}`);
    notesChinese.push(`格局：${formationInfo.chinese}`);
  }

  notes.push(`Key palace: ${keyPalace.number} (${keyPalace.door}, ${keyPalace.star})`);
  notesChinese.push(`时宫：${keyPalace.number}宫（${keyPalace.doorChinese}、${keyPalace.starChinese}）`);

  return {
    hour: hourBranch.name,
    hourChinese: hourBranch.chinese + '时',
    juNumber,
    juType,
    palaces,
    keyPalace,
    formation,
    formationChinese: formationInfo.chinese,
    formationNature: formationInfo.nature,
    rating: overallRating,
    ratingScore,
    bestPalaces,
    avoidPalaces,
    bestDirections,
    avoidDirections,
    notes,
    notesChinese
  };
}

/**
 * Score Qi Men alignment (0-100)
 */
export function scoreQiMenAlignment(chart: QiMenChart): number {
  return chart.ratingScore;
}

