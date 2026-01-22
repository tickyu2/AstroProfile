/**
 * Personality Components Index
 * Exports all personality-related components for Luna Fusion system
 *
 * P4: Natal Aspects - NatalAspectsPanel
 * P5: Transits - TransitsPanel
 * P6: Synastry - see compatibility/ folder
 * P7: Archetypes - JungianArchetypePanel
 * P8: Progressions - ProgressionsPanel
 */

// Core Personality Components
export { default as PersonalityFusionPanel } from './PersonalityFusionPanel';
export { default as PersonalityFeedback } from './PersonalityFeedback';

// P4: Natal Aspects
export { default as NatalAspectsPanel } from './NatalAspectsPanel';

// P5: Current Transits
export { default as TransitsPanel } from './TransitsPanel';

// P7: Jungian Archetypes
export { default as JungianArchetypePanel } from './JungianArchetypePanel';

// P8: Secondary Progressions
export { default as ProgressionsPanel } from './ProgressionsPanel';
