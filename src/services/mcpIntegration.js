/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENESIS MCP INTEGRATION SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file provides the React integration layer for MCP tools.
 * Use this service to call any of the 21 MCP tools from UI components.
 *
 * For: Copilot UI Designer - Art Nouveau + Michelangelo Interface
 * Created: December 29, 2025
 * Architecture: 200-year civilization infrastructure
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ============================================================================
// MCP CLIENT SETUP
// ============================================================================

/**
 * MCP Server Configuration
 * The server runs locally via stdio or can be deployed to Cloud Run
 */
const MCP_CONFIG = {
  serverPath: 'c:/astroprofile/mcp-server/server.js',
  serverName: 'genesis-constitutional-data',
  version: '1.0.0'
};

/**
 * Call an MCP tool and return the parsed result
 *
 * @param {string} toolName - One of the 21 available tools
 * @param {object} args - Tool-specific arguments
 * @returns {Promise<object>} - Parsed JSON response from MCP server
 *
 * @example
 * const constitution = await callMCPTool('get_user_constitution', { userId: 'abc123' });
 */
export async function callMCPTool(toolName, args) {
  try {
    // In production, this connects to the MCP server via the MCP SDK
    // For now, we'll use a fetch to a local endpoint or Cloud Run
    const response = await fetch('/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: toolName, arguments: args })
    });

    const result = await response.json();

    if (result.isError) {
      throw new Error(result.content[0].text);
    }

    // Parse the text content as JSON
    return JSON.parse(result.content[0].text);
  } catch (error) {
    console.error(`MCP Tool Error (${toolName}):`, error);
    throw error;
  }
}

// ============================================================================
// SERVER 1: CONSTITUTIONAL DATA (6 tools)
// ============================================================================

/**
 * Get complete constitutional profile for a user
 * Includes: BaZi, Western, MBTI, Big Five, Enneagram, Numerology
 */
export async function getUserConstitution(userId) {
  return callMCPTool('get_user_constitution', { userId });
}

/**
 * Get detailed birth chart with all astrological calculations
 * Includes: Four Pillars, Ten Gods, Western planets, houses, aspects
 */
export async function getBirthChart(userId) {
  return callMCPTool('get_birth_chart', { userId });
}

/**
 * Get five element balance analysis with interpretation
 * Returns: Wood/Fire/Earth/Metal/Water percentages + recommendations
 */
export async function getElementAnalysis(userId) {
  return callMCPTool('get_element_analysis', { userId });
}

/**
 * Get Yin/Yang ratio analysis
 */
export async function getYinYang(userId) {
  return callMCPTool('get_yin_yang', { userId });
}

/**
 * Get context-aware insights based on current UI tab
 * @param {string} context - 'bazi_tab', 'mbti_tab', 'compatibility_page', etc.
 */
export async function getContextualInsights(userId, context) {
  return callMCPTool('get_contextual_insights', { userId, context });
}

/**
 * Search constitutional knowledge base
 * @param {string} query - Search query
 * @param {string[]} systems - Filter by systems: ['bazi', 'western', 'mbti', etc.]
 */
export async function searchKnowledge(query, systems = [], limit = 10) {
  return callMCPTool('search_constitutional_knowledge', { query, systems, limit });
}

// ============================================================================
// SERVER 2: COMPATIBILITY ANALYSIS (4 tools)
// ============================================================================

/**
 * Calculate full compatibility between two users
 * Returns: Score 0-110%, breakdown by pillar, element exchange, symphonesis potential
 */
export async function analyzeCompatibility(userAId, userBId) {
  return callMCPTool('analyze_compatibility', { userAId, userBId });
}

/**
 * Get history of past compatibility analyses
 */
export async function getRelationshipHistory(userId, limit = 10) {
  return callMCPTool('get_relationship_history', { userId, limit });
}

/**
 * Find compatible users based on constitutional matching
 * @param {number} minScore - Minimum compatibility score (default 80)
 */
