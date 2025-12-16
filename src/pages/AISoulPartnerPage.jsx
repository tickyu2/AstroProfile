/**
 * AISoulPartnerPage.jsx
 * Full-page AI SoulPartner Chat Experience
 *
 * The Constitutional Intelligence Engine in action:
 * - Detects emotional states
 * - Determines response mode (Witness/Dialogue/Guidance)
 * - Tracks soul burden in real-time
 * - Recognizes constitutional patterns
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { useConversations } from '../contexts/ConversationsContext';
import { AISoulPartnerChat, SoulPartnerNotes, AIIdentityPanel } from '../components/aiSoulPartner';
import DEFAULT_AI_IDENTITY from '../data/aiSoulPartnerIdentity';

export default function AISoulPartnerPage() {
  const { currentUser, logout } = useAuth();
  const { profiles, loading, updateAISoulPartnerNotes } = useProfiles();
  const { setActiveProfileId } = useConversations();

  // Selected profile state - default to first profile or 'self' type
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  // Notes panel visibility and active tab
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'ai'

  // Find the selected profile or default
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileId) {
      // Try to find self profile first, then fall back to first profile
      const selfProfile = profiles.find(p =>
        p.relationshipType?.toLowerCase() === 'self' ||
        p.relationshipType?.toLowerCase() === 'me'
      );
      setSelectedProfileId(selfProfile?.id || profiles[0]?.id);
    }
  }, [profiles, selectedProfileId]);

  // Sync selected profile to ConversationsContext for per-profile chat isolation
  // When profile changes, conversations reload for that specific profile's threads
  useEffect(() => {
    if (selectedProfileId) {
      console.log('🔄 Switching conversations to profile:', selectedProfileId);
      setActiveProfileId(selectedProfileId);
    }
  }, [selectedProfileId, setActiveProfileId]);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0] || {};

  // Build comprehensive constitutional profile for the intelligence engine
  const constitutionalProfile = {
    // User ID for Firestore operations (threads, patterns, etc.)
    userId: currentUser?.uid,
    profileId: selectedProfileId, // The specific profile being chatted with

    // Core identity
    displayName: selectedProfile.displayName || selectedProfile.firstName || 'Friend',
    firstName: selectedProfile.firstName,
    lastName: selectedProfile.lastName,
    gender: selectedProfile.gender,
    relationshipType: selectedProfile.relationshipType,

    // Constitutional identity - the soul's blueprint
    constitutional_identity: {
      // BaZi / Four Pillars
      bazi: {
        day_master: selectedProfile.calculations?.fourPillars?.dayPillar?.stem || 'Unknown',
        day_branch: selectedProfile.calculations?.fourPillars?.dayPillar?.branch || 'Unknown',
        element_balance: selectedProfile.calculations?.fourPillars?.elementBalance || 'Unknown',
        four_pillars: selectedProfile.calculations?.fourPillars || null,
        seasonal_strength: selectedProfile.calculations?.seasonalStrength || null
      },
      // Chinese Zodiac
      chinese: {
        animal: selectedProfile.chineseZodiac?.animal || selectedProfile.calculations?.chinese?.animal || 'Unknown',
        element: selectedProfile.chineseZodiac?.element || selectedProfile.calculations?.chinese?.element || 'Unknown',
        fullSign: selectedProfile.chineseZodiac?.fullSign || 'Unknown',
        chineseYear: selectedProfile.chineseZodiac?.chineseYear || null
      },
      // Western Zodiac
      western: {
        sun: selectedProfile.calculations?.western?.sign || 'Unknown',
        rising: selectedProfile.calculations?.western?.rising || 'Unknown',
        element: selectedProfile.calculations?.western?.element || 'Unknown',
        modality: selectedProfile.calculations?.western?.modality || 'Unknown'
      },
      // Yin Yang Balance
      yinYang: selectedProfile.calculations?.yinYang || null,
      // Numerology
      numerology: selectedProfile.calculations?.numerology || null
    },

    // Personality markers (if available)
    personality: {
      mbti: selectedProfile.mbti || null,
      big5: selectedProfile.big5 || null,
      enneagram: selectedProfile.enneagram || null
    },

    // Communication preferences (to be learned over time)
    communication_preferences: {
      needs_witness_vs_advice: "balanced",
      processing_style: selectedProfile.calculations?.yinYang?.dominant === 'Yin'
        ? "Internal processor"
        : "External processor",
      trigger_words: [],
      comfort_language: ["I see you", "That makes sense", "Tell me more"]
    },

    // Birth details for context
    birth: {
      date: selectedProfile.birthDate,
      time: selectedProfile.birthTime,
      location: selectedProfile.location?.fullAddress || selectedProfile.location?.city
    },

    // AI SoulPartner notes (what Claude has learned about this person)
    aiSoulPartner: selectedProfile.aiSoulPartner || null
  };

  // Handle updating AI notes
  const handleUpdateNotes = async (newNotes) => {
    if (selectedProfileId) {
      try {
        await updateAISoulPartnerNotes(selectedProfileId, newNotes);
      } catch (error) {
        console.error('Failed to update notes:', error);
      }
    }
  };

  const handleMessageSend = (userMessage, aiMessage, analysis) => {
    // Log for debugging
    console.log('📨 Message sent:', {
      user: userMessage.text.slice(0, 50) + '...',
      mode: analysis.recommendedMode,
      confidence: Math.round(analysis.confidence * 100) + '%',
      soulBurden: analysis.burden,
      shouldStore: analysis.shouldStore
    });

    // In production, save important patterns to Firebase
    if (analysis.shouldStore) {
      console.log('📝 Pattern recognized - would save to "Getting to Know Me" profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get display info for selected profile
  const getProfileDisplayInfo = (profile) => {
    if (!profile?.id) return { name: 'Loading...', subtitle: '' };

    const zodiac = profile.chineseZodiac?.fullSign ||
      `${profile.chineseZodiac?.element || ''} ${profile.chineseZodiac?.animal || ''}`.trim() ||
      profile.calculations?.chinese?.fullSign ||
      '';

    const western = profile.calculations?.western?.sign || '';

    return {
      name: profile.displayName || profile.firstName || 'Unknown',
      subtitle: [zodiac, western].filter(Boolean).join(' • ') || profile.relationshipType || ''
    };
  };

  const selectedInfo = getProfileDisplayInfo(selectedProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
            >
              <span>←</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              🌟 AI SoulPartner
            </h1>
          </div>

          {/* Profile Selector */}
          <div className="flex items-center gap-4">
            <Link
              to="/knowledge-base"
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              📚 Knowledge Base
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Chatting as:</span>
              <select
                value={selectedProfileId || ''}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="bg-slate-800/80 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
              >
                {loading ? (
                  <option>Loading profiles...</option>
                ) : profiles.length === 0 ? (
                  <option>No profiles found</option>
                ) : (
                  profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.displayName || profile.firstName}
                      {profile.relationshipType ? ` (${profile.relationshipType})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="h-4 w-px bg-white/20" />

            <span className="text-sm text-white/50">
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Selected Profile Info Bar */}
        {selectedProfile?.id && (
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-t border-amber-500/20">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
                {selectedInfo.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-white/90">{selectedInfo.name}</div>
                {selectedInfo.subtitle && (
                  <div className="text-xs text-amber-400/70">{selectedInfo.subtitle}</div>
                )}
              </div>
              {selectedProfile.mbti && (
                <span className="ml-2 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {selectedProfile.mbti}
                </span>
              )}
              {/* Notes button */}
              <button
                onClick={() => setShowNotesPanel(!showNotesPanel)}
                className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  showNotesPanel
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                }`}
              >
                📝 {showNotesPanel ? 'Hide Notes' : 'Soul Notes'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - adjust height for header + profile bar */}
      <main className="h-[calc(100vh-108px)] flex">
        {/* Chat area */}
        <div className={`transition-all duration-300 ${showNotesPanel ? 'flex-1' : 'w-full'}`}>
          <AISoulPartnerChat
            key={selectedProfileId} // Reset chat when profile changes
            userProfile={constitutionalProfile}
            onMessageSend={handleMessageSend}
          />
        </div>

        {/* Notes Panel (slide out) */}
        {showNotesPanel && (
          <div className="w-96 border-l border-white/10 bg-slate-900/50 flex flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'user'
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                👤 {selectedProfile?.firstName || 'User'}'s Notes
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'ai'
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                🤖 AI Identity
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'user' ? (
                <SoulPartnerNotes
                  profile={selectedProfile}
                  onUpdateNotes={handleUpdateNotes}
                />
              ) : (
                <AIIdentityPanel
                  aiIdentity={DEFAULT_AI_IDENTITY}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
