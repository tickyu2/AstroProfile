/**
 * ElementPanel.tsx
 *
 * Displays detailed information about an element (Fire, Earth, Air, Water).
 * Shows when an element is selected in the legend without other constraints.
 */

import React from 'react';
import {
  SIGN_METADATA,
  SIGN_SYMBOLS,
  MODALITY_COLORS,
  ZodiacSign,
} from '../../data/tropicalSeasons';
import { ELEMENT_TOOLTIPS } from '../../data/tropicalConstants';

type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

interface ElementPanelProps {
  element: Element;
  onClose: () => void;
  onSignClick?: (sign: ZodiacSign) => void;
}

// Element colors matching the wheel
const ELEMENT_COLORS: Record<Element, string> = {
  Fire: '#ef4444',
  Earth: '#22c55e',
  Air: '#38bdf8',
  Water: '#6366f1',
};

// Extended content for each element
const ELEMENT_CONTENT: Record<Element, {
  subtitle: string;
  essence: string;
  naturalWorld: string;
  psychologicalFunction: string;
  keywords: string[];
  gifts: string[];
  challenges: string[];
  question: string;
}> = {
  Fire: {
    subtitle: 'The Spark of Inspiration',
    essence: 'Fire is the element of spirit, will, and creative force. It represents the impulse to act, to create, and to assert oneself in the world. Fire signs are driven by vision, passion, and the desire to make their mark.',
    naturalWorld: 'Fire transforms everything it touches. It provides warmth and light, enables cooking and crafting, and clears old growth for new life. In nature, fire is both creative and destructive, a force of rapid change.',
    psychologicalFunction: 'Fire corresponds to intuition and the sense of possibility. Fire types perceive the world through the lens of potential and meaning. They ask not "what is?" but "what could be?" Their gift is inspiration; their challenge is patience with reality.',
    keywords: ['Inspiration', 'Passion', 'Action', 'Courage', 'Enthusiasm', 'Vision'],
    gifts: [
      'Natural enthusiasm that inspires and motivates others',
      'Courage to take risks and pursue bold visions',
      'Quick instincts and decisive action',
      'Ability to see possibilities others miss',
    ],
    challenges: [
      'Impatience with slow processes or details',
      'Can burn out from overextension',
      'May overlook practical considerations',
      'Tendency toward impulsiveness',
    ],
    question: 'What inspires you? What are you passionate about creating?',
  },
  Earth: {
    subtitle: 'The Ground of Reality',
    essence: 'Earth is the element of form, substance, and manifestation. It represents the capacity to build, sustain, and bring ideas into tangible reality. Earth signs are grounded in the physical world and skilled at working with material resources.',
    naturalWorld: 'Earth provides the foundation for all life. It holds seeds until they sprout, supports the roots of trees, and offers minerals for growth. Earth is patient, enduring, and fundamentally supportive.',
    psychologicalFunction: 'Earth corresponds to sensation and the perception of concrete reality. Earth types experience the world through their senses and value what can be touched, measured, and verified. Their gift is practical wisdom; their challenge is openness to the intangible.',
    keywords: ['Stability', 'Practicality', 'Patience', 'Reliability', 'Sensuality', 'Building'],
    gifts: [
      'Ability to manifest ideas into concrete results',
      'Patience to build lasting structures over time',
      'Reliability that others can count on',
      'Deep appreciation for quality and craftsmanship',
    ],
    challenges: [
      'Resistance to change or new approaches',
      'Can become overly focused on material security',
      'May miss opportunities while waiting for certainty',
      'Tendency toward stubbornness or rigidity',
    ],
    question: 'What are you building? What gives you a sense of security?',
  },
  Air: {
    subtitle: 'The Breath of Connection',
    essence: 'Air is the element of mind, communication, and relationship. It represents the capacity to think, analyze, and connect ideas and people. Air signs live in the realm of concepts, language, and social exchange.',
    naturalWorld: 'Air is invisible yet essential for life. It carries sound, scent, and seeds across distances. Air creates weather patterns, enables flight, and connects all living things through the atmosphere we share.',
    psychologicalFunction: 'Air corresponds to thinking and the capacity for abstract reasoning. Air types process the world through ideas, categories, and logical relationships. Their gift is clarity of thought; their challenge is staying connected to feeling and body.',
    keywords: ['Communication', 'Ideas', 'Connection', 'Objectivity', 'Curiosity', 'Analysis'],
    gifts: [
      'Natural ability to communicate and explain complex ideas',
      'Objectivity that sees multiple perspectives',
      'Curiosity that drives continuous learning',
      'Skill at connecting people and facilitating dialogue',
    ],
    challenges: [
      'May intellectualize emotions rather than feeling them',
      'Can become detached or overly abstract',
      'Difficulty with commitment or sustained focus',
      'Tendency to overthink or analyze endlessly',
    ],
    question: 'What ideas fascinate you? How do you connect with others?',
  },
  Water: {
    subtitle: 'The Depth of Feeling',
    essence: 'Water is the element of emotion, intuition, and the unconscious. It represents the capacity to feel deeply, empathize, and access realms beyond rational understanding. Water signs navigate by emotional truth and subtle perception.',
    naturalWorld: 'Water takes the shape of its container, finds the lowest point, and eventually wears away the hardest stone. It cleanses, nourishes, and connects all ecosystems through the water cycle. Water remembers and carries information.',
    psychologicalFunction: 'Water corresponds to feeling and emotional intelligence. Water types experience the world through mood, atmosphere, and emotional resonance. Their gift is depth of understanding; their challenge is maintaining boundaries and objectivity.',
    keywords: ['Emotion', 'Intuition', 'Empathy', 'Depth', 'Sensitivity', 'Healing'],
    gifts: [
      'Deep emotional intelligence and empathy',
      'Intuitive understanding that bypasses logic',
      'Capacity for profound intimacy and connection',
      'Natural healing and nurturing abilities',
    ],
    challenges: [
      'Can be overwhelmed by emotions (own or others\')',
      'Difficulty with boundaries and self-protection',
      'May retreat into fantasy or avoidance',
      'Tendency toward moodiness or emotional reactivity',
    ],
    question: 'What do you feel most deeply? What needs your emotional attention?',
  },
};

