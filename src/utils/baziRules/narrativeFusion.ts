/**
 * ============================================
 * MULTI-CHART NARRATIVE FUSION ENGINE
 * N charts → one group narrative
 *
 * Supports teams, families, polycules, lineages.
 * Fusion strategies: union, intersection, weighted.
 * ============================================
 */

import {
  NarrativeCockpitData,
  StoryBeat,
  EmotionalArcPoint,
  TimingCurvePoint,
  EnvironmentalOverlay,
  LifeChapter
} from './narrativeCockpitModel';

// ==================== FUSION DATA MODEL ====================

export interface MemberNarrative {
  personId: string;
  name: string;
  role?: string; // e.g., 'leader', 'supporter', 'catalyst'
  weight?: number; // 0-1, for weighted fusion
  cockpit: NarrativeCockpitData;
}

export interface GroupStoryBeat {
  id: string;
  label: string;
  labelZh?: string;
  description: string;
  startAge: number;
  endAge: number;
  members: string[]; // personIds participating
  memberNames?: string[];
  dominantThemes: string[];
  intensity: number; // 0-100 (aggregated)
  valence: 'positive' | 'negative' | 'mixed';
  consensus: number; // 0-100, how many members share this beat
}

export interface GroupEmotionalPoint {
  age: number;
  avgValue: number;
  spread: number; // variance / disagreement
  memberValues: { personId: string; name: string; value: number }[];
  dominantMood: 'positive' | 'negative' | 'neutral';
  harmony: number; // 0-100, how aligned the group is at this age
}

export interface GroupTimingPoint {
  age: number;
  avgLuck: number;
  avgVolatility: number;
  memberValues: { personId: string; name: string; luck: number; volatility: number }[];
  collectiveMomentum: 'rising' | 'falling' | 'stable';
  synchronicity: number; // 0-100
}

export interface GroupOverlay {
  id: string;
  label: string;
  type: string;
  startAge: number;
  endAge: number;
  members: string[];
  memberNames?: string[];
  coverage: number; // percentage of group affected
  notes: string;
}

export interface GroupChapter {
  id: string;
  name: string;
  nameZh?: string;
  ageRange: { start: number; end: number };
  overallTone: 'positive' | 'negative' | 'mixed';
  keyBeats: string[];
  memberParticipation: { personId: string; active: boolean }[];
  narrativeSummary: string;
}

export interface GroupNarrative {
  groupId: string;
  groupName?: string;
  members: MemberNarrative[];
  storyBeats: GroupStoryBeat[];
  emotionalArc: GroupEmotionalPoint[];
  timingCurve: GroupTimingPoint[];
  overlays: GroupOverlay[];
  chapters: GroupChapter[];
  summary: GroupNarrativeSummary;
}

export interface GroupNarrativeSummary {
  totalMembers: number;
  totalStoryBeats: number;
  sharedBeatsCount: number;
  uniqueBeatsCount: number;
  avgEmotionalHarmony: number;
  avgTimingSynchronicity: number;
  dominantGroupTheme: string;
  narrativeInsight: string;
}

// ==================== FUSION STRATEGIES ====================

export type FusionStrategy = 'union' | 'intersection' | 'weighted' | 'leader-centric';

export interface FusionOptions {
  strategy: FusionStrategy;
  leaderId?: string; // for leader-centric
  minConsensus?: number; // minimum % of members for intersection
  includeUniqueBeats?: boolean; // include beats only present in one member
}

// ==================== MAIN FUSION ENGINE ====================

/**
 * Fuse N narratives into one group narrative
 */
export function fuseNarratives(
  groupId: string,
  members: MemberNarrative[],
  options: FusionOptions = { strategy: 'union' }
): GroupNarrative {
  if (members.length === 0) {
    throw new Error('Cannot fuse empty member list');
  }

  const storyBeats = fuseStoryBeats(members, options);
  const emotionalArc = fuseEmotionalArc(members);
  const timingCurve = fuseTimingCurve(members);
  const overlays = fuseOverlays(members, options);
  const chapters = fuseChapters(members, storyBeats);
  const summary = computeGroupSummary(members, storyBeats, emotionalArc, timingCurve);

  return {
    groupId,
    members,
    storyBeats,
    emotionalArc,
    timingCurve,
    overlays,
    chapters,
    summary
  };
}

