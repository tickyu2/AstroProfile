/**
 * ModeAwareTimeline.jsx
 *
 * A timeline component that adapts its visualization style
 * based on the current Cathedral mode.
 *
 * - Pilgrim: Mythic journey with milestones and chapters
 * - Scholar: Annotated timeline with references and citations
 * - Architect: Technical timeline with data points and metrics
 * - Sovereign: Strategic timeline with decision windows
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMode, CATHEDRAL_MODES } from './modeSystem';

// ============================================================================
// TIMELINE CONFIGURATION PER MODE
// ============================================================================

const TIMELINE_CONFIGS = {
  pilgrim: {
    name: 'Journey Timeline',
    style: 'mythic',
    showMilestones: true,
    showChapters: true,
    showDataPoints: false,
    showAnnotations: false,
    showMetrics: false,
    showDecisionWindows: false,
    labelStyle: 'narrative',
    markerStyle: 'lantern',
    lineStyle: 'flowing',
    animation: 'breath',
  },
  scholar: {
    name: 'Annotated Timeline',
    style: 'academic',
    showMilestones: true,
    showChapters: false,
    showDataPoints: true,
    showAnnotations: true,
    showMetrics: false,
    showDecisionWindows: false,
    labelStyle: 'academic',
    markerStyle: 'dot',
    lineStyle: 'solid',
    animation: 'highlight',
  },
  architect: {
    name: 'Data Timeline',
    style: 'technical',
    showMilestones: true,
    showChapters: false,
    showDataPoints: true,
    showAnnotations: true,
    showMetrics: true,
    showDecisionWindows: false,
    labelStyle: 'code',
    markerStyle: 'node',
    lineStyle: 'grid',
    animation: 'scan',
  },
  sovereign: {
    name: 'Strategic Timeline',
    style: 'executive',
    showMilestones: false,
    showChapters: false,
    showDataPoints: false,
    showAnnotations: false,
    showMetrics: false,
    showDecisionWindows: true,
    labelStyle: 'command',
    markerStyle: 'diamond',
    lineStyle: 'bold',
    animation: 'pulse',
  },
};

// ============================================================================
// SAMPLE TIMELINE DATA TRANSFORMER
// ============================================================================

/**
 * Transform raw timeline data based on mode requirements.
 */
function transformTimelineData(data, mode) {
  const config = TIMELINE_CONFIGS[mode] || TIMELINE_CONFIGS.pilgrim;

  return data.map((event, index) => ({
    ...event,
    displayLabel: getDisplayLabel(event, mode),
    displayDescription: getDisplayDescription(event, mode),
    markerType: config.markerStyle,
    showAnnotation: config.showAnnotations && event.annotation,
    showMetrics: config.showMetrics && event.metrics,
    isDecisionWindow: config.showDecisionWindows && event.isDecisionPoint,
    animationDelay: index * 100,
  }));
}

function getDisplayLabel(event, mode) {
  switch (mode) {
    case 'pilgrim':
      return event.mythicLabel || event.label;
    case 'scholar':
      return event.academicLabel || event.label;
    case 'architect':
      return event.technicalLabel || `${event.label} [${event.id}]`;
    case 'sovereign':
      return event.strategicLabel || event.label.toUpperCase();
    default:
      return event.label;
  }
}

function getDisplayDescription(event, mode) {
  switch (mode) {
    case 'pilgrim':
      return event.narrative || event.description;
    case 'scholar':
      return event.analysis || event.description;
    case 'architect':
      return event.technicalNote || event.description;
    case 'sovereign':
      return event.strategicBrief || event.description;
    default:
      return event.description;
  }
}

// ============================================================================
// TIMELINE MARKER COMPONENTS
// ============================================================================

