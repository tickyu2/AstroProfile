/**
 * Wheel Mode Controls Component
 *
 * UI controls for switching between wheel modes:
 * - default, seasons, modality, elements, signs
 */

import React from 'react';
import { useWheelMode } from '../contexts/WheelModeContext';
import { WheelMode, LayerName } from '../types/wheelModes';
import './WheelModeControls.css';

interface WheelModeControlsProps {
  showLayerToggles?: boolean;
  compact?: boolean;
}

const MODE_INFO: Record<WheelMode, { label: string; icon: string; description: string }> = {
  default: {
    label: 'Default',
    icon: '⚪',
    description: 'All layers visible'
  },
  seasons: {
    label: 'Seasons',
    icon: '🌿',
    description: 'Highlight the seasons ring'
  },
  modality: {
    label: 'Modality',
    icon: '⚡',
    description: 'Highlight the modality ring'
  },
  elements: {
    label: 'Elements',
    icon: '🔥',
    description: 'Highlight the elements ring'
  },
  signs: {
    label: 'Signs',
    icon: '♈',
    description: 'Highlight the signs ring'
  }
};

const LAYER_INFO: Record<LayerName, { label: string; icon: string }> = {
  months: { label: 'Months', icon: '📅' },
  retrograde: { label: 'Retrograde', icon: '℞' },
  season: { label: 'Seasons', icon: '🌸' },
  modality: { label: 'Modality', icon: '⚡' },
  element: { label: 'Elements', icon: '🔥' },
  signs: { label: 'Signs', icon: '♈' },
  decans: { label: 'Decans', icon: '📐' },
  planets: { label: 'Planets', icon: '🪐' },
  center: { label: 'Center', icon: '⊙' }
};

export const WheelModeControls: React.FC<WheelModeControlsProps> = ({
  showLayerToggles = false,
  compact = false
}) => {
  const {
    mode,
    transitionTo,
    canTransitionTo,
    toggleLayer,
    isLayerEnabled
  } = useWheelMode();

  // Only show Default and Signs - Seasons/Modality/Elements are now in the Legends panel
  const modes: WheelMode[] = ['default', 'signs'];

  return (
    <div className={`wheel-mode-controls ${compact ? 'compact' : ''}`}>
      <div className="mode-section">
        <div className="section-label">View</div>
        <div className="mode-buttons">
          {modes.map(m => {
            const info = MODE_INFO[m];
            const isActive = mode === m;
            const canSwitch = isActive || canTransitionTo(m);

            return (
              <button
                key={m}
                className={`mode-button ${isActive ? 'active' : ''} ${!canSwitch ? 'disabled' : ''}`}
                onClick={() => transitionTo(m)}
                disabled={!canSwitch}
                title={info.description}
              >
                <span className="mode-icon">{info.icon}</span>
                {!compact && <span className="mode-label">{info.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {showLayerToggles && (
        <div className="layer-section">
          <div className="section-label">Layers</div>
          <div className="layer-toggles">
            {(Object.keys(LAYER_INFO) as LayerName[]).map(layer => {
              const info = LAYER_INFO[layer];
              const isEnabled = isLayerEnabled(layer);

              return (
                <button
                  key={layer}
                  className={`layer-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => toggleLayer(layer)}
                  title={`Toggle ${info.label}`}
                >
                  <span className="layer-icon">{info.icon}</span>
                  {!compact && <span className="layer-label">{info.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelModeControls;
