/**
 * ============================================================================
 * TIMELINE CONSOLE PAGE
 * ============================================================================
 * Navigate through life memories: Decade → Year → Month → Day
 *
 * Features:
 * - Zoom navigation through time periods
 * - AI-generated summaries for each period
 * - Cultural context triggers for memory capture
 * - Happiness trend visualization
 *
 * Created: December 22, 2025
 * Mission: JOIE DE VIVRE
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { timelineService } from '../services/timelineService';
import {
  TimelineNav,
  YearGrid,
  MonthGrid,
  PeriodSummaryCard,
  CulturalContextPanel,
  MemoryList,
  TimelineStats,
  BiographyTimeline
} from '../components/timeline';
import { NeuralSidebar } from '../components/aiSoulPartner';

// Zoom levels
const ZOOM_LEVELS = ['overview', 'decade', 'year', 'month', 'day'];

export default function TimelineConsolePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { profiles, selectedProfileId } = useProfiles();

  // Get profile ID from navigation state (passed from chat) or fall back to context
  const navProfileId = location.state?.profileId;
  const effectiveProfileId = navProfileId || selectedProfileId;

  // Find the profile - prioritize navigation state, then context, then user's own profile
  const selectedProfile = profiles.find(p => p.id === effectiveProfileId) ||
                          profiles.find(p => p.relationship === 'self') ||
                          profiles[0];

  // Navigation state
  const [zoomLevel, setZoomLevel] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDecade, setSelectedDecade] = useState(null);

  // Data state
  const [overview, setOverview] = useState(null);
  const [stats, setStats] = useState(null);
  const [monthlyCounts, setMonthlyCounts] = useState(null);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [culturalContext, setCulturalContext] = useState(null);
  const [dayMemories, setDayMemories] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // View mode: 'biography' (intelligent curation) or 'memories' (raw timeline)
  const [viewMode, setViewMode] = useState('biography');

  // Get user and profile IDs
  const userId = currentUser?.uid;
  const profileId = selectedProfile?.id;

  // Debug: Log profile selection source
  useEffect(() => {
    console.log('[Timeline] Profile Selection Debug:', {
      navProfileId,
      contextProfileId: selectedProfileId,
      effectiveProfileId,
      selectedProfileName: selectedProfile?.displayName || selectedProfile?.firstName,
      selectedProfileId: profileId
    });
  }, [navProfileId, selectedProfileId, effectiveProfileId, selectedProfile, profileId]);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  // Load initial overview
  useEffect(() => {
    if (!userId || !profileId) return;

    const loadOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewResult, statsResult] = await Promise.all([
          timelineService.getTimelineOverview(userId, profileId),
          timelineService.getTimelineStats(userId, profileId)
        ]);

        if (overviewResult.success) {
          setOverview(overviewResult.overview);
        }
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      } catch (err) {
        console.error('[Timeline] Error loading overview:', err);
        setError('Failed to load timeline data');
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [userId, profileId]);

  // Load monthly counts when year is selected
  useEffect(() => {
    if (!userId || !profileId || !selectedYear) return;

    const loadMonthly = async () => {
      try {
        const result = await timelineService.getMonthlyMemoryCounts(userId, profileId, selectedYear);
        if (result.success) {
          setMonthlyCounts(result.counts);
        }
      } catch (err) {
        console.error('[Timeline] Error loading monthly counts:', err);
      }
    };

    loadMonthly();
  }, [userId, profileId, selectedYear]);

  // Load cultural context when year changes
  useEffect(() => {
    if (!selectedYear) return;

    const loadCulture = async () => {
      try {
        const result = await timelineService.getCulturalContext(selectedYear, {
          month: selectedMonth,
          limit: 10
        });
        if (result.success) {
          setCulturalContext(result.context);
        }
      } catch (err) {
        console.error('[Timeline] Error loading cultural context:', err);
      }
    };

    loadCulture();
  }, [selectedYear, selectedMonth]);

  // Load day memories
  useEffect(() => {
    if (!userId || !profileId || !selectedDay) return;

    const loadDay = async () => {
      try {
        const result = await timelineService.getMemoriesForDay(userId, profileId, selectedDay);
        if (result.success) {
          setDayMemories(result);
        }
      } catch (err) {
        console.error('[Timeline] Error loading day memories:', err);
      }
    };

    loadDay();
  }, [userId, profileId, selectedDay]);

  // ============================================================================
  // SUMMARY LOADING
  // ============================================================================

  const loadSummary = useCallback(async (periodType, year, month = null) => {
    if (!userId || !profileId) return;

    setSummaryLoading(true);
    try {
      const range = timelineService.getPeriodRange(periodType, year, month);
      const result = await timelineService.getTimelineSummary(
        userId, profileId, periodType, range.start, range.end
      );

      if (result.success) {
        setCurrentSummary(result.summary);
      } else {
        setCurrentSummary(null);
      }
    } catch (err) {
      console.error('[Timeline] Error loading summary:', err);
      setCurrentSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [userId, profileId]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const handleYearSelect = useCallback((year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedDay(null);
    setZoomLevel('year');
    loadSummary('year', year);
  }, [loadSummary]);

  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
    setSelectedDay(null);
    setZoomLevel('month');
    loadSummary('month', selectedYear, month);
  }, [selectedYear, loadSummary]);

  const handleDaySelect = useCallback((day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(dateStr);
    setZoomLevel('day');
  }, [selectedYear, selectedMonth]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
    if (currentIndex > 0) {
      const newLevel = ZOOM_LEVELS[currentIndex - 1];
      setZoomLevel(newLevel);

      if (newLevel === 'overview') {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        setCurrentSummary(null);
      } else if (newLevel === 'year') {
        setSelectedMonth(null);
        setSelectedDay(null);
        loadSummary('year', selectedYear);
      } else if (newLevel === 'month') {
        setSelectedDay(null);
      }
    }
  }, [zoomLevel, selectedYear, loadSummary]);

  // ============================================================================
  // SEARCH
  // ============================================================================

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || !userId || !profileId) return;

    try {
      const result = await timelineService.searchTimeline(userId, profileId, searchTerm);
      if (result.success) {
        setSearchResults(result.results);
      }
    } catch (err) {
      console.error('[Timeline] Search error:', err);
    }
  }, [searchTerm, userId, profileId]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!currentUser || !selectedProfile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Please select a profile first</h2>
          <Link to="/dashboard" className="text-purple-400 hover:text-purple-300">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                ← Dashboard
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                to="/ai-soulpartner"
                state={{ profileId: selectedProfile?.id }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                💬 Chat
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Timeline Console
              </h1>
              {selectedProfile && (
                <span className="text-lg text-slate-300">
                  — {selectedProfile.displayName || selectedProfile.firstName || 'User'}
                </span>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('biography')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'biography'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📖 Life Story
              </button>
              <button
                onClick={() => setViewMode('memories')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'memories'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💭 Raw Memories
              </button>
            </div>

            {/* Search and Refresh */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  setOverview(null);
                  setStats(null);
                  // Trigger re-fetch by resetting state - useEffect will pick it up
                  Promise.all([
                    timelineService.getTimelineOverview(userId, profileId),
                    timelineService.getTimelineStats(userId, profileId)
                  ]).then(([overviewResult, statsResult]) => {
                    if (overviewResult.success) setOverview(overviewResult.overview);
                    if (statsResult.success) setStats(statsResult.stats);
                  }).catch(err => {
                    console.error('[Timeline] Refresh error:', err);
                    setError('Failed to refresh timeline');
                  }).finally(() => {
                    setLoading(false);
                  });
                }}
                disabled={loading}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                  loading
                    ? 'bg-slate-600 text-slate-400 cursor-wait'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
                title="Refresh timeline data"
              >
                🔄 {loading ? 'Loading...' : 'Refresh'}
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search memories..."
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Navigation breadcrumb */}
          <TimelineNav
            zoomLevel={zoomLevel}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            onZoomOut={handleZoomOut}
            onYearClick={() => {
              setZoomLevel('year');
              setSelectedMonth(null);
              setSelectedDay(null);
            }}
            onMonthClick={() => {
              setZoomLevel('month');
              setSelectedDay(null);
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* BIOGRAPHY VIEW - Intelligent Life Story Curation */}
        {viewMode === 'biography' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main biography timeline */}
            <div className="lg:col-span-2">
              <BiographyTimeline
                userId={userId}
                profileId={profileId}
                onExplorePathway={(event, question) => {
                  // Navigate to chat with question prepopulated in input
                  navigate('/ai-soulpartner', {
                    state: {
                      profileId,
                      prefillMessage: question
                    }
                  });
                }}
              />
            </div>

            {/* Sidebar with Neural Q&A */}
            <div className="space-y-6">
              {/* Neural Q&A Sidebar */}
              <NeuralSidebar
                userId={userId}
                profileId={profileId}
                embedded={true}
              />

              {/* Cultural Context (if year selected in memories view) */}
              {culturalContext && culturalContext.length > 0 && (
                <CulturalContextPanel
                  context={culturalContext}
                  year={selectedYear}
                  month={selectedMonth}
                />
              )}
            </div>
          </div>
        )}

        {/* MEMORIES VIEW - Raw Timeline Data */}
        {viewMode === 'memories' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main timeline area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Search results */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                        <button
                          onClick={() => setSearchResults(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          Clear
                        </button>
                      </div>
                      <MemoryList memories={searchResults} compact />
                    </div>
                  )}

                  {/* Overview - Year grid */}
                  {zoomLevel === 'overview' && overview && (
                    <YearGrid
                      years={overview}
                      onYearSelect={handleYearSelect}
                    />
                  )}

                  {/* Year view - Month grid */}
                  {zoomLevel === 'year' && selectedYear && (
                    <MonthGrid
                      year={selectedYear}
                      monthlyCounts={monthlyCounts}
                      onMonthSelect={handleMonthSelect}
                    />
                  )}

                  {/* Month view - Day grid */}
                  {zoomLevel === 'month' && selectedYear && selectedMonth && (
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-semibold mb-4">
                        {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <DayGrid
                        year={selectedYear}
                        month={selectedMonth}
                        onDaySelect={handleDaySelect}
                      />
                    </div>
                  )}

                  {/* Day view - Memory list */}
                  {zoomLevel === 'day' && dayMemories && (
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-semibold mb-4">
                        {timelineService.formatDate(selectedDay, 'long')}
                      </h3>
                      {dayMemories.memories?.length > 0 ? (
                        <MemoryList memories={dayMemories.memories} />
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <p>No memories on this day</p>
                          {dayMemories.closest && (
                            <p className="mt-2 text-sm">
                              Closest memory: {timelineService.formatDate(dayMemories.closest[0]?.timestamp)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Period summary */}
                  {currentSummary && (
                    <PeriodSummaryCard
                      summary={currentSummary}
                      loading={summaryLoading}
                      onRegenerate={() => loadSummary(
                        zoomLevel === 'year' ? 'year' : 'month',
                        selectedYear,
                        selectedMonth
                      )}
                    />
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Stats */}
                  {stats && zoomLevel === 'overview' && (
                    <TimelineStats stats={stats} />
                  )}

                  {/* Cultural context */}
                  {culturalContext && culturalContext.length > 0 && (
                    <CulturalContextPanel
                      context={culturalContext}
                      year={selectedYear}
                      month={selectedMonth}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ============================================================================
// DAY GRID SUB-COMPONENT
// ============================================================================

function DayGrid({ year, month, onDaySelect }) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => onDaySelect(day)}
        className="h-10 w-10 rounded-lg bg-slate-700 hover:bg-purple-600 transition-colors flex items-center justify-center text-sm"
      >
        {day}
      </button>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs text-slate-500 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
