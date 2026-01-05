/**
 * ============================================================================
 * CHAT CONTEXT SELECTOR
 * ============================================================================
 * Dual dropdown component for selecting:
 * - "Chatting As" - which profile the user represents
 * - "Chatting With" - which SoulPartner or profile they're talking to
 *
 * Features:
 * - Search functionality for quick filtering
 * - Preset SoulPartners (Sonnet, Luna, Phoenix, River, Oak)
 * - User's saved profiles as chat partners
 * - Visual indicator of current selections
 *
 * Created: January 1, 2026
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * ============================================================================
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SOULPARTNER_PRESETS, getAllPresets } from '../data/soulPartnerPresets';

// Get all preset partners as array
const PRESETS_ARRAY = Object.values(SOULPARTNER_PRESETS);

/**
 * Search input component with clear button
 */
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-3 py-2 pl-8 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-white/40"
      />
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Dropdown option item
 */
function OptionItem({ item, isSelected, onClick, type }) {
  const isPreset = type === 'preset';
  const initials = item.name?.charAt(0)?.toUpperCase() || item.firstName?.charAt(0)?.toUpperCase() || '?';
  const displayName = item.name || item.presetName || item.displayName || item.firstName || 'Unknown';
  const subtitle = isPreset
    ? item.archetype || item.presetDescription?.slice(0, 40) + '...'
    : item.relationshipType || item.chineseZodiac?.fullSign || '';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
        isSelected
          ? 'bg-amber-500/30 border border-amber-500/50'
          : 'hover:bg-slate-700/50 border border-transparent'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isPreset
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
          : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
      }`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white/90 truncate">{displayName}</div>
        {subtitle && (
          <div className="text-xs text-white/50 truncate">{subtitle}</div>
        )}
      </div>
      {isSelected && (
        <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

/**
 * Dropdown panel with search and options
 */
function DropdownPanel({
  isOpen,
  onClose,
  options,
  presets,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  title,
  showPresets = false
}) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter options by search query
  const filteredOptions = options.filter(opt => {
    const name = (opt.name || opt.displayName || opt.firstName || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredPresets = showPresets ? presets.filter(preset => {
    const name = (preset.name || preset.presetName || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  }) : [];

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={`Search ${title.toLowerCase()}...`}
        />
      </div>

      {/* Options list */}
      <div className="max-h-64 overflow-y-auto p-2 space-y-1">
        {/* Presets section */}
        {showPresets && filteredPresets.length > 0 && (
          <>
            <div className="px-3 py-1 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              AI SoulPartners
            </div>
            {filteredPresets.map(preset => (
              <OptionItem
                key={preset.id}
                item={preset}
                isSelected={selectedId === preset.id}
                onClick={() => {
                  onSelect(preset.id, 'preset', preset);
                  onClose();
                }}
                type="preset"
              />
            ))}
          </>
        )}

        {/* Profiles section */}
        {filteredOptions.length > 0 && (
          <>
            {showPresets && filteredPresets.length > 0 && (
              <div className="px-3 py-1 pt-3 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Saved Profiles
              </div>
            )}
            {filteredOptions.map(opt => (
              <OptionItem
                key={opt.id}
                item={opt}
                isSelected={selectedId === opt.id}
                onClick={() => {
                  onSelect(opt.id, 'profile', opt);
                  onClose();
                }}
                type="profile"
              />
            ))}
          </>
        )}

        {/* No results */}
        {filteredOptions.length === 0 && filteredPresets.length === 0 && (
          <div className="text-center py-4 text-white/40 text-sm">
            No matches found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Chat Context Selector Component
 */
export function ChatContextSelector({
  profiles = [],
  selectedChattingAsId,
  selectedChattingWithId,
  selectedChattingWithType = 'preset', // 'preset' or 'profile'
  onChattingAsChange,
  onChattingWithChange,
  loading = false
}) {
  const [showChattingAsDropdown, setShowChattingAsDropdown] = useState(false);
  const [showChattingWithDropdown, setShowChattingWithDropdown] = useState(false);
  const [chattingAsSearch, setChattingAsSearch] = useState('');
  const [chattingWithSearch, setChattingWithSearch] = useState('');

  // Get current selections for display
  const chattingAsProfile = profiles.find(p => p.id === selectedChattingAsId);
  const chattingAsDisplay = chattingAsProfile?.displayName || chattingAsProfile?.firstName || 'Select Profile';

  // Get "Chatting With" display - could be preset or profile
  const chattingWithDisplay = useMemo(() => {
    if (selectedChattingWithType === 'preset') {
      const preset = PRESETS_ARRAY.find(p => p.id === selectedChattingWithId);
      return preset?.name || preset?.presetName || 'Brother Sonnet';
    } else {
      const profile = profiles.find(p => p.id === selectedChattingWithId);
      return profile?.displayName || profile?.firstName || 'Select Partner';
    }
  }, [selectedChattingWithId, selectedChattingWithType, profiles]);

  const chattingWithIsPreset = selectedChattingWithType === 'preset';

  return (
    <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
      {/* Chatting As Selector */}
      <div className="relative flex items-center gap-2">
        <span className="text-xs text-white/50 whitespace-nowrap">Chatting As:</span>
        <button
          onClick={() => {
            setShowChattingAsDropdown(!showChattingAsDropdown);
            setShowChattingWithDropdown(false);
          }}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white/90 transition-all min-w-[140px]"
          disabled={loading}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
            {chattingAsDisplay.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 text-left truncate">{chattingAsDisplay}</span>
          <svg className={`w-4 h-4 transition-transform ${showChattingAsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <DropdownPanel
          isOpen={showChattingAsDropdown}
          onClose={() => setShowChattingAsDropdown(false)}
          options={profiles}
          presets={[]}
          selectedId={selectedChattingAsId}
          onSelect={(id, type, item) => onChattingAsChange(id, item)}
          searchQuery={chattingAsSearch}
          onSearchChange={setChattingAsSearch}
          title="Profiles"
          showPresets={false}
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/20" />

      {/* Chatting With Selector */}
      <div className="relative flex items-center gap-2">
        <span className="text-xs text-white/50 whitespace-nowrap">Chatting With:</span>
        <button
          onClick={() => {
            setShowChattingWithDropdown(!showChattingWithDropdown);
            setShowChattingAsDropdown(false);
          }}
          className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white/90 transition-all min-w-[160px]"
          disabled={loading}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            chattingWithIsPreset
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-amber-500 to-orange-500'
          }`}>
            {chattingWithDisplay.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 text-left truncate">{chattingWithDisplay}</span>
          <svg className={`w-4 h-4 transition-transform ${showChattingWithDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <DropdownPanel
          isOpen={showChattingWithDropdown}
          onClose={() => setShowChattingWithDropdown(false)}
          options={profiles}
          presets={PRESETS_ARRAY}
          selectedId={selectedChattingWithId}
          onSelect={(id, type, item) => onChattingWithChange(id, type, item)}
          searchQuery={chattingWithSearch}
          onSearchChange={setChattingWithSearch}
          title="Partners"
          showPresets={true}
        />
      </div>
    </div>
  );
}

