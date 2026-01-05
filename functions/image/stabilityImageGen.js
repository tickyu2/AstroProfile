/**
 * Stability.ai Image Generation
 * Generates images using Stable Diffusion 3 and SDXL models
 *
 * Part of GENESIS - AI Visual Generation
 * Created: December 28, 2024
 */

const { onRequest } = require('firebase-functions/v2/https');
const FormData = require('form-data');

/**
 * Generate an image using Stability.ai API
 * Supports SD3 Large, SD3 Medium, SDXL, and Stable Image Core
 */
exports.generateStabilityImage = onRequest({
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 120,
  memory: '512MiB'
}, async (req, res) => {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    console.error('Stability.ai API key not configured');
    return res.status(500).json({ error: 'Stability.ai API key not configured' });
  }

  try {
    const {
      prompt,
      negativePrompt = '',
      model = 'sd3-large', // sd3-large, sd3-medium, sdxl-1.0, stable-image-core
      aspectRatio = '1:1', // 1:1, 16:9, 9:16, 4:3, 3:4, etc.
      style = 'photographic', // photographic, anime, digital-art, cinematic, etc.
      seed = 0, // 0 = random
      outputFormat = 'webp' // webp, png, jpeg
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🎨 Generating Stability.ai image with ${model}:`, prompt.slice(0, 100));

    // Determine the correct API endpoint based on model
    let endpoint;
    let body;

    if (model === 'sd3-large' || model === 'sd3-medium') {
      // Stable Diffusion 3 API
      endpoint = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('model', model === 'sd3-large' ? 'sd3-large' : 'sd3-medium');
      formData.append('aspect_ratio', aspectRatio);
      formData.append('output_format', outputFormat);
      if (negativePrompt) formData.append('negative_prompt', negativePrompt);
      if (seed > 0) formData.append('seed', seed.toString());

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Stability.ai SD3 error:', response.status, errorText);
        throw new Error(`Stability.ai error: ${response.status} - ${errorText}`);
      }

      // Response is binary image data
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');

      console.log('✅ Stability.ai SD3 image generated');

      return res.json({
        success: true,
        image: base64Image,
        format: outputFormat,
        model: model,
        prompt: prompt
      });

    } else if (model === 'stable-image-core') {
      // Stable Image Core API (faster, more affordable)
      endpoint = 'https://api.stability.ai/v2beta/stable-image/generate/core';

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('aspect_ratio', aspectRatio);
      formData.append('output_format', outputFormat);
      formData.append('style_preset', style);
      if (negativePrompt) formData.append('negative_prompt', negativePrompt);
      if (seed > 0) formData.append('seed', seed.toString());

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'image/*',
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Stability.ai Core error:', response.status, errorText);
        throw new Error(`Stability.ai error: ${response.status} - ${errorText}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');

      console.log('✅ Stability.ai Core image generated');

      return res.json({
        success: true,
        image: base64Image,
        format: outputFormat,
        model: 'stable-image-core',
        prompt: prompt
      });

    } else {
      // SDXL 1.0 (Legacy API)
      endpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

      // Map aspect ratio to dimensions
      const dimensions = getSDXLDimensions(aspectRatio);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt, weight: 1 },
            ...(negativePrompt ? [{ text: negativePrompt, weight: -1 }] : [])
          ],
          cfg_scale: 7,
          height: dimensions.height,
          width: dimensions.width,
          samples: 1,
          steps: 30,
          style_preset: style,
          seed: seed || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Stability.ai SDXL error:', response.status, errorData);
        throw new Error(`Stability.ai error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const image = data.artifacts?.[0];

      if (!image) {
        throw new Error('No image generated');
      }

      console.log('✅ Stability.ai SDXL image generated');

      return res.json({
        success: true,
        image: image.base64,
        format: 'png',
        model: 'sdxl-1.0',
        prompt: prompt,
        seed: image.seed
      });
    }

  } catch (error) {
    console.error('❌ Stability.ai error:', error.message);
    return res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

/**
 * Map aspect ratio to SDXL dimensions
 */
function getSDXLDimensions(aspectRatio) {
  const dimensions = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '9:16': { width: 768, height: 1344 },
    '4:3': { width: 1152, height: 896 },
    '3:4': { width: 896, height: 1152 },
    '3:2': { width: 1216, height: 832 },
    '2:3': { width: 832, height: 1216 }
  };
  return dimensions[aspectRatio] || dimensions['1:1'];
}

/**
 * Get available style presets
 */
exports.getStabilityStyles = onRequest({
  cors: true,
  maxInstances: 5
}, async (req, res) => {
  const styles = [
    { id: 'photographic', name: 'Photographic', description: 'Photo-realistic imagery' },
    { id: 'digital-art', name: 'Digital Art', description: 'Digital artwork style' },
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-like visuals' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
    { id: 'fantasy-art', name: 'Fantasy Art', description: 'Fantasy illustration' },
    { id: '3d-model', name: '3D Model', description: '3D rendered look' },
    { id: 'neon-punk', name: 'Neon Punk', description: 'Cyberpunk neon aesthetics' },
    { id: 'origami', name: 'Origami', description: 'Paper folding art style' },
    { id: 'line-art', name: 'Line Art', description: 'Clean line drawings' },
    { id: 'pixel-art', name: 'Pixel Art', description: 'Retro pixel graphics' }
  ];

  res.json({ styles });
});
