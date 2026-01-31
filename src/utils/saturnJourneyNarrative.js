/**
 * Saturn Journey Narrative Generator
 *
 * Generates Liz Greene-style psychological prose for Saturn Journey.
 * The narratives are initiatory, not predictive - they describe the
 * psychological weather of Saturn's development arc.
 *
 * Tone: Honest, compassionate, unsensational, non-fatalistic, empowering.
 *
 * GENESIS AstroProfile - January 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build the complete Saturn Journey narrative
 * @param {Object} journeyResult - The Saturn Journey analysis result
 * @returns {Object} - Complete narrative blocks ready for UI
 */
export function buildSaturnJourneyNarrative(journeyResult) {
  const { saturn, wound, defenses, phases, currentPhase, turningPoint, gift, houseModifier, aspectModifiers } = journeyResult;

  const houseText = saturn.house ? ` in the ${formatOrdinal(saturn.house)} house` : '';
  const retrogradeText = saturn.isRetrograde
    ? ' Saturn is retrograde in your chart, intensifying the inner authority theme—the work is more internal, the lessons more private, the mastery more deeply earned.'
    : '';

  return {
    headline: buildHeadline(saturn.sign),
    opening: buildOpening(saturn, houseText, retrogradeText),
    wound: buildWoundNarrative(wound, houseModifier),
    defenses: buildDefensesNarrative(defenses),
    timeline: buildTimelineNarrative(phases, currentPhase),
    return: buildReturnNarrative(turningPoint, currentPhase),
    gift: buildGiftNarrative(gift, saturn.sign),
    lunaGuidance: journeyResult.lunaGuidance || [],
    aspects: buildAspectNarrative(aspectModifiers),
    currentPhaseNarrative: buildCurrentPhaseNarrative(currentPhase)
  };
}

/**
 * Build the headline for the Saturn Journey
 */
function buildHeadline(sign) {
  const headlines = {
    Aries: 'From forced strength to chosen courage',
    Taurus: 'From clinging to building',
    Gemini: 'From clever escape to clear communication',
    Cancer: 'From hidden needs to honored feelings',
    Leo: 'From performance to presence',
    Virgo: 'From perfectionism to mastery',
    Libra: 'From appeasement to authentic harmony',
    Scorpio: 'From control to transformative trust',
    Sagittarius: 'From escape to chosen devotion',
    Capricorn: 'From proving to knowing',
    Aquarius: 'From exile to belonging',
    Pisces: 'From dissolution to sacred boundaries'
  };

  return headlines[sign] || 'The Saturn journey — from fear to earned authority';
}

/**
 * Build the opening narrative
 */
function buildOpening(saturn, houseText, retrogradeText) {
  return `Saturn in ${saturn.sign}${houseText} marks the psychological place where life demanded maturity before it felt comfortable. This is not punishment—it is the curriculum that produces your strongest, most trustworthy self.${retrogradeText}

Where Saturn lives in your chart is where you were asked to grow up early, where you learned the hard lessons, and where—eventually—you become the authority. This is not a quick process. Saturn's gifts are earned through time, through failure, through persistence.

The Saturn Journey is not about overcoming Saturn. It is about becoming Saturn: solid, wise, capable of bearing weight without breaking.`;
}

/**
 * Build the wound narrative
 */
function buildWoundNarrative(wound, houseModifier) {
  let narrative = `**The Saturn Wound** begins as a core fear: ${wound.coreFear}

Early in life, this often manifests as: ${wound.earlyExperience}

Authority became imprinted as: ${wound.authorityImprint}

And the inner critic learned to speak like this: "${wound.innerCriticVoice}"

This creates an attachment pattern of: ${wound.attachmentFlavor}`;

  if (houseModifier) {
    narrative += `\n\nIn the ${houseModifier.arena}, this wound plays out specifically as: ${houseModifier.wound}`;
  }

  return narrative;
}

/**
 * Build the defenses narrative
 */
function buildDefensesNarrative(defenses) {
  return `**Your Defenses** are intelligent adaptations—they kept you safe when you needed them. They are not pathology; they are brilliance under pressure.

**Primary Defense:** ${defenses.primary}

**Secondary Defense:** ${defenses.secondary}

**What They Protect:** ${defenses.protects}

**What They Cost:** ${defenses.cost}

**Somatic Signal:** ${defenses.somaticClue}

These defenses served a purpose. The question is not "how do I eliminate them?" but "when do they still serve me, and when have they become the cage?"`;
}

/**
 * Build the timeline narrative
 */
