/**
 * ============================================
 * ONE-CLICK READING
 * The Front Door of the Cathedral
 *
 * One button:
 * - Accepts birth data
 * - Runs the full pipeline
 * - Opens the Grand Hall
 * - Exposes all context to the UI
 *
 * "Enter your birth data, open the Cathedral."
 * ============================================
 */

import { runFullReadingPipeline, FullReading, BirthDataInput, ReadingOptions } from './fullReadingPipeline';
import { consultOracle, OracleResponse, OracleQuery } from './mythosOracle';
import { PilgrimJourney3 } from './pilgrimJourney3';
import { SimulationResult } from './lineageSimulationEngine';

// ==================== DATA MODEL ====================

/**
 * One-Click Reading context (exposed to UI)
 */
export interface OneClickContext {
  // Core reading
  reading: FullReading;

  // Extracted for easy access
  mythosArchetypes: string[];
  fusedNarratives: FusedNarrative[];
  journey3: PilgrimJourney3;
  simulation?: SimulationResult;

  // State
  isLoaded: boolean;
  loadedAt: Date;
  lang: 'en' | 'zh';
}

export interface FusedNarrative {
  theme: string;
  themeZh: string;
  source: 'technical' | 'ancestral' | 'mythos';
  content: string;
  contentZh: string;
}

/**
 * One-Click Reading input
 */
export interface OneClickInput {
  birthData: BirthDataInput;
  options?: ReadingOptions;
}

/**
 * One-Click Reading result
 */
export interface OneClickResult {
  success: boolean;
  context?: OneClickContext;
  error?: string;
  processingTime: number;
}

// ==================== GLOBAL STATE ====================

/**
 * Global window state (for UI access)
 */
declare global {
  interface Window {
    CATHEDRAL_CONTEXT?: OneClickContext;
    MYTHOS_ARCHETYPES?: string[];
    FUSED_NARRATIVES?: FusedNarrative[];
    PILGRIM_JOURNEY3?: PilgrimJourney3;
    LINEAGE_SIM?: SimulationResult;
  }
}

// ==================== ONE-CLICK ENGINE ====================

/**
 * Run a one-click full reading
 */
export async function runOneClickReading(input: OneClickInput): Promise<OneClickResult> {
  const startTime = Date.now();
  const { birthData, options = {} } = input;
  const lang = options.lang || 'en';

  try {
    // Validate birth data
    if (!birthData.year || !birthData.month || !birthData.day || birthData.hour === undefined) {
      return {
        success: false,
        error: 'Invalid birth data. Please provide year, month, day, and hour.',
        processingTime: Date.now() - startTime
      };
    }

    // Run full pipeline
    const reading = await runFullReadingPipeline(birthData, {
      ...options,
      includeSimulation: true,
      includeOracle: true
    });

    // Extract mythosArchetypes
    const mythosArchetypes = reading.mythos.primaryArchetypes;

    // Build fused narratives
    const fusedNarratives = buildFusedNarratives(reading, lang);

    // Get journey
    const journey3 = reading.journey.journey;

    // Get simulation (first scenario)
    const simulation = reading.simulation?.scenarios?.[0];

    // Build context
    const context: OneClickContext = {
      reading,
      mythosArchetypes,
      fusedNarratives,
      journey3,
      simulation,
      isLoaded: true,
      loadedAt: new Date(),
      lang
    };

    // Expose to window (for UI access)
    if (typeof window !== 'undefined') {
      window.CATHEDRAL_CONTEXT = context;
      window.MYTHOS_ARCHETYPES = mythosArchetypes;
      window.FUSED_NARRATIVES = fusedNarratives;
      window.PILGRIM_JOURNEY3 = journey3;
      window.LINEAGE_SIM = simulation;
    }

    return {
      success: true,
      context,
      processingTime: Date.now() - startTime
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processingTime: Date.now() - startTime
    };
  }
}

/**
 * Build fused narratives from reading
 */
function buildFusedNarratives(reading: FullReading, lang: 'en' | 'zh'): FusedNarrative[] {
  const narratives: FusedNarrative[] = [];

  // Technical narrative
  narratives.push({
    theme: 'Day Master Essence',
    themeZh: '日主本质',
    source: 'technical',
    content: `Your ${reading.technical.dayMasterElement} Day Master shapes your core nature.`,
    contentZh: `你的${reading.technical.dayMaster}日主塑造你的核心本性。`
  });

  // Ancestral narrative
  narratives.push({
    theme: 'Ancestral Echo',
    themeZh: '祖先回响',
    source: 'ancestral',
    content: reading.ancestral.ancestralMessage,
    contentZh: reading.ancestral.ancestralMessageZh
  });

  // Mythos narrative
  narratives.push({
    theme: 'Mythic Pattern',
    themeZh: '神话模式',
    source: 'mythos',
    content: reading.mythos.mythicNarrative,
    contentZh: reading.mythos.mythicNarrativeZh
  });

  // Life story
  narratives.push({
    theme: 'Life Story',
    themeZh: '人生故事',
    source: 'technical',
    content: reading.narrative.lifeStory,
    contentZh: reading.narrative.lifeStoryZh
  });

  return narratives;
}

/**
 * Ask the Mythos Oracle (convenience wrapper)
 */
export function askMythosOracle(
  pilgrimId: string,
  question: string,
  context?: OneClickContext
): OracleResponse {
  const query: OracleQuery = {
    type: 'general_guidance',
    specificQuestion: question,
    context: {
      activeArchetypes: context?.mythosArchetypes,
      currentStage: context?.journey3?.currentStage,
      dayMaster: context?.reading?.technical?.dayMaster
    },
    lang: context?.lang || 'en'
  };

  return consultOracle(query);
}

/**
 * Get current context from window
 */
export function getCurrentContext(): OneClickContext | undefined {
  if (typeof window !== 'undefined') {
    return window.CATHEDRAL_CONTEXT;
  }
  return undefined;
}

/**
 * Clear current context
 */
export function clearContext(): void {
  if (typeof window !== 'undefined') {
    window.CATHEDRAL_CONTEXT = undefined;
    window.MYTHOS_ARCHETYPES = undefined;
    window.FUSED_NARRATIVES = undefined;
    window.PILGRIM_JOURNEY3 = undefined;
    window.LINEAGE_SIM = undefined;
  }
}

// ==================== EXPORTS ====================

export {
  runOneClickReading,
  askMythosOracle,
  getCurrentContext,
  clearContext,
  buildFusedNarratives
};
