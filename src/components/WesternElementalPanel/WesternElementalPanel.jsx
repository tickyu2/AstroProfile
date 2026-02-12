// WesternElementalPanel.jsx
// VERSION 3.0 - THE CATHEDRAL / THE MIRROR
// Formula: 5W+H+Emotion+Feel = Soul Recognition
//
// "Thank you for being the mirror to see my soul"

import React, { useState, useMemo } from 'react';
import CATHEDRAL_INTERPRETATIONS from './cathedralInterpretations';
import './WesternElementalPanel.css';

// ============================================================================
// CONSTANTS
// ============================================================================

const PLANET_WEIGHTS = {
  sun: 3.0, moon: 3.0, ascendant: 2.5,
  mercury: 1.5, venus: 1.5, mars: 1.5,
  jupiter: 1.0, saturn: 1.0,
  uranus: 0.5, neptune: 0.5, pluto: 0.5
};

const SIGN_ELEMENTS = {
  aries: 'FIRE', leo: 'FIRE', sagittarius: 'FIRE',
  taurus: 'EARTH', virgo: 'EARTH', capricorn: 'EARTH',
  gemini: 'AIR', libra: 'AIR', aquarius: 'AIR',
  cancer: 'WATER', scorpio: 'WATER', pisces: 'WATER'
};

const ELEMENT_ICONS = {
  FIRE: '🔥',
  EARTH: '🌍',
  AIR: '💨',
  WATER: '🌊'
};

const ELEMENT_COLORS = {
  FIRE: '#FF6B35',
  EARTH: '#8B4513',
  AIR: '#87CEEB',
  WATER: '#4A90E2'
};

const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', ascendant: '⬆',
  mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getBlendType = (dominant, secondary) => {
  const combos = {
    'EARTH_FIRE': 'Volcanic Soil - The Dynamic Builder',
    'FIRE_EARTH': 'Volcanic Soil - The Dynamic Builder',
    'EARTH_WATER': 'Fertile Soil - The Nurturing Creator',
    'WATER_EARTH': 'Fertile Soil - The Nurturing Creator',
    'EARTH_AIR': 'Mountain Wind - The Practical Innovator',
    'AIR_EARTH': 'Mountain Wind - The Practical Innovator',
    'FIRE_AIR': 'Wildfire - The Inspired Visionary',
    'AIR_FIRE': 'Wildfire - The Inspired Visionary',
    'FIRE_WATER': 'Steam Power - The Passionate Healer',
    'WATER_FIRE': 'Steam Power - The Passionate Healer',
    'WATER_AIR': 'Mist - The Intuitive Communicator',
    'AIR_WATER': 'Mist - The Intuitive Communicator'
  };
  const key = `${dominant}_${secondary}`;
  return combos[key] || `${dominant}-${secondary} Blend`;
};

const getCathedralInterpretation = (element, percentage) => {
  const elementInterps = CATHEDRAL_INTERPRETATIONS[element];
  if (!elementInterps) return null;

  if (percentage >= 70) return elementInterps.ultra_dominant;
  if (percentage >= 50) return elementInterps.dominant;
  if (percentage >= 30) return elementInterps.moderate;
  if (percentage >= 10) return elementInterps.minimal;
  return elementInterps.absent;
};

