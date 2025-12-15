/**
 * MBTI Compatibility Engine
 * The BRAIN that analyzes relationships between types
 * Built with SOUL for humanity's relationship discovery
 *
 * This engine:
 * - Analyzes cognitive function dynamics
 * - Generates compatibility insights
 * - Provides top matches
 * - Creates detailed relationship analysis
 */

import {
  getCognitiveStack,
  getTemperament,
  calculateMBTIDistance,
  getTypeName,
  generateMBTICode
} from './mbtiCodeSystem.js';

import {
  getMBTICompatibility,
  getCompatibilityLevel,
  getCompatibilityRankings
} from './mbtiCompatibilityMatrix.js';

/**
 * Get top N compatible types for a given type
 */
export function getTopCompatibleTypes(userType, count = 4) {
  const rankings = getCompatibilityRankings(userType);
  return rankings.slice(0, count).map(match => ({
    type: match.type,
    name: getTypeName(match.type),
    score: match.score,
    level: getCompatibilityLevel(match.score),
    code: generateMBTICode(match.type)
  }));
}

/**
 * Analyze cognitive function interaction between two types
 */
export function analyzeCognitiveDynamics(type1, type2) {
  const stack1 = getCognitiveStack(type1);
  const stack2 = getCognitiveStack(type2);

  // Analyze function alignment
  const dominant1 = stack1[0]; // Hero
  const auxiliary1 = stack1[1]; // Parent
  const dominant2 = stack2[0];
  const auxiliary2 = stack2[1];

  // Check for golden pair pattern (complementary function attitudes)
  // Golden pairs share the same function letters but opposite orientations
  // E.g., INFJ (Ni-Fe) + ENFP (Ne-Fi) - both use N and F but inverted
  const getBase = (fn) => fn.replace(/[ie]/i, ''); // Remove i/e to get base
  const base1_1 = getBase(dominant1);
  const base1_2 = getBase(auxiliary1);
  const base2_1 = getBase(dominant2);
  const base2_2 = getBase(auxiliary2);

  const isGoldenPair =
    (base1_1 === base2_1 && base1_2 === base2_2) || // Same bases in same order
    (base1_1 === base2_2 && base1_2 === base2_1);   // Same bases reversed

  // Check for function mirroring
  const sharedFunctions = stack1.filter(fn => stack2.includes(fn)).length;

  // Analyze function conflict vs harmony
  const hasConflict = stack1[0] === stack2[3] || stack1[3] === stack2[0]; // Hero vs Inferior

  return {
    type1Stack: stack1,
    type2Stack: stack2,
    dominant1,
    dominant2,
    auxiliary1,
    auxiliary2,
    isGoldenPair,
    sharedFunctions,
    hasConflict,
    alignment: sharedFunctions >= 2 ? 'high' : sharedFunctions === 1 ? 'moderate' : 'low'
  };
}

/**
 * Get temperament compatibility insight
 */
export function getTemperamentCompatibility(type1, type2) {
  const temp1 = getTemperament(type1);
  const temp2 = getTemperament(type2);

  const temperamentPairs = {
    'NF-NF': {
      harmony: 'high',
      description: 'Both idealists sharing deep emotional understanding and vision',
      strength: 'Mutual empathy and shared values'
    },
    'NF-NT': {
      harmony: 'high',
      description: 'Idealist meets analyst - heart and mind complementing',
      strength: 'Balance of emotion and logic'
    },
    'NF-SP': {
      harmony: 'moderate',
      description: 'Idealist meets artisan - abstract vision with concrete action',
      strength: 'Complementary perspectives'
    },
    'NF-SJ': {
      harmony: 'moderate',
      description: 'Idealist meets guardian - vision with structure',
      strength: 'Balance of innovation and stability'
    },
    'NT-NT': {
      harmony: 'high',
      description: 'Both analysts sharing intellectual rigor and strategic thinking',
      strength: 'Mutual intellectual stimulation'
    },
    'NT-SP': {
      harmony: 'high',
      description: 'Analyst meets artisan - theory with practical mastery',
      strength: 'Complementary problem-solving'
    },
    'NT-SJ': {
      harmony: 'high',
      description: 'Analyst meets guardian - innovation with implementation',
      strength: 'Strategic planning with execution'
    },
    'SP-SP': {
      harmony: 'high',
      description: 'Both artisans sharing present-focus and spontaneity',
      strength: 'Shared adventure and flexibility'
    },
    'SP-SJ': {
      harmony: 'moderate',
      description: 'Artisan meets guardian - spontaneity with structure',
      strength: 'Balance of freedom and stability'
    },
    'SJ-SJ': {
      harmony: 'high',
      description: 'Both guardians sharing tradition, duty, and stability',
      strength: 'Mutual reliability and shared values'
    }
  };

  const key = [temp1, temp2].sort().join('-');
  return temperamentPairs[key] || {
    harmony: 'moderate',
    description: 'Different temperaments bringing diverse perspectives',
    strength: 'Opportunity for growth through difference'
  };
}

