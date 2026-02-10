import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Aries Thinking Style Tab Component
 * Deep dive into cognitive differences across Aries zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const AriesThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Instinctive-Compassionate Thinking",
      archetype: "The Mystic Warrior",
      processingSpeed: "Fast (120 BPM)",
      primaryMode: "Instinct \u2192 Compassionate Action",
      thoughtPattern: 'Feel the call \u2192 Act with heart \u2192 Protect the vulnerable \u2192 Build spiritual foundation',
      decisionMaking: "60% intuition, 40% compassion",
      decisionSpeed: "Fast (hours) \u2014 trusts spiritual calling",
      learningStyle: "Intuitive immersion \u2014 learns by feeling",
      memoryType: "Emotional-spiritual memory",
      abstractionLevel: 40,
      verbalIntelligence: 50,
      metaCognition: 30,
      focus: 60,
      cognitiveFlexibility: 60,
      teachingAbility: 40,
      informationPreference: ["Intuitive pull (Pisces residue)", "Compassion signals", "Courage tests"],
      communicationStyle: "Passionate and heartfelt \u2014 fights for causes",
      motto: "I feel the call, I act with heart"
    },
    {
      zoneId: 2,
      name: "Pure Instinctive Thinking",
      archetype: "The Unstoppable Force",
      processingSpeed: "Extreme (150 BPM)",
      primaryMode: "Instinct \u2192 Immediate Action",
      thoughtPattern: 'See challenge \u2192 React INSTANTLY \u2192 Dominate or die \u2192 Move to next thing',
      decisionMaking: "95% impulse, 5% logic",
      decisionSpeed: "INSTANT \u2014 acts before thinking",
      learningStyle: "Trial by combat \u2014 learns by doing NOW",
      memoryType: "Action-reaction memory (short-term)",
      abstractionLevel: 20,
      verbalIntelligence: 40,
      metaCognition: 15,
      focus: 80,
      cognitiveFlexibility: 40,
      teachingAbility: 15,
      informationPreference: ["Physical sensation", "Can do RIGHT NOW", "Winning/losing data"],
      communicationStyle: "Commands and challenges \u2014 minimal words, maximum impact",
      motto: "I act, therefore I am"
    },
    {
      zoneId: 3,
      name: "Performance-Driven Thinking",
      archetype: "The Champion",
      processingSpeed: "Fast (135 BPM)",
      primaryMode: "Performance \u2192 Recognition \u2192 Legacy",
      thoughtPattern: 'Identify stage \u2192 Plan performance \u2192 Execute with flair \u2192 Bask in admiration',
      decisionMaking: "70% creative impulse, 30% strategic planning",
      decisionSpeed: "Fast (hours) \u2014 needs to look good doing it",
      learningStyle: "Performance-based \u2014 learns through creative expression",
      memoryType: "Achievement and recognition memory",
      abstractionLevel: 35,
      verbalIntelligence: 60,
      metaCognition: 40,
      focus: 75,
      cognitiveFlexibility: 50,
      teachingAbility: 45,
      informationPreference: ["Admiration potential", "Creative challenge", "Reputation impact"],
      communicationStyle: "Dramatic and inspiring \u2014 natural performer and motivator",
      motto: "I shine, therefore I matter"
    },
    {
      zoneId: 4,
      name: "Strategic-Warrior Thinking",
      archetype: "The General",
      processingSpeed: "Medium (120 BPM)",
      primaryMode: "Strategy \u2192 Execution \u2192 Empire",
      thoughtPattern: 'Assess battlefield \u2192 Plan campaign \u2192 Execute with discipline \u2192 Build power structure',
      decisionMaking: "45% impulse, 55% strategic calculation",
      decisionSpeed: "Medium (hours-days) \u2014 calculates for victory",
      learningStyle: "Mentorship and strategy \u2014 learns from commanders",
      memoryType: "Strategic pattern memory \u2014 remembers every battle",
      abstractionLevel: 50,
      verbalIntelligence: 65,
      metaCognition: 60,
      focus: 85,
      cognitiveFlexibility: 40,
      teachingAbility: 65,
      informationPreference: ["Strategic advantage", "Power structure data", "Historical patterns"],
      communicationStyle: "Authoritative commands \u2014 speaks with deliberate power",
      motto: "I strategize, I conquer, I rule"
    },
    {
      zoneId: 5,
      name: "Philosophical-Adventurer Thinking",
      archetype: "The Explorer",
      processingSpeed: "Fast (140 BPM)",
      primaryMode: "Adventure \u2192 Meaning \u2192 Freedom",
      thoughtPattern: 'Discover possibility \u2192 Chase experience \u2192 Extract philosophical meaning \u2192 Share wisdom freely',
      decisionMaking: "80% adventure impulse, 20% philosophical reflection",
      decisionSpeed: "Fast (minutes-hours) \u2014 follows the call of adventure",
      learningStyle: "Experiential \u2014 learns by exploring the unknown",
      memoryType: "Story-based memory \u2014 remembers adventures as epics",
      abstractionLevel: 65,
      verbalIntelligence: 70,
      metaCognition: 55,
      focus: 50,
      cognitiveFlexibility: 80,
      teachingAbility: 60,
      informationPreference: ["New experiences", "Philosophical truth", "Freedom potential"],
      communicationStyle: "Storytelling and philosophical \u2014 natural sage-adventurer",
      motto: "I explore, I learn, I am free"
    },
    {
      zoneId: 6,
      name: "Grounded-Builder Thinking",
      archetype: "The Practical Warrior",
      processingSpeed: "Medium (110 BPM)",
      primaryMode: "Build \u2192 Own \u2192 Protect",
      thoughtPattern: 'Identify tangible goal \u2192 Plan construction \u2192 Build methodically \u2192 Protect what was built',
      decisionMaking: "60% practical assessment, 40% action impulse",
      decisionSpeed: "Medium (hours-days) \u2014 builds carefully",
      learningStyle: "Hands-on construction \u2014 learns by building",
      memoryType: "Tangible result memory \u2014 remembers what was built",
      abstractionLevel: 35,
      verbalIntelligence: 55,
      metaCognition: 45,
      focus: 75,
      cognitiveFlexibility: 50,
      teachingAbility: 50,
      informationPreference: ["Tangible value", "Practical feasibility", "Ownership potential"],
      communicationStyle: "Direct and practical \u2014 fewer words, more action results",
      motto: "I build, I own, I protect"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Aries Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you think, process, and understand reality
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
            Two Aries Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 150 BPM with pure instinct, while Zone 4 (15-19{'\u00B0'}) thinks at 120 BPM
            with strategic calculation. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through raw instinct (Zone 2) vs strategic calculation (Zone 4), you can meet them where they are.
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
              <h4>Opposite Extremes: Zone 2 vs Zone 5</h4>
              <span className="flap-badge">Most Different</span>
            </button>
            {expandedFlap === 'extremes' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 5])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDFAD'} The Cognitive Opposites</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Unstoppable Force</h6>
                        <ul>
                          <li>{'\u26A1'} 150 BPM - Fastest thinker (pure instinct)</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 20% abstraction - Cannot process theory</li>
                          <li>{'\uD83D\uDCAC'} 40% verbal - Commands, not conversations</li>
                          <li>{'\uD83E\uDE9E'} 15% meta-cognition - Zero self-reflection</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Tunnel vision on target</li>
                          <li>{'\uD83E\uDD38'} 40% flexibility - My way or the highway</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I act, therefore I am.{'\u201D'}
                          Pure instinct incarnate. Acts before thinking. Doesn{'\u2019'}t reflect on
                          actions because the next challenge is already here.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 5: The Explorer</h6>
                        <ul>
                          <li>{'\u26A1'} 140 BPM - Fast but reflective</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 65% abstraction - Works with big ideas</li>
                          <li>{'\uD83D\uDCAC'} 70% verbal - Storyteller and philosopher</li>
                          <li>{'\uD83E\uDE9E'} 55% meta-cognition - Thinks about why they act</li>
                          <li>{'\uD83C\uDFAF'} 50% focus - Broad exploration</li>
                          <li>{'\uD83E\uDD38'} 80% flexibility - Goes where the wind blows</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I explore, I learn, I am free.{'\u201D'}
                          The philosopher-adventurer. Still has Aries fire, but channels it into
                          meaning-making and wisdom-sharing rather than pure conquest.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} Working Together:</strong> Zone 2 acts, Zone 5 reflects on the action.
                      Zone 2 will be frustrated by Zone 5{'\u2019'}s philosophizing ({'\u201C'}Stop TALKING and DO something!{'\u201D'}).
                      Zone 5 will be frustrated by Zone 2{'\u2019'}s lack of reflection ({'\u201C'}But WHY did you do that?{'\u201D'}).
                      Together they{'\u2019'}re complete: Zone 2 DOES, Zone 5 gives it MEANING.
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
                        <h6>Zone 1: Pisces-Aries Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDF0A'} 25% Pisces (Water) influence</li>
                          <li>{'\u26A1'} 120 BPM - Fast with compassion</li>
                          <li>{'\uD83D\uDCAD'} Instinct {'\u2192'} Compassionate action</li>
                          <li>{'\uD83C\uDFAF'} 60% focus - Heart-led concentration</li>
                          <li>{'\uD83D\uDCCA'} Intuition drives decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire softened by Water. Can FEEL the call
                          before charging into battle. The spiritual warrior who fights
                          for causes, not just conquest.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Aries-Taurus Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDF0D'} 25% Taurus (Earth) influence</li>
                          <li>{'\u26A1'} 110 BPM - Slowed by practicality</li>
                          <li>{'\uD83D\uDCAD'} Build {'\u2192'} Own {'\u2192'} Protect</li>
                          <li>{'\uD83C\uDFAF'} 75% focus - Goal-locked</li>
                          <li>{'\uD83D\uDCCA'} Practical results drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Fire grounded by Earth. Can BUILD what they
                          conquer rather than just burning through. The practical warrior who
                          fights to own, not just to win.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Both are {'\u201C'}modified Aries{'\u201D'} (120 BPM vs 110 BPM)
                      compared to pure-fire mid-range zones. Both bridge to neighboring elements. But Zone 1
                      bridges to WATER (feeling), Zone 6 bridges to EARTH (building). Zone 1 fights for the
                      vulnerable; Zone 6 fights for what{'\u2019'}s theirs.
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
                        <h6>Zone 2: Mars/Mars (1st Decan)</h6>
                        <p><strong>Pure Aries - Instinct King</strong></p>
                        <ul>
                          <li>{'\u2694\uFE0F'} 100% Mars influence</li>
                          <li>{'\uD83D\uDCA5'} Act first, think never</li>
                          <li>{'\uD83D\uDCAC'} 40% verbal (minimal)</li>
                          <li>{'\uD83C\uDFAF'} 80% focus (tunnel vision)</li>
                          <li>{'\uD83D\uDCDA'} Trial by combat ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Mars/Sun (2nd Decan)</h6>
                        <p><strong>Aries + Leo - Strategic Warrior</strong></p>
                        <ul>
                          <li>{'\u2600\uFE0F'} Sun adds strategy + ego</li>
                          <li>{'\uD83D\uDD0D'} Calculate then strike</li>
                          <li>{'\uD83D\uDCAC'} 65% verbal (authoritative)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (strategic lock)</li>
                          <li>{'\uD83D\uDCDA'} Mentorship + strategy</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Mars/Jupiter (3rd Decan)</h6>
                        <p><strong>Aries + Taurus Cusp - Practical Builder</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF0D'} Jupiter (Sagittarius) adds expansion</li>
                          <li>{'\uD83D\uDEE0\uFE0F'} Build what you conquer</li>
                          <li>{'\uD83D\uDCAC'} 55% verbal (practical)</li>
                          <li>{'\uD83C\uDFAF'} 75% focus (goal-oriented)</li>
                          <li>{'\uD83D\uDCDA'} Hands-on construction</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> Verbal intelligence increases across decans
                      (40% {'\u2192'} 65% {'\u2192'} 55%), focus shifts from tunnel vision (80%) to strategic lock (85%)
                      to practical goal-orientation (75%). Aries becomes more grounded but less explosive
                      as it approaches Taurus.
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
                              style.zoneId === 2 ? "Leads by example only \u2014 \"Follow me or get out of my way\"" :
                              style.zoneId === 4 ? "Teaches through strategy and mentorship \u2014 \"Here's the battle plan\"" :
                              style.zoneId === 5 ? "Teaches through storytelling \u2014 \"Let me tell you what I learned\"" :
                              style.zoneId === 6 ? "Teaches through demonstration \u2014 \"Watch me build this\"" :
                              style.teachingAbility < 30 ? "Demonstrates, doesn't explain" :
                              style.teachingAbility < 60 ? "Shows and tells basics" :
                              "Systematically instructs"
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Inspires through passionate speeches and heartfelt action" :
                              style.zoneId === 2 ? "Charges into battle first \u2014 others follow or don't" :
                              style.zoneId === 3 ? "Performs brilliantly and others learn by watching the show" :
                              style.zoneId === 4 ? "Draws up the battle plan on the whiteboard like a general" :
                              style.zoneId === 5 ? "Tells epic adventure stories that contain hidden wisdom" :
                              "Builds something tangible and says \u2014 \"Now you try\""
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 2 (15% teaching) can{'\u2019'}t explain their mastery{'\u2014'}
                    they just DO it and expect you to keep up. Zone 4 (65% teaching) is the best Aries
                    teacher because strategic thinking allows structured knowledge transfer. Zone 5 (60% teaching)
                    teaches through adventure stories. The pattern: Aries teaches by DOING, not by EXPLAINING.
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
            <h4>{'\u2694\uFE0F'} Warriors & Leaders</h4>
            <div className="example-content">
              <p><strong>Zone 2-4 Dominance:</strong> Pure instinct warriors to strategic conquerors</p>
              <ul>
                <li><strong>Alexander the Great:</strong> Likely Zone 2 {'\u2014'} pure instinctive conquest, acted before strategizing, conquered the known world by age 30</li>
                <li><strong>Napoleon Bonaparte:</strong> Likely Zone 4 {'\u2014'} strategic warrior, calculated campaigns, built empires through disciplined military planning</li>
              </ul>
              <p className="example-note">
                Why different zones? Alexander charged headfirst into battle (Zone 2 impulse).
                Napoleon studied maps for hours before striking (Zone 4 strategy). Both Aries fire,
                completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDFAD'} Athletes & Performers</h4>
            <div className="example-content">
              <p><strong>Zone 1-3 Range:</strong> Spiritual warriors to performance champions</p>
              <ul>
                <li><strong>Lady Gaga:</strong> Zone 3 performance-driven {'\u2014'} identifies the stage, executes with flair, lives for creative recognition</li>
                <li><strong>Jackie Chan:</strong> Zone 1 spiritual warrior {'\u2014'} martial arts as spiritual practice, compassionate action hero, fights to protect</li>
              </ul>
              <p className="example-note">
                Zone 3 = the stage IS the battlefield. Zone 1 = the battlefield IS a spiritual calling.
                Both use Aries fire but channel it through completely different cognitive lenses.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDCDA'} Philosophers & Explorers</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Adventurer-philosophers and practical builders</p>
              <ul>
                <li><strong>Thomas Jefferson:</strong> Zone 5 philosophical {'\u2014'} explored ideas of freedom, extracted meaning from revolution, shared wisdom through founding documents</li>
                <li><strong>Leonardo da Vinci:</strong> Zone 5-6 explorer-builder {'\u2014'} insatiable curiosity (Zone 5) combined with practical invention (Zone 6)</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the rare Aries who THINKS about their fire. Jefferson philosophized about
                freedom; da Vinci turned exploration into tangible inventions. Both prove Aries
                can be intellectual, not just physical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83D\uDCA1'} Practical Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} In Relationships</h4>
            <p>
              <strong>Zone 2 + Zone 5 couple:</strong> Zone 2 will feel {'\u201C'}philosophized to death{'\u201D'} by Zone 5{'\u2019'}s
              endless meaning-making. Zone 5 will feel {'\u201C'}dragged into chaos{'\u201D'} by Zone 2{'\u2019'}s instant
              action without reflection. Solution: Zone 2 acts, Zone 5 reflects. Accept that one
              charges first and the other finds the meaning afterward.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCBC'} At Work</h4>
            <p>
              <strong>Zone 2:</strong> Front-line execution {'\u2014'} first responders, sales closers, crisis managers.
              Don{'\u2019'}t ask them to write the strategy document.<br/>
              <strong>Zone 4:</strong> Strategic command {'\u2014'} project leads, military officers, CEOs.
              They calculate THEN strike.<br/>
              <strong>Zone 5:</strong> Visionary roles {'\u2014'} entrepreneurs, explorers, thought leaders.
              They need freedom to discover meaning.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} In Learning</h4>
            <p>
              <strong>Zone 2:</strong> Learn by combat {'\u2014'} throw them in the deep end, they{'\u2019'}ll figure it out or fail fast.<br/>
              <strong>Zone 4:</strong> Learn by strategy {'\u2014'} give them the battle plan, case studies, and a mentor.<br/>
              <strong>Zone 5:</strong> Learn by exploration {'\u2014'} set them loose with a question and let them discover the answer.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFAF'} In GENESIS</h4>
            <p>
              <strong>Zone matching:</strong> Zone 2 Aries needs a grounding partner (Taurus or Capricorn zones)
              to prevent burnout from constant action. Zone 4 Aries pairs well with strategic earth signs
              for empire-building. Zone 5 Aries thrives with Sagittarius or Aquarius zones that share
              the love of philosophical adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Cognitive Diversity</h3>
          <p>
            There is no {'\u201C'}best{'\u201D'} Aries thinking style. Zone 2{'\u2019'}s pure instinct wins emergencies{'\u2014'}when
            the building is on fire, you want the person who ACTS without thinking. Zone 4{'\u2019'}s strategy
            builds empires{'\u2014'}Napoleon didn{'\u2019'}t conquer Europe by charging blindly. Zone 5{'\u2019'}s philosophy
            discovers meaning{'\u2014'}Jefferson didn{'\u2019'}t just fight for freedom, he articulated WHY.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Aries to be the same. The Zone 2
            warrior is called {'\u201C'}reckless.{'\u201D'} The Zone 5 philosopher is called {'\u201C'}not a real Aries.{'\u201D'}
            The Zone 6 builder is called {'\u201C'}too slow.{'\u201D'} All are perfect expressions of their
            constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Constitutional understanding = compassion.</strong> When you know someone processes
            at 150 BPM (Zone 2) vs your 110 BPM (Zone 6), you stop calling them reckless. When you
            know they need instant action (Zone 2) vs philosophical reflection (Zone 5), you communicate
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

export default AriesThinkingStyleTab;
