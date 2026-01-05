/**
 * CONSTITUTIONAL TRUTH MODAL
 *
 * Displays complete Brain 1A JSON data - the single source of truth for AI.
 * This is the pre-computed constitutional profile stored in Firestore.
 *
 * Features:
 * - Full JSON view of Brain 1A data
 * - Copy to clipboard
 * - Export/Download as JSON file
 * - Regenerate Brain 1A button
 */

import React, { useState, useEffect } from 'react';
import { getConstitution, populateConstitution } from '../../services/constitutionService';

export default function ConstitutionalTruthModal({ profile, isOpen, onClose }) {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch Brain 1A constitution from Firestore
  const fetchConstitution = async () => {
    if (!profile?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getConstitution(profile.id);
      if (data) {
        setConstitution(data);
      } else {
        // No Brain 1A data yet
        setConstitution({
          _notice: "Brain 1A not yet populated. Click 'Regenerate Brain 1A' to generate.",
          profileId: profile.id,
          displayName: profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        });
      }
    } catch (err) {
      console.error('Error fetching constitution:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConstitution();
    }
  }, [profile?.id, isOpen]);

  // Regenerate Brain 1A
  const handleRegenerate = async () => {
    if (!profile) return;

    setRegenerating(true);
    setError(null);

    try {
      console.log('🧠 Manually regenerating Brain 1A for:', profile.displayName || profile.id);
      console.log('📊 Profile data being used:', JSON.stringify(profile, null, 2));

      const success = await populateConstitution(profile);

      if (success) {
        console.log('✅ Brain 1A regenerated successfully');
        // Refresh the data
        await fetchConstitution();
      } else {
        setError('Failed to regenerate Brain 1A. Check console for details.');
      }
    } catch (err) {
      console.error('❌ Error regenerating Brain 1A:', err);
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const textToCopy = JSON.stringify(constitution, null, 2);
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export/Download as JSON file
  const handleExport = () => {
    const jsonString = JSON.stringify(constitution, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    const fileName = `brain1a_${profile?.displayName || profile?.firstName || 'profile'}_${new Date().toISOString().split('T')[0]}.json`;
    link.download = fileName.replace(/\s+/g, '_').toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl min-h-[85vh] max-h-[95vh] bg-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-gradient-to-r from-amber-950/90 to-purple-950/90 border-b border-amber-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Brain 1A - Constitutional Truth
                </h2>
                <p className="text-xs text-white/50">Complete pre-computed profile for AI systems</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Regenerate button */}
              <button
                onClick={handleRegenerate}
                disabled={loading || regenerating}
                className="px-3 py-1.5 text-xs font-medium bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
              >
                {regenerating ? '⏳ Generating...' : '🔄 Regenerate Brain 1A'}
              </button>
              {/* Copy button */}
              <button
                onClick={handleCopy}
                disabled={loading || !constitution || constitution._notice}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
              >
                {copied ? '✓ Copied!' : '📋 Copy JSON'}
              </button>
              {/* Export button */}
              <button
                onClick={handleExport}
                disabled={loading || !constitution || constitution._notice}
                className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                💾 Export JSON
              </button>
              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-white/60 text-sm">Loading Brain 1A data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <span className="text-4xl mb-3 block">⚠️</span>
                <p className="text-red-400 text-sm mb-4">{error}</p>
                <button
                  onClick={handleRegenerate}
                  className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  Try Regenerating
                </button>
              </div>
            </div>
          ) : (
            <pre className="text-xs text-green-300 font-mono bg-black/50 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(constitution, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-slate-950/50 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span>Profile: {profile?.displayName || profile?.firstName || 'Unknown'}</span>
            <span>Brain 1A v2.0 • Pre-computed for CCLR, Voice AI, Guest Chat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
