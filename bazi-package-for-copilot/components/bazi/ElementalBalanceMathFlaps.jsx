/**
 * ============================================
 * ELEMENTAL BALANCE MATH FLAPS
 * "Learn How" - 9th Grade Math Transparency
 * ============================================
 * 
 * Shows exactly where the Visible and Hidden Element numbers come from
 * Pure glass box - no black magic, just addition and percentages!
 */

import React, { useState } from 'react';
import { STEMS, BRANCHES, HIDDEN_STEMS } from '../../utils/baziEngine';

const ElementalBalanceMathFlaps = ({ pillars, chart }) => {
  const [visibleOpen, setVisibleOpen] = useState(false);
  const [hiddenOpen, setHiddenOpen] = useState(false);
  
  // Helper to get element icon
  const getElementIcon = (element) => {
    const icons = {
      Wood: '🌳',
      Fire: '🔥',
      Earth: '⛰️',
      Metal: '⚙️',
      Water: '💧'
    };
    return icons[element] || '❓';
  };
  
  // Helper to get element color
  const getElementColor = (element) => {
    const colors = {
      Wood: '#22c55e',
      Fire: '#ef4444',
      Earth: '#f59e0b',
      Metal: '#94a3b8',
      Water: '#3b82f6'
    };
    return colors[element] || '#6b7280';
  };
  
  return (
    <div style={styles.container}>
      
      {/* Title */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>🎓</div>
        <div style={styles.headerText}>
          <div style={styles.headerTitle}>Learn the Mathematics</div>
          <div style={styles.headerSubtext}>
            See exactly where these numbers come from - no black boxes!
          </div>
        </div>
      </div>
      
      {/* Visible Elements Flap */}
      <div style={styles.flapContainer}>
        <button
          style={styles.flapButton}
          onClick={() => setVisibleOpen(!visibleOpen)}
        >
          <div style={styles.flapHeader}>
            <span style={styles.flapIcon}>👁️</span>
            <span style={styles.flapTitle}>How Visible Elements Are Calculated</span>
            <span style={styles.flapArrow}>{visibleOpen ? '▼' : '▶'}</span>
          </div>
        </button>
        
        {visibleOpen && (
          <div style={styles.flapContent}>
            
            {/* The Simple Rule */}
            <div style={styles.ruleBox}>
              <div style={styles.ruleTitle}>📐 The Simple Rule:</div>
              <div style={styles.ruleText}>
                Each <strong>Stem</strong> = 1.00<br />
                Each <strong>Branch</strong> = 1.00<br />
                Just add them up!
              </div>
            </div>
            
            {/* Show calculation for each pillar */}
            {pillars.map((pillar, index) => (
              <div key={index} style={styles.pillarCalc}>
                <div style={styles.pillarName}>{pillar.name}</div>
                
                <div style={styles.calcRow}>
                  <div style={styles.calcLabel}>Stem:</div>
                  <div style={styles.calcValue}>
                    {pillar.stem.char} {pillar.stem.english}
                  </div>
                  <div style={styles.calcElement}>
                    {getElementIcon(pillar.stem.element)} {pillar.stem.element}
                  </div>
                  <div style={styles.calcNumber}>+1.00</div>
                </div>
                
                <div style={styles.calcRow}>
                  <div style={styles.calcLabel}>Branch:</div>
                  <div style={styles.calcValue}>
                    {pillar.branch.char} {pillar.branch.animal}
                  </div>
                  <div style={styles.calcElement}>
                    {getElementIcon(pillar.branch.element)} {pillar.branch.element}
                  </div>
                  <div style={styles.calcNumber}>+1.00</div>
                </div>
              </div>
            ))}
            
            {/* Total Calculation */}
            <div style={styles.totalBox}>
              <div style={styles.totalTitle}>📊 Add It All Up:</div>
              {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
                const visible = chart.elements.breakdown.visible[element];
                return (
                  <div key={element} style={styles.totalRow}>
                    <span style={styles.totalElement}>
                      {getElementIcon(element)} {element}:
                    </span>
                    <span style={styles.totalNumber}>
                      {visible.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Example Box */}
            <div style={styles.exampleBox}>
              <div style={styles.exampleTitle}>💡 Example:</div>
              <div style={styles.exampleText}>
                If you have 2 Wood Stems and 1 Wood Branch across your Four Pillars:
                <br />
                Wood = 2 stems × 1.00 + 1 branch × 1.00 = <strong>3.00</strong>
              </div>
            </div>
            
          </div>
        )}
      </div>
      
      {/* Hidden Elements Flap */}
      <div style={styles.flapContainer}>
        <button
          style={styles.flapButton}
          onClick={() => setHiddenOpen(!hiddenOpen)}
        >
          <div style={styles.flapHeader}>
            <span style={styles.flapIcon}>🔮</span>
            <span style={styles.flapTitle}>How Hidden Elements Are Calculated</span>
            <span style={styles.flapArrow}>{hiddenOpen ? '▼' : '▶'}</span>
          </div>
        </button>
        
        {hiddenOpen && (
          <div style={styles.flapContent}>
            
            {/* The Hidden Roots Rule */}
            <div style={styles.ruleBox}>
              <div style={styles.ruleTitle}>🔍 The Hidden Roots Rule:</div>
              <div style={styles.ruleText}>
                Each Branch contains <strong>Hidden Roots</strong> (地支藏干)<br />
                These are weighted by percentage:<br />
                • Main Root: 60-100%<br />
                • Middle Root: 20-30% (if present)<br />
                • Residual Root: 10-20% (if present)
              </div>
            </div>
            
            {/* Show hidden roots for each pillar */}
            {pillars.map((pillar, index) => {
              const hiddenRoots = HIDDEN_STEMS[pillar.branch.char] || [];
              
              return (
                <div key={index} style={styles.pillarCalc}>
                  <div style={styles.pillarName}>
                    {pillar.name} - {pillar.branch.char} {pillar.branch.animal}
                  </div>
                  
                  {hiddenRoots.map((root, rootIndex) => {
                    const rootStem = STEMS[root.stem];
                    const decimal = (root.pct / 100).toFixed(2);
                    
                    return (
                      <div key={rootIndex} style={styles.calcRow}>
                        <div style={styles.calcLabel}>{root.type}:</div>
                        <div style={styles.calcValue}>
                          {root.stem} {rootStem?.english}
                        </div>
                        <div style={styles.calcElement}>
                          {getElementIcon(rootStem?.element)} {rootStem?.element}
                        </div>
                        <div style={styles.calcNumber}>
                          {root.pct}% = +{decimal}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Show meaning */}
                  <div style={styles.meaningBox}>
                    💬 {hiddenRoots.map((r, i) => (
                      <span key={i}>
                        {r.meaning}
                        {i < hiddenRoots.length - 1 ? ' + ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Total Calculation */}
            <div style={styles.totalBox}>
              <div style={styles.totalTitle}>📊 Add All Hidden Roots:</div>
              {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
                const hidden = chart.elements.breakdown.hidden[element];
                return (
                  <div key={element} style={styles.totalRow}>
                    <span style={styles.totalElement}>
                      {getElementIcon(element)} {element}:
                    </span>
                    <span style={styles.totalNumber}>
                      {hidden.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Example Box */}
            <div style={styles.exampleBox}>
              <div style={styles.exampleTitle}>💡 Example - Tiger Branch (寅):</div>
              <div style={styles.exampleText}>
                Tiger contains:<br />
                • 甲 (Yang Wood) 60% = 0.60<br />
                • 丙 (Yang Fire) 30% = 0.30<br />
                • 戊 (Yang Earth) 10% = 0.10<br />
                <br />
                So one Tiger Branch adds:<br />
                Wood +0.60, Fire +0.30, Earth +0.10
              </div>
            </div>
            
            {/* The Why Box */}
            <div style={styles.whyBox}>
              <div style={styles.whyTitle}>🎯 Why This Matters:</div>
              <div style={styles.whyText}>
                The Hidden Roots explain why two people with the same "visible" profile 
                can be completely different! The roots contain weighted elemental energies 
                that profoundly influence your constitution. This 2000+ year system captures 
                the <strong>depths beneath the surface</strong>.
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Seasonal Adjustment Explanation */}
      <div style={styles.seasonalNote}>
        <div style={styles.seasonalNoteHeader}>
          <span style={styles.seasonalNoteIcon}>🌸☀️🍂❄️</span>
          <span style={styles.seasonalNoteTitle}>About Seasonal Adjustment</span>
        </div>

        <div style={styles.seasonalNoteContent}>
          <div style={styles.seasonalNoteText}>
            <strong>What you see above:</strong> These calculations show your <strong>base
            constitutional elements</strong> - your permanent elemental DNA that never changes.
            This is the foundation of who you are.
          </div>

          <div style={styles.seasonalNoteText}>
            <strong>What happens next:</strong> Your birth season (Spring/Summer/Autumn/Winter)
            applies multipliers that amplify or dampen each element. For example:
            <ul style={styles.seasonalList}>
              <li>🌸 Spring births: Wood ×1.5 (thriving), Water ×0.8 (receding)</li>
              <li>☀️ Summer births: Fire ×1.5 (peak), Metal ×0.8 (weakened)</li>
              <li>🍂 Autumn births: Metal ×1.5 (strong), Wood ×0.8 (fading)</li>
              <li>❄️ Winter births: Water ×1.5 (dominant), Fire ×0.8 (dormant)</li>
            </ul>
          </div>

          <div style={styles.seasonalNoteText}>
            <strong>Why both matter:</strong> Your base elements show your constitutional DNA
            (who you fundamentally are), while seasonal adjustment shows your energetic
            expression (how you manifest in the world). Both are essential for understanding
            your complete constitutional profile!
          </div>

          <div style={styles.seasonalNoteAction}>
            💡 To see your seasonally-adjusted elements, visit the
            <strong> "🔮 Seasonal Qi" tab</strong> above. Future updates will include
            side-by-side radar charts to visualize the impact!
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerIcon}>✓</div>
        <div style={styles.footerText}>
          Pure mathematics - no black boxes, just transparent calculations you can verify yourself!
        </div>
      </div>
      
    </div>
  );
};

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    marginTop: '24px',
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    padding: '20px',
    border: '2px solid #e5e7eb'
  },
  
  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb'
  },
  
  headerIcon: {
    fontSize: '32px'
  },
  
  headerText: {
    flex: 1
  },
  
  headerTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  
  headerSubtext: {
    fontSize: '14px',
    color: '#6b7280'
  },
  
  // Flap Container
  flapContainer: {
    marginBottom: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    overflow: 'hidden'
  },
  
  flapButton: {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  
  flapHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  flapIcon: {
    fontSize: '24px'
  },
  
  flapTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937'
  },
  
  flapArrow: {
    fontSize: '16px',
    color: '#9ca3af',
    fontWeight: '600'
  },
  
  flapContent: {
    padding: '24px',
    backgroundColor: '#fefefe',
    borderTop: '2px solid #e5e7eb'
  },
  
  // Rule Box
  ruleBox: {
    backgroundColor: '#dbeafe',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #93c5fd'
  },
  
  ruleTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '8px'
  },
  
  ruleText: {
    fontSize: '14px',
    color: '#1e3a8a',
    lineHeight: '1.6'
  },
  
  // Pillar Calculation
  pillarCalc: {
    backgroundColor: '#f0f9ff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #bae6fd'
  },
  
  pillarName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #bae6fd'
  },
  
  calcRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '13px'
  },
  
  calcLabel: {
    width: '70px',
    fontWeight: '600',
    color: '#475569'
  },
  
  calcValue: {
    flex: 1,
    color: '#1f2937'
  },
  
  calcElement: {
    fontWeight: '600',
    color: '#0369a1',
    minWidth: '100px'
  },
  
  calcNumber: {
    fontWeight: '700',
    color: '#16a34a',
    fontSize: '14px',
    minWidth: '80px',
    textAlign: 'right',
    fontFamily: 'monospace'
  },
  
  meaningBox: {
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic',
    border: '1px solid #e0f2fe'
  },
  
  // Total Box
  totalBox: {
    backgroundColor: '#f0fdf4',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '20px',
    border: '2px solid #86efac'
  },
  
  totalTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#166534',
    marginBottom: '12px'
  },
  
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px'
  },
  
  totalElement: {
    fontWeight: '600',
    color: '#15803d'
  },
  
  totalNumber: {
    fontWeight: '700',
    color: '#166534',
    fontSize: '16px',
    fontFamily: 'monospace'
  },
  
  // Example Box
  exampleBox: {
    backgroundColor: '#fef3c7',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '20px',
    border: '2px solid #fcd34d'
  },
  
  exampleTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#92400e',
    marginBottom: '8px'
  },
  
  exampleText: {
    fontSize: '13px',
    color: '#78350f',
    lineHeight: '1.6'
  },
  
  // Why Box
  whyBox: {
    backgroundColor: '#f3e8ff',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '20px',
    border: '2px solid #d8b4fe'
  },
  
  whyTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#6b21a8',
    marginBottom: '8px'
  },
  
  whyText: {
    fontSize: '13px',
    color: '#581c87',
    lineHeight: '1.6'
  },
  
  // Seasonal Note Box
  seasonalNote: {
    marginTop: '24px',
    backgroundColor: '#fefce8',
    borderRadius: '12px',
    padding: '20px',
    border: '2px solid #fde047'
  },

  seasonalNoteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #fde047'
  },

  seasonalNoteIcon: {
    fontSize: '24px'
  },

  seasonalNoteTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#854d0e'
  },

  seasonalNoteContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  seasonalNoteText: {
    fontSize: '14px',
    color: '#713f12',
    lineHeight: '1.6'
  },

  seasonalList: {
    marginTop: '8px',
    marginLeft: '20px',
    fontSize: '13px',
    color: '#78350f'
  },

  seasonalNoteAction: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#fef9c3',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#713f12',
    border: '1px solid #fde047'
  },

  // Footer
  footer: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  footerIcon: {
    fontSize: '20px',
    color: '#22c55e'
  },

  footerText: {
    fontSize: '13px',
    color: '#6b7280',
    flex: 1
  }
};

export default ElementalBalanceMathFlaps;
