/**
 * ============================================
 * PROFILING → MYTHOS ARCHETYPE ASSIGNMENT
 * Assigns mythos archetypes based on:
 * - Personality traits
 * - Work style
 * - Constellation themes
 * - Generational threads
 * - Emotional resonance
 *
 * This is the mythic identity engine.
 * ============================================
 */

import { ProfileFusion } from './profilingConstellationFusion';
import { AncestralArchetype } from './mythosLayer';
import { GenerationalThread } from './generationalLadder';

// ==================== DATA MODEL ====================

export interface ArchetypeAssignment {
  id: string;
  personId: string;
  archetypeId: string;
  archetypeName: string;
  archetypeNameZh?: string;
  evidence: AssignmentEvidence[];
  strength: number; // 0-100
  resonanceType: 'primary' | 'secondary' | 'shadow' | 'emerging';
}

export interface AssignmentEvidence {
  source: 'trait' | 'work_style' | 'constellation' | 'thread' | 'emotion';
  value: string;
  weight: number;
  explanation: string;
  explanationZh?: string;
}

export interface ArchetypeProfile {
  personId: string;
  name: string;
  nameZh?: string;
  primaryArchetype: ArchetypeAssignment;
  secondaryArchetypes: ArchetypeAssignment[];
  shadowArchetype?: ArchetypeAssignment;
  emergingArchetype?: ArchetypeAssignment;
  archetypeNarrative: string;
  archetypeNarrativeZh: string;
}

export interface ArchetypeDefinition {
  id: string;
  name: string;
  nameZh: string;
  themes: string[];
  traits: string[];
  workStyles: string[];
  shadowAspects: string[];
  giftAspects: string[];
}

// ==================== DEFAULT ARCHETYPES ====================

/**
 * Default archetype definitions
 */
