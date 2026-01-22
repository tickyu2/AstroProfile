/**
 * BaZi Compatibility Service
 * Calls the Python Cloud Function for BaZi-specific synastry analysis
 *
 * Features:
 * - Liu He (Six Harmonies)
 * - San He (Three Harmonies / Seasonal Trines)
 * - Chong (Six Clashes)
 * - Hai (Six Harms)
 * - Xing (Three Punishments)
 * - Relationship Axes scoring
 */

// Cloud Function base URL - update for production
const CLOUD_FUNCTION_URL = import.meta.env.VITE_CLOUD_FUNCTION_URL || 'http://127.0.0.1:5001/genesis-ccc/us-central1';

/**
 * Calculate BaZi compatibility between two people
 * @param {Object} user1 - First person's birth data
 * @param {Object} user2 - Second person's birth data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Compatibility analysis result
 */
export async function calculateBaZiCompatibility(user1, user2, options = {}) {
  const {
    includeMatrix = true,
    includeInsights = true,
    includeExplanations = false
  } = options;

  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/bazi_compatibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1: {
          birthDate: user1.birthDate,
          birthTime: user1.birthTime || '12:00',
          isMale: user1.isMale !== undefined ? user1.isMale : true
        },
        user2: {
          birthDate: user2.birthDate,
          birthTime: user2.birthTime || '12:00',
          isMale: user2.isMale !== undefined ? user2.isMale : false
        },
        includeMatrix,
        includeInsights,
        includeExplanations
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to calculate compatibility');
    }

    return await response.json();
  } catch (error) {
    console.error('BaZi Compatibility Error:', error);
    throw error;
  }
}

/**
 * Calculate compatibility using pre-computed BaZi charts
 * @param {Object} chart1 - First person's BaZi chart
 * @param {Object} chart2 - Second person's BaZi chart
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Compatibility analysis result
 */
export async function calculateBaZiCompatibilityFromCharts(chart1, chart2, options = {}) {
  const {
    includeMatrix = true,
    includeInsights = true,
    includeExplanations = false
  } = options;

  try {
    const response = await fetch(`${CLOUD_FUNCTION_URL}/bazi_compatibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chart1,
        chart2,
        includeMatrix,
        includeInsights,
        includeExplanations
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to calculate compatibility');
    }

    return await response.json();
  } catch (error) {
    console.error('BaZi Compatibility Error:', error);
    throw error;
  }
}

/**
 * Get interaction type display info
 * @param {string} interaction - Interaction type
 * @returns {Object} Display info with label, color, emoji
 */
export function getInteractionDisplay(interaction) {
  const displays = {
    trine: {
      label: 'San He (Trine)',
      labelCN: '三合',
      color: '#10b981', // emerald
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-300',
      emoji: '+++',
      description: 'Seasonal harmony - natural flow and support'
    },
    harmony: {
      label: 'Liu He (Harmony)',
      labelCN: '六合',
      color: '#3b82f6', // blue
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      emoji: '++',
      description: 'Six harmonies - blending and combination'
    },
    clash: {
      label: 'Chong (Clash)',
      labelCN: '冲',
      color: '#ef4444', // red
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-300',
      emoji: '---',
      description: 'Opposition - dynamic tension and conflict'
    },
    harm: {
      label: 'Hai (Harm)',
      labelCN: '害',
      color: '#f97316', // orange
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-300',
      emoji: '--',
      description: 'Hidden friction - subtle undermining'
    },
    punishment: {
      label: 'Xing (Punishment)',
      labelCN: '刑',
      color: '#eab308', // yellow
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-300',
      emoji: '-',
      description: 'Karmic lessons - growth through challenge'
    },
    neutral: {
      label: 'Neutral',
      labelCN: '中',
      color: '#6b7280', // gray
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400',
      emoji: '',
      description: 'No significant interaction'
    },
    unknown: {
      label: 'Unknown',
      labelCN: '?',
      color: '#6b7280',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400',
      emoji: '?',
      description: 'Missing data'
    }
  };

  return displays[interaction] || displays.unknown;
}

/**
 * Get compatibility level display info
 * @param {number} score - Overall compatibility score (0-1)
 * @returns {Object} Display info with level, color, emoji
 */
export function getCompatibilityLevel(score) {
  if (score >= 0.85) {
    return {
      level: 'Exceptional',
      description: 'Deep natural harmony',
      color: '#10b981',
      emoji: '+++++',
      bgGradient: 'from-emerald-600/20 to-green-600/20'
    };
  }
  if (score >= 0.70) {
    return {
      level: 'Strong',
      description: 'Natural compatibility with minor adjustments',
      color: '#3b82f6',
      emoji: '++++',
      bgGradient: 'from-blue-600/20 to-cyan-600/20'
    };
  }
  if (score >= 0.55) {
    return {
      level: 'Good',
      description: 'Solid foundation for growth together',
      color: '#8b5cf6',
      emoji: '+++',
      bgGradient: 'from-purple-600/20 to-violet-600/20'
    };
  }
  if (score >= 0.40) {
    return {
      level: 'Moderate',
      description: 'Requires conscious effort and understanding',
      color: '#f59e0b',
      emoji: '++',
      bgGradient: 'from-amber-600/20 to-orange-600/20'
    };
  }
  return {
    level: 'Challenging',
    description: 'Significant work needed for harmony',
    color: '#ef4444',
    emoji: '+',
    bgGradient: 'from-red-600/20 to-rose-600/20'
  };
}

/**
 * Get pillar meaning descriptions
 * @param {string} pillar - Pillar name (year, month, day, hour, dm)
 * @returns {Object} Pillar info with meaning and life area
 */
export function getPillarMeaning(pillar) {
  const meanings = {
    Year: {
      meaning: 'Ancestry & Social Circles',
      lifeArea: 'Parents, grandparents, early childhood (0-15)',
      emoji: '+'
    },
    Month: {
      meaning: 'Career & Siblings',
      lifeArea: 'Work relationships, ambitions, siblings (15-30)',
      emoji: '+'
    },
    Day: {
      meaning: 'Self & Spouse',
      lifeArea: 'Marriage, inner character, self-identity (30-45)',
      emoji: '+'
    },
    Hour: {
      meaning: 'Children & Legacy',
      lifeArea: 'Children, students, later life projects (45-60)',
      emoji: '+'
    },
    DayMaster: {
      meaning: 'Core Identity',
      lifeArea: 'Your fundamental nature and approach to life',
      emoji: '+'
    }
  };

  return meanings[pillar] || { meaning: pillar, lifeArea: '', emoji: '' };
}

/**
 * Get element display info
 * @param {string} element - Element name
 * @returns {Object} Display info with color and emoji
 */
export function getElementDisplay(element) {
  const displays = {
    Wood: { color: '#10b981', emoji: '+', bgColor: 'bg-emerald-500/20' },
    Fire: { color: '#ef4444', emoji: '+', bgColor: 'bg-red-500/20' },
    Earth: { color: '#f59e0b', emoji: '+', bgColor: 'bg-amber-500/20' },
    Metal: { color: '#94a3b8', emoji: '+', bgColor: 'bg-slate-500/20' },
    Water: { color: '#3b82f6', emoji: '+', bgColor: 'bg-blue-500/20' }
  };

  return displays[element] || { color: '#6b7280', emoji: '?', bgColor: 'bg-gray-500/20' };
}

export default {
  calculateBaZiCompatibility,
  calculateBaZiCompatibilityFromCharts,
  getInteractionDisplay,
  getCompatibilityLevel,
  getPillarMeaning,
  getElementDisplay
};
