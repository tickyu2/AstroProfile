/**
 * complexDiagnosticEngine.js
 * ==========================
 *
 * Diagnoses which psychological complexes are currently active.
 * Part of the Liz Greene Cathedral - Phase 2: Transformative Journey
 *
 * Based on Jungian complex theory as applied by Liz Greene:
 * - Complexes are emotionally charged clusters of images and ideas
 * - They act autonomously when activated
 * - They have a core (archetype) and a shell (personal experience)
 * - Active transits and life circumstances trigger them
 *
 * GENESIS AstroProfile - January 2026
 */

// =============================================================================
// COMPLEX DEFINITIONS
// =============================================================================

export const PSYCHOLOGICAL_COMPLEXES = {
  // PARENTAL COMPLEXES
  motherComplex: {
    name: 'Mother Complex',
    archetype: 'Great Mother',
    planets: ['Moon', 'Pluto', 'Ceres'],
    houses: [4, 10],
    description: 'The emotionally charged cluster around the mother figure and nurturing',
    positive: {
      expression: 'Deep nurturing capacity, emotional wisdom, strong intuition',
      gift: 'Ability to create emotional safety for self and others'
    },
    negative: {
      expression: 'Dependency, smothering, inability to separate, emotional manipulation',
      wound: 'Feeling unloved, abandoned, or devoured by mother\'s needs'
    },
    triggers: [
      'Caretaking situations',
      'Dependency needs arising',
      'Nurturing others or being nurtured',
      'Family gatherings',
      'Pregnancy, birth, or mothering'
    ],
    somatic: 'Stomach issues, eating patterns, breast/chest area',
    lunaPrompt: 'What do you still need from a mother that you haven\'t learned to give yourself?'
  },

  fatherComplex: {
    name: 'Father Complex',
    archetype: 'Sky Father / Senex',
    planets: ['Sun', 'Saturn'],
    houses: [4, 10],
    description: 'The emotionally charged cluster around the father figure and authority',
    positive: {
      expression: 'Inner authority, self-discipline, healthy ambition',
      gift: 'Ability to structure, achieve, and provide'
    },
    negative: {
      expression: 'Authority issues, chronic inadequacy, fear of judgment',
      wound: 'Feeling inadequate, criticized, or abandoned by father'
    },
    triggers: [
      'Authority figures',
      'Performance reviews, evaluations',
      'Competition, achievement pressure',
      'Male figures in power',
      'Career decisions'
    ],
    somatic: 'Skeletal issues, knees, spine, skin',
    lunaPrompt: 'Whose approval are you still seeking? What would it mean to become your own authority?'
  },

  // RELATIONSHIP COMPLEXES
  abandonmentComplex: {
    name: 'Abandonment Complex',
    archetype: 'The Orphan',
    planets: ['Moon', 'Saturn', 'Chiron'],
    houses: [4, 7, 8],
    description: 'The fear of being left, rejected, or alone',
    positive: {
      expression: 'Self-reliance, resilience, appreciation for connection',
      gift: 'Deep capacity for loyalty and commitment'
    },
    negative: {
      expression: 'Clinging, preemptive rejection, self-sabotage in relationships',
      wound: 'Early loss, emotional unavailability, inconsistent care'
    },
    triggers: [
      'Partner seeming distant',
      'Endings of any kind',
      'Being alone unexpectedly',
      'Others\' independence',
      'Transitions and changes'
    ],
    somatic: 'Heart area, arms reaching, breath holding',
    lunaPrompt: 'What part of you are you afraid will be abandoned if truly seen?'
  },

  betrayalComplex: {
    name: 'Betrayal Complex',
    archetype: 'The Betrayed',
    planets: ['Pluto', 'Neptune', 'Mars'],
    houses: [8, 12],
    description: 'The wound of trust broken and the fear of it happening again',
    positive: {
      expression: 'Discernment, protection of vulnerability, earned trust',
      gift: 'Deep understanding of human nature'
    },
    negative: {
      expression: 'Paranoia, inability to trust, preemptive betrayal',
      wound: 'Significant betrayal by trusted figure'
    },
    triggers: [
      'Secrets being kept',
      'Unexpected changes in others',
      'Vulnerability in intimacy',
      'Others\' hidden motives',
      'Financial or emotional dependence'
    ],
    somatic: 'Back (stabbing), gut (gut feelings), hypervigilance',
    lunaPrompt: 'What would it cost you to trust again? What does it cost you not to?'
  },

  rejectionComplex: {
    name: 'Rejection Complex',
    archetype: 'The Outcast',
    planets: ['Venus', 'Saturn', 'Chiron'],
    houses: [1, 7, 11],
    description: 'The wound of not being wanted, chosen, or valued',
    positive: {
      expression: 'Self-acceptance, authentic connection, selective belonging',
      gift: 'Freedom from needing universal approval'
    },
    negative: {
      expression: 'People-pleasing, preemptive withdrawal, chronic unworthiness',
      wound: 'Being explicitly rejected or consistently overlooked'
    },
    triggers: [
      'Social situations',
      'Dating, attraction',
      'Group exclusion',
      'Not being chosen',
      'Criticism or feedback'
    ],
    somatic: 'Skin (boundary), throat (swallowing rejection), heart',
    lunaPrompt: 'What if the rejection you fear most has already happened, and you survived?'
  },

  // POWER COMPLEXES
  powerComplex: {
    name: 'Power Complex',
    archetype: 'The Tyrant / The Victim',
    planets: ['Pluto', 'Mars', 'Sun'],
    houses: [8, 10, 1],
    description: 'The wound around power - having too much, too little, or fearing it',
    positive: {
      expression: 'Empowerment, leadership, transformative impact',
      gift: 'Ability to create meaningful change'
    },
    negative: {
      expression: 'Domination, submission, power games, manipulation',
      wound: 'Abuse of power experienced or witnessed'
    },
    triggers: [
      'Power imbalances',
      'Feeling controlled',
      'Opportunities for influence',
      'Vulnerability',
      'Others\' success or failure'
    ],
    somatic: 'Solar plexus, jaw (control), hands (grasping)',
    lunaPrompt: 'Where do you give your power away? Where do you take power that isn\'t yours?'
  },

  inferiorityComplex: {
    name: 'Inferiority Complex',
    archetype: 'The Small One',
    planets: ['Saturn', 'Chiron', 'Sun'],
    houses: [1, 6, 10],
    description: 'The persistent sense of being "less than" others',
    positive: {
      expression: 'Humility, realistic self-assessment, motivation to grow',
      gift: 'Absence of arrogance, genuine appreciation of others'
    },
    negative: {
      expression: 'Self-deprecation, overcompensation, chronic comparison',
      wound: 'Consistent messaging of inadequacy'
    },
    triggers: [
      'Comparing to others',
      'Being evaluated',
      'Public performance',
      'Others\' achievements',
      'Areas of weakness'
    ],
    somatic: 'Posture (shrinking), voice (small), eye contact',
    lunaPrompt: 'What would remain true about your worth if you achieved nothing else?'
  },

  // IDENTITY COMPLEXES
  saviorComplex: {
    name: 'Savior Complex',
    archetype: 'The Redeemer',
    planets: ['Neptune', 'Jupiter', 'Sun'],
    houses: [12, 6, 9],
    description: 'The compulsion to rescue others, often at one\'s own expense',
    positive: {
      expression: 'Genuine service, compassion, meaningful help',
      gift: 'Capacity to truly support others\' growth'
    },
    negative: {
      expression: 'Martyrdom, enabling, superiority disguised as service',
      wound: 'Earned love only through helping, parentified child'
    },
    triggers: [
      'Others in distress',
      'Feeling needed',
      'Broken people',
      'Injustice',
      'Own emptiness'
    ],
    somatic: 'Shoulders (carrying others), exhaustion, boundary collapse',
    lunaPrompt: 'Who are you when you\'re not saving anyone? What needs saving in you?'
  },

  perfectionismComplex: {
    name: 'Perfectionism Complex',
    archetype: 'The Judge',
    planets: ['Saturn', 'Virgo', 'Mercury'],
    houses: [6, 10],
    description: 'The compulsion to be without flaw, constantly self-critical',
    positive: {
      expression: 'Excellence, high standards, quality work',
      gift: 'Attention to detail, craftsmanship'
    },
    negative: {
      expression: 'Paralysis, chronic dissatisfaction, self-attack',
      wound: 'Conditional love based on performance'
    },
    triggers: [
      'Making mistakes',
      'Others\' criticism',
      'Imperfect results',
      'Comparison to ideal',
      'Public work'
    ],
    somatic: 'Tension, grinding teeth, tight muscles, digestive issues',
    lunaPrompt: 'What becomes possible when "good enough" is actually good enough?'
  },

  imposterComplex: {
    name: 'Imposter Complex',
    archetype: 'The Fraud',
    planets: ['Mercury', 'Neptune', 'Sun'],
    houses: [1, 10, 12],
    description: 'The fear of being exposed as not truly competent or worthy',
    positive: {
      expression: 'Intellectual humility, continued learning, authenticity',
      gift: 'Genuine rather than inflated self-presentation'
    },
    negative: {
      expression: 'Self-doubt, discounting achievements, fear of exposure',
      wound: 'Achievements dismissed, being told you\'re not what you seem'
    },
    triggers: [
      'Recognition, praise',
      'New roles',
      'Being seen as expert',
      'Success',
      'Others\' expectations'
    ],
    somatic: 'Anxiety symptoms, flushing, desire to disappear',
    lunaPrompt: 'What if you belong exactly where you are, and the only imposter is your self-doubt?'
  }
};