export async function suggestMatches(userId, minScore = 80, limit = 10) {
  return callMCPTool('suggest_compatible_matches', { userId, minScore, limit });
}

/**
 * Detailed element exchange analysis between two users
 */
export async function calculateElementExchange(userAId, userBId) {
  return callMCPTool('calculate_element_exchange', { userAId, userBId });
}

// ============================================================================
// SERVER 3: MEMORY & LIFE STORY (5 tools)
// ============================================================================

/**
 * Store a life memory with constitutional context
 * @param {object} memory - { title, content, ageAtEvent, emotionalWeight, tags, isPrivate }
 */
export async function storeMemory(userId, memory) {
  return callMCPTool('store_memory', { userId, memory });
}

/**
 * Search through stored memories
 * @param {string} query - Search text
 * @param {string[]} tags - Optional tag filter
 * @param {object} ageRange - Optional { min, max } age range
 */
export async function searchMemories(userId, query, tags = [], ageRange = null, limit = 20) {
  return callMCPTool('search_memories', { userId, query, tags, ageRange, limit });
}

/**
 * Get complete chronological life timeline
 */
export async function getLifeTimeline(userId) {
  return callMCPTool('get_life_timeline', { userId });
}

/**
 * Get memories from specific age range (life chapter)
 */
export async function getLifeChapter(userId, startAge, endAge) {
  return callMCPTool('retrieve_life_chapter', { userId, startAge, endAge });
}

/**
 * Calculate accumulated soul burden from unprocessed memories
 */
export async function calculateSoulBurden(userId) {
  return callMCPTool('calculate_soul_burden', { userId });
}

// ============================================================================
// SERVER 4: HEALTH TRACKING (4 tools)
// ============================================================================

/**
 * Log a health event with constitutional context
 * @param {object} event - { type, description, severity, bodyArea, timestamp, possibleTriggers }
 */
export async function logHealthEvent(userId, event) {
  return callMCPTool('log_health_event', { userId, event });
}

/**
 * Analyze health patterns over time
 * @param {string} timeRange - '3months', '6months', '1year', 'all'
 * @param {string} focusArea - 'all', 'head', 'digestive', 'energy', 'sleep', 'mood'
 */
export async function analyzeHealthPatterns(userId, timeRange = '6months', focusArea = 'all') {
  return callMCPTool('analyze_patterns', { userId, timeRange, focusArea });
}

/**
 * Get constitutional health vulnerabilities
 */
export async function getHealthVulnerabilities(userId) {
  return callMCPTool('get_constitutional_vulnerabilities', { userId });
}

/**
 * Get TCM-based preventative protocol
 * @param {string} focusArea - 'general', 'specific_element', 'seasonal', 'current_symptoms'
 */
export async function getPreventativeProtocol(userId, focusArea = 'general') {
  return callMCPTool('suggest_preventative_protocol', { userId, focusArea });
}

// ============================================================================
// SERVER 5: COMMUNITY (2 tools)
// ============================================================================

/**
 * Find compatible micro-community pods
 * @param {object} preferences - { minGroupCompatibility, maxSize, interests, location, meetingStyle }
 */
export async function findCompatiblePod(userId, preferences = {}) {
  const defaultPrefs = {
    minGroupCompatibility: 80,
    maxSize: 8,
    interests: [],
    location: 'global',
    meetingStyle: 'hybrid'
  };
  return callMCPTool('find_compatible_pod', { userId, preferences: { ...defaultPrefs, ...preferences } });
}

/**
 * Analyze group dynamics for existing group
 * @param {string[]} userIds - Array of user IDs in the group
 */
export async function analyzeGroupDynamics(userIds, groupName = '') {
  return callMCPTool('analyze_group_dynamics', { userIds, groupName });
}

// ============================================================================
// REACT HOOKS FOR UI COMPONENTS
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for loading user constitution
 *
 * @example
 * const { constitution, loading, error, refresh } = useConstitution(userId);
 */
