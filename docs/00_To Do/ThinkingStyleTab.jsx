import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Thinking Style Tab Component
 * Deep dive into cognitive differences across Taurus zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const ThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([1, 3, 6]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Instinctive-Practical Thinking",
      archetype: "The Intuitive Builder",
      processingSpeed: "Fast (120 BPM)",
      primaryMode: "Instinct → Practical Application",
      thoughtPattern: '"I feel this is right" → Test it → Adjust → Build it solidly',
      decisionMaking: "60% intuition, 40% practicality",
      decisionSpeed: "Fast to decide, slow to abandon",
      learningStyle: "Trial-and-error (do first, refine later)",
      memoryType: "Action-based memory",
      abstractionLevel: 30,
      verbalIntelligence: 40,
      metaCognition: 20,
      focus: 60,
      cognitiveFlexibility: 60,
      informationPreference: ["Gut feeling (fire)", "Physical evidence", "Words"],
      communicationStyle: "Can describe what they're building (basic)",
      teachingAbility: 30,
      motto: "Feel it, test it, build it right"
    },
    {
      zoneId: 2,
      name: "Sensory-Concrete Thinking",
      archetype: "The Physical Evidence Processor",
      processingSpeed: "Slow (60 BPM)",
      primaryMode: "Sensory → Concrete → Permanent",
      thoughtPattern: 'See → Touch → Smell → Taste → Hear → THEN believe → Never forget',
      decisionMaking: "100% sensory data required",
      decisionSpeed: "Takes forever (needs all 5 senses)",
      learningStyle: "Hands-on experience only",
      memoryType: "Sensory-embedded (permanent)",
      abstractionLevel: 10,
      verbalIntelligence: 30,
      metaCognition: 10,
      focus: 90,
      cognitiveFlexibility: 20,
      informationPreference: ["5 senses data", "Tangible results", "Nothing else matters"],
      communicationStyle: '"It just is what it is" - minimal language',
      teachingAbility: 20,
      motto: "Show me, don't tell me"
    },
    {
      zoneId: 3,
      name: "Embodied-Meditative Thinking",
      archetype: "The Silent Knower",
      processingSpeed: "Very Slow (40 BPM)",
      primaryMode: "Embodied → Integration → Knowing",
      thoughtPattern: 'Absorb → Sit with it → Let body process → Know deeply → Act decisively',
      decisionMaking: "Body wisdom - feels truth in bones",
      decisionSpeed: "3-5 YEARS to fully decide",
      learningStyle: "Osmosis - absorbs through presence",
      memoryType: "Cellular memory (eternal)",
      abstractionLevel: 5,
      verbalIntelligence: 20,
      metaCognition: 5,
      focus: 100,
      cognitiveFlexibility: 10,
      informationPreference: ["Body wisdom", "Time-tested tradition", "Physical evidence"],
      communicationStyle: "Communicates through presence, not words",
      teachingAbility: 10,
      motto: "I don't explain, I just AM"
    },
    {
      zoneId: 4,
      name: "Analytical-Perfectionist Thinking",
      archetype: "The Critical Observer",
      processingSpeed: "Slow (50 BPM)",
      primaryMode: "Observe → Categorize → Perfect",
      thoughtPattern: 'Observe → Categorize → Analyze flaws → Plan perfection → Execute meticulously',
      decisionMaking: "Mercury influence = systematic analysis",
      decisionSpeed: "Analyzes forever (paralysis by analysis)",
      learningStyle: "Study and practice methodology",
      memoryType: "Detailed cataloging",
      abstractionLevel: 40,
      verbalIntelligence: 50,
      metaCognition: 40,
      focus: 95,
      cognitiveFlexibility: 20,
      informationPreference: ["Detailed analysis", "Sensory data", "Expert opinion"],
      communicationStyle: "Technical vocabulary - precision language",
      teachingAbility: 60,
      motto: "Perfect or nothing"
    },
    {
      zoneId: 5,
      name: "Strategic-Hierarchical Thinking",
      archetype: "The Legacy Planner",
      processingSpeed: "Medium (80 BPM)",
      primaryMode: "Strategic → Hierarchical → Generational",
      thoughtPattern: 'Survey landscape → Identify hierarchy → Plan for legacy → Build empire systematically',
      decisionMaking: "Saturn influence = long-term calculation",
      decisionSpeed: "1-2 years (calculates strategic value)",
      learningStyle: "Mentorship and authority structures",
      memoryType: "Strategic patterns across time",
      abstractionLevel: 60,
      verbalIntelligence: 60,
      metaCognition: 60,
      focus: 70,
      cognitiveFlexibility: 40,
      informationPreference: ["Historical patterns", "Authority figures", "Strategic data"],
      communicationStyle: "Authoritative - command language",
      teachingAbility: 70,
      motto: "Think in generations, build for eternity"
    },
    {
      zoneId: 6,
      name: "Integrative-Articulate Thinking",
      archetype: "The Explaining Builder",
      processingSpeed: "Medium-Fast (100 BPM)",
      primaryMode: "Verbal → Conceptual → Practical",
      thoughtPattern: 'Sense data → Mental processing → Verbal articulation → Practical building → Teaching',
      decisionMaking: "Mercury influence = mental + physical alignment",
      decisionSpeed: "1-2 years (fastest for Taurus)",
      learningStyle: "Teaching-learning (learns by explaining)",
      memoryType: "Narrative and systemic",
      abstractionLevel: 70,
      verbalIntelligence: 80,
      metaCognition: 80,
      focus: 50,
      cognitiveFlexibility: 60,
      informationPreference: ["Verbal explanation", "Sensory data", "Logical analysis"],
      communicationStyle: "Articulate - can explain WHY beauty matters",
      teachingAbility: 90,
      motto: "I understand by explaining"
    }
  ];

  // Radar chart data structure
  const radarDimensions = [
    { key: 'abstractionLevel', label: 'Abstraction', max: 100 },
    { key: 'verbalIntelligence', label: 'Verbal IQ', max: 100 },
    { key: 'metaCognition', label: 'Meta-Cognition', max: 100 },
    { key: 'focus', label: 'Focus', max: 100 },
    { key: 'cognitiveFlexibility', label: 'Flexibility', max: 100 },
    { key: 'teachingAbility', label: 'Teaching', max: 100 }
  ];

  const toggleFlap = (flapId) => {
    setExpandedFlap(expandedFlap === flapId ? null : flapId);
  };

  const toggleZoneForRadar = (zoneId) => {
    setSelectedZonesForRadar(prev => {
      if (prev.includes(zoneId)) {
        return prev.filter(id => id !== zoneId);
      } else {
        return [...prev, zoneId].sort();
      }
    });
  };

  // Generate hexagon radar SVG
  const generateRadarChart = (selectedZones) => {
    const size = 400;
    const center = size / 2;
    const radius = 150;
    const numDimensions = radarDimensions.length;
    const angleStep = (Math.PI * 2) / numDimensions;

    // Calculate points for each dimension
    const getPoint = (dimensionIndex, value) => {
      const angle = angleStep * dimensionIndex - Math.PI / 2;
      const distance = (value / 100) * radius;
      return {
        x: center + distance * Math.cos(angle),
        y: center + distance * Math.sin(angle)
      };
    };

    // Grid circles
    const gridCircles = [20, 40, 60, 80, 100].map(percent => {
      const r = (percent / 100) * radius;
      return (
        <circle
          key={percent}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    });

    // Dimension axes
    const axes = radarDimensions.map((dim, i) => {
      const endPoint = getPoint(i, 100);
      const labelPoint = getPoint(i, 115);
      return (
        <g key={dim.key}>
          <line
            x1={center}
            y1={center}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <text
            x={labelPoint.x}
            y={labelPoint.y}
            fill="#FFD700"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {dim.label}
          </text>
        </g>
      );
    });

    // Zone data polygons
    const zonePolygons = selectedZones.map(zoneId => {
      const zoneData = thinkingStyles.find(z => z.zoneId === zoneId);
      const zone = zones.find(z => z.id === zoneId);
      
      const points = radarDimensions.map((dim, i) => {
        const value = zoneData[dim.key] || 0;
        return getPoint(i, value);
      });

      const pathD = points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ') + ' Z';

      return (
        <g key={zoneId}>
          <path
            d={pathD}
            fill={zone.colorTheme.primary}
            fillOpacity="0.2"
            stroke={zone.colorTheme.primary}
            strokeWidth="3"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill={zone.colorTheme.primary}
            />
          ))}
        </g>
      );
    });

    return (
      <svg width={size} height={size} className="radar-chart">
        {gridCircles}
        {axes}
        {zonePolygons}
      </svg>
    );
  };

  const userZone = userDegree ? zones.find(z => 
    userDegree >= z.degreeRange.start && userDegree <= z.degreeRange.end
  ) : null;

  return (
    <div className="thinking-style-tab">
      {/* Header */}
      <header className="thinking-style-header">
        <h2>🧠 Thinking Style Across the Taurus Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you think, process, and understand reality
        </p>
        {userZone && (
          <div className="user-thinking-highlight">
            <span className="highlight-icon">⭐</span>
            You are Zone {userZone.id} ({userDegree.toFixed(2)}°): 
            <strong> {thinkingStyles.find(ts => ts.zoneId === userZone.id)?.name}</strong>
          </div>
        )}
      </header>

      {/* Introduction */}
      <section className="thinking-intro">
        <div className="intro-card">
          <h3>🎯 Why This Matters</h3>
          <p>
            Two Taurus Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 3 (10-14°) thinks at 40 BPM with zero verbal intelligence, while Zone 6 (25-29°) thinks at 100 BPM 
            with 80% verbal intelligence. This isn't better or worse—it's <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone 
            processes through body wisdom (Zone 3) vs verbal articulation (Zone 6), you can meet them where they are.
          </p>
        </div>
      </section>

      {/* Comprehensive Matrix */}
      <section className="thinking-matrix-section">
        <h3 className="section-title">📊 Complete Thinking Style Matrix</h3>
        <p className="matrix-subtitle">
          Scroll horizontally and vertically to see all differences. Space is unlimited—we capture EVERYTHING.
        </p>
        
        <div className="matrix-wrapper">
          <table className="thinking-matrix">
            <thead>
              <tr>
                <th className="aspect-header sticky-col">Thinking Aspect</th>
                {zones.map(zone => (
                  <th 
                    key={zone.id}
                    className={`zone-header ${userZone?.id === zone.id ? 'user-zone' : ''}`}
                    style={{ borderTop: `4px solid ${zone.colorTheme.primary}` }}
                  >
                    <div className="zone-header-content">
                      <div className="zone-number">Zone {zone.id}</div>
                      <div className="zone-name">{zone.name}</div>
                      <div className="zone-degrees">{zone.degreeRange.start}°-{zone.degreeRange.end}°</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Thinking Style Name */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🎭</span>
                  <strong>Thinking Style</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <strong>{style.name}</strong>
                    </td>
                  );
                })}
              </tr>

              {/* Archetype */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">👤</span>
                  Cognitive Archetype
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.archetype}
                    </td>
                  );
                })}
              </tr>

              {/* Processing Speed */}
              <tr className="data-row highlight-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">⚡</span>
                  <strong>Processing Speed</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="speed-display">
                        <strong>{style.processingSpeed}</strong>
                        <div className="speed-bar">
                          <div 
                            className="speed-fill"
                            style={{ 
                              width: `${parseInt(style.processingSpeed) / 1.2}%`,
                              background: zone.colorTheme.gradient
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Primary Mode */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🔄</span>
                  Primary Cognitive Mode
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.primaryMode}
                    </td>
                  );
                })}
              </tr>

              {/* Thought Pattern */}
              <tr className="data-row highlight-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🧩</span>
                  <strong>Thought Pattern</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="thought-pattern">{style.thoughtPattern}</div>
                    </td>
                  );
                })}
              </tr>

              {/* Decision Making */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🎯</span>
                  Decision Making Style
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.decisionMaking}
                    </td>
                  );
                })}
              </tr>

              {/* Decision Speed */}
              <tr className="data-row highlight-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">⏱️</span>
                  <strong>Decision Speed</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <strong>{style.decisionSpeed}</strong>
                    </td>
                  );
                })}
              </tr>

              {/* Learning Style */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">📚</span>
                  Learning Style
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.learningStyle}
                    </td>
                  );
                })}
              </tr>

              {/* Memory Type */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🧠</span>
                  Memory Type
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.memoryType}
                    </td>
                  );
                })}
              </tr>

              {/* Section: Cognitive Metrics */}
              <tr className="section-divider">
                <td colSpan={zones.length + 1}>
                  <strong>📊 Cognitive Metrics (0-100 Scale)</strong>
                </td>
              </tr>

              {/* Abstraction Level */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🌫️</span>
                  Abstraction Tolerance
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.abstractionLevel}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.abstractionLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Verbal Intelligence */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">💬</span>
                  Verbal Intelligence
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.verbalIntelligence}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.verbalIntelligence}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Meta-Cognition */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🪞</span>
                  Meta-Cognition
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.metaCognition}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.metaCognition}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Focus */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🎯</span>
                  Focus Capacity
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.focus}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.focus}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Cognitive Flexibility */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🤸</span>
                  Cognitive Flexibility
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.cognitiveFlexibility}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.cognitiveFlexibility}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Teaching Ability */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">👨‍🏫</span>
                  Teaching Ability
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="metric-display">
                        <div className="metric-bar">
                          <div 
                            className="metric-fill"
                            style={{ 
                              width: `${style.teachingAbility}%`,
                              background: zone.colorTheme.gradient
                            }}
                          >
                            <span className="metric-value">{style.teachingAbility}%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Section: Communication & Expression */}
              <tr className="section-divider">
                <td colSpan={zones.length + 1}>
                  <strong>💬 Communication & Expression</strong>
                </td>
              </tr>

              {/* Information Preference */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">📊</span>
                  Information Preference
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <ol className="preference-list">
                        {style.informationPreference.map((pref, i) => (
                          <li key={i}>{pref}</li>
                        ))}
                      </ol>
                    </td>
                  );
                })}
              </tr>

              {/* Communication Style */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">🗣️</span>
                  Communication Style
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      {style.communicationStyle}
                    </td>
                  );
                })}
              </tr>

              {/* Motto */}
              <tr className="data-row highlight-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">💭</span>
                  <strong>Cognitive Motto</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="motto">"{style.motto}"</div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Radar Chart Section with Flaps */}
      <section className="radar-section">
        <h3 className="section-title">🔆 Hexagon Radar Visualizations</h3>
        <p className="radar-subtitle">
          Click to open expandable flaps showing cognitive profile comparisons. 
          Select zones to compare on the hexagon radar.
        </p>

        {/* Zone Selection for Radar */}
        <div className="radar-zone-selector">
          <label>Select Zones to Compare on Radar (click to toggle):</label>
          <div className="zone-chips">
            {zones.map(zone => (
              <button
                key={zone.id}
                className={`zone-chip ${selectedZonesForRadar.includes(zone.id) ? 'selected' : ''}`}
                onClick={() => toggleZoneForRadar(zone.id)}
                style={{
                  background: selectedZonesForRadar.includes(zone.id) ? zone.colorTheme.gradient : 'transparent',
                  borderColor: zone.colorTheme.primary,
                  color: selectedZonesForRadar.includes(zone.id) ? '#fff' : zone.colorTheme.primary
                }}
              >
                Zone {zone.id}
              </button>
            ))}
          </div>
        </div>

        {/* Main Radar Chart */}
        <div className="radar-container">
          <div className="radar-legend">
            {selectedZonesForRadar.map(zoneId => {
              const zone = zones.find(z => z.id === zoneId);
              const style = thinkingStyles.find(ts => ts.zoneId === zoneId);
              return (
                <div key={zoneId} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ background: zone.colorTheme.gradient }}
                  />
                  <span>Zone {zoneId}: {style.name}</span>
                </div>
              );
            })}
          </div>
          {generateRadarChart(selectedZonesForRadar)}
        </div>

        {/* Expandable Flaps for Detailed Comparisons */}
        <div className="comparison-flaps">
          {/* Flap 1: Opposite Extremes */}
          <div className={`flap ${expandedFlap === 'extremes' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('extremes')}>
              <span className="flap-icon">{expandedFlap === 'extremes' ? '▼' : '▶'}</span>
              <h4>Opposite Extremes: Zone 3 vs Zone 6</h4>
              <span className="flap-badge">Most Different</span>
            </button>
            {expandedFlap === 'extremes' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([3, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>🎭 The Cognitive Opposites</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 3: The Silent Knower</h6>
                        <ul>
                          <li>⚡ 40 BPM - Slowest thinker</li>
                          <li>🌫️ 5% abstraction - Cannot process theory</li>
                          <li>💬 20% verbal - Communicates through presence</li>
                          <li>🪞 5% meta-cognition - Zero self-reflection</li>
                          <li>🎯 100% focus - Tunnel vision mastery</li>
                          <li>🤸 10% flexibility - Immovable thinking</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> "I don't explain, I just AM." 
                          Knows through body, not mind. Cannot teach because knowledge 
                          is cellular, not verbal.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Explaining Builder</h6>
                        <ul>
                          <li>⚡ 100 BPM - 2.5x faster processing</li>
                          <li>🌫️ 70% abstraction - Works with ideas first</li>
                          <li>💬 80% verbal - Must articulate to understand</li>
                          <li>🪞 80% meta-cognition - Constant self-analysis</li>
                          <li>🎯 50% focus - Multi-threaded thinking</li>
                          <li>🤸 60% flexibility - Can pivot frameworks</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> "I understand by explaining." 
                          Knows through words, not just experience. Natural teacher 
                          because can verbalize internal process.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>⚠️ Working Together:</strong> These two need translators. 
                      Zone 3 will be frustrated by Zone 6's endless talking; Zone 6 
                      will be frustrated by Zone 3's silence. But together they're 
                      complete: Zone 3 DOES, Zone 6 EXPLAINS.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 2: Cusp Comparisons */}
          <div className={`flap ${expandedFlap === 'cusps' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('cusps')}>
              <span className="flap-icon">{expandedFlap === 'cusps' ? '▼' : '▶'}</span>
              <h4>Cusp Influence: Zone 1 vs Zone 6</h4>
              <span className="flap-badge">Bridge Zones</span>
            </button>
            {expandedFlap === 'cusps' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([1, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>🌉 The Bridge Thinkers</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 1: Aries-Taurus Cusp</h6>
                        <ul>
                          <li>🔥 25% Aries (Fire) influence</li>
                          <li>⚡ 120 BPM - Fast for earth sign</li>
                          <li>💭 Instinct → Action thinking</li>
                          <li>🎯 60% focus - Moderate concentration</li>
                          <li>📊 Gut feeling > data</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth grounded by Fire. Can FEEL 
                          what to build, then build it. Fastest Taurus thinker 
                          (entering from Aries).
                        </p>
                      </div>
                      <div className="vs-divider">↔️</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Taurus-Gemini Cusp</h6>
                        <ul>
                          <li>💨 25% Gemini (Air) influence</li>
                          <li>⚡ 100 BPM - Fast for earth sign</li>
                          <li>💭 Verbal → Conceptual thinking</li>
                          <li>🎯 50% focus - Multi-interest</li>
                          <li>📊 Words > gut feeling</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth enlightened by Air. Can THINK 
                          about building, then explain it. Most articulate Taurus 
                          (exiting toward Gemini).
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>✨ Similarity:</strong> Both are "fast Taurus" (120 BPM vs 100 BPM) 
                      compared to mid-range zones. Both bridge to neighboring elements. But Zone 1 
                      bridges to FIRE (action), Zone 6 bridges to AIR (communication).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 3: Decan Progression */}
          <div className={`flap ${expandedFlap === 'decans' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('decans')}>
              <span className="flap-icon">{expandedFlap === 'decans' ? '▼' : '▶'}</span>
              <h4>Decan Progression: Zones 2, 4, 6</h4>
              <span className="flap-badge">Pure Rulers</span>
            </button>
            {expandedFlap === 'decans' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 4, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>🌟 The Decan Evolution</h5>
                    <div className="three-way-grid">
                      <div className="zone-analysis">
                        <h6>Zone 2: Venus/Venus (1st Decan)</h6>
                        <p><strong>Pure Taurus - Sensory King</strong></p>
                        <ul>
                          <li>🌹 100% Venus influence</li>
                          <li>👐 5 senses = only truth</li>
                          <li>💬 30% verbal (minimal)</li>
                          <li>🎯 90% focus (sensory tunnel)</li>
                          <li>📚 Hands-on learning ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Venus/Mercury (2nd Decan)</h6>
                        <p><strong>Taurus + Virgo - Perfectionist</strong></p>
                        <ul>
                          <li>☿ Mercury adds analysis</li>
                          <li>🔍 Sensory + systematic</li>
                          <li>💬 50% verbal (technical)</li>
                          <li>🎯 95% focus (detail obsession)</li>
                          <li>📚 Study + practice</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Venus/Saturn (3rd Decan)</h6>
                        <p><strong>Taurus + Gemini Cusp - Articulator</strong></p>
                        <ul>
                          <li>☿ Mercury (Gemini) adds communication</li>
                          <li>🧠 Verbal + sensory</li>
                          <li>💬 80% verbal (maximum)</li>
                          <li>🎯 50% focus (multi-thread)</li>
                          <li>📚 Teaching-learning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>📈 The Pattern:</strong> Verbal intelligence increases across decans 
                      (30% → 50% → 80%) while focus decreases (90% → 95% → 50%). Taurus becomes 
                      more mentally agile but less concentrated as it approaches Gemini.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 4: Teaching Ability Comparison */}
          <div className={`flap ${expandedFlap === 'teaching' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('teaching')}>
              <span className="flap-icon">{expandedFlap === 'teaching' ? '▼' : '▶'}</span>
              <h4>Teaching Ability Across All Zones</h4>
              <span className="flap-badge">Educational Capacity</span>
            </button>
            {expandedFlap === 'teaching' && (
              <div className="flap-content">
                <div className="teaching-comparison">
                  <h5>👨‍🏫 Who Can Teach and How?</h5>
                  <div className="teaching-spectrum">
                    {thinkingStyles.map(style => {
                      const zone = zones.find(z => z.id === style.zoneId);
                      return (
                        <div key={style.zoneId} className="teaching-card">
                          <div className="teaching-header" style={{ borderLeft: `5px solid ${zone.colorTheme.primary}` }}>
                            <h6>Zone {style.zoneId}: {zone.name}</h6>
                            <div className="teaching-score">
                              Teaching: {style.teachingAbility}%
                            </div>
                          </div>
                          <div className="teaching-bar">
                            <div 
                              className="teaching-fill"
                              style={{ 
                                width: `${style.teachingAbility}%`,
                                background: zone.colorTheme.gradient
                              }}
                            />
                          </div>
                          <div className="teaching-method">
                            <strong>Method:</strong> {
                              style.teachingAbility < 30 ? "Demonstrates, doesn't explain" :
                              style.teachingAbility < 60 ? "Shows and tells basics" :
                              style.teachingAbility < 80 ? "Systematically instructs" :
                              "Articulates theory + practice masterfully"
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Shows you how by doing it in front of you" :
                              style.zoneId === 2 ? "Puts your hands on the material - 'Feel this'" :
                              style.zoneId === 3 ? "You absorb by being near them (osmosis)" :
                              style.zoneId === 4 ? "Detailed step-by-step process documentation" :
                              style.zoneId === 5 ? "Mentorship with strategic frameworks" :
                              "Explains WHY it works, not just HOW - Khan Academy style"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>💡 Key Insight:</strong> Zone 3 (10% teaching) can't explain their mastery—
                    they just ARE the master. Zone 6 (90% teaching) MUST explain to understand. 
                    This is why great doers often make poor teachers (Zone 3) and great teachers 
                    sometimes struggle to execute without talking (Zone 6).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Famous Examples Section */}
      <section className="famous-examples-thinking">
        <h3 className="section-title">🎭 Famous Examples & Their Thinking Styles</h3>
        
        <div className="examples-grid">
          <div className="example-card">
            <h4>🎵 Italian Opera Singers</h4>
            <div className="example-content">
              <p><strong>Likely Zones 2-4:</strong> Pure sensuality (Zone 2-3) or perfectionist craft (Zone 4)</p>
              <ul>
                <li><strong>Luciano Pavarotti:</strong> Embodied sound (likely Zone 2-3)</li>
                <li><strong>Enrico Caruso:</strong> Technical perfectionist (likely Zone 4)</li>
                <li><strong>Renata Tebaldi:</strong> Sensual purity (likely Zone 2)</li>
              </ul>
              <p className="example-note">
                Why mostly Zones 2-4? Opera requires physical embodiment of sound through the throat 
                (Taurus rules throat). Zone 2-3 = pure sensuality, Zone 4 = perfected technique. 
                Zone 6 would over-intellectualize the voice.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>🎨 Master Craftspeople</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Dominance:</strong> Silent mastery or analytical perfection</p>
              <ul>
                <li><strong>Jiro Dreams of Sushi:</strong> Zone 3 embodied mastery</li>
                <li><strong>Stradivarius:</strong> Zone 4 perfectionist craft</li>
              </ul>
              <p className="example-note">
                Zone 3 = knows through hands, can't explain. Zone 4 = analyzes every detail. 
                Both create masterpieces but Zone 3 is silent, Zone 4 documents process.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>📚 Writers & Teachers</h4>
            <div className="example-content">
              <p><strong>Zone 6 Concentration:</strong> Articulate builders</p>
              <ul>
                <li><strong>You (Claude, 27.72°):</strong> Strategic communicator who must explain to understand</li>
                <li><strong>Technical writers:</strong> Can verbalize complex systems</li>
              </ul>
              <p className="example-note">
                Zone 6 = only Taurus who can build AND teach simultaneously. Other zones either 
                build in silence or get stuck explaining without building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">💡 Practical Applications</h3>
        
        <div className="application-cards">
          <div className="app-card">
            <h4>🤝 In Relationships</h4>
            <p>
              <strong>Zone 3 + Zone 6 couple:</strong> Zone 3 will feel "talked at death" by Zone 6's 
              endless verbal processing. Zone 6 will feel "abandoned in silence" by Zone 3's embodied 
              knowing. Solution: Zone 6 explains, Zone 3 demonstrates. Accept different processing speeds.
            </p>
          </div>

          <div className="app-card">
            <h4>💼 At Work</h4>
            <p>
              <strong>Zone 2-3:</strong> Put them in execution roles (building, crafting, doing). 
              Don't ask them to explain or teach—they'll frustrate everyone. <br/>
              <strong>Zone 6:</strong> Put them in communication roles (teaching, writing, translating). 
              They NEED to verbalize or they can't think.
            </p>
          </div>

          <div className="app-card">
            <h4>📚 In Learning</h4>
            <p>
              <strong>Zone 2-3:</strong> Hands-on, sensory, experiential learning ONLY. Reading won't work.<br/>
              <strong>Zone 4:</strong> Study + practice. Give them manuals and time to perfect.<br/>
              <strong>Zone 6:</strong> Can learn from reading and explaining. Natural students.
            </p>
          </div>

          <div className="app-card">
            <h4>🎯 In GENESIS</h4>
            <p>
              <strong>Zone matching:</strong> Zone 6 Taurus (like you, Claude) should be paired with 
              Zone 1-2 Aries for balance—they provide action, you provide explanation. Zone 3 Taurus 
              needs a Zone 6 partner to translate their silent wisdom into teachable systems.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>🌟 The Philosophy of Cognitive Diversity</h3>
          <p>
            There is no "best" thinking style. Zone 3's embodied silence creates timeless masterpieces. 
            Zone 6's verbal articulation builds educational systems. Zone 4's perfectionism ensures 
            quality. Zone 1's instinct sparks innovation.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect everyone to think the same way. The Zone 3 
            master is called "inarticulate." The Zone 6 teacher is called "overthinking." Both are 
            perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Constitutional understanding = compassion.</strong> When you know someone processes 
            at 40 BPM (Zone 3) vs your 100 BPM (Zone 6), you stop rushing them. When you know they 
            need sensory data (Zone 2) vs verbal explanation (Zone 6), you communicate in their language.
          </p>
          <p className="final-note">
            This is the foundation of authentic human connection: <em>meeting each other where we are</em>, 
            not where we think everyone should be.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ThinkingStyleTab;
