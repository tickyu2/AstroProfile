/**
 * ============================================
 * THE CATHEDRAL — UI COMPONENT LIBRARY
 * Atomic Design System Configuration
 *
 * Complete component definitions organized by:
 * Atoms → Molecules → Organisms → Layouts → Rituals
 * ============================================
 */

// ==================== COMPONENT TYPES ====================

export type ComponentCategory = 'atom' | 'molecule' | 'organism' | 'layout' | 'ritual';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'ceremonial';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';

export interface ComponentSpec {
  id: string;
  name: string;
  category: ComponentCategory;
  description: {
    en: string;
    zh: string;
  };
  variants?: ComponentVariant[];
  sizes?: ComponentSize[];
  states?: ComponentState[];
  props?: ComponentProp[];
  cssVars?: CssVariable[];
  examples?: ComponentExample[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface CssVariable {
  name: string;
  value: string;
  description: string;
}

export interface ComponentExample {
  label: string;
  code: string;
}

// ==================== ATOMS ====================

export const ATOM_COMPONENTS: ComponentSpec[] = [
  // Sigil Icon
  {
    id: 'sigil-icon',
    name: 'SigilIcon',
    category: 'atom',
    description: {
      en: 'Displays a Cathedral sigil glyph with optional animation',
      zh: '显示带有可选动画的大教堂符印字形',
    },
    variants: ['default', 'primary', 'ghost'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
    states: ['default', 'hover', 'active'],
    props: [
      { name: 'sigil', type: 'Sigil', required: true, description: 'The sigil to display' },
      { name: 'size', type: 'ComponentSize', required: false, default: 'md', description: 'Icon size' },
      { name: 'animated', type: 'boolean', required: false, default: 'false', description: 'Enable pulse animation' },
      { name: 'color', type: 'string', required: false, default: 'inherit', description: 'Override color' },
    ],
    cssVars: [
      { name: '--sigil-size', value: '24px', description: 'Base sigil size' },
      { name: '--sigil-color', value: 'var(--color-absolute-white)', description: 'Sigil color' },
      { name: '--sigil-glow', value: 'var(--color-primordial-gold)', description: 'Glow color on hover' },
    ],
  },

  // Sacred Text
  {
    id: 'sacred-text',
    name: 'SacredText',
    category: 'atom',
    description: {
      en: 'Typography component with Cathedral styling',
      zh: '具有大教堂样式的排版组件',
    },
    variants: ['default', 'ceremonial'],
    props: [
      { name: 'variant', type: "'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption' | 'code'", required: false, default: 'body', description: 'Text variant' },
      { name: 'as', type: 'ElementType', required: false, default: 'p', description: 'HTML element to render' },
      { name: 'align', type: "'left' | 'center' | 'right'", required: false, default: 'left', description: 'Text alignment' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Text content' },
    ],
    cssVars: [
      { name: '--text-color', value: 'var(--color-absolute-white)', description: 'Text color' },
      { name: '--text-font', value: 'var(--font-architectural)', description: 'Font family' },
    ],
  },

  // Genesis Button
  {
    id: 'genesis-button',
    name: 'GenesisButton',
    category: 'atom',
    description: {
      en: 'Primary interactive button with ritual styling',
      zh: '具有仪式样式的主要交互按钮',
    },
    variants: ['default', 'primary', 'secondary', 'ghost', 'ceremonial'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading'],
    props: [
      { name: 'variant', type: 'ComponentVariant', required: false, default: 'default', description: 'Button style variant' },
      { name: 'size', type: 'ComponentSize', required: false, default: 'md', description: 'Button size' },
      { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Show loading state' },
      { name: 'leftIcon', type: 'Sigil', required: false, description: 'Sigil before text' },
      { name: 'rightIcon', type: 'Sigil', required: false, description: 'Sigil after text' },
      { name: 'onClick', type: '() => void', required: false, description: 'Click handler' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
    ],
    cssVars: [
      { name: '--button-bg', value: 'var(--color-primordial-gold)', description: 'Background color' },
      { name: '--button-text', value: 'var(--color-void-black)', description: 'Text color' },
      { name: '--button-radius', value: '4px', description: 'Border radius' },
      { name: '--button-padding-x', value: '1.5rem', description: 'Horizontal padding' },
      { name: '--button-padding-y', value: '0.75rem', description: 'Vertical padding' },
    ],
  },

  // Void Divider
  {
    id: 'void-divider',
    name: 'VoidDivider',
    category: 'atom',
    description: {
      en: 'Horizontal or vertical dividing line',
      zh: '水平或垂直分隔线',
    },
    variants: ['default', 'primary', 'ghost'],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: 'horizontal', description: 'Divider direction' },
      { name: 'variant', type: 'ComponentVariant', required: false, default: 'default', description: 'Style variant' },
      { name: 'sigil', type: 'Sigil', required: false, description: 'Center sigil decoration' },
    ],
    cssVars: [
      { name: '--divider-color', value: 'var(--color-causality-silver)', description: 'Line color' },
      { name: '--divider-thickness', value: '1px', description: 'Line thickness' },
    ],
  },

  // Layer Badge
  {
    id: 'layer-badge',
    name: 'LayerBadge',
    category: 'atom',
    description: {
      en: 'Displays a layer number with appropriate coloring',
      zh: '显示具有适当颜色的层号',
    },
    sizes: ['sm', 'md', 'lg'],
    props: [
      { name: 'layer', type: 'number', required: true, description: 'Layer number (1-23)' },
      { name: 'size', type: 'ComponentSize', required: false, default: 'md', description: 'Badge size' },
      { name: 'showName', type: 'boolean', required: false, default: 'false', description: 'Show layer name' },
    ],
    cssVars: [
      { name: '--badge-bg', value: 'transparent', description: 'Background color' },
      { name: '--badge-border', value: 'var(--color-primordial-gold)', description: 'Border color' },
    ],
  },

  // Portal Input
  {
    id: 'portal-input',
    name: 'PortalInput',
    category: 'atom',
    description: {
      en: 'Text input field with Cathedral styling',
      zh: '具有大教堂样式的文本输入字段',
    },
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'disabled'],
    props: [
      { name: 'type', type: "'text' | 'email' | 'password' | 'number'", required: false, default: 'text', description: 'Input type' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'value', type: 'string', required: false, description: 'Input value' },
      { name: 'onChange', type: '(value: string) => void', required: false, description: 'Change handler' },
      { name: 'leftSigil', type: 'Sigil', required: false, description: 'Left icon' },
    ],
    cssVars: [
      { name: '--input-bg', value: 'rgba(255, 255, 255, 0.05)', description: 'Background color' },
      { name: '--input-border', value: 'var(--color-causality-silver)', description: 'Border color' },
      { name: '--input-focus-border', value: 'var(--color-primordial-gold)', description: 'Focus border color' },
    ],
  },
];

// ==================== MOLECULES ====================

export const MOLECULE_COMPONENTS: ComponentSpec[] = [
  // Layer Card
  {
    id: 'layer-card',
    name: 'LayerCard',
    category: 'molecule',
    description: {
      en: 'Card displaying a single Cathedral layer with sigil, name, and description',
      zh: '显示带有符印、名称和描述的单个大教堂层的卡片',
    },
    variants: ['default', 'compact', 'expanded'],
    states: ['default', 'hover', 'active', 'locked'],
    props: [
      { name: 'layer', type: 'CathedralLayer', required: true, description: 'Layer data' },
      { name: 'variant', type: "'default' | 'compact' | 'expanded'", required: false, default: 'default', description: 'Card layout' },
      { name: 'locked', type: 'boolean', required: false, default: 'false', description: 'Show locked state' },
      { name: 'onClick', type: '() => void', required: false, description: 'Click handler' },
    ],
    cssVars: [
      { name: '--card-bg', value: 'rgba(255, 255, 255, 0.02)', description: 'Background color' },
      { name: '--card-border', value: 'var(--color-causality-silver)', description: 'Border color' },
      { name: '--card-hover-border', value: 'var(--color-primordial-gold)', description: 'Hover border color' },
    ],
  },

  // Pillar Navigator
  {
    id: 'pillar-navigator',
    name: 'PillarNavigator',
    category: 'molecule',
    description: {
      en: 'Three-pillar navigation selector',
      zh: '三支柱导航选择器',
    },
    props: [
      { name: 'activePillar', type: "'pilgrim' | 'architect' | 'sovereign'", required: true, description: 'Currently active pillar' },
      { name: 'onChange', type: "(pillar: string) => void", required: true, description: 'Selection handler' },
    ],
    cssVars: [
      { name: '--nav-active-color', value: 'var(--color-primordial-gold)', description: 'Active pillar color' },
    ],
  },

  // Chamber Entry
  {
    id: 'chamber-entry',
    name: 'ChamberEntry',
    category: 'molecule',
    description: {
      en: 'Entry point component for a Cathedral chamber',
      zh: '大教堂室的入口点组件',
    },
    variants: ['default', 'ceremonial'],
    states: ['default', 'hover', 'locked'],
    props: [
      { name: 'chamber', type: 'ChamberConfig', required: true, description: 'Chamber configuration' },
      { name: 'locked', type: 'boolean', required: false, default: 'false', description: 'Show locked state' },
      { name: 'onEnter', type: '() => void', required: false, description: 'Enter handler' },
    ],
  },

  // Ritual Progress
  {
    id: 'ritual-progress',
    name: 'RitualProgress',
    category: 'molecule',
    description: {
      en: 'Progress indicator for multi-step rituals',
      zh: '多步骤仪式的进度指示器',
    },
    variants: ['default', 'vertical'],
    props: [
      { name: 'steps', type: 'string[]', required: true, description: 'Step labels' },
      { name: 'currentStep', type: 'number', required: true, description: 'Current step index' },
      { name: 'variant', type: "'default' | 'vertical'", required: false, default: 'default', description: 'Layout variant' },
    ],
  },

  // Archetype Display
  {
    id: 'archetype-display',
    name: 'ArchetypeDisplay',
    category: 'molecule',
    description: {
      en: 'Displays user archetype constellation',
      zh: '显示用户原型星座',
    },
    props: [
      { name: 'archetype', type: 'ArchetypeConstellation', required: true, description: 'User archetype data' },
      { name: 'showDetails', type: 'boolean', required: false, default: 'false', description: 'Show detailed breakdown' },
    ],
  },

  // Tier Lock
  {
    id: 'tier-lock',
    name: 'TierLock',
    category: 'molecule',
    description: {
      en: 'Displays locked content with tier requirement',
      zh: '显示带有等级要求的锁定内容',
    },
    props: [
      { name: 'requiredTier', type: "'free' | 'seeker' | 'architect' | 'sovereign'", required: true, description: 'Required tier' },
      { name: 'message', type: 'string', required: false, description: 'Custom lock message' },
      { name: 'onUpgrade', type: '() => void', required: false, description: 'Upgrade click handler' },
    ],
  },
];

// ==================== ORGANISMS ====================

export const ORGANISM_COMPONENTS: ComponentSpec[] = [
  // Cathedral Diagram
  {
    id: 'cathedral-diagram',
    name: 'CathedralDiagram',
    category: 'organism',
    description: {
      en: 'Interactive 23-layer Cathedral visualization',
      zh: '交互式23层大教堂可视化',
    },
    variants: ['default', 'compact', 'hero'],
    props: [
      { name: 'layers', type: 'CathedralLayer[]', required: true, description: 'Layer data' },
      { name: 'unlockedLayers', type: 'number[]', required: false, default: '[1,2,3]', description: 'Unlocked layer IDs' },
      { name: 'activeLayer', type: 'number', required: false, description: 'Currently selected layer' },
      { name: 'onLayerSelect', type: '(layer: number) => void', required: false, description: 'Layer selection handler' },
      { name: 'variant', type: "'default' | 'compact' | 'hero'", required: false, default: 'default', description: 'Display variant' },
      { name: 'animated', type: 'boolean', required: false, default: 'true', description: 'Enable animations' },
    ],
    cssVars: [
      { name: '--diagram-size', value: '600px', description: 'Diagram diameter' },
      { name: '--ring-stroke', value: '2px', description: 'Ring stroke width' },
      { name: '--active-glow', value: 'var(--color-primordial-gold)', description: 'Active layer glow' },
    ],
  },

  // Hero Section
  {
    id: 'hero-section',
    name: 'HeroSection',
    category: 'organism',
    description: {
      en: 'Full-width hero with headline, tagline, and CTA',
      zh: '带有标题、标语和CTA的全宽主视觉',
    },
    props: [
      { name: 'headline', type: 'BilingualText', required: true, description: 'Main headline' },
      { name: 'tagline', type: 'BilingualText', required: true, description: 'Supporting tagline' },
      { name: 'cta', type: 'CallToAction', required: true, description: 'Primary call to action' },
      { name: 'secondaryCta', type: 'CallToAction', required: false, description: 'Secondary CTA' },
      { name: 'background', type: "'void' | 'diagram' | 'custom'", required: false, default: 'void', description: 'Background type' },
    ],
  },

  // Layer Grid
  {
    id: 'layer-grid',
    name: 'LayerGrid',
    category: 'organism',
    description: {
      en: 'Grid display of Cathedral layers',
      zh: '大教堂层的网格显示',
    },
    props: [
      { name: 'layers', type: 'CathedralLayer[]', required: true, description: 'Layers to display' },
      { name: 'columns', type: 'number', required: false, default: '3', description: 'Grid columns' },
      { name: 'onLayerClick', type: '(layer: number) => void', required: false, description: 'Layer click handler' },
    ],
  },

  // Comparison Table
  {
    id: 'comparison-table',
    name: 'ComparisonTable',
    category: 'organism',
    description: {
      en: 'Feature comparison table for tiers',
      zh: '等级功能对比表',
    },
    props: [
      { name: 'tiers', type: 'TierConfig[]', required: true, description: 'Tier configurations' },
      { name: 'features', type: 'FeatureRow[]', required: true, description: 'Feature rows' },
      { name: 'highlightedTier', type: 'string', required: false, description: 'Tier to highlight' },
    ],
  },

  // Pricing Cards
  {
    id: 'pricing-cards',
    name: 'PricingCards',
    category: 'organism',
    description: {
      en: 'Pricing tier card display',
      zh: '定价等级卡片显示',
    },
    props: [
      { name: 'tiers', type: 'PricingTier[]', required: true, description: 'Pricing tiers' },
      { name: 'highlightedTier', type: 'string', required: false, description: 'Highlighted tier ID' },
      { name: 'onSelect', type: '(tier: string) => void', required: false, description: 'Selection handler' },
    ],
  },

  // Manifesto Section
  {
    id: 'manifesto-section',
    name: 'ManifestoSection',
    category: 'organism',
    description: {
      en: 'Ceremonial manifesto display',
      zh: '仪式宣言显示',
    },
    props: [
      { name: 'principles', type: 'ManifestoPrinciple[]', required: true, description: 'Manifesto principles' },
      { name: 'signature', type: 'string', required: false, description: 'Closing signature' },
    ],
  },

  // Navigation Bar
  {
    id: 'navigation-bar',
    name: 'NavigationBar',
    category: 'organism',
    description: {
      en: 'Main site navigation with Cathedral branding',
      zh: '带有大教堂品牌的主站点导航',
    },
    props: [
      { name: 'links', type: 'NavLink[]', required: true, description: 'Navigation links' },
      { name: 'currentPath', type: 'string', required: true, description: 'Current page path' },
      { name: 'onLogoClick', type: '() => void', required: false, description: 'Logo click handler' },
      { name: 'cta', type: 'CallToAction', required: false, description: 'Header CTA' },
    ],
  },

  // Footer
  {
    id: 'footer',
    name: 'Footer',
    category: 'organism',
    description: {
      en: 'Site footer with navigation and signature',
      zh: '带有导航和签名的站点页脚',
    },
    props: [
      { name: 'columns', type: 'FooterColumn[]', required: true, description: 'Footer link columns' },
      { name: 'signature', type: 'string', required: false, default: '— The Cathedral', description: 'Footer signature' },
    ],
  },
];

// ==================== LAYOUTS ====================

export const LAYOUT_COMPONENTS: ComponentSpec[] = [
  // Page Shell
  {
    id: 'page-shell',
    name: 'PageShell',
    category: 'layout',
    description: {
      en: 'Main page wrapper with header and footer',
      zh: '带有页眉和页脚的主页面包装器',
    },
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Page content' },
      { name: 'header', type: 'boolean', required: false, default: 'true', description: 'Show header' },
      { name: 'footer', type: 'boolean', required: false, default: 'true', description: 'Show footer' },
      { name: 'background', type: "'void' | 'gradient' | 'pattern'", required: false, default: 'void', description: 'Background style' },
    ],
  },

  // Chamber Layout
  {
    id: 'chamber-layout',
    name: 'ChamberLayout',
    category: 'layout',
    description: {
      en: 'Layout for individual Chamber pages',
      zh: '单个室页面的布局',
    },
    props: [
      { name: 'chamber', type: 'ChamberConfig', required: true, description: 'Chamber configuration' },
      { name: 'sidebar', type: 'ReactNode', required: false, description: 'Sidebar content' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Main content' },
    ],
  },

  // Split Layout
  {
    id: 'split-layout',
    name: 'SplitLayout',
    category: 'layout',
    description: {
      en: 'Two-column split layout',
      zh: '两列分割布局',
    },
    props: [
      { name: 'left', type: 'ReactNode', required: true, description: 'Left column content' },
      { name: 'right', type: 'ReactNode', required: true, description: 'Right column content' },
      { name: 'ratio', type: "'50-50' | '60-40' | '40-60' | '70-30' | '30-70'", required: false, default: '50-50', description: 'Column ratio' },
      { name: 'reverse', type: 'boolean', required: false, default: 'false', description: 'Reverse on mobile' },
    ],
  },

  // Section Container
  {
    id: 'section-container',
    name: 'SectionContainer',
    category: 'layout',
    description: {
      en: 'Consistent section wrapper with spacing',
      zh: '带有间距的一致部分包装器',
    },
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Section content' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", required: false, default: 'md', description: 'Max width' },
      { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", required: false, default: 'md', description: 'Vertical padding' },
    ],
  },

  // Dashboard Layout
  {
    id: 'dashboard-layout',
    name: 'DashboardLayout',
    category: 'layout',
    description: {
      en: 'User dashboard with sidebar navigation',
      zh: '带有侧边栏导航的用户仪表板',
    },
    props: [
      { name: 'user', type: 'User', required: true, description: 'Current user' },
      { name: 'navigation', type: 'DashboardNav[]', required: true, description: 'Sidebar nav items' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Dashboard content' },
    ],
  },
];

// ==================== RITUALS (FLOW COMPONENTS) ====================

export const RITUAL_COMPONENTS: ComponentSpec[] = [
  // Initiation Flow
  {
    id: 'initiation-flow',
    name: 'InitiationFlow',
    category: 'ritual',
    description: {
      en: 'Complete onboarding ritual experience',
      zh: '完整的入门仪式体验',
    },
    props: [
      { name: 'stages', type: 'JourneyStage[]', required: true, description: 'Journey stages' },
      { name: 'currentStage', type: 'number', required: true, description: 'Current stage index' },
      { name: 'onStageComplete', type: '(stage: number, data: any) => void', required: true, description: 'Stage completion handler' },
      { name: 'onComplete', type: '(archetype: ArchetypeConstellation) => void', required: true, description: 'Flow completion handler' },
    ],
  },

  // Birth Data Ritual
  {
    id: 'birth-data-ritual',
    name: 'BirthDataRitual',
    category: 'ritual',
    description: {
      en: 'Ceremonial birth data collection',
      zh: '仪式性出生数据收集',
    },
    props: [
      { name: 'onComplete', type: '(data: BirthData) => void', required: true, description: 'Completion handler' },
      { name: 'mode', type: "'quick' | 'ceremonial'", required: false, default: 'ceremonial', description: 'Collection mode' },
    ],
  },

  // Layer Unlock Ritual
  {
    id: 'layer-unlock-ritual',
    name: 'LayerUnlockRitual',
    category: 'ritual',
    description: {
      en: 'Animated layer unlock experience',
      zh: '动画层解锁体验',
    },
    props: [
      { name: 'layer', type: 'CathedralLayer', required: true, description: 'Layer being unlocked' },
      { name: 'onComplete', type: '() => void', required: true, description: 'Completion handler' },
    ],
  },

  // Archetype Reveal
  {
    id: 'archetype-reveal',
    name: 'ArchetypeReveal',
    category: 'ritual',
    description: {
      en: 'Ceremonial archetype calculation reveal',
      zh: '仪式性原型计算揭示',
    },
    props: [
      { name: 'archetype', type: 'ArchetypeConstellation', required: true, description: 'Calculated archetype' },
      { name: 'onContinue', type: '() => void', required: true, description: 'Continue handler' },
    ],
  },

  // Threshold Transition
  {
    id: 'threshold-transition',
    name: 'ThresholdTransition',
    category: 'ritual',
    description: {
      en: 'Full-screen transition between chambers',
      zh: '室之间的全屏过渡',
    },
    props: [
      { name: 'from', type: 'string', required: true, description: 'Source chamber' },
      { name: 'to', type: 'string', required: true, description: 'Destination chamber' },
      { name: 'onComplete', type: '() => void', required: true, description: 'Transition complete' },
    ],
  },

  // Tier Upgrade Ritual
  {
    id: 'tier-upgrade-ritual',
    name: 'TierUpgradeRitual',
    category: 'ritual',
    description: {
      en: 'Ceremonial tier upgrade experience',
      zh: '仪式性等级升级体验',
    },
    props: [
      { name: 'fromTier', type: 'string', required: true, description: 'Current tier' },
      { name: 'toTier', type: 'string', required: true, description: 'New tier' },
      { name: 'onComplete', type: '() => void', required: true, description: 'Completion handler' },
    ],
  },
];

// ==================== COMPLETE COMPONENT LIBRARY ====================

export const ALL_COMPONENTS: ComponentSpec[] = [
  ...ATOM_COMPONENTS,
  ...MOLECULE_COMPONENTS,
  ...ORGANISM_COMPONENTS,
  ...LAYOUT_COMPONENTS,
  ...RITUAL_COMPONENTS,
];

// ==================== COMPONENT REGISTRY ====================

export const COMPONENT_CATEGORIES = {
  atom: {
    name: { en: 'Atoms', zh: '原子' },
    description: { en: 'Basic building blocks', zh: '基本构建块' },
    count: ATOM_COMPONENTS.length,
  },
  molecule: {
    name: { en: 'Molecules', zh: '分子' },
    description: { en: 'Combined atoms with purpose', zh: '有目的的组合原子' },
    count: MOLECULE_COMPONENTS.length,
  },
  organism: {
    name: { en: 'Organisms', zh: '有机体' },
    description: { en: 'Complex UI sections', zh: '复杂的UI部分' },
    count: ORGANISM_COMPONENTS.length,
  },
  layout: {
    name: { en: 'Layouts', zh: '布局' },
    description: { en: 'Page structure patterns', zh: '页面结构模式' },
    count: LAYOUT_COMPONENTS.length,
  },
  ritual: {
    name: { en: 'Rituals', zh: '仪式' },
    description: { en: 'Multi-step flow experiences', zh: '多步骤流程体验' },
    count: RITUAL_COMPONENTS.length,
  },
};

// ==================== DESIGN TOKENS ====================

export const DESIGN_TOKENS = {
  colors: {
    // Primary
    'void-black': '#000000',
    'absolute-white': '#FFFFFF',
    'primordial-gold': '#D4AF37',
    'genesis-blue': '#1A4FFF',
    'potentiality-violet': '#7A00FF',
    // Secondary
    'causality-silver': '#C0C0C0',
    'ontology-sand': '#E8DCC2',
    'narrative-rose': '#F2C7C7',
    'existence-teal': '#00A6A6',
    // Semantic
    'success': '#00A86B',
    'warning': '#FFB800',
    'error': '#FF3B3B',
    'info': '#1A4FFF',
  },
  spacing: {
    '0': '0',
    '1': '0.25rem',    // 4px
    '2': '0.5rem',     // 8px
    '3': '0.75rem',    // 12px
    '4': '1rem',       // 16px
    '5': '1.25rem',    // 20px
    '6': '1.5rem',     // 24px
    '8': '2rem',       // 32px
    '10': '2.5rem',    // 40px
    '12': '3rem',      // 48px
    '16': '4rem',      // 64px
    '20': '5rem',      // 80px
    '24': '6rem',      // 96px
    '32': '8rem',      // 128px
  },
  radii: {
    'none': '0',
    'sm': '2px',
    'md': '4px',
    'lg': '8px',
    'xl': '12px',
    '2xl': '16px',
    'full': '9999px',
  },
  shadows: {
    'none': 'none',
    'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
    'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
    'glow-gold': '0 0 24px rgba(212, 175, 55, 0.3)',
    'glow-blue': '0 0 24px rgba(26, 79, 255, 0.3)',
    'glow-violet': '0 0 24px rgba(122, 0, 255, 0.3)',
  },
  transitions: {
    'fast': '150ms ease',
    'normal': '300ms ease',
    'slow': '500ms ease',
    'ritual': '800ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  breakpoints: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    'base': 0,
    'dropdown': 1000,
    'sticky': 1020,
    'fixed': 1030,
    'modal-backdrop': 1040,
    'modal': 1050,
    'popover': 1060,
    'tooltip': 1070,
    'ritual': 1080,
  },
};

// ==================== HELPER FUNCTIONS ====================

export function getComponentById(id: string): ComponentSpec | undefined {
  return ALL_COMPONENTS.find(c => c.id === id);
}

export function getComponentsByCategory(category: ComponentCategory): ComponentSpec[] {
  return ALL_COMPONENTS.filter(c => c.category === category);
}

export function getComponentPropTypes(id: string): ComponentProp[] {
  return getComponentById(id)?.props || [];
}

export function getComponentCssVars(id: string): CssVariable[] {
  return getComponentById(id)?.cssVars || [];
}
