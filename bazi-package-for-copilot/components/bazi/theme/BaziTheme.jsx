/**
 * BaZi Theme Provider
 * Provides consistent styling for all BaZi modular components
 * Follows Copilot's atomic design pattern, integrated with app
 */

import React, { createContext, useContext } from 'react';

// Element colors following Five Elements system
const ELEMENT_COLORS = {
  Wood: '#22c55e',   // Green - growth, vitality
  Fire: '#ef4444',   // Red - passion, energy
  Earth: '#f59e0b',  // Amber - stability, grounding
  Metal: '#a1a1aa',  // Gray - precision, clarity
  Water: '#3b82f6'   // Blue - wisdom, flow
};

// Default theme configuration
export const defaultBaziTheme = {
  colors: {
    background: '#0f172a',
    card: '#1e293b',
    cardLight: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    muted: '#94a3b8',
    border: '#475569',
    borderLight: '#64748b',
    elements: ELEMENT_COLORS,
    accent: '#8b5cf6',
    accentLight: 'rgba(139, 92, 246, 0.2)'
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'Noto Sans SC', 'JetBrains Mono', monospace",
    chinese: "'Noto Sans SC', 'Ma Shan Zheng', serif"
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.3)',
    lg: '0 8px 24px rgba(0,0,0,0.4)'
  }
};

// Light theme variant (for use in light mode pages)
export const lightBaziTheme = {
  ...defaultBaziTheme,
  colors: {
    ...defaultBaziTheme.colors,
    background: '#f8fafc',
    card: '#ffffff',
    cardLight: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#475569',
    muted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#cbd5e1'
  }
};

// Theme Context
const BaziThemeContext = createContext(defaultBaziTheme);

// Theme Provider Component
export const BaziThemeProvider = ({ theme = 'dark', customTheme, children }) => {
  const baseTheme = theme === 'light' ? lightBaziTheme : defaultBaziTheme;

  // Merge custom theme if provided
  const mergedTheme = customTheme
    ? { ...baseTheme, ...customTheme, colors: { ...baseTheme.colors, ...customTheme?.colors } }
    : baseTheme;

  return (
    <BaziThemeContext.Provider value={mergedTheme}>
      {children}
    </BaziThemeContext.Provider>
  );
};

// Hook to use theme
export const useBaziTheme = () => useContext(BaziThemeContext);

// Utility: Get element color
export const getElementColor = (element) => {
  return ELEMENT_COLORS[element] || '#888888';
};

// Utility: Get element icon
export const getElementIcon = (element) => {
  const icons = {
    Wood: '🌳',
    Fire: '🔥',
    Earth: '⛰️',
    Metal: '⚙️',
    Water: '💧'
  };
  return icons[element] || '❓';
};

export default BaziThemeProvider;
