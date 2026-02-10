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

import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { useWheelDimensions } from '../hooks/useWheelDimensions';
import { useDraggableFlap } from '../hooks/useDraggableFlap';
import { useWheelBreathing } from '../hooks/useWheelBreathing';
import { useProfileWestern } from '../hooks/useProfileWestern';
import { useEphemerisIngress } from '../hooks/useEphemerisIngress';
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
import { ModalityPanel } from '../components/zodiac/ModalityPanel';
import { ElementPanel } from '../components/zodiac/ElementPanel';
import { PlanetPanel } from '../components/zodiac/PlanetPanel';
import { SignPanel } from '../components/zodiac/SignPanel';
import { AngleTrainer } from '../components/zodiac/AngleTrainer';
import {
  LegacyCompatibilityPanel as CompatibilityPanel,
  EnhancedCompatibilityPanel,
} from '../components/zodiac/SignCompatibilityPanels';
import { TropicalZodiacWheel } from '../components/zodiac/TropicalZodiacWheel';
import { WheelEducationPanel, SummaryTableTab } from '../components/zodiac/WheelEducationPanel';
import { PhiBlendPanel } from '../components/zodiac/PhiBlendPanel';
import TaurusSpectrumExplorer from '../components/zodiac/TaurusSpectrumExplorer';
import AriesSpectrumExplorer from '../components/zodiac/AriesSpectrumExplorer';
import GeminiSpectrumExplorer from '../components/zodiac/GeminiSpectrumExplorer';
import CancerSpectrumExplorer from '../components/zodiac/CancerSpectrumExplorer';
import LeoSpectrumExplorer from '../components/zodiac/LeoSpectrumExplorer';
import VirgoSpectrumExplorer from '../components/zodiac/VirgoSpectrumExplorer';
import LibraSpectrumExplorer from '../components/zodiac/LibraSpectrumExplorer';
import ScorpioSpectrumExplorer from '../components/zodiac/ScorpioSpectrumExplorer';
import SagittariusSpectrumExplorer from '../components/zodiac/SagittariusSpectrumExplorer';
import CapricornSpectrumExplorer from '../components/zodiac/CapricornSpectrumExplorer';
import AquariusSpectrumExplorer from '../components/zodiac/AquariusSpectrumExplorer';
import PiscesSpectrumExplorer from '../components/zodiac/PiscesSpectrumExplorer';
import { type YearSpeedKey } from '../zodiac/cusp';
import { SIGN_GLYPHS, ASPECT_TOOLTIPS, type AspectKey } from '../data/tropicalConstants';

// BATCH 5: Wheel Mode System
import { WheelModeProvider, useWheelMode } from '../seasonal-ecology';

// Styles extracted to dedicated CSS file
import './TropicalSeasonsPage.css';

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = 'overview' | 'sign' | 'season' | 'compatibility';
type AnalysisMode = 'wheel' | 'self' | 'compatibility';

// Sign → SpectrumExplorer component map (for Self mode auto-rendering)
const SPECTRUM_EXPLORER_MAP: Record<string, React.ComponentType<{ userDegree?: number | null; userName?: string | null; ephemerisTimestamps?: number[] | null }>> = {
  Aries: AriesSpectrumExplorer,
  Taurus: TaurusSpectrumExplorer,
  Gemini: GeminiSpectrumExplorer,
  Cancer: CancerSpectrumExplorer,
  Leo: LeoSpectrumExplorer,
  Virgo: VirgoSpectrumExplorer,
  Libra: LibraSpectrumExplorer,
  Scorpio: ScorpioSpectrumExplorer,
  Sagittarius: SagittariusSpectrumExplorer,
  Capricorn: CapricornSpectrumExplorer,
  Aquarius: AquariusSpectrumExplorer,
  Pisces: PiscesSpectrumExplorer,
};

const SIGN_LONGITUDE_OFFSET: Record<string, number> = {
  Aries: 0, Taurus: 30, Gemini: 60, Cancer: 90, Leo: 120, Virgo: 150,
  Libra: 180, Scorpio: 210, Sagittarius: 240, Capricorn: 270, Aquarius: 300, Pisces: 330,
};

// =============================================================================
// SIGN COMBINATION MAPPING - Each sign is a unique Season + Modality + Element
// =============================================================================

/**
 * Maps each zodiac sign to its unique combination of Season, Modality, and Element.
 * This is the foundation for the constraint learning system.
 */
const SIGN_COMBINATIONS: Record<ZodiacSign, { season: Season; modality: string; element: string }> = {
  Aries:       { season: 'Spring', modality: 'Cardinal', element: 'Fire' },
  Taurus:      { season: 'Spring', modality: 'Fixed',    element: 'Earth' },
  Gemini:      { season: 'Spring', modality: 'Mutable',  element: 'Air' },
  Cancer:      { season: 'Summer', modality: 'Cardinal', element: 'Water' },
  Leo:         { season: 'Summer', modality: 'Fixed',    element: 'Fire' },
  Virgo:       { season: 'Summer', modality: 'Mutable',  element: 'Earth' },
  Libra:       { season: 'Autumn', modality: 'Cardinal', element: 'Air' },
  Scorpio:     { season: 'Autumn', modality: 'Fixed',    element: 'Water' },
  Sagittarius: { season: 'Autumn', modality: 'Mutable',  element: 'Fire' },
  Capricorn:   { season: 'Winter', modality: 'Cardinal', element: 'Earth' },
  Aquarius:    { season: 'Winter', modality: 'Fixed',    element: 'Air' },
  Pisces:      { season: 'Winter', modality: 'Mutable',  element: 'Water' },
};

