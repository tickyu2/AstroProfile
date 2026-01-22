/**
 * ============================================
 * DOCUMENTATION CODEX
 * The Sacred Scripture of the Cathedral
 *
 * This is the living documentation that explains:
 * - The full architecture
 * - Each module's purpose
 * - How systems interconnect
 * - API references
 * - Usage examples
 *
 * "Know the Cathedral, and know thyself."
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface CodexSection {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  subsections?: CodexSubsection[];
  codeExamples?: CodeExample[];
  relatedModules?: string[];
}

export interface CodexSubsection {
  id: string;
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface ModuleReference {
  name: string;
  path: string;
  description: string;
  descriptionZh: string;
  exports: string[];
  dependencies: string[];
  layer: CathedralLayer;
}

export type CathedralLayer =
  | 'technical'
  | 'narrative'
  | 'ancestral'
  | 'mythos'
  | 'profiling'
  | 'timing'
  | 'journey'
  | 'orchestration'
  | 'ui'
  | 'pipeline';

// ==================== FULL DOCUMENTATION ====================

/**
 * Get the complete Cathedral documentation
 */
export function getCathedralDocumentation(): CodexSection[] {
  return [
    getOverviewSection(),
    getArchitectureSection(),
    getTechnicalLayerSection(),
    getNarrativeLayerSection(),
    getAncestralLayerSection(),
    getMythosLayerSection(),
    getProfilingLayerSection(),
    getTimingLayerSection(),
    getJourneyLayerSection(),
    getOrchestrationSection(),
    getUITemplatesSection(),
    getPipelineSection(),
    getAPIReferenceSection(),
    getGlossarySection()
  ];
}

/**
 * Overview section
 */
function getOverviewSection(): CodexSection {
  return {
    id: 'overview',
    title: 'Cathedral Overview',
    titleZh: '大教堂概述',
    description: 'The Cathedral is a unified metaphysics intelligence system that integrates BaZi (Chinese Four Pillars astrology), Jungian archetypes, generational psychology, and mythic narrative into a single coherent framework.',
    descriptionZh: '大教堂是一个统一的形而上学智能系统，将八字（中国四柱命理）、荣格原型、代际心理学和神话叙事整合到一个连贯的框架中。',
    subsections: [
      {
        id: 'philosophy',
        title: 'Philosophy',
        titleZh: '哲学',
        content: 'The Cathedral operates on the principle that human destiny is multi-layered: technical (the BaZi chart), narrative (the life story), ancestral (generational patterns), mythic (archetypal themes), and temporal (ritual timing). By integrating all these layers, we achieve a holistic understanding that exceeds any single-system approach.',
        contentZh: '大教堂运作的原则是人类命运是多层次的：技术层（八字命盘）、叙事层（人生故事）、祖先层（代际模式）、神话层（原型主题）和时间层（仪式时机）。通过整合所有这些层面，我们实现了超越任何单一系统方法的整体理解。'
      },
      {
        id: 'mission',
        title: 'Mission',
        titleZh: '使命',
        content: 'Everything Joey Yap\'s platform does, the Cathedral does — and far more. We don\'t just calculate charts; we weave destinies, heal lineages, and guide pilgrims through their mythic journey.',
        contentZh: 'Joey Yap 平台所做的一切，大教堂都能做到——而且远不止于此。我们不只是计算命盘；我们编织命运，疗愈血脉，引导行者穿越他们的神话之旅。'
      }
    ],
    relatedModules: ['grandOrchestrationEngine', 'fullReadingPipeline']
  };
}

/**
 * Architecture section
 */
