/**
 * ================================================================================
 * CATHEDRAL INDEX - Central Registry for All Cathedral Services
 * ================================================================================
 *
 * The Cathedral is a unified compatibility analysis system with two wings:
 *
 * SOLAR AXIS (Supernova) → Where relationships break (50 collapse detectors)
 * LUNA AXIS (Harmonic)   → Where relationships thrive (50 harmony detectors)
 *
 * This index provides a central registry for all Cathedral services,
 * enabling unified access to:
 * - Harmonic Detection Engine
 * - Supernova Detection Engine
 * - Combined Cathedral Analysis
 *
 * ================================================================================
 */

import {
  HarmonicDetector,
  getHarmonicAnalysis,
  getHarmonicBonus
} from '../services/harmonic/HarmonicDetector.js';

import {
  buildHarmonicHeatmap,
  buildHeatmapFromDetectorResults,
  computeOmniphonicScore,
  computeOmniphonicMetrics,
  generateHarmonicNarrative,
  HARMONIC_CLUSTERS,
  CLUSTER_FAMILIES
} from '../services/harmonic/HarmonicVisualization.js';

/**
 * @typedef {Object} CathedralServiceContext
 * @property {Object} profiles - Object containing profileA and profileB
 * @property {Object} profiles.A - First profile with raw_traits
 * @property {Object} profiles.B - Second profile with raw_traits
 * @property {Array} [detectors] - Optional pre-computed detector outputs (1-50)
 */

/**
 * @typedef {Object} HarmonyEngineResult
 * @property {Array} heatmap - 50-cell harmonic heatmap
 * @property {number} omniphonicScore - Overall harmony score (0-100)
 * @property {Object} metrics - Detailed metrics breakdown
 * @property {string} narrative - Markdown-formatted harmonic narrative
 * @property {Object} raw - Raw HarmonicDetector output
 */

/**
 * Central Cathedral Index - Registry for all Cathedral services
 */
export const CathedralIndex = {
  /**
   * Emotional Harmony Engine (Luna Wing)
   *
   * Analyzes two profiles for harmonic resonance across 50 dimensions.
   * Returns heatmap, omniphonic score, metrics, and narrative.
   */
  emotionalHarmony: {
    id: 'emotional_harmony_engine_v1',
    label: 'Emotional Harmony Engine',
    version: '1.0.0',
    axis: 'Luna',
    chambers: 50,

    /**
     * Run the Emotional Harmony Engine
     *
     * @param {CathedralServiceContext} context - Profiles and optional pre-computed detectors
     * @returns {HarmonyEngineResult} Complete harmony analysis
     */
    run(context) {
      const { profiles, detectors: precomputedDetectors } = context;

      // Run HarmonicDetector if detectors not pre-computed
      const rawResult = HarmonicDetector(profiles.A, profiles.B);

      // Build heatmap from detector results
      const heatmap = buildHeatmapFromDetectorResults(rawResult);

      // Compute scores and metrics
      const omniphonicScore = computeOmniphonicScore(heatmap);
      const metrics = computeOmniphonicMetrics(heatmap);

      // Generate narrative
      const narrative = generateHarmonicNarrative(heatmap, omniphonicScore);

      return {
        heatmap,
        omniphonicScore,
        metrics,
        narrative,
        raw: rawResult
      };
    },

    /**
     * Quick harmony check
     *
     * @param {Object} profileA - First profile
     * @param {Object} profileB - Second profile
     * @returns {boolean} True if any harmony detected
     */
    quickCheck(profileA, profileB) {
      const result = HarmonicDetector(profileA, profileB);
      return result.triggered;
    },

    /**
     * Get harmony bonus for compatibility scoring
     *
     * @param {Object} profileA - First profile
     * @param {Object} profileB - Second profile
     * @returns {Object} Bonus values for compatibility calculation
     */
    getBonus(profileA, profileB) {
      return getHarmonicBonus(profileA, profileB);
    },

    meta: {
      category: 'Luna Harmony',
      chambers: 50,
      outputKinds: ['heatmap', 'score', 'metrics', 'narrative'],
      clusters: HARMONIC_CLUSTERS,
      families: CLUSTER_FAMILIES
    }
  },

  /**
   * Supernova Detection Engine (Solar Wing)
   *
   * Placeholder for the Solar axis collapse detection system.
   * Analyzes two profiles for structural failure patterns across 50 dimensions.
   */
  supernovaCollapse: {
    id: 'supernova_collapse_engine_v1',
    label: 'Supernova Collapse Engine',
    version: '1.0.0',
    axis: 'Solar',
    chambers: 50,

    run(context) {
      // TODO: Integrate SupernovaDetector when ready
      console.warn('SupernovaCollapse engine not yet integrated');
      return {
        heatmap: [],
        collapseScore: 0,
        metrics: {},
        narrative: '',
        raw: null
      };
    },

    meta: {
      category: 'Solar Collapse',
      chambers: 50,
      outputKinds: ['heatmap', 'score', 'metrics', 'narrative']
    }
  },

  /**
   * Full Cathedral Analysis
   *
   * Runs both Luna (Harmony) and Solar (Supernova) engines,
   * then combines results into a unified Cathedral Report.
   */
  fullCathedralAnalysis: {
    id: 'cathedral_full_analysis_v1',
    label: 'Full Cathedral Analysis',
    version: '1.0.0',
    axes: ['Luna', 'Solar'],
    totalChambers: 100,

    /**
     * Run full Cathedral analysis (both wings)
     *
     * @param {CathedralServiceContext} context - Profiles context
     * @returns {Object} Combined Cathedral analysis
     */
    run(context) {
      const harmonyResult = CathedralIndex.emotionalHarmony.run(context);
      const collapseResult = CathedralIndex.supernovaCollapse.run(context);

      // Combined interpretation
      const cathedralScore = calculateCathedralScore(
        harmonyResult.omniphonicScore,
        collapseResult.collapseScore || 0
      );

      return {
        luna: harmonyResult,
        solar: collapseResult,
        combined: {
          cathedralScore,
          harmonyChambers: harmonyResult.metrics.activeChambers,
          collapseChambers: 0, // TODO: from supernova
          totalChambers: 100,
          interpretation: getCathedralInterpretation(cathedralScore, harmonyResult, collapseResult)
        }
      };
    },

    meta: {
      category: 'Cathedral',
      chambers: 100,
      outputKinds: ['luna', 'solar', 'combined']
    }
  }
};

