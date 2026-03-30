/**
 * Python Cloud Functions Service
 * Frontend integration for GENESIS Python-powered features
 *
 * Swiss Ephemeris calculations + Neo4j graph queries
 */

import { auth } from '../config/firebase';

// Cloud Run deployed functions base suffix
const CLOUD_RUN_SUFFIX = '-sjpjwnbsmq-uc.a.run.app';

/**
 * Get authorization headers with Firebase ID token
 * @returns {Promise<Object>} Headers object with Content-Type and optional Authorization
 */
async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Build Cloud Run URL for a function
const getCloudRunUrl = (functionName) => {
  // Convert function name to Cloud Run format (underscores to hyphens)
  const urlName = functionName.replace(/_/g, '-');
  return `https://${urlName}${CLOUD_RUN_SUFFIX}`;
};

/**
 * Check Python functions health status
 */
export async function checkPythonHealth() {
  try {
    const response = await fetch(getCloudRunUrl('python_health'));
    return await response.json();
  } catch (error) {
    console.error('Python health check failed:', error);
    return { status: 'unavailable', error: error.message };
  }
}

// =============================================================================
// ASTROLOGY CALCULATIONS (Swiss Ephemeris)
// =============================================================================

/**
 * Calculate a complete natal chart using Swiss Ephemeris
 * @param {Object} birthData - Birth data
 * @param {string} birthData.birthDate - YYYY-MM-DD format
 * @param {string} birthData.birthTime - HH:MM format
 * @param {number} birthData.latitude - Birth location latitude
 * @param {number} birthData.longitude - Birth location longitude
 * @param {string} [birthData.timezone] - Timezone string (e.g., "America/New_York")
 * @returns {Promise<Object>} Complete natal chart with planets, houses, aspects
 */
export async function calculateNatalChart(birthData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('calculate_natal_chart'), {
      method: 'POST',
      headers,
      body: JSON.stringify(birthData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Natal chart calculation failed:', error);
    throw error;
  }
}

/**
 * Get planetary positions for a specific date/time
 * @param {string} datetime - ISO datetime string
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Planetary positions
 */
export async function getPlanetaryPositions(datetime, latitude = 0, longitude = 0) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('calculate_planetary_positions'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ datetime, latitude, longitude })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Planetary positions calculation failed:', error);
    throw error;
  }
}

/**
 * Get Swiss Ephemeris-precise Sun ingress dates for all 12 signs in a year.
 * @param {number} year - Calendar year (e.g., 1963)
 * @returns {Promise<Object>} { year, ingresses: [{ sign, datetime_utc, month, day, hour, minute, ... }] }
 */
export async function getSeasonalIngresses(year) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('seasonal_ingresses'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ year })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Seasonal ingresses fetch failed:', error);
    throw error;
  }
}

/**
 * Calculate elemental balance from planetary positions
 * @param {Object} planets - Planetary positions object
 * @returns {Promise<Object>} Elemental balance percentages
 */
export async function calculateElementalBalance(planets) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('calculate_elemental_balance'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ planets })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Elemental balance calculation failed:', error);
    throw error;
  }
}

/**
 * Run Birth Time Tuning Lab — sweep a range of birth times and score each minute
 * @param {Object} params - Tuning lab parameters
 * @param {string} params.birthDate - YYYY-MM-DD format
 * @param {string} params.birthTime - HH:MM center time
 * @param {number} params.latitude - Birth location latitude
 * @param {number} params.longitude - Birth location longitude
 * @param {string} [params.timezone='UTC'] - Timezone string
 * @param {number} [params.sweepMinutes=30] - Minutes to sweep each direction
 * @param {number} [params.stepSeconds=60] - Step size in seconds
 * @param {string} [params.profile='defaultBalanced'] - Scoring profile
 * @param {Array}  [params.events=[]] - Known life events for backtesting
 * @returns {Promise<Object>} { success, result: { minuteScores, top5, bestMinute, ... } }
 */
export async function runBirthTimeTuningLab(params) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('birth_time_tuning_lab'), {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Birth Time Tuning Lab failed:', error);
    throw error;
  }
}

