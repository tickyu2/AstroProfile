/**
 * WheelEducationPanel.tsx
 *
 * Educational panel for studying the Tropical Zodiac wheel from outside in.
 * Correct ring sequence: Seasons → Modalities → Elements → Signs
 *
 * Extracted from Brother Sonnet's comprehensive documentation.
 */

import React, { useState } from 'react';
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

// =============================================================================
// TYPES
// =============================================================================

type EducationTab = 'overview' | 'seasons' | 'modalities' | 'elements' | 'signs';

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

  return (
    <div className="wheel-education-panel">
      <div className="education-header">
        <h3>Study the Wheel</h3>
        <p className="education-subtitle">From Outside In</p>
      </div>

      {/* Tab Navigation - Correct ring sequence: Seasons → Modes → Elements → Signs */}
      <div className="education-tabs">
        {[
          { id: 'overview', label: 'Guide', icon: '📖' },
          { id: 'seasons', label: 'Seasons', icon: '🌍' },
          { id: 'modalities', label: 'Modes', icon: '⚡' },
          { id: 'elements', label: 'Elements', icon: '🔥' },
          { id: 'signs', label: 'Signs', icon: '✨' },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            className={`education-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id as EducationTab)}
          >
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{label}</span>
          </button>
        ))}
        {/* Table button - opens flap popup */}
        <button
          type="button"
          className="education-tab table-flap-trigger"
          onClick={() => onOpenTableFlap?.()}
          title="Open Summary Table (larger view)"
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Table</span>
          <span className="flap-indicator">↗</span>
        </button>
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

const SeasonsTab: React.FC<SeasonsTabProps> = ({ selectedSeason, onSelectSeason }) => {
  const seasons = Object.values(SEASON_WISDOM);
  const selected = selectedSeason ? SEASON_WISDOM[selectedSeason] : null;

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
        <div className="select-prompt">
          <p>Select a season above to explore its wisdom</p>
        </div>
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