export const DEFAULT_ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'warrior',
    name: 'The Warrior',
    nameZh: '战士',
    themes: ['tension', 'conflict', 'courage', 'protection'],
    traits: ['decisive', 'courageous', 'protective', 'determined'],
    workStyles: ['action-oriented', 'competitive', 'direct'],
    shadowAspects: ['aggression', 'rigidity', 'burnout'],
    giftAspects: ['courage', 'protection', 'decisiveness']
  },
  {
    id: 'healer',
    name: 'The Healer',
    nameZh: '疗愈者',
    themes: ['healing', 'nurturing', 'restoration', 'compassion'],
    traits: ['empathetic', 'nurturing', 'patient', 'compassionate'],
    workStyles: ['supportive', 'collaborative', 'service-oriented'],
    shadowAspects: ['over-giving', 'martyr complex', 'boundary issues'],
    giftAspects: ['healing presence', 'emotional wisdom', 'compassion']
  },
  {
    id: 'sage',
    name: 'The Sage',
    nameZh: '智者',
    themes: ['wisdom', 'knowledge', 'guidance', 'insight'],
    traits: ['analytical', 'wise', 'contemplative', 'insightful'],
    workStyles: ['strategic', 'methodical', 'research-oriented'],
    shadowAspects: ['detachment', 'overthinking', 'arrogance'],
    giftAspects: ['wisdom', 'insight', 'discernment']
  },
  {
    id: 'creator',
    name: 'The Creator',
    nameZh: '创造者',
    themes: ['creativity', 'innovation', 'expression', 'vision'],
    traits: ['creative', 'innovative', 'expressive', 'visionary'],
    workStyles: ['innovative', 'independent', 'experimental'],
    shadowAspects: ['perfectionism', 'isolation', 'impracticality'],
    giftAspects: ['creativity', 'vision', 'originality']
  },
  {
    id: 'ruler',
    name: 'The Ruler',
    nameZh: '统治者',
    themes: ['leadership', 'authority', 'structure', 'order'],
    traits: ['authoritative', 'responsible', 'organized', 'decisive'],
    workStyles: ['leadership', 'organized', 'goal-oriented'],
    shadowAspects: ['control', 'tyranny', 'rigidity'],
    giftAspects: ['leadership', 'responsibility', 'vision']
  },
  {
    id: 'lover',
    name: 'The Lover',
    nameZh: '恋人',
    themes: ['connection', 'beauty', 'passion', 'intimacy'],
    traits: ['passionate', 'romantic', 'appreciative', 'connected'],
    workStyles: ['relationship-focused', 'aesthetic', 'harmonious'],
    shadowAspects: ['obsession', 'jealousy', 'co-dependence'],
    giftAspects: ['deep connection', 'appreciation', 'passion']
  },
  {
    id: 'rebel',
    name: 'The Rebel',
    nameZh: '叛逆者',
    themes: ['change', 'revolution', 'freedom', 'breaking'],
    traits: ['independent', 'rebellious', 'transformative', 'unconventional'],
    workStyles: ['disruptive', 'independent', 'change-oriented'],
    shadowAspects: ['destruction', 'alienation', 'self-sabotage'],
    giftAspects: ['courage to change', 'authenticity', 'freedom']
  },
  {
    id: 'magician',
    name: 'The Magician',
    nameZh: '魔法师',
    themes: ['transformation', 'power', 'manifestation', 'alchemy'],
    traits: ['transformative', 'powerful', 'catalytic', 'insightful'],
    workStyles: ['visionary', 'influential', 'strategic'],
    shadowAspects: ['manipulation', 'deception', 'power hunger'],
    giftAspects: ['transformation', 'manifestation', 'influence']
  },
  {
    id: 'innocent',
    name: 'The Innocent',
    nameZh: '纯真者',
    themes: ['hope', 'faith', 'renewal', 'trust'],
    traits: ['optimistic', 'trusting', 'hopeful', 'pure'],
    workStyles: ['enthusiastic', 'trusting', 'positive'],
    shadowAspects: ['naivety', 'denial', 'vulnerability'],
    giftAspects: ['hope', 'faith', 'renewal']
  },
  {
    id: 'orphan',
    name: 'The Orphan',
    nameZh: '孤儿',
    themes: ['belonging', 'survival', 'resilience', 'community'],
    traits: ['resilient', 'empathetic', 'realistic', 'adaptive'],
    workStyles: ['team-oriented', 'practical', 'adaptive'],
    shadowAspects: ['victimhood', 'cynicism', 'dependence'],
    giftAspects: ['resilience', 'empathy', 'realism']
  },
  {
    id: 'explorer',
    name: 'The Explorer',
    nameZh: '探险家',
    themes: ['adventure', 'freedom', 'discovery', 'authenticity'],
    traits: ['adventurous', 'curious', 'independent', 'restless'],
    workStyles: ['pioneering', 'flexible', 'self-directed'],
    shadowAspects: ['rootlessness', 'commitment-phobia', 'alienation'],
    giftAspects: ['discovery', 'authenticity', 'freedom']
  },
  {
    id: 'caregiver',
    name: 'The Caregiver',
    nameZh: '照顾者',
    themes: ['nurturing', 'protection', 'generosity', 'sacrifice'],
    traits: ['nurturing', 'generous', 'protective', 'selfless'],
    workStyles: ['supportive', 'service-oriented', 'reliable'],
    shadowAspects: ['martyrdom', 'enabling', 'resentment'],
    giftAspects: ['generosity', 'protection', 'devotion']
  }
];

// ==================== ASSIGNMENT ENGINE ====================

/**
 * Assign archetypes from profile fusion
 */
