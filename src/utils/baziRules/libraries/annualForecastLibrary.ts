/**
 * ============================================
 * ANNUAL FORECAST INTERPRETATION LIBRARY
 * Complete Scripture for Yearly Influences
 *
 * Provides interpretations for:
 * - Incoming year element interactions
 * - Annual branch relationships
 * - Seasonal timing within the year
 * - Monthly emphasis patterns
 * ============================================
 */

// ==================== TYPES ====================

export interface AnnualElementInteraction {
  incomingElement: string;
  incomingElementZh: string;
  natalElement: string;
  natalElementZh: string;
  relationship: 'produces' | 'controls' | 'drains' | 'weakens' | 'same';
  overview: string;
  overviewZh: string;
  opportunities: string;
  opportunitiesZh: string;
  challenges: string;
  challengesZh: string;
  advice: string;
  adviceZh: string;
}

export interface AnnualBranchRelationship {
  relationshipType: 'clash' | 'punishment' | 'harm' | 'destruction' | 'combination' | 'triple' | 'neutral';
  relationshipTypeZh: string;
  incomingBranch: string;
  natalBranch: string;
  overview: string;
  overviewZh: string;
  lifeAreas: string[];
  lifeAreasZh: string[];
  remedies: string;
  remediesZh: string;
  timing: string;
  timingZh: string;
}

export interface MonthlyEmphasis {
  month: number;
  monthName: string;
  monthNameZh: string;
  element: string;
  elementZh: string;
  branch: string;
  branchZh: string;
  themes: string;
  themesZh: string;
  opportunities: string;
  opportunitiesZh: string;
  cautions: string;
  cautionsZh: string;
}

export interface AnnualForecast {
  year: number;
  stem: string;
  stemZh: string;
  branch: string;
  branchZh: string;
  animal: string;
  animalZh: string;
  element: string;
  elementZh: string;
  polarity: 'Yang' | 'Yin';
  yearTheme: string;
  yearThemeZh: string;
  generalOutlook: string;
  generalOutlookZh: string;
  careerOutlook: string;
  careerOutlookZh: string;
  relationshipOutlook: string;
  relationshipOutlookZh: string;
  healthOutlook: string;
  healthOutlookZh: string;
  wealthOutlook: string;
  wealthOutlookZh: string;
}

// ==================== ELEMENT INTERACTIONS ====================

