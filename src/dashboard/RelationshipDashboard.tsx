/**
 * ============================================================================
 * RELATIONSHIP DASHBOARD (关系仪表盘)
 * ============================================================================
 *
 * The single-screen view showing the living state of a relationship.
 * Combines all major analysis components into one unified dashboard.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Header: Partner Names, Relationship Age, Overall Score                  │
 * ├────────────────────────────────┬────────────────────────────────────────┤
 * │ Synastry Heatmap              │ Composite Summary                       │
 * │ (4x4 grid)                    │ (Day Master, Elements, Archetype)       │
 * ├────────────────────────────────┴────────────────────────────────────────┤
 * │ Destiny Trajectory Curve (full width)                                   │
 * ├────────────────────────────────┬────────────────────────────────────────┤
 * │ Event Windows                 │ Lifecycle Phase + Guidance              │
 * │ (Timeline/List)               │ (Current phase, advice)                 │
 * └────────────────────────────────┴────────────────────────────────────────┘
 *
 * Created: January 2026
 * ============================================================================
 */

import * as React from 'react';
import { useMemo } from 'react';
import type {
  RelationshipDashboardData,
  DashboardOptions,
  SynastryCell,
  EventWindow,
  TrajectoryPoint,
  ElementName
} from './relationshipDashboardTypes';
import {
  DEFAULT_DASHBOARD_OPTIONS,
  ELEMENT_COLORS,
  TIER_COLORS,
  DECISION_TIER_COLORS,
  LIFECYCLE_PHASE_ICONS
} from './relationshipDashboardTypes';

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#fff'
  },
  header: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#111827',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  },
  headerScore: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px'
  },
  row: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px'
  },
  column: {
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    height: '100%'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cardTitleChinese: {
    fontSize: '14px',
    color: '#9ca3af',
    fontWeight: 400
  },
  heatmapGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto repeat(4, 1fr)',
    gap: '4px'
  },
  heatmapCell: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  heatmapLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textAlign: 'center' as const,
    padding: '4px'
  },
  elementBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px'
  },
  elementSegment: {
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  elementLegend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px'
  },
  elementLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280'
  },
  elementDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  phaseCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  phaseIcon: {
    fontSize: '32px'
  },
  phaseInfo: {
    flex: 1
  },
  phaseName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#111827'
  },
  phaseTheme: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px'
  },
  eventList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  eventItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  eventYear: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    minWidth: '50px'
  },
  eventLabel: {
    flex: 1,
    fontSize: '13px',
    color: '#4b5563'
  },
  eventTier: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500
  },
  trajectoryContainer: {
    width: '100%',
    height: '200px',
    position: 'relative' as const
  },
  trajectorySvg: {
    width: '100%',
    height: '100%'
  },
  adviceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  adviceItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '8px 0',
    fontSize: '13px',
    color: '#4b5563'
  },
  adviceIcon: {
    color: '#22c55e',
    marginTop: '2px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 500
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px'
  },
  statItem: {
    textAlign: 'center' as const,
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#111827'
  },
  statLabel: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px'
  }
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface RelationshipDashboardProps {
  data: RelationshipDashboardData;
  options?: Partial<DashboardOptions>;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Header component
 */
const DashboardHeader: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const relationshipYears = useMemo(() => {
    const now = new Date();
    const startYear = Math.min(
      new Date(data.partnerA.birthDate).getFullYear(),
      new Date(data.partnerB.birthDate).getFullYear()
    );
    return now.getFullYear() - startYear;
  }, [data.partnerA.birthDate, data.partnerB.birthDate]);

  return (
    <header style={styles.header}>
      <h1 style={styles.headerTitle}>
        {data.partnerA.name} & {data.partnerB.name}
      </h1>
      <div style={styles.headerSubtitle}>
        {showChinese && '关系仪表盘 · '}
        Relationship Dashboard · Generated {data.generatedAt.toLocaleDateString()}
      </div>
      <div style={styles.headerScore}>
        <span style={{ fontSize: '24px', fontWeight: 600, color: '#16a34a' }}>
          {data.synastrySummary.overallScore}
        </span>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>
          /100 Compatibility
        </span>
        <span style={{ marginLeft: '16px', color: '#6b7280', fontSize: '14px' }}>
          {data.synastrySummary.compatibilityTier.charAt(0).toUpperCase() +
           data.synastrySummary.compatibilityTier.slice(1)} Match
        </span>
      </div>
    </header>
  );
};

