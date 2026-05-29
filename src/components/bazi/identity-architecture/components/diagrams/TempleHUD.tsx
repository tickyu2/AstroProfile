/**
 * TempleHUD — subtle glyph indicators for Temple Mode
 *
 * A minimal, non-intrusive heads-up display showing the metaphysical
 * state of the Temple. Positioned as a thin strip below the title.
 *
 * Indicators:
 *   - Day Master element (with color glyph)
 *   - Current season
 *   - Tension severity (bar + percentage)
 *   - Storm index (lightning indicator, only when active)
 */

import React from 'react';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  dayMaster: string;
  season: string;
  severity: number;
  storm: number;
  bpm: number;
}

const SEASON_GLYPHS: Record<string, string> = {
  spring: '\u{1F331}',
  summer: '\u2600\uFE0F',
  autumn: '\u{1F342}',
  winter: '\u2744\uFE0F',
};

const ELEMENT_GLYPHS: Record<string, string> = {
  Wood: '\u{1F332}',
  Fire: '\u{1F525}',
  Earth: '\u{1F30D}',
  Metal: '\u2699\uFE0F',
  Water: '\u{1F30A}',
};

export const TempleHUD: React.FC<Props> = ({ dayMaster, season, severity, storm, bpm }) => {
  const color = ELEMENT_COLORS[dayMaster] || '#94a3b8';
  const glowIntensity = 4 + severity * 10;

  return (
    <div className="temple-hud">
      {/* Day Master */}
      <div
        className="hud-indicator"
        style={{
          borderColor: `${color}44`,
          boxShadow: `0 0 ${glowIntensity}px ${color}33`,
        }}
      >
        <span className="hud-glyph">{ELEMENT_GLYPHS[dayMaster] || ''}</span>
        <span className="hud-label" style={{ color }}>{dayMaster}</span>
        <span className="hud-value">{bpm} bpm</span>
      </div>

      {/* Season */}
      <div className="hud-indicator">
        <span className="hud-glyph">{SEASON_GLYPHS[season.toLowerCase()] || ''}</span>
        <span className="hud-label">{season}</span>
      </div>

      {/* Tension */}
      <div
        className="hud-indicator"
        style={{
          boxShadow: severity > 0.5
            ? `0 0 ${severity * 12}px rgba(239,68,68,${severity * 0.3})`
            : undefined,
        }}
      >
        <span className="hud-glyph">{severity > 0.6 ? '\u{1F4A2}' : '\u{1F4AB}'}</span>
        <span className="hud-label">Tension</span>
        <span className="hud-value">{Math.round(severity * 100)}%</span>
        <div className="hud-tension-bar">
          <div
            className="hud-tension-fill"
            style={{ width: `${severity * 100}%` }}
          />
        </div>
      </div>

      {/* Storm (only when active) */}
      {storm > 0 && (
        <div
          className="hud-indicator hud-storm"
          style={{
            boxShadow: `0 0 ${8 + storm * 14}px rgba(239,68,68,${0.2 + storm * 0.3})`,
            borderColor: `rgba(239,68,68,${0.2 + storm * 0.3})`,
          }}
        >
          <span className="hud-glyph">{'\u26A1'}</span>
          <span className="hud-label" style={{ color: '#fca5a5' }}>Storm</span>
          <span className="hud-value" style={{ color: '#f87171' }}>
            {Math.round(storm * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
