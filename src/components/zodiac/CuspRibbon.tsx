/**
 * CuspRibbon Component
 *
 * Displays a visual ribbon showing the cusp blend between signs.
 * Uses the φ-curve percentages to show primary vs secondary sign weights.
 *
 * Example:
 *   <CuspRibbon title="Your Sun cusp blend" blend={sunBlend} />
 *
 * GENESIS AstroProfile - January 2026
 */

import React from 'react';
import type { ZodiacSign } from '../../data/tropicalSeasons';
import { SIGNS, SIGN_SYMBOLS } from '../../data/tropicalSeasons';
import { formatBlendPercent, type SignBlend } from '../../zodiac/cusp/phiCurve';
import './CuspRibbon.css';

// =============================================================================
// TYPES
// =============================================================================

interface CuspRibbonProps {
  title?: string;
  blend: SignBlend[];
  compact?: boolean;
  showExplanation?: boolean;
  cuspDescription?: string;
  birthDate?: string | null;
  birthTime?: string | null;
  /** The sign whose season the birth date falls in (calendar sign) */
  calendarSign?: ZodiacSign;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatBirthInfo(birthDate?: string | null, birthTime?: string | null): string | null {
  if (!birthDate) return null;
  const parts: string[] = [`BIRTH DATE: ${birthDate}`];
  if (birthTime) {
    // Convert 24h "HH:MM" to 12h "HH:MM AM/PM"
    const [h, m] = birthTime.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const minuteStr = String(m).padStart(2, '0');
    parts.push(`TIME ${String(hour12).padStart(2, '0')}:${minuteStr} ${suffix}`);
  }
  return parts.join('  ');
}

/**
 * Sort two signs into zodiac clockwise order.
 * Left = the earlier sign in seasonal rotation, Right = the later sign.
 * Handles Pisces→Aries wrap-around.
 */
function sortByZodiacOrder(a: SignBlend, b: SignBlend): [SignBlend, SignBlend] {
  const idxA = SIGNS.indexOf(a.sign as typeof SIGNS[number]);
  const idxB = SIGNS.indexOf(b.sign as typeof SIGNS[number]);
  // Handle Pisces-Aries wrap (indices 11 and 0)
  if (idxA === 11 && idxB === 0) return [a, b]; // Pisces first, Aries second
  if (idxA === 0 && idxB === 11) return [b, a]; // Pisces first, Aries second
  return idxA < idxB ? [a, b] : [b, a];
}

// =============================================================================
// COMPONENT
// =============================================================================

export const CuspRibbon: React.FC<CuspRibbonProps> = ({
  title = 'Cusp blend',
  blend,
  compact = false,
  showExplanation = true,
  cuspDescription,
  birthDate,
  birthTime,
  calendarSign,
}) => {
  // Sort by weight descending to find dominant and secondary
  const sorted = [...blend].sort((a, b) => b.weight - a.weight);
  const dominant = sorted[0];
  const secondary = sorted[1];

  if (!dominant) return null;

  const isCusp = secondary && formatBlendPercent(secondary.weight) >= 5;

  // If not a cusp, show simplified version
  if (!isCusp) {
    return (
      <section className={`cusp-ribbon cusp-ribbon--pure ${compact ? 'cusp-ribbon--compact' : ''}`}>
        <div className="cusp-ribbon__head">
          <div className="cusp-ribbon__title">{title}</div>
          <div className="cusp-ribbon__legend">
            <span className="cusp-ribbon__chip cusp-ribbon__chip--primary">
              {SIGN_SYMBOLS[dominant.sign]} {dominant.sign} 100%
            </span>
          </div>
        </div>
        <div className="cusp-ribbon__bar" aria-label="Pure sign">
          <div className="cusp-ribbon__seg cusp-ribbon__seg--primary" style={{ width: '100%' }} />
        </div>
        {formatBirthInfo(birthDate, birthTime) && (
          <div className="cusp-ribbon__birth-info">
            {formatBirthInfo(birthDate, birthTime)}
          </div>
        )}
        {!compact && showExplanation && (
          <div className="cusp-ribbon__note">
            Born in the heart of {dominant.sign} season — pure sign energy.
          </div>
        )}
      </section>
    );
  }

  // Full cusp display — order by zodiac wheel (clockwise), not by weight
  const [left, right] = sortByZodiacOrder(dominant, secondary);
  const leftPct = formatBlendPercent(left.weight);
  const rightPct = formatBlendPercent(right.weight);

  // Determine which is the calendar sign (the season the birthdate falls in)
  const leftIsCalendar = calendarSign ? left.sign === calendarSign : left.weight > right.weight;
  const rightIsCalendar = calendarSign ? right.sign === calendarSign : right.weight > left.weight;

  return (
    <section className={`cusp-ribbon ${compact ? 'cusp-ribbon--compact' : ''}`}>
      <div className="cusp-ribbon__head">
        <div className="cusp-ribbon__title">{title}</div>
        <div className="cusp-ribbon__legend">
          <span className={`cusp-ribbon__chip ${leftIsCalendar ? 'cusp-ribbon__chip--primary' : 'cusp-ribbon__chip--secondary'}`}>
            {SIGN_SYMBOLS[left.sign]} {left.sign} {leftPct}%
          </span>
          <span className={`cusp-ribbon__chip ${rightIsCalendar ? 'cusp-ribbon__chip--primary' : 'cusp-ribbon__chip--secondary'}`}>
            {SIGN_SYMBOLS[right.sign]} {right.sign} {rightPct}%
          </span>
        </div>
      </div>

      <div className="cusp-ribbon__bar" aria-label="Cusp blend bar">
        <div
          className={`cusp-ribbon__seg ${leftIsCalendar ? 'cusp-ribbon__seg--primary' : 'cusp-ribbon__seg--secondary'}`}
          style={{ width: `${leftPct}%` }}
          title={`${left.sign} ${leftPct}%`}
        />
        <div
          className={`cusp-ribbon__seg ${rightIsCalendar ? 'cusp-ribbon__seg--primary' : 'cusp-ribbon__seg--secondary'}`}
          style={{ width: `${rightPct}%` }}
          title={`${right.sign} ${rightPct}%`}
        />
      </div>

      {/* Birth info + cusp description row below the bar */}
      {(formatBirthInfo(birthDate, birthTime) || cuspDescription) && (
        <div className="cusp-ribbon__below-bar">
          <div className="cusp-ribbon__birth-info">
            {formatBirthInfo(birthDate, birthTime) || ''}
          </div>
          {cuspDescription && (
            <div className="cusp-ribbon__cusp-name">
              {cuspDescription}
            </div>
          )}
        </div>
      )}

      {!compact && showExplanation && (
        <div className="cusp-ribbon__note">
          Born on the {cuspDescription || `${left.sign}-${right.sign} cusp`} —
          {` ${leftPct}% ${left.sign}`} energy blends with {`${rightPct}% ${right.sign}`}.
        </div>
      )}
    </section>
  );
};

// =============================================================================
// MINI CUSP BADGE (for inline display)
// =============================================================================

interface CuspBadgeProps {
  blend: SignBlend[];
  showPercentages?: boolean;
}

export const CuspBadge: React.FC<CuspBadgeProps> = ({
  blend,
  showPercentages = true,
}) => {
  const sorted = [...blend].sort((a, b) => b.weight - a.weight);
  const primary = sorted[0];
  const secondary = sorted[1];

  if (!primary) return null;

  const primaryPct = formatBlendPercent(primary.weight);
  const secondaryPct = secondary ? formatBlendPercent(secondary.weight) : 0;
  const isCusp = secondary && secondaryPct >= 5;

  if (!isCusp) {
    return (
      <span className="cusp-badge cusp-badge--pure">
        {SIGN_SYMBOLS[primary.sign]} {primary.sign}
      </span>
    );
  }

  return (
    <span className="cusp-badge cusp-badge--blend">
      <span className="cusp-badge__primary">
        {SIGN_SYMBOLS[primary.sign]} {primary.sign}
        {showPercentages && <span className="cusp-badge__pct">{primaryPct}%</span>}
      </span>
      <span className="cusp-badge__divider">↔</span>
      <span className="cusp-badge__secondary">
        {SIGN_SYMBOLS[secondary.sign]} {secondary.sign}
        {showPercentages && <span className="cusp-badge__pct">{secondaryPct}%</span>}
      </span>
    </span>
  );
};

export default CuspRibbon;
