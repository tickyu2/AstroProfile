/**
 * ============================================================================
 * LETTER FROM CHART
 * ============================================================================
 * A sacred component that displays the soul-language letter written
 * by the birth chart to the person who carries it.
 *
 * Features:
 *   - Handwritten-style typography
 *   - Animated letter reveal
 *   - Copy/Share functionality
 *   - Fallback when AI is unavailable
 *   - Print-friendly layout
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateSoulLetter,
  buildSoulChartFromSlice
} from '../../services/soulLetterService';
import { generateEpochs } from '../../soulGarden';

/**
 * Letter From Chart Component
 */
export default function LetterFromChart({
  slice,
  birthData,
  risingSign,
  onClose,
  isOpen = false
}) {
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Generate the letter when opened
  const generateLetter = useCallback(async () => {
    if (!slice) return;

    setLoading(true);
    setError(null);
    setRevealed(false);

    try {
      // Build chart object for epochs
      const chartForEpochs = {
        planets: slice.planets || [],
        houses: slice.houses || [],
        aspects: slice.aspects || [],
        rising: slice.ascendant || { sign: risingSign }
      };

      // Generate epochs
      const epochs = generateEpochs(chartForEpochs);

      // Build full soul chart
      const soulChart = buildSoulChartFromSlice(slice, birthData, epochs);

      // Generate the letter
      const result = await generateSoulLetter(soulChart, {
        provider: 'claude',
        mode: 'letter'
      });

      if (result.success) {
        setLetter(result.letter);
      } else {
        // Use fallback letter
        setLetter(result.fallbackLetter);
      }

      // Trigger reveal animation
      setTimeout(() => setRevealed(true), 500);
    } catch (err) {
      console.error('[LetterFromChart] Error:', err);
      setError('The Cathedral is momentarily quiet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [slice, birthData, risingSign]);

  // Generate letter when modal opens
  useEffect(() => {
    if (isOpen && !letter && !loading) {
      generateLetter();
    }
  }, [isOpen, letter, loading, generateLetter]);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Print the letter
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Letter From Your Chart</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            max-width: 700px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.8;
            color: #333;
          }
          h1 {
            text-align: center;
            font-style: italic;
            color: #7c3aed;
            margin-bottom: 40px;
          }
          p {
            margin-bottom: 1.5em;
            text-indent: 2em;
          }
          .signature {
            text-align: right;
            font-style: italic;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <h1>Letter From Your Chart</h1>
        ${letter.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-4 border-b border-purple-500/20 bg-indigo-950/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">&#x2728;</span>
                <div>
                  <h2 className="text-xl font-bold text-amber-300">Letter From Your Chart</h2>
                  <p className="text-xs text-white/50">
                    {risingSign} Rising &bull; {birthData?.date || 'Your Birth Day'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  disabled={!letter || loading}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  title="Copy to clipboard"
                >
                  <span>{copied ? '&#x2713;' : '&#x1F4CB;'}</span>
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  disabled={!letter || loading}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  title="Print letter"
                >
                  <span>&#x1F5A8;</span>
                  <span className="hidden sm:inline">Print</span>
                </button>

                {/* Regenerate button */}
                <button
                  onClick={generateLetter}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  title="Generate new letter"
                >
                  <span className={loading ? 'animate-spin' : ''}>&#x21BB;</span>
                  <span className="hidden sm:inline">{loading ? 'Writing...' : 'New Letter'}</span>
                </button>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-all"
                  title="Close"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] soul-scroll">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={generateLetter} />
            ) : letter ? (
              <LetterContent letter={letter} revealed={revealed} />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-3 border-t border-purple-500/20 bg-indigo-950/90 backdrop-blur-sm">
            <p className="text-[10px] text-white/30 text-center italic">
              This letter speaks in soul-language. It offers recognition, not prediction.
              Your path remains your own to walk.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Loading state with animated quill
 */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        &#x1F58B;
      </motion.div>
      <p className="text-amber-300 text-lg font-medium mb-2">Your chart is writing to you...</p>
      <p className="text-white/50 text-sm">This may take a moment</p>

      {/* Animated dots */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="w-2 h-2 rounded-full bg-purple-400"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Error state
 */
function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="text-5xl mb-4">&#x1F54A;</span>
      <p className="text-rose-300 text-lg font-medium mb-2">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="text-5xl mb-4">&#x1F4DC;</span>
      <p className="text-white/50 text-lg">No chart data available</p>
    </div>
  );
}

/**
 * Letter content with handwritten styling
 */
function LetterContent({ letter, revealed }) {
  // Split letter into paragraphs
  const paragraphs = letter.split('\n\n').filter(p => p.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 1 }}
      className="space-y-6"
    >
      {/* Decorative header */}
      <div className="text-center mb-8">
        <span className="text-amber-400/50 text-sm tracking-[0.5em]">&#x2726; &#x2726; &#x2726;</span>
      </div>

      {/* Letter paragraphs */}
      {paragraphs.map((paragraph, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="text-white/80 leading-relaxed text-base"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            textIndent: paragraph.startsWith('\u2014') ? '0' : '2em'
          }}
        >
          {paragraph}
        </motion.p>
      ))}

      {/* Decorative footer */}
      <div className="text-center mt-8 pt-4 border-t border-purple-500/20">
        <span className="text-amber-400/50 text-sm tracking-[0.5em]">&#x2726;</span>
      </div>
    </motion.div>
  );
}
