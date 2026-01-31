/**
 * ============================================
 * UI/UX WIREFRAME SYSTEM
 * Component Structure Definitions
 *
 * Every screen. Every interaction.
 * Every structural element for the Cathedral.
 * Designed for ceremonial minimalism.
 * ============================================
 */

// ==================== GLOBAL UI PRINCIPLES ====================

export const UI_PRINCIPLES = {
  ceremonialMinimalism: 'Every screen feels like a chamber',
  hypergraphCentric: 'The Cathedral diagram is always present',
  slowIntentionalMotion: 'Transitions feel like rituals',
  triPathNavigation: 'Pilgrim, Architect, Sovereign paths',
  layeredDepth: 'Every click reveals a deeper chamber',
  mythicTechnicalDuality: 'Sacred + computational',
};

// ==================== PAGE DEFINITIONS ====================

export type PageId =
  | 'homepage'
  | 'problem'
  | 'solution'
  | 'architecture'
  | 'chamber'
  | 'demo'
  | 'comparison'
  | 'use-cases'
  | 'pricing'
  | 'manifesto'
  | 'pilgrim-journey'
  | 'dashboard'
  | 'membership'
  | 'initiation';

export interface PageWireframe {
  id: PageId;
  name: string;
  path: string;
  sections: PageSection[];
  metadata: PageMetadata;
}

export interface PageSection {
  id: string;
  type: SectionType;
  layout: LayoutType;
  content: SectionContent;
  interactions?: Interaction[];
}

export type SectionType =
  | 'hero'
  | 'statement'
  | 'grid'
  | 'diagram'
  | 'matrix'
  | 'cards'
  | 'scroll'
  | 'ladder'
  | 'journey'
  | 'panels'
  | 'form'
  | 'cta';

export type LayoutType =
  | 'full-screen'
  | 'centered'
  | 'split'
  | 'columns-2'
  | 'columns-3'
  | 'columns-4'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'stacked';

export interface SectionContent {
  headline?: string;
  subline?: string;
  body?: string;
  items?: ContentItem[];
  cta?: CallToAction;
  visual?: VisualElement;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  link?: string;
}

export interface CallToAction {
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'ghost';
}

export interface VisualElement {
  type: 'diagram' | 'animation' | 'image' | 'video' | 'interactive';
  source?: string;
  config?: Record<string, unknown>;
}

export interface Interaction {
  trigger: 'hover' | 'click' | 'scroll' | 'drag';
  action: string;
  target?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
}

// ==================== WIREFRAME 1: HOMEPAGE ====================

export const HOMEPAGE_WIREFRAME: PageWireframe = {
  id: 'homepage',
  name: 'The Threshold',
  path: '/',
  sections: [
    {
      id: 'header',
      type: 'hero',
      layout: 'full-screen',
      content: {
        visual: {
          type: 'interactive',
          config: {
            component: 'CathedralSigil',
            animated: true,
          },
        },
      },
    },
    {
      id: 'hero',
      type: 'hero',
      layout: 'centered',
      content: {
        headline: 'The age of interpretation is ending.\nThe age of architecture has begun.',
        subline: "The world's first Metaphysics Operating System (MetaOS).",
        visual: {
          type: 'interactive',
          config: {
            component: 'ExpandingHypergraph',
            scrollExpand: true,
          },
        },
      },
      interactions: [
        { trigger: 'scroll', action: 'expandDiagram' },
      ],
    },
    {
      id: 'gates',
      type: 'cards',
      layout: 'columns-3',
      content: {
        items: [
          {
            id: 'founders',
            title: 'For Founders & Leaders',
            description: "Architect your organization's metaphysical trajectory.",
            icon: 'crown',
            link: '/founders',
          },
          {
            id: 'practitioners',
            title: 'For Practitioners & Mystics',
            description: 'Upgrade from interpretation to architecture.',
            icon: 'eye',
            link: '/practitioners',
          },
          {
            id: 'visionaries',
            title: 'For Researchers & Visionaries',
            description: 'Explore the architecture of reality.',
            icon: 'infinity',
            link: '/visionaries',
          },
        ],
        cta: {
          label: 'Enter the Cathedral',
          action: '/journey',
          style: 'primary',
        },
      },
    },
    {
      id: 'scroll-cue',
      type: 'cta',
      layout: 'centered',
      content: {
        visual: {
          type: 'animation',
          config: {
            component: 'ScrollSigil',
            direction: 'down',
          },
        },
      },
    },
  ],
  metadata: {
    title: 'The Cathedral — Metaphysics Operating System',
    description: 'The age of interpretation is ending. The age of architecture has begun.',
    keywords: ['metaphysics', 'MetaOS', 'BaZi', 'architecture', 'reality'],
  },
};

