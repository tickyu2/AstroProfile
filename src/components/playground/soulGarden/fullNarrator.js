/**
 * Full Narrator - All Bells Together
 *
 * Integrates all narration voices into a unified choir:
 *   - Rising: How the soul walks
 *   - Houses: Where it's alive right now
 *   - Retrogrades: Why patterns loop
 *   - Direct: Where energy flows freely
 *   - Aspects: How inner voices talk to each other
 *   - Epochs: How the whole life is a myth
 *
 * "The beauty talks to the eyes, the narration talks to the soul."
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { narrateSlice, canNarrate, narrateSilence } from './timelineNarrator';
import { narrateDirectPlanets, summarizeDirectPlanets } from './directPlanetNarration';
import { narrateAspects, summarizeAspects } from './aspectNarration';
import { narrateEpoch, getCurrentEpoch, narrateLifeOverview } from './epochNarration';

/**
 * Generate full narration for a timeline slice
 * All bells ring together
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice with houses, planets, aspects
 * @param {Object} params.options - Configuration options
 * @returns {Object} Complete narration bundle
 */
export function narrateSliceFull({ risingSign, slice, options = {} }) {
  const {
    maxHouses = 2,
    maxDirectPlanets = 2,
    maxAspects = 2,
    strengthThreshold = 20,
    includeRetrogradeSummary = false,
    includeDirectSummary = false,
    includeAspectSummary = false
  } = options;

  // Base narration (rising, houses, retrogrades)
  const base = narrateSlice({
    risingSign,
    slice,
    options: { maxHouses, strengthThreshold, includeRetrogradeSummary }
  });

  // Direct planet narration
  const direct = narrateDirectPlanets(slice, { maxPlanets: maxDirectPlanets });
  const directSummary = includeDirectSummary ? summarizeDirectPlanets(slice) : null;

  // Aspect dialogues
  const aspects = narrateAspects(slice, { maxAspects });
  const aspectSummary = includeAspectSummary ? summarizeAspects(slice) : null;

  // Compose all bells in soul-language order
  const all = [
    ...base.rising,           // How the soul walks (global voice)
    ...base.houses,           // Where it's alive now (local voice)
    ...base.retrogrades,      // Why patterns loop (deep whisper)
    ...direct,                // Where energy flows (forward song)
    ...aspects                // How inner voices converse (dialogues)
  ];

  // Add summaries if requested
  if (base.retrogradeSummary) all.push(base.retrogradeSummary);
  if (directSummary) all.push(directSummary);
  if (aspectSummary) all.push(aspectSummary);

  return {
    // Individual voice arrays
    rising: base.rising,
    houses: base.houses,
    retrogrades: base.retrogrades,
    direct,
    aspects,

    // Summaries
    retrogradeSummary: base.retrogradeSummary,
    directSummary,
    aspectSummary,

    // Combined
    all,

    // Metadata
    meta: {
      ...base.meta,
      directCount: direct.length,
      aspectCount: aspects.length,
      totalLines: all.length
    }
  };
}

/**
 * Generate narration including epoch context
 * For when you want to place the current moment in life's larger story
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice
 * @param {Object[]} params.epochs - Life epochs array
 * @param {number} params.age - Current age
 * @returns {Object} Narration with epoch context
 */
export function narrateSliceWithEpoch({ risingSign, slice, epochs, age }) {
  // Get slice narration
  const sliceNarration = narrateSliceFull({ risingSign, slice });

  // Get current epoch
  const currentEpoch = getCurrentEpoch(epochs, age);
  const epochLines = currentEpoch ? narrateEpoch(currentEpoch, risingSign) : [];

  return {
    ...sliceNarration,
    epoch: epochLines,
    currentEpoch,
    allWithEpoch: [
      ...sliceNarration.all,
      ...epochLines
    ]
  };
}

/**
 * Generate a "cathedral bell" summary - the most important lines
 * For when you need just the essential voices
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice
 * @returns {string[]} 3-5 most important lines
 */
export function narrateCathedralBell({ risingSign, slice }) {
  if (!canNarrate(slice)) {
    return narrateSilence();
  }

  const lines = [];

  // One rising line (the global voice)
  const full = narrateSliceFull({
    risingSign,
    slice,
    options: { maxHouses: 1, maxDirectPlanets: 1, maxAspects: 1 }
  });

  // Take the first of each voice (if present)
  if (full.rising.length > 0) lines.push(full.rising[0]);
  if (full.houses.length > 0) lines.push(full.houses[0]);
  if (full.retrogrades.length > 0) lines.push(full.retrogrades[0]);
  if (full.aspects.length > 0) lines.push(full.aspects[0]);

  // Ensure at least one line
  if (lines.length === 0) {
    return narrateSilence();
  }

  return lines;
}

/**
 * Generate a full life narrative
 * The complete story for a profile overview
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object[]} params.epochs - Life epochs
 * @param {Object} params.birthSlice - Birth chart slice
 * @returns {Object} Complete life narrative
 */
