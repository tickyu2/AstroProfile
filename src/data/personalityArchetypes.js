/**
 * ============================================
 * 25 PERSONALITY ARCHETYPES
 * Elemental Metaphors for Constitutional Profiles
 * ============================================
 *
 * Based on dominant and secondary elements from BaZi analysis
 * Each archetype represents a unique elemental combination
 *
 * Structure:
 * - 5 Pure elements (single dominant)
 * - 20 Hybrid elements (dominant + secondary combinations)
 */

export const PERSONALITY_ARCHETYPES = {
  // ==========================================
  // WOOD-DOMINANT ARCHETYPES (5)
  // ==========================================

  1: {
    id: 1,
    name: "The Tree",
    symbol: "🌲",
    dominantElement: "Wood",
    secondaryElement: null,
    keywords: ["Growth", "Stability", "Nurturing", "Patient"],
    description: "Pure Wood energy - rooted, steadfast, and always reaching skyward. You provide shelter and support for others while remaining deeply grounded.",
    strengths: ["Natural leadership through example", "Patient and persistent", "Nurturing and supportive", "Strong moral foundation"],
    challenges: ["Can be inflexible", "Slow to adapt to change", "May neglect own needs for others", "Stubborn when beliefs challenged"],
    lifePath: "Your path is to grow steadily, provide wisdom and shelter, and help others reach their potential while staying rooted in your values."
  },

  2: {
    id: 2,
    name: "The Burning Forest",
    symbol: "🌲🔥",
    dominantElement: "Wood",
    secondaryElement: "Fire",
    keywords: ["Passionate Growth", "Transformative", "Intense", "Pioneering"],
    description: "Wood feeding Fire - you are growth with passion, expansion with intensity. Your creative energy transforms everything you touch.",
    strengths: ["Explosive creativity", "Passionate about causes", "Transforms obstacles into opportunities", "Inspiring to others"],
    challenges: ["Can burn out quickly", "May consume resources too fast", "Intensity can overwhelm others", "Difficulty with moderation"],
    lifePath: "Channel your transformative energy into sustainable growth, inspire others while preserving yourself, create lasting change."
  },

  3: {
    id: 3,
    name: "The Rooted Mountain",
    symbol: "🌲⛰️",
    dominantElement: "Wood",
    secondaryElement: "Earth",
    keywords: ["Grounded Growth", "Practical", "Reliable", "Methodical"],
    description: "Wood drawing from Earth - you combine growth with stability, ambition with practicality. Your foundations run deep.",
    strengths: ["Extremely reliable", "Builds lasting structures", "Practical wisdom", "Patient accumulation of resources"],
    challenges: ["Can be overly cautious", "Resistance to risk", "May miss opportunities through hesitation", "Slow to pivot"],
    lifePath: "Build enduring legacies through patient effort, create structures that benefit generations, balance ambition with prudence."
  },

  4: {
    id: 4,
    name: "The Bamboo",
    symbol: "🎋",
    dominantElement: "Wood",
    secondaryElement: "Metal",
    keywords: ["Flexible Strength", "Disciplined", "Refined", "Resilient"],
    description: "Wood shaped by Metal - you bend but don't break, combining growth with precision and discipline with flexibility.",
    strengths: ["Resilient under pressure", "Disciplined growth", "Refined approach", "Strong boundaries"],
    challenges: ["Internal conflict between flexibility and rigidity", "Can be self-critical", "May struggle with spontaneity"],
    lifePath: "Master the art of resilient flexibility, grow through discipline, maintain principles while adapting to circumstances."
  },

  5: {
    id: 5,
    name: "The Willow",
    symbol: "🌿💧",
    dominantElement: "Wood",
    secondaryElement: "Water",
    keywords: ["Flowing Growth", "Adaptive", "Intuitive", "Graceful"],
    description: "Wood nourished by Water - you grow with grace and fluidity, adapting to circumstances while maintaining your essence.",
    strengths: ["Highly adaptive", "Intuitive understanding", "Flows around obstacles", "Emotional intelligence"],
    challenges: ["Can lack firm boundaries", "May over-adapt to please others", "Difficulty saying no", "Can lose sense of self"],
    lifePath: "Grow with wisdom and grace, adapt while maintaining core values, flow with life while staying rooted in truth."
  },

  // ==========================================
  // FIRE-DOMINANT ARCHETYPES (5)
  // ==========================================

  6: {
    id: 6,
    name: "The Flame",
    symbol: "🔥",
    dominantElement: "Fire",
    secondaryElement: null,
    keywords: ["Pure Passion", "Transformation", "Inspiration", "Radiant"],
    description: "Pure Fire energy - bright, warm, transformative. You illuminate darkness and inspire action through your passionate nature.",
    strengths: ["Highly charismatic", "Natural motivator", "Transforms everything you touch", "Radiates warmth and energy"],
    challenges: ["Can burn too bright", "Exhaustion from intensity", "May consume relationships", "Impulsive decisions"],
    lifePath: "Shine brightly while preserving your fuel, inspire transformation, warm others without burning them."
  },

  7: {
    id: 7,
    name: "The Campfire",
    symbol: "🔥🌲",
    dominantElement: "Fire",
    secondaryElement: "Wood",
    keywords: ["Sustained Passion", "Community", "Warmth", "Gathering"],
    description: "Fire fed by Wood - sustained warmth and light. You create spaces where people gather, share stories, and feel safe.",
    strengths: ["Brings people together", "Sustainable enthusiasm", "Creates community", "Balances passion with wisdom"],
    challenges: ["May take on too much responsibility for others", "Can neglect personal needs", "Difficulty with solitude"],
    lifePath: "Create gathering spaces for community, sustain your fire through wisdom, warm the world without depleting yourself."
  },

  8: {
    id: 8,
    name: "The Volcano",
    symbol: "🔥⛰️",
    dominantElement: "Fire",
    secondaryElement: "Earth",
    keywords: ["Explosive Creativity", "Power", "Creation", "Intensity"],
    description: "Fire from Earth's depths - you build pressure and transform landscapes. Your creative power reshapes reality.",
    strengths: ["Massive creative power", "Transforms obstacles completely", "Builds new ground", "Unstoppable force"],
    challenges: ["Can be destructive", "Difficulty with subtlety", "May overwhelm others", "Periods of dormancy"],
    lifePath: "Channel your explosive creativity constructively, transform landscapes with awareness, create without destroying."
  },

  9: {
    id: 9,
    name: "The Forge",
    symbol: "🔥⚙️",
    dominantElement: "Fire",
    secondaryElement: "Metal",
    keywords: ["Transformative Precision", "Mastery", "Refinement", "Craft"],
    description: "Fire shaping Metal - you transform raw materials into masterpieces through skill, passion, and discipline combined.",
    strengths: ["Master craftsperson", "Combines passion with precision", "Refines everything", "Creates lasting value"],
    challenges: ["Perfectionism", "Can be overly critical", "Burns self out through intensity", "Difficulty accepting imperfection"],
    lifePath: "Master your craft through passionate discipline, refine raw potential into excellence, create enduring beauty."
  },

  10: {
    id: 10,
    name: "The Steam",
    symbol: "🔥💧",
    dominantElement: "Fire",
    secondaryElement: "Water",
    keywords: ["Dynamic Tension", "Transformation", "Power", "Alchemy"],
    description: "Fire meeting Water - you harness opposing forces to create power. Your paradoxical nature drives transformation.",
    strengths: ["Incredible transformative power", "Navigates paradox", "Emotional depth with passion", "Drives change"],
    challenges: ["Internal conflict", "Emotional volatility", "Can be unpredictable", "Exhausting to self and others"],
    lifePath: "Master the alchemy of opposites, transform conflict into power, balance passion with emotional wisdom."
  },

  // ==========================================
  // EARTH-DOMINANT ARCHETYPES (5)
  // ==========================================

  11: {
    id: 11,
    name: "The Mountain",
    symbol: "⛰️",
    dominantElement: "Earth",
    secondaryElement: null,
    keywords: ["Stability", "Endurance", "Grounded", "Timeless"],
    description: "Pure Earth energy - unmovable, enduring, majestic. You provide stability and perspective through unwavering presence.",
    strengths: ["Unshakeable stability", "Long-term perspective", "Reliable foundation", "Patient accumulation"],
    challenges: ["Resistance to change", "Can be stubborn", "Slow to act", "May miss opportunities"],
    lifePath: "Stand firm in your truth, provide stability for others, endure through ages while slowly evolving."
  },

  12: {
    id: 12,
    name: "The Garden",
    symbol: "⛰️🌲",
    dominantElement: "Earth",
    secondaryElement: "Wood",
    keywords: ["Fertile Ground", "Nurturing", "Abundance", "Cultivation"],
    description: "Earth nourishing Wood - you are fertile ground where all things grow. Your supportive nature enables others to flourish.",
    strengths: ["Nurtures growth in others", "Creates abundance", "Patient cultivation", "Supportive foundation"],
    challenges: ["May be taken for granted", "Difficulty receiving", "Can enable dependence", "Neglects own needs"],
    lifePath: "Cultivate abundance for all, nurture growth wisely, create sustainable ecosystems of support."
  },

  13: {
    id: 13,
    name: "The Kiln",
    symbol: "⛰️🔥",
    dominantElement: "Earth",
    secondaryElement: "Fire",
    keywords: ["Creative Foundation", "Transformation", "Structure", "Manifestation"],
    description: "Earth shaped by Fire - you transform raw materials into lasting forms through creative discipline and patient craft.",
    strengths: ["Manifests visions into reality", "Combines creativity with structure", "Patient transformation", "Builds lasting value"],
    challenges: ["Slow creative process", "Impatient with imperfection", "Can be controlling", "Rigid standards"],
    lifePath: "Transform ideas into enduring forms, manifest visions patiently, create structures that last generations."
  },

  14: {
    id: 14,
    name: "The Ore",
    symbol: "⛰️⚙️",
    dominantElement: "Earth",
    secondaryElement: "Metal",
    keywords: ["Hidden Value", "Refinement", "Precision", "Quality"],
    description: "Earth containing Metal - you hold precious resources within, refined through pressure into pure value and strength.",
    strengths: ["Inner strength", "Refined quality", "Valuable under pressure", "Precise and methodical"],
    challenges: ["May hide talents", "Slow to reveal value", "Can be overly reserved", "Difficulty with vulnerability"],
    lifePath: "Reveal your inner worth gradually, refine yourself through pressure, offer your precious gifts to the world."
  },

  15: {
    id: 15,
    name: "The Clay",
    symbol: "⛰️💧",
    dominantElement: "Earth",
    secondaryElement: "Water",
    keywords: ["Malleable Foundation", "Adaptive", "Practical", "Flowing"],
    description: "Earth softened by Water - you are grounded yet adaptable, stable yet flowing, practical while intuitive.",
    strengths: ["Balances stability with flexibility", "Practical intuition", "Adapts while staying grounded", "Emotionally stable"],
    challenges: ["Can be indecisive", "May lack clear boundaries", "Difficulty committing", "Overthinks decisions"],
    lifePath: "Balance stability with adaptability, ground your intuitions practically, flow while maintaining foundation."
  },

  // ==========================================
  // METAL-DOMINANT ARCHETYPES (5)
  // ==========================================

  16: {
    id: 16,
    name: "The Blade",
    symbol: "⚔️",
    dominantElement: "Metal",
    secondaryElement: null,
    keywords: ["Precision", "Clarity", "Justice", "Cutting Truth"],
    description: "Pure Metal energy - sharp, clear, precise. You cut through illusion to reveal truth with unwavering clarity.",
    strengths: ["Crystal clear thinking", "Cuts to the heart of matters", "Strong principles", "Incisive analysis"],
    challenges: ["Can be harsh", "May cut too deeply", "Difficulty with ambiguity", "Can seem cold"],
    lifePath: "Wield your clarity with wisdom, cut away falsehood gently, uphold justice with compassion."
  },

  17: {
    id: 17,
    name: "The Autumn Leaves",
    symbol: "⚙️🌲",
    dominantElement: "Metal",
    secondaryElement: "Wood",
    keywords: ["Refined Growth", "Letting Go", "Beauty", "Transformation"],
    description: "Metal cutting Wood - you understand the beauty of release, the art of refinement through what you let go.",
    strengths: ["Graceful release", "Refines through subtraction", "Appreciates transience", "Disciplined growth"],
    challenges: ["May be overly critical", "Difficulty with attachment", "Can prune too much", "Fear of excess"],
    lifePath: "Master the art of letting go, refine through subtraction, find beauty in impermanence and simplicity."
  },

  18: {
    id: 18,
    name: "The Tempered Steel",
    symbol: "⚙️🔥",
    dominantElement: "Metal",
    secondaryElement: "Fire",
    keywords: ["Forged Strength", "Resilience", "Discipline", "Mastery"],
    description: "Metal forged by Fire - you are strengthened through trial, refined through intensity, unbreakable through discipline.",
    strengths: ["Incredible resilience", "Masters skills through practice", "Strong under pressure", "Disciplined excellence"],
    challenges: ["Can be rigid", "May push too hard", "Difficulty relaxing", "Harsh on self and others"],
    lifePath: "Be strengthened by challenges, refine yourself through discipline, maintain flexibility within strength."
  },

  19: {
    id: 19,
    name: "The Jewel",
    symbol: "💎",
    dominantElement: "Metal",
    secondaryElement: "Earth",
    keywords: ["Refined Value", "Precious", "Clarity", "Perfection"],
    description: "Metal refined from Earth - you are precious and rare, formed under pressure, multifaceted in your brilliance.",
    strengths: ["Exceptional quality", "Multifaceted talents", "Refined under pressure", "Precious wisdom"],
    challenges: ["Perfectionism", "Can be demanding", "May seem aloof", "Difficulty with imperfection"],
    lifePath: "Share your refined gifts generously, value your worth without arrogance, reflect light for all."
  },

  20: {
    id: 20,
    name: "The Mirror Lake",
    symbol: "⚙️💧",
    dominantElement: "Metal",
    secondaryElement: "Water",
    keywords: ["Reflective Clarity", "Depth", "Intuitive Precision", "Truth"],
    description: "Metal reflecting Water - you offer perfect reflection with emotional depth, clarity with compassion, truth with kindness.",
    strengths: ["Deep emotional clarity", "Reflects truth kindly", "Intuitive precision", "Wise counsel"],
    challenges: ["Can be overwhelmed by others' emotions", "May lose boundaries", "Difficulty with conflict", "Absorbs negativity"],
    lifePath: "Reflect truth with compassion, maintain clarity while honoring emotions, offer wisdom with gentleness."
  },

  // ==========================================
  // WATER-DOMINANT ARCHETYPES (5)
  // ==========================================

  21: {
    id: 21,
    name: "The River",
    symbol: "🌊",
    dominantElement: "Water",
    secondaryElement: null,
    keywords: ["Flow", "Adaptability", "Persistence", "Journey"],
    description: "Pure Water energy - flowing, persistent, always finding the way. You navigate all obstacles through patient persistence.",
    strengths: ["Ultimate adaptability", "Finds path around obstacles", "Patient persistence", "Emotional wisdom"],
    challenges: ["May lack direction", "Can avoid confrontation", "Difficulty with boundaries", "May lose self in flow"],
    lifePath: "Flow with purpose, persist with patience, carve your path through gentle constant motion."
  },

  22: {
    id: 22,
    name: "The Spring",
    symbol: "💧🌲",
    dominantElement: "Water",
    secondaryElement: "Wood",
    keywords: ["Life Source", "Renewal", "Nourishment", "Origin"],
    description: "Water nourishing Wood - you are the source of life and growth, providing sustenance and renewal to all around you.",
    strengths: ["Nurtures all growth", "Renews energy", "Source of wisdom", "Life-giving presence"],
    challenges: ["May be drained by others", "Difficulty receiving", "Can enable dependence", "Neglects self"],
    lifePath: "Nourish wisely, renew yourself regularly, be the source while maintaining your flow."
  },

  23: {
    id: 23,
    name: "The Mist",
    symbol: "💧🔥",
    dominantElement: "Water",
    secondaryElement: "Fire",
    keywords: ["Mysterious", "Transformative", "Emotional", "Paradox"],
    description: "Water and Fire in balance - you are mystery and transformation, emotional depth with passionate expression.",
    strengths: ["Transformative healing", "Emotional alchemy", "Mysterious allure", "Balances opposites"],
    challenges: ["Emotional volatility", "Can be unpredictable", "Internal conflicts", "Difficulty with stability"],
    lifePath: "Transform emotions into wisdom, balance passion with depth, embrace your paradoxical nature."
  },

  24: {
    id: 24,
    name: "The Well",
    symbol: "💧⛰️",
    dominantElement: "Water",
    secondaryElement: "Earth",
    keywords: ["Deep Resource", "Sustained", "Reliable", "Wisdom"],
    description: "Water held by Earth - you are deep, reliable, sustaining. Your wisdom runs deep and never runs dry.",
    strengths: ["Deep wisdom", "Reliable resource", "Emotional stability", "Sustained nourishment"],
    challenges: ["Can stagnate", "May resist change", "Difficulty with surface matters", "Can be too serious"],
    lifePath: "Offer your deep wisdom generously, maintain your depths while flowing, be reliable without stagnating."
  },

  25: {
    id: 25,
    name: "The Ice",
    symbol: "❄️",
    dominantElement: "Water",
    secondaryElement: "Metal",
    keywords: ["Crystallized Wisdom", "Clarity", "Precision", "Stillness"],
    description: "Water refined by Metal into crystal clarity - you are wisdom crystallized, emotions structured, depth with precision.",
    strengths: ["Crystal clear insight", "Structured emotions", "Precise intuition", "Calm under pressure"],
    challenges: ["Can be emotionally distant", "May seem cold", "Difficulty with spontaneity", "Can freeze others out"],
    lifePath: "Offer your clarity with warmth, structure emotions wisely, thaw when appropriate, crystallize when needed."
  }
};

/**
 * Get archetype by ID
 */
export function getArchetypeById(id) {
  return PERSONALITY_ARCHETYPES[id];
}

/**
 * Get all archetypes as array
 */
export function getAllArchetypes() {
  return Object.values(PERSONALITY_ARCHETYPES);
}

/**
 * Get archetypes by dominant element
 */
export function getArchetypesByElement(element) {
  return getAllArchetypes().filter(archetype => archetype.dominantElement === element);
}
