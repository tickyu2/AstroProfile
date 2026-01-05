/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENESISpedia - KNOWLEDGE RETRIEVAL SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Unified RAG with 3-Level Fallback for GENESIS conversations
 *
 * KNOWLEDGE DOMAINS:
 *   - MBTI (16 types + cognitive functions + temperaments)
 *   - Enneagram (9 types + wings + tritype + centers)
 *   - MBTI + Enneagram Synthesis (36 Priority 1 combinations)
 *   - BaZi (10 day masters + elements)
 *   - Big 5 (5 traits with high/low guidance)
 *
 * RETRIEVAL PATHS:
 *
 * VOICE PATH (<50ms):
 *   1. JSON direct lookup by profile keys
 *   2. Keyword search on JSON
 *
 * TEXT CHAT PATH (<500ms):
 *   1. Firestore Vector Search (primary)
 *   2. In-memory cosine similarity (fallback)
 *   3. Keyword search on JSON (always works)
 *
 * Created: December 28, 2024
 * Updated: December 29, 2024 - Added MBTI+Enneagram Synthesis Engine
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const path = require('path');
const fs = require('fs');

// Vector search (may fail if Firestore unavailable)
let vectorSearch = null;
try {
  vectorSearch = require('./vectorSearch');
} catch (e) {
  console.warn('[KnowledgeRetrieval] Vector search not available:', e.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// JSON KNOWLEDGE LOADER
// ═══════════════════════════════════════════════════════════════════════════════

let knowledgeCache = null;

// MBTI + Enneagram Synthesis Engine (imported dynamically for CommonJS)
let mbtiEnneagramSynthesis = null;

/**
 * Load MBTI + Enneagram Synthesis Engine
 */
async function loadSynthesisEngine() {
  if (mbtiEnneagramSynthesis) return mbtiEnneagramSynthesis;

  try {
    // Dynamic import for ES module
    const synthesisPath = path.join(__dirname, '../../src/data/mbtiEnneagramSynthesis.js');
    mbtiEnneagramSynthesis = await import(synthesisPath);
    console.log('[KnowledgeRetrieval] MBTI+Enneagram Synthesis Engine loaded');
  } catch (e) {
    console.warn('[KnowledgeRetrieval] Synthesis engine not available:', e.message);
    mbtiEnneagramSynthesis = null;
  }

  return mbtiEnneagramSynthesis;
}

/**
 * Load knowledge JSON files into memory
 */
function loadKnowledgeJSON() {
  if (knowledgeCache) return knowledgeCache;

  const dataPath = path.join(__dirname, '../../src/data');

  knowledgeCache = {
    enneagram: { types: {} },
    bazi: { dayMasters: {}, elements: {} },
    big5: { traits: {} },
    mbti: { types: {}, cognitiveFunctions: {}, temperaments: {} }
  };

  try {
    knowledgeCache.enneagram = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'enneagramKnowledge.json'), 'utf8')
    );
  } catch (e) { /* ignore */ }

  try {
    knowledgeCache.bazi = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'baziKnowledge.json'), 'utf8')
    );
  } catch (e) { /* ignore */ }

  try {
    knowledgeCache.big5 = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'big5Knowledge.json'), 'utf8')
    );
  } catch (e) { /* ignore */ }

  try {
    knowledgeCache.mbti = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'mbtiKnowledge.json'), 'utf8')
    );
  } catch (e) { /* ignore */ }

  return knowledgeCache;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECT JSON LOOKUPS (VOICE PATH)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Direct lookup for voice mode - O(1) retrieval
 */
