/**
 * ============================================
 * SEASONAL QI TAB - The 4th Tab for BaZi Panel
 * ============================================
 * 
 * Shows how season of birth affects your elemental strength
 * Beautiful breathing orbs + actionable guidance
 * 
 * Combines:
 * - 🎨 Nano: Breathing orb visualization
 * - 🧠 Gemini: Seasonal multiplier calculations
 * - 🏮 Claude: UX and emotional resonance
 * - ⚡ Grok: Actionable "what to DO" guidance
 */

import React, { useState } from 'react';

const SeasonalQiTab = ({ elements, birthMonth, birthDate }) => {
  const [expandedGuidance, setExpandedGuidance] = useState(false);
  
  // DEBUG: Log what we're receiving
  console.log('🔍 SeasonalQiTab received:', {
    elements,
    birthMonth,
    birthDate
  });
  
  // Element visuals
  const elementVisuals = {
    Wood: { emoji: '🌳', color: '#10b981', name: 'Wood' },
    Fire: { emoji: '🔥', color: '#ef4444', name: 'Fire' },
    Earth: { emoji: '⛰️', color: '#d97706', name: 'Earth' },
    Metal: { emoji: '⚙️', color: '#9ca3af', name: 'Metal' },
    Water: { emoji: '💧', color: '#3b82f6', name: 'Water' }
  };
  
  // Determine season from birth month
  const getSeason = (month) => {
    if (!month) {
      console.error('❌ No month data provided');
      return null;
    }
    
    let branch = null;
    
    // Method 1: branch.animal (from parsePillarString in baziEngine.js)
    if (month.branch && month.branch.animal) {
      branch = month.branch.animal;
      console.log('✅ Got branch via month.branch.animal:', branch);
    }
    // Method 2: Direct animal property
    else if (month.animal) {
      branch = month.animal;
      console.log('✅ Got branch via month.animal:', branch);
    }
    // Method 3: branchName property
    else if (month.branchName) {
      branch = month.branchName;
      console.log('✅ Got branch via month.branchName:', branch);
    }
    
    if (!branch) {
      console.error('❌ Unable to extract branch from month:', month);
      return null;
    }
    
    // Map branch to season
    if (branch === 'Tiger' || branch === 'Rabbit') return 'Spring';
    if (branch === 'Dragon') return 'Dragon';
    if (branch === 'Snake' || branch === 'Horse') return 'Summer';
    if (branch === 'Goat') return 'Goat';
    if (branch === 'Monkey' || branch === 'Rooster') return 'Autumn';
    if (branch === 'Dog') return 'Dog';
    if (branch === 'Pig' || branch === 'Rat') return 'Winter';
    if (branch === 'Ox') return 'Ox';
    
    console.error('❌ Unknown branch:', branch);
    return null;
  };
  
  // Get seasonal multipliers
  const getSeasonalMultipliers = (season) => {
    const multipliers = {
      'Spring': { Wood: 1.5, Fire: 1.2, Water: 0.8, Earth: 0.5, Metal: 0.2 },
      'Dragon': { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 },
      'Summer': { Fire: 1.5, Earth: 1.2, Wood: 0.8, Metal: 0.5, Water: 0.2 },
      'Goat': { Earth: 1.5, Metal: 1.2, Fire: 0.8, Wood: 0.5, Water: 0.2 },
      'Autumn': { Metal: 1.5, Water: 1.2, Earth: 0.8, Wood: 0.2, Fire: 0.5 },
      'Dog': { Earth: 1.5, Water: 1.2, Metal: 0.8, Fire: 0.5, Wood: 0.2 },
      'Winter': { Water: 1.5, Wood: 1.2, Metal: 0.8, Fire: 0.2, Earth: 0.5 },
      'Ox': { Earth: 1.5, Water: 1.2, Metal: 0.8, Fire: 0.5, Wood: 0.2 }
    };
    
    return multipliers[season] || { Wood: 1, Fire: 1, Earth: 1, Metal: 1, Water: 1 };
  };
  
  // Get Qi state labels
  const getQiState = (multiplier) => {
    if (multiplier >= 1.5) return { label: 'Thriving', emoji: '✨' };
    if (multiplier >= 1.2) return { label: 'Growing', emoji: '🌱' };
    if (multiplier >= 0.8) return { label: 'Neutral', emoji: '➡️' };
    if (multiplier >= 0.5) return { label: 'Resting', emoji: '😴' };
    return { label: 'Dormant', emoji: '💤' };
  };
  
  const season = getSeason(birthMonth);
  if (!season) {
    return (
      <div style={styles.error}>
        <div style={styles.errorIcon}>⚠️</div>
        <div>Unable to determine birth season</div>
      </div>
    );
  }
  
  const multipliers = getSeasonalMultipliers(season);
  
  // Calculate adjusted percentages
  const adjustedElements = {};
  const rawTotal = Object.values(elements.percentages).reduce((sum, val) => sum + val, 0);
  
  let adjustedTotal = 0;
  Object.keys(elements.percentages).forEach(element => {
    const raw = elements.percentages[element] || 0;
    const adjusted = raw * (multipliers[element] || 1);
    adjustedElements[element] = adjusted;
    adjustedTotal += adjusted;
  });
  
  // Convert to percentages
  const adjustedPercentages = {};
  Object.keys(adjustedElements).forEach(element => {
    adjustedPercentages[element] = (adjustedElements[element] / adjustedTotal) * 100;
  });
  
  // Find strongest and weakest
  const sortedElements = Object.entries(adjustedPercentages).sort((a, b) => b[1] - a[1]);
  const strongest = sortedElements[0];
  const weakest = sortedElements[sortedElements.length - 1];
  
  // Season emoji and name
  const seasonInfo = {
    'Spring': { emoji: '🌸', name: 'Spring', color: '#10b981' },
    'Dragon': { emoji: '🐉', name: 'Dragon Earth', color: '#d97706' },
    'Summer': { emoji: '☀️', name: 'Summer', color: '#ef4444' },
    'Goat': { emoji: '🐐', name: 'Goat Earth', color: '#d97706' },
    'Autumn': { emoji: '🍂', name: 'Autumn', color: '#9ca3af' },
    'Dog': { emoji: '🐕', name: 'Dog Earth', color: '#d97706' },
    'Winter': { emoji: '❄️', name: 'Winter', color: '#3b82f6' },
    'Ox': { emoji: '🐂', name: 'Ox Earth', color: '#d97706' }
  };
  
  const currentSeason = seasonInfo[season];
  
  return (
    <div style={styles.container}>
      
      {/* Season Header */}
      <div style={{
        ...styles.seasonHeader,
        background: `linear-gradient(135deg, ${currentSeason.color}20, ${currentSeason.color}10)`
      }}>
        <div style={styles.seasonEmoji}>{currentSeason.emoji}</div>
        <div>
          <div style={styles.seasonTitle}>
            Born in {currentSeason.name}
          </div>
          <div style={styles.seasonSubtitle}>
            Your birth season shapes your elemental Qi strength
          </div>
        </div>
      </div>
      
      {/* Insight Message */}
      <div style={styles.insightBox}>
        <div style={styles.insightIcon}>💡</div>
        <div style={styles.insightText}>
          <strong>The Seasonal Truth:</strong> Your strongest element is{' '}
          <strong style={{ color: elementVisuals[strongest[0]].color }}>
            {strongest[0]}
          </strong>{' '}
          ({Math.round(strongest[1])}%) and your weakest is{' '}
          <strong style={{ color: elementVisuals[weakest[0]].color }}>
            {weakest[0]}
          </strong>{' '}
          ({Math.round(weakest[1])}%). This isn't weakness - this is your{' '}
          <strong>authentic seasonal rhythm</strong>.
        </div>
      </div>
      
      {/* Breathing Orbs */}
      <div style={styles.orbsSection}>
        <h3 style={styles.orbsTitle}>🫧 Your Elemental Qi (Seasonally Adjusted)</h3>
        <div style={styles.orbsGrid}>
          {Object.entries(elementVisuals).map(([element, visual]) => {
            const rawPct = elements.percentages[element] || 0;
            const adjustedPct = adjustedPercentages[element] || 0;
            const multiplier = multipliers[element] || 1;
            const qiState = getQiState(multiplier);
            
            // Orb size based on adjusted percentage
            const orbSize = 40 + (adjustedPct * 0.8);
            const opacity = 0.4 + (adjustedPct / 100 * 0.6);
            
            return (
              <div key={element} style={styles.orbContainer}>
                {/* Breathing Orb */}
                <div style={{
                  ...styles.orbWrapper,
                  width: `${orbSize}px`,
                  height: `${orbSize}px`
                }}>
                  {/* Outer glow */}
                  <div style={{
                    ...styles.orbGlow,
                    backgroundColor: visual.color,
                    opacity: opacity * 0.3
                  }} />
                  
                  {/* Main orb */}
                  <div style={{
                    ...styles.orb,
                    backgroundColor: visual.color,
                    opacity: opacity,
                    boxShadow: `0 0 20px ${visual.color}`
                  }}>
                    <span style={styles.orbEmoji}>{visual.emoji}</span>
                  </div>
                  
                  {/* Particles for strong elements */}
                  {adjustedPct > 30 && (
                    <div style={styles.particleContainer}>
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          style={{
                            ...styles.particle,
                            backgroundColor: visual.color,
                            top: `${20 + i * 20}%`,
                            left: `${20 + i * 20}%`,
                            animationDelay: `${i * 0.3}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Legend */}
                <div style={styles.orbLabel}>
                  <div style={styles.orbName}>{element}</div>
                  <div style={styles.orbMultiplier}>
                    {multiplier.toFixed(1)}x {qiState.emoji}
                  </div>
                  <div style={styles.orbPercent}>
                    {Math.round(adjustedPct)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Before/After Comparison */}
      <div style={styles.comparisonSection}>
        <h3 style={styles.comparisonTitle}>
          📊 Seasonal Impact on Your Elements
        </h3>
        <div style={styles.comparisonGrid}>
          {Object.entries(elementVisuals).map(([element, visual]) => {
            const raw = elements.percentages[element] || 0;
            const adjusted = adjustedPercentages[element] || 0;
            const diff = adjusted - raw;
            const multiplier = multipliers[element] || 1;
            
            return (
              <div key={element} style={styles.comparisonRow}>
                <div style={styles.comparisonElement}>
                  <span style={styles.comparisonEmoji}>{visual.emoji}</span>
                  <span style={styles.comparisonName}>{element}</span>
                </div>
                <div style={styles.comparisonBars}>
                  <div style={styles.comparisonBar}>
                    <div style={styles.barLabel}>Base:</div>
                    <div style={{
                      ...styles.barFill,
                      width: `${raw}%`,
                      backgroundColor: `${visual.color}40`
                    }}>
                      <span style={styles.barText}>{Math.round(raw)}%</span>
                    </div>
                  </div>
                  <div style={styles.comparisonBar}>
                    <div style={styles.barLabel}>In {currentSeason.name}:</div>
                    <div style={{
                      ...styles.barFill,
                      width: `${adjusted}%`,
                      backgroundColor: visual.color
                    }}>
                      <span style={styles.barText}>{Math.round(adjusted)}%</span>
                    </div>
                  </div>
                </div>
                <div style={styles.comparisonChange}>
                  {diff > 0 ? '↑' : diff < 0 ? '↓' : '→'}
                  {Math.abs(diff).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actionable Guidance */}
      <div style={styles.guidanceSection}>
        <button
          onClick={() => setExpandedGuidance(!expandedGuidance)}
          style={styles.guidanceButton}
        >
          <span style={styles.guidanceIcon}>⚡</span>
          <span style={styles.guidanceTitle}>
            What To DO With This Knowledge
          </span>
          <span style={styles.guidanceArrow}>
            {expandedGuidance ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedGuidance && (
          <div style={styles.guidanceContent}>
            <div style={styles.guidanceCard}>
              <div style={styles.guidanceCardTitle}>
                ✨ Lean Into Your Strengths
              </div>
              <div style={styles.guidanceCardText}>
                Your <strong>{strongest[0]}</strong> is naturally amplified in {currentSeason.name}.
                This is your power zone - schedule important {strongest[0]}-related activities
                during this time of year!
              </div>
            </div>
            
            <div style={styles.guidanceCard}>
              <div style={styles.guidanceCardTitle}>
                🌱 Support Your Weak Elements
              </div>
              <div style={styles.guidanceCardText}>
                Your <strong>{weakest[0]}</strong> is dormant in {currentSeason.name}.
                Avoid making {weakest[0]}-dependent decisions. Partner with people
                who have strong {weakest[0]} to balance you!
              </div>
            </div>
            
            <div style={styles.guidanceCard}>
              <div style={styles.guidanceCardTitle}>
                💑 Relationship Compatibility
              </div>
              <div style={styles.guidanceCardText}>
                Seek partners born in seasons that complement yours. Someone born
                with strong {weakest[0]} can provide what you naturally lack,
                creating true complementarity!
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    padding: '20px'
  },
  
  seasonHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '2px solid rgba(255,255,255,0.1)'
  },
  
  seasonEmoji: {
    fontSize: '48px'
  },
  
  seasonTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px'
  },
  
  seasonSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)'
  },
  
  insightBox: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#fef3c7',
    borderRadius: '12px',
    border: '2px solid #fbbf24',
    marginBottom: '32px'
  },
  
  insightIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  
  insightText: {
    fontSize: '14px',
    color: '#92400e',
    lineHeight: '1.6'
  },
  
  orbsSection: {
    marginBottom: '32px'
  },
  
  orbsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    textAlign: 'center'
  },
  
  orbsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '24px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px'
  },
  
  orbContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  
  orbWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  orbGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    filter: 'blur(12px)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  
  orb: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  
  orbEmoji: {
    fontSize: '28px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  },
  
  particleContainer: {
    position: 'absolute',
    inset: 0
  },
  
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
  },
  
  orbLabel: {
    textAlign: 'center'
  },
  
  orbName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '2px'
  },
  
  orbMultiplier: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '2px'
  },
  
  orbPercent: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)'
  },
  
  comparisonSection: {
    marginBottom: '32px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px'
  },
  
  comparisonTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    textAlign: 'center'
  },
  
  comparisonGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  
  comparisonRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 80px',
    gap: '16px',
    alignItems: 'center'
  },
  
  comparisonElement: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  comparisonEmoji: {
    fontSize: '20px'
  },
  
  comparisonName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff'
  },
  
  comparisonBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  comparisonBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  barLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    width: '80px',
    flexShrink: 0
  },
  
  barFill: {
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px',
    minWidth: '40px',
    transition: 'width 0.5s ease'
  },
  
  barText: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#fff'
  },
  
  comparisonChange: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center'
  },
  
  guidanceSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    overflow: 'hidden'
  },
  
  guidanceButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background-color 0.2s'
  },
  
  guidanceIcon: {
    fontSize: '24px'
  },
  
  guidanceTitle: {
    flex: 1,
    fontSize: '16px',
    fontWeight: '700',
    textAlign: 'left'
  },
  
  guidanceArrow: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)'
  },
  
  guidanceContent: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  
  guidanceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  
  guidanceCardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px'
  },
  
  guidanceCardText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.6'
  },
  
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px',
    color: '#dc2626'
  },
  
  errorIcon: {
    fontSize: '48px'
  }
};

export default SeasonalQiTab;
