/**
 * Qi Bracelet — Functional Element Strength Page
 *
 * Uses raw Qi points (NOT percentages) through a 9-step pipeline.
 * Each step is transparent and expandable for full calculation visibility.
 *
 * Created: March 2026
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { calculateBaZi } from '../utils/baziCalculator';
import { computeQiYearMatrix } from '../utils/qiEngine';
import { designBracelet, scoreBracelet, scoreAllStones, exportBraceletSchema, findSubstitutes, diagnoseCollapse, computeElementRatios, engineerBracelet } from '../data/stoneDatabase';
import { getSeasonalWeights, getSeasonInfo } from '../utils/baziSeasonality';
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
import { QiPipelineFlow } from '../components/qi/QiPipelineFlow';
import { EducationLevelToggle } from '../components/qi/EducationLevelToggle';
import { QiDebugger } from '../components/qi/QiDebugger';
import { BraceletEvolutionTimeline } from '../components/qi/BraceletEvolutionTimeline';
import { QiPhysicsConsole } from '../components/qi/QiPhysicsConsole';
import { CollapseModeSimulator } from '../components/qi/CollapseModeSimulator';
import { BraceletDesigner } from '../components/qi/BraceletDesigner';
import { QiStorybookMode } from '../components/qi/QiStorybookMode';
import { QiTimeline } from '../components/qi/QiTimeline';
import { CollapseModeHeatmap } from '../components/qi/CollapseModeHeatmap';
import { BraceletAutoDesigner } from '../components/qi/BraceletAutoDesigner';
import { QiPlayground } from '../components/qi/QiPlayground';

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

    // Walk through all 9 steps
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
    lines.push('#### TFQ vs MFFQ Comparison');
    lines.push('');
    if (userTfq) {
      lines.push('| Element | Your TFQ | Month MFFQ | Delta |');
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
- **How?** — Through the 9-step pipeline: natal composition, polarity, seasonality, clashes, and control pressure
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

const POLARITY_MD = `# Polarity Adjustment — Yang vs Yin Day Master

## What is Polarity?

In BaZi, every Heavenly Stem is either **Yang** (陽) or **Yin** (陰). Your **Day Master** — the stem of your Day Pillar — determines your constitutional polarity.

- **Yang Day Masters** (甲 丙 戊 庚 壬) — outward, assertive, expansive energy
- **Yin Day Masters** (乙 丁 己 辛 癸) — inward, receptive, refined energy

## Why Polarity Affects Element Strength

A Yang Day Master resonates more strongly with certain elements and less with others. Think of it like a radio frequency — some elements are "in tune" with your polarity, amplifying their expression, while others are slightly dampened.

## Yang Day Master Multipliers

| Element | Multiplier | Effect |
|---|---|---|
| **Wood** | ×1.15 | +15% amplified — Yang resonates strongly with growth energy |
| **Fire** | ×1.05 | +5% slight boost — Yang feeds Fire's expansive nature |
| **Earth** | ×1.00 | Neutral — Earth is the center, unaffected by polarity |
| **Metal** | ×1.00 | Neutral — Metal maintains its structure regardless |
| **Water** | ×1.10 | +10% amplified — Yang generates strong movement in Water |

## Yin Day Master Multipliers

| Element | Multiplier | Effect |
|---|---|---|
| **Wood** | ×0.85 | −15% reduced — Yin dampens Wood's assertive growth |
| **Fire** | ×0.95 | −5% slight reduction — Yin tempers Fire's expansion |
| **Earth** | ×1.00 | Neutral — Earth is the center, unaffected by polarity |
| **Metal** | ×1.00 | Neutral — Metal maintains its structure regardless |
| **Water** | ×0.90 | −10% reduced — Yin calms Water's movement |

## How Polarity is Applied

Polarity multipliers are applied **after** birth-season adjustment, **before** Qi weighting:

> Polarity Adjusted = Seasonality Adjusted × Polarity Multiplier

This means:
1. **Layer 1**: Count raw elements (stem=1, branch=10)
2. **Birth Season**: Multiply by seasonal expressiveness
3. **Polarity**: Multiply by Day Master's polarity modifier ← **this step**
4. **Qi Weights**: Apply importance weights (DM 35%, DB 15%, etc.)

---

*Polarity is a subtle but important modifier. It reflects how your core identity (Day Master) shapes the expression of every element in your chart.*
`;

const SEASONALITY_MATRIX_MD = `# Seasonality Matrix — Element Expressiveness

## Why Seasonality Matters

In BaZi, the **season you were born in** dramatically changes how strongly each element expresses itself. An element that is "present" in your chart may be nearly dormant if it's out of season, or at full power if in season.

This is the **Five Phases of Seasonal Strength** (旺相休囚死):

| Level | Multiplier | Meaning |
|---|---|---|
| 旺 Prosperous | ×1.0 | Element at peak power — fully expressed |
| 相 Phase | ×0.8 | Strong — generated by dominant element |
| 休 Resting | ×0.6 | Moderate — supportive role |
| 囚 Imprisoned | ×0.4 | Weakened — constrained by season |
| 死 Dead | ×0.2 | At its weakest — nearly dormant |

## The Full 12-Month Seasonal Matrix

| Month | Branch | Season | Wood | Fire | Earth | Metal | Water |
|---|---|---|---|---|---|---|---|
| Feb | 寅 Tiger | Spring | **1.0** | 0.8 | 0.4 | 0.2 | 0.6 |
| Mar | 卯 Rabbit | Spring | **1.0** | 0.8 | 0.4 | 0.2 | 0.6 |
| Apr | 辰 Dragon | Late Spring | 0.6 | 0.8 | **1.0** | 0.4 | 0.4 |
| May | 巳 Snake | Summer | 0.6 | **1.0** | 0.8 | 0.4 | 0.2 |
| Jun | 午 Horse | Summer | 0.6 | **1.0** | 0.8 | 0.4 | 0.2 |
| Jul | 未 Goat | Late Summer | 0.4 | 0.6 | **1.0** | 0.8 | 0.4 |
| Aug | 申 Monkey | Autumn | 0.2 | 0.4 | 0.6 | **1.0** | 0.8 |
| Sep | 酉 Rooster | Autumn | 0.2 | 0.4 | 0.6 | **1.0** | 0.8 |
| Oct | 戌 Dog | Late Autumn | 0.4 | 0.4 | **1.0** | 0.6 | 0.8 |
| Nov | 亥 Pig | Winter | 0.8 | 0.2 | 0.4 | 0.6 | **1.0** |
| Dec | 子 Rat | Winter | 0.8 | 0.2 | 0.4 | 0.6 | **1.0** |
| Jan | 丑 Ox | Late Winter | 0.8 | 0.4 | **1.0** | 0.4 | 0.6 |

## How to Read the Table

1. **Find your birth month branch** (e.g., 酉 Rooster = September = Autumn)
2. **Read across the row** to see each element's multiplier
3. **Multiply** your raw element points by the multiplier

### Example: Born in Autumn (酉 Rooster)

- **Metal ×1.0** — Metal is at peak power (旺 Prosperous). It's Metal's season!
- **Water ×0.8** — Water is strong (相 Phase). Metal generates Water.
- **Earth ×0.6** — Earth is moderate (休 Resting). Earth generates Metal.
- **Fire ×0.4** — Fire is weakened (囚 Imprisoned). Fire controls Metal but is constrained.
- **Wood ×0.2** — Wood is nearly dormant (死 Dead). Metal controls Wood.

So if your Year Pillar has 6 raw Wood points, after seasonality: 6 × 0.2 = **1.2 pts** — an 80% reduction!

## The Producing Cycle Logic

The multipliers follow the **Producing Cycle** (生剋循環):

- The **seasonal element** gets 1.0 (peak)
- The element it **produces** gets 0.8 (strong child)
- The element that **produces it** gets 0.6 (supportive parent)
- The element it **controls** gets 0.4 (constrained)
- The element that **controls it** gets 0.2 (weakest)

---

*Birth season multipliers are applied to EVERY pillar's raw points before any Qi weighting.*
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

const SHENG_EXPLANATION_MD = `# Sheng Cycle Nourishment (生) — The Generating Cycle

Where the Controlling Cycle restrains, the **Generating Cycle (生)** nourishes. Each element naturally **feeds** another — the cycle of growth, support, and replenishment.

## The Five Generating Relationships

- **Water nourishes Wood** — rain feeds the forest
- **Wood feeds Fire** — timber fuels the flame
- **Fire creates Earth** — ash becomes soil
- **Earth bears Metal** — mountains yield ore
- **Metal enriches Water** — minerals enrich springs

## When Does Nourishment Happen?

- The **parent** element is stronger than its **child**
- Both elements have positive Qi

## How Nourishment Works

| Step | Formula |
|---|---|
| Raw boost | Parent × 3% |
| Cap | Child × 20% |
| Actual boost | MIN(raw, cap) |
| Parent effect | NOT reduced |

The cap prevents runaway growth. The parent is never drained — nourishment is gentle, not sacrificial.

## The Car Metaphor

Sheng is the **tailwind** after the storm passes. The sun comes out, and the garden starts recovering. Your car gets smoother acceleration and easier movement.
`;

const DAMPING_EXPLANATION_MD = `# Universal Damping — Control Cycle Pressure (耗)

Even without clashes or nourishment, every element experiences **friction** simply by existing in a dynamic system.

## The Rule

All elements undergo a small **2% reduction**:

element = element × 0.98

Every element. No exceptions. No conditions.

## Why Does This Happen?

- **Energetic friction** — no force operates without cost
- **Environmental resistance** — the world pushes back on everything
- **Maintenance cost** — maintaining elemental balance requires energy
- **Natural entropy** — nothing stays at peak indefinitely

## The Car Metaphor

Even a perfectly tuned car on a smooth highway burns fuel. Even a healthy body at rest uses energy to breathe. Damping is the **baseline cost of being alive**.
`;

const TRANSFORMATION_EXPLANATION_MD = `# Transformation (化) — Elemental Transmutation

Transformation is the **most dramatic** adjustment. It occurs when one element **overwhelms** another so completely that the weaker element **changes form**.

## The Five Transformation Rules

| Attacker | Victim | Product | Description |
|---|---|---|---|
| Fire | Metal | Water | Fire melts Metal into liquid |
| Metal | Wood | Fire | Metal strikes Wood, creating sparks |
| Water | Fire | Earth | Water drowns Fire, leaving sediment |
| Wood | Earth | Metal | Wood uproots Earth, exposing ore |
| Earth | Water | Wood | Earth absorbs Water, enabling growth |

## When Does Transformation Trigger?

Two conditions must **both** be met:

1. **Attacker > 1.5 Qi points** (must be substantial)
2. **Attacker / Victim > 3:1** (must be overwhelming)

## What Happens?

- **30%** of the victim transmutes into the child element
- The victim shrinks; the child grows
- The remaining 70% persists, weakened but present

## The Car Metaphor

Transformation is like **replacing a major car part** — a forced adaptation. Part of your system changes form to keep you going. This only happens in extreme months.
`;

const OVERCROWDING_EXPLANATION_MD = `# Overcrowding — Self-Generated Instability (溢)

In classical BaZi, a chart with no clashes can still be deeply imbalanced. When one element dominates the landscape, it creates **self-generated instability** — the system buckles under its own weight.

## When Does Overcrowding Trigger?

Two conditions are checked (either triggers):
- Element > **35%** of total Qi (absolute dominance)
- Element > **2x** the five-element average (relative dominance)

## What Happens?

The excess energy softly bleeds into the element's **generating-cycle child**:
- Bleed = 10% of the excess (amount above 2x average)
- Capped at 0.50 pts maximum per element
- The parent loses what the child gains

This is NOT the dramatic 化 transformation. It is a gentle, natural overflow — like a river overflowing its banks into a tributary.

## Why This Matters

Overcrowding explains:
- Why a chart with no clashes can still feel unbalanced
- Why extreme strength in one element weakens the person (paradoxically)
- How self-generated instability works in advanced Yong Shen selection
- Why the generating cycle is both a gift and a pressure

## The Car Metaphor

Your engine is running too hot in one area. Rather than breaking down (化 transformation), the excess heat **bleeds into the next system** — the cooling system gets overworked, the electrical system heats up. It's manageable, but it's real.

## Pipeline Position

Overcrowding sits between Sheng and Damping:
克 Clash → 生 Sheng → **溢 Overcrowding** → 耗 Damping → 化 Transform

After nourishment has run (Sheng may amplify a dominant element further), overcrowding checks if anything has gotten too large. Then damping and transformation handle the rest.
`;

const PIPELINE_OVERVIEW_MD = `# Monthly Qi Adjustment Pipeline

Your Month Final Functional Qi (MFFQ) is created through a sequence of elemental adjustments. Each step models a different kind of energetic interaction.

## The Full Pipeline

| Step | Cycle | What Happens |
|---|---|---|
| Step 6 | 克 Clash | Three-pass controlling cycle — tension & suppression |
| Step 7 | 生 Sheng | Generating cycle — parent feeds child |
| Step 8 | 耗 Damping | Universal 2% friction |
| Step 9 | 化 Transform | Extreme ratio alchemy — victim changes form |
| Step 10 | — MFFQ | Final output → Yong Shen + Stone Rx |

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
- MFFQ = your **driving conditions** for the month
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

## Step 10: MFFQ → Yong Shen → Stone Rx

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
// PENTAGON RADAR — lightweight SVG five-element radar with optional overlay
// ============================================================================

const RADAR_ANGLES = ELEMENTS.map((_, i) => (Math.PI / 2) - (2 * Math.PI * i) / 5); // start top, clockwise: Wood→Fire→Earth→Metal→Water
const RADAR_ELEMENT_ICONS = { Wood: '🌿', Fire: '🔥', Earth: '⛰️', Metal: '⚙️', Water: '💧' };

/**
 * Converts a Qi distribution to polygon points on a pentagon radar.
 * Values are normalized as percentages of total to make shapes comparable.
 */
