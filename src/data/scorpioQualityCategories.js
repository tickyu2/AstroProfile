// Quality Categories Definition for Scorpio
// Defines all the qualities we measure across Scorpio zones

export const qualityCategories = [
  {
    id: 'emotionalIntensity',
    label: 'Emotional Intensity',
    icon: '🔥',
    maxLevel: 5,
    description: 'Depth and power of emotional experience — the Scorpio hallmark',
    lowDescription: 'Emotionally measured and controlled',
    highDescription: 'All-consuming, volcanic emotional force'
  },
  {
    id: 'transformativePower',
    label: 'Transformation',
    icon: '🦅',
    maxLevel: 5,
    description: 'Ability to destroy and rebuild — death-rebirth phoenix energy',
    lowDescription: 'Adapts gradually to change',
    highDescription: 'Burns everything down and rises anew'
  },
  {
    id: 'psychologicalInsight',
    label: 'Psychological Insight',
    icon: '🔮',
    maxLevel: 5,
    description: 'X-ray vision into human motivation and hidden dynamics',
    lowDescription: 'Takes people at face value',
    highDescription: 'Sees through every mask and motive'
  },
  {
    id: 'loyalty',
    label: 'Loyalty',
    icon: '🛡️',
    maxLevel: 5,
    description: 'Depth of devotion and commitment to chosen few',
    lowDescription: 'Flexible allegiances',
    highDescription: 'Ride-or-die loyalty beyond death'
  },
  {
    id: 'magnetism',
    label: 'Magnetism',
    icon: '🧲',
    maxLevel: 5,
    description: 'Irresistible personal pull and mysterious allure',
    lowDescription: 'Quiet, understated presence',
    highDescription: 'Hypnotic, impossible-to-ignore intensity'
  },
  {
    id: 'secretiveness',
    label: 'Secretiveness',
    icon: '🤫',
    maxLevel: 5,
    description: 'Need for privacy, mystery, and hidden depths',
    lowDescription: 'Open and transparent',
    highDescription: 'Absolute mystery, reveals nothing'
  },
  {
    id: 'regeneration',
    label: 'Regeneration',
    icon: '🔄',
    maxLevel: 5,
    description: 'Capacity to rise from destruction and start anew',
    lowDescription: 'Recovers slowly from setbacks',
    highDescription: 'Infinite phoenix power, rises from ashes'
  },
  {
    id: 'obsessiveness',
    label: 'Obsessiveness',
    icon: '🎯',
    maxLevel: 5,
    description: 'Single-minded fixation and all-consuming focus',
    lowDescription: 'Moderate, balanced attention',
    highDescription: 'All-consuming, relentless fixation'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Slow and strategic patience',
    highDescription: 'Swift and decisive when obsessed'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to embrace danger and the unknown',
    lowDescription: 'Cautious and calculating',
    highDescription: 'Fearless in the face of darkness'
  }
];

/**
 * Get color for a quality value (deep red/indigo Scorpio scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#8B0000';      // Dark Red
  if (value >= 75) return '#660000';      // Blood Red
  if (value >= 60) return '#4B0082';      // Indigo
  if (value >= 45) return '#191970';      // Midnight Blue
  if (value >= 30) return '#483D8B';      // Dark Slate Blue
  return '#2F2F4F';                        // Dark Slate Gray
}

/**
 * Get label for a quality value
 */
export function getQualityLabel(value) {
  if (value >= 90) return 'Maximum';
  if (value >= 75) return 'Very High';
  if (value >= 60) return 'High';
  if (value >= 45) return 'Medium';
  if (value >= 30) return 'Low-Medium';
  return 'Low';
}

/**
 * Compare a quality across all zones
 */
export function compareQualityAcrossZones(zones, qualityId) {
  return zones.map(zone => ({
    zoneId: zone.id,
    zoneName: zone.name,
    value: zone.qualities[qualityId]?.level || 0,
    label: zone.qualities[qualityId]?.label || 'N/A'
  }));
}

export default qualityCategories;