/**
 * Calculate combined Cathedral Score
 *
 * Formula: (HarmonyScore * 0.6) + ((100 - CollapseScore) * 0.4)
 * Higher harmony = higher score
 * Higher collapse = lower score
 *
 * @param {number} harmonyScore - Omniphonic score (0-100)
 * @param {number} collapseScore - Supernova collapse score (0-100)
 * @returns {number} Combined Cathedral score (0-100)
 */
function calculateCathedralScore(harmonyScore, collapseScore) {
  const harmonyWeight = 0.6;
  const collapseWeight = 0.4;

  const harmonyContribution = harmonyScore * harmonyWeight;
  const collapseContribution = (100 - collapseScore) * collapseWeight;

  return Number((harmonyContribution + collapseContribution).toFixed(2));
}

/**
 * Generate Cathedral interpretation text
 */
function getCathedralInterpretation(cathedralScore, harmonyResult, collapseResult) {
  const harmonyStrength = harmonyResult.metrics.strength;
  const activeChambers = harmonyResult.metrics.activeChambers;

  if (cathedralScore >= 80) {
    return `Exceptional Cathedral alignment. The relationship shows strong harmonic resonance (${activeChambers}/50 chambers active) with minimal collapse patterns. This is a structurally sound foundation for deep, sustained connection.`;
  }
  if (cathedralScore >= 60) {
    return `Strong Cathedral structure. The ${harmonyStrength} harmony (${activeChambers}/50 chambers) provides meaningful foundations, though some areas may benefit from conscious attention.`;
  }
  if (cathedralScore >= 40) {
    return `Developing Cathedral pattern. The relationship has notable strengths in ${activeChambers} harmony chambers, with room for growth in both resonance and stability.`;
  }
  return `Emerging Cathedral structure. While foundational patterns are still forming, conscious attention to both harmony cultivation and conflict resolution can strengthen the relational architecture.`;
}

/**
 * Convenience function to run harmony analysis
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {HarmonyEngineResult} Harmony analysis result
 */
export function runHarmonyAnalysis(profileA, profileB) {
  return CathedralIndex.emotionalHarmony.run({
    profiles: { A: profileA, B: profileB }
  });
}

/**
 * Convenience function to run full Cathedral analysis
 *
 * @param {Object} profileA - First profile
 * @param {Object} profileB - Second profile
 * @returns {Object} Full Cathedral analysis
 */
export function runCathedralAnalysis(profileA, profileB) {
  return CathedralIndex.fullCathedralAnalysis.run({
    profiles: { A: profileA, B: profileB }
  });
}

export default CathedralIndex;
