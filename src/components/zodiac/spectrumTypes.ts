/**
 * Shared types for the 12 SpectrumExplorer components.
 * Matches the zone data shape from src/data/[sign]Zones.js
 */

export interface ZoneInfluence {
  source: string;
  type: string;
  planet: string;
  percentage: number;
  traits: string[];
}

export interface ZoneQuality {
  level: number;
  label: string;
  icon: string;
}

export interface ZoneFamousExample {
  name: string;
  birthdate: string;
  degree: string;
  notes: string;
}

export interface ZoneRelationshipStyle {
  pursuit: string;
  commitmentSpeed: string;
  passion: string;
  conflict: string;
  jealousy: string;
}

export interface ZoneDegreeRange {
  start: number;
  end: number;
  absoluteStart: number;
  absoluteEnd: number;
}

export interface ZoneDateRange {
  start: string;
  end: string;
  duration: string;
}

export interface ZoneDecan {
  number: number;
  name: string;
  primaryRuler: string;
  subRuler: string;
  modality: string;
}

export interface ZonePlanetaryRuler {
  planet: string;
  influence: number;
  meaning: string;
}

export interface ZoneSabianSymbol {
  degree: number;
  symbol: string;
  interpretation: string;
}

export interface ZoneNakshatra {
  name: string;
  range: string;
  ruler: string;
  symbol: string;
  deity: string;
  qualities: string[];
}

export interface ZoneColorTheme {
  primary: string;
  secondary: string;
  gradient: string;
}

export interface Zone {
  id: number;
  name: string;
  archetype: string;
  description: string;
  degreeRange: ZoneDegreeRange;
  dateRange: ZoneDateRange;
  decan: ZoneDecan;
  influences: ZoneInfluence[];
  elementalMix: Record<string, number>;
  planetaryRulers: {
    primary: ZonePlanetaryRuler;
    secondary: ZonePlanetaryRuler;
    tertiary: ZonePlanetaryRuler;
  };
  qualities: Record<string, ZoneQuality>;
  strengths: string[];
  shadows: string[];
  careerSignatures: string[];
  relationshipStyle: ZoneRelationshipStyle;
  famousExamples: ZoneFamousExample[];
  sabianSymbol: ZoneSabianSymbol;
  nakshatra: ZoneNakshatra;
  colorTheme: ZoneColorTheme;
}

export interface QualityCategory {
  id: string;
  label: string;
  icon: string;
  maxLevel: number;
  description: string;
  lowDescription: string;
  highDescription: string;
}
