/**
 * unifiedCompatibilityService.js
 *
 * Service to call the GENESIS Unified Metaphysics Engine
 * Combines BaZi + Western into 90-dimensional vector compatibility scoring
 *
 * Features:
 * - Unified Expression Vector (90 dimensions)
 * - Multi-dimensional compatibility scoring
 * - Third Chart (relationship being) generation
 * - Stress Chamber analysis
 * - Lifecycle stage prediction
 * - Supernova Detector (structural failure-mode detection)
 */

import { SupernovaDetector } from './supernova/SupernovaDetector.js';

const PYTHON_FUNCTION_URL = import.meta.env.VITE_PYTHON_FUNCTION_URL
  || 'http://127.0.0.1:5001/astroprofile-391e6/us-central1';

// ============================================================================
// UNIFIED ENGINE API CALLS
// ============================================================================

/**
 * Generate unified profile from birth data
 */
export async function generateUnifiedProfile(birthData, westernData = null) {
  try {
    const response = await fetch(`${PYTHON_FUNCTION_URL}/generate_unified_profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birth_datetime: birthData.datetime,
        gender: birthData.gender || 'male',
        location: birthData.location,
        western_data: westernData
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating unified profile:', error);
    // Fall back to local calculation
    return calculateUnifiedProfileLocal(birthData, westernData);
  }
}

/**
 * Compute unified compatibility between two profiles
 */
export async function computeUnifiedCompatibility(profileA, profileB) {
  try {
    const response = await fetch(`${PYTHON_FUNCTION_URL}/unified_compatibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_a: profileA,
        profile_b: profileB,
        include_third_chart: true,
        include_stress_chamber: true,
        include_lifecycle: true
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error computing unified compatibility:', error);
    // Fall back to local calculation
    return calculateUnifiedCompatibilityLocal(profileA, profileB);
  }
}

// ============================================================================
// LOCAL CALCULATION FALLBACKS
// ============================================================================

/**
 * BAZI ELEMENT MODIFIERS FOR ARCHETYPE VECTORS
 *
 * Adjusts the base zodiac archetype to reflect actual BaZi element strengths.
 * This prevents generic zodiac-only archetypes from producing unrealistic
 * Third Chart results (e.g., Trump × Musk showing as "Harmony Weave").
 *
 * Trait indices:
 * - Initiator(0), Stabilizer(1), Relational(2), MindCentered(3), Intuitive(4), Concrete(5)
 * - Expressive(6), Transpersonal(7), RiskSeeking(8), OrderOriented(9), FluidIdentity(10)
 * - Warm(11), Direct(12), DepthOriented(13), Sustainer(14), BoundaryAware(15)
 */
const BAZI_ELEMENT_MODIFIERS = {
  // Fire: Bold, direct, risk-taking, DOMINANT - NOT warm/relational (Trump archetype)
  Fire: {
    boosts: [[0, 0.35], [12, 0.35], [8, 0.40], [6, 0.25], [15, 0.20]], // Initiator, Direct, RiskSeeking, Expressive, BoundaryAware
    reduces: [[11, 0.45], [2, 0.40], [1, 0.20], [14, 0.15]]            // Warm, Relational, Stabilizer, Sustainer
  },
  // Earth: Stable, grounded, practical, CONTROLLING - less warm/fluid
  Earth: {
    boosts: [[1, 0.35], [5, 0.30], [14, 0.30], [15, 0.35], [9, 0.25]], // Stabilizer, Concrete, Sustainer, BoundaryAware, OrderOriented
    reduces: [[11, 0.25], [2, 0.20], [8, 0.15], [10, 0.20]]            // Warm, Relational, RiskSeeking, FluidIdentity
  },
  // Metal: Precise, direct, principled, COLD - not warm/flexible
  Metal: {
    boosts: [[12, 0.35], [9, 0.40], [3, 0.30], [15, 0.35], [5, 0.20]], // Direct, OrderOriented, MindCentered, BoundaryAware, Concrete
    reduces: [[11, 0.50], [2, 0.35], [10, 0.25], [6, 0.15]]            // Warm, Relational, FluidIdentity, Expressive
  },
  // Water: Intuitive, deep, fluid - less direct/concrete but can be warm
  Water: {
    boosts: [[4, 0.35], [13, 0.30], [10, 0.30], [7, 0.25], [11, 0.15]], // Intuitive, DepthOriented, FluidIdentity, Transpersonal, Warm
    reduces: [[5, 0.25], [12, 0.20], [9, 0.20], [15, 0.15]]             // Concrete, Direct, OrderOriented, BoundaryAware
  },
  // Wood: Initiative, relational, expressive, GROWTH - warm and connected
  Wood: {
    boosts: [[0, 0.30], [2, 0.35], [6, 0.30], [11, 0.30], [10, 0.20]], // Initiator, Relational, Expressive, Warm, FluidIdentity
    reduces: [[9, 0.25], [15, 0.20], [3, 0.15], [5, 0.10]]             // OrderOriented, BoundaryAware, MindCentered, Concrete
  }
};

/**
 * Apply BaZi element strengths to modify base zodiac archetype.
 * Elements above 25% (balanced) will shift the archetype accordingly.
 *
 * @param {number[]} baseArchetype - 16-dimensional zodiac archetype vector
 * @param {Object} baziElements - { Wood, Fire, Earth, Metal, Water } percentages (0-1 scale)
 * @returns {number[]} Modified archetype vector
 */
function applyBaziModifiersToArchetype(baseArchetype, baziElements) {
  if (!baziElements || !baseArchetype || baseArchetype.length < 16) {
    return baseArchetype;
  }

  const modified = [...baseArchetype];
  const BALANCED_LEVEL = 0.20; // 20% is balanced (100% / 5 elements)
  const MODIFIER_STRENGTH = 2.5; // How strongly BaZi modifies zodiac archetype (increased for realistic archetypes)

  for (const [element, percentage] of Object.entries(baziElements)) {
    // Normalize: handle both 0-1 and 0-100 scales
    const normalized = percentage > 1 ? percentage / 100 : percentage;

    // Only apply modifiers if element is significantly above balanced level
    const deviation = normalized - BALANCED_LEVEL;
    if (Math.abs(deviation) < 0.05) continue; // Skip if close to balanced

    const modifiers = BAZI_ELEMENT_MODIFIERS[element];
    if (!modifiers) continue;

    // Scale the modifier strength by how much element deviates from balanced
    const strength = deviation * MODIFIER_STRENGTH;

    // Apply boosts
    for (const [idx, amount] of modifiers.boosts) {
      if (deviation > 0) {
        modified[idx] = Math.min(0.95, modified[idx] + amount * strength);
      }
    }

    // Apply reductions
    for (const [idx, amount] of modifiers.reduces) {
      if (deviation > 0) {
        modified[idx] = Math.max(0.05, modified[idx] - amount * strength);
      } else if (deviation < 0) {
        // If element is LOW, the opposite effects apply (less reduction)
        modified[idx] = Math.min(0.95, modified[idx] + amount * Math.abs(strength) * 0.3);
      }
    }
  }

  return modified;
}

/**
 * Extract BaZi elements from profile data, handling multiple paths and key formats.
 *
 * Supports:
 * - profile.elements (direct)
 * - profile.bazi?.elements
 * - profile.constitutional?.bazi?.elemental_percentages (historical profiles)
 * - Both capitalized (Fire) and lowercase (fire) keys
 *
 * @param {Object} profile - Profile or birth data object
 * @returns {Object|null} Normalized { Wood, Fire, Earth, Metal, Water } object (0-1 scale)
 */
function extractBaziElements(profile) {
  if (!profile) return null;

  // Try multiple paths
  const rawElements =
    profile.elements ||
    profile.bazi?.elements ||
    profile.constitutional?.bazi?.elemental_percentages ||
    profile.constitutional?.bazi?.elements ||
    profile.bazi?.elemental_percentages ||
    null;

  if (!rawElements) return null;

  // Normalize keys to capitalized and values to 0-1 scale
  const normalized = {};
  const elementNames = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  for (const name of elementNames) {
    const lowerName = name.toLowerCase();
    const rawValue = rawElements[name] ?? rawElements[lowerName] ?? 0;

    // Convert from percentage (0-100) to decimal (0-1) if needed
    normalized[name] = rawValue > 1 ? rawValue / 100 : rawValue;
  }

  // Verify we have at least some data
  const total = Object.values(normalized).reduce((s, v) => s + v, 0);
  if (total < 0.1) return null; // No meaningful data

  return normalized;
}

/**
 * Local fallback for unified profile generation
 */
function calculateUnifiedProfileLocal(birthData, westernData) {
  // Extract or derive data
  const sign = westernData?.sign || deriveWesternSign(birthData.datetime);
  const dayMaster = birthData.dayMaster || 'Unknown';

  // Build base archetype from sign
  let archetype = SIGN_ARCHETYPE_VECTORS[sign] || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

  // CRITICAL: Apply BaZi element modifiers to adjust archetype
  // This prevents unrealistic Third Charts (e.g., Trump × Musk as "Harmony Weave")
  const baziElements = extractBaziElements(birthData);
  if (baziElements) {
    archetype = applyBaziModifiersToArchetype(archetype, baziElements);
  }

  return {
    profile: birthData,
    unified_expression: {
      western: {
        archetype,
        patterns: westernData?.patterns || { grand_trine: 0.4, t_square: 0.3, stellium: 0.35 },
        elements: westernData?.elements || { Fire: 0.25, Earth: 0.25, Air: 0.25, Water: 0.25 },
        modalities: westernData?.modalities || { Cardinal: 0.33, Fixed: 0.33, Mutable: 0.34 }
      },
      bazi: {
        elements: birthData.elements || { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 },
        dm_strength: birthData.dmStrength || 0.5
      },
      metadata: { sign, day_master: dayMaster, dimension: 90 }
    },
    persona: {
      primary_label: derivePersonaLabel(archetype),
      dominant_traits: deriveDominantTraits(archetype)
    }
  };
}

/**
 * Local fallback for unified compatibility calculation
 * NOW WITH: Penalties, Red Flags, Risk Index, Realism Mode
 */
function calculateUnifiedCompatibilityLocal(profileA, profileB, options = {}) {
  const realismMode = options.realismMode !== false; // DEFAULT TO REALISM MODE

  const exprA = profileA.unified_expression || calculateUnifiedProfileLocal(profileA, profileA.western).unified_expression;
  const exprB = profileB.unified_expression || calculateUnifiedProfileLocal(profileB, profileB.western).unified_expression;

  // ============================================================================
  // RT-ENGINE v1: REALISM MODE (Default)
  // Uses only 4 core signals for honest, realistic scoring
  // ============================================================================
  if (realismMode) {
    return calculateRTEngineV1(exprA, exprB, profileA, profileB);
  }

  // ============================================================================
  // LEGACY MODE: Full 6-section calculation (kept for comparison)
  // ============================================================================
  return calculateLegacyCompatibility(exprA, exprB, profileA, profileB);
}

/**
 * RT-ENGINE v1: Realism Mode
 *
 * Four core signals only:
 * 1. Archetype Similarity (centered cosine - Pearson correlation)
 * 2. Stress Compatibility (Third Chart resilience patterns)
 * 3. Third Chart Coherence (relationship identity strength)
 * 4. Penalty Total (clash detection)
 *
 * NO inflated sections:
 * - No Western Patterns (always ~0.5, adds no signal)
 * - No Western Modalities (minimal differentiation)
 * - No BaZi Elements (requires actual Ten Gods data to be meaningful)
 * - No Western Elements (covered by archetype vectors)
 * - No BaZi DM Strength (placeholder without real chart)
 *
 * Result: Produces real C, D, F relationships when warranted.
 */
function calculateRTEngineV1(exprA, exprB, profileA, profileB) {
  // ============================================================================
  // SIGNAL 1: Archetype Similarity (Primary psychological compatibility)
  // Uses centered cosine (Pearson) for realistic differentiation
  // ============================================================================
  const archetypeA = exprA.western?.archetype || [];
  const archetypeB = exprB.western?.archetype || [];
  let archetypeSimilarity = cosineSimilarity(archetypeA, archetypeB);

  // ============================================================================
  // STRUCTURAL ANALYSIS: Detect problematic patterns beyond raw similarity
  // Sister Gemini's insight: HIGH similarity in DOMINANT traits can be BAD
  // ============================================================================
  const structuralAnalysis = analyzeStructuralCompatibility(archetypeA, archetypeB, exprA, exprB);

  // ============================================================================
  // SUPERNOVA DETECTOR: Mother module for catastrophic failure modes
  // Detects: Competing Dominance, Soft-Boundary Empath, Rigid Moralist, Fragile Idealist
  // ============================================================================
  const supernovaResult = SupernovaDetector(archetypeA, archetypeB);

  // Merge Supernova results into structural analysis
  if (supernovaResult.triggered) {
    // Apply stricter grade cap from Supernova
    if (supernovaResult.gradeCap) {
      const GRADE_ORDER = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];
      const existingCapIdx = structuralAnalysis.gradeCap ? GRADE_ORDER.indexOf(structuralAnalysis.gradeCap) : GRADE_ORDER.length;
      const supernovaCapIdx = GRADE_ORDER.indexOf(supernovaResult.gradeCap);
      if (supernovaCapIdx < existingCapIdx) {
        structuralAnalysis.gradeCap = supernovaResult.gradeCap;
      }
    }

    // Apply stricter harmony cap from Supernova
    if (supernovaResult.harmonyCap !== null) {
      structuralAnalysis.harmonyIndex = Math.min(
        structuralAnalysis.harmonyIndex,
        supernovaResult.harmonyCap
      );
    }

    // Increase tension index based on Supernova severity
    const severityBoost = supernovaResult.severity === 'severe' ? 0.30 :
                          supernovaResult.severity === 'moderate' ? 0.20 : 0.10;
    structuralAnalysis.tensionIndex = Math.min(1, structuralAnalysis.tensionIndex + severityBoost);

    // Store Supernova details for later use
    structuralAnalysis.supernova = {
      triggered: true,
      type: supernovaResult.supernovaType,
      severity: supernovaResult.severity,
      flags: supernovaResult.flags,
      penalty: supernovaResult.totalPenalty,
      interpretation: supernovaResult.interpretation
    };
  }

  // Apply structural adjustments to archetype similarity
  // High raw similarity with structural problems = adjusted downward
  if (structuralAnalysis.sameElementIntensity > 0.7 && archetypeSimilarity > 0.6) {
    // Same element at high intensity - similarity becomes volatility
    archetypeSimilarity *= (1 - structuralAnalysis.sameElementIntensity * 0.25);
  }

  // ============================================================================
  // SIGNAL 2 & 3: Third Chart Analysis (Stress + Coherence)
  // ============================================================================
  const thirdChart = calculateThirdChart(exprA, exprB);

  // Stress Compatibility: Combine stress patterns WITH structural harmony
  const stressPatternCount = thirdChart.stress_patterns?.length || 0;
  let baseStressCompat = stressPatternCount >= 3 ? 0.90 :
                         stressPatternCount >= 2 ? 0.70 :
                         stressPatternCount >= 1 ? 0.50 : 0.25;

  // CRITICAL: Structural harmony affects stress handling
  // Low harmony = poor repair mechanics = stress amplifies damage
  const stressCompatibility = baseStressCompat * (0.5 + 0.5 * structuralAnalysis.harmonyIndex);

  // Third Chart Coherence: Identity strength BUT with tension adjustment
  const archetypeScores = Object.values(thirdChart.archetype_scores || {});
  const dominantCount = archetypeScores.filter(v => v >= 0.7).length;
  const moderateCount = archetypeScores.filter(v => v >= 0.55 && v < 0.7).length;

  // Base coherence from archetype presence
  let baseCoherence = dominantCount >= 4 ? 0.85 :  // Reduced from 0.95
                      dominantCount >= 3 ? 0.70 :  // Reduced from 0.80
                      dominantCount >= 2 ? 0.55 :  // Reduced from 0.65
                      dominantCount >= 1 ? 0.45 :  // Reduced from 0.50
                      moderateCount >= 3 ? 0.40 : 0.30;

  // CRITICAL: High tension reduces coherence (competing egos fragment the "we")
  const thirdChartCoherence = baseCoherence * (1 - structuralAnalysis.tensionIndex * 0.4);

  // ============================================================================
  // SIGNAL 4: Penalty Calculation (Clash detection + Structural penalties)
  // ============================================================================
  const basePenalties = calculateTotalPenalty(exprA, exprB);

  // Add structural penalties
  const structuralPenalty =
    structuralAnalysis.sameElementIntensity * 0.08 +  // Same element flooding
    structuralAnalysis.missingComplementarity * 0.10 + // No balance
    (1 - structuralAnalysis.harmonyIndex) * 0.12 +    // Poor repair capacity
    structuralAnalysis.tensionIndex * 0.10;            // Internal friction

  // Add Supernova penalty (from mother module)
  const supernovaPenalty = structuralAnalysis.supernova?.penalty || 0;

  const penalties = {
    ...basePenalties,
    structural: Math.round(structuralPenalty * 1000) / 1000,
    supernova: Math.round(supernovaPenalty * 1000) / 1000,
    total: basePenalties.total + structuralPenalty + supernovaPenalty
  };

  // ============================================================================
  // RT-ENGINE v1 FORMULA
  // Weighted combination of 4 signals, then penalties subtracted
  // ============================================================================
  const RT_WEIGHTS = {
    archetype: 0.45,      // Primary signal - psychological fit
    stress: 0.25,         // How relationship handles pressure
    coherence: 0.20,      // Third Chart identity strength
    // Remaining 0.10 comes from not penalizing too harshly
  };

  const rawScore =
    RT_WEIGHTS.archetype * archetypeSimilarity +
    RT_WEIGHTS.stress * stressCompatibility +
    RT_WEIGHTS.coherence * thirdChartCoherence +
    0.10 * 0.5; // Baseline buffer

  // Apply penalties (these can be harsh - up to ~35% reduction)
  let finalScore = rawScore - penalties.total;
  finalScore = Math.max(0.05, Math.min(0.98, finalScore)); // Clamp, never exactly 0 or 1

  // ============================================================================
  // RED FLAG DETECTION (Structural problems override score)
  // ============================================================================
  const redFlags = detectRedFlagsRTv1(archetypeSimilarity, stressCompatibility, thirdChartCoherence, penalties, structuralAnalysis);

  // ============================================================================
  // RISK INDEX (Composite vulnerability measure)
  // ============================================================================
  const riskIndex = calculateRiskIndexRTv1(archetypeSimilarity, stressCompatibility, thirdChartCoherence, redFlags.count, structuralAnalysis);

  // ============================================================================
  // INTERPRETATION (Context-aware grading)
  // ============================================================================
  const grade = scoreToGradeRTv1(finalScore, redFlags.count, structuralAnalysis.gradeCap);
  const interpretationKey = interpretRTv1(finalScore, stressCompatibility, thirdChartCoherence, redFlags.count);

  const interpretationTexts = {
    exceptional_bond: 'Rare and exceptional compatibility. Deep resonance across all dimensions.',
    strong_foundation: 'Strong foundation with natural understanding. Well-equipped for challenges.',
    solid_potential: 'Good compatibility with growth potential. Complementary energies.',
    growth_journey: 'Mixed signals - relationship will require conscious work. Can be strengthening.',
    significant_gaps: 'Notable gaps in compatibility. Success requires substantial effort.',
    structural_risk: 'Structural concerns present. Red flags indicate instability patterns.',
    challenging_match: 'Significant challenges. Fundamental differences may be difficult to bridge.',
    severe_misalignment: 'Major incompatibilities detected. Relationship would require extraordinary effort.'
  };

  // Summary for Markdown export
  const summary = generateRTv1Summary(
    profileA, profileB, archetypeSimilarity, stressCompatibility,
    thirdChartCoherence, penalties.total, redFlags, grade
  );

  return {
    profiles: {
      profile_a: profileA.name || profileA.fullName || 'Profile A',
      profile_b: profileB.name || profileB.fullName || 'Profile B'
    },
    // RT-ENGINE v1 OUTPUT STRUCTURE
    engine: 'RT-Engine v1',
    realism_mode: true,

    // Main compatibility result
    compatibility: {
      overall: {
        score: Math.round(finalScore * 1000) / 1000,
        rawScore: Math.round(rawScore * 1000) / 1000,
        grade,
        level: scoreToLevel(finalScore),
        interpretation: interpretationTexts[interpretationKey] || interpretationTexts.growth_journey,
        interpretationKey
      },
      // The 4 core signals (RT-Engine v1)
      core_signals: {
        archetype_similarity: Math.round(archetypeSimilarity * 1000) / 1000,
        stress_compatibility: Math.round(stressCompatibility * 1000) / 1000,
        third_chart_coherence: Math.round(thirdChartCoherence * 1000) / 1000,
        penalty_total: Math.round(penalties.total * 1000) / 1000
      },
      penalties: {
        bazi: Math.round(penalties.bazi * 1000) / 10,
        western: Math.round(penalties.western * 1000) / 10,
        archetype: Math.round(penalties.archetype * 1000) / 10,
        total: Math.round(penalties.total * 1000) / 10
      },
      // Minimal section info for UI (but NOT used in scoring)
      sections: [
        {
          name: 'archetype_similarity',
          score: archetypeSimilarity,
          weight: RT_WEIGHTS.archetype,
          interpretation: archetypeSimilarity >= 0.70 ? 'Strong psychological resonance' :
                          archetypeSimilarity >= 0.50 ? 'Moderate psychological alignment' :
                          archetypeSimilarity >= 0.35 ? 'Different psychological approaches' :
                          'Significant psychological divergence'
        },
        {
          name: 'stress_compatibility',
          score: stressCompatibility,
          weight: RT_WEIGHTS.stress,
          interpretation: stressCompatibility >= 0.70 ? 'Resilient under pressure' :
                          stressCompatibility >= 0.50 ? 'Moderately stable under stress' :
                          'Stress-sensitive relationship'
        },
        {
          name: 'third_chart_coherence',
          score: thirdChartCoherence,
          weight: RT_WEIGHTS.coherence,
          interpretation: thirdChartCoherence >= 0.70 ? 'Strong relationship identity' :
                          thirdChartCoherence >= 0.50 ? 'Developing relationship identity' :
                          'Unclear relationship identity'
        }
      ],
      profiles: {
        a: { sign: exprA.metadata?.sign, day_master: exprA.metadata?.day_master },
        b: { sign: exprB.metadata?.sign, day_master: exprB.metadata?.day_master }
      },
      narrative: generateRTv1Narrative(exprA, exprB, archetypeSimilarity, stressCompatibility, finalScore),
      strengths: generateRTv1Strengths(archetypeSimilarity, stressCompatibility, thirdChartCoherence, thirdChart),
      challenges: generateRTv1Challenges(archetypeSimilarity, stressCompatibility, thirdChartCoherence, redFlags)
    },

    // Risk assessment
    risk_assessment: {
      risk_index: riskIndex,
      red_flags: redFlags,
      stress_resilience: {
        value: stressCompatibility,
        label: stressCompatibility >= 0.70 ? 'High' : stressCompatibility >= 0.50 ? 'Moderate' : 'Low'
      },
      third_chart_coherence: {
        value: thirdChartCoherence,
        label: thirdChartCoherence >= 0.70 ? 'Strong' : thirdChartCoherence >= 0.50 ? 'Moderate' : 'Weak'
      }
    },

    // Structural Analysis (Sister Gemini's indices)
    structural_analysis: {
      same_element_intensity: {
        value: structuralAnalysis.sameElementIntensity,
        label: structuralAnalysis.sameElementIntensity > 0.7 ? 'Critical' :
               structuralAnalysis.sameElementIntensity > 0.5 ? 'High' :
               structuralAnalysis.sameElementIntensity > 0.3 ? 'Moderate' : 'Low'
      },
      missing_complementarity: {
        value: structuralAnalysis.missingComplementarity,
        label: structuralAnalysis.missingComplementarity > 0.5 ? 'Severe' :
               structuralAnalysis.missingComplementarity > 0.3 ? 'Notable' : 'Minimal'
      },
      harmony_index: {
        value: structuralAnalysis.harmonyIndex,
        label: structuralAnalysis.harmonyIndex < 0.35 ? 'Critical' :
               structuralAnalysis.harmonyIndex < 0.50 ? 'Low' :
               structuralAnalysis.harmonyIndex < 0.65 ? 'Moderate' : 'Good'
      },
      tension_index: {
        value: structuralAnalysis.tensionIndex,
        label: structuralAnalysis.tensionIndex > 0.7 ? 'Extreme' :
               structuralAnalysis.tensionIndex > 0.5 ? 'High' :
               structuralAnalysis.tensionIndex > 0.3 ? 'Moderate' : 'Low'
      }
    },

    // Third Chart (full data for display)
    third_chart: {
      ...thirdChart,
      coherence: thirdChartCoherence
    },

    // Summary for Markdown export
    summary
  };
}

