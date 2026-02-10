// Quality Categories Definition for Libra
// Defines all the qualities we measure across Libra zones

export const qualityCategories = [
  {
    id: 'diplomacy',
    label: 'Diplomacy',
    icon: '🤝',
    maxLevel: 5,
    description: 'Ability to mediate, negotiate, and find harmonious solutions — the Libra hallmark',
    lowDescription: 'Direct and unfiltered communication',
    highDescription: 'Ultimate peacemaker and consensus builder'
  },
  {
    id: 'charm',
    label: 'Charm',
    icon: '✨',
    maxLevel: 5,
    description: 'Social magnetism and graceful appeal — Venus-governed allure',
    lowDescription: 'Understated and reserved presence',
    highDescription: 'Irresistible social magnetism'
  },
  {
    id: 'aestheticSense',
    label: 'Aesthetic Sense',
    icon: '🎨',
    maxLevel: 5,
    description: 'Eye for beauty, design, and visual harmony',
    lowDescription: 'Practical, function over form',
    highDescription: 'Exquisite taste, perfect aesthetic judgment'
  },
  {
    id: 'balanceSeeking',
    label: 'Balance Seeking',
    icon: '⚖️',
    maxLevel: 5,
    description: 'Drive to maintain equilibrium and fairness in all things',
    lowDescription: 'Comfortable with imbalance and extremes',
    highDescription: 'Cannot tolerate any form of imbalance'
  },
  {
    id: 'relationshipFocus',
    label: 'Relationship Focus',
    icon: '💕',
    maxLevel: 5,
    description: 'Orientation toward partnership and interpersonal connection',
    lowDescription: 'Independent and self-sufficient',
    highDescription: 'Needs partnership to feel complete'
  },
  {
    id: 'fairness',
    label: 'Fairness',
    icon: '⚖️',
    maxLevel: 5,
    description: 'Commitment to justice, equality, and fair treatment',
    lowDescription: 'Pragmatic about outcomes',
    highDescription: 'Obsessed with perfect justice for all'
  },
  {
    id: 'socialGrace',
    label: 'Social Grace',
    icon: '🌸',
    maxLevel: 5,
    description: 'Poise and elegance in social interactions',
    lowDescription: 'Casual and informal',
    highDescription: 'Perfectly polished social presence'
  },
  {
    id: 'indecisiveness',
    label: 'Indecisiveness',
    icon: '🔄',
    maxLevel: 5,
    description: 'Tendency to weigh all options to the point of paralysis',
    lowDescription: 'Decisive and action-oriented',
    highDescription: 'Paralyzed by seeing every perspective'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Slow and deliberate',
    highDescription: 'Fast and fluid'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to take chances and embrace uncertainty',
    lowDescription: 'Prefers safe, harmonious choices',
    highDescription: 'Bold risk-taker for ideals'
  }
];

/**
 * Get color for a quality value (pink/purple Libra scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#FF69B4';      // Hot Pink
  if (value >= 75) return '#DDA0DD';      // Plum
  if (value >= 60) return '#BA55D3';      // Medium Orchid
  if (value >= 45) return '#9370DB';      // Medium Purple
  if (value >= 30) return '#8B008B';      // Dark Magenta
  return '#4B0082';                        // Indigo
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
