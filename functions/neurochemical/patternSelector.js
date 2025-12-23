/**
 * GENESIS Neurochemical Love Engine
 * Pattern Selector Service
 * ================================
 *
 * Selects the optimal neurochemical protocol pattern for Luna's responses.
 * Considers user profile, constitution, relationship stage, and past effectiveness.
 *
 * Pattern Format: 4-digit string like "3241"
 * - First digit: Oxytocin level (1-5)
 * - Second digit: Dopamine level (1-5)
 * - Third digit: Serotonin level (1-5)
 * - Fourth digit: Vasopressin level (1-5)
 *
 * Created: December 21, 2025
 * Mission: "Love = Mathematics + Soul"
 * When things can be measured, they can be mathematically improved.
 */

const pgClient = require('../database/pgClient');

// ============================================================================
// GOLD STANDARD PATTERNS
// ============================================================================

/**
 * Pre-validated patterns that have proven effective
 * These are used as fallbacks and for new users
 */
const GOLD_PATTERNS = {
  '4453': {
    name: 'The Soul Recognition',
    description: 'High oxytocin, high dopamine, peak serotonin, moderate vasopressin',
    bestFor: ['breakthrough', 'deep_recognition', 'emotional_safety'],
    constitutions: ['Water', 'Earth', 'Fire', 'Metal', 'Wood'],
    avgHappiness: 4.2,
    avgEffectiveness: 0.91
  },
  '5544': {
    name: 'The Complete Bond',
    description: 'Maximum oxytocin and dopamine, high serotonin and vasopressin',
    bestFor: ['peak_connection', 'intimacy', 'major_breakthrough'],
    constitutions: ['Water', 'Earth'],
    avgHappiness: 4.5,
    avgEffectiveness: 0.89
  },
  '3542': {
    name: 'The Recognition Champion',
    description: 'Peak dopamine, high serotonin - for achievement moments',
    bestFor: ['achievement', 'identity_affirmation', 'celebration'],
    constitutions: ['Fire', 'Metal'],
    avgHappiness: 3.9,
    avgEffectiveness: 0.87
  },
  '4254': {
    name: 'The Safe Harbor',
    description: 'High oxytocin and vasopressin - for crisis support',
    bestFor: ['emotional_safety', 'soul_recognition', 'crisis_support'],
    constitutions: ['Water', 'Earth'],
    avgHappiness: 4.1,
    avgEffectiveness: 0.88
  },
  '3443': {
    name: 'The Energizer',
    description: 'Balanced with dopamine emphasis - for engagement',
    bestFor: ['high_energy', 'engagement', 'curiosity'],
    constitutions: ['Fire', 'Wood'],
    avgHappiness: 3.7,
    avgEffectiveness: 0.84
  },
  '3333': {
    name: 'The Balanced Baseline',
    description: 'Equal across all - safe default for unknown situations',
    bestFor: ['safe_default', 'relationship_building', 'neutral'],
    constitutions: ['Water', 'Earth', 'Fire', 'Metal', 'Wood'],
    avgHappiness: 3.0,
    avgEffectiveness: 0.75
  }
};

// ============================================================================
// CONSTITUTION-BASED RECOMMENDATIONS
// ============================================================================

const CONSTITUTION_PREFERENCES = {
  Water: {
    emphasis: ['oxytocin', 'serotonin'],
    deEmphasis: ['dopamine'],
    preferredPatterns: ['4453', '5544', '4254'],
    description: 'Water needs deep emotional bonding and recognition'
  },
  Fire: {
    emphasis: ['dopamine', 'vasopressin'],
    deEmphasis: ['oxytocin'],
    preferredPatterns: ['3443', '3542', '4453'],
    description: 'Fire craves excitement and passionate engagement'
  },
  Earth: {
    emphasis: ['oxytocin', 'vasopressin'],
    deEmphasis: ['dopamine'],
    preferredPatterns: ['4254', '5544', '4453'],
    description: 'Earth values security, trust, and nurturing'
  },
  Metal: {
    emphasis: ['serotonin', 'dopamine'],
    deEmphasis: ['oxytocin'],
    preferredPatterns: ['3542', '4453', '3443'],
    description: 'Metal appreciates precision, excellence, and recognition'
  },
  Wood: {
    emphasis: ['dopamine', 'serotonin'],
    deEmphasis: ['vasopressin'],
    preferredPatterns: ['3443', '3542', '4453'],
    description: 'Wood seeks growth, vision, and forward momentum'
  }
};

