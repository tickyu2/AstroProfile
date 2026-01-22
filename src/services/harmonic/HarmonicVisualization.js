/**
 * ================================================================================
 * HARMONIC VISUALIZATION ENGINE
 * ================================================================================
 *
 * Three interconnected systems for understanding the Luna Wing's output:
 *
 * 1. HARMONIC HEATMAP
 *    50-detector matrix visualizing which chambers activated and their values
 *
 * 2. OMNIPHONIC SCORE
 *    Single scalar (0-100) representing total emotional harmony field
 *
 * 3. HARMONIC NARRATIVE ENGINE
 *    Transforms heatmap + score into mythic, structured narrative
 *
 * ================================================================================
 */

/**
 * @typedef {Object} HarmonicHeatmapCell
 * @property {number} id - Detector ID (1-50)
 * @property {string} name - Detector name
 * @property {boolean} triggered - Whether the detector activated
 * @property {number} harmonyBoost - Harmony boost value (0 if not triggered)
 * @property {number} bonus - Bonus value (0 if not triggered)
 * @property {string} cluster - Category cluster name
 * @property {string} details - Explanation text if triggered
 */

/**
 * Cluster names for all 50 harmonic detectors
 * Maps each detector index to its thematic category
 */
const HARMONIC_CLUSTERS = [
  "Resonance",           // 1. emotionalResonanceAlignment
  "Safety",              // 2. emotionalSafetyCoherence
  "Priorities",          // 3. emotionalPriorityHarmony
  "Reciprocity",         // 4. emotionalReciprocityFlow
  "Communication",       // 5. emotionalCommunicationEase
  "Rhythm",              // 6. emotionalRhythmSynchrony
  "Stability",           // 7. emotionalStabilityResonance
  "Repair",              // 8. emotionalRepairHarmony
  "Trust",               // 9. emotionalTrustReinforcement
  "Intimacy",            // 10. emotionalIntimacyCoherence
  "Meaning",             // 11. emotionalMeaningMakingAlignment
  "Prediction",          // 12. emotionalPredictiveHarmony
  "Salience",            // 13. emotionalSalienceHarmony
  "Clarity",             // 14. emotionalSignalClarityAlignment
  "Context-Flow",        // 15. emotionalContextSwitchingFlow
  "Regulation",          // 16. emotionalRegulationSynergy
  "Motivation",          // 17. emotionalMotivationHarmony
  "Desire",              // 18. emotionalDesireSynchrony
  "Initiative",          // 19. emotionalInitiativeHarmony
  "Commitment",          // 20. emotionalCommitmentCoherence
  "Vulnerability",       // 21. emotionalVulnerabilityReciprocity
  "Resilience",          // 22. emotionalResilienceCoElevation
  "Equilibrium",         // 23. emotionalReciprocityEquilibrium
  "Presence",            // 24. emotionalPresenceSynchrony
  "Tempo",               // 25. emotionalTempoCompatibility
  "Boundaries",          // 26. emotionalBoundaryHarmony
  "Transparency",        // 27. emotionalTransparencyAlignment
  "Expectations",        // 28. emotionalExpectationHarmony
  "Timing",              // 29. emotionalReciprocityTimingHarmony
  "Responsiveness",      // 30. emotionalResponsivenessHarmony
  "Initiative-Response", // 31. emotionalInitiativeResponseCoherence
  "Attunement",          // 32. emotionalAttunementDensity
  "Co-Regulation",       // 33. emotionalCoRegulationHarmony
  "Repair-Rhythm",       // 34. emotionalRepairRhythmHarmony
  "Trust-Renewal",       // 35. emotionalTrustRenewalHarmony
  "Meaning-Reinforcement", // 36. emotionalMeaningReinforcementHarmony
  "Identity",            // 37. emotionalIdentityCoherence
  "Purpose",             // 38. emotionalPurposeAlignment
  "Values",              // 39. emotionalValueSystemHarmony
  "Life-Path",           // 40. emotionalLifePathHarmony
  "Legacy",              // 41. emotionalLegacyHarmony
  "Mythos",              // 42. emotionalMythosHarmony
  "Archetype",           // 43. emotionalArchetypeSynergy
  "Symbolic-Language",   // 44. emotionalSymbolicLanguageHarmony
  "Ritual",              // 45. emotionalRitualSynchrony
  "Seasonal",            // 46. emotionalSeasonalHarmony
  "Evolution",           // 47. emotionalEvolutionHarmony
  "Destiny",             // 48. emotionalDestinyCoherence
  "Transcendence",       // 49. emotionalTranscendenceHarmony
  "Omniphonic"           // 50. emotionalOmniphonicHarmony
];

