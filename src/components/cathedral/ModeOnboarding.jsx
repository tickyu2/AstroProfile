/**
 * ModeOnboarding.jsx
 *
 * First-time mode experience sequences.
 * Introduces users to each Cathedral mode with tailored onboarding flows.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMode, CATHEDRAL_MODES, MODE_MATRIX } from './modeSystem';

// ============================================================================
// ONBOARDING CONTENT PER MODE
// ============================================================================

const ONBOARDING_SEQUENCES = {
  pilgrim: {
    title: 'Welcome, Pilgrim',
    subtitle: 'Your journey into the Cathedral begins',
    steps: [
      {
        id: 'welcome',
        title: 'The Path Awaits',
        content: `You've chosen to walk the Pilgrim's path—a journey of
          discovery guided by myth, symbol, and the wisdom of the stars.`,
        visual: 'lantern_glow',
        voiceLine: 'Welcome, seeker. The Cathedral recognizes your presence.',
      },
      {
        id: 'what_is_cathedral',
        title: 'What is the Cathedral?',
        content: `The Cathedral is a sacred space where ancient wisdom meets modern insight.
          Here, your birth chart becomes a map, and your ancestors speak through patterns.`,
        visual: 'cathedral_reveal',
        voiceLine: 'This is a place of deep knowing, not quick answers.',
      },
      {
        id: 'your_guide',
        title: 'Your Guide',
        content: `A gentle voice will accompany you—not to tell you what to think,
          but to illuminate what you already know. Trust the unfolding.`,
        visual: 'mentor_appear',
        voiceLine: 'I am here to walk beside you, not ahead of you.',
      },
      {
        id: 'first_steps',
        title: 'Your First Steps',
        content: `Begin by exploring your birth chart. Let the symbols speak.
          There's no rush—the path reveals itself to those who are patient.`,
        visual: 'chart_preview',
        action: 'start_journey',
        actionLabel: 'Begin Your Journey',
      },
    ],
    ambience: 'pilgrim_intro',
    duration: 'self_paced',
  },

  scholar: {
    title: 'Welcome, Scholar',
    subtitle: 'Knowledge illuminates the path',
    steps: [
      {
        id: 'welcome',
        title: 'The Study Opens',
        content: `You've chosen the Scholar's path—a way of careful observation,
          annotation, and deep understanding of astrological principles.`,
        visual: 'manuscript_open',
        voiceLine: 'Welcome to the study. Your inquiry honors the tradition.',
      },
      {
        id: 'the_codex',
        title: 'The Codex',
        content: `You'll have access to the Advanced Codex—annotated chapters
          explaining the mechanics behind every symbol and calculation.`,
        visual: 'codex_reveal',
        voiceLine: 'Knowledge is layered here. Take your time with each page.',
        highlight: 'codex_button',
      },
      {
        id: 'annotations',
        title: 'Margin Notes',
        content: `As you explore, you'll see margin annotations explaining
          concepts in context. Click any highlighted term to learn more.`,
        visual: 'annotation_demo',
        voiceLine: 'Every symbol has a story. The margins hold the keys.',
        interactive: 'annotation_example',
      },
      {
        id: 'begin_study',
        title: 'Begin Your Study',
        content: `Start with your natal chart. Notice the structural relationships
          between planets, signs, and houses. The patterns will teach you.`,
        visual: 'chart_annotated',
        action: 'start_study',
        actionLabel: 'Open Your Chart',
      },
    ],
    ambience: 'scholar_intro',
    duration: 'self_paced',
  },

  architect: {
    title: 'Welcome, Architect',
    subtitle: 'Full system access granted',
    steps: [
      {
        id: 'boot',
        title: 'System Initialization',
        content: `Architect mode activated. You now have access to the full
          computational architecture of the Cathedral.`,
        visual: 'boot_sequence',
        voiceLine: 'All systems online. Debug mode available.',
        showDebug: true,
      },
      {
        id: 'devtools',
        title: 'Developer Tools',
        content: `The DevTools overlay shows real-time overlay computations,
          delta contributions, and narrative generation pipelines.`,
        visual: 'devtools_demo',
        voiceLine: 'Press D to toggle DevTools at any time.',
        highlight: 'devtools_toggle',
        hotkey: 'D',
      },
      {
        id: 'overlays',
        title: '17 Overlay System',
        content: `The Cathedral runs 17 overlays in parallel. Each contributes
          to the final relationship score and narrative output.`,
        visual: 'overlay_diagram',
        voiceLine: 'Every number has a source. Every narrative has a formula.',
        showOverlayList: true,
      },
      {
        id: 'tuning',
        title: 'Rule Tuning',
        content: `You can adjust overlay weights and thresholds in real-time.
          Changes propagate immediately through the computation graph.`,
        visual: 'tuner_demo',
        voiceLine: 'The system responds to your adjustments.',
        interactive: 'weight_slider',
      },
      {
        id: 'begin_build',
        title: 'Begin Building',
        content: `Explore the architecture. Run diagnostics. Tune the system.
          The Cathedral is your workshop.`,
        visual: 'workshop_ready',
        action: 'start_architect',
        actionLabel: 'Open Workshop',
      },
    ],
    ambience: 'architect_intro',
    duration: 'quick',
  },

  sovereign: {
    title: 'Welcome, Sovereign',
    subtitle: 'The Cathedral awaits your command',
    steps: [
      {
        id: 'ascend',
        title: 'Ascension',
        content: `You've chosen the Sovereign's path—a way of strategic clarity,
          decisive action, and commanding presence.`,
        visual: 'throne_reveal',
        voiceLine: 'The Cathedral recognizes its Sovereign.',
      },
      {
        id: 'strategic_view',
        title: 'Strategic Overview',
        content: `Information will be presented in executive briefing format—
          clear summaries, action items, and timing windows.`,
        visual: 'briefing_format',
        voiceLine: 'Complexity is translated into actionable intelligence.',
      },
      {
        id: 'timing',
        title: 'Timing Intelligence',
        content: `The Cathedral will alert you to optimal windows for action.
          When the moment is right, you'll know.`,
        visual: 'timing_display',
        voiceLine: 'Timing is strategy made manifest.',
      },
      {
        id: 'command',
        title: 'Your Command',
        content: `The path responds to your decisions. Choose your focus,
          and the Cathedral will align to serve your mission.`,
        visual: 'command_seal',
        action: 'start_command',
        actionLabel: 'Take Command',
      },
    ],
    ambience: 'sovereign_intro',
    duration: 'focused',
  },
};

// ============================================================================
// CODEX CHAPTER INTROS PER MODE
// ============================================================================

export const CODEX_CHAPTER_INTROS = {
  pilgrim: {
    birth_chart: {
      title: 'The Sky at Your Birth',
      intro: `Every soul enters the world under a unique sky.
        This chapter explores the cosmic signature imprinted at your first breath.`,
      tone: 'mythic',
    },
    elements: {
      title: 'The Four Sacred Elements',
      intro: `Fire, Earth, Air, Water—these primal forces weave through
        everything that exists, including you. Discover your elemental nature.`,
      tone: 'mythic',
    },
    houses: {
      title: 'The Twelve Chambers of Life',
      intro: `Your chart is divided into twelve sacred chambers,
        each holding a different dimension of your earthly journey.`,
      tone: 'mythic',
    },
    aspects: {
      title: 'The Conversations Between Stars',
      intro: `Planets speak to each other across the void.
        Their conversations—harmonious and challenging—shape your inner world.`,
      tone: 'mythic',
    },
    transits: {
      title: 'The Turning of the Great Wheel',
      intro: `The sky continues to move after your birth.
        Current planetary positions activate different parts of your story.`,
      tone: 'mythic',
    },
  },

  scholar: {
    birth_chart: {
      title: 'Natal Chart Analysis',
      intro: `The natal chart is a mathematical snapshot of celestial positions
        at the moment of birth. This chapter covers calculation methods and interpretation frameworks.`,
      tone: 'academic',
      references: ['Ptolemy', 'Lilly', 'Rudhyar'],
    },
    elements: {
      title: 'Elemental Distribution Theory',
      intro: `Element balance analysis measures the proportion of planetary placements
        across Fire, Earth, Air, and Water signs. Learn the calculation methods and interpretive significance.`,
      tone: 'academic',
      formula: 'element_balance',
    },
    houses: {
      title: 'House Systems & Meanings',
      intro: `Houses represent domains of life experience. This chapter examines
        various house systems (Placidus, Koch, Whole Sign) and their interpretive implications.`,
      tone: 'academic',
      compare: ['Placidus', 'Koch', 'Whole Sign', 'Porphyry'],
    },
    aspects: {
      title: 'Aspect Theory & Orbs',
      intro: `Aspects are angular relationships between planets. This chapter covers
        major and minor aspects, orb tolerances, and aspect pattern recognition.`,
      tone: 'academic',
      showFormulas: true,
    },
    transits: {
      title: 'Transit Methodology',
      intro: `Transits track current planetary positions relative to the natal chart.
        Learn transit calculation, orb application, and timing techniques.`,
      tone: 'academic',
      showTimelines: true,
    },
  },

  architect: {
    birth_chart: {
      title: 'Chart Computation Pipeline',
      intro: `The natal chart computation runs through ephemeris calculation,
        coordinate transformation, and house cusp derivation. Full data structures documented here.`,
      tone: 'technical',
      showCode: true,
    },
    elements: {
      title: 'Element Engine',
      intro: `Element distribution is computed by iterating planet positions
        and aggregating sign-based element assignments. Weighted algorithms available.`,
      tone: 'technical',
      showAlgorithm: true,
    },
    houses: {
      title: 'House System Algorithms',
      intro: `Different house systems use different trigonometric calculations
        to derive cusps from the Ascendant and Midheaven. Implementation details below.`,
      tone: 'technical',
      showImplementation: true,
    },
    aspects: {
      title: 'Aspect Matrix Computation',
      intro: `The aspect matrix is an n×n comparison of all planetary longitudes,
        checking each pair against defined aspect angles within orb tolerances.`,
      tone: 'technical',
      showMatrix: true,
    },
    transits: {
      title: 'Transit Engine Architecture',
      intro: `The transit engine compares current ephemeris positions against
        natal positions, applying aspect detection and orb tracking over time.`,
      tone: 'technical',
      showDiagram: true,
    },
  },

  sovereign: {
    birth_chart: {
      title: 'Your Strategic Position',
      intro: `Your birth chart defines your strategic advantages and vulnerabilities.
        This briefing summarizes the key positions that matter for leadership.`,
      tone: 'executive',
      format: 'summary',
    },
    elements: {
      title: 'Your Elemental Strengths',
      intro: `Element balance indicates your natural modes of action.
        Know your strengths; leverage them strategically.`,
      tone: 'executive',
      format: 'bullet_points',
    },
    houses: {
      title: 'Domains of Influence',
      intro: `Houses reveal where your influence is strongest.
        Focus resources on favorable domains.`,
      tone: 'executive',
      format: 'priority_list',
    },
    aspects: {
      title: 'Internal Dynamics',
      intro: `Aspects reveal your internal strategic tensions and synergies.
        Understand what accelerates and what resists.`,
      tone: 'executive',
      format: 'strength_weakness',
    },
    transits: {
      title: 'Timing Windows',
      intro: `Current transits indicate favorable and unfavorable windows for action.
        Move when the window opens.`,
      tone: 'executive',
      format: 'timing_calendar',
    },
  },
};

// ============================================================================
// ONBOARDING STEP COMPONENT
// ============================================================================

const OnboardingStep = ({ step, mode, onNext, isLast }) => {
  const theme = MODE_MATRIX[mode];

  const stepStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '40px',
      textAlign: 'center',
      animation: 'stepFadeIn 500ms ease-out',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '16px',
    },
    content: {
      fontSize: '16px',
      lineHeight: '1.7',
      color: '#cbd5e1',
      maxWidth: '500px',
      marginBottom: '24px',
    },
    voiceLine: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: 'var(--mode-accent, #a855f7)',
      marginBottom: '32px',
      padding: '12px 20px',
      background: 'rgba(168, 85, 247, 0.1)',
      borderRadius: '8px',
      borderLeft: '3px solid var(--mode-accent, #a855f7)',
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 40px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    visual: {
      width: '200px',
      height: '200px',
      background: 'rgba(168, 85, 247, 0.1)',
      borderRadius: '50%',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '64px',
    },
  };

  return (
    <div style={stepStyles.container}>
      <div style={stepStyles.visual}>
        {theme?.icon || '🌙'}
      </div>
      <h2 style={stepStyles.title}>{step.title}</h2>
      <p style={stepStyles.content}>{step.content}</p>
      {step.voiceLine && (
        <div style={stepStyles.voiceLine}>"{step.voiceLine}"</div>
      )}
      <button
        style={stepStyles.button}
        onClick={onNext}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {step.actionLabel || (isLast ? 'Begin' : 'Continue')}
      </button>
    </div>
  );
};

// ============================================================================
// PROGRESS DOTS COMPONENT
// ============================================================================

const ProgressDots = ({ total, current }) => {
  const dotsStyles = {
    container: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginTop: '24px',
    },
    dot: (isActive, isCompleted) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: isActive
        ? 'var(--mode-accent, #a855f7)'
        : isCompleted
          ? 'rgba(168, 85, 247, 0.5)'
          : 'rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
    }),
  };

  return (
    <div style={dotsStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={dotsStyles.dot(i === current, i < current)}
        />
      ))}
    </div>
  );
};

// ============================================================================
// MAIN ONBOARDING COMPONENT
// ============================================================================

const ModeOnboarding = ({
  mode: propMode,
  onComplete,
  onSkip,
  showSkip = true,
}) => {
  const { mode: contextMode } = useMode();
  const activeMode = propMode || contextMode;

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sequence = ONBOARDING_SEQUENCES[activeMode] || ONBOARDING_SEQUENCES.pilgrim;
  const steps = sequence.steps;

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onComplete?.(activeMode);
    }
  }, [currentStep, steps.length, activeMode, onComplete]);

  const handleSkip = useCallback(() => {
    setIsComplete(true);
    onSkip?.(activeMode);
  }, [activeMode, onSkip]);

  const containerStyles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      borderRadius: '24px',
      padding: '40px',
      minHeight: '600px',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#94a3b8',
    },
    skipButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#94a3b8',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      cursor: 'pointer',
    },
    complete: {
      textAlign: 'center',
      padding: '80px 40px',
    },
    completeIcon: {
      fontSize: '80px',
      marginBottom: '24px',
    },
    completeTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '16px',
    },
    completeText: {
      fontSize: '16px',
      color: '#94a3b8',
    },
  };

  if (isComplete) {
    return (
      <div style={containerStyles.container}>
        <div style={containerStyles.complete}>
          <div style={containerStyles.completeIcon}>{MODE_MATRIX[activeMode]?.icon}</div>
          <h2 style={containerStyles.completeTitle}>You're Ready</h2>
          <p style={containerStyles.completeText}>
            The Cathedral awaits. Your {MODE_MATRIX[activeMode]?.label} journey begins now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles.container}>
      {showSkip && (
        <button
          style={containerStyles.skipButton}
          onClick={handleSkip}
        >
          Skip Intro
        </button>
      )}

      <header style={containerStyles.header}>
        <h1 style={containerStyles.title}>{sequence.title}</h1>
        <p style={containerStyles.subtitle}>{sequence.subtitle}</p>
      </header>

      <OnboardingStep
        step={steps[currentStep]}
        mode={activeMode}
        onNext={handleNext}
        isLast={currentStep === steps.length - 1}
      />

      <ProgressDots total={steps.length} current={currentStep} />

      <style>{`
        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

ModeOnboarding.propTypes = {
  mode: PropTypes.oneOf(Object.values(CATHEDRAL_MODES)),
  onComplete: PropTypes.func,
  onSkip: PropTypes.func,
  showSkip: PropTypes.bool,
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get onboarding sequence for a mode.
 */
export function getOnboardingSequence(mode) {
  return ONBOARDING_SEQUENCES[mode] || ONBOARDING_SEQUENCES.pilgrim;
}

/**
 * Get codex chapter intro for a mode and chapter.
 */
export function getCodexChapterIntro(mode, chapter) {
  const modeIntros = CODEX_CHAPTER_INTROS[mode] || CODEX_CHAPTER_INTROS.pilgrim;
  return modeIntros[chapter] || null;
}

/**
 * Check if user has completed onboarding for a mode.
 */
export function hasCompletedOnboarding(mode) {
  try {
    const key = `cathedral_onboarding_${mode}`;
    return localStorage.getItem(key) === 'completed';
  } catch {
    return false;
  }
}

/**
 * Mark onboarding as complete for a mode.
 */
export function markOnboardingComplete(mode) {
  try {
    const key = `cathedral_onboarding_${mode}`;
    localStorage.setItem(key, 'completed');
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeOnboarding;

export {
  ONBOARDING_SEQUENCES,
  OnboardingStep,
  ProgressDots,
  getOnboardingSequence,
  hasCompletedOnboarding,
  markOnboardingComplete,
};
