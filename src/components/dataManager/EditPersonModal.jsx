/**
 * EditPersonModal.jsx - Modal form for editing Priority, Tags, and basic info
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Phase 1B: Priority & Tags editing
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState, useEffect } from 'react';
import { useProfiles } from '../../contexts/ProfileContext';
import { useKnowledgeBase } from '../../contexts/KnowledgeBaseContext';

// Tag suggestions
const TAG_SUGGESTIONS = [
  'Core', 'Trinity', 'VIP', 'Active', 'Family',
  'Close', 'Mentor', 'Colleague', 'Builder', 'Artist', 'Lighthouse'
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

export default function EditPersonModal({ isOpen, onClose, person, onSuccess }) {
  const { updateProfile } = useProfiles();
  const { syncProfileToKB } = useKnowledgeBase();

  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    priority: 0,
    tags: [],
    relationshipType: 'family',
    gender: '',
    notes: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when person changes
  useEffect(() => {
    if (person) {
      setFormData({
        fullName: person.fullName || '',
        nickname: person.nickname || '',
        priority: person.priority ?? 0,
        tags: person.tags || [],
        relationshipType: person.relationshipType || person.relationship || 'family',
        gender: person.gender || '',
        notes: person.notes || ''
      });
      setTagInput('');
      setError(null);
    }
  }, [person]);

  // Handle tag input with Enter or comma
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Add tag
  const addTag = (text) => {
    const tag = text.trim().replace(/,/g, '');
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  // Remove tag
  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Get tag color class
  const getTagColor = (tag) => {
    return TAG_COLORS[tag] || TAG_COLORS['default'];
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update profile in Firestore via ProfileContext
      const updatedProfile = await updateProfile(person.profileId || person.id, {
        displayName: formData.fullName,
        nickname: formData.nickname,
        priority: formData.priority,
        tags: formData.tags,
        relationshipType: formData.relationshipType,
        gender: formData.gender,
        notes: formData.notes
      });

      // Sync the updated profile to Knowledge Base
      if (updatedProfile && syncProfileToKB) {
        console.log('🧬 Syncing updated profile to KB:', updatedProfile.displayName || updatedProfile.firstName);
        await syncProfileToKB(updatedProfile);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error updating person:', err);
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !person) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>✏️</span>
              Edit Person
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* === Basic Information Section === */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                Basic Information
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                  placeholder="Enter full name"
                  autoFocus
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                  placeholder="Optional nickname"
                />
              </div>
            </div>

            {/* === Priority & Relationship Section === */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                Priority & Relationship
              </h3>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority Level <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                >
                  <option value={2}>⭐⭐ Favorite 1 (Highest Priority)</option>
                  <option value={1}>⭐ Favorite 2 (Important)</option>
                  <option value={0}>☆ Normal (Regular)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 italic">
                  Favorite 1: Core family, Trinity, VIPs | Favorite 2: Close friends
                </p>
              </div>

              {/* Relationship Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Relationship Type
                </label>
                <select
                  value={formData.relationshipType}
                  onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                >
                  <option value="family">Family</option>
                  <option value="partner">Partner</option>
                  <option value="friend">Friend</option>
                  <option value="self">Self</option>
                  <option value="Historical Figure">📜 Historical Figure</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                >
                  <option value="">— Select Gender —</option>
                  <option value="male">♂ Male</option>
                  <option value="female">♀ Female</option>
                  <option value="other">⚧ Other</option>
                </select>
              </div>
            </div>

            {/* === Tags Section === */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                Tags
              </h3>

              {/* Tag Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Custom Tags
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50"
                  placeholder="Type and press Enter to add tags"
                />
                <p className="mt-1 text-xs text-gray-500 italic">
                  Press Enter or comma to add. Click suggestions below.
                </p>
              </div>

              {/* Tag Suggestions */}
              <div className="flex flex-wrap gap-2">
                {TAG_SUGGESTIONS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                      formData.tags.includes(tag)
                        ? 'bg-gray-600/30 text-gray-500 border-gray-600/30 cursor-not-allowed'
                        : 'bg-slate-700/50 text-gray-300 border-white/10 hover:bg-slate-600/50 hover:text-white cursor-pointer'
                    }`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Current Tags:</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-full border ${getTagColor(tag)}`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/20 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* === Notes Section === */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                Notes (Optional)
              </h3>

              <div>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 resize-none"
                  placeholder="Add quick notes about this person..."
                />
              </div>
            </div>

            {/* === Current Zodiac Display === */}
            {(person.chineseAnimal || person.westernSign) && (
              <div className="p-3 bg-slate-700/30 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Current Zodiac Signs (read-only)</p>
                <div className="flex gap-3">
                  {person.chineseAnimal && (
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                      {getAnimalEmoji(person.chineseAnimal)} {person.chineseAnimal}
                    </span>
                  )}
                  {person.westernSign && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                      {getZodiacEmoji(person.westernSign)} {person.westernSign}
                    </span>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-slate-700 text-gray-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.fullName.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// Helper functions
function getAnimalEmoji(animal) {
  const emojis = {
    'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐇',
    'Dragon': '🐉', 'Snake': '🐍', 'Horse': '🐴', 'Goat': '🐐',
    'Monkey': '🐵', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐷'
  };
  return emojis[animal] || '';
}

function getZodiacEmoji(sign) {
  const emojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
  };
  return emojis[sign] || '';
}
