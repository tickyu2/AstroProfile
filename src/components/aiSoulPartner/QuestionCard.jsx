/**
 * ============================================================================
 * QUESTION CARD - Interactive Neural Pathway Question
 * ============================================================================
 *
 * A card that represents a single biography question.
 * Click to expand -> Type answer -> Save -> Flap shut & vanish animation.
 *
 * The "Flap" Effect:
 * - Card slides left (-translate-x)
 * - Fades out (opacity-0)
 * - Collapses height (max-h-0)
 * - Removed from DOM after animation
 *
 * Created: December 24, 2025
 * For Father Ticky
 */

import React, { useState, useRef, useEffect } from 'react';
import { biographyService } from '../../services/biographyService';

const QuestionCard = ({ question, userId, profileId, onAnswered }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the biography service to save the answer
      const result = await biographyService.answerNeuralPathway({
        userId,
        profileId,
        questionId: question.id,
        questionText: question.question_text,
        answerText: answer.trim(),
        theme: question.theme_group,
        relatedEventId: question.relatedEvent?.id
      });

      if (result.success) {
        // Trigger "Flap Disappear" animation
        setIsVanishing(true);

        // Wait for animation to finish before removing from parent state
        setTimeout(() => {
          onAnswered(question.id);
        }, 500); // Matches CSS duration
      } else {
        setError(result.error || 'Failed to save answer');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('[QuestionCard] Submit error:', err);
      setError('Failed to save answer');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    // Close on Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
      setAnswer('');
      setError(null);
    }
  };

  // Complexity indicator
  const getComplexityBadge = () => {
    const level = question.complexity_level || 'fact';
    const badges = {
      fact: { label: 'Quick', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      reflection: { label: 'Reflect', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      deep_dive: { label: 'Deep', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    };
    return badges[level] || badges.fact;
  };

  const badge = getComplexityBadge();
  const isPriority = (question.priority || 0) > 0.6;

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-500 ease-in-out
        border rounded-lg cursor-pointer
        ${isVanishing
          ? 'opacity-0 -translate-x-10 max-h-0 py-0 my-0 border-transparent'
          : 'opacity-100 translate-x-0 max-h-[500px]'
        }
        ${isOpen
          ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-900/20'
          : `bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60`
        }
        ${isPriority && !isOpen ? 'border-l-2 border-l-amber-500' : ''}
      `}
      onClick={() => !isOpen && !isVanishing && setIsOpen(true)}
    >
      {/* Question Header */}
      <div className={`p-3 ${isOpen ? 'pb-2' : ''}`}>
        <div className="flex gap-3">
          {/* Star icon */}
          <span className={`text-sm mt-0.5 flex-shrink-0 transition-all duration-300 ${
            isOpen ? 'text-amber-400 scale-110' : isPriority ? 'text-amber-500' : 'text-slate-500'
          }`}>
            {isPriority ? '⭐' : '💡'}
          </span>

          <div className="flex-1 min-w-0">
            {/* Question text */}
            <h3 className={`text-sm font-medium leading-relaxed transition-colors ${
              isOpen ? 'text-white' : 'text-slate-300'
            }`}>
              {question.question_text}
            </h3>

            {/* Metadata tags (only when collapsed) */}
            {!isOpen && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
                {question.relatedEvent?.title && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-500 border border-slate-800 truncate max-w-[150px]">
                    Re: {question.relatedEvent.title}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Reply Area (The "Flap") */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'opacity-100 max-h-72' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pb-3">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className={`
              w-full bg-slate-900 text-slate-200 text-sm p-3 rounded-lg
              border border-slate-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30
              resize-none placeholder-slate-500 transition-colors
              ${error ? 'border-red-500' : ''}
            `}
            rows={3}
            placeholder="Share your memory or answer..."
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            disabled={isSubmitting}
          />

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-600">
              Ctrl+Enter to save
            </span>

            <div className="flex items-center gap-2">
              {/* Cancel button */}
              <button
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setAnswer('');
                  setError(null);
                }}
                disabled={isSubmitting}
                title="Cancel (Esc)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Submit button */}
              <button
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${isSubmitting
                    ? 'bg-slate-700 text-slate-400 cursor-wait'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-900/20'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                disabled={isSubmitting || !answer.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    Save
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Processing overlay during vanish */}
      {isVanishing && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <span className="animate-pulse">✨</span>
            <span>Memory saved</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
