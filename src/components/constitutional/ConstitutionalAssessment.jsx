/**
 * ConstitutionalAssessment.jsx
 * Main Constitutional Assessment Container
 *
 * Orchestrates the full assessment flow:
 * 1. Questionnaire → 2. Results Calculation → 3. Profile Display
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState } from 'react';
import { QuestionnaireFlow } from './QuestionnaireFlow';
import { ConstitutionalProfile } from './ConstitutionalProfile';
import { calculateFullConstitution } from './constitutionalCalculator';

/**
 * Assessment States
 */
const STATES = {
  INTRO: 'intro',
  QUESTIONNAIRE: 'questionnaire',
  CALCULATING: 'calculating',
  RESULTS: 'results'
};

/**
 * ConstitutionalAssessment Component
 *
 * @param {Object} props
 * @param {Object} props.userProfile - User's profile with birth data
 * @param {Function} props.onComplete - Callback when assessment is complete
 * @param {Function} props.onCancel - Callback to cancel assessment
 * @param {Function} props.onSaveProfile - Callback to save constitutional profile
 */
export function ConstitutionalAssessment({
  userProfile,
  onComplete,
  onCancel,
  onSaveProfile
}) {
  const [state, setState] = useState(STATES.INTRO);
  const [constitutionalProfile, setConstitutionalProfile] = useState(null);

  // Handle questionnaire completion
  const handleQuestionnaireComplete = async (responses) => {
    setState(STATES.CALCULATING);

    // Simulate calculation time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate full constitutional profile
    const profile = calculateFullConstitution(userProfile, responses);
    setConstitutionalProfile(profile);

    setState(STATES.RESULTS);
  };

  // Handle retake assessment
  const handleRetake = () => {
    setConstitutionalProfile(null);
    setState(STATES.QUESTIONNAIRE);
  };

  // Handle continue to profile
  const handleContinue = () => {
    if (onSaveProfile && constitutionalProfile) {
      onSaveProfile(constitutionalProfile);
    }
    if (onComplete) {
      onComplete(constitutionalProfile);
    }
  };

  // Render based on current state
  switch (state) {
    case STATES.INTRO:
      return (
        <IntroScreen
          userProfile={userProfile}
          onStart={() => setState(STATES.QUESTIONNAIRE)}
          onCancel={onCancel}
        />
      );

    case STATES.QUESTIONNAIRE:
      return (
        <QuestionnaireFlow
          birthData={userProfile}
          onComplete={handleQuestionnaireComplete}
          onCancel={() => setState(STATES.INTRO)}
        />
      );

    case STATES.CALCULATING:
      return <CalculatingScreen />;

    case STATES.RESULTS:
      return (
        <ConstitutionalProfile
          profile={constitutionalProfile}
          onRetake={handleRetake}
          onContinue={handleContinue}
        />
      );

    default:
      return null;
  }
}

/**
 * Intro Screen - Welcome and explanation
 */
function IntroScreen({ userProfile, onStart, onCancel }) {
  const chineseSign = userProfile?.constitutional_identity?.chinese?.fullSign ||
    `${userProfile?.constitutional_identity?.chinese?.element || ''} ${userProfile?.constitutional_identity?.chinese?.animal || ''}`.trim();
  const westernSign = userProfile?.constitutional_identity?.western?.sun;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo/Icon */}
        <div className="text-6xl mb-6">🌹</div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Discover Your True Constitution
        </h1>

        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Your birth data tells us your constitutional potential.
          <br />
          This assessment reveals how you actually express it in life.
        </p>

        {/* Birth Foundation Preview */}
        {(chineseSign || westernSign) && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-medium text-white/50 mb-3">
              Your Birth Foundation
            </h3>
            <div className="flex items-center justify-center gap-6">
              {chineseSign && (
                <div className="text-center">
                  <span className="text-3xl">🐉</span>
                  <p className="text-white/80 mt-1">{chineseSign}</p>
                </div>
              )}
              {westernSign && (
                <div className="text-center">
                  <span className="text-3xl">⭐</span>
                  <p className="text-white/80 mt-1">{westernSign}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What to Expect */}
        <div className="text-left bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-amber-400 font-bold mb-3">What to Expect</h3>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-amber-500">✓</span>
              <span>5 thoughtful questions about your natural tendencies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">✓</span>
              <span>No right or wrong answers - just your truth</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">✓</span>
              <span>Takes about 3-5 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">✓</span>
              <span>Reveals your True Constitutional Soul Signature</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 text-white/50 hover:text-white/80 transition-colors"
            >
              Maybe Later
            </button>
          )}

          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all"
          >
            Begin Assessment ✨
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculating Screen - Shown during profile calculation
 */
function CalculatingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated Elements */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {['🔥', '🌍', '⚡', '🌊', '🌱'].map((emoji, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-ping"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 72}deg) translateY(-40px)`,
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              {emoji}
            </div>
          ))}

          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl animate-pulse">
            🌹
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Calculating Your Constitution
        </h2>

        <p className="text-white/50">
          Integrating birth data with lived expression...
        </p>

        {/* Loading bar */}
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mt-6 mx-auto">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

export default ConstitutionalAssessment;
