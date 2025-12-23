/**
 * ============================================================================
 * BIOGRAPHY TIMELINE
 * ============================================================================
 * Intelligent life story curation display
 * Shows extracted life events organized by year and chapter
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 */

import React, { useState, useEffect } from 'react';
import { biographyService } from '../../services/biographyService';

// ============================================================================
// LIFE EVENT CARD
// ============================================================================

function LifeEventCard({ event, onExplorePathway }) {
  const [expanded, setExpanded] = useState(false);
  const icon = biographyService.getEventTypeIcon(event.event_type);
  const color = biographyService.getEventTypeColor(event.event_type);
  const dateDisplay = biographyService.formatDateDisplay(event.date);

  return (
    <div
      className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-white">{event.title}</h4>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}30`, color }}
            >
              {event.event_type}
            </span>
          </div>

          <div className="text-sm text-slate-400 mt-1">
            {dateDisplay}
            {event.location?.city && (
              <span className="ml-2">
                📍 {event.location.city}
                {event.location.state && `, ${event.location.state}`}
              </span>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-slate-300 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* Confidence indicator */}
        <div className="flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: event.confidence > 0.7 ? '#10B981' :
                             event.confidence > 0.4 ? '#F59E0B' : '#EF4444'
            }}
            title={`Confidence: ${Math.round((event.confidence || 0.5) * 100)}%`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          {/* People involved */}
          {event.people_involved?.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase">People</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.people_involved.map((person, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-600 rounded-full text-slate-300">
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emotions */}
          {event.emotions?.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase">Emotions</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.emotions.map((emotion, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-purple-900/50 rounded-full text-purple-300">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chapter */}
          {event.chapter && (
            <div className="mb-3">
              <span className="text-xs text-slate-500 uppercase">Life Chapter</span>
              <p className="text-sm text-cyan-400 mt-1">
                {event.chapter.name}
                {event.chapter.ageAtEvent && ` (age ${event.chapter.ageAtEvent})`}
              </p>
            </div>
          )}

          {/* Neural Pathways */}
          {event.neural_pathways?.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-slate-500 uppercase">Questions to Explore</span>
              <div className="mt-2 space-y-1">
                {event.neural_pathways.slice(0, 3).map((question, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplorePathway?.(event, question);
                    }}
                    className="block w-full text-left text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 px-2 py-1 rounded transition-colors"
                  >
                    💡 {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          {event.source && (
            <div className="mt-3 text-xs text-slate-500">
              Extracted {new Date(event.source.extractedAt).toLocaleDateString()}
              {event.mentionCount > 1 && ` • Mentioned ${event.mentionCount} times`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// YEAR GROUP
// ============================================================================

function YearGroup({ year, events, onExplorePathway }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative">
      {/* Year marker */}
      <div className="sticky top-20 z-10 bg-slate-900/95 backdrop-blur-sm py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-purple-400 transition-colors"
        >
          <span className="text-2xl">{year}</span>
          <span className="text-sm font-normal text-slate-400">
            ({events.length} event{events.length !== 1 ? 's' : ''})
          </span>
          <span className="text-slate-500">{collapsed ? '▶' : '▼'}</span>
        </button>
      </div>

      {/* Events */}
      {!collapsed && (
        <div className="space-y-3 mt-3 pl-4 border-l-2 border-slate-700">
          {events.map(event => (
            <LifeEventCard
              key={event.id}
              event={event}
              onExplorePathway={onExplorePathway}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN BIOGRAPHY TIMELINE
// ============================================================================

export default function BiographyTimeline({ userId, profileId, onExplorePathway }) {
  const [timeline, setTimeline] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Load biography data
  useEffect(() => {
    if (!userId || !profileId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [timelineResult, statsResult] = await Promise.all([
          biographyService.getBiographyTimeline(userId, profileId),
          biographyService.getBiographyStats(userId, profileId)
        ]);

        if (timelineResult.success) {
          setTimeline(timelineResult);
        } else {
          setError(timelineResult.error || 'Failed to load biography');
        }

        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      } catch (err) {
        console.error('[Biography] Load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, profileId]);

  // Filter events by type
  const filteredByYear = React.useMemo(() => {
    if (!timeline?.byYear) return {};

    if (filterType === 'all') return timeline.byYear;

    const filtered = {};
    for (const [year, events] of Object.entries(timeline.byYear)) {
      const matching = events.filter(e => e.event_type === filterType);
      if (matching.length > 0) {
        filtered[year] = matching;
      }
    }
    return filtered;
  }, [timeline, filterType]);

  // Get unique event types
  const eventTypes = React.useMemo(() => {
    if (!timeline?.events) return [];
    const types = [...new Set(timeline.events.map(e => e.event_type))];
    return types.sort();
  }, [timeline]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!timeline || timeline.totalEvents === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-xl font-semibold text-white mb-2">Your Story Begins</h3>
        <p className="text-slate-400 mb-4">
          Start chatting with Luna about your life experiences.
          <br />
          Life events will be automatically extracted and curated here.
        </p>
        <div className="text-sm text-slate-500">
          Try sharing memories like:
          <ul className="mt-2 space-y-1">
            <li>"I graduated from college in 1990"</li>
            <li>"My daughter was born in Austin"</li>
            <li>"I started working at IBM in the 80s"</li>
          </ul>
        </div>
      </div>
    );
  }

  const sortedYears = Object.keys(filteredByYear)
    .filter(y => y !== 'unknown')
    .sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      {stats && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalEvents}</div>
              <div className="text-xs text-slate-400">Life Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{stats.yearsDocumented}</div>
              <div className="text-xs text-slate-400">Years Documented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{stats.openQuestions}</div>
              <div className="text-xs text-slate-400">Questions to Explore</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {stats.eventTypes?.length || 0}
              </div>
              <div className="text-xs text-slate-400">Event Types</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {eventTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterType === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Events
          </button>
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                filterType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{biographyService.getEventTypeIcon(type)}</span>
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-8">
        {sortedYears.map(year => (
          <YearGroup
            key={year}
            year={year}
            events={filteredByYear[year]}
            onExplorePathway={onExplorePathway}
          />
        ))}

        {/* Unknown dates */}
        {filteredByYear['unknown']?.length > 0 && (
          <YearGroup
            year="Date Unknown"
            events={filteredByYear['unknown']}
            onExplorePathway={onExplorePathway}
          />
        )}
      </div>
    </div>
  );
}