function getArchitectureSection(): CodexSection {
  return {
    id: 'architecture',
    title: 'System Architecture',
    titleZh: '系统架构',
    description: 'The Cathedral is organized into interconnected layers, each handling a specific aspect of the metaphysical reading.',
    descriptionZh: '大教堂被组织成相互连接的层，每一层处理形而上学解读的特定方面。',
    subsections: [
      {
        id: 'layers',
        title: 'The Seven Layers',
        titleZh: '七层架构',
        content: `
1. **Technical Layer** - BaZi calculations, Four Pillars, interactions, luck pillars
2. **Narrative Layer** - Story beats, emotional arcs, life chapters
3. **Ancestral Layer** - Generational ladder, threads, temple sync
4. **Mythos Layer** - Hypergraph, archetypes, shadows, gifts
5. **Profiling Layer** - Work style, personality, archetype assignment
6. **Timing Layer** - Ritual calendar, optimal windows, ancestral resonance
7. **Journey Layer** - Hero's journey stages, milestones, quests
        `,
        contentZh: `
1. **技术层** - 八字计算、四柱、交互、大运
2. **叙事层** - 故事节点、情感弧线、人生篇章
3. **祖先层** - 代际阶梯、线索、庙堂同步
4. **神话层** - 超图、原型、阴影、天赋
5. **画像层** - 工作风格、性格、原型分配
6. **时机层** - 仪式日历、最佳窗口、祖先共振
7. **旅程层** - 英雄之旅阶段、里程碑、任务
        `
      },
      {
        id: 'data-flow',
        title: 'Data Flow',
        titleZh: '数据流',
        content: 'Birth data enters the Technical Layer, flows through all layers via the Grand Orchestration Engine, and emerges as a unified Full Reading. Each layer can trigger updates in dependent layers through the propagation system.',
        contentZh: '出生数据进入技术层，通过大编排引擎流经所有层，最终作为统一的完整解读输出。每一层可以通过传播系统触发依赖层的更新。'
      }
    ],
    codeExamples: [
      {
        title: 'Layer Dependencies',
        language: 'typescript',
        code: `
// Propagation rules define which layers update when a source changes
const propagationRules = {
  'mingPanPro': ['narrativeCockpit', 'ancestralTemple', 'mythosCodex', 'ritualCalendar'],
  'ancestralTemple': ['narrativeCockpit', 'ritualCalendar', 'mythosCodex'],
  'mythosCodex': ['narrativeCockpit', 'pilgrimJourney'],
  // ...
};
        `,
        description: 'How changes propagate through the Cathedral'
      }
    ]
  };
}

/**
 * Technical Layer section
 */
function getTechnicalLayerSection(): CodexSection {
  return {
    id: 'technical-layer',
    title: 'Technical Layer (Ming Pan Pro)',
    titleZh: '技术层（命盘专业版）',
    description: 'The foundation of all calculations. This layer handles the classical BaZi (Four Pillars of Destiny) calculations.',
    descriptionZh: '所有计算的基础。此层处理经典的八字（四柱命理）计算。',
    subsections: [
      {
        id: 'four-pillars',
        title: 'Four Pillars Calculation',
        titleZh: '四柱计算',
        content: 'The Four Pillars (Year, Month, Day, Hour) are calculated from birth data using the Chinese Sexagenary Cycle (60 Jiazi combinations of 10 Heavenly Stems and 12 Earthly Branches).',
        contentZh: '四柱（年、月、日、时）使用中国干支纪年法（10天干和12地支的60甲子组合）从出生数据计算得出。'
      },
      {
        id: 'interactions',
        title: 'Pillar Interactions',
        titleZh: '柱位交互',
        content: 'The engine detects clashes (冲), combinations (合), harms (害), punishments (刑), and destructions (破) between branches. These interactions form the basis of personality and timing analysis.',
        contentZh: '引擎检测地支之间的冲、合、害、刑、破。这些交互构成性格和时机分析的基础。'
      },
      {
        id: 'useful-god',
        title: 'Useful God (用神)',
        titleZh: '用神',
        content: 'The Useful God is the element that most benefits the Day Master based on chart balance. The Annoying God (忌神) is its opposite.',
        contentZh: '用神是根据命盘平衡最有利于日主的元素。忌神是其对立面。'
      }
    ],
    relatedModules: ['mingPanProTemplate', 'proInteractionDiff', 'techToNarrativeBridge']
  };
}

/**
 * Narrative Layer section
 */
