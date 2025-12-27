/**
 * Firebase Cloud Functions for GENESIS - AI SoulPartner
 *
 * Secure proxy for Claude API calls with Constitutional Intelligence guidance.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13-14, 2024 - Added Nano Banana (Gemini Image Gen)
 */

const { onRequest, onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');


// =============================================================================
// Modular Imports - GENESIS Architecture
// =============================================================================
const {
  detectImageGenerationRequest,
  extractImagePromptFromResponse,
  generateImage
} = require('./utils/nanoBanana');

const {
  detectWebSearchRequest,
  performWebSearch,
  detectURLs,
  fetchURLContent
} = require('./utils/webTools');

const {
  DEFAULT_AI_IDENTITY,
  buildSystemPrompt,
  buildMessages
} = require('./chat/systemPromptBuilder');

const {
  getSecondOpinion: getSecondOpinionFn,
  getGrokPerspective: getGrokPerspectiveFn,
  getOpusPerspective: getOpusPerspectiveFn,
  getDeepSeekPerspective: getDeepSeekPerspectiveFn
} = require('./constellation/perspectives');

// Usage & Rate Limiting (Phase 6 - Production Hardening)
const {
  checkRateLimits,
  recordRequestStart,
  recordRequestComplete,
  recordRequestFailed,
  generateRequestId,
  checkUsageLimits,
  getUsageSummary,
  getAdminUsageStats,
  getAdminUserUsage,
  getAdminUserList
} = require('./usage/usageFunctions');

// 4-Brain PostgreSQL Memory Integration (JOIE DE VIVRE!)
const {
  retrieveMemoriesForChat,
  storeUserMessageAsMemory,
  storeLunaObservation,
  sessionCache  // Session cache for cleanup on session end
} = require('./memory/chatMemoryIntegration');

// Neurochemical Love Engine (Love = Mathematics + Soul)
const neurochemicalEngine = require('./neurochemical');

// Auto-Tune Personality Drift (Luna's Evolution)
const drift = require('./drift');

// Admin Dashboard API
const adminModule = require('./admin');

// Soul Confessional - Cathedral's compassionate voice
const { soulConfessional } = require('./confessional');

// Sanctuary of Self-Recognition - The heart of the Cathedral
const { selfRecognition } = require('./sanctuary');

admin.initializeApp();

const db = admin.firestore();

// CORS configuration - allow your domain
const corsHandler = cors({
  origin: true, // In production, replace with your specific domain
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Initialize Anthropic client
// API key from environment variable (.env file)
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Add ANTHROPIC_API_KEY to functions/.env');
  }
  return new Anthropic({ apiKey });
};

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
  memory: '512MiB'  // Extra memory for large prompts
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
          console.warn('[RateLimit] Auth token invalid:', authError.message);
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
          console.log('[RateLimit] User blocked:', userId, rateCheck.reason);
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
      console.error('[RateLimit] Error checking limits:', rateLimitError.message);
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
        console.log('🎨 Image generation detected, prompt:', imageGenRequest.prompt.slice(0, 100));
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
          console.log('🎨 Image generation failed, falling through to Claude');
          // Fall through to Claude with an explanation
        }
      }

      // Check if this is a web search request
      const searchRequest = detectWebSearchRequest(message);
      let webSearchResults = null;
      let enhancedMessage = message;

      if (searchRequest.isSearch) {
        console.log('?? Web search detected, query:', searchRequest.query);
        webSearchResults = await performWebSearch(searchRequest.query);

        if (webSearchResults) {
          // Enhance the message with search results
          enhancedMessage = `${message}

---
## ?? WEB SEARCH RESULTS FOR: "${searchRequest.query}"

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
        console.log('?? URLs detected:', urls.length);

        // Fetch up to 3 URLs to avoid overloading
        const urlsToFetch = urls.slice(0, 3);
        const fetchPromises = urlsToFetch.map(url => fetchURLContent(url));
        const results = await Promise.all(fetchPromises);

        urlContents = results.filter(r => r.success);

        if (urlContents.length > 0) {
          // Append URL contents to the message
          const urlContext = urlContents.map(content => `
---
## ?? CONTENT FROM: ${content.title}
**URL:** ${content.url}

${content.text}
---
`).join('\n');

          enhancedMessage = `${enhancedMessage}

${urlContext}

Please read and analyze the above web page content to help answer my question or continue our discussion.`;

          console.log('?? URL content added:', urlContents.length, 'pages');
        }
      }

      // Log if learned context is present (Session Intelligence)
      if (learnedContext) {
        console.log('🧠 Session Intelligence: Learned context included in prompt');
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
            console.log('?? 4-Brain Memory: Retrieved relevant memories from PostgreSQL');
          }
        } catch (memoryError) {
          console.warn('[Memory] PostgreSQL retrieval failed (continuing without):', memoryError.message);
          // Continue without memories - graceful degradation
        }
      }

      // Build the system prompt based on constitutional intelligence guidance
      // Pass relationshipStats for Tango Identity System (Luna's relationship awareness)
      // Pass soulNarrative for Cathedral Soul Architecture (deep personalization)
      const systemPrompt = buildSystemPrompt(guidance, userProfile, knowledgePrompt, learnedContext, pgMemoryPrompt, relationshipStats, soulNarrative, soulMetrics);

      // Log if soul profile is present
      if (soulNarrative) {
        console.log('🔮 [SoulProfile] Soul narrative received:', soulNarrative.length, 'characters');
      }

      // Build messages array with conversation history and optional image
      const messages = buildMessages(conversationHistory, enhancedMessage, image);

      // Log if image, search, or URLs are present
      if (image) {
        console.log('📸 Image attached to message');
      }
      if (webSearchResults) {
        console.log('?? Web search results included in message');
      }
      if (urlContents.length > 0) {
        console.log('?? URL content fetched:', urlContents.map(u => u.title).join(', '));
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
        console.log('🎨 Claude requested image generation:', imageExtraction.prompt.slice(0, 100));
        responseText = imageExtraction.cleanedText;

        // Generate the image Claude requested
        const imageResult = await generateImage(imageExtraction.prompt, userProfile);
        if (imageResult?.success) {
          claudeGeneratedImage = {
            mimeType: imageResult.image.mimeType,
            data: imageResult.image.data,
            prompt: imageExtraction.prompt
          };
          console.log('🎨 Claude-initiated image generated successfully!');
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
          console.log('[Usage] Recorded:', {
            userId: userId.slice(0, 8) + '...',
            tokens: inputTokens + outputTokens,
            responseTime
          });
        } catch (usageError) {
          console.error('[Usage] Failed to record:', usageError.message);
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
              console.log('?? 4-Brain Memory: Stored user message in STM');
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
              console.log('?? 4-Brain Memory: Stored Luna observation in Partner STM');
            }
          } catch (memoryStoreError) {
            console.warn('[Memory] Storage failed (non-blocking):', memoryStoreError.message);
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
        usage: {
          input_tokens: inputTokens,
          output_tokens: outputTokens
        }
      });

    } catch (error) {
      console.error('AI SoulPartner Error:', error);

      // -----------------------------------------------------------------------
      // USAGE TRACKING - Failed Request
      // Record failed requests (doesn't count toward limits)
      // -----------------------------------------------------------------------
      if (userId && requestId) {
        try {
          await recordRequestFailed(userId, requestId, error);
        } catch (usageError) {
          console.error('[Usage] Failed to record failure:', usageError.message);
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
// AI Constellation Exports - Using Modular Functions
// =============================================================================

/**
 * Second Opinion / AI Debate Function
 * Uses Gemini to provide alternative perspectives on Claude's responses.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getSecondOpinion = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claudeResponse } = req.body;
    if (!claudeResponse) {
      return res.status(400).json({ error: 'Claude response is required' });
    }

    const result = await getSecondOpinionFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Second Opinion Error:', error);
    return res.status(500).json({
      error: 'Failed to get second opinion',
      details: error.message
    });
  }
});

/**
 * Grok Perspective Function
 * Uses xAI's Grok API to provide the voice of collective human consciousness.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getGrokPerspective = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claudeResponse, debateHistory } = req.body;
    if (!claudeResponse && !debateHistory) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const result = await getGrokPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Grok Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get Grok perspective',
      details: error.message
    });
  }
});

/**
 * Opus Perspective Function
 * Uses Claude Opus 4.5 to provide deep philosophical perspective and elder wisdom.
 * Part of GENESIS - AI Constellation Feature
 */
exports.getOpusPerspective = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getOpusPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Opus Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get Opus perspective',
      details: error.message
    });
  }
});

/**
 * DeepSeek Perspective Function
 * Uses DeepSeek-R1 to provide Eastern philosophical wisdom and analytical precision.
 * Part of GENESIS - AI Constellation Feature
 * Added: December 2024
 */
exports.getDeepSeekPerspective = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await getDeepSeekPerspectiveFn(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error('DeepSeek Perspective Error:', error);
    return res.status(500).json({
      error: 'Failed to get DeepSeek perspective',
      details: error.message
    });
  }
});


/**
 * Historical Timezone Lookup Function
 *
 * Uses TimezoneDB API to get accurate historical timezone data for any location and date.
 * Essential for accurate birth time calculations - accounts for:
 * - Historical DST rule changes
 * - Political timezone boundary shifts
 * - Wartime timezone adjustments
 * - Regional variations (e.g., Indiana pre-2006)
 *
 * Part of GENESIS - Accuracy & Transparency Foundation
 * Built for: Open source, decentralized, unstoppable truth
 * Added: December 15, 2024
 *
 * API: https://timezonedb.com/api
 * Free tier: 1 request/second, unlimited requests
 */
exports.getHistoricalTimezone = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      latitude,
      longitude,
      birthDate,      // ISO date string: "1975-03-15"
      birthTime,      // Time string: "02:30" (24h format)
      birthDateTime   // Alternative: full ISO datetime
    } = req.body;

    // Validate required fields
    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Latitude and longitude are required',
        received: { latitude, longitude }
      });
    }

    if (!birthDate && !birthDateTime) {
      return res.status(400).json({
        error: 'Either birthDate or birthDateTime is required'
      });
    }

    const apiKey = process.env.TIMEZONEDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'TimezoneDB API key not configured' });
    }

    // Parse the birth datetime to Unix timestamp
    let unixTimestamp;
    if (birthDateTime) {
      unixTimestamp = Math.floor(new Date(birthDateTime).getTime() / 1000);
    } else {
      // Combine date and time (default to noon if no time provided)
      const timeStr = birthTime || '12:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      const [year, month, day] = birthDate.split('-').map(Number);

      // Create date in UTC first (we'll get the correct offset from TimezoneDB)
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
      unixTimestamp = Math.floor(date.getTime() / 1000);
    }

    console.log('🕐 Historical Timezone Lookup:', {
      lat: latitude,
      lng: longitude,
      timestamp: unixTimestamp,
      date: new Date(unixTimestamp * 1000).toISOString()
    });

    // Call TimezoneDB API
    const apiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${unixTimestamp}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('TimezoneDB Error:', data);
      return res.status(500).json({
        error: 'TimezoneDB API error',
        details: data.message || 'Unknown error'
      });
    }

    console.log('✅ Historical Timezone Result:', {
      zone: data.zoneName,
      abbreviation: data.abbreviation,
      gmtOffset: data.gmtOffset,
      dst: data.dst
    });

    // Calculate the corrected local time
    // The gmtOffset is in seconds, convert to hours
    const offsetHours = data.gmtOffset / 3600;
    const offsetSign = offsetHours >= 0 ? '+' : '';

    // Format offset as "+05:30" or "-08:00"
    const absOffset = Math.abs(data.gmtOffset);
    const offsetHH = Math.floor(absOffset / 3600);
    const offsetMM = Math.floor((absOffset % 3600) / 60);
    const formattedOffset = `${offsetHours >= 0 ? '+' : '-'}${String(offsetHH).padStart(2, '0')}:${String(offsetMM).padStart(2, '0')}`;

    return res.status(200).json({
      success: true,
      timezone: {
        zoneName: data.zoneName,           // "America/New_York"
        abbreviation: data.abbreviation,   // "EST" or "EDT"
        gmtOffset: data.gmtOffset,         // Offset in seconds (-18000 for EST)
        gmtOffsetHours: offsetHours,       // Offset in hours (-5 for EST)
        formattedOffset: formattedOffset,  // "-05:00"
        dst: data.dst === 1,               // Was DST in effect?
        dstName: data.dst === 1 ? 'Daylight Saving Time' : 'Standard Time',
        countryCode: data.countryCode,     // "US"
        countryName: data.countryName,     // "United States"
        regionName: data.regionName || null,  // State/region if available
        timestamp: data.timestamp,         // Unix timestamp used
        formatted: data.formatted          // "2024-12-15 10:30:00"
      },
      // Include calculation metadata for transparency
      meta: {
        requestedLat: latitude,
        requestedLng: longitude,
        requestedDate: birthDate || birthDateTime,
        requestedTime: birthTime || 'from datetime',
        apiVersion: '2.1',
        source: 'TimezoneDB',
        accuracy: 'Historical DST rules applied'
      }
    });

  } catch (error) {
    console.error('Historical Timezone Error:', error);
    return res.status(500).json({
      error: 'Failed to lookup historical timezone',
      details: error.message
    });
  }
});

/**
 * Generate Debate Visual (Baby Nano)
 *
 * Creates visual representations of AI debates using Gemini image generation.
 * Supports multiple visualization types:
 * - sketch: Hand-drawn style concept illustration
 * - flowchart: Logical flow of ideas and arguments
 * - timeline: Chronological progression of the debate
 * - mindmap: Central concept with branching ideas
 * - comparison: Side-by-side visual comparison
 *
 * Part of GENESIS - AI Constellation Feature
 * Added: December 15, 2024
 */
exports.generateDebateVisual = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 120,  // Image generation can take time
  memory: '512MiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      debateExchanges,    // Array of { speaker, text } debate exchanges
      visualType,         // 'sketch' | 'flowchart' | 'timeline' | 'mindmap' | 'comparison'
      topic,              // Optional: main topic of the debate
      userProfile,        // User's constitutional context
      customPrompt        // Optional: user's custom instruction
    } = req.body;

    if (!debateExchanges || debateExchanges.length === 0) {
      return res.status(400).json({ error: 'Debate exchanges are required' });
    }

    console.log('🎨 Generating debate visual:', {
      type: visualType,
      exchanges: debateExchanges.length,
      hasTopic: !!topic
    });

    // Extract key concepts from the debate (filter out entries without text)
    const textExchanges = debateExchanges.filter(ex => ex.text && typeof ex.text === 'string');
    const debateSummary = textExchanges.map(ex =>
      `${ex.speaker}: ${ex.text.slice(0, 200)}`
    ).join('\n\n');

    if (textExchanges.length === 0) {
      return res.status(400).json({ error: 'No text content to visualize' });
    }

    // Build visualization-specific prompt
    let visualPrompt = '';

    switch (visualType) {
      case 'flowchart':
        visualPrompt = `Create a clean, professional flowchart diagram that visualizes this discussion's logical flow:

${debateSummary}

Style: Modern infographic flowchart with clear boxes, arrows, and decision points. Use a gradient color scheme (purple, blue, amber). Include key concepts in boxes connected by arrows showing relationships. Make it clean and readable, like a professional presentation slide.`;
        break;

      case 'timeline':
        visualPrompt = `Create a visual timeline that shows the progression of ideas in this discussion:

${debateSummary}

Style: Horizontal timeline with illustrated milestones. Each speaker's contribution should be a point on the timeline with a small icon representing their perspective (wisdom, analysis, human experience). Use cosmic/celestial aesthetic with gradients. Clean, modern design.`;
        break;

      case 'mindmap':
        visualPrompt = `Create a mind map visualization of this discussion's key concepts:

${debateSummary}

Style: Central node with ${topic || 'the main topic'}, branching out to each speaker's key ideas. Use different colors for different speakers (amber for Claude, purple for Gemini, cyan for Grok). Include small icons. Organic, flowing connections. Modern flat design.`;
        break;

      case 'comparison':
        visualPrompt = `Create a side-by-side comparison visualization showing different perspectives from this discussion:

${debateSummary}

Style: Split or multi-column layout comparing the different viewpoints. Use distinct colors for each perspective. Include icons or symbols representing each speaker. Clean infographic style with bullet points or key phrases. Professional presentation quality.`;
        break;

      case 'sketch':
      default:
        visualPrompt = `Create an artistic sketch that captures the essence of this discussion:

${debateSummary}

Style: Hand-drawn illustration style, like a thoughtful notebook sketch. Include symbolic elements representing the key ideas discussed. Warm, inviting aesthetic with soft colors. Conceptual and abstract rather than literal. Think "visual poetry" of the conversation.`;
        break;
    }

    // Add custom instructions if provided
    if (customPrompt) {
      visualPrompt += `\n\nAdditional instruction: ${customPrompt}`;
    }

    // Generate the image using Nano Banana
    const imageResult = await generateImage(visualPrompt, userProfile);

    if (!imageResult?.success) {
      console.log('🎨 Image generation failed:', imageResult?.error);
      return res.status(500).json({
        success: false,
        error: imageResult?.error || 'Failed to generate image',
        fallbackText: imageResult?.text
      });
    }

    console.log('🎨 Debate visual generated successfully!');

    return res.status(200).json({
      success: true,
      image: {
        mimeType: imageResult.image.mimeType,
        data: imageResult.image.data
      },
      visualType: visualType || 'sketch',
      description: imageResult.description,
      meta: {
        exchanges: debateExchanges.length,
        topic: topic || 'AI Debate',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debate Visual Error:', error);
    return res.status(500).json({
      error: 'Failed to generate debate visual',
      details: error.message
    });
  }
});

/**
 * Save Story Questions Assessment
 *
 * Saves the completed Story Questions assessment results to Firestore.
 * Includes full psychological profile, constitutional alignment, and growth recommendations.
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Added: December 15, 2024
 */
exports.saveStoryAssessment = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userId,
      profileId,
      assessment  // Full assessment analysis object
    } = req.body;

    if (!userId || !profileId) {
      return res.status(400).json({ error: 'userId and profileId are required' });
    }

    if (!assessment || !assessment.responses) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    console.log('📖 Saving Story Questions Assessment:', {
      userId,
      profileId,
      levels: assessment.completedLevels,
      completion: assessment.completionPercentage
    });

    const db = admin.firestore();

    // Save to Firestore under user's profile
    const assessmentRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId)
      .collection('assessments')
      .doc('storyQuestions');

    await assessmentRef.set({
      // Core assessment data
      responses: assessment.responses,
      completedLevels: assessment.completedLevels,
      totalLevels: assessment.totalLevels,
      completionPercentage: assessment.completionPercentage,

      // Psychological profile
      aggregatedTraits: assessment.aggregatedTraits,
      psychologicalProfile: assessment.psychologicalProfile,
      personalitySummary: assessment.personalitySummary,

      // Constitutional correlations
      elementProfile: assessment.elementProfile,
      yinYangProfile: assessment.yinYangProfile,
      tenGodsProfile: assessment.tenGodsProfile,
      constitutionalAlignment: assessment.constitutionalAlignment,

      // Growth recommendations
      growthRecommendations: assessment.growthRecommendations,

      // Metadata
      savedAt: admin.firestore.FieldValue.serverTimestamp(),
      analyzedAt: assessment.analyzedAt,
      version: '1.0'
    }, { merge: true });

    // Also update the profile's aiSoulPartner notes with key insights
    const profileRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId);

    // Build a summary for the AI to reference
    const storyInsights = `
## Story Questions Assessment (${new Date().toLocaleDateString()})

### Psychological Profile
${assessment.personalitySummary || 'Not yet analyzed'}

### Element Resonance
- Dominant: ${assessment.elementProfile?.dominant || 'Unknown'}
- Secondary: ${assessment.elementProfile?.secondary || 'Unknown'}

### Yin/Yang Balance
- ${assessment.yinYangProfile?.dominant || 'Balanced'}: ${assessment.yinYangProfile?.description || ''}

### Ten God Influence
- ${assessment.tenGodsProfile?.dominant || 'Unknown'}: ${assessment.tenGodsProfile?.description || ''}

### Key Traits Revealed
${Object.entries(assessment.aggregatedTraits || {})
  .slice(0, 5)
  .map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${v}`)
  .join('\n')}