/**
 * Higher-order cluster groupings for narrative synthesis
 */
const CLUSTER_FAMILIES = {
  Foundation: ["Resonance", "Safety", "Stability", "Trust"],
  Flow: ["Reciprocity", "Rhythm", "Tempo", "Timing", "Responsiveness"],
  Communication: ["Communication", "Clarity", "Transparency", "Symbolic-Language"],
  Meaning: ["Meaning", "Prediction", "Salience", "Context-Flow", "Meaning-Reinforcement"],
  Regulation: ["Regulation", "Co-Regulation", "Equilibrium", "Boundaries"],
  Connection: ["Intimacy", "Vulnerability", "Presence", "Attunement"],
  Drive: ["Motivation", "Desire", "Initiative", "Commitment", "Initiative-Response"],
  Repair: ["Repair", "Repair-Rhythm", "Trust-Renewal", "Resilience"],
  Identity: ["Identity", "Purpose", "Values", "Life-Path"],
  Transcendence: ["Legacy", "Mythos", "Archetype", "Ritual", "Seasonal", "Evolution", "Destiny", "Transcendence", "Omniphonic"]
};

/**
 * Build the Harmonic Heatmap from detector results
 *
 * @param {Array} detectorResults - Array of 50 detector outputs in order
 * @returns {HarmonicHeatmapCell[]} 50-cell heatmap array
 */
export function buildHarmonicHeatmap(detectorResults) {
  return detectorResults.map((result, index) => ({
    id: index + 1,
    name: result.name || result.flag || `Detector ${index + 1}`,
    triggered: result.triggered || false,
    harmonyBoost: result.triggered ? (result.harmonyBoost || 0) : 0,
    bonus: result.triggered ? (result.bonus || 0) : 0,
    cluster: HARMONIC_CLUSTERS[index] || `Unknown-${index}`,
    details: result.triggered ? (result.details || '') : ''
  }));
}

/**
 * Build the Harmonic Heatmap directly from HarmonicDetector results
 *
 * @param {Object} harmonicResults - Output from HarmonicDetector()
 * @returns {HarmonicHeatmapCell[]} 50-cell heatmap array
 */
export function buildHeatmapFromDetectorResults(harmonicResults) {
  // Create base cells for all 50 detectors
  const heatmap = HARMONIC_CLUSTERS.map((cluster, index) => ({
    id: index + 1,
    name: getDetectorNameByIndex(index),
    triggered: false,
    harmonyBoost: 0,
    bonus: 0,
    cluster: cluster,
    details: ''
  }));

  // Fill in triggered detectors from results
  if (harmonicResults.detectors) {
    harmonicResults.detectors.forEach(det => {
      const index = getDetectorIndexByName(det.name);
      if (index >= 0 && index < 50) {
        heatmap[index] = {
          ...heatmap[index],
          triggered: true,
          harmonyBoost: det.harmonyBoost || 0,
          bonus: det.bonus || 0,
          details: det.details || ''
        };
      }
    });
  }

  return heatmap;
}

/**
 * Compute the Omniphonic Score from the heatmap
 *
 * Formula: (∑harmonyBoost + ∑bonus) / 50 × 100
 * Scaled to 0-100
 *
 * @param {HarmonicHeatmapCell[]} heatmap - The 50-cell heatmap
 * @returns {number} Omniphonic Score (0-100)
 */
export function computeOmniphonicScore(heatmap) {
  const totalBoost = heatmap.reduce((sum, cell) => sum + cell.harmonyBoost, 0);
  const totalBonus = heatmap.reduce((sum, cell) => sum + cell.bonus, 0);

  const raw = totalBoost + totalBonus;
  const score = (raw / 50) * 100;

  return Number(score.toFixed(2));
}

/**
 * Compute detailed Omniphonic metrics
 *
 * @param {HarmonicHeatmapCell[]} heatmap - The 50-cell heatmap
 * @returns {Object} Detailed scoring breakdown
 */