// =============================================================================
// DIAGNOSTIC FUNCTIONS
// =============================================================================

/**
 * Diagnose active complexes based on current circumstances
 * @param {object} input - Current state assessment
 * @returns {object} - Diagnostic results
 */
export function diagnoseActiveComplexes(input = {}) {
  const {
    currentEmotions = [],
    recentTriggers = [],
    physicalSymptoms = [],
    currentTransits = [],
    natalChart = null,
    selfAssessment = {}
  } = input;

  const results = [];

  for (const [complexId, complex] of Object.entries(PSYCHOLOGICAL_COMPLEXES)) {
    const activation = calculateComplexActivation(complex, {
      currentEmotions,
      recentTriggers,
      physicalSymptoms,
      currentTransits,
      natalChart,
      selfAssessment
    });

    if (activation.score > 30) {
      results.push({
        complexId,
        ...complex,
        activation
      });
    }
  }

  // Sort by activation score
  results.sort((a, b) => b.activation.score - a.activation.score);

  return {
    activeComplexes: results,
    primaryComplex: results[0] || null,
    totalActivation: results.reduce((sum, r) => sum + r.activation.score, 0),
    recommendation: generateRecommendation(results)
  };
}

/**
 * Calculate activation level for a specific complex
 */
function calculateComplexActivation(complex, context) {
  let score = 0;
  const factors = [];

  const { currentEmotions, recentTriggers, physicalSymptoms, currentTransits, natalChart, selfAssessment } = context;

  // Check emotional triggers
  const emotionalMatch = complex.triggers.some(trigger =>
    currentEmotions.some(emotion =>
      trigger.toLowerCase().includes(emotion.toLowerCase()) ||
      emotion.toLowerCase().includes(trigger.toLowerCase().split(' ')[0])
    )
  );
  if (emotionalMatch) {
    score += 25;
    factors.push('Emotional resonance');
  }

  // Check recent triggers
  const triggerMatch = complex.triggers.some(trigger =>
    recentTriggers.some(recent =>
      recent.toLowerCase().includes(trigger.toLowerCase().split(' ')[0])
    )
  );
  if (triggerMatch) {
    score += 30;
    factors.push('Recent trigger match');
  }

  // Check somatic symptoms
  if (physicalSymptoms.length > 0 && complex.somatic) {
    const somaticKeywords = complex.somatic.toLowerCase().split(/[,()]/);
    const somaticMatch = somaticKeywords.some(kw =>
      physicalSymptoms.some(symptom =>
        symptom.toLowerCase().includes(kw.trim())
      )
    );
    if (somaticMatch) {
      score += 20;
      factors.push('Somatic symptoms');
    }
  }

  // Check current transits
  if (currentTransits.length > 0) {
    const transitMatch = currentTransits.some(transit =>
      complex.planets.includes(transit.transitPlanet) ||
      complex.planets.includes(transit.natalPlanet)
    );
    if (transitMatch) {
      score += 15;
      factors.push('Transit activation');
    }
  }

  // Check natal chart emphasis
  if (natalChart) {
    // Check if complex planets are prominent in natal chart
    const hasNatalEmphasis = checkNatalEmphasis(natalChart, complex);
    if (hasNatalEmphasis) {
      score += 10;
      factors.push('Natal chart emphasis');
    }
  }

  // Self-assessment adjustment
  if (selfAssessment[complex.name]) {
    score += selfAssessment[complex.name] * 0.3;
    factors.push('Self-identified');
  }

  return {
    score: Math.min(100, score),
    level: score > 70 ? 'high' : score > 50 ? 'moderate' : score > 30 ? 'mild' : 'dormant',
    factors
  };
}