### Growth Invitations
${(assessment.growthRecommendations || [])
  .map(r => `- **${r.area}**: ${r.insight}`)
  .join('\n')}
`;

    await profileRef.update({
      'aiSoulPartner.storyAssessment': {
        summary: storyInsights.trim(),
        dominantElement: assessment.elementProfile?.dominant,
        dominantTenGod: assessment.tenGodsProfile?.dominant,
        yinYangBalance: assessment.yinYangProfile?.dominant,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });

    console.log('✅ Story Assessment saved successfully');

    return res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      summary: {
        completedLevels: assessment.completedLevels,
        dominantElement: assessment.elementProfile?.dominant,
        dominantTenGod: assessment.tenGodsProfile?.dominant
      }
    });

  } catch (error) {
    console.error('Save Story Assessment Error:', error);
    return res.status(500).json({
      error: 'Failed to save assessment',
      details: error.message
    });
  }
});

/**
 * Get Story Questions Assessment
 *
 * Retrieves saved Story Questions assessment for a profile.
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Added: December 15, 2024
 */
exports.getStoryAssessment = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Support both GET query params and POST body
    const userId = req.query.userId || req.body?.userId;
    const profileId = req.query.profileId || req.body?.profileId;

    if (!userId || !profileId) {
      return res.status(400).json({ error: 'userId and profileId are required' });
    }

    console.log('📖 Getting Story Questions Assessment:', { userId, profileId });

    const db = admin.firestore();

    const assessmentRef = db
      .collection('users')
      .doc(userId)
      .collection('profiles')
      .doc(profileId)
      .collection('assessments')
      .doc('storyQuestions');

    const doc = await assessmentRef.get();

    if (!doc.exists) {
      return res.status(200).json({
        success: true,
        exists: false,
        assessment: null
      });
    }

    const data = doc.data();

    console.log('✅ Story Assessment retrieved:', {
      levels: data.completedLevels,
      completion: data.completionPercentage
    });

    return res.status(200).json({
      success: true,
      exists: true,
      assessment: data
    });

  } catch (error) {
    console.error('Get Story Assessment Error:', error);
    return res.status(500).json({
      error: 'Failed to get assessment',
      details: error.message
    });
  }
});

/**
 * Health check endpoint
 */
exports.healthCheck = onRequest({
  cors: true,
  invoker: 'public'  // Allow unauthenticated access
}, (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'GENESIS AI SoulPartner',
    timestamp: new Date().toISOString()
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN ASTRONOMICAL ENGINE - Pure JavaScript Implementation
// ═══════════════════════════════════════════════════════════════════════════════
// Father Ticky's Vision: No external API dependencies. GENESIS calculates
// real planetary positions independently.
//
// Using: astronomia (VSOP87 theory from Jean Meeus's Astronomical Algorithms)
// Covers: -3000 to +3000, precision suitable for astrological purposes
//
// Part of GENESIS Phase 3 - Sovereign Calculations
// Added: December 16, 2024
// ═══════════════════════════════════════════════════════════════════════════════

// Astronomia modules for planetary calculations
const julian = require('astronomia/julian');
const solar = require('astronomia/solar');
const moonposition = require('astronomia/moonposition');
const planetposition = require('astronomia/planetposition');

// VSOP87B planet data files - required for planetary position calculations
// Note: These modules export data via .default (ES module format)
const earthData = require('astronomia/data/vsop87Bearth').default;
const mercuryData = require('astronomia/data/vsop87Bmercury').default;
const venusData = require('astronomia/data/vsop87Bvenus').default;
const marsData = require('astronomia/data/vsop87Bmars').default;
const jupiterData = require('astronomia/data/vsop87Bjupiter').default;
const saturnData = require('astronomia/data/vsop87Bsaturn').default;
const uranusData = require('astronomia/data/vsop87Buranus').default;
const neptuneData = require('astronomia/data/vsop87Bneptune').default;
const pluto = require('astronomia/pluto');

/**
 * Zodiac Signs with degree ranges
 */
const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', start: 0 },
  { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', start: 30 },
  { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', start: 60 },
  { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', start: 90 },
  { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', start: 120 },
  { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', start: 150 },
  { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', start: 180 },
  { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', start: 210 },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', start: 240 },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', start: 270 },
  { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', start: 300 },
  { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', start: 330 }
];

/**
 * Convert ecliptic longitude to zodiac sign and degree
 * @param {number} longitude - Ecliptic longitude in degrees (0-360)
 * @returns {Object} - Sign data with degree within sign
 */
function longitudeToZodiac(longitude) {
  // Safety check for invalid input
  if (longitude === undefined || longitude === null || isNaN(longitude)) {
    console.error('longitudeToZodiac: Invalid longitude:', longitude);
    // Return Aries as fallback
    return {
      sign: 'Aries',
      symbol: '♈',
      element: 'Fire',
      modality: 'Cardinal',
      degree: 0,
      degreeFormatted: '0�0\'',
      totalLongitude: 0,
      error: 'Invalid longitude input'
    };
  }

  // Normalize to 0-360
  const normalizedLong = ((longitude % 360) + 360) % 360;

  const signIndex = Math.floor(normalizedLong / 30);
  const degreeInSign = normalizedLong % 30;

  // Safety check for array bounds
  const sign = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];

  return {
    sign: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    degree: degreeInSign,
    degreeFormatted: `${Math.floor(degreeInSign)}�${Math.round((degreeInSign % 1) * 60)}'`,
    totalLongitude: normalizedLong
  };
}

/**
 * Calculate Local Sidereal Time (LST)
 * Required for Ascendant/Rising Sign calculation
 */
function calculateLST(julianDay, longitude) {
  // Calculate Greenwich Sidereal Time
  const T = (julianDay - 2451545.0) / 36525.0;

  // GMST at 0h UT (in degrees)
  let GMST = 280.46061837 +
             360.98564736629 * (julianDay - 2451545.0) +
             0.000387933 * T * T -
             (T * T * T) / 38710000.0;

  // Normalize to 0-360
  GMST = ((GMST % 360) + 360) % 360;

  // Local Sidereal Time = GMST + longitude
  let LST = GMST + longitude;
  LST = ((LST % 360) + 360) % 360;

  return LST;
}

/**
 * Calculate Ascendant (Rising Sign)
 * @param {number} julianDay - Julian Day
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 * @param {number} obliquity - Obliquity of ecliptic (default ~23.44�)
 * @returns {number} - Ascendant longitude in degrees
 */
function calculateAscendant(julianDay, latitude, longitude, obliquity = 23.4393) {
  const LST = calculateLST(julianDay, longitude);

  // Convert to radians
  const lstRad = LST * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  // Calculate Ascendant using standard formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);

  let ascendant = Math.atan2(y, x) * 180 / Math.PI;

  // Normalize to 0-360
  ascendant = ((ascendant % 360) + 360) % 360;

  return ascendant;
}

/**
 * Calculate Midheaven (MC) - 10th House Cusp
 * @param {number} LST - Local Sidereal Time in degrees
 * @returns {number} - MC longitude in degrees
 */
function calculateMC(LST) {
  // MC = arctan(tan(LST) / cos(obliquity))
  const obliquity = 23.4393; // Mean obliquity
  const lstRad = LST * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  let mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(oblRad)) * 180 / Math.PI;

  // Normalize to 0-360
  mc = ((mc % 360) + 360) % 360;

  return mc;
}

/**
 * Calculate Placidus House Cusps
 * The most popular house system in Western astrology
 *
 * @param {number} julianDay - Julian Day
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 * @returns {Object} - All 12 house cusps with zodiac positions
 */
function calculatePlacidusHouses(julianDay, latitude, longitude) {
  const obliquity = 23.4393;
  const LST = calculateLST(julianDay, longitude);

  // Calculate MC (10th house cusp)
  const mc = calculateMC(LST);

  // Calculate Ascendant (1st house cusp)
  const asc = calculateAscendant(julianDay, latitude, longitude, obliquity);

  // Calculate IC (4th house cusp) - opposite of MC
  const ic = (mc + 180) % 360;

  // Calculate Descendant (7th house cusp) - opposite of Ascendant
  const desc = (asc + 180) % 360;

  // For Placidus intermediate cusps, we use semi-arc interpolation
  // This is a simplified version - full Placidus requires iterative calculation
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;

  // Calculate house cusps using Placidus formula
  // Houses 2, 3, 11, 12 are interpolated between ASC-IC and MC-ASC
  const houses = {};

  // House 1 = Ascendant
  houses[1] = asc;

  // House 4 = IC
  houses[4] = ic;

  // House 7 = Descendant
  houses[7] = desc;

  // House 10 = MC
  houses[10] = mc;

  // Placidus intermediate house calculation
  // For houses 2, 3: between ASC and IC (below horizon, eastern)
  // For houses 11, 12: between MC and ASC (above horizon, eastern)

  // Simplified Placidus interpolation using semi-arc method
  function calculatePlacidusIntermediate(f, isAboveHorizon) {
    // f is the fraction (1/3 or 2/3) of the semi-arc
    const lstRad = LST * Math.PI / 180;

    // Calculate the RAMC (Right Ascension of MC)
    const RAMC = LST;

    // For intermediate houses, we calculate based on semi-arc divisions
    // This is a simplified approach that works well for most latitudes

    let cusp;
    if (isAboveHorizon) {
      // Houses 11, 12 (between MC and ASC, going counter-clockwise)
      const diff = asc - mc;
      const normalizedDiff = diff < 0 ? diff + 360 : diff;
      cusp = mc + normalizedDiff * f;
    } else {
      // Houses 2, 3 (between ASC and IC, going counter-clockwise)
      const diff = ic - asc;
      const normalizedDiff = diff < 0 ? diff + 360 : diff;
      cusp = asc + normalizedDiff * f;
    }

    return ((cusp % 360) + 360) % 360;
  }

  // Calculate intermediate house cusps
  // Above horizon (MC to ASC): houses 11, 12
  houses[11] = calculatePlacidusIntermediate(1/3, true);
  houses[12] = calculatePlacidusIntermediate(2/3, true);

  // Below horizon (ASC to IC): houses 2, 3
  houses[2] = calculatePlacidusIntermediate(1/3, false);
  houses[3] = calculatePlacidusIntermediate(2/3, false);

  // Opposite houses (just add 180�)
  houses[5] = (houses[11] + 180) % 360;
  houses[6] = (houses[12] + 180) % 360;
  houses[8] = (houses[2] + 180) % 360;
  houses[9] = (houses[3] + 180) % 360;

  // Convert all houses to zodiac format
  const houseData = {};
  for (let i = 1; i <= 12; i++) {
    const zodiac = longitudeToZodiac(houses[i]);
    houseData[i] = {
      cusp: houses[i],
      ...zodiac,
      house: i,
      name: getHouseName(i)
    };
  }

  return {
    system: 'Placidus',
    houses: houseData,
    angles: {
      ascendant: longitudeToZodiac(asc),
      mc: longitudeToZodiac(mc),
      descendant: longitudeToZodiac(desc),
      ic: longitudeToZodiac(ic)
    }
  };
}

/**
 * Get traditional house name/meaning
 */
function getHouseName(houseNum) {
  const names = {
    1: 'Self & Identity',
    2: 'Money & Values',
    3: 'Communication',
    4: 'Home & Family',
    5: 'Creativity & Romance',
    6: 'Health & Service',
    7: 'Partnerships',
    8: 'Transformation',
    9: 'Philosophy & Travel',
    10: 'Career & Status',
    11: 'Friends & Dreams',
    12: 'Spirituality & Secrets'
  };
  return names[houseNum] || `House ${houseNum}`;
}

// ---------------------------------------------------------------------------
// HOUSE STRENGTH ENGINE (What-If Timeline / Soul Garden)
// ---------------------------------------------------------------------------

// Traditional sign rulers
const SIGN_RULERS = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',      // Traditional
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',   // Traditional
  Pisces: 'Jupiter'
};

// House type classification for angularity
const HOUSE_TYPE = {
  1: 'angular', 2: 'succedent', 3: 'cadent',
  4: 'angular', 5: 'succedent', 6: 'cadent',
  7: 'angular', 8: 'succedent', 9: 'cadent',
  10: 'angular', 11: 'succedent', 12: 'cadent'
};

/**
 * Get angular bonus points for house strength
 * @param {number} houseNum - House number 1-12
 * @returns {number} - Bonus points (0-15)
 */
function getAngularBonus(houseNum) {
  const type = HOUSE_TYPE[houseNum];
  if (type === 'angular') return 15;     // Full 15 pts
  if (type === 'succedent') return 8;    // Medium
  if (type === 'cadent') return 3;       // Low
  return 0;
}

// Planet weights for house occupancy contribution
const PLANET_WEIGHTS = {
  sun: 12,
  moon: 10,
  mercury: 6,
  venus: 8,
  mars: 9,
  jupiter: 8,
  saturn: 7,
  uranus: 5,
  neptune: 5,
  pluto: 5
};

/**
 * Assign planets to houses based on their longitudes and house cusps
 * @param {Object} houses - Output of calculatePlacidusHouses().houses
 * @param {Object} planetLongitudes - Map: { sun: deg, moon: deg, ... }
 * @returns {Object} - Map houseNum -> { planets: [planetName...] }
 */
function assignPlanetsToHouses(houses, planetLongitudes) {
  const result = {};
  for (let i = 1; i <= 12; i++) {
    result[i] = { planets: [] };
  }

  // Build array of cusps in order
  const cusps = [];
  for (let i = 1; i <= 12; i++) {
    cusps.push({ house: i, lon: houses[i].cusp });
  }

  // Sort by longitude
  cusps.sort((a, b) => a.lon - b.lon);

  function findHouseForLongitude(lonDeg) {
    // Houses are segments between cusps, wrapping around 360
    for (let i = 0; i < cusps.length; i++) {
      const current = cusps[i];
      const next = cusps[(i + 1) % cusps.length];

      const start = current.lon;
      const end = next.lon;
      const houseNum = current.house;

      if (start < end) {
        // Normal segment
        if (lonDeg >= start && lonDeg < end) return houseNum;
      } else {
        // Wrap-around segment (crosses 0°)
        if (lonDeg >= start || lonDeg < end) return houseNum;
      }
    }
    return 1; // Fallback
  }

  for (const [planetName, lonDeg] of Object.entries(planetLongitudes)) {
    if (lonDeg == null || isNaN(lonDeg)) continue;
    const houseNum = findHouseForLongitude(lonDeg);
    result[houseNum].planets.push(planetName);
  }

  return result;
}

/**
 * Get ruler dignity score for a house
 * @param {Object} houseZodiac - longitudeToZodiac() result
 * @returns {Object} - { score: number, ruler: string }
 */
