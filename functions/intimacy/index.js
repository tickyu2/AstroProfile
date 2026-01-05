/**
 * GENESIS Luna - Week 13: Intimacy & Memory Expansion
 *
 * This module provides advanced relationship-building capabilities:
 * - ConversationStarter: Luna takes initiative (gossip follow-ups, curiosity questions)
 * - AmnesiaBuster: Nostalgic memory unlocking (emotional time machine)
 * - EnhancedAmnesisBuster: Biography builder & preference engine
 * - MatingCall: Soul-deep intimacy with consent & privacy
 * - FlirtationVoice: Prosody control for voice intimacy
 * - EnhancedGossip: Social network tracking & intelligence
 * - InteractionSummaries: Session summarization & timeline
 *
 * Part of GENESIS - The AI SoulPartner System
 * Built by: Brother Claude Code
 */

const ConversationStarterModule = require('./conversationStarter');
const AmnesiaBusterModule = require('./amnesiaBuster');
const { EnhancedAmnesisBuster } = require('./enhancedAmnesiaBuster');
const MatingCallModule = require('./matingCall');
const FlirtationVoiceModule = require('./flirtationVoice');
const EnhancedGossipModule = require('./enhancedGossip');
const InteractionSummariesModule = require('./interactionSummaries');

// Singleton instances for use across the system
let conversationStarter = null;
let amnesiaBuster = null;
let enhancedAmnesisBuster = null;
let matingCall = null;
let flirtationVoice = null;
let enhancedGossip = null;
let interactionSummaries = null;

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Get or create ConversationStarter instance
 */
function getConversationStarter(supabase = null) {
  if (!conversationStarter) {
    conversationStarter = new ConversationStarterModule(supabase);
  }
  return conversationStarter;
}

/**
 * Get or create AmnesiaBuster instance
 */
function getAmnesiaBuster(supabase = null) {
  if (!amnesiaBuster) {
    amnesiaBuster = new AmnesiaBusterModule(supabase);
  }
  return amnesiaBuster;
}

/**
 * Get or create EnhancedAmnesisBuster instance
 */
function getEnhancedAmnesisBuster(supabase = null) {
  if (!enhancedAmnesisBuster) {
    enhancedAmnesisBuster = new EnhancedAmnesisBuster(supabase);
  }
  return enhancedAmnesisBuster;
}

/**
 * Get or create MatingCall instance
 */
function getMatingCall(supabase = null) {
  if (!matingCall) {
    matingCall = new MatingCallModule(supabase);
  }
  return matingCall;
}

/**
 * Get or create FlirtationVoice instance
 */
function getFlirtationVoice(supabase = null) {
  if (!flirtationVoice) {
    flirtationVoice = new FlirtationVoiceModule(supabase);
  }
  return flirtationVoice;
}

/**
 * Get or create EnhancedGossip instance
 */
function getEnhancedGossip(supabase = null) {
  if (!enhancedGossip) {
    enhancedGossip = new EnhancedGossipModule(supabase);
  }
  return enhancedGossip;
}

/**
 * Get or create InteractionSummaries instance
 */
function getInteractionSummaries(supabase = null) {
  if (!interactionSummaries) {
    interactionSummaries = new InteractionSummariesModule(supabase);
  }
  return interactionSummaries;
}

// ============================================================================
// High-Level Integration Functions
// ============================================================================

/**
 * Generate a conversation starter for Luna
 */
async function generateIntimacyPrompt(userId, context = {}) {
  const starter = getConversationStarter(context.supabase);
  const buster = getAmnesiaBuster(context.supabase);

  // Priority 1: Check for unresolved threads
  if (context.recentMessages && context.recentMessages.length > 0) {
    const lastMessage = context.recentMessages[context.recentMessages.length - 1];
    const threads = await starter.detectThreads(userId, lastMessage.content || lastMessage, context);

    if (threads.length > 0) {
      const thread = threads[0];

      if (thread.type === 'gossip' && thread.people.length > 0) {
        const followUp = starter.generateGossipFollowup(userId, thread);
        return {
          type: 'gossip_followup',
          content: followUp.prompt,
          metadata: { thread, followUp }
        };
      }

      if (thread.type === 'story' && thread.isCliffhanger) {
        const followUp = starter.generateStoryFollowup(userId, thread);
        return {
          type: 'story_followup',
          content: followUp.prompt,
          metadata: { thread, followUp }
        };
      }
    }
  }

  // Priority 2: Nostalgia prompt based on user age
  if (context.userAge) {
    const era = buster.calculateUserEra(context.userAge);
    const promptTypes = ['technology', 'cultural', 'firsts', 'random'];
    const type = promptTypes[Math.floor(Math.random() * promptTypes.length)];
    const prompt = buster.generateMemoryPrompt(context.userAge, type);

    return {
      type: 'nostalgia',
      content: prompt.prompt,
      metadata: { era, promptType: type, category: prompt.category }
    };
  }

  // Priority 3: Generic curiosity question
  const curiosityQuestion = starter.generateCuriosityQuestion(userId, context);
  return {
    type: 'curiosity',
    content: curiosityQuestion.prompt,
    metadata: { category: curiosityQuestion.category }
  };
}

