/**
 * modeRitualScripts.js
 *
 * Mode-specific ritual scripts defining the ceremonial flow
 * and guided experiences within the Cathedral.
 *
 * Each mode approaches rituals differently:
 * - Pilgrim: Immersive, mythic, transformative
 * - Scholar: Analytical, annotated, educational
 * - Architect: Structural, systematic, debuggable
 * - Sovereign: Strategic, decisive, commanding
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// RITUAL STEP TYPES
// ============================================================================

/**
 * Step types available in rituals:
 * - invoke: Call attention to something
 * - reveal: Show hidden information
 * - prompt: Ask for user input or reflection
 * - action: User takes an action
 * - transition: Move between states
 * - blessing: Receive insight or guidance
 * - integrate: Absorb and consolidate learning
 */

// ============================================================================
// PILGRIM RITUAL SCRIPTS
// ============================================================================

export const PILGRIM_RITUALS = {
  // Ancestral Connection Ritual
  ancestralConnection: {
    name: 'The Calling of the Ancestors',
    description: 'A gentle journey to connect with ancestral wisdom',
    duration: '8-12 minutes',

    opening: {
      narration: `Close your eyes for a moment. Feel the ground beneath you—
        solid, ancient, formed by countless generations.
        You stand at the threshold of your lineage.`,
      ambience: 'ancestral_whispers',
      pause: 5000,
    },

    steps: [
      {
        id: 'invoke',
        type: 'invoke',
        title: 'Invoking the Lineage',
        narration: `Imagine a golden thread extending from your heart,
          reaching back through time. It connects to your parents,
          their parents, and all who came before.`,
        visual: 'thread_animation',
        interaction: null,
        duration: 8000,
      },
      {
        id: 'reveal_patterns',
        type: 'reveal',
        title: 'Patterns Emerge',
        narration: `As the thread extends, you begin to see patterns—
          gifts passed down, wounds carried forward,
          lessons learned and forgotten.`,
        visual: 'pattern_emergence',
        data: 'ancestralPatterns',
        duration: 10000,
      },
      {
        id: 'prompt_recognition',
        type: 'prompt',
        title: 'Recognition',
        narration: `Which of these patterns do you recognize in yourself?
          There's no need to judge—only to witness.`,
        prompt: 'Select the patterns that resonate with you',
        options: 'from_data',
        multiSelect: true,
        duration: null, // User-controlled
      },
      {
        id: 'blessing',
        type: 'blessing',
        title: 'Ancestral Blessing',
        narration: `Your ancestors see you. They acknowledge the path you walk.
          Receive their blessing: "{blessing_text}"`,
        data: 'ancestralBlessing',
        visual: 'blessing_glow',
        duration: 8000,
      },
      {
        id: 'integrate',
        type: 'integrate',
        title: 'Integration',
        narration: `Carry this connection with you.
          The thread remains, even when you cannot see it.`,
        action: 'save_connection',
        duration: 5000,
      },
    ],

    closing: {
      narration: `When you're ready, gently return your awareness to the present.
        You are held by all who came before.`,
      visual: 'gentle_fade',
      pause: 3000,
    },
  },

  // Birth Chart Revelation
  birthRevelation: {
    name: 'The Moment of Your Becoming',
    description: 'Exploring the cosmic imprint of your birth',
    duration: '10-15 minutes',

    opening: {
      narration: `At the exact moment of your first breath,
        the cosmos arranged itself in a pattern never seen before
        and never to be repeated.`,
      ambience: 'cosmic_birth',
      pause: 4000,
    },

    steps: [
      {
        id: 'invoke_sky',
        type: 'invoke',
        title: 'The Sky at Your Birth',
        narration: `The sky wheels above you. Stars and planets
          align in their eternal dance, and you—
          you are the center of this mandala.`,
        visual: 'birth_sky_reveal',
        duration: 10000,
      },
      {
        id: 'reveal_sun',
        type: 'reveal',
        title: 'Your Essential Light',
        narration: `The Sun illuminates your core essence.
          In {sun_sign}, your light carries the quality of {sun_quality}.`,
        data: 'sunPlacement',
        visual: 'sun_highlight',
        duration: 8000,
      },
      {
        id: 'reveal_moon',
        type: 'reveal',
        title: 'Your Emotional Landscape',
        narration: `The Moon holds your emotional truth.
          In {moon_sign}, you feel most nourished by {moon_need}.`,
        data: 'moonPlacement',
        visual: 'moon_highlight',
        duration: 8000,
      },
      {
        id: 'reveal_rising',
        type: 'reveal',
        title: 'Your Emerging Self',
        narration: `Your Rising sign is the mask you wear,
          the first impression you make on the world.
          {rising_sign} rising means you approach life with {rising_approach}.`,
        data: 'risingSign',
        visual: 'ascendant_highlight',
        duration: 8000,
      },
      {
        id: 'prompt_resonance',
        type: 'prompt',
        title: 'Resonance Check',
        narration: `Which of these aspects feels most true to you right now?`,
        options: ['Sun essence', 'Moon needs', 'Rising approach'],
        singleSelect: true,
        duration: null,
      },
      {
        id: 'blessing_synthesis',
        type: 'blessing',
        title: 'Your Cosmic Signature',
        narration: `These three lights weave together into your unique signature.
          "{synthesis_message}"`,
        data: 'birthSynthesis',
        visual: 'trinity_merge',
        duration: 10000,
      },
    ],

    closing: {
      narration: `This pattern is yours alone.
        Not a fate to be feared, but a seed to be tended.`,
      visual: 'seed_glow',
      pause: 4000,
    },
  },
};

