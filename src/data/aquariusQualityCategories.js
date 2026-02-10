// Quality Categories Definition for Aquarius
// Defines all the qualities we measure across Aquarius zones

export const qualityCategories = [
  {
    id: 'revolutionaryThinking',
    label: 'Revolutionary Thinking',
    icon: '🔬',
    maxLevel: 5,
    description: 'Capacity to envision radical new possibilities — the Aquarius hallmark',
    lowDescription: 'Conventional, traditional thinking',
    highDescription: 'Sees the future others cannot imagine'
  },
  {
    id: 'intellectualDepth',
    label: 'Intellectual Depth',
    icon: '🧠',
    maxLevel: 5,
    description: 'Abstract conceptual thinking power and theoretical brilliance',
    lowDescription: 'Concrete, practical thinking',
    highDescription: 'Pure abstract genius, beyond normal comprehension'
  },
  {
    id: 'humanitarianism',
    label: 'Humanitarianism',
    icon: '🌍',
    maxLevel: 5,
    description: 'Drive to serve collective humanity and fight for equality',
    lowDescription: 'Individual focus',
    highDescription: 'Lives entirely for collective humanity'
  },
  {
    id: 'unconventionality',
    label: 'Unconventionality',
    icon: '⚡',
    maxLevel: 5,
    description: 'Degree of uniqueness and refusal to conform',
    lowDescription: 'Comfortable with convention',
    highDescription: 'Completely unique, defies all norms'
  },
  {
    id: 'detachment',
    label: 'Emotional Detachment',
    icon: '🧊',
    maxLevel: 5,
    description: 'Objectivity and distance from emotional involvement',
    lowDescription: 'Emotionally engaged and warm',
    highDescription: 'Purely objective, emotionally alien'
  },
  {
    id: 'innovation',
    label: 'Innovation',
    icon: '💡',
    maxLevel: 5,
    description: 'Capacity to create entirely new systems and solutions',
    lowDescription: 'Uses existing methods',
    highDescription: 'Invents what never existed before'
  },
  {
    id: 'groupOrientation',
    label: 'Group Orientation',
    icon: '👥',
    maxLevel: 5,
    description: 'Focus on collective, community, and group dynamics',
    lowDescription: 'Individual orientation',
    highDescription: 'Lives entirely for the collective'
  },
  {
    id: 'rebelliousness',
    label: 'Rebelliousness',
    icon: '✊',
    maxLevel: 5,
    description: 'Drive to challenge authority and overturn the status quo',
    lowDescription: 'Respects authority and tradition',
    highDescription: 'Rebels against all authority and convention'
  },
  {
    id: 'speed',
    label: 'Decision Speed',
    icon: '⚡',
    maxLevel: 5,
    description: 'How quickly decisions and actions are taken',
    lowDescription: 'Careful and measured approach',
    highDescription: 'Lightning-fast revolutionary decisions'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to take revolutionary chances',
    lowDescription: 'Conservative and cautious',
    highDescription: 'Fearlessly disrupts everything'
  }
];

/**
 * Get color for a quality value (electric blue Aquarius scheme)
 */
export function getQualityColor(value) {
  if (value >= 90) return '#4169E1';      // Royal Blue
  if (value >= 75) return '#1E90FF';      // Dodger Blue
  if (value >= 60) return '#00BFFF';      // Deep Sky Blue
  if (value >= 45) return '#40E0D0';      // Turquoise
  if (value >= 30) return '#87CEEB';      // Sky Blue
  return '#B0C4DE';                        // Light Steel Blue
}

/**
 * Get label for a quality value
 */
export function getQualityLabel(value) {
  if (value >= 95) return 'Maximum';
  if (value >= 85) return 'Very High';
  if (value >= 75) return 'High';
  if (value >= 60) return 'Medium-High';
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
