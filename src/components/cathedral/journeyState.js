/**
 * journeyState.js
 *
 * State persistence for the Pilgrim Journey.
 * Handles local storage caching and backend synchronization.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const LOCAL_STORAGE_KEY = 'pilgrimJourneyState';
const BACKEND_SYNC_DEBOUNCE_MS = 2000;

// ============================================================================
// JOURNEY STATE STRUCTURE
// ============================================================================

/**
 * @typedef {Object} JourneyState
 * @property {string} currentRoute - Current route ID
 * @property {string} path - Current journey path (pilgrim/architect/sovereign)
 * @property {string[]} completedRoutes - Array of completed route IDs
 * @property {Object} chamberData - Per-chamber state data
 * @property {string} personaRole - Current persona voice role
 * @property {string} lastUpdated - ISO timestamp
 * @property {number} version - State schema version
 */

/**
 * Default journey state
 */
export const DEFAULT_JOURNEY_STATE = {
  currentRoute: 'birth',
  path: 'pilgrim',
  completedRoutes: [],
  chamberData: {},
  personaRole: 'mentor',
  lastUpdated: new Date().toISOString(),
  version: 1,
};

// ============================================================================
// LOCAL STORAGE OPERATIONS
// ============================================================================

/**
 * Load journey state from localStorage
 * @returns {JourneyState|null}
 */
export function loadLocalJourneyState() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw);

    // Validate state structure
    if (!state.currentRoute || !state.path) {
      console.warn('[JourneyState] Invalid local state, returning null');
      return null;
    }

    return state;
  } catch (error) {
    console.error('[JourneyState] Error loading local state:', error);
    return null;
  }
}

/**
 * Save journey state to localStorage
 * @param {JourneyState} state
 */
export function saveLocalJourneyState(state) {
  try {
    const stateWithTimestamp = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateWithTimestamp));
    return true;
  } catch (error) {
    console.error('[JourneyState] Error saving local state:', error);
    return false;
  }
}

/**
 * Clear local journey state
 */
export function clearLocalJourneyState() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('[JourneyState] Error clearing local state:', error);
    return false;
  }
}

// ============================================================================
// BACKEND OPERATIONS
// ============================================================================

/**
 * Fetch journey state from backend
 * @param {string} userId
 * @returns {Promise<JourneyState|null>}
 */
export async function fetchJourneyState(userId) {
  try {
    const response = await fetch(`/api/journey/${userId}`);

    if (!response.ok) {
      if (response.status === 404) {
        // No saved state for this user
        return null;
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    const state = await response.json();
    return state;
  } catch (error) {
    console.error('[JourneyState] Error fetching from backend:', error);
    return null;
  }
}

/**
 * Persist journey state to backend
 * @param {string} userId
 * @param {JourneyState} state
 * @returns {Promise<boolean>}
 */
export async function persistJourneyState(userId, state) {
  try {
    const response = await fetch(`/api/journey/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...state,
        lastUpdated: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('[JourneyState] Error persisting to backend:', error);
    return false;
  }
}

// ============================================================================
// HYBRID STATE MANAGEMENT
// ============================================================================

let syncTimeout = null;

/**
 * Load journey state with fallback strategy:
 * 1. Try backend first
 * 2. Fall back to localStorage
 * 3. Return default if neither exists
 *
 * @param {string} userId
 * @returns {Promise<JourneyState>}
 */
export async function loadJourneyState(userId) {
  // Try backend first
  const backendState = await fetchJourneyState(userId);

  if (backendState) {
    // Cache to local
    saveLocalJourneyState(backendState);
    return backendState;
  }

  // Fall back to local
  const localState = loadLocalJourneyState();

  if (localState) {
    // Sync local to backend in background
    persistJourneyState(userId, localState);
    return localState;
  }

  // Return default
  return { ...DEFAULT_JOURNEY_STATE };
}

/**
 * Save journey state to both local and backend (with debounce)
 *
 * @param {string} userId
 * @param {JourneyState} state
 * @param {Object} options
 * @param {boolean} options.immediate - Skip debounce for backend sync
 */
export function saveJourneyState(userId, state, { immediate = false } = {}) {
  // Always save locally immediately
  saveLocalJourneyState(state);

  // Debounce backend sync
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  if (immediate) {
    persistJourneyState(userId, state);
  } else {
    syncTimeout = setTimeout(() => {
      persistJourneyState(userId, state);
    }, BACKEND_SYNC_DEBOUNCE_MS);
  }
}

// ============================================================================
// STATE UPDATE HELPERS
// ============================================================================

/**
 * Update current route
 */
export function updateCurrentRoute(state, routeId) {
  return {
    ...state,
    currentRoute: routeId,
  };
}

/**
 * Mark a route as completed
 */
export function markRouteCompleted(state, routeId) {
  if (state.completedRoutes.includes(routeId)) {
    return state;
  }

  return {
    ...state,
    completedRoutes: [...state.completedRoutes, routeId],
  };
}

/**
 * Update chamber-specific data
 */
export function updateChamberData(state, chamberId, data) {
  return {
    ...state,
    chamberData: {
      ...state.chamberData,
      [chamberId]: {
        ...state.chamberData[chamberId],
        ...data,
      },
    },
  };
}

/**
 * Change journey path
 */
export function changePath(state, newPath) {
  return {
    ...state,
    path: newPath,
    // Optionally reset to appropriate starting point
    // currentRoute: 'birth',
  };
}

/**
 * Update persona role
 */
export function updatePersonaRole(state, role) {
  return {
    ...state,
    personaRole: role,
  };
}

/**
 * Reset journey to beginning
 */
export function resetJourney(path = 'pilgrim') {
  return {
    ...DEFAULT_JOURNEY_STATE,
    path,
    lastUpdated: new Date().toISOString(),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  loadJourneyState,
  saveJourneyState,
  loadLocalJourneyState,
  saveLocalJourneyState,
  clearLocalJourneyState,
  fetchJourneyState,
  persistJourneyState,
  updateCurrentRoute,
  markRouteCompleted,
  updateChamberData,
  changePath,
  updatePersonaRole,
  resetJourney,
  DEFAULT_JOURNEY_STATE,
};
