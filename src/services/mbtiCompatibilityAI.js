/**
 * mbtiCompatibilityAI.js
 * AI-Powered MBTI Compatibility Intelligence Engine
 * 
 * Pure Gold Method Architecture:
 * - Generate insights on-demand (first request)
 * - Cache in Firebase for instant retrieval (subsequent requests)
 * - Control flag for prompt evolution and regeneration
 * - Version tracking for algorithm improvements
 * 
 * Built with SOUL for scaling to infinity 🚀
 */

import { ref, get, set, update } from 'firebase/database';
import { database } from '../config/firebase';
import { callClaudeProxy } from './llmProxyService';

// ════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════

const PROMPT_VERSION = "1.0.0";  // Increment when prompt changes
const MAX_RETRIES = 3;
// API calls now go through server-side llmProxy Cloud Function

// Simple hash function for prompt fingerprinting
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// ════════════════════════════════════════════════════
// PROMPT ENGINEERING
// ════════════════════════════════════════════════════

function buildSystemPrompt() {
  return `You are a GENESIS Constitutional AI - an expert in MBTI personality compatibility analysis.

Your role: Generate deep, insightful compatibility analysis between two MBTI types that reveals:
1. Natural strengths of this pairing
2. Potential challenges and how to navigate them
3. Growth opportunities for each person
4. Communication strategies for harmony
5. A beautiful metaphor that captures their dynamic

Analysis Philosophy:
- Focus on POTENTIAL, not limitations
- Every pairing has unique gifts to offer
- Challenges are opportunities for growth
- Compatibility is about understanding, not matching
- Use the "Cosmic Magnetic Harmonic Resonance" framework

Output Format: JSON with this structure:
{
  "overallCompatibility": 75,
  "analysis": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "challenges": ["challenge 1", "challenge 2"],
    "growthAreas": {
      "typeA": ["growth area 1", "growth area 2"],
      "typeB": ["growth area 1", "growth area 2"]
    },
    "communicationStyle": "paragraph describing how these types communicate best",
    "magneticDynamic": "paragraph describing their attraction/repulsion forces"
  },
  "metaphor": {
    "title": "The [Metaphor Name]",
    "description": "2-3 sentences painting a vivid picture of their relationship dynamic",
    "visual": "Brief description for visual representation"
  },
  "advice": {
    "forTypeA": "2-3 sentences of wisdom for type A",
    "forTypeB": "2-3 sentences of wisdom for type B"
  }
}

Be poetic, be wise, be practical. This is soul-level analysis.`;
}

function buildUserPrompt(typeA, typeB) {
  return `Analyze the compatibility between ${typeA} and ${typeB}.

Type A: ${typeA}
Type B: ${typeB}

Provide comprehensive compatibility analysis in the JSON format specified.`;
}

// ════════════════════════════════════════════════════
// FIREBASE CACHING LAYER
// ════════════════════════════════════════════════════

/**
 * Generate a normalized pair key (always alphabetical order)
 * ISTJ-ENFP and ENFP-ISTJ both become "ENFP-ISTJ"
 */
