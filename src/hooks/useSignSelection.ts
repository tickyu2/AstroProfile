/**
 * useSignSelection Hook
 *
 * React hook with reducer pattern for selecting two zodiac signs
 * for compatibility analysis in the Tropical Seasons visualization.
 */

import { useReducer, useCallback, useMemo } from 'react';
import { ZodiacSign, calculateEnhancedCompatibility, CompatibilityPayload } from '../data/tropicalSeasons';

// ============================================================================
// State & Action Types
// ============================================================================

export interface SignSelectionState {
  signA: ZodiacSign | null;
  signB: ZodiacSign | null;
}

export type SignSelectionAction =
  | { type: 'select'; sign: ZodiacSign }
  | { type: 'clear' }
  | { type: 'swap' }
  | { type: 'setA'; sign: ZodiacSign }
  | { type: 'setB'; sign: ZodiacSign }
  | { type: 'clearA' }
  | { type: 'clearB' };

// ============================================================================
// Initial State
// ============================================================================

const initialState: SignSelectionState = {
  signA: null,
  signB: null,
};

// ============================================================================
// Reducer
// ============================================================================

function signSelectionReducer(
  state: SignSelectionState,
  action: SignSelectionAction
): SignSelectionState {
  switch (action.type) {
    case 'select':
      // Smart selection: fills A first, then B
      // If both filled, replaces B (most recent selection)
      if (state.signA === null) {
        return { ...state, signA: action.sign };
      } else if (state.signB === null) {
        // Don't allow same sign for both
        if (state.signA === action.sign) {
          return state;
        }
        return { ...state, signB: action.sign };
      } else {
        // Both filled - replace B unless clicking on A's sign
        if (action.sign === state.signA) {
          return state;
        }
        return { ...state, signB: action.sign };
      }

    case 'clear':
      return initialState;

    case 'swap':
      if (state.signA && state.signB) {
        return { signA: state.signB, signB: state.signA };
      }
      return state;

    case 'setA':
      return { ...state, signA: action.sign };

    case 'setB':
      // Don't allow same sign for both
      if (action.sign === state.signA) {
        return state;
      }
      return { ...state, signB: action.sign };

    case 'clearA':
      return { ...state, signA: null };

    case 'clearB':
      return { ...state, signB: null };

    default:
      return state;
  }
}

// ============================================================================
// Hook Return Type
// ============================================================================

export interface UseSignSelectionReturn {
  // State
  signA: ZodiacSign | null;
  signB: ZodiacSign | null;

  // Derived state
  hasSelection: boolean;
  hasPair: boolean;
  compatibility: CompatibilityPayload | null;

  // Actions
  selectSign: (sign: ZodiacSign) => void;
  setSignA: (sign: ZodiacSign) => void;
  setSignB: (sign: ZodiacSign) => void;
  clearSignA: () => void;
  clearSignB: () => void;
  clearAll: () => void;
  swapSigns: () => void;

  // Utilities
  isSelected: (sign: ZodiacSign) => boolean;
  isSignA: (sign: ZodiacSign) => boolean;
  isSignB: (sign: ZodiacSign) => boolean;
  getSelectionIndex: (sign: ZodiacSign) => 'A' | 'B' | null;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useSignSelection(): UseSignSelectionReturn {
  const [state, dispatch] = useReducer(signSelectionReducer, initialState);

  // Actions
  const selectSign = useCallback((sign: ZodiacSign) => {
    dispatch({ type: 'select', sign });
  }, []);

  const setSignA = useCallback((sign: ZodiacSign) => {
    dispatch({ type: 'setA', sign });
  }, []);

  const setSignB = useCallback((sign: ZodiacSign) => {
    dispatch({ type: 'setB', sign });
  }, []);

  const clearSignA = useCallback(() => {
    dispatch({ type: 'clearA' });
  }, []);

  const clearSignB = useCallback(() => {
    dispatch({ type: 'clearB' });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  const swapSigns = useCallback(() => {
    dispatch({ type: 'swap' });
  }, []);

  // Utilities
  const isSelected = useCallback(
    (sign: ZodiacSign) => state.signA === sign || state.signB === sign,
    [state.signA, state.signB]
  );

  const isSignA = useCallback(
    (sign: ZodiacSign) => state.signA === sign,
    [state.signA]
  );

  const isSignB = useCallback(
    (sign: ZodiacSign) => state.signB === sign,
    [state.signB]
  );

  const getSelectionIndex = useCallback(
    (sign: ZodiacSign): 'A' | 'B' | null => {
      if (state.signA === sign) return 'A';
      if (state.signB === sign) return 'B';
      return null;
    },
    [state.signA, state.signB]
  );

  // Derived state
  const hasSelection = state.signA !== null || state.signB !== null;
  const hasPair = state.signA !== null && state.signB !== null;

  // Calculate compatibility when we have a pair
  const compatibility = useMemo(() => {
    if (state.signA && state.signB) {
      return calculateEnhancedCompatibility(state.signA, state.signB);
    }
    return null;
  }, [state.signA, state.signB]);

  return {
    // State
    signA: state.signA,
    signB: state.signB,

    // Derived state
    hasSelection,
    hasPair,
    compatibility,

    // Actions
    selectSign,
    setSignA,
    setSignB,
    clearSignA,
    clearSignB,
    clearAll,
    swapSigns,

    // Utilities
    isSelected,
    isSignA,
    isSignB,
    getSelectionIndex,
  };
}

export default useSignSelection;
