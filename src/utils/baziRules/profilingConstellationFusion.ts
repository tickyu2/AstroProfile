/**
 * ============================================
 * PROFILING + CONSTELLATION FUSION ENGINE
 * Merges:
 * - Personality profiling
 * - Work style analysis
 * - Team compatibility
 * - Constellation engine
 * - Multi-chart narrative fusion
 *
 * This is team/org-level intelligence that
 * Joey Yap's system doesn't have.
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface PersonProfile {
  personId: string;
  name: string;
  nameZh?: string;
  traits: string[];
  workStyle: string[];
  strengths: string[];
  challenges: string[];
  elementBalance?: Record<string, number>;
}

export interface ConstellationThemes {
  personId: string;
  themes: string[];
  dominantArchetype?: string;
  shadowAspects?: string[];
  giftAspects?: string[];
}

export interface CompatibilityMatrix {
  [personId: string]: Record<string, number>;
}

export interface ProfileFusion {
  personId: string;
  name: string;
  nameZh?: string;
  personality: string[];
  workStyle: string[];
  constellationThemes: string[];
  compatibilityScores: Record<string, number>;
  dominantArchetype?: string;
  shadowAspects: string[];
  giftAspects: string[];
  fusionInsights: FusionInsight[];
}

export interface FusionInsight {
  type: 'synergy' | 'tension' | 'opportunity' | 'caution';
  description: string;
  descriptionZh?: string;
  relatedPersons?: string[];
  strength: number; // 0-100
}

export interface TeamFusion {
  teamId: string;
  members: ProfileFusion[];
  teamDynamics: TeamDynamic[];
  collectiveThemes: string[];
  teamStrengths: string[];
  teamChallenges: string[];
  overallCompatibility: number;
  recommendations: TeamRecommendation[];
}

export interface TeamDynamic {
  type: 'complementary' | 'competitive' | 'supportive' | 'challenging';
  memberA: string;
  memberB: string;
  description: string;
  descriptionZh?: string;
  score: number;
}

export interface TeamRecommendation {
  area: string;
  recommendation: string;
  recommendationZh?: string;
  priority: 'high' | 'medium' | 'low';
}

// ==================== FUSION ENGINE ====================

/**
 * Fuse profiling and constellation data for a single person
 */
export function fuseProfileAndConstellation(
  profile: PersonProfile,
  constellation: ConstellationThemes,
  compatibility: Record<string, number>
): ProfileFusion {
  const fusionInsights = generateFusionInsights(profile, constellation, compatibility);

  return {
    personId: profile.personId,
    name: profile.name,
    nameZh: profile.nameZh,
    personality: profile.traits,
    workStyle: profile.workStyle,
    constellationThemes: constellation.themes,
    compatibilityScores: compatibility,
    dominantArchetype: constellation.dominantArchetype,
    shadowAspects: constellation.shadowAspects || [],
    giftAspects: constellation.giftAspects || [],
    fusionInsights
  };
}

/**
 * Fuse profiling and constellation for multiple profiles
 */
export function fuseProfilingAndConstellation(
  profiles: PersonProfile[],
  constellations: Record<string, ConstellationThemes>,
  compatibility: CompatibilityMatrix
): ProfileFusion[] {
  return profiles.map(p => {
    const constellation = constellations[p.personId] || {
      personId: p.personId,
      themes: [],
      shadowAspects: [],
      giftAspects: []
    };
    const scores = compatibility[p.personId] || {};

    return fuseProfileAndConstellation(p, constellation, scores);
  });
}

/**
 * Generate insights from fused data
 */
