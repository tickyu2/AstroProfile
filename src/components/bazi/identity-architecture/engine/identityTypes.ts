/**
 * Identity Architecture — Type Definitions
 *
 * Shared types for the Heaven-Earth-Human psychological engine.
 */

import type { AlignmentData } from '../../../../utils/baziWheels';

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type PillarRole = 'Year' | 'Month' | 'Day' | 'Hour';

/** Shape consumed from calculateBaZi().pillars */
export interface BaZiPillar {
  name: string;
  stem: { element: string; polarity: string; index: number; char: string; english: string };
  branch: { element: string; polarity: string; index: number; char: string; animal: string };
  hiddenRoots?: Array<{ stem: string; pct: number; type: string; meaning: string }>;
}

export interface HeavenPersonality {
  dominant: Element;
  cognitiveStyle: string;
  worldview: string;
  decisionLogic: string;
  strengths: string[];
  blindSpots: string[];
}

export interface EarthPersonality {
  dominant: Element;
  instincts: string;
  stressBehaviors: string;
  habits: string;
  somaticPatterns: string;
}

export interface HumanPersonality {
  dominant: Element;
  emotionalNeeds: string;
  motivations: string;
  shadowDesires: string;
  subconsciousFears: string;
}

export interface IdentityTension {
  elementalConflicts: TensionItem[];
  roleConflicts: TensionItem[];
  subconsciousConflicts: TensionItem[];
}

/** Enriched tension item with source/target for diagram interaction */
export interface TensionItem {
  text: string;
  sourcePillar: number;   // pillar index (0-3)
  targetPillar: number;   // pillar index or -1 for self
  severity: number;       // 1 = mild, 2 = moderate, 3 = strong
  category: 'elemental' | 'role' | 'subconscious';
}

export interface IdentityArchitecture {
  heavenPersonality: HeavenPersonality;
  earthPersonality: EarthPersonality;
  humanPersonality: HumanPersonality;
  alignmentScore: number;           // 0-12
  internalCoherenceIndex: number;   // 0-100
  identityTension: IdentityTension;
  tensionSeverity: number;          // 0-1, drives D3 animation intensity
  contradictionNarrative: string;
  pillarAlignments: AlignmentData[];
}
