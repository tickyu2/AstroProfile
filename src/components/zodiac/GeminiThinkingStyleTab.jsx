import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Gemini Thinking Style Tab Component
 * Deep dive into cognitive differences across Gemini zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const GeminiThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 6]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Grounded-Communicative Thinking",
      archetype: "The Practical Translator",
      processingSpeed: "Moderate (100 BPM)",
      primaryMode: "Communicate \u2192 Apply \u2192 Build Understanding",
      thoughtPattern: 'Hear information \u2192 Translate to practical terms \u2192 Apply in real world \u2192 Teach others clearly',
      decisionMaking: "45% impulse, 55% planning \u2014 most grounded Gemini",
      decisionSpeed: "Moderate (minutes-hours) \u2014 takes time to translate",
      learningStyle: "Practical application \u2014 must see real-world use",
      memoryType: "Application-based memory \u2014 remembers how things work",
      abstractionLevel: 45,
      verbalIntelligence: 70,
      metaCognition: 55,
      focus: 65,
      cognitiveFlexibility: 65,
      teachingAbility: 75,
      informationPreference: ["Can I explain it clearly?", "Practical application value", "Logical sense"],
      communicationStyle: "Clear and methodical \u2014 the Gemini who actually finishes explaining",
      motto: "I understand by explaining practically"
    },
    {
      zoneId: 2,
      name: "Pure Information-Flow Thinking",
      archetype: "The Messenger",
      processingSpeed: "Extreme (150 BPM)",
      primaryMode: "Absorb \u2192 Transmit \u2192 Connect \u2192 NEXT!",
      thoughtPattern: 'New information! \u2192 Process instantly \u2192 Share with everyone \u2192 Where is the NEXT thing?',
      decisionMaking: "90% impulse, 10% planning \u2014 pure information butterfly",
      decisionSpeed: "INSTANT \u2014 decides by novelty factor",
      learningStyle: "Information surfing \u2014 skims everything deeply",
      memoryType: "Associative network \u2014 connects everything to everything",
      abstractionLevel: 55,
      verbalIntelligence: 95,
      metaCognition: 40,
      focus: 35,
      cognitiveFlexibility: 95,
      teachingAbility: 50,
      informationPreference: ["Is it NEW?", "Can I share socially?", "Does it connect to other things?"],
      communicationStyle: "Rapid-fire stream of consciousness \u2014 classic Gemini motor-mouth",
      motto: "So much to know, tell me everything NOW!"
    },
    {
      zoneId: 3,
      name: "Harmonious-Diplomatic Thinking",
      archetype: "The Mediator",
      processingSpeed: "Medium (120 BPM)",
      primaryMode: "Analyze \u2192 Balance \u2192 Harmonize \u2192 Resolve",
      thoughtPattern: 'See both sides \u2192 Weigh perspectives \u2192 Find synthesis \u2192 Create elegant resolution',
      decisionMaking: "35% impulse, 65% deliberation \u2014 weighs all sides",
      decisionSpeed: "Moderate (hours-days) \u2014 needs to consider everyone",
      learningStyle: "Comparative analysis \u2014 learns by weighing perspectives",
      memoryType: "Balanced perspective memory \u2014 remembers all viewpoints",
      abstractionLevel: 70,
      verbalIntelligence: 85,
      metaCognition: 65,
      focus: 60,
      cognitiveFlexibility: 80,
      teachingAbility: 70,
      informationPreference: ["Does it create harmony?", "Is it objectively fair?", "Is it aesthetically elegant?"],
      communicationStyle: "Diplomatic and balanced \u2014 can argue any side convincingly",
      motto: "There are two sides, beauty lies in synthesis"
    },
    {
      zoneId: 4,
      name: "Strategic-Network Thinking",
      archetype: "The Connector",
      processingSpeed: "Fast (130 BPM)",
      primaryMode: "Connect \u2192 Position \u2192 Leverage \u2192 Build Network",
      thoughtPattern: 'Map the network \u2192 Identify key nodes \u2192 Position strategically \u2192 Build social capital',
      decisionMaking: "50% impulse, 50% strategic \u2014 the most calculating Gemini",
      decisionSpeed: "Fast but strategic (minutes-hours)",
      learningStyle: "Network-based \u2014 learns through connections and social intelligence",
      memoryType: "Relational database \u2014 remembers who knows what and who",
      abstractionLevel: 65,
      verbalIntelligence: 80,
      metaCognition: 70,
      focus: 65,
      cognitiveFlexibility: 75,
      teachingAbility: 60,
      informationPreference: ["Network value", "Strategic positioning", "Relationship ROI"],
      communicationStyle: "Charming and strategic \u2014 always networking, always connecting",
      motto: "It's who you know, and I know everyone"
    },
    {
      zoneId: 5,
      name: "Innovative-Abstract Thinking",
      archetype: "The Visionary",
      processingSpeed: "Fast (140 BPM)",
      primaryMode: "Innovate \u2192 Abstract \u2192 Revolutionize \u2192 Inspire",
      thoughtPattern: 'See impossible problem \u2192 Imagine revolutionary solution \u2192 Build theoretical framework \u2192 Share vision with world',
      decisionMaking: "70% visionary impulse, 30% systematic planning",
      decisionSpeed: "Fast but variable \u2014 trusts intellectual intuition",
      learningStyle: "Paradigm-breaking \u2014 learns by questioning everything",
      memoryType: "Conceptual framework memory \u2014 remembers systems and patterns",
      abstractionLevel: 90,
      verbalIntelligence: 85,
      metaCognition: 80,
      focus: 50,
      cognitiveFlexibility: 95,
      teachingAbility: 65,
      informationPreference: ["Humanitarian impact", "Systemic innovation", "Future paradigm potential"],
      communicationStyle: "Visionary and abstract \u2014 speaks in paradigms and possibilities",
      motto: "The future is imagined and built"
    },
    {
      zoneId: 6,
      name: "Emotionally-Intelligent Thinking",
      archetype: "The Empathic Communicator",
      processingSpeed: "Moderate (95 BPM)",
      primaryMode: "Feel \u2192 Understand \u2192 Nurture \u2192 Connect Deeply",
      thoughtPattern: 'Sense emotional undercurrent \u2192 Process through feeling \u2192 Understand deeply \u2192 Nurture with words',
      decisionMaking: "40% impulse, 60% emotional processing \u2014 slowest Gemini",
      decisionSpeed: "Moderate (processes emotions first) \u2014 needs to feel it out",
      learningStyle: "Emotional immersion \u2014 learns through empathy and connection",
      memoryType: "Emotional narrative memory \u2014 remembers how things felt",
      abstractionLevel: 60,
      verbalIntelligence: 85,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["How does it FEEL?", "Is it emotionally right?", "Does it protect emotional safety?"],
      communicationStyle: "Warm and empathic \u2014 the Gemini who actually listens before speaking",
      motto: "I understand what you feel, not just what you say"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Gemini Spectrum</h2>
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
            Two Gemini Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 thinks at 150 BPM with pure information-surfing, while Zone 6 thinks at 95 BPM
            with emotional intelligence. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through rapid-fire information absorption (Zone 2) vs empathic emotional connection (Zone 6),
            you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} The Cognitive Opposites</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Messenger</h6>
                        <ul>
                          <li>{'\u26A1'} 150 BPM {'\u2014'} Fastest thinker</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 55% abstraction {'\u2014'} Moderate abstraction</li>
                          <li>{'\uD83D\uDCAC'} 95% verbal {'\u2014'} Maximum verbal output</li>
                          <li>{'\uD83E\uDE9E'} 40% meta-cognition {'\u2014'} Low self-reflection</li>
                          <li>{'\uD83C\uDFAF'} 35% focus {'\u2014'} Information butterfly</li>
                          <li>{'\uD83E\uDD38'} 95% flexibility {'\u2014'} Infinite mental pivots</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}So much to know, tell me everything NOW!{'\u201D'}
                          The classic {'\u201C'}Gemini butterfly{'\u201D'} {'\u2014'} infinite information, zero focus.
                          Gathers everything but rarely goes deep on any single topic.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Empathic Communicator</h6>
                        <ul>
                          <li>{'\u26A1'} 95 BPM {'\u2014'} Slowest Gemini thinker</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 60% abstraction {'\u2014'} Emotionally-grounded abstraction</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal {'\u2014'} High but empathic output</li>
                          <li>{'\uD83E\uDE9E'} 75% meta-cognition {'\u2014'} Deep self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 70% focus {'\u2014'} Emotionally anchored attention</li>
                          <li>{'\uD83E\uDD38'} 70% flexibility {'\u2014'} Moderate adaptability</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I understand what you feel, not just what you say.{'\u201D'}
                          The Gemini who FEELS {'\u2014'} processes emotions before sharing information.
                          Listens before speaking, nurtures with words.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} Working Together:</strong> Zone 2 is the classic {'\u201C'}Gemini butterfly{'\u201D'} {'\u2014'} infinite
                      information, zero focus. Zone 6 is the Gemini who FEELS {'\u2014'} processes emotions before
                      sharing information. Together they{'\u2019'}re complete: Zone 2 gathers, Zone 6 understands.
                      Zone 2 brings the world{'\u2019'}s information to Zone 6, who gives it emotional meaning.
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
                        <h6>Zone 1: Taurus-Gemini Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDF0D'} 25% Taurus (Earth) influence</li>
                          <li>{'\u26A1'} 100 BPM {'\u2014'} Grounded for an air sign</li>
                          <li>{'\uD83D\uDCAD'} Communicate {'\u2192'} Apply thinking</li>
                          <li>{'\uD83C\uDFAF'} 65% focus {'\u2014'} Practical concentration</li>
                          <li>{'\uD83D\uDCCA'} Real-world application first</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air grounded by Earth. Can APPLY
                          what they learn, then explain it practically. Most grounded Gemini
                          thinker (entering from Taurus).
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Gemini-Cancer Cusp</h6>
                        <ul>
                          <li>{'\uD83D\uDCA7'} 25% Cancer (Water) influence</li>
                          <li>{'\u26A1'} 95 BPM {'\u2014'} Emotionally paced</li>
                          <li>{'\uD83D\uDCAD'} Feel {'\u2192'} Understand thinking</li>
                          <li>{'\uD83C\uDFAF'} 70% focus {'\u2014'} Emotionally anchored</li>
                          <li>{'\uD83D\uDCCA'} Emotional resonance first</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Air enriched by Water. Can FEEL
                          what they communicate, then nurture with words. Most emotionally
                          intelligent Gemini (exiting toward Cancer).
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Both are {'\u201C'}modified Gemini{'\u201D'} {'\u2014'} Zone 1 bridges to
                      EARTH (practicality), Zone 6 bridges to WATER (emotion). Both are slower
                      Gemini (~100 vs ~95 BPM) compared to mid-range zones. Difference: Zone 1 translates
                      information to practical terms, Zone 6 translates information to emotional understanding.
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
                        <h6>Zone 2: Mercury/Mercury (1st Decan)</h6>
                        <p><strong>Pure Gemini {'\u2014'} Information Machine</strong></p>
                        <ul>
                          <li>{'\u263F'} 100% Mercury influence</li>
                          <li>{'\uD83D\uDCAC'} 95% verbal (maximum)</li>
                          <li>{'\uD83C\uDFAF'} 35% focus (minimum)</li>
                          <li>{'\uD83E\uDD38'} 95% flexibility (maximum)</li>
                          <li>{'\uD83D\uDCDA'} Information surfing</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Mercury/Venus (2nd Decan)</h6>
                        <p><strong>Gemini + Libra {'\u2014'} Strategic Networker</strong></p>
                        <ul>
                          <li>{'\u2640'} Venus adds charm and strategy</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal (charming)</li>
                          <li>{'\uD83C\uDFAF'} 65% focus (strategic)</li>
                          <li>{'\uD83E\uDD38'} 75% flexibility (purposeful)</li>
                          <li>{'\uD83D\uDCDA'} Network-based learning</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Mercury/Uranus (3rd Decan)</h6>
                        <p><strong>Gemini + Cancer Cusp {'\u2014'} Emotional Communicator</strong></p>
                        <ul>
                          <li>{'\u2643'} Uranus adds emotional depth approaching Cancer</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (empathic)</li>
                          <li>{'\uD83C\uDFAF'} 70% focus (emotionally anchored)</li>
                          <li>{'\uD83E\uDD38'} 70% flexibility (grounded)</li>
                          <li>{'\uD83D\uDCDA'} Emotional immersion learning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> Verbal intelligence stays high across decans
                      (95% {'\u2192'} 80% {'\u2192'} 85%) while focus increases dramatically (35% {'\u2192'} 65% {'\u2192'} 70%).
                      Gemini becomes more focused and emotionally aware as it approaches Cancer.
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
                              style.zoneId === 1 ? "Teaches practically \u2014 \"Here's how this works in real life\"" :
                              style.zoneId === 2 ? "Teaches by overwhelming with info \u2014 \"Let me tell you 47 things about this\"" :
                              style.zoneId === 3 ? "Teaches diplomatically \u2014 \"Here are both perspectives\"" :
                              style.zoneId === 4 ? "Teaches through connection \u2014 \"Let me introduce you to the right person\"" :
                              style.zoneId === 5 ? "Teaches through vision \u2014 \"Imagine what this could become\"" :
                              "Teaches through empathy \u2014 \"I understand what you're struggling with\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Walks you through a real-world application step by step" :
                              style.zoneId === 2 ? "Rapid-fire facts and connections \u2014 entertaining but overwhelming" :
                              style.zoneId === 3 ? "Presents balanced perspectives, lets you decide" :
                              style.zoneId === 4 ? "Connects you to experts and resources in their network" :
                              style.zoneId === 5 ? "Paints a revolutionary vision that inspires paradigm shifts" :
                              "Reads your emotional state and adapts their explanation to what you need"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 2 (50% teaching) overwhelms with information{'\u2014'}they
                    know everything but can{'\u2019'}t slow down to teach effectively. Zone 6 (80% teaching) FEELS what
                    the student needs{'\u2014'}they adapt their communication to the learner{'\u2019'}s emotional state.
                    Zone 1 (75% teaching) grounds it in practice. All Gemini zones are natural communicators,
                    but their teaching effectiveness varies based on whether they can SLOW DOWN enough to meet the learner.
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
            <h4>{'\uD83C\uDFA4'} Communicators & Writers</h4>
            <div className="example-content">
              <p><strong>Zones 3-5:</strong> Diplomatic articulation or visionary communication</p>
              <ul>
                <li><strong>Bob Dylan (May 24):</strong> Zone 5 visionary {'\u2014'} paradigm-breaking lyrics that revolutionize how we think about music and poetry</li>
                <li><strong>Salman Rushdie (June 19):</strong> Zone 3 both-sides literary genius {'\u2014'} can hold multiple cultural perspectives simultaneously in prose</li>
              </ul>
              <p className="example-note">
                Gemini writers don{'\u2019'}t just write{'\u2014'}they THINK on paper. Zone 5 breaks paradigms through words,
                while Zone 3 synthesizes opposing viewpoints into literary harmony.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDF1F'} Entertainers & Connectors</h4>
            <div className="example-content">
              <p><strong>Zone 2 and Zone 6:</strong> Information explosion vs emotional communication</p>
              <ul>
                <li><strong>Kanye West (June 8):</strong> Zone 2 info-explosion {'\u2014'} rapid-fire stream of consciousness that connects music, fashion, architecture, and politics</li>
                <li><strong>Angelina Jolie (June 4):</strong> Zone 6 emotional communicator {'\u2014'} uses Gemini verbal gifts to advocate, nurture, and connect on a deep human level</li>
              </ul>
              <p className="example-note">
                Zone 2 entertains by overwhelming you with brilliance and novelty.
                Zone 6 connects by making you FEEL understood. Both are powerful Gemini communicators,
                but their impact is completely different.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDD2C'} Thinkers & Innovators</h4>
            <div className="example-content">
              <p><strong>Zones 4-5:</strong> Strategic networking or abstract innovation</p>
              <ul>
                <li><strong>Nikola Tesla (June 28):</strong> Zone 5 abstract visionary {'\u2014'} imagined revolutionary technology through pure conceptual frameworks</li>
                <li><strong>John F. Kennedy (May 29):</strong> Zone 4 strategic networker {'\u2014'} mapped social and political networks to position himself and inspire a nation</li>
              </ul>
              <p className="example-note">
                Zone 5 innovates by imagining what doesn{'\u2019'}t exist yet{'\u2014'}pure abstraction made real.
                Zone 4 innovates by connecting the right people at the right time{'\u2014'}strategic social intelligence
                that changes history.
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
              <strong>Zone 2 + Zone 6 couple:</strong> Zone 2 will feel {'\u201C'}slowed down{'\u201D'} by Zone 6{'\u2019'}s
              emotional processing. Zone 6 will feel {'\u201C'}unheard{'\u201D'} by Zone 2{'\u2019'}s rapid-fire information
              surfing. Solution: Zone 2 slows down to LISTEN, Zone 6 speeds up to EXPLORE.
              Accept different processing speeds{'\u2014'}150 BPM vs 95 BPM is a real cognitive gap.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCBC'} At Work</h4>
            <p>
              <strong>Zone 2:</strong> Information gathering, research, brainstorming{'\u2014'}they scan everything fast.
              Don{'\u2019'}t ask them to go deep on one thing.<br/>
              <strong>Zone 3:</strong> Mediation, negotiation, diplomacy{'\u2014'}they see all sides naturally.<br/>
              <strong>Zone 4:</strong> Networking, business development, strategic partnerships{'\u2014'}they connect everyone.<br/>
              <strong>Zone 5:</strong> Innovation, R&D, future strategy{'\u2014'}they see what doesn{'\u2019'}t exist yet.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} In Learning</h4>
            <p>
              <strong>Zone 2:</strong> Skim everything fast, then circle back{'\u2014'}breadth before depth.<br/>
              <strong>Zone 3:</strong> Compare perspectives{'\u2014'}give them both sides and let them synthesize.<br/>
              <strong>Zone 6:</strong> Connect emotionally first{'\u2014'}they need to FEEL why it matters before processing.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFAF'} In GENESIS</h4>
            <p>
              <strong>Zone matching for Gemini types:</strong> Zone 2 Gemini pairs well with earth signs who ground
              their information tornado. Zone 6 Gemini connects beautifully with water signs who match their
              emotional depth. Zone 4 Gemini thrives with fire signs who appreciate their strategic networking.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Gemini Cognitive Diversity</h3>
          <p>
            There is no {'\u201C'}best{'\u201D'} thinking style. Zone 2{'\u2019'}s information speed connects the world{'\u2014'}they
            are the messengers who ensure nothing is missed. Zone 3{'\u2019'}s diplomacy heals divides{'\u2014'}they see
            both sides when everyone else is polarized. Zone 6{'\u2019'}s emotional intelligence nurtures souls{'\u2014'}they
            feel what words alone cannot convey.
          </p>
          <p>
            <strong>The tragedy</strong> is when we reduce all Gemini to {'\u201C'}superficial butterfly.{'\u201D'} Zone 6 feels
            DEEPLY. Zone 5 thinks ABSTRACTLY. Zone 3 mediates WISELY. The stereotype only fits Zone 2 at its
            most extreme{'\u2014'}and even Zone 2{'\u2019'}s speed is a gift, not a flaw.
          </p>
          <p className="philosophy-highlight">
            <strong>Constitutional understanding = compassion.</strong> When you know someone processes
            at 150 BPM (Zone 2) vs your 95 BPM (Zone 6), you stop calling them {'\u201C'}scattered.{'\u201D'} When you know
            they need emotional resonance (Zone 6) vs novel information (Zone 2), you communicate in their language.
          </p>
          <p className="final-note">
            All six zones are perfect expressions of Gemini{'\u2019'}s essential gift: <em>the ability to connect
            minds, bridge perspectives, and translate the world into shared understanding</em>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GeminiThinkingStyleTab;
