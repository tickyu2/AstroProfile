/**
 * Assessment Scoring Service
 * Calculates scores for Big Five, MBTI, Love Languages, and Daily Life
 */

export class AssessmentScoring {
  /**
   * Calculate Big Five (OCEAN) scores from responses
   * @param {Array} responses - Array of question responses
   * @returns {Object} Scores and interpretations for all 5 traits
   */
  static calculateBigFive(responses) {
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    const counts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    // Sum scores per trait
    responses.forEach(response => {
      const trait = response.trait;
      if (trait && scores.hasOwnProperty(trait)) {
        scores[trait] += response.score || 0;
        counts[trait]++;
      }
    });

    // Calculate percentages (1-5 scale → 0-100)
    const percentages = {};
    Object.keys(scores).forEach(trait => {
      if (counts[trait] > 0) {
        const average = scores[trait] / counts[trait];
        percentages[trait] = Math.round(((average - 1) / 4) * 100);
      } else {
        percentages[trait] = 50; // Default to medium if no responses
      }
    });

    return {
      scores: percentages,
      interpretation: this.interpretBigFive(percentages),
      rawScores: scores,
      questionCounts: counts
    };
  }

  /**
   * Interpret Big Five scores
   */
  static interpretBigFive(scores) {
    const interpretations = {};

    // Openness
    if (scores.openness >= 75) {
      interpretations.openness = "Highly curious, creative, and open to new experiences. Embraces abstract thinking and artistic pursuits.";
    } else if (scores.openness >= 50) {
      interpretations.openness = "Balanced between tradition and novelty. Open to new ideas but also values practical experience.";
    } else {
      interpretations.openness = "Prefers routine and familiarity. Practical, grounded, and focused on concrete realities.";
    }

    // Conscientiousness
    if (scores.conscientiousness >= 75) {
      interpretations.conscientiousness = "Highly organized, reliable, and goal-oriented. Strong self-discipline and attention to detail.";
    } else if (scores.conscientiousness >= 50) {
      interpretations.conscientiousness = "Balanced approach to organization. Can be disciplined when needed but flexible when appropriate.";
    } else {
      interpretations.conscientiousness = "Spontaneous and flexible. Prefers going with the flow over strict planning.";
    }

    // Extraversion
    if (scores.extraversion >= 75) {
      interpretations.extraversion = "Highly energized by social interaction. Outgoing, talkative, and thrives in group settings.";
    } else if (scores.extraversion >= 50) {
      interpretations.extraversion = "Ambivert - comfortable in both social and solitary settings. Adapts to different environments.";
    } else {
      interpretations.extraversion = "Introverted - recharges through solitude. Prefers deep one-on-one connections over large gatherings.";
    }

    // Agreeableness
    if (scores.agreeableness >= 75) {
      interpretations.agreeableness = "Highly cooperative, trusting, and empathetic. Prioritizes harmony and others' needs.";
    } else if (scores.agreeableness >= 50) {
      interpretations.agreeableness = "Balanced between cooperation and assertiveness. Can be diplomatic while maintaining boundaries.";
    } else {
      interpretations.agreeableness = "Direct and competitive. Values honest truth over diplomatic comfort. Strong personal boundaries.";
    }

    // Neuroticism
    if (scores.neuroticism >= 75) {
      interpretations.neuroticism = "Emotionally sensitive with deep feelings. May experience anxiety or mood fluctuations more intensely.";
    } else if (scores.neuroticism >= 50) {
      interpretations.neuroticism = "Moderate emotional reactivity. Generally stable but can be affected by significant stressors.";
    } else {
      interpretations.neuroticism = "Emotionally stable and resilient. Calm under pressure and quick to recover from setbacks.";
    }

    return interpretations;
  }

  /**
   * Calculate MBTI type from responses
   * @param {Array} responses - Array of question responses
   * @returns {Object} MBTI type, percentages, and cognitive functions
   */
  static calculateMBTI(responses) {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    responses.forEach(response => {
      if (response.value && scores.hasOwnProperty(response.value)) {
        scores[response.value] += response.score || 1;
      }
    });

    // Determine type
    const type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    // Calculate preference clarity percentages
    const calculateClarity = (a, b) => {
      const total = a + b;
      if (total === 0) return 50;
      return Math.round(Math.abs(a - b) / total * 100);
    };

    return {
      type,
      percentages: {
        EI: calculateClarity(scores.E, scores.I),
        SN: calculateClarity(scores.S, scores.N),
        TF: calculateClarity(scores.T, scores.F),
        JP: calculateClarity(scores.J, scores.P)
      },
      cognitiveFunctions: this.getCognitiveFunctions(type),
      description: this.getMBTIDescription(type),
      rawScores: scores
    };
  }

  /**
   * Get cognitive function stack for MBTI type
   */
  static getCognitiveFunctions(type) {
    const stacks = {
      'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
      'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
      'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
      'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
      'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
      'INFP': ['Fi', 'Ne', 'Si', 'Te'],
      'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
      'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
      'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
      'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
      'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
      'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
      'ESFP': ['Se', 'Fi', 'Te', 'Ni'],
      'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
      'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
      'ISFJ': ['Si', 'Fe', 'Ti', 'Ne']
    };
    return stacks[type] || [];
  }

