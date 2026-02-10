import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Capricorn Thinking Style Tab Component
 * Deep dive into cognitive differences across Capricorn zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const CapricornThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Strategic-Visionary Thinking",
      archetype: "The Philosophical Executive",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Envision \u2192 Strategize \u2192 Plan \u2192 Execute",
      thoughtPattern: 'Vision formed \u2192 Strategy designed \u2192 Plan structured \u2192 Execution launched',
      decisionMaking: "40% advances strategic vision, 25% builds lasting structure, 20% philosophically meaningful, 15% increases status",
      decisionSpeed: "Medium (strategic vision + planning)",
      learningStyle: "Strategic philosophical immersion with visionary depth",
      memoryType: "Strategic-vision associations",
      abstractionLevel: 75,
      verbalIntelligence: 85,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["Strategic frameworks", "Philosophical leadership models", "Visionary pathways"],
      communicationStyle: "Measured, philosophical, strategically optimistic",
      motto: "I build empires through visionary strategy"
    },
    {
      zoneId: 2,
      name: "Pure Strategic-Disciplined Thinking",
      archetype: "The Master Builder",
      processingSpeed: "Slow (75 BPM)",
      primaryMode: "Calculate \u2192 Plan \u2192 Build \u2192 Master",
      thoughtPattern: 'Goal identified \u2192 Strategy calculated \u2192 Discipline activated \u2192 Mastery achieved',
      decisionMaking: "50% builds toward mastery, 25% strategic advantage, 15% increases power/status, 10% responsible/dutiful",
      decisionSpeed: "Very slow (methodical calculation)",
      learningStyle: "Methodical systematic mastery \u2014 learns by doing repeatedly",
      memoryType: "Achievement-mastery memory",
      abstractionLevel: 70,
      verbalIntelligence: 80,
      metaCognition: 90,
      focus: 100,
      cognitiveFlexibility: 50,
      teachingAbility: 65,
      informationPreference: ["Proven methods", "Strategic systems", "Mastery pathways"],
      communicationStyle: "Precise, measured, controlled authority",
      motto: "I climb methodically to absolute mastery"
    },
    {
      zoneId: 3,
      name: "Patient-Material Thinking",
      archetype: "The Wealth Builder",
      processingSpeed: "Slow (70 BPM)",
      primaryMode: "Assess \u2192 Accumulate \u2192 Protect \u2192 Grow",
      thoughtPattern: 'Resources assessed \u2192 Accumulation planned \u2192 Protection secured \u2192 Wealth grows',
      decisionMaking: "50% increases wealth/resources, 25% material security, 15% quality/aesthetic value, 10% strategic positioning",
      decisionSpeed: "Very slow (patient accumulation)",
      learningStyle: "Patient material mastery \u2014 learns through accumulation",
      memoryType: "Resource-value memory",
      abstractionLevel: 60,
      verbalIntelligence: 75,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 55,
      teachingAbility: 60,
      informationPreference: ["Material value", "Quality markers", "Wealth strategies"],
      communicationStyle: "Conservative, measured, quality-conscious",
      motto: "I build wealth through patient mastery"
    },
    {
      zoneId: 4,
      name: "Empire-Building Thinking",
      archetype: "The Dynasty Founder",
      processingSpeed: "Slow (70 BPM)",
      primaryMode: "Dominate \u2192 Control \u2192 Build \u2192 Legacy",
      thoughtPattern: 'Empire envisioned \u2192 Control established \u2192 Dynasty built \u2192 Legacy secured',
      decisionMaking: "55% builds dynasty/empire, 25% increases power/control, 12% material dominance, 8% strategic mastery",
      decisionSpeed: "Slow (empire-building timeframe)",
      learningStyle: "Dynasty-building immersion \u2014 learns through power accumulation",
      memoryType: "Power-dynasty memory",
      abstractionLevel: 65,
      verbalIntelligence: 80,
      metaCognition: 85,
      focus: 100,
      cognitiveFlexibility: 50,
      teachingAbility: 55,
      informationPreference: ["Power structures", "Empire strategies", "Generational legacies"],
      communicationStyle: "Commanding, authoritative, ruthlessly strategic",
      motto: "I build empires that outlast time"
    },
    {
      zoneId: 5,
      name: "Perfectionist-Strategic Thinking",
      archetype: "The Flawless Executive",
      processingSpeed: "Moderate (75 BPM)",
      primaryMode: "Analyze \u2192 Perfect \u2192 Systematize \u2192 Excel",
      thoughtPattern: 'Flaws detected \u2192 Systems perfected \u2192 Excellence achieved \u2192 Standards raised',
      decisionMaking: "50% can be done PERFECTLY, 25% strategic advantage, 15% analytical soundness, 10% meets standards",
      decisionSpeed: "Slow (analyzes for perfection)",
      learningStyle: "Analytical perfectionist learning \u2014 dissects to master",
      memoryType: "Systematic-perfection memory",
      abstractionLevel: 65,
      verbalIntelligence: 90,
      metaCognition: 95,
      focus: 100,
      cognitiveFlexibility: 55,
      teachingAbility: 75,
      informationPreference: ["Systematic analysis", "Quality standards", "Perfection methods"],
      communicationStyle: "Analytically precise, critically constructive",
      motto: "I achieve through flawless discipline"
    },
    {
      zoneId: 6,
      name: "Innovative-Strategic Thinking",
      archetype: "The Revolutionary Builder",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Innovate \u2192 Strategize \u2192 Reform \u2192 Build",
      thoughtPattern: 'Innovation spotted \u2192 Strategy formed \u2192 System reformed \u2192 Future built',
      decisionMaking: "45% innovates systems, 25% strategic advancement, 20% revolutionary impact, 10% practical feasibility",
      decisionSpeed: "Medium (strategic innovation)",
      learningStyle: "Innovative strategic learning \u2014 experiments within structure",
      memoryType: "Innovation-reform memory",
      abstractionLevel: 80,
      verbalIntelligence: 85,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 75,
      teachingAbility: 80,
      informationPreference: ["Innovation frameworks", "System reform", "Future infrastructure"],
      communicationStyle: "Progressive, strategic, forward-thinking",
      motto: "I revolutionize through strategic discipline"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Capricorn Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you strategize, discipline, and master reality
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
            Two Capricorn Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 75 BPM with pure strategic-disciplined processing, while Zone 6 (25-29{'\u00B0'}) thinks at 80 BPM
            with innovative-strategic flexibility. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through pure methodical mastery (Zone 2) vs innovative strategic reform (Zone 6), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} The Master Builder vs The Revolutionary Builder</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Master Builder</h6>
                        <ul>
                          <li>{'\u26A1'} 75 BPM - Slow, methodical processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 70% abstraction - Grounded strategic reality</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal - Precise, measured authority</li>
                          <li>{'\uD83E\uDE9E'} 90% meta-cognition - Deep self-awareness of mastery path</li>
                          <li>{'\uD83C\uDFAF'} 100% focus - Absolute disciplined lock</li>
                          <li>{'\uD83E\uDD38'} 50% flexibility - Rigid, iron discipline</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I climb methodically to absolute mastery.{'\u201D'}
                          Maximum focus with iron discipline. Processes everything through
                          methodical calculation and systematic building. The most purely strategic zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Revolutionary Builder</h6>
                        <ul>
                          <li>{'\u26A1'} 80 BPM - Moderate, innovative pace</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 80% abstraction - Progressive vision</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal - Forward-thinking articulation</li>
                          <li>{'\uD83E\uDE9E'} 85% meta-cognition - Strategic self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 90% focus - Strategic innovation depth</li>
                          <li>{'\uD83E\uDD38'} 75% flexibility - Open to revolutionary ideas</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I revolutionize through strategic discipline.{'\u201D'}
                          The highest flexibility in Capricorn. Channels
                          strategy into innovation. The progressive builder who reforms systems.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 builds through pure discipline.
                      Zone 6 innovates through strategic revolution.
                      Together they represent Capricorn{'\u2019'}s full arc: from traditional mastery to progressive innovation.
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
                        <h6>Zone 1: Sagittarius-Capricorn Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDFF9'} Jupiter adds philosophical vision (85 verbal)</li>
                          <li>{'\u26A1'} 80 BPM - Visionary strategic pace</li>
                          <li>{'\uD83D\uDCAD'} Envision {'\u2192'} Strategize {'\u2192'} Plan {'\u2192'} Execute</li>
                          <li>{'\uD83C\uDFAF'} 90% focus - Strategic concentration</li>
                          <li>{'\uD83D\uDCCA'} Strategic visions + philosophical meaning drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth enriched by Fire. Can ENVISION with
                          philosophical precision that other Capricorn zones channel as pure strategy.
                          The philosophical executive who bridges ambition and meaning with visionary grace.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Capricorn-Aquarius Cusp</h6>
                        <ul>
                          <li>{'\u26A1'} Uranus adds innovative revolution, humanitarian vision</li>
                          <li>{'\u26A1'} 80 BPM - Progressive strategic pace</li>
                          <li>{'\uD83D\uDCAD'} Innovate {'\u2192'} Strategize {'\u2192'} Reform {'\u2192'} Build</li>
                          <li>{'\uD83C\uDFAF'} 90% focus - Innovation concentration</li>
                          <li>{'\uD83D\uDCCA'} System innovation + strategic reform drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth electrified by Air. Can INNOVATE within
                          strategic structures rather than maintaining them rigidly. The revolutionary builder who
                          transforms Capricorn{'\u2019'}s discipline into progressive systemic reform.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges philosophy and strategy (Sagittarius cusp).
                      Zone 6 bridges tradition and revolution (Aquarius cusp). Both are more open than
                      pure Capricorn, but in different ways: philosophical vision vs progressive innovation.
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
                        <h6>Zone 2: Saturn/Saturn (1st Decan)</h6>
                        <p><strong>Pure Capricorn - The Master Builder</strong></p>
                        <ul>
                          <li>{'\uD83E\uDDF1'} 100% Saturn influence</li>
                          <li>{'\uD83D\uDCCF'} Calculate and build</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal (precise)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (total mastery)</li>
                          <li>{'\uD83D\uDCDA'} Methodical systematic mastery</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Saturn/Venus (2nd Decan)</h6>
                        <p><strong>Capricorn + Taurus - Dynasty Founder</strong></p>
                        <ul>
                          <li>{'\uD83D\uDC8E'} Venus adds material dynasty</li>
                          <li>{'\uD83D\uDC51'} Dominate and control</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal (commanding)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (empire-building)</li>
                          <li>{'\uD83D\uDCDA'} Dynasty-building immersion</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Saturn/Mercury (3rd Decan)</h6>
                        <p><strong>Capricorn + Aquarius Cusp - Revolutionary Builder</strong></p>
                        <ul>
                          <li>{'\u26A1'} Mercury/Uranus adds innovation</li>
                          <li>{'\uD83D\uDD27'} Innovate and reform</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (forward-thinking)</li>
                          <li>{'\uD83C\uDFAF'} 90% focus (strategic innovation)</li>
                          <li>{'\uD83D\uDCDA'} Innovative strategic learning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Capricorn from pure
                      methodical mastery (Zone 2) through material dynasty-building (Zone 4) to innovative strategic revolution (Zone 6).
                      Flexibility rises from 50% to 75% as earth learns to adapt.
                      It{'\u2019'}s a progression from raw disciplined power to progressive innovation mastery.
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
                              style.zoneId === 1 ? "Teaches through strategic philosophical mentorship \u2014 \"Let me show you the visionary path to mastery\"" :
                              style.zoneId === 2 ? "Teaches through silent disciplined example \u2014 \"Watch me work, then replicate my methods\"" :
                              style.zoneId === 3 ? "Teaches through patient material demonstration \u2014 \"This is how wealth is built, step by step\"" :
                              style.zoneId === 4 ? "Teaches through dynasty-building authority \u2014 \"My empire shows you what's possible through discipline\"" :
                              style.zoneId === 5 ? "Teaches through perfectionist systematic instruction \u2014 \"Here is the flawless system, follow it precisely\"" :
                              "Teaches through innovative strategic mentorship \u2014 \"Let me show you how to build the future\""
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zones 1 and 6 (both 80% teaching) are Capricorn{'\u2019'}s best teachers
                    because cusps add communication skills. Zone 4 (55% teaching)
                    teaches least verbally{'\u2014'}it leads by dominant example. The pattern:
                    Capricorn teaches by DEMONSTRATING mastery, not by theorizing about it.
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
            <h4>{'\uD83C\uDFD4\uFE0F'} Strategists & Builders</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Philosophical executives to pure master builders</p>
              <ul>
                <li><strong>Denzel Washington:</strong> Zone 1 {'\u2014'} the Philosophical Executive who built a legendary career through strategic discipline and visionary depth</li>
                <li><strong>Tiger Woods:</strong> Zone 2 {'\u2014'} the Master Builder who achieved golfing mastery through relentless methodical discipline and total focus</li>
              </ul>
              <p className="example-note">
                Why different zones? Denzel Washington strategizes with philosophical vision (Zone 1 verbal intelligence 85%, focus 90%).
                Tiger Woods methodically builds mastery through iron discipline (Zone 2 focus 100%, meta-cognition 90%).
                Both Capricorn earth, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDC8E'} Empire Builders & Dynasties</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Wealth builders to dynasty founders</p>
              <ul>
                <li><strong>Jeff Bezos:</strong> Zone 3 {'\u2014'} the Wealth Builder who accumulated the world{'\u2019'}s largest material empire through patient strategic accumulation</li>
                <li><strong>Alexander Hamilton:</strong> Zone 4 {'\u2014'} the Dynasty Founder who built America{'\u2019'}s financial infrastructure through relentless empire-building ambition</li>
              </ul>
              <p className="example-note">
                Zone 3 = wealth through patient material mastery and accumulation. Zone 4 = empire through
                dynasty-building dominance and control. Jeff Bezos accumulated patiently (Zone 3 focus 95%, abstraction 60%). Alexander Hamilton
                built empires relentlessly (Zone 4 focus 100%, meta-cognition 85%). Both Capricorn depth, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2699\uFE0F'} Perfectionists & Innovators</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Flawless executives to revolutionary builders</p>
              <ul>
                <li><strong>Michelle Obama:</strong> Zone 5 {'\u2014'} the Flawless Executive who achieved through systematic perfectionist excellence and analytical precision</li>
                <li><strong>Benjamin Franklin:</strong> Zone 6 {'\u2014'} the Revolutionary Builder who innovated America{'\u2019'}s infrastructure through strategic progressive discipline</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the precision-driven Capricorn. Michelle Obama perfects systems with analytical mastery
                (Zone 5 focus 100%, meta-cognition 95%). Benjamin Franklin innovated through strategic reform
                (Zone 6 verbal 85%, flexibility 75%). Both prove Capricorn can perfect and revolutionize the world,
                not just maintain the status quo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83C\uDFD4\uFE0F'} Earth Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83C\uDFD4\uFE0F'} Strategic Leadership</h4>
            <p>
              <strong>Zone 1:</strong> Excels at visionary strategic leadership {'\u2014'} envisions long-term goals with philosophical depth,
              then structures precise plans to achieve them. Verbal intelligence (85%) makes them natural strategic communicators who inspire through vision.<br/>
              <strong>Zone 2:</strong> Excels at methodical disciplined leadership {'\u2014'} leads by example through relentless mastery,
              calculating every move with iron patience. Focus (100%) creates an unshakeable foundation of authority.<br/>
              <strong>Zone 4:</strong> Excels at empire-building leadership {'\u2014'} commands with authoritative dominance,
              building dynasties through ruthless strategic control. Focus (100%) combined with power-dynasty memory creates generational impact.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCBC'} Business & Finance</h4>
            <p>
              <strong>Zone 3:</strong> The ultimate wealth builder {'\u2014'} assesses resources with patient precision,
              accumulates material value methodically, protects wealth with conservative mastery. Don{'\u2019'}t rush them; they BUILD fortunes.<br/>
              <strong>Zone 4:</strong> The empire architect {'\u2014'} builds financial dynasties through dominant control,
              creates generational wealth structures that outlast time.<br/>
              <strong>Zone 6:</strong> The innovative strategist {'\u2014'} reforms business systems through progressive innovation,
              channels strategic discipline into future-building enterprises that transform industries.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\u2699\uFE0F'} Systems & Operations</h4>
            <p>
              <strong>Zone 2:</strong> Systematic mastery operations {'\u2014'} the master builder creates flawless systems
              through methodical repetition and disciplined refinement until every component works perfectly.<br/>
              <strong>Zone 5:</strong> Perfectionist systems engineering {'\u2014'} the flawless executive detects every flaw,
              perfects every process, and raises standards until systems achieve analytical excellence.<br/>
              <strong>Zone 6:</strong> Innovation-driven operations {'\u2014'} the revolutionary builder reforms outdated systems,
              experiments within structure, and builds future infrastructure through strategic progressive design.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCCA'} Research & Analysis</h4>
            <p>
              <strong>Strategic vision:</strong> Zone 1{'\u2019'}s strategic-vision associations allow them to see
              the big picture with philosophical depth{'\u2014'}connecting disparate data points into visionary frameworks
              that guide long-term research direction.<br/>
              <strong>Perfectionist analysis:</strong> Zone 5{'\u2019'}s systematic-perfection memory makes them the
              ultimate analyst, the one who will not rest until every detail is flawless,
              dissecting every dataset until nothing remains unexamined.<br/>
              <strong>Innovative synthesis:</strong> Zone 6{'\u2019'}s innovation-reform memory connects
              traditional findings with progressive insights, transforming research fields through strategic revolutionary thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Strategic Intelligence</h3>
          <p>
            Capricorn{'\u2019'}s thinking style is not a coldness to be warmed but a profound strategic
            intelligence system. From the philosophical executive (Zone 1) through the master builder
            (Zone 2), the wealth builder (Zone 3), the dynasty founder (Zone 4), the flawless
            executive (Zone 5), to the revolutionary builder (Zone 6) {'\u2014'} each zone represents a different
            facet of Saturn{'\u2019'}s mastery wisdom.
          </p>
          <p>
            <strong>The tragedy:</strong> Zone 2 master builder called {'\u201C'}too cold.{'\u201D'} Zone 3
            wealth builder called {'\u201C'}too materialistic.{'\u201D'}
            Zone 4 empire builder called {'\u201C'}too ruthless.{'\u201D'} Zone 5
            perfectionist called {'\u201C'}too critical.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Capricorn zone reveals HOW you build, WHY you climb, and WHERE
            your strategic gifts can structure the world.</strong> When you know someone processes through
            pure methodical mastery (Zone 2) vs innovative strategic reform (Zone 6), you communicate
            in their language. When you understand that Zone 6{'\u2019'}s progressive innovation (85% verbal, 75% flexibility) and Zone 2{'\u2019'}s
            iron discipline (100% focus, 50% flexibility) are equally valid, you stop demanding that all Capricorns
            express ambition the same way.
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

export default CapricornThinkingStyleTab;
