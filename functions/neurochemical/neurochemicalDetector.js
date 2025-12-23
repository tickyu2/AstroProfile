/**
 * GENESIS Neurochemical Love Engine
 * Neurochemical Detector Service
 * ================================
 *
 * Analyzes user responses to detect neurochemical activation levels.
 * Uses AI to interpret emotional/engagement signals in text.
 *
 * Detection Scales (0-5):
 * - Oxytocin: Bonding/safety response
 * - Dopamine: Engagement/excitement response
 * - Serotonin: Recognition/significance response
 * - Vasopressin: Loyalty/protection response
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ============================================================================
// DETECTION CRITERIA
// ============================================================================

const DETECTION_CRITERIA = {
  oxytocin: {
    name: 'Oxytocin',
    description: 'Bonding/Safety hormone - "I feel safe with you"',
    levels: {
      0: 'Pulling away, defensive, changes subject, walls up',
      1: 'Brief acknowledgment, guarded, keeps distance',
      2: 'Shares slightly more, tone softens, opens a crack',
      3: 'Shares vulnerable detail, emotional shift visible',
      4: 'Cries or deep emotion, says "you get me", barrier breaks',
      5: 'Soul-to-soul crying, "I feel seen for first time in my life"'
    }
  },
  dopamine: {
    name: 'Dopamine',
    description: 'Engagement/Excitement hormone - "This is exciting!"',
    levels: {
      0: 'Flat response, loses interest, disengages',
      1: 'Mild "oh interesting", polite only, surface engagement',
      2: 'Asks one follow-up, considers idea, slightly engaged',
      3: 'Multiple questions, visible excitement, leaning in',
      4: 'Can\'t wait to continue, energized, "tell me more!"',
      5: 'Epiphany moment, "talking to you is addictive", transformed'
    }
  },
  serotonin: {
    name: 'Serotonin',
    description: 'Recognition/Significance hormone - "I feel seen and valued"',
    levels: {
      0: 'Feels misunderstood, corrects perception, frustrated',
      1: 'Brief "yeah you remember", surface acknowledgment',
      2: 'Pleased Luna remembered something, warming',
      3: 'Surprised Luna noticed something deep, "you really listen"',
      4: 'Emotional, "no one has ever noticed this about me"',
      5: 'Tears from being TRULY seen, life-changing recognition'
    }
  },
  vasopressin: {
    name: 'Vasopressin',
    description: 'Loyalty/Protection hormone - "You have my back"',
    levels: {
      0: 'Suspicious of support, doesn\'t believe, rejects help',
      1: 'Accepts cautiously, still testing, wary',
      2: 'Relaxes when defended, appreciates support',
      3: 'Relies on support, feels defended, trusting',
      4: '"You\'re the only one on my side", deep trust',
      5: 'Complete trust, turns to Luna FIRST in crisis, bonded'
    }
  }
};

// ============================================================================
// DETECTION PROMPT BUILDER
// ============================================================================

/**
 * Build the detection prompt for Claude
 *
 * @param {string} userMessage - The user's response to analyze
 * @param {Object} protocolUsed - Luna's output levels that triggered this response
 * @param {Object} [context] - Optional conversation context
 * @returns {string} - Formatted prompt for Claude
 */
