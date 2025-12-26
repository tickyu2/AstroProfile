/**
 * ============================================================================
 * CATHEDRAL ANALYSIS MODAL
 * ============================================================================
 * The Grand Hall of the Soul Garden Cathedral.
 *
 * This is the flagship feature - a complete soul-language reading that
 * displays all 9 narration systems in one breathtaking, sacred chamber.
 *
 * Features:
 *   - Summary & Core Identity
 *   - The Big Three (Sun, Moon, Rising)
 *   - Sign Narrations (per-planet)
 *   - House Narrations (12 houses)
 *   - Retrograde Messages (inward journeys)
 *   - Direct Planet Gifts (flowing energies)
 *   - Aspect Dialogues (inner conversations)
 *   - Epoch Narrations (life chapters)
 *   - Soul Recognition Moments ("aha" insights)
 *   - Take-Home Toolkit (practices & rituals)
 *   - Letter From the Chart (full soul letter)
 *
 * Design: Art Nouveau + Michelangelo
 *   - Flowing vine borders
 *   - Marble-like textures
 *   - Golden rim lighting
 *   - Cathedral dome feeling
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCathedralAnalysis, buildSoulChartFromSlice } from '../../services/soulLetterService';
import { generateEpochs } from '../../soulGarden';
import {
  buildComprehensiveProfile,
  getProfileForAI,
  getComprehensiveProfile,
  saveComprehensiveProfile
} from '../../services/comprehensiveProfileBuilder';

/**
 * Main Cathedral Analysis Modal Component
 *
 * UPDATED: Now uses pre-computed comprehensive profiles for AI interpretation.
 * The AI receives all data pre-computed and only provides soul-language narration.
 */
