/**
 * ============================================================================
 * USE SOULPARTNER SELECTION HOOK
 * ============================================================================
 * React hook for managing SoulPartner selection throughout the app.
 *
 * Features:
 * - Get active SoulPartner
 * - Switch between partners
 * - Access switch history
 * - Build prompts for active partner
 *
 * Usage:
 * const {
 *   activePartner,
 *   selectPreset,
 *   generateComplement,
 *   switchHistory,
 *   buildPrompt
 * } = useSoulPartnerSelection();
 *
 * Created: January 1, 2026
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * ============================================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { soulPartnerSelectionService } from '../services/soulPartnerSelectionService';
import { getPresetSummaries } from '../data/soulPartnerPresets';

/**
 * Hook for SoulPartner selection management
 * @param {object} userConstitution - User's constitutional profile (optional)
 */
export function useSoulPartnerSelection(userConstitution = null) {
  const { user } = useAuth();

  // State
  const [activePartner, setActivePartner] = useState(null);
  const [switchHistory, setSwitchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState(null);

  // Load active partner on mount
  useEffect(() => {
    if (user?.uid) {
      loadActivePartner();
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Load the active SoulPartner
   */
  const loadActivePartner = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const current = await soulPartnerSelectionService.getActiveSoulPartner(user.uid);
      setActivePartner(current);

      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);
    } catch (err) {
      console.error('Error loading SoulPartner:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Select a preset SoulPartner
   */
  const selectPreset = useCallback(async (presetId, note = '') => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    setSwitching(true);
    setError(null);

    try {
      const partner = await soulPartnerSelectionService.selectPreset(user.uid, presetId, note);

      const current = await soulPartnerSelectionService.getActiveSoulPartner(user.uid);
      setActivePartner(current);

      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);

      return partner;
    } catch (err) {
      console.error('Error selecting preset:', err);
      setError(err.message);
      return null;
    } finally {
      setSwitching(false);
    }
  }, [user?.uid]);

  /**
   * Generate a complementary SoulPartner
   */
  const generateComplement = useCallback(async (constitution = null, note = '') => {
    const profile = constitution || userConstitution;

    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    if (!profile) {
      setError('User constitution required for generation');
      return null;
    }

    setSwitching(true);
    setError(null);

    try {
      const partner = await soulPartnerSelectionService.selectGenerated(user.uid, profile, note);

      const current = await soulPartnerSelectionService.getActiveSoulPartner(user.uid);
      setActivePartner(current);

      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);

      return partner;
    } catch (err) {
      console.error('Error generating SoulPartner:', err);
      setError(err.message);
      return null;
    } finally {
      setSwitching(false);
    }
  }, [user?.uid, userConstitution]);

  /**
   * Select a saved profile as SoulPartner
   */
  const selectSavedProfile = useCallback(async (profileId, note = '') => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    setSwitching(true);
    setError(null);

    try {
      const partner = await soulPartnerSelectionService.selectSavedProfile(user.uid, profileId, note);

      const current = await soulPartnerSelectionService.getActiveSoulPartner(user.uid);
      setActivePartner(current);

      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);

      return partner;
    } catch (err) {
      console.error('Error selecting saved profile:', err);
      setError(err.message);
      return null;
    } finally {
      setSwitching(false);
    }
  }, [user?.uid]);

  /**
   * Build prompt for active SoulPartner
   */
  const buildPrompt = useCallback(async () => {
    if (!user?.uid) return '';

    try {
      return await soulPartnerSelectionService.buildActivePartnerPrompt(user.uid);
    } catch (err) {
      console.error('Error building prompt:', err);
      return '';
    }
  }, [user?.uid]);

  /**
   * Get available preset options
   */
  const presetOptions = useMemo(() => {
    return getPresetSummaries();
  }, []);

  /**
   * Get current partner info for display
   */
  const partnerInfo = useMemo(() => {
    if (!activePartner?.partner) {
      return {
        name: 'No SoulPartner',
        type: 'none',
        element: null,
        emoji: '👤'
      };
    }

    const p = activePartner.partner;
    return {
      name: p.name || 'Unknown',
      title: p.title || 'SoulPartner',
      type: activePartner.type,
      element: p.bazi?.dayMaster?.english || 'Unknown',
      sunSign: p.western?.sun?.sign || 'Unknown',
      birthPlace: p.soulOrigin?.birthPlace || 'Unknown',
      emoji: getEmoji(p.id)
    };
  }, [activePartner]);

  /**
   * Check if can generate complement
   */
  const canGenerate = useMemo(() => {
    return !!userConstitution;
  }, [userConstitution]);

  /**
   * Get switch count
   */
  const switchCount = useMemo(() => {
    return switchHistory.length;
  }, [switchHistory]);

  return {
    // State
    activePartner,
    partnerInfo,
    switchHistory,
    loading,
    switching,
    error,

    // Actions
    selectPreset,
    generateComplement,
    selectSavedProfile,
    buildPrompt,
    refresh: loadActivePartner,

    // Options
    presetOptions,
    canGenerate,
    switchCount
  };
}

/**
 * Get emoji for partner ID
 */
function getEmoji(partnerId) {
  const map = {
    'preset_sonnet': '🎭',
    'preset_luna': '🌙',
    'preset_phoenix': '🔥',
    'preset_river': '🌊',
    'preset_oak': '🌳'
  };
  return map[partnerId] || '💎';
}

export default useSoulPartnerSelection;
