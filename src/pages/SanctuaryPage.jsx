/**
 * The Sanctuary of the Unseen Self - Full Page Experience
 *
 * A sacred chamber where souls are recognized, not managed.
 * A staged journey through: Entrance → Arrival → Walls → Mirror → Release → Integration
 *
 * "Here, the unseen is welcomed.
 *  Here, the unheard is honored.
 *  Here, the soul steps forward and is recognized."
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sanctuary components
import SanctuaryEntrancePortal from '../components/sanctuary/SanctuaryEntrancePortal';
import SelfRecognitionSanctuary from '../components/sanctuary/SelfRecognitionSanctuary';
import { BreathingChamber } from '../components/sanctuary/BreathingChamber';
import { InteriorReveal } from '../components/sanctuary/InteriorReveal';
import { WallInscriptions } from '../components/sanctuary/WallInscriptions';
import { MirrorTransition } from '../components/sanctuary/MirrorTransition';
import { MirrorMovement } from '../components/sanctuary/MirrorMovement';
import { ReleaseMovement } from '../components/sanctuary/ReleaseMovement';
import { IntegrationMovement } from '../components/sanctuary/IntegrationMovement';

// Services and hooks
import {
  submitToSanctuary,
  submitDeepSoulRecognition,
  buildInputFromProfile
} from '../services/sanctuaryService';
import { useSanctuarySoundscape } from '../hooks/useSanctuarySoundscape';

/**
 * Journey stages through the Sanctuary
 */
const STAGES = {
  ENTRANCE: 'entrance',
  THRESHOLD: 'threshold',
  ARRIVAL: 'arrival',
  WALLS: 'walls',
  INPUT: 'input',
  MIRROR_TRANSITION: 'mirrorTransition',
  MIRROR: 'mirror',
  RELEASE: 'release',
  INTEGRATION: 'integration'
};

/**
 * Result stages that allow navigation (after AI response)
 */
const RESULT_STAGES = [STAGES.MIRROR, STAGES.RELEASE, STAGES.INTEGRATION];

/**
 * Stage labels for display
 */
const STAGE_LABELS = {
  [STAGES.MIRROR]: 'Mirror',
  [STAGES.RELEASE]: 'Release',
  [STAGES.INTEGRATION]: 'Integration'
};

/**
 * Main Sanctuary Page - Manages the full staged journey
 */