// ==================== STORY BEAT FUSION ====================

function fuseStoryBeats(
  members: MemberNarrative[],
  options: FusionOptions
): GroupStoryBeat[] {
  const allBeats = members.flatMap(m =>
    m.cockpit.storyBeats.map(b => ({ memberId: m.personId, memberName: m.name, beat: b }))
  );

  // Group beats by label (or similar timing)
  const groups: Map<string, { label: string; beats: typeof allBeats }> = new Map();

  for (const { memberId, memberName, beat } of allBeats) {
    // Find existing group with same label or overlapping time
    let matchKey: string | null = null;

    for (const [key, group] of groups.entries()) {
      const existingBeat = group.beats[0].beat;
      if (
        beat.label === existingBeat.label ||
        (Math.abs(beat.timeRange.startAge - existingBeat.timeRange.startAge) < 5 &&
         Math.abs(beat.timeRange.endAge - existingBeat.timeRange.endAge) < 5)
      ) {
        matchKey = key;
        break;
      }
    }

    if (matchKey) {
      groups.get(matchKey)!.beats.push({ memberId, memberName, beat });
    } else {
      const key = `${beat.label}_${beat.timeRange.startAge}`;
      groups.set(key, { label: beat.label, beats: [{ memberId, memberName, beat }] });
    }
  }

  // Convert groups to GroupStoryBeats
  const result: GroupStoryBeat[] = [];
  let idx = 0;

  for (const [, group] of groups.entries()) {
    const memberCount = new Set(group.beats.map(b => b.memberId)).size;
    const consensus = (memberCount / members.length) * 100;

    // Apply fusion strategy
    if (options.strategy === 'intersection' && consensus < (options.minConsensus || 50)) {
      if (!options.includeUniqueBeats) continue;
    }

    const startAge = Math.min(...group.beats.map(x => x.beat.timeRange.startAge));
    const endAge = Math.max(...group.beats.map(x => x.beat.timeRange.endAge));
    const memberIds = Array.from(new Set(group.beats.map(x => x.memberId)));
    const memberNames = Array.from(new Set(group.beats.map(x => x.memberName)));

    // Aggregate intensity (weighted if specified)
    let avgIntensity: number;
    if (options.strategy === 'weighted') {
      const weightedSum = group.beats.reduce((sum, x) => {
        const member = members.find(m => m.personId === x.memberId);
        const weight = member?.weight || 1;
        return sum + x.beat.intensity * weight;
      }, 0);
      const totalWeight = group.beats.reduce((sum, x) => {
        const member = members.find(m => m.personId === x.memberId);
        return sum + (member?.weight || 1);
      }, 0);
      avgIntensity = weightedSum / totalWeight;
    } else {
      avgIntensity = group.beats.reduce((sum, x) => sum + x.beat.intensity, 0) / group.beats.length;
    }

    // Determine valence
    const valences = group.beats.map(b => b.beat.valence);
    const posCount = valences.filter(v => v === 'positive').length;
    const negCount = valences.filter(v => v === 'negative').length;
    let valence: 'positive' | 'negative' | 'mixed';
    if (posCount > negCount * 2) valence = 'positive';
    else if (negCount > posCount * 2) valence = 'negative';
    else valence = 'mixed';

    // Collect themes
    const themes = Array.from(
      new Set(group.beats.flatMap(x => x.beat.keyRules || []))
    );

    result.push({
      id: `group_beat_${idx++}`,
      label: group.label,
      labelZh: group.beats[0].beat.labelZh,
      description: `Shared or echoed beat across ${memberIds.length} member${memberIds.length > 1 ? 's' : ''}.`,
      startAge,
      endAge,
      members: memberIds,
      memberNames,
      dominantThemes: themes.slice(0, 5),
      intensity: Math.round(avgIntensity),
      valence,
      consensus: Math.round(consensus)
    });
  }

  return result.sort((a, b) => a.startAge - b.startAge);
}

