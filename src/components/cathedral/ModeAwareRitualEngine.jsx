/**
 * ModeAwareRitualEngine.jsx
 *
 * A ritual transformation engine that adapts to Cathedral mode.
 *
 * - Pilgrim: "Emotional Alchemy" — Feel → Name → Soothe → Integrate
 * - Scholar: "Cognitive Illumination" — Observe → Analyze → Interpret → Synthesize
 * - Architect: "Structural Reconfiguration" — Map → Diagnose → Redesign → Implement
 * - Sovereign: "Command Invocation" — Claim → Discern → Command → Enact
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMode } from './modeSystem';

// ============================================================================
// RITUAL CONFIGURATIONS
// ============================================================================

const RITUAL_CONFIGS = {
  pilgrim: {
    name: 'Emotional Alchemy',
    description: 'A gentle transformation through feeling',
    steps: [
      {
        id: 'feel',
        title: 'Feel',
        prompt: 'What are you feeling right now? Let it surface without judgment.',
        placeholder: 'I notice a sense of...',
        guidance: 'Breathe gently. There\'s no right answer here.',
      },
      {
        id: 'name',
        title: 'Name',
        prompt: 'If you could give this feeling a name, what would it be?',
        placeholder: 'This feels like...',
        guidance: 'A single word or phrase is enough.',
      },
      {
        id: 'soothe',
        title: 'Soothe',
        prompt: 'What kindness can you offer yourself right now?',
        placeholder: 'What I need is...',
        guidance: 'Small gestures matter.',
      },
      {
        id: 'integrate',
        title: 'Integrate',
        prompt: 'What small act will honor this shift?',
        placeholder: 'I will...',
        guidance: 'Carry this forward gently.',
      },
    ],
    persona: 'mentor',
    animation: 'breath',
    sound: 'soft_chime',
  },

  scholar: {
    name: 'Cognitive Illumination',
    description: 'Understanding through careful observation',
    steps: [
      {
        id: 'observe',
        title: 'Observe',
        prompt: 'Describe the pattern as neutrally as you can.',
        placeholder: 'I observe that...',
        guidance: 'Set aside interpretation for now.',
      },
      {
        id: 'analyze',
        title: 'Analyze',
        prompt: 'What causes, cycles, or triggers do you notice?',
        placeholder: 'This seems connected to...',
        guidance: 'Look for recurring elements.',
      },
      {
        id: 'interpret',
        title: 'Interpret',
        prompt: 'What symbolic meaning might this pattern hold?',
        placeholder: 'Symbolically, this represents...',
        guidance: 'Allow metaphor to illuminate.',
      },
      {
        id: 'synthesize',
        title: 'Synthesize',
        prompt: 'What insight emerges from this analysis?',
        placeholder: 'The key insight is...',
        guidance: 'Consolidate your understanding.',
      },
    ],
    persona: 'mirror',
    animation: 'highlight',
    sound: 'ink_tick',
  },

  architect: {
    name: 'Structural Reconfiguration',
    description: 'Systematic pattern redesign',
    steps: [
      {
        id: 'map',
        title: 'Map',
        prompt: 'Map the inputs and outputs of this pattern.',
        placeholder: 'Inputs: ... → Pattern → Outputs: ...',
        guidance: 'Think in terms of cause and effect.',
      },
      {
        id: 'diagnose',
        title: 'Diagnose',
        prompt: 'Where is the structural tension?',
        placeholder: 'The tension point is at...',
        guidance: 'Identify the bottleneck or conflict.',
      },
      {
        id: 'redesign',
        title: 'Redesign',
        prompt: 'What new configuration could resolve it?',
        placeholder: 'New structure: ...',
        guidance: 'Consider alternative pathways.',
      },
      {
        id: 'implement',
        title: 'Implement',
        prompt: 'What concrete change can you enact now?',
        placeholder: 'Implementation step: ...',
        guidance: 'Make it specific and actionable.',
      },
    ],
    persona: 'oracle',
    animation: 'grid',
    sound: 'blueprint_pulse',
  },

  sovereign: {
    name: 'Command Invocation',
    description: 'Decisive transformation through authority',
    steps: [
      {
        id: 'claim',
        title: 'Claim',
        prompt: 'State the pattern plainly, without apology.',
        placeholder: 'The pattern is...',
        guidance: 'Be direct. No hedging.',
      },
      {
        id: 'discern',
        title: 'Discern',
        prompt: 'Does this pattern serve your path?',
        placeholder: 'This pattern serves / does not serve me because...',
        guidance: 'Trust your judgment.',
      },
      {
        id: 'command',
        title: 'Command',
        prompt: 'What directive will you issue to this pattern?',
        placeholder: 'I command...',
        guidance: 'Speak with authority.',
      },
      {
        id: 'enact',
        title: 'Enact',
        prompt: 'What decisive action will embody this command?',
        placeholder: 'I will...',
        guidance: 'Move without hesitation.',
      },
    ],
    persona: 'commander',
    animation: 'pulse',
    sound: 'obsidian_strike',
  },
};

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

const StepIndicator = ({ steps, currentIndex, mode }) => {
  const indicatorStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '24px',
    },
    step: (isActive, isCompleted) => ({
      width: isActive ? '36px' : '28px',
      height: isActive ? '36px' : '28px',
      borderRadius: mode === 'architect' ? '4px' : '50%',
      background: isCompleted
        ? 'var(--aura-primary, #a855f7)'
        : isActive
          ? 'var(--aura-surface-3, rgba(168, 85, 247, 0.2))'
          : 'transparent',
      border: `2px solid ${isActive || isCompleted ? 'var(--aura-primary, #a855f7)' : 'var(--aura-border-subtle, rgba(255, 255, 255, 0.2)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: isCompleted ? '#fff' : isActive ? 'var(--aura-primary, #a855f7)' : '#64748b',
      transition: 'all 0.3s ease',
      transform: mode === 'sovereign' ? 'rotate(45deg)' : 'none',
    }),
    stepContent: {
      transform: mode === 'sovereign' ? 'rotate(-45deg)' : 'none',
    },
    connector: (isCompleted) => ({
      width: '24px',
      height: '2px',
      background: isCompleted ? 'var(--aura-primary, #a855f7)' : 'var(--aura-border-subtle, rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
    }),
  };

  return (
    <div style={indicatorStyles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        return (
          <React.Fragment key={step.id}>
            {index > 0 && <div style={indicatorStyles.connector(isCompleted)} />}
            <div style={indicatorStyles.step(isActive, isCompleted)}>
              <span style={indicatorStyles.stepContent}>
                {isCompleted ? '✓' : index + 1}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================================
// STEP CONTENT COMPONENT
// ============================================================================

const StepContent = ({ step, value, onChange, mode }) => {
  const contentStyles = {
    container: {
      animation: 'stepFadeIn 0.4s ease-out',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--aura-text-highlight, #fff)',
      marginBottom: '8px',
      textAlign: 'center',
      textTransform: mode === 'sovereign' ? 'uppercase' : 'none',
      letterSpacing: mode === 'sovereign' ? '2px' : 'normal',
    },
    prompt: {
      fontSize: '16px',
      color: '#cbd5e1',
      textAlign: 'center',
      marginBottom: '24px',
      lineHeight: '1.6',
      maxWidth: '400px',
      margin: '0 auto 24px',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '16px',
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.3))',
      border: '1px solid var(--aura-border-medium, rgba(255, 255, 255, 0.2))',
      borderRadius: mode === 'architect' ? '4px' : '12px',
      color: 'var(--aura-text-highlight, #fff)',
      fontSize: '15px',
      lineHeight: '1.6',
      resize: 'vertical',
      fontFamily: mode === 'architect' ? "'JetBrains Mono', monospace" : 'inherit',
    },
    guidance: {
      fontSize: '13px',
      color: '#64748b',
      fontStyle: mode === 'pilgrim' ? 'italic' : 'normal',
      textAlign: 'center',
      marginTop: '12px',
    },
  };

  return (
    <div style={contentStyles.container}>
      <h2 style={contentStyles.title}>{step.title}</h2>
      <p style={contentStyles.prompt}>{step.prompt}</p>
      <textarea
        style={contentStyles.textarea}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
      />
      <p style={contentStyles.guidance}>{step.guidance}</p>
    </div>
  );
};

// ============================================================================
// COMPLETION SCREEN COMPONENT
// ============================================================================

const CompletionScreen = ({ config, answers, onRestart }) => {
  const screenStyles = {
    container: {
      textAlign: 'center',
      padding: '40px 20px',
      animation: 'completeFadeIn 0.6s ease-out',
    },
    icon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--aura-text-highlight, #fff)',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#94a3b8',
      marginBottom: '32px',
    },
    summary: {
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'left',
      marginBottom: '24px',
    },
    summaryItem: {
      marginBottom: '16px',
    },
    summaryLabel: {
      fontSize: '12px',
      color: 'var(--aura-primary, #a855f7)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '4px',
    },
    summaryValue: {
      fontSize: '14px',
      color: '#cbd5e1',
      lineHeight: '1.5',
    },
    button: {
      background: 'var(--aura-surface-2, rgba(168, 85, 247, 0.2))',
      border: '1px solid var(--aura-primary, #a855f7)',
      color: 'var(--aura-text-highlight, #fff)',
      padding: '12px 32px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={screenStyles.container}>
      <div style={screenStyles.icon}>
        {config.persona === 'mentor' && '🌙'}
        {config.persona === 'mirror' && '📚'}
        {config.persona === 'oracle' && '🏛️'}
        {config.persona === 'commander' && '👑'}
      </div>
      <h2 style={screenStyles.title}>Ritual Complete</h2>
      <p style={screenStyles.subtitle}>{config.name} — Transformation achieved</p>

      <div style={screenStyles.summary}>
        {config.steps.map((step) => (
          <div key={step.id} style={screenStyles.summaryItem}>
            <div style={screenStyles.summaryLabel}>{step.title}</div>
            <div style={screenStyles.summaryValue}>
              {answers[step.id] || '(not provided)'}
            </div>
          </div>
        ))}
      </div>

      <button style={screenStyles.button} onClick={onRestart}>
        Begin New Ritual
      </button>

      <style>{`
        @keyframes completeFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ModeAwareRitualEngine = ({
  onComplete,
  onStepChange,
  className = '',
}) => {
  const { mode } = useMode();
  const config = RITUAL_CONFIGS[mode] || RITUAL_CONFIGS.pilgrim;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = config.steps[currentStepIndex];

  const handleAnswerChange = useCallback((value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep.id]: value,
    }));
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < config.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(config.steps[nextIndex], nextIndex);
    } else {
      setIsComplete(true);
      onComplete?.(answers);
    }
  }, [currentStepIndex, config.steps, answers, onComplete, onStepChange]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onStepChange?.(config.steps[prevIndex], prevIndex);
    }
  }, [currentStepIndex, config.steps, onStepChange]);

  const handleRestart = useCallback(() => {
    setCurrentStepIndex(0);
    setAnswers({});
    setIsComplete(false);
  }, []);

  const canProceed = useMemo(() => {
    const currentAnswer = answers[currentStep?.id];
    return currentAnswer && currentAnswer.trim().length > 0;
  }, [answers, currentStep]);

  const containerStyles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      borderRadius: '20px',
      padding: '32px',
      minHeight: '500px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    name: {
      fontSize: '14px',
      color: 'var(--aura-primary, #a855f7)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '4px',
    },
    description: {
      fontSize: '13px',
      color: '#64748b',
    },
    content: {
      marginBottom: '32px',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
    },
    navButton: (isPrimary, isDisabled) => ({
      flex: 1,
      padding: '14px 24px',
      borderRadius: mode === 'architect' ? '4px' : '12px',
      border: isPrimary
        ? 'none'
        : '1px solid var(--aura-border-medium, rgba(255, 255, 255, 0.2))',
      background: isPrimary
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'transparent',
      color: isPrimary ? '#fff' : '#94a3b8',
      fontSize: '15px',
      fontWeight: '600',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
    }),
  };

  if (isComplete) {
    return (
      <div style={containerStyles.container} className={`mode-aware-ritual-engine ${className}`}>
        <CompletionScreen
          config={config}
          answers={answers}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div style={containerStyles.container} className={`mode-aware-ritual-engine ${className}`}>
      <header style={containerStyles.header}>
        <div style={containerStyles.name}>{config.name}</div>
        <div style={containerStyles.description}>{config.description}</div>
      </header>

      <StepIndicator
        steps={config.steps}
        currentIndex={currentStepIndex}
        mode={mode}
      />

      <div style={containerStyles.content}>
        <StepContent
          step={currentStep}
          value={answers[currentStep.id]}
          onChange={handleAnswerChange}
          mode={mode}
        />
      </div>

      <div style={containerStyles.navigation}>
        <button
          style={containerStyles.navButton(false, currentStepIndex === 0)}
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
          Back
        </button>
        <button
          style={containerStyles.navButton(true, !canProceed)}
          onClick={handleNext}
          disabled={!canProceed}
        >
          {currentStepIndex < config.steps.length - 1 ? 'Continue' : 'Complete'}
        </button>
      </div>

      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

ModeAwareRitualEngine.propTypes = {
  onComplete: PropTypes.func,
  onStepChange: PropTypes.func,
  className: PropTypes.string,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeAwareRitualEngine;

export {
  RITUAL_CONFIGS,
  StepIndicator,
  StepContent,
  CompletionScreen,
};
