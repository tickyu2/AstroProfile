/**
 * ============================================================================
 * QUESTION QUEUE
 * ============================================================================
 * Admin panel for managing Neural Pathways (unanswered questions).
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// ============================================================================
// QUESTION CARD
// ============================================================================

function QuestionCard({ question, isSelected, onSelect }) {
  const priorityColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-gray-500 bg-gray-500/10'
  };

  const priority = question.priority >= 0.7 ? 'high' :
    question.priority >= 0.4 ? 'medium' : 'low';

  return (
    <button
      onClick={() => onSelect(question.id)}
      className={`w-full p-3 rounded-lg text-left transition-colors border ${isSelected ? 'bg-blue-600/30 border-blue-500' : priorityColors[priority]}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-400">{question.person_name}</div>
        <div className="text-xs text-gray-500">{question.category}</div>
      </div>
      <div className="text-white text-sm mb-1">{question.question}</div>
      <div className="text-xs text-gray-500 truncate">
        Re: {question.event_title}
      </div>
    </button>
  );
}

// ============================================================================
// ANSWER FORM
// ============================================================================

function AnswerForm({ question, onApply, onMarkAnswered, onSkip, processing }) {
  const [eventUpdates, setEventUpdates] = useState({});
  const [note, setNote] = useState('');

  const handleFieldChange = (field, value) => {
    setEventUpdates(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const hasUpdates = Object.values(eventUpdates).some(v => v !== undefined && v !== '');

  return (
    <div className="space-y-4">
      {/* Question Context */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-2">Question</div>
        <div className="text-white text-lg mb-3">{question.question}</div>

        <div className="text-sm text-gray-400 mb-1">Reason</div>
        <div className="text-gray-300 text-sm mb-3">{question.reason}</div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Event:</span>
            <span className="ml-2 text-white">{question.event_title}</span>
          </div>
          <div>
            <span className="text-gray-500">Year:</span>
            <span className="ml-2 text-white">{question.event_year || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Answer Fields */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400 mb-3">Apply Answer to Event</div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Year</label>
            <input
              type="number"
              placeholder="e.g., 1998"
              value={eventUpdates.eventYear || ''}
              onChange={(e) => handleFieldChange('eventYear', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Month</label>
            <input
              type="number"
              placeholder="1-12"
              min="1"
              max="12"
              value={eventUpdates.eventMonth || ''}
              onChange={(e) => handleFieldChange('eventMonth', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Day</label>
            <input
              type="number"
              placeholder="1-31"
              min="1"
              max="31"
              value={eventUpdates.eventDay || ''}
              onChange={(e) => handleFieldChange('eventDay', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g., New York"
              value={eventUpdates.city || ''}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">State</label>
            <input
              type="text"
              placeholder="e.g., NY"
              value={eventUpdates.state || ''}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Country</label>
            <input
              type="text"
              placeholder="e.g., USA"
              value={eventUpdates.country || ''}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Note</label>
          <input
            type="text"
            placeholder="Optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {hasUpdates && (
          <button
            onClick={() => onApply(eventUpdates, note)}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium disabled:opacity-50"
          >
            Apply Answer & Mark Answered
          </button>
        )}
        <button
          onClick={() => onMarkAnswered(note)}
          disabled={processing}
          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
        >
          Mark as Answered
        </button>
        <button
          onClick={onSkip}
          disabled={processing}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium disabled:opacity-50"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuestionQueue() {
  const [questions, setQuestions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [statusFilter, setStatusFilter] = useState('open');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    loadQuestions();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedId) {
      const q = questions.find(q => q.id === selectedId);
      setSelectedQuestion(q);
    }
  }, [selectedId, questions]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await adminService.getQuestionQueue(statusFilter, 100);
      setQuestions(result.questions || []);

      if (result.questions?.length > 0 && !selectedId) {
        setSelectedId(result.questions[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAnswer = async (eventUpdates, note) => {
    if (!selectedId) return;

    setProcessing(true);
    try {
      await adminService.applyQuestionAnswer(selectedId, eventUpdates, note);
      moveToNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAnswered = async (note) => {
    if (!selectedId) return;

    setProcessing(true);
    try {
      await adminService.markQuestionAnswered(selectedId, note);
      moveToNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSkip = () => {
    moveToNext();
  };

  const moveToNext = () => {
    const currentIndex = questions.findIndex(q => q.id === selectedId);
    const newQuestions = questions.filter(q => q.id !== selectedId);
    setQuestions(newQuestions);

    if (newQuestions.length > 0) {
      const nextIndex = Math.min(currentIndex, newQuestions.length - 1);
      setSelectedId(newQuestions[nextIndex].id);
    } else {
      setSelectedId(null);
      setSelectedQuestion(null);
    }
  };

  const handleBulkMarkAnswered = async () => {
    if (selectedIds.size === 0) return;

    const note = prompt('Note for bulk mark answered:') || 'Bulk marked as answered';

    setProcessing(true);
    try {
      await adminService.bulkMarkAnswered(Array.from(selectedIds), note);
      setSelectedIds(new Set());
      await loadQuestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          <h2 className="text-xl font-bold text-white">Question Queue</h2>
          <p className="text-gray-400">Neural Pathways - {questions.length} questions</p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="skipped">Skipped</option>
          </select>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkMarkAnswered}
              disabled={processing}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50"
            >
              Mark {selectedIds.size} Answered
            </button>
          )}
          <button
            onClick={loadQuestions}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="p-8 bg-gray-800 rounded-lg text-center">
          <div className="text-4xl mb-4">✓</div>
          <div className="text-white text-lg">All caught up!</div>
          <div className="text-gray-400">No {statusFilter} questions</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question List */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
            {questions.map(question => (
              <div key={question.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(question.id)}
                  onChange={() => toggleSelection(question.id)}
                  className="w-4 h-4 rounded border-gray-600"
                />
                <div className="flex-1">
                  <QuestionCard
                    question={question}
                    isSelected={question.id === selectedId}
                    onSelect={setSelectedId}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Answer Form */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <AnswerForm
                question={selectedQuestion}
                onApply={handleApplyAnswer}
                onMarkAnswered={handleMarkAnswered}
                onSkip={handleSkip}
                processing={processing}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg text-gray-500">
                Select a question to answer
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