/**
 * Legacy compatibility calculation (kept for comparison/debugging)
 */
function calculateLegacyCompatibility(exprA, exprB, profileA, profileB) {
  // Calculate section scores (NO placeholders now)
  const sections = calculateSectionScores(exprA, exprB);

  // Calculate raw score from actual sections only
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const rawScore = sections.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight;

  // Calculate penalties
  const penalties = calculateTotalPenalty(exprA, exprB);

  // Apply penalties to get final score
  let finalScore = rawScore - penalties.total;
  finalScore = Math.max(0, Math.min(1, finalScore)); // Clamp to 0-1

  // Calculate Third Chart (for stress resilience and coherence)
  const thirdChart = calculateThirdChart(exprA, exprB);

  // Calculate stress resilience from third chart patterns
  const stressResilience = (thirdChart.stress_patterns?.length || 0) >= 2 ? 0.75 :
                          (thirdChart.stress_patterns?.length || 0) >= 1 ? 0.55 : 0.35;

  // Calculate third chart coherence from archetype scores
  const archetypeScores = Object.values(thirdChart.archetype_scores || {});
  const dominantCount = archetypeScores.filter(v => v >= 0.7).length;
  const thirdChartCoherence = dominantCount >= 3 ? 0.85 : dominantCount >= 2 ? 0.65 : dominantCount >= 1 ? 0.45 : 0.30;

  // Get key similarity scores for red flag detection
  const archetypeSim = sections.find(s => s.name === 'western_archetype')?.score || 0.5;
  const baziElemSim = sections.find(s => s.name === 'bazi_elements')?.score || 0.5;

  // Detect red flags
  const redFlags = detectRedFlags(exprA, exprB, archetypeSim, baziElemSim, stressResilience, thirdChartCoherence);

  // Calculate risk index
  const riskIndex = calculateRiskIndex(archetypeSim, baziElemSim, stressResilience, thirdChartCoherence);

  // Get contextual interpretation
  const scoreBand = classifyScore(finalScore);
  const interpretationKey = interpretWithContext(scoreBand, stressResilience, thirdChartCoherence, redFlags.count);

  // Build interpretation text
  const interpretationTexts = {
    severe_misalignment: 'Significant challenges present. Relationship requires substantial work and mutual understanding.',
    challenging: 'Notable differences to navigate. Success depends on conscious effort and communication.',
    growth_oriented: 'Mixed compatibility with growth potential. Differences can be opportunities for development.',
    solid_with_nuance: 'Good foundation with areas for attention. Generally positive with some work needed.',
    rare_high_coherence: 'Strong natural compatibility. Shared values and complementary energies.',
    structurally_fragile: 'Structural concerns present despite score. Red flags indicate potential instability.',
    stress_vulnerable: 'May struggle under pressure. Low joint stress resilience patterns detected.',
    identity_unstable: 'Relationship identity unclear. Third Chart lacks coherent archetypal structure.'
  };

  return {
    profiles: {
      profile_a: profileA.name || profileA.fullName || 'Profile A',
      profile_b: profileB.name || profileB.fullName || 'Profile B'
    },
    engine: 'Legacy (6-section)',
    realism_mode: false,
    compatibility: {
      overall: {
        score: finalScore,
        rawScore: rawScore,
        grade: scoreToGrade(finalScore),
        level: scoreToLevel(finalScore),
        interpretation: interpretationTexts[interpretationKey] || getInterpretation(finalScore),
        scoreBand,
        interpretationKey
      },
      penalties: {
        bazi: Math.round(penalties.bazi * 1000) / 10,    // As percentage
        western: Math.round(penalties.western * 1000) / 10,
        archetype: Math.round(penalties.archetype * 1000) / 10,
        total: Math.round(penalties.total * 1000) / 10
      },
      system_scores: {
        western: calculateWesternScore(exprA, exprB),
        bazi: calculateBaziScore(exprA, exprB)
      },
      sections,
      profiles: {
        a: { sign: exprA.metadata?.sign, day_master: exprA.metadata?.day_master },
        b: { sign: exprB.metadata?.sign, day_master: exprB.metadata?.day_master }
      },
      narrative: generateNarrative(exprA, exprB, sections, finalScore),
      strengths: sections.filter(s => s.score >= 0.70).map(s => s.interpretation),
      challenges: sections.filter(s => s.score < 0.45).map(s => `${formatSectionName(s.name)}: ${s.interpretation}`)
    },
    // Risk assessment
    risk_assessment: {
      risk_index: riskIndex,
      red_flags: redFlags,
      stress_resilience: {
        value: Math.round(stressResilience * 100) / 100,
        label: stressResilience >= 0.7 ? 'High' : stressResilience >= 0.5 ? 'Moderate' : 'Low'
      },
      third_chart_coherence: {
        value: Math.round(thirdChartCoherence * 100) / 100,
        label: thirdChartCoherence >= 0.7 ? 'Strong' : thirdChartCoherence >= 0.5 ? 'Moderate' : 'Weak'
      }
    },
    third_chart: {
      ...thirdChart,
      coherence: thirdChartCoherence
    }
  };
}

