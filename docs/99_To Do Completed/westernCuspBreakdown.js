/**
 * westernCuspBreakdown.js
 * 
 * Detailed breakdown analysis for Western zodiac cusp compatibility
 * Provides scoring explanations and challenge identification
 * 
 * For Brother Opus - GENESIS Platform
 * By Brother Sonnet, December 23, 2025
 */

// ============================================================================
// DETAILED CUSP BREAKDOWN CALCULATION
// ============================================================================

/**
 * Calculate detailed compatibility breakdown with explanations
 * @param {Object} userCusp - User's cusp object
 * @param {Object} partnerCusp - Partner's cusp object
 * @returns {Object} - Detailed breakdown with explanations
 */
export function calculateCuspBreakdown(userCusp, partnerCusp) {
  // Calculate each component with explanations
  const breakdown = {
    // Element compatibility
    ...analyzeElements(userCusp, partnerCusp),
    
    // Quality/Modality compatibility
    ...analyzeQuality(userCusp, partnerCusp),
    
    // Ruler compatibility
    ...analyzeRulers(userCusp, partnerCusp),
    
    // Cusp type
    ...analyzeCuspType(userCusp, partnerCusp),
    
    // Mutual influence
    ...analyzeMutualInfluence(userCusp, partnerCusp),
    
    // Aspect
    ...analyzeAspect(userCusp, partnerCusp),
    
    // Strengths
    strengths: identifyStrengths(userCusp, partnerCusp)
  };
  
  // Calculate raw total
  breakdown.rawTotal = 
    breakdown.element +
    breakdown.secondary +
    breakdown.quality +
    breakdown.rulers +
    breakdown.type +
    breakdown.influence +
    breakdown.aspect;
  
  breakdown.finalScore = Math.min(100, breakdown.rawTotal);
  
  return breakdown;
}

// ============================================================================
// ELEMENT ANALYSIS
// ============================================================================

function analyzeElements(userCusp, partnerCusp) {
  const u = userCusp.element;
  const p = partnerCusp.element;
  
  // Primary element scoring
  const elementScores = {
    'Fire-Fire': { score: 35, explanation: 'Same element - passionate energy, but can compete for dominance' },
    'Fire-Air': { score: 30, explanation: 'Air feeds Fire - highly stimulating and energizing match' },
    'Fire-Earth': { score: 20, explanation: 'Earth grounds Fire - stabilizing but can feel limiting' },
    'Fire-Water': { score: 10, explanation: 'Water extinguishes Fire - challenging tension requiring work' },
    'Earth-Earth': { score: 35, explanation: 'Same element - stable, secure, grounded partnership' },
    'Earth-Water': { score: 30, explanation: 'Water nourishes Earth - deeply harmonious and supportive' },
    'Earth-Air': { score: 15, explanation: 'Air erodes Earth - intellectual stimulation but lacks grounding' },
    'Air-Air': { score: 35, explanation: 'Same element - mentally stimulating but may lack emotional depth' },
    'Air-Water': { score: 15, explanation: 'Water dampens Air - emotional depth but potential confusion' },
    'Water-Water': { score: 35, explanation: 'Same element - deep emotional understanding and intuition' }
  };
  
  const key = `${u.primary}-${p.primary}`;
  const reverseKey = `${p.primary}-${u.primary}`;
  const elementData = elementScores[key] || elementScores[reverseKey] || { score: 15, explanation: 'Moderate elemental compatibility' };
  
  // Secondary element bonus
  let secondaryScore = 0;
  let secondaryExplanation = '';
  
  if (u.secondary && p.secondary) {
    if (u.secondary === p.secondary) {
      secondaryScore = 8;
      secondaryExplanation = `Both have ${u.secondary} secondary - deep understanding of cusp duality`;
    } else {
      const secKey = `${u.secondary}-${p.secondary}`;
      const secScores = {
        'Fire-Air': 5, 'Air-Fire': 5,
        'Earth-Water': 5, 'Water-Earth': 5
      };
      secondaryScore = secScores[secKey] || 2;
      secondaryExplanation = secondaryScore === 5 
        ? 'Compatible secondary elements - complementary blend energies'
        : 'Different secondary influences - adds complexity to relationship';
    }
  }
  
  return {
    element: elementData.score,
    elementExplanation: elementData.explanation,
    secondary: secondaryScore,
    secondaryExplanation: secondaryExplanation
  };
}

// ============================================================================
// QUALITY/MODALITY ANALYSIS
// ============================================================================

