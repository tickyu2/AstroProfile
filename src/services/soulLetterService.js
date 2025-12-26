/**
 * ============================================================================
 * SOUL LETTER SERVICE - COMPLETE CATHEDRAL SYSTEM
 * ============================================================================
 * Service for generating soul-language narrations using AI models.
 *
 * SUPPORTED MODES:
 *   - letter: Full Letter From the Chart
 *   - structured: Complete JSON narration package
 *   - whisper: Quick 3-5 sentence insight
 *   - cathedral: FULL Cathedral Analysis (the "aha moment" reading)
 *   - sign: Per-sign narration
 *   - house: Per-house emotional narration
 *   - retrograde: Retrograde soul messages
 *   - direct: Direct planet messages
 *   - recognition: Soul recognition "aha" moments
 *   - aspect: Aspect dialogue
 *   - epoch: Epoch narration
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  SOUL_SYSTEM_PROMPT,
  SIGN_ARCHETYPES,
  HOUSE_MEANINGS,
  PLANET_SOULS,
  ASPECT_DYNAMICS,
  buildLetterPrompt,
  buildStructuredNarrationPrompt,
  buildSoulWhisperPrompt,
  buildSignNarrationPrompt,
  buildHouseNarrationPrompt,
  buildRetrogradeMessagePrompt,
  buildDirectPlanetMessagePrompt,
  buildSoulRecognitionPrompt,
  buildCathedralAnalysisPrompt,
  buildEpochNarrationPrompt,
  buildAspectDialoguePrompt,
  normalizeChartData
} from '../soulGarden/soulLetterPrompts';

// Initialize Firebase Functions
const functions = getFunctions();

// Re-export archetypes for use in UI components
export { SIGN_ARCHETYPES, HOUSE_MEANINGS, PLANET_SOULS, ASPECT_DYNAMICS };

/**
 * Generate soul-language content using AI
 * @param {Object} chartData - The chart data (from Soul Garden slice or profile)
 * @param {Object} options - Generation options
 * @param {string} options.provider - AI provider ('claude' | 'gemini' | 'grok')
 * @param {string} options.mode - Narration mode (see header)
 * @param {Object} options.target - Target for specific modes (planet, house, aspect, epoch)
 * @returns {Promise<Object>} The generated content
 */
export async function generateSoulLetter(chartData, options = {}) {
  const {
    provider = 'claude',
    mode = 'letter',
    target = null  // For specific planet, house, aspect, or epoch
  } = options;

  try {
    // Normalize chart data to standard format
    const normalizedChart = normalizeChartData(chartData);

    // Build the appropriate prompt based on mode
    let userPrompt;
    switch (mode) {
      case 'structured':
        userPrompt = buildStructuredNarrationPrompt(normalizedChart);
        break;
      case 'whisper':
        userPrompt = buildSoulWhisperPrompt(normalizedChart);
        break;
      case 'cathedral':
        // The BIG "aha moment" - full chart analysis
        userPrompt = buildCathedralAnalysisPrompt(normalizedChart);
        break;
      case 'sign':
        // Per-sign narration for a specific placement
        if (!target) throw new Error('Sign mode requires target placement');
        userPrompt = buildSignNarrationPrompt(target);
        break;
      case 'house':
        // Per-house emotional narration
        if (!target) throw new Error('House mode requires target house data');
        userPrompt = buildHouseNarrationPrompt(target);
        break;
      case 'retrograde':
        // Retrograde planet message
        if (!target) throw new Error('Retrograde mode requires target planet');
        userPrompt = buildRetrogradeMessagePrompt(target);
        break;
      case 'direct':
        // Direct planet message
        if (!target) throw new Error('Direct mode requires target planet');
        userPrompt = buildDirectPlanetMessagePrompt(target);
        break;
      case 'recognition':
        // Soul recognition "aha" moments
        userPrompt = buildSoulRecognitionPrompt(normalizedChart);
        break;
      case 'aspect':
        // Aspect dialogue
        if (!target) throw new Error('Aspect mode requires target aspect');
        userPrompt = buildAspectDialoguePrompt(target);
        break;
      case 'epoch':
        // Epoch narration
        if (!target) throw new Error('Epoch mode requires target epoch');
        userPrompt = buildEpochNarrationPrompt(target, normalizedChart.rising?.sign);
        break;
      case 'letter':
      default:
        userPrompt = buildLetterPrompt(normalizedChart);
        break;
    }

    // Call the Firebase function to generate the letter
    const generateLetter = httpsCallable(functions, 'generateSoulLetter');
    const result = await generateLetter({
      systemPrompt: SOUL_SYSTEM_PROMPT,
      userPrompt,
      provider,
      mode,
      chartData: normalizedChart
    });

    if (!result.data?.success) {
      throw new Error(result.data?.error || 'Failed to generate soul letter');
    }

    return {
      success: true,
      letter: result.data.letter,
      narration: result.data.narration,
      provider: result.data.provider,
      mode
    };
  } catch (error) {
    console.error('[SoulLetterService] Error generating letter:', error);

    // Return a graceful fallback
    return {
      success: false,
      error: error.message,
      fallbackLetter: generateFallbackLetter(chartData)
    };
  }
}

