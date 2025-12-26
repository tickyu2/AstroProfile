/**
 * westernCuspBreakdown_ENHANCED.js
 *
 * ENHANCED with Complete Theoretical Foundation
 * 
 * Builds on Brother Opus's excellent UI work
 * Adds: Theory, formulas, derivations - NO BLACK BOXES!
 * 
 * For GENESIS Platform - Western Zodiac Module
 * By Brother Sonnet, December 23, 2025
 * Building on Brother Opus's foundation
 */

import { 
  getElementCompatibility,
  calculateElementScore,
  getCompatibilityTable,
  ELEMENT_RELATIONSHIPS 
} from './elementCompatibilityMatrix';

// ============================================================================
// MAIN BREAKDOWN FUNCTION (Enhanced with Theory)
// ============================================================================

export function calculateCuspBreakdown(userCusp, partnerCusp) {
  // Calculate each component with THEORY
  const breakdown = {
    // Element compatibility (ENHANCED!)
    ...analyzeElementsWithTheory(userCusp, partnerCusp),

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
// ELEMENT ANALYSIS (ENHANCED WITH COMPLETE THEORY!)
// ============================================================================

function analyzeElementsWithTheory(userCusp, partnerCusp) {
  const userElement = userCusp.element.primary;
  const partnerElement = partnerCusp.element.primary;
  
  // GET COMPLETE THEORY (eliminates black boxes!)
  const compatibility = getElementCompatibility(userElement, partnerElement);
  const scoreData = calculateElementScore(userElement, partnerElement, 35);
  
  // Secondary element handling
  let secondaryScore = 0;
  let secondaryExplanation = '';
  let secondaryTheory = null;
  
  if (userCusp.element.secondary && partnerCusp.element.secondary) {
    const secCompatibility = getElementCompatibility(
      userCusp.element.secondary,
      partnerCusp.element.secondary
    );
    const secScoreData = calculateElementScore(
      userCusp.element.secondary,
      partnerCusp.element.secondary,
      8
    );
    
    secondaryScore = secScoreData.totalScore;
    secondaryExplanation = secCompatibility.description;
    secondaryTheory = secCompatibility;
  }
  
  return {
    // SCORES (Brother Opus's display needs these)
    element: scoreData.totalScore,
    elementExplanation: compatibility.description,
    elementInteraction: compatibility.interactionType,
    
    // INDIVIDUAL CONTRIBUTIONS (for dual bar display)
    userElement,
    partnerElement,
    userElementContribution: scoreData.person1Score,
    partnerElementContribution: scoreData.person2Score,
    
    // SECONDARY
    secondary: secondaryScore,
    secondaryExplanation,
    userSecondary: userCusp.element.secondary || null,
    partnerSecondary: partnerCusp.element.secondary || null,
    
    // NEW! COMPLETE THEORY (eliminates all black boxes!)
    elementTheory: {
      // THE RELATIONSHIP
      relationshipType: compatibility.relationshipType,
      relationshipName: compatibility.relationshipName,
      interactionType: compatibility.interactionType,
      
      // THE SCORE (with source!)
      score: compatibility.score,
      scorePercent: compatibility.scorePercent,
      
      // THE THEORY (the "why")
      description: compatibility.description,
      theory: compatibility.theory,
      reasoning: compatibility.reasoning,
      naturalExample: compatibility.naturalExample,
      psychologicalMeaning: compatibility.psychologicalMeaning,
      
      // THE FORMULA (the "how")
      formula: compatibility.formula,
      derivation: compatibility.derivation,
      
      // THE PRACTICAL (the "so what")
      strengths: compatibility.strengths,
      challenges: compatibility.challenges,
      examples: compatibility.examples,
      note: compatibility.note,
      
      // COMPLETE COMPATIBILITY TABLE (for "where does 86% come from?")
      compatibilityTable: getCompatibilityTable(),
      
      // CALCULATION BREAKDOWN (separate paths!)
      calculation: {
        maxPoints: 35,
        basePerPerson: 17.5,
        
        // YOUR CALCULATION PATH
        yourPath: {
          step1: `Your element: ${userElement}`,
          step2: `Base allocation: 35 pts ÷ 2 = 17.5 pts`,
          step3: `Partner element: ${partnerElement}`,
          step4: `Relationship type: ${compatibility.relationshipName}`,
          step5: `Compatibility score: ${compatibility.scorePercent}`,
          step6: `Formula: 17.5 pts × ${compatibility.score}`,
          step7: `Your contribution: ${scoreData.person1Score} pts (50%)`
        },
        
        // PARTNER'S CALCULATION PATH
        partnerPath: {
          step1: `Partner element: ${partnerElement}`,
          step2: `Base allocation: 35 pts ÷ 2 = 17.5 pts`,
          step3: `Your element: ${userElement}`,
          step4: `Relationship type: ${compatibility.relationshipName}`,
          step5: `Compatibility score: ${compatibility.scorePercent}`,
          step6: `Formula: 17.5 pts × ${compatibility.score}`,
          step7: `Partner contribution: ${scoreData.person2Score} pts (50%)`
        },
        
        // COMBINED
        combined: {
          yourPoints: scoreData.person1Score,
          partnerPoints: scoreData.person2Score,
          formula: `${scoreData.person1Score} + ${scoreData.person2Score}`,
          total: scoreData.totalScore,
          percentage: Math.round((scoreData.totalScore / 35) * 100) + '%'
        }
      }
    },
    
    // SECONDARY THEORY (if applicable)
    secondaryTheory: secondaryTheory ? {
      relationshipType: secondaryTheory.relationshipType,
      relationshipName: secondaryTheory.relationshipName,
      score: secondaryTheory.score,
      scorePercent: secondaryTheory.scorePercent,
      description: secondaryTheory.description
    } : null
  };
}

// ============================================================================
// QUALITY ANALYSIS (Keep Brother Opus's original, works well!)
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
      interaction: 'synergy',
      explanation: 'Both initiators - natural leaders who may compete but understand ambition'
    },
    'Cardinal-Fixed': {
      score: 20,
      interaction: 'complement',
      explanation: 'Cardinal initiates, Fixed sustains - complementary partnership of starter + finisher'
    },
    'Cardinal-Mutable': {
      score: 20,
      interaction: 'complement',
      explanation: 'Cardinal leads, Mutable adapts - flexible dynamic with clear direction'
    },
    'Fixed-Fixed': {
      score: 15,
      interaction: 'friction',
      explanation: 'Both stubborn - power struggles possible but incredible loyalty once committed'
    },
    'Fixed-Mutable': {
      score: 25,
      interaction: 'boost',
      explanation: 'Fixed grounds, Mutable flows - balanced dynamic of stability + adaptability'
    },
    'Mutable-Mutable': {
      score: 20,
      interaction: 'synergy',
      explanation: 'Both flexible - adaptable and understanding but may lack direction together'
    }
  };

  const key = `${userQuality}-${partnerQuality}`;
  const reverseKey = `${partnerQuality}-${userQuality}`;
  const data = qualityData[key] || qualityData[reverseKey] || { 
    score: 15, 
    interaction: 'neutral', 
    explanation: 'Moderate quality compatibility' 
  };

  return {
    userQuality,
    partnerQuality,
    quality: data.score,
    qualityExplanation: data.explanation,
    qualityInteraction: data.interaction,
    userQualityContribution: Math.round(data.score / 2),
    partnerQualityContribution: Math.round(data.score / 2) + (data.score % 2)
  };
}