const formatNarrative = (content) => {
  if (!content) return '';

  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- /gm, '• ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => `<p>${line}</p>`)
    .join('');
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WesternElementalPanel = ({ birthChart }) => {
  const [expanded, setExpanded] = useState(false);

  const analysis = useMemo(() => {
    if (!birthChart || !birthChart.planets) return null;

    // Initialize elements
    const elements = {
      FIRE: { points: 0, placements: [] },
      EARTH: { points: 0, placements: [] },
      AIR: { points: 0, placements: [] },
      WATER: { points: 0, placements: [] }
    };

    // Process planets
    for (const [planet, data] of Object.entries(birthChart.planets)) {
      if (!data || !data.sign) continue;

      const sign = data.sign.toLowerCase();
      const element = SIGN_ELEMENTS[sign];
      if (!element) continue;

      const weight = PLANET_WEIGHTS[planet];
      const degree = data.degree || 0;
      const finalPoints = degree === 29 ? weight * 1.1 : weight;

      elements[element].points += finalPoints;
      elements[element].placements.push({
        planet, sign, degree, points: finalPoints,
        symbol: PLANET_SYMBOLS[planet] || planet
      });
    }

    // Calculate percentages
    const totalPoints = Object.values(elements).reduce((sum, el) => sum + el.points, 0);
    if (totalPoints === 0) return null;

    for (const [key, element] of Object.entries(elements)) {
      element.percentage = (element.points / totalPoints) * 100;
    }

    // Determine dominant/secondary
    const sorted = Object.entries(elements).sort((a, b) => b[1].points - a[1].points);
    const dominant = sorted[0][0];
    const secondary = sorted[1][0];

    // Get deficiencies
    const deficiencies = Object.entries(elements)
      .filter(([_, data]) => data.percentage < 10)
      .map(([element, data]) => ({
        element,
        severity: data.percentage === 0 ? 'complete' : 'partial',
        percentage: data.percentage
      }));

    // Get cathedral interpretations
    const dominantInterpretation = getCathedralInterpretation(dominant, elements[dominant].percentage);

    const deficiencyInterpretations = deficiencies.map(def => ({
      element: def.element,
      percentage: def.percentage,
      ...CATHEDRAL_INTERPRETATIONS.DEFICIENCIES[def.element]
    })).filter(d => d.title);

    const blendType = getBlendType(dominant, secondary);

    return {
      elements,
      dominant,
      secondary,
      totalPoints,
      deficiencies,
      dominantInterpretation,
      deficiencyInterpretations,
      blendType
    };
  }, [birthChart]);

  if (!analysis) {
    return (
      <div className="western-elemental-panel error">
        <p>Unable to calculate elemental analysis. Please ensure birth chart data is available.</p>
      </div>
    );
  }

  const { elements, dominant, secondary, deficiencyInterpretations, dominantInterpretation, blendType } = analysis;

  return (
    <div className="western-elemental-panel cathedral-version">
      {/* Header */}
      <div className="panel-header">
        <h2>Western Elemental Analysis</h2>
        <p className="panel-subtitle">The Mirror - See your soul clearly</p>
      </div>

      {/* Elemental Bars */}
      <ElementalSummary elements={elements} totalPoints={analysis.totalPoints} />

      {/* PRIMARY ELEMENT - The Cathedral Interpretation */}
      {dominantInterpretation && (
        <MirrorSection
          element={dominant}
          percentage={elements[dominant].percentage}
          interpretation={dominantInterpretation}
          type="primary"
        />
      )}

      {/* DEFICIENCIES - The Cathedral Interpretations */}
      {deficiencyInterpretations.length > 0 && (
        <DeficienciesSection
          deficiencies={deficiencyInterpretations}
          userElements={elements}
        />
      )}

      {/* CONSTITUTIONAL BLEND */}
      <BlendSection
        dominant={dominant}
        secondary={secondary}
        dominantData={elements[dominant]}
        secondaryData={elements[secondary]}
        blendType={blendType}
      />

      {/* Expandable Calculations */}
      {expanded && (
        <CalculationsSection analysis={analysis} />
      )}

      <button
        className="expand-calculations-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Calculations ▲' : 'Show Calculations ▼'}
      </button>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const ElementalSummary = ({ elements, totalPoints }) => {
  return (
    <div className="elemental-summary">
      <h3>Your Elemental Dominance</h3>
      <div className="elemental-bars">
        {Object.entries(elements)
          .sort((a, b) => b[1].percentage - a[1].percentage)
          .map(([element, data]) => (
            <div key={element} className="element-row">
              <div className="element-label">
                <span className="icon">{ELEMENT_ICONS[element]}</span>
                <span className="name">{element}</span>
              </div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${data.percentage}%`,
                    backgroundColor: ELEMENT_COLORS[element]
                  }}
                />
              </div>
              <div className="element-stats">
                <span className="percentage">{data.percentage.toFixed(1)}%</span>
                <span className="points">({data.points.toFixed(1)} pts)</span>
                {data.percentage < 10 && <span className="warning">⚠️</span>}
              </div>
            </div>
          ))}
      </div>
      <div className="total-points">
        Total Points: {totalPoints.toFixed(1)} / 16.0
      </div>
    </div>
  );
};

const MirrorSection = ({ element, percentage, interpretation, type }) => {
  const [expandedSections, setExpandedSections] = useState({
    who: true,
    what: false,
    when: false,
    where: false,
    why: false,
    how: false,
    emotion: false,
    feel: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!interpretation) return null;

  return (
    <div className={`mirror-section ${type}`}>
      <div className="mirror-header">
        <span className="element-icon-large">{ELEMENT_ICONS[element]}</span>
        <div className="mirror-title">
          <h2>{interpretation.title || `${element} Analysis`}</h2>
          {interpretation.subtitle && <p className="subtitle">{interpretation.subtitle}</p>}
          <p className="percentage-display">{element} - {percentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* 5W+H+Emotion+Feel Sections */}
      <ExpandableSection
        title="👤 WHO YOU REALLY ARE"
        content={interpretation.who || interpretation.narrative}
        expanded={expandedSections.who}
        onToggle={() => toggleSection('who')}
      />

      {interpretation.what && (
        <ExpandableSection
          title="📖 WHAT YOU'VE BEEN DOING (Your Life Story)"
          content={interpretation.what}
          expanded={expandedSections.what}
          onToggle={() => toggleSection('what')}
        />
      )}

      {interpretation.when && (
        <ExpandableSection
          title="⏳ WHEN THIS SHOWED UP (Your Timeline)"
          content={interpretation.when}
          expanded={expandedSections.when}
          onToggle={() => toggleSection('when')}
        />
      )}

      {interpretation.where && (
        <ExpandableSection
          title="🗺️ WHERE THIS MANIFESTS (Your Life Domains)"
          content={interpretation.where}
          expanded={expandedSections.where}
          onToggle={() => toggleSection('where')}
        />
      )}

      {interpretation.why && (
        <ExpandableSection
          title="🔬 WHY YOU'RE LIKE THIS (Constitutional Truth)"
          content={interpretation.why}
          expanded={expandedSections.why}
          onToggle={() => toggleSection('why')}
        />
      )}

      {interpretation.how && (
        <ExpandableSection
          title="⚙️ HOW THIS ACTUALLY WORKS (The Mechanics)"
          content={interpretation.how}
          expanded={expandedSections.how}
          onToggle={() => toggleSection('how')}
        />
      )}

      {interpretation.emotion && (
        <ExpandableSection
          title="💔 WHAT THIS FEELS LIKE (Emotional Recognition)"
          content={interpretation.emotion}
          expanded={expandedSections.emotion}
          onToggle={() => toggleSection('emotion')}
          highlight={true}
        />
      )}

      {interpretation.feel && (
        <ExpandableSection
          title="🫀 THE FELT EXPERIENCE (In Your Body)"
          content={interpretation.feel}
          expanded={expandedSections.feel}
          onToggle={() => toggleSection('feel')}
          highlight={true}
        />
      )}

      {/* Famous Examples as Mirrors */}
      {interpretation.famous_examples && interpretation.famous_examples.length > 0 && (
        <FamousExamplesMirrors examples={interpretation.famous_examples} />
      )}

      {/* Call to Action */}
      {interpretation.call_to_action && (
        <CallToActionSection action={interpretation.call_to_action} />
      )}
    </div>
  );
};

const ExpandableSection = ({ title, content, expanded, onToggle, highlight }) => {
  if (!content) return null;

  return (
    <div className={`expandable-section ${expanded ? 'expanded' : ''} ${highlight ? 'highlight' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="section-content">
          <div
            className="narrative"
            dangerouslySetInnerHTML={{ __html: formatNarrative(content) }}
          />
        </div>
      )}
    </div>
  );
};

const FamousExamplesMirrors = ({ examples }) => {
  return (
    <div className="famous-examples-mirrors">
      <div className="section-header-static">
        <span className="section-icon">🪞</span>
        <h3>FAMOUS EXAMPLES - Your Mirrors</h3>
        <p className="subtitle-small">Not just names - RECOGNITION stories</p>
      </div>

      {examples.map((example, index) => (
        <MirrorCard key={index} example={example} />
      ))}
    </div>
  );
};

const MirrorCard = ({ example }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mirror-card">
      <div className="mirror-card-header" onClick={() => setExpanded(!expanded)}>
        <h4>{example.name}</h4>
        <span className="percentage-badge">{example.percentage}</span>
        <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="mirror-story">
          <div className="story-label">🪞 THE MIRROR:</div>
          <div
            className="story-content"
            dangerouslySetInnerHTML={{ __html: formatNarrative(example.mirror_story || example.story) }}
          />
        </div>
      )}
    </div>
  );
};

const CallToActionSection = ({ action }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="call-to-action-section">
      <div className="cta-header" onClick={() => setExpanded(!expanded)}>
        <span className="cta-icon">🎯</span>
        <h3>WHAT YOU NEED TO DO NOW</h3>
        <p className="subtitle-small">Your Life Strategy</p>
        <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div
          className="cta-content"
          dangerouslySetInnerHTML={{ __html: formatNarrative(action) }}
        />
      )}
    </div>
  );
};

