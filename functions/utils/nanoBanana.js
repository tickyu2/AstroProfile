/**
 * Nano Banana Integration (Google Gemini Image Generation)
 * Provides AI image generation capabilities for AI SoulPartner
 *
 * Models:
 * - Standard: gemini-2.0-flash-exp (~1K resolution, fast)
 * - Pro: imagen-3.0-generate-001 (higher quality, up to 4K)
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Modularized: December 17, 2024
 * Updated: December 17, 2024 - Added Pro/4K support
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Available models (tested December 2024)
const MODELS = {
  STANDARD: 'gemini-2.0-flash-exp',       // Fast, reliable, good quality (~2MB output)
  PRO: 'gemini-3-pro-image-preview'       // Pro model for 4K (~1.7MB output)
  // 'imagen-3.0-generate-001'            // Not available (404)
};

/**
 * Detect if user is asking for image generation
 * NOTE: Only trigger on EXPLICIT requests to avoid intercepting normal conversation
 */
function detectImageGenerationRequest(message) {
  if (!message) return { isImageRequest: false };

  // EXPLICIT triggers only
  // Users must use 🎨 emoji OR say "generate image" / "create image" explicitly
  const explicitPatterns = [
    /🎨/,  // Art emoji - explicit trigger
    /(?:generate|create)\s+(?:an?\s+)?image\s+of/i,  // "generate an image of..."
    /(?:generate|create)\s+(?:an?\s+)?(?:image|picture)\s*:/i,  // "generate image: ..."
    /nano\s*banana/i,  // Direct invocation
    /nano\s*banana\s*pro/i,  // Pro mode
    /4k\s*(?:image|art|generate)/i  // 4K request
  ];

  // Detect if Pro/4K mode requested
  const isProMode = /(?:nano\s*banana\s*pro|4k|ultra|high\s*res|high\s*definition)/i.test(message);

  for (const pattern of explicitPatterns) {
    if (pattern.test(message)) {
      // Extract prompt
      let imagePrompt = message
        .replace(/🎨/g, '')
        .replace(/nano\s*banana:?\s*/i, '')
        .replace(/(?:generate|create)\s+(?:an?\s+)?(?:image|picture)\s*(?:of|:)?\s*/i, '')
        .trim();

      if (imagePrompt.length < 5) {
        imagePrompt = message;
      }

      return {
        isImageRequest: true,
        prompt: imagePrompt,
        proMode: isProMode
      };
    }
  }

  return { isImageRequest: false, proMode: false };
}

/**
 * Detect if Claude's response contains an image generation request
 * Claude can include [NANO_BANANA: prompt] to trigger image generation
 */
function extractImagePromptFromResponse(responseText) {
  if (!responseText) return null;

  // Match [NANO_BANANA: ...] pattern
  const match = responseText.match(/\[NANO_BANANA:\s*([^\]]+)\]/i);
  if (match) {
    return {
      prompt: match[1].trim(),
      cleanedText: responseText.replace(/\[NANO_BANANA:\s*[^\]]+\]/gi, '').trim()
    };
  }

  return null;
}

/**
 * Generate image using Gemini with native image generation
 * @param {string} prompt - Image generation prompt
 * @param {Object} userProfile - User profile for constitutional context
 * @param {number} retryCount - Current retry attempt
 * @param {boolean} proMode - Use Pro/4K mode for higher resolution
 * @returns {Object} - { success, image?, description?, error?, model? }
 */
async function generateImage(prompt, userProfile = {}, retryCount = 0, proMode = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  const MAX_RETRIES = 2;

  if (!apiKey) {
    console.warn('⚠️ Gemini API key not configured');
    return null;
  }

  try {
    const modeLabel = proMode ? 'Nano Banana PRO 4K' : 'Nano Banana';
    console.log(`🎨 Generating image with ${modeLabel} (attempt ${retryCount + 1}):`, prompt.slice(0, 100));

    // Enhance prompt with constitutional context if available
    let enhancedPrompt = prompt;
    const constitution = userProfile?.constitutional;
    if (constitution?.chinese?.animal || constitution?.western?.sun) {
      const zodiacContext = [
        constitution?.chinese?.fullSign || `${constitution?.chinese?.element || ''} ${constitution?.chinese?.animal || ''}`.trim(),
        constitution?.western?.sun
      ].filter(Boolean).join(', ');

      if (zodiacContext) {
        enhancedPrompt = `${prompt}. Style: incorporate subtle ${zodiacContext} energy and aesthetic.`;
      }
    }

    // Add instruction to generate image
    // For Pro mode, add quality keywords to prompt
    let imagePrompt = `Generate an image: ${enhancedPrompt}`;
    if (proMode) {
      imagePrompt = `Generate a high resolution, ultra detailed, 4K quality image: ${enhancedPrompt}. Hyperdetailed, sharp focus, professional quality.`;
    }
    console.log('🎨 Image prompt:', imagePrompt.slice(0, 150));

    // Select model based on mode
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelId = proMode ? MODELS.PRO : MODELS.STANDARD;

    console.log(`🎨 Using model: ${modelId}, Pro mode: ${proMode}`);

    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });

    const result = await model.generateContent(imagePrompt);
    const response = result.response;

    console.log('🎨 Gemini response received');

    // Extract image from response parts
    let imageData = null;
    let textResponse = '';

    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          imageData = {
            mimeType: part.inlineData.mimeType || 'image/png',
            data: part.inlineData.data
          };
          console.log('🎨 Found image in response!');
        } else if (part.text) {
          textResponse = part.text;
        }
      }
    }

    if (imageData) {
      console.log(`🎨 Image generated successfully with ${modelId}!`);
      return {
        success: true,
        image: imageData,
        description: textResponse || `Generated image: ${prompt.slice(0, 50)}...`,
        model: modelId,
        proMode: proMode
      };
    } else {
      console.log('🎨 No image in response, text only:', textResponse?.slice(0, 200));
      return {
        success: false,
        error: 'Model did not return an image',
        text: textResponse
      };
    }

  } catch (error) {
    console.error('🎨 Nano Banana error:', error.message);

    // Retry on rate limit or transient errors
    const isRetryable = error.message?.includes('429') ||
                        error.message?.includes('rate') ||
                        error.message?.includes('Resource exhausted') ||
                        error.message?.includes('RESOURCE_EXHAUSTED') ||
                        error.message?.includes('quota');

    if (isRetryable && retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s exponential backoff
      console.log(`🎨 Rate limited, retrying in ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateImage(prompt, userProfile, retryCount + 1, proMode);
    }

    // If Pro mode failed with model error, fall back to standard model
    if (proMode && (error.message?.includes('not found') || error.message?.includes('not supported') || error.message?.includes('404'))) {
      console.log(`🎨 Pro model (${MODELS.PRO}) not available, falling back to ${MODELS.STANDARD}...`);
      return generateImage(prompt, userProfile, 0, false);
    }

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate high-resolution (4K) image using Pro mode
 * Convenience wrapper for generateImage with proMode=true
 */
async function generateImagePro(prompt, userProfile = {}) {
  return generateImage(prompt, userProfile, 0, true);
}

module.exports = {
  detectImageGenerationRequest,
  extractImagePromptFromResponse,
  generateImage,
  generateImagePro,
  MODELS
};