// ============================================================================
// SCHOLAR RITUAL SCRIPTS
// ============================================================================

export const SCHOLAR_RITUALS = {
  ancestralConnection: {
    name: 'Ancestral Pattern Analysis',
    description: 'An annotated exploration of generational inheritance',
    duration: '6-10 minutes',

    opening: {
      narration: `The study of ancestral patterns reveals how traits,
        behaviors, and archetypal energies transmit across generations.
        Let's examine your lineage systematically.`,
      annotation: 'Generational transmission follows both genetic and energetic pathways.',
      pause: 3000,
    },

    steps: [
      {
        id: 'examine_lineage',
        type: 'reveal',
        title: 'Lineage Mapping',
        narration: `Your generational signature shows several key patterns.
          Note the recurrence intervals and expression variations.`,
        visual: 'lineage_tree',
        annotations: [
          { target: 'pattern_1', note: 'Primary archetypal inheritance' },
          { target: 'pattern_2', note: 'Shadow material for integration' },
          { target: 'pattern_3', note: 'Latent gift awaiting activation' },
        ],
        duration: 8000,
      },
      {
        id: 'analyze_patterns',
        type: 'reveal',
        title: 'Pattern Analysis',
        narration: `Each pattern has a source generation and a transformation curve.
          The data suggests these key transmission points:`,
        data: 'patternAnalysis',
        visual: 'analysis_grid',
        showReferences: true,
        duration: 10000,
      },
      {
        id: 'compare_sources',
        type: 'prompt',
        title: 'Source Comparison',
        narration: `Compare these patterns with traditional astrological signatures.
          Which correlations do you find most significant?`,
        options: 'from_analysis',
        multiSelect: true,
        annotation: 'Cross-reference with Neptune/Pluto generational placements.',
        duration: null,
      },
      {
        id: 'synthesis',
        type: 'integrate',
        title: 'Synthesis',
        narration: `Based on this analysis, your ancestral profile suggests:
          "{synthesis_text}"`,
        data: 'scholarSynthesis',
        showCitations: true,
        duration: 8000,
      },
    ],

    closing: {
      narration: `This analysis provides a framework for understanding
        generational influence. Further study is available in the Advanced Codex.`,
      link: 'advanced_ancestral_codex',
      pause: 2000,
    },
  },

  birthRevelation: {
    name: 'Birth Chart Technical Analysis',
    description: 'Systematic examination of natal chart components',
    duration: '8-12 minutes',

    opening: {
      narration: `The natal chart encodes astronomical positions at birth
        into symbolic language. Let's examine each component methodically.`,
      annotation: 'Natal astrology: the study of celestial positions at birth time.',
      pause: 2000,
    },

    steps: [
      {
        id: 'chart_overview',
        type: 'reveal',
        title: 'Chart Overview',
        narration: `Your chart contains 10 planetary bodies distributed across
          12 signs and 12 houses, forming a network of geometric aspects.`,
        visual: 'chart_grid',
        annotations: [
          { target: 'planets', note: 'Planetary positions indicate archetypal energies' },
          { target: 'signs', note: 'Signs modify planetary expression' },
          { target: 'houses', note: 'Houses indicate life domains' },
          { target: 'aspects', note: 'Aspects show planetary relationships' },
        ],
        duration: 10000,
      },
      {
        id: 'element_analysis',
        type: 'reveal',
        title: 'Elemental Distribution',
        narration: `Element balance: Fire {fire}%, Earth {earth}%, Air {air}%, Water {water}%.
          This distribution indicates {element_interpretation}.`,
        data: 'elementBalance',
        visual: 'element_chart',
        showFormula: true,
        duration: 8000,
      },
      {
        id: 'modal_analysis',
        type: 'reveal',
        title: 'Modal Distribution',
        narration: `Quality balance: Cardinal {cardinal}%, Fixed {fixed}%, Mutable {mutable}%.
          Your modal signature suggests {modal_interpretation}.`,
        data: 'modalBalance',
        visual: 'modal_chart',
        showFormula: true,
        duration: 8000,
      },
      {
        id: 'aspect_network',
        type: 'reveal',
        title: 'Aspect Network',
        narration: `Key aspect patterns: {aspect_patterns}.
          These geometric relationships create dynamic tensions and harmonies.`,
        data: 'aspectNetwork',
        visual: 'aspect_lines',
        annotations: 'auto_generate',
        duration: 10000,
      },
      {
        id: 'synthesis',
        type: 'integrate',
        title: 'Technical Synthesis',
        narration: `Combining these factors, your chart signature is:
          "{technical_synthesis}"`,
        data: 'techSynthesis',
        showMethodology: true,
        duration: 6000,
      },
    ],

    closing: {
      narration: `For deeper analysis, access the Scholar's Codex chapters
        on aspect interpretation and house dynamics.`,
      links: ['aspect_codex', 'house_codex'],
      pause: 2000,
    },
  },
};

