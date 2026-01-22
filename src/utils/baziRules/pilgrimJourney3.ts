/**
 * ============================================
 * PILGRIM JOURNEY 3.0
 * The Hypergraph-Aware, Generational, Mythic Journey
 *
 * Integrates:
 * - Classic Hero's Journey phases
 * - Mythos Hypergraph connections
 * - Generational inheritance patterns
 * - BaZi timing (luck pillars, annual pillars)
 * - Shadow work progression
 * - Gift activation tracking
 * - Ancestral debt/gift resolution
 *
 * The pilgrim walks through time, myth, and lineage.
 * ============================================
 */

import { GenerationalThread } from './generationalLadder';
import { HypergraphNode, HypergraphEdge } from './mythosHypergraph';

// ==================== DATA MODEL ====================

/**
 * The 12 stages of the Pilgrim Journey
 */
export type JourneyStage =
  | 'ordinary_world'      // 0: Before the call
  | 'call_to_adventure'   // 1: The catalyst
  | 'refusal_of_call'     // 2: Resistance
  | 'meeting_mentor'      // 3: Guidance appears
  | 'crossing_threshold'  // 4: Entering the unknown
  | 'tests_allies_enemies'// 5: The road of trials
  | 'approach_innermost'  // 6: Preparation for ordeal
  | 'ordeal'              // 7: Death and rebirth
  | 'reward'              // 8: Seizing the sword
  | 'road_back'           // 9: Return begins
  | 'resurrection'        // 10: Final test
  | 'return_with_elixir'; // 11: Mastery and integration

export const JOURNEY_STAGES: JourneyStage[] = [
  'ordinary_world',
  'call_to_adventure',
  'refusal_of_call',
  'meeting_mentor',
  'crossing_threshold',
  'tests_allies_enemies',
  'approach_innermost',
  'ordeal',
  'reward',
  'road_back',
  'resurrection',
  'return_with_elixir'
];

/**
 * Stage metadata
 */
export interface StageMetadata {
  stage: JourneyStage;
  index: number;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  archetypes: string[];
  shadows: string[];
  gifts: string[];
  ancestralThemes: string[];
}

/**
 * Full Journey state
 */
export interface PilgrimJourney3 {
  pilgrimId: string;
  currentStage: JourneyStage;
  stageProgress: number; // 0-100
  completedStages: JourneyStage[];

  // Hypergraph awareness
  activeNodes: HypergraphNode[];
  activeEdges: HypergraphEdge[];
  hypergraphPath: string[]; // Node IDs visited

  // Generational layer
  ancestralQuests: AncestralQuest[];
  inheritedPatterns: InheritedPattern[];
  generationalDebt: GenerationalDebt[];
  generationalGift: GenerationalGift[];

  // Shadow work
  identifiedShadows: Shadow[];
  integratedShadows: Shadow[];
  currentShadowWork?: Shadow;

  // Gift activation
  discoveredGifts: Gift[];
  activatedGifts: Gift[];
  currentGiftWork?: Gift;

  // Timing
  currentAge: number;
  ageAtStageStart: number;
  luckPillarInfluence?: string;
  annualInfluence?: string;

  // Quests and milestones
  activeQuests: Quest3[];
  completedQuests: Quest3[];
  milestones: Milestone3[];

  // Meta
  journeyScore: number;
  coherenceLevel: number;
  lastUpdated: Date;
}

export interface AncestralQuest {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  originGeneration: number;
  threadId: string;
  status: 'inherited' | 'active' | 'resolved' | 'passed_on';
  resolution?: string;
}

export interface InheritedPattern {
  id: string;
  name: string;
  nameZh: string;
  type: 'blessing' | 'curse' | 'task' | 'gift';
  source: string; // Generation or ancestor name
  generation: number;
  active: boolean;
  transformedInto?: string;
}

export interface GenerationalDebt {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  originGeneration: number;
  severity: number; // 1-10
  status: 'unacknowledged' | 'acknowledged' | 'working' | 'resolved';
  ritualRequired?: string;
}

