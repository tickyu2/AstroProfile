/**
 * QuestionCard.jsx
 * Question Container for Constitutional Assessment
 *
 * Beautiful card wrapper for each assessment question
 * with number indicator, title, subtitle, and animated content.
 *
 * Part of GENESIS - Constitutional Assessment System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React from 'react';

/**
 * QuestionCard Component
 *
 * @param {Object} props
 * @param {number} props.number - Question number (1-5)
 * @param {string} props.title - Question title
 * @param {string} props.subtitle - Question subtitle/prompt
 * @param {number} props.totalQuestions - Total number of questions
 * @param {React.ReactNode} props.children - Option components
 */
export function QuestionCard({
  number,
  title,
  subtitle,
  totalQuestions = 5,
  children
}) {
  // Progress percentage
  const progress = (number / totalQuestions) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">
            Question {number} of {totalQuestions}
          </span>
          <span className="text-sm text-amber-400 font-medium">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10">
          {/* Question Number Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full mb-4">
            <span className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
              {number}
            </span>
            <span className="text-sm text-amber-400 font-medium">
              {title}
            </span>
          </div>

          {/* Question Prompt */}
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {subtitle}
          </h2>
        </div>

        {/* Options Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer Hint */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-center text-sm text-white/40">
            Choose the response that feels most naturally YOU - not what you think is "correct"
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
