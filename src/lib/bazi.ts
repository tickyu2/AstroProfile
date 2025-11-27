// src/lib/bazi.ts
const STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const CHINESE_STEMS = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
const CHINESE_BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
const ELEMENTS = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];

// JDN reference: 1900-01-31 = 甲子日 (Jia Zi)
const REF_JDN = 2415079;

function getJDN(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
}

// Approximate solar term dates for month branch (accurate 1930–2040)
const SOLAR_TERMS_APPROX = [
  [1,4], [2,4], [3,5], [4,5], [5,6], [6,6], [7,7], [8,8], [9,8], [10,8], [11,6], [12,6]
];

export interface BaZiResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  animal: string;
  dayMaster: string;
  dayMasterElement: string;
  tenGods: { wealth: string; power: string; output: string; resource: string; friend: string };
  luckPillars: string[];
}

export function calculateBaZi(dob: string, time: string, gender: "male" | "female"): BaZiResult {
  const [y, m, d] = dob.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  const year = y;

  // === YEAR PILLAR ===
  const yearCycle = (year - 3) % 60;
  const yearStemIdx = yearCycle % 10;
  const yearBranchIdx = yearCycle % 12;
  const yearStem = CHINESE_STEMS[yearStemIdx];
  const yearBranch = CHINESE_BRANCHES[yearBranchIdx];

  // === DAY PILLAR ===
  const jdn = getJDN(y, m, d);
  const dayNum = Math.floor(jdn - REF_JDN + 1.5);
  const dayPos = ((dayNum % 60) + 60) % 60;
  const dayStem = CHINESE_STEMS[dayPos % 10];
  const dayBranch = CHINESE_BRANCHES[dayPos % 12];

  // === MONTH PILLAR (accurate using solar terms) ===
  const approxTerm = SOLAR_TERMS_APPROX[m - 1];
  const isAfterTerm = (m === approxTerm[0] && d >= approxTerm[1]) || m > approxTerm[0];
  const monthBranchIdx = isAfterTerm ? (m + 1) % 12 : m;
  const monthBranch = CHINESE_BRANCHES[monthBranchIdx];
  const monthStemIdx = (yearStemIdx + monthBranchIdx + 10) % 10;
  const monthStem = CHINESE_STEMS[monthStemIdx];

  // === HOUR PILLAR ===
  let hourIdx = Math.floor((h + 1) / 2) % 12;
  if (h >= 23) hourIdx = 0;
  const hourBranch = CHINESE_BRANCHES[hourIdx];
  const hourStemIdx = (dayPos % 10 + hourIdx + 10) % 10;
  const hourStem = CHINESE_STEMS[hourStemIdx];

  // === 10 GODS (based on Day Master) ===
  const dmIdx = dayPos % 10;
  const dmElement = ELEMENTS[dmIdx];
  const tenGods = {
    wealth: CHINESE_STEMS[(dmIdx + 6) % 10] + " (Wealth)",
    power: CHINESE_STEMS[(dmIdx + 8) % 10] + " (Power)",
    output: CHINESE_STEMS[(dmIdx + 2) % 10] + " (Output)",
    resource: CHINESE_STEMS[(dmIdx + 4) % 10] + " (Resource)",
    friend: CHINESE_STEMS[dmIdx] + " (Friend)",
  };

  // === LUCK PILLARS (10-year cycles) ===
  const luckStartAge = gender === "male" ? 5 : -5;
  const direction = gender === "male" ? 1 : -1;
  const luckPillars: string[] = [];
  let currentStem = monthStemIdx;
  let currentBranch = monthBranchIdx;
  for (let i = 0; i < 8; i++) {
    currentStem = (currentStem + direction + 10) % 10;
    currentBranch = (currentBranch + direction + 12) % 12;
    luckPillars.push(CHINESE_STEMS[currentStem] + CHINESE_BRANCHES[currentBranch]);
  }

  return {
    yearPillar: `${yearStem}${yearBranch}`,
    monthPillar: `${monthStem}${monthBranch}`,
    dayPillar: `${dayStem}${dayBranch}`,
    hourPillar: `${hourStem}${hourBranch}`,
    animal: ANIMALS[yearBranchIdx],
    dayMaster: dayStem,
    dayMasterElement: dmElement,
    tenGods,
    luckPillars,
  };
}