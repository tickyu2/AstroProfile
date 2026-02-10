/**
 * GENESIS - Seasonal Ecological Psychology Engine
 * React Hooks
 *
 * Custom hooks for:
 * - Loading seasonal personality data
 * - Managing science note state
 * - Calculating sign profiles
 * - Async data loading
 */

import { useMemo, useState, useEffect } from 'react';
import {
  SeasonalPersonalityPanel,
  SignPersonalityProfile,
  StudyWheelTab
} from '../types/seasonalEcology';
import { createSeasonalPersonalityPanel } from '../factories/seasonalEcologyFactories';
import { getSignProfile, getSignByDegree } from '../data/allZodiacSigns';

// ============================================================================
// BASIC SEASONAL PERSONALITY HOOK
// ============================================================================

/**
 * Create a seasonal personality panel with optional overrides
 */
export function useSeasonalPersonality(
  initial?: Partial<SeasonalPersonalityPanel>
): SeasonalPersonalityPanel {
  return useMemo(
    () => createSeasonalPersonalityPanel(initial),
    [JSON.stringify(initial)]
  );
}

// ============================================================================
// SIGN PROFILE HOOK (by name)
// ============================================================================

/**
 * Get sign profile by name (e.g., "taurus")
 */
export function useSignProfile(signName: string): SignPersonalityProfile | undefined {
  return useMemo(
    () => getSignProfile(signName),
    [signName]
  );
}

// ============================================================================
// SIGN PROFILE HOOK (by degree)
// ============================================================================

/**
 * Get sign profile by absolute degree (0-360)
 */
export function useSignByDegree(degree: number): SignPersonalityProfile | undefined {
  return useMemo(
    () => getSignByDegree(degree),
    [degree]
  );
}

// ============================================================================
// SCIENCE NOTES STATE HOOK
// ============================================================================

/**
 * Manage expanded/collapsed state for science notes across all tabs
 */
export function useScienceNotesState(defaultTab?: StudyWheelTab) {
  const [expandedNotes, setExpandedNotes] = useState<Record<StudyWheelTab, boolean>>({
    seasons: false,
    modes: false,
    elements: false,
    signs: false,
    table: false
  });

  const toggleNote = (tab: StudyWheelTab) => {
    setExpandedNotes(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  const expandAll = () => {
    setExpandedNotes({
      seasons: true,
      modes: true,
      elements: true,
      signs: true,
      table: true
    });
  };

  const collapseAll = () => {
    setExpandedNotes({
      seasons: false,
      modes: false,
      elements: false,
      signs: false,
      table: false
    });
  };

  return {
    expandedNotes,
    toggleNote,
    expandAll,
    collapseAll,
    isExpanded: (tab: StudyWheelTab) => expandedNotes[tab]
  };
}

// ============================================================================
// ASYNC DATA LOADER HOOK
// ============================================================================

/**
 * Load seasonal personality data from API with loading/error states
 */
export function useSeasonalPersonalityData(apiEndpoint?: string) {
  const [data, setData] = useState<SeasonalPersonalityPanel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiEndpoint) return;

    setLoading(true);
    setError(null);

    fetch(apiEndpoint)
      .then(res => res.json())
      .then(json => {
        // For now, just use the panel factory - parser can be added later
        const validated = createSeasonalPersonalityPanel(json);
        setData(validated);
      })
      .catch(err => {
        setError(err);
        console.error('Failed to load seasonal personality data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiEndpoint]);

  return { data, loading, error };
}

// ============================================================================
// STUDY WHEEL TAB HOOK
// ============================================================================

/**
 * Manage active tab state for Study the Wheel interface
 */
export function useStudyWheelTab(defaultTab: StudyWheelTab = 'seasons') {
  const [activeTab, setActiveTab] = useState<StudyWheelTab>(defaultTab);

  return {
    activeTab,
    setActiveTab,
    isActive: (tab: StudyWheelTab) => activeTab === tab
  };
}

// ============================================================================
// DEGREE ANIMATION HOOK
// ============================================================================

/**
 * Smoothly animate degree changes for wheel transitions
 */
export function useAnimatedDegree(targetDegree: number, speed: number = 0.15) {
  const [currentDegree, setCurrentDegree] = useState(targetDegree);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setCurrentDegree(prev => {
        const diff = targetDegree - prev;
        if (Math.abs(diff) < 0.01) return targetDegree;
        return prev + diff * speed;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [targetDegree, speed]);

  return currentDegree;
}

// ============================================================================
// WHEEL INTERACTION HOOK
// ============================================================================

/**
 * Manage wheel click and hover interactions
 */
export function useWheelInteraction() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<number>(0);

  const handleSignHover = (sign: string | null) => {
    setHoveredSign(sign);
  };

  const handleSignClick = (sign: string, degree: number) => {
    setSelectedSign(sign);
    setSelectedDegree(degree);
  };

  const clearSelection = () => {
    setSelectedSign(null);
    setSelectedDegree(0);
  };

  return {
    hoveredSign,
    selectedSign,
    selectedDegree,
    handleSignHover,
    handleSignClick,
    clearSelection
  };
}

// ============================================================================
// MULTI-SIGN COMPARISON HOOK
// ============================================================================

/**
 * Compare multiple zodiac signs
 */
export function useSignComparison(signNames: string[]) {
  const profiles = useMemo(
    () => signNames.map(name => getSignProfile(name)).filter(Boolean) as SignPersonalityProfile[],
    [signNames.join(',')]
  );

  const commonElements = useMemo(() => {
    if (profiles.length === 0) return [];
    const elements = profiles.map(p => p.panel.element.code);
    return [...new Set(elements)];
  }, [profiles]);

  const commonModalities = useMemo(() => {
    if (profiles.length === 0) return [];
    const modalities = profiles.map(p => p.panel.modality.code);
    return [...new Set(modalities)];
  }, [profiles]);

  return {
    profiles,
    commonElements,
    commonModalities,
    count: profiles.length
  };
}
