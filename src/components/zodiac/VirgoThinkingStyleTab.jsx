import React, { useState } from 'react';
import './ThinkingStyleTab.css';

/**
 * Virgo Thinking Style Tab Component
 * Deep dive into cognitive differences across Virgo zones
 * Earth Sign, Mutable Modality, Mercury-Ruled
 * "I ANALYZE" / "I SERVE"
 * Includes comprehensive matrix and hexagon radar charts
 */
const VirgoThinkingStyleTab = ({ userDegree = null, zones }) => {
  const [expandedFlap, setExpandedFlap] = useState(null);
  const [selectedZonesForRadar, setSelectedZonesForRadar] = useState([2, 4, 5]); // Default comparison

  // Comprehensive thinking style data for all zones
  const thinkingStyles = [
    {
      zoneId: 1,
      name: "Confident-Analytical Thinking",
      archetype: "The Proud Perfectionist",
      processingSpeed: "Fast (85 BPM)",
      primaryMode: "Analyze \u2192 Perfect \u2192 Create \u2192 Showcase",
      thoughtPattern: 'Observation sharpens \u2192 Craft refined \u2192 Standards exceeded \u2192 Excellence displayed',
      decisionMaking: "40% perfection, 25% skill showcase, 15% service, 12% appreciation, 8% practical",
      decisionSpeed: "Medium (analyzes with confidence)",
      learningStyle: "Hands-on mastery with confident demonstration",
      memoryType: "Skill-based performance memory",
      abstractionLevel: 55,
      verbalIntelligence: 85,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 60,
      teachingAbility: 75,
      informationPreference: ["Quality benchmarks", "Skill demonstrations", "Detailed craft techniques"],
      communicationStyle: "Articulate, confident, precision-oriented",
      motto: "I perfect my craft with pride"
    },
    {
      zoneId: 2,
      name: "Pure Analytical-Systematic Thinking",
      archetype: "The Master Optimizer",
      processingSpeed: "Very Fast (95 BPM)",
      primaryMode: "Analyze \u2192 Optimize \u2192 Perfect \u2192 Serve",
      thoughtPattern: 'Data absorbed \u2192 Patterns identified \u2192 Systems optimized \u2192 Perfection achieved',
      decisionMaking: "45% optimal perfection, 25% problem-solving, 15% helping, 15% standards",
      decisionSpeed: "Medium-fast (rapid analysis, then action)",
      learningStyle: "Systematic deconstruction and reassembly",
      memoryType: "Procedural-analytical memory",
      abstractionLevel: 60,
      verbalIntelligence: 90,
      metaCognition: 95,
      focus: 100,
      cognitiveFlexibility: 50,
      teachingAbility: 70,
      informationPreference: ["Data-driven analysis", "Systematic frameworks", "Optimization metrics"],
      communicationStyle: "Precise, methodical, detail-oriented",
      motto: "I analyze, I optimize, I perfect"
    },
    {
      zoneId: 3,
      name: "Disciplined-Service Thinking",
      archetype: "The Responsible Helper",
      processingSpeed: "Moderate (80 BPM)",
      primaryMode: "Assess duty \u2192 Plan structure \u2192 Execute \u2192 Serve",
      thoughtPattern: 'Responsibility identified \u2192 Structure planned \u2192 Discipline applied \u2192 Service delivered',
      decisionMaking: "40% responsibility, 25% mastery building, 20% lasting value, 15% standards",
      decisionSpeed: "Medium-slow (thorough deliberation)",
      learningStyle: "Structured progression through disciplined practice",
      memoryType: "Duty-structured procedural memory",
      abstractionLevel: 65,
      verbalIntelligence: 85,
      metaCognition: 85,
      focus: 95,
      cognitiveFlexibility: 55,
      teachingAbility: 80,
      informationPreference: ["Structured curricula", "Proven methodologies", "Long-term mastery paths"],
      communicationStyle: "Measured, responsible, authoritative",
      motto: "I serve with disciplined excellence"
    },
    {
      zoneId: 4,
      name: "Systematic-Mastery Thinking",
      archetype: "The Efficiency Master",
      processingSpeed: "Fast (90 BPM)",
      primaryMode: "Systematize \u2192 Optimize \u2192 Master \u2192 Build",
      thoughtPattern: 'Systems mapped \u2192 Efficiency maximized \u2192 Mastery deepened \u2192 Legacy built',
      decisionMaking: "45% maximum efficiency, 25% mastery, 15% lasting systems, 15% standards",
      decisionSpeed: "Medium (rapid analysis, deliberate execution)",
      learningStyle: "System-building through iterative mastery",
      memoryType: "Systems-architecture memory",
      abstractionLevel: 70,
      verbalIntelligence: 85,
      metaCognition: 90,
      focus: 100,
      cognitiveFlexibility: 50,
      teachingAbility: 75,
      informationPreference: ["System designs", "Efficiency patterns", "Mastery frameworks"],
      communicationStyle: "Strategic, systematic, building-focused",
      motto: "I systematize perfection into mastery"
    },
    {
      zoneId: 5,
      name: "Patient-Practical Thinking",
      archetype: "The Devoted Craftsperson",
      processingSpeed: "Moderate-Slow (75 BPM)",
      primaryMode: "Sense \u2192 Perfect details \u2192 Persist \u2192 Create quality",
      thoughtPattern: 'Sensory detail noticed \u2192 Quality assessed \u2192 Patience applied \u2192 Craft perfected',
      decisionMaking: "40% sensory perfection, 25% loyal service, 20% lasting value, 15% practical",
      decisionSpeed: "Slow (thorough sensory analysis)",
      learningStyle: "Tactile repetition and patient refinement",
      memoryType: "Sensory-craftsmanship memory",
      abstractionLevel: 50,
      verbalIntelligence: 80,
      metaCognition: 80,
      focus: 95,
      cognitiveFlexibility: 55,
      teachingAbility: 70,
      informationPreference: ["Hands-on demonstration", "Quality standards", "Sensory feedback"],
      communicationStyle: "Patient, grounded, detail-focused",
      motto: "I perfect through patient devotion"
    },
    {
      zoneId: 6,
      name: "Diplomatic-Analytical Thinking",
      archetype: "The Graceful Helper",
      processingSpeed: "Fast (85 BPM)",
      primaryMode: "Analyze \u2192 Balance \u2192 Harmonize \u2192 Serve",
      thoughtPattern: 'Analysis completed \u2192 Perspectives weighed \u2192 Harmony sought \u2192 Grace expressed',
      decisionMaking: "35% harmony, 30% tactful help, 20% quality, 15% aesthetics",
      decisionSpeed: "Medium (weighs all perspectives)",
      learningStyle: "Collaborative analysis and balanced inquiry",
      memoryType: "Relational-aesthetic memory",
      abstractionLevel: 65,
      verbalIntelligence: 90,
      metaCognition: 85,
      focus: 85,
      cognitiveFlexibility: 70,
      teachingAbility: 80,
      informationPreference: ["Balanced perspectives", "Aesthetic quality", "Diplomatic solutions"],
      communicationStyle: "Graceful, balanced, thoughtfully articulate",
      motto: "I serve with grace and balanced analysis"
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
        <h2>{'\u{1F9E0}'} Thinking Style Across the Virgo Spectrum</h2>
        <p className="subtitle">
          How your exact degree determines the WAY you analyze, serve, and perfect reality
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
            Two Virgo Suns can have <strong>completely different thinking styles</strong> based on their degree placement.
            Zone 2 (5-9{'\u00B0'}) thinks at 95 BPM with pure analytical optimization, while Zone 5 (20-24{'\u00B0'}) thinks at 75 BPM
            with patient sensory devotion. This isn{'\u2019'}t better or worse{'\u2014'}it{'\u2019'}s <strong>constitutional diversity</strong>.
          </p>
          <p className="philosophy-note">
            Understanding these differences enables <strong>authentic communication</strong>. When you know someone
            processes through rapid systematic optimization (Zone 2) vs patient craftsmanship (Zone 5), you can meet them where they are.
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
              <h4>Zone 2 vs Zone 5: Pure Analyst vs Patient Craftsperson</h4>
              <span className="flap-badge">Most Different</span>
            </button>
            {expandedFlap === 'extremes' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 5])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDFAD'} Maximum Precision vs Sensory Devotion</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 2: The Master Optimizer</h6>
                        <ul>
                          <li>{'\u26A1'} 95 BPM - Very fast analytical processing</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 60% abstraction - Systems-level thinking</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal - Precise articulation of analysis</li>
                          <li>{'\uD83E\uDE9E'} 95% meta-cognition - Extreme self-awareness of process</li>
                          <li>{'\uD83C\uDFAF'} 100% focus - Total analytical immersion</li>
                          <li>{'\uD83E\uDD38'} 50% flexibility - Anchored in optimal systems</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I analyze, I optimize, I perfect.{'\u201D'}
                          Maximum analytical speed with laser focus. Processes every detail
                          through systematic optimization. The most purely analytical Virgo zone.
                        </p>
                      </div>
                      <div className="vs-divider">VS</div>
                      <div className="zone-analysis">
                        <h6>Zone 5: The Devoted Craftsperson</h6>
                        <ul>
                          <li>{'\u26A1'} 75 BPM - Slowest, most patient</li>
                          <li>{'\uD83C\uDF2B\uFE0F'} 50% abstraction - Grounded in tangible reality</li>
                          <li>{'\uD83D\uDCAC'} 80% verbal - Practical and clear</li>
                          <li>{'\uD83E\uDE9E'} 80% meta-cognition - Steady self-awareness</li>
                          <li>{'\uD83C\uDFAF'} 95% focus - Deep sensory concentration</li>
                          <li>{'\uD83E\uDD38'} 55% flexibility - Patient but persistent</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Essence:</strong> {'\u201C'}I perfect through patient devotion.{'\u201D'}
                          The slowest and most grounded Virgo zone. Perfects through
                          tactile repetition and sensory refinement. The devoted artisan.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u26A0\uFE0F'} The Spectrum:</strong> Zone 2 optimizes through rapid mental analysis with 95 BPM speed.
                      Zone 5 perfects through patient sensory devotion at 75 BPM.
                      Together they represent Virgo{'\u2019'}s full analytical spectrum: from swift mental precision to slow physical mastery.
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
              <h4>Zone 1 vs Zone 6: Proud Perfectionist vs Graceful Helper</h4>
              <span className="flap-badge">Bridge Zones</span>
            </button>
            {expandedFlap === 'cusps' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([1, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDF09'} Leo-Cusp Confidence vs Libra-Cusp Diplomacy</h5>
                    <div className="analysis-row">
                      <div className="zone-analysis">
                        <h6>Zone 1: Leo-Virgo Cusp</h6>
                        <ul>
                          <li>{'\u2600\uFE0F'} Leo influence adds confidence and creative flair (85 verbal)</li>
                          <li>{'\u26A1'} 85 BPM - Fast, confident analysis</li>
                          <li>{'\uD83D\uDCAD'} Analyze {'\u2192'} Perfect {'\u2192'} Create {'\u2192'} Showcase</li>
                          <li>{'\uD83C\uDFAF'} 95% focus - Concentrated craftsmanship</li>
                          <li>{'\uD83D\uDCCA'} Perfection and pride drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth warmed by Fire. Can SHOWCASE analytical excellence
                          with confidence that other Virgo zones rarely display. The perfectionist who
                          bridges meticulous analysis with creative self-expression.
                        </p>
                      </div>
                      <div className="vs-divider">{'\u2194\uFE0F'}</div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Virgo-Libra Cusp</h6>
                        <ul>
                          <li>{'\u2696\uFE0F'} Libra influence adds diplomacy, aesthetics, harmony (90 verbal)</li>
                          <li>{'\u26A1'} 85 BPM - Fast, balanced analysis</li>
                          <li>{'\uD83D\uDCAD'} Analyze {'\u2192'} Balance {'\u2192'} Harmonize {'\u2192'} Serve</li>
                          <li>{'\uD83C\uDFAF'} 85% focus - Balanced attention</li>
                          <li>{'\uD83D\uDCCA'} Harmony and tactful service drive decisions</li>
                        </ul>
                        <p className="analysis-note">
                          <strong>Bridge:</strong> Earth refined by Air. Can HARMONIZE analytical precision
                          with social grace that other Virgo zones find challenging. The helper who
                          bridges meticulous service with diplomatic elegance.
                        </p>
                      </div>
                    </div>
                    <div className="compatibility-note">
                      <strong>{'\u2728'} Similarity:</strong> Zone 1 bridges analysis and confidence (Leo cusp).
                      Zone 6 bridges analysis and diplomacy (Libra cusp). Both are more expressive than
                      pure Virgo, but in different ways: pride vs grace. Zone 3 teaching ability (80%)
                      and Zone 6 teaching ability (80%) are the highest in the Virgo spectrum precisely
                      because cusp and Saturn energy add structured expressive capacity.
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
              <h4>Decan Progression: Mercury Precision {'\u2192'} Saturn Discipline {'\u2192'} Venus Aesthetics</h4>
              <span className="flap-badge">Pure Rulers</span>
            </button>
            {expandedFlap === 'decans' && (
              <div className="flap-content">
                <div className="comparison-grid">
                  <div className="radar-comparison">
                    {generateRadarChart([2, 4, 6])}
                  </div>
                  <div className="comparison-analysis">
                    <h5>{'\uD83C\uDF1F'} How Virgo Thinking Evolves</h5>
                    <div className="three-way-grid">
                      <div className="zone-analysis">
                        <h6>Zone 2: Mercury/Mercury (1st Decan)</h6>
                        <p><strong>Pure Virgo - Analytical Optimizer</strong></p>
                        <ul>
                          <li>{'\u263F'} 100% Mercury influence</li>
                          <li>{'\uD83D\uDD0D'} Analyze first, perfect always</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (highly precise)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (total immersion)</li>
                          <li>{'\uD83D\uDCDA'} Systematic deconstruction ONLY</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 4: Mercury/Saturn (2nd Decan)</h6>
                        <p><strong>Virgo + Capricorn - Efficiency Master</strong></p>
                        <ul>
                          <li>{'\uD83E\uDDF1'} Saturn adds structure + mastery</li>
                          <li>{'\uD83D\uDCC8'} Systematize then build</li>
                          <li>{'\uD83D\uDCAC'} 85% verbal (strategic)</li>
                          <li>{'\uD83C\uDFAF'} 100% focus (absolute lock)</li>
                          <li>{'\uD83D\uDCDA'} System-building through mastery</li>
                        </ul>
                      </div>
                      <div className="zone-analysis">
                        <h6>Zone 6: Mercury/Venus (3rd Decan)</h6>
                        <p><strong>Virgo + Libra Cusp - Graceful Analyst</strong></p>
                        <ul>
                          <li>{'\u2696\uFE0F'} Venus adds harmony + aesthetics</li>
                          <li>{'\uD83C\uDFA8'} Balance what you analyze</li>
                          <li>{'\uD83D\uDCAC'} 90% verbal (diplomatically expressive)</li>
                          <li>{'\uD83C\uDFAF'} 85% focus (balanced)</li>
                          <li>{'\uD83D\uDCDA'} Collaborative balanced inquiry</li>
                        </ul>
                      </div>
                    </div>
                    <div className="progression-note">
                      <strong>{'\uD83D\uDCC8'} The Pattern:</strong> The decan journey transforms Virgo from pure
                      analytical precision (Zone 2) through disciplined mastery (Zone 4) to graceful service (Zone 6).
                      It{'\u2019'}s a progression from inner analytical perfection to outward harmonious expression. Meta-cognition peaks at
                      Zone 2 (95%) where Mercury{'\u2019'}s analytical power demands extreme self-awareness of process, while
                      cognitive flexibility rises steadily (50% {'\u2192'} 50% {'\u2192'} 70%) as Venus{'\u2019'}s influence in the
                      third decan softens Virgo{'\u2019'}s rigid analytical framework.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flap 4: Service Styles Comparison */}
          <div className={`flap ${expandedFlap === 'service' ? 'expanded' : ''}`}>
            <button className="flap-header" onClick={() => toggleFlap('service')}>
              <span className="flap-icon">{expandedFlap === 'service' ? '\u25BC' : '\u25B6'}</span>
              <h4>Service Styles: Compare how each zone serves others</h4>
              <span className="flap-badge">Service Capacity</span>
            </button>
            {expandedFlap === 'service' && (
              <div className="flap-content">
                <div className="teaching-comparison">
                  <h5>{'\uD83D\uDC68\u200D\uD83C\uDFEB'} How Each Zone Serves and Teaches</h5>
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
                            <strong>Service Style:</strong> {
                              style.zoneId === 1 ? "Serves through confident expertise \u2014 \"Watch me perfect this, then I'll show you how\"" :
                              style.zoneId === 2 ? "Serves through systematic optimization \u2014 \"Let me analyze this and find the most efficient solution\"" :
                              style.zoneId === 3 ? "Serves through disciplined responsibility \u2014 \"I'll build the structure so everything runs smoothly\"" :
                              style.zoneId === 4 ? "Serves through mastery and efficiency \u2014 \"Here's the system that makes this work perfectly\"" :
                              style.zoneId === 5 ? "Serves through patient devotion \u2014 \"I'll keep refining until every detail is right\"" :
                              "Serves through graceful diplomacy \u2014 \"Let me help balance everyone's needs with care\""
                            }
                          </div>
                          <div className="teaching-example">
                            <strong>Example:</strong> {
                              style.zoneId === 1 ? "Demonstrates excellence with pride, inspiring others to raise their standards through visible craftsmanship" :
                              style.zoneId === 2 ? "Creates optimized systems and procedures that eliminate waste and maximize quality for everyone" :
                              style.zoneId === 3 ? "Builds reliable structures and mentors others through disciplined, step-by-step mastery programs" :
                              style.zoneId === 4 ? "Designs efficient frameworks that transform chaos into order, teaching mastery through systematic building" :
                              style.zoneId === 5 ? "Patiently refines every detail with sensory precision, creating lasting quality through devoted repetition" :
                              "Harmonizes team dynamics while maintaining high standards, serving others through tactful and balanced guidance"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="teaching-insight">
                    <strong>{'\uD83D\uDCA1'} Key Insight:</strong> Zone 3 (80% teaching) and Zone 6 (80% teaching) are Virgo{'\u2019'}s best teachers{'\u2014'}Zone 3
                    because Saturn{'\u2019'}s discipline adds structured authority, and Zone 6 because Venus{'\u2019'}s grace adds
                    diplomatic warmth. Zone 2 (70% teaching) teaches least accessibly{'\u2014'}its pure optimization
                    can feel clinical to those who need warmth. The pattern:
                    Virgo serves by IMPROVING things for you, not by TELLING you what{'\u2019'}s wrong.
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
            <h4>{'\u2600\uFE0F'} Proud Perfectionists & Master Optimizers</h4>
            <div className="example-content">
              <p><strong>Zone 1-2 Range:</strong> Confident analysts to pure systematic optimizers</p>
              <ul>
                <li><strong>Mother Teresa:</strong> Zone 1 {'\u2014'} perfected service with unwavering confidence, the proud perfectionist who showcased devotion as a craft, combining Leo-cusp warmth with Virgo precision</li>
                <li><strong>Sean Connery:</strong> Zone 1 {'\u2014'} confident mastery of craft, the proud perfectionist who brought analytical precision to performance with self-assured elegance</li>
                <li><strong>Warren Buffett:</strong> Zone 2 {'\u2014'} the Master Optimizer of value, pure analytical-systematic thinking applied to investment with legendary patience and precision</li>
                <li><strong>Stephen King:</strong> Zone 2 {'\u2014'} systematically optimized the craft of storytelling, the master optimizer who perfected a daily writing system that produced extraordinary volume and quality</li>
              </ul>
              <p className="example-note">
                Why different zones? Mother Teresa showcased service with Leo-cusp pride (Zone 1 confidence + service).
                Warren Buffett optimizes purely through systematic analysis (Zone 2 meta-cognition 95%, focus 100%).
                Both Virgo earth, completely different cognitive processing.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\uD83E\uDDF1'} Disciplined Helpers & Efficiency Masters</h4>
            <div className="example-content">
              <p><strong>Zone 3-4 Range:</strong> Responsible helpers to systematic masters</p>
              <ul>
                <li><strong>Amy Poehler:</strong> Zone 3 {'\u2014'} disciplined service through comedy, the responsible helper who built structures (UCB Theatre) that serve others{'\u2019'} creative growth</li>
                <li><strong>Tim Burton:</strong> Zone 3 {'\u2014'} disciplined creative service, the responsible helper who channeled Saturn{'\u2019'}s structural discipline into meticulously crafted visual worlds</li>
                <li><strong>Agatha Christie:</strong> Zone 4 {'\u2014'} the Efficiency Master of mystery, systematized the detective novel into perfectly engineered puzzles with masterful structural precision</li>
                <li><strong>Prince Harry:</strong> Zone 4 {'\u2014'} systematic mastery applied to service, the efficiency master who built organizational frameworks for veteran support and mental health</li>
              </ul>
              <p className="example-note">
                Zone 3 = service through disciplined responsibility. Zone 4 = service through
                systematic mastery. Amy Poehler built comedy institutions (Zone 3 structured service). Agatha Christie
                engineered perfect systems (Zone 4 efficiency mastery). Both Virgo precision, different cognitive pathways.
              </p>
            </div>
          </div>

          <div className="example-card">
            <h4>{'\u2728'} Devoted Craftspeople & Graceful Helpers</h4>
            <div className="example-content">
              <p><strong>Zone 5-6 Territory:</strong> Patient artisans to diplomatic servants</p>
              <ul>
                <li><strong>Keanu Reeves:</strong> Zone 5 {'\u2014'} patient devotion to craft embodied, the devoted craftsperson who perfects every detail through quiet persistence and sensory precision</li>
                <li><strong>Cameron Diaz:</strong> Zone 5 {'\u2014'} patient practical thinking applied to wellness, the devoted craftsperson who channels Taurus-decan sensory awareness into health and quality of life</li>
                <li><strong>Will Smith:</strong> Zone 6 {'\u2014'} graceful service through charm and analysis, the graceful helper who balances analytical precision with Libra-cusp diplomatic warmth</li>
                <li><strong>Macaulay Culkin:</strong> Zone 6 {'\u2014'} diplomatic analytical thinking, the graceful helper whose Libra-cusp energy adds balanced perspective to Virgo{'\u2019'}s analytical nature</li>
              </ul>
              <p className="example-note">
                Zone 5-6 = the outward-facing Virgo. Keanu Reeves perfects through patient sensory devotion
                (Zone 5 focus 95%, abstraction 50%). Will Smith serves with diplomatic grace
                (Zone 6 verbal 90%, flexibility 70%). Both prove Virgo can illuminate the world,
                not just perfect it quietly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Applications */}
      <section className="practical-applications">
        <h3 className="section-title">{'\uD83D\uDCA1'} Earth Sign Applications</h3>

        <div className="application-cards">
          <div className="app-card">
            <h4>{'\uD83D\uDCBC'} Career Paths</h4>
            <p>
              <strong>Zone 1:</strong> Excels in leadership roles requiring visible expertise {'\u2014'} creative direction,
              consulting, quality assurance. Confidence (Leo cusp) plus precision makes them natural experts who inspire through demonstration.<br/>
              <strong>Zone 2:</strong> Excels in pure analytical roles {'\u2014'} data science, systems engineering, research.
              Focus (100%) and meta-cognition (95%) create unmatched analytical depth.<br/>
              <strong>Zone 4:</strong> Excels in systems architecture and operations {'\u2014'} process engineering, management consulting,
              organizational design. Systematic mastery (90% meta-cognition) builds lasting frameworks.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83E\uDD1D'} Relationship Styles</h4>
            <p>
              <strong>Zone 1:</strong> Shows love through confident acts of service {'\u2014'} proudly perfects things for
              partners, needs appreciation for their meticulous efforts. Leo-cusp warmth makes their service feel generous.<br/>
              <strong>Zone 5:</strong> Shows love through patient devotion {'\u2014'} the partner who quietly fixes everything,
              remembers every preference, creates lasting quality in the relationship through sensory care.<br/>
              <strong>Zone 6:</strong> Shows love through graceful accommodation {'\u2014'} balances everyone{'\u2019'}s needs with
              diplomatic precision, making relationships feel harmonious and well-tended.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83C\uDF31'} Growth Areas</h4>
            <p>
              <strong>Zone 2:</strong> Learn to relax perfectionism {'\u2014'} not everything needs to be optimized.
              With 50% cognitive flexibility, the growth edge is embracing beautiful imperfection and trusting
              that {'\u201C'}good enough{'\u201D'} is sometimes the optimal solution.<br/>
              <strong>Zone 3:</strong> Learn to delegate {'\u2014'} Saturn{'\u2019'}s disciplined responsibility can become
              a burden when every duty is internalized. Growth means trusting others to carry some weight.<br/>
              <strong>Zone 5:</strong> Learn to act before perfection {'\u2014'} Taurus-decan patience can become
              procrastination. Growth means shipping quality work before it reaches impossible standards.
            </p>
          </div>

          <div className="app-card">
            <h4>{'\uD83D\uDCDA'} Service & Wellness</h4>
            <p>
              <strong>Health optimization:</strong> Zone 2{'\u2019'}s systematic approach makes them natural health optimizers,
              tracking data, analyzing patterns, creating the perfect wellness routine with scientific precision.<br/>
              <strong>Healing through structure:</strong> Zone 3{'\u2019'}s disciplined service creates therapeutic routines{'\u2014'}the
              nutritionist, the physical therapist, the one who builds recovery programs that actually work.<br/>
              <strong>Craftsmanship healing:</strong> Zone 5{'\u2019'}s patient devotion transforms into healing arts{'\u2014'}massage therapy,
              herbalism, pottery, any practice where patient hands create quality that heals body and soul.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Philosophy */}
      <section className="thinking-philosophy">
        <div className="philosophy-card">
          <h3>{'\uD83C\uDF1F'} The Philosophy of Analytical Intelligence</h3>
          <p>
            Virgo{'\u2019'}s thinking style is not rigid criticism to be softened but a profound analytical
            intelligence system. From the proud perfectionist (Zone 1) through the master optimizer
            (Zone 2), the responsible helper (Zone 3), the efficiency master (Zone 4), the devoted
            craftsperson (Zone 5), to the graceful helper (Zone 6) {'\u2014'} each zone represents a different
            facet of Mercury{'\u2019'}s wisdom applied through Earth.
          </p>
          <p>
            <strong>The tragedy</strong> is when we expect all Virgos to be the same. The Zone 2
            optimizer is called {'\u201C'}too critical.{'\u201D'} The Zone 3 helper is called {'\u201C'}too rigid.{'\u201D'}
            The Zone 4 master is called {'\u201C'}too controlling.{'\u201D'} The Zone 5 craftsperson is called {'\u201C'}too slow.{'\u201D'}
            All are perfect expressions of their constitutional nature.
          </p>
          <p className="philosophy-highlight">
            <strong>Understanding your Virgo zone reveals HOW you analyze, WHY you serve, and WHERE
            your perfectionism can transform the world.</strong> When you know someone processes through
            pure systematic optimization (Zone 2) vs patient sensory devotion (Zone 5), you communicate
            in their language. When you understand that Zone 2{'\u2019'}s rapid analysis (95 BPM) and Zone 5{'\u2019'}s
            patient craftsmanship (75 BPM) are equally valid, you stop demanding that all Virgos
            serve the same way.
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

export default VirgoThinkingStyleTab;
