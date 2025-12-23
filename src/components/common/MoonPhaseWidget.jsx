/**
 * ============================================
 * MOON PHASE WIDGET
 * Real-time lunar display with sign sensitivity
 * ============================================
 */

import React, { useState, useEffect } from 'react';
import {
  calculateMoonPhase,
  getLunarSensitivity,
  getPersonalizedLunarGuidance,
  getUpcomingLunarEvents
} from '../../services/moonPhaseService';

/**
 * Compact Moon Phase Widget for dashboard/cards
 */
export function MoonPhaseCompact({ sunSign = null, showSensitivity = true }) {
  const [moonData, setMoonData] = useState(null);

  useEffect(() => {
    const moon = calculateMoonPhase();
    setMoonData(moon);

    // Update every hour
    const interval = setInterval(() => {
      setMoonData(calculateMoonPhase());
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!moonData) return null;

  const sensitivity = sunSign ? getLunarSensitivity(sunSign) : null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-2xl">{moonData.emoji}</span>
      <div>
        <div className="text-white/90 font-medium">{moonData.phase}</div>
        <div className="text-white/50 text-xs">{moonData.illumination}% illuminated</div>
      </div>
      {showSensitivity && sensitivity?.isMoonSensitive && (
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            sensitivity.overallLevel === 'extreme'
              ? 'bg-purple-500/30 text-purple-300'
              : sensitivity.overallLevel === 'high'
              ? 'bg-blue-500/30 text-blue-300'
              : 'bg-amber-500/30 text-amber-300'
          }`}
          title={`${sunSign} is moon-sensitive`}
        >
          Moon-Sensitive
        </span>
      )}
    </div>
  );
}

/**
 * Full Moon Phase Widget with detailed information
 */
export default function MoonPhaseWidget({
  sunSign = null,
  moonSign = null,
  showUpcoming = true,
  showGuidance = true,
  variant = 'full' // 'full' | 'compact' | 'mini'
}) {
  const [moonData, setMoonData] = useState(null);
  const [guidance, setGuidance] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Calculate current moon phase
    const moon = calculateMoonPhase();
    setMoonData(moon);

    // Get personalized guidance if sun sign provided
    if (sunSign) {
      setGuidance(getPersonalizedLunarGuidance(sunSign, moon));
    }

    // Get upcoming events
    if (showUpcoming) {
      setUpcomingEvents(getUpcomingLunarEvents(14)); // Next 2 weeks
    }

    // Update every hour
    const interval = setInterval(() => {
      const updatedMoon = calculateMoonPhase();
      setMoonData(updatedMoon);
      if (sunSign) {
        setGuidance(getPersonalizedLunarGuidance(sunSign, updatedMoon));
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [sunSign, showUpcoming]);

  if (!moonData) {
    return (
      <div className="animate-pulse bg-white/5 rounded-xl p-4 h-32" />
    );
  }

  // Mini variant - just emoji and name
  if (variant === 'mini') {
    return (
      <div className="flex items-center gap-1.5" title={moonData.phase}>
        <span className="text-lg">{moonData.emoji}</span>
        <span className="text-white/70 text-xs">{moonData.illumination}%</span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return <MoonPhaseCompact sunSign={sunSign} />;
  }

  // Full variant
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl border border-indigo-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-3xl">{moonData.emoji}</span>
            <div>
              <div>{moonData.phase}</div>
              <div className="text-xs text-white/50 font-normal">
                {moonData.illumination}% illuminated • Day {moonData.moonAge} of cycle
              </div>
            </div>
          </h3>

          {guidance?.urgency !== 'normal' && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                guidance.urgency === 'high'
                  ? 'bg-red-500/30 text-red-300 animate-pulse'
                  : guidance.urgency === 'medium'
                  ? 'bg-amber-500/30 text-amber-300'
                  : 'bg-blue-500/30 text-blue-300'
              }`}
            >
              {guidance.urgency === 'high' ? 'High Lunar Alert' : 'Lunar Alert'}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Phase Meaning */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
            {moonData.energy} Energy
          </div>
          <p className="text-white/90 text-sm">{moonData.meaning}</p>
        </div>

        {/* Best For Activities */}
        <div>
          <div className="text-white/60 text-xs uppercase tracking-wider mb-2">
            Best For
          </div>
          <div className="flex flex-wrap gap-2">
            {moonData.bestFor.map((activity, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* Personal Alert for Moon-Sensitive Signs */}
        {guidance?.personalMessage && (
          <div
            className={`rounded-lg p-3 border ${
              guidance.urgency === 'high'
                ? 'bg-purple-500/20 border-purple-400/40'
                : guidance.urgency === 'medium'
                ? 'bg-blue-500/20 border-blue-400/40'
                : 'bg-cyan-500/20 border-cyan-400/40'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">
                {guidance.urgency === 'high' ? '🌙' : guidance.urgency === 'medium' ? '✨' : '💫'}
              </span>
              <div>
                <div className="text-white/90 text-sm font-medium mb-1">
                  Personal Lunar Insight for {sunSign}
                </div>
                <p className="text-white/70 text-sm">{guidance.personalMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sign-Specific Advice */}
        {guidance?.signSpecificAdvice && !guidance.personalMessage && (
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-400/20">
            <div className="flex items-start gap-2">
              <span className="text-lg">🌙</span>
              <div>
                <div className="text-white/90 text-sm font-medium mb-1">
                  {sunSign} & The Moon
                </div>
                <p className="text-white/70 text-sm">{guidance.signSpecificAdvice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {showUpcoming && upcomingEvents.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-white/60 text-xs uppercase tracking-wider">
                Upcoming
              </span>
              <span className="text-white/40 text-xs">
                {expanded ? '▼' : '▶'}
              </span>
            </button>

            {expanded && (
              <div className="mt-2 space-y-2">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{event.emoji}</span>
                      <div>
                        <div className="text-white/90 text-sm">{event.type}</div>
                        <div className="text-white/50 text-xs">
                          {event.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-sm">
                        {event.daysUntil === 0
                          ? 'Today!'
                          : event.daysUntil === 1
                          ? 'Tomorrow'
                          : `${event.daysUntil} days`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <div className="text-center py-2 bg-white/5 rounded-lg">
            <div className="text-white/50 text-xs">Next Full Moon</div>
            <div className="text-white/90 font-medium">
              {moonData.daysToFullMoon === 0
                ? 'Tonight!'
                : `${moonData.daysToFullMoon} day${moonData.daysToFullMoon !== 1 ? 's' : ''}`}
            </div>
          </div>
          <div className="text-center py-2 bg-white/5 rounded-lg">
            <div className="text-white/50 text-xs">Next New Moon</div>
            <div className="text-white/90 font-medium">
              {moonData.daysToNewMoon === 0
                ? 'Tonight!'
                : `${moonData.daysToNewMoon} day${moonData.daysToNewMoon !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
