import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Aquarius Thinking Style Tab Component
 * Deep dive into cognitive differences across Aquarius zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const AquariusThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Strategic-Revolutionary Thinking",
      archetype: "The Pragmatic Visionary",
      processingSpeed: "Fast (90 BPM)",
      primaryMode: "Strategize \u2192 Innovate \u2192 Build \u2192 Reform",
      thoughtPattern: 'System analyzed \u2192 Innovation designed \u2192 Structure built \u2192 Reform executed',
      decisionMaking: "40% innovates strategically, 25% revolutionary impact, 20% humanitarian benefit, 15% practically feasible",
      decisionSpeed: "Fast (strategic revolutionary insight)",
      learningStyle: "Strategic innovation immersion",
      memoryType: "System-innovation associations",
      abstractionLevel: 90,
      verbalIntelligence: 90,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 80,
      teachingAbility: 80,
      informationPreference: ["Strategic frameworks", "Innovation systems", "Humanitarian models"],
      communicationStyle: "Measured, strategic, pragmatically revolutionary",
      motto: "I revolutionize through strategic discipline"
    },
    {
      zoneId: 2,
      name: "Pure Revolutionary-Intellectual Thinking",
      archetype: "The Genius Visionary",
      processingSpeed: "Very Fast (100 BPM)",
      primaryMode: "Perceive future \u2192 Lightning insight \u2192 Revolutionary leap \u2192 Create new paradigm",
      thoughtPattern: 'Future glimpsed \u2192 Paradigm shattered \u2192 New reality designed \u2192 Humanity transformed',
      decisionMaking: "50% revolutionary/unprecedented, 25% for humanity's future, 15% intellectually brilliant, 10% completely unique",
      decisionSpeed: "Very fast (lightning insight)",
      learningStyle: "Paradigm-shattering absorption \u2014 learns by reinventing",
      memoryType: "Paradigm-revolution memory",
      abstractionLevel: 100,
      verbalIntelligence: 95,
      metaCognition: 90,
      focus: 80,
      cognitiveFlexibility: 95,
      teachingAbility: 70,
      informationPreference: ["Paradigm shifts", "Future technologies", "Abstract theoretical systems"],
      communicationStyle: "Brilliant, eccentric, impossibly abstract",
      motto: "I see the future, I create it"
    },
    {
      zoneId: 3,
      name: "Networked-Revolutionary Thinking",
      archetype: "The Idea Spreader",
      processingSpeed: "Very Fast (100 BPM)",
      primaryMode: "Connect \u2192 Spread \u2192 Network \u2192 Transform",
      thoughtPattern: 'Idea spark \u2192 Network activated \u2192 Viral dissemination \u2192 Collective shift',
      decisionMaking: "45% spreads revolutionary ideas, 30% connects people/movements, 15% intellectually interesting, 10% humanitarian",
      decisionSpeed: "Very fast (instant connections)",
      learningStyle: "Network absorption \u2014 learns by connecting everyone",
      memoryType: "Network-connection memory",
      abstractionLevel: 90,
      verbalIntelligence: 95,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 95,
      teachingAbility: 85,
      informationPreference: ["Network dynamics", "Idea virality", "Social innovation"],
      communicationStyle: "Quick, networked, infectiously enthusiastic",
      motto: "I connect the future through ideas"
    },
    {
      zoneId: 4,
      name: "Collective-Revolutionary Thinking",
      archetype: "The Equality Champion",
      processingSpeed: "Very Fast (100 BPM)",
      primaryMode: "Detect inequality \u2192 Mobilize \u2192 Unite \u2192 Transform",
      thoughtPattern: 'Injustice identified \u2192 Movement mobilized \u2192 Humanity united \u2192 Equality achieved',
      decisionMaking: "55% promotes absolute equality, 25% benefits collective, 15% revolutionary systemic change, 5% intellectually consistent",
      decisionSpeed: "Fast (principle-driven)",
      learningStyle: "Collective immersion \u2014 learns through activism",
      memoryType: "Equality-movement memory",
      abstractionLevel: 85,
      verbalIntelligence: 90,
      metaCognition: 80,
      focus: 85,
      cognitiveFlexibility: 90,
      teachingAbility: 90,
      informationPreference: ["Equality frameworks", "Movement dynamics", "Collective liberation"],
      communicationStyle: "Passionate, principled, collectively focused",
      motto: "I unite humanity through perfect equality"
    },
    {
      zoneId: 5,
      name: "Harmonious-Revolutionary Thinking",
      archetype: "The Diplomatic Reformer",
      processingSpeed: "Fast (90 BPM)",
      primaryMode: "Perceive imbalance \u2192 Design harmony \u2192 Persuade \u2192 Reform",
      thoughtPattern: 'Disharmony sensed \u2192 Beautiful solution designed \u2192 Hearts persuaded \u2192 Graceful reform',
      decisionMaking: "40% innovates harmoniously, 30% diplomatic and fair, 15% aesthetically beautiful, 15% benefits humanity",
      decisionSpeed: "Medium-fast (considers harmony)",
      learningStyle: "Diplomatic innovation \u2014 learns through balanced reform",
      memoryType: "Harmony-reform memory",
      abstractionLevel: 80,
      verbalIntelligence: 90,
      metaCognition: 80,
      focus: 75,
      cognitiveFlexibility: 85,
      teachingAbility: 80,
      informationPreference: ["Diplomatic strategies", "Aesthetic innovation", "Balanced reform"],
      communicationStyle: "Graceful, diplomatic, aesthetically refined",
      motto: "I revolutionize through graceful harmony"
    },
    {
      zoneId: 6,
      name: "Mystical-Revolutionary Thinking",
      archetype: "The Spiritual Futurist",
      processingSpeed: "Moderate-Fast (85 BPM)",
      primaryMode: "Mystical vision \u2192 Spiritual insight \u2192 Compassionate action \u2192 Transcendent service",
      thoughtPattern: 'Spiritual vision received \u2192 Compassion channels \u2192 Innovation transcends \u2192 Humanity blessed',
      decisionMaking: "45% spiritually revolutionary, 25% universal love/compassion, 20% mystically guided, 10% humanitarian",
      decisionSpeed: "Medium (spiritual timing)",
      learningStyle: "Mystical innovation \u2014 learns through spiritual revelation",
      memoryType: "Spiritual-vision memory",
      abstractionLevel: 95,
      verbalIntelligence: 80,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 90,
      teachingAbility: 75,
      informationPreference: ["Mystical visions", "Spiritual innovation", "Transcendent futures"],
      communicationStyle: "Mystical, compassionate, transcendently visionary",
      motto: "I channel the revolutionary future through spirit"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Aquarius Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you innovate, revolutionize, and envision the future
        </p>
        {userZone && (
          <div className="user-thinking-highlight">
            <span className="highlight-icon">{'\u2B50'}</span>
            You are Zone {userZone.id} ({userDegree.toFixed(2)}{'\u00B0'}):
            <strong> {thinkingStyles.find(ts => ts.zoneId === userZone.id)?.name}</strong>
          </div>
        )}
      </header>

      {/* Introduction */}
      <section className="thinking-intro">
        <div className="intro-card">
          <h3>{'\uD83C\uDFAF'} Why This Matters</h3>
          <p>
            Two Aquarius Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 100 BPM with pure revolutionary-intellectual processing, while Zone 6 (25-29{'\u00B0'}) thinks at 85 BPM
            with mystical-revolutionary depth. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through paradigm-shattering lightning insight (Zone 2) vs mystical spiritual revelation (Zone 6), you can meet them where they are.
          </p>
        </div>
      </section>

      {/* Comprehensive Matrix */}
      <section className="thinking-matrix-section">
        <h3 className="section-title">{'\uD83D\uDCCA'} Complete Thinking Style Matrix</h3>
        <p className="matrix-subtitle">
          Scroll horizontally and vertically to see all differences. Space is unlimited{'\u2014'}we capture EVERYTHING.
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
                      <div className="zone-degrees">{zone.degreeRange.start}{'\u00B0'}-{zone.degreeRange.end}{'\u00B0'}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Thinking Style Name */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">{'\uD83C\uDFAD'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDC64'}</span>
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
                  <span className="aspect-icon">{'\u26A1'}</span>
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
                              width: `${parseInt(style.processingSpeed) / 1.5}%`,
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
                  <span className="aspect-icon">{'\uD83D\uDD04'}</span>
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
                  <span className="aspect-icon">{'\uD83E\uDDE9'}</span>
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
                  <span className="aspect-icon">{'\uD83C\uDFAF'}</span>
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
                  <span className="aspect-icon">{'\u23F1\uFE0F'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDCDA'}</span>
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
                  <span className="aspect-icon">{'\u{1F9E0}'}</span>
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
                  <strong>{'\uD83D\uDCCA'} Cognitive Metrics (0-100 Scale)</strong>
                </td>
              </tr>

              {/* Abstraction Level */}
              <tr className="data-row metric-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">{'\uD83C\uDF2B\uFE0F'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDCAC'}</span>
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
                  <span className="aspect-icon">{'\uD83E\uDE9E'}</span>
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
                  <span className="aspect-icon">{'\uD83C\uDFAF'}</span>
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
                  <span className="aspect-icon">{'\uD83E\uDD38'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDC68\u200D\uD83C\uDFEB'}</span>
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
                  <strong>{'\uD83D\uDCAC'} Communication & Expression</strong>
                </td>
              </tr>

              {/* Information Preference */}
              <tr className="data-row">
                <td className="aspect-label sticky-col">
                  <span className="aspect-icon">{'\uD83D\uDCCA'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDDE3\uFE0F'}</span>
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
                  <span className="aspect-icon">{'\uD83D\uDCAD'}</span>
                  <strong>Cognitive Motto</strong>
                </td>
                {zones.map(zone => {
                  const style = thinkingStyles.find(ts => ts.zoneId === zone.id);
                  return (
                    <td key={zone.id} className={userZone?.id === zone.id ? 'user-zone-cell' : ''}>
                      <div className="motto">{'\u201C'}{style.motto}{'\u201D'}</div>
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
        <h3 className="section-title">{'\uD83D\uDD06'} Hexagon Radar Visualizations</h3>
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
              <span className="flap-icon">{expandedFlap === 'extremes' ? '\u25BC' : '\u25B6'}</span>
              <h4>Opposite Extremes: Zone 2 vs Zone 6</h4>
              <span className="flap-badge">Most Different</span>
            </button>
            {expandedFlap === 'extremes' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDFAD'} The Genius Visionary vs The Spiritual Futurist</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Genius Visionary</h6>
                        <ul>
                          <li>{'\u26A1'} 100 BPM - Very fast, lightning processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 100% abstraction - Maximum theoretical depth</li>
                          <li>{'\uD83D\uDCAC'} 95% verbal - Brilliantly articulate</li>
                          <li>{'\uD83E\uDE9E'} 90% meta-cognition - Aware of own genius</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Spread across paradigms</li>
                          <li>{'\uD83E\uDD38'} 95% flexibility - Infinite paradigm shifts</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I see the future, I create it.{'\u201D'}
                          Maximum abstraction with paradigm-shattering speed. Processes everything through
                          revolutionary intellectual leaps. The most brilliantly innovative zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Spiritual Futurist</h6>
                        <ul>
                          <li>{'\u26A1'} 85 BPM - Moderate-fast, spiritually timed</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 95% abstraction - Mystical theoretical depth</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal - Compassionately articulate</li>
                          <li>{'\uD83E\uDE9E'} 75% meta-cognition - Spiritually aware</li>
                          <li>{'\uD83C\uDFAF'} 70% focus - Diffused by mystical vision</li>
                          <li>{'\uD83E\uDD38'} 90% flexibility - Transcendent adaptability</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I channel the revolutionary future through spirit.{'\u201D'}
                          Near-maximum abstraction channeled through mystical compassion. Processes innovation
                          through spiritual revelation rather than pure intellect. The transcendent visionary.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 revolutionizes through pure intellectual genius.
                      Zone 6 revolutionizes through mystical spiritual vision.
                      Together they represent Aquarius{'\u2019'}s full revolutionary spectrum: from paradigm-shattering brilliance to transcendent spiritual futurism.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 2: Cusp Comparisons */}
          <div className={`flap ${expandedFlap === 'cusps' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('cusps')}>
              <span className="flap-icon">{expandedFlap === 'cusps' ? '\u25BC' : '\u25B6'}</span>
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
                    <h5>{'\uD83C\uDF09'} The Bridge Thinkers</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 1: Capricorn-Aquarius Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDFD4\uFE0F'} Capricorn influence adds strategic discipline (90 verbal)</li>
                          <li>{'\u26A1'} 90 BPM - Fast, structured revolutionary thinker</li>
                          <li>{'\uD83D\uDCAD'} Strategize {'\u2192'} Innovate {'\u2192'} Build {'\u2192'} Reform</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Disciplined concentration</li>
                          <li>{'\uD83D\uDCCA'} Strategic frameworks drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air grounded by Earth. Can BUILD with
                          pragmatic discipline that other Aquarius zones channel as pure revolution.
                          The pragmatic visionary who bridges innovation and structure with strategic precision.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Aquarius-Pisces Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDF0A'} Pisces influence adds mysticism, compassion, spiritual vision</li>
                          <li>{'\u26A1'} 85 BPM - Moderated by spiritual depth</li>
                          <li>{'\uD83D\uDCAD'} Mystical vision {'\u2192'} Spiritual insight {'\u2192'} Compassionate action {'\u2192'} Transcendent service</li>
                          <li>{'\uD83C\uDFAF'} 70% focus - Diffused by mystical awareness</li>
                          <li>{'\uD83D\uDCCA'} Spiritual revelation drives decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air dissolved by Water. Can CHANNEL and transmit
                          revolutionary insights through spiritual compassion rather than pure intellect. The spiritual futurist who
                          transforms Aquarius{'\u2019'}s brilliance into universal mystical service.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges innovation and structure (Capricorn cusp).
                      Zone 6 bridges revolution and spirituality (Pisces cusp). Both are more grounded than
                      pure Aquarius, but in different ways: pragmatic discipline vs mystical compassion. Zone 1 teaching ability (80)
                      benefits from Capricorn{'\u2019'}s structured communication, while Zone 6 teaching ability (75) is tempered by
                      Pisces{'\u2019'} tendency toward mystical abstraction that can be harder to articulate clearly.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 3: Decan Progression */}
          <div className={`flap ${expandedFlap === 'decans' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('decans')}>
              <span className="flap-icon">{expandedFlap === 'decans' ? '\u25BC' : '\u25B6'}</span>
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
                    <h5>{'\uD83C\uDF1F'} The Decan Evolution</h5>
                    <div className="three-way-grid">
                      <div className="zone-analysis">
                        <h6>Zone 2: Uranus/Uranus (1st Decan)</h6>
                        <p><strong>Pure Aquarius - The Genius Visionary</strong></p>
                        <ul>
                          <li>{'\u26A1'} 100% Uranus influence</li>
                          <li>{'\uD83D\uDD2E'} Shatter paradigms first, build later</li>
                          <li>{'\uD83D\uDCAC'} 95% verbal (brilliantly eccentric)</li>
                          <li>{'\uD83C\uDFAF'} 80% focus (spread across visions)</li>
                          <li>{'\uD83D\uDCDA'} Paradigm-shattering absorption</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Uranus/Mercury (2nd Decan)</h6>
                        <p><strong>Aquarius + Gemini - Equality Champion</strong></p>
                        <ul>
                          <li>{'\uD83D\uDCAC'} Mercury adds communication + activism</li>
                          <li>{'\u270A'} Mobilize then transform</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (passionately principled)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (principle-driven depth)</li>
                          <li>{'\uD83D\uDCDA'} Collective immersion through activism</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Uranus/Venus (3rd Decan)</h6>
                        <p><strong>Aquarius + Pisces Cusp - Spiritual Futurist</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF0A'} Venus/Neptune adds mysticism + compassion</li>
                          <li>{'\uD83D\uDD4A\uFE0F'} Channel then transcend</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal (mystically compassionate)</li>
                          <li>{'\uD83C\uDFAF'} 70% focus (diffused by spiritual vision)</li>
                          <li>{'\uD83D\uDCDA'} Mystical innovation through revelation</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Aquarius from pure
                      paradigm-shattering genius (Zone 2) through collective equality activism (Zone 4) to mystical spiritual futurism (Zone 6).
                      It{'\u2019'}s a progression from raw revolutionary brilliance to transcendent compassionate service. Abstraction peaks at
                      Zone 2 (100%) where Uranus{'\u2019'}s pure revolutionary power demands maximum theoretical capacity, while
                      verbal intelligence shifts (95% {'\u2192'} 90% {'\u2192'} 80%) as Aquarius moves from
                      intellectual articulation to mystical expression that transcends words.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 4: Teaching Ability Comparison */}
          <div className={`flap ${expandedFlap === 'teaching' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('teaching')}>
              <span className="flap-icon">{expandedFlap === 'teaching' ? '\u25BC' : '\u25B6'}</span>
              <h4>Teaching Ability Across All Zones</h4>
              <span className="flap-badge">Educational Capacity</span>
            </button>
            {expandedFlap === 'teaching' && (
              <div className="flap-content">
                <div className="teaching-comparison">
                  <h5>{'\uD83D\uDC68\u200D\uD83C\uDFEB'} Who Can Teach and How?</h5>
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
                              style.zoneId === 1 ? "Teaches through strategic frameworks and structured innovation \u2014 \"Let me show you how to build the future systematically\"" :
                              style.zoneId === 2 ? "Teaches through paradigm-shattering revelation \u2014 \"Everything you know is wrong; let me show you what's coming\"" :
                              style.zoneId === 3 ? "Teaches through viral idea networks \u2014 \"Connect with this idea and spread it everywhere\"" :
                              style.zoneId === 4 ? "Teaches through collective mobilization \u2014 \"We rise together or not at all; let me show you equality\"" :
                              style.zoneId === 5 ? "Teaches through diplomatic persuasion \u2014 \"Let me show you how harmony and innovation coexist beautifully\"" :
                              "Teaches through mystical spiritual insight \u2014 \"The future speaks through spirit; let me channel it for you\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Builds structured curricula that take students from current reality to revolutionary understanding through disciplined steps" :
                              style.zoneId === 2 ? "Shatters students' existing paradigms with lightning insights that force them to rebuild their entire worldview" :
                              style.zoneId === 3 ? "Creates infectious learning networks where ideas spread virally and students teach each other through connection" :
                              style.zoneId === 4 ? "Mobilizes entire classrooms into collective action, teaching equality principles through lived activist experience" :
                              style.zoneId === 5 ? "Persuades students through aesthetic beauty and diplomatic grace, making revolutionary ideas feel harmonious and natural" :
                              "Channels spiritual visions into learning experiences that transcend ordinary education and touch the mystical"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 4 (90% teaching) is Aquarius{'\u2019'}s best teacher
                    because Mercury{'\u2019'}s communication energy combined with collective activism creates passionate, principled instruction that mobilizes learners. Zone 2 (70% teaching)
                    teaches least effectively{'\u2014'}its genius is so far ahead that translating paradigm-shattering visions into accessible lessons is challenging. Zone 3 (85% teaching)
                    excels through networked learning, making ideas infectious across communities. The pattern:
                    Aquarius teaches by REVOLUTIONIZING your thinking, not by repeating what{'\u2019'}s already known.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Famous Examples Section */}
      <section className="famous-examples-thinking">
        <h3 className="section-title">{'\uD83C\uDFAD'} Famous Examples & Their Thinking Styles</h3>

        <div className="examples-grid">
          <div className="example-card">
            <h4>{'\u26A1'} Innovators & Geniuses</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Pragmatic visionaries to pure revolutionary geniuses</p>
              <ul>
                <li><strong>Oprah Winfrey:</strong> Zone 1 {'\u2014'} the Pragmatic Visionary who strategically revolutionized media through disciplined innovation, built an empire by bridging Capricorn structure with Aquarian humanitarian vision, transformed television with strategic revolutionary precision</li>
                <li><strong>Thomas Edison:</strong> Zone 2 {'\u2014'} the Genius Visionary who shattered every existing paradigm of technology, perceived futures no one else could imagine, created entirely new realities through pure revolutionary-intellectual lightning</li>
              </ul>
              <p className="example-note">
                Why different zones? Oprah Winfrey strategizes with pragmatic discipline (Zone 1 verbal intelligence 90%, focus 85%).
                Edison paradigm-shattered with pure genius (Zone 2 abstraction 100%, flexibility 95%).
                Both Aquarius air, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDF0D'} Networkers & Equality Champions</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Idea spreaders to equality champions</p>
              <ul>
                <li><strong>Ed Sheeran:</strong> Zone 3 {'\u2014'} the Idea Spreader who connected millions through music as a viral network, infectious enthusiasm that spreads ideas and emotions across every social boundary, builds bridges between people through creative innovation</li>
                <li><strong>Abraham Lincoln:</strong> Zone 4 {'\u2014'} the Equality Champion who detected the deepest inequality in American society and mobilized an entire nation to transform, principle-driven revolutionary who united humanity through the conviction that all people are equal</li>
              </ul>
              <p className="example-note">
                Zone 3 = spreading revolutionary ideas through infectious networks. Zone 4 = mobilizing
                collective transformation through equality principles. Ed Sheeran networks ideas virally (Zone 3 flexibility 95%, verbal 95%). Abraham Lincoln
                championed equality with unwavering principle (Zone 4 focus 85%, teaching 90%). Both Aquarius depth, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDF1F'} Diplomats & Mystics</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Diplomatic reformers to spiritual futurists</p>
              <ul>
                <li><strong>Ellen DeGeneres:</strong> Zone 5 {'\u2014'} the Diplomatic Reformer who revolutionized cultural acceptance through graceful harmony, perceived social imbalance and designed beautiful solutions that persuaded hearts, transformed society through diplomatic innovation and aesthetic charm</li>
                <li><strong>Shakira:</strong> Zone 6 {'\u2014'} the Spiritual Futurist who channels mystical creative vision into humanitarian service, transcendent artistry that blesses humanity through compassionate innovation, spiritual depth that transforms music into a vehicle for universal love</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the heart-centered Aquarius. Ellen DeGeneres reformed through graceful diplomacy
                (Zone 5 verbal 90%, flexibility 85%). Shakira channels spiritual vision into service
                (Zone 6 abstraction 95%, flexibility 90%). Both prove Aquarius can harmonize and transcend,
                not just revolutionize through pure intellect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\u26A1'} Air Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} Innovation & Technology</h4>
            <p>
              <strong>Zone 1:</strong> Excels at strategic innovation {'\u2014'} builds revolutionary systems with pragmatic discipline,
              designing frameworks that transform industries through structured progress. Verbal intelligence (90%) makes them natural tech architects.<br/>
              <strong>Zone 2:</strong> Excels at paradigm-shattering invention {'\u2014'} perceives futures no one else can see,
              total immersion in creating entirely new realities. Abstraction (100%) creates an unmatched visionary lens.<br/>
              <strong>Zone 4:</strong> Excels at technology for equality {'\u2014'} builds systems that democratize access,
              innovation as activism. Teaching ability (90%) allows them to mobilize entire communities toward tech-enabled justice.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF10'} Social Movements & Activism</h4>
            <p>
              <strong>Zone 4:</strong> The ultimate equality activist {'\u2014'} detects injustice before others see it,
              mobilizes collective movements with principle-driven conviction, unites diverse people into unstoppable forces for change.<br/>
              <strong>Zone 3:</strong> The networked revolutionary {'\u2014'} spreads ideas virally across communities,
              connects people and movements that amplify each other exponentially.<br/>
              <strong>Zone 1:</strong> The strategic reformer {'\u2014'} builds sustainable institutional change,
              creates frameworks that make revolution permanent rather than temporary.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFA8'} Creative & Artistic Innovation</h4>
            <p>
              <strong>Zone 5:</strong> Aesthetic revolution {'\u2014'} the diplomatic reformer channels innovation
              through beauty and harmony, creating art that transforms society gracefully.<br/>
              <strong>Zone 6:</strong> Mystical artistry {'\u2014'} channels spiritual visions into transcendent creative works,
              innovation that touches the soul and serves humanity through compassionate beauty.<br/>
              <strong>Zone 2:</strong> Avant-garde genius {'\u2014'} shatters every artistic paradigm to create
              forms of expression that didn{'\u2019'}t exist before, impossibly abstract yet brilliantly original.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Research & Theoretical Systems</h4>
            <p>
              <strong>Paradigm-shattering research:</strong> Zone 2{'\u2019'}s paradigm-revolution memory makes them the
              ultimate theoretical researcher, the one who reinvents entire fields of knowledge,
              perceiving connections and futures that redefine what{'\u2019'}s possible.<br/>
              <strong>Strategic systems design:</strong> Zone 1{'\u2019'}s system-innovation associations allow them to build
              comprehensive theoretical frameworks{'\u2014'}turning revolutionary insights into structured, implementable systems.<br/>
              <strong>Mystical synthesis:</strong> Zone 6{'\u2019'}s spiritual-vision memory connects
              disparate findings into transcendent understanding that bridges science and spirituality.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Revolutionary Intelligence</h3>
          <p>
            Aquarius{'\u2019'}s thinking style is not eccentricity to be normalized but a profound revolutionary
            intelligence system. From the pragmatic visionary (Zone 1) through the genius visionary
            (Zone 2), the idea spreader (Zone 3), the equality champion (Zone 4), the diplomatic
            reformer (Zone 5), to the spiritual futurist (Zone 6) {'\u2014'} each zone represents a different
            facet of Uranus{'\u2019'}s and Saturn{'\u2019'}s combined wisdom.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Aquarians to be the same. The Zone 2
            genius is called {'\u201C'}too eccentric.{'\u201D'} The Zone 3 networker is called {'\u201C'}too scattered.{'\u201D'}
            The Zone 4 activist is called {'\u201C'}too idealistic.{'\u201D'} The Zone 6 mystic is called {'\u201C'}too otherworldly.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Aquarius zone reveals HOW you revolutionize, WHY you innovate, and WHERE
            your visionary gifts can transform the world.</strong> When you know someone processes through
            pure paradigm-shattering genius (Zone 2) vs mystical spiritual revelation (Zone 6), you communicate
            in their language. When you understand that Zone 2{'\u2019'}s intellectual brilliance (100% abstraction, 95% flexibility) and Zone 4{'\u2019'}s
            collective activism (85% focus, 90% teaching) are equally valid, you stop demanding that all Aquarians
            express revolution the same way.
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

export default AquariusThinkingStyleTab;
