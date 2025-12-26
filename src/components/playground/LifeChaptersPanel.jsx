/**
 * ============================================================================
 * LIFE CHAPTERS PANEL
 * ============================================================================
 * Display life epochs with poetic narration in a cathedral-style panel.
 * Features:
 *   - Current epoch highlight
 *   - Age-based progress indicator
 *   - Expandable chapter details
 *   - Intensity visualization
 *   - Mythic narration
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateEpochs,
  getCurrentEpoch,
  narrateEpoch,
  summarizeEpoch,
  nameEpoch,
  getEpochFlavor
} from '../../soulGarden';

// Epoch icons by label
const EPOCH_ICONS = {
  "Early Life": "🌒",
  "Apprenticeship": "🪶",
  "Becoming": "🏗️",
  "Saturn Return": "⚡",
  "Expansion": "🌍",
  "The Great Turning": "🔥",
  "The Harvest": "🌾",
  "The Elder Flame": "🕯️"
};

// Epoch colors by label
const EPOCH_COLORS = {
  "Early Life": { bg: "from-slate-900/80 to-indigo-950/80", border: "border-indigo-500/30", text: "text-indigo-300" },
  "Apprenticeship": { bg: "from-slate-900/80 to-cyan-950/80", border: "border-cyan-500/30", text: "text-cyan-300" },
  "Becoming": { bg: "from-slate-900/80 to-amber-950/80", border: "border-amber-500/30", text: "text-amber-300" },
  "Saturn Return": { bg: "from-slate-900/80 to-purple-950/80", border: "border-purple-500/30", text: "text-purple-300" },
  "Expansion": { bg: "from-slate-900/80 to-emerald-950/80", border: "border-emerald-500/30", text: "text-emerald-300" },
  "The Great Turning": { bg: "from-slate-900/80 to-rose-950/80", border: "border-rose-500/30", text: "text-rose-300" },
  "The Harvest": { bg: "from-slate-900/80 to-orange-950/80", border: "border-orange-500/30", text: "text-orange-300" },
  "The Elder Flame": { bg: "from-slate-900/80 to-violet-950/80", border: "border-violet-500/30", text: "text-violet-300" }
};

/**
 * Single epoch card component
 */