export function assignArchetypesFromProfile(
  profile: ProfileFusion,
  archetypes: ArchetypeDefinition[] = DEFAULT_ARCHETYPES,
  threads?: GenerationalThread[]
): ArchetypeAssignment[] {
  const assignments: ArchetypeAssignment[] = [];

  archetypes.forEach(archetype => {
    const evidence: AssignmentEvidence[] = [];

    // Check trait overlap
    const traitOverlap = profile.personality.filter(t =>
      archetype.traits.some(at => matchesTerm(t, at))
    );
    traitOverlap.forEach(trait => {
      evidence.push({
        source: 'trait',
        value: trait,
        weight: 30,
        explanation: `Personality trait "${trait}" aligns with ${archetype.name}.`,
        explanationZh: `个性特质「${trait}」与「${archetype.nameZh}」契合。`
      });
    });

    // Check work style overlap
    const workStyleOverlap = profile.workStyle.filter(ws =>
      archetype.workStyles.some(aw => matchesTerm(ws, aw))
    );
    workStyleOverlap.forEach(ws => {
      evidence.push({
        source: 'work_style',
        value: ws,
        weight: 25,
        explanation: `Work style "${ws}" resonates with ${archetype.name}.`,
        explanationZh: `工作风格「${ws}」与「${archetype.nameZh}」共振。`
      });
    });

    // Check constellation theme overlap
    const themeOverlap = profile.constellationThemes.filter(ct =>
      archetype.themes.some(at => matchesTerm(ct, at))
    );
    themeOverlap.forEach(theme => {
      evidence.push({
        source: 'constellation',
        value: theme,
        weight: 35,
        explanation: `Constellation theme "${theme}" connects to ${archetype.name}.`,
        explanationZh: `星座主题「${theme}」连接到「${archetype.nameZh}」。`
      });
    });

    // Check generational thread overlap (if provided)
    if (threads) {
      const threadOverlap = threads.filter(t =>
        archetype.themes.some(at => matchesTerm(t.theme, at))
      );
      threadOverlap.forEach(thread => {
        evidence.push({
          source: 'thread',
          value: thread.theme,
          weight: 40,
          explanation: `Generational thread "${thread.theme}" carries ${archetype.name} energy.`,
          explanationZh: `代际线索「${thread.theme}」携带「${archetype.nameZh}」能量。`
        });
      });
    }

    // Check shadow aspect overlap
    const shadowOverlap = profile.shadowAspects.filter(sa =>
      archetype.shadowAspects.some(as => matchesTerm(sa, as))
    );
    shadowOverlap.forEach(shadow => {
      evidence.push({
        source: 'emotion',
        value: shadow,
        weight: 20,
        explanation: `Shadow aspect "${shadow}" indicates ${archetype.name} shadow work.`,
        explanationZh: `阴影面「${shadow}」暗示「${archetype.nameZh}」阴影功课。`
      });
    });

    // Calculate strength
    if (evidence.length > 0) {
      const totalWeight = evidence.reduce((sum, e) => sum + e.weight, 0);
      const maxPossibleWeight = 130; // Approximate max if all sources match
      const strength = Math.min(100, Math.round((totalWeight / maxPossibleWeight) * 100));

      // Determine resonance type
      const hasShadowEvidence = evidence.some(e => e.source === 'emotion');
      const hasStrongEvidence = strength > 70;
      const hasMediumEvidence = strength > 40;

      let resonanceType: ArchetypeAssignment['resonanceType'];
      if (hasShadowEvidence && !hasStrongEvidence) {
        resonanceType = 'shadow';
      } else if (hasStrongEvidence) {
        resonanceType = 'primary';
      } else if (hasMediumEvidence) {
        resonanceType = 'secondary';
      } else {
        resonanceType = 'emerging';
      }

      assignments.push({
        id: `${profile.personId}-${archetype.id}`,
        personId: profile.personId,
        archetypeId: archetype.id,
        archetypeName: archetype.name,
        archetypeNameZh: archetype.nameZh,
        evidence,
        strength,
        resonanceType
      });
    }
  });

  // Sort by strength
  return assignments.sort((a, b) => b.strength - a.strength);
}

/**
 * Check if two terms match (fuzzy)
 */