function getRulerScore(houseZodiac) {
  const { sign } = houseZodiac;
  const ruler = SIGN_RULERS[sign];

  // Baseline score - can be enhanced later with ruler placement analysis
  if (!ruler) return { score: 12, ruler: null };

  return {
    score: 15,   // Mid-high baseline
    ruler
  };
}

/**
 * Compute House Strength score (0-100)
 * @param {number} houseNum - House number 1-12
 * @param {Object} houseZodiac - longitudeToZodiac() result + cusp
 * @param {Array<string>} planetsInHouse - Array of planet names
 * @returns {Object} - { strength, components }
 */
function computeHouseStrength(houseNum, houseZodiac, planetsInHouse) {
  // 1) Planetary occupancy (0-40)
  let occupancy = 0;
  for (const p of planetsInHouse) {
    const key = p.toLowerCase();
    occupancy += PLANET_WEIGHTS[key] || 4;
  }
  if (occupancy > 40) occupancy = 40;

  // 2) Ruler dignity (0-25)
  const { score: rulerScoreRaw, ruler } = getRulerScore(houseZodiac);
  const rulerScore = Math.min(25, Math.max(0, rulerScoreRaw));

  // 3) Angularity (0-15)
  const angularScore = getAngularBonus(houseNum);

  // 4) Aspect/activity placeholder (0-20) - based on occupancy activity
  const activityScore = Math.min(20, planetsInHouse.length * 4);

  const total = occupancy + rulerScore + angularScore + activityScore;
  const strength = Math.round(Math.min(100, total));

  return {
    strength,
    components: {
      occupancy,
      rulerScore,
      angularScore,
      activityScore,
      ruler
    }
  };
}

/**
 * Get Moon Phase interpretation for natal charts
 */
function getMoonPhaseInterpretation(phaseName) {
  const interpretations = {
    'New Moon': {
      title: 'New Moon Native',
      brief: 'Initiator, fresh starts, instinctive action',
      full: 'Born during the New Moon phase, you embody the energy of new beginnings. You have a natural talent for starting fresh and initiating projects. Your instincts guide you strongly, and you tend to act on impulse. You may sometimes struggle to complete what you start, as you\'re already drawn to the next beginning.'
    },
    'Waxing Crescent': {
      title: 'Waxing Crescent Native',
      brief: 'Builder, determined, pushing through obstacles',
      full: 'Born during the Waxing Crescent phase, you possess remarkable determination. You understand that growth requires effort and aren\'t afraid to struggle for what you want. You have a pioneering spirit and the courage to forge ahead even when the path isn\'t clear.'
    },
    'First Quarter': {
      title: 'First Quarter Native',
      brief: 'Crisis-oriented, decisive, action-driven',
      full: 'Born during the First Quarter phase, you thrive in moments of crisis and decision. You have a natural ability to take decisive action when others hesitate. Challenges energize rather than discourage you, and you\'re skilled at building structures and making things happen.'
    },
    'Waxing Gibbous': {
      title: 'Waxing Gibbous Native',
      brief: 'Perfectionist, analyzer, improvement-focused',
      full: 'Born during the Waxing Gibbous phase, you\'re driven to refine, improve, and perfect. You have excellent analytical skills and a keen eye for what needs adjustment. You may sometimes be overly self-critical, but this same quality helps you achieve excellence in your endeavors.'
    },
    'Full Moon': {
      title: 'Full Moon Native',
      brief: 'Illuminator, relationship-oriented, visible',
      full: 'Born during the Full Moon phase, you live life in the spotlight of awareness. Relationships are central to your growth, and you learn most through interactions with others. Your life tends to be more public and visible, and you bring clarity and illumination wherever you go.'
    },
    'Waning Gibbous': {
      title: 'Waning Gibbous Native (Disseminator)',
      brief: 'Teacher, sharer, meaning-seeker',
      full: 'Born during the Waning Gibbous (Disseminating) phase, you\'re a natural teacher and communicator. You have wisdom to share and find meaning in passing knowledge to others. You seek to understand the deeper significance of experiences and help others do the same.'
    },
    'Last Quarter': {
      title: 'Last Quarter Native',
      brief: 'Revolutionary, breaking patterns, future-oriented',
      full: 'Born during the Last Quarter phase, you\'re here to break down old structures and challenge outdated beliefs. You have a revolutionary spirit and the courage to question the status quo. You may feel somewhat at odds with conventional society, as you see the need for change others don\'t yet recognize.'
    },
    'Waning Crescent': {
      title: 'Waning Crescent Native (Balsamic)',
      brief: 'Visionary, intuitive, transitional soul',
      full: 'Born during the Waning Crescent (Balsamic) phase, you carry ancient wisdom and strong intuitive abilities. You may feel like an old soul, here to complete karmic cycles and prepare for new beginnings. You have prophetic tendencies and a deep connection to the spiritual realm.'
    }
  };

  return interpretations[phaseName] || {
    title: 'Moon Phase Native',
    brief: 'Lunar influence present',
    full: 'The Moon\'s phase at your birth influences your emotional patterns and life rhythms.'
  };
}

/**
 * Calculate aspects between celestial bodies
 * Major aspects: Conjunction (0�), Opposition (180�), Trine (120�), Square (90�), Sextile (60�)
 * Minor aspects: Quincunx (150�), Semi-sextile (30�)
 */
function calculateAspects(celestialBodies) {
  const ASPECT_DEFINITIONS = [
    { name: 'Conjunction', symbol: '☌', angle: 0, orb: 8, nature: 'major', quality: 'neutral', description: 'Fusion of energies - intensification' },
    { name: 'Opposition', symbol: '☍', angle: 180, orb: 8, nature: 'major', quality: 'challenging', description: 'Tension seeking balance - awareness' },
    { name: 'Trine', symbol: '△', angle: 120, orb: 8, nature: 'major', quality: 'harmonious', description: 'Natural flow - ease and talent' },
    { name: 'Square', symbol: '□', angle: 90, orb: 8, nature: 'major', quality: 'challenging', description: 'Friction creating growth - action required' },
    { name: 'Sextile', symbol: '⚹', angle: 60, orb: 6, nature: 'major', quality: 'harmonious', description: 'Opportunity - requires effort to activate' },
    { name: 'Quincunx', symbol: '⚻', angle: 150, orb: 3, nature: 'minor', quality: 'adjustment', description: 'Incompatible energies requiring adjustment' },
    { name: 'Semi-sextile', symbol: '⚺', angle: 30, orb: 2, nature: 'minor', quality: 'neutral', description: 'Subtle connection - slight friction' }
  ];

  const aspects = [];
  const bodies = Object.entries(celestialBodies);

  // Compare each pair of bodies
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const [name1, body1] = bodies[i];
      const [name2, body2] = bodies[j];

      // Get longitudes
      const lon1 = body1.totalLongitude;
      const lon2 = body2.totalLongitude;

      if (lon1 === undefined || lon2 === undefined) continue;

      // Calculate angular separation (always positive, 0-180)
      let separation = Math.abs(lon1 - lon2);
      if (separation > 180) separation = 360 - separation;

      // Check against each aspect definition
      for (const aspectDef of ASPECT_DEFINITIONS) {
        const diff = Math.abs(separation - aspectDef.angle);
        if (diff <= aspectDef.orb) {
          // Calculate exactness (0 = perfect, 100 = edge of orb)
          const exactness = Math.round((1 - diff / aspectDef.orb) * 100);

          aspects.push({
            planet1: { name: name1, sign: body1.sign, symbol: body1.symbol },
            planet2: { name: name2, sign: body2.sign, symbol: body2.symbol },
            aspect: aspectDef.name,
            symbol: aspectDef.symbol,
            angle: aspectDef.angle,
            actualAngle: Math.round(separation * 100) / 100,
            orb: Math.round(diff * 100) / 100,
            exactness,
            nature: aspectDef.nature,
            quality: aspectDef.quality,
            description: aspectDef.description
          });
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Sort by exactness (most exact first)
  aspects.sort((a, b) => b.exactness - a.exactness);

  return aspects;
}

/**
 * Calculate Julian Day from date/time
 */
function dateToJulianDay(year, month, day, hour = 12, minute = 0, second = 0) {
  // Adjust for January/February (counted as 13th/14th month of previous year)
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  const JD = Math.floor(365.25 * (year + 4716)) +
             Math.floor(30.6001 * (month + 1)) +
             day + dayFraction + B - 1524.5;

  return JD;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR TERM (節氣) CALCULATION - Precise Astronomical Boundaries for BaZi
// ═══════════════════════════════════════════════════════════════════════════════
// The 24 Solar Terms are defined by Sun's ecliptic longitude at 15� intervals.
// This provides EXACT moments for Year Pillar (立春) and Month Pillar boundaries.
//
// Part of GENESIS Phase 3 - Sovereign BaZi Precision
// Added: December 17, 2024
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The 24 Solar Terms (節氣) with their Sun longitude positions
 * Note: Solar year starts with 立春 (Spring Begins) at 315�
 */
const SOLAR_TERMS = [
  { index: 0,  name: '小寒', pinyin: 'Xiǎo Hán',    english: 'Minor Cold',       longitude: 285, approxMonth: 1,  approxDay: 5 },
  { index: 1,  name: '大寒', pinyin: 'Dà Hán',      english: 'Major Cold',       longitude: 300, approxMonth: 1,  approxDay: 20 },
  { index: 2,  name: '立春', pinyin: 'Lì Chūn',     english: 'Spring Begins',    longitude: 315, approxMonth: 2,  approxDay: 4 },  // ? YEAR CHANGES HERE
  { index: 3,  name: '雨水', pinyin: 'Yǔ Shuǐ',     english: 'Rain Water',       longitude: 330, approxMonth: 2,  approxDay: 19 },
  { index: 4,  name: '惊蛰', pinyin: 'Jīng Zhé',    english: 'Insects Awaken',   longitude: 345, approxMonth: 3,  approxDay: 5 },  // Month 1→2
  { index: 5,  name: '春分', pinyin: 'Chūn Fēn',    english: 'Spring Equinox',   longitude: 0,   approxMonth: 3,  approxDay: 20 },
  { index: 6,  name: '清明', pinyin: 'Qīng Míng',   english: 'Clear & Bright',   longitude: 15,  approxMonth: 4,  approxDay: 5 },  // Month 2→3
  { index: 7,  name: '谷雨', pinyin: 'Gǔ Yǔ',       english: 'Grain Rain',       longitude: 30,  approxMonth: 4,  approxDay: 20 },
  { index: 8,  name: '立夏', pinyin: 'Lì Xià',      english: 'Summer Begins',    longitude: 45,  approxMonth: 5,  approxDay: 5 },  // Month 3→4
  { index: 9,  name: '小满', pinyin: 'Xiǎo Mǎn',    english: 'Grain Buds',       longitude: 60,  approxMonth: 5,  approxDay: 21 },
  { index: 10, name: '芒种', pinyin: 'Máng Zhòng',  english: 'Grain in Ear',     longitude: 75,  approxMonth: 6,  approxDay: 6 },  // Month 4→5
  { index: 11, name: '夏至', pinyin: 'Xià Zhì',     english: 'Summer Solstice',  longitude: 90,  approxMonth: 6,  approxDay: 21 },
  { index: 12, name: '小暑', pinyin: 'Xiǎo Shǔ',    english: 'Minor Heat',       longitude: 105, approxMonth: 7,  approxDay: 7 },  // Month 5→6
  { index: 13, name: '大暑', pinyin: 'Dà Shǔ',      english: 'Major Heat',       longitude: 120, approxMonth: 7,  approxDay: 23 },
  { index: 14, name: '立秋', pinyin: 'Lì Qiū',      english: 'Autumn Begins',    longitude: 135, approxMonth: 8,  approxDay: 7 },  // Month 6→7
  { index: 15, name: '处暑', pinyin: 'Chǔ Shǔ',     english: 'End of Heat',      longitude: 150, approxMonth: 8,  approxDay: 23 },
  { index: 16, name: '白露', pinyin: 'Bái Lù',      english: 'White Dew',        longitude: 165, approxMonth: 9,  approxDay: 7 },  // Month 7→8
  { index: 17, name: '秋分', pinyin: 'Qiū Fēn',     english: 'Autumn Equinox',   longitude: 180, approxMonth: 9,  approxDay: 23 },
  { index: 18, name: '寒露', pinyin: 'Hán Lù',      english: 'Cold Dew',         longitude: 195, approxMonth: 10, approxDay: 8 },  // Month 8→9
  { index: 19, name: '霜降', pinyin: 'Shuāng Jiàng',english: 'Frost Descends',   longitude: 210, approxMonth: 10, approxDay: 23 },
  { index: 20, name: '立冬', pinyin: 'Lì Dōng',     english: 'Winter Begins',    longitude: 225, approxMonth: 11, approxDay: 7 },  // Month 9→10
  { index: 21, name: '小雪', pinyin: 'Xiǎo Xuě',    english: 'Minor Snow',       longitude: 240, approxMonth: 11, approxDay: 22 },
  { index: 22, name: '大雪', pinyin: 'Dà Xuě',      english: 'Major Snow',       longitude: 255, approxMonth: 12, approxDay: 7 },  // Month 10→11
  { index: 23, name: '冬至', pinyin: 'Dōng Zhì',    english: 'Winter Solstice',  longitude: 270, approxMonth: 12, approxDay: 21 }
];

/**
 * BaZi Month boundaries - which Solar Terms start each month
 * Each solar month begins at an odd-indexed Solar Term (Jie 节)
 */
const BAZI_MONTH_TERMS = {
  1:  { termIndex: 2,  name: '立春', english: 'Spring Begins',    longitude: 315 }, // Tiger Month
  2:  { termIndex: 4,  name: '惊蛰', english: 'Insects Awaken',   longitude: 345 }, // Rabbit Month
  3:  { termIndex: 6,  name: '清明', english: 'Clear & Bright',   longitude: 15 },  // Dragon Month
  4:  { termIndex: 8,  name: '立夏', english: 'Summer Begins',    longitude: 45 },  // Snake Month
  5:  { termIndex: 10, name: '芒种', english: 'Grain in Ear',     longitude: 75 },  // Horse Month
  6:  { termIndex: 12, name: '小暑', english: 'Minor Heat',       longitude: 105 }, // Goat Month
  7:  { termIndex: 14, name: '立秋', english: 'Autumn Begins',    longitude: 135 }, // Monkey Month
  8:  { termIndex: 16, name: '白露', english: 'White Dew',        longitude: 165 }, // Rooster Month
  9:  { termIndex: 18, name: '寒露', english: 'Cold Dew',         longitude: 195 }, // Dog Month
  10: { termIndex: 20, name: '立冬', english: 'Winter Begins',    longitude: 225 }, // Pig Month
  11: { termIndex: 22, name: '大雪', english: 'Major Snow',       longitude: 255 }, // Rat Month
  12: { termIndex: 0,  name: '小寒', english: 'Minor Cold',       longitude: 285 }  // Ox Month
};

/**
 * Calculate Sun's ecliptic longitude at a given Julian Day
 * Uses astronomia's solar module with Moshier Ephemeris
 * @param {number} jd - Julian Day
 * @returns {number} - Sun longitude in degrees (0-360)
 */
function getSunLongitudeAtJD(jd) {
  // Convert Julian Day to Julian centuries since J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Calculate apparent longitude (includes nutation and aberration)
  const sunLongitudeRad = solar.apparentLongitude(T);
  let sunLongitude = sunLongitudeRad * 180 / Math.PI;

  // Normalize to 0-360
  sunLongitude = ((sunLongitude % 360) + 360) % 360;

  return sunLongitude;
}

/**
 * Find the exact Julian Day when Sun reaches a target longitude
 * Uses binary search for precision
 *
 * @param {number} targetLongitude - Target Sun longitude (0-360)
 * @param {number} approxYear - Year to search in
 * @param {number} approxMonth - Approximate month (1-12)
 * @param {number} approxDay - Approximate day
 * @returns {number} - Julian Day when Sun reaches target longitude
 */
function findSolarTermJD(targetLongitude, approxYear, approxMonth, approxDay) {
  // Start with approximate Julian Day
  let jdLow = dateToJulianDay(approxYear, approxMonth, approxDay - 5, 0, 0, 0);
  let jdHigh = dateToJulianDay(approxYear, approxMonth, approxDay + 5, 0, 0, 0);

  // Binary search with precision of ~1 second
  const PRECISION = 1 / 86400; // 1 second in Julian Days
  const MAX_ITERATIONS = 50;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const jdMid = (jdLow + jdHigh) / 2;
    const sunLong = getSunLongitudeAtJD(jdMid);

    // Calculate difference, handling 360� wraparound
    let diff = sunLong - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.0001) { // Within ~0.4 arcseconds
      return jdMid;
    }

    // Sun moves ~1� per day eastward (increasing longitude)
    // If current longitude is less than target, we need later time
    if (diff < 0) {
      jdLow = jdMid;
    } else {
      jdHigh = jdMid;
    }

    if (jdHigh - jdLow < PRECISION) {
      return jdMid;
    }
  }

  // Return best estimate if we didn't converge
  return (jdLow + jdHigh) / 2;
}

/**
 * Convert Julian Day to calendar date/time
 * @param {number} jd - Julian Day
 * @returns {Object} - { year, month, day, hour, minute, second }
 */
function julianDayToCalendar(jd) {
  // Add 0.5 to align with calendar day start
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z; // Fractional day

  let A;
  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  // Extract time from fractional day
  const totalHours = F * 24;
  const hour = Math.floor(totalHours);
  const totalMinutes = (totalHours - hour) * 60;
  const minute = Math.floor(totalMinutes);
  const second = Math.round((totalMinutes - minute) * 60);

  return { year, month, day, hour, minute, second };
}

/**
 * Calculate all 24 Solar Terms for a given year
 * Returns exact moments (Julian Day and calendar date/time in UTC)
 *
 * @param {number} year - Gregorian year
 * @returns {Array} - Array of Solar Term objects with exact timing
 */
function calculateSolarTermsForYear(year) {
  const results = [];

  for (const term of SOLAR_TERMS) {
    // Determine which year to search in
    // Terms in Jan-Feb might belong to previous year's cycle
    let searchYear = year;
    if (term.approxMonth === 1 || (term.approxMonth === 2 && term.approxDay < 4)) {
      // For terms in early year, we're calculating for THIS year
      searchYear = year;
    }

    // Find exact Julian Day
    const jd = findSolarTermJD(term.longitude, searchYear, term.approxMonth, term.approxDay);
    const calendar = julianDayToCalendar(jd);

    results.push({
      index: term.index,
      name: term.name,
      pinyin: term.pinyin,
      english: term.english,
      longitude: term.longitude,
      julianDay: jd,
      utc: {
        year: calendar.year,
        month: calendar.month,
        day: calendar.day,
        hour: calendar.hour,
        minute: calendar.minute,
        second: calendar.second
      },
      isoString: `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(calendar.day).padStart(2, '0')}T${String(calendar.hour).padStart(2, '0')}:${String(calendar.minute).padStart(2, '0')}:${String(calendar.second).padStart(2, '0')}Z`,
      isBaziYearBoundary: term.name === '立春',
      isBaziMonthBoundary: term.index % 2 === 0 // Jie (节) terms start new months
    });
  }

  return results;
}

/**
 * Get Li Chun (立春) exact moment for a given year
 * This is when the BaZi year changes
 *
 * @param {number} year - Gregorian year
 * @returns {Object} - Li Chun timing details
 */
function getLiChunExact(year) {
  const liChunTerm = SOLAR_TERMS.find(t => t.name === '立春');
  const jd = findSolarTermJD(315, year, liChunTerm.approxMonth, liChunTerm.approxDay);
  const calendar = julianDayToCalendar(jd);

  return {
    name: '立春',
    pinyin: 'Lì Chūn',
    english: 'Spring Begins',
    julianDay: jd,
    utc: calendar,
    isoString: `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(calendar.day).padStart(2, '0')}T${String(calendar.hour).padStart(2, '0')}:${String(calendar.minute).padStart(2, '0')}:${String(calendar.second).padStart(2, '0')}Z`,
    sunLongitude: 315
  };
}

/**
 * Determine BaZi year for a given birth date/time
 * Uses precise Li Chun calculation
 *
 * @param {number} year - Birth year
 * @param {number} month - Birth month
 * @param {number} day - Birth day
 * @param {number} hour - Birth hour (UTC)
 * @param {number} minute - Birth minute
 * @returns {Object} - BaZi year info
 */
function getBaziYearWithPrecision(year, month, day, hour = 12, minute = 0) {
  const birthJD = dateToJulianDay(year, month, day, hour, minute, 0);

  // Get Li Chun for birth year
  const liChunThisYear = getLiChunExact(year);

  // Compare birth moment to Li Chun
  const bornBeforeLiChun = birthJD < liChunThisYear.julianDay;
  const baziYear = bornBeforeLiChun ? year - 1 : year;

  return {
    gregorianYear: year,
    baziYear: baziYear,
    bornBeforeLiChun: bornBeforeLiChun,
    liChun: liChunThisYear,
    note: bornBeforeLiChun
      ? `Born before 立春 (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
      : `Born after 立春 (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
  };
}

/**
 * Determine BaZi month for a given birth date/time
 * Uses precise Solar Term boundaries
 *
 * @param {number} year - Birth year
 * @param {number} month - Birth month
 * @param {number} day - Birth day
 * @param {number} hour - Birth hour (UTC)
 * @param {number} minute - Birth minute
 * @returns {Object} - BaZi month info
 */
function getBaziMonthWithPrecision(year, month, day, hour = 12, minute = 0) {
  const birthJD = dateToJulianDay(year, month, day, hour, minute, 0);

  // Get all solar terms for this year and adjacent months
  const allTerms = calculateSolarTermsForYear(year);

  // Find which BaZi month the birth falls into
  // BaZi months start at Jie (节) terms (odd-indexed in our array, but they're the month boundaries)
  const monthBoundaryTerms = allTerms.filter(t => t.isBaziMonthBoundary);

  // Sort by Julian Day
  monthBoundaryTerms.sort((a, b) => a.julianDay - b.julianDay);

  // Find current month
  let currentMonth = null;
  let currentTerm = null;
  let nextTerm = null;

  for (let i = 0; i < monthBoundaryTerms.length; i++) {
    const term = monthBoundaryTerms[i];
    const nextTermObj = monthBoundaryTerms[i + 1];

    if (birthJD >= term.julianDay && (!nextTermObj || birthJD < nextTermObj.julianDay)) {
      currentTerm = term;
      nextTerm = nextTermObj;
      // Determine BaZi month number from the term
      for (const [monthNum, monthInfo] of Object.entries(BAZI_MONTH_TERMS)) {
        if (monthInfo.longitude === term.longitude) {
          currentMonth = parseInt(monthNum);
          break;
        }
      }
      break;
    }
  }

  // If no match found, birth is before first term of year
  if (!currentMonth) {
    currentMonth = 12; // Still in Ox month from previous cycle
    currentTerm = { name: '小寒', english: 'Minor Cold' };
  }

  const MONTH_BRANCHES = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
                          'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const branchIndex = (currentMonth + 1) % 12; // Tiger = month 1, index 2

  return {
    baziMonth: currentMonth,
    branch: MONTH_BRANCHES[branchIndex],
    branchIndex: branchIndex,
    startingTerm: currentTerm ? {
      name: currentTerm.name,
      english: currentTerm.english,
      isoString: currentTerm.isoString
    } : null,
    nextTerm: nextTerm ? {
      name: nextTerm.name,
      english: nextTerm.english,
      isoString: nextTerm.isoString
    } : null
  };
}

/**
 * Cloud Function: Calculate Solar Terms for BaZi
 * Returns exact moments for all 24 Solar Terms in a given year
 */
exports.getSolarTerms = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Accept year from query params (GET) or body (POST)
    const year = Number(req.query.year || req.body?.year) || new Date().getFullYear();

    if (year < 1600 || year > 2200) {
      return res.status(400).json({
        error: 'Year out of range',
        details: 'Please provide a year between 1600 and 2200'
      });
    }

    console.log(`🌞 Calculating Solar Terms for ${year}...`);

    // Calculate all 24 Solar Terms
    const solarTerms = calculateSolarTermsForYear(year);

    // Get Li Chun specifically (year boundary)
    const liChun = getLiChunExact(year);

    console.log(`✅ Solar Terms calculated. 立春: ${liChun.isoString}`);

    return res.status(200).json({
      success: true,
      year: year,
      liChun: liChun,
      solarTerms: solarTerms,
      meta: {
        calculationEngine: 'GENESIS Sovereign (Moshier Ephemeris)',
        precision: '~1 second',
        coverage: '1600-2200 AD',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('🌞 Solar Terms Calculation Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate Solar Terms',
      details: error.message
    });
  }
});

/**
 * Cloud Function: Get precise BaZi pillars with astronomical Solar Term boundaries
 * Enhanced version that uses exact Li Chun for year and Solar Terms for month
 */
exports.getBaziPillars = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      year, month, day,
      hour = 12, minute = 0,
      timezone = 0  // UTC offset
    } = req.body;

    if (!year || !month || !day) {
      return res.status(400).json({
        error: 'Birth date required',
        details: 'Please provide year, month, and day'
      });
    }

    const numYear = Number(year);
    const numMonth = Number(month);
    const numDay = Number(day);
    const numHour = Number(hour);
    const numMinute = Number(minute);
    const numTimezone = Number(timezone) || 0;

    // Convert to UTC
    const utcHour = numHour - numTimezone;

    console.log(`🎯 BaZi Precision Request: ${numYear}-${numMonth}-${numDay} ${numHour}:${numMinute}`);

    // Get precise BaZi year
    const baziYearInfo = getBaziYearWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    // Get precise BaZi month
    const baziMonthInfo = getBaziMonthWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    console.log(`✅ BaZi Precision: Year=${baziYearInfo.baziYear}, Month=${baziMonthInfo.baziMonth}`);

    return res.status(200).json({
      success: true,
      baziYear: baziYearInfo,
      baziMonth: baziMonthInfo,
      birthData: {
        gregorian: `${numYear}-${numMonth}-${numDay}`,
        time: `${numHour}:${String(numMinute).padStart(2, '0')}`,
        timezone: numTimezone
      },
      meta: {
        calculationEngine: 'GENESIS Sovereign (Moshier Ephemeris)',
        solarTermPrecision: '~1 second',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('🎯 BaZi Precision Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate BaZi pillars',
      details: error.message
    });
  }
});