export const ElementPanel: React.FC<ElementPanelProps> = ({
  element,
  onClose,
  onSignClick,
}) => {
  const tooltip = ELEMENT_TOOLTIPS[element];
  const content = ELEMENT_CONTENT[element];
  const color = ELEMENT_COLORS[element];
  const signs = tooltip.signs as ZodiacSign[];

  // Get sign metadata for the element's signs
  const signsMeta = signs.map(sign => SIGN_METADATA.find(m => m.sign === sign)!);

  return (
    <div className="seasons-panel element-detail-panel">
      <div className="panel-header" style={{ borderColor: color }}>
        <span className="panel-icon">{tooltip.icon}</span>
        <div className="panel-header-text">
          <h2 className="panel-title">{element}</h2>
          <span className="panel-archetype-title">{content.subtitle}</span>
        </div>
        <button className="panel-close" onClick={onClose}>x</button>
      </div>

      {/* Keywords */}
      <div className="panel-keywords">
        {content.keywords.map((kw, i) => (
          <span key={i} className="keyword-chip" style={{ borderColor: color }}>{kw}</span>
        ))}
      </div>

      <div className="panel-content">
        {/* Essence */}
        <div className="panel-section">
          <p className="archetype-summary">{content.essence}</p>
        </div>

        {/* Natural World */}
        <div className="panel-section">
          <h4>In the Natural World</h4>
          <p className="panel-text">{content.naturalWorld}</p>
        </div>

        {/* Psychological Function */}
        <div className="panel-section">
          <h4>Psychological Function</h4>
          <p className="panel-text">{content.psychologicalFunction}</p>
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

        {/* Reflective Question */}
        <div className="panel-section mission-section">
          <h4>Reflective Question</h4>
          <p className="mission-text">{content.question}</p>
        </div>

        {/* The Four Signs */}
        <div className="panel-section">
          <h4>The Four {element} Signs</h4>
          <div className="element-signs-grid">
            {signsMeta.map((meta) => (
              <div
                key={meta.sign}
                className="element-sign-card"
                onClick={() => onSignClick?.(meta.sign)}
                style={{ cursor: onSignClick ? 'pointer' : 'default' }}
              >
                <span
                  className="sign-symbol"
                  style={{ color }}
                >
                  {SIGN_SYMBOLS[meta.sign]}
                </span>
                <span className="sign-name">{meta.sign}</span>
                <span
                  className="sign-modality"
                  style={{ background: MODALITY_COLORS[meta.modality] }}
                >
                  {meta.modality}
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

export default ElementPanel;