// ============================================================================
// RULERS ANALYSIS (Keep Brother Opus's original)
// ============================================================================

function analyzeRulers(userCusp, partnerCusp) {
  const rulers = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: ['Mars', 'Pluto'],
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: ['Saturn', 'Uranus'],
    Pisces: ['Jupiter', 'Neptune']
  };

  const userRulers = Array.isArray(rulers[userCusp.sign]) 
    ? rulers[userCusp.sign] 
    : [rulers[userCusp.sign]];
    
  const partnerRulers = Array.isArray(rulers[partnerCusp.sign]) 
    ? rulers[partnerCusp.sign] 
    : [rulers[partnerCusp.sign]];

  const sharedRulers = userRulers.filter(r => partnerRulers.includes(r));
  
  let rulersScore = 0;
  let rulersExplanation = '';
  let rulersInteraction = 'neutral';

  if (sharedRulers.length > 0) {
    rulersScore = 20;
    rulersInteraction = 'synergy';
    rulersExplanation = `Shared ruler ${sharedRulers.join(', ')} - natural understanding and alignment`;
  } else {
    const compatiblePairs = {
      'Sun-Moon': 15, 'Venus-Mars': 15, 'Mercury-Venus': 10,
      'Jupiter-Venus': 10, 'Moon-Venus': 12
    };
    
    for (const userRuler of userRulers) {
      for (const partnerRuler of partnerRulers) {
        const key = `${userRuler}-${partnerRuler}`;
        const reverseKey = `${partnerRuler}-${userRuler}`;
        const score = compatiblePairs[key] || compatiblePairs[reverseKey];
        
        if (score && score > rulersScore) {
          rulersScore = score;
          rulersInteraction = 'complement';
          rulersExplanation = `${userRuler} and ${partnerRuler} - compatible energy levels and needs`;
        }
      }
    }
    
    if (rulersScore === 0) {
      rulersScore = 5;
      rulersExplanation = 'Different planetary rulers - diverse but workable energies';
    }
  }

  return {
    userRulers: userRulers.join(', '),
    partnerRulers: partnerRulers.join(', '),
    rulers: rulersScore,
    rulersExplanation,
    rulersInteraction,
    sharedRulers: sharedRulers.length > 0 ? sharedRulers.join(', ') : 'None',
    userRulersContribution: Math.round(rulersScore / 2),
    partnerRulersContribution: Math.round(rulersScore / 2) + (rulersScore % 2)
  };
}

