import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Scorpio Thinking Style Tab Component
 * Deep dive into cognitive differences across Scorpio zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const ScorpioThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Strategic-Intense Thinking",
      archetype: "The Magnetic Strategist",
      processingSpeed: "Moderate (75 BPM)",
      primaryMode: "Observe \u2192 Strategize \u2192 Control \u2192 Transform",
      thoughtPattern: 'Power assessed \u2192 Strategy formed \u2192 Control established \u2192 Transformation executed',
      decisionMaking: "35% strategic control, 25% intensity, 20% power, 20% transformation",
      decisionSpeed: "Medium (hours of silent calculation)",
      learningStyle: "Strategic pattern absorption",
      memoryType: "Power-dynamic associations",
      abstractionLevel: 70,
      verbalIntelligence: 80,
      metaCognition: 85,
      focus: 90,
      cognitiveFlexibility: 65,
      teachingAbility: 75,
      informationPreference: ["Power dynamics", "Hidden motivations", "Strategic leverage points"],
      communicationStyle: "Magnetically controlled and strategically precise",
      motto: "I transform through strategic power"
    },
    {
      zoneId: 2,
      name: "Pure Obsessive-Transformative Thinking",
      archetype: "The Phoenix",
      processingSpeed: "Slow (70 BPM)",
      primaryMode: "Obsess \u2192 Destroy \u2192 Transform \u2192 Rise",
      thoughtPattern: 'Fixation locks \u2192 Destruction initiated \u2192 Transformation burns \u2192 Rebirth emerges',
      decisionMaking: "45% obsessive depth, 30% total commitment, 15% destruction, 10% rebirth",
      decisionSpeed: "Very slow (waits for absolute certainty)",
      learningStyle: "Obsessive total immersion",
      memoryType: "Deep transformative-archetypal memory",
      abstractionLevel: 75,
      verbalIntelligence: 75,
      metaCognition: 95,
      focus: 100,
      cognitiveFlexibility: 40,
      teachingAbility: 55,
      informationPreference: ["Absolute truths", "Hidden depths", "Transformative catalysts"],
      communicationStyle: "Intense, penetrating, all-or-nothing",
      motto: "I destroy, I transform, I rise"
    },
    {
      zoneId: 3,
      name: "Mystical-Healing Thinking",
      archetype: "The Wounded Healer",
      processingSpeed: "Slow (65 BPM)",
      primaryMode: "Absorb pain \u2192 Transmute \u2192 Heal \u2192 Transcend",
      thoughtPattern: 'Suffering enters \u2192 Wounds recognized \u2192 Compassion transmutes \u2192 Healing radiates',
      decisionMaking: "40% compassionate depth, 25% spiritual insight, 20% healing, 15% transcendence",
      decisionSpeed: "Slow (waits for spiritual clarity)",
      learningStyle: "Empathic absorption and mystical insight",
      memoryType: "Spiritual-wound memory patterns",
      abstractionLevel: 85,
      verbalIntelligence: 75,
      metaCognition: 90,
      focus: 90,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["Healing modalities", "Spiritual truths", "Transformative love"],
      communicationStyle: "Gentle yet penetrating, compassionately intense",
      motto: "I heal through transformative love"
    },
    {
      zoneId: 4,
      name: "Redemptive-Regenerative Thinking",
      archetype: "The Eternal Phoenix",
      processingSpeed: "Very slow (60 BPM)",
      primaryMode: "Surrender \u2192 Die \u2192 Regenerate \u2192 Ascend",
      thoughtPattern: 'Ego surrendered \u2192 Death accepted \u2192 Regeneration begins \u2192 Wisdom crystallizes',
      decisionMaking: "45% surrender to process, 25% regenerative faith, 20% eternal wisdom, 10% acceptance",
      decisionSpeed: "Very slow (waits for complete death-rebirth cycle)",
      learningStyle: "Death-and-rebirth immersion cycles",
      memoryType: "Regenerative-archetypal memory",
      abstractionLevel: 90,
      verbalIntelligence: 70,
      metaCognition: 85,
      focus: 95,
      cognitiveFlexibility: 75,
      teachingAbility: 70,
      informationPreference: ["Cycles of death and rebirth", "Redemptive patterns", "Eternal truths"],
      communicationStyle: "Profound, quietly powerful, regenerative",
      motto: "I die infinitely, I rise eternally"
    },
    {
      zoneId: 5,
      name: "Protective-Warrior Thinking",
      archetype: "The Fierce Guardian",
      processingSpeed: "Moderate (70 BPM)",
      primaryMode: "Detect threat \u2192 Fortify \u2192 Destroy \u2192 Protect",
      thoughtPattern: 'Threat sensed \u2192 Defenses activated \u2192 Enemy eliminated \u2192 Loved ones secured',
      decisionMaking: "50% threat elimination, 25% protection, 15% loyalty, 10% vengeance",
      decisionSpeed: "Instant when threatened (otherwise deliberate)",
      learningStyle: "Threat-based pattern recognition",
      memoryType: "Danger-imprint and loyalty memory",
      abstractionLevel: 60,
      verbalIntelligence: 70,
      metaCognition: 85,
      focus: 100,
      cognitiveFlexibility: 50,
      teachingAbility: 50,
      informationPreference: ["Danger signals", "Loyalty tests", "Protective strategies"],
      communicationStyle: "Fierce, guarded, few but lethal words",
      motto: "I protect fiercely, I destroy threats"
    },
    {
      zoneId: 6,
      name: "Philosophical-Transformative Thinking",
      archetype: "The Dark Sage",
      processingSpeed: "Moderate (75 BPM)",
      primaryMode: "Question \u2192 Explore depths \u2192 Confront truth \u2192 Teach",
      thoughtPattern: 'Truth sought \u2192 Depths explored \u2192 Confrontation embraced \u2192 Wisdom shared',
      decisionMaking: "35% truth-seeking, 25% philosophical depth, 25% fearless confrontation, 15% wisdom",
      decisionSpeed: "Medium (hours of philosophical contemplation)",
      learningStyle: "Fearless philosophical exploration",
      memoryType: "Philosophical-transformative memory",
      abstractionLevel: 80,
      verbalIntelligence: 85,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 75,
      teachingAbility: 85,
      informationPreference: ["Hidden truths", "Philosophical depth", "Fearless exploration"],
      communicationStyle: "Wise, confrontational, fearlessly articulate",
      motto: "I seek truth through fearless transformation"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Scorpio Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you obsess, transform, and penetrate reality
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
            Two Scorpio Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 70 BPM with pure obsessive-transformative immersion, while Zone 4 (15-19{'\u00B0'}) thinks at 60 BPM
            with redemptive-regenerative depth. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through obsessive destruction and rebirth (Zone 2) vs surrendered regeneration (Zone 4), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} The Phoenix vs The Dark Sage</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Phoenix</h6>
                        <ul>
                          <li>{'\u26A1'} 70 BPM - Slow, obsessive processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 75% abstraction - Deep transformative reality</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal - Intense, penetrating words</li>
                          <li>{'\uD83E\uDE9E'} 95% meta-cognition - Extreme self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 100% focus - Absolute obsessive lock</li>
                          <li>{'\uD83E\uDD38'} 40% flexibility - Rigid, all-or-nothing</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I destroy, I transform, I rise.{'\u201D'}
                          Maximum focus with obsessive depth. Processes everything through
                          total destruction and rebirth. The most intensely transformative zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Dark Sage</h6>
                        <ul>
                          <li>{'\u26A1'} 75 BPM - Moderate, philosophical pace</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 80% abstraction - Philosophical truth-seeking</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal - Fearlessly articulate</li>
                          <li>{'\uD83E\uDE9E'} 85% meta-cognition - Wise self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Balanced depth attention</li>
                          <li>{'\uD83E\uDD38'} 75% flexibility - Open to new depths</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I seek truth through fearless transformation.{'\u201D'}
                          The highest verbal intelligence and flexibility in Scorpio. Channels
                          intensity into philosophical wisdom and fearless teaching. The sage teacher.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 destroys and transforms through obsessive focus.
                      Zone 6 seeks truth through philosophical fearlessness.
                      Together they represent Scorpio{'\u2019'}s full transformative spectrum: from destructive rebirth to illuminated wisdom.
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
                        <h6>Zone 1: Libra-Scorpio Cusp</h6>
                        <ul>
                          <li>{'\u2696\uFE0F'} Libra influence adds strategic diplomacy (80 verbal)</li>
                          <li>{'\u26A1'} 75 BPM - Fastest Scorpio thinker</li>
                          <li>{'\uD83D\uDCAD'} Observe {'\u2192'} Strategize {'\u2192'} Control</li>
                          <li>{'\uD83C\uDFAF'} 90% focus - Strategic concentration</li>
                          <li>{'\uD83D\uDCCA'} Power dynamics drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water enriched by Air. Can STRATEGIZE with
                          diplomatic precision that other Scorpio zones channel as raw intensity.
                          The magnetic controller who bridges power and charm with calculated grace.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Scorpio-Sagittarius Cusp</h6>
                        <ul>
                          <li>{'\uD83C\uDFF9'} Sagittarius influence adds philosophy, adventure, truth-seeking</li>
                          <li>{'\u26A1'} 75 BPM - Expanded by fire energy</li>
                          <li>{'\uD83D\uDCAD'} Question {'\u2192'} Explore {'\u2192'} Confront {'\u2192'} Teach</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Philosophical concentration</li>
                          <li>{'\uD83D\uDCCA'} Truth and wisdom drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water expanded by Fire. Can TEACH and share
                          transformative insights rather than hoarding them secretly. The dark sage who
                          transforms Scorpio{'\u2019'}s depth into universal philosophical wisdom.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges intensity and strategy (Libra cusp).
                      Zone 6 bridges depth and philosophy (Sagittarius cusp). Both are more expressive than
                      pure Scorpio, but in different ways: strategic charm vs philosophical wisdom. Zone 6 teaching ability (85)
                      is the highest in the Scorpio spectrum precisely because Sagittarius cusp energy adds
                      the desire to share truth, while Zone 1 teaching ability (75) benefits from Libra{'\u2019'}s
                      diplomatic communication.
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
                        <h6>Zone 2: Pluto/Pluto (1st Decan)</h6>
                        <p><strong>Pure Scorpio - The Phoenix</strong></p>
                        <ul>
                          <li>{'\uD83E\uDD82'} 100% Pluto influence</li>
                          <li>{'\uD83D\uDD25'} Destroy first, rise later</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal (intense)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (total obsessive lock)</li>
                          <li>{'\uD83D\uDCDA'} Obsessive total immersion</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Pluto/Neptune (2nd Decan)</h6>
                        <p><strong>Scorpio + Pisces - Eternal Phoenix</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF0A'} Neptune adds redemption + surrender</li>
                          <li>{'\uD83D\uDD4A\uFE0F'} Surrender then regenerate</li>
                          <li>{'\uD83D\uDCAC'} 70% verbal (profound)</li>
                          <li>{'\uD83C\uDFAF'} 95% focus (regenerative depth)</li>
                          <li>{'\uD83D\uDCDA'} Death-rebirth immersion cycles</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Pluto/Moon (3rd Decan)</h6>
                        <p><strong>Scorpio + Sagittarius Cusp - Dark Sage</strong></p>
                        <ul>
                          <li>{'\uD83C\uDFF9'} Jupiter/Moon adds wisdom + teaching</li>
                          <li>{'\uD83C\uDFAF'} Confront then teach</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (fearlessly articulate)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (balanced philosophical)</li>
                          <li>{'\uD83D\uDCDA'} Fearless philosophical exploration</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Scorpio from pure
                      obsessive destruction (Zone 2) through surrendered regeneration (Zone 4) to philosophical wisdom (Zone 6).
                      It{'\u2019'}s a progression from raw transformative power to illuminated teaching mastery. Meta-cognition peaks at
                      Zone 2 (95%) where Pluto{'\u2019'}s pure obsessive power demands extreme self-awareness, while
                      verbal intelligence rises steadily (75% {'\u2192'} 70% {'\u2192'} 85%) as Scorpio learns to
                      articulate the truths it discovers in the depths.
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
                              style.zoneId === 1 ? "Teaches through strategic manipulation of power dynamics \u2014 \"Let me show you how the game really works\"" :
                              style.zoneId === 2 ? "Teaches through transformative crisis \u2014 \"You must die to be reborn; I'll show you how\"" :
                              style.zoneId === 3 ? "Teaches through compassionate healing \u2014 \"Your wounds are your greatest teachers\"" :
                              style.zoneId === 4 ? "Teaches through regenerative wisdom \u2014 \"Surrender to the death; rebirth is waiting\"" :
                              style.zoneId === 5 ? "Teaches through fierce protection \u2014 \"Watch how I destroy what threatens us\"" :
                              "Teaches through fearless philosophical confrontation \u2014 \"Let me show you the truth you're afraid to see\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Reveals hidden power structures so students understand strategic influence and magnetic control" :
                              style.zoneId === 2 ? "Catalyzes total transformation in others through intense personal crisis and rebirth guidance" :
                              style.zoneId === 3 ? "Channels deep wound wisdom to guide others through their darkest healing journeys" :
                              style.zoneId === 4 ? "Demonstrates the death-rebirth cycle so others learn that destruction precedes regeneration" :
                              style.zoneId === 5 ? "Models fierce protective loyalty so others learn the power of unwavering guardianship" :
                              "Confronts students with fearless truths that catalyze philosophical awakening and deep transformation"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 6 (85% teaching) is Scorpio{'\u2019'}s best teacher
                    because Sagittarius cusp energy adds philosophical articulation to transformative depth. Zone 5 (50% teaching)
                    teaches least verbally{'\u2014'}it protects by fierce action, not explanation. Zone 3 (80% teaching)
                    teaches through compassionate healing, making transformation feel like love. The pattern:
                    Scorpio teaches by TRANSFORMING you, not by EXPLAINING to you.
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
            <h4>{'\uD83D\uDD25'} Strategists & Destroyers</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Magnetic strategists to pure obsessive transformers</p>
              <ul>
                <li><strong>Hillary Clinton:</strong> Zone 1 {'\u2014'} the Magnetic Strategist who navigates power with calculated precision, controls narratives through strategic intensity, masters the long game of political transformation</li>
                <li><strong>Leonardo DiCaprio:</strong> Zone 2 {'\u2014'} the Phoenix who obsessively transforms into every character, destroys his own identity to become someone new, rises from each role utterly changed</li>
              </ul>
              <p className="example-note">
                Why different zones? Hillary Clinton strategizes with magnetic control (Zone 1 verbal intelligence 80%, focus 90%).
                DiCaprio obsessively destroys and rebuilds himself through art (Zone 2 focus 100%, meta-cognition 95%).
                Both Scorpio water, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2728'} Healers & Regenerators</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Wounded healers to eternal phoenixes</p>
              <ul>
                <li><strong>Marie Curie:</strong> Zone 3 {'\u2014'} the Wounded Healer who transformed personal sacrifice into healing science, gave her body to radiation so humanity could be healed, mystical devotion to transformative love through discovery</li>
                <li><strong>Theodore Roosevelt:</strong> Zone 4 {'\u2014'} the Eternal Phoenix who died as a sickly child and regenerated into the most vital president, surrendered to destruction repeatedly and rose each time stronger and wiser</li>
              </ul>
              <p className="example-note">
                Zone 3 = healing through transformative compassion and sacrifice. Zone 4 = infinite death and
                regeneration into wisdom. Marie Curie healed through love of science (Zone 3 abstraction 85%). Theodore Roosevelt
                regenerated endlessly (Zone 4 focus 95%, abstraction 90%). Both Scorpio depth, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDEE1\uFE0F'} Guardians & Sages</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Fierce guardians to dark sages</p>
              <ul>
                <li><strong>General George Patton:</strong> Zone 5 {'\u2014'} the Fierce Guardian who destroyed threats without mercy, paranoid protection of his troops, absolute focus on eliminating danger before it materialized</li>
                <li><strong>Carl Sagan:</strong> Zone 6 {'\u2014'} the Dark Sage who fearlessly explored the cosmos, sought truth through confrontation with the unknown, taught millions to see the universe through philosophical transformation</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the outer-directed Scorpio. Patton destroyed threats with warrior focus
                (Zone 5 focus 100%, flexibility 50%). Carl Sagan fearlessly explored truth
                (Zone 6 verbal 85%, teaching 85%). Both prove Scorpio can protect and illuminate the world,
                not just transform the self.
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
            <h4>{'\uD83E\uDD1D'} Depth Psychology & Investigation</h4>
            <p>
              <strong>Zone 1:</strong> Excels at strategic interrogation {'\u2014'} reads power dynamics with magnetic precision,
              extracting hidden truths through calculated intensity. Verbal intelligence (80%) makes them natural detectives.<br/>
              <strong>Zone 2:</strong> Excels at obsessive investigation {'\u2014'} will not rest until every layer is exposed,
              total immersion in pursuit of absolute truth. Focus (100%) creates an inescapable analytical lens.<br/>
              <strong>Zone 4:</strong> Excels at redemptive counseling {'\u2014'} guides others through death-rebirth cycles,
              transformation therapy. Abstraction (90%) allows insight into the deepest archetypal patterns.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDEE1\uFE0F'} Crisis Management & Protection</h4>
            <p>
              <strong>Zone 5:</strong> The ultimate crisis protector {'\u2014'} detects threats before they materialize,
              eliminates danger with surgical precision, fortifies defenses obsessively. Don{'\u2019'}t ask them to explain; they DESTROY threats.<br/>
              <strong>Zone 3:</strong> The healing crisis manager {'\u2014'} transforms wounds into wisdom during emergencies,
              channels compassion under extreme pressure.<br/>
              <strong>Zone 1:</strong> The strategic crisis controller {'\u2014'} manages power dynamics during chaos,
              maintains magnetic composure when others panic.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF3F'} Transformative Healing</h4>
            <p>
              <strong>Zone 3:</strong> Depth psychology and trauma healing {'\u2014'} the wounded healer channels personal
              suffering into transformative compassion that dissolves others{'\u2019'} pain.<br/>
              <strong>Zone 4:</strong> Regenerative therapy {'\u2014'} guides clients through symbolic death experiences,
              facilitating profound rebirth and psychological regeneration.<br/>
              <strong>Zone 6:</strong> Philosophical therapy {'\u2014'} helps people confront fearless truths about
              their existence with wisdom and transformative philosophical depth.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Research & Discovery</h4>
            <p>
              <strong>Obsessive investigation:</strong> Zone 2{'\u2019'}s deep transformative-archetypal memory makes them the
              ultimate researcher, the one who will not stop until the absolute truth is uncovered,
              obsessively pursuing every lead until nothing remains hidden.<br/>
              <strong>Strategic intelligence:</strong> Zone 1{'\u2019'}s power-dynamic associations allow them to read
              any situation instantly{'\u2014'}sensing who holds real power and what hidden motivations drive every player.<br/>
              <strong>Philosophical synthesis:</strong> Zone 6{'\u2019'}s philosophical-transformative memory connects
              disparate findings into fearless wisdom that transforms entire fields of knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Transformative Intelligence</h3>
          <p>
            Scorpio{'\u2019'}s thinking style is not an intensity to be feared but a profound transformative
            intelligence system. From the magnetic strategist (Zone 1) through the obsessive phoenix
            (Zone 2), the wounded healer (Zone 3), the eternal phoenix (Zone 4), the fierce
            guardian (Zone 5), to the dark sage (Zone 6) {'\u2014'} each zone represents a different
            facet of Pluto{'\u2019'}s and Mars{'\u2019'} combined wisdom.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Scorpios to be the same. The Zone 2
            phoenix is called {'\u201C'}too obsessive.{'\u201D'} The Zone 3 healer is called {'\u201C'}too intense.{'\u201D'}
            The Zone 4 regenerator is called {'\u201C'}too dark.{'\u201D'} The Zone 5 guardian is called {'\u201C'}too paranoid.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Scorpio zone reveals HOW you transform, WHY you obsess, and WHERE
            your depth gifts can heal the world.</strong> When you know someone processes through
            pure obsessive destruction (Zone 2) vs surrendered regeneration (Zone 4), you communicate
            in their language. When you understand that Zone 6{'\u2019'}s philosophical wisdom (85% verbal) and Zone 2{'\u2019'}s
            obsessive depth (100% focus, 40% flexibility) are equally valid, you stop demanding that all Scorpios
            express power the same way.
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

export default ScorpioThinkingStyleTab;
