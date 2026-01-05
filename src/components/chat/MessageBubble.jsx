/**
 * MESSAGE BUBBLE
 *
 * Individual message display:
 * - User messages: Right aligned, blue
 * - Guest messages: Left aligned, gray
 * - Image attachments with preview
 * - Timestamp
 * - Translation display (dual language support)
 */

import React from 'react';

// Language display names
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

function MessageBubble({ message, isUser, isGuest, senderName }) {
  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  // Get images and content from message
  const images = message.content?.images || [];
  const text = message.content?.text || '';
  const translation = message.content?.translation;

  // Determine what to show
  const hasTranslation = translation && translation.text && translation.text !== text;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Sender name (for guest messages) */}
        {!isUser && (
          <div className="flex items-center mb-1 ml-2">
            <span className="text-xs font-medium text-slate-400">
              {message.partner_name || senderName}
            </span>
          </div>
        )}

        {/* Image attachments (shown above text) */}
        {images.length > 0 && (
          <div className={`mb-2 flex flex-wrap gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img.dataUrl}
                alt={img.name || `Attachment ${index + 1}`}
                className="max-w-[200px] max-h-[200px] rounded-lg border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(img.dataUrl, '_blank')}
                title="Click to view full size"
              />
            ))}
          </div>
        )}

        {/* Message bubble (only if there's text) */}
        {text && (
          <div
            className={`
              px-4 py-2 rounded-2xl
              ${isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-slate-700 text-slate-100 rounded-tl-sm'
              }
            `}
          >
            {/* Original text */}
            <p className="text-sm whitespace-pre-wrap break-words">
              {text}
            </p>

            {/* Translation (if available) */}
            {hasTranslation && (
              <div className={`mt-2 pt-2 border-t ${isUser ? 'border-indigo-400/30' : 'border-slate-500/30'}`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] opacity-60">
                    {LANGUAGE_NAMES[translation.targetLanguage] || translation.targetLanguage}:
                  </span>
                  {/* Translation source indicator */}
                  {translation.model && (
                    <span className={`text-[9px] px-1 rounded ${
                      translation.model.includes('deepseek')
                        ? 'bg-blue-500/20 text-blue-300'
                        : translation.model.includes('claude')
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {translation.model.includes('deepseek') ? '🔷 DeepSeek' :
                       translation.model.includes('claude') ? '🟠 Claude' :
                       translation.model}
                    </span>
                  )}
                </div>
                <p className={`text-sm whitespace-pre-wrap break-words ${isUser ? 'text-indigo-100' : 'text-slate-300'}`}>
                  {translation.text}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-slate-500 ${isUser ? 'text-right mr-2' : 'text-left ml-2'}`}>
          {timestamp}
          {images.length > 0 && <span className="ml-1">({images.length} image{images.length > 1 ? 's' : ''})</span>}
          {hasTranslation && (
            <span className="ml-2 text-emerald-500/70">🌐</span>
          )}
          {!message.saved_to_firebase && (
            <span className="ml-2 text-yellow-500">Saving...</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