// ==================== EMOTIONAL ARC FUSION ====================

function fuseEmotionalArc(members: MemberNarrative[]): GroupEmotionalPoint[] {
  const ageSet = new Set<number>();
  members.forEach(m => m.cockpit.emotionalArc.forEach(p => ageSet.add(p.age)));

  const ages = Array.from(ageSet).sort((a, b) => a - b);

  return ages.map(age => {
    const memberValues = members.map(m => {
      const point = m.cockpit.emotionalArc.find(p => p.age === age);
      return {
        personId: m.personId,
        name: m.name,
        value: point ? point.intensity : 0
      };
    });

    const values = memberValues.map(v => v.value);
    const avg = values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

    // Calculate spread (standard deviation)
    const spread = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / (values.length || 1)
    );

    // Determine dominant mood
    const posCount = values.filter(v => v > 20).length;
    const negCount = values.filter(v => v < -20).length;
    let dominantMood: 'positive' | 'negative' | 'neutral';
    if (posCount > negCount) dominantMood = 'positive';
    else if (negCount > posCount) dominantMood = 'negative';
    else dominantMood = 'neutral';

    // Harmony: inverse of spread, normalized to 0-100
    const maxSpread = 100; // theoretical max
    const harmony = Math.max(0, Math.round(100 - (spread / maxSpread) * 100));

    return {
      age,
      avgValue: Math.round(avg),
      spread: Math.round(spread),
      memberValues,
      dominantMood,
      harmony
    };
  });
}

// ==================== TIMING CURVE FUSION ====================

function fuseTimingCurve(members: MemberNarrative[]): GroupTimingPoint[] {
  const ageSet = new Set<number>();
  members.forEach(m => m.cockpit.timingCurve.forEach(p => ageSet.add(p.age)));

  const ages = Array.from(ageSet).sort((a, b) => a - b);

  return ages.map((age, idx) => {
    const memberValues = members.map(m => {
      const point = m.cockpit.timingCurve.find(p => p.age === age);
      return {
        personId: m.personId,
        name: m.name,
        luck: point ? point.luckLevel : 50,
        volatility: point ? point.volatility : 50
      };
    });

    const lucks = memberValues.map(v => v.luck);
    const vols = memberValues.map(v => v.volatility);

    const avgLuck = lucks.reduce((s, v) => s + v, 0) / (lucks.length || 1);
    const avgVol = vols.reduce((s, v) => s + v, 0) / (vols.length || 1);

    // Calculate synchronicity: how close are all members' luck levels
    const luckSpread = Math.sqrt(
      lucks.reduce((sum, v) => sum + Math.pow(v - avgLuck, 2), 0) / (lucks.length || 1)
    );
    const synchronicity = Math.max(0, Math.round(100 - luckSpread * 2));

    // Determine collective momentum by comparing to previous age
    let collectiveMomentum: 'rising' | 'falling' | 'stable' = 'stable';
    if (idx > 0) {
      const prevAge = ages[idx - 1];
      const prevLucks = members.map(m => {
        const point = m.cockpit.timingCurve.find(p => p.age === prevAge);
        return point ? point.luckLevel : 50;
      });
      const prevAvg = prevLucks.reduce((s, v) => s + v, 0) / (prevLucks.length || 1);
      if (avgLuck > prevAvg + 5) collectiveMomentum = 'rising';
      else if (avgLuck < prevAvg - 5) collectiveMomentum = 'falling';
    }

    return {
      age,
      avgLuck: Math.round(avgLuck),
      avgVolatility: Math.round(avgVol),
      memberValues,
      collectiveMomentum,
      synchronicity
    };
  });
}

// ==================== OVERLAY FUSION ====================

