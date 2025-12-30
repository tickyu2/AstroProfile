/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * KNOWLEDGE SERVICE - Backend RAG for Voice Pipeline
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Server-side knowledge retrieval for voice conversations.
 * Provides fast O(1) lookups from personality knowledge bases.
 *
 * Features:
 * - Enneagram (9 types + wings + growth paths)
 * - BaZi (10 day masters + elements)
 * - Big 5 (OCEAN personality traits)
 * - Synthesized Luna guidance
 * - Keyword search fallback
 *
 * Created: December 28, 2024
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load knowledge bases
const dataPath = join(__dirname, '../../src/data');

let enneagramData, baziData, big5Data;

try {
  enneagramData = JSON.parse(readFileSync(join(dataPath, 'enneagramKnowledge.json'), 'utf8'));
  baziData = JSON.parse(readFileSync(join(dataPath, 'baziKnowledge.json'), 'utf8'));
  big5Data = JSON.parse(readFileSync(join(dataPath, 'big5Knowledge.json'), 'utf8'));
  console.log('[KnowledgeService] ✅ Loaded knowledge bases');
} catch (error) {
  console.error('[KnowledgeService] ❌ Failed to load knowledge bases:', error.message);
  // Provide empty fallbacks
  enneagramData = { types: {} };
  baziData = { dayMasters: {}, elements: {} };
  big5Data = { traits: {} };
}

/**
 * Knowledge Service - Fast lookup for voice pipeline
 */