/**
 * Check if natal chart emphasizes complex planets
 */
function checkNatalEmphasis(natalChart, complex) {
  const planets = natalChart.planets || {};

  for (const planet of complex.planets) {
    const planetData = planets[planet] || planets[planet.toLowerCase()];
    if (planetData) {
      // Check if in angular house (1, 4, 7, 10)
      if ([1, 4, 7, 10].includes(planetData.house)) return true;

      // Check if conjunct Sun or Moon (within 10 degrees)
      // Simplified check - in same sign as Sun or Moon
      const sunSign = planets.Sun?.sign || planets.sun?.sign;
      const moonSign = planets.Moon?.sign || planets.moon?.sign;
      if (planetData.sign === sunSign || planetData.sign === moonSign) return true;
    }
  }

  return false;
}

/**
 * Generate recommendation based on active complexes
 */
function generateRecommendation(activeComplexes) {
  if (activeComplexes.length === 0) {
    return {
      summary: 'No major complexes are strongly activated at this time.',
      focus: 'General maintenance',
      practices: ['Continue regular self-reflection', 'Maintain grounding practices']
    };
  }

  const primary = activeComplexes[0];

  return {
    summary: `Your ${primary.name} appears most activated right now.`,
    focus: primary.name,
    understanding: `This complex is activated when: ${primary.triggers.slice(0, 3).join('; ')}.`,
    positive: `The gift within this complex: ${primary.positive.gift}`,
    shadow: `The shadow expression to watch: ${primary.negative.expression}`,
    practices: [
      `Journal prompt: "${primary.lunaPrompt}"`,
      `Body awareness: Notice sensations in ${primary.somatic}`,
      'When triggered, pause and name what you\'re feeling before reacting'
    ],
    lunaGuidance: `Luna says: ${primary.lunaPrompt}`
  };
}

