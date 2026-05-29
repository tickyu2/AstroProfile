// ============================================================================
// TIMING ENGINE — Luck Pillars, Annual Pillars, Relationship Timing, Team Dynamics
// ============================================================================
// Adds Ten God classification + narrative layers on top of existing
// daYunEngine (luck pillars) and braceletEngine (year/month pillars).
// ============================================================================

import { STEMS } from './baziEngine';
import { getTenGod } from './tenGodsCalculations';
import { computeCompatibility, generateArchetypeCompatibility } from './compatibilityEngine';
import { generatePersonalityArchetype } from './personalityEngine';
import { computeMBTI } from './personalityEngine';
import type { DaYunPillar, DaYunResult } from './daYunEngine';
import type { TenGodKey, TenGodProfile } from './tenGodsEngine';
import type { PersonalityArchetype, ArchetypeKey } from './personalityEngine';

// ============================================================================
// TYPES
// ============================================================================

type ElementName = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

export interface LuckPillarTenGod {
  index: number;
  stem: string;
  branch: string;
  stemEnglish: string;
  branchAnimal: string;
  element: ElementName;
  ageStart: number;
  ageEnd: number;
  yearStart: number;
  yearEnd: number;
  isCurrent: boolean;
  tenGodKey: TenGodKey;
  tenGodName: string;
  tenGodChinese: string;
  narrative: string;
}

export interface LuckPillarTimeline {
  pillars: LuckPillarTenGod[];
  currentPillar: LuckPillarTenGod | null;
}

export interface AnnualInfluence {
  year: number;
  stem: string;
  branch: string;
  stemElement: ElementName;
  tenGodKey: TenGodKey;
  tenGodName: string;
  tenGodChinese: string;
  narrative: string;
}

export interface RelationshipTimingYear {
  year: number;
  compatibilityScore: number;
  annualGodA: TenGodKey;
  annualGodB: TenGodKey;
  theme: string;
}

export interface RelationshipTimingTimeline {
  years: RelationshipTimingYear[];
  bestYears: number[];
  challengingYears: number[];
}

export interface TeamMember {
  id: string;
  name: string;
  archetype: PersonalityArchetype;
  tenGods: TenGodProfile;
}

export interface TeamPairEntry {
  aId: string;
  bId: string;
  aName: string;
  bName: string;
  score: number;
  matchType: 'natural' | 'growth' | 'challenge';
}

