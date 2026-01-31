/**
 * SignPanel.tsx
 *
 * Displays detailed information about a zodiac sign.
 * Includes element, modality, season, keywords, and educational content.
 * Now includes cusp ribbon when a birth date is provided.
 *
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

import React, { useMemo } from 'react';
import {
  ELEMENT_COLORS,
  MODALITY_COLORS,
  SEASON_COLORS,
  SignMeta,
  ZodiacSign,
} from '../../data/tropicalSeasons';
import {
  SIGN_LESSONS,
  ELEMENT_EMOJI,
  SEASON_EMOJI,
  MODALITY_ROLE,
  type SignKey,
} from '../../zodiac/tropicalMap';
import { getSunBlendFromDate } from '../../zodiac/cusp/getSunBlendFromDate';
import { generateCuspNarrative } from '../../zodiac/cusp/cuspNarrative';
import { CuspRibbon } from './CuspRibbon';

interface SignPanelProps {
  meta: SignMeta;
  onClose: () => void;
  onSelectForCompat: () => void;
  birthDate?: Date | string | null;  // Optional birth date for cusp calculation
}

export const SignPanel: React.FC<SignPanelProps> = ({
  meta,
  onClose,
  onSelectForCompat,
  birthDate,
}) => {
  // Get the academy lesson for this sign
  const lesson = SIGN_LESSONS[meta.sign as SignKey];
  const modalityRole = MODALITY_ROLE[meta.modality as 'Cardinal' | 'Fixed' | 'Mutable'];

  // Calculate Sun cusp blend if birth date provided
  const sunCusp = useMemo(() => {
    if (!birthDate) return null;
    try {
      const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
      if (isNaN(date.getTime())) return null;
      return getSunBlendFromDate(date);
    } catch {
      return null;
    }
  }, [birthDate]);

  // Show cusp ribbon if this sign is involved in the user's Sun cusp
  const showCuspRibbon = sunCusp &&
    sunCusp.blend.some(b => b.sign === meta.sign) &&
    sunCusp.isCusp;

  return (
    <div className="seasons-panel sign-panel">
      <div className="panel-header">
        <span className="panel-icon">{meta.symbol}</span>
        <h2 className="panel-title">{meta.sign}</h2>
        <span className="panel-subtitle">{meta.dateRange}</span>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>
      <div className="panel-content">
        {/* Short mantra badge */}
        <div className="sign-mantra">
          <span className="mantra-label">{lesson?.shortMantra || modalityRole.name}</span>
        </div>

        <div className="sign-badges">
          <span className="badge element" style={{ background: ELEMENT_COLORS[meta.element] }}>
            {ELEMENT_EMOJI[meta.element as 'Fire' | 'Earth' | 'Air' | 'Water']} {meta.element}
          </span>
          <span className="badge modality" style={{ background: MODALITY_COLORS[meta.modality] }}>
            {meta.modality}
          </span>
          <span className="badge season" style={{ background: SEASON_COLORS[meta.season] }}>
            {SEASON_EMOJI[meta.season as 'Spring' | 'Summer' | 'Autumn' | 'Winter']} {meta.season}
          </span>
          <span className="badge polarity">
            {meta.polarity}
          </span>
        </div>

        {/* Cusp Ribbon - Shows when user's birth date involves this sign in a cusp */}
        {showCuspRibbon && sunCusp && (
          <CuspRibbon
            title="Your Sun cusp blend"
            blend={sunCusp.blend}
            cuspDescription={sunCusp.cuspDescription}
          />
        )}

        {/* Cusp Narrative - "Why this day feels different" */}
        {showCuspRibbon && sunCusp && birthDate && (() => {
          const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
          const dateLabel = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          const narrative = generateCuspNarrative(dateLabel, sunCusp.blend);

          return (
            <div className="cusp-narrative">
              <h4 className="cusp-narrative__headline">{narrative.headline}</h4>
              <p className="cusp-narrative__explanation">{narrative.explanation}</p>
              <p className="cusp-narrative__lived">{narrative.livedExperience}</p>
            </div>
          );
        })()}

        {/* Academy Box - Educational Content */}
        {lesson && (
          <div className="academy-box">
            <h3 className="academy-headline">{lesson.academyBox.headline}</h3>

            <div className="academy-section">
              <h4>
                <span className="academy-icon">{SEASON_EMOJI[lesson.season]}</span>
                Seasonal Meaning
              </h4>
              <p>{lesson.academyBox.seasonalMeaning}</p>
            </div>

            <div className="academy-section">
              <h4>
                <span className="academy-icon">⚡</span>
                Energy Flow
              </h4>
              <p>{lesson.academyBox.energyFlow}</p>
            </div>

            <div className="academy-takeaway">
              <span className="takeaway-label">Takeaway</span>
              <p>{lesson.academyBox.beginnerTakeaway}</p>
            </div>
          </div>
        )}

        <div className="panel-section">
          <h4>Ruling Planet</h4>
          <p className="panel-text">{meta.ruling}</p>
        </div>
        <div className="panel-section">
          <h4>Keywords</h4>
          <div className="panel-tags">
            {meta.keywords.map((k, i) => (
              <span key={i} className="panel-tag keyword">{k}</span>
            ))}
          </div>
        </div>
        <div className="panel-section">
          <h4>Position in Zodiac</h4>
          <p className="panel-text">
            {meta.degreeStart}° - {meta.degreeEnd}° • Degree range of {meta.degreeEnd - meta.degreeStart}°
          </p>
        </div>
        <button className="compat-button" onClick={onSelectForCompat}>
          Select for Compatibility Check
        </button>
      </div>
    </div>
  );
};

export default SignPanel;