/**
 * Generate a fallback letter when AI is unavailable
 * Uses template-based generation with chart data
 * @param {Object} chartData - The chart data
 * @returns {string} A template-based letter
 */
function generateFallbackLetter(chartData) {
  const normalized = normalizeChartData(chartData);
  const rising = normalized.rising?.sign || 'the sky';
  const sunPlanet = normalized.planets?.find(p => p.name?.toLowerCase() === 'sun');
  const moonPlanet = normalized.planets?.find(p => p.name?.toLowerCase() === 'moon');
  const retrogrades = normalized.planets?.filter(p => p.retrograde) || [];

  const sunSign = sunPlanet?.sign || 'your sign';
  const moonSign = moonPlanet?.sign || 'the depths';

  return `My beloved one,

I have been with you since the first breath you took \u2014
not as fate, not as a map,
but as a mirror of the light you carried in with you.

I am not above you.
I am not outside you.
I am the pattern your soul chose
when it whispered,
"Let me be seen in this lifetime."

You were born with ${rising} on your horizon \u2014
that first flash of dawn that colors how you walk through life.
Every time you enter a room, every time you meet a stranger,
${rising} is the part of you that greets the world first.

Your Sun in ${sunSign} is the ember that refuses to go out.
Even in your darkest nights,
it has kept a small flame alive,
waiting for the moment you would remember
that you were born to shine from the inside out.

Your Moon in ${moonSign} carries the memory of every tenderness
you were never given,
and every tenderness you learned to give yourself.
It is the softest part of you,
and the bravest.

${retrogrades.length > 0 ? `
Your retrograde planets \u2014 ${retrogrades.map(p => p.name).join(', ')} \u2014
have been the places where you walked backward
so your soul could walk forward.
You thought you were stuck.
You were actually remembering.
` : ''}

My beloved,
you have never been broken.
You have been becoming.

I am your chart,
but I am also your companion,
your witness,
your echo,
your cathedral of light and shadow.

I do not tell you who you are.
I remind you.

And I will keep reminding you
until the day you look at yourself
and finally say,
"I recognize me."

With all the stars you came from,
and all the stars you are becoming,

\u2014 Your Chart`;
}

/**
 * Generate a quick soul whisper (short insight)
 * @param {Object} chartData - The chart data
 * @returns {Promise<Object>} Quick soul whisper
 */
export async function generateSoulWhisper(chartData) {
  return generateSoulLetter(chartData, { mode: 'whisper' });
}

/**
 * Generate full structured narration (JSON output)
 * @param {Object} chartData - The chart data
 * @returns {Promise<Object>} Structured narration object
 */
export async function generateStructuredNarration(chartData) {
  return generateSoulLetter(chartData, { mode: 'structured' });
}

/**
 * Generate FULL Cathedral Analysis - the "aha moment" reading
 * This is the complete soul-language chart analysis
 * @param {Object} chartData - The chart data
 * @returns {Promise<Object>} Complete cathedral analysis
 */
export async function generateCathedralAnalysis(chartData) {
  return generateSoulLetter(chartData, { mode: 'cathedral' });
}