function generateFusionInsights(
  profile: PersonProfile,
  constellation: ConstellationThemes,
  compatibility: Record<string, number>
): FusionInsight[] {
  const insights: FusionInsight[] = [];

  // Check for trait-theme synergies
  const synergies = findTraitThemeSynergies(profile.traits, constellation.themes);
  synergies.forEach(s => {
    insights.push({
      type: 'synergy',
      description: `${s.trait} aligns with ${s.theme}, creating natural flow.`,
      descriptionZh: `「${s.trait}」与「${s.theme}」共振，形成自然流动。`,
      strength: s.strength
    });
  });

  // Check for shadow-challenge overlaps
  const shadowOverlaps = findOverlaps(
    constellation.shadowAspects || [],
    profile.challenges
  );
  shadowOverlaps.forEach(overlap => {
    insights.push({
      type: 'tension',
      description: `Shadow aspect "${overlap}" echoes in personal challenges. This is an area for growth.`,
      descriptionZh: `阴影面「${overlap}」与个人挑战呼应，此为成长契机。`,
      strength: 70
    });
  });

  // Check for gift-strength overlaps
  const giftOverlaps = findOverlaps(
    constellation.giftAspects || [],
    profile.strengths
  );
  giftOverlaps.forEach(overlap => {
    insights.push({
      type: 'opportunity',
      description: `Gift "${overlap}" amplifies existing strength. Leverage this advantage.`,
      descriptionZh: `天赋「${overlap}」放大既有优势，善加利用。`,
      strength: 85
    });
  });

  // Check for compatibility patterns
  const highCompatibility = Object.entries(compatibility)
    .filter(([_, score]) => score >= 80)
    .map(([id]) => id);

  if (highCompatibility.length > 0) {
    insights.push({
      type: 'synergy',
      description: `High compatibility with ${highCompatibility.length} team member(s).`,
      descriptionZh: `与 ${highCompatibility.length} 位成员高度契合。`,
      relatedPersons: highCompatibility,
      strength: 80
    });
  }

  const lowCompatibility = Object.entries(compatibility)
    .filter(([_, score]) => score < 40)
    .map(([id]) => id);

  if (lowCompatibility.length > 0) {
    insights.push({
      type: 'caution',
      description: `Potential friction with ${lowCompatibility.length} team member(s). Requires conscious effort.`,
      descriptionZh: `与 ${lowCompatibility.length} 位成员可能有摩擦，需要有意识地努力。`,
      relatedPersons: lowCompatibility,
      strength: 60
    });
  }

  return insights;
}

/**
 * Find synergies between traits and themes
 */
function findTraitThemeSynergies(
  traits: string[],
  themes: string[]
): { trait: string; theme: string; strength: number }[] {
  const synergies: { trait: string; theme: string; strength: number }[] = [];

  // Synergy mapping
  const synergyMap: Record<string, string[]> = {
    'leadership': ['authority', 'power', 'guidance'],
    'creativity': ['expression', 'innovation', 'art'],
    'analytical': ['structure', 'logic', 'planning'],
    'empathy': ['nurturing', 'connection', 'healing'],
    'resilience': ['endurance', 'strength', 'perseverance'],
    'communication': ['expression', 'connection', 'teaching'],
    'strategic': ['planning', 'vision', 'structure'],
    'intuitive': ['wisdom', 'insight', 'perception']
  };

  traits.forEach(trait => {
    const traitLower = trait.toLowerCase();
    const relatedThemes = synergyMap[traitLower] || [];

    themes.forEach(theme => {
      const themeLower = theme.toLowerCase();
      if (relatedThemes.some(t => themeLower.includes(t) || t.includes(themeLower))) {
        synergies.push({
          trait,
          theme,
          strength: 75 + Math.floor(Math.random() * 20) // 75-95
        });
      }
    });
  });

  return synergies;
}

/**
 * Find overlaps between two string arrays
 */
function findOverlaps(arr1: string[], arr2: string[]): string[] {
  const set1 = new Set(arr1.map(s => s.toLowerCase()));
  return arr2.filter(s => set1.has(s.toLowerCase()));
}

// ==================== TEAM FUSION ====================

/**
 * Build team fusion analysis
 */
export function buildTeamFusion(
  teamId: string,
  memberFusions: ProfileFusion[]
): TeamFusion {
  const teamDynamics = analyzeTeamDynamics(memberFusions);
  const collectiveThemes = extractCollectiveThemes(memberFusions);
  const { strengths, challenges } = analyzeTeamCapabilities(memberFusions);
  const overallCompatibility = calculateOverallCompatibility(memberFusions);
  const recommendations = generateTeamRecommendations(
    teamDynamics,
    strengths,
    challenges,
    overallCompatibility
  );

  return {
    teamId,
    members: memberFusions,
    teamDynamics,
    collectiveThemes,
    teamStrengths: strengths,
    teamChallenges: challenges,
    overallCompatibility,
    recommendations
  };
}

/**
 * Analyze dynamics between team members
 */
function analyzeTeamDynamics(members: ProfileFusion[]): TeamDynamic[] {
  const dynamics: TeamDynamic[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const memberA = members[i];
      const memberB = members[j];

      const score = memberA.compatibilityScores[memberB.personId] || 50;
      const type = getDynamicType(score, memberA, memberB);

      dynamics.push({
        type,
        memberA: memberA.personId,
        memberB: memberB.personId,
        description: getDynamicDescription(type, memberA.name, memberB.name),
        descriptionZh: getDynamicDescriptionZh(type, memberA.nameZh || memberA.name, memberB.nameZh || memberB.name),
        score
      });
    }
  }

  return dynamics;
}

/**
 * Determine dynamic type from score and profiles
 */
