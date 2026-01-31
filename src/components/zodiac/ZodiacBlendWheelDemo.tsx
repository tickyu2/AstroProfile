/**
 * ZodiacBlendWheelDemo.tsx
 * ========================
 *
 * Demo component showcasing all three enhancements:
 * 1. Today marker - Golden radial line
 * 2. Birth date indicator - Rose star marker
 * 3. Click to explore - Cyan selection for learning about others
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useCallback } from 'react';
import { ZodiacBlendWheel } from './ZodiacBlendWheel';
import { DayBlend, SIGN_GLYPHS, SIGN_ELEMENTS, ELEMENT_COLORS } from '../../data/zodiacBlendData';

interface ZodiacBlendWheelDemoProps {
  /** User's birth date (optional) */
  userBirthDate?: string;
}

export const ZodiacBlendWheelDemo: React.FC<ZodiacBlendWheelDemoProps> = ({
  userBirthDate = '1990-06-15', // Default demo birth date
}) => {
  const [selectedDay, setSelectedDay] = useState<DayBlend | null>(null);
  const [explorationHistory, setExplorationHistory] = useState<DayBlend[]>([]);

  const handleDaySelect = useCallback((day: DayBlend) => {
    setSelectedDay(day);
    setExplorationHistory(prev => {
      // Keep only last 5 explorations
      const newHistory = [day, ...prev.filter(d => d.date !== day.date)].slice(0, 5);
      return newHistory;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedDay(null);
  }, []);

  const getSignColor = (sign: string) => {
    const element = SIGN_ELEMENTS[sign as keyof typeof SIGN_ELEMENTS];
    return ELEMENT_COLORS[element];
  };

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      padding: '24px',
      background: '#0d0d1a',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Main Wheel */}
      <div style={{ flex: '0 0 auto' }}>
        <h2 style={{ marginBottom: '16px', color: '#aaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Zodiac Blend Wheel
        </h2>
        <ZodiacBlendWheel
          year={new Date().getFullYear()}
          width={550}
          height={550}
          showTodayMarker={true}
          birthDate={userBirthDate}
          selectedDate={selectedDay?.date}
          onDaySelect={handleDaySelect}
          onClearSelection={handleClearSelection}
          interactive={true}
          animate={true}
        />
      </div>

      {/* Info Panel */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        {/* Selected Day Details */}
        {selectedDay && (
          <div style={{
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#00d4ff', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Exploring: {selectedDay.date}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '48px' }}>
                {SIGN_GLYPHS[selectedDay.primarySign]}
              </span>
              <div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: getSignColor(selectedDay.primarySign),
                }}>
                  {selectedDay.primarySign}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {SIGN_ELEMENTS[selectedDay.primarySign]} Sign
                </div>
              </div>
            </div>

            {selectedDay.blendSign && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '12px',
              }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                  {selectedDay.cuspType === 'backward'
                    ? `Cusp Day ${selectedDay.cuspDay}: Still emerging from`
                    : `Cusp Day ${selectedDay.cuspDay}: Transitioning toward`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>
                    {SIGN_GLYPHS[selectedDay.blendSign]}
                  </span>
                  <span style={{ color: getSignColor(selectedDay.blendSign), fontWeight: 'bold' }}>
                    {selectedDay.blendSign}
                  </span>
                  <span style={{ color: '#666', marginLeft: 'auto' }}>
                    {Math.round(selectedDay.blendPercent * 100)}% influence
                  </span>
                </div>

                {/* Blend bar */}
                <div style={{
                  display: 'flex',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '12px',
                }}>
                  <div style={{
                    width: `${(1 - selectedDay.blendPercent) * 100}%`,
                    background: getSignColor(selectedDay.primarySign),
                  }} />
                  <div style={{
                    width: `${selectedDay.blendPercent * 100}%`,
                    background: getSignColor(selectedDay.blendSign),
                  }} />
                </div>
              </div>
            )}

            {!selectedDay.blendSign && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '12px',
                color: '#888',
                fontSize: '13px',
              }}>
                Pure {selectedDay.primarySign} energy - not in a cusp period
              </div>
            )}

            {/* Personality insights placeholder */}
            <div style={{ marginTop: '16px', fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>
              <strong style={{ color: '#fff' }}>Learning Insight:</strong> People born on this day
              {selectedDay.blendSign
                ? ` blend the ${SIGN_ELEMENTS[selectedDay.primarySign].toLowerCase()} energy of ${selectedDay.primarySign} with ${selectedDay.blendSign}'s ${SIGN_ELEMENTS[selectedDay.blendSign].toLowerCase()} influence.`
                : ` embody the pure essence of ${selectedDay.primarySign}, the ${SIGN_ELEMENTS[selectedDay.primarySign].toLowerCase()} sign.`
              }
            </div>
          </div>
        )}

        {/* Exploration History */}
        {explorationHistory.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Recent Explorations
            </h4>
            {explorationHistory.map((day, index) => (
              <div
                key={day.date}
                onClick={() => setSelectedDay(day)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: selectedDay?.date === day.date ? 1 : 0.6,
                  background: selectedDay?.date === day.date ? 'rgba(0,212,255,0.1)' : 'transparent',
                }}
              >
                <span style={{ fontSize: '18px' }}>{SIGN_GLYPHS[day.primarySign]}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{day.date}</span>
                <span style={{ fontSize: '12px', color: getSignColor(day.primarySign), marginLeft: 'auto' }}>
                  {day.primarySign}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {!selectedDay && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '20px',
            color: '#888',
            fontSize: '13px',
            lineHeight: '1.8',
          }}>
            <h4 style={{ color: '#fff', margin: '0 0 12px 0' }}>How to Use</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><span style={{ color: '#ffd700' }}>Golden line</span> = Today's position</li>
              <li><span style={{ color: '#ff6b9d' }}>Pink star</span> = Your birth position</li>
              <li><span style={{ color: '#00d4ff' }}>Click any day</span> = Explore someone's birth date</li>
            </ul>
            <p style={{ marginTop: '16px', marginBottom: 0 }}>
              Click anywhere on the wheel to explore what zodiac energy someone born on that date would have.
              Great for learning about friends, family, or historical figures!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZodiacBlendWheelDemo;
