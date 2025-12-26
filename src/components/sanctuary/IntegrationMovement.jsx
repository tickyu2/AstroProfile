/**
 * Integration Movement
 *
 * The fourth and final movement of the Sanctuary journey.
 * Where the Cathedral helps them carry it into life.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { motion } from 'framer-motion';

export function IntegrationMovement({ section, rituals, shortMantra, onComplete }) {
  if (!section) return null;

  return (
    <div className="space-y-8 px-4 py-8 max-w-2xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-3"
      >
        <div className="text-3xl">&#127807;</div>
        <h2 className="text-emerald-300 text-xl md:text-2xl font-semibold">
          {section.title || 'Integration'}
        </h2>
        <p className="text-xs text-white/60 max-w-md mx-auto">
          Here, the Sanctuary helps you walk back into your life
          <br />
          with a little more gentleness toward yourself.
        </p>
      </motion.div>

      {/* Integration Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-950/60 to-emerald-950/50 border border-emerald-400/30 p-6 space-y-3"
      >
        {section.lines?.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
            className="text-sm md:text-base text-white/80 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Short Mantra */}
      {shortMantra && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center py-6"
        >
          <motion.div
            className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-900/30 via-emerald-900/30 to-amber-900/30 border border-amber-400/30"
            animate={{
              boxShadow: [
                '0 0 20px rgba(251,191,36,0.1)',
                '0 0 40px rgba(251,191,36,0.2)',
                '0 0 20px rgba(251,191,36,0.1)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <p className="text-xs text-amber-300/60 uppercase tracking-widest mb-2">
              Your Mantra
            </p>
            <p className="text-amber-300 text-lg md:text-xl font-light italic">
              "{shortMantra}"
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Take-Home Rituals */}
      {rituals && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.9 }}
          className="rounded-2xl bg-slate-950/70 border border-white/10 p-5"
        >
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="text-lg">&#128367;</span>
            <p className="text-amber-300 text-sm font-semibold">
              Take-Home Rituals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <RitualCard
              label="Reflection"
              icon="&#128221;"
              body={rituals.reflection}
            />
            <RitualCard
              label="Grounding"
              icon="&#127757;"
              body={rituals.grounding}
            />
            <RitualCard
              label="Integration"
              icon="&#127793;"
              body={rituals.integration}
            />
            {rituals.release && (
              <RitualCard
                label="Release"
                icon="&#128168;"
                body={rituals.release}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Completion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="text-center pt-6 space-y-4"
      >
        <p className="text-white/50 text-xs italic">
          The Sanctuary will remember you.
          <br />
          You are always welcome to return.
        </p>

        {onComplete && (
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-sm font-semibold shadow-lg shadow-amber-500/30"
          >
            Return to the Cathedral
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Ritual Card Component
 */
function RitualCard({ label, icon, body }) {
  if (!body) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <p className="text-amber-300 text-xs font-semibold">{label}</p>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">{body}</p>
    </motion.div>
  );
}

export default IntegrationMovement;
