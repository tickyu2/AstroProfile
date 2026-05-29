/**
 * BaZiBranchWheelPage.tsx — Page wrapper for the BaZi Earthly Branches Wheel.
 *
 * Manages state, data building, detail panels, legend row, and tooltips.
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useWheelDimensions } from '../hooks/useWheelDimensions';
import BaZiBranchWheel from '../components/bazi/BaZiBranchWheel';
import {
  buildBranchWheelArcs,
  buildHiddenStemArcs,
  buildSeasonWheelArcs,
  buildStemWheelArcs,
  buildDayPillarScenarios,
  buildSeasonalStrengthBars,
  buildMonthGapLabels,
  buildDayGapLabels,
  getAlignedStemIndex,
  getStemTypeLabel,
  getBranchSolarTerm,
  getBranchEndTerm,
  getBranchPurity,
  yearToStemOffset,
  yearToStemBranch,
  yearPillarLabel,
  monthToStemOffset,
  monthPillarLabel,
  dayToStemOffset,
  dayPillarLabelFromDate,
  dateToDayStemBranch,
  hourToStemOffset,
  hourToBranchIndex,
  hourPillarLabel,
  buildHourGapLabels,
  dateToMonthBranch,
  ELEMENT_COLORS,
  BRANCH_SEGMENTS,
  HIDDEN_STEMS,
  STEM_SEGMENTS,
  SEASON_COLORS,
  SEASON_MARKERS,
  ANIMAL_GLYPHS,
  BRANCH_MYTHIC_STORIES,
  PURITY_COLORS,
} from '../utils/branchWheelData';
import type { DayPillarScenario, BranchPurity } from '../utils/branchWheelData';
import {
  getTenGod,
  buildHiddenStemStory,
  shiftDateBy,
  RELATION_COLORS,
  ELEMENT_GLYPHS,
  type TenGodInfo,
} from '../utils/baziWheels';
import { SEASONAL_LENSES, buildLensMarkdown } from '../data/seasonalLenses';
import FloatingMdWindow from '../components/shared/FloatingMdWindow';

// ---------------------------------------------------------------------------
// Element + Season button configs
// ---------------------------------------------------------------------------

const ELEMENT_BUTTONS = [
  { element: 'Wood',  label: '🌳 Wood',  color: ELEMENT_COLORS.Wood },
  { element: 'Fire',  label: '🔥 Fire',  color: ELEMENT_COLORS.Fire },
  { element: 'Earth', label: '🌍 Earth', color: ELEMENT_COLORS.Earth },
  { element: 'Metal', label: '⚙️ Metal', color: ELEMENT_COLORS.Metal },
  { element: 'Water', label: '💧 Water', color: ELEMENT_COLORS.Water },
];

const SEASON_BUTTONS = [
  { season: 'Spring', label: '🌸 Spring', color: SEASON_COLORS.Spring },
  { season: 'Summer', label: '☀️ Summer', color: SEASON_COLORS.Summer },
  { season: 'Autumn', label: '🍂 Autumn', color: SEASON_COLORS.Autumn },
  { season: 'Winter', label: '❄️ Winter', color: SEASON_COLORS.Winter },
];

// ---------------------------------------------------------------------------
// Stem hover info type
// ---------------------------------------------------------------------------

interface StemHoverInfo {
  branchIndex: number;
  stemChar: string;
  element: string;
  polarity: string;
  percentage: number;
  stemIndex: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BaZiBranchWheelPage() {
  // Data (memoized, computed once)
  const branchArcs = useMemo(() => buildBranchWheelArcs(), []);
  const hiddenStemArcs = useMemo(() => buildHiddenStemArcs(branchArcs), [branchArcs]);
  const seasonArcs = useMemo(() => buildSeasonWheelArcs(), []);

  // Year-based inner wheel — default 2026 (丙午 Yang Fire Horse)
  const [currentYear, setCurrentYear] = useState(2026);

  // Pillar mode: 'off' | 'year' | 'month' | 'day' | 'hour'
  type PillarMode = 'off' | 'year' | 'month' | 'day' | 'hour';
  const [pillarMode, setPillarMode] = useState<PillarMode>('off');
  const [lockedBranch, setLockedBranch] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Draft string for the date text input — allows free typing
  const fmtDate = (d: Date) =>
    `${String(d.getFullYear()).padStart(4, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const [dateDraft, setDateDraft] = useState(() => fmtDate(new Date()));
  const [dateFocused, setDateFocused] = useState(false);

  // Seasonality floating window
  const [floatingMd, setFloatingMd] = useState<{ title: string; content: string; width?: number } | null>(null);
  const mdFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenLens = useCallback((lensId: string) => {
    const lens = SEASONAL_LENSES.find(l => l.id === lensId);
    if (lens) setFloatingMd({ title: `${lens.icon} ${lens.label}`, content: buildLensMarkdown(lens) });
  }, []);

  const handleOpenChronicleMd = useCallback(() => {
    fetch('/seasonal/gray_whale_chronicle.md')
      .then(r => r.text())
      .then(text => setFloatingMd({ title: '🐋 Gray Whale — Full Chronicle', content: text }))
      .catch(() => alert('Could not load chronicle MD'));
  }, []);

  const handleImportMd = useCallback(() => {
    mdFileInputRef.current?.click();
  }, []);

  const handleMdFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setFloatingMd({ title: `📄 ${file.name}`, content: text });
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleExportMd = useCallback(() => {
    if (!floatingMd) return;
    const blob = new Blob([floatingMd.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seasonal-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [floatingMd]);

  // Life Cycle — independent state that persists imported content
  const lifecycleMdRef = useRef<{ title: string; content: string } | null>(null);
  const lcFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenLifeCycle = useCallback(() => {
    if (lifecycleMdRef.current) {
      setFloatingMd(lifecycleMdRef.current);
    } else {
      fetch('/seasonal/gray_whale_chronicle.md')
        .then(r => r.text())
        .then(text => {
          const entry = { title: '🐣 Gray Whale — Life Cycle', content: text };
          lifecycleMdRef.current = entry;
          setFloatingMd(entry);
        })
        .catch(() => alert('Could not load Life Cycle MD'));
    }
  }, []);

  const handleLcImport = useCallback(() => {
    lcFileInputRef.current?.click();
  }, []);

  const handleLcFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const entry = { title: `🐣 ${file.name}`, content: text };
      lifecycleMdRef.current = entry;
      setFloatingMd(entry);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleLcExport = useCallback(() => {
    const src = lifecycleMdRef.current;
    if (!src) return;
    const blob = new Blob([src.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-cycle-export.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Lucky Hour roulette state
  const [spinTrigger, setSpinTrigger] = useState(0);   // increment to spin, 0 = cleared
  const [isSpinning, setIsSpinning] = useState(false);
  const [luckyResult, setLuckyResult] = useState<{ branchIndex: number; displayPos: number } | null>(null);

  // Stem offset depends on pillar mode
  const stemOffset = useMemo(() => {
    if (pillarMode === 'month') {
      const { stemIndex: yearStemIdx } = yearToStemBranch(currentYear);
      return monthToStemOffset(yearStemIdx);
    }
    if (pillarMode === 'day') {
      return dayToStemOffset(currentDate);
    }
    if (pillarMode === 'hour') {
      return hourToStemOffset(currentDate);
    }
    return yearToStemOffset(currentYear);
  }, [currentYear, currentDate, pillarMode]);
  const stemWheelArcs = useMemo(() => buildStemWheelArcs(stemOffset), [stemOffset]);

  // Month gap labels (only computed in month mode)
  const monthLabels = useMemo(() => {
    if (pillarMode !== 'month') return null;
    return buildMonthGapLabels(currentYear);
  }, [currentYear, pillarMode]);

  // Day gap labels (only computed in day mode)
  const dayLabels = useMemo(() => {
    if (pillarMode !== 'day') return null;
    return buildDayGapLabels(currentDate);
  }, [currentDate, pillarMode]);

  // Hour gap labels (only computed in hour mode)
  const hourLabels = useMemo(() => {
    if (pillarMode !== 'hour') return null;
    return buildHourGapLabels(currentDate);
  }, [currentDate, pillarMode]);

  // Active pillar branch highlight — only the selected pillar mode
  const pillarBranches = useMemo((): { year?: number; month?: number; day?: number; hour?: number } | null => {
    if (pillarMode === 'off') return null;
    if (pillarMode === 'year')  return { year:  yearToStemBranch(currentYear).branchIndex };
    if (pillarMode === 'month') return { month: dateToMonthBranch(currentDate) };
    if (pillarMode === 'day')   return { day:   dateToDayStemBranch(currentDate).branchIndex };
    if (pillarMode === 'hour')  return { hour:  hourToBranchIndex(currentDate.getHours()) };
    return null;
  }, [currentYear, currentDate, pillarMode]);

  // Responsive dimensions
  const { dimensions, containerRef } = useWheelDimensions();

  // Interaction state
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<number | null>(null);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [highlightedSeason, setHighlightedSeason] = useState<string | null>(null);
  const [hoveredStem, setHoveredStem] = useState<StemHoverInfo | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Day Master for Ten God analysis
  const [dayMasterIdx, setDayMasterIdx] = useState<number | null>(null);
  const dayMaster = useMemo(() => {
    if (dayMasterIdx === null) return null;
    const s = STEM_SEGMENTS[dayMasterIdx];
    return { element: s.element, polarity: s.polarity, char: s.char, english: s.english };
  }, [dayMasterIdx]);

  // Callbacks
  const handleBranchClick = useCallback((idx: number) => {
    if (pillarMode !== 'off') {
      const isUnlocking = lockedBranch === idx;
      setLockedBranch(isUnlocking ? null : idx);
      setSelectedBranch(idx);

      // When locking, navigate currentDate/currentYear to match the clicked branch
      if (!isUnlocking) {
        const clickedArc = branchArcs.find(a => a.branchIndex === idx);
        if (!clickedArc) return;

        if (pillarMode === 'year') {
          const { branchIndex: curBI } = yearToStemBranch(currentYear);
          const curDP = ((curBI - 2 + 12) % 12);
          const targetYear = currentYear + (clickedArc.displayPos - curDP);
          setCurrentYear(targetYear);
          setCurrentDate(prev => { const d = new Date(prev); d.setFullYear(targetYear); return d; });
        } else if (pillarMode === 'month') {
          // Approximate: set date to 15th of branch's corresponding Gregorian month
          const jsMonth = (idx - 1 + 12) % 12; // Tiger(2)->Feb(1), Rat(0)->Dec(11), Ox(1)->Jan(0)
          setCurrentDate(prev => { const d = new Date(prev); d.setMonth(jsMonth, 15); return d; });
        } else if (pillarMode === 'day') {
          const { branchIndex: refBI } = dateToDayStemBranch(currentDate);
          const refDP = ((refBI - 2 + 12) % 12);
          const offset = ((clickedArc.displayPos - refDP) + 12) % 12;
          if (offset > 0) {
            const d = new Date(currentDate);
            d.setDate(d.getDate() + offset);
            setCurrentDate(d);
            setCurrentYear(d.getFullYear());
          }
        } else if (pillarMode === 'hour') {
          const refBI = hourToBranchIndex(currentDate.getHours());
          const refDP = ((refBI - 2 + 12) % 12);
          const branchOff = ((clickedArc.displayPos - refDP) + 12) % 12;
          if (branchOff > 0) {
            const d = new Date(currentDate);
            const refStart = refBI === 0 ? 23 : refBI * 2 - 1;
            d.setHours(refStart, 0, 0, 0);
            d.setTime(d.getTime() + branchOff * 2 * 60 * 60 * 1000);
            setCurrentDate(d);
            setCurrentYear(d.getFullYear());
          }
        }
      }
    } else {
      setSelectedBranch(prev => (prev === idx ? null : idx));
    }
  }, [pillarMode, lockedBranch, currentYear, currentDate, branchArcs]);

  const handleBranchHover = useCallback((idx: number | null) => {
    setHoveredBranch(idx);
  }, []);

  const handleSeasonClick = useCallback((season: string) => {
    setHighlightedSeason(prev => (prev === season ? null : season));
  }, []);

  const handleElementToggle = useCallback((element: string) => {
    setHighlightedElement(prev => (prev === element ? null : element));
  }, []);

  const handleHiddenStemHover = useCallback((info: StemHoverInfo | null) => {
    setHoveredStem(info);
  }, []);

  const handleSeasonMarkerHover = useCallback((season: string | null) => {
    setHoveredMarker(season);
  }, []);

  const handleStemNavigate = useCallback((direction: 'prev' | 'next') => {
    if (pillarMode === 'hour') {
      // Hour mode: ±2 hours (one branch)
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setTime(d.getTime() + (direction === 'next' ? 2 : -2) * 60 * 60 * 1000);
        return d;
      });
    } else if (pillarMode === 'day') {
      // Day mode: ±1 day
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
        return d;
      });
    } else if (pillarMode === 'month') {
      // Month mode: ±1 month — sector and stem wheel both advance
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentYear(d.getFullYear());
        return d;
      });
    } else {
      // Year mode (or off): ±1 year — sector and stem wheel both advance
      const delta = direction === 'next' ? 1 : -1;
      setCurrentYear(prev => prev + delta);
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setFullYear(d.getFullYear() + delta);
        return d;
      });
    }
  }, [pillarMode]);

  const handlePillarModeToggle = useCallback((mode: 'year' | 'month' | 'day' | 'hour') => {
    // Always release lock and selected branch when switching pillars
    setLockedBranch(null);
    setSelectedBranch(null);
    setPillarMode(mode);
    // Sync year from the current Set Date so the wheel computes from it
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  const handleReset = useCallback(() => {
    const now = new Date();
    setSelectedBranch(null);
    setHoveredBranch(null);
    setHighlightedElement(null);
    setHighlightedSeason(null);
    setHoveredStem(null);
    setHoveredMarker(null);
    setLockedBranch(null);
    setCurrentYear(now.getFullYear());
    setCurrentDate(now);
    setIsSpinning(false);
    setLuckyResult(null);
    setSpinTrigger(0);  // 0 tells wheel to clear ball
    setFloatingMd(null);
    // NOTE: pillarMode is NOT reset — UI stays visible
  }, []);

  // Derived: locked branch info in pillar mode
  const lockedBranchYear = useMemo(() => {
    if (pillarMode === 'off' || lockedBranch === null) return null;
    const lockedArc = branchArcs.find(a => a.branchIndex === lockedBranch);
    if (!lockedArc) return null;

    if (pillarMode === 'year') {
      const { branchIndex: currentBranchIdx } = yearToStemBranch(currentYear);
      const currentDisplayPos = ((currentBranchIdx - 2 + 12) % 12);
      const year = currentYear + (lockedArc.displayPos - currentDisplayPos);
      const pillar = yearPillarLabel(year);
      return { year, mode: 'year' as const, ...pillar };
    }

    if (pillarMode === 'hour') {
      // Hour mode — find the hour at this branch's position
      const refBranch = hourToBranchIndex(currentDate.getHours());
      const refDisplayPos = ((refBranch - 2 + 12) % 12);
      const branchOffset = ((lockedArc.displayPos - refDisplayPos) + 12) % 12;
      const d = new Date(currentDate);
      const refStart = refBranch === 0 ? 23 : refBranch * 2 - 1;
      d.setHours(refStart, 0, 0, 0);
      d.setTime(d.getTime() + branchOffset * 2 * 60 * 60 * 1000);
      const { stemIndex: dayStemIdx } = dateToDayStemBranch(d);
      const pillar = hourPillarLabel(dayStemIdx, lockedBranch);
      return {
        year: d.getFullYear(),
        mode: 'hour' as const,
        ...pillar,
      };
    }

    if (pillarMode === 'day') {
      // Day mode — find the date at this branch's position
      const { branchIndex: refBranch } = dateToDayStemBranch(currentDate);
      const refDisplayPos = ((refBranch - 2 + 12) % 12);
      const offset = ((lockedArc.displayPos - refDisplayPos) + 12) % 12;
      const d = new Date(currentDate);
      d.setDate(d.getDate() + offset);
      const pillar = dayPillarLabelFromDate(d);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      return {
        year: d.getFullYear(),
        mode: 'day' as const,
        ...pillar,
        dateStr,
        dayLabel,
      };
    }

    // Month mode
    const { stemIndex: yearStemIdx } = yearToStemBranch(currentYear);
    const pillar = monthPillarLabel(yearStemIdx, lockedBranch);
    const startTerm = getBranchSolarTerm(lockedBranch);
    const endTerm = getBranchEndTerm(lockedBranch);
    return {
      year: currentYear,
      mode: 'month' as const,
      ...pillar,
      startDate: startTerm?.approxDate || '',
      endDate: endTerm?.approxDate || '',
      startTermChinese: startTerm?.termChinese || '',
      startTermEnglish: startTerm?.termEnglish || '',
      endTermChinese: endTerm?.termChinese || '',
      endTermEnglish: endTerm?.termEnglish || '',
    };
  }, [pillarMode, lockedBranch, currentYear, currentDate, branchArcs]);

  // Derived: active branch for detail panel
  const activeBranch = selectedBranch ?? hoveredBranch;
  const activeSeg = activeBranch !== null ? BRANCH_SEGMENTS[activeBranch] : null;
  const activeStems = activeBranch !== null ? (HIDDEN_STEMS[activeBranch] || []) : [];
  const activeArc = activeBranch !== null
    ? branchArcs.find(a => a.branchIndex === activeBranch) : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.15)',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            🌏 Earthly Branches Wheel <span style={{ color: '#94a3b8', fontWeight: 400 }}>地支</span>
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
            Hidden stems &amp; seasonal element flow — Tiger at 12 o'clock
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Day Master selector */}
          <div style={{ position: 'relative' }}>
            <select
              title="Select Day Master for Ten God analysis"
              value={dayMasterIdx ?? ''}
              onChange={e => setDayMasterIdx(e.target.value === '' ? null : Number(e.target.value))}
              style={{
                padding: '6px 28px 6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: dayMaster
                  ? ELEMENT_COLORS[dayMaster.element] + '18'
                  : 'rgba(30,41,59,0.6)',
                border: `1px solid ${dayMaster
                  ? ELEMENT_COLORS[dayMaster.element] + '50'
                  : 'rgba(148,163,184,0.2)'}`,
                color: dayMaster ? ELEMENT_COLORS[dayMaster.element] : '#94a3b8',
                cursor: 'pointer', appearance: 'none',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Day Master...</option>
              {STEM_SEGMENTS.map(s => (
                <option key={s.index} value={s.index}>
                  {s.char} {s.english}
                </option>
              ))}
            </select>
            <span style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              fontSize: 9, color: '#64748b', pointerEvents: 'none',
            }}>
              ▼
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFloatingMd({ title: '📊 Hidden Stem Composition Table', content: buildCompositionMarkdown(), width: 1020 })}
            style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              cursor: 'pointer',
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
            }}
          >
            📊 Table
          </button>
          <Link to="/bazi-learning" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc', textDecoration: 'none',
          }}>
            ← BaZi Learning
          </Link>
          <Link to="/" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
            color: '#94a3b8', textDecoration: 'none',
          }}>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div style={{
        display: 'flex', gap: 20, padding: '20px 24px',
        maxWidth: 1400, margin: '0 auto',
      }}>
        {/* Left: Wheel */}
        <div ref={containerRef} style={{
          flex: '1 1 60%', minWidth: 320, display: 'flex',
          flexDirection: 'column', alignItems: 'center',
        }}>
          <BaZiBranchWheel
            dimensions={dimensions}
            branchArcs={branchArcs}
            hiddenStemArcs={hiddenStemArcs}
            seasonArcs={seasonArcs}
            stemWheelArcs={stemWheelArcs}
            selectedBranch={selectedBranch}
            hoveredBranch={hoveredBranch}
            highlightedElement={highlightedElement}
            highlightedSeason={highlightedSeason}
            currentYear={currentYear}
            onBranchClick={handleBranchClick}
            onBranchHover={handleBranchHover}
            onSeasonClick={handleSeasonClick}
            onHiddenStemHover={handleHiddenStemHover}
            onSeasonMarkerHover={handleSeasonMarkerHover}
            onStemNavigate={handleStemNavigate}
            pillarMode={pillarMode}
            lockedBranch={lockedBranch}
            monthLabels={monthLabels}
            dayLabels={dayLabels}
            hourLabels={hourLabels}
            spinTrigger={spinTrigger}
            pillarBranches={pillarBranches}
            onBallLand={(branchIdx, displayPos) => {
              setIsSpinning(false);
              setLuckyResult({ branchIndex: branchIdx, displayPos });
            }}
          />

          {/* Row 1: RESET + Lucky | Set Date | Year Month Day Hour */}
          <div style={{
            marginTop: 16, display: 'flex', flexWrap: 'wrap',
            gap: 6, justifyContent: 'center', alignItems: 'center',
          }}>
            {/* RESET */}
            {(() => {
              const hasState = !!(highlightedElement || highlightedSeason || selectedBranch !== null || currentYear !== 2026 || pillarMode !== 'off' || luckyResult);
              return (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer',
                    background: hasState ? 'rgba(239,68,68,0.15)' : 'rgba(30,41,59,0.4)',
                    border: `1px solid ${hasState ? 'rgba(239,68,68,0.4)' : 'rgba(148,163,184,0.15)'}`,
                    color: hasState ? '#f87171' : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  RESET
                </button>
              );
            })()}

            {/* Play Mode OFF — turn off pillar mode entirely */}
            {pillarMode !== 'off' && (
              <button
                type="button"
                onClick={() => { setPillarMode('off'); setLockedBranch(null); }}
                style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  cursor: 'pointer',
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc',
                  transition: 'all 0.15s',
                }}
              >
                Play Mode OFF
              </button>
            )}

            {/* Lucky — next to RESET */}
            {pillarMode !== 'off' && (
              <button
                type="button"
                disabled={isSpinning}
                onClick={() => { setIsSpinning(true); setLuckyResult(null); setSpinTrigger(c => c + 1); }}
                style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  cursor: isSpinning ? 'not-allowed' : 'pointer',
                  background: isSpinning
                    ? 'rgba(251,191,36,0.08)'
                    : luckyResult
                      ? 'rgba(251,191,36,0.22)'
                      : 'rgba(251,191,36,0.15)',
                  border: `1px solid rgba(251,191,36,${isSpinning ? '0.2' : '0.5'})`,
                  color: isSpinning ? '#a3873e' : '#fbbf24',
                  transition: 'all 0.3s',
                  opacity: isSpinning ? 0.6 : 1,
                }}
              >
                {isSpinning ? '🎱 Spinning...' : '🎰 Lucky'}
              </button>
            )}

            <span style={{ width: 1, background: 'rgba(148,163,184,0.2)', margin: '0 2px' }} />

            {/* Set Date/Time — inline */}
            {pillarMode !== 'off' && (<>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>Set Date</span>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                maxLength={10}
                value={dateFocused ? dateDraft : fmtDate(currentDate)}
                onFocus={() => { setDateDraft(fmtDate(currentDate)); setDateFocused(true); }}
                onBlur={() => {
                  setDateFocused(false);
                  // commit on blur if valid
                  const raw = dateDraft;
                  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                    const [y, m, d] = raw.split('-').map(Number);
                    if (y && m && d && y <= 9999 && m <= 12 && d <= 31) {
                      const next = new Date(currentDate);
                      next.setFullYear(y, m - 1, d);
                      if (next.getMonth() === m - 1 && next.getDate() === d) {
                        setCurrentDate(next);
                        setCurrentYear(y);
                      }
                    }
                  }
                }}
                onChange={e => {
                  const raw = e.target.value.replace(/[^\d-]/g, '');
                  setDateDraft(raw);
                  // live-commit when fully valid
                  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                    const [y, m, d] = raw.split('-').map(Number);
                    if (y && m && d && y <= 9999 && m <= 12 && d <= 31) {
                      const next = new Date(currentDate);
                      next.setFullYear(y, m - 1, d);
                      if (next.getMonth() === m - 1 && next.getDate() === d) {
                        setCurrentDate(next);
                        setCurrentYear(y);
                      }
                    }
                  }
                }}
                onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                style={{
                  padding: '3px 6px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: 'rgba(51,65,85,0.9)', color: '#fff',
                  border: '1px solid rgba(148,163,184,0.4)',
                  outline: 'none', cursor: 'text',
                  colorScheme: 'dark',
                  width: 90, textAlign: 'center', letterSpacing: '0.02em',
                }}
              />
              <input
                type="time"
                value={`${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`}
                onChange={e => {
                  const [h, min] = e.target.value.split(':').map(Number);
                  if (h == null || min == null) return;
                  const next = new Date(currentDate);
                  next.setHours(h, min);
                  setCurrentDate(next);
                }}
                style={{
                  padding: '3px 6px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: 'rgba(51,65,85,0.9)', color: '#fff',
                  border: '1px solid rgba(148,163,184,0.4)',
                  outline: 'none', cursor: 'pointer',
                  colorScheme: 'dark',
                }}
              />
              <button
                type="button"
                onClick={() => { const now = new Date(); setCurrentDate(now); setCurrentYear(now.getFullYear()); setLockedBranch(null); setSelectedBranch(null); }}
                style={{
                  padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                  cursor: 'pointer',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.35)',
                  color: '#4ade80',
                  transition: 'all 0.15s',
                }}
              >
                Today
              </button>
            </>)}

            <span style={{ width: 1, background: 'rgba(148,163,184,0.2)', margin: '0 2px' }} />

            {/* Pillar toggles — compact */}
            <button
              type="button"
              onClick={() => handlePillarModeToggle('year')}
              style={{
                padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: pillarMode === 'year' ? 'rgba(251,191,36,0.18)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${pillarMode === 'year' ? 'rgba(251,191,36,0.5)' : 'rgba(148,163,184,0.2)'}`,
                color: pillarMode === 'year' ? '#fbbf24' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              Year
            </button>
            <button
              type="button"
              onClick={() => handlePillarModeToggle('month')}
              style={{
                padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: pillarMode === 'month' ? 'rgba(20,184,166,0.18)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${pillarMode === 'month' ? 'rgba(20,184,166,0.5)' : 'rgba(148,163,184,0.2)'}`,
                color: pillarMode === 'month' ? '#2dd4bf' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => handlePillarModeToggle('day')}
              style={{
                padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: pillarMode === 'day' ? 'rgba(168,85,247,0.18)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${pillarMode === 'day' ? 'rgba(168,85,247,0.5)' : 'rgba(148,163,184,0.2)'}`,
                color: pillarMode === 'day' ? '#c084fc' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => handlePillarModeToggle('hour')}
              style={{
                padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: pillarMode === 'hour' ? 'rgba(244,114,182,0.18)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${pillarMode === 'hour' ? 'rgba(244,114,182,0.5)' : 'rgba(148,163,184,0.2)'}`,
                color: pillarMode === 'hour' ? '#f472b6' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              Hour
            </button>
          </div>

          {/* Cycle Jump row */}
          <div style={{
            marginTop: 6, display: 'flex', flexWrap: 'wrap',
            gap: 4, justifyContent: 'center', alignItems: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#94a3b8', marginRight: 2 }}>Cycle Jump:</span>
            {([
              { label: '-12yr', delta: { years: -12 } },
              { label: '+12yr', delta: { years: 12 } },
              { label: '-6yr',  delta: { years: -6 } },
              { label: '+6yr',  delta: { years: 6 } },
            ] as const).map(b => (
              <button key={b.label} type="button" onClick={() => {
                const next = shiftDateBy(currentDate, b.delta);
                setCurrentDate(next);
                setCurrentYear(next.getFullYear());
              }} style={{
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer', lineHeight: 1,
                background: 'rgba(100,116,139,0.1)',
                border: '1px solid rgba(100,116,139,0.25)',
                color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace",
                transition: 'background 0.15s, color 0.15s',
              }}>{b.label}</button>
            ))}
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
            {([
              { label: '-6mo', delta: { months: -6 } },
              { label: '+6mo', delta: { months: 6 } },
            ] as const).map(b => (
              <button key={b.label} type="button" onClick={() => {
                const next = shiftDateBy(currentDate, b.delta);
                setCurrentDate(next);
                setCurrentYear(next.getFullYear());
              }} style={{
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer', lineHeight: 1,
                background: 'rgba(100,116,139,0.1)',
                border: '1px solid rgba(100,116,139,0.25)',
                color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace",
                transition: 'background 0.15s, color 0.15s',
              }}>{b.label}</button>
            ))}
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
            {([
              { label: '-6day', delta: { days: -6 } },
              { label: '+6day', delta: { days: 6 } },
            ] as const).map(b => (
              <button key={b.label} type="button" onClick={() => {
                const next = shiftDateBy(currentDate, b.delta);
                setCurrentDate(next);
                setCurrentYear(next.getFullYear());
              }} style={{
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer', lineHeight: 1,
                background: 'rgba(100,116,139,0.1)',
                border: '1px solid rgba(100,116,139,0.25)',
                color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace",
                transition: 'background 0.15s, color 0.15s',
              }}>{b.label}</button>
            ))}
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
            {([
              { label: '-12hr', delta: { hours: -12 } },
              { label: '+12hr', delta: { hours: 12 } },
              { label: '-6hr',  delta: { hours: -6 } },
              { label: '+6hr',  delta: { hours: 6 } },
            ] as const).map(b => (
              <button key={b.label} type="button" onClick={() => {
                const next = shiftDateBy(currentDate, b.delta);
                setCurrentDate(next);
                setCurrentYear(next.getFullYear());
              }} style={{
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer', lineHeight: 1,
                background: 'rgba(100,116,139,0.1)',
                border: '1px solid rgba(100,116,139,0.25)',
                color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace",
                transition: 'background 0.15s, color 0.15s',
              }}>{b.label}</button>
            ))}
          </div>

          {/* Seasonality lens row — visible in any pillar mode */}
          {pillarMode !== 'off' && (
            <div style={{
              marginTop: 6, display: 'flex', flexWrap: 'wrap',
              gap: 4, justifyContent: 'center', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: '#94a3b8', marginRight: 2 }}>Seasonality:</span>
              {SEASONAL_LENSES.map(lens => (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => handleOpenLens(lens.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                    cursor: 'pointer',
                    background: 'rgba(116,185,255,0.12)',
                    border: '1px solid rgba(116,185,255,0.35)',
                    color: '#74b9ff',
                    transition: 'all 0.2s',
                  }}
                >
                  {lens.icon} {lens.label}
                </button>
              ))}
              <button type="button" onClick={handleOpenChronicleMd} title="Open full Gray Whale chronicle" style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(162,155,254,0.12)', border: '1px solid rgba(162,155,254,0.35)', color: '#a29bfe',
              }}>MD</button>
              <button type="button" onClick={handleImportMd} title="Import .md file" style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa',
              }}>Im</button>
              <button type="button" onClick={handleExportMd} disabled={!floatingMd} title="Export current MD" style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: floatingMd ? 'pointer' : 'default',
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
                color: floatingMd ? '#60a5fa' : '#4b5563', opacity: floatingMd ? 1 : 0.5,
              }}>Ex</button>
              <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
              <button type="button" onClick={handleOpenLifeCycle} title="Open Gray Whale Life Cycle chronicle" style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(255,159,67,0.12)', border: '1px solid rgba(255,159,67,0.35)', color: '#ff9f43',
              }}>🐣 Life Cycle</button>
              <button type="button" onClick={handleLcImport} title="Import Life Cycle .md" style={{
                padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(255,159,67,0.08)', border: '1px solid rgba(255,159,67,0.2)', color: '#e8983e',
              }}>Im</button>
              <button type="button" onClick={handleLcExport} disabled={!lifecycleMdRef.current} title="Export Life Cycle MD" style={{
                padding: '3px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                cursor: lifecycleMdRef.current ? 'pointer' : 'default',
                background: 'rgba(255,159,67,0.08)', border: '1px solid rgba(255,159,67,0.2)',
                color: lifecycleMdRef.current ? '#e8983e' : '#4b5563', opacity: lifecycleMdRef.current ? 1 : 0.5,
              }}>Ex</button>
              <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
              <Link to="/whale-migration" target="_blank" style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(116,185,255,0.12)', border: '1px solid rgba(116,185,255,0.35)', color: '#74b9ff',
              }}>🗺 Migration</Link>
              <input
                ref={mdFileInputRef}
                type="file"
                accept=".md,.txt,.markdown"
                title="Import markdown file"
                onChange={handleMdFileChange}
                style={{ display: 'none' }}
              />
              <input
                ref={lcFileInputRef}
                type="file"
                accept=".md,.txt,.markdown"
                title="Import Life Cycle markdown"
                onChange={handleLcFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {/* Row 2: Seasons then Elements */}
          <div style={{
            marginTop: 6, display: 'flex', flexWrap: 'wrap',
            gap: 8, justifyContent: 'center',
          }}>
            {/* Season buttons */}
            {SEASON_BUTTONS.map(btn => (
              <button
                key={btn.season}
                onClick={() => handleSeasonClick(btn.season)}
                style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: highlightedSeason === btn.season
                    ? btn.color + '30' : 'rgba(30,41,59,0.6)',
                  border: `1px solid ${highlightedSeason === btn.season
                    ? btn.color : 'rgba(148,163,184,0.2)'}`,
                  color: highlightedSeason === btn.season ? btn.color : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                {btn.label}
              </button>
            ))}

            <span style={{ width: 1, background: 'rgba(148,163,184,0.2)', margin: '0 4px' }} />

            {/* Element buttons */}
            {ELEMENT_BUTTONS.map(btn => (
              <button
                key={btn.element}
                onClick={() => handleElementToggle(btn.element)}
                style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  background: highlightedElement === btn.element
                    ? btn.color + '30' : 'rgba(30,41,59,0.6)',
                  border: `1px solid ${highlightedElement === btn.element
                    ? btn.color : 'rgba(148,163,184,0.2)'}`,
                  color: highlightedElement === btn.element ? btn.color : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div style={{
          flex: '1 1 35%', minWidth: 280, maxWidth: 400,
          background: 'rgba(15,23,42,0.6)', borderRadius: 12,
          border: '1px solid rgba(148,163,184,0.1)',
          padding: 20, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto',
        }}>
          {/* Pillar Mode locked branch banner */}
          {pillarMode !== 'off' && lockedBranchYear && lockedBranch !== null && (() => {
            const seg = BRANCH_SEGMENTS[lockedBranch];
            const elColor = ELEMENT_COLORS[lockedBranchYear.stemElement] || '#e2e8f0';
            const isMonth = lockedBranchYear.mode === 'month';
            const isDay = lockedBranchYear.mode === 'day';
            const accentColor = isDay ? '#c084fc' : isMonth ? '#2dd4bf' : '#fbbf24';
            const accentBg = isDay ? 'rgba(168,85,247,0.08)' : isMonth ? 'rgba(20,184,166,0.08)' : 'rgba(251,191,36,0.08)';
            const accentBorder = isDay ? 'rgba(168,85,247,0.3)' : isMonth ? 'rgba(20,184,166,0.3)' : 'rgba(251,191,36,0.3)';
            return (
              <div style={{
                marginBottom: 16, padding: '12px 16px', borderRadius: 10,
                background: accentBg,
                border: `1px solid ${accentBorder}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
                  🔒 LOCKED ON {seg?.animal.toUpperCase()} — {isDay ? 'DAY PILLAR' : isMonth ? 'MONTH PILLAR' : 'SPIN THE WHEEL'}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: elColor, letterSpacing: '-0.02em' }}>
                  {lockedBranchYear.ganZhi}
                </div>
                <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, marginTop: 2 }}>
                  {lockedBranchYear.english}
                </div>
                {isDay && 'dayLabel' in lockedBranchYear && (
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    {lockedBranchYear.dayLabel}
                  </div>
                )}
                {isMonth && 'startDate' in lockedBranchYear && (
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    {lockedBranchYear.startTermChinese} {lockedBranchYear.startDate}
                    {' → '}
                    {lockedBranchYear.endTermChinese} {lockedBranchYear.endDate}
                  </div>
                )}
                {!isMonth && !isDay && (
                  <div style={{
                    fontSize: 20, fontWeight: 800, color: accentColor, marginTop: 4,
                  }}>
                    {lockedBranchYear.year}
                  </div>
                )}
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                  Use ◀ ▶ arrows to cycle through {isDay ? 'days' : isMonth ? 'years' : '5 pillars'} for {seg?.animal}
                </div>
              </div>
            );
          })()}

          {hoveredMarker ? (
            <SeasonMarkerDetail season={hoveredMarker} />
          ) : activeSeg && activeArc ? (
            <BranchDetail
              seg={activeSeg}
              arc={activeArc}
              stems={activeStems}
              hoveredStem={hoveredStem}
              stemOffset={stemOffset}
              dayMaster={dayMaster}
            />
          ) : highlightedElement ? (
            <ElementDetail element={highlightedElement} />
          ) : highlightedSeason ? (
            <SeasonDetail season={highlightedSeason} />
          ) : (
            <DefaultPanel />
          )}
        </div>
      </div>

      {/* Seasonality floating window */}
      {floatingMd && (
        <FloatingMdWindow
          title={floatingMd.title}
          content={floatingMd.content}
          onClose={() => setFloatingMd(null)}
          width={floatingMd.width}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail sub-components
// ---------------------------------------------------------------------------

// Months by branch index (Tiger-start cycle)
const BRANCH_MONTHS = ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];
// Display order: Tiger (2) → Ox (1)
const TABLE_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

const EL_KEYS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

function buildCompositionMarkdown(): string {
  const rows = TABLE_ORDER.map(idx => {
    const seg = BRANCH_SEGMENTS[idx];
    const stems = HIDDEN_STEMS[idx] || [];
    const glyph = ANIMAL_GLYPHS[seg.animal as keyof typeof ANIMAL_GLYPHS] || '';
    const month = BRANCH_MONTHS[idx];
    const pctMap: Record<string, number> = {};
    for (const s of stems) pctMap[s.element] = (pctMap[s.element] || 0) + s.percentage;
    const stemStr = stems.map(s => `${s.char} ${s.element}`).join(', ');
    const elCols = EL_KEYS.map(k => `${pctMap[k] || 0}%`).join(' | ');
    return `| ${month} | ${seg.char} ${glyph} ${seg.animal} | ${stemStr} | ${elCols} |`;
  });

  return [
    '# Hidden Stem Elemental Composition',
    '',
    '| Month | Branch | Hidden Stems 藏干 | Wood | Fire | Earth | Metal | Water |',
    '|-------|--------|--------------------| ----:| ----:| -----:| -----:| -----:|',
    ...rows,
    '',
    '> These are the canonical values used in BaZi and shown in the wheel.',
  ].join('\n');
}

function DefaultPanel() {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', color: '#e2e8f0' }}>
        Study the Earthly Branches
      </h2>
      <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
        The <strong style={{ color: '#e2e8f0' }}>12 Earthly Branches (地支)</strong> form the
        foundation of the Chinese calendar and BaZi astrology. Each branch represents an animal,
        a season phase, and — crucially — contains <strong style={{ color: '#e2e8f0' }}>hidden stems (藏干)</strong> that
        determine its true elemental composition.
      </p>

      <div style={{
        marginTop: 16, padding: 12, borderRadius: 8,
        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <p style={{ fontSize: 11, color: '#a5b4fc', margin: 0, fontWeight: 600 }}>
          💡 How to read the wheel
        </p>
        <ul style={{ fontSize: 11, color: '#94a3b8', margin: '8px 0 0', paddingLeft: 16, lineHeight: 1.7 }}>
          <li><strong>Center ring:</strong> Heavenly Stems (天干) — ◀ ▶ arrows jump ±12 years</li>
          <li><strong>Animal ring:</strong> Earthly Branch names &amp; Chinese characters</li>
          <li><strong>Thin ring:</strong> Yin (陰) / Yang (陽) polarity</li>
          <li><strong>Thick colored ring:</strong> Hidden stems — proportional element composition</li>
          <li><strong>Outer ring:</strong> Season phases (Begin / Core / Transition)</li>
        </ul>
      </div>

      <div style={{
        marginTop: 12, padding: 12, borderRadius: 8,
        background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
      }}>
        <p style={{ fontSize: 11, color: '#4ade80', margin: 0, fontWeight: 600 }}>
          🎯 Key pattern
        </p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.6 }}>
          <strong>Core branches</strong> (Rabbit, Horse, Rooster, Rat) are <em>pure</em> — 100%
          single element. <strong>Transition branches</strong> (Dragon, Goat, Dog, Ox) contain
          3 hidden stems mixing the outgoing, current, and incoming elements.
        </p>
      </div>

      <p style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
        Click any branch to see full details. Use the element/season buttons below the wheel to filter.
      </p>
    </div>
  );
}

function BranchDetail({ seg, arc, stems, hoveredStem, stemOffset, dayMaster }: {
  seg: typeof BRANCH_SEGMENTS[number];
  arc: import('../utils/branchWheelData').BranchWheelArc;
  stems: import('../utils/branchWheelData').HiddenStemData[];
  hoveredStem: StemHoverInfo | null;
  stemOffset: number;
  dayMaster: { element: string; polarity: string; char: string; english: string } | null;
}) {
  const startTerm = getBranchSolarTerm(seg.index);
  const endTerm = getBranchEndTerm(seg.index);
  const scenarios = useMemo(() => buildDayPillarScenarios(seg.index), [seg.index]);
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  // Determine which heavenly stem is currently aligned with this branch
  const alignedStemIdx = getAlignedStemIndex(arc.displayPos, stemOffset);
  const alignedStem = STEM_SEGMENTS[alignedStemIdx];
  const alignedScenario = scenarios.find(sc => sc.stemIndex === alignedStemIdx);

  return (
    <div>
      {/* Solar term dates — first line */}
      {startTerm && endTerm && (
        <div style={{
          display: 'flex', gap: 8, marginBottom: 10, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(148,163,184,0.18)',
          fontSize: 13, color: '#e2e8f0', alignItems: 'center',
        }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <span>
            <strong style={{ color: '#fff' }}>{startTerm.termChinese}</strong>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}> ({startTerm.approxDate})</span>
          </span>
          <span style={{ color: '#cbd5e1', fontWeight: 700 }}>→</span>
          <span>
            <strong style={{ color: '#fff' }}>{endTerm.termChinese}</strong>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}> ({endTerm.approxDate})</span>
          </span>
        </div>
      )}

      {/* Aligned pairing header */}
      {alignedStem && alignedScenario && (
        <div style={{
          marginBottom: 10, padding: '10px 12px', borderRadius: 8,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 26, fontWeight: 700, color: '#e2e8f0', letterSpacing: 2,
            }}>
              {alignedScenario.ganZhi}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                {alignedScenario.pillarLabel}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                <span style={{ color: ELEMENT_COLORS[alignedStem.element] }}>{alignedStem.english}</span>
                {' | '}
                <span style={{ color: ELEMENT_COLORS[seg.element] }}>{arc.polarity} {seg.element} {seg.animal}</span>
              </div>
            </div>
          </div>
          {/* Mini element composition bar */}
          <div style={{ display: 'flex', gap: 1, height: 10, borderRadius: 5, overflow: 'hidden' }}>
            {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => alignedScenario.totals[el] > 0).map(el => (
              <div key={el} style={{
                flex: alignedScenario.totals[el],
                background: ELEMENT_COLORS[el],
              }} title={`${el} ${alignedScenario.totals[el].toFixed(1)}%`} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => alignedScenario.totals[el] > 0).map(el => (
              <span key={el} style={{ fontSize: 9, color: ELEMENT_COLORS[el], fontWeight: 600 }}>
                {el} {alignedScenario.totals[el].toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Branch header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 32 }}>{ANIMAL_GLYPHS[seg.animal]}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {seg.char} {seg.animal}
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
            {seg.pinyin} · {arc.polarity} · {arc.season} · {arc.phase}
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Purity badge */}
          {(() => {
            const purity = getBranchPurity(seg.index);
            const pColor = PURITY_COLORS[purity];
            return (
              <span style={{
                padding: '3px 8px', borderRadius: 6,
                background: pColor + '18',
                border: `1px solid ${pColor}40`,
                color: pColor,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
              }}>
                {purity}
              </span>
            );
          })()}
          {/* Element badge */}
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: ELEMENT_COLORS[seg.element] + '20',
            border: `1px solid ${ELEMENT_COLORS[seg.element]}40`,
            color: ELEMENT_COLORS[seg.element],
            fontSize: 11, fontWeight: 600,
          }}>
            {seg.element}
          </span>
        </div>
      </div>

      {/* Mythic story */}
      {(() => {
        const story = BRANCH_MYTHIC_STORIES[seg.index];
        if (!story) return null;
        return (
          <div style={{
            marginBottom: 12, padding: 14, borderRadius: 10,
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: '#c4b5fd',
              marginBottom: 8, letterSpacing: '-0.01em',
            }}>
              {story.title}
            </div>
            <p style={{
              fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.7,
              fontStyle: 'italic', fontFamily: "'Georgia', 'Times New Roman', serif",
            }}>
              {story.narrative}
            </p>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
              {story.keywords.map(kw => (
                <span key={kw} style={{
                  padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                  background: 'rgba(167,139,250,0.12)', color: '#a78bfa',
                  border: '1px solid rgba(167,139,250,0.2)',
                }}>
                  {kw}
                </span>
              ))}
            </div>
            <div style={{
              marginTop: 10, padding: '8px 10px', borderRadius: 6,
              background: 'rgba(15,23,42,0.4)', borderLeft: '3px solid rgba(99,102,241,0.4)',
            }}>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: '#a5b4fc' }}>Insight:</strong> {story.insight}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Hidden stems table */}
      <div style={{
        background: 'rgba(30,41,59,0.5)', borderRadius: 8,
        border: '1px solid rgba(148,163,184,0.1)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px', borderBottom: '1px solid rgba(148,163,184,0.1)',
          fontSize: 11, fontWeight: 700, color: '#94a3b8',
        }}>
          Hidden Stems 藏干
        </div>
        {stems.map((stem, idx) => {
          const isHovered = hoveredStem?.branchIndex === seg.index
            && hoveredStem?.stemIndex === idx;
          const tenGod = dayMaster
            ? getTenGod(dayMaster.element, dayMaster.polarity, stem.element, stem.polarity)
            : null;
          return (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
              borderBottom: idx < stems.length - 1 ? '1px solid rgba(148,163,184,0.05)' : undefined,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 6, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: ELEMENT_COLORS[stem.element] + '25',
                border: `1px solid ${ELEMENT_COLORS[stem.element]}50`,
                color: ELEMENT_COLORS[stem.element],
                fontSize: 14, fontWeight: 700,
              }}>
                {stem.char}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                  {stem.polarity} {stem.element}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>
                  {getStemTypeLabel(idx)}
                </div>
                {tenGod && (
                  <div style={{
                    fontSize: 10, fontWeight: 600, marginTop: 2,
                    color: RELATION_COLORS[tenGod.category.toLowerCase()] || '#94a3b8',
                  }}>
                    {tenGod.chinese} {tenGod.english}
                  </div>
                )}
              </div>
              {/* Percentage bar */}
              <div style={{ width: 100, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  flex: 1, height: 8, borderRadius: 4,
                  background: 'rgba(30,41,59,0.8)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${stem.percentage}%`, height: '100%',
                    background: ELEMENT_COLORS[stem.element],
                    borderRadius: 4,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: ELEMENT_COLORS[stem.element], minWidth: 32, textAlign: 'right' }}>
                  {stem.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden stem story — shown when hovering a sub-arc with Day Master set */}
      {hoveredStem && dayMaster && hoveredStem.branchIndex === seg.index && (() => {
        const stem = stems[hoveredStem.stemIndex];
        if (!stem) return null;
        const storyText = buildHiddenStemStory(stem, dayMaster.element, dayMaster.polarity, arc.season);
        return (
          <div style={{
            marginTop: 10, padding: 12, borderRadius: 8,
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', marginBottom: 6, letterSpacing: '0.05em' }}>
              HIDDEN STEM STORY — {stem.char} {ELEMENT_GLYPHS[stem.element]} vs {dayMaster.char} Day Master
            </div>
            <pre style={{
              fontSize: 11, color: '#cbd5e1', margin: 0, lineHeight: 1.7,
              whiteSpace: 'pre-wrap', fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              {storyText}
            </pre>
          </div>
        );
      })()}

      {/* Seasonal strength bars */}
      <div style={{
        marginTop: 12, background: 'rgba(30,41,59,0.5)', borderRadius: 8,
        border: '1px solid rgba(148,163,184,0.1)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px', borderBottom: '1px solid rgba(148,163,184,0.1)',
          fontSize: 11, fontWeight: 700, color: '#94a3b8',
        }}>
          Seasonal Strength 旺相休囚 <span style={{ fontWeight: 400 }}>— {arc.season}</span>
        </div>
        <div style={{ padding: '8px 12px' }}>
          {buildSeasonalStrengthBars(seg.index).map(bar => {
            const isNative = bar.element === seg.element;
            return (
              <div key={bar.element} style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5,
                padding: isNative ? '2px 4px' : '0 4px',
                borderRadius: 4,
                background: isNative ? ELEMENT_COLORS[bar.element] + '0a' : 'transparent',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: ELEMENT_COLORS[bar.element],
                  width: 38, flexShrink: 0,
                }}>
                  {ELEMENT_GLYPHS[bar.element]} {bar.element.slice(0, 2)}
                </span>
                <div style={{
                  flex: 1, height: 10, borderRadius: 5,
                  background: 'rgba(30,41,59,0.8)', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${bar.strength * 100}%`, height: '100%',
                    background: ELEMENT_COLORS[bar.element],
                    borderRadius: 5,
                    opacity: isNative ? 1 : 0.7,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, minWidth: 72, textAlign: 'right',
                  color: bar.strength >= 0.8 ? ELEMENT_COLORS[bar.element] : '#94a3b8',
                }}>
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season phase explanation */}
      <div style={{
        marginTop: 12, padding: 10, borderRadius: 8,
        background: (SEASON_COLORS[arc.season] || '#666') + '10',
        border: `1px solid ${(SEASON_COLORS[arc.season] || '#666')}25`,
      }}>
        <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: SEASON_COLORS[arc.season] || '#e2e8f0' }}>
            {arc.season} · {arc.phase}
          </strong>
          {' — '}
          {arc.phase === 'Beginning' && `${seg.element} energy begins rising. Like Cardinal signs in Western astrology — initiating the season's force.`}
          {arc.phase === 'Core' && `Peak ${seg.element} expression. Pure element — 100% single hidden stem. Like Fixed signs — the season's full power.`}
          {arc.phase === 'Transition' && `${seg.element} energy shifts. Contains remnants of the passing season, current energy, and seeds of the next. Like Mutable signs — adaptable, complex.`}
        </p>
      </div>

      {/* Hidden Stem Polarity Pattern */}
      {(() => {
        const phase = arc.phase;
        const branchPol = arc.polarity;
        const stemPol = phase === 'Beginning' ? 'Yang' : phase === 'Core' ? 'Yin' : null;
        const phaseEmoji = phase === 'Beginning' ? '⚡' : phase === 'Core' ? '💎' : '🔄';
        const phaseChinese = phase === 'Beginning' ? '四生' : phase === 'Core' ? '四旺' : '四墓';
        const phaseEnglish = phase === 'Beginning' ? 'Four Growth' : phase === 'Core' ? 'Four Prosperous' : 'Four Tomb';

        const beginningBranches = [
          { char: '寅', animal: 'Tiger', pol: 'Yang' },
          { char: '巳', animal: 'Snake', pol: 'Yin' },
          { char: '申', animal: 'Monkey', pol: 'Yang' },
          { char: '亥', animal: 'Pig', pol: 'Yin' },
        ];
        const coreBranches = [
          { char: '卯', animal: 'Rabbit', pol: 'Yin' },
          { char: '午', animal: 'Horse', pol: 'Yang' },
          { char: '酉', animal: 'Rooster', pol: 'Yin' },
          { char: '子', animal: 'Rat', pol: 'Yang' },
        ];
        const transitionBranches = [
          { char: '辰', animal: 'Dragon', pol: 'Yang' },
          { char: '未', animal: 'Goat', pol: 'Yin' },
          { char: '戌', animal: 'Dog', pol: 'Yang' },
          { char: '丑', animal: 'Ox', pol: 'Yin' },
        ];

        const rows = [
          { label: 'Beginning', chinese: '四生', stems: 'All Yang', branches: beginningBranches, active: phase === 'Beginning' },
          { label: 'Core', chinese: '四旺', stems: 'All Yin', branches: coreBranches, active: phase === 'Core' },
          { label: 'Transition', chinese: '四墓', stems: 'Follows branch', branches: transitionBranches, active: phase === 'Transition' },
        ];

        return (
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 8,
            background: 'rgba(167,139,250,0.06)',
            border: '1px solid rgba(167,139,250,0.18)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', marginBottom: 8 }}>
              {phaseEmoji} Hidden Stem Polarity Pattern — {phaseChinese} {phaseEnglish}
            </div>

            {/* Explanation for this branch's phase */}
            <p style={{ fontSize: 11, color: '#cbd5e1', margin: '0 0 10px', lineHeight: 1.6 }}>
              {phase === 'Beginning' && (
                <>
                  <strong style={{ color: '#fbbf24' }}>Beginning</strong> branches mark where seasonal energy <em>erupts</em> — an outward, expansive force. All hidden stems are <strong style={{ color: '#fbbf24' }}>Yang</strong>, regardless of the branch's own polarity.
                  {branchPol === 'Yin' && (
                    <span style={{ color: '#94a3b8' }}> {seg.char} {seg.animal} is a Yin branch, yet its hidden stems ({stems.map(s => s.char).join(', ')}) are all Yang — this is the eruption pattern.</span>
                  )}
                </>
              )}
              {phase === 'Core' && (
                <>
                  <strong style={{ color: '#60a5fa' }}>Core</strong> branches are the season's peak — energy refined and consolidated. All hidden stems are <strong style={{ color: '#60a5fa' }}>Yin</strong>, regardless of the branch's own polarity.
                  {branchPol === 'Yang' && (
                    <span style={{ color: '#94a3b8' }}> {seg.char} {seg.animal} is a Yang branch, yet its hidden stem ({stems.map(s => s.char).join(', ')}) is Yin — this is the refinement pattern.</span>
                  )}
                </>
              )}
              {phase === 'Transition' && (
                <>
                  <strong style={{ color: '#f97316' }}>Transition</strong> branches store the outgoing season's remnants. Their hidden stem polarity <strong style={{ color: '#f97316' }}>follows the branch's own polarity</strong> — {branchPol} branches contain {branchPol} stems.
                </>
              )}
            </p>

            {/* Mini reference table */}
            <div style={{
              borderRadius: 6, overflow: 'hidden',
              border: '1px solid rgba(148,163,184,0.1)',
            }}>
              {rows.map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px',
                  background: row.active ? 'rgba(167,139,250,0.1)' : 'rgba(15,23,42,0.3)',
                  borderBottom: '1px solid rgba(148,163,184,0.06)',
                  borderLeft: row.active ? '3px solid #a78bfa' : '3px solid transparent',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: row.active ? '#e2e8f0' : '#94a3b8', width: 68 }}>
                    {row.label} <span style={{ fontWeight: 400, color: '#64748b' }}>{row.chinese}</span>
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b', width: 80 }}>
                    {row.stems}
                  </span>
                  <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                    {row.branches.map(b => (
                      <span key={b.char} style={{
                        fontSize: 10, fontWeight: b.char === seg.char ? 700 : 400,
                        color: b.char === seg.char ? '#e2e8f0' : '#64748b',
                        padding: '1px 4px', borderRadius: 3,
                        background: b.char === seg.char ? 'rgba(167,139,250,0.2)' : 'transparent',
                      }}>
                        {b.char}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Day Pillar Calculation Scenarios */}
      <div style={{
        marginTop: 14, background: 'rgba(30,41,59,0.5)', borderRadius: 8,
        border: '1px solid rgba(148,163,184,0.1)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px', borderBottom: '1px solid rgba(148,163,184,0.1)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>
            📊 Day Pillar Composition — 5 Scenarios
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
            Heavenly Stem = 1/11 (9.09%) · Earthly Branch = 10/11 (90.91%) · Before seasonality
          </div>
        </div>

        {scenarios.map((sc, idx) => {
          const isAligned = sc.stemIndex === alignedStemIdx;
          const isExpanded = expandedScenario === idx || (expandedScenario === null && isAligned);
          return (
            <div key={sc.stemIndex}>
              {/* Scenario header — clickable */}
              <button
                type="button"
                onClick={() => setExpandedScenario(isExpanded ? -1 : idx)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 12px', cursor: 'pointer',
                  background: isAligned
                    ? 'rgba(99,102,241,0.12)'
                    : isExpanded ? 'rgba(99,102,241,0.06)' : 'transparent',
                  border: 'none', borderBottom: '1px solid rgba(148,163,184,0.05)',
                  borderLeft: isAligned ? '3px solid #a5b4fc' : '3px solid transparent',
                  textAlign: 'left', color: '#e2e8f0', fontFamily: 'inherit',
                }}
              >
                {/* Stem badge */}
                <span style={{
                  width: 24, height: 24, borderRadius: 5, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: ELEMENT_COLORS[sc.stemElement] + '25',
                  border: `1px solid ${ELEMENT_COLORS[sc.stemElement]}50`,
                  color: ELEMENT_COLORS[sc.stemElement],
                  fontSize: 13, fontWeight: 700,
                }}>
                  {sc.stemChar}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>
                    {sc.ganZhi} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{sc.pillarLabel}</span>
                  </div>
                </div>
                {/* Mini element bar */}
                <div style={{ display: 'flex', gap: 1, height: 10, width: 60, borderRadius: 3, overflow: 'hidden' }}>
                  {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => sc.totals[el] > 0).map(el => (
                    <div key={el} style={{
                      flex: sc.totals[el],
                      background: ELEMENT_COLORS[el],
                    }} title={`${el} ${sc.totals[el].toFixed(1)}%`} />
                  ))}
                </div>
                <span style={{ fontSize: 10, color: '#64748b' }}>{isExpanded ? '▲' : '▼'}</span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <ScenarioDetail scenario={sc} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Expanded calculation detail for a single Day Pillar scenario */
function ScenarioDetail({ scenario }: { scenario: DayPillarScenario }) {
  const sc = scenario;
  return (
    <div style={{
      padding: '8px 12px 12px', background: 'rgba(15,23,42,0.4)',
      borderBottom: '1px solid rgba(148,163,184,0.08)',
    }}>
      {/* Calculation table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ color: '#94a3b8' }}>
            <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: 700 }}>Source</th>
            <th style={{ textAlign: 'center', padding: '4px 4px', fontWeight: 700 }}>Char</th>
            <th style={{ textAlign: 'left', padding: '4px 4px', fontWeight: 700 }}>Element</th>
            <th style={{ textAlign: 'right', padding: '4px 4px', fontWeight: 700 }}>Calc</th>
            <th style={{ textAlign: 'right', padding: '4px 4px', fontWeight: 700 }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {sc.breakdown.map((row, i) => (
            <tr key={i} style={{
              borderTop: i === 1 ? '1px solid rgba(148,163,184,0.15)' : undefined,
            }}>
              <td style={{
                padding: '4px', color: i === 0 ? '#f1f5f9' : '#cbd5e1',
                fontSize: i === 0 ? 11 : 10, fontWeight: 600,
              }}>
                {i === 0 ? '天干 Stem' : `藏干 ${getStemTypeLabel(i - 1).split(' ')[0]}`}
              </td>
              <td style={{
                textAlign: 'center', padding: '4px',
                color: ELEMENT_COLORS[row.element], fontWeight: 700, fontSize: 13,
              }}>
                {row.char}
              </td>
              <td style={{ padding: '4px', color: ELEMENT_COLORS[row.element], fontSize: 11, fontWeight: 600 }}>
                {row.element}
              </td>
              <td style={{ textAlign: 'right', padding: '4px', color: '#cbd5e1', fontSize: 10, fontFamily: 'monospace' }}>
                {row.calculation}
              </td>
              <td style={{
                textAlign: 'right', padding: '4px',
                color: ELEMENT_COLORS[row.element], fontWeight: 700, fontSize: 11,
              }}>
                {row.finalPct.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Divider */}
      <div style={{
        height: 1, background: 'rgba(148,163,184,0.15)', margin: '6px 0',
      }} />

      {/* Final element totals */}
      <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 700, marginBottom: 6 }}>
        Final Element Composition
      </div>
      {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => sc.totals[el] > 0).map(el => (
        <div key={el} style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
        }}>
          <span style={{
            fontSize: 10, color: ELEMENT_COLORS[el], fontWeight: 700, width: 38,
          }}>
            {el}
          </span>
          <div style={{
            flex: 1, height: 12, borderRadius: 6,
            background: 'rgba(30,41,59,0.8)', overflow: 'hidden',
          }}>
            <div style={{
              width: `${sc.totals[el]}%`, height: '100%',
              background: ELEMENT_COLORS[el],
              borderRadius: 6,
              transition: 'width 0.3s',
            }} />
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, color: ELEMENT_COLORS[el],
            minWidth: 42, textAlign: 'right', fontFamily: 'monospace',
          }}>
            {sc.totals[el].toFixed(1)}%
          </span>
        </div>
      ))}

      <div style={{
        marginTop: 6, fontSize: 10, color: '#94a3b8', fontStyle: 'italic',
      }}>
        Before seasonality adjustment ({sc.pillarLabel})
      </div>
    </div>
  );
}

function ElementDetail({ element }: { element: string }) {
  // Find all branches containing this element in hidden stems
  const matching = BRANCH_SEGMENTS.map((seg, idx) => {
    const stems = HIDDEN_STEMS[idx] || [];
    const found = stems.filter(s => s.element === element);
    return found.length > 0 ? { seg, stems: found, total: found.reduce((s, f) => s + f.percentage, 0) } : null;
  }).filter(Boolean) as { seg: typeof BRANCH_SEGMENTS[number]; stems: any[]; total: number }[];

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: ELEMENT_COLORS[element] }}>
        {element} Element Across Branches
      </h2>
      <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 14px' }}>
        {matching.length} of 12 branches contain {element} in their hidden stems.
      </p>
      {matching.sort((a, b) => b.total - a.total).map(({ seg, stems, total }) => (
        <div key={seg.index} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', marginBottom: 6, borderRadius: 6,
          background: 'rgba(30,41,59,0.4)',
          border: '1px solid rgba(148,163,184,0.08)',
        }}>
          <span style={{ fontSize: 14 }}>{ANIMAL_GLYPHS[seg.animal]}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', flex: 1 }}>
            {seg.char} {seg.animal}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: ELEMENT_COLORS[element] }}>
            {total}%
          </span>
        </div>
      ))}
    </div>
  );
}

function SeasonMarkerDetail({ season }: { season: string }) {
  const marker = SEASON_MARKERS.find(m => m.season === season);
  if (!marker) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{marker.icon}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: marker.color }}>
            {marker.termChinese} {marker.termEnglish}
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
            {marker.termPinyin} · {marker.season} Begins
          </p>
        </div>
      </div>

      {/* Key facts */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12,
      }}>
        <div style={{
          padding: '6px 10px', borderRadius: 6,
          background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.08)',
        }}>
          <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>Sun Longitude</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{marker.longitude}°</div>
        </div>
        <div style={{
          padding: '6px 10px', borderRadius: 6,
          background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.08)',
        }}>
          <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>2026 Date</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{marker.approxDate}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        padding: 10, borderRadius: 8, marginBottom: 10,
        background: marker.color + '10', border: `1px solid ${marker.color}25`,
      }}>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: marker.color }}>How it's calculated:</strong>{' '}
          {marker.description}
        </p>
      </div>

      {/* Significance */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
      }}>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#a5b4fc' }}>Significance:</strong>{' '}
          {marker.significance}
        </p>
      </div>

      {/* Comparison with Western */}
      <div style={{
        marginTop: 10, padding: 10, borderRadius: 8,
        background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(148,163,184,0.08)',
      }}>
        <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#94a3b8' }}>Chinese vs Western:</strong>{' '}
          Chinese seasons begin ~45 days before Western equinoxes/solstices. The Western
          {' '}{marker.season === 'Spring' ? 'Spring Equinox (Mar 20)' :
                marker.season === 'Summer' ? 'Summer Solstice (Jun 21)' :
                marker.season === 'Autumn' ? 'Autumn Equinox (Sep 23)' :
                'Winter Solstice (Dec 21)'}{' '}
          marks what Chinese astronomy considers the <em>peak</em> (Core phase), not the beginning.
        </p>
      </div>
    </div>
  );
}