class KnowledgeService {
  constructor() {
    this.enneagram = enneagramData;
    this.bazi = baziData;
    this.big5 = big5Data;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENNEAGRAM
  // ═══════════════════════════════════════════════════════════════════════════════

  getEnneagramType(type) {
    return this.enneagram.types[String(type)] || null;
  }

  getEnneagramGuidance(type) {
    const typeData = this.getEnneagramType(type);
    if (!typeData) return null;

    return {
      name: typeData.name,
      approach: typeData.lunaGuidance?.approach,
      avoid: typeData.lunaGuidance?.avoid,
      keyPhrases: typeData.lunaGuidance?.keyPhrases || [],
      coreFear: typeData.coreFear,
      coreDesire: typeData.coreDesire,
      communicationPrefers: typeData.communicationStyle?.prefers || [],
      communicationAvoids: typeData.communicationStyle?.avoids || []
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BAZI
  // ═══════════════════════════════════════════════════════════════════════════════

  getDayMaster(dayMaster) {
    return this.bazi.dayMasters[dayMaster] || null;
  }

  getBaziGuidance(dayMaster) {
    const dmData = this.getDayMaster(dayMaster);
    if (!dmData) return null;

    return {
      archetype: dmData.archetype,
      element: dmData.element,
      polarity: dmData.polarity,
      approach: dmData.lunaGuidance?.approach,
      keyInsight: dmData.lunaGuidance?.keyInsight,
      nature: dmData.nature,
      favorableElements: dmData.elementalRelations?.favorable?.elements || []
    };
  }

  getElement(element) {
    return this.bazi.elements[element] || null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BIG 5
  // ═══════════════════════════════════════════════════════════════════════════════

  getBig5Trait(trait) {
    return this.big5.traits[trait.toLowerCase()] || null;
  }

  getBig5Guidance(trait, level = 'high') {
    const traitData = this.getBig5Trait(trait);
    if (!traitData) return null;

    const scoreData = level === 'high' ? traitData.highScore : traitData.lowScore;
    const guidanceKey = level === 'high'
      ? `high${trait.charAt(0).toUpperCase()}`
      : `low${trait.charAt(0).toUpperCase()}`;

    return {
      fullName: traitData.fullName,
      level,
      traits: scoreData?.traits || [],
      strengths: scoreData?.strengths || [],
      approach: traitData.lunaGuidance?.[guidanceKey]?.approach,
      keyPhrases: traitData.lunaGuidance?.[guidanceKey]?.keyPhrases || []
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SYNTHESIZED CONTEXT FOR VOICE
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Build context string for LLM prompt in voice mode
   * Target: <5ms, concise output
   *
   * @param {Object} userProfile - User's personality profile
   * @param {number|string} userProfile.enneagramType - Enneagram type (1-9)
   * @param {string} userProfile.dayMaster - BaZi day master key
   * @param {Object} userProfile.big5 - Big 5 scores { o, c, e, a, n }
   * @returns {string} Context for LLM prompt
   */
  buildVoiceContext(userProfile = {}) {
    if (!userProfile || Object.keys(userProfile).length === 0) {
      return '';
    }

    const contextParts = [];

    // Enneagram context
    if (userProfile.enneagramType) {
      const guidance = this.getEnneagramGuidance(userProfile.enneagramType);
      if (guidance) {
        contextParts.push(
          `[Enneagram Type ${userProfile.enneagramType}: ${guidance.name}]`,
          `Approach: ${guidance.approach}`,
          `Core need: ${guidance.coreDesire}`
        );
      }
    }

    // BaZi context
    if (userProfile.dayMaster) {
      const guidance = this.getBaziGuidance(userProfile.dayMaster);
      if (guidance) {
        contextParts.push(
          `[${guidance.element} ${guidance.polarity}: ${guidance.archetype}]`,
          `Insight: ${guidance.keyInsight}`
        );
      }
    }

    // Big 5 context (only for extreme scores)
    if (userProfile.big5) {
      const extremes = [];
      const traitMap = {
        o: 'openness',
        c: 'conscientiousness',
        e: 'extraversion',
        a: 'agreeableness',
        n: 'neuroticism'
      };

      for (const [key, score] of Object.entries(userProfile.big5)) {
        if (score >= 75) {
          const trait = this.getBig5Trait(traitMap[key]);
          if (trait) extremes.push(`High ${trait.fullName}`);
        } else if (score <= 25) {
          const trait = this.getBig5Trait(traitMap[key]);
          if (trait) extremes.push(`Low ${trait.fullName}`);
        }
      }

      if (extremes.length > 0) {
        contextParts.push(`[Big 5: ${extremes.join(', ')}]`);
      }
    }

    if (contextParts.length === 0) {
      return '';
    }

    return '\n[PERSONALITY CONTEXT]\n' + contextParts.join('\n');
  }

  /**
   * Get Luna's key phrases for a user profile
   * Useful for response generation
   *
   * @param {Object} userProfile - User's personality profile
   * @returns {string[]} Array of key phrases Luna can use
   */
  getLunaKeyPhrases(userProfile = {}) {
    const phrases = [];

    if (userProfile.enneagramType) {
      const guidance = this.getEnneagramGuidance(userProfile.enneagramType);
      if (guidance?.keyPhrases) {
        phrases.push(...guidance.keyPhrases);
      }
    }

    return phrases;
  }

  /**
   * Get communication tips for Luna based on profile
   *
   * @param {Object} userProfile - User's personality profile
   * @returns {Object} { prefers: [], avoids: [] }
   */
  getCommunicationTips(userProfile = {}) {
    const tips = { prefers: [], avoids: [] };

    if (userProfile.enneagramType) {
      const typeData = this.getEnneagramType(userProfile.enneagramType);
      if (typeData?.communicationStyle) {
        tips.prefers.push(...(typeData.communicationStyle.prefers || []));
        tips.avoids.push(...(typeData.communicationStyle.avoids || []));
      }
    }

    return tips;
  }
}

// Singleton instance
export const knowledgeService = new KnowledgeService();

// Named exports
export const getEnneagramType = (type) => knowledgeService.getEnneagramType(type);
export const getEnneagramGuidance = (type) => knowledgeService.getEnneagramGuidance(type);
export const getDayMaster = (dm) => knowledgeService.getDayMaster(dm);
export const getBaziGuidance = (dm) => knowledgeService.getBaziGuidance(dm);
export const getBig5Trait = (trait) => knowledgeService.getBig5Trait(trait);
export const buildVoiceContext = (profile) => knowledgeService.buildVoiceContext(profile);
export const getLunaKeyPhrases = (profile) => knowledgeService.getLunaKeyPhrases(profile);

export default knowledgeService;
