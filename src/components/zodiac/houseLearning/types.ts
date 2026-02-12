// ============================================================================
// HOUSE LEARNING PANEL — Type Definitions
// ============================================================================

export interface HouseLearningPanelProps {
  houseNumber: number;  // 0-12 (0 = Intro)
  onClose: () => void;
  chartData?: Record<string, unknown>;  // For future personalization
}

// Tab type for navigation
export type TabValue = 'intro' | 'signs' | 'zones' | number;

export interface ZodiacSignContent {
  symbol: string;
  name: string;
  archetype: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  season: string;
  ruler: string;
  rulerSymbol: string;
  naturalHouse: number;
  keyword: string;
  bodyPart: string;
  coreSignificance: {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    emotion: string;
  };
  positiveTraits: string[];
  challenges: string[];
  lifeLesson: string;
  careerStrengths: string;
  moonIn: string;
  ascendantIn: string;
  venusIn: string;
  marsIn: string;
}

export interface ZoneDetail {
  zone: number;
  degrees: string;
  name: string;
  coreQuality: string;
  characteristics: string[];
  sunModifier: string;
  moonModifier: string;
  ascendantModifier: string;
  example: string;
}

export interface SignZoneData {
  sign: string;
  symbol: string;
  essence: string;
  element: string;
  modality: string;
  season: string;
  zones: ZoneDetail[];
}

export interface PlanetContent {
  symbol: string;
  name: string;
  archetype: string;
  quickSummary: string;
  fiveW: {
    who: string;
    what: string;
    when: string;
    where: string;
    why: string;
    how: string;
    emotion: string;
  };
  characteristics: string[];
  challenges: string[];
  gifts: string[];
  realWorldExample: string;
  zoneVariations: {
    beginning: { title: string; description: string; emotion: string };
    core: { title: string; description: string; emotion: string };
    transition: { title: string; description: string; emotion: string };
  };
}