// ============================================================================
// STRUCTURAL COMPATIBILITY ANALYSIS
// Sister Gemini's insight: "Double-Solar" patterns need detection
// ============================================================================

/**
 * Analyze structural compatibility beyond raw similarity
 *
 * Indices returned:
 * - sameElementIntensity: 0-1, how much same-element intensity exists (Water×Water, Fire×Fire)
 * - missingComplementarity: 0-1, how much balance is missing (no grounding, no warmth)
 * - harmonyIndex: 0-1, capacity for repair/attunement (higher = better)
 * - tensionIndex: 0-1, internal friction/boundary competition (higher = worse)
 *
 * ARCHETYPE_AXES indices:
 * 0: Initiator, 1: Stabilizer, 2: Relational, 3: MindCentered,
 * 4: Intuitive, 5: Concrete, 6: Expressive, 7: Transpersonal,
 * 8: RiskSeeking, 9: OrderOriented, 10: FluidIdentity, 11: Warm,
 * 12: Direct, 13: DepthOriented, 14: Sustainer, 15: BoundaryAware
 */
function analyzeStructuralCompatibility(archetypeA, archetypeB, exprA, exprB) {
  // Default to neutral if no archetype data
  if (!archetypeA?.length || !archetypeB?.length) {
    return {
      sameElementIntensity: 0.5,
      missingComplementarity: 0.5,
      harmonyIndex: 0.5,
      tensionIndex: 0.5,
      competingDominance: false
    };
  }

  // ============================================================================
  // SIGN-TO-ELEMENT MAPPING (Primary detection for same-element)
  // ============================================================================
  const SIGN_ELEMENTS = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water'
  };

  const signA = (exprA.metadata?.sign || '').toLowerCase();
  const signB = (exprB.metadata?.sign || '').toLowerCase();
  const elementFromSignA = SIGN_ELEMENTS[signA] || null;
  const elementFromSignB = SIGN_ELEMENTS[signB] || null;

  // ============================================================================
  // 1. SAME ELEMENT INTENSITY
  // When both have same dominant element = emotional flooding/explosion risk
  // ============================================================================
  let sameElementIntensity = 0;

  // First try: derive from Sun sign (most reliable)
  if (elementFromSignA && elementFromSignB && elementFromSignA === elementFromSignB) {
    // Same element from signs - this is definitive
    sameElementIntensity = 0.7; // Base intensity for same-element

    // Water × Water is especially volatile (emotional flooding)
    if (elementFromSignA === 'water') {
      sameElementIntensity = 0.9; // Very high - emotional intensity squared
    }
    // Fire × Fire is explosive
    else if (elementFromSignA === 'fire') {
      sameElementIntensity = 0.85; // High - passion/aggression amplified
    }
    // Earth × Earth can be stubborn
    else if (elementFromSignA === 'earth') {
      sameElementIntensity = 0.6; // Moderate - can be stable but inflexible
    }
    // Air × Air can be detached
    else if (elementFromSignA === 'air') {
      sameElementIntensity = 0.55; // Moderate - intellectual but lacks grounding
    }
  }
  // Fallback: try element distribution if signs not available
  else if (!elementFromSignA || !elementFromSignB) {
    const elementsA = exprA.western?.elements || {};
    const elementsB = exprB.western?.elements || {};

    const getDominant = (elements) => {
      const entries = Object.entries(elements).filter(([k]) =>
        ['Fire', 'Earth', 'Air', 'Water', 'fire', 'earth', 'air', 'water'].includes(k)
      );
      if (!entries.length) return { element: null, value: 0 };
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      return { element: sorted[0][0].toLowerCase(), value: sorted[0][1] };
    };

    const domA = getDominant(elementsA);
    const domB = getDominant(elementsB);

    if (domA.element && domA.element === domB.element && domA.value > 0.3) {
      const avgStrength = (domA.value + domB.value) / 2;
      sameElementIntensity = avgStrength > 0.4 ? avgStrength * 1.5 : avgStrength;
    }
  }
  sameElementIntensity = Math.min(1, sameElementIntensity);

  // ============================================================================
  // 2. MISSING COMPLEMENTARITY
  // When strengths overlap but weaknesses aren't covered
  // ============================================================================

  // Key complementary pairs:
  // - Intuitive (4) needs Concrete (5) grounding
  // - Initiator (0) needs Stabilizer (1) balance
  // - RiskSeeking (8) needs OrderOriented (9) balance
  // - Expressive (6) needs DepthOriented (13) balance

  const complementaryPairs = [
    [4, 5],   // Intuitive ↔ Concrete
    [0, 1],   // Initiator ↔ Stabilizer
    [8, 9],   // RiskSeeking ↔ OrderOriented
    [6, 13],  // Expressive ↔ DepthOriented
    [10, 15], // FluidIdentity ↔ BoundaryAware
  ];

  let missingComplementarity = 0;
  complementaryPairs.forEach(([idxA, idxB]) => {
    const valA1 = archetypeA[idxA] || 0.5;
    const valA2 = archetypeA[idxB] || 0.5;
    const valB1 = archetypeB[idxA] || 0.5;
    const valB2 = archetypeB[idxB] || 0.5;

    // Check if BOTH are high on same pole and LOW on complementary pole
    const bothHighOnFirst = valA1 > 0.6 && valB1 > 0.6;
    const bothLowOnSecond = valA2 < 0.5 && valB2 < 0.5;

    if (bothHighOnFirst && bothLowOnSecond) {
      missingComplementarity += 0.25;
    }
  });
  missingComplementarity = Math.min(1, missingComplementarity);

  // ============================================================================
  // 3. HARMONY INDEX (Repair & Attunement capacity)
  // Based on: Relational (2), Warm (11), Sustainer (14), FluidIdentity (10)
  // ============================================================================

  // Harmony requires at least ONE partner to have high repair capacity
  const repairTraits = [2, 11, 14, 10]; // Relational, Warm, Sustainer, FluidIdentity

  const maxRepairA = Math.max(...repairTraits.map(i => archetypeA[i] || 0));
  const maxRepairB = Math.max(...repairTraits.map(i => archetypeB[i] || 0));
  const avgRepairA = repairTraits.reduce((s, i) => s + (archetypeA[i] || 0), 0) / repairTraits.length;
  const avgRepairB = repairTraits.reduce((s, i) => s + (archetypeB[i] || 0), 0) / repairTraits.length;

  // Harmony is the COMBINED repair capacity
  // If both are low, harmony is very low (no one will yield first)
  const combinedRepair = (avgRepairA + avgRepairB) / 2;
  const maxAvailable = Math.max(maxRepairA, maxRepairB);

  // Also check for Direct (12) - high Direct in BOTH = low harmony (neither yields)
  const bothHighDirect = (archetypeA[12] || 0) > 0.6 && (archetypeB[12] || 0) > 0.6;
  const directPenalty = bothHighDirect ? 0.25 : 0;

  let harmonyIndex = (combinedRepair * 0.6 + maxAvailable * 0.4) - directPenalty;
  harmonyIndex = Math.max(0.1, Math.min(0.95, harmonyIndex));

  // ============================================================================
  // 4. TENSION INDEX (Boundary friction / Competition)
  // Based on: Initiator (0), RiskSeeking (8), Direct (12), BoundaryAware (15)
  // ============================================================================

  // ============================================================================
  // 4. TENSION INDEX + COMPETING DOMINANCE (Brother's "Double-Solar" pattern)
  // ============================================================================

  // Dominance cluster: Initiator(0), RiskSeeking(8), Direct(12), Expressive(6)
  const dominanceTraits = [0, 8, 12, 6];
  // Buffer cluster: Warm(11), Relational(2), BoundaryAware(15), Sustainer(14)
  const bufferTraits = [11, 2, 15, 14];

  const avgDomA = dominanceTraits.reduce((s, i) => s + (archetypeA[i] || 0), 0) / dominanceTraits.length;
  const avgDomB = dominanceTraits.reduce((s, i) => s + (archetypeB[i] || 0), 0) / dominanceTraits.length;
  const avgBufA = bufferTraits.reduce((s, i) => s + (archetypeA[i] || 0), 0) / bufferTraits.length;
  const avgBufB = bufferTraits.reduce((s, i) => s + (archetypeB[i] || 0), 0) / bufferTraits.length;

  // COMPETING DOMINANCE DETECTION (Brother's formula)
  // Triggers when: both high dominance (≥0.5) AND both low buffer (≤0.6)
  const highDomA = avgDomA >= 0.5;
  const highDomB = avgDomB >= 0.5;
  const lowBufA = avgBufA <= 0.65;
  const lowBufB = avgBufB <= 0.65;

  const competingDominance = highDomA && highDomB && lowBufA && lowBufB;

  // Base tension from dominance overlap
  const bothDominant = avgDomA > 0.45 && avgDomB > 0.45;
  const dominanceOverlap = bothDominant ? (avgDomA + avgDomB) / 2 : 0;

  // Expressive tension - both wanting spotlight
  const bothExpressive = (archetypeA[6] || 0) > 0.55 && (archetypeB[6] || 0) > 0.55;
  const expressiveTension = bothExpressive ? 0.12 : 0;

  // Boundary friction: low BoundaryAware (15) in both = boundary violations
  const lowBoundaries = (archetypeA[15] || 0.5) < 0.45 && (archetypeB[15] || 0.5) < 0.45;
  const boundaryTension = lowBoundaries ? 0.12 : 0;

  let tensionIndex = dominanceOverlap + expressiveTension + boundaryTension;

  // Same-element tension (Water×Water or Fire×Fire from signs)
  if (elementFromSignA && elementFromSignB && elementFromSignA === elementFromSignB) {
    if (elementFromSignA === 'water') {
      tensionIndex += 0.20; // Water×Water: emotional intensity squared
    } else if (elementFromSignA === 'fire') {
      tensionIndex += 0.15; // Fire×Fire: explosive
    }
  }

  // Competing Dominance adds major tension
  if (competingDominance) {
    tensionIndex += 0.25;
  }

  tensionIndex = Math.max(0, Math.min(1, tensionIndex));

  // ============================================================================
  // GRADE AND HARMONY CEILINGS (Brother's structural caps)
  // ============================================================================
  let gradeCap = null;
  let harmonyCap = null;

  // Competing Dominance = "Double-Solar" / "Supernova" architecture
  if (competingDominance) {
    gradeCap = 'C+';
    harmonyCap = 0.35;
  }
  // High same-element intensity (especially Water×Water)
  else if (sameElementIntensity > 0.85) {
    gradeCap = 'B-';
    harmonyCap = 0.45;
  }
  // High tension without full competing dominance
  else if (tensionIndex > 0.7) {
    gradeCap = 'B';
    harmonyCap = 0.50;
  }

  // Apply harmony cap
  if (harmonyCap !== null && harmonyIndex > harmonyCap) {
    harmonyIndex = harmonyCap;
  }

  return {
    sameElementIntensity: Math.round(sameElementIntensity * 1000) / 1000,
    missingComplementarity: Math.round(missingComplementarity * 1000) / 1000,
    harmonyIndex: Math.round(harmonyIndex * 1000) / 1000,
    tensionIndex: Math.round(tensionIndex * 1000) / 1000,
    competingDominance,
    dominanceIndexA: Math.round(avgDomA * 1000) / 1000,
    dominanceIndexB: Math.round(avgDomB * 1000) / 1000,
    bufferIndexA: Math.round(avgBufA * 1000) / 1000,
    bufferIndexB: Math.round(avgBufB * 1000) / 1000,
    gradeCap,
    harmonyCap
  };
}