export interface TeamDynamics {
  members: TeamMember[];
  matrix: TeamPairEntry[];
  archetypeCounts: Partial<Record<ArchetypeKey, number>>;
  strengths: string[];
  gaps: string[];
  narrative: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const GOD_NAME_TO_KEY: Record<string, TenGodKey> = {
  'Friend': 'friend',
  'Rob Wealth': 'robWealth',
  'Eating God': 'eatingGod',
  'Hurting Officer': 'hurtingOfficer',
  'Direct Wealth': 'directWealth',
  'Indirect Wealth': 'indirectWealth',
  'Direct Officer': 'directOfficer',
  'Indirect Officer': 'sevenKillings',
  '7 Killings': 'sevenKillings',
  'Direct Resource': 'directResource',
  'Indirect Resource': 'indirectResource',
};

function classifyStemToTenGod(
  dmElement: string,
  dmPolarity: string,
  stemChar: string
): { key: TenGodKey; name: string; chinese: string } | null {
  const stemInfo = STEMS[stemChar as keyof typeof STEMS];
  if (!stemInfo) return null;

  const result = getTenGod(dmElement, dmPolarity, stemInfo.element, stemInfo.polarity);
  if (!result) return null;

  const key = GOD_NAME_TO_KEY[result.name];
  if (!key) return null;

  return { key, name: result.name, chinese: result.chinese };
}

// ============================================================================
// 1. LUCK PILLAR TIMELINE (Ten God enrichment of existing DaYun)
// ============================================================================

const LUCK_PILLAR_NARRATIVES: Record<TenGodKey, string> = {
  friend: 'A decade of self-definition, independence, and peer relationships. Your identity strengthens — use it to build authentic connections.',
  robWealth: 'A decade of competition, bold risk-taking, and dynamic energy. Opportunities come through action, but watch for rivalry and impulsive decisions.',
  eatingGod: 'A decade of creativity, enjoyment, and natural expression. Talent flows easily — pursue art, teaching, or any work that brings joy.',
  hurtingOfficer: 'A decade of disruption, innovation, and breaking old patterns. You challenge authority and pioneer new paths — channel it productively.',
  directWealth: 'A decade of work, responsibility, and material consolidation. Steady effort builds lasting wealth and stability.',
  indirectWealth: 'A decade of networking, opportunity, and multiple income streams. Social connections open unexpected doors.',
  directOfficer: 'A decade of duty, structure, and reputation-building. Authority figures play a key role — career advancement through discipline.',
  sevenKillings: 'A decade of pressure, transformation, and deep challenge. Crisis forges resilience — you emerge stronger but must manage stress.',
  directResource: 'A decade of learning, healing, and support. Mentors appear, knowledge deepens, and emotional recovery is possible.',
  indirectResource: 'A decade of inner searching, intuition, and unconventional wisdom. Spiritual growth and abstract thinking intensify.',
};

export function generateLuckPillarTimeline(
  daYunResult: DaYunResult,
  dmElement: string,
  dmPolarity: string
): LuckPillarTimeline {
  const pillars: LuckPillarTenGod[] = daYunResult.pillars.map(p => {
    const god = classifyStemToTenGod(dmElement, dmPolarity, p.stem);

    return {
      index: p.index,
      stem: p.stem,
      branch: p.branch,
      stemEnglish: p.stemEnglish,
      branchAnimal: p.branchAnimal,
      element: p.element as ElementName,
      ageStart: p.ageStart,
      ageEnd: p.ageEnd,
      yearStart: p.yearStart,
      yearEnd: p.yearEnd,
      isCurrent: p.isCurrent,
      tenGodKey: god?.key || 'friend',
      tenGodName: god?.name || 'Friend',
      tenGodChinese: god?.chinese || '比肩',
      narrative: LUCK_PILLAR_NARRATIVES[god?.key || 'friend'],
    };
  });

  const currentPillar = pillars.find(p => p.isCurrent) || null;

  return { pillars, currentPillar };
}

// ============================================================================
// 2. ANNUAL PILLAR INFLUENCE
// ============================================================================

const ANNUAL_NARRATIVES: Record<TenGodKey, { base: string; strong: string; subtle: string }> = {
  friend: {
    base: 'Identity, independence, and self-expression.',
    strong: 'Strong year of self-definition — assert yourself confidently.',
    subtle: 'Quiet year for self-reflection and personal grounding.',
  },
  robWealth: {
    base: 'Competition, boldness, and dynamic risk.',
    strong: 'High-energy year — bold moves pay off, but rivalry intensifies.',
    subtle: 'Minor competitive pressures — stay alert to financial leaks.',
  },
  eatingGod: {
    base: 'Creativity, pleasure, and expression.',
    strong: 'Creative peak year — talent flows abundantly, pursue artistic goals.',
    subtle: 'Gentle creative stirrings — explore hobbies and pleasurable activities.',
  },
  hurtingOfficer: {
    base: 'Innovation, disruption, and challenging authority.',
    strong: 'Breakthrough year — old structures fall, new visions emerge.',
    subtle: 'Minor restlessness — small rebellions against routine.',
  },
  directWealth: {
    base: 'Work, responsibility, and material focus.',
    strong: 'Productive year — hard work yields tangible financial rewards.',
    subtle: 'Steady year of incremental progress and routine responsibilities.',
  },
  indirectWealth: {
    base: 'Networking, opportunity, and social expansion.',
    strong: 'Lucky year — unexpected opportunities arrive through connections.',
    subtle: 'Social energy increases — plant seeds for future opportunities.',
  },
  directOfficer: {
    base: 'Structure, duty, and reputation.',
    strong: 'Career advancement year — recognition, promotion, or new authority roles.',
    subtle: 'Quiet sense of duty — focus on responsibilities and steady reputation.',
  },
  sevenKillings: {
    base: 'Pressure, challenge, and transformation.',
    strong: 'Intense year — crisis and transformation demand courage and resilience.',
    subtle: 'Background pressure — practice stress management and self-care.',
  },
  directResource: {
    base: 'Learning, healing, and nurturing support.',
    strong: 'Growth year — mentors appear, deep learning accelerates, healing happens.',
    subtle: 'Gentle support — small acts of learning and self-care compound.',
  },
  indirectResource: {
    base: 'Intuition, inner worlds, and unconventional wisdom.',
    strong: 'Mystical year — deep insight, spiritual growth, abstract breakthroughs.',
    subtle: 'Undercurrent of intuition — trust gut feelings on key decisions.',
  },
};

/**
 * Compute the Ten God influence of a given year on a natal chart.
 * Uses the year's Heavenly Stem vs the Day Master.
 */
export function computeAnnualInfluence(
  yearStem: string,
  yearBranch: string,
  dmElement: string,
  dmPolarity: string,
  natalProfile?: TenGodProfile
): AnnualInfluence {
  const stemInfo = STEMS[yearStem as keyof typeof STEMS];
  const stemElement = (stemInfo?.element || 'Earth') as ElementName;

  const god = classifyStemToTenGod(dmElement, dmPolarity, yearStem);

  // Compute intensity based on how much this element exists in natal TFQ
  let intensity = 0.5;
  if (natalProfile) {
    const godInstance = natalProfile.gods[god?.key || 'friend'];
    intensity = godInstance ? godInstance.shareOfTotalQi : 0.3;
  }

  const narr = ANNUAL_NARRATIVES[god?.key || 'friend'];
  const narrative = intensity > 0.25 ? narr.strong : intensity > 0.08 ? narr.base : narr.subtle;

  return {
    year: 0, // caller sets this
    stem: yearStem,
    branch: yearBranch,
    stemElement,
    tenGodKey: god?.key || 'friend',
    tenGodName: god?.name || 'Friend',
    tenGodChinese: god?.chinese || '比肩',
    narrative,
  };
}

// ============================================================================
// 3. RELATIONSHIP TIMING (year-by-year compatibility modulation)
// ============================================================================

const ANNUAL_PAIR_BOOSTS: Partial<Record<string, number>> = {
  'eatingGod-directResource': 0.5,
  'directResource-eatingGod': 0.5,
  'friend-friend': 0.3,
  'eatingGod-eatingGod': 0.4,
  'directWealth-directOfficer': 0.3,
  'hurtingOfficer-directOfficer': -0.6,
  'robWealth-directWealth': -0.4,
  'sevenKillings-indirectResource': -0.3,
  'sevenKillings-sevenKillings': -0.5,
  'robWealth-robWealth': -0.4,
};

function getAnnualPairBoost(a: TenGodKey, b: TenGodKey): number {
  return ANNUAL_PAIR_BOOSTS[`${a}-${b}`] ?? ANNUAL_PAIR_BOOSTS[`${b}-${a}`] ?? 0;
}

const RELATIONSHIP_YEAR_THEMES: Partial<Record<TenGodKey, Record<string, string>>> = {
  eatingGod: {
    eatingGod: 'A year of shared creativity and mutual enjoyment.',
    directResource: 'A year where one nurtures and the other creates — beautiful synergy.',
    sevenKillings: 'Tension between expression and pressure — needs gentle navigation.',
  },
  directOfficer: {
    hurtingOfficer: 'Authority clashes with rebellion — expect friction unless both stay flexible.',
    directWealth: 'A stable, productive year together — shared responsibilities strengthen bonds.',
  },
  friend: {
    friend: 'A year of equality and mutual support — partnership feels natural.',
    robWealth: 'Competition surfaces — channel it into shared goals, not rivalry.',
  },
};

function buildRelationshipYearTheme(godA: TenGodKey, godB: TenGodKey): string {
  const theme = RELATIONSHIP_YEAR_THEMES[godA]?.[godB]
    || RELATIONSHIP_YEAR_THEMES[godB]?.[godA];
  if (theme) return theme;

  const boost = getAnnualPairBoost(godA, godB);
  if (boost > 0.2) return 'A harmonious year — energies align and support each other.';
  if (boost < -0.2) return 'A challenging year — contrasting energies create friction.';
  return 'A neutral year — the relationship flows at a steady pace.';
}

export function generateRelationshipTiming(
  baseScore: number,
  annualInfluencesA: AnnualInfluence[],
  annualInfluencesB: AnnualInfluence[],
  startYear: number
): RelationshipTimingTimeline {
  const years: RelationshipTimingYear[] = [];

  for (let i = 0; i < annualInfluencesA.length && i < annualInfluencesB.length; i++) {
    const annA = annualInfluencesA[i];
    const annB = annualInfluencesB[i];

    const pairBoost = getAnnualPairBoost(annA.tenGodKey, annB.tenGodKey);
    const adjusted = Math.max(0, Math.min(100, baseScore + pairBoost * 15));

    years.push({
      year: startYear + i,
      compatibilityScore: adjusted,
      annualGodA: annA.tenGodKey,
      annualGodB: annB.tenGodKey,
      theme: buildRelationshipYearTheme(annA.tenGodKey, annB.tenGodKey),
    });
  }

  const sorted = [...years].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const bestYears = sorted.slice(0, 3).map(y => y.year);
  const challengingYears = sorted.slice(-3).reverse().map(y => y.year);

  return { years, bestYears, challengingYears };
}

// ============================================================================
// 4. TEAM DYNAMICS (3-10 people)
// ============================================================================

const ARCHETYPE_ROLE_MAP: Record<ArchetypeKey, string> = {
  visionary_rebel: 'Visionary / Innovator',
  creative_artist: 'Creative Lead',
  nurturing_teacher: 'Mentor / Support',
  strategic_leader: 'Strategist / Director',
  warrior_transformer: 'Crisis Specialist',
  practical_manager: 'Operations / Execution',
  mystic_seeker: 'Research / Insight',
  connector_networker: 'Relationship Builder',
  independent_maverick: 'Independent Contributor',
};

export function generateTeamDynamics(members: TeamMember[]): TeamDynamics {
  const matrix: TeamPairEntry[] = [];
  const archetypeCounts: Partial<Record<ArchetypeKey, number>> = {};

  // Count archetypes
  for (const m of members) {
    archetypeCounts[m.archetype.key] = (archetypeCounts[m.archetype.key] ?? 0) + 1;
  }

  // Compute pairwise compatibility
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];

