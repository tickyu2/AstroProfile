// Quality Categories Definition for Capricorn
// Defines all the qualities we measure across Capricorn zones

export const qualityCategories = [
  {
    id: 'ambition',
    label: 'Ambition',
    icon: '🏔️',
    maxLevel: 5,
    description: 'Drive to reach the summit and achieve lasting mastery — the Capricorn hallmark',
    lowDescription: 'Content with current position',
    highDescription: 'Must reach the absolute peak, relentlessly'
  },
  {
    id: 'discipline',
    label: 'Discipline',
    icon: '⚙️',
    maxLevel: 5,
    description: 'Iron self-control and ability to delay gratification indefinitely',
    lowDescription: 'Flexible and spontaneous',
    highDescription: 'Total self-mastery, iron willpower'
  },
  {
    id: 'strategicThinking',
    label: 'Strategic Thinking',
    icon: '♟️',
    maxLevel: 5,
    description: 'Chess-master ability to plan many moves ahead',
    lowDescription: 'Responds to immediate situations',
    highDescription: 'Sees 20 moves ahead with precision'
  },
  {
    id: 'responsibility',
    label: 'Responsibility',
    icon: '⚖️',
    maxLevel: 5,
    description: 'Burden-bearing capacity and duty consciousness',
    lowDescription: 'Light, carefree approach',
    highDescription: 'Carries the weight of the world willingly'
  },
  {
    id: 'patience',
    label: 'Patience',
    icon: '🕰️',
    maxLevel: 5,
    description: 'Ability to play the long game and wait for results',
    lowDescription: 'Needs quick results',
    highDescription: 'Infinite patience — plays the century game'
  },
  {
    id: 'statusConsciousness',
    label: 'Status Awareness',
    icon: '👑',
    maxLevel: 5,
    description: 'Awareness of hierarchy, position, and social standing',
    lowDescription: 'Unaware of social hierarchy',
    highDescription: 'Acutely aware of every status marker'
  },
  {
    id: 'workEthic',
    label: 'Work Ethic',
    icon: '💪',
    maxLevel: 5,
    description: 'Relentless capacity for sustained hard work',
    lowDescription: 'Works when inspired',
    highDescription: 'Never stops working — work is identity'
  },
  {
    id: 'emotionalReserve',
    label: 'Emotional Reserve',
    icon: '🧊',
    maxLevel: 5,
    description: 'Degree of emotional containment and stoic composure',
    lowDescription: 'Emotionally expressive and warm',
    highDescription: 'Impenetrable fortress of composure'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Slow and methodical calculation',
    highDescription: 'Swift strategic execution'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to take chances versus playing it safe',
    lowDescription: 'Extremely conservative — only guaranteed moves',
    highDescription: 'Calculated risk-taking for strategic gain'
  }
];

/**
 * Get color for a quality value (dark earth/charcoal Capricorn scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#36454F';      // Charcoal
  if (value >= 75) return '#3E2723';      // Dark Brown
  if (value >= 60) return '#654321';      // Chocolate
  if (value >= 45) return '#5D4E37';      // Dark Tan
  if (value >= 30) return '#4A4A4A';      // Dark Gray
  return '#696969';                        // Dim Gray
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
