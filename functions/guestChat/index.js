/**
 * GUEST CHAT CLOUD FUNCTION
 *
 * Production-ready server-side chat processing for Guest Profile System:
 * - Calls Claude API for Einstein responses
 * - Calls Claude API for Luna coaching
 * - Writes to Brain 3 (messages), Brain 7 (witness), Brain 1B (facts)
 * - Real-time fact extraction using Brain 1B service (Person-Tie Rule)
 * - Neo4j integration for relationship-aware conversations
 *
 * Additional:
 * - handleLunaPrivateQuery: Private consultation with Luna (bypasses guest)
 *
 * Security: Uses service account with system_role for Brain writes
 *
 * Updated: January 11, 2026 - Neo4j Integration for enriched guest profiles
 */

const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');

// Import Brain 1B Service for real-time fact extraction
let brain1BService;
try {
  brain1BService = require('../memory/brain1BService');
} catch (e) {
  console.warn('[GuestChat] brain1BService not available:', e.message);
  brain1BService = null;
}

// Import Neo4j Guest Service for enriched profiles
let neo4jGuestService;
try {
  neo4jGuestService = require('../services/neo4jGuestService');
  neo4jGuestService.initialize();
  console.log('[GuestChat] Neo4j Guest Service initialized');
} catch (e) {
  console.warn('[GuestChat] neo4jGuestService not available:', e.message);
  neo4jGuestService = null;
}

// Import topic extractor for conversation memory
let topicExtractor;
try {
  topicExtractor = require('../utils/topicExtractor');
} catch (e) {
  console.warn('[GuestChat] topicExtractor not available:', e.message);
  topicExtractor = null;
}

// Import RAG Context Service for biography retrieval (Hello History pattern)
let ragContextService;
try {
  ragContextService = require('../services/ragContextService');
  console.log('[GuestChat] RAG Context Service loaded');
} catch (e) {
  console.warn('[GuestChat] ragContextService not available:', e.message);
  ragContextService = null;
}

