/**
 * PiscesSpectrumExplorer.tsx
 *
 * Educational tool for understanding the 30° journey through Pisces.
 * Divides Pisces into 6 zones (5° each) with quality metrics, decan rulers,
 * cusp influences, Sabian symbols, and nakshatra correlations.
 *
 * Three view modes: Single zone deep-dive, Side-by-side comparison, Full matrix.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
// @ts-ignore
import piscesZones from '../../data/piscesZones';
// @ts-ignore
import { qualityCategories, compareQualityAcrossZones } from '../../data/piscesQualityCategories';
// @ts-ignore
import { getZoneFromDegree, getUserZoneInfo } from '../../utils/zoneCalculations';
import './PiscesSpectrumExplorer.css';
// @ts-ignore
import PiscesThinkingStyleTab from './PiscesThinkingStyleTab';
import { degreeToApproxDateTime } from '../../data/tropicalConstants';
import type { Zone, QualityCategory, ZoneInfluence, ZoneFamousExample } from './spectrumTypes';

/* ─── Types ─── */

interface PiscesSpectrumExplorerProps {
  userDegree: number | null;
  userName: string | null;
  ephemerisTimestamps?: number[] | null;
}

type ViewMode = 'single' | 'sideBySide' | 'matrix';
type MatrixTab = 'quality' | 'thinking';

/* ─── Sub-component: DegreeSlider ─── */

