/**
 * Leonardo.ai Image Generation
 * Generates high-quality images using Leonardo.ai's Phoenix and other models
 *
 * Part of GENESIS - AI Visual Generation
 * Created: December 28, 2024
 */

const { onRequest } = require('firebase-functions/v2/https');

/**
 * Generate an image using Leonardo.ai API
 * Supports Phoenix, SDXL, and custom fine-tuned models
 */
exports.generateLeonardoImage = onRequest({
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 120,
  memory: '512MiB'
}, async (req, res) => {
  const apiKey = process.env.LEONARDO_API_KEY;
  if (!apiKey) {
    console.error('Leonardo.ai API key not configured');
    return res.status(500).json({ error: 'Leonardo.ai API key not configured' });
  }

  try {
    const {
      prompt,
      negativePrompt = '',
      model = 'phoenix', // phoenix, sdxl, anime, etc.
      width = 1024,
      height = 1024,
      numImages = 1,
      guidanceScale = 7,
      photoReal = false,
      alchemy = true, // Enhanced quality
      stylePreset = null // Optional style
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🎨 Generating Leonardo.ai image with ${model}:`, prompt.slice(0, 100));

    // Map model names to Leonardo model IDs
    const modelIds = {
      'phoenix': '6b645e3a-d64f-4341-a6d8-7a3690fbf042', // Leonardo Phoenix
      'sdxl': 'ac614f96-1082-45bf-be9d-757f2d31c174', // Leonardo SDXL
      'anime': 'e71a1c2f-4f80-4800-934f-2c68979d8cc8', // Leonardo Anime
      'creative': '1e60896f-3c26-4296-8ecc-53e2afecc132', // Leonardo Creative
      'diffusion': '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Diffusion XL
      'vision': 'b820ea11-02bf-4652-97ae-9ac0cc00593d', // Leonardo Vision XL
      'kino': 'aa77f04e-3eec-4034-9c07-d0f619684628' // Leonardo Kino XL
    };

    const selectedModelId = modelIds[model] || modelIds['phoenix'];

    // Step 1: Create generation job
    const createResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: negativePrompt || undefined,
        modelId: selectedModelId,
        width: width,
        height: height,
        num_images: numImages,
        guidance_scale: guidanceScale,
        photoReal: photoReal,
        alchemy: alchemy,
        presetStyle: stylePreset || undefined,
        public: false
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      console.error('❌ Leonardo.ai create error:', createResponse.status, errorData);
      throw new Error(`Leonardo.ai error: ${createResponse.status} - ${errorData.error || 'Unknown error'}`);
    }

    const createData = await createResponse.json();
    const generationId = createData.sdGenerationJob?.generationId;

    if (!generationId) {
      throw new Error('No generation ID returned');
    }

    console.log(`⏳ Leonardo.ai job created: ${generationId}`);

    // Step 2: Poll for completion (Leonardo is async)
    let attempts = 0;
    const maxAttempts = 30;
    let imageUrls = [];

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      attempts++;

      const statusResponse = await fetch(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!statusResponse.ok) {
        continue; // Retry on error
      }

      const statusData = await statusResponse.json();
      const generation = statusData.generations_by_pk;

      if (generation?.status === 'COMPLETE') {
        imageUrls = generation.generated_images?.map(img => img.url) || [];
        break;
      } else if (generation?.status === 'FAILED') {
        throw new Error('Leonardo.ai generation failed');
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('Generation timed out or no images generated');
    }

    console.log(`✅ Leonardo.ai generated ${imageUrls.length} image(s)`);

    return res.json({
      success: true,
      images: imageUrls,
      model: model,
      generationId: generationId,
      prompt: prompt
    });

  } catch (error) {
    console.error('❌ Leonardo.ai error:', error.message);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

/**
 * Get available Leonardo.ai models
 */
exports.getLeonardoModels = onRequest({
  cors: true,
  maxInstances: 5
}, async (req, res) => {
  const models = [
    { id: 'phoenix', name: 'Leonardo Phoenix', description: 'Best quality, most versatile' },
    { id: 'sdxl', name: 'Leonardo SDXL', description: 'Stable Diffusion XL variant' },
    { id: 'kino', name: 'Leonardo Kino XL', description: 'Cinematic and artistic' },
    { id: 'vision', name: 'Leonardo Vision XL', description: 'Photorealistic imagery' },
    { id: 'diffusion', name: 'Leonardo Diffusion XL', description: 'General purpose' },
    { id: 'anime', name: 'Leonardo Anime', description: 'Anime and manga style' },
    { id: 'creative', name: 'Leonardo Creative', description: 'Artistic and creative' }
  ];

  res.json({ models });
});

/**
 * Get Leonardo.ai user credits/usage
 */
exports.getLeonardoUsage = onRequest({
  cors: true,
  maxInstances: 5
}, async (req, res) => {
  const apiKey = process.env.LEONARDO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Leonardo.ai API key not configured' });
  }

  try {
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Leonardo.ai error: ${response.status}`);
    }

    const data = await response.json();
    const user = data.user_details?.[0];

    res.json({
      success: true,
      tokensRemaining: user?.apiConcurrencySlots || 0,
      subscriptionTokens: user?.subscriptionTokens || 0,
      apiSubscription: user?.apiSubscription || 'free'
    });

  } catch (error) {
    console.error('❌ Leonardo.ai usage error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});