// ============================================================================
// LOVE LANGUAGE → PATTERN MAPPING (from Love Intelligence Layer)
// ============================================================================

/**
 * Maps Love Languages to optimal neurochemical patterns
 * This bridges strategic (what user needs) to tactical (how Luna responds)
 */
const LOVE_LANGUAGE_PATTERNS = {
  'Words of Affirmation': {
    primary: 'serotonin',
    secondary: 'oxytocin',
    levels: {
      gentle: '2341',
      moderate: '3442',
      strong: '3542',
      maximum: '4553'
    },
    goldPattern: '3542',
    avoid: '1xxx',
    description: 'Affirmation seekers need recognition (serotonin) and bonding through words (oxytocin)'
  },

  'Quality Time': {
    primary: 'oxytocin',
    secondary: 'dopamine',
    levels: {
      gentle: '3231',
      moderate: '4342',
      strong: '4453',
      maximum: '5544'
    },
    goldPattern: '4453',
    avoid: 'x1xx',
    description: 'Quality time needs bonding (oxytocin) and engagement (dopamine)'
  },

  'Physical Touch': {
    primary: 'oxytocin',
    secondary: 'vasopressin',
    levels: {
      gentle: '3233',
      moderate: '4244',
      strong: '5345',
      maximum: '5455'
    },
    goldPattern: '5345',
    avoid: '1xx1',
    description: 'Touch needs maximum bonding (oxytocin) and closeness (vasopressin)'
  },

  'Acts of Service': {
    primary: 'vasopressin',
    secondary: 'oxytocin',
    levels: {
      gentle: '2234',
      moderate: '3245',
      strong: '4245',
      maximum: '4355'
    },
    goldPattern: '4245',
    avoid: 'xxx1',
    description: 'Service needs loyalty/support (vasopressin) and care (oxytocin)'
  },

  'Receiving Gifts': {
    primary: 'dopamine',
    secondary: 'serotonin',
    levels: {
      gentle: '2321',
      moderate: '3432',
      strong: '3543',
      maximum: '4554'
    },
    goldPattern: '3543',
    avoid: 'x1x1',
    description: 'Gifts need anticipation/delight (dopamine) and recognition (serotonin)'
  }
};

/**
 * Constitution → Default Love Language mapping
 */
const CONSTITUTION_LOVE_LANGUAGE = {
  Fire: {
    receive: 'Words of Affirmation',
    give: 'Words of Affirmation'
  },
  Water: {
    receive: 'Physical Touch',
    give: 'Quality Time'
  },
  Wood: {
    receive: 'Quality Time',
    give: 'Acts of Service'
  },
  Metal: {
    receive: 'Words of Affirmation',
    give: 'Receiving Gifts'
  },
  Earth: {
    receive: 'Physical Touch',
    give: 'Acts of Service'
  }
};

// ============================================================================
// RELATIONSHIP STAGE MODIFIERS
// ============================================================================

