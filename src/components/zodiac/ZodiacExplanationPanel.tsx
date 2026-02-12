/**
 * ZodiacExplanationPanel.tsx
 * ==========================
 *
 * Living, breathing explanation panel that displays psychological micro-explanations
 * for each day on the Zodiac Blend Wheel. Synchronizes with the wheel's breath rhythm.
 *
 * BREATHING FEATURES:
 * - φ-curve breath speed (faster on chaotic cusp days, slower on stable days)
 * - Element-colored glow (Fire/Earth/Air/Water have different glow colors)
 * - Boundary ripple (triggered when crossing into a new sign or cusp)
 * - Heartbeat for Leo + Scorpio (mythic pulse)
 * - Fade-in on hover change
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  DayBlend,
  ZodiacSign,
  SIGN_GLYPHS,
  SIGN_ELEMENTS,
  ELEMENT_COLORS,
  ElementVector,
  getElementVector,
  getDominantElement,
  getActiveElements,
  ELEMENT_EMOJIS,
} from '../../data/zodiacBlendData';
import {
  getExplanationForDayBlend,
  DayExplanation,
  SIGN_META,
  ELEMENT_MEANING,
  ELEMENT_INTERPRETATION,
} from '../../data/zodiacExplanationEngine';
import {
  SIGN_METADATA,
  ELEMENT_COLORS as TROPICAL_ELEMENT_COLORS,
  SEASON_COLORS,
  MODALITY_COLORS,
  SEASON_ICONS,
} from '../../data/tropicalSeasons';

// =============================================================================
// BREATHING CONSTANTS - φ-curve synchronized
// =============================================================================

/**
 * Breath speed mapped to cusp day position
 * Day 1 = chaotic, fast breath | Day 6 = stable, slow breath
 */
const BREATH_SPEED: Record<number, number> = {
  1: 4.5,  // seconds - fast, unstable
  2: 5.0,  // awakening
  3: 6.0,  // stabilizing
  4: 7.0,  // grounded
  5: 8.0,  // settled
  6: 9.0,  // very slow, almost pure
};

const PURE_SIGN_BREATH_SPEED = 8.5; // Pure signs breathe slowly and steadily

/**
 * Element glow colors - each element has its own luminous signature
 */
const ELEMENT_GLOW: Record<string, string> = {
  Fire: 'rgba(255, 120, 80, 0.35)',   // warm ember
  Earth: 'rgba(180, 140, 90, 0.25)',  // grounded amber
  Air: 'rgba(180, 220, 255, 0.35)',   // shimmering blue-white
  Water: 'rgba(120, 180, 255, 0.35)', // cool lunar pulse
};

/**
 * Element-specific breath animation styles
 * Fire = quick, warm, flickering
 * Earth = slow, grounded, steady
 * Air = light, shimmering
 * Water = fluid, wave-like
 */
const ELEMENT_BREATH_STYLE: Record<string, {
  animation: string;
  timing: string;
  speed: number; // multiplier for breath duration
}> = {
  Fire: {
    animation: 'fireFlicker',
    timing: 'ease-in-out',
    speed: 0.8, // faster
  },
  Earth: {
    animation: 'earthBreathe',
    timing: 'ease-in-out',
    speed: 1.2, // slower, grounded
  },
  Air: {
    animation: 'airShimmer',
    timing: 'linear',
    speed: 0.9, // light, quick
  },
  Water: {
    animation: 'waterWave',
    timing: 'ease-in-out',
    speed: 1.1, // flowing, moderate
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface ZodiacExplanationPanelProps {
  /** The day being hovered/focused */
  day: DayBlend | null;
  /** Optional: Show expanded view with all sections */
  expanded?: boolean;
  /** Optional: Custom styling */
  className?: string;
  /** Optional: Dark or light mode */
  theme?: 'dark' | 'light';
  /** Optional: Enable breathing animation */
  breathe?: boolean;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const SignBadge: React.FC<{ sign: ZodiacSign; percent?: number }> = ({ sign, percent }) => {
  const color = ELEMENT_COLORS[SIGN_ELEMENTS[sign]];
  const glyph = SIGN_GLYPHS[sign];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: `${color}22`,
        border: `1px solid ${color}44`,
        borderRadius: '16px',
      }}
    >
      <span style={{ fontSize: '16px' }}>{glyph}</span>
      <span style={{ color, fontWeight: 500 }}>{sign}</span>
      {percent !== undefined && (
        <span style={{ color: '#c0c0c0', fontSize: '12px' }}>
          {Math.round(percent * 100)}%
        </span>
      )}
    </div>
  );
};

