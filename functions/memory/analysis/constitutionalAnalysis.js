/**
 * ============================================================================
 * GENESIS LUNA - CONSTITUTIONAL ANALYSIS
 * ============================================================================
 * Tag memories with constitutional context for pattern recognition.
 * Brother Sonnet's Soul Discovery - Task 2.
 *
 * Functions:
 * - analyzeConstitutionalActivation: Main analysis function
 * - analyzeElementActivation: Element engagement
 * - analyzePillarActivation: BaZi pillar resonance
 * - analyzeGiftEngagement: Oscar role usage
 * - analyzeNeurochemicalEffectiveness: Protocol effectiveness
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  CONSTITUTIONAL MEMORY TAGGING                                          │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ MEMORY INPUT    │                                                     │
 * │  │ + Soul Section  │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌───────────────────────────────────────────────────────────────────┐  │
 * │  │                    CONSTITUTIONAL ANALYSIS                        │  │
 * │  │                                                                   │  │
 * │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │  │
 * │  │  │ Element    │ │ Pillar     │ │ Gift       │ │ Neuro      │    │  │
 * │  │  │ Activation │ │ Activation │ │ Engagement │ │ Protocol   │    │  │
 * │  │  │ (5 elem)   │ │ (4 pillars)│ │ (3 roles)  │ │ (4 chems)  │    │  │
 * │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │  │
 * │  └───────────────────────────────────────────────────────────────────┘  │
 * │                           │                                              │
 * │                           ▼                                              │
 * │  ┌───────────────────────────────────────────────────────────────────┐  │
 * │  │ CONSTITUTIONAL TAG OUTPUT                                         │  │
 * │  │ {                                                                 │  │
 * │  │   elementActivated: "Water",                                      │  │
 * │  │   elementStrength: "strong",                                      │  │
 * │  │   pillarAffected: "Day",                                          │  │
 * │  │   giftEngaged: "Intuition (Best Actress)",                        │  │
 * │  │   neurochemical: { primary: "Oxytocin", effectiveness: 0.90 }     │  │
 * │  │ }                                                                 │  │
 * │  └───────────────────────────────────────────────────────────────────┘  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

// ============================================================================
// NEUROCHEMICAL PRIORITY BY ELEMENT
// ============================================================================

/**
 * Get neurochemical priority based on element
 */
function getNeurochemicalPriority(element) {
  const priorities = {
    'Wood': ['Dopamine', 'Oxytocin'],
    'Fire': ['Dopamine', 'Vasopressin'],
    'Earth': ['Serotonin', 'Oxytocin'],
    'Metal': ['Serotonin', 'Dopamine'],
    'Water': ['Oxytocin', 'Serotonin']
  };
  return priorities[element] || ['Oxytocin', 'Dopamine'];
}

// ============================================================================
// ELEMENT ACTIVATION ANALYSIS
// ============================================================================

/**
 * Analyze which element was activated based on emotional signature
 *
 * @param {Object} soulData - SOUL section from memory
 * @param {string} primaryElement - User's primary element
 * @returns {Object} Element activation analysis
 */
function analyzeElementActivation(soulData, primaryElement) {
  if (!soulData) {
    return { element: primaryElement || 'Earth', strength: 'background', isPrimary: false };
  }

  const emotionalContent = soulData.emotionIntensity || 0;
  const vulnerabilityLevel = soulData.vulnerability || 0;
  const impact = soulData.impact;

  let activatedElement = primaryElement || 'Earth';
  let strength = 'moderate';

  // Water activation: Deep emotions, high vulnerability
  if (emotionalContent >= 7 && vulnerabilityLevel >= 7) {
    activatedElement = 'Water';
    strength = 'strong';
  }
  // Fire activation: High intensity, positive impact, low vulnerability
  else if (emotionalContent >= 7 && impact === 'positive' && vulnerabilityLevel < 5) {
    activatedElement = 'Fire';
    strength = 'strong';
  }
  // Earth activation: Grounding (stressed → relieved)
  else if (soulData.emotionBefore === 'stressed' && soulData.emotionAfter === 'relieved') {
    activatedElement = 'Earth';
    strength = 'moderate';
  }
  // Metal activation: Clarity, precision
  else if (impact === 'clarifying' || vulnerabilityLevel < 3) {
    activatedElement = 'Metal';
    strength = primaryElement === 'Metal' ? 'strong' : 'moderate';
  }
  // Wood activation: Growth, learning
  else if (impact === 'transformative' || soulData.emotionAfter === 'hopeful') {
    activatedElement = 'Wood';
    strength = 'moderate';
  }

  // If primary element matches, strengthen
  if (activatedElement === primaryElement) {
    strength = strength === 'moderate' ? 'strong' : 'very strong';
  }

  return { element: activatedElement, strength, isPrimary: activatedElement === primaryElement };
}

