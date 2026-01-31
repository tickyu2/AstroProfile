/**
 * CuspDayScrubber.tsx
 *
 * User-driven day scrubber with slider control.
 * Allows manual exploration of the 13-day cusp window.
 *
 * GENESIS AstroProfile - January 2026
 */

import React from 'react';
import type { CuspDayStream, DayBlendEntry } from '../../zodiac/cusp/useCuspDayStream';
import { formatDayOffset } from '../../zodiac/cusp/useCuspDayStream';
import './CuspDayScrubber.css';

// =============================================================================
// TYPES
// =============================================================================

interface CuspDayScrubberProps {
  stream: CuspDayStream;
  currentOffset: number;
  onChange: (offset: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  showDayLabels?: boolean;
  compact?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const CuspDayScrubber: React.FC<CuspDayScrubberProps> = ({
  stream,
  currentOffset,
  onChange,
  isPlaying = false,
  onPlayToggle,
  showDayLabels = true,
  compact = false,
}) => {
  const { days, windowSize } = stream;

  // Get current day entry
  const currentIndex = windowSize + currentOffset;
  const currentDay = days[currentIndex];

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  // Handle day dot click
  const handleDayClick = (offset: number) => {
    onChange(offset);
  };

  const scrubberClasses = [
    'cusp-scrubber',
    compact ? 'cusp-scrubber--compact' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={scrubberClasses}>
      {/* Header with play control */}
      <div className="cusp-scrubber__header">
        <span className="cusp-scrubber__label">
          {formatDayOffset(currentOffset)}
        </span>
        {onPlayToggle && (
          <button
            className={`cusp-scrubber__play ${isPlaying ? 'cusp-scrubber__play--active' : ''}`}
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pause breathing' : 'Play breathing'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        )}
      </div>

      {/* Day dots */}
      {showDayLabels && (
        <div className="cusp-scrubber__dots">
          {days.map((day, i) => {
            const offset = i - windowSize;
            const isActive = offset === currentOffset;
            const isCenter = offset === 0;

            return (
              <button
                key={offset}
                className={[
                  'cusp-scrubber__dot',
                  isActive ? 'cusp-scrubber__dot--active' : '',
                  isCenter ? 'cusp-scrubber__dot--center' : '',
                  day.isCusp ? 'cusp-scrubber__dot--cusp' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleDayClick(offset)}
                aria-label={formatDayOffset(offset)}
                title={`${day.primarySign} - ${formatDayOffset(offset)}`}
              />
            );
          })}
        </div>
      )}

      {/* Slider */}
      <div className="cusp-scrubber__track">
        <input
          type="range"
          min={-windowSize}
          max={windowSize}
          value={currentOffset}
          onChange={handleSliderChange}
          className="cusp-scrubber__slider"
          aria-label="Day offset"
        />
        <div
          className="cusp-scrubber__progress"
          style={{
            width: `${((currentOffset + windowSize) / (windowSize * 2)) * 100}%`,
          }}
        />
      </div>

      {/* Current day info */}
      {currentDay && (
        <div className="cusp-scrubber__info">
          <span className="cusp-scrubber__sign">{currentDay.primarySign}</span>
          {currentDay.isCusp && (
            <span className="cusp-scrubber__cusp-badge">Cusp</span>
          )}
          <span className="cusp-scrubber__date">
            {currentDay.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MINI SCRUBBER (inline version)
// =============================================================================

interface MiniScrubberProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const MiniScrubber: React.FC<MiniScrubberProps> = ({
  value,
  min = -6,
  max = 6,
  onChange,
}) => {
  return (
    <div className="cusp-scrubber--mini">
      <button
        className="cusp-scrubber__step"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        ◀
      </button>
      <span className="cusp-scrubber__value">{value > 0 ? `+${value}` : value}</span>
      <button
        className="cusp-scrubber__step"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        ▶
      </button>
    </div>
  );
};

export default CuspDayScrubber;