      const compat = computeCompatibility(a.tenGods, b.tenGods);
      const archCompat = generateArchetypeCompatibility(a.archetype, b.archetype);

      matrix.push({
        aId: a.id,
        bId: b.id,
        aName: a.name,
        bName: b.name,
        score: compat.breakdown.totalScore,
        matchType: archCompat.matchType,
      });
    }
  }

  // Analyze strengths and gaps
  const strengths: string[] = [];
  const gaps: string[] = [];

  const hasVisionary = (archetypeCounts.visionary_rebel ?? 0) > 0;
  const hasCreative = (archetypeCounts.creative_artist ?? 0) > 0;
  const hasManager = (archetypeCounts.practical_manager ?? 0) > 0;
  const hasLeader = (archetypeCounts.strategic_leader ?? 0) > 0;
  const hasSupport = (archetypeCounts.nurturing_teacher ?? 0) > 0;
  const hasWarrior = (archetypeCounts.warrior_transformer ?? 0) > 0;
  const hasNetworker = (archetypeCounts.connector_networker ?? 0) > 0;

  if (hasVisionary) strengths.push('Innovation and vision — someone sees the future.');
  if (hasCreative) strengths.push('Creative expression — ideas become tangible output.');
  if (hasManager) strengths.push('Operational excellence — plans get executed reliably.');
  if (hasLeader) strengths.push('Strategic direction — clear goals and structured leadership.');
  if (hasSupport) strengths.push('Emotional safety — team members feel supported and heard.');
  if (hasWarrior) strengths.push('Crisis resilience — someone thrives under pressure.');
  if (hasNetworker) strengths.push('External connections — relationships and opportunities flow in.');

  if (!hasVisionary && !hasCreative) gaps.push('Missing: Creative/Visionary energy — add innovators to avoid stagnation.');
  if (!hasManager && !hasLeader) gaps.push('Missing: Structure/Execution — add operational roles to turn ideas into reality.');
  if (!hasSupport) gaps.push('Missing: Emotional support — add mentoring roles to prevent burnout.');
  if (!hasNetworker) gaps.push('Missing: External networking — the team may become insular.');

  // Count friction
  const challengePairs = matrix.filter(m => m.matchType === 'challenge').length;
  const naturalPairs = matrix.filter(m => m.matchType === 'natural').length;
  const avgScore = matrix.length > 0 ? matrix.reduce((s, m) => s + m.score, 0) / matrix.length : 50;

  let narrative = `Team of ${members.length} with ${Object.keys(archetypeCounts).length} distinct archetypes. `;
  narrative += `Average compatibility: ${avgScore.toFixed(0)}/100. `;
  if (naturalPairs > challengePairs) {
    narrative += `The team leans harmonious with ${naturalPairs} natural pair(s) — leverage this for collaboration.`;
  } else if (challengePairs > naturalPairs) {
    narrative += `The team has ${challengePairs} challenge pair(s) — set clear communication norms to prevent friction.`;
  } else {
    narrative += `Balanced mix of harmony and tension — productive if managed consciously.`;
  }

  return { members, matrix, archetypeCounts, strengths, gaps, narrative };
}

