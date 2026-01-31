/**
 * ============================================================================
 * DATE SELECTION ENGINE (择日引擎)
 * ============================================================================
 *
 * Computes date selection guidance based on traditional Chinese calendar.
 *
 * Components:
 * - Twelve Officers (建除十二神) - Day quality cycle
 * - Dong Gong Rating (董公择日) - Activity suitability
 * - Clash Animal - Zodiac conflicts
 * - Sha Direction - Harmful directions
 * - Hour Suitability - Hourly breakdown
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ActivityCategory,
  CompassDirection,
  DateSelection,
  DongGongRating,
  ElementName,
  EnvironmentalSubject,
  HourSuitability,
  TwelveOfficer,
  TWELVE_OFFICERS_INFO,
  ACTIVITY_LABELS
} from './environmentTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Twelve Officers cycle
 */
const TWELVE_OFFICERS: TwelveOfficer[] = [
  'Establish', 'Remove', 'Full', 'Balance', 'Stable', 'Initiate',
  'Destroy', 'Danger', 'Success', 'Receive', 'Open', 'Close'
];

/**
 * Officer info with Chinese and nature
 */
const OFFICER_INFO: Record<TwelveOfficer, {
  chinese: string;
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: string;
  suitable: ActivityCategory[];
  avoid: ActivityCategory[];
}> = {
  Establish: {
    chinese: '建',
    nature: 'neutral',
    meaning: 'Day of establishment - moderate for most activities',
    suitable: ['meeting', 'study', 'prayer'],
    avoid: ['travel', 'move', 'burial']
  },
  Remove: {
    chinese: '除',
    nature: 'auspicious',
    meaning: 'Day of removal - good for clearing obstacles',
    suitable: ['medical', 'renovation', 'negotiation', 'signing'],
    avoid: ['marriage', 'engagement', 'openBusiness']
  },
  Full: {
    chinese: '满',
    nature: 'auspicious',
    meaning: 'Day of fullness - good for celebrations',
    suitable: ['celebration', 'engagement', 'openBusiness', 'investment'],
    avoid: ['medical', 'burial']
  },
  Balance: {
    chinese: '平',
    nature: 'neutral',
    meaning: 'Day of balance - average for activities',
    suitable: ['study', 'rest', 'meeting'],
    avoid: ['marriage', 'move', 'openBusiness']
  },
  Stable: {
    chinese: '定',
    nature: 'auspicious',
    meaning: 'Day of stability - good for commitments',
    suitable: ['marriage', 'engagement', 'signing', 'investment'],
    avoid: ['travel', 'negotiation']
  },
  Initiate: {
    chinese: '执',
    nature: 'neutral',
    meaning: 'Day of initiation - good for starting projects',
    suitable: ['openBusiness', 'study', 'meeting', 'signing'],
    avoid: ['marriage', 'burial', 'medical']
  },
  Destroy: {
    chinese: '破',
    nature: 'inauspicious',
    meaning: 'Day of destruction - avoid important matters',
    suitable: ['rest', 'medical', 'renovation'],
    avoid: ['marriage', 'engagement', 'openBusiness', 'signing', 'travel', 'move']
  },
  Danger: {
    chinese: '危',
    nature: 'inauspicious',
    meaning: 'Day of danger - exercise caution',
    suitable: ['rest', 'prayer'],
    avoid: ['travel', 'openBusiness', 'investment', 'signing', 'negotiation']
  },
  Success: {
    chinese: '成',
    nature: 'auspicious',
    meaning: 'Day of success - excellent for achievements',
    suitable: ['marriage', 'engagement', 'openBusiness', 'signing', 'celebration', 'investment'],
    avoid: ['burial', 'medical']
  },
  Receive: {
    chinese: '收',
    nature: 'auspicious',
    meaning: 'Day of receiving - good for conclusions',
    suitable: ['signing', 'meeting', 'investment', 'celebration'],
    avoid: ['medical', 'renovation', 'burial']
  },
  Open: {
    chinese: '开',
    nature: 'auspicious',
    meaning: 'Day of opening - good for new beginnings',
    suitable: ['openBusiness', 'travel', 'move', 'marriage', 'engagement'],
    avoid: ['burial']
  },
  Close: {
    chinese: '闭',
    nature: 'inauspicious',
    meaning: 'Day of closing - better for rest',
    suitable: ['rest', 'prayer', 'burial'],
    avoid: ['openBusiness', 'travel', 'marriage', 'signing', 'negotiation']
  }
};

