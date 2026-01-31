/**
 * AnimatedCuspRibbon.tsx
 *
 * Smoothly animates cusp blend transitions using CSS transitions.
 * The ribbon "breathes" as the day offset changes.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useEffect, useState } from 'react';
import type { SignBlend } from '../../zodiac/cusp/phiCurve';
import { formatBlendPercent } from '../../zodiac/cusp/phiCurve';
import './CuspRibbon.css';
import './AnimatedCuspRibbon.css';

// =============================================================================
// TYPES
// =============================================================================

interface AnimatedCuspRibbonProps {
  blend: SignBlend[];
  title?: string;
  cuspDescription?: string | null;
  dayOffset?: number;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'exhale';
  compact?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const AnimatedCuspRibbon: React.FC<AnimatedCuspRibbonProps> = ({
  blend,
  title = 'Sun Sign Blend',
  cuspDescription,
  dayOffset = 0,
  isBreathing = false,
  breathPhase = 'inhale',
  compact = false,
}) => {
  // Animated blend values for smooth transitions
  const [animatedBlend, setAnimatedBlend] = useState(blend);

  // Smoothly transition to new blend
  useEffect(() => {
    setAnimatedBlend(blend);
  }, [blend]);

  const primary = animatedBlend[0];
  const secondary = animatedBlend[1];
  const isPure = !secondary || secondary.weight < 0.05;

  const primaryPct = formatBlendPercent(primary?.weight || 1);
  const secondaryPct = secondary ? formatBlendPercent(secondary.weight) : 0;

  // Dynamic classes
  const ribbonClasses = [
    'cusp-ribbon',
    'cusp-ribbon--animated',
    isPure ? 'cusp-ribbon--pure' : '',
    compact ? 'cusp-ribbon--compact' : '',
    isBreathing ? 'cusp-ribbon--breathing' : '',
    isBreathing ? `cusp-ribbon--${breathPhase}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={ribbonClasses}>
      {/* Header */}
      <div className="cusp-ribbon__head">
        <span className="cusp-ribbon__title">{title}</span>
        <div className="cusp-ribbon__legend">
          <span className="cusp-ribbon__chip cusp-ribbon__chip--primary">
            {primary?.sign} {primaryPct}%
          </span>
          {!isPure && secondary && (
            <span className="cusp-ribbon__chip cusp-ribbon__chip--secondary">
              {secondary.sign} {secondaryPct}%
            </span>
          )}
        </div>
      </div>

      {/* Animated blend bar */}
      <div className="cusp-ribbon__bar">
        <div
          className="cusp-ribbon__seg cusp-ribbon__seg--primary"
          style={{ width: `${primaryPct}%` }}
        />
        {!isPure && (
          <div
            className="cusp-ribbon__seg cusp-ribbon__seg--secondary"
            style={{ width: `${secondaryPct}%` }}
          />
        )}
      </div>

      {/* Day offset indicator */}
      {dayOffset !== 0 && (
        <div className="cusp-ribbon__offset">
          <span className="cusp-ribbon__offset-label">
            {dayOffset > 0 ? `+${dayOffset}` : dayOffset} days from center
          </span>
        </div>
      )}

      {/* Cusp name */}
      {!isPure && cuspDescription && (
        <div className="cusp-ribbon__cusp-name">{cuspDescription}</div>
      )}

      {/* Breathing indicator */}
      {isBreathing && (
        <div className="cusp-ribbon__breath-indicator">
          <span className={`breath-dot breath-dot--${breathPhase}`} />
        </div>
      )}
    </div>
  );
};

export default AnimatedCuspRibbon;
