// Quality Categories Definition
// Defines all the qualities we measure across Gemini zones

export const qualityCategories = [
  {
    id: 'communication',
    label: 'Communication',
    icon: '\u{1F4AC}',
    maxLevel: 5,
    description: 'Verbal and written expression mastery \u2014 core Gemini gift',
    lowDescription: 'Communicates when necessary',
    highDescription: 'Talks constantly, masters every medium'
  },
  {
    id: 'versatility',
    label: 'Versatility',
    icon: '\u{1F504}',
    maxLevel: 5,
    description: 'Ability to adapt skills and interests across domains',
    lowDescription: 'Focused specialist',
    highDescription: 'Infinitely adaptable multi-talent'
  },
  {
    id: 'curiosity',
    label: 'Curiosity',
    icon: '\u{1F50D}',
    maxLevel: 5,
    description: 'Drive to explore, learn, and understand everything',
    lowDescription: 'Focused on known interests',
    highDescription: 'Insatiable need to know everything'
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    icon: '\u{1F98E}',
    maxLevel: 5,
    description: 'Speed and ease of adjusting to new situations',
    lowDescription: 'Prefers familiar routines',
    highDescription: 'Changes instantly to suit any environment'
  },
  {
    id: 'intellectualAgility',
    label: 'Mental Agility',
    icon: '\u{1F9E0}',
    maxLevel: 5,
    description: 'Speed and flexibility of thought \u2014 Mercury lightning',
    lowDescription: 'Processes methodically',
    highDescription: 'Lightning-fast mental connections'
  },
  {
    id: 'socialSkill',
    label: 'Social Skill',
    icon: '\u{1F91D}',
    maxLevel: 5,
    description: 'Natural talent for social connection and charm',
    lowDescription: 'Selective in social engagement',
    highDescription: 'Charms everyone, reads any room'
  },
  {
    id: 'speed',
    label: 'Speed/Tempo',
    icon: '\u{1F4A8}',
    maxLevel: 5,
    description: 'How quickly decisions, words, and actions flow',
    lowDescription: 'Thoughtful deliberation',
    highDescription: 'Lightning-fast everything'
  },
  {
    id: 'patience',
    label: 'Patience',
    icon: '\u231B',
    maxLevel: 5,
    description: 'Ability to wait and sustain focus \u2014 rare in Gemini',
    lowDescription: 'Bored instantly, must move on',
    highDescription: 'Can sustain attention when truly engaged'
  },
  {
    id: 'stubbornness',
    label: 'Stubbornness',
    icon: '\u{1F4AD}',
    maxLevel: 5,
    description: 'Resistance to changing opinions or course',
    lowDescription: 'Changes mind freely and often',
    highDescription: 'Surprisingly fixed in convictions'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '\u{1F3B2}',
    maxLevel: 5,
    description: 'Comfort with uncertainty and new territory',
    lowDescription: 'Prefers known ground',
    highDescription: 'Curious enough to try anything'
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