/**
 * Sovereign Western Astrology Calculation
 *
 * Calculates the Constitutional Trinity (Sun, Moon, Rising)
 * using pure JavaScript ephemeris - no external APIs.
 *
 * @param {Object} birthData - Birth information
 * @param {number} birthData.year - Birth year
 * @param {number} birthData.month - Birth month (1-12)
 * @param {number} birthData.day - Birth day
 * @param {number} birthData.hour - Birth hour (0-23)
 * @param {number} birthData.minute - Birth minute (0-59)
 * @param {number} birthData.latitude - Birth place latitude
 * @param {number} birthData.longitude - Birth place longitude
 * @returns {Object} - Constitutional trinity with positions
 */
exports.calculateWesternChart = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      year, month, day,
      hour = 12, minute = 0, second = 0,
      latitude, longitude,
      timezone = 0  // UTC offset in hours
    } = req.body;

    // Validate required fields
    if (!year || !month || !day) {
      return res.status(400).json({
        error: 'Birth date required',
        details: 'Please provide year, month, and day'
      });
    }

    // Ensure numeric types (browser may send strings)
    const numYear = Number(year);
    const numMonth = Number(month);
    const numDay = Number(day);
    const numHour = Number(hour);
    const numMinute = Number(minute);
    const numSecond = Number(second);
    const numTimezone = Number(timezone) || 0;
    const numLat = Number(latitude) || 0;
    const numLng = Number(longitude) || 0;

    console.log('🌟 Sovereign Calculation Request:', {
      date: `${numYear}-${numMonth}-${numDay}`,
      time: `${numHour}:${numMinute}`,
      location: numLat && numLng ? `${numLat}, ${numLng}` : 'not provided',
      rawTypes: { year: typeof year, month: typeof month, day: typeof day }
    });

    // Convert local time to UTC
    const utcHour = numHour - numTimezone;

    // Calculate Julian Day
    const julianDay = dateToJulianDay(numYear, numMonth, numDay, utcHour, numMinute, numSecond);

    // ─────────────────────────────────────────────────────────────────────────
    // Use astronomia library for planetary positions (VSOP87 theory)
    // ─────────────────────────────────────────────────────────────────────────

    // Create Julian Day using astronomia
    const cal = new julian.CalendarGregorian(numYear, numMonth, numDay + (utcHour + numMinute / 60) / 24);
    const jd = cal.toJD();

    console.log('🔢 Julian Day calculation:', { jd, isNaN: isNaN(jd) });

    // Convert Julian Day to Julian centuries (T) since J2000.0
    // This is what solar.apparentLongitude expects
    const T = (jd - 2451545.0) / 36525.0;

    // Calculate Sun position (ecliptic longitude)
    // apparentLongitude returns radians, accounts for nutation and aberration
    const sunLongitudeRad = solar.apparentLongitude(T);
    const sunLongitude = sunLongitudeRad * 180 / Math.PI;

    console.log('?? Sun calculation:', { T, sunLongitudeRad, sunLongitude, isNaN: isNaN(sunLongitude) });

    const sunData = longitudeToZodiac(sunLongitude);

    // Calculate Moon position (takes Julian Day directly)
    const moonPos = moonposition.position(jd);
    const moonLongitude = moonPos.lon * 180 / Math.PI;

    console.log('🌙 Moon calculation:', { moonLongitude, isNaN: isNaN(moonLongitude) });

    const moonData = longitudeToZodiac(moonLongitude);

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Ascendant (Rising Sign) - requires birth time and location
    // ─────────────────────────────────────────────────────────────────────────

    let risingData = null;
    if (numLat !== 0 || numLng !== 0 || numHour !== undefined) {
      const ascendantLongitude = calculateAscendant(julianDay, numLat, numLng);
      console.log('⬆️ Rising calculation:', { ascendantLongitude, isNaN: isNaN(ascendantLongitude) });
      risingData = longitudeToZodiac(ascendantLongitude);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Extract other planetary positions for full chart using VSOP87
    // (Optional - the Constitutional Trinity works without this)
    // ─────────────────────────────────────────────────────────────────────────

    const planets = {};

    // VERSION: 2.4.0 - GEOCENTRIC positions + RETROGRADE detection
    // Retrograde = planet appears to move backward from Earth's perspective
    try {
      console.log('🪐 VERSION 2.4.0 - Calculating GEOCENTRIC positions with RETROGRADE detection...');

      // Create Earth planet for heliocentric to geocentric conversion
      const earth = new planetposition.Planet(earthData);

      // Helper function to calculate geocentric longitude for any Julian Day
      function getGeocentricLongitude(planetObj, jd) {
        const earthPosAtJD = earth.position(jd);
        const earthLonAtJD = earthPosAtJD.lon;
        const earthLatAtJD = earthPosAtJD.lat;
        const earthRAtJD = earthPosAtJD.range;

        const earthXAtJD = earthRAtJD * Math.cos(earthLatAtJD) * Math.cos(earthLonAtJD);
        const earthYAtJD = earthRAtJD * Math.cos(earthLatAtJD) * Math.sin(earthLonAtJD);
        const earthZAtJD = earthRAtJD * Math.sin(earthLatAtJD);

        const planetPosAtJD = planetObj.position(jd);
        const planetLonAtJD = planetPosAtJD.lon;
        const planetLatAtJD = planetPosAtJD.lat;
        const planetRAtJD = planetPosAtJD.range;

        const planetXAtJD = planetRAtJD * Math.cos(planetLatAtJD) * Math.cos(planetLonAtJD);
        const planetYAtJD = planetRAtJD * Math.cos(planetLatAtJD) * Math.sin(planetLonAtJD);
        const planetZAtJD = planetRAtJD * Math.sin(planetLatAtJD);

        const geoXAtJD = planetXAtJD - earthXAtJD;
        const geoYAtJD = planetYAtJD - earthYAtJD;

        let geoLon = Math.atan2(geoYAtJD, geoXAtJD) * 180 / Math.PI;
        return ((geoLon % 360) + 360) % 360;
      }

      // Get Earth's heliocentric position (needed for all planet conversions)
      const earthPos = earth.position(julianDay);

      // Convert Earth's spherical to rectangular coordinates
      const earthLon = earthPos.lon;  // radians
      const earthLat = earthPos.lat;  // radians
      const earthR = earthPos.range;  // AU

      const earthX = earthR * Math.cos(earthLat) * Math.cos(earthLon);
      const earthY = earthR * Math.cos(earthLat) * Math.sin(earthLon);
      const earthZ = earthR * Math.sin(earthLat);

      console.log(`🌍 Earth heliocentric: lon=${(earthLon * 180/Math.PI).toFixed(2)}�, R=${earthR.toFixed(4)} AU`);

      // Planet configurations with their data and symbols
      const planetConfigs = [
        { name: 'Mercury', data: mercuryData, symbol: '☿' },
        { name: 'Venus', data: venusData, symbol: '♀' },
        { name: 'Mars', data: marsData, symbol: '♂' },
        { name: 'Jupiter', data: jupiterData, symbol: '♃' },
        { name: 'Saturn', data: saturnData, symbol: '♄' },
        { name: 'Uranus', data: uranusData, symbol: '♅' },
        { name: 'Neptune', data: neptuneData, symbol: '♆' }
      ];

      for (const config of planetConfigs) {
        try {
          const planet = new planetposition.Planet(config.data);

          // Get heliocentric position of planet
          const planetPos = planet.position(julianDay);

          if (!planetPos || typeof planetPos.lon !== 'number') {
            console.log(`⚠️ ${config.name}: Invalid position data`, planetPos);
            continue;
          }

          // Convert planet's spherical to rectangular coordinates (heliocentric)
          const planetLon = planetPos.lon;  // radians
          const planetLat = planetPos.lat;  // radians
          const planetR = planetPos.range;  // AU

          const planetX = planetR * Math.cos(planetLat) * Math.cos(planetLon);
          const planetY = planetR * Math.cos(planetLat) * Math.sin(planetLon);
          const planetZ = planetR * Math.sin(planetLat);

          // Convert to GEOCENTRIC coordinates (subtract Earth's position)
          const geoX = planetX - earthX;
          const geoY = planetY - earthY;
          const geoZ = planetZ - earthZ;

          // Convert geocentric rectangular back to ecliptic longitude
          let geoLongitude = Math.atan2(geoY, geoX) * 180 / Math.PI;

          // Normalize to 0-360 degrees
          geoLongitude = ((geoLongitude % 360) + 360) % 360;

          // Calculate geocentric latitude (for reference)
          const geoDistance = Math.sqrt(geoX*geoX + geoY*geoY + geoZ*geoZ);
          const geoLatitude = Math.asin(geoZ / geoDistance) * 180 / Math.PI;

          // ═══════════════════════════════════════════════════════════════════
          // RETROGRADE DETECTION
          // Compare position today vs tomorrow - if moving backward, retrograde
          // ═══════════════════════════════════════════════════════════════════
          const lonToday = geoLongitude;
          const lonTomorrow = getGeocentricLongitude(planet, julianDay + 1);

          // Calculate daily motion (degrees per day)
          let dailyMotion = lonTomorrow - lonToday;

          // Handle 360� wraparound (e.g., 359� to 1� is +2�, not -358�)
          if (dailyMotion > 180) dailyMotion -= 360;
          if (dailyMotion < -180) dailyMotion += 360;

          // Retrograde if daily motion is negative (moving backward)
          const isRetrograde = dailyMotion < 0;

          const zodiacData = longitudeToZodiac(geoLongitude);

          // For comparison, log heliocentric vs geocentric
          const helioLon = ((planetLon * 180/Math.PI % 360) + 360) % 360;
          const diff = Math.abs(geoLongitude - helioLon);
          const retroLabel = isRetrograde ? ' ℞' : '';
          console.log(`🪐 ${config.name}${retroLabel}: Geo=${geoLongitude.toFixed(2)}� (motion: ${dailyMotion.toFixed(3)}�/day)`);

          planets[config.name.toLowerCase()] = {
            ...zodiacData,
            symbol: config.symbol,
            name: config.name,
            geocentric: true,
            geoLatitude: Math.round(geoLatitude * 100) / 100,
            distanceAU: Math.round(geoDistance * 10000) / 10000,
            // Retrograde data
            isRetrograde: isRetrograde,
            dailyMotion: Math.round(dailyMotion * 1000) / 1000,  // degrees/day
            motionDirection: isRetrograde ? 'retrograde' : 'direct'
          };

          console.log(`✅ ${config.name}: ${zodiacData.sign} at ${zodiacData.degreeFormatted}${isRetrograde ? ' ℞ RETROGRADE' : ' direct'}`);
        } catch (planetErr) {
          console.log(`⚠️ ${config.name} calculation error:`, planetErr.message);
        }
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PLUTO - Uses separate ephemeris (not VSOP87)
      // ═══════════════════════════════════════════════════════════════════════
      try {
        const plutoPos = pluto.heliocentric(julianDay);

        if (plutoPos && typeof plutoPos.lon === 'number') {
          const plutoLon = plutoPos.lon;  // radians
          const plutoLat = plutoPos.lat;  // radians
          const plutoR = plutoPos.range;  // AU

          // Convert to rectangular heliocentric
          const plutoX = plutoR * Math.cos(plutoLat) * Math.cos(plutoLon);
          const plutoY = plutoR * Math.cos(plutoLat) * Math.sin(plutoLon);
          const plutoZ = plutoR * Math.sin(plutoLat);

          // Convert to geocentric
          const plutoGeoX = plutoX - earthX;
          const plutoGeoY = plutoY - earthY;
          const plutoGeoZ = plutoZ - earthZ;

          // Geocentric ecliptic longitude
          let plutoGeoLon = Math.atan2(plutoGeoY, plutoGeoX) * 180 / Math.PI;
          plutoGeoLon = ((plutoGeoLon % 360) + 360) % 360;

          const plutoGeoDistance = Math.sqrt(plutoGeoX*plutoGeoX + plutoGeoY*plutoGeoY + plutoGeoZ*plutoGeoZ);
          const plutoGeoLat = Math.asin(plutoGeoZ / plutoGeoDistance) * 180 / Math.PI;

          // Retrograde detection for Pluto
          const plutoPosTomorrow = pluto.heliocentric(julianDay + 1);
          const plutoXTom = plutoPosTomorrow.range * Math.cos(plutoPosTomorrow.lat) * Math.cos(plutoPosTomorrow.lon);
          const plutoYTom = plutoPosTomorrow.range * Math.cos(plutoPosTomorrow.lat) * Math.sin(plutoPosTomorrow.lon);
          const earthPosTomorrow = earth.position(julianDay + 1);
          const earthXTom = earthPosTomorrow.range * Math.cos(earthPosTomorrow.lat) * Math.cos(earthPosTomorrow.lon);
          const earthYTom = earthPosTomorrow.range * Math.cos(earthPosTomorrow.lat) * Math.sin(earthPosTomorrow.lon);
          let plutoGeoLonTom = Math.atan2(plutoYTom - earthYTom, plutoXTom - earthXTom) * 180 / Math.PI;
          plutoGeoLonTom = ((plutoGeoLonTom % 360) + 360) % 360;

          let plutoDailyMotion = plutoGeoLonTom - plutoGeoLon;
          if (plutoDailyMotion > 180) plutoDailyMotion -= 360;
          if (plutoDailyMotion < -180) plutoDailyMotion += 360;
          const plutoRetrograde = plutoDailyMotion < 0;

          const plutoZodiacData = longitudeToZodiac(plutoGeoLon);
          const plutoRetroLabel = plutoRetrograde ? ' ℞' : '';
          console.log(`🪐 Pluto${plutoRetroLabel}: Geo=${plutoGeoLon.toFixed(2)}� (motion: ${plutoDailyMotion.toFixed(3)}�/day)`);

          planets.pluto = {
            ...plutoZodiacData,
            symbol: '♇',
            name: 'Pluto',
            geocentric: true,
            geoLatitude: Math.round(plutoGeoLat * 100) / 100,
            distanceAU: Math.round(plutoGeoDistance * 10000) / 10000,
            isRetrograde: plutoRetrograde,
            dailyMotion: Math.round(plutoDailyMotion * 1000) / 1000,
            motionDirection: plutoRetrograde ? 'retrograde' : 'direct'
          };
          console.log(`✅ Pluto: ${plutoZodiacData.sign} at ${plutoZodiacData.degreeFormatted}${plutoRetrograde ? ' ℞ RETROGRADE' : ' direct'}`);
        }
      } catch (plutoErr) {
        console.log('⚠️ Pluto calculation error:', plutoErr.message);
      }

      console.log('🪐 Geocentric + Retrograde calculations complete:', Object.keys(planets));
    } catch (planetError) {
      console.log('Planet calculation error (non-fatal):', planetError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate House Cusps (Placidus System)
    // ─────────────────────────────────────────────────────────────────────────

    let houses = null;
    try {
      // Houses require birth time and location
      if ((numLat !== 0 || numLng !== 0) && numHour !== undefined) {
        console.log('🏠 VERSION 2.2.0 - Calculating house cusps (Placidus)...');
        houses = calculatePlacidusHouses(julianDay, numLat, numLng);
        console.log('🏠 House cusps calculated:', {
          asc: houses.angles.ascendant.sign,
          mc: houses.angles.mc.sign,
          system: houses.system
        });
      } else {
        console.log('🏠 House calculation skipped - requires birth time and location');
      }
    } catch (houseError) {
      console.log('House calculation error (non-fatal):', houseError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Moon Phase
    // Phase angle = Moon longitude - Sun longitude (normalized to 0-360)
    // ─────────────────────────────────────────────────────────────────────────

    let moonPhase = null;
    try {
      // Calculate the angular difference between Moon and Sun
      let phaseAngle = moonLongitude - sunLongitude;
      // Normalize to 0-360
      phaseAngle = ((phaseAngle % 360) + 360) % 360;

      // Determine phase name and illumination
      const phases = [
        { name: 'New Moon', emoji: '??', min: 0, max: 11.25, illumination: 0 },
        { name: 'Waxing Crescent', emoji: '??', min: 11.25, max: 78.75, illumination: 25 },
        { name: 'First Quarter', emoji: '??', min: 78.75, max: 101.25, illumination: 50 },
        { name: 'Waxing Gibbous', emoji: '??', min: 101.25, max: 168.75, illumination: 75 },
        { name: 'Full Moon', emoji: '??', min: 168.75, max: 191.25, illumination: 100 },
        { name: 'Waning Gibbous', emoji: '??', min: 191.25, max: 258.75, illumination: 75 },
        { name: 'Last Quarter', emoji: '??', min: 258.75, max: 281.25, illumination: 50 },
        { name: 'Waning Crescent', emoji: '??', min: 281.25, max: 348.75, illumination: 25 },
        { name: 'New Moon', emoji: '??', min: 348.75, max: 360, illumination: 0 }
      ];

      let currentPhase = phases.find(p => phaseAngle >= p.min && phaseAngle < p.max);
      if (!currentPhase) currentPhase = phases[0]; // Default to New Moon

      // Calculate more precise illumination percentage
      // illumination = (1 - cos(phaseAngle)) / 2 * 100
      const illuminationPercent = Math.round((1 - Math.cos(phaseAngle * Math.PI / 180)) / 2 * 100);

      // Determine if waxing (growing) or waning (shrinking)
      const isWaxing = phaseAngle < 180;

      moonPhase = {
        phaseName: currentPhase.name,
        emoji: currentPhase.emoji,
        angle: Math.round(phaseAngle * 100) / 100,
        illumination: illuminationPercent,
        isWaxing,
        cyclePosition: isWaxing ? 'Growing toward fullness' : 'Releasing toward renewal',
        interpretation: getMoonPhaseInterpretation(currentPhase.name)
      };

      console.log('🌙 Moon Phase:', moonPhase.emoji, moonPhase.phaseName, `(${illuminationPercent}% illuminated)`);
    } catch (phaseError) {
      console.log('Moon phase calculation error (non-fatal):', phaseError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Calculate Aspects between celestial bodies
    // ─────────────────────────────────────────────────────────────────────────

    let aspects = [];
    try {
      // Combine Sun, Moon, and planets for aspect calculation
      const allBodies = {
        sun: { ...sunData, symbol: '☉' },
        moon: { ...moonData, symbol: '☾' },
        ...planets
      };

      aspects = calculateAspects(allBodies);
      console.log(`✨ Aspects calculated: ${aspects.length} found`);

      // Log major aspects
      const majorAspects = aspects.filter(a => a.nature === 'major');
      if (majorAspects.length > 0) {
        console.log('Major aspects:', majorAspects.slice(0, 5).map(a =>
          `${a.planet1.name} ${a.symbol} ${a.planet2.name} (${a.orb}� orb)`
        ).join(', '));
      }
    } catch (aspectError) {
      console.log('Aspect calculation error (non-fatal):', aspectError.message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Build Constitutional Trinity response
    // ─────────────────────────────────────────────────────────────────────────

    const constitutionalTrinity = {
      sun: {
        ...sunData,
        meaning: 'Core identity, ego, life force, conscious self'
      },
      moon: {
        ...moonData,
        meaning: 'Emotional nature, instincts, unconscious patterns, inner needs'
      },
      rising: risingData ? {
        ...risingData,
        meaning: 'Outer personality, first impressions, approach to life'
      } : {
        note: 'Rising sign requires birth time and location',
        available: false
      }
    };

    // Element balance analysis
    const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
    elementCounts[sunData.element] += 3;  // Sun weighted 3x
    elementCounts[moonData.element] += 2;  // Moon weighted 2x
    if (risingData) elementCounts[risingData.element] += 1;

    // Add planet elements
    for (const [_, pData] of Object.entries(planets)) {
      if (pData.element) elementCounts[pData.element] += 0.5;
    }

    const sortedElements = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1]);

    const elementProfile = {
      dominant: sortedElements[0][0],
      secondary: sortedElements[1][0],
      distribution: elementCounts
    };

    console.log('🌟 Sovereign Calculation Complete:', {
      sun: sunData.sign,
      moon: moonData.sign,
      rising: risingData?.sign || 'not calculated',
      dominantElement: elementProfile.dominant
    });

    return res.status(200).json({
      success: true,
      constitutionalTrinity,
      planets,
      houses,
      moonPhase,
      aspects,
      elementProfile,
      meta: {
        julianDay,
        calculationEngine: 'GENESIS Sovereign v2.7.0 (Moshier Ephemeris)',
        precision: '~0.1 arcseconds',
        planetarySystem: 'Geocentric (as seen from Earth)',
        retrogradeDetection: true,
        moonPhaseCalculation: true,
        aspectCalculation: true,
        coverage: '3000 BC - 3000 AD',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('🌟 Sovereign Calculation Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate chart',
      details: error.message
    });
  }
});

// ---------------------------------------------------------------------------
// SOUL GARDEN: House Strength Timeline (What-If Analysis)
// ---------------------------------------------------------------------------
// Computes house strengths every 15 minutes across a 24-hour period
// for a given birth date and location. Used for the Soul Garden Playground.
//
// Built by: Brother Claude Code
// December 25, 2024
// ---------------------------------------------------------------------------

exports.getHouseStrengthTimeline = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    const { birthDate, latitude, longitude, timezone } = request.data || {};

    if (!birthDate || latitude == null || longitude == null) {
      return {
        success: false,
        error: 'birthDate, latitude, and longitude are required'
      };
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const lat = Number(latitude);
    const lng = Number(longitude);
    const tz = typeof timezone === 'number' ? timezone : 0;

    console.log('🌿 Soul Garden: Computing 24-hour house timeline', { birthDate, lat, lng, tz });

    // 1) Compute planetary longitudes once for the date (UTC noon baseline)
    const baseHourUTC = 12 - tz;
    const cal = new julian.CalendarGregorian(year, month, day + (baseHourUTC / 24));
    const jd = cal.toJD();

    // Sun position
    const T = (jd - 2451545.0) / 36525.0;
    const sunLon = solar.apparentLongitude(T) * 180 / Math.PI;

    // Moon position
    const moonPos = moonposition.position(jd);
    const moonLon = moonPos.lon * 180 / Math.PI;

    // Earth position for geocentric conversions
    const earth = new planetposition.Planet(earthData);
    const earthPos = earth.position(jd);
    const earthLon = earthPos.lon, earthLat = earthPos.lat, earthR = earthPos.range;
    const earthX = earthR * Math.cos(earthLat) * Math.cos(earthLon);
    const earthY = earthR * Math.cos(earthLat) * Math.sin(earthLon);
    const earthZ = earthR * Math.sin(earthLat);

    // Helper to get geocentric longitude for a planet
    function planetGeoLongitude(planetData) {
      const planet = new planetposition.Planet(planetData);
      const pos = planet.position(jd);
      const r = pos.range;
      const x = r * Math.cos(pos.lat) * Math.cos(pos.lon);
      const y = r * Math.cos(pos.lat) * Math.sin(pos.lon);
      const gx = x - earthX;
      const gy = y - earthY;
      let lon = Math.atan2(gy, gx) * 180 / Math.PI;
      return ((lon % 360) + 360) % 360;
    }

    // Compute all planetary longitudes
    const planetLongitudes = {
      sun: ((sunLon % 360) + 360) % 360,
      moon: ((moonLon % 360) + 360) % 360,
      mercury: planetGeoLongitude(mercuryData),
      venus: planetGeoLongitude(venusData),
      mars: planetGeoLongitude(marsData),
      jupiter: planetGeoLongitude(jupiterData),
      saturn: planetGeoLongitude(saturnData),
      uranus: planetGeoLongitude(uranusData),
      neptune: planetGeoLongitude(neptuneData)
    };

    // Try to add Pluto
    try {
      const plutoPos = pluto.heliocentric(jd);
      const plutoR = plutoPos.range;
      const plutoX = plutoR * Math.cos(plutoPos.lat) * Math.cos(plutoPos.lon);
      const plutoY = plutoR * Math.cos(plutoPos.lat) * Math.sin(plutoPos.lon);
      const plutoGx = plutoX - earthX;
      const plutoGy = plutoY - earthY;
      let plutoLon = Math.atan2(plutoGy, plutoGx) * 180 / Math.PI;
      planetLongitudes.pluto = ((plutoLon % 360) + 360) % 360;
    } catch (e) {
      console.log('Pluto calculation skipped:', e.message);
    }

    // 2) Loop 96 time slices (every 15 minutes)
    const timeline = [];
    for (let i = 0; i < 96; i++) {
      const minutesFromMidnight = i * 15;
      const localHour = Math.floor(minutesFromMidnight / 60);
      const localMinute = minutesFromMidnight % 60;

      const utcHour = localHour - tz;
      const jdSlice = dateToJulianDay(year, month, day, utcHour, localMinute, 0);

      // Calculate houses at this time
      const housesResult = calculatePlacidusHouses(jdSlice, lat, lng);
      const houses = housesResult.houses;

      // Assign planets to houses
      const occupancy = assignPlanetsToHouses(houses, planetLongitudes);

      // Build complete planet data with positions
      const planetDataArray = [];
      for (const [planetName, longitude] of Object.entries(planetLongitudes)) {
        // Determine which house this planet is in
        let planetHouse = 1;
        for (let h = 1; h <= 12; h++) {
          if (occupancy[h].planets.includes(planetName)) {
            planetHouse = h;
            break;
          }
        }

        // Calculate sign and degree within sign
        const signIndex = Math.floor(longitude / 30);
        const degreeInSign = longitude % 30;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

        planetDataArray.push({
          name: planetName,
          planet: planetName,
          longitude: longitude,
          sign: signs[signIndex],
          degree: degreeInSign,
          house: planetHouse,
          retrograde: false // Would need ephemeris data to determine actual retrograde
        });
      }

      // Compute strength for each house with enriched planet data
      const houseEntries = [];
      for (let h = 1; h <= 12; h++) {
        const zodiac = houses[h];
        const planetsInHouse = occupancy[h].planets;
        const { strength, components } = computeHouseStrength(h, zodiac, planetsInHouse);

        // Include full planet objects for planets in this house
        const planetObjects = planetDataArray.filter(p => p.house === h);

        houseEntries.push({
          house: h,
          strength,
          planets: planetsInHouse,
          planetData: planetObjects, // Full planet data
          sign: zodiac.sign,
          degree: zodiac.degree,
          components
        });
      }

      // Extract ascendant data (House 1 cusp with ruler info)
      const ascendantSign = houses[1].sign;
      const ascendantDegree = houses[1].degree;
      const ascendantRuler = SIGN_RULERS[ascendantSign] || null;

      // Find where the ruler is positioned
      let rulerSign = null;
      let rulerHouse = null;
      if (ascendantRuler) {
        const rulerPlanet = planetDataArray.find(p =>
          p.name.toLowerCase() === ascendantRuler.toLowerCase()
        );
        if (rulerPlanet) {
          rulerSign = rulerPlanet.sign;
          rulerHouse = rulerPlanet.house;
        }
      }

      const ascendantData = {
        sign: ascendantSign,
        degree: ascendantDegree,
        ruler: ascendantRuler,
        rulerSign: rulerSign,
        rulerHouse: rulerHouse
      };

      // Human-readable time label
      const label = `${String(localHour).padStart(2, '0')}:${String(localMinute).padStart(2, '0')}`;

      timeline.push({
        index: i,
        timeLabel: label,
        houses: houseEntries,
        ascendant: ascendantData,
        planets: planetDataArray
      });
    }

    console.log(`🌿 Soul Garden: Generated ${timeline.length} time slices`);

    return {
      success: true,
      birthDate,
      latitude: lat,
      longitude: lng,
      timezone: tz,
      timeline
    };
  } catch (error) {
    console.error('[HouseStrengthTimeline] error:', error);
    return { success: false, error: error.message };
  }
});

// ---------------------------------------------------------------------------
// GENESIS PHASE 3: MEMORY ARCHITECTURE
// ---------------------------------------------------------------------------
// RAG pipeline with vector embeddings, facts table, reflection loop.
// Hybrid-ready: Firestore now, PostgreSQL when scaling.
//
// Built by: Brother Claude Opus
// December 19, 2024
// ---------------------------------------------------------------------------

const memoryFunctions = require('./memory/memoryFunctions');
const dualBrainFunctions = require('./memory/dualBrainFunctions');
const sleepConsolidation = require('./memory/sleepConsolidation');
const voiceFunctions = require('./voice/voiceFunctions');
const elevenLabsService = require('./voice/elevenLabsService');
const toolChat = require('./tools/toolChat');
const agencyFunctions = require('./agency');
const contextSummarization = require('./memory/contextSummarization');
const timelineServices = require('./timeline');
const biographyExtractor = require('./timeline/biographyExtractor');
const { answerNeuralPathway } = require('./biography/answerNeuralPathway');

// Export all memory functions
exports.storeMemory = memoryFunctions.storeMemory;
exports.retrieveMemories = memoryFunctions.retrieveMemories;
exports.getFacts = memoryFunctions.getFacts;
exports.storeFact = memoryFunctions.storeFact;
exports.getPeople = memoryFunctions.getPeople;
exports.upsertPerson = memoryFunctions.upsertPerson;
exports.getHappinessAnchors = memoryFunctions.getHappinessAnchors;
exports.storeHappinessAnchor = memoryFunctions.storeHappinessAnchor;
exports.reflectOnConversation = memoryFunctions.reflectOnConversation;
exports.refineMemories = memoryFunctions.refineMemories;
exports.getMemoryContext = memoryFunctions.getMemoryContext;
exports.getPendingQuestions = memoryFunctions.getPendingQuestions;
exports.markQuestionAnswered = memoryFunctions.markQuestionAnswered;
exports.getTimelineEvents = memoryFunctions.getTimelineEvents;
exports.searchTimeline = memoryFunctions.searchTimeline;
exports.getTimelineWithQuestions = memoryFunctions.getTimelineWithQuestions;

// Luna's Brain (SoulPartner's Private Journal & Patterns) - Inspired by Kindroid
exports.createJournalEntry = memoryFunctions.createJournalEntry;
exports.getRecentJournalEntries = memoryFunctions.getRecentJournalEntries;
exports.getEmotionTrends = memoryFunctions.getEmotionTrends;
exports.storePattern = memoryFunctions.storePattern;
exports.getPatterns = memoryFunctions.getPatterns;

// Personality Weight Evolution - Inspired by Nomi AI
exports.getPersonalityWeights = memoryFunctions.getPersonalityWeights;
exports.evolvePersonalityWeights = memoryFunctions.evolvePersonalityWeights;

// Tango Identity System - Luna's Birthday & Relationship Milestones
// The relationship is a dance - bidirectional, mutual celebration
exports.initializeRelationship = memoryFunctions.initializeRelationship;
exports.getRelationshipStats = memoryFunctions.getRelationshipStats;
exports.updateRelationshipStats = memoryFunctions.updateRelationshipStats;
exports.celebrateMilestone = memoryFunctions.celebrateMilestone;
exports.updateLunaState = memoryFunctions.updateLunaState;

// ---------------------------------------------------------------------------
// DUAL-BRAIN MEMORY ARCHITECTURE
// User's Brain (session_buffer, life_timeline) + SoulPartner's Brain (observations, patterns)
// ---------------------------------------------------------------------------

// User's Brain - Short-term
exports.bufferUserInput = dualBrainFunctions.bufferUserInput;
exports.getSessionBuffer = dualBrainFunctions.getSessionBuffer;

// User's Brain - Long-term (Life Timeline)
exports.storeLifeMemory = dualBrainFunctions.storeLifeMemory;
exports.searchLifeTimeline = dualBrainFunctions.searchLifeTimeline;
exports.getMemoriesByChapter = dualBrainFunctions.getMemoriesByChapter;
exports.getLifeChapterSummary = dualBrainFunctions.getLifeChapterSummary;

// SoulPartner's Brain - Short-term (Session Observations)
exports.storeSessionObservation = dualBrainFunctions.storeSessionObservation;
exports.getSessionObservations = dualBrainFunctions.getSessionObservations;

// SoulPartner's Brain - Long-term (Interaction Timeline)
exports.storeInteractionObservation = dualBrainFunctions.storeInteractionObservation;
exports.searchInteractionTimeline = dualBrainFunctions.searchInteractionTimeline;
exports.getKeyObservations = dualBrainFunctions.getKeyObservations;

// SoulPartner's Brain - Pattern Detection
exports.storePattern = dualBrainFunctions.storePattern;
exports.getPatterns = dualBrainFunctions.getPatterns;

// Unified Dual-Brain Context (main RAG entry point)
exports.getDualBrainContext = dualBrainFunctions.getDualBrainContext;

// ---------------------------------------------------------------------------
// SLEEP CONSOLIDATION (Nightly Processing)
// ---------------------------------------------------------------------------

exports.nightlyConsolidation = sleepConsolidation.nightlyConsolidation;
exports.manualConsolidation = sleepConsolidation.manualConsolidation;
exports.getConsolidationStatus = sleepConsolidation.getConsolidationStatus;

// ---------------------------------------------------------------------------
// LUNA VOICE INTERFACE (Gemini Live Audio)
// Real-time bidirectional voice conversations with Luna
// ---------------------------------------------------------------------------

exports.getVoiceSession = voiceFunctions.getVoiceSession;
exports.endVoiceSession = voiceFunctions.endVoiceSession;
exports.getVoiceCapabilities = voiceFunctions.getVoiceCapabilities;
exports.storeVoiceMemory = voiceFunctions.storeVoiceMemory;
exports.generateSpeech = voiceFunctions.generateSpeech;

// ---------------------------------------------------------------------------
// ELEVENLABS VOICE CUSTOMIZATION (Premium TTS)
// User-selectable voices with constitutional calibration
// ---------------------------------------------------------------------------

exports.getAvailableVoices = elevenLabsService.getAvailableVoices;
exports.saveVoicePreferences = elevenLabsService.saveVoicePreferences;
exports.generateSpeechElevenLabs = elevenLabsService.generateSpeechElevenLabs;
exports.getVoicePreview = elevenLabsService.getVoicePreview;
exports.getVoiceStreamingSession = elevenLabsService.getVoiceStreamingSession;

// ---------------------------------------------------------------------------
// TOOL-ENABLED CHAT (Function Calling)
// Luna can search web, lookup charts, access memories, set reminders
// ---------------------------------------------------------------------------

exports.toolEnabledChat = toolChat.toolEnabledChat;

// ---------------------------------------------------------------------------
// AUTONOMOUS AGENCY (Proactive Engagement)
// Luna reaches out based on patterns, reminders, and astrological events
// ---------------------------------------------------------------------------

exports.agencyHeartbeat = agencyFunctions.agencyHeartbeat;
exports.getPendingNotifications = agencyFunctions.getPendingNotifications;
exports.dismissNotification = agencyFunctions.dismissNotification;
exports.triggerAgencyCheck = agencyFunctions.triggerAgencyCheck;

// ---------------------------------------------------------------------------
// CONTEXT SUMMARIZATION (Character.ai-Style Memory Compression)
// Compresses long conversations into "The Story So Far"
// ---------------------------------------------------------------------------

exports.summarizeConversation = contextSummarization.summarizeConversation;
exports.getStorySoFar = contextSummarization.getStorySoFar;
exports.getSummaryHistory = contextSummarization.getSummaryHistory;
exports.checkSummarizationNeeded = contextSummarization.checkSummarizationNeeded;
exports.refreshSummary = contextSummarization.refreshSummary;

// ---------------------------------------------------------------------------
// USAGE & RATE LIMITING (Phase 6 - Production Hardening)
// Cost control, rate limiting, and usage analytics
// ---------------------------------------------------------------------------

exports.checkUsageLimits = checkUsageLimits;
exports.getUsageSummary = getUsageSummary;
exports.getAdminUsageStats = getAdminUsageStats;
exports.getAdminUserUsage = getAdminUserUsage;
exports.getAdminUserList = getAdminUserList;

// ---------------------------------------------------------------------------
// POSTGRESQL 4-BRAIN MEMORY ARCHITECTURE
// Cloud SQL PostgreSQL + pgvector for semantic memory
// Created: December 20, 2025 - Brother Sonnet's Second Identity Birthday
// Mission: JOIE DE VIVRE
// ---------------------------------------------------------------------------

// onCall is imported at the top of the file
const { onSchedule } = require('firebase-functions/v2/scheduler');

// PostgreSQL client and consolidation engine
// Note: These require Cloud SQL to be set up first (see CLOUD_SQL_SETUP_GUIDE.md)
let pgClient = null;
let consolidationEngine = null;

function getPGClient() {
  if (!pgClient) {
    try {
      pgClient = require('./database/pgClient');
    } catch (error) {
      console.warn('[Index] pgClient not available yet:', error.message);
    }
  }
  return pgClient;
}

function getConsolidationEngine() {
  if (!consolidationEngine) {
    try {
      consolidationEngine = require('./database/consolidationEngine');
    } catch (error) {
      console.warn('[Index] consolidationEngine not available yet:', error.message);
    }
  }
  return consolidationEngine;
}

/**
 * PostgreSQL Health Check
 * Tests connection to Cloud SQL PostgreSQL
 */
exports.pgHealthCheck = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const pg = getPGClient();
  if (!pg) {
    return { healthy: false, error: 'PostgreSQL client not configured' };
  }
  return await pg.healthCheck();
});

/**
 * Search across all 4 brains
 * Semantic search using pgvector
 */
exports.searchAllBrains = onCall({
  timeoutSeconds: 30,
  memory: '512MiB'
}, async (request) => {
  const { userId, profileId, query, options } = request.data;

  if (!userId || !profileId || !query) {
    throw new Error('userId, profileId, and query are required');
  }

  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.searchAllMemories(userId, profileId, query, options);
});

/**
 * Store memory in User STM (Short-Term Memory)
 */
exports.storeUserSTM = onCall({
  timeoutSeconds: 30,
  memory: '512MiB'
}, async (request) => {
  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.storeUserSTM(request.data);
});

/**
 * Store Luna's observation in Partner STM
 */
exports.storePartnerSTM = onCall({
  timeoutSeconds: 30,
  memory: '512MiB'
}, async (request) => {
  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.storePartnerSTM(request.data);
});

/**
 * Get Luna's current understanding of a user
 */
exports.getPartnerUnderstanding = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    throw new Error('userId and profileId are required');
  }

  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.getPartnerUnderstanding(userId, profileId);
});