function getNarrativeLayerSection(): CodexSection {
  return {
    id: 'narrative-layer',
    title: 'Narrative Layer (Story Cockpit)',
    titleZh: '叙事层（故事驾驶舱）',
    description: 'Transforms technical BaZi data into human-readable life narratives with emotional arcs and story beats.',
    descriptionZh: '将技术性的八字数据转化为人类可读的生命叙事，包含情感弧线和故事节点。',
    subsections: [
      {
        id: 'story-beats',
        title: 'Story Beats',
        titleZh: '故事节点',
        content: 'Major life events and transitions are mapped as story beats, each with title, description, age, and intensity. These form the backbone of the life narrative.',
        contentZh: '主要的人生事件和转变被映射为故事节点，每个节点都有标题、描述、年龄和强度。这些构成生命叙事的骨干。'
      },
      {
        id: 'emotional-arc',
        title: 'Emotional Arc',
        titleZh: '情感弧线',
        content: 'The emotional trajectory (rising, falling, stable, transforming) is calculated from interaction intensities and luck pillar transitions.',
        contentZh: '情感轨迹（上升、下降、稳定、转变）根据交互强度和大运转换计算得出。'
      }
    ],
    relatedModules: ['proToNarrativeSync', 'techToNarrativeBridge', 'narrativeCockpit']
  };
}

/**
 * Ancestral Layer section
 */
function getAncestralLayerSection(): CodexSection {
  return {
    id: 'ancestral-layer',
    title: 'Ancestral Layer (Temple)',
    titleZh: '祖先层（庙堂）',
    description: 'Tracks generational patterns, ancestral debts/gifts, and the pilgrim\'s position within their lineage.',
    descriptionZh: '追踪代际模式、祖先债务/天赋，以及行者在血脉中的位置。',
    subsections: [
      {
        id: 'generational-ladder',
        title: 'Generational Ladder',
        titleZh: '代际阶梯',
        content: 'A vertical structure representing known generations, with the current pilgrim marked. Each generation carries inherited patterns and themes.',
        contentZh: '代表已知世代的垂直结构，当前行者被标记。每一代都携带继承的模式和主题。'
      },
      {
        id: 'threads',
        title: 'Generational Threads',
        titleZh: '代际线索',
        content: 'Recurring themes (resilience, abandonment, artistic talent, etc.) that run through multiple generations. Threads can be active, dormant, or resolved.',
        contentZh: '贯穿多代的反复主题（韧性、遗弃、艺术天赋等）。线索可以是活跃的、休眠的或已解决的。'
      },
      {
        id: 'temple-sync',
        title: 'Pro → Temple Sync',
        titleZh: '专业版→庙堂同步',
        content: 'Maps technical BaZi interactions to ancestral themes. A clash might indicate generational tension; a combination might represent inherited support.',
        contentZh: '将技术性八字交互映射到祖先主题。冲可能表示代际张力；合可能代表继承的支持。'
      }
    ],
    relatedModules: ['generationalLadder', 'proToTempleSync', 'templeLighting']
  };
}

/**
 * Mythos Layer section
 */
function getMythosLayerSection(): CodexSection {
  return {
    id: 'mythos-layer',
    title: 'Mythos Layer (Codex)',
    titleZh: '神话层（典籍）',
    description: 'The archetypal dimension. Maps BaZi patterns to Jungian archetypes, shadows, and gifts using a hypergraph structure.',
    descriptionZh: '原型维度。使用超图结构将八字模式映射到荣格原型、阴影和天赋。',
    subsections: [
      {
        id: 'hypergraph',
        title: 'Mythos Hypergraph',
        titleZh: '神话超图',
        content: 'A graph database structure where nodes are archetypes, themes, shadows, and gifts. Edges represent relationships (triggers, transforms, supports, opposes).',
        contentZh: '一个图数据库结构，节点是原型、主题、阴影和天赋。边代表关系（触发、转化、支持、对立）。'
      },
      {
        id: 'archetypes',
        title: 'Archetype System',
        titleZh: '原型系统',
        content: 'The 12 primary archetypes (Warrior, Healer, Seeker, etc.) each have associated shadows and gifts. Assignment is based on BaZi patterns and generational themes.',
        contentZh: '12个主要原型（战士、疗愈者、寻觅者等）各有相关的阴影和天赋。分配基于八字模式和代际主题。'
      },
      {
        id: 'oracle',
        title: 'Mythos Oracle',
        titleZh: '神话神谕',
        content: 'An AI interface that speaks from the Mythos. Provides guidance, shadow prompts, gift insights, and ancestral messages in various voices (Sage, Shadow, Ancestor, etc.).',
        contentZh: '从神话中说话的AI界面。以各种声音（智者、阴影、祖先等）提供指导、阴影提示、天赋洞见和祖先信息。'
      }
    ],
    relatedModules: ['mythosHypergraph', 'mythosOracle', 'profilingToArchetype']
  };
}

