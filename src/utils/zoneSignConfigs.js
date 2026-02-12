// Sign configuration registry for zone calculations
// Extracted from 12 individual [sign]ZoneCalculations.js files

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const SIGN_CONFIGS = {
  Aries: {
    eclipticOffset: 0,
    previous: 'Pisces', next: 'Taurus',
    seasonStart: { month: 2, day: 20 },
    decans: [
      { ruler: 'Mars', subRuler: 'Mars', quality: 'Cardinal/Initiating' },
      { ruler: 'Mars', subRuler: 'Sun', quality: 'Fixed/Stabilizing' },
      { ruler: 'Mars', subRuler: 'Jupiter', quality: 'Mutable/Transitioning' },
    ],
    cuspText: {
      previous: 'more intuitive and compassionate than typical Aries',
      next: 'more grounded and patient than typical Aries',
    },
    zoneSuggestions: {
      1: "You're the Aries who FEELS before acting\u2014combining fire's initiative with water's intuition.",
      2: "You're peak Aries\u2014the most quintessentially Ram-like expression possible.",
      6: "You're the Aries who BUILDS things\u2014combining fire's initiative with earth's practicality.",
    },
  },
  Taurus: {
    eclipticOffset: 30,
    previous: 'Aries', next: 'Gemini',
    seasonStart: { month: 3, day: 20 },
    decans: [
      { ruler: 'Venus', subRuler: 'Venus', quality: 'Cardinal/Initiating' },
      { ruler: 'Venus', subRuler: 'Mercury', quality: 'Fixed/Stabilizing' },
      { ruler: 'Venus', subRuler: 'Saturn', quality: 'Mutable/Transitioning' },
    ],
    cuspText: {
      previous: 'faster and more action-oriented than typical Taurus',
      next: 'more mentally agile and communicative than typical Taurus',
    },
    zoneSuggestions: {
      1: "You're the Taurus who STARTS things\u2014combining earth's stability with fire's initiative.",
      3: "You're peak Taurus\u2014the most quintessentially Bull-like expression possible.",
      6: "You're the Taurus who can EXPLAIN beauty\u2014combining earth's values with air's articulation.",
    },
  },
  Gemini: {
    eclipticOffset: 60,
    previous: 'Taurus', next: 'Cancer',
    seasonStart: { month: 4, day: 21 },
    decans: [
      { ruler: 'Mercury', subRuler: 'Mercury', quality: 'Mutable/Communicating' },
      { ruler: 'Mercury', subRuler: 'Venus', quality: 'Cardinal/Initiating' },
      { ruler: 'Mercury', subRuler: 'Uranus', quality: 'Fixed/Innovating' },
    ],
    cuspText: {
      previous: 'more grounded and patient than typical Gemini',
      next: 'more emotionally intuitive than typical Gemini',
    },
    zoneSuggestions: {
      1: "You're the Gemini who BUILDS with words\u2014combining air's communication with earth's practicality.",
      2: "You're peak Gemini\u2014the most quintessentially Twin-like expression possible.",
      6: "You're the Gemini who FEELS while thinking\u2014combining air's intellect with water's emotional depth.",
    },
  },
  Cancer: {
    eclipticOffset: 90,
    previous: 'Gemini', next: 'Leo',
    seasonStart: { month: 5, day: 21 },
    decans: [
      { ruler: 'Moon', subRuler: 'Moon', quality: 'Cardinal/Initiating' },
      { ruler: 'Moon', subRuler: 'Pluto', quality: 'Fixed/Stabilizing' },
      { ruler: 'Moon', subRuler: 'Neptune', quality: 'Mutable/Transitioning' },
    ],
    cuspText: {
      previous: 'more articulate and mentally agile than typical Cancer',
      next: 'more expressive and confident than typical Cancer',
    },
    zoneSuggestions: {
      1: "You're the Cancer who SPEAKS emotions\u2014combining water's depth with air's articulation.",
      2: "You're peak Cancer\u2014the most quintessentially lunar expression possible.",
      6: "You're the Cancer who RADIATES warmth\u2014combining water's depth with fire's creative expression.",
    },
  },
  Leo: {
    eclipticOffset: 120,
    previous: 'Cancer', next: 'Virgo',
    seasonStart: { month: 6, day: 23 },
    decans: [
      { ruler: 'Sun', subRuler: 'Sun', quality: 'Fixed/Pure Solar' },
      { ruler: 'Sun', subRuler: 'Jupiter', quality: 'Fixed/Expansive' },
      { ruler: 'Sun', subRuler: 'Mars', quality: 'Fixed/Warrior' },
    ],
    cuspText: {
      previous: 'more emotionally intelligent and nurturing than typical Leo',
      next: 'more analytical and perfectionist than typical Leo',
    },
    zoneSuggestions: {
      1: "You're the Leo who NURTURES\u2014combining fire's creative confidence with water's emotional warmth.",
      2: "You're peak Leo\u2014the most quintessentially solar expression possible, pure creative radiance.",
      6: "You're the Leo who PERFECTS\u2014combining fire's creative vision with earth's analytical precision.",
    },
  },
  Virgo: {
    eclipticOffset: 150,
    previous: 'Leo', next: 'Libra',
    seasonStart: { month: 7, day: 23 },
    decans: [
      { ruler: 'Mercury', subRuler: 'Mercury', quality: 'Mutable/Pure Analytical' },
      { ruler: 'Mercury', subRuler: 'Saturn', quality: 'Mutable/Disciplined' },
      { ruler: 'Mercury', subRuler: 'Venus', quality: 'Mutable/Aesthetic' },
    ],
    cuspText: {
      previous: 'more creative and confident than typical Virgo',
      next: 'more diplomatic and socially graceful than typical Virgo',
    },
    zoneSuggestions: {
      1: "You're the Virgo who SHINES\u2014combining earth's analytical precision with fire's creative confidence.",
      2: "You're peak Virgo\u2014the most quintessentially Mercurial expression possible, pure analytical mastery.",
      6: "You're the Virgo who HARMONIZES\u2014combining earth's precision with air's diplomatic grace.",
    },
  },
  Libra: {
    eclipticOffset: 180,
    previous: 'Virgo', next: 'Scorpio',
    seasonStart: { month: 8, day: 23 },
    decans: [
      { ruler: 'Venus', subRuler: 'Venus', quality: 'Cardinal/Initiating' },
      { ruler: 'Venus', subRuler: 'Uranus', quality: 'Fixed/Stabilizing' },
      { ruler: 'Venus', subRuler: 'Mercury', quality: 'Mutable/Transitioning' },
    ],
    cuspText: {
      previous: 'more analytical and detail-oriented than typical Libra',
      next: 'more intense and transformative than typical Libra',
    },
    zoneSuggestions: {
      1: "Your Virgo cusp brings analytical precision to your diplomatic nature \u2014 use it for detailed aesthetic projects.",
      2: "As pure Libra, your superpower is harmony. Be mindful that avoiding conflict entirely can create deeper imbalance.",
      3: "Your Aquarius influence makes you a natural justice advocate. Channel this into progressive social causes.",
      4: "Your Scorpio decan gives transformative depth to your relationships. Use this intensity to create lasting bonds.",
      5: "Your artistic sensitivity is at peak expression. Channel beauty into works that elevate collective consciousness.",
      6: "Your Scorpio cusp adds transformative depth. Embrace intensity while maintaining your diplomatic grace.",
    },
  },
  Scorpio: {
    eclipticOffset: 210,
    previous: 'Libra', next: 'Sagittarius',
    seasonStart: { month: 9, day: 23 },
    decans: [
      { ruler: 'Pluto', subRuler: 'Mars', quality: 'Fixed/Concentrated' },
      { ruler: 'Pluto', subRuler: 'Neptune', quality: 'Fixed/Mystical' },
      { ruler: 'Pluto', subRuler: 'Moon', quality: 'Cardinal/Protective' },
    ],
    cuspText: {
      previous: 'more diplomatic and harmonious than typical Scorpio',
      next: 'more philosophical and adventurous than typical Scorpio',
    },
    zoneSuggestions: {
      1: "Your Libra cusp adds diplomatic grace to your intensity \u2014 use it to transform relationships without burning bridges.",
      2: "As pure Scorpio, your power is absolute transformation. Channel obsessive energy constructively to avoid self-destruction.",
      3: "Your Pisces influence brings mystical healing power. Use compassion to transform pain into wisdom for yourself and others.",
      4: "Your Moon decan gives emotional depth and protective instincts. Guard your loved ones while allowing them room to grow.",
      5: "Your investigative powers are at peak expression. Channel your depth into uncovering hidden truths that heal.",
      6: "Your Sagittarius cusp gives philosophical depth. Share your transformative wisdom through teaching and adventure.",
    },
  },
  Sagittarius: {
    eclipticOffset: 240,
    previous: 'Scorpio', next: 'Capricorn',
    seasonStart: { month: 10, day: 22 },
    decans: [
      { ruler: 'Jupiter', subRuler: 'Jupiter', quality: 'Mutable/Pure' },
      { ruler: 'Jupiter', subRuler: 'Mars', quality: 'Cardinal/Courageous' },
      { ruler: 'Jupiter', subRuler: 'Sun', quality: 'Fixed/Creative' },
    ],
    cuspText: {
      previous: 'more intense and investigative than typical Sagittarius',
      next: 'more disciplined and strategic than typical Sagittarius',
    },
    zoneSuggestions: {
      1: "Your Scorpio cusp adds transformative depth to your philosophy \u2014 use it to seek truth that transforms, not just entertains.",
      2: "As pure Sagittarius, your boundless enthusiasm is your superpower. Channel it with intention to avoid scattering your energy.",
      3: "Your Aries influence brings warrior courage to your vision. Lead boldly but remember to bring others along on the journey.",
      4: "Your Sun decan gives radiant creative confidence. Inspire others through the sheer force of your optimistic vision.",
      5: "Your philosophical depth is at peak expression. Share your wisdom through storytelling that bridges cultures.",
      6: "Your Capricorn cusp gives strategic discipline. Build your philosophical empire step by step \u2014 patience multiplies vision.",
    },
  },
  Capricorn: {
    eclipticOffset: 270,
    previous: 'Sagittarius', next: 'Aquarius',
    seasonStart: { month: 11, day: 22 },
    decans: [
      { ruler: 'Saturn', subRuler: 'Saturn', quality: 'Cardinal/Pure' },
      { ruler: 'Saturn', subRuler: 'Venus', quality: 'Fixed/Material' },
      { ruler: 'Saturn', subRuler: 'Mercury', quality: 'Mutable/Analytical' },
    ],
    cuspText: {
      previous: 'more optimistic and philosophical than typical Capricorn',
      next: 'more innovative and humanitarian than typical Capricorn',
    },
    zoneSuggestions: {
      1: "Your Sagittarius cusp adds visionary fire to your strategy \u2014 use it to build empires that inspire, not just endure.",
      2: "As pure Capricorn, your discipline is unmatched. Remember to pause and enjoy the view from the summits you've already conquered.",
      3: "Your Taurus influence brings sensory appreciation. Build wealth not just for power but for the beauty and quality it enables.",
      4: "Your Mercury decan gives analytical communication power. Master strategy through precise language and logical frameworks.",
      5: "Your executive power is at peak expression. Lead organizations that leave lasting structural legacies.",
      6: "Your Aquarius cusp gives revolutionary vision. Build the future's infrastructure while honoring the wisdom of the past.",
    },
  },
  Aquarius: {
    eclipticOffset: 300,
    previous: 'Capricorn', next: 'Pisces',
    seasonStart: { month: 0, day: 20 },
    decans: [
      { ruler: 'Uranus', subRuler: 'Saturn', quality: 'Fixed/Pure' },
      { ruler: 'Uranus', subRuler: 'Mercury', quality: 'Mutable/Gemini' },
      { ruler: 'Uranus', subRuler: 'Venus', quality: 'Cardinal/Libra' },
    ],
    cuspText: {
      previous: 'more disciplined and strategic than typical Aquarius',
      next: 'more spiritually intuitive than typical Aquarius',
    },
    zoneSuggestions: {
      1: "Your Capricorn cusp adds strategic discipline to your innovation \u2014 use it to build revolutionary systems that actually endure.",
      2: "As pure Aquarius, your genius is unmatched. Remember to come down from the future occasionally and connect with people in the present.",
      3: "Your Gemini influence makes you a brilliant communicator. Channel that gift to spread revolutionary ideas to the widest possible audience.",
      4: "Your Venus decan gives aesthetic humanitarian vision. Create beauty that serves collective liberation and social harmony.",
      5: "Your innovative power is at peak expression. Break paradigms that need breaking, and build what comes next.",
      6: "Your Pisces cusp gives mystical depth to your futurism. Ground your transcendent visions in practical steps to make them real.",
    },
  },
  Pisces: {
    eclipticOffset: 330,
    previous: 'Aquarius', next: 'Aries',
    seasonStart: { month: 1, day: 19 },
    decans: [
      { ruler: 'Neptune', subRuler: 'Jupiter', quality: 'Mutable/Pure' },
      { ruler: 'Neptune', subRuler: 'Moon', quality: 'Cardinal/Cancer' },
      { ruler: 'Neptune', subRuler: 'Pluto', quality: 'Fixed/Scorpio' },
    ],
    cuspText: {
      previous: 'more innovative and visionary than typical Pisces',
      next: 'more courageous and action-oriented than typical Pisces',
    },
    zoneSuggestions: {
      1: "Your Aquarius cusp adds visionary innovation to your spirituality \u2014 use it to build movements that bridge intellect and transcendence.",
      2: "As pure Pisces, your spiritual connection is unmatched. Remember to ground yourself in the material world to bring your visions to life.",
      3: "Your Cancer influence brings nurturing emotional depth. Channel your healing gifts into sacred spaces where others can transform.",
      4: "Your Scorpio decan gives transformative spiritual power. Use your alchemy to transmute darkness into light, not just for others but for yourself.",
      5: "Your Scorpio peak gives you divine artistic intensity. Channel your emotional depth into transcendent art that heals humanity.",
      6: "Your Aries cusp gives courageous spiritual initiative. Lead with compassion while harnessing your warrior fire to manifest spiritual visions.",
    },
  },
};

export { ZODIAC_ORDER };
