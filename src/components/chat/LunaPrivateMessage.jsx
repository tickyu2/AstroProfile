/**
 * LUNA PRIVATE MESSAGE
 *
 * Special styling for Luna's private coaching:
 * - Centered in conversation
 * - Purple/lavender styling
 * - Whisper icon
 * - "Private coaching" label
 * - Einstein cannot see these
 * - Translation support (dual language display)
 */

import React from 'react';

// Language display names for translation
const LANGUAGE_NAMES = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt'
};

function LunaPrivateMessage({ message }) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Coaching type labels
  const coachingLabels = {
    constitutional_observation: 'Constitutional Insight',
    relationship_insight: 'Relationship Insight',
    emotional_support: 'Emotional Support',
    teaching_tip: 'Teaching Tip',
    pattern_recognition: 'Pattern Recognition'
  };

  const label = coachingLabels[message.coaching_type] || 'Private Coaching';
  const translation = message.content?.translation;
  const hasTranslation = translation && translation.text && translation.text !== message.content?.text;

  return (
    <div className="flex justify-center my-6">
      <div className="max-w-[85%] w-full">
        {/* Private label */}
        <div className="flex items-center justify-center mb-2">
          <div className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
            Private Coaching (only you can see this)
          </div>
        </div>

        {/* Luna message bubble */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            {/* Luna icon */}
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
              L
            </div>

            {/* Message content */}
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="font-semibold text-purple-700 text-sm">Luna</span>
                <span className="ml-2 text-xs text-purple-500">{label}</span>
              </div>

              {/* Original text */}
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {message.content?.text || ''}
              </p>

              {/* Translation (if available) */}
              {hasTranslation && (
                <div className="mt-2 pt-2 border-t border-purple-200/50">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] text-purple-500">
                      {LANGUAGE_NAMES[translation.targetLanguage] || translation.targetLanguage}:
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {translation.text}
                  </p>
                </div>
              )}

              <div className="mt-2 text-xs text-purple-400">
                {timestamp}
                {hasTranslation && (
                  <span className="ml-2">🌐</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LunaPrivateMessage;