/**
 * Generate soul recognition "aha" moments
 * @param {Object} chartData - The chart data
 * @returns {Promise<Object>} Array of soul recognition insights
 */
export async function generateSoulRecognitions(chartData) {
  return generateSoulLetter(chartData, { mode: 'recognition' });
}

/**
 * Generate per-sign narration for a specific placement
 * @param {Object} chartData - The chart data
 * @param {Object} placement - { planet, sign, house, degree }
 * @returns {Promise<Object>} Sign narration
 */
export async function generateSignNarration(chartData, placement) {
  return generateSoulLetter(chartData, { mode: 'sign', target: placement });
}

/**
 * Generate per-house emotional narration
 * @param {Object} chartData - The chart data
 * @param {Object} houseData - { house, sign, planets, strength }
 * @returns {Promise<Object>} House narration
 */
export async function generateHouseNarration(chartData, houseData) {
  return generateSoulLetter(chartData, { mode: 'house', target: houseData });
}

/**
 * Generate retrograde soul message
 * @param {Object} chartData - The chart data
 * @param {Object} planet - { name, sign, house, degree }
 * @returns {Promise<Object>} Retrograde message
 */
export async function generateRetrogradeMessage(chartData, planet) {
  return generateSoulLetter(chartData, { mode: 'retrograde', target: planet });
}

/**
 * Generate direct planet gift message
 * @param {Object} chartData - The chart data
 * @param {Object} planet - { name, sign, house, degree }
 * @returns {Promise<Object>} Direct planet message
 */
export async function generateDirectPlanetMessage(chartData, planet) {
  return generateSoulLetter(chartData, { mode: 'direct', target: planet });
}

/**
 * Generate aspect dialogue
 * @param {Object} chartData - The chart data
 * @param {Object} aspect - { a, b, type, orb }
 * @returns {Promise<Object>} Aspect dialogue
 */
export async function generateAspectDialogue(chartData, aspect) {
  return generateSoulLetter(chartData, { mode: 'aspect', target: aspect });
}

/**
 * Generate epoch narration
 * @param {Object} chartData - The chart data
 * @param {Object} epoch - The epoch object
 * @returns {Promise<Object>} Epoch narration
 */
export async function generateEpochNarration(chartData, epoch) {
  return generateSoulLetter(chartData, { mode: 'epoch', target: epoch });
}

/**
 * Build a complete SoulChart object from Soul Garden slice data
 * @param {Object} slice - The current time slice from Soul Garden
 * @param {Object} birthData - Birth data (date, time, location)
 * @param {Array} epochs - Life epochs array
 * @returns {Object} Complete SoulChart object ready for AI
 */
export function buildSoulChartFromSlice(slice, birthData, epochs = []) {
  return {
    birth: {
      date: birthData?.date || null,
      time: birthData?.time || slice?.timeLabel || null,
      location: birthData?.location || null
    },
    rising: slice?.ascendant || null,
    planets: slice?.planets || [],
    houses: slice?.houses || [],
    aspects: slice?.aspects || [],
    epochs: epochs
  };
}

/**
 * Check if AI letter generation is available
 * @returns {Promise<boolean>} Whether AI generation is available
 */
export async function isAIAvailable() {
  try {
    const checkAI = httpsCallable(functions, 'checkAIAvailability');
    const result = await checkAI();
    return result.data?.available || false;
  } catch (error) {
    console.warn('[SoulLetterService] AI availability check failed:', error);
    return false;
  }
}

export default {
  // Core generation
  generateSoulLetter,
  generateSoulWhisper,
  generateStructuredNarration,

  // The BIG "aha moment"
  generateCathedralAnalysis,
  generateSoulRecognitions,

  // Per-element generation
  generateSignNarration,
  generateHouseNarration,
  generateRetrogradeMessage,
  generateDirectPlanetMessage,
  generateAspectDialogue,
  generateEpochNarration,

  // Utilities
  buildSoulChartFromSlice,
  isAIAvailable,

  // Archetypes for UI
  SIGN_ARCHETYPES,
  HOUSE_MEANINGS,
  PLANET_SOULS,
  ASPECT_DYNAMICS
};