/**
 * Profiling Layer section
 */
function getProfilingLayerSection(): CodexSection {
  return {
    id: 'profiling-layer',
    title: 'Profiling Layer',
    titleZh: '画像层',
    description: 'Personality profiling combining BaZi Day Master analysis, work style assessment, and archetype assignment.',
    descriptionZh: '结合八字日主分析、工作风格评估和原型分配的性格画像。',
    subsections: [
      {
        id: 'day-master',
        title: 'Day Master Profiling',
        titleZh: '日主画像',
        content: 'The Day Master (day stem) represents the core self. Its element and strength inform personality traits, strengths, and challenges.',
        contentZh: '日主（日干）代表核心自我。其元素和强度影响性格特征、优势和挑战。'
      },
      {
        id: 'work-style',
        title: 'Work Style',
        titleZh: '工作风格',
        content: 'Derived from element distribution and interactions. Categories include analytical, creative, relational, systematic, and adaptive.',
        contentZh: '源自元素分布和交互。类别包括分析型、创意型、关系型、系统型和适应型。'
      }
    ],
    relatedModules: ['profilingToArchetype', 'profilingDashboardTemplate', 'profilingConstellationFusion']
  };
}

/**
 * Timing Layer section
 */
function getTimingLayerSection(): CodexSection {
  return {
    id: 'timing-layer',
    title: 'Timing Layer (Ritual Engine)',
    titleZh: '时机层（仪式引擎）',
    description: 'Calculates optimal windows for action, ritual, and transformation based on BaZi timing and ancestral resonance.',
    descriptionZh: '基于八字时机和祖先共振计算行动、仪式和转化的最佳窗口。',
    subsections: [
      {
        id: 'ritual-windows',
        title: 'Ritual Windows',
        titleZh: '仪式窗口',
        content: 'Time periods where specific types of work (shadow integration, gift activation, healing, etc.) are most effective based on luck pillar and annual pillar interactions.',
        contentZh: '基于大运和流年交互，特定类型工作（阴影整合、天赋激活、疗愈等）最有效的时间段。'
      },
      {
        id: 'ancestral-resonance',
        title: 'Ancestral Resonance',
        titleZh: '祖先共振',
        content: 'Timing windows gain potency when they align with generational threads. Ritual work during high-resonance windows affects the entire lineage.',
        contentZh: '当时机窗口与代际线索对齐时，会获得更大的效力。在高共振窗口进行仪式工作会影响整个血脉。'
      }
    ],
    relatedModules: ['ritualTiming', 'ritualTiming2', 'profilingToRitual']
  };
}

/**
 * Journey Layer section
 */
