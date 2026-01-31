/**
 * Vedic Astrology (Jyotish) Constants
 * Used for sidereal zodiac calculations with Swiss Ephemeris
 */

// ============================================================================
// RASHIS (Zodiac Signs in Vedic Astrology)
// ============================================================================

export const RASHIS = [
  { index: 0, sanskrit: 'Mesha', english: 'Aries', lord: 'Mars', element: 'Fire', symbol: '♈', emoji: '🐏', quality: 'Movable' },
  { index: 1, sanskrit: 'Vrishabha', english: 'Taurus', lord: 'Venus', element: 'Earth', symbol: '♉', emoji: '🐂', quality: 'Fixed' },
  { index: 2, sanskrit: 'Mithuna', english: 'Gemini', lord: 'Mercury', element: 'Air', symbol: '♊', emoji: '👯', quality: 'Dual' },
  { index: 3, sanskrit: 'Karka', english: 'Cancer', lord: 'Moon', element: 'Water', symbol: '♋', emoji: '🦀', quality: 'Movable' },
  { index: 4, sanskrit: 'Simha', english: 'Leo', lord: 'Sun', element: 'Fire', symbol: '♌', emoji: '🦁', quality: 'Fixed' },
  { index: 5, sanskrit: 'Kanya', english: 'Virgo', lord: 'Mercury', element: 'Earth', symbol: '♍', emoji: '👸', quality: 'Dual' },
  { index: 6, sanskrit: 'Tula', english: 'Libra', lord: 'Venus', element: 'Air', symbol: '♎', emoji: '⚖️', quality: 'Movable' },
  { index: 7, sanskrit: 'Vrishchika', english: 'Scorpio', lord: 'Mars', element: 'Water', symbol: '♏', emoji: '🦂', quality: 'Fixed' },
  { index: 8, sanskrit: 'Dhanu', english: 'Sagittarius', lord: 'Jupiter', element: 'Fire', symbol: '♐', emoji: '🏹', quality: 'Dual' },
  { index: 9, sanskrit: 'Makara', english: 'Capricorn', lord: 'Saturn', element: 'Earth', symbol: '♑', emoji: '🐐', quality: 'Movable' },
  { index: 10, sanskrit: 'Kumbha', english: 'Aquarius', lord: 'Saturn', element: 'Air', symbol: '♒', emoji: '🏺', quality: 'Fixed' },
  { index: 11, sanskrit: 'Meena', english: 'Pisces', lord: 'Jupiter', element: 'Water', symbol: '♓', emoji: '🐟', quality: 'Dual' },
];

// ============================================================================
// NAKSHATRAS (27 Lunar Mansions)
// Each spans 13°20' (13.333...°), with 4 padas of 3°20' each
// ============================================================================

