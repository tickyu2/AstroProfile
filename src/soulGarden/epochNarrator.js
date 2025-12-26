/**
 * ============================================================================
 * EPOCH NARRATION ENGINE
 * ============================================================================
 * Creates mythic, soul-language narration for each life epoch.
 * Honors the individual's chart while speaking universal truths.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { nameEpoch, getEpochFlavor } from './epochNames';

/**
 * House themes for narration
 */
export const HOUSE_THEMES = {
  1: "identity and self-becoming",
  2: "worth and what you value",
  3: "voice and how you think",
  4: "roots and where you belong",
  5: "creativity and joy",
  6: "craft and daily devotion",
  7: "relationship and the mirror of other",
  8: "transformation and the depths",
  9: "meaning and the search for truth",
  10: "purpose and your place in the world",
  11: "community and your tribe",
  12: "spirit and the vast unknown"
};

/**
 * Planet tones for narration
 */
export const PLANET_TONES = {
  Sun: "your core identity and life force",
  Moon: "your emotional nature and inner needs",
  Mercury: "your mind and how you communicate",
  Venus: "your capacity for love and beauty",
  Mars: "your will and how you assert yourself",
  Jupiter: "your growth and search for meaning",
  Saturn: "your structure and lessons of time",
  Uranus: "your awakening and need for freedom",
  Neptune: "your dreams and spiritual longing",
  Pluto: "your power to transform and be reborn"
};

/**
 * Opening lines for different epoch types
 */
const EPOCH_OPENINGS = {
  "Early Life": [
    "In the earliest years, the soul drinks deep from the well of family.",
    "Before words, before memory, the pattern was being woven.",
    "The first chapter wrote itself in the language of belonging."
  ],
  "Apprenticeship": [
    "The mind awakened to its own voice.",
    "These were the years of testing wings.",
    "Learning was the altar, curiosity the prayer."
  ],
  "Becoming": [
    "The scaffolding of adult life took shape.",
    "The world began to ask: who will you become?",
    "Foundations were laid in the quiet hours."
  ],
  "Saturn Return": [
    "The great reckoning arrived.",
    "What was built on sand had to fall.",
    "Truth became the only currency that mattered."
  ],
  "Expansion": [
    "The horizon widened beyond all previous imagining.",
    "The pilgrim found new roads opening.",
    "Meaning became more than a word."
  ],
  "The Great Turning": [
    "The universe whispered: it's time to remember who you really are.",
    "Everything that was not essential began to fall away.",
    "The phoenix fire ignited within."
  ],
  "The Harvest": [
    "The fruits of a lifetime began to ripen.",
    "Wisdom became the new currency.",
    "The elder within stood up and spoke."
  ],
  "The Elder Flame": [
    "The lighthouse keeper takes their post.",
    "All rivers lead to this ocean.",
    "The soul prepares its final gift to the world."
  ]
};

/**
 * Generate full narration for an epoch
 * @param {Object} epoch - The epoch object
 * @param {string} risingSign - The rising sign
 * @returns {Array<string>} Array of narration lines
 */
