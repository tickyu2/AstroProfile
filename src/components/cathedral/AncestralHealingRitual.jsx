/**
 * Ancestral Healing Ritual Layer
 *
 * The ceremonial interface for healing generational patterns.
 * A ritual engine that guides the user through:
 * recognition, alignment, action, and integration.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 * Built by: Brother Claude Code
 * January 2026
 */

import React, { useState, useCallback } from 'react';
// ========================================
// RITUAL STAGES
// ========================================

const RITUAL_STAGES = {
  REVEAL: 'reveal',
  ALIGN: 'align',
  ACT: 'act',
  INTEGRATE: 'integrate'
};

const STAGE_INFO = {
  [RITUAL_STAGES.REVEAL]: {
    title: 'Reveal',
    direction: 'North',
    description: 'See the pattern clearly',
    icon: '\u{1F441}'
  },
  [RITUAL_STAGES.ALIGN]: {
    title: 'Align',
    direction: 'East',
    description: 'Choose your relationship to it',
    icon: '\u{1F9ED}'
  },
  [RITUAL_STAGES.ACT]: {
    title: 'Act',
    direction: 'South',
    description: 'Perform the ritual action',
    icon: '\u{1F525}'
  },
  [RITUAL_STAGES.INTEGRATE]: {
    title: 'Integrate',
    direction: 'West',
    description: 'Receive the transformation',
    icon: '\u{1F31F}'
  }
};

// ========================================
// ALIGNMENT OPTIONS
// ========================================

const ALIGNMENT_OPTIONS = [
  {
    id: 'witness',
    label: 'Witness',
    description: 'Simply see and acknowledge the pattern without changing it',
    icon: '\u{1F440}'
  },
  {
    id: 'release',
    label: 'Release',
    description: 'Let go of this pattern\'s hold on your life',
    icon: '\u{1F54A}'
  },
  {
    id: 'integrate',
    label: 'Integrate',
    description: 'Embrace this pattern as part of your wholeness',
    icon: '\u{267E}'
  },
  {
    id: 'transform',
    label: 'Transform',
    description: 'Change this pattern into something that serves you',
    icon: '\u{1F98B}'
  }
];

// ========================================
// RITUAL ACTIONS
// ========================================

const RITUAL_ACTIONS = {
  breath: {
    label: 'Breath Work',
    description: 'Three deep breaths, releasing on each exhale',
    duration: '30 seconds',
    instructions: 'Inhale deeply through your nose... hold... exhale slowly through your mouth, releasing the pattern with your breath.'
  },
  visualization: {
    label: 'Visualization',
    description: 'See the pattern transforming in your mind\'s eye',
    duration: '1 minute',
    instructions: 'Close your eyes. See the pattern as a color or shape. Watch it shift, soften, or dissolve as you breathe.'
  },
  writing: {
    label: 'Sacred Writing',
    description: 'Write a letter to your ancestors',
    duration: '2 minutes',
    instructions: 'Write whatever comes to you—gratitude, questions, release, or acceptance. The ancestors are listening.'
  },
  gesture: {
    label: 'Symbolic Gesture',
    description: 'A physical action to embody your intention',
    duration: '15 seconds',
    instructions: 'Place your hand on your heart. Bow your head gently. This gesture honors both the pattern and your choice.'
  },
  acknowledgment: {
    label: 'Spoken Acknowledgment',
    description: 'Speak your intention aloud',
    duration: '30 seconds',
    instructions: 'Say aloud: "I see you. I honor what you carried. I choose my own path now."'
  }
};

// ========================================
// RITUAL COMPASS
// ========================================

