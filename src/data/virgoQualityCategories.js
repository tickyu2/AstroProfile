// Quality Categories Definition for Virgo
// Defines all the qualities we measure across Virgo zones

export const qualityCategories = [
  {
    id: 'analyticalThinking',
    label: 'Analytical Thinking',
    icon: '\uD83E\uDDE0',
    maxLevel: 5,
    description: 'Depth and precision of analytical processing \u2014 the Virgo hallmark',
    lowDescription: 'Analyzes at surface level',
    highDescription: 'Peak analytical capacity, sees every pattern'
  },
  {
    id: 'attention',
    label: 'Attention to Detail',
    icon: '\uD83D\uDD0D',
    maxLevel: 5,
    description: 'Ability to notice, track, and perfect every detail',
    lowDescription: 'Focuses on big picture',
    highDescription: 'Notices every microscopic detail instantly'
  },
  {
    id: 'perfectionism',
    label: 'Perfectionism',
    icon: '\u2728',
    maxLevel: 5,
    description: 'Drive for flawless execution and standards',
    lowDescription: 'Accepts good enough',
    highDescription: 'Nothing less than absolute perfection'
  },
  {
    id: 'serviceOrientation',
    label: 'Service',
    icon: '\uD83E\uDD1D',
    maxLevel: 5,
    description: 'Dedication to helping and serving others',
    lowDescription: 'Helps when asked',
    highDescription: 'Lives to serve, unconditional dedication'
  },
  {
    id: 'practicalSkills',
    label: 'Practical Skills',
    icon: '\uD83D\uDD27',
    maxLevel: 5,
    description: 'Hands-on ability and craft mastery',
    lowDescription: 'Theoretical thinker',
    highDescription: 'Master of practical execution'
  },
  {
    id: 'criticalThinking',
    label: 'Critical Thinking',
    icon: '\u2696\uFE0F',
    maxLevel: 5,
    description: 'Ability to evaluate, discern, and judge quality',
    lowDescription: 'Accepting and non-judgmental',
    highDescription: 'Sees every flaw, supreme discernment'
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: '\uD83D\uDCCB',
    maxLevel: 5,
    description: 'Ability to create and maintain systematic order',
    lowDescription: 'Comfortable with some chaos',
    highDescription: 'Perfect systems, everything in its place'
  },
  {
    id: 'healthConsciousness',
    label: 'Health Focus',
    icon: '\uD83C\uDF3F',
    maxLevel: 5,
    description: 'Awareness of physical health and wellness',
    lowDescription: 'Casual about health',
    highDescription: 'Body as temple, hyperaware of wellness'
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: '\u26A1',
    maxLevel: 5,
    description: 'Action and decision speed',
    lowDescription: 'Slow, deliberate processing',
    highDescription: 'Rapid analysis and precise execution'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '\uD83C\uDFB2',
    maxLevel: 5,
    description: 'Comfort with uncertainty and the unknown',
    lowDescription: 'Analyzes all risks, avoids uncertainty',
    highDescription: 'Can venture beyond calculated safety'
  }
];

// Quality comparison helper functions
export const getQualityColor = (level) => {
  if (level >= 80) return '#6B8E23'; // High - Olive Green
  if (level >= 60) return '#8B7355'; // Medium-High - Burlywood
  if (level >= 40) return '#C9A871'; // Medium - Khaki
  if (level >= 20) return '#D2B48C'; // Low-Medium - Tan
  return '#8B4513'; // Low - Saddle Brown
};

export const getQualityLabel = (level) => {
  if (level >= 90) return 'Maximum';
  if (level >= 70) return 'Very High';
  if (level >= 50) return 'High';
  if (level >= 30) return 'Medium';
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