export const ELEMENT_INTERACTION_LIBRARY: AnnualElementInteraction[] = [
  // Wood incoming
  {
    incomingElement: 'Wood', incomingElementZh: '木',
    natalElement: 'Wood', natalElementZh: '木',
    relationship: 'same',
    overview: 'The incoming Wood energy resonates with your natal Wood, amplifying growth themes.',
    overviewZh: '流年木能量与你的本命木共鸣，放大成长主题。',
    opportunities: 'Enhanced creativity, learning opportunities, family harmony, new beginnings.',
    opportunitiesZh: '增强创造力、学习机会、家庭和谐、新开始。',
    challenges: 'Potential for scattered energy, overcommitment, impatience with growth process.',
    challengesZh: '可能能量分散、过度承诺、对成长过程缺乏耐心。',
    advice: 'Channel the abundant Wood energy into focused projects. Quality over quantity in new ventures.',
    adviceZh: '将充沛的木能量引导到专注的项目中。新事业中注重质量而非数量。'
  },
  {
    incomingElement: 'Wood', incomingElementZh: '木',
    natalElement: 'Fire', natalElementZh: '火',
    relationship: 'produces',
    overview: 'Incoming Wood feeds your Fire, bringing fuel for passion and visibility.',
    overviewZh: '流年木生助你的火，为热情和可见度带来燃料。',
    opportunities: 'Increased visibility, creative projects gain momentum, passionate pursuits flourish.',
    opportunitiesZh: '增加可见度、创意项目获得动力、热情追求蓬勃发展。',
    challenges: 'Risk of burnout if Fire is overfueled, need to manage energy sustainably.',
    challengesZh: '如果火能量过旺可能倦怠，需要可持续地管理能量。',
    advice: 'Accept the support gracefully but pace yourself. Sustainable brilliance beats spectacular burnout.',
    adviceZh: '优雅地接受支持但要控制节奏。可持续的光彩胜过壮观的倦怠。'
  },
  {
    incomingElement: 'Wood', incomingElementZh: '木',
    natalElement: 'Earth', natalElementZh: '土',
    relationship: 'controls',
    overview: 'Incoming Wood challenges your Earth stability, creating productive tension.',
    overviewZh: '流年木挑战你的土稳定性，创造有益的张力。',
    opportunities: 'Growth through challenge, breaking stagnation, creative disruption of routines.',
    opportunitiesZh: '通过挑战成长、打破停滞、创造性地打破常规。',
    challenges: 'Stability may be tested, foundations challenged, need for flexibility.',
    challengesZh: '稳定性可能受到考验、基础被挑战、需要灵活性。',
    advice: 'Embrace necessary changes while protecting core foundations. Flexibility is strength.',
    adviceZh: '在保护核心基础的同时拥抱必要的变化。灵活就是力量。'
  },
  {
    incomingElement: 'Wood', incomingElementZh: '木',
    natalElement: 'Metal', natalElementZh: '金',
    relationship: 'weakens',
    overview: 'Your Metal must work to control the incoming Wood, requiring decisive action.',
    overviewZh: '你的金必须努力控制流年木，需要果断行动。',
    opportunities: 'Opportunity to refine and shape new growth, decisive leadership moments.',
    opportunitiesZh: '精炼和塑造新成长的机会、果断领导的时刻。',
    challenges: 'Energy expenditure in maintaining control, potential for over-cutting or rigidity.',
    challengesZh: '维持控制需要消耗能量、可能过度切割或僵化。',
    advice: 'Use precision wisely - not all growth needs cutting. Choose battles carefully.',
    adviceZh: '明智地使用精确——不是所有成长都需要切割。谨慎选择战斗。'
  },
  {
    incomingElement: 'Wood', incomingElementZh: '木',
    natalElement: 'Water', natalElementZh: '水',
    relationship: 'drains',
    overview: 'Incoming Wood draws from your Water wisdom, using your resources for growth.',
    overviewZh: '流年木从你的水智慧中汲取，用你的资源促进成长。',
    opportunities: 'Your wisdom fuels meaningful growth, mentoring opportunities, legacy building.',
    opportunitiesZh: '你的智慧推动有意义的成长、指导机会、建立遗产。',
    challenges: 'Potential for depletion if giving too much, need to replenish resources.',
    challengesZh: '如果给予太多可能耗尽、需要补充资源。',
    advice: 'Give wisely and ensure you replenish. Your wisdom is valuable - share it strategically.',
    adviceZh: '明智地给予并确保补充。你的智慧很宝贵——战略性地分享。'
  },

  // Fire incoming
  {
    incomingElement: 'Fire', incomingElementZh: '火',
    natalElement: 'Fire', natalElementZh: '火',
    relationship: 'same',
    overview: 'Double Fire energy brings maximum visibility and passion to the year.',
    overviewZh: '双火能量为这一年带来最大的可见度和热情。',
    opportunities: 'Peak visibility, recognition potential, passionate achievements, social expansion.',
    opportunitiesZh: '巅峰可见度、认可潜力、热情成就、社交扩展。',
    challenges: 'Risk of excess heat, burnout, conflict, or inflammatory situations.',
    challengesZh: '过热风险、倦怠、冲突或炎症性情况。',
    advice: 'Shine brightly but manage intensity. Build in cooling activities and rest periods.',
    adviceZh: '明亮闪耀但管理强度。安排冷却活动和休息时间。'
  },
  {
    incomingElement: 'Fire', incomingElementZh: '火',
    natalElement: 'Earth', natalElementZh: '土',
    relationship: 'produces',
    overview: 'Incoming Fire warms and strengthens your Earth, building lasting foundations.',
    overviewZh: '流年火温暖并加强你的土，建立持久基础。',
    opportunities: 'Strengthened stability, energized foundations, passionate commitment.',
    opportunitiesZh: '加强稳定性、能量充沛的基础、热情承诺。',
    challenges: 'Too much Fire can bake Earth hard, potentially creating rigidity.',
    challengesZh: '过多的火可能将土烤硬，可能造成僵化。',
    advice: 'Accept the warmth and use it to solidify goals. Stay open despite increased stability.',
    adviceZh: '接受温暖并用它巩固目标。尽管稳定性增加也要保持开放。'
  },
  {
    incomingElement: 'Fire', incomingElementZh: '火',
    natalElement: 'Metal', natalElementZh: '金',
    relationship: 'controls',
    overview: 'Incoming Fire refines your Metal through challenge, testing your structures.',
    overviewZh: '流年火通过挑战精炼你的金，考验你的结构。',
    opportunities: 'Refinement through pressure, testing that proves quality, forged strength.',
    opportunitiesZh: '通过压力精炼、证明质量的考验、锻造力量。',
    challenges: 'Structures may melt under pressure, decisions tested, potential for loss.',
    challengesZh: '结构可能在压力下融化、决策受到考验、可能有损失。',
    advice: 'Welcome the refining fire - what survives will be stronger. Release what melts away.',
    adviceZh: '欢迎精炼之火——幸存的将更强大。释放融化的东西。'
  },
  {
    incomingElement: 'Fire', incomingElementZh: '火',
    natalElement: 'Water', natalElementZh: '水',
    relationship: 'weakens',
    overview: 'Your Water works to control Fire, requiring wisdom to manage intensity.',
    overviewZh: '你的水努力控制火，需要智慧来管理强度。',
    opportunities: 'Wisdom moderating passion, depth balancing visibility, strategic cooling.',
    opportunitiesZh: '智慧调节热情、深度平衡可见度、战略冷却。',
    challenges: 'Energy spent managing fire, potential steam conflicts, exhausting control efforts.',
    challengesZh: '花费能量管理火、可能的蒸汽冲突、疲惫的控制努力。',
    advice: 'Use wisdom strategically - not all fires need quenching. Some just need containing.',
    adviceZh: '战略性地使用智慧——不是所有的火都需要熄灭。有些只需要控制。'
  },
  {
    incomingElement: 'Fire', incomingElementZh: '火',
    natalElement: 'Wood', natalElementZh: '木',
    relationship: 'drains',
    overview: 'Incoming Fire draws from your Wood, using your creativity as fuel.',
    overviewZh: '流年火从你的木中汲取，用你的创造力作为燃料。',
    opportunities: 'Creative expressions gain visibility, growth efforts recognized, warmth from giving.',
    opportunitiesZh: '创意表达获得可见度、成长努力被认可、给予带来温暖。',
    challenges: 'Potential creative depletion, need to regenerate growth energy.',
    challengesZh: '可能创造力耗尽、需要重新生成成长能量。',
    advice: 'Share your creative fire but maintain regeneration practices. Rest in nature.',
    adviceZh: '分享你的创意火焰但保持再生实践。在自然中休息。'
  },

  // Earth incoming
  {
    incomingElement: 'Earth', incomingElementZh: '土',
    natalElement: 'Earth', natalElementZh: '土',
    relationship: 'same',
    overview: 'Double Earth brings maximum stability but requires watching for stagnation.',
    overviewZh: '双土带来最大稳定性但需要注意停滞。',
    opportunities: 'Peak stability, foundation building, commitment opportunities, lasting structures.',
    opportunitiesZh: '巅峰稳定性、基础建设、承诺机会、持久结构。',
    challenges: 'Risk of stagnation, over-responsibility, worry, or being stuck.',
    challengesZh: '停滞风险、过度责任、担忧或被困。',
    advice: 'Use stability to build while keeping energy moving. Avoid becoming too fixed.',
    adviceZh: '利用稳定性来建设同时保持能量流动。避免变得过于固定。'
  },
  {
    incomingElement: 'Earth', incomingElementZh: '土',
    natalElement: 'Metal', natalElementZh: '金',
    relationship: 'produces',
    overview: 'Incoming Earth nourishes your Metal, supporting precision and refinement.',
    overviewZh: '流年土滋养你的金，支持精确和精炼。',
    opportunities: 'Enhanced discernment, supported structure, nurtured precision.',
    opportunitiesZh: '增强辨别力、支持的结构、滋养的精确。',
    challenges: 'May become over-refined or rigid with too much support.',
    challengesZh: '过多支持可能变得过度精炼或僵化。',
    advice: 'Accept the support gracefully. Use stability to polish your best qualities.',
    adviceZh: '优雅地接受支持。利用稳定性打磨你最好的品质。'
  },
  {
    incomingElement: 'Earth', incomingElementZh: '土',
    natalElement: 'Water', natalElementZh: '水',
    relationship: 'controls',
    overview: 'Incoming Earth dams your Water flow, creating containment challenges.',
    overviewZh: '流年土阻挡你的水流，创造围堵挑战。',
    opportunities: 'Focused wisdom, channeled flow, depth through containment.',
    opportunitiesZh: '专注智慧、引导流动、通过围堵获得深度。',
    challenges: 'Flow may be blocked, wisdom contained, potential frustration.',
    challengesZh: '流动可能被阻断、智慧被围堵、可能有挫折。',
    advice: 'Work with the containment - sometimes depth comes from restriction. Find new channels.',
    adviceZh: '与围堵合作——有时深度来自限制。找到新的渠道。'
  },
  {
    incomingElement: 'Earth', incomingElementZh: '土',
    natalElement: 'Wood', natalElementZh: '木',
    relationship: 'weakens',
    overview: 'Your Wood must work to break through Earth, requiring growth effort.',
    overviewZh: '你的木必须努力突破土，需要成长努力。',
    opportunities: 'Rooted growth, grounded creativity, stable expansion.',
    opportunitiesZh: '扎根成长、接地创造力、稳定扩展。',
    challenges: 'Growth may feel slow, creativity needs grounding, potential frustration.',
    challengesZh: '成长可能感觉缓慢、创造力需要接地、可能有挫折。',
    advice: 'Root deeply before reaching high. Stable growth is sustainable growth.',
    adviceZh: '向高处伸展前先深深扎根。稳定的成长是可持续的成长。'
  },
  {
    incomingElement: 'Earth', incomingElementZh: '土',
    natalElement: 'Fire', natalElementZh: '火',
    relationship: 'drains',
    overview: 'Incoming Earth draws from your Fire, grounding your passion.',
    overviewZh: '流年土从你的火中汲取，使你的热情接地。',
    opportunities: 'Passion becomes productive, visibility gains substance, lasting impact.',
    opportunitiesZh: '热情变得有成效、可见度获得实质、持久影响。',
    challenges: 'Fire may feel dampened, need to maintain warmth while grounding.',
    challengesZh: '火可能感觉被抑制、需要在接地的同时保持温暖。',
    advice: 'Let Earth give your passion form and substance. Grounded fire builds lasting warmth.',
    adviceZh: '让土给你的热情形式和实质。接地的火建立持久温暖。'
  },

  // Metal incoming
  {
    incomingElement: 'Metal', incomingElementZh: '金',
    natalElement: 'Metal', natalElementZh: '金',
    relationship: 'same',
    overview: 'Double Metal brings maximum precision and decisiveness to the year.',
    overviewZh: '双金为这一年带来最大的精确和果断。',
    opportunities: 'Peak discernment, maximum precision, decisive achievement, refined output.',
    opportunitiesZh: '巅峰辨别力、最大精确、果断成就、精炼产出。',
    challenges: 'Risk of over-cutting, excessive judgment, or harsh decisions.',
    challengesZh: '过度切割风险、过度判断或严厉决定。',
    advice: 'Use precision wisely. Not everything needs cutting - sometimes appreciation is better.',
    adviceZh: '明智地使用精确。不是所有东西都需要切割——有时欣赏更好。'
  },
  {
    incomingElement: 'Metal', incomingElementZh: '金',
    natalElement: 'Water', natalElementZh: '水',
    relationship: 'produces',
    overview: 'Incoming Metal enriches your Water, adding clarity to wisdom.',
    overviewZh: '流年金丰富你的水，为智慧增添清晰。',
    opportunities: 'Clearer thinking, refined wisdom, precise communication, quality insights.',
    opportunitiesZh: '更清晰的思维、精炼智慧、精确沟通、高质量洞察。',
    challenges: 'Wisdom may become too analytical, losing intuitive flow.',
    challengesZh: '智慧可能变得过于分析性、失去直觉流动。',
    advice: 'Accept the clarity while maintaining intuitive depth. Balance analysis with flow.',
    adviceZh: '接受清晰同时保持直觉深度。平衡分析与流动。'
  },
  {
    incomingElement: 'Metal', incomingElementZh: '金',
    natalElement: 'Wood', natalElementZh: '木',
    relationship: 'controls',
    overview: 'Incoming Metal prunes your Wood, cutting back growth for quality.',
    overviewZh: '流年金修剪你的木，为质量削减成长。',
    opportunities: 'Refined growth, quality over quantity, focused creativity, purposeful pruning.',
    opportunitiesZh: '精炼成长、质量优于数量、专注创造力、有目的的修剪。',
    challenges: 'Growth may feel restricted, creativity pruned, potential for cutting too deep.',
    challengesZh: '成长可能感觉受限、创造力被修剪、可能切割太深。',
    advice: 'Welcome necessary pruning - it creates stronger growth. Trust the refinement process.',
    adviceZh: '欢迎必要的修剪——它创造更强的成长。相信精炼过程。'
  },
  {
    incomingElement: 'Metal', incomingElementZh: '金',
    natalElement: 'Fire', natalElementZh: '火',
    relationship: 'weakens',
    overview: 'Your Fire must work to melt Metal, requiring passionate effort.',
    overviewZh: '你的火必须努力熔化金，需要热情努力。',
    opportunities: 'Refining structures through passion, melting rigidity, transformative fire.',
    opportunitiesZh: '通过热情精炼结构、熔化僵化、变革之火。',
    challenges: 'Energy spent melting resistance, potential for conflict with structures.',
    challengesZh: '花费能量熔化阻力、可能与结构冲突。',
    advice: 'Use your warmth strategically - some Metal becomes beautiful when gently warmed.',
    adviceZh: '战略性地使用你的温暖——有些金在温和加热时变得美丽。'
  },
  {
    incomingElement: 'Metal', incomingElementZh: '金',
    natalElement: 'Earth', natalElementZh: '土',
    relationship: 'drains',
    overview: 'Incoming Metal draws from your Earth, refining your stability.',
    overviewZh: '流年金从你的土中汲取，精炼你的稳定性。',
    opportunities: 'Stability produces quality, grounded precision, refined foundations.',
    opportunitiesZh: '稳定性产生质量、接地精确、精炼基础。',
    challenges: 'Earth may feel depleted, foundations used for production.',
    challengesZh: '土可能感觉耗尽、基础用于生产。',
    advice: 'Support quality output while maintaining core stability. Replenish as you produce.',
    adviceZh: '支持质量产出同时保持核心稳定性。在生产的同时补充。'
  },

  // Water incoming
  {
    incomingElement: 'Water', incomingElementZh: '水',
    natalElement: 'Water', natalElementZh: '水',
    relationship: 'same',
    overview: 'Double Water brings maximum flow and wisdom to the year.',
    overviewZh: '双水为这一年带来最大的流动和智慧。',
    opportunities: 'Peak wisdom, maximum networking, deep insights, flowing opportunities.',
    opportunitiesZh: '巅峰智慧、最大社交网络、深度洞察、流动机会。',
    challenges: 'Risk of overthinking, anxiety, lack of grounding, or emotional flooding.',
    challengesZh: '过度思考风险、焦虑、缺乏接地或情绪泛滥。',
    advice: 'Flow with wisdom while maintaining some grounding. Deep waters need stable banks.',
    adviceZh: '用智慧流动同时保持一些接地。深水需要稳定的河岸。'
  },
  {
    incomingElement: 'Water', incomingElementZh: '水',
    natalElement: 'Wood', natalElementZh: '木',
    relationship: 'produces',
    overview: 'Incoming Water nourishes your Wood, supporting growth and creativity.',
    overviewZh: '流年水滋养你的木，支持成长和创造力。',
    opportunities: 'Enhanced creativity, supported growth, nourished projects, learning expansion.',
    opportunitiesZh: '增强创造力、支持的成长、滋养的项目、学习扩展。',
    challenges: 'May become over-watered, creating weak growth or scattered energy.',
    challengesZh: '可能被过度浇灌、创造弱成长或分散能量。',
    advice: 'Accept the nourishment but maintain focus. Too much water drowns the seed.',
    adviceZh: '接受滋养但保持专注。太多水会淹没种子。'
  },
  {
    incomingElement: 'Water', incomingElementZh: '水',
    natalElement: 'Fire', natalElementZh: '火',
    relationship: 'controls',
    overview: 'Incoming Water challenges your Fire, testing passion with wisdom.',
    overviewZh: '流年水挑战你的火，用智慧考验热情。',
    opportunities: 'Wisdom moderating passion, depth balancing visibility, sustainable warmth.',
    opportunitiesZh: '智慧调节热情、深度平衡可见度、可持续温暖。',
    challenges: 'Fire may feel dampened, visibility challenged, passion cooled.',
    challengesZh: '火可能感觉被抑制、可见度受到挑战、热情冷却。',
    advice: 'Let wisdom inform passion rather than extinguish it. Steam can be powerful.',
    adviceZh: '让智慧引导热情而不是熄灭它。蒸汽可以很强大。'
  },
  {
    incomingElement: 'Water', incomingElementZh: '水',
    natalElement: 'Earth', natalElementZh: '土',
    relationship: 'weakens',
    overview: 'Your Earth must work to contain Water, requiring structural effort.',
    overviewZh: '你的土必须努力围堵水，需要结构性努力。',
    opportunities: 'Channeling flow productively, building banks for wisdom, structured depth.',
    opportunitiesZh: '有效引导流动、为智慧建设河岸、结构化深度。',
    challenges: 'Energy spent containing flow, potential erosion, structural challenges.',
    challengesZh: '花费能量围堵流动、可能的侵蚀、结构挑战。',
    advice: 'Build smart channels rather than rigid dams. Work with the flow.',
    adviceZh: '建造聪明的渠道而不是僵硬的大坝。与流动合作。'
  },
  {
    incomingElement: 'Water', incomingElementZh: '水',
    natalElement: 'Metal', natalElementZh: '金',
    relationship: 'drains',
    overview: 'Incoming Water draws from your Metal, flowing from your precision.',
    overviewZh: '流年水从你的金中汲取，从你的精确中流出。',
    opportunities: 'Precision produces wisdom, structured flow, quality communications.',
    opportunitiesZh: '精确产生智慧、结构化流动、高质量沟通。',
    challenges: 'Metal may feel depleted, precision used up in production.',
    challengesZh: '金可能感觉耗尽、精确在生产中用尽。',
    advice: 'Let your precision create wisdom while maintaining core structure.',
    adviceZh: '让你的精确创造智慧同时保持核心结构。'
  }
];