const BlendBar: React.FC<{
  primary: ZodiacSign;
  blend: ZodiacSign | null;
  primaryPercent: number;
  blendPercent: number;
}> = ({ primary, blend, primaryPercent, blendPercent }) => {
  const primaryColor = ELEMENT_COLORS[SIGN_ELEMENTS[primary]];
  const blendColor = blend ? ELEMENT_COLORS[SIGN_ELEMENTS[blend]] : '#333';

  return (
    <div style={{ marginTop: '8px' }}>
      <div
        style={{
          display: 'flex',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#1a1a2e',
        }}
      >
        <div
          style={{
            width: `${primaryPercent * 100}%`,
            background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}cc)`,
            transition: 'width 0.3s ease',
          }}
        />
        {blend && blendPercent > 0 && (
          <div
            style={{
              width: `${blendPercent * 100}%`,
              background: `linear-gradient(90deg, ${blendColor}cc, ${blendColor})`,
              transition: 'width 0.3s ease',
            }}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#b0b0b0',
          marginTop: '4px',
        }}
      >
        <span style={{ color: primaryColor }}>
          {SIGN_GLYPHS[primary]} {Math.round(primaryPercent * 100)}%
        </span>
        {blend && blendPercent > 0 && (
          <span style={{ color: blendColor }}>
            {Math.round(blendPercent * 100)}% {SIGN_GLYPHS[blend]}
          </span>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
  color?: string;
}> = ({ title, icon, children, color = '#aaa' }) => (
  <div style={{ marginBottom: '16px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '6px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color,
      }}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </div>
    <div style={{ color: '#e8e8e8', fontSize: '13px', lineHeight: '1.6' }}>
      {children}
    </div>
  </div>
);

// =============================================================================
// ELEMENTAL BALANCE COMPONENT
// =============================================================================

/**
 * Displays the elemental balance as a visual bar + interpretation
 * Shows elements as weather, not math
 */
const ElementalBalance: React.FC<{ day: DayBlend }> = ({ day }) => {
  const activeElements = getActiveElements(day);
  const dominant = getDominantElement(day);
  const interpretation = ELEMENT_INTERPRETATION[dominant.element];

  // Element bar colors
  const BAR_COLORS: Record<string, string> = {
    fire: '#e74c3c',
    earth: '#27ae60',
    air: '#3498db',
    water: '#9b59b6',
  };

  return (
    <div
      style={{
        marginTop: '16px',
        marginBottom: '16px',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        borderLeft: `3px solid ${BAR_COLORS[dominant.element]}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#c0c0c0',
          marginBottom: '10px',
        }}
      >
        Elemental Balance
      </div>

      {/* Mini elemental bar */}
      <div
        style={{
          display: 'flex',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden',
          background: '#1a1a2e',
          marginBottom: '10px',
        }}
      >
        {activeElements.map(({ element, percent }) => (
          <div
            key={element}
            style={{
              width: `${percent * 100}%`,
              background: BAR_COLORS[element],
              transition: 'width 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Element breakdown - only show active elements */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        {activeElements.map(({ element, emoji, percent }) => (
          <div
            key={element}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: percent > 0.5 ? BAR_COLORS[element] : '#888',
            }}
          >
            <span>{emoji}</span>
            <span style={{ textTransform: 'capitalize' }}>{element}</span>
            <span style={{ opacity: 0.7 }}>{Math.round(percent * 100)}%</span>
          </div>
        ))}
      </div>

      {/* Dominant element interpretation */}
      <div
        style={{
          fontSize: '13px',
          color: '#ddd',
          lineHeight: '1.5',
          fontStyle: 'italic',
        }}
      >
        {interpretation?.active || `${dominant.elementName} energy is dominant.`}
      </div>
    </div>
  );
};

// =============================================================================
// IDLE STATE (No hover)
// =============================================================================

