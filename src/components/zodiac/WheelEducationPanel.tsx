/**
 * WheelEducationPanel.tsx
 *
 * Educational panel for studying the Tropical Zodiac wheel from outside in.
 * Correct ring sequence: Seasons → Modalities → Elements → Signs
 *
 * Extracted from Brother Sonnet's comprehensive documentation.
 */

import './WheelEducationPanel.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  WHEEL_LAYERS,
  SEASON_WISDOM,
  ELEMENT_EDUCATION,
  MODALITY_EDUCATION,
  SIGN_SEASONAL_MEANINGS,
  SUMMARY_TABLE,
  SEASONAL_SUMMARY_TABLE,
  SEASON_COLORS,
  SEASONAL_ABSENCE_INSIGHTS,
  ELEMENT_SEASON_PRESENCE,
  type Season,
  type SeasonalSignCell,
} from '../../data/tropicalConstants';
import {
  ElementFlowTimeline,
  SeasonalResonancePanel,
  HomeChallengeCard,
} from './ElementFlowTimeline';
import { useWheelMode } from '../../seasonal-ecology';

// =============================================================================
// TYPES
// =============================================================================

type EducationTab = 'overview' | 'seasons' | 'modalities' | 'elements' | 'signs' | 'aspects';

interface WheelEducationPanelProps {
  onOpenTableFlap?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const WheelEducationPanel: React.FC<WheelEducationPanelProps> = ({ onOpenTableFlap }) => {
  const [activeTab, setActiveTab] = useState<EducationTab>('overview');
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);

  // Sync with wheel mode context
  let wheelModeContext: ReturnType<typeof useWheelMode> | null = null;
  try {
    wheelModeContext = useWheelMode();
  } catch {
    // Not wrapped in WheelModeProvider
  }

  // Handle tab click - also sync wheel mode
  const handleTabClick = (tabId: EducationTab) => {
    setActiveTab(tabId);

    // Sync wheel ring highlight with tab
    if (wheelModeContext) {
      switch (tabId) {
        case 'seasons':
          wheelModeContext.transitionTo('seasons');
          break;
        case 'modalities':
          wheelModeContext.transitionTo('modality');
          break;
        case 'elements':
          wheelModeContext.transitionTo('elements');
          break;
        case 'signs':
          wheelModeContext.transitionTo('signs');
          break;
        default:
          wheelModeContext.transitionTo('default');
          break;
      }
    }
  };

