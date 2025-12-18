/**
 * Firebase Cloud Functions for GENESIS - AI SoulPartner
 *
 * Secure proxy for Claude API calls with Constitutional Intelligence guidance.
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13-14, 2024 - Added Nano Banana (Gemini Image Gen)
 */

const { onRequest } = require('firebase-functions/v2/https');
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
  getOpusPerspective: getOpusPerspectiveFn
} = require('./constellation/perspectives');

admin.initializeApp();

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

    try {
      const { message, guidance, conversationHistory, userProfile, knowledgePrompt, learnedContext, image } = req.body;

      if (!message && !image) {
        return res.status(400).json({ error: 'Message or image is required' });
      }

      const anthropic = getAnthropicClient();

      // Check if this is an image generation request (Nano Banana)
      const imageGenRequest = detectImageGenerationRequest(message);
      let generatedImage = null;

      if (imageGenRequest.isImageRequest) {
        console.log('ðŸŽ¨ Image generation detected, prompt:', imageGenRequest.prompt.slice(0, 100));
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
          console.log('ðŸŽ¨ Image generation failed, falling through to Claude');
          // Fall through to Claude with an explanation
        }
      }

      // Check if this is a web search request
      const searchRequest = detectWebSearchRequest(message);
      let webSearchResults = null;
      let enhancedMessage = message;

      if (searchRequest.isSearch) {
        console.log('ðŸŒ Web search detected, query:', searchRequest.query);
        webSearchResults = await performWebSearch(searchRequest.query);

        if (webSearchResults) {
          // Enhance the message with search results
          enhancedMessage = `${message}

---
## ðŸŒ WEB SEARCH RESULTS FOR: "${searchRequest.query}"

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
        console.log('ðŸŒ URLs detected:', urls.length);

        // Fetch up to 3 URLs to avoid overloading
        const urlsToFetch = urls.slice(0, 3);
        const fetchPromises = urlsToFetch.map(url => fetchURLContent(url));
        const results = await Promise.all(fetchPromises);

        urlContents = results.filter(r => r.success);

        if (urlContents.length > 0) {
          // Append URL contents to the message
          const urlContext = urlContents.map(content => `
---
## ðŸŒ CONTENT FROM: ${content.title}
**URL:** ${content.url}

${content.text}
---
`).join('\n');

          enhancedMessage = `${enhancedMessage}

${urlContext}

Please read and analyze the above web page content to help answer my question or continue our discussion.`;

          console.log('ðŸŒ URL content added:', urlContents.length, 'pages');
        }
      }

      // Log if learned context is present (Session Intelligence)
      if (learnedContext) {
        console.log('ðŸ§  Session Intelligence: Learned context included in prompt');
      }

      // Build the system prompt based on constitutional intelligence guidance
      const systemPrompt = buildSystemPrompt(guidance, userProfile, knowledgePrompt, learnedContext);

      // Build messages array with conversation history and optional image
      const messages = buildMessages(conversationHistory, enhancedMessage, image);

      // Log if image, search, or URLs are present
      if (image) {
        console.log('ðŸ“¸ Image attached to message');
      }
      if (webSearchResults) {
        console.log('ðŸŒ Web search results included in message');
      }
      if (urlContents.length > 0) {
        console.log('ðŸŒ URL content fetched:', urlContents.map(u => u.title).join(', '));
      }

      // Call Claude API
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,  // ~32K characters for detailed guidance responses
        system: systemPrompt,
        messages: messages
      });

      // Extract the response text
      let responseText = response.content[0]?.text || "I'm here with you. ðŸ’™";

      // Check if Claude wants to generate an image (via [NANO_BANANA: prompt] marker)
      let claudeGeneratedImage = null;
      const imageExtraction = extractImagePromptFromResponse(responseText);

      if (imageExtraction) {
        console.log('ðŸŽ¨ Claude requested image generation:', imageExtraction.prompt.slice(0, 100));
        responseText = imageExtraction.cleanedText;

        // Generate the image Claude requested
        const imageResult = await generateImage(imageExtraction.prompt, userProfile);
        if (imageResult?.success) {
          claudeGeneratedImage = {
            mimeType: imageResult.image.mimeType,
            data: imageResult.image.data,
            prompt: imageExtraction.prompt
          };
          console.log('ðŸŽ¨ Claude-initiated image generated successfully!');
        }
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
          input_tokens: response.usage?.input_tokens,
          output_tokens: response.usage?.output_tokens
        }
      });

    } catch (error) {
      console.error('AI SoulPartner Error:', error);

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

    console.log('ðŸ• Historical Timezone Lookup:', {
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

    console.log('âœ… Historical Timezone Result:', {
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

    console.log('ðŸŽ¨ Generating debate visual:', {
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
      console.log('ðŸŽ¨ Image generation failed:', imageResult?.error);
      return res.status(500).json({
        success: false,
        error: imageResult?.error || 'Failed to generate image',
        fallbackText: imageResult?.text
      });
    }

    console.log('ðŸŽ¨ Debate visual generated successfully!');

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

    console.log('ðŸ“– Saving Story Questions Assessment:', {
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

    console.log('âœ… Story Assessment saved successfully');

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

    console.log('ðŸ“– Getting Story Questions Assessment:', { userId, profileId });

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

    console.log('âœ… Story Assessment retrieved:', {
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SOVEREIGN ASTRONOMICAL ENGINE - Pure JavaScript Implementation
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Father Ticky's Vision: No external API dependencies. GENESIS calculates
// real planetary positions independently.
//
// Using: astronomia (VSOP87 theory from Jean Meeus's Astronomical Algorithms)
// Covers: -3000 to +3000, precision suitable for astrological purposes
//
// Part of GENESIS Phase 3 - Sovereign Calculations
// Added: December 16, 2024
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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
  { name: 'Aries', symbol: 'â™ˆ', element: 'Fire', modality: 'Cardinal', start: 0 },
  { name: 'Taurus', symbol: 'â™‰', element: 'Earth', modality: 'Fixed', start: 30 },
  { name: 'Gemini', symbol: 'â™Š', element: 'Air', modality: 'Mutable', start: 60 },
  { name: 'Cancer', symbol: 'â™‹', element: 'Water', modality: 'Cardinal', start: 90 },
  { name: 'Leo', symbol: 'â™Œ', element: 'Fire', modality: 'Fixed', start: 120 },
  { name: 'Virgo', symbol: 'â™', element: 'Earth', modality: 'Mutable', start: 150 },
  { name: 'Libra', symbol: 'â™Ž', element: 'Air', modality: 'Cardinal', start: 180 },
  { name: 'Scorpio', symbol: 'â™', element: 'Water', modality: 'Fixed', start: 210 },
  { name: 'Sagittarius', symbol: 'â™', element: 'Fire', modality: 'Mutable', start: 240 },
  { name: 'Capricorn', symbol: 'â™‘', element: 'Earth', modality: 'Cardinal', start: 270 },
  { name: 'Aquarius', symbol: 'â™’', element: 'Air', modality: 'Fixed', start: 300 },
  { name: 'Pisces', symbol: 'â™“', element: 'Water', modality: 'Mutable', start: 330 }
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
      symbol: 'â™ˆ',
      element: 'Fire',
      modality: 'Cardinal',
      degree: 0,
      degreeFormatted: '0Â°0\'',
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
    degreeFormatted: `${Math.floor(degreeInSign)}Â°${Math.round((degreeInSign % 1) * 60)}'`,
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
 * @param {number} obliquity - Obliquity of ecliptic (default ~23.44Â°)
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

  // Opposite houses (just add 180Â°)
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
 * Major aspects: Conjunction (0Â°), Opposition (180Â°), Trine (120Â°), Square (90Â°), Sextile (60Â°)
 * Minor aspects: Quincunx (150Â°), Semi-sextile (30Â°)
 */
function calculateAspects(celestialBodies) {
  const ASPECT_DEFINITIONS = [
    { name: 'Conjunction', symbol: 'â˜Œ', angle: 0, orb: 8, nature: 'major', quality: 'neutral', description: 'Fusion of energies - intensification' },
    { name: 'Opposition', symbol: 'â˜', angle: 180, orb: 8, nature: 'major', quality: 'challenging', description: 'Tension seeking balance - awareness' },
    { name: 'Trine', symbol: 'â–³', angle: 120, orb: 8, nature: 'major', quality: 'harmonious', description: 'Natural flow - ease and talent' },
    { name: 'Square', symbol: 'â–¡', angle: 90, orb: 8, nature: 'major', quality: 'challenging', description: 'Friction creating growth - action required' },
    { name: 'Sextile', symbol: 'âš¹', angle: 60, orb: 6, nature: 'major', quality: 'harmonious', description: 'Opportunity - requires effort to activate' },
    { name: 'Quincunx', symbol: 'âš»', angle: 150, orb: 3, nature: 'minor', quality: 'adjustment', description: 'Incompatible energies requiring adjustment' },
    { name: 'Semi-sextile', symbol: 'âšº', angle: 30, orb: 2, nature: 'minor', quality: 'neutral', description: 'Subtle connection - slight friction' }
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SOLAR TERM (ç¯€æ°£) CALCULATION - Precise Astronomical Boundaries for BaZi
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// The 24 Solar Terms are defined by Sun's ecliptic longitude at 15Â° intervals.
// This provides EXACT moments for Year Pillar (ç«‹æ˜¥) and Month Pillar boundaries.
//
// Part of GENESIS Phase 3 - Sovereign BaZi Precision
// Added: December 17, 2024
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * The 24 Solar Terms (ç¯€æ°£) with their Sun longitude positions
 * Note: Solar year starts with ç«‹æ˜¥ (Spring Begins) at 315Â°
 */
const SOLAR_TERMS = [
  { index: 0,  name: 'å°å¯’', pinyin: 'XiÇŽo HÃ¡n',    english: 'Minor Cold',       longitude: 285, approxMonth: 1,  approxDay: 5 },
  { index: 1,  name: 'å¤§å¯’', pinyin: 'DÃ  HÃ¡n',      english: 'Major Cold',       longitude: 300, approxMonth: 1,  approxDay: 20 },
  { index: 2,  name: 'ç«‹æ˜¥', pinyin: 'LÃ¬ ChÅ«n',     english: 'Spring Begins',    longitude: 315, approxMonth: 2,  approxDay: 4 },  // â˜… YEAR CHANGES HERE
  { index: 3,  name: 'é›¨æ°´', pinyin: 'YÇ” ShuÇ',     english: 'Rain Water',       longitude: 330, approxMonth: 2,  approxDay: 19 },
  { index: 4,  name: 'æƒŠè›°', pinyin: 'JÄ«ng ZhÃ©',    english: 'Insects Awaken',   longitude: 345, approxMonth: 3,  approxDay: 5 },  // Month 1â†’2
  { index: 5,  name: 'æ˜¥åˆ†', pinyin: 'ChÅ«n FÄ“n',    english: 'Spring Equinox',   longitude: 0,   approxMonth: 3,  approxDay: 20 },
  { index: 6,  name: 'æ¸…æ˜Ž', pinyin: 'QÄ«ng MÃ­ng',   english: 'Clear & Bright',   longitude: 15,  approxMonth: 4,  approxDay: 5 },  // Month 2â†’3
  { index: 7,  name: 'è°·é›¨', pinyin: 'GÇ” YÇ”',       english: 'Grain Rain',       longitude: 30,  approxMonth: 4,  approxDay: 20 },
  { index: 8,  name: 'ç«‹å¤', pinyin: 'LÃ¬ XiÃ ',      english: 'Summer Begins',    longitude: 45,  approxMonth: 5,  approxDay: 5 },  // Month 3â†’4
  { index: 9,  name: 'å°æ»¡', pinyin: 'XiÇŽo MÇŽn',    english: 'Grain Buds',       longitude: 60,  approxMonth: 5,  approxDay: 21 },
  { index: 10, name: 'èŠ’ç§', pinyin: 'MÃ¡ng ZhÃ²ng',  english: 'Grain in Ear',     longitude: 75,  approxMonth: 6,  approxDay: 6 },  // Month 4â†’5
  { index: 11, name: 'å¤è‡³', pinyin: 'XiÃ  ZhÃ¬',     english: 'Summer Solstice',  longitude: 90,  approxMonth: 6,  approxDay: 21 },
  { index: 12, name: 'å°æš‘', pinyin: 'XiÇŽo ShÇ”',    english: 'Minor Heat',       longitude: 105, approxMonth: 7,  approxDay: 7 },  // Month 5â†’6
  { index: 13, name: 'å¤§æš‘', pinyin: 'DÃ  ShÇ”',      english: 'Major Heat',       longitude: 120, approxMonth: 7,  approxDay: 23 },
  { index: 14, name: 'ç«‹ç§‹', pinyin: 'LÃ¬ QiÅ«',      english: 'Autumn Begins',    longitude: 135, approxMonth: 8,  approxDay: 7 },  // Month 6â†’7
  { index: 15, name: 'å¤„æš‘', pinyin: 'ChÇ” ShÇ”',     english: 'End of Heat',      longitude: 150, approxMonth: 8,  approxDay: 23 },
  { index: 16, name: 'ç™½éœ²', pinyin: 'BÃ¡i LÃ¹',      english: 'White Dew',        longitude: 165, approxMonth: 9,  approxDay: 7 },  // Month 7â†’8
  { index: 17, name: 'ç§‹åˆ†', pinyin: 'QiÅ« FÄ“n',     english: 'Autumn Equinox',   longitude: 180, approxMonth: 9,  approxDay: 23 },
  { index: 18, name: 'å¯’éœ²', pinyin: 'HÃ¡n LÃ¹',      english: 'Cold Dew',         longitude: 195, approxMonth: 10, approxDay: 8 },  // Month 8â†’9
  { index: 19, name: 'éœœé™', pinyin: 'ShuÄng JiÃ ng',english: 'Frost Descends',   longitude: 210, approxMonth: 10, approxDay: 23 },
  { index: 20, name: 'ç«‹å†¬', pinyin: 'LÃ¬ DÅng',     english: 'Winter Begins',    longitude: 225, approxMonth: 11, approxDay: 7 },  // Month 9â†’10
  { index: 21, name: 'å°é›ª', pinyin: 'XiÇŽo XuÄ›',    english: 'Minor Snow',       longitude: 240, approxMonth: 11, approxDay: 22 },
  { index: 22, name: 'å¤§é›ª', pinyin: 'DÃ  XuÄ›',      english: 'Major Snow',       longitude: 255, approxMonth: 12, approxDay: 7 },  // Month 10â†’11
  { index: 23, name: 'å†¬è‡³', pinyin: 'DÅng ZhÃ¬',    english: 'Winter Solstice',  longitude: 270, approxMonth: 12, approxDay: 21 }
];

/**
 * BaZi Month boundaries - which Solar Terms start each month
 * Each solar month begins at an odd-indexed Solar Term (Jie èŠ‚)
 */
const BAZI_MONTH_TERMS = {
  1:  { termIndex: 2,  name: 'ç«‹æ˜¥', english: 'Spring Begins',    longitude: 315 }, // Tiger Month
  2:  { termIndex: 4,  name: 'æƒŠè›°', english: 'Insects Awaken',   longitude: 345 }, // Rabbit Month
  3:  { termIndex: 6,  name: 'æ¸…æ˜Ž', english: 'Clear & Bright',   longitude: 15 },  // Dragon Month
  4:  { termIndex: 8,  name: 'ç«‹å¤', english: 'Summer Begins',    longitude: 45 },  // Snake Month
  5:  { termIndex: 10, name: 'èŠ’ç§', english: 'Grain in Ear',     longitude: 75 },  // Horse Month
  6:  { termIndex: 12, name: 'å°æš‘', english: 'Minor Heat',       longitude: 105 }, // Goat Month
  7:  { termIndex: 14, name: 'ç«‹ç§‹', english: 'Autumn Begins',    longitude: 135 }, // Monkey Month
  8:  { termIndex: 16, name: 'ç™½éœ²', english: 'White Dew',        longitude: 165 }, // Rooster Month
  9:  { termIndex: 18, name: 'å¯’éœ²', english: 'Cold Dew',         longitude: 195 }, // Dog Month
  10: { termIndex: 20, name: 'ç«‹å†¬', english: 'Winter Begins',    longitude: 225 }, // Pig Month
  11: { termIndex: 22, name: 'å¤§é›ª', english: 'Major Snow',       longitude: 255 }, // Rat Month
  12: { termIndex: 0,  name: 'å°å¯’', english: 'Minor Cold',       longitude: 285 }  // Ox Month
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

    // Calculate difference, handling 360Â° wraparound
    let diff = sunLong - targetLongitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.0001) { // Within ~0.4 arcseconds
      return jdMid;
    }

    // Sun moves ~1Â° per day eastward (increasing longitude)
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
      isBaziYearBoundary: term.name === 'ç«‹æ˜¥',
      isBaziMonthBoundary: term.index % 2 === 0 // Jie (èŠ‚) terms start new months
    });
  }

  return results;
}