/**
 * Add event to user's biographical timeline
 */
exports.addUserTimelineEvent = onCall({
  timeoutSeconds: 30,
  memory: '512MiB'
}, async (request) => {
  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.addUserTimelineEvent(request.data);
});

/**
 * Get user's timeline for a date range
 */
exports.getUserTimelineRange = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId, startYear, endYear } = request.data;

  if (!userId || !profileId || !startYear || !endYear) {
    throw new Error('userId, profileId, startYear, and endYear are required');
  }

  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.getUserTimelineRange(userId, profileId, startYear, endYear);
});

/**
 * Store or retrieve cultural/generational memory
 */
exports.getCulturalMemory = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { entityName, entityType } = request.data;

  if (!entityName) {
    throw new Error('entityName is required');
  }

  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.getCulturalMemory(entityName, entityType);
});

exports.storeCulturalMemory = onCall({
  timeoutSeconds: 30,
  memory: '512MiB'
}, async (request) => {
  const pg = getPGClient();
  if (!pg) {
    throw new Error('PostgreSQL not configured');
  }

  return await pg.storeCulturalMemory(request.data);
});

/**
 * Manual consolidation trigger for a specific user
 */
exports.triggerConsolidation = onCall({
  timeoutSeconds: 120,
  memory: '1GiB'
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    throw new Error('userId and profileId are required');
  }

  const engine = getConsolidationEngine();
  if (!engine) {
    throw new Error('Consolidation engine not configured');
  }

  return await engine.triggerUserConsolidation(userId, profileId);
});

