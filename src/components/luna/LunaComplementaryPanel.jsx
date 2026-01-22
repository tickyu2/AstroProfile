/**
 * LunaComplementaryPanel - Displays Luna's Complementary Profile for a User
 * =========================================================================
 *
 * Shows how Luna's constitution complements the user's elemental profile
 * with love languages, interaction style, and compatibility visualization.
 */

import React, { useMemo } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveBar } from '@nivo/bar';
import { calculateLunaProfile, visualizeLunaUser } from '../../services/lunaComplementaryService';

// Element colors and icons
const ELEMENT_CONFIG = {
  Wood: { color: '#22c55e', icon: '🌳', chinese: '木' },
  Fire: { color: '#ef4444', icon: '🔥', chinese: '火' },
  Earth: { color: '#f59e0b', icon: '🏔️', chinese: '土' },
  Metal: { color: '#a1a1aa', icon: '⚔️', chinese: '金' },
  Water: { color: '#3b82f6', icon: '💧', chinese: '水' }
};

const LunaComplementaryPanel = ({
  userElements,  // { wood, fire, earth, metal, water } as percentages
  userName = "You",
  showDetails = true
}) => {
  // Calculate Luna's complementary profile
  const profile = useMemo(() => {
    try {
      return calculateLunaProfile(userElements);
    } catch (error) {
      console.error('Luna calculation error:', error);
      return null;
    }
  }, [userElements]);

  // Prepare comparison data for radar chart
  const radarData = useMemo(() => {
    if (!profile) return [];
    return visualizeLunaUser(profile.user, profile.luna.elements);
  }, [profile]);

  // Prepare bar chart data
  const barData = useMemo(() => {
    if (!profile) return [];
    return ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => {
      const key = element.toLowerCase();
      return {
        element,
        icon: ELEMENT_CONFIG[element].icon,
        [userName]: profile.user[key] || 0,
        Luna: profile.luna.elements[key] || 0,
        [`${userName}Color`]: ELEMENT_CONFIG[element].color,
        LunaColor: '#a855f7'
      };
    });
  }, [profile, userName]);

  if (!profile) {
    return (
      <div style={styles.error}>
        Unable to calculate Luna profile. Please check element values.
      </div>
    );
  }

  const { luna, compatibility, loveLanguages, interaction } = profile;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>Luna's Complementary Profile</h2>
          <p style={styles.subtitle}>Calculated to complement {userName}'s constitution</p>
        </div>
        <div style={styles.scoreSection}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreValue}>{compatibility.score.toFixed(0)}</span>
            <span style={styles.scoreLabel}>Match</span>
          </div>
        </div>
      </div>

      {/* Luna's Constitution Summary */}
      <div style={styles.lunaCard}>
        <div style={styles.lunaHeader}>
          <span style={styles.lunaIcon}>🌙</span>
          <div>
            <div style={styles.lunaName}>Luna's Constitution</div>
            <div style={styles.lunaCode}>{luna.elementString}</div>
          </div>
        </div>

        <div style={styles.lunaElements}>
          {['water', 'earth', 'fire', 'wood', 'metal'].map(element => {
            const config = ELEMENT_CONFIG[element.charAt(0).toUpperCase() + element.slice(1)];
            const value = luna.elements[element];
            const isPrimary = element === luna.dominantElement.element;
            const isSecondary = element === luna.secondaryElement.element;

            return (
              <div key={element} style={{
                ...styles.elementItem,
                borderColor: isPrimary ? config.color : (isSecondary ? `${config.color}80` : 'transparent'),
                borderWidth: isPrimary ? 2 : (isSecondary ? 1 : 0)
              }}>
                <span style={styles.elementIcon}>{config.icon}</span>
                <span style={styles.elementName}>{config.chinese}</span>
                <span style={{
                  ...styles.elementValue,
                  color: config.color,
                  fontWeight: isPrimary || isSecondary ? 700 : 500
                }}>
                  {value.toFixed(0)}%
                </span>
                {isPrimary && <span style={styles.badge}>PRIMARY</span>}
                {isSecondary && <span style={{...styles.badge, backgroundColor: '#6b7280'}}>SECONDARY</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Radar Chart */}
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Constitution Comparison</h3>
        <div style={styles.radarContainer}>
          <ResponsiveRadar
            data={radarData.map(d => ({
              element: `${ELEMENT_CONFIG[d.element].icon} ${d.element}`,
              [userName]: d.user,
              Luna: d.luna
            }))}
            keys={[userName, 'Luna']}
            indexBy="element"
            maxValue={50}
            margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{ from: 'color' }}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={20}
            enableDots={true}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            dotBorderColor={{ from: 'color' }}
            enableDotLabel={false}
            colors={['#8b5cf6', '#f472b6']}
            fillOpacity={0.25}
            blendMode="normal"
            animate={true}
            motionConfig="gentle"
            legends={[
              {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#fff'
                    }
                  }
                ]
              }
            ]}
            theme={{
              background: 'transparent',
              textColor: '#9ca3af',
              grid: {
                line: {
                  stroke: '#374151',
                  strokeWidth: 1
                }
              }
            }}
          />
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Element Distribution</h3>
        <div style={styles.barContainer}>
          <ResponsiveBar
            data={barData}
            keys={[userName, 'Luna']}
            indexBy="element"
            margin={{ top: 30, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={['#8b5cf6', '#f472b6']}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
              format: (value) => `${ELEMENT_CONFIG[value]?.icon || ''} ${value}`
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Percentage',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            animate={true}
            motionConfig="gentle"
            theme={{
              background: 'transparent',
              textColor: '#9ca3af',
              axis: {
                ticks: {
                  text: {
                    fontSize: 12
                  }
                }
              },
              grid: {
                line: {
                  stroke: '#374151',
                  strokeWidth: 1
                }
              }
            }}
          />
        </div>
      </div>

      {showDetails && (
        <>
          {/* Primary Role */}
          <div style={styles.roleCard}>
            <h3 style={styles.sectionTitle}>Luna's Primary Role</h3>
            <div style={styles.roleName}>{interaction.primaryRole}</div>
            <div style={styles.roleEnergy}>
              <strong>Energy:</strong> {interaction.energy}
            </div>
          </div>

          {/* Love Languages */}
          <div style={styles.loveLanguagesSection}>
            <h3 style={styles.sectionTitle}>Love Language Exchange</h3>
            <div style={styles.loveLanguagesGrid}>
              <div style={styles.loveLanguageCard}>
                <div style={styles.llHeader}>🌙 Luna GIVES</div>
                {loveLanguages.lunaGives.map((lang, i) => (
                  <div key={i} style={styles.llItem}>{lang}</div>
                ))}
              </div>
              <div style={styles.loveLanguageCard}>
                <div style={styles.llHeader}>💜 {userName} RECEIVES</div>
                {loveLanguages.userReceives.map((lang, i) => (
                  <div key={i} style={styles.llItem}>{lang}</div>
                ))}
              </div>
              <div style={styles.loveLanguageCard}>
                <div style={styles.llHeader}>💜 {userName} GIVES</div>
                {loveLanguages.userGives.map((lang, i) => (
                  <div key={i} style={styles.llItem}>{lang}</div>
                ))}
              </div>
              <div style={styles.loveLanguageCard}>
                <div style={styles.llHeader}>🌙 Luna RECEIVES</div>
                {loveLanguages.lunaReceives.map((lang, i) => (
                  <div key={i} style={styles.llItem}>{lang}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Communication Style */}
          <div style={styles.commSection}>
            <h3 style={styles.sectionTitle}>Communication Style</h3>
            <div style={styles.commList}>
              {interaction.communicationStyle.map((style, i) => (
                <div key={i} style={styles.commItem}>{style}</div>
              ))}
            </div>
          </div>

          {/* Neurochemicals */}
          <div style={styles.neuroSection}>
            <h3 style={styles.sectionTitle}>Neurochemical Targets</h3>
            <div style={styles.neuroList}>
              {interaction.neurochemicals.map((neuro, i) => (
                <div key={i} style={styles.neuroItem}>
                  <span style={styles.neuroIcon}>{i === 0 ? '🧬' : '💫'}</span>
                  {neuro}
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Assessment */}
          <div style={styles.assessmentCard}>
            <div style={styles.assessmentHeader}>
              <span>Compatibility Assessment</span>
              <span style={styles.overlapBadge}>
                {compatibility.totalOverlap.toFixed(0)}% overlap
              </span>
            </div>
            <div style={styles.assessmentText}>
              {compatibility.assessment}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    borderRadius: 24,
    padding: 32,
    color: '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },

  error: {
    padding: 24,
    color: '#ef4444',
    textAlign: 'center'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32
  },

  titleSection: {
    flex: 1
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(90deg, #c4b5fd 0%, #f9a8d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8
  },

  scoreSection: {
    marginLeft: 24
  },

  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
  },

  scoreValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff'
  },

  scoreLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.1em'
  },

  lunaCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },

  lunaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },

  lunaIcon: {
    fontSize: 40
  },

  lunaName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#f9a8d4'
  },

  lunaCode: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'monospace',
    marginTop: 4
  },

  lunaElements: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap'
  },

  elementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'solid',
    position: 'relative'
  },

  elementIcon: {
    fontSize: 20
  },

  elementName: {
    fontSize: 16,
    fontWeight: 600
  },

  elementValue: {
    fontSize: 16
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 700,
    backgroundColor: '#8b5cf6',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  chartSection: {
    marginBottom: 32
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#c4b5fd',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },

  radarContainer: {
    height: 400,
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16
  },

  barContainer: {
    height: 300,
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16
  },

  roleCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderLeft: '4px solid #8b5cf6'
  },

  roleName: {
    fontSize: 20,
    fontWeight: 600,
    color: '#f9a8d4',
    marginBottom: 12
  },

  roleEnergy: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 1.6
  },

  loveLanguagesSection: {
    marginBottom: 24
  },

  loveLanguagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16
  },

  loveLanguageCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },

  llHeader: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#c4b5fd',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },

  llItem: {
    fontSize: 13,
    color: '#e5e7eb',
    marginBottom: 6,
    paddingLeft: 8,
    borderLeft: '2px solid #8b5cf680'
  },

  commSection: {
    marginBottom: 24
  },

  commList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },

  commItem: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    fontSize: 14,
    color: '#e5e7eb'
  },

  neuroSection: {
    marginBottom: 24
  },

  neuroList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },

  neuroItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    borderRadius: 12,
    fontSize: 14
  },

  neuroIcon: {
    fontSize: 20
  },

  assessmentCard: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(139, 92, 246, 0.3)'
  },

  assessmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 600,
    color: '#c4b5fd'
  },

  overlapBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    background: 'rgba(139, 92, 246, 0.3)',
    fontSize: 12
  },

  assessmentText: {
    fontSize: 16,
    color: '#e5e7eb',
    lineHeight: 1.6
  }
};

export default LunaComplementaryPanel;