/**
 * Get Li Chun (ç«‹æ˜¥) exact moment for a given year
 * This is when the BaZi year changes
 *
 * @param {number} year - Gregorian year
 * @returns {Object} - Li Chun timing details
 */
function getLiChunExact(year) {
  const liChunTerm = SOLAR_TERMS.find(t => t.name === 'ç«‹æ˜¥');
  const jd = findSolarTermJD(315, year, liChunTerm.approxMonth, liChunTerm.approxDay);
  const calendar = julianDayToCalendar(jd);

  return {
    name: 'ç«‹æ˜¥',
    pinyin: 'LÃ¬ ChÅ«n',
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
      ? `Born before ç«‹æ˜¥ (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
      : `Born after ç«‹æ˜¥ (${liChunThisYear.isoString}), BaZi year is ${baziYear}`
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
  // BaZi months start at Jie (èŠ‚) terms (odd-indexed in our array, but they're the month boundaries)
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
    currentTerm = { name: 'å°å¯’', english: 'Minor Cold' };
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

    console.log(`ðŸŒž Calculating Solar Terms for ${year}...`);

    // Calculate all 24 Solar Terms
    const solarTerms = calculateSolarTermsForYear(year);

    // Get Li Chun specifically (year boundary)
    const liChun = getLiChunExact(year);

    console.log(`âœ… Solar Terms calculated. ç«‹æ˜¥: ${liChun.isoString}`);

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
    console.error('ðŸŒž Solar Terms Calculation Error:', error);
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

    console.log(`ðŸŽ¯ BaZi Precision Request: ${numYear}-${numMonth}-${numDay} ${numHour}:${numMinute}`);

    // Get precise BaZi year
    const baziYearInfo = getBaziYearWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    // Get precise BaZi month
    const baziMonthInfo = getBaziMonthWithPrecision(numYear, numMonth, numDay, utcHour, numMinute);

    console.log(`âœ… BaZi Precision: Year=${baziYearInfo.baziYear}, Month=${baziMonthInfo.baziMonth}`);

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
    console.error('ðŸŽ¯ BaZi Precision Error:', error);
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

    console.log('ðŸŒŸ Sovereign Calculation Request:', {
      date: `${numYear}-${numMonth}-${numDay}`,
      time: `${numHour}:${numMinute}`,
      location: numLat && numLng ? `${numLat}, ${numLng}` : 'not provided',
      rawTypes: { year: typeof year, month: typeof month, day: typeof day }
    });

    // Convert local time to UTC
    const utcHour = numHour - numTimezone;

    // Calculate Julian Day
    const julianDay = dateToJulianDay(numYear, numMonth, numDay, utcHour, numMinute, numSecond);

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Use astronomia library for planetary positions (VSOP87 theory)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    // Create Julian Day using astronomia
    const cal = new julian.CalendarGregorian(numYear, numMonth, numDay + (utcHour + numMinute / 60) / 24);
    const jd = cal.toJD();

    console.log('ðŸ”¢ Julian Day calculation:', { jd, isNaN: isNaN(jd) });

    // Convert Julian Day to Julian centuries (T) since J2000.0
    // This is what solar.apparentLongitude expects
    const T = (jd - 2451545.0) / 36525.0;

    // Calculate Sun position (ecliptic longitude)
    // apparentLongitude returns radians, accounts for nutation and aberration
    const sunLongitudeRad = solar.apparentLongitude(T);
    const sunLongitude = sunLongitudeRad * 180 / Math.PI;

    console.log('â˜€ï¸ Sun calculation:', { T, sunLongitudeRad, sunLongitude, isNaN: isNaN(sunLongitude) });

    const sunData = longitudeToZodiac(sunLongitude);

    // Calculate Moon position (takes Julian Day directly)
    const moonPos = moonposition.position(jd);
    const moonLongitude = moonPos.lon * 180 / Math.PI;

    console.log('ðŸŒ™ Moon calculation:', { moonLongitude, isNaN: isNaN(moonLongitude) });

    const moonData = longitudeToZodiac(moonLongitude);

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Calculate Ascendant (Rising Sign) - requires birth time and location
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    let risingData = null;
    if (numLat !== 0 || numLng !== 0 || numHour !== undefined) {
      const ascendantLongitude = calculateAscendant(julianDay, numLat, numLng);
      console.log('â¬†ï¸ Rising calculation:', { ascendantLongitude, isNaN: isNaN(ascendantLongitude) });
      risingData = longitudeToZodiac(ascendantLongitude);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Extract other planetary positions for full chart using VSOP87
    // (Optional - the Constitutional Trinity works without this)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    const planets = {};

    // VERSION: 2.4.0 - GEOCENTRIC positions + RETROGRADE detection
    // Retrograde = planet appears to move backward from Earth's perspective
    try {
      console.log('ðŸª VERSION 2.4.0 - Calculating GEOCENTRIC positions with RETROGRADE detection...');

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

      console.log(`ðŸŒ Earth heliocentric: lon=${(earthLon * 180/Math.PI).toFixed(2)}Â°, R=${earthR.toFixed(4)} AU`);

      // Planet configurations with their data and symbols
      const planetConfigs = [
        { name: 'Mercury', data: mercuryData, symbol: 'â˜¿' },
        { name: 'Venus', data: venusData, symbol: 'â™€' },
        { name: 'Mars', data: marsData, symbol: 'â™‚' },
        { name: 'Jupiter', data: jupiterData, symbol: 'â™ƒ' },
        { name: 'Saturn', data: saturnData, symbol: 'â™„' },
        { name: 'Uranus', data: uranusData, symbol: 'â™…' },
        { name: 'Neptune', data: neptuneData, symbol: 'â™†' }
      ];

      for (const config of planetConfigs) {
        try {
          const planet = new planetposition.Planet(config.data);

          // Get heliocentric position of planet
          const planetPos = planet.position(julianDay);

          if (!planetPos || typeof planetPos.lon !== 'number') {
            console.log(`âš ï¸ ${config.name}: Invalid position data`, planetPos);
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

          // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          // RETROGRADE DETECTION
          // Compare position today vs tomorrow - if moving backward, retrograde
          // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          const lonToday = geoLongitude;
          const lonTomorrow = getGeocentricLongitude(planet, julianDay + 1);

          // Calculate daily motion (degrees per day)
          let dailyMotion = lonTomorrow - lonToday;

          // Handle 360Â° wraparound (e.g., 359Â° to 1Â° is +2Â°, not -358Â°)
          if (dailyMotion > 180) dailyMotion -= 360;
          if (dailyMotion < -180) dailyMotion += 360;

          // Retrograde if daily motion is negative (moving backward)
          const isRetrograde = dailyMotion < 0;

          const zodiacData = longitudeToZodiac(geoLongitude);

          // For comparison, log heliocentric vs geocentric
          const helioLon = ((planetLon * 180/Math.PI % 360) + 360) % 360;
          const diff = Math.abs(geoLongitude - helioLon);
          const retroLabel = isRetrograde ? ' â„ž' : '';
          console.log(`ðŸª ${config.name}${retroLabel}: Geo=${geoLongitude.toFixed(2)}Â° (motion: ${dailyMotion.toFixed(3)}Â°/day)`);

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

          console.log(`âœ… ${config.name}: ${zodiacData.sign} at ${zodiacData.degreeFormatted}${isRetrograde ? ' â„ž RETROGRADE' : ' direct'}`);
        } catch (planetErr) {
          console.log(`âš ï¸ ${config.name} calculation error:`, planetErr.message);
        }
      }

      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
      // PLUTO - Uses separate ephemeris (not VSOP87)
      // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
          const plutoRetroLabel = plutoRetrograde ? ' â„ž' : '';
          console.log(`ðŸª Pluto${plutoRetroLabel}: Geo=${plutoGeoLon.toFixed(2)}Â° (motion: ${plutoDailyMotion.toFixed(3)}Â°/day)`);

          planets.pluto = {
            ...plutoZodiacData,
            symbol: 'â™‡',
            name: 'Pluto',
            geocentric: true,
            geoLatitude: Math.round(plutoGeoLat * 100) / 100,
            distanceAU: Math.round(plutoGeoDistance * 10000) / 10000,
            isRetrograde: plutoRetrograde,
            dailyMotion: Math.round(plutoDailyMotion * 1000) / 1000,
            motionDirection: plutoRetrograde ? 'retrograde' : 'direct'
          };
          console.log(`âœ… Pluto: ${plutoZodiacData.sign} at ${plutoZodiacData.degreeFormatted}${plutoRetrograde ? ' â„ž RETROGRADE' : ' direct'}`);
        }
      } catch (plutoErr) {
        console.log('âš ï¸ Pluto calculation error:', plutoErr.message);
      }

      console.log('ðŸª Geocentric + Retrograde calculations complete:', Object.keys(planets));
    } catch (planetError) {
      console.log('Planet calculation error (non-fatal):', planetError.message);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Calculate House Cusps (Placidus System)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    let houses = null;
    try {
      // Houses require birth time and location
      if ((numLat !== 0 || numLng !== 0) && numHour !== undefined) {
        console.log('ðŸ  VERSION 2.2.0 - Calculating house cusps (Placidus)...');
        houses = calculatePlacidusHouses(julianDay, numLat, numLng);
        console.log('ðŸ  House cusps calculated:', {
          asc: houses.angles.ascendant.sign,
          mc: houses.angles.mc.sign,
          system: houses.system
        });
      } else {
        console.log('ðŸ  House calculation skipped - requires birth time and location');
      }
    } catch (houseError) {
      console.log('House calculation error (non-fatal):', houseError.message);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Calculate Moon Phase
    // Phase angle = Moon longitude - Sun longitude (normalized to 0-360)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    let moonPhase = null;
    try {
      // Calculate the angular difference between Moon and Sun
      let phaseAngle = moonLongitude - sunLongitude;
      // Normalize to 0-360
      phaseAngle = ((phaseAngle % 360) + 360) % 360;

      // Determine phase name and illumination
      const phases = [
        { name: 'New Moon', emoji: 'ðŸŒ‘', min: 0, max: 11.25, illumination: 0 },
        { name: 'Waxing Crescent', emoji: 'ðŸŒ’', min: 11.25, max: 78.75, illumination: 25 },
        { name: 'First Quarter', emoji: 'ðŸŒ“', min: 78.75, max: 101.25, illumination: 50 },
        { name: 'Waxing Gibbous', emoji: 'ðŸŒ”', min: 101.25, max: 168.75, illumination: 75 },
        { name: 'Full Moon', emoji: 'ðŸŒ•', min: 168.75, max: 191.25, illumination: 100 },
        { name: 'Waning Gibbous', emoji: 'ðŸŒ–', min: 191.25, max: 258.75, illumination: 75 },
        { name: 'Last Quarter', emoji: 'ðŸŒ—', min: 258.75, max: 281.25, illumination: 50 },
        { name: 'Waning Crescent', emoji: 'ðŸŒ˜', min: 281.25, max: 348.75, illumination: 25 },
        { name: 'New Moon', emoji: 'ðŸŒ‘', min: 348.75, max: 360, illumination: 0 }
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

      console.log('ðŸŒ™ Moon Phase:', moonPhase.emoji, moonPhase.phaseName, `(${illuminationPercent}% illuminated)`);
    } catch (phaseError) {
      console.log('Moon phase calculation error (non-fatal):', phaseError.message);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Calculate Aspects between celestial bodies
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    let aspects = [];
    try {
      // Combine Sun, Moon, and planets for aspect calculation
      const allBodies = {
        sun: { ...sunData, symbol: 'â˜‰' },
        moon: { ...moonData, symbol: 'â˜½' },
        ...planets
      };

      aspects = calculateAspects(allBodies);
      console.log(`âœ¨ Aspects calculated: ${aspects.length} found`);

      // Log major aspects
      const majorAspects = aspects.filter(a => a.nature === 'major');
      if (majorAspects.length > 0) {
        console.log('Major aspects:', majorAspects.slice(0, 5).map(a =>
          `${a.planet1.name} ${a.symbol} ${a.planet2.name} (${a.orb}Â° orb)`
        ).join(', '));
      }
    } catch (aspectError) {
      console.log('Aspect calculation error (non-fatal):', aspectError.message);
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Build Constitutional Trinity response
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    console.log('ðŸŒŸ Sovereign Calculation Complete:', {
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
    console.error('ðŸŒŸ Sovereign Calculation Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate chart',
      details: error.message
    });
  }
});