function analyzeQuality(userCusp, partnerCusp) {
  const qualities = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
  };
  
  const userQuality = qualities[userCusp.sign];
  const partnerQuality = qualities[partnerCusp.sign];
  
  const qualityData = {
    'Cardinal-Cardinal': { 
      score: 25, 
      explanation: 'Both initiators - natural leaders who may compete but understand ambition' 
    },
    'Cardinal-Fixed': { 
      score: 20, 
      explanation: 'Cardinal initiates, Fixed sustains - complementary partnership of starter + finisher' 
    },
    'Cardinal-Mutable': { 
      score: 20, 
      explanation: 'Cardinal leads, Mutable adapts - flexible dynamic with clear direction' 
    },
    'Fixed-Fixed': { 
      score: 15, 
      explanation: 'Both stubborn - power struggles possible but incredible loyalty once committed' 
    },
    'Fixed-Mutable': { 
      score: 25, 
      explanation: 'Fixed grounds, Mutable flows - balanced dynamic of stability + adaptability' 
    },
    'Mutable-Mutable': { 
      score: 20, 
      explanation: 'Both flexible - adaptable and understanding but may lack direction together' 
    }
  };
  
  const key = `${userQuality}-${partnerQuality}`;
  const reverseKey = `${partnerQuality}-${userQuality}`;
  const data = qualityData[key] || qualityData[reverseKey] || { score: 15, explanation: 'Moderate quality compatibility' };
  
  return {
    userQuality,
    partnerQuality,
    quality: data.score,
    qualityExplanation: data.explanation
  };
}

// ============================================================================
// RULER ANALYSIS
// ============================================================================

function analyzeRulers(userCusp, partnerCusp) {
  const userRulers = userCusp.rulers || [];
  const partnerRulers = partnerCusp.rulers || [];
  
  const sharedRulers = userRulers.filter(r => partnerRulers.includes(r));
  
  let score = 0;
  let explanation = '';
  
  if (sharedRulers.length > 0) {
    score = 20;
    explanation = `Shared ruler: ${sharedRulers.join(', ')} - natural understanding and alignment`;
  } else {
    // Check ruler groups
    const groups = {
      personal: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'],
      social: ['Jupiter', 'Saturn'],
      transpersonal: ['Uranus', 'Neptune', 'Pluto']
    };
    
    const userInPersonal = userRulers.some(r => groups.personal.includes(r));
    const partnerInPersonal = partnerRulers.some(r => groups.personal.includes(r));
    
    if (userInPersonal && partnerInPersonal) {
      score = 15;
      explanation = 'Rulers in personal planet group - compatible energy levels and needs';
    } else {
      score = 10;
      explanation = 'Different planetary ruler groups - diverse but workable energies';
    }
  }
  
  return {
    rulers: score,
    rulersExplanation: explanation
  };
}

// ============================================================================
// CUSP TYPE ANALYSIS
// ============================================================================

function analyzeCuspType(userCusp, partnerCusp) {
  const userType = userCusp.type;
  const partnerType = partnerCusp.type;
  
  let score = 0;
  let explanation = '';
  
  if (userType === 'pure' && partnerType === 'pure') {
    score = 10;
    explanation = 'Both pure signs - clear, focused energies that understand simplicity';
  } else if (userType !== 'pure' && partnerType !== 'pure') {
    score = 8;
    explanation = 'Both cusps - understand duality and complexity of blended energies';
  } else {
    score = 5;
    explanation = 'Pure + Cusp - different approaches but can learn from each other';
  }
  
  return {
    type: score,
    typeExplanation: explanation
  };
}

// ============================================================================
// MUTUAL INFLUENCE ANALYSIS
// ============================================================================

function analyzeMutualInfluence(userCusp, partnerCusp) {
  let score = 0;
  let detail = '';
  let explanation = '';
  
  const userInfluence = userCusp.influencedBy;
  const partnerInfluence = partnerCusp.influencedBy;
  
  // MIRROR CUSPS (highest bonus)
  if (userInfluence && partnerInfluence) {
    if (userInfluence === partnerCusp.sign && partnerInfluence === userCusp.sign) {
      score = 12;
      detail = `Mirror cusps: ${userCusp.sign}→${userInfluence} ↔ ${partnerCusp.sign}→${partnerInfluence}`;
      explanation = '🌟 RARE MIRROR CONFIGURATION - perfect inverse that creates 85% constitutional overlap!';
      return { influence: score, influenceDetail: detail, influenceExplanation: explanation };
    }
  }
  
  // BRIDGE CONNECTION
  if (userInfluence === partnerCusp.sign || partnerInfluence === userCusp.sign) {
    score = 6;
    if (userInfluence === partnerCusp.sign) {
      detail = `${userCusp.sign}→${userInfluence} bridges with ${partnerCusp.sign}`;
    } else {
      detail = `${partnerCusp.sign}→${partnerInfluence} bridges with ${userCusp.sign}`;
    }
    explanation = 'Natural bridge connection - one cusp flows toward the other\'s sign';
    return { influence: score, influenceDetail: detail, influenceExplanation: explanation };
  }
  
  // SHARED INFLUENCE
  if (userInfluence && partnerInfluence && userInfluence === partnerInfluence) {
    score = 4;
    detail = `Both influenced by ${userInfluence}`;
    explanation = 'Shared influence - both carry energy of the same sign';
    return { influence: score, influenceDetail: detail, influenceExplanation: explanation };
  }
  
  // No special influence
  return { 
    influence: 0, 
    influenceDetail: 'No special influence connection',
    influenceExplanation: ''
  };
}

