/**
 * Chat Route Module - AI SoulPartner Chat + Intimacy Functions
 *
 * Extracted from index.js during GENESIS route-module refactor.
 * Exports: aiSoulPartnerChat, generateConversationStarter, analyzeUserMessage, getUserEraContext
 */

const {
  onRequest,
  onCall,
  admin,
  logger,
  anthropicKey,
  geminiKey,
} = require('./shared');

const Anthropic = require('@anthropic-ai/sdk');

// =============================================================================
// Modular Imports - GENESIS Architecture (paths adjusted for routes/)
// =============================================================================
const {
  detectImageGenerationRequest,
  extractImagePromptFromResponse,
  generateImage
} = require('../utils/nanoBanana');

const {
  detectWebSearchRequest,
  performWebSearch,
  detectURLs,
  fetchURLContent
} = require('../utils/webTools');

const {
  DEFAULT_AI_IDENTITY,
  buildSystemPrompt,
  buildMessages
} = require('../chat/systemPromptBuilder');

// Usage & Rate Limiting (Phase 6 - Production Hardening)
const {
  checkRateLimits,
  recordRequestStart,
  recordRequestComplete,
  recordRequestFailed,
  generateRequestId,
} = require('../usage/usageFunctions');

// 4-Brain PostgreSQL Memory Integration (JOIE DE VIVRE!)
const {
  retrieveMemoriesForChat,
  storeUserMessageAsMemory,
  storeLunaObservation,
  sessionCache
} = require('../memory/chatMemoryIntegration');

// Warmth & Happiness Module - Six Laws of Happiness + Mountain Climbing
const {
  calculateHappiness,
  calculateHappinessFromEmotion
} = require('../emotional');

// Week 13: Intimacy & Memory Expansion (ConversationStarter + AmnesisBuster)
const {
  generateIntimacyPrompt,
  analyzeIntimacySignals,
  getEraContext
} = require('../intimacy');

// =============================================================================
// Shared helpers
// =============================================================================
const db = admin.firestore();

// Initialize Anthropic client
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Add ANTHROPIC_API_KEY to functions/.env');
  }
  return new Anthropic({ apiKey });
};

// =============================================================================
// aiSoulPartnerChat
// =============================================================================

/**
 * AI SoulPartner Chat Function
 *
 * Receives message and constitutional intelligence guidance,
 * returns Claude's response following the guidance.
 */