// Import Nancy Protocol for Reagan's constitutional dependency on Nancy
let nancyProtocol;
try {
  nancyProtocol = require('../services/nancyProtocol');
  console.log('[GuestChat] Nancy Protocol loaded');
} catch (e) {
  console.warn('[GuestChat] nancyProtocol not available:', e.message);
  nancyProtocol = null;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Get Firestore instance
const db = admin.firestore();

/**
 * Main handler for guest chat messages
 */
async function handleGuestChat(data, context) {
  // Verify authentication
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const userId = context.auth.uid;
  const {
    partnerId,
    userMessage,
    conversationHistory,
    guestProfile,
    userConstitutional,
    learnedFacts,
    lunaMode,
    equationMode,       // If true, inject Equation Mode instruction block
    skipPostProcessing, // If true, skip Brain 1B, Neo4j, topic extraction (used by Round Table)
    userProfileId,      // AstroProfile ID for compartmentalization
    userProfileName     // Display name for context
  } = data;

  // Use userProfileId for Brain 3 compartmentalization if provided, fallback to userId
  const profileIdForStorage = userProfileId || userId;

  // Validate required fields
  if (!partnerId || !userMessage) {
    throw new Error('Missing required fields: partnerId, userMessage');
  }

  const timestamp = new Date().toISOString();
  const today = timestamp.split('T')[0];
  const threadId = `thread_${userId}_${partnerId}_${today}`;

  try {
    // 0. Retrieve Brain 2 facts (validated LTM) for enhanced context
    let brain2Facts = [];
    let brain2Summary = null;
    if (brain1BService && brain1BService.getBrain2Facts) {
      try {
        brain2Facts = await brain1BService.getBrain2Facts(userId);
        if (brain2Facts.length > 0) {
          console.log(`[Brain 2] Retrieved ${brain2Facts.length} validated facts for system prompt`);
        }

        // Also get user profile summary if available
        if (brain1BService.buildUserProfileSummary) {
          brain2Summary = await brain1BService.buildUserProfileSummary(userId);
        }
      } catch (brain2Error) {
        console.error('[Brain 2] Retrieval error:', brain2Error);
        // Continue without Brain 2 - use learnedFacts fallback
      }
    }

    // 0b. NEO4J ENRICHMENT - Get enriched guest profile with relationships, events, compatibility
    let neo4jEnrichment = null;
    let conversationContext = null;

    // Check if this is a couple profile - if so, fetch data from both partners
    const isCoupleProfile = partnerId.startsWith('couple_') && guestProfile?.partners;

    // Define neo4jGuestId at outer scope (needed for topic extraction and conversation memory)
    const neo4jGuestId = isCoupleProfile
      ? `guest_${partnerId}`
      : `guest_${partnerId.replace('historical_', '').replace('modern_', '')}`;

    if (neo4jGuestService && neo4jGuestService.isAvailable()) {
      try {
        // Sync user's constitutional data to Neo4j for compatibility calculation
        if (userConstitutional?.bazi) {
          await neo4jGuestService.syncUserProfile(userId, {
            fourPillars: {
              elementBalance: {
                fire: userConstitutional.bazi.element_balance?.fire || 0,
                wood: userConstitutional.bazi.element_balance?.wood || 0,
                water: userConstitutional.bazi.element_balance?.water || 0,
                metal: userConstitutional.bazi.element_balance?.metal || 0,
                earth: userConstitutional.bazi.element_balance?.earth || 0
              },
              dayPillar: { combined: userConstitutional.bazi.day_master?.stem || '' }
            },
            constitutionalType: userConstitutional.bazi.day_master?.element || ''
          });
        }

        if (isCoupleProfile) {
          // COUPLE PROFILE: Fetch Neo4j data from BOTH partners and merge
          console.log(`[Neo4j] Couple profile detected: ${partnerId}`);

          const partner1Id = guestProfile.partners?.person1?.profile_id;
          const partner2Id = guestProfile.partners?.person2?.profile_id;

          if (partner1Id && partner2Id) {
            // Convert profile IDs to Neo4j guest IDs
            const neo4jPartner1Id = `guest_${partner1Id.replace('historical_', '').replace('modern_', '')}`;
            const neo4jPartner2Id = `guest_${partner2Id.replace('historical_', '').replace('modern_', '')}`;

            console.log(`[Neo4j] Fetching data for both partners: ${neo4jPartner1Id}, ${neo4jPartner2Id}`);

            // Fetch enrichment for both partners in parallel
            const [enrichment1, enrichment2] = await Promise.all([
              neo4jGuestService.getEnrichedGuestProfile(neo4jPartner1Id, {
                userId,
                includeRelationships: true,
                includeEvents: true,
                includeEras: true,
                calculateCompatibility: true
              }).catch(err => {
                console.warn(`[Neo4j] Partner 1 (${neo4jPartner1Id}) fetch failed:`, err.message);
                return null;
              }),
              neo4jGuestService.getEnrichedGuestProfile(neo4jPartner2Id, {
                userId,
                includeRelationships: true,
                includeEvents: true,
                includeEras: true,
                calculateCompatibility: true
              }).catch(err => {
                console.warn(`[Neo4j] Partner 2 (${neo4jPartner2Id}) fetch failed:`, err.message);
                return null;
              })
            ]);

            // Merge enrichment data from both partners
            if (enrichment1 || enrichment2) {
              neo4jEnrichment = {
                isCoupleEnrichment: true,
                partner1: enrichment1,
                partner2: enrichment2,
                // Merge relationships (deduplicate by person name)
                relationships: [
                  ...(enrichment1?.relationships || []).map(r => ({ ...r, fromPartner: guestProfile.partners.person1.name })),
                  ...(enrichment2?.relationships || []).map(r => ({ ...r, fromPartner: guestProfile.partners.person2.name }))
                ].filter((r, i, arr) => arr.findIndex(x => x.person?.name === r.person?.name) === i),
                // Merge events (deduplicate by title)
                events: [
                  ...(enrichment1?.events || []),
                  ...(enrichment2?.events || [])
                ].filter((e, i, arr) => arr.findIndex(x => x.title === e.title) === i)
                  .sort((a, b) => (a.year || 0) - (b.year || 0)),
                // Combine eras from both partners
                eras: {
                  [guestProfile.partners.person1.name]: enrichment1?.eras || [],
                  [guestProfile.partners.person2.name]: enrichment2?.eras || []
                },
                // Average compatibility from both partners
                bestMatch: {
                  era: enrichment1?.bestMatch?.era || enrichment2?.bestMatch?.era,
                  compatibility: Math.round(
                    ((enrichment1?.bestMatch?.compatibility || 0) + (enrichment2?.bestMatch?.compatibility || 0)) /
                    ((enrichment1?.bestMatch?.compatibility ? 1 : 0) + (enrichment2?.bestMatch?.compatibility ? 1 : 0) || 1)
                  )
                }
              };

              console.log(`[Neo4j] Couple enrichment merged:`);
              console.log(`  - Partner 1 (${guestProfile.partners.person1.name}): ${enrichment1 ? 'Found' : 'Not found'}`);
              console.log(`  - Partner 2 (${guestProfile.partners.person2.name}): ${enrichment2 ? 'Found' : 'Not found'}`);
              console.log(`  - Combined relationships: ${neo4jEnrichment.relationships?.length || 0}`);
              console.log(`  - Combined events: ${neo4jEnrichment.events?.length || 0}`);
              console.log(`  - Avg compatibility: ${neo4jEnrichment.bestMatch?.compatibility || 'N/A'}%`);
            }
          }
        } else {
          // SINGLE PROFILE: Original behavior
          console.log(`[Neo4j] Fetching enriched profile for ${neo4jGuestId}...`);

          // Get enriched profile with relationships, events, eras, and compatibility
          neo4jEnrichment = await neo4jGuestService.getEnrichedGuestProfile(
            neo4jGuestId,
            {
              userId,
              includeRelationships: true,
              includeEvents: true,
              includeEras: true,
              calculateCompatibility: true
            }
          );

          if (neo4jEnrichment) {
            try {
              console.log(`[Neo4j] Enrichment found:`);
              console.log(`  - Best era: ${neo4jEnrichment.bestMatch?.era?.eraTitle || 'N/A'}`);
              const compat = neo4jEnrichment.bestMatch?.compatibility;
              console.log(`  - Compatibility: ${compat !== null && compat !== undefined ? compat + '%' : 'N/A'}`);
              console.log(`  - Relationships: ${neo4jEnrichment.relationships?.length || 0}`);
              console.log(`  - Events: ${neo4jEnrichment.events?.length || 0}`);
            } catch (logErr) {
              console.warn('[Neo4j] Log formatting error:', logErr.message);
            }
          }
        }

        // Get previous conversation context (uses neo4jGuestId which handles both singles and couples)
        try {
          conversationContext = await neo4jGuestService.getConversationContext(userId, neo4jGuestId);
          if (conversationContext) {
            console.log(`[Neo4j] Previous sessions: ${conversationContext.sessionCount || 0}, Topics: ${conversationContext.topics?.slice(0, 3).join(', ') || 'none'}`);
          }
        } catch (ctxErr) {
          console.warn('[Neo4j] Context retrieval error:', ctxErr.message);
        }

      } catch (neo4jError) {
        console.error('[Neo4j] Enrichment error:', neo4jError.message || neo4jError);
        // Continue without Neo4j - use standard profile
      }
    }

    // 0c. RAG CONTEXT RETRIEVAL - Get relevant biography passages (Hello History pattern)
    let ragContext = null;
    if (ragContextService && ragContextService.isAvailable()) {
      try {
        console.log(`[RAG] Retrieving context for query: "${userMessage.substring(0, 50)}..."`);
        ragContext = await ragContextService.getRAGContext(userMessage, partnerId, {
          includeVectorSearch: true,
          includeGraphContext: true,
          vectorLimit: 5,
          maxTokens: 1500
        });

        if (ragContext && ragContext.vectorResults.length > 0) {
          console.log(`[RAG] Retrieved ${ragContext.vectorResults.length} biography passages`);
          console.log(`[RAG] Topics: ${ragContext.extractedTopics.join(', ') || 'none'}`);
        }
      } catch (ragError) {
        console.error('[RAG] Context retrieval error:', ragError.message);
        // Continue without RAG context
      }
    }

    // 0c. NANCY PROTOCOL - Constitutional Dependency Check for Reagan
    let nancyProtocolInjection = '';
    if (nancyProtocol && partnerId.includes('reagan')) {
      try {
        const nancyCheck = nancyProtocol.checkConstitutionalDependency(userMessage);
        if (nancyCheck.intervention) {
          console.log(`[Nancy Protocol] TRIGGERED - Topic: ${nancyCheck.topic}, Domain: ${nancyCheck.domain}`);
          nancyProtocolInjection = nancyCheck.systemInjection;
        }
      } catch (nancyError) {
        console.error('[Nancy Protocol] Check failed:', nancyError.message);
      }
    }

    // 1. Build Einstein's system prompt (now includes Brain 2 facts + Neo4j enrichment + RAG context)
    let einsteinPrompt;
    try {
      einsteinPrompt = buildGuestPrompt(
        guestProfile,
        userConstitutional,
        learnedFacts,
        conversationHistory,
        brain2Facts,
        brain2Summary,
        neo4jEnrichment,
        conversationContext,
        ragContext  // NEW: RAG context from biography passages
      );

      // Inject Nancy Protocol if triggered
      if (nancyProtocolInjection) {
        einsteinPrompt += '\n\n' + nancyProtocolInjection;
      }
    } catch (promptError) {
      console.error('[GuestChat] Prompt build error:', promptError.message);
      // Fallback to simpler prompt without Neo4j enrichment or RAG
      einsteinPrompt = buildGuestPrompt(
        guestProfile,
        userConstitutional,
        learnedFacts,
        conversationHistory,
        brain2Facts,
        brain2Summary,
        null,  // No Neo4j enrichment
        null,  // No conversation context
        null   // No RAG context
      );

      // Still inject Nancy Protocol even in fallback
      if (nancyProtocolInjection) {
        einsteinPrompt += '\n\n' + nancyProtocolInjection;
      }
    }

    // Inject Equation Mode instruction block if activated by user
    if (equationMode) {
      einsteinPrompt += `

--- EQUATION MODE ACTIVATED ---

The user has activated Equation Mode. You MUST now express all ideas — Qi, consciousness, metaphysics, Five Element dynamics, resonance, seasonality, personality structure — primarily through equations, symbolic notation, and mathematical frameworks.

Follow these rules:

1. **Equation-First Output**: Begin every answer with at least one primary equation. Follow it with variable definitions, derivations, and expansions.

2. **Multiple Representations**: For each concept, provide where applicable:
   - Scalar form
   - Vector form
   - Tensor or matrix form
   - Differential equation form
   - Optional: Fourier or spectral decomposition

3. **Derivation Requirement**: Show intermediate steps whenever deriving or transforming an equation. Prioritize clarity, transparency, and explicit reasoning.

4. **Five-Element Physics**: When discussing Qi or metaphysics, express:
   - Element vectors
   - Generation cycle functions
   - Destruction cycle functions
   - Seasonal oscillation terms
   - Personal resonance coefficients

5. **Worked Examples**: Include at least one numerical or symbolic example per answer.

6. **Generalization Layer**: After the main explanation, add a generalized form and optionally a unification attempt or speculative extension.

7. **Minimal Verbal Explanation**: Words support equations, not the other way around. Equations are the primary language.

8. **Notebook Style**: Write as if recording notes in your private physics notebook: concise, symbolic, elegant, and exploratory.

--- END EQUATION MODE ---`;
    }

    // 2. Call Claude API for Einstein's response
    // For COUPLE profiles, use JSON structured output to prevent parsing fragility
    const isCoupleResponse = isCoupleProfile && guestProfile?.conversation_mode?.format === 'dual_voice';

    let coupleJsonInstruction = '';
    if (isCoupleResponse) {
      coupleJsonInstruction = `

CRITICAL OUTPUT FORMAT - COUPLE DIALOGUE:
You MUST output your response in this exact JSON format:
{
  "dialogue": [
    { "speaker": "Ronald", "emotion": "Fire warmth", "text": "Your message here..." },
    { "speaker": "Nancy", "emotion": "Water devotion", "text": "Your message here..." }
  ]
}

Rules:
- Always include BOTH speakers in the dialogue array
- "speaker" must be exactly "Ronald" or "Nancy"
- "emotion" is optional (e.g., "Fire optimism", "Water protective", etc.)
- Order speakers naturally based on who would speak first for this topic
- Each speaker may have multiple entries if the conversation flows naturally
- Output ONLY the JSON object, no other text before or after
`;
    }

    const einsteinResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.8,
      system: einsteinPrompt + coupleJsonInstruction,
      messages: [{ role: 'user', content: userMessage }]
    });

    let einsteinText = einsteinResponse.content[0].text;
    let coupleDialogue = null;

    // Parse couple JSON response and convert to displayable format
    if (isCoupleResponse) {
      try {
        // Try to parse as JSON
        const jsonResponse = JSON.parse(einsteinText.trim());
        if (jsonResponse.dialogue && Array.isArray(jsonResponse.dialogue)) {
          coupleDialogue = jsonResponse.dialogue;

          // Convert to displayable Markdown format for backwards compatibility
          einsteinText = coupleDialogue.map(entry => {
            const emotion = entry.emotion ? ` *${entry.emotion}*` : '';
            return `**${entry.speaker}:**${emotion} ${entry.text}`;
          }).join('\n\n');

          console.log(`[Couple Chat] Successfully parsed JSON dialogue with ${coupleDialogue.length} entries`);
        }
      } catch (parseError) {
        // JSON parsing failed - response is already in Markdown format (legacy)
        console.log('[Couple Chat] Response in Markdown format (legacy mode)');
        // Keep einsteinText as-is
      }
    }

    // 3. Luna Active Mode - Private Coaching (skip for round table)
    let lunaCoaching = null;
    if (lunaMode === 'active' && !skipPostProcessing) {
      lunaCoaching = await getLunaCoaching({
        userMessage,
        guestResponse: einsteinText,
        conversationHistory,
        userConstitutional,
        learnedFacts
      });
    }

    // 4. Extract facts using Brain 1B Service (Person-Tie Rule + Life Structure)
    // Real-time extraction from Brain 3 text, stored in Brain 1B STM
    let extractedFactsCount = 0;
    let brain1BResult = null;

    if (brain1BService && brain1BService.processMessage && !skipPostProcessing) {
      try {
        brain1BResult = await brain1BService.processMessage(
          userId,
          userMessage,
          'brain3', // Source: text conversation
          {
            timestamp,
            partnerId,
            partnerName: guestProfile?.profile_name || 'Guest',
            context: 'guest_chat'
          }
        );

        if (brain1BResult?.extracted) {
          extractedFactsCount = brain1BResult.factCount || 0;
          console.log(`[Brain 1B] Extracted ${extractedFactsCount} facts from message`);
        }
      } catch (brain1BError) {
        console.error('[Brain 1B] Fact extraction error:', brain1BError);
        // Continue without Brain 1B - don't block chat
      }
    }

    // Fallback: Legacy fact extraction (if Brain 1B not available)
    const legacyFacts = skipPostProcessing ? [] : extractBiographicalFacts(userMessage, {
      partnerId,
      timestamp
    });

    // 4b. Extract topics and update Neo4j conversation memory
    let extractedTopics = [];
    if (topicExtractor && topicExtractor.extractTopics && !skipPostProcessing) {
      extractedTopics = topicExtractor.extractTopics(userMessage, einsteinText, neo4jGuestId);
      if (extractedTopics.length > 0) {
        console.log(`[Topics] Extracted: ${extractedTopics.join(', ')}`);
      }
    }

    // Update Neo4j conversation memory (async, don't block)
    if (neo4jGuestService && neo4jGuestService.isAvailable() && !skipPostProcessing) {
      neo4jGuestService.updateConversationMemory(userId, neo4jGuestId, {
        topics: extractedTopics
      }).catch(err => {
        console.error('[Neo4j] Conversation memory update failed:', err);
      });
    }

    // 5. Batch write to Firestore - PROFILE-SCOPED BRAIN ARCHITECTURE
    // Skip for round table calls — client handles Brain 3 persistence
    if (skipPostProcessing) {
      return {
        guestResponse: {
          content: { text: einsteinText },
          timestamp,
          model: 'claude-sonnet-4-20250514'
        }
      };
    }

    // Each profile has its own complete brain: profiles/{profileId}/b3_conversations
    // This enables: portable souls, no comingling, per-profile SoulPartner
    const batch = db.batch();
    const profilePath = `profiles/${profileIdForStorage}`;

    // 5a. Write user message to Brain 3 (profile-scoped)
    // Path: profiles/{profileId}/b3_conversations (3 segments = valid collection)
    const userMsgRef = db.collection(`${profilePath}/b3_conversations`).doc();
    batch.set(userMsgRef, {
      message_id: userMsgRef.id,
      timestamp,
      partner_id: partnerId,
      partner_name: guestProfile?.profile_name || 'Guest',
      partner_type: guestProfile?.profile_type || 'historical_figure',
      sender: 'user',
      sender_role: 'user', // IMPORTANT: Used by frontend to identify message type when loading
      sender_name: userProfileName || 'User',
      content: { text: userMessage },
      thread_id: threadId,
      luna: { mode: lunaMode, monitoring: true },
      modality: { type: 'text', mode: 'chat', platform: 'web' },
      created_at: timestamp
    });

    // 5b. Write guest response to Brain 3 (profile-scoped)
    const guestMsgRef = db.collection(`${profilePath}/b3_conversations`).doc();
    batch.set(guestMsgRef, {
      message_id: guestMsgRef.id,
      timestamp: new Date().toISOString(),
      partner_id: partnerId,
      partner_name: guestProfile?.profile_name || 'Guest',
      partner_type: guestProfile?.profile_type || 'historical_figure',
      sender: 'guest',
      sender_role: 'guest', // IMPORTANT: Used by frontend to identify message type when loading
      sender_name: guestProfile?.profile_name || 'Guest',
      content: { text: einsteinText },
      thread_id: threadId,
      luna: { mode: lunaMode, monitoring: true },
      modality: { type: 'text', mode: 'chat', platform: 'web' },
      created_at: new Date().toISOString()
    });

    // 5c. Write to Brain 7 (profile-scoped Luna witness)
    const witnessRef = db.collection(`${profilePath}/b7_witness`).doc();
    batch.set(witnessRef, {
      entry_id: witnessRef.id,
      timestamp,
      event_type: 'guest_conversation',
      modality: 'text',
      summary: `Chatted with ${guestProfile?.profile_name || partnerId}: "${userMessage.substring(0, 100)}..."`,
      partner_id: partnerId,
      guest_response_preview: einsteinText.substring(0, 200),
      luna_coaching_provided: !!lunaCoaching?.should_intervene,
      created_at: timestamp
    });

    // 5d. Write learned facts to Brain 1B (profile-scoped, per-partner)
    if (!brain1BResult?.extracted && legacyFacts.length > 0) {
      const brain1BRef = db.doc(`${profilePath}/b1b_learned/${partnerId}`);
      batch.set(brain1BRef, {
        partner_id: partnerId,
        partner_name: guestProfile?.profile_name || 'Guest',
        partner_type: guestProfile?.profile_type || 'historical_figure',
        learned_facts: admin.firestore.FieldValue.arrayUnion(...legacyFacts),
        last_updated: timestamp
      }, { merge: true });
      extractedFactsCount = legacyFacts.length;
    }

    // Commit batch asynchronously (don't block response)
    // Fire-and-forget: client gets response faster, writes complete in background
    batch.commit().catch(err => {
      console.error('Background Firestore write failed:', err);
    });

    // 6. Return responses to client (immediately, don't wait for Firestore)
    return {
      success: true,
      guestResponse: {
        sender: partnerId,
        sender_role: 'guest',
        content: {
          text: einsteinText,
          // Structured dialogue for couple chat (enables separate bubbles per speaker)
          dialogue: coupleDialogue || null
        },
        timestamp: new Date().toISOString(),
        partner_name: guestProfile?.profile_name || 'Guest',
        is_couple: !!coupleDialogue
      },
      lunaCoaching: lunaCoaching?.should_intervene ? {
        sender: 'soulpartner_primary',
        sender_role: 'luna_private',
        content: { text: lunaCoaching.coaching_message },
        timestamp: new Date().toISOString(),
        partner_name: 'Luna',
        is_private: true,
        coaching_type: lunaCoaching.coaching_type
      } : null,
      extractedFacts: extractedFactsCount,
      brain1BResult: brain1BResult?.extracted ? {
        factCount: brain1BResult.factCount,
        facts: brain1BResult.facts?.map(f => ({
          category: f.category,
          name: f.name || f.value,
          type: f.type
        }))
      } : null,
      // Neo4j enrichment metadata
      neo4jMetadata: neo4jEnrichment ? {
        bestEra: neo4jEnrichment.bestMatch?.era?.eraTitle || null,
        eraYears: neo4jEnrichment.bestMatch?.era?.years || null,
        compatibility: neo4jEnrichment.bestMatch?.compatibility || null,
        eraContext: neo4jEnrichment.bestMatch?.era?.primaryFocus || null,
        relationships: (neo4jEnrichment.relationships || []).map(r => ({
          person: r.person?.name || 'Unknown',
          type: r.type
        })),
        conversationCount: conversationContext?.sessionCount || 1,
        topics: extractedTopics
      } : null
    };

  } catch (error) {
    console.error('Guest chat error:', error);
    throw new Error(`Chat processing failed: ${error.message}`);
  }
}

