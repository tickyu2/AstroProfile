/**
 * Memory Explorer Page
 * Unified dashboard for exploring memories, happiness anchors, and emotion trends
 *
 * Priority 3: Memory Explorer / Happiness Anchors UI
 *
 * Features:
 * - Happiness Anchors visualization with sensory details
 * - Emotion Trends timeline and analysis
 * - Relationship Stats and milestones
 * - Memory search and browsing
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { memoryService } from '../services/memoryService';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Emotion color mapping
const EMOTION_COLORS = {
  joy: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
  love: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500' },
  hope: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500' },
  peace: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500' },
  excitement: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
  gratitude: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
  reflective: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500' },
  anxious: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500' },
  sad: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500' },
  default: { bg: 'bg-white/10', text: 'text-white/70', border: 'border-white/20' }
};

// Sensory icon mapping
const SENSORY_ICONS = {
  sight: { icon: '👁️', label: 'Sight' },
  sound: { icon: '👂', label: 'Sound' },
  smell: { icon: '👃', label: 'Smell' },
  taste: { icon: '👅', label: 'Taste' },
  touch: { icon: '✋', label: 'Touch' }
};

// Bond level badges
const BOND_LEVELS = {
  new: { label: 'New Connection', color: 'bg-slate-600', emoji: '🌱' },
  growing: { label: 'Growing Bond', color: 'bg-green-600', emoji: '🌿' },
  established: { label: 'Established', color: 'bg-blue-600', emoji: '🌳' },
  deep: { label: 'Deep Connection', color: 'bg-purple-600', emoji: '💜' },
  soulbound: { label: 'Soulbound', color: 'bg-pink-600', emoji: '💫' }
};

export default function MemoryExplorerPage() {
  const { user } = useAuth();
  const { profiles, selectedProfile } = useProfiles();
  const [activeTab, setActiveTab] = useState('anchors');
  const [loading, setLoading] = useState(true);

  // Data states
  const [happinessAnchors, setHappinessAnchors] = useState([]);
  const [emotionTrends, setEmotionTrends] = useState(null);
  const [emotionLogs, setEmotionLogs] = useState([]);
  const [relationshipStats, setRelationshipStats] = useState(null);
  const [memories, setMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load all data
  const loadData = useCallback(async () => {
    if (!user?.uid || !selectedProfile?.id) return;

    setLoading(true);
    try {
      // Load happiness anchors
      const anchors = await memoryService.getHappinessAnchors(user.uid, selectedProfile.id, 10);
      setHappinessAnchors(anchors);

      // Load emotion trends
      const functions = getFunctions();
      const getEmotionTrendsFn = httpsCallable(functions, 'getEmotionTrends');
      const trendsResult = await getEmotionTrendsFn({
        userId: user.uid,
        profileId: selectedProfile.id,
        dayRange: 30
      });
      if (trendsResult.data?.success) {
        setEmotionTrends(trendsResult.data.trends);
        setEmotionLogs(trendsResult.data.logs || []);
      }

      // Load relationship stats
      const stats = await memoryService.getRelationshipStats(user.uid, selectedProfile.id);
      setRelationshipStats(stats);

      // Load recent memories
      const recentMemories = await memoryService.retrieveMemories(
        user.uid, selectedProfile.id, 'recent memories', { limit: 20 }
      );
      setMemories(recentMemories);

    } catch (error) {
      console.error('Error loading memory data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, selectedProfile?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Search memories
  const handleSearch = async () => {
    if (!searchQuery.trim() || !user?.uid || !selectedProfile?.id) return;

    setLoading(true);
    try {
      const results = await memoryService.retrieveMemories(
        user.uid, selectedProfile.id, searchQuery, { limit: 20 }
      );
      setMemories(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get emotion color
  const getEmotionColor = (mood) => {
    return EMOTION_COLORS[mood?.toLowerCase()] || EMOTION_COLORS.default;
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time ago
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!selectedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-center text-white/60">
          <p>Please select a profile to explore memories</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Memory Explorer</h1>
            <p className="text-white/60">
              Exploring memories for {selectedProfile.name}
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
          {[
            { id: 'anchors', label: 'Happiness Anchors', icon: '😊' },
            { id: 'trends', label: 'Emotion Trends', icon: '📈' },
            { id: 'relationship', label: 'Relationship', icon: '💫' },
            { id: 'memories', label: 'All Memories', icon: '🧠' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Happiness Anchors Tab */}
            {activeTab === 'anchors' && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>😊</span> Joy Network - Happiness Anchors
                  </h2>
                  <p className="text-white/60 text-sm mb-6">
                    Your brightest memories, stored with sensory details for emotional support when you need it most.
                  </p>

                  {happinessAnchors.length === 0 ? (
                    <div className="text-center py-12 text-white/50">
                      <p className="text-4xl mb-4">🌟</p>
                      <p>No happiness anchors yet.</p>
                      <p className="text-sm mt-2">Happy memories will be stored here during conversations.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {happinessAnchors.map((anchor, index) => (
                        <div
                          key={anchor.id || index}
                          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-5 border border-yellow-500/20"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">
                                {anchor.score >= 9 ? '🌟' : anchor.score >= 8 ? '⭐' : '✨'}
                              </div>
                              <div>
                                <div className="text-lg font-medium text-white">
                                  {anchor.memory}
                                </div>
                                {anchor.peakMoment && (
                                  <div className="text-sm text-yellow-400/80 mt-1 italic">
                                    "{anchor.peakMoment}"
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-400">
                                {anchor.score}/10
                              </div>
                              <div className="text-xs text-white/40">
                                Recalled {anchor.recallCount || 1}x
                              </div>
                            </div>
                          </div>

                          {/* Sensory Anchors */}
                          {anchor.sensoryAnchors && Object.keys(anchor.sensoryAnchors).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-yellow-500/20">
                              <div className="text-xs text-white/50 mb-2">Sensory Details:</div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {Object.entries(anchor.sensoryAnchors).map(([sense, detail]) => (
                                  detail && (
                                    <div
                                      key={sense}
                                      className="bg-black/20 rounded-lg p-2 text-center"
                                    >
                                      <div className="text-lg">{SENSORY_ICONS[sense]?.icon || '🎯'}</div>
                                      <div className="text-xs text-white/70 mt-1">{detail}</div>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 text-xs text-white/40">
                            {formatTimeAgo(anchor.lastRecalled || anchor.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emotion Trends Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                {emotionTrends && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">
                        {emotionTrends.mostCommonMood === 'joy' ? '😊' :
                         emotionTrends.mostCommonMood === 'reflective' ? '🤔' :
                         emotionTrends.mostCommonMood === 'anxious' ? '😰' :
                         emotionTrends.mostCommonMood === 'peaceful' ? '😌' : '💭'}
                      </div>
                      <div className="text-sm text-white/60">Most Common Mood</div>
                      <div className="text-lg font-bold text-white capitalize">
                        {emotionTrends.mostCommonMood || 'Unknown'}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">📊</div>
                      <div className="text-sm text-white/60">Avg Intensity</div>
                      <div className="text-lg font-bold text-white">
                        {(parseFloat(emotionTrends.averageIntensity) * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">💗</div>
                      <div className="text-sm text-white/60">High Vulnerability</div>
                      <div className="text-lg font-bold text-white">
                        {emotionTrends.highVulnerabilityRate || '0%'}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">📅</div>
                      <div className="text-sm text-white/60">Sessions</div>
                      <div className="text-lg font-bold text-white">
                        {emotionTrends.sessionCount || 0}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mood Distribution */}
                {emotionTrends?.moodDistribution && (
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Mood Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(emotionTrends.moodDistribution).map(([mood, count]) => {
                        const maxCount = Math.max(...Object.values(emotionTrends.moodDistribution));
                        const percentage = (count / maxCount) * 100;
                        const colors = getEmotionColor(mood);

                        return (
                          <div key={mood} className="flex items-center gap-4">
                            <div className="w-24 text-sm text-white/70 capitalize">{mood}</div>
                            <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${colors.bg} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-right text-white/60 text-sm">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Emotion Timeline */}
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Emotional Sessions</h3>
                  {emotionLogs.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                      <p>No emotion logs yet.</p>
                      <p className="text-sm mt-2">Emotions are tracked during conversations.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {emotionLogs.map((log, index) => {
                        const colors = getEmotionColor(log.dominantMood);
                        return (
                          <div
                            key={log.id || index}
                            className={`${colors.bg} rounded-lg p-4 border ${colors.border}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`text-lg font-medium ${colors.text} capitalize`}>
                                  {log.dominantMood || 'Unknown'}
                                </div>
                                {log.emotionalArc?.length > 0 && (
                                  <div className="text-xs text-white/50">
                                    Arc: {log.emotionalArc.join(' → ')}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-white/60">
                                  {formatDate(log.timestamp)}
                                </div>
                                {log.intensityPeak && (
                                  <div className="text-xs text-white/40">
                                    Peak: {(log.intensityPeak * 100).toFixed(0)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Relationship Tab */}
            {activeTab === 'relationship' && (
              <div className="space-y-6">
                {relationshipStats ? (
                  <>
                    {/* Bond Level Card */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white/60 mb-1">Your Bond with Luna</div>
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">
                              {BOND_LEVELS[relationshipStats.bondLevel]?.emoji || '💫'}
                            </span>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {BOND_LEVELS[relationshipStats.bondLevel]?.label || 'New Connection'}
                              </div>
                              {relationshipStats.birthday && (
                                <div className="text-sm text-white/60">
                                  Together since {formatDate(relationshipStats.birthday)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${BOND_LEVELS[relationshipStats.bondLevel]?.color || 'bg-purple-600'}`}>
                          <span className="text-white font-medium capitalize">
                            {relationshipStats.bondLevel || 'new'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">💬</div>
                        <div className="text-2xl font-bold text-white">
                          {relationshipStats.totalConversations || 0}
                        </div>
                        <div className="text-sm text-white/60">Conversations</div>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📝</div>
                        <div className="text-2xl font-bold text-white">
                          {relationshipStats.totalMessages || 0}
                        </div>
                        <div className="text-sm text-white/60">Messages</div>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-2xl font-bold text-white">
                          {relationshipStats.deepConversations || 0}
                        </div>
                        <div className="text-sm text-white/60">Deep Talks</div>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <div className="text-2xl font-bold text-white">
                          {relationshipStats.daysKnown || 0}
                        </div>
                        <div className="text-sm text-white/60">Days Together</div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {relationshipStats.milestones && (
                      <div className="bg-slate-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Milestones</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(relationshipStats.milestones).map(([key, milestone]) => (
                            <div
                              key={key}
                              className={`rounded-lg p-3 text-center border ${
                                milestone.celebrated
                                  ? 'bg-green-500/20 border-green-500/40'
                                  : milestone.reached
                                    ? 'bg-yellow-500/20 border-yellow-500/40'
                                    : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="text-2xl mb-1">
                                {milestone.celebrated ? '🎉' : milestone.reached ? '⭐' : '🔒'}
                              </div>
                              <div className="text-sm font-medium text-white">
                                {milestone.label || key}
                              </div>
                              {milestone.reachedAt && (
                                <div className="text-xs text-white/50 mt-1">
                                  {formatDate(milestone.reachedAt)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Luna's State */}
                    {relationshipStats.lunaState && (
                      <div className="bg-slate-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Luna's Current State</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-white/60 mb-1">Mood</div>
                            <div className="text-lg text-white capitalize">
                              {relationshipStats.lunaState.currentMood || 'Curious'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-white/60 mb-1">Energy</div>
                            <div className="text-lg text-white capitalize">
                              {relationshipStats.lunaState.energyLevel || 'Balanced'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-white/60 mb-1">Focus</div>
                            <div className="text-lg text-white capitalize">
                              {relationshipStats.lunaState.focusArea || 'Understanding'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-white/60 mb-1">Warmth</div>
                            <div className="text-lg text-white">
                              {((relationshipStats.lunaState.warmthLevel || 0.7) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-800/50 rounded-xl p-12 text-center">
                    <div className="text-4xl mb-4">💫</div>
                    <h3 className="text-xl font-bold text-white mb-2">Start Your Journey</h3>
                    <p className="text-white/60">
                      Begin a conversation with Luna to start tracking your relationship milestones.
                    </p>
                    <Link
                      to="/guest-chat"
                      className="inline-block mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                    >
                      Talk to Luna
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* All Memories Tab */}
            {activeTab === 'memories' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search memories..."
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Memory List */}
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {searchQuery ? 'Search Results' : 'Recent Memories'}
                  </h3>

                  {memories.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                      <p>No memories found.</p>
                      <p className="text-sm mt-2">Memories are stored during conversations with Luna.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {memories.map((memory, index) => (
                        <div
                          key={memory.id || index}
                          className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white">{memory.content || memory.memory}</p>
                              {memory.emotion && (
                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${getEmotionColor(memory.emotion).bg} ${getEmotionColor(memory.emotion).text}`}>
                                  {memory.emotion}
                                </span>
                              )}
                              {memory.people?.length > 0 && (
                                <div className="mt-2 flex gap-1">
                                  {memory.people.map((person, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                      {person}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xs text-white/40">
                                {formatTimeAgo(memory.createdAt || memory.timestamp)}
                              </div>
                              {memory.importance && (
                                <div className="text-xs text-purple-400 mt-1">
                                  Importance: {(memory.importance * 100).toFixed(0)}%
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
