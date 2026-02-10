import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Libra Thinking Style Tab Component
 * Deep dive into cognitive differences across Libra zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const LibraThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Analytical-Harmonious Thinking",
      archetype: "The Refined Diplomat",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Analyze \u2192 Balance \u2192 Refine \u2192 Harmonize",
      thoughtPattern: 'Detail examined \u2192 Aesthetic weighed \u2192 Grace applied \u2192 Harmony achieved',
      decisionMaking: "30% analysis, 25% aesthetics, 25% diplomacy, 20% perfection",
      decisionSpeed: "Slow (meticulous refinement)",
      learningStyle: "Structured comparative analysis",
      memoryType: "Detail-aesthetic associations",
      abstractionLevel: 65,
      verbalIntelligence: 85,
      metaCognition: 80,
      focus: 75,
      cognitiveFlexibility: 75,
      teachingAbility: 80,
      informationPreference: ["Balanced perspectives", "Aesthetic frameworks", "Diplomatic protocols"],
      communicationStyle: "Precisely balanced and elegantly diplomatic",
      motto: "I balance perfection with grace"
    },
    {
      zoneId: 2,
      name: "Pure Relational-Balance Thinking",
      archetype: "The Ultimate Harmonizer",
      processingSpeed: "Moderate (75 BPM)",
      primaryMode: "Relate \u2192 Weigh \u2192 Balance \u2192 Unite",
      thoughtPattern: 'Connection sensed \u2192 Perspectives weighed \u2192 Equilibrium sought \u2192 Harmony created',
      decisionMaking: "40% harmony, 30% relationships, 20% fairness, 10% beauty",
      decisionSpeed: "Very slow (paralyzed by options)",
      learningStyle: "Relational mirroring and partnership",
      memoryType: "Relational-emotional balance memory",
      abstractionLevel: 70,
      verbalIntelligence: 90,
      metaCognition: 70,
      focus: 60,
      cognitiveFlexibility: 95,
      teachingAbility: 75,
      informationPreference: ["Partner perspectives", "Social harmony cues", "Aesthetic beauty"],
      communicationStyle: "Warm, inclusive, people-pleasing",
      motto: "I seek perfect harmony in all things"
    },
    {
      zoneId: 3,
      name: "Progressive-Social Thinking",
      archetype: "The Justice Advocate",
      processingSpeed: "Fast (85 BPM)",
      primaryMode: "Innovate \u2192 Advocate \u2192 Diplomatize \u2192 Reform",
      thoughtPattern: 'Injustice detected \u2192 Principle activated \u2192 Diplomatic strategy formed \u2192 Reform pursued',
      decisionMaking: "35% justice, 30% innovation, 20% social good, 15% diplomacy",
      decisionSpeed: "Medium (principled deliberation)",
      learningStyle: "Socratic debate and intellectual discourse",
      memoryType: "Principle-justice pattern memory",
      abstractionLevel: 85,
      verbalIntelligence: 90,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 90,
      teachingAbility: 85,
      informationPreference: ["Social justice frameworks", "Innovative solutions", "Intellectual debate"],
      communicationStyle: "Intellectually passionate, diplomatically fierce",
      motto: "I balance justice with innovation"
    },
    {
      zoneId: 4,
      name: "Idealistic-Partnership Thinking",
      archetype: "The Equality Champion",
      processingSpeed: "Fast (90 BPM)",
      primaryMode: "Envision \u2192 Champion \u2192 Equalize \u2192 Transform",
      thoughtPattern: 'Ideal conceived \u2192 Inequality detected \u2192 Justice mobilized \u2192 Systems transformed',
      decisionMaking: "40% equality, 25% idealism, 20% justice, 15% revolution",
      decisionSpeed: "Medium-fast (conviction-driven)",
      learningStyle: "Idealistic modeling and systems thinking",
      memoryType: "Visionary-systemic pattern memory",
      abstractionLevel: 90,
      verbalIntelligence: 90,
      metaCognition: 80,
      focus: 75,
      cognitiveFlexibility: 85,
      teachingAbility: 80,
      informationPreference: ["Systemic equality models", "Revolutionary ideas", "Partnership dynamics"],
      communicationStyle: "Passionately intellectual, righteously articulate",
      motto: "I revolutionize through perfect equality"
    },
    {
      zoneId: 5,
      name: "Versatile-Diplomatic Thinking",
      archetype: "The Social Chameleon",
      processingSpeed: "Very fast (95 BPM)",
      primaryMode: "Charm \u2192 Adapt \u2192 Connect \u2192 Navigate",
      thoughtPattern: 'Social field scanned \u2192 Persona adapted \u2192 Charm deployed \u2192 Connection made',
      decisionMaking: "35% social advantage, 25% adaptability, 25% charm, 15% variety",
      decisionSpeed: "Fast (surface-level quick)",
      learningStyle: "Social osmosis and rapid adaptation",
      memoryType: "Social-chameleon situational memory",
      abstractionLevel: 65,
      verbalIntelligence: 95,
      metaCognition: 65,
      focus: 60,
      cognitiveFlexibility: 95,
      teachingAbility: 70,
      informationPreference: ["Social trends", "Communication techniques", "Networking strategies"],
      communicationStyle: "Charming, witty, gracefully adaptive",
      motto: "I charm all through graceful adaptation"
    },
    {
      zoneId: 6,
      name: "Intense-Diplomatic Thinking",
      archetype: "The Passionate Mediator",
      processingSpeed: "Moderate (75 BPM)",
      primaryMode: "Probe \u2192 Mediate \u2192 Transform \u2192 Balance",
      thoughtPattern: 'Depth perceived \u2192 Hidden motives sensed \u2192 Diplomatic intensity applied \u2192 Deep balance restored',
      decisionMaking: "35% depth, 25% fairness, 25% transformation, 15% loyalty",
      decisionSpeed: "Slow (waits for deep understanding)",
      learningStyle: "Investigative depth analysis",
      memoryType: "Deep-emotional loyalty memory",
      abstractionLevel: 60,
      verbalIntelligence: 85,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 65,
      teachingAbility: 65,
      informationPreference: ["Hidden motivations", "Power dynamics", "Transformative truths"],
      communicationStyle: "Intense, penetrating, diplomatically powerful",
      motto: "I balance with passionate intensity"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Libra Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you balance, weigh, and harmonize reality
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
            Two Libra Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 75 BPM with pure relational balance, while Zone 4 (15-19{'\u00B0'}) thinks at 90 BPM
            with idealistic conviction. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through pure relational harmony (Zone 2) vs revolutionary equality (Zone 4), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} Ultimate Harmonizer vs Passionate Mediator</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Ultimate Harmonizer</h6>
                        <ul>
                          <li>{'\u26A1'} 75 BPM - Moderate, relationship-paced</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 70% abstraction - Relational conceptual thinking</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal - Masterful diplomatic language</li>
                          <li>{'\uD83E\uDE9E'} 70% meta-cognition - Aware of own indecision</li>
                          <li>{'\uD83C\uDFAF'} 60% focus - Scattered by multiple perspectives</li>
                          <li>{'\uD83E\uDD38'} 95% flexibility - Adapts to everyone</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I seek perfect harmony in all things.{'\u201D'}
                          Maximum flexibility with supreme verbal intelligence. Processes every decision
                          through the lens of relational harmony. The most people-pleasing zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Passionate Mediator</h6>
                        <ul>
                          <li>{'\u26A1'} 75 BPM - Moderate, intensity-paced</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 60% abstraction - Prefers concrete depth</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal - Penetrating, powerful words</li>
                          <li>{'\uD83E\uDE9E'} 85% meta-cognition - Deep self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Intense concentration</li>
                          <li>{'\uD83E\uDD38'} 65% flexibility - Fixed on fairness</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I balance with passionate intensity.{'\u201D'}
                          The deepest focus and meta-cognition in Libra. Probes beneath diplomatic
                          surfaces to find transformative truth. The most intense zone.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 seeks harmony through infinite flexibility and people-pleasing.
                      Zone 6 seeks balance through passionate intensity and deep investigation.
                      Together they represent Libra{'\u2019'}s full diplomatic spectrum: from graceful accommodation to fierce mediation.
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
                        <h6>Zone 1: Virgo-Libra Cusp</h6>
                        <ul>
                          <li>{'\uD83D\uDD0D'} Virgo influence adds analytical precision (80 meta-cognition)</li>
                          <li>{'\u26A1'} 80 BPM - Methodical Libra thinker</li>
                          <li>{'\uD83D\uDCAD'} Analyze {'\u2192'} Balance {'\u2192'} Refine</li>
                          <li>{'\uD83C\uDFAF'} 75% focus - Disciplined attention</li>
                          <li>{'\uD83D\uDCCA'} Perfectionism drives decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air enriched by Earth. Can ANALYZE harmony
                          with precision that other Libra zones cannot match. The diplomatic analyst who
                          bridges aesthetics and logic with refined elegance.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Libra-Scorpio Cusp</h6>
                        <ul>
                          <li>{'\uD83E\uDD82'} Scorpio influence adds depth, intensity, investigation</li>
                          <li>{'\u26A1'} 75 BPM - Deepened by Plutonian energy</li>
                          <li>{'\uD83D\uDCAD'} Probe {'\u2192'} Mediate {'\u2192'} Transform {'\u2192'} Balance</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Intense concentration</li>
                          <li>{'\uD83D\uDCCA'} Depth and loyalty drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air deepened by Water. Can PROBE beneath
                          diplomatic surfaces to find hidden truths. The passionate mediator who
                          transforms conflict through intense investigation and fierce loyalty.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges harmony and analysis (Virgo cusp).
                      Zone 6 bridges diplomacy and depth (Scorpio cusp). Both are more focused than
                      pure Libra, but in different ways: precision vs intensity. Zone 1 teaching ability (80)
                      and Zone 6 teaching ability (65) differ because analytical precision communicates
                      more systematically than passionate intensity.
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
                        <h6>Zone 2: Venus/Venus (1st Decan)</h6>
                        <p><strong>Pure Libra - Relational Harmonizer</strong></p>
                        <ul>
                          <li>{'\u2665\uFE0F'} 100% Venus influence</li>
                          <li>{'\u2696\uFE0F'} Balance first, decide later</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (supreme)</li>
                          <li>{'\uD83C\uDFAF'} 60% focus (scattered by options)</li>
                          <li>{'\uD83D\uDCDA'} Relational mirroring ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Venus/Uranus (2nd Decan)</h6>
                        <p><strong>Libra + Aquarius - Equality Champion</strong></p>
                        <ul>
                          <li>{'\u26A1'} Uranus adds revolution + idealism</li>
                          <li>{'\uD83C\uDF0D'} Envision then transform</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (passionate)</li>
                          <li>{'\uD83C\uDFAF'} 75% focus (conviction-locked)</li>
                          <li>{'\uD83D\uDCDA'} Idealistic systems thinking</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Venus/Mercury (3rd Decan)</h6>
                        <p><strong>Libra + Scorpio Cusp - Passionate Mediator</strong></p>
                        <ul>
                          <li>{'\uD83E\uDD82'} Pluto/Mercury adds depth + investigation</li>
                          <li>{'\uD83D\uDD0D'} Probe what lies beneath</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (penetrating)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (intense lock)</li>
                          <li>{'\uD83D\uDCDA'} Investigative depth analysis</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Libra from pure
                      relational harmony (Zone 2) through revolutionary idealism (Zone 4) to passionate depth (Zone 6).
                      It{'\u2019'}s a progression from surface balance to deep transformation. Meta-cognition rises steadily
                      (70% {'\u2192'} 80% {'\u2192'} 85%) as Libra develops ever-deeper self-awareness, while
                      focus intensifies (60% {'\u2192'} 75% {'\u2192'} 85%) as the scales gain conviction
                      and purpose.
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
                              style.zoneId === 1 ? "Teaches through refined analysis \u2014 \"Let me show you the balanced perspective you're missing\"" :
                              style.zoneId === 2 ? "Teaches through relational harmony \u2014 \"Let's explore both sides together until we find balance\"" :
                              style.zoneId === 3 ? "Teaches through intellectual debate \u2014 \"Let's reason through this until justice emerges\"" :
                              style.zoneId === 4 ? "Teaches through idealistic vision \u2014 \"Here's what perfect equality looks like and how we get there\"" :
                              style.zoneId === 5 ? "Teaches through social charm \u2014 \"Watch how I adapt and connect, then try it yourself\"" :
                              "Teaches through intense mediation \u2014 \"Let me show you the hidden truth beneath this conflict\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Methodically presents both sides with analytical precision so students see the full picture" :
                              style.zoneId === 2 ? "Creates inclusive learning environments where every voice is heard and valued equally" :
                              style.zoneId === 3 ? "Facilitates Socratic dialogues that awaken students' sense of justice and critical thinking" :
                              style.zoneId === 4 ? "Inspires students with visionary frameworks for creating systemic equality" :
                              style.zoneId === 5 ? "Engages students through charismatic social dynamics and adaptive communication" :
                              "Guides students through deep conflict resolution that transforms understanding"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 3 (85% teaching) is Libra{'\u2019'}s best teacher
                    because Aquarius decan energy adds intellectual passion to diplomatic fairness. Zone 6 (65% teaching)
                    teaches least broadly{'\u2014'}it mediates through intense depth, not wide explanation. Zone 1 (80% teaching)
                    teaches through Virgo-influenced analytical precision, making learning feel structured and clear. The pattern:
                    Libra teaches by BALANCING WITH you, not by DICTATING TO you.
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
            <h4>{'\uD83D\uDCAC'} Diplomats & Harmonizers</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Refined analysts to pure relational harmonizers</p>
              <ul>
                <li><strong>Mahatma Gandhi:</strong> Zone 1 {'\u2014'} refined diplomatic precision balanced with analytical moral clarity, the diplomat who weighed every action against the scales of justice with meticulous care</li>
                <li><strong>Kim Kardashian:</strong> Zone 2 {'\u2014'} the relationship-focused harmonizer, navigates every social dynamic by sensing what will please and unite, communicates through relational connection rather than confrontation</li>
              </ul>
              <p className="example-note">
                Why different zones? Gandhi balanced through analytical moral precision (Zone 1 meta-cognition 80%).
                Kim Kardashian harmonizes through relational flexibility (Zone 2 flexibility 95%, verbal 90%).
                Both Libra air, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2696\uFE0F'} Advocates & Champions</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Justice advocates to equality champions</p>
              <ul>
                <li><strong>John Lennon:</strong> Zone 3 {'\u2014'} fought for peace through principled diplomacy, the justice advocate who used intellectual passion and artistic expression to champion social change</li>
                <li><strong>Eleanor Roosevelt:</strong> Zone 4 {'\u2014'} championed human rights with idealistic conviction, the equality champion who revolutionized the concept of universal human dignity through relentless advocacy</li>
              </ul>
              <p className="example-note">
                Zone 3 = justice through diplomatic intellectual passion. Zone 4 = equality through
                idealistic revolution. John Lennon imagined peace (Zone 3 progressive activism). Eleanor Roosevelt
                built institutions of equality (Zone 4 systemic transformation). Both Libra balance, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2728'} Chameleons & Mediators</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Social chameleons to passionate mediators</p>
              <ul>
                <li><strong>Oscar Wilde:</strong> Zone 5 {'\u2014'} the ultimate social chameleon, charmed every room with verbal brilliance and adaptive wit, mastered the art of graceful social navigation</li>
                <li><strong>Margaret Thatcher:</strong> Zone 6 {'\u2014'} the passionate mediator turned iron diplomat, balanced Libra diplomacy with Scorpio-cusp intensity to transform political landscapes through fierce conviction</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the outer-directed Libra. Oscar Wilde charmed through adaptive verbal genius
                (Zone 5 verbal 95%, flexibility 95%). Margaret Thatcher mediated through passionate intensity
                (Zone 6 focus 85%, meta-cognition 85%). Both prove Libra can command the world,
                not just harmonize the room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83D\uDCA1'} Air Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} Mediation & Negotiation</h4>
            <p>
              <strong>Zone 1:</strong> Excels at structured negotiation {'\u2014'} can analyze both sides with precision,
              finding the refined compromise. Meta-cognition (80%) makes them natural mediators.<br/>
              <strong>Zone 2:</strong> Excels at relational mediation {'\u2014'} pure harmonizing presence that makes
              all parties feel heard and valued. Flexibility (95%) creates inclusive resolution spaces.<br/>
              <strong>Zone 4:</strong> Excels at systemic reform {'\u2014'} equality-driven advocacy, institutional
              change, human rights work. Abstraction (90%) allows vision of the bigger picture.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFA8'} Creative & Aesthetic Roles</h4>
            <p>
              <strong>Zone 1:</strong> The refined curator {'\u2014'} analyzes beauty with precision, creates
              aesthetically perfect environments through meticulous attention to balance.<br/>
              <strong>Zone 2:</strong> The collaborative artist {'\u2014'} creates beauty through partnership,
              ensures every creative choice harmonizes with the whole.<br/>
              <strong>Zone 5:</strong> The social creative {'\u2014'} channels charm into artistic expression,
              adapts style to audience with effortless grace. Verbal intelligence (95%) enables
              brilliant artistic communication.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\u2696\uFE0F'} Justice & Legal Professions</h4>
            <p>
              <strong>Zone 3:</strong> Trial advocacy and social justice law {'\u2014'} the justice advocate uses
              intellectual passion to fight for principles diplomatically.<br/>
              <strong>Zone 4:</strong> Human rights and constitutional law {'\u2014'} the equality champion envisions
              systemic fairness and works to transform unjust institutions.<br/>
              <strong>Zone 6:</strong> Investigative law and deep mediation {'\u2014'} the passionate mediator
              probes beneath surface disputes to find transformative resolution.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Relationship Architecture</h4>
            <p>
              <strong>Partnership building:</strong> Zone 2{'\u2019'}s relational-emotional balance memory makes them the
              master of relationships, the one who remembers every preference, anticipates every need,
              and ensures every interaction feels harmonious and valued.<br/>
              <strong>Social reading:</strong> Zone 5{'\u2019'}s social-chameleon situational memory allows them to read
              any room instantly{'\u2014'}adapting tone, style, and approach before a single misstep occurs.<br/>
              <strong>Deep bonding:</strong> Zone 6{'\u2019'}s deep-emotional loyalty memory transforms partnerships
              into unbreakable bonds forged through intense mutual understanding and fierce devotion.
            </p>
          </div>
        </div>
      </section>

      {/* Behavioral Patterns Section */}
      <section className="behavioral-patterns">
        <h3 className="section-title">{'\uD83D\uDD04'} Behavioral Patterns by Zone</h3>

        <div className="patterns-grid">
          {thinkingStyles.map(style => {
            const zone = zones.find(z => z.id === style.zoneId);
            const behaviorData = {
              1: { conflict: "Analyzes diplomatically, seeks refined solution", stress: "Perfectionistic indecision, aesthetic anxiety", success: "Gracious satisfaction, notices imperfections", failure: "Tactful analysis, diplomatic retry" },
              2: { conflict: "Avoids completely, people-pleases", stress: "Paralyzed indecision, seeks partner's opinion", success: "Generous sharing, ensures everyone happy", failure: "Blames imbalance, seeks new equilibrium" },
              3: { conflict: "Fights for principles diplomatically", stress: "Detached intellectual analysis", success: "Shares credit, continues activism", failure: "Idealistic reframe, tries new approach" },
              4: { conflict: "Fights intellectually for justice", stress: "Righteously defends principles", success: "Celebrates equality, continues mission", failure: "Blames unfair systems, rebels" },
              5: { conflict: "Charms and diverts, avoids", stress: "Scattered social activity", success: "Shares charisma, moves to next", failure: "Blames communication, adapts approach" },
              6: { conflict: "Diplomatic but intense, transforms", stress: "Obsessive about fairness, vengeful if betrayed", success: "Deeply satisfied, fiercely loyal", failure: "Hurt but seeks transformation" }
            };
            const behavior = behaviorData[style.zoneId];
            return (
              <div key={style.zoneId} className="pattern-card" style={{ borderTop: `4px solid ${zone?.colorTheme?.primary || '#FFB6C1'}` }}>
                <h4>Zone {style.zoneId}: {style.archetype}</h4>
                <div className="pattern-rows">
                  <div className="pattern-item">
                    <span className="pattern-label">{'\u2694\uFE0F'} Conflict:</span>
                    <span>{behavior.conflict}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">{'\uD83D\uDE30'} Stress:</span>
                    <span>{behavior.stress}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">{'\uD83C\uDF1F'} Success:</span>
                    <span>{behavior.success}</span>
                  </div>
                  <div className="pattern-item">
                    <span className="pattern-label">{'\uD83D\uDCA5'} Failure:</span>
                    <span>{behavior.failure}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Balanced Intelligence</h3>
          <p>
            Libra{'\u2019'}s thinking style is not indecision to be overcome but a profound relational
            intelligence system. From the refined diplomat (Zone 1) through the ultimate harmonizer
            (Zone 2), the justice advocate (Zone 3), the equality champion (Zone 4), the social
            chameleon (Zone 5), to the passionate mediator (Zone 6) {'\u2014'} each zone represents a different
            facet of Venus{'\u2019'}s wisdom.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Libras to be the same. The Zone 2
            harmonizer is called {'\u201C'}too indecisive.{'\u201D'} The Zone 4 champion is called {'\u201C'}too idealistic.{'\u201D'}
            The Zone 5 chameleon is called {'\u201C'}too superficial.{'\u201D'} The Zone 6 mediator is called {'\u201C'}too intense.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Libra zone reveals HOW you balance, WHY you harmonize, and WHERE
            your diplomatic gifts can transform the world.</strong> When you know someone processes through
            pure relational harmony (Zone 2) vs revolutionary equality (Zone 4), you communicate
            in their language. When you understand that Zone 5{'\u2019'}s social charm (95% verbal) and Zone 6{'\u2019'}s
            passionate depth (85% focus) are equally valid, you stop demanding that all Libras
            express balance the same way.
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

export default LibraThinkingStyleTab;
