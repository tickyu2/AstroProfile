/**
 * Western-Vedic Fusion Layer Service
 *
 * Fuses Western astrology calculations with Vedic astrology to create:
 * - Composite Temperament (element + guna blending)
 * - Composite Polarity (yin/yang + vedic balance)
 * - Unified personality profile
 */

// =============================================================================
// TEMPERAMENT FUSION CONSTANTS
// =============================================================================

// Element-Guna correspondence weights
const ELEMENT_GUNA_AFFINITY = {
  'Fire_Rajas': 0.9,
  'Fire_Sattva': 0.5,
  'Fire_Tamas': 0.2,
  'Earth_Tamas': 0.8,
  'Earth_Rajas': 0.4,
  'Earth_Sattva': 0.3,
  'Air_Sattva': 0.85,
  'Air_Rajas': 0.5,
  'Air_Tamas': 0.2,
  'Water_Sattva': 0.7,
  'Water_Tamas': 0.6,
  'Water_Rajas': 0.3
};

// Element-Dosha correspondence weights
const ELEMENT_DOSHA_AFFINITY = {
  'Fire_Pitta': 0.95,
  'Fire_Vata': 0.3,
  'Fire_Kapha': 0.1,
  'Earth_Kapha': 0.9,
  'Earth_Vata': 0.2,
  'Earth_Pitta': 0.2,
  'Air_Vata': 0.95,
  'Air_Pitta': 0.3,
  'Air_Kapha': 0.1,
  'Water_Kapha': 0.7,
  'Water_Pitta': 0.5,
  'Water_Vata': 0.2
};

// Modality-Guna correspondence
const MODALITY_GUNA_AFFINITY = {
  'Cardinal_Rajas': 0.9,
  'Cardinal_Sattva': 0.4,
  'Cardinal_Tamas': 0.2,
  'Fixed_Tamas': 0.8,
  'Fixed_Sattva': 0.4,
  'Fixed_Rajas': 0.3,
  'Mutable_Sattva': 0.7,
  'Mutable_Rajas': 0.5,
  'Mutable_Tamas': 0.3
};

// Composite temperament archetypes
const TEMPERAMENT_ARCHETYPES = {
  'Fire_Rajas': {
    name: "The Warrior",
    description: "Dynamic action, passionate leadership, competitive drive",
    keywords: ["action", "passion", "leadership", "courage", "initiative"]
  },
  'Fire_Sattva': {
    name: "The Visionary",
    description: "Inspired action, spiritual leadership, enlightened will",
    keywords: ["vision", "inspiration", "purpose", "guidance", "light"]
  },
  'Fire_Tamas': {
    name: "The Smoldering Ember",
    description: "Suppressed passion, controlled intensity, hidden fire",
    keywords: ["control", "restraint", "hidden power", "patience"]
  },
  'Earth_Tamas': {
    name: "The Mountain",
    description: "Immovable stability, patient endurance, material mastery",
    keywords: ["stability", "endurance", "patience", "material", "foundation"]
  },
  'Earth_Rajas': {
    name: "The Builder",
    description: "Productive action, material creation, practical ambition",
    keywords: ["building", "creation", "ambition", "productivity", "results"]
  },
  'Earth_Sattva': {
    name: "The Gardener",
    description: "Nurturing growth, patient cultivation, harmonious manifestation",
    keywords: ["nurturing", "growth", "cultivation", "harmony", "stewardship"]
  },
  'Air_Sattva': {
    name: "The Philosopher",
    description: "Pure intellect, wisdom seeking, elevated thought",
    keywords: ["wisdom", "intellect", "clarity", "truth", "understanding"]
  },
  'Air_Rajas': {
    name: "The Communicator",
    description: "Active mind, social engagement, intellectual pursuit",
    keywords: ["communication", "networking", "learning", "debate", "exchange"]
  },
  'Air_Tamas': {
    name: "The Dreamer",
    description: "Detached thought, fantasy, mental wandering",
    keywords: ["fantasy", "detachment", "abstraction", "distance", "observation"]
  },
  'Water_Sattva': {
    name: "The Mystic",
    description: "Deep intuition, spiritual emotion, compassionate wisdom",
    keywords: ["intuition", "spirituality", "compassion", "depth", "healing"]
  },
  'Water_Tamas': {
    name: "The Depths",
    description: "Emotional inertia, deep feeling, absorbing nature",
    keywords: ["absorption", "depth", "feeling", "memory", "holding"]
  },
  'Water_Rajas': {
    name: "The Healer",
    description: "Active emotion, nurturing action, protective care",
    keywords: ["healing", "nurturing", "protection", "care", "emotion"]
  }
};