export const NAKSHATRAS = [
  { index: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: '🐴', quality: 'Light/Swift',
    meaning: 'The Horse-headed Twins', nature: 'Healing, speed, new beginnings' },
  { index: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: '🔺', quality: 'Fierce/Severe',
    meaning: 'The Bearer', nature: 'Transformation, restraint, duty' },
  { index: 2, name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: '🔥', quality: 'Mixed',
    meaning: 'The Cutter', nature: 'Purification, determination, courage' },
  { index: 3, name: 'Rohini', lord: 'Moon', deity: 'Brahma', symbol: '🐂', quality: 'Fixed/Permanent',
    meaning: 'The Red One', nature: 'Creativity, fertility, growth' },
  { index: 4, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: '🦌', quality: 'Soft/Mild',
    meaning: 'The Deer\'s Head', nature: 'Searching, curiosity, gentleness' },
  { index: 5, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: '💎', quality: 'Sharp/Dreadful',
    meaning: 'The Moist One', nature: 'Storms, destruction, renewal' },
  { index: 6, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: '🏹', quality: 'Movable/Ephemeral',
    meaning: 'Return of the Light', nature: 'Restoration, abundance, renewal' },
  { index: 7, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: '🌸', quality: 'Light/Swift',
    meaning: 'The Nourisher', nature: 'Nourishment, protection, prosperity' },
  { index: 8, name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpas', symbol: '🐍', quality: 'Sharp/Dreadful',
    meaning: 'The Embracer', nature: 'Kundalini, intuition, mysticism' },
  { index: 9, name: 'Magha', lord: 'Ketu', deity: 'Pitris', symbol: '👑', quality: 'Fierce/Severe',
    meaning: 'The Great One', nature: 'Royalty, ancestors, authority' },
  { index: 10, name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', symbol: '🛏️', quality: 'Fierce/Severe',
    meaning: 'Former Red One', nature: 'Pleasure, creativity, relationships' },
  { index: 11, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', symbol: '🛏️', quality: 'Fixed/Permanent',
    meaning: 'Latter Red One', nature: 'Contracts, partnerships, patronage' },
  { index: 12, name: 'Hasta', lord: 'Moon', deity: 'Savitar', symbol: '✋', quality: 'Light/Swift',
    meaning: 'The Hand', nature: 'Skill, dexterity, craftsmanship' },
  { index: 13, name: 'Chitra', lord: 'Mars', deity: 'Vishvakarman', symbol: '💎', quality: 'Soft/Mild',
    meaning: 'The Bright One', nature: 'Artistry, beauty, illusion' },
  { index: 14, name: 'Swati', lord: 'Rahu', deity: 'Vayu', symbol: '🌱', quality: 'Movable/Ephemeral',
    meaning: 'The Sword', nature: 'Independence, flexibility, trade' },
  { index: 15, name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni', symbol: '🎯', quality: 'Mixed',
    meaning: 'The Forked One', nature: 'Goal-oriented, triumph, ambition' },
  { index: 16, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', symbol: '🪷', quality: 'Soft/Mild',
    meaning: 'Following Radha', nature: 'Devotion, friendship, success' },
  { index: 17, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: '👂', quality: 'Sharp/Dreadful',
    meaning: 'The Eldest', nature: 'Leadership, protection, authority' },
  { index: 18, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', symbol: '🦁', quality: 'Sharp/Dreadful',
    meaning: 'The Root', nature: 'Investigation, dissolution, roots' },
  { index: 19, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', symbol: '🐘', quality: 'Fierce/Severe',
    meaning: 'Former Invincible', nature: 'Purification, invincibility, revival' },
  { index: 20, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', symbol: '🐘', quality: 'Fixed/Permanent',
    meaning: 'Latter Invincible', nature: 'Victory, leadership, permanence' },
  { index: 21, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: '👂', quality: 'Movable/Ephemeral',
    meaning: 'The Listener', nature: 'Learning, connections, perseverance' },
  { index: 22, name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', symbol: '🥁', quality: 'Movable/Ephemeral',
    meaning: 'The Wealthiest', nature: 'Wealth, music, fame' },
  { index: 23, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', symbol: '⭕', quality: 'Movable/Ephemeral',
    meaning: 'Hundred Healers', nature: 'Healing, seclusion, mysteries' },
  { index: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: '🛏️', quality: 'Fierce/Severe',
    meaning: 'Former Lucky Feet', nature: 'Passion, transformation, fire' },
  { index: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', symbol: '🛏️', quality: 'Fixed/Permanent',
    meaning: 'Latter Lucky Feet', nature: 'Depth, wisdom, restraint' },
  { index: 26, name: 'Revati', lord: 'Mercury', deity: 'Pushan', symbol: '🐟', quality: 'Soft/Mild',
    meaning: 'The Wealthy', nature: 'Safe travel, nourishment, completion' },
];

// ============================================================================
// GRAHAS (Vedic Planets)
// ============================================================================

export const GRAHAS = {
  surya: { sanskrit: 'Surya', english: 'Sun', symbol: '☉', color: '#FFD700', nature: 'Malefic', element: 'Fire' },
  chandra: { sanskrit: 'Chandra', english: 'Moon', symbol: '☽', color: '#C0C0C0', nature: 'Benefic', element: 'Water' },
  mangala: { sanskrit: 'Mangala', english: 'Mars', symbol: '♂', color: '#FF4500', nature: 'Malefic', element: 'Fire' },
  budha: { sanskrit: 'Budha', english: 'Mercury', symbol: '☿', color: '#32CD32', nature: 'Neutral', element: 'Earth' },
  guru: { sanskrit: 'Guru', english: 'Jupiter', symbol: '♃', color: '#FFD700', nature: 'Benefic', element: 'Ether' },
  shukra: { sanskrit: 'Shukra', english: 'Venus', symbol: '♀', color: '#FF69B4', nature: 'Benefic', element: 'Water' },
  shani: { sanskrit: 'Shani', english: 'Saturn', symbol: '♄', color: '#4169E1', nature: 'Malefic', element: 'Air' },
  rahu: { sanskrit: 'Rahu', english: 'North Node', symbol: '☊', color: '#8B4513', nature: 'Malefic', element: 'Air' },
  ketu: { sanskrit: 'Ketu', english: 'South Node', symbol: '☋', color: '#808080', nature: 'Malefic', element: 'Fire' },
};