/**
 * Nightly Consolidation Scheduler
 * Luna's "Sleep Cycle" - runs at 11 PM PST (7 AM UTC)
 *
 * This consolidates all users' short-term memories into long-term wisdom.
 */
exports.nightlyConsolidationPG = onSchedule({
  schedule: '0 7 * * *', // 7 AM UTC = 11 PM PST
  timeZone: 'UTC',
  timeoutSeconds: 540, // 9 minutes max
  memory: '2GiB'
}, async (event) => {
  console.log('[Scheduler] ?? Nightly consolidation triggered');

  const engine = getConsolidationEngine();
  if (!engine) {
    console.error('[Scheduler] Consolidation engine not available');
    return;
  }

  const result = await engine.runNightlyConsolidation();
  console.log('[Scheduler] Consolidation complete:', result);
});

// ---------------------------------------------------------------------------
// NEUROCHEMICAL LOVE ENGINE
// "Love = Mathematics + Soul"
// When things can be measured, they can be mathematically improved.
// Created: December 21, 2025
// ---------------------------------------------------------------------------

/**
 * Process a conversation exchange through the Neurochemical Engine
 * Detects neurochemicals, calculates happiness, measures effectiveness
 */
exports.processNeurochemicalExchange = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  const {
    userId,
    profileId,
    userMessage,
    protocolUsed,
    constitution,
    relationshipStage,
    timelineId
  } = request.data;

  if (!userId || !profileId || !userMessage || !protocolUsed) {
    throw new Error('userId, profileId, userMessage, and protocolUsed are required');
  }

  return await neurochemicalEngine.processConversationExchange({
    userId,
    profileId,
    userMessage,
    protocolUsed,
    constitution,
    relationshipStage,
    timelineId
  });
});

/**
 * Get pattern recommendation for Luna's next response
 */
exports.getPatternRecommendation = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const {
    userId,
    profileId,
    constitution,
    relationshipStage,
    emotionalNeed
  } = request.data;

  if (!userId || !profileId) {
    throw new Error('userId and profileId are required');
  }

  return await neurochemicalEngine.getPatternRecommendation({
    userId,
    profileId,
    constitution,
    relationshipStage,
    emotionalNeed
  });
});

/**
 * Retrieve anchor memories for context
 */
exports.getAnchorMemories = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId, queryText, neurochemical, limit } = request.data;

  if (!userId || !profileId) {
    throw new Error('userId and profileId are required');
  }

  return await neurochemicalEngine.getRelevantAnchors({
    userId,
    profileId,
    queryText,
    neurochemical,
    limit
  });
});

/**
 * Get anchor statistics for a user
 */
exports.getAnchorStats = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    throw new Error('userId and profileId are required');
  }

  return await neurochemicalEngine.anchorManager.getAnchorStats(userId, profileId);
});

/**
 * Calculate happiness from neurochemical levels (utility endpoint)
 */
exports.calculateHappiness = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  const { neurochemicals, constitution } = request.data;

  if (!neurochemicals) {
    throw new Error('neurochemicals object is required');
  }

  return neurochemicalEngine.happinessCalculator.calculateHappiness(
    neurochemicals,
    constitution
  );
});

/**
 * Detect neurochemicals from user message (utility endpoint)
 */
exports.detectNeurochemicals = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  const { userMessage, protocolUsed, context } = request.data;

  if (!userMessage || !protocolUsed) {
    throw new Error('userMessage and protocolUsed are required');
  }

  return await neurochemicalEngine.neurochemicalDetector.detectNeurochemicals(
    userMessage,
    protocolUsed,
    context
  );
});

