/**
 * ============================================================================
 * TIMELINE CONSOLE
 * ============================================================================
 * Main console for viewing and managing biographical timelines.
 * Connects to PostgreSQL backend via Firebase Functions.
 *
 * Features:
 * - View events by person
 * - Neural pathway questions panel
 * - Event search
 * - Stats overview
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

// ============================================================================
// FIREBASE FUNCTIONS SETUP
// ============================================================================

const functions = getFunctions();
const getTimelineEvents = httpsCallable(functions, 'getTimelineEvents');
const getTimelineQuestions = httpsCallable(functions, 'getTimelineQuestions');
const answerTimelineQuestion = httpsCallable(functions, 'answerTimelineQuestion');
const skipTimelineQuestion = httpsCallable(functions, 'skipTimelineQuestion');
const getTimelineStats = httpsCallable(functions, 'getTimelineStats');
const getTimelinePeople = httpsCallable(functions, 'getTimelinePeople');

// ============================================================================
// EVENT TYPE STYLING
// ============================================================================

const EVENT_TYPE_CONFIG = {
  education: { icon: '🎓', color: '#3B82F6' },
  career: { icon: '💼', color: '#8B5CF6' },
  relocation: { icon: '🏠', color: '#F59E0B' },
  relationship: { icon: '💕', color: '#EC4899' },
  family: { icon: '👨‍👩‍👧', color: '#10B981' },
  health: { icon: '🏥', color: '#EF4444' },
  achievement: { icon: '🏆', color: '#F59E0B' },
  travel: { icon: '✈️', color: '#06B6D4' },
  loss: { icon: '🕯️', color: '#6B7280' },
  milestone: { icon: '🎯', color: '#8B5CF6' },
  spiritual: { icon: '🙏', color: '#A855F7' },
  creative: { icon: '🎨', color: '#F472B6' },
  financial: { icon: '💰', color: '#10B981' }
};

function getEventConfig(type) {
  return EVENT_TYPE_CONFIG[type] || { icon: '📌', color: '#6B7280' };
}

// ============================================================================
// EVENT CARD COMPONENT
// ============================================================================

function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);
  const config = getEventConfig(event.event_type);

  const formatDate = () => {
    if (event.event_year && event.event_month && event.event_day) {
      return `${event.event_year}-${String(event.event_month).padStart(2, '0')}-${String(event.event_day).padStart(2, '0')}`;
    }
    if (event.event_year && event.event_month) {
      return `${event.event_year}-${String(event.event_month).padStart(2, '0')}`;
    }
    if (event.event_year) {
      return `${event.event_year}`;
    }
    return 'Date unknown';
  };

  const formatLocation = () => {
    const parts = [event.city, event.state, event.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  return (
    <div
      className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${config.color}20`, border: `2px solid ${config.color}` }}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-white">{event.title}</h4>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${config.color}30`, color: config.color }}
            >
              {event.event_type}
            </span>
            {event.mention_count > 1 && (
              <span className="text-xs text-slate-500">
                ({event.mention_count} mentions)
              </span>
            )}
          </div>

          <div className="text-sm text-slate-400 mt-1">
            {formatDate()}
            {event.date_precision && event.date_precision !== 'exact' && (
              <span className="text-slate-500 ml-1">({event.date_precision})</span>
            )}
            {formatLocation() && (
              <span className="ml-2">📍 {formatLocation()}</span>
            )}
          </div>

          {event.description && (
            <p className={`text-sm text-slate-300 mt-2 ${expanded ? '' : 'line-clamp-2'}`}>
              {event.description}
            </p>
          )}
        </div>

        {/* Confidence indicator */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: event.confidence > 0.7 ? '#10B981' :
                             event.confidence > 0.4 ? '#F59E0B' : '#EF4444'
            }}
            title={`Confidence: ${Math.round((event.confidence || 0.5) * 100)}%`}
          />
          {event.verified && (
            <span className="text-green-500 text-xs" title="Verified">✓</span>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          {event.emotions?.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase">Emotions</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.emotions.map((emotion, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-purple-900/30 rounded-full text-purple-300">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 mt-2">
            Created: {new Date(event.created_at).toLocaleDateString()}
            {event.updated_at && event.updated_at !== event.created_at && (
              <span className="ml-2">• Updated: {new Date(event.updated_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// QUESTION CARD COMPONENT
// ============================================================================

function QuestionCard({ question, onAnswer, onSkip }) {
  const priorityColor = question.priority > 0.7 ? 'border-yellow-500' :
                        question.priority > 0.4 ? 'border-blue-500' : 'border-slate-600';

  return (
    <div className={`bg-slate-800/50 rounded-lg p-3 border ${priorityColor}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <p className="text-sm text-slate-200">{question.question}</p>
          {question.reason && (
            <p className="text-xs text-slate-500 mt-1">{question.reason}</p>
          )}
          {question.event_title && (
            <p className="text-xs text-slate-600 mt-1">
              Related to: {question.event_title}
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onAnswer(question.id); }}
            className="text-xs px-2 py-1 bg-green-600/30 hover:bg-green-600/50 text-green-400 rounded transition-colors"
            title="Mark as answered"
          >
            ✓
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(question.id); }}
            className="text-xs px-2 py-1 bg-slate-600/30 hover:bg-slate-600/50 text-slate-400 rounded transition-colors"
            title="Skip this question"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">
          {question.category || 'general'}
        </span>
        <span className="text-xs text-slate-600">
          Priority: {(question.priority * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// STATS PANEL COMPONENT
// ============================================================================

function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-white">{stats.eventCount}</div>
        <div className="text-xs text-slate-500">Events</div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-yellow-400">{stats.questionsPending}</div>
        <div className="text-xs text-slate-500">Open Questions</div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-green-400">{stats.questionsAnswered}</div>
        <div className="text-xs text-slate-500">Answered</div>
      </div>
      {stats.yearRange && (
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">
            {stats.yearRange.min} - {stats.yearRange.max}
          </div>
          <div className="text-xs text-slate-500">Year Range</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN TIMELINE CONSOLE COMPONENT
// ============================================================================

export default function TimelineConsole({ userId, profileId = 'default', defaultPerson = null }) {
  // State
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(defaultPerson);
  const [events, setEvents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load people list
  useEffect(() => {
    if (!userId) return;

    const loadPeople = async () => {
      try {
        const result = await getTimelinePeople({ userId, profileId });
        if (result.data.success) {
          setPeople(result.data.people);
          // Auto-select first person if none selected
          if (!selectedPerson && result.data.people.length > 0) {
            setSelectedPerson(result.data.people[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load people:', err);
      }
    };

    loadPeople();
  }, [userId, profileId]);

  // Load data for selected person
  const loadPersonData = useCallback(async () => {
    if (!userId || !selectedPerson) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [eventsResult, questionsResult, statsResult] = await Promise.all([
        getTimelineEvents({ userId, profileId, personName: selectedPerson }),
        getTimelineQuestions({ userId, profileId, personName: selectedPerson }),
        getTimelineStats({ userId, profileId, personName: selectedPerson })
      ]);

      if (eventsResult.data.success) {
        setEvents(eventsResult.data.events);
      }
      if (questionsResult.data.success) {
        setQuestions(questionsResult.data.questions);
      }
      if (statsResult.data.success) {
        setStats(statsResult.data.stats);
      }
    } catch (err) {
      console.error('Failed to load timeline data:', err);
      setError('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  }, [userId, profileId, selectedPerson]);

  useEffect(() => {
    loadPersonData();
  }, [loadPersonData]);

  // Handle question actions
  const handleAnswerQuestion = async (questionId) => {
    try {
      await answerTimelineQuestion({ userId, questionId });
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (stats) {
        setStats({
          ...stats,
          questionsPending: stats.questionsPending - 1,
          questionsAnswered: stats.questionsAnswered + 1
        });
      }
    } catch (err) {
      console.error('Failed to answer question:', err);
    }
  };

  const handleSkipQuestion = async (questionId) => {
    try {
      await skipTimelineQuestion({ userId, questionId });
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      if (stats) {
        setStats({
          ...stats,
          questionsPending: stats.questionsPending - 1
        });
      }
    } catch (err) {
      console.error('Failed to skip question:', err);
    }
  };

  // Render
  if (!userId) {
    return (
      <div className="p-6 text-center text-slate-500">
        Please sign in to view your timeline.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Timeline Console</h2>
          <p className="text-slate-400 text-sm">Biographical intelligence system</p>
        </div>

        {/* Person selector */}
        {people.length > 0 && (
          <select
            value={selectedPerson || ''}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select a person...</option>
            {people.map((person) => (
              <option key={person.id} value={person.name}>
                {person.name} ({person.event_count || 0} events)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-300">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 mt-2">Loading timeline...</p>
        </div>
      )}

      {/* Content */}
      {!loading && selectedPerson && (
        <>
          {/* Stats */}
          <StatsPanel stats={stats} />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events column */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>Life Events</span>
                <span className="text-sm font-normal text-slate-500">({events.length})</span>
              </h3>

              {events.length === 0 ? (
                <div className="bg-slate-800/30 rounded-xl p-8 text-center">
                  <p className="text-slate-400">No events recorded yet.</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Events are automatically extracted from conversations.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>

            {/* Questions column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>Neural Pathways</span>
                <span className="text-sm font-normal text-slate-500">({questions.length})</span>
              </h3>

              {questions.length === 0 ? (
                <div className="bg-slate-800/30 rounded-xl p-6 text-center">
                  <p className="text-slate-400 text-sm">No open questions.</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Questions are generated to fill gaps in the life story.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onAnswer={handleAnswerQuestion}
                      onSkip={handleSkipQuestion}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty state - no person selected */}
      {!loading && !selectedPerson && people.length === 0 && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Timeline Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start a conversation with Luna about someone's life story.
            Events will be automatically extracted and organized here.
          </p>
        </div>
      )}
    </div>
  );
}
