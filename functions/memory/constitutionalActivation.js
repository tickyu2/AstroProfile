/**
 * Constitutional Memory Tagging (Brother Sonnet's Soul Discovery - Task 2)
 *
 * Tag memories with constitutional context for pattern recognition.
 * Analyzes element activation, pillar resonance, gift engagement,
 * and neurochemical effectiveness.
 * Lines ~4014-4353 from the original memoryFunctions.js
 */

// getNeurochemicalPriority is defined in personalitySystem but needed here.
// Lazy-load to avoid circular dependency.
let _getNeurochemicalPriority;
function getNeurochemicalPriority(element) {
  if (!_getNeurochemicalPriority) {
    _getNeurochemicalPriority = require('./personalitySystem').getNeurochemicalPriority;
  }
  return _getNeurochemicalPriority(element);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTIONAL MEMORY TAGGING (Brother Sonnet's Soul Discovery - Task 2)
// Tag memories with constitutional context for pattern recognition
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Analyze which element was activated based on emotional signature
 * @param {Object} soulData - SOUL section from memory data
 * @param {string} primaryElement - User's primary element from constitution
 * @returns {Object} - Element activation analysis
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

  // Earth activation: Grounding, stability (stressed → relieved)
  else if (soulData.emotionBefore === 'stressed' && soulData.emotionAfter === 'relieved') {
    activatedElement = 'Earth';
    strength = 'moderate';
  }

  // Metal activation: Clarity, precision
  else if (impact === 'clarifying' || vulnerabilityLevel < 3) {
    activatedElement = 'Metal';
    strength = primaryElement === 'Metal' ? 'strong' : 'moderate';
  }

  // Wood activation: Growth, learning, forward movement
  else if (impact === 'transformative' || soulData.emotionAfter === 'hopeful') {
    activatedElement = 'Wood';
    strength = 'moderate';
  }

  // If primary element matches activated, strengthen
  if (activatedElement === primaryElement) {
    strength = strength === 'moderate' ? 'strong' : 'very strong';
  }

  return {
    element: activatedElement,
    strength,
    isPrimary: activatedElement === primaryElement
  };
}

/**
 * Analyze which pillar was affected
 * @param {Object} memoryData - Full memory data
 * @param {Object} baziProfile - User's BaZi profile
 * @returns {Object} - Pillar activation analysis
 */
function analyzePillarActivation(memoryData, baziProfile) {
  // Year Pillar (5%): Ancestral, generational themes
  // Month Pillar (10%): Seasonal, environmental context
  // Day Pillar (70%): Core identity, essence
  // Hour Pillar (15%): Skills, coordination

  const content = memoryData.content || memoryData.WHAT?.event || '';
  const keywords = memoryData.keywords || memoryData.WHAT?.keywords || [];
  const emotion = memoryData.emotionIntensity || memoryData.SOUL?.emotionIntensity || 0;

  let affectedPillar = 'Day';  // Default to core identity (70%)
  let resonance = 0.5;

  // Hour Pillar: Skills/coordination in use
  const directorSkill = baziProfile?.hour?.directorSkill?.toLowerCase() ||
                        baziProfile?.hour_pillar?.toLowerCase() || '';
  if (directorSkill && (
    keywords.some(k => directorSkill.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(directorSkill)
  )) {
    affectedPillar = 'Hour';
    resonance = 0.75;
  }

  // Year Pillar: Family, ancestry, generational
  else if (keywords.some(k =>
    ['family', 'parent', 'ancestor', 'generation', 'mother', 'father', 'grandparent'].includes(k?.toLowerCase())
  )) {
    affectedPillar = 'Year';
    resonance = 0.60;
  }

  // Month Pillar: Environment, season, context
  else if (keywords.some(k =>
    ['environment', 'community', 'season', 'culture', 'work', 'career', 'job'].includes(k?.toLowerCase())
  )) {
    affectedPillar = 'Month';
    resonance = 0.65;
  }

  // Day Pillar: Core self, deep emotions, identity
  else if (emotion >= 7) {
    affectedPillar = 'Day';
    resonance = 0.85;
  }

  return {
    pillar: affectedPillar,
    resonance
  };
}

/**
 * Analyze which gift (Oscar role) was engaged
 * @param {Object} memoryData - Full memory data
 * @param {Object} roles - User's Oscar roles (bestActor, bestActress, director)
 * @returns {Object} - Gift engagement analysis
 */
function analyzeGiftEngagement(memoryData, roles) {
  if (!roles) {
    return { gift: 'None detected', effectiveness: 0.50, role: 'Background' };
  }

  const content = memoryData.content || memoryData.WHAT?.event || '';
  const keywords = memoryData.keywords || memoryData.WHAT?.keywords || [];
  const impact = memoryData.impact || memoryData.SOUL?.impact;

  // Check Best Actor (Yang gift)
  const bestActorTool = roles.bestActor?.tool?.toLowerCase() || roles.best_actor?.toLowerCase() || '';
  if (bestActorTool && (
    keywords.some(k => bestActorTool.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(bestActorTool)
  )) {
    return {
      gift: roles.bestActor?.tool || roles.best_actor,
      effectiveness: impact === 'positive' ? 0.90 : 0.70,
      role: 'Best Actor'
    };
  }

  // Check Best Actress (Yin gift)
  const bestActressTool = roles.bestActress?.tool?.toLowerCase() || roles.best_actress?.toLowerCase() || '';
  if (bestActressTool && (
    keywords.some(k => bestActressTool.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(bestActressTool)
  )) {
    return {
      gift: roles.bestActress?.tool || roles.best_actress,
      effectiveness: impact === 'positive' ? 0.88 : 0.68,
      role: 'Best Actress'
    };
  }

  // Check Director (Bridge skill)
  const directorSkill = roles.director?.skill?.toLowerCase() || roles.director_skill?.toLowerCase() || '';
  if (directorSkill && (
    keywords.some(k => directorSkill.includes(k?.toLowerCase())) ||
    content.toLowerCase().includes(directorSkill)
  )) {
    return {
      gift: roles.director?.skill || roles.director_skill,
      effectiveness: 0.85,
      role: 'Director'
    };
  }

  return {
    gift: 'None detected',
    effectiveness: 0.50,
    role: 'Background'
  };
}

/**
 * Analyze neurochemical protocol effectiveness
 * @param {Object} soulData - SOUL section from memory
 * @param {string} primaryElement - User's primary element
 * @returns {Object} - Neurochemical analysis
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

  return {
    primary,
    secondary,
    effectiveness
  };
}

/**
 * Generate constitutional notes summary
 * @param {Object} analysis - Combined analysis results
 * @returns {string} - Human-readable notes
 */
function generateConstitutionalNotes(analysis) {
  const { elementActivation, pillarActivation, giftEngagement, neurochemicalAnalysis } = analysis;

  const notes = [];

  // Element notes
  if (elementActivation.strength === 'strong' || elementActivation.strength === 'very strong') {
    notes.push(`${elementActivation.element} element ${elementActivation.strength}ly activated`);

    if (elementActivation.isPrimary) {
      notes.push('Core elemental nature engaged');
    }
  }

  // Pillar notes
  if (pillarActivation.resonance >= 0.80) {
    notes.push(`${pillarActivation.pillar} Pillar deeply resonant (${Math.round(pillarActivation.resonance * 100)}%)`);
  }

  // Gift notes
  if (giftEngagement.effectiveness >= 0.85) {
    notes.push(`${giftEngagement.gift} (${giftEngagement.role}) highly effective`);
  }

  // Neurochemical notes
  if (neurochemicalAnalysis.effectiveness >= 0.85) {
    notes.push(`${neurochemicalAnalysis.primary} protocol very effective`);
  }

  return notes.length > 0 ? notes.join('. ') + '.' : 'Standard interaction.';
}

/**
 * Main function: Analyze constitutional activation for a memory
 * Called when storing memories to tag with constitutional context
 *
 * @param {Object} constitutional - User's constitutional_identity from profile
 * @param {Object} memoryData - The memory being stored
 * @returns {Object|null} - Constitutional activation analysis or null if no constitutional data
 */
function analyzeConstitutionalActivation(constitutional, memoryData) {
  if (!constitutional) {
    return null;
  }

  // Extract primary element from BaZi Day Master
  let primaryElement = 'Earth';
  if (constitutional.bazi?.day_master) {
    const parts = constitutional.bazi.day_master.split(' ');
    primaryElement = parts.length >= 2 ? parts[1] : parts[0];
  } else if (constitutional.chinese?.element) {
    const parts = constitutional.chinese.element.split(' ');
    primaryElement = parts.length >= 2 ? parts[1] : parts[0];
  }

  // Build soulData from memory
  const soulData = memoryData.SOUL || {
    emotionIntensity: memoryData.emotionIntensity || 0,
    vulnerability: memoryData.vulnerability || 0,
    impact: memoryData.impact || null,
    emotionBefore: memoryData.emotionBefore || null,
    emotionAfter: memoryData.emotionAfter || null,
    gratitude: memoryData.gratitude || false
  };

  // Run all analyses
  const elementActivation = analyzeElementActivation(soulData, primaryElement);
  const pillarActivation = analyzePillarActivation(memoryData, constitutional.bazi);
  const giftEngagement = analyzeGiftEngagement(memoryData, constitutional.roles);
  const neurochemicalAnalysis = analyzeNeurochemicalEffectiveness(soulData, primaryElement);

  // Generate notes
  const constitutionalNotes = generateConstitutionalNotes({
    elementActivation,
    pillarActivation,
    giftEngagement,
    neurochemicalAnalysis
  });

  console.log(`[MemoryFunctions] 🌟 Constitutional activation: ${elementActivation.element} (${elementActivation.strength}), ${pillarActivation.pillar} Pillar`);

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

// Export constitutional analysis functions
module.exports = {
  analyzeConstitutionalActivation,
  analyzeElementActivation,
  analyzePillarActivation,
  analyzeGiftEngagement,
  analyzeNeurochemicalEffectiveness,
  generateConstitutionalNotes
};
