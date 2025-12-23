/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SOUL VISUALIZER - Audio-Reactive Visual Representation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Creates a pulsing "soul" visualization that reacts to Luna's voice:
 * - Audio amplitude drives scale and glow intensity
 * - Constitutional colors based on user's elemental nature
 * - Breathing animation when idle
 * - Tone-aware color shifts for emotional resonance
 *
 * Created: December 21, 2025
 * Mission: "Make the invisible visible - the soul behind the voice"
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './SoulVisualizer.css';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTIONAL COLOR MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Elemental color palettes based on Five Elements
 * Each element has primary, secondary, and glow colors
 */
const ELEMENTAL_PALETTES = {
  Fire: {
    primary: '#FF6B6B',
    secondary: '#FFA07A',
    glow: 'rgba(255, 107, 107, 0.8)',
    gradient: 'radial-gradient(circle, #FF6B6B 0%, #FF4500 50%, #8B0000 100%)',
    aura: 'rgba(255, 69, 0, 0.4)',
    description: 'Radiant flame energy'
  },
  Water: {
    primary: '#4ECDC4',
    secondary: '#87CEEB',
    glow: 'rgba(78, 205, 196, 0.8)',
    gradient: 'radial-gradient(circle, #87CEEB 0%, #4ECDC4 50%, #1E90FF 100%)',
    aura: 'rgba(30, 144, 255, 0.4)',
    description: 'Deep flowing wisdom'
  },
  Wood: {
    primary: '#90EE90',
    secondary: '#3CB371',
    glow: 'rgba(144, 238, 144, 0.8)',
    gradient: 'radial-gradient(circle, #90EE90 0%, #3CB371 50%, #228B22 100%)',
    aura: 'rgba(34, 139, 34, 0.4)',
    description: 'Growing life force'
  },
  Metal: {
    primary: '#C0C0C0',
    secondary: '#E8E8E8',
    glow: 'rgba(192, 192, 192, 0.9)',
    gradient: 'radial-gradient(circle, #FFFFFF 0%, #C0C0C0 50%, #808080 100%)',
    aura: 'rgba(192, 192, 192, 0.5)',
    description: 'Refined clarity'
  },
  Earth: {
    primary: '#DEB887',
    secondary: '#F4A460',
    glow: 'rgba(222, 184, 135, 0.8)',
    gradient: 'radial-gradient(circle, #F4A460 0%, #DEB887 50%, #8B4513 100%)',
    aura: 'rgba(139, 69, 19, 0.4)',
    description: 'Grounding stability'
  }
};

/**
 * Tone color modifiers - subtle shifts based on emotional tone
 */
const TONE_COLOR_SHIFTS = {
  soft: { hueShift: 0, saturation: 0.7, brightness: 0.9 },
  warm: { hueShift: 10, saturation: 0.9, brightness: 1.0 },
  gentle: { hueShift: -10, saturation: 0.6, brightness: 0.85 },
  thoughtful: { hueShift: -20, saturation: 0.5, brightness: 0.8 },
  reflective: { hueShift: -30, saturation: 0.4, brightness: 0.75 },
  curious: { hueShift: 15, saturation: 0.8, brightness: 1.1 },
  excited: { hueShift: 30, saturation: 1.2, brightness: 1.3 },
  joyful: { hueShift: 40, saturation: 1.3, brightness: 1.4 },
  playful: { hueShift: 25, saturation: 1.1, brightness: 1.2 },
  encouraging: { hueShift: 20, saturation: 1.0, brightness: 1.15 },
  serious: { hueShift: -40, saturation: 0.6, brightness: 0.7 },
  grounding: { hueShift: -50, saturation: 0.5, brightness: 0.65 },
  reassuring: { hueShift: -15, saturation: 0.7, brightness: 0.85 },
  compassionate: { hueShift: 5, saturation: 0.8, brightness: 0.95 },
  tender: { hueShift: -5, saturation: 0.75, brightness: 0.9 },
  neutral: { hueShift: 0, saturation: 1.0, brightness: 1.0 }
};

/**
 * Luna voice profile colors (matching voicePreferencesService)
 */
