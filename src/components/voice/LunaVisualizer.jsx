/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA VISUALIZER - Canvas-Based Audio Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Beautiful, responsive visualization that reflects Luna's current state:
 * - IDLE: Gentle breathing glow with soft particle drift
 * - LISTENING: Responsive audio waveform with ripple effects
 * - THINKING: Orbiting particles with neural network connections
 * - SPEAKING: Pulsing orb with emanating sound waves
 *
 * Uses requestAnimationFrame for smooth 60fps animation
 *
 * @module LunaVisualizer
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { VOICE_STATES } from '../../services/voiceService';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  primary: '#8B5CF6',      // Purple - Luna's signature color
  secondary: '#EC4899',     // Pink accent
  tertiary: '#06B6D4',      // Cyan accent
  background: '#0F172A',    // Dark slate
  glow: 'rgba(139, 92, 246, 0.3)',
  particle: 'rgba(236, 72, 153, 0.6)'
};

const PARTICLE_COUNT = 50;
const CENTER_RADIUS = 80;

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class Particle {
  constructor(canvasWidth, canvasHeight, centerX, centerY) {
    this.reset(canvasWidth, canvasHeight, centerX, centerY);
  }

  reset(canvasWidth, canvasHeight, centerX, centerY) {
    const angle = Math.random() * Math.PI * 2;
    const distance = CENTER_RADIUS + Math.random() * 100;

    this.x = centerX + Math.cos(angle) * distance;
    this.y = centerY + Math.sin(angle) * distance;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 3 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
    this.angle = angle;
    this.orbitSpeed = (Math.random() - 0.5) * 0.02;
    this.orbitRadius = distance;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  update(state, audioLevel) {
    switch (state) {
      case VOICE_STATES.IDLE:
        // Gentle drift
        this.x += this.vx;
        this.y += this.vy;
        this.alpha = 0.3 + Math.sin(Date.now() * 0.001 + this.angle) * 0.1;
        break;

      case VOICE_STATES.LISTENING:
        // React to audio
        const reactivity = 1 + audioLevel * 3;
        this.orbitRadius = CENTER_RADIUS + 50 + audioLevel * 100;
        this.angle += this.orbitSpeed * reactivity;
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
        this.alpha = 0.4 + audioLevel * 0.5;
        break;

      case VOICE_STATES.THINKING:
        // Orbital motion with connections
        this.angle += this.orbitSpeed * 2;
        this.orbitRadius = CENTER_RADIUS + 60 + Math.sin(Date.now() * 0.002 + this.angle * 2) * 30;
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
        this.alpha = 0.5 + Math.sin(Date.now() * 0.003 + this.angle) * 0.2;
        break;

      case VOICE_STATES.SPEAKING:
        // Pulsing expansion
        const pulse = Math.sin(Date.now() * 0.005) * 20;
        this.orbitRadius = CENTER_RADIUS + 70 + pulse + audioLevel * 50;
        this.angle += this.orbitSpeed;
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
        this.alpha = 0.6;
        break;

      default:
        break;
    }
  }

  draw(ctx, color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color.replace('0.6', this.alpha.toString());
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LUNA VISUALIZER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const LunaVisualizer = ({
  state = VOICE_STATES.IDLE,
  audioData = null,
  audioLevel = 0,
  size = 300,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Initialize particles
  const initParticles = useCallback((width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;

    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push(new Particle(width, height, centerX, centerY));
    }
  }, []);

  // Draw center orb
  const drawCenterOrb = useCallback((ctx, centerX, centerY, state, audioLevel) => {
    const time = Date.now() * 0.001;
    let radius = CENTER_RADIUS;
    let glowIntensity = 0.3;

    // State-based modifications
    switch (state) {
      case VOICE_STATES.IDLE:
        radius = CENTER_RADIUS + Math.sin(time * 0.5) * 5;
        glowIntensity = 0.2 + Math.sin(time * 0.3) * 0.1;
        break;

      case VOICE_STATES.LISTENING:
        radius = CENTER_RADIUS + audioLevel * 30;
        glowIntensity = 0.3 + audioLevel * 0.4;
        break;

      case VOICE_STATES.THINKING:
        radius = CENTER_RADIUS + Math.sin(time * 2) * 10;
        glowIntensity = 0.4 + Math.sin(time * 4) * 0.2;
        break;

      case VOICE_STATES.SPEAKING:
        radius = CENTER_RADIUS + 10 + audioLevel * 40;
        glowIntensity = 0.5 + audioLevel * 0.3;
        break;

      default:
        break;
    }

    // Outer glow
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius * 2
    );
    gradient.addColorStop(0, `rgba(139, 92, 246, ${glowIntensity})`);
    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${glowIntensity * 0.5})`);
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Inner orb gradient
    const orbGradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );
    orbGradient.addColorStop(0, '#C4B5FD');
    orbGradient.addColorStop(0.5, COLORS.primary);
    orbGradient.addColorStop(1, '#6D28D9');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = orbGradient;
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.2, centerY - radius * 0.2, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();
  }, []);

  // Draw frequency visualization (for listening/speaking)
  const drawFrequencyBars = useCallback((ctx, centerX, centerY, frequencyData, state) => {
    if (!frequencyData || frequencyData.length === 0) return;

    const barCount = 32;
    const barWidth = 4;
    const maxBarHeight = 60;
    const baseRadius = CENTER_RADIUS + 20;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * (frequencyData.length / barCount));
      const value = frequencyData[dataIndex] / 255;
      const barHeight = value * maxBarHeight;

      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const x1 = centerX + Math.cos(angle) * baseRadius;
      const y1 = centerY + Math.sin(angle) * baseRadius;
      const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
      const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

      if (state === VOICE_STATES.SPEAKING) {
        gradient.addColorStop(0, COLORS.primary);
        gradient.addColorStop(1, COLORS.secondary);
      } else {
        gradient.addColorStop(0, COLORS.tertiary);
        gradient.addColorStop(1, COLORS.primary);
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = barWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }, []);

  // Draw thinking connections
  const drawConnections = useCallback((ctx, particles) => {
    const connectionDistance = 80;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const alpha = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, []);

  // Draw sound waves (for speaking)
  const drawSoundWaves = useCallback((ctx, centerX, centerY, audioLevel) => {
    const waveCount = 3;
    const time = Date.now() * 0.002;

    for (let i = 0; i < waveCount; i++) {
      const phase = (time + i * 0.5) % 2;
      const radius = CENTER_RADIUS + phase * 100;
      const alpha = (1 - phase / 2) * 0.3 * (0.5 + audioLevel);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, []);

  // Main render loop
  const render = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Delta time for smooth animation
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.centerX = centerX;
      particle.centerY = centerY;
      particle.update(state, audioLevel);
    });

    // Draw connections in thinking mode
    if (state === VOICE_STATES.THINKING) {
      drawConnections(ctx, particlesRef.current);
    }

    // Draw particles
    particlesRef.current.forEach(particle => {
      particle.draw(ctx, COLORS.particle);
    });

    // Draw sound waves in speaking mode
    if (state === VOICE_STATES.SPEAKING) {
      drawSoundWaves(ctx, centerX, centerY, audioLevel);
    }

    // Draw frequency visualization
    if (audioData && (state === VOICE_STATES.LISTENING || state === VOICE_STATES.SPEAKING)) {
      drawFrequencyBars(ctx, centerX, centerY, audioData.frequencyData, state);
    }

    // Draw center orb
    drawCenterOrb(ctx, centerX, centerY, state, audioLevel);

    // Continue animation
    animationRef.current = requestAnimationFrame(render);
  }, [state, audioLevel, audioData, drawCenterOrb, drawFrequencyBars, drawConnections, drawSoundWaves]);

  // Initialize and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Initialize particles
    initParticles(size, size);

    // Start animation
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, initParticles, render]);

  // Get state label
  const getStateLabel = () => {
    switch (state) {
      case VOICE_STATES.IDLE:
        return 'Ready';
      case VOICE_STATES.LISTENING:
        return 'Listening...';
      case VOICE_STATES.THINKING:
        return 'Thinking...';
      case VOICE_STATES.SPEAKING:
        return 'Speaking...';
      case VOICE_STATES.ERROR:
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className={`luna-visualizer ${className}`} style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: '50%',
          boxShadow: `0 0 60px ${COLORS.glow}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          color: COLORS.primary,
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          opacity: 0.8
        }}
      >
        {getStateLabel()}
      </div>
    </div>
  );
};

export default LunaVisualizer;
