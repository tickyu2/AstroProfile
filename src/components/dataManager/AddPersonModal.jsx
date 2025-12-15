/**
 * AddPersonModal.jsx - Modal form for adding a new person
 *
 * Part of GENESIS Dashboard 1 - Data Manager
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState } from 'react';
import { addPerson } from '../../hooks/usePeople';

// Relationship options
const RELATIONSHIP_OPTIONS = [
  'Self',
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Uncle/Aunt',
  'Nephew/Niece',
  'Cousin',
  'Friend',
  'Colleague',
  'Other'
];

export default function AddPersonModal({ isOpen, onClose, userId, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    relationship: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate Chinese Animal and Western Sign from birth date
      let chineseAnimal = null;
      let westernSign = null;

      if (formData.birthDate) {
        const date = new Date(formData.birthDate);
        chineseAnimal = calculateChineseAnimal(date);
        westernSign = calculateWesternSign(date);
      }

      await addPerson({
        ...formData,
        userId,
        chineseAnimal,
        westernSign,
        mbtiType: null // Can be added later via edit
      });

      // Reset form and close
      setFormData({
        fullName: '',
        nickname: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        relationship: '',
        notes: ''
      });
      onSuccess?.();
    } catch (err) {
      console.error('Error adding person:', err);
      setError(err.message || 'Failed to add person');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-800 border border-white/10 rounded-2xl shadow-xl max-w-lg w-full transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👤</span>
              Add New Person
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="Enter full name"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="Enter nickname (optional)"
              />
            </div>

            {/* Birth Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Birth Time
                </label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            {/* Birth Place */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Birth Place
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                placeholder="City, Country"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Relationship
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="">Select relationship...</option>
                {RELATIONSHIP_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                placeholder="Any additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-700 text-gray-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Person'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate Chinese zodiac animal from birth date
 * Simplified calculation (doesn't account for lunar new year)
 */
function calculateChineseAnimal(date) {
  const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  const year = date.getFullYear();
  return animals[year % 12];
}

/**
 * Calculate Western zodiac sign from birth date
 */
function calculateWesternSign(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}