  return (
    <div className="wheel-education-panel">
      <div className="education-header">
        <div className="education-header-left">
          <h3 className="education-title-gold">Study the Zodiac Signs Wheel</h3>
          <p className="education-subtitle">From Outside In</p>
        </div>
        {/* Table button moved to header */}
        <button
          type="button"
          className="header-table-btn"
          onClick={() => onOpenTableFlap?.()}
          title="Open Summary Table (larger view)"
        >
          <span className="table-btn-icon">📊</span>
          <span className="table-btn-label">Table</span>
          <span className="table-btn-arrow">↗</span>
        </button>
      </div>

      {/* Tab Navigation - Correct ring sequence: Seasons → Modality → Elements → Signs → Aspects */}
      <div className="education-tabs">
        {[
          { id: 'overview', label: 'Guide', icon: '📖' },
          { id: 'seasons', label: 'Seasons', icon: '🌍' },
          { id: 'modalities', label: 'Modalities', icon: '⚡' },
          { id: 'elements', label: 'Elements', icon: '🔥' },
          { id: 'signs', label: 'Signs', icon: '✨' },
          { id: 'aspects', label: 'Aspects', icon: '△' },
        ].map(({ id, label, icon }) => (
          <button
            type="button"
            key={id}
            className={`education-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => handleTabClick(id as EducationTab)}
          >
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </div>

      <div className="education-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab />
        )}

        {/* Seasons Tab */}
        {activeTab === 'seasons' && (
          <SeasonsTab
            selectedSeason={selectedSeason}
            onSelectSeason={setSelectedSeason}
          />
        )}

        {/* Modalities Tab - Now Ring 2 */}
        {activeTab === 'modalities' && (
          <ModalitiesTab
            selectedModality={selectedModality}
            onSelectModality={setSelectedModality}
          />
        )}

        {/* Elements Tab - Now Ring 3 */}
        {activeTab === 'elements' && (
          <ElementsTab
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
          />
        )}

        {/* Signs Tab - Now Ring 4 */}
        {activeTab === 'signs' && (
          <SignsTab />
        )}

        {/* Aspects Tab - Geometric relationships */}
        {activeTab === 'aspects' && (
          <AspectsTab />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// OVERVIEW TAB
// =============================================================================

const OverviewTab: React.FC = () => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  return (
    <div className="overview-tab">
      <div className="overview-intro">
        <h4>Understanding Your Constitutional Blueprint</h4>
        <p>
          The zodiac wheel is a map of Earth's yearly journey around the Sun—but more importantly,
          it's a <strong>map of you</strong>. Think of it like reading a tree's rings: each layer
          tells you something different about when and how you came into the world.
        </p>
      </div>

      <div className="layer-cards">
        {WHEEL_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={`layer-card ${expandedLayer === layer.id ? 'expanded' : ''}`}
            onClick={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
          >
            <div className="layer-header">
              <span className="layer-ring">Ring {layer.ring}</span>
              <span className="layer-icon">{layer.icon}</span>
              <span className="layer-name">{layer.name}</span>
              <span className="expand-indicator">{expandedLayer === layer.id ? '−' : '+'}</span>
            </div>
            <p className="layer-tagline">{layer.tagline}</p>
            <p className="layer-description">{layer.description}</p>
            <div className="layer-question">
              <span className="question-icon">?</span>
              <span className="question-text">{layer.keyQuestion}</span>
            </div>

            {/* Expanded content */}
            {expandedLayer === layer.id && (
              <div className="layer-expanded">
                <div className="expanded-section">
                  <span className="expanded-label">How It Relates to You</span>
                  <p className="expanded-content">{layer.howItRelates}</p>
                </div>
                <div className="expanded-section">
                  <span className="expanded-label">How to Use This</span>
                  <p className="expanded-content">{layer.howToUse}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="overview-summary">
        <h4>The Key Insight</h4>
        <p className="key-insight">
          "In Tropical Astrology, personality is shaped by the season of light you were born into."
        </p>
        <p>
          This isn't fortune-telling. It's <strong>constitutional psychology</strong>—understanding
          the environmental imprint that shaped your core operating system.
        </p>
        <div className="formula-box">
          <span className="formula">Sign = Season + Element + Modality</span>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SEASONS TAB
// =============================================================================

interface SeasonsTabProps {
  selectedSeason: string | null;
  onSelectSeason: (season: string | null) => void;
}

/** Build seasons markdown string (shared by export + floating viewer) */
function buildSeasonsMd(): string {
  const lines: string[] = ['# The Four Survival Imperatives', ''];
  for (const s of Object.values(SEASON_WISDOM)) {
    lines.push(`## ${s.icon} ${s.season} — ${s.title}`, '');
    lines.push(`**Core Mantra:** ${s.coreMantra}`, '');
    lines.push(`**Survival Imperative:** ${s.survivalImperative}`, '');
    lines.push(`**Light Cycle:** ${s.lightCycle}`, '');
    lines.push('### Environmental Reality');
    for (const item of s.environmentalReality) lines.push(`- ${item}`);
    lines.push('');
    lines.push(`**How It Relates to You:** ${s.howItRelates}`, '');
    lines.push(`**How to Use This:** ${s.howToUse}`, '');
    lines.push(`### The ${s.season} Journey`);
    lines.push(`- **Beginning:** ${s.threeActStructure.beginning}`);
    lines.push(`- **Core:** ${s.threeActStructure.core}`);
    lines.push(`- **Transition:** ${s.threeActStructure.transition}`);
    lines.push('');
    lines.push(`**Signs:** ${s.signs.join(', ')}`, '');
    lines.push('---', '');
  }
  return lines.join('\n');
}

/** Floating draggable MD reader window */
const FloatingMdWindow: React.FC<{
  content: string;
  title: string;
  onClose: () => void;
}> = ({ content, title, onClose }) => {
  const [pos, setPos] = useState({ x: 900, y: 170 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };

  // Intercept anchor link clicks to scroll within the floating body
  const handleBodyClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const id = target.getAttribute('href')!.slice(1);
      const el = bodyRef.current?.querySelector(`[id="${id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return ReactDOM.createPortal(
    <div className="floating-md-window" style={{ left: pos.x, top: pos.y }}>
      <div className="floating-md-titlebar" onMouseDown={handleDragStart}>
        <span className="floating-md-title">{title}</span>
        <button className="floating-md-close" onClick={onClose}>&times;</button>
      </div>
      <div className="floating-md-body" ref={bodyRef} onClick={handleBodyClick}>
        {renderMarkdownText(content)}
      </div>
    </div>,
    document.body,
  );
};

const SEASONS_MD_DOC = doc(db, 'global_config', 'seasons_md');

const SeasonsTab: React.FC<SeasonsTabProps> = ({ selectedSeason, onSelectSeason }) => {
  const seasons = Object.values(SEASON_WISDOM);
  const selected = selectedSeason ? SEASON_WISDOM[selectedSeason] : null;
  const [mdContent, setMdContent] = useState<string>('');
  const [floatingMd, setFloatingMd] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved MD from Firestore on mount
  useEffect(() => {
    getDoc(SEASONS_MD_DOC).then(snap => {
      if (snap.exists()) {
        const saved = snap.data().content;
        if (typeof saved === 'string' && saved) setMdContent(saved);
      }
    }).catch(() => {});
  }, []);

  const handleImportMd = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setMdContent(text);
        setFloatingMd(text);
        // Persist to Firestore
        setDoc(SEASONS_MD_DOC, { content: text, updatedAt: new Date().toISOString() })
          .catch(() => {});
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  }, []);

  const handleExportMd = useCallback(() => {
    const md = buildSeasonsMd();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seasons-wisdom.md';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleSeasonsMd = useCallback(() => {
    if (mdContent) setFloatingMd(mdContent);
  }, [mdContent]);

  return (
    <div className="seasons-tab">
      <div className="seasons-intro">
        <h4>The Four Survival Imperatives</h4>
        <p>
          The outer ring shows <strong>Earth's relationship with the Sun</strong>—the cosmic clock
          that determines when you were born and what survival imperative shaped your psychology.
        </p>
      </div>

      {/* Season Selector */}
      <div className="season-selector">
        {seasons.map((season) => (
          <button
            key={season.season}
            className={`season-button ${selectedSeason === season.season ? 'selected' : ''}`}
            style={{
              borderColor: season.color,
              background: selectedSeason === season.season ? `${season.color}20` : 'transparent',
            }}
            onClick={() => onSelectSeason(selectedSeason === season.season ? null : season.season)}
          >
            <span className="season-icon">{season.icon}</span>
            <span className="season-name">{season.season}</span>
          </button>
        ))}
      </div>

      {/* Season Detail */}
      {selected ? (
        <div className="season-detail" style={{ borderColor: selected.color }}>
          <div className="detail-header">
            <span className="detail-icon">{selected.icon}</span>
            <div className="detail-titles">
              <h4>{selected.season}</h4>
              <span className="detail-subtitle">{selected.title}</span>
            </div>
          </div>

          <div className="mantra-box" style={{ borderColor: selected.color }}>
            <span className="mantra-text">{selected.coreMantra}</span>
          </div>

          <div className="detail-section">
            <span className="section-label">Survival Imperative</span>
            <p className="section-content">{selected.survivalImperative}</p>
          </div>

          <div className="detail-section">
            <span className="section-label">Light Cycle</span>
            <p className="section-content">{selected.lightCycle}</p>
          </div>

          {/* Environmental Reality */}
          <div className="detail-section">
            <span className="section-label">Environmental Reality</span>
            <ul className="reality-list">
              {selected.environmentalReality.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* How It Relates */}
          <div className="detail-section highlight">
            <span className="section-label">How It Relates to You</span>
            <p className="section-content">{selected.howItRelates}</p>
          </div>

          {/* How to Use */}
          <div className="detail-section highlight">
            <span className="section-label">How to Use This</span>
            <p className="section-content">{selected.howToUse}</p>
          </div>

          {/* Three Act Structure */}
          <div className="three-act-section">
            <span className="section-label">The {selected.season} Journey</span>
            <div className="three-acts">
              <div className="act-card">
                <span className="act-phase">▶ Beginning</span>
                <p>{selected.threeActStructure.beginning}</p>
              </div>
              <div className="act-card">
                <span className="act-phase">⏺ Core</span>
                <p>{selected.threeActStructure.core}</p>
              </div>
              <div className="act-card">
                <span className="act-phase">🔄 Transition</span>
                <p>{selected.threeActStructure.transition}</p>
              </div>
            </div>
          </div>

          <div className="season-signs">
            <span className="signs-label">Signs of {selected.season}:</span>
            <div className="signs-list">
              {selected.signs.map((sign) => {
                const signData = SIGN_SEASONAL_MEANINGS[sign];
                return (
                  <span key={sign} className="sign-chip">
                    {signData?.symbol} {sign}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="md-panel">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="md-buttons">
            <button className="md-btn seasons-md-btn" onClick={handleSeasonsMd} disabled={!mdContent}>
              Seasons MD
            </button>
            <button className="md-btn import-btn" onClick={handleImportMd}>
              Import MD
            </button>
            <button className="md-btn export-btn" onClick={handleExportMd}>
              Export MD
            </button>
          </div>
        </div>
      )}

      {/* Floating MD reader (portaled to body) */}
      {floatingMd && (
        <FloatingMdWindow
          content={floatingMd}
          title="Seasons MD"
          onClose={() => setFloatingMd(null)}
        />
      )}
    </div>
  );
};

// =============================================================================
// ELEMENTS TAB
// =============================================================================

interface ElementsTabProps {
  selectedElement: string | null;
  onSelectElement: (element: string | null) => void;
}

const ElementsTab: React.FC<ElementsTabProps> = ({ selectedElement, onSelectElement }) => {
  const elements = Object.values(ELEMENT_EDUCATION);
  const selected = selectedElement ? ELEMENT_EDUCATION[selectedElement] : null;

  return (
    <div className="elements-tab">
      <div className="elements-intro">
        <h4>The Four Fuels — How You Process Reality</h4>
        <p>
          Imagine four people witnessing the same sunset. Your element is your
          <strong> default operating system</strong> for processing life.
        </p>
      </div>

      {/* Element Selector */}
      <div className="element-selector">
        {elements.map((el) => (
          <button
            key={el.element}
            className={`element-button ${selectedElement === el.element ? 'selected' : ''}`}
            style={{
              borderColor: el.color,
              background: selectedElement === el.element ? `${el.color}20` : 'transparent',
            }}
            onClick={() => onSelectElement(selectedElement === el.element ? null : el.element)}
          >
            <span className="element-icon">{el.icon}</span>
            <span className="element-name">{el.element}</span>
          </button>
        ))}
      </div>

      {/* Element Detail */}
      {selected ? (
        <div className="element-detail" style={{ borderColor: selected.color }}>
          <div className="detail-header">
            <span className="detail-icon">{selected.icon}</span>
            <div className="detail-titles">
              <h4>{selected.element}</h4>
              <span className="detail-subtitle">{selected.title}</span>
            </div>
          </div>

          {/* The Drive */}
          <div className="drive-section">
            <span className="drive-label">The Drive:</span>
            <span className="drive-text">{selected.theDrive}</span>
          </div>

          {/* Physics → Psychology */}
          <div className="physics-psychology">
            <div className="pp-section">
              <span className="pp-label">The Physics</span>
              <p className="pp-content">{selected.thePhysics}</p>
            </div>
            <div className="pp-arrow">→</div>
            <div className="pp-section">
              <span className="pp-label">The Psychology</span>
              <p className="pp-content">{selected.thePsychology}</p>
            </div>
          </div>

          {/* Sunset Response */}
          <div className="sunset-response" style={{ borderColor: selected.color }}>
            <span className="sunset-label">At a Beautiful Sunset:</span>
            <p className="sunset-text">{selected.sunsetResponse}</p>
          </div>

          <div className="element-traits">
            <div className="trait-row">
              <span className="trait-label">Motivated by</span>
              <span className="trait-value">{selected.motivatedBy}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Needs</span>
              <span className="trait-value">{selected.needs}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">At Best</span>
              <span className="trait-value positive">{selected.atBest}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Under Stress</span>
              <span className="trait-value caution">{selected.underStress}</span>
            </div>
          </div>

          {/* In Relationships */}
          <div className="detail-section highlight">
            <span className="section-label">In Relationships</span>
            <p className="section-content">{selected.inRelationships}</p>
          </div>

          {/* Bottom Line */}
          <div className="bottom-line" style={{ background: `${selected.color}15`, borderColor: selected.color }}>
            <span className="bottom-label">Bottom Line:</span>
            <p className="bottom-text">{selected.bottomLine}</p>
          </div>

          {/* Modality Expressions */}
          <div className="modality-expressions">
            <h5>How {selected.element} Expresses Through the Three Engines</h5>
            {(['cardinal', 'fixed', 'mutable'] as const).map((mod) => {
              const expr = selected.modalityExpressions[mod];
              const modLabels = { cardinal: '▶ Beginning', fixed: '⏺ Core', mutable: '🔄 Transition' };
              return (
                <div key={mod} className="expression-card">
                  <div className="expression-header">
                    <span className="expression-modality">{modLabels[mod]}</span>
                    <span className="expression-sign">{SIGN_SEASONAL_MEANINGS[expr.sign]?.symbol} {expr.sign}</span>
                  </div>
                  <span className="expression-role">{expr.role}</span>
                  <p className="expression-image"><em>Image: {expr.image}</em></p>
                  <p className="expression-description">{expr.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="select-prompt">
          <p>Select an element above to explore how it expresses</p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MODALITIES TAB
// =============================================================================

interface ModalitiesTabProps {
  selectedModality: string | null;
  onSelectModality: (modality: string | null) => void;
}

const ModalitiesTab: React.FC<ModalitiesTabProps> = ({ selectedModality, onSelectModality }) => {
  const modalities = Object.values(MODALITY_EDUCATION);
  const selected = selectedModality ? MODALITY_EDUCATION[selectedModality] : null;

  return (
    <div className="modalities-tab">
      <div className="modalities-intro">
        <h4>The Three Engines of Momentum</h4>
        <p>
          Every season follows a three-act pattern—like a wave building, cresting, and dissolving.
          Where you were born in your season's wave determines <strong>how you naturally move through life</strong>.
        </p>
      </div>

      {/* Modality Selector */}
      <div className="modality-selector">
        {modalities.map((mod) => (
          <button
            key={mod.modality}
            className={`modality-button ${selectedModality === mod.modality ? 'selected' : ''}`}
            style={{
              borderColor: mod.color,
              background: selectedModality === mod.modality ? `${mod.color}20` : 'transparent',
            }}
            onClick={() => onSelectModality(selectedModality === mod.modality ? null : mod.modality)}
          >
            <span className="modality-icon">{mod.icon}</span>
            <span className="modality-name">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* Modality Detail */}
      {selected ? (
        <div className="modality-detail" style={{ borderColor: selected.color }}>
          <div className="detail-header">
            <span className="detail-icon">{selected.icon}</span>
            <div className="detail-titles">
              <h4>{selected.modality}</h4>
              <span className="detail-subtitle">{selected.title}</span>
            </div>
          </div>

          {/* Metaphor */}
          <div className="metaphor-box" style={{ borderColor: selected.color }}>
            <span className="metaphor-text">{selected.metaphor}</span>
          </div>

          <p className="modality-essence">{selected.essence}</p>

          <div className="modality-traits">
            <div className="trait-row">
              <span className="trait-label">Seasonal Role</span>
              <span className="trait-value">{selected.seasonalRole}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Day Range</span>
              <span className="trait-value">{selected.dayRange}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Energy Pattern</span>
              <span className="trait-value">{selected.energyPattern}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Strength</span>
              <span className="trait-value positive">{selected.strength}</span>
            </div>
            <div className="trait-row">
              <span className="trait-label">Challenge</span>
              <span className="trait-value caution">{selected.challenge}</span>
            </div>
          </div>

          {/* How You Move */}
          <div className="detail-section highlight">
            <span className="section-label">How You Move</span>
            <p className="section-content">{selected.howYouMove}</p>
          </div>

          {/* Real Life Example */}
          <div className="detail-section">
            <span className="section-label">Real-Life Example</span>
            <p className="section-content example">{selected.realLifeExample}</p>
          </div>

          {/* In Relationships */}
          <div className="detail-section">
            <span className="section-label">In Relationships</span>
            <p className="section-content">{selected.inRelationships}</p>
          </div>

          {/* The Shadow */}
          <div className="shadow-section">
            <span className="section-label">The Shadow</span>
            <p className="section-content shadow">{selected.theShadow}</p>
          </div>

          <div className="modality-signs">
            <span className="signs-label">The Four {selected.modality} Signs:</span>
            <div className="signs-grid">
              {selected.signs.map((sign) => {
                const signData = SIGN_SEASONAL_MEANINGS[sign];
                const seasonData = signData ? SEASON_WISDOM[signData.season] : null;
                return (
                  <div key={sign} className="sign-card-mini" style={{ borderColor: seasonData?.color }}>
                    <span className="sign-symbol">{signData?.symbol}</span>
                    <span className="sign-name">{sign}</span>
                    <span className="sign-season">({signData?.season})</span>
                    <span className="sign-element">{signData?.element}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="select-prompt">
          <p>Select a modality above to learn how it operates</p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SIGNS TAB
// =============================================================================

const SignsTab: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const signs = Object.values(SIGN_SEASONAL_MEANINGS);
  const selected = selectedSign ? SIGN_SEASONAL_MEANINGS[selectedSign] : null;

  // Group signs by season
  const signsBySeason = {
    Spring: signs.filter(s => s.season === 'Spring'),
    Summer: signs.filter(s => s.season === 'Summer'),
    Autumn: signs.filter(s => s.season === 'Autumn'),
    Winter: signs.filter(s => s.season === 'Winter'),
  };

  return (
    <div className="signs-tab">
      <div className="signs-intro">
        <h4>The 12 Constitutional Addresses</h4>
        <p>
          Each sign is a <strong>unique combination</strong> of Season + Element + Modality—your
          GPS coordinates in time. Click a sign to see its full constitutional profile.
        </p>
      </div>

      {/* Signs by Season Grid */}
      <div className="signs-by-season">
        {Object.entries(signsBySeason).map(([season, seasonSigns]) => {
          const seasonData = SEASON_WISDOM[season];
          return (
            <div key={season} className="season-group">
              <div className="season-group-header" style={{ borderColor: seasonData?.color }}>
                <span className="season-icon">{seasonData?.icon}</span>
                <span className="season-name">{season}</span>
              </div>
              <div className="season-signs-row">
                {seasonSigns.map((sign) => {
                  const elementData = ELEMENT_EDUCATION[sign.element];
                  return (
                    <button
                      key={sign.sign}
                      className={`sign-button ${selectedSign === sign.sign ? 'selected' : ''}`}
                      style={{
                        borderColor: elementData?.color,
                        background: selectedSign === sign.sign ? `${elementData?.color}20` : 'transparent',
                      }}
                      onClick={() => {
                        setSelectedSign(selectedSign === sign.sign ? null : sign.sign);
                        setExpandedSection('overview');
                      }}
                    >
                      <span className="sign-symbol">{sign.symbol}</span>
                      <span className="sign-name">{sign.sign}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign Detail - Full Constitutional Profile */}
      {selected && (
        <div className="sign-detail constitutional" style={{ borderColor: ELEMENT_EDUCATION[selected.element]?.color }}>
          <div className="detail-header">
            <span className="detail-icon">{selected.symbol}</span>
            <div className="detail-titles">
              <h4>{selected.sign} — {selected.elementRole}</h4>
              <span className="detail-subtitle">{selected.keyPhrase}</span>
            </div>
          </div>

          <div className="sign-badges">
            <span className="badge" style={{ background: SEASON_WISDOM[selected.season]?.color }}>
              {SEASON_WISDOM[selected.season]?.icon} {selected.season}
            </span>
            <span className="badge" style={{ background: ELEMENT_EDUCATION[selected.element]?.color }}>
              {ELEMENT_EDUCATION[selected.element]?.icon} {selected.element}
            </span>
            <span className="badge" style={{ background: MODALITY_EDUCATION[selected.modality]?.color }}>
              {MODALITY_EDUCATION[selected.modality]?.icon} {selected.modality}
            </span>
          </div>

          {/* Psychological Imprint */}
          <div className="imprint-box" style={{ borderColor: ELEMENT_EDUCATION[selected.element]?.color }}>
            <span className="imprint-text">{selected.psychologicalImprint}</span>
          </div>

          {/* Expandable Sections */}
          <div className="sign-sections">
            {/* Overview Section */}
            <div className={`sign-section ${expandedSection === 'overview' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'overview' ? null : 'overview')}
              >
                <span>Overview</span>
                <span className="toggle-icon">{expandedSection === 'overview' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'overview' && (
                <div className="section-content-wrap">
                  <div className="born-at">
                    <span className="born-label">Born At:</span>
                    <span className="born-value">{selected.bornAt}</span>
                  </div>
                  <p className="seasonal-meaning">{selected.seasonalMeaning}</p>

                  <div className="env-reality">
                    <span className="reality-label">Environmental Reality:</span>
                    <ul className="reality-list">
                      {selected.environmentalReality.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Why This Way Section */}
            <div className={`sign-section ${expandedSection === 'why' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'why' ? null : 'why')}
              >
                <span>Why {selected.sign} Behaves This Way</span>
                <span className="toggle-icon">{expandedSection === 'why' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'why' && (
                <div className="section-content-wrap">
                  <ul className="why-list">
                    {selected.whyThisWay.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* The Formula Section */}
            <div className={`sign-section ${expandedSection === 'formula' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'formula' ? null : 'formula')}
              >
                <span>The Complete Formula</span>
                <span className="toggle-icon">{expandedSection === 'formula' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'formula' && (
                <div className="section-content-wrap">
                  <div className="formula-breakdown">
                    <div className="formula-item">
                      <span className="formula-label">Season:</span>
                      <span className="formula-value">{selected.theFormula.season}</span>
                    </div>
                    <div className="formula-item">
                      <span className="formula-label">Element:</span>
                      <span className="formula-value">{selected.theFormula.element}</span>
                    </div>
                    <div className="formula-item">
                      <span className="formula-label">Modality:</span>
                      <span className="formula-value">{selected.theFormula.modality}</span>
                    </div>
                    <div className="formula-result">
                      <span>= "{selected.theFormula.result}"</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Traits Section */}
            <div className={`sign-section ${expandedSection === 'traits' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'traits' ? null : 'traits')}
              >
                <span>At Best / Under Stress</span>
                <span className="toggle-icon">{expandedSection === 'traits' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'traits' && (
                <div className="section-content-wrap">
                  <div className="traits-grid">
                    <div className="traits-column positive">
                      <span className="traits-heading">At Best</span>
                      <div className="traits-chips">
                        {selected.atBest.map((trait, idx) => (
                          <span key={idx} className="trait-chip positive">{trait}</span>
                        ))}
                      </div>
                    </div>
                    <div className="traits-column caution">
                      <span className="traits-heading">Under Stress</span>
                      <div className="traits-chips">
                        {selected.underStress.map((trait, idx) => (
                          <span key={idx} className="trait-chip caution">{trait}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Needs & Fears Section */}
            <div className={`sign-section ${expandedSection === 'needs' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'needs' ? null : 'needs')}
              >
                <span>Needs & Fears</span>
                <span className="toggle-icon">{expandedSection === 'needs' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'needs' && (
                <div className="section-content-wrap">
                  <div className="traits-grid">
                    <div className="traits-column needs">
                      <span className="traits-heading">Needs</span>
                      <div className="traits-chips">
                        {selected.needs.map((need, idx) => (
                          <span key={idx} className="trait-chip needs">{need}</span>
                        ))}
                      </div>
                    </div>
                    <div className="traits-column fears">
                      <span className="traits-heading">Fears</span>
                      <div className="traits-chips">
                        {selected.fears.map((fear, idx) => (
                          <span key={idx} className="trait-chip fears">{fear}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Relationships Section */}
            <div className={`sign-section ${expandedSection === 'relationships' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'relationships' ? null : 'relationships')}
              >
                <span>In Relationships</span>
                <span className="toggle-icon">{expandedSection === 'relationships' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'relationships' && (
                <div className="section-content-wrap">
                  <p className="relationship-text">{selected.inRelationships}</p>
                </div>
              )}
            </div>

            {/* Career Section */}
            <div className={`sign-section ${expandedSection === 'career' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'career' ? null : 'career')}
              >
                <span>Career Strengths</span>
                <span className="toggle-icon">{expandedSection === 'career' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'career' && (
                <div className="section-content-wrap">
                  <div className="career-chips">
                    {selected.careerStrengths.map((career, idx) => (
                      <span key={idx} className="career-chip">{career}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shadow Section */}
            <div className={`sign-section ${expandedSection === 'shadow' ? 'expanded' : ''}`}>
              <button
                className="section-toggle"
                onClick={() => setExpandedSection(expandedSection === 'shadow' ? null : 'shadow')}
              >
                <span>The Shadow</span>
                <span className="toggle-icon">{expandedSection === 'shadow' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'shadow' && (
                <div className="section-content-wrap">
                  <p className="shadow-text">{selected.theShadow}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// ASPECTS TAB - Geometric Relationships Between Signs (5W+H+Emotion Framework)
// =============================================================================

// Helper to render inline markdown (bold and italic) - reusable
/** Render inline markdown: **bold**, *italic*, [link](url), HTML tags */
const renderInlineMarkdown = (str: string, keyPrefix: string = 'md'): React.ReactNode[] => {
  // Split by **bold**, *italic*, [link](url), and HTML tags
  const tokens = str.split(/(\*\*.*?\*\*|\*[^*]+\*|\[.*?\]\(.*?\)|<[^>]+>)/g);

  return tokens.flatMap((tok, idx) => {
    if (!tok) return [];
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={`${keyPrefix}-${idx}`}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      return <em key={`${keyPrefix}-${idx}`}>{tok.slice(1, -1)}</em>;
    }
    const linkMatch = tok.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return <a key={`${keyPrefix}-${idx}`} href={linkMatch[2]} className="md-link">{linkMatch[1]}</a>;
    }
    // HTML anchor bookmark: <a name="..."></a> or <a name="..." />
    const anchorMatch = tok.match(/^<a\s+name=["']([^"']+)["']\s*\/?\s*>$/i);
    if (anchorMatch) {
      return <a key={`${keyPrefix}-${idx}`} id={anchorMatch[1]} />;
    }
    // Self-closing / empty HTML tags: </a>, <br>, <br/>, <hr>, etc. — skip
    if (/^<\/?[a-z][^>]*\/?>$/i.test(tok)) {
      // <br> and <br/> → line break
      if (/^<br\s*\/?>$/i.test(tok)) return <br key={`${keyPrefix}-${idx}`} />;
      return [];
    }
    return tok;
  });
};

/**
 * Render markdown text with headers, lists, blockquotes, hr, tables, bold/italic.
 * Handles full .md files — not just inline snippets.
 */
const renderMarkdownText = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line — skip
    if (line.trim() === '') { i++; continue; }

    // HTML anchor bookmark: <a name="..."></a> (standalone line)
    const anchorLineMatch = line.trim().match(/^<a\s+name=["']([^"']+)["']\s*>\s*<\/a>$/i);
    if (anchorLineMatch) {
      elements.push(<a key={`anchor-${i}`} id={anchorLineMatch[1]} />);
      i++; continue;
    }

    // Other standalone HTML tags (skip closing tags, render <br>)
    if (/^\s*<\/?[a-z][^>]*\/?\s*>\s*$/i.test(line.trim()) && !line.trim().startsWith('<a')) {
      if (/^<br\s*\/?>$/i.test(line.trim())) {
        elements.push(<br key={`br-${i}`} />);
      }
      i++; continue;
    }

    // Horizontal rule: ---, ***, ___
    if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
      elements.push(<hr key={`hr-${i}`} className="md-hr" />);
      i++; continue;
    }

    // Headers: # through ######
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      elements.push(<Tag key={`h-${i}`} className={`md-h${level}`}>{renderInlineMarkdown(headerMatch[2], `h${i}`)}</Tag>);
      i++; continue;
    }

    // Blockquote: > text
    if (line.startsWith('>')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        bqLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="md-blockquote">
          {bqLines.map((bl, j) => (
            <React.Fragment key={j}>{renderInlineMarkdown(bl, `bq${i}-${j}`)}{j < bqLines.length - 1 && <br />}</React.Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Unordered list: - item or * item
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="md-ul">
          {items.map((item, j) => <li key={j}>{renderInlineMarkdown(item, `ul${i}-${j}`)}</li>)}
        </ul>,
      );
      continue;
    }

    // Ordered list: 1. item
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="md-ol">
          {items.map((item, j) => <li key={j}>{renderInlineMarkdown(item, `ol${i}-${j}`)}</li>)}
        </ol>,
      );
      continue;
    }

    // Table: | col | col |
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse: first row = header, second row = separator (skip), rest = body
      const parseRow = (r: string) => r.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1).map(c => c.trim());
      const headerCells = parseRow(tableLines[0]);
      const bodyRows = tableLines.slice(2).map(parseRow); // skip separator row
      elements.push(
        <div key={`tbl-${i}`} className="md-table-wrap">
          <table className="md-table">
            <thead><tr>{headerCells.map((c, ci) => <th key={ci}>{renderInlineMarkdown(c, `th${i}-${ci}`)}</th>)}</tr></thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri}>{row.map((c, ci) => <td key={ci}>{renderInlineMarkdown(c, `td${i}-${ri}-${ci}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Default: paragraph (collect consecutive non-special lines)
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|>\s*|[-*_]{3,}|\s*[-*]\s+|\s*\d+\.\s+|\|)/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={`p-${i}`} className="edu-paragraph">
        {paraLines.map((pl, j) => (
          <React.Fragment key={j}>
            {renderInlineMarkdown(pl, `p${i}-${j}`)}
            {j < paraLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>,
    );
  }

  return <>{elements}</>;
};

// Aspects Educational Content (5W+H+Emotion) - Full rich content
const ASPECTS_EDUCATION = {
  what: {
    title: 'What Are Aspects?',
    icon: '❓',
    content: `Aspects are the **geometric angles** between planets on the zodiac wheel. When two planets form specific angles (0°, 60°, 90°, 120°, 180°), they create a relationship that influences how their energies interact.

Think of aspects as **conversations between planets**:
- Some conversations are harmonious (trine, sextile)
- Some are challenging (square, opposition)
- Some are intense (conjunction)

Aspects reveal the **dynamic relationships** in your chart — not static traits, but ongoing dialogues between different parts of your psyche.`,
    analogy: 'If planets are actors, aspects are their stage chemistry — how they play off each other, support each other, or create dramatic tension.',
  },
  why: {
    title: 'Why Aspects Matter',
    icon: '💡',
    content: `Aspects are the **engines of development** in your chart. Without aspects, planets would just sit in signs, static and isolated. Aspects create:

**Dynamic Tension:** Squares and oppositions force growth through challenge
**Natural Flow:** Trines and sextiles show where life comes easily
**Concentration:** Conjunctions amplify and intensify
**Complexity:** Multiple aspects create the rich texture of human experience

**Emotionally:** Aspects explain why you feel pulled in different directions, why some areas flow naturally while others require constant effort, and why certain life themes keep recurring.`,
    deeperWhy: 'Your aspects are your **soul\'s curriculum** — the lessons you\'re here to learn through the interplay of planetary energies.',
  },
  when: {
    title: 'When Aspects Activate',
    icon: '⏰',
    content: `Aspects in your natal chart are **always present**, but they activate more intensely at specific times:

**1. By Transit**
When a moving planet forms an aspect to a natal planet
Example: Saturn square your natal Moon = emotional maturity test

**2. By Progression**
When your progressed chart forms new aspects
Example: Progressed Moon trine natal Venus = period of emotional ease

**3. By Solar Return**
Aspects formed in your birthday chart for that year
Example: Sun conjunct Jupiter in return = expansive year

**4. By Conscious Attention**
When you become aware of an aspect pattern
Awareness itself can transform challenging aspects into growth catalysts

**Developmentally:** Aspects mature over your lifetime — a difficult square at 25 may become integrated wisdom at 55.`,
  },
  where: {
    title: 'Where Aspects Manifest',
    icon: '📍',
    content: `Aspects manifest in the **life areas** (houses) where the planets reside:

**Example: Mars square Saturn**
- If Mars is in 7th house (relationships) and Saturn in 10th (career)
- Manifestation: Career ambitions (Saturn 10th) create relationship friction (Mars 7th)

**Example: Venus trine Jupiter**
- If Venus is in 2nd house (money) and Jupiter in 6th (work)
- Manifestation: Work (Jupiter 6th) naturally generates income (Venus 2nd)

**Psychologically:** Aspects play out in your **internal world** as:
- Conflicting desires (square)
- Supportive impulses (trine)
- Awareness of opposites (opposition)
- Merged drives (conjunction)

**Externally:** Aspects attract people and situations that mirror your internal aspect patterns.`,
  },
  who: {
    title: 'Who Experiences Aspects',
    icon: '👥',
    content: `**Everyone** has aspects — a chart without aspects is impossible (planets are always at *some* angle to each other).

**Different Aspect Patterns:**

**T-Square Person** (2 squares + 1 opposition)
Feels constant pressure to resolve tension, often high achievers

**Grand Trine Person** (3 trines forming triangle)
Life flows easily but may lack drive, needs external motivation

**Grand Cross Person** (4 squares forming cross)
Intense internal tension, capacity for major transformation

**Stellium Person** (3+ conjunctions)
Concentrated focus in one area, theme of integration

**Kite Pattern** (Grand trine + sextiles + opposition)
Natural talents (trine) with direction (opposition)

**Yod (Finger of God)** (2 quincunxes + sextile)
Destiny pattern, feels pulled toward specific life purpose

Your aspect pattern is your **developmental blueprint** — the unique curriculum your soul chose for growth.`,
  },
  how: {
    title: 'How to Work With Aspects',
    icon: '🔧',
    content: `**1. Identify Your Dominant Aspect Pattern**
- Count: How many trines vs. squares vs. oppositions?
- Pattern: Do you have a T-square, Grand Trine, or other configuration?

**2. Understand the Conversation**
- Harmonious aspects: Recognize natural talents, avoid complacency
- Challenging aspects: Accept the tension, use it as fuel for growth
- Neutral aspects: Explore consciously, integrate gradually

**3. Developmental Approach**
**Childhood (0-29):** Aspects feel like external events
**Saturn Return (29-30):** Begin to own your aspect patterns
**Midlife (40-50):** Integrate previously split aspects
**Wisdom Years (60+):** Aspects become sources of mastery

**4. Practical Integration**
**For Squares:** Set concrete goals that require the friction
**For Oppositions:** Practice seeing both sides consciously
**For Trines:** Add challenge to prevent stagnation
**For Conjunctions:** Separate the merged energies when needed

**5. Therapeutic Approach**
Talk to your aspects as if they're internal characters having a dialogue. Example:
- Mars (action) square Saturn (restraint)
- Dialogue: "What does my Mars want? What does my Saturn fear?"
- Integration: Find timing where both can be honored`,
  },
  emotion: {
    title: 'The Emotional Landscape of Aspects',
    icon: '💫',
    content: `**Conjunction** 🔥
*Feels like:* Intensity, wholeness, sometimes overwhelm
*Emotional tone:* "These two parts of me are ONE"

**Opposition** ⚖️
*Feels like:* Being pulled in two directions, awareness through contrast
*Emotional tone:* "I see both sides but struggle to hold both"

**Trine** 🌊
*Feels like:* Ease, grace, natural flow
*Emotional tone:* "This just works, no effort needed"

**Square** ⚡
*Feels like:* Friction, pressure, motivation to act
*Emotional tone:* "Something must change, I can't stay here"

**Sextile** 🤝
*Feels like:* Opportunity, potential, connection
*Emotional tone:* "I could do something with this"

**Quincunx** 🔄
*Feels like:* Awkwardness, need for adjustment
*Emotional tone:* "These pieces don't quite fit, but I'll make it work"

**The Deeper Feeling:**
Your aspects are your **internal weather system** — the patterns of pressure and flow that create your emotional climate. Learning to read your aspects is learning to read your own soul's language.`,
  },
  history: {
    title: 'Historical Significance of Aspects',
    icon: '📜',
    content: `**Ancient Origins (Babylon, 2nd millennium BCE)**
Babylonians first observed planetary angles, noting correlations with earthly events

**Greek Systematization (Ptolemy, 2nd century CE)**
*Tetrabiblos* formalized the major aspects:
- Trine (120°): "harmonious" (same element)
- Square (90°): "inharmonious" (conflicting elements)
- Opposition (180°): "confrontational" (opposing signs)
- Sextile (60°): "cooperative" (compatible elements)

**Medieval Elaboration (8th-15th centuries)**
Added minor aspects, orbs, and dignities
Developed aspect weighting systems

**Psychological Revolution (20th century)**
**Carl Jung:** Aspects as archetypal dialogues
**Dane Rudhyar:** Aspects as **phases of relationship** between planets
**Modern synthesis:** Aspects as **developmental patterns**

**Why It Matters Today:**
Aspects bridge **astronomy** (mathematical angles) and **psychology** (internal dynamics). They're the most *objectively verifiable* part of astrology — the angles are pure geometry, the meanings emerge from centuries of observation.`,
  },
};

// Complete Aspects Data with detailed information
const ASPECTS_DATA = [
  {
    key: 'conjunction',
    name: 'Conjunction',
    symbol: '☌',
    degree: 0,
    orb: 10,
    color: '#FFD700',
    harmony: 'neutral' as const,
    nature: 'major',
    starRating: 5,
    description: 'Two planets in the same sign, merging their energies',
    meaning: 'Unity, fusion, concentration of energy',
    keywords: ['merge', 'intensify', 'unify', 'concentrate'],
    psychologicalEffect: 'Blending of two principles into one unified expression',
    manifestation: 'Strong focus, amplification, potential for both harmony and conflict',
    emotionalTone: 'Intensity, wholeness, sometimes overwhelm — "These two parts of me are ONE"',
  },
  {
    key: 'sextile',
    name: 'Sextile',
    symbol: '⚹',
    degree: 60,
    orb: 6,
    color: '#4444FF',
    harmony: 'harmonious' as const,
    nature: 'major',
    starRating: 4,
    description: 'Planets 60° apart, creating opportunities',
    meaning: 'Opportunity, cooperation, skill development',
    keywords: ['opportunity', 'cooperation', 'skill', 'communication'],
    psychologicalEffect: 'Ability to connect different areas easily',
    manifestation: 'Opportunities that require action to activate',
    emotionalTone: 'Opportunity, potential, connection — "I could do something with this"',
  },
  {
    key: 'square',
    name: 'Square',
    symbol: '□',
    degree: 90,
    orb: 8,
    color: '#FF8844',
    harmony: 'challenging' as const,
    nature: 'major',
    starRating: 3,
    description: 'Planets 90° apart, creating friction and motivation',
    meaning: 'Challenge, growth through effort, dynamic tension',
    keywords: ['friction', 'growth', 'challenge', 'motivation'],
    psychologicalEffect: 'Internal pressure driving development',
    manifestation: 'Obstacles that force growth, mastery through struggle',
    emotionalTone: 'Friction, pressure, motivation — "Something must change, I can\'t stay here"',
  },
  {
    key: 'trine',
    name: 'Trine',
    symbol: '△',
    degree: 120,
    orb: 8,
    color: '#44FF44',
    harmony: 'harmonious' as const,
    nature: 'major',
    starRating: 5,
    description: 'Planets 120° apart, connecting compatible elements',
    meaning: 'Ease, flow, natural talent',
    keywords: ['ease', 'flow', 'talent', 'blessing'],
    psychologicalEffect: 'Effortless expression, natural ability',
    manifestation: 'Grace, gifts, but may lack motivation to develop fully',
    emotionalTone: 'Ease, grace, natural flow — "This just works, no effort needed"',
  },
  {
    key: 'quincunx',
    name: 'Quincunx',
    symbol: '⚻',
    degree: 150,
    orb: 3,
    color: '#AA44AA',
    harmony: 'challenging' as const,
    nature: 'minor',
    starRating: 2,
    description: 'Planets 150° apart, requiring adjustment',
    meaning: 'Adjustment, redirection, integration of incompatibles',
    keywords: ['adjust', 'redirect', 'strain', 'health'],
    psychologicalEffect: 'Constant need for recalibration',
    manifestation: 'Health issues, need for lifestyle adjustments',
    emotionalTone: 'Awkwardness, need for adjustment — "These pieces don\'t quite fit"',
  },
  {
    key: 'opposition',
    name: 'Opposition',
    symbol: '☍',
    degree: 180,
    orb: 10,
    color: '#FF4444',
    harmony: 'challenging' as const,
    nature: 'major',
    starRating: 4,
    description: 'Planets exactly opposite each other across the wheel',
    meaning: 'Polarity, tension, awareness through contrast',
    keywords: ['tension', 'awareness', 'balance', 'projection'],
    psychologicalEffect: 'Heightened awareness of both ends of an axis',
    manifestation: 'Need to integrate opposing forces, potential for projection',
    emotionalTone: 'Being pulled in two directions — "I see both sides but struggle to hold both"',
  },
];

type AspectEducationKey = keyof typeof ASPECTS_EDUCATION;

const AspectsTab: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [expandedEducation, setExpandedEducation] = useState<AspectEducationKey | null>('what');

  const selected = selectedAspect ? ASPECTS_DATA.find(a => a.key === selectedAspect) : null;

  const educationKeys: AspectEducationKey[] = ['what', 'why', 'when', 'where', 'who', 'how', 'emotion', 'history'];

  return (
    <div className="aspects-tab">
      {/* Educational Framework (5W+H+Emotion) */}
      <div className="aspects-education">
        <div className="education-nav">
          {educationKeys.map((key) => {
            const edu = ASPECTS_EDUCATION[key];
            return (
              <button
                type="button"
                key={key}
                className={`edu-nav-btn ${expandedEducation === key ? 'active' : ''}`}
                onClick={() => setExpandedEducation(expandedEducation === key ? null : key)}
                title={edu.title}
              >
                <span className="edu-icon">{edu.icon}</span>
                <span className="edu-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </button>
            );
          })}
        </div>

        {expandedEducation && (
          <div className="education-content-box">
            <h4>{ASPECTS_EDUCATION[expandedEducation].title}</h4>
            <div className="edu-text">
              {renderMarkdownText(ASPECTS_EDUCATION[expandedEducation].content)}
            </div>
            {'analogy' in ASPECTS_EDUCATION[expandedEducation] && (
              <div className="edu-analogy">
                <span className="analogy-label">Analogy:</span>
                <p>{(ASPECTS_EDUCATION[expandedEducation] as { analogy: string }).analogy}</p>
              </div>
            )}
            {'deeperWhy' in ASPECTS_EDUCATION[expandedEducation] && (
              <div className="edu-deeper">
                <p><em>{renderInlineMarkdown((ASPECTS_EDUCATION[expandedEducation] as { deeperWhy: string }).deeperWhy, 'deeper')}</em></p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aspect Selector */}
      <div className="aspect-selector-section">
        <h4>The Six Major Aspects</h4>
        <div className="aspect-selector-grid">
          {ASPECTS_DATA.map((aspect) => (
            <button
              type="button"
              key={aspect.key}
              className={`aspect-select-btn ${selectedAspect === aspect.key ? 'selected' : ''}`}
              style={{
                borderColor: aspect.color,
                background: selectedAspect === aspect.key ? `${aspect.color}20` : 'transparent',
              }}
              onClick={() => setSelectedAspect(selectedAspect === aspect.key ? null : aspect.key)}
            >
              <span className="aspect-symbol" style={{ color: aspect.color }}>{aspect.symbol}</span>
              <span className="aspect-name">{aspect.name}</span>
              <span className="aspect-degree">{aspect.degree}°</span>
              <span className={`aspect-nature ${aspect.harmony}`}>
                {aspect.harmony === 'harmonious' ? '✓' : aspect.harmony === 'challenging' ? '⚡' : '○'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Detail */}
      {selected ? (
        <div className="aspect-detail" style={{ borderColor: selected.color }}>
          <div className="detail-header">
            <span className="detail-icon" style={{ color: selected.color }}>{selected.symbol}</span>
            <div className="detail-titles">
              <h4>{selected.name}</h4>
              <span className="detail-subtitle">{selected.degree}° apart • Orb: ±{selected.orb}°</span>
            </div>
            <span className={`harmony-badge ${selected.harmony}`}>
              {selected.harmony === 'harmonious' ? '✓ Harmonious' : selected.harmony === 'challenging' ? '⚡ Challenging' : '○ Neutral'}
            </span>
          </div>

          <p className="aspect-description">{selected.description}</p>

          <div className="aspect-meaning-box" style={{ borderColor: selected.color }}>
            <span className="meaning-label">Core Meaning:</span>
            <span className="meaning-text">{selected.meaning}</span>
          </div>

          <div className="aspect-keywords">
            {selected.keywords.map((kw) => (
              <span key={kw} className="keyword-chip" style={{ borderColor: selected.color }}>{kw}</span>
            ))}
          </div>

          <div className="aspect-sections">
            <div className="aspect-section">
              <span className="section-label">Psychological Effect</span>
              <p>{selected.psychologicalEffect}</p>
            </div>
            <div className="aspect-section">
              <span className="section-label">How It Manifests</span>
              <p>{selected.manifestation}</p>
            </div>
            <div className="aspect-section emotional-section" style={{ background: `${selected.color}10` }}>
              <span className="section-label">Emotional Tone</span>
              <p className="emotional-quote">{selected.emotionalTone}</p>
            </div>
          </div>

          <div className="aspect-visual">
            <div className="visual-wheel">
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const r = 45;
                const x = 50 + r * Math.cos(angle);
                const y = 50 + r * Math.sin(angle);
                const isHighlighted = i === 0 || (i * 30) === selected.degree;
                return (
                  <div
                    key={i}
                    className={`visual-sign ${isHighlighted ? 'highlighted' : ''}`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      background: isHighlighted ? selected.color : 'rgba(100,100,100,0.3)',
                    }}
                  />
                );
              })}
              <div className="visual-center" style={{ color: selected.color }}>{selected.symbol}</div>
            </div>
            <div className="visual-label">
              {selected.degree === 0 ? 'Same position' : `${selected.degree}° separation`}
            </div>
          </div>
        </div>
      ) : (
        <div className="select-prompt">
          <p>Select an aspect above to explore its meaning and manifestation</p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUMMARY TABLE TAB - Seasonal Cycle Version (The "Meat & Potatoes")
// =============================================================================

const SeasonalSignCellDisplay: React.FC<{
  cell: SeasonalSignCell | null;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  element: string;
}> = ({ cell, season, element }) => {
  const seasonInfo = SEASON_COLORS[season];

  if (!cell) {
    // Empty cell - show absence insight
    const absenceInsight = SEASONAL_ABSENCE_INSIGHTS[element]?.[season];
    return (
      <div className="sign-cell sign-cell-empty" title={absenceInsight}>
        <span className="cell-empty-icon">—</span>
        <span className="cell-empty-label">rests</span>
      </div>
    );
  }

  return (
    <div className="sign-cell sign-cell-filled">
      <div className="cell-header-line">
        <span className="cell-symbol">{cell.symbol}</span>
        <span className="cell-modality" title={`${cell.modality} - ${cell.modalityRole}`}>
          {cell.modalityRole}
        </span>
      </div>
      <span className="cell-sign-name">{cell.sign}</span>
      <div className="cell-insight">
        <span className="cell-survival-gift">{cell.survivalGift}</span>
      </div>
      <div className="cell-role" style={{ color: seasonInfo.color }}>
        {cell.seasonalRole}
      </div>
    </div>
  );
};

export const SummaryTableTab: React.FC = () => {
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedCell(expandedCell === key ? null : key);
  };

  return (
    <div className="summary-table-tab">
      <div className="table-intro">
        <p>
          <strong>The Seasonal Zodiac</strong> — All 12 signs organized by Element (rows) and Season (columns).
          Empty cells reveal elemental wisdom: not every energy burns in every season.
        </p>
      </div>

      <div className="summary-table-container seasonal-table-container">
        <table className="summary-table seasonal-summary-table">
          <thead>
            <tr>
              <th className="element-header">Element</th>
              <th className="season-header spring" style={{ borderTopColor: SEASON_COLORS.Spring.color }}>
                <span className="season-icon" style={{ color: SEASON_COLORS.Spring.color }}>{SEASON_COLORS.Spring.icon}</span>
                <span className="season-label" style={{ color: SEASON_COLORS.Spring.color }}>Spring</span>
                <span className="season-dates">{SEASON_COLORS.Spring.dates}</span>
              </th>
              <th className="season-header summer" style={{ borderTopColor: SEASON_COLORS.Summer.color }}>
                <span className="season-icon" style={{ color: SEASON_COLORS.Summer.color }}>{SEASON_COLORS.Summer.icon}</span>
                <span className="season-label" style={{ color: SEASON_COLORS.Summer.color }}>Summer</span>
                <span className="season-dates">{SEASON_COLORS.Summer.dates}</span>
              </th>
              <th className="season-header autumn" style={{ borderTopColor: SEASON_COLORS.Autumn.color }}>
                <span className="season-icon" style={{ color: SEASON_COLORS.Autumn.color }}>{SEASON_COLORS.Autumn.icon}</span>
                <span className="season-label" style={{ color: SEASON_COLORS.Autumn.color }}>Autumn</span>
                <span className="season-dates">{SEASON_COLORS.Autumn.dates}</span>
              </th>
              <th className="season-header winter" style={{ borderTopColor: SEASON_COLORS.Winter.color }}>
                <span className="season-icon" style={{ color: SEASON_COLORS.Winter.color }}>{SEASON_COLORS.Winter.icon}</span>
                <span className="season-label" style={{ color: SEASON_COLORS.Winter.color }}>Winter</span>
                <span className="season-dates">{SEASON_COLORS.Winter.dates}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {SEASONAL_SUMMARY_TABLE.map((row) => (
              <tr key={row.element}>
                <td>
                  <div className="element-cell">
                    <span className="element-icon">{row.icon}</span>
                    <span className="element-name">{row.element}</span>
                  </div>
                </td>
                <td
                  className={`season-cell spring-cell ${expandedCell === `${row.element}-spring` ? 'expanded' : ''}`}
                  style={{ borderLeftColor: SEASON_COLORS.Spring.color }}
                  onClick={() => row.spring && toggleExpand(`${row.element}-spring`)}
                >
                  <SeasonalSignCellDisplay cell={row.spring} season="Spring" element={row.element} />
                  {expandedCell === `${row.element}-spring` && row.spring && (
                    <div className="cell-expanded-insight">
                      <p>{row.spring.coreInsight}</p>
                    </div>
                  )}
                </td>
                <td
                  className={`season-cell summer-cell ${expandedCell === `${row.element}-summer` ? 'expanded' : ''}`}
                  style={{ borderLeftColor: SEASON_COLORS.Summer.color }}
                  onClick={() => row.summer && toggleExpand(`${row.element}-summer`)}
                >
                  <SeasonalSignCellDisplay cell={row.summer} season="Summer" element={row.element} />
                  {expandedCell === `${row.element}-summer` && row.summer && (
                    <div className="cell-expanded-insight">
                      <p>{row.summer.coreInsight}</p>
                    </div>
                  )}
                </td>
                <td
                  className={`season-cell autumn-cell ${expandedCell === `${row.element}-autumn` ? 'expanded' : ''}`}
                  style={{ borderLeftColor: SEASON_COLORS.Autumn.color }}
                  onClick={() => row.autumn && toggleExpand(`${row.element}-autumn`)}
                >
                  <SeasonalSignCellDisplay cell={row.autumn} season="Autumn" element={row.element} />
                  {expandedCell === `${row.element}-autumn` && row.autumn && (
                    <div className="cell-expanded-insight">
                      <p>{row.autumn.coreInsight}</p>
                    </div>
                  )}
                </td>
                <td
                  className={`season-cell winter-cell ${expandedCell === `${row.element}-winter` ? 'expanded' : ''}`}
                  style={{ borderLeftColor: SEASON_COLORS.Winter.color }}
                  onClick={() => row.winter && toggleExpand(`${row.element}-winter`)}
                >
                  <SeasonalSignCellDisplay cell={row.winter} season="Winter" element={row.element} />
                  {expandedCell === `${row.element}-winter` && row.winter && (
                    <div className="cell-expanded-insight">
                      <p>{row.winter.coreInsight}</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-legend seasonal-legend">
        <h4>The Rhythm of the Wheel</h4>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-icon" style={{ color: SEASON_COLORS.Spring.color }}>{SEASON_COLORS.Spring.icon}</span>
            <span><strong>Spring:</strong> Energy initiates, growth begins</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon" style={{ color: SEASON_COLORS.Summer.color }}>{SEASON_COLORS.Summer.icon}</span>
            <span><strong>Summer:</strong> Energy peaks, full expression</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon" style={{ color: SEASON_COLORS.Autumn.color }}>{SEASON_COLORS.Autumn.icon}</span>
            <span><strong>Autumn:</strong> Energy harvests, gathers wisdom</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon" style={{ color: SEASON_COLORS.Winter.color }}>{SEASON_COLORS.Winter.icon}</span>
            <span><strong>Winter:</strong> Energy rests, prepares renewal</span>
          </div>
        </div>
        <p className="table-insight">
          <strong>The "Ah Ha" Insight:</strong> Empty cells are not missing data — they're elemental wisdom.
          Fire has no winter sign because flames cannot burn year-round. Water has no spring sign because
          it feeds growth from below. Click any filled cell to reveal its deeper truth.
        </p>
      </div>

      {/* Element Flow Timeline - Visual Arc Display */}
      <ElementFlowTimeline />
    </div>
  );
};

// Re-export components from ElementFlowTimeline.tsx for convenience
export { ElementFlowTimeline, SeasonalResonancePanel, HomeChallengeCard };

export default WheelEducationPanel;