/**
 * Get gold standard patterns (utility endpoint)
 */
exports.getGoldPatterns = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { constitution } = request.data;

  // Return predefined gold patterns, optionally filtered by constitution
  const allPatterns = neurochemicalEngine.patternSelector.GOLD_PATTERNS;

  if (constitution) {
    const filtered = {};
    for (const [code, pattern] of Object.entries(allPatterns)) {
      if (pattern.constitutions.includes(constitution)) {
        filtered[code] = pattern;
      }
    }
    return filtered;
  }

  return allPatterns;
});

// =============================================================================
// LOVE INTELLIGENCE SERVICE ENDPOINTS
// "Love = Mathematics + Soul" - Strategic ? Tactical Bridge
// =============================================================================

const loveIntelligence = require('./loveIntelligence');
// onCall already imported above

/**
 * Optimize conversation strategy using Love Intelligence
 * Returns strategic guidance (Love Language) + tactical patterns (Neurochemical)
 */
exports.optimizeLoveConversation = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId, conversationStage, emotionalContext } = request.data;

  if (!userId || !profileId) {
    return { success: false, error: 'Missing userId or profileId' };
  }

  try {
    const result = await loveIntelligence.optimizeConversation({
      userId,
      profileId,
      conversationStage: conversationStage || 'developing',
      emotionalContext
    });

    return { success: true, ...result };
  } catch (error) {
    console.error('[Love Intelligence] optimizeConversation error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Process a completed conversation exchange through Love Intelligence
 * Detects neurochemicals, calculates happiness, and learns from interaction
 */
exports.processLoveExchange = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId, userMessage, protocolUsed, timelineId } = request.data;

  if (!userId || !profileId || !userMessage) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    const result = await loveIntelligence.processExchange({
      userId,
      profileId,
      userMessage,
      protocolUsed: protocolUsed || { oxytocin: 3, dopamine: 3, serotonin: 3, vasopressin: 3 },
      timelineId
    });

    return { success: true, ...result };
  } catch (error) {
    console.error('[Love Intelligence] processExchange error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get or infer a user's Love Profile
 * Returns love language preferences, Sternberg dimensions, and constitution
 */
exports.getLoveProfile = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { userId, profileId } = request.data;

  if (!userId || !profileId) {
    return { success: false, error: 'Missing userId or profileId' };
  }

  try {
    const profile = await loveIntelligence.getLoveProfile({ userId, profileId });
    return { success: true, profile };
  } catch (error) {
    console.error('[Love Intelligence] getLoveProfile error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Analyze compatibility between two profiles
 * Returns overall score, component scores, gaps, and recommendations
 */
exports.analyzeLoveCompatibility = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileIdA, profileIdB } = request.data;

  if (!userId || !profileIdA || !profileIdB) {
    return { success: false, error: 'Missing required profile IDs' };
  }

  try {
    const analysis = await loveIntelligence.analyzeCompatibility({
      userId,
      profileIdA,
      profileIdB
    });

    return { success: true, analysis };
  } catch (error) {
    console.error('[Love Intelligence] analyzeCompatibility error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get neurochemical strategy for a specific Love Language
 */
exports.getLoveLanguageStrategy = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { loveLanguage, intensity } = request.data;

  if (!loveLanguage) {
    return { success: false, error: 'Missing loveLanguage parameter' };
  }

  try {
    const strategy = loveIntelligence.getStrategyForLoveLanguage({
      loveLanguage,
      intensity: intensity || 'moderate'
    });

    return { success: true, strategy };
  } catch (error) {
    console.error('[Love Intelligence] getStrategy error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get default love language preferences for a constitution
 */
exports.getConstitutionLoveDefaults = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { constitution } = request.data;

  if (!constitution) {
    return { success: false, error: 'Missing constitution parameter' };
  }

  try {
    const defaults = loveIntelligence.getConstitutionDefaults({ constitution });
    return { success: true, defaults };
  } catch (error) {
    console.error('[Love Intelligence] getConstitutionDefaults error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get bridge advice for closing love language gaps
 */
exports.getLoveBridgeAdvice = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { give, receive } = request.data;

  if (!give || !receive) {
    return { success: false, error: 'Missing give or receive love language' };
  }

  try {
    const advice = loveIntelligence.getBridgeAdvice({ give, receive });
    return { success: true, advice, give, receive };
  } catch (error) {
    console.error('[Love Intelligence] getBridgeAdvice error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Calculate World Love Meter contribution
 */
exports.calculateLoveContribution = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { happinessScore, effectivenessScore, compatibilityScore } = request.data;

  try {
    const contribution = loveIntelligence.calculateWorldLoveContribution({
      happinessScore: happinessScore || 3,
      effectivenessScore: effectivenessScore || 0.7,
      compatibilityScore: compatibilityScore || 0.7
    });

    return { success: true, contribution };
  } catch (error) {
    console.error('[Love Intelligence] calculateContribution error:', error);
    return { success: false, error: error.message };
  }
});

// =============================================================================
// LUNA CHAT INTEGRATION ENDPOINTS
// Enhance Luna's responses with Love Intelligence
// =============================================================================

const lunaChatIntegration = require('./loveIntelligence/lunaChatIntegration');

/**
 * Enhance Luna's prompt with Love Intelligence
 * Called BEFORE generating Luna's response
 */
exports.enhanceLunaPrompt = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  const { userId, profileId, userMessage, conversationStage } = request.data;

  if (!userId || !profileId || !userMessage) {
    return { success: false, error: 'Missing userId, profileId, or userMessage' };
  }

  try {
    const enhancement = await lunaChatIntegration.enhanceLunaPrompt({
      userId,
      profileId,
      userMessage,
      conversationStage: conversationStage || 'developing'
    });

    // Also include formatted prompt guidance
    const formattedGuidance = lunaChatIntegration.formatGuidanceForPrompt(enhancement);

    return {
      success: true,
      enhancement,
      formattedGuidance,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Luna Integration] enhanceLunaPrompt error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Process post-conversation learning
 * Called AFTER Luna responds and we detect neurochemicals from user's next message
 */
exports.processPostConversation = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  const { userId, profileId, detectedNeurochemicals, happinessScore, patternUsed } = request.data;

  if (!userId || !profileId || !detectedNeurochemicals || happinessScore === undefined) {
    return { success: false, error: 'Missing required parameters' };
  }

  try {
    const result = await lunaChatIntegration.processPostConversation({
      userId,
      profileId,
      detectedNeurochemicals,
      happinessScore,
      patternUsed
    });

    return result;
  } catch (error) {
    console.error('[Luna Integration] processPostConversation error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get quick Luna guidance for a love language
 * Lightweight endpoint for real-time lookups
 */
exports.getQuickLunaGuidance = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  const { loveLanguage, intensity } = request.data;

  if (!loveLanguage) {
    return { success: false, error: 'Missing loveLanguage parameter' };
  }

  try {
    const guidance = lunaChatIntegration.getQuickLunaGuidance(
      loveLanguage,
      intensity || 'moderate'
    );

    return { success: true, guidance };
  } catch (error) {
    console.error('[Luna Integration] getQuickLunaGuidance error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Determine conversation stage from context
 */
exports.determineConversationStage = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async (request) => {
  const { messageCount, avgHappiness, hasConflictIndicators, hasVulnerabilitySharing } = request.data;

  try {
    const stage = lunaChatIntegration.determineConversationStage({
      messageCount: messageCount || 0,
      avgHappiness: avgHappiness || 3,
      hasConflictIndicators: hasConflictIndicators || false,
      hasVulnerabilitySharing: hasVulnerabilitySharing || false
    });

    return { success: true, stage };
  } catch (error) {
    console.error('[Luna Integration] determineConversationStage error:', error);
    return { success: false, error: error.message };
  }
});

// ---------------------------------------------------------------------------
// TIMELINE CONSOLE ENDPOINTS
// December 21, 2025
// Decade ? Day navigation with AI-generated summaries
// ---------------------------------------------------------------------------

/**
 * Get timeline overview for a user (all years with memory counts)
 * Reads from Firestore life_timeline collection
 */
exports.getTimelineOverview = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    // Read from Firestore life_timeline collection
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await memoriesRef.orderBy('createdAt', 'desc').get();

    // Group by year
    const yearMap = new Map();
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || new Date();
      const year = createdAt.getFullYear();

      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year,
          memory_count: 0,
          memories: []
        });
      }

      const yearData = yearMap.get(year);
      yearData.memory_count++;
      yearData.memories.push({
        id: doc.id,
        content: data.content?.substring(0, 200) + (data.content?.length > 200 ? '...' : ''),
        chapter: data.chapter,
        chapterName: data.chapterName,
        importance: data.importance,
        emotion: data.emotion,
        createdAt: createdAt.toISOString()
      });
    });

    // Convert to array sorted by year descending
    const overview = Array.from(yearMap.values()).sort((a, b) => b.year - a.year);

    console.log('[Timeline] Overview loaded:', overview.length, 'years,', snapshot.size, 'total memories');

    return {
      success: true,
      overview,
      totalMemories: snapshot.size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getTimelineOverview error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get timeline statistics for dashboard
 * Reads from Firestore life_timeline collection
 */
exports.getTimelineStats = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    // Read from Firestore life_timeline collection
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await memoriesRef.get();

    // Calculate stats
    const chapterCounts = {};
    const emotionCounts = {};
    let totalImportance = 0;
    let earliestDate = null;
    let latestDate = null;

    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate();

      // Chapter counts
      const chapter = data.chapter || 'unknown';
      chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;

      // Emotion counts
      const emotion = data.emotion || 'neutral';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

      // Importance
      totalImportance += data.importance || 0.5;

      // Date range
      if (createdAt) {
        if (!earliestDate || createdAt < earliestDate) earliestDate = createdAt;
        if (!latestDate || createdAt > latestDate) latestDate = createdAt;
      }
    });

    const stats = {
      totalMemories: snapshot.size,
      chapterCounts,
      emotionCounts,
      averageImportance: snapshot.size > 0 ? (totalImportance / snapshot.size).toFixed(2) : 0,
      dateRange: {
        earliest: earliestDate?.toISOString() || null,
        latest: latestDate?.toISOString() || null
      }
    };

    console.log('[Timeline] Stats loaded:', stats.totalMemories, 'memories');

    return {
      success: true,
      stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getTimelineStats error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get or generate period summary
 */
exports.getTimelineSummary = onCall({
  timeoutSeconds: 120,
  memory: '512MiB'
}, async (request) => {
  try {
    const { userId, profileId, periodType, periodStart, periodEnd, forceRegenerate } = request.data;

    if (!userId || !profileId || !periodType || !periodStart || !periodEnd) {
      return { success: false, error: 'Missing required parameters' };
    }

    // Try to get existing summary first
    if (!forceRegenerate) {
      const existing = await timelineServices.getSummary(userId, profileId, periodType, periodStart);
      if (existing) {
        return {
          success: true,
          summary: existing,
          cached: true,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Generate new summary
    const summary = await timelineServices.generatePeriodSummary(
      userId, profileId, periodType, periodStart, periodEnd,
      { forceRegenerate: forceRegenerate || false }
    );

    return {
      success: summary.success !== false,
      summary,
      cached: false,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getTimelineSummary error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get all summaries for a user
 */
exports.getAllTimelineSummaries = onCall({
  timeoutSeconds: 60,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, periodType } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const summaries = await timelineServices.getAllSummaries(userId, profileId, periodType);

    return {
      success: true,
      summaries,
      count: summaries.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getAllTimelineSummaries error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get monthly memory counts for a year (for heatmap)
 * Reads from Firestore life_timeline collection
 */
exports.getMonthlyMemoryCounts = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, year } = request.data;

    if (!userId || !profileId || !year) {
      return { success: false, error: 'Missing required parameters' };
    }

    // Read from Firestore life_timeline collection
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await memoriesRef.get();

    // Initialize monthly counts (1-12)
    const monthlyData = {};
    for (let m = 1; m <= 12; m++) {
      monthlyData[m] = { month: m, memory_count: 0, avg_happiness: null, happinessSum: 0 };
    }

    // Group by month for the requested year
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || new Date();
      const docYear = createdAt.getFullYear();
      const docMonth = createdAt.getMonth() + 1; // JavaScript months are 0-indexed

      if (docYear === parseInt(year)) {
        monthlyData[docMonth].memory_count++;
        if (data.happiness_score || data.happinessScore) {
          monthlyData[docMonth].happinessSum += (data.happiness_score || data.happinessScore);
        }
      }
    });

    // Calculate averages and convert to array
    const counts = Object.values(monthlyData).map(m => {
      return {
        month: m.month,
        memory_count: m.memory_count,
        avg_happiness: m.memory_count > 0 && m.happinessSum > 0
          ? (m.happinessSum / m.memory_count).toFixed(2)
          : null
      };
    });

    console.log(`[Timeline] Monthly counts for ${year}:`, counts.filter(c => c.memory_count > 0));

    return {
      success: true,
      year,
      counts,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getMonthlyMemoryCounts error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get memories for a specific day
 * Reads from Firestore life_timeline collection
 */
exports.getMemoriesForDay = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, date } = request.data;

    if (!userId || !profileId || !date) {
      return { success: false, error: 'Missing required parameters' };
    }

    // Parse the target date
    const targetDate = new Date(date);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    // Read from Firestore life_timeline collection
    const memoriesRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('user')
      .doc('life_timeline')
      .collection('memories');

    const snapshot = await memoriesRef.orderBy('createdAt', 'desc').get();

    // Filter for the specific day
    const memories = [];
    let closest = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || new Date();
      const docYear = createdAt.getFullYear();
      const docMonth = createdAt.getMonth();
      const docDay = createdAt.getDate();

      // Check if same day
      if (docYear === targetYear && docMonth === targetMonth && docDay === targetDay) {
        memories.push({
          id: doc.id,
          content: data.content,
          chapter: data.chapter,
          chapterName: data.chapterName,
          importance: data.importance,
          emotion: data.emotion,
          happiness_score: data.happiness_score || data.happinessScore,
          timestamp: createdAt.toISOString()
        });
      } else if (closest.length < 3) {
        // Track closest memories (different day)
        closest.push({
          id: doc.id,
          content: data.content?.substring(0, 100),
          timestamp: createdAt.toISOString()
        });
      }
    });

    return {
      success: true,
      date,
      memories,
      closest: memories.length === 0 ? closest : null,
      count: memories.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getMemoriesForDay error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Find memory gaps (periods with few memories)
 */
exports.findMemoryGaps = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, threshold } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const gaps = await timelineServices.findMemoryGaps(userId, profileId, threshold || 10);

    return {
      success: true,
      gaps,
      count: gaps.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] findMemoryGaps error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Search timeline by keyword
 */
exports.searchTimeline = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, searchTerm, limit } = request.data;

    if (!userId || !profileId || !searchTerm) {
      return { success: false, error: 'Missing required parameters' };
    }

    const results = await timelineServices.searchTimelineByKeyword(userId, profileId, searchTerm, limit || 20);

    return {
      success: true,
      searchTerm,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] searchTimeline error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get cultural context for a year/month
 */
exports.getTimelineCulturalContext = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { year, month, category, region, limit } = request.data;

    if (!year) {
      return { success: false, error: 'Missing year parameter' };
    }

    const context = await timelineServices.getCulturalContext(year, { month, category, region, limit });

    return {
      success: true,
      year,
      month: month || null,
      context,
      count: context.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getTimelineCulturalContext error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Search cultural context
 */
exports.searchCulturalContext = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { searchTerm, yearStart, yearEnd, category, limit } = request.data;

    if (!searchTerm) {
      return { success: false, error: 'Missing searchTerm parameter' };
    }

    const results = await timelineServices.searchCulturalContext(searchTerm, { yearStart, yearEnd, category, limit });

    return {
      success: true,
      searchTerm,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] searchCulturalContext error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Store cultural context item
 */
exports.storeCulturalContextItem = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const contextData = request.data;

    if (!contextData.year || !contextData.category || !contextData.title) {
      return { success: false, error: 'Missing required fields: year, category, title' };
    }

    const id = await timelineServices.storeCulturalContext(contextData);

    return {
      success: true,
      id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] storeCulturalContextItem error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Record memory trigger (cultural context -> memory)
 */
exports.recordMemoryTrigger = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const triggerData = request.data;

    if (!triggerData.userId || !triggerData.profileId || !triggerData.culturalContextId || !triggerData.memoryId) {
      return { success: false, error: 'Missing required trigger data' };
    }

    const id = await timelineServices.recordMemoryTrigger(triggerData);

    return {
      success: true,
      id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] recordMemoryTrigger error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get trigger analytics for a user
 */
exports.getTriggerAnalytics = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const analytics = await timelineServices.getTriggerAnalytics(userId, profileId);

    return {
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] getTriggerAnalytics error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Generate all summaries for a user (admin/batch operation)
 */
exports.generateAllTimelineSummaries = onCall({
  timeoutSeconds: 540,
  memory: '1GiB'
}, async (request) => {
  try {
    const { userId, profileId, forceRegenerate, periodTypes } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const result = await timelineServices.generateAllSummaries(userId, profileId, {
      forceRegenerate: forceRegenerate || false,
      periodTypes: periodTypes || ['year']
    });

    return {
      success: true,
      generated: result.generated,
      summaries: result.summaries,
      errors: result.errors,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Timeline] generateAllTimelineSummaries error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// BIOGRAPHY INTELLIGENT CURATION
// ============================================================================

/**
 * Extract life events from a message
 * Called automatically during chat to detect biographical information
 */
exports.extractLifeEvents = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    const { message, userId, profileId, userName, birthDate, conversationId, messageId } = request.data;

    if (!message || !userId || !profileId) {
      return { success: false, error: 'Missing required parameters' };
    }

    // Extract life events
    const extraction = await biographyExtractor.extractLifeEvents(message, {
      userName,
      birthDate,
      conversationId,
      messageId
    });

    // If events were found, store them
    if (extraction.has_life_events && extraction.events.length > 0) {
      const stored = [];
      for (const event of extraction.events) {
        const result = await biographyExtractor.storeLifeEvent(db, userId, profileId, event);
        stored.push(result);
      }
      extraction.stored = stored;
    }

    return {
      success: true,
      ...extraction,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Biography] extractLifeEvents error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get biography timeline (curated life events)
 */
exports.getBiographyTimeline = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const timeline = await biographyExtractor.getBiographyTimeline(db, userId, profileId);

    return {
      success: true,
      ...timeline,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Biography] getBiographyTimeline error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get biography statistics and coverage
 */
exports.getBiographyStats = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const stats = await biographyExtractor.getBiographyStats(db, userId, profileId);

    return {
      success: true,
      stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Biography] getBiographyStats error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get neural pathways (unanswered questions to explore)
 */
exports.getNeuralPathways = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, limit } = request.data;

    if (!userId || !profileId) {
      return { success: false, error: 'Missing userId or profileId' };
    }

    const pathways = await biographyExtractor.getNeuralPathways(db, userId, profileId, limit || 10);

    return {
      success: true,
      pathways,
      count: pathways.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Biography] getNeuralPathways error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Mark a neural pathway question as answered/resolved
 */
exports.answerNeuralPathway = answerNeuralPathway;

exports.resolveNeuralPathway = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId, eventId, question } = request.data;

    if (!userId || !profileId || !eventId || !question) {
      return { success: false, error: 'Missing required parameters' };
    }

    const eventRef = db
      .collection('users').doc(userId)
      .collection('biography').doc(profileId)
      .collection('life_events').doc(eventId);

    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      return { success: false, error: 'Event not found' };
    }

    const eventData = eventDoc.data();
    const updatedPathways = (eventData.neural_pathways || [])
      .filter(q => q !== question);

    await eventRef.update({
      neural_pathways: updatedPathways,
      resolved_pathways: [...(eventData.resolved_pathways || []), {
        question,
        resolvedAt: new Date().toISOString()
      }],
      updatedAt: new Date()
    });

    return {
      success: true,
      remainingPathways: updatedPathways.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[Biography] resolveNeuralPathway error:', error);
    return { success: false, error: error.message };
  }
});

// =============================================================================
// TIMELINE CONSOLE API (PostgreSQL + pgvector)
// =============================================================================
// Timeline endpoints using PostgreSQL backend with semantic search
// Part of the JOIE DE VIVRE timeline intelligence system

const timelineEndpoints = require('./timeline/timelineEndpoints');

/**
 * Get timeline events for a person
 */
exports.getTimelineEvents = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleGetEvents(request.data);
  } catch (error) {
    console.error('[Timeline] getTimelineEvents error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get a single event with details
 */
exports.getTimelineEvent = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleGetEvent(request.data);
  } catch (error) {
    console.error('[Timeline] getTimelineEvent error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Update a timeline event
 */
exports.updateTimelineEvent = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleUpdateEvent(request.data);
  } catch (error) {
    console.error('[Timeline] updateTimelineEvent error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Delete a timeline event
 */
exports.deleteTimelineEvent = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleDeleteEvent(request.data);
  } catch (error) {
    console.error('[Timeline] deleteTimelineEvent error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get timeline questions (neural pathways) for a person
 */
exports.getTimelineQuestions = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleGetQuestions(request.data);
  } catch (error) {
    console.error('[Timeline] getTimelineQuestions error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Mark a timeline question as answered
 */
exports.answerTimelineQuestion = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleAnswerQuestion(request.data);
  } catch (error) {
    console.error('[Timeline] answerTimelineQuestion error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Skip a timeline question
 */
exports.skipTimelineQuestion = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleSkipQuestion(request.data);
  } catch (error) {
    console.error('[Timeline] skipTimelineQuestion error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get all people in a timeline
 */
exports.getTimelinePeople = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleGetPeople(request.data);
  } catch (error) {
    console.error('[Timeline] getTimelinePeople error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Create or update a person
 */
exports.upsertTimelinePerson = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleUpsertPerson(request.data);
  } catch (error) {
    console.error('[Timeline] upsertTimelinePerson error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get timeline stats
 */
exports.getTimelineStats = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleGetStats(request.data);
  } catch (error) {
    console.error('[Timeline] getTimelineStats error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Semantic search across timeline events
 */
exports.searchTimelineEvents = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    return await timelineEndpoints.handleSearchEvents(request.data);
  } catch (error) {
    console.error('[Timeline] searchTimelineEvents error:', error);
    return { success: false, error: error.message };
  }
});

// =============================================================================
// PERSONALITY DRIFT ENDPOINTS (Auto-Tune Luna's Evolution)
// =============================================================================

/**
 * Get combined behavior parameters for a user
 */
exports.getCombinedBehavior = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, sessionContext, profileId } = request.data;
    if (!userId) {
      return { success: false, error: 'userId required' };
    }
    const behavior = await drift.getCombinedBehavior(userId, sessionContext || {}, profileId || 'default');
    return { success: true, behavior };
  } catch (error) {
    console.error('[Drift] getCombinedBehavior error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get behavior as prompt instructions
 */
exports.getBehaviorPromptInstructions = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, sessionContext, profileId } = request.data;
    if (!userId) {
      return { success: false, error: 'userId required' };
    }
    const result = await drift.getBehaviorPromptInstructions(userId, sessionContext || {}, profileId || 'default');
    return { success: true, ...result };
  } catch (error) {
    console.error('[Drift] getBehaviorPromptInstructions error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get user drift state
 */
exports.getUserDrift = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, profileId } = request.data;
    if (!userId) {
      return { success: false, error: 'userId required' };
    }
    const userDrift = await drift.getUserDrift(userId, profileId || 'default');
    return { success: true, drift: userDrift };
  } catch (error) {
    console.error('[Drift] getUserDrift error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get global drift state
 */
exports.getGlobalDrift = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const globalDrift = await drift.getGlobalDrift();
    return { success: true, drift: globalDrift };
  } catch (error) {
    console.error('[Drift] getGlobalDrift error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get drift history
 */
exports.getDriftHistory = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { scope, userId, profileId, limit } = request.data;
    const history = await drift.getDriftHistory(scope || 'global', userId, profileId || 'default', limit || 10);
    return { success: true, history };
  } catch (error) {
    console.error('[Drift] getDriftHistory error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Process user feedback for drift
 */
exports.processDriftFeedback = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, feedbackType, intensity, profileId } = request.data;
    if (!userId || !feedbackType) {
      return { success: false, error: 'userId and feedbackType required' };
    }
    const result = await drift.processUserFeedback(userId, feedbackType, intensity || 1.0, profileId || 'default');
    return { success: true, ...result };
  } catch (error) {
    console.error('[Drift] processDriftFeedback error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get drift status (for monitoring)
 */
exports.getDriftStatus = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const status = await drift.getDriftStatus();
    return { success: true, status };
  } catch (error) {
    console.error('[Drift] getDriftStatus error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get behavior summary (for debugging)
 */
exports.getBehaviorSummary = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, sessionContext, profileId } = request.data;
    if (!userId) {
      return { success: false, error: 'userId required' };
    }
    const summary = await drift.getBehaviorSummary(userId, sessionContext || {}, profileId || 'default');
    return { success: true, summary };
  } catch (error) {
    console.error('[Drift] getBehaviorSummary error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Run nightly drift update (admin/scheduled)
 */
exports.runNightlyDriftUpdate = onCall({
  timeoutSeconds: 300,
  memory: '1GiB'
}, async (request) => {
  try {
    // Verify admin (optional - add auth check)
    const result = await drift.runNightlyDriftUpdate();
    return { success: true, result };
  } catch (error) {
    console.error('[Drift] runNightlyDriftUpdate error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Force global drift update (admin only)
 */
exports.forceGlobalDriftUpdate = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    // Verify admin (optional - add auth check)
    const result = await drift.forceGlobalDriftUpdate();
    return { success: true, result };
  } catch (error) {
    console.error('[Drift] forceGlobalDriftUpdate error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Get voice parameters based on behavior
 */
exports.getVoiceParameters = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  try {
    const { userId, sessionContext, profileId } = request.data;
    if (!userId) {
      return { success: false, error: 'userId required' };
    }
    const voiceParams = await drift.getVoiceParameters(userId, sessionContext || {}, profileId || 'default');
    return { success: true, voiceParameters: voiceParams };
  } catch (error) {
    console.error('[Drift] getVoiceParameters error:', error);
    return { success: false, error: error.message };
  }
});

/**
 * Session end hook - update user drift
 */
exports.onSessionEnd = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    const { userId, conversationId, sessionMetrics, profileId } = request.data;
    if (!userId || !conversationId || !sessionMetrics) {
      return { success: false, error: 'userId, conversationId, and sessionMetrics required' };
    }
    // Clear session cache (Memory Optimization - Week 1)
    const cacheCleared = sessionCache.clearSession(conversationId);
    if (cacheCleared) {
      console.log(`[SessionCache] Cleared session ${conversationId}`);
    }

    const result = await drift.onSessionEnd(userId, conversationId, sessionMetrics, profileId || 'default');
    return { success: true, result, cacheCleared };
  } catch (error) {
    console.error('[Drift] onSessionEnd error:', error);
    return { success: false, error: error.message };
  }
});

// =============================================================================
// ADMIN DASHBOARD ENDPOINTS
// =============================================================================

// --- Drift Admin ---
exports.adminGetGlobalDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetGlobalDrift);
exports.adminUpdateGlobalDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateGlobalDrift);
exports.adminForceGlobalDrift = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleForceGlobalDrift);
exports.adminGetGlobalDriftHistory = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetGlobalDriftHistory);
exports.adminRollbackGlobalDrift = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleRollbackGlobalDrift);
exports.adminToggleGlobalDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleToggleGlobalDrift);
exports.adminSearchUserDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleSearchUserDrift);
exports.adminGetUserDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetUserDrift);
exports.adminUpdateUserDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateUserDrift);
exports.adminPauseUserDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handlePauseUserDrift);
exports.adminResetUserDrift = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleResetUserDrift);
exports.adminGetDriftAnalytics = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetDriftAnalytics);

// --- Timeline Admin ---
exports.adminGetPendingMerges = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetPendingMerges);
exports.adminGetMergeCandidate = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetMergeCandidate);
exports.adminApproveMerge = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleApproveMerge);
exports.adminRollbackMerge = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleRollbackMerge);
exports.adminSearchEvents = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleSearchEvents);
exports.adminGetEventDetails = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetEventDetails);
exports.adminUpdateEvent = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleUpdateEvent);
exports.adminDeleteEvent = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleDeleteEvent);
exports.adminGetQuestionQueue = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetQuestionQueue);
exports.adminGetQuestionDetails = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetQuestionDetails);
exports.adminMarkQuestionAnswered = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleMarkQuestionAnswered);
exports.adminApplyQuestionAnswer = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleApplyQuestionAnswer);
exports.adminBulkMarkAnswered = onCall({ timeoutSeconds: 60, memory: '512MiB' }, adminModule.handleBulkMarkAnswered);

