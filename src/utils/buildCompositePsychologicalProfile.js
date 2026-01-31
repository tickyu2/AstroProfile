/**
 * Composite Psychological Profile Orchestrator
 *
 * Based on Liz Greene's concept of the composite chart as "the third psyche" —
 * the living organism that emerges when two people create relationship.
 *
 * This orchestrator weaves together:
 * - The composite chart itself (midpoint calculations)
 * - The psychology of the relationship
 * - Its shadow and defense patterns
 * - Its mythic archetype
 * - Its fate threads
 * - Its health indicators
 * - Its growth path
 *
 * The result is a complete psychological portrait of the relationship,
 * as if it were a person with its own soul.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════════════════════════

import { buildCompositeChart } from './compositeGenerator.js';
import { buildCompositePsychology } from './compositePsychology.js';
import { buildCompositeShadow } from './compositeShadow.js';
import { buildCompositeArchetype } from './compositeArchetype.js';
import { buildCompositeFateThreads } from './compositeFateThreads.js';
import { buildCompositeHealth } from './compositeHealth.js';
import { buildCompositeGrowth } from './compositeGrowth.js';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the complete psychological profile of a composite chart
 *
 * This is the "Third Psyche" — the relationship as a living being.
 *
 * @param {Object} chartA - First person's natal chart
 * @param {Object} chartB - Second person's natal chart
 * @param {Object} options - Optional configuration
 * @returns {Object} Complete composite psychological profile
 */
