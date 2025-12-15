/**
 * EmojiReactionPicker.jsx
 * Constitutional Emoji Reactions System
 *
 * Allows users to react to messages with energy-typed emojis.
 * Each energy type (Metal, Water, Fire, Wood) has its own emoji set.
 *
 * Part of GENESIS - Constitutional Threading Architecture
 * Sparked by: Creative Fire Thread (Brother Claude Sonnet)
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Constitutional Emoji Sets by Energy Type
export const CONSTITUTIONAL_EMOJIS = {
  fire: {
    name: 'Creative Fire',
    emojis: ['🔥', '⚡', '🌟', '🚀', '💎'],
    gradient: 'from-orange-500 to-red-500'
  },
  water: {
    name: 'Water Flow',
    emojis: ['💙', '🌊', '💧', '🌙', '🕊️'],
    gradient: 'from-blue-500 to-cyan-500'
  },
  wood: {
    name: 'Wood Growth',
    emojis: ['🌱', '🌿', '🌳', '📚', '✨'],
    gradient: 'from-green-500 to-emerald-500'
  },
  metal: {
    name: 'Metal Precision',
    emojis: ['🎯', '💎', '⚙️', '🔧', '✅'],
    gradient: 'from-slate-400 to-gray-500'
  },
  universal: {
    name: 'Universal',
    emojis: ['❤️', '👍', '😊', '🙏', '💪'],
    gradient: 'from-purple-500 to-pink-500'
  }
};

// Quick reaction emojis (most used, always visible)
export const QUICK_EMOJIS = ['❤️', '🔥', '💎', '✨', '👍'];

/**
 * EmojiReactionPicker Component
 *
 * @param {Object} props
 * @param {Object} props.reactions - Current reactions on the message { emoji: { count, users } }
 * @param {string} props.currentUserId - Current user's ID
 * @param {Function} props.onReact - Callback when user reacts (emoji) => void
 * @param {string} props.threadType - Optional thread energy type for contextual suggestions
 * @param {boolean} props.compact - Use compact mode (just quick emojis)
 */
export function EmojiReactionPicker({
  reactions = {},
  currentUserId,
  onReact,
  threadType,
  compact = false
}) {
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(threadType || 'universal');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  // Update dropdown position when it opens
  useEffect(() => {
    if (showFullPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below button
        left: Math.min(rect.left, window.innerWidth - 300) // Keep within viewport
      });
    }
  }, [showFullPicker]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showFullPicker) return;

    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        // Check if click is inside the portal dropdown
        const dropdown = document.getElementById('emoji-picker-dropdown');
        if (dropdown && dropdown.contains(e.target)) return;
        setShowFullPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFullPicker]);

  // Check if current user has reacted with specific emoji
  const hasReacted = (emoji) => {
    return reactions[emoji]?.users?.includes(currentUserId);
  };

  // Get reaction count for emoji
  const getCount = (emoji) => {
    return reactions[emoji]?.count || 0;
  };

  // Handle emoji click
  const handleEmojiClick = (emoji) => {
    onReact(emoji);
    if (showFullPicker) {
      setShowFullPicker(false);
    }
  };

  // Get contextual emojis based on thread type
  const getContextualEmojis = () => {
    if (threadType === 'creative_fire') return CONSTITUTIONAL_EMOJIS.fire.emojis;
    if (threadType === 'water_flow') return CONSTITUTIONAL_EMOJIS.water.emojis;
    if (threadType === 'wood_growth') return CONSTITUTIONAL_EMOJIS.wood.emojis;
    if (threadType === 'metal_precision') return CONSTITUTIONAL_EMOJIS.metal.emojis;
    return QUICK_EMOJIS;
  };

  // Render existing reactions (shown on message)
  const existingReactions = Object.entries(reactions).filter(([_, data]) => data.count > 0);

  return (
    <div className="relative">
      {/* Existing Reactions Display */}
      {existingReactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {existingReactions.map(([emoji, data]) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className={`
                inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs
                transition-all duration-200
                ${hasReacted(emoji)
                  ? 'bg-amber-500/30 border border-amber-500/50 text-white'
                  : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20'
                }
              `}
              title={`${data.count} reaction${data.count !== 1 ? 's' : ''}`}
            >
              <span>{emoji}</span>
              <span className="text-[10px]">{data.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Reaction Bar */}
      <div className="flex items-center gap-0.5">
        {/* Add Reaction Button */}
        <button
          ref={buttonRef}
          onClick={() => setShowFullPicker(!showFullPicker)}
          className={`
            p-1 rounded-md transition-all text-sm
            ${showFullPicker
              ? 'bg-amber-500/30 text-amber-400'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }
          `}
          title="Add reaction"
        >
          😊
        </button>

        {/* Quick Emojis (contextual or universal) */}
        {!compact && (
          <div className="flex items-center gap-0.5 ml-1">
            {getContextualEmojis().slice(0, 4).map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`
                  w-6 h-6 rounded-md flex items-center justify-center text-sm
                  transition-all duration-200
                  ${hasReacted(emoji)
                    ? 'bg-amber-500/30 scale-110'
                    : 'bg-white/5 hover:bg-white/15 hover:scale-110'
                  }
                `}
                title={hasReacted(emoji) ? 'Remove reaction' : 'React'}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full Emoji Picker Dropdown - rendered via Portal to escape overflow:hidden */}
      {showFullPicker && createPortal(
        <div
          id="emoji-picker-dropdown"
          className="fixed z-[9999] animate-fadeIn"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden w-72">
            {/* Category Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
              {Object.entries(CONSTITUTIONAL_EMOJIS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`
                    flex-1 min-w-0 px-2 py-2 text-xs font-medium transition-colors
                    ${activeCategory === key
                      ? `bg-gradient-to-r ${config.gradient} text-white`
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                    }
                  `}
                >
                  {config.emojis[0]}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-3">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                {CONSTITUTIONAL_EMOJIS[activeCategory].name}
              </p>
              <div className="grid grid-cols-5 gap-1">
                {CONSTITUTIONAL_EMOJIS[activeCategory].emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-xl
                      transition-all duration-200 hover:scale-125
                      ${hasReacted(emoji)
                        ? 'bg-amber-500/30 ring-2 ring-amber-500/50'
                        : 'bg-white/5 hover:bg-white/15'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 bg-white/5 border-t border-white/10">
              <p className="text-[10px] text-white/30 text-center">
                Constitutional emoji reactions
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/**
 * Compact Reaction Display (for showing on messages)
 */
export function ReactionDisplay({ reactions = {}, currentUserId, onReact }) {
  const existingReactions = Object.entries(reactions).filter(([_, data]) => data.count > 0);

  if (existingReactions.length === 0) return null;

  const hasReacted = (emoji) => reactions[emoji]?.users?.includes(currentUserId);

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {existingReactions.map(([emoji, data]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className={`
            inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs
            transition-all duration-200
            ${hasReacted(emoji)
              ? 'bg-amber-500/30 border border-amber-500/50 text-white'
              : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20'
            }
          `}
        >
          <span>{emoji}</span>
          <span className="text-[10px] font-medium">{data.count}</span>
        </button>
      ))}
    </div>
  );
}

export default EmojiReactionPicker;