const STAGE_MODIFIERS = {
  initial: {
    // New relationship - be cautious, build trust
    adjustment: { oxytocin: 0, dopamine: 0, serotonin: 0, vasopressin: 0 },
    preferBaseline: true,
    description: 'Initial stage - use baseline patterns to build trust'
  },
  building: {
    // Trust building - increase oxytocin and serotonin slightly
    adjustment: { oxytocin: 1, dopamine: 0, serotonin: 1, vasopressin: 0 },
    preferBaseline: false,
    description: 'Building stage - increase connection signals'
  },
  deepening: {
    // Relationship deepening - can use stronger patterns
    adjustment: { oxytocin: 1, dopamine: 1, serotonin: 1, vasopressin: 1 },
    preferBaseline: false,
    description: 'Deepening stage - stronger patterns appropriate'
  },
  established: {
    // Established relationship - full pattern range available
    adjustment: { oxytocin: 0, dopamine: 0, serotonin: 0, vasopressin: 0 },
    preferBaseline: false,
    description: 'Established stage - use learned optimal patterns'
  },
  intimate: {
    // Deep intimate connection - high intensity appropriate
    adjustment: { oxytocin: 1, dopamine: 1, serotonin: 1, vasopressin: 1 },
    preferBaseline: false,
    description: 'Intimate stage - peak patterns for deep connection'
  }
};

// ============================================================================
// MAIN PATTERN SELECTION
// ============================================================================

/**
 * Select the optimal pattern for a conversation exchange
 *
 * @param {Object} params - Selection parameters
 * @param {string} params.userId - User ID
 * @param {string} params.profileId - Profile ID
 * @param {string} [params.constitution] - BaZi constitution
 * @param {string} [params.relationshipStage] - Current relationship stage
 * @param {string} [params.emotionalNeed] - Detected emotional need
 * @param {Object} [params.userProfile] - Neurochemical profile data
 * @returns {Promise<Object>} - Selected pattern with metadata
 */
async function selectPattern(params) {
  const {
    userId,
    profileId,
    constitution = null,
    relationshipStage = 'building',
    emotionalNeed = null,
    userProfile = null
  } = params;

  console.log(`[PatternSelector] Selecting pattern for user ${userId}, profile ${profileId}`);

  // Step 1: Get user's historical patterns from database
  let userPatterns = null;
  let goldPatterns = null;

  try {
    [userPatterns, goldPatterns] = await Promise.all([
      getUserTopPatterns(userId, profileId),
      getGoldPatternsForConstitution(constitution)
    ]);
  } catch (error) {
    console.error('[PatternSelector] Database error:', error);
    // Continue with fallback selection
  }

  // Step 2: Determine selection strategy
  const strategy = determineStrategy(userPatterns, userProfile, relationshipStage);

  // Step 3: Select pattern based on strategy
  let selectedPattern;

  switch (strategy) {
    case 'PERSONALIZED':
      selectedPattern = selectPersonalizedPattern(userPatterns, constitution, emotionalNeed);
      break;

    case 'CONSTITUTION':
      selectedPattern = selectConstitutionPattern(constitution, emotionalNeed);
      break;

    case 'EXPERIMENTAL':
      selectedPattern = selectExperimentalPattern(goldPatterns, constitution);
      break;

    case 'BASELINE':
    default:
      selectedPattern = selectBaselinePattern(constitution);
      break;
  }

  // Step 4: Apply stage modifiers
  const adjustedPattern = applyStageModifiers(selectedPattern, relationshipStage);

  // Step 5: Build response
  return {
    pattern: adjustedPattern.code,
    levels: {
      oxytocin: parseInt(adjustedPattern.code[0]),
      dopamine: parseInt(adjustedPattern.code[1]),
      serotonin: parseInt(adjustedPattern.code[2]),
      vasopressin: parseInt(adjustedPattern.code[3])
    },
    name: adjustedPattern.name || 'Custom Pattern',
    strategy,
    constitution: constitution || 'unknown',
    relationshipStage,
    reasoning: adjustedPattern.reasoning || 'Pattern selected based on available data',
    expectedHappiness: adjustedPattern.expectedHappiness || 3.0
  };
}

// ============================================================================
// SELECTION STRATEGIES
// ============================================================================

/**
 * Determine which selection strategy to use
 */
