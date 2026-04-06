/**
 * Qi Bracelet — Functional Element Strength Page
 *
 * Uses raw Qi points (NOT percentages) through a 4-pipeline MTFQ architecture.
 * Each step is transparent and expandable for full calculation visibility.
 *
 * Created: March 2026
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import { computeQiYearMatrix, applyClashDamage, applyControlPressure } from '../utils/qiEngine';
import { calculateDaYun } from '../utils/daYunEngine';
import DaYunQiOverlay from '../components/qi/DaYunQiOverlay';
import { designBracelet, designBraceletFromBRQe, scoreBracelet, scoreAllStones, exportBraceletSchema, findSubstitutes, diagnoseCollapse, computeElementRatios, engineerBracelet, computeBraceletQiUnits } from '../data/stoneDatabase';
import { getSeasonalWeights, getSeasonInfo } from '../utils/baziSeasonality';
import { getTenGod } from '../utils/tenGodsCalculations';
import { TEN_GOD_LIBRARY } from '../utils/baziRules/libraries/tenGodLibrary';
import { computeDayMasterStrength } from '../utils/dayMasterStrength';
import {
  BaziThemeProvider,
  ModularPillarCard,
} from '../components/bazi';
import FloatingMdWindow from '../components/shared/FloatingMdWindow';
import { applyCombinationEngine, buildCombinationContext, computeVoidBranches } from '../utils/combinationEngine';
import CauseMapPanel from '../components/bazi/CauseMapPanel';
import YearInsightsPanel from '../components/bazi/YearInsightsPanel';
import MonthArchetypeBadge from '../components/bazi/MonthArchetypeBadge';
import BraceletDashboard from '../components/bazi/BraceletDashboard';
import ExtremeArchetypePanel from '../components/bazi/ExtremeArchetypePanel';
import QiVectorPlot3D from '../components/qi/QiVectorPlot3D';
import QiBalanceCube from '../components/qi/QiBalanceCube';
import { QiPipelineFlow } from '../components/qi/QiPipelineFlow';
import { EducationLevelToggle } from '../components/qi/EducationLevelToggle';
// QiDebugger removed — replaced by MIFQ Steps 4-7 pipeline
import { BraceletEvolutionTimeline } from '../components/qi/BraceletEvolutionTimeline';
import { QiPhysicsConsole } from '../components/qi/QiPhysicsConsole';
import { CollapseModeSimulator } from '../components/qi/CollapseModeSimulator';
import { QiStorybookMode } from '../components/qi/QiStorybookMode';
import { QiTimeline } from '../components/qi/QiTimeline';
import { CollapseModeHeatmap } from '../components/qi/CollapseModeHeatmap';
import { QiPlayground } from '../components/qi/QiPlayground';
import { PentagonRadar, QiBar } from '../components/qi/PentagonRadar';
import { applyClashes, applyDirectionalClashes, computeThreePassClashes, applySheng, applyOvercrowding, applyControl, applyTransformations } from '../utils/qiTransforms';
import { processNatalPipeline } from '../utils/natalPipeline';
import { detectInteractions, getYearPillar, getMonthPillars } from '../utils/braceletEngine';
import { computeIFQ, computeDmStrengthAdjustment } from '../utils/mifqEngine';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const SEASON_BG = {
  Spring: 'border-green-700 bg-green-900/20',
  Summer: 'border-red-700 bg-red-900/20',
  Autumn: 'border-amber-700 bg-amber-900/20',
  Winter: 'border-blue-700 bg-blue-900/20',
};

const SEASON_EMOJI = { Spring: '🌸', Summer: '☀️', Autumn: '🍂', Winter: '❄️' };

/** Qi Weight labels per pillar position */
const QI_WEIGHT_LABEL = {
  Year:  'Year Qi (Energy) = 10%',
  Month: 'Month Qi (Energy) = 30%',
  Day:   'Day Master Qi = 35%\nDay Branch Qi = 15%',
  Hour:  'Hour Qi (Energy) = 10%',
};

// ============================================================================
// PIPELINE EXPORT — Full MD export for study
// ============================================================================

function fmtQiRow(qi) {
  return ELEMENTS.map(el => `${el}: ${(qi[el] || 0).toFixed(3)}`).join(' | ');
}

function fmtQiPctRow(qi) {
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  if (total <= 0) return ELEMENTS.map(el => `${el}: 0.0%`).join(' | ');
  return ELEMENTS.map(el => `${el}: ${(((qi[el] || 0) / total) * 100).toFixed(1)}%`).join(' | ');
}

function generatePipelineExportMd(profile, chart, qiMatrix, userTfq, selectedYear) {
  const lines = [];
  const hr = '\n---\n';

  // ── Header ──
  lines.push(`# Qi Pipeline Export — Full Calculation Worksheet`);
  lines.push('');
  lines.push(`**Name**: ${profile.firstName || ''} ${profile.lastName || ''}`);
  lines.push(`**Birth Date**: ${profile.birthDate || 'Unknown'}`);
  lines.push(`**Birth Time**: ${profile.birthTime || '12:00 (default)'}`);
  if (profile.location?.fullAddress) lines.push(`**Location**: ${profile.location.fullAddress}`);
  lines.push(`**Analysis Year**: ${selectedYear}`);
  lines.push(`**Generated**: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
  lines.push(hr);

  // ── Four Pillars ──
  lines.push('## Four Pillars of Destiny');
  lines.push('');
  lines.push('| Pillar | Stem | Branch | Animal | Stem Element | Branch Element |');
  lines.push('|--------|------|--------|--------|-------------|---------------|');
  const pillarLabels = ['Year', 'Month', 'Day', 'Hour'];
  chart.pillars.forEach((p, i) => {
    lines.push(`| ${pillarLabels[i]} | ${p.stem?.char || '?'} | ${p.branch?.char || '?'} | ${p.branch?.animal || '?'} | ${p.stem?.element || '?'} | ${p.branch?.element || '?'} |`);
  });
  lines.push('');
  lines.push(`**Day Master**: ${chart.pillars[2]?.stem?.char || '?'} (${chart.pillars[2]?.stem?.element || '?'})`);
  lines.push(`**Day Master Polarity**: ${qiMatrix.dayMasterPolarity}`);
  lines.push(`**Day Master Element**: ${qiMatrix.dayMasterElement}`);
  lines.push(hr);

  // ── Per-Pillar Layer 1 Breakdown ──
  lines.push('## Layer 1: Per-Pillar Qi Composition');
  lines.push('');
  const bd = qiMatrix.perPillarBreakdown;
  for (const key of ['year', 'month', 'day', 'hour']) {
    const pb = bd[key];
    if (!pb) continue;
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    lines.push(`### ${label} Pillar — ${pb.stemChar} ${pb.branchChar} (${pb.stemFullEnglish}, ${pb.branchAnimal})`);
    lines.push('');
    lines.push(`- Stem ${pb.stemChar}: 1 pt -> ${pb.stemElement}`);
    lines.push(`- Branch ${pb.branchChar}: 10 pts total`);
    if (pb.hiddenStems?.length) {
      for (const hs of pb.hiddenStems) {
        lines.push(`  - ${hs.char} ${hs.element} ${(hs.pct * 100).toFixed(0)}%: ${(10 * hs.pct).toFixed(1)} pts`);
      }
    }
    lines.push('');
    lines.push(`**Raw**: ${fmtQiRow(pb.raw)}`);
    lines.push(`**Birth-Season Adjusted**: ${fmtQiRow(pb.seasoned)}`);
    if (pb.polarityAdjusted) lines.push(`**Polarity Adjusted**: ${fmtQiRow(pb.polarityAdjusted)}`);
    if (pb.qiWeighted) lines.push(`**Qi Weighted (final)**: ${fmtQiRow(pb.qiWeighted)}`);
    lines.push('');
  }
  lines.push(hr);

  // ── Natal TFQ ──
  lines.push('## Your Total Functional Qi (TFQ) — Birth Reservoir');
  lines.push('');
  if (userTfq) {
    lines.push(`| Element | Qi | % |`);
    lines.push('|---------|-----|-----|');
    const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);
    ELEMENTS.forEach(el => {
      const v = userTfq[el] || 0;
      lines.push(`| ${el} | ${v.toFixed(3)} | ${tfqTotal > 0 ? ((v / tfqTotal) * 100).toFixed(1) : '0.0'}% |`);
    });
    lines.push(`| **Total** | **${tfqTotal.toFixed(3)}** | 100% |`);
  }
  lines.push(hr);

  // ── Year Pillar ──
  lines.push(`## Year Pillar: ${qiMatrix.yearPillar.stem} ${qiMatrix.yearPillar.branch} (${qiMatrix.yearPillar.stemElement}, ${qiMatrix.yearPillar.branchAnimal})`);
  lines.push(hr);

  // ── Monthly Pipeline ──
  lines.push('## Monthly Pipeline — 12 Months');
  lines.push('');

  for (const snapshot of qiMatrix.months) {
    lines.push(`### ${snapshot.monthName} (${snapshot.season}) — ${snapshot.monthStem} ${snapshot.monthBranch} (${snapshot.branchAnimal})`);
    lines.push('');

    // Walk through all 8 steps
    for (const step of snapshot.steps) {
      lines.push(`#### ${step.label}`);
      lines.push('');
      lines.push('```');
      lines.push(step.detail);
      lines.push('```');
      lines.push('');
      lines.push(`**Qi snapshot**: ${fmtQiRow(step.qi)}`);
      lines.push(`**Total**: ${step.totalQi.toFixed(3)} pts`);
      lines.push(`**As %**: ${fmtQiPctRow(step.qi)}`);
      lines.push('');
    }

    // Interactions
    if (snapshot.interactions?.length > 0) {
      lines.push('#### Interactions (Clashes/Harms/Punishments)');
      lines.push('');
      for (const hit of snapshot.interactions) {
        lines.push(`- **${hit.type}**: ${hit.branch1} (${hit.pillar1Label}) + ${hit.branch2} (${hit.pillar2Label}) — ${hit.nature}: ${hit.effect}`);
      }
      lines.push('');
    }

    // Yong Shen
    lines.push('#### Yong Shen (Useful God)');
    lines.push('');
    lines.push(`- **Status**: ${snapshot.yongShen.status}${snapshot.yongShen.collapseMode ? ` (${snapshot.yongShen.collapseMode})` : ''}`);
    if (snapshot.yongShen.threat) lines.push(`- **Threat**: ${snapshot.yongShen.threat} at ${snapshot.yongShen.threatPercentage?.toFixed(1)}%`);
    lines.push(`- **Useful Elements**: ${snapshot.yongShen.usefulElements?.join(', ') || 'None'}`);
    if (snapshot.yongShen.forbidden?.length > 0) lines.push(`- **Forbidden**: ${snapshot.yongShen.forbidden.join(', ')}`);
    lines.push(`- **Reasoning**: ${snapshot.yongShen.reasoning}`);
    if (snapshot.yongShen.forbiddenReason) lines.push(`- **Forbidden Reason**: ${snapshot.yongShen.forbiddenReason}`);
    lines.push('');

    // Stones
    if (snapshot.recommendedStones?.length > 0) {
      lines.push('#### Recommended Stones');
      lines.push('');
      lines.push('| Stone | Element | Polarity | Reason |');
      lines.push('|-------|---------|----------|--------|');
      for (const rec of snapshot.recommendedStones) {
        lines.push(`| ${rec.stone.name} | ${rec.stone.element} | ${rec.stone.polarity} | ${rec.reason} |`);
      }
      lines.push('');
    }

    // Final Qi comparison
    lines.push('#### TFQ vs TotalQi Comparison');
    lines.push('');
    if (userTfq) {
      lines.push('| Element | Your TFQ | Month TotalQi | Delta |');
      lines.push('|---------|---------|-----------|-------|');
      const fq = snapshot.functionalQi;
      ELEMENTS.forEach(el => {
        const tfv = userTfq[el] || 0;
        const mfv = fq[el] || 0;
        const delta = mfv - tfv;
        lines.push(`| ${el} | ${tfv.toFixed(3)} | ${mfv.toFixed(3)} | ${delta >= 0 ? '+' : ''}${delta.toFixed(3)} |`);
      });
    }
    lines.push('');

    // Bracelet Design
    const dmStemChar = chart.pillars?.[2]?.stem?.char;
    if (snapshot.yongShen && dmStemChar) {
      try {
        const bracelet = designBracelet(snapshot.yongShen, dmStemChar);
        lines.push('#### Bracelet Prescription (21 beads)');
        lines.push('');
        lines.push('| Element | Ratio | Beads |');
        lines.push('|---------|-------|-------|');
        ELEMENTS.forEach(el => {
          if (bracelet.beadCounts[el] > 0) {
            lines.push(`| ${el} | ${(bracelet.ratios[el] * 100).toFixed(0)}% | ${bracelet.beadCounts[el]} |`);
          }
        });
        lines.push('');
        lines.push(`**Cluster pattern**: ${bracelet.cluster.map(s => `${s.name} (${s.chineseName || ''}, ${s.element})`).join(' -> ')}`);
        lines.push(`**Repeats**: ${bracelet.clusterCount}x`);
        lines.push(`**Wrist**: ${bracelet.wristSide} — ${bracelet.wristReason}`);
        lines.push('');
        for (const note of bracelet.notes) {
          lines.push(`- ${note}`);
        }
        lines.push('');
        if (bracelet.narrative) {
          lines.push('**Remedy Narrative**:');
          lines.push('');
          lines.push(bracelet.narrative);
          lines.push('');
        }
        // Quality Score
        const quality = scoreBracelet(bracelet, snapshot.yongShen);
        lines.push(`**Quality Score**: ${quality.overall}/100 (Grade ${quality.grade})`);
        if (quality.strengths.length > 0) {
          quality.strengths.forEach(s => lines.push(`  - ✓ ${s}`));
        }
        if (quality.warnings.length > 0) {
          quality.warnings.forEach(w => lines.push(`  - ⚠ ${w}`));
        }
        lines.push('');

      } catch { /* skip if design fails */ }
    }

    lines.push('---');
    lines.push('');
  }

  // ── Footer ──
  lines.push('## Pipeline Reference');
  lines.push('');
  lines.push('```');
  lines.push('Natal Qi (birth-season) -> Polarity -> Year Pillar -> Month Pillar -> Season');
  lines.push('-> Combined -> Void -> Combinations -> Clash (3-pass) -> Sheng -> Overcrowding');
  lines.push('-> Control -> Transform -> [Collapse Detection] -> [Yong Shen] -> Stones');
  lines.push('```');
  lines.push('');
  lines.push('*Generated by AstroProfile Qi Bracelet Engine*');

  return lines.join('\n');
}

// ============================================================================
// ARCHETYPE STORYBOOK GENERATOR — Template for every user
// ============================================================================

// Archetype definitions keyed by dominant element
const ELEMENT_ARCHETYPES = {
  Wood: [
    { name: 'The Garden', persona: 'The Greenkeeper', mood: 'Quiet optimism', tone: 'growth' },
    { name: 'The Forest', persona: 'The Pathfinder', mood: 'Expansive curiosity', tone: 'exploration' },
  ],
  Fire: [
    { name: 'The Forge', persona: 'The Smith', mood: 'Fierce determination', tone: 'transformation' },
    { name: 'The Hearth', persona: 'The Flamebearer', mood: 'Tender radiance', tone: 'warmth' },
  ],
  Earth: [
    { name: 'The Mountain', persona: 'The Sentinel', mood: 'Grounded resolve', tone: 'stability' },
    { name: 'The Valley', persona: 'The Keeper', mood: 'Nurturing patience', tone: 'nourishment' },
  ],
  Metal: [
    { name: 'The Anvil', persona: 'The Artisan', mood: 'Determined stillness', tone: 'precision' },
    { name: 'The Blade', persona: 'The Cutter', mood: 'Precise clarity', tone: 'refinement' },
  ],
  Water: [
    { name: 'The River', persona: 'The Flowkeeper', mood: 'Calm receptivity', tone: 'flow' },
    { name: 'The Deep', persona: 'The Diver', mood: 'Contemplative depth', tone: 'introspection' },
  ],
};

// Collapse-mode archetypes override the element-based ones
const COLLAPSE_ARCHETYPES = {
  'single-dominant': { name: 'The Colossus', persona: 'The Titan', mood: 'Overwhelming force' },
  'bi-polar':        { name: 'The Mirror', persona: 'The Twin', mood: 'Curious intensity' },
  'drained':         { name: 'The Desert', persona: 'The Wanderer', mood: 'Sparse clarity' },
  'inverted':        { name: 'The Crucible', persona: 'The Alchemist', mood: 'Transformative tension' },
};

// Volatility-based modifiers
const VOLATILITY_ARCHETYPES = {
  storm: { name: 'The Storm', persona: 'The Tempest Rider', mood: 'Electrified urgency' },
  loom:  { name: 'The Loom', persona: 'The Weaver', mood: 'Thoughtful coherence' },
};

// Season overlays
const SEASON_OVERLAYS = {
  Spring: {
    archetype: 'The Seed', persona: 'The Germinator',
    mood: 'Rising energy, curiosity, emotional thawing',
    amplifies: ['Wood', 'Fire'],
    lesson: 'Growth requires both warmth and disruption.',
    description: 'Spring awakens dormant potential. What was frozen begins to move. What was hidden begins to surface.',
  },
  Summer: {
    archetype: 'The Sun', persona: 'The Radiant One',
    mood: 'Intensity, visibility, emotional heat',
    amplifies: ['Fire', 'Earth'],
    lesson: 'What grows in light must also be tended with care.',
    description: 'Summer expands everything it touches. Visibility increases, shadows become stark, and passion either nourishes or burns.',
  },
  Autumn: {
    archetype: 'The Blade', persona: 'The Cutter',
    mood: 'Clarity, discipline, emotional cooling',
    amplifies: ['Metal'],
    lesson: 'To become whole, you must let go of what is no longer you.',
    description: 'Autumn refines. The excess falls away like leaves, revealing the essential structure beneath.',
  },
  Winter: {
    archetype: 'The Veil', persona: 'The Keeper of Silence',
    mood: 'Introspection, emotional depth, quiet transformation',
    amplifies: ['Water'],
    lesson: 'Stillness reveals what movement hides.',
    description: 'Winter draws inward. The world quiets, and what remains is memory, depth, and the slow work of integration.',
  },
};

// Narrative templates keyed by tone
const CHAPTER_TEMPLATES = {
  growth: [
    '{month} softens into green. {element} rises gently, coaxing {name} back into expansion. {persona} tends new shoots — ideas, relationships, possibilities.',
    '{month} unfurls with quiet power. {element} threads through every corner of the chart, and {persona} steps forward to nurture what is ready to grow.',
  ],
  exploration: [
    '{month} opens pathways not seen before. {element} illuminates hidden trails, and {persona} walks forward with curiosity as compass.',
    '{month} stretches outward. {element} builds bridges between the known and unknown, and {persona} maps new territory.',
  ],
  transformation: [
    '{month} is molten. {element} becomes absolute, reshaping identity under heat and pressure. {persona} hammers at the glowing metal of life, burning away what cannot endure.',
    '{month} ignites. {element} rises like a furnace, and {persona} works the fire with practiced hands — old patterns burn away, new courage ignites.',
  ],
  warmth: [
    '{month} warms the world. {element} glows not as a furnace but as a hearth — a place of connection and belonging. {persona} invites gathering, sharing warmth and story.',
    '{month} radiates gently. {element} becomes a lantern rather than a blaze, and {persona} draws others close with the quiet magnetism of warmth.',
  ],
  stability: [
    '{month} stands firm. {element} dominates, grounding the chart after months of movement. {persona} sits in stillness, reminding that strength is not always force — sometimes it is simply staying.',
    '{month} roots itself. {element} spreads wide and deep, and {persona} holds the center while the world moves around it.',
  ],
  nourishment: [
    '{month} offers sustenance. {element} provides the quiet nourishment that every other element draws from. {persona} feeds the soil that feeds the forest.',
    '{month} becomes a table set for the weary. {element} gives without asking, and {persona} tends the harvest with patient, steady hands.',
  ],
  precision: [
    '{month} arrives like a cold workshop at dawn. {element} demands precision, discipline, and cutting away excess. {persona} stands over the workbench, every action deliberate.',
    '{month} sharpens. {element} rises with geometric clarity, and {persona} removes every unnecessary line until only the essential remains.',
  ],
  refinement: [
    '{month} polishes. {element} strips away ornament, leaving only the blade beneath. {persona} works with silver patience, refining what was rough into something that cuts true.',
    '{month} becomes a crucible of clarity. {element} demands honesty, and {persona} asks: what can you release?',
  ],
  flow: [
    '{month} softens into current. {element} flows gently, finding the path of least resistance. {persona} guides the stream, knowing that water always arrives.',
    '{month} moves like a river after rain. {element} carries the month forward with intuitive momentum, and {persona} navigates by feeling, not force.',
  ],
  introspection: [
    '{month} goes deep. {element} descends beneath the surface, carrying awareness into hidden territories. {persona} walks the inner landscape with a lantern of memory.',
    '{month} turns inward. {element} pools in quiet depths, and {persona} listens for the voice beneath the silence.',
  ],
};

// Collapse-mode narrative templates
const COLLAPSE_TEMPLATES = {
  'single-dominant': '{month} is dominated by a single, overwhelming force. {primary} has consumed the landscape, and {persona} stands in its shadow — not fighting, but following. This is a month where resistance is futile and alignment is wisdom.',
  'bi-polar': '{month} splits into two worlds. {primary} and {secondary} pull in opposite directions, and {persona} stands at the fulcrum, reflecting both faces. This is a month of duality — every truth has its twin.',
  'drained': '{month} exposes the bones of the land. {drained} has nearly vanished, and {persona} walks the empty terrain carrying only what matters. This is a month of essential truths revealed by absence.',
  'inverted': '{month} tilts on its axis. {primary} towers over {secondary}, creating a structural imbalance that reshapes every interaction. {persona} stirs the cauldron of opposites, seeking the compound that dissolves paradox.',
};

// Storm threshold — if total delta from TFQ exceeds this %, month is a "storm"
const STORM_DELTA_THRESHOLD = 35;
// Loom threshold — if total delta is very low, month is a "loom" (integration)
const LOOM_DELTA_THRESHOLD = 8;

function selectMonthArchetype(snapshot, userTfq, collapseResult) {
  const fq = snapshot.functionalQi;
  const total = ELEMENTS.reduce((s, el) => s + (fq[el] || 0), 0);
  if (total <= 0) return { archetype: 'The Void', persona: 'The Absence', mood: 'Silence', tone: 'introspection', collapse: null, volatility: 'calm' };

  // Compute shares and dominant
  const shares = {};
  ELEMENTS.forEach(el => { shares[el] = (fq[el] || 0) / total; });
  const sorted = [...ELEMENTS].sort((a, b) => shares[b] - shares[a]);
  const dominant = sorted[0];
  const secondary = sorted[1];

  // Compute volatility (how much this month differs from TFQ)
  let totalDelta = 0;
  if (userTfq) {
    const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);
    ELEMENTS.forEach(el => {
      const tfqPct = tfqTotal > 0 ? ((userTfq[el] || 0) / tfqTotal) * 100 : 20;
      const fqPct = shares[el] * 100;
      totalDelta += Math.abs(fqPct - tfqPct);
    });
  }

  // Check for collapse override
  if (collapseResult && collapseResult.mode !== 'none') {
    const ca = COLLAPSE_ARCHETYPES[collapseResult.mode];
    return {
      ...ca,
      tone: collapseResult.mode,
      collapse: collapseResult,
      dominant, secondary,
      drained: collapseResult.mode === 'drained' ? collapseResult.primary : null,
      volatility: totalDelta > STORM_DELTA_THRESHOLD ? 'storm' : 'calm',
      shares,
    };
  }

  // Check volatility overrides
  if (totalDelta > STORM_DELTA_THRESHOLD) {
    return {
      ...VOLATILITY_ARCHETYPES.storm,
      tone: 'storm',
      collapse: null, dominant, secondary, shares,
      volatility: 'storm',
    };
  }
  if (totalDelta < LOOM_DELTA_THRESHOLD) {
    return {
      ...VOLATILITY_ARCHETYPES.loom,
      tone: 'loom',
      collapse: null, dominant, secondary, shares,
      volatility: 'loom',
    };
  }

  // Standard element-based archetype
  const variants = ELEMENT_ARCHETYPES[dominant] || ELEMENT_ARCHETYPES.Earth;
  // Pick variant based on stability: if second element is close, use variant[1] (more nuanced)
  const gap = shares[dominant] - shares[secondary];
  const variant = gap > 0.15 ? variants[0] : variants[1];

  return {
    ...variant,
    collapse: null, dominant, secondary, shares,
    volatility: 'moderate',
  };
}

function renderChapterNarrative(monthName, archResult) {
  const { name, persona, tone, collapse, dominant, secondary, drained, shares } = archResult;

  // Collapse-mode narrative
  if (collapse && collapse.mode !== 'none') {
    const tmpl = COLLAPSE_TEMPLATES[collapse.mode] || COLLAPSE_TEMPLATES['single-dominant'];
    return tmpl
      .replace(/\{month\}/g, monthName)
      .replace(/\{persona\}/g, persona)
      .replace(/\{primary\}/g, collapse.primary || dominant)
      .replace(/\{secondary\}/g, collapse.secondary || secondary || '?')
      .replace(/\{drained\}/g, drained || dominant);
  }

  // Storm/Loom special narratives
  if (tone === 'storm') {
    return `${monthName} cracks open with volatility. The elemental landscape shifts dramatically from the birth chart, and ${persona} gallops across lightning-split skies. Patterns break, truths erupt, and the month demands rapid adaptation.`;
  }
  if (tone === 'loom') {
    return `${monthName} hums with quiet integration. The elemental weather closely matches the natal chart, and ${persona} sits at the loom, weaving familiar threads into deeper pattern. This is a month of consolidation, not upheaval.`;
  }

  // Standard element narrative
  const templates = CHAPTER_TEMPLATES[tone] || CHAPTER_TEMPLATES.stability;
  const tmpl = templates[Math.floor((shares?.[dominant] || 0) * 10) % templates.length];
  return tmpl
    .replace(/\{month\}/g, monthName)
    .replace(/\{element\}/g, dominant)
    .replace(/\{name\}/g, name)
    .replace(/\{persona\}/g, persona);
}

function generateStorybookMd(profile, chart, qiMatrix, userTfq, selectedYear) {
  const lines = [];
  const hr = '\n---\n';
  const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unknown';
  const dm = chart.pillars[2]?.stem;
  const dmLabel = dm ? `${dm.char} ${dm.element}` : '?';

  // ── Title ──
  lines.push(`# ${name.toUpperCase()} - YEARLY ARCHETYPE STORYBOOK (${selectedYear})`);
  lines.push(`*A 12-Chapter Mythic Chronicle Through Elemental Transformation*`);
  lines.push('');
  lines.push(`**Day Master**: ${dmLabel} (${qiMatrix.dayMasterPolarity})`);
  lines.push(`**Birth**: ${profile.birthDate || '?'} ${profile.birthTime || ''}`);
  if (profile.location?.fullAddress) lines.push(`**Place**: ${profile.location.fullAddress}`);
  lines.push('');
  lines.push(`> *Each month is a living spirit. Each chapter is a doorway.*`);
  lines.push(`> *This storybook is generated from the full Qi pipeline — combinations, clashes, void, sheng, overcrowding, structural collapse, and Yong Shen — not from generic astrology.*`);
  lines.push(hr);

  // ── Seasonal Overlay Summary ──
  lines.push('## THE FOUR SEASONS - Atmospheric Overlay');
  lines.push('');
  for (const [season, overlay] of Object.entries(SEASON_OVERLAYS)) {
    lines.push(`### ${season} - ${overlay.archetype}`);
    lines.push(`**Persona**: ${overlay.persona}`);
    lines.push(`**Mood**: ${overlay.mood}`);
    lines.push(`**Amplifies**: ${overlay.amplifies.join(', ')}`);
    lines.push('');
    lines.push(overlay.description);
    lines.push('');
    lines.push(`*Seasonal Lesson: ${overlay.lesson}*`);
    lines.push('');
  }
  lines.push(hr);

  // ── 12 Chapters ──
  const archetypeSequence = [];

  for (let i = 0; i < qiMatrix.months.length; i++) {
    const snapshot = qiMatrix.months[i];
    const collapse = analyzeStructuralCollapse(snapshot.functionalQi);
    const arch = selectMonthArchetype(snapshot, userTfq, collapse);
    archetypeSequence.push({ ...arch, monthName: snapshot.monthName, season: snapshot.season });

    const chapterNum = i + 1;
    const fq = snapshot.functionalQi;
    const total = ELEMENTS.reduce((s, el) => s + (fq[el] || 0), 0);

    lines.push(`## CHAPTER ${chapterNum} - ${snapshot.monthName.toUpperCase()}`);
    lines.push(`**Archetype**: ${arch.name}`);
    lines.push(`**Persona**: ${arch.persona}`);
    lines.push(`**Mood**: ${arch.mood}`);
    lines.push(`**Season**: ${snapshot.season} (${SEASON_OVERLAYS[snapshot.season]?.archetype || '?'})`);
    lines.push(`**Total Qi**: ${total.toFixed(1)} pts`);
    lines.push('');

    // Narrative
    lines.push(renderChapterNarrative(snapshot.monthName, arch));
    lines.push('');

    // Element distribution
    lines.push('**Element Weather**:');
    ELEMENTS.forEach(el => {
      const pct = total > 0 ? ((fq[el] || 0) / total) * 100 : 0;
      const bar = '|'.repeat(Math.round(pct / 2));
      lines.push(`- ${el}: ${pct.toFixed(1)}% ${bar}`);
    });
    lines.push('');

    // Collapse note
    if (collapse.mode !== 'none') {
      lines.push(`**Structural Pattern**: ${collapse.mode} (${collapse.primary || '?'})`);
      if (collapse.notes?.[0]) lines.push(`> ${collapse.notes[0]}`);
      lines.push('');
    }

    // Yong Shen
    const ys = snapshot.yongShen;
    if (ys) {
      const statusLabel = ys.status === 'collapse_override' ? `Collapse Override (${ys.collapseMode})`
        : ys.status === 'critical_imbalance' ? 'Critical Imbalance'
        : 'Balanced';
      lines.push(`**Yong Shen**: ${statusLabel}`);
      lines.push(`**Useful Elements**: ${ys.usefulElements?.join(', ') || 'standard balancing'}`);
      if (ys.forbidden?.length > 0) lines.push(`**Forbidden**: ${ys.forbidden.join(', ')}`);
      lines.push('');
    }

    // Stones
    if (snapshot.recommendedStones?.length > 0) {
      lines.push('**Stones**: ' + snapshot.recommendedStones.map(s => `${s.stone.name} (${s.stone.element})`).join(', '));
      lines.push('');
    }

    // Bracelet design
    if (snapshot.yongShen && dm?.char) {
      try {
        const bracelet = designBracelet(snapshot.yongShen, dm.char);
        const activeEls = ELEMENTS.filter(el => bracelet.beadCounts[el] > 0);
        lines.push(`**Bracelet** (${bracelet.totalBeads} beads): ${activeEls.map(el => `${el} ${bracelet.beadCounts[el]}`).join(' + ')}`);
        lines.push(`**Cluster**: ${bracelet.cluster.map(s => `${s.name} (${s.chineseName || ''})`).join(' -> ')} x${bracelet.clusterCount}`);
        lines.push(`**Wrist**: ${bracelet.wristSide}`);
        lines.push('');
        if (bracelet.narrative) {
          lines.push(bracelet.narrative);
          lines.push('');
        }
        const quality = scoreBracelet(bracelet, snapshot.yongShen);
        lines.push(`**Quality**: ${quality.overall}/100 (${quality.grade})`);
        lines.push('');
      } catch { /* skip */ }
    }

    // Seasonal modulation
    const seasonOverlay = SEASON_OVERLAYS[snapshot.season];
    if (seasonOverlay) {
      const amplified = seasonOverlay.amplifies.filter(el => (arch.shares?.[el] || 0) > 0.15);
      if (amplified.length > 0) {
        lines.push(`*${snapshot.season} amplifies ${amplified.join(' and ')} this month, deepening the ${arch.name.toLowerCase()} energy.*`);
        lines.push('');
      }
    }

    // Theme and lesson
    lines.push(`**Theme**: ${getThemeForTone(arch.tone)}`);
    lines.push(`**Lesson**: ${getLessonForArchetype(arch)}`);
    lines.push(hr);
  }

  // ── Epilogue ──
  lines.push('## EPILOGUE - THE YEAR AS A WHOLE');
  lines.push('');
  lines.push(`${name}'s ${selectedYear} unfolds as a mythic cycle:`);
  lines.push('');

  // Build arc summary
  const quarters = [
    { label: 'Early year', months: archetypeSequence.slice(0, 3) },
    { label: 'Mid-year', months: archetypeSequence.slice(3, 6) },
    { label: 'Late summer', months: archetypeSequence.slice(6, 9) },
    { label: 'Year-end', months: archetypeSequence.slice(9, 12) },
  ];
  for (const q of quarters) {
    const arcNames = q.months.map(a => a.name).join(' -> ');
    lines.push(`- **${q.label}**: ${arcNames}`);
  }
  lines.push('');

  // Count dominant archetypes
  const archCounts = {};
  archetypeSequence.forEach(a => { archCounts[a.name] = (archCounts[a.name] || 0) + 1; });
  const topArch = Object.entries(archCounts).sort((a, b) => b[1] - a[1])[0];
  if (topArch && topArch[1] > 1) {
    lines.push(`The recurring presence of **${topArch[0]}** (${topArch[1]} months) reveals the year's dominant lesson: ${getLessonForArchetypeName(topArch[0])}`);
    lines.push('');
  }

  // Dominant element across year
  const yearTotals = {};
  ELEMENTS.forEach(el => { yearTotals[el] = 0; });
  qiMatrix.months.forEach(m => {
    ELEMENTS.forEach(el => { yearTotals[el] += (m.functionalQi[el] || 0); });
  });
  const yearTotal = ELEMENTS.reduce((s, el) => s + yearTotals[el], 0);
  const yearDom = [...ELEMENTS].sort((a, b) => yearTotals[b] - yearTotals[a])[0];
  lines.push(`**Year-Dominant Element**: ${yearDom} (${yearTotal > 0 ? ((yearTotals[yearDom] / yearTotal) * 100).toFixed(1) : 0}% of total annual Qi)`);
  lines.push('');

  // Collapse count
  const collapseMonths = archetypeSequence.filter(a => a.collapse && a.collapse.mode !== 'none');
  if (collapseMonths.length > 0) {
    lines.push(`**Structural Events**: ${collapseMonths.length} months with collapsed structures:`);
    collapseMonths.forEach(a => {
      lines.push(`- ${a.monthName}: ${a.collapse.mode} (${a.collapse.primary || '?'})`);
    });
    lines.push('');
  }

  // Storm count
  const stormMonths = archetypeSequence.filter(a => a.volatility === 'storm');
  if (stormMonths.length > 0) {
    lines.push(`**Volatile Months**: ${stormMonths.map(a => a.monthName).join(', ')}`);
    lines.push('');
  }

  lines.push(`> *This is a hero's journey told through Qi — a year of becoming, not just surviving.*`);
  lines.push('');
  lines.push('*Generated by AstroProfile Qi Bracelet Engine*');

  return lines.join('\n');
}

// Helper: theme for a tone
function getThemeForTone(tone) {
  const themes = {
    growth: 'Renewal, creativity, gentle expansion',
    exploration: 'Discovery, curiosity, new horizons',
    transformation: 'Purification, breakthrough, pressure-born clarity',
    warmth: 'Community, passion, emotional warmth',
    stability: 'Responsibility, endurance, grounded presence',
    nourishment: 'Sustenance, care, patient generosity',
    precision: 'Boundaries, craftsmanship, disciplined clarity',
    refinement: 'Discernment, release, truth-telling',
    flow: 'Intuition, emotional intelligence, surrender',
    introspection: 'Depth, memory, inner landscape',
    storm: 'Turbulence, rapid change, emotional electricity',
    loom: 'Integration, long-term vision, consolidation',
    'single-dominant': 'Surrender to force, alignment over resistance',
    'bi-polar': 'Duality, self-recognition, relational clarity',
    'drained': 'Simplification, inner pilgrimage, resilience',
    'inverted': 'Paradox, alchemy, integration of opposites',
  };
  return themes[tone] || 'Transformation and growth';
}

// Helper: lesson for an archetype result
function getLessonForArchetype(arch) {
  return getLessonForArchetypeName(arch.name);
}

function getLessonForArchetypeName(name) {
  const lessons = {
    'The Garden': 'Growth is slow magic.',
    'The Forest': 'Every path leads somewhere if you keep walking.',
    'The Forge': 'You do not become new without passing through fire.',
    'The Hearth': 'Warmth is a form of power.',
    'The Mountain': 'Stand where you are; let the world move around you.',
    'The Valley': 'The lowest ground receives the most water.',
    'The Anvil': 'Begin with clarity.',
    'The Blade': 'To become whole, you must let go of what is no longer you.',
    'The River': 'Move with life, not against it.',
    'The Deep': 'Stillness reveals what movement hides.',
    'The Storm': 'Chaos clears the path.',
    'The Loom': 'Vision emerges from pattern.',
    'The Colossus': 'When the wave is too strong, learn to ride it.',
    'The Mirror': 'What you see in others is what awakens in you.',
    'The Desert': 'When life becomes bare, truth becomes visible.',
    'The Crucible': 'Opposites are ingredients, not enemies.',
    'The Void': 'Absence is its own teacher.',
  };
  return lessons[name] || 'Every month is a teacher.';
}

function downloadMdFile(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadJsonFile(content, filename) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate a full 12-month bracelet JSON export with quality scores.
 */
function generateBraceletExport(profile, chart, qiMatrix, selectedYear) {
  const dm = chart.pillars?.[2]?.stem;
  if (!dm?.char) return null;

  const months = [];
  for (const snapshot of qiMatrix.months) {
    if (!snapshot.yongShen) continue;
    try {
      const bracelet = designBracelet(snapshot.yongShen, dm.char);
      const quality = scoreBracelet(bracelet, snapshot.yongShen);
      const schema = exportBraceletSchema(
        bracelet,
        snapshot.yongShen,
        quality,
        { name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(), birthDate: profile.birthDate || '' },
        dm.char,
        dm.element || '',
        snapshot.label || `Month ${snapshot.monthIndex}`,
        selectedYear,
      );
      months.push(schema);
    } catch { /* skip failed months */ }
  }

  return {
    version: '1.0',
    type: 'yearly_bracelet_prescription',
    generated: new Date().toISOString(),
    year: selectedYear,
    profileName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    monthCount: months.length,
    months,
  };
}

// ============================================================================
// POPUP CONTENT — Qi Weighting & Elements Composition
// ============================================================================

const QI_WEIGHTING_MD = `# Qi Weighting — Why It Matters

## What is Qi?

**Qi** (pronounced "chee") is your life energy — the invisible force that powers your body, emotions, and destiny. Think of it like the electricity running through a house: you can't see it, but everything depends on it.

## The 5W + H + Emotion of Qi

- **What?** — Qi is the functional strength of each element (Wood, Fire, Earth, Metal, Water) in your chart
- **Who?** — Every person has a unique Qi balance based on their birth date and time
- **When?** — Qi changes with the seasons, years, and monthly cycles
- **Where?** — Qi lives in each of the Four Pillars: Year, Month, Day, Hour
- **Why?** — Understanding your Qi helps you know what to strengthen, avoid, and balance
- **How?** — Through 4 independent pipelines (Natal→NTFQ, DaYun, Year, Month) blended into TotalQi via MTFQ weights
- **Emotion?** — Each element carries emotional energy: Wood = anger/growth, Fire = joy/anxiety, Earth = worry/stability, Metal = grief/precision, Water = fear/wisdom

## Qi Analysis vs. Elements Analysis

These are **two completely different concepts**:

| | Elements Analysis | Qi Analysis |
|---|---|---|
| **Question** | "How much of each element is present?" | "How important is each pillar's contribution?" |
| **Layer** | Layer 1 — Pillar Composition | Layer 2 — Qi Weighting |
| **Method** | Stem = 1 pt, Branch = 10 pts (same for all pillars) | DM = 35%, DB = 15%, Month = 30%, Year = 10%, Hour = 10% |
| **Used for** | Raw elemental count, birth season adjustment | Remedies, bracelets, Feng Shui, health, timing |

**Elements Analysis** (Layer 1) is pure math — it only answers "how much of each element is inside each pillar?"

**Qi Analysis** (Layer 2) answers "how important is this pillar's Qi to the person's life, health, and remedies?"

## Why the Day Pillar is 50% (35% + 15%)

The Day Pillar represents **YOU** — your core identity:

- **Day Master (Day Stem) = 35%** — This is the single most important element in your entire chart. It IS you. Your Day Master determines your constitutional type, health vulnerabilities, emotional baseline, and core personality. Every other element in your chart is measured *relative* to your Day Master.

- **Day Branch = 15%** — This is your internal reservoir, your "spouse palace" in traditional BaZi. It represents your intimate inner world, emotional depth, and the hidden energy that sustains you.

Together, the Day Pillar carries **50% of your functional Qi** — because who you ARE matters more than your environment.

## Why Day Master (35%) Must Be Separated from Day Branch (15%)

The Day Stem and Day Branch serve fundamentally different roles:

- **Day Master** = Your identity, your element, your "self." When we say someone "is" a Yang Wood person, we mean their Day Master is Yang Wood (甲).
- **Day Branch** = Your internal support system. It holds hidden stems that may support OR challenge your Day Master.

If we merged them into one 50% bucket, we'd lose the critical distinction between "who you are" and "what supports you."

## Why Month Pillar = 30%

The Month Pillar represents your **environment and season**:

- The season you were born in dramatically affects which elements are strong or weak
- Your Month Pillar is your career path, social standing, and external circumstances
- It's subject to **seasonality adjustments** — elements wax and wane with the current season and year
- 30% because your environment is the second most powerful force shaping your Qi (after your Day Master)

## Qi Weighting is Used For

- **Remedies** — Which elements to strengthen or calm
- **Bracelet prescriptions** — Stone selection based on functional Qi deficiency
- **Feng Shui** — Environmental adjustments for balance
- **Health** — Organ system vulnerabilities and constitutional support
- **Emotional patterns** — Understanding mood tendencies and triggers
- **Timing** — When certain elements peak or crash through the year
- **Danger windows** — Months where clash/harm interactions create vulnerability

---

*This layer does NOT care about stem/branch ratios. It only answers: "How much does this pillar matter?"*
`;

const GLOSSARY_MD = `# Glossary — Qi Pipeline Acronyms

All acronyms used in the Qi Bracelet calculation, in pipeline order.

---

## Layer 1 — Per-Pillar Functional Qi

| Acronym | Full Name | What It Is |
|---|---|---|
| **YFQ** | Year Functional Qi | Functional Qi from the Year pillar (weight: 10%) |
| **MFQ** | Month Functional Qi | Functional Qi from the Month pillar (weight: 30%) |
| **DM-FQ** | Day Master Functional Qi | Functional Qi from the Day Stem — your core identity (weight: 35%) |
| **DB-FQ** | Day Branch Functional Qi | Functional Qi from the Day Branch (weight: 15%) |
| **HFQ** | Hour Functional Qi | Functional Qi from the Hour pillar (weight: 10%) |

## Layer 2 — Combined Natal Qi

| Acronym | Full Name | What It Is |
|---|---|---|
| **TFQ** | Total Functional Qi | All four pillars combined with Qi weights. Your birth chart's permanent elemental fingerprint. |

---

## Monthly Pipeline — Steps 1–10

### Step 1: Current Year + Month Qi

| Acronym | Full Name | What It Is |
|---|---|---|
| **CYFQ** | Current Year Functional Qi | The current year's pillar Qi (10% of transit energy) |
| **CMFQ** | Current Month Functional Qi | The current month's pillar Qi (30% of transit energy) |
| **CYMFQ** | Combined Year + Month FQ | CYFQ + CMFQ — the total transit energy hitting you this month |

### Step 2: Weighted Blend

| Acronym | Full Name | What It Is |
|---|---|---|
| **ATFQ** | Adjusted TFQ | TFQ × 60% — your natal share of the monthly blend |
| **ACYMFQ** | Adjusted CYMFQ | CYMFQ × 40% — the transit share of the monthly blend |
| **MTFQ** | Monthly Total Functional Qi | ATFQ + ACYMFQ — the raw 60/40 mix before elemental interactions |

### Steps 3–9: Elemental Interactions

| Step | Chinese | Name | What Happens |
|---|---|---|---|
| 3 | — | Normalize | MTFQ becomes the starting pool |
| 4 | 空亡 | Void | Empty branches lose influence |
| 5 | 合化 | Combinations | Stem/branch combos may transform elements |
| 6 | 克 | Clash | Three-pass controlling cycle — elements suppress each other |
| 7 | 生 | Sheng | Generating cycle — parent feeds child |
| 8 | 耗 | Damping | Universal 2% friction loss |
| 9 | 化 | Transform | Extreme ratios trigger elemental alchemy |

### Step 10: Final Output

| Acronym | Full Name | What It Is |
|---|---|---|
| **TotalQi** | Month Final Functional Qi | The output after all interactions. This drives Yong Shen analysis and stone recommendations. |

---

## Key Relationship

\`\`\`
TFQ (birth)  ──× 60%──→  ATFQ  ─┐
                                  ├─→ MTFQ ──→ [Clash → Sheng → Damp → Transform] ──→ TotalQi
CYMFQ (transit) ─× 40%──→ ACYMFQ ─┘
\`\`\`

- **TFQ** = your car (never changes)
- **CYMFQ** = the weather (changes every month)
- **MTFQ** = your car in that weather (raw blend)
- **TotalQi** = how the car actually performs (after elemental physics)
`;

// --- GLOSSARY v2: reflects new pipeline (no 60/40, DaYun as 11pts pillar) ---
// The old GLOSSARY_MD above is kept for reference but overridden:
const GLOSSARY_MD_V2 = `# Glossary — Qi Pipeline Acronyms

All acronyms used in the Qi Bracelet calculation, in pipeline order.

---

## Layer 1 — Per-Pillar Functional Qi

Each pillar = 11 pts (stem 1 pt + branch 10 pts).

| Acronym | Full Name | What It Is |
|---|---|---|
| **YFQ** | Year Functional Qi | Functional Qi from the Year pillar (weight: 10%) |
| **MFQ** | Month Functional Qi | Functional Qi from the Month pillar (weight: 30%) |
| **DM-FQ** | Day Master Functional Qi | Functional Qi from the Day Stem (weight: 35%) |
| **DB-FQ** | Day Branch Functional Qi | Functional Qi from the Day Branch (weight: 15%) |
| **HFQ** | Hour Functional Qi | Functional Qi from the Hour pillar (weight: 10%) |

## Layer 2 — Natal TFQ (goes through full pipeline)

| Acronym | Full Name | What It Is |
|---|---|---|
| **TFQ** | Total Functional Qi | All four natal pillars combined with Qi weights. Your permanent elemental fingerprint. |
| **NTFQ** | Normalized TFQ | TFQ after the full natal pipeline (see below). The processed natal Qi vector. |

---

## Natal Pipeline (violent, internal)

Only natal Qi goes through these steps. This is the "body."

| Step | Name | What Happens |
|---|---|---|
| 1 | Seasonality | Branch elements adjusted for birth season |
| 2 | Polarity | Yin/Yang weighting |
| 3 | Combinations (合化) | Stem/branch combos may transform elements |
| 4 | Clashes (冲) | Controlling cycle — elements suppress each other |
| 5 | Harms (害) | Harm interactions between branches |
| 6 | Controls (克) | Three-pass controlling cycle |
| 7 | Overcrowding | Dominant element penalties |
| 8 | Collapse | Structural collapse detection |
| 9 | Transform (化) | Extreme ratio alchemy |
| 10 | Ten Gods | Relational analysis → Yong Shen |

Output: **NTFQ** (Normalized Total Functional Qi)

---

## External Qi Layers (gentle, no violence)

These are climate/weather — NOT anatomy.
Pipeline: stem + branch + seasonality → normalize. That's it.

| Layer | Points | What It Is |
|---|---|---|
| **Da Yun Qi** (大運) | 11 pts | Current decade luck pillar's elemental climate |
| **Year Qi** | 11 pts | Current year pillar's elemental climate |
| **Month Qi** | 11 pts | Current month pillar's elemental climate |

No clashes, combinations, harms, controls, transforms, or overcrowding.

---

## Final Output — MTFQ (Monthly Total Functional Qi)

\`\`\`
MTFQ = 1.0 x NTFQ + 0.9 x DaYun + 0.5 x Year + 0.3 x Month
\`\`\`

| Layer | Weight | Why |
|---|---|---|
| **NTFQ** (natal) | 1.0 | Your body — the dominant force |
| **Da Yun** | 0.9 | Decade tide — powerful, slow-changing |
| **Year** | 0.5 | Annual climate — moderate influence |
| **Month** | 0.3 | Monthly weather — immediate but lighter |

**MTFQ** is the final Qi field — no further clashes or processing.
It drives the bracelet design: anchor stone, controller, bead counts, Sheng cycle rotation, and forbidden elements.

---

## Key Metaphor

- **NTFQ** = your car's engine (goes through full tuning)
- **Da Yun** = the road you're on this decade
- **Year Qi** = this year's weather
- **Month Qi** = this month's micro-climate
- **TotalQi** = how the car actually performs on that road, in that weather
`;

const ELEMENTS_COMPOSITION_MD = `# Elements Composition — Layer 1

## What is Pillar Composition?

Every pillar in your chart contains a **Heavenly Stem** (the surface expression) and an **Earthly Branch** (the deep reservoir with hidden stems inside).

Layer 1 answers one simple question:

> "How many Wood/Fire/Earth/Metal/Water points does this pillar contain?"

## Why Stem = 1 part, Branch = 10 parts?

The ratio is **1:10** because:

- A **Stem** is a *surface expression* — it's visible but thin. Like the tip of an iceberg. It carries only 1 point of elemental energy.
- A **Branch** is a *deep reservoir* — it contains 1 to 3 hidden stems inside. These hidden stems carry the bulk of the elemental energy. That's why the branch gets 10 points.

So each pillar = 1 + 10 = **11 points total**.
Four pillars = 4 × 11 = **44 raw points**.

## How Hidden Stems Work

Each Earthly Branch contains hidden Heavenly Stems with specific percentage contributions. For example:

**Tiger (寅)** contains:
- Yang Wood (甲) — 60% (primary energy)
- Yang Fire (丙) — 30% (supporting energy)
- Yang Earth (戊) — 10% (residual energy)

The 10 branch points are divided according to these percentages:
- Wood gets 60% of 10 = 6 pts
- Fire gets 30% of 10 = 3 pts
- Earth gets 10% of 10 = 1 pt

## What About Birth Season?

After calculating raw points, we apply **birth season multipliers**. The season you were born in makes some elements stronger and others weaker:

- **Spring** (Tiger, Rabbit, Dragon) — Wood is strongest
- **Summer** (Snake, Horse, Goat) — Fire is strongest
- **Autumn** (Monkey, Rooster, Dog) — Metal is strongest
- **Winter** (Pig, Rat, Ox) — Water is strongest

For example, if you were born in Autumn (酉 Rooster month), Metal elements get a ×1.0 multiplier (full strength) while Wood elements might only get ×0.2 (very weak in Autumn).

## Elements Composition vs. Qi Analysis

| | Elements Composition (Layer 1) | Qi Analysis (Layer 2) |
|---|---|---|
| **Purpose** | Count raw elements | Determine functional importance |
| **All pillars equal?** | Yes — every pillar gets 11 pts | No — Day Master gets 35%, Hour only 10% |
| **Knows about Day Master?** | No | Yes — it's the anchor of the whole system |
| **Used for** | Raw elemental counting, season adjustment | Remedies, health, bracelets, Feng Shui |

**This is pure math, not Qi.** Layer 1 does NOT know anything about Qi, strength, remedies, or the Day Master. It only answers: "How much of each element is present?"

---

*Layer 1 feeds into Layer 2. You need accurate composition before you can apply Qi weights.*
`;

const FUNCTIONAL_QI_MD = `# Functional Qi — What Is It?

## Definition

**Functional Qi** is the final measure of how much each element ACTUALLY MATTERS to you. It's the result of applying **Qi Weights** to your polarity-adjusted element values.

Think of it this way: every pillar in your chart contains elements, but not every pillar matters equally. Your Day Master (who you ARE) matters far more than your Year Pillar (your ancestry).

## Qi Weight Distribution

| Pillar | Weight | Role |
|---|---|---|
| **Day Master** (Day Stem) | **35%** | This IS you — your core identity |
| **Day Branch** | **15%** | Your internal support system |
| **Month** | **30%** | Your environment, career, social standing |
| **Year** | **10%** | Ancestral energy, early life |
| **Hour** | **10%** | Inner mind, late life, children |

**Total = 100%** — every drop of Qi is accounted for.

## Why the Day Pillar Splits

The Day Pillar is unique. It must be separated into:

- **Day Master (Stem)** — This is your constitutional element. It gets its OWN pipeline through seasonality and polarity, then weighted at 35%.
- **Day Branch** — This holds your internal hidden stems. They get their OWN separate pipeline, then weighted at 15%.

**Why separate?** Because the Day Master element IS you, while the Day Branch elements SUPPORT you. Mixing them would blur the distinction between identity and support.

## The Full Pipeline

**Year / Month / Hour pillars:**
> Raw (stem=1, branch=10) → Birth Season → Polarity → **× Qi Weight** = Functional Qi

**Day Pillar (splits into two):**
> Stem raw (1pt) → Birth Season → Polarity → **× 35%** = DM Functional Qi
> Branch raw (10pts) → Birth Season → Polarity → **× 15%** = DB Functional Qi
> Day Functional Qi = DM + DB

## What Functional Qi Determines

- **Bracelet stone prescriptions** — Which elements need strengthening
- **Health vulnerabilities** — Organ system risks from deficient elements
- **Emotional patterns** — Which emotional energies dominate or are missing
- **Feng Shui** — Environmental adjustments for balance
- **Monthly timing** — When elements peak or crash through the year

---

*Functional Qi is the foundation of ALL remedies. Without accurate Functional Qi, every prescription is a guess.*
`;

const POLARITY_MD = `# Polarity Adjustment — Yang vs Yin Day Master (v2 — Strength Model)

## What is Polarity?

In BaZi, every Heavenly Stem is either **Yang** (陽) or **Yin** (陰). Your **Day Master** — the stem of your Day Pillar — determines your constitutional polarity.

- **Yang Day Masters** (甲 丙 戊 庚 壬) — outward, assertive, expansive energy
- **Yin Day Masters** (乙 丁 己 辛 癸) — inward, receptive, refined energy

## v2 Correction: Strength vs Behavior

This table uses the **strength-modulation polarity model**, not the behavioral model.

- **Yang** = baseline strength (×1.00 for all elements)
- **Yin** = slightly reduced elemental strength (Yin energy is inward, less forceful)

The old behavioral polarity table (where Yang boosted Wood/Fire/Water) has been moved to personality and relationship layers only. For TFQ (constitutional Qi strength), polarity should be **subtle** (5–20% shifts) so it doesn't overpower seasonality and rooting.

## Yang Day Master Multipliers

| Element | Multiplier | Effect |
|---|---|---|
| **Wood** | ×1.00 | Baseline — Yang is the reference point |
| **Fire** | ×1.00 | Baseline — Yang is the reference point |
| **Earth** | ×1.00 | Baseline — Yang is the reference point |
| **Metal** | ×1.00 | Baseline — Yang is the reference point |
| **Water** | ×1.00 | Baseline — Yang is the reference point |

## Yin Day Master Multipliers

| Element | Multiplier | Effect |
|---|---|---|
| **Wood** | ×0.85 | −15% — Yin dampens Wood's outward growth force |
| **Fire** | ×0.95 | −5% — Yin slightly tempers Fire's radiant expansion |
| **Earth** | ×0.90 | −10% — Yin softens Earth's structural rigidity |
| **Metal** | ×1.00 | Neutral — Yin/Yang Metal behave similarly in strength |
| **Water** | ×0.80 | −20% — Yin calms Water's forceful movement the most |

## Why Yin reduces and Yang doesn't boost

In the strength model:
- **Yang** represents the natural, full expression of each element — it's the baseline (×1.00)
- **Yin** represents the inward, refined version — slightly less forceful in raw Qi output
- This is NOT a judgment — Yin has its own strengths in personality, relationships, and adaptability
- Metal is neutral because Yin Metal (辛, refined jewel) and Yang Metal (庚, axe) have equal structural strength

## How Polarity is Applied

Polarity multipliers are applied **after** rooting and birth-season adjustment, **before** Qi weighting:

> Polarity Adjusted = Rooted & Seasoned Qi × Polarity Multiplier

Pipeline order:
1. **Layer 1**: Count raw elements (stem=1, branch=10)
2. **Rooting**: Multiply by element rooting influence (×1.00–1.30)
3. **Birth Season**: Multiply by seasonal expressiveness (×0.60–1.20)
4. **Polarity**: Multiply by Day Master's polarity modifier ← **this step**
5. **Qi Weights**: Apply importance weights (DM 35%, DB 15%, etc.)

---

*v2: strength-modulation model. Yang = baseline ×1.00. Yin = subtle reduction (5–20%). Behavioral polarity moved to personality layers.*
`;

const DAY_MASTER_POLARITY_GUIDE_MD = `# 🌗 Day Master Polarity — The Complete Guide
### How Yin & Yang shape your bracelet's stones, Qi, and design

Your **Day Master (DM)** — the Heavenly Stem of your Day Pillar — carries a polarity:

- **Yang (☀)** — active, outward, forceful
- **Yin (☽)** — receptive, inward, adaptive

This polarity is one of the deepest signatures in your BaZi chart.
It influences how you interact with the world — and how the world interacts with you.

But here's the key:

> **Your bracelet does NOT match your polarity. It balances it.**

This is the classical principle of **陰陽調和 — Yin–Yang Harmonization**.

- Yang DM → Yin stones
- Yin DM → Yang stones
- Yin‑Yang stones (☯) are universally supportive

This balancing polarity flows through **every stage** of the bracelet‑design engine.

---

## 🧭 1. Polarity Basics

### Why Yin balances Yang, and Yang balances Yin

In BaZi:

- **Yang** is expansive, bright, forceful
- **Yin** is soft, cooling, regulating

If you are **Yang**, adding more Yang makes you rigid or overheated.
If you are **Yin**, adding more Yin makes you stagnant or overly soft.

So the remedy is always:

> **Balance, not amplification.**

Your bracelet uses stones whose polarity counterbalances your Day Master, creating stability and smooth Qi flow.

---

## 🔮 2. How Polarity Affects Stone Qi (QiUnit)

Every stone has:

- Base Qi (0–1)
- Seasonal modifier (旺相休囚死)
- Polarity fit

Your polarity affects the **polarityFit** multiplier:

| Stone Polarity | Effect on Yang DM | Effect on Yin DM |
|---|---|---|
| Balancing polarity | +25% Qi | +25% Qi |
| Yin‑Yang (☯) | +10% Qi | +10% Qi |
| Matching polarity | +5% Qi | +5% Qi |

---

## 🪬 3. Stone Selection (pickStones)

### The engine always tries balancing polarity first

**Pass 1:** Pick stones whose polarity balances your DM (or Yin–Yang stones).

**Pass 2:** If none exist for that element, open to any polarity.

This ensures the remedy is always gentle, stabilizing, and aligned with classical BaZi.

---

## 🧮 4. Stone Scoring (Quality Score System)

### Polarity contributes up to 20 points

Each stone is scored out of 100:

- **+20** → balancing polarity
- **+10** → Yin–Yang
- **+5** → matching polarity

This pushes balancing‑polarity stones to the top of the ranking.

---

## 🔁 5. Substitute Ranking (findSubstitutes)

### When swapping stones, polarity still matters

Within the same element:

- Balancing polarity → no penalty
- Yin–Yang → no penalty
- Matching polarity → −10 penalty

This ensures substitutes never accidentally flip the bracelet's polarity signature.

---

## 🔢 6. Bead Count Split

### Odd numbers always favor the balancing polarity

If the engine needs 3 Water beads:

- **Yang DM** → 2 Yin Water + 1 Yang Water
- **Yin DM** → 2 Yang Water + 1 Yin Water

The extra bead always goes to the **balancing polarity**, not the matching one.

---

## ⚔️ 7. Controller Stone Logic (正克 — Proper Control)

### Even control must follow Yin–Yang harmony

When the month requires a controller element (e.g., Water controls Fire):

> Controller stones must match your **balancing polarity**, not your DM polarity.

This ensures the control is clean, gentle, and stable — not harsh or overwhelming.

---

## 🔄 8. Bracelet‑Level Polarity Score (0–20)

### Your bracelet's Yin–Yang harmony, measured

Each bead contributes:

- **1.0** → balancing polarity
- **0.6** → Yin–Yang
- **0.3** → matching polarity

The final score is scaled to **0–20**. A perfect score means every bead supports your Yin–Yang balance.

---

## 🌕 Summary — The Entire Polarity Pipeline

\`\`\`
Day Master Polarity (Yin/Yang)
            ↓
getBalancingPolarity()
            ↓
pickStones() — Pass 1 prefers balancing polarity
            ↓
QiUnit = baseQi × season × polarityFit
            ↓
scoreAllStones() — balancing polarity = +20 pts
            ↓
findSubstitutes() — matching polarity gets penalty
            ↓
beadSplit() — extra bead → balancing polarity
            ↓
controllerStones() — controller must match balancing polarity
            ↓
braceletPolarityScore() — 0–20
\`\`\`

> Everything flows from one principle:
> **Your bracelet balances your Day Master, not amplifies it.**
> Yin softens Yang. Yang activates Yin.
> This is the heart of BaZi.
`;

const ROOTING_MD = `# Element Rooting — Branch Support for Elemental Qi

## What is Rooting?

In BaZi, **rooting** is the foundation of real Qi. An element that appears in a stem is "visible" but may be floating — without roots in any branch, it lacks staying power.

Rooting determines:
- Whether an element has **real support** in the chart
- How **deep and stable** that support is
- How much of the element's Qi is **actually usable**

Think of it like a tree: the stem is the trunk above ground, but the branches' hidden stems are the root system underground. A tree without roots falls in the first wind.

## Rooting Pillar Weights (Stage 2 — same as Day Master Strength)

Each branch contributes differently to rooting based on its position in the chart:

| Pillar | Branch | Rooting Weight | Why |
|---|---|---|---|
| **Month** | Birth month | **1.2** | Strongest root — seasonal environment shapes all Qi |
| **Day** | Day branch | **1.0** | Standard — your personal foundation |
| **Year** | Year branch | **0.7** | Ancestral background — weaker but present |
| **Hour** | Hour branch | **0.7** | Inner layer — subtle, personal |

These weights are the **same weights used in the Day Master Strength gauntlet (Stage 2)**. They are separate from TFQ pillar weights (10/30/35/15/10).

## How Rooting is Computed (Stage 2 Logic)

For each of the 5 elements, we scan all 4 branches:

\`\`\`
Root Points(element) = Σ (pillar_root_weight × seasonal_factor)
\`\`\`

For each branch:
- Check if the element appears in the branch's hidden stems
- If yes: contribution = **pillar rooting weight × seasonal factor** (for that element in the birth month)
- If no: contribution = 0

The **seasonal factor** means elements that are in-season root more strongly, while out-of-season elements root weakly even if present.

### Root Points → Tier → Multiplier

Root points are converted to **tiers** (same as DM Strength Stage 2):

| Total Points | Tier | Multiplier | Meaning |
|---|---|---|---|
| < 0.5 | No root | **×0.7** | Element is floating — weakened by 30% |
| 0.5 – 1.5 | Light root | **×1.0** | Some support — baseline strength |
| 1.5 – 2.5 | Solid root | **×1.3** | Well-supported — 30% boost |
| ≥ 2.5 | Deep root | **×1.6** | Deeply anchored — 60% boost |

**Key insight**: An element with NO root is **penalized** (×0.7), not just left unchanged. This reflects classical BaZi: a floating element is weaker than a rooted one.

## Example: Eileen Gu (己 Yin Earth)

Let's trace **Wood** rooting across her 4 branches (birth month 申 Monkey, Wood seasonal factor = 0.60):

| Pillar | Branch | Wood Present? | Pillar Weight | Season Factor | Contribution |
|---|---|---|---|---|---|
| Year | 未 Goat | **乙 Yes** | 0.7 | 0.60 | 0.7 × 0.60 = 0.42 |
| Month | 申 Monkey | No | 1.2 | — | 0 |
| Day | 卯 Rabbit | **乙 Yes** | 1.0 | 0.60 | 1.0 × 0.60 = 0.60 |
| Hour | 巳 Snake | No | 0.7 | — | 0 |

**Wood root points = 0.42 + 0 + 0.60 + 0 = 1.02**
**Wood tier = Light root (0.5–1.5) → ×1.0**

Wood has light rooting — enough to maintain baseline strength but not enough for a boost.

## Where Rooting Fits in the Pipeline

\`\`\`
Raw Qi (stem + branch hidden stems)
  → Rooting (×1.00 to ×1.30 per element)     ← THIS STEP
  → Seasonality (×0.60 to ×1.20 per element)
  → Polarity (×0.80 to ×1.00 per element)
  → Qi Weighting (10/30/35/15/10)
  → TFQ (Total Functional Qi)
\`\`\`

Rooting is applied BEFORE seasonality because rooting represents the **structural foundation** of Qi — it determines how much Qi is really there before the season modifies its expression.

---

*Rooting is the invisible foundation. Without it, elements float. With it, they have staying power.*
`;

const SEASONALITY_MATRIX_MD = `# Seasonality Matrix — Element Expressiveness (v2)

## Why Seasonality Matters

In BaZi, the **season you were born in** changes how strongly each element expresses itself. An element that is "present" in your chart may be dampened if out of season, or amplified if in season.

## Design Principles (v2 Correction)

1. **No element is crushed** — minimum multiplier is ×0.60 (~40% reduction). The old matrix went as low as ×0.2 (80% reduction), which was too harsh.
2. **Peak elements are amplified** — seasonal rulers get ×1.20 (a 20% boost, not just 1.0).
3. **Earth-transition months are individualized** — 辰, 未, 戌, 丑 each have unique multipliers reflecting their storage branch composition.

## Seasonal Strength Levels

| Level | Multiplier | Meaning |
|---|---|---|
| 旺 Amplified | ×1.20 | Element at peak power — boosted by season |
| 相 Strong | ×0.90 | Generated by dominant element — healthy |
| 休 Moderate | ×0.80 | Supportive role — present but not dominant |
| 囚 Dampened | ×0.70 | Slightly weakened — constrained by season |
| 死 Suppressed | ×0.60 | At its weakest — but still ~60% expressed |

## The Full 12-Month Seasonal Matrix

| Month | Branch | Season | Wood | Fire | Earth | Metal | Water |
|---|---|---|---|---|---|---|---|
| Feb | 寅 Tiger | Early Spring | **1.20** | 0.90 | 0.80 | 0.60 | 0.70 |
| Mar | 卯 Rabbit | Mid Spring | **1.20** | 0.90 | 0.80 | 0.60 | 0.70 |
| Apr | 辰 Dragon | Late Spring (Wood→Fire) | 1.00 | **1.10** | 1.00 | 0.70 | 0.70 |
| May | 巳 Snake | Early Summer | 0.80 | **1.20** | 0.90 | 0.70 | 0.60 |
| Jun | 午 Horse | Mid Summer | 0.80 | **1.20** | 0.90 | 0.70 | 0.60 |
| Jul | 未 Goat | Late Summer (Fire→Metal) | 0.70 | 1.00 | **1.20** | 0.90 | 0.70 |
| Aug | 申 Monkey | Early Autumn | 0.60 | 0.70 | 0.90 | **1.20** | 0.80 |
| Sep | 酉 Rooster | Mid Autumn | 0.60 | 0.70 | 0.90 | **1.20** | 0.80 |
| Oct | 戌 Dog | Late Autumn (Metal→Water) | 0.70 | 0.70 | **1.20** | 1.00 | 0.90 |
| Nov | 亥 Pig | Early Winter | 0.80 | 0.60 | 0.80 | 0.80 | **1.20** |
| Dec | 子 Rat | Mid Winter | 0.80 | 0.60 | 0.80 | 0.80 | **1.20** |
| Jan | 丑 Ox | Late Winter (Water→Wood) | 0.90 | 0.70 | **1.20** | 0.80 | 1.00 |

## Earth-Transition Month Logic

Each Earth-transition month has a unique elemental storage that prepares the next season:

| Branch | Month | Stores | Prepares | Key Feature |
|---|---|---|---|---|
| 辰 Dragon | Apr | Wood | Fire | Wood still resonant (1.00), Fire rising (1.10) |
| 未 Goat | Jul | Fire | Metal | Fire fading (1.00), Earth peaks (1.20), Metal rising (0.90) |
| 戌 Dog | Oct | Metal | Water | Metal still resonant (1.00), Water rising (0.90) |
| 丑 Ox | Jan | Water | Wood | Water still resonant (1.00), Wood rising (0.90) |

## How to Read the Table

1. **Find your birth month branch** (e.g., 酉 Rooster = September = Mid Autumn)
2. **Read across the row** to see each element's multiplier
3. **Multiply** your raw element points by the multiplier

### Example: Born in Mid Autumn (酉 Rooster)

- **Metal ×1.20** — Metal is amplified. It's Metal's peak season!
- **Water ×0.80** — Water is moderate. Metal generates Water.
- **Earth ×0.90** — Earth is strong. Earth generates Metal.
- **Fire ×0.70** — Fire is dampened. Fire controls Metal but is constrained.
- **Wood ×0.60** — Wood is suppressed. Metal controls Wood — but still retains 60%.

So if your Year Pillar has 6 raw Wood points, after seasonality: 6 × 0.60 = **3.6 pts** — a 40% reduction (not 80% as in the old matrix).

## The Producing Cycle Logic

The multipliers follow the **Producing Cycle** (生剋循環):

- The **seasonal element** gets ×1.20 (amplified peak)
- The element it **produces** gets ×0.80–0.90 (strong child)
- The element that **produces it** gets ×0.80–0.90 (supportive parent)
- The element it **controls** gets ×0.70 (dampened)
- The element that **controls it** gets ×0.60 (suppressed but not destroyed)

---

*v2 correction: max attenuation ~40% (was ~80%). Earth-transition months individualized. Applied to EVERY pillar's raw points before any Qi weighting.*
`;

// ============================================================================
// ADJUSTMENT EXPLANATION MD — user-facing educational content for each phase
// ============================================================================

const CLASH_EXPLANATION_MD = `# Clash Adjustment (克) — The Controlling Cycle

In the Five Elements system, each element naturally **controls** another. This is the system's way of preventing any one element from becoming too dominant.

## The Five Controlling Relationships

- **Metal chops Wood** — axe fells the tree
- **Water quenches Fire** — water douses flame
- **Fire melts Metal** — furnace smelts ore
- **Wood penetrates Earth** — roots break soil
- **Earth dams Water** — levee blocks the river

## Three-Pass Clash System

Clashes are not applied as one blanket pass. The engine separates them into three distinct phenomena:

### Pass A — Natal Internal Tensions
Your own elements fighting each other — structural friction that has always been there.
- Victim loses **10%** of the attacker's strength
- Attacker loses **2%** (effort cost)

### Pass B — Transit Internal Clashes
The Year and Month pillars fighting each other — weather turbulence, independent of you. Same rates as Pass A.

### Pass C — Transit → Natal Directional Pressure
The environment pressing on **you**. Transit elements attack your natal elements they control.
- Natal victim loses **10%** of the transit attacker's strength
- Transit attacker is **NOT reduced** — the weather doesn't lose energy

## When Does a Clash Trigger?

A clash fires when:
- The **attacker** element is stronger than the **victim**
- The attacker has **non-zero Qi**

## The Car Metaphor

**Pass A** = Your car's own quirks (engine runs hot, radiator is small)
**Pass B** = The weather fighting itself (thunderstorm with hail)
**Pass C** = The weather hitting your car (hailstones denting your hood)
`;


const PIPELINE_OVERVIEW_MD = `# Monthly Qi Adjustment Pipeline

Your Month Final Functional Qi (TotalQi) is created through a sequence of elemental adjustments. Each step models a different kind of energetic interaction.

## The Full Pipeline

| Step | Cycle | What Happens |
|---|---|---|
| Step 6 | 克 Clash | Three-pass controlling cycle — tension & suppression |
| Step 7 | 生 Sheng | Generating cycle — parent feeds child |
| Step 8 | 耗 Damping | Universal 2% friction |
| Step 9 | 化 Transform | Extreme ratio alchemy — victim changes form |
| Step 10 | — TotalQi | Final output → Yong Shen + Stone Rx |

## The Order Matters

1. **Clashes settle first** — destructive tensions resolve
2. **Sheng rebuilds** — supportive nourishment on post-clash landscape
3. **Damping applies** — universal friction grounds the result
4. **Transformation fires last** — only if extreme imbalance persists after all else

## The Car Metaphor

- Your natal Qi = the **car** (60%, never changes)
- Monthly transit = the **road** (40%, changes every month)
- Clashes = **potholes and gremlins**
- Sheng = **tailwinds and roses**
- Damping = **tire wear and fuel burn**
- Transformation = **major repairs**
- TotalQi = your **driving conditions** for the month
`;

const BEGINNER_EXPLANATION_MD = `# Understanding Your Monthly Qi

Think of your Qi like a **garden** you carry with you.

Your natal Qi is the type of soil, the climate you were born into, and the plants that naturally grow. Each month brings **new weather** — sunshine, rain, wind, storms.

## The Six Adjustments

### 1. Void — Sleeping Branches
Two branches in your chart are "asleep" based on your birthday. They contribute less energy and can't fully participate in interactions.

### 2. Combinations — When Elements Join Forces
Certain stems and branches naturally pair up or form groups. When the season supports them, they **transform into a new element**. This can completely change your energy landscape.

### 3. Clash — When Elements Fight
Some elements naturally oppose each other. When a strong element meets a weak one it controls, the weak one loses energy. This is like **strong wind knocking over a young plant**.

### 4. Nourishment — When Elements Help
Some elements naturally feed each other. A strong "parent" element gives a small boost to its "child." This is like **sunshine helping flowers bloom**.

### 5. Friction — The Cost of Living
Every element loses a tiny 2% each month, just from existing. Like your **phone battery slowly draining** even when you're not using it.

### 6. Transformation — Rare, Big Shifts
Very rarely, one element is SO much stronger (more than 3x) that the weaker one **changes form**. Like ice melting into water.

## Your Monthly Qi Result

After these six steps, you get your **Month Final Qi** — telling you which elements are strong, which need support, and which stones/crystals help.

**The bracelet doesn't change who you are. It helps you navigate the month more smoothly.**
`;

const INTERMEDIATE_EXPLANATION_MD = `# Monthly Qi Adjustments — Intermediate Level

Your monthly Qi starts as a **60/40 blend**: 60% natal (the car) + 40% current year/month (the weather). This blend then passes through the full professional pipeline.

## Step 5a: Void (空亡)
Two branches are "void" based on your Day Pillar. Void branches contribute ~12% less Qi and cannot fully participate in combinations or clashes.

## Step 5b: Combinations (合化)
Before clashes fire, the engine checks for stem combinations (天干合), branch six combinations (六合), Three Harmony (三合局), and Three Meetings (三会局). If the season supports the result, the combination transforms Qi. Protected branches soften incoming clashes.

## Step 6: Clash Adjustment (克) — Three-Pass System

The controlling cycle fires when attacker > victim:
- **Pass A**: Your natal elements fight each other (internal tensions)
- **Pass B**: Transit elements fight each other (weather turbulence)
- **Pass C**: Transit attacks your natal elements (weather hits the car — one-directional, transit NOT reduced)

| Effect | Rate |
|--------|------|
| Victim | -10% of attacker's Qi |
| Attacker (Pass A/B only) | -2% of its own Qi |

Recombination: Pass C natal result + Pass B transit result = Post-Clash NTFQ.

## Step 7: Sheng Nourishment (生)

After clashes settle, the generating cycle rebuilds. A strong parent feeds its child:
- Boost = Parent x 3%, capped at Child x 20%
- Parent is NOT reduced — gentle feeding, not sacrifice

## Step 8: Universal Damping (耗)

All elements x 0.98. Natural friction — the cost of maintaining elemental balance. Small but universal.

## Step 9: Transformation (化)

Under extreme conditions (attacker > 1.5 pts AND ratio > 3:1):
- 30% of victim transmutes into its productive-cycle child element
- Fires last — only if extreme imbalance persists after all other adjustments

## Step 10: TotalQi → Yong Shen → Stone Rx

The final output determines your weakest element (Yong Shen) and recommends balancing stones.

## Pipeline Order (and Why)

空亡 Void → 合化 Combos → 克 Clash → 生 Sheng → 溢 Overcrowding → 耗 Damping → 化 Transform

Void weakens first. Combinations bond/transform next (and can suppress clashes). Destructive forces settle. Supportive forces rebuild. Overflow corrects peaks. Friction grounds. Transformation fires only as a last resort.
`;

const ADVANCED_EXPLANATION_MD = `# Monthly Qi Adjustment — Advanced BaZi

This section uses classical Five Element theory with explicit reference to 克, 生, 耗, and 化 dynamics.

## Three-Pass Clash System (三關克)

Classical BaZi distinguishes internal chart tensions from external cycle pressures:

| Pass | Input | Classical Parallel |
|---|---|---|
| Pass A (本命內克) | ATFQ — natal × 60% | 相克 within natal chart |
| Pass B (運歲內克) | ACYMFQ — transit × 40% | 流年/流月 internal clashes |
| Pass C (運克命) | Transit → Natal | 運克命 — cycle presses chart |

**Pass C is unidirectional** — the person cannot alter the cosmic cycle (運), only respond to it. Transit attacker is NOT consumed.

## Sheng Cycle (生)

Operates on post-clash landscape. rawBoost = Parent × 3%, capped at Child × 20%. Parent is NOT reduced — 生 is supportive, not extractive.

## Universal Damping (耗)

All elements × 0.98. Models the cost of maintaining elemental presence. Even 旺 (prosperous) elements expend energy to maintain dominance.

## Transformation (化)

Trigger: Attacker > 1.5 AND ratio > 3:1. 30% of victim transmutes to its productive-cycle child (金生水, 木生火, etc.). Fires last because it should only trigger if extreme imbalance persists after 克 → 生 → 耗.

## Void / Emptiness (空亡)

Day Pillar determines two void branches via the Jiazi 六旬 decade system. Void branches: Qi reduced ~12%, cannot combine (六合/三合/三会 blocked), clashes softened.

## Combinations (合化) — Classical Five-Layer Stack

| Layer | Chinese | Trigger | Effect |
|-------|---------|---------|--------|
| Stem Combo | 天干合 | 2 stems pair (5 classical pairs) | Transform if season supports |
| Six Combo | 六合 | 2 branches pair (6 classical pairs) | Transform + clash suppression |
| Three Harmony | 三合局 | 2-3 of triad present | Surge to result element |
| Three Meetings | 三会局 | All 3 seasonal branches | Massive elemental dominance |

Season support: result element must match current month's season element. Earth is supported during transitional months (辰未戌丑).

合能解冲 — Active combinations suppress clashes on participating branches. This is fundamental to professional chart reading.
`;

// ============================================================================
// PentagonRadar and QiBar are imported from ../components/qi/PentagonRadar

// ============================================================================
// PILLAR WITH FLAP — per-pillar card + expandable baby-step calculation
// ============================================================================

const PILLAR_LABELS = ['Year', 'Month', 'Day', 'Hour'];
const PILLAR_SUFFIX = { Year: 'Y', Month: 'M', Day: 'D', Hour: 'H' };

/** Colored element name span */
function ElSpan({ el, children }) {
  return <span style={{ color: ELEM_COLORS[el] }}>{children || el}</span>;
}

/** Separator line */
function Sep() {
  return <div className="border-t border-white/10 my-2" />;
}

/**
 * Baby-step Khan-Academy-style calculation breakdown for one pillar.
 * Shows every single step so a 5th grader can follow.
 */
/** Seasonal strength level name */
const SEASONAL_LEVEL = {
  1.0: { name: '旺 Prosperous', desc: 'at peak power' },
  0.8: { name: '相 Phase', desc: 'strong — generated by seasonal element' },
  0.6: { name: '休 Resting', desc: 'moderate — supportive role' },
  0.4: { name: '囚 Imprisoned', desc: 'weakened — constrained by season' },
  0.2: { name: '死 Dead', desc: 'nearly dormant — controlled by season' },
};

function getSeasonalLevel(mult) {
  const closest = [1.0, 0.8, 0.6, 0.4, 0.2].reduce((prev, curr) =>
    Math.abs(curr - mult) < Math.abs(prev - mult) ? curr : prev
  );
  return SEASONAL_LEVEL[closest] || { name: '', desc: '' };
}

function BabyStepCalc({ breakdown, label, birthMonthBranch, dayMasterPolarity, dayMasterElement }) {
  const S = PILLAR_SUFFIX[label];
  const isDay = label === 'Day';
  const { stemChar, stemElement: sEl, stemFullEnglish, branchChar, branchAnimal, hiddenStems, raw, seasoned, polarityAdjusted, qiWeighted } = breakdown;

  // Build stem element count: which elements are 0, which is 1
  const stemCounts = {};
  ELEMENTS.forEach(el => { stemCounts[el] = el === sEl ? 1 : 0; });

  // Build branch element count + pts
  const branchCounts = {};
  const branchPts = {};
  ELEMENTS.forEach(el => { branchCounts[el] = 0; branchPts[el] = 0; });
  hiddenStems.forEach(hs => {
    branchCounts[hs.element] += 1;
    branchPts[hs.element] += hs.pts;
  });

  // Stem pts per element (only the one that has count=1 gets 1 pt)
  const stemPts = {};
  ELEMENTS.forEach(el => { stemPts[el] = stemCounts[el] * 1; });

  // Seasonal weights for birth month
  const sw = birthMonthBranch ? getSeasonalWeights(birthMonthBranch) : null;
  const seasonInfo = birthMonthBranch ? getSeasonInfo(birthMonthBranch) : null;

  // Polarity multipliers lookup
  const pMults = dayMasterPolarity === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : dayMasterPolarity === 'Yin'
      ? { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 }
      : null;

  // Qi weight percentage for non-Day pillars
  const qiWeightPct = { Year: 10, Month: 30, Hour: 10 }[label] || null;

  // Day pillar: compute separate DM and DB pipelines locally
  let dmRaw, dbRaw, dmSeasoned, dbSeasoned, dmPolAdj, dbPolAdj, dmQi, dbQi;
  if (isDay && sw && pMults) {
    dmRaw = {}; dbRaw = {};
    dmSeasoned = {}; dbSeasoned = {};
    dmPolAdj = {}; dbPolAdj = {};
    dmQi = {}; dbQi = {};
    ELEMENTS.forEach(el => {
      dmRaw[el] = el === sEl ? 1 : 0;
      dbRaw[el] = raw[el] - dmRaw[el];
      const sMult = sw[el.toLowerCase()] ?? 1.0;
      dmSeasoned[el] = dmRaw[el] * sMult;
      dbSeasoned[el] = dbRaw[el] * sMult;
      dmPolAdj[el] = dmSeasoned[el] * pMults[el];
      dbPolAdj[el] = dbSeasoned[el] * pMults[el];
      dmQi[el] = dmPolAdj[el] * 0.35;
      dbQi[el] = dbPolAdj[el] * 0.15;
    });
  }

  return (
    <div className="text-xs font-mono leading-relaxed space-y-1 text-gray-300">
      {/* === Intro: pillar budget === */}
      <div className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-1">
        {label} Pillar Point Budget
      </div>
      <div>
        {label} Pillar pts = {label} Stem pts + {label} Branch pts
      </div>
      <div className="text-gray-500">
        {label} Stem pts = <span className="text-white">1 pts</span>
      </div>
      <div className="text-gray-500">
        {label} Branch pts = <span className="text-white">10 pts</span>
      </div>
      <div>
        {label} Pillar pts = 1 pts + 10 pts = <span className="text-white font-semibold">11 pts</span>
      </div>

      <div className="text-gray-500 mt-1">
        (S) = Element from Stem &nbsp;|&nbsp; (B) = Elements from Branch
      </div>

      <Sep />

      {/* === A. Stem Element Count === */}
      <div className="text-gray-400 font-semibold">A. {label} Stem Element Count:</div>
      {ELEMENTS.map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> (S)</span>
          {' = '}
          <span className="text-white">{stemCounts[el]}</span>
          {stemCounts[el] > 0 && (
            <span className="text-gray-500"> ({stemFullEnglish})</span>
          )}
        </div>
      ))}

      <div className="mt-1 text-gray-400 font-semibold">{label} Stem Element pts:</div>
      {ELEMENTS.filter(el => stemCounts[el] > 0).map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> (S)</span>
          {' = '}
          {stemCounts[el]} × 1 pts/stem = <span className="text-white">{stemPts[el]} pts</span>
        </div>
      ))}

      <Sep />

      {/* === B. Branch Element Count === */}
      <div className="text-gray-400 font-semibold">B. {label} Branch Element Count:</div>
      <div className="text-gray-500 mb-1">
        {branchChar} {branchAnimal} consists of {hiddenStems.length} Hidden Element{hiddenStems.length !== 1 ? 's' : ''}
        {' '}with the following percentage contribution:
      </div>
      {hiddenStems.map((hs, i) => (
        <div key={i}>
          <ElSpan el={hs.element}>{hs.fullEnglish}</ElSpan>
          <span className="text-white"> {hs.pct}%</span>
        </div>
      ))}

      <div className="mt-1 text-gray-500">
        Total Branch pts = 10 pts divided by {hiddenStems.map(hs => `${hs.pct}%`).join(', ')} ratios
      </div>

      {/* Branch element count per element */}
      <div className="mt-1">
        {ELEMENTS.map(el => (
          <div key={el}>
            <ElSpan el={el}>{el}</ElSpan>
            <span className="text-gray-500"> (B)</span>
            {' = '}
            <span className="text-white">{branchCounts[el]}</span>
            {branchCounts[el] > 0 && (
              <span className="text-gray-500">
                {' '}({hiddenStems.filter(hs => hs.element === el).map(hs => hs.fullEnglish).join(', ')})
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Branch pts distribution */}
      <div className="mt-1 text-gray-400 font-semibold">{label} Branch Element pts:</div>
      {hiddenStems.map((hs, i) => (
        <div key={i}>
          <ElSpan el={hs.element}>{hs.element}</ElSpan>
          <span className="text-gray-500"> (B)</span>
          {' = '}
          {branchCounts[hs.element] > 0 ? '1' : '0'} × ({hs.pct}% of 10 pts) = <span className="text-white">{hs.pts.toFixed(3)} pts</span>
        </div>
      ))}

      <Sep />

      {/* === Raw Totals: (Y)/(M)/(D)/(H) === */}
      <div className="text-gray-400 font-semibold">
        ({S}) = {label.toUpperCase()} PILLAR Element Total (Raw)
      </div>

      {/* Formula lines */}
      {ELEMENTS.map(el => (
        <div key={el} className="text-gray-500">
          <ElSpan el={el}>{el}</ElSpan>
          {` (${S}) = ${el} (S) + ${el} (B)`}
        </div>
      ))}

      <div className="mt-1" />

      {/* Calculated totals */}
      {ELEMENTS.map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> ({S})</span>
          {' = '}
          {stemPts[el]} pts + {branchPts[el].toFixed(3)} pts
          {' = '}
          <span className="text-white font-semibold">{raw[el].toFixed(3)} pts</span>
        </div>
      ))}

      {/* === C. Seasonality Adjustment (non-Day) === */}
      {!isDay && sw && seasonInfo && (
        <>
          <Sep />

          <div className="text-gray-400 font-semibold">
            C. Birth Season Adjustment ({S}SA)
          </div>
          <div className="text-gray-500 mb-1">
            Born in month of {birthMonthBranch} — {seasonInfo.emoji} {seasonInfo.name}
          </div>
          <div className="text-gray-500 mb-2">
            Each element's raw pts are multiplied by the seasonal expressiveness factor:
          </div>

          {/* Seasonal multiplier table for this birth month */}
          <div className="rounded border border-white/10 overflow-hidden mb-2">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">×</th>
                  <th className="px-2 py-1 text-left text-gray-400">Level</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const mult = sw[el.toLowerCase()] ?? 1.0;
                  const level = getSeasonalLevel(mult);
                  return (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-2 py-0.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-0.5 text-right text-white">{mult.toFixed(1)}</td>
                      <td className="px-2 py-0.5 text-gray-500">{level.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Per-element calculation */}
          <div className="text-gray-400 font-semibold">
            {label.toUpperCase()} PILLAR Seasonality Adjusted ({S}SA):
          </div>
          {ELEMENTS.map(el => {
            const mult = sw[el.toLowerCase()] ?? 1.0;
            const rawPts = raw[el];
            const adjPts = seasoned[el];
            const reduction = rawPts > 0 ? Math.round((1 - mult) * 100) : 0;
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}SA)</span>
                {' = '}
                <span className="text-gray-400">{rawPts.toFixed(3)} pts</span>
                {' × '}
                <span className="text-gray-400">{mult.toFixed(1)}</span>
                {' = '}
                <span className="text-white font-semibold">{adjPts.toFixed(3)}</span>
                {rawPts > 0 && mult < 1.0 && (
                  <span className="text-red-400/70 ml-1">({reduction}% reduction)</span>
                )}
                {rawPts > 0 && mult >= 1.0 && (
                  <span className="text-green-400/70 ml-1">(full strength)</span>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* === D. Polarity Adjustment (non-Day) === */}
      {!isDay && polarityAdjusted && dayMasterPolarity && dayMasterElement && (
        <>
          <Sep />

          <div className="text-gray-400 font-semibold">
            D. Polarity Adjustment ({S}PSA)
          </div>
          <div className="text-gray-500 mb-1">
            Day Master = <span className="text-white">{dayMasterPolarity} <ElSpan el={dayMasterElement}>{dayMasterElement}</ElSpan></span>
            {' → using '}
            <span className="text-purple-300">{dayMasterPolarity}</span> multipliers
          </div>

          {/* Polarity multiplier table */}
          <div className="rounded border border-white/10 overflow-hidden mb-2">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">×</th>
                  <th className="px-2 py-1 text-left text-gray-400">Effect</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const pMult = dayMasterPolarity === 'Yang'
                    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }[el]
                    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 }[el];
                  const pctChange = Math.round((pMult - 1) * 100);
                  return (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-2 py-0.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-0.5 text-right text-white">{pMult.toFixed(2)}</td>
                      <td className="px-2 py-0.5 text-gray-500">
                        {pctChange > 0 && <span className="text-green-400/70">+{pctChange}% amplified</span>}
                        {pctChange < 0 && <span className="text-red-400/70">{pctChange}% reduced</span>}
                        {pctChange === 0 && <span>neutral</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Per-element polarity calculation */}
          <div className="text-gray-400 font-semibold">
            {label.toUpperCase()} PILLAR Polarity + Seasonality Adjusted ({S}PSA):
          </div>
          {ELEMENTS.map(el => {
            const pMult = dayMasterPolarity === 'Yang'
              ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }[el]
              : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 }[el];
            const seasonedPts = seasoned[el];
            const polPts = polarityAdjusted[el];
            const pctChange = Math.round((pMult - 1) * 100);
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}PSA)</span>
                {' = '}
                <span className="text-gray-400">{seasonedPts.toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{pMult.toFixed(2)}</span>
                {' = '}
                <span className="text-white font-semibold">{polPts.toFixed(3)}</span>
                {seasonedPts > 0 && pctChange > 0 && (
                  <span className="text-green-400/70 ml-1">(+{pctChange}%)</span>
                )}
                {seasonedPts > 0 && pctChange < 0 && (
                  <span className="text-red-400/70 ml-1">({pctChange}%)</span>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* === E. Qi Weighting (non-Day) === */}
      {!isDay && qiWeightPct && polarityAdjusted && (
        <>
          <Sep />
          <div className="text-gray-400 font-semibold">
            E. Functional Qi — {label.toUpperCase()} PILLAR ({S}FQ)
          </div>
          <div className="text-gray-500 mb-1">
            {label} Functional Qi = each element's Polarity Adjusted value × {qiWeightPct}%
          </div>
          {ELEMENTS.map(el => {
            const polPts = polarityAdjusted[el];
            const fqPts = polPts * (qiWeightPct / 100);
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}FQ)</span>
                {' = '}
                <span className="text-gray-400">{polPts.toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{qiWeightPct}%</span>
                {' = '}
                <span className="text-white font-semibold">{fqPts.toFixed(3)}</span>
              </div>
            );
          })}
        </>
      )}

      {/* === Day Pillar: Separate DM/DB Pipelines === */}
      {isDay && dmRaw && sw && seasonInfo && pMults && (
        <>
          {/* ═══ DAY MASTER PIPELINE ═══ */}
          <Sep />
          <div className="text-amber-400 font-bold text-[11px] tracking-wide py-1 border-b border-amber-400/30 mb-1">
            DAY MASTER PIPELINE (Stem = 1pt, Qi Weight = 35%)
          </div>
          <div className="text-gray-500 mb-1">
            Day Master: <span className="text-white">{stemFullEnglish} ({stemChar})</span> — <ElSpan el={sEl}>{sEl}</ElSpan> element only
          </div>

          {/* DM Raw */}
          <div className="text-gray-400 font-semibold mt-1">Day Master Raw (DM):</div>
          {ELEMENTS.map(el => (
            <div key={el}>
              <ElSpan el={el}>{el}</ElSpan>
              <span className="text-gray-500"> (DM)</span>
              {' = '}
              <span className="text-white">{dmRaw[el].toFixed(3)} pts</span>
              {el === sEl && <span className="text-gray-500"> (Day Master element)</span>}
            </div>
          ))}

          {/* DM Season */}
          <div className="text-gray-400 font-semibold mt-2">C. Day Master Season Adjusted (DM-SA):</div>
          <div className="text-gray-500 mb-1">
            Born in month of {birthMonthBranch} — {seasonInfo.emoji} {seasonInfo.name}
          </div>
          {ELEMENTS.map(el => {
            const mult = sw[el.toLowerCase()] ?? 1.0;
            const reduction = dmRaw[el] > 0 ? Math.round((1 - mult) * 100) : 0;
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (DM-SA)</span>
                {' = '}
                <span className="text-gray-400">{dmRaw[el].toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{mult.toFixed(1)}</span>
                {' = '}
                <span className="text-white">{dmSeasoned[el].toFixed(3)}</span>
                {dmRaw[el] > 0 && mult < 1.0 && (
                  <span className="text-red-400/70 ml-1">({reduction}% reduction)</span>
                )}
                {dmRaw[el] > 0 && mult >= 1.0 && (
                  <span className="text-green-400/70 ml-1">(full strength)</span>
                )}
              </div>
            );
          })}

          {/* DM Polarity */}
          <div className="text-gray-400 font-semibold mt-2">D. Day Master Polarity Adjusted (DM-PSA):</div>
          <div className="text-gray-500 mb-1">
            {dayMasterPolarity} multipliers applied
          </div>
          {ELEMENTS.map(el => {
            const pctChange = Math.round((pMults[el] - 1) * 100);
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (DM-PSA)</span>
                {' = '}
                <span className="text-gray-400">{dmSeasoned[el].toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{pMults[el].toFixed(2)}</span>
                {' = '}
                <span className="text-white">{dmPolAdj[el].toFixed(3)}</span>
                {dmSeasoned[el] > 0 && pctChange > 0 && (
                  <span className="text-green-400/70 ml-1">(+{pctChange}%)</span>
                )}
                {dmSeasoned[el] > 0 && pctChange < 0 && (
                  <span className="text-red-400/70 ml-1">({pctChange}%)</span>
                )}
              </div>
            );
          })}

          {/* DM Qi Weight */}
          <div className="text-gray-400 font-semibold mt-2">E. Day Master Functional Qi (DM-FQ) × 35%:</div>
          {ELEMENTS.map(el => (
            <div key={el}>
              <ElSpan el={el}>{el}</ElSpan>
              <span className="text-gray-500"> (DM-FQ)</span>
              {' = '}
              <span className="text-gray-400">{dmPolAdj[el].toFixed(3)}</span>
              {' × '}
              <span className="text-gray-400">35%</span>
              {' = '}
              <span className="text-white font-semibold">{dmQi[el].toFixed(3)}</span>
            </div>
          ))}

          {/* ═══ DAY BRANCH PIPELINE ═══ */}
          <Sep />
          <div className="text-cyan-400 font-bold text-[11px] tracking-wide py-1 border-b border-cyan-400/30 mb-1">
            DAY BRANCH PIPELINE (Branch = 10pts, Qi Weight = 15%)
          </div>
          <div className="text-gray-500 mb-1">
            Day Branch: <span className="text-white">{branchChar} {branchAnimal}</span>
          </div>

          {/* DB Raw */}
          <div className="text-gray-400 font-semibold mt-1">Day Branch Raw (DB):</div>
          {ELEMENTS.map(el => (
            <div key={el}>
              <ElSpan el={el}>{el}</ElSpan>
              <span className="text-gray-500"> (DB)</span>
              {' = '}
              <span className="text-white">{dbRaw[el].toFixed(3)} pts</span>
              {dbRaw[el] > 0 && (
                <span className="text-gray-500">
                  {' '}({hiddenStems.filter(hs => hs.element === el).map(hs => `${hs.fullEnglish} ${hs.pct}%`).join(', ')})
                </span>
              )}
            </div>
          ))}

          {/* DB Season */}
          <div className="text-gray-400 font-semibold mt-2">C. Day Branch Season Adjusted (DB-SA):</div>
          {ELEMENTS.map(el => {
            const mult = sw[el.toLowerCase()] ?? 1.0;
            const reduction = dbRaw[el] > 0 ? Math.round((1 - mult) * 100) : 0;
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (DB-SA)</span>
                {' = '}
                <span className="text-gray-400">{dbRaw[el].toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{mult.toFixed(1)}</span>
                {' = '}
                <span className="text-white">{dbSeasoned[el].toFixed(3)}</span>
                {dbRaw[el] > 0 && mult < 1.0 && (
                  <span className="text-red-400/70 ml-1">({reduction}% reduction)</span>
                )}
                {dbRaw[el] > 0 && mult >= 1.0 && (
                  <span className="text-green-400/70 ml-1">(full strength)</span>
                )}
              </div>
            );
          })}

          {/* DB Polarity */}
          <div className="text-gray-400 font-semibold mt-2">D. Day Branch Polarity Adjusted (DB-PSA):</div>
          {ELEMENTS.map(el => {
            const pctChange = Math.round((pMults[el] - 1) * 100);
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (DB-PSA)</span>
                {' = '}
                <span className="text-gray-400">{dbSeasoned[el].toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{pMults[el].toFixed(2)}</span>
                {' = '}
                <span className="text-white">{dbPolAdj[el].toFixed(3)}</span>
                {dbSeasoned[el] > 0 && pctChange > 0 && (
                  <span className="text-green-400/70 ml-1">(+{pctChange}%)</span>
                )}
                {dbSeasoned[el] > 0 && pctChange < 0 && (
                  <span className="text-red-400/70 ml-1">({pctChange}%)</span>
                )}
              </div>
            );
          })}

          {/* DB Qi Weight */}
          <div className="text-gray-400 font-semibold mt-2">E. Day Branch Functional Qi (DB-FQ) × 15%:</div>
          {ELEMENTS.map(el => (
            <div key={el}>
              <ElSpan el={el}>{el}</ElSpan>
              <span className="text-gray-500"> (DB-FQ)</span>
              {' = '}
              <span className="text-gray-400">{dbPolAdj[el].toFixed(3)}</span>
              {' × '}
              <span className="text-gray-400">15%</span>
              {' = '}
              <span className="text-white font-semibold">{dbQi[el].toFixed(3)}</span>
            </div>
          ))}

          {/* ═══ COMBINED DAY FUNCTIONAL QI ═══ */}
          <Sep />
          <div className="text-gray-300 font-bold text-[11px] tracking-wide py-1 border-b border-white/20 mb-1">
            COMBINED DAY FUNCTIONAL QI (DFQ)
          </div>
          {ELEMENTS.map(el => {
            const combined = dmQi[el] + dbQi[el];
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (DFQ)</span>
                {' = DM '}
                <span className="text-amber-400/80">{dmQi[el].toFixed(3)}</span>
                {' + DB '}
                <span className="text-cyan-400/80">{dbQi[el].toFixed(3)}</span>
                {' = '}
                <span className="text-white font-semibold">{combined.toFixed(3)}</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function PillarWithFlap({ pillar, breakdown, label, isYou, expanded, onToggle, birthMonthBranch, dayMasterPolarity, dayMasterElement }) {
  if (!pillar || !breakdown) return null;

  const [showPolarityGuide, setShowPolarityGuide] = React.useState(false);
  const [showSummaryPopup, setShowSummaryPopup] = React.useState(false);

  const total = ELEMENTS.reduce((s, k) => s + breakdown.raw[k], 0);

  // Build pillar summary markdown for popup
  const qiPct = label === 'Day' ? 50 : label === 'Month' ? 30 : 10;
  const summaryLines = [
    `# ${label} Pillar Summary`,
    '',
    '| | |',
    '|:---|---:|',
    `| ${label} Qi Energy | **${qiPct} %** |`,
    `| ${label} Stem (S) | **1 pts** |`,
    `| ${label} Branch (B) | **10 pts** |`,
    `| **${label} Pillar Total** | **11 pts** |`,
  ];
  if (isYou) {
    summaryLines.push('', '---', '',
      '| | |',
      '|:---|---:|',
      '| Day Master Qi | **35 %** |',
      '| Day Branch Qi | **15 %** |',
    );
  }
  const summaryMd = summaryLines.join('\n');

  return (
    <div className="flex flex-col h-full">
      {/* Polarity Guide floating window — Day Pillar only */}
      {isYou && showPolarityGuide && (
        <FloatingMdWindow
          content={DAY_MASTER_POLARITY_GUIDE_MD}
          title="🌗 Day Master Polarity — Complete Guide"
          onClose={() => setShowPolarityGuide(false)}
          width={660}
        />
      )}

      {/* Pillar Summary popup — triggered by clicking yellow header */}
      {showSummaryPopup && (
        <FloatingMdWindow
          content={summaryMd}
          title={`${label} Pillar — Qi Budget`}
          onClose={() => setShowSummaryPopup(false)}
          width={380}
        />
      )}

      {/* Pillar Card — Qi weights in header, header click opens summary popup */}
      <ModularPillarCard
        label={label}
        pillar={pillar}
        isYou={isYou}
        compact
        showHiddenRoots
        onHeaderClick={() => setShowSummaryPopup(v => !v)}
        metaOverride={{
          weight: label === 'Day' ? 'Qi Energy=50%' : `Qi Energy=${label === 'Month' ? '30' : '10'}%`,
          subtitle: label === 'Day'
            ? 'Day Master 35% + Day Branch 15%'
            : label === 'Month'
              ? 'Season, environment, element strength'
              : label === 'Year'
                ? 'Ancestral Qi, early life'
                : 'Inner mind, late life',
        }}
      />

      {/* Day Master Polarity Guide button — Day Pillar only */}
      {isYou && (
        <button
          onClick={() => setShowPolarityGuide(v => !v)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 transition-colors text-xs font-medium text-amber-300"
        >
          🌗 Day Master Polarity Guide
        </button>
      )}

      {/* Toggle button — mt-auto pushes to bottom so all pillars align */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 mt-auto pt-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
      >
        <span className="text-xs font-medium text-gray-300">
          Layer 1 Calculation
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">
            11 pts
          </span>
          <span className="text-gray-500 text-xs">{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {/* Expandable baby-step calculation flap */}
      {expanded && (
        <div className="mt-1 p-3 rounded-lg bg-slate-900/80 border border-white/10 space-y-3 max-h-[32rem] overflow-y-auto">
          <BabyStepCalc breakdown={breakdown} label={label} birthMonthBranch={birthMonthBranch} dayMasterPolarity={dayMasterPolarity} dayMasterElement={dayMasterElement} />

          {/* Visual Qi bar summaries — shared maxPts so bars are proportional across all stages */}
          {(() => {
            const allDists = [breakdown.raw, breakdown.seasoned, breakdown.polarityAdjusted, breakdown.qiWeighted].filter(Boolean);
            const sharedMax = Math.max(...allDists.flatMap(d => ELEMENTS.map(el => d[el] || 0)), 1);
            return (
              <>
                <Sep />
                <div className="text-xs font-semibold text-gray-300 mb-1">Raw Element Distribution</div>
                <QiBar qi={breakdown.raw} maxPts={sharedMax} />
                <div className="text-xs font-semibold text-gray-300 mb-1 mt-2">Season-Adjusted Distribution</div>
                <QiBar qi={breakdown.seasoned} maxPts={sharedMax} />
                {breakdown.polarityAdjusted && (
                  <>
                    <div className="text-xs font-semibold text-gray-300 mb-1 mt-2">Polarity + Season Adjusted Distribution</div>
                    <QiBar qi={breakdown.polarityAdjusted} maxPts={sharedMax} />
                  </>
                )}
                {breakdown.qiWeighted && (
                  <>
                    <div className="text-xs font-semibold text-amber-300 mb-1 mt-2">Functional Qi (Qi-Weighted)</div>
                    <QiBar qi={breakdown.qiWeighted} maxPts={sharedMax} />
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TOTAL FUNCTIONAL QI — cross-pillar summary
// ============================================================================

function FunctionalQiSummary({ perPillarBreakdown, dayMasterElement, dayMasterPolarity, birthMonthBranch }) {
  if (!perPillarBreakdown) return null;

  const sw = birthMonthBranch ? getSeasonalWeights(birthMonthBranch) : null;
  if (!sw) return null;

  const pMults = dayMasterPolarity === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };

  // Compute per-column FQ values
  const yearFq = perPillarBreakdown.year.qiWeighted || {};
  const monthFq = perPillarBreakdown.month.qiWeighted || {};
  const hourFq = perPillarBreakdown.hour.qiWeighted || {};

  // Day pillar: compute DM and DB separately
  const dayBd = perPillarBreakdown.day;
  const dmFq = {};
  const dbFq = {};
  ELEMENTS.forEach(el => {
    const dmRaw = el === dayMasterElement ? 1 : 0;
    const dbRaw = (dayBd.raw[el] || 0) - dmRaw;
    const sMult = sw[el.toLowerCase()] ?? 1.0;
    dmFq[el] = dmRaw * sMult * pMults[el] * 0.35;
    dbFq[el] = dbRaw * sMult * pMults[el] * 0.15;
  });

  // Totals per element
  const totalFq = {};
  let grandTotal = 0;
  ELEMENTS.forEach(el => {
    totalFq[el] = (yearFq[el] || 0) + (monthFq[el] || 0) + dmFq[el] + dbFq[el] + (hourFq[el] || 0);
    grandTotal += totalFq[el];
  });

  const columns = [
    { label: 'YEAR', suffix: 'YFQ', data: yearFq, weight: '10%' },
    { label: 'MONTH', suffix: 'MFQ', data: monthFq, weight: '30%' },
    { label: 'DAY MASTER', suffix: 'DM-FQ', data: dmFq, weight: '35%', color: 'text-amber-400' },
    { label: 'DAY BRANCH', suffix: 'DB-FQ', data: dbFq, weight: '15%', color: 'text-cyan-400' },
    { label: 'HOUR', suffix: 'HFQ', data: hourFq, weight: '10%' },
  ];

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <h3 className="text-sm font-bold text-white">Total Functional Qi (TFQ) — All Pillars Combined</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Qi Weights: Year 10% | Month 30% | Day Master 35% | Day Branch 15% | Hour 10% = 100%
        </p>
      </div>

      {/* Wide table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left text-gray-400 w-16">Element</th>
              {columns.map(col => (
                <th key={col.suffix} className={`px-2 py-2 text-right ${col.color || 'text-gray-400'}`}>
                  <div>{col.label}</div>
                  <div className="text-[9px] font-normal opacity-70">({col.suffix}) {col.weight}</div>
                </th>
              ))}
              <th className="px-3 py-2 text-right text-white border-l border-white/10">
                <div>TOTAL</div>
                <div className="text-[9px] font-normal text-gray-400">(TFQ)</div>
              </th>
              <th className="px-2 py-2 text-right text-gray-400">%</th>
            </tr>
          </thead>
          <tbody>
            {ELEMENTS.map(el => {
              const pct = grandTotal > 0 ? (totalFq[el] / grandTotal) * 100 : 0;
              return (
                <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-3 py-1.5">
                    <ElSpan el={el}>{el}</ElSpan>
                  </td>
                  {columns.map(col => (
                    <td key={col.suffix} className="px-2 py-1.5 text-right text-gray-300">
                      {(col.data[el] || 0).toFixed(3)}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-right text-white font-semibold border-l border-white/10">
                    {totalFq[el].toFixed(3)}
                  </td>
                  <td className="px-2 py-1.5 text-right" style={{ color: ELEM_COLORS[el] }}>
                    {pct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
            {/* Grand total row */}
            <tr className="border-t border-white/20 bg-white/5">
              <td className="px-3 py-2 text-gray-400 font-semibold">Total</td>
              {columns.map(col => {
                const colTotal = ELEMENTS.reduce((s, el) => s + (col.data[el] || 0), 0);
                return (
                  <td key={col.suffix} className="px-2 py-2 text-right text-gray-400">
                    {colTotal.toFixed(3)}
                  </td>
                );
              })}
              <td className="px-3 py-2 text-right text-white font-bold border-l border-white/10">
                {grandTotal.toFixed(3)}
              </td>
              <td className="px-2 py-2 text-right text-white font-semibold">
                100.0%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Formula breakdown below table */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02]">
        <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
          {ELEMENTS.map(el => {
            const vals = columns.map(c => (c.data[el] || 0).toFixed(3));
            const pct = grandTotal > 0 ? ((totalFq[el] / grandTotal) * 100).toFixed(1) : '0.0';
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (TFQ) = </span>
                {vals.join(' + ')}
                <span className="text-gray-500"> = </span>
                <span className="text-white font-semibold">{totalFq[el].toFixed(3)}</span>
                <span className="ml-2" style={{ color: ELEM_COLORS[el] }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QiBar for total */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="text-xs font-semibold text-amber-300 mb-2">Total Functional Qi Distribution</div>
        <QiBar qi={totalFq} showPct />
      </div>
    </div>
  );
}

// ============================================================================
// INCOMING PILLAR BABY-STEP CALC — Year/Month pillar per month
// ============================================================================

function IncomingBabyStepCalc({ breakdown, label, currentMonthBranch, dayMasterPolarity, dayMasterElement }) {
  if (!breakdown) return null;

  const S = label === 'Year' ? 'IY' : 'IM'; // Incoming Year / Incoming Month
  const qiWeightPct = label === 'Year' ? 10 : 30;
  const { raw, seasoned, polarityAdjusted, qiWeighted, stemChar, stemElement: sEl, stemFullEnglish, branchChar, branchAnimal, hiddenStems } = breakdown;
  const seasonInfo = currentMonthBranch ? getSeasonInfo(currentMonthBranch) : null;
  const sw = currentMonthBranch ? getSeasonalWeights(currentMonthBranch) : null;

  // Shared max across all distribution stages so bars are proportional
  const _allDists = [raw, seasoned, polarityAdjusted, qiWeighted].filter(Boolean);
  const _sharedMax = Math.max(..._allDists.flatMap(d => ELEMENTS.map(el => d[el] || 0)), 1);

  const pMults = dayMasterPolarity === 'Yang'
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : dayMasterPolarity === 'Yin'
      ? { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 }
      : null;

  // Build stem element count
  const stemCounts = {};
  ELEMENTS.forEach(el => { stemCounts[el] = el === sEl ? 1 : 0; });
  const stemPts = {};
  ELEMENTS.forEach(el => { stemPts[el] = stemCounts[el] * 1; });

  // Build branch element count + pts
  const branchCounts = {};
  const branchPts = {};
  ELEMENTS.forEach(el => { branchCounts[el] = 0; branchPts[el] = 0; });
  hiddenStems.forEach(hs => {
    branchCounts[hs.element] += 1;
    branchPts[hs.element] += hs.pts;
  });

  return (
    <div className="text-xs font-mono leading-relaxed space-y-1 text-gray-300">
      {/* === Intro: pillar budget === */}
      <div className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-1">
        Incoming {label} Pillar Point Budget
      </div>
      <div>
        {label} Pillar pts = {label} Stem pts + {label} Branch pts
      </div>
      <div className="text-gray-500">
        {label} Stem pts = <span className="text-white">1 pts</span>
      </div>
      <div className="text-gray-500">
        {label} Branch pts = <span className="text-white">10 pts</span>
      </div>
      <div>
        {label} Pillar pts = 1 pts + 10 pts = <span className="text-white font-semibold">11 pts</span>
      </div>

      <div className="text-gray-500 mt-1">
        (S) = Element from Stem &nbsp;|&nbsp; (B) = Elements from Branch
      </div>

      <Sep />

      {/* === A. Stem Element Count === */}
      <div className="text-gray-400 font-semibold">A. {label} Stem Element Count:</div>
      {ELEMENTS.map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> (S)</span>
          {' = '}
          <span className="text-white">{stemCounts[el]}</span>
          {stemCounts[el] > 0 && (
            <span className="text-gray-500"> ({stemFullEnglish})</span>
          )}
        </div>
      ))}

      <div className="mt-1 text-gray-400 font-semibold">{label} Stem Element pts:</div>
      {ELEMENTS.filter(el => stemCounts[el] > 0).map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> (S)</span>
          {' = '}
          {stemCounts[el]} × 1 pts/stem = <span className="text-white">{stemPts[el]} pts</span>
        </div>
      ))}

      <Sep />

      {/* === B. Branch Element Count === */}
      <div className="text-gray-400 font-semibold">B. {label} Branch Element Count:</div>
      <div className="text-gray-500 mb-1">
        {branchChar} {branchAnimal} consists of {hiddenStems.length} Hidden Element{hiddenStems.length !== 1 ? 's' : ''}
        {' '}with the following percentage contribution:
      </div>
      {hiddenStems.map((hs, i) => (
        <div key={i}>
          <ElSpan el={hs.element}>{hs.fullEnglish}</ElSpan>
          <span className="text-white"> {hs.pct}%</span>
        </div>
      ))}

      <div className="mt-1 text-gray-500">
        Total Branch pts = 10 pts divided by {hiddenStems.map(hs => `${hs.pct}%`).join(', ')} ratios
      </div>

      {/* Branch element count per element */}
      <div className="mt-1">
        {ELEMENTS.map(el => (
          <div key={el}>
            <ElSpan el={el}>{el}</ElSpan>
            <span className="text-gray-500"> (B)</span>
            {' = '}
            <span className="text-white">{branchCounts[el]}</span>
            {branchCounts[el] > 0 && (
              <span className="text-gray-500">
                {' '}({hiddenStems.filter(hs => hs.element === el).map(hs => hs.fullEnglish).join(', ')})
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Branch pts distribution */}
      <div className="mt-1 text-gray-400 font-semibold">{label} Branch Element pts:</div>
      {hiddenStems.map((hs, i) => (
        <div key={i}>
          <ElSpan el={hs.element}>{hs.element}</ElSpan>
          <span className="text-gray-500"> (B)</span>
          {' = '}
          {branchCounts[hs.element] > 0 ? '1' : '0'} × ({hs.pct}% of 10 pts) = <span className="text-white">{hs.pts.toFixed(3)} pts</span>
        </div>
      ))}

      <Sep />

      {/* === Raw Totals === */}
      <div className="text-gray-400 font-semibold">
        ({S}) = INCOMING {label.toUpperCase()} PILLAR Element Total (Raw)
      </div>

      {/* Formula lines */}
      {ELEMENTS.map(el => (
        <div key={el} className="text-gray-500">
          <ElSpan el={el}>{el}</ElSpan>
          {` (${S}) = ${el} (S) + ${el} (B)`}
        </div>
      ))}

      <div className="mt-1" />

      {/* Calculated totals */}
      {ELEMENTS.map(el => (
        <div key={el}>
          <ElSpan el={el}>{el}</ElSpan>
          <span className="text-gray-500"> ({S})</span>
          {' = '}
          {stemPts[el]} pts + {branchPts[el].toFixed(3)} pts
          {' = '}
          <span className="text-white font-semibold">{raw[el].toFixed(3)} pts</span>
        </div>
      ))}

      {/* QiBar: raw */}
      <div className="mt-2" />
      <QiBar qi={raw} maxPts={_sharedMax} />

      {/* === C. Seasonality Adjustment === */}
      {sw && seasonInfo && (
        <>
          <Sep />

          <div className="text-gray-400 font-semibold">
            C. Current Month Season Adjustment ({S}SA)
          </div>
          <div className="text-gray-500 mb-1">
            Current month: {currentMonthBranch} — {seasonInfo.emoji} {seasonInfo.name}
          </div>
          <div className="text-gray-500 mb-2">
            Each element's raw pts are multiplied by the seasonal expressiveness factor:
          </div>

          {/* Seasonal multiplier table */}
          <div className="rounded border border-white/10 overflow-hidden mb-2">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">×</th>
                  <th className="px-2 py-1 text-left text-gray-400">Level</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const mult = sw[el.toLowerCase()] ?? 1.0;
                  const level = getSeasonalLevel(mult);
                  return (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-2 py-0.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-0.5 text-right text-white">{mult.toFixed(1)}</td>
                      <td className="px-2 py-0.5 text-gray-500">{level.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Per-element calculation */}
          <div className="text-gray-400 font-semibold">
            INCOMING {label.toUpperCase()} PILLAR Seasonality Adjusted ({S}SA):
          </div>
          {ELEMENTS.map(el => {
            const mult = sw[el.toLowerCase()] ?? 1.0;
            const rawPts = raw[el];
            const adjPts = seasoned[el];
            const reduction = rawPts > 0 ? Math.round((1 - mult) * 100) : 0;
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}SA)</span>
                {' = '}
                <span className="text-gray-400">{rawPts.toFixed(3)} pts</span>
                {' × '}
                <span className="text-gray-400">{mult.toFixed(1)}</span>
                {' = '}
                <span className="text-white font-semibold">{adjPts.toFixed(3)}</span>
                {rawPts > 0 && mult < 1.0 && (
                  <span className="text-red-400/70 ml-1">({reduction}% reduction)</span>
                )}
                {rawPts > 0 && mult >= 1.0 && (
                  <span className="text-green-400/70 ml-1">(full strength)</span>
                )}
              </div>
            );
          })}

          <div className="mt-2" />
          <QiBar qi={seasoned} maxPts={_sharedMax} />
        </>
      )}

      {/* === D. Polarity Adjustment === */}
      {polarityAdjusted && pMults && dayMasterPolarity && dayMasterElement && (
        <>
          <Sep />

          <div className="text-gray-400 font-semibold">
            D. Polarity Adjustment ({S}PSA)
          </div>
          <div className="text-gray-500 mb-1">
            Day Master = <span className="text-white">{dayMasterPolarity} <ElSpan el={dayMasterElement}>{dayMasterElement}</ElSpan></span>
            {' → using '}
            <span className="text-purple-300">{dayMasterPolarity}</span> multipliers
          </div>

          {/* Polarity multiplier table */}
          <div className="rounded border border-white/10 overflow-hidden mb-2">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">×</th>
                  <th className="px-2 py-1 text-left text-gray-400">Effect</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const pMult = pMults[el];
                  const pctChange = Math.round((pMult - 1) * 100);
                  return (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-2 py-0.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-0.5 text-right text-white">{pMult.toFixed(2)}</td>
                      <td className="px-2 py-0.5 text-gray-500">
                        {pctChange > 0 && <span className="text-green-400/70">+{pctChange}% amplified</span>}
                        {pctChange < 0 && <span className="text-red-400/70">{pctChange}% reduced</span>}
                        {pctChange === 0 && <span>neutral</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Per-element polarity calculation */}
          <div className="text-gray-400 font-semibold">
            INCOMING {label.toUpperCase()} PILLAR Polarity + Seasonality Adjusted ({S}PSA):
          </div>
          {ELEMENTS.map(el => {
            const seasonedPts = seasoned[el];
            const polPts = polarityAdjusted[el];
            const pctChange = Math.round((pMults[el] - 1) * 100);
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}PSA)</span>
                {' = '}
                <span className="text-gray-400">{seasonedPts.toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{pMults[el].toFixed(2)}</span>
                {' = '}
                <span className="text-white font-semibold">{polPts.toFixed(3)}</span>
                {seasonedPts > 0 && pctChange > 0 && (
                  <span className="text-green-400/70 ml-1">(+{pctChange}%)</span>
                )}
                {seasonedPts > 0 && pctChange < 0 && (
                  <span className="text-red-400/70 ml-1">({pctChange}%)</span>
                )}
              </div>
            );
          })}

          <div className="mt-2" />
          <QiBar qi={polarityAdjusted} maxPts={_sharedMax} />
        </>
      )}

      {/* === E. Qi Weighting === */}
      {qiWeighted && polarityAdjusted && (
        <>
          <Sep />
          <div className="text-gray-400 font-semibold">
            E. Functional Qi — INCOMING {label.toUpperCase()} PILLAR ({S}FQ)
          </div>
          <div className="text-gray-500 mb-1">
            {label} Functional Qi = each element's Polarity Adjusted value × {qiWeightPct}%
          </div>
          {ELEMENTS.map(el => {
            const polPts = polarityAdjusted[el];
            const fqPts = qiWeighted[el];
            return (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> ({S}FQ)</span>
                {' = '}
                <span className="text-gray-400">{polPts.toFixed(3)}</span>
                {' × '}
                <span className="text-gray-400">{qiWeightPct}%</span>
                {' = '}
                <span className="text-white font-semibold">{fqPts.toFixed(3)}</span>
              </div>
            );
          })}

          <div className="mt-2" />
          <div className="text-xs font-semibold text-amber-300 mb-1">Functional Qi (Qi-Weighted)</div>
          <QiBar qi={qiWeighted} maxPts={_sharedMax} />
        </>
      )}
    </div>
  );
}

// ============================================================================
// INCOMING PILLAR WITH FLAP — same format as natal PillarWithFlap
// ============================================================================

function IncomingPillarWithFlap({ breakdown, label, expanded, onToggle, currentMonthBranch, dayMasterPolarity, dayMasterElement }) {
  if (!breakdown) return null;

  const total = ELEMENTS.reduce((s, k) => s + breakdown.raw[k], 0);

  // Map breakdown.hiddenStems to the format ModularPillarCard expects
  const hiddenRoots = (breakdown.hiddenStems || []).map(hs => ({
    stem: hs.char,
    pct: hs.pct,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Pillar Card — with hidden stems just like natal */}
      <ModularPillarCard
        label={label}
        pillar={{
          stem: breakdown.stemChar,
          branch: breakdown.branchChar,
          element: breakdown.stemElement,
          hiddenRoots,
        }}
        compact
        showHiddenRoots
        metaOverride={{
          weight: label === 'Year' ? 'Qi Energy=10%' : 'Qi Energy=30%',
          subtitle: label === 'Year' ? 'Current Year Qi influence' : 'Current Month Qi influence',
        }}
      />

      {/* Toggle button — mt-auto aligns across columns */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 mt-auto pt-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
      >
        <span className="text-xs font-medium text-gray-300">
          {label} Calculation
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">
            {total.toFixed(3)} pts
          </span>
          <span className="text-gray-500 text-xs">{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {/* Expandable baby-step calculation flap */}
      {expanded && (
        <div className="mt-1 p-3 rounded-lg bg-slate-900/80 border border-white/10 space-y-3 max-h-[40rem] overflow-y-auto">
          <IncomingBabyStepCalc
            breakdown={breakdown}
            label={label}
            currentMonthBranch={currentMonthBranch}
            dayMasterPolarity={dayMasterPolarity}
            dayMasterElement={dayMasterElement}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXTERNAL PILLAR PANEL — Standalone Current Year / Current Month panel
// Same format as DaYun: pillar card + baby-step calculation + Qi output bars.
// Pipeline: stem 1pt + branch 10pt → own seasonality → own polarity → raw QiVector
// ============================================================================

function ExternalPillarPanel({ breakdown, label, pillarQi, steps }) {
  const [calcOpen, setCalcOpen] = useState(false);

  if (!breakdown) return null;

  const { raw, seasoned, polarityAdjusted, stemChar, stemElement: sEl, stemFullEnglish, branchChar, branchAnimal, hiddenStems } = breakdown;

  const hiddenRoots = (hiddenStems || []).map(hs => ({
    stem: hs.char,
    pct: hs.pct,
  }));

  const qiTotal = pillarQi ? ELEMENTS.reduce((s, el) => s + (pillarQi[el] || 0), 0) : 0;
  const maxQi = pillarQi ? Math.max(...ELEMENTS.map(el => pillarQi[el] || 0), 0.01) : 1;

  // Shared bar max across all stages
  const allDists = [raw, seasoned, polarityAdjusted, pillarQi].filter(Boolean);
  const barMax = Math.max(...allDists.flatMap(d => ELEMENTS.map(el => d[el] || 0)), 0.01);

  // Seasonality multipliers: seasoned / raw (infer from data)
  const seasonMults = {};
  ELEMENTS.forEach(el => {
    seasonMults[el] = (raw?.[el] || 0) > 0 ? (seasoned?.[el] || 0) / raw[el] : (seasoned?.[el] || 0) > 0 ? 1.0 : 0;
  });

  // Polarity multipliers: polarityAdjusted / seasoned
  const polMults = {};
  ELEMENTS.forEach(el => {
    polMults[el] = (seasoned?.[el] || 0) > 0 ? (polarityAdjusted?.[el] || 0) / seasoned[el] : (polarityAdjusted?.[el] || 0) > 0 ? 1.0 : 0;
  });

  // Stem polarity from stemFullEnglish (e.g. "Yang Fire" → "Yang")
  const stemPol = stemFullEnglish?.split(' ')[0] || '';

  // Mini bar renderer
  const MiniBar = ({ qi }) => (
    <div className="space-y-0.5 mt-1">
      {ELEMENTS.map(el => {
        const v = qi?.[el] || 0;
        return (
          <div key={el} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-10 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>{el}</span>
            <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
              {v > 0 && <div className="h-full rounded" style={{ width: `${Math.max((v / barMax) * 100, 1)}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.6 }} />}
            </div>
            <span className="w-12 text-right font-mono text-gray-400">{v.toFixed(3)}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{label} Pillar</span>
          <span className="text-[10px] text-gray-500 font-mono">
            {stemChar}{branchChar} — {stemFullEnglish} {branchAnimal}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-400">
          {qiTotal.toFixed(3)} qi (scaled to NTFQ)
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Pillar Card — min-height keeps "show calculation" aligned across the 3-month grid */}
        <div className="max-w-[280px] min-h-[260px]">
          <ModularPillarCard
            label={label}
            pillar={{
              stem: stemChar,
              branch: branchChar,
              element: sEl,
              hiddenRoots,
            }}
            compact
            showHiddenRoots
            metaOverride={{
              weight: `External Climate`,
              subtitle: `DaYun-style pipeline — own season + own polarity`,
            }}
          />
        </div>

        {/* Pipeline label */}
        <div className="text-[10px] text-gray-500">
          Stem(1pt) + Branch(10pt) → <span className="text-amber-400">Seasonality</span> → <span className="text-amber-400">Polarity</span> → {label} Qi (raw pts)
        </div>
        <div className="text-[10px] text-gray-600">
          External climate — no clashes, combinations, or transformations.
        </div>

        {/* === Detailed Calculation — Da Yun style === */}
        <button
          onClick={() => setCalcOpen(!calcOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
        >
          <span className="text-xs font-medium text-gray-300">
            {calcOpen ? '▾' : '▸'} show calculation
          </span>
          <span className="text-xs font-mono text-gray-400">{qiTotal.toFixed(3)} pts</span>
        </button>

        {calcOpen && (
          <div className="rounded-lg bg-slate-950/60 border border-slate-700/30 p-3 text-xs font-mono space-y-3">
            {/* A. Stem */}
            <div>
              <div className="text-slate-400 font-semibold">A. {label} Stem</div>
              <div className="text-slate-500 mt-0.5">
                Stem {stemChar} (<span style={{ color: ELEM_COLORS[sEl] }}>{stemFullEnglish}</span>)
                = <span className="text-white">1 pt</span> → {sEl}
              </div>
            </div>

            {/* B. Branch Hidden Stems */}
            <div>
              <div className="text-slate-400 font-semibold">B. {label} Branch Hidden Stems</div>
              <div className="text-slate-500 mt-0.5 mb-1">
                {branchChar} {branchAnimal} = <span className="text-white">10 pts</span> distributed:
              </div>
              {(hiddenStems || []).map((hs, i) => {
                const pts = 10 * (hs.pct / 100);
                return (
                  <div key={i} className="text-slate-500">
                    <span style={{ color: ELEM_COLORS[hs.element] }}>{hs.char || hs.stem} {hs.fullEnglish || hs.element}</span>
                    {' '}{hs.pct}% → <span className="text-white">{pts.toFixed(3)} pts</span> → {hs.element}
                  </div>
                );
              })}
            </div>

            {/* Raw total */}
            {raw && (
              <div>
                <div className="text-slate-400 font-semibold">Raw {label} Qi (Stem + Branch)</div>
                <MiniBar qi={raw} />
              </div>
            )}

            {/* C. Seasonality */}
            {seasoned && (
              <div>
                <div className="text-slate-400 font-semibold">C. Seasonality ({label} branch {branchChar} {branchAnimal})</div>
                <div className="rounded border border-slate-700/30 overflow-hidden mt-1 mb-1">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="px-2 py-0.5 text-left text-slate-500">Element</th>
                        <th className="px-2 py-0.5 text-right text-slate-500">Raw</th>
                        <th className="px-2 py-0.5 text-center text-slate-500">×</th>
                        <th className="px-2 py-0.5 text-right text-slate-500">Seasoned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ELEMENTS.map(el => (
                        <tr key={el} className="border-t border-slate-700/20">
                          <td className="px-2 py-0.5" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                          <td className="px-2 py-0.5 text-right text-slate-400">{(raw[el] || 0).toFixed(3)}</td>
                          <td className="px-2 py-0.5 text-center text-slate-500">{seasonMults[el].toFixed(1)}</td>
                          <td className="px-2 py-0.5 text-right text-white font-semibold">{(seasoned[el] || 0).toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <MiniBar qi={seasoned} />
              </div>
            )}

            {/* D. Polarity */}
            {polarityAdjusted && (
              <div>
                <div className="text-slate-400 font-semibold">D. Polarity ({stemPol} stem {stemChar})</div>
                <div className="rounded border border-slate-700/30 overflow-hidden mt-1 mb-1">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="px-2 py-0.5 text-left text-slate-500">Element</th>
                        <th className="px-2 py-0.5 text-right text-slate-500">Seasoned</th>
                        <th className="px-2 py-0.5 text-center text-slate-500">×</th>
                        <th className="px-2 py-0.5 text-right text-slate-500">Polarized</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ELEMENTS.map(el => (
                        <tr key={el} className="border-t border-slate-700/20">
                          <td className="px-2 py-0.5" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                          <td className="px-2 py-0.5 text-right text-slate-400">{(seasoned[el] || 0).toFixed(3)}</td>
                          <td className="px-2 py-0.5 text-center text-slate-500">{polMults[el].toFixed(2)}</td>
                          <td className="px-2 py-0.5 text-right text-white font-semibold">{(polarityAdjusted[el] || 0).toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <MiniBar qi={polarityAdjusted} />
              </div>
            )}

            {/* Final = Polarity output → Scaled to NTFQ */}
            <div>
              <div className="text-amber-300 font-semibold">{label} Qi = Polarity output → Scaled to NTFQ total</div>
              <div className="text-slate-500 mt-0.5 text-[9px]">
                External pillar raw pts are scaled so total matches NTFQ total. This gives all layers equal mass — MTFQ weights (×0.9, ×0.5, ×0.3) become pure influence multipliers.
              </div>
            </div>
          </div>
        )}

        {/* Qi Output Bars — shows both raw and normalized */}
        {pillarQi && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {label.toUpperCase()} QI — SCALED TO NTFQ
            </div>
            {ELEMENTS.map(el => {
              const v = pillarQi[el] || 0;
              const pct = maxQi > 0 ? (v / maxQi) * 100 : 0;
              return (
                <div key={el} className="flex items-center gap-2 text-[11px]">
                  <span className="w-12 font-mono" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                  <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
                    {v > 0 && (
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          backgroundColor: ELEM_COLORS[el],
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </div>
                  <span className="w-16 text-right font-mono text-gray-300">{v.toFixed(3)} qi</span>
                </div>
              );
            })}
            <div className="text-[9px] text-gray-500 font-mono mt-1">
              Scaled total: {ELEMENTS.reduce((s, el) => s + (pillarQi[el] || 0), 0).toFixed(3)} qi (= NTFQ total)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: QI SUMMARY — Natal TFQ, Current Year Qi, Current Month Qi
// ============================================================================

function CombinedYMFQPanel({ yearFq, monthFq, year, monthName, natalTfq, daYunQi }) {
  const [open, setOpen] = useState(false);

  const natalQi = natalTfq;  // Engine's natalForMtfq (single source of truth)
  const totalTfq = ELEMENTS.reduce((s, el) => s + (natalQi?.[el] || 0), 0);
  const totalDaYun = daYunQi ? ELEMENTS.reduce((s, el) => s + (daYunQi[el] || 0), 0) : 0;
  const totalYear = ELEMENTS.reduce((s, el) => s + (yearFq[el] || 0), 0);
  const totalMonth = ELEMENTS.reduce((s, el) => s + (monthFq[el] || 0), 0);

  // Compute MTFQ per element
  const mtfq = {};
  const W_N = 1.0, W_D = 0.9, W_Y = 0.5, W_M = 0.3;
  ELEMENTS.forEach(el => {
    mtfq[el] = W_N * (natalQi?.[el] || 0)
             + W_D * (daYunQi?.[el] || 0)
             + W_Y * (yearFq[el] || 0)
             + W_M * (monthFq[el] || 0);
  });
  const totalMtfq = ELEMENTS.reduce((s, el) => s + mtfq[el], 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 1: Qi Inputs Summary — 4-Layer MTFQ
        </span>
        <span className="text-gray-500">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            The four Qi sources that blend into your monthly TotalQi. Each layer has already been through
            its own pipeline (seasonality, polarity). Weights reflect metaphysical time-scale influence.
          </div>

          {/* Formula display */}
          <div className="rounded border border-white/10 bg-black/30 px-3 py-2 text-[10px] font-mono text-gray-300 space-y-1">
            <div>
              MTFQ = <span className="text-amber-300">1.0</span> × NTFQ
              + <span className="text-pink-300">0.9</span> × DaYun′
              + <span className="text-purple-300">0.5</span> × Year′
              + <span className="text-cyan-300">0.3</span> × Month′
            </div>
            <div className="text-[9px] text-gray-500">
              DaYun′, Year′, Month′ are scaled so each layer's total = NTFQ total.
              All layers have equal mass; weights (1.0, 0.9, 0.5, 0.3) are pure influence multipliers.
              Natal ≈ 37%, DaYun ≈ 33%, Year ≈ 19%, Month ≈ 11%.
            </div>
          </div>

          {/* Input layers table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1.5 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1.5 text-right text-amber-300">NTFQ<br /><span className="text-[9px] text-gray-500">×1.0 (body)</span></th>
                  {daYunQi && <th className="px-2 py-1.5 text-right text-pink-300">DaYun′<br /><span className="text-[9px] text-gray-500">×0.9 (scaled)</span></th>}
                  <th className="px-2 py-1.5 text-right text-purple-300">Year′<br /><span className="text-[9px] text-gray-500">×0.5 ({year})</span></th>
                  <th className="px-2 py-1.5 text-right text-cyan-300">Month′<br /><span className="text-[9px] text-gray-500">×0.3 ({monthName})</span></th>
                  <th className="px-2 py-1.5 text-right text-green-300">MTFQ<br /><span className="text-[9px] text-gray-500">Weighted</span></th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => (
                  <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-2 py-1.5">
                      <ElSpan el={el}>{el}</ElSpan>
                    </td>
                    <td className="px-2 py-1.5 text-right text-amber-300">{(natalQi?.[el] || 0).toFixed(3)}</td>
                    {daYunQi && <td className="px-2 py-1.5 text-right text-pink-300">{(daYunQi[el] || 0).toFixed(3)}</td>}
                    <td className="px-2 py-1.5 text-right text-purple-300">{(yearFq[el] || 0).toFixed(3)}</td>
                    <td className="px-2 py-1.5 text-right text-cyan-300">{(monthFq[el] || 0).toFixed(3)}</td>
                    <td className="px-2 py-1.5 text-right text-green-300 font-semibold">{mtfq[el].toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-2 py-1.5 text-gray-400 font-semibold">Total</td>
                  <td className="px-2 py-1.5 text-right text-amber-300 font-semibold">{totalTfq.toFixed(3)}</td>
                  {daYunQi && <td className="px-2 py-1.5 text-right text-pink-300 font-semibold">{totalDaYun.toFixed(3)}</td>}
                  <td className="px-2 py-1.5 text-right text-purple-300 font-semibold">{totalYear.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right text-cyan-300 font-semibold">{totalMonth.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right text-green-300 font-semibold">{totalMtfq.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Baby-step per-element breakdown */}
          <div className="rounded border border-white/10 bg-black/20 px-3 py-2 space-y-1">
            <div className="text-[9px] text-gray-400 font-semibold mb-1">Per-Element Baby-Step Calculation</div>
            {ELEMENTS.map(el => {
              const n = natalQi?.[el] || 0;
              const d = daYunQi?.[el] || 0;
              const y = yearFq[el] || 0;
              const mo = monthFq[el] || 0;
              const parts = [`1.0×${n.toFixed(3)}`];
              if (daYunQi) parts.push(`0.9×${d.toFixed(3)}`);
              parts.push(`0.5×${y.toFixed(3)}`);
              parts.push(`0.3×${mo.toFixed(3)}`);
              return (
                <div key={el} className="text-[9px] font-mono text-gray-400">
                  <ElSpan el={el}>{el.padEnd(5, '\u00A0')}</ElSpan>
                  {': '}
                  {parts.join(' + ')}
                  {' = '}
                  <span className="text-green-300 font-semibold">{mtfq[el].toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 2: CYMFQ INFLUENCE ON USER'S TFQ
// ============================================================================

function InfluencePanel({ cymfq, userTfq }) {
  const [open, setOpen] = useState(false);

  if (!userTfq || !cymfq) return null;

  // Compute influence: how much CYMFQ shifts each element relative to user's TFQ
  const userTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);
  const rows = ELEMENTS.map(el => {
    const tfqVal = userTfq[el] || 0;
    const cymVal = cymfq[el] || 0;
    const pctChange = tfqVal > 0 ? ((cymVal / tfqVal) * 100) : (cymVal > 0 ? Infinity : 0);
    return { el, tfqVal, cymVal, pctChange };
  });

  // For the influence bar: max absolute value for scaling
  const maxCym = Math.max(...rows.map(r => r.cymVal), 0.001);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 2: Year + Month Influence on Your Natal Qi
        </span>
        <span className="text-gray-500">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            How much the current year + month Qi adds to (or contrasts with) your natal Functional Qi.
          </div>

          {/* Table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">Your TFQ</th>
                  <th className="px-2 py-1 text-right text-gray-400">CYMFQ</th>
                  <th className="px-2 py-1 text-right text-gray-400">+/- %</th>
                  <th className="px-2 py-1 text-left text-gray-400 w-1/3">Influence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ el, tfqVal, cymVal, pctChange }) => {
                  const pctStr = pctChange === Infinity ? '∞' : `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;
                  const isBoost = cymVal > 0;
                  return (
                    <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-2 py-1.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-1.5 text-right text-gray-300">{tfqVal.toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-right text-white">{cymVal.toFixed(3)}</td>
                      <td className={`px-2 py-1.5 text-right font-semibold ${isBoost ? 'text-green-400' : 'text-gray-500'}`}>
                        {isBoost ? pctStr : '—'}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="h-4 bg-white/5 rounded overflow-hidden relative">
                          {cymVal > 0 && (
                            <div
                              className="h-full rounded"
                              style={{
                                width: `${Math.min((cymVal / maxCym) * 100, 100)}%`,
                                backgroundColor: ELEM_COLORS[el],
                                opacity: 0.8,
                                minWidth: '1rem',
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Insight callouts */}
          <div className="space-y-1">
            {rows.filter(r => r.cymVal > 0).sort((a, b) => b.pctChange - a.pctChange).map(({ el, tfqVal, cymVal, pctChange }) => {
              const pctStr = pctChange === Infinity ? 'new' : `+${pctChange.toFixed(0)}%`;
              const isWeak = tfqVal < (userTotal * 0.10); // element is <10% of TFQ
              return (
                <div key={el} className="text-[10px] font-mono">
                  {isWeak ? (
                    <span className="text-green-400">
                      ✦ <ElSpan el={el}>{el}</ElSpan> — Year/Month brings <span className="text-white font-semibold">{cymVal.toFixed(3)}</span> to your weak {el} ({pctStr})
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      <ElSpan el={el}>{el}</ElSpan> — adds <span className="text-white">{cymVal.toFixed(3)}</span> ({pctStr})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 3: NORMALIZED QI — 60% Natal / 40% Year+Month
// ============================================================================

function NormalizedQiPanel({ cymfq, userTfq }) {
  const [open, setOpen] = useState(false);

  if (!userTfq || !cymfq) return null;

  // Adjusted values
  const atfq = {};    // Adjusted TFQ = TFQ × 60%
  const acymfq = {};  // Adjusted CYMFQ = CYMFQ × 40%
  const combined = {}; // Total = ATFQ + ACYMFQ
  let totalCombined = 0;
  let totalAtfq = 0;
  let totalAcymfq = 0;

  ELEMENTS.forEach(el => {
    atfq[el] = (userTfq[el] || 0) * 0.60;
    acymfq[el] = (cymfq[el] || 0) * 0.40;
    combined[el] = atfq[el] + acymfq[el];
    totalCombined += combined[el];
    totalAtfq += atfq[el];
    totalAcymfq += acymfq[el];
  });

  // For comparison: original TFQ percentages vs new combined percentages
  const origTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 3: Normalized Qi — 60% Natal + 40% Year/Month
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalCombined.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            Scale natal Qi to 60% and year/month Qi to 40% — modeling energetic influence, not destiny.
          </div>

          {/* Table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">
                    <div>ATFQ</div>
                    <div className="text-[9px] font-normal opacity-70">TFQ × 60%</div>
                  </th>
                  <th className="px-2 py-1 text-center text-gray-500">+</th>
                  <th className="px-2 py-1 text-right text-gray-400">
                    <div>ACYMFQ</div>
                    <div className="text-[9px] font-normal opacity-70">CYMFQ × 40%</div>
                  </th>
                  <th className="px-2 py-1 text-center text-gray-500">=</th>
                  <th className="px-2 py-1 text-right text-white">
                    <div>Total</div>
                  </th>
                  <th className="px-2 py-1 text-right text-gray-400">%</th>
                  <th className="px-2 py-1 text-right text-gray-500">
                    <div>Natal %</div>
                  </th>
                  <th className="px-2 py-1 text-right text-gray-400">+/-</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const newPct = totalCombined > 0 ? (combined[el] / totalCombined) * 100 : 0;
                  const origPct = origTotal > 0 ? ((userTfq[el] || 0) / origTotal) * 100 : 0;
                  const shift = newPct - origPct;
                  return (
                    <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-2 py-1.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      <td className="px-2 py-1.5 text-right text-gray-300">{atfq[el].toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-center text-gray-500">+</td>
                      <td className="px-2 py-1.5 text-right text-gray-300">{acymfq[el].toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-center text-gray-500">=</td>
                      <td className="px-2 py-1.5 text-right text-white font-semibold">{combined[el].toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-right" style={{ color: ELEM_COLORS[el] }}>
                        {newPct.toFixed(1)}%
                      </td>
                      <td className="px-2 py-1.5 text-right text-gray-500">
                        {origPct.toFixed(1)}%
                      </td>
                      <td className={`px-2 py-1.5 text-right font-semibold ${shift > 0.5 ? 'text-green-400' : shift < -0.5 ? 'text-red-400' : 'text-gray-500'}`}>
                        {shift > 0 ? '+' : ''}{shift.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-2 py-1.5 text-gray-400 font-semibold">Total</td>
                  <td className="px-2 py-1.5 text-right text-gray-400">{totalAtfq.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-center text-gray-500">+</td>
                  <td className="px-2 py-1.5 text-right text-gray-400">{totalAcymfq.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-center text-gray-500">=</td>
                  <td className="px-2 py-1.5 text-right text-white font-bold">{totalCombined.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right text-white">100%</td>
                  <td className="px-2 py-1.5 text-right text-gray-500">100%</td>
                  <td className="px-2 py-1.5" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Formula */}
          <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
            {ELEMENTS.map(el => (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                {' = '}
                <span className="text-gray-400">{(userTfq[el] || 0).toFixed(3)}</span>
                <span className="text-gray-500"> × 60%</span>
                {' + '}
                <span className="text-gray-400">{(cymfq[el] || 0).toFixed(3)}</span>
                <span className="text-gray-500"> × 40%</span>
                {' = '}
                <span className="text-white font-semibold">{combined[el].toFixed(3)}</span>
              </div>
            ))}
          </div>

          {/* Side-by-side comparison bars */}
          <div className="text-xs font-semibold text-gray-300 mb-1 mt-2">Natal vs Normalized — Element Distribution Shift</div>
          <div className="space-y-2">
            {ELEMENTS.map(el => {
              const origPct = origTotal > 0 ? ((userTfq[el] || 0) / origTotal) * 100 : 0;
              const newPct = totalCombined > 0 ? (combined[el] / totalCombined) * 100 : 0;
              const maxPct = Math.max(origPct, newPct, 1);
              const shift = newPct - origPct;
              return (
                <div key={el} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <ElSpan el={el}>{el}</ElSpan>
                    <span className={`font-semibold ${shift > 0.5 ? 'text-green-400' : shift < -0.5 ? 'text-red-400' : 'text-gray-500'}`}>
                      {shift > 0 ? '+' : ''}{shift.toFixed(1)}%
                    </span>
                  </div>
                  {/* Natal bar */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-500 w-10 text-right">Natal</span>
                    <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${(origPct / maxPct) * 100}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.4 }} />
                    </div>
                    <span className="text-[9px] text-gray-500 w-10 text-right">{origPct.toFixed(1)}%</span>
                  </div>
                  {/* Normalized bar */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-white w-10 text-right">Now</span>
                    <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${(newPct / maxPct) * 100}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.9 }} />
                    </div>
                    <span className="text-[9px] text-white w-10 text-right">{newPct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACYMFQ Effect — what the 40% year/month energy contributes */}
          <div className="text-xs font-semibold text-cyan-300 mb-1 mt-3">ACYMFQ Effect — Year/Month Contribution (40%)</div>
          <div className="text-[10px] text-gray-500 mb-2">
            How much of your normalized Qi comes from the current year &amp; month energy:
          </div>

          <div className="space-y-1.5">
            {ELEMENTS.map(el => {
              const acVal = acymfq[el];
              const combinedVal = combined[el];
              const shareOfNorm = totalCombined > 0 ? (acVal / totalCombined) * 100 : 0;
              const shareOfElement = combinedVal > 0 ? (acVal / combinedVal) * 100 : 0;
              return (
                <div key={el} className="flex items-center gap-2 text-[10px] font-mono">
                  <ElSpan el={el}><span className="w-12 inline-block">{el}</span></ElSpan>
                  <span className="text-gray-400 w-16 text-right">{acVal.toFixed(3)}</span>
                  <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden relative">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${Math.max(shareOfElement, 2)}%`,
                        backgroundColor: ELEM_COLORS[el],
                        opacity: 0.8,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center px-1.5 text-[9px] text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {shareOfElement.toFixed(1)}% of {el}
                    </span>
                  </div>
                  <span className="text-gray-500 w-16 text-right">{shareOfNorm.toFixed(1)}% total</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-gray-400 mt-2 space-y-0.5">
            {ELEMENTS.map(el => {
              const acVal = acymfq[el];
              const combinedVal = combined[el];
              const shareOfElement = combinedVal > 0 ? (acVal / combinedVal) * 100 : 0;
              return (
                <div key={el}>
                  <ElSpan el={el}>{el}</ElSpan>
                  {': ACYMFQ '}
                  <span className="text-cyan-300">{acVal.toFixed(3)}</span>
                  {' / Normalized '}
                  <span className="text-white">{combinedVal.toFixed(3)}</span>
                  {' = '}
                  <span className="text-cyan-300 font-semibold">{shareOfElement.toFixed(1)}%</span>
                  <span className="text-gray-600"> of this element comes from year/month</span>
                </div>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-cyan-300 mb-1 mt-2">ACYMFQ Distribution</div>
          <QiBar qi={acymfq} />

          {/* Normalized QiBar */}
          <div className="text-xs font-semibold text-amber-300 mb-1 mt-3">Normalized Total Functional Qi (NTFQ)</div>
          <QiBar qi={combined} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BEFORE / AFTER BAR — reusable side-by-side comparison for pipeline steps
// ============================================================================

function BeforeAfterBars({ before, after, label = '' }) {
  const maxVal = Math.max(
    ...ELEMENTS.map(el => Math.max(before[el] || 0, after[el] || 0)),
    0.001
  );
  return (
    <div className="space-y-2">
      {ELEMENTS.map(el => {
        const bVal = before[el] || 0;
        const aVal = after[el] || 0;
        const diff = aVal - bVal;
        return (
          <div key={el} className="space-y-0.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <ElSpan el={el}>{el}</ElSpan>
              <span className={`font-semibold ${diff > 0.0005 ? 'text-green-400' : diff < -0.0005 ? 'text-red-400' : 'text-gray-500'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(3)}
              </span>
            </div>
            {/* Before bar */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500 w-12 text-right">Before</span>
              <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                <div className="h-full rounded" style={{
                  width: `${Math.max((bVal / maxVal) * 100, bVal > 0 ? 2 : 0)}%`,
                  backgroundColor: ELEM_COLORS[el],
                  opacity: 0.35,
                }} />
                <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-gray-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {bVal > 0 ? bVal.toFixed(3) : ''}
                </span>
              </div>
            </div>
            {/* After bar */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-white w-12 text-right">After</span>
              <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                <div className="h-full rounded" style={{
                  width: `${Math.max((aVal / maxVal) * 100, aVal > 0 ? 2 : 0)}%`,
                  backgroundColor: ELEM_COLORS[el],
                  opacity: 0.85,
                }} />
                <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {aVal > 0 ? aVal.toFixed(3) : ''}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// PIPELINE HELPER — pure Qi transformation functions
// ============================================================================

// Controlling cycle: Metal→Wood, Water→Fire, Fire→Metal, Wood→Earth, Earth→Water
// applyClashes, applyDirectionalClashes, computeThreePassClashes,
// applySheng, applyOvercrowding, applyControl, applyTransformations
// are imported from ../utils/qiTransforms

// ============================================================================
// STEP 5a: VOID PANEL (空亡)
// ============================================================================

const VOID_EXPLANATION_MD = `## Void / Emptiness (空亡)

Two branches in your chart are considered "void" based on your Day Pillar's position in the 60 Jiazi cycle.

**Effects of Void branches:**
- Qi contribution weakened (reduced by ~12%)
- Cannot fully participate in combinations
- Cannot fully participate in clashes
- Hidden stems operate at reduced capacity

**How it's calculated:**
The 60-year Jiazi cycle divides into six 旬 (decades) of 10 pillars each.
Each decade uses 10 of the 12 branches — the 2 unused branches are "void."

This is classical BaZi theory used by all professional practitioners.`;

function VoidPanel({ voidResult }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!voidResult) return null;

  const { voidBranches, voidEvents } = voidResult;
  const hasActiveVoid = voidEvents.length > 0;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 5a: Void / Emptiness (空亡)
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${hasActiveVoid ? 'text-purple-300' : 'text-gray-500'}`}>
            {hasActiveVoid ? `${voidEvents.length} void` : 'none active'}
          </span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-400">
            Void branches (空亡): <span className="text-purple-300 font-mono">{voidBranches[0] || '—'} {voidBranches[1] || '—'}</span>
            {' '}— These branches operate at reduced capacity.
          </div>

          {hasActiveVoid ? (
            <div className="rounded border border-white/10 overflow-hidden">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-2 py-1 text-left text-gray-400">Branch</th>
                    <th className="px-2 py-1 text-left text-gray-400">Pillar</th>
                    <th className="px-2 py-1 text-left text-gray-400">Element</th>
                    <th className="px-2 py-1 text-right text-gray-400">Qi Reduced</th>
                  </tr>
                </thead>
                <tbody>
                  {voidEvents.map((ev, i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="px-2 py-1.5 text-purple-300">{ev.branch} ({ev.animal})</td>
                      <td className="px-2 py-1.5 text-gray-300">{ev.pillarLabel}</td>
                      <td className="px-2 py-1.5"><ElSpan el={ev.element}>{ev.element}</ElSpan></td>
                      <td className="px-2 py-1.5 text-right text-red-400">−{ev.qiReduction.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic">
              No chart branches match the void positions this month.
            </div>
          )}

          {/* Learn more toggle */}
          <button
            onClick={() => setShowExplain(!showExplain)}
            className="text-[10px] text-purple-400 hover:text-purple-300 underline"
          >
            {showExplain ? 'Hide explanation' : 'Learn more about Void (空亡)'}
          </button>
          {showExplain && (
            <div className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap bg-black/30 rounded p-3 max-h-60 overflow-y-auto">
              {VOID_EXPLANATION_MD}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 5b: COMBINATIONS PANEL (合 / 六合 / 三合 / 三会)
// ============================================================================

const COMBO_TYPE_LABELS = {
  'stem-combo': { label: 'Stem Combination (天干合)', color: 'text-amber-300', icon: '合' },
  'liu-he': { label: 'Branch Six Combo (六合)', color: 'text-cyan-300', icon: '六' },
  'san-he': { label: 'Three Harmony (三合局)', color: 'text-emerald-300', icon: '三' },
  'san-hui': { label: 'Three Meetings (三会局)', color: 'text-rose-300', icon: '会' },
};

const COMBINATION_EXPLANATION_MD = `## Combinations, Harmony & Void (合化)

Before clash processing, the engine checks for **classical combination patterns** that can:
- Transform Qi into a new element
- Suppress or soften clashes (合能解冲)
- Create powerful elemental surges

### Heavenly Stem Combinations (天干合)
Five pairs: 甲+己→Earth, 乙+庚→Metal, 丙+辛→Water, 丁+壬→Wood, 戊+癸→Fire
Transform only when the current season supports the resulting element.

### Branch Six Combinations (六合)
Six pairs: 子丑→Earth, 寅亥→Wood, 卯戌→Fire, 辰酉→Metal, 巳申→Water, 午未→Fire
Similar season-dependent transformation rules.

### Three Harmony (三合局)
申子辰→Water, 亥卯未→Wood, 寅午戌→Fire, 巳酉丑→Metal
Partial (2/3) gives gentle boost. Full (3/3) with season = powerful surge.

### Three Meetings (三会局)
寅卯辰→Wood, 巳午未→Fire, 申酉戌→Metal, 亥子丑→Water
Requires all 3 branches + season support. Most powerful combination.

### Interaction with Clashes
Branches involved in active combinations are "protected" — clashes involving them are softened.
Void branches cannot participate in combinations.`;

function CombinationPanel({ comboResult }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!comboResult) return null;

  const { events, totalDelta, preQi, postQi, protectedBranches } = comboResult;
  const hasEvents = events.length > 0;
  const hasTransforms = events.some(e => e.transformed);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (postQi[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 5b: Combinations & Harmony (合 / 六合 / 三合 / 三会)
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${hasTransforms ? 'text-amber-300' : hasEvents ? 'text-gray-300' : 'text-gray-500'}`}>
            {hasEvents ? `${events.length} combo${events.length > 1 ? 's' : ''}${hasTransforms ? ' (transformed)' : ''}` : 'none'}
          </span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {hasEvents ? (
            <div className="space-y-2">
              {events.map((ev, i) => {
                const meta = COMBO_TYPE_LABELS[ev.type] || { label: ev.type, color: 'text-gray-300', icon: '?' };
                return (
                  <div key={i} className="rounded border border-white/10 p-2 space-y-1 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${meta.color}`}>{meta.icon}</span>
                      <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                    </div>
                    <div className="text-xs text-gray-200 font-medium">{ev.label}</div>
                    <div className="text-[10px] text-gray-400">{ev.detail}</div>
                    {ev.voidBlocked && (
                      <div className="text-[10px] text-purple-400 italic">Blocked by Void (空亡)</div>
                    )}
                    {ev.transformed && (
                      <div className="text-[10px] text-green-400">
                        Qi shift: {ELEMENTS.filter(el => ev.qiDelta[el]).map(el => {
                          const d = ev.qiDelta[el];
                          return `${el} ${d > 0 ? '+' : ''}${d.toFixed(3)}`;
                        }).join(', ')}
                      </div>
                    )}
                    <div className="text-[10px] text-gray-500">
                      Participants: {ev.participants.map(p => `${p.char} (${p.pillarLabel})`).join(' + ')}
                    </div>
                  </div>
                );
              })}

              {/* Protected branches summary */}
              {protectedBranches.size > 0 && (
                <div className="text-[10px] text-cyan-400/70 bg-cyan-900/20 rounded p-2">
                  Protected from clashes: {[...protectedBranches].join(', ')} — combinations soften clash damage on these branches.
                </div>
              )}

              {/* Before/After summary */}
              <div className="rounded border border-white/10 overflow-hidden">
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-2 py-1 text-left text-gray-400">Element</th>
                      <th className="px-2 py-1 text-right text-gray-400">Before</th>
                      <th className="px-2 py-1 text-right text-gray-400">After</th>
                      <th className="px-2 py-1 text-right text-gray-400">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ELEMENTS.map(el => {
                      const before = preQi[el] || 0;
                      const after = postQi[el] || 0;
                      const diff = totalDelta[el] || 0;
                      if (Math.abs(diff) < 0.0005 && before < 0.001) return null;
                      return (
                        <tr key={el} className="border-t border-white/5">
                          <td className="px-2 py-1.5"><ElSpan el={el}>{el}</ElSpan></td>
                          <td className="px-2 py-1.5 text-right text-gray-400">{before.toFixed(3)}</td>
                          <td className="px-2 py-1.5 text-right text-gray-300">{after.toFixed(3)}</td>
                          <td className={`px-2 py-1.5 text-right font-semibold ${diff > 0.0005 ? 'text-green-400' : diff < -0.0005 ? 'text-red-400' : 'text-gray-500'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(3)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic">
              No stem combinations, branch combinations, Three Harmony, or Three Meetings detected this month.
            </div>
          )}

          {/* Learn more toggle */}
          <button
            onClick={() => setShowExplain(!showExplain)}
            className="text-[10px] text-amber-400 hover:text-amber-300 underline"
          >
            {showExplain ? 'Hide explanation' : 'Learn more about Combinations (合化)'}
          </button>
          {showExplain && (
            <div className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap bg-black/30 rounded p-3 max-h-60 overflow-y-auto">
              {COMBINATION_EXPLANATION_MD}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 6: THREE-PASS CLASH ADJUSTMENT
// ============================================================================

/** Sub-panel for one clash pass — shows narratable events */
function ClashPassSection({ title, color, before, after, details, events, icon }) {
  return (
    <div className="border border-white/5 rounded p-2 space-y-2">
      <div className={`text-[11px] font-semibold ${color}`}>{title}</div>
      {events && events.length > 0 ? (
        <div className="space-y-1">
          {events.map((ev, i) => (
            <div key={i} className="text-[10px] font-mono bg-white/5 rounded p-2 space-y-0.5">
              <div className="text-gray-200">{icon} {ev.narrative}</div>
              <div className="flex gap-3 text-[9px]">
                <span className="text-gray-500">
                  <ElSpan el={ev.attacker}>{ev.attacker}</ElSpan>
                  {' '}{ev.attackerBefore.toFixed(3)}
                  {ev.attackerDelta !== 0 && (
                    <span className="text-red-400"> → {ev.attackerAfter.toFixed(3)}</span>
                  )}
                </span>
                <span className="text-gray-600">克</span>
                <span className="text-gray-500">
                  <ElSpan el={ev.victim}>{ev.victim}</ElSpan>
                  {' '}{ev.victimBefore.toFixed(3)}
                  <span className="text-red-400"> → {ev.victimAfter.toFixed(3)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : details && details.length > 0 ? (
        <div className="text-[10px] font-mono text-gray-400 space-y-0.5 bg-white/5 rounded p-2">
          {details.map((d, i) => <div key={i}>{icon} {d}</div>)}
        </div>
      ) : (
        <div className="text-[10px] text-gray-500 italic">No clashes active in this layer.</div>
      )}
      <BeforeAfterBars before={before} after={after} />
    </div>
  );
}

function ClashAdjustmentPanel({ atfq, acymfq }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!atfq || !acymfq) return null;

  const { passA, passB, passC, combined, allEvents } = computeThreePassClashes(atfq, acymfq);
  const ntfqBefore = {};
  ELEMENTS.forEach(el => { ntfqBefore[el] = (atfq[el] || 0) + (acymfq[el] || 0); });
  const totalAfter = ELEMENTS.reduce((s, el) => s + (combined[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 6: Three-Pass Clash Adjustment — Controlling Cycle (克)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalAfter.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            Clashes are computed in three separate passes to distinguish internal tensions from environmental pressure.
            Attacker must be stronger than victim. Victim loses 10% of attacker's strength; internal attacker also loses 2%.
            <button onClick={() => setShowExplain(!showExplain)} className="ml-2 text-blue-400 hover:text-blue-300 underline text-xs">
              {showExplain ? 'Hide explanation' : 'Learn more'}
            </button>
          </div>
          {showExplain && (
            <div className="rounded-lg bg-slate-900/80 border border-blue-500/20 p-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
              {CLASH_EXPLANATION_MD}
            </div>
          )}

          {/* Pass A: Natal-on-Natal */}
          <ClashPassSection
            title="Pass A — Natal Internal Tensions (ATFQ 60%)"
            color="text-blue-300"
            before={atfq}
            after={passA.result}
            details={passA.details}
            events={passA.events}
            icon="🔵"
          />

          {/* Pass B: Transit-on-Transit */}
          <ClashPassSection
            title="Pass B — Transit Internal Clashes (ACYMFQ 40%)"
            color="text-orange-300"
            before={acymfq}
            after={passB.result}
            details={passB.details}
            events={passB.events}
            icon="🟠"
          />

          {/* Pass C: Transit → Natal */}
          <ClashPassSection
            title="Pass C — Transit → Natal Pressure (weather hitting the car)"
            color="text-red-300"
            before={passA.result}
            after={passC.result}
            details={passC.details}
            events={passC.events}
            icon="🔴"
          />

          {/* Recombination */}
          <div className="border-t border-white/10 pt-2">
            <div className="text-[10px] font-mono text-gray-400 mb-1">
              Recombination: Pass C natal result + Pass B transit result = Post-Clash NTFQ
            </div>
            <div className="text-[10px] font-mono text-gray-500 space-y-0.5">
              {ELEMENTS.map(el => (
                <div key={el}>
                  <ElSpan el={el}>{el}</ElSpan>
                  {': '}
                  <span className="text-blue-300">{(passC.result[el] || 0).toFixed(3)}</span>
                  <span className="text-gray-600"> (natal) + </span>
                  <span className="text-orange-300">{(passB.result[el] || 0).toFixed(3)}</span>
                  <span className="text-gray-600"> (transit) = </span>
                  <span className="text-white font-semibold">{(combined[el] || 0).toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Combined before/after */}
          <div className="text-xs font-semibold text-gray-300 mb-1">NTFQ Before → After Three-Pass Clashes</div>
          <BeforeAfterBars before={ntfqBefore} after={combined} />

          <div className="text-xs font-semibold text-rose-300 mb-1 mt-2">Post-Clash Qi</div>
          <QiBar qi={combined} />
        </div>
      )}
    </div>
  );
}


// ============================================================================
// STRUCTURAL COLLAPSE ANALYSIS — Post-pipeline diagnostic
// ============================================================================

// Thresholds — professional BaZi structural classification
const COLLAPSE_SINGLE_DOMINANT_SHARE = 0.55;  // one element > 55% of total
const COLLAPSE_SINGLE_DOMINANT_GAP   = 0.20;  // gap between #1 and #2 > 20%
const COLLAPSE_BIPOLAR_SUM           = 0.80;  // top two > 80% combined
const COLLAPSE_DRAINED_THRESHOLD     = 0.05;  // bottom element < 5%
const COLLAPSE_INVERTED_RATIO        = 3.0;   // top / bottom > 3×

// Classical structure names and their implications
const COLLAPSE_META = {
  'single-dominant': {
    name: 'Single Dominant (從旺格)',
    color: 'text-red-300',
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
    icon: '🏔️',
    description: 'One element overwhelms all others. The chart has surrendered to a single force. Classical "Follow the Strong" structure.',
    implication: 'Yong Shen should SUPPORT the dominant element, not fight it. Remedies work WITH the dominant flow, not against.',
  },
  'bi-polar': {
    name: 'Bi-Polar (兩神成象)',
    color: 'text-amber-300',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    icon: '⚖️',
    description: 'Two elements dominate, squeezing out the other three. The chart oscillates between two forces.',
    implication: 'Balance between the two poles is key. Yong Shen may need to mediate rather than boost a deficit.',
  },
  'drained': {
    name: 'Drained Element (虛弱)',
    color: 'text-purple-300',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/5',
    icon: '🕳️',
    description: 'One element is nearly absent — functionally zero. The chart lacks an entire dimension.',
    implication: 'Critical deficiency. The drained element becomes urgent Yong Shen. Stones and remedies targeting this element are high priority.',
  },
  'inverted': {
    name: 'Inverted Structure (反局)',
    color: 'text-cyan-300',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/5',
    icon: '🔄',
    description: 'Extreme ratio between strongest and weakest. The chart is structurally lopsided without full collapse.',
    implication: 'Moderate structural stress. The weak element needs support but the structure is not yet collapsed.',
  },
};

/**
 * Analyze whether the post-pipeline Qi has collapsed into a recognizable
 * extreme structural pattern. This is a DIAGNOSTIC — it does not modify Qi.
 *
 * Classical BaZi recognizes several "special structures" (格局) that change
 * how the chart should be read and remedied.
 */
function analyzeStructuralCollapse(qi) {
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  if (total <= 0) return { mode: 'none', notes: ['No Qi to analyze.'], snapshot: { ...qi } };

  const shares = {};
  ELEMENTS.forEach(el => { shares[el] = (qi[el] || 0) / total; });

  const sorted = [...ELEMENTS].sort((a, b) => shares[b] - shares[a]);
  const top = sorted[0];
  const second = sorted[1];
  const bottom = sorted[4];

  // 1. Single Dominant — one element overwhelms (從旺格)
  if (shares[top] >= COLLAPSE_SINGLE_DOMINANT_SHARE &&
      shares[top] - shares[second] >= COLLAPSE_SINGLE_DOMINANT_GAP) {
    return {
      mode: 'single-dominant',
      primary: top,
      primaryShare: shares[top],
      notes: [
        `${top} dominates with ${(shares[top] * 100).toFixed(1)}% of total Qi.`,
        `Gap to second (${second}): ${((shares[top] - shares[second]) * 100).toFixed(1)}%.`,
        `This is a classical "Follow the Strong" (從旺) structure.`,
      ],
      snapshot: { ...qi },
    };
  }

  // 2. Bi-polar — two elements dominate (兩神成象)
  const topTwoSum = shares[top] + shares[second];
  if (topTwoSum >= COLLAPSE_BIPOLAR_SUM) {
    return {
      mode: 'bi-polar',
      primary: top,
      secondary: second,
      primaryShare: shares[top],
      secondaryShare: shares[second],
      notes: [
        `${top} + ${second} hold ${(topTwoSum * 100).toFixed(1)}% of total Qi.`,
        `The other three elements share only ${((1 - topTwoSum) * 100).toFixed(1)}%.`,
        `Classical "Two Gods Form Image" (兩神成象) structure.`,
      ],
      snapshot: { ...qi },
    };
  }

  // 3. Drained — one element nearly absent (虛弱)
  if (shares[bottom] <= COLLAPSE_DRAINED_THRESHOLD) {
    return {
      mode: 'drained',
      primary: bottom,
      primaryShare: shares[bottom],
      notes: [
        `${bottom} is nearly absent at ${(shares[bottom] * 100).toFixed(1)}%.`,
        `This represents a critical elemental deficiency.`,
        `${bottom} becomes an urgent Yong Shen candidate.`,
      ],
      snapshot: { ...qi },
    };
  }

  // 4. Inverted — extreme top/bottom ratio (反局)
  const ratio = shares[top] / Math.max(shares[bottom], 0.0001);
  if (ratio >= COLLAPSE_INVERTED_RATIO) {
    return {
      mode: 'inverted',
      primary: top,
      secondary: bottom,
      primaryShare: shares[top],
      secondaryShare: shares[bottom],
      notes: [
        `${top} is ${ratio.toFixed(1)}× stronger than ${bottom}.`,
        `Structural stress detected but not full collapse.`,
      ],
      snapshot: { ...qi },
    };
  }

  return { mode: 'none', notes: ['Balanced — no structural collapse.'], snapshot: { ...qi } };
}



// ============================================================================
// MTFQ BLEND DASHBOARD — visual breakdown of the 4-layer weighted Qi blend
// MTFQ = 1.0×NTFQ + 0.9×DaYunQi + 0.5×YearQi + 0.3×MonthQi
//
// Only natal TFQ goes through the full survival pipeline
// (Combinations → Clashes → Harms → Punishments → Control → Overcrowding →
//  Collapse → Transformations → Structure → Ten Gods → Yong Shen) to become NTFQ.
// DaYun, Year, Month Qi go through their own simpler pipeline
// (Stem+Branch → Seasonality → Polarity) and are used as-is.
// ============================================================================

// ============================================================================
// DAY MASTER STRENGTH PANEL — Full gauntlet: Base → Rooting → Season → Support → Polarity → Score
// ============================================================================

// ── Day Master Strength — Gauntlet Reference MD ──────────────────────────
const DMS_GAUNTLET_MD = `# Day Master Strength — The 6-Stage Gauntlet

How strong is your Day Master? This panel answers that question by running
the DM element through **six sequential stages**, each one amplifying or
dampening the score before the final 0–100 rating.

---

## Stage 1 — Base DM Qi

| Input | Formula |
|---|---|
| Day Stem Qi | 1 pt × season × polarity × 0.35 |
| Day Branch Qi | hidden-stem pts × season × polarity × 0.15 |
| **Base DM Qi** | **Stem Qi + α × Branch Qi** (α = 0.5) |

The Day Stem always contributes 1 raw point. The Day Branch contributes
only if the DM element appears among the branch's hidden stems.

---

## Stage 2 — Rooting (Hidden Stems in Branches)

**"Does the DM element have roots in the chart's branches?"**

Each pillar's branch is checked for the DM element among its hidden stems.
If found, a root point is awarded based on **pillar weight × season factor**.

| Pillar | Weight | Why |
|---|---|---|
| Day Branch | 1.0 | Primary root — your own foundation |
| Month Branch | 1.2 | Strongest — season of birth |
| Year Branch | 0.7 | Ancestral, more distant |
| Hour Branch | 0.7 | Future-facing, more distant |

### Root Points → Score → Multiplier

| Total Points | Score | Label | Multiplier |
|---|---|---|---|
| < 0.5 | 0 | No root | ×0.7 |
| 0.5 – 1.5 | 1 | Light root | ×1.0 |
| 1.5 – 2.5 | 2 | Solid root | ×1.3 |
| ≥ 2.5 | 3 | Deep root | ×1.6 |

**DM Qi after rooting = Base DM Qi × M_root**

---

## Stage 3 — Seasonality (Month Branch vs DM Element)

**"How well does the DM element express itself in this birth month?"**

Each element has a seasonal expressiveness value **E** (0.60 – 1.20) depending
on the birth month branch (v2 corrected — no element below 0.60):

| Branch | Animal | Wood | Fire | Earth | Metal | Water |
|---|---|---|---|---|---|---|
| 寅 | Tiger | 1.20 | 0.90 | 0.80 | 0.60 | 0.70 |
| 卯 | Rabbit | 1.20 | 0.90 | 0.80 | 0.60 | 0.70 |
| 辰 | Dragon | 1.00 | 1.10 | 1.00 | 0.70 | 0.70 |
| 巳 | Snake | 0.80 | 1.20 | 0.90 | 0.70 | 0.60 |
| 午 | Horse | 0.80 | 1.20 | 0.90 | 0.70 | 0.60 |
| 未 | Goat | 0.70 | 1.00 | 1.20 | 0.90 | 0.70 |
| 申 | Monkey | 0.60 | 0.70 | 0.90 | 1.20 | 0.80 |
| 酉 | Rooster | 0.60 | 0.70 | 0.90 | 1.20 | 0.80 |
| 戌 | Dog | 0.70 | 0.70 | 1.20 | 1.00 | 0.90 |
| 亥 | Pig | 0.80 | 0.60 | 0.80 | 0.80 | 1.20 |
| 子 | Rat | 0.80 | 0.60 | 0.80 | 0.80 | 1.20 |
| 丑 | Ox | 0.90 | 0.70 | 1.20 | 0.80 | 1.00 |

### Expressiveness → Seasonal Multiplier

\`\`\`
S = 0.8 + 0.4 × (E − 0.60) / 0.60
\`\`\`

This maps E ∈ [0.60, 1.20] → S ∈ [0.8, 1.2].

**DM Qi after season = DM Qi after rooting × S**

---

## Stage 4 — Support vs Drain

**"Is the chart environment helping or weakening the DM?"**

| Category | Elements | Relationship |
|---|---|---|
| **Support** | Same element (peer) + Generator (parent) | Feeds the DM |
| **Drain** | Child element + Controller (officer) | Weakens the DM |

The ratio R_SD = Support Qi / Drain Qi determines the multiplier:

| R_SD | Category | Multiplier |
|---|---|---|
| < 0.7 | Severely drained | ×0.7 |
| 0.7 – 1.0 | Slightly drained | ×0.9 |
| 1.0 – 1.3 | Balanced | ×1.0 |
| 1.3 – 1.8 | Well supported | ×1.2 |
| ≥ 1.8 | Strongly over-supported | ×1.4 |

### Generation & Control Cycles

| DM Element | Generator (parent) | Child | Controller (officer) |
|---|---|---|---|
| Wood | Water | Fire | Metal |
| Fire | Wood | Earth | Water |
| Earth | Fire | Metal | Wood |
| Metal | Earth | Water | Fire |
| Water | Metal | Wood | Earth |

**DM Qi after support = DM Qi after season × M_support**

---

## Stage 5 — Polarity Fine-Tuning

**"Does the DM's Yin/Yang nature shift the balance?"**

Yang DMs benefit slightly from over-support (they expand into strength).
Yin DMs benefit slightly when drained (they refine under pressure).

\`\`\`
D = R_SD − 1.0          (deviation from balance)
P = +1 (Yang) or −1 (Yin)
k = 0.15                 (sensitivity)
M_pol = 1 + P × k × D   (clamped to [0.85, 1.15])
\`\`\`

**DM Qi after polarity = DM Qi after support × M_pol**

---

## Stage 6 — Final Strength Score

\`\`\`
Score = (DM Qi after polarity / Qi_norm) × 100
Qi_norm = 2.0 (normalization constant)
\`\`\`

| Score | Tier | Meaning |
|---|---|---|
| 0 – 20 | Overweak | DM barely registers; needs strong support |
| 20 – 40 | Weak | DM present but fragile; benefits from support |
| 40 – 60 | Balanced | Healthy equilibrium; chart flows naturally |
| 60 – 80 | Strong | DM dominates; may need draining/controlling |
| 80 – 100 | Overstrong | DM overpowers everything; strong remedies needed |

---

## Quick Reference — Full Pipeline

\`\`\`
Base DM Qi  =  Stem Qi  +  α × Branch Qi
     ↓ × M_root     (rooting)
     ↓ × S          (seasonality)
     ↓ × M_support  (support vs drain)
     ↓ × M_pol      (polarity fine-tuning)
     ↓ ÷ Qi_norm × 100  →  Score (0–100)  →  Tier
\`\`\`
`;

// ── Stage 4 — Support vs Drain narrative MD ──────────────────────────────
const SUPPORT_DRAIN_MD = `# Stage 4 — Support vs Drain

## How the world around you strengthens or weakens your Day Master

Every Day Master lives inside an elemental ecosystem.
Some forces lift it up, others pull from it, and Stage 4 measures
exactly how those forces balance in your chart.

---

## Supportive Qi — the elements that nourish you

These are the energies that **feed** your Day Master or **stand beside** it:

| Role | Chinese | What it does |
|---|---|---|
| **Parent (Resource)** | 生我 *shēng wǒ* | The element that *generates* your DM — like Water feeding Wood |
| **Peer (Companion)** | 比劫 *bǐ jié* | The *same element* as your DM — strength in numbers |

Together they form your **Support Qi** — the part of the chart that
strengthens your core and replenishes your reserves.

---

## Draining Qi — the elements that pull from you

These are the energies that **take effort** from your Day Master:

| Role | Chinese | What it does |
|---|---|---|
| **Child (Output)** | 我生 *wǒ shēng* | The element your DM *produces* — like Wood feeding Fire |
| **Officer (Controller)** | 克我 *kè wǒ* | The element that *restrains* your DM — like Metal chopping Wood |

These form your **Drain Qi** — the part of the chart that demands
energy, attention, or adaptation.

---

## The Balance Point

Once we total both sides, we compare them:

\`\`\`
R_SD = Support Qi / Drain Qi
\`\`\`

This ratio tells us the "weather" around your Day Master:

| R_SD | Category | Multiplier | Meaning |
|---|---|---|---|
| < 0.7 | Severely drained | ×0.7 | DM is overwhelmed — needs rescue |
| 0.7 – 1.0 | Slightly drained | ×0.9 | DM is under pressure but functioning |
| 1.0 – 1.3 | Balanced | ×1.0 | Healthy equilibrium — the ideal zone |
| 1.3 – 1.8 | Well supported | ×1.2 | DM has a strong safety net |
| ≥ 1.8 | Strongly over-supported | ×1.4 | DM dominates — may lack challenge |

---

## Why this matters

Support vs Drain reveals whether your Day Master is:

- **Carried** by a nurturing environment
- **Challenged** by demanding forces
- **Balanced** between give and take
- **Over-fed** with too much of the same energy

It answers the question:

> *"Is the world giving you more than it takes, or taking more than it gives?"*

This multiplier becomes the bridge between your rooted strength (Stage 2)
and your polarity fine-tuning (Stage 5), shaping the final Day Master
Strength score.

---

## The Five Relationships at a Glance

For any Day Master element, the Wu Xing cycle creates four relationships:

| DM Element | Parent (Resource) | Peer (Companion) | Child (Output) | Officer (Controller) |
|---|---|---|---|---|
| Wood | Water | Wood | Fire | Metal |
| Fire | Wood | Fire | Earth | Water |
| Earth | Fire | Earth | Metal | Wood |
| Metal | Earth | Metal | Water | Fire |
| Water | Metal | Water | Wood | Earth |

The **Parent** and **Peer** columns are Support.
The **Child** and **Officer** columns are Drain.
`;

function DayMasterStrengthPanel({ chart, qiMatrix, userTfq }) {
  const [showGauntletMd, setShowGauntletMd] = useState(false);
  const [showSupportDrainMd, setShowSupportDrainMd] = useState(false);
  if (!chart || !qiMatrix || !userTfq) return null;

  const dmElement = qiMatrix.dayMasterElement;
  const isYang = qiMatrix.dayMasterPolarity === 'Yang';
  const bd = qiMatrix.perPillarBreakdown;
  const bmb = chart.pillars[1]?.branch?.char;
  const sw = bmb ? getSeasonalWeights(bmb) : null;
  if (!sw || !bd || !dmElement) return null;

  // Build seasonal weights (capitalize keys)
  const seasonalWeights = {
    Wood: sw.wood ?? 1.0, Fire: sw.fire ?? 1.0, Earth: sw.earth ?? 1.0,
    Metal: sw.metal ?? 1.0, Water: sw.water ?? 1.0,
  };

  // Build pillar info for rooting
  const pillarDefs = [
    { label: 'Year',  bd: bd.year,  pillar: chart.pillars[0] },
    { label: 'Month', bd: bd.month, pillar: chart.pillars[1] },
    { label: 'Day',   bd: bd.day,   pillar: chart.pillars[2] },
    { label: 'Hour',  bd: bd.hour,  pillar: chart.pillars[3] },
  ];

  const pillars = pillarDefs.map(p => ({
    label: p.label,
    branchChar: p.pillar?.branch?.char || '',
    branchAnimal: p.pillar?.branch?.animal || '',
    hiddenStems: (p.bd?.hiddenStems || []).map(hs => ({
      element: hs.element,
      pct: hs.pct,
    })),
  }));

  // DM Stem Qi and Day Branch Qi from TFQ breakdown
  const polMults = isYang
    ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
    : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
  const sMult = seasonalWeights[dmElement] ?? 1.0;
  const pMult = polMults[dmElement] ?? 1.0;
  const dmStemQi = 1 * sMult * pMult * 0.35;  // Day Stem = 1pt raw
  // Day Branch contribution for DM element
  const dayBd = bd.day;
  const dmRawInBranch = (dayBd.raw[dmElement] || 0) - 1; // subtract the stem point
  const dmBranchQi = Math.max(0, dmRawInBranch) * sMult * pMult * 0.15;

  const result = computeDayMasterStrength({
    dmElement,
    isYang,
    tfqTotals: userTfq,
    dmStemQi,
    dmBranchQi,
    pillars,
    seasonalWeights,
  });

  const r = result;
  const elColor = ELEM_COLORS[dmElement] || '#fff';

  // Tier badge colors
  const tierBg = {
    Overweak: 'bg-red-900/30 border-red-500/40 text-red-300',
    Weak: 'bg-orange-900/30 border-orange-500/40 text-orange-300',
    Balanced: 'bg-green-900/30 border-green-500/40 text-green-300',
    Strong: 'bg-blue-900/30 border-blue-500/40 text-blue-300',
    Overstrong: 'bg-purple-900/30 border-purple-500/40 text-purple-300',
  };

  const Section = ({ title, extra, children }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">{title}</div>
        {extra}
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value, color, bold }) => (
    <div className="flex items-center justify-between text-[11px] font-mono">
      <span className="text-white/70">{label}</span>
      <span className={`${bold ? 'font-bold' : ''} ${!color ? 'text-white' : ''}`} style={color ? { color } : undefined}>{value}</span>
    </div>
  );

  const Highlight = ({ label, value }) => (
    <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 mt-1">
      <span className="text-white/80">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header with score */}
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: r.tierColor }}>{r.score.toFixed(0)}</div>
              <div className="text-[9px] text-white/50">/100</div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${tierBg[r.tier]}`}>
              {r.tier}
            </div>
            <div className="ml-1">
              <div className="text-sm font-semibold text-white">Day Master Strength</div>
              <div className="text-[10px] text-white/60 mt-0.5">
                <span style={{ color: elColor }} className="font-semibold">{isYang ? 'Yang' : 'Yin'} {dmElement}</span> — through the 6-stage gauntlet
              </div>
            </div>
          </div>
          <button onClick={() => setShowGauntletMd(prev => !prev)} className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20">MD</button>
        </div>
        {/* Score bar */}
        <div className="mt-3 h-3.5 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{
            width: `${r.score}%`,
            background: `linear-gradient(90deg, ${r.tierColor}88, ${r.tierColor})`,
          }} />
          {/* Tick marks at 20, 40, 60, 80 */}
          {[20, 40, 60, 80].map(t => (
            <div key={t} className="absolute top-0 bottom-0 w-px bg-white/30" style={{ left: `${t}%` }} />
          ))}
        </div>
        {/* Numeric marks */}
        <div className="relative mt-0.5 h-3" style={{ fontSize: 0 }}>
          {[0, 20, 40, 60, 80, 100].map(t => (
            <span key={t} className="absolute text-[9px] font-mono text-white/50 -translate-x-1/2" style={{ left: `${t}%` }}>{t}</span>
          ))}
        </div>
        {/* Tier labels */}
        <div className="flex mt-0.5">
          {[
            { label: 'Overweak', color: '#ef4444' },
            { label: 'Weak', color: '#f97316' },
            { label: 'Balanced', color: '#22c55e' },
            { label: 'Strong', color: '#3b82f6' },
            { label: 'Overstrong', color: '#a855f7' },
          ].map(t => (
            <span key={t.label} className="flex-1 text-center text-[10px] font-semibold" style={{ color: t.color + 'aa' }}>{t.label}</span>
          ))}
        </div>
      </div>

      {/* Qualitative AI-prompt statement — copyable */}
      {(() => {
        const scoreFmt = r.score.toFixed(0);
        const pol = isYang ? 'Yang' : 'Yin';
        const tierDescs = {
          Overweak: `an extremely weak ${pol} ${dmElement} Day Master (score ${scoreFmt}/100, Overweak tier). The DM barely registers in the chart — it is easily overwhelmed by surrounding elements and has almost no independent strength. This person needs significant external support, structured environments, and gentle reinforcement of their core element. They are highly sensitive to seasonal and environmental shifts.`,
          Weak: `a weak ${pol} ${dmElement} Day Master (score ${scoreFmt}/100, Weak tier). The DM is present but lacks sufficient support from the chart. This person tends toward passivity, may struggle with confidence and decisiveness, and benefits from environments and relationships that nurture and feed their core element. Resource (印) and Companion (比劫) elements are particularly helpful.`,
          Balanced: `a balanced ${pol} ${dmElement} Day Master (score ${scoreFmt}/100, Balanced tier). The DM has healthy support without being overpowered. This person can adapt to different situations, has a stable sense of self, and can both lead and collaborate effectively. No extreme remedies are needed — gentle seasonal adjustments are sufficient.`,
          Strong: `a strong ${pol} ${dmElement} Day Master (score ${scoreFmt}/100, Strong tier). The DM has ample support and tends to dominate the chart. This person is naturally assertive, confident, and self-directed, but may be stubborn or overbearing. Output (食伤) and Wealth (财) elements help channel excess strength productively.`,
          Overstrong: `an extremely strong ${pol} ${dmElement} Day Master (score ${scoreFmt}/100, Overstrong tier). The DM overpowers all other elements in the chart. This person has overwhelming self-energy that needs strong outlets — demanding careers, physical challenges, or creative expression. Without proper channeling, the excess manifests as rigidity, aggression, or isolation. Strong draining elements (Output, Wealth, Officer) are essential.`,
        };
        const desc = tierDescs[r.tier] || '';
        const fullStatement = `This person has ${desc}`;
        return (
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">AI-Ready Statement</span>
              <button
                onClick={() => { navigator.clipboard.writeText(fullStatement); }}
                className="text-[9px] px-2 py-0.5 rounded border border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="text-[10px] text-white/70 leading-relaxed bg-white/[0.03] rounded-lg p-2.5 border border-white/5 font-sans">
              {fullStatement}
            </div>
          </div>
        );
      })()}

      <div className="p-4 space-y-4">
        {/* Stage 1: Base DM Qi */}
        <Section title="Stage 1 — Base Day Master Qi">
          <Row label="Day Stem Qi (1pt × season × polarity × 0.35)" value={r.dmStemQi.toFixed(4)} color={elColor} />
          <Row label="Day Branch Qi (hidden stem × season × polarity × 0.15)" value={r.dmBranchQi.toFixed(4)} color={elColor} />
          <Row label={`Day Branch weight (α)`} value={r.dayBranchWeight.toFixed(1)} />
          <Highlight label={`Base DM Qi = ${r.dmStemQi.toFixed(4)} + ${r.dayBranchWeight} × ${r.dmBranchQi.toFixed(4)}`} value={r.baseDMQi.toFixed(4)} />
        </Section>

        {/* Stage 2: Rooting */}
        <Section title={`Stage 2 — Rooting (looking for ${dmElement} in all branches)`}>
          <div className="text-[9px] text-white/60 mb-1">
            Scan every branch for {dmElement} in its hidden stems. If present → that branch is a root.
          </div>
          <div className="text-[9px] font-mono text-white/50 mb-2 px-2 py-1 rounded bg-white/[0.03] border border-white/8">
            Formula per branch: <span className="text-white/80">P = w<sub>pillar</sub> × S<sub>month</sub></span> &nbsp;(only if {dmElement} is present; 0 otherwise)
          </div>

          {/* Season factor callout */}
          <div className="text-[9px] font-mono text-white/60 mb-2">
            S<sub>month</sub> ({dmElement} in {chart.pillars[1]?.branch?.animal || 'month'}) = <span className="text-white font-bold">{r.rootingDetails[0]?.seasonFactor.toFixed(1)}</span>
          </div>

          <div className="space-y-2.5">
            {r.rootingDetails.map((rd, idx) => {
              const pillarHiddenStems = pillars[idx]?.hiddenStems || [];
              const wLabel = `w_${rd.pillar.toLowerCase()}`;
              return (
                <div key={rd.pillar} className={`rounded-lg border px-3 py-2 ${rd.hasRoot ? 'border-green-500/20 bg-green-900/[0.06]' : 'border-white/8 bg-white/[0.02]'}`}>
                  {/* Pillar header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold ${rd.pillar === 'Month' ? 'text-pink-300' : rd.pillar === 'Day' ? 'text-amber-300' : 'text-white/80'}`}>
                        {rd.pillar} Branch
                      </span>
                      <span className="text-[11px] text-white/70">— {rd.branchChar} {rd.branchAnimal}</span>
                    </div>
                    {rd.hasRoot ? (
                      <span className="text-[9px] font-bold text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded">ROOT</span>
                    ) : (
                      <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">no root</span>
                    )}
                  </div>

                  {/* Hidden stems breakdown */}
                  <div className="text-[9px] text-white/50 mb-1">Hidden stems:</div>
                  <div className="flex gap-1.5 mb-2">
                    {pillarHiddenStems.map((hs, hi) => (
                      <div
                        key={hi}
                        className={`flex-1 text-center text-[10px] font-mono rounded px-1 py-1 border ${
                          hs.element === dmElement
                            ? 'border-green-500/50 bg-green-900/30 font-bold ring-1 ring-green-500/30'
                            : 'border-white/8 bg-white/[0.03] text-white/50'
                        }`}
                      >
                        <div style={hs.element === dmElement ? { color: elColor } : undefined}>{hs.element}</div>
                        <div className={hs.element === dmElement ? 'text-green-300' : 'text-white/40'}>{hs.pct}%</div>
                        {hs.element === dmElement && (
                          <div className="text-[7px] text-green-400 mt-0.5">← DM</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Baby-step calculation */}
                  {rd.hasRoot ? (
                    <div className="text-[10px] font-mono space-y-0.5 border-t border-white/8 pt-1.5 mt-1">
                      <div className="flex justify-between text-white/60">
                        <span>Step 1: {dmElement} present?</span>
                        <span className="text-green-400 font-bold">YES ({rd.hiddenStemPct}%)</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Step 2: Branch weight ({wLabel})</span>
                        <span className="text-white">{rd.pillarWeight}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Step 3: Season factor (S<sub>month</sub>)</span>
                        <span className="text-white">{rd.seasonFactor.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold bg-white/5 rounded px-1 py-0.5 mt-0.5">
                        <span>P<sub>{rd.pillar.toLowerCase()}</sub> = {rd.pillarWeight} × {rd.seasonFactor.toFixed(1)}</span>
                        <span>= {rd.points.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono border-t border-white/8 pt-1.5 mt-1">
                      <div className="flex justify-between text-white/40">
                        <span>{dmElement} present?</span>
                        <span>NO → P<sub>{rd.pillar.toLowerCase()}</sub> = 0</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summation line */}
          <div className="mt-3 px-2 py-1.5 rounded bg-white/[0.03] border border-white/10 text-[10px] font-mono">
            <div className="text-white/70 mb-1">
              P<sub>total</sub> = {r.rootingDetails.map(rd => `P_${rd.pillar.toLowerCase()}`).join(' + ')}
            </div>
            <div className="text-white font-bold">
              P<sub>total</sub> = {r.rootingDetails.map(rd => rd.points.toFixed(2)).join(' + ')} = {r.rootingPointsTotal.toFixed(2)}
            </div>
          </div>

          {/* Score mapping */}
          <div className="mt-2 space-y-0.5">
            <Row label={`P_total ${r.rootingPointsTotal.toFixed(2)} → Rooting score`} value={`${r.rootingScore}/3 (${r.rootingLabel})`} bold />
            <Row label={`Rooting score ${r.rootingScore} → M_root`} value={`×${r.rootingMultiplier.toFixed(1)}`} bold />
          </div>
          <Highlight label={`DM Qi after rooting = ${r.baseDMQi.toFixed(4)} × ${r.rootingMultiplier.toFixed(1)}`} value={r.dmQiAfterRooting.toFixed(4)} />
        </Section>

        {/* Stage 3: Seasonality */}
        <Section title="Stage 3 — Seasonality (Month Branch vs DM Element)">
          <Row label={`${dmElement} expressiveness E (in ${chart.pillars[1]?.branch?.animal || 'month'})`} value={r.seasonalExpressiveness.toFixed(1)} color={elColor} />
          <Row label="Seasonal multiplier S = 0.8 + 0.4 × (E − 0.2) / 0.8" value={`×${r.seasonalMultiplier.toFixed(2)}`} />
          <Highlight label={`DM Qi after season = ${r.dmQiAfterRooting.toFixed(4)} × ${r.seasonalMultiplier.toFixed(2)}`} value={r.dmQiAfterSeason.toFixed(4)} />
        </Section>

        {/* Stage 4: Support vs Drain */}
        <Section
          title="Stage 4 — Support vs Drain"
          extra={<button onClick={() => setShowSupportDrainMd(prev => !prev)} className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20">MD</button>}
        >
          {/* Educational intro */}
          <div className="text-[10px] text-white/80 mb-2">
            Is the chart environment strengthening or weakening {isYang ? 'Yang' : 'Yin'} {dmElement}?
            We evaluate total Qi from elements that <span className="text-green-400">support</span> (<span className="text-white/60">生我</span> Resource + <span className="text-white/60">比劫</span> Companion) vs <span className="text-red-400">drain</span> (<span className="text-white/60">我生</span> Output + <span className="text-white/60">克我</span> Controller) the Day Master.
          </div>

          {/* Wu Xing relationship diagram */}
          <div className="text-[10px] font-mono px-2.5 py-2 rounded bg-white/[0.03] border border-white/10 mb-3">
            <div className="text-white/80 font-semibold mb-1.5">Wu Xing relationships for {dmElement}:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <span className="text-green-400">{r.supportDrain.generatorElement}</span>
                <span className="text-white/60"> → generates → </span>
                <span style={{ color: elColor }} className="font-bold">{dmElement}</span>
                <span className="text-white/70"> — Parent</span>
                <span className="text-white/40 text-[8px] ml-1">生我</span>
              </div>
              <div>
                <span style={{ color: elColor }} className="font-bold">{dmElement}</span>
                <span className="text-white/60"> → produces → </span>
                <span className="text-red-400">{r.supportDrain.childElement}</span>
                <span className="text-white/70"> — Child</span>
                <span className="text-white/40 text-[8px] ml-1">我生</span>
              </div>
              <div>
                <span style={{ color: elColor }} className="font-bold">{dmElement}</span>
                <span className="text-white/60"> = same element </span>
                <span className="text-green-400"> — Peer</span>
                <span className="text-white/40 text-[8px] ml-1">比劫</span>
              </div>
              <div>
                <span className="text-red-400">{r.supportDrain.controllerElement}</span>
                <span className="text-white/60"> → controls → </span>
                <span style={{ color: elColor }} className="font-bold">{dmElement}</span>
                <span className="text-white/70"> — Officer</span>
                <span className="text-white/40 text-[8px] ml-1">克我</span>
              </div>
            </div>
          </div>

          {/* Support vs Drain columns */}
          <div className="grid grid-cols-2 gap-x-3 text-[10px] font-mono">
            <div className="rounded-lg border border-green-500/20 bg-green-900/[0.06] px-2.5 py-2">
              <div className="text-[10px] text-green-400 font-bold mb-1.5">Supportive Qi <span className="text-white/40 font-normal text-[8px]">生我 + 比劫</span></div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/90">{r.supportDrain.generatorElement} <span className="text-white/60">(Resource — generates {dmElement})</span></span>
                  <span style={{ color: ELEM_COLORS[r.supportDrain.generatorElement] }} className="font-bold">{(userTfq[r.supportDrain.generatorElement] || 0).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90">{r.dmElement} <span className="text-white/60">(Companion — same element)</span></span>
                  <span style={{ color: ELEM_COLORS[r.dmElement] }} className="font-bold">{(userTfq[r.dmElement] || 0).toFixed(3)}</span>
                </div>
              </div>
              <div className="flex justify-between mt-1.5 pt-1.5 border-t border-green-500/20 font-bold text-green-300">
                <span>Support Qi</span>
                <span>{r.supportDrain.supportQi.toFixed(3)}</span>
              </div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-900/[0.06] px-2.5 py-2">
              <div className="text-[10px] text-red-400 font-bold mb-1.5">Draining Qi <span className="text-white/40 font-normal text-[8px]">我生 + 克我</span></div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/90">{r.supportDrain.childElement} <span className="text-white/60">(Output — {dmElement} produces it)</span></span>
                  <span style={{ color: ELEM_COLORS[r.supportDrain.childElement] }} className="font-bold">{(userTfq[r.supportDrain.childElement] || 0).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90">{r.supportDrain.controllerElement} <span className="text-white/60">(Controller — restrains {dmElement})</span></span>
                  <span style={{ color: ELEM_COLORS[r.supportDrain.controllerElement] }} className="font-bold">{(userTfq[r.supportDrain.controllerElement] || 0).toFixed(3)}</span>
                </div>
              </div>
              <div className="flex justify-between mt-1.5 pt-1.5 border-t border-red-500/20 font-bold text-red-300">
                <span>Drain Qi</span>
                <span>{r.supportDrain.drainQi.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* R_SD calculation */}
          <div className="mt-3 text-[10px] font-mono">
            <div className="flex justify-between text-white/90">
              <span>R_SD = Support / Drain = {r.supportDrain.supportQi.toFixed(3)} / {r.supportDrain.drainQi.toFixed(3)}</span>
              <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span>
            </div>
          </div>

          {/* R_SD visual scale with all tiers */}
          {(() => {
            const sdTiers = [
              { max: 0.7, label: 'Severely drained', mult: 0.7, color: '#ef4444', desc: 'DM is overwhelmed — needs rescue' },
              { max: 1.0, label: 'Slightly drained',  mult: 0.9, color: '#f97316', desc: 'DM is under pressure but functioning' },
              { max: 1.3, label: 'Balanced',           mult: 1.0, color: '#22c55e', desc: 'Healthy equilibrium — ideal zone' },
              { max: 1.8, label: 'Well supported',     mult: 1.2, color: '#3b82f6', desc: 'DM has a strong safety net' },
              { max: 3.5, label: 'Strongly over-supported', mult: 1.4, color: '#a855f7', desc: 'DM dominates — may lack challenge' },
            ];
            // Map R_SD to 0-100% position on scale (scale caps at 3.5)
            const scaleMax = 3.5;
            const markerPct = Math.min(r.supportDrain.ratioSD / scaleMax * 100, 100);
            const activeTier = sdTiers.find((t, i) => r.supportDrain.ratioSD < t.max || i === sdTiers.length - 1);

            return (
              <div className="mt-2">
                {/* Scale bar */}
                <div className="relative h-3 rounded-full overflow-hidden flex">
                  {sdTiers.map((t, i) => {
                    const prevMax = i === 0 ? 0 : sdTiers[i - 1].max;
                    const widthPct = ((t.max > scaleMax ? scaleMax : t.max) - prevMax) / scaleMax * 100;
                    return (
                      <div key={i} className="h-full" style={{
                        width: `${widthPct}%`,
                        backgroundColor: t.color + '40',
                        borderRight: i < sdTiers.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                      }} />
                    );
                  })}
                  {/* Marker for current R_SD */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${markerPct}%` }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-white/25 rounded px-1">
                      {r.supportDrain.ratioSD.toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* Scale labels */}
                <div className="flex mt-0.5">
                  {sdTiers.map((t, i) => {
                    const prevMax = i === 0 ? 0 : sdTiers[i - 1].max;
                    const widthPct = ((t.max > scaleMax ? scaleMax : t.max) - prevMax) / scaleMax * 100;
                    return (
                      <div key={i} className="text-center text-[8px] font-semibold font-mono" style={{ width: `${widthPct}%`, color: t.color }}>
                        {t.label}
                      </div>
                    );
                  })}
                </div>

                {/* Tier reference table */}
                <div className="mt-2 rounded border border-white/10 overflow-hidden">
                  <div className="grid grid-cols-[auto_auto_1fr] text-[10px] font-mono">
                    {sdTiers.map((t, i) => {
                      const prevMax = i === 0 ? 0 : sdTiers[i - 1].max;
                      const isActive = activeTier === t;
                      return (
                        <React.Fragment key={i}>
                          <div className={`px-2 py-1 border-b border-white/5 ${isActive ? 'bg-white/10 font-bold' : ''}`} style={{ color: t.color }}>
                            {i === sdTiers.length - 1 ? `≥ ${prevMax.toFixed(1)}` : `${prevMax.toFixed(1)} – ${t.max.toFixed(1)}`}
                          </div>
                          <div className={`px-2 py-1 border-b border-white/5 ${isActive ? 'bg-white/10 font-bold text-white' : 'text-white/70'}`}>
                            ×{t.mult}
                          </div>
                          <div className={`px-2 py-1 border-b border-white/5 ${isActive ? 'bg-white/10 text-white' : 'text-white/60'}`}>
                            {isActive ? '→ ' : ''}{t.desc}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Category result */}
          <div className="mt-2">
            <Row label={`Category: ${r.supportDrain.category}`} value={`×${r.supportDrain.multiplier.toFixed(1)}`} bold />
          </div>

          {/* Interpretation */}
          <div className="mt-2 text-[10px] text-white/80 px-2 py-1.5 rounded bg-white/[0.03] border border-white/10">
            {r.supportDrain.ratioSD >= 1.8 ? (
              <span>R_SD of <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span> means {dmElement} is heavily reinforced by its environment.
                The DM has more help than resistance — this amplifies strength by <span className="text-white font-bold">×{r.supportDrain.multiplier.toFixed(1)}</span>.
                In practice: {isYang ? 'Yang' : 'Yin'} {dmElement} can handle output demands easily, but may lack the friction that drives growth.</span>
            ) : r.supportDrain.ratioSD >= 1.3 ? (
              <span>R_SD of <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span> means {dmElement} has a healthy safety net.
                Support exceeds drain — the DM gets a <span className="text-white font-bold">×{r.supportDrain.multiplier.toFixed(1)}</span> boost.
                In practice: {isYang ? 'Yang' : 'Yin'} {dmElement} is well-resourced and resilient.</span>
            ) : r.supportDrain.ratioSD >= 1.0 ? (
              <span>R_SD of <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span> means {dmElement} is in equilibrium.
                Support and drain are roughly balanced — the DM passes through unchanged at <span className="text-white font-bold">×{r.supportDrain.multiplier.toFixed(1)}</span>.
                In practice: {isYang ? 'Yang' : 'Yin'} {dmElement} flows naturally with the chart.</span>
            ) : r.supportDrain.ratioSD >= 0.7 ? (
              <span>R_SD of <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span> means {dmElement} is under moderate pressure.
                Drain slightly exceeds support — the DM is dampened by <span className="text-white font-bold">×{r.supportDrain.multiplier.toFixed(1)}</span>.
                In practice: {isYang ? 'Yang' : 'Yin'} {dmElement} must work harder to express itself.</span>
            ) : (
              <span>R_SD of <span className="text-white font-bold">{r.supportDrain.ratioSD.toFixed(2)}</span> means {dmElement} is overwhelmed.
                The chart environment drains far more than it supports — the DM is severely reduced at <span className="text-white font-bold">×{r.supportDrain.multiplier.toFixed(1)}</span>.
                In practice: {isYang ? 'Yang' : 'Yin'} {dmElement} struggles to maintain presence and needs remedial support.</span>
            )}
          </div>

          <Highlight label={`DM Qi after support = ${r.dmQiAfterSeason.toFixed(4)} × ${r.supportDrain.multiplier.toFixed(1)}`} value={r.dmQiAfterSupport.toFixed(4)} />
        </Section>

        {/* Stage 5: Polarity */}
        <Section title={`Stage 5 — Polarity Fine-Tuning (${isYang ? 'Yang' : 'Yin'})`}>
          <Row label="Deviation D = R_SD − 1.0" value={r.polarity.deviation.toFixed(2)} />
          <Row label={`P = ${isYang ? '+1 (Yang)' : '−1 (Yin)'}, k = ${r.polarity.k}`} value="" />
          <Row label={`M_pol = 1 + P×k×D = 1 + ${r.polarity.P}×${r.polarity.k}×${r.polarity.deviation.toFixed(2)}`} value={r.polarity.rawMultiplier.toFixed(3)} />
          <Row label="Clamped [0.85, 1.15]" value={`×${r.polarity.multiplier.toFixed(3)}`} bold />
          <Highlight label={`DM Qi after polarity = ${r.dmQiAfterSupport.toFixed(4)} × ${r.polarity.multiplier.toFixed(3)}`} value={r.dmQiAfterPolarity.toFixed(4)} />
        </Section>

        {/* Stage 6: Final Score */}
        <Section title="Stage 6 — Final Strength">
          <Row label="Qi normalization constant" value={r.qiNorm.toFixed(1)} />
          <Row label={`Score = (${r.dmQiAfterPolarity.toFixed(4)} / ${r.qiNorm.toFixed(1)}) × 100`} value={r.score.toFixed(1)} bold />
          <div className="flex items-center justify-center gap-3 mt-2 py-2 rounded-lg border" style={{ borderColor: r.tierColor + '40', backgroundColor: r.tierColor + '10' }}>
            <span className="text-3xl font-black" style={{ color: r.tierColor }}>{r.score.toFixed(0)}</span>
            <div>
              <div className="text-sm font-bold" style={{ color: r.tierColor }}>{r.tier}</div>
              <div className="text-[9px] text-white/60">Day Master Strength</div>
            </div>
          </div>
        </Section>
      </div>
      {showGauntletMd && (
        <FloatingMdWindow
          content={DMS_GAUNTLET_MD}
          title="Day Master Strength — 6-Stage Gauntlet Reference"
          onClose={() => setShowGauntletMd(false)}
        />
      )}
      {showSupportDrainMd && (
        <FloatingMdWindow
          content={SUPPORT_DRAIN_MD}
          title="Stage 4 — Support vs Drain Guide"
          onClose={() => setShowSupportDrainMd(false)}
        />
      )}
    </div>
  );
}


// ============================================================================
// TEN GODS CAREER PANEL — How DM Strength shapes career through Ten Gods
// ============================================================================

const TEN_GODS_CAREER_MD = `# Ten Gods — Career Profile Guide

## What are the Ten Gods?

The **Ten Gods** (十神) describe how every element in your chart relates to your
Day Master. There are five relationship categories, each split into Yin/Yang pairs
to make ten gods total.

---

## The Five Categories

### Output (食伤) — What you create
*DM produces this element*

| God | Chinese | Archetype | Career themes |
|---|---|---|---|
| Eating God | 食神 | The Artist | Arts, food, hospitality, gentle creativity |
| Hurting Officer | 伤官 | The Rebel | Performance, innovation, media, bold expression |

**Strong DM** → Output becomes productive and expressive — talent flows easily.
**Weak DM** → Output drains energy — creativity feels exhausting.

---

### Wealth (财) — What you control
*DM controls this element*

| God | Chinese | Archetype | Career themes |
|---|---|---|---|
| Direct Wealth | 正财 | The Banker | Finance, accounting, real estate, steady income |
| Indirect Wealth | 偏财 | The Networker | Sales, speculation, networking, multiple streams |

**Strong DM** → Wealth is manageable and profitable.
**Weak DM** → Wealth becomes draining — money slips away.

---

### Officer (官杀) — What controls you
*This element controls DM*

| God | Chinese | Archetype | Career themes |
|---|---|---|---|
| Direct Officer | 正官 | The Magistrate | Management, law, governance, civil service |
| Seven Killings | 七杀 | The Warrior | Military, surgery, trading, crisis management |

**Strong DM** → Officer brings recognition and leadership opportunities.
**Weak DM** → Officer becomes oppressive — pressure overwhelms.

---

### Resource (印) — What generates you
*This element produces DM*

| God | Chinese | Archetype | Career themes |
|---|---|---|---|
| Direct Resource | 正印 | The Teacher | Education, healthcare, academia, mentoring |
| Indirect Resource | 偏印 | The Mystic | Research, psychology, technology, esoteric fields |

**Strong DM** → Resource stabilizes and supports growth.
**Weak DM** → Resource is desperately needed — seek mentors and learning.

---

### Companion (比劫) — Your peers
*Same element as DM*

| God | Chinese | Archetype | Career themes |
|---|---|---|---|
| Friend | 比肩 | The Competitor | Entrepreneurship, athletics, consulting |
| Rob Wealth | 劫财 | The Gambler | High-risk ventures, negotiation, speculation |

**Strong DM** → Companion becomes teamwork and healthy competition.
**Weak DM** → Companion becomes rivalry and resource conflict.

---

## How DM Strength Modifies Career

| DM Strength | Career Behavior |
|---|---|
| **Overweak (0–20)** | Needs structured, supportive environments. Avoids high-pressure roles. |
| **Weak (20–40)** | Thrives with mentorship and steady growth. Advisory and support roles. |
| **Balanced (40–60)** | Flexible — adapts to both creative and structured careers naturally. |
| **Strong (60–80)** | Handles pressure, output, and leadership. Built for demanding careers. |
| **Overstrong (80–100)** | Dominates — needs challenges and outlets to avoid stagnation. |

---

## Career Fit Score (1–5 stars)

The star rating combines Ten God Qi strength with DM Strength:
- Strong DM + Strong Ten God Qi = high career fit (the DM can use this energy)
- Weak DM + Strong Ten God Qi = moderate fit (energy present but hard to harness)
- Any DM + Very Weak Ten God Qi = low fit (energy simply isn't there)
`;

// Category → Ten God IDs mapping
const TG_CATEGORY_MAP = {
  output:    { label: 'Output',    chinese: '食伤', color: '#a855f7', icon: '🎭', ids: ['EG', 'HO'], desc: 'What you create' },
  wealth:    { label: 'Wealth',    chinese: '财',   color: '#f59e0b', icon: '💰', ids: ['DW', 'IW'], desc: 'What you control' },
  authority: { label: 'Officer',   chinese: '官杀', color: '#ef4444', icon: '🏛️', ids: ['DO', '7K'], desc: 'What controls you' },
  resource:  { label: 'Resource',  chinese: '印',   color: '#22c55e', icon: '📚', ids: ['DR', 'IR'], desc: 'What generates you' },
  companion: { label: 'Companion', chinese: '比劫', color: '#3b82f6', icon: '🤝', ids: ['F', 'RW'],  desc: 'Your peers' },
};

// Wu Xing: category → element for a given DM
function getCategoryElement(dmElement, category) {
  const PRODUCE = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const CONTROL = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };
  const CONTROLLED_BY = { Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth' };
  const PRODUCED_BY = { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' };
  switch (category) {
    case 'output': return PRODUCE[dmElement];
    case 'wealth': return CONTROL[dmElement];
    case 'authority': return CONTROLLED_BY[dmElement];
    case 'resource': return PRODUCED_BY[dmElement];
    case 'companion': return dmElement;
    default: return dmElement;
  }
}

function classifyTenGodStrength(qi) {
  if (qi < 0.2) return { label: 'Very Weak', color: '#ef4444' };
  if (qi < 0.5) return { label: 'Weak', color: '#f97316' };
  if (qi < 1.0) return { label: 'Moderate', color: '#eab308' };
  if (qi < 1.5) return { label: 'Strong', color: '#22c55e' };
  return { label: 'Very Strong', color: '#a855f7' };
}

function getCareerFitScore(qi, dmScore) {
  const strong = dmScore >= 60;
  const base = qi < 0.2 ? 1 : qi < 0.5 ? 2 : qi < 1.0 ? 3 : qi < 1.5 ? 4 : 5;
  return strong ? base : Math.max(1, base - 1);
}

function getDmInteraction(category, dmScore) {
  const strong = dmScore >= 60;
  const interactions = {
    output:    [strong ? 'Output becomes productive and expressive — talent flows.' : 'Output drains energy — creativity feels exhausting.'],
    wealth:    [strong ? 'Wealth is manageable and profitable.' : 'Wealth becomes draining — hard to hold onto gains.'],
    authority: [strong ? 'Officer brings leadership and recognition.' : 'Officer becomes oppressive — pressure overwhelms.'],
    resource:  [strong ? 'Resource stabilizes and supports growth.' : 'Resource is desperately needed — seek mentors.'],
    companion: [strong ? 'Companion becomes teamwork and collaboration.' : 'Companion becomes rivalry and conflict.'],
  };
  return (interactions[category] || [''])[0];
}

function TenGodsCareerPanel({ chart, qiMatrix, userTfq, dmStrengthScore }) {
  const [showTenGodsMd, setShowTenGodsMd] = useState(false);
  if (!chart || !qiMatrix || !userTfq) return null;

  const dmElement = qiMatrix.dayMasterElement;
  const isYang = qiMatrix.dayMasterPolarity === 'Yang';
  const dmLabel = `${isYang ? 'Yang' : 'Yin'} ${dmElement}`;
  const score = dmStrengthScore || 50;

  // Build per-category data
  const categories = Object.entries(TG_CATEGORY_MAP).map(([catKey, cat]) => {
    const el = getCategoryElement(dmElement, catKey);
    const qi = userTfq[el] || 0;
    const strength = classifyTenGodStrength(qi);
    const fitScore = getCareerFitScore(qi, score);
    const interaction = getDmInteraction(catKey, score);

    // Get library entries for the two gods in this category
    const gods = cat.ids.map(id => TEN_GOD_LIBRARY.find(g => g.id === id)).filter(Boolean);

    return { ...cat, catKey, el, qi, strength, fitScore, interaction, gods };
  });

  // Sort by Qi desc for summary
  const sorted = [...categories].sort((a, b) => b.qi - a.qi);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const weakest = sorted[sorted.length - 1];

  // ── DM Strength × Ten God Archetype Classifier ──
  const dmBand = score < 20 ? 'Overweak' : score < 40 ? 'Weak' : score < 60 ? 'Balanced' : score < 80 ? 'Strong' : 'Overstrong';
  const archetype = (() => {
    const t1 = top1.catKey;
    const isWeak = score < 40;
    const isStrong = score >= 60;
    // Weak DM archetypes — success through external support
    if (isWeak && t1 === 'output')    return { name: 'The Supported Prodigy', icon: '🌟', color: '#a855f7', desc: 'Weak DM + dominant Output = extraordinary talent that explodes with coaching, sponsorship, and institutional backing. Not self-powered — externally fueled. Elite athletes, child prodigies, sponsored performers.', strengths: ['Highly coachable', 'Absorbs training rapidly', 'Thrives with structure', 'Performs under pressure'], needs: ['Mentors & coaches', 'Institutional support', 'Structured environments', 'External validation'] };
    if (isWeak && t1 === 'resource')  return { name: 'The Eternal Student', icon: '📚', color: '#22c55e', desc: 'Weak DM + dominant Resource = a person who grows through learning, mentorship, and accumulation of knowledge. Scholars, researchers, lifelong learners who build expertise over decades.', strengths: ['Deep learning ability', 'Patient growth', 'Knowledge retention', 'Mentor magnetism'], needs: ['Time to develop', 'Patient mentors', 'Academic environments', 'Intellectual freedom'] };
    if (isWeak && t1 === 'companion') return { name: 'The Pack Runner', icon: '🤝', color: '#3b82f6', desc: 'Weak DM + dominant Companion = strength through alliance, partnership, and collective action. Team athletes, co-founders, ensemble performers who shine brightest in groups.', strengths: ['Team synergy', 'Loyalty', 'Collaborative instinct', 'Peer motivation'], needs: ['Strong partners', 'Team environments', 'Shared goals', 'Collective identity'] };
    if (isWeak && t1 === 'authority') return { name: 'The Reluctant Leader', icon: '🏛️', color: '#ef4444', desc: 'Weak DM + dominant Officer = thrust into authority by circumstance, not ambition. Leaders who emerge through crisis, duty, or institutional need rather than personal drive.', strengths: ['Duty-driven', 'Responsive to pressure', 'Institutional awareness', 'Crisis leadership'], needs: ['Clear mandate', 'Institutional backing', 'Strong advisors', 'Structured authority'] };
    if (isWeak && t1 === 'wealth')    return { name: 'The Lucky Channel', icon: '💫', color: '#f59e0b', desc: 'Weak DM + dominant Wealth = wealth flows through this person, not from them. Brand ambassadors, lottery winners, inheritance receivers, influencers who attract money through presence.', strengths: ['Wealth magnetism', 'Brand appeal', 'Social capital', 'Opportunity attraction'], needs: ['Financial advisors', 'Wealth managers', 'Stable partners', 'Spending discipline'] };
    // Strong DM archetypes — self-powered engines
    if (isStrong && t1 === 'output')    return { name: 'The Creative Powerhouse', icon: '🔥', color: '#ef4444', desc: 'Strong DM + dominant Output = raw creative force that produces at scale. Prolific artists, high-output entrepreneurs, performers who generate endlessly without burnout.', strengths: ['Prolific output', 'Stamina', 'Creative endurance', 'Self-driven production'], needs: ['Creative outlets', 'Audience', 'Channels for output', 'Avoid stagnation'] };
    if (isStrong && t1 === 'resource')  return { name: 'The Grounded Sage', icon: '🌳', color: '#22c55e', desc: 'Strong DM + dominant Resource = deeply rooted wisdom combined with the strength to teach and lead. Master practitioners, senior mentors, institutional builders.', strengths: ['Deep expertise', 'Teaching ability', 'Institutional trust', 'Patient authority'], needs: ['Avoid over-support', 'Seek challenges', 'Share knowledge', 'Prevent stagnation'] };
    if (isStrong && t1 === 'companion') return { name: 'The Alpha Competitor', icon: '⚔️', color: '#f97316', desc: 'Strong DM + dominant Companion = fierce independence and competitive drive. Solo entrepreneurs, competitive athletes, self-made leaders who dominate through sheer force of will.', strengths: ['Independence', 'Competitive fire', 'Self-reliance', 'Leadership presence'], needs: ['Worthy rivals', 'Clear goals', 'Avoid isolation', 'Channel aggression'] };
    if (isStrong && t1 === 'authority') return { name: 'The Natural Commander', icon: '👑', color: '#a855f7', desc: 'Strong DM + dominant Officer = born leader who thrives under authority and pressure. CEOs, military commanders, political leaders who naturally assume control.', strengths: ['Authority presence', 'Pressure tolerance', 'Decision making', 'Institutional leadership'], needs: ['Positions of power', 'Clear hierarchy', 'Respect from peers', 'Legacy building'] };
    if (isStrong && t1 === 'wealth')    return { name: 'The Empire Builder', icon: '🏗️', color: '#f59e0b', desc: 'Strong DM + dominant Wealth = the capacity to control, manage, and multiply resources at scale. Tycoons, investors, business moguls who build lasting wealth structures.', strengths: ['Resource management', 'Business acumen', 'Deal-making', 'Long-term vision'], needs: ['Investment opportunities', 'Financial growth', 'Strategic partners', 'Avoid hoarding'] };
    // Balanced DM — adaptive
    if (t1 === 'output')    return { name: 'The Versatile Creator', icon: '🎨', color: '#a855f7', desc: 'Balanced DM + strong Output = flexible creativity that adapts to any medium. Multi-disciplinary artists, portfolio careerists, adaptive performers.', strengths: ['Adaptability', 'Multi-talent', 'Creative flexibility', 'Balanced expression'], needs: ['Variety', 'Multiple outlets', 'Avoid over-specialization', 'Cross-pollination'] };
    if (t1 === 'resource')  return { name: 'The Adaptive Learner', icon: '🔬', color: '#22c55e', desc: 'Balanced DM + strong Resource = steady growth through continuous learning. Career changers, interdisciplinary thinkers, late bloomers.', strengths: ['Continuous growth', 'Cross-domain thinking', 'Resilient learning', 'Practical wisdom'], needs: ['New challenges', 'Diverse inputs', 'Mentorship both ways', 'Applied learning'] };
    return { name: 'The Adaptive Navigator', icon: '🧭', color: '#3b82f6', desc: 'Balanced DM with no extreme Ten God dominance = maximum flexibility. Generalists, portfolio careerists, people who thrive by reading the environment and adapting.', strengths: ['Flexibility', 'Environmental reading', 'Balanced judgment', 'Steady growth'], needs: ['Diverse opportunities', 'Room to explore', 'Avoid narrow specialization', 'Periodic reinvention'] };
  })();

  // Auto-generate career summary
  const dmLine = score >= 60
    ? `With a Strong Day Master (${score.toFixed(0)}), this chart handles pressure, output, and responsibility with ease.`
    : score < 40
    ? `With a weaker Day Master (${score.toFixed(0)}), this chart thrives in supportive, structured environments.`
    : `With a Balanced Day Master (${score.toFixed(0)}), this chart adapts well to varied career environments.`;
  const summaryText = `${dmLine} The strongest career indicator is ${top1.label} (${top1.chinese}), pointing toward ${top1.gods.map(g => g.archetype.replace('The ', '')).join(' and ')} roles. The second influence is ${top2.label} (${top2.chinese}), adding ${top2.gods.map(g => g.archetype.replace('The ', '')).join(' and ')} energy.`;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mt-4">
      {/* Header */}
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Ten Gods — Career Profile</div>
            <div className="text-[10px] text-white/80 mt-0.5">
              <span style={{ color: ELEM_COLORS[dmElement] }} className="font-semibold">{dmLabel}</span> — DM Strength {score} · How career forces behave in this chart
            </div>
          </div>
          <button onClick={() => setShowTenGodsMd(prev => !prev)} className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20">MD</button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Category cards */}
        {categories.map(cat => (
          <div key={cat.catKey} className="rounded-lg border border-white/8 bg-white/[0.02] overflow-hidden">
            {/* Category header */}
            <div className="px-3 py-2 flex items-center justify-between" style={{ borderLeft: `3px solid ${cat.color}` }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-white">{cat.label}</span>
                    <span className="text-[9px] text-white/60">{cat.chinese}</span>
                    <span className="text-[10px] text-white/70">— {cat.desc}</span>
                  </div>
                  <div className="text-[10px] text-white/80">
                    Element: <span style={{ color: ELEM_COLORS[cat.el] }} className="font-semibold">{cat.el}</span> · Qi: <span className="text-white font-bold">{cat.qi.toFixed(3)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Strength badge */}
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: cat.strength.color, backgroundColor: cat.strength.color + '20', border: `1px solid ${cat.strength.color}40` }}>
                  {cat.strength.label}
                </span>
                {/* Star rating */}
                <div className="flex text-[10px]" style={{ color: '#fbbf24' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < cat.fitScore ? '' : 'opacity-20'}>{i < cat.fitScore ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gods detail */}
            <div className="px-3 py-2 border-t border-white/5">
              <div className="grid grid-cols-2 gap-2 mb-1.5">
                {cat.gods.map(g => (
                  <div key={g.id} className="text-[10px] font-mono rounded px-2 py-1.5 bg-white/[0.03] border border-white/8">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-white font-bold">{g.name}</span>
                      <span className="text-white/60">{g.nameZh}</span>
                    </div>
                    <div className="text-white/70">{g.archetype} · {g.overview.split('.')[0]}</div>
                  </div>
                ))}
              </div>
              {/* Career roles */}
              <div className="text-[10px] text-white/80 mb-1">
                <span className="text-white/60">Careers: </span>
                {cat.gods.map(g => g.career.split('.')[0]).join('. ')}.
              </div>
              {/* DM interaction */}
              <div className="text-[10px] font-mono text-white/90 px-2 py-1 rounded bg-white/[0.03] border border-white/10">
                <span className="text-white/60">DM {score >= 60 ? 'Strong' : score < 40 ? 'Weak' : 'Balanced'} → </span>
                {cat.interaction}
              </div>
            </div>
          </div>
        ))}

        {/* Career Archetype */}
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: archetype.color + '30' }}>
          <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: archetype.color + '10' }}>
            <span className="text-xl">{archetype.icon}</span>
            <div>
              <div className="text-[12px] font-bold" style={{ color: archetype.color }}>{archetype.name}</div>
              <div className="text-[9px] text-white/50">{dmBand} {dmElement} + dominant {top1.label}</div>
            </div>
          </div>
          <div className="px-3 py-2 space-y-2">
            <div className="text-[10px] text-white/80 leading-relaxed">{archetype.desc}</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] font-semibold text-green-400 mb-0.5">Strengths</div>
                {archetype.strengths.map(s => (
                  <div key={s} className="text-[9px] text-white/70">• {s}</div>
                ))}
              </div>
              <div>
                <div className="text-[9px] font-semibold text-amber-400 mb-0.5">Needs</div>
                {archetype.needs.map(n => (
                  <div key={n} className="text-[9px] text-white/70">• {n}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Career Summary */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-900/[0.06] px-3 py-2">
          <div className="text-[11px] font-bold text-amber-300 mb-1">Career Summary</div>
          <div className="text-[10px] text-white/80 leading-relaxed">{summaryText}</div>
        </div>
      </div>

      {showTenGodsMd && (
        <FloatingMdWindow
          content={TEN_GODS_CAREER_MD}
          title="Ten Gods — Career Profile Guide"
          onClose={() => setShowTenGodsMd(false)}
        />
      )}
    </div>
  );
}


function MTFQBlendDashboard({ natalTfq, daYunQi, yearQi, monthQi, monthName, year, synergyGains, synergyPairDetail }) {
  const [showMtfqMd, setShowMtfqMd] = useState(false);
  const [showSynergyMd, setShowSynergyMd] = useState(false);
  // natalTfq = engine's natalForMtfq (NTFQ if available, else raw polarityQi)
  const natalQi = natalTfq;
  const natalLabel = 'NTFQ (post-pipeline)';

  const layers = [
    { key: 'ntfq',  label: natalLabel,          weight: 1.0, qi: natalQi,      color: '#fbbf24', tag: 'body' },
    { key: 'dayun', label: 'Da Yun Qi',          weight: 0.9, qi: daYunQi || {}, color: '#ec4899', tag: 'decade' },
    { key: 'year',  label: `Year Qi (${year})`,   weight: 0.5, qi: yearQi,        color: '#a78bfa', tag: 'year' },
    { key: 'month', label: `Month Qi (${monthName})`, weight: 0.3, qi: monthQi, color: '#22d3ee', tag: 'month' },
  ];

  // Compute MTFQ per element
  const mtfq = {};
  ELEMENTS.forEach(el => {
    mtfq[el] = layers.reduce((s, l) => s + l.weight * (l.qi[el] || 0), 0);
  });
  const totalMtfq = ELEMENTS.reduce((s, el) => s + mtfq[el], 0);

  // Max value across all layers for consistent bar scaling
  const allVals = layers.flatMap(l => ELEMENTS.map(el => l.qi[el] || 0));
  const layerMax = Math.max(...allVals, 0.01);

  // Max for MTFQ bars
  const mtfqMax = Math.max(...ELEMENTS.map(el => mtfq[el]), 0.01);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">Month Total Functional Qi (MTFQ)</div>
          <button onClick={() => setShowMtfqMd(prev => !prev)} className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20">MD</button>
        </div>
        <div className="text-[10px] text-gray-300 font-mono mt-0.5">
          MTFQ = <span className="text-amber-300">1.0</span>×NTFQ + <span className="text-pink-300">0.9</span>×DaYun + <span className="text-purple-300">0.5</span>×Year + <span className="text-cyan-300">0.3</span>×Month
        </div>
        <div className="text-[9px] text-gray-400 mt-0.5">
          Only natal TFQ goes through the survival pipeline (Combinations → Clashes → Harms → ... → Yong Shen) to become NTFQ. External layers (DaYun, Year, Month) use their own Seasonality → Polarity pipeline.
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ── A. Four Input Layers — double bars (raw + weighted) ── */}
        {layers.map(layer => {
          const layerTotal = ELEMENTS.reduce((s, el) => s + (layer.qi[el] || 0), 0);
          const weightedTotal = layerTotal * layer.weight;
          return (
            <div key={layer.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: layer.color }}>{layer.label}</span>
                  <span className="text-[9px] text-gray-500">×{layer.weight}</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  {layerTotal.toFixed(3)} → <span className="text-white font-semibold">{weightedTotal.toFixed(3)}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                {ELEMENTS.map(el => {
                  const raw = layer.qi[el] || 0;
                  const weighted = raw * layer.weight;
                  return (
                    <div key={el} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-10 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                      <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                        {/* Raw bar (faint) */}
                        <div className="absolute inset-y-0 left-0 rounded" style={{
                          width: `${(raw / layerMax) * 100}%`,
                          backgroundColor: ELEM_COLORS[el],
                          opacity: 0.2,
                        }} />
                        {/* Weighted bar (bright) */}
                        <div className="absolute inset-y-0 left-0 rounded" style={{
                          width: `${(weighted / layerMax) * 100}%`,
                          backgroundColor: ELEM_COLORS[el],
                          opacity: 0.75,
                        }} />
                        {/* Labels */}
                        <div className="absolute inset-0 flex items-center justify-between px-1 text-[8px] font-mono">
                          <span className="text-white/40">{raw > 0 ? raw.toFixed(3) : ''}</span>
                          <span className="text-white/80 font-semibold">{weighted > 0 ? weighted.toFixed(3) : ''}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── A.5 Synergy — Wu Xing Generation Amplification ── */}
        {synergyGains && (
          <div className="rounded border border-lime-500/20 overflow-hidden bg-lime-950/10">
            <div className="px-3 py-1.5 bg-lime-500/10 border-b border-lime-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-semibold text-lime-300 uppercase tracking-wider">
                  Synergy — 生 Generation Amplification (k = 0.2)
                </div>
                <div className="text-[9px] font-mono text-lime-400">
                  +{ELEMENTS.reduce((s, el) => s + (synergyGains[el] || 0), 0).toFixed(3)} pts created
                </div>
              </div>
              <button onClick={() => setShowSynergyMd(prev => !prev)}
                className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20"
              >MD</button>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-[9px] text-gray-300 font-mono">
                External Qi generates new Qi via the producing cycle.
                Qi is <span className="text-lime-300">created</span>, not transferred.
                Season modulates κ: <span className="text-amber-300">0.8</span> (dead) → <span className="text-lime-300">1.0</span> (neutral) → <span className="text-emerald-300">1.2</span> (prosperous).
              </div>
              {/* Generation pairs */}
              <div className="space-y-1.5">
                {(() => {
                  const labels = { Wood: 'Wood feeds Fire', Fire: 'Fire creates Earth', Earth: 'Earth bears Metal', Metal: 'Metal enriches Water', Water: 'Water nourishes Wood' };
                  const pairs = synergyPairDetail || [
                    { gen: 'Wood', recv: 'Fire' }, { gen: 'Fire', recv: 'Earth' },
                    { gen: 'Earth', recv: 'Metal' }, { gen: 'Metal', recv: 'Water' },
                    { gen: 'Water', recv: 'Wood' },
                  ].map(p => ({ ...p, extG: (daYunQi?.[p.gen] || 0) + (yearQi?.[p.gen] || 0) + (monthQi?.[p.gen] || 0), E: 0.6, S: 1.0, kEff: 0.2, gain: synergyGains[p.recv] || 0 }));
                  return pairs.map(d => {
                    const sColor = d.S >= 1.1 ? '#4ade80' : d.S <= 0.9 ? '#fbbf24' : '#94a3b8';
                    return (
                      <div key={d.gen} className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="w-12 text-right font-semibold" style={{ color: ELEM_COLORS[d.gen] }}>{d.gen}</span>
                        <span className="text-gray-400">→</span>
                        <span className="w-12 font-semibold" style={{ color: ELEM_COLORS[d.recv] }}>{d.recv}</span>
                        <span className="text-gray-300">κ<sub>eff</sub> {d.kEff.toFixed(3)} × {d.extG.toFixed(3)}</span>
                        <span className="text-lime-300 font-bold">=&nbsp;+{d.gain.toFixed(4)}</span>
                        <span className="text-[8px] px-1 py-0.5 rounded" style={{ color: sColor, border: `1px solid ${sColor}33`, background: `${sColor}11` }}>
                          S={d.S.toFixed(2)}
                        </span>
                        <span className="text-gray-300 text-[9px]">{labels[d.gen]}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              {/* Per-element gains bar */}
              <div className="space-y-0.5 pt-1.5 border-t border-white/10">
                <div className="text-[9px] text-gray-400 font-mono mb-1">Per-element Qi created:</div>
                {ELEMENTS.map(el => {
                  const gain = synergyGains[el] || 0;
                  const maxGain = Math.max(...ELEMENTS.map(e => synergyGains[e] || 0), 0.001);
                  return (
                    <div key={el} className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-10 text-right font-mono font-semibold" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                      <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 rounded" style={{
                          width: `${(gain / maxGain) * 100}%`,
                          backgroundColor: ELEM_COLORS[el],
                          opacity: 0.7,
                        }} />
                        <div className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono">
                          <span className="text-white font-semibold">+{gain.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── B. Per-Element Calculation Table ── */}
        <div className="rounded border border-white/10 overflow-hidden">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5 bg-white/5">
            Per-Element MTFQ Calculation
          </div>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="bg-white/5 text-gray-500">
                <th className="px-2 py-1 text-left">Element</th>
                <th className="px-2 py-1 text-right text-amber-300">×1.0 NTFQ</th>
                <th className="px-2 py-1 text-right text-pink-300">×0.9 DaYun</th>
                <th className="px-2 py-1 text-right text-purple-300">×0.5 Year</th>
                <th className="px-2 py-1 text-right text-cyan-300">×0.3 Month</th>
                <th className="px-2 py-1 text-right text-green-300">= MTFQ</th>
              </tr>
            </thead>
            <tbody>
              {ELEMENTS.map(el => (
                <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-2 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                  <td className="px-2 py-1 text-right text-amber-300/70">{(1.0 * (natalQi[el] || 0)).toFixed(3)}</td>
                  <td className="px-2 py-1 text-right text-pink-300/70">{(0.9 * (daYunQi?.[el] || 0)).toFixed(3)}</td>
                  <td className="px-2 py-1 text-right text-purple-300/70">{(0.5 * (yearQi[el] || 0)).toFixed(3)}</td>
                  <td className="px-2 py-1 text-right text-cyan-300/70">{(0.3 * (monthQi[el] || 0)).toFixed(3)}</td>
                  <td className="px-2 py-1 text-right text-green-300 font-semibold">{mtfq[el].toFixed(3)}</td>
                </tr>
              ))}
              <tr className="border-t border-white/20 bg-white/5">
                <td className="px-2 py-1 text-gray-400 font-semibold">Total</td>
                <td className="px-2 py-1 text-right text-amber-300 font-semibold">{(ELEMENTS.reduce((s, el) => s + (natalQi[el] || 0), 0)).toFixed(3)}</td>
                <td className="px-2 py-1 text-right text-pink-300 font-semibold">{(0.9 * ELEMENTS.reduce((s, el) => s + (daYunQi?.[el] || 0), 0)).toFixed(3)}</td>
                <td className="px-2 py-1 text-right text-purple-300 font-semibold">{(0.5 * ELEMENTS.reduce((s, el) => s + (yearQi[el] || 0), 0)).toFixed(3)}</td>
                <td className="px-2 py-1 text-right text-cyan-300 font-semibold">{(0.3 * ELEMENTS.reduce((s, el) => s + (monthQi[el] || 0), 0)).toFixed(3)}</td>
                <td className="px-2 py-1 text-right text-green-300 font-bold">{totalMtfq.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── C. MTFQ Result — Bar Chart ── */}
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">MTFQ — Element Distribution</div>
          <div className="space-y-1">
            {ELEMENTS.map(el => {
              const v = mtfq[el];
              const pct = totalMtfq > 0 ? (v / totalMtfq * 100) : 0;
              return (
                <div key={el} className="flex items-center gap-2 text-[11px]">
                  <span className="w-12 font-mono" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                  <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden relative">
                    <div className="h-full rounded" style={{
                      width: `${(v / mtfqMax) * 100}%`,
                      backgroundColor: ELEM_COLORS[el],
                      opacity: 0.75,
                    }} />
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono">
                      <span className="text-white/80 font-semibold">{v.toFixed(2)}</span>
                      <span className="text-white/50">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── D. MTFQ Spider Graph ── */}
        <div className="flex justify-center pt-2">
          <PentagonRadar qi={mtfq} label="MTFQ" size={240} />
        </div>
      </div>
      {showMtfqMd && (
        <FloatingMdWindow
          content={MTFQ_FORMULA_MD}
          title="MTFQ — Formula & Classical BaZi"
          onClose={() => setShowMtfqMd(false)}
          width={680}
        />
      )}
      {showSynergyMd && (
        <FloatingMdWindow
          content={SYNERGY_MD}
          title="Synergy — 生 Wu Xing Generation Amplification"
          onClose={() => setShowSynergyMd(false)}
          width={680}
        />
      )}
    </div>
  );
}

// ============================================================================
// MONTH CARD — one month in the seasonal grid
// ============================================================================

function MonthCard({ snapshot, expanded, onToggle, dayMasterPolarity, dayMasterElement, year, userTfq, chart, qiMatrix, profileBirthDate, profileBirthTime, profileGender, dmStrengthAdj, dmStrengthScore }) {
  const fqi = snapshot.functionalQi;
  const total = ELEMENTS.reduce((s, k) => s + fqi[k], 0);
  const hasClash = snapshot.interactions.length > 0;

  const [yearFlapOpen, setYearFlapOpen] = useState(false);
  const [monthFlapOpen, setMonthFlapOpen] = useState(false);
  const [braceletOpen, setBraceletOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const yearBd = snapshot.yearPillarBreakdown;
  const monthBd = snapshot.monthPillarBreakdown;

  // Compute NTFQ — natal TFQ after the full survival pipeline
  // Only natal Qi goes through Combinations → Clashes → Harms → ... → Yong Shen
  const ntfq = useMemo(() => {
    if (!userTfq || !chart?.pillars || !qiMatrix?.yearPillar) return null;
    try {
      const result = processNatalPipeline(
        userTfq,
        {
          chartPillars: chart.pillars,
          yearPillar: { stem: qiMatrix.yearPillar.stem, branch: qiMatrix.yearPillar.branch },
          monthPillar: { stem: snapshot.monthStem, branch: snapshot.monthBranch },
          currentMonthBranch: snapshot.monthBranch,
          dayMasterElement: qiMatrix.dayMasterElement || '',
          dayMasterPolarity: qiMatrix.dayMasterPolarity || '',
          natalBranches: {
            year: chart.pillars[0]?.branch?.char || '',
            month: chart.pillars[1]?.branch?.char || '',
            day: chart.pillars[2]?.branch?.char || '',
            hour: chart.pillars[3]?.branch?.char || '',
          },
          yearBranch: qiMatrix.yearPillar.branch,
          monthBranch: snapshot.monthBranch,
        },
        { applyCombinationEngine, buildCombinationContext, detectInteractions, applyClashDamage, applyControlPressure, applyOvercrowding, applyTransformations, analyzeStructuralCollapse }
      );
      return result?.outputQi || null;
    } catch { return null; }
  }, [userTfq, chart, qiMatrix, snapshot]);

  // MTFQ — use the engine's single source of truth
  const finalQiForRadar = snapshot.functionalQi;

  return (
    <div className={`rounded-lg border ${hasClash ? 'border-red-500/50' : 'border-white/10'} bg-white/5 overflow-hidden`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{snapshot.monthName}</span>
          {hasClash && <span className="text-xs">⚔️</span>}
          {qiMatrix?.natalQi && <MonthArchetypeBadge snapshot={snapshot} natalQi={qiMatrix.natalQi} />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">{total.toFixed(3)} pts</span>
          <span className="text-gray-500 text-xs">{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {/* 20,000 ft view — TFQ vs Final Qi pentagon radar (always visible) */}
      <div className="px-3 pb-2">
        {userTfq && finalQiForRadar ? (
          <div className="flex items-center justify-center gap-2">
            <PentagonRadar
              qi={userTfq}
              label="Natal TFQ"
              size={140}
            />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-white/40 font-mono">→</span>
              <span className="text-[9px] text-white/55 font-mono">{snapshot.monthName}</span>
              <span className="text-[9px] text-white/55 font-mono">effect</span>
              <span className="text-[10px] text-white/40 font-mono">→</span>
            </div>
            <PentagonRadar
              qi={finalQiForRadar}
              overlayQi={userTfq}
              label="Month MTFQ"
              overlayLabel="Natal TFQ"
              size={140}
            />
          </div>
        ) : (
          <QiBar qi={fqi} />
        )}
      </div>

      {/* Expanded: DaYun + Year + Month pillars, then Qi Physics Console + Calculations */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/10 pt-3">
          <div className="text-xs text-gray-500 mb-2">
            {snapshot.monthStem}{snapshot.monthBranch} — {snapshot.branchAnimal} ({snapshot.season})
          </div>

          {/* ═══ TFQ vs TotalQi comparison double bar chart ═══ */}
          {userTfq && finalQiForRadar && (() => {
            const maxVal = Math.max(
              ...ELEMENTS.map(el => Math.max(userTfq[el] || 0, finalQiForRadar[el] || 0)),
              0.01
            );
            return (
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 mb-3">
                <div className="text-xs font-semibold text-gray-300 mb-2">Natal TFQ vs {snapshot.monthName} MTFQ</div>
                <div className="space-y-2">
                  {ELEMENTS.map(el => {
                    const tfqVal = userTfq[el] || 0;
                    const mtfqVal = finalQiForRadar[el] || 0;
                    const diff = tfqVal > 0 ? ((mtfqVal - tfqVal) / tfqVal * 100) : (mtfqVal > 0 ? 100 : 0);
                    return (
                      <div key={el} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <ElSpan el={el}>{el}</ElSpan>
                          <span className={`font-semibold ${diff > 0.5 ? 'text-green-400' : diff < -0.5 ? 'text-red-400' : 'text-gray-500'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                          </span>
                        </div>
                        {/* TFQ bar */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-gray-400 w-10 text-right">TFQ</span>
                          <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                            <div className="h-full rounded" style={{
                              width: `${(tfqVal / maxVal) * 100}%`,
                              backgroundColor: ELEM_COLORS[el],
                              opacity: 0.35,
                            }} />
                            <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-gray-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {tfqVal > 0 ? tfqVal.toFixed(2) : ''}
                            </span>
                          </div>
                        </div>
                        {/* MTFQ bar */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-white w-10 text-right font-semibold">MTFQ</span>
                          <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                            <div className="h-full rounded" style={{
                              width: `${(mtfqVal / maxVal) * 100}%`,
                              backgroundColor: ELEM_COLORS[el],
                              opacity: 0.85,
                            }} />
                            <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {mtfqVal > 0 ? mtfqVal.toFixed(2) : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-2 text-[9px] font-mono">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-white/20 rounded" />
                    <span className="text-gray-400">Natal TFQ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-amber-400/80 rounded" />
                    <span className="text-white">Month MTFQ</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ═══ STORYBOOK MODE — mythic narrator ═══ */}
          <QiStorybookMode
            monthName={snapshot.monthName}
            season={snapshot.season}
            mffq={snapshot.functionalQi}
            userTfq={userTfq}
            yongShen={snapshot.yongShen}
            braceletRatios={(() => {
              if (!snapshot.yongShen || !chart?.pillars?.[2]?.stem?.char) return null;
              return designBracelet(snapshot.yongShen, chart.pillars[2].stem.char).ratios;
            })()}
            collapseMode={snapshot.yongShen?.collapseMode}
            daYunPillar={snapshot.daYunPillar}
          />

          {/* ═══ BRACELET DASHBOARD — full width at top ═══ */}
          {snapshot.yongShen && chart?.pillars?.[2]?.stem?.char && (() => {
            const dmChar = chart.pillars[2].stem.char;
            const monthBracelet = designBracelet(snapshot.yongShen, dmChar);
            const monthIdx = snapshot.monthIndex;
            const prevSnapshot = qiMatrix?.months?.find(m => m.monthIndex === monthIdx - 1);
            const prevBracelet = prevSnapshot?.yongShen ? designBracelet(prevSnapshot.yongShen, dmChar) : null;
            const allMonthBracelets = (qiMatrix?.months || [])
              .filter(m => m.yongShen)
              .map(m => ({
                label: m.monthName,
                bracelet: designBracelet(m.yongShen, dmChar),
                yongShen: m.yongShen,
                mffq: m.functionalQi,
              }));

            // Compute MIFQ for bracelet target
            let braceletMifqQi = null;
            try {
              const mtfqTotal = ELEMENTS.reduce((s, el) => s + (snapshot.functionalQi[el] || 0), 0);
              if (mtfqTotal > 0 && snapshot.yongShen) {
                const ys = snapshot.yongShen;
                const sw = getSeasonalWeights(snapshot.monthBranch);
                const GENERATES_MAP = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
                const ysAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
                if (ys.usefulElements?.length > 0) {
                  ysAdj[ys.usefulElements[0]] += 6;
                  if (ys.usefulElements.length > 1) ysAdj[ys.usefulElements[1]] += 4;
                  const child = GENERATES_MAP[ys.usefulElements[0]];
                  if (child && ysAdj[child] === 0) ysAdj[child] += 2;
                }
                if (ys.forbidden) ys.forbidden.forEach(el => { ysAdj[el] -= 6; });
                if (ys.threat && !ys.forbidden?.includes(ys.threat)) ysAdj[ys.threat] -= 4;

                const SEASONAL_WEIGHT_TO_ADJ = { 1.0: 4, 0.8: 2, 0.6: 1, 0.4: -2, 0.2: -4 };
                const sAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
                if (sw) {
                  ELEMENTS.forEach(el => {
                    const weight = sw[el.toLowerCase()] ?? 0.6;
                    const snapped = [1.0, 0.8, 0.6, 0.4, 0.2].reduce((a, b) => Math.abs(b - weight) < Math.abs(a - weight) ? b : a);
                    sAdj[el] = SEASONAL_WEIGHT_TO_ADJ[snapped] ?? 0;
                  });
                }

                const mifqResult = computeIFQ({ mtfqTotalQi: mtfqTotal, yongShenAdjustment: ysAdj, seasonalAdjustment: sAdj, dmStrengthAdjustment: dmStrengthAdj?.adjustments });
                braceletMifqQi = {};
                ELEMENTS.forEach(el => { braceletMifqQi[el] = mifqResult.elements[el].normalizedQi; });
              }
            } catch { /* fallback: no MIFQ */ }

            return (
              <div className="mb-3">
                <button
                  onClick={() => setBraceletOpen(!braceletOpen)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors mb-2"
                >
                  <span>Bracelet Remedy</span>
                  <span>{braceletOpen ? '▾' : '▸'}</span>
                </button>
                {braceletOpen && (
                  <>
                    {/* ═══ BRACELET DASHBOARD — BRQe-driven ratios → engineered sequence ═══ */}
                    {(() => {
                      let engineered = null;
                      let collapseRpt = null;
                      let brqeBracelet = monthBracelet; // fallback to old designBracelet
                      try {
                        const pool = snapshot.postClash || snapshot.functionalQi || {};
                        const elRatios = computeElementRatios(pool);
                        collapseRpt = diagnoseCollapse(elRatios);
                        const branchAnimal = snapshot.branchAnimal || 'Tiger';

                        // Compute BRQe ratios from MIFQ pipeline when available
                        let brqeRatios = null;
                        if (braceletMifqQi && snapshot.functionalQi && snapshot.yongShen && dmChar) {
                          // BRQe = MIFQ - MTFQ, capped at 50% of |BRQ| (default kCap)
                          const brqeValues = {};
                          ELEMENTS.forEach(el => {
                            const brq = (braceletMifqQi[el] || 0) - (snapshot.functionalQi[el] || 0);
                            const cap = Math.abs(brq) * 0.50;
                            const brqEff = brq * 0.35; // default effectiveness
                            brqeValues[el] = Math.max(-cap, Math.min(cap, brqEff));
                          });

                          // Use BRQe for both the bracelet design and engineered sequence
                          brqeBracelet = designBraceletFromBRQe(brqeValues, snapshot.yongShen, dmChar);
                          brqeRatios = brqeBracelet.ratios;
                        }

                        engineered = engineerBracelet({
                          collapse: collapseRpt,
                          month: branchAnimal,
                          totalBeads: 21,
                          beadSize: 10,
                          daYunQi: snapshot.daYunQi || null,
                          dayMasterStem: dmChar || null,
                          overrideRatios: brqeRatios,
                        });
                      } catch { /* fallback to old ring */ }

                      return (
                        <BraceletDashboard
                          bracelet={brqeBracelet}
                          yongShen={snapshot.yongShen}
                          dayMasterStem={dmChar}
                          dynamicPool={snapshot.functionalQi}
                          userTfq={userTfq}
                          mifqQi={braceletMifqQi}
                          monthLabel={snapshot.monthName}
                          monthBranchAnimal={snapshot.branchAnimal}
                          prevBracelet={prevBracelet}
                          prevYongShen={prevSnapshot?.yongShen}
                          prevLabel={prevSnapshot?.monthName}
                          allMonthBracelets={allMonthBracelets}
                          engineeredBracelet={engineered}
                          collapseReport={collapseRpt}
                          daYunStem={snapshot.daYunPillar?.stem}
                          daYunQi={snapshot.daYunQi}
                          dmStrengthScore={dmStrengthScore}
                          dmElement={qiMatrix?.dayMasterElement}
                        />
                      );
                    })()}

                  </>
                )}
              </div>
            );
          })()}

          {/* ═══ DA YUN — 10-Year Luck Pillar ═══ */}
          {profileBirthDate && (
            <DaYunQiOverlay
              chart={chart}
              birthDate={profileBirthDate}
              birthTime={profileBirthTime}
              gender={profileGender}
              selectedYear={year}
              currentMonthBranch={snapshot.monthBranch}
              dayMasterElement={qiMatrix?.dayMasterElement}
              collapseMode={snapshot.collapseInfo?.mode}
            />
          )}

          {/* ═══ CURRENT YEAR PILLAR — DaYun-style external pipeline ═══ */}
          {yearBd && (
            <ExternalPillarPanel
              breakdown={yearBd}
              label="Current Year"
              pillarQi={snapshot.yearQi}
              steps={snapshot.steps?.find(s => s.label?.includes('Step 3: Year'))}
            />
          )}

          {/* ═══ CURRENT MONTH PILLAR — DaYun-style external pipeline ═══ */}
          {monthBd && (
            <ExternalPillarPanel
              breakdown={monthBd}
              label="Current Month"
              pillarQi={snapshot.monthQi}
              steps={snapshot.steps?.find(s => s.label?.includes('Step 4: Month'))}
            />
          )}

          {/* ═══ MTFQ BLEND DASHBOARD — replaces Qi Physics Console ═══ */}
          {snapshot.natalTfq && snapshot.yearQi && snapshot.monthQi && (
            <MTFQBlendDashboard
              natalTfq={snapshot.natalTfq}
              daYunQi={snapshot.daYunQi}
              yearQi={snapshot.yearQi}
              monthQi={snapshot.monthQi}
              monthName={snapshot.monthName}
              year={year}
              synergyGains={snapshot.synergyGains}
              synergyPairDetail={snapshot.synergyPairDetail}
            />
          )}

          {/* ═══ CALCULATIONS — collapsible section ═══ */}
          <div>
            <button
              onClick={() => setCalcOpen(!calcOpen)}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors mb-2"
            >
              <span>Calculations</span>
              <span>{calcOpen ? '▾' : '▸'}</span>
            </button>
            {calcOpen && (
              <div className="space-y-2">
                {/* ═══ TWO INCOMING PILLAR COLUMNS — same as natal format ═══ */}
                {yearBd && monthBd && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <IncomingPillarWithFlap
                      breakdown={yearBd}
                      label="Year"
                      expanded={yearFlapOpen}
                      onToggle={() => setYearFlapOpen(p => !p)}
                      currentMonthBranch={snapshot.monthBranch}
                      dayMasterPolarity={dayMasterPolarity}
                      dayMasterElement={dayMasterElement}
                    />
                    <IncomingPillarWithFlap
                      breakdown={monthBd}
                      label="Month"
                      expanded={monthFlapOpen}
                      onToggle={() => setMonthFlapOpen(p => !p)}
                      currentMonthBranch={snapshot.monthBranch}
                      dayMasterPolarity={dayMasterPolarity}
                      dayMasterElement={dayMasterElement}
                    />
                  </div>
                )}

                {/* ═══ STEP 1: 4-Layer MTFQ Inputs ═══ */}
                {snapshot.yearQi && snapshot.monthQi && (
                  <>
                    <CombinedYMFQPanel yearFq={snapshot.yearQi} monthFq={snapshot.monthQi} year={year} monthName={snapshot.monthName} natalTfq={snapshot.natalTfq} daYunQi={snapshot.daYunQi} />

                    {/* ═══ NATAL PIPELINE: TFQ → Combinations → Clashes → ... → NTFQ ═══ */}
                    {userTfq && chart?.pillars && qiMatrix?.yearPillar && (() => {
                      const natalBranches = {
                        year: chart.pillars[0]?.branch?.char || '',
                        month: chart.pillars[1]?.branch?.char || '',
                        day: chart.pillars[2]?.branch?.char || '',
                        hour: chart.pillars[3]?.branch?.char || '',
                      };

                      const pipelineResult = processNatalPipeline(
                        userTfq,
                        {
                          chartPillars: chart.pillars,
                          yearPillar: { stem: qiMatrix.yearPillar.stem, branch: qiMatrix.yearPillar.branch },
                          monthPillar: { stem: snapshot.monthStem, branch: snapshot.monthBranch },
                          currentMonthBranch: snapshot.monthBranch,
                          dayMasterElement: qiMatrix.dayMasterElement || '',
                          dayMasterPolarity: qiMatrix.dayMasterPolarity || '',
                          natalBranches,
                          yearBranch: qiMatrix.yearPillar.branch,
                          monthBranch: snapshot.monthBranch,
                        },
                        {
                          applyCombinationEngine,
                          buildCombinationContext,
                          detectInteractions,
                          applyClashDamage,
                          applyControlPressure,
                          applyOvercrowding,
                          applyTransformations,
                          analyzeStructuralCollapse,
                        }
                      );

                      return <NatalPipelinePanel pipelineResult={pipelineResult} />;
                    })()}
                  </>
                )}

                {/* Yong Shen summary */}
                {snapshot.yongShen && (
                  <div className={`mt-2 p-2 rounded text-xs ${
                    snapshot.yongShen.status === 'collapse_override'
                      ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                      : snapshot.yongShen.status === 'critical_imbalance'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                        : 'bg-green-500/10 border border-green-500/30 text-green-300'
                  }`}>
                    <div className="font-semibold mb-1">
                      {snapshot.yongShen.status === 'collapse_override'
                        ? `用神 Yong Shen: Collapse Override (${snapshot.yongShen.collapseMode})`
                        : snapshot.yongShen.status === 'critical_imbalance'
                          ? '用神 Yong Shen: Critical Imbalance'
                          : '用神 Yong Shen: Balanced'}
                    </div>
                    <div className="text-gray-400">{snapshot.yongShen.reasoning}</div>
                    {snapshot.yongShen.forbiddenReason && snapshot.yongShen.status !== 'balanced' && (
                      <div className="mt-1 text-amber-400/80 text-[10px]">
                        {snapshot.yongShen.forbiddenReason}
                      </div>
                    )}
                    {snapshot.recommendedStones?.length > 0 && (
                      <div className="mt-1 text-gray-300">
                        Stones: {snapshot.recommendedStones.map(s => s.stone.name).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cause Map — "Why does my radar look like this?" */}
          {snapshot.causeMap && (
            <div className="mt-3">
              <CauseMapPanel causeMap={snapshot.causeMap} monthName={snapshot.monthName} season={snapshot.season} yongShen={snapshot.yongShen} />
            </div>
          )}

          {/* ═══ MIFQ — Monthly Ideal Functional Qi ═══ */}
          {snapshot.yongShen && snapshot.functionalQi && (() => {
            const mtfqTotal = ELEMENTS.reduce((s, el) => s + (snapshot.functionalQi[el] || 0), 0);
            if (mtfqTotal <= 0) return null;

            const ys = snapshot.yongShen;
            const sw = getSeasonalWeights(snapshot.monthBranch);
            if (!sw) return null;

            // Compute YongShen adjustments (percentage offsets from 20% baseline)
            // Sheng cycle: Wood→Fire→Earth→Metal→Water→Wood
            const GENERATES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
            const yongShenAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            const ysNotes = [];
            if (ys.usefulElements?.length > 0) {
              const primary = ys.usefulElements[0];
              yongShenAdj[primary] += 6;
              ysNotes.push(`${primary} +6% (primary useful — Yong Shen)`);
              if (ys.usefulElements.length > 1) {
                const secondary = ys.usefulElements[1];
                yongShenAdj[secondary] += 4;
                ysNotes.push(`${secondary} +4% (secondary useful)`);
              }
              // Child of useful (Sheng flow) — helps the useful element
              const child = GENERATES[primary];
              if (child && yongShenAdj[child] === 0) {
                yongShenAdj[child] += 2;
                ysNotes.push(`${child} +2% (child of useful — Sheng flow)`);
              }
            }
            if (ys.forbidden) {
              ys.forbidden.forEach(el => {
                yongShenAdj[el] -= 6;
                ysNotes.push(`${el} -6% (forbidden)`);
              });
            }
            if (ys.threat && !ys.forbidden?.includes(ys.threat)) {
              yongShenAdj[ys.threat] -= 4;
              ysNotes.push(`${ys.threat} -4% (threat)`);
            }

            // Compute Seasonal adjustments: align ideal with seasonal strength
            // 旺(1.0)→+4%, 相(0.8)→+2%, 休(0.6)→+1%, 囚(0.4)→–2%, 死(0.2)→–4%
            const SEASONAL_WEIGHT_TO_ADJ = { 1.0: 4, 0.8: 2, 0.6: 1, 0.4: -2, 0.2: -4 };
            const seasonalAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            const sNotes = [];
            ELEMENTS.forEach(el => {
              const weight = sw[el.toLowerCase()] ?? 0.6;
              // Snap to nearest classical weight for lookup, fallback to linear
              const snapped = [1.0, 0.8, 0.6, 0.4, 0.2].reduce((a, b) => Math.abs(b - weight) < Math.abs(a - weight) ? b : a);
              const adj = SEASONAL_WEIGHT_TO_ADJ[snapped] ?? 0;
              seasonalAdj[el] = adj;
              if (adj !== 0) sNotes.push(`${el} ${adj > 0 ? '+' : ''}${adj}% (seasonal weight ${weight.toFixed(1)})`);
            });

            const mifqResult = computeIFQ({
              mtfqTotalQi: mtfqTotal,
              yongShenAdjustment: yongShenAdj,
              seasonalAdjustment: seasonalAdj,
              dmStrengthAdjustment: dmStrengthAdj?.adjustments,
            });
            const mifqQi = {};
            ELEMENTS.forEach(el => { mifqQi[el] = mifqResult.elements[el].normalizedQi; });
            const dmStemChar = chart?.pillars?.[2]?.stem?.char || null;
            return <MIFQPanel mifqResult={mifqResult} mtfq={snapshot.functionalQi} mifqQi={mifqQi} monthName={snapshot.monthName} season={snapshot.season} ysNotes={ysNotes} sNotes={sNotes} userTfq={userTfq} ntfq={ntfq} yongShen={ys} dayMasterStem={dmStemChar} />;
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MIFQ PANEL — Monthly Ideal Functional Qi
// ============================================================================

function MIFQPanel({ mifqResult, mtfq, mifqQi, monthName, season, ysNotes, sNotes, userTfq, ntfq, yongShen, dayMasterStem }) {
  const [open, setOpen] = useState(false);
  const [showYongShenAdjMd, setShowYongShenAdjMd] = useState(false);
  const [showSeasonalAdjMd, setShowSeasonalAdjMd] = useState(false);
  const [effectiveness, setEffectiveness] = useState(0.35);
  const [kCap, setKCap] = useState(0.50);
  const [tolerance, setTolerance] = useState(0.00);  // f: 0–0.25, how far below natal TFQ floors can dip
  const [showRemedyMd, setShowRemedyMd] = useState(false);
  const [showBrqPipelineMd, setShowBrqPipelineMd] = useState(false);

  // Compute BRQe (Step 6 capped output) — used for bracelet design + qiScale
  const brqeValues = useMemo(() => {
    const brqe = {};
    ELEMENTS.forEach(el => {
      const brq = (mifqQi[el] || 0) - (mtfq[el] || 0);
      const cap = Math.abs(brq) * kCap;
      const brqEff = brq * effectiveness;
      brqe[el] = Math.max(-cap, Math.min(cap, brqEff));
    });
    return brqe;
  }, [mifqQi, mtfq, effectiveness, kCap]);

  // BRQe-driven bracelet design
  const bracelet = useMemo(() => {
    if (!dayMasterStem || !yongShen) return null;
    try {
      return designBraceletFromBRQe(brqeValues, yongShen, dayMasterStem);
    } catch { return null; }
  }, [brqeValues, yongShen, dayMasterStem]);

  // Per-element Qi scale from actual bracelet stones
  // Floor of 0.3 for elements without direct stones (indirect benefit via producing cycle)
  const qiScale = useMemo(() => {
    if (!bracelet?.sequence || !yongShen) return null;
    try {
      const units = computeBraceletQiUnits(bracelet.sequence, yongShen, 8);
      const maxQi = Math.max(...ELEMENTS.map(el => units.perElement[el]), 0.01);
      const scale = {};
      ELEMENTS.forEach(el => {
        const raw = units.perElement[el] / maxQi;        // 0–1
        scale[el] = 0.3 + 0.7 * raw;                    // 0.3–1.0
      });
      return scale;
    } catch { return null; }
  }, [bracelet, yongShen]);

  const mtfqTotal = ELEMENTS.reduce((s, el) => s + (mtfq[el] || 0), 0);

  return (
    <div className="mt-3 rounded-xl border border-teal-700/50 bg-teal-900/10 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-teal-300">Monthly Ideal Functional Qi (MIFQ)</span>
          <span className="text-[9px] text-gray-500 font-mono">Target shape for {monthName}</span>
        </div>
        <span className="text-gray-500">{open ? '▾' : '▸'}</span>
      </button>

      {/* Spider graph — always visible: MTFQ vs MIFQ */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-center gap-3">
          <PentagonRadar qi={mtfq} label="MTFQ" size={150} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-white/40 font-mono">vs</span>
            <span className="text-[9px] text-teal-400/70 font-mono">ideal</span>
          </div>
          <PentagonRadar qi={mifqQi} overlayQi={mtfq} label="MIFQ" overlayLabel="MTFQ" size={150} primaryColor="#2dd4bf" primaryFill="rgba(45,212,191,0.2)" />
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-1 text-[9px] font-mono">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-amber-400/60 rounded" />
            <span className="text-gray-400">MTFQ (actual)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-teal-400/80 rounded" />
            <span className="text-teal-300">MIFQ (ideal)</span>
          </div>
        </div>

        {/* Quick comparison bars — amber (MTFQ) vs teal (MIFQ) matching spider graph */}
        <div className="mt-2 space-y-1">
          {ELEMENTS.map(el => {
            const actual = mtfq[el] || 0;
            const ideal = mifqQi[el] || 0;
            const diff = ideal - actual;
            const maxVal = Math.max(...ELEMENTS.map(e => Math.max(mtfq[e] || 0, mifqQi[e] || 0)), 0.01);
            const actualPct = (actual / maxVal) * 100;
            const idealPct = (ideal / maxVal) * 100;
            const diffColor = diff > 0.05 ? 'text-green-400' : diff < -0.05 ? 'text-red-400' : 'text-gray-500';
            return (
              <div key={el} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden relative">
                  {/* MTFQ bar (amber/yellow) */}
                  <div className="absolute left-0 top-0 h-1/2 rounded-tl" style={{
                    width: `${actualPct}%`,
                    backgroundColor: '#f59e0b',
                    opacity: 0.7,
                  }} />
                  {/* MIFQ bar (teal) */}
                  <div className="absolute left-0 bottom-0 h-1/2 rounded-bl" style={{
                    width: `${idealPct}%`,
                    backgroundColor: '#2dd4bf',
                    opacity: 0.7,
                  }} />
                  <div className="absolute inset-0 flex items-center justify-between px-1 text-[8px] font-mono">
                    <span className="text-amber-300/80">{actual.toFixed(2)}</span>
                    <span className="text-teal-300 font-semibold">{ideal.toFixed(2)}</span>
                  </div>
                </div>
                <span className={`w-12 text-right text-[9px] font-mono ${diffColor}`}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded: Baby-step calculation breakdown */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">

          {/* Step 0: What is MIFQ + Formula + Balanced Qi */}
          <div className="rounded border border-teal-700/30 bg-teal-900/20 p-3 space-y-3">
            <div className="text-[11px] font-semibold text-teal-300">Step 0: Understanding MIFQ</div>

            <div className="text-[10px] text-gray-300 leading-relaxed space-y-1.5">
              <div><span className="text-teal-300 font-semibold">MIFQ</span> (Monthly Ideal Functional Qi) is the <span className="text-white font-medium">ideal elemental climate</span> for this person <span className="italic">this month</span>.</div>
              <div>It is <span className="text-white">not</span> natal (TFQ), not environmental (MTFQ). It is the <span className="text-teal-300">target shape</span> the bracelet and health module should move the person toward.</div>
            </div>

            {/* The Formula */}
            <div className="rounded bg-black/30 border border-white/10 px-3 py-2">
              <div className="text-[10px] font-semibold text-gray-300 mb-1.5">The Formula</div>
              <div className="text-[11px] font-mono text-teal-300">
                MIFQ = BalancedQi + YongShenAdjustment + SeasonalAdjustment
              </div>
              <div className="text-[9px] font-mono text-gray-400 mt-0.5">
                then normalize to match MTFQ total points
              </div>
            </div>

            {/* Term definitions */}
            <div className="space-y-2.5 text-[10px]">
              <div className="flex gap-2">
                <span className="text-gray-300 font-mono w-32 shrink-0">BalancedQi</span>
                <span className="text-gray-300">Neutral starting point — each element at <span className="text-white">20%</span>, total <span className="text-white">100%</span>. No bias, no personality. A blank canvas.</span>
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-amber-300 font-mono w-32 shrink-0">+ YongShenAdj</span>
                  <span className="text-gray-300">Personal % correction — purely natal logic. Same every month. A <span className="text-white">shape</span>, not a magnitude.</span>
                </div>
                <div className="ml-[8.5rem] mt-1 text-[9px] space-y-0.5">
                  <div className="text-green-400">+6% Primary Useful (Yong Shen) — her main medicine</div>
                  <div className="text-green-400">+4% Secondary Useful — supporting medicine</div>
                  <div className="text-green-400/80">+2% Child of Useful (Sheng flow) — helps the useful element</div>
                  <div className="text-red-400">−4% Threat Element (dominant Ke) — overpowers her</div>
                  <div className="text-red-400">−6% Forbidden Element — damages Day Master</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-300 font-mono w-32 shrink-0">+ SeasonalAdj</span>
                <span className="text-gray-300">Monthly % correction that <span className="text-white">aligns</span> with the season's natural strength (旺相休囚死). Elements strong in season get boosted, weak elements get reduced. Changes every month.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-teal-300 font-mono w-32 shrink-0">→ Normalize</span>
                <span className="text-gray-300">Scale raw % so MIFQ total Qi = MTFQ total Qi. The ideal must be achievable within the available Qi budget.</span>
              </div>
            </div>

            {/* Balanced Qi table */}
            <div className="rounded bg-black/20 border border-white/10 overflow-hidden">
              <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1 bg-white/5">
                Starting Point — Balanced Qi Model
              </div>
              <table className="w-full text-[10px] font-mono">
                <tbody>
                  {ELEMENTS.map(el => (
                    <tr key={el} className="border-t border-white/5">
                      <td className="px-3 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                      <td className="px-3 py-1 text-right text-gray-300">(Balanced Qi)</td>
                      <td className="px-3 py-1 text-right text-white font-semibold">20%</td>
                    </tr>
                  ))}
                  <tr className="border-t border-white/20 bg-white/5">
                    <td className="px-3 py-1 text-gray-300 font-semibold">Total</td>
                    <td className="px-3 py-1"></td>
                    <td className="px-3 py-1 text-right text-white font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 1: YongShen Adjustment notes */}
          <div className="rounded border border-white/10 bg-black/20 p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-amber-300">Step 1: Yong Shen Adjustment (personal)</div>
              <button
                onClick={() => setShowYongShenAdjMd(prev => !prev)}
                className="text-[9px] font-mono text-amber-400/70 hover:text-amber-300 transition-colors px-1.5 py-0.5 rounded border border-amber-700/30 hover:border-amber-500/50 bg-amber-900/20"
              >MD</button>
            </div>
            <div className="space-y-0.5">
              {ysNotes.map((note, i) => (
                <div key={i} className="text-[9px] font-mono text-gray-300">{note}</div>
              ))}
              {ysNotes.length === 0 && <div className="text-[9px] font-mono text-gray-500">No adjustments (balanced chart).</div>}
            </div>
          </div>

          {/* Step 2: Seasonal Adjustment notes */}
          <div className="rounded border border-white/10 bg-black/20 p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-semibold text-cyan-300">Step 2: Seasonal Adjustment ({monthName})</div>
              <button
                onClick={() => setShowSeasonalAdjMd(prev => !prev)}
                className="text-[9px] font-mono text-cyan-400/70 hover:text-cyan-300 transition-colors px-1.5 py-0.5 rounded border border-cyan-700/30 hover:border-cyan-500/50 bg-cyan-900/20"
              >MD</button>
            </div>
            <div className="space-y-0.5">
              {sNotes.map((note, i) => (
                <div key={i} className="text-[9px] font-mono text-gray-300">{note}</div>
              ))}
              {sNotes.length === 0 && <div className="text-[9px] font-mono text-gray-600">No seasonal adjustments.</div>}
            </div>
          </div>

          {/* Step 3: Baby-step table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <div className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider px-3 py-1.5 bg-white/5">
              Per-Element MIFQ Calculation
            </div>
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5 text-gray-400">
                  <th className="px-1.5 py-1 text-left">Element</th>
                  <th className="px-1.5 py-1 text-right">Base</th>
                  <th className="px-1.5 py-1 text-right text-amber-300">+YS</th>
                  <th className="px-1.5 py-1 text-right">After</th>
                  <th className="px-1.5 py-1 text-right text-pink-300">+DM Str</th>
                  <th className="px-1.5 py-1 text-right text-cyan-300">+Season</th>
                  <th className="px-1.5 py-1 text-right">Raw %</th>
                  <th className="px-1.5 py-1 text-right text-teal-300">MIFQ</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const s = mifqResult.elements[el];
                  return (
                    <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-1.5 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                      <td className="px-1.5 py-1 text-right text-gray-300">{s.base}%</td>
                      <td className="px-1.5 py-1 text-right text-amber-300">{s.yongShenAdj > 0 ? '+' : ''}{s.yongShenAdj}%</td>
                      <td className="px-1.5 py-1 text-right text-gray-200">{s.afterYongShen}%</td>
                      <td className="px-1.5 py-1 text-right text-pink-300">{s.dmStrengthAdj > 0 ? '+' : ''}{s.dmStrengthAdj.toFixed(1)}%</td>
                      <td className="px-1.5 py-1 text-right text-cyan-300">{s.seasonalAdj > 0 ? '+' : ''}{s.seasonalAdj}%</td>
                      <td className="px-1.5 py-1 text-right text-white">{s.rawPercent.toFixed(1)}%</td>
                      <td className="px-1.5 py-1 text-right text-teal-300 font-semibold">{s.normalizedQi.toFixed(3)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-1.5 py-1 text-gray-300 font-semibold">Total</td>
                  <td className="px-1.5 py-1 text-right text-gray-300">100%</td>
                  <td className="px-1.5 py-1 text-right text-amber-300/60">—</td>
                  <td className="px-1.5 py-1 text-right text-gray-400">—</td>
                  <td className="px-1.5 py-1 text-right text-pink-300/60">—</td>
                  <td className="px-1.5 py-1 text-right text-cyan-300/60">—</td>
                  <td className="px-1.5 py-1 text-right text-white font-semibold">{mifqResult.totalRawPercent.toFixed(1)}%</td>
                  <td className="px-1.5 py-1 text-right text-teal-300 font-bold">{mifqResult.totalNormalizedQi.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step 3: Normalization */}
          <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
            <div className="text-[10px] font-semibold text-teal-300 mb-1">Step 3: Normalization</div>
            <div className="text-[9px] font-mono text-gray-300 space-y-0.5">
              <div>MTFQ total = <span className="text-white">{mtfqTotal.toFixed(3)}</span> pts</div>
              <div>Raw IFQ total = <span className="text-white">{mifqResult.totalRawPercent.toFixed(1)}%</span></div>
              <div>Scale = {mtfqTotal.toFixed(3)} / {mifqResult.totalRawPercent.toFixed(1)} = <span className="text-white">{mifqResult.scale.toFixed(6)}</span></div>
            </div>

            {/* Per-element normalization breakdown */}
            <div className="rounded border border-white/10 overflow-hidden">
              <table className="w-full text-[9px] font-mono">
                <thead>
                  <tr className="bg-white/5 text-gray-400">
                    <th className="px-1 py-0.5 text-left">El</th>
                    <th className="px-1 py-0.5 text-right">Raw %</th>
                    <th className="px-0.5 py-0.5 text-center text-gray-500">x</th>
                    <th className="px-1 py-0.5 text-right">Scale</th>
                    <th className="px-0.5 py-0.5 text-center text-gray-500">=</th>
                    <th className="px-1 py-0.5 text-right text-teal-300">MIFQ Qi</th>
                    <th className="px-1 py-0.5 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {ELEMENTS.map(el => {
                    const s = mifqResult.elements[el];
                    const pct = mifqResult.totalNormalizedQi > 0 ? (s.normalizedQi / mifqResult.totalNormalizedQi) * 100 : 0;
                    return (
                      <tr key={el} className="border-t border-white/5">
                        <td className="px-1 py-0.5" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                        <td className="px-1 py-0.5 text-right text-white">{s.rawPercent.toFixed(1)}%</td>
                        <td className="px-0.5 py-0.5 text-center text-gray-400">x</td>
                        <td className="px-1 py-0.5 text-right text-gray-300">{mifqResult.scale.toFixed(4)}</td>
                        <td className="px-0.5 py-0.5 text-center text-gray-400">=</td>
                        <td className="px-1 py-0.5 text-right text-teal-300 font-semibold">{s.normalizedQi.toFixed(3)}</td>
                        <td className="px-1 py-0.5 text-right text-gray-300">{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-white/20 bg-white/5">
                    <td className="px-1 py-0.5 text-gray-400 font-semibold">Total</td>
                    <td className="px-1 py-0.5 text-right text-white font-semibold">{mifqResult.totalRawPercent.toFixed(1)}%</td>
                    <td className="px-0.5 py-0.5"></td>
                    <td className="px-1 py-0.5"></td>
                    <td className="px-0.5 py-0.5"></td>
                    <td className="px-1 py-0.5 text-right text-teal-300 font-bold">{mifqResult.totalNormalizedQi.toFixed(3)}</td>
                    <td className="px-1 py-0.5 text-right text-white font-bold">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-mono text-teal-400">MIFQ total = {mifqResult.totalNormalizedQi.toFixed(3)} pts = MTFQ total ✓</div>

            {/* Side-by-side spider graphs: MIFQ vs MTFQ */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <PentagonRadar qi={mifqQi} label="MIFQ (ideal)" size={130} primaryColor="#2dd4bf" primaryFill="rgba(45,212,191,0.2)" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-white/40 font-mono">vs</span>
              </div>
              <PentagonRadar qi={mtfq} label="MTFQ (actual)" size={130} />
            </div>
          </div>

          {/* Step 4: BRQ — Bracelet Qi */}
          <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
            <div className="text-[10px] font-semibold text-rose-300 mb-1">Step 4: Bracelet Qi (BRQ) — Correction Vector</div>
            <div className="text-[9px] font-mono text-gray-300">
              BRQ = MIFQ - MTFQ — the Qi the bracelet must inject to move you toward your ideal.
            </div>

            <div className="rounded border border-white/10 overflow-hidden">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="bg-white/5 text-gray-400">
                    <th className="px-2 py-1 text-left">Element</th>
                    <th className="px-2 py-1 text-right text-teal-300">MIFQ</th>
                    <th className="px-1 py-1 text-center text-gray-500 w-4">-</th>
                    <th className="px-2 py-1 text-right text-amber-300">MTFQ</th>
                    <th className="px-1 py-1 text-center text-gray-500 w-4">=</th>
                    <th className="px-2 py-1 text-right text-rose-300">BRQ</th>
                    <th className="px-1.5 py-1 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {ELEMENTS.map(el => {
                    const mifqVal = mifqQi[el] || 0;
                    const mtfqVal = mtfq[el] || 0;
                    const brq = mifqVal - mtfqVal;
                    return (
                      <tr key={el} className="border-t border-white/5">
                        <td className="px-2 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                        <td className="px-2 py-1 text-right text-teal-300">{mifqVal.toFixed(3)}</td>
                        <td className="px-1 py-1 text-center text-gray-500">-</td>
                        <td className="px-2 py-1 text-right text-amber-300">{mtfqVal.toFixed(3)}</td>
                        <td className="px-1 py-1 text-center text-gray-500">=</td>
                        <td className={`px-2 py-1 text-right font-semibold ${brq > 0.005 ? 'text-green-400' : brq < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>
                          {brq > 0 ? '+' : ''}{brq.toFixed(3)}
                        </td>
                        <td className="px-1.5 py-1 text-center text-[9px]">
                          {brq > 0.005 ? <span className="text-green-400">boost</span> : brq < -0.005 ? <span className="text-red-400">reduce</span> : <span className="text-gray-500">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                  {(() => {
                    const brqTotal = ELEMENTS.reduce((s, el) => s + ((mifqQi[el] || 0) - (mtfq[el] || 0)), 0);
                    return (
                      <tr className="border-t border-white/20 bg-white/5">
                        <td className="px-2 py-1 text-gray-300 font-semibold">Net</td>
                        <td className="px-2 py-1 text-right text-teal-300 font-semibold">{mifqResult.totalNormalizedQi.toFixed(3)}</td>
                        <td className="px-1 py-1"></td>
                        <td className="px-2 py-1 text-right text-amber-300 font-semibold">{mtfqTotal.toFixed(3)}</td>
                        <td className="px-1 py-1"></td>
                        <td className="px-2 py-1 text-right text-gray-300 font-semibold">{brqTotal > 0 ? '+' : ''}{brqTotal.toFixed(3)}</td>
                        <td className="px-1.5 py-1 text-center text-[9px] text-gray-400">zero-sum</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] font-mono text-gray-300">
              <span className="text-green-400">boost</span> = bracelet adds this element &nbsp; <span className="text-red-400">reduce</span> = bracelet avoids this element
            </div>
          </div>

          {/* Steps 4.5 + 4.6: Remedy Engine (0.75/0.25 interaction matrix) */}
          {(() => {
            // ── Interaction matrix: adding element X reduces targets by these coefficients ──
            // Control (克) = 0.75, Drain (泄) = 0.25
            // Adding X: controls (克) its target at 0.75, drains (泄) its mother at 0.25
            // Drain = child exhausts parent: X is child of mother, adding X drains mother
            // 生 cycle: Water→Wood→Fire→Earth→Metal→Water (mother→child)
            const INTERACTION = {
              Wood:  { Earth: 0.75, Water: 0.25 },   // Wood 克 Earth, Wood drains Water (Water→Wood)
              Fire:  { Metal: 0.75, Wood:  0.25 },   // Fire 克 Metal, Fire drains Wood (Wood→Fire)
              Earth: { Water: 0.75, Fire:  0.25 },   // Earth 克 Water, Earth drains Fire (Fire→Earth)
              Metal: { Wood:  0.75, Earth: 0.25 },   // Metal 克 Wood, Metal drains Earth (Earth→Metal)
              Water: { Fire:  0.75, Metal: 0.25 },   // Water 克 Fire, Water drains Metal (Metal→Water)
            };

            const forbidden = new Set(yongShen?.forbidden || []);
            if (yongShen?.threat) forbidden.add(yongShen.threat);
            // Also treat excessive elements (negative BRQ) as forbidden remedies
            // — never add more of an element that's already in excess
            ELEMENTS.forEach(el => {
              const brq = (mifqQi[el] || 0) - (mtfq[el] || 0);
              if (brq < -0.005) forbidden.add(el);
            });

            // Floors: based on TFQ percentage of current total Qi
            // e.g., Fire = 11% of TFQ → floor = 11% × (1−f) × MTFQ total
            const tfqTotal = userTfq ? ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0) : 0;
            const natalPct = {};  // natal percentage per element
            ELEMENTS.forEach(el => {
              natalPct[el] = tfqTotal > 0 ? (userTfq?.[el] || 0) / tfqTotal : 0.2;
            });
            const natalFloor = {};
            ELEMENTS.forEach(el => {
              natalFloor[el] = natalPct[el] * (1 - tolerance) * mtfqTotal;
            });

            // Running state: current Qi starts at MTFQ
            const current = {};
            ELEMENTS.forEach(el => { current[el] = mtfq[el] || 0; });

            // Detect all excessive elements (negative BRQ), sort largest first
            const excessive = ELEMENTS
              .map(el => ({ el, brq: (mifqQi[el] || 0) - (mtfq[el] || 0) }))
              .filter(r => r.brq < -0.005)
              .sort((a, b) => a.brq - b.brq);  // most negative first

            // Track remedy additions per element
            const remedyAdded = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

            // Process each excess element sequentially
            const steps = excessive.map(({ el: target, brq: origBrq }, idx) => {
              // Snapshot BEFORE this round
              const before = {};
              ELEMENTS.forEach(e => { before[e] = current[e]; });

              // Re-check excess using UPDATED current state (prior remedies may have changed it)
              const currentExcess = current[target] - (mifqQi[target] || 0);
              // If no longer excessive after prior remedies, skip
              if (currentExcess <= 0.005) {
                const newBrq = (mifqQi[target] || 0) - current[target];
                const snapshot = {};
                ELEMENTS.forEach(e => { snapshot[e] = current[e]; });
                return {
                  target, excess: Math.abs(origBrq), remaining: 0,
                  effects: [], order: idx + 1, noRemedy: false,
                  resolved: true, newBrq, before, snapshot, delta: {}, stepRemedyUnits: {},
                };
              }
              const excess = currentExcess;

              // Find all remedy elements that reduce this target, excluding forbidden
              const remedies = ELEMENTS
                .filter(r => INTERACTION[r]?.[target] && !forbidden.has(r))
                .map(r => ({ remedy: r, coeff: INTERACTION[r][target] }))
                .sort((a, b) => b.coeff - a.coeff);  // strongest first (controller before drainer)

              const effects = [];  // track each remedy applied
              let remaining = excess;

              for (const { remedy, coeff } of remedies) {
                if (remaining <= 0.001) break;

                // How much remedy needed to fix remaining excess via this coefficient
                const needed = remaining / coeff;

                // Floor check: adding this remedy reduces ALL its targets
                // Find max we can add before ANY target hits its floor
                let maxAllowed = Infinity;
                let floorEl = null;
                for (const [affected, affCoeff] of Object.entries(INTERACTION[remedy])) {
                  if (affCoeff <= 0) continue;
                  const curVal = current[affected];
                  const floor = natalFloor[affected] || 0;
                  if (curVal <= floor) { maxAllowed = 0; floorEl = affected; break; }
                  const allowed = (curVal - floor) / affCoeff;
                  if (allowed < maxAllowed) { maxAllowed = allowed; floorEl = affected; }
                }
                maxAllowed = Math.max(0, maxAllowed);

                const use = Math.min(needed, maxAllowed);
                if (use <= 0.001) {
                  effects.push({ remedy, coeff, units: 0, reductions: {}, floorHit: floorEl, capped: true });
                  continue;
                }

                // Apply: update current Qi for all affected elements
                const reductions = {};
                for (const [affected, affCoeff] of Object.entries(INTERACTION[remedy])) {
                  const reduction = use * affCoeff;
                  current[affected] -= reduction;
                  // Enforce floor
                  const floor = natalFloor[affected] || 0;
                  if (current[affected] < floor) current[affected] = floor;
                  reductions[affected] = reduction;
                }

                // The remedy element itself is added to the system
                current[remedy] += use;
                remedyAdded[remedy] += use;
                remaining -= use * coeff;

                effects.push({
                  remedy, coeff, units: use,
                  reductions,
                  floorHit: use < needed - 0.001 ? floorEl : null,
                  capped: use < needed - 0.001,
                });
              }

              // Snapshot current Qi after this step + compute deltas
              const snapshot = {};
              const delta = {};
              ELEMENTS.forEach(e => {
                snapshot[e] = current[e];
                delta[e] = current[e] - before[e];
              });

              // Total remedy units added this step
              const stepRemedyUnits = {};
              effects.forEach(eff => {
                if (eff.units > 0.001) {
                  stepRemedyUnits[eff.remedy] = (stepRemedyUnits[eff.remedy] || 0) + eff.units;
                }
              });

              return {
                target, excess, remaining: Math.max(0, remaining),
                effects, order: idx + 1,
                noRemedy: remedies.length === 0,
                before, snapshot, delta, stepRemedyUnits,
              };
            });

            // Compute total reductions per element (sum of all reductions applied to it)
            const totalReduced = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            steps.forEach(s => {
              s.effects.forEach(eff => {
                Object.entries(eff.reductions).forEach(([el, amt]) => { totalReduced[el] += amt; });
              });
            });

            return (
              <>
                {/* Step 4.5: Remedy Conversion */}
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] font-semibold text-pink-300">Step 4.5: Remedy Conversion — Control & Drain Engine</div>
                    <button onClick={() => setShowRemedyMd(prev => !prev)} className="text-[9px] font-mono text-pink-400/70 hover:text-pink-300 transition-colors px-1.5 py-0.5 rounded border border-pink-700/30 hover:border-pink-500/50 bg-pink-900/20">MD</button>
                  </div>
                  <div className="text-[9px] text-gray-300">
                    Excess elements processed <span className="text-white">largest wound first</span>.
                    Adding a remedy reduces targets: <span className="text-orange-300">克 Control = 0.75</span> per unit, <span className="text-sky-300">泄 Drain = 0.25</span> per unit.
                    Floors enforced — no element drops below natal TFQ × (1 − f).
                  </div>

                  {/* Tolerance slider (f) */}
                  <div className="rounded border border-white/10 bg-white/5 p-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-pink-300 w-24 shrink-0">f (tolerance) {(tolerance * 100).toFixed(0)}%</span>
                      <input
                        type="range"
                        min={0} max={25} step={1}
                        value={tolerance * 100}
                        onChange={e => setTolerance(Number(e.target.value) / 100)}
                        className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-pink-500"
                      />
                      <button
                        onClick={() => setTolerance(0)}
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${tolerance === 0 ? 'text-gray-500 border-gray-700 cursor-default' : 'text-pink-400 border-pink-700/50 hover:border-pink-500/50 hover:text-pink-300 bg-pink-900/20'}`}
                        disabled={tolerance === 0}
                      >0%</button>
                    </div>
                    <div className="text-[8px] text-gray-400 font-mono">
                      {tolerance === 0 ? 'Conservative — strict natal TFQ floor protection' :
                       tolerance <= 0.10 ? 'Moderate — allows mild dip below natal for better correction' :
                       tolerance <= 0.20 ? 'Flexible — willing to bend natal for stronger Metal reduction' :
                       'Aggressive — max correction, natal floors relaxed 25%'}
                    </div>
                    {userTfq && (
                      <div className="flex gap-1 flex-wrap text-[8px] font-mono">
                        {ELEMENTS.map(el => {
                          const pct = natalPct[el] * 100;
                          const floorPct = pct * (1 - tolerance);
                          const floorQi = natalFloor[el];
                          return (
                            <span key={el} className="px-1 py-0.5 rounded bg-black/30 border border-white/5">
                              <span style={{ color: ELEM_COLORS[el] }}>{el}</span>
                              <span className="text-gray-400"> {pct.toFixed(0)}%</span>
                              {tolerance > 0 && <span className="text-pink-300">→{floorPct.toFixed(0)}%</span>}
                              <span className="text-gray-500"> ({floorQi.toFixed(2)})</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {excessive.length === 0 ? (
                    <div className="text-[9px] text-gray-400 italic">No elements need reduction this month.</div>
                  ) : (
                    <div className="space-y-2">
                      {steps.map(s => (
                        <div key={s.target} className="rounded border border-white/10 bg-white/5 p-2 space-y-1.5">
                          {/* Header */}
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-gray-300 font-mono">#{s.order}</span>
                            <span className="font-semibold" style={{ color: ELEM_COLORS[s.target] }}>{s.target}</span>
                            <span className="text-red-400 font-mono">excess {s.excess.toFixed(3)}</span>
                          </div>

                          {s.resolved ? (
                            <div className="text-[9px] font-mono pl-2 space-y-0.5">
                              <div className="text-green-400">Already resolved by prior remedy — no longer excessive.</div>
                              <div className="text-gray-300">New BRQ: <span className={s.newBrq > 0.005 ? 'text-green-400' : 'text-gray-400'}>{s.newBrq > 0 ? '+' : ''}{s.newBrq.toFixed(3)}</span> {s.newBrq > 0.005 ? '(now needs boosting)' : ''}</div>
                            </div>
                          ) : s.noRemedy ? (
                            <div className="text-[9px] text-red-400 font-mono pl-2">All remedy elements are forbidden — no correction possible.</div>
                          ) : (
                            /* Before / Add / After breakdown table */
                            <div className="space-y-1.5">
                              {/* Remedy summary line */}
                              <div className="text-[9px] font-mono text-gray-300 pl-1">
                                {Object.entries(s.stepRemedyUnits).map(([rem, units]) => (
                                  <span key={rem} className="mr-3">
                                    Add <span style={{ color: ELEM_COLORS[rem] }}>{rem}</span>
                                    <span className="text-green-400 ml-1">+{units.toFixed(3)}</span> units
                                    {s.effects.find(e => e.capped && e.remedy === rem) && (
                                      <span className="text-amber-400 ml-1">
                                        (floor: <span style={{ color: ELEM_COLORS[s.effects.find(e => e.capped && e.remedy === rem)?.floorHit] }}>{s.effects.find(e => e.capped && e.remedy === rem)?.floorHit}</span>)
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>

                              {/* Before / Effect / After table */}
                              <div className="rounded border border-white/10 overflow-hidden">
                                <table className="w-full text-[9px] font-mono">
                                  <thead>
                                    <tr className="bg-white/5 text-gray-400">
                                      <th className="px-1 py-0.5 text-left"></th>
                                      {ELEMENTS.map(el => (
                                        <th key={el} className="px-1 py-0.5 text-right" style={{ color: ELEM_COLORS[el] }}>{el}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* Before row */}
                                    <tr className="border-t border-white/5">
                                      <td className="px-1 py-0.5 text-gray-400">Before</td>
                                      {ELEMENTS.map(el => (
                                        <td key={el} className="px-1 py-0.5 text-right text-gray-300">{s.before[el].toFixed(3)}</td>
                                      ))}
                                    </tr>
                                    {/* Effect row — show per-element delta with coefficients */}
                                    <tr className="border-t border-white/5 bg-white/5">
                                      <td className="px-1 py-0.5 text-gray-400">Effect</td>
                                      {ELEMENTS.map(el => {
                                        const d = s.delta[el];
                                        // Determine what role this element plays
                                        let label = '';
                                        if (s.stepRemedyUnits[el]) label = '100%';
                                        else {
                                          for (const eff of s.effects) {
                                            if (eff.units > 0.001 && INTERACTION[eff.remedy]?.[el]) {
                                              label = INTERACTION[eff.remedy][el] === 0.75 ? '克75%' : '泄25%';
                                              break;
                                            }
                                          }
                                        }
                                        return (
                                          <td key={el} className="px-1 py-0.5 text-right">
                                            {Math.abs(d) > 0.001 ? (
                                              <div>
                                                <span className={d > 0 ? 'text-green-400' : 'text-red-400'}>
                                                  {d > 0 ? '+' : ''}{d.toFixed(3)}
                                                </span>
                                                {label && <div className="text-[7px] text-gray-500">{label}</div>}
                                              </div>
                                            ) : (
                                              <span className="text-gray-600">—</span>
                                            )}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                    {/* After row */}
                                    <tr className="border-t border-white/10">
                                      <td className="px-1 py-0.5 text-white font-semibold">After</td>
                                      {ELEMENTS.map(el => {
                                        const val = s.snapshot[el];
                                        const ideal = mifqQi[el] || 0;
                                        const floor = natalFloor[el] || 0;
                                        const atFloorNow = Math.abs(val - floor) < 0.05;
                                        return (
                                          <td key={el} className={`px-1 py-0.5 text-right font-semibold ${atFloorNow ? 'text-violet-400' : val > ideal + 0.05 ? 'text-red-400' : 'text-emerald-300'}`}>
                                            {val.toFixed(3)}
                                            {atFloorNow && <div className="text-[7px] text-violet-400">FLOOR</div>}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          <div className="text-[9px] font-mono pl-1 pt-0.5 border-t border-white/5 flex items-center gap-3">
                            {s.resolved ? (
                              <span className="text-green-400">Resolved by prior round</span>
                            ) : s.remaining <= 0.001 ? (
                              <span className="text-green-400">Fully resolved</span>
                            ) : (
                              <>
                                <span className="text-green-400">Reduced: −{(s.excess - s.remaining).toFixed(3)}</span>
                                <span className="text-amber-400">Remaining: {s.remaining.toFixed(3)}</span>
                              </>
                            )}
                          </div>

                          {/* Qi snapshot: 3 bars per element — Before / After / TFQ floor */}
                          {s.snapshot && (() => {
                            const maxVal = Math.max(...ELEMENTS.map(el => Math.max(
                              s.before[el] || 0, s.snapshot[el], natalFloor[el] || 0, userTfq?.[el] || 0
                            )), 0.01);
                            const afterTotal = ELEMENTS.reduce((sum, el) => sum + s.snapshot[el], 0) || 1;
                            return (
                              <div className="mt-1 pt-1 border-t border-white/10">
                                <div className="text-[8px] text-gray-400 mb-1">Qi after round #{s.order}:</div>
                                <div className="space-y-3">
                                  {ELEMENTS.map(el => {
                                    const bef = s.before[el] || 0;
                                    const aft = s.snapshot[el];
                                    const floorVal = natalFloor[el] || 0;
                                    const ideal = mifqQi[el] || 0;
                                    const atFloorNow = Math.abs(aft - floorVal) < 0.05;
                                    const befW = (bef / maxVal) * 100;
                                    const aftW = (aft / maxVal) * 100;
                                    const floorW = (floorVal / maxVal) * 100;
                                    const aftPct = (aft / afterTotal) * 100;
                                    const floorPct = natalPct[el] * (1 - tolerance) * 100;
                                    return (
                                      <div key={el} className="flex items-center gap-1.5 text-[9px]">
                                        <span className="w-10 text-right font-mono shrink-0" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                                        <div className="flex-1 space-y-0.5">
                                          {/* Before bar */}
                                          <div className="h-3 bg-white/5 rounded overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${befW}%`, backgroundColor: '#f59e0b', opacity: 0.6 }} />
                                            <span className="absolute inset-0 flex items-center px-1.5 text-[8px] font-mono text-amber-300/80">{bef.toFixed(2)}</span>
                                          </div>
                                          {/* After bar */}
                                          <div className="h-4 bg-white/5 rounded overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 rounded" style={{
                                              width: `${aftW}%`,
                                              backgroundColor: atFloorNow ? '#8b5cf6' : aft > ideal + 0.05 ? '#ef4444' : '#34d399',
                                              opacity: 0.8,
                                            }} />
                                            {/* Floor marker line */}
                                            <div className="absolute top-0 bottom-0 w-0.5 bg-pink-400/90 z-10" style={{ left: `${floorW}%` }} />
                                            <span className="absolute inset-0 flex items-center justify-between px-1.5 text-[8px] font-mono">
                                              <span className="text-white/90">{aft.toFixed(2)} ({aftPct.toFixed(0)}%)</span>
                                              {atFloorNow && <span className="text-pink-300 font-semibold">FLOOR</span>}
                                            </span>
                                          </div>
                                          {/* TFQ floor bar */}
                                          <div className="h-2.5 bg-white/5 rounded overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${floorW}%`, backgroundColor: '#8b5cf6', opacity: 0.4 }} />
                                            <span className="absolute inset-0 flex items-center px-1.5 text-[7px] font-mono text-violet-300/70">TFQ {floorPct.toFixed(0)}% ({floorVal.toFixed(2)})</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-3 mt-1 text-[7px] font-mono text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-1.5 bg-amber-400/60 rounded" />
                                    <span>Before</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2 bg-emerald-400/80 rounded" />
                                    <span>After</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-1 bg-violet-500/40 rounded" />
                                    <span>TFQ floor</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-0.5 h-2.5 bg-pink-400" />
                                    <span>Floor line</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] font-mono text-gray-300 space-y-0.5">
                    <div><span className="text-orange-300">克 Control (0.75)</span> — 1 unit remedy reduces target by 0.75</div>
                    <div><span className="text-sky-300">泄 Drain (0.25)</span> — 1 unit remedy reduces target by 0.25</div>
                    <div><span className="text-red-400">✗</span> forbidden &nbsp; <span className="text-amber-400">floor</span> = natal TFQ prevents further reduction</div>
                  </div>
                </div>

                {/* Step 4.6: Qi After Remedy — updated state */}
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="text-[10px] font-semibold text-pink-200 mb-1">Step 4.6: Qi After Remedy</div>
                  <div className="text-[9px] text-gray-300">
                    MTFQ updated by remedy additions (Step 4.5). Shows what the bracelet actually targets.
                  </div>

                  <div className="rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-[9px] font-mono">
                      <thead>
                        <tr className="bg-white/5 text-gray-400">
                          <th className="px-1 py-0.5 text-left">El</th>
                          <th className="px-1 py-0.5 text-right text-amber-300">MTFQ</th>
                          <th className="px-1 py-0.5 text-right text-green-300">+remedy</th>
                          <th className="px-1 py-0.5 text-right text-red-300">−reduced</th>
                          <th className="px-0.5 py-0.5 text-center text-gray-500">=</th>
                          <th className="px-1 py-0.5 text-right text-pink-200">After</th>
                          <th className="px-1 py-0.5 text-right text-teal-300/80">MIFQ</th>
                          <th className="px-1 py-0.5 text-right">Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENTS.map(el => {
                          const mtfqVal = mtfq[el] || 0;
                          const added = remedyAdded[el];
                          const removed = totalReduced[el];
                          const afterVal = current[el];
                          const mifqVal = mifqQi[el] || 0;
                          const gap = mifqVal - afterVal;
                          const changed = added > 0.001 || removed > 0.001;
                          return (
                            <tr key={el} className="border-t border-white/5">
                              <td className="px-1 py-0.5" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                              <td className="px-1 py-0.5 text-right text-amber-300">{mtfqVal.toFixed(3)}</td>
                              <td className="px-1 py-0.5 text-right">
                                {added > 0.001 ? <span className="text-green-400">+{added.toFixed(3)}</span> : <span className="text-gray-500">—</span>}
                              </td>
                              <td className="px-1 py-0.5 text-right">
                                {removed > 0.001 ? <span className="text-red-400">−{removed.toFixed(3)}</span> : <span className="text-gray-500">—</span>}
                              </td>
                              <td className="px-0.5 py-0.5 text-center text-gray-500">=</td>
                              <td className="px-1 py-0.5 text-right font-semibold text-pink-200">{afterVal.toFixed(3)}</td>
                              <td className="px-1 py-0.5 text-right text-teal-300/80">{mifqVal.toFixed(3)}</td>
                              <td className={`px-1 py-0.5 text-right ${Math.abs(gap) < 0.01 ? 'text-green-400' : gap > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                {Math.abs(gap) < 0.01 ? '~0' : (gap > 0 ? '+' : '') + gap.toFixed(3)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Steps 5-12: BRQ Pipeline */}
          {(() => {
            // Per-element BRQ and caps used by all steps
            const brqPerEl = {};
            ELEMENTS.forEach(el => { brqPerEl[el] = (mifqQi[el] || 0) - (mtfq[el] || 0); });
            // Cap based on raw BRQ (the wound), not BRQ_eff (the attempt)
            // s = effectiveness (how hard bracelet tries), k = safety limit (max fraction of wound allowed)
            // When s < k → no capping. When s > k → capping kicks in.
            const capPerEl = {};
            ELEMENTS.forEach(el => { capPerEl[el] = Math.abs(brqPerEl[el]) * kCap; });
            const capFor = (el) => capPerEl[el];
            const clamp = (v, c) => Math.max(-c, Math.min(c, v));

            return (
              <>
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold text-violet-300">Step 5: Effectiveness Slider → BRQ_eff</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-violet-300">{(effectiveness * 100).toFixed(0)}%</span>
                      <button onClick={() => setShowBrqPipelineMd(prev => !prev)} className="text-[9px] font-mono text-violet-400/70 hover:text-violet-300 transition-colors px-1.5 py-0.5 rounded border border-violet-700/30 hover:border-violet-500/50 bg-violet-900/20">MD</button>
                    </div>
                  </div>
                  <div className="text-[9px] text-gray-300">
                    How much of the ideal correction (BRQ) the bracelet can realistically deliver. Default 35%.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-violet-300 w-20 shrink-0">s (eff) {(effectiveness * 100).toFixed(0)}%</span>
                    <input
                      type="range"
                      min={10} max={50} step={1}
                      value={effectiveness * 100}
                      onChange={e => setEffectiveness(Number(e.target.value) / 100)}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-violet-500"
                    />
                    <button
                      onClick={() => setEffectiveness(0.35)}
                      className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${effectiveness === 0.35 ? 'text-gray-500 border-gray-700 cursor-default' : 'text-violet-400 border-violet-700/50 hover:border-violet-500/50 hover:text-violet-300 bg-violet-900/20'}`}
                      disabled={effectiveness === 0.35}
                    >35%</button>
                  </div>

                  <div className="rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr className="bg-white/5 text-gray-400">
                          <th className="px-2 py-1 text-left">Element</th>
                          <th className="px-2 py-1 text-right text-rose-300">BRQ</th>
                          <th className="px-1 py-1 text-center text-gray-500">x</th>
                          <th className="px-2 py-1 text-right text-violet-300">{(effectiveness * 100).toFixed(0)}%</th>
                          <th className="px-1 py-1 text-center text-gray-500">=</th>
                          <th className="px-2 py-1 text-right text-violet-300">BRQ_eff</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENTS.map(el => {
                          const brq = (mifqQi[el] || 0) - (mtfq[el] || 0);
                          const brqEff = brq * effectiveness;
                          return (
                            <tr key={el} className="border-t border-white/5">
                              <td className="px-2 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                              <td className={`px-2 py-1 text-right ${brq > 0.005 ? 'text-green-400' : brq < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{brq > 0 ? '+' : ''}{brq.toFixed(3)}</td>
                              <td className="px-1 py-1 text-center text-gray-400">x</td>
                              <td className="px-2 py-1 text-right text-gray-300">{(effectiveness * 100).toFixed(0)}%</td>
                              <td className="px-1 py-1 text-center text-gray-400">=</td>
                              <td className={`px-2 py-1 text-right font-semibold ${brqEff > 0.005 ? 'text-green-400' : brqEff < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{brqEff > 0 ? '+' : ''}{brqEff.toFixed(3)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step 5.5: Safety Limit k — per-element cap */}
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold text-lime-300">Step 5.5: Safety Limit (k) — Per-Element Cap</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-lime-300">{(kCap * 100).toFixed(0)}%</span>
                      <button onClick={() => setShowBrqPipelineMd(prev => !prev)} className="text-[9px] font-mono text-lime-400/70 hover:text-lime-300 transition-colors px-1.5 py-0.5 rounded border border-lime-700/30 hover:border-lime-500/50 bg-lime-900/20">MD</button>
                    </div>
                  </div>
                  <div className="text-[9px] text-gray-300">
                    Cap = k x |BRQ| (the wound). When effectiveness (s) &lt; k → no capping. When s &gt; k → capping limits the correction.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-lime-300 w-20 shrink-0">k (cap) {(kCap * 100).toFixed(0)}%</span>
                    <input
                      type="range"
                      min={25} max={75} step={1}
                      value={kCap * 100}
                      onChange={e => setKCap(Number(e.target.value) / 100)}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-lime-500"
                    />
                    <button
                      onClick={() => setKCap(0.50)}
                      className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${kCap === 0.50 ? 'text-gray-500 border-gray-700 cursor-default' : 'text-lime-400 border-lime-700/50 hover:border-lime-500/50 hover:text-lime-300 bg-lime-900/20'}`}
                      disabled={kCap === 0.50}
                    >50%</button>
                  </div>

                  <div className="rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr className="bg-white/5 text-gray-400">
                          <th className="px-1.5 py-1 text-left">Element</th>
                          <th className="px-1.5 py-1 text-right text-rose-300">|BRQ|</th>
                          <th className="px-1 py-1 text-center text-gray-500">x</th>
                          <th className="px-1.5 py-1 text-right text-lime-300">{(kCap * 100).toFixed(0)}%</th>
                          <th className="px-1 py-1 text-center text-gray-500">=</th>
                          <th className="px-1.5 py-1 text-right text-lime-300">Cap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENTS.map(el => (
                          <tr key={el} className="border-t border-white/5">
                            <td className="px-1.5 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                            <td className="px-1.5 py-1 text-right text-gray-300">{Math.abs(brqPerEl[el]).toFixed(3)}</td>
                            <td className="px-1 py-1 text-center text-gray-400">x</td>
                            <td className="px-1.5 py-1 text-right text-gray-300">{(kCap * 100).toFixed(0)}%</td>
                            <td className="px-1 py-1 text-center text-gray-400">=</td>
                            <td className="px-1.5 py-1 text-right text-lime-300 font-semibold">±{capFor(el).toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step 6: Apply Per-Element Cap → BRQₑ */}
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold text-orange-300">Step 6: Apply Cap → BRQₑ (final bracelet output)</div>
                    <button onClick={() => setShowBrqPipelineMd(prev => !prev)} className="text-[9px] font-mono text-orange-400/70 hover:text-orange-300 transition-colors px-1.5 py-0.5 rounded border border-orange-700/30 hover:border-orange-500/50 bg-orange-900/20">MD</button>
                  </div>
                  <div className="text-[9px] text-gray-300">
                    Each element's BRQ_eff is clamped to its own cap (k x |BRQ|). No global cap — big wounds get proportionally bigger corrections.
                  </div>

                  <div className="rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr className="bg-white/5 text-gray-400">
                          <th className="px-1.5 py-1 text-left">Element</th>
                          <th className="px-1.5 py-1 text-right text-violet-300">BRQ_eff</th>
                          <th className="px-1.5 py-1 text-right text-lime-300">Cap</th>
                          <th className="px-1.5 py-1 text-right text-orange-300">BRQₑ</th>
                          <th className="px-1.5 py-1 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ELEMENTS.map(el => {
                          const qs = qiScale ? qiScale[el] : 1;
                          const brqEff = brqPerEl[el] * effectiveness * qs;
                          const elCap = capFor(el);
                          const clamped = clamp(brqEff, elCap);
                          const wasCapped = Math.abs(brqEff) > elCap + 0.0005;
                          return (
                            <tr key={el} className="border-t border-white/5">
                              <td className="px-1.5 py-1" style={{ color: ELEM_COLORS[el] }}>{el}</td>
                              <td className={`px-1.5 py-1 text-right ${brqEff > 0.005 ? 'text-green-400' : brqEff < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{brqEff > 0 ? '+' : ''}{brqEff.toFixed(3)}</td>
                              <td className="px-1.5 py-1 text-right text-gray-300">±{elCap.toFixed(3)}</td>
                              <td className={`px-1.5 py-1 text-right font-semibold ${clamped > 0.005 ? 'text-green-400' : clamped < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{clamped > 0 ? '+' : ''}{clamped.toFixed(3)}</td>
                              <td className="px-1.5 py-1 text-center text-[9px]">
                                {wasCapped ? <span className="text-orange-400">capped</span> : <span className="text-gray-500">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step 7: MTFQ_after = MTFQ + BRQₑ */}
                <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                  <div className="text-[10px] font-semibold text-emerald-300">Step 7: MTFQ After Bracelet</div>
                  <div className="text-[9px] text-gray-300">
                    MTFQ_after = MTFQ + BRQₑ — the predicted Qi climate after wearing the bracelet.
                  </div>

                  <div className="rounded border border-white/10 overflow-hidden">
                    <table className="w-full text-[10px] font-mono">
                      <thead>
                        <tr className="bg-white/5 text-gray-400">
                          <th className="px-2 py-1 text-left">Element</th>
                          <th className="px-2 py-1 text-right text-amber-300">MTFQ</th>
                          <th className="px-1 py-1 text-center text-gray-500">+</th>
                          <th className="px-2 py-1 text-right text-orange-300">BRQₑ</th>
                          <th className="px-1 py-1 text-center text-gray-500">=</th>
                          <th className="px-2 py-1 text-right text-emerald-300">After</th>
                          <th className="px-2 py-1 text-right text-teal-300/80">MIFQ</th>
                          <th className="px-2 py-1 text-right text-gray-300">Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let totalAfter = 0;
                          const rows = ELEMENTS.map(el => {
                            const brq = (mifqQi[el] || 0) - (mtfq[el] || 0);
                            const qs = qiScale ? qiScale[el] : 1;
                            const brqEff = brq * effectiveness * qs;
                            const clamped = clamp(brqEff, capFor(el));
                            const after = (mtfq[el] || 0) + clamped;
                            const mifqVal = mifqQi[el] || 0;
                            const gap = mifqVal - after;
                            totalAfter += after;
                            return { el, mtfqVal: mtfq[el] || 0, clamped, after, mifqVal, gap };
                          });
                          const totalMifq = ELEMENTS.reduce((s, el) => s + (mifqQi[el] || 0), 0);
                          return (
                            <>
                              {rows.map(r => (
                                <tr key={r.el} className="border-t border-white/5">
                                  <td className="px-2 py-1" style={{ color: ELEM_COLORS[r.el] }}>{r.el}</td>
                                  <td className="px-2 py-1 text-right text-amber-300">{r.mtfqVal.toFixed(3)}</td>
                                  <td className="px-1 py-1 text-center text-gray-400">+</td>
                                  <td className={`px-2 py-1 text-right ${r.clamped > 0.005 ? 'text-green-400' : r.clamped < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{r.clamped > 0 ? '+' : ''}{r.clamped.toFixed(3)}</td>
                                  <td className="px-1 py-1 text-center text-gray-400">=</td>
                                  <td className="px-2 py-1 text-right text-emerald-300 font-semibold">{r.after.toFixed(3)}</td>
                                  <td className="px-2 py-1 text-right text-teal-300/80">{r.mifqVal.toFixed(3)}</td>
                                  <td className={`px-2 py-1 text-right text-[9px] ${Math.abs(r.gap) < 0.01 ? 'text-gray-600' : r.gap > 0 ? 'text-yellow-500' : 'text-yellow-500'}`}>{Math.abs(r.gap) < 0.01 ? '~0' : (r.gap > 0 ? '+' : '') + r.gap.toFixed(3)}</td>
                                </tr>
                              ))}
                              <tr className="border-t border-white/20 bg-white/5">
                                <td className="px-2 py-1 text-gray-300 font-semibold">Total</td>
                                <td className="px-2 py-1 text-right text-amber-300 font-semibold">{mtfqTotal.toFixed(3)}</td>
                                <td className="px-2 py-1"></td>
                                <td className="px-2 py-1"></td>
                                <td className="px-2 py-1"></td>
                                <td className="px-2 py-1 text-right text-emerald-300 font-bold">{totalAfter.toFixed(3)}</td>
                                <td className="px-2 py-1 text-right text-teal-300/60 font-semibold">{totalMifq.toFixed(3)}</td>
                                <td className="px-2 py-1"></td>
                              </tr>
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[9px] font-mono text-emerald-400">
                    Bracelet closes {(effectiveness * 100).toFixed(0)}% of the gap between MTFQ and MIFQ (per-element cap at k={(kCap * 100).toFixed(0)}% of |BRQ|).
                  </div>
                </div>

                {/* Step 8: Residual Gap + Effectiveness */}
                {(() => {
                  // Compute per-element data
                  const rows = ELEMENTS.map(el => {
                    const brqIdeal = (mifqQi[el] || 0) - (mtfq[el] || 0);
                    const qs = qiScale ? qiScale[el] : 1;
                    const brqEff = brqIdeal * effectiveness * qs;
                    const clamped = clamp(brqEff, capFor(el));
                    const after = (mtfq[el] || 0) + clamped;
                    const mifqVal = mifqQi[el] || 0;
                    const residual = mifqVal - after;
                    const closed = brqIdeal !== 0 ? (1 - Math.abs(residual) / Math.abs(brqIdeal)) * 100 : 100;
                    return { el, brqIdeal, clamped, after, mifqVal, residual, closed: Math.max(0, Math.min(100, closed)) };
                  });

                  // Overall effectiveness
                  const totalBrqMag = rows.reduce((s, r) => s + Math.abs(r.brqIdeal), 0);
                  const totalResidualMag = rows.reduce((s, r) => s + Math.abs(r.residual), 0);
                  const overallEff = totalBrqMag > 0 ? (1 - totalResidualMag / totalBrqMag) * 100 : 100;

                  return (
                    <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-semibold text-sky-300">Step 8: Residual Gap + Effectiveness</div>
                        <span className={`text-[10px] font-mono font-semibold ${overallEff >= 80 ? 'text-green-400' : overallEff >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {overallEff.toFixed(1)}% effective
                        </span>
                      </div>
                      <div className="text-[9px] text-gray-300">
                        How much of the ideal correction was achieved. Residual = MIFQ - MTFQ_after (what's still unreached).
                      </div>

                      {/* Overall effectiveness bar */}
                      <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${overallEff >= 80 ? 'bg-green-500' : overallEff >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.max(overallEff, 2)}%` }}
                        />
                      </div>

                      <div className="rounded border border-white/10 overflow-hidden">
                        <table className="w-full text-[9px] font-mono">
                          <thead>
                            <tr className="bg-white/5 text-gray-400">
                              <th className="px-1 py-1 text-left">El</th>
                              <th className="px-1 py-1 text-right text-rose-300">BRQ</th>
                              <th className="px-1 py-1 text-right text-orange-300">BRQₑ</th>
                              <th className="px-1 py-1 text-right text-emerald-300">After</th>
                              <th className="px-1 py-1 text-right text-teal-300/80">MIFQ</th>
                              <th className="px-1 py-1 text-right text-sky-300">Gap</th>
                              <th className="px-1 py-1 text-right">Closed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map(r => (
                              <tr key={r.el} className="border-t border-white/5">
                                <td className="px-1 py-0.5" style={{ color: ELEM_COLORS[r.el] }}>{r.el}</td>
                                <td className={`px-1 py-0.5 text-right ${r.brqIdeal > 0.005 ? 'text-green-400' : r.brqIdeal < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{r.brqIdeal > 0 ? '+' : ''}{r.brqIdeal.toFixed(3)}</td>
                                <td className={`px-1 py-0.5 text-right ${r.clamped > 0.005 ? 'text-green-400' : r.clamped < -0.005 ? 'text-red-400' : 'text-gray-500'}`}>{r.clamped > 0 ? '+' : ''}{r.clamped.toFixed(3)}</td>
                                <td className="px-1 py-0.5 text-right text-emerald-300">{r.after.toFixed(3)}</td>
                                <td className="px-1 py-0.5 text-right text-teal-300/80">{r.mifqVal.toFixed(3)}</td>
                                <td className={`px-1 py-0.5 text-right ${Math.abs(r.residual) < 0.01 ? 'text-green-400' : 'text-sky-300'}`}>
                                  {Math.abs(r.residual) < 0.01 ? '~0' : (r.residual > 0 ? '+' : '') + r.residual.toFixed(3)}
                                </td>
                                <td className="px-1 py-0.5 text-right">
                                  <span className={`${r.closed >= 80 ? 'text-green-400' : r.closed >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                    {r.closed.toFixed(0)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-t border-white/20 bg-white/5">
                              <td className="px-1 py-0.5 text-gray-300 font-semibold">Overall</td>
                              <td className="px-1 py-0.5"></td>
                              <td className="px-1 py-0.5"></td>
                              <td className="px-1 py-0.5"></td>
                              <td className="px-1 py-0.5"></td>
                              <td className="px-1 py-0.5"></td>
                              <td className={`px-1 py-0.5 text-right font-bold ${overallEff >= 80 ? 'text-green-400' : overallEff >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {overallEff.toFixed(1)}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}

                {/* Steps 9-11: Effectiveness Score + Spider Graphs */}
                {(() => {
                  // Recompute all vectors for the spider section
                  const spiderRows = ELEMENTS.map(el => {
                    const brqIdeal = (mifqQi[el] || 0) - (mtfq[el] || 0);
                    const qs = qiScale ? qiScale[el] : 1;
                    const brqEff = brqIdeal * effectiveness * qs;
                    const clamped = clamp(brqEff, capFor(el));
                    const after = (mtfq[el] || 0) + clamped;
                    const mifqVal = mifqQi[el] || 0;
                    const residual = mifqVal - after;
                    const elEff = Math.abs(brqIdeal) > 0.001 ? Math.max(0, Math.min(1, 1 - Math.abs(residual) / Math.abs(brqIdeal))) : 1;
                    return { el, brqIdeal, clamped, after, mifqVal, residual, elEff };
                  });

                  const mtfqAfterQi = {};
                  spiderRows.forEach(r => { mtfqAfterQi[r.el] = r.after; });

                  // Per-element effectiveness bars
                  const brqMag = Math.sqrt(spiderRows.reduce((s, r) => s + r.brqIdeal ** 2, 0));
                  const resMag = Math.sqrt(spiderRows.reduce((s, r) => s + r.residual ** 2, 0));
                  const globalEff = brqMag > 0.001 ? Math.max(0, 1 - resMag / brqMag) : 1;

                  return (
                    <>
                      {/* Step 9: Per-element effectiveness bars */}
                      <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-semibold text-sky-300">Step 9: Effectiveness Score</div>
                          <span className={`text-[11px] font-mono font-bold ${globalEff >= 0.8 ? 'text-green-400' : globalEff >= 0.5 ? 'text-amber-400' : 'text-red-400'}`}>
                            {(globalEff * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-300">
                          Per-element: how much of each element's ideal correction was achieved by the bracelet.
                        </div>
                        <div className="space-y-1.5">
                          {spiderRows.map(r => (
                            <div key={r.el} className="flex items-center gap-2 text-[10px]">
                              <span className="w-10 text-right font-mono" style={{ color: ELEM_COLORS[r.el] }}>{r.el}</span>
                              <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${r.elEff >= 0.8 ? 'bg-green-500' : r.elEff >= 0.5 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.max(r.elEff * 100, 2)}%` }}
                                />
                              </div>
                              <span className={`w-10 text-right font-mono ${r.elEff >= 0.8 ? 'text-green-400' : r.elEff >= 0.5 ? 'text-amber-400' : 'text-red-400'}`}>
                                {(r.elEff * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Steps 10-11: Spider Graphs — MTFQ vs After vs MIFQ */}
                      <div className="rounded border border-white/10 bg-black/20 p-2 space-y-2">
                        <div className="text-[10px] font-semibold text-indigo-300">Step 10-11: Bracelet Shift — Spider Graph</div>
                        <div className="text-[9px] text-gray-300">
                          Three layers: MTFQ (before) → MTFQ After Bracelet → MIFQ (target). The bracelet moves the amber shape toward the teal target.
                        </div>
                        <div className="flex items-center justify-center -mx-2">
                          <PentagonRadar qi={mtfq} overlayQi={mifqQi} label="MTFQ (before)" overlayLabel="MIFQ (target)" size={135} />
                          <div className="flex flex-col items-center -mx-2 mt-6">
                            <span className="text-[9px] text-white/50 font-mono">→</span>
                            <span className="text-[8px] text-emerald-300 font-mono font-semibold">bracelet</span>
                            <span className="text-[9px] text-white/50 font-mono">→</span>
                          </div>
                          <PentagonRadar qi={mtfqAfterQi} overlayQi={mifqQi} label="After Bracelet" overlayLabel="MIFQ (target)" size={135} primaryColor="#34d399" primaryFill="rgba(52,211,153,0.2)" />
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 mt-1 text-[9px] font-mono">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-1.5 bg-amber-400/60 rounded" />
                            <span className="text-gray-400">MTFQ (before)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-1.5 bg-emerald-400/80 rounded" />
                            <span className="text-emerald-300">After Bracelet</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-0.5 border border-white/50 border-dashed rounded" />
                            <span className="text-gray-400">MIFQ (target)</span>
                          </div>
                        </div>

                        {/* Linked s & k sliders */}
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                          {/* s (Effectiveness) slider */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-violet-300 w-20 shrink-0">s (eff) {(effectiveness * 100).toFixed(0)}%</span>
                            <input
                              type="range"
                              min={10} max={50} step={1}
                              value={effectiveness * 100}
                              onChange={e => setEffectiveness(Number(e.target.value) / 100)}
                              className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-violet-500"
                            />
                            <button
                              onClick={() => setEffectiveness(0.35)}
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${effectiveness === 0.35 ? 'text-gray-500 border-gray-700 cursor-default' : 'text-violet-400 border-violet-700/50 hover:border-violet-500/50 hover:text-violet-300 bg-violet-900/20'}`}
                              disabled={effectiveness === 0.35}
                            >35%</button>
                          </div>
                          {/* k (Safety Cap) slider */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-lime-300 w-20 shrink-0">k (cap) {(kCap * 100).toFixed(0)}%</span>
                            <input
                              type="range"
                              min={25} max={75} step={1}
                              value={kCap * 100}
                              onChange={e => setKCap(Number(e.target.value) / 100)}
                              className="flex-1 h-1.5 rounded-full appearance-none bg-gray-700 accent-lime-500"
                            />
                            <button
                              onClick={() => setKCap(0.50)}
                              className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${kCap === 0.50 ? 'text-gray-500 border-gray-700 cursor-default' : 'text-lime-400 border-lime-700/50 hover:border-lime-500/50 hover:text-lime-300 bg-lime-900/20'}`}
                              disabled={kCap === 0.50}
                            >50%</button>
                          </div>
                        </div>
                      </div>

                      {/* Step 12: Per-Element Qi Journey — horizontal bar comparison */}
                      <div className="rounded border border-white/10 bg-black/20 p-2 space-y-3">
                        <div className="text-[10px] font-semibold text-indigo-300">Step 12: Per-Element Qi Journey</div>
                        <div className="text-[9px] text-gray-300">
                          Full pipeline view per element: TFQ → NTFQ → MTFQ → MIFQ → BRQₑ → After Bracelet. Bars show Qi units, right column shows % distance from MIFQ (ideal).
                        </div>

                        {(() => {
                          // Find max across all values for consistent bar scaling
                          const allVals = ELEMENTS.flatMap(el => {
                            const vals = [
                              mtfq[el] || 0,
                              mifqQi[el] || 0,
                              mtfqAfterQi[el] || 0,
                            ];
                            if (userTfq) vals.push(userTfq[el] || 0);
                            if (ntfq) vals.push(ntfq[el] || 0);
                            return vals;
                          });
                          const maxVal = Math.max(...allVals, 0.01);

                          const layers = [
                            { key: 'TFQ', color: '#6366f1', label: 'TFQ (natal)', getData: (el) => userTfq?.[el] || 0 },
                            ...(ntfq ? [{ key: 'NTFQ', color: '#8b5cf6', label: 'NTFQ (post-pipeline)', getData: (el) => ntfq[el] || 0 }] : []),
                            { key: 'MTFQ', color: '#f59e0b', label: 'MTFQ (this month)', getData: (el) => mtfq[el] || 0 },
                            { key: 'MIFQ', color: '#2dd4bf', label: 'MIFQ (ideal)', getData: (el) => mifqQi[el] || 0 },
                            { key: 'After', color: '#34d399', label: 'After Bracelet', getData: (el) => mtfqAfterQi[el] || 0 },
                          ].filter(l => l.key !== 'TFQ' || userTfq);

                          return (
                            <div className="space-y-4">
                              {ELEMENTS.map(el => {
                                const mifqVal = mifqQi[el] || 0;
                                return (
                                  <div key={el}>
                                    <div className="text-[10px] font-semibold mb-1" style={{ color: ELEM_COLORS[el] }}>{el}</div>
                                    <div className="space-y-0.5">
                                      {layers.map(layer => {
                                        const val = layer.getData(el);
                                        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                                        const diffFromMifq = mifqVal > 0 ? ((val - mifqVal) / mifqVal) * 100 : 0;
                                        return (
                                          <div key={layer.key} className="flex items-center gap-1 text-[9px]">
                                            <span className="w-12 text-right text-gray-400 shrink-0">{layer.key}</span>
                                            <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden relative">
                                              <div className="h-full rounded" style={{ width: `${Math.max(pct, 1)}%`, backgroundColor: layer.color, opacity: 0.7 }} />
                                              <span className="absolute inset-0 flex items-center px-1 text-[8px] font-mono text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                {val > 0.001 ? val.toFixed(3) : '0'}
                                              </span>
                                            </div>
                                            <span className={`w-12 text-right font-mono shrink-0 ${
                                              layer.key === 'MIFQ' ? 'text-gray-500' :
                                              Math.abs(diffFromMifq) < 1 ? 'text-green-400' :
                                              diffFromMifq > 0 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                              {layer.key === 'MIFQ' ? '—' : (diffFromMifq > 0 ? '+' : '') + diffFromMifq.toFixed(0) + '%'}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Legend */}
                              <div className="flex flex-wrap gap-3 text-[8px] font-mono pt-1 border-t border-white/10">
                                {layers.map(l => (
                                  <div key={l.key} className="flex items-center gap-1">
                                    <div className="w-2.5 h-2 rounded" style={{ backgroundColor: l.color, opacity: 0.7 }} />
                                    <span className="text-gray-400">{l.label}</span>
                                  </div>
                                ))}
                                <span className="text-gray-500 ml-auto">% = distance from MIFQ</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  );
                })()}
              </>
            );
          })()}
        </div>
      )}

      {/* Yong Shen Adjustment MD popup */}
      {showYongShenAdjMd && (
        <FloatingMdWindow
          content={YONG_SHEN_ADJUSTMENT_MD}
          title="Yong Shen Adjustment — Personal Correction"
          onClose={() => setShowYongShenAdjMd(false)}
        />
      )}

      {/* Seasonal Adjustment MD popup */}
      {showSeasonalAdjMd && (
        <FloatingMdWindow
          content={SEASONAL_ADJUSTMENT_TABLE_MD}
          title="Seasonal Adjustment — 12-Month Table"
          onClose={() => setShowSeasonalAdjMd(false)}
        />
      )}
      {showRemedyMd && (
        <FloatingMdWindow
          content={REMEDY_ENGINE_MD}
          title="Step 4.5 — Remedy Conversion Engine"
          onClose={() => setShowRemedyMd(false)}
          width={660}
        />
      )}
      {showBrqPipelineMd && (
        <FloatingMdWindow
          content={BRQ_PIPELINE_MD}
          title="BRQ Pipeline — Steps 5, 5.5 & 6"
          onClose={() => setShowBrqPipelineMd(false)}
          width={620}
        />
      )}
    </div>
  );
}

// ============================================================================
// YONG SHEN ADJUSTMENT MD — Personal correction rules
// ============================================================================

const YONG_SHEN_ADJUSTMENT_MD = `## Yong Shen Adjustment — Personal Correction

The Yong Shen (用神) adjustment is a **purely natal, personal correction** applied to the 20% balanced baseline. It is the same every month — it reflects your chart's permanent elemental needs.

### What is Yong Shen?

Yong Shen literally means "Useful God" — the element your Day Master needs most to achieve balance. It is determined by analyzing:

- **Day Master strength** (strong vs weak)
- **Element distribution** across all four pillars
- **Seasonal context** of your birth month
- **Structural patterns** (collapse, dominance, etc.)

### Adjustment Rules

| Role | Adjustment | Why |
|------|-----------|-----|
| **Primary Useful** (Yong Shen) | **+6%** | Your main medicine — the element that balances your chart |
| **Secondary Useful** | **+4%** | Supporting medicine — reinforces the primary |
| **Child of Useful** (Sheng flow) | **+2%** | The element generated by your primary useful — keeps the cycle flowing |
| **Threat Element** (dominant Ke) | **-4%** | The element that overpowers your Day Master |
| **Forbidden Element** | **-6%** | The element that directly damages your Day Master |

### How It Works

Starting from the neutral 20% baseline per element:

1. Identify the Yong Shen from natal chart analysis
2. Apply positive adjustments to useful elements
3. Apply negative adjustments to threatening elements
4. The result is your **personal ideal shape** — before seasonal correction

### Key Principle

> The Yong Shen adjustment is **small and centered**. It nudges the 20% baseline by a few percentage points, not dramatic swings. The goal is a gentle personal bias, not a radical reshaping.

### Sheng Cycle Reference

The "Child of Useful" follows the Generating Cycle (生):

- Wood feeds Fire
- Fire creates Earth
- Earth bears Metal
- Metal enriches Water
- Water nourishes Wood

If your primary useful is Metal, then Water (+2%) is the child of useful — it keeps the productive cycle flowing downstream from your medicine.
`;

// ============================================================================
// SEASONAL ADJUSTMENT MD — Full 12-month percentage table
// ============================================================================

const SEASONAL_ADJUSTMENT_TABLE_MD = `## Seasonal Adjustment — Element Expressiveness

In BaZi, the **season you were born in** dramatically changes how strongly each element expresses itself. An element that is "present" in your chart may be nearly dormant if it's out of season, or at full power if in season.

This is the **Five Phases of Seasonal Strength** (旺相休囚死):

| Level | Multiplier | Adjustment | Meaning |
|-------|-----------|------------|---------|
| 旺 Prosperous | ×1.0 | **+4%** | Element at peak power — fully expressed |
| 相 Phase | ×0.8 | **+2%** | Strong — generated by dominant element |
| 休 Resting | ×0.6 | **+1%** | Moderate — supportive role |
| 囚 Imprisoned | ×0.4 | **−2%** | Weakened — constrained by season |
| 死 Dead | ×0.2 | **−4%** | At its weakest — nearly dormant |

### The Full 12-Month Seasonal Adjustment Table

| Month | Branch | Season | Wood | Fire | Earth | Metal | Water |
|-------|--------|--------|------|------|-------|-------|-------|
| Feb | 寅 Tiger | Spring | **+4%** | +2% | −2% | −4% | +1% |
| Mar | 卯 Rabbit | Spring | **+4%** | +2% | −2% | −4% | +1% |
| Apr | 辰 Dragon | Late Spring | +2% | −2% | **+4%** | −4% | +1% |
| May | 巳 Snake | Summer | +1% | **+4%** | +2% | −4% | −2% |
| Jun | 午 Horse | Summer | +1% | **+4%** | +2% | −2% | −4% |
| Jul | 未 Goat | Late Summer | −2% | +2% | **+4%** | +1% | −4% |
| Aug | 申 Monkey | Early Autumn | −4% | +1% | +2% | **+4%** | −2% |
| Sep | 酉 Rooster | Autumn | −4% | −2% | +1% | **+4%** | +2% |
| Oct | 戌 Dog | Late Autumn | −2% | −4% | **+4%** | +2% | +1% |
| Nov | 亥 Pig | Winter | +2% | −4% | −2% | +1% | **+4%** |
| Dec | 子 Rat | Deep Winter | +1% | −4% | −2% | +2% | **+4%** |
| Jan | 丑 Ox | Late Winter | −2% | −4% | **+4%** | +1% | +2% |

**Bold** marks the dominant element (旺 Prosperous, +4%) for each month.

Earth pivot months (辰未戌丑) always have Earth as dominant — these are the classical 四季土 transition months where Earth reasserts itself between seasons.

Each row sums to **+1%** — a slight net positive that reflects seasonal Qi vitality.
`;

// ============================================================================
// BRQ PIPELINE MD — Steps 5, 5.5, 6 explanation
// ============================================================================

const REMEDY_ENGINE_MD = `## Step 4.5 — Remedy Conversion Engine

### The Problem
A bracelet **cannot remove** Qi — it can only **add** stones that carry elemental Qi.
When Step 4 shows a negative BRQ (e.g., Metal −5.131), the bracelet cannot simply extract Metal.
Instead, it must add other elements that **control** or **drain** the excess.

---

### Wu Xing Interaction Matrix

Each remedy element reduces targets via two mechanisms:

| Remedy Added | 克 Control (0.75) | 泄 Drain (0.25) |
|---|---|---|
| **Wood** | Earth −0.75 | Water −0.25 |
| **Fire** | Metal −0.75 | Wood −0.25 |
| **Earth** | Water −0.75 | Fire −0.25 |
| **Metal** | Wood −0.75 | Earth −0.25 |
| **Water** | Fire −0.75 | Metal −0.25 |

- **克 Control (0.75)**: Strong — the element *overcomes* the target (Fire melts Metal)
- **泄 Drain (0.25)**: Gentle — the target *exhausts itself* producing the remedy (Metal produces Water, draining Metal)

Adding 1 unit of a remedy simultaneously reduces **both** its targets.

---

### Processing Order

1. **Detect** all excessive elements (negative BRQ from Step 4)
2. **Sort** by severity — largest wound first
3. **For each** excess element:
   - Find all remedy elements that affect it (control + drain)
   - Exclude **forbidden** remedies:
     - Yong Shen forbidden / threat elements
     - Elements that are themselves excessive (negative BRQ)
   - Apply strongest remedy first (controller before drainer)
   - **Cap** by floor constraints — stop before any element drops below its floor
4. **Re-check** remaining excess elements — prior remedies may have already resolved them

---

### Floor Protection

Each element has a floor = the minimum Qi it must maintain:

\`\`\`
floor(e) = natal_TFQ(e) × (1 − f)
\`\`\`

Where **f** is the **tolerance slider** (0% → 25%):

| f | Label | Effect |
|---|---|---|
| **0%** | Conservative | Strict natal TFQ floor — no element dips below its birth signature |
| **10%** | Moderate | Allows mild 10% dip for better correction |
| **20%** | Flexible | Willing to bend natal floors for stronger excess reduction |
| **25%** | Aggressive | Maximum correction — natal floors relaxed by 25% |

The floor prevents the remedy from *creating* a new imbalance while fixing the original one.

---

### Cross-Element Effects

**Critical insight**: Adding a remedy affects **multiple** elements simultaneously.

Example — adding Water to drain Metal:
- Water **controls** Fire (−0.75 per unit) ← this is a *side effect*
- Water **drains** Metal (−0.25 per unit) ← this is the *intended* effect

So if Fire is already near its floor, the engine **must stop** adding Water even if Metal still has excess.
This is why the floor check examines *all* targets of the remedy, not just the intended one.

---

### What "Resolved by Prior Round" Means

When Metal is processed first and Water is added, that Water also reduces Fire (克 0.75).
If this reduction drops Fire below its original excess level, Fire becomes a *deficit* instead.
Step #2 will then show: **"Already resolved — New BRQ: +X.XXX (now needs boosting)"**

This means the Fire excess was *over-corrected* as a side effect of the Metal remedy.
The new positive BRQ for Fire will flow into Steps 5–12 as a boost target.

---

### Step 4.6 — Qi After Remedy

Shows the updated MTFQ state after all remedy conversions:
- **+remedy**: Qi units added (e.g., Water stones)
- **−reduced**: Qi reduced by control/drain effects
- **After**: New effective MTFQ
- **Gap**: Distance to MIFQ (ideal) — feeds into Step 5

---

### Summary

| Concept | Value |
|---|---|
| Control coefficient (克) | 0.75 |
| Drain coefficient (泄) | 0.25 |
| Floor formula | natal × (1 − f) |
| Tolerance range (f) | 0% → 25% |
| Processing order | Largest excess first |
| Forbidden sources | Yong Shen + excess elements |
| Cross-effects | All targets checked against floors |
`;

const BRQ_PIPELINE_MD = `## BRQ Pipeline — Effectiveness, Safety Limit & Capping

Steps 5, 5.5, and 6 work together as a **two-slider control system** that determines how much correction the bracelet actually delivers.

---

### Step 5: Effectiveness Slider (s)

**What it controls:** How much of the ideal correction (BRQ) the bracelet *attempts*.

\`\`\`
BRQ_eff(e) = BRQ(e) x s
\`\`\`

| Slider | Meaning |
|--------|---------|
| 10% | Conservative — bracelet barely tries |
| 35% (default) | Moderate — standard bracelet influence |
| 50% | Aggressive — bracelet pushes hard |

**Think of it as:** The bracelet's *ambition*. Higher = more aggressive correction attempt.

---

### Step 5.5: Safety Limit (k)

**What it controls:** The maximum fraction of each element's wound the bracelet is *allowed* to close.

\`\`\`
cap(e) = k x |BRQ(e)|
\`\`\`

The cap is based on the **raw wound** (BRQ), not the attempt (BRQ_eff). This is what makes the two sliders interact:

| Slider | Meaning |
|--------|---------|
| 25% | Strict — bracelet can close at most 25% of each wound |
| 50% (default) | Moderate — up to half the wound |
| 75% | Permissive — bracelet has wide latitude |

**Think of it as:** The bracelet's *safety limit*. Higher = more correction allowed.

---

### Step 6: Apply Cap → BRQₑ

\`\`\`
BRQₑ(e) = clamp(BRQ_eff(e), -cap(e), +cap(e))
\`\`\`

This is where the two sliders meet:

- If **s < k** → BRQ_eff is within the cap → **no capping** (bracelet delivers its full attempt)
- If **s > k** → BRQ_eff exceeds the cap → **capping kicks in** (correction is limited)
- If **s = k** → borderline, just touching the cap

---

### How the Two Sliders Interact

| s (effectiveness) | k (safety) | Capped? | Why |
|---|---|---|---|
| 10% | 25% | No | 10 < 25 — attempt within safety |
| 35% | 50% | No | 35 < 50 — default settings, no capping |
| 45% | 30% | **Yes** | 45 > 30 — attempt exceeds safety |
| 50% | 25% | **Yes** | 50 > 25 — aggressive attempt, strict safety |
| 50% | 75% | No | 50 < 75 — permissive safety allows it |

### Key Insight

> **s** controls how hard the bracelet *tries*.
> **k** controls how much it's *allowed* to achieve.
> Together they create a proportional, per-element correction that feels alive.

### Per-Element Caps

Unlike a global flat cap, each element gets its own cap proportional to its wound:

- **Big wound** (e.g., Metal -6.6) → big cap (e.g., ±3.3 at k=50%)
- **Small wound** (e.g., Earth +1.8) → small cap (e.g., ±0.9 at k=50%)

This ensures the bracelet respects each element's scale — no more "everything capped at the same number."

### The Full Chain Per Element

\`\`\`
BRQ(e)  →  x s  →  BRQ_eff(e)  →  clamp(±cap)  →  BRQₑ(e)
(wound)    (try)    (attempt)      (safety)        (final)
\`\`\`
`;

// ============================================================================
// MTFQ FORMULA MD — Background, Classical BaZi Relation
// ============================================================================

const SYNERGY_MD = `## Synergy — 生 Wu Xing Generation Amplification

### Position in Pipeline

\`\`\`
Natal Pipeline → NTFQ
                          ↓
DaYun (raw) → Scale → DaYun′ ─┐
Year  (raw) → Scale → Year′  ─┤→ ★ SYNERGY ★ → DaYun″ Year″ Month″
Month (raw) → Scale → Month′ ─┘
                                        ↓
              MTFQ = 1.0×NTFQ + 0.9×DaYun″ + 0.5×Year″ + 0.3×Month″
\`\`\`

Synergy sits **after NTFQ-scaling** and **before MTFQ blending**.
It modifies only external layers (DaYun, Year, Month) — **never NTFQ**.

### Classical Foundation

The Wu Xing producing (生 shēng) cycle:

| Generator | Generated | Classical meaning |
|-----------|-----------|-------------------|
| Wood 木 | Fire 火 | Wood feeds Fire |
| Fire 火 | Earth 土 | Fire creates Earth (ash) |
| Earth 土 | Metal 金 | Earth bears Metal (ore) |
| Metal 金 | Water 水 | Metal enriches Water (condensation) |
| Water 水 | Wood 木 | Water nourishes Wood |

### Key Metaphysical Property

This is **generative**, not conservative:
- The generator does **NOT** lose Qi
- The generated element **GAINS** Qi
- Qi is **created** through transformation
- This is not a closed system — it is a catalytic process

### The Math

For each generator → generated pair:

\`\`\`
gain[generated] += κ_eff × External[generator]
\`\`\`

Where:
- **κ_base = 0.2** (synergy coefficient)
- **E** = generator's seasonal expressiveness (0.2–1.0, from 旺相休囚死 matrix)
- **S** = synergy factor = 0.8 + 0.4 × (E − 0.2) / 0.8 → range **0.8–1.2**
- **κ_eff = κ_base × S** (effective coefficient, season-modulated)
- **External** = DaYun′ + Year′ + Month′ (post-scaling, pre-synergy)

| Expressiveness | Season state | S factor | κ_eff |
|---------------|-------------|----------|-------|
| E = 0.2 (Dead) | Out of season | 0.80 | 0.160 |
| E = 0.6 (Resting) | Neutral | 1.00 | 0.200 |
| E = 1.0 (Prosperous) | Peak season | 1.20 | 0.240 |

### Example (step by step, March — Wood prosperous)

\`\`\`
External = { Wood: 0.18, Fire: 0.12, Earth: 0.08, Metal: 0.15, Water: 0.10 }
Season: 卯 (March) — Wood E=1.0, Fire E=0.8, Earth E=0.4, Metal E=0.2, Water E=0.6

Wood  → Fire:   κ=0.2 × S=1.20 (E=1.0) × 0.18 = κ_eff 0.240 × 0.18 = +0.043 Fire
Fire  → Earth:  κ=0.2 × S=1.10 (E=0.8) × 0.12 = κ_eff 0.220 × 0.12 = +0.026 Earth
Earth → Metal:  κ=0.2 × S=0.90 (E=0.4) × 0.08 = κ_eff 0.180 × 0.08 = +0.014 Metal
Metal → Water:  κ=0.2 × S=0.80 (E=0.2) × 0.15 = κ_eff 0.160 × 0.15 = +0.024 Water
Water → Wood:   κ=0.2 × S=1.00 (E=0.6) × 0.10 = κ_eff 0.200 × 0.10 = +0.020 Wood

Gains = { Wood: +0.020, Fire: +0.043, Earth: +0.026, Metal: +0.014, Water: +0.024 }
Total new Qi = 0.127 pts
\`\`\`

### Full 12-Month Synergy Matrix

Each cell: **E** (expressiveness) → **S** (factor) → **κ_eff**

| Month | Branch | Wood→Fire | Fire→Earth | Earth→Metal | Metal→Water | Water→Wood |
|-------|--------|-----------|------------|-------------|-------------|------------|
| Feb | 寅 | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** | E=0.4 S=0.90 **κ=.180** | E=0.2 S=0.80 **κ=.160** | E=0.6 S=1.00 **κ=.200** |
| Mar | 卯 | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** | E=0.4 S=0.90 **κ=.180** | E=0.2 S=0.80 **κ=.160** | E=0.6 S=1.00 **κ=.200** |
| Apr | 辰 | E=0.8 S=1.10 **κ=.220** | E=0.4 S=0.90 **κ=.180** | E=1.0 S=1.20 **κ=.240** | E=0.2 S=0.80 **κ=.160** | E=0.6 S=1.00 **κ=.200** |
| May | 巳 | E=0.6 S=1.00 **κ=.200** | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** | E=0.2 S=0.80 **κ=.160** | E=0.4 S=0.90 **κ=.180** |
| Jun | 午 | E=0.6 S=1.00 **κ=.200** | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** | E=0.4 S=0.90 **κ=.180** | E=0.2 S=0.80 **κ=.160** |
| Jul | 未 | E=0.4 S=0.90 **κ=.180** | E=0.8 S=1.10 **κ=.220** | E=1.0 S=1.20 **κ=.240** | E=0.6 S=1.00 **κ=.200** | E=0.2 S=0.80 **κ=.160** |
| Aug | 申 | E=0.2 S=0.80 **κ=.160** | E=0.6 S=1.00 **κ=.200** | E=0.8 S=1.10 **κ=.220** | E=1.0 S=1.20 **κ=.240** | E=0.4 S=0.90 **κ=.180** |
| Sep | 酉 | E=0.2 S=0.80 **κ=.160** | E=0.4 S=0.90 **κ=.180** | E=0.6 S=1.00 **κ=.200** | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** |
| Oct | 戌 | E=0.4 S=0.90 **κ=.180** | E=0.2 S=0.80 **κ=.160** | E=1.0 S=1.20 **κ=.240** | E=0.8 S=1.10 **κ=.220** | E=0.6 S=1.00 **κ=.200** |
| Nov | 亥 | E=0.8 S=1.10 **κ=.220** | E=0.2 S=0.80 **κ=.160** | E=0.4 S=0.90 **κ=.180** | E=0.6 S=1.00 **κ=.200** | E=1.0 S=1.20 **κ=.240** |
| Dec | 子 | E=0.6 S=1.00 **κ=.200** | E=0.2 S=0.80 **κ=.160** | E=0.4 S=0.90 **κ=.180** | E=0.8 S=1.10 **κ=.220** | E=1.0 S=1.20 **κ=.240** |
| Jan | 丑 | E=0.4 S=0.90 **κ=.180** | E=0.2 S=0.80 **κ=.160** | E=1.0 S=1.20 **κ=.240** | E=0.6 S=1.00 **κ=.200** | E=0.8 S=1.10 **κ=.220** |

**Patterns:** Spring → Wood→Fire strongest. Summer → Fire→Earth strongest. Autumn → Metal→Water strongest. Winter → Water→Wood strongest. Earth pivots → Earth→Metal strongest.

### Redistribution

Gains are distributed back into DaYun/Year/Month **proportionally** to each layer's original share:

\`\`\`
DaYun″[el] = (DaYun′[el] / extBefore) × extAfter
Year″[el]  = (Year′[el]  / extBefore) × extAfter
Month″[el] = (Month′[el] / extBefore) × extAfter
\`\`\`

### Why This Was Impossible Before NTFQ-Scaling

Before scaling, external layers were 3–7× larger than NTFQ.
Synergy would have caused **runaway amplification**.
Now all layers have equal mass — synergy is a small, controlled boost.

### What Synergy IS and IS NOT

**IS:** A computational translation of classical Wu Xing generation physics
**IS:** Additive (Qi is created, not transferred)
**IS:** Applied only to external climate layers

**IS NOT:** Classical BaZi numerical computation
**IS NOT:** A conservation rule or zero-sum exchange
**IS NOT:** Applied to NTFQ (natal constitution is untouched)
`;

const MTFQ_FORMULA_MD = `## MTFQ — Monthly Total Functional Qi

### The Formula

\`\`\`
MTFQ = 1.0 × NTFQ + 0.9 × DaYun + 0.5 × Year + 0.3 × Month
\`\`\`

This is a **linear combination** — a relative weighting formula, not a percentage distribution.

---

### What the Coefficients Mean

The coefficients are **relative influence weights**:

| Layer | Weight | Role |
|:------|:------:|:-----|
| Natal (NTFQ) | 1.0 | Strongest — your constitutional structure |
| Da Yun (10-yr) | 0.9 | Almost as strong — the decade's climate |
| Year | 0.5 | Moderate — the annual weather |
| Month | 0.3 | Lightest — the monthly weather |

They tell the engine:

- Natal Qi has the strongest influence
- Da Yun is almost as strong (it shapes the entire decade)
- Year is moderate
- Month is lighter

They do **not** mean "Da Yun = 0.9 / 2.7 = 33%." The formula is not a normalized percentage model — it is a weighted additive blend.

---

### Normalized Weights (for comparison only)

If you normalize the weights (sum = 2.7):

| Layer | Weight | Normalized |
|:------|:------:|:----------:|
| Natal (NTFQ) | 1.0 | 37.0% |
| Da Yun | 0.9 | 33.3% |
| Year | 0.5 | 18.5% |
| Month | 0.3 | 11.1% |

---

### Classical BaZi Influence Hierarchy

Classical BaZi texts never express influence as percentages, but every major lineage agrees on the implicit hierarchy:

| Layer | Classical Influence | Why |
|:------|:-------------------:|:----|
| Natal Chart (命局) | 100% baseline | Defines Day Master, structure, capacity |
| Da Yun (大運) | 30–40% | Climate of the decade — lasts 10 years |
| Annual Luck (流年) | 25–30% | Yearly weather — shapes opportunities |
| Monthly Luck (流月) | 15–20% | Monthly weather — short-term shifts |
| Daily/Hourly | 5–10% | Triggers, not structure |

The classical principle:

> **"大運為主，流年為輔"**
> *Da Yun is primary, Annual Luck is secondary.*

Da Yun is the strongest external influence because:

- It lasts 10 years
- It shapes the entire decade's opportunities
- It determines whether annual luck is supportive or destructive
- It sets the "direction" of the decade (官, 財, 印, 食傷, 比劫)
- It can flip the entire chart structure (e.g., into 從格 Cong Ge)

---

### Why the MTFQ Formula Matches Classical BaZi

The normalized MTFQ weights:

- Da Yun = 33.3% → classical says 30–40% ✓
- Year = 18.5% → classical says 25–30% (slightly lower)
- Month = 11.1% → classical says 15–20% (slightly lower)

The MTFQ formula is essentially a **computational mirror** of classical BaZi weighting.

---

### Why the Formula Works

Because it reflects the physics of influence:

- **Duration**: 10 years > 1 year > 1 month
- **Impact**: Da Yun > Year > Month
- **Stability**: Natal > everything

The formula captures:

- Natal TFQ **anchors** the structure
- Da Yun **tilts** the decade
- Year **tilts** the annual weather
- Month **tilts** the monthly weather

Each layer adds its Qi contribution weighted by how much it should influence the final blend. The result — MTFQ — is the **total Qi field** for a given month, combining all four temporal layers.

---

### What MTFQ Is Not

- MTFQ is **not** natal Qi (that is TFQ)
- MTFQ is **not** environmental Qi (that is Year + Month alone)
- MTFQ is **not** ideal Qi (that is MIFQ)
- MTFQ is the **actual Qi climate** — what you are living in right now

It is the starting point for everything downstream:
BRQ, BRQe, and the bracelet prescription.

---

### Input Layers Explained

**NTFQ (Natal Total Functional Qi)**
Your natal TFQ after the survival pipeline: Combinations → Clashes → Harms → Punishments → Control Cycle → Sheng Cycle → Overcrowding → Transformations → Yong Shen. This is your processed constitutional Qi.

**Da Yun Qi**
The 10-year luck pillar's Qi contribution, processed through its own Seasonality → Polarity pipeline. Stem = 1 pt, Branch = 10 pts (with hidden stems distributed by classical percentages).

**Year Qi**
The annual pillar's Qi contribution, same pipeline as Da Yun.

**Month Qi**
The monthly pillar's Qi contribution, same pipeline as Da Yun.

Only natal TFQ goes through the full survival pipeline. External layers use a simpler Seasonality → Polarity pipeline because they represent **environmental influence**, not **constitutional structure**.

---

### Classical BaZi Weighting Model

How classical lineages implicitly weight influences:

\`\`\`
            ┌──────────────────────────┐
            │      Natal Chart         │
            │   (100% structural base) │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │        Da Yun            │
            │   (~30–40% influence)    │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │        Annual            │
            │   (~25–30% influence)    │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │        Monthly           │
            │   (~15–20% influence)    │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │     Daily / Hourly       │
            │     (~5–10% triggers)    │
            └──────────────────────────┘
\`\`\`

---

### Your Engine's Weighting Model (Actual Formula)

\`\`\`
MTFQ = 1.0 × NTFQ + 0.9 × DaYun + 0.5 × Year + 0.3 × Month

            ┌──────────────────────────┐
            │      Natal TFQ           │
            │        weight 1.0        │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │       Da Yun Qi          │
            │        weight 0.9        │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │        Year Qi           │
            │        weight 0.5        │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │       Month Qi           │
            │        weight 0.3        │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │          MTFQ            │
            │  (Monthly Total Func Qi) │
            └──────────────────────────┘
\`\`\`

This is a weighted sum, not a percentage model.

---

### Normalized Percentage Model

Sum of weights: 1.0 + 0.9 + 0.5 + 0.3 = **2.7**

\`\`\`
         NORMALIZED WEIGHTING MODEL
         (Your Engine → Classical BaZi)

            ┌──────────────────────────┐
            │      Natal TFQ           │
            │        37.0%             │
            │  (classical: baseline)   │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │        Da Yun            │
            │        33.3%             │
            │  (classical: 30–40%)     │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │         Year             │
            │        18.5%             │
            │  (classical: 25–30%)     │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │         Month            │
            │        11.1%             │
            │  (classical: 15–20%)     │
            └──────────────────────────┘
\`\`\`

The engine's normalized weights match the classical BaZi hierarchy almost perfectly — Da Yun at 33.3% sits squarely in the classical 30–40% range.

---

### 3D Qi Vector Model — How Da Yun Tilts the Year

Each month is a point in 3D Qi space:

- **X-axis** → Natal TFQ (structural baseline — never changes)
- **Y-axis** → Da Yun Qi (10-year climate — tilts the decade)
- **Z-axis** → Annual + Monthly Qi (short-term weather)

\`\`\`
Q_month = (1.0 × NTFQ)x + (0.9 × DaYun)y + (0.5 × Year + 0.3 × Month)z
\`\`\`

**Natal TFQ** is the floor plane — the base terrain of the person's life. It defines Day Master strength, rooting, season, hidden stems, and chart structure.

**Da Yun** is the tilt vector. A Water-heavy Da Yun (e.g., 戊子 Yang Earth Rat) creates a massive Y-axis vector pointing toward Water, tilting the entire Qi space for the decade.

**Annual + Monthly Qi** is the vertical displacement. A Water month on top of a Water Da Yun creates a Z-axis spike rising sharply in the Water direction.

\`\`\`
                Z (Month/Year)
                ↑
                |
                |      * ← May Qi vector
                |     /
                |    /
                |   /    (Water spike + Water tilt
                |  /      = diagonal into Water quadrant)
                | /
                |/
────────────────+────────────────→ X (Natal)
               /
              /
             / ← Da Yun tilt
            /
           ↓
          Y (Da Yun)
\`\`\`

Da Yun tilts the entire Qi space toward its dominant element, and the monthly Qi adds a vertical spike on top of that tilt — producing extreme MTFQ shapes when they align.

---

### 4D Qi Vector Model — Adding Polarity

The 4th axis adds **directional spin** to the Qi vector:

- **X-axis** → Natal TFQ (structure)
- **Y-axis** → Da Yun Qi (decade climate)
- **Z-axis** → Year + Month Qi (weather)
- **W-axis** → Polarity (Yin/Yang orientation)

\`\`\`
Q_4D = (NTFQ, DaYun, YearMonth, Polarity)
\`\`\`

Polarity is not magnitude — it is **directional spin**:

| Polarity | Effect | Bracelet Response |
|:---------|:-------|:------------------|
| Yang | Pushes Qi outward — expansion, projection | Right wrist (出氣 Release) |
| Yin | Pulls Qi inward — contraction, absorption | Left wrist (吸氣 Receive) |

Polarity modifies how Qi interacts with:

- Season (seasonal expressiveness)
- Da Yun (decade amplification)
- Month (monthly weather)
- Day Master (strength/weakness)
- Collapse patterns (expand vs contract)
- Remedy direction (absorb vs release)

In the engine, polarity affects:

- QiUnit calculation per stone
- BRQe correction vector
- Controller stone eligibility
- Wrist assignment (吸氣 vs 出氣)
- Bead sequencing (Yin/Yang alternation)

---

### How the 4D Vector Produces the Bracelet

\`\`\`
  X (Natal)     → defines terrain + Day Master
        │
        ▼
  Y (Da Yun)    → tilts the decade
        │
        ▼
  Z (Year+Month) → spikes the weather
        │
        ▼
  W (Polarity)   → determines spin direction
        │
        ▼
  ┌────────────────────────────┐
  │   4D Qi Vector             │
  │   = MTFQ shape + polarity  │
  └─────────────┬──────────────┘
                │
                ▼
  ┌────────────────────────────┐
  │   Collapse Detection       │
  │   + Yong Shen Analysis     │
  └─────────────┬──────────────┘
                │
                ▼
  ┌────────────────────────────┐
  │   MIFQ (Ideal Target)     │
  └─────────────┬──────────────┘
                │
                ▼
  ┌────────────────────────────┐
  │   BRQe (Correction Vector) │
  └─────────────┬──────────────┘
                │
                ▼
  ┌────────────────────────────┐
  │   Bracelet Prescription    │
  │   stones + sequence + wrist│
  └────────────────────────────┘
\`\`\`

> **In one sentence:** Natal defines the terrain, Da Yun tilts the decade, the month spikes the weather, and polarity determines whether the Qi expands or collapses — together forming a 4D vector that dictates the exact remedy.
`;



// ============================================================================
// QI PIPELINE FLOW MD — TFQ → NTFQ → MTFQ → IFQ → BRQ
// ============================================================================

const QI_PIPELINE_FLOW_MD = `## Qi Pipeline — From Soul to Bracelet

The complete flow of Qi transformation, from your natal constitution to the bracelet on your wrist.

---

### 1. TFQ — Total Functional Qi (Soul)

Your constitutional Qi — the pure, unmodified elemental distribution from your Four Pillars.

> Represents **who you ARE**.

---

### 2. NTFQ — Natal Total Functional Qi (Internal Physics)

TFQ after all internal interactions:

| Stage | Chinese | What Happens |
|-------|---------|-------------|
| Combinations | 合 | Stems and branches bond, may transform |
| Clashes | 冲 | Controlling cycle — elements suppress each other |
| Harms | 害 | Harm interactions between branches |
| Punishments | 刑 | Self-punishment and mutual punishment |
| Control Cycle | 克 | Universal friction between all elements |
| Overcrowding | 溢 | Dominant elements overflow into children |
| Collapse | 崩 | Structural pattern detection |
| Transformations | 化 | Extreme pressure causes transmutation |
| Structure | 格局 | Classical BaZi structure classification |
| Ten Gods | 十神 | Relational roles between elements |
| Yong Shen | 用神 | The Useful God — your medicine element |

> Reveals your **TRUE natal operating system**.

---

### 3. MTFQ — Monthly Total Functional Qi (Environment)

The external Qi climate of THIS specific month:

\`\`\`
MTFQ = 1.0 x NTFQ + 0.9 x DaYun + 0.5 x Year + 0.3 x Month
\`\`\`

Each external layer (DaYun, Year, Month) goes through its own pipeline:
Stem + Branch → Seasonality → Polarity → Layer Qi

> Represents the **battlefield you walk through** this month.

---

### 4. IFQ — Ideal Functional Qi (Target State)

The optimal Qi shape for this person this month:

\`\`\`
IFQ = BalancedQi (20%) + YongShenAdj + SeasonalAdj → Normalize to MTFQ total
\`\`\`

| Component | What it does |
|-----------|-------------|
| BalancedQi | Neutral 20/20/20/20/20 baseline |
| YongShenAdj | Personal correction (+6% primary, +4% secondary, -6% forbidden, -4% threat) |
| SeasonalAdj | Monthly correction aligned with seasonal strength (旺相休囚死) |
| Normalize | Scale so IFQ total = MTFQ total (same Qi budget) |

> The **destination** — who you should be this month.

---

### 5. BRQ — Bracelet Qi Output (Correction)

The correction vector that moves you from where you are to where you should be:

\`\`\`
BRQ = IFQ - MTFQ
\`\`\`

| BRQ Value | Meaning | Bracelet Action |
|-----------|---------|----------------|
| Positive (+) | Element deficit | **Boost** — add stones of this element |
| Negative (-) | Element excess | **Reduce** — avoid stones of this element |
| Near zero | Already balanced | No correction needed |

> The **vehicle** — how the bracelet gets you there.

---

### Relationship Summary

| Qi State | Meaning | Role |
|----------|---------|------|
| **TFQ** | Soul baseline | Who you are |
| **NTFQ** | Natal after internal physics | How the soul behaves |
| **MTFQ** | Monthly environment | The world you walk through |
| **IFQ** | Ideal monthly target | Who you should be this month |
| **BRQ** | Bracelet Qi | The correction needed to reach IFQ |

---

**TFQ** is who you are → **NTFQ** is how you behave → **MTFQ** is the month you're in → **IFQ** is who you should be this month → **BRQ** is how the bracelet gets you there.
`;

// ============================================================================
// SEASONAL ROW — group of 3 months
// ============================================================================

function SeasonRow({ season, months, expandedMonths, setExpandedMonths, dayMasterPolarity, dayMasterElement, year, userTfq, chart, qiMatrix, profileBirthDate, profileBirthTime, profileGender, profileName, age, dmStrengthAdj, dmStrengthScore }) {
  if (!months || months.length === 0) return null;

  return (
    <section className={`rounded-xl border p-4 ${SEASON_BG[season] || 'border-white/10 bg-white/5'}`}>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-lg font-bold text-white">
          {SEASON_EMOJI[season] || ''} {season}
        </h3>
        {profileName && (
          <span className="text-xs text-gray-400 font-mono">
            {profileName}, Year: {year}, {age} years old
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {months.map(m => (
          <MonthCard
            key={m.monthIndex}
            snapshot={m}
            expanded={!!expandedMonths[m.monthIndex]}
            onToggle={() => setExpandedMonths(prev => ({
              ...prev,
              [m.monthIndex]: !prev[m.monthIndex],
            }))}
            dayMasterPolarity={dayMasterPolarity}
            dayMasterElement={dayMasterElement}
            year={year}
            userTfq={userTfq}
            chart={chart}
            qiMatrix={qiMatrix}
            profileBirthDate={profileBirthDate}
            profileBirthTime={profileBirthTime}
            profileGender={profileGender}
            dmStrengthAdj={dmStrengthAdj}
            dmStrengthScore={dmStrengthScore}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// PIPELINE DIAGRAM — pure SVG, no external dependencies
// ============================================================================

const PIPELINE_NODES = [
  { id: 'atfq',      label: 'ATFQ (60%)',             sub: 'Natal Qi',       x: 40,  y: 20,  w: 140, h: 44, fill: '#1e3a5f', stroke: '#3b82f6' },
  { id: 'acymfq',    label: 'ACYMFQ (40%)',            sub: 'Transit Qi',     x: 260, y: 20,  w: 140, h: 44, fill: '#5f3a1e', stroke: '#f59e0b' },
  { id: 'ntfq',      label: 'NTFQ Blend',              sub: '60% + 40%',     x: 140, y: 90,  w: 160, h: 36, fill: '#2d1b4e', stroke: '#a855f7' },
  { id: 'void',      label: 'Void (空亡)',              sub: 'Weaken void branches', x: 140, y: 150, w: 160, h: 36, fill: '#2f1f3f', stroke: '#c084fc' },
  { id: 'combos',    label: 'Combinations (合化)',       sub: '合/六合/三合/三会', x: 140, y: 210, w: 160, h: 40, fill: '#3f2f0f', stroke: '#f59e0b' },
  { id: 'passA',     label: 'Pass A: Natal 克',        sub: 'Internal',       x: 40,  y: 280, w: 140, h: 40, fill: '#3f1515', stroke: '#ef4444' },
  { id: 'passB',     label: 'Pass B: Transit 克',      sub: 'Internal',       x: 260, y: 280, w: 140, h: 40, fill: '#3f1515', stroke: '#ef4444' },
  { id: 'passC',     label: 'Pass C: Transit→Natal 克', sub: 'Directional',   x: 110, y: 350, w: 220, h: 40, fill: '#5f0f0f', stroke: '#dc2626' },
  { id: 'recombine', label: 'Recombine',               sub: 'Merge pools',    x: 140, y: 420, w: 160, h: 36, fill: '#2d1b4e', stroke: '#a855f7' },
  { id: 'sheng',     label: 'Sheng (生)',               sub: '+3%, cap 20%',   x: 140, y: 480, w: 160, h: 36, fill: '#0f3f1a', stroke: '#22c55e' },
  { id: 'overcrowd', label: 'Overcrowding (溢)',        sub: '10% bleed-off',  x: 140, y: 540, w: 160, h: 36, fill: '#2f3f0f', stroke: '#84cc16' },
  { id: 'damping',   label: 'Damping (耗)',             sub: 'All × 0.98',    x: 140, y: 600, w: 160, h: 36, fill: '#1f1f1f', stroke: '#6b7280' },
  { id: 'transform', label: 'Transform (化)',           sub: '30% transmute',  x: 140, y: 660, w: 160, h: 36, fill: '#3f2f0f', stroke: '#eab308' },
  { id: 'mtfq',      label: 'TotalQi Output',             sub: 'MTFQ',           x: 140, y: 730, w: 160, h: 40, fill: '#0f2f1f', stroke: '#10b981' },
];

const PIPELINE_EDGES = [
  { from: 'atfq', to: 'ntfq' },
  { from: 'acymfq', to: 'ntfq' },
  { from: 'ntfq', to: 'void' },
  { from: 'void', to: 'combos' },
  { from: 'combos', to: 'passA' },
  { from: 'combos', to: 'passB' },
  { from: 'passA', to: 'passC' },
  { from: 'passB', to: 'passC', dashed: true },
  { from: 'passB', to: 'recombine', dashed: true },
  { from: 'passC', to: 'recombine' },
  { from: 'recombine', to: 'sheng' },
  { from: 'sheng', to: 'overcrowd' },
  { from: 'overcrowd', to: 'damping' },
  { from: 'damping', to: 'transform' },
  { from: 'transform', to: 'mtfq' },
];

function PipelineDiagram() {
  const nodeMap = {};
  PIPELINE_NODES.forEach(n => { nodeMap[n.id] = n; });

  return (
    <svg viewBox="0 0 440 790" className="w-full max-w-md mx-auto" style={{ height: 790 }}>
      {/* Edges */}
      {PIPELINE_EDGES.map((e, i) => {
        const from = nodeMap[e.from];
        const to = nodeMap[e.to];
        const x1 = from.x + from.w / 2;
        const y1 = from.y + from.h;
        const x2 = to.x + to.w / 2;
        const y2 = to.y;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={from.stroke}
            strokeWidth={1.5}
            strokeDasharray={e.dashed ? '5 4' : undefined}
            opacity={0.6}
          />
        );
      })}
      {/* Nodes */}
      {PIPELINE_NODES.map(n => (
        <g key={n.id}>
          <rect
            x={n.x} y={n.y} width={n.w} height={n.h}
            rx={8} fill={n.fill} stroke={n.stroke} strokeWidth={1.5}
          />
          <text x={n.x + n.w / 2} y={n.y + (n.sub ? 16 : n.h / 2 + 4)} textAnchor="middle"
            fill="#fff" fontSize={11} fontWeight="600" fontFamily="monospace"
          >
            {n.label}
          </text>
          {n.sub && (
            <text x={n.x + n.w / 2} y={n.y + 30} textAnchor="middle"
              fill="#aaa" fontSize={9} fontFamily="monospace"
            >
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ============================================================================
// QI EDUCATION PANEL — Beginner / Intermediate / Advanced toggle
// ============================================================================

const EDUCATION_LEVELS = [
  { key: 'beginner',     label: 'Beginner',     color: 'bg-green-600',  content: BEGINNER_EXPLANATION_MD },
  { key: 'intermediate', label: 'Intermediate',  color: 'bg-blue-600',   content: INTERMEDIATE_EXPLANATION_MD },
  { key: 'advanced',     label: 'Advanced',      color: 'bg-purple-600', content: ADVANCED_EXPLANATION_MD },
];

function QiEducationPanel() {
  const [level, setLevel] = useState('beginner');
  const [open, setOpen] = useState(false);

  const current = EDUCATION_LEVELS.find(l => l.key === level);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-200">
          Understanding the Pipeline — How Your Monthly Qi Is Refined
        </span>
        <span className="text-gray-500 text-lg">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="px-4 py-4 space-y-4">
          {/* Interactive pipeline diagram with education mode */}
          <QiPipelineFlow className="h-[500px]" educationMode={level === 'advanced'} />

          {/* Level toggle */}
          <div className="flex justify-center">
            <EducationLevelToggle level={level} onChange={setLevel} />
          </div>

          {/* Content */}
          <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-4 max-h-[500px] overflow-y-auto text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
            {current?.content}
          </div>

          {/* Collapse Mode Simulator — interactive slider sandbox */}
          <CollapseModeSimulator />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// YEAR STORY MONTH DETAIL — renders inside YearInsightsPanel narrative tab
// Reuses IncomingPillarWithFlap + CombinedYMFQPanel so the UI is identical
// to the main Monthly Qi Analysis section.
// ============================================================================

// ============================================================================
// NATAL PIPELINE PANEL — Qi Survival Timeline
// ============================================================================

function NatalPipelinePanel({ pipelineResult }) {
  const [openStages, setOpenStages] = useState({});
  const [showMetaphysical, setShowMetaphysical] = useState({});

  if (!pipelineResult || !pipelineResult.stages) return null;

  const { stages, inputQi, outputQi } = pipelineResult;

  const toggleStage = (key) => {
    setOpenStages(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMeta = (key) => {
    setShowMetaphysical(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute max value across all stages for consistent bar scaling
  const allVals = stages.flatMap(s =>
    ELEMENTS.map(el => Math.max(s.beforeQi[el] || 0, s.afterQi[el] || 0))
  );
  const maxVal = Math.max(...allVals, 0.001);

  // Did anything change?
  const hasDelta = (delta) => ELEMENTS.some(el => Math.abs(delta[el] || 0) > 0.0005);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-white/5">
        <h3 className="text-sm font-semibold text-amber-200">
          Natal Qi Pipeline — TFQ Survival Timeline
        </h3>
        <p className="text-[10px] text-gray-500 mt-0.5">
          Each stage transforms your natal Qi. Only natal Qi goes through this violence.
        </p>
      </div>

      {/* Input bar — vertical */}
      <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02]">
        <div className="text-[10px] font-mono text-gray-500 mb-1.5">Input: TFQ (post-Season, post-Polarity)</div>
        <div className="space-y-1">
          {ELEMENTS.map(el => {
            const val = inputQi[el] || 0;
            return (
              <div key={el} className="flex items-center gap-2">
                <span className="w-12 text-[10px] font-mono text-right" style={{ color: ELEM_COLORS[el] }}>{el}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(val / maxVal) * 100}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.6 }}
                  />
                </div>
                <span className="w-12 text-[10px] font-mono text-right text-gray-400">{val.toFixed(3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stages */}
      {stages.map((stage, idx) => {
        const isOpen = openStages[stage.key];
        const isMeta = showMetaphysical[stage.key];
        const changed = hasDelta(stage.delta);

        return (
          <div key={stage.key} className="border-t border-white/10">
            {/* Stage header — clickable */}
            <button
              onClick={() => toggleStage(stage.key)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 w-4">{idx + 1}</span>
                <span className="text-sm font-medium text-gray-200">
                  {stage.label}
                </span>
                <span className="text-xs text-gray-500">{stage.chinese}</span>
              </div>
              <div className="flex items-center gap-3">
                {changed ? (
                  <span className="text-[10px] font-mono text-amber-400">
                    {ELEMENTS.filter(el => Math.abs(stage.delta[el]) > 0.0005)
                      .map(el => {
                        const d = stage.delta[el];
                        return `${el[0]}${d > 0 ? '+' : ''}${d.toFixed(2)}`;
                      }).join(' ')}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">no change</span>
                )}
                <span className="text-gray-500">{isOpen ? '\u25BE' : '\u25B8'}</span>
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="px-4 py-3 space-y-3 bg-white/[0.01]">
                {/* Description */}
                <div className="text-xs text-gray-400">{stage.description}</div>

                {/* Before / After bar chart comparison */}
                <div className="rounded border border-white/10 overflow-hidden">
                  <table className="w-full text-[10px] font-mono">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-2 py-1 text-left text-gray-400 w-16">Element</th>
                        <th className="px-2 py-1 text-right text-gray-400">Before</th>
                        <th className="px-2 py-1 text-center text-gray-400" style={{width: '40%'}}>Change</th>
                        <th className="px-2 py-1 text-right text-gray-400">After</th>
                        <th className="px-2 py-1 text-right text-gray-400">Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ELEMENTS.map(el => {
                        const before = stage.beforeQi[el] || 0;
                        const after = stage.afterQi[el] || 0;
                        const delta = stage.delta[el] || 0;
                        const bPct = (before / maxVal) * 100;
                        const aPct = (after / maxVal) * 100;
                        const color = ELEM_COLORS[el];

                        return (
                          <tr key={el} className="border-t border-white/5">
                            <td className="px-2 py-1.5">
                              <ElSpan el={el}>{el}</ElSpan>
                            </td>
                            <td className="px-2 py-1.5 text-right text-gray-400">{before.toFixed(3)}</td>
                            <td className="px-2 py-1.5">
                              {/* Dual bar: before (dim) and after (bright) */}
                              <div className="relative h-3">
                                <div
                                  className="absolute top-0 left-0 h-1.5 rounded-full"
                                  style={{ width: `${bPct}%`, backgroundColor: color, opacity: 0.25 }}
                                />
                                <div
                                  className="absolute bottom-0 left-0 h-1.5 rounded-full"
                                  style={{ width: `${aPct}%`, backgroundColor: color, opacity: 0.8 }}
                                />
                              </div>
                            </td>
                            <td className="px-2 py-1.5 text-right text-white">{after.toFixed(3)}</td>
                            <td className={`px-2 py-1.5 text-right font-semibold ${
                              delta > 0.0005 ? 'text-green-400' :
                              delta < -0.0005 ? 'text-red-400' :
                              'text-gray-600'
                            }`}>
                              {delta > 0.0005 ? '+' : ''}{delta.toFixed(3)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Step details */}
                {stage.details && stage.details.length > 0 && (
                  <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
                    {stage.details.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>
                )}

                {/* Metaphysical toggle */}
                <button
                  onClick={() => toggleMeta(stage.key)}
                  className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {isMeta ? '\u25BE Why this stage exists' : '\u25B8 Why this stage exists'}
                </button>

                {isMeta && stage.metaphysical && (
                  <div className="rounded bg-white/[0.03] border border-white/5 px-3 py-2 text-[10px] space-y-1">
                    <div><span className="text-gray-500">What:</span> <span className="text-gray-300">{stage.metaphysical.what}</span></div>
                    <div><span className="text-gray-500">Why:</span> <span className="text-gray-300">{stage.metaphysical.why}</span></div>
                    <div><span className="text-gray-500">When:</span> <span className="text-gray-300">{stage.metaphysical.when}</span></div>
                    <div><span className="text-gray-500">Where:</span> <span className="text-gray-300">{stage.metaphysical.where}</span></div>
                    <div><span className="text-gray-500">Who:</span> <span className="text-gray-300">{stage.metaphysical.who}</span></div>
                    <div><span className="text-gray-500">How:</span> <span className="text-gray-300">{stage.metaphysical.how}</span></div>
                    <div className="pt-1 border-t border-white/5">
                      <span className="text-amber-400/80 italic">"{stage.metaphysical.emotion}"</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Output bar — vertical with TFQ comparison */}
      <div className="px-4 py-2 border-t border-white/20 bg-emerald-900/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-[10px] font-mono text-emerald-400">Output: NTFQ (Normalized Total Functional Qi)</div>
          <div className="flex items-center gap-2 text-[9px] text-gray-500">
            <span className="inline-block w-3 h-1.5 rounded-full bg-white/20" /> TFQ
            <span className="inline-block w-3 h-1.5 rounded-full bg-emerald-400" /> NTFQ
          </div>
        </div>
        <div className="space-y-2">
          {ELEMENTS.map(el => {
            const tfqVal = inputQi[el] || 0;
            const ntfqVal = outputQi[el] || 0;
            const delta = ntfqVal - tfqVal;
            const pctChange = tfqVal > 0.0001 ? ((delta / tfqVal) * 100) : 0;
            const color = ELEM_COLORS[el];
            const isUp = delta > 0.0005;
            const isDown = delta < -0.0005;
            const deltaColor = isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-600';
            const deltaBg = isUp ? 'bg-green-400/10 border-green-400/20' : isDown ? 'bg-red-400/10 border-red-400/20' : 'bg-white/5 border-white/10';
            return (
              <div key={el} className="flex items-center gap-2">
                <span className="w-12 text-[10px] font-mono font-semibold text-right" style={{ color }}>{el}</span>
                <div className="flex-1 space-y-0.5">
                  {/* TFQ bar — element colored, dimmed */}
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(tfqVal / maxVal) * 100}%`, backgroundColor: color, opacity: 0.25 }}
                    />
                  </div>
                  {/* NTFQ bar — element colored, full */}
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(ntfqVal / maxVal) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-white font-semibold">{ntfqVal.toFixed(3)}</span>
                  <span className={`text-[9px] font-mono px-1 py-0.5 rounded border ${deltaBg} ${deltaColor}`}>
                    {isUp ? '+' : ''}{delta.toFixed(3)}
                  </span>
                  <span className={`text-[9px] font-mono px-1 py-0.5 rounded border ${deltaBg} ${deltaColor}`}>
                    {isUp ? '+' : ''}{pctChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TFQ vs NTFQ side-by-side spider graphs */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <PentagonRadar qi={inputQi} label="TFQ" size={160} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-white/40 font-mono">→</span>
            <span className="text-[9px] text-white/55 font-mono">Natal</span>
            <span className="text-[9px] text-white/55 font-mono">Pipeline</span>
            <span className="text-[10px] text-white/40 font-mono">→</span>
          </div>
          <PentagonRadar qi={outputQi} overlayQi={inputQi} label="NTFQ" size={160} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STEP 2: MONTHLY TOTAL FUNCTIONAL QI — 60% TFQ + 40% CYMFQ (RETIRED)
// ============================================================================

function MTFQPanel({ userTfq, cymfq, monthName }) {
  const [open, setOpen] = useState(false);

  if (!userTfq || !cymfq) return null;

  const mtfq = {};
  let totalMtfq = 0;
  const totalTfq = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);
  const totalCymfq = ELEMENTS.reduce((s, el) => s + (cymfq[el] || 0), 0);

  ELEMENTS.forEach(el => {
    mtfq[el] = (userTfq[el] || 0) * 0.60 + (cymfq[el] || 0) * 0.40;
    totalMtfq += mtfq[el];
  });

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 2: Monthly Total Functional Qi (MTFQ)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalMtfq.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {/* Side-by-side recap: TFQ vs CYMFQ — shared max across all 10 bars */}
          {(() => {
            const sharedMax = Math.max(
              ...ELEMENTS.map(el => userTfq[el] || 0),
              ...ELEMENTS.map(el => cymfq[el] || 0),
              0.001
            );
            return (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-amber-500/20 bg-amber-900/10 p-2.5">
                  <div className="text-[10px] font-semibold text-amber-300 mb-2">Natal Total Functional Qi (TFQ)</div>
                  <div className="space-y-1">
                    {ELEMENTS.map(el => {
                      const val = userTfq[el] || 0;
                      const pct = totalTfq > 0 ? ((val / totalTfq) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={el} className="flex items-center gap-1.5 text-[9px]">
                          <span className="w-8 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>{el[0]}</span>
                          <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden relative">
                            <div className="h-full rounded" style={{ width: `${Math.max((val / sharedMax) * 100, val > 0 ? 1 : 0)}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.7 }} />
                            <span className="absolute inset-0 flex items-center px-1 text-[8px] font-mono text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {val > 0 ? val.toFixed(3) : ''}
                            </span>
                          </div>
                          <span className="w-10 text-right font-mono text-gray-500">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[9px] font-mono text-amber-400/60 mt-1.5 text-right">Total: {totalTfq.toFixed(3)}</div>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-900/10 p-2.5">
                  <div className="text-[10px] font-semibold text-cyan-300 mb-2">Current Year &amp; Month Functional Qi (CYMFQ)</div>
                  <div className="space-y-1">
                    {ELEMENTS.map(el => {
                      const val = cymfq[el] || 0;
                      const pct = totalCymfq > 0 ? ((val / totalCymfq) * 100).toFixed(1) : '0.0';
                      return (
                        <div key={el} className="flex items-center gap-1.5 text-[9px]">
                          <span className="w-8 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>{el[0]}</span>
                          <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden relative">
                            <div className="h-full rounded" style={{ width: `${Math.max((val / sharedMax) * 100, val > 0 ? 1 : 0)}%`, backgroundColor: ELEM_COLORS[el], opacity: 0.7 }} />
                            <span className="absolute inset-0 flex items-center px-1 text-[8px] font-mono text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {val > 0 ? val.toFixed(3) : ''}
                            </span>
                          </div>
                          <span className="w-10 text-right font-mono text-gray-500">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400/60 mt-1.5 text-right">Total: {totalCymfq.toFixed(3)}</div>
                </div>
              </div>
            );
          })()}

          {/* Car / Weather analogy */}
          <div className="p-3 rounded-lg bg-indigo-900/20 border border-indigo-500/20 space-y-2">
            <div className="text-xs text-indigo-300 font-semibold">Why 60% / 40%?</div>
            <div className="text-[11px] text-gray-300 leading-relaxed space-y-1">
              <div>
                <span className="text-amber-300 font-semibold">Natal TFQ (60%)</span> = Your car — the constitutional engine you were born with. This never changes. It defines <em>who you are</em>.
              </div>
              <div>
                <span className="text-cyan-300 font-semibold">CYMFQ (40%)</span> = The weather — the current year and month energy that reshapes how your engine performs. This changes every month.
              </div>
              <div className="text-gray-400 mt-1">
                Your identity is the dominant force (60%), but external Qi is significant enough (40%) to shift the balance, create collapses, or open new strengths. This ratio models how BaZi practitioners weigh natal vs transit influence.
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="text-xs font-mono text-amber-300 font-semibold">
            MTFQ = 60% × TFQ + 40% × CYMFQ
          </div>

          {/* Context */}
          <div className="flex gap-4 text-[10px] font-mono text-gray-500">
            <span>TFQ Total: <span className="text-white">{totalTfq.toFixed(3)}</span></span>
            <span>CYMFQ Total: <span className="text-white">{totalCymfq.toFixed(3)}</span></span>
            <span>MTFQ Total: <span className="text-amber-300">{totalMtfq.toFixed(3)}</span></span>
          </div>

          {/* Table — full progression so user can trace every number */}
          <div className="rounded border border-white/10 overflow-hidden overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                {/* Two-row header: group labels on top, column labels below */}
                <tr className="border-b border-white/10">
                  <th rowSpan={2} className="px-2 py-1 text-left text-gray-400 align-bottom bg-white/5">Element</th>
                  <th colSpan={8} className="px-0 py-1.5 text-center text-amber-300/90 text-[9px] border-r border-white/15 bg-amber-400/[0.06]">Step A: Compute Weighted Inputs</th>
                  <th colSpan={5} className="px-0 py-1.5 text-center text-emerald-300/90 text-[9px] bg-emerald-400/[0.06]">Step B: Combine</th>
                </tr>
                <tr>
                  <th className="px-1 py-1 text-right text-amber-300 bg-amber-400/[0.06]">TFQ</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-amber-400/[0.06]" style={{width:'1.5rem'}}>×60%</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-amber-400/[0.06]" style={{width:'0.8rem'}}>=</th>
                  <th className="px-1 py-1 text-right text-amber-300 font-semibold bg-amber-400/[0.06]">ATFQ</th>
                  <th className="px-1 py-1 text-right text-cyan-300 bg-amber-400/[0.06]">CYMFQ</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-amber-400/[0.06]" style={{width:'1.5rem'}}>×40%</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-amber-400/[0.06]" style={{width:'0.8rem'}}>=</th>
                  <th className="px-1 py-1 text-right text-cyan-300 font-semibold border-r border-white/15 bg-amber-400/[0.06]">ACYMFQ</th>
                  <th className="px-1 py-1 text-right text-amber-300 bg-emerald-400/[0.06]">ATFQ</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-emerald-400/[0.06]" style={{width:'0.8rem'}}>+</th>
                  <th className="px-1 py-1 text-right text-cyan-300 bg-emerald-400/[0.06]">ACYMFQ</th>
                  <th className="px-0 py-1 text-center text-gray-400 bg-emerald-400/[0.06]" style={{width:'0.8rem'}}>=</th>
                  <th className="px-1 py-1 text-right text-white font-semibold bg-emerald-400/[0.06]">MTFQ</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const tfqVal = userTfq[el] || 0;
                  const cymVal = cymfq[el] || 0;
                  const tfq60 = tfqVal * 0.60;
                  const cym40 = cymVal * 0.40;
                  const pct = totalMtfq > 0 ? (mtfq[el] / totalMtfq) * 100 : 0;
                  return (
                    <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-2 py-1.5">
                        <ElSpan el={el}>{el}</ElSpan>
                      </td>
                      {/* Step A — TFQ side */}
                      <td className="px-1 py-1.5 text-right text-amber-300 bg-amber-400/[0.03]">{tfqVal.toFixed(3)}</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.03]">×60%</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.03]">=</td>
                      <td className="px-1 py-1.5 text-right text-amber-300 font-semibold bg-amber-400/[0.03]">{tfq60.toFixed(3)}</td>
                      {/* Step A — CYMFQ side */}
                      <td className="px-1 py-1.5 text-right text-cyan-300 bg-amber-400/[0.03]">{cymVal.toFixed(3)}</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.03]">×40%</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.03]">=</td>
                      <td className="px-1 py-1.5 text-right text-cyan-300 font-semibold border-r border-white/15 bg-amber-400/[0.03]">{cym40.toFixed(3)}</td>
                      {/* Step B — combine */}
                      <td className="px-1 py-1.5 text-right text-amber-300 bg-emerald-400/[0.03]">{tfq60.toFixed(3)}</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-emerald-400/[0.03]">+</td>
                      <td className="px-1 py-1.5 text-right text-cyan-300 bg-emerald-400/[0.03]">{cym40.toFixed(3)}</td>
                      <td className="px-0 py-1.5 text-center text-gray-400 bg-emerald-400/[0.03]">=</td>
                      <td className="px-1 py-1.5 text-right text-white font-semibold bg-emerald-400/[0.03]">
                        {mtfq[el].toFixed(3)}
                        <span className="ml-1" style={{ color: ELEM_COLORS[el] }}>{pct.toFixed(1)}%</span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t border-white/20">
                  <td className="px-2 py-1.5 text-gray-400 font-semibold bg-white/5">Total</td>
                  <td className="px-1 py-1.5 text-right text-amber-300 bg-amber-400/[0.06]">{totalTfq.toFixed(3)}</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.06]">×60%</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.06]">=</td>
                  <td className="px-1 py-1.5 text-right text-amber-300 font-semibold bg-amber-400/[0.06]">{(totalTfq * 0.60).toFixed(3)}</td>
                  <td className="px-1 py-1.5 text-right text-cyan-300 bg-amber-400/[0.06]">{totalCymfq.toFixed(3)}</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.06]">×40%</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-amber-400/[0.06]">=</td>
                  <td className="px-1 py-1.5 text-right text-cyan-300 font-semibold border-r border-white/15 bg-amber-400/[0.06]">{(totalCymfq * 0.40).toFixed(3)}</td>
                  <td className="px-1 py-1.5 text-right text-amber-300 bg-emerald-400/[0.06]">{(totalTfq * 0.60).toFixed(3)}</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-emerald-400/[0.06]">+</td>
                  <td className="px-1 py-1.5 text-right text-cyan-300 bg-emerald-400/[0.06]">{(totalCymfq * 0.40).toFixed(3)}</td>
                  <td className="px-0 py-1.5 text-center text-gray-400 bg-emerald-400/[0.06]">=</td>
                  <td className="px-1 py-1.5 text-right text-white font-bold bg-emerald-400/[0.06]">
                    {totalMtfq.toFixed(3)}
                    <span className="ml-1 text-white">100%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Per-element formula breakdown */}
          <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
            {ELEMENTS.map(el => {
              const tfqVal = userTfq[el] || 0;
              const cymVal = cymfq[el] || 0;
              return (
                <div key={el}>
                  <ElSpan el={el}>{el}</ElSpan>
                  <span className="text-gray-500"> (MTFQ)</span>
                  {' = '}
                  <span className="text-amber-300/80">{tfqVal.toFixed(3)}</span>
                  <span className="text-gray-500"> × 60%</span>
                  {' + '}
                  <span className="text-cyan-300/80">{cymVal.toFixed(3)}</span>
                  <span className="text-gray-500"> × 40%</span>
                  {' = '}
                  <span className="text-amber-300/80">{(tfqVal * 0.60).toFixed(3)}</span>
                  {' + '}
                  <span className="text-cyan-300/80">{(cymVal * 0.40).toFixed(3)}</span>
                  {' = '}
                  <span className="text-white font-semibold">{mtfq[el].toFixed(3)}</span>
                </div>
              );
            })}
          </div>

          {/* QiBar */}
          <div className="text-xs font-semibold text-amber-300 mb-1 mt-2">Monthly Total Functional Qi (MTFQ)</div>
          <QiBar qi={mtfq} showPct />
        </div>
      )}
    </div>
  );
}

function YearStoryMonthDetail({ snapshot, qiMatrix }) {
  const [expandedYear, setExpandedYear] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState(false);

  const dayMasterPolarity = qiMatrix?.dayMasterPolarity;
  const dayMasterElement = qiMatrix?.dayMasterElement;

  // Year FQ and Month FQ — use engine's single source of truth
  const yearFq = snapshot.yearQi;
  const monthFq = snapshot.monthQi;

  return (
    <div className="space-y-3">
      {/* Year + Month Pillar Cards — same IncomingPillarWithFlap used in Monthly Qi Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <IncomingPillarWithFlap
          breakdown={snapshot.yearPillarBreakdown}
          label="Year"
          expanded={expandedYear}
          onToggle={() => setExpandedYear(v => !v)}
          currentMonthBranch={snapshot.monthBranch}
          dayMasterPolarity={dayMasterPolarity}
          dayMasterElement={dayMasterElement}
        />
        <IncomingPillarWithFlap
          breakdown={snapshot.monthPillarBreakdown}
          label="Month"
          expanded={expandedMonth}
          onToggle={() => setExpandedMonth(v => !v)}
          currentMonthBranch={snapshot.monthBranch}
          dayMasterPolarity={dayMasterPolarity}
          dayMasterElement={dayMasterElement}
        />
      </div>

      {/* Combined Year + Month FQ */}
      {yearFq && monthFq && (
        <CombinedYMFQPanel
          yearFq={yearFq}
          monthFq={monthFq}
          year={qiMatrix.year}
          monthName={snapshot.monthName}
          natalTfq={snapshot.natalTfq}
          daYunQi={snapshot.daYunQi}
        />
      )}

      {/* Step 2 removed — no more 60/40 MTFQ blend. TFQ goes through pipeline directly. */}
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function QiBraceletPage() {
  const { profiles, loading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedPillarFlaps, setExpandedPillarFlaps] = useState({});
  const [showQiPopup, setShowQiPopup] = useState(false);
  const [showElementsPopup, setShowElementsPopup] = useState(false);
  const [showRootingPopup, setShowRootingPopup] = useState(false);
  const [showSeasonalityPopup, setShowSeasonalityPopup] = useState(false);
  const [showPolarityPopup, setShowPolarityPopup] = useState(false);
  const [showFunctionalQiPopup, setShowFunctionalQiPopup] = useState(false);
  const [showGlossaryPopup, setShowGlossaryPopup] = useState(false);
  const [showQiPipelinePopup, setShowQiPipelinePopup] = useState(false);
  const [showFloatingSelector, setShowFloatingSelector] = useState(false);
  const [stemMdViewer, setStemMdViewer] = useState(null);  // { char, pol, el, content }
  const [stemMdStore, setStemMdStore] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stemMdStore') || '{}'); } catch { return {}; }
  });

  // Show floating selector when scrolled past 300px
  useEffect(() => {
    const onScroll = () => setShowFloatingSelector(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stem MD import/export helpers
  const saveStemMd = (char, content) => {
    const updated = { ...stemMdStore, [char]: content };
    setStemMdStore(updated);
    localStorage.setItem('stemMdStore', JSON.stringify(updated));
  };

  const importStemMd = (char) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        saveStemMd(char, content);
        // If viewer is open for this stem, update it
        setStemMdViewer(prev => prev?.char === char ? { ...prev, content } : prev);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportStemMd = (char, pol, el) => {
    const content = stemMdStore[char] || `# ${pol} ${el} (${char})\n\nNo content yet.`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pol}${el}_${char}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Selected profile
  const selectedProfile = useMemo(() => {
    return profiles?.find(p => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Calculate natal chart
  const chart = useMemo(() => {
    if (!selectedProfile?.birthDate) return null;
    try {
      const [year, month, day] = selectedProfile.birthDate.split('-').map(Number);
      const [hour = 12, minute = 0] = (selectedProfile.birthTime || '12:00').split(':').map(Number);
      const result = calculateBaZi({ year, month, day, hour, minute });
      if (result.error) return null;
      return result;
    } catch {
      return null;
    }
  }, [selectedProfile]);

  // Compute Da Yun sequence
  const daYunResult = useMemo(() => {
    if (!chart || !selectedProfile?.birthDate) return null;
    try {
      return calculateDaYun(
        chart,
        selectedProfile.birthDate,
        selectedProfile.birthTime ?? '12:00',
        selectedYear,
        selectedProfile.gender ?? 'male',
        11 // 11 pillars → covers ~110 years for Life Worm slider
      );
    } catch (err) {
      console.error('Da Yun error:', err);
      return null;
    }
  }, [chart, selectedProfile?.birthDate, selectedProfile?.birthTime, selectedProfile?.gender, selectedYear]);

  // Compute NTFQ — natal TFQ after the full survival pipeline (constant for a given chart)
  // Computed before qiMatrix so we can pass it into the MTFQ blend.
  const topLevelNtfq = useMemo(() => {
    if (!chart?.pillars) return null;
    try {
      // We need userTfq (qi-weighted TFQ) as the pipeline input.
      // Replicate the TFQ computation here from chart data directly.
      const pillars = chart.pillars;
      const bmb = pillars[1]?.branch?.char;
      const dayMasterStem = pillars[2]?.stem?.char;
      if (!bmb || !dayMasterStem) return null;
      const sw = getSeasonalWeights(bmb);
      if (!sw) return null;
      const dmPol = ['甲','丙','戊','庚','壬'].includes(dayMasterStem) ? 'Yang' : 'Yin';
      const dmEl = { '甲':'Wood','乙':'Wood','丙':'Fire','丁':'Fire','戊':'Earth','己':'Earth','庚':'Metal','辛':'Metal','壬':'Water','癸':'Water' }[dayMasterStem];
      const pMults = dmPol === 'Yang'
        ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
        : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
      // Build TFQ from 4 pillars (same logic as userTfq computation)
      const QI_W = { year: 0.10, month: 0.30, dayMaster: 0.35, dayBranch: 0.15, hour: 0.10 };
      const tfq = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
      for (const [idx, key] of ['year', 'month', 'day', 'hour'].entries()) {
        const p = pillars[idx];
        if (!p) continue;
        // Raw element distribution: stem=1pt to its element, branch=10pt via hidden stems
        const raw = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
        if (p.stem?.element) raw[p.stem.element] += 1;
        (p.branch?.hiddenStems || []).forEach(hs => {
          raw[hs.element] = (raw[hs.element] || 0) + (hs.percentage / 100) * 10;
        });
        if (key === 'day') {
          ELEMENTS.forEach(el => {
            const stemRaw = el === dmEl ? 1 : 0;
            const branchRaw = raw[el] - stemRaw;
            const sMult = sw[el.toLowerCase()] ?? 1.0;
            tfq[el] += stemRaw * sMult * pMults[el] * QI_W.dayMaster
                     + branchRaw * sMult * pMults[el] * QI_W.dayBranch;
          });
        } else {
          const w = QI_W[key];
          ELEMENTS.forEach(el => {
            const sMult = sw[el.toLowerCase()] ?? 1.0;
            tfq[el] += raw[el] * sMult * pMults[el] * w;
          });
        }
      }
      // Run natal pipeline on TFQ
      const yearPillarInfo = getYearPillar(selectedYear);
      const monthPillarsInfo = getMonthPillars(selectedYear);
      // Use first month as representative context (natal pipeline is natal-only, month context is for interaction detection)
      const mp0 = monthPillarsInfo[0];
      const result = processNatalPipeline(
        tfq,
        {
          chartPillars: pillars,
          yearPillar: { stem: yearPillarInfo.stem, branch: yearPillarInfo.branch },
          monthPillar: { stem: mp0.stem, branch: mp0.branch },
          currentMonthBranch: mp0.branch,
          dayMasterElement: dmEl || '',
          dayMasterPolarity: dmPol,
          natalBranches: {
            year: pillars[0]?.branch?.char || '',
            month: pillars[1]?.branch?.char || '',
            day: pillars[2]?.branch?.char || '',
            hour: pillars[3]?.branch?.char || '',
          },
          yearBranch: yearPillarInfo.branch,
          monthBranch: mp0.branch,
        },
        { applyCombinationEngine, buildCombinationContext, detectInteractions, applyClashDamage, applyControlPressure, applyOvercrowding, applyTransformations, analyzeStructuralCollapse }
      );
      return result?.outputQi || null;
    } catch (err) {
      console.error('Top-level NTFQ error:', err);
      return null;
    }
  }, [chart, selectedYear]);

  // Compute Qi matrix (with Da Yun pillar threaded through + NTFQ for MTFQ blend)
  const qiMatrix = useMemo(() => {
    if (!chart) return null;
    try {
      return computeQiYearMatrix(chart, selectedYear, daYunResult ?? undefined, topLevelNtfq ?? undefined);
    } catch (err) {
      console.error('Qi matrix error:', err);
      return null;
    }
  }, [chart, selectedYear, daYunResult, topLevelNtfq]);

  // Group months by season
  const seasonGroups = useMemo(() => {
    if (!qiMatrix) return {};
    const groups = {};
    for (const m of qiMatrix.months) {
      if (!groups[m.season]) groups[m.season] = [];
      groups[m.season].push(m);
    }
    return groups;
  }, [qiMatrix]);

  // Compute user's Total Functional Qi (TFQ) — same logic as FunctionalQiSummary
  const userTfq = useMemo(() => {
    if (!qiMatrix?.perPillarBreakdown) return null;
    const bd = qiMatrix.perPillarBreakdown;
    const bmb = chart?.pillars?.[1]?.branch?.char;
    const sw = bmb ? getSeasonalWeights(bmb) : null;
    if (!sw) return null;
    const pol = qiMatrix.dayMasterPolarity;
    const dmEl = qiMatrix.dayMasterElement;
    const pMults = pol === 'Yang'
      ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
      : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
    const yearFq = bd.year.qiWeighted || {};
    const monthFq = bd.month.qiWeighted || {};
    const hourFq = bd.hour.qiWeighted || {};
    const dayBd = bd.day;
    const tfq = {};
    ELEMENTS.forEach(el => {
      const dmRaw = el === dmEl ? 1 : 0;
      const dbRaw = (dayBd.raw[el] || 0) - dmRaw;
      const sMult = sw[el.toLowerCase()] ?? 1.0;
      const dmFq = dmRaw * sMult * pMults[el] * 0.35;
      const dbFq = dbRaw * sMult * pMults[el] * 0.15;
      tfq[el] = (yearFq[el] || 0) + (monthFq[el] || 0) + dmFq + dbFq + (hourFq[el] || 0);
    });
    return tfq;
  }, [qiMatrix, chart]);

  // Compute Day Master Strength score (for Ten Gods panel)
  const dmStrengthScore = useMemo(() => {
    if (!qiMatrix || !userTfq || !chart) return null;
    const dmElement = qiMatrix.dayMasterElement;
    const isYang = qiMatrix.dayMasterPolarity === 'Yang';
    const bd = qiMatrix.perPillarBreakdown;
    const bmb = chart.pillars[1]?.branch?.char;
    const sw = bmb ? getSeasonalWeights(bmb) : null;
    if (!sw || !bd || !dmElement) return null;
    const seasonalWeights = {
      Wood: sw.wood ?? 1.0, Fire: sw.fire ?? 1.0, Earth: sw.earth ?? 1.0,
      Metal: sw.metal ?? 1.0, Water: sw.water ?? 1.0,
    };
    const polMults = isYang
      ? { Wood: 1.15, Fire: 1.05, Earth: 1.00, Metal: 1.00, Water: 1.10 }
      : { Wood: 0.85, Fire: 0.95, Earth: 1.00, Metal: 1.00, Water: 0.90 };
    const sMult = seasonalWeights[dmElement] ?? 1.0;
    const pMult = polMults[dmElement] ?? 1.0;
    const dmStemQi = 1 * sMult * pMult * 0.35;
    const dayBd = bd.day;
    const dmRawInBranch = (dayBd.raw[dmElement] || 0) - 1;
    const dmBranchQi = Math.max(0, dmRawInBranch) * sMult * pMult * 0.15;
    const pillars = [
      { label: 'Year', bd: bd.year, pillar: chart.pillars[0] },
      { label: 'Month', bd: bd.month, pillar: chart.pillars[1] },
      { label: 'Day', bd: bd.day, pillar: chart.pillars[2] },
      { label: 'Hour', bd: bd.hour, pillar: chart.pillars[3] },
    ].map(p => ({
      label: p.label,
      branchChar: p.pillar?.branch?.char || '',
      branchAnimal: p.pillar?.branch?.animal || '',
      hiddenStems: (p.bd?.hiddenStems || []).map(hs => ({ element: hs.element, pct: hs.pct })),
    }));
    try {
      const result = computeDayMasterStrength({ dmElement, isYang, tfqTotals: userTfq, dmStemQi, dmBranchQi, pillars, seasonalWeights });
      return result.score;
    } catch { return null; }
  }, [qiMatrix, userTfq, chart]);

  // DM Strength → IFQ adjustment (bracelet prescription bias)
  const dmStrengthAdj = useMemo(() => {
    if (dmStrengthScore == null || !qiMatrix?.dayMasterElement) return null;
    return computeDmStrengthAdjustment({
      dmElement: qiMatrix.dayMasterElement,
      dmStrengthScore,
    });
  }, [dmStrengthScore, qiMatrix]);

  // Compute per-month bracelet stones for 3D visualization
  // Mirrors the exact MIFQ → BRQe → engineerBracelet pipeline used in BraceletDashboard
  const braceletStonesFor3D = useMemo(() => {
    if (!qiMatrix?.months || !chart?.pillars?.[2]?.stem?.char) return null;
    const dmChar = chart.pillars[2].stem.char;
    const GENERATES_MAP = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
    try {
      return qiMatrix.months.map((snapshot, i) => {
        if (!snapshot.yongShen || !snapshot.functionalQi) return null;
        const pool = snapshot.postClash || snapshot.functionalQi || {};
        const elRatios = computeElementRatios(pool);
        const collapseRpt = diagnoseCollapse(elRatios);
        const branchAnimal = snapshot.branchAnimal || 'Tiger';

        // ── Compute MIFQ → BRQe ratios (same as BraceletDashboard) ──
        let brqeRatios = null;
        let brqeCorrection = null; // BRQe per-element correction values
        try {
          const mtfqTotal = ELEMENTS.reduce((s, el) => s + (snapshot.functionalQi[el] || 0), 0);
          if (mtfqTotal > 0 && snapshot.yongShen) {
            const ys = snapshot.yongShen;
            const sw = getSeasonalWeights(snapshot.monthBranch);
            const ysAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            if (ys.usefulElements?.length > 0) {
              ysAdj[ys.usefulElements[0]] += 6;
              if (ys.usefulElements.length > 1) ysAdj[ys.usefulElements[1]] += 4;
              const child = GENERATES_MAP[ys.usefulElements[0]];
              if (child && ysAdj[child] === 0) ysAdj[child] += 2;
            }
            if (ys.forbidden) ys.forbidden.forEach(el => { ysAdj[el] -= 6; });
            if (ys.threat && !ys.forbidden?.includes(ys.threat)) ysAdj[ys.threat] -= 4;
            const SEASONAL_WEIGHT_TO_ADJ = { 1.0: 4, 0.8: 2, 0.6: 1, 0.4: -2, 0.2: -4 };
            const sAdj = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
            if (sw) {
              ELEMENTS.forEach(el => {
                const weight = sw[el.toLowerCase()] ?? 0.6;
                const snapped = [1.0, 0.8, 0.6, 0.4, 0.2].reduce((a, b) => Math.abs(b - weight) < Math.abs(a - weight) ? b : a);
                sAdj[el] = SEASONAL_WEIGHT_TO_ADJ[snapped] ?? 0;
              });
            }
            const mifqResult = computeIFQ({ mtfqTotalQi: mtfqTotal, yongShenAdjustment: ysAdj, seasonalAdjustment: sAdj, dmStrengthAdjustment: dmStrengthAdj?.adjustments });
            const braceletMifqQi = {};
            ELEMENTS.forEach(el => { braceletMifqQi[el] = mifqResult.elements[el].normalizedQi; });

            // BRQe = MIFQ - MTFQ, capped at 50% of |BRQ|
            const brqeValues = {};
            ELEMENTS.forEach(el => {
              const brq = (braceletMifqQi[el] || 0) - (snapshot.functionalQi[el] || 0);
              const cap = Math.abs(brq) * 0.50;
              const brqEff = brq * 0.35;
              brqeValues[el] = Math.max(-cap, Math.min(cap, brqEff));
            });
            brqeCorrection = { ...brqeValues };
            const brqeBracelet = designBraceletFromBRQe(brqeValues, snapshot.yongShen, dmChar);
            brqeRatios = brqeBracelet.ratios;
          }
        } catch { /* fallback: no BRQe */ }

        // Engineer bracelet with BRQe override (matches BraceletDashboard exactly)
        const engineered = engineerBracelet({
          collapse: collapseRpt,
          month: branchAnimal,
          totalBeads: 21,
          beadSize: 10,
          daYunQi: snapshot.daYunQi || null,
          dayMasterStem: dmChar,
          overrideRatios: brqeRatios,
        });
        if (!engineered?.beads?.length) return null;

        // Extract stones with element + Qi contribution
        const stones = engineered.beads
          .filter(b => b.stone && !b.isAnchor)
          .map(b => ({
            element: b.element || b.stone.element,
            name: b.stone.name || b.stone.chineseName || '?',
            color: b.stone.color || '#888',
            qiUnit: b.qiUnit || 0,
          }));

        // Remedied Qi = MTFQ + BRQe (from pipeline, NOT raw stone qiUnits)
        // BRQe closes 35% of the gap between MTFQ and MIFQ, capped at 50% of |BRQ|
        const remediedQi = {};
        ELEMENTS.forEach(el => {
          remediedQi[el] = (snapshot.functionalQi[el] || 0) + (brqeCorrection?.[el] || 0);
        });
        return {
          monthIndex: i,
          stones,
          remediedQi,
          brqeCorrection, // per-element BRQe values for display
          monthName: snapshot.monthName || '',
          engineered,  // full EngineeredBracelet for floating preview
        };
      }).filter(Boolean);
    } catch (err) {
      console.error('Bracelet 3D computation error:', err);
      return null;
    }
  }, [qiMatrix, chart]);

  // Year range for selector — covers full lifetime (birth year to birth+100)
  const birthYear = selectedProfile?.birthDate ? Number(selectedProfile.birthDate.split('-')[0]) : new Date().getFullYear() - 50;
  const currentYear = new Date().getFullYear();
  const yearRangeStart = birthYear;
  const yearRangeEnd = Math.max(birthYear + 100, currentYear + 5);
  const years = Array.from({ length: yearRangeEnd - yearRangeStart + 1 }, (_, i) => yearRangeStart + i);
  const selectedAge = selectedYear - birthYear;

  return (
    <BaziThemeProvider initialMode="dark">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
        {/* Header */}
        <div className="max-w-[90rem] mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold">Qi Bracelet — Functional Element Strength</h1>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Profile selector */}
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value || null)}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Select profile...</option>
              {profiles?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>

            {/* Year selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Age input — syncs with year */}
            {selectedProfile?.birthDate && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Age</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={selectedAge}
                  onChange={(e) => {
                    const age = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                    setSelectedYear(birthYear + age);
                  }}
                  className="bg-slate-800 border border-white/20 rounded-lg px-2 py-2 text-sm text-white w-16 text-center"
                />
              </div>
            )}

            {/* Export Pipeline MD */}
            {chart && qiMatrix && (
              <button
                onClick={() => {
                  const md = generatePipelineExportMd(selectedProfile, chart, qiMatrix, userTfq, selectedYear);
                  const name = `${selectedProfile.firstName || 'Profile'}_${selectedProfile.lastName || ''}_${selectedYear}_QiPipeline.md`;
                  downloadMdFile(md, name.replace(/\s+/g, '_'));
                }}
                className="px-3 py-2 text-sm rounded-lg bg-indigo-800/60 hover:bg-indigo-700/60 border border-indigo-500/30 text-indigo-300 transition-colors"
              >
                Export Pipeline MD
              </button>
            )}
            {chart && qiMatrix && (
              <button
                onClick={() => {
                  const md = generateStorybookMd(selectedProfile, chart, qiMatrix, userTfq, selectedYear);
                  const name = `${selectedProfile.firstName || 'Profile'}_${selectedProfile.lastName || ''}_${selectedYear}_Storybook.md`;
                  downloadMdFile(md, name.replace(/\s+/g, '_'));
                }}
                className="px-3 py-2 text-sm rounded-lg bg-purple-800/60 hover:bg-purple-700/60 border border-purple-500/30 text-purple-300 transition-colors"
              >
                Export Storybook
              </button>
            )}
            {chart && qiMatrix && (
              <button
                onClick={() => {
                  const data = generateBraceletExport(selectedProfile, chart, qiMatrix, selectedYear);
                  if (data) {
                    const name = `${selectedProfile.firstName || 'Profile'}_${selectedProfile.lastName || ''}_${selectedYear}_Bracelet.json`;
                    downloadJsonFile(data, name.replace(/\s+/g, '_'));
                  }
                }}
                className="px-3 py-2 text-sm rounded-lg bg-teal-800/60 hover:bg-teal-700/60 border border-teal-500/30 text-teal-300 transition-colors"
              >
                Export Bracelet JSON
              </button>
            )}
          </div>

          {/* No profile selected */}
          {!selectedProfile && (
            <div className="text-center text-gray-400 py-20">
              Select a profile to begin Qi analysis.
            </div>
          )}

          {/* Chart loaded */}
          {chart && (
            <div className="space-y-6">
              {/* Four Pillars with per-pillar Layer 1 flaps */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold">Four Pillars of Destiny</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowQiPipelinePopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-teal-800/50 hover:bg-teal-700/50 border border-teal-600/30 text-teal-300 transition-colors"
                    >
                      Qi Pipeline
                    </button>
                    <button
                      onClick={() => setShowGlossaryPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-gray-700/50 hover:bg-gray-600/50 border border-gray-500/30 text-gray-200 transition-colors"
                    >
                      Glossary
                    </button>
                    <button
                      onClick={() => setShowElementsPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-emerald-800/50 hover:bg-emerald-700/50 border border-emerald-600/30 text-emerald-300 transition-colors"
                    >
                      Elements Composition
                    </button>
                    <button
                      onClick={() => setShowRootingPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-green-800/50 hover:bg-green-700/50 border border-green-600/30 text-green-300 transition-colors"
                    >
                      Rooting
                    </button>
                    <button
                      onClick={() => setShowSeasonalityPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-blue-800/50 hover:bg-blue-700/50 border border-blue-600/30 text-blue-300 transition-colors"
                    >
                      Seasonality Matrix
                    </button>
                    <button
                      onClick={() => setShowPolarityPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/30 text-purple-300 transition-colors"
                    >
                      Polarity
                    </button>
                    <button
                      onClick={() => setShowQiPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-amber-800/50 hover:bg-amber-700/50 border border-amber-600/30 text-amber-300 transition-colors"
                    >
                      Qi Weighting
                    </button>
                    <button
                      onClick={() => setShowFunctionalQiPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-rose-800/50 hover:bg-rose-700/50 border border-rose-600/30 text-rose-300 transition-colors"
                    >
                      Functional Qi
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Layer 1: Pillar Composition — stem = 1 pt, branch = 10 pts. Expand each pillar for calculation details.
                </p>
                <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                  {/* Year Pillar */}
                  <div className="flex-1 min-w-[180px]">
                    <PillarWithFlap
                      pillar={chart.pillars[0]}
                      breakdown={qiMatrix?.perPillarBreakdown?.year}
                      label="Year"
                      isYou={false}
                      expanded={!!expandedPillarFlaps.year}
                      onToggle={() => setExpandedPillarFlaps(prev => ({ ...prev, year: !prev.year }))}
                      birthMonthBranch={chart.pillars[1]?.branch?.char}
                      dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                      dayMasterElement={qiMatrix?.dayMasterElement}
                    />
                  </div>
                  {/* Month Pillar */}
                  <div className="flex-1 min-w-[180px] overflow-visible">
                    <PillarWithFlap
                      pillar={chart.pillars[1]}
                      breakdown={qiMatrix?.perPillarBreakdown?.month}
                      label="Month"
                      isYou={false}
                      expanded={!!expandedPillarFlaps.month}
                      onToggle={() => setExpandedPillarFlaps(prev => ({ ...prev, month: !prev.month }))}
                      birthMonthBranch={chart.pillars[1]?.branch?.char}
                      dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                      dayMasterElement={qiMatrix?.dayMasterElement}
                    />
                  </div>
                  {/* 10 Heavenly Stems — 天干 */}
                  <div className="hidden lg:flex flex-col items-center justify-start pt-8 px-2 shrink-0 relative z-20" style={{ pointerEvents: 'auto' }}>
                    <button
                      type="button"
                      className="text-[9px] text-amber-300/90 font-semibold tracking-wide mb-0.5 hover:text-amber-200 hover:bg-white/10 rounded px-1 py-0.5 transition-colors cursor-pointer"
                      onClick={() => {
                        const content = stemMdStore['_dayMasterFacts'] || '# Day Master Facts\n\nNo content imported yet.\n\nUse the ↓ Import button in the popup titlebar to load an MD file.';
                        setStemMdViewer({ char: '_dayMasterFacts', pol: '', el: '', content });
                      }}
                    >
                      Day Master Facts {stemMdStore['_dayMasterFacts'] ? <span className="text-[6px] text-green-500">●</span> : null}
                    </button>
                    <div className="text-[8px] text-gray-500 font-mono mb-1">天干</div>
                    {[
                      { char: '甲', pol: 'Yang', el: 'Wood',  color: '#22c55e' },
                      { char: '乙', pol: 'Yin',  el: 'Wood',  color: '#22c55e' },
                      { char: '丙', pol: 'Yang', el: 'Fire',  color: '#ef4444' },
                      { char: '丁', pol: 'Yin',  el: 'Fire',  color: '#ef4444' },
                      { char: '戊', pol: 'Yang', el: 'Earth', color: '#f59e0b' },
                      { char: '己', pol: 'Yin',  el: 'Earth', color: '#f59e0b' },
                      { char: '庚', pol: 'Yang', el: 'Metal', color: '#94a3b8' },
                      { char: '辛', pol: 'Yin',  el: 'Metal', color: '#94a3b8' },
                      { char: '壬', pol: 'Yang', el: 'Water', color: '#3b82f6' },
                      { char: '癸', pol: 'Yin',  el: 'Water', color: '#3b82f6' },
                    ].map(s => {
                      const isDM = chart.pillars[2]?.stem?.char === s.char;
                      const hasMd = !!stemMdStore[s.char];
                      return (
                        <button
                          key={s.char}
                          type="button"
                          className={`group flex items-center gap-0.5 text-[9px] font-mono leading-tight py-1 px-1.5 cursor-pointer hover:bg-white/15 rounded transition-colors w-full ${isDM ? 'bg-yellow-500/20' : ''}`}
                          onClick={() => {
                            const content = stemMdStore[s.char] || `# ${s.pol} ${s.el} (${s.char})\n\nNo content imported yet.\n\nUse the ↓ Import button in the popup titlebar to load an MD file.`;
                            setStemMdViewer({ char: s.char, pol: s.pol, el: s.el, content });
                          }}
                        >
                          <span className="w-7 text-right" style={{ color: s.pol === 'Yang' ? '#f87171' : '#60a5fa', fontWeight: s.pol === 'Yang' ? 800 : 400 }}>{s.pol}</span>
                          <span className="text-[10px] mx-0.5" style={{ color: s.color }}>{s.char}</span>
                          <span className="w-8 text-left" style={{ color: s.color }}>{s.el}</span>
                          {hasMd && <span className="text-[6px] text-green-500 shrink-0 ml-0.5">●</span>}
                        </button>
                      );
                    })}
                    <div className="w-full border-t border-white/10 my-1.5" />
                    {['Wood','Fire','Earth','Metal','Water'].map(el => {
                      const key = `_yangVsYin${el}`;
                      const hasMd = !!stemMdStore[key];
                      const elColor = { Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#94a3b8', Water: '#3b82f6' }[el];
                      return (
                        <button
                          key={key}
                          type="button"
                          className="group flex items-center gap-0.5 text-[9px] font-mono leading-tight py-1 px-1.5 cursor-pointer hover:bg-white/15 rounded transition-colors w-full"
                          onClick={() => {
                            const content = stemMdStore[key] || `# Yang vs Yin ${el}\n\nNo content imported yet.\n\nUse the ↓ Import button in the popup titlebar to load an MD file.`;
                            setStemMdViewer({ char: key, pol: '', el: el, content });
                          }}
                        >
                          <span style={{ color: '#f87171', fontWeight: 800 }}>Yang</span>
                          <span className="text-gray-500 mx-0.5">vs</span>
                          <span style={{ color: '#60a5fa' }}>Yin</span>
                          <span className="ml-0.5" style={{ color: elColor }}>{el}</span>
                          {hasMd && <span className="text-[6px] text-green-500 shrink-0 ml-auto">●</span>}
                        </button>
                      );
                    })}
                  </div>
                  {/* Day Pillar */}
                  <div className="flex-1 min-w-[180px]">
                    <PillarWithFlap
                      pillar={chart.pillars[2]}
                      breakdown={qiMatrix?.perPillarBreakdown?.day}
                      label="Day"
                      isYou={true}
                      expanded={!!expandedPillarFlaps.day}
                      onToggle={() => setExpandedPillarFlaps(prev => ({ ...prev, day: !prev.day }))}
                      birthMonthBranch={chart.pillars[1]?.branch?.char}
                      dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                      dayMasterElement={qiMatrix?.dayMasterElement}
                    />
                  </div>
                  {/* Hour Pillar — narrower */}
                  <div className="flex-1 min-w-[150px] max-w-[200px]">
                    <PillarWithFlap
                      pillar={chart.pillars[3]}
                      breakdown={qiMatrix?.perPillarBreakdown?.hour}
                      label="Hour"
                      isYou={false}
                      expanded={!!expandedPillarFlaps.hour}
                      onToggle={() => setExpandedPillarFlaps(prev => ({ ...prev, hour: !prev.hour }))}
                      birthMonthBranch={chart.pillars[1]?.branch?.char}
                      dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                      dayMasterElement={qiMatrix?.dayMasterElement}
                    />
                  </div>
                </div>

                {/* Total Functional Qi — cross-pillar summary */}
                {qiMatrix && (
                  <FunctionalQiSummary
                    perPillarBreakdown={qiMatrix.perPillarBreakdown}
                    dayMasterElement={qiMatrix.dayMasterElement}
                    dayMasterPolarity={qiMatrix.dayMasterPolarity}
                    birthMonthBranch={chart.pillars[1]?.branch?.char}
                  />
                )}
              </section>

              {/* Day Master Strength — Full Gauntlet */}
              {qiMatrix && userTfq && (
                <DayMasterStrengthPanel chart={chart} qiMatrix={qiMatrix} userTfq={userTfq} />
              )}

              {/* Extreme Archetype — appears when DM < 10 or > 90 */}
              {qiMatrix && userTfq && dmStrengthScore != null && (
                <ExtremeArchetypePanel
                  dmElement={qiMatrix.dayMasterElement}
                  dmScore={dmStrengthScore}
                  isYang={qiMatrix.dayMasterPolarity === 'Yang'}
                  userTfq={userTfq}
                />
              )}

              {/* Ten Gods — Career Profile */}
              {qiMatrix && userTfq && (
                <TenGodsCareerPanel chart={chart} qiMatrix={qiMatrix} userTfq={userTfq} dmStrengthScore={dmStrengthScore} />
              )}

              {/* Education Panel — Understanding the Pipeline */}
              <QiEducationPanel />

              {/* Qi Playground — Developer Cockpit */}
              {qiMatrix && (
                <QiPlayground
                  qiMatrix={qiMatrix}
                  userTfq={userTfq}
                  chart={chart}
                />
              )}

              {/* 3D/4D Qi Vector Trajectory */}
              {qiMatrix?.months?.length > 0 && (
                <QiVectorPlot3D
                  months={qiMatrix.months}
                  dayMasterPolarity={qiMatrix.dayMasterPolarity}
                  braceletStones={braceletStonesFor3D}
                  chart={chart}
                  daYunResult={daYunResult}
                  ntfq={topLevelNtfq}
                  birthYear={birthYear}
                />
              )}

              {/* Qi Balance Cube — 3D ratio visualization */}
              {qiMatrix?.months?.length > 0 && (
                <QiBalanceCube
                  months={qiMatrix.months}
                  dayMasterPolarity={qiMatrix.dayMasterPolarity}
                  natalTfq={userTfq}
                  daYunQi={qiMatrix.months[0]?.daYunQi}
                  braceletStones={braceletStonesFor3D}
                />
              )}

              {/* Monthly Qi Analysis */}
              {qiMatrix && (
                <>
                  {/* Seasonal Rows */}
                  <div className="space-y-4">
                    {/* Your Natal TFQ Baseline — heads-up before monthly cards */}
                    {userTfq && (
                      <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-2">
                        <div className="text-sm font-semibold text-gray-300">Your Natal Total Functional Qi (TFQ)</div>
                        <div className="text-[10px] text-gray-500 max-w-md text-center">
                          This is your constitutional baseline — the 60% structural core that defines who you are.
                          Each month below shows how seasonal energy reshapes this fingerprint.
                        </div>
                        <PentagonRadar qi={userTfq} label="Natal TFQ" size={220} />
                      </div>
                    )}

                    {qiMatrix && (
                      <YearInsightsPanel
                        qiMatrix={qiMatrix}
                        renderMonthDetail={(snap) => (
                          <YearStoryMonthDetail snapshot={snap} qiMatrix={qiMatrix} />
                        )}
                      />
                    )}

                    {/* Bracelet Evolution Timeline — how the bracelet changes month-to-month */}
                    {qiMatrix && chart?.pillars?.[2]?.stem?.char && (() => {
                      const dmChar = chart.pillars[2].stem.char;
                      const evoMonths = (qiMatrix.months || [])
                        .filter(m => m.yongShen)
                        .map(m => {
                          const br = designBracelet(m.yongShen, dmChar);
                          const sc = scoreBracelet(br, m.yongShen);
                          const beads = ELEMENTS.map(el => ({
                            element: el,
                            count: br.ratios[el] || 0,
                          }));
                          return {
                            month: m.monthName?.slice(0, 3) || '?',
                            beads,
                            score: sc.total || 0,
                            collapseMode: m.yongShen.collapseMode || null,
                            yongShen: m.yongShen.usefulElements || [],
                            forbidden: m.yongShen.forbidden || [],
                            scoreBreakdown: sc.breakdown || null,
                          };
                        });
                      if (evoMonths.length === 0) return null;
                      return (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <BraceletEvolutionTimeline months={evoMonths} />
                        </div>
                      );
                    })()}

                    {/* Qi Timeline — animated month-to-month TotalQi distribution */}
                    {qiMatrix && (
                      <QiTimeline
                        data={(qiMatrix.months || []).map(m => ({
                          month: m.monthName,
                          label: m.monthName?.slice(0, 3),
                          season: m.season,
                          mffq: m.functionalQi,
                        }))}
                        userTfq={userTfq}
                      />
                    )}

                    {/* Collapse Mode Heatmap — year-at-a-glance */}
                    {qiMatrix && (
                      <CollapseModeHeatmap
                        months={(qiMatrix.months || []).map(m => {
                          const fqi = m.functionalQi;
                          const total = ELEMENTS.reduce((s, el) => s + (fqi[el] || 0), 0) || 1;
                          const sorted = ELEMENTS
                            .map(el => ({ el, pct: ((fqi[el] || 0) / total) * 100 }))
                            .sort((a, b) => b.pct - a.pct);
                          return {
                            month: m.monthName?.slice(0, 3) || '?',
                            mode: m.yongShen?.collapseMode || 'none',
                            dominant: sorted[0]?.el || null,
                          };
                        })}
                      />
                    )}

                    {/* ═══ NATAL PIPELINE (prominent placement) ═══ */}
                    {userTfq && chart?.pillars && (() => {
                      try {
                        const natalBranches = {
                          year: chart.pillars[0]?.branch?.char || '',
                          month: chart.pillars[1]?.branch?.char || '',
                          day: chart.pillars[2]?.branch?.char || '',
                          hour: chart.pillars[3]?.branch?.char || '',
                        };
                        const birthMonthBranch = chart.pillars[1]?.branch?.char || '';

                        const pipelineResult = processNatalPipeline(
                          userTfq,
                          {
                            chartPillars: chart.pillars,
                            yearPillar: { stem: chart.pillars[0]?.stem?.char || '', branch: chart.pillars[0]?.branch?.char || '' },
                            monthPillar: { stem: chart.pillars[1]?.stem?.char || '', branch: birthMonthBranch },
                            currentMonthBranch: birthMonthBranch,
                            dayMasterElement: qiMatrix?.dayMasterElement || '',
                            dayMasterPolarity: qiMatrix?.dayMasterPolarity || '',
                            natalBranches,
                            yearBranch: chart.pillars[0]?.branch?.char || '',
                            monthBranch: birthMonthBranch,
                          },
                          {
                            applyCombinationEngine,
                            buildCombinationContext,
                            detectInteractions,
                            applyClashDamage,
                            applyControlPressure,
                            applyOvercrowding,
                            applyTransformations,
                            analyzeStructuralCollapse,
                          }
                        );

                        return <NatalPipelinePanel pipelineResult={pipelineResult} />;
                      } catch (err) {
                        console.error('[NatalPipeline] Error:', err);
                        return (
                          <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                            Natal Pipeline Error: {String(err?.message || err)}
                          </div>
                        );
                      }
                    })()}

                    <h2 className="text-lg font-semibold">
                      Monthly Qi Analysis
                      {selectedProfile && (
                        <span className="text-sm font-normal text-gray-400 ml-3">
                          {selectedProfile.firstName} {selectedProfile.lastName}
                          {selectedProfile.birthDate && <> — {selectedProfile.birthDate}</>}
                          {selectedProfile.birthTime && <> {selectedProfile.birthTime}</>}
                          {selectedProfile.location?.fullAddress && <>, {selectedProfile.location.fullAddress}</>}
                        </span>
                      )}
                    </h2>

                    {['Spring', 'Summer', 'Autumn', 'Winter'].map(season => (
                      <SeasonRow
                        key={season}
                        season={season}
                        months={seasonGroups[season] || []}
                        expandedMonths={expandedMonths}
                        setExpandedMonths={setExpandedMonths}
                        dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                        dayMasterElement={qiMatrix?.dayMasterElement}
                        year={selectedYear}
                        userTfq={userTfq}
                        chart={chart}
                        qiMatrix={qiMatrix}
                        profileBirthDate={selectedProfile?.birthDate}
                        profileBirthTime={selectedProfile?.birthTime}
                        profileGender={selectedProfile?.gender}
                        profileName={selectedProfile ? `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim() : ''}
                        age={selectedAge}
                        dmStrengthAdj={dmStrengthAdj}
                        dmStrengthScore={dmStrengthScore}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Floating popup windows */}
      {showQiPopup && (
        <FloatingMdWindow
          content={QI_WEIGHTING_MD}
          title="Qi Weighting — Why It Matters"
          onClose={() => setShowQiPopup(false)}
          width={620}
        />
      )}
      {showElementsPopup && (
        <FloatingMdWindow
          content={ELEMENTS_COMPOSITION_MD}
          title="Elements Composition — Layer 1"
          onClose={() => setShowElementsPopup(false)}
          width={620}
        />
      )}
      {showRootingPopup && (
        <FloatingMdWindow
          content={ROOTING_MD}
          title="Element Rooting — Branch Support"
          onClose={() => setShowRootingPopup(false)}
          width={700}
        />
      )}
      {showSeasonalityPopup && (
        <FloatingMdWindow
          content={SEASONALITY_MATRIX_MD}
          title="Seasonality Matrix — Element Expressiveness"
          onClose={() => setShowSeasonalityPopup(false)}
          width={700}
        />
      )}
      {showPolarityPopup && (
        <FloatingMdWindow
          content={POLARITY_MD}
          title="Polarity Adjustment — Yang vs Yin"
          onClose={() => setShowPolarityPopup(false)}
          width={620}
        />
      )}
      {showFunctionalQiPopup && (
        <FloatingMdWindow
          content={FUNCTIONAL_QI_MD}
          title="Functional Qi — What Is It?"
          onClose={() => setShowFunctionalQiPopup(false)}
          width={620}
        />
      )}
      {showGlossaryPopup && (
        <FloatingMdWindow
          content={GLOSSARY_MD_V2}
          title="Glossary — Qi Pipeline Acronyms"
          onClose={() => setShowGlossaryPopup(false)}
          width={720}
        />
      )}
      {showQiPipelinePopup && (
        <FloatingMdWindow
          content={QI_PIPELINE_FLOW_MD}
          title="Qi Pipeline — TFQ to BRQ"
          onClose={() => setShowQiPipelinePopup(false)}
          width={680}
        />
      )}
      {stemMdViewer && (
        <FloatingMdWindow
          content={stemMdViewer.content}
          title={stemMdViewer.char === '_dayMasterFacts' ? 'Day Master Facts' : stemMdViewer.char.startsWith('_yangVsYin') ? `Yang vs Yin ${stemMdViewer.el}` : `${stemMdViewer.pol} ${stemMdViewer.el} (${stemMdViewer.char}) — Day Master Reference`}
          onClose={() => setStemMdViewer(null)}
          onImport={() => importStemMd(stemMdViewer.char)}
          width={700}
        />
      )}
      {/* Floating profile info bar — appears when scrolled down */}
      {showFloatingSelector && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-white/15 shadow-xl backdrop-blur-sm px-4 py-1.5">
          <div className="max-w-5xl mx-auto flex items-center gap-3 text-[11px] font-mono">
            {/* Profile selector */}
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value || null)}
              className="bg-slate-800 border border-white/15 rounded px-2 py-1 text-xs text-white shrink-0"
            >
              <option value="">Profile...</option>
              {profiles?.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>

            {/* Profile info */}
            {selectedProfile && (
              <div className="flex items-center gap-2 text-gray-400 overflow-hidden min-w-0">
                <span className="text-gray-500">|</span>
                <span className="text-gray-300 shrink-0">
                  {(() => {
                    if (!selectedProfile.birthDate) return '';
                    const d = new Date(selectedProfile.birthDate + 'T12:00:00');
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    return `${days[d.getDay()]} ${selectedProfile.birthDate}`;
                  })()}
                </span>
                {selectedProfile.birthTime && (
                  <span className="text-gray-200 shrink-0">{selectedProfile.birthTime}</span>
                )}
                {selectedProfile.location?.fullAddress && (
                  <span className="text-gray-300 truncate">{selectedProfile.location.fullAddress}</span>
                )}
                <span className="text-gray-500">|</span>
                {chart?.pillars?.[2]?.stem && (
                  <span className="text-yellow-400 shrink-0">
                    DM: {chart.pillars[2].stem.char} ({chart.pillars[2].stem.polarity} {chart.pillars[2].stem.element})
                  </span>
                )}
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Year selector + age */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-slate-800 border border-white/15 rounded px-2 py-1 text-xs text-white w-20 shrink-0"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="text-amber-300 shrink-0">Age {selectedAge}</span>

            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-400 hover:text-white transition-colors px-1 shrink-0"
              title="Scroll to top"
            >↑</button>
          </div>
        </div>
      )}
    </BaziThemeProvider>
  );
}
