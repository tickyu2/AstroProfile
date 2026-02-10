import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Cancer Thinking Style Tab Component
 * Deep dive into cognitive differences across Cancer zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const CancerThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Articulate-Emotional Thinking",
      archetype: "The Feeling Communicator",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Feel \u2192 Articulate \u2192 Connect \u2192 Nurture",
      thoughtPattern: 'Emotion rises \u2192 Words form \u2192 Understanding builds \u2192 Safety created',
      decisionMaking: "35% feelings, 25% communication, 20% safety, 20% care",
      decisionSpeed: "Medium (hours)",
      learningStyle: "Conversational emotional processing",
      memoryType: "Verbal-emotional associations",
      abstractionLevel: 50,
      verbalIntelligence: 80,
      metaCognition: 70,
      focus: 65,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["Emotional stories", "Personal connection", "Practical care tips"],
      communicationStyle: "Warmly articulate and empathetic",
      motto: "I feel deeply and speak clearly"
    },
    {
      zoneId: 2,
      name: "Pure Emotional-Memory Thinking",
      archetype: "The Feeling Archive",
      processingSpeed: "Slow (55 BPM)",
      primaryMode: "Feel \u2192 Remember \u2192 Protect \u2192 Nurture",
      thoughtPattern: 'Emotion floods \u2192 Memory activates \u2192 Safety assessed \u2192 Care given',
      decisionMaking: "45% emotional safety, 30% family, 15% comfort, 10% history",
      decisionSpeed: "Very slow (days)",
      learningStyle: "Emotional immersion and repetition",
      memoryType: "Deep emotional-sensory memory",
      abstractionLevel: 25,
      verbalIntelligence: 40,
      metaCognition: 45,
      focus: 90,
      cognitiveFlexibility: 30,
      teachingAbility: 55,
      informationPreference: ["Familiar patterns", "Emotional resonance", "Safety signals"],
      communicationStyle: "Deeply feeling, few words",
      motto: "I feel everything, I remember forever"
    },
    {
      zoneId: 3,
      name: "Protective-Intuitive Thinking",
      archetype: "The Psychic Guardian",
      processingSpeed: "Moderate (65 BPM)",
      primaryMode: "Sense \u2192 Assess threat \u2192 Protect \u2192 Transform",
      thoughtPattern: 'Intuition alerts \u2192 Threat evaluated \u2192 Boundaries activated \u2192 Pain transmuted',
      decisionMaking: "50% threat detection, 25% boundaries, 15% bonding, 10% transformation",
      decisionSpeed: "Slow unless threatened (then instant)",
      learningStyle: "Pattern-based threat detection",
      memoryType: "Psychic-protective imprints",
      abstractionLevel: 45,
      verbalIntelligence: 50,
      metaCognition: 75,
      focus: 95,
      cognitiveFlexibility: 40,
      teachingAbility: 45,
      informationPreference: ["Danger signals", "Loyalty tests", "Deep emotional truths"],
      communicationStyle: "Intense, penetrating, few but powerful words",
      motto: "I sense danger, I protect fiercely"
    },
    {
      zoneId: 4,
      name: "Transformative-Emotional Thinking",
      archetype: "The Depth Alchemist",
      processingSpeed: "Very slow (50 BPM)",
      primaryMode: "Descend \u2192 Transform \u2192 Regenerate \u2192 Emerge",
      thoughtPattern: 'Pain enters \u2192 Depths explored \u2192 Alchemy occurs \u2192 Wisdom surfaces',
      decisionMaking: "45% transformation, 25% understanding, 20% truth, 10% intensity",
      decisionSpeed: "Very slow (waits for deep knowing)",
      learningStyle: "Crisis-driven depth immersion",
      memoryType: "Transformative-archetypal memory",
      abstractionLevel: 65,
      verbalIntelligence: 55,
      metaCognition: 90,
      focus: 100,
      cognitiveFlexibility: 45,
      teachingAbility: 60,
      informationPreference: ["Psychological depth", "Hidden patterns", "Crisis catalysts"],
      communicationStyle: "Intense, revealing, emotionally powerful",
      motto: "I die emotionally and rise transformed"
    },
    {
      zoneId: 5,
      name: "Mystic-Compassionate Thinking",
      archetype: "The Universal Heart",
      processingSpeed: "Very slow (45 BPM)",
      primaryMode: "Receive \u2192 Dissolve \u2192 Heal \u2192 Transcend",
      thoughtPattern: 'Universal feeling \u2192 Boundaries dissolve \u2192 Compassion flows \u2192 Spirit heals',
      decisionMaking: "45% universal love, 25% suffering reduction, 20% sacred, 10% compassion",
      decisionSpeed: "Very slow (waits for divine timing)",
      learningStyle: "Spiritual absorption and intuitive knowing",
      memoryType: "Spiritual-collective memory",
      abstractionLevel: 80,
      verbalIntelligence: 60,
      metaCognition: 60,
      focus: 50,
      cognitiveFlexibility: 85,
      teachingAbility: 70,
      informationPreference: ["Spiritual truths", "Universal patterns", "Healing modalities"],
      communicationStyle: "Gentle, poetic, transcendent",
      motto: "I love all beings, I am all beings"
    },
    {
      zoneId: 6,
      name: "Radiant-Emotional Thinking",
      archetype: "The Joyful Nurturer",
      processingSpeed: "Moderate (70 BPM)",
      primaryMode: "Feel \u2192 Create \u2192 Share \u2192 Celebrate",
      thoughtPattern: 'Emotion warms \u2192 Creative spark \u2192 Generous expression \u2192 Joy radiates',
      decisionMaking: "40% joy, 25% creative expression, 20% appreciation, 15% beauty",
      decisionSpeed: "Medium (hours)",
      learningStyle: "Creative emotional engagement",
      memoryType: "Warm-celebratory memory",
      abstractionLevel: 50,
      verbalIntelligence: 70,
      metaCognition: 65,
      focus: 75,
      cognitiveFlexibility: 65,
      teachingAbility: 75,
      informationPreference: ["Joyful stories", "Creative inspiration", "Family traditions"],
      communicationStyle: "Warm, generous, expressive",
      motto: "I nurture with joy, I shine with love"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Cancer Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you feel, process, and nurture reality
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
            Two Cancer Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 55 BPM with pure emotional immersion, while Zone 4 (15-19{'\u00B0'}) thinks at 50 BPM
            with transformative depth. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through pure emotional memory (Zone 2) vs transformative alchemy (Zone 4), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} Pure Empath vs Universal Heart</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Feeling Archive</h6>
                        <ul>
                          <li>{'\u26A1'} 55 BPM - Slow, deep emotional processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 25% abstraction - Concrete emotional reality</li>
                          <li>{'\uD83D\uDCAC'} 40% verbal - Feelings beyond words</li>
                          <li>{'\uD83E\uDE9E'} 45% meta-cognition - Feels before reflecting</li>
                          <li>{'\uD83C\uDFAF'} 90% focus - Total emotional immersion</li>
                          <li>{'\uD83E\uDD38'} 30% flexibility - Anchored in familiar patterns</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I feel everything, I remember forever.{'\u201D'}
                          Maximum emotional depth with laser focus. Processes every feeling
                          through the archive of personal memory. The most deeply feeling zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 5: The Universal Heart</h6>
                        <ul>
                          <li>{'\u26A1'} 45 BPM - Slowest, most transcendent</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 80% abstraction - Works with universal truths</li>
                          <li>{'\uD83D\uDCAC'} 60% verbal - Poetic and transcendent</li>
                          <li>{'\uD83E\uDE9E'} 60% meta-cognition - Spiritual self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 50% focus - Broad universal awareness</li>
                          <li>{'\uD83E\uDD38'} 85% flexibility - Dissolves all boundaries</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I love all beings, I am all beings.{'\u201D'}
                          The highest abstraction and flexibility in Cancer. Dissolves personal
                          boundaries to feel everything universally. The mystic healer.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 feels everything personally with laser focus.
                      Zone 5 dissolves personal boundaries to feel everything universally.
                      Together they represent Cancer{'\u2019'}s full emotional spectrum: from intimate to cosmic.
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
                        <h6>Zone 1: Gemini-Cancer Cusp</h6>
                        <ul>
                          <li>{'\uD83D\uDCAC'} Gemini influence adds verbal intelligence (80)</li>
                          <li>{'\u26A1'} 80 BPM - Fastest Cancer thinker</li>
                          <li>{'\uD83D\uDCAD'} Feel {'\u2192'} Articulate {'\u2192'} Connect</li>
                          <li>{'\uD83C\uDFAF'} 65% focus - Balanced attention</li>
                          <li>{'\uD83D\uDCCA'} Communication drives decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water enriched by Air. Can ARTICULATE feelings
                          that other Cancer zones can only sense. The emotional communicator who
                          bridges feeling and language with natural fluency.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Cancer-Leo Cusp</h6>
                        <ul>
                          <li>{'\u2600\uFE0F'} Leo influence adds warmth, creativity, confidence</li>
                          <li>{'\u26A1'} 70 BPM - Warmed by solar energy</li>
                          <li>{'\uD83D\uDCAD'} Feel {'\u2192'} Create {'\u2192'} Share {'\u2192'} Celebrate</li>
                          <li>{'\uD83C\uDFAF'} 75% focus - Creative concentration</li>
                          <li>{'\uD83D\uDCCA'} Joy and expression drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water warmed by Fire. Can RADIATE feelings
                          outward rather than holding them inside. The joyful nurturer who
                          transforms caring into celebration and creative expression.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges emotion and language (Gemini cusp).
                      Zone 6 bridges emotion and radiance (Leo cusp). Both are more expressive than
                      pure Cancer, but in different ways: words vs warmth. Zone 1 teaching ability (80)
                      and Zone 6 teaching ability (75) are the highest in the Cancer spectrum precisely
                      because cusp energy adds expressive capacity.
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
                        <h6>Zone 2: Moon/Moon (1st Decan)</h6>
                        <p><strong>Pure Cancer - Lunar Empath</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF19'} 100% Moon influence</li>
                          <li>{'\uD83D\uDCA7'} Feel first, process later</li>
                          <li>{'\uD83D\uDCAC'} 40% verbal (minimal)</li>
                          <li>{'\uD83C\uDFAF'} 90% focus (total immersion)</li>
                          <li>{'\uD83D\uDCDA'} Emotional repetition ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Moon/Pluto (2nd Decan)</h6>
                        <p><strong>Cancer + Scorpio - Depth Alchemist</strong></p>
                        <ul>
                          <li>{'\uD83E\uDD82'} Pluto adds transformation + depth</li>
                          <li>{'\uD83D\uDD0D'} Descend then emerge</li>
                          <li>{'\uD83D\uDCAC'} 55% verbal (intense)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (absolute lock)</li>
                          <li>{'\uD83D\uDCDA'} Crisis-driven immersion</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Moon/Neptune (3rd Decan)</h6>
                        <p><strong>Cancer + Leo Cusp - Radiant Nurturer</strong></p>
                        <ul>
                          <li>{'\u2600\uFE0F'} Sun/Neptune adds warmth + creativity</li>
                          <li>{'\uD83C\uDFA8'} Create what you feel</li>
                          <li>{'\uD83D\uDCAC'} 70% verbal (expressive)</li>
                          <li>{'\uD83C\uDFAF'} 75% focus (balanced)</li>
                          <li>{'\uD83D\uDCDA'} Creative emotional engagement</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Cancer from pure
                      feeling (Zone 2) through transformative depth (Zone 4) to radiant expression (Zone 6).
                      It{'\u2019'}s a progression from inner to outer emotional mastery. Meta-cognition peaks at
                      Zone 4 (90%) where Pluto{'\u2019'}s transformative power demands deep self-awareness, while
                      verbal intelligence rises steadily (40% {'\u2192'} 55% {'\u2192'} 70%) as Cancer learns to
                      express what it feels.
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
                              style.zoneId === 1 ? "Teaches through emotional articulation \u2014 \"Let me help you name what you're feeling\"" :
                              style.zoneId === 2 ? "Teaches through nurturing presence \u2014 \"I'm here, you're safe, feel it all\"" :
                              style.zoneId === 3 ? "Teaches through protective example \u2014 \"Watch how I guard what matters\"" :
                              style.zoneId === 4 ? "Teaches through transformation stories \u2014 \"This is what I survived and what it taught me\"" :
                              style.zoneId === 5 ? "Teaches through spiritual wisdom \u2014 \"All suffering contains a sacred gift\"" :
                              "Teaches through joyful engagement \u2014 \"Let's create something beautiful together\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Articulates emotional nuance so students understand their own feelings clearly" :
                              style.zoneId === 2 ? "Creates a safe emotional container where others feel held enough to learn" :
                              style.zoneId === 3 ? "Demonstrates fierce boundaries so others learn to protect themselves" :
                              style.zoneId === 4 ? "Shares deep transformation journeys that catalyze growth in others" :
                              style.zoneId === 5 ? "Channels universal wisdom that transcends personal experience" :
                              "Engages students through warmth, creativity, and celebratory learning"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 1 (80% teaching) is Cancer{'\u2019'}s best teacher
                    because Gemini cusp energy adds verbal articulation to emotional depth. Zone 3 (45% teaching)
                    teaches least verbally{'\u2014'}it protects by example, not explanation. Zone 6 (75% teaching)
                    teaches through joyful engagement, making learning feel like celebration. The pattern:
                    Cancer teaches by FEELING WITH you, not by EXPLAINING TO you.
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
            <h4>{'\uD83D\uDCAC'} Communicators & Empaths</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Articulate feelers to pure emotional archives</p>
              <ul>
                <li><strong>Meryl Streep:</strong> Zone 1 {'\u2014'} articulates every human emotion with extraordinary verbal precision, the feeling communicator who channels others{'\u2019'} experiences through words</li>
                <li><strong>Princess Diana:</strong> Zone 2 {'\u2014'} the People{'\u2019'}s Empath, felt everything with total immersion, communicated through presence rather than words, remembered every emotional encounter</li>
              </ul>
              <p className="example-note">
                Why different zones? Meryl Streep articulates emotion through language (Zone 1 verbal intelligence 80%).
                Princess Diana radiated pure feeling without needing words (Zone 2 focus 90%, verbal 40%).
                Both Cancer water, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDD25'} Protectors & Transformers</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Fierce guardians to depth alchemists</p>
              <ul>
                <li><strong>Frida Kahlo:</strong> Zone 3 {'\u2014'} transformed pain through fierce art, the psychic guardian who turned suffering into powerful creative protection</li>
                <li><strong>Nelson Mandela:</strong> Zone 4 {'\u2014'} alchemized suffering into wisdom, the depth alchemist who descended into 27 years of imprisonment and emerged with transformative leadership</li>
              </ul>
              <p className="example-note">
                Zone 3 = protection through fierce creative expression. Zone 4 = transformation through
                deep descent and emergence. Frida painted her wounds (Zone 3 protective art). Mandela
                transmuted his suffering (Zone 4 alchemical depth). Both Cancer depth, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2728'} Mystics & Nurturers</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Universal hearts to joyful nurturers</p>
              <ul>
                <li><strong>Dalai Lama:</strong> Zone 5 {'\u2014'} universal compassion embodied, dissolves personal boundaries to feel all beings, teaches through spiritual wisdom and gentle presence</li>
                <li><strong>Robin Williams:</strong> Zone 6 {'\u2014'} brought joy through emotional depth, the joyful nurturer who used creative warmth and humor to nurture millions through laughter</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the outer-directed Cancer. The Dalai Lama dissolves into universal compassion
                (Zone 5 abstraction 80%, flexibility 85%). Robin Williams radiated warmth through creative
                joy (Zone 6 verbal 70%, teaching 75%). Both prove Cancer can illuminate the world,
                not just nurture the home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83D\uDCA1'} Water Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} Emotional Counseling</h4>
            <p>
              <strong>Zone 1:</strong> Excels at talk therapy {'\u2014'} can articulate emotional states with precision,
              helping clients name what they feel. Verbal intelligence (80%) makes them natural counselors.<br/>
              <strong>Zone 2:</strong> Excels at holding space {'\u2014'} pure emotional presence that makes others feel
              safe enough to process. Focus (90%) creates unbreakable therapeutic containers.<br/>
              <strong>Zone 4:</strong> Excels at depth work {'\u2014'} crisis counseling, trauma processing, transformation
              guidance. Meta-cognition (90%) allows insight into the deepest patterns.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFE0'} Caregiving Roles</h4>
            <p>
              <strong>Zone 2:</strong> The ultimate caregiver {'\u2014'} remembers every need, anticipates every comfort,
              creates safety through devoted presence. Don{'\u2019'}t ask them to explain their method; they just FEEL it.<br/>
              <strong>Zone 3:</strong> The protective caregiver {'\u2014'} fiercely guards those in their care,
              intuiting threats before they materialize.<br/>
              <strong>Zone 6:</strong> The joyful caregiver {'\u2014'} nurtures through celebration, creativity,
              and warmth. Makes caregiving feel like love, not duty.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF3F'} Healing Professions</h4>
            <p>
              <strong>Zone 3:</strong> Bodywork and energy healing {'\u2014'} the psychic guardian senses where
              pain lives in the body and channels protective energy to dissolve it.<br/>
              <strong>Zone 5:</strong> Spiritual healing {'\u2014'} connects to universal compassion, channels
              transcendent energy, facilitates soul-level transformation.<br/>
              <strong>Zone 1:</strong> Narrative therapy {'\u2014'} helps people heal by articulating their
              emotional story with warmth and empathetic precision.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Safe Space Creation</h4>
            <p>
              <strong>Memory preservation:</strong> Zone 2{'\u2019'}s deep emotional-sensory memory makes them the
              family historian, the keeper of traditions, the one who remembers birthdays, anniversaries,
              and the exact meal that comforted you ten years ago.<br/>
              <strong>Intuitive guidance:</strong> Zone 3{'\u2019'}s psychic-protective imprints allow them to read
              a room instantly{'\u2014'}sensing who is safe and who is not before a single word is spoken.<br/>
              <strong>Family dynamics:</strong> Zone 6{'\u2019'}s warm-celebratory memory transforms family gatherings
              into nurturing rituals that bond generations together.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Emotional Intelligence</h3>
          <p>
            Cancer{'\u2019'}s thinking style is not a weakness to be overcome but a profound emotional
            intelligence system. From the articulate communicator (Zone 1) through the pure empath
            (Zone 2), the fierce protector (Zone 3), the depth alchemist (Zone 4), the universal
            heart (Zone 5), to the joyful nurturer (Zone 6) {'\u2014'} each zone represents a different
            facet of the Moon{'\u2019'}s wisdom.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Cancers to be the same. The Zone 2
            empath is called {'\u201C'}too sensitive.{'\u201D'} The Zone 3 protector is called {'\u201C'}too intense.{'\u201D'}
            The Zone 4 alchemist is called {'\u201C'}too dark.{'\u201D'} The Zone 5 mystic is called {'\u201C'}ungrounded.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Cancer zone reveals HOW you feel, WHY you protect, and WHERE
            your nurturing gifts can transform the world.</strong> When you know someone processes through
            pure emotional memory (Zone 2) vs transformative alchemy (Zone 4), you communicate
            in their language. When you understand that Zone 1{'\u2019'}s verbal gift (80%) and Zone 2{'\u2019'}s
            wordless depth (40% verbal) are equally valid, you stop demanding that all Cancers
            express love the same way.
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

export default CancerThinkingStyleTab;