// ============================================================================
// 5. FATE WINDOWS — Karmic activation years
// ============================================================================

export interface FateWindow {
  year: number;
  type: 'karmic_meeting' | 'breakthrough' | 'challenge' | 'healing';
  intensity: number;  // 0–100
  description: string;
}

const FATE_WINDOW_CONFIG = {
  karmic_meeting: {
    label: 'Karmic Meeting',
    color: '#a855f7',
    icon: '🔮',
  },
  breakthrough: {
    label: 'Breakthrough',
    color: '#4ade80',
    icon: '🌟',
  },
  challenge: {
    label: 'Challenge',
    color: '#ef4444',
    icon: '⚡',
  },
  healing: {
    label: 'Healing',
    color: '#06b6d4',
    icon: '💚',
  },
};

export { FATE_WINDOW_CONFIG };

export function generateFateWindows(
  annualsA: AnnualInfluence[],
  annualsB: AnnualInfluence[],
  baseScore: number
): FateWindow[] {
  const windows: FateWindow[] = [];

  for (let i = 0; i < annualsA.length && i < annualsB.length; i++) {
    const a = annualsA[i];
    const b = annualsB[i];
    const year = a.year;

    // Karmic meeting: Resource + Officer resonance
    if (
      (a.tenGodKey === 'directResource' || a.tenGodKey === 'indirectResource') &&
      (b.tenGodKey === 'directOfficer' || b.tenGodKey === 'sevenKillings')
    ) {
      windows.push({
        year, type: 'karmic_meeting', intensity: 75,
        description: 'A year of karmic recognition, emotional depth, and soul-level activation.',
      });
    } else if (
      (b.tenGodKey === 'directResource' || b.tenGodKey === 'indirectResource') &&
      (a.tenGodKey === 'directOfficer' || a.tenGodKey === 'sevenKillings')
    ) {
      windows.push({
        year, type: 'karmic_meeting', intensity: 75,
        description: 'A year of karmic recognition — one protects while the other guides.',
      });
    }

    // Breakthrough: Output + Wealth synergy
    if (
      (a.tenGodKey === 'eatingGod' || a.tenGodKey === 'hurtingOfficer') &&
      (b.tenGodKey === 'directWealth' || b.tenGodKey === 'indirectWealth')
    ) {
      windows.push({
        year, type: 'breakthrough', intensity: 70,
        description: 'A year of creative expansion, shared goals, and relationship breakthroughs.',
      });
    } else if (
      (b.tenGodKey === 'eatingGod' || b.tenGodKey === 'hurtingOfficer') &&
      (a.tenGodKey === 'directWealth' || a.tenGodKey === 'indirectWealth')
    ) {
      windows.push({
        year, type: 'breakthrough', intensity: 70,
        description: 'A year where creative expression meets material opportunity — growth together.',
      });
    }

    // Challenge: Officer vs Hurting Officer
    if (
      (a.tenGodKey === 'hurtingOfficer' && b.tenGodKey === 'directOfficer') ||
      (b.tenGodKey === 'hurtingOfficer' && a.tenGodKey === 'directOfficer')
    ) {
      windows.push({
        year, type: 'challenge', intensity: 80,
        description: 'A year of tension, communication friction, and power-dynamic recalibration.',
      });
    }

    // Challenge: Seven Killings × Seven Killings
    if (a.tenGodKey === 'sevenKillings' && b.tenGodKey === 'sevenKillings') {
      windows.push({
        year, type: 'challenge', intensity: 85,
        description: 'A year of intense mutual pressure — both feel controlled. Requires extraordinary patience.',
      });
    }

    // Healing: Resource + Resource
    if (
      (a.tenGodKey === 'directResource' || a.tenGodKey === 'indirectResource') &&
      (b.tenGodKey === 'directResource' || b.tenGodKey === 'indirectResource')
    ) {
      windows.push({
        year, type: 'healing', intensity: 65,
        description: 'A year of emotional repair, deeper understanding, and relational healing.',
      });
    }

    // Healing: Eating God + Eating God
    if (a.tenGodKey === 'eatingGod' && b.tenGodKey === 'eatingGod') {
      windows.push({
        year, type: 'healing', intensity: 60,
        description: 'A year of shared joy, creative play, and reconnection through pleasure.',
      });
    }
  }

  return windows;
}

