// WesternElementalPanel.jsx
// GOLD STANDARD - Cathedral Quality Western Elemental Analysis
// Version 2.0 - Production Ready

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import './WesternElementalPanel.css';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const PLANET_WEIGHTS = {
  sun: 3.0,        // ☉ Core identity/ego
  moon: 3.0,       // ☽ Emotions/inner self
  ascendant: 2.5,  // ⇡ Outer personality
  mercury: 1.5,    // ☿ Communication/mind
  venus: 1.5,      // ♀ Love/values
  mars: 1.5,       // ♂ Action/drive
  jupiter: 1.0,    // ♃ Expansion/luck
  saturn: 1.0,     // ♄ Structure/discipline
  uranus: 0.5,     // ♅ Innovation/change
  neptune: 0.5,    // ♆ Spirituality/dreams
  pluto: 0.5       // ♇ Transformation/power
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
  sun: '☉', moon: '☽', ascendant: '⇡',
  mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇'
};

const PLANET_DESCRIPTIONS = {
  sun: 'Your core identity',
  moon: 'Your emotional nature',
  ascendant: 'How others see you',
  mercury: 'Your communication',
  venus: 'Your love style',
  mars: 'Your action/drive',
  jupiter: 'Your expansion',
  saturn: 'Your discipline',
  uranus: 'Your innovation',
  neptune: 'Your spirituality',
  pluto: 'Your transformation'
};

