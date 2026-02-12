/**
 * LeoSpectrumExplorer.tsx
 *
 * Educational tool for understanding the 30° journey through Leo.
 * Divides Leo into 6 zones (5° each) with quality metrics, decan rulers,
 * cusp influences, Sabian symbols, and nakshatra correlations.
 *
 * Three view modes: Single zone deep-dive, Side-by-side comparison, Full matrix.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
// @ts-ignore
import leoZones from '../../data/leoZones';
// @ts-ignore
import { qualityCategories, compareQualityAcrossZones } from '../../data/leoQualityCategories';
// @ts-ignore
import { getZoneFromDegree, getUserZoneInfo } from '../../utils/zoneCalculations';
import './LeoSpectrumExplorer.css';
// @ts-ignore
import LeoThinkingStyleTab from './LeoThinkingStyleTab';
import { degreeToApproxDateTime } from '../../data/tropicalConstants';
import type { Zone, QualityCategory, ZoneInfluence, ZoneFamousExample } from './spectrumTypes';

/* ─── Types ─── */

interface LeoSpectrumExplorerProps {
  userDegree?: number | null;
  userName?: string | null;
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
  const currentZone = getZoneFromDegree(leoZones, currentDegree);
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
        <span className="tse-sign-label tse-cancer">{'\u264B'} Cancer 29°</span>
        <span className="tse-sign-label tse-leo-label">{'\u264C'} LEO (0° - 30°)</span>
        <span className="tse-sign-label tse-virgo">{'\u264D'} Virgo 0°</span>
      </div>

