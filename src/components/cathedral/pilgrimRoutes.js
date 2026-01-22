/**
 * pilgrimRoutes.js
 *
 * Route configuration for the global Pilgrim Journey through the Cathedral.
 * Defines all chambers, their paths, and gating requirements.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// PILGRIM PATH TYPES
// ============================================================================

/**
 * Available journey paths:
 * - pilgrim: Standard journey through all foundational chambers
 * - architect: Technical/analytical path with deeper system access
 * - sovereign: Complete path including advanced sovereign chambers
 */
export const PILGRIM_PATHS = {
  PILGRIM: 'pilgrim',
  ARCHITECT: 'architect',
  SOVEREIGN: 'sovereign',
};

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

/**
 * All available chambers in the Cathedral journey.
 * Each route includes:
 * - id: Unique identifier
 * - label: Display name
 * - description: Brief explanation
 * - paths: Which journey paths include this chamber
 * - requires: Optional gating (previous chambers that must be completed)
 */
export const PILGRIM_ROUTES = [
  {
    id: 'birth',
    label: 'Birth Chart',
    description: 'Your celestial blueprint at the moment of birth',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: [],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Core elements, modalities, and planetary placements',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: ['birth'],
  },
  {
    id: 'persona',
    label: 'Persona',
    description: 'Your masks, archetypes, and social identity',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: ['foundations'],
  },
  {
    id: 'ritual',
    label: 'Ritual',
    description: 'Sacred practices aligned with your chart',
    paths: ['pilgrim', 'sovereign'],
    requires: ['persona'],
  },
  {
    id: 'ancestral',
    label: 'Ancestral',
    description: 'Generational patterns and lineage healing',
    paths: ['pilgrim', 'sovereign'],
    requires: ['ritual'],
  },
  {
    id: 'mythos',
    label: 'Mythos',
    description: 'Your personal mythology and heroic narrative',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: ['persona'], // Architect path skips ritual/ancestral
  },
  {
    id: 'relationships',
    label: 'Relationships',
    description: 'Compatibility and soul connections',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: ['mythos'],
  },
  {
    id: 'timing',
    label: 'Timing',
    description: 'Transits, progressions, and life cycles',
    paths: ['architect', 'sovereign'],
    requires: ['relationships'],
  },
  {
    id: 'sovereign',
    label: 'Sovereign Path',
    description: 'Advanced integration and mastery',
    paths: ['sovereign'],
    requires: ['timing'],
  },
  {
    id: 'completion',
    label: 'Completion',
    description: 'Journey integration and next steps',
    paths: ['pilgrim', 'architect', 'sovereign'],
    requires: [], // Terminal node, dynamically determined
  },
];

// ============================================================================
// ROUTE HELPERS
// ============================================================================

/**
 * Get routes filtered by path
 */
export function getRoutesForPath(path) {
  return PILGRIM_ROUTES.filter(
    (route) => route.paths.includes(path)
  );
}

/**
 * Get next route in a given path
 */
export function getNextRoute(currentId, path) {
  const pathRoutes = getRoutesForPath(path);
  const currentIndex = pathRoutes.findIndex((r) => r.id === currentId);

  if (currentIndex === -1 || currentIndex >= pathRoutes.length - 1) {
    return null;
  }

  return pathRoutes[currentIndex + 1];
}

/**
 * Get previous route in a given path
 */
export function getPreviousRoute(currentId, path) {
  const pathRoutes = getRoutesForPath(path);
  const currentIndex = pathRoutes.findIndex((r) => r.id === currentId);

  if (currentIndex <= 0) {
    return null;
  }

  return pathRoutes[currentIndex - 1];
}

/**
 * Check if a route is accessible (all requirements met)
 */
export function isRouteAccessible(routeId, completedRoutes = []) {
  const route = PILGRIM_ROUTES.find((r) => r.id === routeId);

  if (!route) return false;
  if (route.requires.length === 0) return true;

  return route.requires.every((reqId) => completedRoutes.includes(reqId));
}

/**
 * Get route by ID
 */
export function getRouteById(routeId) {
  return PILGRIM_ROUTES.find((r) => r.id === routeId) || null;
}

/**
 * Get progress percentage for a path
 */
export function getPathProgress(completedRoutes, path) {
  const pathRoutes = getRoutesForPath(path);
  const completedInPath = completedRoutes.filter((id) =>
    pathRoutes.some((r) => r.id === id)
  );

  return Math.round((completedInPath.length / pathRoutes.length) * 100);
}

// ============================================================================
// JOURNEY MAP DATA
// ============================================================================

/**
 * Simplified map for UI display
 */
export const PILGRIM_JOURNEY_MAP = PILGRIM_ROUTES.map((route) => ({
  id: route.id,
  label: route.label,
}));

/**
 * Get journey map for a specific path
 */
export function getJourneyMapForPath(path) {
  return getRoutesForPath(path).map((route) => ({
    id: route.id,
    label: route.label,
    description: route.description,
  }));
}

export default PILGRIM_ROUTES;