// ==================== BRANCH RELATIONSHIPS ====================

export const BRANCH_RELATIONSHIP_LIBRARY: AnnualBranchRelationship[] = [
  // Clashes (六冲)
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Zi',
    natalBranch: 'Wu',
    overview: 'Rat-Horse clash brings tension between hidden depths and public visibility.',
    overviewZh: '子午冲带来隐藏深度与公开可见度之间的张力。',
    lifeAreas: ['Career changes', 'Travel', 'Relationship shifts', 'Health attention'],
    lifeAreasZh: ['事业变化', '旅行', '关系转变', '健康关注'],
    remedies: 'Use Ox or Tiger energy as bridge. Focus on Earth activities for grounding.',
    remediesZh: '使用牛或虎能量作为桥梁。专注于土活动以接地。',
    timing: 'Peaks in the 6th and 12th months. Be cautious during these periods.',
    timingZh: '在第6和第12个月达到高峰。在这些时期要谨慎。'
  },
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Chou',
    natalBranch: 'Wei',
    overview: 'Ox-Goat clash creates tension between patient storage and creative expression.',
    overviewZh: '丑未冲在耐心储存和创意表达之间创造张力。',
    lifeAreas: ['Financial matters', 'Family dynamics', 'Health digestion', 'Property issues'],
    lifeAreasZh: ['财务事项', '家庭动态', '消化健康', '房产问题'],
    remedies: 'Use Rat or Horse energy as bridge. Focus on communication and movement.',
    remediesZh: '使用鼠或马能量作为桥梁。专注于沟通和运动。',
    timing: 'Peaks in the 7th and 1st months. Handle property and family matters carefully.',
    timingZh: '在第7和第1个月达到高峰。谨慎处理房产和家庭事务。'
  },
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Yin',
    natalBranch: 'Shen',
    overview: 'Tiger-Monkey clash brings tension between bold growth and clever adaptation.',
    overviewZh: '寅申冲带来大胆成长与聪明适应之间的张力。',
    lifeAreas: ['Career competition', 'Travel disruption', 'Legal matters', 'Technology challenges'],
    lifeAreasZh: ['事业竞争', '旅行中断', '法律事务', '技术挑战'],
    remedies: 'Use Pig or Snake energy as bridge. Focus on Water activities for flow.',
    remediesZh: '使用猪或蛇能量作为桥梁。专注于水活动以流动。',
    timing: 'Peaks in the 3rd and 9th months. Be strategic in these periods.',
    timingZh: '在第3和第9个月达到高峰。在这些时期要有策略。'
  },
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Mao',
    natalBranch: 'You',
    overview: 'Rabbit-Rooster clash creates tension between gentle diplomacy and sharp precision.',
    overviewZh: '卯酉冲在温和外交与锐利精确之间创造张力。',
    lifeAreas: ['Relationships', 'Artistic matters', 'Negotiations', 'Health liver/lungs'],
    lifeAreasZh: ['关系', '艺术事务', '谈判', '肝/肺健康'],
    remedies: 'Use Dragon or Dog energy as bridge. Focus on Earth activities for stability.',
    remediesZh: '使用龙或狗能量作为桥梁。专注于土活动以稳定。',
    timing: 'Peaks in the 4th and 10th months. Handle relationships carefully.',
    timingZh: '在第4和第10个月达到高峰。谨慎处理关系。'
  },
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Chen',
    natalBranch: 'Xu',
    overview: 'Dragon-Dog clash brings tension between ambitious transformation and loyal protection.',
    overviewZh: '辰戌冲带来雄心转变与忠诚保护之间的张力。',
    lifeAreas: ['Major changes', 'Property matters', 'Spiritual growth', 'Relationship loyalty'],
    lifeAreasZh: ['重大变化', '房产事务', '精神成长', '关系忠诚'],
    remedies: 'Use Rooster or Rabbit energy as bridge. Focus on Metal activities for clarity.',
    remediesZh: '使用鸡或兔能量作为桥梁。专注于金活动以清晰。',
    timing: 'Peaks in the 5th and 11th months. Handle transformations mindfully.',
    timingZh: '在第5和第11个月达到高峰。谨慎处理转变。'
  },
  {
    relationshipType: 'clash',
    relationshipTypeZh: '冲',
    incomingBranch: 'Si',
    natalBranch: 'Hai',
    overview: 'Snake-Pig clash creates tension between strategic wisdom and contented flow.',
    overviewZh: '巳亥冲在战略智慧与满足流动之间创造张力。',
    lifeAreas: ['Travel changes', 'Career shifts', 'Health attention', 'Relationship transformations'],
    lifeAreasZh: ['旅行变化', '事业转变', '健康关注', '关系转变'],
    remedies: 'Use Tiger or Monkey energy as bridge. Focus on Wood activities for growth.',
    remediesZh: '使用虎或猴能量作为桥梁。专注于木活动以成长。',
    timing: 'Peaks in the 6th and 12th months. Handle travel and transitions carefully.',
    timingZh: '在第6和第12个月达到高峰。谨慎处理旅行和过渡。'
  },

  // Combinations (六合)
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Zi',
    natalBranch: 'Chou',
    overview: 'Rat-Ox combination creates harmonious Earth energy, bringing stability and grounding.',
    overviewZh: '子丑合创造和谐的土能量，带来稳定和接地。',
    lifeAreas: ['Career stability', 'Relationship commitment', 'Financial grounding', 'Health foundations'],
    lifeAreasZh: ['事业稳定', '关系承诺', '财务接地', '健康基础'],
    remedies: 'Embrace the stability energy. Good time for long-term commitments.',
    remediesZh: '拥抱稳定能量。是长期承诺的好时机。',
    timing: 'Active throughout the year. Particularly strong in Earth months.',
    timingZh: '全年活跃。在土月份特别强。'
  },
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Yin',
    natalBranch: 'Hai',
    overview: 'Tiger-Pig combination creates harmonious Wood energy, enhancing growth and creativity.',
    overviewZh: '寅亥合创造和谐的木能量，增强成长和创造力。',
    lifeAreas: ['Creative projects', 'Learning growth', 'Family harmony', 'New ventures'],
    lifeAreasZh: ['创意项目', '学习成长', '家庭和谐', '新事业'],
    remedies: 'Channel the growth energy into meaningful projects. Excellent for education.',
    remediesZh: '将成长能量引导到有意义的项目中。非常适合教育。',
    timing: 'Active throughout the year. Particularly strong in Wood months.',
    timingZh: '全年活跃。在木月份特别强。'
  },
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Mao',
    natalBranch: 'Xu',
    overview: 'Rabbit-Dog combination creates harmonious Fire energy, warming relationships and visibility.',
    overviewZh: '卯戌合创造和谐的火能量，温暖关系和可见度。',
    lifeAreas: ['Relationship warmth', 'Social expansion', 'Creative recognition', 'Passionate pursuits'],
    lifeAreasZh: ['关系温暖', '社交扩展', '创意认可', '热情追求'],
    remedies: 'Express warmth openly. Good time for social and romantic pursuits.',
    remediesZh: '公开表达温暖。是社交和浪漫追求的好时机。',
    timing: 'Active throughout the year. Particularly strong in Fire months.',
    timingZh: '全年活跃。在火月份特别强。'
  },
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Chen',
    natalBranch: 'You',
    overview: 'Dragon-Rooster combination creates harmonious Metal energy, enhancing precision and wealth.',
    overviewZh: '辰酉合创造和谐的金能量，增强精确和财富。',
    lifeAreas: ['Financial success', 'Career precision', 'Quality achievements', 'Refined output'],
    lifeAreasZh: ['财务成功', '事业精确', '质量成就', '精炼产出'],
    remedies: 'Focus on quality and precision. Excellent for financial matters.',
    remediesZh: '专注于质量和精确。非常适合财务事项。',
    timing: 'Active throughout the year. Particularly strong in Metal months.',
    timingZh: '全年活跃。在金月份特别强。'
  },
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Si',
    natalBranch: 'Shen',
    overview: 'Snake-Monkey combination creates harmonious Water energy, enhancing wisdom and flow.',
    overviewZh: '巳申合创造和谐的水能量，增强智慧和流动。',
    lifeAreas: ['Strategic success', 'Clever solutions', 'Networking expansion', 'Intellectual growth'],
    lifeAreasZh: ['战略成功', '聪明解决方案', '社交网络扩展', '智力成长'],
    remedies: 'Use strategic wisdom. Excellent for negotiations and networking.',
    remediesZh: '使用战略智慧。非常适合谈判和社交。',
    timing: 'Active throughout the year. Particularly strong in Water months.',
    timingZh: '全年活跃。在水月份特别强。'
  },
  {
    relationshipType: 'combination',
    relationshipTypeZh: '合',
    incomingBranch: 'Wu',
    natalBranch: 'Wei',
    overview: 'Horse-Goat combination creates harmonious Fire/Earth energy, warming creativity.',
    overviewZh: '午未合创造和谐的火/土能量，温暖创造力。',
    lifeAreas: ['Creative passion', 'Artistic expression', 'Romantic fulfillment', 'Joyful abundance'],
    lifeAreasZh: ['创意热情', '艺术表达', '浪漫满足', '快乐丰富'],
    remedies: 'Express creativity passionately. Excellent for artistic and romantic pursuits.',
    remediesZh: '热情表达创造力。非常适合艺术和浪漫追求。',
    timing: 'Active throughout the year. Particularly strong in summer months.',
    timingZh: '全年活跃。在夏季月份特别强。'
  }
];

