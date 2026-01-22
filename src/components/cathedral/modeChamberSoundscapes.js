/**
 * Mode Chamber Soundscapes
 *
 * Ambient audio configurations for each Cathedral chamber,
 * adapted to each of the four modes.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// CHAMBER DEFINITIONS
// ============================================================================

export const CHAMBERS = {
  BIRTH: 'birth',
  YOUTH: 'youth',
  INITIATION: 'initiation',
  MASTERY: 'mastery',
  LEGACY: 'legacy',
  ANCESTRAL: 'ancestral',
  RITUAL: 'ritual',
  CODEX: 'codex',
};

// ============================================================================
// PILGRIM MODE SOUNDSCAPES - Warm, Emotional, Breath-like
// ============================================================================

const PILGRIM_SOUNDSCAPES = {
  [CHAMBERS.BIRTH]: {
    name: 'Dawn Hearth',
    description: 'Soft crackling fire, distant wind chimes, gentle breathing',
    layers: [
      {
        id: 'fire',
        type: 'ambient',
        source: 'fireplace_soft',
        volume: 0.3,
        pan: -0.2,
      },
      {
        id: 'chimes',
        type: 'melodic',
        source: 'wind_chimes_gentle',
        volume: 0.15,
        interval: { min: 8000, max: 15000 },
      },
      {
        id: 'breath',
        type: 'rhythmic',
        source: 'breath_soft',
        volume: 0.1,
        tempo: 12, // breaths per minute
      },
    ],
    transitions: {
      enter: { fadeIn: 2000, effect: 'bloom' },
      exit: { fadeOut: 1500, effect: 'dissolve' },
    },
  },

  [CHAMBERS.YOUTH]: {
    name: 'Morning Garden',
    description: 'Birdsong, rustling leaves, distant water',
    layers: [
      {
        id: 'birds',
        type: 'ambient',
        source: 'birdsong_morning',
        volume: 0.25,
        variation: true,
      },
      {
        id: 'leaves',
        type: 'ambient',
        source: 'leaves_rustle',
        volume: 0.2,
        pan: 0.3,
      },
      {
        id: 'water',
        type: 'ambient',
        source: 'stream_distant',
        volume: 0.15,
        pan: -0.4,
      },
    ],
    transitions: {
      enter: { fadeIn: 1800, effect: 'unfold' },
      exit: { fadeOut: 1200, effect: 'fade' },
    },
  },

  [CHAMBERS.INITIATION]: {
    name: 'Candlelit Sanctuary',
    description: 'Candle flicker, deep resonance, heartbeat',
    layers: [
      {
        id: 'candles',
        type: 'ambient',
        source: 'candle_flicker',
        volume: 0.2,
        stereoWidth: 0.6,
      },
      {
        id: 'resonance',
        type: 'drone',
        source: 'om_deep',
        volume: 0.15,
        note: 'D2',
      },
      {
        id: 'heartbeat',
        type: 'rhythmic',
        source: 'heartbeat_slow',
        volume: 0.12,
        tempo: 60,
      },
    ],
    transitions: {
      enter: { fadeIn: 2500, effect: 'bloom' },
      exit: { fadeOut: 2000, effect: 'dissolve' },
    },
  },

  [CHAMBERS.MASTERY]: {
    name: 'Golden Hour',
    description: 'Warm synth pad, achievement chimes, confident hum',
    layers: [
      {
        id: 'pad',
        type: 'drone',
        source: 'synth_warm',
        volume: 0.25,
        chord: ['D3', 'A3', 'F#4'],
      },
      {
        id: 'chimes',
        type: 'melodic',
        source: 'achievement_bells',
        volume: 0.2,
        interval: { min: 10000, max: 20000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 1500, effect: 'glow' },
      exit: { fadeOut: 1000, effect: 'fade' },
    },
  },

  [CHAMBERS.LEGACY]: {
    name: 'Twilight Reflection',
    description: 'Soft strings, distant voices, memory echoes',
    layers: [
      {
        id: 'strings',
        type: 'melodic',
        source: 'strings_gentle',
        volume: 0.2,
        key: 'D major',
      },
      {
        id: 'voices',
        type: 'ambient',
        source: 'choir_distant',
        volume: 0.1,
        reverb: 0.7,
      },
      {
        id: 'echoes',
        type: 'effect',
        source: 'memory_echoes',
        volume: 0.08,
        delay: 2000,
      },
    ],
    transitions: {
      enter: { fadeIn: 3000, effect: 'bloom' },
      exit: { fadeOut: 2500, effect: 'dissolve' },
    },
  },

  [CHAMBERS.ANCESTRAL]: {
    name: 'Ancestral Hearth',
    description: 'Deep fire, ancient hum, whispered names',
    layers: [
      {
        id: 'fire',
        type: 'ambient',
        source: 'fireplace_deep',
        volume: 0.3,
      },
      {
        id: 'hum',
        type: 'drone',
        source: 'ancestral_hum',
        volume: 0.15,
        note: 'G2',
      },
      {
        id: 'whispers',
        type: 'ambient',
        source: 'whispered_names',
        volume: 0.05,
        interval: { min: 15000, max: 30000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 3500, effect: 'emerge' },
      exit: { fadeOut: 3000, effect: 'dissolve' },
    },
  },

  [CHAMBERS.RITUAL]: {
    name: 'Sacred Circle',
    description: 'Singing bowl, breath rhythm, ceremonial bells',
    layers: [
      {
        id: 'bowl',
        type: 'melodic',
        source: 'singing_bowl',
        volume: 0.25,
        note: 'F4',
        interval: { min: 20000, max: 40000 },
      },
      {
        id: 'breath',
        type: 'rhythmic',
        source: 'breath_ceremonial',
        volume: 0.15,
        tempo: 8,
      },
      {
        id: 'bells',
        type: 'melodic',
        source: 'temple_bells',
        volume: 0.1,
        interval: { min: 30000, max: 60000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 4000, effect: 'sacred_bloom' },
      exit: { fadeOut: 3000, effect: 'dissolve' },
    },
  },

  [CHAMBERS.CODEX]: {
    name: 'Wisdom Library',
    description: 'Page rustle, quill scratch, distant clock',
    layers: [
      {
        id: 'pages',
        type: 'ambient',
        source: 'page_rustle',
        volume: 0.15,
        interval: { min: 5000, max: 12000 },
      },
      {
        id: 'ambient',
        type: 'ambient',
        source: 'library_quiet',
        volume: 0.1,
      },
    ],
    transitions: {
      enter: { fadeIn: 1500, effect: 'unfold' },
      exit: { fadeOut: 1000, effect: 'fade' },
    },
  },
};

// ============================================================================
// SCHOLAR MODE SOUNDSCAPES - Precise, Academic, Thoughtful
// ============================================================================

const SCHOLAR_SOUNDSCAPES = {
  [CHAMBERS.BIRTH]: {
    name: 'Archive Morning',
    description: 'Quiet study, clock ticking, quill on paper',
    layers: [
      {
        id: 'clock',
        type: 'rhythmic',
        source: 'clock_tick_soft',
        volume: 0.2,
        tempo: 60,
      },
      {
        id: 'quill',
        type: 'ambient',
        source: 'quill_scratch',
        volume: 0.1,
        interval: { min: 3000, max: 8000 },
      },
      {
        id: 'room',
        type: 'ambient',
        source: 'quiet_study',
        volume: 0.15,
      },
    ],
    transitions: {
      enter: { fadeIn: 800, effect: 'page_turn' },
      exit: { fadeOut: 600, effect: 'close' },
    },
  },

  [CHAMBERS.YOUTH]: {
    name: 'Learning Hall',
    description: 'Distant lectures, page turns, contemplative silence',
    layers: [
      {
        id: 'murmur',
        type: 'ambient',
        source: 'lecture_distant',
        volume: 0.08,
        pan: -0.5,
      },
      {
        id: 'pages',
        type: 'ambient',
        source: 'book_pages',
        volume: 0.15,
        interval: { min: 4000, max: 10000 },
      },
      {
        id: 'silence',
        type: 'ambient',
        source: 'contemplative_room',
        volume: 0.1,
      },
    ],
    transitions: {
      enter: { fadeIn: 600, effect: 'reveal' },
      exit: { fadeOut: 500, effect: 'close' },
    },
  },

  [CHAMBERS.INITIATION]: {
    name: 'Scholarly Focus',
    description: 'Deep concentration, occasional insight chime',
    layers: [
      {
        id: 'focus',
        type: 'drone',
        source: 'concentration_tone',
        volume: 0.1,
        note: 'C3',
      },
      {
        id: 'insight',
        type: 'melodic',
        source: 'insight_chime',
        volume: 0.15,
        interval: { min: 20000, max: 45000 },
      },
      {
        id: 'pen',
        type: 'ambient',
        source: 'pen_on_paper',
        volume: 0.12,
        interval: { min: 5000, max: 15000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 1000, effect: 'focus' },
      exit: { fadeOut: 800, effect: 'close' },
    },
  },

  [CHAMBERS.MASTERY]: {
    name: 'Scholar\'s Triumph',
    description: 'Satisfied silence, achievement notation, measured pride',
    layers: [
      {
        id: 'satisfaction',
        type: 'ambient',
        source: 'quiet_triumph',
        volume: 0.15,
      },
      {
        id: 'notation',
        type: 'melodic',
        source: 'notation_complete',
        volume: 0.2,
        interval: { min: 30000, max: 60000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 700, effect: 'reveal' },
      exit: { fadeOut: 500, effect: 'close' },
    },
  },

  [CHAMBERS.LEGACY]: {
    name: 'Archive Deep',
    description: 'Ancient texts, dusty wisdom, time passing',
    layers: [
      {
        id: 'archive',
        type: 'ambient',
        source: 'ancient_library',
        volume: 0.15,
      },
      {
        id: 'dust',
        type: 'ambient',
        source: 'dust_motes',
        volume: 0.05,
      },
      {
        id: 'clock',
        type: 'rhythmic',
        source: 'grandfather_clock',
        volume: 0.1,
        tempo: 60,
      },
    ],
    transitions: {
      enter: { fadeIn: 1200, effect: 'page_turn' },
      exit: { fadeOut: 1000, effect: 'close' },
    },
  },

  [CHAMBERS.ANCESTRAL]: {
    name: 'Genealogy Archive',
    description: 'Paper shuffling, reference cross-checking, discovery moments',
    layers: [
      {
        id: 'papers',
        type: 'ambient',
        source: 'paper_shuffle',
        volume: 0.15,
        interval: { min: 3000, max: 8000 },
      },
      {
        id: 'reference',
        type: 'ambient',
        source: 'book_close',
        volume: 0.1,
        interval: { min: 10000, max: 25000 },
      },
      {
        id: 'discovery',
        type: 'melodic',
        source: 'eureka_soft',
        volume: 0.12,
        interval: { min: 40000, max: 90000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 800, effect: 'reveal' },
      exit: { fadeOut: 600, effect: 'close' },
    },
  },

  [CHAMBERS.RITUAL]: {
    name: 'Methodical Practice',
    description: 'Measured steps, checklist completion, scholarly ritual',
    layers: [
      {
        id: 'metronome',
        type: 'rhythmic',
        source: 'metronome_soft',
        volume: 0.1,
        tempo: 72,
      },
      {
        id: 'checklist',
        type: 'melodic',
        source: 'check_mark',
        volume: 0.15,
        interval: { min: 15000, max: 30000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 600, effect: 'focus' },
      exit: { fadeOut: 500, effect: 'close' },
    },
  },

  [CHAMBERS.CODEX]: {
    name: 'Reference Room',
    description: 'Index cards, cross-references, organized knowledge',
    layers: [
      {
        id: 'index',
        type: 'ambient',
        source: 'card_flip',
        volume: 0.12,
        interval: { min: 2000, max: 6000 },
      },
      {
        id: 'ambient',
        type: 'ambient',
        source: 'reference_room',
        volume: 0.1,
      },
    ],
    transitions: {
      enter: { fadeIn: 500, effect: 'reveal' },
      exit: { fadeOut: 400, effect: 'close' },
    },
  },
};

// ============================================================================
// ARCHITECT MODE SOUNDSCAPES - Technical, Precise, Constructive
// ============================================================================

const ARCHITECT_SOUNDSCAPES = {
  [CHAMBERS.BIRTH]: {
    name: 'Blueprint Studio',
    description: 'Drafting sounds, ruler clicks, precise measurements',
    layers: [
      {
        id: 'drafting',
        type: 'ambient',
        source: 'pencil_draft',
        volume: 0.15,
        interval: { min: 2000, max: 5000 },
      },
      {
        id: 'ruler',
        type: 'melodic',
        source: 'ruler_snap',
        volume: 0.12,
        interval: { min: 5000, max: 12000 },
      },
      {
        id: 'ambient',
        type: 'ambient',
        source: 'studio_hum',
        volume: 0.08,
      },
    ],
    transitions: {
      enter: { fadeIn: 400, effect: 'snap' },
      exit: { fadeOut: 300, effect: 'collapse' },
    },
  },

  [CHAMBERS.YOUTH]: {
    name: 'Construction Phase',
    description: 'Building blocks, structural clicks, assembly sounds',
    layers: [
      {
        id: 'blocks',
        type: 'melodic',
        source: 'block_place',
        volume: 0.15,
        interval: { min: 3000, max: 8000 },
      },
      {
        id: 'structure',
        type: 'ambient',
        source: 'framework_creak',
        volume: 0.1,
        interval: { min: 10000, max: 20000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 350, effect: 'construct' },
      exit: { fadeOut: 300, effect: 'collapse' },
    },
  },

  [CHAMBERS.INITIATION]: {
    name: 'System Boot',
    description: 'Digital initialization, component checks, system ready',
    layers: [
      {
        id: 'boot',
        type: 'melodic',
        source: 'system_boot',
        volume: 0.2,
        playOnce: true,
      },
      {
        id: 'hum',
        type: 'drone',
        source: 'machine_hum',
        volume: 0.12,
        note: 'A2',
      },
      {
        id: 'ready',
        type: 'melodic',
        source: 'system_ready',
        volume: 0.15,
        delay: 2000,
        playOnce: true,
      },
    ],
    transitions: {
      enter: { fadeIn: 300, effect: 'boot' },
      exit: { fadeOut: 250, effect: 'shutdown' },
    },
  },

  [CHAMBERS.MASTERY]: {
    name: 'Optimized System',
    description: 'Efficient hum, performance metrics, green lights',
    layers: [
      {
        id: 'efficient',
        type: 'drone',
        source: 'optimized_hum',
        volume: 0.15,
        note: 'E3',
      },
      {
        id: 'metrics',
        type: 'melodic',
        source: 'metric_ping',
        volume: 0.1,
        interval: { min: 8000, max: 15000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 300, effect: 'snap' },
      exit: { fadeOut: 250, effect: 'collapse' },
    },
  },

  [CHAMBERS.LEGACY]: {
    name: 'Archive Database',
    description: 'Data retrieval, disk access, indexed memories',
    layers: [
      {
        id: 'retrieval',
        type: 'ambient',
        source: 'data_access',
        volume: 0.12,
        interval: { min: 4000, max: 10000 },
      },
      {
        id: 'disk',
        type: 'ambient',
        source: 'disk_spin',
        volume: 0.08,
      },
      {
        id: 'index',
        type: 'melodic',
        source: 'index_found',
        volume: 0.1,
        interval: { min: 15000, max: 30000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 400, effect: 'query' },
      exit: { fadeOut: 300, effect: 'close' },
    },
  },

  [CHAMBERS.ANCESTRAL]: {
    name: 'Network Graph',
    description: 'Node connections, edge creation, graph traversal',
    layers: [
      {
        id: 'connection',
        type: 'melodic',
        source: 'node_connect',
        volume: 0.15,
        interval: { min: 3000, max: 8000 },
      },
      {
        id: 'traverse',
        type: 'ambient',
        source: 'graph_traverse',
        volume: 0.1,
      },
      {
        id: 'ambient',
        type: 'drone',
        source: 'network_hum',
        volume: 0.08,
        note: 'C3',
      },
    ],
    transitions: {
      enter: { fadeIn: 350, effect: 'connect' },
      exit: { fadeOut: 300, effect: 'disconnect' },
    },
  },

  [CHAMBERS.RITUAL]: {
    name: 'Process Execution',
    description: 'Step completion, validation checks, process flow',
    layers: [
      {
        id: 'step',
        type: 'melodic',
        source: 'step_complete',
        volume: 0.15,
        interval: { min: 10000, max: 20000 },
      },
      {
        id: 'validation',
        type: 'melodic',
        source: 'validation_pass',
        volume: 0.12,
        interval: { min: 15000, max: 30000 },
      },
      {
        id: 'flow',
        type: 'ambient',
        source: 'process_hum',
        volume: 0.08,
      },
    ],
    transitions: {
      enter: { fadeIn: 300, effect: 'start' },
      exit: { fadeOut: 250, effect: 'complete' },
    },
  },

  [CHAMBERS.CODEX]: {
    name: 'Documentation Hub',
    description: 'Keyboard typing, code compilation, syntax validation',
    layers: [
      {
        id: 'typing',
        type: 'ambient',
        source: 'keyboard_mechanical',
        volume: 0.12,
        interval: { min: 1000, max: 4000 },
      },
      {
        id: 'compile',
        type: 'melodic',
        source: 'compile_success',
        volume: 0.15,
        interval: { min: 20000, max: 45000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 250, effect: 'load' },
      exit: { fadeOut: 200, effect: 'save' },
    },
  },
};

// ============================================================================
// SOVEREIGN MODE SOUNDSCAPES - Commanding, Strategic, Decisive
// ============================================================================

const SOVEREIGN_SOUNDSCAPES = {
  [CHAMBERS.BIRTH]: {
    name: 'Throne Dawn',
    description: 'Regal silence, distant horns, authority established',
    layers: [
      {
        id: 'silence',
        type: 'ambient',
        source: 'throne_room',
        volume: 0.1,
      },
      {
        id: 'horns',
        type: 'melodic',
        source: 'distant_horns',
        volume: 0.12,
        interval: { min: 30000, max: 60000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 300, effect: 'cut' },
      exit: { fadeOut: 200, effect: 'seal' },
    },
  },

  [CHAMBERS.YOUTH]: {
    name: 'Training Grounds',
    description: 'Disciplined practice, strategic movements, measured growth',
    layers: [
      {
        id: 'practice',
        type: 'ambient',
        source: 'training_ambient',
        volume: 0.12,
      },
      {
        id: 'movement',
        type: 'melodic',
        source: 'strategic_move',
        volume: 0.15,
        interval: { min: 8000, max: 15000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 250, effect: 'cut' },
      exit: { fadeOut: 200, effect: 'seal' },
    },
  },

  [CHAMBERS.INITIATION]: {
    name: 'Coronation',
    description: 'Crown placement, oath sworn, power accepted',
    layers: [
      {
        id: 'ceremony',
        type: 'drone',
        source: 'coronation_tone',
        volume: 0.15,
        note: 'D3',
      },
      {
        id: 'crown',
        type: 'melodic',
        source: 'crown_chime',
        volume: 0.2,
        playOnce: true,
      },
    ],
    transitions: {
      enter: { fadeIn: 350, effect: 'reveal' },
      exit: { fadeOut: 250, effect: 'seal' },
    },
  },

  [CHAMBERS.MASTERY]: {
    name: 'Command Center',
    description: 'Strategic overview, decisive clarity, controlled power',
    layers: [
      {
        id: 'command',
        type: 'drone',
        source: 'command_hum',
        volume: 0.12,
        note: 'G2',
      },
      {
        id: 'decision',
        type: 'melodic',
        source: 'decision_tone',
        volume: 0.15,
        interval: { min: 20000, max: 40000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 200, effect: 'cut' },
      exit: { fadeOut: 150, effect: 'seal' },
    },
  },

  [CHAMBERS.LEGACY]: {
    name: 'Dynasty Hall',
    description: 'Legacy echoes, succession preparation, timeless authority',
    layers: [
      {
        id: 'hall',
        type: 'ambient',
        source: 'dynasty_hall',
        volume: 0.12,
        reverb: 0.6,
      },
      {
        id: 'echoes',
        type: 'effect',
        source: 'legacy_echo',
        volume: 0.08,
        delay: 3000,
      },
    ],
    transitions: {
      enter: { fadeIn: 400, effect: 'emerge' },
      exit: { fadeOut: 300, effect: 'seal' },
    },
  },

  [CHAMBERS.ANCESTRAL]: {
    name: 'Lineage Vault',
    description: 'Power inheritance, bloodline resonance, ancestral authority',
    layers: [
      {
        id: 'vault',
        type: 'ambient',
        source: 'vault_deep',
        volume: 0.15,
      },
      {
        id: 'resonance',
        type: 'drone',
        source: 'bloodline_tone',
        volume: 0.12,
        note: 'E2',
      },
      {
        id: 'authority',
        type: 'melodic',
        source: 'ancestral_call',
        volume: 0.1,
        interval: { min: 25000, max: 50000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 350, effect: 'unseal' },
      exit: { fadeOut: 300, effect: 'seal' },
    },
  },

  [CHAMBERS.RITUAL]: {
    name: 'Command Invocation',
    description: 'Decisive action, sealed commitments, sovereign will',
    layers: [
      {
        id: 'invocation',
        type: 'drone',
        source: 'invocation_tone',
        volume: 0.15,
        note: 'D2',
      },
      {
        id: 'seal',
        type: 'melodic',
        source: 'wax_seal',
        volume: 0.2,
        interval: { min: 30000, max: 60000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 250, effect: 'command' },
      exit: { fadeOut: 200, effect: 'seal' },
    },
  },

  [CHAMBERS.CODEX]: {
    name: 'Strategic Archive',
    description: 'Intelligence reports, executive summaries, decisive knowledge',
    layers: [
      {
        id: 'archive',
        type: 'ambient',
        source: 'strategic_silence',
        volume: 0.1,
      },
      {
        id: 'report',
        type: 'melodic',
        source: 'report_ready',
        volume: 0.12,
        interval: { min: 25000, max: 50000 },
      },
    ],
    transitions: {
      enter: { fadeIn: 200, effect: 'cut' },
      exit: { fadeOut: 150, effect: 'classify' },
    },
  },
};

// ============================================================================
// MASTER SOUNDSCAPE MAP
// ============================================================================

export const MODE_CHAMBER_SOUNDSCAPES = {
  pilgrim: PILGRIM_SOUNDSCAPES,
  scholar: SCHOLAR_SOUNDSCAPES,
  architect: ARCHITECT_SOUNDSCAPES,
  sovereign: SOVEREIGN_SOUNDSCAPES,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get soundscape for a specific mode and chamber
 */
