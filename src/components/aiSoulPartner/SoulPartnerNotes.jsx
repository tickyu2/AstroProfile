/**
 * SoulPartnerNotes.jsx
 * A panel for AI SoulPartner to store and display insights about the user
 *
 * This is where the AI builds understanding over time:
 * - Key patterns noticed
 * - Communication preferences learned
 * - Important moments from conversations
 * - Soul-level insights
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState } from 'react';

export default function SoulPartnerNotes({ profile, onUpdateNotes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  // Get existing notes or initialize empty
  const notes = profile?.aiSoulPartner || {
    gettingToKnowMe: '',
    patterns: [],
    communicationStyle: '',
    keyMoments: [],
    lastUpdated: null
  };

  const handleStartEdit = () => {
    setEditedNotes(notes.gettingToKnowMe || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdateNotes) {
      onUpdateNotes({
        ...notes,
        gettingToKnowMe: editedNotes,
        lastUpdated: new Date().toISOString()
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNotes('');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h3 className="font-semibold text-white/90">Getting to Know Me</h3>
          </div>
          <span className="text-xs text-white/40">
            Updated: {formatDate(notes.lastUpdated)}
          </span>
        </div>
        <p className="text-xs text-white/50 mt-1">
          AI SoulPartner's notes and insights about {profile?.displayName || 'you'}
        </p>
      </div>

      {/* Notes Content */}
      <div className="p-4 space-y-4">
        {/* Main Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white/70">Soul Notes</label>
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Notes about this person's soul, patterns, preferences, key moments..."
                className="w-full h-32 bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/30 rounded-lg p-3 min-h-[80px]">
              {notes.gettingToKnowMe ? (
                <p className="text-sm text-white/80 whitespace-pre-wrap">{notes.gettingToKnowMe}</p>
              ) : (
                <p className="text-sm text-white/40 italic">
                  No notes yet. As you chat, the AI SoulPartner will learn about you and save insights here.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Patterns Section */}
        {notes.patterns && notes.patterns.length > 0 && (
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">
              Patterns Noticed
            </label>
            <div className="flex flex-wrap gap-2">
              {notes.patterns.map((pattern, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded text-xs text-indigo-300"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Communication Style */}
        {notes.communicationStyle && (
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">
              Communication Style
            </label>
            <p className="text-sm text-white/60 bg-slate-900/30 rounded-lg p-3">
              {notes.communicationStyle}
            </p>
          </div>
        )}

        {/* Key Moments */}
        {notes.keyMoments && notes.keyMoments.length > 0 && (
          <div>
            <label className="text-sm font-medium text-white/70 block mb-2">
              Key Moments
            </label>
            <div className="space-y-2">
              {notes.keyMoments.map((moment, index) => (
                <div
                  key={index}
                  className="bg-slate-900/30 rounded-lg p-3 border-l-2 border-amber-500/50"
                >
                  <p className="text-sm text-white/80">{moment.insight}</p>
                  <p className="text-xs text-white/40 mt-1">{formatDate(moment.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-slate-900/30 border-t border-white/5">
        <p className="text-xs text-white/30 text-center">
          These notes help your AI SoulPartner remember and understand you better over time
        </p>
      </div>
    </div>
  );
}
