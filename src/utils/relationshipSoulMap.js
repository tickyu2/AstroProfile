/**
 * Relationship Soul Map Engine
 *
 * Based on Liz Greene's concept of the "third psyche" — fusing composite
 * and synastry into a single living relational organism.
 *
 * The Relationship Soul Map is not two people + their midpoints.
 * It is a living entity with its own:
 * - Identity
 * - Emotional Body
 * - Shadow & Defense System
 * - Karmic Contract
 * - Fate Threads
 * - Crossroads
 * - Growth Path
 * - Archetype & Myth
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════════════════════════

import { buildCompositePsychologicalProfile } from './buildCompositePsychologicalProfile.js';
import { buildSynastryFateProfile } from './synastryFateEngine.js';
import { buildSaturnRelationshipDynamics } from './saturnRelationshipEngine.js';

// ═══════════════════════════════════════════════════════════════════════════
// FUSION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fuse composite and synastry data into a unified Relationship Soul Map
 *
 * @param {Object} compositeProfile - From buildCompositePsychologicalProfile
 * @param {Object} synastryProfile - From buildSynastryFateProfile
 * @param {Object} saturnDynamics - From buildSaturnRelationshipDynamics
 * @returns {Object} Relationship Soul Map
 */
function fuseRelationshipSoulMap(compositeProfile, synastryProfile, saturnDynamics) {
  const composite = compositeProfile?.profile;
  const synastry = synastryProfile;

  if (!composite || !synastry) {
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 1. IDENTITY OF THE BOND
  // ═══════════════════════════════════════════════════════════════════════

  const identity = buildBondIdentity(composite, synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 2. EMOTIONAL BODY
  // ═══════════════════════════════════════════════════════════════════════

  const emotionalBody = buildEmotionalBody(composite, synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. SHADOW & DEFENSE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════

  const shadow = buildShadowFusion(composite, synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 4. KARMIC CONTRACT
  // ═══════════════════════════════════════════════════════════════════════

  const contract = buildKarmicContract(composite, synastry, saturnDynamics);

  // ═══════════════════════════════════════════════════════════════════════
  // 5. FATE THREADS
  // ═══════════════════════════════════════════════════════════════════════

  const fateThreads = buildFusedFateThreads(composite, synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 6. CROSSROADS
  // ═══════════════════════════════════════════════════════════════════════

  const crossroads = buildFusedCrossroads(synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 7. GROWTH PATH
  // ═══════════════════════════════════════════════════════════════════════

  const growthPath = buildFusedGrowthPath(composite, synastry);

  // ═══════════════════════════════════════════════════════════════════════
  // 8. ARCHETYPE & MYTH
  // ═══════════════════════════════════════════════════════════════════════

  const archetype = buildFusedArchetype(composite, synastry);

  return {
    identity,
    emotionalBody,
    shadow,
    contract,
    fateThreads,
    crossroads,
    growthPath,
    archetype: archetype.name,
    myth: archetype.myth,

    // Full fusion narrative
    narrative: generateSoulMapNarrative({
      identity,
      emotionalBody,
      shadow,
      contract,
      fateThreads,
      crossroads,
      growthPath,
      archetype
    }),

    // Metadata
    metadata: {
      generatedAt: new Date().toISOString(),
      hasComposite: !!composite,
      hasSynastry: !!synastry,
      hasSaturnDynamics: !!saturnDynamics
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the bond's identity from composite + synastry
 */
function buildBondIdentity(composite, synastry) {
  const compositeSun = composite?.psychology?.identity;
  const synastryArchetype = synastry?.relationshipArchetype?.primary;

  const parts = [];

  if (compositeSun) {
    parts.push(`This relationship expresses itself as ${compositeSun.identity || 'a unique partnership'}.`);
    if (compositeSun.coreNeed) {
      parts.push(`Its core need: ${compositeSun.coreNeed}.`);
    }
  }

  if (synastryArchetype) {
    parts.push(`The synastry reveals ${synastryArchetype.name || 'deep connection'} dynamics.`);
  }

  return parts.join(' ') || 'Identity data unavailable.';
}

/**
 * Build the bond's emotional body from composite Moon + synastry Moon dynamics
 */
function buildEmotionalBody(composite, synastry) {
  const compositeMoon = composite?.psychology?.emotions;
  const moonProjections = synastry?.projectionLoops?.filter(p =>
    p.planet2?.toLowerCase().includes('moon')
  ) || [];

  const parts = [];

  if (compositeMoon) {
    parts.push(`Emotionally, this relationship ${compositeMoon.emotionalNature || 'has its own patterns'}.`);
    if (compositeMoon.unconsciousPattern) {
      parts.push(compositeMoon.unconsciousPattern);
    }
    if (compositeMoon.nurturing) {
      parts.push(`Nurturing happens through: ${compositeMoon.nurturing}`);
    }
  }

  if (moonProjections.length > 0) {
    const projectionText = moonProjections.map(p => p.projection || p.dynamic).join(' ');
    if (projectionText) {
      parts.push(`Emotional projections: ${projectionText}`);
    }
  }

  return parts.join(' ') || 'Emotional body data unavailable.';
}

/**
 * Build the shadow fusion from composite Saturn/Pluto + synastry shadow dynamics
 */
function buildShadowFusion(composite, synastry) {
  const compositeSaturn = composite?.shadow?.saturnShadow;
  const compositePluto = composite?.shadow?.plutoShadow;
  const synastryFateThreads = synastry?.axisInterlocks?.filter(a =>
    a.type === 'karmic_debt' || a.intensity === 'very_high'
  ) || [];

  const parts = [];

  if (compositeSaturn) {
    parts.push(`The relationship fears: ${compositeSaturn.fear || compositeSaturn.shadow || 'facing its limitations'}.`);
    if (compositeSaturn.defense) {
      parts.push(`Defense pattern: ${compositeSaturn.defense}`);
    }
  }

  if (compositePluto) {
    parts.push(`Deeper shadow: ${compositePluto.shadow || 'transformation required'}.`);
    if (compositePluto.compulsion) {
      parts.push(`Compulsive pattern: ${compositePluto.compulsion}`);
    }
  }

  if (synastryFateThreads.length > 0) {
    const karmicText = synastryFateThreads.map(t => t.meaning || t.karmicLesson).join(' ');
    if (karmicText) {
      parts.push(`Karmic entanglement: ${karmicText}`);
    }
  }

  return parts.join(' ') || 'Shadow data unavailable.';
}

/**
 * Build the karmic contract from composite + synastry + Saturn dynamics
 */
function buildKarmicContract(composite, synastry, saturnDynamics) {
  const parts = [];

  // From Saturn dynamics
  if (saturnDynamics?.partnershipContract) {
    parts.push(saturnDynamics.partnershipContract);
  }

  // From composite fate threads
  if (composite?.fateThreads?.destiny) {
    parts.push(`Destined for: ${composite.fateThreads.destiny.destiny || composite.fateThreads.destiny.calling || 'growth'}.`);
  }

  // From synastry contracts
  if (synastry?.karmicContracts?.primaryContract) {
    const contract = synastry.karmicContracts.primaryContract;
    parts.push(`Primary contract: ${contract.lesson || contract.name || 'soul growth'}.`);
  }

  return parts.join(' ') || 'Contract data unavailable.';
}

/**
 * Build fused fate threads from composite + synastry
 */
function buildFusedFateThreads(composite, synastry) {
  const threads = [];

  // Composite fate threads
  if (composite?.fateThreads) {
    const cf = composite.fateThreads;

    if (cf.destiny) {
      threads.push(`Destiny: ${cf.destiny.calling || cf.destiny.destiny || 'Unknown'}`);
    }
    if (cf.pastKarma) {
      threads.push(`Past Karma: ${cf.pastKarma.pastPattern || 'Unknown'}`);
    }
    if (cf.karmicWork) {
      threads.push(`Saturn Work: ${cf.karmicWork.work || 'Unknown'}`);
    }
    if (cf.requiredTransformation) {
      threads.push(`Pluto Transformation: ${cf.requiredTransformation.transformation || 'Unknown'}`);
    }
  }

  // Synastry fate threads
  if (synastry?.axisInterlocks) {
    synastry.axisInterlocks.slice(0, 3).forEach(a => {
      if (a.meaning) {
        threads.push(`Synastry: ${a.meaning}`);
      }
    });
  }

  return threads.length > 0 ? threads : ['No fate threads detected'];
}

/**
 * Build fused crossroads from synastry
 */
function buildFusedCrossroads(synastry) {
  const crossroads = [];

  if (synastry?.crossroads) {
    const sc = synastry.crossroads;

    // Shared active crossroads
    if (sc.sharedActiveCrossroads?.length > 0) {
      sc.sharedActiveCrossroads.forEach(c => {
        crossroads.push(`Shared: ${c.name || c.key} — ${c.lifeQuestion || c.mythicMeaning || ''}`);
      });
    }

    // Complementary crossroads
    if (sc.complementaryCrossroads?.length > 0) {
      sc.complementaryCrossroads.forEach(c => {
        crossroads.push(`Complementary: ${c.crossroadA?.name || ''} meets ${c.crossroadB?.name || ''}`);
      });
    }

    // Relationship phase
    if (sc.relationshipPhase) {
      crossroads.push(`Phase: ${sc.relationshipPhase}`);
    }
  }

  return crossroads.length > 0 ? crossroads : ['No crossroads detected'];
}

/**
 * Build fused growth path from composite + synastry
 */
function buildFusedGrowthPath(composite, synastry) {
  const growth = [];

  // Composite growth
  if (composite?.growth) {
    const cg = composite.growth;

    if (cg.developmentalPath?.ultimateGrowth) {
      growth.push(`Ultimate growth: ${cg.developmentalPath.ultimateGrowth}`);
    }

    if (cg.emotionalGrowth?.growthEdge) {
      growth.push(`Emotional edge: ${cg.emotionalGrowth.growthEdge}`);
    }

    if (cg.catalysts?.activity) {
      growth.push(`Growth catalyst: ${cg.catalysts.activity}`);
    }

    if (cg.practices) {
      cg.practices.slice(0, 2).forEach(p => {
        growth.push(`Practice: ${p.practice || p}`);
      });
    }
  }

  // Synastry influences
  if (synastry?.projectionLoops) {
    synastry.projectionLoops.slice(0, 2).forEach(p => {
      if (p.healingPath) {
        growth.push(`Healing: ${p.healingPath}`);
      }
    });
  }

  return growth.length > 0 ? growth : ['No growth path detected'];
}

/**
 * Build fused archetype from composite + synastry
 */
function buildFusedArchetype(composite, synastry) {
  const compositeArchetype = composite?.archetype?.primaryArchetype;
  const synastryArchetype = synastry?.relationshipArchetype?.primary;

  let name = 'The Unnamed Bond';
  let myth = 'A relationship seeking its story.';

  if (compositeArchetype) {
    name = compositeArchetype.name || name;
    myth = compositeArchetype.myth || myth;
  }

  if (synastryArchetype && compositeArchetype) {
    // Fuse the names
    name = `${compositeArchetype.name || 'The Bond'} with ${synastryArchetype.name || 'Karmic'} Undertones`;
    // Fuse the myths
    myth = `${compositeArchetype.myth || ''} ${synastryArchetype.description || ''}`.trim();
  } else if (synastryArchetype && !compositeArchetype) {
    name = synastryArchetype.name || name;
    myth = synastryArchetype.description || myth;
  }

  return { name, myth };
}

/**
 * Generate the complete Soul Map narrative
 */
function generateSoulMapNarrative(data) {
  return {
    opening: `This is the story of ${data.archetype.name} — a relationship with its own psychology, destiny, and path.`,
    identity: data.identity,
    emotionalBody: data.emotionalBody,
    shadow: data.shadow,
    contract: data.contract,
    fateThreads: data.fateThreads.join('\n'),
    crossroads: data.crossroads.join('\n'),
    growthPath: data.growthPath.join('\n'),
    closing: `The myth of this relationship: ${data.archetype.myth}`
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the complete Relationship Soul Map
 *
 * This is the master fusion of:
 * - Composite Psychological Profile
 * - Synastry Fate Profile
 * - Saturn Relationship Dynamics
 *
 * @param {Object} chartA - First person's natal chart
 * @param {Object} chartB - Second person's natal chart
 * @param {Array} synastryAspects - Inter-chart aspects
 * @returns {Object} Complete Relationship Soul Map
 */
export function buildRelationshipSoulMap(chartA, chartB, synastryAspects = []) {
  // 1. Build composite profile
  const compositeResult = buildCompositePsychologicalProfile(chartA, chartB);

  if (compositeResult.error) {
    return {
      error: compositeResult.error,
      soulMap: null
    };
  }

  // 2. Build synastry profile
  const synastryProfile = buildSynastryFateProfile(chartA, chartB, synastryAspects);

  // 3. Build Saturn relationship dynamics (using Person A's Saturn)
  const saturnSign = chartA?.planets?.Saturn?.sign ||
                     chartA?.planets?.saturn?.sign ||
                     extractSaturnSign(chartA);
  const saturnHouse = chartA?.planets?.Saturn?.house ||
                      chartA?.planets?.saturn?.house ||
                      extractSaturnHouse(chartA);

  let saturnDynamics = null;
  if (saturnSign && saturnHouse) {
    try {
      saturnDynamics = buildSaturnRelationshipDynamics(saturnSign, saturnHouse, []);
    } catch (e) {
      // Saturn dynamics optional
    }
  }

  // 4. Fuse everything into the Soul Map
  const soulMap = fuseRelationshipSoulMap(compositeResult, synastryProfile, saturnDynamics);

  return {
    error: null,
    soulMap,
    // Include raw data for advanced use
    rawData: {
      composite: compositeResult.profile,
      synastry: synastryProfile,
      saturnDynamics
    }
  };
}

/**
 * Helper to extract Saturn sign from various chart formats
 */
function extractSaturnSign(chart) {
  if (!chart || !chart.planets) return null;

  if (Array.isArray(chart.planets)) {
    const saturn = chart.planets.find(p =>
      (p.name || p.planet || '').toLowerCase() === 'saturn'
    );
    return saturn ? (saturn.sign || saturn.Sign) : null;
  }

  return chart.planets.Saturn?.sign || chart.planets.saturn?.sign || null;
}

/**
 * Helper to extract Saturn house from various chart formats
 */
function extractSaturnHouse(chart) {
  if (!chart || !chart.planets) return null;

  if (Array.isArray(chart.planets)) {
    const saturn = chart.planets.find(p =>
      (p.name || p.planet || '').toLowerCase() === 'saturn'
    );
    return saturn ? (saturn.house || saturn.House) : null;
  }

  return chart.planets.Saturn?.house || chart.planets.saturn?.house || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get just the relationship archetype name
 */
export function getRelationshipArchetypeName(chartA, chartB, synastryAspects) {
  const result = buildRelationshipSoulMap(chartA, chartB, synastryAspects);
  return result.soulMap?.archetype || 'Unknown';
}

/**
 * Get just the relationship myth
 */
export function getRelationshipMyth(chartA, chartB, synastryAspects) {
  const result = buildRelationshipSoulMap(chartA, chartB, synastryAspects);
  return result.soulMap?.myth || 'Unknown';
}

/**
 * Get the full narrative
 */
export function getRelationshipNarrative(chartA, chartB, synastryAspects) {
  const result = buildRelationshipSoulMap(chartA, chartB, synastryAspects);
  return result.soulMap?.narrative || null;
}

/**
 * Quick relationship summary
 */
export function quickRelationshipSummary(chartA, chartB, synastryAspects) {
  const result = buildRelationshipSoulMap(chartA, chartB, synastryAspects);
  if (!result.soulMap) return null;

  return {
    archetype: result.soulMap.archetype,
    myth: result.soulMap.myth,
    identity: result.soulMap.identity,
    contract: result.soulMap.contract,
    fateThreadCount: result.soulMap.fateThreads?.length || 0,
    crossroadsCount: result.soulMap.crossroads?.length || 0
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildRelationshipSoulMap,
  getRelationshipArchetypeName,
  getRelationshipMyth,
  getRelationshipNarrative,
  quickRelationshipSummary
};