export interface GenerationalGift {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  originGeneration: number;
  potency: number; // 1-10
  status: 'dormant' | 'awakening' | 'active' | 'mastered';
  activationPath?: string;
}

export interface Shadow {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  archetype: string;
  origin: 'personal' | 'ancestral' | 'collective';
  integrationProgress: number; // 0-100
  hypergraphNodeId?: string;
}

export interface Gift {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  archetype: string;
  origin: 'personal' | 'ancestral' | 'collective';
  activationProgress: number; // 0-100
  hypergraphNodeId?: string;
}

export interface Quest3 {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  stage: JourneyStage;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  status: 'available' | 'active' | 'completed' | 'failed';
  hypergraphConnections: string[];
  ancestralConnections: string[];
}

export interface QuestObjective {
  id: string;
  description: string;
  descriptionZh: string;
  completed: boolean;
  progress?: number;
}

export interface QuestReward {
  type: 'insight' | 'gift' | 'healing' | 'integration' | 'advancement';
  description: string;
  descriptionZh: string;
  value: number;
}

export interface Milestone3 {
  id: string;
  name: string;
  nameZh: string;
  stage: JourneyStage;
  achieved: boolean;
  achievedAt?: Date;
  ageAtAchievement?: number;
  significance: string;
  significanceZh: string;
}

// ==================== STAGE METADATA ====================

/**
 * Get metadata for all journey stages
 */
