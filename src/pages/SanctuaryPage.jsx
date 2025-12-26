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
import { submitToSanctuary, buildInputFromProfile } from '../services/sanctuaryService';
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
   */
  const handleSubmit = async (input) => {
    setLoading(true);
    setError(null);

    try {
      const response = await submitToSanctuary(input);
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