/**
 * Computes which options are still valid (not disabled) based on current selections.
 * When you select items from different rows, only compatible options remain clickable.
 */
function computeValidOptions(
  selectedSeason: Season | null,
  highlightedModality: string | null,
  highlightedElement: string | null
): {
  validSeasons: Set<Season>;
  validModalities: Set<string>;
  validElements: Set<string>;
  matchingSign: ZodiacSign | null;
} {
  const allSigns = Object.keys(SIGN_COMBINATIONS) as ZodiacSign[];

  // Filter signs that match all current selections
  const matchingSigns = allSigns.filter(sign => {
    const combo = SIGN_COMBINATIONS[sign];
    if (selectedSeason && combo.season !== selectedSeason) return false;
    if (highlightedModality && combo.modality !== highlightedModality) return false;
    if (highlightedElement && combo.element !== highlightedElement) return false;
    return true;
  });

  // Collect valid options from matching signs
  const validSeasons = new Set<Season>();
  const validModalities = new Set<string>();
  const validElements = new Set<string>();

  matchingSigns.forEach(sign => {
    const combo = SIGN_COMBINATIONS[sign];
    validSeasons.add(combo.season);
    validModalities.add(combo.modality);
    validElements.add(combo.element);
  });

  // If exactly one sign matches, that's our match
  const matchingSign = matchingSigns.length === 1 ? matchingSigns[0] : null;

  return { validSeasons, validModalities, validElements, matchingSign };
}

// =============================================================================
// HELPER COMPONENTS - Legend Row Components (must render inside WheelModeProvider)
// =============================================================================

/**
 * ResetButton - Corner reset button for the legend panel
 */
interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
  const { transitionTo } = useWheelMode();

  const handleReset = () => {
    transitionTo('default');
    onReset();
  };

  return (
    <button
      type="button"
      className="legend-reset-btn"
      onClick={handleReset}
      title="Reset wheel and aspects to default"
    >
      Reset
    </button>
  );
}

/**
 * SeasonsLegendRow - Clickable seasons header to highlight seasons ring
 * Now with constraint-based disabled states for learning mode
 * teachingSign: When set, only shows the season for that sign (double reinforcement)
 */
interface SeasonsLegendRowProps {
  onSeasonClick: (season: Season) => void;
  selectedSeason: Season | null;
  validSeasons?: Set<Season>;
  hasConstraints?: boolean;
  teachingSign?: ZodiacSign | null;
  onLabelReset?: () => void;
}