const TimelineMarker = ({ type, isActive, isCompleted, mode }) => {
  const markerStyles = {
    lantern: {
      container: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: isActive
          ? 'radial-gradient(circle, #ffd780 0%, #e6b84d 100%)'
          : isCompleted
            ? '#ffd780'
            : 'rgba(255, 215, 128, 0.2)',
        boxShadow: isActive ? '0 0 20px rgba(255, 215, 128, 0.6)' : 'none',
        transition: 'all 0.3s ease',
      },
    },
    dot: {
      container: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: isActive ? '#e8d5a3' : isCompleted ? '#c4b08a' : '#64748b',
        border: '2px solid',
        borderColor: isActive ? '#e8d5a3' : 'transparent',
        transition: 'all 0.2s ease',
      },
    },
    node: {
      container: {
        width: '16px',
        height: '16px',
        borderRadius: '3px',
        background: isActive ? '#60a5fa' : isCompleted ? '#3b82f6' : '#1e40af',
        border: '1px solid',
        borderColor: isActive ? '#93c5fd' : 'rgba(96, 165, 250, 0.3)',
        transform: 'rotate(45deg)',
        transition: 'all 0.15s ease',
      },
    },
    diamond: {
      container: {
        width: '20px',
        height: '20px',
        background: isActive
          ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
          : isCompleted
            ? '#fbbf24'
            : 'rgba(251, 191, 36, 0.2)',
        transform: 'rotate(45deg)',
        boxShadow: isActive ? '0 0 15px rgba(251, 191, 36, 0.5)' : 'none',
        transition: 'all 0.2s ease',
      },
    },
  };

  const style = markerStyles[type] || markerStyles.dot;

  return <div style={style.container} />;
};

// ============================================================================
// TIMELINE LINE COMPONENT
// ============================================================================

const TimelineLine = ({ style, progress, mode }) => {
  const lineStyles = {
    flowing: {
      track: {
        height: '4px',
        background: 'rgba(255, 215, 128, 0.15)',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #e6b84d, #ffd780)',
        borderRadius: '2px',
        boxShadow: '0 0 10px rgba(255, 215, 128, 0.4)',
        transition: 'width 0.5s ease',
      },
    },
    solid: {
      track: {
        height: '2px',
        background: 'rgba(232, 213, 163, 0.2)',
        position: 'relative',
      },
      fill: {
        height: '100%',
        width: `${progress}%`,
        background: '#e8d5a3',
        transition: 'width 0.3s ease',
      },
    },
    grid: {
      track: {
        height: '2px',
        background: `repeating-linear-gradient(
          90deg,
          rgba(96, 165, 250, 0.3) 0px,
          rgba(96, 165, 250, 0.3) 4px,
          transparent 4px,
          transparent 8px
        )`,
        position: 'relative',
      },
      fill: {
        height: '100%',
        width: `${progress}%`,
        background: '#60a5fa',
        transition: 'width 0.2s ease',
      },
    },
    bold: {
      track: {
        height: '6px',
        background: 'rgba(251, 191, 36, 0.1)',
        borderRadius: '3px',
        position: 'relative',
      },
      fill: {
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #d97706, #fbbf24)',
        borderRadius: '3px',
        boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)',
        transition: 'width 0.2s ease',
      },
    },
  };

  const lineStyle = lineStyles[style] || lineStyles.solid;

  return (
    <div style={lineStyle.track}>
      <div style={lineStyle.fill} />
    </div>
  );
};

// ============================================================================
// TIMELINE EVENT COMPONENT
// ============================================================================