export function computeOmniphonicMetrics(heatmap) {
  const triggered = heatmap.filter(c => c.triggered);
  const totalBoost = heatmap.reduce((sum, cell) => sum + cell.harmonyBoost, 0);
  const totalBonus = heatmap.reduce((sum, cell) => sum + cell.bonus, 0);

  // Calculate family scores
  const familyScores = {};
  Object.entries(CLUSTER_FAMILIES).forEach(([family, clusters]) => {
    const familyCells = heatmap.filter(c => clusters.includes(c.cluster));
    const familyActive = familyCells.filter(c => c.triggered);
    const familyBoost = familyCells.reduce((s, c) => s + c.harmonyBoost, 0);
    const familyBonus = familyCells.reduce((s, c) => s + c.bonus, 0);

    familyScores[family] = {
      activeChambers: familyActive.length,
      totalChambers: familyCells.length,
      activationRate: familyCells.length > 0
        ? Number(((familyActive.length / familyCells.length) * 100).toFixed(1))
        : 0,
      harmonyBoost: Number(familyBoost.toFixed(3)),
      bonus: Number(familyBonus.toFixed(3))
    };
  });

  const score = computeOmniphonicScore(heatmap);

  return {
    omniphonicScore: score,
    activeChambers: triggered.length,
    totalChambers: 50,
    activationRate: Number(((triggered.length / 50) * 100).toFixed(1)),
    totalHarmonyBoost: Number(totalBoost.toFixed(3)),
    totalBonus: Number(totalBonus.toFixed(3)),
    familyScores,
    strength: getOmniphonicStrength(score),
    interpretation: getOmniphonicInterpretation(score, triggered.length)
  };
}

/**
 * Generate the Harmonic Narrative from heatmap and score
 *
 * @param {HarmonicHeatmapCell[]} heatmap - The 50-cell heatmap
 * @param {number} omniphonicScore - The computed Omniphonic Score
 * @returns {string} Markdown-formatted narrative
 */
export function generateHarmonicNarrative(heatmap, omniphonicScore) {
  const triggered = heatmap.filter(c => c.triggered);
  const notTriggered = heatmap.filter(c => !c.triggered);

  // Cluster summaries
  const clusterCounts = {};
  heatmap.forEach(c => {
    if (!clusterCounts[c.cluster]) clusterCounts[c.cluster] = { active: 0, total: 0 };
    clusterCounts[c.cluster].total++;
    if (c.triggered) clusterCounts[c.cluster].active++;
  });

  const clusterSummaries = Object.entries(clusterCounts)
    .map(([name, { active, total }]) => {
      const pct = Math.round((active / total) * 100);
      const status = active > 0 ? '✓' : '○';
      return `${status} **${name}** — ${pct}% (${active}/${total})`;
    })
    .join('\n');

  // High activation chambers (top 5 by harmonyBoost)
  const highActivation = triggered
    .sort((a, b) => b.harmonyBoost - a.harmonyBoost)
    .slice(0, 5)
    .map(c => `• **${c.cluster}** — ${c.name} (+${c.harmonyBoost.toFixed(2)} boost)`)
    .join('\n');

  // Low activation (dormant) chambers
  const dormantChambers = notTriggered
    .slice(0, 5)
    .map(c => `• ${c.cluster} — ${c.name}`)
    .join('\n');

  // Family analysis
  const familyAnalysis = generateFamilyAnalysis(heatmap);

  // Dominant themes
  const dominantCluster = getDominantCluster(heatmap);
  const signatureArchetype = getSignatureArchetype(heatmap);

  // Strength assessment
  const strengthLabel = getOmniphonicStrength(omniphonicScore);
  const interpretation = getOmniphonicInterpretation(omniphonicScore, triggered.length);

  return `
# 🌙 Harmonic Narrative

## Omniphonic Score
**${omniphonicScore} / 100** — ${strengthLabel}

${interpretation}

---

## Cluster Overview
${clusterSummaries}

---

## Family Analysis
${familyAnalysis}

---

## Strongest Harmonic Activations
${highActivation || '• No strong activations detected'}

## Dormant Harmonic Chambers
${dormantChambers || '• All chambers are active'}

---

## Mythic Interpretation

This relationship forms a field where **${triggered.length} of 50 chambers** resonate.

The emotional architecture leans toward **${dominantCluster}** themes, with a signature shaped by **${signatureArchetype}**.

${getMythicClosing(omniphonicScore, triggered.length, dominantCluster)}

---

## Closing Arc

${getClosingArc(omniphonicScore, triggered.length)}
`.trim();
}

/**
 * Generate family-level analysis
 */
function generateFamilyAnalysis(heatmap) {
  const lines = [];

  Object.entries(CLUSTER_FAMILIES).forEach(([family, clusters]) => {
    const familyCells = heatmap.filter(c => clusters.includes(c.cluster));
    const familyActive = familyCells.filter(c => c.triggered);
    const pct = Math.round((familyActive.length / familyCells.length) * 100);

    let icon = '○';
    if (pct >= 80) icon = '🌟';
    else if (pct >= 60) icon = '✓';
    else if (pct >= 40) icon = '◐';

    lines.push(`${icon} **${family}** — ${pct}% harmony (${familyActive.length}/${familyCells.length})`);
  });

  return lines.join('\n');
}