function SeasonDetail({ season }: { season: string }) {
  const branches = BRANCH_SEGMENTS.filter(s => s.season === season);
  const phases = ['Beginning', 'Core', 'Transition'];

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: SEASON_COLORS[season] }}>
        {season} Season
      </h2>
      <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 14px' }}>
        Three branches form the {season} season — each in a different phase.
      </p>
      {branches.map((seg, i) => {
        const stems = HIDDEN_STEMS[seg.index] || [];
        return (
          <div key={seg.index} style={{
            padding: 10, marginBottom: 8, borderRadius: 8,
            background: 'rgba(30,41,59,0.4)',
            border: '1px solid rgba(148,163,184,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{ANIMAL_GLYPHS[seg.animal]}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                {seg.char} {seg.animal}
              </span>
              <span style={{
                fontSize: 9, padding: '2px 6px', borderRadius: 4,
                background: 'rgba(148,163,184,0.1)',
                color: '#94a3b8', fontWeight: 600,
              }}>
                {phases[i]}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 2, height: 10, borderRadius: 5, overflow: 'hidden' }}>
              {stems.map((stem, idx) => (
                <div key={idx} style={{
                  flex: stem.percentage, background: ELEMENT_COLORS[stem.element],
                  borderRadius: idx === 0 ? '5px 0 0 5px' : idx === stems.length - 1 ? '0 5px 5px 0' : 0,
                }} title={`${stem.char} ${stem.element} ${stem.percentage}%`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {stems.map((stem, idx) => (
                <span key={idx} style={{ fontSize: 9, color: ELEMENT_COLORS[stem.element] }}>
                  {stem.char} {stem.percentage}%
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