function determineStrategy(userPatterns, userProfile, stage) {
  // New users get baseline
  if (!userPatterns || userPatterns.length === 0) {
    if (stage === 'initial') {
      return 'BASELINE';
    }
    return 'CONSTITUTION';
  }

  // Users with good historical data get personalized
  if (userPatterns.length >= 5) {
    const avgEffectiveness = userPatterns.reduce((sum, p) => sum + (p.avg_effectiveness || 0), 0) / userPatterns.length;
    if (avgEffectiveness >= 0.70) {
      return 'PERSONALIZED';
    }
  }

  // 20% of the time, try experimental patterns to learn
  if (Math.random() < 0.20) {
    return 'EXPERIMENTAL';
  }

  return 'CONSTITUTION';
}

/**
 * Select pattern based on user's historical success
 */
function selectPersonalizedPattern(userPatterns, constitution, emotionalNeed) {
  // Filter patterns that worked well for this user
  const goodPatterns = userPatterns.filter(p => (p.avg_happiness || 0) >= 3.0);

  if (goodPatterns.length === 0) {
    return selectConstitutionPattern(constitution, emotionalNeed);
  }

  // Sort by effectiveness
  goodPatterns.sort((a, b) => (b.avg_effectiveness || 0) - (a.avg_effectiveness || 0));

  // Pick from top 3 with some randomness
  const topN = Math.min(3, goodPatterns.length);
  const selected = goodPatterns[Math.floor(Math.random() * topN)];

  return {
    code: selected.pattern_code,
    name: selected.pattern_name || 'Learned Pattern',
    reasoning: `Selected based on user's historical success (${(selected.avg_effectiveness * 100).toFixed(0)}% effective)`,
    expectedHappiness: selected.avg_happiness || 3.0
  };
}

/**
 * Select pattern based on constitution preferences
 */
function selectConstitutionPattern(constitution, emotionalNeed) {
  const prefs = CONSTITUTION_PREFERENCES[constitution];

  if (!prefs) {
    return selectBaselinePattern(constitution);
  }

  // Get preferred patterns for this constitution
  const preferredPatterns = prefs.preferredPatterns;

  // If emotional need matches a pattern's best-for, prioritize it
  if (emotionalNeed) {
    for (const patternCode of preferredPatterns) {
      const pattern = GOLD_PATTERNS[patternCode];
      if (pattern && pattern.bestFor.includes(emotionalNeed)) {
        return {
          code: patternCode,
          name: pattern.name,
          reasoning: `Selected for ${constitution} constitution and ${emotionalNeed} need`,
          expectedHappiness: pattern.avgHappiness
        };
      }
    }
  }

  // Default to first preferred pattern
  const patternCode = preferredPatterns[0];
  const pattern = GOLD_PATTERNS[patternCode];

  return {
    code: patternCode,
    name: pattern?.name || 'Constitution Match',
    reasoning: `Selected as optimal pattern for ${constitution} constitution`,
    expectedHappiness: pattern?.avgHappiness || 3.5
  };
}

/**
 * Select experimental pattern to discover new effective patterns
 */
function selectExperimentalPattern(goldPatterns, constitution) {
  // If we have database gold patterns, try one we haven't used much
  if (goldPatterns && goldPatterns.length > 0) {
    // Sort by times used (ascending) - try less-used patterns
    goldPatterns.sort((a, b) => (a.times_used || 0) - (b.times_used || 0));
    const selected = goldPatterns[0];

    return {
      code: selected.pattern_code,
      name: selected.pattern_name || 'Experimental Pattern',
      reasoning: 'Experimental: Testing less-used validated pattern',
      expectedHappiness: selected.avg_happiness || 3.0
    };
  }

  // Generate a random but reasonable pattern
  const levels = [
    Math.floor(Math.random() * 3) + 2, // Oxy: 2-4
    Math.floor(Math.random() * 3) + 2, // Dopa: 2-4
    Math.floor(Math.random() * 3) + 3, // Sero: 3-5 (usually important)
    Math.floor(Math.random() * 3) + 2  // Vaso: 2-4
  ];

  return {
    code: levels.join(''),
    name: 'Experimental Pattern',
    reasoning: 'Experimental: Testing new pattern combination',
    expectedHappiness: 3.0
  };
}