export function getStageMetadata(): StageMetadata[] {
  return [
    {
      stage: 'ordinary_world',
      index: 0,
      name: 'The Ordinary World',
      nameZh: '日常世界',
      description: 'Life before the call. The pilgrim exists within familiar patterns, often unaware of their deeper purpose.',
      descriptionZh: '召唤之前的生活。行者存在于熟悉的模式中，常常不知道自己更深的使命。',
      archetypes: ['orphan', 'innocent'],
      shadows: ['denial', 'complacency'],
      gifts: ['presence', 'grounding'],
      ancestralThemes: ['inheritance', 'tradition']
    },
    {
      stage: 'call_to_adventure',
      index: 1,
      name: 'The Call to Adventure',
      nameZh: '冒险的召唤',
      description: 'Something disrupts the ordinary. A crisis, dream, or encounter awakens the pilgrim to a larger destiny.',
      descriptionZh: '某事打破了日常。危机、梦境或相遇唤醒行者，使其意识到更大的命运。',
      archetypes: ['herald', 'seeker'],
      shadows: ['fear_of_change', 'deaf_ear'],
      gifts: ['sensitivity', 'receptivity'],
      ancestralThemes: ['calling', 'destiny']
    },
    {
      stage: 'refusal_of_call',
      index: 2,
      name: 'Refusal of the Call',
      nameZh: '拒绝召唤',
      description: 'The pilgrim hesitates, pulled between the known and unknown. Fear and doubt arise.',
      descriptionZh: '行者犹豫，在已知与未知之间徘徊。恐惧和怀疑升起。',
      archetypes: ['doubter', 'skeptic'],
      shadows: ['cowardice', 'self_sabotage'],
      gifts: ['discernment', 'healthy_doubt'],
      ancestralThemes: ['fear_patterns', 'failed_journeys']
    },
    {
      stage: 'meeting_mentor',
      index: 3,
      name: 'Meeting the Mentor',
      nameZh: '遇见导师',
      description: 'A guide appears - human, spirit, or inner voice. They offer wisdom, tools, or encouragement.',
      descriptionZh: '向导出现——人类、灵魂或内在声音。他们提供智慧、工具或鼓励。',
      archetypes: ['mentor', 'sage', 'magician'],
      shadows: ['guru_worship', 'dependency'],
      gifts: ['wisdom', 'teaching'],
      ancestralThemes: ['lineage_wisdom', 'ancestral_guides']
    },
    {
      stage: 'crossing_threshold',
      index: 4,
      name: 'Crossing the Threshold',
      nameZh: '跨越门槛',
      description: 'The pilgrim commits to the journey, leaving the ordinary world behind. There is no turning back.',
      descriptionZh: '行者承诺踏上旅程，离开日常世界。没有回头路。',
      archetypes: ['warrior', 'pioneer'],
      shadows: ['recklessness', 'burning_bridges'],
      gifts: ['courage', 'commitment'],
      ancestralThemes: ['threshold_guardians', 'family_breaks']
    },
    {
      stage: 'tests_allies_enemies',
      index: 5,
      name: 'Tests, Allies, Enemies',
      nameZh: '考验、盟友、敌人',
      description: 'The road of trials. The pilgrim faces challenges, discovers allies, and recognizes enemies.',
      descriptionZh: '试炼之路。行者面对挑战，发现盟友，识别敌人。',
      archetypes: ['warrior', 'lover', 'trickster'],
      shadows: ['paranoia', 'naivety'],
      gifts: ['discernment', 'alliance_building'],
      ancestralThemes: ['family_allies', 'inherited_enemies']
    },
    {
      stage: 'approach_innermost',
      index: 6,
      name: 'Approach to the Innermost Cave',
      nameZh: '接近最深的洞穴',
      description: 'Preparation for the greatest ordeal. The pilgrim gathers strength and faces their deepest fears.',
      descriptionZh: '为最大的考验做准备。行者积聚力量，面对最深的恐惧。',
      archetypes: ['orphan', 'seeker'],
      shadows: ['avoidance', 'procrastination'],
      gifts: ['preparation', 'inner_strength'],
      ancestralThemes: ['family_secrets', 'hidden_trauma']
    },
    {
      stage: 'ordeal',
      index: 7,
      name: 'The Ordeal',
      nameZh: '磨难',
      description: 'Death and rebirth. The pilgrim faces their greatest fear and undergoes transformation.',
      descriptionZh: '死亡与重生。行者面对最大的恐惧，经历蜕变。',
      archetypes: ['destroyer', 'creator'],
      shadows: ['victim', 'martyrdom'],
      gifts: ['surrender', 'rebirth'],
      ancestralThemes: ['ancestral_deaths', 'family_trauma']
    },
    {
      stage: 'reward',
      index: 8,
      name: 'The Reward',
      nameZh: '奖赏',
      description: 'Seizing the sword. The pilgrim claims their treasure - insight, power, or sacred object.',
      descriptionZh: '夺取神剑。行者获得他们的宝藏——洞见、力量或神圣物品。',
      archetypes: ['ruler', 'magician'],
      shadows: ['greed', 'pride'],
      gifts: ['self_knowledge', 'earned_power'],
      ancestralThemes: ['family_treasures', 'inherited_gifts']
    },
    {
      stage: 'road_back',
      index: 9,
      name: 'The Road Back',
      nameZh: '归途',
      description: 'The return journey begins. The pilgrim must bring the treasure back to the ordinary world.',
      descriptionZh: '返回的旅程开始。行者必须把宝藏带回日常世界。',
      archetypes: ['seeker', 'caregiver'],
      shadows: ['escapism', 'hoarding'],
      gifts: ['integration', 'responsibility'],
      ancestralThemes: ['return_to_roots', 'family_duty']
    },
    {
      stage: 'resurrection',
      index: 10,
      name: 'Resurrection',
      nameZh: '复活',
      description: 'The final test. The pilgrim must prove their transformation is real and lasting.',
      descriptionZh: '最终考验。行者必须证明他们的转变是真实而持久的。',
      archetypes: ['creator', 'sage'],
      shadows: ['regression', 'false_mastery'],
      gifts: ['mastery', 'embodiment'],
      ancestralThemes: ['breaking_cycles', 'new_beginning']
    },
    {
      stage: 'return_with_elixir',
      index: 11,
      name: 'Return with the Elixir',
      nameZh: '带着灵丹归来',
      description: 'The hero returns transformed, bringing healing and wisdom to their world and lineage.',
      descriptionZh: '英雄蜕变归来，为他们的世界和血脉带来疗愈与智慧。',
      archetypes: ['sage', 'ruler', 'caregiver'],
      shadows: ['isolation', 'superiority'],
      gifts: ['wisdom_sharing', 'lineage_healing'],
      ancestralThemes: ['ancestral_healing', 'legacy_creation']
    }
  ];
}

