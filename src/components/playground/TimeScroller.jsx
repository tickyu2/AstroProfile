/**
 * TimeScroller Component
 *
 * Vertical scrollable timeline from 00:00 to 23:45 (every 15 minutes).
 * Part of the Soul Garden Playground.
 *
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useRef, useEffect } from 'react';

export default function TimeScroller({ timeline, selectedIndex, onSelect, focusedIndex = null, isLocked = false }) {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);

  // Auto-scroll to selected item
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedIndex]);

  // Check if this is the focused (user-specified) time
  const isFocused = (idx) => focusedIndex !== null && idx === focusedIndex;

  return (
    <div
      ref={scrollRef}
      className="w-20 border-r border-cyan-500/20 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent bg-indigo-950/30"
      style={{ height: '100%' }}
    >
      <div className="sticky top-0 bg-indigo-950/95 backdrop-blur-sm z-10 py-2 px-2 border-b border-cyan-500/20">
        <div className="text-[10px] text-cyan-400/70 uppercase tracking-wider text-center flex items-center justify-center gap-1">
          {isLocked && focusedIndex !== null ? (
            <>
              <span className="text-amber-400">🔒</span>
              <span>Locked</span>
            </>
          ) : focusedIndex !== null ? (
            <>
              <span className="text-emerald-400">🔓</span>
              <span>Explore</span>
            </>
          ) : (
            <span>Time</span>
          )}
        </div>
      </div>

      {timeline.map((slice, idx) => {
        const isSelected = idx === selectedIndex;
        const isThisFocused = isFocused(idx);
        const hour = parseInt(slice.timeLabel.split(':')[0]);
        const isHourMark = slice.timeLabel.endsWith(':00');

        // Determine if this item is clickable
        const isClickable = !isLocked || focusedIndex === null;

        return (
          <div
            key={slice.index}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelect(idx)}
            className={`
              px-2 py-1.5 transition-all duration-200 text-center relative
              ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
              ${isSelected
                ? 'bg-cyan-500/30 text-cyan-300 border-l-2 border-cyan-400'
                : isClickable
                  ? 'text-white/50 hover:bg-cyan-500/10 hover:text-white/80 border-l-2 border-transparent'
                  : 'text-white/30 border-l-2 border-transparent'
              }
              ${isHourMark ? 'font-medium' : ''}
              ${isThisFocused ? 'ring-1 ring-amber-400/50 bg-amber-500/10' : ''}
            `}
          >
            {isThisFocused && (
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-amber-400 text-[8px]">
                ★
              </span>
            )}
            <span className={`${isHourMark ? 'text-xs' : 'text-[11px]'} ${isThisFocused ? 'text-amber-300' : ''}`}>
              {slice.timeLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