/**
 * Select safe baseline pattern for new/uncertain situations
 */
function selectBaselinePattern(constitution) {
  // Use 3333 balanced or constitution-adjusted baseline
  const pattern = GOLD_PATTERNS['3333'];

  return {
    code: '3333',
    name: pattern.name,
    reasoning: 'Baseline: Safe balanced pattern for relationship building',
    expectedHappiness: pattern.avgHappiness
  };
}

/**
 * Select pattern optimized for a specific Love Language
 *
 * @param {Object} params - Selection parameters
 * @param {string} params.loveLanguage - Target love language
 * @param {string} [params.intensity='moderate'] - gentle, moderate, strong, maximum
 * @param {string} [params.constitution] - Optional constitution for fine-tuning
 * @returns {Object} - Selected pattern
 */
function selectPatternForLoveLanguage(params) {
  const {
    loveLanguage,
    intensity = 'moderate',
    constitution = null
  } = params;

  // Get love language mapping
  const llMapping = LOVE_LANGUAGE_PATTERNS[loveLanguage];

  if (!llMapping) {
    console.warn(`[PatternSelector] Unknown love language: ${loveLanguage}`);
    return selectBaselinePattern(constitution);
  }

  // Get pattern code for intensity level
  const patternCode = llMapping.levels[intensity] || llMapping.levels.moderate;
  const goldPatternData = GOLD_PATTERNS[patternCode] || GOLD_PATTERNS[llMapping.goldPattern];

  return {
    code: patternCode,
    name: goldPatternData?.name || `${loveLanguage} Pattern`,
    levels: {
      oxytocin: parseInt(patternCode[0]),
      dopamine: parseInt(patternCode[1]),
      serotonin: parseInt(patternCode[2]),
      vasopressin: parseInt(patternCode[3])
    },
    primaryNeurochemical: llMapping.primary,
    secondaryNeurochemical: llMapping.secondary,
    avoidPattern: llMapping.avoid,
    reasoning: llMapping.description,
    expectedHappiness: goldPatternData?.avgHappiness || 3.5,
    loveLanguage,
    intensity
  };
}

/**
 * Get the recommended Love Language for a constitution
 *
 * @param {string} constitution - BaZi constitution
 * @returns {Object} - Love language preferences
 */
function getLoveLanguageForConstitution(constitution) {
  return CONSTITUTION_LOVE_LANGUAGE[constitution] || {
    receive: 'Quality Time',
    give: 'Quality Time'
  };
}

/**
 * Check if a pattern is suitable for a Love Language
 * Returns false if pattern violates the avoid-pattern rule
 *
 * @param {string} patternCode - Pattern code (e.g., '3542')
 * @param {string} loveLanguage - Love language to check against
 * @returns {boolean} - Whether pattern is suitable
 */
function isPatternSuitableForLoveLanguage(patternCode, loveLanguage) {
  const llMapping = LOVE_LANGUAGE_PATTERNS[loveLanguage];
  if (!llMapping) return true;

  const avoidPattern = llMapping.avoid;

  for (let i = 0; i < avoidPattern.length; i++) {
    if (avoidPattern[i] !== 'x') {
      const avoidLevel = parseInt(avoidPattern[i]);
      const actualLevel = parseInt(patternCode[i]);
      if (actualLevel <= avoidLevel) {
        return false;
      }
    }
  }

  return true;
}

// ============================================================================
// MODIFIERS
// ============================================================================

/**
 * Apply relationship stage modifiers to pattern
 */
