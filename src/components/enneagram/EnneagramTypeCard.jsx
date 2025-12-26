/**
 * EnneagramTypeCard Component
 *
 * Displays detailed information about the user's Enneagram type.
 * Shows dominant type, wing, tritype, and psychological insights.
 *
 * Features:
 *   - Type name and description
 *   - Wing information
 *   - Growth and stress arrows
 *   - Center (Gut/Heart/Head) indicator
 *   - Keywords and traits
 *
 * Part of GENESIS OS - Enneagram Alchemical Rose
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ENNEAGRAM_TYPES,
  ENNEAGRAM_CENTERS,
  getWingNotation,
  getTritypeNotation,
  scoreToPercentage
} from './enneagramData';

export default function EnneagramTypeCard({
  enneagramResult,
  alchemical = true
}) {
  if (!enneagramResult || !enneagramResult.dominantType) {
    return null;
  }

  const { scores, dominantType, wing, tritype } = enneagramResult;
  const typeData = ENNEAGRAM_TYPES[dominantType];
  const wingData = ENNEAGRAM_TYPES[wing];
  const centerData = ENNEAGRAM_CENTERS[typeData.center];

  // Get growth and stress type data
  const growthData = ENNEAGRAM_TYPES[typeData.growthArrow];
  const stressData = ENNEAGRAM_TYPES[typeData.stressArrow];

  return (
    <div className={`space-y-6 ${alchemical ? 'alchemical' : 'contemplative'}`}>
      {/* Main type card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 rounded-xl border border-purple-500/20 overflow-hidden"
      >
        {/* Header with type number and name */}
        <div
          className="p-6 border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${typeData.color}15 0%, transparent 100%)`
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Large type number */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{
                  backgroundColor: `${typeData.color}33`,
                  color: typeData.color,
                  boxShadow: alchemical ? `0 0 30px ${typeData.color}40` : 'none'
                }}
              >
                {dominantType}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {typeData.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${typeData.color}20`,
                      color: typeData.color
                    }}
                  >
                    {getWingNotation(dominantType, wing)}
                  </span>
                  <span className="text-xs text-white/40">•</span>
                  <span
                    className="text-xs"
                    style={{ color: centerData.color }}
                  >
                    {centerData.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Score percentage */}
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: typeData.color }}>
                {scoreToPercentage(scores[dominantType])}%
              </div>
              <div className="text-xs text-white/40">Alignment</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 space-y-4">
          <p className="text-white/80 leading-relaxed">
            {typeData.description}
          </p>

          {/* Core qualities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/40 mb-1">Essence</div>
              <div className="text-sm font-medium text-cyan-300">{typeData.essence}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/40 mb-1">Passion</div>
              <div className="text-sm font-medium text-rose-300">{typeData.passion}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/40 mb-1">Virtue</div>
              <div className="text-sm font-medium text-emerald-300">{typeData.virtue}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/40 mb-1">Center Emotion</div>
              <div className="text-sm font-medium" style={{ color: centerData.color }}>
                {centerData.emotion}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <div className="text-xs text-white/40 mb-2">Keywords</div>
            <div className="flex flex-wrap gap-2">
              {typeData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${typeData.color}15`,
                    color: typeData.color
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wing card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-950/30 to-slate-950/50 rounded-xl border border-white/10 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                backgroundColor: `${wingData.color}20`,
                color: wingData.color
              }}
            >
              {wing}
            </div>
            <div>
              <div className="text-xs text-white/40">Wing Influence</div>
              <div className="text-sm font-medium text-white">{wingData.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium" style={{ color: wingData.color }}>
              {scoreToPercentage(scores[wing])}%
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/60">
          Your {dominantType}w{wing} combination blends {typeData.shortName} qualities with {wingData.shortName} tendencies.
        </p>
      </motion.div>

      {/* Growth and Stress arrows */}
      <div className="grid grid-cols-2 gap-4">
        {/* Growth (Integration) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-950/30 to-green-950/50 rounded-xl border border-emerald-500/20 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400">↑</span>
            <span className="text-xs text-emerald-400 font-medium">Growth Direction</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/20 text-emerald-300"
            >
              {typeData.growthArrow}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{growthData.name}</div>
              <div className="text-xs text-white/40">{growthData.briefDescription}</div>
            </div>
          </div>
        </motion.div>

        {/* Stress (Disintegration) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-rose-950/30 to-red-950/50 rounded-xl border border-rose-500/20 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-rose-400">↓</span>
            <span className="text-xs text-rose-400 font-medium">Stress Direction</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-rose-500/20 text-rose-300"
            >
              {typeData.stressArrow}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{stressData.name}</div>
              <div className="text-xs text-white/40">{stressData.briefDescription}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tritype */}
      {tritype && tritype.length === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-950/20 to-orange-950/30 rounded-xl border border-amber-500/20 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-400 font-medium mb-1">Tritype</div>
              <div className="text-lg font-bold text-amber-300">
                {getTritypeNotation(tritype)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tritype.map((type, idx) => {
                const tData = ENNEAGRAM_TYPES[type];
                const cData = ENNEAGRAM_CENTERS[tData.center];
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: `${tData.color}20`,
                        color: tData.color
                      }}
                    >
                      {type}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: cData.color }}>
                      {cData.name.split('/')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-xs text-white/50">
            Your tritype combines your dominant type from each of the three centers: Gut, Heart, and Head.
          </p>
        </motion.div>
      )}
    </div>
  );
}