// ============================================================================
// AYANAMSHA OPTIONS
// ============================================================================

export const AYANAMSHAS = {
  lahiri: { id: 'lahiri', name: 'Lahiri (Chitrapaksha)', description: 'Most widely used, official Indian calendar' },
  raman: { id: 'raman', name: 'B.V. Raman', description: 'Popular in South India' },
  krishnamurti: { id: 'krishnamurti', name: 'Krishnamurti (KP)', description: 'Used in KP Astrology system' },
  fagan_bradley: { id: 'fagan_bradley', name: 'Fagan-Bradley', description: 'Western sidereal astrology' },
  yukteshwar: { id: 'yukteshwar', name: 'Sri Yukteshwar', description: 'Based on Autobiography of a Yogi' },
  true_chitra: { id: 'true_chitra', name: 'True Chitra', description: 'Spica at exactly 0° Libra' },
};

// ============================================================================
// BHAVA (House) MEANINGS
// ============================================================================

export const BHAVAS = {
  1: { name: 'Tanu Bhava', meaning: 'Self & Body', keywords: ['personality', 'appearance', 'health', 'beginnings'] },
  2: { name: 'Dhana Bhava', meaning: 'Wealth & Family', keywords: ['money', 'speech', 'family values', 'food'] },
  3: { name: 'Sahaja Bhava', meaning: 'Siblings & Courage', keywords: ['siblings', 'communication', 'short trips', 'skills'] },
  4: { name: 'Sukha Bhava', meaning: 'Happiness & Mother', keywords: ['home', 'mother', 'emotions', 'property'] },
  5: { name: 'Putra Bhava', meaning: 'Children & Intelligence', keywords: ['children', 'creativity', 'romance', 'education'] },
  6: { name: 'Ari Bhava', meaning: 'Enemies & Health', keywords: ['enemies', 'disease', 'service', 'debts'] },
  7: { name: 'Yuvati Bhava', meaning: 'Spouse & Partnership', keywords: ['marriage', 'business', 'contracts', 'others'] },
  8: { name: 'Randhra Bhava', meaning: 'Longevity & Transformation', keywords: ['death', 'inheritance', 'occult', 'sudden events'] },
  9: { name: 'Dharma Bhava', meaning: 'Fortune & Spirituality', keywords: ['luck', 'father', 'religion', 'higher learning'] },
  10: { name: 'Karma Bhava', meaning: 'Career & Status', keywords: ['profession', 'reputation', 'authority', 'government'] },
  11: { name: 'Labha Bhava', meaning: 'Gains & Friends', keywords: ['income', 'friends', 'hopes', 'elder siblings'] },
  12: { name: 'Vyaya Bhava', meaning: 'Loss & Liberation', keywords: ['expenses', 'foreign', 'spirituality', 'endings'] },
};

// ============================================================================
// ELEMENT COLORS (for UI)
// ============================================================================

export const VEDIC_ELEMENT_COLORS = {
  Fire: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' },
  Earth: { bg: 'bg-lime-500/20', border: 'border-lime-500/40', text: 'text-lime-400' },
  Air: { bg: 'bg-sky-500/20', border: 'border-sky-500/40', text: 'text-sky-400' },
  Water: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  Ether: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Rashi by index (0-11)
 */
export function getRashiByIndex(index) {
  return RASHIS[index % 12];
}

/**
 * Get Nakshatra by index (0-26)
 */
export function getNakshatraByIndex(index) {
  return NAKSHATRAS[index % 27];
}

/**
 * Calculate Nakshatra from sidereal longitude
 */
export function calculateNakshatra(longitude) {
  const nakshatraSpan = 360 / 27; // 13.333...°
  const padaSpan = nakshatraSpan / 4; // 3.333...°

  const index = Math.floor(longitude / nakshatraSpan) % 27;
  const degreeInNakshatra = longitude % nakshatraSpan;
  const pada = Math.floor(degreeInNakshatra / padaSpan) + 1;

  return {
    ...NAKSHATRAS[index],
    pada,
    degreeInNakshatra,
  };
}

/**
 * Get Graha info by key
 */
export function getGrahaInfo(grahaKey) {
  return GRAHAS[grahaKey] || null;
}
