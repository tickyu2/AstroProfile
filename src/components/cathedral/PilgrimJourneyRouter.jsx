/**
 * PilgrimJourneyRouter.jsx
 *
 * Global router orchestrating the entire Cathedral journey.
 * Handles navigation, transitions, state persistence, and path branching.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// Route configuration
import {
  PILGRIM_ROUTES,
  PILGRIM_PATHS,
  getRoutesForPath,
  getNextRoute,
  getPreviousRoute,
  isRouteAccessible,
  getRouteById,
  getPathProgress,
} from './pilgrimRoutes';

// State persistence
import {
  loadJourneyState,
  saveJourneyState,
  updateCurrentRoute,
  markRouteCompleted,
  updateChamberData,
  DEFAULT_JOURNEY_STATE,
} from './journeyState';

// Chamber components
import AncestralChamber from './AncestralChamber';

// ============================================================================
// JOURNEY MAP COMPONENT
// ============================================================================

const PilgrimJourneyMap = ({ routes, currentRoute, completedRoutes, onRouteClick }) => {
  const mapStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '16px 20px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      marginBottom: '20px',
      overflowX: 'auto',
    },
    step: (isActive, isCompleted, isAccessible) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '8px',
      background: isActive
        ? 'rgba(168, 85, 247, 0.2)'
        : isCompleted
          ? 'rgba(34, 197, 94, 0.1)'
          : 'transparent',
      border: isActive
        ? '1px solid rgba(168, 85, 247, 0.5)'
        : 'none',
      cursor: isAccessible ? 'pointer' : 'default',
      opacity: isAccessible ? 1 : 0.4,
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }),
    marker: (isActive, isCompleted) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: isCompleted
        ? '#22c55e'
        : isActive
          ? '#a855f7'
          : 'rgba(255, 255, 255, 0.2)',
      boxShadow: isActive ? '0 0 10px rgba(168, 85, 247, 0.6)' : 'none',
      transition: 'all 0.3s ease',
    }),
    label: {
      fontSize: '13px',
      color: '#e2e8f0',
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
    connector: (isCompleted) => ({
      width: '20px',
      height: '2px',
      background: isCompleted
        ? 'linear-gradient(90deg, #22c55e, #22c55e80)'
        : 'rgba(255, 255, 255, 0.1)',
      flexShrink: 0,
    }),
  };

  return (
    <nav style={mapStyles.container}>
      {routes.map((route, index) => {
        const isActive = route.id === currentRoute;
        const isCompleted = completedRoutes.includes(route.id);
        const isAccessible = isRouteAccessible(route.id, completedRoutes) || isCompleted || isActive;
        const prevCompleted = index > 0 && completedRoutes.includes(routes[index - 1].id);

        return (
          <React.Fragment key={route.id}>
            {index > 0 && <div style={mapStyles.connector(prevCompleted)} />}
            <div
              style={mapStyles.step(isActive, isCompleted, isAccessible)}
              onClick={() => isAccessible && onRouteClick?.(route.id)}
              title={route.description}
            >
              <span style={mapStyles.marker(isActive, isCompleted)}>
                {isCompleted && '✓'}
              </span>
              <span style={mapStyles.label}>{route.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// ============================================================================
// PATH SELECTOR COMPONENT
// ============================================================================

const PathSelector = ({ currentPath, onPathChange }) => {
  const selectorStyles = {
    container: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
    },
    button: (isActive) => ({
      padding: '8px 16px',
      borderRadius: '8px',
      border: isActive ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
      background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
      color: isActive ? '#e2e8f0' : '#94a3b8',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  };

  const paths = [
    { id: PILGRIM_PATHS.PILGRIM, label: 'Pilgrim' },
    { id: PILGRIM_PATHS.ARCHITECT, label: 'Architect' },
    { id: PILGRIM_PATHS.SOVEREIGN, label: 'Sovereign' },
  ];

  return (
    <div style={selectorStyles.container}>
      {paths.map((path) => (
        <button
          key={path.id}
          style={selectorStyles.button(currentPath === path.id)}
          onClick={() => onPathChange(path.id)}
        >
          {path.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================

const ProgressBar = ({ progress, label }) => {
  const barStyles = {
    container: {
      marginBottom: '20px',
    },
    labelRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
    },
    label: {
      color: '#94a3b8',
      fontSize: '12px',
    },
    percentage: {
      color: '#a855f7',
      fontSize: '12px',
      fontWeight: '600',
    },
    track: {
      height: '6px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #667eea 0%, #a855f7 100%)',
      borderRadius: '3px',
      transition: 'width 0.5s ease',
    },
  };

  return (
    <div style={barStyles.container}>
      <div style={barStyles.labelRow}>
        <span style={barStyles.label}>{label}</span>
        <span style={barStyles.percentage}>{progress}%</span>
      </div>
      <div style={barStyles.track}>
        <div style={barStyles.fill} />
      </div>
    </div>
  );
};

// ============================================================================
// PLACEHOLDER CHAMBER COMPONENT
// ============================================================================

const PlaceholderChamber = ({ route, onComplete }) => {
  const styles = {
    container: {
      textAlign: 'center',
      padding: '60px 20px',
      animation: 'chamberFadeSlide 260ms ease-out',
    },
    title: {
      color: '#fff',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '12px',
    },
    description: {
      color: '#94a3b8',
      fontSize: '16px',
      marginBottom: '32px',
    },
    button: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 40px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{route.label}</h2>
      <p style={styles.description}>{route.description}</p>
      <button style={styles.button} onClick={onComplete}>
        Complete Chamber
      </button>
    </div>
  );
};

// ============================================================================
// MAIN ROUTER COMPONENT
// ============================================================================

const PilgrimJourneyRouter = ({
  userId,
  overlays = {},
  personaRole = 'mentor',
  showPathSelector = true,
  showProgressBar = true,
  onJourneyComplete,
}) => {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state
  useEffect(() => {
    async function loadState() {
      setIsLoading(true);
      const loaded = await loadJourneyState(userId);
      setState(loaded || { ...DEFAULT_JOURNEY_STATE });
      setIsLoading(false);
    }
    loadState();
  }, [userId]);

  // Get routes for current path
  const pathRoutes = useMemo(() => {
    if (!state) return [];
    return getRoutesForPath(state.path);
  }, [state?.path]);

  // Get current route object
  const currentRouteObj = useMemo(() => {
    if (!state) return null;
    return getRouteById(state.currentRoute);
  }, [state?.currentRoute]);

  // Calculate progress
  const progress = useMemo(() => {
    if (!state) return 0;
    return getPathProgress(state.completedRoutes, state.path);
  }, [state?.completedRoutes, state?.path]);

  // Handle route advancement
  const handleAdvance = useCallback((nextRouteId) => {
    if (!state) return;

    // Mark current as completed if not already
    let newState = markRouteCompleted(state, state.currentRoute);

    // Move to next route
    if (nextRouteId) {
      newState = updateCurrentRoute(newState, nextRouteId);
    } else {
      const next = getNextRoute(state.currentRoute, state.path);
      if (next) {
        newState = updateCurrentRoute(newState, next.id);
      } else {
        // Journey complete
        onJourneyComplete?.(newState);
        return;
      }
    }

    setState(newState);
    saveJourneyState(userId, newState);
  }, [state, userId, onJourneyComplete]);

  // Handle manual route navigation
  const handleRouteClick = useCallback((routeId) => {
    if (!state) return;

    const newState = updateCurrentRoute(state, routeId);
    setState(newState);
    saveJourneyState(userId, newState);
  }, [state, userId]);

  // Handle path change
  const handlePathChange = useCallback((newPath) => {
    if (!state) return;

    const newState = {
      ...state,
      path: newPath,
    };
    setState(newState);
    saveJourneyState(userId, newState);
  }, [state, userId]);

  // Handle chamber data update
  const handleChamberDataUpdate = useCallback((chamberId, data) => {
    if (!state) return;

    const newState = updateChamberData(state, chamberId, data);
    setState(newState);
    saveJourneyState(userId, newState);
  }, [state, userId]);

  // Render chamber based on current route
  const renderChamber = () => {
    if (!currentRouteObj) return null;

    const chamberProps = {
      overlays: overlays[currentRouteObj.id] || {},
      personaRole: state?.personaRole || personaRole,
      onComplete: () => handleAdvance(),
      onDataUpdate: (data) => handleChamberDataUpdate(currentRouteObj.id, data),
    };

    // Route to appropriate chamber component
    switch (currentRouteObj.id) {
      case 'ancestral':
        return (
          <AncestralChamber
            {...chamberProps}
            pilgrimName={overlays.pilgrimName}
          />
        );

      // Add other chamber components as they're built
      // case 'birth':
      //   return <BirthChamber {...chamberProps} />;

      default:
        return (
          <PlaceholderChamber
            route={currentRouteObj}
            onComplete={() => handleAdvance()}
          />
        );
    }
  };

  const routerStyles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      borderRadius: '20px',
      padding: '24px',
      minHeight: '700px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      marginBottom: '20px',
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      color: '#94a3b8',
      fontSize: '16px',
    },
    transitionWrapper: {
      position: 'relative',
    },
    transition: {
      animation: 'chamberFadeSlide 260ms ease-out',
    },
  };

  if (isLoading) {
    return (
      <div style={routerStyles.container}>
        <div style={routerStyles.loading}>Loading your journey...</div>
      </div>
    );
  }

  return (
    <div style={routerStyles.container}>
      {/* Header */}
      <header style={routerStyles.header}>
        <h1 style={routerStyles.title}>Cathedral Journey</h1>
        <p style={routerStyles.subtitle}>
          {currentRouteObj?.label}: {currentRouteObj?.description}
        </p>
      </header>

      {/* Path Selector */}
      {showPathSelector && (
        <PathSelector
          currentPath={state?.path}
          onPathChange={handlePathChange}
        />
      )}

      {/* Progress Bar */}
      {showProgressBar && (
        <ProgressBar
          progress={progress}
          label={`${state?.path?.charAt(0).toUpperCase()}${state?.path?.slice(1)} Path`}
        />
      )}

      {/* Journey Map */}
      <PilgrimJourneyMap
        routes={pathRoutes}
        currentRoute={state?.currentRoute}
        completedRoutes={state?.completedRoutes || []}
        onRouteClick={handleRouteClick}
      />

      {/* Chamber Content */}
      <div style={routerStyles.transitionWrapper}>
        <div style={routerStyles.transition} key={state?.currentRoute}>
          {renderChamber()}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes chamberFadeSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

PilgrimJourneyRouter.propTypes = {
  userId: PropTypes.string.isRequired,
  overlays: PropTypes.object,
  personaRole: PropTypes.oneOf(['mentor', 'oracle', 'companion', 'mirror']),
  showPathSelector: PropTypes.bool,
  showProgressBar: PropTypes.bool,
  onJourneyComplete: PropTypes.func,
};

export default PilgrimJourneyRouter;

// Named exports
export {
  PilgrimJourneyMap,
  PathSelector,
  ProgressBar,
  PlaceholderChamber,
};
