/**
 * DataTable.jsx - Sortable data table for the People collection
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Phase 1B: Added Priority & Tags columns
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState, useMemo } from 'react';

// Column definitions - Updated for Phase 1B + Gender
const COLUMNS = [
  { key: 'fullName', label: 'Full Name', sortable: true },
  { key: 'priority', label: '⭐', sortable: true },
  { key: 'tags', label: 'Tags', sortable: false },
  { key: 'gender', label: '⚥', sortable: true },
  { key: 'birthDate', label: 'Birth Date', sortable: true },
  { key: 'birthTime', label: 'Time', sortable: false },
  { key: 'birthPlace', label: 'Birth Place', sortable: true },
  { key: 'chineseAnimal', label: 'Chinese Animal', sortable: true },
  { key: 'westernSign', label: 'Western Sign', sortable: true },
  { key: 'mbtiType', label: 'MBTI', sortable: true },
  { key: 'relationship', label: 'Relationship', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
];

// Tag color mapping
const TAG_COLORS = {
  'Core': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Trinity': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'VIP': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Active': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Family': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Close': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Mentor': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Colleague': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'default': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
};

export default function DataTable({ people, onEdit, onDelete, onViewProfile, onEditPriority }) {
  const [sortConfig, setSortConfig] = useState({ key: 'priority', direction: 'desc' });

  // Sort the data
  const sortedPeople = useMemo(() => {
    if (!sortConfig.key || !people) return people;

    return [...people].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle priority sorting (higher priority first in desc)
      if (sortConfig.key === 'priority') {
        aVal = aVal ?? 0;
        bVal = bVal ?? 0;
      } else {
        aVal = aVal || '';
        bVal = bVal || '';
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [people, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Format birth date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get emoji for Chinese animal
  const getAnimalEmoji = (animal) => {
    const emojis = {
      'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇',
      'Dragon': '🐉', 'Snake': '🐍', 'Horse': '🐴', 'Goat': '🐐',
      'Monkey': '🐵', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐷'
    };
    return emojis[animal] || '';
  };

  // Get emoji for Western sign
  const getZodiacEmoji = (sign) => {
    const emojis = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
      'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
      'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return emojis[sign] || '';
  };

  // Get priority stars display
  const getPriorityStars = (priority) => {
    switch (priority) {
      case 2: return { stars: '⭐⭐', label: 'Favorite 1 (Highest)', className: 'text-yellow-400' };
      case 1: return { stars: '⭐', label: 'Favorite 2 (Important)', className: 'text-orange-400' };
      default: return { stars: '☆', label: 'Normal', className: 'text-gray-500' };
    }
  };

  // Get tag color class
  const getTagColor = (tag) => {
    return TAG_COLORS[tag] || TAG_COLORS['default'];
  };

  // Get gender icon and styling
  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return { icon: '♂', className: 'text-blue-400', label: 'Male' };
      case 'female':
        return { icon: '♀', className: 'text-pink-400', label: 'Female' };
      case 'other':
        return { icon: '⚧', className: 'text-purple-400', label: 'Other' };
      default:
        return { icon: '?', className: 'text-gray-500', label: 'Unknown' };
    }
  };

  if (!people || people.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">
      {/* Scrollable container with max height */}
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full">
          {/* Sticky header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-900 border-b border-white/10">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:text-white select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-xs opacity-50">{getSortIcon(col.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedPeople.map((person) => {
              const priorityInfo = getPriorityStars(person.priority);
              return (
                <tr
                  key={person.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Full Name */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewProfile?.(person)}
                      className="text-white font-medium hover:text-teal-400 transition-colors text-left"
                    >
                      {person.fullName || '-'}
                    </button>
                  </td>

                  {/* Priority - Clickable to edit */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => (onEditPriority || onEdit)?.(person)}
                      className={`cursor-pointer hover:scale-110 transition-transform ${priorityInfo.className}`}
                      title={`${priorityInfo.label} - Click to edit`}
                    >
                      {priorityInfo.stars}
                    </button>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3">
                    {person.tags && person.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {person.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs rounded-full border ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {person.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-600/30 text-gray-400">
                            +{person.tags.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 text-center">
                    {(() => {
                      const genderInfo = getGenderDisplay(person.gender);
                      return (
                        <span
                          className={`text-xl ${genderInfo.className}`}
                          title={genderInfo.label}
                        >
                          {genderInfo.icon}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Birth Date */}
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {formatDate(person.birthDate)}
                  </td>

                  {/* Birth Time */}
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {person.birthTime || '-'}
                  </td>

                  {/* Birth Place */}
                  <td className="px-4 py-3 text-gray-300 text-sm max-w-[150px] truncate" title={person.birthPlace}>
                    {person.birthPlace || '-'}
                  </td>

                  {/* Chinese Animal */}
                  <td className="px-4 py-3">
                    {person.chineseAnimal ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                        {getAnimalEmoji(person.chineseAnimal)} {person.chineseAnimal}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* Western Sign */}
                  <td className="px-4 py-3">
                    {person.westernSign ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                        {getZodiacEmoji(person.westernSign)} {person.westernSign}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* MBTI */}
                  <td className="px-4 py-3">
                    {person.mbtiType ? (
                      <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-lg text-sm font-mono">
                        {person.mbtiType}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>

                  {/* Relationship */}
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {person.relationship || '-'}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(person)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(person)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-4 py-3 bg-slate-900/30 border-t border-white/5 text-sm text-gray-400">
        Showing {sortedPeople.length} {sortedPeople.length === 1 ? 'person' : 'people'}
      </div>
    </div>
  );
}