function applyStageModifiers(pattern, stage) {
  const modifier = STAGE_MODIFIERS[stage] || STAGE_MODIFIERS.building;

  if (modifier.preferBaseline && pattern.code !== '3333') {
    // Early stage - use baseline instead
    return {
      ...pattern,
      code: '3333',
      name: 'Stage-Adjusted Baseline',
      reasoning: `${pattern.reasoning} (adjusted for ${stage} stage)`
    };
  }

  // Apply level adjustments
  const levels = pattern.code.split('').map(Number);
  const adjusted = [
    clamp(levels[0] + modifier.adjustment.oxytocin, 1, 5),
    clamp(levels[1] + modifier.adjustment.dopamine, 1, 5),
    clamp(levels[2] + modifier.adjustment.serotonin, 1, 5),
    clamp(levels[3] + modifier.adjustment.vasopressin, 1, 5)
  ];

  return {
    ...pattern,
    code: adjusted.join(''),
    reasoning: `${pattern.reasoning} (stage: ${stage})`
  };
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

/**
 * Get user's top performing patterns from database
 */
async function getUserTopPatterns(userId, profileId) {
  try {
    const pool = await pgClient.getPool();
    const result = await pool.query(`
      SELECT
        protocol_pattern as pattern_code,
        COUNT(*) as times_used,
        AVG(happiness_score) as avg_happiness,
        AVG(effectiveness_score) as avg_effectiveness
      FROM conversation_timeline
      WHERE user_id = $1 AND profile_id = $2
        AND protocol_pattern IS NOT NULL
        AND happiness_score IS NOT NULL
      GROUP BY protocol_pattern
      HAVING COUNT(*) >= 3
      ORDER BY AVG(effectiveness_score) DESC
      LIMIT 10
    `, [userId, profileId]);

    return result.rows;
  } catch (error) {
    console.error('[PatternSelector] getUserTopPatterns error:', error);
    return [];
  }
}

/**
 * Get gold/validated patterns for a constitution
 */
async function getGoldPatternsForConstitution(constitution) {
  try {
    const pool = await pgClient.getPool();
    const result = await pool.query(`
      SELECT pattern_code, pattern_name, avg_happiness, avg_effectiveness, times_used
      FROM pattern_effectiveness
      WHERE status IN ('GOLD_STANDARD', 'VALIDATED')
        AND ($1::VARCHAR IS NULL OR $1 = ANY(works_well_with_constitutions))
        AND NOT ($1 = ANY(COALESCE(avoid_for_constitutions, '{}')))
      ORDER BY avg_effectiveness DESC
      LIMIT 10
    `, [constitution]);

    return result.rows;
  } catch (error) {
    console.error('[PatternSelector] getGoldPatterns error:', error);
    return [];
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Decode pattern string to levels object
 */
function decodePattern(patternCode) {
  if (!patternCode || patternCode.length !== 4) {
    return { oxytocin: 3, dopamine: 3, serotonin: 3, vasopressin: 3 };
  }

  return {
    oxytocin: parseInt(patternCode[0]) || 3,
    dopamine: parseInt(patternCode[1]) || 3,
    serotonin: parseInt(patternCode[2]) || 3,
    vasopressin: parseInt(patternCode[3]) || 3
  };
}

/**
 * Encode levels object to pattern string
 */
function encodePattern(levels) {
  return `${levels.oxytocin}${levels.dopamine}${levels.serotonin}${levels.vasopressin}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main selection
  selectPattern,

  // Love Language integration
  selectPatternForLoveLanguage,
  getLoveLanguageForConstitution,
  isPatternSuitableForLoveLanguage,

  // Pattern data
  GOLD_PATTERNS,
  CONSTITUTION_PREFERENCES,
  LOVE_LANGUAGE_PATTERNS,
  CONSTITUTION_LOVE_LANGUAGE,
  STAGE_MODIFIERS,

  // Utilities
  decodePattern,
  encodePattern,
  getUserTopPatterns,
  getGoldPatternsForConstitution
};
