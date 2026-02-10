import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Sagittarius Thinking Style Tab Component
 * Deep dive into cognitive differences across Sagittarius zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const SagittariusThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Deep-Expansive Thinking",
      archetype: "The Philosophical Warrior",
      processingSpeed: "Fast (85 BPM)",
      primaryMode: "Probe \u2192 Philosophize \u2192 Explore \u2192 Transform",
      thoughtPattern: 'Truth sought \u2192 Depth explored \u2192 Adventure launched \u2192 Transformation integrated',
      decisionMaking: "40% deep truth-seeking, 30% transformative exploration, 20% teaching wisdom, 10% adventurous freedom",
      decisionSpeed: "Fast (intuitive philosophical leaps)",
      learningStyle: "Deep philosophical immersion with exploratory courage",
      memoryType: "Transformative-philosophical associations",
      abstractionLevel: 90,
      verbalIntelligence: 85,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 80,
      teachingAbility: 85,
      informationPreference: ["Deep philosophical truths", "Transformative experiences", "Hidden wisdom"],
      communicationStyle: "Philosophically intense, probing yet expansive",
      motto: "I seek truth through fearless exploration"
    },
    {
      zoneId: 2,
      name: "Pure Adventurous-Philosophical Thinking",
      archetype: "The Eternal Explorer",
      processingSpeed: "Very Fast (100 BPM)",
      primaryMode: "Explore \u2192 Expand \u2192 Philosophize \u2192 Leap",
      thoughtPattern: 'New horizon spotted \u2192 Excitement ignites \u2192 Meaning extracted \u2192 Next adventure launched',
      decisionMaking: "45% is it NEW/exciting, 25% expands understanding, 20% gives freedom, 10% philosophical meaning",
      decisionSpeed: "Very fast (leaps before looking)",
      learningStyle: "Boundless exploratory absorption \u2014 learns by DOING",
      memoryType: "Adventure-experiential memory",
      abstractionLevel: 100,
      verbalIntelligence: 90,
      metaCognition: 60,
      focus: 50,
      cognitiveFlexibility: 100,
      teachingAbility: 75,
      informationPreference: ["New experiences", "Exotic cultures", "Big-picture patterns"],
      communicationStyle: "Enthusiastic, expansive, infectiously optimistic",
      motto: "I explore infinitely, I am free"
    },
    {
      zoneId: 3,
      name: "Pioneering-Visionary Thinking",
      archetype: "The Courageous Prophet",
      processingSpeed: "Very Fast (100 BPM)",
      primaryMode: "Pioneer \u2192 Conquer \u2192 Inspire \u2192 Lead",
      thoughtPattern: 'New frontier identified \u2192 Charge initiated \u2192 Territory claimed \u2192 Vision proclaimed',
      decisionMaking: "45% am I FIRST, 30% is it visionary/bold, 15% do I WIN, 10% philosophical meaning",
      decisionSpeed: "Instant (acts on vision NOW)",
      learningStyle: "Pioneering experiential learning \u2014 must be FIRST",
      memoryType: "Conquest-achievement memory",
      abstractionLevel: 90,
      verbalIntelligence: 85,
      metaCognition: 65,
      focus: 75,
      cognitiveFlexibility: 85,
      teachingAbility: 80,
      informationPreference: ["Uncharted territories", "Bold visions", "Competitive frontiers"],
      communicationStyle: "Bold, commanding, inspirationally courageous",
      motto: "I pioneer boldly, I conquer new worlds"
    },
    {
      zoneId: 4,
      name: "Revolutionary-Teaching Thinking",
      archetype: "The Freedom Fighter",
      processingSpeed: "Fast (95 BPM)",
      primaryMode: "Question \u2192 Fight \u2192 Liberate \u2192 Teach",
      thoughtPattern: 'Injustice detected \u2192 Mission crystallized \u2192 Revolution launched \u2192 Freedom achieved',
      decisionMaking: "50% liberates/frees others, 25% revolutionary impact, 15% teaches truth, 10% adventurous/bold",
      decisionSpeed: "Very fast (mission-driven)",
      learningStyle: "Revolutionary immersion \u2014 learns through fighting for truth",
      memoryType: "Liberation-mission memory",
      abstractionLevel: 95,
      verbalIntelligence: 90,
      metaCognition: 70,
      focus: 80,
      cognitiveFlexibility: 80,
      teachingAbility: 90,
      informationPreference: ["Revolutionary truths", "Cultural freedom", "Philosophical liberation"],
      communicationStyle: "Passionate, revolutionary, fearlessly articulate",
      motto: "I fight for freedom, I teach revolution"
    },
    {
      zoneId: 5,
      name: "Optimistic-Creative Thinking",
      archetype: "The Joyful Sage",
      processingSpeed: "Fast (95 BPM)",
      primaryMode: "Inspire \u2192 Create \u2192 Celebrate \u2192 Share",
      thoughtPattern: 'Joy ignites \u2192 Creative vision forms \u2192 Performance delivered \u2192 Wisdom shared generously',
      decisionMaking: "40% is it JOYFUL/fun, 30% inspires/uplifts others, 15% gets admiration, 15% creative expression",
      decisionSpeed: "Fast (enthusiastic leaps)",
      learningStyle: "Creative experiential joy \u2014 learns through play and expression",
      memoryType: "Joy-celebration-inspiration memory",
      abstractionLevel: 85,
      verbalIntelligence: 90,
      metaCognition: 65,
      focus: 65,
      cognitiveFlexibility: 90,
      teachingAbility: 85,
      informationPreference: ["Creative expression", "Joyful experiences", "Performance arts"],
      communicationStyle: "Warm, dramatic, generously enthusiastic",
      motto: "I inspire joy, I share wisdom generously"
    },
    {
      zoneId: 6,
      name: "Strategic-Philosophical Thinking",
      archetype: "The Ambitious Visionary",
      processingSpeed: "Moderate-Fast (85 BPM)",
      primaryMode: "Plan \u2192 Build \u2192 Philosophize \u2192 Achieve",
      thoughtPattern: 'Vision clarified \u2192 Strategy formed \u2192 Disciplined execution \u2192 Empire built',
      decisionMaking: "40% builds toward vision, 30% strategically sound, 15% philosophically meaningful, 15% responsible/practical",
      decisionSpeed: "Medium-fast (plans then acts)",
      learningStyle: "Strategic philosophical learning \u2014 plans before exploring",
      memoryType: "Strategic-achievement memory",
      abstractionLevel: 85,
      verbalIntelligence: 85,
      metaCognition: 75,
      focus: 80,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["Strategic visions", "Philosophical frameworks", "Achievement pathways"],
      communicationStyle: "Strategic, measured, philosophically grounded",
      motto: "I build empires through visionary wisdom"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Sagittarius Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you explore, philosophize, and seek truth
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
            Two Sagittarius Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 100 BPM with pure adventurous-philosophical processing, while Zone 6 (25-29{'\u00B0'}) thinks at 85 BPM
            with strategic-philosophical depth. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through boundless exploration (Zone 2) vs strategic vision-building (Zone 6), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} The Eternal Explorer vs The Ambitious Visionary</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Eternal Explorer</h6>
                        <ul>
                          <li>{'\u26A1'} 100 BPM - Very Fast, boundless processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 100% abstraction - Maximum abstract exploration</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal - Enthusiastically articulate</li>
                          <li>{'\uD83E\uDE9E'} 60% meta-cognition - Too busy exploring to reflect</li>
                          <li>{'\uD83C\uDFAF'} 50% focus - Scattered across infinite horizons</li>
                          <li>{'\uD83E\uDD38'} 100% flexibility - Maximum cognitive flexibility</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I explore infinitely, I am free.{'\u201D'}
                          Maximum flexibility with boundless exploration. Processes everything through
                          new experiences, exotic cultures, and big-picture patterns. The most freely adventurous zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Ambitious Visionary</h6>
                        <ul>
                          <li>{'\u26A1'} 85 BPM - Moderate-Fast, strategic pace</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 85% abstraction - Philosophically grounded</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal - Strategically articulate</li>
                          <li>{'\uD83E\uDE9E'} 75% meta-cognition - Self-aware and disciplined</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Highest focus in late Sagittarius</li>
                          <li>{'\uD83E\uDD38'} 70% flexibility - Structured but adaptable</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I build empires through visionary wisdom.{'\u201D'}
                          The highest focus in late Sagittarius. Channels exploration into
                          structured achievement. Plans before exploring, builds philosophical empires step by step.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 explores without limits.
                      Zone 6 builds philosophical empires.
                      Together they represent Sagittarius{'\u2019'}s full arc: from boundless freedom to disciplined vision.
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
                        <h6>Zone 1: Scorpio-Sagittarius Cusp</h6>
                        <ul>
                          <li>{'\uD83E\uDD82'} Scorpio influence adds transformative depth (85 verbal)</li>
                          <li>{'\u26A1'} 85 BPM - Fast philosophical processing</li>
                          <li>{'\uD83D\uDCAD'} Probe {'\u2192'} Philosophize {'\u2192'} Explore {'\u2192'} Transform</li>
                          <li>{'\uD83C\uDFAF'} 70% focus - Balanced depth attention</li>
                          <li>{'\uD83D\uDCCA'} Power dynamics + hidden depths drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire enriched by Water. Can PROBE with
                          transformative precision that other Sagittarius zones channel as expansive enthusiasm.
                          The philosophical warrior who bridges depth and adventure with fearless truth-seeking.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Sagittarius-Capricorn Cusp</h6>
                        <ul>
                          <li>{'\uD83D\uDC10'} Capricorn influence adds strategic discipline, empire-building</li>
                          <li>{'\u26A1'} 85 BPM - Measured strategic pace</li>
                          <li>{'\uD83D\uDCAD'} Plan {'\u2192'} Build {'\u2192'} Philosophize {'\u2192'} Achieve</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Strategic concentration</li>
                          <li>{'\uD83D\uDCCA'} Strategic visions drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire grounded by Earth. Can BUILD philosophical
                          empires step by step rather than leaping from adventure to adventure. The ambitious visionary who
                          transforms Sagittarius{'\u2019'}s expansive wisdom into structured achievement.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges depth and exploration (Scorpio cusp).
                      Zone 6 bridges philosophy and strategy (Capricorn cusp). Both are more grounded than
                      pure Sagittarius, but in different ways: transformative depth vs strategic discipline.
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
                        <h6>Zone 2: Jupiter/Jupiter (1st Decan)</h6>
                        <p><strong>Pure Sagittarius - The Eternal Explorer</strong></p>
                        <ul>
                          <li>{'\uD83C\uDFF9'} 100% Jupiter influence</li>
                          <li>{'\uD83C\uDF0D'} Explore first, question later</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (enthusiastic)</li>
                          <li>{'\uD83C\uDFAF'} 50% focus (scattered)</li>
                          <li>{'\uD83D\uDCDA'} Boundless exploratory absorption</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Jupiter/Mars (2nd Decan)</h6>
                        <p><strong>Sagittarius + Aries - The Freedom Fighter</strong></p>
                        <ul>
                          <li>{'\u2694\uFE0F'} Mars adds revolutionary passion</li>
                          <li>{'\uD83D\uDD25'} Fight then teach</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (passionate)</li>
                          <li>{'\uD83C\uDFAF'} 80% focus (mission-driven)</li>
                          <li>{'\uD83D\uDCDA'} Revolutionary immersion</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Jupiter/Sun (3rd Decan)</h6>
                        <p><strong>Sagittarius + Capricorn Cusp - The Ambitious Visionary</strong></p>
                        <ul>
                          <li>{'\uD83D\uDC10'} Saturn adds strategic discipline</li>
                          <li>{'\uD83D\uDCCB'} Plan then achieve</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (strategic)</li>
                          <li>{'\uD83C\uDFAF'} 80% focus (strategic)</li>
                          <li>{'\uD83D\uDCDA'} Strategic philosophical learning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Sagittarius from pure
                      boundless exploration (Zone 2) through revolutionary teaching (Zone 4) to strategic empire-building (Zone 6).
                      Focus rises from 50% to 80% as fire learns discipline.
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
                              style.zoneId === 1 ? "Teaches through transformative philosophical depth \u2014 \"Let me show you the hidden truth beneath the surface\"" :
                              style.zoneId === 2 ? "Teaches through boundless enthusiastic exploration \u2014 \"Come explore this with me, it's incredible!\"" :
                              style.zoneId === 3 ? "Teaches through bold pioneering vision \u2014 \"Follow me, I'll show you the new frontier\"" :
                              style.zoneId === 4 ? "Teaches through revolutionary passion \u2014 \"This truth will set you free, let me show you\"" :
                              style.zoneId === 5 ? "Teaches through joyful creative performance \u2014 \"Watch this, it's amazing and you'll love it!\"" :
                              "Teaches through strategic philosophical mentorship \u2014 \"Let me guide you step by step to wisdom\""
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 4 (90% teaching) is Sagittarius{'\u2019'}s best teacher
                    because Mars adds revolutionary passion to philosophical wisdom. Zone 2 (75% teaching)
                    teaches least effectively despite maximum enthusiasm{'\u2014'}too scattered to structure knowledge. The pattern:
                    Sagittarius teaches by INSPIRING you, not by CONTROLLING you.
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
            <h4>{'\uD83C\uDFF9'} Explorers & Philosophers</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Philosophical warriors to eternal explorers</p>
              <ul>
                <li><strong>Bruce Lee:</strong> Zone 1 {'\u2014'} the Philosophical Warrior who combined martial arts with deep philosophy, seeking truth through physical and intellectual adventure</li>
                <li><strong>Mark Twain:</strong> Zone 2 {'\u2014'} the Eternal Explorer who turned boundless adventure into immortal philosophical wit</li>
              </ul>
              <p className="example-note">
                Why different zones? Bruce Lee probed truth with transformative depth (Zone 1 verbal intelligence 85%, focus 70%).
                Mark Twain explored infinitely with boundless curiosity (Zone 2 flexibility 100%, abstraction 100%).
                Both Sagittarius fire, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2694\uFE0F'} Pioneers & Revolutionaries</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Courageous prophets to freedom fighters</p>
              <ul>
                <li><strong>Ludwig van Beethoven:</strong> Zone 3 {'\u2014'} the Courageous Prophet who pioneered new musical frontiers with fearless visionary boldness</li>
                <li><strong>Winston Churchill:</strong> Zone 4 {'\u2014'} the Freedom Fighter who fought for civilization{'\u2019'}s freedom with revolutionary philosophical conviction</li>
              </ul>
              <p className="example-note">
                Zone 3 = pioneering vision that conquers new frontiers. Zone 4 = revolutionary passion that
                liberates and teaches. Beethoven pioneered boldly (Zone 3 focus 75%, flexibility 85%). Churchill
                fought for freedom with mission-driven focus (Zone 4 teaching 90%, focus 80%). Both Sagittarius fire, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDF1F'} Sages & Builders</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Joyful sages to ambitious visionaries</p>
              <ul>
                <li><strong>Walt Disney:</strong> Zone 5 {'\u2014'} the Joyful Sage who inspired millions through creative optimistic vision and generous imagination</li>
                <li><strong>Isaac Newton:</strong> Zone 6 {'\u2014'} the Ambitious Visionary who built strategic philosophical empires through disciplined mathematical exploration</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the structured Sagittarius. Walt Disney inspired through joyful creative performance
                (Zone 5 flexibility 90%, verbal 90%). Isaac Newton built philosophical empires through strategic discipline
                (Zone 6 focus 80%, meta-cognition 75%). Both prove Sagittarius can inspire and build the world,
                not just explore it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83C\uDFF9'} Fire Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83C\uDFF9'} Adventure & Exploration</h4>
            <p>
              <strong>Zone 1:</strong> Explores with transformative philosophical depth {'\u2014'} probes beneath the surface of every culture,
              seeking hidden truths that others miss. Combines Scorpio{'\u2019'}s investigative intensity with Sagittarius{'\u2019'}s adventurous spirit.<br/>
              <strong>Zone 2:</strong> Explores with boundless enthusiasm {'\u2014'} leaps into new experiences without hesitation,
              absorbing everything through direct experiential immersion. Maximum flexibility (100%) means no destination is off-limits.<br/>
              <strong>Zone 4:</strong> Explores with revolutionary purpose {'\u2014'} travels to liberate, teaches what is discovered,
              fights for cultural freedom wherever the journey leads. Mission-driven focus (80%) keeps exploration purposeful.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Teaching & Education</h4>
            <p>
              <strong>Zone 4:</strong> The revolutionary educator {'\u2014'} teaches through passionate conviction that truth sets people free,
              inspires students to question everything and fight for philosophical liberation. Teaching ability (90%) is the highest in Sagittarius.<br/>
              <strong>Zone 5:</strong> The joyful creative teacher {'\u2014'} makes learning an inspiring, celebratory performance,
              shares wisdom generously through creative expression that uplifts everyone in the room.<br/>
              <strong>Zone 6:</strong> The strategic philosophical mentor {'\u2014'} guides students step by step through structured wisdom,
              builds educational empires with disciplined vision and measured philosophical depth.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF0D'} Cultural Transformation</h4>
            <p>
              <strong>Zone 3:</strong> Pioneers cultural frontiers {'\u2014'} charges into uncharted territory first, claims new cultural ground
              with bold visionary leadership. Inspires others to follow through courageous prophetic action.<br/>
              <strong>Zone 4:</strong> Revolutionizes cultural norms {'\u2014'} fights against injustice with passionate philosophical conviction,
              launches cultural revolutions that liberate and educate entire societies.<br/>
              <strong>Zone 6:</strong> Builds cultural institutions {'\u2014'} transforms philosophical vision into strategic cultural empires,
              creates lasting frameworks that ground expansive wisdom into achievable, disciplined structures.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDD2D'} Research & Discovery</h4>
            <p>
              <strong>Zone 1:</strong> Deep philosophical research {'\u2014'} probes beneath surfaces with transformative intensity,
              combining Scorpio{'\u2019'}s investigative depth with Sagittarius{'\u2019'}s philosophical breadth to uncover hidden wisdom.<br/>
              <strong>Zone 2:</strong> Exploratory discovery {'\u2014'} boundless curiosity drives research into uncharted territories,
              connecting disparate fields through big-picture pattern recognition and experiential immersion.<br/>
              <strong>Zone 6:</strong> Strategic systematic research {'\u2014'} builds knowledge empires through disciplined methodology,
              transforms scattered discoveries into coherent philosophical frameworks with strategic precision.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Adventurous Intelligence</h3>
          <p>
            Sagittarius{'\u2019'}s thinking style is not a restlessness to be contained but a profound exploratory
            intelligence system. From the philosophical warrior (Zone 1) through the eternal explorer
            (Zone 2), the courageous prophet (Zone 3), the freedom fighter (Zone 4), the joyful
            sage (Zone 5), to the ambitious visionary (Zone 6) {'\u2014'} each zone represents a different
            facet of Jupiter{'\u2019'}s expansive wisdom.
          </p>
          <p>
            <strong>The tragedy:</strong> Zone 2 explorer called {'\u201C'}too scattered.{'\u201D'} Zone 3
            pioneer called {'\u201C'}too reckless.{'\u201D'} Zone 4 revolutionary called {'\u201C'}too idealistic.{'\u201D'}
            Zone 5 entertainer called {'\u201C'}too frivolous.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Sagittarius zone reveals HOW you explore, WHY you seek truth, and WHERE
            your philosophical gifts can inspire the world.</strong> When you know someone processes through
            boundless exploration (Zone 2) vs strategic vision-building (Zone 6), you communicate
            in their language.
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

export default SagittariusThinkingStyleTab;