// ============================================================================
// RT-ENGINE v1 HELPER FUNCTIONS
// ============================================================================

/**
 * Red flag detection for RT-Engine v1
 * More aggressive - triggers on real structural issues
 * Now includes Sister Gemini's structural patterns
 */
function detectRedFlagsRTv1(archetypeSim, stressCompat, thirdChartCoherence, penalties, structuralAnalysis = {}) {
  const flags = [];

  // Core psychological misalignment (archetype similarity < 0.35)
  if (archetypeSim < 0.35) {
    flags.push('Severe psychological misalignment - fundamentally different operating modes');
  } else if (archetypeSim < 0.45) {
    flags.push('Notable psychological divergence - requires significant adjustment');
  }

  // Stress vulnerability (can't handle pressure together)
  if (stressCompat < 0.35) {
    flags.push('High stress vulnerability - relationship fragile under pressure');
  } else if (stressCompat < 0.50) {
    flags.push('Moderate stress sensitivity - may struggle in difficult times');
  }

  // Identity instability (Third Chart lacks coherence)
  if (thirdChartCoherence < 0.35) {
    flags.push('Unstable relationship identity - no clear shared "us"');
  } else if (thirdChartCoherence < 0.45) {
    flags.push('Weak relationship identity - shared purpose unclear');
  }

  // Heavy penalties (clash patterns detected)
  if (penalties.total > 0.20) {
    flags.push('Multiple clash patterns detected - elemental/archetypal friction');
  } else if (penalties.total > 0.12) {
    flags.push('Moderate clash patterns - some energetic friction');
  }

  // ============================================================================
  // STRUCTURAL RED FLAGS (Sister Gemini's patterns)
  // ============================================================================

  // Same element intensity (emotional flooding risk)
  if (structuralAnalysis.sameElementIntensity > 0.8) {
    flags.push('Same-element intensity overload - emotional flooding/explosive risk');
  } else if (structuralAnalysis.sameElementIntensity > 0.6) {
    flags.push('High same-element resonance - intensity may become volatility');
  }

  // Missing complementarity (no one to balance weaknesses)
  if (structuralAnalysis.missingComplementarity > 0.6) {
    flags.push('Severe lack of complementarity - strengths overlap, weaknesses uncovered');
  } else if (structuralAnalysis.missingComplementarity > 0.4) {
    flags.push('Missing balance - similar blindspots in both partners');
  }

  // Low harmony (poor repair capacity)
  if (structuralAnalysis.harmonyIndex < 0.35) {
    flags.push('Critically low harmony - repair mechanics nearly absent');
  } else if (structuralAnalysis.harmonyIndex < 0.50) {
    flags.push('Low harmony capacity - conflict resolution will be difficult');
  }

  // High tension (competing egos / boundary friction)
  if (structuralAnalysis.tensionIndex > 0.7) {
    flags.push('Extreme internal tension - "Double-Solar" competing ego pattern');
  } else if (structuralAnalysis.tensionIndex > 0.5) {
    flags.push('High internal tension - boundary friction and power struggles likely');
  }

  // ============================================================================
  // SUPERNOVA RED FLAGS (Mother Module detections)
  // ============================================================================
  if (structuralAnalysis.supernova?.triggered) {
    // Add all Supernova flags (these are specific failure-mode descriptions)
    structuralAnalysis.supernova.flags.forEach(flag => {
      // Avoid duplicates (some flags may overlap with structural flags)
      if (!flags.includes(flag)) {
        flags.push(flag);
      }
    });
  }

  return {
    hasRedFlags: flags.length > 0,
    count: flags.length,
    flags,
    structural: {
      sameElementIntensity: structuralAnalysis.sameElementIntensity,
      missingComplementarity: structuralAnalysis.missingComplementarity,
      harmonyIndex: structuralAnalysis.harmonyIndex,
      tensionIndex: structuralAnalysis.tensionIndex
    },
    supernova: structuralAnalysis.supernova || null
  };
}