// ============================================================================
// ARCHITECT RITUAL SCRIPTS
// ============================================================================

export const ARCHITECT_RITUALS = {
  ancestralConnection: {
    name: 'Ancestral System Diagnostic',
    description: 'Full system analysis of generational data structures',
    duration: '5-8 minutes',

    opening: {
      narration: `Initializing ancestral pattern analysis engine.
        Loading generational overlay modules...`,
      visual: 'boot_sequence',
      showDebugLog: true,
      pause: 2000,
    },

    steps: [
      {
        id: 'load_data',
        type: 'reveal',
        title: 'Data Structure Load',
        narration: `Loading ancestral data nodes.
          Found {node_count} pattern instances across {gen_count} generations.`,
        visual: 'data_tree',
        showRawData: true,
        debug: {
          show: true,
          fields: ['nodeId', 'generation', 'patternType', 'strength'],
        },
        duration: 6000,
      },
      {
        id: 'run_analysis',
        type: 'action',
        title: 'Pattern Analysis Engine',
        narration: `Running pattern correlation algorithm...`,
        visual: 'processing_grid',
        showProgress: true,
        output: {
          format: 'json',
          fields: ['correlations', 'anomalies', 'predictions'],
        },
        duration: 8000,
      },
      {
        id: 'display_results',
        type: 'reveal',
        title: 'Analysis Results',
        narration: `Pattern analysis complete. Key findings:`,
        visual: 'results_grid',
        data: 'analysisResults',
        showOverlayContributions: true,
        showDeltaBreakdown: true,
        duration: 10000,
      },
      {
        id: 'tune_weights',
        type: 'prompt',
        title: 'Weight Adjustment',
        narration: `Adjust pattern weights for recalculation:`,
        interface: 'slider_grid',
        parameters: ['inheritance_weight', 'shadow_weight', 'gift_weight'],
        showImpact: true,
        duration: null,
      },
      {
        id: 'export',
        type: 'integrate',
        title: 'Export Results',
        narration: `Analysis complete. Data available for export.`,
        actions: ['copy_json', 'download_report', 'save_weights'],
        duration: 4000,
      },
    ],

    closing: {
      narration: `Ancestral diagnostic complete.
        All overlay contributions logged to debug console.`,
      showSummaryStats: true,
      pause: 1500,
    },
  },

  birthRevelation: {
    name: 'Birth Chart System Analysis',
    description: 'Technical deep-dive into natal computation',
    duration: '6-10 minutes',

    opening: {
      narration: `Loading birth chart computation engine.
        Initializing ephemeris calculations...`,
      visual: 'system_boot',
      showDebugLog: true,
      pause: 1500,
    },

    steps: [
      {
        id: 'compute_positions',
        type: 'reveal',
        title: 'Position Computation',
        narration: `Computing planetary positions for {birth_datetime}.
          Coordinate system: Tropical/Placidus.`,
        visual: 'computation_grid',
        showRawPositions: true,
        debug: {
          show: true,
          fields: ['planet', 'longitude', 'latitude', 'speed', 'house'],
        },
        duration: 8000,
      },
      {
        id: 'calculate_aspects',
        type: 'reveal',
        title: 'Aspect Calculation',
        narration: `Computing aspect matrix. Orb tolerance: {orb_setting}°.`,
        visual: 'aspect_matrix',
        showCalculations: true,
        data: 'aspectMatrix',
        duration: 8000,
      },
      {
        id: 'run_overlays',
        type: 'action',
        title: 'Overlay Pipeline',
        narration: `Running overlay pipeline: 17 overlays × {data_points} data points.`,
        visual: 'pipeline_view',
        showProgress: true,
        showOverlayStatus: true,
        duration: 10000,
      },
      {
        id: 'view_results',
        type: 'reveal',
        title: 'Overlay Results',
        narration: `Overlay computation complete. All delta contributions computed.`,
        visual: 'results_dashboard',
        tabs: ['raw_data', 'delta_breakdown', 'narrative_output'],
        duration: null,
      },
      {
        id: 'tune_system',
        type: 'prompt',
        title: 'System Tuning',
        narration: `Adjust computation parameters:`,
        interface: 'config_panel',
        parameters: ['orb_tolerance', 'house_system', 'overlay_weights'],
        showRecalcButton: true,
        duration: null,
      },
    ],

    closing: {
      narration: `System analysis complete.
        Full debug log available. Export options enabled.`,
      actions: ['export_json', 'export_csv', 'copy_config'],
      pause: 1000,
    },
  },
};