function generatePairKey(typeA, typeB) {
  const sorted = [typeA, typeB].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

/**
 * Check if cached insight exists and is current
 */
async function getCachedInsight(typeA, typeB) {
  const pairKey = generatePairKey(typeA, typeB);
  const insightRef = ref(database, `compatibilityInsights/${pairKey}`);
  
  try {
    const snapshot = await get(insightRef);
    
    if (!snapshot.exists()) {
      return null; // No cache
    }
    
    const cached = snapshot.val();
    
    // Check if force regenerate flag is set
    if (cached.forceRegenerate === true) {
      console.log(`🔄 Force regenerate flag set for ${pairKey}`);
      return null; // Treat as cache miss
    }
    
    // Check if prompt version matches
    const currentPromptHash = hashString(buildSystemPrompt() + buildUserPrompt(typeA, typeB));
    
    if (cached.meta?.promptHash !== currentPromptHash) {
      console.log(`⚠️ Prompt changed for ${pairKey}, cache outdated`);
      return null; // Prompt changed, regenerate
    }
    
    console.log(`✅ Cache hit for ${pairKey}`);
    return cached;
    
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Save generated insight to Firebase
 */
async function cacheInsight(typeA, typeB, insights, tokenUsage) {
  const pairKey = generatePairKey(typeA, typeB);
  const insightRef = ref(database, `compatibilityInsights/${pairKey}`);
  
  const promptHash = hashString(buildSystemPrompt() + buildUserPrompt(typeA, typeB));
  
  const cacheData = {
    meta: {
      version: PROMPT_VERSION,
      generatedAt: Date.now(),
      promptHash: promptHash,
      tokenUsage: tokenUsage || { input: 0, output: 0, total: 0 }
    },
    forceRegenerate: false,  // Reset flag after regeneration
    types: {
      typeA: typeA,
      typeB: typeB,
      pairKey: pairKey
    },
    insights: insights
  };
  
  try {
    await set(insightRef, cacheData);
    console.log(`💾 Cached insights for ${pairKey}`);
    return true;
  } catch (error) {
    console.error('Error caching insights:', error);
    return false;
  }
}

/**
 * Set the force regenerate flag for a specific pair
 */
export async function setForceRegenerate(typeA, typeB, value = true) {
  const pairKey = generatePairKey(typeA, typeB);
  const flagRef = ref(database, `compatibilityInsights/${pairKey}/forceRegenerate`);
  
  try {
    await set(flagRef, value);
    console.log(`🎯 Force regenerate ${value ? 'enabled' : 'disabled'} for ${pairKey}`);
    return true;
  } catch (error) {
    console.error('Error setting force regenerate flag:', error);
    return false;
  }
}

/**
 * Set force regenerate for ALL pairs (when prompt fundamentally changes)
 */
export async function setForceRegenerateAll(value = true) {
  const insightsRef = ref(database, 'compatibilityInsights');
  
  try {
    const snapshot = await get(insightsRef);
    
    if (!snapshot.exists()) {
      console.log('No cached insights to update');
      return true;
    }
    
    const updates = {};
    const data = snapshot.val();
    
    Object.keys(data).forEach(pairKey => {
      updates[`compatibilityInsights/${pairKey}/forceRegenerate`] = value;
    });
    
    await update(ref(database), updates);
    console.log(`🎯 Force regenerate ${value ? 'enabled' : 'disabled'} for ALL pairs`);
    return true;
    
  } catch (error) {
    console.error('Error setting force regenerate all:', error);
    return false;
  }
}

// ════════════════════════════════════════════════════
// AI GENERATION ENGINE
// ════════════════════════════════════════════════════

/**
 * Generate insights via server-side llmProxy Cloud Function
 */
async function generateInsightsFromAI(typeA, typeB) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(typeA, typeB);

  try {
    const result = await callClaudeProxy({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const tokenUsage = {
      input: 0,
      output: result.tokens || 0,
      total: result.tokens || 0
    };

    const insights = JSON.parse(result.text || '{}');

    return { insights, tokenUsage };

  } catch (error) {
    console.error('Error generating insights from AI:', error);
    throw error;
  }
}

/**
 * Retry logic for AI generation
 */
async function generateWithRetry(typeA, typeB, retries = MAX_RETRIES) {
  let lastError = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const result = await generateInsightsFromAI(typeA, typeB);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1}/${retries} failed:`, error.message);
      
      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

// ════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════

/**
 * Main function: Get compatibility insights (cached or generated)
 * 
 * Flow:
 * 1. Check cache
 * 2. If cache hit → return immediately
 * 3. If cache miss → generate from AI
 * 4. Cache the result
 * 5. Return insights
 */
export async function getCompatibilityInsights(typeA, typeB) {
  console.log(`🔍 Fetching compatibility: ${typeA} + ${typeB}`);
  
  // Step 1: Check cache
  const cached = await getCachedInsight(typeA, typeB);
  
  if (cached) {
    return {
      insights: cached.insights,
      source: 'cache',
      meta: cached.meta,
      fromCache: true
    };
  }
  
  // Step 2: Generate from AI
  console.log(`🤖 Generating new insights for ${typeA} + ${typeB}`);
  
  try {
    const { insights, tokenUsage } = await generateWithRetry(typeA, typeB);
    
    // Step 3: Cache for future use
    await cacheInsight(typeA, typeB, insights, tokenUsage);
    
    // Step 4: Return fresh insights
    return {
      insights: insights,
      source: 'ai',
      meta: {
        version: PROMPT_VERSION,
        generatedAt: Date.now(),
        tokenUsage: tokenUsage
      },
      fromCache: false
    };
    
  } catch (error) {
    console.error('Failed to generate insights:', error);
    
    // Fallback to basic compatibility (better than nothing)
    return {
      insights: generateFallbackInsights(typeA, typeB),
      source: 'fallback',
      error: error.message,
      fromCache: false
    };
  }
}

/**
 * Fallback insights when AI fails (basic, rule-based)
 */
function generateFallbackInsights(typeA, typeB) {
  return {
    overallCompatibility: 70,
    analysis: {
      strengths: [
        "Each type brings unique perspective",
        "Opportunity for growth through differences",
        "Potential for complementary skills"
      ],
      challenges: [
        "May need to work on understanding communication styles",
        "Different approaches to decision-making"
      ],
      growthAreas: {
        typeA: ["Explore flexibility", "Practice empathy"],
        typeB: ["Develop patience", "Embrace structure"]
      },
      communicationStyle: "This pairing requires conscious effort to bridge communication differences.",
      magneticDynamic: "A dynamic that can create both attraction and friction, depending on awareness."
    },
    metaphor: {
      title: "The Learning Dance",
      description: "Two dancers learning each other's rhythms, sometimes stepping on toes, but always growing together.",
      visual: "Two figures in motion, finding harmony"
    },
    advice: {
      forTypeA: "Stay curious about your partner's different approach to life.",
      forTypeB: "Appreciate the stability and perspective your partner provides."
    }
  };
}

// ════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  const insightsRef = ref(database, 'compatibilityInsights');
  
  try {
    const snapshot = await get(insightsRef);
    
    if (!snapshot.exists()) {
      return {
        totalCached: 0,
        totalPossible: 256,
        coveragePercent: 0,
        totalTokensUsed: 0
      };
    }
    
    const data = snapshot.val();
    const pairs = Object.keys(data);
    
    let totalTokens = 0;
    let outdatedCount = 0;
    
    pairs.forEach(pairKey => {
      const insight = data[pairKey];
      totalTokens += insight.meta?.tokenUsage?.total || 0;
      
      if (insight.forceRegenerate === true) {
        outdatedCount++;
      }
    });
    
    return {
      totalCached: pairs.length,
      totalPossible: 256,
      coveragePercent: Math.round((pairs.length / 256) * 100),
      totalTokensUsed: totalTokens,
      outdatedCount: outdatedCount,
      estimatedCostUSD: (totalTokens * 0.000015).toFixed(2) // Rough estimate
    };
    
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}

/**
 * Prefetch common pairs (run in background)
 */
export async function prefetchCommonPairs(pairs = []) {
  console.log(`🚀 Prefetching ${pairs.length} common pairs...`);
  
  const results = {
    generated: 0,
    cached: 0,
    failed: 0
  };
  
  for (const [typeA, typeB] of pairs) {
    try {
      const result = await getCompatibilityInsights(typeA, typeB);
      
      if (result.fromCache) {
        results.cached++;
      } else {
        results.generated++;
      }
      
      // Rate limiting: wait 2 seconds between AI calls
      if (!result.fromCache) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`Failed to prefetch ${typeA}-${typeB}:`, error);
      results.failed++;
    }
  }
  
  console.log(`✅ Prefetch complete:`, results);
  return results;
}