const SEEK_SIGNS = {
  FIRE: {
    signs: ['Aries', 'Leo', 'Sagittarius'],
    dates: ['Mar 21-Apr 19', 'Jul 23-Aug 22', 'Nov 22-Dec 21'],
    why: 'Fire partners provide the spark and motivation you lack'
  },
  EARTH: {
    signs: ['Taurus', 'Virgo', 'Capricorn'],
    dates: ['Apr 20-May 20', 'Aug 23-Sep 22', 'Dec 22-Jan 19'],
    why: 'Earth partners ground and stabilize you'
  },
  AIR: {
    signs: ['Gemini', 'Libra', 'Aquarius'],
    dates: ['May 21-Jun 20', 'Sep 23-Oct 22', 'Jan 20-Feb 18'],
    why: 'Air partners bring intellectual stimulation and communication'
  },
  WATER: {
    signs: ['Cancer', 'Scorpio', 'Pisces'],
    dates: ['Jun 21-Jul 22', 'Oct 23-Nov 21', 'Feb 19-Mar 20'],
    why: 'Water partners provide emotional depth and intuition'
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WesternElementalPanel = ({ userId, birthChart }) => {
  const [analysis, setAnalysis] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (birthChart && birthChart.planets) {
      calculateAndSaveAnalysis();
    }
  }, [birthChart]);

  const calculateAndSaveAnalysis = async () => {
    try {
      setLoading(true);
      
      // Initialize element buckets
      const elements = {
        FIRE: { points: 0, placements: [] },
        EARTH: { points: 0, placements: [] },
        AIR: { points: 0, placements: [] },
        WATER: { points: 0, placements: [] }
      };

      // Process each planet
      for (const [planet, data] of Object.entries(birthChart.planets)) {
        if (!data || !data.sign) continue;
        
        const sign = data.sign.toLowerCase();
        const element = SIGN_ELEMENTS[sign];
        
        if (!element) {
          console.warn(`Unknown sign: ${sign}`);
          continue;
        }
        
        const weight = PLANET_WEIGHTS[planet];
        const degree = data.degree || 0;

        // Apply degree sensitivity (29° = critical degree)
        const finalPoints = degree === 29 ? weight * 1.1 : weight;

        elements[element].points += finalPoints;
        elements[element].placements.push({
          planet,
          sign,
          degree,
          points: finalPoints,
          symbol: PLANET_SYMBOLS[planet] || planet,
          description: PLANET_DESCRIPTIONS[planet] || ''
        });
      }

      // Calculate percentages
      const totalPoints = Object.values(elements).reduce((sum, el) => sum + el.points, 0);

      if (totalPoints === 0) {
        throw new Error('No valid planetary data');
      }

      for (const [key, element] of Object.entries(elements)) {
        element.percentage = (element.points / totalPoints) * 100;
      }

      // Determine dominant/secondary
      const sorted = Object.entries(elements)
        .sort((a, b) => b[1].points - a[1].points);
      
      const dominant = sorted[0][0];
      const secondary = sorted[1][0];

      // Get deficiencies (< 10%)
      const deficiencies = Object.entries(elements)
        .filter(([_, data]) => data.percentage < 10)
        .map(([element, data]) => ({
          element,
          severity: data.percentage === 0 ? 'complete' : 'partial',
          percentage: data.percentage
        }));

      // Determine blend type
      const blendType = getBlendType(dominant, secondary);

      const analysisResult = {
        elements,
        dominant,
        secondary,
        totalPoints,
        deficiencies,
        blendType,
        calculatedAt: new Date().toISOString()
      };

      setAnalysis(analysisResult);

      // Save to Firestore
      if (userId) {
        const db = getFirestore();
        await setDoc(
          doc(db, `users/${userId}/western_analysis/current`), 
          analysisResult
        );
      }

      setLoading(false);
    } catch (err) {
      console.error('Error calculating western elements:', err);
      setError(err.message);
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="western-elemental-panel loading">
        <div className="loading-spinner"></div>
        <p>Calculating your elemental balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="western-elemental-panel error">
        <p>Unable to calculate elemental analysis: {error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { elements, dominant, secondary, deficiencies, blendType } = analysis;

  return (
    <div className="western-elemental-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>Western Elemental Analysis</h2>
        <button 
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details ▲' : 'Show Calculations ▼'}
        </button>
      </div>

      {/* Elemental Bars */}
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
          Total Points: {analysis.totalPoints.toFixed(1)} / 16.0
        </div>
      </div>

      {/* Primary Element Card */}
      <PrimaryElementCard
        element={dominant}
        data={elements[dominant]}
      />

      {/* Deficiency Warnings */}
      {deficiencies.length > 0 && (
        <DeficiencySection deficiencies={deficiencies} />
      )}

      {/* Constitutional Blend */}
      <BlendCard
        dominant={dominant}
        secondary={secondary}
        dominantData={elements[dominant]}
        secondaryData={elements[secondary]}
        blendType={blendType}
      />

      {/* Expanded Details */}
      {expanded && (
        <ExpandedDetails 
          analysis={analysis}
          birthChart={birthChart}
        />
      )}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PrimaryElementCard = ({ element, data }) => {
  const getTierTitle = (percentage) => {
    if (percentage >= 70) return "THE MOUNTAIN - Ultra Dominant";
    if (percentage >= 50) return "THE BUILDER - Dominant";
    if (percentage >= 30) return "THE GROUNDED - Moderate";
    if (percentage >= 10) return "TOUCH - Minimal";
    return "ABSENT - Sky Dancer";
  };

  const getTierDescription = (element, percentage) => {
    if (percentage >= 70) {
      return `At ${percentage.toFixed(1)}%, you ARE the ${element.toLowerCase()} itself. Unmovable. Eternal. The foundation others build on.`;
    } else if (percentage >= 50) {
      return `At ${percentage.toFixed(1)}%, you're the reliable ${element.toLowerCase()} presence everyone counts on.`;
    } else if (percentage >= 30) {
      return `At ${percentage.toFixed(1)}%, you have solid ${element.toLowerCase()} with flexibility.`;
    } else if (percentage >= 10) {
      return `At ${percentage.toFixed(1)}%, you're lightly ${element.toLowerCase()}.`;
    }
    return `At ${percentage.toFixed(1)}%, you lack ${element.toLowerCase()}.`;
  };

  return (
    <div className="primary-element-card">
      <div className="card-header">
        <span className="icon-large">{ELEMENT_ICONS[element]}</span>
        <div className="card-title">
          <h3>PRIMARY ELEMENT: {element}</h3>
          <p className="subtitle">{getTierTitle(data.percentage)}</p>
        </div>
      </div>
      <div className="card-content">
        <p className="description">
          {getTierDescription(element, data.percentage)}
        </p>
        {data.percentage >= 50 && (
          <div className="strengths-preview">
            <h4>Your Superpower:</h4>
            <ul>
              {element === 'EARTH' && (
                <>
                  <li>200-year vision (you build for generations)</li>
                  <li>Crisis-proof (nothing shakes you)</li>
                  <li>You FINISH what others start</li>
                </>
              )}
              {element === 'FIRE' && (
                <>
                  <li>Initiation spark (you START things)</li>
                  <li>Passionate courage (fearless action)</li>
                  <li>Inspire others through your energy</li>
                </>
              )}
              {element === 'AIR' && (
                <>
                  <li>Intellectual clarity (strategic thinking)</li>
                  <li>Communication mastery (articulate ideas)</li>
                  <li>Connect people and concepts</li>
                </>
              )}
              {element === 'WATER' && (
                <>
                  <li>Emotional depth (profound feeling)</li>
                  <li>Intuitive wisdom (psychic sensitivity)</li>
                  <li>Healing presence (nurturing others)</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const DeficiencySection = ({ deficiencies }) => {
  return (
    <div className="deficiency-section">
      {deficiencies.map(def => (
        <DeficiencyCard key={def.element} deficiency={def} />
      ))}
    </div>
  );
};

const DeficiencyCard = ({ deficiency }) => {
  const { element, severity, percentage } = deficiency;
  const [expanded, setExpanded] = useState(false);
  
  const getOvercompensationText = (element) => {
    const texts = {
      FIRE: "You may TRY to act energetic but it feels forced. You might swing between lethargy and manic energy. This is NORMAL for 0% Fire!",
      EARTH: "You may become OBSESSED with wealth/possessions (like Bill Gates with 0% Earth). You overcompensate for what you lack.",
      AIR: "You may collect books compulsively or try desperately to seem 'smart'. Pseudo-intellectualism is common overcompensation.",
      WATER: "You may try to intellectualize feelings or create emotionally intense art (like Beethoven with 0% Water)."
    };
    return texts[element] || "";
  };

  return (
    <div className={`deficiency-card ${severity}`}>
      <div className="deficiency-header">
        <div className="warning-badge">
          <span className="icon">⚠️</span>
          <h3>CRITICAL: YOU HAVE NO {element}</h3>
          <span className="percentage">({percentage.toFixed(1)}%)</span>
        </div>
      </div>
      
      <div className="deficiency-content">
        <p className="main-message">
          This is PROFOUND. Here's what this really means:
        </p>
        
        <div className="deficiency-explanation">
          <h4>What {element} Absence Means:</h4>
          <ul>
            {element === 'FIRE' && (
              <>
                <li>✗ You cannot self-ignite (no internal motivation)</li>
                <li>✗ You need EXTERNAL spark to activate</li>
                <li>✗ Solo ventures feel impossibly heavy</li>
                <li>✗ You may overcompensate by seeming hyper-energetic</li>
              </>
            )}
            {element === 'EARTH' && (
              <>
                <li>✗ Disconnected from physical reality</li>
                <li>✗ Money management feels alien</li>
                <li>✗ Grounding/practical tasks impossible</li>
                <li>✗ May obsess over wealth as compensation</li>
              </>
            )}
            {element === 'AIR' && (
              <>
                <li>✗ Not "in your head" or abstract</li>
                <li>✗ Intellectual discussions feel foreign</li>
                <li>✗ Strategic thinking doesn't come naturally</li>
                <li>✗ May collect information compulsively</li>
              </>
            )}
            {element === 'WATER' && (
              <>
                <li>✗ Emotionally evasive or unavailable</li>
                <li>✗ Try to intellectualize feelings</li>
                <li>✗ Intuition feels blocked</li>
                <li>✗ May create emotional art as outlet</li>
              </>
            )}
          </ul>
        </div>

        <div className="overcompensation-section">
          <h4>The Overcompensation Effect:</h4>
          <p>{getOvercompensationText(element)}</p>
        </div>

        <div className="seek-signs">
          <h4>SEEK THESE SIGNS FOR BALANCE:</h4>
          <div className="sign-list">
            {SEEK_SIGNS[element].signs.map((sign, idx) => (
              <div key={sign} className="sign-item">
                <span className="sign-name">{sign}</span>
                <span className="sign-dates">{SEEK_SIGNS[element].dates[idx]}</span>
              </div>
            ))}
          </div>
          <p className="why-text">{SEEK_SIGNS[element].why}</p>
        </div>

        <button 
          className="toggle-details-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Learn More →'}
        </button>

        {expanded && (
          <ExtendedDeficiencyInfo element={element} />
        )}
      </div>
    </div>
  );
};

const ExtendedDeficiencyInfo = ({ element }) => {
  return (
    <div className="extended-deficiency-info">
      <h4>Famous {element}-Deficient People:</h4>
      {element === 'EARTH' && (
        <ul>
          <li><strong>Bill Gates</strong> (0% Earth) - One of richest people (overcompensation)</li>
          <li><strong>Hugh Hefner</strong> (0% Earth) - Material gratification focus</li>
        </ul>
      )}
      {element === 'WATER' && (
        <ul>
          <li><strong>William Butler Yeats</strong> (0% Water) - Most emotional poetry</li>
          <li><strong>Ludwig von Beethoven</strong> (0% Water) - Most moving music</li>
        </ul>
      )}
      {element === 'AIR' && (
        <ul>
          <li><strong>Thomas Jefferson</strong> (0% Air) - Brilliant mind despite lack</li>
        </ul>
      )}
      
      <h4>Activities to Cultivate {element}:</h4>
      <CultivationActivities element={element} />
    </div>
  );
};

const CultivationActivities = ({ element }) => {
  const activities = {
    FIRE: [
      { name: "Hot Yoga (Bikram)", frequency: "3x/week" },
      { name: "Warrior Pose", frequency: "Daily" },
      { name: "Competitive Sports", frequency: "2x/week" },
      { name: "Passionate Dancing (tango, salsa)", frequency: "Weekly" },
      { name: "Public Speaking", frequency: "Weekly practice" }
    ],
    EARTH: [
      { name: "Gardening", frequency: "Weekly" },
      { name: "Pottery/Sculpture", frequency: "2x/week" },
      { name: "Hiking in Nature", frequency: "Weekly" },
      { name: "Cooking/Baking", frequency: "Daily" },
      { name: "Financial Planning", frequency: "Monthly review" }
    ],
    AIR: [
      { name: "Reading/Writing", frequency: "Daily" },
      { name: "Debate/Discussion Groups", frequency: "Weekly" },
      { name: "Learning New Language", frequency: "3x/week" },
      { name: "Strategic Games (chess)", frequency: "Weekly" },
      { name: "Teaching/Tutoring", frequency: "Weekly" }
    ],
    WATER: [
      { name: "Swimming", frequency: "3x/week" },
      { name: "Art/Poetry/Music", frequency: "Daily" },
      { name: "Emotional Journaling", frequency: "Daily" },
      { name: "Living Near Water", frequency: "Lifestyle" },
      { name: "Bath Rituals", frequency: "Weekly" }
    ]
  };

  return (
    <div className="cultivation-activities">
      {activities[element].map(activity => (
        <div key={activity.name} className="activity-item">
          <span className="activity-name">{activity.name}</span>
          <span className="activity-frequency">{activity.frequency}</span>
        </div>
      ))}
    </div>
  );
};

const BlendCard = ({ dominant, secondary, dominantData, secondaryData, blendType }) => {
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
    <div className="blend-card">
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

const ExpandedDetails = ({ analysis, birthChart }) => {
  return (
    <div className="expanded-details">
      <h3>How Your Elements Are Calculated</h3>
      <p className="explanation">
        We'll show you where EVERY planet landed, and WHY each one counts toward a specific element.
      </p>

      {/* Show each element's placements */}
      {Object.entries(analysis.elements)
        .sort((a, b) => b[1].points - a[1].points)
        .map(([element, data]) => (
          <ElementBreakdown key={element} element={element} data={data} />
        ))}

      {/* Complete planetary table */}
      <CompletePlanetaryTable analysis={analysis} />
    </div>
  );
};

const ElementBreakdown = ({ element, data }) => {
  const { placements, points, percentage } = data;

  return (
    <div className="element-breakdown">
      <div className="breakdown-header">
        <span className="icon">{ELEMENT_ICONS[element]}</span>
        <h4>{element} PLACEMENTS</h4>
        <span className="points">({points.toFixed(1)} points = {percentage.toFixed(1)}%)</span>
      </div>

      {placements.length > 0 ? (
        <div className="placements-list">
          {placements.map((placement, idx) => (
            <div key={idx} className="placement-item">
              <div className="placement-main">
                <span className="planet-symbol">{placement.symbol}</span>
                <span className="planet-sign">
                  {placement.planet.charAt(0).toUpperCase() + placement.planet.slice(1)} in{' '}
                  {placement.sign.charAt(0).toUpperCase() + placement.sign.slice(1)}
                  {placement.degree > 0 && ` (${placement.degree}°)`}
                </span>
                <span className="placement-points">{placement.points.toFixed(1)} pts</span>
              </div>
              <div className="placement-description">
                <span className="why">Why {element}?</span>{' '}
                {placement.sign.charAt(0).toUpperCase() + placement.sign.slice(1)} is an {element} sign
              </div>
              <div className="placement-meaning">
                {placement.description}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-placements">
          <p>⚠️ YOU HAVE NO {element} PLANETS</p>
          <p className="explanation">
            None of your planets are in {element} signs. This creates a significant deficiency.
          </p>
        </div>
      )}
    </div>
  );
};

const CompletePlanetaryTable = ({ analysis }) => {
  // Flatten all placements across all elements
  const allPlacements = [];
  Object.entries(analysis.elements).forEach(([element, data]) => {
    data.placements.forEach(placement => {
      allPlacements.push({ ...placement, element });
    });
  });

  // Sort by points (descending)
  allPlacements.sort((a, b) => b.points - a.points);

  return (
    <div className="complete-planetary-table">
      <h4>📊 Complete Planetary Accounting</h4>
      <p>ALL {allPlacements.length} PLACEMENTS ACCOUNTED FOR:</p>
      
      <table>
        <thead>
          <tr>
            <th>Planet</th>
            <th>Sign</th>
            <th>Element</th>
            <th>Points</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {allPlacements.map((placement, idx) => (
            <tr key={idx}>
              <td>
                <span className="planet-symbol">{placement.symbol}</span>{' '}
                {placement.planet.charAt(0).toUpperCase() + placement.planet.slice(1)}
              </td>
              <td>{placement.sign.charAt(0).toUpperCase() + placement.sign.slice(1)}</td>
              <td>
                <span className="element-badge" style={{ backgroundColor: ELEMENT_COLORS[placement.element] }}>
                  {ELEMENT_ICONS[placement.element]} {placement.element}
                </span>
              </td>
              <td>{placement.points.toFixed(1)}</td>
              <td className="description-cell">{placement.description}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="total-row">
            <td colSpan="3"><strong>TOTAL:</strong></td>
            <td><strong>{analysis.totalPoints.toFixed(1)} pts</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="final-breakdown">
        <h5>FINAL BREAKDOWN:</h5>
        {Object.entries(analysis.elements)
          .sort((a, b) => b[1].points - a[1].points)
          .map(([element, data]) => (
            <div key={element} className="breakdown-line">
              <span className="icon">{ELEMENT_ICONS[element]}</span>
              <span className="element-name">{element}:</span>
              <span className="points">{data.points.toFixed(1)} pts ({data.percentage.toFixed(1)}%)</span>
              <span className="count">- {data.placements.length} planets</span>
              {data.percentage < 10 && <span className="warning-badge">⚠️ DEFICIENCY</span>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default WesternElementalPanel;
