/**
 * Soul Family Discovery Agent Service
 *
 * Frontend integration for Neo4j Aura AI Agent
 * Enables natural language queries against the Soul Family graph database
 * Uses OAuth2 client credentials for authentication
 *
 * Agent Endpoint: https://api.neo4j.io/v2beta1/projects/{projectId}/agents/{agentId}/invoke
 */

// Environment configuration
const NEO4J_AGENT_URL = import.meta.env.VITE_NEO4J_AGENT_URL;
const NEO4J_CLIENT_ID = import.meta.env.VITE_NEO4J_CLIENT_ID;
const NEO4J_CLIENT_SECRET = import.meta.env.VITE_NEO4J_CLIENT_SECRET;
const TOKEN_URL = 'https://api.neo4j.io/oauth/token';

// Token cache
let cachedToken = null;
let tokenExpiry = null;

/**
 * Check if the agent is configured
 * @returns {boolean}
 */
export function isAgentConfigured() {
  return Boolean(NEO4J_AGENT_URL && NEO4J_CLIENT_ID && NEO4J_CLIENT_SECRET);
}

/**
 * Get OAuth2 access token using client credentials
 * Uses HTTP Basic Authentication per Neo4j Aura Agent API docs
 * @returns {Promise<string|null>} Access token or null
 */
async function getAccessToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  try {
    // Neo4j Aura Agent uses HTTP Basic Auth for token endpoint
    const credentials = btoa(`${NEO4J_CLIENT_ID}:${NEO4J_CLIENT_SECRET}`);

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      console.error('Token request failed:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Set expiry (default 1 hour if not specified)
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
    console.log('[Neo4j Agent] Token acquired successfully');
    return cachedToken;

  } catch (error) {
    console.error('Token request error:', error);
    return null;
  }
}

/**
 * Send a query to the Soul Family Discovery Agent
 * @param {string} message - Natural language query
 * @param {Object} [context] - Optional context for the query
 * @param {string} [context.userId] - Current user's ID
 * @param {Object} [context.userProfile] - User's profile data for context
 * @returns {Promise<Object>} Agent response
 */
