/**
 * ============================================
 * ANCESTRAL TEMPLE NAVIGATION MAP
 * Routing + topology layer for the Ancestral Temple UI
 *
 * This provides:
 * - Structured navigation tree
 * - Route definitions
 * - Chamber descriptions
 * - Breadcrumb generation
 * - Navigation state helpers
 * ============================================
 */

// ==================== DATA MODEL ====================

export interface TempleNode {
  id: string;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  route: string;
  icon?: string;
  children?: TempleNode[];
  requiredInitiation?: boolean;
  chamberType?: 'engine' | 'ui' | 'ritual' | 'codex' | 'persona';
}

export interface TempleNavigationMap {
  root: TempleNode;
  version: string;
}

export interface Breadcrumb {
  id: string;
  label: string;
  labelZh: string;
  route: string;
}

export interface NavigationState {
  currentNodeId: string;
  breadcrumbs: Breadcrumb[];
  availableRoutes: string[];
  isInitiated: boolean;
}

// ==================== NAVIGATION MAP ====================

export const ANCESTRAL_TEMPLE_NAVIGATION: TempleNavigationMap = {
  version: '1.0.0',
  root: {
    id: 'ancestral_temple',
    label: 'Ancestral Temple',
    labelZh: '祖系圣殿',
    description: 'Unified ancestral chamber of lineage, memory, and mythos.',
    descriptionZh: '血脉、记忆与神话的统一祖系圣殿。',
    route: '/temple',
    icon: '🏛️',
    children: [
      {
        id: 'generational_ladder',
        label: 'Generational Ladder',
        labelZh: '世代阶梯',
        description: 'Stacked generational narratives across your lineage.',
        descriptionZh: '跨越你血脉的堆叠世代叙事。',
        route: '/temple/ladder',
        icon: '📊',
        chamberType: 'ui'
      },
      {
        id: 'generational_constellation',
        label: 'Generational Constellation',
        labelZh: '世代星图',
        description: 'Lineage star-map of relationships and connections.',
        descriptionZh: '血脉关系与连接的星图。',
        route: '/temple/constellation',
        icon: '✨',
        chamberType: 'ui'
      },
      {
        id: 'ancestral_threads',
        label: 'Ancestral Threads',
        labelZh: '祖系丝线',
        description: 'Themes carried across generations.',
        descriptionZh: '跨越世代传承的主题。',
        route: '/temple/threads',
        icon: '🧵',
        chamberType: 'engine'
      },
      {
        id: 'pilgrim_position',
        label: 'Your Place in the Lineage',
        labelZh: '你在血脉中的位置',
        description: 'Inherited, broken, and new patterns you carry.',
        descriptionZh: '你承载的继承、断裂与新生的模式。',
        route: '/temple/position',
        icon: '🧭',
        chamberType: 'engine'
      },
      {
        id: 'dialogue_engine',
        label: 'Pilgrim-Ancestor Dialogue',
        labelZh: '行者-祖先对话',
        description: 'Conversational bridge between pilgrim and lineage.',
        descriptionZh: '行者与血脉之间的对话桥梁。',
        route: '/temple/dialogue',
        icon: '💬',
        chamberType: 'persona',
        requiredInitiation: true
      },
      {
        id: 'healing_path',
        label: 'Generational Healing Path',
        labelZh: '世代疗愈之路',
        description: 'Multi-step ritual journey of ancestral healing.',
        descriptionZh: '多步骤的祖系疗愈仪式旅程。',
        route: '/temple/healing',
        icon: '🌿',
        chamberType: 'ritual',
        requiredInitiation: true
      },
      {
        id: 'ritual_timing',
        label: 'Ritual Timing Engine',
        labelZh: '仪式时机引擎',
        description: 'When rituals activate based on BaZi timing.',
        descriptionZh: '基于八字时机的仪式激活时间。',
        route: '/temple/timing',
        icon: '⏰',
        chamberType: 'engine'
      },
      {
        id: 'mythos_codex',
        label: 'Mythos Codex',
        labelZh: '神话典籍',
        description: 'Archetype scripture of your lineage.',
        descriptionZh: '你血脉的原型经典。',
        route: '/temple/mythos',
        icon: '📜',
        chamberType: 'codex'
      },
      {
        id: 'initiation',
        label: 'Initiation Chamber',
        labelZh: '启蒙圣所',
        description: 'The sacred space of ancestral initiation.',
        descriptionZh: '祖系启蒙的神圣空间。',
        route: '/temple/initiation',
        icon: '🕯️',
        chamberType: 'ritual'
      },
      {
        id: 'timeline',
        label: 'Lineage Timeline',
        labelZh: '血脉时间线',
        description: 'Chronological view of generational events.',
        descriptionZh: '世代事件的时间顺序视图。',
        route: '/temple/timeline',
        icon: '📅',
        chamberType: 'ui'
      }
    ]
  }
};