// ============================================================================
// SOVEREIGN RITUAL SCRIPTS
// ============================================================================

export const SOVEREIGN_RITUALS = {
  ancestralConnection: {
    name: 'Ancestral Strategic Briefing',
    description: 'Executive summary of lineage intelligence',
    duration: '4-6 minutes',

    opening: {
      narration: `Ancestral intelligence briefing. Key strategic insights follow.`,
      visual: 'briefing_header',
      pause: 2000,
    },

    steps: [
      {
        id: 'strategic_summary',
        type: 'reveal',
        title: 'Strategic Summary',
        narration: `Three ancestral forces shape your current position:`,
        visual: 'three_pillars',
        data: [
          { label: 'Inherited Strength', key: 'strength' },
          { label: 'Shadow to Command', key: 'shadow' },
          { label: 'Latent Advantage', key: 'gift' },
        ],
        duration: 8000,
      },
      {
        id: 'action_items',
        type: 'reveal',
        title: 'Action Items',
        narration: `Recommended strategic actions:`,
        visual: 'action_list',
        data: 'actionItems',
        format: 'bullet_priority',
        duration: 6000,
      },
      {
        id: 'decision_point',
        type: 'prompt',
        title: 'Strategic Decision',
        narration: `Select your primary focus:`,
        options: [
          { label: 'Amplify Strength', action: 'amplify' },
          { label: 'Transform Shadow', action: 'transform' },
          { label: 'Activate Gift', action: 'activate' },
        ],
        singleSelect: true,
        showProjectedOutcome: true,
        duration: null,
      },
      {
        id: 'directive',
        type: 'blessing',
        title: 'Strategic Directive',
        narration: `Your chosen path: {chosen_path}.
          Directive: "{directive_text}"`,
        visual: 'directive_seal',
        duration: 5000,
      },
    ],

    closing: {
      narration: `Briefing complete. The path responds to your decision.`,
      visual: 'seal_fade',
      pause: 2000,
    },
  },

  birthRevelation: {
    name: 'Birth Chart Command Brief',
    description: 'Executive natal intelligence summary',
    duration: '5-7 minutes',

    opening: {
      narration: `Natal intelligence brief. Core strategic positions follow.`,
      visual: 'command_header',
      pause: 1500,
    },

    steps: [
      {
        id: 'core_position',
        type: 'reveal',
        title: 'Core Position',
        narration: `Your cosmic position grants these strategic advantages:`,
        visual: 'position_summary',
        data: 'coreAdvantages',
        format: 'command_card',
        duration: 8000,
      },
      {
        id: 'timing_windows',
        type: 'reveal',
        title: 'Timing Windows',
        narration: `Current favorable windows for action:`,
        visual: 'timing_grid',
        data: 'timingWindows',
        highlight: 'optimal',
        duration: 6000,
      },
      {
        id: 'risk_assessment',
        type: 'reveal',
        title: 'Risk Assessment',
        narration: `Areas requiring vigilance:`,
        visual: 'risk_indicators',
        data: 'riskAreas',
        format: 'severity_list',
        duration: 5000,
      },
      {
        id: 'command_decision',
        type: 'prompt',
        title: 'Command Decision',
        narration: `Your strategic priority:`,
        options: [
          { label: 'Advance', description: 'Press current advantages' },
          { label: 'Consolidate', description: 'Strengthen current position' },
          { label: 'Pivot', description: 'Redirect resources to new sector' },
        ],
        singleSelect: true,
        duration: null,
      },
      {
        id: 'mission_directive',
        type: 'blessing',
        title: 'Mission Directive',
        narration: `Command acknowledged. Directive issued:
          "{mission_directive}"`,
        visual: 'command_seal',
        duration: 5000,
      },
    ],

    closing: {
      narration: `Brief concluded. The Cathedral awaits your next command.`,
      visual: 'throne_fade',
      pause: 2000,
    },
  },
};