// ============================================================================
// 6. RELATIONSHIP TIMING NARRATIVE
// ============================================================================

export function generateRelationshipTimingNarrative(
  timeline: RelationshipTimingTimeline,
  fateWindows: FateWindow[]
): string {
  const { years, bestYears, challengingYears } = timeline;
  if (years.length === 0) return 'Insufficient data for timing analysis.';

  const avg = years.reduce((s, y) => s + y.compatibilityScore, 0) / years.length;
  const trend = years[years.length - 1].compatibilityScore - years[0].compatibilityScore;

  const trendText = trend > 5
    ? 'The relationship strengthens over time.'
    : trend < -5
    ? 'The relationship faces increasing challenges over time.'
    : 'The relationship maintains a stable rhythm over time.';

  const hotText = bestYears.length > 0
    ? `Peak years: ${bestYears.join(', ')}.`
    : '';

  const fateText = fateWindows.length > 0
    ? `Karmic activation windows in ${fateWindows.map(f => f.year).join(', ')}.`
    : '';

  return `${trendText} Average compatibility: ${avg.toFixed(0)}/100. ${hotText} ${fateText}`.trim();
}

// ============================================================================
// 7. ORCHESTRATOR — Single entry point for full relationship timing
// ============================================================================

import { computeTenGodProfile } from './tenGodsEngine';
import { generateSynastryNarrative } from './compatibilityEngine';
import type { CompatibilityReport, SynastryNarrative, ArchetypeCompatibilityBlueprint } from './compatibilityEngine';
import type { MBTIProfile } from './personalityEngine';
import type { PerPillarBreakdownMap } from './qiEngine';
import { getYearPillar } from './braceletEngine';

