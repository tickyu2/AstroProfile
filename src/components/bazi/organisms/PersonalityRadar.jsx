/**
 * PersonalityRadar - Enhanced Element Radar Chart using Nivo
 * Beautiful radar visualization with dynamic scaling and element colors
 *
 * Supports two variants:
 * - "raw" (default): Uses dominant element color, circular grid
 * - "adjusted": Uses amber color (matching seasonality overlay), pentagon grid
 */

import React, { useMemo, useState } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { QRCodeSVG } from 'qrcode.react';
import { useBaziTheme, getElementIcon } from '../theme/BaziTheme';
import { PERSONALITY_ARCHETYPES } from '../../../data/personalityArchetypes';

// Element colors matching the Five Elements
const ELEMENT_COLORS = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#a1a1aa',
  Water: '#3b82f6'
};

// Archetype mapping lookup
const ARCHETYPE_MAP = {
  Wood: { null: 1, Fire: 2, Earth: 3, Metal: 4, Water: 5 },
  Fire: { null: 6, Wood: 7, Earth: 8, Metal: 9, Water: 10 },
  Earth: { null: 11, Wood: 12, Fire: 13, Metal: 14, Water: 15 },
  Metal: { null: 16, Wood: 17, Fire: 18, Earth: 19, Water: 20 },
  Water: { null: 21, Wood: 22, Fire: 23, Earth: 24, Metal: 25 }
};