const TimelineEvent = ({ event, config, isActive, index }) => {
  const eventStyles = {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px 0',
      opacity: isActive ? 1 : 0.7,
      transition: 'all 0.3s ease',
      animation: config.animation === 'scan'
        ? `scanIn 300ms ease-out ${index * 100}ms backwards`
        : 'none',
    },
    markerColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '30px',
    },
    connector: {
      width: '2px',
      height: '40px',
      background: 'var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
      marginTop: '8px',
    },
    content: {
      flex: 1,
    },
    label: {
      fontSize: config.labelStyle === 'code' ? '13px' : '15px',
      fontWeight: '600',
      color: isActive ? 'var(--aura-text-highlight, #fff)' : '#e2e8f0',
      fontFamily: config.labelStyle === 'code'
        ? "'JetBrains Mono', monospace"
        : 'inherit',
      marginBottom: '4px',
    },
    description: {
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: '1.5',
    },
    annotation: {
      fontSize: '12px',
      color: 'var(--aura-text-accent, #a855f7)',
      marginTop: '8px',
      padding: '8px 12px',
      background: 'var(--aura-surface-1, rgba(168, 85, 247, 0.1))',
      borderRadius: '6px',
      borderLeft: '3px solid var(--aura-primary, #a855f7)',
    },
    metrics: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px',
      fontSize: '12px',
      fontFamily: "'JetBrains Mono', monospace",
    },
    metric: {
      color: '#60a5fa',
      padding: '4px 8px',
      background: 'rgba(96, 165, 250, 0.1)',
      borderRadius: '4px',
    },
    decisionWindow: {
      marginTop: '8px',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      borderRadius: '8px',
    },
    decisionLabel: {
      fontSize: '11px',
      color: '#fbbf24',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '4px',
    },
    decisionText: {
      fontSize: '14px',
      color: '#fefce8',
      fontWeight: '500',
    },
  };

  return (
    <div style={eventStyles.container}>
      <div style={eventStyles.markerColumn}>
        <TimelineMarker
          type={event.markerType}
          isActive={isActive}
          isCompleted={event.completed}
          mode={config.style}
        />
        {!event.isLast && <div style={eventStyles.connector} />}
      </div>
      <div style={eventStyles.content}>
        <div style={eventStyles.label}>{event.displayLabel}</div>
        <div style={eventStyles.description}>{event.displayDescription}</div>

        {event.showAnnotation && event.annotation && (
          <div style={eventStyles.annotation}>{event.annotation}</div>
        )}

        {event.showMetrics && event.metrics && (
          <div style={eventStyles.metrics}>
            {Object.entries(event.metrics).map(([key, value]) => (
              <span key={key} style={eventStyles.metric}>
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {event.isDecisionWindow && (
          <div style={eventStyles.decisionWindow}>
            <div style={eventStyles.decisionLabel}>Decision Window</div>
            <div style={eventStyles.decisionText}>
              {event.decisionPrompt || 'Action recommended'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TIMELINE COMPONENT
// ============================================================================

const ModeAwareTimeline = ({
  events = [],
  currentEventId,
  onEventClick,
  className = '',
}) => {
  const { mode } = useMode();
  const config = TIMELINE_CONFIGS[mode] || TIMELINE_CONFIGS.pilgrim;

  // Transform events based on mode
  const transformedEvents = useMemo(() => {
    const transformed = transformTimelineData(events, mode);
    return transformed.map((event, index) => ({
      ...event,
      isLast: index === transformed.length - 1,
    }));
  }, [events, mode]);

  // Calculate progress
  const progress = useMemo(() => {
    const currentIndex = transformedEvents.findIndex(e => e.id === currentEventId);
    const completedCount = transformedEvents.filter(e => e.completed).length;
    const total = transformedEvents.length;
    if (total === 0) return 0;
    return Math.round(((currentIndex + 1) / total) * 100);
  }, [transformedEvents, currentEventId]);

  const containerStyles = {
    container: {
      padding: '24px',
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      borderRadius: '16px',
      border: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '8px',
    },
    progressWrapper: {
      marginBottom: '24px',
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '8px',
    },
    events: {
      position: 'relative',
    },
  };

  return (
    <div style={containerStyles.container} className={`mode-aware-timeline ${className}`}>
      <header style={containerStyles.header}>
        <h3 style={containerStyles.title}>{config.name}</h3>
      </header>

      <div style={containerStyles.progressWrapper}>
        <div style={containerStyles.progressLabel}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <TimelineLine style={config.lineStyle} progress={progress} mode={mode} />
      </div>

      <div style={containerStyles.events}>
        {transformedEvents.map((event, index) => (
          <div
            key={event.id}
            onClick={() => onEventClick?.(event.id)}
            style={{ cursor: onEventClick ? 'pointer' : 'default' }}
          >
            <TimelineEvent
              event={event}
              config={config}
              isActive={event.id === currentEventId}
              index={index}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scanIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

ModeAwareTimeline.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      mythicLabel: PropTypes.string,
      academicLabel: PropTypes.string,
      technicalLabel: PropTypes.string,
      strategicLabel: PropTypes.string,
      narrative: PropTypes.string,
      analysis: PropTypes.string,
      technicalNote: PropTypes.string,
      strategicBrief: PropTypes.string,
      annotation: PropTypes.string,
      metrics: PropTypes.object,
      isDecisionPoint: PropTypes.bool,
      decisionPrompt: PropTypes.string,
      completed: PropTypes.bool,
    })
  ),
  currentEventId: PropTypes.string,
  onEventClick: PropTypes.func,
  className: PropTypes.string,
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get timeline configuration for a mode.
 */
export function getTimelineConfig(mode) {
  return TIMELINE_CONFIGS[mode] || TIMELINE_CONFIGS.pilgrim;
}

/**
 * Create sample timeline events for testing.
 */
export function createSampleTimelineEvents() {
  return [
    {
      id: 'birth',
      label: 'Birth Chart Analysis',
      mythicLabel: 'The Moment of Becoming',
      academicLabel: 'Natal Chart Analysis',
      technicalLabel: 'natal_chart_compute()',
      strategicLabel: 'CORE POSITION',
      description: 'Understanding your cosmic blueprint.',
      narrative: 'At the moment of your first breath, the cosmos arranged itself uniquely for you.',
      analysis: 'The natal chart provides the foundational framework for astrological interpretation.',
      technicalNote: 'Ephemeris calculation: Swiss Ephemeris. House system: Placidus.',
      strategicBrief: 'Your fundamental strategic advantages and vulnerabilities.',
      annotation: 'Key reference: Ptolemy, Tetrabiblos, Book II',
      metrics: { planets: 10, aspects: 24, houses: 12 },
      completed: true,
    },
    {
      id: 'elements',
      label: 'Elemental Balance',
      mythicLabel: 'The Four Sacred Forces',
      academicLabel: 'Elemental Distribution',
      technicalLabel: 'compute_elements()',
      strategicLabel: 'NATURAL STRENGTHS',
      description: 'Exploring your elemental nature.',
      narrative: 'Fire, Earth, Air, Water weave through your being.',
      analysis: 'Element balance indicates temperament and mode of action.',
      technicalNote: 'Weighted sum: Sun/Moon = 2x, personal planets = 1.5x, outer = 1x.',
      strategicBrief: 'Your natural modes of operation and execution.',
      metrics: { fire: 25, earth: 30, air: 20, water: 25 },
      completed: true,
    },
    {
      id: 'transits',
      label: 'Current Transits',
      mythicLabel: 'The Turning Wheel',
      academicLabel: 'Transit Analysis',
      technicalLabel: 'transit_engine.run()',
      strategicLabel: 'TIMING WINDOWS',
      description: 'What the current sky activates in your chart.',
      narrative: 'The great wheel turns, and the stars speak to your chart today.',
      analysis: 'Current planetary positions form aspects to natal positions.',
      technicalNote: 'Orb tolerance: 3° applying, 1° separating. Priority: slow planets.',
      strategicBrief: 'Optimal timing windows for decisive action.',
      isDecisionPoint: true,
      decisionPrompt: 'Saturn trine natal Sun: favorable for long-term commitments.',
      completed: false,
    },
    {
      id: 'forecast',
      label: 'Future Outlook',
      mythicLabel: 'The Path Ahead',
      academicLabel: 'Predictive Methodology',
      technicalLabel: 'forecast_engine.project()',
      strategicLabel: 'STRATEGIC HORIZON',
      description: 'Major themes for the coming period.',
      narrative: 'The path ahead reveals itself to those who are ready.',
      analysis: 'Combining progressions, transits, and solar arc directions.',
      technicalNote: 'Methods: Secondary progressions, solar arcs, transits. Window: 12 months.',
      strategicBrief: 'Key strategic considerations for the next cycle.',
      completed: false,
    },
  ];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeAwareTimeline;

export {
  TIMELINE_CONFIGS,
  TimelineMarker,
  TimelineLine,
  TimelineEvent,
  transformTimelineData,
  getTimelineConfig,
  createSampleTimelineEvents,
};
