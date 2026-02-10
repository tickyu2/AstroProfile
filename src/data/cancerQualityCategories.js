// Quality Categories Definition
// Defines all the qualities we measure across Cancer zones

export const qualityCategories = [
  {
    id: 'emotionalDepth',
    label: 'Emotional Depth',
    icon: '\uD83C\uDF0A',
    maxLevel: 5,
    description: 'Depth and richness of emotional experience \u2014 the Cancer hallmark',
    lowDescription: 'Processes emotions at surface level',
    highDescription: 'Experiences emotions at oceanic depth'
  },
  {
    id: 'nurturingInstinct',
    label: 'Nurturing',
    icon: '\uD83E\uDD31',
    maxLevel: 5,
    description: 'Caregiving and nurturing drive \u2014 core Cancer expression',
    lowDescription: 'Supportive when asked',
    highDescription: 'Instinctive, unconditional caretaker'
  },
  {
    id: 'protectiveness',
    label: 'Protectiveness',
    icon: '\uD83D\uDEE1\uFE0F',
    maxLevel: 5,
    description: 'Defensive guardian instinct for loved ones',
    lowDescription: 'Trusting and open boundaries',
    highDescription: 'Fierce, impenetrable boundary defender'
  },
  {
    id: 'intuition',
    label: 'Intuition',
    icon: '\uD83D\uDD2E',
    maxLevel: 5,
    description: 'Psychic and intuitive capacity \u2014 Moon-governed sensitivity',
    lowDescription: 'Follows logical signals',
    highDescription: 'Psychic-level gut knowing'
  },
  {
    id: 'empathy',
    label: 'Empathy',
    icon: '\u2764\uFE0F',
    maxLevel: 5,
    description: 'Ability to feel others\' emotions as your own',
    lowDescription: 'Sympathetic understanding',
    highDescription: 'Complete emotional absorption'
  },
  {
    id: 'memoryRetention',
    label: 'Memory',
    icon: '\uD83E\uDDE0',
    maxLevel: 5,
    description: 'Emotional memory retention and recall',
    lowDescription: 'Lets go of past experiences',
    highDescription: 'Perfect emotional recall, never forgets'
  },
  {
    id: 'patience',
    label: 'Patience',
    icon: '\u23F3',
    maxLevel: 5,
    description: 'Ability to wait, endure, and persist',
    lowDescription: 'Needs emotional resolution quickly',
    highDescription: 'Infinite patience for loved ones'
  },
  {
    id: 'independence',
    label: 'Independence',
    icon: '\uD83E\uDDED',
    maxLevel: 5,
    description: 'Self-reliance and emotional autonomy',
    lowDescription: 'Needs constant emotional support',
    highDescription: 'Can self-soothe and stand alone'
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: '\u26A1',
    maxLevel: 5,
    description: 'Action and decision speed',
    lowDescription: 'Slow, deliberate emotional processing',
    highDescription: 'Quick emotional reads and responses'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '\uD83C\uDFB2',
    maxLevel: 5,
    description: 'Comfort with uncertainty and the unknown',
    lowDescription: 'Needs safe, familiar territory',
    highDescription: 'Can venture beyond comfort zone'
  }
];

// Quality comparison helper functions
export const getQualityColor = (level) => {
  if (level >= 80) return '#4CAF50'; // High - Green
  if (level >= 60) return '#8BC34A'; // Medium-High - Light Green
  if (level >= 40) return '#FFC107'; // Medium - Amber
  if (level >= 20) return '#FF9800'; // Low-Medium - Orange
  return '#F44336'; // Low - Red
};

export const getQualityLabel = (level) => {
  if (level >= 90) return 'Very High';
  if (level >= 70) return 'High';
  if (level >= 50) return 'Medium';
  if (level >= 30) return 'Low-Medium';
  return 'Low';
};

export const compareQualityAcrossZones = (zones, qualityId) => {
  const levels = zones.map(zone => zone.qualities[qualityId].level);
  const max = Math.max(...levels);
  const min = Math.min(...levels);
  const range = max - min;
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;

  return {
    range,
    max,
    min,
    avg: Math.round(avg),
    maxZone: zones.find(z => z.qualities[qualityId].level === max),
    minZone: zones.find(z => z.qualities[qualityId].level === min)
  };
};

export default qualityCategories;