// =============================================================================
// BATCH CHART POSITIONS (Playback Animation)
// =============================================================================

/**
 * Batch-compute lightweight chart positions for playback animation.
 * Uses the fast Swiss Ephemeris path (~15ms/chart) — no scoring, no aspects.
 *
 * @param {Object} params
 * @param {string} params.birthDate - YYYY-MM-DD
 * @param {number} params.latitude
 * @param {number} params.longitude
 * @param {string} [params.timezone='UTC']
 * @param {number} [params.startMinutes=0] - 0-1439
 * @param {number} [params.endMinutes=1439] - 0-1439
 * @param {number} [params.stepMinutes=5] - 1 or 5
 * @returns {Promise<Object>} { success, result: { frames, totalFrames, computeMs } }
 */
export async function batchChartPositions(params) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('batch_chart_positions'), {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Batch chart positions failed:', error);
    throw error;
  }
}

// =============================================================================
// UNIFIED PROFILE COMPUTATION (Python-First Architecture)
// =============================================================================

/**
 * Compute complete unified profile: BaZi + Western + Vedic + Unified Vector
 * This is the canonical computation endpoint - output is stored directly in Firebase.
 *
 * @param {Object} birthData - Birth data
 * @param {string} birthData.birthDate - YYYY-MM-DD format
 * @param {string} birthData.birthTime - HH:MM format
 * @param {number} birthData.latitude - Birth location latitude
 * @param {number} birthData.longitude - Birth location longitude
 * @param {string} birthData.timezone - Timezone string (e.g., "Asia/Bangkok")
 * @param {string} birthData.gender - "male" or "female" (for BaZi DaYun direction)
 * @returns {Promise<Object>} Canonical profile with bazi, western, vedic, unified
 */
export async function computeUnifiedProfile(birthData) {
  try {
    console.log('🐍 [computeUnifiedProfile] Calling Python endpoint with:', birthData);

    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('compute_unified_profile'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        birth: {
          birthDate: birthData.birthDate,
          birthTime: birthData.birthTime || '12:00',
          latitude: birthData.latitude || 0,
          longitude: birthData.longitude || 0,
          timezone: birthData.timezone || 'UTC',
          gender: birthData.gender || 'male'
        },
        computeOptions: {
          includeBazi: true,
          includeWestern: true,
          includeVedic: true,
          includeUnified: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [computeUnifiedProfile] Python returned canonical profile:', {
      hasBazi: !!result.bazi,
      hasWestern: !!result.western,
      hasVedic: !!result.vedic,
      hasUnified: !!result.unified,
      computeVersion: result.computeVersion,
      planetKeys: result.western?.planets ? Object.keys(result.western.planets) : [],
      asteroids: ['chiron','ceres','pallas','juno','vesta'].map(k => `${k}: ${result.western?.planets?.[k] ? 'YES' : 'MISSING'}`),
    });
    if (result._ephe_diag) {
      const d = result._ephe_diag;
      console.log(`🔭 [EPHE] __file__=${d.__file__}, cwd=${d.cwd}, resolved=${d.resolved}`);
      console.log(`🔭 [EPHE] files=${JSON.stringify(d.files)}`);
      (d.candidates_tried || []).forEach(c => console.log(`🔭 [EPHE] candidate: ${c.path} => exists=${c.exists}`));
      if (d.root_contents) console.log(`🔭 [EPHE] root_contents=${JSON.stringify(d.root_contents)}`);
    }

    return result;
  } catch (error) {
    console.error('❌ [computeUnifiedProfile] Python computation failed:', error);
    throw error;
  }
}

/**
 * Compute compatibility between two profiles
 * @param {Object} profileA - First person's birth data
 * @param {Object} profileB - Second person's birth data
 * @param {Object} [options] - Compatibility options (weights, etc.)
 * @returns {Promise<Object>} Canonical compatibility result
 */
