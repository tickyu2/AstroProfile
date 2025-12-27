/**
 * Self-Recognition Types
 *
 * Data structures for the Sanctuary of Self-Recognition.
 * This is where people come to be met, not managed.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import psychologyData from '../utils/psychologicalProfileGenerator';

const {
  generatePsychologicalProfile,
  SUN_PSYCHOLOGY,
  MOON_PSYCHOLOGY,
  RISING_PSYCHOLOGY
} = psychologyData;

/**
 * Input payload for the Sanctuary
 * @typedef {Object} SelfRecognitionInput
 * @property {string|null} [enneagramType] - e.g. "2w1"
 * @property {string|null} [tritype] - e.g. "927"
 * @property {string|null} [center] - e.g. "Heart/Feeling"
 * @property {string|null} [sunSign] - Western sun sign
 * @property {string|null} [moonSign] - Western moon sign
 * @property {string|null} [risingSign] - Western rising sign
 * @property {number|null} [age] - Current age
 * @property {string|null} [emotionalState] - "tired but hopeful"
 * @property {string|null} [whatHurts] - Their own words about pain
 * @property {string|null} [whatTheyLongFor] - Their deepest longings
 * @property {string|null} [patternsTheyNotice] - Self-observed patterns
 * @property {string|null} [questionsOrIntentions] - What they seek from this visit
 */

/**
 * A section of the recognition response
 * @typedef {Object} SelfRecognitionSection
 * @property {string} title - Section title
 * @property {string[]} lines - Lines of recognition text
 */

/**
 * Take-home rituals from the Sanctuary
 * @typedef {Object} SelfRecognitionRituals
 * @property {string} release - Short guided emotional release
 * @property {string} reflection - Journaling / inner inquiry prompt
 * @property {string} grounding - Body or breath-based grounding
 * @property {string} integration - How to carry this into daily life
 */

/**
 * Full response from the Sanctuary
 * @typedef {Object} SelfRecognitionResponse
 * @property {SelfRecognitionSection} arrival - Movement I: Welcome
 * @property {SelfRecognitionSection} mirror - Movement II: Recognition
 * @property {SelfRecognitionSection} release - Movement III: Permission to feel
 * @property {SelfRecognitionSection} integration - Movement IV: Carrying forward
 * @property {SelfRecognitionRituals} rituals - Take-home practices
 * @property {string} shortMantra - A one-line soul reminder
 */

/**
 * Create an empty input payload
 * @returns {SelfRecognitionInput}
 */
export function createEmptyInput() {
  return {
    enneagramType: null,
    tritype: null,
    center: null,
    sunSign: null,
    moonSign: null,
    risingSign: null,
    age: null,
    emotionalState: null,
    whatHurts: null,
    whatTheyLongFor: null,
    patternsTheyNotice: null,
    questionsOrIntentions: null
  };
}

/**
 * Validate that input has enough content for meaningful recognition
 * @param {SelfRecognitionInput} input
 * @returns {boolean}
 */
export function hasMinimumContent(input) {
  // Need at least one of these filled in
  return !!(
    input.whatHurts ||
    input.whatTheyLongFor ||
    input.patternsTheyNotice ||
    input.emotionalState
  );
}

/**
 * Build input from a profile's existing data
 * @param {Object} profile - User profile with enneagram, chart data
 * @returns {SelfRecognitionInput}
 */