// ============================================================================
// 8. DESTINY CURVE — Emotional trajectory over time
// ============================================================================

export interface DestinyCurvePoint {
  year: number;
  emotionalScore: number; // 0–100
  narrative: string;
}

export interface RelationshipDestinyCurve {
  points: DestinyCurvePoint[];
  summary: string;
}

export function generateDestinyCurve(
  timeline: RelationshipTimingTimeline,
  fateWindows: FateWindow[]
): RelationshipDestinyCurve {
  const points: DestinyCurvePoint[] = timeline.years.map(y => {
    // Base from compatibility score
    let emotionalScore = y.compatibilityScore;

    // Boost for fate windows in this year
    const fate = fateWindows.find(f => f.year === y.year);
    if (fate) {
      if (fate.type === 'karmic_meeting' || fate.type === 'healing') emotionalScore = Math.min(100, emotionalScore + 8);
      if (fate.type === 'challenge') emotionalScore = Math.max(0, emotionalScore - 5);
      if (fate.type === 'breakthrough') emotionalScore = Math.min(100, emotionalScore + 6);
    }

    return {
      year: y.year,
      emotionalScore,
      narrative: emotionalScore >= 80
        ? 'Peak emotional resonance — intimacy, vulnerability, and deep connection.'
        : emotionalScore >= 60
        ? 'Strong emotional bond — supportive growth and mutual understanding.'
        : emotionalScore >= 40
        ? 'Mixed emotional dynamics — awareness and communication are essential.'
        : 'Emotionally challenging — invites healing, patience, and recalibration.',
    };
  });

  const avg = points.length > 0 ? points.reduce((s, p) => s + p.emotionalScore, 0) / points.length : 50;
  const trend = points.length >= 2 ? points[points.length - 1].emotionalScore - points[0].emotionalScore : 0;

  const summary = (trend > 5
    ? `The emotional bond deepens over time, averaging ${avg.toFixed(0)}/100.`
    : trend < -5
    ? `The emotional bond faces increasing tests, averaging ${avg.toFixed(0)}/100.`
    : `The emotional bond maintains a stable rhythm, averaging ${avg.toFixed(0)}/100.`);

  return { points, summary };
}