export async function computeUnifiedCompatibility(profileA, profileB, options = {}) {
  try {
    console.log('🐍 [computeUnifiedCompatibility] Calling Python endpoint');

    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('compute_unified_compatibility'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        profileA: {
          birthDate: profileA.birthDate,
          birthTime: profileA.birthTime || '12:00',
          latitude: profileA.latitude || 0,
          longitude: profileA.longitude || 0,
          timezone: profileA.timezone || 'UTC',
          gender: profileA.gender || 'male'
        },
        profileB: {
          birthDate: profileB.birthDate,
          birthTime: profileB.birthTime || '12:00',
          latitude: profileB.latitude || 0,
          longitude: profileB.longitude || 0,
          timezone: profileB.timezone || 'UTC',
          gender: profileB.gender || 'male'
        },
        options
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [computeUnifiedCompatibility] Result:', {
      totalScore: result.totalScore,
      grade: result.grade,
      sections: result.sections?.length
    });

    return result;
  } catch (error) {
    console.error('❌ [computeUnifiedCompatibility] Failed:', error);
    throw error;
  }
}

// =============================================================================
// SYNASTRY & COMPATIBILITY
// =============================================================================

/**
 * Calculate synastry (compatibility) between two natal charts
 * @param {Object} chart1 - First person's natal chart
 * @param {Object} chart2 - Second person's natal chart
 * @returns {Promise<Object>} Synastry analysis with compatibility score
 */
export async function calculateSynastry(chart1, chart2) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('calculate_synastry'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ chart1, chart2 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Synastry calculation failed:', error);
    throw error;
  }
}

// =============================================================================
// NEO4J GRAPH QUERIES (Soul Family)
// =============================================================================

/**
 * Find Soul Family matches based on elemental compatibility
 * @param {string} userId - Current user's ID
 * @param {Object} elementalProfile - User's elemental percentages
 * @param {number} [limit=10] - Maximum matches to return
 * @returns {Promise<Object>} Soul Family matches
 */
export async function findSoulFamily(userId, elementalProfile, limit = 10) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('find_soul_family'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, elementalProfile, limit })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Soul Family search failed:', error);
    throw error;
  }
}

/**
 * Store a user profile as a node in Neo4j graph
 * @param {string} userId - User's ID
 * @param {Object} profile - Profile data
 * @returns {Promise<Object>} Created node data
 */
export async function storeProfileNode(userId, profile) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(getCloudRunUrl('store_profile_node'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, profile })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Profile node storage failed:', error);
    throw error;
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format a natal chart for display
 * @param {Object} chart - Raw natal chart data
 * @returns {Object} Formatted chart for UI display
 */
export function formatNatalChartForDisplay(chart) {
  if (!chart || !chart.planets) return null;

  return {
    // Big 3
    sunSign: chart.planets.sun?.sign || 'Unknown',
    moonSign: chart.planets.moon?.sign || 'Unknown',
    risingSign: chart.ascendant?.sign || 'Unknown',

    // Elements
    elements: chart.elements || { fire: 25, earth: 25, air: 25, water: 25 },
    dominantElement: chart.elements?.dominant?.element || 'Unknown',

    // Modalities
    modalities: chart.modalities || { cardinal: 33, fixed: 33, mutable: 34 },
    dominantModality: chart.modalities?.dominant || 'Unknown',

    // All planets formatted
    planets: Object.entries(chart.planets || {}).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      sign: data.sign || 'Unknown',
      degree: data.degree?.toFixed(2) || '0.00',
      retrograde: data.retrograde || false,
      element: data.element || 'Unknown',
      formatted: data.formatted || `${data.degree?.toFixed(2)}° ${data.sign}`
    })),

    // Aspects summary
    aspectCount: chart.aspects?.length || 0,
    majorAspects: (chart.aspects || []).filter(a =>
      ['conjunction', 'opposition', 'trine', 'square'].includes(a.aspect)
    ).length,

    // Raw data for advanced views
    raw: chart
  };
}

/**
 * Format synastry results for display
 * @param {Object} synastry - Raw synastry data
 * @returns {Object} Formatted synastry for UI display
 */