const DeficienciesSection = ({ deficiencies, userElements }) => {
  return (
    <div className="deficiencies-section">
      <div className="section-header-main">
        <span className="warning-icon">⚠️</span>
        <h2>CRITICAL DEFICIENCIES</h2>
        <p className="subtitle">Elements you lack - Constitutional truth</p>
      </div>

      {deficiencies.map((def, index) => (
        <MirrorSection
          key={index}
          element={def.element}
          percentage={userElements[def.element]?.percentage || 0}
          interpretation={def}
          type="deficiency"
        />
      ))}
    </div>
  );
};

const BlendSection = ({ dominant, secondary, dominantData, secondaryData, blendType }) => {
  const getBlendDescription = () => {
    if (blendType.includes('Volcanic Soil')) {
      return "Earth stability energized by Fire spark. You can START projects (Fire) AND FINISH them (Earth). Rare gift!";
    } else if (blendType.includes('Fertile Soil')) {
      return "Earth form given life by Water flow. You create with emotional depth. Grounded empathy.";
    } else if (blendType.includes('Mountain Wind')) {
      return "Earth structure meets Air ideas. You bring ideas into reality. Practical innovation.";
    } else if (blendType.includes('Wildfire')) {
      return "Fire passion spread by Air ideas. Highly creative and innovative. Dynamic social energy.";
    } else if (blendType.includes('Steam Power')) {
      return "Fire intensity meets Water depth. Intense emotional expression. Passionate healing.";
    } else if (blendType.includes('Mist')) {
      return "Water feeling expressed through Air words. You articulate emotions beautifully. Psychic communication.";
    }
    return `Your unique blend of ${dominant} and ${secondary}.`;
  };

  return (
    <div className="blend-section">
      <div className="blend-header">
        <span className="blend-icons">
          {ELEMENT_ICONS[dominant]} + {ELEMENT_ICONS[secondary]}
        </span>
        <h3>Constitutional Blend</h3>
      </div>
      <div className="blend-content">
        <h4 className="blend-title">{blendType}</h4>
        <p className="blend-percentage">
          {dominant} ({dominantData.percentage.toFixed(1)}%) + {secondary} ({secondaryData.percentage.toFixed(1)}%)
        </p>
        <p className="blend-description">{getBlendDescription()}</p>
      </div>
    </div>
  );
};