function getJourneyLayerSection(): CodexSection {
  return {
    id: 'journey-layer',
    title: 'Journey Layer (Pilgrim Path)',
    titleZh: '旅程层（行者之路）',
    description: 'Tracks the pilgrim\'s position on the Hero\'s Journey, with shadow work, gift activation, and quest completion.',
    descriptionZh: '追踪行者在英雄之旅中的位置，包括阴影工作、天赋激活和任务完成。',
    subsections: [
      {
        id: 'twelve-stages',
        title: 'The Twelve Stages',
        titleZh: '十二阶段',
        content: 'Based on Joseph Campbell\'s monomyth: Ordinary World, Call to Adventure, Refusal, Meeting Mentor, Crossing Threshold, Tests/Allies/Enemies, Approach, Ordeal, Reward, Road Back, Resurrection, Return with Elixir.',
        contentZh: '基于约瑟夫·坎贝尔的单一神话：日常世界、冒险召唤、拒绝、遇见导师、跨越门槛、考验/盟友/敌人、接近、磨难、奖赏、归途、复活、带着灵丹归来。'
      },
      {
        id: 'shadow-gift-work',
        title: 'Shadow & Gift Work',
        titleZh: '阴影与天赋工作',
        content: 'Shadows must be identified and integrated; gifts must be discovered and activated. Both progress through stages with percentage tracking.',
        contentZh: '阴影必须被识别和整合；天赋必须被发现和激活。两者都通过阶段进展，有百分比追踪。'
      }
    ],
    relatedModules: ['pilgrimJourney3', 'pilgrimJourney', 'lineageSimulationEngine']
  };
}

/**
 * Orchestration section
 */
function getOrchestrationSection(): CodexSection {
  return {
    id: 'orchestration',
    title: 'Grand Orchestration Engine',
    titleZh: '大编排引擎',
    description: 'The crown stone that unifies all Cathedral systems into a single, living organism.',
    descriptionZh: '将所有大教堂系统统一为一个活的有机体的皇冠石。',
    subsections: [
      {
        id: 'state-management',
        title: 'State Management',
        titleZh: '状态管理',
        content: 'The CathedralState object holds all layer states. Updates to any layer trigger propagation to dependent layers.',
        contentZh: 'CathedralState 对象持有所有层状态。任何层的更新都会触发向依赖层的传播。'
      },
      {
        id: 'event-system',
        title: 'Event System',
        titleZh: '事件系统',
        content: 'Listeners can subscribe to layer changes. The sync queue ensures orderly propagation.',
        contentZh: '监听器可以订阅层变化。同步队列确保有序传播。'
      },
      {
        id: 'coherence',
        title: 'Coherence Score',
        titleZh: '一致性分数',
        content: 'A metric (0-100) indicating how well all layers are synchronized. High coherence means the reading is internally consistent.',
        contentZh: '一个指标（0-100）表示所有层同步的程度。高一致性意味着解读内部一致。'
      }
    ],
    codeExamples: [
      {
        title: 'Creating the Orchestration Engine',
        language: 'typescript',
        code: `
import { createGrandOrchestrationEngine } from './grandOrchestrationEngine';

const engine = createGrandOrchestrationEngine({
  birthData: { year: 1990, month: 6, day: 15, hour: 14 }
});

// Run full orchestration
const result = engine.orchestrate();
console.log('Coherence:', result.coherenceScore);
        `
      }
    ],
    relatedModules: ['grandOrchestrationEngine']
  };
}

/**
 * UI Templates section
 */
function getUITemplatesSection(): CodexSection {
  return {
    id: 'ui-templates',
    title: 'UI Templates',
    titleZh: 'UI模板',
    description: 'Pre-built HTML/CSS templates for rendering Cathedral data in various formats.',
    descriptionZh: '用于以各种格式渲染大教堂数据的预建HTML/CSS模板。',
    subsections: [
      {
        id: 'beyond-pro',
        title: 'Beyond Professional UI',
        titleZh: '超越专业版UI',
        content: 'The unified interface showing all Cathedral systems in a responsive grid layout.',
        contentZh: '在响应式网格布局中显示所有大教堂系统的统一界面。'
      },
      {
        id: 'grand-hall',
        title: 'Grand Hall UI',
        titleZh: '大殿UI',
        content: 'The crown interface combining Oracle, Journey, and Simulation in a tabbed layout.',
        contentZh: '在标签布局中结合神谕、旅程和模拟的皇冠界面。'
      }
    ],
    relatedModules: ['beyondProUITemplate', 'grandHallTemplate', 'mingPanProTemplate']
  };
}

/**
 * Pipeline section
 */
