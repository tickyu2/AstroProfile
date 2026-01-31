/**
 * WhyItMatters Component
 * Reusable Academy panel explaining significance
 * Used across Pure Signs, Cusps, Elements, and more
 */

import React from 'react';

// ============================================================================
// Types
// ============================================================================

interface WhyItMattersProps {
  title: string;
  points: string[];
  variant?: 'default' | 'compact' | 'highlighted';
  icon?: string;
  className?: string;
}

interface WhyItMattersListProps {
  sections: Array<{
    title: string;
    points: string[];
    icon?: string;
  }>;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * WhyItMatters - Explains significance with bullet points
 */
export const WhyItMatters: React.FC<WhyItMattersProps> = ({
  title,
  points,
  variant = 'default',
  icon = '✦',
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-slate-800/50 border-slate-700',
    compact: 'bg-slate-800/30 border-slate-700/50',
    highlighted: 'bg-gradient-to-r from-amber-900/20 to-purple-900/20 border-amber-700/30'
  };

  const titleStyles = {
    default: 'text-amber-300',
    compact: 'text-slate-300',
    highlighted: 'text-amber-200'
  };

  return (
    <section className={`why-matters rounded-xl border p-4 ${variantStyles[variant]} ${className}`}>
      <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${titleStyles[variant]}`}>
        <span className="text-xl">{icon}</span>
        <span>Why {title} Matters</span>
      </h3>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-slate-300"
          >
            <span className="text-purple-400 mt-1 text-sm">•</span>
            <span className="text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

// ============================================================================
// Pre-built Content Variants
// ============================================================================

/**
 * WhyPureSignMatters - Pre-configured for pure signs
 */
export const WhyPureSignMatters: React.FC<{ signName: string; className?: string }> = ({
  signName,
  className
}) => (
  <WhyItMatters
    title={signName}
    icon="🏛️"
    variant="highlighted"
    className={className}
    points={[
      'It reveals the unblended essence of the sign.',
      'It anchors the 6-day cusp transitions on either side.',
      'It provides the psychological core of the archetype.',
      'It teaches the pure expression before blending begins.',
      'Understanding pure signs deepens cusp interpretation.'
    ]}
  />
);

/**
 * WhyCuspMatters - Pre-configured for cusps
 */
export const WhyCuspMatters: React.FC<{ cuspName: string; className?: string }> = ({
  cuspName,
  className
}) => (
  <WhyItMatters
    title={cuspName}
    icon="🌓"
    variant="highlighted"
    className={className}
    points={[
      'Cusps capture the transition between two archetypal energies.',
      'The 6-day φ-curve reveals how energies blend naturally.',
      'Each cusp day has a unique psychological profile.',
      'Cusps explain why "on the cusp" feels distinctly different.',
      'They bridge pure signs with living, blended reality.'
    ]}
  />
);

/**
 * WhyElementMatters - Pre-configured for elements
 */
export const WhyElementMatters: React.FC<{ element: string; className?: string }> = ({
  element,
  className
}) => {
  const elementPoints: Record<string, string[]> = {
    Fire: [
      'Fire signs initiate action and inspire others.',
      'They represent will, passion, and creative force.',
      'Fire energy is direct, assertive, and visionary.',
      'Without Fire, nothing begins.'
    ],
    Earth: [
      'Earth signs ground ideas into tangible form.',
      'They represent stability, patience, and endurance.',
      'Earth energy is practical, reliable, and sensory.',
      'Without Earth, nothing manifests.'
    ],
    Air: [
      'Air signs connect ideas and facilitate communication.',
      'They represent intellect, curiosity, and social bonds.',
      'Air energy is analytical, detached, and conceptual.',
      'Without Air, nothing connects.'
    ],
    Water: [
      'Water signs feel deeply and carry emotional wisdom.',
      'They represent intuition, empathy, and the unconscious.',
      'Water energy is receptive, healing, and transformative.',
      'Without Water, nothing has meaning.'
    ]
  };

  return (
    <WhyItMatters
      title={element}
      icon={element === 'Fire' ? '🔥' : element === 'Earth' ? '🌍' : element === 'Air' ? '💨' : '🌊'}
      variant="highlighted"
      className={className}
      points={elementPoints[element] || elementPoints.Fire}
    />
  );
};

/**
 * WhyModalityMatters - Pre-configured for modalities
 */
export const WhyModalityMatters: React.FC<{ modality: string; className?: string }> = ({
  modality,
  className
}) => {
  const modalityPoints: Record<string, string[]> = {
    Cardinal: [
      'Cardinal signs begin each season—they are initiators.',
      'They spark new cycles and lead the way forward.',
      'Cardinal energy is enterprising and action-oriented.',
      'They ask: "What needs to start?"'
    ],
    Fixed: [
      'Fixed signs occupy the middle of each season—they are stabilizers.',
      'They deepen, sustain, and protect what has begun.',
      'Fixed energy is determined and resistant to change.',
      'They ask: "What needs to be preserved?"'
    ],
    Mutable: [
      'Mutable signs end each season—they are adapters.',
      'They refine, transition, and prepare for what comes next.',
      'Mutable energy is flexible and responsive.',
      'They ask: "What needs to change?"'
    ]
  };

  return (
    <WhyItMatters
      title={modality}
      icon={modality === 'Cardinal' ? '⚡' : modality === 'Fixed' ? '🏛️' : '🌀'}
      variant="default"
      className={className}
      points={modalityPoints[modality] || modalityPoints.Cardinal}
    />
  );
};

/**
 * WhyPhiCurveMatters - Pre-configured for φ-curve
 */
export const WhyPhiCurveMatters: React.FC<{ className?: string }> = ({ className }) => (
  <WhyItMatters
    title="the φ-Curve"
    icon="φ"
    variant="highlighted"
    className={className}
    points={[
      'The golden ratio (φ ≈ 1.618) governs natural transitions.',
      'Day-by-day blends follow nature's pattern, not linear math.',
      'The curve explains why Day 3-4 feels most "blended."',
      'It provides the mathematical backbone of cusp psychology.',
      'φ appears in shells, galaxies, and human perception.'
    ]}
  />
);

// ============================================================================
// Multi-section List
// ============================================================================

/**
 * WhyItMattersList - Multiple sections in one panel
 */
export const WhyItMattersList: React.FC<WhyItMattersListProps> = ({
  sections,
  className = ''
}) => {
  return (
    <div className={`why-matters-list space-y-4 ${className}`}>
      {sections.map((section, index) => (
        <WhyItMatters
          key={index}
          title={section.title}
          points={section.points}
          icon={section.icon}
          variant={index === 0 ? 'highlighted' : 'default'}
        />
      ))}
    </div>
  );
};

export default WhyItMatters;