function buildTimelineNarrative(phases, currentPhase) {
  let narrative = `**The Saturn Tests** are not events you "must" experience—they are psychological weather patterns, questions that arise at predictable points in the maturation process.`;

  if (currentPhase) {
    narrative += ` Right now, at age ${currentPhase.currentAgeYears.toFixed(1)}, you are in the territory of the **${currentPhase.phase.label}**.`;
  }

  narrative += `\n\nThe major Saturn checkpoints:\n`;

  phases.forEach(phase => {
    const exactAge = phase.exactAgeYears.toFixed(1);
    const isActive = currentPhase && currentPhase.phase.key === phase.key;
    const marker = isActive ? ' ← **YOU ARE HERE**' : '';

    narrative += `\n• **${phase.label}** (~${exactAge} years): "${phase.coreQuestion}"${marker}
  Task: ${phase.psychologicalTask}`;
  });

  return narrative;
}

/**
 * Build the Saturn Return narrative
 */
function buildReturnNarrative(turningPoint, currentPhase) {
  const isNearReturn = currentPhase &&
    (currentPhase.phase.key === 'return' || currentPhase.phase.key === 'second_return');

  let urgency = '';
  if (isNearReturn) {
    urgency = `\n\n**This is YOUR time.** You are in or near a Saturn Return window—the threshold moment when the old must give way to the new.`;
  }

  return `**The Saturn Return is Initiation.** It is not a crisis to be avoided but a threshold to be crossed.${urgency}

**What Collapses:** ${turningPoint.collapse}
This is the structure that served the old self—the self that needed approval, that needed to prove something, that hadn't yet claimed its own authority.

**What Must Be Claimed:** ${turningPoint.claim}
This is the work of the Saturn Return: to stop performing authority and start being it.

**The Initiation:** ${turningPoint.initiation}

**The New Rule:** "${turningPoint.newRule}"

After Saturn Return, you stop asking permission. You start building what is truly yours.`;
}

/**
 * Build the gift narrative
 */
function buildGiftNarrative(gift, sign) {
  return `**The Gift of Saturn** is earned authority. Not the authority that comes from title or force, but the authority that comes from having walked the full path.

**Your Authority Style:** ${gift.authorityStyle}
This is how others experience your Saturn when it is integrated—not as restriction, but as stability.

**Your Mastery:** ${gift.mastery}
This is what you are built to be excellent at, once you stop fighting Saturn and start working with it.

**What Others Trust You For:** ${gift.trustedFor}
This is what people recognize in you when your Saturn is matured.

**Your Legacy:** ${gift.legacy}
This is what you leave behind—what your Saturn in ${sign} is here to build.

Saturn's gift is not given. It is earned. But once earned, it cannot be taken away.`;
}

/**
 * Build aspect modifiers narrative
 */
function buildAspectNarrative(aspectModifiers) {
  if (!aspectModifiers || aspectModifiers.length === 0) {
    return null;
  }

  let narrative = `**Saturn's Conversations** with other planets add nuance to your Saturn Journey:\n`;

  aspectModifiers.forEach(mod => {
    const quality = mod.aspectQuality === 'challenging'
      ? mod.modifier.challenging
      : mod.modifier.harmonious;

    narrative += `\n• **Saturn-${mod.planet}** (${mod.aspectType}): ${quality}
  Integration: ${mod.modifier.integration}`;
  });

  return narrative;
}

/**
 * Build current phase narrative
 */