  /**
   * Get MBTI type description
   */
  static getMBTIDescription(type) {
    const descriptions = {
      'ENTP': 'The Debater - Innovative, strategic, enterprising, and outspoken',
      'INTP': 'The Logician - Philosophical, objective, and analytical',
      'ENTJ': 'The Commander - Bold, imaginative, and strong-willed leaders',
      'INTJ': 'The Architect - Strategic, independent, and determined',
      'ENFP': 'The Campaigner - Enthusiastic, creative, and sociable free spirits',
      'INFP': 'The Mediator - Poetic, kind, and altruistic idealists',
      'ENFJ': 'The Protagonist - Charismatic, inspiring leaders',
      'INFJ': 'The Advocate - Idealistic, organized, and insightful',
      'ESTP': 'The Entrepreneur - Smart, energetic, and perceptive',
      'ISTP': 'The Virtuoso - Practical and observant experimenters',
      'ESTJ': 'The Executive - Organized, logical administrators',
      'ISTJ': 'The Logistician - Responsible and sincere traditionalists',
      'ESFP': 'The Entertainer - Spontaneous, energetic performers',
      'ISFP': 'The Adventurer - Flexible, charming artists',
      'ESFJ': 'The Consul - Caring, social, and popular helpers',
      'ISFJ': 'The Defender - Dedicated and warm protectors'
    };
    return descriptions[type] || '';
  }

  /**
   * Calculate Love Languages ranking
   * @param {Array} responses - Array of question responses
   * @returns {Object} Ranked love languages with percentages
   */
  static calculateLoveLanguages(responses) {
    const scores = {
      "Quality Time": 0,
      "Gifts": 0,
      "Words of Affirmation": 0,
      "Physical Touch": 0,
      "Acts of Service": 0
    };

    responses.forEach(response => {
      const language = response.language;
      if (language && scores.hasOwnProperty(language)) {
        scores[language] += response.score || 1;
      }
    });

    // Calculate total for percentage
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

    // Create ranked array
    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([language, score]) => ({
        language,
        score,
        percentage: Math.round((score / total) * 100)
      }));

    return {
      ranking: ranked,
      primary: ranked[0]?.language || "Not determined",
      secondary: ranked[1]?.language || "Not determined",
      tertiary: ranked[2]?.language || "Not determined",
      rawScores: scores
    };
  }

  /**
   * Analyze Daily Life Infrastructure responses
   * @param {Object} responses - Daily life scenario responses
   * @returns {Object} Analyzed daily life patterns
   */
  static analyzeDailyLife(responses) {
    return {
      financeArchitecture: {
        style: responses.fin1?.primary?.style || "Not assessed",
        philosophy: responses.fin1?.primary?.philosophy || "Not assessed",
        threshold: responses.fin2?.primary?.threshold || "Not assessed",
        thresholdStyle: responses.fin2?.primary?.style || "Not assessed",
        saveApproach: responses.fin3?.primary?.style || "Not assessed",
        saveRate: responses.fin3?.primary?.saveRate || "Not assessed"
      },
      domesticLabor: {
        // THE DISHES!
        dishesResponse: responses.dom1?.primary?.immediacy || "Not assessed",
        dishesStandard: responses.dom1?.primary?.standard || "Not assessed",
        dishesConstitutionalHint: responses.dom1?.primary?.constitutionalHint || null,
        // Followup
        dishesConflict: responses.dom1?.followup?.conflictStyle || "Not assessed",
        dishesFlexibility: responses.dom1?.followup?.flexibilityScore || null,
        // THE GROCERY BAGS!
        groceryApproach: responses.dom2?.primary?.approach || "Not assessed",
        groceryTrait: responses.dom2?.primary?.trait || "Not assessed",
        groceryConstitutionalHint: responses.dom2?.primary?.constitutionalHint || null,
        // Cooking & Cleaning
        cookingDivision: responses.dom3?.primary?.division || "Not assessed",
        cleaningStyle: responses.dom4?.primary?.style || "Not assessed"
      },
      stressRelief: {
        primaryStyle: responses.stress1?.primary?.style || "Not assessed",
        energy: responses.stress1?.primary?.energy || "Not assessed",
        intensity: responses.stress1?.primary?.intensity || "Not assessed",
        stressResponse: responses.stress2?.primary?.response || "Not assessed",
        stressPattern: responses.stress2?.primary?.pattern || "Not assessed",
        vacationStyle: responses.stress3?.primary?.style || "Not assessed",
        vacationPace: responses.stress3?.primary?.pace || "Not assessed"
      },
      dailyRhythms: {
        chronotype: responses.rhythm1?.primary?.chronotype || "Not assessed",
        naturalWakeTime: responses.rhythm1?.primary?.wakeTime || "Not assessed",
        morningNeeds: responses.rhythm2?.primary?.need || "Not assessed",
        morningSocialTolerance: responses.rhythm2?.primary?.socialTolerance || "Not assessed",
        eveningStyle: responses.rhythm3?.primary?.style || "Not assessed",
        eveningEnergy: responses.rhythm3?.primary?.energy || "Not assessed"
      },
      environmentalNeeds: {
        spaceStyle: responses.env1?.primary?.style || "Not assessed",
        visualStimulation: responses.env1?.primary?.stimulation || "Not assessed",
        temperaturePreference: responses.env2?.primary?.preference || "Not assessed",
        idealTemp: responses.env2?.primary?.temp || "Not assessed",
        noiseTolerance: responses.env3?.primary?.tolerance || "Not assessed",
        noiseSensitivity: responses.env3?.primary?.sensitivity || "Not assessed"
      }
    };
  }
}

export default AssessmentScoring;
