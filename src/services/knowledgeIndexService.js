/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * KNOWLEDGE INDEX SERVICE - Fast RAG Lookups for Voice Mode
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides O(1) lookups for personality knowledge in voice conversations.
 * Designed for <50ms retrieval to maintain voice latency targets.
 *
 * Features:
 * - Direct key lookup for Enneagram types, BaZi day masters, Big 5 traits
 * - Luna guidance retrieval for personalized responses
 * - Keyword fallback search when exact key not available
 * - Profile synthesis combining multiple systems
 *
 * Created: December 28, 2024
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import enneagramData from '../data/enneagramKnowledge.json';
import baziData from '../data/baziKnowledge.json';
import big5Data from '../data/big5Knowledge.json';

/**
 * Knowledge Index - Fast lookup service
 */
class KnowledgeIndex {
  constructor() {
    this.enneagram = enneagramData;
    this.bazi = baziData;
    this.big5 = big5Data;

    // Build inverted index for keyword search
    this._buildSearchIndex();

    console.log('[KnowledgeIndex] Initialized with:', {
      enneagramTypes: Object.keys(this.enneagram.types).length,
      baziDayMasters: Object.keys(this.bazi.dayMasters).length,
      big5Traits: Object.keys(this.big5.traits).length
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENNEAGRAM LOOKUPS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get Enneagram type by number (1-9)
   * @param {number|string} type - Type number (1-9)
   * @returns {Object|null} Type data with Luna guidance
   */
  getEnneagramType(type) {
    const typeStr = String(type);
    return this.enneagram.types[typeStr] || null;
  }

  /**
   * Get Enneagram wing info
   * @param {number|string} type - Core type (1-9)
   * @param {number|string} wing - Wing number
   * @returns {Object|null} Wing data
   */
  getEnneagramWing(type, wing) {
    const typeData = this.getEnneagramType(type);
    if (!typeData || !typeData.wings) return null;
    return typeData.wings[String(wing)] || null;
  }

  /**
   * Get Luna's guidance for speaking with an Enneagram type
   * @param {number|string} type - Type number
   * @returns {Object|null} { approach, avoid, keyPhrases }
   */
  getEnneagramLunaGuidance(type) {
    const typeData = this.getEnneagramType(type);
    return typeData?.lunaGuidance || null;
  }

  /**
   * Get growth and stress paths for a type
   * @param {number|string} type - Type number
   * @returns {Object} { growth: { direction, description }, stress: { direction, description } }
   */
  getEnneagramPaths(type) {
    const typeData = this.getEnneagramType(type);
    if (!typeData) return null;
    return {
      growth: typeData.growthPath,
      stress: typeData.stressPath
    };
  }

  /**
   * Get Enneagram triad for a type
   * @param {number|string} type - Type number
   * @returns {Object|null} Triad data (gut/heart/head)
   */
  getEnneagramTriad(type) {
    const typeNum = parseInt(type);
    for (const [name, triad] of Object.entries(this.enneagram.triads)) {
      if (triad.types.includes(typeNum)) {
        return { name, ...triad };
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BAZI LOOKUPS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get BaZi Day Master by key
   * @param {string} dayMaster - Day master key (e.g., 'yangWood', 'yinFire')
   * @returns {Object|null} Day master data
   */
  getDayMaster(dayMaster) {
    return this.bazi.dayMasters[dayMaster] || null;
  }

  /**
   * Get all day masters for an element
   * @param {string} element - Element name (Wood, Fire, Earth, Metal, Water)
   * @returns {Array} Array of day masters for that element
   */
  getDayMastersByElement(element) {
    return Object.entries(this.bazi.dayMasters)
      .filter(([, dm]) => dm.element === element)
      .map(([key, dm]) => ({ key, ...dm }));
  }

  /**
   * Get element relationships
   * @param {string} element - Element name
   * @returns {Object|null} Element data with produces/controls/weakens
   */
  getElement(element) {
    return this.bazi.elements[element] || null;
  }

  /**
   * Get Luna's guidance for a Day Master
   * @param {string} dayMaster - Day master key
   * @returns {Object|null} { approach, keyInsight }
   */
  getBaziLunaGuidance(dayMaster) {
    const dmData = this.getDayMaster(dayMaster);
    return dmData?.lunaGuidance || null;
  }

  /**
   * Get favorable/unfavorable elements for a day master
   * @param {string} dayMaster - Day master key
   * @returns {Object|null} Element relations
   */
  getDayMasterElements(dayMaster) {
    const dmData = this.getDayMaster(dayMaster);
    return dmData?.elementalRelations || null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BIG 5 LOOKUPS
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get Big 5 trait info
   * @param {string} trait - Trait key (openness, conscientiousness, extraversion, agreeableness, neuroticism)
   * @returns {Object|null} Trait data
   */
  getBig5Trait(trait) {
    const normalizedTrait = trait.toLowerCase();
    return this.big5.traits[normalizedTrait] || null;
  }

  /**
   * Get Luna guidance for a Big 5 trait level
   * @param {string} trait - Trait key
   * @param {string} level - 'high' or 'low'
   * @returns {Object|null} { approach, keyPhrases }
   */
  getBig5LunaGuidance(trait, level = 'high') {
    const traitData = this.getBig5Trait(trait);
    if (!traitData?.lunaGuidance) return null;

    const key = level === 'high' ? `high${trait.charAt(0).toUpperCase()}` : `low${trait.charAt(0).toUpperCase()}`;
    return traitData.lunaGuidance[key] || null;
  }

  /**
   * Get Big 5 profile by name
   * @param {string} profileName - Profile name (e.g., 'analyst', 'advocate')
   * @returns {Object|null} Profile data
   */
  getBig5Profile(profileName) {
    return this.big5.combinations?.profiles?.[profileName.toLowerCase()] || null;
  }

  /**
   * Interpret Big 5 scores into profile insights
   * @param {Object} scores - { openness, conscientiousness, extraversion, agreeableness, neuroticism }
   * @returns {Object} Interpreted profile
   */
  interpretBig5Scores(scores) {
    const insights = {
      dominant: [],
      moderate: [],
      low: [],
      lunaGuidance: []
    };

    for (const [trait, score] of Object.entries(scores)) {
      const traitData = this.getBig5Trait(trait);
      if (!traitData) continue;

      if (score >= 70) {
        insights.dominant.push({
          trait,
          fullName: traitData.fullName,
          characteristics: traitData.highScore?.traits || [],
          strengths: traitData.highScore?.strengths || []
        });
        const guidance = this.getBig5LunaGuidance(trait, 'high');
        if (guidance) insights.lunaGuidance.push(guidance);
      } else if (score <= 30) {
        insights.low.push({
          trait,
          fullName: traitData.fullName,
          characteristics: traitData.lowScore?.traits || [],
          strengths: traitData.lowScore?.strengths || []
        });
        const guidance = this.getBig5LunaGuidance(trait, 'low');
        if (guidance) insights.lunaGuidance.push(guidance);
      } else {
        insights.moderate.push({ trait, fullName: traitData.fullName });
      }
    }

    return insights;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SYNTHESIZED PROFILE
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get comprehensive Luna guidance for a user profile
   * Combines Enneagram, BaZi, and Big 5 insights
   *
   * @param {Object} profile - User profile
   * @param {number|string} profile.enneagramType - Enneagram type (1-9)
   * @param {number|string} profile.enneagramWing - Wing number (optional)
   * @param {string} profile.dayMaster - BaZi day master key (optional)
   * @param {Object} profile.big5Scores - Big 5 scores (optional)
   * @returns {Object} Synthesized guidance for Luna
   */
  getSynthesizedGuidance(profile) {
    const guidance = {
      approaches: [],
      avoids: [],
      keyPhrases: [],
      insights: [],
      communicationStyle: null,
      emotionalNeeds: []
    };

    // Enneagram contribution
    if (profile.enneagramType) {
      const enneaGuidance = this.getEnneagramLunaGuidance(profile.enneagramType);
      const enneaType = this.getEnneagramType(profile.enneagramType);

      if (enneaGuidance) {
        guidance.approaches.push(`[Enneagram ${profile.enneagramType}] ${enneaGuidance.approach}`);
        guidance.avoids.push(enneaGuidance.avoid);
        guidance.keyPhrases.push(...(enneaGuidance.keyPhrases || []));
      }

      if (enneaType) {
        guidance.communicationStyle = enneaType.communicationStyle;
        guidance.emotionalNeeds.push(enneaType.coreDesire);
        guidance.insights.push(`Core fear: ${enneaType.coreFear}`);
      }
    }

    // BaZi contribution
    if (profile.dayMaster) {
      const baziGuidance = this.getBaziLunaGuidance(profile.dayMaster);
      const dmData = this.getDayMaster(profile.dayMaster);

      if (baziGuidance) {
        guidance.approaches.push(`[${dmData?.archetype || profile.dayMaster}] ${baziGuidance.approach}`);
        guidance.insights.push(baziGuidance.keyInsight);
      }

      if (dmData) {
        guidance.insights.push(`Elemental nature: ${dmData.nature}`);
      }
    }

    // Big 5 contribution
    if (profile.big5Scores) {
      const big5Insights = this.interpretBig5Scores(profile.big5Scores);

      for (const g of big5Insights.lunaGuidance) {
        guidance.approaches.push(`[Big 5] ${g.approach}`);
        guidance.keyPhrases.push(...(g.keyPhrases || []));
      }

      if (big5Insights.dominant.length > 0) {
        guidance.insights.push(
          `Dominant traits: ${big5Insights.dominant.map(t => t.fullName).join(', ')}`
        );
      }
    }

    return guidance;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // KEYWORD SEARCH (FALLBACK)
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Build inverted index for keyword search
   * @private
   */
  _buildSearchIndex() {
    this.searchIndex = new Map();

    // Index Enneagram types
    for (const [typeNum, typeData] of Object.entries(this.enneagram.types)) {
      const keywords = [
        typeData.name.toLowerCase(),
        ...typeData.alias.map(a => a.toLowerCase()),
        ...typeData.keyStrengths.map(s => s.toLowerCase()),
        typeData.coreFear.toLowerCase(),
        typeData.coreDesire.toLowerCase()
      ];

      for (const keyword of keywords) {
        if (!this.searchIndex.has(keyword)) {
          this.searchIndex.set(keyword, []);
        }
        this.searchIndex.get(keyword).push({
          type: 'enneagram',
          id: typeNum,
          data: typeData
        });
      }
    }

    // Index BaZi day masters
    for (const [dmKey, dmData] of Object.entries(this.bazi.dayMasters)) {
      const keywords = [
        dmData.element.toLowerCase(),
        dmData.symbol.toLowerCase(),
        dmData.archetype.toLowerCase(),
        ...dmData.characteristics.positive.map(c => c.toLowerCase())
      ];

      for (const keyword of keywords) {
        if (!this.searchIndex.has(keyword)) {
          this.searchIndex.set(keyword, []);
        }
        this.searchIndex.get(keyword).push({
          type: 'bazi',
          id: dmKey,
          data: dmData
        });
      }
    }

    // Index Big 5 traits
    for (const [traitKey, traitData] of Object.entries(this.big5.traits)) {
      const keywords = [
        traitData.fullName.toLowerCase(),
        traitData.abbreviation.toLowerCase(),
        ...Object.keys(traitData.facets).map(f => f.toLowerCase())
      ];

      for (const keyword of keywords) {
        if (!this.searchIndex.has(keyword)) {
          this.searchIndex.set(keyword, []);
        }
        this.searchIndex.get(keyword).push({
          type: 'big5',
          id: traitKey,
          data: traitData
        });
      }
    }
  }

  /**
   * Search knowledge base by keyword
   * @param {string} query - Search query
   * @param {number} limit - Max results
   * @returns {Array} Matching results
   */
  searchByKeyword(query, limit = 5) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const results = new Map();

    for (const word of queryWords) {
      // Exact match
      if (this.searchIndex.has(word)) {
        for (const result of this.searchIndex.get(word)) {
          const key = `${result.type}-${result.id}`;
          if (!results.has(key)) {
            results.set(key, { ...result, score: 0 });
          }
          results.get(key).score += 2; // Exact match bonus
        }
      }

      // Partial match
      for (const [keyword, items] of this.searchIndex) {
        if (keyword.includes(word) || word.includes(keyword)) {
          for (const result of items) {
            const key = `${result.type}-${result.id}`;
            if (!results.has(key)) {
              results.set(key, { ...result, score: 0 });
            }
            results.get(key).score += 1;
          }
        }
      }
    }

    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOICE MODE QUICK CONTEXT
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get quick context for voice mode (<5ms target)
   * Returns essential Luna guidance as a single string
   *
   * @param {Object} profile - User profile
   * @returns {string} Quick context string for LLM prompt
   */
  getQuickVoiceContext(profile) {
    const parts = [];

    if (profile.enneagramType) {
      const type = this.getEnneagramType(profile.enneagramType);
      if (type) {
        parts.push(`Type ${profile.enneagramType} ${type.name}: ${type.lunaGuidance?.approach || ''}`);
      }
    }

    if (profile.dayMaster) {
      const dm = this.getDayMaster(profile.dayMaster);
      if (dm) {
        parts.push(`${dm.archetype}: ${dm.lunaGuidance?.keyInsight || ''}`);
      }
    }

    return parts.join(' | ');
  }
}

// Singleton instance
export const knowledgeIndex = new KnowledgeIndex();

// Named exports for convenience
export const getEnneagramType = (type) => knowledgeIndex.getEnneagramType(type);
export const getDayMaster = (dm) => knowledgeIndex.getDayMaster(dm);
export const getBig5Trait = (trait) => knowledgeIndex.getBig5Trait(trait);
export const getSynthesizedGuidance = (profile) => knowledgeIndex.getSynthesizedGuidance(profile);
export const getQuickVoiceContext = (profile) => knowledgeIndex.getQuickVoiceContext(profile);
export const searchKnowledge = (query, limit) => knowledgeIndex.searchByKeyword(query, limit);

export default knowledgeIndex;