/**
 * Zodiac animals
 */
const ZODIAC_ANIMALS = [
  { name: 'Rat', chinese: '鼠', branch: 'Zi' },
  { name: 'Ox', chinese: '牛', branch: 'Chou' },
  { name: 'Tiger', chinese: '虎', branch: 'Yin' },
  { name: 'Rabbit', chinese: '兔', branch: 'Mao' },
  { name: 'Dragon', chinese: '龙', branch: 'Chen' },
  { name: 'Snake', chinese: '蛇', branch: 'Si' },
  { name: 'Horse', chinese: '马', branch: 'Wu' },
  { name: 'Goat', chinese: '羊', branch: 'Wei' },
  { name: 'Monkey', chinese: '猴', branch: 'Shen' },
  { name: 'Rooster', chinese: '鸡', branch: 'You' },
  { name: 'Dog', chinese: '狗', branch: 'Xu' },
  { name: 'Pig', chinese: '猪', branch: 'Hai' }
];

/**
 * Clash pairs (六冲)
 */
const CLASH_PAIRS: Record<string, string> = {
  Zi: 'Wu', Wu: 'Zi',
  Chou: 'Wei', Wei: 'Chou',
  Yin: 'Shen', Shen: 'Yin',
  Mao: 'You', You: 'Mao',
  Chen: 'Xu', Xu: 'Chen',
  Si: 'Hai', Hai: 'Si'
};

/**
 * Branch elements
 */
const BRANCH_ELEMENTS: Record<string, ElementName> = {
  Zi: 'Water', Chou: 'Earth', Yin: 'Wood', Mao: 'Wood',
  Chen: 'Earth', Si: 'Fire', Wu: 'Fire', Wei: 'Earth',
  Shen: 'Metal', You: 'Metal', Xu: 'Earth', Hai: 'Water'
};

/**
 * Hour branch info
 */
const HOUR_BRANCHES = [
  { hour: 23, branch: 'Zi', chinese: '子' },
  { hour: 1, branch: 'Chou', chinese: '丑' },
  { hour: 3, branch: 'Yin', chinese: '寅' },
  { hour: 5, branch: 'Mao', chinese: '卯' },
  { hour: 7, branch: 'Chen', chinese: '辰' },
  { hour: 9, branch: 'Si', chinese: '巳' },
  { hour: 11, branch: 'Wu', chinese: '午' },
  { hour: 13, branch: 'Wei', chinese: '未' },
  { hour: 15, branch: 'Shen', chinese: '申' },
  { hour: 17, branch: 'You', chinese: '酉' },
  { hour: 19, branch: 'Xu', chinese: '戌' },
  { hour: 21, branch: 'Hai', chinese: '亥' }
];

// ============================================================================
// COMPUTATION HELPERS
// ============================================================================

/**
 * Get day branch from date
 */
function getDayBranch(dateStr: string): string {
  const referenceDate = new Date('1900-01-01');
  const targetDate = new Date(dateStr);
  const diffTime = targetDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const branchIndex = ((diffDays % 12) + 12) % 12;
  return ZODIAC_ANIMALS[branchIndex].branch;
}

/**
 * Get the Twelve Officer for a date
 */
function getTwelveOfficer(dateStr: string): TwelveOfficer {
  const date = new Date(dateStr);
  const month = date.getMonth(); // 0-11
  const dayBranch = getDayBranch(dateStr);

  // Officer cycle starts from the month's jie qi
  // Simplified: use month + day combo to determine officer
  const branchIndex = ZODIAC_ANIMALS.findIndex(z => z.branch === dayBranch);
  const officerIndex = (month + branchIndex) % 12;

  return TWELVE_OFFICERS[officerIndex];
}

/**
 * Compute Dong Gong rating
 */