function getKnowledgeFromJSON(profile) {
  const knowledge = loadKnowledgeJSON();
  const results = [];

  // Enneagram type lookup
  if (profile.enneagramType) {
    const type = knowledge.enneagram.types?.[String(profile.enneagramType)];
    if (type) {
      results.push({
        type: 'enneagram',
        key: profile.enneagramType,
        title: `Type ${profile.enneagramType}: ${type.name}`,
        data: type,
        lunaGuidance: type.lunaGuidance
      });
    }
  }

  // BaZi day master lookup
  if (profile.dayMaster) {
    const dm = knowledge.bazi.dayMasters?.[profile.dayMaster];
    if (dm) {
      results.push({
        type: 'bazi',
        key: profile.dayMaster,
        title: `${dm.element} ${dm.polarity}: ${dm.archetype}`,
        data: dm,
        lunaGuidance: dm.lunaGuidance
      });
    }
  }

  // Big 5 extreme traits
  if (profile.big5) {
    const traitNames = {
      o: 'openness',
      c: 'conscientiousness',
      e: 'extraversion',
      a: 'agreeableness',
      n: 'neuroticism'
    };

    for (const [key, score] of Object.entries(profile.big5)) {
      const traitName = traitNames[key];
      const trait = knowledge.big5.traits?.[traitName];

      if (trait && (score >= 75 || score <= 25)) {
        const level = score >= 75 ? 'high' : 'low';
        const guidanceKey = level + traitName.charAt(0).toUpperCase();

        results.push({
          type: 'big5',
          key: `${level}_${traitName}`,
          title: `${level.charAt(0).toUpperCase() + level.slice(1)} ${trait.fullName}`,
          data: level === 'high' ? trait.highScore : trait.lowScore,
          lunaGuidance: trait.lunaGuidance?.[guidanceKey]
        });
      }
    }
  }

  // MBTI type lookup
  if (profile.mbtiType) {
    const mbtiType = knowledge.mbti.types?.[profile.mbtiType.toUpperCase()];
    if (mbtiType) {
      results.push({
        type: 'mbti',
        key: profile.mbtiType.toUpperCase(),
        title: `${profile.mbtiType.toUpperCase()}: ${mbtiType.name}`,
        data: mbtiType,
        lunaGuidance: mbtiType.lunaGuidance
      });
    }
  }

  return results;
}

/**
 * Get MBTI + Enneagram Synthesis (async)
 * Returns the combined personality synthesis when both types are present
 */
async function getMBTIEnneagramSynthesis(mbtiType, enneagramType) {
  if (!mbtiType || !enneagramType) return null;

  const synthesis = await loadSynthesisEngine();
  if (!synthesis) return null;

  try {
    const result = synthesis.getSynthesis(mbtiType, enneagramType);
    if (result && result.implemented) {
      const lunaGuidance = synthesis.getLunaGuidance(mbtiType, enneagramType);
      return {
        type: 'mbti_enneagram_synthesis',
        key: `${mbtiType.toUpperCase()}-${enneagramType}`,
        title: `${mbtiType.toUpperCase()} + Type ${enneagramType}: ${result.archetype}`,
        data: {
          archetype: result.archetype,
          frequency: result.frequency,
          synthesis: result.synthesis,
          cognitiveMotivationDance: result.cognitive_motivation_dance,
          strengths: result.strengths,
          challenges: result.challenges,
          growthPath: result.growth_path,
          famousExamples: result.famous_examples,
          relationshipStyle: result.relationship_style,
          careerFits: result.career_fits
        },
        lunaGuidance: lunaGuidance,
        implemented: true
      };
    }
    return null;
  } catch (e) {
    console.warn('[KnowledgeRetrieval] Synthesis lookup failed:', e.message);
    return null;
  }
}

/**
 * Extended knowledge lookup with MBTI+Enneagram synthesis (async)
 */
async function getKnowledgeFromJSONWithSynthesis(profile) {
  const results = getKnowledgeFromJSON(profile);

  // Add MBTI + Enneagram Synthesis if both are present
  if (profile.mbtiType && profile.enneagramType) {
    const synthesis = await getMBTIEnneagramSynthesis(
      profile.mbtiType,
      profile.enneagramType
    );
    if (synthesis) {
      // Insert synthesis at the beginning as it's the most comprehensive
      results.unshift(synthesis);
    }
  }

  return results;
}