function qiToRadarPoints(qi, cx, cy, radius) {
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  if (total === 0) return RADAR_ANGLES.map(() => ({ x: cx, y: cy }));
  return ELEMENTS.map((el, i) => {
    const pct = (qi[el] || 0) / total;  // 0..1
    const r = pct * radius * 4;  // scale so 25% ≈ radius (balanced = circle-ish)
    const clampedR = Math.min(r, radius); // don't exceed bounds
    return {
      x: cx + clampedR * Math.cos(RADAR_ANGLES[i]),
      y: cy - clampedR * Math.sin(RADAR_ANGLES[i]),
    };
  });
}

function pentagonGridPoints(cx, cy, radius, level) {
  return ELEMENTS.map((_, i) => {
    const r = radius * level;
    return `${cx + r * Math.cos(RADAR_ANGLES[i])},${cy - r * Math.sin(RADAR_ANGLES[i])}`;
  }).join(' ');
}

/**
 * PentagonRadar — inline SVG pentagon with optional before/after overlay.
 * @param {object} qi - primary Qi distribution { Wood, Fire, Earth, Metal, Water }
 * @param {object} [overlayQi] - secondary Qi to superimpose (dimmed)
 * @param {string} [label] - chart label
 * @param {string} [overlayLabel] - overlay label
 * @param {number} [size] - SVG size in px
 */