// ============================================================================
// ASPECT ANALYSIS
// ============================================================================

function analyzeAspect(userCusp, partnerCusp) {
  const positions = {
    Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
    Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11
  };
  
  const pos1 = positions[userCusp.sign];
  const pos2 = positions[partnerCusp.sign];
  const diff = Math.abs(pos1 - pos2);
  const aspect = Math.min(diff, 12 - diff);
  
  const aspectData = {
    0: { name: 'Conjunction', score: 5, explanation: 'Same sign - intense mirror energy, very similar natures' },
    2: { name: 'Sextile (60°)', score: 10, explanation: 'Harmonious aspect - cooperative and supportive energies' },
    3: { name: 'Square (90°)', score: -10, explanation: 'Challenging aspect - friction that requires conscious work' },
    4: { name: 'Trine (120°)', score: 15, explanation: 'Highly harmonious - effortless flow and natural understanding' },
    6: { name: 'Opposition (180°)', score: 8, explanation: 'Magnetic polarity - opposite but complementary energies' }
  };
  
  const data = aspectData[aspect] || { name: 'Minor aspect', score: 0, explanation: 'Neutral influence' };
  
  return {
    aspect: data.score,
    aspectName: data.name,
    aspectExplanation: data.explanation
  };
}

// ============================================================================
// IDENTIFY STRENGTHS
// ============================================================================

function identifyStrengths(userCusp, partnerCusp) {
  const strengths = [];
  
  // Element strengths
  const elemKey = `${userCusp.element.primary}-${partnerCusp.element.primary}`;
  const reverseKey = `${partnerCusp.element.primary}-${userCusp.element.primary}`;
  
  if (['Earth-Water', 'Water-Earth'].includes(elemKey) || ['Earth-Water', 'Water-Earth'].includes(reverseKey)) {
    strengths.push('Deep emotional nourishment and practical support');
  }
  if (['Fire-Air', 'Air-Fire'].includes(elemKey) || ['Fire-Air', 'Air-Fire'].includes(reverseKey)) {
    strengths.push('Exciting mental stimulation and dynamic energy exchange');
  }
  if (userCusp.element.primary === partnerCusp.element.primary) {
    strengths.push('Shared elemental perspective creates natural understanding');
  }
  
  // Secondary element bonus
  if (userCusp.element.secondary && partnerCusp.element.secondary) {
    if (userCusp.element.secondary === partnerCusp.element.secondary) {
      strengths.push('Both understand the complexity of cusp duality');
    }
  }
  
  // Shared rulers
  const sharedRulers = (userCusp.rulers || []).filter(r => (partnerCusp.rulers || []).includes(r));
  if (sharedRulers.length > 0) {
    strengths.push(`Natural alignment through shared ${sharedRulers.join(' and ')} influence`);
  }
  
  // Quality complementarity
  const qualities = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
  };
  
  const uq = qualities[userCusp.sign];
  const pq = qualities[partnerCusp.sign];
  
  if (uq === 'Fixed' && pq === 'Mutable') {
    strengths.push('Stability meets flexibility - balanced dynamic');
  } else if (uq === 'Cardinal' && pq === 'Fixed') {
    strengths.push('Initiator + Sustainer = projects that start AND finish');
  } else if (uq === 'Cardinal' && pq === 'Mutable') {
    strengths.push('Leader + Adapter = flexible achievement');
  }
  
  return strengths;
}

// ============================================================================
// CHALLENGE DETECTION
// ============================================================================

/**
 * Identify potential challenges and growth areas
 * @param {Object} userCusp - User's cusp object
 * @param {Object} partnerCusp - Partner's cusp object
 * @param {Object} breakdown - Compatibility breakdown
 * @returns {Array} - Array of challenge objects
 */