/**
 * Get metadata for a specific stage
 */
export function getStageInfo(stage: JourneyStage): StageMetadata {
  return getStageMetadata().find(s => s.stage === stage)!;
}

// ==================== JOURNEY ENGINE ====================

/**
 * Create a new Pilgrim Journey 3.0
 */
export function createPilgrimJourney3(
  pilgrimId: string,
  currentAge: number,
  threads?: GenerationalThread[],
  hypergraphNodes?: HypergraphNode[]
): PilgrimJourney3 {
  const journey: PilgrimJourney3 = {
    pilgrimId,
    currentStage: 'ordinary_world',
    stageProgress: 0,
    completedStages: [],
    activeNodes: hypergraphNodes || [],
    activeEdges: [],
    hypergraphPath: [],
    ancestralQuests: [],
    inheritedPatterns: [],
    generationalDebt: [],
    generationalGift: [],
    identifiedShadows: [],
    integratedShadows: [],
    discoveredGifts: [],
    activatedGifts: [],
    currentAge,
    ageAtStageStart: currentAge,
    activeQuests: [],
    completedQuests: [],
    milestones: createInitialMilestones(),
    journeyScore: 0,
    coherenceLevel: 0,
    lastUpdated: new Date()
  };

  // Initialize from generational threads
  if (threads) {
    journey.inheritedPatterns = mapThreadsToPatterns(threads);
    journey.ancestralQuests = mapThreadsToQuests(threads);
  }

  // Initialize from hypergraph
  if (hypergraphNodes) {
    journey.identifiedShadows = extractShadowsFromNodes(hypergraphNodes);
    journey.discoveredGifts = extractGiftsFromNodes(hypergraphNodes);
  }

  return journey;
}

/**
 * Create initial milestones
 */
function createInitialMilestones(): Milestone3[] {
  return JOURNEY_STAGES.map((stage, idx) => ({
    id: `milestone-${stage}`,
    name: getStageInfo(stage).name,
    nameZh: getStageInfo(stage).nameZh,
    stage,
    achieved: false,
    significance: `Complete the ${getStageInfo(stage).name} stage`,
    significanceZh: `完成「${getStageInfo(stage).nameZh}」阶段`
  }));
}

/**
 * Map generational threads to inherited patterns
 */
function mapThreadsToPatterns(threads: GenerationalThread[]): InheritedPattern[] {
  return threads.map((t, idx) => ({
    id: `pattern-${idx}`,
    name: t.theme,
    nameZh: t.theme, // Would be translated
    type: categorizeThreadAsPatternType(t),
    source: `Generation ${t.generations?.[0] || 0}`,
    generation: t.generations?.[0] || 0,
    active: true
  }));
}

/**
 * Categorize thread as pattern type
 */
function categorizeThreadAsPatternType(thread: GenerationalThread): InheritedPattern['type'] {
  const theme = thread.theme.toLowerCase();
  if (theme.includes('gift') || theme.includes('blessing') || theme.includes('talent')) return 'gift';
  if (theme.includes('curse') || theme.includes('trauma') || theme.includes('wound')) return 'curse';
  if (theme.includes('task') || theme.includes('duty') || theme.includes('mission')) return 'task';
  return 'blessing';
}

/**
 * Map generational threads to ancestral quests
 */
