/**
 * ============================================================================
 * NEURAL SIDEBAR - Biography Priority Questions Panel
 * ============================================================================
 *
 * An interactive sidebar where biography questions are grouped by theme.
 * Click a question -> inline input expands -> save answer -> flaps shut & disappears.
 *
 * Features:
 * - Questions grouped by theme (Career Arc, Key Relationships, Timeline Gaps, etc.)
 * - Inline answering with textarea
 * - Satisfying "flap shut" animation when answered
 * - Real-time updates to database
 *
 * Created: December 24, 2025
 * For Father Ticky
 */

import React, { useEffect, useState, useCallback } from 'react';
import QuestionCard from './QuestionCard';
import { biographyService } from '../../services/biographyService';

// Theme icons mapping
const THEME_ICONS = {
  'Family': '👨‍👩‍👧‍👦',
  'Key Relationships': '💕',
  'Career Arc': '💼',
  'Career Shift': '🔄',
  'Education': '🎓',
  'Timeline Gaps': '📅',
  'Health Journey': '🏥',
  'Spiritual Growth': '🙏',
  'Creative Expression': '🎨',
  'Life Transitions': '🌅',
  'Grief Journey': '🕯️',
  'Achievements': '🏆',
  'Travel & Places': '✈️',
  'Financial': '💰',
  'General': '💭',
  'Uncategorized': '📌'
};

const NeuralSidebar = ({ userId, profileId, onClose, embedded = false }) => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch questions on load
  const loadQuestions = useCallback(async () => {
    if (!userId || !profileId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await biographyService.getNeuralPathways(userId, profileId, 50);

      if (result.success && result.pathways) {
        // Group questions by theme
        const grouped = result.pathways.reduce((acc, pathway) => {
          const theme = pathway.theme || pathway.relatedEvent?.type || 'General';
          // Capitalize theme
          const themeKey = theme.charAt(0).toUpperCase() + theme.slice(1).replace(/_/g, ' ');
          if (!acc[themeKey]) acc[themeKey] = [];
          acc[themeKey].push({
            id: pathway.id || `${pathway.question}-${Date.now()}`,
            question_text: pathway.question,
            theme_group: themeKey,
            complexity_level: pathway.priority > 0.6 ? 'reflection' : 'fact',
            priority: pathway.priority || 0.5,
            relatedEvent: pathway.relatedEvent
          });
          return acc;
        }, {});

        setGroupedQuestions(grouped);
        setTotalCount(result.pathways.length);
      } else {
        setGroupedQuestions({});
        setTotalCount(0);
      }
    } catch (err) {
      console.error('[NeuralSidebar] Load error:', err);
      setError('Failed to load neural pathways');
    } finally {
      setLoading(false);
    }
  }, [userId, profileId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Handler to remove a question from UI locally after answering
  const handleQuestionAnswered = useCallback((theme, questionId) => {
    setGroupedQuestions(prev => {
      const newThemeGroup = prev[theme]?.filter(q => q.id !== questionId) || [];
      const newState = { ...prev };

      if (newThemeGroup.length === 0) {
        delete newState[theme];
      } else {
        newState[theme] = newThemeGroup;
      }

      return newState;
    });

    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  // Get icon for theme
  const getThemeIcon = (theme) => {
    return THEME_ICONS[theme] || THEME_ICONS['General'];
  };

  // Calculate remaining questions
  const remainingCount = Object.values(groupedQuestions).flat().length;

  // Container classes based on embedded mode
  const containerClasses = embedded
    ? "bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col max-h-[600px]"
    : "w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800 h-full overflow-hidden flex flex-col";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <span className="text-xl">🧠</span>
            <h2 className="font-bold uppercase tracking-wider text-sm">Neural Pathways</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {remainingCount > 0
            ? `${remainingCount} question${remainingCount !== 1 ? 's' : ''} to explore`
            : 'All pathways documented'
          }
        </p>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Progress</span>
              <span>{totalCount - remainingCount} / {totalCount} answered</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                style={{ width: `${((totalCount - remainingCount) / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3"></div>
            <p className="text-sm">Loading neural pathways...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={loadQuestions}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : Object.keys(groupedQuestions).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <span className="text-4xl mb-3">✨</span>
            <p className="text-sm font-medium">All pathways documented</p>
            <p className="text-xs text-slate-600 mt-1">Great job exploring the life story!</p>
          </div>
        ) : (
          Object.keys(groupedQuestions)
            .sort((a, b) => {
              // Sort by number of questions (most first)
              return groupedQuestions[b].length - groupedQuestions[a].length;
            })
            .map(theme => (
              <div key={theme} className="animate-fade-in">
                {/* Theme Header */}
                <div className="flex items-center gap-2 px-2 mb-2 text-slate-400">
                  <span className="text-sm">{getThemeIcon(theme)}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {theme}
                  </span>
                  <span className="text-[10px] text-slate-600 ml-auto">
                    {groupedQuestions[theme].length}
                  </span>
                </div>

                {/* Questions List */}
                <div className="space-y-2">
                  {groupedQuestions[theme]
                    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                    .map(question => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        userId={userId}
                        profileId={profileId}
                        onAnswered={(id) => handleQuestionAnswered(theme, id)}
                      />
                    ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Footer with tip */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/30">
        <p className="text-[10px] text-slate-500 text-center">
          💡 Click a question to answer inline. Your response helps build the life story.
        </p>
      </div>
    </div>
  );
};

export default NeuralSidebar;