/**
 * Generate complete compatibility analysis
 */
export function getCompatibilityAnalysis(type1, type2) {
  const score = getMBTICompatibility(type1, type2);
  const level = getCompatibilityLevel(score);
  const cognitive = analyzeCognitiveDynamics(type1, type2);
  const temperament = getTemperamentCompatibility(type1, type2);
  const distance = calculateMBTIDistance(type1, type2);

  return {
    // Basic info
    type1: {
      type: type1,
      name: getTypeName(type1),
      temperament: getTemperament(type1),
      stack: getCognitiveStack(type1),
      code: generateMBTICode(type1)
    },
    type2: {
      type: type2,
      name: getTypeName(type2),
      temperament: getTemperament(type2),
      stack: getCognitiveStack(type2),
      code: generateMBTICode(type2)
    },

    // Compatibility metrics
    score,
    level,
    distance,

    // Deep analysis
    cognitive,
    temperament,

    // Summary insight
    summary: generateSummaryInsight(type1, type2, score, cognitive, temperament)
  };
}

/**
 * Generate summary insight (used when detailed content not yet written)
 */
function generateSummaryInsight(type1, type2, score, cognitive, temperament) {
  const levelDesc = getCompatibilityLevel(score);

  let insight = `${type1} and ${type2} compatibility: ${score}% (${levelDesc.level})\n\n`;

  if (cognitive.isGoldenPair) {
    insight += `✨ Golden Pair Pattern: The dominant function of one naturally supports the auxiliary function of the other, creating effortless harmony.\n\n`;
  }

  insight += `Cognitive Alignment: ${cognitive.alignment} (${cognitive.sharedFunctions}/4 shared functions)\n`;
  insight += `Temperament Harmony: ${temperament.harmony} - ${temperament.description}\n\n`;

  if (score >= 90) {
    insight += `This pairing represents one of the most naturally harmonious relationships in MBTI. The cognitive functions complement each other beautifully, and both partners typically feel understood and energized by the connection.`;
  } else if (score >= 75) {
    insight += `This is a very strong pairing with excellent potential. While there may be some differences to navigate, the core compatibility is solid and the relationship can be deeply fulfilling.`;
  } else if (score >= 60) {
    insight += `This pairing has good compatibility with room for growth. The differences can actually strengthen the relationship when both partners approach them with curiosity and respect.`;
  } else if (score >= 45) {
    insight += `This pairing requires conscious effort and understanding. The differences are significant, but with mutual respect and communication, the relationship can work well and provide valuable growth opportunities.`;
  } else {
    insight += `This pairing faces natural challenges due to very different cognitive styles. Success requires exceptional communication, patience, and willingness to understand a fundamentally different perspective.`;
  }

  return insight;
}

/**
 * Get compatibility summary for dashboard/preview
 */
export function getCompatibilitySummary(userType) {
  const topMatches = getTopCompatibleTypes(userType, 4);
  const temperament = getTemperament(userType);
  const typeName = getTypeName(userType);

  return {
    userType,
    typeName,
    temperament,
    code: generateMBTICode(userType),
    topMatches,
    totalAnalyzed: 15, // All other types
    goldenPair: topMatches[0] // Best match
  };
}

/**
 * Check if detailed content exists for this pairing
 * (For now, only INFJ-ENFP has full content)
 */
export function hasDetailedContent(type1, type2) {
  const pair = [type1, type2].sort().join('-');
  const availablePairs = [
    'ENFP-INFJ' // The Golden Pair (Session 2)
  ];
  return availablePairs.includes(pair);
}

/**
 * Get relationship type classification
 */
export function getRelationshipType(type1, type2) {
  const score = getMBTICompatibility(type1, type2);
  const cognitive = analyzeCognitiveDynamics(type1, type2);
  const distance = calculateMBTIDistance(type1, type2);

  if (cognitive.isGoldenPair && score >= 90) {
    return {
      type: 'Golden Pair',
      icon: '💜',
      description: 'Natural soulmate connection with effortless harmony'
    };
  } else if (distance === 0) {
    return {
      type: 'Mirror',
      icon: '🪞',
      description: 'Same type - deep understanding with potential for stagnation'
    };
  } else if (distance === 4) {
    return {
      type: 'Opposite',
      icon: '⚡',
      description: 'Complete opposites - challenging but potentially transformative'
    };
  } else if (cognitive.sharedFunctions >= 3) {
    return {
      type: 'Companion',
      icon: '💙',
      description: 'Strong cognitive alignment with comfortable understanding'
    };
  } else if (score >= 75) {
    return {
      type: 'Compatible',
      icon: '💚',
      description: 'Very good match with complementary strengths'
    };
  } else if (score >= 60) {
    return {
      type: 'Growth Partner',
      icon: '🌱',
      description: 'Good compatibility with opportunities for mutual growth'
    };
  } else {
    return {
      type: 'Challenge',
      icon: '🔥',
      description: 'Requires significant effort and understanding'
    };
  }
}
