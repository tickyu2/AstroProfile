/**
 * EnneagramTab Component
 *
 * Main container for the Enneagram personality assessment.
 * Orchestrates questionnaire and results display.
 *
 * Features:
 *   - Conditional rendering: questionnaire OR results
 *   - Profile integration via quickSaveProfile
 *   - Alchemical Rose visualization
 *   - Retake assessment option
 *   - Soul Garden styling
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfiles } from '../../contexts/ProfileContext';
import { ENNEAGRAM_TYPES, scoreToPercentage } from './enneagramData';
import EnneagramQuestionnaire from './EnneagramQuestionnaire';
import EnneagramAlchemicalRose from './EnneagramAlchemicalRose';
import EnneagramTypeCard from './EnneagramTypeCard';

export default function EnneagramTab({ profile, onProfileUpdate }) {
  const { quickSaveProfile } = useProfiles();
  const [isRetaking, setIsRetaking] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false); // Review mode with pre-populated answers
  const [saving, setSaving] = useState(false);
  const [alchemicalMode, setAlchemicalMode] = useState(true);

  // Get existing enneagram data from profile
  const existingEnneagram = profile?.enneagram;
  const hasCompletedAssessment = existingEnneagram && existingEnneagram.dominantType;

  // Show questionnaire if no result, retaking, or reviewing
  const showQuestionnaire = !hasCompletedAssessment || isRetaking || isReviewing;

  // Handle assessment completion
  const handleComplete = useCallback(async (result, answers = {}) => {
    if (!profile?.id) return;

    try {
      setSaving(true);

      // Include answers in the result for "See Your Answers" feature
      const enrichedResult = {
        ...result,
        answers // Store raw answers for review
      };

      // Save to profile via quickSaveProfile
      await quickSaveProfile(profile.id, {
        enneagram: enrichedResult
      });

      console.log('⚗️ Enneagram saved:', enrichedResult);

      // Exit retake/review mode
      setIsRetaking(false);
      setIsReviewing(false);

      // Trigger refresh if callback provided
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Failed to save Enneagram:', error);
    } finally {
      setSaving(false);
    }
  }, [profile?.id, quickSaveProfile, onProfileUpdate]);

  // Handle review (edit existing answers)
  const handleReview = useCallback(() => {
    setIsReviewing(true);
    setIsRetaking(false);
  }, []);

  // Handle fresh retake (start from scratch)
  const handleRetake = useCallback(() => {
    setIsRetaking(true);
    setIsReviewing(false);
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsRetaking(false);
    setIsReviewing(false);
  }, []);

  // Get dominant type data for header
  const dominantTypeData = hasCompletedAssessment
    ? ENNEAGRAM_TYPES[existingEnneagram.dominantType]
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className={`space-y-8 ${alchemicalMode ? 'alchemical' : 'contemplative'}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">⚗️</span>
              Enneagram Alchemical Rose
            </h2>
            <p className="text-sm text-white/50 mt-1">
              {showQuestionnaire
                ? (isReviewing
                    ? 'Review and edit your previous answers'
                    : 'Discover your core personality type through self-reflection'
                  )
                : `Your SoulPrint: Type ${existingEnneagram?.dominantType} - ${dominantTypeData?.name}`
              }
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAlchemicalMode(!alchemicalMode)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                ${alchemicalMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                }
              `}
            >
              <span>{alchemicalMode ? '⚗️' : '🔮'}</span>
              <span>{alchemicalMode ? 'Alchemical' : 'Contemplative'}</span>
            </button>

            {hasCompletedAssessment && !isRetaking && !isReviewing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReview}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
                >
                  📝 Review & Edit
                </button>
                <button
                  onClick={handleRetake}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all"
                >
                  ↻ Start Fresh
                </button>
              </div>
            )}

            {(isRetaking || isReviewing) && (
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white/60 border border-white/20 hover:bg-white/20 transition-all"
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Saving your SoulPrint...</span>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {showQuestionnaire ? (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 rounded-2xl border border-purple-500/20 p-6">
                {/* Show review mode banner */}
                {isReviewing && (
                  <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-300 text-sm flex items-center gap-2">
                      <span>📝</span>
                      <span>Review Mode - Your previous answers are pre-filled. Edit any and resubmit.</span>
                    </p>
                  </div>
                )}
                <EnneagramQuestionnaire
                  onComplete={handleComplete}
                  alchemical={alchemicalMode}
                  initialAnswers={isReviewing ? existingEnneagram?.answers : undefined}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Rose visualization with scores */}
              <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 rounded-2xl border border-purple-500/20 p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* The Alchemical Rose */}
                  <div className="flex-shrink-0">
                    <EnneagramAlchemicalRose
                      scores={existingEnneagram.scores}
                      dominantType={existingEnneagram.dominantType}
                      alchemical={alchemicalMode}
                      size={320}
                    />
                  </div>

                  {/* Score breakdown */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Type Score Distribution
                    </h3>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((type) => {
                      const typeData = ENNEAGRAM_TYPES[type];
                      const score = existingEnneagram.scores[type] || 0;
                      const percent = scoreToPercentage(score);
                      const isDominant = type === existingEnneagram.dominantType;
                      const isWing = type === existingEnneagram.wing;

                      return (
                        <div key={type} className="flex items-center gap-3">
                          {/* Type number */}
                          <div
                            className={`
                              w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                              ${isDominant ? 'ring-2 ring-offset-1 ring-offset-slate-900' : ''}
                            `}
                            style={{
                              backgroundColor: `${typeData.color}${isDominant ? '40' : '20'}`,
                              color: typeData.color,
                              ringColor: isDominant ? typeData.color : undefined
                            }}
                          >
                            {type}
                          </div>

                          {/* Type name */}
                          <div className="w-24 text-xs text-white/60 truncate">
                            {typeData.shortName}
                            {isWing && <span className="text-amber-400 ml-1">w</span>}
                          </div>

                          {/* Progress bar */}
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: typeData.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5, delay: type * 0.05 }}
                            />
                          </div>

                          {/* Percentage */}
                          <div
                            className="w-10 text-right text-xs font-medium"
                            style={{ color: typeData.color }}
                          >
                            {percent}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Detailed type information */}
              <EnneagramTypeCard
                enneagramResult={existingEnneagram}
                answers={existingEnneagram?.answers || {}}
                alchemical={alchemicalMode}
              />

              {/* Completion timestamp */}
              {existingEnneagram.completedAt && (
                <div className="text-center text-xs text-white/30">
                  Assessment completed: {new Date(existingEnneagram.completedAt).toLocaleDateString()}
                  {existingEnneagram.version && ` • v${existingEnneagram.version}`}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="text-center text-xs text-white/30 pt-4 border-t border-white/5">
          <p>
            The Enneagram is a model of human psyche principally understood as a typology of nine interconnected personality types.
          </p>
          <p className="mt-1">
            This assessment provides insights into your core motivations and growth paths.
          </p>
        </div>
      </div>
    </div>
  );
}
