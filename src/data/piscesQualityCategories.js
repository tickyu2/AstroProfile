// Quality Categories Definition for Pisces
// Defines all the qualities we measure across Pisces zones

export const qualityCategories = [
  {
    id: 'spiritualConnection',
    label: 'Spiritual Connection',
    icon: '🔮',
    maxLevel: 5,
    description: 'Direct connection to the divine and transcendent — the Pisces hallmark',
    lowDescription: 'Grounded in material world',
    highDescription: 'Merged with divine consciousness'
  },
  {
    id: 'compassion',
    label: 'Compassion',
    icon: '💗',
    maxLevel: 5,
    description: 'Universal love and caring for all beings',
    lowDescription: 'Self-focused',
    highDescription: 'Loves all beings unconditionally'
  },
  {
    id: 'empathy',
    label: 'Empathy',
    icon: '🤲',
    maxLevel: 5,
    description: 'Ability to feel what others feel — psychic emotional absorption',
    lowDescription: 'Emotionally self-contained',
    highDescription: 'Feels everything from everyone'
  },
  {
    id: 'intuition',
    label: 'Intuition',
    icon: '👁️',
    maxLevel: 5,
    description: 'Direct knowing beyond logic — cosmic psychic awareness',
    lowDescription: 'Relies on logic and evidence',
    highDescription: 'Knows everything through cosmic intuition'
  },
  {
    id: 'imagination',
    label: 'Imagination',
    icon: '🌈',
    maxLevel: 5,
    description: 'Boundless creative vision and fantasy capacity',
    lowDescription: 'Practical and concrete',
    highDescription: 'Infinite creative universes within'
  },
  {
    id: 'artisticExpression',
    label: 'Artistic Expression',
    icon: '🎨',
    maxLevel: 5,
    description: 'Ability to channel transcendent beauty into art',
    lowDescription: 'Functional and practical',
    highDescription: 'Channels divine beauty into pure art'
  },
  {
    id: 'selflessness',
    label: 'Selflessness',
    icon: '🕊️',
    maxLevel: 5,
    description: 'Capacity for sacrifice and ego transcendence',
    lowDescription: 'Self-interested',
    highDescription: 'Complete ego dissolution for others'
  },
  {
    id: 'boundaryDissolution',
    label: 'Boundary Dissolution',
    icon: '🌊',
    maxLevel: 5,
    description: 'Ability to merge, dissolve, and transcend all boundaries',
    lowDescription: 'Maintains firm boundaries',
    highDescription: 'No boundaries — merges with everything'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Timeless spiritual flow',
    highDescription: 'Spiritual warrior decisiveness'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to take faith-based leaps',
    lowDescription: 'Needs spiritual certainty',
    highDescription: 'Fearless faith in divine guidance'
  }
];

/**
 * Get color for a quality value (mystical purple/violet Pisces scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#7B68EE';      // Medium Slate Blue
  if (value >= 75) return '#9370DB';      // Medium Purple
  if (value >= 60) return '#9966CC';      // Amethyst
  if (value >= 45) return '#663399';      // Rebecca Purple
  if (value >= 30) return '#DDA0DD';      // Plum
  return '#DA70D6';                        // Orchid
}

/**
 * Get label for a quality value
 */
export function getQualityLabel(value) {
  if (value >= 95) return 'Maximum';
  if (value >= 85) return 'Very High';
  if (value >= 70) return 'High';
  if (value >= 55) return 'Medium-High';
  if (value >= 40) return 'Medium';
  if (value >= 25) return 'Low-Medium';
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