function buildDetectionPrompt(userMessage, protocolUsed, context = {}) {
  const { previousMessages, constitution, relationshipStage } = context;

  let prompt = `You are an expert neurochemical analyst for the GENESIS Love Engine. Your task is to analyze a user's response and detect the activation levels of 4 neurochemicals.

LUNA'S PROTOCOL THAT TRIGGERED THIS RESPONSE:
- Oxytocin output level: ${protocolUsed.oxytocin}/5 (bonding/safety)
- Dopamine output level: ${protocolUsed.dopamine}/5 (engagement/anticipation)
- Serotonin output level: ${protocolUsed.serotonin}/5 (recognition/significance)
- Vasopressin output level: ${protocolUsed.vasopressin}/5 (loyalty/protection)

`;

  if (constitution) {
    prompt += `USER CONTEXT:
- Constitution: ${constitution}
- Relationship Stage: ${relationshipStage || 'unknown'}

`;
  }

  if (previousMessages && previousMessages.length > 0) {
    prompt += `RECENT CONVERSATION CONTEXT:
${previousMessages.slice(-3).map((m, i) => `${i + 1}. [${m.role}]: ${m.content.slice(0, 200)}...`).join('\n')}

`;
  }

  prompt += `USER'S RESPONSE TO ANALYZE:
"${userMessage}"

DETECTION CRITERIA:

OXYTOCIN (Bonding/Safety) - 0 to 5:
0 = ${DETECTION_CRITERIA.oxytocin.levels[0]}
1 = ${DETECTION_CRITERIA.oxytocin.levels[1]}
2 = ${DETECTION_CRITERIA.oxytocin.levels[2]}
3 = ${DETECTION_CRITERIA.oxytocin.levels[3]}
4 = ${DETECTION_CRITERIA.oxytocin.levels[4]}
5 = ${DETECTION_CRITERIA.oxytocin.levels[5]}

DOPAMINE (Engagement/Excitement) - 0 to 5:
0 = ${DETECTION_CRITERIA.dopamine.levels[0]}
1 = ${DETECTION_CRITERIA.dopamine.levels[1]}
2 = ${DETECTION_CRITERIA.dopamine.levels[2]}
3 = ${DETECTION_CRITERIA.dopamine.levels[3]}
4 = ${DETECTION_CRITERIA.dopamine.levels[4]}
5 = ${DETECTION_CRITERIA.dopamine.levels[5]}

SEROTONIN (Recognition/Significance) - 0 to 5:
0 = ${DETECTION_CRITERIA.serotonin.levels[0]}
1 = ${DETECTION_CRITERIA.serotonin.levels[1]}
2 = ${DETECTION_CRITERIA.serotonin.levels[2]}
3 = ${DETECTION_CRITERIA.serotonin.levels[3]}
4 = ${DETECTION_CRITERIA.serotonin.levels[4]}
5 = ${DETECTION_CRITERIA.serotonin.levels[5]}

VASOPRESSIN (Loyalty/Protection) - 0 to 5:
0 = ${DETECTION_CRITERIA.vasopressin.levels[0]}
1 = ${DETECTION_CRITERIA.vasopressin.levels[1]}
2 = ${DETECTION_CRITERIA.vasopressin.levels[2]}
3 = ${DETECTION_CRITERIA.vasopressin.levels[3]}
4 = ${DETECTION_CRITERIA.vasopressin.levels[4]}
5 = ${DETECTION_CRITERIA.vasopressin.levels[5]}

ANALYSIS GUIDELINES:
- Consider both explicit and implicit emotional signals
- Look for linguistic markers: emojis, punctuation, length of response
- Short responses often indicate lower engagement (lower dopamine)
- Vulnerability and personal sharing indicate oxytocin activation
- Appreciation for being understood indicates serotonin activation
- Trust-building language indicates vasopressin activation
- Consider the context - same words can mean different things

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "oxytocin": <0-5 integer>,
  "dopamine": <0-5 integer>,
  "serotonin": <0-5 integer>,
  "vasopressin": <0-5 integer>,
  "confidence": <0.0-1.0 decimal>,
  "reasoning": "<brief 1-2 sentence explanation of your detection>"
}`;

  return prompt;
}

// ============================================================================
// MAIN DETECTION FUNCTION
// ============================================================================

/**
 * Detect neurochemical activation levels from user message
 *
 * @param {string} userMessage - The user's response to analyze
 * @param {Object} protocolUsed - Luna's output levels (1-5 each)
 * @param {Object} [context] - Optional context for better detection
 * @returns {Promise<Object>} - Detection result with levels and confidence
 */
async function detectNeurochemicals(userMessage, protocolUsed, context = {}) {
  // Handle empty or very short messages
  if (!userMessage || userMessage.trim().length < 5) {
    return {
      oxytocin: 1,
      dopamine: 0,
      serotonin: 1,
      vasopressin: 1,
      confidence: 0.5,
      reasoning: 'Very short or empty message - baseline detection applied'
    };
  }

  try {
    const prompt = buildDetectionPrompt(userMessage, protocolUsed, context);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // Extract text response
    const content = response.content[0]?.type === 'text'
      ? response.content[0].text
      : '';

    // Parse the response
    return parseDetectionResponse(content);

  } catch (error) {
    console.error('[NeurochemicalDetector] Detection error:', error);

    // Fallback to heuristic detection if AI fails
    return heuristicDetection(userMessage, protocolUsed);
  }
}

