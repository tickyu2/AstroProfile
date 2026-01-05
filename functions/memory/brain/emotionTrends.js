/**
 * ============================================================================
 * GENESIS LUNA - EMOTION TRENDS (Luna's Brain)
 * ============================================================================
 * Track and analyze user's emotional patterns over time.
 * Helps Luna understand long-term emotional patterns.
 *
 * Functions:
 * - getEmotionTrends: Analyze emotion patterns over time range
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  EMOTION TREND ANALYSIS                                                 │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                     30-DAY EMOTION TIMELINE                        ││
 * │  │                                                                     ││
 * │  │  Intensity                                                         ││
 * │  │     │                    ╱╲                                        ││
 * │  │  1.0├────────────────────/──\───────────────────────              ││
 * │  │     │   ╱╲    ╱╲       ╱    ╲                                      ││
 * │  │  0.5├──/──\──/──\─────/──────\────────────────────                ││
 * │  │     │╱    ╲╱    ╲   ╱        ╲   ╱╲                               ││
 * │  │  0.0├──────────────\/──────────\/──\───────────────               ││
 * │  │     └────────────────────────────────────────────────▶            ││
 * │  │       Day 1        Day 15        Day 30                           ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  Trend Output:                                                           │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │ Most common mood: reflective                                       ││
 * │  │ Average intensity: 0.65                                            ││
 * │  │ High vulnerability rate: 25%                                       ││
 * │  │ Emotional range: [anxious, hopeful, nostalgic, content]           ││
 * │  │ Session count: 12                                                  ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Path: users/{userId}/memory/{profileId}/soulPartner/emotionLogs/entries
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// GET EMOTION TRENDS
// ============================================================================

/**
 * Get emotion trends for a user over time
 * Useful for Luna to understand long-term emotional patterns
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} dayRange - Days to analyze (default 30)
 */
const getEmotionTrends = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, dayRange = 30 } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dayRange);

    const emotionLogsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('emotionLogs')
      .collection('entries');

    const snapshot = await emotionLogsRef
      .where('timestamp', '>=', cutoffDate)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()?.toISOString()
    }));

    // Calculate trends
    const moodCounts = {};
    const arcMoods = [];
    let totalIntensity = 0;
    let highVulnerabilityCount = 0;
    let lowEnergyCount = 0;

    for (const log of logs) {
      // Count moods
      if (log.dominantMood) {
        moodCounts[log.dominantMood] = (moodCounts[log.dominantMood] || 0) + 1;
      }
      // Collect arc moods
      if (log.emotionalArc) {
        arcMoods.push(...log.emotionalArc);
      }
      // Sum intensity
      totalIntensity += log.intensityPeak || 0;
      // Count high vulnerability
      if (log.vulnerabilityLevel === 'high') {
        highVulnerabilityCount++;
      }
      // Count low energy
      if (log.energyLevel === 'low') {
        lowEnergyCount++;
      }
    }

    // Sort moods by frequency
    const sortedMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1]);

    const trends = {
      mostCommonMood: sortedMoods[0]?.[0] || 'unknown',
      moodDistribution: Object.fromEntries(sortedMoods.slice(0, 5)),
      averageIntensity: logs.length > 0 ? (totalIntensity / logs.length).toFixed(2) : 0,
      highVulnerabilityRate: logs.length > 0
        ? (highVulnerabilityCount / logs.length * 100).toFixed(1) + '%'
        : '0%',
      lowEnergyRate: logs.length > 0
        ? (lowEnergyCount / logs.length * 100).toFixed(1) + '%'
        : '0%',
      emotionalRange: [...new Set(Object.keys(moodCounts))],
      arcMoodsFrequency: calculateMoodFrequency(arcMoods),
      sessionCount: logs.length,
      dayRange
    };

    console.log(`📊 Emotion trends for ${profileId}:`, {
      mostCommon: trends.mostCommonMood,
      sessions: trends.sessionCount
    });

    return { success: true, logs, trends };

  } catch (error) {
    console.error('❌ Get emotion trends error:', error);
    return { success: true, logs: [], trends: {} };
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate frequency of moods in emotional arcs
 */
function calculateMoodFrequency(moods) {
  const frequency = {};
  for (const mood of moods) {
    if (mood) {
      frequency[mood] = (frequency[mood] || 0) + 1;
    }
  }
  return Object.fromEntries(
    Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getEmotionTrends
};
