/**
 * Composite Health Engine
 *
 * Based on Liz Greene's approach to chart diagnosis — not as "good" or "bad"
 * but as indicators of where energy flows freely, where it is blocked,
 * and where conscious work is needed.
 *
 * A "healthy" relationship is not one without challenges. It is one where
 * challenges are met consciously and energy circulates.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Aspect types and their health implications
 */
const ASPECT_HEALTH = {
  conjunction: {
    nature: 'Fusion',
    healthy: 'Concentrated power, shared focus, unity',
    unhealthy: 'Inability to separate, obsession, loss of perspective',
    consciousness: 'Requires conscious channeling of combined energy'
  },
  trine: {
    nature: 'Flow',
    healthy: 'Easy energy, natural harmony, effortless connection',
    unhealthy: 'Laziness, taking things for granted, lack of growth impetus',
    consciousness: 'Requires intentional use of gifts; don\'t coast'
  },
  sextile: {
    nature: 'Opportunity',
    healthy: 'Available resources, potential for growth',
    unhealthy: 'Unused potential, opportunities missed',
    consciousness: 'Requires active engagement to manifest benefits'
  },
  square: {
    nature: 'Tension',
    healthy: 'Dynamic energy, motivation to change, creative friction',
    unhealthy: 'Chronic conflict, stress, blocked energy',
    consciousness: 'Requires conscious integration of opposing forces'
  },
  opposition: {
    nature: 'Polarity',
    healthy: 'Balance through awareness of opposite, completion',
    unhealthy: 'Projection, blame, either/or thinking',
    consciousness: 'Requires owning both ends of the polarity'
  },
  quincunx: {
    nature: 'Adjustment',
    healthy: 'Ongoing fine-tuning, adaptation, flexibility',
    unhealthy: 'Chronic irritation, health issues, nagging dissatisfaction',
    consciousness: 'Requires acceptance that some things don\'t fit neatly'
  }
};

/**
 * Planetary health indicators when prominent
 */