// =============================================================================
// SELF-ASSESSMENT QUESTIONNAIRE
// =============================================================================

export const COMPLEX_ASSESSMENT_QUESTIONS = {
  motherComplex: [
    { text: 'I often feel I need to take care of others to feel valuable', scale: [1, 5] },
    { text: 'I struggle to ask for help when I need it', scale: [1, 5] },
    { text: 'My relationship with my mother significantly affects my current relationships', scale: [1, 5] }
  ],
  fatherComplex: [
    { text: 'I feel anxious around authority figures', scale: [1, 5] },
    { text: 'I often feel I\'m not achieving enough', scale: [1, 5] },
    { text: 'I struggle to feel confident in my decisions', scale: [1, 5] }
  ],
  abandonmentComplex: [
    { text: 'I often worry that people will leave me', scale: [1, 5] },
    { text: 'I find it hard to be alone', scale: [1, 5] },
    { text: 'I sometimes push people away before they can leave', scale: [1, 5] }
  ],
  betrayalComplex: [
    { text: 'I find it very difficult to trust people', scale: [1, 5] },
    { text: 'I often look for signs that others are deceiving me', scale: [1, 5] },
    { text: 'Past betrayals still significantly affect me', scale: [1, 5] }
  ],
  rejectionComplex: [
    { text: 'I often feel like I don\'t belong', scale: [1, 5] },
    { text: 'Criticism deeply affects me, even when constructive', scale: [1, 5] },
    { text: 'I sometimes avoid situations where I might be rejected', scale: [1, 5] }
  ],
  powerComplex: [
    { text: 'I often feel either too powerful or completely powerless', scale: [1, 5] },
    { text: 'Power dynamics in relationships concern me', scale: [1, 5] },
    { text: 'I sometimes struggle to assert myself appropriately', scale: [1, 5] }
  ],
  inferiorityComplex: [
    { text: 'I often compare myself unfavorably to others', scale: [1, 5] },
    { text: 'I struggle to accept compliments', scale: [1, 5] },
    { text: 'I often feel "less than" in social situations', scale: [1, 5] }
  ],
  saviorComplex: [
    { text: 'I often feel responsible for others\' wellbeing', scale: [1, 5] },
    { text: 'I find it hard to say no when someone needs help', scale: [1, 5] },
    { text: 'I sometimes feel resentful after helping others', scale: [1, 5] }
  ],
  perfectionismComplex: [
    { text: 'I have very high standards that are hard to meet', scale: [1, 5] },
    { text: 'I often procrastinate because I fear not doing something perfectly', scale: [1, 5] },
    { text: 'I\'m harder on myself than on others', scale: [1, 5] }
  ],
  imposterComplex: [
    { text: 'I often feel like I\'m fooling people about my competence', scale: [1, 5] },
    { text: 'I attribute my successes to luck rather than ability', scale: [1, 5] },
    { text: 'I fear being "found out" as less capable than people think', scale: [1, 5] }
  ]
};