// ==================== MONTHLY EMPHASIS ====================

export const MONTHLY_EMPHASIS_LIBRARY: MonthlyEmphasis[] = [
  {
    month: 1, monthName: 'Tiger Month', monthNameZh: '寅月',
    element: 'Wood', elementZh: '木', branch: 'Yin', branchZh: '寅',
    themes: 'New year energy, bold beginnings, pioneering spirit, spring preparations.',
    themesZh: '新年能量、大胆开始、开拓精神、春季准备。',
    opportunities: 'Launching new projects, courageous initiatives, leadership opportunities.',
    opportunitiesZh: '启动新项目、勇敢举措、领导机会。',
    cautions: 'Avoid impulsive decisions. Channel courage constructively.',
    cautionsZh: '避免冲动决定。建设性地引导勇气。'
  },
  {
    month: 2, monthName: 'Rabbit Month', monthNameZh: '卯月',
    element: 'Wood', elementZh: '木', branch: 'Mao', branchZh: '卯',
    themes: 'Spring equinox energy, diplomatic opportunities, artistic expression, gentle growth.',
    themesZh: '春分能量、外交机会、艺术表达、温和成长。',
    opportunities: 'Negotiations, artistic projects, relationship harmony, graceful progress.',
    opportunitiesZh: '谈判、艺术项目、关系和谐、优雅进步。',
    cautions: 'Avoid being too passive. Balance diplomacy with assertiveness.',
    cautionsZh: '避免过于被动。平衡外交与果断。'
  },
  {
    month: 3, monthName: 'Dragon Month', monthNameZh: '辰月',
    element: 'Earth', elementZh: '土', branch: 'Chen', branchZh: '辰',
    themes: 'Transformative energy, ambitious projects, accessing hidden resources.',
    themesZh: '变革能量、雄心项目、获取隐藏资源。',
    opportunities: 'Major transformations, powerful connections, ambitious achievements.',
    opportunitiesZh: '重大转变、强大连接、雄心成就。',
    cautions: 'Avoid overreaching. Ground ambitious plans in practical reality.',
    cautionsZh: '避免过度延伸。将雄心计划扎根于实际现实。'
  },
  {
    month: 4, monthName: 'Snake Month', monthNameZh: '巳月',
    element: 'Fire', elementZh: '火', branch: 'Si', branchZh: '巳',
    themes: 'Strategic wisdom, subtle influence, insight development, refined warmth.',
    themesZh: '战略智慧、微妙影响、洞察发展、精炼温暖。',
    opportunities: 'Strategic planning, intuitive decisions, wise counsel, subtle achievements.',
    opportunitiesZh: '战略规划、直觉决策、智慧咨询、微妙成就。',
    cautions: 'Avoid manipulation. Use wisdom ethically.',
    cautionsZh: '避免操纵。道德地使用智慧。'
  },
  {
    month: 5, monthName: 'Horse Month', monthNameZh: '午月',
    element: 'Fire', elementZh: '火', branch: 'Wu', branchZh: '午',
    themes: 'Peak Fire energy, maximum visibility, passionate pursuits, summer solstice.',
    themesZh: '巅峰火能量、最大可见度、热情追求、夏至。',
    opportunities: 'Public recognition, passionate achievements, social expansion, peak performance.',
    opportunitiesZh: '公众认可、热情成就、社交扩展、巅峰表现。',
    cautions: 'Avoid burnout. Manage energy sustainably despite high visibility.',
    cautionsZh: '避免倦怠。尽管高可见度也要可持续地管理能量。'
  },
  {
    month: 6, monthName: 'Goat Month', monthNameZh: '未月',
    element: 'Earth', elementZh: '土', branch: 'Wei', branchZh: '未',
    themes: 'Nurturing energy, artistic expression, gentle creativity, community focus.',
    themesZh: '滋养能量、艺术表达、温和创造力、社区焦点。',
    opportunities: 'Creative projects, nurturing relationships, artistic achievements, community building.',
    opportunitiesZh: '创意项目、滋养关系、艺术成就、社区建设。',
    cautions: 'Avoid excessive self-sacrifice. Balance nurturing others with self-care.',
    cautionsZh: '避免过度自我牺牲。平衡滋养他人与自我关怀。'
  },
  {
    month: 7, monthName: 'Monkey Month', monthNameZh: '申月',
    element: 'Metal', elementZh: '金', branch: 'Shen', branchZh: '申',
    themes: 'Clever solutions, adaptive intelligence, autumn preparations, strategic timing.',
    themesZh: '聪明解决方案、适应智慧、秋季准备、战略时机。',
    opportunities: 'Problem-solving, innovative approaches, clever negotiations, strategic moves.',
    opportunitiesZh: '解决问题、创新方法、聪明谈判、战略举措。',
    cautions: 'Avoid trickery. Use cleverness ethically.',
    cautionsZh: '避免诡计。道德地使用聪明。'
  },
  {
    month: 8, monthName: 'Rooster Month', monthNameZh: '酉月',
    element: 'Metal', elementZh: '金', branch: 'You', branchZh: '酉',
    themes: 'Peak Metal energy, precision focus, autumn equinox, harvest refinement.',
    themesZh: '巅峰金能量、精确专注、秋分、收获精炼。',
    opportunities: 'Quality achievements, precise timing, refined output, financial precision.',
    opportunitiesZh: '质量成就、精确时机、精炼产出、财务精确。',
    cautions: 'Avoid harsh judgment. Balance precision with compassion.',
    cautionsZh: '避免严厉判断。平衡精确与慈悲。'
  },
  {
    month: 9, monthName: 'Dog Month', monthNameZh: '戌月',
    element: 'Earth', elementZh: '土', branch: 'Xu', branchZh: '戌',
    themes: 'Loyal protection, transformation gateway, autumn storage, faithful commitments.',
    themesZh: '忠诚保护、转变门户、秋季储存、忠实承诺。',
    opportunities: 'Building loyal relationships, protective measures, faithful achievements.',
    opportunitiesZh: '建立忠诚关系、保护措施、忠实成就。',
    cautions: 'Avoid excessive worry. Trust the protection while taking practical precautions.',
    cautionsZh: '避免过度担忧。相信保护同时采取实际预防措施。'
  },
  {
    month: 10, monthName: 'Pig Month', monthNameZh: '亥月',
    element: 'Water', elementZh: '水', branch: 'Hai', branchZh: '亥',
    themes: 'Deep wisdom, completion energy, winter preparations, contented reflection.',
    themesZh: '深度智慧、完成能量、冬季准备、满足反思。',
    opportunities: 'Deep insights, completion of cycles, spiritual depth, contented achievements.',
    opportunitiesZh: '深度洞察、周期完成、精神深度、满足成就。',
    cautions: 'Avoid overindulgence. Balance contentment with continued progress.',
    cautionsZh: '避免过度放纵。平衡满足与持续进步。'
  },
  {
    month: 11, monthName: 'Rat Month', monthNameZh: '子月',
    element: 'Water', elementZh: '水', branch: 'Zi', branchZh: '子',
    themes: 'Peak Water energy, winter solstice, hidden potential, new cycle seeds.',
    themesZh: '巅峰水能量、冬至、隐藏潜力、新周期种子。',
    opportunities: 'Deep wisdom work, networking, planting seeds for future, strategic planning.',
    opportunitiesZh: '深度智慧工作、社交网络、为未来播种、战略规划。',
    cautions: 'Avoid anxiety. Trust the wisdom of winter stillness.',
    cautionsZh: '避免焦虑。相信冬季静止的智慧。'
  },
  {
    month: 12, monthName: 'Ox Month', monthNameZh: '丑月',
    element: 'Earth', elementZh: '土', branch: 'Chou', branchZh: '丑',
    themes: 'Patient accumulation, year-end review, winter storage, steady preparation.',
    themesZh: '耐心积累、年终回顾、冬季储存、稳定准备。',
    opportunities: 'Year-end achievements, patient completion, accumulated wisdom, steady progress.',
    opportunitiesZh: '年终成就、耐心完成、积累智慧、稳定进步。',
    cautions: 'Avoid rushing year-end. Trust patient completion.',
    cautionsZh: '避免仓促年终。相信耐心完成。'
  }
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Lookup element interaction
 */
export function getElementInteraction(incomingElement: string, natalElement: string): AnnualElementInteraction | undefined {
  return ELEMENT_INTERACTION_LIBRARY.find(
    ei => ei.incomingElement === incomingElement && ei.natalElement === natalElement
  );
}

/**
 * Lookup branch relationship
 */
export function getBranchRelationship(incomingBranch: string, natalBranch: string): AnnualBranchRelationship | undefined {
  return BRANCH_RELATIONSHIP_LIBRARY.find(
    br => (br.incomingBranch === incomingBranch && br.natalBranch === natalBranch) ||
          (br.incomingBranch === natalBranch && br.natalBranch === incomingBranch)
  );
}

/**
 * Get monthly emphasis
 */
export function getMonthlyEmphasis(month: number): MonthlyEmphasis | undefined {
  return MONTHLY_EMPHASIS_LIBRARY.find(me => me.month === month);
}

/**
 * Get all clashes for a natal branch
 */
export function getClashesForBranch(natalBranch: string): AnnualBranchRelationship[] {
  return BRANCH_RELATIONSHIP_LIBRARY.filter(
    br => br.relationshipType === 'clash' &&
         (br.natalBranch === natalBranch || br.incomingBranch === natalBranch)
  );
}

/**
 * Get all combinations for a natal branch
 */
export function getCombinationsForBranch(natalBranch: string): AnnualBranchRelationship[] {
  return BRANCH_RELATIONSHIP_LIBRARY.filter(
    br => br.relationshipType === 'combination' &&
         (br.natalBranch === natalBranch || br.incomingBranch === natalBranch)
  );
}

/**
 * Format element interaction for display
 */
export function formatElementInteractionForDisplay(
  incomingElement: string,
  natalElement: string,
  lang: 'en' | 'zh' = 'en'
): string {
  const interaction = getElementInteraction(incomingElement, natalElement);
  if (!interaction) return '';

  if (lang === 'zh') {
    return `【${interaction.incomingElementZh}流年 → ${interaction.natalElementZh}本命】\n${interaction.overviewZh}\n\n机会：${interaction.opportunitiesZh}\n挑战：${interaction.challengesZh}\n建议：${interaction.adviceZh}`;
  }

  return `【${interaction.incomingElement} Year → ${interaction.natalElement} Natal】\n${interaction.overview}\n\nOpportunities: ${interaction.opportunities}\nChallenges: ${interaction.challenges}\nAdvice: ${interaction.advice}`;
}

/**
 * Format branch relationship for display
 */
export function formatBranchRelationshipForDisplay(
  incomingBranch: string,
  natalBranch: string,
  lang: 'en' | 'zh' = 'en'
): string {
  const relationship = getBranchRelationship(incomingBranch, natalBranch);
  if (!relationship) return '';

  if (lang === 'zh') {
    return `【${relationship.incomingBranch}-${relationship.natalBranch} ${relationship.relationshipTypeZh}】\n${relationship.overviewZh}\n\n影响领域：${relationship.lifeAreasZh.join('、')}\n化解方法：${relationship.remediesZh}\n时机：${relationship.timingZh}`;
  }

  return `【${relationship.incomingBranch}-${relationship.natalBranch} ${relationship.relationshipType}】\n${relationship.overview}\n\nLife Areas: ${relationship.lifeAreas.join(', ')}\nRemedies: ${relationship.remedies}\nTiming: ${relationship.timing}`;
}

// ==================== EXPORTS ====================

export {
  getElementInteraction,
  getBranchRelationship,
  getMonthlyEmphasis,
  getClashesForBranch,
  getCombinationsForBranch,
  formatElementInteractionForDisplay,
  formatBranchRelationshipForDisplay
};