export function formatSynastryForDisplay(synastry) {
  if (!synastry) return null;

  const scoreCategory = synastry.overallScore >= 80 ? 'Excellent' :
                        synastry.overallScore >= 65 ? 'Good' :
                        synastry.overallScore >= 50 ? 'Moderate' :
                        'Challenging';

  return {
    overallScore: synastry.overallScore || 0,
    scoreCategory,
    aspectCount: synastry.aspectCount || 0,

    elementalCompatibility: {
      score: synastry.elementalCompatibility?.score || 0,
      dynamic: synastry.elementalCompatibility?.dynamic || 'Unknown',
      person1Element: synastry.elementalCompatibility?.person1_dominant || 'Unknown',
      person2Element: synastry.elementalCompatibility?.person2_dominant || 'Unknown'
    },

    interpretation: synastry.interpretation || {},

    // Significant aspects
    significantAspects: (synastry.aspects || [])
      .filter(a => a.significance?.includes('significant'))
      .map(a => ({
        planets: `${a.person1_planet} - ${a.person2_planet}`,
        aspect: a.aspect,
        significance: a.significance
      })),

    raw: synastry
  };
}

/**
 * Get connection type description for Soul Family
 * @param {string} connectionType - Type from Soul Family match
 * @returns {Object} Description and icon for the connection type
 */
export function getConnectionTypeInfo(connectionType) {
  const types = {
    kindred_spirit: {
      label: 'Kindred Spirit',
      description: 'Deep understanding - same elemental nature',
      icon: '👥',
      color: '#9b59b6'
    },
    amplifier: {
      label: 'Amplifier',
      description: 'Mutual boost - Fire + Air synergy',
      icon: '🔥',
      color: '#e74c3c'
    },
    anchor: {
      label: 'Anchor',
      description: 'Grounding stability - Earth + Water harmony',
      icon: '⚓',
      color: '#27ae60'
    },
    growth_catalyst: {
      label: 'Growth Catalyst',
      description: 'Learning opportunity - complementary elements',
      icon: '🌱',
      color: '#3498db'
    }
  };

  return types[connectionType] || {
    label: 'Soul Connection',
    description: 'Meaningful astrological connection',
    icon: '✨',
    color: '#f39c12'
  };
}


/**
 * Universal compatibility engine status
 */
export async function compatibilityEngineStatus() {
  const response = await fetch(getCloudRunUrl('compatibility_engine_status'));
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

/**
 * Upsert a user's compatibility vector profile (Swiss + psych overlays)
 */
export async function compatibilityUpsertProfile(payload) {
  const headers = await getAuthHeaders();
  const response = await fetch(getCloudRunUrl('compatibility_upsert_profile'), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  return await response.json();
}

/**
 * Match a user against database candidates via pgvector shortlist + deep scoring
 */
export async function compatibilityMatchUser(payload) {
  const headers = await getAuthHeaders();
  const response = await fetch(getCloudRunUrl('compatibility_match_user'), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  return await response.json();
}

/**
 * Explain compatibility for a specific pair of profiles
 */
export async function compatibilityExplainPair(payload) {
  const headers = await getAuthHeaders();
  const response = await fetch(getCloudRunUrl('compatibility_explain_pair'), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  return await response.json();
}

/**
 * Debug 72-zone mapping/comparison for a pair
 */
export async function compatibilityZoneDebugPair(payload) {
  const headers = await getAuthHeaders();
  const response = await fetch(getCloudRunUrl('compatibility_zone_debug_pair'), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  return await response.json();
}
export default {
  checkPythonHealth,
  calculateNatalChart,
  getPlanetaryPositions,
  calculateElementalBalance,
  runBirthTimeTuningLab,
  batchChartPositions,
  computeUnifiedProfile,
  computeUnifiedCompatibility,
  calculateSynastry,
  findSoulFamily,
  storeProfileNode,
  compatibilityEngineStatus,
  compatibilityUpsertProfile,
  compatibilityMatchUser,
  compatibilityExplainPair,
  compatibilityZoneDebugPair,
  formatNatalChartForDisplay,
  formatSynastryForDisplay,
  getConnectionTypeInfo
};