// ============================================================================
// 9. ARCHETYPE EVOLUTION TIMELINE — How the relationship's identity shifts
// ============================================================================

export type RelationshipArchetypeKey =
  | 'soul_partners'
  | 'creative_duo'
  | 'teacher_student'
  | 'warrior_healer'
  | 'builders'
  | 'explorers'
  | 'karmic_mirrors';

export interface RelationshipArchetypeState {
  year: number;
  key: RelationshipArchetypeKey;
  label: string;
  narrative: string;
}

export interface ArchetypeEvolutionTimeline {
  states: RelationshipArchetypeState[];
  summary: string;
}

const REL_ARCHETYPE_LABELS: Record<RelationshipArchetypeKey, string> = {
  soul_partners: 'Soul Partners',
  creative_duo: 'Creative Duo',
  teacher_student: 'Teacher-Student Dynamic',
  warrior_healer: 'Warrior-Healer Pair',
  builders: 'Builders & Stabilizers',
  explorers: 'Explorers & Experimenters',
  karmic_mirrors: 'Karmic Mirrors',
};

const REL_ARCHETYPE_NARRATIVES: Record<RelationshipArchetypeKey, string> = {
  soul_partners: 'The relationship feels like a core soul alliance — deep trust, resonance, and shared purpose.',
  creative_duo: 'Shared creation, projects, and expressive synergy define this period.',
  teacher_student: 'Asymmetric growth — one partner catalyzes the other\'s development.',
  warrior_healer: 'Intense transformation meets emotional repair — the bond is forged in fire.',
  builders: 'Constructing shared foundations, long-term plans, and practical stability.',
  explorers: 'Experimentation, change, and re-defining what the relationship means.',
  karmic_mirrors: 'Deep karmic reflection — mirroring, pattern recognition, and soul-level work.',
};

function inferRelArchetype(score: number, fate: FateWindow | null): RelationshipArchetypeKey {
  if (fate?.type === 'karmic_meeting') return 'karmic_mirrors';
  if (fate?.type === 'healing') return 'warrior_healer';
  if (fate?.type === 'breakthrough') return 'creative_duo';
  if (score >= 75) return 'soul_partners';
  if (score >= 60) return 'builders';
  if (score >= 45) return 'explorers';
  return 'teacher_student';
}

export function generateArchetypeEvolution(
  timeline: RelationshipTimingTimeline,
  fateWindows: FateWindow[]
): ArchetypeEvolutionTimeline {
  const states: RelationshipArchetypeState[] = timeline.years.map(y => {
    const fate = fateWindows.find(f => f.year === y.year) ?? null;
    const key = inferRelArchetype(y.compatibilityScore, fate);

    let narrative = `${y.year}: ${REL_ARCHETYPE_NARRATIVES[key]}`;
    if (fate) narrative += ` This year is colored by a ${fate.type.replace('_', ' ')} window.`;

    return { year: y.year, key, label: REL_ARCHETYPE_LABELS[key], narrative };
  });

  const first = states[0];
  const last = states[states.length - 1];
  const summary = first && last
    ? first.key === last.key
      ? `The relationship maintains a consistent pattern as ${first.label} throughout this period.`
      : `The relationship evolves from ${first.label} into ${last.label}, reflecting a deep shift in how the bond is experienced.`
    : 'Insufficient data for archetype evolution analysis.';

  return { states, summary };
}