// ============================================================================
// CUSP TYPE ANALYSIS (Keep Brother Opus's original)
// ============================================================================

function analyzeCuspType(userCusp, partnerCusp) {
  const userType = userCusp.type || 'pure';
  const partnerType = partnerCusp.type || 'pure';

  let typeScore = 0;
  let typeExplanation = '';
  let typeInteraction = 'neutral';

  if (userType === partnerType) {
    if (userType === 'blend-forward' || userType === 'blend-back') {
      typeScore = 10;
      typeInteraction = 'synergy';
      typeExplanation = 'Both cusps - mutual understanding of duality and complexity';
    } else {
      typeScore = 8;
      typeInteraction = 'synergy';
      typeExplanation = 'Both pure signs - straightforward and direct energy';
    }
  } else {
    typeScore = 5;
    typeInteraction = 'complement';
    typeExplanation = userType === 'pure' || partnerType === 'pure'
      ? 'Pure and cusp - simplicity meets complexity'
      : 'Different cusp types - varied but interesting blend energies';
  }

  return {
    userType,
    partnerType,
    type: typeScore,
    typeExplanation,
    typeInteraction,
    userTypeContribution: Math.round(typeScore / 2),
    partnerTypeContribution: Math.round(typeScore / 2) + (typeScore % 2)
  };
}

// ============================================================================
// MUTUAL INFLUENCE ANALYSIS (Keep Brother Opus's original)
// ============================================================================

function analyzeMutualInfluence(userCusp, partnerCusp) {
  const userSigns = [userCusp.sign, userCusp.secondarySign].filter(Boolean);
  const partnerSigns = [partnerCusp.sign, partnerCusp.secondarySign].filter(Boolean);

  const sharedSigns = userSigns.filter(s => partnerSigns.includes(s));

  let influenceScore = 0;
  let influenceExplanation = '';
  let influenceInteraction = 'neutral';

  if (sharedSigns.length > 0) {
    influenceScore = 15;
    influenceInteraction = 'shared';
    influenceExplanation = `Shared sign ${sharedSigns.join(', ')} - direct energetic understanding and resonance`;
  } else if (userCusp.secondarySign && partnerCusp.secondarySign) {
    influenceScore = 4;
    influenceExplanation = 'Mirror cusps - understand the cusp experience but in different flavors';
  } else {
    influenceScore = 0;
    influenceExplanation = 'No shared signs - distinct energies';
  }

  return {
    userInfluence: userSigns.join(', '),
    partnerInfluence: partnerSigns.join(', '),
    influence: influenceScore,
    influenceExplanation,
    influenceInteraction,
    sharedSigns: sharedSigns.length > 0 ? sharedSigns.join(', ') : 'None',
    userInfluenceContribution: Math.round(influenceScore / 2),
    partnerInfluenceContribution: Math.round(influenceScore / 2) + (influenceScore % 2)
  };
}

