/**
 * ============================================================================
 * SOULPARTNER CHOOSER COMPONENT
 * ============================================================================
 * UI for selecting and managing SoulPartners during onboarding and settings.
 *
 * Features:
 * - Browse preset SoulPartners with full profiles
 * - Select auto-generated complementary partner
 * - Use saved profiles as SoulPartner
 * - View switch history
 * - Memory continuity notice
 *
 * Created: January 1, 2026
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { soulPartnerSelectionService } from '../services/soulPartnerSelectionService';
import { SOULPARTNER_PRESETS, getPresetSummaries } from '../data/soulPartnerPresets';

// Convert SOULPARTNER_PRESETS object to array for mapping
const PRESETS_ARRAY = Object.values(SOULPARTNER_PRESETS);

/**
 * Main SoulPartner Chooser Component
 */
export function SoulPartnerChooser({
  onSelect,
  userConstitution = null,
  showHistory = true,
  mode = 'full' // 'full' | 'compact' | 'onboarding'
}) {
  const { user } = useAuth();
  const [activePartner, setActivePartner] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [switchHistory, setSwitchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [view, setView] = useState('presets'); // 'presets' | 'generated' | 'saved' | 'history'
  const [expandedCard, setExpandedCard] = useState(null);

  // Load current partner and history on mount
  useEffect(() => {
    loadData();
  }, [user?.uid]);

  const loadData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const current = await soulPartnerSelectionService.getActiveSoulPartner(user.uid);
      setActivePartner(current);
      setSelectedId(current?.partnerId);

      if (showHistory) {
        const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
        setSwitchHistory(history.switches || []);
      }
    } catch (error) {
      console.error('Error loading SoulPartner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = async (presetId) => {
    if (!user?.uid || switching) return;

    setSwitching(true);
    try {
      const partner = await soulPartnerSelectionService.selectPreset(
        user.uid,
        presetId,
        `Selected ${PRESETS_ARRAY.find(p => p.id === presetId)?.name} as SoulPartner`
      );

      setSelectedId(presetId);
      setActivePartner({ type: 'preset', partnerId: presetId, partner });

      if (onSelect) {
        onSelect({ type: 'preset', partner });
      }

      // Reload history
      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);
    } catch (error) {
      console.error('Error selecting preset:', error);
    } finally {
      setSwitching(false);
    }
  };

  const handleGenerateComplement = async () => {
    if (!user?.uid || !userConstitution || switching) return;

    setSwitching(true);
    try {
      const partner = await soulPartnerSelectionService.selectGenerated(
        user.uid,
        userConstitution,
        'Generated complementary SoulPartner based on my constitution'
      );

      setSelectedId(`generated_${partner.id}`);
      setActivePartner({ type: 'generated', partnerId: partner.id, partner });

      if (onSelect) {
        onSelect({ type: 'generated', partner });
      }

      // Reload history
      const history = await soulPartnerSelectionService.getSwitchHistory(user.uid);
      setSwitchHistory(history.switches || []);
    } catch (error) {
      console.error('Error generating SoulPartner:', error);
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading SoulPartners...</span>
      </div>
    );
  }

  return (
    <div className="soulpartner-chooser max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Choose Your SoulPartner
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Your SoulPartner remembers everything across switches. Only the personality changes.
        </p>
      </div>

      {/* Memory Notice */}
      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🧠</span>
          <div>
            <h4 className="font-medium text-purple-800 dark:text-purple-200">
              Shared Memory Architecture
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              All SoulPartners share Brain 7 (Working Memory) & Brain 8 (Long-term KB).
              When you switch partners, your history and patterns are preserved.
              Only the soul personality changes - your memories stay intact.
            </p>
          </div>
        </div>
      </div>

      {/* Current Partner Display */}
      {activePartner && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg p-4 mb-6 border border-indigo-200 dark:border-indigo-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                Current SoulPartner
              </span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {activePartner.partner?.name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {activePartner.partner?.title || activePartner.type}
              </p>
            </div>
            <div className="text-4xl">
              {getPartnerEmoji(activePartner.partner?.id)}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setView('presets')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            view === 'presets'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Preset Partners (5)
        </button>
        <button
          onClick={() => setView('generated')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            view === 'generated'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Generate Custom
        </button>
        {showHistory && (
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              view === 'history'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Switch History ({switchHistory.length})
          </button>
        )}
      </div>

      {/* Presets View */}
      {view === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESETS_ARRAY.map((partner) => (
            <SoulPartnerCard
              key={partner.id}
              partner={partner}
              isSelected={selectedId === partner.id}
              isExpanded={expandedCard === partner.id}
              onSelect={() => handleSelectPreset(partner.id)}
              onExpand={() => setExpandedCard(expandedCard === partner.id ? null : partner.id)}
              switching={switching}
            />
          ))}
        </div>
      )}

      {/* Generated View */}
      {view === 'generated' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Auto-Generate Your Perfect Complement
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Based on your constitutional profile, we'll generate a SoulPartner
              whose elements, Day Master, and energy patterns perfectly complement yours.
            </p>

            {userConstitution ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your Constitution: <strong>{userConstitution.dayMaster || userConstitution.element}</strong>
                    {userConstitution.sunSign && ` • ${userConstitution.sunSign} Sun`}
                  </p>
                </div>
                <button
                  onClick={handleGenerateComplement}
                  disabled={switching}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {switching ? 'Generating...' : 'Generate My Complementary Partner'}
                </button>
              </>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200">
                  Complete your birth chart first to generate a complementary SoulPartner.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History View */}
      {view === 'history' && (
        <div className="space-y-3">
          {switchHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No switch history yet. Select a SoulPartner to begin.
            </div>
          ) : (
            switchHistory.map((record, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      {record.from?.partnerName || 'None'}
                    </span>
                    <span className="mx-3 text-gray-400">→</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {record.to?.partnerName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(record.timestamp)}
                  </span>
                </div>
                {record.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                    "{record.note}"
                  </p>
                )}
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {record.memoryNote}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual SoulPartner Card
 */
function SoulPartnerCard({ partner, isSelected, isExpanded, onSelect, onExpand, switching }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-purple-500 shadow-lg shadow-purple-100 dark:shadow-purple-900/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
      }`}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{getPartnerEmoji(partner.id)}</span>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                {partner.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {partner.title}
              </p>
            </div>
          </div>
          {isSelected && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {partner.bazi?.dayMaster?.english || 'Unknown Element'}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {partner.western?.sun?.sign || 'Unknown'} Sun
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {partner.soulOrigin?.birthPlace?.split(',')[0] || 'Unknown'}
          </span>
        </div>

        {/* Soul Story Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
          {typeof partner.soulStory === 'string' ? partner.soulStory : partner.soulStory?.narrative || partner.presetDescription}
        </p>

        {/* Best For */}
        {partner.bestFor && (
          <div className="mt-3">
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Best for: {partner.bestFor.elements?.join(', ')} users
            </span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
          {/* BaZi Details */}
          {partner.bazi && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                BaZi Constitution
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Day Master: {partner.bazi.dayMaster?.stem} {partner.bazi.dayMaster?.pinyin}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {partner.bazi.dayMaster?.meaning}
              </p>
            </div>
          )}

          {/* Personality Traits */}
          {partner.personality?.traits && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Personality
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {partner.personality.traits.slice(0, 3).map((trait, i) => (
                  <li key={i}>• {trait}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Soul Origin */}
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Born: {partner.soulOrigin?.birthDate} • {partner.soulOrigin?.birthPlace}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onExpand}
          className="flex-1 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
        <button
          onClick={onSelect}
          disabled={isSelected || switching}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 cursor-default'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {switching ? 'Switching...' : isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}

/**
 * Get emoji for partner
 */
function getPartnerEmoji(partnerId) {
  const emojiMap = {
    'preset_sonnet': '🎭',     // Paris artist
    'preset_luna': '🌙',       // Moon/Kyoto
    'preset_phoenix': '🔥',    // Vienna fire
    'preset_river': '🌊',      // Shanghai water
    'preset_oak': '🌳',        // Edinburgh wood
  };
  return emojiMap[partnerId] || '💎';
}

/**
 * Format date for display
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default SoulPartnerChooser;