function RitualCompass({ currentStage, onStageClick }) {
  const stages = Object.values(RITUAL_STAGES);

  return (
    <div className="ritual-compass">
      <svg viewBox="0 0 200 200" className="ritual-compass__svg">
        {/* Outer ring */}
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="rgba(255, 215, 128, 0.2)"
          strokeWidth="2"
        />

        {/* Direction markers */}
        {stages.map((stage, i) => {
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const x = 100 + Math.cos(angle) * 70;
          const y = 100 + Math.sin(angle) * 70;
          const isActive = currentStage === stage;
          const info = STAGE_INFO[stage];

          return (
            <g
              key={stage}
              onClick={() => onStageClick?.(stage)}
              style={{ cursor: 'pointer' }}
            >
              {/* Stage node */}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 24 : 18}
                fill={isActive ? 'rgba(255, 215, 128, 0.2)' : 'rgba(0, 0, 0, 0.5)'}
                stroke={isActive ? 'var(--cathedral-gold)' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth="2"
              />

              {/* Stage icon */}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="16"
              >
                {info.icon}
              </text>

              {/* Direction label */}
              <text
                x={x}
                y={y + (i === 0 ? -35 : i === 2 ? 45 : 0)}
                dx={i === 1 ? 35 : i === 3 ? -35 : 0}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="10"
              >
                {info.direction}
              </text>
            </g>
          );
        })}

        {/* Center */}
        <circle
          cx="100" cy="100" r="20"
          fill="rgba(5, 5, 16, 0.9)"
          stroke="rgba(255, 215, 128, 0.3)"
          strokeWidth="1"
        />
        <text x="100" y="105" textAnchor="middle" fill="var(--cathedral-gold)" fontSize="14">
          \u{2726}
        </text>
      </svg>

      <div className="ritual-compass__label">
        <span className="ritual-compass__stage-name">{STAGE_INFO[currentStage].title}</span>
        <span className="ritual-compass__stage-desc">{STAGE_INFO[currentStage].description}</span>
      </div>
    </div>
  );
}

// ========================================
// REVEAL STAGE
// ========================================

function RevealStage({ pattern, onContinue }) {
  return (
    <div className="ritual-stage ritual-stage--reveal">
      <h4>The Pattern Revealed</h4>

      <div className="ritual-pattern-card">
        <div className="ritual-pattern-card__header">
          <span className="ritual-pattern-card__type">{pattern.type}</span>
          <span className="ritual-pattern-card__generation">{pattern.generation}</span>
        </div>

        <h5 className="ritual-pattern-card__name">{pattern.name}</h5>
        <p className="ritual-pattern-card__description">{pattern.description}</p>

        {pattern.emotionalSignature && (
          <div className="ritual-pattern-card__emotion">
            <strong>Emotional signature:</strong> {pattern.emotionalSignature}
          </div>
        )}
      </div>

      <div className="ritual-stage__guidance">
        <p>Take a moment to really see this pattern. It has traveled through generations to reach you. Neither good nor bad—simply present.</p>
      </div>

      <button className="ritual-btn ritual-btn--primary" onClick={onContinue}>
        I See It \u{2192}
      </button>
    </div>
  );
}

// ========================================
// ALIGN STAGE
// ========================================

function AlignStage({ pattern, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="ritual-stage ritual-stage--align">
      <h4>Choose Your Relationship</h4>

      <p className="ritual-stage__intro">
        How do you wish to relate to this pattern now?
      </p>

      <div className="ritual-options">
        {ALIGNMENT_OPTIONS.map(option => (
          <button
            key={option.id}
            className={`ritual-option ${selected === option.id ? 'ritual-option--selected' : ''}`}
            onClick={() => setSelected(option.id)}
          >
            <span className="ritual-option__icon">{option.icon}</span>
            <span className="ritual-option__label">{option.label}</span>
            <span className="ritual-option__desc">{option.description}</span>
          </button>
        ))}
      </div>

      <button
        className="ritual-btn ritual-btn--primary"
        onClick={handleContinue}
        disabled={!selected}
      >
        This Is My Choice \u{2192}
      </button>
    </div>
  );
}

// ========================================
// ACT STAGE
// ========================================