function getDynamicType(
  score: number,
  memberA: ProfileFusion,
  memberB: ProfileFusion
): TeamDynamic['type'] {
  if (score >= 80) {
    // Check if they have complementary themes
    const aThemes = new Set(memberA.constellationThemes);
    const bThemes = new Set(memberB.constellationThemes);
    const overlap = [...aThemes].filter(t => bThemes.has(t)).length;

    return overlap > 2 ? 'supportive' : 'complementary';
  } else if (score >= 60) {
    return 'supportive';
  } else if (score >= 40) {
    return 'competitive';
  } else {
    return 'challenging';
  }
}

/**
 * Get dynamic description in English
 */
function getDynamicDescription(
  type: TeamDynamic['type'],
  nameA: string,
  nameB: string
): string {
  switch (type) {
    case 'complementary':
      return `${nameA} and ${nameB} complement each other's strengths.`;
    case 'supportive':
      return `${nameA} and ${nameB} naturally support each other's growth.`;
    case 'competitive':
      return `${nameA} and ${nameB} may compete for similar roles or recognition.`;
    case 'challenging':
      return `${nameA} and ${nameB} require conscious effort to collaborate effectively.`;
    default:
      return `${nameA} and ${nameB} have a neutral dynamic.`;
  }
}

/**
 * Get dynamic description in Chinese
 */
function getDynamicDescriptionZh(
  type: TeamDynamic['type'],
  nameA: string,
  nameB: string
): string {
  switch (type) {
    case 'complementary':
      return `${nameA}与${nameB}优势互补。`;
    case 'supportive':
      return `${nameA}与${nameB}自然地支持彼此成长。`;
    case 'competitive':
      return `${nameA}与${nameB}可能在相似领域竞争。`;
    case 'challenging':
      return `${nameA}与${nameB}需要有意识地努力合作。`;
    default:
      return `${nameA}与${nameB}关系中性。`;
  }
}

/**
 * Extract collective themes from team
 */
function extractCollectiveThemes(members: ProfileFusion[]): string[] {
  const themeCounts = new Map<string, number>();

  members.forEach(m => {
    m.constellationThemes.forEach(theme => {
      themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
    });
  });

  // Return themes that appear in at least 2 members
  return [...themeCounts.entries()]
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme);
}

/**
 * Analyze team strengths and challenges
 */
function analyzeTeamCapabilities(
  members: ProfileFusion[]
): { strengths: string[]; challenges: string[] } {
  const strengthCounts = new Map<string, number>();
  const challengeCounts = new Map<string, number>();

  members.forEach(m => {
    m.giftAspects.forEach(g => {
      strengthCounts.set(g, (strengthCounts.get(g) || 0) + 1);
    });
    m.shadowAspects.forEach(s => {
      challengeCounts.set(s, (challengeCounts.get(s) || 0) + 1);
    });
  });

  // Strengths: gifts present in multiple members
  const strengths = [...strengthCounts.entries()]
    .filter(([_, count]) => count >= 2)
    .map(([strength]) => strength);

  // Challenges: shadows present in multiple members
  const challenges = [...challengeCounts.entries()]
    .filter(([_, count]) => count >= 2)
    .map(([challenge]) => challenge);

  return { strengths, challenges };
}

/**
 * Calculate overall team compatibility
 */
function calculateOverallCompatibility(members: ProfileFusion[]): number {
  if (members.length < 2) return 100;

  let totalScore = 0;
  let pairCount = 0;

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const score = members[i].compatibilityScores[members[j].personId] || 50;
      totalScore += score;
      pairCount++;
    }
  }

  return pairCount > 0 ? Math.round(totalScore / pairCount) : 50;
}

/**
 * Generate team recommendations
 */