function SeasonsLegendRow({ onSeasonClick, selectedSeason, validSeasons, hasConstraints, teachingSign, onLabelReset }: SeasonsLegendRowProps) {
  const { mode, transitionTo } = useWheelMode();
  const isActive = mode === 'seasons';

  // Get the teaching sign's season for filtering
  const teachingSeason = teachingSign ? SIGN_COMBINATIONS[teachingSign]?.season : null;

  // All seasons always rendered - teaching mode hides non-matching ones
  const allSeasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

  return (
    <div className="legend-row">
      <button
        type="button"
        className={`legend-row-label-btn ${isActive ? 'active' : ''}`}
        onClick={() => {
          // Reset everything first
          onLabelReset?.();
          // Then toggle seasons mode
          transitionTo(isActive ? 'default' : 'seasons');
        }}
        title="Click to highlight the Seasons ring"
      >
        <span className="legend-label-icon">🌿</span>
        <span>Seasons</span>
      </button>
      <div className="legend-row-items">
        {allSeasons.map((season, index) => {
          const isDisabled = hasConstraints && validSeasons && !validSeasons.has(season);
          const isSelected = selectedSeason === season;
          // In teaching mode, highlight the matching season
          const isTeachingHighlight = teachingSeason === season;
          // In teaching mode, hide non-matching items (but preserve space)
          const isHiddenInTeaching = teachingSeason && teachingSeason !== season;
          return (
            <React.Fragment key={season}>
              {index > 0 && <span className="legend-season-arrow">&rarr;</span>}
              <button
                type="button"
                className={`legend-tag legend-tag-btn ${isSelected || isTeachingHighlight ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                data-season={season}
                disabled={isDisabled || !!isHiddenInTeaching}
                style={{ opacity: isHiddenInTeaching ? 0 : (isDisabled ? 0.4 : 1) }}
                onClick={() => {
                  if (isDisabled) return;
                  // Deactivate the Seasons mode button when clicking a specific season
                  transitionTo('default');
                  onSeasonClick(season);
                }}
                title={isDisabled ? `${season} not compatible with current selection` : `Click to select ${season}`}
              >
                {season}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ModalityLegendRow - Clickable modality header + individual modality buttons
 * Now with constraint-based disabled states for learning mode
 * teachingSign: When set, only shows the modality for that sign (double reinforcement)
 */
interface ModalityLegendRowProps {
  highlightedModality: string | null;
  setHighlightedModality: (modality: string | null) => void;
  modalitySigns: Record<string, ZodiacSign[]>;
  validModalities?: Set<string>;
  hasConstraints?: boolean;
  teachingSign?: ZodiacSign | null;
  onLabelReset?: () => void;
}

function ModalityLegendRow({ highlightedModality, setHighlightedModality, modalitySigns, validModalities, hasConstraints, teachingSign, onLabelReset }: ModalityLegendRowProps) {
  const { mode, transitionTo } = useWheelMode();
  // Modality label is only active when mode is 'modality' AND no specific modality is selected
  const isLabelActive = mode === 'modality' && !highlightedModality;

  // Get the teaching sign's modality for filtering
  const teachingModality = teachingSign ? SIGN_COMBINATIONS[teachingSign]?.modality : null;

  const modalityInfo: Record<string, { color: string; phase: string }> = {
    Cardinal: { color: '#f59e0b', phase: 'Beginning' },
    Fixed: { color: '#8b5cf6', phase: 'Core' },
    Mutable: { color: '#06b6d4', phase: 'Transition' },
  };

  // All modalities always rendered - teaching mode hides non-matching ones
  const allModalities = ['Cardinal', 'Fixed', 'Mutable'] as const;

  return (
    <div className="legend-row">
      <button
        type="button"
        className={`legend-row-label-btn ${isLabelActive ? 'active' : ''}`}
        onClick={() => {
          // Reset everything first
          onLabelReset?.();
          // Toggle modality mode for entire ring highlight
          if (mode === 'modality') {
            transitionTo('default');
          } else {
            transitionTo('modality');
          }
        }}
        title="Click to highlight the entire Modalities ring"
      >
        <span className="legend-label-icon">⚡</span>
        <span>Modalities</span>
      </button>
      <div className="legend-row-items modality-buttons">
        {allModalities.map((modality, index) => {
          const isModalityActive = highlightedModality === modality;
          const isDisabled = hasConstraints && validModalities && !validModalities.has(modality);
          const info = modalityInfo[modality];
          // In teaching mode, highlight the matching modality
          const isTeachingHighlight = teachingModality === modality;
          // In teaching mode, hide non-matching items (but preserve space)
          const isHiddenInTeaching = teachingModality && teachingModality !== modality;
          return (
            <React.Fragment key={modality}>
              {index > 0 && <span className="legend-modality-arrow">&rarr;</span>}
              <button
                type="button"
                className={`legend-modality-btn ${isModalityActive || isTeachingHighlight ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                disabled={isDisabled || !!isHiddenInTeaching}
                style={{
                  borderColor: isDisabled ? '#444' : info.color,
                  color: isDisabled ? '#666' : info.color,
                  background: (isModalityActive || isTeachingHighlight) ? `${info.color}22` : 'transparent',
                  opacity: isHiddenInTeaching ? 0 : (isDisabled ? 0.4 : 1),
                }}
                onClick={() => {
                  if (isDisabled) return;
                  // Return to default mode when selecting specific modality
                  transitionTo('default');
                  // Toggle the specific modality highlight
                  setHighlightedModality(isModalityActive ? null : modality);
                }}
                title={isDisabled ? `${modality} not compatible with current selection` : `Click to highlight ${modality} signs: ${modalitySigns[modality].join(', ')}`}
              >
                {modality.toUpperCase()}
              </button>
              <span
                className={`legend-modality-map ${isDisabled ? 'disabled' : ''}`}
                style={{ opacity: isHiddenInTeaching ? 0 : 1 }}
              >
                {info.phase.toUpperCase()}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ElementsLegendRow - Clickable elements header + individual element buttons
 * Now with constraint-based disabled states for learning mode
 */
/**
 * ElementsLegendRow - Clickable elements header + individual element buttons
 * Now with constraint-based disabled states for learning mode
 * teachingSign: When set, only shows the element for that sign (double reinforcement)
 */
interface ElementsLegendRowProps {
  highlightedElement: string | null;
  setHighlightedElement: (element: string | null) => void;
  elementSigns: Record<string, ZodiacSign[]>;
  validElements?: Set<string>;
  hasConstraints?: boolean;
  teachingSign?: ZodiacSign | null;
  onLabelReset?: () => void;
}

function ElementsLegendRow({ highlightedElement, setHighlightedElement, elementSigns, validElements, hasConstraints, teachingSign, onLabelReset }: ElementsLegendRowProps) {
  const { mode, transitionTo } = useWheelMode();
  // Elements label is only active when mode is 'elements' AND no specific element is selected
  const isLabelActive = mode === 'elements' && !highlightedElement;

  // Get the teaching sign's element for filtering
  const teachingElement = teachingSign ? SIGN_COMBINATIONS[teachingSign]?.element : null;

  const colors: Record<string, string> = {
    Fire: '#ef4444',
    Earth: '#84cc16',
    Air: '#38bdf8',
    Water: '#6366f1',
  };

  // All elements always rendered - teaching mode hides non-matching ones
  const allElements = ['Fire', 'Earth', 'Air', 'Water'] as const;

  return (
    <div className="legend-row">
      <button
        type="button"
        className={`legend-row-label-btn ${isLabelActive ? 'active' : ''}`}
        onClick={() => {
          // Reset everything first
          onLabelReset?.();
          // Toggle elements mode for entire ring highlight
          if (mode === 'elements') {
            transitionTo('default');
          } else {
            transitionTo('elements');
          }
        }}
        title="Click to highlight the entire Elements ring"
      >
        <span className="legend-label-icon">🔥</span>
        <span>Elements</span>
      </button>
      <div className="legend-row-items element-buttons">
        {allElements.map((element, index) => {
          const isElementActive = highlightedElement === element;
          const isDisabled = hasConstraints && validElements && !validElements.has(element);
          // In teaching mode, highlight the matching element
          const isTeachingHighlight = teachingElement === element;
          // In teaching mode, hide non-matching items (but preserve space)
          const isHiddenInTeaching = teachingElement && teachingElement !== element;
          return (
            <React.Fragment key={element}>
              {index > 0 && <span className="legend-element-arrow">&rarr;</span>}
              <button
                type="button"
                className={`legend-element-btn ${isElementActive || isTeachingHighlight ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                disabled={isDisabled || !!isHiddenInTeaching}
                style={{
                  borderColor: isDisabled ? '#444' : colors[element],
                  color: isDisabled ? '#666' : colors[element],
                  background: (isElementActive || isTeachingHighlight) ? `${colors[element]}22` : 'transparent',
                  opacity: isHiddenInTeaching ? 0 : (isDisabled ? 0.4 : 1),
                }}
                onClick={() => {
                  if (isDisabled) return;
                  // Return to default mode (not elements mode) when selecting specific element
                  transitionTo('default');
                  // Toggle the specific element highlight
                  setHighlightedElement(isElementActive ? null : element);
                }}
                title={isDisabled ? `${element} not compatible with current selection` : `Click to highlight ${element} signs: ${elementSigns[element].join(', ')}`}
              >
                {element.toUpperCase()}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * MnemonicRow - Zodiac sign sequence memory aid
 * "A Tense Gray Cat Lay Very Low, Sneaking Slowly, Carefully After Prey"
 * Each word's first letter corresponds to a zodiac sign
 */
interface MnemonicRowProps {
  selectedSign: ZodiacSign | null;
}

// Word-to-sign mapping for the mnemonic
const MNEMONIC_WORDS: { word: string; sign: ZodiacSign }[] = [
  { word: 'A', sign: 'Aries' },
  { word: 'Tense', sign: 'Taurus' },
  { word: 'Gray', sign: 'Gemini' },
  { word: 'Cat', sign: 'Cancer' },
  { word: 'Lay', sign: 'Leo' },
  { word: 'Very', sign: 'Virgo' },
  { word: 'Low,', sign: 'Libra' },
  { word: 'Sneaking', sign: 'Scorpio' },
  { word: 'Slowly,', sign: 'Sagittarius' },
  { word: 'Carefully', sign: 'Capricorn' },
  { word: 'After', sign: 'Aquarius' },
  { word: 'Prey', sign: 'Pisces' },
];

function MnemonicRow({ selectedSign }: MnemonicRowProps) {
  return (
    <div className="legend-row mnemonic-row">
      <div className="mnemonic-phrase">
        <span className="mnemonic-quote">"</span>
        {MNEMONIC_WORDS.map((item, index) => {
          const isHighlighted = selectedSign === item.sign;
          return (
            <span
              key={index}
              className={`mnemonic-word ${isHighlighted ? 'highlighted' : ''}`}
              title={item.sign}
            >
              {item.word}
            </span>
          );
        })}
        <span className="mnemonic-quote">"</span>
      </div>
    </div>
  );
}

/**
 * PlanetRulerRow - Shows traditional planetary rulers below each zodiac sign glyph
 */
const PLANET_LEGEND_COLORS: Record<string, string> = {
  Mars:    '#ef4444',
  Venus:   '#ec4899',
  Mercury: '#06b6d4',
  Moon:    '#a78bfa',
  Sun:     '#f59e0b',
  Jupiter: '#8b5cf6',
  Saturn:  '#64748b',
};

const SIGN_RULER_MAP: { sign: ZodiacSign; planet: string; glyph: string }[] = [
  { sign: 'Aries',       planet: 'Mars',    glyph: '\u2642' },
  { sign: 'Taurus',      planet: 'Venus',   glyph: '\u2640' },
  { sign: 'Gemini',      planet: 'Mercury', glyph: '\u263F' },
  { sign: 'Cancer',      planet: 'Moon',    glyph: '\u263D' },
  { sign: 'Leo',         planet: 'Sun',     glyph: '\u2609' },
  { sign: 'Virgo',       planet: 'Mercury', glyph: '\u263F' },
  { sign: 'Libra',       planet: 'Venus',   glyph: '\u2640' },
  { sign: 'Scorpio',     planet: 'Mars',    glyph: '\u2642' },
  { sign: 'Sagittarius', planet: 'Jupiter', glyph: '\u2643' },
  { sign: 'Capricorn',   planet: 'Saturn',  glyph: '\u2644' },
  { sign: 'Aquarius',    planet: 'Saturn',  glyph: '\u2644' },
  { sign: 'Pisces',      planet: 'Jupiter', glyph: '\u2643' },
];

interface PlanetRulerRowProps {
  selectedSign: ZodiacSign | null;
  onPlanetClick?: (planet: string) => void;
}

function PlanetRulerRow({ selectedSign, onPlanetClick }: PlanetRulerRowProps) {
  return (
    <div className="legend-row planet-ruler-row">
      <div className="legend-row-items planet-ruler-signs">
        {SIGN_RULER_MAP.map((item) => {
          const isHighlighted = selectedSign === item.sign;
          const color = PLANET_LEGEND_COLORS[item.planet] || '#94a3b8';
          return (
            <span
              key={item.sign}
              className={`planet-ruler-glyph ${isHighlighted ? 'highlighted' : ''}`}
              title={`${item.planet} rules ${item.sign}`}
              style={{
                color: isHighlighted ? '#fbbf24' : color,
                borderColor: isHighlighted ? '#fbbf24' : `${color}60`,
                background: isHighlighted ? 'rgba(251, 191, 36, 0.15)' : `${color}18`,
                cursor: onPlanetClick ? 'pointer' : 'default',
              }}
              onClick={() => onPlanetClick?.(item.planet)}
            >
              {item.glyph}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * SignQuizletRow - Interactive zodiac sign flashcard quiz
 * Now with constraint-based matching sign highlight
 * Clicking a glyph highlights the sign + its element/modality/season on the wheel
 */
interface SignQuizletRowProps {
  quizletSign: ZodiacSign | null;
  setQuizletSign: (sign: ZodiacSign | null) => void;
  matchingSign?: ZodiacSign | null;
  validSigns?: Set<ZodiacSign>;
  hasConstraints?: boolean;
  // Wheel highlight handlers - clicking a glyph highlights its attributes on the wheel
  onHighlightSign?: (sign: ZodiacSign | null) => void;
}

function SignQuizletRow({ quizletSign, setQuizletSign, matchingSign, validSigns, hasConstraints, onHighlightSign }: SignQuizletRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);

  // Determine which sign to show info for: quizletSign takes priority, then matchingSign
  const displaySign = quizletSign || matchingSign;
  const signMeta = displaySign ? SIGN_METADATA.find(m => m.sign === displaySign) : null;
  const isMatchedByConstraints = !quizletSign && matchingSign;

  // Color maps to match wheel colors
  const elementColors: Record<string, string> = {
    Fire: '#ef4444',
    Earth: '#84cc16',
    Air: '#38bdf8',
    Water: '#6366f1',
  };

  const modalityColors: Record<string, string> = {
    Cardinal: '#f59e0b',
    Fixed: '#8b5cf6',
    Mutable: '#06b6d4',
  };

  const seasonColors: Record<string, string> = {
    Spring: '#4ade80',
    Summer: '#fbbf24',
    Autumn: '#f97316',
    Winter: '#94a3b8',
  };

  // Map modality to phase label
  const getPhaseLabel = (modality: string): string => {
    switch (modality) {
      case 'Cardinal': return 'BEGINNING';
      case 'Fixed': return 'CORE';
      case 'Mutable': return 'TRANSITION';
      default: return '';
    }
  };

  // Close quizlet when clicking outside
  useEffect(() => {
    if (!quizletSign) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setQuizletSign(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [quizletSign, setQuizletSign]);

  // Compute which signs are valid based on constraints
  const allSigns = SIGN_METADATA.map(m => m.sign);

  return (
    <div ref={rowRef} className="legend-row quizlet-row">
      <div className="legend-row-items quizlet-signs">
        {SIGN_METADATA.map((meta) => {
          const isActive = quizletSign === meta.sign;
          const isMatched = matchingSign === meta.sign;
          const isDisabled = hasConstraints && validSigns && !validSigns.has(meta.sign);

          return (
            <button
              key={meta.sign}
              type="button"
              className={`quizlet-sign-btn ${isActive ? 'active' : ''} ${isMatched && !isActive ? 'matched' : ''} ${isDisabled ? 'disabled' : ''}`}
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                const newSign = quizletSign === meta.sign ? null : meta.sign;
                setQuizletSign(newSign);
                // Highlight this sign's attributes on the wheel
                onHighlightSign?.(newSign);
              }}
              title={isDisabled ? `${meta.sign} not compatible with current selection` : meta.sign}
              style={{
                opacity: isDisabled ? 0.25 : 1,
              }}
            >
              {meta.symbol}
            </button>
          );
        })}
      </div>
      {signMeta && (
        <div
          className={`quizlet-answer ${isMatchedByConstraints ? 'constraint-match' : ''}`}
          style={{ borderColor: elementColors[signMeta.element] }}
        >
          {isMatchedByConstraints && (
            <span className="quizlet-match-label">✓ MATCH</span>
          )}
          <span
            className="quizlet-item quizlet-sign-name"
            style={{ color: elementColors[signMeta.element] }}
          >
            {signMeta.sign.toUpperCase()}
          </span>
          <span
            className="quizlet-item quizlet-element"
            style={{ color: elementColors[signMeta.element] }}
          >
            {signMeta.element.toUpperCase()}
          </span>
          <span
            className="quizlet-item quizlet-modality"
            style={{ color: modalityColors[signMeta.modality] }}
          >
            {signMeta.modality.toUpperCase()}
          </span>
          <span
            className="quizlet-item quizlet-phase"
            style={{ color: modalityColors[signMeta.modality] }}
          >
            {getPhaseLabel(signMeta.modality)}
          </span>
          <span
            className="quizlet-item quizlet-season"
            style={{ color: seasonColors[signMeta.season] }}
          >
            {signMeta.season}
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TropicalSeasonsPage() {
  const navigate = useNavigate();

  // Profile context for profile selector
  const { profiles, loading: profilesLoading, recalculateSovereignData } = useProfiles();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [secondProfileId, setSecondProfileId] = useState<string>('');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('wheel');
  const [activeRelType, setActiveRelType] = useState<RelationshipType>('romantic');

  // Custom hooks
  const { dimensions, containerRef } = useWheelDimensions();
  const { breathingEnabled, setBreathingEnabled, breathingSpeed, setBreathingSpeed, breathingDate, breathingCusp, wheelRotation, dayOfYear, progress } = useWheelBreathing();
  const { showTableFlap, setShowTableFlap, flapPosition, isDragging, flapRef, handleFlapDragStart, handleCloseTableFlap } = useDraggableFlap();
  const { selectedProfile, profileWestern, sunCusp } = useProfileWestern(profiles, selectedProfileId);
  const { selectedProfile: secondProfile, profileWestern: secondProfileWestern } = useProfileWestern(profiles, secondProfileId);

  // Swiss Ephemeris ingress dates for degree→date mapping
  const birthYear = useMemo(() => {
    if (!profileWestern?.birthDate) return null;
    const dateStr = typeof profileWestern.birthDate === 'string'
      ? profileWestern.birthDate
      : (profileWestern.birthDate as Date).toISOString?.();
    if (!dateStr) return null;
    const year = parseInt(dateStr.substring(0, 4), 10);
    return isNaN(year) ? null : year;
  }, [profileWestern?.birthDate]);
  const ephemerisIngress = useEphemerisIngress(birthYear);

  // Sign selection hook for compatibility
  const signSelection = useSignSelection();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [useEnhancedCompat, setUseEnhancedCompat] = useState(true);
  const [selectedAspect, setSelectedAspect] = useState<AspectType | null>(null);
  const [aspectReferenceSign, setAspectReferenceSign] = useState<ZodiacSign | null>(null);
  const [showCalendarFlap, setShowCalendarFlap] = useState(false);
  const [hoveredCelestialEvent, setHoveredCelestialEvent] = useState<string | null>(null);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [hoveredModality, setHoveredModality] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectKey | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [highlightedModality, setHighlightedModality] = useState<string | null>(null);
  const [quizletSign, setQuizletSign] = useState<ZodiacSign | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  // Element to signs mapping for educational highlighting
  const ELEMENT_SIGNS: Record<string, ZodiacSign[]> = {
    Fire: ['Aries', 'Leo', 'Sagittarius'],
    Earth: ['Taurus', 'Virgo', 'Capricorn'],
    Air: ['Gemini', 'Libra', 'Aquarius'],
    Water: ['Cancer', 'Scorpio', 'Pisces'],
  };

  // Modality to signs mapping for educational highlighting
  const MODALITY_SIGNS: Record<string, ZodiacSign[]> = {
    Cardinal: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    Fixed: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    Mutable: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
  };

  // Calculate which signs should be highlighted based on selected aspect
  const aspectHighlightedSigns = useMemo(() => {
    if (!selectedAspect || !aspectReferenceSign) return new Set<ZodiacSign>();
    const aspectingSigns = getAspectingSigns(aspectReferenceSign, selectedAspect);
    return new Set([aspectReferenceSign, ...aspectingSigns]);
  }, [selectedAspect, aspectReferenceSign]);

  // Calculate which signs should be highlighted based on selected element
  // Respects ALL active constraints (modality, season) - only highlight matching signs
  const elementHighlightedSigns = useMemo(() => {
    if (!highlightedElement) return new Set<ZodiacSign>();
    const elementSigns = ELEMENT_SIGNS[highlightedElement] || [];
    // If there are other constraints active, filter to only signs matching all constraints
    if (selectedSeason || highlightedModality) {
      return new Set(elementSigns.filter(sign => {
        const combo = SIGN_COMBINATIONS[sign];
        if (selectedSeason && combo.season !== selectedSeason) return false;
        if (highlightedModality && combo.modality !== highlightedModality) return false;
        return true;
      }));
    }
    return new Set(elementSigns);
  }, [highlightedElement, selectedSeason, highlightedModality]);

  // Calculate which signs should be highlighted based on selected modality
  // Respects ALL active constraints (element, season) - only highlight matching signs
  const modalityHighlightedSigns = useMemo(() => {
    if (!highlightedModality) return new Set<ZodiacSign>();
    const modalitySigns = MODALITY_SIGNS[highlightedModality] || [];
    // If there are other constraints active, filter to only signs matching all constraints
    if (selectedSeason || highlightedElement) {
      return new Set(modalitySigns.filter(sign => {
        const combo = SIGN_COMBINATIONS[sign];
        if (selectedSeason && combo.season !== selectedSeason) return false;
        if (highlightedElement && combo.element !== highlightedElement) return false;
        return true;
      }));
    }
    return new Set(modalitySigns);
  }, [highlightedModality, selectedSeason, highlightedElement]);

  // Constraint system: compute valid options based on current selections
  const constraintInfo = useMemo(() => {
    const hasConstraints = !!(selectedSeason || highlightedModality || highlightedElement);
    const { validSeasons, validModalities, validElements, matchingSign } = computeValidOptions(
      selectedSeason,
      highlightedModality,
      highlightedElement
    );

    // Compute valid signs (signs that match all current constraints)
    const validSigns = new Set<ZodiacSign>();
    (Object.keys(SIGN_COMBINATIONS) as ZodiacSign[]).forEach(sign => {
      const combo = SIGN_COMBINATIONS[sign];
      if (selectedSeason && combo.season !== selectedSeason) return;
      if (highlightedModality && combo.modality !== highlightedModality) return;
      if (highlightedElement && combo.element !== highlightedElement) return;
      validSigns.add(sign);
    });

    return { hasConstraints, validSeasons, validModalities, validElements, validSigns, matchingSign };
  }, [selectedSeason, highlightedModality, highlightedElement]);

  // When combination results in a unique matching sign, show that Sign panel
  useEffect(() => {
    if (constraintInfo.matchingSign && !quizletSign) {
      // A unique sign matches the current combination (Season + Modality + Element)
      // Show the Sign panel with that sign highlighted
      // Don't clear selectedSeason - we still want the constraint visible in the legend
      setSelectedSign(constraintInfo.matchingSign);
      setViewMode('sign');
    }
  }, [constraintInfo.matchingSign, quizletSign]);

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

  // Recalculate handler — re-triggers Python backend for the selected profile
  const handleRecalculate = useCallback(async () => {
    if (!selectedProfileId || isRecalculating) return;
    setIsRecalculating(true);
    try {
      await recalculateSovereignData(selectedProfileId);
    } catch (err) {
      console.error('Recalculation failed:', err);
    } finally {
      setIsRecalculating(false);
    }
  }, [selectedProfileId, isRecalculating, recalculateSovereignData]);

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

  // Season click handler - with toggle (click again to close)
  const handleSeasonClick = useCallback((season: Season) => {
    if (selectedSeason === season) {
      // Toggle off - clicking same season again
      setSelectedSeason(null);
      setViewMode('overview');
    } else {
      // Select new season
      setSelectedSeason(season);
      // If a sign is already selected (e.g. from constraint matching), keep it
      // if it belongs to the season being clicked — otherwise clear it
      if (selectedSign) {
        const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
        if (signMeta && signMeta.season === season) {
          // Sign is in this season — keep the sign panel open
        } else {
          setSelectedSign(null);
          setViewMode('season');
        }
      } else {
        setViewMode('season');
      }
    }
  }, [selectedSeason, selectedSign]);

  // Handlers
  const handleClosePanel = useCallback(() => {
    setSelectedSign(null);
    setSelectedSeason(null);
    setSelectedPlanet(null);
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

  // Quizlet glyph click handler - highlights ONLY that sign sector and shows Sign panel
  // Teaching tool: "Where is Aries?" → Only Aries arc highlighted, Aries panel shown
  const handleQuizletHighlight = useCallback((sign: ZodiacSign | null) => {
    // Reset all other highlights
    setHighlightedElement(null);
    setHighlightedModality(null);
    setSelectedSeason(null);
    setSelectedPlanet(null);
    setSelectedAspect(null);
    setAspectReferenceSign(null);

    // Set selectedSign to highlight ONLY this sign's arc and show Sign panel
    setSelectedSign(sign);
    if (sign) {
      setViewMode('sign');
    } else {
      setViewMode('overview');
    }
  }, []);

  return (
    <WheelModeProvider>
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
            onClick={handleRecalculate}
            className="recalculate-button"
            title="Recalculate profile from Python backend"
            disabled={isRecalculating || !selectedProfileId}
          >
            {isRecalculating ? '⏳ Recalculating…' : '🔄 Recalculate'}
          </button>
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
                Day {dayOfYear} of 365
                <div className="breathing-progress-bar">
                  <div
                    className="breathing-progress-fill"
                    style={{ width: `${progress * 100}%` }}
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
              elementHighlightedSigns={elementHighlightedSigns}
              highlightedElement={highlightedElement}
              modalityHighlightedSigns={modalityHighlightedSigns}
              highlightedModality={highlightedModality}
              selectedSeason={selectedSeason}
              onSignClick={handleSignClick}
              onSeasonClick={handleSeasonClick}
              onHoverSign={setHoveredSign}
              onHoverElement={setHoveredElement}
              onHoverModality={setHoveredModality}
              onHoverCelestialEvent={setHoveredCelestialEvent}
              onHoverAspect={setHoveredAspect}
              onPlanetClick={setSelectedPlanet}
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

          {/* Legend — 4-row structured layout (all interactive) */}
          <div className="tropical-legend">
            {/* Reset button at top-right corner */}
            <ResetButton onReset={() => {
              setSelectedAspect(null);
              setAspectReferenceSign(null);
              setHighlightedElement(null);
              setHighlightedModality(null);
              setSelectedSeason(null);
              setQuizletSign(null);
              setSelectedSign(null);
              setViewMode('overview');
            }} />

            {/* Row 1: SEASONS - Clickable to highlight seasons ring */}
            <SeasonsLegendRow
              onSeasonClick={handleSeasonClick}
              selectedSeason={selectedSeason}
              validSeasons={constraintInfo.validSeasons}
              hasConstraints={constraintInfo.hasConstraints}
              teachingSign={quizletSign}
              onLabelReset={() => {
                setSelectedAspect(null);
                setAspectReferenceSign(null);
                setHighlightedElement(null);
                setHighlightedModality(null);
                setSelectedSeason(null);
                setQuizletSign(null);
                setSelectedSign(null);
              }}
            />

            {/* Row 2: MODALITY - Clickable to highlight modality ring + signs */}
            <ModalityLegendRow
              highlightedModality={highlightedModality}
              setHighlightedModality={setHighlightedModality}
              modalitySigns={MODALITY_SIGNS}
              validModalities={constraintInfo.validModalities}
              hasConstraints={constraintInfo.hasConstraints}
              teachingSign={quizletSign}
              onLabelReset={() => {
                setSelectedAspect(null);
                setAspectReferenceSign(null);
                setHighlightedElement(null);
                setHighlightedModality(null);
                setSelectedSeason(null);
                setQuizletSign(null);
                setSelectedSign(null);
              }}
            />

            {/* Row 3: ELEMENTS - Clickable to highlight element ring + signs */}
            <ElementsLegendRow
              highlightedElement={highlightedElement}
              setHighlightedElement={setHighlightedElement}
              elementSigns={ELEMENT_SIGNS}
              validElements={constraintInfo.validElements}
              hasConstraints={constraintInfo.hasConstraints}
              teachingSign={quizletSign}
              onLabelReset={() => {
                setSelectedAspect(null);
                setAspectReferenceSign(null);
                setHighlightedElement(null);
                setHighlightedModality(null);
                setSelectedSeason(null);
                setQuizletSign(null);
                setSelectedSign(null);
              }}
            />

            {/* Mnemonic Row: Memory aid for zodiac sequence */}
            <MnemonicRow selectedSign={quizletSign} />

            {/* Row 4: SIGNS QUIZLET - Interactive zodiac sign flashcard */}
            <SignQuizletRow
              quizletSign={quizletSign}
              setQuizletSign={setQuizletSign}
              matchingSign={constraintInfo.matchingSign}
              validSigns={constraintInfo.validSigns}
              hasConstraints={constraintInfo.hasConstraints}
              onHighlightSign={handleQuizletHighlight}
            />

            {/* Row 5: PLANET RULERS - Traditional planetary rulers under each sign */}
            <PlanetRulerRow selectedSign={quizletSign} onPlanetClick={setSelectedPlanet} />

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
          {/* Self Analysis Panel + Sun Sign Spectrum Explorer */}
          {analysisMode === 'self' && selectedProfile && profileWestern && (
            <>
              <SelfAnalysisPanel
                name={selectedProfile.displayName || selectedProfile.name || 'Unknown'}
                birthDate={profileWestern.birthDate}
                sunSign={profileWestern.sunSign}
                moonSign={profileWestern.moonSign}
                risingSign={profileWestern.risingSign}
                sunLongitude={profileWestern.sunLongitude}
                moonLongitude={profileWestern.moonLongitude}
                risingLongitude={profileWestern.risingLongitude}
                onClose={() => setAnalysisMode('wheel')}
              />

              {/* Zone Deep-Dive: SpectrumExplorer for the user's Sun sign */}
              {profileWestern.sunSign && (() => {
                const Explorer = SPECTRUM_EXPLORER_MAP[profileWestern.sunSign];
                if (!Explorer) return null;
                const offset = SIGN_LONGITUDE_OFFSET[profileWestern.sunSign] ?? 0;
                const userDeg = profileWestern.sunLongitude != null
                  ? profileWestern.sunLongitude - offset
                  : null;
                return (
                  <Explorer
                    userDegree={userDeg}
                    userName={selectedProfile.name || null}
                    ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                  />
                );
              })()}
            </>
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
                venusSign: profileWestern.venusSign,
                marsSign: profileWestern.marsSign,
                venusLongitude: profileWestern.venusLongitude,
                marsLongitude: profileWestern.marsLongitude,
                sunLongitude: profileWestern.sunLongitude,
                houseCusps: profileWestern.houseCusps,
                allPlanetLongitudes: profileWestern.allPlanetLongitudes,
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
                venusSign: secondProfileWestern.venusSign,
                marsSign: secondProfileWestern.marsSign,
                venusLongitude: secondProfileWestern.venusLongitude,
                marsLongitude: secondProfileWestern.marsLongitude,
                sunLongitude: secondProfileWestern.sunLongitude,
                houseCusps: secondProfileWestern.houseCusps,
                allPlanetLongitudes: secondProfileWestern.allPlanetLongitudes,
              }}
              relationshipType={activeRelType}
            />
          )}

          {/* Wheel Mode Panels */}
          {/* SeasonPanel only shows if there's no unique matching sign (SignPanel takes priority) */}
          {analysisMode === 'wheel' && selectedSeasonProfile && !constraintInfo.matchingSign && !highlightedModality && (
            <SeasonPanel
              profile={selectedSeasonProfile}
              onClose={handleClosePanel}
            />
          )}

          {/* ModalityPanel shows when only a modality is selected (no season, no element, no unique sign) */}
          {analysisMode === 'wheel' && highlightedModality && !selectedSeason && !highlightedElement && !constraintInfo.matchingSign && (
            <ModalityPanel
              modality={highlightedModality as 'Cardinal' | 'Fixed' | 'Mutable'}
              onClose={() => setHighlightedModality(null)}
              onSignClick={handleSignClick}
            />
          )}

          {/* ElementPanel shows when only an element is selected (no season, no modality, no unique sign) */}
          {analysisMode === 'wheel' && highlightedElement && !selectedSeason && !highlightedModality && !constraintInfo.matchingSign && (
            <ElementPanel
              element={highlightedElement as 'Fire' | 'Earth' | 'Air' | 'Water'}
              onClose={() => setHighlightedElement(null)}
              onSignClick={handleSignClick}
            />
          )}

          {/* PlanetPanel shows when a planet ruler glyph is clicked */}
          {analysisMode === 'wheel' && selectedPlanet && (
            <PlanetPanel
              planet={selectedPlanet as 'Mars' | 'Venus' | 'Mercury' | 'Moon' | 'Sun' | 'Jupiter' | 'Saturn'}
              onClose={() => setSelectedPlanet(null)}
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

              {/* Spectrum Explorers — 30° deep-dive per sign */}
              {selectedSignMeta.sign === 'Aries' && (
                <AriesSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Aries' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Taurus' && (
                <TaurusSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Taurus' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 30
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Gemini' && (
                <GeminiSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Gemini' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 60
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Cancer' && (
                <CancerSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Cancer' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 90
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Leo' && (
                <LeoSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Leo' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 120
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Virgo' && (
                <VirgoSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Virgo' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 150
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Libra' && (
                <LibraSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Libra' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 180
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Scorpio' && (
                <ScorpioSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Scorpio' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 210
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Sagittarius' && (
                <SagittariusSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Sagittarius' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 240
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Capricorn' && (
                <CapricornSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Capricorn' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 270
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Aquarius' && (
                <AquariusSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Aquarius' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 300
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
              {selectedSignMeta.sign === 'Pisces' && (
                <PiscesSpectrumExplorer
                  userDegree={
                    profileWestern?.sunSign === 'Pisces' && profileWestern?.sunLongitude != null
                      ? profileWestern.sunLongitude - 330
                      : null
                  }
                  userName={selectedProfile?.name || null}
                  ephemerisTimestamps={ephemerisIngress?.ingressTimestamps ?? null}
                />
              )}
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

          {/* Wheel Education Panel - Shows when nothing is selected in Wheel mode */}
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
    </WheelModeProvider>
  );
}