// =============================================================================
// TEMPERAMENT FUSION
// =============================================================================

/**
 * Fuse Western element/modality with Vedic guna/dosha
 */
export function fuseTemperament(westernProfile, vedicProfile) {
  // Extract Western data
  const dominantElement = westernProfile.dominantElement || "Fire";
  const dominantModality = westernProfile.dominantModality || "Cardinal";

  // Extract Vedic data
  const dominantGuna = vedicProfile.dominantGuna || "Sattva";
  const dominantDosha = vedicProfile.dominantDosha || "Vata";

  // Calculate element-guna resonance
  const egKey = `${dominantElement}_${dominantGuna}`;
  const elementGunaResonance = ELEMENT_GUNA_AFFINITY[egKey] || 0.5;

  // Calculate element-dosha resonance
  const edKey = `${dominantElement}_${dominantDosha}`;
  const elementDoshaResonance = ELEMENT_DOSHA_AFFINITY[edKey] || 0.5;

  // Calculate modality-guna resonance
  const mgKey = `${dominantModality}_${dominantGuna}`;
  const modalityGunaResonance = MODALITY_GUNA_AFFINITY[mgKey] || 0.5;

  // Combined resonance (weighted average)
  const combinedResonance = (
    elementGunaResonance * 0.4 +
    elementDoshaResonance * 0.35 +
    modalityGunaResonance * 0.25
  );

  // Determine temperament archetype
  const archetypeKey = `${dominantElement}_${dominantGuna}`;
  const archetype = TEMPERAMENT_ARCHETYPES[archetypeKey] || {
    name: "The Seeker",
    description: "Balanced blend of multiple energies",
    keywords: ["balance", "integration", "seeking", "growth"]
  };

  // Generate narrative
  let harmonyLevel, harmonyDesc;
  if (combinedResonance >= 0.75) {
    harmonyLevel = "highly harmonious";
    harmonyDesc = "Your Western and Vedic signatures resonate powerfully together.";
  } else if (combinedResonance >= 0.5) {
    harmonyLevel = "moderately aligned";
    harmonyDesc = "Your Western and Vedic signatures complement each other with some creative tension.";
  } else {
    harmonyLevel = "creatively tensioned";
    harmonyDesc = "Your Western and Vedic signatures create dynamic interplay requiring conscious integration.";
  }

  const narrative =
    `Your ${dominantElement} element nature blends with ${dominantGuna} guna energy, ` +
    `creating a ${harmonyLevel} temperament. ${harmonyDesc} ` +
    `As '${archetype.name}', you express: ${archetype.description}.`;

  return {
    westernElement: dominantElement,
    westernModality: dominantModality,
    vedicGuna: dominantGuna,
    vedicDosha: dominantDosha,
    elementGunaResonance: Math.round(elementGunaResonance * 1000) / 1000,
    elementDoshaResonance: Math.round(elementDoshaResonance * 1000) / 1000,
    modalityGunaResonance: Math.round(modalityGunaResonance * 1000) / 1000,
    combinedResonance: Math.round(combinedResonance * 1000) / 1000,
    harmonyLevel,
    archetype: archetype.name,
    archetypeDescription: archetype.description,
    archetypeKeywords: archetype.keywords,
    narrative
  };
}

// =============================================================================
// POLARITY FUSION
// =============================================================================

/**
 * Fuse Western yin/yang with Vedic balance indicators
 */