export function getCuspChallenges(userCusp, partnerCusp, breakdown) {
  const challenges = [];
  
  // Element challenges
  const elemKey = `${userCusp.element.primary}-${partnerCusp.element.primary}`;
  
  if (['Fire-Water', 'Water-Fire'].includes(elemKey)) {
    challenges.push({
      severity: 'high',
      title: 'Fire-Water Tension',
      description: 'Fire and Water elements create steam - passion meets emotion in volatile ways. One partner may feel extinguished while the other feels smothered.',
      solution: 'Give each other space for individual expression. Fire needs freedom, Water needs emotional safety.'
    });
  }
  
  if (['Fire-Earth', 'Earth-Fire'].includes(elemKey)) {
    challenges.push({
      severity: 'medium',
      title: 'Speed Mismatch',
      description: 'Fire moves fast and impulsively while Earth moves slow and deliberately. Can lead to frustration on both sides.',
      solution: 'Fire: practice patience. Earth: embrace some spontaneity. Meet in the middle.'
    });
  }
  
  if (['Air-Water', 'Water-Air'].includes(elemKey)) {
    challenges.push({
      severity: 'medium',
      title: 'Head vs Heart',
      description: 'Air thinks logically, Water feels deeply. Communication styles differ - one intellectualizes, one processes emotionally.',
      solution: 'Validate each other\'s approach. Air: honor feelings. Water: appreciate logic.'
    });
  }
  
  if (['Earth-Air', 'Air-Earth'].includes(elemKey)) {
    challenges.push({
      severity: 'medium',
      title: 'Grounding vs Freedom',
      description: 'Earth seeks stability and routine while Air craves variety and mental stimulation. Can feel restrictive vs irresponsible.',
      solution: 'Create structure with flexibility. Earth provides foundation, Air brings adventure.'
    });
  }
  
  // Quality/Modality challenges
  const qualities = {
    Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
    Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
    Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
  };
  
  const uq = qualities[userCusp.sign];
  const pq = qualities[partnerCusp.sign];
  
  if (uq === 'Fixed' && pq === 'Fixed') {
    challenges.push({
      severity: 'medium',
      title: 'Double Stubbornness',
      description: 'Both Fixed signs can be incredibly stubborn. When you disagree, neither wants to budge. Power struggles are likely.',
      solution: 'Practice compromise before conflicts escalate. Agree to disagree gracefully.'
    });
  }
  
  if (uq === 'Cardinal' && pq === 'Cardinal') {
    challenges.push({
      severity: 'low',
      title: 'Leadership Competition',
      description: 'Both want to lead and initiate. Can compete for control rather than collaborate.',
      solution: 'Divide responsibilities. Let each person lead in their area of expertise.'
    });
  }
  
  if (uq === 'Mutable' && pq === 'Mutable') {
    challenges.push({
      severity: 'low',
      title: 'Lack of Direction',
      description: 'Both are flexible and adaptable, but who makes decisions? Relationship may lack structure.',
      solution: 'Create intentional structure. Schedule regular check-ins for direction-setting.'
    });
  }
  
  // Aspect challenges
  if (breakdown.aspect < 0) {
    challenges.push({
      severity: 'high',
      title: 'Challenging Aspect (Square)',
      description: 'Your signs form a 90° square aspect - creates natural friction and tension. Growth through challenge.',
      solution: 'View conflicts as opportunities to understand each other better. This aspect builds strength.'
    });
  }
  
  // Secondary element conflicts
  if (userCusp.element.secondary && partnerCusp.element.secondary) {
    const secKey = `${userCusp.element.secondary}-${partnerCusp.element.secondary}`;
    if (['Fire-Water', 'Water-Fire', 'Air-Earth', 'Earth-Air'].includes(secKey)) {
      challenges.push({
        severity: 'low',
        title: 'Secondary Element Conflict',
        description: `Your secondary influences (${userCusp.element.secondary} and ${partnerCusp.element.secondary}) create additional complexity in the relationship dynamic.`,
        solution: 'Recognize this as adding depth, not just difficulty. The blend creates uniqueness.'
      });
    }
  }
  
  // Cusp type challenges
  if (userCusp.type === 'pure' && partnerCusp.type !== 'pure') {
    challenges.push({
      severity: 'low',
      title: 'Pure vs Cusp Perspective',
      description: 'One partner sees things clearly (pure sign) while the other sees multiple perspectives (cusp). Can feel like speaking different languages.',
      solution: 'Pure sign: embrace complexity. Cusp: appreciate simplicity. Both perspectives have value.'
    });
  }
  
  return challenges;
}

export default {
  calculateCuspBreakdown,
  getCuspChallenges
};