export function useConstitution(userId) {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConstitution = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserConstitution(userId);
      setConstitution(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConstitution();
  }, [loadConstitution]);

  return { constitution, loading, error, refresh: loadConstitution };
}

/**
 * Hook for element analysis with visual data
 *
 * @example
 * const { elements, dominant, weakest, loading } = useElementAnalysis(userId);
 */
export function useElementAnalysis(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    getElementAnalysis(userId)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return {
    elements: data?.elements || null,
    dominant: data?.dominantElement || null,
    weakest: data?.weakestElement || null,
    balance: data?.balance || null,
    interpretation: data?.interpretation || null,
    elementDetails: data?.elementDetails || null,
    loading,
    error
  };
}

/**
 * Hook for compatibility analysis between two users
 *
 * @example
 * const { score, breakdown, loading } = useCompatibility(userAId, userBId);
 */
export function useCompatibility(userAId, userBId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async () => {
    if (!userAId || !userBId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCompatibility(userAId, userBId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userAId, userBId]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  return {
    score: data?.overallScore || null,
    breakdown: data?.breakdown || null,
    elementExchange: data?.elementExchange || null,
    symphonesisPotential: data?.symphonesisPotential || null,
    interpretation: data?.interpretation || null,
    loading,
    error,
    reanalyze: analyze
  };
}

/**
 * Hook for contextual AI insights based on current tab
 *
 * @example
 * const { insights, suggestedQuestions, loading } = useContextualInsights(userId, 'bazi_tab');
 */
export function useContextualInsights(userId, context) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !context) return;

    setLoading(true);
    getContextualInsights(userId, context)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, context]);

  return {
    insights: data?.keyInsights || [],
    suggestedQuestions: data?.focusAreas?.suggestedQuestions || [],
    focusAreas: data?.focusAreas || null,
    relatedSystems: data?.relatedSystems || [],
    loading,
    error
  };
}

/**
 * Hook for life timeline data
 */
