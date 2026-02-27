/**
 * Miscellaneous Services Route Module
 *
 * Soul Letter generation, AI availability check, Soul Confessional,
 * Self-Recognition Sanctuary, image generation, guest chat, biography journal,
 * couple portrait, LLM proxy, and knowledge base.
 */

const { onCall, onRequest, anthropicKey, openaiKey, geminiKey, grokKey, timezonedbKey, logger } = require('./shared');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const { soulConfessional: soulConfessionalHandler } = require('../confessional');
const { selfRecognition: selfRecognitionHandler } = require('../sanctuary');
const stabilityImageGen = require('../image/stabilityImageGen');
const leonardoImageGen = require('../image/leonardoImageGen');
const { handleGuestChat, handleLunaPrivateQuery } = require('../guestChat');
const { generateImage } = require('../utils/nanoBanana');
const knowledgeModule = require('../knowledge');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Add ANTHROPIC_API_KEY to functions/.env');
  }
  return new Anthropic({ apiKey });
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {

  // =========================================================================
  // SOUL LETTER GENERATION
  // =========================================================================

  /**
   * Generate Soul Letter
   * Creates a personalized, soul-language letter from the birth chart
   *
   * Modes:
   *   - letter: Standard letter (4096 tokens)
   *   - cathedral: Full analysis (16384 tokens, 5 min timeout)
   *   - Other modes: Standard settings
   */
  generateSoulLetter: onCall({
    timeoutSeconds: 300,  // 5 minutes for cathedral mode
    memory: '1GiB',       // More memory for large JSON processing
    secrets: [geminiKey, anthropicKey],
  }, async (request) => {
    const { systemPrompt, userPrompt, provider, mode, chartData } = request.data;

    if (!userPrompt || !chartData) {
      return { success: false, error: 'Missing userPrompt or chartData' };
    }

    logger.info('[SoulLetter] Generating:', { provider, mode });

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

      logger.info('[SoulLetter] Letter generated successfully:', {
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
      logger.error('[SoulLetter] Error generating letter:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate soul letter'
      };
    }
  }),

  /**
   * Check AI Availability
   * Quick health check for AI services
   */
  checkAIAvailability: onCall({
    timeoutSeconds: 10,
    memory: '128MiB',
    secrets: [anthropicKey, geminiKey],
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
      logger.error('[SoulLetter] AI availability check failed:', error);
      return { available: false, error: error.message };
    }
  }),

  // =========================================================================
  // SOUL CONFESSIONAL - Cathedral's Compassionate Voice
  // =========================================================================

  /**
   * Soul Confessional
   * A sacred whisper alcove where users pour their hearts out
   * and receive gentle, validating guidance from the Cathedral.
   */
  soulConfessional: onCall({
    timeoutSeconds: 60,
    memory: '512MiB',
    secrets: [anthropicKey, openaiKey],
  }, async (request) => {
    const { chart, context } = request.data;

    logger.info('[SoulConfessional] Receiving confession...');

    try {
      const result = await soulConfessionalHandler({ chart, context });
      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('[SoulConfessional] Error:', error.message);
      return {
        success: false,
        error: error.message || 'The Cathedral could not respond'
      };
    }
  }),

  /**
   * selfRecognition - Sanctuary of Self-Recognition
   *
   * The most sacred chamber of the Cathedral.
   * Four Movements: Arrival, Mirror, Release, Integration
   */
  selfRecognition: onCall({
    timeoutSeconds: 90,
    memory: '512MiB',
    secrets: [anthropicKey, openaiKey],
  }, async (request) => {
    const { input } = request.data;

    logger.info('[Sanctuary] Soul entering the Sanctuary of Self-Recognition...');

    try {
      const result = await selfRecognitionHandler({ input });
      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('[Sanctuary] Error:', error.message);
      return {
        success: false,
        error: error.message || 'The Sanctuary could not receive your words'
      };
    }
  }),

  // =========================================================================
  // AI IMAGE GENERATION
  // Multi-provider: Stability.ai, Leonardo.ai
  // =========================================================================

  // Stability.ai (SD3, SDXL, Stable Image Core)
  generateStabilityImage: stabilityImageGen.generateStabilityImage,
  getStabilityStyles: stabilityImageGen.getStabilityStyles,

  // Leonardo.ai (Phoenix, Vision XL, Kino XL)
  generateLeonardoImage: leonardoImageGen.generateLeonardoImage,
  getLeonardoModels: leonardoImageGen.getLeonardoModels,
  getLeonardoUsage: leonardoImageGen.getLeonardoUsage,

  // =========================================================================
  // GUEST CHAT - Einstein + Luna Active Mode
  // =========================================================================

  /**
   * Guest Chat Cloud Function
   * Production-ready server-side chat with Claude API calls
   */
  guestChat: onCall({
    timeoutSeconds: 60,
    memory: '256MiB',
    secrets: [anthropicKey],
  }, async (request) => {
    return handleGuestChat(request.data, request);
  }),

  /**
   * Luna Private Query Function
   * Allows users to privately consult Luna while chatting with a guest.
   */
  lunaPrivateQuery: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [anthropicKey],
  }, async (request) => {
    return handleLunaPrivateQuery(request.data, request);
  }),

  // =========================================================================
  // BIOGRAPHY JOURNAL - Text-Based Journaling
  // =========================================================================

  /**
   * extractBiographyBullets - AI extracts key moments from biography text
   * Uses Gemini to analyze text and extract meaningful bullet points.
   */
  extractBiographyBullets: onCall({
    timeoutSeconds: 30,
    memory: '256MiB',
    secrets: [geminiKey],
  }, async (request) => {
    const { content, existingBullets = [] } = request.data;

    if (!content || content.trim().length < 50) {
      return {
        success: false,
        error: 'Please write more content before extracting key moments (at least 50 characters).'
      };
    }

    try {
      const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const existingText = existingBullets.length > 0
        ? `\n\nExisting bullets (do NOT repeat these):\n${existingBullets.map(b => `- ${b}`).join('\n')}`
        : '';

      const prompt = `You are helping someone preserve their life story. Extract 3-5 key moments or facts from this text as bullet points.

TEXT:
"${content}"
${existingText}

Rules:
- Extract NEW key moments not already captured
- Keep bullets SHORT (one clear sentence each)
- Be FACTUAL - don't embellish or add information
- Focus on:
  * Important events (births, deaths, marriages, moves)
  * Meaningful relationships (family, friends, mentors)
  * Achievements and milestones
  * Lessons learned or wisdom gained
  * Memorable experiences
- Use past tense
- Start each bullet with an action or event

Return ONLY a JSON array of strings, no other text:
["bullet 1", "bullet 2", "bullet 3"]

If no meaningful new moments can be extracted, return an empty array: []`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse JSON response
      const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
      const bullets = JSON.parse(cleanedResponse);

      if (!Array.isArray(bullets)) {
        return { success: false, error: 'Invalid response format from AI.' };
      }

      // Filter out any duplicates of existing bullets
      const newBullets = bullets.filter(b =>
        !existingBullets.some(existing =>
          existing.toLowerCase().includes(b.toLowerCase()) ||
          b.toLowerCase().includes(existing.toLowerCase())
        )
      );

      return {
        success: true,
        bullets: newBullets,
        totalExtracted: bullets.length,
        filtered: bullets.length - newBullets.length
      };

    } catch (error) {
      logger.error('[Biography] Error extracting bullets:', error.message);
      return {
        success: false,
        error: 'Failed to extract key moments. Please try again.'
      };
    }
  }),

  // =========================================================================
  // COUPLE PORTRAIT GENERATION - Baby Nano Integration
  // =========================================================================

  /**
   * generateCouplePortrait - AI generates romantic couple portrait
   * Uses Gemini (Nano Banana) to create beautiful couple portraits.
   */
  generateCouplePortrait: onCall({
    timeoutSeconds: 120,
    memory: '512MiB',
    cors: [/localhost/, /astroprofile.*\.web\.app/, /astroprofile.*\.firebaseapp\.com/],
    secrets: [geminiKey],
  }, async (request) => {
    const { prompt, sceneKey, userProfile, proMode = false } = request.data;

    logger.info('[CouplePortrait] Generating portrait with scene:', sceneKey);
    logger.info('[CouplePortrait] Prompt length:', prompt?.length || 0);

    if (!prompt || prompt.trim().length < 20) {
      return {
        success: false,
        error: 'Portrait prompt is too short. Please complete the physical layer assessment.'
      };
    }

    try {
      // Use Nano Banana to generate the image
      const result = await generateImage(prompt, userProfile || {}, 0, proMode);

      if (result?.success && result.image) {
        logger.info('[CouplePortrait] Image generated successfully!');
        return {
          success: true,
          image: result.image,
          description: result.description,
          model: result.model,
          proMode: result.proMode,
          sceneKey: sceneKey || 'custom'
        };
      } else {
        logger.info('[CouplePortrait] Generation failed:', result?.error || 'Unknown error');
        return {
          success: false,
          error: result?.error || 'Failed to generate portrait image'
        };
      }
    } catch (error) {
      logger.error('[CouplePortrait] Error:', error.message);
      return {
        success: false,
        error: error.message || 'Failed to generate couple portrait'
      };
    }
  }),

  // =========================================================================
  // LLM PROXY - Generic server-side gateway for ALL frontend LLM calls
  // Keeps API keys on the server. Frontend sends provider + prompt, gets text back.
  // =========================================================================

  llmProxy: onCall({
    secrets: [anthropicKey, openaiKey, grokKey],
    timeoutSeconds: 120,
    memory: '512MiB'
  }, async (request) => {
    // Require authentication
    if (!request.auth) {
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('unauthenticated', 'Must be signed in to use LLM proxy');
    }

    const { provider, model, system, messages, temperature, max_tokens } = request.data || {};

    if (!provider || !messages || !Array.isArray(messages) || messages.length === 0) {
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('invalid-argument', 'Missing required fields: provider, messages[]');
    }

    // Cap max_tokens to prevent abuse
    const safeMaxTokens = Math.min(max_tokens || 4000, 16000);

    try {
      let result;

      switch (provider) {
        case 'anthropic': {
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: model || 'claude-sonnet-4-20250514',
              max_tokens: safeMaxTokens,
              temperature: temperature ?? 0.7,
              ...(system ? { system } : {}),
              messages
            })
          });

          if (!res.ok) {
            const errText = await res.text();
            logger.error(`[llmProxy] Anthropic ${res.status}:`, errText);
            throw new Error(`Anthropic API error (${res.status})`);
          }

          const data = await res.json();
          result = {
            text: (data.content || []).filter(b => b.type === 'text').map(b => b.text).join(''),
            tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
            finishReason: data.stop_reason || 'stop'
          };
          break;
        }

        case 'openai':
        case 'groq': {
          const apiUrl = provider === 'groq'
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';

          const apiKey = provider === 'groq'
            ? process.env.GROQ_API_KEY
            : process.env.OPENAI_API_KEY;

          if (!apiKey) {
            throw new Error(`${provider} API key not configured`);
          }

          const defaultModel = provider === 'groq' ? 'llama-3.1-70b-versatile' : 'gpt-4o-mini';

          const chatMessages = [
            ...(system ? [{ role: 'system', content: system }] : []),
            ...messages
          ];

          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model || defaultModel,
              messages: chatMessages,
              temperature: temperature ?? 0.7,
              max_tokens: safeMaxTokens
            })
          });

          if (!res.ok) {
            const errText = await res.text();
            logger.error(`[llmProxy] ${provider} ${res.status}:`, errText);
            throw new Error(`${provider} API error (${res.status})`);
          }

          const data = await res.json();
          result = {
            text: data.choices?.[0]?.message?.content || '',
            tokens: (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0),
            finishReason: data.choices?.[0]?.finish_reason || 'stop'
          };
          break;
        }

        default: {
          const { HttpsError } = require('firebase-functions/v2/https');
          throw new HttpsError('invalid-argument', `Unknown provider: ${provider}`);
        }
      }

      return result;

    } catch (error) {
      logger.error('[llmProxy] Error:', error.message);
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('internal', error.message || 'LLM proxy call failed');
    }
  }),

  // =========================================================================
  // BAZI READING GENERATOR - Auto-generate all 3 reading modes server-side
  // =========================================================================

  generateBaziReading: onCall({
    secrets: [anthropicKey],
    timeoutSeconds: 300,
    memory: '1GiB',
  }, async (request) => {
    if (!request.auth) {
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const { profileId, modes } = request.data || {};
    if (!profileId) {
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('invalid-argument', 'Missing profileId');
    }

    try {
      const { generateBaziReading } = require('../bazi/generateBaziReading');
      return await generateBaziReading({
        profileId,
        modes: modes || ['soul', 'master', 'shadow'],
        userId: request.auth.uid,
      });
    } catch (error) {
      logger.error('[generateBaziReading] Error:', error.message);
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('internal', error.message || 'BaZi reading generation failed');
    }
  }),

  // =========================================================================
  // BAZI AI CHAT - Multi-turn conversational BaZi analysis
  // =========================================================================

  baziChat: onCall({
    secrets: [anthropicKey],
    timeoutSeconds: 120,
    memory: '512MiB',
  }, async (request) => {
    if (!request.auth) {
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    try {
      const { handleBaZiChat } = require('../bazi/baziChat');
      return await handleBaZiChat(request.data, request);
    } catch (error) {
      logger.error('[baziChat] Error:', error.message);
      const { HttpsError } = require('firebase-functions/v2/https');
      throw new HttpsError('internal', error.message || 'BaZi chat failed');
    }
  }),

  // =========================================================================
  // KNOWLEDGE MODULE - Personality RAG System
  // =========================================================================

  /**
   * getKnowledgeContext - Get personality knowledge for conversation
   */
  getKnowledgeContext: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { userId, query, profileType } = request.data;

    logger.info('[Knowledge] Getting context for user:', userId);

    try {
      const context = await knowledgeModule.getKnowledgeContext(query, profileType);

      return {
        success: true,
        context
      };
    } catch (error) {
      logger.error('[Knowledge] Error getting context:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * searchKnowledgeBase - Search personality knowledge
   */
  searchKnowledgeBase: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    const { query, system } = request.data;

    try {
      const results = await knowledgeModule.searchJSONByKeyword(query, system);

      return {
        success: true,
        results
      };
    } catch (error) {
      logger.error('[Knowledge] Error searching:', error.message);
      return { success: false, error: error.message };
    }
  }),

  /**
   * embedKnowledgeBase - Admin: Embed all knowledge for vector search
   */
  embedKnowledgeBase: onCall({
    timeoutSeconds: 300,
    memory: '512MiB'
  }, async (request) => {
    logger.info('[Knowledge] Starting knowledge base embedding...');

    try {
      const result = await knowledgeModule.embedKnowledgeBase();

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('[Knowledge] Error embedding:', error.message);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // DOCUMENTATION RAG - Vector-Indexed Docs
  // =========================================================================

  /**
   * indexDocumentation - Admin: Index all docs/ markdown files
   */
  indexDocumentation: knowledgeModule.indexDocumentation,

  /**
   * searchDocumentation - Semantic search over project documentation
   */
  searchDocumentation: knowledgeModule.searchDocumentation,

  // =========================================================================
  // TIMEZONE SERVICE - Historical Timezone Lookup
  // =========================================================================

  /**
   * getHistoricalTimezone - Looks up timezone info for a location at a historical date
   * Uses TimezoneDB API for accurate historical DST rules
   */
  getHistoricalTimezone: onRequest({
    cors: true,
    invoker: 'public',
    secrets: [timezonedbKey],
  }, async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const {
        latitude,
        longitude,
        birthDate,
        birthTime,
        birthDateTime
      } = req.body;

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

      let unixTimestamp;
      if (birthDateTime) {
        unixTimestamp = Math.floor(new Date(birthDateTime).getTime() / 1000);
      } else {
        const timeStr = birthTime || '12:00';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const [year, month, day] = birthDate.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
        unixTimestamp = Math.floor(date.getTime() / 1000);
      }

      logger.info('Historical Timezone Lookup:', {
        lat: latitude, lng: longitude, timestamp: unixTimestamp
      });

      const apiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${unixTimestamp}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status !== 'OK') {
        logger.error('TimezoneDB Error:', data);
        return res.status(500).json({
          error: 'TimezoneDB API error',
          details: data.message || 'Unknown error'
        });
      }

      const offsetHours = data.gmtOffset / 3600;
      const absOffset = Math.abs(data.gmtOffset);
      const offsetHH = Math.floor(absOffset / 3600);
      const offsetMM = Math.floor((absOffset % 3600) / 60);
      const formattedOffset = `${offsetHours >= 0 ? '+' : '-'}${String(offsetHH).padStart(2, '0')}:${String(offsetMM).padStart(2, '0')}`;

      return res.status(200).json({
        success: true,
        timezone: {
          zoneName: data.zoneName,
          abbreviation: data.abbreviation,
          gmtOffset: data.gmtOffset,
          gmtOffsetHours: offsetHours,
          formattedOffset: formattedOffset,
          dst: data.dst === 1,
          dstName: data.dst === 1 ? 'Daylight Saving Time' : 'Standard Time',
          countryCode: data.countryCode,
          countryName: data.countryName,
          regionName: data.regionName || null,
          timestamp: data.timestamp,
          formatted: data.formatted
        },
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
      logger.error('Historical Timezone Error:', error);
      return res.status(500).json({
        error: 'Failed to lookup historical timezone',
        details: error.message
      });
    }
  }),
};