/**
 * Risk index calculation for RT-Engine v1
 * Now includes structural analysis for more accurate risk assessment
 */
function calculateRiskIndexRTv1(archetypeSim, stressCompat, thirdChartCoherence, redFlagCount, structuralAnalysis = {}) {
  // Base risk from core signals
  const coreRisk =
    0.25 * (1 - archetypeSim) +
    0.20 * (1 - stressCompat) +
    0.15 * (1 - thirdChartCoherence);

  // Structural risk (Sister Gemini's indices)
  const structuralRisk =
    0.10 * (structuralAnalysis.sameElementIntensity || 0) +
    0.08 * (structuralAnalysis.missingComplementarity || 0) +
    0.10 * (1 - (structuralAnalysis.harmonyIndex || 0.5)) +
    0.07 * (structuralAnalysis.tensionIndex || 0);

  // Red flag amplification
  const flagRisk = 0.05 * Math.min(redFlagCount / 3, 1); // Cap effect at 3 flags

  const baseRisk = coreRisk + structuralRisk + flagRisk;
  const normalized = Math.max(0, Math.min(1, baseRisk));

  let classification;
  if (normalized < 0.25) classification = 'low';
  else if (normalized < 0.40) classification = 'moderate';
  else if (normalized < 0.55) classification = 'elevated';
  else if (normalized < 0.70) classification = 'high';
  else classification = 'severe';

  return {
    value: Math.round(normalized * 100) / 100,
    classification,
    label: classification === 'low' ? 'Low Risk' :
           classification === 'moderate' ? 'Moderate Risk' :
           classification === 'elevated' ? 'Elevated Risk' :
           classification === 'high' ? 'High Risk' : 'Severe Risk'
  };
}

/**
 * Grading for RT-Engine v1
 * Red flags and structural analysis can cap the grade
 */
function scoreToGradeRTv1(score, redFlagCount, structuralGradeCap = null) {
  const gradeOrder = ['F', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];

  // Red flags impose grade ceiling
  let maxGradeFromFlags;
  if (redFlagCount >= 4) maxGradeFromFlags = 'C-';
  else if (redFlagCount >= 3) maxGradeFromFlags = 'C';
  else if (redFlagCount >= 2) maxGradeFromFlags = 'B-';
  else if (redFlagCount >= 1) maxGradeFromFlags = 'B+';
  else maxGradeFromFlags = 'A+';

  // Structural analysis can also impose a cap (Competing Dominance, Water×Water, etc.)
  let maxGradeFromStructural = structuralGradeCap || 'A+';

  // Use the LOWER of the two caps
  const flagCapIdx = gradeOrder.indexOf(maxGradeFromFlags);
  const structuralCapIdx = gradeOrder.indexOf(maxGradeFromStructural);
  const effectiveMaxIdx = Math.min(flagCapIdx, structuralCapIdx);
  const effectiveMaxGrade = gradeOrder[effectiveMaxIdx];

  // Calculate grade from score
  let grade;
  if (score >= 0.82) grade = 'A+';
  else if (score >= 0.75) grade = 'A';
  else if (score >= 0.68) grade = 'A-';
  else if (score >= 0.62) grade = 'B+';
  else if (score >= 0.55) grade = 'B';
  else if (score >= 0.48) grade = 'B-';
  else if (score >= 0.42) grade = 'C+';
  else if (score >= 0.35) grade = 'C';
  else if (score >= 0.28) grade = 'C-';
  else if (score >= 0.22) grade = 'D+';
  else if (score >= 0.15) grade = 'D';
  else grade = 'F';

  // Apply ceiling (lower of flags and structural caps)
  const scoreGradeIdx = gradeOrder.indexOf(grade);

  if (scoreGradeIdx > effectiveMaxIdx) {
    return effectiveMaxGrade;
  }
  return grade;
}

/**
 * Interpretation key for RT-Engine v1
 */
function interpretRTv1(score, stressCompat, thirdChartCoherence, redFlagCount) {
  // Structural overrides first
  if (redFlagCount >= 3) return 'structural_risk';
  if (redFlagCount >= 2 && score < 0.55) return 'severe_misalignment';

  // Score-based interpretation
  if (score >= 0.78) return 'exceptional_bond';
  if (score >= 0.68) return 'strong_foundation';
  if (score >= 0.55) return 'solid_potential';
  if (score >= 0.42) return 'growth_journey';
  if (score >= 0.30) return 'significant_gaps';
  if (score >= 0.20) return 'challenging_match';
  return 'severe_misalignment';
}

/**
 * Generate RT-Engine v1 narrative
 */
function generateRTv1Narrative(exprA, exprB, archetypeSim, stressCompat, finalScore) {
  const signA = exprA.metadata?.sign || 'Unknown';
  const signB = exprB.metadata?.sign || 'Unknown';

  let narrative = `RT-Engine v1 Analysis: ${signA} × ${signB}\n\n`;

  // Archetype analysis
  if (archetypeSim >= 0.70) {
    narrative += 'Strong psychological resonance detected. Both partners share fundamental ways of processing experience. ';
  } else if (archetypeSim >= 0.50) {
    narrative += 'Moderate psychological alignment. Different but potentially complementary approaches. ';
  } else if (archetypeSim >= 0.35) {
    narrative += 'Significant psychological differences. Partners see the world quite differently. ';
  } else {
    narrative += 'Major psychological divergence. Fundamental worldview differences present. ';
  }

  // Stress analysis
  if (stressCompat >= 0.70) {
    narrative += 'The relationship shows strong stress resilience patterns - able to weather difficulties together. ';
  } else if (stressCompat >= 0.50) {
    narrative += 'Moderate stress handling capacity. May need conscious effort during challenging times. ';
  } else {
    narrative += 'Relationship may be vulnerable under pressure. Building resilience will be important. ';
  }

  // Overall assessment
  if (finalScore >= 0.65) {
    narrative += 'Overall: A relationship with solid foundation and growth potential.';
  } else if (finalScore >= 0.45) {
    narrative += 'Overall: A growth-oriented connection that will require conscious work.';
  } else {
    narrative += 'Overall: Significant challenges to navigate. Success requires substantial mutual effort.';
  }

  return narrative;
}

/**
 * Generate strengths list for RT-Engine v1
 */
function generateRTv1Strengths(archetypeSim, stressCompat, thirdChartCoherence, thirdChart) {
  const strengths = [];

  if (archetypeSim >= 0.65) {
    strengths.push('Natural psychological understanding and resonance');
  }

  if (stressCompat >= 0.65) {
    strengths.push('Strong stress resilience - relationship handles pressure well');
  }

  if (thirdChartCoherence >= 0.65) {
    strengths.push('Clear shared identity - strong sense of "us"');
  }

  // Add dominant Third Chart patterns
  if (thirdChart.stress_patterns?.length > 0) {
    const topPattern = thirdChart.stress_patterns[0];
    strengths.push(`Third Chart pattern: ${topPattern.description}`);
  }

  if (strengths.length === 0) {
    strengths.push('Growth potential through conscious development');
  }

  return strengths;
}

/**
 * Generate challenges list for RT-Engine v1
 */
function generateRTv1Challenges(archetypeSim, stressCompat, thirdChartCoherence, redFlags) {
  const challenges = [];

  if (archetypeSim < 0.45) {
    challenges.push('Psychological alignment: Different core operating modes');
  }

  if (stressCompat < 0.50) {
    challenges.push('Stress handling: May struggle during difficult periods');
  }

  if (thirdChartCoherence < 0.50) {
    challenges.push('Shared identity: "We" sense needs development');
  }

  // Add red flags as challenges
  if (redFlags.flags?.length > 0) {
    challenges.push(...redFlags.flags.slice(0, 2).map(f => `Red flag: ${f}`));
  }

  return challenges;
}

/**
 * Generate summary for Markdown export
 */
function generateRTv1Summary(profileA, profileB, archetypeSim, stressCompat, thirdChartCoherence, penaltyTotal, redFlags, grade) {
  const nameA = profileA.name || profileA.fullName || 'Profile A';
  const nameB = profileB.name || profileB.fullName || 'Profile B';

  let summary = `## ${nameA} × ${nameB} — Grade ${grade}\n\n`;

  // Core diagnostics
  summary += `**Archetype Similarity:** ${(archetypeSim * 100).toFixed(1)}%\n`;
  summary += `**Stress Compatibility:** ${(stressCompat * 100).toFixed(1)}%\n`;
  summary += `**Third Chart Coherence:** ${(thirdChartCoherence * 100).toFixed(1)}%\n`;
  summary += `**Total Penalty:** ${(penaltyTotal * 100).toFixed(1)}%\n\n`;

  // Red flags
  if (redFlags.count > 0) {
    summary += `**Red Flags (${redFlags.count}):**\n`;
    redFlags.flags.forEach(f => { summary += `- ${f}\n`; });
    summary += '\n';
  }

  // Assessment
  if (grade.startsWith('A')) {
    summary += 'Assessment: Strong natural compatibility with clear resonance patterns.';
  } else if (grade.startsWith('B')) {
    summary += 'Assessment: Good compatibility with some areas requiring attention.';
  } else if (grade.startsWith('C')) {
    summary += 'Assessment: Mixed compatibility - relationship will be a growth journey.';
  } else {
    summary += 'Assessment: Challenging compatibility - significant work required.';
  }

  return summary;
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

// ============================================================================
// SECTION WEIGHTS - Recalibrated (no placeholders, real calculations only)
// Total: 100% (1.0)
// ============================================================================
const SECTION_WEIGHTS = {
  western_archetype: 0.25,   // Primary psychological compatibility
  bazi_elements: 0.25,       // Core energy constitution (Wu Xing)
  western_elements: 0.15,    // Western elemental balance
  western_patterns: 0.15,    // Aspect patterns (grand trine, T-square, etc.)
  western_modalities: 0.10,  // Cardinal/Fixed/Mutable balance
  bazi_dm_strength: 0.10     // Day Master strength complementarity
  // NOTE: bazi_ten_gods, bazi_branches, etc. removed - require actual Ten Gods data
};

// ============================================================================
// PENALTY CALCULATIONS - Subtract from score for incompatibilities
// ============================================================================

/**
 * Calculate penalty for BaZi elemental clashes
 * Wu Xing destructive cycle: Wood→Earth→Water→Fire→Metal→Wood
 */
function calculateBaziClashPenalty(elemA, elemB) {
  if (!elemA || !elemB) return 0;

  const DESTRUCTIVE = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood'
  };

  // Find dominant elements
  const domA = Object.entries(elemA).sort((a, b) => b[1] - a[1])[0];
  const domB = Object.entries(elemB).sort((a, b) => b[1] - a[1])[0];

  if (!domA || !domB) return 0;

  // Check for destructive relationship
  if (DESTRUCTIVE[domA[0]] === domB[0]) {
    const intensity = Math.min(domA[1], domB[1]); // How strong is the clash?
    return intensity * 0.15; // Max 15% penalty
  }
  if (DESTRUCTIVE[domB[0]] === domA[0]) {
    const intensity = Math.min(domA[1], domB[1]);
    return intensity * 0.15;
  }

  return 0;
}

