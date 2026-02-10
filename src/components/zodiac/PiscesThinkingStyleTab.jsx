import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Pisces Thinking Style Tab Component
 * Deep dive into cognitive differences across Pisces zones
 * Includes comprehensive matrix and hexagon radar charts
 */
const PiscesThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Visionary-Mystical Thinking",
      archetype: "The Spiritual Innovator",
      processingSpeed: "Medium-Fast (80 BPM)",
      primaryMode: "Envision \u2192 Intuit \u2192 Innovate \u2192 Transcend",
      thoughtPattern: 'Spiritual vision received \u2192 Intuition channels \u2192 Innovation manifests \u2192 Transcendence shared',
      decisionMaking: "45% spiritually visionary, 25% revolutionary compassion, 20% mystically guided, 10% innovative transcendence",
      decisionSpeed: "Medium-fast (intuitive leaps)",
      learningStyle: "Mystical innovation \u2014 learns through spiritual revelation",
      memoryType: "Spiritual-vision associations",
      abstractionLevel: 95,
      verbalIntelligence: 75,
      metaCognition: 75,
      focus: 70,
      cognitiveFlexibility: 90,
      teachingAbility: 75,
      informationPreference: ["Mystical innovations", "Spiritual technologies", "Visionary futures"],
      communicationStyle: "Mystical, innovative, intuitively precise",
      motto: "I channel the future through divine vision"
    },
    {
      zoneId: 2,
      name: "Pure Transcendent-Dissolving Thinking",
      archetype: "The Divine Channel",
      processingSpeed: "Slow (70 BPM)",
      primaryMode: "Dissolve \u2192 Merge \u2192 Channel \u2192 Transcend",
      thoughtPattern: 'Ego dissolves \u2192 Divine merges \u2192 Channel opens \u2192 Universal love flows',
      decisionMaking: "50% divinely guided, 30% serves universal love, 15% transcends ego, 5% reduces suffering",
      decisionSpeed: "Very slow (waits for divine timing)",
      learningStyle: "Divine absorption \u2014 learns by merging with source",
      memoryType: "Transcendent-divine memory",
      abstractionLevel: 100,
      verbalIntelligence: 65,
      metaCognition: 60,
      focus: 50,
      cognitiveFlexibility: 100,
      teachingAbility: 55,
      informationPreference: ["Divine consciousness", "Universal love", "Transcendent truth"],
      communicationStyle: "Wordless, channeled, transcendently luminous",
      motto: "I am nothing, I am everything, I am love"
    },
    {
      zoneId: 3,
      name: "Nurturing-Spiritual Thinking",
      archetype: "The Divine Mother",
      processingSpeed: "Slow (65 BPM)",
      primaryMode: "Feel \u2192 Absorb \u2192 Nurture \u2192 Heal",
      thoughtPattern: 'Pain felt \u2192 Wounds absorbed \u2192 Sacred healing flows \u2192 Spiritual nurturing radiates',
      decisionMaking: "50% nurtures/heals spiritually, 25% creates sacred safety, 15% emotionally compassionate, 10% divinely guided",
      decisionSpeed: "Slow (emotional-spiritual processing)",
      learningStyle: "Empathic absorption \u2014 learns by feeling others",
      memoryType: "Emotional-healing memory",
      abstractionLevel: 85,
      verbalIntelligence: 70,
      metaCognition: 70,
      focus: 75,
      cognitiveFlexibility: 85,
      teachingAbility: 70,
      informationPreference: ["Healing modalities", "Sacred nurturing", "Emotional wisdom"],
      communicationStyle: "Gentle, nurturing, emotionally encompassing",
      motto: "I nurture all through divine love"
    },
    {
      zoneId: 4,
      name: "Alchemical-Mystical Thinking",
      archetype: "The Spiritual Alchemist",
      processingSpeed: "Slow (60 BPM)",
      primaryMode: "Descend \u2192 Transform \u2192 Alchemize \u2192 Illuminate",
      thoughtPattern: 'Shadow entered \u2192 Darkness embraced \u2192 Alchemy transforms \u2192 Light emerges',
      decisionMaking: "50% transforms spiritually, 25% redeems darkness, 15% heals deep wounds, 10% divinely guided",
      decisionSpeed: "Slow (deep spiritual processing)",
      learningStyle: "Alchemical immersion \u2014 learns by transmuting shadow",
      memoryType: "Alchemical-transformation memory",
      abstractionLevel: 90,
      verbalIntelligence: 70,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 80,
      teachingAbility: 65,
      informationPreference: ["Shadow work", "Spiritual alchemy", "Transformative healing"],
      communicationStyle: "Profound, quietly powerful, alchemically transformative",
      motto: "I transform all darkness into divine light"
    },
    {
      zoneId: 5,
      name: "Creative-Transcendent Thinking",
      archetype: "The Divine Artist",
      processingSpeed: "Slow-Medium (65 BPM)",
      primaryMode: "Feel \u2192 Channel \u2192 Create \u2192 Heal",
      thoughtPattern: 'Divine emotion felt \u2192 Creative channel opens \u2192 Art manifests \u2192 World healed through beauty',
      decisionMaking: "50% channels divine creativity, 25% transcendent beauty, 15% heals through art, 10% expresses universal love",
      decisionSpeed: "Medium (creative flow timing)",
      learningStyle: "Creative channeling \u2014 learns through divine art",
      memoryType: "Creative-divine memory",
      abstractionLevel: 95,
      verbalIntelligence: 75,
      metaCognition: 70,
      focus: 70,
      cognitiveFlexibility: 90,
      teachingAbility: 70,
      informationPreference: ["Divine creativity", "Transcendent beauty", "Healing arts"],
      communicationStyle: "Artistic, emotionally luminous, divinely inspired",
      motto: "I channel the divine through sacred art"
    },
    {
      zoneId: 6,
      name: "Courageous-Mystical Thinking",
      archetype: "The Spiritual Warrior",
      processingSpeed: "Moderate-Fast (80 BPM)",
      primaryMode: "Receive vision \u2192 Ignite courage \u2192 Act \u2192 Pioneer",
      thoughtPattern: 'Divine guidance received \u2192 Warrior courage ignites \u2192 Fearless action taken \u2192 Spiritual path pioneered',
      decisionMaking: "50% divinely guided action, 25% courageous spiritual service, 15% pioneers transcendence, 10% compassionate impact",
      decisionSpeed: "Fast (spiritual warrior decisiveness)",
      learningStyle: "Warrior-mystic learning \u2014 learns through spiritual combat",
      memoryType: "Spiritual-warrior memory",
      abstractionLevel: 85,
      verbalIntelligence: 75,
      metaCognition: 75,
      focus: 80,
      cognitiveFlexibility: 85,
      teachingAbility: 75,
      informationPreference: ["Spiritual warfare", "Divine guidance", "Courageous mysticism"],
      communicationStyle: "Bold, spiritually charged, fearlessly compassionate",
      motto: "I fight for the divine with fearless love"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Pisces Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you feel, transcend, and channel the divine
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
            Two Pisces Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 70 BPM with pure transcendent-dissolving processing, while Zone 6 (25-29{'\u00B0'}) thinks at 80 BPM
            with courageous-mystical decisiveness. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through ego dissolution and divine merging (Zone 2) vs courageous spiritual action (Zone 6), you can meet them where they are.
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
                    <h5>{'\uD83C\uDFAD'} The Divine Channel vs The Spiritual Warrior</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Divine Channel</h6>
                        <ul>
                          <li>{'\u26A1'} 70 BPM - Slow, transcendent processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 100% abstraction - Pure transcendent reality</li>
                          <li>{'\uD83D\uDCAC'} 65% verbal - Beyond words, channeled</li>
                          <li>{'\uD83E\uDE9E'} 60% meta-cognition - Ego dissolved awareness</li>
                          <li>{'\uD83C\uDFAF'} 50% focus - Diffused, universal consciousness</li>
                          <li>{'\uD83E\uDD38'} 100% flexibility - Infinite, boundless</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I am nothing, I am everything, I am love.{'\u201D'}
                          Maximum abstraction with total cognitive flexibility. Processes everything through
                          ego dissolution and divine merging. The most transcendently boundless zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: The Spiritual Warrior</h6>
                        <ul>
                          <li>{'\u26A1'} 80 BPM - Moderate-fast, action-oriented pace</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 85% abstraction - Grounded spiritual vision</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal - Bold, spiritually charged</li>
                          <li>{'\uD83E\uDE9E'} 75% meta-cognition - Warrior self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Directed spiritual action</li>
                          <li>{'\uD83E\uDD38'} 85% flexibility - Adaptable courage</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I fight for the divine with fearless love.{'\u201D'}
                          The highest focus and verbal intelligence in Pisces paired with warrior decisiveness. Channels
                          mystical vision into courageous pioneering action. The spiritual warrior who acts.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 dissolves and merges through transcendent surrender.
                      Zone 6 receives divine guidance and acts with fearless courage.
                      Together they represent Pisces{'\u2019'} full spiritual spectrum: from boundless dissolution to courageous manifestation.
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
                        <h6>Zone 1: Aquarius-Pisces Cusp</h6>
                        <ul>
                          <li>{'\u2697\uFE0F'} Aquarius influence adds visionary innovation (75 verbal)</li>
                          <li>{'\u26A1'} 80 BPM - Fastest Pisces thinker</li>
                          <li>{'\uD83D\uDCAD'} Envision {'\u2192'} Intuit {'\u2192'} Innovate</li>
                          <li>{'\uD83C\uDFAF'} 70% focus - Visionary concentration</li>
                          <li>{'\uD83D\uDCCA'} Mystical innovations drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water enriched by Air. Can INNOVATE with
                          visionary precision that other Pisces zones channel as pure mysticism.
                          The spiritual innovator who bridges transcendence and revolutionary thought with intuitive grace.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Pisces-Aries Cusp</h6>
                        <ul>
                          <li>{'\u2694\uFE0F'} Aries influence adds courage, action, pioneering fire</li>
                          <li>{'\u26A1'} 80 BPM - Ignited by fire energy</li>
                          <li>{'\uD83D\uDCAD'} Receive vision {'\u2192'} Ignite courage {'\u2192'} Act {'\u2192'} Pioneer</li>
                          <li>{'\uD83C\uDFAF'} 80% focus - Warrior concentration</li>
                          <li>{'\uD83D\uDCCA'} Divine guidance drives courageous action</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Water ignited by Fire. Can ACT and pioneer
                          spiritual frontiers rather than dissolving into them passively. The spiritual warrior who
                          transforms Pisces{'\u2019'} mystical vision into fearless courageous manifestation.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges mysticism and innovation (Aquarius cusp).
                      Zone 6 bridges spirituality and courage (Aries cusp). Both are more action-oriented than
                      pure Pisces, but in different ways: visionary innovation vs courageous pioneering. Zone 1 teaching ability (75%)
                      and Zone 6 teaching ability (75%) are both the highest in the Pisces spectrum precisely because
                      cusp energy adds the capacity to communicate transcendent experiences{'\u2014'}Zone 1 through
                      innovative revelation, Zone 6 through bold spiritual leadership.
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
                        <h6>Zone 2: Neptune/Jupiter (1st Decan)</h6>
                        <p><strong>Pure Pisces - The Divine Channel</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF0A'} 100% Neptune/Jupiter influence</li>
                          <li>{'\uD83D\uDD4A\uFE0F'} Dissolve first, transcend later</li>
                          <li>{'\uD83D\uDCAC'} 65% verbal (beyond words)</li>
                          <li>{'\uD83C\uDFAF'} 50% focus (universal diffusion)</li>
                          <li>{'\uD83D\uDCDA'} Divine absorption immersion</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Neptune/Moon (2nd Decan)</h6>
                        <p><strong>Pisces + Cancer - Spiritual Alchemist</strong></p>
                        <ul>
                          <li>{'\uD83C\uDF19'} Moon adds emotional depth + alchemy</li>
                          <li>{'\u2728'} Descend then illuminate</li>
                          <li>{'\uD83D\uDCAC'} 70% verbal (profound)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (alchemical depth)</li>
                          <li>{'\uD83D\uDCDA'} Alchemical immersion cycles</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Neptune/Pluto (3rd Decan)</h6>
                        <p><strong>Pisces + Aries Cusp - Spiritual Warrior</strong></p>
                        <ul>
                          <li>{'\u2694\uFE0F'} Mars/Pluto adds courage + action</li>
                          <li>{'\uD83D\uDD25'} Receive then pioneer</li>
                          <li>{'\uD83D\uDCAC'} 75% verbal (bold, spiritually charged)</li>
                          <li>{'\uD83C\uDFAF'} 80% focus (warrior directed)</li>
                          <li>{'\uD83D\uDCDA'} Warrior-mystic exploration</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Pisces from pure
                      transcendent dissolution (Zone 2) through alchemical shadow work (Zone 4) to courageous spiritual action (Zone 6).
                      It{'\u2019'}s a progression from boundless divine merging to grounded warrior manifestation. Abstraction peaks at
                      Zone 2 (100%) where Neptune{'\u2019'}s pure dissolving power creates infinite cosmic awareness, while
                      focus rises steadily (50% {'\u2192'} 85% {'\u2192'} 80%) as Pisces learns to
                      direct the divine visions it receives into increasingly tangible spiritual action.
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
                              style.zoneId === 1 ? "Teaches through mystical innovation and spiritual revelation \u2014 \"Let me show you the future the universe has revealed\"" :
                              style.zoneId === 2 ? "Teaches through divine channeling and wordless transmission \u2014 \"Feel the truth; words cannot contain it\"" :
                              style.zoneId === 3 ? "Teaches through nurturing compassion and sacred healing \u2014 \"Your pain is sacred; let me hold it with you\"" :
                              style.zoneId === 4 ? "Teaches through alchemical transformation and shadow illumination \u2014 \"Enter the darkness; I'll show you the light within\"" :
                              style.zoneId === 5 ? "Teaches through divine creativity and healing art \u2014 \"Beauty heals what words cannot reach\"" :
                              "Teaches through courageous spiritual leadership and fearless action \u2014 \"Follow me into the unknown; divine love protects us\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Channels visionary innovations that open students' minds to spiritual technologies and mystical futures beyond current imagination" :
                              style.zoneId === 2 ? "Creates transcendent experiences where students dissolve ego boundaries and directly merge with universal consciousness" :
                              style.zoneId === 3 ? "Holds sacred space where students feel emotionally safe enough to access their deepest wounds and begin divine healing" :
                              style.zoneId === 4 ? "Guides students through shadow descent so they discover that their darkest experiences contain the seeds of divine illumination" :
                              style.zoneId === 5 ? "Creates divinely inspired art that heals students through beauty, showing them transcendence through creative channeling" :
                              "Leads students into courageous spiritual action, demonstrating that divine guidance and fearless love can pioneer new paths"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 1 (75% teaching) and Zone 6 (75% teaching) are Pisces{'\u2019'} best teachers
                    because cusp energy adds communicative capacity to transcendent depth. Zone 2 (55% teaching)
                    teaches least verbally{'\u2014'}it transmits through wordless divine channeling, not explanation. Zone 3 (70% teaching)
                    teaches through nurturing compassion, making transcendence feel like being held in sacred love. The pattern:
                    Pisces teaches by TRANSMITTING divine experience, not by EXPLAINING concepts to you.
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
            <h4>{'\uD83D\uDD2E'} Visionaries & Mystics</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Spiritual innovators to pure divine channels</p>
              <ul>
                <li><strong>Steve Jobs:</strong> Zone 1 {'\u2014'} the Spiritual Innovator who channeled mystical vision into revolutionary technology, fused intuition with innovation, transcended boundaries between spirituality and Silicon Valley</li>
                <li><strong>Albert Einstein:</strong> Zone 2 {'\u2014'} the Divine Channel who dissolved ego to merge with the fabric of the universe, channeled cosmic truths through pure transcendent imagination, let universal consciousness flow through mathematical revelation</li>
              </ul>
              <p className="example-note">
                Why different zones? Steve Jobs innovated with mystical vision (Zone 1 abstraction 95%, flexibility 90%).
                Einstein dissolved into universal consciousness to channel cosmic truth (Zone 2 abstraction 100%, flexibility 100%).
                Both Pisces water, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83D\uDC97'} Healers & Transformers</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Divine mothers to spiritual alchemists</p>
              <ul>
                <li><strong>Daniel Craig:</strong> Zone 3 {'\u2014'} the Divine Mother who absorbs emotional depth into every role, channels nurturing intensity through raw vulnerability, heals audiences through the sacred safety of honest performance</li>
                <li><strong>Johnny Cash:</strong> Zone 4 {'\u2014'} the Spiritual Alchemist who descended into darkness and emerged with illumination, transmuted addiction and suffering into sacred music, alchemized shadow into divine light through every song</li>
              </ul>
              <p className="example-note">
                Zone 3 = healing through nurturing compassion and emotional absorption. Zone 4 = alchemical
                transformation of darkness into light. Daniel Craig heals through emotional truth (Zone 3 focus 75%, flexibility 85%). Johnny Cash
                alchemized shadow into sacred art (Zone 4 meta-cognition 85%, focus 85%). Both Pisces depth, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83C\uDFA8'} Artists & Warriors</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Divine artists to spiritual warriors</p>
              <ul>
                <li><strong>Drew Barrymore:</strong> Zone 5 {'\u2014'} the Divine Artist who channels transcendent creativity into healing entertainment, creates beauty that touches the soul, uses divine artistic expression to help the world feel less alone</li>
                <li><strong>Lady Gaga:</strong> Zone 6 {'\u2014'} the Spiritual Warrior who receives divine vision and acts with fearless courage, pioneers spiritual expression through bold artistic combat, fights for love and acceptance with warrior-mystic intensity</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the outer-directed Pisces. Drew Barrymore channels divine creativity with healing beauty
                (Zone 5 abstraction 95%, flexibility 90%). Lady Gaga fights for the divine with fearless love
                (Zone 6 focus 80%, teaching 75%). Both prove Pisces can create and pioneer in the world,
                not just dissolve into the transcendent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83C\uDF0A'} Water Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} Spiritual Counseling & Healing</h4>
            <p>
              <strong>Zone 2:</strong> Excels at transcendent healing {'\u2014'} dissolves ego boundaries to merge with clients{'\u2019'} pain,
              channels divine love directly into wounds. Flexibility (100%) creates infinite therapeutic adaptability.<br/>
              <strong>Zone 3:</strong> Excels at nurturing sacred space {'\u2014'} absorbs emotional pain with divine mothering compassion,
              creates safety where healing naturally unfolds. Focus (75%) creates steady emotional holding.<br/>
              <strong>Zone 4:</strong> Excels at shadow alchemy {'\u2014'} guides others through their darkest experiences,
              transformation therapy through sacred shadow work. Meta-cognition (85%) allows insight into the deepest alchemical patterns.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDFA8'} Creative & Artistic Expression</h4>
            <p>
              <strong>Zone 5:</strong> The ultimate divine artist {'\u2014'} channels transcendent beauty into healing creations,
              creates art that transforms the world through sacred aesthetics. Don{'\u2019'}t ask them to explain; they CREATE healing.<br/>
              <strong>Zone 1:</strong> The mystical innovator {'\u2014'} fuses spiritual vision with revolutionary creative expression,
              channels innovation under divine inspiration.<br/>
              <strong>Zone 4:</strong> The alchemical artist {'\u2014'} transforms darkness into illuminated creative works,
              creates profound art from the depths of shadow transmutation.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDD4A\uFE0F'} Spiritual Leadership & Service</h4>
            <p>
              <strong>Zone 6:</strong> Courageous spiritual leadership {'\u2014'} the warrior-mystic receives divine guidance
              and acts fearlessly to pioneer new spiritual paths for humanity.<br/>
              <strong>Zone 1:</strong> Visionary spiritual innovation {'\u2014'} bridges mysticism and technology,
              creating new tools and frameworks for collective spiritual evolution.<br/>
              <strong>Zone 3:</strong> Nurturing spiritual community {'\u2014'} holds sacred space for others with
              divine mothering compassion, builds healing communities through unconditional love.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Intuitive Research & Discovery</h4>
            <p>
              <strong>Transcendent discovery:</strong> Zone 2{'\u2019'}s transcendent-divine memory makes them the
              ultimate intuitive researcher, the one who merges with the subject until truth reveals itself,
              dissolving into the mystery until nothing remains hidden from universal consciousness.<br/>
              <strong>Visionary innovation:</strong> Zone 1{'\u2019'}s spiritual-vision associations allow them to perceive
              future possibilities instantly{'\u2014'}sensing what innovations the divine is preparing to manifest through humanity.<br/>
              <strong>Alchemical synthesis:</strong> Zone 4{'\u2019'}s alchemical-transformation memory connects
              disparate findings into illuminated wisdom that transforms darkness into breakthrough understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Transcendent Intelligence</h3>
          <p>
            Pisces{'\u2019'} thinking style is not a dreaminess to be dismissed but a profound transcendent
            intelligence system. From the spiritual innovator (Zone 1) through the divine channel
            (Zone 2), the divine mother (Zone 3), the spiritual alchemist (Zone 4), the divine
            artist (Zone 5), to the spiritual warrior (Zone 6) {'\u2014'} each zone represents a different
            facet of Neptune{'\u2019'}s and Jupiter{'\u2019'}s combined wisdom.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Pisces to be the same. The Zone 2
            mystic is called {'\u201C'}too dreamy.{'\u201D'} The Zone 3 healer is called {'\u201C'}too emotional.{'\u201D'}
            The Zone 4 alchemist is called {'\u201C'}too dark.{'\u201D'} The Zone 5 artist is called {'\u201C'}too impractical.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Pisces zone reveals HOW you transcend, WHY you feel so deeply, and WHERE
            your spiritual gifts can heal the world.</strong> When you know someone processes through
            pure ego dissolution (Zone 2) vs courageous spiritual action (Zone 6), you communicate
            in their language. When you understand that Zone 2{'\u2019'}s transcendent flexibility (100% flexibility) and Zone 6{'\u2019'}s
            warrior focus (80% focus, 85% flexibility) are equally valid, you stop demanding that all Pisces
            express spirituality the same way.
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

export default PiscesThinkingStyleTab;