// ============================================================================
// RITUAL UTILITIES
// ============================================================================

/**
 * Get ritual scripts for a mode.
 */
export function getRitualScripts(mode) {
  const scripts = {
    pilgrim: PILGRIM_RITUALS,
    scholar: SCHOLAR_RITUALS,
    architect: ARCHITECT_RITUALS,
    sovereign: SOVEREIGN_RITUALS,
  };
  return scripts[mode] || PILGRIM_RITUALS;
}

/**
 * Get a specific ritual by mode and ritual ID.
 */
export function getRitual(mode, ritualId) {
  const scripts = getRitualScripts(mode);
  return scripts[ritualId] || null;
}

/**
 * Get ritual step by ID within a ritual.
 */
export function getRitualStep(mode, ritualId, stepId) {
  const ritual = getRitual(mode, ritualId);
  if (!ritual) return null;
  return ritual.steps.find(step => step.id === stepId) || null;
}

/**
 * Calculate estimated ritual duration in milliseconds.
 */
export function calculateRitualDuration(ritual) {
  let totalMs = 0;

  if (ritual.opening?.pause) totalMs += ritual.opening.pause;
  if (ritual.closing?.pause) totalMs += ritual.closing.pause;

  ritual.steps.forEach(step => {
    if (step.duration) totalMs += step.duration;
    else totalMs += 30000; // Estimate 30s for user-controlled steps
  });

  return totalMs;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  PILGRIM_RITUALS,
  SCHOLAR_RITUALS,
  ARCHITECT_RITUALS,
  SOVEREIGN_RITUALS,
  getRitualScripts,
  getRitual,
  getRitualStep,
  calculateRitualDuration,
};