export function fusePolarity(westernProfile, vedicProfile) {
  // Western yin/yang
  const westernYinYang = westernProfile.yinYangBalance || {};
  const yinPct = westernYinYang.yinPercent || 50;
  const yangPct = westernYinYang.yangPercent || 50;

  // Vedic indicators
  const vedicGuna = vedicProfile.dominantGuna || "Sattva";
  const grahaDominance = vedicProfile.grahaDominance || {};

  // Map guna to yin/yang tendency
  const gunaPolarity = {
    Sattva: { yin: 0.5, yang: 0.5 },
    Rajas: { yin: 0.3, yang: 0.7 },
    Tamas: { yin: 0.7, yang: 0.3 }
  };

  const vedicTendency = gunaPolarity[vedicGuna] || { yin: 0.5, yang: 0.5 };

  // Graha-based adjustments
  const yangGrahas = ["Sun", "Mars", "Jupiter"];
  const yinGrahas = ["Moon", "Venus", "Saturn"];

  let grahaYangScore = 0;
  let grahaYinScore = 0;

  for (const g of yangGrahas) {
    grahaYangScore += grahaDominance[g] || 0;
  }
  for (const g of yinGrahas) {
    grahaYinScore += grahaDominance[g] || 0;
  }

  const grahaTotal = grahaYangScore + grahaYinScore || 1;
  const grahaYangPct = grahaYangScore / grahaTotal;
  const grahaYinPct = grahaYinScore / grahaTotal;

  // Fuse all polarity indicators
  const fusedYang = (
    (yangPct / 100) * 0.5 +
    vedicTendency.yang * 0.25 +
    grahaYangPct * 0.25
  );
  const fusedYin = 1 - fusedYang;

  // Determine fused dominant
  let fusedDominant;
  if (Math.abs(fusedYang - fusedYin) < 0.1) {
    fusedDominant = "balanced";
  } else if (fusedYang > fusedYin) {
    fusedDominant = "yang";
  } else {
    fusedDominant = "yin";
  }

  // Generate polarity profile
  const polarityIntensity = Math.abs(fusedYang - fusedYin);

  let polarityType, polarityDesc;
  if (polarityIntensity < 0.15) {
    polarityType = "Harmonized";
    polarityDesc = "Your energies are remarkably balanced between active and receptive modes.";
  } else if (polarityIntensity < 0.3) {
    polarityType = "Leaning";
    polarityDesc = `Your energy leans toward ${fusedDominant === 'yang' ? 'active, outward' : 'receptive, inward'} expression.`;
  } else {
    polarityType = "Pronounced";
    polarityDesc = `Your energy is strongly ${fusedDominant === 'yang' ? 'yang (active, initiating)' : 'yin (receptive, containing)'}.`;
  }

  const narrative =
    `Fusing Western yin/yang (${yinPct.toFixed(0)}%/${yangPct.toFixed(0)}%) with Vedic indicators ` +
    `(${vedicGuna} guna), your composite polarity is ${polarityType.toLowerCase()}. ` +
    polarityDesc;

  return {
    westernYin: Math.round(yinPct * 10) / 10,
    westernYang: Math.round(yangPct * 10) / 10,
    vedicGuna,
    vedicGunaPolarity: vedicTendency,
    grahaYangScore: Math.round(grahaYangPct * 1000) / 10,
    grahaYinScore: Math.round(grahaYinPct * 1000) / 10,
    fusedYin: Math.round(fusedYin * 1000) / 10,
    fusedYang: Math.round(fusedYang * 1000) / 10,
    fusedDominant,
    polarityType,
    polarityIntensity: Math.round(polarityIntensity * 1000) / 1000,
    narrative
  };
}

// =============================================================================
// COMPLETE FUSION
// =============================================================================

/**
 * Build complete Western-Vedic fusion package
 */
