/**
 * PilgrimInitiationCeremony.jsx
 *
 * A 7-step mythic rite of passage for ancestral connection.
 * The Hero's Journey mapped to generational healing.
 *
 * Steps:
 * 1. The Calling - Hearing the ancestral whisper
 * 2. The Threshold - Crossing into sacred space
 * 3. The Descent - Going into the underworld of lineage
 * 4. The Encounter - Meeting the ancestor
 * 5. The Offering - Giving something of yourself
 * 6. The Blessing - Receiving ancestral wisdom
 * 7. The Return - Coming back transformed
 *
 * Part of the Cathedral UI system for GENESIS OS Soul Discovery Engine.
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ============================================================================
// CEREMONY STEPS CONFIGURATION
// ============================================================================

const CEREMONY_STEPS = [
  {
    id: 'calling',
    number: 1,
    name: 'The Calling',
    subtitle: 'Hearing the Ancestral Whisper',
    icon: '🌙',
    description: 'In the stillness, a voice calls from beyond time. Your ancestors beckon you to remember.',
    instruction: 'Close your eyes. Breathe deeply. Listen for the whisper that has echoed through generations.',
    color: '#818cf8',
    duration: 30,
  },
  {
    id: 'threshold',
    number: 2,
    name: 'The Threshold',
    subtitle: 'Crossing into Sacred Space',
    icon: '🚪',
    description: 'You stand at the gateway between worlds. Behind you is the ordinary; before you, the ancestral realm.',
    instruction: 'Visualize a doorway made of light. Step through with intention. Leave your doubts at the threshold.',
    color: '#f472b6',
    duration: 25,
  },
  {
    id: 'descent',
    number: 3,
    name: 'The Descent',
    subtitle: 'Journey into the Underworld',
    icon: '🌀',
    description: 'You spiral downward through layers of time, through births and deaths, joys and sorrows of your line.',
    instruction: 'Feel yourself descending. With each breath, go deeper into the ancestral memory.',
    color: '#a78bfa',
    duration: 40,
  },
  {
    id: 'encounter',
    number: 4,
    name: 'The Encounter',
    subtitle: 'Meeting Your Ancestor',
    icon: '👁️',
    description: 'In the depths, a presence emerges. An ancestor who carries wisdom you need.',
    instruction: 'Open your inner eyes. Who appears before you? What do they look like? What do you feel?',
    color: '#60a5fa',
    duration: 45,
  },
  {
    id: 'offering',
    number: 5,
    name: 'The Offering',
    subtitle: 'The Gift of Self',
    icon: '🕯️',
    description: 'Every encounter requires exchange. What do you bring to this meeting across time?',
    instruction: 'Offer something from your heart: gratitude, forgiveness, love, or simply your presence.',
    color: '#fbbf24',
    duration: 35,
  },
  {
    id: 'blessing',
    number: 6,
    name: 'The Blessing',
    subtitle: 'Receiving Ancestral Wisdom',
    icon: '✨',
    description: 'Your ancestor has a gift for you. Wisdom earned through their life, passed to your soul.',
    instruction: 'Open your hands and heart. Receive what is given. It may be words, an image, a feeling, or knowing.',
    color: '#34d399',
    duration: 40,
  },
  {
    id: 'return',
    number: 7,
    name: 'The Return',
    subtitle: 'Emerging Transformed',
    icon: '🌅',
    description: 'You rise back through the layers, carrying the blessing. The ordinary world awaits, but you are changed.',
    instruction: 'Slowly ascend. Feel your body. Wiggle your fingers. When ready, open your eyes as a changed being.',
    color: '#fb923c',
    duration: 30,
  },
];

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

const StepIndicator = ({ steps, currentStep, onStepClick, isActive }) => {
  const indicatorStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '20px',
    },
    step: (isCurrent, isCompleted, color) => ({
      width: isCurrent ? '48px' : '36px',
      height: isCurrent ? '48px' : '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isCompleted
        ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
        : isCurrent
          ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
          : 'rgba(255, 255, 255, 0.05)',
      border: isCurrent
        ? `3px solid ${color}`
        : isCompleted
          ? '2px solid transparent'
          : '2px solid rgba(255, 255, 255, 0.1)',
      cursor: isCompleted || isCurrent ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      fontSize: isCurrent ? '20px' : '16px',
      boxShadow: isCurrent ? `0 0 20px ${color}40` : 'none',
    }),
    connector: (isCompleted, color) => ({
      width: '24px',
      height: '3px',
      background: isCompleted
        ? `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
        : 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
    }),
  };

  return (
    <div style={indicatorStyles.container}>
      {steps.map((step, index) => {
        const isCurrent = currentStep === index;
        const isCompleted = currentStep > index;
        const prevStep = steps[index - 1];

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div
                style={indicatorStyles.connector(isCompleted, prevStep?.color || '#667eea')}
              />
            )}
            <div
              style={indicatorStyles.step(isCurrent, isCompleted, step.color)}
              onClick={() => (isCompleted || isCurrent) && onStepClick(index)}
              title={step.name}
            >
              {isCompleted ? '✓' : step.icon}
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

const StepContent = ({ step, isActive, timeRemaining, onComplete }) => {
  const contentStyles = {
    container: {
      textAlign: 'center',
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    icon: {
      fontSize: '64px',
      marginBottom: '24px',
      animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none',
    },
    stepNumber: {
      color: step.color,
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '8px',
    },
    name: {
      color: '#fff',
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    subtitle: {
      color: step.color,
      fontSize: '18px',
      fontStyle: 'italic',
      marginBottom: '32px',
    },
    description: {
      color: '#cbd5e1',
      fontSize: '16px',
      lineHeight: '1.8',
      marginBottom: '24px',
    },
    instruction: {
      background: `${step.color}15`,
      border: `1px solid ${step.color}40`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '32px',
    },
    instructionLabel: {
      color: step.color,
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    instructionText: {
      color: '#e2e8f0',
      fontSize: '15px',
      lineHeight: '1.6',
    },
    timer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    timerCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.05)',
      border: `3px solid ${step.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: '700',
      color: '#fff',
    },
    completeButton: {
      background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}cc 100%)`,
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 48px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 20px ${step.color}40`,
    },
  };

  return (
    <div style={contentStyles.container}>
      <div style={contentStyles.icon}>{step.icon}</div>
      <div style={contentStyles.stepNumber}>Step {step.number} of 7</div>
      <h2 style={contentStyles.name}>{step.name}</h2>
      <p style={contentStyles.subtitle}>{step.subtitle}</p>
      <p style={contentStyles.description}>{step.description}</p>

      <div style={contentStyles.instruction}>
        <div style={contentStyles.instructionLabel}>Your Practice</div>
        <p style={contentStyles.instructionText}>{step.instruction}</p>
      </div>

      {isActive && (
        <div style={contentStyles.timer}>
          <div style={contentStyles.timerCircle}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}

      <button
        style={contentStyles.completeButton}
        onClick={onComplete}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        {step.number === 7 ? 'Complete Ceremony' : 'Continue to Next Step'}
      </button>
    </div>
  );
};

// ============================================================================
// COMPLETION SCREEN COMPONENT
// ============================================================================

const CompletionScreen = ({ pilgrimName, blessingReceived, onRestart, onClose }) => {
  const completionStyles = {
    container: {
      textAlign: 'center',
      padding: '60px 20px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    icon: {
      fontSize: '80px',
      marginBottom: '24px',
      animation: 'glow 2s ease-in-out infinite',
    },
    title: {
      color: '#fff',
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '16px',
    },
    subtitle: {
      color: '#a78bfa',
      fontSize: '20px',
      marginBottom: '32px',
    },
    blessing: {
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '40px',
    },
    blessingLabel: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '16px',
    },
    blessingText: {
      color: '#e2e8f0',
      fontSize: '18px',
      lineHeight: '1.8',
      fontStyle: 'italic',
    },
    message: {
      color: '#94a3b8',
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '40px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    secondaryButton: {
      background: 'transparent',
      color: '#a78bfa',
      border: '2px solid #a78bfa',
      borderRadius: '12px',
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  const defaultBlessing = `Dear ${pilgrimName || 'Pilgrim'}, you carry within you the strength of all who came before.
Their struggles were not in vain—they led to you.
Their dreams continue through your living.
Walk forward with their blessing, and know you are never alone.`;

  return (
    <div style={completionStyles.container}>
      <div style={completionStyles.icon}>🌟</div>
      <h2 style={completionStyles.title}>The Ceremony is Complete</h2>
      <p style={completionStyles.subtitle}>You have walked the ancestral path</p>

      <div style={completionStyles.blessing}>
        <div style={completionStyles.blessingLabel}>Your Ancestral Blessing</div>
        <p style={completionStyles.blessingText}>
          {blessingReceived || defaultBlessing}
        </p>
      </div>

      <p style={completionStyles.message}>
        You have completed the Pilgrim's Initiation. The connection forged today
        remains with you. Return whenever you seek guidance from those who came before.
      </p>

      <div style={completionStyles.buttonGroup}>
        <button
          style={completionStyles.secondaryButton}
          onClick={onRestart}
        >
          Begin Again
        </button>
        <button
          style={completionStyles.primaryButton}
          onClick={onClose}
        >
          Exit Ceremony
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// WELCOME SCREEN COMPONENT
// ============================================================================

const WelcomeScreen = ({ pilgrimName, onBegin }) => {
  const welcomeStyles = {
    container: {
      textAlign: 'center',
      padding: '60px 20px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    icon: {
      fontSize: '72px',
      marginBottom: '24px',
    },
    title: {
      color: '#fff',
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '16px',
    },
    subtitle: {
      color: '#a78bfa',
      fontSize: '18px',
      marginBottom: '32px',
    },
    description: {
      color: '#cbd5e1',
      fontSize: '16px',
      lineHeight: '1.8',
      marginBottom: '40px',
    },
    stepsPreview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '40px',
    },
    stepPreview: (color) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    }),
    stepIcon: {
      fontSize: '24px',
    },
    stepName: {
      color: '#94a3b8',
      fontSize: '9px',
      textAlign: 'center',
    },
    beginButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      padding: '18px 64px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
    },
    warning: {
      color: '#94a3b8',
      fontSize: '13px',
      marginTop: '24px',
      fontStyle: 'italic',
    },
  };

  return (
    <div style={welcomeStyles.container}>
      <div style={welcomeStyles.icon}>🌌</div>
      <h1 style={welcomeStyles.title}>The Pilgrim's Initiation</h1>
      <p style={welcomeStyles.subtitle}>A Seven-Step Journey to Your Ancestors</p>

      <p style={welcomeStyles.description}>
        {pilgrimName ? `Welcome, ${pilgrimName}. ` : ''}
        You stand at the threshold of a sacred journey. In seven steps, you will
        cross between worlds, descend into the depths of your lineage, meet an
        ancestor who waits for you, and return transformed with their blessing.
      </p>

      <div style={welcomeStyles.stepsPreview}>
        {CEREMONY_STEPS.map((step) => (
          <div key={step.id} style={welcomeStyles.stepPreview(step.color)}>
            <span style={welcomeStyles.stepIcon}>{step.icon}</span>
            <span style={welcomeStyles.stepName}>{step.name}</span>
          </div>
        ))}
      </div>

      <button
        style={welcomeStyles.beginButton}
        onClick={onBegin}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.3)';
        }}
      >
        Begin the Ceremony
      </button>

      <p style={welcomeStyles.warning}>
        Find a quiet space. This ceremony takes approximately 4 minutes.
      </p>
    </div>
  );
};

// ============================================================================
// MAIN CEREMONY COMPONENT
// ============================================================================

const PilgrimInitiationCeremony = ({
  pilgrimName = '',
  ancestralData = null,
  onComplete,
  onClose,
}) => {
  const [ceremonyState, setCeremonyState] = useState('welcome'); // welcome, active, complete
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(CEREMONY_STEPS[0].duration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [blessingReceived, setBlessingReceived] = useState('');

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleBegin = useCallback(() => {
    setCeremonyState('active');
    setCurrentStep(0);
    setTimeRemaining(CEREMONY_STEPS[0].duration);
    setIsTimerActive(true);
  }, []);

  const handleStepComplete = useCallback(() => {
    if (currentStep < CEREMONY_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeRemaining(CEREMONY_STEPS[nextStep].duration);
    } else {
      // Ceremony complete
      setIsTimerActive(false);
      setCeremonyState('complete');

      // Generate blessing based on ancestral data
      const blessing = generateBlessing(pilgrimName, ancestralData);
      setBlessingReceived(blessing);

      onComplete?.({
        pilgrimName,
        completedAt: new Date().toISOString(),
        blessing,
      });
    }
  }, [currentStep, pilgrimName, ancestralData, onComplete]);

  const handleStepClick = useCallback((stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      setTimeRemaining(CEREMONY_STEPS[stepIndex].duration);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCeremonyState('welcome');
    setCurrentStep(0);
    setTimeRemaining(CEREMONY_STEPS[0].duration);
    setIsTimerActive(false);
    setBlessingReceived('');
  }, []);

  const generateBlessing = (name, data) => {
    const lineageTheme = data?.lineageArchetype || 'The Seekers';
    const coreGift = data?.inheritedGift || 'resilience';

    return `Beloved ${name || 'Pilgrim'}, child of ${lineageTheme},

You come from a line of souls who knew both shadow and light. They faced their fears so you could dream bigger. They carried wounds so you could find healing.

The gift of ${coreGift} flows through your veins—earned through generations of struggle and triumph. This is your inheritance.

Go forth with the blessing of all who came before. You are the living answer to prayers spoken in languages you may never know. Make your life a worthy continuation of their story.

With love across all time,
Your Ancestors`;
  };

  const ceremonyStyles = {
    container: {
      background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #0f172a 100%)',
      borderRadius: '20px',
      minHeight: '600px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '600px',
      height: '600px',
      background: `radial-gradient(circle, ${CEREMONY_STEPS[currentStep]?.color || '#667eea'}20 0%, transparent 70%)`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      transition: 'background 1s ease',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      padding: '24px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    title: {
      color: '#a78bfa',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#94a3b8',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  };

  return (
    <div style={ceremonyStyles.container}>
      {/* Ambient background glow */}
      <div style={ceremonyStyles.backgroundGlow} />

      <div style={ceremonyStyles.content}>
        {/* Header */}
        <div style={ceremonyStyles.header}>
          <div style={ceremonyStyles.title}>
            {ceremonyState === 'welcome' && 'Ancestral Ceremony'}
            {ceremonyState === 'active' && `Step ${currentStep + 1}: ${CEREMONY_STEPS[currentStep].name}`}
            {ceremonyState === 'complete' && 'Ceremony Complete'}
          </div>
          <button
            style={ceremonyStyles.closeButton}
            onClick={onClose}
          >
            Exit
          </button>
        </div>

        {/* Step Indicator (only during active ceremony) */}
        {ceremonyState === 'active' && (
          <StepIndicator
            steps={CEREMONY_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            isActive={isTimerActive}
          />
        )}

        {/* Main Content */}
        {ceremonyState === 'welcome' && (
          <WelcomeScreen
            pilgrimName={pilgrimName}
            onBegin={handleBegin}
          />
        )}

        {ceremonyState === 'active' && (
          <StepContent
            step={CEREMONY_STEPS[currentStep]}
            isActive={isTimerActive}
            timeRemaining={timeRemaining}
            onComplete={handleStepComplete}
          />
        )}

        {ceremonyState === 'complete' && (
          <CompletionScreen
            pilgrimName={pilgrimName}
            blessingReceived={blessingReceived}
            onRestart={handleRestart}
            onClose={onClose}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)); }
          50% { filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.9)); }
        }
      `}</style>
    </div>
  );
};

PilgrimInitiationCeremony.propTypes = {
  pilgrimName: PropTypes.string,
  ancestralData: PropTypes.shape({
    lineageArchetype: PropTypes.string,
    inheritedGift: PropTypes.string,
    emotionalInheritance: PropTypes.string,
    coreWound: PropTypes.string,
  }),
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

export default PilgrimInitiationCeremony;