/**
 * Synastry Heatmap component
 */
const SynastryHeatmapCard: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const { synastryHeatmap, synastrySummary } = data;
  const pillars = ['Year', 'Month', 'Day', 'Hour'];
  const pillarsChinese = ['年', '月', '日', '时'];

  const getCellColor = (score: number): string => {
    if (score > 15) return '#22c55e';
    if (score > 5) return '#84cc16';
    if (score > 0) return '#a3e635';
    if (score === 0) return '#e5e7eb';
    if (score > -5) return '#fca5a5';
    if (score > -15) return '#f87171';
    return '#ef4444';
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        🔥 Synastry Heatmap
        {showChinese && <span style={styles.cardTitleChinese}>合盘热力图</span>}
      </h3>

      <div style={styles.heatmapGrid}>
        {/* Corner */}
        <div style={styles.heatmapLabel}></div>
        {/* Top labels */}
        {pillars.map((p, i) => (
          <div key={`top-${i}`} style={styles.heatmapLabel}>
            {p}
            {showChinese && <div>{pillarsChinese[i]}</div>}
          </div>
        ))}

        {/* Grid rows */}
        {synastryHeatmap.grid.map((row, rowIdx) => (
          <React.Fragment key={`row-${rowIdx}`}>
            <div style={styles.heatmapLabel}>
              {pillars[rowIdx]}
              {showChinese && <div>{pillarsChinese[rowIdx]}</div>}
            </div>
            {row.map((cell, colIdx) => (
              <div
                key={`cell-${rowIdx}-${colIdx}`}
                style={{
                  ...styles.heatmapCell,
                  backgroundColor: getCellColor(cell.totalScore),
                  color: Math.abs(cell.totalScore) > 10 ? '#fff' : '#374151'
                }}
                title={cell.summary || `Score: ${cell.totalScore}`}
              >
                {cell.totalScore > 0 ? '+' : ''}{cell.totalScore}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.statGrid}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{synastrySummary.harmonyScore}</div>
          <div style={styles.statLabel}>Harmony Points</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{synastrySummary.tensionScore}</div>
          <div style={styles.statLabel}>Tension Points</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composite Summary Card
 */
const CompositeSummaryCard: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const { compositeChart, lifecycle } = data;
  const { dayMaster, elementDistribution, usefulGod, archetype } = compositeChart;

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        💎 Composite Summary
        {showChinese && <span style={styles.cardTitleChinese}>合盘摘要</span>}
      </h3>

      {/* Day Master */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
          Day Master {showChinese && '· 日主'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: ELEMENT_COLORS[dayMaster.element]
          }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            {dayMaster.element}
          </span>
          {showChinese && (
            <span style={{ color: '#6b7280' }}>
              ({dayMaster.chineseName})
            </span>
          )}
          <span style={{
            ...styles.badge,
            backgroundColor: '#f3f4f6',
            color: '#374151'
          }}>
            {dayMaster.strengthCategory.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Element Distribution */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
          Elements {showChinese && '· 五行'}
        </div>
        <div style={styles.elementBar}>
          {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map(el => (
            <div
              key={el}
              style={{
                ...styles.elementSegment,
                width: `${elementDistribution[el]}%`,
                backgroundColor: ELEMENT_COLORS[el.charAt(0).toUpperCase() + el.slice(1) as ElementName]
              }}
              title={`${el.charAt(0).toUpperCase() + el.slice(1)}: ${elementDistribution[el]}%`}
            />
          ))}
        </div>
        <div style={styles.elementLegend}>
          {(['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const).map(el => (
            <div key={el} style={styles.elementLegendItem}>
              <span style={{ ...styles.elementDot, backgroundColor: ELEMENT_COLORS[el] }} />
              <span>{el} {elementDistribution[el.toLowerCase() as keyof typeof elementDistribution]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Useful God */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
          Useful God {showChinese && '· 用神'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: ELEMENT_COLORS[usefulGod.element]
          }} />
          <span style={{ fontWeight: 500 }}>
            {usefulGod.element}
          </span>
          {showChinese && (
            <span style={{ color: '#6b7280' }}>
              ({usefulGod.chineseName})
            </span>
          )}
        </div>
      </div>

      {/* Archetype */}
      {archetype && (
        <div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
            Archetype {showChinese && '· 原型'}
          </div>
          <div style={{ fontWeight: 500 }}>
            {archetype.name}
            {showChinese && (
              <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                ({archetype.chineseName})
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {archetype.description}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Trajectory Curve Card
 */
const TrajectoryCurveCard: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const { trajectory } = data;
  const curve = trajectory.overall;

  const viewBox = '0 0 600 200';
  const padding = 40;
  const width = 600 - padding * 2;
  const height = 200 - padding * 2;

  // Generate path
  const pathD = useMemo(() => {
    if (!curve.points || curve.points.length === 0) return '';

    const minT = Math.min(...curve.points.map(p => p.t));
    const maxT = Math.max(...curve.points.map(p => p.t));
    const rangeT = maxT - minT || 1;

    return curve.points.map((point, i) => {
      const x = padding + ((point.t - minT) / rangeT) * width;
      const y = padding + height - (point.score / 100) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [curve.points, width, height, padding]);

  // Generate area path
  const areaD = useMemo(() => {
    if (!pathD) return '';
    const minT = Math.min(...curve.points.map(p => p.t));
    const maxT = Math.max(...curve.points.map(p => p.t));
    const rangeT = maxT - minT || 1;

    const startX = padding + ((curve.points[0].t - minT) / rangeT) * width;
    const endX = padding + ((curve.points[curve.points.length - 1].t - minT) / rangeT) * width;
    const bottom = padding + height;

    return `${pathD} L ${endX} ${bottom} L ${startX} ${bottom} Z`;
  }, [pathD, curve.points, width, height, padding]);

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        📈 Destiny Trajectory
        {showChinese && <span style={styles.cardTitleChinese}>运势曲线</span>}
      </h3>

      <div style={styles.trajectoryContainer}>
        <svg viewBox={viewBox} style={styles.trajectorySvg}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(score => {
            const y = padding + height - (score / 100) * height;
            return (
              <g key={score}>
                <line
                  x1={padding}
                  y1={y}
                  x2={padding + width}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text x={padding - 8} y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">
                  {score}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="rgba(99, 102, 241, 0.1)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" />

          {/* Current year marker */}
          {curve.currentYear && (
            <g>
              {(() => {
                const minT = Math.min(...curve.points.map(p => p.t));
                const maxT = Math.max(...curve.points.map(p => p.t));
                const rangeT = maxT - minT || 1;
                const x = padding + ((curve.currentYear - minT) / rangeT) * width;
                return (
                  <>
                    <line x1={x} y1={padding} x2={x} y2={padding + height} stroke="#ef4444" strokeDasharray="4,4" />
                    <text x={x} y={padding - 8} fontSize="10" fill="#ef4444" textAnchor="middle">
                      Now
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Peaks */}
          {curve.peaks.map((peak, i) => {
            const minT = Math.min(...curve.points.map(p => p.t));
            const maxT = Math.max(...curve.points.map(p => p.t));
            const rangeT = maxT - minT || 1;
            const x = padding + ((peak.t - minT) / rangeT) * width;
            const y = padding + height - (peak.score / 100) * height;
            return (
              <circle key={`peak-${i}`} cx={x} cy={y} r="4" fill="#22c55e" />
            );
          })}

          {/* Valleys */}
          {curve.valleys.map((valley, i) => {
            const minT = Math.min(...curve.points.map(p => p.t));
            const maxT = Math.max(...curve.points.map(p => p.t));
            const rangeT = maxT - minT || 1;
            const x = padding + ((valley.t - minT) / rangeT) * width;
            const y = padding + height - (valley.score / 100) * height;
            return (
              <circle key={`valley-${i}`} cx={x} cy={y} r="4" fill="#ef4444" />
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          Trend: <span style={{ fontWeight: 500, color: '#374151' }}>{curve.overallTrend}</span>
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          Current Score: <span style={{ fontWeight: 500, color: '#374151' }}>{curve.currentScore}/100</span>
        </div>
      </div>

      {curve.narrative && (
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px', fontStyle: 'italic' }}>
          {curve.narrative}
        </div>
      )}
    </div>
  );
};

/**
 * Event Windows Card
 */
const EventWindowsCard: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const { compositeEvents } = data;
  const allWindows = [
    ...compositeEvents.strongWindows,
    ...compositeEvents.likelyWindows.slice(0, 3)
  ].sort((a, b) => a.year - b.year).slice(0, 6);

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        ⚡ Event Windows
        {showChinese && <span style={styles.cardTitleChinese}>应期窗口</span>}
      </h3>

      <ul style={styles.eventList}>
        {allWindows.map((event, i) => (
          <li key={i} style={styles.eventItem}>
            <span style={styles.eventYear}>{event.year}</span>
            <span style={styles.eventLabel}>
              {event.label}
              {showChinese && event.typeChinese && (
                <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
                  ({event.typeChinese})
                </span>
              )}
            </span>
            <span style={{
              ...styles.eventTier,
              backgroundColor: TIER_COLORS[event.tier] + '20',
              color: TIER_COLORS[event.tier]
            }}>
              {event.tier}
            </span>
          </li>
        ))}
      </ul>

      {compositeEvents.nextStrongEvent && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '4px' }}>
            Next Strong Window
          </div>
          <div style={{ fontWeight: 500 }}>
            {compositeEvents.nextStrongEvent.year}: {compositeEvents.nextStrongEvent.label}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Lifecycle Card
 */
const LifecycleCard: React.FC<{
  data: RelationshipDashboardData;
  showChinese: boolean;
}> = ({ data, showChinese }) => {
  const { lifecycle, decision } = data;

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        🌱 Lifecycle Phase
        {showChinese && <span style={styles.cardTitleChinese}>生命周期</span>}
      </h3>

      <div style={styles.phaseCard}>
        <span style={styles.phaseIcon}>
          {LIFECYCLE_PHASE_ICONS[lifecycle.currentPhase.id]}
        </span>
        <div style={styles.phaseInfo}>
          <div style={styles.phaseName}>
            {lifecycle.currentPhase.name}
            {showChinese && (
              <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '14px' }}>
                ({lifecycle.currentPhase.chineseName})
              </span>
            )}
          </div>
          <div style={styles.phaseTheme}>
            {lifecycle.currentPhase.theme}
          </div>
        </div>
        <div style={{
          ...styles.badge,
          backgroundColor: '#f0fdf4',
          color: '#16a34a'
        }}>
          {lifecycle.currentPhaseScore}%
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
          Phase Progress
        </div>
        <div style={{
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${lifecycle.progress}%`,
            backgroundColor: '#22c55e',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Decision Guidance */}
      <div style={{
        padding: '12px',
        backgroundColor: DECISION_TIER_COLORS[decision.tier] + '10',
        borderRadius: '8px',
        borderLeft: `4px solid ${DECISION_TIER_COLORS[decision.tier]}`
      }}>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
          Current Guidance
        </div>
        <div style={{ fontSize: '14px', color: '#374151' }}>
          {decision.currentAdvice}
        </div>
      </div>

      {/* Advice */}
      {lifecycle.advice.length > 0 && (
        <ul style={{ ...styles.adviceList, marginTop: '16px' }}>
          {lifecycle.advice.slice(0, 3).map((advice, i) => (
            <li key={i} style={styles.adviceItem}>
              <span style={styles.adviceIcon}>✓</span>
              <span>{advice}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Relationship Dashboard
 */
export const RelationshipDashboard: React.FC<RelationshipDashboardProps> = ({
  data,
  options = {}
}) => {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_DASHBOARD_OPTIONS, ...options }),
    [options]
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <DashboardHeader data={data} showChinese={mergedOptions.showChinese} />

      {/* Top Row: Synastry + Composite */}
      <div style={styles.row}>
        <div style={styles.column}>
          {mergedOptions.sections.synastry && (
            <SynastryHeatmapCard data={data} showChinese={mergedOptions.showChinese} />
          )}
        </div>
        <div style={styles.column}>
          {mergedOptions.sections.composite && (
            <CompositeSummaryCard data={data} showChinese={mergedOptions.showChinese} />
          )}
        </div>
      </div>

      {/* Middle Row: Trajectory */}
      {mergedOptions.sections.trajectory && (
        <div style={{ marginBottom: '24px' }}>
          <TrajectoryCurveCard data={data} showChinese={mergedOptions.showChinese} />
        </div>
      )}

      {/* Bottom Row: Events + Lifecycle */}
      <div style={styles.row}>
        <div style={styles.column}>
          {mergedOptions.sections.events && (
            <EventWindowsCard data={data} showChinese={mergedOptions.showChinese} />
          )}
        </div>
        <div style={styles.column}>
          {mergedOptions.sections.lifecycle && (
            <LifecycleCard data={data} showChinese={mergedOptions.showChinese} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipDashboard;
