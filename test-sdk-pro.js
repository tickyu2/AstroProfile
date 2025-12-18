// Test SDK with both models
require('dotenv').config({ path: 'functions/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const models = ['gemini-2.0-flash-exp', 'gemini-3-pro-image-preview'];
  const prompt = "Generate an image: Prague stained glass ceiling, Mucha style, Art Nouveau";

  for (const modelId of models) {
    console.log(`\n=== Testing ${modelId} via SDK ===`);
    try {
      const model = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;

      let hasImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            hasImage = true;
            const sizeKB = Math.round(part.inlineData.data.length / 1024);
            console.log(`SUCCESS: Image generated (${sizeKB}KB base64)`);
          } else if (part.text) {
            console.log(`Text response: ${part.text.slice(0, 100)}...`);
          }
        }
      }
      if (!hasImage) {
        console.log('No image in response');
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }
}

test();
