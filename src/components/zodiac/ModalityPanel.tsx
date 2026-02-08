/**
 * ModalityPanel.tsx
 *
 * Displays detailed information about a modality (Cardinal, Fixed, Mutable).
 * Shows when a modality is selected in the legend without other constraints.
 */

import React from 'react';
import {
  SIGN_METADATA,
  SIGN_SYMBOLS,
  ELEMENT_COLORS,
  ZodiacSign,
} from '../../data/tropicalSeasons';
import { MODALITY_TOOLTIPS } from '../../data/tropicalConstants';

type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

interface ModalityPanelProps {
  modality: Modality;
  onClose: () => void;
  onSignClick?: (sign: ZodiacSign) => void;
}

// Extended content for each modality
const MODALITY_CONTENT: Record<Modality, {
  subtitle: string;
  essence: string;
  seasonalRole: string;
  lifePhase: string;
  keywords: string[];
  gifts: string[];
  challenges: string[];
}> = {
  Cardinal: {
    subtitle: 'The Initiators',
    essence: 'Cardinal energy is the spark that starts every season. Like the first day of spring, summer, autumn, and winter, Cardinal signs carry the urgency of new beginnings. They are the architects of change, driven to start movements rather than follow them.',
    seasonalRole: 'Each Cardinal sign marks a seasonal turning point: Aries (Spring Equinox), Cancer (Summer Solstice), Libra (Autumn Equinox), Capricorn (Winter Solstice). These are moments of maximum change in the natural world.',
    lifePhase: 'Cardinal energy corresponds to the moment of birth, first steps, launching projects, and any threshold crossing. It asks: "What wants to begin through me?"',
    keywords: ['Initiative', 'Leadership', 'Action', 'Pioneering', 'Ambition', 'Drive'],
    gifts: [
      'Natural ability to start new projects and ventures',
      'Leadership presence that inspires others to follow',
      'Quick to take action when opportunities arise',
      'Courage to enter uncharted territory',
    ],
    challenges: [
      'May lose interest once the initial excitement fades',
      'Can start many things without completing them',
      'Impatience with the slow work of maintenance',
      'May overlook details in the rush to begin',
    ],
  },
  Fixed: {
    subtitle: 'The Sustainers',
    essence: 'Fixed energy is the power of persistence. Like the heart of each season when its qualities are most pronounced, Fixed signs embody concentration, depth, and staying power. They transform what Cardinal signs initiate into something lasting.',
    seasonalRole: 'Each Fixed sign occupies the middle of a season: Taurus (mid-Spring), Leo (mid-Summer), Scorpio (mid-Autumn), Aquarius (mid-Winter). These are periods of maximum seasonal intensity.',
    lifePhase: 'Fixed energy corresponds to building, establishing, and deepening. It governs the accumulation of resources, the development of mastery, and the cultivation of lasting bonds. It asks: "What deserves my sustained attention?"',
    keywords: ['Persistence', 'Determination', 'Loyalty', 'Concentration', 'Reliability', 'Depth'],
    gifts: [
      'Unshakeable determination to see things through',
      'Deep loyalty and commitment to people and causes',
      'Ability to build lasting structures and relationships',
      'Patience to develop true mastery over time',
    ],
    challenges: [
      'Resistance to necessary change or adaptation',
      'Stubbornness that can become rigidity',
      'Difficulty letting go of what no longer serves',
      'May become possessive or controlling',
    ],
  },
  Mutable: {
    subtitle: 'The Adapters',
    essence: 'Mutable energy is the wisdom of transition. Like the end of each season when it begins dissolving into the next, Mutable signs carry the gift of flexibility. They synthesize what came before and prepare the ground for what comes next.',
    seasonalRole: 'Each Mutable sign closes a season: Gemini (late Spring), Virgo (late Summer), Sagittarius (late Autumn), Pisces (late Winter). These are periods of integration and release.',
    lifePhase: 'Mutable energy corresponds to learning, adjusting, and letting go. It governs education, travel, healing, and any process of transformation. It asks: "What is ready to change, and what wisdom can I carry forward?"',
    keywords: ['Adaptability', 'Flexibility', 'Versatility', 'Learning', 'Communication', 'Synthesis'],
    gifts: [
      'Natural ability to adapt to changing circumstances',
      'Gift for learning, teaching, and communicating',
      'Versatility that allows wearing many hats',
      'Wisdom to know when to release and move on',
    ],
    challenges: [
      'May lack the focus to commit deeply',
      'Can scatter energy across too many directions',
      'Difficulty with firm boundaries or decisions',
      'May avoid confrontation by constant adjustment',
    ],
  },
};

export const ModalityPanel: React.FC<ModalityPanelProps> = ({
  modality,
  onClose,
  onSignClick,
}) => {
  const tooltip = MODALITY_TOOLTIPS[modality];
  const content = MODALITY_CONTENT[modality];
  const signs = tooltip.signs as ZodiacSign[];

  // Get sign metadata for the modality's signs
  const signsMeta = signs.map(sign => SIGN_METADATA.find(m => m.sign === sign)!);

  return (
    <div className="seasons-panel modality-detail-panel">
      <div className="panel-header" style={{ borderColor: tooltip.color }}>
        <span className="panel-icon">{tooltip.icon}</span>
        <div className="panel-header-text">
          <h2 className="panel-title">{modality}</h2>
          <span className="panel-archetype-title">{content.subtitle}</span>
        </div>
        <button className="panel-close" onClick={onClose}>x</button>
      </div>

      {/* Keywords */}
      <div className="panel-keywords">
        {content.keywords.map((kw, i) => (
          <span key={i} className="keyword-chip" style={{ borderColor: tooltip.color }}>{kw}</span>
        ))}
      </div>

      <div className="panel-content">
        {/* Essence */}
        <div className="panel-section">
          <p className="archetype-summary">{content.essence}</p>
        </div>

        {/* Seasonal Role */}
        <div className="panel-section">
          <h4>Seasonal Role</h4>
          <p className="panel-text">{content.seasonalRole}</p>
        </div>

        {/* Life Phase */}
        <div className="panel-section">
          <h4>Life Phase</h4>
          <p className="panel-text">{content.lifePhase}</p>
        </div>

        {/* Gifts */}
        <div className="panel-section">
          <h4>Gifts</h4>
          <ul className="themed-list gifts">
            {content.gifts.map((gift, i) => (
              <li key={i}>{gift}</li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="panel-section">
          <h4>Challenges</h4>
          <ul className="themed-list challenges">
            {content.challenges.map((challenge, i) => (
              <li key={i}>{challenge}</li>
            ))}
          </ul>
        </div>

        {/* The Four Signs */}
        <div className="panel-section">
          <h4>The Four {modality} Signs</h4>
          <div className="modality-signs-grid">
            {signsMeta.map((meta) => (
              <div
                key={meta.sign}
                className="modality-sign-card"
                onClick={() => onSignClick?.(meta.sign)}
                style={{ cursor: onSignClick ? 'pointer' : 'default' }}
              >
                <span
                  className="sign-symbol"
                  style={{ color: ELEMENT_COLORS[meta.element] }}
                >
                  {SIGN_SYMBOLS[meta.sign]}
                </span>
                <span className="sign-name">{meta.sign}</span>
                <span
                  className="sign-element"
                  style={{ background: ELEMENT_COLORS[meta.element] }}
                >
                  {meta.element}
                </span>
                <span className="sign-season">{meta.season}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalityPanel;