const LUNA_VOICE_COLORS = {
  affirmer: '#FF6B6B',   // Fire energy
  present: '#4ECDC4',    // Water presence
  embrace: '#F7DC6F',    // Warm earth
  guardian: '#45B7D1',   // Protective blue
  delight: '#FF9FF3'     // Playful pink
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const SoulVisualizer = ({
  audioRef,                    // Reference to audio element
  audioContext,                // Web Audio API context
  isSpeaking = false,          // Whether Luna is currently speaking
  constitution = 'Water',      // User's elemental constitution
  lunaVoice = 'present',       // Selected Luna voice profile
  currentTone = 'neutral',     // Current emotional tone
  size = 'medium',             // 'small', 'medium', 'large'
  showLabel = true,            // Show element label
  onVisualizerReady,           // Callback when visualizer is ready
  className = ''
}) => {
  const canvasRef = useRef(null);
  const coreRef = useRef(null);
  const requestRef = useRef();
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [currentAmplitude, setCurrentAmplitude] = useState(0);
  const [palette, setPalette] = useState(ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water);

  // Update palette when constitution changes
  useEffect(() => {
    setPalette(ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water);
  }, [constitution]);

  // Size configurations
  const sizeConfig = {
    small: { core: 60, container: 120 },
    medium: { core: 100, container: 200 },
    large: { core: 150, container: 300 }
  };

  const dimensions = sizeConfig[size] || sizeConfig.medium;

  /**
   * Connect to audio source for analysis
   */
  const connectAudioSource = useCallback(() => {
    if (!audioRef?.current || isConnected) return;

    try {
      // Use provided context or create new one
      const ctx = audioContext || audioContextRef.current ||
                  new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create analyser
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small for smooth pulse effect
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect audio source
      if (!sourceRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      }

      setIsConnected(true);
      console.log('[SoulVisualizer] Connected to audio source');

      if (onVisualizerReady) {
        onVisualizerReady(true);
      }
    } catch (error) {
      console.error('[SoulVisualizer] Error connecting audio:', error);
    }
  }, [audioRef, audioContext, isConnected, onVisualizerReady]);

  /**
   * Animation loop - updates visuals based on audio amplitude
   */
  useEffect(() => {
    if (!isConnected || !analyserRef.current || !coreRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average amplitude
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const normalizedAmplitude = average / 255;

      setCurrentAmplitude(normalizedAmplitude);

      // Apply tone color shifts
      const toneShift = TONE_COLOR_SHIFTS[currentTone] || TONE_COLOR_SHIFTS.neutral;

      // Calculate visual properties
      const scale = 1 + normalizedAmplitude * 0.8;
      const glowIntensity = normalizedAmplitude * 60;
      const brightness = toneShift.brightness * (1 + normalizedAmplitude * 0.3);

      if (coreRef.current) {
        coreRef.current.style.transform = `scale(${scale})`;
        coreRef.current.style.filter = `
          brightness(${brightness})
          saturate(${toneShift.saturation})
          hue-rotate(${toneShift.hueShift}deg)
          drop-shadow(0 0 ${glowIntensity}px ${palette.glow})
        `;
        coreRef.current.style.boxShadow = `
          0 0 ${glowIntensity * 0.5}px ${palette.glow},
          0 0 ${glowIntensity}px ${palette.aura},
          inset 0 0 ${glowIntensity * 0.3}px rgba(255, 255, 255, 0.3)
        `;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    if (isSpeaking) {
      animate();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isConnected, isSpeaking, currentTone, palette]);

  /**
   * Try to connect when audioRef becomes available
   */
  useEffect(() => {
    if (audioRef?.current && !isConnected) {
      // Wait for audio to be ready
      const handleCanPlay = () => connectAudioSource();
      audioRef.current.addEventListener('canplay', handleCanPlay);

      // Also try connecting immediately if already loaded
      if (audioRef.current.readyState >= 2) {
        connectAudioSource();
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, [audioRef, isConnected, connectAudioSource]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // Don't close audio context as it might be shared
    };
  }, []);

  // Get Luna voice color accent
  const voiceAccent = LUNA_VOICE_COLORS[lunaVoice] || LUNA_VOICE_COLORS.present;

  return (
    <div
      className={`soul-visualizer-container ${className} ${isSpeaking ? 'speaking' : 'idle'}`}
      style={{
        '--soul-primary': palette.primary,
        '--soul-secondary': palette.secondary,
        '--soul-glow': palette.glow,
        '--soul-aura': palette.aura,
        '--soul-gradient': palette.gradient,
        '--luna-accent': voiceAccent,
        '--container-size': `${dimensions.container}px`,
        '--core-size': `${dimensions.core}px`
      }}
    >
      {/* Outer aura rings */}
      <div className="soul-aura soul-aura-1" />
      <div className="soul-aura soul-aura-2" />
      <div className="soul-aura soul-aura-3" />

      {/* Core soul visualization */}
      <div
        ref={coreRef}
        className={`soul-core ${isSpeaking ? 'active' : 'breathing'}`}
        style={{ background: palette.gradient }}
      >
        {/* Inner light */}
        <div className="soul-inner-light" />

        {/* Particle effects */}
        <div className="soul-particles">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--angle': `${i * 45}deg`
              }}
            />
          ))}
        </div>
      </div>

      {/* Element label */}
      {showLabel && (
        <div className="soul-label">
          <span className="element-name">{constitution}</span>
          {isSpeaking && currentTone !== 'neutral' && (
            <span className="tone-indicator">{currentTone}</span>
          )}
        </div>
      )}

      {/* Audio amplitude indicator (debug/visual feedback) */}
      {isSpeaking && (
        <div
          className="amplitude-ring"
          style={{
            transform: `scale(${1 + currentAmplitude * 0.5})`,
            opacity: 0.3 + currentAmplitude * 0.5
          }}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI VISUALIZER (For inline use in chat)
// ═══════════════════════════════════════════════════════════════════════════════

export const SoulVisualizerMini = ({
  isSpeaking = false,
  constitution = 'Water',
  className = ''
}) => {
  const palette = ELEMENTAL_PALETTES[constitution] || ELEMENTAL_PALETTES.Water;

  return (
    <div
      className={`soul-mini ${className} ${isSpeaking ? 'speaking' : ''}`}
      style={{
        '--soul-primary': palette.primary,
        '--soul-glow': palette.glow
      }}
    >
      <div className="soul-mini-core" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { ELEMENTAL_PALETTES, TONE_COLOR_SHIFTS, LUNA_VOICE_COLORS };
export default SoulVisualizer;
