import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Leo Thinking Style Tab Component
 * Deep dive into cognitive differences across Leo zones
 * Includes comprehensive matrix and hexagon radar charts
 * Fire Sign, Fixed Modality, Sun-Ruled — "I CREATE"
 */
const LeoThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Nurturing-Creative Thinking",
      archetype: "The Caring Star",
      processingSpeed: "Moderate-Fast (80 BPM)",
      primaryMode: "Feel \u2192 Create \u2192 Lead \u2192 Protect",
      thoughtPattern: 'Heart warms \u2192 Creative impulse \u2192 Leadership activated \u2192 Loved ones protected',
      decisionMaking: "35% appreciation, 25% creative expression, 20% protection, 20% emotional",
      decisionSpeed: "Medium-fast (hours)",
      learningStyle: "Emotionally engaged creative immersion",
      memoryType: "Warm-protective associations",
      abstractionLevel: 60,
      verbalIntelligence: 75,
      metaCognition: 65,
      focus: 70,
      cognitiveFlexibility: 65,
      teachingAbility: 70,
      informationPreference: ["Heartfelt stories", "Creative inspiration", "Leadership examples"],
      communicationStyle: "Warmly protective and creatively encouraging",
      motto: "I lead with heart and shine with love"
    },
    {
      zoneId: 2,
      name: "Pure Creative-Expressive Thinking",
      archetype: "The Radiant Monarch",
      processingSpeed: "Fast (90 BPM)",
      primaryMode: "Create \u2192 Express \u2192 Shine \u2192 Receive",
      thoughtPattern: 'Creative fire ignites \u2192 Expression demands stage \u2192 Radiance flows \u2192 Admiration received',
      decisionMaking: "40% admiration, 30% creativity, 15% center stage, 15% regal",
      decisionSpeed: "Fast (confident)",
      learningStyle: "Performative creative expression",
      memoryType: "Glory-moment recall",
      abstractionLevel: 55,
      verbalIntelligence: 80,
      metaCognition: 60,
      focus: 75,
      cognitiveFlexibility: 60,
      teachingAbility: 65,
      informationPreference: ["Dramatic narratives", "Recognition signals", "Creative showcases"],
      communicationStyle: "Commanding, expressive, magnetically confident",
      motto: "I create, I shine, I rule"
    },
    {
      zoneId: 3,
      name: "Visionary-Expansive Thinking",
      archetype: "The Inspired Leader",
      processingSpeed: "Very Fast (95 BPM)",
      primaryMode: "Envision \u2192 Inspire \u2192 Adventure \u2192 Create",
      thoughtPattern: 'Grand vision forms \u2192 Inspiration radiates \u2192 Adventure beckons \u2192 Creation manifests',
      decisionMaking: "35% visionary impact, 30% adventure, 20% teaching, 15% recognition",
      decisionSpeed: "Very fast (confident vision)",
      learningStyle: "Visionary exploration and inspired teaching",
      memoryType: "Epic-adventure recall",
      abstractionLevel: 70,
      verbalIntelligence: 85,
      metaCognition: 65,
      focus: 65,
      cognitiveFlexibility: 80,
      teachingAbility: 85,
      informationPreference: ["Grand visions", "Philosophical truths", "Adventure possibilities"],
      communicationStyle: "Inspirational, expansive, philosophically bold",
      motto: "I inspire greatness, I create the future"
    },
    {
      zoneId: 4,
      name: "Bold-Visionary Thinking",
      archetype: "The Cultural Pioneer",
      processingSpeed: "Maximum (100 BPM)",
      primaryMode: "Vision \u2192 Disrupt \u2192 Lead \u2192 Transform",
      thoughtPattern: 'Revolutionary vision \u2192 Cultural disruption \u2192 Fearless leadership \u2192 Legacy forged',
      decisionMaking: "40% cultural impact, 30% leadership, 20% boldness, 10% legacy",
      decisionSpeed: "Very fast (fearless)",
      learningStyle: "Disruptive innovation and cultural pioneering",
      memoryType: "Revolutionary-legacy imprints",
      abstractionLevel: 75,
      verbalIntelligence: 85,
      metaCognition: 70,
      focus: 70,
      cognitiveFlexibility: 85,
      teachingAbility: 80,
      informationPreference: ["Cultural movements", "Revolutionary ideas", "Legacy-building strategies"],
      communicationStyle: "Bold, provocative, culturally transformative",
      motto: "I lead revolutions, I transform culture"
    },
    {
      zoneId: 5,
      name: "Courageous-Competitive Thinking",
      archetype: "The Warrior Performer",
      processingSpeed: "Fast (95 BPM)",
      primaryMode: "Challenge \u2192 Compete \u2192 Win \u2192 Dominate",
      thoughtPattern: 'Challenge identified \u2192 Competitive fire ignites \u2192 Victory pursued \u2192 Dominance established',
      decisionMaking: "45% winning, 25% courage, 15% respect, 15% competition",
      decisionSpeed: "Fast (acts on courage)",
      learningStyle: "Competitive engagement and physical mastery",
      memoryType: "Victory-defeat recall",
      abstractionLevel: 50,
      verbalIntelligence: 75,
      metaCognition: 60,
      focus: 85,
      cognitiveFlexibility: 55,
      teachingAbility: 60,
      informationPreference: ["Competition results", "Strength demonstrations", "Winning strategies"],
      communicationStyle: "Direct, courageous, competitively charged",
      motto: "I fight, I win, I dominate"
    },
    {
      zoneId: 6,
      name: "Perfectionist-Creative Thinking",
      archetype: "The Master Craftsperson",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Analyze \u2192 Perfect \u2192 Create \u2192 Serve",
      thoughtPattern: 'Analysis begins \u2192 Perfection demanded \u2192 Craft refined \u2192 Excellence delivered',
      decisionMaking: "40% perfection, 25% skill showcase, 20% worthy craft, 15% service",
      decisionSpeed: "Medium (analyzes before creating)",
      learningStyle: "Analytical precision and craft mastery",
      memoryType: "Detail-perfection recall",
      abstractionLevel: 60,
      verbalIntelligence: 85,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 50,
      teachingAbility: 75,
      informationPreference: ["Technical mastery", "Craft refinement", "Quality standards"],
      communicationStyle: "Precise, analytical, craft-focused",
      motto: "I perfect my craft, I serve through excellence"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Leo Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you create, lead, and express reality
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
            Two Leo Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 90 BPM with pure creative-expressive confidence, while Zone 6 (25-29{'\u00B0'}) thinks at 80 BPM
            with perfectionist craft precision. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through pure creative radiance (Zone 2) vs analytical craft mastery (Zone 6), you can meet them where they are.
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
          {/* Flap 1: Zone 2 vs Zone 5 */}
          <div className={`flap ${expandedFlap === 'extremes' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('extremes')}>
              <span className="flap-icon">{expandedFlap === 'extremes' ? '\u25BC' : '\u25B6'}</span>
              <h4>Zone 2 vs Zone 5: Creative Expression vs Warrior Competition</h4>
              <span className="flap-badge">Most Different</span>
            </button>
            {expandedFlap === 'extremes' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 5])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDFAD'} Pure Creative vs Courageous Performer</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Radiant Monarch</h6>
                        <ul>
                          <li>{'\u26A1'} 90 BPM - Fast, confident creative processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 55% abstraction - Creative but grounded in expression</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal - Commands attention through words</li>
                          <li>{'\uD83E\uDE9E'} 60% meta-cognition - Knows their brilliance</li>
                          <li>{'\uD83C\uDFAF'} 75% focus - Creative concentration</li>
                          <li>{'\uD83E\uDD38'} 60% flexibility - Fixed in creative vision</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I create, I shine, I rule.{'\u201D'}
                          Maximum creative expression with magnetic confidence. Processes every experience
                          through the lens of artistic radiance. The most purely expressive Leo zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 5: The Warrior Performer</h6>
                        <ul>
                          <li>{'\u26A1'} 95 BPM - Fast, courage-driven processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 50% abstraction - Concrete competitive reality</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal - Direct and commanding</li>
                          <li>{'\uD83E\uDE9E'} 60% meta-cognition - Focused on winning</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Laser-locked on victory</li>
                          <li>{'\uD83E\uDD38'} 55% flexibility - Rigid competitive drive</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I fight, I win, I dominate.{'\u201D'}
                          The highest focus in Leo at 85%. Channels solar fire into competitive
                          dominance rather than creative expression. The warrior who performs through victory.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 creates to be admired; Zone 5 competes to dominate.
                      Zone 2 seeks the spotlight through art; Zone 5 seizes it through courage.
                      Together they represent Leo{'\u2019'}s full solar spectrum: from radiant creator to fearless warrior.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 2: Zone 1 vs Zone 6 */}
          <div className={`flap ${expandedFlap === 'cusps' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('cusps')}>
              <span className="flap-icon">{expandedFlap === 'cusps' ? '\u25BC' : '\u25B6'}</span>
              <h4>Zone 1 vs Zone 6: Warm Leader vs Perfectionist Star</h4>
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
                        <h6>Zone 1: Cancer-Leo Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDF19'} Cancer influence adds nurturing warmth and protection</li>
                          <li>{'\u26A1'} 80 BPM - Moderate-fast, heart-led processing</li>
                          <li>{'\uD83D\uDCAD'} Feel {'\u2192'} Create {'\u2192'} Lead {'\u2192'} Protect</li>
                          <li>{'\uD83C\uDFAF'} 70% focus - Balanced creative attention</li>
                          <li>{'\uD83D\uDCCA'} Appreciation and protection drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire softened by Water. Can NURTURE through creative
                          leadership rather than demanding the spotlight. The caring star who
                          leads with emotional warmth and protective instinct.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Leo-Virgo Cusp</h6>
                        <ul>
                          <li>{'\uD83D\uDD0D'} Virgo influence adds analytical precision and craft mastery</li>
                          <li>{'\u26A1'} 80 BPM - Moderate, analyzes before creating</li>
                          <li>{'\uD83D\uDCAD'} Analyze {'\u2192'} Perfect {'\u2192'} Create {'\u2192'} Serve</li>
                          <li>{'\uD83C\uDFAF'} 95% focus - Perfectionist concentration</li>
                          <li>{'\uD83D\uDCCA'} Perfection and worthy craft drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire refined by Earth. Can PERFECT their creative
                          output rather than rushing to the stage. The master craftsperson who
                          channels Leo{'\u2019'}s creative fire through Virgo{'\u2019'}s analytical precision.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges emotion and creativity (Cancer cusp).
                      Zone 6 bridges creativity and precision (Virgo cusp). Both temper pure Leo fire
                      with neighboring sign qualities: warmth vs exactitude. Zone 6 meta-cognition (80%)
                      and Zone 6 focus (95%) are the highest in the Leo spectrum precisely
                      because Virgo cusp energy adds analytical self-awareness.
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
              <h4>Decan Progression: Solar Fire {'\u2192'} Visionary Fire {'\u2192'} Warrior Fire</h4>
              <span className="flap-badge">Pure Rulers</span>
            </button>
            {expandedFlap === 'decans' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 4, 5])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDF1F'} The Decan Evolution</h5>
                    <div className="three-way-grid">
                      <div className="zone-analysis">
                        <h6>Zone 2: Sun/Sun (1st Decan)</h6>
                        <p><strong>Pure Leo - Solar Fire</strong></p>
                        <ul>
                          <li>{'\u2600\uFE0F'} 100% Sun influence</li>
                          <li>{'\uD83C\uDFA8'} Create first, reflect later</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal (commanding)</li>
                          <li>{'\uD83C\uDFAF'} 75% focus (creative immersion)</li>
                          <li>{'\uD83D\uDCDA'} Performative expression ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Sun/Jupiter (2nd Decan)</h6>
                        <p><strong>Leo + Sagittarius - Visionary Fire</strong></p>
                        <ul>
                          <li>{'\uD83C\uDFF9'} Jupiter adds vision + expansion + boldness</li>
                          <li>{'\uD83D\uDD2D'} Envision then disrupt</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (inspirational)</li>
                          <li>{'\uD83C\uDFAF'} 70% focus (expansive vision)</li>
                          <li>{'\uD83D\uDCDA'} Disruptive innovation</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 5: Sun/Mars (3rd Decan)</h6>
                        <p><strong>Leo + Aries Influence - Warrior Fire</strong></p>
                        <ul>
                          <li>{'\u2694\uFE0F'} Mars adds courage + competition + drive</li>
                          <li>{'\uD83D\uDCA5'} Challenge what you see</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal (direct)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (laser-locked)</li>
                          <li>{'\uD83D\uDCDA'} Competitive mastery</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Leo from pure
                      creative expression (Zone 2) through visionary cultural disruption (Zone 4) to courageous
                      competitive dominance (Zone 5).
                      It{'\u2019'}s a progression from radiant creation to fearless conquest. Flexibility peaks at
                      Zone 4 (85%) where Jupiter{'\u2019'}s expansive vision demands openness to new frontiers, while
                      focus intensifies (75% {'\u2192'} 70% {'\u2192'} 85%) as Mars locks Leo{'\u2019'}s fire onto a
                      single competitive target.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 4: Leadership Styles */}
          <div className={`flap ${expandedFlap === 'leadership' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('leadership')}>
              <span className="flap-icon">{expandedFlap === 'leadership' ? '\u25BC' : '\u25B6'}</span>
              <h4>Leadership Styles: Compare how each zone leads</h4>
              <span className="flap-badge">Leadership Capacity</span>
            </button>
            {expandedFlap === 'leadership' && (
              <div className="flap-content">
                <div className="teaching-comparison">
                  <h5>{'\uD83D\uDC51'} Who Leads and How?</h5>
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
                            <strong>Leadership Style:</strong> {
                              style.zoneId === 1 ? "Leads through nurturing warmth \u2014 \"I'll protect you while we shine together\"" :
                              style.zoneId === 2 ? "Leads through magnetic charisma \u2014 \"Follow my creative vision, bask in my light\"" :
                              style.zoneId === 3 ? "Leads through inspirational vision \u2014 \"I see the future, let me show you the way\"" :
                              style.zoneId === 4 ? "Leads through cultural disruption \u2014 \"We will change the world, follow me fearlessly\"" :
                              style.zoneId === 5 ? "Leads through courageous action \u2014 \"Watch me win, then join my winning team\"" :
                              "Leads through perfected excellence \u2014 \"My craft speaks for itself, excellence is the standard\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Creates a warm, safe environment where team members feel valued and inspired to give their best" :
                              style.zoneId === 2 ? "Commands a room with natural authority, making everyone feel part of something magnificent" :
                              style.zoneId === 3 ? "Paints a grand vision so compelling that followers feel inspired to pursue the impossible" :
                              style.zoneId === 4 ? "Disrupts established norms and pioneers new cultural movements that redefine industries" :
                              style.zoneId === 5 ? "Steps into the arena first, demonstrating courage that rallies others to follow" :
                              "Sets such a high standard of excellence that others naturally aspire to match it"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 3 (85% teaching) is Leo{'\u2019'}s best teacher
                    because Jupiter{'\u2019'}s expansive influence adds philosophical vision to solar fire. Zone 5 (60% teaching)
                    teaches least verbally{'\u2014'}it leads by courageous example, not explanation. Zone 4 (80% teaching)
                    teaches through bold cultural disruption, making learning feel like revolution. The pattern:
                    Leo teaches by INSPIRING you, not by INSTRUCTING you.
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
            <h4>{'\u2600\uFE0F'} Nurturing Stars & Radiant Monarchs</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Caring leaders to pure creative expressors</p>
              <ul>
                <li><strong>Barack Obama:</strong> Zone 1 {'\u2014'} leads with warmth and protective vision, the caring star who nurtures through inspiring leadership and emotional intelligence</li>
                <li><strong>J.K. Rowling:</strong> Zone 1 {'\u2014'} creates worlds that protect and nurture, channeling Cancer-cusp warmth into stories that shelter the imagination</li>
                <li><strong>Madonna:</strong> Zone 2 {'\u2014'} the Radiant Monarch of pop culture, commands the stage with pure creative-expressive confidence and magnetic reinvention</li>
                <li><strong>Mick Jagger:</strong> Zone 2 {'\u2014'} pure solar charisma, creates and performs with total expressive confidence, the ultimate rock monarch</li>
              </ul>
              <p className="example-note">
                Why different zones? Obama and Rowling lead with nurturing warmth (Zone 1 protection 20%).
                Madonna and Jagger command through pure creative radiance (Zone 2 admiration 40%).
                Both Leo fire, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDD25'} Visionaries & Cultural Pioneers</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Inspired leaders to bold disruptors</p>
              <ul>
                <li><strong>Jennifer Lopez:</strong> Zone 3 {'\u2014'} the inspired leader who envisions and creates across music, film, and business with expansive Sagittarian fire</li>
                <li><strong>Robert De Niro:</strong> Zone 3 {'\u2014'} visionary performer whose inspired leadership transformed method acting into an art of total immersion</li>
                <li><strong>Napoleon Bonaparte:</strong> Zone 4 {'\u2014'} the cultural pioneer who disrupted European civilization, leading revolutions with fearless vision and bold ambition</li>
                <li><strong>Whitney Houston:</strong> Zone 4 {'\u2014'} disrupted the music industry with a voice that transcended cultural boundaries, a bold visionary who transformed pop forever</li>
              </ul>
              <p className="example-note">
                Zone 3 = inspiration through expansive creative vision. Zone 4 = transformation through
                bold cultural disruption. J-Lo inspires across multiple frontiers (Zone 3 flexibility 80%). Napoleon
                disrupted entire civilizations (Zone 4 cultural impact 40%). Both Leo fire, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2728'} Warriors & Master Craftspeople</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Courageous competitors to perfectionist creators</p>
              <ul>
                <li><strong>Bill Clinton:</strong> Zone 5 {'\u2014'} the warrior performer of politics, competitive charisma that dominates every room, courage to fight for center stage in any arena</li>
                <li><strong>Jacqueline Kennedy:</strong> Zone 5 {'\u2014'} courageous grace under impossible pressure, the warrior performer who competed with dignity and won through sheer poise</li>
                <li><strong>Mother Teresa:</strong> Zone 6 {'\u2014'} perfected the craft of service, the master craftsperson who channeled Leo{'\u2019'}s fire into flawless devotion and excellence in compassion</li>
                <li><strong>Sean Connery:</strong> Zone 6 {'\u2014'} perfected the craft of screen presence, the master craftsperson whose analytical precision and Virgo-cusp discipline defined iconic roles</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the disciplined Leo. Bill Clinton competes with warrior charisma
                (Zone 5 focus 85%, winning 45%). Mother Teresa perfected service as a craft
                (Zone 6 focus 95%, meta-cognition 80%). Both prove Leo can channel fire into
                focused mastery, not just creative performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83D\uDCA1'} Fire Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83C\uDFA8'} Career Paths</h4>
            <p>
              <strong>Zone 1:</strong> Excels in nurturing leadership {'\u2014'} social work directors, school principals,
              nonprofit founders. Protective warmth (20%) combined with creative leadership makes them natural community builders.<br/>
              <strong>Zone 2:</strong> Excels in performance and creative arts {'\u2014'} actors, musicians, creative directors.
              Magnetic charisma (admiration 40%) makes them natural stars who command any stage.<br/>
              <strong>Zone 3:</strong> Excels in visionary roles {'\u2014'} CEOs, motivational speakers, entertainment moguls.
              Teaching ability (85%) and expansive vision make them inspirational leaders of large organizations.<br/>
              <strong>Zone 4:</strong> Excels in cultural disruption {'\u2014'} founders, revolutionaries, cultural critics.
              Bold vision (cultural impact 40%) combined with flexibility (85%) makes them agents of transformation.<br/>
              <strong>Zone 5:</strong> Excels in competitive arenas {'\u2014'} athletes, trial lawyers, political leaders.
              Focus (85%) and courage (25%) create relentless competitors who thrive under pressure.<br/>
              <strong>Zone 6:</strong> Excels in precision creative fields {'\u2014'} architects, surgeons, master chefs.
              Focus (95%) and meta-cognition (80%) create perfectionists who serve through excellence.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\u2764\uFE0F'} Relationship Styles</h4>
            <p>
              <strong>Zone 1:</strong> The protective partner {'\u2014'} leads with warmth, shields loved ones, creates a
              home full of creative joy. Needs appreciation for their nurturing, not just their shine.<br/>
              <strong>Zone 2:</strong> The royal partner {'\u2014'} lavishes attention and demands admiration in return.
              Generous, dramatic, and magnetically devoted. Don{'\u2019'}t ignore them; they need the spotlight of your love.<br/>
              <strong>Zone 3:</strong> The adventurous partner {'\u2014'} craves shared visions and grand experiences.
              Inspires growth in their partner but may struggle with routine and domestic details.<br/>
              <strong>Zone 4:</strong> The bold partner {'\u2014'} transforms relationships through fearless honesty.
              Disrupts complacency, demands authenticity, builds legacy-worthy love.<br/>
              <strong>Zone 5:</strong> The competitive partner {'\u2014'} brings courage and intensity to love.
              Fights for the relationship but may turn love into a contest of wills.<br/>
              <strong>Zone 6:</strong> The devoted partner {'\u2014'} perfects the craft of love through daily acts of service.
              Analytical about their partner{'\u2019'}s needs, attentive to every detail.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF31'} Growth Areas</h4>
            <p>
              <strong>Zone 1:</strong> Learn to receive as well as give {'\u2014'} your protective instinct can become
              smothering if you don{'\u2019'}t allow others to care for YOU.<br/>
              <strong>Zone 2:</strong> Develop humility alongside confidence {'\u2014'} your creative genius shines brighter
              when you can acknowledge others{'\u2019'} brilliance too.<br/>
              <strong>Zone 3:</strong> Ground your visions in practical reality {'\u2014'} not every grand idea needs
              to become an adventure. Sometimes stillness is where wisdom grows.<br/>
              <strong>Zone 4:</strong> Balance disruption with diplomacy {'\u2014'} your bold vision can alienate allies
              if you don{'\u2019'}t learn when to build bridges instead of burning them.<br/>
              <strong>Zone 5:</strong> Transform competition into collaboration {'\u2014'} not everything is a battle to win.
              Your courage is most powerful when it lifts others up, not pushes them down.<br/>
              <strong>Zone 6:</strong> Release perfectionism and embrace imperfection {'\u2014'} your craft is already
              magnificent. Learn that {'\u201C'}good enough{'\u201D'} sometimes IS perfect.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDC51'} Leadership Development</h4>
            <p>
              <strong>Creative leadership:</strong> Zone 2{'\u2019'}s magnetic charisma makes them natural team leaders,
              but they must learn that leadership means lifting others into the light, not just standing in it alone.<br/>
              <strong>Visionary leadership:</strong> Zone 3{'\u2019'}s philosophical depth and Zone 4{'\u2019'}s cultural boldness
              create leaders who can see the future and have the courage to build it{'\u2014'}they must learn patience
              with those who can{'\u2019'}t yet see what they see.<br/>
              <strong>Servant leadership:</strong> Zone 6{'\u2019'}s perfectionist devotion transforms leadership into service.
              When Leo{'\u2019'}s fire meets Virgo{'\u2019'}s precision, the result is a leader who inspires through
              flawless execution and humble excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Creative Intelligence</h3>
          <p>
            Leo{'\u2019'}s thinking style is not vanity to be corrected but a profound creative
            intelligence system. From the caring star (Zone 1) through the radiant monarch
            (Zone 2), the inspired leader (Zone 3), the cultural pioneer (Zone 4), the warrior
            performer (Zone 5), to the master craftsperson (Zone 6) {'\u2014'} each zone represents a different
            facet of the Sun{'\u2019'}s creative fire.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Leos to be the same. The Zone 2
            monarch is called {'\u201C'}too dramatic.{'\u201D'} The Zone 4 pioneer is called {'\u201C'}too disruptive.{'\u201D'}
            The Zone 5 warrior is called {'\u201C'}too aggressive.{'\u201D'} The Zone 6 perfectionist is called {'\u201C'}too critical.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Leo zone reveals HOW you create, WHY you lead, and WHERE
            your solar fire can illuminate the world.</strong> When you know someone processes through
            pure creative expression (Zone 2) vs analytical craft mastery (Zone 6), you communicate
            in their language. When you understand that Zone 2{'\u2019'}s magnetic charisma (80% verbal) and Zone 5{'\u2019'}s
            courageous focus (85% focus) are equally valid expressions of solar power, you stop demanding that all Leos
            express leadership the same way.
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

export default LeoThinkingStyleTab;