function mapThreadsToQuests(threads: GenerationalThread[]): AncestralQuest[] {
  return threads
    .filter(t => t.theme.toLowerCase().includes('unfinished') || t.theme.toLowerCase().includes('quest'))
    .map((t, idx) => ({
      id: `ancestral-quest-${idx}`,
      name: `The ${t.theme} Quest`,
      nameZh: `「${t.theme}」之旅`,
      description: `An ancestral pattern awaiting resolution.`,
      descriptionZh: `等待解决的祖先模式。`,
      originGeneration: t.generations?.[0] || 0,
      threadId: t.id,
      status: 'inherited' as const
    }));
}

/**
 * Extract shadows from hypergraph nodes
 */
function extractShadowsFromNodes(nodes: HypergraphNode[]): Shadow[] {
  return nodes
    .filter(n => n.type === 'shadow' || n.type === 'wound')
    .map(n => ({
      id: `shadow-${n.id}`,
      name: n.label,
      nameZh: n.label,
      description: `Shadow pattern from the hypergraph.`,
      descriptionZh: `来自超图的阴影模式。`,
      archetype: (n.data?.archetype as string) || 'unknown',
      origin: 'personal' as const,
      integrationProgress: 0,
      hypergraphNodeId: n.id
    }));
}

/**
 * Extract gifts from hypergraph nodes
 */
function extractGiftsFromNodes(nodes: HypergraphNode[]): Gift[] {
  return nodes
    .filter(n => n.type === 'gift' || n.type === 'blessing')
    .map(n => ({
      id: `gift-${n.id}`,
      name: n.label,
      nameZh: n.label,
      description: `Gift pattern from the hypergraph.`,
      descriptionZh: `来自超图的天赋模式。`,
      archetype: (n.data?.archetype as string) || 'unknown',
      origin: 'personal' as const,
      activationProgress: 0,
      hypergraphNodeId: n.id
    }));
}

// ==================== JOURNEY PROGRESSION ====================

/**
 * Advance journey to next stage
 */
export function advanceStage(journey: PilgrimJourney3): PilgrimJourney3 {
  const currentIndex = JOURNEY_STAGES.indexOf(journey.currentStage);

  if (currentIndex >= JOURNEY_STAGES.length - 1) {
    // Already at final stage
    return journey;
  }

  const nextStage = JOURNEY_STAGES[currentIndex + 1];

  // Mark current stage as completed
  const completedStages = [...journey.completedStages, journey.currentStage];

  // Update milestone
  const milestones = journey.milestones.map(m =>
    m.stage === journey.currentStage
      ? { ...m, achieved: true, achievedAt: new Date(), ageAtAchievement: journey.currentAge }
      : m
  );

  return {
    ...journey,
    currentStage: nextStage,
    stageProgress: 0,
    completedStages,
    ageAtStageStart: journey.currentAge,
    milestones,
    lastUpdated: new Date()
  };
}

/**
 * Update stage progress
 */
export function updateStageProgress(journey: PilgrimJourney3, progress: number): PilgrimJourney3 {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Auto-advance if progress reaches 100
  if (clampedProgress >= 100) {
    return advanceStage(journey);
  }

  return {
    ...journey,
    stageProgress: clampedProgress,
    lastUpdated: new Date()
  };
}

/**
 * Integrate a shadow
 */
export function integrateShadow(journey: PilgrimJourney3, shadowId: string): PilgrimJourney3 {
  const shadow = journey.identifiedShadows.find(s => s.id === shadowId);
  if (!shadow) return journey;

  const updatedShadow = { ...shadow, integrationProgress: 100 };

  return {
    ...journey,
    identifiedShadows: journey.identifiedShadows.filter(s => s.id !== shadowId),
    integratedShadows: [...journey.integratedShadows, updatedShadow],
    currentShadowWork: undefined,
    lastUpdated: new Date()
  };
}

/**
 * Activate a gift
 */