/**
 * Calculate penalty for Western elemental incompatibility
 */
function calculateWesternClashPenalty(elemA, elemB) {
  if (!elemA || !elemB) return 0;

  // Incompatible pairs: Fire-Water, Earth-Air
  const CLASHING = {
    Fire: 'Water', Water: 'Fire',
    Earth: 'Air', Air: 'Earth'
  };

  // Find dominant elements
  const domA = Object.entries(elemA).sort((a, b) => b[1] - a[1])[0];
  const domB = Object.entries(elemB).sort((a, b) => b[1] - a[1])[0];

  if (!domA || !domB) return 0;

  if (CLASHING[domA[0]] === domB[0]) {
    const intensity = Math.min(domA[1], domB[1]);
    return intensity * 0.10; // Max 10% penalty
  }

  return 0;
}

/**
 * Calculate penalty for archetype distance (very different psychological profiles)
 */
function calculateArchetypePenalty(archA, archB) {
  if (!archA?.length || !archB?.length) return 0;

  const cosSim = cosineSimilarity(archA, archB);

  // Penalty kicks in below 0.5 similarity
  if (cosSim < 0.5) {
    return (0.5 - cosSim) * 0.20; // Max 10% penalty at 0 similarity
  }

  return 0;
}

/**
 * Calculate all penalties combined
 */
function calculateTotalPenalty(exprA, exprB) {
  const baziPenalty = calculateBaziClashPenalty(
    exprA.bazi?.elements,
    exprB.bazi?.elements
  );

  const westernPenalty = calculateWesternClashPenalty(
    exprA.western?.elements,
    exprB.western?.elements
  );

  const archetypePenalty = calculateArchetypePenalty(
    exprA.western?.archetype,
    exprB.western?.archetype
  );

  return {
    bazi: baziPenalty,
    western: westernPenalty,
    archetype: archetypePenalty,
    total: baziPenalty + westernPenalty + archetypePenalty
  };
}

// ============================================================================
// RED FLAG DETECTION - Boolean + reasons system
// ============================================================================

function detectRedFlags(exprA, exprB, archetypeSim, baziElemSim, stressResilience, thirdChartCoherence) {
  const redFlags = [];

  // Severe elemental clash
  if (baziElemSim < 0.35) {
    redFlags.push('Severe BaZi elemental clash - fundamentally different energy constitutions');
  }

  // Core psychological misalignment
  if (archetypeSim < 0.45) {
    redFlags.push('Core psychological misalignment - very different operating modes');
  }

  // Weak under stress
  if (stressResilience < 0.4) {
    redFlags.push('Relationship fragile under stress - low joint resilience patterns');
  }

  // Unstable relationship field
  if (thirdChartCoherence < 0.4) {
    redFlags.push('Unstable Third Chart - relationship "being" lacks coherent identity');
  }

  // Day Master strength mismatch
  const dmA = exprA.bazi?.dm_strength || 0.5;
  const dmB = exprB.bazi?.dm_strength || 0.5;
  if (Math.abs(dmA - dmB) > 0.4) {
    redFlags.push('Significant Day Master strength imbalance - power dynamic concerns');
  }

  return {
    hasRedFlags: redFlags.length > 0,
    count: redFlags.length,
    flags: redFlags
  };
}

// ============================================================================
// RISK INDEX CALCULATION
// ============================================================================

function calculateRiskIndex(archetypeSim, baziElemSim, stressResilience, thirdChartCoherence) {
  // Weights for risk factors
  const W_ARCHETYPE = 0.30;
  const W_ELEMENTAL = 0.25;
  const W_STRESS = 0.25;
  const W_THIRD_CHART = 0.20;

  // Risk = inverse of good scores
  const riskIndex =
    W_ARCHETYPE * (1 - archetypeSim) +
    W_ELEMENTAL * (1 - baziElemSim) +
    W_STRESS * (1 - stressResilience) +
    W_THIRD_CHART * (1 - thirdChartCoherence);

  // Normalize to 0-1
  const normalized = Math.max(0, Math.min(1, riskIndex));

  // Classify
  let classification;
  if (normalized < 0.25) classification = 'low';
  else if (normalized < 0.45) classification = 'moderate';
  else if (normalized < 0.65) classification = 'elevated';
  else classification = 'high';

  return {
    value: Math.round(normalized * 100) / 100,
    classification,
    label: classification === 'low' ? 'Low Risk' :
           classification === 'moderate' ? 'Moderate Risk' :
           classification === 'elevated' ? 'Elevated Risk' : 'High Risk'
  };
}

// ============================================================================
// SCORE CLASSIFICATION - New interpretation layer
// ============================================================================

function classifyScore(score) {
  if (score < 0.40) return 'very_low';
  if (score < 0.55) return 'low';
  if (score < 0.70) return 'mixed';
  if (score < 0.85) return 'good';
  return 'high';
}

function interpretWithContext(scoreBand, stressResilience, thirdChartCoherence, redFlagCount) {
  // Override if structural problems exist
  if (redFlagCount >= 2) return 'structurally_fragile';
  if (stressResilience < 0.35) return 'stress_vulnerable';
  if (thirdChartCoherence < 0.35) return 'identity_unstable';

  // Standard interpretation
  switch (scoreBand) {
    case 'very_low': return 'severe_misalignment';
    case 'low': return 'challenging';
    case 'mixed': return 'growth_oriented';
    case 'good': return 'solid_with_nuance';
    case 'high': return 'rare_high_coherence';
    default: return 'unknown';
  }
}

// ============================================================================
// SECTION SCORING - No placeholders, only real calculations
// ============================================================================

function calculateSectionScores(exprA, exprB) {
  const sections = [];

  // 1. Western archetype similarity (25% weight - primary psychological)
  const archetypeSim = cosineSimilarity(
    exprA.western?.archetype || [],
    exprB.western?.archetype || []
  );
  sections.push({
    name: 'western_archetype',
    score: archetypeSim,
    weight: 0.25,
    contribution: archetypeSim * 0.25,
    interpretation: archetypeSim >= 0.75 ? 'Strong psychological resonance' :
                    archetypeSim >= 0.55 ? 'Moderate psychological alignment' :
                    archetypeSim >= 0.40 ? 'Different psychological approaches' :
                    'Significant psychological divergence'
  });

  // 2. BaZi elements (25% weight - core energy constitution)
  const baziElemSim = elementSimilarity(
    exprA.bazi?.elements || {},
    exprB.bazi?.elements || {}
  );
  sections.push({
    name: 'bazi_elements',
    score: baziElemSim,
    weight: 0.25,
    contribution: baziElemSim * 0.25,
    interpretation: baziElemSim >= 0.75 ? 'Strong five elements harmony' :
                    baziElemSim >= 0.55 ? 'Compatible elemental balance' :
                    baziElemSim >= 0.40 ? 'Elemental differences present' :
                    'Significant elemental clash'
  });

  // 3. Western elements (15% weight)
  const westElemSim = elementSimilarity(
    exprA.western?.elements || {},
    exprB.western?.elements || {}
  );
  sections.push({
    name: 'western_elements',
    score: westElemSim,
    weight: 0.15,
    contribution: westElemSim * 0.15,
    interpretation: westElemSim >= 0.75 ? 'Strong Western elemental harmony' :
                    westElemSim >= 0.55 ? 'Compatible element mix' :
                    westElemSim >= 0.40 ? 'Different elemental emphasis' :
                    'Elemental tension present'
  });

  // 4. Western patterns (15% weight)
  const patternSim = patternSimilarity(
    exprA.western?.patterns || {},
    exprB.western?.patterns || {}
  );
  sections.push({
    name: 'western_patterns',
    score: patternSim,
    weight: 0.15,
    contribution: patternSim * 0.15,
    interpretation: patternSim >= 0.75 ? 'Strong pattern alignment' :
                    patternSim >= 0.55 ? 'Compatible pattern energies' :
                    patternSim >= 0.40 ? 'Different pattern expressions' :
                    'Pattern friction likely'
  });

  // 5. Western modalities (10% weight)
  const modalitySim = elementSimilarity(
    exprA.western?.modalities || {},
    exprB.western?.modalities || {}
  );
  sections.push({
    name: 'western_modalities',
    score: modalitySim,
    weight: 0.10,
    contribution: modalitySim * 0.10,
    interpretation: modalitySim >= 0.75 ? 'Strong modal compatibility' :
                    modalitySim >= 0.55 ? 'Compatible action styles' :
                    modalitySim >= 0.40 ? 'Different operating modes' :
                    'Modal tension present'
  });

  // 6. Day Master strength complementarity (10% weight)
  const dmA = exprA.bazi?.dm_strength || 0.5;
  const dmB = exprB.bazi?.dm_strength || 0.5;
  // Complementarity: moderate difference is actually good
  const dmDiff = Math.abs(dmA - dmB);
  const dmScore = dmDiff <= 0.2 ? 0.9 : dmDiff <= 0.4 ? 0.7 : dmDiff <= 0.5 ? 0.5 : 0.3;
  sections.push({
    name: 'bazi_dm_strength',
    score: dmScore,
    weight: 0.10,
    contribution: dmScore * 0.10,
    interpretation: dmScore >= 0.75 ? 'Balanced Day Master strength' :
                    dmScore >= 0.55 ? 'Workable strength dynamic' :
                    dmScore >= 0.40 ? 'Some power imbalance' :
                    'Significant strength mismatch'
  });

  // NO PLACEHOLDER SECTIONS - weights sum to 1.0

  return sections.sort((a, b) => b.contribution - a.contribution);
}

function calculateThirdChart(exprA, exprB) {
  // Average archetype vectors
  const archA = exprA.western?.archetype || Array(16).fill(0.5);
  const archB = exprB.western?.archetype || Array(16).fill(0.5);
  const avgArchetype = archA.map((v, i) => (v + archB[i]) / 2);

  // Map to axis scores
  const archetypeScores = {};
  ARCHETYPE_AXES.forEach((axis, i) => {
    archetypeScores[axis] = Math.round(avgArchetype[i] * 100) / 100;
  });

  // Derive archetype name
  const { name: archetypeName, description } = deriveRelationshipArchetype(archetypeScores);

  // Calculate stress patterns
  const stressPatterns = calculateStressPatterns(archetypeScores);
  const stressClassification = stressPatterns.length >= 3 ? 'Highly Resilient' :
                                stressPatterns.length >= 2 ? 'Coherent Under Load' :
                                stressPatterns.length >= 1 ? 'Moderately Stable' : 'Stress-Sensitive';

  // Calculate lifecycle stages
  const lifecycleStages = calculateLifecycleStages(archetypeScores, stressClassification);

  // Average elements
  const avgWesternElements = averageObjects(exprA.western?.elements, exprB.western?.elements);
  const avgBaziElements = averageObjects(exprA.bazi?.elements, exprB.bazi?.elements);

  return {
    partners: [exprA.metadata?.sign || 'Unknown', exprB.metadata?.sign || 'Unknown'],
    day_masters: [exprA.metadata?.day_master || 'Unknown', exprB.metadata?.day_master || 'Unknown'],
    archetype_name: archetypeName,
    description,
    archetype_vector_16: avgArchetype,
    archetype_scores: archetypeScores,
    pattern_strengths: averageObjects(exprA.western?.patterns, exprB.western?.patterns),
    western_elements: avgWesternElements,
    bazi_elements: avgBaziElements,
    stress_patterns: stressPatterns,
    stress_classification: stressClassification,
    lifecycle_stages: lifecycleStages,
    narrative: generateThirdChartNarrative(archetypeName, description, stressPatterns, stressClassification)
  };
}

