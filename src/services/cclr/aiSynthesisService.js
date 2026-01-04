/**
 * CCLR AI Synthesis Service
 *
 * Provides AI-powered synthesis and generation for CCLR.
 * - Generates angel responses
 * - Synthesizes wisdom from multiple angels
 * - Creates session summaries
 * - Provides recommendations
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { getAngelCouple } from '../../data/cclr/cosmicLoveAngels';
import { getConversationContext } from './messageService';

/**
 * Generate a response from an angel
 *
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Generated response
 */
export async function generateAngelResponse({
  sessionId,
  guestCoupleId,
  guestPersonId,
  partnerAName,
  partnerBName,
  partnerAConstitution,
  partnerBConstitution,
  currentMessage,
  conversationContext = []
}) {
  try {
    // Get the angel couple data
    const angelCouple = getAngelCouple(guestCoupleId);
    if (!angelCouple) {
      return {
        success: false,
        error: `Angel couple ${guestCoupleId} not found`
      };
    }

    // Determine which angel is speaking
    const isAngel1 = guestPersonId === angelCouple.angel1.personId;
    const angel = isAngel1 ? angelCouple.angel1 : angelCouple.angel2;
    const systemPromptKey = isAngel1 ?
      Object.keys(angelCouple.systemPrompts)[0] :
      Object.keys(angelCouple.systemPrompts)[1];
    const systemPrompt = angelCouple.systemPrompts[systemPromptKey];

    // Get conversation context if not provided
    let context = conversationContext;
    if (context.length === 0) {
      const contextResult = await getConversationContext(sessionId, 15);
      if (contextResult.success) {
        context = contextResult.context;
      }
    }

    // Call Cloud Function to generate response
    const generateCCLRResponse = httpsCallable(functions, 'generateCCLRResponse');

    const result = await generateCCLRResponse({
      systemPrompt,
      angelName: angel.name,
      angelPersonId: guestPersonId,
      coupleId: guestCoupleId,
      coupleName: angelCouple.coupleName,
      conversationContext: context,
      currentMessage,
      partnerAName,
      partnerBName,
      partnerAConstitution,
      partnerBConstitution,
      angelSpecializations: angel.specializations,
      angelConversationStyle: angel.conversationStyle
    });

    return {
      success: true,
      response: result.data.response,
      angelName: angel.name,
      angelIcon: angel.icon,
      angelColor: angel.color
    };
  } catch (error) {
    console.error('Error generating angel response:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Synthesize wisdom from multiple angel messages
 *
 * @param {Array} messages - Array of angel messages
 * @param {string} query - The topic/question being synthesized
 * @returns {Promise<Object>} Synthesized wisdom
 */
export async function synthesizeAngelWisdom(messages, query) {
  try {
    const synthesizeWisdom = httpsCallable(functions, 'synthesizeAngelWisdom');

    const result = await synthesizeWisdom({
      messages,
      query
    });

    return {
      success: true,
      synthesis: result.data.synthesis,
      angelsIncluded: result.data.angelsIncluded,
      keyThemes: result.data.keyThemes
    };
  } catch (error) {
    console.error('Error synthesizing wisdom:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a session summary
 *
 * @param {string} sessionId - The session to summarize
 * @returns {Promise<Object>} Session summary
 */
export async function generateSessionSummary(sessionId) {
  try {
    const generateSummary = httpsCallable(functions, 'generateCCLRSessionSummary');

    const result = await generateSummary({
      sessionId
    });

    return {
      success: true,
      summary: result.data.summary,
      keyInsights: result.data.keyInsights,
      angelsConsulted: result.data.angelsConsulted,
      recommendedNextSteps: result.data.recommendedNextSteps,
      progressIndicators: result.data.progressIndicators
    };
  } catch (error) {
    console.error('Error generating session summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get angel recommendations based on couple's challenges
 *
 * @param {Object} params - Couple's situation
 * @returns {Promise<Object>} Recommended angel couples
 */
export async function getAngelRecommendations({
  challenges,
  relationshipType,
  partnerAConstitution,
  partnerBConstitution,
  currentAngels = []
}) {
  try {
    const getRecommendations = httpsCallable(functions, 'recommendCCLRAngels');

    const result = await getRecommendations({
      challenges,
      relationshipType,
      partnerAConstitution,
      partnerBConstitution,
      currentAngels
    });

    return {
      success: true,
      recommendations: result.data.recommendations,
      reasoning: result.data.reasoning
    };
  } catch (error) {
    console.error('Error getting angel recommendations:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate action items from a session
 *
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} Extracted action items
 */
export async function generateActionItems(sessionId) {
  try {
    const extractActionItems = httpsCallable(functions, 'extractCCLRActionItems');

    const result = await extractActionItems({
      sessionId
    });

    return {
      success: true,
      actionItems: result.data.actionItems,
      prioritized: result.data.prioritized
    };
  } catch (error) {
    console.error('Error generating action items:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a progress report
 *
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} Progress report
 */
export async function generateProgressReport(sessionId) {
  try {
    const generateReport = httpsCallable(functions, 'generateCCLRProgressReport');

    const result = await generateReport({
      sessionId
    });

    return {
      success: true,
      report: result.data.report,
      metrics: result.data.metrics,
      trends: result.data.trends,
      recommendations: result.data.recommendations
    };
  } catch (error) {
    console.error('Error generating progress report:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate constitutional analysis for the couple
 *
 * @param {Object} partnerA - Partner A's data with constitution
 * @param {Object} partnerB - Partner B's data with constitution
 * @returns {Promise<Object>} Constitutional analysis
 */
export async function generateConstitutionalAnalysis(partnerA, partnerB) {
  try {
    const analyzeConstitutions = httpsCallable(functions, 'analyzeCCLRConstitutions');

    const result = await analyzeConstitutions({
      partnerA,
      partnerB
    });

    return {
      success: true,
      analysis: result.data.analysis,
      compatibility: result.data.compatibility,
      strengthAreas: result.data.strengthAreas,
      growthAreas: result.data.growthAreas,
      recommendedAngels: result.data.recommendedAngels
    };
  } catch (error) {
    console.error('Error generating constitutional analysis:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate an opening message from the angel couple
 *
 * @param {string} guestCoupleId - The angel couple ID
 * @param {Object} partnerA - Partner A info
 * @param {Object} partnerB - Partner B info
 * @param {string} challenge - The couple's primary challenge
 * @returns {Promise<Object>} Opening messages from both angels
 */
export async function generateOpeningMessages(guestCoupleId, partnerA, partnerB, challenge) {
  try {
    const angelCouple = getAngelCouple(guestCoupleId);
    if (!angelCouple) {
      return {
        success: false,
        error: `Angel couple ${guestCoupleId} not found`
      };
    }

    const generateOpening = httpsCallable(functions, 'generateCCLROpening');

    const result = await generateOpening({
      coupleId: guestCoupleId,
      coupleName: angelCouple.coupleName,
      angel1: angelCouple.angel1,
      angel2: angelCouple.angel2,
      systemPrompts: angelCouple.systemPrompts,
      partnerA,
      partnerB,
      challenge,
      relationshipStory: angelCouple.relationshipStory
    });

    return {
      success: true,
      angel1Message: result.data.angel1Message,
      angel2Message: result.data.angel2Message,
      angel1: angelCouple.angel1,
      angel2: angelCouple.angel2
    };
  } catch (error) {
    console.error('Error generating opening messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate a closing/wrap-up from angels
 *
 * @param {string} sessionId - The session ID
 * @param {string} guestCoupleId - The primary angel couple
 * @returns {Promise<Object>} Closing messages
 */
export async function generateClosingMessages(sessionId, guestCoupleId) {
  try {
    const angelCouple = getAngelCouple(guestCoupleId);
    if (!angelCouple) {
      return {
        success: false,
        error: `Angel couple ${guestCoupleId} not found`
      };
    }

    const generateClosing = httpsCallable(functions, 'generateCCLRClosing');

    const result = await generateClosing({
      sessionId,
      coupleId: guestCoupleId,
      coupleName: angelCouple.coupleName,
      angel1: angelCouple.angel1,
      angel2: angelCouple.angel2,
      systemPrompts: angelCouple.systemPrompts
    });

    return {
      success: true,
      angel1Message: result.data.angel1Message,
      angel2Message: result.data.angel2Message,
      summary: result.data.summary,
      actionItems: result.data.actionItems
    };
  } catch (error) {
    console.error('Error generating closing messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  generateAngelResponse,
  synthesizeAngelWisdom,
  generateSessionSummary,
  getAngelRecommendations,
  generateActionItems,
  generateProgressReport,
  generateConstitutionalAnalysis,
  generateOpeningMessages,
  generateClosingMessages
};