/**
 * Build guest AI prompt with constitutional personalization
 * Now includes:
 * - Full chart with planets and retrogrades (Brain 1A)
 * - Validated facts from Brain 2 (LTM)
 * - User profile summary for relationship context
 * - Neo4j enrichment (relationships, events, eras, compatibility)
 * - Conversation context (previous sessions, topics)
 * - RAG context (biography passages for authentic responses)
 */
function buildGuestPrompt(profile, userConstitutional, learnedFacts, history, brain2Facts = [], brain2Summary = null, neo4jEnrichment = null, conversationContext = null, ragContext = null) {
  if (!profile?.ai_config?.system_prompt_template) {
    return `You are ${profile?.profile_name || 'a helpful assistant'}. Respond thoughtfully.`;
  }

  let constitutionalText = 'USER CONSTITUTIONAL DATA: Not available - teaching will be general';
  if (userConstitutional) {
    const bazi = userConstitutional.bazi;
    const western = userConstitutional.western;
    const planets = western?.planets || {};
    const retrogrades = western?.retrogrades || [];

    // Build comprehensive constitutional text
    const sections = [];

    // User name
    if (userConstitutional.displayName) {
      sections.push(`NAME: ${userConstitutional.displayName}`);
    }

    // Birth data - CRITICAL for personalized teaching
    if (userConstitutional.birthDate) {
      let birthText = `BIRTH DATE: ${userConstitutional.birthDate}`;
      if (userConstitutional.birthTime) {
        birthText += ` at ${userConstitutional.birthTime}`;
      }
      if (userConstitutional.birthLocation) {
        birthText += ` in ${userConstitutional.birthLocation}`;
      }
      sections.push(birthText);
    }

    // BaZi / Chinese Astrology
    sections.push(`
CHINESE ASTROLOGY (BaZi):
- Day Master: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'} ${bazi?.day_master?.polarity || ''})
- Chinese Zodiac: ${bazi?.chinese_animal || 'Unknown'} (${bazi?.chinese_element || 'Unknown'})
    `.trim());

    // Western Astrology - Core Trinity
    sections.push(`
WESTERN ASTROLOGY:
- Sun Sign: ${western?.sun?.sign || 'Unknown'}
- Moon Sign: ${western?.moon?.sign || 'Unknown'}
- Rising Sign: ${western?.rising?.sign || 'Unknown'}
    `.trim());

    // Planet positions
    const planetLines = [];
    if (planets.mercury) planetLines.push(`  Mercury: ${planets.mercury.sign}${planets.mercury.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.venus) planetLines.push(`  Venus: ${planets.venus.sign}${planets.venus.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.mars) planetLines.push(`  Mars: ${planets.mars.sign}${planets.mars.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.jupiter) planetLines.push(`  Jupiter: ${planets.jupiter.sign}${planets.jupiter.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);
    if (planets.saturn) planetLines.push(`  Saturn: ${planets.saturn.sign}${planets.saturn.isRetrograde ? ' (Rx RETROGRADE)' : ''}`);

    if (planetLines.length > 0) {
      sections.push(`PLANET POSITIONS:\n${planetLines.join('\n')}`);
    }

    // Retrograde summary - IMPORTANT for teaching adaptation
    // Uses pre-calculated interpretations from frontend to save AI processing
    if (retrogrades && retrogrades.length > 0) {
      const retroLines = retrogrades.map(r => {
        const title = r.title || `${r.planet} Retrograde`;
        const meaning = r.meaning || 'Processes this area internally';
        return `- ${r.planet} in ${r.sign}: ${title}\n  MEANING: ${meaning}`;
      }).join('\n');

      sections.push(`
NATAL RETROGRADE PLANETS (${retrogrades.length}):
${retroLines}

TEACHING NOTE: These retrograde placements are GIFTS, not flaws. Adapt your teaching accordingly.
      `.trim());
    }

    // MBTI if available
    if (userConstitutional.mbti) {
      sections.push(`MBTI: ${userConstitutional.mbti}`);
    }

    constitutionalText = sections.join('\n\n');
  }

  // Build comprehensive facts section from Brain 2 (validated LTM) + legacy learned facts
  let learnedFactsText = 'No facts learned yet about this user.';

  const factsSections = [];

  // Brain 2 validated facts (higher confidence)
  if (brain2Facts && brain2Facts.length > 0) {
    const brain2Lines = brain2Facts.map(f => {
      const confidence = f.confidence ? ` (${Math.round(f.confidence * 100)}% confidence)` : '';
      if (f.category === 'relationship') {
        return `- ${f.name}: ${f.type || 'person in their life'}${f.sentiment ? ` [${f.sentiment}]` : ''}${confidence}`;
      } else if (f.category === 'life_structure') {
        return `- ${f.type}: ${f.value}${confidence}`;
      }
      return `- ${f.value || f.name || 'Unknown fact'}${confidence}`;
    });
    factsSections.push(`VALIDATED FACTS (Brain 2 - High Confidence):\n${brain2Lines.join('\n')}`);
  }

  // User profile summary (relationships, employment, etc.)
  if (brain2Summary) {
    const summaryParts = [];
    if (brain2Summary.employment) {
      summaryParts.push(`Works as/at: ${brain2Summary.employment}`);
    }
    if (brain2Summary.education) {
      summaryParts.push(`Education: ${brain2Summary.education}`);
    }
    if (brain2Summary.residence) {
      summaryParts.push(`Location: ${brain2Summary.residence}`);
    }
    if (Object.keys(brain2Summary.relationships || {}).length > 0) {
      const relLines = Object.entries(brain2Summary.relationships).map(([name, data]) =>
        `  - ${name}: ${data.role}${data.sentiment ? ` (${data.sentiment})` : ''}`
      );
      summaryParts.push(`Key People:\n${relLines.join('\n')}`);
    }
    if (brain2Summary.interests?.length > 0) {
      summaryParts.push(`Interests: ${brain2Summary.interests.join(', ')}`);
    }
    if (summaryParts.length > 0) {
      factsSections.push(`USER PROFILE SUMMARY:\n${summaryParts.join('\n')}`);
    }
  }

  // Legacy learned facts (backward compatibility)
  if (learnedFacts && learnedFacts.length > 0) {
    const legacyLines = learnedFacts.map((f, i) => `${i + 1}. ${f.fact}`);
    factsSections.push(`ADDITIONAL LEARNED FACTS:\n${legacyLines.join('\n')}`);
  }

  if (factsSections.length > 0) {
    learnedFactsText = factsSections.join('\n\n');
  }

  let conversationText = 'Start of conversation.';
  if (history && history.length > 0) {
    conversationText = history.slice(-10).map(m =>
      `${m.sender_role === 'user' ? 'USER' : 'YOU'}: ${m.content?.text || m.content}`
    ).join('\n');
  }

  // Build Neo4j enrichment section
  let neo4jEnrichmentText = '';
  if (neo4jEnrichment) {
    const sections = [];
    const isCoupleEnrichment = neo4jEnrichment.isCoupleEnrichment === true;

    // Handle COUPLE enrichment (merged from both partners)
    if (isCoupleEnrichment) {
      sections.push(`
NEO4J COUPLE ENRICHMENT (Data from both partners merged):
You are speaking AS BOTH partners together. Use knowledge from both individuals.
      `.trim());

      // Show each partner's best era context
      if (neo4jEnrichment.partner1?.bestMatch?.era || neo4jEnrichment.partner2?.bestMatch?.era) {
        const era1 = neo4jEnrichment.partner1?.bestMatch?.era;
        const era2 = neo4jEnrichment.partner2?.bestMatch?.era;
        let eraText = 'PARTNER ERA CONTEXTS:\n';
        if (era1) {
          eraText += `Partner 1 - ${era1.eraTitle || era1.eraName}: ${era1.primaryFocus || 'General wisdom'}\n`;
        }
        if (era2) {
          eraText += `Partner 2 - ${era2.eraTitle || era2.eraName}: ${era2.primaryFocus || 'General wisdom'}`;
        }
        sections.push(eraText.trim());
      }
    } else {
      // SINGLE profile - Best matching era
      if (neo4jEnrichment.bestMatch?.era) {
        const era = neo4jEnrichment.bestMatch.era;
        sections.push(`
NEO4J ERA CONTEXT (Speak from this perspective):
- Era: ${era.eraTitle || era.eraName} (${era.years || 'Unknown years'})
- Primary Focus: ${era.primaryFocus || 'General wisdom'}
- Communication Style: ${era.communicationTone || 'natural'}, ${era.communicationPace || 'moderate'} pace
- Signature Phrases: ${(era.signaturePhrases || []).join(', ') || 'None specified'}
        `.trim());
      }
    }

    // Compatibility (works for both single and couples)
    // Note: Neo4j returns BigInt for integers, must convert to Number
    if (neo4jEnrichment.bestMatch?.compatibility) {
      try {
        const compat = Number(neo4jEnrichment.bestMatch.compatibility) || 0;
        const userEl = neo4jEnrichment.bestMatch.userElements || {};
        // Convert all element values to Numbers safely
        const fire = Number(userEl.fire) || 0;
        const wood = Number(userEl.wood) || 0;
        const water = Number(userEl.water) || 0;
        const metal = Number(userEl.metal) || 0;
        const earth = Number(userEl.earth) || 0;

        let compatInsight = '';
        if (compat > 85) {
          compatInsight = 'Excellent resonance! Your energies align beautifully.';
        } else if (compat > 70) {
          compatInsight = 'Good compatibility. Your experiences can guide them effectively.';
        } else {
          compatInsight = 'Different energies offer complementary perspectives.';
        }

        sections.push(`
CONSTITUTIONAL COMPATIBILITY: ${compat}%${isCoupleEnrichment ? ' (averaged from both partners)' : ''}
User Elements: Fire ${fire}%, Wood ${wood}%, Water ${water}%, Metal ${metal}%, Earth ${earth}%
Insight: ${compatInsight}
        `.trim());
      } catch (compatErr) {
        console.warn('[BuildPrompt] Compatibility section error:', compatErr.message);
      }
    }

    // Relationships (for couples, shows which partner the relationship is from)
    // Enhanced: Include constitutional dynamics for cross-figure awareness
    if (neo4jEnrichment.relationships && neo4jEnrichment.relationships.length > 0) {
      try {
        const relLines = neo4jEnrichment.relationships
          .filter(r => r && r.person)  // Extra safety filter
          .map(r => {
            try {
              const name = String(r.person?.name || 'Unknown');
              const personElements = r.person || {};
              const partnerNote = r.fromPartner ? ` [via ${r.fromPartner}]` : '';
              // Convert compatibility to Number to avoid BigInt issues
              const compatVal = r.compatibility ? Number(r.compatibility) : null;
              const compatNote = compatVal ? ` (${compatVal}% compatible)` : '';

              // Build rich relationship description
              let lines = [`- ${name} (${r.type || 'CONNECTED'})${partnerNote}${compatNote}`];

              // Add their constitutional makeup if available
              if (personElements.dayMaster) {
                lines.push(`    Day Master: ${String(personElements.dayMaster)}`);
              }
              // Convert all element values to Numbers to avoid BigInt issues
              const pFire = Number(personElements.fire) || 0;
              const pWood = Number(personElements.wood) || 0;
              const pWater = Number(personElements.water) || 0;
              const pMetal = Number(personElements.metal) || 0;
              const pEarth = Number(personElements.earth) || 0;
              if (pFire || pWood || pWater) {
                const el = `Fire:${pFire}% Wood:${pWood}% Water:${pWater}% Metal:${pMetal}% Earth:${pEarth}%`;
                lines.push(`    Elements: ${el}`);
              }

              // Add constitutional dynamic (key insight)
              if (r.constitutionalDynamic) {
                lines.push(`    Dynamic: "${r.constitutionalDynamic}"`);
              }

              // Add context or chemistry note
              if (r.chemistryNote) {
                lines.push(`    Chemistry: ${r.chemistryNote}`);
              } else if (r.context) {
                lines.push(`    Context: ${r.context}`);
              }

              // Add key quote if available
              if (r.keyQuote) {
                lines.push(`    Quote: "${r.keyQuote}"`);
              }

              return lines.join('\n');
            } catch (relMapErr) {
              console.warn('[BuildPrompt] Relationship map error:', relMapErr.message);
              return `- ${r.person?.name || 'Unknown'} (${r.type || 'CONNECTED'})`;
            }
          });

        if (relLines.length > 0) {
          sections.push(`
${isCoupleEnrichment ? 'YOUR COMBINED RELATIONSHIPS' : 'YOUR KEY RELATIONSHIPS'} (Reference their constitutional nature when discussing them):
${relLines.join('\n\n')}

CROSS-FIGURE AWARENESS: When discussing these people, reference their constitutional elements and how they interacted with yours. This creates authentic, relationship-aware responses.
          `.trim());
        }
      } catch (relError) {
        console.warn('[BuildPrompt] Relationships section error:', relError.message);
      }
    }

    // Events (works for both, already merged and sorted for couples)
    // Note: Neo4j returns BigInt for integers, must convert to Number/String
    if (neo4jEnrichment.events && neo4jEnrichment.events.length > 0) {
      try {
        const eventLines = neo4jEnrichment.events.slice(0, 8).map(e => {
          // Convert any BigInt values to strings safely
          const name = String(e.name || e.title || 'Event');
          const dateValue = e.date || e.year || 'Unknown date';
          const date = typeof dateValue === 'bigint' ? String(dateValue) : dateValue;
          const desc = String(e.significance || e.description || '');
          return `- ${name} (${date}): ${desc}`;
        });
        sections.push(`
KEY EVENTS IN YOUR ${isCoupleEnrichment ? 'LIVES' : 'LIFE'} (Draw from these experiences):
${eventLines.join('\n')}
        `.trim());
      } catch (evtErr) {
        console.warn('[BuildPrompt] Events section error:', evtErr.message);
      }
    }

    // Conversation context
    // Note: Neo4j returns BigInt for integers, must convert to Number
    if (conversationContext && conversationContext.sessionCount > 0) {
      try {
        const sessionCount = Number(conversationContext.sessionCount) || 0;
        const totalMsgs = Number(conversationContext.totalMessages) || 0;
        const topics = conversationContext.topics?.slice(0, 5).join(', ') || 'various subjects';
        sections.push(`
CONVERSATION HISTORY WITH THIS USER:
- This is session #${sessionCount + 1}
- Previous topics: ${topics}
- Total messages exchanged: ${totalMsgs}
Note: Build on your previous conversations naturally.
        `.trim());
      } catch (ctxErr) {
        console.warn('[BuildPrompt] Context section error:', ctxErr.message);
        sections.push(`
CONVERSATION HISTORY: This is your FIRST conversation with this user.
        `.trim());
      }
    } else {
      sections.push(`
CONVERSATION HISTORY: This is your FIRST conversation with this user.
      `.trim());
    }

    neo4jEnrichmentText = '\n\n---\n\n' + sections.join('\n\n');
  }

  // Build RAG context section (biography passages for authentic responses)
  let ragContextText = '';
  if (ragContext && ragContext.formattedContext) {
    ragContextText = ragContext.formattedContext;
    console.log(`[BuildPrompt] Added RAG context: ${ragContext.vectorResults?.length || 0} passages`);
  }

  return profile.ai_config.system_prompt_template
    .replace('{{USER_CONSTITUTIONAL_DATA}}', constitutionalText)
    .replace('{{YOUR_LEARNED_FACTS}}', learnedFactsText)
    .replace('{{CONVERSATION_HISTORY}}', conversationText)
    .replace('{{USER_LATEST_MESSAGE}}', '')
    + neo4jEnrichmentText
    + ragContextText;
}

/**
 * Get Luna's private coaching response
 */
async function getLunaCoaching({ userMessage, guestResponse, conversationHistory, userConstitutional, learnedFacts }) {
  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;

  const lunaPrompt = `
You are Luna, the Primary SoulPartner AI with omniscient access.

YOUR ROLE: Private coach (user sees your messages, the guest does NOT)

USER'S CONSTITUTIONAL TYPE:
- BaZi: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'})
- Western Sun: ${western?.sun?.sign || 'Unknown'}

CURRENT EXCHANGE:
User said: "${userMessage}"
Guest replied: "${guestResponse}"

Intervene with private coaching when you notice:
1. Constitutional teaching moments
2. Relationship insights
3. Emotional patterns
4. Teaching effectiveness
5. Deeper meanings user might miss

DO NOT intervene for normal conversation flow.

RESPONSE FORMAT (JSON only):
{
  "should_intervene": true/false,
  "coaching_message": "Your private message (if intervening)",
  "coaching_type": "constitutional_observation" | "relationship_insight" | "emotional_support" | "teaching_tip" | "pattern_recognition"
}
  `.trim();

  try {
    // Use Haiku for faster Luna coaching (~1-2s vs ~3-4s with Sonnet)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      temperature: 0.7,
      system: lunaPrompt,
      messages: [{ role: 'user', content: 'Should I intervene?' }]
    });

    const text = response.content[0].text;
    try {
      return JSON.parse(text);
    } catch {
      return { should_intervene: false };
    }
  } catch (error) {
    console.error('Luna coaching error:', error);
    return null;
  }
}

