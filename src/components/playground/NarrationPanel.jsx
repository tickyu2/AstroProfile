/**
 * NarrationPanel Component
 *
 * Poetic narration of house activations and planetary movements.
 * The "soul-garden speaking" - interprets the chart moment.
 *
 * Integrates the full narration choir:
 *   - Rising: How the soul walks
 *   - Houses: Where it's alive right now
 *   - Retrogrades: Why patterns loop
 *   - Direct: Where energy flows
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  narrateSliceFull,
  narrateCathedralBell,
  getNarrationMode,
  narrateSilence,
  narrateHouses,
  narrateRoseWindow,
  summarizeRoseWindow
} from './soulGarden';

// Planet poetry fragments (fallback)
const PLANET_POETRY = {
  sun: { enters: 'The Sun illuminates', meaning: 'core identity awakens' },
  moon: { enters: 'The Moon bathes', meaning: 'emotional tides shift' },
  mercury: { enters: 'Mercury quickens', meaning: 'thoughts crystallize' },
  venus: { enters: 'Venus graces', meaning: 'beauty emerges' },
  mars: { enters: 'Mars ignites', meaning: 'action beckons' },
  jupiter: { enters: 'Jupiter expands', meaning: 'wisdom flows' },
  saturn: { enters: 'Saturn grounds', meaning: 'structure forms' },
  uranus: { enters: 'Uranus electrifies', meaning: 'innovation sparks' },
  neptune: { enters: 'Neptune dissolves', meaning: 'dreams surface' },
  pluto: { enters: 'Pluto transforms', meaning: 'depths revealed' }
};

// House poetry fragments
const HOUSE_POETRY = {
  1: { name: 'Self', verb: 'emerges', quality: 'identity' },
  2: { name: 'Resources', verb: 'stabilize', quality: 'value' },
  3: { name: 'Mind', verb: 'connects', quality: 'thought' },
  4: { name: 'Roots', verb: 'anchor', quality: 'belonging' },
  5: { name: 'Heart', verb: 'creates', quality: 'joy' },
  6: { name: 'Service', verb: 'refines', quality: 'craft' },
  7: { name: 'Other', verb: 'mirrors', quality: 'partnership' },
  8: { name: 'Depths', verb: 'transform', quality: 'rebirth' },
  9: { name: 'Vision', verb: 'expands', quality: 'meaning' },
  10: { name: 'Summit', verb: 'achieves', quality: 'legacy' },
  11: { name: 'Community', verb: 'unites', quality: 'dreams' },
  12: { name: 'Mystery', verb: 'dissolves', quality: 'transcendence' }
};

// 8th house alchemical phrases
const EIGHTH_HOUSE_ALCHEMY = [
  'The alchemical chamber of your chart glows — this is where the soul rearranges itself.',
  'An old skin dissolves quietly... the hidden organ of the soul stirs.',
  'The threshold between worlds opens — transmutation begins.',
  'Depths transform — what was buried now becomes gold.',
  'The portal pulses with ancestral memory — surrender to rebirth.'
];

/**
 * Generate poetic narration for a time slice
 * Enhanced version that works with various slice structures
 */