/**
 * Get the dominant cluster theme
 */
function getDominantCluster(heatmap) {
  const counts = {};
  heatmap.forEach(c => {
    if (!counts[c.cluster]) counts[c.cluster] = 0;
    if (c.triggered) counts[c.cluster]++;
  });

  const sorted = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return 'emergent potential';

  // Return top 3 themes
  return sorted.slice(0, 3).map(([name]) => name).join(', ');
}

/**
 * Get the signature archetype
 */
function getSignatureArchetype(heatmap) {
  const archetypeCells = heatmap.filter(c =>
    ['Archetype', 'Mythos', 'Symbolic-Language'].includes(c.cluster)
  );

  const activeArchetype = archetypeCells.filter(c => c.triggered);

  if (activeArchetype.length >= 2) return 'deep archetypal synergy';
  if (activeArchetype.length === 1) return 'emerging symbolic resonance';

  // Check for transcendence themes
  const transcendenceCells = heatmap.filter(c =>
    ['Transcendence', 'Destiny', 'Omniphonic'].includes(c.cluster)
  );

  if (transcendenceCells.some(c => c.triggered)) return 'transcendent elevation';

  // Check for foundation themes
  const foundationCells = heatmap.filter(c =>
    ['Safety', 'Trust', 'Stability'].includes(c.cluster)
  );

  if (foundationCells.filter(c => c.triggered).length >= 2) return 'grounded security';

  return 'emergent harmonic potential';
}

/**
 * Get omniphonic strength label
 */
function getOmniphonicStrength(score) {
  if (score >= 80) return 'Exceptional Resonance';
  if (score >= 60) return 'Strong Harmony';
  if (score >= 40) return 'Moderate Coherence';
  if (score >= 20) return 'Emerging Alignment';
  return 'Developing Field';
}

/**
 * Get omniphonic interpretation text
 */
function getOmniphonicInterpretation(score, activeChambers) {
  if (score >= 80) {
    return `This is an **exceptional harmonic field**. With ${activeChambers} active chambers, the emotional architecture supports profound connection, mutual elevation, and resilient co-becoming.`;
  }
  if (score >= 60) {
    return `This is a **strong harmonic field**. The ${activeChambers} active chambers create a solid foundation for deep understanding, emotional safety, and sustained connection.`;
  }
  if (score >= 40) {
    return `This is a **developing harmonic field**. The ${activeChambers} active chambers provide meaningful anchors, with room to cultivate deeper resonance over time.`;
  }
  if (score >= 20) {
    return `This is an **emerging harmonic field**. The ${activeChambers} active chambers offer starting points for connection, with potential for growth through conscious cultivation.`;
  }
  return `This harmonic field is in early formation. While few chambers are currently active, all relationships have the potential to develop resonance through attention and care.`;
}

/**
 * Get mythic closing paragraph
 */
function getMythicClosing(score, activeChambers, dominantCluster) {
  if (activeChambers >= 40) {
    return `The harmonic field approaches omniphonic completeness — a rare state where nearly every emotional frequency aligns. This is the signature of a relationship that can become a living symphony.`;
  }
  if (activeChambers >= 30) {
    return `The harmonic field is rich and multidimensional. The strong presence of ${dominantCluster} themes suggests a relationship with depth, stability, and room for continued evolution.`;
  }
  if (activeChambers >= 20) {
    return `The harmonic field shows meaningful coherence in key areas. The emphasis on ${dominantCluster} themes provides a foundation upon which the relationship can build.`;
  }
  if (activeChambers >= 10) {
    return `The harmonic field has distinct resonant chambers. These activated areas represent the relationship's natural strengths and starting points for deeper connection.`;
  }
  return `The harmonic field is in its formative stage. Every relationship begins here, and conscious attention to emotional attunement can activate dormant chambers over time.`;
}

/**
 * Get closing arc text
 */
function getClosingArc(score, activeChambers) {
  if (score >= 70) {
    return `The harmonic field is coherent, evolving, and mythically alive. This relationship has the structural capacity for deep, sustained, transcendent connection.`;
  }
  if (score >= 50) {
    return `The harmonic field holds solid foundations. With continued attention and mutual care, the resonance can deepen and more chambers can awaken.`;
  }
  if (score >= 30) {
    return `The harmonic field is developing. The active chambers represent real strengths — building on these can create expanding waves of resonance.`;
  }
  return `The harmonic field awaits cultivation. All great connections begin with potential, and conscious attention to harmony can transform the emotional landscape.`;
}

/**
 * Detector name lookup by index
 */