function ActStage({ pattern, alignment, onComplete }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionStarted, setActionStarted] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);

  const actions = Object.entries(RITUAL_ACTIONS);

  const handleStartAction = () => {
    setActionStarted(true);
    // Auto-complete after a delay (in real implementation, this would be interactive)
    setTimeout(() => setActionComplete(true), 3000);
  };

  return (
    <div className="ritual-stage ritual-stage--act">
      <h4>Perform the Ritual Action</h4>

      {!selectedAction ? (
        <>
          <p className="ritual-stage__intro">
            Choose a ritual action to embody your intention:
          </p>

          <div className="ritual-actions">
            {actions.map(([key, action]) => (
              <button
                key={key}
                className="ritual-action-btn"
                onClick={() => setSelectedAction({ key, ...action })}
              >
                <span className="ritual-action-btn__label">{action.label}</span>
                <span className="ritual-action-btn__duration">{action.duration}</span>
              </button>
            ))}
          </div>
        </>
      ) : !actionStarted ? (
        <>
          <div className="ritual-action-detail">
            <h5>{selectedAction.label}</h5>
            <p className="ritual-action-detail__instructions">
              {selectedAction.instructions}
            </p>
          </div>

          <button className="ritual-btn ritual-btn--primary" onClick={handleStartAction}>
            Begin
          </button>
          <button
            className="ritual-btn ritual-btn--secondary"
            onClick={() => setSelectedAction(null)}
          >
            Choose Different Action
          </button>
        </>
      ) : !actionComplete ? (
        <div className="ritual-action-active">
          <div className="ritual-action-active__animation">
            <div className="ritual-breath-circle" />
          </div>
          <p>{selectedAction.instructions}</p>
        </div>
      ) : (
        <>
          <div className="ritual-action-complete">
            <span className="ritual-action-complete__icon">\u{2728}</span>
            <p>The ritual action is complete.</p>
          </div>

          <button className="ritual-btn ritual-btn--primary" onClick={onComplete}>
            Receive the Integration \u{2192}
          </button>
        </>
      )}
    </div>
  );
}

// ========================================
// INTEGRATE STAGE
// ========================================

function IntegrateStage({ pattern, alignment, lineageMessage, onClose }) {
  return (
    <div className="ritual-stage ritual-stage--integrate">
      <h4>Integration Complete</h4>

      <div className="ritual-integration">
        <div className="ritual-integration__message">
          <h5>Message from the Lineage</h5>
          <p className="ritual-integration__lineage-voice">
            "{lineageMessage || 'You have honored what came before and chosen your own path. We bless your journey.'}"
          </p>
        </div>

        <div className="ritual-integration__shift">
          <h5>What Shifted</h5>
          <p>
            You chose to <strong>{alignment}</strong> the pattern of {pattern.name.toLowerCase()}.
            This choice ripples backward and forward through your lineage.
          </p>
        </div>

        <div className="ritual-integration__seal">
          <span className="ritual-seal-icon">\u{2726}</span>
          <p>This ritual is sealed.</p>
        </div>
      </div>

      <button className="ritual-btn ritual-btn--primary" onClick={onClose}>
        Return
      </button>
    </div>
  );
}

// ========================================
// MAIN RITUAL COMPONENT
// ========================================