export function buildInputFromProfile(profile) {
  const input = createEmptyInput();

  if (!profile) return input;

  // Extract Enneagram data if available
  if (profile.enneagram) {
    const enn = profile.enneagram;
    // Handle different field names: dominantType, coreType, type
    const coreType = enn.dominantType || enn.coreType || enn.type;
    if (coreType) {
      input.enneagramType = enn.wing
        ? `${coreType}w${enn.wing}`
        : String(coreType);
    }
    if (enn.tritype) {
      input.tritype = String(enn.tritype);
    }
    // Determine center from dominant type
    const type = Number(coreType);
    if ([8, 9, 1].includes(type)) input.center = 'Gut/Instinctive';
    else if ([2, 3, 4].includes(type)) input.center = 'Heart/Feeling';
    else if ([5, 6, 7].includes(type)) input.center = 'Head/Thinking';
  }

  // Extract Western chart data - check calculations.western.sovereignCalculation (primary source)
  const western = profile.calculations?.western;
  const sovereign = western?.sovereignCalculation;

  if (sovereign) {
    // Sovereign calculation has precise Sun/Moon/Rising
    if (sovereign.sun?.sign) input.sunSign = sovereign.sun.sign;
    if (sovereign.moon?.sign) input.moonSign = sovereign.moon.sign;
    if (sovereign.rising?.sign) input.risingSign = sovereign.rising.sign;
  }

  // Fallback: check western.sign for just the sun sign
  if (!input.sunSign && western?.sign) {
    input.sunSign = western.sign;
  }

  // Fallback: check planets array
  if (!input.sunSign || !input.moonSign) {
    if (profile.planets && Array.isArray(profile.planets)) {
      const sun = profile.planets.find(p => p.name?.toLowerCase() === 'sun');
      const moon = profile.planets.find(p => p.name?.toLowerCase() === 'moon');
      if (!input.sunSign && sun?.sign) input.sunSign = sun.sign;
      if (!input.moonSign && moon?.sign) input.moonSign = moon.sign;
    }
  }

  // Fallback: check direct sunSign, moonSign fields
  if (!input.sunSign && profile.sunSign) {
    input.sunSign = profile.sunSign;
  }
  if (!input.moonSign && profile.moonSign) {
    input.moonSign = profile.moonSign;
  }

  // Fallback: check westernSign field (just sun sign)
  if (!input.sunSign && profile.westernSign) {
    input.sunSign = profile.westernSign;
  }

  // Rising sign fallbacks (if not already set from sovereign)
  if (!input.risingSign) {
    if (profile.rising?.sign) {
      input.risingSign = profile.rising.sign;
    } else if (profile.ascendant?.sign) {
      input.risingSign = profile.ascendant.sign;
    } else if (profile.risingSign) {
      input.risingSign = profile.risingSign;
    }
  }

  // Calculate age if birthDate is available
  if (profile.birthDate) {
    try {
      const birthDate = profile.birthDate.toDate
        ? profile.birthDate.toDate()
        : new Date(profile.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0) {
        input.age = age;
      }
    } catch (e) {
      // Ignore date parsing errors
    }
  }

  return input;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENNEAGRAM SOUL DESCRIPTIONS - The Deep Psychology
// ═══════════════════════════════════════════════════════════════════════════

const ENNEAGRAM_SOUL = {
  1: {
    archetype: "The Perfectionist / The Reformer",
    coreWound: "You learned early that you were only lovable when you were 'good.' The world felt chaotic, and you became the one who could make it right.",
    coreFear: "Being corrupt, evil, defective, or wrong",
    coreDesire: "To be good, to have integrity, to be balanced",
    sacredGift: "Your gift is seeing what could be better and having the discipline to make it so. You hold the world to its highest standard.",
    sacredCost: "The cost is that the inner critic never sleeps. You hold yourself to impossible standards and feel the weight of every imperfection.",
    shadowSide: "Resentment disguised as righteousness. Judging others for not meeting standards you struggle to meet yourself.",
    growthPath: "Learning that you are already good. That imperfection is not failure. That serenity comes from accepting what is, not just fixing it.",
    soulMessage: "You don't have to be perfect to be loved. Your goodness was never in question."
  },
  2: {
    archetype: "The Helper / The Giver",
    coreWound: "You learned early that your needs didn't matter - only others' needs counted. Love became something you earned by giving.",
    coreFear: "Being unwanted, unworthy of being loved for yourself",
    coreDesire: "To feel loved, to be needed, to be appreciated",
    sacredGift: "Your gift is seeing what others need before they know it themselves. You create warmth and connection wherever you go.",
    sacredCost: "The cost is that you've forgotten how to receive. You give until empty, then feel resentful that no one sees your needs.",
    shadowSide: "Manipulation through giving. Pride in being indispensable. Keeping score of all you've done for others.",
    growthPath: "Learning that you are worthy of love simply for existing. That receiving is not weakness. That your needs matter too.",
    soulMessage: "You are loved for who you are, not for what you do for others. Your presence is the gift."
  },
  3: {
    archetype: "The Achiever / The Performer",
    coreWound: "You learned early that love was conditional on success. Your value became tied to achievement and the image you project.",
    coreFear: "Being worthless, without inherent value apart from achievements",
    coreDesire: "To feel valuable, successful, worthwhile",
    sacredGift: "Your gift is seeing potential and manifesting it. You inspire others with your drive and show what's possible.",
    sacredCost: "The cost is that you've become a human doing instead of a human being. Success feels hollow because you're not sure who you are underneath.",
    shadowSide: "Deception - of others and yourself. Confusing the image with the reality. Running from failure at all costs.",
    growthPath: "Learning that you are valuable simply for existing. That failure is information, not identity. That authenticity trumps achievement.",
    soulMessage: "You don't have to be successful to be loved. The real you is more than enough."
  },
  4: {
    archetype: "The Individualist / The Romantic",
    coreWound: "You felt abandoned or different from the start. Something essential was missing, and you've been searching for it ever since.",
    coreFear: "Having no identity or personal significance, being fundamentally flawed",
    coreDesire: "To find yourself and your significance, to be unique",
    sacredGift: "Your gift is depth. You feel the full spectrum of human emotion and transform pain into beauty. You make others feel less alone.",
    sacredCost: "The cost is living in longing. The melancholy that colors everything. The sense that happiness is always somewhere else.",
    shadowSide: "Envy of what others have. Self-absorption. Pushing people away to prove they'll leave anyway.",
    growthPath: "Learning that what you seek is already here. That ordinary is not the enemy. That you belong even when you feel different.",
    soulMessage: "You are not missing anything. The depth you seek is already within you. You belong here."
  },
  5: {
    archetype: "The Investigator / The Observer",
    coreWound: "The world felt overwhelming and intrusive. You retreated into your mind where you could understand and control your experience.",
    coreFear: "Being useless, helpless, or incapable; being overwhelmed by needs",
    coreDesire: "To be capable and competent, to understand the world",
    sacredGift: "Your gift is insight. You see patterns others miss and offer clarity in confusion. Your mind is a sanctuary of wisdom.",
    sacredCost: "The cost is isolation. Life observed but not fully lived. Hoarding energy and knowledge while connection withers.",
    shadowSide: "Detachment as defense. Superiority through knowledge. Replacing living with thinking about living.",
    growthPath: "Learning that engagement doesn't drain you. That you have enough. That knowledge without connection is incomplete.",
    soulMessage: "You have enough. You are enough. It's safe to come out of your head and into life."
  },
  6: {
    archetype: "The Loyalist / The Skeptic",
    coreWound: "The world felt unpredictable and threatening. You learned to scan for danger and question everything to stay safe.",
    coreFear: "Being without support or guidance, being unable to survive alone",
    coreDesire: "To have security and support, to feel safe",
    sacredGift: "Your gift is loyalty and foresight. You see dangers others miss and stand by your people through anything.",
    sacredCost: "The cost is chronic anxiety. Never feeling safe. Doubting yourself and others even when trust is earned.",
    shadowSide: "Projecting fear onto others. Testing loyalty until you destroy it. Authority issues - resisting or blindly following.",
    growthPath: "Learning that you can trust yourself. That uncertainty is survivable. That courage isn't the absence of fear but acting despite it.",
    soulMessage: "You are safe. You are capable. You can trust yourself to handle whatever comes."
  },
  7: {
    archetype: "The Enthusiast / The Epicure",
    coreWound: "Pain was too much to bear, so you learned to escape into possibility, pleasure, and the next exciting thing.",
    coreFear: "Being trapped in pain or deprivation, missing out on life",
    coreDesire: "To be satisfied and content, to have needs fulfilled",
    sacredGift: "Your gift is joy and vision. You see possibility everywhere and help others believe in brighter futures.",
    sacredCost: "The cost is never landing. Running from pain means running from depth. The sparkle can become a distraction from substance.",
    shadowSide: "Gluttony - for experiences, ideas, stimulation. Commitment phobia. Using positivity to bypass difficult emotions.",
    growthPath: "Learning that you can be with pain without being destroyed. That depth comes from staying, not leaving. That joy deepens through presence.",
    soulMessage: "You don't have to keep running. Everything you're seeking is available right here, right now."
  },
  8: {
    archetype: "The Challenger / The Protector",
    coreWound: "The world was unjust, and the only way to survive was to become strong. Vulnerability meant being hurt or controlled.",
    coreFear: "Being harmed or controlled by others, being weak",
    coreDesire: "To protect yourself and those in your care, to be in control",
    sacredGift: "Your gift is strength and truth. You protect the vulnerable, confront injustice, and bring raw honesty to every room.",
    sacredCost: "The cost is isolation at the top. The exhaustion of constant vigilance. The tenderness you've armored over that yearns to be seen.",
    shadowSide: "Domination. Excessive force. Believing vulnerability is weakness. Destroying what you want to protect.",
    growthPath: "Learning that vulnerability is strength, not weakness. That you can be soft without being destroyed. That true power includes surrender.",
    soulMessage: "You don't have to fight anymore. It's safe to be soft. Your tenderness is your greatest strength."
  },
  9: {
    archetype: "The Peacemaker / The Mediator",
    coreWound: "Your presence didn't seem to matter. To keep the peace, you merged with others and forgot you had your own voice.",
    coreFear: "Loss and separation, of fragmentation, of conflict",
    coreDesire: "To have inner stability and peace of mind",
    sacredGift: "Your gift is harmony. You see all perspectives, bring people together, and create spaces of acceptance and calm.",
    sacredCost: "The cost is self-forgetting. Numbing out to avoid conflict. Waking up years later wondering where your life went.",
    shadowSide: "Passive aggression. Stubborn inaction. Merging so completely you don't know where you end and others begin.",
    growthPath: "Learning that your voice matters. That conflict is survivable. That showing up fully is more loving than disappearing.",
    soulMessage: "You matter. Your voice deserves to be heard. Your presence makes a difference."
  }
};

/**
 * Build Deep Soul Context - The full living architecture of a soul
 * This is what transforms generic recognition into profound understanding.
 *
 * @param {Object} profile - Full profile with calculations, enneagram, biography
 * @param {Object} userInput - User's current emotional state, what hurts, what they long for
 * @returns {Object} Deep soul context for the AI
 */
export function buildDeepSoulContext(profile, userInput = {}) {
  const context = {
    // Basic identity
    name: profile.name || profile.displayName || 'Dear Soul',
    age: null,

    // Psychological architecture
    sunPsychology: null,
    moonPsychology: null,
    risingPsychology: null,

    // Enneagram soul
    enneagramSoul: null,

    // The person's own words (most important)
    currentEmotionalState: userInput.emotionalState || null,
    whatHurts: userInput.whatHurts || null,
    whatTheyLongFor: userInput.whatTheyLongFor || null,
    patternsTheyNotice: userInput.patternsTheyNotice || null,
    questionsOrIntentions: userInput.questionsOrIntentions || null,

    // Biography narrative (if available)
    biographyHighlights: null,

    // Summary flags
    hasDeepContext: false
  };

  if (!profile) return context;

  // ─────────────────────────────────────────────────────────────────────────
  // Extract Age
  // ─────────────────────────────────────────────────────────────────────────
  if (profile.birthDate) {
    try {
      const birthDate = profile.birthDate.toDate
        ? profile.birthDate.toDate()
        : new Date(profile.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0) context.age = age;
    } catch (e) { /* ignore */ }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Extract Sun, Moon, Rising Signs and their Psychology
  // ─────────────────────────────────────────────────────────────────────────
  const western = profile.calculations?.western;
  const sovereign = western?.sovereignCalculation;

  let sunSign = sovereign?.sun?.sign || western?.sign || null;
  let moonSign = sovereign?.moon?.sign || null;
  let risingSign = sovereign?.rising?.sign || null;

  // Get full psychological profiles for each
  if (sunSign && SUN_PSYCHOLOGY[sunSign]) {
    context.sunPsychology = {
      sign: sunSign,
      ...SUN_PSYCHOLOGY[sunSign]
    };
    context.hasDeepContext = true;
  }

  if (moonSign && MOON_PSYCHOLOGY[moonSign]) {
    context.moonPsychology = {
      sign: moonSign,
      ...MOON_PSYCHOLOGY[moonSign]
    };
    context.hasDeepContext = true;
  }

  if (risingSign && RISING_PSYCHOLOGY && RISING_PSYCHOLOGY[risingSign]) {
    context.risingPsychology = {
      sign: risingSign,
      ...RISING_PSYCHOLOGY[risingSign]
    };
    context.hasDeepContext = true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Extract Enneagram Soul (the deep psychology, not just the number)
  // ─────────────────────────────────────────────────────────────────────────
  if (profile.enneagram) {
    const enn = profile.enneagram;
    const coreType = Number(enn.dominantType || enn.coreType || enn.type);

    if (coreType && ENNEAGRAM_SOUL[coreType]) {
      context.enneagramSoul = {
        type: coreType,
        wing: enn.wing || null,
        tritype: enn.tritype || null,
        instinctVariant: enn.instinctVariant || enn.variant || null,
        ...ENNEAGRAM_SOUL[coreType]
      };
      context.hasDeepContext = true;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Extract Biography Highlights (if available)
  // ─────────────────────────────────────────────────────────────────────────
  if (profile.biography || profile.lifeEvents) {
    const bio = profile.biography || {};
    const events = profile.lifeEvents || [];

    if (events.length > 0 || bio.summary) {
      context.biographyHighlights = {
        summary: bio.summary || null,
        significantEvents: events.slice(0, 5).map(e => ({
          year: e.year,
          event: e.description || e.event,
          emotionalSignificance: e.emotionalSignificance || null
        }))
      };
      context.hasDeepContext = true;
    }
  }

  return context;
}

/**
 * Format Deep Soul Context into a narrative for the AI
 * This transforms structured data into soulful language
 *
 * @param {Object} deepContext - Output from buildDeepSoulContext
 * @returns {string} Narrative soul portrait
 */
export function formatDeepSoulNarrative(deepContext) {
  const parts = [];

  // Opening
  parts.push(`=== SOUL PORTRAIT: ${deepContext.name} ===\n`);

  if (deepContext.age) {
    parts.push(`Age: ${deepContext.age} years on this earth.\n`);
  }

  // Sun Psychology (Core Identity)
  if (deepContext.sunPsychology) {
    const sun = deepContext.sunPsychology;
    parts.push(`\n--- CORE IDENTITY (Sun in ${sun.sign}) ---`);
    parts.push(`Archetype: ${sun.coreIdentity}`);
    parts.push(`Purpose: ${sun.consciousPurpose}`);
    parts.push(`Central Drive: ${sun.centralDrive}`);
    parts.push(`Light Expression: ${sun.lightExpression}`);
    parts.push(`Shadow Tendency: ${sun.shadowTendency}`);
    parts.push(`Life Question: "${sun.lifeQuestion}"`);
    parts.push(`Growth Path: ${sun.growthPath}\n`);
  }

  // Moon Psychology (Emotional Needs)
  if (deepContext.moonPsychology) {
    const moon = deepContext.moonPsychology;
    parts.push(`\n--- EMOTIONAL NATURE (Moon in ${moon.sign}) ---`);
    parts.push(`Inner World: ${moon.emotionalNature}`);
    parts.push(`What They Need: ${moon.innerNeeds}`);
    parts.push(`Under Stress: ${moon.instinctualResponse}`);
    parts.push(`Childhood Pattern: ${moon.childhoodPattern}`);
    parts.push(`Emotional Shadow: ${moon.emotionalShadow}`);
    parts.push(`How They Nurture: ${moon.nurturingStyle}\n`);
  }

  // Rising Psychology (The Mask)
  if (deepContext.risingPsychology) {
    const rising = deepContext.risingPsychology;
    parts.push(`\n--- THE MASK & FIRST IMPRESSION (${rising.sign} Rising) ---`);
    if (rising.mask) parts.push(`The Mask: ${rising.mask}`);
    if (rising.approach) parts.push(`Approach to Life: ${rising.approach}`);
    if (rising.firstImpression) parts.push(`First Impression: ${rising.firstImpression}\n`);
  }

  // Enneagram Soul (The Deepest Layer)
  if (deepContext.enneagramSoul) {
    const enn = deepContext.enneagramSoul;
    parts.push(`\n--- SOUL ARCHITECTURE (Enneagram ${enn.type}${enn.wing ? 'w' + enn.wing : ''}) ---`);
    parts.push(`Archetype: ${enn.archetype}`);
    parts.push(`\n**The Core Wound:**\n${enn.coreWound}`);
    parts.push(`\n**What They Fear Most:**\n${enn.coreFear}`);
    parts.push(`\n**What They Long For:**\n${enn.coreDesire}`);
    parts.push(`\n**Their Sacred Gift:**\n${enn.sacredGift}`);
    parts.push(`\n**The Sacred Cost:**\n${enn.sacredCost}`);
    parts.push(`\n**The Shadow Side:**\n${enn.shadowSide}`);
    parts.push(`\n**Growth Path:**\n${enn.growthPath}`);
    parts.push(`\n**Soul Message:**\n"${enn.soulMessage}"\n`);
  }

  // Their Own Words (Most Important)
  parts.push(`\n=== THEIR OWN WORDS (Most Important) ===\n`);

  if (deepContext.currentEmotionalState) {
    parts.push(`**Current Emotional State:**\n"${deepContext.currentEmotionalState}"\n`);
  }

  if (deepContext.whatHurts) {
    parts.push(`**What Hurts Right Now:**\n"${deepContext.whatHurts}"\n`);
  }

  if (deepContext.whatTheyLongFor) {
    parts.push(`**What They Long For:**\n"${deepContext.whatTheyLongFor}"\n`);
  }

  if (deepContext.patternsTheyNotice) {
    parts.push(`**Patterns They Notice in Themselves:**\n"${deepContext.patternsTheyNotice}"\n`);
  }

  if (deepContext.questionsOrIntentions) {
    parts.push(`**What They Seek From This Visit:**\n"${deepContext.questionsOrIntentions}"\n`);
  }

  // Biography Highlights
  if (deepContext.biographyHighlights) {
    const bio = deepContext.biographyHighlights;
    parts.push(`\n--- LIFE CONTEXT ---`);
    if (bio.summary) {
      parts.push(`Summary: ${bio.summary}`);
    }
    if (bio.significantEvents && bio.significantEvents.length > 0) {
      parts.push(`Significant Life Events:`);
      bio.significantEvents.forEach(e => {
        parts.push(`  - ${e.year ? `(${e.year}) ` : ''}${e.event}`);
      });
    }
  }

  return parts.join('\n');
}