const PLANETARY_HEALTH = {
  Sun: {
    strong: 'Clear identity, vitality, purpose',
    weak: 'Identity confusion, lack of direction, vitality drain',
    afflicted: 'Ego struggles, power conflicts, purpose sabotage'
  },
  Moon: {
    strong: 'Emotional security, nurturing flow, intuitive connection',
    weak: 'Emotional insecurity, moodiness, lack of safety',
    afflicted: 'Emotional manipulation, dependency, regressive patterns'
  },
  Mercury: {
    strong: 'Clear communication, mental connection, mutual understanding',
    weak: 'Miscommunication, mental disconnect, misunderstanding',
    afflicted: 'Lying, manipulation through words, communication warfare'
  },
  Venus: {
    strong: 'Love flows, values align, pleasure shared',
    weak: 'Love blocked, values clash, pleasure denied',
    afflicted: 'Love distorted, jealousy, possessiveness, manipulation'
  },
  Mars: {
    strong: 'Healthy assertion, shared action, passion',
    weak: 'Passive aggression, blocked action, dead passion',
    afflicted: 'Violence (emotional or physical), competition, warfare'
  },
  Jupiter: {
    strong: 'Growth, optimism, shared meaning',
    weak: 'Stagnation, pessimism, meaninglessness',
    afflicted: 'Excess, inflation, blind faith, escape through philosophy'
  },
  Saturn: {
    strong: 'Commitment, structure, mature responsibility',
    weak: 'Fear, avoidance, lack of structure',
    afflicted: 'Control, coldness, criticism, withholding'
  },
  Uranus: {
    strong: 'Freedom with commitment, innovation, authenticity',
    weak: 'Boredom, conformity, inauthenticity',
    afflicted: 'Rebellion, instability, commitment phobia, shock patterns'
  },
  Neptune: {
    strong: 'Spiritual connection, compassion, imagination',
    weak: 'Disillusionment, lack of vision, spiritual disconnect',
    afflicted: 'Deception, escapism, addiction, victim/savior dynamics'
  },
  Pluto: {
    strong: 'Transformation, depth, regeneration',
    weak: 'Superficiality, fear of depth, stagnation',
    afflicted: 'Power struggles, manipulation, obsession, control'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH SCORING CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

const HEALTH_CATEGORIES = {
  communication: {
    name: 'Communication Health',
    planets: ['Mercury', 'Moon'],
    houses: [3, 7],
    description: 'How well the relationship exchanges information and feeling'
  },
  emotional: {
    name: 'Emotional Health',
    planets: ['Moon', 'Venus', 'Neptune'],
    houses: [4, 8, 12],
    description: 'The emotional security and depth available'
  },
  passion: {
    name: 'Passion Health',
    planets: ['Mars', 'Venus', 'Pluto'],
    houses: [5, 8],
    description: 'Sexual and creative energy flow'
  },
  commitment: {
    name: 'Commitment Health',
    planets: ['Saturn', 'Sun'],
    houses: [7, 10],
    description: 'The structural solidity of the bond'
  },
  growth: {
    name: 'Growth Health',
    planets: ['Jupiter', 'Uranus', 'North Node'],
    houses: [9, 11],
    description: 'The capacity for evolution and expansion'
  },
  purpose: {
    name: 'Purpose Health',
    planets: ['Sun', 'Jupiter', 'North Node'],
    houses: [9, 10],
    description: 'Clarity and alignment of shared direction'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WARNING SIGNS
// ═══════════════════════════════════════════════════════════════════════════

const WARNING_SIGNS = {
  saturnSunSquare: {
    aspect: ['Saturn', 'Sun', 'square'],
    warning: 'Identity suppression — one or both feel diminished',
    healing: 'Creating space for individual shine while maintaining structure'
  },
  saturnMoonSquare: {
    aspect: ['Saturn', 'Moon', 'square'],
    warning: 'Emotional coldness — feelings get blocked or criticized',
    healing: 'Building safety for vulnerability; Saturn as container, not prison'
  },
  marsPlutoSquare: {
    aspect: ['Mars', 'Pluto', 'square'],
    warning: 'Power struggles — intensity can become violence',
    healing: 'Channeling intensity into shared transformation projects'
  },
  neptuneVenusSquare: {
    aspect: ['Neptune', 'Venus', 'square'],
    warning: 'Deception in love — idealization or disillusionment',
    healing: 'Loving the real person, not the fantasy'
  },
  uranusVenusSquare: {
    aspect: ['Uranus', 'Venus', 'square'],
    warning: 'Instability in love — commitment fears, sudden changes',
    healing: 'Creating freedom within commitment'
  },
  plutoMoonSquare: {
    aspect: ['Pluto', 'Moon', 'square'],
    warning: 'Emotional intensity — manipulation or obsession risk',
    healing: 'Transforming emotional patterns without controlling each other'
  },
  saturnVenusSquare: {
    aspect: ['Saturn', 'Venus', 'square'],
    warning: 'Love feels blocked — duty over pleasure',
    healing: 'Making space for joy within responsibility'
  },
  marsVenusSquare: {
    aspect: ['Mars', 'Venus', 'square'],
    warning: 'Passion conflicts — wanting different things',
    healing: 'Finding the dance between desire and reception'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// STRENGTH INDICATORS
// ═══════════════════════════════════════════════════════════════════════════

const STRENGTH_INDICATORS = {
  sunMoonTrine: {
    aspect: ['Sun', 'Moon', 'trine'],
    strength: 'Natural harmony between identity and emotion',
    gift: 'The relationship feels "right" at a deep level'
  },
  venusJupiterTrine: {
    aspect: ['Venus', 'Jupiter', 'trine'],
    strength: 'Abundant love and joy',
    gift: 'Natural generosity and optimism in relating'
  },
  sunVenusTrine: {
    aspect: ['Sun', 'Venus', 'trine'],
    strength: 'Love and identity aligned',
    gift: 'Loving each other as you are'
  },
  moonVenusTrine: {
    aspect: ['Moon', 'Venus', 'trine'],
    strength: 'Emotional and romantic harmony',
    gift: 'Feelings and affection flow together naturally'
  },
  mercuryJupiterTrine: {
    aspect: ['Mercury', 'Jupiter', 'trine'],
    strength: 'Expansive communication',
    gift: 'Conversations that expand rather than contract'
  },
  saturnJupiterSextile: {
    aspect: ['Saturn', 'Jupiter', 'sextile'],
    strength: 'Balance of structure and growth',
    gift: 'Can build while still expanding'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the health profile of a composite chart
 *
 * @param {Object} compositeChart - Composite chart from compositeGenerator
 * @returns {Object} Health profile of the relationship
 */
export function buildCompositeHealth(compositeChart) {
  if (!compositeChart || !compositeChart.planets) {
    return null;
  }

  const aspects = compositeChart.aspects || [];

  // Analyze aspects
  const aspectAnalysis = analyzeAspects(aspects);

  // Check warning signs
  const warnings = checkWarnings(aspects);

  // Check strength indicators
  const strengths = checkStrengths(aspects);

  // Calculate health scores by category
  const categoryScores = calculateCategoryScores(compositeChart, aspects);

  // Calculate overall health score
  const overallHealth = calculateOverallHealth(categoryScores, warnings, strengths);

  // Generate diagnosis
  const diagnosis = generateDiagnosis(categoryScores, warnings, strengths);

  const health = {
    // Overall Score
    overallScore: overallHealth.score,
    overallGrade: overallHealth.grade,
    overallSummary: overallHealth.summary,

    // Category Breakdown
    categories: categoryScores,

    // Aspect Analysis
    aspectBalance: aspectAnalysis,

    // Warnings and Strengths
    warnings: warnings,
    strengths: strengths,

    // Diagnosis
    diagnosis: diagnosis,

    // Recommendations
    recommendations: generateRecommendations(warnings, categoryScores)
  };

  return health;
}

/**
 * Analyze aspect distribution
 */
function analyzeAspects(aspects) {
  const counts = {
    conjunction: 0,
    trine: 0,
    sextile: 0,
    square: 0,
    opposition: 0,
    quincunx: 0
  };

  for (const aspect of aspects) {
    const type = aspect.type?.toLowerCase();
    if (counts[type] !== undefined) {
      counts[type]++;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Calculate harmonious vs challenging
  const harmonious = counts.trine + counts.sextile;
  const challenging = counts.square + counts.opposition + counts.quincunx;
  const fused = counts.conjunction;

  let balance;
  if (total === 0) {
    balance = 'No aspects detected';
  } else if (harmonious > challenging * 1.5) {
    balance = 'Predominantly harmonious — watch for complacency';
  } else if (challenging > harmonious * 1.5) {
    balance = 'Predominantly challenging — significant growth potential with effort';
  } else {
    balance = 'Balanced — healthy mix of ease and growth stimulus';
  }

  return {
    counts,
    total,
    harmonious,
    challenging,
    fused,
    balance,
    harmonyRatio: total > 0 ? ((harmonious / total) * 100).toFixed(1) : 0
  };
}

/**
 * Check for warning sign aspects
 */
function checkWarnings(aspects) {
  const found = [];

  for (const [key, warning] of Object.entries(WARNING_SIGNS)) {
    const [p1, p2, aspectType] = warning.aspect;
    const hasAspect = aspects.some(a =>
      ((a.planet1 === p1 && a.planet2 === p2) ||
       (a.planet1 === p2 && a.planet2 === p1)) &&
      a.type?.toLowerCase() === aspectType
    );

    if (hasAspect) {
      found.push({
        key,
        ...warning
      });
    }
  }

  return found;
}

/**
 * Check for strength indicator aspects
 */
function checkStrengths(aspects) {
  const found = [];

  for (const [key, strength] of Object.entries(STRENGTH_INDICATORS)) {
    const [p1, p2, aspectType] = strength.aspect;
    const hasAspect = aspects.some(a =>
      ((a.planet1 === p1 && a.planet2 === p2) ||
       (a.planet1 === p2 && a.planet2 === p1)) &&
      a.type?.toLowerCase() === aspectType
    );

    if (hasAspect) {
      found.push({
        key,
        ...strength
      });
    }
  }

  return found;
}

/**
 * Calculate health scores by category
 */
function calculateCategoryScores(compositeChart, aspects) {
  const scores = {};

  for (const [key, category] of Object.entries(HEALTH_CATEGORIES)) {
    let score = 70; // Base score

    // Check aspects involving category planets
    for (const aspect of aspects) {
      const involvesCategory = category.planets.some(p =>
        aspect.planet1 === p || aspect.planet2 === p
      );

      if (involvesCategory) {
        const type = aspect.type?.toLowerCase();
        if (type === 'trine' || type === 'sextile') {
          score += 5;
        } else if (type === 'square') {
          score -= 3;
        } else if (type === 'opposition') {
          score -= 2;
        } else if (type === 'conjunction') {
          score += 2; // Generally positive, adds focus
        }
      }
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    scores[key] = {
      ...category,
      score,
      grade: getGrade(score),
      status: getStatus(score)
    };
  }

  return scores;
}

/**
 * Calculate overall health
 */
function calculateOverallHealth(categoryScores, warnings, strengths) {
  // Average category scores
  const scores = Object.values(categoryScores).map(c => c.score);
  let avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Adjust for warnings and strengths
  avgScore -= warnings.length * 5;
  avgScore += strengths.length * 3;

  // Clamp
  avgScore = Math.max(0, Math.min(100, avgScore));

  const grade = getGrade(avgScore);

  let summary;
  if (avgScore >= 80) {
    summary = 'This relationship has strong natural resources and flow. The challenge is not to take things for granted.';
  } else if (avgScore >= 60) {
    summary = 'This relationship has a healthy balance of ease and challenge. Conscious work will bring rewards.';
  } else if (avgScore >= 40) {
    summary = 'This relationship requires significant conscious effort. The challenges are real but workable.';
  } else {
    summary = 'This relationship faces substantial challenges. Professional support may be valuable.';
  }

  return {
    score: Math.round(avgScore),
    grade,
    summary
  };
}

/**
 * Generate diagnosis
 */
function generateDiagnosis(categoryScores, warnings, strengths) {
  const diagnosis = {
    primaryStrengths: [],
    primaryChallenges: [],
    focusAreas: []
  };

  // Find strongest categories
  const sorted = Object.entries(categoryScores)
    .sort((a, b) => b[1].score - a[1].score);

  diagnosis.primaryStrengths = sorted
    .slice(0, 2)
    .filter(([_, v]) => v.score >= 70)
    .map(([k, v]) => v.name);

  diagnosis.primaryChallenges = sorted
    .slice(-2)
    .filter(([_, v]) => v.score < 70)
    .map(([k, v]) => v.name);

  // Add warning-based challenges
  for (const warning of warnings) {
    diagnosis.focusAreas.push(warning.healing);
  }

  return diagnosis;
}

/**
 * Generate recommendations
 */
function generateRecommendations(warnings, categoryScores) {
  const recommendations = [];

  // Based on warnings
  for (const warning of warnings.slice(0, 3)) {
    recommendations.push({
      area: warning.warning.split(' — ')[0],
      recommendation: warning.healing
    });
  }

  // Based on low category scores
  for (const [key, category] of Object.entries(categoryScores)) {
    if (category.score < 60) {
      const recs = {
        communication: 'Schedule regular check-in conversations. Practice reflective listening.',
        emotional: 'Create rituals of emotional safety. Honor vulnerability.',
        passion: 'Make space for play and physical connection. Don\'t let routine kill spark.',
        commitment: 'Have explicit conversations about expectations. Honor agreements.',
        growth: 'Schedule adventures and learning together. Avoid comfortable stagnation.',
        purpose: 'Clarify shared vision. Make sure you\'re rowing in the same direction.'
      };

      if (recs[key]) {
        recommendations.push({
          area: category.name,
          recommendation: recs[key]
        });
      }
    }
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}

/**
 * Get grade from score
 */
function getGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 45) return 'D+';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Get status from score
 */
function getStatus(score) {
  if (score >= 80) return 'Thriving';
  if (score >= 60) return 'Healthy';
  if (score >= 40) return 'Needs Attention';
  return 'Critical';
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the overall health score
 */
export function getHealthScore(compositeChart) {
  const health = buildCompositeHealth(compositeChart);
  return health?.overallScore || 0;
}

/**
 * Get just the warnings
 */
export function getHealthWarnings(compositeChart) {
  const health = buildCompositeHealth(compositeChart);
  return health?.warnings || [];
}

/**
 * Get just the strengths
 */
export function getHealthStrengths(compositeChart) {
  const health = buildCompositeHealth(compositeChart);
  return health?.strengths || [];
}

/**
 * Quick health check
 */
export function quickHealthCheck(compositeChart) {
  const health = buildCompositeHealth(compositeChart);
  if (!health) return null;

  return {
    grade: health.overallGrade,
    score: health.overallScore,
    warningCount: health.warnings.length,
    strengthCount: health.strengths.length,
    summary: health.overallSummary
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositeHealth,
  getHealthScore,
  getHealthWarnings,
  getHealthStrengths,
  quickHealthCheck,
  // Export data for customization
  ASPECT_HEALTH,
  PLANETARY_HEALTH,
  HEALTH_CATEGORIES,
  WARNING_SIGNS,
  STRENGTH_INDICATORS
};