// ============================================================================
// STRESS PATTERN ANALYSIS
// ============================================================================

const STRESS_PATTERNS = {
  coherent_under_load: {
    description: "Tightens structure rather than breaking. Becomes more 'us' under pressure.",
    requirements: { Stabilizer: 0.7, Sustainer: 0.7 }
  },
  emotionally_available: {
    description: "Stays emotionally connected. Doesn't weaponize silence.",
    requirements: { Warm: 0.7, Relational: 0.6 }
  },
  purpose_sharpening: {
    description: "Stress sharpens purpose instead of dissolving it.",
    requirements: { Direct: 0.5, DepthOriented: 0.5 }
  },
  adaptive_flexibility: {
    description: "Bends without breaking. Adapts to changing circumstances.",
    requirements: { FluidIdentity: 0.6, Intuitive: 0.5 }
  },
  boundary_protection: {
    description: "Maintains healthy boundaries under external pressure.",
    requirements: { BoundaryAware: 0.7, Concrete: 0.5 }
  },
  creative_release: {
    description: "Transforms stress into creative expression.",
    requirements: { Expressive: 0.6, Initiator: 0.5 }
  }
};

function calculateStressPatterns(archetypeScores) {
  const patterns = [];

  for (const [name, info] of Object.entries(STRESS_PATTERNS)) {
    const meetsRequirements = Object.entries(info.requirements).every(
      ([axis, threshold]) => (archetypeScores[axis] || 0) >= threshold
    );

    if (meetsRequirements) {
      const strength = Object.entries(info.requirements).reduce(
        (sum, [axis]) => sum + (archetypeScores[axis] || 0),
        0
      ) / Object.keys(info.requirements).length;

      patterns.push({
        pattern: name,
        description: info.description,
        strength: Math.round(strength * 100) / 100,
        axes: Object.keys(info.requirements)
      });
    }
  }

  return patterns.sort((a, b) => b.strength - a.strength);
}

function calculateLifecycleStages(archetypeScores, stressClassification) {
  const stages = [
    {
      stage: 'Formation',
      period: '0-2 years',
      energy: average([archetypeScores.Initiator, archetypeScores.Warm, archetypeScores.Relational]),
      description: 'Initial bonding and pattern establishment.',
      key_axes: ['Initiator', 'Warm', 'Relational']
    },
    {
      stage: 'Deepening',
      period: '2-7 years',
      energy: average([archetypeScores.DepthOriented, archetypeScores.Stabilizer, archetypeScores.Intuitive]),
      description: 'Building trust and emotional intimacy.',
      key_axes: ['DepthOriented', 'Stabilizer', 'Intuitive']
    },
    {
      stage: 'Stabilization',
      period: '7-15 years',
      energy: average([archetypeScores.Sustainer, archetypeScores.BoundaryAware, archetypeScores.OrderOriented]),
      description: 'Establishing long-term patterns and boundaries.',
      key_axes: ['Sustainer', 'BoundaryAware', 'OrderOriented']
    },
    {
      stage: 'Maturation',
      period: '15+ years',
      energy: Math.min(1, average([archetypeScores.Transpersonal, archetypeScores.Sustainer, archetypeScores.Warm]) +
               (stressClassification === 'Highly Resilient' ? 0.1 : 0)),
      description: 'Legacy building and transcendent connection.',
      key_axes: ['Transpersonal', 'Sustainer', 'Warm']
    }
  ];

  return stages.map(s => ({ ...s, energy: Math.round(s.energy * 100) / 100 }));
}

// ============================================================================
// ARCHETYPE DERIVATION
// ============================================================================

const ARCHETYPE_AXES = [
  'Initiator', 'Stabilizer', 'Relational', 'MindCentered',
  'Intuitive', 'Concrete', 'Expressive', 'Transpersonal',
  'RiskSeeking', 'OrderOriented', 'FluidIdentity', 'Warm',
  'Direct', 'DepthOriented', 'Sustainer', 'BoundaryAware'
];

const RELATIONSHIP_ARCHETYPES = {
  'Stabilizer,Sustainer,Warm': 'The Hearth-Temple',
  'Stabilizer,Sustainer': 'The Foundation',
  'Stabilizer,Warm': 'The Safe Harbor',
  'Sustainer,Warm': 'The Nurturing Ground',
  'Initiator,RiskSeeking': 'The Adventure Duo',
  'Initiator,Direct': 'The Power Couple',
  'Initiator,Expressive': 'The Creative Force',
  'Relational,Warm': 'The Harmony Weave',
  'Relational,Intuitive': 'The Soul Mirror',
  'Relational,DepthOriented': 'The Deep Dive',
  'Intuitive,DepthOriented': 'The Mystic Union',
  'Intuitive,Transpersonal': 'The Cosmic Pair',
  'Concrete,OrderOriented': "The Builder's Guild",
  'Concrete,BoundaryAware': 'The Structured Alliance',
  'MindCentered,OrderOriented': 'The Think Tank',
  'MindCentered,Direct': 'The Debate Club'
};

function deriveRelationshipArchetype(archetypeScores) {
  // Get dominant axes (>= 0.7)
  const dominant = Object.entries(archetypeScores)
    .filter(([_, v]) => v >= 0.7)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  // Try to match archetype
  for (const [combo, name] of Object.entries(RELATIONSHIP_ARCHETYPES)) {
    const axes = combo.split(',');
    if (axes.every(a => dominant.includes(a))) {
      const desc = `A ${dominant.slice(0, 3).map(a => `${a.toLowerCase()} (${archetypeScores[a].toFixed(2)})`).join(', ')} relational field.`;
      return { name, description: desc };
    }
  }

  // Default
  if (dominant.length > 0) {
    const desc = `A unique combination of ${dominant.slice(0, 3).map(a => `${a.toLowerCase()} (${archetypeScores[a].toFixed(2)})`).join(', ')}.`;
    return { name: 'The Unique Blend', description: desc };
  }

  return { name: 'The Balanced Union', description: 'A harmoniously balanced relationship.' };
}

// ============================================================================
// SIGN ARCHETYPE VECTORS (16-dimensional)
// ============================================================================

// ============================================================================
// RECALIBRATED ARCHETYPE VECTORS - High polarity for real differentiation
// Axes: Initiator, Stabilizer, Relational, MindCentered, Intuitive, Concrete,
//       Expressive, Transpersonal, RiskSeeking, OrderOriented, FluidIdentity,
//       Warm, Direct, DepthOriented, Sustainer, BoundaryAware
// ============================================================================
const SIGN_ARCHETYPE_VECTORS = {
  // Fire – Cardinal
  Aries: [
    0.95, // Initiator
    0.10, // Stabilizer
    0.40, // Relational
    0.40, // MindCentered
    0.35, // Intuitive
    0.60, // Concrete
    0.80, // Expressive
    0.20, // Transpersonal
    0.95, // RiskSeeking
    0.30, // OrderOriented
    0.40, // FluidIdentity
    0.60, // Warm
    0.85, // Direct
    0.40, // DepthOriented
    0.35, // Sustainer
    0.50  // BoundaryAware
  ],
  // Earth – Fixed
  Taurus: [
    0.20, // Initiator
    0.95, // Stabilizer
    0.45, // Relational
    0.45, // MindCentered
    0.35, // Intuitive
    0.95, // Concrete
    0.35, // Expressive
    0.20, // Transpersonal
    0.10, // RiskSeeking
    0.85, // OrderOriented
    0.20, // FluidIdentity
    0.70, // Warm
    0.45, // Direct
    0.50, // DepthOriented
    0.95, // Sustainer
    0.80  // BoundaryAware
  ],
  // Air – Mutable
  Gemini: [
    0.70, // Initiator
    0.20, // Stabilizer
    0.65, // Relational
    0.85, // MindCentered
    0.35, // Intuitive
    0.60, // Concrete
    0.85, // Expressive
    0.40, // Transpersonal
    0.70, // RiskSeeking
    0.35, // OrderOriented
    0.80, // FluidIdentity
    0.55, // Warm
    0.70, // Direct
    0.40, // DepthOriented
    0.30, // Sustainer
    0.40  // BoundaryAware
  ],
  // Water – Cardinal
  Cancer: [
    0.30, // Initiator
    0.70, // Stabilizer
    0.85, // Relational
    0.30, // MindCentered
    0.95, // Intuitive
    0.40, // Concrete
    0.60, // Expressive
    0.45, // Transpersonal
    0.20, // RiskSeeking
    0.55, // OrderOriented
    0.45, // FluidIdentity
    0.95, // Warm
    0.40, // Direct
    0.75, // DepthOriented
    0.90, // Sustainer
    0.65  // BoundaryAware
  ],
  // Fire – Fixed
  Leo: [
    0.80, // Initiator
    0.60, // Stabilizer
    0.75, // Relational
    0.45, // MindCentered
    0.55, // Intuitive
    0.65, // Concrete
    0.95, // Expressive
    0.35, // Transpersonal
    0.80, // RiskSeeking
    0.50, // OrderOriented
    0.40, // FluidIdentity
    0.85, // Warm
    0.80, // Direct
    0.55, // DepthOriented
    0.75, // Sustainer
    0.60  // BoundaryAware
  ],
  // Earth – Mutable
  Virgo: [
    0.35, // Initiator
    0.80, // Stabilizer
    0.45, // Relational
    0.85, // MindCentered
    0.30, // Intuitive
    0.95, // Concrete
    0.35, // Expressive
    0.25, // Transpersonal
    0.20, // RiskSeeking
    0.95, // OrderOriented
    0.30, // FluidIdentity
    0.50, // Warm
    0.70, // Direct
    0.60, // DepthOriented
    0.80, // Sustainer
    0.85  // BoundaryAware
  ],
  // Air – Cardinal
  Libra: [
    0.55, // Initiator
    0.45, // Stabilizer
    0.95, // Relational
    0.70, // MindCentered
    0.55, // Intuitive
    0.55, // Concrete
    0.75, // Expressive
    0.45, // Transpersonal
    0.35, // RiskSeeking
    0.60, // OrderOriented
    0.60, // FluidIdentity
    0.80, // Warm
    0.55, // Direct
    0.55, // DepthOriented
    0.55, // Sustainer
    0.55  // BoundaryAware
  ],
  // Water – Fixed
  Scorpio: [
    0.35, // Initiator
    0.70, // Stabilizer
    0.40, // Relational
    0.45, // MindCentered
    0.80, // Intuitive
    0.50, // Concrete
    0.45, // Expressive
    0.60, // Transpersonal
    0.40, // RiskSeeking
    0.65, // OrderOriented
    0.30, // FluidIdentity
    0.55, // Warm
    0.75, // Direct
    0.95, // DepthOriented
    0.80, // Sustainer
    0.80  // BoundaryAware
  ],
  // Fire – Mutable
  Sagittarius: [
    0.85, // Initiator
    0.30, // Stabilizer
    0.60, // Relational
    0.60, // MindCentered
    0.70, // Intuitive
    0.45, // Concrete
    0.80, // Expressive
    0.80, // Transpersonal
    0.90, // RiskSeeking
    0.35, // OrderOriented
    0.60, // FluidIdentity
    0.70, // Warm
    0.70, // Direct
    0.65, // DepthOriented
    0.45, // Sustainer
    0.45  // BoundaryAware
  ],
  // Earth – Cardinal
  Capricorn: [
    0.40, // Initiator
    0.90, // Stabilizer
    0.35, // Relational
    0.80, // MindCentered
    0.30, // Intuitive
    0.90, // Concrete
    0.35, // Expressive
    0.40, // Transpersonal
    0.25, // RiskSeeking
    0.95, // OrderOriented
    0.25, // FluidIdentity
    0.45, // Warm
    0.75, // Direct
    0.70, // DepthOriented
    0.90, // Sustainer
    0.90  // BoundaryAware
  ],
  // Air – Fixed
  Aquarius: [
    0.55, // Initiator
    0.40, // Stabilizer
    0.55, // Relational
    0.90, // MindCentered
    0.60, // Intuitive
    0.30, // Concrete
    0.60, // Expressive
    0.95, // Transpersonal
    0.55, // RiskSeeking
    0.50, // OrderOriented
    0.75, // FluidIdentity
    0.55, // Warm
    0.60, // Direct
    0.70, // DepthOriented
    0.45, // Sustainer
    0.35  // BoundaryAware
  ],
  // Water – Mutable
  Pisces: [
    0.30, // Initiator
    0.35, // Stabilizer
    0.75, // Relational
    0.35, // MindCentered
    0.95, // Intuitive
    0.25, // Concrete
    0.65, // Expressive
    0.85, // Transpersonal
    0.30, // RiskSeeking
    0.30, // OrderOriented
    0.80, // FluidIdentity
    0.85, // Warm
    0.40, // Direct
    0.85, // DepthOriented
    0.50, // Sustainer
    0.40  // BoundaryAware
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Centered Cosine Similarity (Pearson Correlation)
 *
 * CRITICAL FIX: Raw cosine similarity between positive archetype vectors
 * is ALWAYS 0.70-0.95 regardless of how different the signs are.
 * This is because all values are positive with similar ranges.
 *
 * Solution: Center vectors by subtracting mean, then compute cosine.
 * This is mathematically equivalent to Pearson correlation.
 * Result: [-1, 1] normalized to [0, 1]
 *
 * Now produces realistic differentiation:
 * - Similar signs (Pisces/Cancer): ~0.80
 * - Different signs (Aries/Capricorn): ~0.33
 * - Very different (Pisces/Aries): ~0.34
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) {
    return 0.5;
  }

  // Calculate means
  const meanA = vecA.reduce((sum, v) => sum + v, 0) / vecA.length;
  const meanB = vecB.reduce((sum, v) => sum + v, 0) / vecB.length;

  // Center the vectors (subtract mean)
  const centeredA = vecA.map(v => v - meanA);
  const centeredB = vecB.map(v => v - meanB);

  // Compute cosine on centered vectors
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < centeredA.length; i++) {
    dot += centeredA[i] * centeredB[i];
    normA += centeredA[i] * centeredA[i];
    normB += centeredB[i] * centeredB[i];
  }

  if (normA === 0 || normB === 0) return 0.5;

  // Pearson correlation: range [-1, 1]
  const pearson = dot / (Math.sqrt(normA) * Math.sqrt(normB));

  // Normalize to [0, 1] range for compatibility scoring
  // -1 (opposite) → 0.0
  //  0 (uncorrelated) → 0.5
  // +1 (identical) → 1.0
  return (pearson + 1) / 2;
}