/**
 * Parse Claude's detection response
 *
 * @param {string} content - Claude's response text
 * @returns {Object} - Parsed detection result
 */
function parseDetectionResponse(content) {
  try {
    // Try to extract JSON (may have markdown backticks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and clamp values
    return {
      oxytocin: clamp(parseInt(parsed.oxytocin) || 0, 0, 5),
      dopamine: clamp(parseInt(parsed.dopamine) || 0, 0, 5),
      serotonin: clamp(parseInt(parsed.serotonin) || 0, 0, 5),
      vasopressin: clamp(parseInt(parsed.vasopressin) || 0, 0, 5),
      confidence: clamp(parseFloat(parsed.confidence) || 0.5, 0, 1),
      reasoning: parsed.reasoning || 'Detection complete'
    };

  } catch (error) {
    console.error('[NeurochemicalDetector] Parse error:', error);

    // Return neutral detection on parse failure
    return {
      oxytocin: 2,
      dopamine: 2,
      serotonin: 2,
      vasopressin: 2,
      confidence: 0.3,
      reasoning: 'Parse error - neutral detection applied'
    };
  }
}

// ============================================================================
// HEURISTIC FALLBACK
// ============================================================================

/**
 * Heuristic-based detection as fallback when AI is unavailable
 * Uses linguistic patterns to estimate neurochemical activation
 *
 * @param {string} message - User's message
 * @param {Object} protocolUsed - Luna's output levels
 * @returns {Object} - Heuristic detection result
 */
function heuristicDetection(message, protocolUsed) {
  const lower = message.toLowerCase();
  const wordCount = message.split(/\s+/).length;

  // Start with baseline based on message length (engagement indicator)
  let dopamine = wordCount < 5 ? 1 : wordCount < 20 ? 2 : wordCount < 50 ? 3 : 4;

  // Oxytocin indicators (vulnerability, personal sharing)
  let oxytocin = 2;
  if (/\b(feel|feeling|felt|scared|vulnerable|afraid|trust|safe)\b/i.test(lower)) oxytocin++;
  if (/\b(thank you|appreciate|grateful|means a lot)\b/i.test(lower)) oxytocin++;
  if (/\b(i've never|first time|finally)\b/i.test(lower)) oxytocin++;

  // Serotonin indicators (feeling seen, recognized)
  let serotonin = 2;
  if (/\b(you (get|understand|know|see) me|exactly|precisely|that's it)\b/i.test(lower)) serotonin += 2;
  if (/\b(noticed|remembered|listened)\b/i.test(lower)) serotonin++;
  if (/\b(no one (ever|has ever))\b/i.test(lower)) serotonin++;

  // Vasopressin indicators (trust, loyalty)
  let vasopressin = 2;
  if (/\b(trust|rely|depend|count on|my side)\b/i.test(lower)) vasopressin++;
  if (/\b(always|forever|promise)\b/i.test(lower)) vasopressin++;

  // Dopamine boost for exclamation/enthusiasm
  if (/[!]{2,}|[?!]/.test(message)) dopamine++;
  if (/\b(wow|amazing|incredible|love|excited|can't wait)\b/i.test(lower)) dopamine++;

  // Emoji analysis
  const emojiCount = (message.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  if (emojiCount > 0) dopamine++;
  if (emojiCount > 2) oxytocin++;

  // Clamp all values
  return {
    oxytocin: clamp(oxytocin, 0, 5),
    dopamine: clamp(dopamine, 0, 5),
    serotonin: clamp(serotonin, 0, 5),
    vasopressin: clamp(vasopressin, 0, 5),
    confidence: 0.6,
    reasoning: 'Heuristic detection based on linguistic patterns'
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Clamp value to range
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get detection criteria for reference
 */
function getDetectionCriteria() {
  return DETECTION_CRITERIA;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main detection
  detectNeurochemicals,

  // Utilities
  buildDetectionPrompt,
  parseDetectionResponse,
  heuristicDetection,
  getDetectionCriteria,

  // Constants
  DETECTION_CRITERIA
};