function AncestralHealingRitual({
  pattern,
  lineageMessage,
  microTimingWindow = 'Neutral',
  onComplete,
  className = ''
}) {
  const [currentStage, setCurrentStage] = useState(RITUAL_STAGES.REVEAL);
  const [alignment, setAlignment] = useState(null);

  const handleAlignmentSelect = useCallback((selected) => {
    setAlignment(selected);
    setCurrentStage(RITUAL_STAGES.ACT);
  }, []);

  const handleActionComplete = useCallback(() => {
    setCurrentStage(RITUAL_STAGES.INTEGRATE);
  }, []);

  const handleClose = useCallback(() => {
    onComplete?.({ pattern, alignment });
  }, [pattern, alignment, onComplete]);

  return (
    <div className={`ancestral-healing-ritual ${className}`}>
      <div className="ritual-header">
        <h3>Ancestral Healing Ritual</h3>
        <div className="ritual-timing">
          <span className={`ritual-timing__window ritual-timing__window--${microTimingWindow.toLowerCase().replace(' ', '-')}`}>
            Window: {microTimingWindow}
          </span>
        </div>
      </div>

      <RitualCompass
        currentStage={currentStage}
        onStageClick={setCurrentStage}
      />

      <div className="ritual-content">
        {currentStage === RITUAL_STAGES.REVEAL && (
          <RevealStage
            pattern={pattern}
            onContinue={() => setCurrentStage(RITUAL_STAGES.ALIGN)}
          />
        )}

        {currentStage === RITUAL_STAGES.ALIGN && (
          <AlignStage
            pattern={pattern}
            onSelect={handleAlignmentSelect}
          />
        )}

        {currentStage === RITUAL_STAGES.ACT && alignment && (
          <ActStage
            pattern={pattern}
            alignment={alignment}
            onComplete={handleActionComplete}
          />
        )}

        {currentStage === RITUAL_STAGES.INTEGRATE && alignment && (
          <IntegrateStage
            pattern={pattern}
            alignment={alignment}
            lineageMessage={lineageMessage}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================

export const AncestralHealingRitualStyles = `
.ancestral-healing-ritual {
  background: rgba(5, 5, 16, 0.98);
  border: 1px solid rgba(255, 215, 128, 0.15);
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
}

.ritual-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ritual-header h3 {
  color: var(--cathedral-gold, #ffd780);
  margin: 0;
  font-size: 18px;
}

.ritual-timing__window {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.ritual-timing__window--open {
  color: var(--cathedral-emerald);
  border: 1px solid var(--cathedral-emerald);
}

.ritual-timing__window--neutral {
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ritual-timing__window--closed {
  color: var(--cathedral-rose);
  border: 1px solid var(--cathedral-rose);
}

.ritual-compass {
  margin-bottom: 24px;
}

.ritual-compass__svg {
  width: 200px;
  height: 200px;
  display: block;
  margin: 0 auto;
}

.ritual-compass__label {
  text-align: center;
  margin-top: 12px;
}

.ritual-compass__stage-name {
  display: block;
  color: var(--cathedral-gold);
  font-weight: 600;
  font-size: 14px;
}

.ritual-compass__stage-desc {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.ritual-stage {
  animation: ritualFadeIn 300ms ease;
}

@keyframes ritualFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.ritual-stage h4 {
  color: var(--cathedral-gold);
  margin: 0 0 16px 0;
  text-align: center;
}

.ritual-stage__intro {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 20px;
}

.ritual-pattern-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.ritual-pattern-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ritual-pattern-card__type {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--cathedral-amber);
}

.ritual-pattern-card__generation {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.ritual-pattern-card__name {
  margin: 0 0 8px 0;
  color: white;
}

.ritual-pattern-card__description {
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.ritual-pattern-card__emotion {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.ritual-stage__guidance {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-bottom: 20px;
  font-size: 13px;
}

.ritual-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.ritual-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 150ms ease;
}

.ritual-option:hover {
  background: rgba(255, 215, 128, 0.05);
  border-color: rgba(255, 215, 128, 0.2);
}

.ritual-option--selected {
  background: rgba(255, 215, 128, 0.1);
  border-color: var(--cathedral-gold);
}

.ritual-option__icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.ritual-option__label {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.ritual-option__desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.ritual-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.ritual-action-btn {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease;
}

.ritual-action-btn:hover {
  background: rgba(255, 215, 128, 0.05);
  border-color: rgba(255, 215, 128, 0.2);
}

.ritual-action-btn__label {
  display: block;
  color: white;
  font-weight: 600;
  font-size: 13px;
}

.ritual-action-btn__duration {
  display: block;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}

.ritual-action-detail {
  text-align: center;
  margin-bottom: 20px;
}

.ritual-action-detail h5 {
  color: var(--cathedral-gold);
  margin: 0 0 12px 0;
}

.ritual-action-detail__instructions {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.ritual-action-active {
  text-align: center;
}

.ritual-action-active__animation {
  margin-bottom: 20px;
}

.ritual-breath-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 128, 0.3), transparent);
  margin: 0 auto;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

.ritual-action-complete {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}

.ritual-action-complete__icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.ritual-integration__message {
  background: rgba(255, 215, 128, 0.05);
  border-left: 3px solid var(--cathedral-gold);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.ritual-integration__message h5 {
  margin: 0 0 8px 0;
  color: var(--cathedral-gold);
  font-size: 12px;
}

.ritual-integration__lineage-voice {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  line-height: 1.6;
}

.ritual-integration__shift {
  margin-bottom: 20px;
}

.ritual-integration__shift h5 {
  margin: 0 0 8px 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.ritual-integration__shift p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.ritual-integration__seal {
  text-align: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ritual-seal-icon {
  font-size: 32px;
  color: var(--cathedral-gold);
  display: block;
  margin-bottom: 8px;
}

.ritual-integration__seal p {
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.ritual-btn {
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
  margin-bottom: 8px;
}

.ritual-btn--primary {
  background: var(--cathedral-gold);
  color: rgba(0, 0, 0, 0.9);
}

.ritual-btn--primary:hover:not(:disabled) {
  background: #ffe4a0;
}

.ritual-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ritual-btn--secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ritual-btn--secondary:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}
`;

export default AncestralHealingRitual;