const DegreeSlider: React.FC<{
  currentDegree: number;
  onDegreeChange: (d: number) => void;
  userDegree?: number | null;
  showUserHighlight?: boolean;
  onJumpToUser?: (() => void) | null;
  ephemerisTimestamps?: number[] | null;
}> = ({ currentDegree, onDegreeChange, userDegree = null, showUserHighlight = false, onJumpToUser = null, ephemerisTimestamps = null }) => {
  const currentZone = getZoneFromDegree(piscesZones, currentDegree);
  const [highlightedDecan, setHighlightedDecan] = useState<number | null>(null);

  const decanZones: Record<number, number[]> = { 1: [1, 2], 2: [3, 4], 3: [5, 6] };

  const handleDecanClick = (decan: number) => {
    setHighlightedDecan(decan);
    onDegreeChange((decan - 1) * 10 + 5);
  };

  const handleZoneClick = (zone: Zone) => {
    setHighlightedDecan(null);
    onDegreeChange((zone.degreeRange.start + zone.degreeRange.end) / 2);
  };

  const handleSliderChange = (d: number) => {
    setHighlightedDecan(null);
    onDegreeChange(d);
  };

  return (
    <div className="tse-slider-container">
      {/* Zodiac Context Labels */}
      <div className="tse-zodiac-context">
        <span className="tse-sign-label tse-aquarius">{'\u2652'} Aquarius 29°</span>
        <span className="tse-sign-label tse-pisces-label">{'\u2653'} PISCES (0° - 30°)</span>
        <span className="tse-sign-label tse-aries">{'\u2648'} Aries 0°</span>
      </div>

      {/* Decan Markers */}
      <div className="tse-decan-markers">
        <div className={`tse-decan tse-decan-1 ${highlightedDecan === 1 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(1)}
             title="First Decan: Neptune/Jupiter - Mutable (click to highlight zones 1-2)">
          <span className="tse-decan-label">1st Decan</span>
          <span className="tse-decan-ruler">Neptune/Jupiter</span>
          <span className="tse-decan-zones">Zones 1–2</span>
        </div>
        <div className={`tse-decan tse-decan-2 ${highlightedDecan === 2 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(2)}
             title="Second Decan: Neptune/Moon - Cardinal (click to highlight zones 3-4)">
          <span className="tse-decan-label">2nd Decan</span>
          <span className="tse-decan-ruler">Neptune/Moon</span>
          <span className="tse-decan-zones">Zones 3–4</span>
        </div>
        <div className={`tse-decan tse-decan-3 ${highlightedDecan === 3 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(3)}
             title="Third Decan: Neptune/Pluto - Fixed (click to highlight zones 5-6)">
          <span className="tse-decan-label">3rd Decan</span>
          <span className="tse-decan-ruler">Neptune/Pluto</span>
          <span className="tse-decan-zones">Zones 5–6</span>
        </div>
      </div>

      {/* Zone Markers */}
      <div className="tse-zone-markers">
        {piscesZones.map((zone: Zone) => {
          const isHighlighted = highlightedDecan
            ? decanZones[highlightedDecan]?.includes(zone.id)
            : currentZone?.id === zone.id;
          return (
            <div
              key={zone.id}
              className={`tse-zone-marker tse-zone-${zone.id} ${isHighlighted ? 'tse-active' : ''}`}
              style={{
                flex: `${zone.degreeRange.end - zone.degreeRange.start + 0.99} 0 0`,
                background: zone.colorTheme.gradient,
              }}
              title={`Zone ${zone.id}: ${zone.name} (${zone.degreeRange.start}°-${zone.degreeRange.end}°) — click to jump`}
              onClick={() => handleZoneClick(zone)}
            >
              <span className="tse-zone-number">{zone.id}</span>
            </div>
          );
        })}

        {/* User Degree Marker - inside zone-markers for proper clipping */}
        {userDegree !== null && userDegree !== undefined && showUserHighlight && (
          <div
            className="tse-user-degree-marker"
            style={{ left: `${((userDegree as number) / 30) * 100}%` }}
            title={`Your Sun: ${(userDegree as number).toFixed(2)}° Pisces`}
          >
            <div className="tse-user-marker-line" />
            <div className="tse-user-marker-label">{'\u2B50'} You</div>
          </div>
        )}
      </div>

      {/* Main Slider */}
      <div className="tse-slider-wrapper">
        <input
          type="range"
          min="0"
          max="29.59"
          step="0.01"
          value={currentDegree}
          onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
          className="tse-degree-slider"
          style={{ '--tse-zone-color': currentZone?.colorTheme?.primary || '#7B68EE' } as React.CSSProperties}
        />
      </div>

      {/* Degree Scale — right below slider */}
      <div className="tse-degree-scale">
        {[0, 5, 10, 15, 20, 25, 30].map((deg) => (
          <div key={deg} className="tse-scale-mark" style={{ left: `${(deg / 30) * 100}%` }}>
            <div className="tse-scale-tick" />
            <div className="tse-scale-label">{deg}°</div>
          </div>
        ))}
      </div>

      {/* Current Position Info */}
      <div className="tse-slider-info">
        <div className="tse-current-position">
          <div className="tse-degree-display">
            <span className="tse-degree-value">{currentDegree.toFixed(2)}°</span>
            <span className="tse-sign-name">Pisces</span>
            <span className="tse-approx-date">~ {degreeToApproxDateTime(330 + currentDegree, ephemerisTimestamps)}</span>
          </div>
          <div className="tse-absolute-position">
            Absolute: {(330 + currentDegree).toFixed(2)}° ecliptic
          </div>
        </div>

        {currentZone && (
          <div className="tse-current-zone" style={{ borderLeft: `4px solid ${currentZone.colorTheme.primary}` }}>
            <div className="tse-zone-name">
              <strong>Zone {currentZone.id}:</strong> {currentZone.name}
            </div>
            <div className="tse-zone-archetype">{currentZone.archetype}</div>
          </div>
        )}

        {userDegree != null && onJumpToUser && (
          <button
            className="tse-jump-to-user-btn"
            onClick={onJumpToUser}
            title={`Jump to your degree: ${(userDegree as number).toFixed(2)}°`}
          >
            <span className="tse-btn-icon">{'\u2B50'}</span>
            <span className="tse-btn-text">Jump to My Degree</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Sub-component: ViewModeSelector ─── */

const ViewModeSelector: React.FC<{
  currentMode: ViewMode;
  onModeChange: (m: ViewMode) => void;
}> = ({ currentMode, onModeChange }) => {
  const modes: { id: ViewMode; label: string; icon: string; description: string }[] = [
    { id: 'single', label: 'Single View', icon: '\uD83D\uDCC4', description: 'Deep dive into one zone' },
    { id: 'sideBySide', label: 'Side-by-Side', icon: '\uD83D\uDCCA', description: 'Compare 2-3 zones' },
    { id: 'matrix', label: 'Full Matrix', icon: '\uD83D\uDD32', description: 'All 6 zones' },
  ];

  return (
    <div className="tse-view-mode-selector">
      <label className="tse-selector-label">Comparison Mode:</label>
      <div className="tse-mode-buttons">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`tse-mode-button ${currentMode === mode.id ? 'tse-active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            <span className="tse-mode-icon">{mode.icon}</span>
            <span className="tse-mode-label">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Sub-component: ZoneSelector ─── */

const ZoneSelector: React.FC<{
  selectedZones: number[];
  onZoneToggle: (id: number) => void;
  maxSelections: number;
  allZones: Zone[];
}> = ({ selectedZones, onZoneToggle, maxSelections, allZones }) => (
  <div className="tse-zone-selector">
    <label className="tse-selector-label">
      Select Zones to Compare:
      {maxSelections > 1 && (
        <span className="tse-selection-count"> ({selectedZones.length}/{maxSelections})</span>
      )}
    </label>
    <div className="tse-zone-buttons">
      {allZones.map((zone: Zone) => {
        const isSelected = selectedZones.includes(zone.id);
        const isDisabled = maxSelections > 1 && !isSelected && selectedZones.length >= maxSelections;
        return (
          <button
            key={zone.id}
            className={`tse-zone-button ${isSelected ? 'tse-selected' : ''} ${isDisabled ? 'tse-disabled' : ''}`}
            onClick={() => onZoneToggle(zone.id)}
            disabled={isDisabled}
            style={{
              background: isSelected ? zone.colorTheme.gradient : 'transparent',
              borderColor: zone.colorTheme.primary,
              color: isSelected ? '#fff' : zone.colorTheme.primary,
            }}
            title={`${zone.name} (${zone.degreeRange.start}°-${zone.degreeRange.end}°)`}
          >
            <span className="tse-zone-btn-number">Zone {zone.id}</span>
            <span className="tse-zone-name-short">{zone.name.split(':')[0].trim()}</span>
          </button>
        );
      })}
    </div>
    {maxSelections > 1 && selectedZones.length < 2 && (
      <div className="tse-selection-hint">Select at least 2 zones to compare</div>
    )}
  </div>
);

/* ─── Sub-component: SingleZoneView ─── */

function getArchetypeDescription(zone: Zone): string {
  const descriptions: Record<number, string> = {
    1: "You're the Pisces who arrives with Aquarius's revolutionary intellect still weaving through your mystical core. While other Fish dissolve into dreams, you channel spiritual vision with innovative clarity. You're 75% Neptunian transcendence, 25% Uranian intellectual innovation. Think of yourself as the visionary mystic who can articulate the ineffable\u2014you don't just feel the divine, you innovate new ways to share it.",
    2: "You've hit pure Neptune territory\u2014no dilution, no compromise. The Aquarius intellect has dissolved into raw, unfiltered spiritual transcendence. You are the pure mystic, the divine channel who merges with universal consciousness. You don't just feel\u2014you BECOME the ocean of divine love that most people can only glimpse in their deepest dreams.",
    3: "Moon's sub-ruler adds emotional nurturing to Neptune's spiritual dissolution. You're the Pisces who doesn't just feel\u2014you heal. Maximum empathic absorption meets maximum spiritual compassion. People don't just feel comforted around you\u2014they feel HELD by a divine mothering presence that dissolves all their pain.",
    4: "You're the Pisces spiritual alchemist at peak transformative depth. Pluto's influence creates an unstoppable force of spiritual transformation beneath Neptune's dissolving surface. You don't just feel darkness\u2014you transmute it into light. You combine the mystic's compassion with an alchemist's power to transform the collective shadow.",
    5: "You combine Pisces's spiritual transcendence with Cancer's emotional depth through the Moon's influence again at the third decan. You're not just feeling\u2014you're creating divine art from emotion. The Moon adds creative emotional expression to your spirituality, making you the artist who channels the divine through pure feeling into works that heal the world.",
    6: "You're the Pisces who channels spiritual transcendence into Aries's approaching courageous action. While other Fish dissolve into passivity, you ACT on divine guidance with warrior courage. You don't just dream\u2014you fight for the spiritual vision. You're the most courageous Pisces, turning transcendent compassion into fearless spiritual pioneering.",
  };
  return descriptions[zone.id] || '';
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

const SingleZoneView: React.FC<{
  zone: Zone;
  currentDegree: number;
  isUserZone?: boolean;
}> = ({ zone, currentDegree, isUserZone = false }) => (
  <div
    className="tse-single-zone-view"
    style={{
      borderTop: `6px solid ${zone.colorTheme.primary}`,
      '--tse-zone-primary': zone.colorTheme.primary,
      '--tse-zone-secondary': zone.colorTheme.secondary,
    } as React.CSSProperties}
  >
    {/* Header */}
    <header className="tse-szv-header">
      <div className="tse-zone-badge" style={{ background: zone.colorTheme.gradient }}>
        Zone {zone.id}
      </div>
      <h2 className="tse-szv-zone-name">{zone.name}</h2>
      <h3 className="tse-szv-zone-archetype">"{zone.archetype}"</h3>

      {isUserZone && (
        <div className="tse-user-zone-indicator">
          {'\u2B50'} This is YOUR zone at {currentDegree.toFixed(2)}°
        </div>
      )}

      <div className="tse-degree-info-grid">
        <div className="tse-info-item">
          <span className="tse-info-label">Degree Range</span>
          <span className="tse-info-value">{zone.degreeRange.start}° - {zone.degreeRange.end}° Pisces</span>
        </div>
        <div className="tse-info-item">
          <span className="tse-info-label">Absolute Position</span>
          <span className="tse-info-value">{zone.degreeRange.absoluteStart}° - {zone.degreeRange.absoluteEnd}° ecliptic</span>
        </div>
        <div className="tse-info-item">
          <span className="tse-info-label">Birth Dates</span>
          <span className="tse-info-value">{zone.dateRange.start} - {zone.dateRange.end}</span>
        </div>
        <div className="tse-info-item">
          <span className="tse-info-label">Duration</span>
          <span className="tse-info-value">{zone.dateRange.duration}</span>
        </div>
      </div>
    </header>

    {/* Decan & Rulers */}
    <section className="tse-section">
      <h4 className="tse-section-title">{'\uD83C\uDF1F'} Decan & Planetary Rulers</h4>
      <div className="tse-decan-grid">
        <div className="tse-decan-info-card"><label>Decan</label><div className="tse-decan-val">{zone.decan.name}</div></div>
        <div className="tse-decan-info-card"><label>Primary Ruler</label><div className="tse-decan-val">{zone.decan.primaryRuler} (Pisces)</div></div>
        <div className="tse-decan-info-card"><label>Sub-Ruler</label><div className="tse-decan-val">{zone.decan.subRuler}</div></div>
        <div className="tse-decan-info-card"><label>Modality</label><div className="tse-decan-val">{zone.decan.modality}</div></div>
      </div>

      <div className="tse-influences">
        <h5>Planetary Influences:</h5>
        {zone.influences.map((influence: ZoneInfluence, idx: number) => (
          <div key={idx} className="tse-influence-item">
            <div className="tse-influence-header">
              <span className="tse-influence-source">{influence.source}</span>
              <span className="tse-influence-planet">({influence.planet})</span>
              <span className="tse-influence-type">{influence.type}</span>
              <span className="tse-influence-percentage">{influence.percentage}%</span>
            </div>
            <div className="tse-influence-bar-container">
              <div
                className="tse-influence-bar-fill"
                style={{ width: `${influence.percentage}%`, background: zone.colorTheme.gradient }}
              />
            </div>
            <div className="tse-influence-traits">
              {influence.traits.map((trait: string, i: number) => (
                <span key={i} className="tse-trait-tag">{trait}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Quality Profile */}
    <section className="tse-section">
      <h4 className="tse-section-title">{'\uD83D\uDD2C'} Quality Profile</h4>
      <div className="tse-quality-bars">
        {qualityCategories.map((category: QualityCategory) => {
          const quality = zone.qualities[category.id];
          if (!quality) return null;
          return (
            <div key={category.id} className="tse-quality-item">
              <div className="tse-quality-label-row">
                <label className="tse-quality-label">
                  <span className="tse-quality-icon">{category.icon}</span>
                  {category.label}
                </label>
                <span className="tse-quality-level-label">{quality.label}</span>
              </div>
              <div className="tse-quality-bar-container">
                <div className="tse-quality-icons-display">{quality.icon}</div>
                <div className="tse-quality-bar">
                  <div
                    className="tse-quality-bar-fill"
                    style={{ width: `${quality.level}%`, background: zone.colorTheme.gradient }}
                  >
                    <span className="tse-quality-percentage">{quality.level}%</span>
                  </div>
                </div>
              </div>
              <div className="tse-quality-description">{category.description}</div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Archetype Essence */}
    <section className="tse-section">
      <h4 className="tse-section-title">{'\uD83C\uDFAD'} Archetype Essence</h4>
      <div className="tse-archetype-description">{getArchetypeDescription(zone)}</div>
    </section>

    {/* Strengths & Shadows */}
    <div className="tse-strengths-shadows-grid">
      <section>
        <h4 className="tse-section-title">{'\uD83D\uDCAA'} Core Strengths</h4>
        <ul className="tse-strengths-list">
          {zone.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
      </section>
      <section>
        <h4 className="tse-section-title">{'\u26A0\uFE0F'} Shadow Challenges</h4>
        <ul className="tse-shadows-list">
          {zone.shadows.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
      </section>
    </div>

    {/* Career Signatures */}
    <section className="tse-section">
      <h4 className="tse-section-title">{'\uD83D\uDCBC'} Career Signatures</h4>
      <div className="tse-career-tags">
        {zone.careerSignatures.map((career: string, idx: number) => (
          <span
            key={idx}
            className="tse-career-tag"
            style={{ borderColor: zone.colorTheme.primary, color: zone.colorTheme.primary }}
          >
            {career}
          </span>
        ))}
      </div>
    </section>

    {/* Relationship Style */}
    <section className="tse-section">
      <h4 className="tse-section-title">{'\u2764\uFE0F'} Relationship Style</h4>
      <div className="tse-relationship-grid">
        {Object.entries(zone.relationshipStyle).map(([key, value]: [string, string]) => (
          <div key={key} className="tse-relationship-item">
            <label>{formatLabel(key)}</label>
            <div className="tse-relationship-value">{value}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Famous Examples */}
    {zone.famousExamples && zone.famousExamples.length > 0 && (
      <section className="tse-section">
        <h4 className="tse-section-title">{'\uD83C\uDF0D'} Famous Examples</h4>
        <div className="tse-famous-examples-grid">
          {zone.famousExamples.map((person: ZoneFamousExample, idx: number) => (
            <div key={idx} className="tse-famous-person-card">
              <div className="tse-person-name">{person.name}</div>
              <div className="tse-person-details">{person.birthdate} {'\u2022'} {person.degree}</div>
              <p className="tse-person-notes">{person.notes}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Sabian Symbol */}
    {zone.sabianSymbol && (
      <section className="tse-section">
        <h4 className="tse-section-title">{'\uD83D\uDD2E'} Sabian Symbol</h4>
        <div className="tse-sabian-card">
          <div className="tse-sabian-degree">{zone.sabianSymbol.degree}° Pisces</div>
          <blockquote className="tse-sabian-symbol">"{zone.sabianSymbol.symbol}"</blockquote>
          <p className="tse-sabian-interpretation">{zone.sabianSymbol.interpretation}</p>
        </div>
      </section>
    )}

    {/* Nakshatra */}
    {zone.nakshatra && (
      <section className="tse-section">
        <h4 className="tse-section-title">{'\u2728'} Nakshatra (Vedic Astrology)</h4>
        <div className="tse-nakshatra-card">
          <div className="tse-nakshatra-header">
            <strong className="tse-nakshatra-name">{zone.nakshatra.name}</strong>
            <span className="tse-nakshatra-range">({zone.nakshatra.range})</span>
          </div>
          <div className="tse-nakshatra-details">
            <div className="tse-nakshatra-detail"><label>Ruled by:</label><span>{zone.nakshatra.ruler}</span></div>
            <div className="tse-nakshatra-detail"><label>Symbol:</label><span>{zone.nakshatra.symbol}</span></div>
            <div className="tse-nakshatra-detail"><label>Deity:</label><span>{zone.nakshatra.deity}</span></div>
          </div>
          <div className="tse-nakshatra-qualities">
            {zone.nakshatra.qualities.map((q: string, i: number) => (
              <span key={i} className="tse-quality-chip">{q}</span>
            ))}
          </div>
        </div>
      </section>
    )}
  </div>
);

/* ─── Sub-component: SideBySideView ─── */

const SideBySideView: React.FC<{
  zones: Zone[];
  userDegree?: number | null;
}> = ({ zones }) => {
  const insights = useMemo(() => {
    const result: { category: string; icon: string; text: string; significance: string }[] = [];
    qualityCategories.forEach((category: QualityCategory) => {
      const comparison = compareQualityAcrossZones(zones, category.id);
      if (comparison.range > 30) {
        result.push({
          category: category.label,
          icon: category.icon,
          text: `${comparison.range}% difference: Zone ${comparison.maxZone.id} (${comparison.max}%) vs Zone ${comparison.minZone.id} (${comparison.min}%)`,
          significance: comparison.range > 50 ? 'high' : 'medium',
        });
      }
    });
    return result;
  }, [zones]);

  return (
    <div className="tse-side-by-side-view">
      <div className="tse-comparison-header">
        <h3>Comparing {zones.length} Pisces Zones</h3>
        <p>Highlighting similarities and differences across the spectrum</p>
      </div>

      <div className="tse-comparison-grid" style={{ gridTemplateColumns: `repeat(${zones.length}, 1fr)` }}>
        {zones.map((zone: Zone) => (
          <div key={zone.id} className="tse-zone-column">
            <header className="tse-zone-column-header" style={{ background: zone.colorTheme.gradient }}>
              <div className="tse-zone-id">Zone {zone.id}</div>
              <h4 className="tse-zone-col-name">{zone.name}</h4>
              <div className="tse-zone-col-archetype">{zone.archetype}</div>
              <div className="tse-zone-degree-range">{zone.degreeRange.start}° - {zone.degreeRange.end}°</div>
            </header>

            <div className="tse-influence-summary">
              {zone.influences.map((inf: ZoneInfluence, idx: number) => (
                <div key={idx} className="tse-influence-chip" title={inf.traits.join(', ')}>
                  <span className="tse-influence-chip-source">{inf.source}</span>
                  <span className="tse-influence-chip-percent">{inf.percentage}%</span>
                </div>
              ))}
            </div>

            <div className="tse-qualities-compact">
              {qualityCategories.map((category: QualityCategory) => {
                const quality = zone.qualities[category.id];
                if (!quality) return null;
                return (
                  <div key={category.id} className="tse-qc-row">
                    <div className="tse-qc-row-header">
                      <span className="tse-qc-icon">{category.icon}</span>
                      <label>{category.label}</label>
                    </div>
                    <div className="tse-mini-bar-container">
                      <div className="tse-mini-bar">
                        <div className="tse-mini-bar-fill" style={{ width: `${quality.level}%`, background: zone.colorTheme.gradient }} />
                      </div>
                      <span className="tse-qc-percent">{quality.level}%</span>
                    </div>
                    <div className="tse-qc-label-text">{quality.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="tse-key-traits">
              <div className="tse-trait-item"><h5>Career Style</h5><p>{zone.careerSignatures[0]}</p></div>
              <div className="tse-trait-item"><h5>Commitment Speed</h5><p>{zone.relationshipStyle.commitmentSpeed}</p></div>
              <div className="tse-trait-item"><h5>Conflict Style</h5><p>{zone.relationshipStyle.conflict}</p></div>
              <div className="tse-trait-item"><h5>Core Strength</h5><p>{zone.strengths[0]}</p></div>
              <div className="tse-trait-item"><h5>Main Challenge</h5><p>{zone.shadows[0]}</p></div>
            </div>

            {zone.famousExamples?.[0] && (
              <div className="tse-famous-example-mini">
                <h5>Example</h5>
                <div className="tse-person-name">{zone.famousExamples[0].name}</div>
                <div className="tse-person-date">{zone.famousExamples[0].birthdate}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {insights.length > 0 && (
        <section className="tse-comparison-insights">
          <h4 className="tse-insights-title">{'\uD83D\uDCA1'} Key Differences</h4>
          <div className="tse-insights-grid">
            {insights.map((insight, idx) => (
              <div key={idx} className={`tse-insight-card tse-${insight.significance}`}>
                <span className="tse-insight-icon">{insight.icon}</span>
                <div className="tse-insight-content">
                  <strong>{insight.category}:</strong> {insight.text}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="tse-commonalities">
        <h4 className="tse-commonalities-title">{'\uD83D\uDD17'} What All These Zones Share</h4>
        <div className="tse-commonalities-grid">
          <div className="tse-commonality-item">
            <span className="tse-commonality-icon">{'\uD83D\uDD2E'}</span>
            <div><strong>Spiritual Connection:</strong> All maintain a direct channel to the transcendent{'\u2014'}this is the Pisces constant</div>
          </div>
          <div className="tse-commonality-item">
            <span className="tse-commonality-icon">{'\uD83D\uDC97'}</span>
            <div><strong>Universal Compassion:</strong> All express powerful unconditional love and empathic absorption</div>
          </div>
          <div className="tse-commonality-item">
            <span className="tse-commonality-icon">{'\uD83C\uDF0A'}</span>
            <div><strong>Boundary Dissolution:</strong> All are oriented toward merging, transcendence, and dissolving limitations</div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Shared: MatrixTableContent (reused inline & in flap) ─── */

const MatrixTableContent: React.FC<{
  zones: Zone[];
  highlightZones?: number[];
  isFlap?: boolean;
}> = ({ zones, highlightZones = [], isFlap = false }) => (
  <div className={`tse-table-wrapper ${isFlap ? 'tse-flap-table-wrapper' : ''}`}>
    <table className={`tse-matrix-table ${isFlap ? 'tse-matrix-table-flap' : ''}`}>
      <thead>
        <tr>
          <th className="tse-th-quality">Quality</th>
          {zones.map((zone: Zone) => (
            <th
              key={zone.id}
              className={`tse-th-zone ${highlightZones.includes(zone.id) ? 'tse-highlighted' : ''}`}
              style={{ borderTop: `4px solid ${zone.colorTheme.primary}` }}
            >
              <div className="tse-th-zone-content">
                <span className="tse-th-zone-num">Zone {zone.id}</span>
                <span className="tse-th-zone-name">{zone.name.split(':')[0].trim()}</span>
                <span className="tse-th-zone-deg">{zone.degreeRange.start}°-{zone.degreeRange.end}°</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {qualityCategories.map((category: QualityCategory) => (
          <tr key={category.id}>
            <td className="tse-td-quality-label">
              <span className="tse-td-icon">{category.icon}</span>
              <span>{category.label}</span>
            </td>
            {zones.map((zone: Zone) => {
              const quality = zone.qualities[category.id];
              return (
                <td key={zone.id} className={`tse-td-quality ${highlightZones.includes(zone.id) ? 'tse-highlighted' : ''}`}>
                  <div className="tse-td-quality-content">
                    <div className="tse-td-quality-icons">{quality?.icon}</div>
                    <div className="tse-td-quality-pct">{quality?.level}%</div>
                    <div className="tse-td-quality-bar">
                      <div className="tse-td-quality-bar-fill" style={{ width: `${quality?.level}%`, background: zone.colorTheme.primary }} />
                    </div>
                  </div>
                </td>
              );
            })}
          </tr>
        ))}

        <tr className="tse-section-break">
          <td colSpan={zones.length + 1}><strong>Career & Relationship Patterns</strong></td>
        </tr>

        {[
          { icon: '\uD83D\uDCBC', label: 'Primary Career Style', getter: (z: Zone) => z.careerSignatures[0] },
          { icon: '\u2764\uFE0F', label: 'Commitment Timeline', getter: (z: Zone) => z.relationshipStyle.commitmentSpeed },
          { icon: '\u2694\uFE0F', label: 'Conflict Response', getter: (z: Zone) => z.relationshipStyle.conflict },
        ].map((row) => (
          <tr key={row.label} className="tse-info-row">
            <td className="tse-td-info-label">
              <span className="tse-td-icon">{row.icon}</span>
              <span>{row.label}</span>
            </td>
            {zones.map((zone: Zone) => (
              <td key={zone.id} className={`tse-td-info ${highlightZones.includes(zone.id) ? 'tse-highlighted' : ''}`}>
                {row.getter(zone)}
              </td>
            ))}
          </tr>
        ))}

        <tr className="tse-section-break">
          <td colSpan={zones.length + 1}><strong>Unique Defining Traits</strong></td>
        </tr>

        {[
          { icon: '\uD83D\uDCAA', label: 'Primary Strength', getter: (z: Zone) => z.strengths[0] },
          { icon: '\u26A0\uFE0F', label: 'Main Shadow', getter: (z: Zone) => z.shadows[0] },
        ].map((row) => (
          <tr key={row.label} className="tse-info-row">
            <td className="tse-td-info-label">
              <span className="tse-td-icon">{row.icon}</span>
              <span>{row.label}</span>
            </td>
            {zones.map((zone: Zone) => (
              <td key={zone.id} className={`tse-td-info ${highlightZones.includes(zone.id) ? 'tse-highlighted' : ''}`}>
                {row.getter(zone)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── Sub-component: FullMatrixView ─── */

const FullMatrixView: React.FC<{
  zones: Zone[];
  userDegree?: number | null;
  highlightZone?: number | null;
  externalOpen?: boolean;
  onExternalOpenHandled?: () => void;
}> = ({ zones, highlightZone = null, userDegree = null, externalOpen = false, onExternalOpenHandled }) => {
  const [matrixFlapOpen, setMatrixFlapOpen] = useState(false);

  useEffect(() => {
    if (externalOpen) {
      setMatrixFlapOpen(true);
      onExternalOpenHandled?.();
    }
  }, [externalOpen]);
  const [flapDegree, setFlapDegree] = useState<number>(userDegree ?? 15);
  const [flapPos, setFlapPos] = useState({ x: 20, y: 20 });
  const dragState = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [highlightedZones, setHighlightedZones] = useState<number[]>([]);
  const [matrixTab, setMatrixTab] = useState<MatrixTab>('quality');
  const DECAN_ZONES: Record<number, number[]> = { 1: [1, 2], 2: [3, 4], 3: [5, 6] };

  // Degree to date string (Pisces: ~February 19 to March 20, 30 days for 30°)
  const degreeToDateStr = (deg: number) => {
    const d = new Date(2025, 1, 19); // February 19
    d.setDate(d.getDate() + Math.round(deg * 30 / 30));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Active zone from slider degree (for readout + slider track)
  const flapActiveZone = useMemo(() =>
    zones.find((z: Zone) => flapDegree >= z.degreeRange.start && flapDegree <= z.degreeRange.end) ?? zones[0],
    [flapDegree, zones]
  );

  // Drag handling for floating panel
  const onDragStart = (e: React.MouseEvent) => {
    dragState.current = { sx: e.clientX, sy: e.clientY, ox: flapPos.x, oy: flapPos.y };
    e.preventDefault();
  };
  useEffect(() => {
    if (!matrixFlapOpen) return;
    const onMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      setFlapPos({
        x: Math.max(0, dragState.current.ox + e.clientX - dragState.current.sx),
        y: Math.max(0, dragState.current.oy + e.clientY - dragState.current.sy),
      });
    };
    const onUp = () => { dragState.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [matrixFlapOpen]);

  const DECANS = [
    { num: 1, name: 'First Decan', ruler: 'Neptune / Jupiter', quality: 'Mutable \u00B7 Pure Pisces', accent: '#9370DB' },
    { num: 2, name: 'Second Decan', ruler: 'Neptune / Moon', quality: 'Cardinal \u00B7 Cancer', accent: '#9966CC' },
    { num: 3, name: 'Third Decan', ruler: 'Neptune / Pluto', quality: 'Fixed \u00B7 Scorpio', accent: '#DDA0DD' },
  ];

  // phi Golden Ratio Cusp Blending
  const [phiOpen, setPhiOpen] = useState(false);
  const phiBlend = useMemo(() => {
    const PHI = 1.618033988749895;
    const N = 6;
    const adj = (d: number) =>
      Math.round(100 * Math.pow((N + 1 - d) / (N + 1), PHI));
    return {
      aquarius: Array.from({ length: N }, (_, i) => {
        const dt = new Date(2025, 1, 19 + i);
        const a = adj(i + 1);
        return { dt: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sco: 100 - a, adj: a };
      }),
      aries: Array.from({ length: N }, (_, i) => {
        const dt = new Date(2025, 2, 15 + i);
        const a = adj(N - i);
        return { dt: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sco: 100 - a, adj: a };
      }),
    };
  }, []);
  const phiActiveDay = Math.min(30, Math.max(1, 1 + Math.round(flapDegree)));

  // MD Export — generates a markdown file from all panel data
  const exportMD = () => {
    const PHI = 1.618033988749895;
    const N = 6;
    const adj = (d: number) => Math.round(100 * Math.pow((N + 1 - d) / (N + 1), PHI));

    let md = '# The Pisces Spectrum Explorer\n\n';
    md += '> A 30\u00B0 journey through Pisces \u2014 six zones, three decans, one sign.\n\n';

    // Zone overview
    md += '## Zone Overview\n\n';
    md += '| Zone | Name | Degrees | Dates | Decan |\n';
    md += '|------|------|---------|-------|-------|\n';
    zones.forEach((z: Zone) => {
      md += `| ${z.id} | ${z.name} | ${z.degreeRange.start}\u00B0\u2013${z.degreeRange.end}\u00B0 | ${z.dateRange.start} \u2013 ${z.dateRange.end} | ${z.decan} |\n`;
    });

    // Quality matrix
    md += '\n## Quality Comparison Matrix\n\n';
    md += '| Quality |' + zones.map((z: Zone) => ` Zone ${z.id} `).join('|') + '|\n';
    md += '|---------|' + zones.map(() => '-----').join('|') + '|\n';
    qualityCategories.forEach((q: QualityCategory) => {
      md += `| ${q.icon} ${q.label} |`;
      zones.forEach((z: Zone) => {
        const lv = z.qualities?.[q.id]?.level ?? '\u2013';
        md += ` ${lv}/100 |`;
      });
      md += '\n';
    });

    // Decan structure
    md += '\n## Decan Structure\n\n';
    md += '| Decan | Ruler | Zones | Quality |\n';
    md += '|-------|-------|-------|---------|\n';
    md += '| First (0\u00B0\u20139\u00B0) | Neptune / Jupiter | 1\u20132 | Mutable \u00B7 Pure Pisces |\n';
    md += '| Second (10\u00B0\u201319\u00B0) | Neptune / Moon | 3\u20134 | Cardinal \u00B7 Cancer |\n';
    md += '| Third (20\u00B0\u201329\u00B0) | Neptune / Pluto | 5\u20136 | Fixed \u00B7 Scorpio |\n';

    // phi Golden Ratio Cusp Blending
    md += '\n## \u03C6 Golden Ratio Cusp Blending\n\n';
    md += 'Adjacent sign influence = ((days_remaining \u00F7 7)^\u03C6) \u00D7 100%, where \u03C6 = 1.618033\u2026\n\n';
    md += '### Aquarius \u2652 Cusp (first 6 days)\n\n';
    md += '| Date | Pisces % | Aquarius % |\n';
    md += '|------|---------|----------|\n';
    for (let i = 0; i < N; i++) {
      const a = adj(i + 1);
      const dt = new Date(2025, 1, 19 + i);
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      md += `| ${label} | ${100 - a}% | ${a}% |\n`;
    }
    md += '\n**Feb 25 \u2013 Mar 14: 100% Pure Pisces (18 days)**\n\n';
    md += '### Aries \u2648 Cusp (last 6 days)\n\n';
    md += '| Date | Pisces % | Aries % |\n';
    md += '|------|---------|----------|\n';
    for (let i = 0; i < N; i++) {
      const a = adj(N - i);
      const dt = new Date(2025, 2, 15 + i);
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      md += `| ${label} | ${100 - a}% | ${a}% |\n`;
    }

    // Zone details
    md += '\n## Zone Details\n\n';
    zones.forEach((z: Zone) => {
      md += `### Zone ${z.id}: ${z.name}\n\n`;
      md += `- **Archetype:** ${z.archetype || '\u2013'}\n`;
      md += `- **Degrees:** ${z.degreeRange.start}\u00B0\u2013${z.degreeRange.end}\u00B0\n`;
      md += `- **Dates:** ${z.dateRange.start} \u2013 ${z.dateRange.end}\n`;
      if (z.strengths?.length) md += `- **Strengths:** ${z.strengths.join(', ')}\n`;
      if (z.shadows?.length) md += `- **Shadows:** ${z.shadows.join(', ')}\n`;
      if (z.famousExamples?.length) md += `- **Famous Examples:** ${z.famousExamples.join(', ')}\n`;
      md += '\n';
    });

    md += '---\n*Generated by The Pisces Spectrum Explorer \u00B7 AstroProfile*\n';

    // Trigger download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pisces-spectrum-explorer.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
  <div className="tse-matrix-view">
    {/* Interactive Floating Panel */}
    {matrixFlapOpen && (
      <div className="tse-float-panel" style={{ left: flapPos.x, top: flapPos.y }}>
        {/* Row 1: Draggable title */}
        <div className="tse-float-titlebar" onMouseDown={onDragStart}>
          <span className="tse-float-grip">{'\u2630'}</span>
          <h2>The Pisces Spectrum Explorer</h2>
          <button className="tse-float-export" onClick={e => { e.stopPropagation(); exportMD(); }} title="Export as Markdown">
            {'\u2B07'} MD
          </button>
          <button className="tse-float-close" onClick={() => setMatrixFlapOpen(false)}>{'\u00D7'}</button>
        </div>

        {/* Row 2: Decan info — highlights active decan */}
        <div className="tse-float-decans">
          {DECANS.map(dec => (
            <div
              key={dec.num}
              className={`tse-float-dec ${DECAN_ZONES[dec.num].some(z => highlightedZones.includes(z)) ? 'tse-float-dec--active' : ''}`}
              style={{ '--dec-accent': dec.accent } as React.CSSProperties}
              onClick={() => {
                setHighlightedZones(DECAN_ZONES[dec.num]);
                setFlapDegree(dec.num === 1 ? 5 : dec.num === 2 ? 15 : 25);
              }}
            >
              <strong>{dec.name}</strong>
              <span>{dec.ruler}</span>
              <span className="tse-float-dec-q">{dec.quality}</span>
            </div>
          ))}
        </div>

        {/* Row 3: Zone badges grouped under decans */}
        <div className="tse-float-zones">
          <div className="tse-float-zones-title">The Complete Pisces Spectrum</div>
          <div className="tse-float-zone-groups">
            {[[1, 2], [3, 4], [5, 6]].map((grp, gi) => (
              <div key={gi} className="tse-float-zgrp">
                {grp.map(zid => {
                  const z = zones.find((zz: Zone) => zz.id === zid);
                  if (!z) return null;
                  return (
                    <button
                      key={zid}
                      className={`tse-float-zbadge ${highlightedZones.includes(zid) ? 'tse-float-zbadge--active' : ''}`}
                      style={{ background: z.colorTheme.primary }}
                      onClick={() => {
                        setHighlightedZones([zid]);
                        setFlapDegree((z.degreeRange.start + z.degreeRange.end) / 2);
                      }}
                      title={z.name}
                    >
                      <span className="tse-float-zb-id">Zone {zid}</span>
                      <span className="tse-float-zb-deg">{z.dateRange.start} – {z.dateRange.end}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Row 4 + 5: Interactive degree slider & synced date markers */}
        <div className="tse-float-interactive">
          <div className="tse-float-slider-wrap">
            <div className="tse-float-track">
              {zones.map((z: Zone) => (
                <div
                  key={z.id}
                  className="tse-float-track-seg"
                  style={{
                    width: `${100 / zones.length}%`,
                    background: z.colorTheme.primary,
                    opacity: flapActiveZone?.id === z.id ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
            <input
              type="range"
              className="tse-float-range"
              min={0}
              max={29.59}
              step={0.1}
              value={flapDegree}
              onChange={e => {
                const deg = parseFloat(e.target.value);
                setFlapDegree(deg);
                const az = zones.find((zz: Zone) => deg >= zz.degreeRange.start && deg <= zz.degreeRange.end);
                if (az) setHighlightedZones([az.id]);
              }}
              title="Pisces degree position"
            />
          </div>
          <div className="tse-float-readout">
            <span className="tse-float-readout-deg">{flapDegree.toFixed(1)}° Pisces</span>
            <span className="tse-float-readout-date">{degreeToDateStr(flapDegree)}</span>
            {flapActiveZone && (
              <span className="tse-float-readout-zone" style={{ color: flapActiveZone.colorTheme.primary }}>
                Zone {flapActiveZone.id}: {flapActiveZone.name}
              </span>
            )}
          </div>
          <div className="tse-float-dates">
            {zones.map((z: Zone) => (
              <button
                key={z.id}
                className={`tse-float-dm ${highlightedZones.includes(z.id) ? 'tse-float-dm--active' : ''}`}
                onClick={() => {
                  setHighlightedZones([z.id]);
                  setFlapDegree((z.degreeRange.start + z.degreeRange.end) / 2);
                }}
              >
                {z.dateRange.start}
              </button>
            ))}
          </div>
        </div>

        {/* phi Golden Ratio Cusp Blending — fixed above scroll */}
        <div className="tse-phi">
          <button className="tse-phi-hd" onClick={() => setPhiOpen(p => !p)}>
            <span className="tse-phi-icon">{'\u03C6'}</span>
            <span>Golden Ratio Cusp Blending</span>
            <span className="tse-phi-caret">{phiOpen ? '\u25B4' : '\u25BE'}</span>
          </button>
          {phiOpen && (
            <div className="tse-phi-body">
              <div className="tse-phi-chart">
                {/* Aquarius cusp */}
                <div className="tse-phi-wing">
                  <div className="tse-phi-wing-hd" style={{ color: '#00BFFF' }}>{'\u2652'} Aquarius Influence ({'\u03C6'})</div>
                  <div className="tse-phi-cols">
                    {phiBlend.aquarius.map((d, i) => (
                      <div key={i}
                        className={`tse-phi-col ${phiActiveDay === i + 1 ? 'tse-phi-col--on' : ''}`}
                        onClick={() => {
                          const deg = i;
                          setFlapDegree(deg);
                          const z = zones.find((zz: Zone) => deg >= zz.degreeRange.start && deg <= zz.degreeRange.end);
                          if (z) setHighlightedZones([z.id]);
                        }}
                      >
                        <span className="tse-phi-a" style={{ color: '#00BFFF' }}>{d.adj}%</span>
                        <div className="tse-phi-vb">
                          <div className="tse-phi-vb-a" style={{ height: `${d.adj}%`, background: '#00BFFF' }} />
                          <div className="tse-phi-vb-t" style={{ height: `${d.sco}%`, background: '#7B68EE' }} />
                        </div>
                        <span className="tse-phi-t" style={{ color: '#7B68EE' }}>{d.sco}%</span>
                        <span className="tse-phi-d">{d.dt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pure Pisces */}
                <div className="tse-phi-mid" style={{ background: 'rgba(123, 104, 238, 0.08)', borderColor: 'rgba(123, 104, 238, 0.2)' }}>
                  <span className="tse-phi-mid-sym">{'\u2653'}</span>
                  <span className="tse-phi-mid-pct" style={{ color: '#7B68EE' }}>100%</span>
                  <div className="tse-phi-mid-bar" style={{ background: '#7B68EE' }} />
                  <span className="tse-phi-mid-range">Feb 25 {'\u2013'} Mar 14</span>
                  <span className="tse-phi-mid-sub">18 days pure Pisces</span>
                </div>

                {/* Aries cusp */}
                <div className="tse-phi-wing">
                  <div className="tse-phi-wing-hd" style={{ color: '#FF4500' }}>Aries Influence ({'\u03C6'}) {'\u2648'}</div>
                  <div className="tse-phi-cols">
                    {phiBlend.aries.map((d, i) => (
                      <div key={i}
                        className={`tse-phi-col ${phiActiveDay === 24 + i ? 'tse-phi-col--on' : ''}`}
                        onClick={() => {
                          const deg = Math.min(29.59, 25 + i);
                          setFlapDegree(deg);
                          const z = zones.find((zz: Zone) => deg >= zz.degreeRange.start && deg <= zz.degreeRange.end);
                          if (z) setHighlightedZones([z.id]);
                        }}
                      >
                        <span className="tse-phi-a" style={{ color: '#FF4500' }}>{d.adj}%</span>
                        <div className="tse-phi-vb">
                          <div className="tse-phi-vb-a" style={{ height: `${d.adj}%`, background: '#FF4500' }} />
                          <div className="tse-phi-vb-t" style={{ height: `${d.sco}%`, background: '#7B68EE' }} />
                        </div>
                        <span className="tse-phi-t" style={{ color: '#7B68EE' }}>{d.sco}%</span>
                        <span className="tse-phi-d">{d.dt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Methodology note */}
              <div className="tse-phi-fn">
                <strong>Our Assumptions:</strong> Adjacent sign influence = ((days_remaining {'\u00F7'} 7)<sup>{'\u03C6'}</sup>) {'\u00D7'} 100%, where {'\u03C6'} = 1.618033{'\u2026'} The first & last 6 days of each sign blend with neighbors; middle days are 100% pure sign energy.
              </div>
            </div>
          )}
        </div>

        {/* Tab bar: Quality Matrix / Thinking Style */}
        <div className="tse-float-tabs">
          <button
            className={`tse-float-tab ${matrixTab === 'quality' ? 'tse-float-tab--active' : ''}`}
            onClick={() => setMatrixTab('quality')}
          >
            {'\uD83D\uDD32'} Quality Matrix
          </button>
          <button
            className={`tse-float-tab ${matrixTab === 'thinking' ? 'tse-float-tab--active' : ''}`}
            onClick={() => setMatrixTab('thinking')}
          >
            {'\uD83E\uDDE0'} Thinking Style
          </button>
        </div>

        {/* Scrollable content */}
        <div className="tse-float-table-scroll">
          {matrixTab === 'quality' && (
            <MatrixTableContent zones={zones} highlightZones={highlightedZones} isFlap />
          )}
          {matrixTab === 'thinking' && (
            <PiscesThinkingStyleTab zones={zones} userDegree={userDegree} />
          )}
        </div>
      </div>
    )}

    {/* Visual Spectrum Bar */}
    <section className="tse-spectrum-visual">
      <h3>The Complete Pisces Spectrum</h3>
      <div className="tse-spectrum-bar">
        {zones.map((zone: Zone) => (
          <div
            key={zone.id}
            className={`tse-spectrum-segment ${highlightZone === zone.id ? 'tse-highlighted' : ''}`}
            style={{ width: `${100 / zones.length}%`, background: zone.colorTheme.gradient }}
            title={zone.name}
          >
            <div className="tse-segment-label">
              <strong>{zone.id}</strong>
              <span>{zone.degreeRange.start}°-{zone.degreeRange.end}°</span>
            </div>
          </div>
        ))}
      </div>
      <div className="tse-spectrum-labels">
        <span>{'\u2652'} Aquarius Cusp</span>
        <span>{'\uD83D\uDD2E'} Pure Pisces</span>
        <span>{'\u2648'} Aries Cusp</span>
      </div>
    </section>

    {/* Decan Structure */}
    <section className="tse-decan-structure">
      <h4>Decan Structure</h4>
      <div className="tse-decan-row">
        <div className="tse-decan-block tse-db-1">
          <div className="tse-db-header">First Decan</div>
          <div className="tse-db-ruler">Neptune/Jupiter Ruled</div>
          <div className="tse-db-zones">Zones 1-2</div>
          <div className="tse-db-quality">Mutable/Pure Pisces</div>
        </div>
        <div className="tse-decan-block tse-db-2">
          <div className="tse-db-header">Second Decan</div>
          <div className="tse-db-ruler">Neptune/Moon Ruled</div>
          <div className="tse-db-zones">Zones 3-4</div>
          <div className="tse-db-quality">Cardinal/Cancer</div>
        </div>
        <div className="tse-decan-block tse-db-3">
          <div className="tse-db-header">Third Decan</div>
          <div className="tse-db-ruler">Neptune/Pluto Ruled</div>
          <div className="tse-db-zones">Zones 5-6</div>
          <div className="tse-db-quality">Fixed/Scorpio</div>
        </div>
      </div>
    </section>

    {/* Quality Comparison Table + Thinking Style */}
    <section className="tse-matrix-table-section">
      <div className="tse-matrix-table-header">
        <div className="tse-inline-tabs">
          <button
            className={`tse-inline-tab ${matrixTab === 'quality' ? 'tse-inline-tab--active' : ''}`}
            onClick={() => setMatrixTab('quality')}
          >
            {'\uD83D\uDD32'} Quality Matrix
          </button>
          <button
            className={`tse-inline-tab ${matrixTab === 'thinking' ? 'tse-inline-tab--active' : ''}`}
            onClick={() => setMatrixTab('thinking')}
          >
            {'\uD83E\uDDE0'} Thinking Style
          </button>
        </div>
        <button className="tse-expand-matrix-btn" onClick={() => setMatrixFlapOpen(true)} title="Open interactive explorer panel">
          {'\u26F6'} Explorer Panel
        </button>
      </div>
      {matrixTab === 'quality' && (
        <MatrixTableContent zones={zones} highlightZones={highlightZone != null ? [highlightZone] : []} />
      )}
      {matrixTab === 'thinking' && (
        <PiscesThinkingStyleTab zones={zones} userDegree={userDegree} />
      )}
    </section>

    {/* Pattern Insights */}
    <section className="tse-pattern-insights">
      <h4>{'\uD83D\uDD0D'} Pattern Recognition</h4>
      <div className="tse-insights-grid">
        {[
          { title: 'Spiritual Spectrum', text: 'Zone 1 channels spirituality through Aquarius\'s innovative lens with visionary clarity, while Zone 2 experiences raw, unfiltered Neptunian transcendence. By Zone 4, spirituality becomes alchemical transformation through Pluto\'s regenerative power.' },
          { title: 'Compassion Arc', text: 'Compassion starts strong in Zone 1 (90%), peaks in Zone 2-3 (100% maximum), maintains through Zone 4-5 (95-100%), and remains high in Zone 6 (90%) where Aries adds warrior courage to compassionate action.' },
          { title: 'Intuition Constant', text: 'All zones maintain 90-100% intuition\u2014this is the non-negotiable Pisces core. Even Zone 6 near Aries retains powerful psychic awareness despite gaining warrior decisiveness.' },
          { title: 'Imagination Distribution', text: 'Imagination peaks in Zone 2 (100% infinite creative universes) and Zone 5 (100% divine art), showing Pisces\'s dual creative expressions: pure spiritual imagination vs emotional artistic channeling.' },
          { title: 'Boundary Dissolution Gradient', text: 'Boundary dissolution is highest in Zone 2 (100% no self/other) and gradually firms toward Zone 6 as Aries influence adds individual identity\u2014the quality that most distinguishes late Pisces from early Pisces.' },
          { title: 'Speed Evolution', text: 'Speed is slowest in Zone 4 (50% deep spiritual processing) and fastest in Zone 6 (70% spiritual warrior decisiveness). Zone 1 maintains medium-fast pace (75%) thanks to Aquarius cusp adding intellectual clarity.' },
        ].map(({ title, text }) => (
          <div key={title} className="tse-insight-card-fmv">
            <h5>{title}</h5>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Evolution Narrative */}
    <section className="tse-evolution-narrative">
      <h4>{'\uD83D\uDCD6'} The Pisces Journey: A 30° Evolution</h4>
      <div className="tse-narrative-content">
        <p><strong>Zone 1 (0-4°):</strong> The Visionary Mystic emerges from Aquarius{'\u2019'}s revolutionary air with Uranus{'\u2019'}s innovative clarity still infusing the Neptunian core. This Fish doesn{'\u2019'}t just dream{'\u2014'}it envisions with innovative precision. Aquarius{'\u2019'}s intellect gives Zone 1 Pisces an unusual gift: the ability to articulate spiritual truths that other Pisces zones can only feel wordlessly.</p>
        <p><strong>Zone 2 (5-9°):</strong> Pure Neptune ignites. The Aquarius intellect has dissolved completely, leaving raw, unfiltered spiritual transcendence. This is the zone of the Pure Mystic{'\u2014'}the divine channel, the boundaryless consciousness that merges with universal love. No ego, no separation, no limits to the compassion.</p>
        <p><strong>Zone 3 (10-14°):</strong> Moon{'\u2019'}s sub-ruler adds emotional nurturing to Neptune{'\u2019'}s spiritual power. This is the Emotional Healer{'\u2014'}not just a mystic but a divine mother who heals through sacred nurturing. Zone 3 Pisces doesn{'\u2019'}t just feel; it holds, comforts, and heals with spiritual mothering that dissolves all wounds.</p>
        <p><strong>Zone 4 (15-19°):</strong> Pluto{'\u2019'}s influence adds transformative depth to Neptune{'\u2019'}s transcendence. The Compassionate Transformer channels spiritual power into alchemical healing. This zone combines the mystic{'\u2019'}s compassion with an alchemist{'\u2019'}s regenerative power, making it devastatingly effective at transmuting collective darkness into spiritual light.</p>
        <p><strong>Zone 5 (20-24°):</strong> Moon adds creative emotional expression to Pisces{'\u2019'}s spiritual core. The Divine Artist creates not from technique but from pure channeled divine emotion. Moon{'\u2019'}s influence transforms Pisces{'\u2019'}s boundless spirituality into tangible works of transcendent beauty that heal through art.</p>
        <p><strong>Zone 6 (25-29°):</strong> Aries begins its fiery pull. The Cosmic Initiator discovers something rare for a Fish{'\u2014'}the courage to ACT on spiritual vision with warrior decisiveness. Zone 6 Pisces can channel transcendent compassion into fearless spiritual pioneering. The bridge between spiritual transcendence and courageous action.</p>
      </div>
    </section>
  </div>
  );
};

/* ─── Main Component ─── */

const PiscesSpectrumExplorer: React.FC<PiscesSpectrumExplorerProps> = ({
  userDegree = null,
  userName = null,
  ephemerisTimestamps = null,
}) => {
  const [currentDegree, setCurrentDegree] = useState(userDegree ?? 15);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [selectedZones, setSelectedZones] = useState<number[]>([1]);
  const [showUserHighlight, setShowUserHighlight] = useState(!!userDegree);
  const [requestExplorerOpen, setRequestExplorerOpen] = useState(false);

  // Update selected zone when degree changes
  useEffect(() => {
    const currentZone = piscesZones.find(
      (zone: Zone) => currentDegree >= zone.degreeRange.start && currentDegree <= zone.degreeRange.end
    );
    if (currentZone && viewMode === 'single') {
      setSelectedZones([currentZone.id]);
    }
  }, [currentDegree, viewMode]);

  const handleDegreeChange = (newDegree: number) => setCurrentDegree(newDegree);

  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
    if (newMode === 'single' && selectedZones.length > 1) {
      setSelectedZones([selectedZones[0]]);
    } else if (newMode === 'matrix') {
      setSelectedZones([1, 2, 3, 4, 5, 6]);
    } else if (newMode === 'sideBySide' && selectedZones.length === 1) {
      const cur = selectedZones[0];
      setSelectedZones([cur, cur === 1 ? 3 : 1]);
    }
  };

  const handleZoneToggle = (zoneId: number) => {
    if (viewMode === 'matrix') return;
    if (viewMode === 'single') {
      setSelectedZones([zoneId]);
      const zone = piscesZones.find((z: Zone) => z.id === zoneId);
      if (zone) setCurrentDegree((zone.degreeRange.start + zone.degreeRange.end) / 2);
    } else if (viewMode === 'sideBySide') {
      setSelectedZones((prev) => {
        if (prev.includes(zoneId)) {
          return prev.length > 1 ? prev.filter((id) => id !== zoneId) : prev;
        }
        return prev.length < 3 ? [...prev, zoneId].sort() : prev;
      });
    }
  };

  const jumpToUserDegree = () => {
    if (userDegree != null) {
      setCurrentDegree(userDegree);
      setShowUserHighlight(true);
    }
  };

  const displayZones = useMemo(() => {
    if (viewMode === 'matrix') return piscesZones;
    return piscesZones.filter((zone: Zone) => selectedZones.includes(zone.id));
  }, [viewMode, selectedZones]);

  const userZoneInfo = useMemo(
    () => (userDegree != null ? getUserZoneInfo('Pisces', piscesZones, userDegree) : null),
    [userDegree]
  );

  return (
    <div className="pisces-spectrum-explorer">
      {/* Header */}
      <header className="tse-header">
        <div className="tse-header-row">
          <h1 style={{ background: 'linear-gradient(135deg, #7B68EE 0%, #9370DB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>The Pisces Spectrum Explorer</h1>
          <button
            className="tse-expand-matrix-btn"
            onClick={() => {
              if (viewMode !== 'matrix') handleViewModeChange('matrix');
              setRequestExplorerOpen(true);
            }}
            title="Open interactive explorer panel"
          >
            {'\u26F6'} Explorer Panel
          </button>
        </div>
        <p className="tse-subtitle">Understanding the 30° Journey Through the Fish</p>
        {userName && userDegree != null && (
          <div className="tse-user-welcome">
            Welcome, {userName}! Your Sun is at {(userDegree as number).toFixed(2)}° Pisces
            (Zone {userZoneInfo?.zone?.id}: {userZoneInfo?.zone?.name})
          </div>
        )}
      </header>

      {/* Degree Slider */}
      <section className="tse-slider-section">
        <DegreeSlider
          currentDegree={currentDegree}
          onDegreeChange={handleDegreeChange}
          userDegree={userDegree}
          showUserHighlight={showUserHighlight}
          onJumpToUser={jumpToUserDegree}
          ephemerisTimestamps={ephemerisTimestamps}
        />
      </section>

      {/* Controls */}
      <section className="tse-controls-section">
        <ViewModeSelector currentMode={viewMode} onModeChange={handleViewModeChange} />
        {viewMode !== 'matrix' && (
          <ZoneSelector
            selectedZones={selectedZones}
            onZoneToggle={handleZoneToggle}
            maxSelections={viewMode === 'single' ? 1 : 3}
            allZones={piscesZones}
          />
        )}
      </section>

      {/* Main Content */}
      <main className="tse-content-area">
        {viewMode === 'single' && displayZones.length > 0 && (
          <SingleZoneView
            zone={displayZones[0]}
            currentDegree={currentDegree}
            isUserZone={userZoneInfo?.zone?.id === displayZones[0].id}
          />
        )}
        {viewMode === 'sideBySide' && displayZones.length >= 2 && (
          <SideBySideView zones={displayZones} userDegree={userDegree} />
        )}
        {viewMode === 'matrix' && (
          <FullMatrixView
            zones={displayZones}
            userDegree={userDegree}
            highlightZone={userZoneInfo?.zone?.id}
            externalOpen={requestExplorerOpen}
            onExternalOpenHandled={() => setRequestExplorerOpen(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="tse-footer">
        <div className="tse-educational-note">
          <h4>{'\uD83D\uDCA1'} Educational Note</h4>
          <p>
            This tool demonstrates that even within a single zodiac sign, there are
            significant variations based on degree placement. Your exact degree creates
            a unique expression of Pisces energy, influenced by decan rulers and cusp effects.
          </p>
        </div>
        <div className="tse-methodology">
          <h4>{'\uD83D\uDCCA'} Methodology</h4>
          <p>
            Based on traditional decan system (10° subdivisions) combined with 5° cusp
            influence zones. Quality assessments derived from classical astrology,
            modern research, and observed patterns across thousands of charts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PiscesSpectrumExplorer;