export function buildWesternVedicFusion(westernProfile, vedicProfile) {
  const temperament = fuseTemperament(westernProfile, vedicProfile);
  const polarity = fusePolarity(westernProfile, vedicProfile);

  // Build unified profile
  const archetype = temperament.archetype || "The Seeker";
  const polarityType = polarity.polarityType || "Harmonized";

  // Overall integration score
  const resonance = temperament.combinedResonance || 0.5;
  const intensity = polarity.polarityIntensity || 0.5;

  // Higher resonance + lower intensity = more integrated
  const integrationScore = (resonance * 0.6 + (1 - intensity) * 0.4);

  let integrationLevel, integrationDesc;
  if (integrationScore >= 0.7) {
    integrationLevel = "Highly Integrated";
    integrationDesc = "Your Western and Vedic signatures merge seamlessly.";
  } else if (integrationScore >= 0.5) {
    integrationLevel = "Moderately Integrated";
    integrationDesc = "Your signatures blend with creative complementarity.";
  } else {
    integrationLevel = "Dynamic Integration";
    integrationDesc = "Your signatures create dynamic tension inviting conscious synthesis.";
  }

  const overallNarrative =
    `As '${archetype}' with ${polarityType.toLowerCase()} polarity, your East-West synthesis is ` +
    `${integrationLevel.toLowerCase()}. ${integrationDesc} ` +
    `This fusion reveals a personality that blends ${(temperament.westernElement || 'elemental').toLowerCase()} ` +
    `drive with ${(temperament.vedicGuna || 'gunic').toLowerCase()} consciousness.`;

  return {
    temperament,
    polarity,
    integrationScore: Math.round(integrationScore * 1000) / 1000,
    integrationLevel,
    overallNarrative,
    fusionArchetype: archetype,
    fusionKeywords: temperament.archetypeKeywords || []
  };
}

// =============================================================================
// COUPLE FUSION
// =============================================================================

/**
 * Build fusion profiles for a couple and compare
 */
export function buildCoupleFusion(personAWestern, personAVedic, personBWestern, personBVedic) {
  const fusionA = buildWesternVedicFusion(personAWestern, personAVedic);
  const fusionB = buildWesternVedicFusion(personBWestern, personBVedic);

  // Compare archetypes
  const archetypeA = fusionA.fusionArchetype || "Unknown";
  const archetypeB = fusionB.fusionArchetype || "Unknown";

  // Compare polarities
  const polarityA = fusionA.polarity?.fusedDominant || "balanced";
  const polarityB = fusionB.polarity?.fusedDominant || "balanced";

  // Polarity complementarity
  let polarityDynamic, polarityDesc;
  if (polarityA !== polarityB && polarityA !== "balanced" && polarityB !== "balanced") {
    polarityDynamic = "complementary";
    polarityDesc = "Your polarities are opposite, creating magnetic attraction.";
  } else if (polarityA === polarityB) {
    polarityDynamic = "similar";
    polarityDesc = "Your polarities align, creating easy understanding.";
  } else {
    polarityDynamic = "asymmetric";
    polarityDesc = "One partner is more polarized, creating a dynamic interplay.";
  }

  // Integration comparison
  const intA = fusionA.integrationScore || 0.5;
  const intB = fusionB.integrationScore || 0.5;
  const integrationGap = Math.abs(intA - intB);

  let integrationMatch, intDesc;
  if (integrationGap < 0.15) {
    integrationMatch = "matched";
    intDesc = "Both partners have similar East-West integration levels.";
  } else if (integrationGap < 0.3) {
    integrationMatch = "complementary";
    intDesc = "Partners have different but complementary integration styles.";
  } else {
    integrationMatch = "divergent";
    intDesc = "Partners have notably different integration approaches.";
  }

  const coupleNarrative =
    `Person A embodies '${archetypeA}' while Person B embodies '${archetypeB}'. ` +
    `Their polarity dynamic is ${polarityDynamic}: ${polarityDesc} ` +
    `Their integration styles are ${integrationMatch}: ${intDesc}`;

  return {
    personA: fusionA,
    personB: fusionB,
    archetypeA,
    archetypeB,
    polarityDynamic,
    polarityDescription: polarityDesc,
    integrationMatch,
    integrationGap: Math.round(integrationGap * 1000) / 1000,
    coupleNarrative
  };
}

export default {
  fuseTemperament,
  fusePolarity,
  buildWesternVedicFusion,
  buildCoupleFusion,
  TEMPERAMENT_ARCHETYPES
};
