/**
 * TropicalSeasonsPage.tsx
 * =======================
 *
 * D3 Ring Donut visualization of the Tropical Zodiac Seasons.
 * - Outer ring: 4 Seasons (Winter, Spring, Summer, Autumn)
 * - Inner ring: 12 Signs with element coloring
 * - Interactive: Click for seasonal personality, sign meaning, compatibility
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import {
  SIGN_METADATA,
  SEASONAL_PROFILES,
  ELEMENT_COLORS,
  SIGN_SYMBOLS,
  buildD3SeasonArcs,
  buildD3SignArcs,
  calculateCompatibility,
  getAspectingSigns,
  ASPECT_DEFINITIONS,
  ASPECT_TYPES,
  ZodiacSign,
  Season,
  SignMeta,
  AspectType,
} from '../data/tropicalSeasons';
import { useSignSelection } from '../hooks/useSignSelection';
import {
  SEASON_EMOJI,
  type SignKey,
} from '../zodiac/tropicalMap';
import {
  SWISS_EPHEMERIS_DATES_2026,
  getPreciseCurrentSeason,
  getDaysUntilNextSeason,
} from '../zodiac/tropicalCalendar';
import { SelfAnalysisPanel } from '../components/zodiac/SelfAnalysisPanel';
import { CompatibilityAnalysisPanel } from '../components/zodiac/CompatibilityAnalysisPanel';
import type { RelationshipType } from '../zodiac/narrativeEngine';
import { SeasonPanel } from '../components/zodiac/SeasonPanel';
import { SignPanel } from '../components/zodiac/SignPanel';
import { AngleTrainer } from '../components/zodiac/AngleTrainer';
import {
  LegacyCompatibilityPanel as CompatibilityPanel,
  EnhancedCompatibilityPanel,
} from '../components/zodiac/SignCompatibilityPanels';
import { TropicalZodiacWheel } from '../components/zodiac/TropicalZodiacWheel';
import { WheelEducationPanel, SummaryTableTab } from '../components/zodiac/WheelEducationPanel';
import { PhiBlendPanel } from '../components/zodiac/PhiBlendPanel';
import {
  getSunBlendFromDate,
  useYearBreathing,
  useYearWheelRotation,
  YEAR_SPEEDS,
  type YearSpeedKey,
} from '../zodiac/cusp';
import { dayOfYearToDate } from '../utils/dayOfYearToDate';
import { SIGN_GLYPHS, ASPECT_TOOLTIPS, type AspectKey } from '../data/tropicalConstants';

// Styles extracted to dedicated CSS file
import './TropicalSeasonsPage.css';

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = 'overview' | 'sign' | 'season' | 'compatibility';
type AnalysisMode = 'wheel' | 'self' | 'compatibility';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TropicalSeasonsPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Profile context for profile selector
  const { profiles, loading: profilesLoading } = useProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [secondProfileId, setSecondProfileId] = useState<string>('');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('wheel');
  const [activeRelType, setActiveRelType] = useState<RelationshipType>('romantic');

  // Sign selection hook for compatibility
  const signSelection = useSignSelection();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [useEnhancedCompat, setUseEnhancedCompat] = useState(true);
  const [selectedAspect, setSelectedAspect] = useState<AspectType | null>(null);
  const [aspectReferenceSign, setAspectReferenceSign] = useState<ZodiacSign | null>(null);
  const [showCalendarFlap, setShowCalendarFlap] = useState(false);
  const [showTableFlap, setShowTableFlap] = useState(false);

  // Breathing mode state
  const [breathingEnabled, setBreathingEnabled] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState<YearSpeedKey>('normal');

  // Draggable table flap state
  const [flapPosition, setFlapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const flapRef = useRef<HTMLDivElement>(null);
  const [hoveredCelestialEvent, setHoveredCelestialEvent] = useState<string | null>(null);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [hoveredModality, setHoveredModality] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectKey | null>(null);

  // Get selected profile data
  const selectedProfile = useMemo(() => {
    return profiles?.find((p: any) => p.id === selectedProfileId) || null;
  }, [profiles, selectedProfileId]);

  // Extract Western zodiac data from profile
  const profileWestern = useMemo(() => {
    if (!selectedProfile) return null;
    const western = selectedProfile.western || selectedProfile.calculations?.western;
    if (!western) return null;

    // Handle ascendant - could be string or object with .sign property
    const ascendant = western.ascendant;
    const risingSign = typeof ascendant === 'string'
      ? ascendant
      : (ascendant?.sign || western.rising?.sign || western.rising || null);

    const planets = western.planets || {};
    return {
      sunSign: western.sun?.sign || western.sign || null,
      moonSign: western.moon?.sign || null,
      risingSign,
      birthDate: selectedProfile.birthDate || selectedProfile.dateOfBirth || null,
      birthTime: selectedProfile.birthTime || null,
      moonLongitude: western.moon?.longitude ?? null,
      risingLongitude: (typeof ascendant === 'object' ? ascendant?.longitude : null) ?? null,
      venusSign: planets.venus?.sign || planets.Venus?.sign || null,
      marsSign: planets.mars?.sign || planets.Mars?.sign || null,
      mercurySign: planets.mercury?.sign || planets.Mercury?.sign || null,
      jupiterSign: planets.jupiter?.sign || planets.Jupiter?.sign || null,
      saturnSign: planets.saturn?.sign || planets.Saturn?.sign || null,
      uranusSign: planets.uranus?.sign || planets.Uranus?.sign || null,
      neptuneSign: planets.neptune?.sign || planets.Neptune?.sign || null,
      plutoSign: planets.pluto?.sign || planets.Pluto?.sign || null,
    };
  }, [selectedProfile]);

  // Calculate Sun cusp blend for selected profile
  const sunCusp = useMemo(() => {
    if (!profileWestern?.birthDate) return null;
    try {
      const date = typeof profileWestern.birthDate === 'string'
        ? new Date(profileWestern.birthDate)
        : profileWestern.birthDate;
      if (isNaN(date.getTime())) return null;
      return getSunBlendFromDate(date);
    } catch {
      return null;
    }
  }, [profileWestern?.birthDate]);

  // Year breathing hooks (365-day cycle)
  const yearBreathing = useYearBreathing({
    autoStart: false,
    speedMs: YEAR_SPEEDS[breathingSpeed],
    loop: true,
  });

  // Control breathing based on toggle
  useEffect(() => {
    if (breathingEnabled) {
      yearBreathing.play();
    } else {
      yearBreathing.pause();
    }
  }, [breathingEnabled]);

  // Update speed when changed
  useEffect(() => {
    yearBreathing.setSpeed(YEAR_SPEEDS[breathingSpeed]);
  }, [breathingSpeed]);

  // Get current date and cusp for breathing mode
  const breathingDate = useMemo(() => {
    return dayOfYearToDate(2026, yearBreathing.dayOfYear);
  }, [yearBreathing.dayOfYear]);

  const breathingCusp = useMemo(() => {
    if (!breathingEnabled) return null;
    return getSunBlendFromDate(breathingDate);
  }, [breathingEnabled, breathingDate]);

  // Wheel rotation for breathing mode
  const wheelRotation = useYearWheelRotation(yearBreathing.dayOfYear, {
    transitionMs: YEAR_SPEEDS[breathingSpeed],
  });

  // Get second profile data for compatibility
  const secondProfile = useMemo(() => {
    return profiles?.find((p: any) => p.id === secondProfileId) || null;
  }, [profiles, secondProfileId]);

  // Extract Western zodiac data from second profile
  const secondProfileWestern = useMemo(() => {
    if (!secondProfile) return null;
    const western = secondProfile.western || secondProfile.calculations?.western;
    if (!western) return null;

    const ascendant = western.ascendant;
    const risingSign = typeof ascendant === 'string'
      ? ascendant
      : (ascendant?.sign || western.rising?.sign || western.rising || null);

    const planets = western.planets || {};
    return {
      sunSign: western.sun?.sign || western.sign || null,
      moonSign: western.moon?.sign || null,
      risingSign,
      birthDate: secondProfile.birthDate || secondProfile.dateOfBirth || null,
      birthTime: secondProfile.birthTime || null,
      moonLongitude: western.moon?.longitude ?? null,
      risingLongitude: (typeof ascendant === 'object' ? ascendant?.longitude : null) ?? null,
      venusSign: planets.venus?.sign || planets.Venus?.sign || null,
      marsSign: planets.mars?.sign || planets.Mars?.sign || null,
      mercurySign: planets.mercury?.sign || planets.Mercury?.sign || null,
      jupiterSign: planets.jupiter?.sign || planets.Jupiter?.sign || null,
      saturnSign: planets.saturn?.sign || planets.Saturn?.sign || null,
      uranusSign: planets.uranus?.sign || planets.Uranus?.sign || null,
      neptuneSign: planets.neptune?.sign || planets.Neptune?.sign || null,
      plutoSign: planets.pluto?.sign || planets.Pluto?.sign || null,
    };
  }, [secondProfile]);

  // Calculate which signs should be highlighted based on selected aspect
  const aspectHighlightedSigns = useMemo(() => {
    if (!selectedAspect || !aspectReferenceSign) return new Set<ZodiacSign>();
    const aspectingSigns = getAspectingSigns(aspectReferenceSign, selectedAspect);
    return new Set([aspectReferenceSign, ...aspectingSigns]);
  }, [selectedAspect, aspectReferenceSign]);

  // Derived data
  const seasonArcs = useMemo(() => buildD3SeasonArcs(), []);
  const signArcs = useMemo(() => buildD3SignArcs(), []);

  const selectedSignMeta = useMemo(() =>
    selectedSign ? SIGN_METADATA.find(m => m.sign === selectedSign) : null,
    [selectedSign]
  );

  const selectedSeasonProfile = useMemo(() =>
    selectedSeason ? SEASONAL_PROFILES.find(p => p.season === selectedSeason) : null,
    [selectedSeason]
  );

  // Legacy compatibility result (for backward compat)
  const compatResult = useMemo(() =>
    signSelection.signA && signSelection.signB
      ? calculateCompatibility(signSelection.signA, signSelection.signB)
      : null,
    [signSelection.signA, signSelection.signB]
  );

  // Sign metadata for compatibility panel
  const compatMetaA = useMemo(() =>
    signSelection.signA ? SIGN_METADATA.find(m => m.sign === signSelection.signA) : null,
    [signSelection.signA]
  );

  const compatMetaB = useMemo(() =>
    signSelection.signB ? SIGN_METADATA.find(m => m.sign === signSelection.signB) : null,
    [signSelection.signB]
  );

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width - 40, 600);
        setDimensions({ width: size, height: size });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draggable table flap handlers
  const handleFlapDragStart = useCallback((e: React.MouseEvent) => {
    if (flapRef.current) {
      const rect = flapRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDragging(true);
    }
  }, []);

  const handleFlapDrag = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setFlapPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  }, [isDragging]);

  const handleFlapDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset flap position when closing
  const handleCloseTableFlap = useCallback(() => {
    setShowTableFlap(false);
    setFlapPosition({ x: 0, y: 0 });
  }, []);

  // Attach global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleFlapDrag);
      window.addEventListener('mouseup', handleFlapDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleFlapDrag);
        window.removeEventListener('mouseup', handleFlapDragEnd);
      };
    }
  }, [isDragging, handleFlapDrag, handleFlapDragEnd]);

  // Sign click handler - encapsulates viewMode-dependent behavior
  const handleSignClick = useCallback((sign: ZodiacSign) => {
    console.log('Sign clicked:', sign, 'viewMode:', viewMode);
    if (viewMode === 'compatibility') {
      // In compatibility mode, use smart selection (fills A, then B)
      signSelection.selectSign(sign);
    } else if (viewMode === 'sign' && selectedSign && selectedSign !== sign) {
      // User clicked a different sign while viewing a sign panel
      // → Start compatibility comparison between the two signs
      signSelection.setSignA(selectedSign);
      signSelection.setSignB(sign);
      setSelectedSign(null);
      setViewMode('compatibility');
    } else {
      // Default: show sign panel for this sign
      setSelectedSign(sign);
      setSelectedSeason(null);
      setViewMode('sign');
    }
  }, [viewMode, selectedSign, signSelection]);

  // Season click handler
  const handleSeasonClick = useCallback((season: Season) => {
    setSelectedSeason(season);
    setSelectedSign(null);
    setViewMode('season');
  }, []);

  // Handlers
  const handleClosePanel = useCallback(() => {
    setSelectedSign(null);
    setSelectedSeason(null);
    signSelection.clearAll();
    setViewMode('overview');
    setSelectedAspect(null);
    setAspectReferenceSign(null);
  }, [signSelection]);

  // Aspect selection handler
  const handleAspectSelect = useCallback((aspect: AspectType | null, referenceSign: ZodiacSign | null) => {
    setSelectedAspect(aspect);
    setAspectReferenceSign(referenceSign);
  }, []);

  const handleSelectForCompat = useCallback(() => {
    if (selectedSign) {
      signSelection.setSignA(selectedSign);
      setSelectedSign(null);
      setViewMode('compatibility');
    }
  }, [selectedSign, signSelection]);

  return (
    <div className="tropical-seasons-root">
      {/* Header with Profile Selector */}
      <header className="tropical-header-enhanced">
        <div className="header-left">
          {/* Profile Selector */}
          <div className="profile-selector-wrapper">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="profile-selector"
              title="Select a profile to view their zodiac information"
            >
              <option value="">-- Select a Profile --</option>
              {profiles?.map((profile: any) => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName || profile.name || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Info Display */}
          {selectedProfile && profileWestern && (
            <div className="profile-info-bar">
              <div className="profile-birth-date">
                <span className="info-label">Birth:</span>
                <span className="info-value">{profileWestern.birthDate || 'N/A'}</span>
              </div>
              <div className="profile-signs">
                <div className="sign-badge sun-sign">
                  <span className="sign-glyph">{SIGN_GLYPHS[profileWestern.sunSign] || '?'}</span>
                  <span className="sign-label">Sun</span>
                  <span className="sign-name">{profileWestern.sunSign || 'N/A'}</span>
                </div>
                <div className="sign-badge moon-sign">
                  <span className="sign-glyph">{SIGN_GLYPHS[profileWestern.moonSign] || '?'}</span>
                  <span className="sign-label">Moon</span>
                  <span className="sign-name">{profileWestern.moonSign || 'N/A'}</span>
                </div>
                <div className="sign-badge rising-sign">
                  <span className="sign-glyph">{SIGN_GLYPHS[profileWestern.risingSign] || '?'}</span>
                  <span className="sign-label">Rising</span>
                  <span className="sign-name">{profileWestern.risingSign || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Mode Toggle */}
          <div className="analysis-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${analysisMode === 'wheel' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('wheel')}
            >
              🌍 Wheel
            </button>
            <button
              type="button"
              className={`mode-btn ${analysisMode === 'self' ? 'active' : ''}`}
              onClick={() => setAnalysisMode('self')}
              disabled={!selectedProfileId}
            >
              🔮 Self
            </button>
            <button
              type="button"
              className={`mode-btn ${analysisMode === 'compatibility' ? 'active' : ''}`}
              onClick={() => setAnalysisMode(analysisMode === 'compatibility' ? 'wheel' : 'compatibility')}
              disabled={!selectedProfileId}
            >
              ⚡ Compare
            </button>
          </div>

          {/* Breathing Mode Toggle */}
          {analysisMode === 'wheel' && (
            <div className="breathing-toggle">
              <button
                type="button"
                className={`breathing-btn ${breathingEnabled ? 'active' : ''}`}
                onClick={() => setBreathingEnabled(!breathingEnabled)}
                title="Toggle 365-day year breathing animation"
              >
                {breathingEnabled ? '⏸ Pause' : '▶ Breathe'}
              </button>
              {breathingEnabled && (
                <select
                  value={breathingSpeed}
                  onChange={(e) => setBreathingSpeed(e.target.value as YearSpeedKey)}
                  className="breathing-speed-select"
                  title="Animation speed"
                >
                  <option value="meditative">🧘 Meditative</option>
                  <option value="normal">🌍 Normal</option>
                  <option value="accelerated">⚡ Fast</option>
                  <option value="demonstration">🚀 Demo</option>
                </select>
              )}
            </div>
          )}

          {/* Second Profile Selector (for compatibility mode) */}
          {analysisMode === 'compatibility' && (
            <div className="profile-selector-wrapper second">
              <label className="selector-label">Compare with:</label>
              <select
                value={secondProfileId}
                onChange={(e) => setSecondProfileId(e.target.value)}
                className="profile-selector"
                title="Select a second profile for compatibility analysis"
              >
                <option value="">-- Select Profile B --</option>
                {profiles?.filter((p: any) => p.id !== selectedProfileId).map((profile: any) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.displayName || profile.name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="header-center">
          <h1 className="header-title">
            <span className="header-icon">🌍</span>
            Tropical Seasons
          </h1>
          <p className="header-subtitle">
            The zodiac as a seasonal calendar — signs, elements, and rhythms
          </p>
        </div>

        <div className="header-right">
          <button
            type="button"
            onClick={() => setShowCalendarFlap(true)}
            className="calendar-button"
            title="View 2026 Seasonal Calendar"
          >
            📅 Calendar
          </button>
          <button
            type="button"
            onClick={() => navigate('/zodiac-learning')}
            className="back-button"
          >
            ← Back to Wheel
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="tropical-content">
        {/* Left: D3 Visualization */}
        <div className="tropical-chart" ref={containerRef}>
          {/* Breathing Info Overlay */}
          {breathingEnabled && breathingCusp && (
            <div className="breathing-info-overlay">
              <div className="breathing-date">
                {breathingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
              <div className="breathing-sign">
                {breathingCusp.blend[0]?.sign}
                {breathingCusp.isCusp && breathingCusp.blend[1] && (
                  <span className="breathing-cusp-tag">
                    /{breathingCusp.blend[1].sign} cusp
                  </span>
                )}
              </div>
              <div className="breathing-progress">
                Day {yearBreathing.dayOfYear} of 365
                <div className="breathing-progress-bar">
                  <div
                    className="breathing-progress-fill"
                    style={{ width: `${yearBreathing.progress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wheel wrapper with rotation for breathing mode */}
          <div
            className={`wheel-rotation-wrapper ${breathingEnabled ? 'breathing-active' : ''}`}
            style={breathingEnabled ? {
              transform: wheelRotation.transform,
              transition: wheelRotation.transition,
            } : undefined}
          >
            <TropicalZodiacWheel
              dimensions={dimensions}
              seasonArcs={seasonArcs}
              signArcs={signArcs}
              viewMode={viewMode}
              selectedSign={selectedSign}
              signA={signSelection.signA}
              signB={signSelection.signB}
              selectedAspect={selectedAspect}
              aspectHighlightedSigns={aspectHighlightedSigns}
              aspectReferenceSign={aspectReferenceSign}
              onSignClick={handleSignClick}
              onSeasonClick={handleSeasonClick}
              onHoverSign={setHoveredSign}
              onHoverElement={setHoveredElement}
              onHoverModality={setHoveredModality}
              onHoverCelestialEvent={setHoveredCelestialEvent}
              onHoverAspect={setHoveredAspect}
            />
          </div>

          {/* Aspect Tooltip */}
          {hoveredAspect && (() => {
            const aspectData = ASPECT_TOOLTIPS[hoveredAspect];
            if (!aspectData) return null;

            return (
              <div
                className="aspect-tooltip"
                style={{
                  border: `2px solid ${aspectData.color}`,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${aspectData.color}44`,
                }}
              >
                <div className="aspect-tooltip-header">
                  <span className="aspect-tooltip-symbol" style={{ color: aspectData.color }}>
                    {aspectData.symbol}
                  </span>
                  <div>
                    <h4 className="aspect-tooltip-title" style={{ color: aspectData.color }}>
                      {aspectData.name} ({aspectData.degrees}°)
                    </h4>
                    <span className="aspect-tooltip-vibe">{aspectData.vibe}</span>
                  </div>
                </div>

                <p className="aspect-tooltip-description">{aspectData.tooltip}</p>

                <div className="aspect-tooltip-details">
                  <div className="aspect-tooltip-row">
                    <span className="aspect-tooltip-label aspect-tooltip-label--function">Function:</span>
                    <span className="aspect-tooltip-value">{aspectData.function}</span>
                  </div>
                  <div className="aspect-tooltip-row">
                    <span className="aspect-tooltip-label aspect-tooltip-label--use">Use consciously:</span>
                    <span className="aspect-tooltip-value">{aspectData.useConsciously}</span>
                  </div>
                  <div className="aspect-tooltip-row">
                    <span className="aspect-tooltip-label aspect-tooltip-label--watch">Watch for:</span>
                    <span className="aspect-tooltip-value">{aspectData.watchFor}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Celestial Event Tooltip */}
          {hoveredCelestialEvent && (() => {
            const events = (window as any).__celestialEvents || [];
            const event = events.find((e: any) => e.id === hoveredCelestialEvent);
            if (!event) return null;

            return (
              <div className="celestial-tooltip" style={{ borderColor: event.color }}>
                <div className="celestial-tooltip-header" style={{ background: `linear-gradient(135deg, ${event.color}22, ${event.color}44)` }}>
                  <span className="celestial-icon">{event.icon}</span>
                  <div className="celestial-title">
                    <h4 style={{ color: event.color }}>{event.label}</h4>
                    <span className="celestial-tagline">{event.tagline}</span>
                  </div>
                  <span className="celestial-symbol" style={{ color: event.color }}>{event.symbol}</span>
                </div>
                <div className="celestial-tooltip-body">
                  <div className="celestial-meta">
                    <span className="celestial-date">📅 {event.date}</span>
                    <span className="celestial-sign">{event.sign} begins</span>
                  </div>
                  <p className="celestial-description">{event.description}</p>
                  <div className="celestial-keywords">
                    {event.keywords.map((kw: string) => (
                      <span key={kw} className="celestial-keyword" style={{ borderColor: event.color }}>{kw}</span>
                    ))}
                  </div>
                  <p className="celestial-imprint">{event.imprint}</p>
                  <p className="celestial-light-phase">
                    <span className="light-icon">💡</span>
                    {event.lightPhase}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Sign Tooltip */}
          {hoveredSign && (() => {
            const tooltips = (window as any).__signTooltips || {};
            const tip = tooltips[hoveredSign];
            if (!tip) return null;
            const symbol = SIGN_GLYPHS[hoveredSign] || '?';

            return (
              <div className="ring-tooltip sign-tooltip" style={{ borderColor: tip.color }}>
                <div className="ring-tooltip-header" style={{ background: `linear-gradient(135deg, ${tip.color}22, ${tip.color}44)` }}>
                  <span className="ring-tooltip-symbol" style={{ color: tip.color }}>{symbol}</span>
                  <div className="ring-tooltip-title">
                    <h4 style={{ color: tip.color }}>{hoveredSign}</h4>
                    <span className="ring-tooltip-meta">{tip.dateRange} · {tip.season} · {tip.element} · {tip.mode}</span>
                  </div>
                </div>
                <div className="ring-tooltip-body">
                  <p className="ring-tooltip-headline">{tip.headline}</p>
                  <p className="ring-tooltip-description">{tip.description}</p>
                </div>
              </div>
            );
          })()}

          {/* Element Tooltip */}
          {hoveredElement && (() => {
            const tooltips = (window as any).__elementTooltips || {};
            const tip = tooltips[hoveredElement];
            if (!tip) return null;

            return (
              <div className="ring-tooltip element-tooltip" style={{ borderColor: tip.color }}>
                <div className="ring-tooltip-header" style={{ background: `linear-gradient(135deg, ${tip.color}22, ${tip.color}44)` }}>
                  <span className="ring-tooltip-icon">{tip.icon}</span>
                  <div className="ring-tooltip-title">
                    <h4 style={{ color: tip.color }}>{hoveredElement}</h4>
                    <span className="ring-tooltip-meta">{tip.title}</span>
                  </div>
                </div>
                <div className="ring-tooltip-body">
                  <p className="ring-tooltip-headline">{tip.headline}</p>
                  <p className="ring-tooltip-description">{tip.description}</p>
                  <div className="ring-tooltip-tags">
                    <span className="tag-label">Drives:</span>
                    {tip.drives.map((d: string) => (
                      <span key={d} className="ring-tooltip-tag" style={{ borderColor: tip.color }}>{d}</span>
                    ))}
                  </div>
                  <p className="ring-tooltip-signs">
                    <span className="signs-label">Signs:</span> {tip.signs.join(' · ')}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Modality Tooltip */}
          {hoveredModality && (() => {
            const tooltips = (window as any).__modalityTooltips || {};
            const tip = tooltips[hoveredModality];
            if (!tip) return null;

            return (
              <div className="ring-tooltip modality-tooltip" style={{ borderColor: tip.color }}>
                <div className="ring-tooltip-header" style={{ background: `linear-gradient(135deg, ${tip.color}22, ${tip.color}44)` }}>
                  <span className="ring-tooltip-icon">{tip.icon}</span>
                  <div className="ring-tooltip-title">
                    <h4 style={{ color: tip.color }}>{tip.label}</h4>
                    <span className="ring-tooltip-meta">{hoveredModality}</span>
                  </div>
                </div>
                <div className="ring-tooltip-body">
                  <p className="ring-tooltip-headline">{tip.title}</p>
                  <p className="ring-tooltip-description">{tip.description}</p>
                  <div className="ring-tooltip-strengths">
                    <div className="strength-item">
                      <span className="strength-label">✓ Strength:</span>
                      <span className="strength-value">{tip.strength}</span>
                    </div>
                    <div className="strength-item challenge">
                      <span className="strength-label">⚠ Challenge:</span>
                      <span className="strength-value">{tip.challenge}</span>
                    </div>
                  </div>
                  <p className="ring-tooltip-signs">
                    <span className="signs-label">Signs:</span> {tip.signs.join(' · ')}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Legend — 4-row structured layout */}
          <div className="tropical-legend">
            {/* Row 1: SEASONS */}
            <div className="legend-row">
              <span className="legend-row-label">SEASONS</span>
              <div className="legend-row-items">
                <span className="legend-tag" style={{ borderColor: '#4ade80', color: '#4ade80' }}>Spring</span>
                <span className="legend-season-arrow">&rarr;</span>
                <span className="legend-tag" style={{ borderColor: '#fbbf24', color: '#fbbf24' }}>Summer</span>
                <span className="legend-season-arrow">&rarr;</span>
                <span className="legend-tag" style={{ borderColor: '#f97316', color: '#f97316' }}>Autumn</span>
                <span className="legend-season-arrow">&rarr;</span>
                <span className="legend-tag" style={{ borderColor: '#94a3b8', color: '#94a3b8' }}>Winter</span>
              </div>
            </div>

            {/* Row 2: Season phases */}
            <div className="legend-row">
              <span className="legend-row-label">EACH SEASON</span>
              <div className="legend-row-items">
                <span className="legend-phase">BEGINNING</span>
                <span className="legend-phase-arrow">&rarr;</span>
                <span className="legend-phase">CORE</span>
                <span className="legend-phase-arrow">&rarr;</span>
                <span className="legend-phase">TRANSITION</span>
                <span className="legend-phase-note">(to next season)</span>
              </div>
            </div>

            {/* Row 3: MODALITY */}
            <div className="legend-row">
              <span className="legend-row-label">MODALITY</span>
              <div className="legend-row-items">
                <span className="legend-modality mod-cardinal">CARDINAL</span>
                <span className="legend-modality-map">(Beginning)</span>
                <span className="legend-modality mod-fixed">FIXED</span>
                <span className="legend-modality-map">(Core)</span>
                <span className="legend-modality mod-mutable">MUTABLE</span>
                <span className="legend-modality-map">(Transition)</span>
              </div>
            </div>

            {/* Row 4: ELEMENTS */}
            <div className="legend-row">
              <span className="legend-row-label">ELEMENTS</span>
              <div className="legend-row-items">
                <span className="legend-element" style={{ color: '#ef4444' }}>FIRE</span>
                <span className="legend-element" style={{ color: '#84cc16' }}>EARTH</span>
                <span className="legend-element" style={{ color: '#38bdf8' }}>AIR</span>
                <span className="legend-element" style={{ color: '#6366f1' }}>WATER</span>
              </div>
            </div>

            {/* Micro-Legend - Essential Context (below the 4 rows) */}
            <div className="micro-legend">
              <span className="micro-legend-item">
                <em>Season</em> = psychological imprint
              </span>
              <span className="micro-legend-divider">·</span>
              <span className="micro-legend-item">
                <em>Element</em> = how energy expresses
              </span>
              <span className="micro-legend-divider">·</span>
              <span className="micro-legend-item">
                <em>Mode</em> = how energy moves
              </span>
            </div>
          </div>

          {/* Aspect Selector */}
          <div className="aspect-selector">
            <div className="aspect-header">
              <h4>Aspects</h4>
              <p className="aspect-intro">
                Select a sign, then click an aspect to see geometric relationships
              </p>
            </div>

            {/* Reference Sign Selector */}
            <div className="aspect-reference-selector">
              <label htmlFor="aspect-reference-sign">Reference Sign:</label>
              <select
                id="aspect-reference-sign"
                title="Select a reference sign for aspect calculation"
                value={aspectReferenceSign || ''}
                onChange={(e) => {
                  const sign = e.target.value as ZodiacSign || null;
                  setAspectReferenceSign(sign || null);
                  if (!sign) setSelectedAspect(null);
                }}
                className="aspect-sign-dropdown"
              >
                <option value="">Select a sign...</option>
                {SIGN_METADATA.map(meta => (
                  <option key={meta.sign} value={meta.sign}>
                    {meta.symbol} {meta.sign}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Type Buttons */}
            <div className="aspect-buttons">
              {ASPECT_TYPES.map(aspectType => {
                const def = ASPECT_DEFINITIONS[aspectType];
                const isActive = selectedAspect === aspectType;
                const isDisabled = !aspectReferenceSign;

                return (
                  <button
                    type="button"
                    key={aspectType}
                    className={`aspect-button ${isActive ? 'active' : ''} ${def.nature}`}
                    onClick={() => {
                      if (isDisabled) return;
                      handleAspectSelect(
                        isActive ? null : aspectType,
                        aspectReferenceSign
                      );
                    }}
                    disabled={isDisabled}
                    style={{
                      '--aspect-color': def.color,
                      borderColor: isActive ? def.color : 'transparent',
                      background: isActive ? `${def.color}20` : undefined,
                    } as React.CSSProperties}
                    title={def.description}
                  >
                    <span className="aspect-symbol">{def.symbol}</span>
                    <span className="aspect-name">{def.name}</span>
                    <span className="aspect-angle">{def.angle}°</span>
                  </button>
                );
              })}
            </div>

            {/* Aspect Description */}
            {selectedAspect && aspectReferenceSign && (
              <div
                className="aspect-description"
                style={{ borderLeftColor: ASPECT_DEFINITIONS[selectedAspect].color }}
              >
                <p>
                  <strong>{ASPECT_DEFINITIONS[selectedAspect].name}</strong> from {aspectReferenceSign}:
                </p>
                <p className="aspect-signs-list">
                  {getAspectingSigns(aspectReferenceSign, selectedAspect).map((sign, i) => (
                    <span key={sign} className="aspect-sign-chip">
                      {SIGN_SYMBOLS[sign]} {sign}
                      {i < getAspectingSigns(aspectReferenceSign, selectedAspect).length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p className="aspect-degree">
                  <span className="degree-badge" style={{ background: ASPECT_DEFINITIONS[selectedAspect].color }}>
                    {ASPECT_DEFINITIONS[selectedAspect].angle}°
                  </span>
                  <span className="degree-text">apart — {ASPECT_DEFINITIONS[selectedAspect].description.split('—')[1]?.trim() || ASPECT_DEFINITIONS[selectedAspect].description}</span>
                </p>
              </div>
            )}

            {/* Clear button */}
            {(selectedAspect || aspectReferenceSign) && (
              <button
                type="button"
                className="aspect-clear-button"
                onClick={() => {
                  setSelectedAspect(null);
                  setAspectReferenceSign(null);
                }}
              >
                Clear Aspect Selection
              </button>
            )}
          </div>

          {/* Welcome panel - below legend when no selection */}
          {!selectedSeasonProfile && !selectedSignMeta && !signSelection.hasPair && (
            <div className="welcome-panel welcome-panel-inline">
              <h2>🌍 Explore the Tropical Zodiac</h2>
              <p>
                The tropical zodiac aligns with Earth's seasons — each sign carries
                the energy of its seasonal moment.
              </p>

              <div className="welcome-sections-inline">
                <div className="welcome-section-inline">
                  <h4>🌓 Outer Ring: Seasons</h4>
                  <p>Click a season for its personality profile</p>
                </div>
                <div className="welcome-section-inline">
                  <h4>♈ Inner Ring: Signs</h4>
                  <p>Click a sign, then compare for compatibility</p>
                </div>
                <div className="welcome-section-inline">
                  <h4>💫 Compatibility</h4>
                  <p>Select two signs to see their chemistry</p>
                </div>
              </div>
            </div>
          )}

          {/* Compatibility mode indicator */}
          {viewMode === 'compatibility' && signSelection.signA && !signSelection.signB && (
            <div className="compat-mode-indicator">
              <p>Select a second sign to compare with <strong>{signSelection.signA}</strong></p>
              <button type="button" onClick={handleClosePanel}>Cancel</button>
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="tropical-panel">
          {/* Self Analysis Panel */}
          {analysisMode === 'self' && selectedProfile && profileWestern && (
            <SelfAnalysisPanel
              name={selectedProfile.displayName || selectedProfile.name || 'Unknown'}
              birthDate={profileWestern.birthDate}
              sunSign={profileWestern.sunSign}
              moonSign={profileWestern.moonSign}
              risingSign={profileWestern.risingSign}
              onClose={() => setAnalysisMode('wheel')}
            />
          )}

          {/* Compatibility Analysis Panel */}
          {analysisMode === 'compatibility' && selectedProfile && secondProfile && profileWestern && secondProfileWestern && (
            <CompatibilityAnalysisPanel
              profileA={{
                id: selectedProfile.id,
                name: selectedProfile.displayName || selectedProfile.name || 'Unknown',
                birthDate: profileWestern.birthDate,
                sunSign: profileWestern.sunSign,
                moonSign: profileWestern.moonSign,
                risingSign: profileWestern.risingSign,
                venusSign: profileWestern.venusSign,
                marsSign: profileWestern.marsSign,
                mercurySign: profileWestern.mercurySign,
                jupiterSign: profileWestern.jupiterSign,
                saturnSign: profileWestern.saturnSign,
                uranusSign: profileWestern.uranusSign,
                neptuneSign: profileWestern.neptuneSign,
                plutoSign: profileWestern.plutoSign,
              }}
              profileB={{
                id: secondProfile.id,
                name: secondProfile.displayName || secondProfile.name || 'Unknown',
                birthDate: secondProfileWestern.birthDate,
                sunSign: secondProfileWestern.sunSign,
                moonSign: secondProfileWestern.moonSign,
                risingSign: secondProfileWestern.risingSign,
                venusSign: secondProfileWestern.venusSign,
                marsSign: secondProfileWestern.marsSign,
                mercurySign: secondProfileWestern.mercurySign,
                jupiterSign: secondProfileWestern.jupiterSign,
                saturnSign: secondProfileWestern.saturnSign,
                uranusSign: secondProfileWestern.uranusSign,
                neptuneSign: secondProfileWestern.neptuneSign,
                plutoSign: secondProfileWestern.plutoSign,
              }}
              onClose={() => setAnalysisMode('wheel')}
              relationshipType={activeRelType}
              onRelationshipTypeChange={setActiveRelType}
            />
          )}

          {/* φ-Blend Panel - Below compatibility panel */}
          {analysisMode === 'compatibility' && selectedProfile && secondProfile && profileWestern && secondProfileWestern && (
            <PhiBlendPanel
              profileA={{
                id: selectedProfile.id,
                name: selectedProfile.displayName || selectedProfile.name || 'Unknown',
                birthDate: profileWestern.birthDate,
                birthTime: profileWestern.birthTime,
                sunSign: profileWestern.sunSign,
                moonSign: profileWestern.moonSign,
                risingSign: profileWestern.risingSign,
                moonLongitude: profileWestern.moonLongitude,
                risingLongitude: profileWestern.risingLongitude,
              }}
              profileB={{
                id: secondProfile.id,
                name: secondProfile.displayName || secondProfile.name || 'Unknown',
                birthDate: secondProfileWestern.birthDate,
                birthTime: secondProfileWestern.birthTime,
                sunSign: secondProfileWestern.sunSign,
                moonSign: secondProfileWestern.moonSign,
                risingSign: secondProfileWestern.risingSign,
                moonLongitude: secondProfileWestern.moonLongitude,
                risingLongitude: secondProfileWestern.risingLongitude,
              }}
              relationshipType={activeRelType}
            />
          )}

          {/* Wheel Mode Panels */}
          {analysisMode === 'wheel' && selectedSeasonProfile && (
            <SeasonPanel
              profile={selectedSeasonProfile}
              onClose={handleClosePanel}
            />
          )}

          {analysisMode === 'wheel' && selectedSignMeta && !signSelection.hasPair && (
            <>
              <SignPanel
                meta={selectedSignMeta}
                onClose={handleClosePanel}
                onSelectForCompat={handleSelectForCompat}
                birthDate={profileWestern?.birthDate}
              />
              {/* Khan Academy-style Angle Trainer */}
              <AngleTrainer fromSign={selectedSignMeta.sign as SignKey} />
            </>
          )}

          {/* Enhanced Compatibility Panel (new schema) - Wheel mode only */}
          {analysisMode === 'wheel' && signSelection.hasPair && signSelection.compatibility && compatMetaA && compatMetaB && useEnhancedCompat && (
            <EnhancedCompatibilityPanel
              payload={signSelection.compatibility}
              metaA={compatMetaA}
              metaB={compatMetaB}
              onClose={handleClosePanel}
              onSwap={signSelection.swapSigns}
            />
          )}

          {/* Legacy Compatibility Panel (fallback) - Wheel mode only */}
          {analysisMode === 'wheel' && signSelection.hasPair && compatResult && compatMetaA && compatMetaB && !useEnhancedCompat && (
            <CompatibilityPanel
              result={compatResult}
              metaA={compatMetaA}
              metaB={compatMetaB}
              onClose={handleClosePanel}
            />
          )}

          {/* Wheel Education Panel - Shows when nothing is selected */}
          {analysisMode === 'wheel' && !selectedSeasonProfile && !selectedSignMeta && !signSelection.hasPair && (
            <WheelEducationPanel onOpenTableFlap={() => setShowTableFlap(true)} />
          )}
        </div>
      </div>

      {/* Seasonal Calendar Flap */}
      {showCalendarFlap && (
        <div className="calendar-flap-overlay" onClick={() => setShowCalendarFlap(false)}>
          <div className="calendar-flap" onClick={(e) => e.stopPropagation()}>
            <div className="flap-header">
              <h2>📅 2026/2027 Seasonal Calendar</h2>
              <p className="flap-subtitle">Swiss Ephemeris Precision Dates (UTC)</p>
              <button
                type="button"
                className="flap-close"
                onClick={() => setShowCalendarFlap(false)}
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="flap-content">
              {/* Current Season Indicator */}
              {(() => {
                const current = getPreciseCurrentSeason();
                const next = getDaysUntilNextSeason();
                if (current) {
                  return (
                    <div className="current-season-banner">
                      <div className="current-label">Currently in</div>
                      <div className="current-info">
                        <span className="current-sign">{current.sign}</span>
                        <span className="current-phase">({current.season} {current.phase})</span>
                      </div>
                      {next && (
                        <div className="next-info">
                          {next.daysUntil} days until {next.nextSeason.sign} ({next.nextSeason.eventName || `${next.nextSeason.season} ${next.nextSeason.phase}`})
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Calendar Grid */}
              <div className="calendar-grid">
                {['Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
                  <div key={season} className={`season-group ${season.toLowerCase()}`}>
                    <h3 className="season-header">
                      {SEASON_EMOJI[season as 'Spring' | 'Summer' | 'Autumn' | 'Winter']} {season}
                    </h3>
                    <div className="phase-entries">
                      {SWISS_EPHEMERIS_DATES_2026
                        .filter((d) => d.season === season)
                        .map((ingress) => (
                          <div
                            key={`${ingress.season}-${ingress.phase}`}
                            className={`phase-entry ${ingress.phase} ${ingress.isEquinox || ingress.isSolstice ? 'major-event' : ''}`}
                          >
                            <div className="phase-label">{ingress.phase}</div>
                            <div className="phase-sign">{ingress.sign}</div>
                            <div className="phase-date">
                              {ingress.datetime.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="phase-time">
                              {ingress.datetime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                              })} UTC
                            </div>
                            {ingress.eventName && (
                              <div className="phase-event">{ingress.eventName}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flap-footer">
                <p>Calculated by Swiss Ephemeris • Newton-Raphson iteration to &lt;1 arc-second precision</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Table Flap - Draggable */}
      {showTableFlap && (
        <div
          className={`table-flap-overlay ${flapPosition.x !== 0 || flapPosition.y !== 0 ? 'flap-detached' : ''}`}
          onClick={flapPosition.x === 0 && flapPosition.y === 0 ? handleCloseTableFlap : undefined}
        >
          <div
            ref={flapRef}
            className={`table-flap ${isDragging ? 'dragging' : ''} ${flapPosition.x !== 0 || flapPosition.y !== 0 ? 'floated' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={flapPosition.x !== 0 || flapPosition.y !== 0 ? {
              position: 'fixed',
              left: `${flapPosition.x}px`,
              top: `${flapPosition.y}px`,
              transform: 'none',
            } : undefined}
          >
            <div
              className="flap-header drag-handle"
              onMouseDown={handleFlapDragStart}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div className="flap-drag-indicator">
                <span className="drag-icon">⋮⋮</span>
                <span className="drag-hint">Drag to float</span>
              </div>
              <h2>📊 Element × Season Matrix</h2>
              <p className="flap-subtitle">Click cell for insights • Drag header to float</p>
              <button
                type="button"
                className="flap-close"
                onClick={handleCloseTableFlap}
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="flap-content">
              <SummaryTableTab />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
