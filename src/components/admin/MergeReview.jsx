/**
 * ============================================================================
 * MERGE REVIEW
 * ============================================================================
 * Admin panel for reviewing and approving timeline merge candidates.
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// ============================================================================
// MERGE CANDIDATE CARD
// ============================================================================

function MergeCandidateCard({ candidate, isSelected, onSelect }) {
  const confidenceColor = candidate.confidence < 0.1 ? 'text-green-400' :
    candidate.confidence < 0.2 ? 'text-yellow-400' : 'text-red-400';

  return (
    <button
      onClick={() => onSelect(candidate.candidate_id)}
      className={`w-full p-3 rounded-lg text-left transition-colors ${isSelected ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-800 hover:bg-gray-750'} border border-gray-700`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">{candidate.person_name}</div>
        <div className={`text-xs font-mono ${confidenceColor}`}>
          {(1 - candidate.confidence).toFixed(0)}% match
        </div>
      </div>
      <div className="text-white text-sm truncate">{candidate.from_title}</div>
      <div className="text-gray-500 text-xs">↔</div>
      <div className="text-white text-sm truncate">{candidate.to_title}</div>
    </button>
  );
}

// ============================================================================
// EVENT COMPARISON
// ============================================================================

function EventComparison({ fromEvent, toEvent }) {
  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'year', label: 'Year' },
    { key: 'city', label: 'City' },
    { key: 'type', label: 'Type' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* From Event */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-red-400 mb-2">Source Event</div>
        {fields.map(field => (
          <div key={field.key} className="mb-3">
            <div className="text-xs text-gray-500">{field.label}</div>
            <div className="text-white text-sm">
              {fromEvent?.[field.key] || <span className="text-gray-600">—</span>}
            </div>
          </div>
        ))}
      </div>

      {/* To Event */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-green-400 mb-2">Target Event</div>
        {fields.map(field => (
          <div key={field.key} className="mb-3">
            <div className="text-xs text-gray-500">{field.label}</div>
            <div className="text-white text-sm">
              {toEvent?.[field.key] || <span className="text-gray-600">—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MERGE PREVIEW
// ============================================================================

function MergePreview({ fromEvent, toEvent }) {
  const merged = {
    title: toEvent?.title || fromEvent?.title,
    description: fromEvent?.description && toEvent?.description && fromEvent.description !== toEvent.description
      ? `${toEvent.description}\n\n[Additional context]: ${fromEvent.description}`
      : toEvent?.description || fromEvent?.description,
    year: toEvent?.year || fromEvent?.year,
    city: toEvent?.city || fromEvent?.city,
    type: toEvent?.type || fromEvent?.type
  };

  return (
    <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
      <div className="text-sm text-blue-400 mb-2">Merged Result Preview</div>
      {Object.entries(merged).map(([key, value]) => (
        <div key={key} className="mb-2">
          <div className="text-xs text-gray-500 capitalize">{key}</div>
          <div className="text-white text-sm whitespace-pre-wrap">{value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MergeReview() {
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadCandidateDetail(selectedId);
    }
  }, [selectedId]);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminService.getPendingMerges(50);
      setCandidates(result.merges || []);

      if (result.merges?.length > 0 && !selectedId) {
        setSelectedId(result.merges[0].candidate_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateDetail = async (candidateId) => {
    setLoadingDetail(true);

    try {
      const result = await adminService.getMergeCandidate(candidateId);
      setSelectedCandidate(result.candidate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedId) return;

    const actionNote = action === 'merge' ? note || 'Approved merge' :
      action === 'split' ? note || 'Kept separate' :
        note || 'Ignored';

    setProcessing(true);
    try {
      await adminService.approveMerge(selectedId, action, actionNote);

      // Remove from list and select next
      const newCandidates = candidates.filter(c => c.candidate_id !== selectedId);
      setCandidates(newCandidates);

      if (newCandidates.length > 0) {
        setSelectedId(newCandidates[0].candidate_id);
      } else {
        setSelectedId(null);
        setSelectedCandidate(null);
      }

      setNote('');
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Merge Review</h2>
          <p className="text-gray-400">{candidates.length} pending merge candidates</p>
        </div>
        <button
          onClick={loadCandidates}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="p-8 bg-gray-800 rounded-lg text-center">
          <div className="text-4xl mb-4">✓</div>
          <div className="text-white text-lg">All caught up!</div>
          <div className="text-gray-400">No pending merge candidates</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate List */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
            {candidates.map(candidate => (
              <MergeCandidateCard
                key={candidate.candidate_id}
                candidate={candidate}
                isSelected={candidate.candidate_id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2 space-y-4">
            {loadingDetail ? (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : selectedCandidate ? (
              <>
                {/* Comparison */}
                <EventComparison
                  fromEvent={selectedCandidate.fromEvent}
                  toEvent={selectedCandidate.toEvent}
                />

                {/* Preview */}
                <MergePreview
                  fromEvent={selectedCandidate.fromEvent}
                  toEvent={selectedCandidate.toEvent}
                />

                {/* Actions */}
                <div className="p-4 bg-gray-800 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction('merge')}
                      disabled={processing}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      ✓ Merge Events
                    </button>
                    <button
                      onClick={() => handleAction('split')}
                      disabled={processing}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      ✕ Keep Separate
                    </button>
                    <button
                      onClick={() => handleAction('ignore')}
                      disabled={processing}
                      className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg text-gray-500">
                Select a candidate to review
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