function fuseOverlays(
  members: MemberNarrative[],
  options: FusionOptions
): GroupOverlay[] {
  const map: Map<string, GroupOverlay> = new Map();
  let idx = 0;

  members.forEach(m => {
    m.cockpit.overlays.forEach(o => {
      const key = o.label;
      const startAge = o.activeAges?.[0] || 0;
      const endAge = o.activeAges?.[o.activeAges.length - 1] || 100;

      if (!map.has(key)) {
        map.set(key, {
          id: `group_overlay_${idx++}`,
          label: o.label,
          type: o.type,
          startAge,
          endAge,
          members: [m.personId],
          memberNames: [m.name],
          coverage: 0,
          notes: o.description || ''
        });
      } else {
        const existing = map.get(key)!;
        existing.members.push(m.personId);
        existing.memberNames?.push(m.name);
        existing.startAge = Math.min(existing.startAge, startAge);
        existing.endAge = Math.max(existing.endAge, endAge);
      }
    });
  });

  // Calculate coverage and filter by strategy
  const result: GroupOverlay[] = [];
  for (const overlay of map.values()) {
    overlay.coverage = Math.round((overlay.members.length / members.length) * 100);

    if (options.strategy === 'intersection' && overlay.coverage < (options.minConsensus || 50)) {
      continue;
    }

    result.push(overlay);
  }

  return result;
}

// ==================== CHAPTER FUSION ====================

function fuseChapters(
  members: MemberNarrative[],
  groupBeats: GroupStoryBeat[]
): GroupChapter[] {
  // Create chapters based on beat clustering
  const chapters: GroupChapter[] = [];

  // Simple approach: divide into decades
  const decades = [
    { name: 'Early Life', nameZh: '童年', start: 0, end: 20 },
    { name: 'Coming of Age', nameZh: '成年', start: 20, end: 35 },
    { name: 'Prime Years', nameZh: '壮年', start: 35, end: 50 },
    { name: 'Wisdom Phase', nameZh: '中年', start: 50, end: 65 },
    { name: 'Golden Years', nameZh: '晚年', start: 65, end: 100 }
  ];

  decades.forEach((decade, idx) => {
    const beatsInRange = groupBeats.filter(b =>
      b.startAge >= decade.start && b.startAge < decade.end
    );

    // Determine which members are active in this chapter
    const activeMemberIds = new Set(beatsInRange.flatMap(b => b.members));
    const memberParticipation = members.map(m => ({
      personId: m.personId,
      active: activeMemberIds.has(m.personId)
    }));

    // Determine overall tone
    const posBeats = beatsInRange.filter(b => b.valence === 'positive').length;
    const negBeats = beatsInRange.filter(b => b.valence === 'negative').length;
    let tone: 'positive' | 'negative' | 'mixed';
    if (posBeats > negBeats * 1.5) tone = 'positive';
    else if (negBeats > posBeats * 1.5) tone = 'negative';
    else tone = 'mixed';

    chapters.push({
      id: `chapter_${idx}`,
      name: decade.name,
      nameZh: decade.nameZh,
      ageRange: { start: decade.start, end: decade.end },
      overallTone: tone,
      keyBeats: beatsInRange.map(b => b.id),
      memberParticipation,
      narrativeSummary: generateChapterSummary(decade.name, beatsInRange, activeMemberIds.size, members.length)
    });
  });

  return chapters;
}

function generateChapterSummary(
  chapterName: string,
  beats: GroupStoryBeat[],
  activeCount: number,
  totalCount: number
): string {
  if (beats.length === 0) {
    return `A quiet period with few shared experiences.`;
  }

  const participation = Math.round((activeCount / totalCount) * 100);
  const avgConsensus = beats.reduce((sum, b) => sum + b.consensus, 0) / beats.length;

  if (avgConsensus > 70) {
    return `${chapterName} brings the group together with ${beats.length} shared experiences (${participation}% participation).`;
  } else if (avgConsensus > 40) {
    return `${chapterName} shows diverse paths with some convergence. ${beats.length} story beats across ${participation}% of members.`;
  }

  return `${chapterName} reveals individual journeys within the collective. ${beats.length} distinct experiences shape this phase.`;
}

// ==================== SUMMARY COMPUTATION ====================