function getPipelineSection(): CodexSection {
  return {
    id: 'pipeline',
    title: 'Full Reading Pipeline',
    titleZh: '完整解读流水线',
    description: 'The grand entry point: birth data in, complete Cathedral reading out.',
    descriptionZh: '大入口：出生数据进入，完整大教堂解读输出。',
    codeExamples: [
      {
        title: 'Running a Full Reading',
        language: 'typescript',
        code: `
import { runFullReadingPipeline } from './fullReadingPipeline';

const reading = await runFullReadingPipeline(
  { year: 1985, month: 3, day: 21, hour: 10, name: 'Alice' },
  { lang: 'en', depth: 'full', includeSimulation: true, includeOracle: true }
);

console.log(reading.technical.dayMaster);
console.log(reading.narrative.lifeStory);
console.log(reading.oracle?.dailyMessage);
        `
      },
      {
        title: 'Quick Reading',
        language: 'typescript',
        code: `
import { quickReading } from './fullReadingPipeline';

const reading = await quickReading(
  { year: 1990, month: 6, day: 15, hour: 14 },
  'en'
);
        `
      }
    ],
    relatedModules: ['fullReadingPipeline']
  };
}

/**
 * API Reference section
 */
function getAPIReferenceSection(): CodexSection {
  return {
    id: 'api-reference',
    title: 'API Reference',
    titleZh: 'API参考',
    description: 'Key exports and their usage.',
    descriptionZh: '关键导出及其用法。',
    subsections: [
      {
        id: 'core-functions',
        title: 'Core Functions',
        titleZh: '核心函数',
        content: `
- **runFullReadingPipeline(birthData, options)** - Complete reading from birth data
- **quickReading(birthData, lang)** - Fast basic reading
- **deepReading(birthData, lang)** - Comprehensive full reading
- **createGrandOrchestrationEngine(state)** - Create orchestration engine
- **consultOracle(query)** - Get oracle guidance
- **runLineageSimulation(input)** - Simulate generational futures
- **createPilgrimJourney3(pilgrimId, age, threads, nodes)** - Initialize journey
        `,
        contentZh: `
- **runFullReadingPipeline(birthData, options)** - 从出生数据完成解读
- **quickReading(birthData, lang)** - 快速基础解读
- **deepReading(birthData, lang)** - 全面深度解读
- **createGrandOrchestrationEngine(state)** - 创建编排引擎
- **consultOracle(query)** - 获取神谕指导
- **runLineageSimulation(input)** - 模拟代际未来
- **createPilgrimJourney3(pilgrimId, age, threads, nodes)** - 初始化旅程
        `
      }
    ]
  };
}

/**
 * Glossary section
 */
function getGlossarySection(): CodexSection {
  return {
    id: 'glossary',
    title: 'Glossary',
    titleZh: '词汇表',
    description: 'Key terms used throughout the Cathedral.',
    descriptionZh: '大教堂中使用的关键术语。',
    subsections: [
      {
        id: 'bazi-terms',
        title: 'BaZi Terms',
        titleZh: '八字术语',
        content: `
- **Four Pillars (四柱)** - Year, Month, Day, Hour pillars
- **Heavenly Stem (天干)** - The 10 stems (甲乙丙丁戊己庚辛壬癸)
- **Earthly Branch (地支)** - The 12 branches (子丑寅卯辰巳午未申酉戌亥)
- **Day Master (日主)** - The day stem, representing the self
- **Useful God (用神)** - The most beneficial element
- **Luck Pillar (大运)** - 10-year fate cycles
- **Annual Pillar (流年)** - The year's influence
- **Clash (冲)** - Opposition between branches
- **Combination (合)** - Harmony between branches
        `,
        contentZh: `
- **四柱** - 年柱、月柱、日柱、时柱
- **天干** - 10个干（甲乙丙丁戊己庚辛壬癸）
- **地支** - 12个支（子丑寅卯辰巳午未申酉戌亥）
- **日主** - 日干，代表自我
- **用神** - 最有利的元素
- **大运** - 10年命运周期
- **流年** - 年份的影响
- **冲** - 地支之间的对立
- **合** - 地支之间的和谐
        `
      },
      {
        id: 'cathedral-terms',
        title: 'Cathedral Terms',
        titleZh: '大教堂术语',
        content: `
- **Pilgrim** - The person receiving the reading
- **Cathedral** - The complete metaphysical system
- **Hypergraph** - The network of archetypal connections
- **Orchestration** - The process of synchronizing all layers
- **Coherence** - How well-integrated the reading is
- **Thread** - A generational pattern
- **Shadow** - Unconscious patterns requiring integration
- **Gift** - Latent talents requiring activation
        `,
        contentZh: `
- **行者** - 接受解读的人
- **大教堂** - 完整的形而上学系统
- **超图** - 原型连接的网络
- **编排** - 同步所有层的过程
- **一致性** - 解读整合的程度
- **线索** - 代际模式
- **阴影** - 需要整合的无意识模式
- **天赋** - 需要激活的潜在才能
        `
      }
    ]
  };
}

