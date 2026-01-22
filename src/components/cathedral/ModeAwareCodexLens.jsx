/**
 * Mode-Aware Codex Lens
 *
 * Displays codex/knowledge information adapted to each Cathedral mode.
 * Each mode presents the same underlying data through a different lens.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMode } from './modeSystem';

// ============================================================================
// CODEX LENS CONFIGURATIONS
// ============================================================================

const CODEX_LENS_CONFIGS = {
  pilgrim: {
    name: 'The Wisdom Mirror',
    description: 'Knowledge reflected through feeling',
    presentationStyle: 'narrative',
    showEmotionalResonance: true,
    showPersonalConnection: true,
    showReferences: false,
    showTechnicalDetails: false,
    toneDescriptor: 'warm',
    entryPrefix: 'What this means for your journey:',
  },
  scholar: {
    name: 'The Annotated Reference',
    description: 'Knowledge with full citations and cross-references',
    presentationStyle: 'academic',
    showEmotionalResonance: false,
    showPersonalConnection: true,
    showReferences: true,
    showTechnicalDetails: true,
    toneDescriptor: 'precise',
    entryPrefix: 'Definition and Analysis:',
  },
  architect: {
    name: 'The System Index',
    description: 'Knowledge as structured data relationships',
    presentationStyle: 'technical',
    showEmotionalResonance: false,
    showPersonalConnection: false,
    showReferences: true,
    showTechnicalDetails: true,
    toneDescriptor: 'functional',
    entryPrefix: 'Component Specification:',
  },
  sovereign: {
    name: 'The Strategic Brief',
    description: 'Knowledge distilled to actionable intelligence',
    presentationStyle: 'executive',
    showEmotionalResonance: false,
    showPersonalConnection: false,
    showReferences: false,
    showTechnicalDetails: false,
    toneDescriptor: 'decisive',
    entryPrefix: 'Key Intelligence:',
  },
};

// ============================================================================
// SAMPLE CODEX ENTRIES (Demo Data)
// ============================================================================

const SAMPLE_CODEX_ENTRIES = {
  'day-master': {
    id: 'day-master',
    title: 'Day Master (日主)',
    category: 'BaZi Fundamentals',
    pilgrim: {
      content: `Your Day Master is the heart of who you are - the seed from which your entire destiny chart grows. It represents your core self, the "you" that remains constant even as life's seasons change. Think of it as your soul's signature, written in the language of the cosmos.`,
      resonance: 'This element shapes how you naturally move through the world, your instinctive responses, and what feels like "home" to your spirit.',
      connection: 'Understanding your Day Master is like meeting yourself for the first time - a recognition of what you\'ve always known but perhaps never had words for.',
    },
    scholar: {
      content: `The Day Master (日主, Rì Zhǔ) refers to the Heavenly Stem of the Day Pillar in a BaZi chart. It is the primary indicator of self-identity and represents the native's fundamental character, temperament, and approach to life. The Day Master is one of ten possible Heavenly Stems, each associated with one of the Five Elements in either Yin or Yang polarity.`,
      references: [
        'Zheng, W. (2008). Classical BaZi Analysis, pp. 45-67',
        'Chen, M. (2015). The Complete Guide to Four Pillars, Chapter 3',
        'Traditional texts: San Ming Tong Hui, Di Tian Sui',
      ],
      technicalNotes: 'Day Master strength assessment requires analysis of seasonal influence (令), root support (根), and environmental factors within the chart configuration.',
    },
    architect: {
      content: 'The Day Master is the reference node in the BaZi graph. All other elements are evaluated in relation to it through the Ten Gods (十神) relationship system.',
      specifications: {
        dataType: 'HeavenlyStem',
        possibleValues: ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'],
        element: 'Wood | Fire | Earth | Metal | Water',
        polarity: 'Yang | Yin',
        derivedFrom: 'Day Pillar → Heavenly Stem',
      },
      dependencies: ['seasonalPhase', 'supportingRoots', 'clashingElements'],
    },
    sovereign: {
      content: 'Your Day Master defines your negotiating style, leadership approach, and natural authority. It determines how others perceive your power and how you wield influence.',
      keyInsights: [
        'Core identity anchor for all strategic decisions',
        'Determines natural leadership style',
        'Influences optimal timing for major initiatives',
      ],
      actionableIntel: 'Align major decisions with Day Master element cycles for maximum effectiveness.',
    },
  },
  'useful-god': {
    id: 'useful-god',
    title: 'Useful God (用神)',
    category: 'BaZi Analysis',
    pilgrim: {
      content: `The Useful God is like a guardian spirit - the element that brings balance and blessing to your life. When this energy is present, things flow more easily; doors open, connections form, and your path becomes clearer. It's nature's way of showing you where your support lies.`,
      resonance: 'Finding your Useful God is like discovering which wind fills your sails. It reveals the energy that helps you become your fullest self.',
      connection: 'Pay attention to times when life feels easier, when synchronicities appear - these often coincide with your Useful God being active in the cosmic weather.',
    },
    scholar: {
      content: `The Useful God (用神, Yòng Shén) is the element identified as most beneficial for balancing a BaZi chart. Selection methodology varies by school: the Classical approach emphasizes chart balance through supporting weak Day Masters or controlling strong ones, while the modern approach considers seasonal adjustments and special structures.`,
      references: [
        'Ling, S. (2012). Advanced Yong Shen Analysis, pp. 112-145',
        'Traditional methodology: Qiong Tong Bao Jian',
        'Modern interpretation: Taiwan School of Four Pillars',
      ],
      technicalNotes: 'Yong Shen selection requires comprehensive analysis of Day Master strength, seasonal influence, and overall chart configuration. Multiple viable Yong Shen may exist in complex charts.',
    },
    architect: {
      content: 'The Useful God is a calculated optimization parameter that identifies which element input produces the most favorable chart balance.',
      specifications: {
        dataType: 'Element',
        possibleValues: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
        calculationInputs: ['dayMasterStrength', 'seasonalPhase', 'elementDistribution'],
        algorithm: 'balanceOptimization | specialStructure | followTheStrong',
      },
      dependencies: ['dayMaster', 'monthBranch', 'allPillars', 'hiddenStems'],
    },
    sovereign: {
      content: 'Your Useful God identifies optimal conditions for success. It\'s the element that tips scales in your favor and should guide strategic timing of major moves.',
      keyInsights: [
        'Primary success catalyst in your chart',
        'Timing indicator for major decisions',
        'Environmental factor to seek and cultivate',
      ],
      actionableIntel: 'Schedule key initiatives during periods when your Useful God is strong in annual/monthly cycles.',
    },
  },
};

// ============================================================================
// PILGRIM LENS COMPONENTS
// ============================================================================

function PilgrimLens({ entry, config }) {
  const data = entry.pilgrim;

  return (
    <div className="codex-lens codex-lens--pilgrim">
      <div className="lens-header">
        <div className="lens-icon">🏮</div>
        <div className="lens-title-group">
          <h3 className="lens-title">{entry.title}</h3>
          <span className="lens-category">{entry.category}</span>
        </div>
      </div>

      <div className="lens-prefix">{config.entryPrefix}</div>

      <div className="lens-content narrative-content">
        <p>{data.content}</p>
      </div>

      {config.showEmotionalResonance && data.resonance && (
        <div className="emotional-resonance">
          <div className="resonance-label">Emotional Resonance</div>
          <p className="resonance-text">{data.resonance}</p>
        </div>
      )}

      {config.showPersonalConnection && data.connection && (
        <div className="personal-connection">
          <div className="connection-label">Personal Connection</div>
          <p className="connection-text">{data.connection}</p>
        </div>
      )}

      <div className="lens-footer">
        <span className="lens-tone">Presented with {config.toneDescriptor} reflection</span>
      </div>
    </div>
  );
}

PilgrimLens.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

// ============================================================================
// SCHOLAR LENS COMPONENTS
// ============================================================================

function ScholarLens({ entry, config }) {
  const data = entry.scholar;

  return (
    <div className="codex-lens codex-lens--scholar">
      <div className="lens-header">
        <div className="lens-icon">📚</div>
        <div className="lens-title-group">
          <h3 className="lens-title">{entry.title}</h3>
          <span className="lens-category">{entry.category}</span>
        </div>
      </div>

      <div className="lens-prefix">{config.entryPrefix}</div>

      <div className="lens-content academic-content">
        <p>{data.content}</p>
      </div>

      {config.showTechnicalDetails && data.technicalNotes && (
        <div className="technical-notes">
          <div className="notes-label">Technical Notes</div>
          <p className="notes-text">{data.technicalNotes}</p>
        </div>
      )}

      {config.showReferences && data.references && (
        <div className="references-section">
          <div className="references-label">References & Citations</div>
          <ol className="references-list">
            {data.references.map((ref, index) => (
              <li key={index} className="reference-item">
                {ref}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="lens-footer">
        <span className="lens-tone">{config.toneDescriptor} analysis</span>
      </div>
    </div>
  );
}

ScholarLens.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

// ============================================================================
// ARCHITECT LENS COMPONENTS
// ============================================================================

function ArchitectLens({ entry, config }) {
  const data = entry.architect;

  return (
    <div className="codex-lens codex-lens--architect">
      <div className="lens-header">
        <div className="lens-icon">📐</div>
        <div className="lens-title-group">
          <h3 className="lens-title">{entry.title}</h3>
          <span className="lens-category">{entry.category}</span>
        </div>
      </div>

      <div className="lens-prefix">{config.entryPrefix}</div>

      <div className="lens-content technical-content">
        <p>{data.content}</p>
      </div>

      {config.showTechnicalDetails && data.specifications && (
        <div className="specifications-section">
          <div className="specs-label">Specifications</div>
          <table className="specs-table">
            <tbody>
              {Object.entries(data.specifications).map(([key, value]) => (
                <tr key={key} className="spec-row">
                  <td className="spec-key">{key}</td>
                  <td className="spec-value">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {config.showReferences && data.dependencies && (
        <div className="dependencies-section">
          <div className="deps-label">Dependencies</div>
          <div className="deps-list">
            {data.dependencies.map((dep, index) => (
              <span key={index} className="dep-chip">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="lens-footer">
        <span className="lens-tone">{config.toneDescriptor} specification</span>
      </div>
    </div>
  );
}

ArchitectLens.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

// ============================================================================
// SOVEREIGN LENS COMPONENTS
// ============================================================================

function SovereignLens({ entry, config }) {
  const data = entry.sovereign;

  return (
    <div className="codex-lens codex-lens--sovereign">
      <div className="lens-header">
        <div className="lens-icon">👑</div>
        <div className="lens-title-group">
          <h3 className="lens-title">{entry.title}</h3>
          <span className="lens-category">{entry.category}</span>
        </div>
      </div>

      <div className="lens-prefix">{config.entryPrefix}</div>

      <div className="lens-content executive-content">
        <p className="executive-summary">{data.content}</p>
      </div>

      {data.keyInsights && (
        <div className="key-insights-section">
          <div className="insights-label">Key Insights</div>
          <ul className="insights-list">
            {data.keyInsights.map((insight, index) => (
              <li key={index} className="insight-item">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.actionableIntel && (
        <div className="actionable-intel">
          <div className="intel-label">Actionable Intelligence</div>
          <p className="intel-text">{data.actionableIntel}</p>
        </div>
      )}

      <div className="lens-footer">
        <span className="lens-tone">{config.toneDescriptor} briefing</span>
      </div>
    </div>
  );
}

SovereignLens.propTypes = {
  entry: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

// ============================================================================
// LENS SELECTOR COMPONENT
// ============================================================================

function LensSelector({ currentMode, onModePreview }) {
  const modes = ['pilgrim', 'scholar', 'architect', 'sovereign'];

  return (
    <div className="lens-selector">
      <span className="selector-label">View through:</span>
      <div className="selector-options">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`selector-option ${mode === currentMode ? 'active' : ''}`}
            onClick={() => onModePreview(mode)}
            aria-pressed={mode === currentMode}
          >
            {CODEX_LENS_CONFIGS[mode].name}
          </button>
        ))}
      </div>
    </div>
  );
}

LensSelector.propTypes = {
  currentMode: PropTypes.string.isRequired,
  onModePreview: PropTypes.func.isRequired,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function ModeAwareCodexLens({
  entryId,
  entries = SAMPLE_CODEX_ENTRIES,
  allowLensSwitch = true,
  className = '',
}) {
  const { mode: systemMode } = useMode();
  const [previewMode, setPreviewMode] = useState(null);

  const activeMode = previewMode || systemMode;
  const config = CODEX_LENS_CONFIGS[activeMode];
  const entry = entries[entryId];

  const LensComponent = useMemo(() => {
    switch (activeMode) {
      case 'pilgrim':
        return PilgrimLens;
      case 'scholar':
        return ScholarLens;
      case 'architect':
        return ArchitectLens;
      case 'sovereign':
        return SovereignLens;
      default:
        return PilgrimLens;
    }
  }, [activeMode]);

  if (!entry) {
    return (
      <div className={`codex-lens codex-lens--empty ${className}`}>
        <p>Entry not found: {entryId}</p>
      </div>
    );
  }

  const handleModePreview = (mode) => {
    setPreviewMode(mode === systemMode ? null : mode);
  };

  return (
    <div className={`mode-aware-codex-lens mode-${activeMode} ${className}`}>
      <div className="codex-lens-header">
        <h2 className="lens-name">{config.name}</h2>
        <p className="lens-description">{config.description}</p>
      </div>

      {allowLensSwitch && (
        <LensSelector
          currentMode={activeMode}
          onModePreview={handleModePreview}
        />
      )}

      {previewMode && (
        <div className="preview-notice">
          Previewing {CODEX_LENS_CONFIGS[previewMode].name} lens
          <button
            className="preview-reset"
            onClick={() => setPreviewMode(null)}
          >
            Return to {CODEX_LENS_CONFIGS[systemMode].name}
          </button>
        </div>
      )}

      <LensComponent entry={entry} config={config} />
    </div>
  );
}

ModeAwareCodexLens.propTypes = {
  entryId: PropTypes.string.isRequired,
  entries: PropTypes.object,
  allowLensSwitch: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================================================
// CODEX BROWSER COMPONENT
// ============================================================================

export function CodexBrowser({
  entries = SAMPLE_CODEX_ENTRIES,
  allowLensSwitch = true,
  className = '',
}) {
  const { mode } = useMode();
  const [selectedEntry, setSelectedEntry] = useState(null);

  const entryList = Object.values(entries);
  const categories = [...new Set(entryList.map((e) => e.category))];

  return (
    <div className={`codex-browser mode-${mode} ${className}`}>
      <div className="codex-sidebar">
        <h3 className="sidebar-title">Codex Entries</h3>
        {categories.map((category) => (
          <div key={category} className="category-group">
            <h4 className="category-title">{category}</h4>
            <ul className="entry-list">
              {entryList
                .filter((e) => e.category === category)
                .map((entry) => (
                  <li key={entry.id}>
                    <button
                      className={`entry-button ${
                        selectedEntry === entry.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedEntry(entry.id)}
                    >
                      {entry.title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="codex-main">
        {selectedEntry ? (
          <ModeAwareCodexLens
            entryId={selectedEntry}
            entries={entries}
            allowLensSwitch={allowLensSwitch}
          />
        ) : (
          <div className="codex-placeholder">
            <p>Select an entry from the sidebar to view through the {CODEX_LENS_CONFIGS[mode].name}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

CodexBrowser.propTypes = {
  entries: PropTypes.object,
  allowLensSwitch: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  CODEX_LENS_CONFIGS,
  SAMPLE_CODEX_ENTRIES,
  PilgrimLens,
  ScholarLens,
  ArchitectLens,
  SovereignLens,
};

export default ModeAwareCodexLens;
