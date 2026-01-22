/**
 * Harmonic Detection System - Example Outputs
 *
 * Demonstrates how to use:
 * - buildHarmonicHeatmap()
 * - computeOmniphonicScore()
 * - generateHarmonicNarrative()
 *
 * Run with: node src/services/harmonic/examples/harmonicExample.js
 */

import {
  buildHarmonicHeatmap,
  computeOmniphonicScore,
  computeOmniphonicMetrics,
  generateHarmonicNarrative,
  HARMONIC_CLUSTERS
} from '../HarmonicVisualization.js';

// ============================================================================
// EXAMPLE 1: Mock detector results (50 detectors, every other triggered)
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 1: Mock Detector Results (50% activation)');
console.log('═══════════════════════════════════════════════════════════════\n');

const mockResults50Percent = Array.from({ length: 50 }, (_, i) => {
  const triggered = i % 2 === 0; // every other detector
  return triggered
    ? {
        name: `detector-${i + 1}`,
        triggered: true,
        harmonyBoost: 0.4 + (i % 5) * 0.05,
        bonus: 0.2 + (i % 3) * 0.03,
        flag: `detector-${i + 1}-flag`,
        details: `Harmony detected in chamber ${i + 1}`
      }
    : { name: `detector-${i + 1}`, triggered: false };
});

const heatmap1 = buildHarmonicHeatmap(mockResults50Percent);
const score1 = computeOmniphonicScore(heatmap1);
const metrics1 = computeOmniphonicMetrics(heatmap1);
const narrative1 = generateHarmonicNarrative(heatmap1, score1);

console.log('Heatmap (first 5 cells):');
console.log(JSON.stringify(heatmap1.slice(0, 5), null, 2));
console.log('\nOmniphonic Score:', score1);
console.log('\nMetrics Summary:');
console.log('  - Active Chambers:', metrics1.activeChambers, '/', metrics1.totalChambers);
console.log('  - Activation Rate:', metrics1.activationRate + '%');
console.log('  - Strength:', metrics1.strength);
console.log('\nNarrative (truncated):');
console.log(narrative1.slice(0, 800) + '...\n');

// ============================================================================
// EXAMPLE 2: High activation scenario (80% triggered)
// ============================================================================

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 2: High Activation Scenario (80% activation)');
console.log('═══════════════════════════════════════════════════════════════\n');

const mockResultsHigh = Array.from({ length: 50 }, (_, i) => {
  const triggered = i % 5 !== 0; // 80% triggered (skip every 5th)
  return triggered
    ? {
        name: HARMONIC_CLUSTERS[i],
        triggered: true,
        harmonyBoost: 0.5 + (i % 4) * 0.1,
        bonus: 0.25 + (i % 3) * 0.05,
        flag: `${HARMONIC_CLUSTERS[i]}-harmony`,
        details: `Strong harmony in ${HARMONIC_CLUSTERS[i]} dimension`
      }
    : { name: HARMONIC_CLUSTERS[i], triggered: false };
});

const heatmap2 = buildHarmonicHeatmap(mockResultsHigh);
const score2 = computeOmniphonicScore(heatmap2);
const metrics2 = computeOmniphonicMetrics(heatmap2);

console.log('Omniphonic Score:', score2);
console.log('Strength:', metrics2.strength);
console.log('Active Chambers:', metrics2.activeChambers);
console.log('\nFamily Scores:');
Object.entries(metrics2.familyScores).forEach(([family, data]) => {
  console.log(`  - ${family}: ${data.activationRate}% (${data.activeChambers}/${data.totalChambers})`);
});

// ============================================================================
// EXAMPLE 3: Low activation scenario (20% triggered)
// ============================================================================

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 3: Low Activation Scenario (20% activation)');
console.log('═══════════════════════════════════════════════════════════════\n');

const mockResultsLow = Array.from({ length: 50 }, (_, i) => {
  const triggered = i % 5 === 0; // only 20% triggered
  return triggered
    ? {
        name: HARMONIC_CLUSTERS[i],
        triggered: true,
        harmonyBoost: 0.3 + (i % 3) * 0.05,
        bonus: 0.15 + (i % 2) * 0.03,
        flag: `${HARMONIC_CLUSTERS[i]}-harmony`,
        details: `Emerging harmony in ${HARMONIC_CLUSTERS[i]} dimension`
      }
    : { name: HARMONIC_CLUSTERS[i], triggered: false };
});

const heatmap3 = buildHarmonicHeatmap(mockResultsLow);
const score3 = computeOmniphonicScore(heatmap3);
const metrics3 = computeOmniphonicMetrics(heatmap3);

console.log('Omniphonic Score:', score3);
console.log('Strength:', metrics3.strength);
console.log('Active Chambers:', metrics3.activeChambers);
console.log('Interpretation:', metrics3.interpretation);

// ============================================================================
// EXAMPLE 4: Full narrative output
// ============================================================================

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('EXAMPLE 4: Full Narrative Output');
console.log('═══════════════════════════════════════════════════════════════\n');

const narrative2 = generateHarmonicNarrative(heatmap2, score2);
console.log(narrative2);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Examples complete.');
console.log('═══════════════════════════════════════════════════════════════');