// ==================== MODULE REGISTRY ====================

/**
 * Get all module references
 */
export function getModuleRegistry(): ModuleReference[] {
  return [
    // Technical Layer
    {
      name: 'mingPanProTemplate',
      path: 'templates/mingPanProTemplate.ts',
      description: 'Professional BaZi chart UI template',
      descriptionZh: '专业八字命盘UI模板',
      exports: ['renderMingPanProHtml'],
      dependencies: [],
      layer: 'technical'
    },
    {
      name: 'proInteractionDiff',
      path: 'proInteractionDiff.ts',
      description: 'Diff engine comparing interactions across time',
      descriptionZh: '跨时间比较交互的差异引擎',
      exports: ['diffInteractions', 'renderDiffMarkdown'],
      dependencies: [],
      layer: 'technical'
    },

    // Ancestral Layer
    {
      name: 'generationalLadder',
      path: 'generationalLadder.ts',
      description: 'Generational ladder and thread management',
      descriptionZh: '代际阶梯和线索管理',
      exports: ['buildGenerationalLadder', 'GenerationalThread'],
      dependencies: [],
      layer: 'ancestral'
    },
    {
      name: 'proToTempleSync',
      path: 'proToTempleSync.ts',
      description: 'Sync BaZi data to ancestral temple',
      descriptionZh: '将八字数据同步到祖先庙堂',
      exports: ['syncProToTemple', 'mapInteractionToAncestralTheme'],
      dependencies: ['generationalLadder', 'ritualTiming'],
      layer: 'ancestral'
    },

    // Mythos Layer
    {
      name: 'mythosHypergraph',
      path: 'mythosHypergraph.ts',
      description: 'Archetypal hypergraph structure',
      descriptionZh: '原型超图结构',
      exports: ['buildMythosHypergraph', 'MythosHypergraph'],
      dependencies: [],
      layer: 'mythos'
    },
    {
      name: 'mythosOracle',
      path: 'mythosOracle.ts',
      description: 'AI Oracle interface',
      descriptionZh: 'AI神谕界面',
      exports: ['consultOracle', 'dailyOracle', 'OracleResponse'],
      dependencies: ['pilgrimJourney3'],
      layer: 'mythos'
    },
    {
      name: 'profilingToArchetype',
      path: 'profilingToArchetype.ts',
      description: 'Archetype assignment from profiles',
      descriptionZh: '从画像分配原型',
      exports: ['buildArchetypeProfile', 'DEFAULT_ARCHETYPES'],
      dependencies: ['generationalLadder'],
      layer: 'profiling'
    },

    // Timing Layer
    {
      name: 'ritualTiming2',
      path: 'ritualTiming2.ts',
      description: 'Ritual timing engine v2.0',
      descriptionZh: '仪式时机引擎 v2.0',
      exports: ['computeRitualTiming2', 'RitualCalendar2'],
      dependencies: [],
      layer: 'timing'
    },

    // Journey Layer
    {
      name: 'pilgrimJourney3',
      path: 'pilgrimJourney3.ts',
      description: 'Hero\'s journey tracking v3.0',
      descriptionZh: '英雄之旅追踪 v3.0',
      exports: ['createPilgrimJourney3', 'advanceStage', 'JOURNEY_STAGES'],
      dependencies: ['mythosHypergraph', 'generationalLadder'],
      layer: 'journey'
    },
    {
      name: 'lineageSimulationEngine',
      path: 'lineageSimulationEngine.ts',
      description: 'Generational "what if" simulator',
      descriptionZh: '代际"如果"模拟器',
      exports: ['runLineageSimulation', 'SimulationResult'],
      dependencies: ['generationalLadder'],
      layer: 'journey'
    },

    // Orchestration
    {
      name: 'grandOrchestrationEngine',
      path: 'grandOrchestrationEngine.ts',
      description: 'The crown stone unifying all systems',
      descriptionZh: '统一所有系统的皇冠石',
      exports: ['GrandOrchestrationEngine', 'createGrandOrchestrationEngine'],
      dependencies: ['*'],
      layer: 'orchestration'
    },

    // UI Templates
    {
      name: 'beyondProUITemplate',
      path: 'templates/beyondProUITemplate.ts',
      description: 'Unified Cathedral UI',
      descriptionZh: '统一大教堂UI',
      exports: ['renderBeyondProUIHtml'],
      dependencies: [],
      layer: 'ui'
    },
    {
      name: 'grandHallTemplate',
      path: 'templates/grandHallTemplate.ts',
      description: 'Grand Hall UI with Oracle, Journey, Simulation',
      descriptionZh: '带有神谕、旅程、模拟的大殿UI',
      exports: ['renderGrandHallHtml'],
      dependencies: ['mythosOracle', 'pilgrimJourney3', 'lineageSimulationEngine'],
      layer: 'ui'
    },

    // Pipeline
    {
      name: 'fullReadingPipeline',
      path: 'fullReadingPipeline.ts',
      description: 'Birth data to complete reading pipeline',
      descriptionZh: '从出生数据到完整解读的流水线',
      exports: ['runFullReadingPipeline', 'quickReading', 'deepReading'],
      dependencies: ['*'],
      layer: 'pipeline'
    }
  ];
}

