/**
 * Temple Soundscape — layered drone configuration
 *
 * Defines sound layers for the Temple Mode ambient environment.
 * All synthesis is done via Web Audio API (no external audio files).
 *
 * Layers:
 *   1. Base drone (always present) — low sine wave
 *   2. Elemental layer (Day Master) — element-specific waveform
 *   3. Seasonal layer (wind noise) — filtered noise
 *   4. Storm layer (rumble) — deep noise, volume scales with storm index
 */

export interface SoundLayerConfig {
  type: 'oscillator' | 'noise';
  frequency?: number;
  waveform?: OscillatorType;
  volume: number;
  /** Lowpass filter cutoff (Hz). Applied to noise layers. */
  filterFreq?: number;
  /** Slow volume modulation period in seconds */
  breathePeriod?: number;
}

/** Element-specific oscillator frequencies and waveforms */
function elementLayer(dayMaster: string): SoundLayerConfig {
  switch (dayMaster) {
    case 'Fire':
      return { type: 'oscillator', frequency: 110, waveform: 'sawtooth', volume: 0.06, breathePeriod: 4 };
    case 'Wood':
      return { type: 'oscillator', frequency: 82, waveform: 'triangle', volume: 0.07, breathePeriod: 6 };
    case 'Earth':
      return { type: 'oscillator', frequency: 73, waveform: 'sine', volume: 0.07, breathePeriod: 8 };
    case 'Metal':
      return { type: 'oscillator', frequency: 130, waveform: 'square', volume: 0.04, breathePeriod: 5 };
    case 'Water':
      return { type: 'oscillator', frequency: 65, waveform: 'sine', volume: 0.08, breathePeriod: 10 };
    default:
      return { type: 'oscillator', frequency: 73, waveform: 'sine', volume: 0.06, breathePeriod: 8 };
  }
}

/** Seasonal wind — filtered noise with different cutoff frequencies */
function seasonalLayer(season: string): SoundLayerConfig {
  switch (season.toLowerCase()) {
    case 'spring':
      return { type: 'noise', volume: 0.04, filterFreq: 800, breathePeriod: 12 };
    case 'summer':
      return { type: 'noise', volume: 0.05, filterFreq: 1200, breathePeriod: 8 };
    case 'autumn':
      return { type: 'noise', volume: 0.05, filterFreq: 600, breathePeriod: 14 };
    case 'winter':
      return { type: 'noise', volume: 0.06, filterFreq: 400, breathePeriod: 16 };
    default:
      return { type: 'noise', volume: 0.04, filterFreq: 700, breathePeriod: 12 };
  }
}

/** Build the full set of sound layers for the temple */
export function templeSoundLayers(
  dayMaster: string,
  season: string,
  storm: number,
): SoundLayerConfig[] {
  const layers: SoundLayerConfig[] = [
    // 1. Base drone — always present
    { type: 'oscillator', frequency: 55, waveform: 'sine', volume: 0.08, breathePeriod: 12 },
    // 2. Elemental layer
    elementLayer(dayMaster),
    // 3. Seasonal wind
    seasonalLayer(season),
  ];

  // 4. Storm rumble (only when storm > 0)
  if (storm > 0) {
    layers.push({
      type: 'noise',
      volume: 0.03 + storm * 0.08,
      filterFreq: 200,
      breathePeriod: 3,
    });
  }

  return layers;
}
