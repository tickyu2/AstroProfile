/**
 * Saturn Return Report Generator
 *
 * Generates comprehensive Saturn Return reports with exact dates,
 * house themes, key lessons, and reflection questions.
 *
 * GENESIS AstroProfile - January 2026
 */

import { SATURN_ORBIT_YEARS } from './saturnJourneyConstants';

// ═══════════════════════════════════════════════════════════════════════════
// RETURN TITLES
// ═══════════════════════════════════════════════════════════════════════════

const RETURN_TITLES = {
  1: "First Saturn Return: The End of Apprenticeship",
  2: "Second Saturn Return: The Harvest of a Life",
  3: "Third Saturn Return: The Elder's Oath"
};

const RETURN_SUMMARIES = {
  1: "The first Saturn Return (ages 28-30) marks the true beginning of adulthood. The structures that served youth—inherited beliefs, borrowed identities, approved paths—are tested. What survives this transit becomes the foundation of a chosen life.",
  2: "The second Saturn Return (ages 57-60) asks what you will transmit. The achievements of midlife are evaluated. What was built for ego falls away; what was built for legacy endures. This is the doorway to elderhood.",
  3: "The third Saturn Return (ages 86-88) is rare and sacred. It asks: have you made peace? What wisdom remains to share? This is the final integration—Saturn's last invitation to completion."
};

// ═══════════════════════════════════════════════════════════════════════════
// HOUSE THEMES FOR SATURN RETURN
// ═══════════════════════════════════════════════════════════════════════════

const HOUSE_THEMES = {
  1: "Rewriting who you are allowed to be.",
  2: "Rewriting what you are worth and how you sustain yourself.",
  3: "Rewriting how you think, speak, and learn.",
  4: "Rewriting your relationship to home, family, and roots.",
  5: "Rewriting how you create, love, and risk joy.",
  6: "Rewriting how you work, serve, and care for your body.",
  7: "Rewriting how you commit, partner, and negotiate equality.",
  8: "Rewriting how you share power, resources, and intimacy.",
  9: "Rewriting what you believe and why you're here.",
  10: "Rewriting your public role, career, and legacy.",
  11: "Rewriting your community, contribution, and future.",
  12: "Rewriting your relationship to surrender, endings, and the unseen."
};

// ═══════════════════════════════════════════════════════════════════════════
// KEY LESSONS BY RETURN
// ═══════════════════════════════════════════════════════════════════════════

const KEY_LESSONS = {
  1: [
    "Saturn is asking you to take radical responsibility in this domain.",
    "Old structures that no longer support your integrity will crack or fall away.",
    "New commitments formed now will define the next long chapter of your life.",
    "The discomfort you feel is not punishment—it is initiation.",
    "What you build through this transit will last if it's built on truth."
  ],
  2: [
    "What you achieved in the first cycle is being evaluated.",
    "Saturn asks: was it worth it? Would you do it again?",
    "Structures built for ego will feel hollow; structures built for meaning will sustain.",
    "The work now is transmission: what do you pass on?",
    "Simplify without shrinking. Release without abandoning what matters."
  ],
  3: [
    "This is Saturn's final integration in this lifetime.",
    "The question is not 'what more can I do?' but 'have I done enough?'",
    "Peace with mortality is the final Saturn lesson.",
    "Your wisdom is a gift. Transmission is complete when received.",
    "The elder's authority is earned through presence, not performance."
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// REFLECTION QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════

function buildReflectionQuestions(houseTheme, returnNumber) {
  const baseQuestions = [
    `Where am I pretending not to know that something must change in this area: ${houseTheme}`,
    "What am I afraid will happen if I fully commit to what I already know is true?",
    "What would a more honest, sustainable structure look like here?"
  ];

  const returnSpecific = {
    1: [
      "What did I inherit that I want to keep? What must I release?",
      "Who am I becoming, and is it who I want to be?",
      "What commitments would I make if I weren't afraid?"
    ],
    2: [
      "What have I built that I'm proud of? What would I do differently?",
      "What wisdom have I earned that deserves to be shared?",
      "What can I simplify without losing what matters?"
    ],
    3: [
      "What remains unfinished that needs completion?",
      "What relationships need healing or blessing?",
      "What is the legacy I want to leave?"
    ]
  };

  return [...baseQuestions, ...(returnSpecific[returnNumber] || [])];
}

// ═══════════════════════════════════════════════════════════════════════════
// DATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Saturn Return windows from birth date
 * @param {string} birthDateISO - Birth date in ISO format
 * @returns {Array} Array of return windows
 */
export function calculateSaturnReturnWindows(birthDateISO) {
  const birthDate = new Date(birthDateISO);
  const windows = [];

  // Calculate all three potential returns
  [1, 2, 3].forEach(returnNumber => {
    const exactYears = returnNumber * SATURN_ORBIT_YEARS;
    const windowStartYears = exactYears - 1.5;
    const windowEndYears = exactYears + 1.5;

    const exactDate = addYears(birthDate, exactYears);
    const windowStart = addYears(birthDate, windowStartYears);
    const windowEnd = addYears(birthDate, windowEndYears);

    windows.push({
      returnNumber,
      exactDate: formatDate(exactDate),
      exactAge: exactYears,
      windowStart: formatDate(windowStart),
      windowEnd: formatDate(windowEnd),
      windowAgeStart: windowStartYears,
      windowAgeEnd: windowEndYears
    });
  });

  return windows;
}

/**
 * Add years to a date
 */
function addYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + Math.floor(years));

  // Handle fractional years (convert to days)
  const fractionalDays = (years % 1) * 365.25;
  result.setDate(result.getDate() + Math.round(fractionalDays));

  return result;
}

