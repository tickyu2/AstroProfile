/**
 * LIZ GREENE CATHEDRAL OF PSYCHOLOGICAL ASTROLOGY
 *
 * The Cathedral - A dedicated deep-dive experience for psychological astrology.
 * Now powered by buildLizGreeneCathedralProfile - the master orchestrator.
 *
 * Tabs:
 * - Tab 1: Soul Portrait - Overview with Trinity card & narrative
 * - Tab 2: The Trinity - Sun/Moon/Rising deep dives
 * - Tab 3: Tripartite Soul - Platonic psychology (Logos/Thumos/Epithumia)
 * - Tab 4: Aspect Configurations - T-Squares, Grand Trines, Yods
 * - Tab 5: Planetary Psychology - Individual planet cards
 * - Tab 6: Shadow & Integration - Shadow work and growth
 * - Tab 7: Greene vs Jung - Archetype mapping
 * - Tab 8: Pilgrim Journey - Individuation stages
 * - Tab 9: Saturn Journey - Fear → Mastery
 * - Tab 10: Fate Threads - Nodal axis & destiny (NEW)
 * - Tab 11: Relationship Destiny - Full relationship OS (when partner data available)
 *
 * "The Cathedral of Psychological Astrology"
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';

// Master Orchestrator - wires the entire Cathedral
import { buildLizGreeneCathedralProfile } from '../utils/buildLizGreeneCathedralProfile';

// Legacy imports for fallback/direct access
import { generateCompletePsychologicalProfile } from '../utils/psychologicalProfileGenerator';
import { detectAspectPatterns } from '../utils/aspectPatternDetector';
import { analyzeMythicPsychology } from '../utils/mythicArchetypeSystem';
import { analyzeHerosJourney } from '../utils/herosJourneyFramework';
import { generatePsychologicalNarrative } from '../utils/psychologicalNarrativeGenerator';
import { getFullJourneyContext } from '../utils/pilgrimJourneyRouter';

// Components
import PilgrimJourneyStage, { PilgrimJourneyProgress, PilgrimStageCard } from '../components/pilgrim/PilgrimJourneyStage';
import SaturnJourneyPanel from '../components/saturn/SaturnJourneyPanel';
import { RelationshipDestinyPanel, RelationshipDestinyMap } from '../components/relationship';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE - Element-based theming
// ═══════════════════════════════════════════════════════════════════════════

const ELEMENT_COLORS = {
  Fire: {
    bg: 'bg-gradient-to-br from-orange-900/30 to-red-900/30',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
    accent: '#FF6B35'
  },
  Earth: {
    bg: 'bg-gradient-to-br from-green-900/30 to-amber-900/30',
    border: 'border-green-500/30',
    text: 'text-green-300',
    accent: '#2D5016'
  },
  Air: {
    bg: 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    accent: '#4A90D9'
  },
  Water: {
    bg: 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30',
    border: 'border-indigo-500/30',
    text: 'text-indigo-300',
    accent: '#1A5F7A'
  }
};

const SIGN_ELEMENTS = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

// ═══════════════════════════════════════════════════════════════════════════
// TAB CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const TABS = [
  { id: 'soul-portrait', label: 'Soul Portrait', icon: '✧', description: 'Overview' },
  { id: 'trinity', label: 'The Trinity', icon: '☉', description: 'Sun/Moon/Rising' },
  { id: 'tripartite', label: 'Tripartite Soul', icon: '⚖', description: 'Platonic Psychology' },
  { id: 'aspects', label: 'Aspect Patterns', icon: '◇', description: 'Configurations' },
  { id: 'planets', label: 'Planetary', icon: '♄', description: 'Psychology' },
  { id: 'shadow', label: 'Shadow Work', icon: '☾', description: 'Integration' },
  { id: 'jung', label: 'Greene × Jung', icon: '∞', description: 'Archetypes' },
  { id: 'pilgrim', label: 'Pilgrim Journey', icon: '⟡', description: 'Individuation' },
  { id: 'saturn', label: 'Saturn Journey', icon: '🪨', description: 'Fear → Mastery' },
  { id: 'fate', label: 'Fate Threads', icon: '☊', description: 'Nodal Destiny' }
];

// Relationship tabs - shown only when partner data available
const RELATIONSHIP_TABS = [
  { id: 'relationship-destiny', label: 'Relationship', icon: '♡', description: 'Soul Bond' },
  { id: 'relationship-map', label: 'Destiny Map', icon: '◎', description: 'Visual Mandala' }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LizGreeneCathedralPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [selectedProfileId, setSelectedProfileId] = useState(profileId || null);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [activeTab, setActiveTab] = useState('soul-portrait');
  const [expandedCards, setExpandedCards] = useState({});
  const [cathedralProfile, setCathedralProfile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-select profile with Western data
  useEffect(() => {
    if (!selectedProfileId && profiles?.length > 0) {
      const profileWithData = profiles.find(p =>
        p.calculations?.western?.sovereignCalculation?.sun?.sign
      );
      setSelectedProfileId(profileWithData?.id || profiles[0].id);
    }
  }, [profiles, selectedProfileId]);

  // Find the profile
  const profile = useMemo(() => {
    return profiles.find(p => p.id === selectedProfileId) || profiles[0];
  }, [profiles, selectedProfileId]);

  // Find partner profile (if selected)
  const partnerProfile = useMemo(() => {
    if (!selectedPartnerId) return null;
    return profiles.find(p => p.id === selectedPartnerId);
  }, [profiles, selectedPartnerId]);

  // Extract Western astrology data
  const westernData = useMemo(() => {
    if (!profile) return null;
    const sovereign = profile.calculations?.western?.sovereignCalculation || {};
    return {
      sun: sovereign.sun || {},
      moon: sovereign.moon || {},
      rising: sovereign.rising || {},
      planets: sovereign.planets || {},
      aspects: sovereign.aspects || [],
      houses: sovereign.houses || {}
    };
  }, [profile]);

  // Build chart data for orchestrator
  const buildChartData = (profileData) => {
    if (!profileData) return null;
    const sovereign = profileData.calculations?.western?.sovereignCalculation || {};
    return {
      name: profileData.displayName || profileData.name,
      birthDate: profileData.birthDate,
      birthTime: profileData.birthTime,
      birthPlace: profileData.birthPlace,
      sun: sovereign.sun,
      moon: sovereign.moon,
      rising: sovereign.rising,
      planets: sovereign.planets,
      aspects: sovereign.aspects,
      houses: sovereign.houses
    };
  };

  // Generate Cathedral Profile using orchestrator
  useEffect(() => {
    async function generateCathedralProfile() {
      if (!profile || !westernData?.sun?.sign) return;

      setIsGenerating(true);
      try {
        const primaryChart = buildChartData(profile);
        const partnerChart = partnerProfile ? buildChartData(partnerProfile) : null;

        const input = {
          primary: primaryChart,
          partner: partnerChart
        };

        const fullProfile = await buildLizGreeneCathedralProfile(input, {
          verbosity: 'detailed',
          includeMinorAspects: true
        });

        setCathedralProfile(fullProfile);
      } catch (error) {
        console.error('Cathedral Profile generation error:', error);
        // Fallback to legacy generation
        setCathedralProfile(null);
      } finally {
        setIsGenerating(false);
      }
    }

    generateCathedralProfile();
  }, [profile, partnerProfile, westernData?.sun?.sign]);

  // Legacy psychological profile as fallback
  const psychProfile = useMemo(() => {
    if (cathedralProfile?.trinity) {
      // Use orchestrator data
      return cathedralProfile;
    }
    // Fallback to direct generation
    if (!westernData?.sun?.sign) return null;
    return generateCompletePsychologicalProfile(westernData);
  }, [westernData, cathedralProfile]);

  // Determine dominant element for theming
  const dominantElement = useMemo(() => {
    if (cathedralProfile?.quickAccess?.dominantElement) {
      return cathedralProfile.quickAccess.dominantElement;
    }
    if (!westernData?.sun?.sign) return 'Water';
    return SIGN_ELEMENTS[westernData.sun.sign] || 'Water';
  }, [westernData, cathedralProfile]);

  const colors = ELEMENT_COLORS[dominantElement];

  // Check if relationship data is available
  const hasRelationshipData = cathedralProfile?.relationshipDestiny !== null;

  // Build tabs list - include relationship tabs if partner selected
  const activeTabs = useMemo(() => {
    if (hasRelationshipData) {
      return [...TABS, ...RELATIONSHIP_TABS];
    }
    return TABS;
  }, [hasRelationshipData]);

  // Toggle card expansion
  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Loading state
  if (profilesLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">✧</div>
          <p className="text-purple-300">Entering the Cathedral...</p>
        </div>
      </div>
    );
  }

  // No profile or data
  if (!profile || !westernData?.sun?.sign) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">✧</div>
          <p className="text-yellow-400 text-xl mb-2">Birth Chart Required</p>
          <p className="text-slate-400 mb-6">
            The Cathedral of Psychological Astrology requires complete birth data
          </p>

          {profiles?.length > 1 && (
            <select
              value={selectedProfileId || ''}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white mb-4"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.displayName || p.name}
                  {p.calculations?.western?.sovereignCalculation?.sun?.sign ? ' ✓' : ' (no data)'}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-light text-white flex items-center gap-2">
                  <span className="text-purple-400">✧</span>
                  Liz Greene Cathedral
                  <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded ml-2">
                    Psychological Astrology
                  </span>
                </h1>
              </div>
            </div>

            {/* Profile Selectors */}
            <div className="flex items-center gap-3">
              {/* Primary Profile */}
              <select
                value={selectedProfileId || ''}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.displayName || p.name}
                  </option>
                ))}
              </select>

              {/* Partner Profile (optional) */}
              {profiles.length > 1 && (
                <select
                  value={selectedPartnerId || ''}
                  onChange={(e) => setSelectedPartnerId(e.target.value || null)}
                  className="px-3 py-2 bg-slate-800 border border-pink-500/30 rounded-lg text-white text-sm"
                >
                  <option value="">+ Add Partner</option>
                  {profiles
                    .filter(p => p.id !== selectedProfileId)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        ♡ {p.displayName || p.name}
                      </option>
                    ))}
                </select>
              )}

              {/* Generating indicator */}
              {isGenerating && (
                <span className="text-purple-400 text-sm animate-pulse">
                  ✧ Generating...
                </span>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 mt-4 overflow-x-auto pb-2">
            {activeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab 1: Soul Portrait */}
        {activeTab === 'soul-portrait' && (
          <SoulPortraitTab
            profile={profile}
            westernData={westernData}
            psychProfile={psychProfile}
            colors={colors}
            dominantElement={dominantElement}
          />
        )}

        {/* Tab 2: The Trinity */}
        {activeTab === 'trinity' && (
          <TrinityTab
            westernData={westernData}
            psychProfile={psychProfile}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />
        )}

        {/* Tab 3: Tripartite Soul */}
        {activeTab === 'tripartite' && (
          <TripartiteSoulTab psychProfile={psychProfile} />
        )}

        {/* Tab 4: Aspect Configurations */}
        {activeTab === 'aspects' && (
          <AspectPatternsTab
            westernData={westernData}
            psychProfile={psychProfile}
          />
        )}

        {/* Tab 5: Planetary Psychology */}
        {activeTab === 'planets' && (
          <PlanetaryPsychologyTab
            westernData={westernData}
            psychProfile={psychProfile}
            expandedCards={expandedCards}
            toggleCard={toggleCard}
          />
        )}

        {/* Tab 6: Shadow & Integration */}
        {activeTab === 'shadow' && (
          <ShadowWorkTab
            westernData={westernData}
            psychProfile={psychProfile}
          />
        )}

        {/* Tab 7: Greene vs Jung */}
        {activeTab === 'jung' && (
          <GreeneJungTab
            westernData={westernData}
            psychProfile={psychProfile}
            birthDate={profile?.birthDate}
          />
        )}

        {/* Tab 8: Pilgrim Journey */}
        {activeTab === 'pilgrim' && (
          <PilgrimJourneyTab
            profile={profile}
            westernData={westernData}
          />
        )}

        {/* Tab 9: Saturn Journey */}
        {activeTab === 'saturn' && (
          <SaturnJourneyPanel
            westernData={westernData}
            birthDate={profile?.birthDate}
            aspects={westernData?.aspects || []}
          />
        )}

        {/* Tab 10: Fate Threads */}
        {activeTab === 'fate' && (
          <FateThreadsTab
            westernData={westernData}
            cathedralProfile={cathedralProfile}
          />
        )}

        {/* Tab 11: Relationship Destiny Panel (when partner selected) */}
        {activeTab === 'relationship-destiny' && cathedralProfile?.relationshipDestiny && (
          <RelationshipDestinyPanel
            report={cathedralProfile.relationshipDestiny}
          />
        )}

        {/* Tab 12: Relationship Destiny Map (when partner selected) */}
        {activeTab === 'relationship-map' && cathedralProfile?.relationshipDestiny && (
          <RelationshipDestinyMap
            report={cathedralProfile.relationshipDestiny}
          />
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: SOUL PORTRAIT (Overview)
// ═══════════════════════════════════════════════════════════════════════════

function SoulPortraitTab({ profile, westernData, psychProfile, colors, dominantElement }) {
  // Generate psychological narrative
  const narrative = useMemo(() => {
    if (!westernData?.sun?.sign) return null;
    return generatePsychologicalNarrative(westernData, profile?.birthDate);
  }, [westernData, profile?.birthDate]);

  if (!psychProfile) return <LoadingState />;

  const { coreIdentity, emotionalNature, persona } = psychProfile;

  return (
    <div className="space-y-8">
      {/* Trinity Card */}
      <div className={`${colors.bg} ${colors.border} border rounded-2xl p-8`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white mb-2">
            {profile.displayName || profile.name}
          </h2>
          <p className={`${colors.text} text-lg`}>
            {coreIdentity?.archetype || 'Soul in Discovery'}
          </p>
        </div>

        {/* Sun/Moon/Rising Trinity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sun */}
          <div className="bg-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">☉</div>
            <div className="text-yellow-400 text-xl mb-1">{westernData.sun?.sign || '—'}</div>
            <div className="text-slate-400 text-sm mb-3">Sun · Core Identity</div>
            <p className="text-slate-300 text-sm">
              {coreIdentity?.consciousPurpose || 'The conscious self'}
            </p>
          </div>

          {/* Moon */}
          <div className="bg-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">☽</div>
            <div className="text-purple-400 text-xl mb-1">{westernData.moon?.sign || '—'}</div>
            <div className="text-slate-400 text-sm mb-3">Moon · Emotional Core</div>
            <p className="text-slate-300 text-sm">
              {emotionalNature?.innerNeeds || 'The emotional self'}
            </p>
          </div>

          {/* Rising */}
          <div className="bg-slate-800/50 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">↑</div>
            <div className="text-blue-400 text-xl mb-1">{westernData.rising?.sign || '—'}</div>
            <div className="text-slate-400 text-sm mb-3">Rising · Persona</div>
            <p className="text-slate-300 text-sm">
              {persona?.firstImpression || 'The outer self'}
            </p>
          </div>
        </div>
      </div>

      {/* Life Question */}
      {coreIdentity?.lifeQuestion && (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3">
            Your Life Question
          </h3>
          <p className="text-white text-2xl font-light italic">
            "{coreIdentity.lifeQuestion}"
          </p>
        </div>
      )}

      {/* Element Dominance */}
      <div className="bg-slate-800/30 rounded-xl p-6">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4">
          Elemental Nature
        </h3>
        <div className="flex items-center gap-4">
          <div className={`text-4xl ${colors.text}`}>
            {dominantElement === 'Fire' && '🔥'}
            {dominantElement === 'Earth' && '🌍'}
            {dominantElement === 'Air' && '💨'}
            {dominantElement === 'Water' && '💧'}
          </div>
          <div>
            <div className={`text-xl ${colors.text}`}>{dominantElement} Dominant</div>
            <p className="text-slate-400 text-sm">
              {psychProfile.temperament?.temperament || 'Your elemental constitution'}
            </p>
          </div>
        </div>
      </div>

      {/* Growth Path Preview */}
      {coreIdentity?.growthPath && (
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3">
            Growth Path
          </h3>
          <p className="text-slate-300">
            {coreIdentity.growthPath}
          </p>
        </div>
      )}

      {/* Your Psychological Myth - Generated Narrative */}
      {narrative && narrative.sections && (
        <div className="space-y-6 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-white mb-2">
              {narrative.title || 'Your Psychological Myth'}
            </h2>
            <p className="text-purple-400 text-sm italic">
              {narrative.subtitle || 'A Psychological Portrait in the Tradition of Liz Greene'}
            </p>
          </div>

          {/* Narrative Sections */}
          <div className="space-y-4">
            {narrative.sections.map((section, idx) => {
              // Color mapping for each section type
              const sectionStyles = {
                opening: { bg: 'from-purple-900/30 to-indigo-900/30', border: 'border-purple-500/30', icon: '✧', label: 'text-purple-300' },
                wound: { bg: 'from-red-900/20 to-slate-800/20', border: 'border-red-500/20', icon: '🩸', label: 'text-red-300' },
                quest: { bg: 'from-amber-900/20 to-orange-900/20', border: 'border-amber-500/30', icon: '⚔', label: 'text-amber-300' },
                shadow: { bg: 'from-slate-800/50 to-purple-900/20', border: 'border-slate-600', icon: '☾', label: 'text-slate-300' },
                gift: { bg: 'from-green-900/20 to-emerald-900/20', border: 'border-green-500/30', icon: '✦', label: 'text-green-300' },
                pattern: { bg: 'from-blue-900/20 to-cyan-900/20', border: 'border-blue-500/30', icon: '◇', label: 'text-blue-300' },
                closing: { bg: 'from-indigo-900/30 to-purple-900/30', border: 'border-indigo-500/30', icon: '∞', label: 'text-indigo-300' }
              };
              const style = sectionStyles[section.type] || sectionStyles.opening;

              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-r ${style.bg} border ${style.border} rounded-xl p-6`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{style.icon}</span>
                    <h3 className={`${style.label} text-sm uppercase tracking-wider`}>
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Narrative Metadata */}
          {narrative.metadata && (
            <div className="bg-slate-800/20 border border-slate-700 rounded-xl p-4 mt-6">
              <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500">
                {narrative.metadata.dominantElement && (
                  <span className={`px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
                    {narrative.metadata.dominantElement} Dominant
                  </span>
                )}
                {narrative.metadata.coreWound && (
                  <span className="px-2 py-1 rounded bg-red-900/30 text-red-400">
                    Wound: {narrative.metadata.coreWound}
                  </span>
                )}
                {narrative.metadata.currentPhase && (
                  <span className="px-2 py-1 rounded bg-indigo-900/30 text-indigo-400">
                    Phase: {narrative.metadata.currentPhase}
                  </span>
                )}
                {narrative.metadata.patternCount > 0 && (
                  <span className="px-2 py-1 rounded bg-purple-900/30 text-purple-400">
                    {narrative.metadata.patternCount} Major Pattern{narrative.metadata.patternCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: THE TRINITY (Sun/Moon/Rising Deep Dives)
// ═══════════════════════════════════════════════════════════════════════════

function TrinityTab({ westernData, psychProfile, expandedCards, toggleCard }) {
  if (!psychProfile) return <LoadingState />;

  const { coreIdentity, emotionalNature, persona } = psychProfile;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">The Sacred Trinity</h2>
        <p className="text-slate-400">Sun, Moon, and Rising - the three pillars of self</p>
      </div>

      {/* Sun Deep Dive */}
      <ExpandableCard
        id="sun"
        title={`☉ Sun in ${westernData.sun?.sign || '—'}`}
        subtitle="Core Identity · The Conscious Self"
        isExpanded={expandedCards['sun']}
        onToggle={() => toggleCard('sun')}
        color="yellow"
      >
        <div className="space-y-4">
          <Section label="Archetype" content={coreIdentity?.archetype} />
          <Section label="Conscious Purpose" content={coreIdentity?.consciousPurpose} />
          <Section label="Central Drive" content={coreIdentity?.centralDrive} />
          <Section label="Light Expression" content={coreIdentity?.lightExpression} />
          <Section label="Shadow Tendency" content={coreIdentity?.shadowTendency} highlight />
          <Section label="Life Question" content={coreIdentity?.lifeQuestion} italic />
          <Section label="Growth Path" content={coreIdentity?.growthPath} />
        </div>
      </ExpandableCard>

      {/* Moon Deep Dive */}
      <ExpandableCard
        id="moon"
        title={`☽ Moon in ${westernData.moon?.sign || '—'}`}
        subtitle="Emotional Nature · The Inner Self"
        isExpanded={expandedCards['moon']}
        onToggle={() => toggleCard('moon')}
        color="purple"
      >
        <div className="space-y-4">
          <Section label="Emotional Nature" content={emotionalNature?.emotionalNature} />
          <Section label="Inner Needs" content={emotionalNature?.innerNeeds} />
          <Section label="Instinctual Response" content={emotionalNature?.instinctualResponse} />
          <Section label="Childhood Pattern" content={emotionalNature?.childhoodPattern} highlight />
          <Section label="Emotional Shadow" content={emotionalNature?.emotionalShadow} highlight />
          <Section label="Nurturing Style" content={emotionalNature?.nurturingStyle} />
        </div>
      </ExpandableCard>

      {/* Rising Deep Dive */}
      <ExpandableCard
        id="rising"
        title={`↑ Rising in ${westernData.rising?.sign || '—'}`}
        subtitle="Persona · The Outer Self"
        isExpanded={expandedCards['rising']}
        onToggle={() => toggleCard('rising')}
        color="blue"
      >
        <div className="space-y-4">
          <Section label="Archetype" content={persona?.archetype} />
          <Section label="First Impression" content={persona?.firstImpression} />
          <Section label="Approach to Life" content={persona?.approachToLife} />
          <Section label="Physical Presence" content={persona?.physicalPresence} />
          <Section label="Life Lesson" content={persona?.lifeLesson} />
        </div>
      </ExpandableCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: TRIPARTITE SOUL (Platonic Psychology)
// ═══════════════════════════════════════════════════════════════════════════

function TripartiteSoulTab({ psychProfile }) {
  if (!psychProfile) return <LoadingState />;

  const tripartite = psychProfile.characterAndShadow?.tripartiteSoul || {};

  const SOUL_PARTS = [
    {
      name: 'Reason (Logos)',
      symbol: '🧠',
      description: 'Mercury-Saturn Dynamic',
      key: 'reason',
      color: 'blue',
      explanation: 'The rational mind - how you think, analyze, and structure reality'
    },
    {
      name: 'Spirit (Thumos)',
      symbol: '🔥',
      description: 'Mars-Neptune Dynamic',
      key: 'spirit',
      color: 'red',
      explanation: 'The spirited will - how you assert, dream, and channel passion'
    },
    {
      name: 'Appetite (Epithumia)',
      symbol: '💫',
      description: 'Venus-Jupiter Dynamic',
      key: 'appetite',
      color: 'green',
      explanation: 'The desiring self - how you love, value, and seek pleasure'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">The Tripartite Soul</h2>
        <p className="text-slate-400">Plato's model of the soul applied to your chart</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SOUL_PARTS.map(part => (
          <div
            key={part.key}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{part.symbol}</div>
              <h3 className="text-white text-lg font-medium">{part.name}</h3>
              <p className="text-slate-400 text-sm">{part.description}</p>
            </div>

            <p className="text-slate-300 text-sm mb-4">{part.explanation}</p>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-300 text-sm">
                {tripartite[part.key] || 'Expression pattern unavailable'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Balance Indicator */}
      <div className="bg-slate-800/30 rounded-xl p-6 mt-8">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4 text-center">
          Soul Balance
        </h3>
        <p className="text-slate-400 text-center text-sm">
          The ideal is harmony between all three parts - reason guiding, spirit motivating, appetite enjoying.
          Imbalance creates inner conflict; awareness enables integration.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4: ASPECT CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

function AspectPatternsTab({ westernData, psychProfile }) {
  const aspects = westernData?.aspects || [];

  // Detect major aspect patterns using the new detector
  const detectedPatterns = useMemo(() => {
    return detectAspectPatterns(westernData);
  }, [westernData]);

  // Group aspects by type
  const aspectGroups = useMemo(() => {
    const groups = {
      conjunction: [],
      opposition: [],
      trine: [],
      square: [],
      sextile: [],
      quincunx: [],
      other: []
    };

    aspects.forEach(aspect => {
      const type = aspect.aspect?.toLowerCase() || 'other';
      if (groups[type]) {
        groups[type].push(aspect);
      } else {
        groups.other.push(aspect);
      }
    });

    return groups;
  }, [aspects]);

  // Aspect interpretations from psychProfile
  const aspectInterpretations = psychProfile?.characterAndShadow?.aspectPsychology || [];

  // Pattern color mapping
  const patternColors = {
    'Grand Trine': { bg: 'bg-blue-900/30', border: 'border-blue-500/40', text: 'text-blue-300', icon: '△' },
    'T-Square': { bg: 'bg-red-900/30', border: 'border-red-500/40', text: 'text-red-300', icon: '⊥' },
    'Yod': { bg: 'bg-purple-900/30', border: 'border-purple-500/40', text: 'text-purple-300', icon: '⋎' },
    'Grand Cross': { bg: 'bg-orange-900/30', border: 'border-orange-500/40', text: 'text-orange-300', icon: '✚' },
    'Kite': { bg: 'bg-cyan-900/30', border: 'border-cyan-500/40', text: 'text-cyan-300', icon: '◇' }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Aspect Configurations</h2>
        <p className="text-slate-400">How your planets dialogue with each other</p>
      </div>

      {/* Aspect Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AspectTypeCard type="Conjunction" count={aspectGroups.conjunction.length} symbol="☌" color="yellow" />
        <AspectTypeCard type="Opposition" count={aspectGroups.opposition.length} symbol="☍" color="red" />
        <AspectTypeCard type="Trine" count={aspectGroups.trine.length} symbol="△" color="blue" />
        <AspectTypeCard type="Square" count={aspectGroups.square.length} symbol="□" color="orange" />
      </div>

      {/* Detected Major Patterns */}
      {detectedPatterns.patterns && detectedPatterns.patterns.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-purple-400">✧</span>
            Major Aspect Patterns Detected
          </h3>
          {detectedPatterns.patterns.map((pattern, idx) => {
            const colors = patternColors[pattern.type] || patternColors['Grand Trine'];
            return (
              <div
                key={idx}
                className={`${colors.bg} ${colors.border} border rounded-xl p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{colors.icon}</span>
                  <div>
                    <h4 className={`${colors.text} text-lg font-medium`}>{pattern.type}</h4>
                    <p className="text-slate-400 text-sm">
                      {pattern.planets?.join(' – ')}
                      {pattern.element && ` • ${pattern.element} Element`}
                      {pattern.modality && ` • ${pattern.modality} Modality`}
                    </p>
                  </div>
                </div>

                {/* Pattern Psychology */}
                {pattern.psychology && (
                  <div className="space-y-4 mt-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <span className="text-green-400 text-xs uppercase">Light Expression</span>
                      <p className="text-slate-300 text-sm mt-1">{pattern.psychology.light}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <span className="text-amber-400 text-xs uppercase">Shadow Expression</span>
                      <p className="text-slate-300 text-sm mt-1">{pattern.psychology.shadow}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <span className="text-purple-400 text-xs uppercase">Integration Path</span>
                      <p className="text-slate-300 text-sm mt-1">{pattern.psychology.integration}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pattern Summary */}
      {detectedPatterns.summary && (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3">
            Pattern Summary
          </h3>
          <p className="text-slate-300">{detectedPatterns.summary}</p>
        </div>
      )}

      {/* Aspect Interpretations */}
      {aspectInterpretations.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider">Key Aspect Dialogues</h3>
          {aspectInterpretations.map((interp, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">◇</span>
                <div>
                  <h4 className="text-white font-medium">{interp.pattern || 'Aspect Pattern'}</h4>
                  <p className="text-slate-400 text-sm">{interp.planets?.join(' – ') || ''}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4">{interp.psychology}</p>
              {interp.integration && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-purple-400 text-xs uppercase">Integration Path:</span>
                  <p className="text-slate-400 text-sm mt-1">{interp.integration}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quincunxes - Greene's "Invisible Friction" */}
      {detectedPatterns.quincunxes && detectedPatterns.quincunxes.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-pink-400">⚻</span>
            Quincunxes - "Invisible Friction"
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Greene's insight: Quincunxes (150°) create tension through incompatibility, not conflict.
            The planets share nothing in common—they simply don't understand each other.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detectedPatterns.quincunxes.map((quincunx, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-pink-900/20 to-slate-800/30 border border-pink-500/30 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl text-pink-400">⚻</span>
                  <div>
                    <h4 className="text-pink-300 font-medium">{quincunx.planets.join(' ⚻ ')}</h4>
                    <p className="text-slate-500 text-xs">{quincunx.signs?.join(' – ')} • Orb: {quincunx.orb?.toFixed(1)}°</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-3">{quincunx.psychology}</p>
                <div className="space-y-2">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <span className="text-amber-400 text-xs uppercase">Shadow / Health Note</span>
                    <p className="text-slate-400 text-sm mt-1">{quincunx.shadow}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <span className="text-green-400 text-xs uppercase">Integration</span>
                    <p className="text-slate-400 text-sm mt-1">{quincunx.integration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No patterns detected */}
      {(!detectedPatterns.patterns || detectedPatterns.patterns.length === 0) && (!detectedPatterns.quincunxes || detectedPatterns.quincunxes.length === 0) && (
        <div className="bg-slate-800/30 border border-slate-600 rounded-xl p-6 text-center mt-8">
          <p className="text-slate-400">
            No major aspect configurations (Grand Trines, T-Squares, Yods, Quincunxes) detected in this chart.
            This doesn't mean a lack of complexity—individual aspects still tell a rich story.
          </p>
        </div>
      )}
    </div>
  );
}

function AspectTypeCard({ type, count, symbol, color }) {
  const colorClasses = {
    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    red: 'text-red-400 bg-red-900/20 border-red-500/30',
    blue: 'text-blue-400 bg-blue-900/20 border-blue-500/30',
    orange: 'text-orange-400 bg-orange-900/20 border-orange-500/30'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <div className="text-3xl mb-2">{symbol}</div>
      <div className="text-lg font-medium">{count}</div>
      <div className="text-sm opacity-70">{type}s</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5: PLANETARY PSYCHOLOGY
// ═══════════════════════════════════════════════════════════════════════════

function PlanetaryPsychologyTab({ westernData, psychProfile, expandedCards, toggleCard }) {
  const planetaryPsych = psychProfile?.planetaryPsychology || {};
  const planets = westernData?.planets || {};

  const PLANET_CONFIG = [
    { key: 'mercury', name: 'Mercury', symbol: '☿', domain: 'Mind & Communication' },
    { key: 'venus', name: 'Venus', symbol: '♀', domain: 'Love & Values' },
    { key: 'mars', name: 'Mars', symbol: '♂', domain: 'Will & Action' },
    { key: 'jupiter', name: 'Jupiter', symbol: '♃', domain: 'Growth & Faith' },
    { key: 'saturn', name: 'Saturn', symbol: '♄', domain: 'Structure & Limitation' },
    { key: 'uranus', name: 'Uranus', symbol: '♅', domain: 'Liberation & Genius' },
    { key: 'neptune', name: 'Neptune', symbol: '♆', domain: 'Transcendence & Illusion' },
    { key: 'pluto', name: 'Pluto', symbol: '♇', domain: 'Transformation & Power' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Planetary Psychology</h2>
        <p className="text-slate-400">Each planet represents a psychological function</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANET_CONFIG.map(planet => {
          const position = planets[planet.key] || {};
          const psych = planetaryPsych[planet.key] || {};

          return (
            <div
              key={planet.key}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{planet.symbol}</span>
                <div>
                  <h4 className="text-white font-medium">{planet.name}</h4>
                  <p className="text-slate-400 text-sm">{planet.domain}</p>
                </div>
                {position.sign && (
                  <span className="ml-auto text-purple-400 text-sm">
                    in {position.sign}
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-sm">
                {psych.function || `Your ${planet.name} expression`}
              </p>

              {position.retrograde && (
                <div className="mt-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3">
                  <span className="text-indigo-400 text-xs uppercase">Retrograde</span>
                  <p className="text-slate-400 text-sm mt-1">
                    {psych.retrogradeNote || 'Inner expression emphasized'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 6: SHADOW WORK
// ═══════════════════════════════════════════════════════════════════════════

function ShadowWorkTab({ westernData, psychProfile }) {
  // Analyze mythic psychology
  const mythicAnalysis = useMemo(() => {
    return analyzeMythicPsychology(westernData);
  }, [westernData]);

  if (!psychProfile) return <LoadingState />;

  const { characterAndShadow, coreIdentity, emotionalNature } = psychProfile;

  // Aggregate shadow material
  const shadowMaterial = [
    { source: 'Sun', content: coreIdentity?.shadowTendency },
    { source: 'Moon', content: emotionalNature?.emotionalShadow },
    ...(characterAndShadow?.shadowThemes || []).map(theme => ({
      source: 'Chart Pattern',
      content: theme
    }))
  ].filter(s => s.content);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Shadow & Integration</h2>
        <p className="text-slate-400">The hidden parts seeking the light of awareness</p>
      </div>

      {/* Shadow Material */}
      <div className="space-y-4">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider">Shadow Material</h3>
        {shadowMaterial.map((shadow, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-purple-900/20 to-slate-800/20 border border-purple-500/20 rounded-xl p-6"
          >
            <span className="text-purple-400 text-xs uppercase">{shadow.source}</span>
            <p className="text-slate-300 mt-2">{shadow.content}</p>
          </div>
        ))}
      </div>

      {/* Mythic Archetypes */}
      {mythicAnalysis.archetypes && mythicAnalysis.archetypes.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            Mythic Archetypes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mythicAnalysis.archetypes.slice(0, 4).map((archetype, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-amber-900/20 to-slate-800/30 border border-amber-500/30 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{archetype.symbol || '✧'}</span>
                  <div>
                    <h4 className="text-amber-300 font-medium">{archetype.archetype}</h4>
                    <p className="text-slate-500 text-xs">{archetype.planet} • {archetype.myth}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-3">{archetype.core}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/50 rounded p-2">
                    <span className="text-green-400 block">Gift</span>
                    <span className="text-slate-400">{archetype.gift}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded p-2">
                    <span className="text-red-400 block">Wound</span>
                    <span className="text-slate-400">{archetype.wound}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Defense Mechanisms */}
      {mythicAnalysis.defenses && mythicAnalysis.defenses.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-cyan-400">🛡</span>
            Psychological Defense Mechanisms
          </h3>
          <div className="space-y-3">
            {mythicAnalysis.defenses.slice(0, 3).map((defense, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-cyan-300 font-medium">{defense.sign}</h4>
                  <span className="text-slate-500 text-xs">{defense.context || defense.placement}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Primary Defense</span>
                    <p className="text-slate-300 text-sm">{defense.primary}</p>
                    <p className="text-slate-500 text-xs mt-1">{defense.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs uppercase">Secondary Defense</span>
                    <p className="text-slate-300 text-sm">{defense.secondary}</p>
                  </div>
                  {defense.triggers && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                      <span className="text-red-400 text-xs uppercase">What Triggers This</span>
                      <p className="text-slate-400 text-sm mt-1">{defense.triggers}</p>
                    </div>
                  )}
                  {defense.protects && (
                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                      <span className="text-amber-400 text-xs uppercase">What It Protects</span>
                      <p className="text-slate-400 text-sm mt-1">{defense.protects}</p>
                    </div>
                  )}
                  {defense.integration && (
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3">
                      <span className="text-purple-400 text-xs uppercase">Integration Path</span>
                      <p className="text-slate-400 text-sm mt-1">{defense.integration}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shadow Archetypes */}
      {mythicAnalysis.shadows && mythicAnalysis.shadows.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-purple-400">☾</span>
            Shadow Archetypes
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {mythicAnalysis.shadows.slice(0, 3).map((shadow, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-purple-900/30 to-slate-800/30 border border-purple-500/30 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-purple-300 font-medium">{shadow.shadow}</h4>
                  <span className="text-slate-500 text-xs">{shadow.planet}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{shadow.description}</p>

                <div className="space-y-3">
                  {shadow.triggers && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                      <span className="text-red-400 text-xs uppercase">What Triggers This Shadow</span>
                      <p className="text-slate-400 text-sm mt-1">{shadow.triggers}</p>
                    </div>
                  )}
                  {shadow.protects && (
                    <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                      <span className="text-amber-400 text-xs uppercase">What It Protects</span>
                      <p className="text-slate-400 text-sm mt-1">{shadow.protects}</p>
                    </div>
                  )}
                  {shadow.mythicResonance && (
                    <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-lg p-3">
                      <span className="text-indigo-400 text-xs uppercase">Mythic Resonance</span>
                      <p className="text-slate-400 text-sm mt-1 italic">{shadow.mythicResonance}</p>
                    </div>
                  )}
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                    <span className="text-green-400 text-xs uppercase">Integration Path</span>
                    <p className="text-slate-400 text-sm mt-1">{shadow.integration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Pathways */}
      {coreIdentity?.growthPath && (
        <div className="bg-slate-800/30 rounded-xl p-6 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4">
            Integration Pathway
          </h3>
          <p className="text-slate-300">{coreIdentity.growthPath}</p>
        </div>
      )}

      {/* Mythic Summary */}
      {mythicAnalysis.summary && (
        <div className="bg-gradient-to-r from-amber-900/20 to-purple-900/20 border border-amber-500/30 rounded-xl p-6 mt-8">
          <h3 className="text-amber-300 text-sm uppercase tracking-wider mb-3">
            Mythic Summary
          </h3>
          <p className="text-slate-300">{mythicAnalysis.summary}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 7: GREENE VS JUNG
// ═══════════════════════════════════════════════════════════════════════════

function GreeneJungTab({ westernData, psychProfile, birthDate }) {
  // Analyze Hero's Journey
  const journeyAnalysis = useMemo(() => {
    return analyzeHerosJourney(westernData, birthDate);
  }, [westernData, birthDate]);

  const PLANET_COMPLEX_MAP = [
    { planet: 'Sun', symbol: '☉', jungian: 'Ego', description: 'The conscious center of identity' },
    { planet: 'Moon', symbol: '☽', jungian: 'Anima/Animus', description: 'The inner feminine/masculine' },
    { planet: 'Mercury', symbol: '☿', jungian: 'Trickster/Puer', description: 'The eternal youth, messenger' },
    { planet: 'Venus', symbol: '♀', jungian: 'Anima (receptive)', description: 'Love, beauty, relating' },
    { planet: 'Mars', symbol: '♂', jungian: 'Animus (assertive)', description: 'Will, action, desire' },
    { planet: 'Saturn', symbol: '♄', jungian: 'Senex', description: 'The wise old man, authority' },
    { planet: 'Pluto', symbol: '♇', jungian: 'Shadow', description: 'The hidden, transformative' }
  ];

  const { archetypalFingerprint, individuationRoadmap, currentStages } = journeyAnalysis;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Greene × Jung</h2>
        <p className="text-slate-400">Planetary psychology meets depth psychology</p>
      </div>

      {/* Planet-Complex Mapping */}
      <div className="bg-slate-800/30 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-slate-400 text-sm uppercase">Planet</th>
              <th className="px-6 py-4 text-left text-slate-400 text-sm uppercase">Jungian Complex</th>
              <th className="px-6 py-4 text-left text-slate-400 text-sm uppercase hidden md:table-cell">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {PLANET_COMPLEX_MAP.map(row => (
              <tr key={row.planet} className="border-b border-slate-700/50">
                <td className="px-6 py-4">
                  <span className="text-xl mr-2">{row.symbol}</span>
                  <span className="text-white">{row.planet}</span>
                </td>
                <td className="px-6 py-4 text-purple-400">{row.jungian}</td>
                <td className="px-6 py-4 text-slate-400 text-sm hidden md:table-cell">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Archetypal Fingerprint */}
      {archetypalFingerprint && (archetypalFingerprint.primary || archetypalFingerprint.secondary) && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">🏛</span>
            Archetypal Fingerprint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Archetype */}
            {archetypalFingerprint.primary && (
              <div className="bg-gradient-to-br from-amber-900/30 to-slate-800/30 border border-amber-500/40 rounded-xl p-5">
                <span className="text-amber-400 text-xs uppercase">Primary Archetype</span>
                <h4 className="text-amber-300 text-xl font-medium mt-1 capitalize">
                  The {archetypalFingerprint.primary.name}
                </h4>
                <p className="text-slate-400 text-sm mt-2">{archetypalFingerprint.primary.description}</p>
                <div className="mt-3 text-xs">
                  <span className="text-green-400">Healthy:</span>
                  <span className="text-slate-400 ml-1">{archetypalFingerprint.primary.healthy}</span>
                </div>
              </div>
            )}

            {/* Secondary Archetype */}
            {archetypalFingerprint.secondary && (
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-5">
                <span className="text-slate-500 text-xs uppercase">Secondary Archetype</span>
                <h4 className="text-slate-300 text-xl font-medium mt-1 capitalize">
                  The {archetypalFingerprint.secondary.name}
                </h4>
                <p className="text-slate-400 text-sm mt-2">{archetypalFingerprint.secondary.description}</p>
              </div>
            )}

            {/* Shadow Archetype */}
            {archetypalFingerprint.shadow && (
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 border border-purple-500/40 rounded-xl p-5">
                <span className="text-purple-400 text-xs uppercase">Shadow Archetype</span>
                <h4 className="text-purple-300 text-xl font-medium mt-1 capitalize">
                  The {archetypalFingerprint.shadow.name}
                </h4>
                <p className="text-slate-400 text-sm mt-2">{archetypalFingerprint.shadow.shadow}</p>
                <div className="mt-3 text-xs">
                  <span className="text-purple-400">Integration:</span>
                  <span className="text-slate-400 ml-1">{archetypalFingerprint.shadow.integration}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Life Phase */}
      {individuationRoadmap?.currentPhase && (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/40 rounded-xl p-6 mt-8">
          <h3 className="text-indigo-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>⏳</span>
            Current Individuation Phase (Age {journeyAnalysis.age})
          </h3>
          <h4 className="text-white text-xl font-light mb-2">{individuationRoadmap.currentPhase.name}</h4>
          <p className="text-slate-300 mb-3">{individuationRoadmap.currentPhase.description}</p>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <span className="text-purple-400 text-xs uppercase">Current Task</span>
            <p className="text-slate-400 text-sm mt-1">{individuationRoadmap.currentPhase.task}</p>
          </div>
        </div>
      )}

      {/* Active Journey Stages */}
      {currentStages && currentStages.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-cyan-400">🧭</span>
            Active Hero's Journey Stages
          </h3>
          {currentStages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-cyan-300 font-medium">{stage.stage || stage.phase}</h4>
                <span className="text-slate-500 text-xs">
                  {stage.type === 'saturn_cycle' && 'Saturn Cycle'}
                  {stage.type === 'outer_planet' && `${stage.planet} ${stage.aspect}`}
                  {stage.type === 'journey_stage' && `House ${stage.house}`}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-3">{stage.description}</p>
              {stage.challenge && (
                <div className="bg-slate-900/50 rounded-lg p-3 mb-2">
                  <span className="text-amber-400 text-xs uppercase">Challenge</span>
                  <p className="text-slate-400 text-sm mt-1">{stage.challenge}</p>
                </div>
              )}
              {stage.integration && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-green-400 text-xs uppercase">Integration</span>
                  <p className="text-slate-400 text-sm mt-1">{stage.integration}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Initiations */}
      {individuationRoadmap?.upcomingInitiations && individuationRoadmap.upcomingInitiations.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-orange-400">🌅</span>
            Upcoming Initiations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {individuationRoadmap.upcomingInitiations.slice(0, 4).map((init, idx) => (
              <div
                key={idx}
                className="bg-slate-800/30 border border-slate-600 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-300 font-medium">
                    {init.planet || 'Saturn'} {init.aspect || init.phase}
                  </span>
                  <span className="text-slate-500 text-xs">~{init.yearsAway} years</span>
                </div>
                <p className="text-slate-400 text-sm">{init.theme}: {init.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Tasks */}
      {individuationRoadmap?.integrationTasks && individuationRoadmap.integrationTasks.length > 0 && (
        <div className="bg-slate-800/30 rounded-xl p-6 mt-8">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Integration Tasks
          </h3>
          <div className="space-y-3">
            {individuationRoadmap.integrationTasks.map((task, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'urgent' ? 'bg-red-900/50 text-red-300' :
                  task.priority === 'high' ? 'bg-orange-900/50 text-orange-300' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {task.priority}
                </span>
                <div>
                  <p className="text-slate-300 text-sm">{task.task}</p>
                  <p className="text-slate-500 text-xs mt-1">{task.method}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journey Summary */}
      {journeyAnalysis.summary && (
        <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-xl p-6 mt-8">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3">
            Your Individuation Journey
          </h3>
          <p className="text-slate-300">{journeyAnalysis.summary}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-pulse text-4xl mb-4">✧</div>
        <p className="text-slate-400">Generating psychological profile...</p>
      </div>
    </div>
  );
}

function ExpandableCard({ id, title, subtitle, isExpanded, onToggle, color, children }) {
  const colorClasses = {
    yellow: 'border-yellow-500/30 hover:border-yellow-500/50',
    purple: 'border-purple-500/30 hover:border-purple-500/50',
    blue: 'border-blue-500/30 hover:border-blue-500/50'
  };

  return (
    <div className={`bg-slate-800/50 border ${colorClasses[color]} rounded-xl overflow-hidden transition-all`}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div>
          <h3 className="text-white text-lg font-medium">{title}</h3>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <span className="text-slate-400 text-xl">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-700/50 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function Section({ label, content, highlight, italic }) {
  if (!content) return null;

  return (
    <div>
      <span className={`text-xs uppercase tracking-wider ${highlight ? 'text-purple-400' : 'text-slate-500'}`}>
        {label}
      </span>
      <p className={`text-slate-300 mt-1 ${italic ? 'italic' : ''}`}>
        {content}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 8: PILGRIM JOURNEY (Greene Individuation → Chamber Mapping)
// ═══════════════════════════════════════════════════════════════════════════

function PilgrimJourneyTab({ profile, westernData }) {
  // Calculate age from birthDate
  const age = useMemo(() => {
    if (!profile?.birthDate) return 35;
    const birth = new Date(profile.birthDate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [profile?.birthDate]);

  // Get full journey context
  const journeyContext = useMemo(() => {
    return getFullJourneyContext({ age, birthDate: profile?.birthDate });
  }, [age, profile?.birthDate]);

  const [selectedStageId, setSelectedStageId] = useState(null);

  // Use current stage or selected stage
  const displayStageId = selectedStageId || journeyContext?.current?.stageId || 'egoFormation';

  if (!journeyContext) return <LoadingState />;

  const { current, navigation, progress, allStages } = journeyContext;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-white mb-2">Pilgrim Journey</h2>
        <p className="text-slate-400">Greene's Individuation Stages → Cathedral Chambers</p>
        <p className="text-purple-400 mt-2">
          Age {age} • Current Stage: <span className="font-semibold">{current?.script?.label}</span>
        </p>
      </div>

      {/* Journey Progress */}
      <div className="bg-slate-800/30 rounded-xl p-6">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4">
          Individuation Progress
        </h3>
        <PilgrimJourneyProgress currentStageId={current?.stageId} />
        <div className="mt-4 text-center">
          <span className="text-slate-500 text-sm">
            {progress?.percentage?.toFixed(0)}% of the journey • Stage {progress?.currentIndex + 1} of {progress?.totalStages}
          </span>
        </div>
      </div>

      {/* Stage Navigator */}
      <div className="space-y-4">
        <h3 className="text-slate-300 text-sm uppercase tracking-wider">
          All Chambers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allStages?.map(stage => (
            <PilgrimStageCard
              key={stage.stageId}
              stageId={stage.stageId}
              isActive={stage.stageId === displayStageId}
              onClick={() => setSelectedStageId(stage.stageId)}
            />
          ))}
        </div>
      </div>

      {/* Current/Selected Stage Script */}
      <div className="bg-slate-800/20 rounded-2xl border border-purple-500/20 p-6">
        <PilgrimJourneyStage stageId={displayStageId} />
      </div>

      {/* Greene's Insight */}
      {current?.stage?.greeneInsight && (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>✧</span>
            Greene's Insight
          </h3>
          <p className="text-slate-300 italic leading-relaxed">
            "{current.stage.greeneInsight}"
          </p>
        </div>
      )}

      {/* Jungian Parallel */}
      {current?.stage?.jungianParallel && (
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3">
            Jungian Parallel
          </h3>
          <p className="text-slate-400">
            {current.stage.jungianParallel}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        {navigation?.previousStage ? (
          <button
            onClick={() => setSelectedStageId(navigation.previousStage.stageId)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            ← {navigation.previousStage.script?.label}
          </button>
        ) : (
          <div />
        )}

        {selectedStageId && selectedStageId !== current?.stageId && (
          <button
            onClick={() => setSelectedStageId(null)}
            className="px-4 py-2 bg-purple-600/30 border border-purple-500/40 rounded-lg text-purple-300 hover:bg-purple-600/50 transition-colors"
          >
            Return to Current Stage
          </button>
        )}

        {navigation?.nextStage ? (
          <button
            onClick={() => setSelectedStageId(navigation.nextStage.stageId)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            {navigation.nextStage.script?.label} →
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Architectural Mapping */}
      {current?.mapping?.mapping && (
        <div className="bg-slate-800/30 rounded-xl p-6 mt-4">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-4">
            Chamber Architecture Mapping
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(current.mapping.mapping).map(key => (
              <div
                key={key}
                className="bg-slate-900/40 border border-purple-500/20 rounded-lg p-3 text-center"
              >
                <p className="text-purple-300 text-sm font-medium">{key}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 10: FATE THREADS (Nodal Axis & Destiny)
// ═══════════════════════════════════════════════════════════════════════════

function FateThreadsTab({ westernData, cathedralProfile }) {
  const fateThreads = cathedralProfile?.fateThreads;

  // Get nodal data from western data as fallback
  const nodesData = useMemo(() => {
    if (fateThreads?.nodalAxis) return fateThreads.nodalAxis;

    // Fallback to extracting from westernData
    const planets = westernData?.planets || {};
    return {
      northNode: {
        sign: planets.northNode?.sign || planets.NorthNode?.sign,
        house: planets.northNode?.house || planets.NorthNode?.house
      },
      southNode: {
        sign: planets.southNode?.sign || planets.SouthNode?.sign,
        house: planets.southNode?.house || planets.SouthNode?.house
      }
    };
  }, [fateThreads, westernData]);

  // Node sign interpretations
  const NODE_INTERPRETATIONS = {
    Aries: {
      north: 'Develop courage, independence, and self-assertion',
      south: 'Release over-dependence on others and people-pleasing'
    },
    Taurus: {
      north: 'Build material security and sensual groundedness',
      south: 'Release attachment to crisis and transformation addiction'
    },
    Gemini: {
      north: 'Embrace curiosity, learning, and multiple perspectives',
      south: 'Release rigid beliefs and the need to be right'
    },
    Cancer: {
      north: 'Develop emotional depth and nurturing capacities',
      south: 'Release excessive ambition and emotional coldness'
    },
    Leo: {
      north: 'Express creative individuality and heart-centered leadership',
      south: 'Release over-reliance on group identity and detachment'
    },
    Virgo: {
      north: 'Cultivate discernment, service, and practical skills',
      south: 'Release escapism, martyrdom, and boundary confusion'
    },
    Libra: {
      north: 'Develop partnership skills and diplomatic grace',
      south: 'Release excessive self-focus and competitive aggression'
    },
    Scorpio: {
      north: 'Embrace depth, intimacy, and transformative experiences',
      south: 'Release material attachment and comfort addiction'
    },
    Sagittarius: {
      north: 'Seek meaning, truth, and expanded horizons',
      south: 'Release scattered thinking and superficial knowledge'
    },
    Capricorn: {
      north: 'Build structure, authority, and worldly mastery',
      south: 'Release emotional dependency and family enmeshment'
    },
    Aquarius: {
      north: 'Serve humanity and embrace progressive vision',
      south: 'Release ego-attachment and need for special recognition'
    },
    Pisces: {
      north: 'Develop spiritual surrender and compassionate wisdom',
      south: 'Release perfectionism and critical over-analysis'
    }
  };

  const northNodeInterp = NODE_INTERPRETATIONS[nodesData?.northNode?.sign] || {};
  const southNodeInterp = NODE_INTERPRETATIONS[nodesData?.southNode?.sign] || {};

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Fate Threads</h2>
        <p className="text-slate-400">The Nodal Axis - Your Soul's Evolutionary Direction</p>
      </div>

      {/* Nodal Axis Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* North Node */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 border border-emerald-500/40 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">☊</span>
            <div>
              <h3 className="text-emerald-300 text-lg font-medium">North Node</h3>
              <p className="text-slate-400 text-sm">Soul's Destination</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400 text-xl">{nodesData?.northNode?.sign || '—'}</span>
                {nodesData?.northNode?.house && (
                  <span className="text-slate-500 text-sm">House {nodesData.northNode.house}</span>
                )}
              </div>
              <p className="text-slate-300 text-sm">
                {northNodeInterp.north || 'Your evolutionary direction'}
              </p>
            </div>

            {fateThreads?.nodalAxis?.evolutionaryDirection && (
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-4">
                <span className="text-emerald-400 text-xs uppercase">Evolutionary Pull</span>
                <p className="text-slate-300 text-sm mt-1">
                  {fateThreads.nodalAxis.evolutionaryDirection}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* South Node */}
        <div className="bg-gradient-to-br from-amber-900/30 to-slate-800/30 border border-amber-500/40 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">☋</span>
            <div>
              <h3 className="text-amber-300 text-lg font-medium">South Node</h3>
              <p className="text-slate-400 text-sm">Soul's Origin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-400 text-xl">{nodesData?.southNode?.sign || '—'}</span>
                {nodesData?.southNode?.house && (
                  <span className="text-slate-500 text-sm">House {nodesData.southNode.house}</span>
                )}
              </div>
              <p className="text-slate-300 text-sm">
                {southNodeInterp.south || northNodeInterp.south || 'Patterns to release'}
              </p>
            </div>

            {fateThreads?.pastLifeThemes && fateThreads.pastLifeThemes.length > 0 && (
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-4">
                <span className="text-amber-400 text-xs uppercase">Past Life Themes</span>
                <ul className="mt-2 space-y-1">
                  {fateThreads.pastLifeThemes.slice(0, 3).map((theme, i) => (
                    <li key={i} className="text-slate-400 text-sm">• {theme}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Axis Theme */}
      {fateThreads?.nodalAxis?.axisTheme && (
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3">
            Nodal Axis Theme
          </h3>
          <p className="text-slate-300 text-lg">
            {fateThreads.nodalAxis.axisTheme}
          </p>
        </div>
      )}

      {/* Destiny Indicators */}
      {fateThreads?.destinyIndicators && (
        <div className="space-y-4">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-indigo-400">✧</span>
            Destiny Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fateThreads.destinyIndicators.lifeDestiny && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <span className="text-indigo-400 text-xs uppercase">Life Destiny</span>
                <p className="text-slate-300 mt-2">{fateThreads.destinyIndicators.lifeDestiny}</p>
              </div>
            )}
            {fateThreads.destinyIndicators.soulPurpose && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <span className="text-purple-400 text-xs uppercase">Soul Purpose</span>
                <p className="text-slate-300 mt-2">{fateThreads.destinyIndicators.soulPurpose}</p>
              </div>
            )}
            {fateThreads.destinyIndicators.dharmaPath && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <span className="text-emerald-400 text-xs uppercase">Dharma Path</span>
                <p className="text-slate-300 mt-2">{fateThreads.destinyIndicators.dharmaPath}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Karmic Patterns */}
      {fateThreads?.karmicPatterns && fateThreads.karmicPatterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">⟳</span>
            Karmic Patterns
          </h3>
          {fateThreads.karmicPatterns.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-slate-800/30 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-amber-300 font-medium">{pattern.source}</h4>
              </div>
              <p className="text-slate-400 text-sm mb-3">{pattern.manifestation}</p>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <span className="text-green-400 text-xs uppercase">Resolution Path</span>
                <p className="text-slate-400 text-sm mt-1">{pattern.resolution}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fate vs Free Will */}
      {fateThreads?.fateVsFreeWill && (
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-slate-300 text-sm uppercase tracking-wider mb-3">
            Fate & Free Will
          </h3>
          <p className="text-slate-400 italic">
            "{fateThreads.fateVsFreeWill}"
          </p>
        </div>
      )}

      {/* Future Evolution */}
      {fateThreads?.futureEvolution && (
        <div className="bg-gradient-to-r from-cyan-900/20 to-indigo-900/20 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-cyan-300 text-sm uppercase tracking-wider mb-4">
            Future Evolution
          </h3>
          <div className="space-y-3">
            {fateThreads.futureEvolution.nextNodalReturn && (
              <div className="flex items-start gap-3">
                <span className="text-cyan-400">○</span>
                <div>
                  <span className="text-slate-500 text-xs">Next Nodal Return</span>
                  <p className="text-slate-300 text-sm">{fateThreads.futureEvolution.nextNodalReturn}</p>
                </div>
              </div>
            )}
            {fateThreads.futureEvolution.evolutionaryPull && (
              <div className="flex items-start gap-3">
                <span className="text-cyan-400">○</span>
                <div>
                  <span className="text-slate-500 text-xs">Evolutionary Pull</span>
                  <p className="text-slate-300 text-sm">{fateThreads.futureEvolution.evolutionaryPull}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Greene Insight */}
      <div className="bg-gradient-to-r from-purple-900/20 to-slate-800/20 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-purple-300 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>✧</span>
          Greene's Insight on the Nodes
        </h3>
        <p className="text-slate-300 italic">
          "The Nodes are not about what happened in past lives, but about the psychological
          inheritance we carry—the unlived life of our ancestors, the family myths, and the
          collective patterns that shape our individual destiny."
        </p>
      </div>
    </div>
  );
}

export default LizGreeneCathedralPage;