/**
 * Keyword search in JSON (fallback)
 */
function searchJSONByKeyword(query, limit = 5) {
  const knowledge = loadKnowledgeJSON();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  const results = [];

  // Search Enneagram types
  for (const [typeNum, typeData] of Object.entries(knowledge.enneagram.types || {})) {
    const searchText = [
      typeData.name,
      ...(typeData.alias || []),
      typeData.coreFear,
      typeData.coreDesire,
      ...(typeData.keyStrengths || [])
    ].join(' ').toLowerCase();

    const score = queryWords.reduce((s, w) => s + (searchText.includes(w) ? 1 : 0), 0);
    if (score > 0) {
      results.push({
        type: 'enneagram',
        key: typeNum,
        title: `Type ${typeNum}: ${typeData.name}`,
        data: typeData,
        lunaGuidance: typeData.lunaGuidance,
        score
      });
    }
  }

  // Search BaZi day masters
  for (const [dmKey, dmData] of Object.entries(knowledge.bazi.dayMasters || {})) {
    const searchText = [
      dmData.element,
      dmData.archetype,
      dmData.symbol,
      dmData.nature,
      ...(dmData.characteristics?.positive || [])
    ].join(' ').toLowerCase();

    const score = queryWords.reduce((s, w) => s + (searchText.includes(w) ? 1 : 0), 0);
    if (score > 0) {
      results.push({
        type: 'bazi',
        key: dmKey,
        title: `${dmData.element} ${dmData.polarity}: ${dmData.archetype}`,
        data: dmData,
        lunaGuidance: dmData.lunaGuidance,
        score
      });
    }
  }

  // Search Big 5 traits
  for (const [traitKey, traitData] of Object.entries(knowledge.big5.traits || {})) {
    const searchText = [
      traitData.fullName,
      traitData.description,
      ...(traitData.highScore?.traits || []),
      ...(traitData.lowScore?.traits || [])
    ].join(' ').toLowerCase();

    const score = queryWords.reduce((s, w) => s + (searchText.includes(w) ? 1 : 0), 0);
    if (score > 0) {
      results.push({
        type: 'big5',
        key: traitKey,
        title: traitData.fullName,
        data: traitData,
        lunaGuidance: traitData.lunaGuidance,
        score
      });
    }
  }

  // Search MBTI types
  for (const [typeCode, typeData] of Object.entries(knowledge.mbti.types || {})) {
    const searchText = [
      typeCode,
      typeData.name,
      ...(typeData.alias || []),
      ...(typeData.coreTraits || []),
      ...(typeData.strengths || []),
      typeData.communication,
      typeData.functions?.dominant,
      typeData.functions?.auxiliary
    ].join(' ').toLowerCase();

    const score = queryWords.reduce((s, w) => s + (searchText.includes(w) ? 1 : 0), 0);
    if (score > 0) {
      results.push({
        type: 'mbti',
        key: typeCode,
        title: `${typeCode}: ${typeData.name}`,
        data: typeData,
        lunaGuidance: typeData.lunaGuidance,
        score
      });
    }
  }

  // Sort by score and limit
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED RETRIEVAL (TEXT CHAT PATH)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get knowledge context for a conversation
 *
 * @param {Object} params - Retrieval parameters
 * @param {string} params.query - User's query/message
 * @param {Object} params.profile - User's personality profile (optional)
 * @param {string} params.mode - 'voice' (<50ms) or 'text' (<500ms)
 * @param {number} params.timeout - Max time in ms
 * @returns {Promise<Object>} Knowledge context
 */
async function getKnowledgeContext({
  query = '',
  profile = null,
  mode = 'text',
  timeout = 400
}) {
  const startTime = Date.now();

  const context = {
    results: [],
    source: 'none',
    latency: 0,
    profile: null
  };

  // ──────────────────────────────────────────────────────────────────────────
  // VOICE MODE: JSON only for speed
  // ──────────────────────────────────────────────────────────────────────────
  if (mode === 'voice') {
    if (profile) {
      context.results = getKnowledgeFromJSON(profile);
      context.source = 'json_direct';
      context.profile = profile;
    }

    if (context.results.length === 0 && query) {
      context.results = searchJSONByKeyword(query, 3);
      context.source = 'json_keyword';
    }

    context.latency = Date.now() - startTime;
    return context;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEXT MODE: Vector search with fallbacks
  // ──────────────────────────────────────────────────────────────────────────

  // Fallback 1: Firestore Vector Search
  if (vectorSearch && query) {
    try {
      const results = await vectorSearch.searchWithTimeout(query, timeout, {
        limit: 5,
        minSimilarity: 0.5
      });

      if (results.length > 0) {
        context.results = results;
        context.source = 'firestore_vector';
        context.latency = Date.now() - startTime;
        return context;
      }
    } catch (error) {
      console.warn('[KnowledgeRetrieval] Vector search failed:', error.message);
    }
  }

  // Fallback 2: In-memory cosine similarity
  if (vectorSearch && query) {
    try {
      const remainingTime = timeout - (Date.now() - startTime);
      if (remainingTime > 100) {
        const results = await Promise.race([
          vectorSearch.searchInMemory(query, { limit: 5 }),
          new Promise(r => setTimeout(() => r([]), remainingTime))
        ]);

        if (results.length > 0) {
          context.results = results;
          context.source = 'memory_cosine';
          context.latency = Date.now() - startTime;
          return context;
        }
      }
    } catch (error) {
      console.warn('[KnowledgeRetrieval] In-memory search failed:', error.message);
    }
  }

  // Fallback 3: JSON keyword search (always works)
  if (profile) {
    context.results = getKnowledgeFromJSON(profile);
    context.source = 'json_direct';
    context.profile = profile;
  }

  if (context.results.length === 0 && query) {
    context.results = searchJSONByKeyword(query, 5);
    context.source = 'json_keyword';
  }

  context.latency = Date.now() - startTime;
  return context;
}

/**
 * Build context string for LLM prompt from knowledge results
 */
function buildKnowledgePromptContext(knowledgeContext) {
  if (!knowledgeContext.results || knowledgeContext.results.length === 0) {
    return '';
  }

  const parts = ['\n[KNOWLEDGE CONTEXT]'];

  for (const result of knowledgeContext.results.slice(0, 3)) {
    parts.push(`\n[${result.type.toUpperCase()}: ${result.title}]`);

    if (result.lunaGuidance?.approach) {
      parts.push(`Approach: ${result.lunaGuidance.approach}`);
    }

    if (result.lunaGuidance?.keyInsight) {
      parts.push(`Insight: ${result.lunaGuidance.keyInsight}`);
    }

    if (result.lunaGuidance?.keyPhrases) {
      parts.push(`Phrases: ${result.lunaGuidance.keyPhrases.join(', ')}`);
    }
  }

  return parts.join('\n');
}

/**
 * Get knowledge for memory integration
 * Called from chatMemoryIntegration.js
 */
async function getKnowledgeForMemory(userId, profileId, query) {
  // TODO: Load profile from Firestore
  // For now, just do query-based search
  const context = await getKnowledgeContext({
    query,
    mode: 'text',
    timeout: 400
  });

  return {
    results: context.results,
    source: context.source,
    promptContext: buildKnowledgePromptContext(context)
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Main retrieval
  getKnowledgeContext,
  buildKnowledgePromptContext,

  // Direct access
  getKnowledgeFromJSON,
  getKnowledgeFromJSONWithSynthesis,
  searchJSONByKeyword,

  // MBTI + Enneagram Synthesis (GENESISpedia)
  getMBTIEnneagramSynthesis,
  loadSynthesisEngine,

  // Memory integration
  getKnowledgeForMemory,

  // Utilities
  loadKnowledgeJSON
};
