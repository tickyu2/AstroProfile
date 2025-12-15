/**
 * ThreadView.jsx
 * Constitutional Thread Conversation View
 *
 * Displays messages within a specific energy thread.
 * Styled according to thread's constitutional energy type.
 * Now includes action buttons (copy, KB, branch) on message hover.
 *
 * Part of GENESIS Constitutional Threading Architecture
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useRef, useEffect, useState } from 'react';
import { THREAD_TYPES } from '../../hooks/useThreading';
import { ThreadBranchButton } from './ThreadBranchButton';
import { EmojiReactionPicker, ReactionDisplay } from '../aiSoulPartner/EmojiReactionPicker';

/**
 * ThreadView Component
 *
 * @param {Object} props
 * @param {Object} props.thread - Current thread data
 * @param {Array} props.messages - Messages in this thread
 * @param {Function} props.onReturnToMain - Callback to return to main conversation
 * @param {Object} props.userProfile - User's profile for display
 * @param {Function} props.onCreateThread - Callback to create a new thread (for sub-branching)
 * @param {Function} props.onSaveToKB - Callback to save message to Knowledge Base
 * @param {Function} props.onReact - Callback to toggle emoji reaction (messageId, emoji)
 * @param {string} props.currentMode - Current AI response mode
 */
export function ThreadView({
  thread,
  messages = [],
  onReturnToMain,
  userProfile,
  onCreateThread,
  onSaveToKB,
  onReact,
  currentMode = 'DIALOGUE'
}) {
  const messagesEndRef = useRef(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Get thread type config
  const typeConfig = thread?.threadType ? THREAD_TYPES[thread.threadType] : THREAD_TYPES.wood_growth;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Copy message to clipboard
  const handleCopy = async (msg) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopiedMessageId(msg.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle saving to KB
  const handleSaveToKB = (msg) => {
    if (onSaveToKB) {
      onSaveToKB(msg);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header with Energy Styling */}
      <div className={`
        px-4 py-3 border-b border-white/10
        bg-gradient-to-r ${typeConfig.bgGradient}
      `}>
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={onReturnToMain}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Return to main conversation"
          >
            <span className="text-lg">←</span>
          </button>

          {/* Thread Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeConfig.emoji}</span>
              <h2 className={`font-bold ${typeConfig.textColor} truncate`}>
                {thread?.title || 'Thread'}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs ${typeConfig.accentColor}`}>
                {typeConfig.name}
              </span>
              <span className="text-xs text-white/30">•</span>
              <span className="text-xs text-white/50">
                {messages.length} messages
              </span>
              {thread?.constitutionalContext?.userMode && (
                <>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-xs text-white/50">
                    {thread.constitutionalContext.userMode} mode
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Constitutional Confidence */}
          {thread?.constitutionalContext?.confidence && (
            <div className="text-right">
              <div className="text-xs text-white/50">AI Detected</div>
              <div className={`text-sm font-bold ${typeConfig.textColor}`}>
                {thread.constitutionalContext.confidence}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">{typeConfig.emoji}</div>
            <h3 className={`text-lg font-bold ${typeConfig.textColor} mb-2`}>
              Start the {typeConfig.name} Thread
            </h3>
            <p className="text-sm text-white/50 max-w-md mx-auto">
              {typeConfig.description}
            </p>
            <p className="text-xs text-white/30 mt-4">
              Continue the conversation with this energy focus
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group relative`}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-3 relative
                ${msg.isBranchOrigin
                  ? `bg-gradient-to-r ${typeConfig.bgGradient} border-2 ${typeConfig.borderColor}`
                  : msg.sender === 'user'
                    ? `bg-gradient-to-r ${typeConfig.gradient} text-white`
                    : 'bg-slate-800/80 border border-white/10 text-white/90'
                }
              `}>
                {/* Branch Origin Badge */}
                {msg.isBranchOrigin && (
                  <div className={`absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r ${typeConfig.gradient} text-white shadow-lg`}>
                    🌿 Branch Origin
                  </div>
                )}

                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-1 ${msg.isBranchOrigin ? 'mt-2' : ''}`}>
                  {msg.sender === 'ai' && (
                    <span className="text-sm">{typeConfig.emoji}</span>
                  )}
                  <span className="text-xs text-white/50">
                    {msg.sender === 'user'
                      ? userProfile?.displayName || 'You'
                      : 'AI SoulPartner'
                    }
                  </span>
                  <span className="text-xs text-white/30">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* Message Content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Emoji Reactions Display */}
                {onReact && !msg.isBranchOrigin && (
                  <ReactionDisplay
                    reactions={msg.reactions || {}}
                    currentUserId={userProfile?.userId}
                    onReact={(emoji) => onReact(msg.id, emoji)}
                  />
                )}

                {/* Mode indicator for AI messages */}
                {msg.sender === 'ai' && msg.mode && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className={`
                      text-[10px] px-2 py-0.5 rounded-full bg-white/10
                      ${msg.mode === 'WITNESS' ? 'text-purple-300' :
                        msg.mode === 'DIALOGUE' ? 'text-blue-300' :
                        'text-amber-300'
                      }
                    `}>
                      {msg.mode === 'WITNESS' ? '🎭' : msg.mode === 'DIALOGUE' ? '💬' : '🎯'}
                      {msg.mode}
                    </span>
                  </div>
                )}

                {/* Action Buttons - appear on hover */}
                {hoveredMessageId === msg.id && (
                  <div className={`
                    absolute ${msg.sender === 'user' ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'}
                    top-1/2 -translate-y-1/2 flex items-center gap-1
                    animate-fadeIn
                  `}>
                    <div className="flex items-center gap-1 bg-slate-800/95 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20 shadow-xl">
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(msg)}
                        className={`p-1.5 rounded transition-colors ${
                          copiedMessageId === msg.id
                            ? 'bg-green-500/20 text-green-400'
                            : 'hover:bg-white/10 text-white/60 hover:text-white'
                        }`}
                        title={copiedMessageId === msg.id ? 'Copied!' : 'Copy message'}
                      >
                        {copiedMessageId === msg.id ? '✓' : '📋'}
                      </button>

                      {/* Save to KB Button */}
                      {onSaveToKB && (
                        <button
                          onClick={() => handleSaveToKB(msg)}
                          className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-amber-400 transition-colors"
                          title="Save to Knowledge Base"
                        >
                          📚
                        </button>
                      )}

                      {/* Branch Button - only for AI messages or long user messages */}
                      {onCreateThread && (msg.sender === 'ai' || msg.text.length > 50) && !msg.isBranchOrigin && (
                        <ThreadBranchButton
                          message={msg}
                          onCreateThread={onCreateThread}
                          userMode={currentMode}
                        />
                      )}

                      {/* Emoji Reaction Picker */}
                      {onReact && !msg.isBranchOrigin && (
                        <EmojiReactionPicker
                          reactions={msg.reactions || {}}
                          currentUserId={userProfile?.userId}
                          onReact={(emoji) => onReact(msg.id, emoji)}
                          threadType={thread?.threadType}
                          compact={true}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Thread Energy Footer */}
      <div className={`
        px-4 py-2 border-t border-white/10
        bg-gradient-to-r ${typeConfig.bgGradient}
      `}>
        <div className="flex items-center justify-center gap-2">
          <span>{typeConfig.emoji}</span>
          <span className={`text-xs ${typeConfig.textColor}`}>
            {typeConfig.name} Thread
          </span>
          <span className="text-xs text-white/30">•</span>
          <span className="text-xs text-white/40">
            {typeConfig.description}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ThreadView;