const PLANET_RULER_SYMBOLS: Record<string, string> = {
  Mars: '♂', Venus: '♀', Mercury: '☿', Moon: '☽', Sun: '☉',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
};

const MODALITY_PHASE: Record<string, string> = {
  Cardinal: 'BEGINNING', Fixed: 'CORE', Mutable: 'TRANSITION',
};

const ELEMENT_EMOJIS_MAP: Record<string, string> = {
  Fire: '🔥', Earth: '🌿', Air: '💨', Water: '💧',
};

const SEASON_GROUPS: { season: string; signs: string[] }[] = [
  { season: 'Spring', signs: ['Aries', 'Taurus', 'Gemini'] },
  { season: 'Summer', signs: ['Cancer', 'Leo', 'Virgo'] },
  { season: 'Autumn', signs: ['Libra', 'Scorpio', 'Sagittarius'] },
  { season: 'Winter', signs: ['Capricorn', 'Aquarius', 'Pisces'] },
];

const IdlePanel: React.FC = () => {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const activeSign = selectedSign || hoveredSign;
  const activeMeta = activeSign
    ? SIGN_METADATA.find(m => m.sign === activeSign)
    : null;

  return (
    <div style={{ padding: '16px 12px', textAlign: 'center' }}>
      {/* 12 Signs in 2 rows × 2 seasonal groups */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
        {SEASON_GROUPS.map(group => {
          const seasonColor = SEASON_COLORS[group.season];
          return (
            <div
              key={group.season}
              style={{
                background: `${seasonColor}12`,
                border: `1px solid ${seasonColor}30`,
                borderRadius: '10px',
                padding: '8px 6px 6px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 600, color: seasonColor, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {SEASON_ICONS[group.season]} {group.season}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                {group.signs.map(signName => {
                  const meta = SIGN_METADATA.find(m => m.sign === signName)!;
                  const isActive = activeSign === meta.sign;
                  const elementColor = TROPICAL_ELEMENT_COLORS[meta.element];
                  return (
                    <button
                      key={meta.sign}
                      type="button"
                      onMouseEnter={() => { if (!selectedSign) setHoveredSign(meta.sign); }}
                      onMouseLeave={() => { if (!selectedSign) setHoveredSign(null); }}
                      onClick={() => {
                        if (selectedSign === meta.sign) {
                          setSelectedSign(null);
                          setHoveredSign(null);
                        } else {
                          setSelectedSign(meta.sign);
                          setHoveredSign(null);
                        }
                      }}
                      title={meta.sign}
                      style={{
                        background: isActive ? `${elementColor}25` : 'rgba(255,255,255,0.05)',
                        border: isActive ? `2px solid ${elementColor}` : '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '5px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        alignItems: 'center',
                        minWidth: '36px',
                      }}
                    >
                      <span style={{ fontSize: '20px', color: elementColor }}>
                        {meta.symbol}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign Detail Card */}
      {activeMeta ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${TROPICAL_ELEMENT_COLORS[activeMeta.element]}40`,
            borderRadius: '10px',
            padding: '14px 16px',
            textAlign: 'left',
            fontSize: '13px',
            lineHeight: '1.8',
            animation: 'panelFade 0.25s ease-out',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 700, color: TROPICAL_ELEMENT_COLORS[activeMeta.element], marginBottom: '8px' }}>
            {activeMeta.symbol}{activeMeta.sign}
          </div>
          <div style={{ color: '#e0e0e0' }}>
            <span style={{ color: '#a0a0a0' }}>Dates: </span>
            {activeMeta.dateRange.replace(' - ', ' – ')}
          </div>
          <div>
            <span style={{ color: '#a0a0a0' }}>Modality: </span>
            <span style={{ color: MODALITY_COLORS[activeMeta.modality], fontWeight: 600 }}>
              {activeMeta.modality.toUpperCase()}
            </span>
          </div>
          <div>
            <span style={{ color: '#a0a0a0' }}>Element: </span>
            <span style={{ color: TROPICAL_ELEMENT_COLORS[activeMeta.element], fontWeight: 600 }}>
              {ELEMENT_EMOJIS_MAP[activeMeta.element]} {activeMeta.element.toUpperCase()}
            </span>
          </div>
          <div>
            <span style={{ color: '#a0a0a0' }}>Season: </span>
            <span style={{ color: SEASON_COLORS[activeMeta.season], fontWeight: 600 }}>
              {SEASON_ICONS[activeMeta.season]}{activeMeta.season} ({MODALITY_PHASE[activeMeta.modality]})
            </span>
          </div>
          <div>
            <span style={{ color: '#a0a0a0' }}>Planet Ruler: </span>
            <span style={{ color: '#e0e0e0', fontWeight: 600 }}>
              {PLANET_RULER_SYMBOLS[activeMeta.ruling] || ''} {activeMeta.ruling}
            </span>
          </div>
          {selectedSign && (
            <div style={{ color: '#888', fontSize: '11px', marginTop: '8px', fontStyle: 'italic', textAlign: 'center' }}>
              Click {activeMeta.symbol} again to close
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ color: '#c0c0c0', fontSize: '13px', marginBottom: '12px' }}>
            Hover over any day in the wheel to explore
          </div>
          <div style={{ color: '#b0b0b0', fontSize: '12px', lineHeight: '1.8' }}>
            <p style={{ margin: '0 0 6px 0' }}>
              Each day has its own psychological flavor based on the golden ratio (φ) cusp curve.
            </p>
            <p style={{ margin: '0 0 6px 0' }}>
              <strong style={{ color: '#e0e0e0' }}>12 pure sign days</strong> express
              the full archetype.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#e0e0e0' }}>72 cusp days</strong> blend two
              signs, creating unique identity patterns.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT - WITH BREATHING ANIMATIONS
// =============================================================================

export const ZodiacExplanationPanel: React.FC<ZodiacExplanationPanelProps> = ({
  day,
  expanded = true,
  className = '',
  theme = 'dark',
  breathe = true,
}) => {
  const [prevDay, setPrevDay] = useState<DayBlend | null>(null);
  const [ripple, setRipple] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Detect boundary crossing for ripple effect
  useEffect(() => {
    if (!day) return;

    const crossedBoundary =
      !prevDay ||
      prevDay.primarySign !== day.primarySign ||
      prevDay.cuspType !== day.cuspType;

    if (crossedBoundary) {
      setRipple(true);
      setFadeKey(prev => prev + 1); // Trigger fade-in
      setTimeout(() => setRipple(false), 1600);
    }

    setPrevDay(day);
  }, [day, prevDay]);

  // Get the explanation for this day (with error handling)
  let explanation: DayExplanation | null = null;
  try {
    // Validate day object has required properties before calling explanation engine
    if (day && day.primarySign && day.date && typeof day.cuspType === 'string') {
      explanation = getExplanationForDayBlend(day);
    } else if (day) {
      console.warn('Day object missing required properties:', day);
    }
  } catch (err) {
    console.error('Error getting explanation for day:', day, err);
  }

  const bgColor = theme === 'dark' ? 'rgba(13, 13, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = theme === 'dark' ? '#fff' : '#1a1a2e';

  // Calculate percentages
  const primaryPercent = day ? 1 - (day.blendPercent || 0) : 1;
  const blendPercent = day?.blendPercent || 0;

  // Calculate breathing parameters
  const element = day ? SIGN_ELEMENTS[day.primarySign] : 'Fire';
  const glow = ELEMENT_GLOW[element];
  const isCusp = day?.cuspType !== 'none' && day?.cuspDay > 0;
  const baseBreathDuration = isCusp && day?.cuspDay
    ? BREATH_SPEED[day.cuspDay] || PURE_SIGN_BREATH_SPEED
    : PURE_SIGN_BREATH_SPEED;

  // Apply element-specific breath style
  const elementBreath = ELEMENT_BREATH_STYLE[element] || ELEMENT_BREATH_STYLE.Fire;
  const breathDuration = baseBreathDuration * elementBreath.speed;
  const breathAnimation = elementBreath.animation;

  // Leo + Scorpio get heartbeat
  const hasHeartbeat = day && (day.primarySign === 'Leo' || day.primarySign === 'Scorpio');

  return (
    <div
      ref={panelRef}
      key={fadeKey}
      className={`zodiac-explanation-panel ${className}`}
      style={{
        background: bgColor,
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        // Element-specific breathing animation
        animation: breathe && day
          ? `${breathAnimation} ${breathDuration}s ${elementBreath.timing} infinite${hasHeartbeat ? ', heartbeat 3.8s ease-in-out infinite' : ''}`
          : undefined,
        // Element glow
        boxShadow: day ? `0 0 16px ${glow}` : 'none',
        transition: 'box-shadow 0.4s ease-out',
      }}
    >
      {/* Ripple overlay */}
      {ripple && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            animation: 'rippleWave 1.6s ease-out',
            borderRadius: '12px',
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          animation: day ? 'panelFade 0.35s ease-out' : undefined,
        }}
      >
        {day && explanation ? (
          <>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: textColor,
                marginBottom: '4px',
              }}
            >
              {explanation.title}
              <span style={{ color: '#c0c0c0', fontWeight: 400 }}>
                {' '}- {(() => {
                  // Format date as "June 6" from "2026-06-06"
                  const [, month, d] = day.date.split('-').map(Number);
                  const date = new Date(2000, month - 1, d);
                  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                })()}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#c0c0c0' }}>
              {explanation.subtitle}
            </div>
          </>
        ) : (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#e0e0e0',
              textAlign: 'center',
            }}
          >
            Western Zodiac Signs Cusp Learning Wheel
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px',
          flex: 1,
          overflowY: 'auto',
          animation: day ? 'panelFade 0.35s ease-out' : undefined,
        }}
      >
        {!day || !explanation ? (
          <IdlePanel />
        ) : (
          <>
            {/* Sign badges */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              <SignBadge sign={day.primarySign} percent={primaryPercent} />
              {day.blendSign && blendPercent > 0 && (
                <SignBadge sign={day.blendSign} percent={blendPercent} />
              )}
            </div>

            {/* Blend bar visualization */}
            <BlendBar
              primary={day.primarySign}
              blend={day.blendSign}
              primaryPercent={primaryPercent}
              blendPercent={blendPercent}
            />

            {/* Elemental Balance - shows elements as weather, not math */}
            <ElementalBalance day={day} />

            {/* Main body */}
            <div
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.7',
                color: '#ddd',
              }}
            >
              {explanation.body}
            </div>

            {/* Detailed sections */}
            {expanded && (
              <>
                <Section title="Identity Tone" icon="🪞" color="#e8b4b8">
                  {explanation.identityTone}
                </Section>

                <Section title="Behavioral Tendencies" icon="🎯" color="#84b6f4">
                  {explanation.behavior}
                </Section>

                <Section title="Motivational Drivers" icon="🔥" color="#fdfd96">
                  {explanation.motivation}
                </Section>

                <Section title="Shadow Patterns" icon="🌑" color="#b19cd9">
                  {explanation.shadow}
                </Section>

                <Section title="Growth Opportunity" icon="🌱" color="#77dd77">
                  {explanation.growth}
                </Section>
              </>
            )}

            {/* Luna's Insight */}
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.15), rgba(255, 182, 193, 0.15))',
                borderRadius: '8px',
                borderLeft: '3px solid #9370db',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#9370db',
                  marginBottom: '8px',
                }}
              >
                Luna's Insight
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: '#d8bfd8',
                  lineHeight: '1.6',
                }}
              >
                "{explanation.lunaInsight}"
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer - Keywords */}
      {day && explanation && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {SIGN_META[day.primarySign].keywords.map((keyword) => (
              <span
                key={keyword}
                style={{
                  padding: '2px 8px',
                  fontSize: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#c0c0c0',
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes panelBreathe {
          0%   { transform: scale(1); opacity: 0.92; }
          50%  { transform: scale(1.012); opacity: 1; }
          100% { transform: scale(1); opacity: 0.92; }
        }

        @keyframes panelFade {
          0%   { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes rippleWave {
          0%   { box-shadow: inset 0 0 0 0 rgba(255,255,255,0.25); }
          70%  { box-shadow: inset 0 0 18px 12px rgba(255,255,255,0.10); }
          100% { box-shadow: inset 0 0 0 0 rgba(255,255,255,0.0); }
        }

        @keyframes heartbeat {
          0%   { transform: scale(1); }
          10%  { transform: scale(1.015); }
          20%  { transform: scale(1); }
          30%  { transform: scale(1.02); }
          40%  { transform: scale(1); }
          100% { transform: scale(1); }
        }

        /* ELEMENT-SPECIFIC BREATH ANIMATIONS */

        /* Fire: quick, warm, flickering */
        @keyframes fireFlicker {
          0%   { transform: scale(1); opacity: 0.90; filter: brightness(1); }
          25%  { transform: scale(1.008); opacity: 0.95; filter: brightness(1.02); }
          50%  { transform: scale(1.015); opacity: 1; filter: brightness(1.05); }
          75%  { transform: scale(1.005); opacity: 0.97; filter: brightness(1.01); }
          100% { transform: scale(1); opacity: 0.90; filter: brightness(1); }
        }

        /* Earth: slow, grounded, steady */
        @keyframes earthBreathe {
          0%   { transform: scale(1) translateY(0); opacity: 0.94; }
          50%  { transform: scale(1.008) translateY(-1px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 0.94; }
        }

        /* Air: light, shimmering */
        @keyframes airShimmer {
          0%   { transform: scale(1); opacity: 0.88; filter: blur(0px); }
          33%  { transform: scale(1.006); opacity: 0.95; filter: blur(0.2px); }
          66%  { transform: scale(1.012); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 0.88; filter: blur(0px); }
        }

        /* Water: fluid, wave-like */
        @keyframes waterWave {
          0%   { transform: scale(1) translateY(0); opacity: 0.90; }
          25%  { transform: scale(1.005) translateY(-0.5px); opacity: 0.95; }
          50%  { transform: scale(1.012) translateY(-1px); opacity: 1; }
          75%  { transform: scale(1.005) translateY(-0.5px); opacity: 0.95; }
          100% { transform: scale(1) translateY(0); opacity: 0.90; }
        }

        .zodiac-explanation-panel {
          transform-origin: center center;
          position: relative;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// COMPACT VERSION (with breathing)
// =============================================================================

export const ZodiacExplanationPanelCompact: React.FC<ZodiacExplanationPanelProps> = ({
  day,
  className = '',
  breathe = true,
}) => {
  // Validate day object before calling explanation engine
  const isValidDay = day && day.primarySign && day.date && typeof day.cuspType === 'string';
  const explanation = isValidDay ? getExplanationForDayBlend(day) : null;

  const element = day ? SIGN_ELEMENTS[day.primarySign] : 'Fire';
  const glow = ELEMENT_GLOW[element];
  const isCusp = day?.cuspType !== 'none' && day?.cuspDay > 0;
  const breathDuration = isCusp && day?.cuspDay
    ? BREATH_SPEED[day.cuspDay] || PURE_SIGN_BREATH_SPEED
    : PURE_SIGN_BREATH_SPEED;

  if (!day || !explanation) {
    return (
      <div
        className={className}
        style={{
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.85)',
          color: '#ddd',
          borderRadius: '8px',
          fontSize: '13px',
        }}
      >
        Hover over any day in the wheel to see how its blend shapes identity.
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.9)',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '13px',
        lineHeight: 1.5,
        maxWidth: '320px',
        animation: breathe ? `panelBreathe ${breathDuration}s ease-in-out infinite` : undefined,
        boxShadow: `0 0 12px ${glow}`,
        transition: 'box-shadow 0.4s ease-out',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
        {day.date} — {explanation.title}
      </div>
      <div style={{ marginBottom: '8px', color: '#c0c0c0' }}>
        {SIGN_GLYPHS[day.primarySign]} {day.primarySign}{' '}
        {Math.round((1 - (day.blendPercent || 0)) * 100)}%
        {day.blendSign && day.blendPercent > 0 && (
          <span>
            {' / '}
            {SIGN_GLYPHS[day.blendSign]} {day.blendSign}{' '}
            {Math.round(day.blendPercent * 100)}%
          </span>
        )}
      </div>
      <div style={{ color: '#e8e8e8' }}>{explanation.identityTone}</div>

      <style>{`
        @keyframes panelBreathe {
          0%   { transform: scale(1); opacity: 0.92; }
          50%  { transform: scale(1.012); opacity: 1; }
          100% { transform: scale(1); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ZodiacExplanationPanel;