exports.aiSoulPartnerChat = onRequest({
  cors: true,
  invoker: 'public',  // Allow unauthenticated access
  timeoutSeconds: 300,  // 5 minutes for large context with knowledge base
  memory: '512MiB',  // Extra memory for large prompts
  secrets: [anthropicKey, geminiKey],
}, async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // -----------------------------------------------------------------------
    // RATE LIMITING (Phase 6 - Production Hardening)
    // Check limits BEFORE processing to prevent abuse
    // -----------------------------------------------------------------------
    let userId = null;
    let requestId = null;
    let userTier = 'free';

    try {
      // Extract user ID from auth header or request body
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          userId = decodedToken.uid;
        } catch (authError) {
          logger.warn('[RateLimit] Auth token invalid:', authError.message);
        }
      }

      // Fallback: get userId from request body
      if (!userId && req.body.userId) {
        userId = req.body.userId;
      }

      // If we have a userId, check rate limits
      if (userId) {
        // Get user tier
        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        userTier = userSnap.exists ? (userSnap.data().subscriptionTier || 'free') : 'free';

        // Check rate limits
        const rateCheck = await checkRateLimits(userId, userTier);
        if (!rateCheck.allowed) {
          logger.info('[RateLimit] User blocked:', userId, rateCheck.reason);
          return res.status(429).json({
            error: 'Rate limit exceeded',
            code: rateCheck.code,
            message: rateCheck.message,
            retryAfter: rateCheck.retryAfter
          });
        }

        // Record request start (for concurrent tracking)
        requestId = generateRequestId();
        await recordRequestStart(userId, requestId, {
          profileId: req.body.userProfile?.id,
          thinkingLevel: req.body.thinkingLevel || 'low'
        });
      }
    } catch (rateLimitError) {
      // Log but don't block - fail open for rate limiting errors
      logger.error('[RateLimit] Error checking limits:', rateLimitError.message);
    }

    const requestStartTime = Date.now();

    try {
      const { message, guidance, conversationHistory, userProfile, knowledgePrompt, learnedContext, memoryPrompt, soulNarrative, soulMetrics, relationshipStats, image, conversationId } = req.body;

      if (!message && !image) {
        return res.status(400).json({ error: 'Message or image is required' });
      }

      const anthropic = getAnthropicClient();

      // Check if this is an image generation request (Nano Banana)
      const imageGenRequest = detectImageGenerationRequest(message);
      let generatedImage = null;

      if (imageGenRequest.isImageRequest) {
        logger.info('🎨 Image generation detected, prompt:', imageGenRequest.prompt.slice(0, 100));
        generatedImage = await generateImage(imageGenRequest.prompt, userProfile);

        if (generatedImage?.success) {
          // Return image with Claude's contextual response
          const imageDescription = `I've created an image for you based on: "${imageGenRequest.prompt.slice(0, 100)}..."

${generatedImage.description || ''}

The image is displayed above. Let me know if you'd like me to create a different version or modify anything!`;

          return res.status(200).json({
            success: true,
            response: imageDescription,
            mode: guidance?.mode || 'DIALOGUE',
            generatedImage: {
              mimeType: generatedImage.image.mimeType,
              data: generatedImage.image.data,  // Base64
              prompt: imageGenRequest.prompt
            },
            usage: { input_tokens: 0, output_tokens: 0 }  // Gemini usage tracked separately
          });
        } else if (generatedImage?.error) {
          logger.info('🎨 Image generation failed, falling through to Claude');
          // Fall through to Claude with an explanation
        }
      }

      // Check if this is a web search request
      const searchRequest = detectWebSearchRequest(message);
      let webSearchResults = null;
      let enhancedMessage = message;

      if (searchRequest.isSearch) {
        logger.info('🔍 Web search detected, query:', searchRequest.query);
        webSearchResults = await performWebSearch(searchRequest.query);

        if (webSearchResults) {
          // Enhance the message with search results
          enhancedMessage = `${message}

---
## 🔍 WEB SEARCH RESULTS FOR: "${searchRequest.query}"

### Quick Answer:
${webSearchResults.answer || 'No summary available'}

### Sources:
${webSearchResults.results.map((r, i) => `
**${i + 1}. ${r.title}**
URL: ${r.url}
${r.content}
`).join('\n')}
---

Please synthesize these web search results to answer my question. Include relevant source links in your response.`;
        }
      }

      // Check for URLs in the message and fetch content
      const urls = detectURLs(message);
      let urlContents = [];

      if (urls.length > 0 && !searchRequest.isSearch) {
        logger.info('🔗 URLs detected:', urls.length);

        // Fetch up to 3 URLs to avoid overloading
        const urlsToFetch = urls.slice(0, 3);
        const fetchPromises = urlsToFetch.map(url => fetchURLContent(url));
        const results = await Promise.all(fetchPromises);

        urlContents = results.filter(r => r.success);

        if (urlContents.length > 0) {
          // Append URL contents to the message
          const urlContext = urlContents.map(content => `
---
## 📄 CONTENT FROM: ${content.title}
**URL:** ${content.url}

${content.text}
---
`).join('\n');

          enhancedMessage = `${enhancedMessage}

${urlContext}

Please read and analyze the above web page content to help answer my question or continue our discussion.`;

          logger.info('🔗 URL content added:', urlContents.length, 'pages');
        }
      }

      // Log if learned context is present (Session Intelligence)
      if (learnedContext) {
        logger.info('🧠 Session Intelligence: Learned context included in prompt');
      }

      // -----------------------------------------------------------------------
      // 4-BRAIN POSTGRESQL MEMORY RETRIEVAL (JOIE DE VIVRE!)
      // Retrieve relevant memories from Luna's brain before responding
      // -----------------------------------------------------------------------
      let pgMemoryPrompt = memoryPrompt; // Use client-provided if available
      const profileId = userProfile?.profileId || userProfile?.id || 'default';

      // Only retrieve from PostgreSQL if we have userId and message
      if (userId && message && !memoryPrompt) {
        try {
          pgMemoryPrompt = await retrieveMemoriesForChat(userId, profileId, message, {
            limit: 10,
            threshold: 0.6,
            includePartner: true,
            includeTimeline: true,
            conversationId  // Session cache optimization
          });
          if (pgMemoryPrompt) {
            logger.info('🧠 4-Brain Memory: Retrieved relevant memories from PostgreSQL');
          }
        } catch (memoryError) {
          logger.warn('[Memory] PostgreSQL retrieval failed (continuing without):', memoryError.message);
          // Continue without memories - graceful degradation
        }
      }

      // -----------------------------------------------------------------------
      // WARMTH & HAPPINESS ANALYSIS (Six Laws + Mountain Climbing)
      // Analyze emotional state and calculate appropriate warmth level
      // "Guidance with utmost warmth toward YOUR mountain"
      // -----------------------------------------------------------------------
      let warmthGuidance = null;
      try {
        // Simple emotion detection from message text
        const emotionKeywords = {
          sadness: ['sad', 'hurt', 'cry', 'miss', 'lost', 'alone', 'lonely', 'grief', 'heartbreak', 'rejected'],
          joy: ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'blessed', 'grateful'],
          fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'panic'],
          anger: ['angry', 'frustrated', 'annoyed', 'mad', 'furious', 'upset'],
          trust: ['trust', 'safe', 'secure', 'comfortable', 'believe'],
          anticipation: ['hope', 'expect', 'looking forward', 'can\'t wait', 'excited about']
        };

        const lowerMessage = message.toLowerCase();
        let detectedEmotion = 'neutral';
        let emotionIntensity = 0.5;
        let emotionValence = 0;

        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
          const matches = keywords.filter(kw => lowerMessage.includes(kw));
          if (matches.length > 0) {
            detectedEmotion = emotion;
            emotionIntensity = Math.min(1.0, 0.5 + (matches.length * 0.15));
            emotionValence = ['joy', 'trust', 'anticipation'].includes(emotion) ? 0.6 : -0.6;
            break;
          }
        }

        // Calculate happiness using Six Laws
        const happinessState = calculateHappinessFromEmotion(
          detectedEmotion,
          emotionIntensity,
          emotionValence,
          {}
        );

        warmthGuidance = calculateHappiness({
          reality: happinessState.reality,
          expectation: happinessState.expectation,
          emotionalState: {
            primary: detectedEmotion,
            intensity: emotionIntensity,
            valence: emotionValence
          }
        });

        logger.info('💛 [Warmth] Detected:', detectedEmotion,
          '| Mountain:', warmthGuidance.mountainHeight?.toFixed(1),
          '| Warmth:', warmthGuidance.guidance?.warmth?.multiplier?.toFixed(1) + 'x');
      } catch (warmthError) {
        logger.warn('[Warmth] Analysis failed (continuing without):', warmthError.message);
      }

      // Build the system prompt based on constitutional intelligence guidance
      // Pass relationshipStats for Tango Identity System (Luna's relationship awareness)
      // Pass soulNarrative for Cathedral Soul Architecture (deep personalization)
      const systemPrompt = buildSystemPrompt(guidance, userProfile, knowledgePrompt, learnedContext, pgMemoryPrompt, relationshipStats, soulNarrative, soulMetrics, warmthGuidance);

      // Log if soul profile is present
      if (soulNarrative) {
        logger.info('🔮 [SoulProfile] Soul narrative received:', soulNarrative.length, 'characters');
      }

      // Build messages array with conversation history and optional image
      const messages = buildMessages(conversationHistory, enhancedMessage, image);

      // Log if image, search, or URLs are present
      if (image) {
        logger.info('📸 Image attached to message');
      }
      if (webSearchResults) {
        logger.info('🔍 Web search results included in message');
      }
      if (urlContents.length > 0) {
        logger.info('🔗 URL content fetched:', urlContents.map(u => u.title).join(', '));
      }

      // Call Claude API
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,  // ~32K characters for detailed guidance responses
        system: systemPrompt,
        messages: messages
      });

      // Extract the response text
      let responseText = response.content[0]?.text || "I'm here with you. 💙";

      // Check if Claude wants to generate an image (via [NANO_BANANA: prompt] marker)
      let claudeGeneratedImage = null;
      const imageExtraction = extractImagePromptFromResponse(responseText);

      if (imageExtraction) {
        logger.info('🎨 Claude requested image generation:', imageExtraction.prompt.slice(0, 100));
        responseText = imageExtraction.cleanedText;

        // Generate the image Claude requested
        const imageResult = await generateImage(imageExtraction.prompt, userProfile);
        if (imageResult?.success) {
          claudeGeneratedImage = {
            mimeType: imageResult.image.mimeType,
            data: imageResult.image.data,
            prompt: imageExtraction.prompt
          };
          logger.info('🎨 Claude-initiated image generated successfully!');
        }
      }

      // -----------------------------------------------------------------------
      // USAGE TRACKING (Phase 6 - Production Hardening)
      // Record token usage for cost control and analytics
      // -----------------------------------------------------------------------
      const responseTime = Date.now() - requestStartTime;
      const inputTokens = response.usage?.input_tokens || 0;
      const outputTokens = response.usage?.output_tokens || 0;

      if (userId && requestId) {
        try {
          await recordRequestComplete(userId, requestId, {
            inputTokens,
            outputTokens,
            success: true,
            profileId: userProfile?.id,
            thinkingLevel: guidance?.thinkingLevel || 'low',
            responseTime
          });
          logger.info('[Usage] Recorded:', {
            userId: userId.slice(0, 8) + '...',
            tokens: inputTokens + outputTokens,
            responseTime
          });
        } catch (usageError) {
          logger.error('[Usage] Failed to record:', usageError.message);
        }
      }

      // -----------------------------------------------------------------------
      // 4-BRAIN POSTGRESQL MEMORY STORAGE (JOIE DE VIVRE!)
      // Store meaningful memories from this exchange asynchronously
      // -----------------------------------------------------------------------
      if (userId && profileId && message) {
        // Fire and forget - don't block the response
        (async () => {
          try {
            // Store user's message if worth remembering
            const userMemoryResult = await storeUserMessageAsMemory(
              userId,
              profileId,
              message,
              requestId // Use as session ID for grouping
            );

            if (userMemoryResult?.stored) {
              logger.info('🧠 4-Brain Memory: Stored user message in STM');
            }

            // If Luna mentioned something insightful, store as observation
            // Look for patterns that indicate Luna learned something
            const observationPatterns = [
              /I notice[d]? (?:that )?you/i,
              /it sounds like you/i,
              /I hear you saying/i,
              /what I'm sensing is/i,
              /I remember you (?:said|mentioned|told me)/i
            ];

            const hasObservation = observationPatterns.some(p => p.test(responseText));
            if (hasObservation && responseText.length > 100) {
              // Extract a summary of Luna's observation (first 500 chars for now)
              const observationSummary = responseText.slice(0, 500);
              await storeLunaObservation(userId, profileId, observationSummary, {
                sessionId: requestId,
                context: 'chat_response',
                userMessageExcerpt: message.slice(0, 200)
              });
              logger.info('🧠 4-Brain Memory: Stored Luna observation in Partner STM');
            }

            // -------------------------------------------------------------------
            // BIOGRAPHIC EXTRACTION (Brain 1B -> Brain 2 Consolidation)
            // Extract life events, people, emotions, values from user messages
            // -------------------------------------------------------------------
            if (message.length > 50) {
              // Only extract from substantive messages
              try {
                const extractionPayload = {
                  userId: userId,
                  profileId: profileId,
                  conversationText: `USER: ${message}`,
                  source: 'text_chat',
                  sessionId: requestId || conversationId,
                  storeToFirestore: true,
                  ingestToNeo4j: false  // Neo4j ingestion done in nightly consolidation
                };

                // Use fetch for internal Cloud Function call
                const projectId = process.env.GCLOUD_PROJECT || 'astroprofile-391e6';
                const region = 'us-central1';
                const extractionUrl = `https://${region}-${projectId}.cloudfunctions.net/extract_biographic_data`;

                const extractionResponse = await fetch(extractionUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(extractionPayload)
                });

                if (extractionResponse.ok) {
                  const extractionResult = await extractionResponse.json();
                  if (extractionResult.success && extractionResult.stored) {
                    logger.info('📚 Biographer: Extracted and stored biographic data', {
                      events: extractionResult.extraction?.events?.length || 0,
                      people: extractionResult.extraction?.people?.length || 0
                    });
                  }
                }
              } catch (extractionError) {
                logger.warn('[Biographer] Extraction failed (non-blocking):', extractionError.message);
                // Non-critical - don't fail the response
              }
            }
          } catch (memoryStoreError) {
            logger.warn('[Memory] Storage failed (non-blocking):', memoryStoreError.message);
            // Non-critical - don't fail the response
          }
        })();
      }

      // Return successful response
      return res.status(200).json({
        success: true,
        response: responseText,
        mode: guidance?.mode || 'DIALOGUE',
        generatedImage: claudeGeneratedImage,  // Include if Claude generated an image
        webSearch: webSearchResults ? {
          query: searchRequest.query,
          sourcesCount: webSearchResults.results?.length || 0
        } : null,
        urlFetch: urlContents.length > 0 ? {
          urls: urlContents.map(u => ({ url: u.url, title: u.title })),
          count: urlContents.length
        } : null,
        // Warmth & Happiness - Six Laws + Mountain Climbing
        warmthHappiness: warmthGuidance ? {
          mountainHeight: warmthGuidance.mountainHeight,
          interpretation: warmthGuidance.interpretation,
          happiness: warmthGuidance.happiness,
          warmthMultiplier: warmthGuidance.guidance?.warmth?.multiplier || 1.0,
          warmthLevel: warmthGuidance.guidance?.warmth?.reason || 'midpoint',
          lossRecoveryActive: warmthGuidance.guidance?.lossPreparation?.warmthLevel === 'MAXIMUM'
        } : null,
        usage: {
          input_tokens: inputTokens,
          output_tokens: outputTokens
        }
      });

    } catch (error) {
      logger.error('AI SoulPartner Error:', error);

      // -----------------------------------------------------------------------
      // USAGE TRACKING - Failed Request
      // Record failed requests (doesn't count toward limits)
      // -----------------------------------------------------------------------
      if (userId && requestId) {
        try {
          await recordRequestFailed(userId, requestId, error);
        } catch (usageError) {
          logger.error('[Usage] Failed to record failure:', usageError.message);
        }
      }

      // Return appropriate error response
      if (error.message?.includes('API key')) {
        return res.status(500).json({
          error: 'API configuration error',
          details: 'Anthropic API key not configured'
        });
      }

      return res.status(500).json({
        error: 'Failed to generate response',
        details: error.message
      });
    }
});