export default function CathedralAnalysisModal({
  slice,
  birthData,
  risingSign,
  isOpen = false,
  onClose,
  userId = null,
  profileId = null,
  // Optional: pass a pre-built comprehensive profile
  comprehensiveProfile = null
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('summary');
  const [profile, setProfile] = useState(comprehensiveProfile);

  // Build or load comprehensive profile
  const buildProfile = useCallback(async () => {
    if (profile) return profile;

    try {
      // Try to load from Firestore first
      if (userId && profileId) {
        const existing = await getComprehensiveProfile(userId, profileId);
        if (existing && existing.schemaVersion) {
          console.log('[CathedralAnalysis] Loaded existing comprehensive profile');
          setProfile(existing);
          return existing;
        }
      }

      // Build new comprehensive profile from birthData and slice
      if (birthData?.date) {
        const newProfile = await buildComprehensiveProfile({
          firstName: birthData.name || 'Soul',
          birthDate: birthData.date,
          birthTime: birthData.time || '12:00',
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone,
          gender: birthData.gender
        });

        setProfile(newProfile);

        // Save to Firestore if we have user context
        if (userId && profileId) {
          await saveComprehensiveProfile(userId, profileId, newProfile);
        }

        return newProfile;
      }

      return null;
    } catch (err) {
      console.warn('[CathedralAnalysis] Could not build comprehensive profile:', err);
      return null;
    }
  }, [birthData, userId, profileId, profile]);

  // Generate the cathedral analysis
  const generateAnalysis = useCallback(async () => {
    if (!slice && !profile) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get or build comprehensive profile
      const comprehensiveData = await buildProfile();

      // Step 2: Build chart object for epochs (fallback if no comprehensive profile)
      const chartForEpochs = {
        planets: slice?.planets || comprehensiveData?.western?.sovereign?.planets || [],
        houses: slice?.houses || comprehensiveData?.western?.sovereign?.houses || [],
        aspects: slice?.aspects || comprehensiveData?.western?.sovereign?.aspects || [],
        rising: slice?.ascendant || { sign: risingSign || comprehensiveData?.western?.bigThree?.rising }
      };

      // Step 3: Generate epochs
      const epochs = comprehensiveData?.epochs || generateEpochs(chartForEpochs);

      // Step 4: Build the chart data for AI
      // If we have comprehensive profile, use the optimized version
      let chartDataForAI;
      if (comprehensiveData) {
        chartDataForAI = getProfileForAI(comprehensiveData);
        chartDataForAI.epochs = epochs;
        console.log('[CathedralAnalysis] Using comprehensive profile for AI');
      } else {
        // Fallback to building from slice
        chartDataForAI = buildSoulChartFromSlice(slice, birthData, epochs);
        console.log('[CathedralAnalysis] Using slice data for AI');
      }

      // Step 5: Generate the cathedral analysis via AI
      const result = await generateCathedralAnalysis(chartDataForAI);

      if (result.success) {
        // Parse the JSON response
        const parsed = typeof result.letter === 'string'
          ? JSON.parse(result.letter)
          : result.letter;
        setAnalysis(parsed);
      } else {
        throw new Error(result.error || 'Failed to generate analysis');
      }
    } catch (err) {
      console.error('[CathedralAnalysis] Error:', err);
      setError('The Cathedral is momentarily quiet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [slice, birthData, risingSign, profile, buildProfile]);

  // Generate when modal opens
  useEffect(() => {
    if (isOpen && !analysis && !loading) {
      generateAnalysis();
    }
  }, [isOpen, analysis, loading, generateAnalysis]);

  if (!isOpen) return null;

  // Section navigation items (includes BaZi, Numerology, Synthesis)
  const sections = [
    { id: 'summary', label: 'Summary', icon: '\u2728' },
    { id: 'bigThree', label: 'Big Three', icon: '\u2609' },
    { id: 'signs', label: 'Signs', icon: '\u2648' },
    { id: 'houses', label: 'Houses', icon: '\u2302' },
    { id: 'retrogrades', label: 'Retrogrades', icon: '\u21BA' },
    { id: 'aspects', label: 'Aspects', icon: '\u26B9' },
    { id: 'bazi', label: 'BaZi', icon: '\u262F' },
    { id: 'numerology', label: 'Numerology', icon: '\u0023' },
    { id: 'synthesis', label: 'Synthesis', icon: '\u2726' },
    { id: 'epochs', label: 'Life Chapters', icon: '\u231B' },
    { id: 'recognition', label: 'Aha Moments', icon: '\u2764' },
    { id: 'toolkit', label: 'Toolkit', icon: '\u2692' },
    { id: 'letter', label: 'Letter', icon: '\u2709' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl border border-amber-400/20 shadow-2xl shadow-amber-500/10"
          onClick={e => e.stopPropagation()}
        >
          {/* Cathedral Dome Header */}
          <CathedralHeader
            risingSign={risingSign}
            title={analysis?.summary?.title}
            onClose={onClose}
            onRegenerate={generateAnalysis}
            loading={loading}
          />

          {/* Section Navigation */}
          <SectionNav
            sections={sections}
            activeSection={activeSection}
            onSelect={setActiveSection}
            disabled={loading || !analysis}
          />

          {/* Main Content Area */}
          <div className="overflow-y-auto max-h-[calc(95vh-180px)] p-6 soul-scroll">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={generateAnalysis} />
            ) : analysis ? (
              <AnalysisContent
                analysis={analysis}
                activeSection={activeSection}
                risingSign={risingSign}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Cathedral Footer */}
          <CathedralFooter />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// HEADER COMPONENT
// =============================================================================

function CathedralHeader({ risingSign, title, onClose, onRegenerate, loading }) {
  return (
    <div className="relative px-6 py-5 border-b border-amber-400/20 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-indigo-950/90">
      {/* Decorative dome arc */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-b from-amber-400/10 to-transparent rounded-b-full blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Rising sign emblem */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/20 border border-amber-400/40 flex items-center justify-center">
            <span className="text-2xl">{getZodiacSymbol(risingSign)}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-amber-300 tracking-wide">
              {title || 'Cathedral Reading'}
            </h1>
            <p className="text-white/50 text-sm">
              {risingSign} Rising \u2022 Complete Soul Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Regenerate button */}
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span className={loading ? 'animate-spin' : ''}>\u21BB</span>
            <span className="hidden sm:inline">{loading ? 'Generating...' : 'New Reading'}</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all"
          >
            \u2715
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION NAVIGATION
// =============================================================================

function SectionNav({ sections, activeSection, onSelect, disabled }) {
  return (
    <div className="px-6 py-3 border-b border-white/10 bg-indigo-950/50 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => !disabled && onSelect(section.id)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSection === section.id
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// ANALYSIS CONTENT
// =============================================================================

function AnalysisContent({ analysis, activeSection, risingSign }) {
  return (
    <motion.div
      key={activeSection}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeSection === 'summary' && <SummarySection data={analysis.summary} />}
      {activeSection === 'bigThree' && <BigThreeSection data={analysis.theBigThree} />}
      {activeSection === 'signs' && <SignNarrationsSection data={analysis.signNarrations} />}
      {activeSection === 'houses' && <HouseNarrationsSection data={analysis.houseNarrations} />}
      {activeSection === 'retrogrades' && <RetrogradeSection data={analysis.retrogradeMessages} />}
      {activeSection === 'aspects' && <AspectSection data={analysis.aspectDialogues} />}
      {activeSection === 'bazi' && <BaZiSection data={analysis.baziInsights} yinYang={analysis.yinYangNarration} />}
      {activeSection === 'numerology' && <NumerologySection data={analysis.numerologyInsights} />}
      {activeSection === 'synthesis' && <SynthesisSection data={analysis.crossCulturalSynthesis} />}
      {activeSection === 'epochs' && <EpochSection data={analysis.epochNarrations} />}
      {activeSection === 'recognition' && <RecognitionSection data={analysis.soulRecognitions} />}
      {activeSection === 'toolkit' && <ToolkitSection data={analysis.takeHomeToolkit} />}
      {activeSection === 'letter' && <LetterSection letter={analysis.letterFromChart} />}
    </motion.div>
  );
}

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

function SummarySection({ data }) {
  if (!data) return <EmptySection message="Summary not available" />;

  return (
    <div className="space-y-6">
      {/* Poetic Title */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-amber-300 mb-2">{data.title}</h2>
        <div className="text-amber-400/50 text-sm tracking-[0.3em]">\u2726 \u2726 \u2726</div>
      </div>

      {/* Core Identity */}
      <SoulCard title="Core Identity" icon="\u2728">
        <p className="text-white/80 leading-relaxed">{data.coreIdentity}</p>
      </SoulCard>

      {/* Primary Gift */}
      <SoulCard title="Primary Gift" icon="\u2605">
        <p className="text-emerald-300">{data.primaryGift}</p>
      </SoulCard>

      {/* Growth Edge */}
      <SoulCard title="Growth Edge" icon="\u2191">
        <p className="text-purple-300">{data.growthEdge}</p>
      </SoulCard>

      {/* Life Theme */}
      <SoulCard title="Life Theme" icon="\u221E">
        <p className="text-amber-200 italic">{data.lifeTheme}</p>
      </SoulCard>
    </div>
  );
}

function BigThreeSection({ data }) {
  if (!data) return <EmptySection message="Big Three not available" />;

  const items = [
    { key: 'sun', title: 'Sun', icon: '\u2609', color: 'amber' },
    { key: 'moon', title: 'Moon', icon: '\u263D', color: 'blue' },
    { key: 'rising', title: 'Rising', icon: '\u2191', color: 'purple' }
  ];

  return (
    <div className="space-y-6">
      <SectionTitle>The Big Three</SectionTitle>

      {items.map(item => {
        const planetData = data[item.key];
        if (!planetData) return null;

        return (
          <div
            key={item.key}
            className={`p-5 rounded-2xl bg-gradient-to-r from-${item.color}-500/10 to-transparent border border-${item.color}-400/20`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-white/50 text-sm">{planetData.placement}</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">{planetData.meaning}</p>
            <div className="p-3 rounded-xl bg-white/5 border-l-4 border-amber-400/50">
              <p className="text-amber-300 text-sm italic">"\u2728 {planetData.ahaInsight}"</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SignNarrationsSection({ data }) {
  if (!data || data.length === 0) return <EmptySection message="Sign narrations not available" />;

  return (
    <div className="space-y-4">
      <SectionTitle>Sign Narrations</SectionTitle>

      {data.map((item, idx) => (
        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{getZodiacSymbol(item.sign)}</span>
            <div>
              <h4 className="text-amber-300 font-medium">{item.planet} in {item.sign}</h4>
              <p className="text-white/40 text-xs">House {item.house}</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-2">{item.narration}</p>
          <p className="text-emerald-300 text-xs">\u2605 Gift: {item.gift}</p>
        </div>
      ))}
    </div>
  );
}

function HouseNarrationsSection({ data }) {
  if (!data || data.length === 0) return <EmptySection message="House narrations not available" />;

  return (
    <div className="space-y-4">
      <SectionTitle>House Narrations</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-amber-300 font-medium">House {item.house}: {item.theme}</h4>
              <span className="text-white/40 text-xs">{item.sign}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-2">{item.narration}</p>
            {item.planets && item.planets.length > 0 && (
              <p className="text-purple-300 text-xs">Planets: {item.planets.join(', ')}</p>
            )}
            <p className="text-white/40 text-xs italic mt-2">"{item.lifeQuestion}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetrogradeSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">\u2728</span>
        <p className="text-white/60">No retrograde planets in this chart.</p>
        <p className="text-white/40 text-sm mt-2">All your planetary energies flow outward freely.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Retrograde Messages</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        These planets walk the inner path. They are not broken \u2014 they are remembering.
      </p>

      {data.map((item, idx) => (
        <div key={idx} className="p-5 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-400/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">\u21BA</span>
            <div>
              <h4 className="text-purple-300 font-medium">{item.planet} Retrograde</h4>
              <p className="text-white/40 text-xs">in {item.sign}</p>
            </div>
          </div>
          <p className="text-white/70 leading-relaxed mb-3">{item.message}</p>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-amber-300 text-sm">\u2692 Practice: {item.practice}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AspectSection({ data }) {
  if (!data || data.length === 0) return <EmptySection message="Aspect dialogues not available" />;

  return (
    <div className="space-y-4">
      <SectionTitle>Aspect Dialogues</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        Inner conversations between parts of yourself.
      </p>

      {data.map((item, idx) => (
        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-amber-300 font-medium mb-3">{item.aspect}</h4>
          <div className="p-3 rounded-lg bg-indigo-950/50 text-white/70 text-sm italic mb-3">
            "{item.dialogue}"
          </div>
          <p className="text-emerald-300 text-xs">\u2764 Teaching: {item.teaching}</p>
        </div>
      ))}
    </div>
  );
}

function EpochSection({ data }) {
  if (!data || data.length === 0) return <EmptySection message="Life chapters not available" />;

  return (
    <div className="space-y-4">
      <SectionTitle>Life Chapters</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        The mythic corridors of your cathedral.
      </p>

      {data.map((item, idx) => (
        <div key={idx} className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-400/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-amber-300 font-medium">{item.epoch}</h4>
            <span className="text-white/40 text-xs">Ages {item.ages}</span>
          </div>
          <p className="text-white/70 leading-relaxed mb-2">{item.narration}</p>
          <p className="text-purple-300 text-xs italic">Theme: {item.theme}</p>
        </div>
      ))}
    </div>
  );
}

function RecognitionSection({ data }) {
  if (!data || data.length === 0) return <EmptySection message="Soul recognitions not available" />;

  return (
    <div className="space-y-4">
      <SectionTitle>Soul Recognition Moments</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        The "aha" moments where you feel truly seen.
      </p>

      {data.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-400/20"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">\u2764</span>
            <div>
              <h4 className="text-rose-300 font-medium mb-1">{item.title}</h4>
              <p className="text-white/80 leading-relaxed">{item.insight}</p>
              <p className="text-white/40 text-xs mt-2">Related to: {item.placement}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// BAZI SECTION
// =============================================================================

function BaZiSection({ data, yinYang }) {
  if (!data) return <EmptySection message="BaZi insights not available" />;

  return (
    <div className="space-y-6">
      <SectionTitle>BaZi - Chinese Astrology</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        The Four Pillars reveal your elemental constitution and destiny patterns.
      </p>

      {/* Day Master */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">\u262F</span>
          <h3 className="text-lg font-semibold text-red-300">Day Master</h3>
        </div>
        <p className="text-white/80 leading-relaxed">{data.dayMasterNarration}</p>
      </div>

      {/* Element Balance */}
      <SoulCard title="Element Balance" icon="\u2697" color="amber">
        <p className="text-white/80 leading-relaxed">{data.elementBalance}</p>
      </SoulCard>

      {/* Ten Gods */}
      {data.tenGodsMessage && (
        <SoulCard title="Ten Gods" icon="\u2605" color="purple">
          <p className="text-white/80 leading-relaxed">{data.tenGodsMessage}</p>
        </SoulCard>
      )}

      {/* Yin/Yang Balance */}
      {yinYang && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">\u262F</span>
            <h3 className="text-lg font-semibold text-indigo-300">Yin/Yang Balance</h3>
          </div>
          <p className="text-white/80 leading-relaxed mb-3">{yinYang.balanceDescription}</p>
          {yinYang.guidance && (
            <p className="text-amber-300 text-sm italic">\u2728 {yinYang.guidance}</p>
          )}
        </div>
      )}

      {/* Cross-Cultural Bridge */}
      {data.crossCulturalBridge && (
        <div className="p-4 rounded-xl bg-white/5 border border-amber-400/30">
          <p className="text-amber-300 text-sm italic">
            \u2726 East Meets West: {data.crossCulturalBridge}
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// NUMEROLOGY SECTION
// =============================================================================

function NumerologySection({ data }) {
  if (!data) return <EmptySection message="Numerology insights not available" />;

  return (
    <div className="space-y-6">
      <SectionTitle>Numerology</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        The sacred mathematics of your name and birth date.
      </p>

      {/* Life Path */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-400/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">\u0023</span>
          <h3 className="text-lg font-semibold text-violet-300">Life Path</h3>
        </div>
        <p className="text-white/80 leading-relaxed">{data.lifePathNarration}</p>
      </div>

      {/* Expression */}
      {data.expressionNarration && (
        <SoulCard title="Expression Number" icon="\u270D" color="blue">
          <p className="text-white/80 leading-relaxed">{data.expressionNarration}</p>
        </SoulCard>
      )}

      {/* Soul Urge */}
      {data.soulUrgeNarration && (
        <SoulCard title="Soul Urge" icon="\u2764" color="rose">
          <p className="text-white/80 leading-relaxed">{data.soulUrgeNarration}</p>
        </SoulCard>
      )}

      {/* Current Year Guidance */}
      {data.currentYearGuidance && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">\u231B</span>
            <h4 className="text-emerald-300 font-medium">This Year's Energy</h4>
          </div>
          <p className="text-white/80 text-sm">{data.currentYearGuidance}</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SYNTHESIS SECTION
// =============================================================================

function SynthesisSection({ data }) {
  if (!data) return <EmptySection message="Cross-cultural synthesis not available" />;

  return (
    <div className="space-y-6">
      <SectionTitle>Cross-Cultural Synthesis</SectionTitle>
      <p className="text-white/50 text-sm mb-4">
        Where Western astrology, Chinese BaZi, and Numerology converge into one truth.
      </p>

      {/* Unified Identity */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-400/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">\u2726</span>
          <h3 className="text-lg font-semibold text-amber-300">Unified Soul Portrait</h3>
        </div>
        <p className="text-white/80 leading-relaxed">{data.unifiedIdentity}</p>
      </div>

      {/* Hidden Strength */}
      {data.hiddenStrength && (
        <SoulCard title="Hidden Strength" icon="\u2605" color="emerald">
          <p className="text-white/80 leading-relaxed">{data.hiddenStrength}</p>
        </SoulCard>
      )}

      {/* Growth Opportunity */}
      {data.growthOpportunity && (
        <SoulCard title="Growth Opportunity" icon="\u2191" color="purple">
          <p className="text-white/80 leading-relaxed">{data.growthOpportunity}</p>
        </SoulCard>
      )}

      {/* Visual separator */}
      <div className="text-center pt-4">
        <span className="text-amber-400/30 text-sm tracking-[0.5em]">\u2726 \u262F \u0023</span>
        <p className="text-white/30 text-xs mt-2">East + West + Numbers = You</p>
      </div>
    </div>
  );
}

// =============================================================================
// TOOLKIT SECTION
// =============================================================================

function ToolkitSection({ data }) {
  if (!data) return <EmptySection message="Toolkit not available" />;

  return (
    <div className="space-y-6">
      <SectionTitle>Take-Home Toolkit</SectionTitle>

      {/* Core Strengths */}
      <SoulCard title="Core Strengths" icon="\u2605" color="emerald">
        <ul className="space-y-2">
          {data.coreStrengths?.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="text-emerald-400">\u2713</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </SoulCard>

      {/* Growth Areas */}
      <SoulCard title="Growth Areas" icon="\u2191" color="purple">
        <ul className="space-y-2">
          {data.growthAreas?.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="text-purple-400">\u2022</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </SoulCard>

      {/* Balance Practices */}
      <SoulCard title="Balance Practices" icon="\u2696" color="blue">
        <ul className="space-y-2">
          {data.balancePractices?.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="text-blue-400">\u2219</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </SoulCard>

      {/* Daily Ritual */}
      <SoulCard title="Daily Ritual" icon="\u2609" color="amber">
        <p className="text-white/80">{data.dailyRitual}</p>
      </SoulCard>

      {/* Monthly Pilgrimage */}
      <SoulCard title="Monthly Pilgrimage" icon="\u263D" color="indigo">
        <p className="text-white/80">{data.monthlyPilgrimage}</p>
      </SoulCard>
    </div>
  );
}

function LetterSection({ letter }) {
  if (!letter) return <EmptySection message="Letter not available" />;

  // Split letter into paragraphs
  const paragraphs = letter.split('\n\n').filter(p => p.trim());

  return (
    <div className="space-y-6">
      <SectionTitle>Letter From Your Chart</SectionTitle>

      {/* Decorative header */}
      <div className="text-center">
        <span className="text-amber-400/50 text-sm tracking-[0.5em]">\u2726 \u2726 \u2726</span>
      </div>

      {/* Letter content */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-amber-400/20">
        {paragraphs.map((paragraph, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="text-white/80 leading-relaxed mb-4 last:mb-0"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              textIndent: paragraph.startsWith('\u2014') ? '0' : '2em'
            }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* Decorative footer */}
      <div className="text-center">
        <span className="text-amber-400/50 text-sm tracking-[0.5em]">\u2726</span>
      </div>
    </div>
  );
}

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-bold text-amber-300 mb-4 pb-2 border-b border-amber-400/20">
      {children}
    </h2>
  );
}

function SoulCard({ title, icon, color = 'amber', children }) {
  return (
    <div className={`p-4 rounded-xl bg-${color}-500/5 border border-${color}-400/20`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className={`text-${color}-300 font-medium`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptySection({ message }) {
  return (
    <div className="text-center py-12">
      <span className="text-4xl mb-4 block">\u26C5</span>
      <p className="text-white/50">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-6xl mb-6"
      >
        \u2728
      </motion.div>
      <p className="text-amber-300 text-lg font-medium mb-2">
        The Cathedral is preparing your reading...
      </p>
      <p className="text-white/50 text-sm">This sacred work takes a moment</p>

      {/* Animated constellation */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-amber-400"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="text-5xl mb-4">\u26A0</span>
      <p className="text-rose-300 text-lg font-medium mb-2">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="text-5xl mb-4">\u26EA</span>
      <p className="text-white/50 text-lg">No chart data available</p>
    </div>
  );
}

function CathedralFooter() {
  return (
    <div className="px-6 py-3 border-t border-amber-400/20 bg-indigo-950/90">
      <p className="text-[10px] text-white/30 text-center italic">
        This reading speaks in soul-language. It offers recognition, not prediction.
        Your path remains your own to walk.
      </p>
    </div>
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getZodiacSymbol(sign) {
  const symbols = {
    Aries: '\u2648',
    Taurus: '\u2649',
    Gemini: '\u264A',
    Cancer: '\u264B',
    Leo: '\u264C',
    Virgo: '\u264D',
    Libra: '\u264E',
    Scorpio: '\u264F',
    Sagittarius: '\u2650',
    Capricorn: '\u2651',
    Aquarius: '\u2652',
    Pisces: '\u2653'
  };
  return symbols[sign] || '\u2728';
}