// ==================== WIREFRAME 2: PROBLEM PAGE ====================

export const PROBLEM_WIREFRAME: PageWireframe = {
  id: 'problem',
  name: 'The Fracture',
  path: '/problem',
  sections: [
    {
      id: 'statement',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'The world has outgrown interpretive metaphysics.',
      },
    },
    {
      id: 'pain-points',
      type: 'grid',
      layout: 'columns-3',
      content: {
        items: [
          { id: 'complexity', title: 'Complexity', description: 'Organizations are complex systems' },
          { id: 'volatility', title: 'Volatility', description: 'Timelines shift rapidly' },
          { id: 'scale', title: 'Scale', description: 'Human consultants cannot scale' },
        ],
      },
    },
    {
      id: 'limitation',
      type: 'hero',
      layout: 'split',
      content: {
        items: [
          { id: 'human', title: 'Human Consultant', description: 'Limited, slow, interpretive' },
          { id: 'metaos', title: 'MetaOS', description: 'Scalable, fast, architectural' },
        ],
        cta: {
          label: 'Explore the Solution',
          action: '/solution',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'The Problem — The Cathedral',
    description: 'The world has outgrown interpretive metaphysics.',
    keywords: ['metaphysics', 'problem', 'interpretation', 'limitation'],
  },
};

// ==================== WIREFRAME 3: SOLUTION PAGE ====================

export const SOLUTION_WIREFRAME: PageWireframe = {
  id: 'solution',
  name: 'The Revelation',
  path: '/solution',
  sections: [
    {
      id: 'definition',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'Pro Report Designer — the Metaphysics Operating System.',
      },
    },
    {
      id: 'pillars',
      type: 'grid',
      layout: 'columns-5',
      content: {
        items: [
          { id: 'architectural', title: 'Architectural', description: 'Design, not read' },
          { id: 'autonomous', title: 'Autonomous', description: 'Self-governing' },
          { id: 'generative', title: 'Generative', description: 'New ontologies' },
          { id: 'scalable', title: 'Scalable', description: 'Beyond human' },
          { id: 'foundational', title: 'Foundational', description: 'Infrastructure' },
        ],
      },
    },
    {
      id: 'diagram-preview',
      type: 'diagram',
      layout: 'full-screen',
      content: {
        visual: {
          type: 'interactive',
          config: {
            component: 'CathedralDiagramSimple',
            layers: [1, 12],
          },
        },
        cta: {
          label: 'Explore the Architecture',
          action: '/architecture',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'The Solution — The Cathedral',
    description: 'Pro Report Designer — the Metaphysics Operating System.',
    keywords: ['MetaOS', 'solution', 'architecture', 'metaphysics'],
  },
};

// ==================== WIREFRAME 4: ARCHITECTURE PAGE ====================

export const ARCHITECTURE_WIREFRAME: PageWireframe = {
  id: 'architecture',
  name: 'The Cathedral',
  path: '/architecture',
  sections: [
    {
      id: 'diagram',
      type: 'diagram',
      layout: 'full-screen',
      content: {
        visual: {
          type: 'interactive',
          config: {
            component: 'CathedralDiagramFull',
            layers: [1, 23],
            pillars: true,
            quadrants: true,
            genesisLine: true,
          },
        },
      },
      interactions: [
        { trigger: 'hover', action: 'revealLayerInfo' },
        { trigger: 'click', action: 'openChamber', target: 'layerId' },
        { trigger: 'scroll', action: 'zoomDiagram' },
        { trigger: 'drag', action: 'rotateDiagram' },
      ],
    },
  ],
  metadata: {
    title: 'The Architecture — The Cathedral',
    description: '23 Layers of Metaphysics',
    keywords: ['architecture', 'layers', '23', 'cathedral', 'diagram'],
  },
};

// ==================== WIREFRAME 5: CHAMBER PAGE ====================

export const CHAMBER_WIREFRAME: PageWireframe = {
  id: 'chamber',
  name: 'Chamber',
  path: '/chamber/:layerId',
  sections: [
    {
      id: 'header',
      type: 'hero',
      layout: 'centered',
      content: {
        // Dynamic: layer number + sigil + name
      },
    },
    {
      id: 'body',
      type: 'grid',
      layout: 'stacked',
      content: {
        items: [
          { id: 'description', title: 'Description', description: '' },
          { id: 'capabilities', title: 'Capabilities', description: '' },
          { id: 'data-model', title: 'Data Model (Technical)', description: '' },
          { id: 'narrative', title: 'Narrative Fragment (Mythic)', description: '' },
          { id: 'diagram', title: 'Diagram Fragment', description: '' },
        ],
      },
    },
    {
      id: 'footer',
      type: 'cta',
      layout: 'centered',
      content: {
        cta: {
          label: 'Ascend to the next layer',
          action: '/chamber/:nextLayerId',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'Chamber — The Cathedral',
    description: 'Explore this layer of the Cathedral',
    keywords: ['chamber', 'layer', 'engine', 'metaphysics'],
  },
};

// ==================== WIREFRAME 6: DEMO PAGE ====================

export const DEMO_WIREFRAME: PageWireframe = {
  id: 'demo',
  name: 'The Mirror',
  path: '/demo',
  sections: [
    {
      id: 'archetype',
      type: 'form',
      layout: 'split',
      content: {
        headline: 'Your Archetype Constellation',
        items: [
          { id: 'birth-data', title: 'Birth Data', description: 'Enter your birth details' },
          { id: 'role', title: 'Role', description: 'Select your role' },
          { id: 'intention', title: 'Intention', description: 'What do you seek?' },
        ],
        visual: {
          type: 'interactive',
          config: {
            component: 'ArchetypeConstellation',
            output: '3-archetype',
          },
        },
      },
    },
    {
      id: 'timeline',
      type: 'form',
      layout: 'split',
      content: {
        headline: 'Timeline Simulation',
        visual: {
          type: 'interactive',
          config: {
            component: 'TimelineSlider',
            range: ['Stability', 'Reinvention'],
            output: '3-timelines',
          },
        },
      },
    },
    {
      id: 'org-map',
      type: 'form',
      layout: 'split',
      content: {
        headline: 'Org Metaphysics Map',
        items: [
          { id: 'team-roles', title: 'Team Roles', description: 'Enter team members' },
        ],
        visual: {
          type: 'interactive',
          config: {
            component: 'OrgArchetypeMap',
          },
        },
        cta: {
          label: 'Enter the Cathedral',
          action: '/journey',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'Demo — The Cathedral',
    description: 'Experience the Cathedral',
    keywords: ['demo', 'archetype', 'timeline', 'constellation'],
  },
};

// ==================== WIREFRAME 7: COMPARISON PAGE ====================

export const COMPARISON_WIREFRAME: PageWireframe = {
  id: 'comparison',
  name: 'The Divide',
  path: '/comparison',
  sections: [
    {
      id: 'headline',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'Not consulting.\nNot interpretation.\nNot tradition.',
      },
    },
    {
      id: 'matrix',
      type: 'matrix',
      layout: 'full-screen',
      content: {
        // Comparison matrix: Traditional vs MetaOS
      },
    },
    {
      id: 'anchor',
      type: 'statement',
      layout: 'centered',
      content: {
        body: 'They operate inside the lowest chamber of the Cathedral.\nYou operate across all 23.',
        cta: {
          label: 'See Pricing',
          action: '/pricing',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'Comparison — The Cathedral',
    description: 'A new metaphysics entirely.',
    keywords: ['comparison', 'traditional', 'MetaOS', 'difference'],
  },
};

// ==================== WIREFRAME 8: USE CASES PAGE ====================

export const USE_CASES_WIREFRAME: PageWireframe = {
  id: 'use-cases',
  name: 'The Application',
  path: '/use-cases',
  sections: [
    {
      id: 'tabs',
      type: 'grid',
      layout: 'columns-3',
      content: {
        items: [
          { id: 'founders', title: 'Founders', description: '', link: '#founders' },
          { id: 'organizations', title: 'Organizations', description: '', link: '#organizations' },
          { id: 'visionaries', title: 'Visionaries', description: '', link: '#visionaries' },
        ],
      },
    },
    {
      id: 'founders-panel',
      type: 'panels',
      layout: 'stacked',
      content: {
        items: [
          { id: 'team', title: 'Team alignment', description: '' },
          { id: 'hiring', title: 'Hiring metaphysics', description: '' },
          { id: 'timing', title: 'Strategic timing', description: '' },
          { id: 'culture', title: 'Culture architecture', description: '' },
        ],
        cta: {
          label: 'Begin Your Path',
          action: '/journey',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'Use Cases — The Cathedral',
    description: 'Applications of the MetaOS',
    keywords: ['use cases', 'founders', 'organizations', 'visionaries'],
  },
};

// ==================== WIREFRAME 9: PRICING PAGE ====================

export const PRICING_WIREFRAME: PageWireframe = {
  id: 'pricing',
  name: 'The Ascent',
  path: '/pricing',
  sections: [
    {
      id: 'headline',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'Ascend the Cathedral',
      },
    },
    {
      id: 'tiers',
      type: 'ladder',
      layout: 'stacked',
      content: {
        items: [
          { id: 'initiate', title: 'Initiate', description: 'Layers 1-4' },
          { id: 'adept', title: 'Adept', description: 'Layers 1-8' },
          { id: 'architect', title: 'Architect', description: 'Layers 1-12' },
          { id: 'enterprise', title: 'Enterprise', description: 'Layers 1-12' },
          { id: 'autonomous', title: 'Autonomous Governance', description: 'Layers 1-15' },
          { id: 'planetary', title: 'Planetary', description: 'Layers 1-18' },
          { id: 'interdimensional', title: 'Interdimensional', description: 'Layers 1-20' },
          { id: 'omniversal', title: 'Omniversal Sovereign', description: 'Layers 1-22' },
          { id: 'absolute', title: 'Absolute Architect', description: 'Layers 1-23' },
          { id: 'origin', title: 'Chamber of Origin', description: 'Invite-only' },
        ],
      },
    },
  ],
  metadata: {
    title: 'Pricing — The Cathedral',
    description: 'Ascend the Cathedral',
    keywords: ['pricing', 'tiers', 'layers', 'ascend'],
  },
};

// ==================== WIREFRAME 10: MANIFESTO PAGE ====================

export const MANIFESTO_WIREFRAME: PageWireframe = {
  id: 'manifesto',
  name: 'The Declaration',
  path: '/manifesto',
  sections: [
    {
      id: 'scroll',
      type: 'scroll',
      layout: 'full-screen',
      content: {
        // Full manifesto text as vertical scroll
        visual: {
          type: 'animation',
          config: {
            component: 'GenesisLine',
            behind: true,
            glowing: true,
          },
        },
      },
    },
  ],
  metadata: {
    title: 'Manifesto — The Cathedral',
    description: 'The age of architecture has begun.',
    keywords: ['manifesto', 'declaration', 'founder', 'vision'],
  },
};

// ==================== WIREFRAME 11: PILGRIM JOURNEY PAGE ====================

export const PILGRIM_JOURNEY_WIREFRAME: PageWireframe = {
  id: 'pilgrim-journey',
  name: 'The Path',
  path: '/journey',
  sections: [
    {
      id: 'stages',
      type: 'journey',
      layout: 'full-screen',
      content: {
        items: [
          { id: 'awakening', title: 'Awakening', description: '' },
          { id: 'alignment', title: 'Alignment', description: '' },
          { id: 'architecture', title: 'Architecture', description: '' },
          { id: 'governance', title: 'Governance', description: '' },
          { id: 'creation', title: 'Creation', description: '' },
          { id: 'primordial', title: 'Primordial', description: '' },
          { id: 'absolute', title: 'Absolute', description: '' },
          { id: 'void', title: 'Void', description: '' },
        ],
      },
      interactions: [
        { trigger: 'click', action: 'openStageModal', target: 'stageId' },
      ],
    },
  ],
  metadata: {
    title: 'Journey — The Cathedral',
    description: 'The Path of Ascent',
    keywords: ['journey', 'pilgrim', 'path', 'ascent', 'stages'],
  },
};

// ==================== WIREFRAME 12: DASHBOARD ====================

export const DASHBOARD_WIREFRAME: PageWireframe = {
  id: 'dashboard',
  name: 'The Inner Sanctum',
  path: '/dashboard',
  sections: [
    {
      id: 'top-bar',
      type: 'hero',
      layout: 'split',
      content: {
        items: [
          { id: 'sigil', title: '', description: '' },
          { id: 'layer-access', title: 'Layer Access', description: '' },
          { id: 'notifications', title: 'Notifications', description: '' },
          { id: 'profile', title: 'Profile', description: '' },
        ],
      },
    },
    {
      id: 'main-panels',
      type: 'panels',
      layout: 'columns-2',
      content: {
        items: [
          { id: 'archetype', title: 'Archetype Constellation', description: '' },
          { id: 'timeline', title: 'Timeline Simulation', description: '' },
          { id: 'org-map', title: 'Org Metaphysics Map', description: '' },
          { id: 'layer-tree', title: 'Layer Access Tree', description: '' },
          { id: 'rituals', title: 'Ritual Tasks', description: '' },
        ],
      },
    },
    {
      id: 'footer',
      type: 'cta',
      layout: 'centered',
      content: {
        cta: {
          label: 'Ascend deeper',
          action: '/pricing',
          style: 'secondary',
        },
      },
    },
  ],
  metadata: {
    title: 'Dashboard — The Cathedral',
    description: 'Your Inner Sanctum',
    keywords: ['dashboard', 'sanctum', 'archetype', 'timeline'],
  },
};

// ==================== WIREFRAME 13: MEMBERSHIP PAGE ====================

export const MEMBERSHIP_WIREFRAME: PageWireframe = {
  id: 'membership',
  name: 'The Community',
  path: '/membership',
  sections: [
    {
      id: 'headline',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'A community of architects, mystics, and sovereigns.',
      },
    },
    {
      id: 'benefits',
      type: 'grid',
      layout: 'columns-3',
      content: {
        items: [
          { id: 'transmissions', title: 'Monthly transmissions', description: '' },
          { id: 'labs', title: 'Reality architecture labs', description: '' },
          { id: 'workshops', title: 'Archetype workshops', description: '' },
          { id: 'councils', title: 'Timeline councils', description: '' },
          { id: 'engines', title: 'Access to new engines', description: '' },
          { id: 'community', title: 'Private community', description: '' },
        ],
        cta: {
          label: 'Join the Cathedral',
          action: '/join',
          style: 'primary',
        },
      },
    },
  ],
  metadata: {
    title: 'Membership — The Cathedral',
    description: 'Join the community',
    keywords: ['membership', 'community', 'architects', 'mystics'],
  },
};

// ==================== WIREFRAME 14: INITIATION PAGE ====================

export const INITIATION_WIREFRAME: PageWireframe = {
  id: 'initiation',
  name: 'The Beginning',
  path: '/initiation',
  sections: [
    {
      id: 'headline',
      type: 'statement',
      layout: 'centered',
      content: {
        headline: 'Begin your ascent.',
      },
    },
    {
      id: 'paths',
      type: 'cards',
      layout: 'columns-2',
      content: {
        items: [
          {
            id: 'briefing',
            title: 'Book a private briefing',
            description: 'A personal introduction to the Cathedral',
            link: '/book',
          },
          {
            id: 'origin',
            title: 'Apply for the Chamber of Origin',
            description: 'For those ready to architect reality',
            link: '/apply',
          },
        ],
      },
    },
  ],
  metadata: {
    title: 'Initiation — The Cathedral',
    description: 'Begin your ascent',
    keywords: ['initiation', 'begin', 'briefing', 'apply'],
  },
};

// ==================== ALL WIREFRAMES ====================

export const ALL_WIREFRAMES: PageWireframe[] = [
  HOMEPAGE_WIREFRAME,
  PROBLEM_WIREFRAME,
  SOLUTION_WIREFRAME,
  ARCHITECTURE_WIREFRAME,
  CHAMBER_WIREFRAME,
  DEMO_WIREFRAME,
  COMPARISON_WIREFRAME,
  USE_CASES_WIREFRAME,
  PRICING_WIREFRAME,
  MANIFESTO_WIREFRAME,
  PILGRIM_JOURNEY_WIREFRAME,
  DASHBOARD_WIREFRAME,
  MEMBERSHIP_WIREFRAME,
  INITIATION_WIREFRAME,
];

// ==================== COMPONENT REGISTRY ====================

export const COMPONENT_REGISTRY = {
  // Visual components
  CathedralSigil: 'Logo and brand mark',
  ExpandingHypergraph: 'Interactive hero diagram',
  CathedralDiagramSimple: 'Simplified 12-layer diagram',
  CathedralDiagramFull: 'Full 23-layer interactive diagram',
  ArchetypeConstellation: '3-archetype output visualization',
  TimelineSlider: 'Timeline simulation slider',
  OrgArchetypeMap: 'Team archetype mapping',
  GenesisLine: 'Central axis animation',
  ScrollSigil: 'Scroll indicator animation',

  // Layout components
  HeroSection: 'Full-screen hero with headline',
  CardGrid: 'Responsive card grid',
  ComparisonMatrix: 'Side-by-side comparison table',
  PricingLadder: 'Vertical tier progression',
  JourneyTimeline: '8-stage horizontal journey',
  ChamberPage: 'Individual layer detail page',
  DashboardPanels: 'User dashboard layout',
};

// ==================== HELPER FUNCTIONS ====================

export function getWireframeByPath(path: string): PageWireframe | undefined {
  return ALL_WIREFRAMES.find(w => w.path === path || w.path.startsWith(path.split('/')[1]));
}

export function getWireframeById(id: PageId): PageWireframe | undefined {
  return ALL_WIREFRAMES.find(w => w.id === id);
}
