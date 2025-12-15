/**
 * FilterPanel.jsx - Multi-column filtering system for Data Manager
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Phase 1B: Advanced Filtering System
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState } from 'react';

// Filter category definitions
const FILTER_CATEGORIES = {
  relationship: {
    title: '🎯 Relationship',
    options: [
      { value: 'family', label: 'Family' },
      { value: 'partner', label: 'Partner' },
      { value: 'friend', label: 'Friend' },
      { value: 'self', label: 'Self' },
      { value: 'historical figure', label: '📜 Historical Figure' }
    ],
    columns: 3
  },
  priority: {
    title: '⭐ Priority',
    options: [
      { value: 2, label: '⭐⭐ Favorite 1' },
      { value: 1, label: '⭐ Favorite 2' },
      { value: 0, label: '☆ Normal' }
    ],
    columns: 3
  },
  chineseAnimal: {
    title: '🐷 Chinese Animal',
    options: [
      { value: 'Rat', label: '🐀 Rat' },
      { value: 'Ox', label: '🐂 Ox' },
      { value: 'Tiger', label: '🐅 Tiger' },
      { value: 'Rabbit', label: '🐇 Rabbit' },
      { value: 'Dragon', label: '🐉 Dragon' },
      { value: 'Snake', label: '🐍 Snake' },
      { value: 'Horse', label: '🐴 Horse' },
      { value: 'Goat', label: '🐐 Goat' },
      { value: 'Monkey', label: '🐵 Monkey' },
      { value: 'Rooster', label: '🐓 Rooster' },
      { value: 'Dog', label: '🐕 Dog' },
      { value: 'Pig', label: '🐷 Pig' }
    ],
    columns: 4
  },
  westernSign: {
    title: '♒ Western Sign',
    options: [
      { value: 'Aries', label: '♈ Aries' },
      { value: 'Taurus', label: '♉ Taurus' },
      { value: 'Gemini', label: '♊ Gemini' },
      { value: 'Cancer', label: '♋ Cancer' },
      { value: 'Leo', label: '♌ Leo' },
      { value: 'Virgo', label: '♍ Virgo' },
      { value: 'Libra', label: '♎ Libra' },
      { value: 'Scorpio', label: '♏ Scorpio' },
      { value: 'Sagittarius', label: '♐ Sagittarius' },
      { value: 'Capricorn', label: '♑ Capricorn' },
      { value: 'Aquarius', label: '♒ Aquarius' },
      { value: 'Pisces', label: '♓ Pisces' }
    ],
    columns: 4
  },
  mbti: {
    title: '🧠 MBTI',
    options: [
      { value: 'INTJ', label: 'INTJ' },
      { value: 'INTP', label: 'INTP' },
      { value: 'ENTJ', label: 'ENTJ' },
      { value: 'ENTP', label: 'ENTP' },
      { value: 'INFJ', label: 'INFJ' },
      { value: 'INFP', label: 'INFP' },
      { value: 'ENFJ', label: 'ENFJ' },
      { value: 'ENFP', label: 'ENFP' },
      { value: 'ISTJ', label: 'ISTJ' },
      { value: 'ISFJ', label: 'ISFJ' },
      { value: 'ESTJ', label: 'ESTJ' },
      { value: 'ESFJ', label: 'ESFJ' },
      { value: 'ISTP', label: 'ISTP' },
      { value: 'ISFP', label: 'ISFP' },
      { value: 'ESTP', label: 'ESTP' },
      { value: 'ESFP', label: 'ESFP' }
    ],
    columns: 4
  },
  tags: {
    title: '🏷️ Tags',
    options: [
      { value: 'Genius', label: 'Genius' },
      { value: 'Artist', label: 'Artist' },
      { value: 'Scientist', label: 'Scientist' },
      { value: 'Philosopher', label: 'Philosopher' },
      { value: 'Musician', label: 'Musician' },
      { value: 'Writer', label: 'Writer' },
      { value: 'Leader', label: 'Leader' },
      { value: 'Revolutionary', label: 'Revolutionary' },
      { value: 'Renaissance', label: 'Renaissance' },
      { value: 'Nobel Prize', label: 'Nobel Prize' },
      { value: 'Poet', label: 'Poet' },
      { value: 'Inventor', label: 'Inventor' },
      { value: 'Polymath', label: 'Polymath' },
      { value: 'Visionary', label: 'Visionary' },
      { value: 'Activist', label: 'Activist' }
    ],
    columns: 5
  },
  gender: {
    title: '⚥ Gender',
    options: [
      { value: 'male', label: '♂ Male' },
      { value: 'female', label: '♀ Female' },
      { value: 'other', label: '⚧ Other' }
    ],
    columns: 3
  }
};

export default function FilterPanel({
  filters,
  onFilterChange,
  onClearAll,
  filteredCount,
  totalCount,
  isCollapsed,
  onToggleCollapse
}) {
  // Count active filters
  const activeFilterCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0
  );

  // Toggle a filter value
  const handleCheckboxChange = (category, value) => {
    onFilterChange(category, value);
  };

  return (
    <div className="mb-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-lg">{isCollapsed ? '▶' : '▼'}</span>
          <span className="font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-teal-500/30 text-teal-300 text-xs rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter panel (collapsible) */}
      {!isCollapsed && (
        <div className="bg-slate-800/30 border border-white/10 rounded-xl p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Relationship Filter */}
            <FilterSection
              category="relationship"
              config={FILTER_CATEGORIES.relationship}
              selectedValues={filters.relationship}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Priority Filter */}
            <FilterSection
              category="priority"
              config={FILTER_CATEGORIES.priority}
              selectedValues={filters.priority}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Chinese Animal Filter */}
            <FilterSection
              category="chineseAnimal"
              config={FILTER_CATEGORIES.chineseAnimal}
              selectedValues={filters.chineseAnimal}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Western Sign Filter */}
            <FilterSection
              category="westernSign"
              config={FILTER_CATEGORIES.westernSign}
              selectedValues={filters.westernSign}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* MBTI Filter */}
            <FilterSection
              category="mbti"
              config={FILTER_CATEGORIES.mbti}
              selectedValues={filters.mbti}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Tags Filter */}
            <FilterSection
              category="tags"
              config={FILTER_CATEGORIES.tags}
              selectedValues={filters.tags}
              onCheckboxChange={handleCheckboxChange}
            />

            {/* Gender Filter */}
            <FilterSection
              category="gender"
              config={FILTER_CATEGORIES.gender}
              selectedValues={filters.gender}
              onCheckboxChange={handleCheckboxChange}
            />
          </div>

          {/* Footer with result count */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-gray-400 text-sm">
              Showing <span className="text-white font-semibold">{filteredCount}</span> of{' '}
              <span className="text-white font-semibold">{totalCount}</span> people
            </span>

            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Active filters:</span>
                {filters.relationship.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Relationship ({filters.relationship.length})
                  </span>
                )}
                {filters.priority.length > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                    Priority ({filters.priority.length})
                  </span>
                )}
                {filters.chineseAnimal.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                    Animal ({filters.chineseAnimal.length})
                  </span>
                )}
                {filters.westernSign.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Sign ({filters.westernSign.length})
                  </span>
                )}
                {filters.mbti.length > 0 && (
                  <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-full text-xs">
                    MBTI ({filters.mbti.length})
                  </span>
                )}
                {filters.tags?.length > 0 && (
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                    Tags ({filters.tags.length})
                  </span>
                )}
                {filters.gender?.length > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                    Gender ({filters.gender.length})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed state summary */}
      {isCollapsed && activeFilterCount > 0 && (
        <div className="text-sm text-gray-400">
          Showing {filteredCount} of {totalCount} people
          {activeFilterCount > 0 && (
            <span className="ml-2 text-teal-400">
              ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// FilterSection sub-component
function FilterSection({ category, config, selectedValues, onCheckboxChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="filter-section">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white mb-2 w-full text-left"
      >
        <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
        {config.title}
        {selectedValues.length > 0 && (
          <span className="ml-auto px-1.5 py-0.5 bg-teal-500/30 text-teal-300 text-xs rounded">
            {selectedValues.length}
          </span>
        )}
      </button>

      {isExpanded && (
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
        >
          {config.options.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 cursor-pointer py-1"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onCheckboxChange(category, option.value)}
                className="w-4 h-4 rounded border-gray-600 bg-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="truncate">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