function generateNarration(slice, alchemical = true, risingSign = null) {
  if (!slice || !slice.houses || !slice.houses.length) {
    return [];
  }

  const narratives = [];

  // Try to use the new narration system first
  try {
    // Get house narration lines
    const houseLines = narrateHouses(slice, { maxHouses: 2, strengthThreshold: 20 });
    houseLines.forEach(line => {
      narratives.push({
        type: 'house',
        text: line
      });
    });

    // Get rose window summary
    const summary = summarizeRoseWindow(slice);
    if (summary && !summary.includes('awaits')) {
      narratives.push({
        type: 'peak',
        text: summary
      });
    }
  } catch (err) {
    console.log('Using fallback narration:', err.message);
  }

  // Fallback/enhancement: Process houses directly
  const houses = slice.houses;

  // Find houses with planets
  const activatedHouses = houses.filter(h => {
    const planets = h.planets;
    if (!planets) return false;
    if (Array.isArray(planets)) return planets.length > 0;
    return false;
  });

  // Generate planet narration for each activated house
  activatedHouses.forEach(h => {
    const housePoetry = HOUSE_POETRY[h.house];
    const planets = h.planets || [];

    planets.forEach(planet => {
      // Handle planet as string or object
      const planetName = typeof planet === 'string' ? planet : (planet.name || planet.planet || '');
      if (!planetName) return;

      const isEighth = h.house === 8;
      const pData = PLANET_POETRY[planetName.toLowerCase()];

      if (pData && housePoetry) {
        // Avoid duplicates
        const text = isEighth
          ? `${pData.enters} the 8th House — ${pData.meaning}.`
          : `${pData.enters} House ${h.house} — ${pData.meaning}.`;

        if (!narratives.find(n => n.text === text)) {
          narratives.push({
            type: isEighth ? 'eighth' : 'activation',
            house: h.house,
            text
          });
        }
      }
    });
  });

  // Find strongest house
  const sortedHouses = [...houses].sort((a, b) => (b.strength || 0) - (a.strength || 0));
  const strongest = sortedHouses[0];

  if (strongest && (strongest.strength || 0) > 40) {
    const housePoetry = HOUSE_POETRY[strongest.house];
    const isEighth = strongest.house === 8;

    if (isEighth && alchemical) {
      const alchemyPhrase = EIGHTH_HOUSE_ALCHEMY[Math.floor(Math.random() * EIGHTH_HOUSE_ALCHEMY.length)];
      if (!narratives.find(n => n.type === 'alchemy')) {
        narratives.push({
          type: 'alchemy',
          house: 8,
          text: alchemyPhrase
        });
      }
    } else if (housePoetry && !narratives.find(n => n.type === 'peak')) {
      narratives.push({
        type: 'peak',
        house: strongest.house,
        text: `House ${strongest.house} peaks at ${strongest.strength || 0} — ${housePoetry.name} ${housePoetry.verb}.`
      });
    }
  }

  // Check if 8th house is highly active
  const eighthHouse = houses.find(h => h.house === 8);
  if (alchemical && eighthHouse && (eighthHouse.strength || 0) > 60 && strongest?.house !== 8) {
    if (!narratives.find(n => n.type === 'eighth' && n.house === 8)) {
      narratives.push({
        type: 'eighth',
        house: 8,
        text: `The 8th House glows at ${eighthHouse.strength || 0} — the underworld stirs beneath.`
      });
    }
  }

  // Angular house activity check
  const angularHouses = houses.filter(h => [1, 4, 7, 10].includes(h.house));
  const activeAngular = angularHouses.filter(h => {
    const planets = h.planets;
    return planets && Array.isArray(planets) && planets.length > 0;
  });

  if (activeAngular.length >= 2) {
    narratives.push({
      type: 'angular',
      text: `Angular axis activates — life's compass recalibrates.`
    });
  }

  // If no activations, show a quiet message
  if (narratives.length === 0) {
    narratives.push({
      type: 'rest',
      text: alchemical
        ? `The houses rest in quiet potential... the athanor awaits the flame.`
        : `The houses rest in quiet potential...`
    });
  }

  return narratives;
}

export default function NarrationPanel({ slice, alchemical = true, risingSign = null }) {
  const narratives = useMemo(() => {
    return generateNarration(slice, alchemical, risingSign);
  }, [slice, alchemical, risingSign]);

  return (
    <div className={`w-64 border-l border-cyan-500/20 flex flex-col bg-indigo-950/30 ${alchemical ? '' : 'contemplative'}`}>
      {/* Header */}
      <div className="p-3 border-b border-cyan-500/20">
        <div className="text-[10px] text-cyan-400/70 uppercase tracking-wider mb-1">
          {alchemical ? 'Alchemical Narration' : 'Soul Garden Narration'}
        </div>
        <div className="text-sm text-cyan-300 font-medium flex items-center gap-2">
          {slice?.timeLabel || '--:--'}
          {alchemical && <span className="text-[10px] text-amber-400/60">⚗️</span>}
        </div>
      </div>

      {/* Narration content */}
      <div className="flex-1 p-3 overflow-y-auto soul-scroll">
        <AnimatePresence mode="wait">
          {narratives.length > 0 ? (
            <motion.div
              key={slice?.timeLabel || 'empty'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {narratives.map((n, i) => (
                <motion.div
                  key={`${slice?.timeLabel}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`
                    text-xs leading-relaxed p-2.5 rounded-lg transition-all duration-300
                    ${n.type === 'activation'
                      ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                      : n.type === 'house'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20'
                      : n.type === 'eighth'
                      ? 'text-purple-300 bg-purple-500/15 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : n.type === 'alchemy'
                      ? 'text-amber-200 bg-gradient-to-br from-purple-500/20 to-amber-500/15 border border-amber-400/40 shadow-[0_0_16px_rgba(251,191,36,0.25)]'
                      : n.type === 'peak'
                      ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                      : n.type === 'angular'
                      ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20'
                      : 'text-white/50 bg-white/5 border border-white/10'
                    }
                    ${alchemical && (n.type === 'eighth' || n.type === 'alchemy') ? 'soul-glow' : ''}
                  `}
                >
                  {n.type === 'activation' && <span className="mr-1.5">✨</span>}
                  {n.type === 'house' && <span className="mr-1.5">🏠</span>}
                  {n.type === 'eighth' && <span className="mr-1.5">🜏</span>}
                  {n.type === 'alchemy' && <span className="mr-1.5">⚗️</span>}
                  {n.type === 'peak' && <span className="mr-1.5">⭐</span>}
                  {n.type === 'angular' && <span className="mr-1.5">✦</span>}
                  {n.type === 'rest' && <span className="mr-1.5">🌙</span>}
                  <span className="italic">{n.text}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-xs text-white/40 italic">
              Select a time to see the garden breathe...
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Alchemical mode indicator */}
      {alchemical && (
        <div className="p-2 border-t border-cyan-500/10 text-center">
          <div className="text-[9px] text-purple-400/60">
            8th House = Portal of Transformation
          </div>
        </div>
      )}
    </div>
  );
}