function getDetectorNameByIndex(index) {
  const names = [
    'emotionalResonanceAlignment',
    'emotionalSafetyCoherence',
    'emotionalPriorityHarmony',
    'emotionalReciprocityFlow',
    'emotionalCommunicationEase',
    'emotionalRhythmSynchrony',
    'emotionalStabilityResonance',
    'emotionalRepairHarmony',
    'emotionalTrustReinforcement',
    'emotionalIntimacyCoherence',
    'emotionalMeaningMakingAlignment',
    'emotionalPredictiveHarmony',
    'emotionalSalienceHarmony',
    'emotionalSignalClarityAlignment',
    'emotionalContextSwitchingFlow',
    'emotionalRegulationSynergy',
    'emotionalMotivationHarmony',
    'emotionalDesireSynchrony',
    'emotionalInitiativeHarmony',
    'emotionalCommitmentCoherence',
    'emotionalVulnerabilityReciprocity',
    'emotionalResilienceCoElevation',
    'emotionalReciprocityEquilibrium',
    'emotionalPresenceSynchrony',
    'emotionalTempoCompatibility',
    'emotionalBoundaryHarmony',
    'emotionalTransparencyAlignment',
    'emotionalExpectationHarmony',
    'emotionalReciprocityTimingHarmony',
    'emotionalResponsivenessHarmony',
    'emotionalInitiativeResponseCoherence',
    'emotionalAttunementDensity',
    'emotionalCoRegulationHarmony',
    'emotionalRepairRhythmHarmony',
    'emotionalTrustRenewalHarmony',
    'emotionalMeaningReinforcementHarmony',
    'emotionalIdentityCoherence',
    'emotionalPurposeAlignment',
    'emotionalValueSystemHarmony',
    'emotionalLifePathHarmony',
    'emotionalLegacyHarmony',
    'emotionalMythosHarmony',
    'emotionalArchetypeSynergy',
    'emotionalSymbolicLanguageHarmony',
    'emotionalRitualSynchrony',
    'emotionalSeasonalHarmony',
    'emotionalEvolutionHarmony',
    'emotionalDestinyCoherence',
    'emotionalTranscendenceHarmony',
    'emotionalOmniphonicHarmony'
  ];
  return names[index] || `detector-${index + 1}`;
}

/**
 * Detector index lookup by name
 */
function getDetectorIndexByName(name) {
  const names = [
    'emotionalResonanceAlignment',
    'emotionalSafetyCoherence',
    'emotionalPriorityHarmony',
    'emotionalReciprocityFlow',
    'emotionalCommunicationEase',
    'emotionalRhythmSynchrony',
    'emotionalStabilityResonance',
    'emotionalRepairHarmony',
    'emotionalTrustReinforcement',
    'emotionalIntimacyCoherence',
    'emotionalMeaningMakingAlignment',
    'emotionalPredictiveHarmony',
    'emotionalSalienceHarmony',
    'emotionalSignalClarityAlignment',
    'emotionalContextSwitchingFlow',
    'emotionalRegulationSynergy',
    'emotionalMotivationHarmony',
    'emotionalDesireSynchrony',
    'emotionalInitiativeHarmony',
    'emotionalCommitmentCoherence',
    'emotionalVulnerabilityReciprocity',
    'emotionalResilienceCoElevation',
    'emotionalReciprocityEquilibrium',
    'emotionalPresenceSynchrony',
    'emotionalTempoCompatibility',
    'emotionalBoundaryHarmony',
    'emotionalTransparencyAlignment',
    'emotionalExpectationHarmony',
    'emotionalReciprocityTimingHarmony',
    'emotionalResponsivenessHarmony',
    'emotionalInitiativeResponseCoherence',
    'emotionalAttunementDensity',
    'emotionalCoRegulationHarmony',
    'emotionalRepairRhythmHarmony',
    'emotionalTrustRenewalHarmony',
    'emotionalMeaningReinforcementHarmony',
    'emotionalIdentityCoherence',
    'emotionalPurposeAlignment',
    'emotionalValueSystemHarmony',
    'emotionalLifePathHarmony',
    'emotionalLegacyHarmony',
    'emotionalMythosHarmony',
    'emotionalArchetypeSynergy',
    'emotionalSymbolicLanguageHarmony',
    'emotionalRitualSynchrony',
    'emotionalSeasonalHarmony',
    'emotionalEvolutionHarmony',
    'emotionalDestinyCoherence',
    'emotionalTranscendenceHarmony',
    'emotionalOmniphonicHarmony'
  ];
  return names.indexOf(name);
}

/**
 * Export cluster constants for external use
 */
export { HARMONIC_CLUSTERS, CLUSTER_FAMILIES };