function EpochCard({ epoch, risingSign, isCurrentEpoch, currentAge, isExpanded, onToggle }) {
  const icon = EPOCH_ICONS[epoch.label] || "✨";
  const colors = EPOCH_COLORS[epoch.label] || EPOCH_COLORS["Early Life"];
  const flavor = getEpochFlavor(epoch, risingSign);
  const narration = narrateEpoch(epoch, risingSign);

  // Calculate progress if current epoch
  const progress = isCurrentEpoch && currentAge
    ? Math.round(((currentAge - epoch.startAge) / (epoch.endAge - epoch.startAge)) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-xl border backdrop-blur-sm overflow-hidden
        bg-gradient-to-br ${colors.bg} ${colors.border}
        ${isCurrentEpoch ? 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10' : ''}
        transition-all duration-300 hover:border-white/20
      `}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-bold ${colors.text}`}>{epoch.label}</h3>
              {isCurrentEpoch && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-medium">
                  NOW
                </span>
              )}
            </div>
            <p className="text-xs text-white/50">{flavor}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Age range */}
          <div className="text-right">
            <div className="text-sm text-white/70">
              {epoch.startAge} - {epoch.endAge}
            </div>
            <div className="text-[10px] text-white/40">years</div>
          </div>

          {/* Intensity indicator */}
          {epoch.intensity && (
            <div className="w-12 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  epoch.intensity >= 70 ? 'bg-amber-500' :
                  epoch.intensity >= 50 ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${epoch.intensity}%` }}
              />
            </div>
          )}

          {/* Expand indicator */}
          <span className={`text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Progress bar for current epoch */}
      {isCurrentEpoch && progress !== null && (
        <div className="px-4 pb-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-[10px] text-amber-300/70 mt-1 text-center">
            {progress}% through this chapter
          </p>
        </div>
      )}

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
              {/* Narration lines */}
              {narration.slice(2).map((line, idx) => (
                <p key={idx} className="text-sm text-white/70 leading-relaxed">
                  {line}
                </p>
              ))}

              {/* Dominant houses */}
              {epoch.dominantHouses?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-white/40">Houses:</span>
                  {epoch.dominantHouses.map(h => (
                    <span
                      key={h}
                      className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/70"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Dominant planets */}
              {epoch.dominantPlanets?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-white/40">Planets:</span>
                  {epoch.dominantPlanets.map(p => (
                    <span
                      key={p}
                      className={`px-2 py-0.5 rounded bg-white/10 text-xs ${colors.text}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {/* Life themes */}
              {epoch.lifeThemes?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-white/40">Themes:</span>
                  {epoch.lifeThemes.map(theme => (
                    <span
                      key={theme}
                      className="px-2 py-0.5 rounded-full bg-amber-500/10 text-xs text-amber-300/80"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Symbolism quote */}
              {epoch.symbolism && (
                <p className="text-xs text-white/40 italic border-l-2 border-amber-500/30 pl-3 mt-3">
                  "{epoch.symbolism}"
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Main Life Chapters Panel component
 */
export default function LifeChaptersPanel({
  chart,
  risingSign,
  birthDate,
  showAll = false,
  maxVisible = 8
}) {
  const [expandedEpochs, setExpandedEpochs] = useState(new Set());

  // Generate epochs from chart
  const epochs = useMemo(() => {
    if (!chart) return [];
    return generateEpochs(chart);
  }, [chart]);

  // Calculate current age
  const currentAge = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [birthDate]);

  // Find current epoch
  const currentEpoch = useMemo(() => {
    if (currentAge === null) return null;
    return getCurrentEpoch(epochs, currentAge);
  }, [epochs, currentAge]);

  // Toggle epoch expansion
  const toggleEpoch = (label) => {
    setExpandedEpochs(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Filter visible epochs
  const visibleEpochs = showAll ? epochs : epochs.slice(0, maxVisible);

  if (!epochs.length) {
    return (
      <div className="p-4 rounded-xl bg-indigo-950/50 border border-white/10 text-center">
        <p className="text-white/50 text-sm">No chart data available for epoch generation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📜</span>
          <div>
            <h2 className="text-lg font-bold text-amber-300">Life Chapters</h2>
            <p className="text-xs text-white/40">
              {risingSign} Rising • {currentAge !== null ? `Age ${currentAge}` : 'Age unknown'}
            </p>
          </div>
        </div>

        {currentEpoch && (
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <p className="text-xs text-amber-300">
              Currently in: <span className="font-bold">{currentEpoch.label}</span>
            </p>
          </div>
        )}
      </div>

      {/* Epoch cards */}
      <div className="space-y-3">
        {visibleEpochs.map((epoch, idx) => (
          <EpochCard
            key={epoch.label}
            epoch={epoch}
            risingSign={risingSign}
            isCurrentEpoch={currentEpoch?.label === epoch.label}
            currentAge={currentAge}
            isExpanded={expandedEpochs.has(epoch.label)}
            onToggle={() => toggleEpoch(epoch.label)}
          />
        ))}
      </div>

      {/* Show more button */}
      {!showAll && epochs.length > maxVisible && (
        <button
          onClick={() => setExpandedEpochs(new Set(epochs.map(e => e.label)))}
          className="w-full py-2 text-center text-sm text-white/50 hover:text-white/70 transition-colors"
        >
          Show all {epochs.length} chapters →
        </button>
      )}

      {/* Footer note */}
      <p className="text-[10px] text-white/30 text-center italic">
        Life chapters are symbolic maps, not predictions. Your soul writes its own story.
      </p>
    </div>
  );
}