/**
 * Calculate complex scores from assessment answers
 */
export function calculateAssessmentScores(answers) {
  const scores = {};

  for (const [complexId, questions] of Object.entries(COMPLEX_ASSESSMENT_QUESTIONS)) {
    const complexAnswers = questions.map((q, i) => answers[`${complexId}_${i}`] || 0);
    const avgScore = complexAnswers.reduce((a, b) => a + b, 0) / complexAnswers.length;
    scores[complexId] = (avgScore / 5) * 100; // Convert to 0-100
  }

  return scores;
}

// =============================================================================
// INTEGRATION WITH SATURN JOURNEY
// =============================================================================

/**
 * Get complex recommendations for Saturn phase
 */
export function getComplexesForSaturnPhase(saturnPhase, activeComplexes) {
  const phaseComplexFocus = {
    'post-return': ['fatherComplex', 'powerComplex', 'imposterComplex'],
    'waxing-square': ['inferiorityComplex', 'perfectionismComplex'],
    'opposition': ['abandonmentComplex', 'rejectionComplex'],
    'waning-square': ['saviorComplex', 'motherComplex'],
    'return-approaching': ['fatherComplex', 'powerComplex', 'betrayalComplex']
  };

  const relevantComplexes = phaseComplexFocus[saturnPhase] || [];

  return {
    saturnPhase,
    likelyActivated: relevantComplexes.map(id => PSYCHOLOGICAL_COMPLEXES[id]),
    currentlyActive: activeComplexes.filter(c =>
      relevantComplexes.includes(c.complexId)
    ),
    guidance: `During the ${saturnPhase} phase, pay particular attention to your ${relevantComplexes.map(id => PSYCHOLOGICAL_COMPLEXES[id]?.name).join(' and ')}.`
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  PSYCHOLOGICAL_COMPLEXES,
  COMPLEX_ASSESSMENT_QUESTIONS,
  diagnoseActiveComplexes,
  calculateAssessmentScores,
  getComplexesForSaturnPhase
};