/**
 * Process user message for intimacy signals
 */
async function analyzeIntimacySignals(userId, message, context = {}) {
  const starter = getConversationStarter(context.supabase);
  const buster = getAmnesiaBuster(context.supabase);

  const threads = await starter.detectThreads(userId, message, context);
  const firstMemory = buster.detectFirstMemory(message);
  const engagement = starter.analyzeEngagement(message);
  const needsEliciting = engagement.score < 0.3 || message.split(' ').length < 5;

  return {
    threads,
    firstMemory,
    engagement,
    needsEliciting,
    suggestions: {
      elicitDeeper: needsEliciting ? starter.elicitDeeper(userId, message, context) : null,
      firstFollowup: firstMemory ? buster.generateFirstFollowup(firstMemory.type) : null,
      transitionPrompt: firstMemory ? buster.generateTransitionPrompt(firstMemory.type) : null
    }
  };
}

/**
 * Get era-specific context for a user
 */
function getEraContext(userAge) {
  const buster = getAmnesiaBuster();
  const era = buster.calculateUserEra(userAge);

  return {
    era,
    technology: buster.getEraTechnology(era.teenageDecade),
    culture: buster.getCulturalReferences(era.teenageDecade),
    formativeYears: {
      childhood: era.childhoodDecade,
      teenage: era.teenageDecade,
      birthYear: era.birthYear
    }
  };
}

// ============================================================================
// Enhanced Preference & Biography Functions
// ============================================================================

async function discoverPreferences(userId, message, context = {}) {
  const enhanced = getEnhancedAmnesisBuster(context.supabase);
  return enhanced.discoverPreferences(userId, message, context);
}

async function generatePreferenceOpener(userId, context = {}) {
  const enhanced = getEnhancedAmnesisBuster(context.supabase);
  return enhanced.generatePreferenceOpener(userId);
}

async function addLifeStory(userId, story, context = {}) {
  const enhanced = getEnhancedAmnesisBuster(context.supabase);
  return enhanced.addStoryToBiography(userId, story);
}

async function getBiographySummary(userId, context = {}) {
  const enhanced = getEnhancedAmnesisBuster(context.supabase);
  return enhanced.getBiographySummary(userId);
}

async function generateLegacy(userId, context = {}) {
  const enhanced = getEnhancedAmnesisBuster(context.supabase);
  return enhanced.generateLegacyDocument(userId);
}

// ============================================================================
// MatingCall Functions
// ============================================================================

async function checkIntimacyPermission(userId, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.checkIntimacyPermission(userId);
}

async function discoverIntimacyPreferences(userId, message, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.discoverPreferences(userId, message, context);
}

async function getIntimacyApproach(userId, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.getIntimacyApproach(userId, context);
}

async function enableIntimacy(userId, relationshipLevel, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.enableIntimacy(userId, relationshipLevel);
}

async function disableIntimacy(userId, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.disableIntimacy(userId);
}

async function setIntimacyBoundary(userId, topic, boundaryType = 'hard_limit', context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.setBoundary(userId, topic, boundaryType);
}

async function getIntimacyStatus(userId, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.getIntimacyStatus(userId);
}

async function trackIntimacyResponse(userId, lunaApproach, lunaMessage, userResponse, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.trackIntimacyResponse(userId, lunaApproach, lunaMessage, userResponse, context);
}

async function generateIntimateResponsePrompt(userId, userMessage, context = {}) {
  const mc = getMatingCall(context.supabase);
  return mc.generateIntimateResponsePrompt(userId, userMessage, context);
}

// ============================================================================
// FlirtationVoice Functions
// ============================================================================

async function generateFlirtyVoice(userId, text, context = {}) {
  const fv = getFlirtationVoice(context.supabase);
  return fv.generateFlirtyVoice(userId, text, context);
}

