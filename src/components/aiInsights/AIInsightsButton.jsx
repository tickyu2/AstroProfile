/**
 * AIInsightsButton.jsx
 * THE GOOSE Button - "Get AI Insights"
 *
 * Jack climbs the beanstalk with a click!
 * This is the entry point to THE GOOSE system.
 *
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 12, 2024
 *
 * Note: Firestore caching temporarily disabled until security rules are configured.
 * THE GOOSE works in "offline mode" - generating fresh insights each time.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIInsightsModal from './AIInsightsModal';
import { aiGerminationService } from '../../services/aiGerminationService';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AIInsightsButton({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  // Check if Claude API is available
  const isAPIAvailable = aiGerminationService.isClaudeAPIAvailable();

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to check for cached insights first
      let cachedInsights = null;

      try {
        const insightsRef = doc(db, 'aiInsights', profile.id);
        const cachedDoc = await getDoc(insightsRef);

        if (cachedDoc.exists()) {
          const cached = cachedDoc.data();
          const cacheAge = Date.now() - new Date(cached.generatedAt).getTime();
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;

          if (cacheAge < thirtyDays) {
            console.log('✅ THE GOOSE: Using cached golden eggs');
            cachedInsights = cached;
          }
        }
      } catch (cacheErr) {
        // Firestore permission error - continue without cache
        console.log('⚠️ THE GOOSE: Cache unavailable, generating fresh insights');
      }

      if (cachedInsights) {
        setInsights(cachedInsights);
        setIsOpen(true);
        setIsLoading(false);
        return;
      }

      // Generate new insights (climb the beanstalk!)
      console.log('🌱 THE GOOSE: Climbing the beanstalk...');
      const goldenEggs = await aiGerminationService.germinateConstitution(profile);

      // Try to save to Firestore (store the treasure!)
      try {
        const insightsRef = doc(db, 'aiInsights', profile.id);
        await setDoc(insightsRef, {
          ...goldenEggs,
          userId: profile.userId,
          profileId: profile.id,
          updatedAt: new Date().toISOString()
        });
        console.log('💾 THE GOOSE: Golden eggs cached in Firestore');
      } catch (saveErr) {
        // Firestore permission error - continue without caching
        console.log('⚠️ THE GOOSE: Unable to cache (permission denied), showing fresh insights');
      }

      setInsights(goldenEggs);
      setIsOpen(true);

    } catch (err) {
      console.error('❌ THE GOOSE: Failed to get insights:', err);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Force regenerate (climb the beanstalk again!)
  const handleRegenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🌱 THE GOOSE: Re-climbing the beanstalk...');
      const goldenEggs = await aiGerminationService.germinateConstitution(profile);

      // Try to save to Firestore
      try {
        const insightsRef = doc(db, 'aiInsights', profile.id);
        await setDoc(insightsRef, {
          ...goldenEggs,
          userId: profile.userId,
          profileId: profile.id,
          updatedAt: new Date().toISOString()
        });
        console.log('💾 THE GOOSE: Golden eggs re-cached in Firestore');
      } catch (saveErr) {
        console.log('⚠️ THE GOOSE: Unable to cache (permission denied)');
      }

      setInsights(goldenEggs);
      setIsOpen(true);

    } catch (err) {
      console.error('❌ THE GOOSE: Failed to regenerate insights:', err);
      setError('Failed to regenerate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhance with Claude API (force AI generation)
  const handleEnhanceWithAI = async () => {
    if (!isAPIAvailable) {
      setError('Claude API key not configured. Add VITE_ANTHROPIC_API_KEY to .env.local');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      console.log('🤖 THE GOOSE: Enhancing with Claude API...');
      const goldenEggs = await aiGerminationService.germinateConstitution(profile, {
        useClaudeAPI: true
      });

      // Try to save to Firestore
      try {
        const insightsRef = doc(db, 'aiInsights', profile.id);
        await setDoc(insightsRef, {
          ...goldenEggs,
          userId: profile.userId,
          profileId: profile.id,
          updatedAt: new Date().toISOString()
        });
        console.log('💾 THE GOOSE: AI-enhanced eggs cached in Firestore');
      } catch (saveErr) {
        console.log('⚠️ THE GOOSE: Unable to cache (permission denied)');
      }

      setInsights(goldenEggs);

    } catch (err) {
      console.error('❌ THE GOOSE: Failed to enhance with AI:', err);
      setError('Failed to enhance with AI. ' + (err.message || 'Please try again.'));
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleGetInsights}
        disabled={isLoading}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600
                   hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium
                   transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-purple-500/25
                   disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <motion.span
              className="text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              🫘
            </motion.span>
            <span>Climbing Beanstalk...</span>
          </>
        ) : (
          <>
            <span className="text-lg">🌱</span>
            <span>Get AI Insights</span>
            <span className="text-lg">✨</span>
          </>
        )}
      </motion.button>

      {error && (
        <div className="mt-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {insights && (
        <AIInsightsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          insights={insights}
          profileName={profile.displayName || profile.firstName || 'User'}
          onRegenerate={handleRegenerate}
          isRegenerating={isLoading}
          onEnhanceWithAI={handleEnhanceWithAI}
          isEnhancing={isEnhancing}
          isAPIAvailable={isAPIAvailable}
        />
      )}
    </>
  );
}
