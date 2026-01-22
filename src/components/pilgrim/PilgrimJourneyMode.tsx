/**
 * PilgrimJourneyMode.tsx
 *
 * Guided, step-by-step walkthrough of the relationship's mythic story.
 * Works like a wizard overlay that walks through chambers in a curated order.
 */

import React, { useState, useCallback } from "react";
import { PilgrimJourney } from "./pilgrimJourneys";
import "./PilgrimJourneyMode.css";

interface Props {
  journey: PilgrimJourney;
  onExit?: () => void;
}

const PilgrimJourneyMode: React.FC<Props> = ({ journey, onExit }) => {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  const start = useCallback(() => {
    setActive(true);
    setIndex(0);
    goToStep(0);
  }, []);

  const goToStep = (i: number) => {
    setIndex(i);
    const step = journey.steps[i];
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add highlight class temporarily
      el.classList.add("pilgrim-highlight");
      setTimeout(() => el.classList.remove("pilgrim-highlight"), 2000);
    }
  };

  const next = () => {
    if (index < journey.steps.length - 1) {
      goToStep(index + 1);
    } else {
      handleExit();
    }
  };

  const prev = () => {
    if (index > 0) {
      goToStep(index - 1);
    }
  };

  const handleExit = () => {
    setActive(false);
    setIndex(0);
    onExit?.();
  };

  // Start button
  if (!active) {
    return (
      <button className="pilgrim-start" onClick={start}>
        <span className="pilgrim-start-icon">{journey.icon}</span>
        <span className="pilgrim-start-text">
          Start {journey.name}
          <small>{journey.duration}</small>
        </span>
      </button>
    );
  }

  const step = journey.steps[index];
  const progress = ((index + 1) / journey.steps.length) * 100;

  return (
    <div className="pilgrim-overlay">
      <div className="pilgrim-card">
        {/* Progress bar */}
        <div className="pilgrim-progress">
          <div className="pilgrim-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Journey header */}
        <div className="pilgrim-journey-header">
          <span className="pilgrim-journey-icon">{journey.icon}</span>
          <span className="pilgrim-journey-name">{journey.name}</span>
          <span className="pilgrim-step-counter">
            {index + 1} / {journey.steps.length}
          </span>
        </div>

        {/* Step content */}
        <h3 className="pilgrim-step-title">{step.title}</h3>
        <p className="pilgrim-step-description">{step.description}</p>

        {/* Controls */}
        <div className="pilgrim-controls">
          <button className="pilgrim-btn pilgrim-btn-exit" onClick={handleExit}>
            Exit
          </button>
          <div className="pilgrim-nav">
            <button
              className="pilgrim-btn pilgrim-btn-prev"
              onClick={prev}
              disabled={index === 0}
            >
              ← Back
            </button>
            <button className="pilgrim-btn pilgrim-btn-next" onClick={next}>
              {index === journey.steps.length - 1 ? "Finish ✓" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilgrimJourneyMode;
