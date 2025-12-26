/**
 * TypeComparisonTool Component
 *
 * Interactive tool for comparing two Enneagram types side-by-side.
 * Shows similarities, differences, and misidentification tips.
 *
 * Features:
 *   - Type selector buttons for both types
 *   - Side-by-side comparison view
 *   - Similarities and differences lists
 *   - Misidentification guidance
 *   - Smooth animations
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * Created: December 26, 2024 (Priority 3)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENNEAGRAM_TYPES, TYPE_COMPARISON_DIFFERENCES } from './enneagramData';

export default function TypeComparisonTool({ initialType1 = null, initialType2 = null }) {
  const [type1, setType1] = useState(initialType1);
  const [type2, setType2] = useState(initialType2);

  // Get comparison data (handles both orderings: "1-2" or "2-1")
  const comparisonData = useMemo(() => {
    if (!type1 || !type2 || type1 === type2) return null;

    const key1 = `${Math.min(type1, type2)}-${Math.max(type1, type2)}`;
    return TYPE_COMPARISON_DIFFERENCES[key1] || null;
  }, [type1, type2]);

  const type1Data = type1 ? ENNEAGRAM_TYPES[type1] : null;
  const type2Data = type2 ? ENNEAGRAM_TYPES[type2] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span>🔍</span>
          Type Comparison Tool
        </h3>
        <p className="text-white/50 text-sm">
          Select two types to see their similarities and differences
        </p>
      </div>

      {/* Type Selectors */}
      <div className="grid grid-cols-2 gap-4">
        {/* Type 1 Selector */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-xs text-white/40 mb-3 text-center">Select First Type</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => {
              const td = ENNEAGRAM_TYPES[t];
              const isSelected = type1 === t;
              const isDisabled = type2 === t;
              return (
                <button
                  key={t}
                  onClick={() => !isDisabled && setType1(t)}
                  disabled={isDisabled}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isSelected ? 'ring-2 ring-white scale-110' : ''
                  } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}`}
                  style={{
                    backgroundColor: `${td.color}${isSelected ? '50' : '25'}`,
                    color: td.color
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {type1Data && (
            <div className="mt-3 text-center">
              <div className="text-lg font-medium" style={{ color: type1Data.color }}>
                {type1Data.name}
              </div>
              <div className="text-xs text-white/40">{type1Data.briefDescription}</div>
            </div>
          )}
        </div>

        {/* Type 2 Selector */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-xs text-white/40 mb-3 text-center">Select Second Type</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => {
              const td = ENNEAGRAM_TYPES[t];
              const isSelected = type2 === t;
              const isDisabled = type1 === t;
              return (
                <button
                  key={t}
                  onClick={() => !isDisabled && setType2(t)}
                  disabled={isDisabled}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isSelected ? 'ring-2 ring-white scale-110' : ''
                  } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}`}
                  style={{
                    backgroundColor: `${td.color}${isSelected ? '50' : '25'}`,
                    color: td.color
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {type2Data && (
            <div className="mt-3 text-center">
              <div className="text-lg font-medium" style={{ color: type2Data.color }}>
                {type2Data.name}
              </div>
              <div className="text-xs text-white/40">{type2Data.briefDescription}</div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      <AnimatePresence mode="wait">
        {type1 && type2 && type1 !== type2 && comparisonData && (
          <motion.div
            key={`${type1}-${type2}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Header with both types */}
            <div className="bg-gradient-to-r from-indigo-950/50 via-purple-950/50 to-indigo-950/50 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                      backgroundColor: `${type1Data.color}30`,
                      color: type1Data.color
                    }}
                  >
                    {type1}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{type1Data.name}</div>
                    <div className="text-xs text-white/40">{type1Data.shortName}</div>
                  </div>
                </div>

                <span className="text-2xl text-purple-400">vs</span>

                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                      backgroundColor: `${type2Data.color}30`,
                      color: type2Data.color
                    }}
                  >
                    {type2}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{type2Data.name}</div>
                    <div className="text-xs text-white/40">{type2Data.shortName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similarities */}
            <div className="bg-emerald-950/30 rounded-xl p-5 border border-emerald-500/20">
              <h4 className="text-lg font-medium text-emerald-300 mb-3 flex items-center gap-2">
                <span>🤝</span>
                Similarities
              </h4>
              <ul className="space-y-2">
                {comparisonData.similarities.map((sim, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {sim}
                  </li>
                ))}
              </ul>
            </div>

            {/* Differences */}
            <div className="bg-amber-950/30 rounded-xl p-5 border border-amber-500/20">
              <h4 className="text-lg font-medium text-amber-300 mb-3 flex items-center gap-2">
                <span>⚖️</span>
                Key Differences
              </h4>
              <div className="space-y-3">
                {comparisonData.differences.map((diff, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-3 text-sm text-white/70"
                  >
                    {diff}
                  </div>
                ))}
              </div>
            </div>

            {/* Misidentification Tips */}
            <div className="bg-purple-950/30 rounded-xl p-5 border border-purple-500/20">
              <h4 className="text-lg font-medium text-purple-300 mb-3 flex items-center gap-2">
                <span>🔮</span>
                Avoiding Misidentification
              </h4>
              <p className="text-sm text-white/70 leading-relaxed">
                {comparisonData.misidentification}
              </p>
            </div>

            {/* Quick Reference Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: `${type1Data.color}10`,
                  borderColor: `${type1Data.color}30`
                }}
              >
                <div className="text-center mb-3">
                  <div className="text-lg font-bold" style={{ color: type1Data.color }}>
                    Type {type1}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Core Fear:</span>
                    <span className="text-white/70">{type1Data.fear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Core Desire:</span>
                    <span className="text-white/70">{type1Data.desire}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Center:</span>
                    <span className="text-white/70">{type1Data.center}</span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: `${type2Data.color}10`,
                  borderColor: `${type2Data.color}30`
                }}
              >
                <div className="text-center mb-3">
                  <div className="text-lg font-bold" style={{ color: type2Data.color }}>
                    Type {type2}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Core Fear:</span>
                    <span className="text-white/70">{type2Data.fear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Core Desire:</span>
                    <span className="text-white/70">{type2Data.desire}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Center:</span>
                    <span className="text-white/70">{type2Data.center}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {(!type1 || !type2) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-white/40"
          >
            <span className="text-4xl mb-2 block">🎯</span>
            <p>Select two different types above to compare them</p>
          </motion.div>
        )}

        {/* Same type selected */}
        {type1 && type2 && type1 === type2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-white/40"
          >
            <span className="text-4xl mb-2 block">🪞</span>
            <p>Select two <em>different</em> types to compare</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