export function useLifeTimeline(userId) {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    getLifeTimeline(userId)
      .then(result => {
        setTimeline(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { timeline, loading, error };
}

/**
 * Hook for soul burden calculation
 */
export function useSoulBurden(userId) {
  const [burden, setBurden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    calculateSoulBurden(userId)
      .then(result => {
        setBurden(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return {
    score: burden?.soulBurden?.score || 0,
    level: burden?.soulBurden?.level || 'unknown',
    breakdown: burden?.burdenBreakdown || null,
    heaviestMemories: burden?.heaviestMemories || [],
    recommendations: burden?.lighteningRecommendations || [],
    loading,
    error
  };
}

/**
 * Hook for health vulnerabilities
 */
export function useHealthVulnerabilities(userId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    getHealthVulnerabilities(userId)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return {
    vulnerabilities: data?.vulnerabilities || [],
    elementBalance: data?.elementBalance || null,
    assessment: data?.overallAssessment || '',
    loading,
    error
  };
}

// ============================================================================
// ELEMENT COLORS (for consistent UI theming)
// ============================================================================

export const ELEMENT_COLORS = {
  wood: {
    primary: '#228B22',
    secondary: '#90EE90',
    gradient: 'linear-gradient(135deg, #228B22 0%, #90EE90 100%)'
  },
  fire: {
    primary: '#DC143C',
    secondary: '#FF6347',
    gradient: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)'
  },
  earth: {
    primary: '#DAA520',
    secondary: '#F4A460',
    gradient: 'linear-gradient(135deg, #DAA520 0%, #F4A460 100%)'
  },
  metal: {
    primary: '#C0C0C0',
    secondary: '#E8E8E8',
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)'
  },
  water: {
    primary: '#000080',
    secondary: '#4169E1',
    gradient: 'linear-gradient(135deg, #000080 0%, #4169E1 100%)'
  }
};

// ============================================================================
// CONTEXT LABELS (for UI display)
// ============================================================================

export const CONTEXT_LABELS = {
  overview: 'Your Soul Map',
  bazi_tab: 'BaZi Analysis',
  mbti_tab: 'MBTI Insights',
  bigfive_tab: 'Big Five Profile',
  enneagram_tab: 'Enneagram Journey',
  western_tab: 'Western Astrology',
  numerology_tab: 'Numerology',
  compatibility_page: 'Compatibility',
  memory_page: 'Life Story',
  health_page: 'Health Tracking',
  community_page: 'Community'
};

// ============================================================================
// COMPATIBILITY SCORE INTERPRETATION
// ============================================================================

export function interpretCompatibilityScore(score) {
  if (score >= 90) return { level: 'perfect', label: 'Perfect Fit', color: '#FFD700', description: 'Puzzle pieces click naturally' };
  if (score >= 80) return { level: 'excellent', label: 'Excellent Match', color: '#228B22', description: 'Very compatible souls' };
  if (score >= 70) return { level: 'good', label: 'Good Match', color: '#4169E1', description: 'Compatible with some effort' };
  if (score >= 60) return { level: 'moderate', label: 'Moderate Match', color: '#DAA520', description: 'Challenging but possible' };
  return { level: 'low', label: 'Low Match', color: '#DC143C', description: 'Forcing puzzle pieces' };
}

// ============================================================================
// ART NOUVEAU + MICHELANGELO DESIGN TOKENS
// ============================================================================

export const DESIGN_TOKENS = {
  // Art Nouveau curves
  borderRadius: {
    organic: '40% 60% 60% 40% / 60% 30% 70% 40%',
    soft: '20px',
    petal: '50% 0 50% 50%'
  },

  // Michelangelo-inspired shadows (depth and drama)
  shadows: {
    subtle: '0 2px 10px rgba(0,0,0,0.1)',
    dramatic: '0 10px 40px rgba(0,0,0,0.3)',
    heavenly: '0 0 60px rgba(255,215,0,0.3)'
  },

  // Sacred geometry patterns
  patterns: {
    enneagram: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
    vesicaPiscis: 'ellipse(40% 60% at 50% 50%)'
  },

  // System-specific palettes
  palettes: {
    bazi: {
      primary: '#8B0000',
      secondary: '#FFD700',
      accent: '#000000'
    },
    western: {
      primary: '#191970',
      secondary: '#C0C0C0',
      accent: '#9370DB'
    },
    mbti: {
      primary: '#FFFFFF',
      secondary: '#333333',
      accent: '#4169E1'
    },
    bigFive: {
      primary: '#8FBC8F',
      secondary: '#DDA0DD',
      accent: '#F0E68C'
    },
    enneagram: {
      primary: '#800020',
      secondary: '#FFD700',
      accent: '#4B0082'
    },
    numerology: {
      primary: '#FFD700',
      secondary: '#8B4513',
      accent: '#000000'
    }
  }
};

export default {
  callMCPTool,
  // Constitutional Data
  getUserConstitution,
  getBirthChart,
  getElementAnalysis,
  getYinYang,
  getContextualInsights,
  searchKnowledge,
  // Compatibility
  analyzeCompatibility,
  getRelationshipHistory,
  suggestMatches,
  calculateElementExchange,
  // Memory
  storeMemory,
  searchMemories,
  getLifeTimeline,
  getLifeChapter,
  calculateSoulBurden,
  // Health
  logHealthEvent,
  analyzeHealthPatterns,
  getHealthVulnerabilities,
  getPreventativeProtocol,
  // Community
  findCompatiblePod,
  analyzeGroupDynamics,
  // Hooks
  useConstitution,
  useElementAnalysis,
  useCompatibility,
  useContextualInsights,
  useLifeTimeline,
  useSoulBurden,
  useHealthVulnerabilities,
  // Constants
  ELEMENT_COLORS,
  CONTEXT_LABELS,
  DESIGN_TOKENS,
  interpretCompatibilityScore
};