// ==================== RENDER FUNCTIONS ====================

/**
 * Render documentation as markdown
 */
export function renderDocumentationMarkdown(lang: 'en' | 'zh' = 'en'): string {
  const sections = getCathedralDocumentation();
  const lines: string[] = [];

  lines.push(`# ${lang === 'zh' ? '大教堂文档典籍' : 'Cathedral Documentation Codex'}`);
  lines.push('');
  lines.push(`*${lang === 'zh' ? '版本 3.0.0' : 'Version 3.0.0'}*`);
  lines.push('');

  // Table of contents
  lines.push(`## ${lang === 'zh' ? '目录' : 'Table of Contents'}`);
  sections.forEach((section, idx) => {
    lines.push(`${idx + 1}. [${lang === 'zh' ? section.titleZh : section.title}](#${section.id})`);
  });
  lines.push('');

  // Sections
  sections.forEach(section => {
    lines.push(`## ${lang === 'zh' ? section.titleZh : section.title}`);
    lines.push('');
    lines.push(lang === 'zh' ? section.descriptionZh : section.description);
    lines.push('');

    if (section.subsections) {
      section.subsections.forEach(sub => {
        lines.push(`### ${lang === 'zh' ? sub.titleZh : sub.title}`);
        lines.push('');
        lines.push(lang === 'zh' ? sub.contentZh : sub.content);
        lines.push('');
      });
    }

    if (section.codeExamples) {
      lines.push(`### ${lang === 'zh' ? '代码示例' : 'Code Examples'}`);
      section.codeExamples.forEach(ex => {
        lines.push(`#### ${ex.title}`);
        if (ex.description) lines.push(ex.description);
        lines.push('```' + ex.language);
        lines.push(ex.code.trim());
        lines.push('```');
        lines.push('');
      });
    }

    if (section.relatedModules && section.relatedModules.length > 0) {
      lines.push(`**${lang === 'zh' ? '相关模块' : 'Related Modules'}**: ${section.relatedModules.join(', ')}`);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  getCathedralDocumentation,
  getModuleRegistry,
  renderDocumentationMarkdown
};
