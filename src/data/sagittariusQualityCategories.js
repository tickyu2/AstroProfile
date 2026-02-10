// Quality Categories Definition for Sagittarius
// Defines all the qualities we measure across Sagittarius zones

export const qualityCategories = [
  {
    id: 'adventurousness',
    label: 'Adventurousness',
    icon: '🏹',
    maxLevel: 5,
    description: 'Drive to explore new horizons, cultures, and experiences — the Sagittarius hallmark',
    lowDescription: 'Prefers familiar territory and routine',
    highDescription: 'Must explore everything, cannot be contained'
  },
  {
    id: 'philosophicalDepth',
    label: 'Philosophical Depth',
    icon: '📚',
    maxLevel: 5,
    description: 'Capacity for deep meaning-making and truth-seeking',
    lowDescription: 'Takes things at face value',
    highDescription: 'Seeks ultimate truth in every experience'
  },
  {
    id: 'optimism',
    label: 'Optimism',
    icon: '☀️',
    maxLevel: 5,
    description: 'Boundless positive outlook and enthusiasm for life',
    lowDescription: 'Cautious and realistic outlook',
    highDescription: 'Infinite faith that everything will work out'
  },
  {
    id: 'honesty',
    label: 'Honesty',
    icon: '🎯',
    maxLevel: 5,
    description: 'Directness and truthfulness, sometimes to a fault',
    lowDescription: 'Diplomatic and measured communication',
    highDescription: 'Brutally honest, says exactly what is true'
  },
  {
    id: 'freedomLove',
    label: 'Freedom Love',
    icon: '🦅',
    maxLevel: 5,
    description: 'Need for independence, autonomy, and unrestricted movement',
    lowDescription: 'Comfortable with structure and routine',
    highDescription: 'Cannot be caged, freedom is oxygen'
  },
  {
    id: 'restlessness',
    label: 'Restlessness',
    icon: '🌪️',
    maxLevel: 5,
    description: 'Inability to stay still, constant seeking of new stimulation',
    lowDescription: 'Content and settled in place',
    highDescription: 'Never settles, always seeking the next horizon'
  },
  {
    id: 'teachingAbility',
    label: 'Teaching Ability',
    icon: '🎓',
    maxLevel: 5,
    description: 'Natural gift for sharing wisdom and inspiring learning',
    lowDescription: 'Prefers to learn rather than teach',
    highDescription: 'Born professor, inspires through knowledge'
  },
  {
    id: 'bigPictureThinking',
    label: 'Big Picture Thinking',
    icon: '🔭',
    maxLevel: 5,
    description: 'Capacity to see grand patterns and visionary possibilities',
    lowDescription: 'Focuses on immediate details',
    highDescription: 'Sees the entire cosmic pattern at once'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Careful and measured approach',
    highDescription: 'Lightning-fast leaps of faith'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to take chances and embrace the unknown',
    lowDescription: 'Cautious and calculated',
    highDescription: 'Fearlessly leaps into the unknown'
  }
];

/**
 * Get color for a quality value (warm orange/red Sagittarius scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#E67E22';      // Carrot Orange
  if (value >= 75) return '#E74C3C';      // Alizarin Red
  if (value >= 60) return '#FF6347';      // Tomato
  if (value >= 45) return '#F39C12';      // Orange
  if (value >= 30) return '#D4A017';      // Metallic Gold
  return '#B8860B';                        // Dark Goldenrod
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
