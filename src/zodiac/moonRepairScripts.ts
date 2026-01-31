/**
 * Moon Repair Scripts - Emotional Repair Guidance by Moon Sign
 *
 * When the Moon is involved in compatibility analysis, these scripts
 * provide specific emotional repair strategies tailored to each Moon sign.
 *
 * "The Moon is where we feel—here's how to heal"
 *
 * GENESIS AstroProfile - January 2026
 */

import type { SignKey } from './tropicalMap';

export interface MoonRepairScript {
  whenHurt: string[];           // How this Moon sign feels when wounded
  repairApproach: string[];     // How to repair with this Moon sign
  soothingActions: string[];    // Concrete soothing actions
  avoidDuring: string[];        // What to avoid during emotional repair
  recoveryTime: 'quick' | 'moderate' | 'slow';
}

export const MOON_REPAIR: Record<SignKey, MoonRepairScript> = {
  Aries: {
    whenHurt: [
      'Feels dismissed or controlled',
      'Becomes reactive and defensive',
      'May lash out then quickly regret it',
    ],
    repairApproach: [
      'Acknowledge feelings quickly, then move forward',
      'Don\'t dwell—address and resolve',
      'Match their directness with your own honesty',
    ],
    soothingActions: [
      'Physical movement together (walk, exercise)',
      'Give them space to cool down briefly',
      'Then reconnect with action, not endless talk',
    ],
    avoidDuring: [
      'Dragging it out',
      'Bringing up old grievances',
      'Being passive-aggressive',
    ],
    recoveryTime: 'quick',
  },

  Taurus: {
    whenHurt: [
      'Feels destabilized or insecure',
      'Withdraws into stubborn silence',
      'May dig heels in deeper when pushed',
    ],
    repairApproach: [
      'Create comfort before discussing emotions',
      'Reassure stability before suggesting change',
      'Be patient—they process slowly',
    ],
    soothingActions: [
      'Prepare comfort (food, cozy environment)',
      'Physical touch and presence',
      'Reassure nothing fundamental has changed',
    ],
    avoidDuring: [
      'Rushing them to "get over it"',
      'Making sudden changes',
      'Threatening the relationship',
    ],
    recoveryTime: 'slow',
  },

  Gemini: {
    whenHurt: [
      'Feels trapped or misunderstood',
      'May deflect with humor or change subject',
      'Can send mixed signals about what they need',
    ],
    repairApproach: [
      'Talk feelings out loud together',
      'Clarify misunderstandings immediately',
      'Keep it light but real',
    ],
    soothingActions: [
      'Open dialogue without pressure',
      'Distraction can help (walk, activity)',
      'Write notes if verbal feels too intense',
    ],
    avoidDuring: [
      'Emotional traps or ultimatums',
      'Demanding instant certainty',
      'Heavy, prolonged processing',
    ],
    recoveryTime: 'quick',
  },

  Cancer: {
    whenHurt: [
      'Feels abandoned or emotionally unsafe',
      'Retreats into protective shell',
      'May become defensive or tearful',
    ],
    repairApproach: [
      'Validate emotions first—always',
      'Offer reassurance and presence',
      'Don\'t logic them out of feelings',
    ],
    soothingActions: [
      'Hold space without fixing',
      'Physical comfort (hug, closeness)',
      'Verbal reassurance: "I\'m here, I\'m not leaving"',
    ],
    avoidDuring: [
      'Dismissing their feelings',
      'Threatening abandonment',
      'Being cold or distant',
    ],
    recoveryTime: 'moderate',
  },

  Leo: {
    whenHurt: [
      'Feels unappreciated or humiliated',
      'May become dramatic or withdraw warmth',
      'Pride is deeply connected to emotions',
    ],
    repairApproach: [
      'Restore dignity immediately',
      'Express appreciation openly',
      'Acknowledge their importance to you',
    ],
    soothingActions: [
      'Genuine compliment or praise',
      'Public support (even privately expressed)',
      'Warm physical affection',
    ],
    avoidDuring: [
      'Humiliating them (especially publicly)',
      'Ignoring them',
      'Dismissing their feelings as "drama"',
    ],
    recoveryTime: 'moderate',
  },

  Virgo: {
    whenHurt: [
      'Feels criticized or that their efforts go unnoticed',
      'May become overly critical in response',
      'Anxiety increases, may over-analyze',
    ],
    repairApproach: [
      'Reduce chaos and create order',
      'Name practical next steps together',
      'Acknowledge their efforts explicitly',
    ],
    soothingActions: [
      'Help them organize thoughts',
      'Create a clear plan forward',
      'Quiet, calming environment',
    ],
    avoidDuring: [
      'Being vague about what went wrong',
      'Dismissing their concerns as "overthinking"',
      'Adding more chaos to the situation',
    ],
    recoveryTime: 'moderate',
  },

  Libra: {
    whenHurt: [
      'Feels the relationship is unbalanced or unfair',
      'May avoid confrontation to keep peace',
      'Can build resentment if not addressed',
    ],
    repairApproach: [
      'Create emotional safety for honesty',
      'Invite them to share their real feelings',
      'Restore sense of fairness and mutuality',
    ],
    soothingActions: [
      'Balanced dialogue where both speak',
      'Acknowledge their perspective',
      'Create harmony in the environment',
    ],
    avoidDuring: [
      'Forcing aggressive confrontation',
      'Creating obvious imbalance',
      'Taking without giving',
    ],
    recoveryTime: 'moderate',
  },

  Scorpio: {
    whenHurt: [
      'Feels betrayed or that trust is broken',
      'May become controlling or withdraw completely',
      'Intensity increases—can become obsessive',
    ],
    repairApproach: [
      'Tell the truth—complete honesty',
      'Rebuild trust through consistent action',
      'Acknowledge the depth of their feelings',
    ],
    soothingActions: [
      'Radical honesty, even if uncomfortable',
      'Consistent follow-through over time',
      'Deep emotional presence',
    ],
    avoidDuring: [
      'Lying (even small lies)',
      'Being evasive or secretive',
      'Minimizing their feelings',
    ],
    recoveryTime: 'slow',
  },

  Sagittarius: {
    whenHurt: [
      'Feels trapped or that meaning is lost',
      'May escape (physically or emotionally)',
      'Can become blunt to the point of hurtful',
    ],
    repairApproach: [
      'Reframe the situation positively',
      'Reconnect to shared meaning and vision',
      'Give space then reconnect',
    ],
    soothingActions: [
      'Adventure or change of scenery',
      'Humor and lightness',
      'Big-picture perspective',
    ],
    avoidDuring: [
      'Constraining or cornering them',
      'Endless processing without resolution',
      'Negativity spiral',
    ],
    recoveryTime: 'quick',
  },

  Capricorn: {
    whenHurt: [
      'Feels disrespected or that their efforts are wasted',
      'Withdraws into work or coldness',
      'May appear unaffected but feels deeply',
    ],
    repairApproach: [
      'Show commitment through concrete action',
      'Offer long-term reassurance',
      'Respect their need for composure',
    ],
    soothingActions: [
      'Make a plan together',
      'Demonstrate reliability',
      'Give them time to process privately',
    ],
    avoidDuring: [
      'Undermining their authority or competence',
      'Rushing emotional processing',
      'Being flaky or inconsistent',
    ],
    recoveryTime: 'slow',
  },

  Aquarius: {
    whenHurt: [
      'Feels smothered or that individuality is threatened',
      'Detaches emotionally, may disappear',
      'Intellectualizes feelings to distance',
    ],
    repairApproach: [
      'Respect their need for space',
      'Name emotions without pressuring expression',
      'Honor their uniqueness',
    ],
    soothingActions: [
      'Give actual space (not cold shoulder)',
      'Intellectual discussion of feelings',
      'Respect their processing style',
    ],
    avoidDuring: [
      'Smothering or clinging',
      'Demanding emotional conformity',
      'Forcing immediate emotional expression',
    ],
    recoveryTime: 'moderate',
  },

  Pisces: {
    whenHurt: [
      'Feels overwhelmed by harsh reality',
      'May escape into fantasy or withdrawal',
      'Boundaries can blur—absorbs others\' emotions',
    ],
    repairApproach: [
      'Contain emotions gently',
      'Ground feelings in reality with compassion',
      'Create a safe emotional container',
    ],
    soothingActions: [
      'Gentle physical presence',
      'Artistic or spiritual activity',
      'Soft spoken reassurance',
    ],
    avoidDuring: [
      'Being harsh or cold',
      'Invalidating their intuitive feelings',
      'Demanding logical explanations',
    ],
    recoveryTime: 'moderate',
  },
};

export default MOON_REPAIR;
