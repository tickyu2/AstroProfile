/**
 * Seasonality Lesson - Khan Academy-Style Step-Through UI
 *
 * A 12-section learning experience showing how a birth sign
 * experiences each seasonal subdivision throughout the year.
 *
 * Features:
 * - Previous/Next navigation
 * - Jump to Today button
 * - Birth season highlighting
 * - Current season highlighting
 * - Resonance score visualization
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  buildSeasonalityReport,
  SeasonalityReport,
  SeasonalGuidanceSection,
} from '../seasonalityGuidance';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

interface SeasonalityLessonProps {
  birthDate: Date;
  todayDate?: Date;
  onClose?: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getResonanceColor(level: string): string {
  switch (level) {
    case 'high': return '#22c55e';        // Green
    case 'moderate': return '#3b82f6';    // Blue
    case 'low': return '#f59e0b';         // Amber
    case 'challenging': return '#ef4444'; // Red
    default: return '#6b7280';            // Gray
  }
}

function getSeasonEmoji(season: string): string {
  switch (season) {
    case 'Spring': return '🌸';
    case 'Summer': return '☀️';
    case 'Autumn': return '🍂';
    case 'Winter': return '❄️';
    default: return '🌍';
  }
}

function getPhaseIcon(phase: string): string {
  switch (phase) {
    case 'begin': return '🔥';  // Spark
    case 'core': return '⚡';   // Fuel
    case 'end': return '💨';    // Smoke
    default: return '•';
  }
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '16px',
  } as React.CSSProperties,

  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#f0f0f0',
    margin: '0 0 8px 0',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  } as React.CSSProperties,

  yearTheme: {
    fontSize: '16px',
    color: '#a78bfa',
    fontStyle: 'italic',
    marginTop: '12px',
  } as React.CSSProperties,

  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
  } as React.CSSProperties,

  navButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
    backgroundColor: '#374151',
    color: '#f0f0f0',
  } as React.CSSProperties,

  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,

  todayButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#8b5cf6',
    color: '#fff',
  } as React.CSSProperties,

  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  progressDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  } as React.CSSProperties,

  card: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#f0f0f0',
    margin: 0,
  } as React.CSSProperties,

  cardMeta: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '4px',
  } as React.CSSProperties,

  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
  } as React.CSSProperties,

  section: {
    marginBottom: '20px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '10px',
  } as React.CSSProperties,

  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  } as React.CSSProperties,

  listItem: {
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#e5e7eb',
    fontSize: '15px',
    lineHeight: 1.5,
  } as React.CSSProperties,

  affirmation: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderLeft: '4px solid #8b5cf6',
    padding: '16px',
    borderRadius: '0 8px 8px 0',
    marginTop: '16px',
  } as React.CSSProperties,

  affirmationText: {
    color: '#c4b5fd',
    fontStyle: 'italic',
    fontSize: '16px',
    margin: 0,
    lineHeight: 1.6,
  } as React.CSSProperties,

  tags: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  } as React.CSSProperties,

  tag: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
  } as React.CSSProperties,

  resonanceMeter: {
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    marginTop: '8px',
    overflow: 'hidden',
  } as React.CSSProperties,

  resonanceFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease-out',
  } as React.CSSProperties,

  geometryBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  } as React.CSSProperties,

  geometryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,

  geometrySymbol: {
    fontSize: '32px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: '50%',
  } as React.CSSProperties,

  geometryTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#a5b4fc',
    margin: 0,
  } as React.CSSProperties,

  geometryDegrees: {
    fontSize: '13px',
    color: '#818cf8',
    margin: 0,
  } as React.CSSProperties,

  geometryText: {
    fontSize: '14px',
    color: '#c7d2fe',
    lineHeight: 1.7,
    margin: '0 0 12px 0',
  } as React.CSSProperties,

  geometryLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6366f1',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px',
  } as React.CSSProperties,
};

// =============================================================================
// SECTION CARD COMPONENT
// =============================================================================

interface SectionCardProps {
  section: SeasonalGuidanceSection;
  birthSign: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, birthSign }) => {
  const resonanceColor = getResonanceColor(section.resonance.level);

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>
            {getSeasonEmoji(section.season)} {section.title}
          </h3>
          <p style={styles.cardMeta}>
            {getPhaseIcon(section.phase)} {section.dateRange}
          </p>
          <div style={styles.tags}>
            {section.isCurrent && (
              <span style={{ ...styles.tag, backgroundColor: '#22c55e', color: '#fff' }}>
                Current
              </span>
            )}
            {section.isBirthSeason && (
              <span style={{ ...styles.tag, backgroundColor: '#f59e0b', color: '#fff' }}>
                Your Season
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <span style={{ ...styles.badge, backgroundColor: resonanceColor }}>
            {section.resonance.level.charAt(0).toUpperCase() + section.resonance.level.slice(1)} Resonance
          </span>
          <div style={styles.resonanceMeter}>
            <div
              style={{
                ...styles.resonanceFill,
                width: `${section.resonance.score}%`,
                backgroundColor: resonanceColor,
              }}
            />
          </div>
          <p style={{ ...styles.cardMeta, marginTop: '4px' }}>
            {section.resonance.score}%
          </p>
        </div>
      </div>

      {/* How You Feel */}
      <div style={styles.section}>
        <h4 style={{ ...styles.sectionTitle, color: '#60a5fa' }}>
          How {birthSign} Feels
        </h4>
        <ul style={styles.list}>
          {section.howYouFeel.map((item, i) => (
            <li key={i} style={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* What To Do */}
      <div style={styles.section}>
        <h4 style={{ ...styles.sectionTitle, color: '#4ade80' }}>
          What To Do
        </h4>
        <ul style={styles.list}>
          {section.whatToDo.map((item, i) => (
            <li key={i} style={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Watch Out For */}
      <div style={styles.section}>
        <h4 style={{ ...styles.sectionTitle, color: '#fbbf24' }}>
          Watch Out For
        </h4>
        <ul style={styles.list}>
          {section.watchOutFor.map((item, i) => (
            <li key={i} style={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Aspect Geometry - The "Why" Layer */}
      <div style={styles.geometryBox}>
        <div style={styles.geometryHeader}>
          <div style={styles.geometrySymbol}>
            {section.aspectGeometry.symbol}
          </div>
          <div>
            <h4 style={styles.geometryTitle}>
              Why It Feels This Way: {section.aspectGeometry.aspectName}
            </h4>
            <p style={styles.geometryDegrees}>
              {section.aspectGeometry.degrees}° from your natal {birthSign}
            </p>
          </div>
        </div>

        <div style={styles.geometryLabel}>The Felt Sense</div>
        <p style={styles.geometryText}>
          {section.aspectGeometry.whyItFeels}
        </p>

        <div style={styles.geometryLabel}>The Structural Reason</div>
        <p style={styles.geometryText}>
          {section.aspectGeometry.structuralReason}
        </p>

        <div style={styles.geometryLabel}>How to Use This Consciously</div>
        <p style={{ ...styles.geometryText, margin: 0 }}>
          {section.aspectGeometry.consciousUse}
        </p>
      </div>

      {/* Affirmation */}
      <div style={styles.affirmation}>
        <p style={styles.affirmationText}>
          "{section.affirmation}"
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SeasonalityLesson: React.FC<SeasonalityLessonProps> = ({
  birthDate,
  todayDate = new Date(),
  onClose,
}) => {
  // Generate the full report
  const report: SeasonalityReport = useMemo(
    () => buildSeasonalityReport(birthDate, todayDate),
    [birthDate, todayDate]
  );

  // Track current viewed section
  const [currentIndex, setCurrentIndex] = useState(report.currentSectionIndex);

  const currentSection = report.sections[currentIndex];

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : 11));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < 11 ? prev + 1 : 0));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentIndex(report.currentSectionIndex);
  }, [report.currentSectionIndex]);

  const goToSection = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          Your Seasonal Journey as {report.birthSign}
        </h2>
        <p style={styles.subtitle}>
          Step through 12 seasons to understand how cosmic rhythms affect you
        </p>
        <p style={styles.yearTheme}>{report.yearTheme}</p>
      </div>

      {/* Progress Dots */}
      <div style={styles.progressContainer}>
        {report.sections.map((section, index) => {
          const isActive = index === currentIndex;
          const isCurrent = section.isCurrent;
          const isBirth = section.isBirthSeason;
          const resonanceColor = getResonanceColor(section.resonance.level);

          return (
            <div
              key={index}
              onClick={() => goToSection(index)}
              style={{
                ...styles.progressDot,
                backgroundColor: isActive ? resonanceColor : 'rgba(255,255,255,0.1)',
                borderColor: isCurrent ? '#22c55e' : isBirth ? '#f59e0b' : 'transparent',
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
              }}
              title={`${section.sign} - ${section.season} ${section.phase}`}
            >
              {getSeasonEmoji(section.season)}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button
          onClick={goToPrevious}
          style={styles.navButton}
        >
          ← Previous
        </button>

        <button
          onClick={goToToday}
          style={{
            ...styles.todayButton,
            opacity: currentIndex === report.currentSectionIndex ? 0.5 : 1,
          }}
        >
          Jump to Today
        </button>

        <button
          onClick={goToNext}
          style={styles.navButton}
        >
          Next →
        </button>
      </div>

      {/* Current Section Card */}
      <SectionCard section={currentSection} birthSign={report.birthSign} />

      {/* Section Counter */}
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        Section {currentIndex + 1} of 12
      </div>

      {/* Close Button (if provided) */}
      {onClose && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              ...styles.navButton,
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Close Lesson
          </button>
        </div>
      )}
    </div>
  );
};

export default SeasonalityLesson;