export function getSoundscape(mode, chamber) {
  const modeSoundscapes = MODE_CHAMBER_SOUNDSCAPES[mode];
  if (!modeSoundscapes) {
    console.warn(`Unknown mode: ${mode}`);
    return null;
  }

  const soundscape = modeSoundscapes[chamber];
  if (!soundscape) {
    console.warn(`Unknown chamber: ${chamber} for mode: ${mode}`);
    return null;
  }

  return soundscape;
}

/**
 * Get transition configuration for chamber change
 */
export function getChamberTransition(mode, fromChamber, toChamber) {
  const exitConfig = getSoundscape(mode, fromChamber)?.transitions?.exit;
  const enterConfig = getSoundscape(mode, toChamber)?.transitions?.enter;

  return {
    exit: exitConfig || { fadeOut: 500, effect: 'fade' },
    enter: enterConfig || { fadeIn: 500, effect: 'fade' },
    crossfade: Math.min(
      exitConfig?.fadeOut || 500,
      enterConfig?.fadeIn || 500
    ) / 2,
  };
}

/**
 * Get all layers for a soundscape
 */
export function getSoundscapeLayers(mode, chamber) {
  const soundscape = getSoundscape(mode, chamber);
  return soundscape?.layers || [];
}

/**
 * Get ambient layers only (background sounds)
 */