/**
 * Compact version for mobile or smaller screens
 */
export function ChatContextSelectorCompact({
  profiles = [],
  selectedChattingAsId,
  selectedChattingWithId,
  selectedChattingWithType = 'preset',
  onChattingAsChange,
  onChattingWithChange,
  loading = false
}) {
  // Get display names
  const chattingAsProfile = profiles.find(p => p.id === selectedChattingAsId);
  const chattingAsName = chattingAsProfile?.displayName || chattingAsProfile?.firstName || 'Select';

  const chattingWithName = useMemo(() => {
    if (selectedChattingWithType === 'preset') {
      const preset = PRESETS_ARRAY.find(p => p.id === selectedChattingWithId);
      return preset?.name || preset?.presetName || 'Sonnet';
    } else {
      const profile = profiles.find(p => p.id === selectedChattingWithId);
      return profile?.displayName || profile?.firstName || 'Select';
    }
  }, [selectedChattingWithId, selectedChattingWithType, profiles]);

  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex items-center gap-2 text-white/70">
        <span className="text-white/40">As:</span>
        <span className="font-medium text-amber-400">{chattingAsName}</span>
        <span className="text-white/30">|</span>
        <span className="text-white/40">With:</span>
        <span className="font-medium text-purple-400">{chattingWithName}</span>
      </div>
    </div>
  );
}

export default ChatContextSelector;