function buildCurrentPhaseNarrative(currentPhase) {
  if (!currentPhase) return null;

  const phase = currentPhase.phase;
  const withinWindow = currentPhase.withinWindow;

  let intensity = '';
  if (withinWindow) {
    intensity = 'You are directly in this Saturn weather. The questions are immediate, the pressure is present.';
  } else {
    intensity = 'You are approaching or leaving this threshold. The themes are active but may feel like echoes or previews.';
  }

  return {
    label: phase.label,
    question: phase.coreQuestion,
    task: phase.psychologicalTask,
    themes: phase.lifeThemes,
    challenges: phase.typicalChallenges,
    intensity,
    age: currentPhase.currentAgeYears
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 */
function formatOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Format years with one decimal
 */
export function formatYears(n) {
  return `${n.toFixed(1)} years`;
}

// ═══════════════════════════════════════════════════════════════════════════
// LUNA INTEGRATION NARRATIVE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build Luna-specific guidance based on Saturn position
 * @param {Object} journeyResult - Saturn Journey result
 * @returns {Object} - Luna guidance object
 */
export function buildLunaIntegration(journeyResult) {
  const { saturn, wound, defenses, currentPhase } = journeyResult;

  return {
    saturnTriggers: buildSaturnTriggers(wound, defenses),
    supportStrategies: buildSupportStrategies(saturn.sign, defenses),
    languageToUse: buildLanguageGuidance(saturn.sign),
    languageToAvoid: buildLanguageToAvoid(saturn.sign),
    currentPhaseSupport: currentPhase ? buildPhaseSupport(currentPhase) : null
  };
}

function buildSaturnTriggers(wound, defenses) {
  return [
    `Fear of: ${wound.coreFear}`,
    `Inner critic activated by: perceived failure or judgment`,
    `Defense pattern triggered by: ${defenses.protects}`,
    `Somatic warning sign: ${defenses.somaticClue}`
  ];
}

function buildSupportStrategies(sign, defenses) {
  const strategies = {
    Aries: ['Honor their autonomy', 'Ask what they want to do about it', 'Avoid rescuing'],
    Taurus: ['Move slowly', 'Affirm what is stable', 'Offer concrete steps'],
    Gemini: ['Listen fully', 'Reflect back', 'Allow silence'],
    Cancer: ['Validate feelings first', 'Be consistent', 'Never threaten connection'],
    Leo: ['See them as human', 'Praise effort over results', 'Invite vulnerability'],
    Virgo: ['Name what is working', 'Offer structure', 'Reframe rest as strategy'],
    Libra: ['Ask what THEY want', 'Model healthy conflict', 'Reward directness'],
    Scorpio: ['Earn trust slowly', 'Name power dynamics', 'Respect privacy'],
    Sagittarius: ['Connect to meaning', 'Frame limits as freedom-serving', 'Avoid guilt'],
    Capricorn: ['Speak to competence', 'Offer evidence against critic', 'Reframe rest'],
    Aquarius: ['Give space', 'Connect through ideas', 'Respect boundaries'],
    Pisces: ['Keep things concrete', 'Encourage boundaries', 'Mirror without absorbing']
  };

  return strategies[sign] || ['Support with patience', 'Honor their process'];
}

function buildLanguageGuidance(sign) {
  const language = {
    Aries: '"What do you want to do?" "You handled that." "You get to choose."',
    Taurus: '"Take your time." "What you built matters." "One step at a time."',
    Gemini: '"I hear you." "Say more." "You made that clear."',
    Cancer: '"Your feelings make sense." "I am here." "What do you need?"',
    Leo: '"I see you." "Your effort matters." "You do not have to shine right now."',
    Virgo: '"This is good enough." "Rest is part of the work." "You are not behind."',
    Libra: '"What do YOU want?" "Disagreement is not abandonment." "Your needs matter."',
    Scorpio: '"I will not leave." "You can tell me when you are ready." "I see your strength."',
    Sagittarius: '"This commitment serves your freedom." "What does this mean to you?"',
    Capricorn: '"You have earned rest." "Your standards are yours to set." "You are enough."',
    Aquarius: '"Your space is respected." "What matters to you?" "Connection adds, not subtracts."',
    Pisces: '"You can feel this AND set a boundary." "Compassion includes you."'
  };

  return language[sign] || '"You are capable." "Take your time." "You are not alone."';
}

function buildLanguageToAvoid(sign) {
  const avoid = {
    Aries: 'Avoid: "Calm down." "You should be patient." "Let me handle it."',
    Taurus: 'Avoid: "Just let it go." "You are being stubborn." "Hurry up."',
    Gemini: 'Avoid: "Get to the point." "You are overthinking." "Just decide."',
    Cancer: 'Avoid: "You are too sensitive." "Get over it." "Stop worrying."',
    Leo: 'Avoid: "You are not that special." "Stop being dramatic." Withdrawal as punishment.',
    Virgo: 'Avoid: "It does not matter." "You are too critical." "Just relax."',
    Libra: 'Avoid: "You are being selfish." "Everyone is upset." Forcing confrontation.',
    Scorpio: 'Avoid: Demanding disclosure. "You are being paranoid." Trivializing intensity.',
    Sagittarius: 'Avoid: "You have to commit." "Stop running." "Be realistic."',
    Capricorn: 'Avoid: "Just relax." "You work too hard." "Lighten up."',
    Aquarius: 'Avoid: "You are being cold." "Why can not you just be normal?" Forcing intimacy.',
    Pisces: 'Avoid: "You are too emotional." "Stop being a martyr." "Face reality."'
  };

  return avoid[sign] || 'Avoid: dismissing their process or rushing them.';
}

function buildPhaseSupport(currentPhase) {
  const phase = currentPhase.phase;

  return {
    acknowledgment: `They are in ${phase.label} territory. The core question is: "${phase.coreQuestion}"`,
    task: `The psychological work is: ${phase.psychologicalTask}`,
    normalizing: `Common themes at this stage: ${phase.lifeThemes?.join(', ')}`,
    patience: 'This is Saturn weather—it passes, but it takes time. Do not rush the process.'
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  buildSaturnJourneyNarrative,
  buildLunaIntegration,
  formatYears
};
