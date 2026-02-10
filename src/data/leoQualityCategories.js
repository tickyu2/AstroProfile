// Quality Categories Definition for Leo
// Defines all the qualities we measure across Leo zones

export const qualityCategories = [
  {
    id: 'creativity',
    label: 'Creativity',
    icon: '\uD83C\uDFA8',
    maxLevel: 5,
    description: 'Creative power and artistic expression \u2014 the Leo hallmark',
    lowDescription: 'Expresses through practical channels',
    highDescription: 'Pure creative genius, boundless artistic vision'
  },
  {
    id: 'charisma',
    label: 'Charisma',
    icon: '\u2728',
    maxLevel: 5,
    description: 'Magnetic personal presence and ability to captivate',
    lowDescription: 'Quietly appealing presence',
    highDescription: 'Irresistible magnetic force that fills any room'
  },
  {
    id: 'confidence',
    label: 'Confidence',
    icon: '\uD83D\uDC51',
    maxLevel: 5,
    description: 'Self-belief and unshakeable inner certainty',
    lowDescription: 'Confidence tempered by analysis',
    highDescription: 'Absolute self-belief, unshakeable conviction'
  },
  {
    id: 'generosity',
    label: 'Generosity',
    icon: '\uD83C\uDF81',
    maxLevel: 5,
    description: 'Lavish giving and expansive sharing spirit',
    lowDescription: 'Selectively generous',
    highDescription: 'Gives without limit, lavish and boundless'
  },
  {
    id: 'leadership',
    label: 'Leadership',
    icon: '\uD83D\uDC51',
    maxLevel: 5,
    description: 'Natural authority and ability to guide others',
    lowDescription: 'Leads through quiet example',
    highDescription: 'Born ruler, commands rooms effortlessly'
  },
  {
    id: 'dramaticFlair',
    label: 'Dramatic Flair',
    icon: '\uD83C\uDFAD',
    maxLevel: 5,
    description: 'Theatrical expression and performative energy',
    lowDescription: 'Restrained, measured expression',
    highDescription: 'Maximum theatrical presence, life as performance'
  },
  {
    id: 'needForRecognition',
    label: 'Recognition Need',
    icon: '\u2B50',
    maxLevel: 5,
    description: 'Drive for admiration, attention, and acknowledgment',
    lowDescription: 'Can work behind the scenes',
    highDescription: 'Cannot function without constant admiration'
  },
  {
    id: 'pride',
    label: 'Pride',
    icon: '\uD83E\uDD81',
    maxLevel: 5,
    description: 'Self-regard, dignity, and resistance to humiliation',
    lowDescription: 'Humble, open to criticism',
    highDescription: 'Cannot tolerate any disrespect or slight'
  },
  {
    id: 'loyalty',
    label: 'Loyalty',
    icon: '\uD83D\uDC9B',
    maxLevel: 5,
    description: 'Devotion and faithfulness to inner circle',
    lowDescription: 'Loyal when convenient',
    highDescription: 'Fierce, unconditional devotion to loved ones'
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: '\u26A1',
    maxLevel: 5,
    description: 'Action and decision speed',
    lowDescription: 'Deliberate, analytical pace',
    highDescription: 'Lightning-fast action and decision-making'
  }
];

// Quality comparison helper functions
export const getQualityColor = (level) => {
  if (level >= 80) return '#FFD700'; // High - Gold
  if (level >= 60) return '#FFA500'; // Medium-High - Orange
  if (level >= 40) return '#FF6347'; // Medium - Tomato
  if (level >= 20) return '#CD5C5C'; // Low-Medium - Indian Red
  return '#8B0000'; // Low - Dark Red
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