function matchesTerm(term1: string, term2: string): boolean {
  const t1 = term1.toLowerCase().replace(/[^a-z]/g, '');
  const t2 = term2.toLowerCase().replace(/[^a-z]/g, '');

  // Direct match
  if (t1 === t2) return true;

  // Partial match
  if (t1.includes(t2) || t2.includes(t1)) return true;

  // Common word match (for multi-word terms)
  const words1 = term1.toLowerCase().split(/\W+/);
  const words2 = term2.toLowerCase().split(/\W+/);
  return words1.some(w1 => words2.some(w2 => w1 === w2 && w1.length > 3));
}

// ==================== PROFILE BUILDING ====================

/**
 * Build full archetype profile for a person
 */
export function buildArchetypeProfile(
  profile: ProfileFusion,
  archetypes: ArchetypeDefinition[] = DEFAULT_ARCHETYPES,
  threads?: GenerationalThread[]
): ArchetypeProfile {
  const assignments = assignArchetypesFromProfile(profile, archetypes, threads);

  // Find primary (strongest non-shadow)
  const primary = assignments.find(a => a.resonanceType === 'primary') ||
                  assignments.find(a => a.resonanceType === 'secondary') ||
                  assignments[0];

  // Find secondary archetypes
  const secondary = assignments
    .filter(a => a.id !== primary?.id && a.resonanceType !== 'shadow')
    .slice(0, 2);

  // Find shadow archetype
  const shadow = assignments.find(a => a.resonanceType === 'shadow');

  // Find emerging archetype
  const emerging = assignments.find(a =>
    a.resonanceType === 'emerging' &&
    a.id !== primary?.id &&
    !secondary.some(s => s.id === a.id)
  );

  // Generate narrative
  const { narrative, narrativeZh } = generateArchetypeNarrative(
    primary,
    secondary,
    shadow,
    emerging
  );

  return {
    personId: profile.personId,
    name: profile.name,
    nameZh: profile.nameZh,
    primaryArchetype: primary,
    secondaryArchetypes: secondary,
    shadowArchetype: shadow,
    emergingArchetype: emerging,
    archetypeNarrative: narrative,
    archetypeNarrativeZh: narrativeZh
  };
}

/**
 * Generate archetype narrative
 */
function generateArchetypeNarrative(
  primary: ArchetypeAssignment,
  secondary: ArchetypeAssignment[],
  shadow?: ArchetypeAssignment,
  emerging?: ArchetypeAssignment
): { narrative: string; narrativeZh: string } {
  const secondaryNames = secondary.map(s => s.archetypeName).join(' and ');
  const secondaryNamesZh = secondary.map(s => s.archetypeNameZh).join('、');

  let narrative = `You walk primarily as ${primary.archetypeName}, carrying their gifts of presence and purpose.`;
  let narrativeZh = `你主要以「${primary.archetypeNameZh}」的身份行走，携带其存在感和目的的天赋。`;

  if (secondary.length > 0) {
    narrative += ` ${secondaryNames} walk${secondary.length > 1 ? '' : 's'} alongside you, offering complementary energies.`;
    narrativeZh += `「${secondaryNamesZh}」与你并肩同行，提供互补的能量。`;
  }

  if (shadow) {
    narrative += ` In your shadow dwells ${shadow.archetypeName}, holding lessons yet to be integrated.`;
    narrativeZh += `在你的阴影中住着「${shadow.archetypeNameZh}」，持有尚待整合的教训。`;
  }

  if (emerging) {
    narrative += ` ${emerging.archetypeName} is emerging in you, a new face of your becoming.`;
    narrativeZh += `「${emerging.archetypeNameZh}」正在你身上涌现，是你成为中的新面貌。`;
  }

  return { narrative, narrativeZh };
}

// ==================== BATCH PROCESSING ====================

/**
 * Assign archetypes for multiple profiles
 */