export function activateGift(journey: PilgrimJourney3, giftId: string): PilgrimJourney3 {
  const gift = journey.discoveredGifts.find(g => g.id === giftId);
  if (!gift) return journey;

  const updatedGift = { ...gift, activationProgress: 100 };

  return {
    ...journey,
    discoveredGifts: journey.discoveredGifts.filter(g => g.id !== giftId),
    activatedGifts: [...journey.activatedGifts, updatedGift],
    currentGiftWork: undefined,
    lastUpdated: new Date()
  };
}

/**
 * Complete a quest
 */
export function completeQuest(journey: PilgrimJourney3, questId: string): PilgrimJourney3 {
  const quest = journey.activeQuests.find(q => q.id === questId);
  if (!quest) return journey;

  const completedQuest = { ...quest, status: 'completed' as const };

  return {
    ...journey,
    activeQuests: journey.activeQuests.filter(q => q.id !== questId),
    completedQuests: [...journey.completedQuests, completedQuest],
    lastUpdated: new Date()
  };
}

/**
 * Resolve generational debt
 */
export function resolveGenerationalDebt(
  journey: PilgrimJourney3,
  debtId: string
): PilgrimJourney3 {
  return {
    ...journey,
    generationalDebt: journey.generationalDebt.map(d =>
      d.id === debtId ? { ...d, status: 'resolved' as const } : d
    ),
    lastUpdated: new Date()
  };
}

/**
 * Activate generational gift
 */
export function activateGenerationalGift(
  journey: PilgrimJourney3,
  giftId: string
): PilgrimJourney3 {
  return {
    ...journey,
    generationalGift: journey.generationalGift.map(g =>
      g.id === giftId ? { ...g, status: 'active' as const } : g
    ),
    lastUpdated: new Date()
  };
}

// ==================== JOURNEY SCORING ====================

/**
 * Calculate journey score
 */
export function calculateJourneyScore(journey: PilgrimJourney3): number {
  let score = 0;

  // Stage progression (40 points max)
  const stageProgress = (journey.completedStages.length / JOURNEY_STAGES.length) * 40;
  score += stageProgress;

  // Shadow integration (20 points max)
  const totalShadows = journey.identifiedShadows.length + journey.integratedShadows.length;
  if (totalShadows > 0) {
    score += (journey.integratedShadows.length / totalShadows) * 20;
  }

  // Gift activation (20 points max)
  const totalGifts = journey.discoveredGifts.length + journey.activatedGifts.length;
  if (totalGifts > 0) {
    score += (journey.activatedGifts.length / totalGifts) * 20;
  }

  // Quest completion (10 points max)
  const totalQuests = journey.activeQuests.length + journey.completedQuests.length;
  if (totalQuests > 0) {
    score += (journey.completedQuests.length / totalQuests) * 10;
  }

  // Generational work (10 points max)
  const debtResolved = journey.generationalDebt.filter(d => d.status === 'resolved').length;
  const giftActivated = journey.generationalGift.filter(g => g.status === 'active' || g.status === 'mastered').length;
  const totalGen = journey.generationalDebt.length + journey.generationalGift.length;
  if (totalGen > 0) {
    score += ((debtResolved + giftActivated) / totalGen) * 10;
  }

  return Math.round(score);
}

/**
 * Calculate coherence level
 */
export function calculateCoherenceLevel(journey: PilgrimJourney3): number {
  let coherence = 0;

  // Hypergraph connections
  if (journey.activeNodes.length > 0) coherence += 20;
  if (journey.hypergraphPath.length > 3) coherence += 10;

  // Ancestral connections
  if (journey.ancestralQuests.length > 0) coherence += 20;
  if (journey.inheritedPatterns.length > 0) coherence += 10;

  // Shadow-gift balance
  const shadowWork = journey.integratedShadows.length;
  const giftWork = journey.activatedGifts.length;
  if (shadowWork > 0 && giftWork > 0) coherence += 20;

  // Stage-appropriate work
  const stageInfo = getStageInfo(journey.currentStage);
  const relevantShadows = journey.identifiedShadows.filter(s =>
    stageInfo.shadows.some(ss => s.name.toLowerCase().includes(ss))
  );
  if (relevantShadows.length > 0) coherence += 20;

  return Math.min(100, coherence);
}