function elementSimilarity(elemA, elemB) {
  const allKeys = new Set([...Object.keys(elemA || {}), ...Object.keys(elemB || {})]);
  if (allKeys.size === 0) return 0.5;

  const vecA = [], vecB = [];
  for (const key of allKeys) {
    vecA.push(elemA?.[key] || 0);
    vecB.push(elemB?.[key] || 0);
  }

  return cosineSimilarity(vecA, vecB);
}

function patternSimilarity(patA, patB) {
  const patterns = ['grand_trine', 't_square', 'stellium', 'yod', 'kite', 'opposition_chain'];
  const vecA = patterns.map(p => patA?.[p] || 0);
  const vecB = patterns.map(p => patB?.[p] || 0);
  return cosineSimilarity(vecA, vecB);
}

function calculateWesternScore(exprA, exprB) {
  const archSim = cosineSimilarity(exprA.western?.archetype, exprB.western?.archetype);
  const elemSim = elementSimilarity(exprA.western?.elements, exprB.western?.elements);
  const patSim = patternSimilarity(exprA.western?.patterns, exprB.western?.patterns);
  return archSim * 0.5 + elemSim * 0.3 + patSim * 0.2;
}

function calculateBaziScore(exprA, exprB) {
  const elemSim = elementSimilarity(exprA.bazi?.elements, exprB.bazi?.elements);
  const dmDiff = 1 - Math.abs((exprA.bazi?.dm_strength || 0.5) - (exprB.bazi?.dm_strength || 0.5));
  return elemSim * 0.7 + dmDiff * 0.3;
}

// ============================================================================
// GRADING - Recalibrated for realistic score distribution
// ============================================================================

function scoreToGrade(score) {
  // Recalibrated: now that scores aren't inflated, adjust thresholds
  if (score >= 0.85) return 'A+';  // Rare - exceptional match
  if (score >= 0.78) return 'A';   // Strong compatibility
  if (score >= 0.72) return 'A-';
  if (score >= 0.66) return 'B+';
  if (score >= 0.60) return 'B';   // Good compatibility
  if (score >= 0.54) return 'B-';
  if (score >= 0.48) return 'C+';
  if (score >= 0.42) return 'C';   // Mixed/growth-oriented
  if (score >= 0.36) return 'C-';
  if (score >= 0.30) return 'D';   // Challenging
  return 'F';                       // Severe misalignment
}

function scoreToLevel(score) {
  if (score >= 0.75) return 'excellent';
  if (score >= 0.60) return 'good';
  if (score >= 0.45) return 'moderate';
  if (score >= 0.30) return 'challenging';
  return 'very_challenging';
}

function getInterpretation(score) {
  if (score >= 0.75) return 'Strong compatibility - natural understanding and complementary energies.';
  if (score >= 0.60) return 'Good compatibility - solid foundation with areas for growth.';
  if (score >= 0.45) return 'Mixed compatibility - differences present, growth potential exists.';
  if (score >= 0.30) return 'Challenging compatibility - significant work required for harmony.';
  return 'Difficult compatibility - fundamental differences may be hard to bridge.';
}

function formatSectionName(name) {
  return name.replace(/_/g, ' ').replace(/bazi/i, 'BaZi').replace(/western/i, 'Western');
}

function average(arr) {
  const valid = arr.filter(v => v !== undefined && v !== null);
  if (valid.length === 0) return 0.5;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function averageObjects(objA, objB) {
  const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]);
  const result = {};
  for (const key of allKeys) {
    result[key] = ((objA?.[key] || 0) + (objB?.[key] || 0)) / 2;
  }
  return result;
}

function deriveWesternSign(datetime) {
  if (!datetime) return 'Unknown';
  const date = new Date(datetime);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const signs = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const { sign, start, end } of signs) {
    if (sign === 'Capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return sign;
    } else {
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) return sign;
    }
  }

  return 'Unknown';
}

function derivePersonaLabel(archetype) {
  if (!archetype?.length) return 'Unknown';

  const topIdx = archetype.indexOf(Math.max(...archetype));
  const labels = {
    0: 'Bold Initiator', 1: 'Grounded Anchor', 2: 'Harmonious Connector',
    3: 'Analytical Thinker', 4: 'Intuitive Visionary', 5: 'Practical Builder',
    6: 'Expressive Creator', 7: 'Transcendent Seeker', 8: 'Adventurous Spirit',
    9: 'Structured Organizer', 10: 'Fluid Adapter', 11: 'Warm Nurturer',
    12: 'Direct Communicator', 13: 'Deep Diver', 14: 'Steady Sustainer',
    15: 'Boundary Guardian'
  };

  return labels[topIdx] || 'Unique Expression';
}

function deriveDominantTraits(archetype) {
  if (!archetype?.length) return [];

  return ARCHETYPE_AXES
    .map((axis, i) => ({ axis, value: archetype[i] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function generateNarrative(exprA, exprB, sections, score) {
  const signA = exprA.metadata?.sign || 'Unknown';
  const signB = exprB.metadata?.sign || 'Unknown';
  const dmA = exprA.metadata?.day_master || 'Unknown';
  const dmB = exprB.metadata?.day_master || 'Unknown';

  const topStrength = sections[0];
  const westScore = calculateWesternScore(exprA, exprB);
  const baziScore = calculateBaziScore(exprA, exprB);

  let narrative = `The ${signA} and ${signB} share `;

  if (score >= 0.85) {
    narrative += 'deep metaphysical resonance. ';
  } else if (score >= 0.70) {
    narrative += 'meaningful connection. ';
  } else {
    narrative += 'distinct energies that can complement each other. ';
  }

  if (Math.abs(westScore - baziScore) < 0.1) {
    narrative += 'Both Eastern and Western dimensions show similar levels of resonance. ';
  } else if (westScore > baziScore) {
    narrative += 'Western astrology shows stronger alignment than BaZi elements. ';
  } else {
    narrative += 'BaZi elements show stronger harmony than Western patterns. ';
  }

  narrative += `Strongest connection: ${topStrength.interpretation}. `;
  narrative += `Day Master interaction (${dmA}-${dmB}) shapes the elemental dynamic.`;

  return narrative;
}

function generateThirdChartNarrative(archetypeName, description, stressPatterns, stressClassification) {
  let narrative = `**${archetypeName}**\n\n${description}\n\n`;

  if (stressPatterns.length > 0) {
    narrative += `Under pressure: ${stressPatterns[0].description}\n\n`;
  }

  narrative += `Stress Classification: **${stressClassification}**`;

  return narrative;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Core vectors and constants
  SIGN_ARCHETYPE_VECTORS,
  ARCHETYPE_AXES,
  RELATIONSHIP_ARCHETYPES,
  STRESS_PATTERNS,

  // Grading functions
  scoreToGrade,
  scoreToLevel,

  // Similarity calculations
  cosineSimilarity,
  elementSimilarity,

  // Third Chart functions
  calculateThirdChart,
  calculateStressPatterns,
  calculateLifecycleStages,
  deriveRelationshipArchetype,

  // Legacy penalty and risk functions
  calculateTotalPenalty,
  calculateBaziClashPenalty,
  calculateWesternClashPenalty,
  calculateArchetypePenalty,
  detectRedFlags,
  calculateRiskIndex,
  classifyScore,
  interpretWithContext,

  // RT-ENGINE v1 functions
  calculateRTEngineV1,
  detectRedFlagsRTv1,
  calculateRiskIndexRTv1,
  scoreToGradeRTv1,
  interpretRTv1,
  generateRTv1Summary,
  generateRTv1Narrative,
  generateRTv1Strengths,
  generateRTv1Challenges,

  // BaZi archetype modifiers (for UI to apply)
  applyBaziModifiersToArchetype,
  extractBaziElements,
  BAZI_ELEMENT_MODIFIERS
};