const PersonalityRadar = ({
  data,               // Array of { trait: string, score: number }
  keys = ['score'],
  indexBy = 'trait',
  title = 'Five Elements Profile',
  subtitle = null,    // Optional subtitle below title
  profileName = null, // Optional profile name above title
  birthDate = null,   // Birth date string (e.g., "1964-01-17")
  birthTime = null,   // Birth time string (e.g., "12:00")
  pillars = null,     // Four Pillars data for deeper AI analysis
  showLegend = false,
  height = 450,
  compact = false,
  variant = 'raw',    // 'raw' = dominant element color, 'adjusted' = amber color with pentagon grid
  showElementCode = true,  // Show element code in lower left
  showQRCode = true,  // Show QR code in lower right
  showPersonalitySummary = true,  // Show personality archetype summary
  onRequestAIInsight = null  // Callback for AI-generated deeper insights
}) => {
  const theme = useBaziTheme();
  const isAdjusted = variant === 'adjusted';
  const [aiInsight, setAiInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showFullInsight, setShowFullInsight] = useState(false);

  // Calculate dynamic max value (round up to nearest 5, minimum 40)
  const maxValue = useMemo(() => {
    const maxScore = Math.max(...data.map(d => Number(d.score) || 0));
    const rounded = Math.ceil(maxScore / 5) * 5;
    return Math.max(rounded + 5, 40); // Add padding, minimum 40%
  }, [data]);

  // Enhanced data with element colors
  const enhancedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      score: Number(d.score) || 0,
      color: ELEMENT_COLORS[d.trait] || '#8884d8'
    }));
  }, [data]);

  // Calculate stats
  const stats = useMemo(() => {
    const scores = enhancedData.map(d => d.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const dominant = enhancedData.reduce((max, d) => d.score > max.score ? d : max, enhancedData[0]);
    const weakest = enhancedData.reduce((min, d) => d.score < min.score ? d : min, enhancedData[0]);
    return { total, dominant, weakest };
  }, [enhancedData]);

  // Sorted elements by score (highest to lowest) for ranking legend
  const rankedElements = useMemo(() => {
    return [...enhancedData].sort((a, b) => b.score - a.score);
  }, [enhancedData]);

  // Generate element code (W36F08E39M03W15 format) - Five Element cycle order
  const elementCode = useMemo(() => {
    const elementOrder = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const elementLetters = { Wood: 'W', Fire: 'F', Earth: 'E', Metal: 'M', Water: 'W' };

    return elementOrder.map(element => {
      const item = enhancedData.find(d => d.trait === element);
      const score = item ? Math.round(item.score) : 0;
      const paddedScore = score.toString().padStart(2, '0');
      return `${elementLetters[element]}${paddedScore}`;
    }).join('');
  }, [enhancedData]);

  // Generate QR code data
  const qrCodeData = useMemo(() => {
    const birthInfo = birthDate ? `${birthDate}${birthTime ? ' at ' + birthTime : ''}` : '';
    return birthInfo ? `${birthInfo} ${elementCode}` : elementCode;
  }, [birthDate, birthTime, elementCode]);

  // Determine personality archetype from element balance
  const archetype = useMemo(() => {
    if (!enhancedData || enhancedData.length === 0) return null;

    // Sort by score descending
    const sorted = [...enhancedData].sort((a, b) => b.score - a.score);
    const dominant = sorted[0];
    let secondary = null;

    // Determine secondary element (if within threshold)
    if (dominant.score <= 50 && sorted.length > 1) {
      const secondHighest = sorted[1];
      const diff = dominant.score - secondHighest.score;
      if (secondHighest.score >= 15 && diff <= 30) {
        secondary = secondHighest.trait;
      }
    }

    // Look up archetype
    const archetypeId = ARCHETYPE_MAP[dominant.trait]?.[secondary];
    return archetypeId ? PERSONALITY_ARCHETYPES[archetypeId] : null;
  }, [enhancedData]);

  // Handler for requesting AI insights
  const handleRequestInsight = async () => {
    if (!onRequestAIInsight) return;

    setIsLoadingInsight(true);
    try {
      const insightData = {
        elementCode,
        archetype: archetype?.name,
        elements: enhancedData.reduce((acc, d) => ({ ...acc, [d.trait]: d.score }), {}),
        pillars,
        birthDate,
        birthTime,
        profileName
      };
      const result = await onRequestAIInsight(insightData);
      setAiInsight(result);
      setShowFullInsight(true);
    } catch (error) {
      console.error('Failed to get AI insight:', error);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Determine the primary color based on dominant element (always matches dominant, regardless of variant)
  const primaryColor = ELEMENT_COLORS[stats.dominant?.trait] || '#f59e0b';

  const styles = {
    container: {
      background: `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.cardLight}40 100%)`,
      borderRadius: theme.radius.xl,
      border: `1px solid ${theme.colors.border}`,
      padding: compact ? 16 : 24,
      position: 'relative',
      overflow: 'hidden'
    },
    glow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      height: '60%',
      background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 0
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: compact ? 8 : 16,
      position: 'relative',
      zIndex: 1
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    },
    profileRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    },
    profileName: {
      fontSize: compact ? '0.75rem' : '0.85rem',
      color: primaryColor,
      fontWeight: 600
    },
    birthInfo: {
      fontSize: compact ? '0.65rem' : '0.75rem',
      color: theme.colors.muted,
      fontWeight: 400,
      fontStyle: 'italic'
    },
    title: {
      fontSize: compact ? '0.8rem' : '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: theme.colors.text,
      fontWeight: 700
    },
    subtitle: {
      fontSize: compact ? '0.65rem' : '0.7rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: theme.colors.muted,
      fontWeight: 500,
      marginTop: 2
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 20,
      background: `${primaryColor}25`,
      border: `1px solid ${primaryColor}50`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: primaryColor
    },
    chartContainer: {
      height: compact ? height * 0.8 : height,
      position: 'relative',
      zIndex: 1
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: compact ? 16 : 32,
      marginTop: compact ? 12 : 20,
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 1
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    },
    statIcon: {
      fontSize: compact ? '1.2rem' : '1.5rem'
    },
    statValue: {
      fontSize: compact ? '1rem' : '1.2rem',
      fontWeight: 700,
      color: theme.colors.text
    },
    statLabel: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.05em'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: compact ? 12 : 20,
      padding: '12px 0 0 0',
      borderTop: `1px solid ${theme.colors.border}`,
      position: 'relative',
      zIndex: 1
    },
    elementCodeContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    },
    elementCodeLabel: {
      fontSize: '0.6rem',
      color: theme.colors.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    elementCode: {
      fontFamily: 'monospace',
      fontSize: compact ? '0.75rem' : '0.85rem',
      color: theme.colors.text,
      fontWeight: 600,
      letterSpacing: '0.1em',
      background: `${theme.colors.border}50`,
      padding: '4px 8px',
      borderRadius: 4
    },
    qrContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    },
    qrLabel: {
      fontSize: '0.55rem',
      color: theme.colors.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    qrWrapper: {
      padding: 6,
      background: '#fff',
      borderRadius: 6,
      boxShadow: theme.shadows.sm
    },
    // Personality Summary styles
    personalitySummary: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: '0 16px',
      maxWidth: '60%'
    },
    archetypeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    archetypeSymbol: {
      fontSize: compact ? '1.2rem' : '1.5rem'
    },
    archetypeName: {
      fontSize: compact ? '0.85rem' : '1rem',
      fontWeight: 700,
      color: primaryColor,
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    archetypeKeywords: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    },
    keyword: {
      fontSize: '0.6rem',
      padding: '2px 8px',
      borderRadius: 12,
      background: `${primaryColor}20`,
      color: primaryColor,
      fontWeight: 500
    },
    archetypeDescription: {
      fontSize: compact ? '0.7rem' : '0.75rem',
      color: theme.colors.textSecondary,
      lineHeight: 1.5,
      fontStyle: 'italic'
    },
    moreButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
      padding: '6px 12px',
      fontSize: '0.65rem',
      fontWeight: 600,
      color: theme.colors.text,
      background: `${primaryColor}30`,
      border: `1px solid ${primaryColor}50`,
      borderRadius: 6,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      alignSelf: 'flex-start'
    },
    aiInsightPanel: {
      marginTop: 12,
      padding: 16,
      background: `linear-gradient(135deg, ${theme.colors.card} 0%, ${primaryColor}10 100%)`,
      borderRadius: theme.radius.lg,
      border: `1px solid ${primaryColor}40`
    },
    aiInsightHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12
    },
    aiInsightTitle: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: primaryColor,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    aiInsightClose: {
      fontSize: '0.7rem',
      color: theme.colors.muted,
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: 4,
      background: theme.colors.border
    },
    aiInsightText: {
      fontSize: '0.75rem',
      color: theme.colors.text,
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: 12,
      height: 12,
      border: `2px solid ${theme.colors.border}`,
      borderTopColor: primaryColor,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    // Chart with legend layout
    chartWithLegend: {
      position: 'relative',
      zIndex: 1
    },
    chartWrapper: {
      height: compact ? height * 0.8 : height
    },
    // Ranking Legend Box - Vertical layout below stats row
    rankingLegend: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: compact ? '16px 20px' : '20px 28px',
      marginTop: 16,
      background: `${theme.colors.card}80`,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadows.sm
    },
    rankingHeader: {
      fontSize: compact ? '0.7rem' : '0.75rem',
      color: theme.colors.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      fontWeight: 600
    },
    rankingRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 6 : 8,
      width: '100%',
      maxWidth: 280
    },
    rankingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 10 : 12,
      padding: compact ? '8px 12px' : '10px 16px',
      background: `${theme.colors.card}60`,
      border: `1px solid ${theme.colors.border}50`,
      borderRadius: theme.radius.md
    },
    rankingItemFirst: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 10 : 12,
      padding: compact ? '8px 12px' : '10px 16px',
      background: `${primaryColor}15`,
      border: `1px solid ${primaryColor}40`,
      borderRadius: theme.radius.md
    },
    rankingPosition: {
      fontSize: compact ? '0.7rem' : '0.75rem',
      color: theme.colors.muted,
      fontWeight: 700,
      width: 18,
      textAlign: 'center'
    },
    rankingIcon: {
      fontSize: compact ? '1.1rem' : '1.25rem'
    },
    rankingName: {
      flex: 1,
      fontSize: compact ? '0.8rem' : '0.85rem',
      fontWeight: 600
    },
    rankingValue: {
      fontSize: compact ? '0.85rem' : '0.95rem',
      fontWeight: 700,
      fontFamily: 'monospace'
    }
  };

  // Nivo theme
  const nivoTheme = {
    background: 'transparent',
    textColor: theme.colors.text,
    fontSize: compact ? 11 : 13,
    axis: {
      ticks: {
        text: {
          fill: theme.colors.textSecondary,
          fontSize: compact ? 10 : 12
        }
      }
    },
    grid: {
      line: {
        stroke: `${primaryColor}40`,
        strokeWidth: 1.5,
        strokeOpacity: 0.8
      }
    },
    dots: {
      text: {
        fill: theme.colors.text,
        fontSize: compact ? 10 : 12,
        fontWeight: 600
      }
    },
    tooltip: {
      container: {
        background: theme.colors.card,
        color: theme.colors.text,
        fontSize: 13,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: `1px solid ${theme.colors.border}`
      }
    }
  };

  // Custom colors - use primary color based on variant
  const chartColors = [`${primaryColor}cc`];

  // Custom grid label component with element-specific colors
  const CustomGridLabel = ({ id, anchor, x, y }) => {
    const elementColor = ELEMENT_COLORS[id] || theme.colors.text;
    return (
      <g transform={`translate(${x}, ${y})`}>
        <text
          style={{
            fontSize: compact ? 13 : 15,
            fontWeight: 700,
            fill: elementColor,
            textAnchor: anchor,
            dominantBaseline: 'central',
            textShadow: `0 0 8px ${elementColor}40`
          }}
        >
          {id}
        </text>
      </g>
    );
  };

  // Custom layer to draw thick outermost pentagon
  const OuterPentagonLayer = (props) => {
    const { radiusScale, angleStep, centerX, centerY } = props;
    if (!radiusScale || angleStep === undefined) return null;

    const radius = radiusScale(maxValue);
    const numPoints = enhancedData.length;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (Math.PI / 2) - (i * angleStep);
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY - Math.sin(angle) * radius
      });
    }

    const pathD = points.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';

    return (
      <path
        d={pathD}
        fill="none"
        stroke={`${primaryColor}80`}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    );
  };

  return (
    <div style={styles.container}>
      {/* Background glow */}
      <div style={styles.glow} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {(profileName || birthDate) && (
            <div style={styles.profileRow}>
              {profileName && <span style={styles.profileName}>{profileName}</span>}
              {birthDate && (
                <span style={styles.birthInfo}>
                  Born: {birthDate}{birthTime ? ` at ${birthTime}` : ''}
                </span>
              )}
            </div>
          )}
          <span style={styles.title}>{title}</span>
          {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
        </div>
        <div style={styles.badge}>
          <span>{getElementIcon(stats.dominant?.trait)}</span>
          <span>{stats.dominant?.trait} Dominant</span>
        </div>
      </div>

      {/* Nivo Radar Chart with Ranking Legend */}
      <div style={styles.chartWithLegend}>
        <div style={styles.chartWrapper}>
          <ResponsiveRadar
            data={enhancedData}
            keys={keys}
            indexBy={indexBy}
            maxValue={maxValue}
            valueFormat={v => `${v.toFixed(1)}%`}
            margin={{
              top: compact ? 30 : 40,
              right: compact ? 50 : 70,
              bottom: compact ? 30 : 40,
              left: compact ? 50 : 70
            }}
            curve="linearClosed"
            borderWidth={3}
            borderColor={primaryColor}
            gridLevels={5}
            gridShape="linear"
            gridLabelOffset={compact ? 24 : 32}
            enableDots={true}
            dotSize={compact ? 10 : 14}
            dotColor={theme.colors.card}
            dotBorderWidth={3}
            dotBorderColor={primaryColor}
          enableDotLabel={true}
          dotLabel={d => `${d.value.toFixed(0)}%`}
          dotLabelYOffset={-12}
          colors={chartColors}
          fillOpacity={0.35}
          blendMode="normal"
          animate={true}
          motionConfig="gentle"
          theme={nivoTheme}
          gridLabel={CustomGridLabel}
          layers={['grid', OuterPentagonLayer, 'layers', 'slices', 'dots', 'legends']}
          sliceTooltip={({ index, data: sliceData }) => {
            const item = enhancedData.find(d => d.trait === index);
            return (
              <div style={{
                padding: '12px 16px',
                background: theme.colors.card,
                border: `2px solid ${item?.color || theme.colors.border}`,
                borderRadius: 12,
                minWidth: 140
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{getElementIcon(index)}</span>
                  <strong style={{
                    color: item?.color || theme.colors.text,
                    fontSize: '1.1rem'
                  }}>
                    {index}
                  </strong>
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: theme.colors.text
                }}>
                  {item?.score.toFixed(1)}%
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: theme.colors.muted,
                  marginTop: 4,
                  textTransform: 'uppercase'
                }}>
                  of total composition
                </div>
              </div>
            );
          }}
          />
        </div>

      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        {enhancedData.map(item => (
          <div key={item.trait} style={styles.statItem}>
            <span style={{
              ...styles.statIcon,
              filter: item.trait === stats.dominant?.trait ? 'drop-shadow(0 0 8px currentColor)' : 'none'
            }}>
              {getElementIcon(item.trait)}
            </span>
            <span style={{
              ...styles.statValue,
              color: item.color,
              textShadow: item.trait === stats.dominant?.trait ? `0 0 12px ${item.color}` : 'none'
            }}>
              {item.score.toFixed(1)}%
            </span>
            <span style={{...styles.statLabel, color: item.color}}>{item.trait}</span>
          </div>
        ))}
      </div>

      {/* Element Ranking - Vertical below stats (high to low) */}
      <div style={styles.rankingLegend}>
        <div style={styles.rankingHeader}>Element Ranking</div>
        <div style={styles.rankingRow}>
          {rankedElements.map((item, index) => (
            <div
              key={item.trait}
              style={index === 0 ? styles.rankingItemFirst : styles.rankingItem}
            >
              <span style={styles.rankingPosition}>{index + 1}</span>
              <span style={styles.rankingIcon}>{getElementIcon(item.trait)}</span>
              <span style={{...styles.rankingName, color: item.color}}>{item.trait}</span>
              <span style={{...styles.rankingValue, color: item.color}}>
                {Math.round(item.score)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Element Code, Personality Summary & QR Code */}
      {(showElementCode || showQRCode || showPersonalitySummary) && (
        <div style={styles.footer}>
          {/* Element Code - Lower Left */}
          {showElementCode && (
            <div style={styles.elementCodeContainer}>
              <span style={styles.elementCodeLabel}>Element Fingerprint</span>
              <span style={styles.elementCode}>{elementCode}</span>
            </div>
          )}

          {/* Personality Summary - Center */}
          {showPersonalitySummary && archetype && (
            <div style={styles.personalitySummary}>
              <div style={styles.archetypeHeader}>
                <span style={styles.archetypeSymbol}>{archetype.symbol}</span>
                <span style={styles.archetypeName}>{archetype.name}</span>
              </div>
              <div style={styles.archetypeKeywords}>
                {archetype.keywords?.slice(0, 4).map((kw, i) => (
                  <span key={i} style={styles.keyword}>{kw}</span>
                ))}
              </div>
              <div style={styles.archetypeDescription}>
                {archetype.description}
              </div>
              {onRequestAIInsight && (
                <button
                  style={styles.moreButton}
                  onClick={handleRequestInsight}
                  disabled={isLoadingInsight}
                >
                  {isLoadingInsight ? (
                    <>
                      <span style={styles.loadingSpinner} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      More Insights
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* QR Code - Lower Right */}
          {showQRCode && (
            <div style={styles.qrContainer}>
              <span style={styles.qrLabel}>Scan Profile</span>
              <div style={styles.qrWrapper}>
                <QRCodeSVG
                  value={qrCodeData}
                  size={compact ? 56 : 72}
                  level="M"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insight Panel - Expandable */}
      {showFullInsight && aiInsight && (
        <div style={styles.aiInsightPanel}>
          <div style={styles.aiInsightHeader}>
            <span style={styles.aiInsightTitle}>
              <span>🔮</span>
              AI Personality Analysis
            </span>
            <span
              style={styles.aiInsightClose}
              onClick={() => setShowFullInsight(false)}
            >
              Close
            </span>
          </div>
          <div style={styles.aiInsightText}>
            {aiInsight}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityRadar;