      {/* Decan Markers */}
      <div className="tse-decan-markers">
        <div className={`tse-decan tse-decan-1 ${highlightedDecan === 1 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(1)}
             title="First Decan: Sun/Sun - Pure solar fire (click to highlight zones 1-2)">
          <span className="tse-decan-label">1st Decan</span>
          <span className="tse-decan-ruler">{'\u2609'} Sun</span>
          <span className="tse-decan-zones">Zones 1–2</span>
        </div>
        <div className={`tse-decan tse-decan-2 ${highlightedDecan === 2 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(2)}
             title="Second Decan: Sun/Jupiter - Expansive visionary fire (click to highlight zones 3-4)">
          <span className="tse-decan-label">2nd Decan</span>
          <span className="tse-decan-ruler">{'\u2643'} Jupiter</span>
          <span className="tse-decan-zones">Zones 3–4</span>
        </div>
        <div className={`tse-decan tse-decan-3 ${highlightedDecan === 3 ? 'tse-decan-active' : ''}`}
             onClick={() => handleDecanClick(3)}
             title="Third Decan: Sun/Mars - Warrior creative fire (click to highlight zones 5-6)">
          <span className="tse-decan-label">3rd Decan</span>
          <span className="tse-decan-ruler">{'\u2642'} Mars</span>
          <span className="tse-decan-zones">Zones 5–6</span>
        </div>
      </div>

      {/* Zone Markers */}
      <div className="tse-zone-markers">
        {leoZones.map((zone: Zone) => {
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
            title={`Your Sun: ${(userDegree as number).toFixed(2)}° Leo`}
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
          style={{ '--tse-zone-color': currentZone?.colorTheme?.primary || '#FFD700' } as React.CSSProperties}
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
            <span className="tse-sign-name">Leo</span>
            <span className="tse-approx-date">~ {degreeToApproxDateTime(120 + currentDegree, ephemerisTimestamps)}</span>
          </div>
          <div className="tse-absolute-position">
            Absolute: {(120 + currentDegree).toFixed(2)}° ecliptic
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
    1: "You're the Leo who arrives with Cancer's emotional depth still flowing through your solar core. While other Lions roar for attention, you lead with warmth and genuine care. You're 75% solar creative fire, 25% lunar nurturing. Think of yourself as the leader with heart\u2014you inspire others because you can FEEL what they need before they ask.",
    2: "You've hit pure Sun territory\u2014no dilution, no compromise. The Cancer sensitivity has dissolved into radiant, unfiltered solar power. You are the embodiment of creative sovereignty, the center of every room, the one who makes everyone feel like they're basking in golden light. You don't just shine\u2014you ARE light itself, magnificent and life-giving.",
    3: "You ARE the definition of Leo amplified by Jupiter's expansive vision. Maximum creativity, maximum generosity, maximum reach. You don't just create\u2014you CREATE ON AN EPIC SCALE. People are drawn to you not because you demand it, but because your vision is so large it creates its own gravitational field. You're the born visionary who turns passion into empire.",
    4: "You're the Leo philosopher-king. Jupiter's influence adds expansive wisdom to the Sun's creative fire. You don't just perform\u2014you inspire entire movements, philosophies, and cultural shifts. You combine the performer's charisma with a sage's breadth of vision, making you devastatingly effective at leading people toward something greater than themselves.",
    5: "You combine Leo's creative sovereignty with Mars's warrior courage. You're not just performing\u2014you're conquering, building, and defending your creative kingdom with fierce determination. Mars adds combative fire to your solar radiance, making you the action-hero leader who doesn't just dream big\u2014you MAKE it happen through sheer force of will.",
    6: "You're the Leo who channels radiance into precision with Virgo's approaching analytical energy. While other Lions crave applause, you perfect your craft with meticulous devotion. You don't just create\u2014you refine, polish, and elevate until every detail gleams. You're the most disciplined Leo, turning raw creative fire into masterwork.",
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
          <span className="tse-info-value">{zone.degreeRange.start}° - {zone.degreeRange.end}° Leo</span>
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
        <div className="tse-decan-info-card"><label>Primary Ruler</label><div className="tse-decan-val">{zone.decan.primaryRuler} (Leo)</div></div>
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
          <div className="tse-sabian-degree">{zone.sabianSymbol.degree}° Leo</div>
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
          {zone.nakshatra.qualities && zone.nakshatra.qualities.length > 0 && (
            <div className="tse-nakshatra-qualities">
              {zone.nakshatra.qualities.map((q: string, i: number) => (
                <span key={i} className="tse-quality-chip">{q}</span>
              ))}
            </div>
          )}
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
        <h3>Comparing {zones.length} Leo Zones</h3>
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
            <span className="tse-commonality-icon">{'\uD83D\uDD25'}</span>
            <div><strong>Creative Fire:</strong> All maintain powerful creative self-expression\u2014this is the Leo constant</div>
          </div>
          <div className="tse-commonality-item">
            <span className="tse-commonality-icon">{'\u2609'}</span>
            <div><strong>Solar Radiance:</strong> All express magnetic warmth and natural leadership presence</div>
          </div>
          <div className="tse-commonality-item">
            <span className="tse-commonality-icon">{'\uD83C\uDFAD'}</span>
            <div><strong>Dramatic Flair:</strong> All are oriented toward performance, celebration, and making life extraordinary</div>
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

  // Degree → date string (Leo: ~July 23 to August 22, 31 days for 30°)
  const degreeToDateStr = (deg: number) => {
    const d = new Date(2024, 6, 23);
    d.setDate(d.getDate() + Math.round(deg * 31 / 30));
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
    { num: 1, name: 'First Decan', ruler: 'Sun / Sun', quality: 'Fixed \u00B7 Pure Sun', accent: '#FFD700' },
    { num: 2, name: 'Second Decan', ruler: 'Sun / Jupiter', quality: 'Fixed \u00B7 Sagittarius', accent: '#FF8C00' },
    { num: 3, name: 'Third Decan', ruler: 'Sun / Mars', quality: 'Fixed \u00B7 Aries', accent: '#DC143C' },
  ];

  // φ Golden Ratio Cusp Blending
  const [phiOpen, setPhiOpen] = useState(false);
  const phiBlend = useMemo(() => {
    const PHI = 1.618033988749895;
    const N = 6;
    const adj = (d: number) =>
      Math.round(100 * Math.pow((N + 1 - d) / (N + 1), PHI));
    return {
      cancer: Array.from({ length: N }, (_, i) => {
        const dt = new Date(2024, 6, 23 + i);
        const a = adj(i + 1);
        return { dt: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), leo: 100 - a, adj: a };
      }),
      virgo: Array.from({ length: N }, (_, i) => {
        const dt = new Date(2024, 7, 17 + i);
        const a = adj(N - i);
        return { dt: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), leo: 100 - a, adj: a };
      }),
    };
  }, []);
  const phiActiveDay = Math.min(31, Math.max(1, 1 + Math.round(flapDegree)));

  // MD Export — generates a markdown file from all panel data
  const exportMD = () => {
    const PHI = 1.618033988749895;
    const N = 6;
    const adj = (d: number) => Math.round(100 * Math.pow((N + 1 - d) / (N + 1), PHI));

    let md = '# The Leo Spectrum Explorer\n\n';
    md += '> A 30\u00B0 journey through Leo \u2014 six zones, three decans, one sign.\n\n';

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
    md += '| First (0\u00B0\u20139\u00B0) | Sun / Sun | 1\u20132 | Fixed \u00B7 Pure Sun |\n';
    md += '| Second (10\u00B0\u201319\u00B0) | Sun / Jupiter | 3\u20134 | Fixed \u00B7 Sagittarius |\n';
    md += '| Third (20\u00B0\u201329\u00B0) | Sun / Mars | 5\u20136 | Fixed \u00B7 Aries |\n';

    // φ Golden Ratio Cusp Blending
    md += '\n## \u03C6 Golden Ratio Cusp Blending\n\n';
    md += 'Adjacent sign influence = ((days_remaining \u00F7 7)^\u03C6) \u00D7 100%, where \u03C6 = 1.618033\u2026\n\n';
    md += '### Cancer \u264B Cusp (first 6 days)\n\n';
    md += '| Date | Leo % | Cancer % |\n';
    md += '|------|---------|----------|\n';
    for (let i = 0; i < N; i++) {
      const a = adj(i + 1);
      const dt = new Date(2024, 6, 23 + i);
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      md += `| ${label} | ${100 - a}% | ${a}% |\n`;
    }
    md += '\n**Jul 29 \u2013 Aug 17: 100% Pure Leo (20 days)**\n\n';
    md += '### Virgo \u264D Cusp (last 6 days)\n\n';
    md += '| Date | Leo % | Virgo % |\n';
    md += '|------|---------|----------|\n';
    for (let i = 0; i < N; i++) {
      const a = adj(N - i);
      const dt = new Date(2024, 7, 17 + i);
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

    md += '---\n*Generated by The Leo Spectrum Explorer \u00B7 AstroProfile*\n';

    // Trigger download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leo-spectrum-explorer.md';
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
          <h2>The Leo Spectrum Explorer</h2>
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
          <div className="tse-float-zones-title">The Complete Leo Spectrum</div>
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
              title="Leo degree position"
            />
          </div>
          <div className="tse-float-readout">
            <span className="tse-float-readout-deg">{flapDegree.toFixed(1)}° Leo</span>
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

        {/* φ Golden Ratio Cusp Blending — fixed above scroll */}
        <div className="tse-phi">
          <button className="tse-phi-hd" onClick={() => setPhiOpen(p => !p)}>
            <span className="tse-phi-icon">{'\u03C6'}</span>
            <span>Golden Ratio Cusp Blending</span>
            <span className="tse-phi-caret">{phiOpen ? '\u25B4' : '\u25BE'}</span>
          </button>
          {phiOpen && (
            <div className="tse-phi-body">
              <div className="tse-phi-chart">
                {/* Cancer cusp */}
                <div className="tse-phi-wing">
                  <div className="tse-phi-wing-hd" style={{ color: '#6495ED' }}>{'\u264B'} Cancer Influence ({'\u03C6'})</div>
                  <div className="tse-phi-cols">
                    {phiBlend.cancer.map((d, i) => (
                      <div key={i}
                        className={`tse-phi-col ${phiActiveDay === i + 1 ? 'tse-phi-col--on' : ''}`}
                        onClick={() => {
                          const deg = i;
                          setFlapDegree(deg);
                          const z = zones.find((zz: Zone) => deg >= zz.degreeRange.start && deg <= zz.degreeRange.end);
                          if (z) setHighlightedZones([z.id]);
                        }}
                      >
                        <span className="tse-phi-a" style={{ color: '#6495ED' }}>{d.adj}%</span>
                        <div className="tse-phi-vb">
                          <div className="tse-phi-vb-a" style={{ height: `${d.adj}%`, background: '#6495ED' }} />
                          <div className="tse-phi-vb-t" style={{ height: `${d.leo}%`, background: '#FFD700' }} />
                        </div>
                        <span className="tse-phi-t">{d.leo}%</span>
                        <span className="tse-phi-d">{d.dt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pure Leo */}
                <div className="tse-phi-mid">
                  <span className="tse-phi-mid-sym">{'\u264C'}</span>
                  <span className="tse-phi-mid-pct">100%</span>
                  <div className="tse-phi-mid-bar" />
                  <span className="tse-phi-mid-range">Jul 29 {'\u2013'} Aug 17</span>
                  <span className="tse-phi-mid-sub">20 days pure Leo</span>
                </div>

                {/* Virgo cusp */}
                <div className="tse-phi-wing">
                  <div className="tse-phi-wing-hd" style={{ color: '#8B7355' }}>Virgo Influence ({'\u03C6'}) {'\u264D'}</div>
                  <div className="tse-phi-cols">
                    {phiBlend.virgo.map((d, i) => (
                      <div key={i}
                        className={`tse-phi-col ${phiActiveDay === 26 + i ? 'tse-phi-col--on' : ''}`}
                        onClick={() => {
                          const deg = Math.min(29.59, 25 + i);
                          setFlapDegree(deg);
                          const z = zones.find((zz: Zone) => deg >= zz.degreeRange.start && deg <= zz.degreeRange.end);
                          if (z) setHighlightedZones([z.id]);
                        }}
                      >
                        <span className="tse-phi-a" style={{ color: '#8B7355' }}>{d.adj}%</span>
                        <div className="tse-phi-vb">
                          <div className="tse-phi-vb-a" style={{ height: `${d.adj}%`, background: '#8B7355' }} />
                          <div className="tse-phi-vb-t" style={{ height: `${d.leo}%`, background: '#FFD700' }} />
                        </div>
                        <span className="tse-phi-t">{d.leo}%</span>
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
            <LeoThinkingStyleTab zones={zones} userDegree={userDegree} />
          )}
        </div>
      </div>
    )}

    {/* Visual Spectrum Bar */}
    <section className="tse-spectrum-visual">
      <h3>The Complete Leo Spectrum</h3>
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
        <span>{'\u264B'} Cancer Cusp</span>
        <span>{'\uD83D\uDD25'} Pure Leo</span>
        <span>{'\u264D'} Virgo Cusp</span>
      </div>
    </section>

    {/* Decan Structure */}
    <section className="tse-decan-structure">
      <h4>Decan Structure</h4>
      <div className="tse-decan-row">
        <div className="tse-decan-block tse-db-1">
          <div className="tse-db-header">First Decan</div>
          <div className="tse-db-ruler">Sun/Sun Ruled</div>
          <div className="tse-db-zones">Zones 1-2</div>
          <div className="tse-db-quality">Fixed/Pure Sun</div>
        </div>
        <div className="tse-decan-block tse-db-2">
          <div className="tse-db-header">Second Decan</div>
          <div className="tse-db-ruler">Jupiter/Sagittarius Ruled</div>
          <div className="tse-db-zones">Zones 3-4</div>
          <div className="tse-db-quality">Fixed/Sagittarius</div>
        </div>
        <div className="tse-decan-block tse-db-3">
          <div className="tse-db-header">Third Decan</div>
          <div className="tse-db-ruler">Mars/Aries Ruled</div>
          <div className="tse-db-zones">Zones 5-6</div>
          <div className="tse-db-quality">Fixed/Aries</div>
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
        <LeoThinkingStyleTab zones={zones} userDegree={userDegree} />
      )}
    </section>

    {/* Pattern Insights */}
    <section className="tse-pattern-insights">
      <h4>{'\uD83D\uDD0D'} Pattern Recognition</h4>
      <div className="tse-insights-grid">
        {[
          { title: 'Creative Fire Spectrum', text: 'Zone 1 channels creativity through Cancer\u2019s emotional warmth, while Zone 2 unleashes pure solar creative power. By Zone 4, creativity becomes visionary empire-building through Jupiter\u2019s expansive influence.' },
          { title: 'Leadership Arc', text: 'Leadership starts warm and nurturing in Zone 1 (heart-centered authority), peaks in Zone 2 (pure sovereign command), then adds philosophical depth in Zone 4 (Jupiter-inspired vision) and warrior courage in Zone 5 (Mars-fueled action).' },
          { title: 'Charisma Constant', text: 'All zones maintain 75-100% charisma\u2014this is the non-negotiable Leo core. Even Zone 6 near Virgo retains magnetic solar presence despite gaining analytical precision.' },
          { title: 'Confidence Distribution', text: 'Confidence begins strong in Zone 1 (80%), reaches maximum in Zone 2-3 (95-100% pure solar self-assurance), and transforms into disciplined mastery in Zone 6 (Virgo refines the raw fire).' },
          { title: 'Generosity Gradient', text: 'Generosity is highest in Zones 2-4 (pure Sun and Jupiter amplification) and most strategic in Zone 5 (Mars adds selectivity)\u2014the quality that evolves most dramatically across the Leo spectrum.' },
          { title: 'Need for Recognition', text: 'Zone 2 craves the spotlight most intensely (100%), Zone 3-4 channels it into Jupiter\u2019s grand stage, Zone 5 seeks recognition through achievement, Zone 6 transforms the need into pursuit of excellence itself.' },
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
      <h4>{'\uD83D\uDCD6'} The Leo Journey: A 30° Evolution</h4>
      <div className="tse-narrative-content">
        <p><strong>Zone 1 (0-4°):</strong> The Warm Leader emerges from Cancer\u2019s emotional depths with the heart still glowing from lunar tenderness. This Lion doesn\u2019t just command\u2014it leads with genuine warmth and caring. Cancer\u2019s nurturing instinct gives Zone 1 Leo an unusual gift: the ability to inspire loyalty through love rather than authority alone.</p>
        <p><strong>Zone 2 (5-9°):</strong> Pure Sun ignites. The Cancer softness has dissolved completely, leaving radiant, unfiltered solar majesty. This is the zone of the Radiant King/Queen\u2014the embodiment of creative sovereignty, the center of every room, the one who makes life feel golden. No hesitation, no dimming the light.</p>
        <p><strong>Zone 3 (10-14°):</strong> Jupiter\u2019s sub-ruler expands the Sun into epic creative vision. This is the Passionate Creator\u2014not just a performer but a visionary who builds empires of art, joy, and inspiration. Zone 3 Leo doesn\u2019t just shine; it illuminates entire worlds with its expansive creative fire.</p>
        <p><strong>Zone 4 (15-19°):</strong> Jupiter influence deepens into philosophical grandeur. The Bold Visionary combines solar charisma with sagely wisdom, becoming the leader who doesn\u2019t just dazzle but transforms culture itself. This zone produces the philosopher-kings, the movement-builders, the ones whose vision spans generations.</p>
        <p><strong>Zone 5 (20-24°):</strong> Mars adds warrior fire to the solar flame. The Dignified Performer doesn\u2019t just create\u2014it conquers, builds, and defends with fierce determination. Mars transforms Leo\u2019s creative fire into unstoppable action, producing leaders who make things happen through sheer force of will and courage.</p>
        <p><strong>Zone 6 (25-29°):</strong> Virgo begins its analytical pull. The Perfectionist Star discovers something unusual for a Lion\u2014the beauty of precision and mastery of detail. Zone 6 Leo refines raw creative fire into polished masterwork, turning grand visions into meticulously crafted realities. The bridge between solar radiance and earthy excellence.</p>
      </div>
    </section>
  </div>
  );
};

/* ─── Main Component ─── */

const LeoSpectrumExplorer: React.FC<LeoSpectrumExplorerProps> = ({
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
    const currentZone = leoZones.find(
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
      const zone = leoZones.find((z: Zone) => z.id === zoneId);
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
    if (viewMode === 'matrix') return leoZones;
    return leoZones.filter((zone: Zone) => selectedZones.includes(zone.id));
  }, [viewMode, selectedZones]);

  const userZoneInfo = useMemo(
    () => (userDegree != null ? getUserZoneInfo('Leo', leoZones, userDegree) : null),
    [userDegree]
  );

  return (
    <div className="leo-spectrum-explorer">
      {/* Header */}
      <header className="tse-header">
        <div className="tse-header-row">
          <h1>The Leo Spectrum Explorer</h1>
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
        <p className="tse-subtitle">Understanding the 30° Journey Through the Lion</p>
        {userName && userDegree != null && (
          <div className="tse-user-welcome">
            Welcome, {userName}! Your Sun is at {(userDegree as number).toFixed(2)}° Leo
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
            allZones={leoZones}
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
            a unique expression of Leo energy, influenced by decan rulers and cusp effects.
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

export default LeoSpectrumExplorer;
