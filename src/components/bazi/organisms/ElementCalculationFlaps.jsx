/**
 * ElementCalculationFlaps - Show Your Work Component
 * Expandable breakdown of how element percentages are calculated
 * Makes the "black box" transparent with L1/L2 explainability
 */

import React, { useState, useMemo } from 'react';
import { useBaziTheme, getElementColor, getElementIcon } from '../theme/BaziTheme';

const ELEMENTS_ORDER = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// Stem to Element lookup (from baziEngine.js)
const STEM_ELEMENTS = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

// Element colors
const ELEMENT_COLORS = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#a1a1aa',
  Water: '#3b82f6'
};

const ElementCalculationFlaps = ({
  pillars,              // Array of 4 pillars with stem, branch, hiddenStems
  elements,             // Final element distribution { percentages, breakdown, raw }
  title = 'Element Calculation Breakdown',
  compact = false
}) => {
  const theme = useBaziTheme();
  const [expandedElement, setExpandedElement] = useState(null);
  const [showL2Math, setShowL2Math] = useState(false);
  const [showL3Debug, setShowL3Debug] = useState(false);

  // Build detailed breakdown from pillars
  const detailedBreakdown = useMemo(() => {
    if (!pillars || pillars.length === 0) return null;

    const breakdown = {
      visible: { Wood: [], Fire: [], Earth: [], Metal: [], Water: [] },
      hidden: { Wood: [], Fire: [], Earth: [], Metal: [], Water: [] },
      totals: { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }
    };

    const pillarNames = ['Year', 'Month', 'Day', 'Hour'];

    pillars.forEach((pillar, index) => {
      const pillarName = pillarNames[index];

      // Visible Stem (1.0 weight)
      if (pillar.stem?.element) {
        const el = pillar.stem.element;
        breakdown.visible[el].push({
          source: `${pillarName} Stem`,
          char: pillar.stem.char,
          weight: 1.0,
          reason: 'Visible Heavenly Stem'
        });
        breakdown.totals[el] += 1.0;
      }

      // Visible Branch (1.0 weight)
      if (pillar.branch?.element) {
        const el = pillar.branch.element;
        breakdown.visible[el].push({
          source: `${pillarName} Branch`,
          char: pillar.branch.char,
          animal: pillar.branch.animal,
          weight: 1.0,
          reason: 'Visible Earthly Branch'
        });
        breakdown.totals[el] += 1.0;
      }

      // Hidden Stems/Roots (variable weights)
      // Check for hiddenRoots (from baziEngine) or hiddenStems (alternative format)
      const hidden = pillar.hiddenRoots || pillar.branch?.hiddenStems || pillar.hiddenStems || [];
      hidden.forEach(root => {
        // Look up element from stem character if not provided directly
        const stemChar = root.stem || root.char;
        const el = root.element || STEM_ELEMENTS[stemChar];

        if (el && ELEMENTS_ORDER.includes(el)) {
          const weight = (root.pct || root.percentage || 0) / 100;
          breakdown.hidden[el].push({
            source: `${pillarName} (${pillar.branch?.char || ''} ${pillar.branch?.animal || ''})`,
            char: stemChar,
            weight: weight,
            percentage: root.pct || root.percentage,
            type: root.type || 'Hidden',
            meaning: root.meaning || ''
          });
          breakdown.totals[el] += weight;
        }
      });
    });

    // Calculate grand total and percentages
    const grandTotal = Object.values(breakdown.totals).reduce((sum, val) => sum + val, 0);
    breakdown.grandTotal = grandTotal;
    breakdown.percentages = {};
    ELEMENTS_ORDER.forEach(el => {
      breakdown.percentages[el] = grandTotal > 0 ? (breakdown.totals[el] / grandTotal * 100) : 0;
    });

    return breakdown;
  }, [pillars]);

  if (!detailedBreakdown) {
    return <div style={{ color: theme.colors.muted }}>No pillar data available</div>;
  }

  const styles = {
    container: {
      background: theme.colors.card,
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: compact ? 12 : 20,
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: compact ? 12 : 16
    },
    title: {
      fontSize: compact ? '0.8rem' : '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.text,
      fontWeight: 600
    },
    badge: {
      fontSize: '0.7rem',
      padding: '4px 8px',
      borderRadius: 12,
      background: theme.colors.cardLight,
      color: theme.colors.muted
    },
    elementList: {
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 6 : 10
    },
    elementRow: {
      cursor: 'pointer',
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`,
      overflow: 'hidden',
      transition: 'all 0.2s ease'
    },
    elementHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: compact ? '8px 12px' : '12px 16px',
      background: theme.colors.cardLight
    },
    elementLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    elementIcon: {
      fontSize: compact ? '1.2rem' : '1.5rem'
    },
    elementName: {
      fontSize: compact ? '0.85rem' : '0.95rem',
      fontWeight: 600,
      color: theme.colors.text
    },
    elementRight: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    percentage: {
      fontSize: compact ? '1rem' : '1.2rem',
      fontWeight: 700
    },
    rawWeight: {
      fontSize: '0.7rem',
      color: theme.colors.muted,
      textAlign: 'right'
    },
    expandIcon: {
      fontSize: '1rem',
      transition: 'transform 0.2s ease',
      color: theme.colors.muted
    },
    expandedContent: {
      padding: compact ? '12px' : '16px',
      borderTop: `1px solid ${theme.colors.border}`,
      background: theme.colors.background
    },
    section: {
      marginBottom: 12
    },
    sectionTitle: {
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.muted,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    contributionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    },
    contribution: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 10px',
      background: theme.colors.cardLight,
      borderRadius: 6,
      fontSize: '0.8rem'
    },
    contributionSource: {
      color: theme.colors.text
    },
    contributionChar: {
      fontFamily: "'Noto Sans SC', sans-serif",
      fontSize: '1.1rem',
      marginLeft: 8
    },
    contributionWeight: {
      fontWeight: 600,
      color: theme.colors.text
    },
    formula: {
      marginTop: 12,
      padding: '10px 12px',
      background: theme.colors.card,
      borderRadius: 8,
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      border: `1px dashed ${theme.colors.border}`
    },
    l2Toggle: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: `1px solid ${theme.colors.border}`
    },
    l2Button: {
      width: '100%',
      padding: '10px',
      background: 'transparent',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: 8,
      color: theme.colors.muted,
      fontSize: '0.75rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      transition: 'all 0.2s ease'
    },
    l2Content: {
      marginTop: 12,
      padding: 12,
      background: theme.colors.background,
      borderRadius: 8,
      fontFamily: 'monospace',
      fontSize: '0.7rem',
      color: theme.colors.textSecondary,
      whiteSpace: 'pre-wrap',
      maxHeight: 300,
      overflow: 'auto'
    }
  };

  const toggleElement = (el) => {
    setExpandedElement(expandedElement === el ? null : el);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={styles.badge}>L1 Explainability</span>
      </div>

      {/* Element List */}
      <div style={styles.elementList}>
        {ELEMENTS_ORDER.map(el => {
          const isExpanded = expandedElement === el;
          const color = ELEMENT_COLORS[el];
          const pct = detailedBreakdown.percentages[el];
          const total = detailedBreakdown.totals[el];
          const visible = detailedBreakdown.visible[el];
          const hidden = detailedBreakdown.hidden[el];

          return (
            <div
              key={el}
              style={{
                ...styles.elementRow,
                borderColor: isExpanded ? color : theme.colors.border
              }}
            >
              {/* Element Header - Clickable */}
              <div
                style={{
                  ...styles.elementHeader,
                  background: isExpanded ? `${color}15` : theme.colors.cardLight
                }}
                onClick={() => toggleElement(el)}
              >
                <div style={styles.elementLeft}>
                  <span style={styles.elementIcon}>{getElementIcon(el)}</span>
                  <span style={{ ...styles.elementName, color: isExpanded ? color : theme.colors.text }}>
                    {el}
                  </span>
                </div>
                <div style={styles.elementRight}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...styles.percentage, color }}>
                      {pct.toFixed(1)}%
                    </div>
                    <div style={styles.rawWeight}>
                      Weight: {total.toFixed(2)}
                    </div>
                  </div>
                  <span style={{
                    ...styles.expandIcon,
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={styles.expandedContent}>
                  {/* Visible Contributions */}
                  {visible.length > 0 && (
                    <div style={styles.section}>
                      <div style={styles.sectionTitle}>
                        <span>👁️</span>
                        <span>Visible Contributions ({visible.length})</span>
                      </div>
                      <div style={styles.contributionList}>
                        {visible.map((item, i) => (
                          <div key={i} style={styles.contribution}>
                            <span style={styles.contributionSource}>
                              {item.source}
                              <span style={{ ...styles.contributionChar, color }}>
                                {item.char}
                              </span>
                              {item.animal && <span style={{ marginLeft: 4, fontSize: '0.9rem' }}>{item.animal}</span>}
                            </span>
                            <span style={{ ...styles.contributionWeight, color }}>
                              +{item.weight.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden Contributions */}
                  {hidden.length > 0 && (
                    <div style={styles.section}>
                      <div style={styles.sectionTitle}>
                        <span>🔮</span>
                        <span>Hidden Root Contributions ({hidden.length})</span>
                      </div>
                      <div style={styles.contributionList}>
                        {hidden.map((item, i) => (
                          <div key={i} style={styles.contribution}>
                            <span style={styles.contributionSource}>
                              {item.source}
                              <span style={{ ...styles.contributionChar, color }}>
                                {item.char}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: theme.colors.muted, marginLeft: 6 }}>
                                ({item.percentage}% {item.type})
                              </span>
                            </span>
                            <span style={{ ...styles.contributionWeight, color }}>
                              +{item.weight.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No contributions */}
                  {visible.length === 0 && hidden.length === 0 && (
                    <div style={{ color: theme.colors.muted, fontSize: '0.8rem', textAlign: 'center', padding: 12 }}>
                      No {el} element in this chart
                    </div>
                  )}

                  {/* Formula */}
                  <div style={styles.formula}>
                    <strong>{el} Calculation:</strong><br />
                    Visible: {visible.reduce((sum, v) => sum + v.weight, 0).toFixed(1)} +
                    Hidden: {hidden.reduce((sum, h) => sum + h.weight, 0).toFixed(2)} =
                    <strong> {total.toFixed(2)}</strong><br />
                    Percentage: ({total.toFixed(2)} / {detailedBreakdown.grandTotal.toFixed(2)}) × 100 =
                    <strong style={{ color }}> {pct.toFixed(1)}%</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* L2 Math Toggle */}
      <div style={styles.l2Toggle}>
        <button
          style={styles.l2Button}
          onClick={() => setShowL2Math(!showL2Math)}
          onMouseOver={(e) => {
            e.target.style.background = theme.colors.cardLight;
            e.target.style.color = theme.colors.text;
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.colors.muted;
          }}
        >
          <span>{showL2Math ? '▲' : '▼'}</span>
          <span>{showL2Math ? 'Hide' : 'Show'} L2 Technical Math</span>
        </button>

        {showL2Math && (
          <div style={styles.l2Content}>
{`═══════════════════════════════════════════════
ELEMENT CALCULATION BREAKDOWN (L2 Technical)
═══════════════════════════════════════════════

FORMULA:
  Element % = (Visible + Hidden) / Total × 100

WEIGHTS:
  • Visible Stem:  1.0 (Heavenly Stem element)
  • Visible Branch: 1.0 (Earthly Branch element)
  • Hidden Root:   pct/100 (Based on seasonal strength)

RAW WEIGHTS:
${ELEMENTS_ORDER.map(el => `  ${el.padEnd(6)}: ${detailedBreakdown.totals[el].toFixed(3)}`).join('\n')}
  ─────────
  TOTAL  : ${detailedBreakdown.grandTotal.toFixed(3)}

FINAL PERCENTAGES:
${ELEMENTS_ORDER.map(el => `  ${el.padEnd(6)}: ${detailedBreakdown.percentages[el].toFixed(2)}%`).join('\n')}

HIDDEN STEMS REFERENCE (Industry Standard):
  子 Rat:    癸100%
  丑 Ox:     己60%, 癸30%, 辛10%
  寅 Tiger:  甲60%, 丙30%, 戊10%
  卯 Rabbit: 乙100%
  辰 Dragon: 戊60%, 乙30%, 癸10%
  巳 Snake:  丙60%, 庚30%, 戊10%
  午 Horse:  丁70%, 己30%
  未 Goat:   己60%, 丁30%, 乙10%
  申 Monkey: 庚60%, 壬30%, 戊10%
  酉 Rooster:辛100%
  戌 Dog:    戊60%, 辛30%, 丁10%
  亥 Pig:    壬70%, 甲30%

═══════════════════════════════════════════════`}
          </div>
        )}

        {/* L3 Debug Toggle */}
        <button
          style={{
            ...styles.l2Button,
            marginTop: 12,
            borderColor: showL3Debug ? '#f97316' : theme.colors.border,
            color: showL3Debug ? '#f97316' : theme.colors.muted
          }}
          onClick={() => setShowL3Debug(!showL3Debug)}
        >
          <span>{showL3Debug ? '▲' : '▼'}</span>
          <span>{showL3Debug ? 'Hide' : 'Show'} L3 Debug (Raw Data)</span>
          <span style={{
            fontSize: '0.65rem',
            padding: '2px 6px',
            background: '#f9731620',
            color: '#f97316',
            borderRadius: 4,
            marginLeft: 8
          }}>DEV</span>
        </button>

        {showL3Debug && (
          <div style={{
            ...styles.l2Content,
            borderColor: '#f97316',
            background: '#0c0a09'
          }}>
{`╔═══════════════════════════════════════════════════════════════╗
║           L3 DEBUG - RAW DATA & INTERMEDIATE VALUES           ║
╚═══════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│ DATA QUALITY FLAGS                                              │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Pillars array:     ${pillars ? `Present (${pillars.length} pillars)` : '❌ MISSING'}
│ ✓ Elements object:   ${elements ? 'Present' : '❌ MISSING'}
│ ✓ Hidden roots:      ${pillars?.some(p => p.hiddenRoots?.length > 0) ? 'Present' : '⚠️ Not found in pillars'}
│ ✓ Grand total:       ${detailedBreakdown.grandTotal.toFixed(6)} (should be ~8-16)
│ ✓ Percentage sum:    ${ELEMENTS_ORDER.reduce((sum, el) => sum + detailedBreakdown.percentages[el], 0).toFixed(2)}% (should be ~100%)
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RAW ELEMENT VECTOR (Normalized 0-1)                             │
├─────────────────────────────────────────────────────────────────┤
│ [${ELEMENTS_ORDER.map(el => (detailedBreakdown.percentages[el] / 100).toFixed(4)).join(', ')}]
│  Wood    Fire    Earth   Metal   Water
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PILLAR-BY-PILLAR DEBUG                                          │
├─────────────────────────────────────────────────────────────────┤
${pillars?.map((p, i) => {
  const names = ['YEAR', 'MONTH', 'DAY', 'HOUR'];
  const hiddenCount = (p.hiddenRoots || []).length;
  return `│ ${names[i].padEnd(6)} │ Stem: ${p.stem?.char || '?'} (${(p.stem?.element || '?').padEnd(5)}) │ Branch: ${p.branch?.char || '?'} (${(p.branch?.element || '?').padEnd(5)}) │ Hidden: ${hiddenCount}`;
}).join('\n') || '│ No pillar data'}
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ INTERMEDIATE CALCULATION TRACE                                  │
├─────────────────────────────────────────────────────────────────┤
│ Step 1: Extract visible stems    → +${pillars?.filter(p => p.stem?.element).length || 0} contributions
│ Step 2: Extract visible branches → +${pillars?.filter(p => p.branch?.element).length || 0} contributions
│ Step 3: Process hidden roots     → +${pillars?.reduce((sum, p) => sum + (p.hiddenRoots?.length || 0), 0) || 0} contributions
│ Step 4: Sum all weights          → ${detailedBreakdown.grandTotal.toFixed(4)}
│ Step 5: Normalize to percentages → 100.00%
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ VISIBLE BREAKDOWN MATRIX                                        │
├─────────────────────────────────────────────────────────────────┤
│         Wood   Fire   Earth  Metal  Water
│ Stems:  ${ELEMENTS_ORDER.map(el => detailedBreakdown.visible[el].filter(v => v.source.includes('Stem')).length.toString().padStart(4)).join('  ')}
│ Branch: ${ELEMENTS_ORDER.map(el => detailedBreakdown.visible[el].filter(v => v.source.includes('Branch')).length.toString().padStart(4)).join('  ')}
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ HIDDEN ROOTS BREAKDOWN                                          │
├─────────────────────────────────────────────────────────────────┤
│         Wood   Fire   Earth  Metal  Water
│ Count:  ${ELEMENTS_ORDER.map(el => detailedBreakdown.hidden[el].length.toString().padStart(4)).join('  ')}
│ Weight: ${ELEMENTS_ORDER.map(el => detailedBreakdown.hidden[el].reduce((s, h) => s + h.weight, 0).toFixed(2).padStart(4)).join('  ')}
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SOURCE DATA OBJECTS                                             │
├─────────────────────────────────────────────────────────────────┤
│ pillars[0].stem:
│   ${JSON.stringify(pillars?.[0]?.stem || null)}
│
│ pillars[0].branch:
│   ${JSON.stringify(pillars?.[0]?.branch || null)}
│
│ pillars[0].hiddenRoots:
│   ${JSON.stringify(pillars?.[0]?.hiddenRoots || null)}
│
│ elements (passed prop):
│   ${JSON.stringify(elements?.percentages || elements || null)}
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CALCULATION AUDIT                                               │
├─────────────────────────────────────────────────────────────────┤
│ Timestamp: ${new Date().toISOString()}
│ Component: ElementCalculationFlaps
│ Data source: pillars prop → detailedBreakdown (useMemo)
│ Explainability level: L3 (Debug/Raw)
│
│ Note: Values calculated client-side from pillar data.
│ Hidden root percentages follow industry-standard BaZi tables.
└─────────────────────────────────────────────────────────────────┘`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementCalculationFlaps;