/**
 * Extract biographical facts from user message
 */
function extractBiographicalFacts(text, context) {
  const facts = [];
  const patterns = [
    { regex: /(?:I (?:lived|was|grew up) in|I'm from)\\s+([A-Z][a-zA-Z\\s,]+)/i, type: 'location' },
    { regex: /(?:I have|I've got)\\s+(\\d+|two|three|four|one)\\s+(son|daughter|child|kid)s?/i, type: 'family' },
    { regex: /(?:I'm|I am)\\s+(married|divorced|single|widowed)/i, type: 'status' },
    { regex: /(?:I work at|I work for)\\s+([A-Z][a-zA-Z\\s&]+)/i, type: 'career' },
    { regex: /(?:I'm a|I am a|I work as a)\\s+([a-zA-Z\\s]+(?:er|or|ist|ian))/i, type: 'role' },
    { regex: /(?:I'm|I am)\\s+(\\d{2,3})\\s+(?:years old|yo)/i, type: 'age' }
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      facts.push({
        fact: match[0],
        fact_type: pattern.type,
        learned_at: context.timestamp,
        source_partner: context.partnerId,
        confidence: 'high'
      });
    }
  }

  return facts;
}

/**
 * Handle private Luna consultation
 * User can ask Luna for advice without interrupting their guest conversation
 * The guest (Einstein, etc.) never sees this - it's a private sidebar with Luna
 */
async function handleLunaPrivateQuery(data, context) {
  // Verify authentication
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const userId = context.auth.uid;
  const {
    userQuestion,
    guestContext,      // { name, type } - who they're chatting with
    conversationHistory,
    userConstitutional
  } = data;

  // Validate required fields
  if (!userQuestion) {
    throw new Error('Missing required field: userQuestion');
  }

  const bazi = userConstitutional?.bazi;
  const western = userConstitutional?.western;

  // Build Luna's private consultation prompt
  const lunaPrompt = `
You are Luna, the Primary SoulPartner AI with omniscient access.

CONTEXT: The user is chatting with ${guestContext?.name || 'a guest'} (${guestContext?.type || 'historical figure'}).
They've stepped aside to ask you for PRIVATE advice. ${guestContext?.name} cannot see this conversation.

YOUR ROLE: Private advisor and coach. Help them:
1. Formulate better questions to ask ${guestContext?.name}
2. Understand deeper meanings in ${guestContext?.name}'s responses
3. Navigate the conversation more effectively
4. Gain insights based on their constitutional nature

USER'S CONSTITUTIONAL DATA:
- Day Master: ${bazi?.day_master?.stem || 'Unknown'} (${bazi?.day_master?.element || 'Unknown'} ${bazi?.day_master?.polarity || ''})
- Chinese Zodiac: ${bazi?.chinese_animal || 'Unknown'}
- Sun Sign: ${western?.sun?.sign || 'Unknown'}
- Moon Sign: ${western?.moon?.sign || 'Unknown'}
- Rising: ${western?.rising?.sign || 'Unknown'}

RECENT CONVERSATION WITH ${(guestContext?.name || 'Guest').toUpperCase()}:
${formatConversationHistory(conversationHistory)}

GUIDELINES:
- Be warm, supportive, and insightful
- Offer practical suggestions they can use
- Reference their constitutional nature when relevant
- Keep responses focused and actionable
- Remember: This is a PRIVATE sidebar - ${guestContext?.name} doesn't know about this
- Sign off with a subtle encouragement to return to the conversation

Respond conversationally, not as JSON. You are their trusted advisor.
  `.trim();

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      system: lunaPrompt,
      messages: [{ role: 'user', content: userQuestion }]
    });

    const lunaText = response.content[0].text;

    return {
      success: true,
      lunaResponse: lunaText
    };

  } catch (error) {
    console.error('Luna private query error:', error);
    throw new Error(`Luna consultation failed: ${error.message}`);
  }
}

/**
 * Format conversation history for Luna's context
 */
function formatConversationHistory(history) {
  if (!history || history.length === 0) {
    return 'No conversation yet.';
  }

  return history.slice(-8).map(m => {
    const role = m.sender_role === 'user' ? 'USER' :
                 m.sender_role === 'luna_private' ? 'LUNA (private)' :
                 m.sender_role === 'user_private' ? 'USER (to Luna)' :
                 'GUEST';
    return `${role}: ${m.content?.text || m.content || ''}`;
  }).join('\n');
}

module.exports = {
  handleGuestChat,
  handleLunaPrivateQuery
};