export default function SanctuaryPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(STAGES.ENTRANCE);

  // Sanctuary API state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Profile pre-fill
  const [initialInput, setInitialInput] = useState(null);

  // Soundscape (optional - gracefully fails if no audio file)
  useSanctuarySoundscape({ enabled: stage !== STAGES.ENTRANCE, volume: 0.25 });

  // Load profile for pre-filling
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('currentProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const input = buildInputFromProfile(profile);
        setInitialInput(input);
      }
    } catch (err) {
      console.warn('Could not load profile for Sanctuary:', err);
    }
  }, []);

  /**
   * Navigate to next stage
   */
  const goTo = (nextStage) => setStage(nextStage);

  /**
   * Handle entrance portal activation
   */
  const handleEnter = () => {
    setStage(STAGES.THRESHOLD);
    setTimeout(() => setStage(STAGES.ARRIVAL), 1200);
  };

  /**
   * Handle sanctuary form submission
   * Now supports Deep Soul Recognition when a profile is selected
   */
  const handleSubmit = async (input, profile = null, deepModeEnabled = false) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // Use Deep Soul Recognition if enabled and profile is available
      if (deepModeEnabled && profile) {
        console.log('🔮 [Sanctuary] Initiating DEEP SOUL RECOGNITION for:', profile.name);
        response = await submitDeepSoulRecognition(input, profile);
      } else {
        console.log('📝 [Sanctuary] Using standard recognition mode');
        response = await submitToSanctuary(input);
      }

      setResult(response);
      // After getting result, go to mirror transition
      setStage(STAGES.MIRROR_TRANSITION);
    } catch (err) {
      console.error('Sanctuary error:', err);
      setError(err.message || 'The Sanctuary could not receive your words. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle clear/reset
   */
  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  /**
   * Return to entrance
   */
  const handleReturnToEntrance = () => {
    setStage(STAGES.ENTRANCE);
    setResult(null);
    setError(null);
  };

  /**
   * Complete journey - return to Cathedral
   */
  const handleComplete = () => {
    navigate('/dashboard');
  };

  /**
   * Check if current stage is a result stage (allows navigation)
   */
  const isResultStage = RESULT_STAGES.includes(stage);

  /**
   * Get current index in result stages
   */
  const currentResultIndex = RESULT_STAGES.indexOf(stage);

  /**
   * Navigate to previous result stage
   */
  const goToPreviousStage = () => {
    if (currentResultIndex > 0) {
      setStage(RESULT_STAGES[currentResultIndex - 1]);
    }
  };

  /**
   * Navigate to next result stage
   */
  const goToNextStage = () => {
    if (currentResultIndex < RESULT_STAGES.length - 1) {
      setStage(RESULT_STAGES[currentResultIndex + 1]);
    }
  };

  /**
   * Check if can go to previous stage
   */
  const canGoPrevious = isResultStage && currentResultIndex > 0;

  /**
   * Check if can go to next stage
   */
  const canGoNext = isResultStage && currentResultIndex < RESULT_STAGES.length - 1;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Navigation buttons - shown after entrance */}
      {stage !== STAGES.ENTRANCE && stage !== STAGES.THRESHOLD && (
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleReturnToEntrance}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-white/60 text-sm hover:bg-slate-800/80 hover:text-white/80 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>&#8592;</span>
            <span className="hidden sm:inline">Return to Entrance</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 text-white/60 text-sm hover:bg-slate-800/80 hover:text-white/80 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden sm:inline">Exit to Cathedral</span>
            <span>&#8594;</span>
          </motion.button>
        </div>
      )}

      {/* Stage Navigation Bar - shown on result stages */}
      {isResultStage && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900/90 border border-amber-500/30 backdrop-blur-sm shadow-lg shadow-amber-500/10">
            {/* Previous Button */}
            <motion.button
              onClick={goToPreviousStage}
              disabled={!canGoPrevious}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                canGoPrevious
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800/50 text-white/30 cursor-not-allowed'
              }`}
              whileHover={canGoPrevious ? { scale: 1.05 } : {}}
              whileTap={canGoPrevious ? { scale: 0.95 } : {}}
            >
              <span>&#8592;</span>
              <span className="hidden sm:inline">
                {canGoPrevious ? STAGE_LABELS[RESULT_STAGES[currentResultIndex - 1]] : 'Previous'}
              </span>
            </motion.button>

            {/* Stage Indicators */}
            <div className="flex items-center gap-2 px-3">
              {RESULT_STAGES.map((s, idx) => (
                <motion.button
                  key={s}
                  onClick={() => setStage(s)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    stage === s
                      ? 'bg-amber-400 scale-125'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  title={STAGE_LABELS[s]}
                />
              ))}
            </div>

            {/* Current Stage Label */}
            <div className="hidden md:block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-300 text-xs font-medium">
                {STAGE_LABELS[stage]}
              </span>
            </div>

            {/* Next Button */}
            <motion.button
              onClick={goToNextStage}
              disabled={!canGoNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                canGoNext
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800/50 text-white/30 cursor-not-allowed'
              }`}
              whileHover={canGoNext ? { scale: 1.05 } : {}}
              whileTap={canGoNext ? { scale: 0.95 } : {}}
            >
              <span className="hidden sm:inline">
                {canGoNext ? STAGE_LABELS[RESULT_STAGES[currentResultIndex + 1]] : 'Next'}
              </span>
              <span>&#8594;</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        {/* Stage: Entrance Portal */}
        {stage === STAGES.ENTRANCE && (
          <motion.div
            key="entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SanctuaryEntrancePortal onEnter={handleEnter} />
          </motion.div>
        )}

        {/* Stage: Threshold Crossing */}
        {stage === STAGES.THRESHOLD && (
          <motion.div
            key="threshold"
            className="fixed inset-0 bg-amber-400/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.3, 0.7, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-amber-300 text-xl font-light"
            >
              Crossing the threshold...
            </motion.div>
          </motion.div>
        )}

        {/* Stage: Arrival */}
        {stage === STAGES.ARRIVAL && (
          <motion.div
            key="arrival"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber intensity="subtle">
              <InteriorReveal onComplete={() => goTo(STAGES.WALLS)} />
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Wall Inscriptions */}
        {stage === STAGES.WALLS && (
          <motion.div
            key="walls"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber>
              <WallInscriptions onContinue={() => goTo(STAGES.INPUT)} />
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Input Form */}
        {stage === STAGES.INPUT && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <BreathingChamber intensity="deep">
              <div className="w-full max-w-3xl mx-auto">
                <SelfRecognitionSanctuary
                  onSubmit={handleSubmit}
                  loading={loading}
                  result={null}
                  error={error}
                  onClear={handleClear}
                  initialInput={initialInput}
                />
              </div>
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Mirror Transition */}
        {stage === STAGES.MIRROR_TRANSITION && (
          <motion.div
            key="mirrorTransition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber intensity="deep">
              <MirrorTransition onComplete={() => goTo(STAGES.MIRROR)} />
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Mirror Movement */}
        {stage === STAGES.MIRROR && result && (
          <motion.div
            key="mirror"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber>
              <MirrorMovement
                mirror={result.mirror}
                patterns={result.emotionalPatterns}
                onContinue={() => goTo(STAGES.RELEASE)}
              />
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Release Movement */}
        {stage === STAGES.RELEASE && result && (
          <motion.div
            key="release"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber>
              <ReleaseMovement
                section={result.release}
                ritual={result.rituals?.release}
                onContinue={() => goTo(STAGES.INTEGRATION)}
              />
            </BreathingChamber>
          </motion.div>
        )}

        {/* Stage: Integration Movement */}
        {stage === STAGES.INTEGRATION && result && (
          <motion.div
            key="integration"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <BreathingChamber intensity="subtle">
              <IntegrationMovement
                section={result.integration}
                rituals={result.rituals}
                shortMantra={result.shortMantra}
                onComplete={handleComplete}
              />
            </BreathingChamber>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
