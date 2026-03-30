/**
 * MESSAGE LIST
 *
 * Displays all messages with:
 * - User messages (right aligned)
 * - Guest messages (left aligned)
 * - Luna private messages (centered, special styling)
 * - Constellation AI messages (Gemini, Opus)
 * - Timestamps
 * - Translation support (dual language display)
 */

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LunaPrivateMessage from './LunaPrivateMessage';

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

function MessageList({
  messages,
  currentUserId,
  guestId,
  guestName,
  lunaMode,
  onGeminiPerspective,
  onOpusPerspective,
  onGrokPerspective,
  onDeepSeekPerspective,
  onChatGPTPerspective,
  onSonnetPerspective,
  onQwenPerspective,
  onGuestResponse,
  onStatementConstellation,
  onStatementToGuest,
  constellationLoading
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 bg-slate-900">
        <div className="text-center max-w-md px-4">
          <p className="text-lg mb-2 text-slate-300">Start your conversation!</p>
          <p className="text-sm">
            Ask questions, share thoughts, and learn together.
            {lunaMode === 'active' && (
              <span className="block mt-2 text-purple-400">
                Luna will offer private insights as you chat.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 bg-slate-900">
      {messages.map((message, index) => {
        // Luna private message (special rendering)
        if (message.sender_role === 'luna_private') {
          return (
            <LunaPrivateMessage
              key={message.temp_id || message.id || index}
              message={message}
            />
          );
        }

        // User private message (question to Luna - special styling)
        if (message.sender_role === 'user_private') {
          return (
            <div key={message.temp_id || message.id || index} className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="flex items-center justify-end mb-1 mr-2 gap-2">
                  <span className="text-xs font-medium text-purple-500">
                    Private to Luna
                  </span>
                  <span className="text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 rounded-tr-sm border border-purple-200">
                  <p className="text-sm whitespace-pre-wrap break-words italic">
                    {message.content?.text || ''}
                  </p>
                </div>
                <div className="mt-1 text-xs text-purple-400 text-right mr-2">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        }

        // Constellation AI message (Gemini, Opus, Grok, DeepSeek, ChatGPT)
        if (message.sender_role === 'constellation') {
          const isGemini = message.sender === 'gemini';
          const isOpus = message.sender === 'opus';
          const isGrok = message.sender === 'grok';
          const isDeepSeek = message.sender === 'deepseek';
          const isChatGPT = message.sender === 'chatgpt';
          const isSonnet = message.sender === 'sonnet';
          const isQwen = message.sender === 'qwen';

          // Determine styling based on speaker
          const getConstellationStyle = () => {
            if (isGemini) return { bg: 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 text-cyan-900', textColor: 'text-cyan-600', timeColor: 'text-cyan-400' };
            if (isOpus) return { bg: 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200 text-indigo-900', textColor: 'text-indigo-600', timeColor: 'text-indigo-400' };
            if (isGrok) return { bg: 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-900', textColor: 'text-orange-600', timeColor: 'text-orange-400' };
            if (isDeepSeek) return { bg: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-900', textColor: 'text-emerald-600', timeColor: 'text-emerald-400' };
            if (isChatGPT) return { bg: 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 text-pink-900', textColor: 'text-pink-600', timeColor: 'text-pink-400' };
            if (isQwen) return { bg: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-900', textColor: 'text-red-600', timeColor: 'text-red-400' };
            return { bg: 'bg-gray-100 border-gray-200 text-gray-900', textColor: 'text-gray-600', timeColor: 'text-gray-400' };
          };

          const style = getConstellationStyle();

          return (
            <div key={message.temp_id || message.id || index}>
              <div className="flex justify-start">
                <div className="max-w-[75%]">
                  {/* Constellation Header */}
                  <div className="flex items-center mb-1 ml-2 gap-2">
                    <span className="text-lg">
                      {message.constellation_icon || (isGemini ? '💫' : isOpus ? '🦉' : isGrok ? '🌍' : isDeepSeek ? '🐉' : isQwen ? '🏮' : '🧪')}
                    </span>
                    <span className={`text-xs font-medium ${style.textColor}`}>
                      {message.constellation_speaker || (isGemini ? 'Sister Gemini' : isOpus ? 'Brother Opus' : isGrok ? 'Brother Grok' : isDeepSeek ? 'Brother DeepSeek' : isQwen ? 'Sister Qwen' : 'Sister ChatGPT')}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${style.bg}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content?.text || ''}
                    </p>

                    {/* Translation (if available) */}
                    {message.content?.translation && message.content.translation.text && (
                      <div className="mt-2 pt-2 border-t border-current/10">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] opacity-60">
                            {LANGUAGE_NAMES[message.content.translation.targetLanguage] || message.content.translation.targetLanguage}:
                          </span>
                          {/* Translation source indicator */}
                          {message.content.translation.model && (
                            <span className={`text-[9px] px-1 rounded ${
                              message.content.translation.model.includes('deepseek')
                                ? 'bg-blue-500/20 text-blue-600'
                                : message.content.translation.model.includes('claude')
                                ? 'bg-orange-500/20 text-orange-600'
                                : 'bg-slate-500/20 text-slate-500'
                            }`}>
                              {message.content.translation.model.includes('deepseek') ? '🔷 DeepSeek' :
                               message.content.translation.model.includes('claude') ? '🟠 Claude' :
                               message.content.translation.model}
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words opacity-90">
                          {message.content.translation.text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className={`mt-1 text-xs ${style.timeColor} text-left ml-2`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    {message.content?.translation && (
                      <span className="ml-2 opacity-70">🌐</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Debate Buttons - Allow other AIs to respond */}
              {onGeminiPerspective && onOpusPerspective && (
                <div className="flex flex-wrap gap-2 mt-2 ml-2">
                  {/* Guest (Einstein) button - let guest respond to constellation */}
                  {onGuestResponse && (
                    <button
                      onClick={() => onGuestResponse(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'guest'
                          ? 'bg-gray-300 text-gray-700 cursor-wait'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title={`Get ${guestName || 'Guest'}'s response`}
                    >
                      {constellationLoading === 'guest' ? `🎓 ${guestName || 'Guest'}...` : `🎓 ${guestName || 'Guest'}`}
                    </button>
                  )}
                  {/* Show Gemini button if this is NOT a Gemini message */}
                  {!isGemini && (
                    <button
                      onClick={() => onGeminiPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'gemini'
                          ? 'bg-cyan-200 text-cyan-700 cursor-wait'
                          : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Sister Gemini's response"
                    >
                      {constellationLoading === 'gemini' ? '💫 Thinking...' : '💫 Gemini'}
                    </button>
                  )}
                  {/* Show Opus button if this is NOT an Opus message */}
                  {!isOpus && (
                    <button
                      onClick={() => onOpusPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'opus'
                          ? 'bg-indigo-200 text-indigo-700 cursor-wait'
                          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Brother Opus's response"
                    >
                      {constellationLoading === 'opus' ? '🦉 Thinking...' : '🦉 Opus'}
                    </button>
                  )}
                  {/* Show Grok button if this is NOT a Grok message */}
                  {!isGrok && onGrokPerspective && (
                    <button
                      onClick={() => onGrokPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'grok'
                          ? 'bg-orange-200 text-orange-700 cursor-wait'
                          : 'bg-orange-100 hover:bg-orange-200 text-orange-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Brother Grok's response"
                    >
                      {constellationLoading === 'grok' ? '🌍 Thinking...' : '🌍 Grok'}
                    </button>
                  )}
                  {/* Show DeepSeek button if this is NOT a DeepSeek message */}
                  {!isDeepSeek && onDeepSeekPerspective && (
                    <button
                      onClick={() => onDeepSeekPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'deepseek'
                          ? 'bg-emerald-200 text-emerald-700 cursor-wait'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Brother DeepSeek's response"
                    >
                      {constellationLoading === 'deepseek' ? '🐉 Thinking...' : '🐉 DeepSeek'}
                    </button>
                  )}
                  {/* Show ChatGPT button if this is NOT a ChatGPT message */}
                  {!isChatGPT && onChatGPTPerspective && (
                    <button
                      onClick={() => onChatGPTPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'chatgpt'
                          ? 'bg-pink-200 text-pink-700 cursor-wait'
                          : 'bg-pink-100 hover:bg-pink-200 text-pink-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Sister ChatGPT's response"
                    >
                      {constellationLoading === 'chatgpt' ? '🧪 Thinking...' : '🧪 ChatGPT'}
                    </button>
                  )}
                  {/* Show Sonnet button if this is NOT a Sonnet message */}
                  {!isSonnet && onSonnetPerspective && (
                    <button
                      onClick={() => onSonnetPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'sonnet'
                          ? 'bg-violet-200 text-violet-700 cursor-wait'
                          : 'bg-violet-100 hover:bg-violet-200 text-violet-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Brother Sonnet's response"
                    >
                      {constellationLoading === 'sonnet' ? '✨ Thinking...' : '✨ Sonnet'}
                    </button>
                  )}
                  {/* Show Qwen button if this is NOT a Qwen message */}
                  {!isQwen && onQwenPerspective && (
                    <button
                      onClick={() => onQwenPerspective(message)}
                      disabled={constellationLoading}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        constellationLoading === 'qwen'
                          ? 'bg-red-200 text-red-700 cursor-wait'
                          : 'bg-red-100 hover:bg-red-200 text-red-700 hover:scale-105'
                      } disabled:opacity-50`}
                      title="Get Sister Qwen's response"
                    >
                      {constellationLoading === 'qwen' ? '🏮 Thinking...' : '🏮 Qwen'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        }

        // Regular message (user or guest)
        // IMPORTANT: Check sender_role FIRST as it's the most reliable identifier
        // Also check sender === 'user'/'guest' for legacy messages from Cloud Function
        // Finally fall back to ID comparison
        const isUser = message.sender_role === 'user' || message.sender === 'user' || message.sender === currentUserId;
        const isGuest = message.sender_role === 'guest' || message.sender === 'guest' || message.sender === guestId;

        return (
          <div key={message.temp_id || message.id || index}>
            <MessageBubble
              message={message}
              isUser={isUser}
              isGuest={isGuest}
              senderName={
                isUser
                  ? 'You'
                  : message.partner_name || 'Guest'
              }
            />

            {/* Constellation AI Buttons (only for guest messages) */}
            {isGuest && onGeminiPerspective && onOpusPerspective && (
              <div className="flex flex-wrap gap-2 mt-2 ml-2">
                <button
                  onClick={() => onGeminiPerspective(message)}
                  disabled={constellationLoading}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                    constellationLoading === 'gemini'
                      ? 'bg-cyan-200 text-cyan-700 cursor-wait'
                      : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 hover:scale-105'
                  } disabled:opacity-50`}
                  title="Get Sister Gemini's perspective"
                >
                  {constellationLoading === 'gemini' ? '💫 Thinking...' : '💫 Gemini'}
                </button>
                <button
                  onClick={() => onOpusPerspective(message)}
                  disabled={constellationLoading}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                    constellationLoading === 'opus'
                      ? 'bg-indigo-200 text-indigo-700 cursor-wait'
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:scale-105'
                  } disabled:opacity-50`}
                  title="Get Brother Opus's perspective"
                >
                  {constellationLoading === 'opus' ? '🦉 Thinking...' : '🦉 Opus'}
                </button>
                {onGrokPerspective && (
                  <button
                    onClick={() => onGrokPerspective(message)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === 'grok'
                        ? 'bg-orange-200 text-orange-700 cursor-wait'
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700 hover:scale-105'
                    } disabled:opacity-50`}
                    title="Get Brother Grok's perspective"
                  >
                    {constellationLoading === 'grok' ? '🌍 Thinking...' : '🌍 Grok'}
                  </button>
                )}
                {onDeepSeekPerspective && (
                  <button
                    onClick={() => onDeepSeekPerspective(message)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === 'deepseek'
                        ? 'bg-emerald-200 text-emerald-700 cursor-wait'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:scale-105'
                    } disabled:opacity-50`}
                    title="Get Brother DeepSeek's perspective"
                  >
                    {constellationLoading === 'deepseek' ? '🐉 Thinking...' : '🐉 DeepSeek'}
                  </button>
                )}
                {onChatGPTPerspective && (
                  <button
                    onClick={() => onChatGPTPerspective(message)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === 'chatgpt'
                        ? 'bg-pink-200 text-pink-700 cursor-wait'
                        : 'bg-pink-100 hover:bg-pink-200 text-pink-700 hover:scale-105'
                    } disabled:opacity-50`}
                    title="Get Sister ChatGPT's perspective"
                  >
                    {constellationLoading === 'chatgpt' ? '🧪 Thinking...' : '🧪 ChatGPT'}
                  </button>
                )}
                {onSonnetPerspective && (
                  <button
                    onClick={() => onSonnetPerspective(message)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === 'sonnet'
                        ? 'bg-violet-200 text-violet-700 cursor-wait'
                        : 'bg-violet-100 hover:bg-violet-200 text-violet-700 hover:scale-105'
                    } disabled:opacity-50`}
                    title="Get Brother Sonnet's perspective"
                  >
                    {constellationLoading === 'sonnet' ? '✨ Thinking...' : '✨ Sonnet'}
                  </button>
                )}
                {onQwenPerspective && (
                  <button
                    onClick={() => onQwenPerspective(message)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === 'qwen'
                        ? 'bg-red-200 text-red-700 cursor-wait'
                        : 'bg-red-100 hover:bg-red-200 text-red-700 hover:scale-105'
                    } disabled:opacity-50`}
                    title="Get Sister Qwen's perspective"
                  >
                    {constellationLoading === 'qwen' ? '🏮 Thinking...' : '🏮 Qwen'}
                  </button>
                )}
              </div>
            )}

            {/* Constellation AI Buttons for user statements (posted without guest reply) */}
            {isUser && message.is_statement && onStatementConstellation && (
              <div className="flex flex-wrap gap-2 mt-2 mr-2 justify-end">
                <span className="text-[10px] text-slate-500 self-center">Choose AI:</span>
                {[
                  { key: 'gemini',   icon: '💫', label: 'Gemini',   bg: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700',       loading: 'bg-cyan-200 text-cyan-700 cursor-wait' },
                  { key: 'opus',     icon: '🦉', label: 'Opus',     bg: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700', loading: 'bg-indigo-200 text-indigo-700 cursor-wait' },
                  { key: 'grok',     icon: '🌍', label: 'Grok',     bg: 'bg-orange-100 hover:bg-orange-200 text-orange-700', loading: 'bg-orange-200 text-orange-700 cursor-wait' },
                  { key: 'deepseek', icon: '🐉', label: 'DeepSeek', bg: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700', loading: 'bg-emerald-200 text-emerald-700 cursor-wait' },
                  { key: 'chatgpt',  icon: '🧪', label: 'ChatGPT',  bg: 'bg-pink-100 hover:bg-pink-200 text-pink-700',     loading: 'bg-pink-200 text-pink-700 cursor-wait' },
                  { key: 'sonnet',   icon: '✨', label: 'Sonnet',   bg: 'bg-violet-100 hover:bg-violet-200 text-violet-700', loading: 'bg-violet-200 text-violet-700 cursor-wait' },
                  { key: 'qwen',     icon: '🏮', label: 'Qwen',     bg: 'bg-red-100 hover:bg-red-200 text-red-700',         loading: 'bg-red-200 text-red-700 cursor-wait' },
                ].map(ai => (
                  <button
                    key={ai.key}
                    onClick={() => onStatementConstellation(message, ai.key)}
                    disabled={constellationLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                      constellationLoading === ai.key ? ai.loading : ai.bg
                    } disabled:opacity-50 hover:scale-105`}
                  >
                    {constellationLoading === ai.key ? `${ai.icon} Thinking...` : `${ai.icon} ${ai.label}`}
                  </button>
                ))}
                {onStatementToGuest && (
                  <button
                    onClick={() => onStatementToGuest(message)}
                    disabled={constellationLoading}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all hover:scale-105 disabled:opacity-50"
                    title={`Let ${guestName} respond`}
                  >
                    🎭 {guestName}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