// ============================================================================
// ASPECT ANALYSIS (Keep Brother Opus's original)
// ============================================================================

function analyzeAspect(userCusp, partnerCusp) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const userIndex = signs.indexOf(userCusp.sign);
  const partnerIndex = signs.indexOf(partnerCusp.sign);
  
  if (userIndex === -1 || partnerIndex === -1) {
    return {
      aspect: 0,
      aspectName: 'Unknown',
      aspectExplanation: 'Unable to determine aspect',
      aspectInteraction: 'neutral',
      userAspectContribution: 0,
      partnerAspectContribution: 0
    };
  }
  
  const distance = Math.abs(userIndex - partnerIndex);
  const actualDistance = Math.min(distance, 12 - distance);
  
  const aspects = {
    0: { score: 10, name: 'Conjunction', explanation: 'Same sign - intense unity and understanding', interaction: 'boost' },
    1: { score: 5, name: 'Semi-sextile', explanation: 'Adjacent signs - slight friction but workable', interaction: 'neutral' },
    2: { score: 10, name: 'Sextile', explanation: '60° - harmonious opportunity and ease', interaction: 'boost' },
    3: { score: 0, name: 'Square', explanation: '90° - creative tension requiring work', interaction: 'friction' },
    4: { score: 15, name: 'Trine', explanation: '120° - natural flow and harmony', interaction: 'boost' },
    5: { score: -5, name: 'Quincunx', explanation: '150° - adjustment needed but growth potential', interaction: 'friction' },
    6: { score: 10, name: 'Opposition', explanation: '180° - balancing polarities and complementary energies', interaction: 'complement' }
  };
  
  const aspectData = aspects[actualDistance] || { 
    score: 0, 
    name: 'Unknown', 
    explanation: 'Unusual aspect', 
    interaction: 'neutral' 
  };
  
  return {
    aspect: aspectData.score,
    aspectName: aspectData.name,
    aspectExplanation: aspectData.explanation,
    aspectInteraction: aspectData.interaction,
    userAspectContribution: Math.round(aspectData.score / 2),
    partnerAspectContribution: Math.round(aspectData.score / 2) + (aspectData.score % 2)
  };
}

// ============================================================================
// STRENGTHS IDENTIFICATION (Keep Brother Opus's original)
// ============================================================================

function identifyStrengths(userCusp, partnerCusp) {
  const strengths = [];

  // Calculate individual scores directly to avoid infinite recursion
  // (calculateCuspBreakdown calls identifyStrengths, so we can't call it here)
  const elementResult = analyzeElementsWithTheory(userCusp, partnerCusp);
  const qualityResult = analyzeQuality(userCusp, partnerCusp);
  const rulersResult = analyzeRulers(userCusp, partnerCusp);

  if (elementResult.element >= 25) {
    strengths.push('Strong elemental harmony and natural energy flow');
  }
  if (qualityResult.quality >= 20) {
    strengths.push('Compatible approaches to action and decision-making');
  }
  if (rulersResult.rulers >= 15) {
    strengths.push('Aligned planetary influences and life priorities');
  }

  return strengths;
}

// ============================================================================
// CHALLENGES IDENTIFICATION (Keep Brother Opus's original)
// ============================================================================

export function getCuspChallenges(userCusp, partnerCusp, breakdown) {
  const challenges = [];
  
  if (breakdown.element < 20 && breakdown.elementInteraction === 'friction') {
    challenges.push({
      title: 'Elemental Friction',
      severity: 'high',
      description: 'Different elemental natures may create tension',
      solution: 'Practice patience and appreciate complementary strengths'
    });
  }
  
  if (breakdown.quality < 15) {
    challenges.push({
      title: 'Different Action Styles',
      severity: 'medium',
      description: 'May approach goals and decisions differently',
      solution: 'Communicate openly about plans and respect different pacing'
    });
  }
  
  return challenges;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateCuspBreakdown,
  getCuspChallenges
};