export function getAmbientLayers(mode, chamber) {
  return getSoundscapeLayers(mode, chamber).filter(
    (layer) => layer.type === 'ambient'
  );
}

/**
 * Get melodic layers only (musical elements)
 */
export function getMelodicLayers(mode, chamber) {
  return getSoundscapeLayers(mode, chamber).filter(
    (layer) => layer.type === 'melodic'
  );
}

/**
 * Get drone layers only (continuous tones)
 */
export function getDroneLayers(mode, chamber) {
  return getSoundscapeLayers(mode, chamber).filter(
    (layer) => layer.type === 'drone'
  );
}

/**
 * Calculate total volume for a soundscape
 */
export function calculateTotalVolume(mode, chamber) {
  const layers = getSoundscapeLayers(mode, chamber);
  return layers.reduce((total, layer) => total + (layer.volume || 0), 0);
}

/**
 * Get soundscape description for accessibility
 */
export function getSoundscapeDescription(mode, chamber) {
  const soundscape = getSoundscape(mode, chamber);
  if (!soundscape) return '';

  return `${soundscape.name}: ${soundscape.description}`;
}

// ============================================================================
// SOUNDSCAPE PLAYER CONFIGURATION
// ============================================================================

export const PLAYER_CONFIG = {
  masterVolume: 0.7,
  crossfadeDuration: 500,
  fadeInDuration: 1000,
  fadeOutDuration: 800,
  maxConcurrentLayers: 8,
  autoResume: true,
  respectReducedMotion: true,
};

/**
 * Apply volume scaling based on mode character
 */
export function getModeVolumeScale(mode) {
  const scales = {
    pilgrim: 0.8, // Softer, more meditative
    scholar: 0.7, // Quieter, for concentration
    architect: 0.6, // Minimal, functional
    sovereign: 0.75, // Present but controlled
  };

  return scales[mode] || 0.7;
}

export default MODE_CHAMBER_SOUNDSCAPES;
