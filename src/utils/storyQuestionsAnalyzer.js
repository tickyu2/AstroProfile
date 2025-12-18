/**
 * Story Questions Analyzer
 * Psychological profiling algorithm for Story Questions Assessment
 *
 * Analyzes user responses and generates:
 * - Constitutional Alignment scores
 * - Psychological Profile summary
 * - Growth recommendations
 * - Element/Ten God correlations
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 15, 2024
 */

import { STORY_QUESTIONS, PSYCHOLOGICAL_DIMENSIONS } from '../data/storyQuestions';

/**
 * Analyze all story question responses
 * @param {Array} responses - Array of { level, choiceId, choice } objects
 * @param {Object} constitutionalData - User's BaZi/constitutional data for alignment
 * @returns {Object} Complete psychological analysis
 */
export function analyzeStoryResponses(responses, constitutionalData = {}) {
  if (!responses || responses.length === 0) {
    return null;
  }

  // 1. Aggregate all traits from responses
  const aggregatedTraits = aggregateTraits(responses);

  // 2. Calculate element affinities from story responses
  const elementProfile = calculateElementProfile(responses);

  // 3. Calculate Yin/Yang balance from responses
  const yinYangProfile = calculateYinYangProfile(responses);

  // 4. Identify dominant Ten Gods from responses
  const tenGodsProfile = calculateTenGodsProfile(responses);

  // 5. Map psychological dimensions
  const psychologicalProfile = mapPsychologicalDimensions(responses);

  // 6. Calculate constitutional alignment (if BaZi data available)
  const constitutionalAlignment = calculateConstitutionalAlignment(
    { elementProfile, yinYangProfile, tenGodsProfile },
    constitutionalData
  );

  // 7. Generate growth recommendations
  const growthRecommendations = generateGrowthRecommendations(
    psychologicalProfile,
    aggregatedTraits
  );

  // 8. Generate personality summary
  const personalitySummary = generatePersonalitySummary(
    aggregatedTraits,
    psychologicalProfile,
    elementProfile
  );

  return {
    // Raw data
    responses,
    aggregatedTraits,

    // Constitutional correlations
    elementProfile,
    yinYangProfile,
    tenGodsProfile,
    constitutionalAlignment,

    // Psychological insights
    psychologicalProfile,
    personalitySummary,
    growthRecommendations,

    // Metadata
    completedLevels: responses.length,
    totalLevels: STORY_QUESTIONS.length,
    completionPercentage: Math.round((responses.length / STORY_QUESTIONS.length) * 100),
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Aggregate all traits from responses
 */
function aggregateTraits(responses) {
  const traits = {};

  responses.forEach(response => {
    const choice = response.choice;
    if (choice?.traits) {
      Object.entries(choice.traits).forEach(([key, value]) => {
        if (!traits[key]) {
          traits[key] = [];
        }
        traits[key].push(value);
      });
    }
  });

  // Convert arrays to dominant values
  const dominantTraits = {};
  Object.entries(traits).forEach(([key, values]) => {
    // Find most common value
    const counts = {};
    values.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    dominantTraits[key] = sorted[0]?.[0] || values[0];
  });

  return dominantTraits;
}

/**
 * Calculate element profile from story responses
 */
function calculateElementProfile(responses) {
  const elementCounts = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  responses.forEach(response => {
    const question = STORY_QUESTIONS.find(q => q.level === response.level);
    if (question?.constitutional_mapping?.[response.choiceId]) {
      const mapping = question.constitutional_mapping[response.choiceId];
      if (mapping.element_affinity && elementCounts[mapping.element_affinity] !== undefined) {
        elementCounts[mapping.element_affinity] += 1;
      }
    }
  });

  // Convert to percentages
  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0) || 1;
  const elementPercentages = {};
  Object.entries(elementCounts).forEach(([element, count]) => {
    elementPercentages[element] = Math.round((count / total) * 100);
  });

  // Sort by percentage
  const sorted = Object.entries(elementPercentages)
    .sort((a, b) => b[1] - a[1]);

  return {
    counts: elementCounts,
    percentages: elementPercentages,
    dominant: sorted[0]?.[0] || 'Unknown',
    secondary: sorted[1]?.[0] || 'Unknown',
    ranking: sorted.map(([el]) => el)
  };
}

/**
 * Calculate Yin/Yang balance from responses
 */
function calculateYinYangProfile(responses) {
  let yinCount = 0;
  let yangCount = 0;
  let balancedCount = 0;

  responses.forEach(response => {
    const question = STORY_QUESTIONS.find(q => q.level === response.level);
    if (question?.constitutional_mapping?.[response.choiceId]) {
      const mapping = question.constitutional_mapping[response.choiceId];
      if (mapping.yin_yang === 'Yin') yinCount++;
      else if (mapping.yin_yang === 'Yang') yangCount++;
      else if (mapping.yin_yang === 'Balanced') balancedCount++;
    }
  });

  const total = yinCount + yangCount + balancedCount || 1;

  return {
    yin: Math.round((yinCount / total) * 100),
    yang: Math.round((yangCount / total) * 100),
    balanced: Math.round((balancedCount / total) * 100),
    dominant: yinCount > yangCount ? 'Yin' : yangCount > yinCount ? 'Yang' : 'Balanced',
    description: getYinYangDescription(yinCount, yangCount, balancedCount)
  };
}

function getYinYangDescription(yin, yang, balanced) {
  const total = yin + yang + balanced || 1;
  const yinPct = (yin / total) * 100;
  const yangPct = (yang / total) * 100;

  if (Math.abs(yinPct - yangPct) < 20) {
    return "Balanced integration of receptive and assertive energies";
  } else if (yinPct > yangPct) {
    return "Naturally receptive, reflective, and intuitive approach";
  } else {
    return "Naturally assertive, action-oriented, and expressive approach";
  }
}

/**
 * Calculate Ten Gods profile from responses
 */
function calculateTenGodsProfile(responses) {
  const tenGodsCounts = {};

  responses.forEach(response => {
    const question = STORY_QUESTIONS.find(q => q.level === response.level);
    if (question?.constitutional_mapping?.[response.choiceId]) {
      const mapping = question.constitutional_mapping[response.choiceId];
      if (mapping.ten_god) {
        tenGodsCounts[mapping.ten_god] = (tenGodsCounts[mapping.ten_god] || 0) + 1;
      }
    }
  });

  // Sort by count
  const sorted = Object.entries(tenGodsCounts)
    .sort((a, b) => b[1] - a[1]);

  return {
    counts: tenGodsCounts,
    dominant: sorted[0]?.[0] || 'Unknown',
    secondary: sorted[1]?.[0] || 'Unknown',
    ranking: sorted.map(([god]) => god),
    description: getTenGodDescription(sorted[0]?.[0])
  };
}

function getTenGodDescription(tenGod) {
  const descriptions = {
    'Direct Resource': 'Nurturing, supportive, knowledge-seeking',
    'Indirect Resource': 'Intuitive, creative, unconventional learning',
    'Friend': 'Collaborative, social, peer-oriented',
    'Rob Wealth': 'Competitive, ambitious, risk-taking',
    'Eating God': 'Creative, expressive, pleasure-seeking',
    'Hurting Officer': 'Rebellious, innovative, change-making',
    'Direct Wealth': 'Practical, hardworking, steady accumulation',
    'Indirect Wealth': 'Speculative, opportunistic, windfall-oriented',
    'Direct Officer': 'Structured, responsible, authority-respecting',
    '7 Killings': 'Ambitious, powerful, transformative'
  };
  return descriptions[tenGod] || 'Unique blend of energies';
}

/**
 * Map psychological dimensions from responses
 */
function mapPsychologicalDimensions(responses) {
  const dimensions = {};

  responses.forEach(response => {
    const question = STORY_QUESTIONS.find(q => q.level === response.level);
    if (question?.psychological_dimension) {
      const dimKey = question.psychological_dimension;
      const dimInfo = PSYCHOLOGICAL_DIMENSIONS[dimKey];

      dimensions[dimKey] = {
        name: dimInfo?.name || dimKey,
        description: dimInfo?.description || '',
        response: response.choice?.text || '',
        traits: response.choice?.traits || {},
        level: response.level
      };
    }
  });

  return dimensions;
}

/**
 * Calculate constitutional alignment
 * Compares story-derived profile to actual BaZi data
 */
function calculateConstitutionalAlignment(storyProfile, constitutionalData) {
  if (!constitutionalData || Object.keys(constitutionalData).length === 0) {
    return {
      available: false,
      message: "BaZi data not available for alignment comparison"
    };
  }

  let alignmentScore = 0;
  let totalFactors = 0;
  const alignmentDetails = [];

  // Check element alignment
  if (constitutionalData.dominantElement && storyProfile.elementProfile) {
    totalFactors++;
    const storyDominant = storyProfile.elementProfile.dominant;
    const baziDominant = constitutionalData.dominantElement;

    if (storyDominant === baziDominant) {
      alignmentScore += 100;
      alignmentDetails.push({
        factor: 'Dominant Element',
        alignment: 'Perfect',
        story: storyDominant,
        bazi: baziDominant
      });
    } else if (areElementsRelated(storyDominant, baziDominant)) {
      alignmentScore += 60;
      alignmentDetails.push({
        factor: 'Dominant Element',
        alignment: 'Related',
        story: storyDominant,
        bazi: baziDominant
      });
    } else {
      alignmentScore += 20;
      alignmentDetails.push({
        factor: 'Dominant Element',
        alignment: 'Different',
        story: storyDominant,
        bazi: baziDominant
      });
    }
  }

  // Check Yin/Yang alignment
  if (constitutionalData.yinYangDominant && storyProfile.yinYangProfile) {
    totalFactors++;
    const storyYY = storyProfile.yinYangProfile.dominant;
    const baziYY = constitutionalData.yinYangDominant;

    if (storyYY === baziYY) {
      alignmentScore += 100;
      alignmentDetails.push({
        factor: 'Yin/Yang Balance',
        alignment: 'Perfect',
        story: storyYY,
        bazi: baziYY
      });
    } else {
      alignmentScore += 40;
      alignmentDetails.push({
        factor: 'Yin/Yang Balance',
        alignment: 'Different',
        story: storyYY,
        bazi: baziYY
      });
    }
  }

  const overallAlignment = totalFactors > 0
    ? Math.round(alignmentScore / totalFactors)
    : null;

  return {
    available: totalFactors > 0,
    overallScore: overallAlignment,
    details: alignmentDetails,
    interpretation: getAlignmentInterpretation(overallAlignment)
  };
}

function areElementsRelated(el1, el2) {
  // Elements that have productive or supportive relationships
  const relationships = {
    Wood: ['Water', 'Fire'],
    Fire: ['Wood', 'Earth'],
    Earth: ['Fire', 'Metal'],
    Metal: ['Earth', 'Water'],
    Water: ['Metal', 'Wood']
  };
  return relationships[el1]?.includes(el2) || relationships[el2]?.includes(el1);
}

function getAlignmentInterpretation(score) {
  if (score === null) return "Insufficient data for alignment analysis";
  if (score >= 80) return "High alignment: Your story choices reflect your constitutional nature authentically";
  if (score >= 60) return "Good alignment: Your responses show natural expression of your core patterns";
  if (score >= 40) return "Moderate alignment: Some adaptation between inner nature and expression";
  return "Growth opportunity: Your choices may reflect learned patterns vs. innate tendencies";
}

/**
 * Generate growth recommendations based on psychological profile
 */
function generateGrowthRecommendations(psychProfile, traits) {
  const recommendations = [];

  // Based on conflict style
  if (traits.conflict_style === 'avoidant' || traits.conflict_style === 'indirect') {
    recommendations.push({
      area: "Communication",
      insight: "You may benefit from practicing direct expression of needs",
      practice: "Try stating one honest feeling per day to someone you trust"
    });
  }

  // Based on inner critic
  if (traits.inner_critic === 'achiever') {
    recommendations.push({
      area: "Self-Worth",
      insight: "Your value isn't measured by productivity alone",
      practice: "Notice and celebrate small moments of being, not just doing"
    });
  }

  if (traits.inner_critic === 'social') {
    recommendations.push({
      area: "Authenticity",
      insight: "Not everyone needs to like you for you to be worthy",
      practice: "Express one unpopular opinion this week and notice what happens"
    });
  }

  // Based on trust patterns
  if (traits.trust_pattern === 'protective') {
    recommendations.push({
      area: "Vulnerability",
      insight: "Walls protect but also isolate",
      practice: "Share something vulnerable with one trusted person"
    });
  }

  // Based on decision style
  if (traits.decision_style === 'analytical') {
    recommendations.push({
      area: "Intuition",
      insight: "Not all wisdom lives in spreadsheets",
      practice: "Make one small decision this week based purely on gut feeling"
    });
  }

  // Based on self-perception
  if (traits.self_perception === 'seeker') {
    recommendations.push({
      area: "Grounding",
      insight: "Sometimes the answer is in being, not seeking",
      practice: "Spend 5 minutes daily just sitting without agenda"
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

/**
 * Generate personality summary narrative
 */
function generatePersonalitySummary(traits, psychProfile, elementProfile) {
  const parts = [];

  // Social orientation
  if (traits.social_orientation) {
    const socialDescriptions = {
      external: "You're energized by connection and engagement with others.",
      internal: "You recharge through solitude and inner reflection.",
      balanced: "You navigate between social energy and personal space with ease.",
      autonomous: "You're driven by independent pursuits and creative expression."
    };
    parts.push(socialDescriptions[traits.social_orientation] || '');
  }

  // Decision style
  if (traits.decision_style) {
    const decisionDescriptions = {
      intuitive: "When facing choices, you trust your gut and embrace the leap.",
      analytical: "You approach decisions methodically, weighing every angle.",
      consultative: "You value diverse perspectives before committing to a path.",
      emergent: "You allow decisions to unfold organically, trusting the process."
    };
    parts.push(decisionDescriptions[traits.decision_style] || '');
  }

  // Core fear/growth edge
  if (traits.core_fear) {
    const fearDescriptions = {
      inadequacy: "Your growth edge lies in recognizing your inherent worth beyond achievement.",
      rejection: "Your journey involves anchoring in self-acceptance regardless of approval.",
      meaninglessness: "Your path is about finding meaning in the present, not just the future.",
      futility: "Your evolution invites reconnecting with hope and engaged action."
    };
    parts.push(fearDescriptions[traits.core_fear] || '');
  }

  // Life purpose
  if (traits.life_purpose) {
    const purposeDescriptions = {
      impact: "Legacy matters to you - you want to leave the world different than you found it.",
      connection: "At your core, love and relationships are what make life meaningful.",
      authenticity: "Living true to yourself is your north star, even when it's hard.",
      experience: "You're here to fully taste life - every flavor, every color, every moment."
    };
    parts.push(purposeDescriptions[traits.life_purpose] || '');
  }

  // Element signature
  if (elementProfile?.dominant) {
    const elementPersonalities = {
      Wood: "Your Wood nature brings vision, growth-orientation, and pioneering spirit.",
      Fire: "Your Fire essence brings warmth, passion, and magnetic charisma.",
      Earth: "Your Earth quality brings stability, nurturing, and grounded wisdom.",
      Metal: "Your Metal nature brings precision, refinement, and principled strength.",
      Water: "Your Water essence brings depth, adaptability, and intuitive wisdom."
    };
    parts.push(elementPersonalities[elementProfile.dominant] || '');
  }

  return parts.filter(p => p).join(' ');
}

/**
 * Get partial analysis for incomplete assessments
 */
export function getPartialAnalysis(responses) {
  if (!responses || responses.length === 0) {
    return { available: false };
  }

  const completedLevels = responses.map(r => r.level);
  const insights = [];

  // Generate insights based on completed levels
  responses.forEach(response => {
    const question = STORY_QUESTIONS.find(q => q.level === response.level);
    if (question && response.choice) {
      insights.push({
        dimension: question.psychological_dimension,
        title: question.title,
        chosenTraits: response.choice.traits
      });
    }
  });

  return {
    available: true,
    completedLevels,
    remainingLevels: STORY_QUESTIONS.filter(q => !completedLevels.includes(q.level)).map(q => q.level),
    insights,
    completionPercentage: Math.round((completedLevels.length / STORY_QUESTIONS.length) * 100)
  };
}

export default {
  analyzeStoryResponses,
  getPartialAnalysis
};