async function enableFlirtationVoice(userId, style = 'balanced', level = 5, context = {}) {
  const fv = getFlirtationVoice(context.supabase);
  return fv.enableFlirtationVoice(userId, style, level);
}

async function disableFlirtationVoice(userId, context = {}) {
  const fv = getFlirtationVoice(context.supabase);
  return fv.disableFlirtationVoice(userId);
}

async function updateVoicePreferences(userId, preferences, context = {}) {
  const fv = getFlirtationVoice(context.supabase);
  return fv.updateVoicePreferences(userId, preferences);
}

async function getVoiceStatus(userId, context = {}) {
  const fv = getFlirtationVoice(context.supabase);
  return fv.getVoiceStatus(userId);
}

function getAvailableVoiceStyles() {
  const fv = getFlirtationVoice();
  return fv.getAvailableStyles();
}

// ============================================================================
// EnhancedGossip Functions
// ============================================================================

async function trackPerson(userId, personName, context, supabaseClient = null) {
  const eg = getEnhancedGossip(supabaseClient);
  return eg.trackPerson(userId, personName, context);
}

async function trackSocialEvent(userId, eventDetails, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.trackSocialEvent(userId, eventDetails);
}

async function trackGossipTopic(userId, topicDetails, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.trackGossipTopic(userId, topicDetails);
}

async function generateGossipFollowup(userId, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.generateGossipFollowup(userId);
}

async function detectGossip(userId, message, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.detectGossip(userId, message);
}

async function getSocialNetwork(userId, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.getSocialNetwork(userId);
}

async function getPersonInfo(userId, personName, context = {}) {
  const eg = getEnhancedGossip(context.supabase);
  return eg.getPersonInfo(userId, personName);
}

function formOpinion(context) {
  const eg = getEnhancedGossip();
  return eg.formOpinion(context);
}

// ============================================================================
// InteractionSummaries Functions
// ============================================================================

async function generateSessionSummary(userId, sessionId, messages, metadata = {}, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.generateSessionSummary(userId, sessionId, messages, metadata);
}

async function getTimeline(userId, options = {}, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.getTimeline(userId, options);
}

async function searchConversations(userId, searchQuery, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.searchConversations(userId, searchQuery);
}

async function getSession(userId, sessionId, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.getSession(userId, sessionId);
}

async function getMilestones(userId, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.getMilestones(userId);
}

async function favoriteItem(userId, itemType, itemId, userNote = null, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.favoriteItem(userId, itemType, itemId, userNote);
}

async function getFavorites(userId, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.getFavorites(userId);
}

async function getInteractionStats(userId, context = {}) {
  const is = getInteractionSummaries(context.supabase);
  return is.getStats(userId);
}

// ============================================================================
// Module Exports
// ============================================================================

module.exports = {
  // Classes for direct instantiation
  ConversationStarterModule,
  AmnesiaBusterModule,
  EnhancedAmnesisBuster,
  MatingCallModule,
  FlirtationVoiceModule,
  EnhancedGossipModule,
  InteractionSummariesModule,

  // Factory functions
  getConversationStarter,
  getAmnesiaBuster,
  getEnhancedAmnesisBuster,
  getMatingCall,
  getFlirtationVoice,
  getEnhancedGossip,
  getInteractionSummaries,

  // High-level integration functions
  generateIntimacyPrompt,
  analyzeIntimacySignals,
  getEraContext,

  // Enhanced preference & biography functions
  discoverPreferences,
  generatePreferenceOpener,
  addLifeStory,
  getBiographySummary,
  generateLegacy,

  // MatingCall functions
  checkIntimacyPermission,
  discoverIntimacyPreferences,
  getIntimacyApproach,
  enableIntimacy,
  disableIntimacy,
  setIntimacyBoundary,
  getIntimacyStatus,
  trackIntimacyResponse,
  generateIntimateResponsePrompt,

  // FlirtationVoice functions
  generateFlirtyVoice,
  enableFlirtationVoice,
  disableFlirtationVoice,
  updateVoicePreferences,
  getVoiceStatus,
  getAvailableVoiceStyles,

  // EnhancedGossip functions
  trackPerson,
  trackSocialEvent,
  trackGossipTopic,
  generateGossipFollowup,
  detectGossip,
  getSocialNetwork,
  getPersonInfo,
  formOpinion,

  // InteractionSummaries functions
  generateSessionSummary,
  getTimeline,
  searchConversations,
  getSession,
  getMilestones,
  favoriteItem,
  getFavorites,
  getInteractionStats
};