export function assignArchetypesForAll(
  profiles: ProfileFusion[],
  archetypes: ArchetypeDefinition[] = DEFAULT_ARCHETYPES,
  threads?: GenerationalThread[]
): ArchetypeAssignment[] {
  const allAssignments: ArchetypeAssignment[] = [];

  profiles.forEach(profile => {
    const assignments = assignArchetypesFromProfile(profile, archetypes, threads);
    allAssignments.push(...assignments);
  });

  return allAssignments;
}

/**
 * Build archetype profiles for all
 */
export function buildArchetypeProfilesForAll(
  profiles: ProfileFusion[],
  archetypes: ArchetypeDefinition[] = DEFAULT_ARCHETYPES,
  threads?: GenerationalThread[]
): ArchetypeProfile[] {
  return profiles.map(profile =>
    buildArchetypeProfile(profile, archetypes, threads)
  );
}

// ==================== RENDERING ====================

/**
 * Render archetype profile as markdown
 */
export function renderArchetypeProfileMarkdown(
  profile: ArchetypeProfile,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];
  const name = lang === 'zh' && profile.nameZh ? profile.nameZh : profile.name;

  lines.push(`# ${lang === 'zh' ? '原型画像' : 'Archetype Profile'}: ${name}`);
  lines.push('');

  // Primary archetype
  const primaryName = lang === 'zh'
    ? profile.primaryArchetype.archetypeNameZh
    : profile.primaryArchetype.archetypeName;
  lines.push(`## ${lang === 'zh' ? '主要原型' : 'Primary Archetype'}: ${primaryName}`);
  lines.push(`${lang === 'zh' ? '强度' : 'Strength'}: ${profile.primaryArchetype.strength}%`);
  lines.push('');
  lines.push(`### ${lang === 'zh' ? '证据' : 'Evidence'}`);
  profile.primaryArchetype.evidence.forEach(e => {
    const exp = lang === 'zh' && e.explanationZh ? e.explanationZh : e.explanation;
    lines.push(`- [${e.source}] ${exp}`);
  });
  lines.push('');

  // Secondary archetypes
  if (profile.secondaryArchetypes.length > 0) {
    lines.push(`## ${lang === 'zh' ? '次要原型' : 'Secondary Archetypes'}`);
    profile.secondaryArchetypes.forEach(sa => {
      const saName = lang === 'zh' ? sa.archetypeNameZh : sa.archetypeName;
      lines.push(`- **${saName}** (${sa.strength}%)`);
    });
    lines.push('');
  }

  // Shadow archetype
  if (profile.shadowArchetype) {
    const shadowName = lang === 'zh'
      ? profile.shadowArchetype.archetypeNameZh
      : profile.shadowArchetype.archetypeName;
    lines.push(`## ${lang === 'zh' ? '阴影原型' : 'Shadow Archetype'}: ${shadowName}`);
    lines.push(`${lang === 'zh' ? '强度' : 'Strength'}: ${profile.shadowArchetype.strength}%`);
    lines.push('');
  }

  // Emerging archetype
  if (profile.emergingArchetype) {
    const emergingName = lang === 'zh'
      ? profile.emergingArchetype.archetypeNameZh
      : profile.emergingArchetype.archetypeName;
    lines.push(`## ${lang === 'zh' ? '涌现原型' : 'Emerging Archetype'}: ${emergingName}`);
    lines.push(`${lang === 'zh' ? '强度' : 'Strength'}: ${profile.emergingArchetype.strength}%`);
    lines.push('');
  }

  // Narrative
  lines.push(`## ${lang === 'zh' ? '叙事' : 'Narrative'}`);
  lines.push(lang === 'zh' ? profile.archetypeNarrativeZh : profile.archetypeNarrative);

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  assignArchetypesFromProfile,
  buildArchetypeProfile,
  assignArchetypesForAll,
  buildArchetypeProfilesForAll,
  renderArchetypeProfileMarkdown,
  DEFAULT_ARCHETYPES
};
