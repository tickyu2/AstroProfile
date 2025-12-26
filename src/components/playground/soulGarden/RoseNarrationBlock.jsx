/**
 * RoseNarrationBlock Component
 *
 * Displays poetic, cathedral-language narration for the Rose Window.
 * Each line appears as a glowing amber card.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrateRoseWindow, summarizeRoseWindow } from './roseNarration';

export default function RoseNarrationBlock({
  slice,
  alchemical = true,
  showSummary = false,
  maxLines = 5
}) {
  if (!slice) {
    return (
      <div className="text-center text-white/30 text-sm py-4">
        Awaiting the rose window to bloom...
      </div>
    );
  }

  // Generate narration lines
  const lines = narrateRoseWindow(slice).slice(0, maxLines);
  const summary = showSummary ? summarizeRoseWindow(slice) : null;

  return (
    <div className={`space-y-3 ${alchemical ? '' : 'contemplative'}`}>
      {/* Summary line (if requested) */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-center text-amber-300/80 font-medium"
        >
          {summary}
        </motion.div>
      )}

      {/* Narration lines */}
      <AnimatePresence>
        {lines.map((line, idx) => (
          <motion.div
            key={`${slice.timeLabel}-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: idx * 0.15 }}
            className={`
              text-xs leading-relaxed p-3 rounded-lg
              bg-gradient-to-r from-amber-500/10 to-purple-500/5
              border border-amber-500/20
              text-amber-200/90
              ${alchemical ? 'hover:bg-amber-500/15 transition-colors' : ''}
            `}
          >
            <span className="mr-2 text-amber-400">✨</span>
            <span className="italic">{line}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Poetic footer */}
      {lines.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lines.length * 0.15 + 0.3 }}
          className="text-center text-[10px] text-white/30 pt-2"
        >
          ─ The Rose Window speaks ─
        </motion.div>
      )}
    </div>
  );
}
