/**
 * CHAT HEADER
 *
 * Displays:
 * - Guest name and type
 * - Luna mode status (Silent or Active)
 * - Constitutional context indicator
 * - Learned facts count
 * - Selected user profile info (for personalization)
 */

import React from 'react';
import { Link } from 'react-router-dom';

function ChatHeader({
  guestName,
  guestType,
  lunaMode,
  onToggleLuna,
  equationMode,
  onToggleEquationMode,
  hasConstitutionalData,
  learnedFactsCount,
  selectedUserProfile
}) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Back + Guest Info */}
          <div className="flex items-center space-x-3">
            {/* Back to Dashboard */}
            <Link
              to="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>

            {/* Guest Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {guestName.charAt(0)}
            </div>

            {/* Guest Name & Status */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {guestName}
              </h1>
              <p className="text-xs text-gray-500 flex items-center flex-wrap gap-1">
                <span>{guestType === 'historical_figure' ? 'Historical Figure' : guestType}</span>
                {hasConstitutionalData && (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Personalized
                  </span>
                )}
                {learnedFactsCount > 0 && (
                  <span className="text-blue-600">
                    • {learnedFactsCount} facts
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right: Mode Toggles */}
          <div className="flex items-center gap-2">
            {/* Equation Mode Toggle — only show for guests that support it */}
            {onToggleEquationMode && (
              <button
                onClick={onToggleEquationMode}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm
                  ${equationMode
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title={equationMode ? 'Equation Mode active — guest will prioritize mathematical output' : 'Enable Equation Mode for formula-heavy responses'}
              >
                <span className="text-base">{equationMode ? '📐' : '📝'}</span>
                {equationMode ? 'Equations' : 'Normal'}
              </button>
            )}

            {/* Luna Toggle */}
            <button
              onClick={onToggleLuna}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${lunaMode === 'active'
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full ${lunaMode === 'active' ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'}`} />
              Luna: {lunaMode === 'active' ? 'Active' : 'Silent'}
            </button>
          </div>
        </div>

        {/* Luna Mode Explanation */}
        {lunaMode === 'active' && (
          <div className="mt-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded">
            Luna is watching and will offer private coaching (only you can see it)
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