// ==================== RENDERING ====================

/**
 * Render journey as markdown
 */
export function renderPilgrimJourney3Markdown(
  journey: PilgrimJourney3,
  lang: 'en' | 'zh' = 'en'
): string {
  const lines: string[] = [];
  const stageInfo = getStageInfo(journey.currentStage);

  lines.push(`# ${lang === 'zh' ? '行者之旅 3.0' : 'Pilgrim Journey 3.0'}`);
  lines.push('');

  // Current stage
  lines.push(`## ${lang === 'zh' ? '当前阶段' : 'Current Stage'}`);
  lines.push(`**${lang === 'zh' ? stageInfo.nameZh : stageInfo.name}** (${journey.stageProgress}%)`);
  lines.push('');
  lines.push(lang === 'zh' ? stageInfo.descriptionZh : stageInfo.description);
  lines.push('');

  // Journey stats
  lines.push(`## ${lang === 'zh' ? '旅程统计' : 'Journey Stats'}`);
  lines.push(`- ${lang === 'zh' ? '旅程得分' : 'Journey Score'}: ${calculateJourneyScore(journey)}/100`);
  lines.push(`- ${lang === 'zh' ? '一致性水平' : 'Coherence Level'}: ${calculateCoherenceLevel(journey)}%`);
  lines.push(`- ${lang === 'zh' ? '完成阶段' : 'Completed Stages'}: ${journey.completedStages.length}/${JOURNEY_STAGES.length}`);
  lines.push('');

  // Shadow work
  if (journey.identifiedShadows.length > 0 || journey.integratedShadows.length > 0) {
    lines.push(`## ${lang === 'zh' ? '阴影工作' : 'Shadow Work'}`);
    lines.push(`- ${lang === 'zh' ? '已识别' : 'Identified'}: ${journey.identifiedShadows.length}`);
    lines.push(`- ${lang === 'zh' ? '已整合' : 'Integrated'}: ${journey.integratedShadows.length}`);
    lines.push('');
  }

  // Gift activation
  if (journey.discoveredGifts.length > 0 || journey.activatedGifts.length > 0) {
    lines.push(`## ${lang === 'zh' ? '天赋激活' : 'Gift Activation'}`);
    lines.push(`- ${lang === 'zh' ? '已发现' : 'Discovered'}: ${journey.discoveredGifts.length}`);
    lines.push(`- ${lang === 'zh' ? '已激活' : 'Activated'}: ${journey.activatedGifts.length}`);
    lines.push('');
  }

  // Generational work
  if (journey.generationalDebt.length > 0 || journey.generationalGift.length > 0) {
    lines.push(`## ${lang === 'zh' ? '代际工作' : 'Generational Work'}`);
    const debtResolved = journey.generationalDebt.filter(d => d.status === 'resolved').length;
    const giftActive = journey.generationalGift.filter(g => g.status === 'active').length;
    lines.push(`- ${lang === 'zh' ? '债务已解决' : 'Debts Resolved'}: ${debtResolved}/${journey.generationalDebt.length}`);
    lines.push(`- ${lang === 'zh' ? '天赋已激活' : 'Gifts Activated'}: ${giftActive}/${journey.generationalGift.length}`);
    lines.push('');
  }

  // Active quests
  if (journey.activeQuests.length > 0) {
    lines.push(`## ${lang === 'zh' ? '活跃任务' : 'Active Quests'}`);
    journey.activeQuests.forEach(q => {
      lines.push(`- **${lang === 'zh' ? q.nameZh : q.name}**`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  createPilgrimJourney3,
  advanceStage,
  updateStageProgress,
  integrateShadow,
  activateGift,
  completeQuest,
  resolveGenerationalDebt,
  activateGenerationalGift,
  calculateJourneyScore,
  calculateCoherenceLevel,
  getStageMetadata,
  getStageInfo,
  renderPilgrimJourney3Markdown
};
