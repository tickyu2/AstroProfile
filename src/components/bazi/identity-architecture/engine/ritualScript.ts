/**
 * Ritual Script — real-time ceremony narration
 *
 * Generates contextual text that reacts to the current state of Temple Mode:
 * day master, season, severity, pillar selection, storm, and gestures.
 */

import type { GestureType } from './ritualGestures';

interface RitualContext {
  dayMaster: string;
  season: string;
  severity: number;
  selectedPillar: string | null;
  storm: number;
  gesture: GestureType;
}

/** Generate the current ritual narration line */
export function ritualScript(ctx: RitualContext): string {
  // Gesture-triggered narrations take highest priority
  if (ctx.gesture === 'circle') return 'The circle is drawn. The Temple awakens.';
  if (ctx.gesture === 'swipe-up') return 'The breath rises. Fog ascends toward Heaven.';
  if (ctx.gesture === 'swipe-down') return 'The breath descends. Fog settles into Earth.';
  if (ctx.gesture === 'z-gesture') return 'A lightning sigil cracks across the sky.';

  // Storm narrations
  if (ctx.storm > 0.8) return 'The Storm gathers. The heart beats like thunder.';
  if (ctx.storm > 0.4) return 'Lightning stirs beneath the surface. Tension crackles.';

  // Severity narrations
  if (ctx.severity > 0.7) return 'Tension coils deep within. The pulse strains against its cage.';
  if (ctx.severity > 0.5) return 'The three selves pull in different directions. The heart adapts.';

  // Pillar selection narrations
  if (ctx.selectedPillar) {
    const pillarLines: Record<string, string> = {
      Year: 'The Year Pillar resonates — ancestral echoes ripple through the Temple.',
      Month: 'The Month Pillar resonates — social currents shift the fog.',
      Day: 'The Day Pillar resonates — the true self pulses brighter.',
      Hour: 'The Hour Pillar resonates — hidden desires emerge from shadow.',
    };
    return pillarLines[ctx.selectedPillar] || `The ${ctx.selectedPillar} pillar resonates.`;
  }

  // Default: Day Master + season
  const seasonLines: Record<string, string> = {
    spring: `The ${ctx.dayMaster} heart breathes through Spring. New growth stirs.`,
    summer: `The ${ctx.dayMaster} heart burns through Summer. Vitality peaks.`,
    autumn: `The ${ctx.dayMaster} heart releases through Autumn. Wisdom gathers.`,
    winter: `The ${ctx.dayMaster} heart rests through Winter. Stillness deepens.`,
  };
  return seasonLines[ctx.season.toLowerCase()] ||
    `The ${ctx.dayMaster} heart breathes through ${ctx.season}.`;
}
