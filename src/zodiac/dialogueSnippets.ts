/**
 * Dialogue Snippets - What to Say & What Not to Say
 *
 * Concrete language guidance for each zodiac sign.
 * This is Susan Miller gold—actual phrases users can say.
 *
 * "Words that heal vs. words that wound"
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';

export interface DialogueGuidance {
  say: string[];        // Phrases that resonate and heal
  avoid: string[];      // Phrases that trigger and wound
  magic: string;        // The one phrase that melts their heart
  danger: string;       // The one phrase that destroys trust
}

export const DIALOGUE_SNIPPETS: Record<SignKey, DialogueGuidance> = {
  Aries: {
    say: [
      '"I trust your instincts."',
      '"Let\'s do it your way."',
      '"I believe in you."',
      '"You\'re brave for taking that on."',
      '"What do you think we should do?"',
    ],
    avoid: [
      '"Calm down."',
      '"Wait and see."',
      '"Let me handle this for you."',
      '"You\'re overreacting."',
      '"That\'s not how it\'s done."',
    ],
    magic: '"I\'m so proud of you."',
    danger: '"You\'re not capable of this."',
  },

  Taurus: {
    say: [
      '"We\'re secure—nothing\'s changing."',
      '"Take your time."',
      '"I\'ll be here."',
      '"I appreciate how hard you work."',
      '"Let\'s make this comfortable."',
    ],
    avoid: [
      '"Hurry up!"',
      '"This changes everything."',
      '"Just go with the flow."',
      '"You\'re being stubborn."',
      '"We need to move fast."',
    ],
    magic: '"You make me feel safe."',
    danger: '"I\'m leaving."',
  },

  Gemini: {
    say: [
      '"Tell me more about that."',
      '"Let\'s talk it through."',
      '"That\'s an interesting perspective."',
      '"What else have you been thinking about?"',
      '"I love how your mind works."',
    ],
    avoid: [
      '"Just decide already."',
      '"Stop overthinking."',
      '"You never finish anything."',
      '"You\'re all over the place."',
      '"This isn\'t important."',
    ],
    magic: '"I never get bored with you."',
    danger: '"You\'re too much."',
  },

  Cancer: {
    say: [
      '"I\'m here for you."',
      '"Your feelings matter to me."',
      '"I\'m not going anywhere."',
      '"You\'re safe with me."',
      '"I understand why you feel that way."',
    ],
    avoid: [
      '"You\'re too sensitive."',
      '"It\'s not a big deal."',
      '"Stop being so emotional."',
      '"Get over it."',
      '"You\'re smothering me."',
    ],
    magic: '"You feel like home."',
    danger: '"I don\'t need you."',
  },

  Leo: {
    say: [
      '"I appreciate you so much."',
      '"You did an amazing job."',
      '"I\'m so lucky to have you."',
      '"You light up my life."',
      '"I\'m proud to be with you."',
    ],
    avoid: [
      '"You\'re overreacting."',
      '"It\'s not about you."',
      '"You\'re being dramatic."',
      '"Whatever."',
      '"No one cares."',
    ],
    magic: '"You\'re extraordinary."',
    danger: '"You\'re embarrassing."',
  },

  Virgo: {
    say: [
      '"Thank you for handling that."',
      '"I noticed how much effort you put in."',
      '"That helps me so much."',
      '"Your attention to detail is amazing."',
      '"What would you suggest?"',
    ],
    avoid: [
      '"You\'re nitpicking."',
      '"Relax, it doesn\'t matter."',
      '"Good enough."',
      '"Don\'t be so critical."',
      '"You worry too much."',
    ],
    magic: '"I don\'t know what I\'d do without you."',
    danger: '"You\'re impossible to please."',
  },

  Libra: {
    say: [
      '"Your perspective matters to me."',
      '"Let\'s find a balance."',
      '"What do you think is fair?"',
      '"I want us both to be happy."',
      '"You always make things more beautiful."',
    ],
    avoid: [
      '"Just choose already!"',
      '"Why can\'t you decide?"',
      '"You\'re being fake."',
      '"Stop trying to please everyone."',
      '"I don\'t care what you think."',
    ],
    magic: '"You bring peace to my life."',
    danger: '"You don\'t matter."',
  },

  Scorpio: {
    say: [
      '"I\'m being completely honest with you."',
      '"I will never betray your trust."',
      '"I see who you really are."',
      '"You can tell me anything."',
      '"I\'m loyal to you."',
    ],
    avoid: [
      '"It\'s not that deep."',
      '"You\'re being paranoid."',
      '"Lighten up."',
      '"I forgot to tell you..."',
      '"It\'s none of your business."',
    ],
    magic: '"I trust you with my secrets."',
    danger: '"I lied to you."',
  },

  Sagittarius: {
    say: [
      '"I support your freedom."',
      '"Let\'s explore that together."',
      '"What an adventure!"',
      '"I believe in your vision."',
      '"The possibilities are endless."',
    ],
    avoid: [
      '"Settle down."',
      '"Be realistic."',
      '"You can\'t do that."',
      '"That\'s never going to work."',
      '"We need to stay put."',
    ],
    magic: '"Let\'s go—I\'m with you."',
    danger: '"You\'re stuck with me."',
  },

  Capricorn: {
    say: [
      '"I respect your hard work."',
      '"We have a solid plan."',
      '"I trust your judgment."',
      '"You\'ve built something amazing."',
      '"I\'m committed to this."',
    ],
    avoid: [
      '"Lighten up."',
      '"You\'re too serious."',
      '"It\'ll work itself out."',
      '"You work too much."',
      '"Who cares about the details?"',
    ],
    magic: '"I respect you deeply."',
    danger: '"You\'re a failure."',
  },

  Aquarius: {
    say: [
      '"I respect your independence."',
      '"Your ideas are fascinating."',
      '"You\'re truly unique."',
      '"I don\'t want to change you."',
      '"What\'s your vision for this?"',
    ],
    avoid: [
      '"Why are you so distant?"',
      '"Be normal."',
      '"Everyone else does it this way."',
      '"You\'re too detached."',
      '"I need you to need me."',
    ],
    magic: '"I\'ve never met anyone like you."',
    danger: '"You\'re weird."',
  },

  Pisces: {
    say: [
      '"I understand how you feel."',
      '"You\'re safe with me."',
      '"Your intuition is powerful."',
      '"I believe your feelings are valid."',
      '"Let\'s dream together."',
    ],
    avoid: [
      '"Get over it."',
      '"That\'s not logical."',
      '"You\'re being unrealistic."',
      '"Stop daydreaming."',
      '"That doesn\'t make sense."',
    ],
    magic: '"You see magic that others miss."',
    danger: '"You\'re delusional."',
  },
};

// =============================================================================
// CONFLICT DIALOGUE HELPERS
// =============================================================================

/**
 * Get the most important phrase to say during conflict
 */
export function getRepairPhrase(sign: SignKey): string {
  return DIALOGUE_SNIPPETS[sign].magic;
}

/**
 * Get the phrase most likely to escalate conflict
 */
export function getDangerPhrase(sign: SignKey): string {
  return DIALOGUE_SNIPPETS[sign].danger;
}

/**
 * Get contextual dialogue suggestions for a pair
 */
export function getPairDialogue(signA: SignKey, signB: SignKey): {
  aToB: { say: string[]; avoid: string[] };
  bToA: { say: string[]; avoid: string[] };
} {
  return {
    aToB: {
      say: DIALOGUE_SNIPPETS[signB].say.slice(0, 3),
      avoid: DIALOGUE_SNIPPETS[signB].avoid.slice(0, 3),
    },
    bToA: {
      say: DIALOGUE_SNIPPETS[signA].say.slice(0, 3),
      avoid: DIALOGUE_SNIPPETS[signA].avoid.slice(0, 3),
    },
  };
}

export default DIALOGUE_SNIPPETS;
