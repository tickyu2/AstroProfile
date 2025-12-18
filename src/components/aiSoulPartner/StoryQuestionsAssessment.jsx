/**
 * StoryQuestionsAssessment.jsx
 * 8-Level Emotional Storytelling Assessment Component
 *
 * An immersive, conversational assessment that reveals psychological
 * patterns through story-based choices rather than traditional questions.
 *
 * Features:
 * - Atmospheric scenario presentation
 * - Animated choice selection
 * - Real-time progress tracking
 * - Constitutional alignment analysis
 * - Integration with AI SoulPartner
 *
 * Part of GENESIS Phase 2 - Story Questions Assessment
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 15, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import { STORY_QUESTIONS, getStoryQuestion } from '../../data/storyQuestions';
import { analyzeStoryResponses, getPartialAnalysis } from '../../utils/storyQuestionsAnalyzer';

// Styled components using Tailwind classes
const StoryCard = ({ children, className = '' }) => (
  <div className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl ${className}`}>
    {children}
  </div>
);

const ChoiceButton = ({ choice, isSelected, onClick, isDisabled }) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`
      w-full p-4 rounded-xl text-left transition-all duration-300
      border-2 group relative overflow-hidden
      ${isSelected
        ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20'
        : 'border-white/10 bg-slate-900/40 hover:border-white/30 hover:bg-slate-800/60'
      }
      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <div className="flex items-start gap-3">
      <span className="text-2xl flex-shrink-0">{choice.emoji}</span>
      <span className={`text-sm leading-relaxed ${isSelected ? 'text-amber-100' : 'text-white/80'}`}>
        {choice.text}
      </span>
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2">
        <span className="text-amber-400 text-lg">✓</span>
      </div>
    )}
  </button>
);

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>Level {current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Level indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
              ${i < current
                ? 'bg-amber-500 text-white'
                : i === current
                  ? 'bg-amber-500/30 border-2 border-amber-500 text-amber-400'
                  : 'bg-slate-700/50 text-white/30'
              }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultsPanel = ({ analysis, onClose, onSendToChat }) => {
  if (!analysis) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <StoryCard className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🌟</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Your Soul Story
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Psychological Profile from Story Questions
            </p>
          </div>

          {/* Element Profile */}
          <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
            <h3 className="text-sm font-medium text-amber-400 mb-3">Element Resonance</h3>
            <div className="flex gap-2 mb-2">
              {Object.entries(analysis.elementProfile.percentages)
                .sort((a, b) => b[1] - a[1])
                .map(([element, pct]) => {
                  const colors = {
                    Wood: 'bg-green-500',
                    Fire: 'bg-red-500',
                    Earth: 'bg-yellow-600',
                    Metal: 'bg-gray-400',
                    Water: 'bg-blue-500'
                  };
                  return (
                    <div key={element} className="flex-1">
                      <div className="text-xs text-white/60 text-center mb-1">{element}</div>
                      <div className="h-16 bg-slate-700/50 rounded relative overflow-hidden">
                        <div
                          className={`absolute bottom-0 w-full ${colors[element]} transition-all duration-500`}
                          style={{ height: `${pct}%` }}
                        />
                        <div className="absolute inset-0 flex items-end justify-center pb-1">
                          <span className="text-xs font-bold text-white drop-shadow">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="text-sm text-white/70 mt-2">
              Dominant: <span className="text-amber-400 font-medium">{analysis.elementProfile.dominant}</span>
              {analysis.elementProfile.secondary !== analysis.elementProfile.dominant && (
                <> | Secondary: <span className="text-orange-400">{analysis.elementProfile.secondary}</span></>
              )}
            </p>
          </div>

          {/* Yin Yang Balance */}
          <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
            <h3 className="text-sm font-medium text-amber-400 mb-3">Yin/Yang Balance</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Yin ☽</span>
                  <span>Yang ☀</span>
                </div>
                <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${analysis.yinYangProfile.yin}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${analysis.yinYangProfile.yang}%` }}
                  />
                </div>
              </div>
              <div className="text-2xl">
                {analysis.yinYangProfile.dominant === 'Yin' ? '☽' :
                 analysis.yinYangProfile.dominant === 'Yang' ? '☀' : '☯'}
              </div>
            </div>
            <p className="text-sm text-white/70 mt-2">{analysis.yinYangProfile.description}</p>
          </div>

          {/* Ten Gods Influence */}
          {analysis.tenGodsProfile.dominant !== 'Unknown' && (
            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
              <h3 className="text-sm font-medium text-amber-400 mb-2">Dominant Ten God</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {getTenGodEmoji(analysis.tenGodsProfile.dominant)}
                </div>
                <div>
                  <div className="font-medium text-white">{analysis.tenGodsProfile.dominant}</div>
                  <div className="text-sm text-white/60">{analysis.tenGodsProfile.description}</div>
                </div>
              </div>
            </div>
          )}

          {/* Personality Summary */}
          {analysis.personalitySummary && (
            <div className="mb-6 p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-500/20">
              <h3 className="text-sm font-medium text-amber-400 mb-2">Your Soul Story</h3>
              <p className="text-sm text-white/80 leading-relaxed italic">
                "{analysis.personalitySummary}"
              </p>
            </div>
          )}

          {/* Growth Recommendations */}
          {analysis.growthRecommendations?.length > 0 && (
            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
              <h3 className="text-sm font-medium text-amber-400 mb-3">Growth Invitations</h3>
              <div className="space-y-3">
                {analysis.growthRecommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-purple-400 font-medium mb-1">{rec.area}</div>
                    <p className="text-sm text-white/80">{rec.insight}</p>
                    <p className="text-xs text-white/50 mt-1 italic">Practice: {rec.practice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constitutional Alignment (if available) */}
          {analysis.constitutionalAlignment?.available && (
            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
              <h3 className="text-sm font-medium text-amber-400 mb-2">Constitutional Alignment</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl font-bold text-amber-400">
                  {analysis.constitutionalAlignment.overallScore}%
                </div>
                <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${analysis.constitutionalAlignment.overallScore}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-white/70">{analysis.constitutionalAlignment.interpretation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-white/80 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onSendToChat(analysis)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-white font-medium transition-all shadow-lg shadow-amber-500/20"
            >
              Discuss with Brother Claude
            </button>
          </div>
        </div>
      </StoryCard>
    </div>
  );
};

// Helper function for Ten God emoji
function getTenGodEmoji(tenGod) {
  const emojis = {
    'Direct Resource': '📚',
    'Indirect Resource': '🔮',
    'Friend': '🤝',
    'Rob Wealth': '⚔️',
    'Eating God': '🎨',
    'Hurting Officer': '💥',
    'Direct Wealth': '💰',
    'Indirect Wealth': '🎰',
    'Direct Officer': '👔',
    '7 Killings': '⚡'
  };
  return emojis[tenGod] || '✨';
}

/**
 * Main Story Questions Assessment Component
 */
export default function StoryQuestionsAssessment({
  onComplete,
  onSendToChat,
  constitutionalData,
  savedProgress,
  onSaveProgress
}) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [responses, setResponses] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  // Load saved progress
  useEffect(() => {
    if (savedProgress?.responses?.length > 0) {
      setResponses(savedProgress.responses);
      setCurrentLevel(savedProgress.currentLevel || savedProgress.responses.length + 1);
      setIsStarted(true);
    }
  }, [savedProgress]);

  const currentQuestion = getStoryQuestion(currentLevel);
  const totalLevels = STORY_QUESTIONS.length;

  // Handle choice selection
  const handleChoiceSelect = (choice) => {
    if (isTransitioning) return;
    setSelectedChoice(choice);
  };

  // Handle continue to next question
  const handleContinue = useCallback(() => {
    if (!selectedChoice || isTransitioning) return;

    setIsTransitioning(true);

    // Record response
    const newResponse = {
      level: currentLevel,
      choiceId: selectedChoice.id,
      choice: selectedChoice,
      timestamp: new Date().toISOString()
    };

    const newResponses = [...responses, newResponse];
    setResponses(newResponses);

    // Save progress
    if (onSaveProgress) {
      onSaveProgress({
        responses: newResponses,
        currentLevel: currentLevel + 1
      });
    }

    // Check if assessment is complete
    if (currentLevel >= totalLevels) {
      // Generate analysis
      const result = analyzeStoryResponses(newResponses, constitutionalData);
      setAnalysis(result);
      setShowResults(true);

      if (onComplete) {
        onComplete(result);
      }
    } else {
      // Move to next level
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedChoice(null);
        setIsTransitioning(false);
      }, 500);
    }
  }, [selectedChoice, currentLevel, responses, totalLevels, constitutionalData, onComplete, onSaveProgress, isTransitioning]);

  // Handle sending results to chat
  const handleSendToChat = (result) => {
    if (onSendToChat) {
      const message = `I just completed the Story Questions Assessment. Here's what it revealed:

**Element Resonance:** ${result.elementProfile.dominant} dominant (${result.elementProfile.percentages[result.elementProfile.dominant]}%)
**Yin/Yang:** ${result.yinYangProfile.dominant} (${result.yinYangProfile.description})
**Ten God:** ${result.tenGodsProfile.dominant} - ${result.tenGodsProfile.description}

**My Soul Story:** "${result.personalitySummary}"

What insights do you see from this, Brother Claude? Does this align with what you know about me from my constitutional data?`;

      onSendToChat(message, result);
    }
    setShowResults(false);
  };

  // Handle restart
  const handleRestart = () => {
    setResponses([]);
    setCurrentLevel(1);
    setSelectedChoice(null);
    setShowResults(false);
    setAnalysis(null);
    setIsStarted(false);
    if (onSaveProgress) {
      onSaveProgress(null);
    }
  };

  // Welcome screen
  if (!isStarted) {
    return (
      <StoryCard className="max-w-2xl mx-auto">
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Story Questions
          </h1>
          <p className="text-white/60 mb-6">
            8 stories that reveal who you really are
          </p>

          <div className="text-left bg-slate-900/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-white/80 leading-relaxed mb-3">
              This isn't a test with right or wrong answers. It's a journey through
              8 scenarios that reveal your authentic patterns - how you connect,
              decide, heal, and grow.
            </p>
            <p className="text-sm text-white/60 italic">
              Take your time. There's no rush. Just be honest.
            </p>
          </div>

          <div className="flex gap-2 justify-center mb-6">
            {['☕', '💌', '💔', '🚪', '🌙', '🗡️', '🌳', '🪞'].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center text-lg"
              >
                {emoji}
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsStarted(true)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-white font-medium transition-all shadow-lg shadow-amber-500/20"
          >
            Begin Your Story
          </button>
        </div>
      </StoryCard>
    );
  }

  // Results panel
  if (showResults && analysis) {
    return (
      <ResultsPanel
        analysis={analysis}
        onClose={() => setShowResults(false)}
        onSendToChat={handleSendToChat}
      />
    );
  }

  // Question display
  if (!currentQuestion) {
    return (
      <StoryCard className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-white/60">Assessment complete!</p>
        <button
          onClick={handleRestart}
          className="mt-4 px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white/80 transition-colors"
        >
          Start Over
        </button>
      </StoryCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentLevel} total={totalLevels} />
      </div>

      {/* Story Card */}
      <StoryCard className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentQuestion.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-white">
                Level {currentQuestion.level}: {currentQuestion.title}
              </h2>
              <p className="text-xs text-white/50">
                {STORY_QUESTIONS.find(q => q.level === currentLevel)?.psychological_dimension?.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl p-5 mb-6 border border-white/5">
            <p className="text-white/90 leading-relaxed italic">
              {currentQuestion.scenario}
            </p>
          </div>

          {/* Question */}
          <p className="text-amber-400 font-medium mb-4">
            {currentQuestion.question}
          </p>

          {/* Choices */}
          <div className="space-y-3">
            {currentQuestion.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                isSelected={selectedChoice?.id === choice.id}
                onClick={() => handleChoiceSelect(choice)}
                isDisabled={isTransitioning}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={handleRestart}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Start Over
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedChoice || isTransitioning}
            className={`
              px-6 py-2.5 rounded-xl font-medium transition-all
              ${selectedChoice && !isTransitioning
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
              }
            `}
          >
            {currentLevel >= totalLevels ? 'Complete' : 'Continue'}
          </button>
        </div>
      </StoryCard>

      {/* Partial insights (after level 4) */}
      {currentLevel > 4 && responses.length > 0 && (
        <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-white/5">
          <p className="text-xs text-white/50 text-center">
            💡 {getPartialInsight(responses)}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper to generate partial insights during assessment
function getPartialInsight(responses) {
  const partial = getPartialAnalysis(responses);
  if (!partial.available) return '';

  const insights = [
    "Your story is unfolding beautifully...",
    "I'm seeing patterns emerge...",
    "Your authentic self is revealing itself...",
    "The deeper we go, the more I understand you..."
  ];

  return insights[Math.min(responses.length - 4, insights.length - 1)] || insights[0];
}