// =============================================================================
// Intimacy & Memory Expansion (Week 13)
// =============================================================================

/**
 * generateConversationStarter - Luna Takes Initiative
 *
 * Generates conversation starters based on:
 * - Unresolved threads (gossip, stories, cliffhangers)
 * - Nostalgia prompts (era-specific memories)
 * - Curiosity questions (genuine interest in user's life)
 *
 * This makes Luna feel like a real friend who remembers and cares.
 */
exports.generateConversationStarter = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, context } = request.data;

  logger.info('[Intimacy] Generating conversation starter for user:', userId);

  try {
    const result = await generateIntimacyPrompt(userId, context || {});
    return {
      success: true,
      ...result
    };
  } catch (error) {
    logger.error('[Intimacy] Error generating starter:', error.message);
    return {
      success: false,
      error: error.message || 'Could not generate conversation starter'
    };
  }
});

/**
 * analyzeUserMessage - Intimacy Signal Detection
 *
 * Analyzes user messages for:
 * - Conversation threads (stories, gossip, funny moments)
 * - First memory sharing (first crush, first love, etc.)
 * - Engagement level (needs eliciting?)
 *
 * Returns suggestions for deepening the conversation.
 */
exports.analyzeUserMessage = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, message, context } = request.data;

  logger.info('[Intimacy] Analyzing message for user:', userId);

  try {
    const result = await analyzeIntimacySignals(userId, message, context || {});
    return {
      success: true,
      ...result
    };
  } catch (error) {
    logger.error('[Intimacy] Error analyzing message:', error.message);
    return {
      success: false,
      error: error.message || 'Could not analyze message'
    };
  }
});

/**
 * getUserEraContext - Age-Appropriate References
 *
 * Returns era-specific context for a user based on their age:
 * - Technology they grew up with
 * - Cultural references from their formative years
 * - Nostalgia triggers for their generation
 *
 * This helps Luna make references that resonate.
 */
exports.getUserEraContext = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  const { userAge } = request.data;

  logger.info('[Intimacy] Getting era context for age:', userAge);

  try {
    const result = getEraContext(userAge);
    return {
      success: true,
      ...result
    };
  } catch (error) {
    logger.error('[Intimacy] Error getting era context:', error.message);
    return {
      success: false,
      error: error.message || 'Could not get era context'
    };
  }
});