// ==================== NAVIGATION HELPERS ====================

/**
 * Find a node by its ID
 */
export function findNodeById(nodeId: string, root: TempleNode = ANCESTRAL_TEMPLE_NAVIGATION.root): TempleNode | null {
  if (root.id === nodeId) return root;

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(nodeId, child);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a node by its route
 */
export function findNodeByRoute(route: string, root: TempleNode = ANCESTRAL_TEMPLE_NAVIGATION.root): TempleNode | null {
  if (root.route === route) return root;

  if (root.children) {
    for (const child of root.children) {
      const found = findNodeByRoute(route, child);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Build breadcrumbs for a given node
 */
export function buildBreadcrumbs(nodeId: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [];
  const root = ANCESTRAL_TEMPLE_NAVIGATION.root;

  // Always start with the root
  breadcrumbs.push({
    id: root.id,
    label: root.label,
    labelZh: root.labelZh,
    route: root.route
  });

  if (nodeId === root.id) return breadcrumbs;

  // Find the node and build path
  const node = findNodeById(nodeId);
  if (node) {
    breadcrumbs.push({
      id: node.id,
      label: node.label,
      labelZh: node.labelZh,
      route: node.route
    });
  }

  return breadcrumbs;
}

/**
 * Get all available routes
 */
export function getAllRoutes(root: TempleNode = ANCESTRAL_TEMPLE_NAVIGATION.root): string[] {
  const routes: string[] = [root.route];

  if (root.children) {
    root.children.forEach(child => {
      routes.push(...getAllRoutes(child));
    });
  }

  return routes;
}

/**
 * Get nodes by chamber type
 */
export function getNodesByChamberType(
  chamberType: TempleNode['chamberType'],
  root: TempleNode = ANCESTRAL_TEMPLE_NAVIGATION.root
): TempleNode[] {
  const nodes: TempleNode[] = [];

  if (root.chamberType === chamberType) {
    nodes.push(root);
  }

  if (root.children) {
    root.children.forEach(child => {
      nodes.push(...getNodesByChamberType(chamberType, child));
    });
  }

  return nodes;
}

/**
 * Get nodes that require initiation
 */
export function getInitiationRequiredNodes(): TempleNode[] {
  const nodes: TempleNode[] = [];
  const root = ANCESTRAL_TEMPLE_NAVIGATION.root;

  if (root.children) {
    root.children.forEach(child => {
      if (child.requiredInitiation) {
        nodes.push(child);
      }
    });
  }

  return nodes;
}

/**
 * Build navigation state
 */
export function buildNavigationState(
  currentNodeId: string,
  isInitiated: boolean
): NavigationState {
  return {
    currentNodeId,
    breadcrumbs: buildBreadcrumbs(currentNodeId),
    availableRoutes: getAllRoutes(),
    isInitiated
  };
}

/**
 * Check if a route is accessible
 */
export function isRouteAccessible(route: string, isInitiated: boolean): boolean {
  const node = findNodeByRoute(route);
  if (!node) return false;

  if (node.requiredInitiation && !isInitiated) {
    return false;
  }

  return true;
}

/**
 * Get next available routes from current position
 */
export function getNextRoutes(currentRoute: string): string[] {
  const node = findNodeByRoute(currentRoute);
  if (!node) return [];

  if (node.children) {
    return node.children.map(c => c.route);
  }

  // If at a leaf node, return sibling routes
  const root = ANCESTRAL_TEMPLE_NAVIGATION.root;
  if (root.children) {
    return root.children
      .filter(c => c.route !== currentRoute)
      .map(c => c.route);
  }

  return [];
}

/**
 * Format navigation for display
 */
export function formatNavigationForDisplay(lang: 'en' | 'zh' = 'en'): string {
  const lines: string[] = [];
  const root = ANCESTRAL_TEMPLE_NAVIGATION.root;

  lines.push(`${root.icon || ''} ${lang === 'zh' ? root.labelZh : root.label}`);
  lines.push(`   ${lang === 'zh' ? root.descriptionZh : root.description}`);
  lines.push('');

  if (root.children) {
    root.children.forEach(child => {
      const label = lang === 'zh' ? child.labelZh : child.label;
      const desc = lang === 'zh' ? child.descriptionZh : child.description;
      const initRequired = child.requiredInitiation ? ' [需启蒙/Initiation Required]' : '';

      lines.push(`  ${child.icon || '•'} ${label}${initRequired}`);
      lines.push(`      ${desc}`);
      lines.push(`      Route: ${child.route}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

// ==================== EXPORTS ====================

export {
  ANCESTRAL_TEMPLE_NAVIGATION,
  findNodeById,
  findNodeByRoute,
  buildBreadcrumbs,
  getAllRoutes,
  getNodesByChamberType,
  getInitiationRequiredNodes,
  buildNavigationState,
  isRouteAccessible,
  getNextRoutes,
  formatNavigationForDisplay
};