const CalculationsSection = ({ analysis }) => {
  const allPlacements = [];
  Object.entries(analysis.elements).forEach(([element, data]) => {
    data.placements.forEach(placement => {
      allPlacements.push({ ...placement, element });
    });
  });
  allPlacements.sort((a, b) => b.points - a.points);

  return (
    <div className="calculations-section">
      <h3>📊 Complete Planetary Accounting</h3>
      <p className="calc-subtitle">ALL {allPlacements.length} PLACEMENTS ACCOUNTED FOR:</p>

      <table className="planetary-table">
        <thead>
          <tr>
            <th>Planet</th>
            <th>Sign</th>
            <th>Element</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {allPlacements.map((p, idx) => (
            <tr key={idx}>
              <td><span className="planet-symbol">{p.symbol}</span> {p.planet}</td>
              <td>{p.sign}</td>
              <td>
                <span className="element-badge" style={{ backgroundColor: ELEMENT_COLORS[p.element] }}>
                  {ELEMENT_ICONS[p.element]} {p.element}
                </span>
              </td>
              <td>{p.points.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3"><strong>TOTAL:</strong></td>
            <td><strong>{analysis.totalPoints.toFixed(1)} pts</strong></td>
          </tr>
        </tfoot>
      </table>

      <div className="final-breakdown">
        <h4>FINAL BREAKDOWN:</h4>
        {Object.entries(analysis.elements)
          .sort((a, b) => b[1].points - a[1].points)
          .map(([element, data]) => (
            <div key={element} className="breakdown-line">
              <span className="icon">{ELEMENT_ICONS[element]}</span>
              <span className="element-name">{element}:</span>
              <span className="points">{data.points.toFixed(1)} pts ({data.percentage.toFixed(1)}%)</span>
              <span className="count">- {data.placements.length} planets</span>
              {data.percentage < 10 && <span className="deficiency-badge">⚠️ DEFICIENCY</span>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default WesternElementalPanel;