function computeDongGongRating(
  officer: TwelveOfficer,
  dayBranch: string,
  subject?: EnvironmentalSubject
): { rating: DongGongRating; score: number } {
  const officerInfo = OFFICER_INFO[officer];

  let baseScore: number;
  switch (officerInfo.nature) {
    case 'auspicious':
      baseScore = 75;
      break;
    case 'inauspicious':
      baseScore = 35;
      break;
    default:
      baseScore = 55;
  }

  // Adjust for personal clashes
  if (subject) {
    const clashBranch = CLASH_PAIRS[dayBranch];
    if (clashBranch === subject.yearBranch) {
      baseScore -= 15;
    }

    // Bonus if day element supports useful god
    const dayElement = BRANCH_ELEMENTS[dayBranch];
    if (dayElement === subject.usefulGodElement) {
      baseScore += 10;
    }
  }

  baseScore = Math.max(0, Math.min(100, baseScore));

  let rating: DongGongRating;
  if (baseScore >= 80) rating = 'A';
  else if (baseScore >= 65) rating = 'B';
  else if (baseScore >= 50) rating = 'C';
  else if (baseScore >= 35) rating = 'D';
  else rating = 'F';

  return { rating, score: baseScore };
}

/**
 * Get clash animal for a day
 */
function getClashAnimal(dayBranch: string): { name: string; chinese: string } {
  const clashBranch = CLASH_PAIRS[dayBranch];
  const animal = ZODIAC_ANIMALS.find(z => z.branch === clashBranch);
  return animal ? { name: animal.name, chinese: animal.chinese } : { name: 'Unknown', chinese: '未知' };
}

/**
 * Get Sha direction for a day
 */
function getShaDirection(dayBranch: string): CompassDirection {
  // Sha direction is opposite to day branch direction
  const branchDirections: Record<string, CompassDirection> = {
    Zi: 'N', Chou: 'NE', Yin: 'NE', Mao: 'E',
    Chen: 'SE', Si: 'SE', Wu: 'S', Wei: 'SW',
    Shen: 'SW', You: 'W', Xu: 'NW', Hai: 'NW'
  };

  const opposites: Record<CompassDirection, CompassDirection> = {
    N: 'S', S: 'N', E: 'W', W: 'E',
    NE: 'SW', SW: 'NE', SE: 'NW', NW: 'SE'
  };

  const dayDir = branchDirections[dayBranch] || 'N';
  return opposites[dayDir];
}

/**
 * Compute hour suitability
 */
function computeHourSuitability(
  dateStr: string,
  officer: TwelveOfficer,
  subject?: EnvironmentalSubject
): HourSuitability[] {
  const officerInfo = OFFICER_INFO[officer];
  const dayBranch = getDayBranch(dateStr);
  const results: HourSuitability[] = [];

  for (let hour = 0; hour < 24; hour += 2) {
    const hourInfo = HOUR_BRANCHES.find(h => {
      if (h.hour === 23) return hour === 22 || hour === 23 || hour === 0;
      return hour >= h.hour && hour < h.hour + 2;
    }) || HOUR_BRANCHES[0];

    // Check for hour-day clash
    const hasClash = CLASH_PAIRS[hourInfo.branch] === dayBranch;

    // Determine rating
    let rating: 'excellent' | 'good' | 'neutral' | 'caution' | 'avoid';

    if (hasClash) {
      rating = 'avoid';
    } else if (officerInfo.nature === 'auspicious') {
      rating = hour >= 7 && hour <= 11 ? 'excellent' : 'good';
    } else if (officerInfo.nature === 'inauspicious') {
      rating = 'caution';
    } else {
      rating = 'neutral';
    }

    // Adjust for subject's useful god
    if (subject) {
      const hourElement = BRANCH_ELEMENTS[hourInfo.branch];
      if (hourElement === subject.usefulGodElement && rating !== 'avoid') {
        rating = rating === 'excellent' ? 'excellent' : 'good';
      }
      if (subject.avoidElements.includes(hourElement) && rating !== 'avoid') {
        rating = rating === 'excellent' ? 'good' : rating === 'good' ? 'neutral' : 'caution';
      }
    }

    // Suitable activities for this hour
    const suitable: ActivityCategory[] = rating === 'excellent' || rating === 'good'
      ? officerInfo.suitable
      : rating === 'neutral'
        ? ['study', 'rest', 'meeting']
        : ['rest'];

    const avoid: ActivityCategory[] = rating === 'avoid' || rating === 'caution'
      ? officerInfo.avoid
      : [];

    results.push({
      hour,
      hourChinese: `${hour}:00-${(hour + 2) % 24}:00`,
      branch: hourInfo.branch,
      branchChinese: hourInfo.chinese + '时',
      rating,
      suitable,
      avoid,
      notes: hasClash
        ? `Hour clashes with day branch (${hourInfo.chinese}冲${dayBranch})`
        : rating === 'excellent'
          ? 'Peak hour for activities'
          : ''
    });
  }

  return results;
}