// ============================================================================
// 10. ORCHESTRATOR — Full Relationship Timing Blueprint
// ============================================================================

export interface RelationshipTimingBlueprint {
  // Static compatibility
  baseCompatibility: CompatibilityReport;
  synastry: SynastryNarrative;
  archetypeCompat: ArchetypeCompatibilityBlueprint;
  archetypeA: PersonalityArchetype;
  archetypeB: PersonalityArchetype;

  // Dynamic timing
  timeline: RelationshipTimingTimeline;
  fateWindows: FateWindow[];
  narrative: string;

  // Destiny layers
  destinyCurve: RelationshipDestinyCurve;
  archetypeEvolution: ArchetypeEvolutionTimeline;

  // Annual details
  annualsA: AnnualInfluence[];
  annualsB: AnnualInfluence[];
}

/**
 * Single orchestrator: takes two natal chart profiles and produces
 * the complete relationship timing blueprint.
 *
 * @param pillarsA - Person A's 4 pillars
 * @param breakdownA - Person A's per-pillar breakdown from Qi pipeline
 * @param pillarsB - Person B's 4 pillars
 * @param breakdownB - Person B's per-pillar breakdown from Qi pipeline
 * @param startYear - First year of the forecast window
 * @param years - Number of years to forecast (default 10)
 */
export function computeRelationshipTimingBlueprint(
  pillarsA: any[],
  breakdownA: PerPillarBreakdownMap,
  pillarsB: any[],
  breakdownB: PerPillarBreakdownMap,
  startYear: number = new Date().getFullYear(),
  years: number = 10
): RelationshipTimingBlueprint | null {
  // 1. Build Ten God profiles
  const profileA = computeTenGodProfile(pillarsA, breakdownA);
  const profileB = computeTenGodProfile(pillarsB, breakdownB);
  if (!profileA || !profileB) return null;

  // 2. MBTI + Archetypes
  const mbtiA = computeMBTI(profileA);
  const mbtiB = computeMBTI(profileB);
  const archetypeA = generatePersonalityArchetype(profileA, mbtiA);
  const archetypeB = generatePersonalityArchetype(profileB, mbtiB);

  // 3. Static compatibility
  const baseCompatibility = computeCompatibility(profileA, profileB);
  const synastry = generateSynastryNarrative(baseCompatibility);
  const archetypeCompat = generateArchetypeCompatibility(archetypeA, archetypeB);

  // 4. Annual influences
  const dmA = profileA.dayMaster;
  const dmB = profileB.dayMaster;
  const annualsA: AnnualInfluence[] = [];
  const annualsB: AnnualInfluence[] = [];

  for (let y = startYear; y < startYear + years; y++) {
    try {
      const yp = getYearPillar(y);
      annualsA.push({ ...computeAnnualInfluence(yp.stem, yp.branch, dmA.element, dmA.polarity, profileA), year: y });
      annualsB.push({ ...computeAnnualInfluence(yp.stem, yp.branch, dmB.element, dmB.polarity, profileB), year: y });
    } catch { /* skip */ }
  }

  // 5. Timeline + Fate Windows + Narrative
  const timeline = generateRelationshipTiming(baseCompatibility.breakdown.totalScore, annualsA, annualsB, startYear);
  const fateWindows = generateFateWindows(annualsA, annualsB, baseCompatibility.breakdown.totalScore);
  const narrative = generateRelationshipTimingNarrative(timeline, fateWindows);

  // 6. Destiny layers
  const destinyCurve = generateDestinyCurve(timeline, fateWindows);
  const archetypeEvolution = generateArchetypeEvolution(timeline, fateWindows);

  return {
    baseCompatibility,
    synastry,
    archetypeCompat,
    archetypeA,
    archetypeB,
    timeline,
    fateWindows,
    narrative,
    destinyCurve,
    archetypeEvolution,
    annualsA,
    annualsB,
  };
}