function generateTeamRecommendations(
  dynamics: TeamDynamic[],
  strengths: string[],
  challenges: string[],
  compatibility: number
): TeamRecommendation[] {
  const recommendations: TeamRecommendation[] = [];

  // Check for challenging dynamics
  const challengingPairs = dynamics.filter(d => d.type === 'challenging');
  if (challengingPairs.length > 0) {
    recommendations.push({
      area: 'Communication',
      recommendation: 'Establish clear communication protocols to address potential friction points.',
      recommendationZh: '建立清晰的沟通协议以解决潜在摩擦点。',
      priority: 'high'
    });
  }

  // Check for competitive dynamics
  const competitivePairs = dynamics.filter(d => d.type === 'competitive');
  if (competitivePairs.length > 0) {
    recommendations.push({
      area: 'Role Clarity',
      recommendation: 'Define clear roles and responsibilities to minimize competitive tension.',
      recommendationZh: '明确角色和职责以减少竞争张力。',
      priority: 'medium'
    });
  }

  // Leverage strengths
  if (strengths.length > 0) {
    recommendations.push({
      area: 'Leverage Strengths',
      recommendation: `Build on collective strengths: ${strengths.slice(0, 3).join(', ')}.`,
      recommendationZh: `发挥集体优势：${strengths.slice(0, 3).join('、')}。`,
      priority: 'medium'
    });
  }

  // Address challenges
  if (challenges.length > 0) {
    recommendations.push({
      area: 'Growth Areas',
      recommendation: `Create support structures for shared challenges: ${challenges.slice(0, 3).join(', ')}.`,
      recommendationZh: `为共同挑战创建支持结构：${challenges.slice(0, 3).join('、')}。`,
      priority: 'medium'
    });
  }

  // Overall compatibility
  if (compatibility < 60) {
    recommendations.push({
      area: 'Team Building',
      recommendation: 'Invest in team building activities to strengthen bonds.',
      recommendationZh: '投资团队建设活动以加强纽带。',
      priority: 'high'
    });
  }

  return recommendations;
}

// ==================== RENDERING ====================

/**
 * Render profile fusion as markdown
 */
export function renderProfileFusionMarkdown(
  fusion: ProfileFusion,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];
  const name = lang === 'zh' && fusion.nameZh ? fusion.nameZh : fusion.name;

  lines.push(`## ${name}`);
  lines.push('');
  lines.push(`### ${lang === 'zh' ? '个性特质' : 'Personality'}`);
  lines.push(fusion.personality.join(', '));
  lines.push('');
  lines.push(`### ${lang === 'zh' ? '工作风格' : 'Work Style'}`);
  lines.push(fusion.workStyle.join(', '));
  lines.push('');
  lines.push(`### ${lang === 'zh' ? '星座主题' : 'Constellation Themes'}`);
  lines.push(fusion.constellationThemes.join(', '));
  lines.push('');

  if (fusion.dominantArchetype) {
    lines.push(`### ${lang === 'zh' ? '主导原型' : 'Dominant Archetype'}`);
    lines.push(fusion.dominantArchetype);
    lines.push('');
  }

  if (fusion.fusionInsights.length > 0) {
    lines.push(`### ${lang === 'zh' ? '融合洞察' : 'Fusion Insights'}`);
    fusion.fusionInsights.forEach(insight => {
      const icon = insight.type === 'synergy' ? '✨' :
        insight.type === 'tension' ? '⚡' :
        insight.type === 'opportunity' ? '🌟' : '⚠️';
      const desc = lang === 'zh' && insight.descriptionZh ? insight.descriptionZh : insight.description;
      lines.push(`- ${icon} ${desc}`);
    });
    lines.push('');
  }

  lines.push(`### ${lang === 'zh' ? '兼容性分数' : 'Compatibility Scores'}`);
  Object.entries(fusion.compatibilityScores).forEach(([id, score]) => {
    lines.push(`- ${id}: ${score}/100`);
  });

  return lines.join('\n');
}

/**
 * Render team fusion as markdown
 */
export function renderTeamFusionMarkdown(
  team: TeamFusion,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '团队融合分析' : 'Team Fusion Analysis'}: ${team.teamId}`);
  lines.push('');
  lines.push(`${lang === 'zh' ? '整体兼容性' : 'Overall Compatibility'}: **${team.overallCompatibility}%**`);
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '集体主题' : 'Collective Themes'}`);
  lines.push(team.collectiveThemes.join(', '));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '团队优势' : 'Team Strengths'}`);
  team.teamStrengths.forEach(s => lines.push(`- ${s}`));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '团队挑战' : 'Team Challenges'}`);
  team.teamChallenges.forEach(c => lines.push(`- ${c}`));
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '团队动态' : 'Team Dynamics'}`);
  team.teamDynamics.forEach(d => {
    const desc = lang === 'zh' && d.descriptionZh ? d.descriptionZh : d.description;
    lines.push(`- [${d.type}] ${desc} (${d.score}/100)`);
  });
  lines.push('');

  lines.push(`## ${lang === 'zh' ? '建议' : 'Recommendations'}`);
  team.recommendations.forEach(r => {
    const rec = lang === 'zh' && r.recommendationZh ? r.recommendationZh : r.recommendation;
    lines.push(`### ${r.area} [${r.priority}]`);
    lines.push(rec);
    lines.push('');
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  fuseProfileAndConstellation,
  fuseProfilingAndConstellation,
  buildTeamFusion,
  renderProfileFusionMarkdown,
  renderTeamFusionMarkdown
};