export async function querySoulFamilyAgent(message, context = {}) {
  if (!isAgentConfigured()) {
    console.warn('Neo4j Agent not configured. Set VITE_NEO4J_AGENT_URL, VITE_NEO4J_CLIENT_ID, and VITE_NEO4J_CLIENT_SECRET');
    return {
      success: false,
      error: 'Agent not configured',
      message: 'Soul Family Discovery Agent is not configured. Please contact support.'
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      success: false,
      error: 'Authentication failed',
      message: 'Could not obtain access token'
    };
  }

  try {
    // Build input string with optional context
    // Neo4j Aura Agent API expects: {"input": "<YOUR AGENT QUESTION>"}
    let inputString = message;
    if (context.userProfile) {
      const profile = context.userProfile;
      inputString += ` [Context: User ${profile.displayName || 'Unknown'}, ` +
        `Day Master: ${profile.dayMaster || 'Unknown'}, ` +
        `Sun: ${profile.sunSign || 'Unknown'}, ` +
        `Moon: ${profile.moonSign || 'Unknown'}]`;
    }

    const requestBody = { input: inputString };
    console.log('[Neo4j Agent] Sending query:', inputString.substring(0, 100) + '...');

    const response = await fetch(NEO4J_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    });

    // Handle token expiry - retry once with fresh token
    if (response.status === 401) {
      console.log('[Neo4j Agent] Token expired, refreshing...');
      cachedToken = null;
      tokenExpiry = null;
      const newToken = await getAccessToken();
      if (newToken) {
        const retryResponse = await fetch(NEO4J_AGENT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${newToken}`
          },
          body: JSON.stringify(requestBody)
        });
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          console.log('[Neo4j Agent] Response received (after retry)');
          return {
            success: true,
            response: data.output || data.response || data.message || data,
            metadata: data.metadata || {}
          };
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Agent request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Neo4j Agent] Response received successfully');
    return {
      success: true,
      response: data.output || data.response || data.message || data,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Soul Family Agent query failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to query Soul Family Discovery Agent'
    };
  }
}

// =============================================================================
// PRE-BUILT QUERIES
// =============================================================================

/**
 * Find compatible profiles based on Day Master
 * @param {string} dayMaster - User's Day Master (e.g., "Jia Wood", "Bing Fire")
 * @param {number} [limit=10] - Maximum results
 * @returns {Promise<Object>} Compatible profiles
 */
export async function findByDayMaster(dayMaster, limit = 10) {
  return querySoulFamilyAgent(
    `Find up to ${limit} profiles that are compatible with Day Master: ${dayMaster}`,
    { queryType: 'day_master_match' }
  );
}

/**
 * Find profiles with complementary elements
 * @param {Object} elementalProfile - User's elemental percentages
 * @param {number} [limit=10] - Maximum results
 * @returns {Promise<Object>} Complementary profiles
 */
export async function findComplementaryElements(elementalProfile, limit = 10) {
  const dominantElement = Object.entries(elementalProfile)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

  return querySoulFamilyAgent(
    `Find ${limit} profiles with complementary elemental energy for someone dominant in ${dominantElement}. ` +
    `My elemental balance: Wood ${elementalProfile.Wood}%, Fire ${elementalProfile.Fire}%, ` +
    `Earth ${elementalProfile.Earth}%, Metal ${elementalProfile.Metal}%, Water ${elementalProfile.Water}%`,
    { queryType: 'elemental_complement', elementalProfile }
  );
}

/**
 * Find Soul Family based on personality compatibility
 * @param {Object} neo30Facets - User's 30-facet NEO PI-R vector
 * @param {number} [limit=10] - Maximum results
 * @returns {Promise<Object>} Soul Family matches
 */
export async function findSoulFamilyByPersonality(neo30Facets, limit = 10) {
  return querySoulFamilyAgent(
    `Find my Soul Family - the ${limit} most compatible profiles based on personality vectors`,
    { queryType: 'personality_match', neo30Facets }
  );
}

/**
 * Get synastry insights between two users
 * @param {string} userId1 - First user's ID
 * @param {string} userId2 - Second user's ID
 * @returns {Promise<Object>} Synastry insights
 */
export async function getSynastryInsights(userId1, userId2) {
  return querySoulFamilyAgent(
    `Analyze the synastry and Soul Family connection between users ${userId1} and ${userId2}. ` +
    `What are their elemental dynamics, Day Master interactions, and compatibility strengths?`,
    { queryType: 'synastry', userId1, userId2 }
  );
}

/**
 * Get user's Soul Family network
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Network of Soul Family connections
 */
export async function getSoulFamilyNetwork(userId) {
  return querySoulFamilyAgent(
    `Show me the complete Soul Family network for user ${userId}. ` +
    `Include all connection types: Kindred Spirits, Amplifiers, Anchors, and Growth Catalysts.`,
    { queryType: 'network', userId }
  );
}

/**
 * Search profiles by astrological criteria
 * @param {Object} criteria - Search criteria
 * @param {string} [criteria.sunSign] - Sun sign filter
 * @param {string} [criteria.moonSign] - Moon sign filter
 * @param {string} [criteria.element] - Dominant element filter
 * @param {string} [criteria.dayMaster] - Day Master filter
 * @param {number} [limit=20] - Maximum results
 * @returns {Promise<Object>} Matching profiles
 */
export async function searchProfiles(criteria, limit = 20) {
  const filters = [];
  if (criteria.sunSign) filters.push(`Sun in ${criteria.sunSign}`);
  if (criteria.moonSign) filters.push(`Moon in ${criteria.moonSign}`);
  if (criteria.element) filters.push(`dominant ${criteria.element} element`);
  if (criteria.dayMaster) filters.push(`Day Master ${criteria.dayMaster}`);

  const filterString = filters.length > 0
    ? `with ${filters.join(', ')}`
    : '';

  return querySoulFamilyAgent(
    `Search for up to ${limit} profiles ${filterString}`,
    { queryType: 'search', criteria }
  );
}

// =============================================================================
// AGENT CONVERSATION MANAGEMENT
// =============================================================================

/**
 * Start a new conversation session with the agent
 * @param {string} userId - User's ID
 * @param {Object} userProfile - User's profile for context
 * @returns {Promise<Object>} Conversation session
 */
export async function startConversation(userId, userProfile) {
  return querySoulFamilyAgent(
    'Hello! I want to discover my Soul Family connections. ' +
    'Can you help me understand my elemental nature and find compatible profiles?',
    { userId, userProfile, isNewSession: true }
  );
}

/**
 * Continue a conversation with the agent
 * @param {string} message - User's follow-up message
 * @param {string} sessionId - Conversation session ID
 * @returns {Promise<Object>} Agent response
 */
export async function continueConversation(message, sessionId) {
  return querySoulFamilyAgent(message, { sessionId });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse agent response for UI display
 * @param {Object} agentResponse - Raw agent response
 * @returns {Object} Parsed response for UI
 */
export function parseAgentResponse(agentResponse) {
  if (!agentResponse.success) {
    return {
      type: 'error',
      message: agentResponse.message || 'An error occurred',
      profiles: [],
      insights: null
    };
  }

  const response = agentResponse.response;

  // Try to extract structured data from response
  const profiles = response.profiles || response.matches || [];
  const insights = response.insights || response.analysis || null;
  const text = typeof response === 'string' ? response : response.text || response.message || '';

  return {
    type: profiles.length > 0 ? 'profiles' : 'text',
    message: text,
    profiles: profiles.map(p => ({
      id: p.id || p.userId,
      name: p.name || p.displayName || 'Anonymous',
      dayMaster: p.dayMaster || p.day_master || 'Unknown',
      dominantElement: p.dominantElement || p.dominant_element || 'Unknown',
      compatibilityScore: p.compatibilityScore || p.compatibility_score || 0,
      connectionType: p.connectionType || p.connection_type || 'soul_connection',
      summary: p.summary || p.description || ''
    })),
    insights
  };
}

/**
 * Get connection type styling
 * @param {string} connectionType - Connection type identifier
 * @returns {Object} Styling info for the connection type
 */
export function getConnectionStyle(connectionType) {
  const styles = {
    kindred_spirit: {
      label: 'Kindred Spirit',
      color: '#9b59b6',
      bgColor: 'rgba(155, 89, 182, 0.1)',
      icon: 'users'
    },
    amplifier: {
      label: 'Amplifier',
      color: '#e74c3c',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      icon: 'fire'
    },
    anchor: {
      label: 'Anchor',
      color: '#27ae60',
      bgColor: 'rgba(39, 174, 96, 0.1)',
      icon: 'anchor'
    },
    growth_catalyst: {
      label: 'Growth Catalyst',
      color: '#3498db',
      bgColor: 'rgba(52, 152, 219, 0.1)',
      icon: 'seedling'
    },
    soul_connection: {
      label: 'Soul Connection',
      color: '#f39c12',
      bgColor: 'rgba(243, 156, 18, 0.1)',
      icon: 'star'
    }
  };

  return styles[connectionType] || styles.soul_connection;
}

export default {
  isAgentConfigured,
  querySoulFamilyAgent,
  findByDayMaster,
  findComplementaryElements,
  findSoulFamilyByPersonality,
  getSynastryInsights,
  getSoulFamilyNetwork,
  searchProfiles,
  startConversation,
  continueConversation,
  parseAgentResponse,
  getConnectionStyle
};