/**
 * Get lunar date (simplified approximation)
 */
function getLunarDate(dateStr: string): { lunar: string; lunarChinese: string } {
  // This is a simplified approximation
  // Real implementation would use a lunar calendar library
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Approximate lunar date (offset by ~1 month)
  const lunarMonth = ((month + 10) % 12) + 1;
  const lunarDay = ((day + 15) % 30) + 1;

  const monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const dayNames = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];

  return {
    lunar: `Month ${lunarMonth}, Day ${lunarDay}`,
    lunarChinese: `${monthNames[lunarMonth - 1]}月${dayNames[lunarDay - 1]}`
  };
}

/**
 * Get special days (simplified)
 */
function getSpecialDays(dateStr: string): { en: string[]; zh: string[] } {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const special: string[] = [];
  const specialZh: string[] = [];

  // Check for common special days
  if (day === 1 || day === 15) {
    special.push('First/Fifteenth - good for prayers');
    specialZh.push('初一/十五 - 宜祈福');
  }

  // Solar terms (simplified)
  if ((month === 2 && day === 4) || (month === 8 && day === 7)) {
    special.push('Solar term day');
    specialZh.push('节气日');
  }

  return { en: special, zh: specialZh };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Compute complete date selection analysis
 */
export function computeDateSelection(
  dateStr: string,
  subject?: EnvironmentalSubject
): DateSelection {
  const dayBranch = getDayBranch(dateStr);
  const officer = getTwelveOfficer(dateStr);
  const officerInfo = OFFICER_INFO[officer];

  const { rating: dongGongRating, score: dongGongScore } = computeDongGongRating(
    officer,
    dayBranch,
    subject
  );

  const clashAnimal = getClashAnimal(dayBranch);
  const shaDirection = getShaDirection(dayBranch);
  const hourRatings = computeHourSuitability(dateStr, officer, subject);
  const { lunar, lunarChinese } = getLunarDate(dateStr);
  const { en: specialDays, zh: specialDaysChinese } = getSpecialDays(dateStr);

  // Build suitable/avoid lists with Chinese
  const suitable = officerInfo.suitable;
  const avoid = officerInfo.avoid;

  const activityLabelsChinese: Record<ActivityCategory, string> = {
    marriage: '嫁娶', engagement: '订婚', travel: '出行', move: '搬家',
    openBusiness: '开业', signing: '签约', meeting: '会见', renovation: '装修',
    medical: '就医', study: '学习', negotiation: '谈判', investment: '投资',
    celebration: '庆典', prayer: '祈福', burial: '安葬', rest: '休息'
  };

  const suitableChinese = suitable.map(a => activityLabelsChinese[a]);
  const avoidChinese = avoid.map(a => activityLabelsChinese[a]);

  // Direction Chinese
  const directionChinese: Record<CompassDirection, string> = {
    N: '北', NE: '东北', E: '东', SE: '东南',
    S: '南', SW: '西南', W: '西', NW: '西北'
  };

  // Build notes
  const notes: string[] = [];
  const notesChinese: string[] = [];

  notes.push(`${officer} day (${officerInfo.meaning})`);
  notesChinese.push(`${officerInfo.chinese}日（${officerInfo.meaning}）`);

  if (subject) {
    const clashBranch = CLASH_PAIRS[dayBranch];
    if (clashBranch === subject.yearBranch) {
      notes.push('Warning: Day clashes with your year branch');
      notesChinese.push('注意：日支与年支相冲');
    }
  }

  return {
    date: dateStr,
    lunarDate: lunar,
    lunarDateChinese: lunarChinese,
    officer,
    officerChinese: officerInfo.chinese,
    officerMeaning: officerInfo.meaning,
    officerNature: officerInfo.nature,
    dongGongRating,
    dongGongScore,
    suitable,
    suitableChinese,
    avoid,
    avoidChinese,
    clashAnimal: clashAnimal.name,
    clashAnimalChinese: clashAnimal.chinese,
    clashElement: BRANCH_ELEMENTS[CLASH_PAIRS[dayBranch]],
    shaDirection,
    shaDirectionChinese: directionChinese[shaDirection],
    hourRatings,
    specialDays,
    specialDaysChinese,
    notes,
    notesChinese
  };
}

/**
 * Score date selection (0-100)
 */
export function scoreDateSelection(dateSelection: DateSelection): number {
  return dateSelection.dongGongScore;
}