// ============================================================================
// PILLAR ACTIVATION ANALYSIS
// ============================================================================

/**
 * Analyze which BaZi pillar was affected
 *
 * @param {Object} memoryData - Full memory data
 * @param {Object} baziProfile - User's BaZi profile
 * @returns {Object} Pillar activation analysis
 */
function analyzePillarActivation(memoryData, baziProfile) {
  const content = memoryData.content || '';
  const keywords = memoryData.keywords || [];
  const emotion = memoryData.emotionIntensity || 0;

  let affectedPillar = 'Day';
  let resonance = 0.5;

  // Hour Pillar: Skills/coordination
  const directorSkill = baziProfile?.hour?.directorSkill?.toLowerCase() || '';
  if (directorSkill && (
    keywords.some(k => directorSkill.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(directorSkill)
  )) {
    affectedPillar = 'Hour';
    resonance = 0.75;
  }
  // Year Pillar: Family, ancestry
  else if (keywords.some(k =>
    ['family', 'parent', 'ancestor', 'mother', 'father', 'grandparent'].includes(k?.toLowerCase())
  )) {
    affectedPillar = 'Year';
    resonance = 0.60;
  }
  // Month Pillar: Environment, career
  else if (keywords.some(k =>
    ['environment', 'community', 'work', 'career', 'job'].includes(k?.toLowerCase())
  )) {
    affectedPillar = 'Month';
    resonance = 0.65;
  }
  // Day Pillar: Core self, deep emotions
  else if (emotion >= 7) {
    affectedPillar = 'Day';
    resonance = 0.85;
  }

  return { pillar: affectedPillar, resonance };
}

// ============================================================================
// GIFT ENGAGEMENT ANALYSIS
// ============================================================================

/**
 * Analyze which Oscar role gift was engaged
 *
 * @param {Object} memoryData - Full memory data
 * @param {Object} roles - User's Oscar roles
 * @returns {Object} Gift engagement analysis
 */
function analyzeGiftEngagement(memoryData, roles) {
  if (!roles) {
    return { gift: 'None detected', effectiveness: 0.50, role: 'Background' };
  }

  const content = memoryData.content || '';
  const keywords = memoryData.keywords || [];
  const impact = memoryData.impact;

  // Check Best Actor (Yang gift)
  const bestActorTool = roles.bestActor?.tool?.toLowerCase() || '';
  if (bestActorTool && (
    keywords.some(k => bestActorTool.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(bestActorTool)
  )) {
    return {
      gift: roles.bestActor?.tool,
      effectiveness: impact === 'positive' ? 0.90 : 0.70,
      role: 'Best Actor'
    };
  }

  // Check Best Actress (Yin gift)
  const bestActressTool = roles.bestActress?.tool?.toLowerCase() || '';
  if (bestActressTool && (
    keywords.some(k => bestActressTool.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(bestActressTool)
  )) {
    return {
      gift: roles.bestActress?.tool,
      effectiveness: impact === 'positive' ? 0.88 : 0.68,
      role: 'Best Actress'
    };
  }

  // Check Director (Bridge skill)
  const directorSkill = roles.director?.skill?.toLowerCase() || '';
  if (directorSkill && (
    keywords.some(k => directorSkill.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(directorSkill)
  )) {
    return {
      gift: roles.director?.skill,
      effectiveness: 0.85,
      role: 'Director'
    };
  }

  return { gift: 'None detected', effectiveness: 0.50, role: 'Background' };
}

// ============================================================================
// NEUROCHEMICAL EFFECTIVENESS ANALYSIS
// ============================================================================

/**
 * Analyze neurochemical protocol effectiveness
 *
 * @param {Object} soulData - SOUL section from memory
 * @param {string} primaryElement - User's primary element
 * @returns {Object} Neurochemical analysis
 */
function analyzeNeurochemicalEffectiveness(soulData, primaryElement) {
  const priority = getNeurochemicalPriority(primaryElement || 'Earth');

  const emotion = soulData?.emotionIntensity || 0;
  const vulnerability = soulData?.vulnerability || 0;
  const gratitude = soulData?.gratitude || false;
  const impact = soulData?.impact;

  let primary = priority[0];
  let secondary = priority[1];
  let effectiveness = 0.70;

  // Oxytocin: Safety, bonding
  if (vulnerability >= 6 && impact === 'positive') {
    primary = 'Oxytocin';
    effectiveness = 0.90;
  }
  // Dopamine: Reward, anticipation
  else if (gratitude && emotion >= 7) {
    primary = 'Dopamine';
    effectiveness = 0.88;
  }
  // Serotonin: Recognition, status
  else if (impact === 'validating') {
    primary = 'Serotonin';
    effectiveness = 0.85;
  }
  // Vasopressin: Protection, loyalty
  else if (impact === 'supportive') {
    primary = 'Vasopressin';
    effectiveness = 0.82;
  }

  return { primary, secondary, effectiveness };
}

// ============================================================================
// GENERATE CONSTITUTIONAL NOTES
// ============================================================================

/**
 * Generate human-readable notes
 *
 * @param {Object} analysis - Combined analysis
 * @returns {string} Notes summary
 */
function generateConstitutionalNotes(analysis) {
  const { elementActivation, pillarActivation, giftEngagement, neurochemicalAnalysis } = analysis;
  const notes = [];

  if (elementActivation.strength === 'strong' || elementActivation.strength === 'very strong') {
    notes.push(`${elementActivation.element} element ${elementActivation.strength}ly activated`);
    if (elementActivation.isPrimary) notes.push('Core elemental nature engaged');
  }

  if (pillarActivation.resonance >= 0.80) {
    notes.push(`${pillarActivation.pillar} Pillar deeply resonant`);
  }

  if (giftEngagement.effectiveness >= 0.85) {
    notes.push(`${giftEngagement.gift} (${giftEngagement.role}) highly effective`);
  }

  if (neurochemicalAnalysis.effectiveness >= 0.85) {
    notes.push(`${neurochemicalAnalysis.primary} protocol very effective`);
  }

  return notes.length > 0 ? notes.join('. ') + '.' : 'Standard interaction.';
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Analyze constitutional activation for a memory
 * Called when storing memories to tag with constitutional context
 *
 * @param {Object} constitutional - User's constitutional_identity
 * @param {Object} memoryData - The memory being stored
 * @returns {Object|null} Constitutional activation analysis
 */
function analyzeConstitutionalActivation(constitutional, memoryData) {
  if (!constitutional) return null;

  // Extract primary element
  let primaryElement = 'Earth';
  if (constitutional.bazi?.day_master) {
    const parts = constitutional.bazi.day_master.split(' ');
    primaryElement = parts.length >= 2 ? parts[1] : parts[0];
  } else if (constitutional.chinese?.element) {
    const parts = constitutional.chinese.element.split(' ');
    primaryElement = parts.length >= 2 ? parts[1] : parts[0];
  }

  // Build soulData
  const soulData = memoryData.SOUL || {
    emotionIntensity: memoryData.emotionIntensity || 0,
    vulnerability: memoryData.vulnerability || 0,
    impact: memoryData.impact || null,
    emotionBefore: memoryData.emotionBefore || null,
    emotionAfter: memoryData.emotionAfter || null,
    gratitude: memoryData.gratitude || false
  };

  // Run analyses
  const elementActivation = analyzeElementActivation(soulData, primaryElement);
  const pillarActivation = analyzePillarActivation(memoryData, constitutional.bazi);
  const giftEngagement = analyzeGiftEngagement(memoryData, constitutional.roles);
  const neurochemicalAnalysis = analyzeNeurochemicalEffectiveness(soulData, primaryElement);

  const constitutionalNotes = generateConstitutionalNotes({
    elementActivation, pillarActivation, giftEngagement, neurochemicalAnalysis
  });

  console.log(`🌟 Constitutional: ${elementActivation.element} (${elementActivation.strength}), ${pillarActivation.pillar} Pillar`);

  return {
    elementActivated: elementActivation.element,
    elementStrength: elementActivation.strength,
    isPrimaryElement: elementActivation.isPrimary,
    pillarAffected: pillarActivation.pillar,
    pillarResonance: pillarActivation.resonance,
    giftEngaged: giftEngagement.gift,
    giftRole: giftEngagement.role,
    giftEffectiveness: giftEngagement.effectiveness,
    neurochemical: neurochemicalAnalysis,
    constitutionalNotes
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  analyzeConstitutionalActivation,
  analyzeElementActivation,
  analyzePillarActivation,
  analyzeGiftEngagement,
  analyzeNeurochemicalEffectiveness,
  getNeurochemicalPriority,
  generateConstitutionalNotes
};