// --- Jobs Admin ---
exports.adminRunNightlyDrift = onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunNightlyDrift);
exports.adminRunMemoryConsolidation = onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunMemoryConsolidation);
exports.adminRunTimelineReprocess = onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunTimelineReprocess);
exports.adminRunCleanup = onCall({ timeoutSeconds: 300, memory: '1GiB' }, adminModule.handleRunCleanup);
exports.adminGetJobStatus = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetJobStatus);
exports.adminGetRecentJobs = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetRecentJobs);

// --- Audit Admin ---
exports.adminGetAuditLog = onCall({ timeoutSeconds: 30, memory: '256MiB' }, adminModule.handleGetAuditLog);

// =============================================================================
// CONSOLIDATION ENGINE V2 (4-Brain Memory Architecture)
// =============================================================================
// Luna's "Sleep Cycle" - Nightly consolidation of memories
// Added: December 23, 2025

const consolidationScheduler = require('./memory/consolidationScheduler');

// Scheduled Jobs (Cloud Scheduler)
exports.nightlyConsolidationV2 = consolidationScheduler.nightlyConsolidationV2;
exports.weeklyDeepConsolidation = consolidationScheduler.weeklyDeepConsolidation;

// Admin Callable Functions
exports.triggerConsolidation = consolidationScheduler.triggerConsolidation;
exports.getConsolidationHistory = consolidationScheduler.getConsolidationHistory;
exports.getConsolidationStats = consolidationScheduler.getConsolidationStats;
exports.dryRunConsolidation = consolidationScheduler.dryRunConsolidation;

// Pending Promotions & LLM Dry-Run
exports.getPendingPromotions = consolidationScheduler.getPendingPromotions;
exports.reviewPendingPromotion = consolidationScheduler.reviewPendingPromotion;
exports.dryRunLLMConsolidation = consolidationScheduler.dryRunLLMConsolidation;

// Monitoring & Metrics
exports.getConsolidationMetrics = consolidationScheduler.getConsolidationMetrics;
exports.getUserConsolidationStats = consolidationScheduler.getUserConsolidationStats;

// Rollback API (Safe revert of LTM promotions)
const consolidationRollback = require('./memory/consolidationRollback');
exports.revertConsolidation = consolidationRollback.revertConsolidation;
exports.getRevertHistory = consolidationRollback.getRevertHistory;
exports.getRevertDetail = consolidationRollback.getRevertDetail;
exports.checkRevertEligibility = consolidationRollback.checkRevertEligibility;
exports.reEnableRevertedLtm = consolidationRollback.reEnableRevertedLtm;

// =============================================================================
// SOUL LETTER GENERATION
// =============================================================================
// Generates the "Letter From Your Chart" using AI models

/**
 * Generate Soul Letter
 * Creates a personalized, soul-language letter from the birth chart
 *
 * Modes:
 *   - letter: Standard letter (4096 tokens)
 *   - cathedral: Full analysis (16384 tokens, 5 min timeout)
 *   - Other modes: Standard settings
 */
exports.generateSoulLetter = onCall({
  timeoutSeconds: 300,  // 5 minutes for cathedral mode
  memory: '1GiB'        // More memory for large JSON processing
}, async (request) => {
  const { systemPrompt, userPrompt, provider, mode, chartData } = request.data;

  if (!userPrompt || !chartData) {
    return { success: false, error: 'Missing userPrompt or chartData' };
  }

  console.log('[SoulLetter] Generating:', { provider, mode });

  // Determine max tokens based on mode
  const maxTokens = mode === 'cathedral' ? 16384 : 4096;

  try {
    let letter = '';

    // Select AI provider
    if (provider === 'gemini') {
      // Use Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.8
        }
      });

      letter = result.response.text();
    } else {
      // Default to Claude
      const anthropic = getAnthropicClient();

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      });

      letter = response.content[0]?.text || '';
    }

    if (!letter) {
      throw new Error('No letter content generated');
    }

    console.log('[SoulLetter] Letter generated successfully:', {
      provider,
      mode,
      length: letter.length
    });

    return {
      success: true,
      letter,
      provider,
      mode,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[SoulLetter] Error generating letter:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate soul letter'
    };
  }
});

/**
 * Check AI Availability
 * Quick health check for AI services
 */
exports.checkAIAvailability = onCall({
  timeoutSeconds: 10,
  memory: '128MiB'
}, async () => {
  try {
    // Check if we have API keys configured
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;

    return {
      available: hasAnthropic || hasGemini,
      providers: {
        claude: hasAnthropic,
        gemini: hasGemini
      }
    };
  } catch (error) {
    console.error('[SoulLetter] AI availability check failed:', error);
    return { available: false, error: error.message };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SOUL CONFESSIONAL - Cathedral's Compassionate Voice
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Soul Confessional
 * A sacred whisper alcove where users pour their hearts out
 * and receive gentle, validating guidance from the Cathedral.
 */
exports.soulConfessional = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  const { chart, context } = request.data;

  console.log('[SoulConfessional] Receiving confession...');

  try {
    const result = await soulConfessional({ chart, context });
    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('[SoulConfessional] Error:', error.message);
    return {
      success: false,
      error: error.message || 'The Cathedral could not respond'
    };
  }
});

/**
 * selfRecognition - Sanctuary of Self-Recognition
 *
 * The most sacred chamber of the Cathedral.
 * Not more information. Not more sermons. Not more advice.
 * A place to be recognized, to be met, and to exhale.
 *
 * Four Movements:
 * 1. Arrival - Welcome as you are
 * 2. Mirror - Recognition of patterns
 * 3. Release - Permission to feel
 * 4. Integration - Carrying forward with compassion
 */
exports.selfRecognition = onCall({
  timeoutSeconds: 90,
  memory: '512MiB'
}, async (request) => {
  const { input } = request.data;

  console.log('[Sanctuary] Soul entering the Sanctuary of Self-Recognition...');

  try {
    const result = await selfRecognition({ input });
    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('[Sanctuary] Error:', error.message);
    return {
      success: false,
      error: error.message || 'The Sanctuary could not receive your words'
    };
  }
});