function PentagonRadar({ qi, overlayQi, label = 'Current', overlayLabel = 'Natal', size = 180 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const labelR = size * 0.46;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Primary shape
  const pts = qiToRadarPoints(qi, cx, cy, radius);
  const ptsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

  // Overlay shape (dimmed)
  const overlayPts = overlayQi ? qiToRadarPoints(overlayQi, cx, cy, radius) : null;
  const overlayStr = overlayPts ? overlayPts.map(p => `${p.x},${p.y}`).join(' ') : '';

  // Percentages for labels
  const totalPrimary = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={pentagonGridPoints(cx, cy, radius, level)}
            fill="none"
            stroke={i === gridLevels.length - 1 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)"}
            strokeWidth={i === gridLevels.length - 1 ? 1.5 : 0.7}
          />
        ))}

        {/* Axis lines */}
        {ELEMENTS.map((_, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(RADAR_ANGLES[i])}
            y2={cy - radius * Math.sin(RADAR_ANGLES[i])}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={0.7}
          />
        ))}

        {/* Overlay shape (dimmed, behind primary) */}
        {overlayStr && (
          <>
            <polygon
              points={overlayStr}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            {overlayPts.map((p, i) => (
              <circle key={`od${i}`} cx={p.x} cy={p.y} r={3} fill="rgba(255,255,255,0.5)" />
            ))}
          </>
        )}

        {/* Primary shape */}
        <polygon
          points={ptsStr}
          fill="rgba(251,191,36,0.25)"
          stroke="#fbbf24"
          strokeWidth={2.5}
        />
        {pts.map((p, i) => (
          <circle key={`pd${i}`} cx={p.x} cy={p.y} r={3.5}
            fill={ELEM_COLORS[ELEMENTS[i]]}
            stroke="#000" strokeWidth={1}
          />
        ))}

        {/* Element labels around the pentagon */}
        {ELEMENTS.map((el, i) => {
          const lx = cx + labelR * Math.cos(RADAR_ANGLES[i]);
          const ly = cy - labelR * Math.sin(RADAR_ANGLES[i]);
          const pct = totalPrimary > 0 ? ((qi[el] || 0) / totalPrimary * 100).toFixed(0) : '0';
          return (
            <text
              key={el}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fill={ELEM_COLORS[el]}
              fontSize={11}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {RADAR_ELEMENT_ICONS[el]} {pct}%
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-1 text-[10px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-4 h-1 bg-amber-400 rounded" />
          <span className="text-amber-200 font-semibold">{label}</span>
        </div>
        {overlayQi && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-0.5 border border-white/50 border-dashed rounded" />
            <span className="text-gray-300">{overlayLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// QI BAR — raw points bar (wider = more Qi, NOT capped at 100%)
// ============================================================================

function QiBar({ qi, maxPts, showPct }) {
  const max = maxPts || Math.max(...ELEMENTS.map(k => qi[k]), 1);
  const total = showPct ? ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0) : 0;
  return (
    <div className="space-y-1">
      {ELEMENTS.map(el => {
        const pct = Math.min((qi[el] / max) * 100, 100);
        const val = qi[el];
        const elPct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
        return (
          <div key={el} className="flex items-center gap-2 text-xs">
            <span className="w-12 text-right font-mono" style={{ color: ELEM_COLORS[el] }}>
              {el}
            </span>
            <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden relative">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: ELEM_COLORS[el],
                  opacity: 0.8,
                  minWidth: val > 0 ? '3.2rem' : 0,
                }}
              />
              <span className="absolute inset-0 flex items-center px-1.5 text-[10px] font-mono font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {val > 0 ? `${val.toFixed(3)}` : ''}
              </span>
            </div>
            {showPct && (
              <span className="w-12 text-right text-[10px] font-mono font-semibold text-white">{elPct}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

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

  const total = ELEMENTS.reduce((s, k) => s + breakdown.raw[k], 0);
  const qiWeightLines = QI_WEIGHT_LABEL[label].split('\n');

  return (
    <div className="flex flex-col h-full">
      {/* Pillar Card — Qi weights in header */}
      <ModularPillarCard
        label={label}
        pillar={pillar}
        isYou={isYou}
        compact
        showHiddenRoots
        metaOverride={{
          weight: label === 'Day' ? 'Qi=50%' : `Qi=${label === 'Month' ? '30' : '10'}%`,
          subtitle: label === 'Day'
            ? 'Day Master 35% + Day Branch 15%'
            : label === 'Month'
              ? 'Season, environment, element strength'
              : label === 'Year'
                ? 'Ancestral Qi, early life'
                : 'Inner mind, late life',
        }}
      />

      {/* Structured summary strip: Raw / Stem / Branch / Qi weight */}
      <div className="mt-1 px-3 py-2 rounded-lg bg-slate-800/80 border border-white/10 font-mono text-[11px] leading-snug space-y-0.5">
        <div className="text-gray-300">
          <span className="text-white font-semibold">{label.toUpperCase()} PILLAR</span> Raw = <span className="text-white">{total.toFixed(3)} pts</span>
        </div>
        <div className="text-gray-500">
          {label.toUpperCase()} Stem (S) = <span className="text-gray-300">1 pts</span>
        </div>
        <div className="text-gray-500">
          {label.toUpperCase()} Branch (B) = <span className="text-gray-300">10 pts</span>
        </div>
        <div className="border-t border-white/10 my-1" />
        {qiWeightLines.map((line, i) => (
          <div key={i} className="text-amber-400/80 text-[10px]">{line}</div>
        ))}
      </div>

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
            {total.toFixed(3)} pts
          </span>
          <span className="text-gray-500 text-xs">{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {/* Expandable baby-step calculation flap */}
      {expanded && (
        <div className="mt-1 p-3 rounded-lg bg-slate-900/80 border border-white/10 space-y-3 max-h-[32rem] overflow-y-auto">
          <BabyStepCalc breakdown={breakdown} label={label} birthMonthBranch={birthMonthBranch} dayMasterPolarity={dayMasterPolarity} dayMasterElement={dayMasterElement} />

          {/* Visual Qi bar summaries */}
          <Sep />
          <div className="text-xs font-semibold text-gray-300 mb-1">Raw Element Distribution</div>
          <QiBar qi={breakdown.raw} />
          <div className="text-xs font-semibold text-gray-300 mb-1 mt-2">Season-Adjusted Distribution</div>
          <QiBar qi={breakdown.seasoned} />
          {breakdown.polarityAdjusted && (
            <>
              <div className="text-xs font-semibold text-gray-300 mb-1 mt-2">Polarity + Season Adjusted Distribution</div>
              <QiBar qi={breakdown.polarityAdjusted} />
            </>
          )}
          {breakdown.qiWeighted && (
            <>
              <div className="text-xs font-semibold text-amber-300 mb-1 mt-2">Functional Qi (Qi-Weighted)</div>
              <QiBar qi={breakdown.qiWeighted} />
            </>
          )}
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
      <QiBar qi={raw} />

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
          <QiBar qi={seasoned} />
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
          <QiBar qi={polarityAdjusted} />
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
          <QiBar qi={qiWeighted} />
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
          weight: label === 'Year' ? 'Qi=10%' : 'Qi=30%',
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
// COMBINED YEAR+MONTH FUNCTIONAL QI (CYMFQ) — Step 1 in monthly analysis
// ============================================================================

function CombinedYMFQPanel({ yearFq, monthFq, year, monthName, userTfq }) {
  const [open, setOpen] = useState(false);

  // Combine Year FQ + Month FQ
  const cymfq = {};
  let totalCym = 0;
  ELEMENTS.forEach(el => {
    cymfq[el] = (yearFq[el] || 0) + (monthFq[el] || 0);
    totalCym += cymfq[el];
  });

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 1: Combined Year + Month Functional Qi (CYMFQ)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalCym.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {/* Context */}
          <div className="text-xs text-gray-500 font-mono">
            Year: <span className="text-white">{year}</span> &nbsp;|&nbsp; Month: <span className="text-white">{monthName}</span>
          </div>
          <div className="text-xs text-gray-500">
            Combine Current Year Functional Qi (10%) and Current Month Functional Qi (30%) to determine their influence on natal Functional Qi.
          </div>

          {/* Header row */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">Year Qi<br /><span className="text-[9px]">(CYFQ) 10%</span></th>
                  <th className="px-2 py-1 text-center text-gray-500">+</th>
                  <th className="px-2 py-1 text-right text-gray-400">Month Qi<br /><span className="text-[9px]">(CMFQ) 30%</span></th>
                  <th className="px-2 py-1 text-center text-gray-500">=</th>
                  <th className="px-2 py-1 text-right text-white">CYMFQ</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => (
                  <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-2 py-1">
                      <ElSpan el={el}>{el}</ElSpan>
                    </td>
                    <td className="px-2 py-1 text-right text-gray-300">{(yearFq[el] || 0).toFixed(3)}</td>
                    <td className="px-2 py-1 text-center text-gray-500">+</td>
                    <td className="px-2 py-1 text-right text-gray-300">{(monthFq[el] || 0).toFixed(3)}</td>
                    <td className="px-2 py-1 text-center text-gray-500">=</td>
                    <td className="px-2 py-1 text-right text-white font-semibold">{cymfq[el].toFixed(3)}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-2 py-1 text-gray-400 font-semibold">Total</td>
                  <td className="px-2 py-1 text-right text-gray-400">
                    {ELEMENTS.reduce((s, el) => s + (yearFq[el] || 0), 0).toFixed(3)}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-500">+</td>
                  <td className="px-2 py-1 text-right text-gray-400">
                    {ELEMENTS.reduce((s, el) => s + (monthFq[el] || 0), 0).toFixed(3)}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-500">=</td>
                  <td className="px-2 py-1 text-right text-white font-bold">{totalCym.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Formula breakdown */}
          <div className="text-[10px] font-mono text-gray-400 space-y-0.5">
            {ELEMENTS.map(el => (
              <div key={el}>
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (CYMFQ)</span>
                {' = '}
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (CYFQ)</span>
                {' + '}
                <ElSpan el={el}>{el}</ElSpan>
                <span className="text-gray-500"> (CMFQ)</span>
                {' = '}
                <span className="text-gray-400">{(yearFq[el] || 0).toFixed(3)}</span>
                {' + '}
                <span className="text-gray-400">{(monthFq[el] || 0).toFixed(3)}</span>
                {' = '}
                <span className="text-white font-semibold">{cymfq[el].toFixed(3)}</span>
              </div>
            ))}
          </div>

          {/* QiBar */}
          <div className="text-xs font-semibold text-amber-300 mb-1">Combined Year + Month Functional Qi</div>
          <QiBar qi={cymfq} />
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
const CLASH_PAIRS = [
  { attacker: 'Metal', victim: 'Wood',  label: 'Metal chops Wood' },
  { attacker: 'Water', victim: 'Fire',  label: 'Water quenches Fire' },
  { attacker: 'Fire',  victim: 'Metal', label: 'Fire melts Metal' },
  { attacker: 'Wood',  victim: 'Earth', label: 'Wood penetrates Earth' },
  { attacker: 'Earth', victim: 'Water', label: 'Earth dams Water' },
];

/**
 * Structured clash event — "who did what to whom"
 * @typedef {Object} ClashEvent
 */

// Single-pass clash: internal tensions within one Qi pool
// Returns structured events with attacker/victim metadata
function applyClashes(qi, source = 'internal') {
  const result = { ...qi };
  const details = [];
  const events = [];

  CLASH_PAIRS.forEach(({ attacker, victim, label }) => {
    const aVal = result[attacker];
    const vVal = result[victim];
    if (aVal > vVal && aVal > 0) {
      const drain = aVal * 0.10;
      const cost  = aVal * 0.02;
      const newVic = Math.max(0, vVal - drain);
      const newAtk = Math.max(0, aVal - cost);

      events.push({
        source,
        attacker,
        victim,
        attackerBefore: aVal,
        victimBefore: vVal,
        attackerAfter: newAtk,
        victimAfter: newVic,
        victimDelta: newVic - vVal,
        attackerDelta: newAtk - aVal,
        label,
        narrative: `${source === 'natal' ? 'Natal' : 'Transit'} ${attacker} (${aVal.toFixed(3)}) attacked ${source === 'natal' ? 'natal' : 'transit'} ${victim} (${vVal.toFixed(3)}): ${victim} −${drain.toFixed(3)}, ${attacker} −${cost.toFixed(3)}`,
      });

      result[victim]   = newVic;
      result[attacker] = newAtk;
      details.push(`${label}: ${victim} −${drain.toFixed(3)}, ${attacker} −${cost.toFixed(3)}`);
    }
  });

  return { result, details, events };
}

// Directional clash: transit (attacker source) presses natal (victim target)
// Transit element attacks the natal element it controls — one-directional
function applyDirectionalClashes(natal, transit) {
  const result = { ...natal };
  const details = [];
  const events = [];

  CLASH_PAIRS.forEach(({ attacker, victim, label }) => {
    const transitAtk = transit[attacker] || 0;
    const natalVic = result[victim] || 0;
    if (transitAtk > natalVic && transitAtk > 0) {
      const drain = transitAtk * 0.10;
      const newVic = Math.max(0, natalVic - drain);

      events.push({
        source: 'transit→natal',
        attacker,
        victim,
        attackerBefore: transitAtk,
        victimBefore: natalVic,
        attackerAfter: transitAtk, // transit NOT reduced
        victimAfter: newVic,
        victimDelta: newVic - natalVic,
        attackerDelta: 0,
        label,
        narrative: `Transit ${attacker} (${transitAtk.toFixed(3)}) pressed natal ${victim} (${natalVic.toFixed(3)}): ${victim} −${drain.toFixed(3)} (transit unchanged)`,
      });

      result[victim] = newVic;
      details.push(`${label}: transit ${attacker} (${transitAtk.toFixed(3)}) → natal ${victim} −${drain.toFixed(3)}`);
    }
  });

  return { result, details, events };
}

// Three-pass clash system: natal internal, transit internal, transit→natal directional
function computeThreePassClashes(atfq, acymfq) {
  // Pass A: Natal-on-Natal internal tensions
  const passA = applyClashes(atfq, 'natal');

  // Pass B: Transit-on-Transit internal clashes (Year vs Month fighting)
  const passB = applyClashes(acymfq, 'transit');

  // Pass C: Transit → Natal directional pressure (weather hitting the car)
  // Apply to natal AFTER its own internal clashes, using transit AFTER its own internal clashes
  const passC = applyDirectionalClashes(passA.result, passB.result);

  // Recombine: modified natal + modified transit = post-clash NTFQ
  const combined = {};
  ELEMENTS.forEach(el => {
    combined[el] = (passC.result[el] || 0) + (passB.result[el] || 0);
  });

  // Collect all events across all three passes
  const allEvents = [
    ...passA.events,
    ...passB.events,
    ...passC.events,
  ];

  return { passA, passB, passC, combined, allEvents };
}

// Sheng (生) cycle: gentle nourishment — parent feeds child
const SHENG_PAIRS = [
  { parent: 'Wood',  child: 'Fire',  label: 'Wood feeds Fire' },
  { parent: 'Fire',  child: 'Earth', label: 'Fire creates Earth' },
  { parent: 'Earth', child: 'Metal', label: 'Earth bears Metal' },
  { parent: 'Metal', child: 'Water', label: 'Metal enriches Water' },
  { parent: 'Water', child: 'Wood',  label: 'Water nourishes Wood' },
];

const SHENG_RATE = 0.03;           // 3% of parent value
const SHENG_MAX_BOOST_RATIO = 0.20; // child can gain at most +20% of its own value

function applySheng(qi) {
  const result = { ...qi };
  const details = [];

  SHENG_PAIRS.forEach(({ parent, child, label }) => {
    const parentVal = qi[parent];  // use original values, not mutated
    const childVal = qi[child];

    if (parentVal > childVal && parentVal > 0) {
      const rawBoost = parentVal * SHENG_RATE;
      const maxBoost = childVal * SHENG_MAX_BOOST_RATIO;
      const boost = Math.min(rawBoost, maxBoost > 0 ? maxBoost : rawBoost);
      result[child] = childVal + boost;
      details.push(`${label}: ${child} +${boost.toFixed(3)} (${parent} ${parentVal.toFixed(3)} × ${(SHENG_RATE * 100).toFixed(0)}%)`);
    }
  });

  return { result, details };
}

// ============================================================================
// OVERCROWDING — Soft bleed-off when one element dominates
// ============================================================================

// Thresholds — professional BaZi grade
const OVERCROWDING_SHARE_THRESHOLD = 0.35;  // element > 35% of total
const OVERCROWDING_RATIO_THRESHOLD = 2.0;   // element > 2× average
const OVERCROWDING_BLEED_RATE = 0.10;       // 10% of excess bleeds to child
const OVERCROWDING_MAX_BLEED = 0.50;        // cap at 0.50 pts per element

// Sheng child map for bleed target
const SHENG_CHILD = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };

function applyOvercrowding(qi) {
  const result = { ...qi };
  const details = [];
  const total = ELEMENTS.reduce((s, el) => s + (qi[el] || 0), 0);
  const avg = total / 5;

  ELEMENTS.forEach(el => {
    const val = qi[el] || 0;
    if (total <= 0 || val <= 0) return;

    const share = val / total;
    const ratio = avg > 0 ? val / avg : 0;

    if (share > OVERCROWDING_SHARE_THRESHOLD || ratio > OVERCROWDING_RATIO_THRESHOLD) {
      const excess = val - (avg * OVERCROWDING_RATIO_THRESHOLD);
      if (excess <= 0) return;

      const rawBleed = excess * OVERCROWDING_BLEED_RATE;
      const bleed = Math.min(rawBleed, OVERCROWDING_MAX_BLEED);
      const child = SHENG_CHILD[el];

      result[el] = val - bleed;
      result[child] = (result[child] || 0) + bleed;

      details.push({
        element: el,
        child,
        share: (share * 100).toFixed(1),
        ratio: ratio.toFixed(2),
        bleed: bleed.toFixed(3),
        label: `${el} overcrowded (${(share * 100).toFixed(1)}% of total, ${ratio.toFixed(1)}× avg) → ${bleed.toFixed(3)} pts softly redirected to ${child}`,
      });
    }
  });

  return { result, details };
}

// Control cycle: gentle 2% universal damping
function applyControl(qi) {
  const result = {};
  const details = [];
  ELEMENTS.forEach(el => {
    result[el] = qi[el] * 0.98;
    if (qi[el] > 0) {
      details.push(`${el}: ${qi[el].toFixed(3)} × 0.98 = ${result[el].toFixed(3)}`);
    }
  });
  return { result, details };
}

// Transformation: when one element overwhelms another (ratio > 3, absolute > 1.5)
// the victim transforms into its child element on the productive cycle
const TRANSFORM_RULES = [
  { attacker: 'Fire',  victim: 'Metal', product: 'Water', label: 'Fire melts Metal → Water' },
  { attacker: 'Metal', victim: 'Wood',  product: 'Fire',  label: 'Metal chops Wood → Fire' },
  { attacker: 'Water', victim: 'Fire',  product: 'Earth', label: 'Water drowns Fire → Earth' },
  { attacker: 'Wood',  victim: 'Earth', product: 'Metal', label: 'Wood uproots Earth → Metal' },
  { attacker: 'Earth', victim: 'Water', product: 'Wood',  label: 'Earth absorbs Water → Wood' },
];

function applyTransformations(qi) {
  const result = { ...qi };
  const details = [];

  TRANSFORM_RULES.forEach(({ attacker, victim, product, label }) => {
    const aVal = result[attacker];
    const vVal = result[victim];
    if (aVal > 1.5 && vVal > 0 && aVal / vVal > 3) {
      const melt = vVal * 0.30;
      result[victim]  = Math.max(0, vVal - melt);
      result[product] = (result[product] || 0) + melt;
      details.push(`${label}: ${victim} −${melt.toFixed(3)} → ${product} +${melt.toFixed(3)}`);
    }
  });

  return { result, details };
}

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
// EVENT TIMELINE — unified narratable log of all pipeline events
// ============================================================================

const EVENT_TYPE_META = {
  'void':           { icon: '🕳️', color: 'text-purple-300', label: 'Void' },
  'stem-combo':     { icon: '合',  color: 'text-amber-300',  label: 'Stem Combination' },
  'liu-he':         { icon: '六',  color: 'text-cyan-300',   label: 'Branch Six Combo' },
  'san-he':         { icon: '三',  color: 'text-emerald-300',label: 'Three Harmony' },
  'san-hui':        { icon: '会',  color: 'text-rose-300',   label: 'Three Meetings' },
  'clash-natal':    { icon: '🔵', color: 'text-blue-300',   label: 'Natal Clash' },
  'clash-transit':  { icon: '🟠', color: 'text-orange-300', label: 'Transit Clash' },
  'clash-directed': { icon: '🔴', color: 'text-red-300',    label: 'Transit→Natal' },
  'sheng':          { icon: '生',  color: 'text-green-300',  label: 'Nourishment' },
  'overcrowding':   { icon: '溢',  color: 'text-lime-300',   label: 'Overcrowding' },
  'transform':      { icon: '化',  color: 'text-yellow-300', label: 'Transformation' },
  'collapse':       { icon: '💥', color: 'text-red-400',    label: 'Collapse' },
};

function EventTimeline({ comboResult, clashResult, shengDetails, overcrowdingDetails, transformDetails, collapseQi }) {
  const [open, setOpen] = useState(false);

  // Build unified event list
  const timeline = [];

  // Void events
  if (comboResult?.voidEvents?.length > 0) {
    for (const ev of comboResult.voidEvents) {
      timeline.push({
        type: 'void',
        narrative: `${ev.pillarLabel} ${ev.branch} (${ev.animal}) is void — ${ev.element} −${ev.qiReduction.toFixed(3)} Qi`,
      });
    }
  }

  // Combination events
  if (comboResult?.events?.length > 0) {
    for (const ev of comboResult.events) {
      timeline.push({
        type: ev.type,
        narrative: ev.voidBlocked
          ? `${ev.label} — blocked by void`
          : ev.transformed
            ? `${ev.label} — ${ev.detail}`
            : `${ev.label} — bond only, no transform`,
      });
    }
  }

  // Clash events (from allEvents)
  if (clashResult?.allEvents?.length > 0) {
    for (const ev of clashResult.allEvents) {
      const typeKey = ev.source === 'natal' ? 'clash-natal' : ev.source === 'transit' ? 'clash-transit' : 'clash-directed';
      timeline.push({
        type: typeKey,
        narrative: ev.narrative,
      });
    }
  }

  // Sheng events
  if (shengDetails?.length > 0) {
    for (const d of shengDetails) {
      timeline.push({ type: 'sheng', narrative: typeof d === 'string' ? d : d.label || String(d) });
    }
  }

  // Overcrowding events
  if (overcrowdingDetails?.length > 0) {
    for (const d of overcrowdingDetails) {
      timeline.push({ type: 'overcrowding', narrative: typeof d === 'string' ? d : d.label || String(d) });
    }
  }

  // Transform events
  if (transformDetails?.length > 0) {
    for (const d of transformDetails) {
      timeline.push({ type: 'transform', narrative: typeof d === 'string' ? d : d.label || String(d) });
    }
  }

  // Structural collapse detection
  if (collapseQi) {
    const collapse = analyzeStructuralCollapse(collapseQi);
    if (collapse.mode !== 'none') {
      const meta = COLLAPSE_META[collapse.mode];
      timeline.push({
        type: 'collapse',
        narrative: `${meta?.name || collapse.mode}: ${collapse.primary ? collapse.primary + ' at ' + (collapse.primaryShare * 100).toFixed(1) + '%' : ''} — ${meta?.description || ''}`,
      });
    }
  }

  if (timeline.length === 0) return null;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Event Timeline — What Happened This Month
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{timeline.length} events</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-1 max-h-[28rem] overflow-y-auto">
          <div className="text-xs text-gray-500 mb-2">
            Complete narrative of every Qi interaction this month — who did what to whom.
          </div>
          {timeline.map((ev, i) => {
            const meta = EVENT_TYPE_META[ev.type] || { icon: '?', color: 'text-gray-400', label: ev.type };
            return (
              <div key={i} className="flex items-start gap-2 text-[10px] font-mono py-1 border-b border-white/5 last:border-0">
                <span className={`${meta.color} font-bold shrink-0 w-6 text-center`}>{meta.icon}</span>
                <span className={`${meta.color} shrink-0 w-24`}>{meta.label}</span>
                <span className="text-gray-300 flex-1">{ev.narrative}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 7: SHENG CYCLE NOURISHMENT (生)
// ============================================================================

function ShengNourishmentPanel({ postClashQi }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!postClashQi) return null;

  const { result: afterSheng, details } = applySheng(postClashQi);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (afterSheng[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 7: Sheng Cycle Nourishment — Generating Cycle (生)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalAfter.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            After destructive clashes settle, the productive cycle gently nourishes:
            a strong parent feeds its child element. Rate: {(SHENG_RATE * 100).toFixed(0)}% of parent,
            capped at {(SHENG_MAX_BOOST_RATIO * 100).toFixed(0)}% of child's current value.
            Parent is NOT drained — this is gentle nourishment, not exhaustion.
            <button onClick={() => setShowExplain(!showExplain)} className="ml-2 text-green-400 hover:text-green-300 underline text-xs">
              {showExplain ? 'Hide explanation' : 'Learn more'}
            </button>
          </div>
          {showExplain && (
            <div className="rounded-lg bg-slate-900/80 border border-green-500/20 p-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
              {SHENG_EXPLANATION_MD}
            </div>
          )}

          {/* Sheng cycle reference */}
          <div className="text-[10px] font-mono text-gray-500 bg-white/5 rounded p-2 space-y-0.5">
            <div><ElSpan el="Wood">Wood</ElSpan> → feeds → <ElSpan el="Fire">Fire</ElSpan></div>
            <div><ElSpan el="Fire">Fire</ElSpan> → creates → <ElSpan el="Earth">Earth</ElSpan></div>
            <div><ElSpan el="Earth">Earth</ElSpan> → bears → <ElSpan el="Metal">Metal</ElSpan></div>
            <div><ElSpan el="Metal">Metal</ElSpan> → enriches → <ElSpan el="Water">Water</ElSpan></div>
            <div><ElSpan el="Water">Water</ElSpan> → nourishes → <ElSpan el="Wood">Wood</ElSpan></div>
          </div>

          {/* Nourishment details */}
          {details.length > 0 ? (
            <div className="text-[10px] font-mono text-gray-400 space-y-0.5 bg-white/5 rounded p-2">
              {details.map((d, i) => <div key={i}>🌱 {d}</div>)}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 italic">No nourishment active — no parent is stronger than its child.</div>
          )}

          {/* Before / After */}
          <div className="text-xs font-semibold text-gray-300 mb-1">Before → After Sheng Nourishment</div>
          <BeforeAfterBars before={postClashQi} after={afterSheng} />

          {/* After QiBar */}
          <div className="text-xs font-semibold text-green-300 mb-1 mt-2">Post-Sheng Qi</div>
          <QiBar qi={afterSheng} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 7.5: OVERCROWDING — SOFT BLEED-OFF (溢)
// ============================================================================

function OvercrowdingPanel({ postShengQi }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!postShengQi) return null;

  const { result: afterOvercrowding, details } = applyOvercrowding(postShengQi);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (afterOvercrowding[el] || 0), 0);
  const total = ELEMENTS.reduce((s, el) => s + (postShengQi[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 7.5: Overcrowding — Soft Bleed-Off (溢)
          {details.length > 0 && <span className="ml-2 text-xs text-orange-400">({details.length} overcrowded)</span>}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalAfter.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            When one element exceeds 35% of total Qi or 2× the average, excess energy
            softly bleeds into its generating-cycle child (10% of excess, capped at 0.50 pts).
            This models self-generated instability — dominance that overflows.
            <button onClick={() => setShowExplain(!showExplain)} className="ml-2 text-orange-400 hover:text-orange-300 underline text-xs">
              {showExplain ? 'Hide explanation' : 'Learn more'}
            </button>
          </div>

          {showExplain && (
            <div className="rounded-lg bg-slate-900/80 border border-orange-500/20 p-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
              {OVERCROWDING_EXPLANATION_MD}
            </div>
          )}

          {/* Thresholds reference */}
          <div className="text-[10px] font-mono text-gray-500 bg-white/5 rounded p-2 space-y-0.5">
            <div>Share threshold: &gt;{(OVERCROWDING_SHARE_THRESHOLD * 100).toFixed(0)}% of total</div>
            <div>Ratio threshold: &gt;{OVERCROWDING_RATIO_THRESHOLD.toFixed(1)}× average</div>
            <div>Bleed rate: {(OVERCROWDING_BLEED_RATE * 100).toFixed(0)}% of excess → child</div>
            <div>Max bleed: {OVERCROWDING_MAX_BLEED.toFixed(2)} pts per element</div>
          </div>

          {/* Element status table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">Qi</th>
                  <th className="px-2 py-1 text-right text-gray-400">Share</th>
                  <th className="px-2 py-1 text-right text-gray-400">× Avg</th>
                  <th className="px-2 py-1 text-center text-gray-400">Overcrowded?</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const val = postShengQi[el] || 0;
                  const avg = total / 5;
                  const share = total > 0 ? val / total : 0;
                  const ratio = avg > 0 ? val / avg : 0;
                  const isOver = share > OVERCROWDING_SHARE_THRESHOLD || ratio > OVERCROWDING_RATIO_THRESHOLD;
                  return (
                    <tr key={el} className={`border-t border-white/5 ${isOver ? 'bg-orange-500/10' : ''}`}>
                      <td className="px-2 py-1"><ElSpan el={el}>{el}</ElSpan></td>
                      <td className="px-2 py-1 text-right text-gray-300">{val.toFixed(3)}</td>
                      <td className="px-2 py-1 text-right text-gray-400">{(share * 100).toFixed(1)}%</td>
                      <td className="px-2 py-1 text-right text-gray-400">{ratio.toFixed(2)}×</td>
                      <td className="px-2 py-1 text-center">{isOver ? <span className="text-orange-400 font-bold">YES</span> : <span className="text-gray-600">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bleed events */}
          {details.length > 0 ? (
            <div className="text-[10px] font-mono text-gray-400 space-y-0.5 bg-white/5 rounded p-2">
              {details.map((d, i) => (
                <div key={i}>
                  🌊 <ElSpan el={d.element}>{d.element}</ElSpan>
                  {' → '}
                  <span className="text-orange-300">−{d.bleed}</span>
                  {' → '}
                  <ElSpan el={d.child}>{d.child}</ElSpan>
                  {' '}
                  <span className="text-green-300">+{d.bleed}</span>
                  <span className="text-gray-600 ml-2">({d.share}% share, {d.ratio}× avg)</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 italic">No overcrowding detected — all elements within balanced thresholds.</div>
          )}

          {/* Before / After */}
          <div className="text-xs font-semibold text-gray-300 mb-1">Before → After Overcrowding</div>
          <BeforeAfterBars before={postShengQi} after={afterOvercrowding} />

          <div className="text-xs font-semibold text-orange-300 mb-1 mt-2">Post-Overcrowding Qi</div>
          <QiBar qi={afterOvercrowding} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 8: CONTROL CYCLE PRESSURE
// ============================================================================

function ControlCyclePressurePanel({ postClashQi }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!postClashQi) return null;

  const { result: afterControl, details } = applyControl(postClashQi);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (afterControl[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden" data-step="control" data-qi={JSON.stringify(afterControl)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 8: Control Cycle Pressure — Universal Damping (2%)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalAfter.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            All elements experience a gentle 2% loss from the natural friction of the control cycle.
            This models the universal cost of maintaining elemental balance — no element exists in isolation.
            <button onClick={() => setShowExplain(!showExplain)} className="ml-2 text-purple-400 hover:text-purple-300 underline text-xs">
              {showExplain ? 'Hide explanation' : 'Learn more'}
            </button>
          </div>
          {showExplain && (
            <div className="rounded-lg bg-slate-900/80 border border-purple-500/20 p-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
              {DAMPING_EXPLANATION_MD}
            </div>
          )}

          {/* Calculation */}
          <div className="text-[10px] font-mono text-gray-400 space-y-0.5 bg-white/5 rounded p-2">
            {details.map((d, i) => <div key={i}>{d}</div>)}
          </div>

          {/* Before / After */}
          <div className="text-xs font-semibold text-gray-300 mb-1">Before → After Control Damping</div>
          <BeforeAfterBars before={postClashQi} after={afterControl} />

          {/* After QiBar */}
          <div className="text-xs font-semibold text-purple-300 mb-1 mt-2">Post-Control Qi</div>
          <QiBar qi={afterControl} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 9: TRANSFORMATION (HYBRID RULE)
// ============================================================================

function TransformationPanel({ postControlQi }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!postControlQi) return null;

  const { result: afterTransform, details } = applyTransformations(postControlQi);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (afterTransform[el] || 0), 0);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden" data-step="transform" data-qi={JSON.stringify(afterTransform)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-200">
          Step 9: Transformation — Elemental Transmutation (化)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">{totalAfter.toFixed(3)} pts</span>
          <span className="text-gray-500">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-500">
            When an element overwhelms another (ratio &gt; 3:1 and attacker &gt; 1.5 pts),
            30% of the victim transforms into its productive-cycle child.
            This models extreme elemental pressure causing transmutation.
            <button onClick={() => setShowExplain(!showExplain)} className="ml-2 text-amber-400 hover:text-amber-300 underline text-xs">
              {showExplain ? 'Hide explanation' : 'Learn more'}
            </button>
          </div>
          {showExplain && (
            <div className="rounded-lg bg-slate-900/80 border border-amber-500/20 p-3 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
              {TRANSFORMATION_EXPLANATION_MD}
            </div>
          )}

          {/* Transform details */}
          {details.length > 0 ? (
            <div className="text-[10px] font-mono text-gray-400 space-y-0.5 bg-white/5 rounded p-2">
              {details.map((d, i) => <div key={i}>🔄 {d}</div>)}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 italic">No transformations triggered — no element pair exceeds the 3:1 ratio threshold.</div>
          )}

          {/* Transformation rule table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Rule</th>
                  <th className="px-2 py-1 text-right text-gray-400">Attacker</th>
                  <th className="px-2 py-1 text-right text-gray-400">Victim</th>
                  <th className="px-2 py-1 text-right text-gray-400">Ratio</th>
                  <th className="px-2 py-1 text-center text-gray-400">Triggered?</th>
                </tr>
              </thead>
              <tbody>
                {TRANSFORM_RULES.map((rule, i) => {
                  const aVal = postControlQi[rule.attacker] || 0;
                  const vVal = postControlQi[rule.victim] || 0;
                  const ratio = vVal > 0 ? aVal / vVal : 0;
                  const triggered = aVal > 1.5 && vVal > 0 && ratio > 3;
                  return (
                    <tr key={i} className={`border-t border-white/5 ${triggered ? 'bg-amber-500/10' : ''}`}>
                      <td className="px-2 py-1 text-gray-300">{rule.label}</td>
                      <td className="px-2 py-1 text-right">
                        <ElSpan el={rule.attacker}>{aVal.toFixed(3)}</ElSpan>
                      </td>
                      <td className="px-2 py-1 text-right">
                        <ElSpan el={rule.victim}>{vVal.toFixed(3)}</ElSpan>
                      </td>
                      <td className="px-2 py-1 text-right text-gray-400">
                        {vVal > 0 ? ratio.toFixed(1) + ':1' : '∞'}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {triggered
                          ? <span className="text-amber-400 font-bold">YES</span>
                          : <span className="text-gray-600">no</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Before / After */}
          <div className="text-xs font-semibold text-gray-300 mb-1">Before → After Transformation</div>
          <BeforeAfterBars before={postControlQi} after={afterTransform} />

          {/* After QiBar */}
          <div className="text-xs font-semibold text-amber-300 mb-1 mt-2">Post-Transformation Qi</div>
          <QiBar qi={afterTransform} />
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

// ── UI Panel ──

const COLLAPSE_EXPLANATION_MD = `## Structural Collapse (格局)

After the full pipeline runs, the engine checks whether the resulting Qi landscape
has collapsed into a recognizable extreme structural pattern.

### Why This Matters

In classical BaZi, extreme charts require DIFFERENT reading strategies:

- **Follow the Strong (從旺格)**: When one element dominates overwhelmingly,
  you support it instead of fighting it. Trying to "balance" a dominant chart
  can make things worse.

- **Two Gods (兩神成象)**: When two elements dominate, the chart oscillates
  between them. Balance between the two poles is the key.

- **Drained (虛弱)**: A nearly absent element is an urgent priority.
  Stones and remedies should target this element specifically.

- **Inverted (反局)**: Extreme ratio between strongest and weakest.
  Not full collapse but structural stress requiring attention.

### Thresholds

| Pattern | Condition |
|---------|-----------|
| Single Dominant | > 55% share AND > 20% gap to second |
| Bi-Polar | Top two > 80% combined |
| Drained | Bottom element < 5% |
| Inverted | Top / bottom ratio > 3× |

### Professional Note

Structural collapse detection changes the Yong Shen strategy:
- Normal chart: strengthen the weakest element
- Collapsed chart: work WITH the dominant structure, not against it

This is the difference between amateur and professional BaZi.`;

function StructuralCollapsePanel({ finalQi }) {
  const [open, setOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  if (!finalQi) return null;

  const collapse = analyzeStructuralCollapse(finalQi);
  const meta = COLLAPSE_META[collapse.mode];
  const isCollapsed = collapse.mode !== 'none';

  return (
    <div className={`border rounded-lg overflow-hidden ${isCollapsed ? (meta?.border || 'border-white/10') : 'border-white/10'} ${isCollapsed ? (meta?.bg || '') : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className={`text-sm font-medium ${isCollapsed ? (meta?.color || 'text-gray-200') : 'text-gray-200'}`}>
          {isCollapsed ? `${meta?.icon || ''} Structural Collapse: ${meta?.name || collapse.mode}` : 'Structure: Balanced'}
        </span>
        <span className="text-gray-500">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          {isCollapsed ? (
            <>
              <div className={`text-xs ${meta?.color || 'text-gray-300'}`}>
                {meta?.description}
              </div>
              <div className="text-xs text-gray-400 italic">
                {meta?.implication}
              </div>

              {/* Collapse details */}
              <div className="rounded border border-white/10 p-2 space-y-1 bg-black/20">
                {collapse.notes.map((note, i) => (
                  <div key={i} className="text-[10px] font-mono text-gray-300">{note}</div>
                ))}
              </div>

              {/* Element shares bar */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-gray-400">Element Distribution</div>
                {ELEMENTS.map(el => {
                  const total = ELEMENTS.reduce((s, e) => s + (finalQi[e] || 0), 0);
                  const share = total > 0 ? ((finalQi[el] || 0) / total) * 100 : 0;
                  const isPrimary = el === collapse.primary;
                  const isSecondary = el === collapse.secondary;
                  return (
                    <div key={el} className="flex items-center gap-2">
                      <span className={`text-[9px] w-12 text-right ${isPrimary ? 'font-bold text-white' : isSecondary ? 'font-semibold text-gray-300' : 'text-gray-500'}`}>
                        {el}
                      </span>
                      <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${Math.max(share, share > 0 ? 1 : 0)}%`,
                            backgroundColor: ELEM_COLORS[el],
                            opacity: isPrimary ? 0.9 : isSecondary ? 0.7 : 0.35,
                          }}
                        />
                      </div>
                      <span className={`text-[9px] font-mono w-14 text-right ${isPrimary ? 'text-white font-bold' : 'text-gray-500'}`}>
                        {share.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500 italic">
              No structural collapse detected. Element distribution is within normal bounds.
            </div>
          )}

          {/* Learn more toggle */}
          <button
            onClick={() => setShowExplain(!showExplain)}
            className="text-[10px] text-blue-400 hover:text-blue-300 underline"
          >
            {showExplain ? 'Hide explanation' : 'Learn more about Structural Collapse (格局)'}
          </button>
          {showExplain && (
            <div className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap bg-black/30 rounded p-3 max-h-60 overflow-y-auto">
              {COLLAPSE_EXPLANATION_MD}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STEP 10: FINAL FUNCTIONAL QI (MFFQ)
// ============================================================================

function FinalFunctionalQiPanel({ atfq, acymfq }) {
  const [open, setOpen] = useState(false);

  if (!atfq || !acymfq) return null;

  // Run full pipeline: 3-Pass Clash → Sheng → Overcrowding → Control → Transform
  const { combined: postClash } = computeThreePassClashes(atfq, acymfq);
  const { result: postSheng } = applySheng(postClash);
  const { result: postOvercrowding } = applyOvercrowding(postSheng);
  const { result: postControl } = applyControl(postOvercrowding);
  const { result: finalQi } = applyTransformations(postControl);

  const ntfq = {};
  ELEMENTS.forEach(el => { ntfq[el] = (atfq[el] || 0) + (acymfq[el] || 0); });
  const totalBefore = ELEMENTS.reduce((s, el) => s + (ntfq[el] || 0), 0);
  const totalAfter = ELEMENTS.reduce((s, el) => s + (finalQi[el] || 0), 0);

  return (
    <div className="border border-amber-500/30 rounded-lg overflow-hidden bg-amber-500/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-amber-500/10 hover:bg-amber-500/15 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-amber-200">
          Step 10: Month Final Functional Qi (MFFQ) — Post-Pipeline
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-300">{totalAfter.toFixed(3)} pts</span>
          <span className="text-amber-400">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 space-y-3">
          <div className="text-xs text-gray-400">
            Full pipeline: NTFQ → Void/Combos → Clashes → Sheng → Overcrowding → Damping → Transformation = Final Qi.
            This is the true functional Qi for this month after all elemental interactions.
          </div>

          {/* Summary table */}
          <div className="rounded border border-white/10 overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-2 py-1 text-left text-gray-400">Element</th>
                  <th className="px-2 py-1 text-right text-gray-400">NTFQ (in)</th>
                  <th className="px-2 py-1 text-center text-gray-500">→</th>
                  <th className="px-2 py-1 text-right text-amber-300">Final Qi</th>
                  <th className="px-2 py-1 text-right text-gray-400">%</th>
                  <th className="px-2 py-1 text-right text-gray-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map(el => {
                  const before = ntfq[el] || 0;
                  const after = finalQi[el] || 0;
                  const pct = totalAfter > 0 ? (after / totalAfter) * 100 : 0;
                  const diff = after - before;
                  return (
                    <tr key={el} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-2 py-1.5"><ElSpan el={el}>{el}</ElSpan></td>
                      <td className="px-2 py-1.5 text-right text-gray-400">{before.toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">→</td>
                      <td className="px-2 py-1.5 text-right text-amber-200 font-semibold">{after.toFixed(3)}</td>
                      <td className="px-2 py-1.5 text-right" style={{ color: ELEM_COLORS[el] }}>{pct.toFixed(1)}%</td>
                      <td className={`px-2 py-1.5 text-right font-semibold ${diff > 0.0005 ? 'text-green-400' : diff < -0.0005 ? 'text-red-400' : 'text-gray-500'}`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t border-white/20 bg-white/5">
                  <td className="px-2 py-1.5 text-gray-400 font-semibold">Total</td>
                  <td className="px-2 py-1.5 text-right text-gray-400">{totalBefore.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-center text-gray-600">→</td>
                  <td className="px-2 py-1.5 text-right text-amber-200 font-bold">{totalAfter.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right text-white">100%</td>
                  <td className="px-2 py-1.5 text-right text-gray-500">{(totalAfter - totalBefore).toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Full pipeline before/after */}
          <div className="text-xs font-semibold text-gray-300 mb-1">NTFQ (Start) → Final Qi (End)</div>
          <BeforeAfterBars before={ntfq} after={finalQi} />

          {/* Final QiBar */}
          <div className="text-xs font-semibold text-amber-300 mb-1 mt-2">Month Final Functional Qi (MFFQ)</div>
          <QiBar qi={finalQi} showPct />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MONTH CARD — one month in the seasonal grid
// ============================================================================

function MonthCard({ snapshot, expanded, onToggle, dayMasterPolarity, dayMasterElement, year, userTfq, chart, qiMatrix }) {
  const fqi = snapshot.functionalQi;
  const total = ELEMENTS.reduce((s, k) => s + fqi[k], 0);
  const hasClash = snapshot.interactions.length > 0;

  const [yearFlapOpen, setYearFlapOpen] = useState(false);
  const [monthFlapOpen, setMonthFlapOpen] = useState(false);
  const [braceletOpen, setBraceletOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const yearBd = snapshot.yearPillarBreakdown;
  const monthBd = snapshot.monthPillarBreakdown;

  // Compute NTFQ (post-pipeline final Qi) for the radar overview
  const finalQiForRadar = useMemo(() => {
    if (!userTfq || !yearBd?.qiWeighted || !monthBd?.qiWeighted) return null;
    const cymfq = {};
    ELEMENTS.forEach(el => { cymfq[el] = (yearBd.qiWeighted[el] || 0) + (monthBd.qiWeighted[el] || 0); });
    const atfq = {};
    const acymfq = {};
    ELEMENTS.forEach(el => {
      atfq[el] = (userTfq[el] || 0) * 0.60;
      acymfq[el] = (cymfq[el] || 0) * 0.40;
    });
    // Build NTFQ for combination engine
    const ntfq = {};
    ELEMENTS.forEach(el => { ntfq[el] = (atfq[el] || 0) + (acymfq[el] || 0); });
    // Run combination engine (Void + Combos) before clashes
    let postComboNtfq = ntfq;
    if (chart?.pillars && qiMatrix?.yearPillar) {
      const comboCtx = buildCombinationContext(
        chart.pillars,
        { stem: qiMatrix.yearPillar.stem, branch: qiMatrix.yearPillar.branch },
        { stem: snapshot.monthStem, branch: snapshot.monthBranch },
        snapshot.monthBranch
      );
      const comboResult = applyCombinationEngine(ntfq, comboCtx);
      postComboNtfq = comboResult.postQi;
    }
    // Split back for 3-pass clash (preserve 60/40 ratio)
    const totalNtfq = ELEMENTS.reduce((s, el) => s + (ntfq[el] || 0), 0);
    const postAtfq = {};
    const postAcymfq = {};
    ELEMENTS.forEach(el => {
      const ratio = totalNtfq > 0 ? (atfq[el] || 0) / totalNtfq : 0.5;
      postAtfq[el] = (postComboNtfq[el] || 0) * ratio;
      postAcymfq[el] = (postComboNtfq[el] || 0) * (1 - ratio);
    });
    const { combined: postClash } = computeThreePassClashes(postAtfq, postAcymfq);
    const { result: postSheng } = applySheng(postClash);
    const { result: postOvercrowding } = applyOvercrowding(postSheng);
    const { result: postControl } = applyControl(postOvercrowding);
    const { result: finalQi } = applyTransformations(postControl);
    return finalQi;
  }, [userTfq, yearBd, monthBd, chart, qiMatrix, snapshot]);

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
              label="Your TFQ"
              size={140}
            />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-gray-500 font-mono">→</span>
              <span className="text-[9px] text-gray-600 font-mono">{snapshot.monthName}</span>
              <span className="text-[9px] text-gray-600 font-mono">effect</span>
              <span className="text-[10px] text-gray-500 font-mono">→</span>
            </div>
            <PentagonRadar
              qi={finalQiForRadar}
              overlayQi={userTfq}
              label="This Month"
              overlayLabel="Your TFQ"
              size={140}
            />
          </div>
        ) : (
          <QiBar qi={fqi} />
        )}
      </div>

      {/* Expanded: Year + Month Pillar cards (same format as natal), then 9-step pipeline */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/10 pt-3">
          <div className="text-xs text-gray-500 mb-2">
            {snapshot.monthStem}{snapshot.monthBranch} — {snapshot.branchAnimal} ({snapshot.season})
          </div>

          {/* ═══ TFQ vs MFFQ comparison double bar chart ═══ */}
          {userTfq && finalQiForRadar && (() => {
            const tfqTotal = ELEMENTS.reduce((s, el) => s + (userTfq[el] || 0), 0);
            const mffqTotal = ELEMENTS.reduce((s, el) => s + (finalQiForRadar[el] || 0), 0);
            const maxPct = Math.max(
              ...ELEMENTS.map(el => Math.max(
                tfqTotal > 0 ? (userTfq[el] || 0) / tfqTotal * 100 : 0,
                mffqTotal > 0 ? (finalQiForRadar[el] || 0) / mffqTotal * 100 : 0
              )),
              1
            );
            return (
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 mb-3">
                <div className="text-xs font-semibold text-gray-300 mb-2">Your TFQ vs {snapshot.monthName} MFFQ — Element Distribution</div>
                <div className="space-y-2">
                  {ELEMENTS.map(el => {
                    const tfqPct = tfqTotal > 0 ? (userTfq[el] || 0) / tfqTotal * 100 : 0;
                    const mffqPct = mffqTotal > 0 ? (finalQiForRadar[el] || 0) / mffqTotal * 100 : 0;
                    const diff = mffqPct - tfqPct;
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
                              width: `${(tfqPct / maxPct) * 100}%`,
                              backgroundColor: ELEM_COLORS[el],
                              opacity: 0.35,
                            }} />
                            <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-gray-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {tfqPct > 0 ? tfqPct.toFixed(1) + '%' : ''}
                            </span>
                          </div>
                        </div>
                        {/* MFFQ bar */}
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-white w-10 text-right font-semibold">MFFQ</span>
                          <div className="flex-1 h-3.5 bg-white/5 rounded overflow-hidden relative">
                            <div className="h-full rounded" style={{
                              width: `${(mffqPct / maxPct) * 100}%`,
                              backgroundColor: ELEM_COLORS[el],
                              opacity: 0.85,
                            }} />
                            <span className="absolute inset-0 flex items-center px-1.5 text-[9px] font-mono text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                              {mffqPct > 0 ? mffqPct.toFixed(1) + '%' : ''}
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
                    <span className="text-gray-400">Your Natal TFQ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 bg-amber-400/80 rounded" />
                    <span className="text-white">Month Final Functional Qi</span>
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
                    {/* ═══ BRACELET DASHBOARD — merged old qualitative + new engineered ring ═══ */}
                    {(() => {
                      let engineered = null;
                      let collapseRpt = null;
                      try {
                        const pool = snapshot.postClash || snapshot.functionalQi || {};
                        const ratios = computeElementRatios(pool);
                        collapseRpt = diagnoseCollapse(ratios);
                        const branchAnimal = snapshot.branchAnimal || 'Tiger';
                        engineered = engineerBracelet({
                          collapse: collapseRpt,
                          month: branchAnimal,
                          totalBeads: 21,
                          beadSize: 10,
                        });
                      } catch { /* fallback to old ring */ }

                      return (
                        <BraceletDashboard
                          bracelet={monthBracelet}
                          yongShen={snapshot.yongShen}
                          dayMasterStem={dmChar}
                          dynamicPool={snapshot.functionalQi}
                          userTfq={userTfq}
                          monthLabel={snapshot.monthName}
                          prevBracelet={prevBracelet}
                          prevYongShen={prevSnapshot?.yongShen}
                          prevLabel={prevSnapshot?.monthName}
                          allMonthBracelets={allMonthBracelets}
                          engineeredBracelet={engineered}
                          collapseReport={collapseRpt}
                        />
                      );
                    })()}

                    {/* ═══ BRACELET AUTO-DESIGNER — optimal sequence ═══ */}
                    <div className="mt-3">
                      <BraceletAutoDesigner
                        yongShen={snapshot.yongShen}
                        dayMasterStem={dmChar}
                      />
                    </div>

                    {/* ═══ BRACELET DESIGNER — drag-and-drop bead ring ═══ */}
                    <div className="mt-3">
                      <BraceletDesigner
                        initialSlots={(() => {
                          // Pre-populate from the designed bracelet
                          const seq = monthBracelet.sequence || [];
                          const slots = Array.from({ length: 21 }, (_, i) => ({
                            element: seq[i]?.element || null,
                          }));
                          return slots;
                        })()}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {/* ═══ QI DEBUGGER — per-element breakdown ═══ */}
          {userTfq && (
            <QiDebugger
              tfq={userTfq}
              mffq={snapshot.functionalQi}
              braceletQiUnits={(() => {
                if (!snapshot.yongShen || !chart?.pillars?.[2]?.stem?.char) return null;
                const br = designBracelet(snapshot.yongShen, chart.pillars[2].stem.char);
                const brq = {};
                ELEMENTS.forEach(el => { brq[el] = (br.ratios[el] || 0) * 0.5; });
                return brq;
              })()}
              collapseInfo={snapshot.collapseInfo ? {
                isCollapse: snapshot.collapseInfo.isCollapse ?? (snapshot.yongShen?.status === 'collapse_override'),
                mode: snapshot.collapseInfo.mode || snapshot.yongShen?.collapseMode,
                dominant: snapshot.collapseInfo.dominant,
              } : snapshot.yongShen ? {
                isCollapse: snapshot.yongShen.status === 'collapse_override',
                mode: snapshot.yongShen.collapseMode,
              } : null}
              yongShen={snapshot.yongShen}
            />
          )}

          {/* ═══ QI PHYSICS CONSOLE — live pipeline logs ═══ */}
          {snapshot.steps && (
            <QiPhysicsConsole
              steps={snapshot.steps}
              interactions={snapshot.interactions}
              collapseInfo={snapshot.collapseInfo}
              yongShen={snapshot.yongShen}
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

                {/* ═══ STEP 1: Combined Year + Month Functional Qi (CYMFQ) ═══ */}
                {yearBd?.qiWeighted && monthBd?.qiWeighted && (
                  <>
                    <CombinedYMFQPanel yearFq={yearBd.qiWeighted} monthFq={monthBd.qiWeighted} year={year} monthName={snapshot.monthName} userTfq={userTfq} />

                    {/* ═══ STEPS 2–10: Influence → Normalize → 3-Pass Clash → Sheng → Control → Transform → Final ═══ */}
                    {userTfq && (() => {
                      const cymfq = {};
                      ELEMENTS.forEach(el => { cymfq[el] = (yearBd.qiWeighted[el] || 0) + (monthBd.qiWeighted[el] || 0); });

                      const atfq = {};
                      const acymfq = {};
                      ELEMENTS.forEach(el => {
                        atfq[el] = (userTfq[el] || 0) * 0.60;
                        acymfq[el] = (cymfq[el] || 0) * 0.40;
                      });

                      const ntfq = {};
                      ELEMENTS.forEach(el => { ntfq[el] = (atfq[el] || 0) + (acymfq[el] || 0); });

                      let comboResult = null;
                      let postComboNtfq = ntfq;
                      if (chart?.pillars && qiMatrix?.yearPillar) {
                        const comboCtx = buildCombinationContext(
                          chart.pillars,
                          { stem: qiMatrix.yearPillar.stem, branch: qiMatrix.yearPillar.branch },
                          { stem: snapshot.monthStem, branch: snapshot.monthBranch },
                          snapshot.monthBranch
                        );
                        comboResult = applyCombinationEngine(ntfq, comboCtx);
                        postComboNtfq = comboResult.postQi;
                      }

                      const totalNtfq = ELEMENTS.reduce((s, el) => s + (ntfq[el] || 0), 0);
                      const postAtfq = {};
                      const postAcymfq = {};
                      ELEMENTS.forEach(el => {
                        const ratio = totalNtfq > 0 ? (atfq[el] || 0) / totalNtfq : 0.5;
                        postAtfq[el] = (postComboNtfq[el] || 0) * ratio;
                        postAcymfq[el] = (postComboNtfq[el] || 0) * (1 - ratio);
                      });

                      const clashResult = computeThreePassClashes(postAtfq, postAcymfq);
                      const { combined: postClash } = clashResult;
                      const shengResult = applySheng(postClash);
                      const { result: postSheng } = shengResult;
                      const overcrowdingResult = applyOvercrowding(postSheng);
                      const { result: postOvercrowding } = overcrowdingResult;
                      const { result: postControl } = applyControl(postOvercrowding);
                      const transformResult = applyTransformations(postControl);

                      return (
                        <>
                          <InfluencePanel cymfq={cymfq} userTfq={userTfq} />
                          <NormalizedQiPanel cymfq={cymfq} userTfq={userTfq} />
                          <VoidPanel voidResult={comboResult} />
                          <CombinationPanel comboResult={comboResult} />
                          <ClashAdjustmentPanel atfq={postAtfq} acymfq={postAcymfq} />
                          <ShengNourishmentPanel postClashQi={postClash} />
                          <OvercrowdingPanel postShengQi={postSheng} />
                          <ControlCyclePressurePanel postClashQi={postOvercrowding} />
                          <TransformationPanel postControlQi={postControl} />
                          <StructuralCollapsePanel finalQi={transformResult.result} />
                          <FinalFunctionalQiPanel atfq={postAtfq} acymfq={postAcymfq} />
                          <EventTimeline
                            comboResult={comboResult}
                            clashResult={clashResult}
                            shengDetails={shengResult.details}
                            overcrowdingDetails={overcrowdingResult.details}
                            transformDetails={transformResult.details}
                            collapseQi={transformResult.result}
                          />
                        </>
                      );
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
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SEASONAL ROW — group of 3 months
// ============================================================================

function SeasonRow({ season, months, expandedMonths, setExpandedMonths, dayMasterPolarity, dayMasterElement, year, userTfq, chart, qiMatrix }) {
  if (!months || months.length === 0) return null;

  return (
    <section className={`rounded-xl border p-4 ${SEASON_BG[season] || 'border-white/10 bg-white/5'}`}>
      <h3 className="text-lg font-bold text-white mb-3">
        {SEASON_EMOJI[season] || ''} {season}
      </h3>
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
  { id: 'mffq',      label: 'MFFQ Output',             sub: 'Final Qi',       x: 140, y: 730, w: 160, h: 40, fill: '#0f2f1f', stroke: '#10b981' },
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
  { from: 'transform', to: 'mffq' },
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
  const [showSeasonalityPopup, setShowSeasonalityPopup] = useState(false);
  const [showPolarityPopup, setShowPolarityPopup] = useState(false);
  const [showFunctionalQiPopup, setShowFunctionalQiPopup] = useState(false);

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

  // Compute Qi matrix
  const qiMatrix = useMemo(() => {
    if (!chart) return null;
    try {
      return computeQiYearMatrix(chart, selectedYear);
    } catch (err) {
      console.error('Qi matrix error:', err);
      return null;
    }
  }, [chart, selectedYear]);

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

  // Year range for selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

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
                      onClick={() => setShowElementsPopup(true)}
                      className="px-2 py-1 text-[10px] rounded bg-emerald-800/50 hover:bg-emerald-700/50 border border-emerald-600/30 text-emerald-300 transition-colors"
                    >
                      Elements Composition
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['year', 'month', 'day', 'hour'].map((key, idx) => (
                    <PillarWithFlap
                      key={key}
                      pillar={chart.pillars[idx]}
                      breakdown={qiMatrix?.perPillarBreakdown?.[key]}
                      label={PILLAR_LABELS[idx]}
                      isYou={idx === 2}
                      expanded={!!expandedPillarFlaps[key]}
                      onToggle={() => setExpandedPillarFlaps(prev => ({
                        ...prev,
                        [key]: !prev[key],
                      }))}
                      birthMonthBranch={chart.pillars[1]?.branch?.char}
                      dayMasterPolarity={qiMatrix?.dayMasterPolarity}
                      dayMasterElement={qiMatrix?.dayMasterElement}
                    />
                  ))}
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
                        <PentagonRadar qi={userTfq} label="Your TFQ" size={220} />
                      </div>
                    )}

                    {qiMatrix && (
                      <YearInsightsPanel qiMatrix={qiMatrix} />
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

                    {/* Qi Timeline — animated month-to-month MFFQ distribution */}
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
    </BaziThemeProvider>
  );
}
