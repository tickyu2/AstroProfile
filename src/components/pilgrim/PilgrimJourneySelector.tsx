/**
 * PilgrimJourneySelector.tsx
 *
 * Journey selection interface allowing users to choose their pilgrimage path.
 */

import React, { useState } from "react";
import PilgrimJourneyMode from "./PilgrimJourneyMode";
import { AllJourneys, PilgrimJourney } from "./pilgrimJourneys";
import "./PilgrimJourneySelector.css";

const PilgrimJourneySelector: React.FC = () => {
  const [selected, setSelected] = useState<PilgrimJourney | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // If a journey is selected, show the journey mode
  if (selected) {
    return (
      <PilgrimJourneyMode
        journey={selected}
        onExit={() => setSelected(null)}
      />
    );
  }

  // Closed state - just show the button
  if (!isOpen) {
    return (
      <button className="pilgrim-launcher" onClick={() => setIsOpen(true)}>
        <span className="pilgrim-launcher-icon">⛪</span>
        <span className="pilgrim-launcher-text">
          Start Pilgrimage
          <small>Guided Tour</small>
        </span>
      </button>
    );
  }

  // Open state - show journey selection
  return (
    <div className="pilgrim-selector-overlay">
      <div className="pilgrim-selector">
        <div className="pilgrim-selector-header">
          <h3>Choose Your Pilgrim Journey</h3>
          <p>Select a guided path through the Cathedral</p>
          <button
            className="pilgrim-selector-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="pilgrim-journey-list">
          {AllJourneys.map((journey) => (
            <button
              key={journey.id}
              className="pilgrim-journey-option"
              onClick={() => {
                setSelected(journey);
                setIsOpen(false);
              }}
            >
              <span className="journey-icon">{journey.icon}</span>
              <div className="journey-info">
                <span className="journey-name">{journey.name}</span>
                <span className="journey-description">{journey.description}</span>
                <span className="journey-meta">
                  <span className="journey-duration">{journey.duration}</span>
                  <span className="journey-steps">{journey.steps.length} chambers</span>
                </span>
              </div>
              <span className="journey-arrow">→</span>
            </button>
          ))}
        </div>

        <div className="pilgrim-selector-footer">
          <p>Each path offers a unique perspective on your relationship.</p>
        </div>
      </div>
    </div>
  );
};

export default PilgrimJourneySelector;