function computeGroupSummary(
  members: MemberNarrative[],
  beats: GroupStoryBeat[],
  emotionalArc: GroupEmotionalPoint[],
  timingCurve: GroupTimingPoint[]
): GroupNarrativeSummary {
  const sharedBeats = beats.filter(b => b.consensus >= 50);
  const uniqueBeats = beats.filter(b => b.consensus < 50);

  const avgEmotionalHarmony = emotionalArc.length > 0
    ? Math.round(emotionalArc.reduce((sum, p) => sum + p.harmony, 0) / emotionalArc.length)
    : 50;

  const avgTimingSynchronicity = timingCurve.length > 0
    ? Math.round(timingCurve.reduce((sum, p) => sum + p.synchronicity, 0) / timingCurve.length)
    : 50;

  // Determine dominant theme
  const allThemes = beats.flatMap(b => b.dominantThemes);
  const themeCounts: Record<string, number> = {};
  allThemes.forEach(t => { themeCounts[t] = (themeCounts[t] || 0) + 1; });
  const dominantGroupTheme = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'diverse_paths';

  // Generate narrative insight
  const narrativeInsight = generateGroupInsight(
    members.length,
    sharedBeats.length,
    avgEmotionalHarmony,
    avgTimingSynchronicity
  );

  return {
    totalMembers: members.length,
    totalStoryBeats: beats.length,
    sharedBeatsCount: sharedBeats.length,
    uniqueBeatsCount: uniqueBeats.length,
    avgEmotionalHarmony,
    avgTimingSynchronicity,
    dominantGroupTheme,
    narrativeInsight
  };
}

function generateGroupInsight(
  memberCount: number,
  sharedCount: number,
  emoHarmony: number,
  timingSync: number
): string {
  if (emoHarmony > 70 && timingSync > 70) {
    return `This group of ${memberCount} moves in remarkable harmony. ${sharedCount} shared story beats create a unified narrative tapestry.`;
  }

  if (emoHarmony > 70) {
    return `Emotional resonance binds these ${memberCount} souls together, even when their timing differs. A deeply felt collective bond.`;
  }

  if (timingSync > 70) {
    return `These ${memberCount} individuals walk synchronized paths, their life phases aligning even amid emotional diversity.`;
  }

  if (sharedCount > 5) {
    return `A diverse group of ${memberCount} finds common ground through ${sharedCount} shared experiences, weaving individual threads into collective meaning.`;
  }

  return `${memberCount} unique journeys intersect and diverge. The group's strength lies in its diversity of experience.`;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get members most central to the group narrative
 */
export function getCentralMembers(group: GroupNarrative): { personId: string; centrality: number }[] {
  const centrality: Record<string, number> = {};

  // Count beat participation
  for (const beat of group.storyBeats) {
    for (const memberId of beat.members) {
      centrality[memberId] = (centrality[memberId] || 0) + beat.consensus;
    }
  }

  return Object.entries(centrality)
    .map(([personId, score]) => ({ personId, centrality: score }))
    .sort((a, b) => b.centrality - a.centrality);
}

/**
 * Find peak harmony periods for the group
 */
export function getGroupHarmonyPeaks(
  group: GroupNarrative
): { age: number; harmony: number }[] {
  return group.emotionalArc
    .filter(p => p.harmony >= 70)
    .map(p => ({ age: p.age, harmony: p.harmony }))
    .sort((a, b) => b.harmony - a.harmony)
    .slice(0, 5);
}

/**
 * Get periods of highest synchronicity
 */
export function getSynchronicityPeaks(
  group: GroupNarrative
): { age: number; synchronicity: number; momentum: string }[] {
  return group.timingCurve
    .filter(p => p.synchronicity >= 70)
    .map(p => ({ age: p.age, synchronicity: p.synchronicity, momentum: p.collectiveMomentum }))
    .sort((a, b) => b.synchronicity - a.synchronicity)
    .slice(0, 5);
}

// ==================== EXPORTS ====================

export {
  fuseNarratives,
  getCentralMembers,
  getGroupHarmonyPeaks,
  getSynchronicityPeaks
};
