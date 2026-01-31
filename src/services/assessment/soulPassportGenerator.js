/**
 * Soul Passport Generator
 * Generates Brain 1A compatible JSON from assessment responses
 */

import { AssessmentScoring } from './assessmentScoring';

/**
 * Generate complete Soul Passport from assessment responses
 * Integrates with Brain 1A structure
 * @param {Object} responses - All assessment responses
 * @param {Object} baziData - Optional BaZi constitutional data
 * @returns {Object} Complete Soul Passport JSON
 */
export function generateSoulPassport(responses, baziData = null) {
  // Calculate scores from responses
  const bigFiveScores = AssessmentScoring.calculateBigFive(responses.bigFive || []);
  const mbtiType = AssessmentScoring.calculateMBTI(responses.mbti || []);
  const loveLanguages = AssessmentScoring.calculateLoveLanguages(responses.loveLanguages || []);
  const dailyLifeAnalysis = AssessmentScoring.analyzeDailyLife(responses.dailyLife || {});

  return {
    soulPassport: {
      meta: {
        version: "1.0.0",
        schemaVersion: "1.0.0",
        profileId: `profile-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastCalculated: new Date().toISOString(),
        source: "GENESIS Assessment System",
        totalQuestions: 136
      },

      // Layer 4: Learned Patterns (from questionnaires)
      psychologyLayer: {
        weight: 0.40,
        sources: ["Big Five", "MBTI", "Enneagram", "Attachment"],
        note: "These patterns can evolve with personal growth",

        bigFive: {
          openness: {
            score: bigFiveScores.scores.openness,
            percentile: getPercentile(bigFiveScores.scores.openness),
            description: bigFiveScores.interpretation.openness
          },
          conscientiousness: {
            score: bigFiveScores.scores.conscientiousness,
            percentile: getPercentile(bigFiveScores.scores.conscientiousness),
            description: bigFiveScores.interpretation.conscientiousness
          },
          extraversion: {
            score: bigFiveScores.scores.extraversion,
            percentile: getPercentile(bigFiveScores.scores.extraversion),
            description: bigFiveScores.interpretation.extraversion
          },
          agreeableness: {
            score: bigFiveScores.scores.agreeableness,
            percentile: getPercentile(bigFiveScores.scores.agreeableness),
            description: bigFiveScores.interpretation.agreeableness
          },
          neuroticism: {
            score: bigFiveScores.scores.neuroticism,
            percentile: getPercentile(bigFiveScores.scores.neuroticism),
            description: bigFiveScores.interpretation.neuroticism
          }
        },

        mbti: {
          type: mbtiType.type,
          dichotomies: {
            energyDirection: `${mbtiType.type[0]} (${mbtiType.type[0] === 'E' ? 'Extraverted' : 'Introverted'}) - ${mbtiType.percentages.EI}% clarity`,
            information: `${mbtiType.type[1]} (${mbtiType.type[1] === 'N' ? 'Intuitive' : 'Sensing'}) - ${mbtiType.percentages.SN}% clarity`,
            decisions: `${mbtiType.type[2]} (${mbtiType.type[2] === 'T' ? 'Thinking' : 'Feeling'}) - ${mbtiType.percentages.TF}% clarity`,
            lifestyle: `${mbtiType.type[3]} (${mbtiType.type[3] === 'J' ? 'Judging' : 'Perceiving'}) - ${mbtiType.percentages.JP}% clarity`
          },
          cognitiveFunctions: mbtiType.cognitiveFunctions,
          description: mbtiType.description
        },

        enneagram: {
          coreType: null, // TODO: Implement Enneagram assessment
          wing: null,
          name: null,
          coreFear: null,
          coreDesire: null,
          growthDirection: null,
          stressDirection: null
        },

        attachmentStyle: {
          primary: null, // TODO: Implement Attachment assessment
          percentage: null,
          secondary: null,
          description: null
        }
      },

      // Layer 5: Life Context (from forms)
      lifeContext: {
        weight: 0.60,
        updatedAt: new Date().toISOString(),

        currentSituation: responses.lifeContext?.currentSituation || {},

        interests: {
          primary: responses.lifeContext?.primaryInterests || [],
          hobbies: responses.lifeContext?.hobbies || [],
          learningInterests: responses.lifeContext?.learningInterests || []
        },

        lifeGoals: {
          primary: responses.lifeContext?.primaryGoal || "",
          timeline: responses.lifeContext?.timeHorizon || "",
          secondary: responses.lifeContext?.secondaryGoals || []
        },

        values: {
          core: responses.lifeContext?.coreValues || [],
          professional: responses.lifeContext?.professionalValues || [],
          personal: responses.lifeContext?.personalValues || []
        }
      },

      // Layer 6: Relationship Patterns
      relationshipGuidance: {
        weight: 0.65,
        sources: ["Love Languages", "Attachment", "Conflict Style"],

        loveLanguages: {
          primary: loveLanguages.primary,
          secondary: loveLanguages.secondary,
          tertiary: loveLanguages.tertiary,
          ranking: loveLanguages.ranking
        },

        conflictStyle: {
          primary: dailyLifeAnalysis.domesticLabor.dishesConflict,
          flexibility: dailyLifeAnalysis.domesticLabor.dishesFlexibility,
          approach: null,
          pattern: null
        },

        intimacyStyle: {
          emotional: null,
          physical: null,
          intellectual: null
        }
      },

      // Daily Life Infrastructure (THE REVOLUTIONARY DATA!)
      dailyLifeInfrastructure: {
        weight: 0.70,
        source: "Scenario-based assessment",
        revolutionaryNote: "The 95% of life that isn't romance",

        financeArchitecture: dailyLifeAnalysis.financeArchitecture,
        domesticLabor: dailyLifeAnalysis.domesticLabor,
        stressRelief: dailyLifeAnalysis.stressRelief,
        dailyRhythms: dailyLifeAnalysis.dailyRhythms,
        environmentalNeeds: dailyLifeAnalysis.environmentalNeeds
      },

      // Constitutional Integration (if BaZi data provided)
      constitutionalIntegration: baziData ? {
        baziProvided: true,
        elementalFingerprint: baziData.elementalFingerprint || null,
        dayMaster: baziData.dayMaster || null,
        constitutionalHints: {
          dishes: dailyLifeAnalysis.domesticLabor.dishesConstitutionalHint,
          grocery: dailyLifeAnalysis.domesticLabor.groceryConstitutionalHint
        },
        crossValidation: "Constitutional hints from daily life scenarios can validate BaZi elemental patterns"
      } : {
        baziProvided: false,
        note: "Complete BaZi calculation for full constitutional integration"
      }
    }
  };
}

/**
 * Helper: Convert score to percentile descriptor
 */
function getPercentile(score) {
  if (score >= 80) return "Very High (80th+ percentile)";
  if (score >= 60) return "High (60th-79th percentile)";
  if (score >= 40) return "Medium (40th-59th percentile)";
  if (score >= 20) return "Low (20th-39th percentile)";
  return "Very Low (below 20th percentile)";
}

/**
 * Generate and save Soul Passport to Firebase
 */
export async function generateAndSaveSoulPassport(responses, userId, baziData = null, firebaseService = null) {
  const passport = generateSoulPassport(responses, baziData);

  if (firebaseService && userId) {
    try {
      await firebaseService.saveDocument(`users/${userId}/soulPassport`, passport);
      console.log('Soul Passport saved to Firebase');
    } catch (error) {
      console.error('Error saving Soul Passport:', error);
    }
  }

  // Also save to localStorage as backup
  localStorage.setItem('genesis-soul-passport', JSON.stringify(passport));

  return passport;
}

export default { generateSoulPassport, generateAndSaveSoulPassport };