export function narrateLifeFull({ risingSign, epochs, birthSlice }) {
  // Life overview
  const overview = narrateLifeOverview(epochs, risingSign);

  // Birth chart narration
  const birth = birthSlice ? narrateSliceFull({ risingSign, slice: birthSlice }) : null;

  // All epochs
  const epochNarratives = epochs.map(epoch => ({
    epoch,
    lines: narrateEpoch(epoch, risingSign)
  }));

  return {
    overview,
    birth,
    epochs: epochNarratives,
    all: [
      ...overview,
      ...(birth?.all || []),
      ...epochNarratives.flatMap(e => e.lines)
    ]
  };
}

/**
 * Determine the "mode" of narration based on slice content
 * Helps UI decide how to style the narration panel
 *
 * @param {Object} slice - Timeline slice
 * @returns {string} Mode: 'alchemical' | 'contemplative' | 'dynamic' | 'quiet'
 */
export function getNarrationMode(slice) {
  if (!slice) return 'quiet';

  // Check for 8th house activity (alchemical)
  const eighth = slice.houses?.find(h => h.house === 8);
  if (eighth && eighth.strength >= 60) {
    return 'alchemical';
  }

  // Check for many retrogrades (contemplative)
  const retroCount = slice.planets?.filter(p => p.retrograde).length || 0;
  if (retroCount >= 4) {
    return 'contemplative';
  }

  // Check for strong angular houses (dynamic)
  const angularHouses = [1, 4, 7, 10];
  const strongAngular = slice.houses?.some(h =>
    angularHouses.includes(h.house) && h.strength >= 70
  );
  if (strongAngular) {
    return 'dynamic';
  }

  // Check for overall low activity
  const maxStrength = Math.max(...(slice.houses?.map(h => h.strength || 0) || [0]));
  if (maxStrength < 30) {
    return 'quiet';
  }

  return 'alchemical'; // Default
}

/**
 * Get a single line that captures the essence of the moment
 * For status bars, tooltips, or minimal displays
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.slice - Timeline slice
 * @returns {string} Single essence line
 */
export function narrateEssence({ risingSign, slice }) {
  const mode = getNarrationMode(slice);

  switch (mode) {
    case 'alchemical':
      return 'The alchemical chamber stirs — transformation is at work in hidden places.';

    case 'contemplative':
      return 'Multiple planets retrograde — a season of deep inner revision unfolds.';

    case 'dynamic':
      return 'Angular houses blaze — life asks for visible action and engagement.';

    case 'quiet':
      return 'The Rose Window rests in stillness — even silence teaches.';

    default:
      return 'The soul moves through its cathedral — each moment a petal in the eternal Rose.';
  }
}

/**
 * Generate narration for a comparison between two slices
 * Useful for "then vs now" or progression views
 *
 * @param {Object} params
 * @param {string} params.risingSign - Rising sign
 * @param {Object} params.sliceA - First slice (earlier)
 * @param {Object} params.sliceB - Second slice (later)
 * @returns {string[]} Comparison narration lines
 */
export function narrateComparison({ risingSign, sliceA, sliceB }) {
  const lines = [];

  // Compare strongest houses
  const strongestA = sliceA?.houses?.sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];
  const strongestB = sliceB?.houses?.sort((a, b) => (b.strength || 0) - (a.strength || 0))[0];

  if (strongestA?.house !== strongestB?.house) {
    lines.push(
      `Focus shifts from the ${ordinal(strongestA?.house)} house to the ${ordinal(strongestB?.house)} — different petals now glow brightest.`
    );
  }

  // Compare retrograde count
  const retroA = sliceA?.planets?.filter(p => p.retrograde).length || 0;
  const retroB = sliceB?.planets?.filter(p => p.retrograde).length || 0;

  if (retroB > retroA + 2) {
    lines.push('More planets turn inward — inner work deepens.');
  } else if (retroA > retroB + 2) {
    lines.push('Retrograde clouds part — forward momentum returns.');
  }

  // Compare modes
  const modeA = getNarrationMode(sliceA);
  const modeB = getNarrationMode(sliceB);

  if (modeA !== modeB) {
    lines.push(`The cathedral's atmosphere shifts from ${modeA} to ${modeB}.`);
  }

  if (lines.length === 0) {
    lines.push('The soul continues its journey — subtle shifts weave through continuity.');
  }

  return lines;
}

/**
 * Helper: Convert house number to ordinal
 */
function ordinal(n) {
  if (!n) return 'unknown';
  const ordinals = {
    1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth',
    5: 'Fifth', 6: 'Sixth', 7: 'Seventh', 8: 'Eighth',
    9: 'Ninth', 10: 'Tenth', 11: 'Eleventh', 12: 'Twelfth'
  };
  return ordinals[n] || `${n}th`;
}