export function buildCompositePsychologicalProfile(chartA, chartB, options = {}) {
  // Validate inputs
  if (!chartA || !chartB) {
    return {
      error: 'Both charts are required to build composite profile',
      profile: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 1: Generate the Composite Chart
  // ═══════════════════════════════════════════════════════════════════════

  const compositeChart = buildCompositeChart(chartA, chartB);

  if (!compositeChart || !compositeChart.planets) {
    return {
      error: 'Failed to generate composite chart',
      profile: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 2: Build All Psychological Modules
  // ═══════════════════════════════════════════════════════════════════════

  // 2a. Core Psychology
  const psychology = buildCompositePsychology(compositeChart);

  // 2b. Shadow Profile
  const shadow = buildCompositeShadow(compositeChart);

  // 2c. Archetype
  const archetype = buildCompositeArchetype(compositeChart);

  // 2d. Fate Threads
  const fateThreads = buildCompositeFateThreads(compositeChart);

  // 2e. Health Indicators
  const health = buildCompositeHealth(compositeChart);

  // 2f. Growth Path
  const growth = buildCompositeGrowth(compositeChart);

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 3: Generate Executive Summary
  // ═══════════════════════════════════════════════════════════════════════

  const executiveSummary = generateExecutiveSummary(
    compositeChart,
    psychology,
    shadow,
    archetype,
    fateThreads,
    health,
    growth
  );

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 4: Generate Relationship Portrait
  // ═══════════════════════════════════════════════════════════════════════

  const relationshipPortrait = generateRelationshipPortrait(
    psychology,
    archetype,
    shadow
  );

  // ═══════════════════════════════════════════════════════════════════════
  // STEP 5: Assemble Complete Profile
  // ═══════════════════════════════════════════════════════════════════════

  const profile = {
    // Core Data
    compositeChart: {
      planets: compositeChart.planets,
      aspects: compositeChart.aspects,
      statistics: compositeChart.statistics,
      houses: compositeChart.houses
    },

    // Executive Summary
    executiveSummary,

    // Relationship Portrait (Human-readable overview)
    relationshipPortrait,

    // Detailed Modules
    psychology,
    shadow,
    archetype,
    fateThreads,
    health,
    growth,

    // Quick Access Data
    quickAccess: {
      // Identity
      compositeSun: compositeChart.planets?.Sun?.sign,
      compositeMoon: compositeChart.planets?.Moon?.sign,
      compositeAscendant: compositeChart.planets?.Ascendant?.sign,

      // Archetype
      archetypeName: archetype?.primaryArchetype?.name,
      mythicStory: archetype?.primaryArchetype?.myth,

      // Health
      healthGrade: health?.overallGrade,
      healthScore: health?.overallScore,

      // Growth
      currentPhase: growth?.developmentalPath?.phase1?.name,
      ultimateGrowth: growth?.developmentalPath?.ultimateGrowth,

      // Fate
      destiny: fateThreads?.destiny?.destiny,
      pastKarma: fateThreads?.pastKarma?.pastPattern,

      // Shadow
      primaryFear: shadow?.saturnShadow?.fear,
      transformationNeeded: shadow?.plutoShadow?.transformation
    },

    // Metadata
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      engine: 'GENESIS Composite Psychological Profile Engine',
      basedOn: 'Liz Greene\'s "Relating" and Jungian psychological astrology',
      modulesIncluded: {
        psychology: !!psychology,
        shadow: !!shadow,
        archetype: !!archetype,
        fateThreads: !!fateThreads,
        health: !!health,
        growth: !!growth
      }
    }
  };

  return {
    error: null,
    profile
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTIVE SUMMARY GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate executive summary of the relationship
 */
function generateExecutiveSummary(chart, psychology, shadow, archetype, fateThreads, health, growth) {
  const sunSign = chart.planets?.Sun?.sign;
  const moonSign = chart.planets?.Moon?.sign;

  const summary = {
    title: archetype?.primaryArchetype?.name || 'The Relationship',
    subtitle: `${sunSign || 'Unknown'} Sun / ${moonSign || 'Unknown'} Moon Composite`,

    // One-sentence essence
    essence: archetype?.primaryArchetype?.myth?.split('.')[0] + '.' || 'A unique partnership.',

    // Core identity
    identity: psychology?.identity?.identity || 'Unknown',

    // Emotional nature
    emotionalNature: psychology?.emotions?.emotionalNature || 'Unknown',

    // Primary gift
    gift: archetype?.primaryArchetype?.gift || 'Unknown',

    // Primary challenge
    challenge: shadow?.saturnShadow?.shadow || 'Unknown',

    // Health status
    healthStatus: {
      grade: health?.overallGrade || 'N/A',
      summary: health?.overallSummary || 'Not assessed'
    },

    // Growth direction
    growthDirection: {
      current: growth?.developmentalPath?.phase1?.name || 'Unknown',
      ultimate: growth?.developmentalPath?.ultimateGrowth || 'Unknown'
    },

    // Fate summary
    fate: {
      destiny: fateThreads?.destiny?.destiny || 'Unknown',
      pastPattern: fateThreads?.pastKarma?.pastPattern || 'Unknown'
    }
  };

  return summary;
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONSHIP PORTRAIT GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate human-readable relationship portrait
 */
function generateRelationshipPortrait(psychology, archetype, shadow) {
  const paragraphs = [];

  // Opening: Archetype identification
  if (archetype?.primaryArchetype) {
    paragraphs.push({
      title: 'Who You Are Together',
      content: `${archetype.primaryArchetype.myth} ${archetype.primaryArchetype.mythicJourney || ''}`
    });
  }

  // Core Identity
  if (psychology?.identity) {
    paragraphs.push({
      title: 'Your Shared Identity',
      content: `${psychology.identity.lifeForce} ${psychology.identity.expression || ''}`
    });
  }

  // Emotional Nature
  if (psychology?.emotions) {
    paragraphs.push({
      title: 'Your Emotional Life Together',
      content: `${psychology.emotions.unconsciousPattern} ${psychology.emotions.nurturing || ''}`
    });
  }

  // How You Love
  if (psychology?.love) {
    paragraphs.push({
      title: 'How You Love',
      content: `${psychology.love.loveStyle} Affection is ${psychology.love.affection?.toLowerCase() || 'expressed uniquely'}. Harmony is ${psychology.love.harmony?.toLowerCase() || 'found in your own way'}.`
    });
  }

  // Shadow
  if (shadow?.saturnShadow) {
    paragraphs.push({
      title: 'Your Shared Shadow',
      content: `${shadow.saturnShadow.fear} ${shadow.saturnShadow.defense || ''} The path to integration: ${shadow.saturnShadow.integration || 'conscious work on this pattern'}.`
    });
  }

  // Gift
  if (archetype?.primaryArchetype?.gift) {
    paragraphs.push({
      title: 'Your Unique Gift',
      content: archetype.primaryArchetype.gift
    });
  }

  return {
    paragraphs,
    fullNarrative: paragraphs.map(p => `**${p.title}**\n${p.content}`).join('\n\n')
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quick composite analysis (returns just executive summary)
 */
export function quickCompositeAnalysis(chartA, chartB) {
  const result = buildCompositePsychologicalProfile(chartA, chartB);
  if (result.error) return result;

  return {
    error: null,
    summary: result.profile.executiveSummary,
    quickAccess: result.profile.quickAccess
  };
}

/**
 * Get composite archetype name only
 */
export function getCompositeArchetypeName(chartA, chartB) {
  const composite = buildCompositeChart(chartA, chartB);
  const archetype = buildCompositeArchetype(composite);
  return archetype?.primaryArchetype?.name || 'Unknown';
}

/**
 * Get composite health grade only
 */
export function getCompositeHealthGrade(chartA, chartB) {
  const composite = buildCompositeChart(chartA, chartB);
  const health = buildCompositeHealth(composite);
  return health?.overallGrade || 'N/A';
}

/**
 * Get relationship portrait only
 */
export function getRelationshipPortrait(chartA, chartB) {
  const result = buildCompositePsychologicalProfile(chartA, chartB);
  if (result.error) return null;
  return result.profile.relationshipPortrait;
}

/**
 * Compare two composite charts (for multiple relationship analysis)
 */
export function compareComposites(chartA, chartB1, chartB2) {
  const composite1 = buildCompositePsychologicalProfile(chartA, chartB1);
  const composite2 = buildCompositePsychologicalProfile(chartA, chartB2);

  if (composite1.error || composite2.error) {
    return {
      error: 'Failed to generate one or both composites',
      comparison: null
    };
  }

  return {
    error: null,
    comparison: {
      relationship1: {
        archetype: composite1.profile.quickAccess.archetypeName,
        health: composite1.profile.quickAccess.healthGrade,
        gift: composite1.profile.archetype?.primaryArchetype?.gift
      },
      relationship2: {
        archetype: composite2.profile.quickAccess.archetypeName,
        health: composite2.profile.quickAccess.healthGrade,
        gift: composite2.profile.archetype?.primaryArchetype?.gift
      },
      note: 'Remember: "better" composites don\'t mean better relationships. Consciousness matters more than configuration.'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildCompositePsychologicalProfile,
  quickCompositeAnalysis,
  getCompositeArchetypeName,
  getCompositeHealthGrade,
  getRelationshipPortrait,
  compareComposites
};