/**
 * Format date to ISO string (date only)
 */
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN REPORT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete Saturn Return report
 * @param {number} house - Saturn's natal house (1-12)
 * @param {string} sign - Saturn's natal sign
 * @param {string} birthDateISO - Birth date in ISO format
 * @param {number} targetReturn - Which return to focus on (1, 2, or 3)
 * @returns {Object} Complete Saturn Return report
 */
export function generateSaturnReturnReport(house, sign, birthDateISO, targetReturn = 1) {
  const windows = calculateSaturnReturnWindows(birthDateISO);
  const targetWindow = windows.find(w => w.returnNumber === targetReturn);

  const title = RETURN_TITLES[targetReturn];
  const summary = RETURN_SUMMARIES[targetReturn];
  const houseTheme = HOUSE_THEMES[house] || "Rewriting your relationship to responsibility.";
  const keyLessons = KEY_LESSONS[targetReturn] || [];
  const reflectionQuestions = buildReflectionQuestions(houseTheme, targetReturn);

  return {
    title,
    summary,
    house,
    sign,
    houseTheme,
    keyLessons,
    reflectionQuestions,
    windows,
    targetWindow,
    fullNarrative: buildFullNarrative(title, summary, houseTheme, sign, targetWindow)
  };
}

/**
 * Build the full narrative for the report
 */
function buildFullNarrative(title, summary, houseTheme, sign, targetWindow) {
  return `**${title}**

${summary}

**Your Saturn Return Focus:**
Saturn in ${sign} returns to its natal position around ${targetWindow.exactDate}, with the window of influence running from approximately ${targetWindow.windowStart} to ${targetWindow.windowEnd}.

**The House Theme:**
${houseTheme}

This is the life arena where Saturn demands restructuring. Whatever has been built here will be tested. What was built on truth will survive and strengthen. What was built on fear or borrowed authority will crack.

**The Invitation:**
Saturn Return is not punishment. It is initiation. The discomfort is the doorway. Walk through it consciously, and you emerge with authority that cannot be taken away.`;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a given date is within a Saturn Return window
 * @param {string} birthDateISO - Birth date
 * @param {string} currentDateISO - Current date (defaults to now)
 * @returns {Object} Return status
 */
export function checkSaturnReturnStatus(birthDateISO, currentDateISO = new Date().toISOString()) {
  const windows = calculateSaturnReturnWindows(birthDateISO);
  const currentDate = new Date(currentDateISO);

  for (const window of windows) {
    const windowStart = new Date(window.windowStart);
    const windowEnd = new Date(window.windowEnd);

    if (currentDate >= windowStart && currentDate <= windowEnd) {
      return {
        inReturn: true,
        returnNumber: window.returnNumber,
        window,
        title: RETURN_TITLES[window.returnNumber]
      };
    }
  }

  // Check if approaching
  const nextWindow = windows.find(w => new Date(w.windowStart) > currentDate);
  if (nextWindow) {
    const daysUntil = Math.round((new Date(nextWindow.windowStart) - currentDate) / (1000 * 60 * 60 * 24));

    if (daysUntil < 365 * 2) { // Within 2 years
      return {
        inReturn: false,
        approaching: true,
        returnNumber: nextWindow.returnNumber,
        daysUntil,
        window: nextWindow
      };
    }
  }

  return {
    inReturn: false,
    approaching: false,
    nextWindow
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Named exports for direct import
export { RETURN_TITLES, HOUSE_THEMES };

export default {
  generateSaturnReturnReport,
  calculateSaturnReturnWindows,
  checkSaturnReturnStatus,
  RETURN_TITLES,
  HOUSE_THEMES
};