export function narrateEpoch(epoch, risingSign) {
  const lines = [];

  // Title with rising flavor
  const title = nameEpoch(epoch, risingSign);
  lines.push(title);

  // Opening line
  const openings = EPOCH_OPENINGS[epoch.label] || ["A new chapter unfolded."];
  const opening = openings[Math.floor(Math.random() * openings.length)];
  lines.push(opening);

  // Age span with poetic framing
  lines.push(
    `This chapter spans ages ${epoch.startAge} to ${epoch.endAge}, a corridor in your cathedral where certain bells rang louder than others.`
  );

  // House themes
  if (epoch.dominantHouses?.length) {
    const themes = epoch.dominantHouses.map(h => HOUSE_THEMES[h] || "mystery");
    lines.push(
      `Life kept returning to ${joinThemes(themes)} \u2014 these were the arenas where your soul was practicing its next becoming.`
    );
  }

  // Planet tones
  if (epoch.dominantPlanets?.length) {
    const tones = epoch.dominantPlanets.map(p => PLANET_TONES[p] || "inner movement");
    lines.push(
      `The planetary tone here was ${joinThemes(tones)} \u2014 these were the instruments tuning your inner music.`
    );
  }

  // Life themes
  if (epoch.lifeThemes?.length) {
    lines.push(
      `The deeper themes were ${joinThemes(epoch.lifeThemes)} \u2014 threads weaving your myth from the inside out.`
    );
  }

  // Planet positions if available
  if (epoch.planetPositions?.length) {
    const positionNotes = epoch.planetPositions
      .filter(p => p.sign !== 'Unknown')
      .map(p => {
        const retroNote = p.retrograde ? ' (retrograde, turning inward)' : '';
        return `${p.planet} in ${p.sign}${retroNote}`;
      });

    if (positionNotes.length > 0) {
      lines.push(
        `In your chart, this era was colored by ${joinThemes(positionNotes)}.`
      );
    }
  }

  // Aspects if present
  if (epoch.dominantAspects?.length > 0) {
    lines.push(
      `${epoch.dominantAspects.length} planetary conversation${epoch.dominantAspects.length > 1 ? 's' : ''} shaped this era's inner dialogue.`
    );
  }

  // Intensity note
  if (epoch.intensity) {
    const intensityWord = epoch.intensity >= 80 ? 'powerful' :
                          epoch.intensity >= 60 ? 'significant' :
                          epoch.intensity >= 40 ? 'moderate' : 'subtle';
    lines.push(
      `This era carries ${intensityWord} energy in your chart \u2014 its lessons run deep.`
    );
  }

  // Rising sign closing
  lines.push(
    `Seen through your ${risingSign} Rising, this era shaped how you walk your path in a way only your soul could understand.`
  );

  // Symbolism if present
  if (epoch.symbolism) {
    lines.push(`\u2014 ${epoch.symbolism}`);
  }

  return lines;
}

/**
 * Generate a brief summary for an epoch
 * @param {Object} epoch - The epoch object
 * @param {string} risingSign - The rising sign
 * @returns {string} Brief summary
 */
export function summarizeEpoch(epoch, risingSign) {
  const flavor = getEpochFlavor(epoch, risingSign);
  const themes = epoch.lifeThemes?.join(', ') || 'transformation';
  return `Ages ${epoch.startAge}-${epoch.endAge}: ${flavor}. Themes of ${themes}.`;
}

/**
 * Generate narration for current life position
 * @param {Object} currentEpoch - The current epoch
 * @param {number} age - Current age
 * @param {string} risingSign - Rising sign
 * @returns {Array<string>} Narration lines
 */
export function narrateCurrentPosition(currentEpoch, age, risingSign) {
  if (!currentEpoch) {
    return ["Your life journey continues beyond the mapped chapters."];
  }

  const lines = [];
  const progressPercent = Math.round(
    ((age - currentEpoch.startAge) / (currentEpoch.endAge - currentEpoch.startAge)) * 100
  );

  lines.push(`You are ${progressPercent}% through "${currentEpoch.label}".`);

  const flavor = getEpochFlavor(currentEpoch, risingSign);
  lines.push(`This is your "${flavor}" era.`);

  if (progressPercent < 30) {
    lines.push("You're in the opening movement of this chapter.");
  } else if (progressPercent < 70) {
    lines.push("You're in the heart of this chapter's lessons.");
  } else {
    lines.push("You're approaching the threshold of the next chapter.");
  }

  return lines;
}

/**
 * Join an array of themes into natural language
 * @param {Array<string>} arr - Array of themes
 * @returns {string} Joined string
 */
function joinThemes(arr) {
  if (!arr || arr.length === 0) return "mystery";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, -1);
  return `${rest.join(", ")}, and ${last}`;
}

export default {
  narrateEpoch,
  summarizeEpoch,
  narrateCurrentPosition,
  HOUSE_THEMES,
  PLANET_TONES
};
