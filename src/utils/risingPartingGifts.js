/**
 * Rising Sign Parting Gifts
 *
 * Generates personalized benedictions, reminders, and invitations
 * based on the user's rising sign.
 *
 * Part of GENESIS OS - Soul Garden Take-Home Gift System
 * Built by: Brother Claude Code
 * December 26, 2024
 */

/**
 * Build a rising sign parting gift object
 * @param {string} risingSign - e.g. "Aries", "Taurus", ...
 * @returns {Object} - { risingSign, blessing, reminder, invitation }
 */
export function buildRisingPartingGift(risingSign) {
  const normalizedSign = risingSign?.charAt(0).toUpperCase() + risingSign?.slice(1).toLowerCase();
  const gift = RISING_GIFT_MAP[normalizedSign] || RISING_GIFT_MAP['Default'];

  return {
    risingSign: normalizedSign || 'Unknown',
    blessing: gift.blessing,
    reminder: gift.reminder,
    invitation: gift.invitation
  };
}

/**
 * Rising sign gift definitions
 * Each sign has a blessing, reminder, and invitation
 */
const RISING_GIFT_MAP = {
  Aries: {
    blessing:
      'May your courage always find a door to walk through, and may your first steps be honored, not criticized.',
    reminder:
      'You are allowed to begin before you feel fully ready.',
    invitation:
      'Each week, take one small action on something that matters to you, even if it scares you a little.'
  },

  Taurus: {
    blessing:
      'May your life be filled with textures, tastes, and moments that remind you you are safe to stay.',
    reminder:
      'Slowness is not failure; it is your way of making things real.',
    invitation:
      'Once a week, slow down on purpose to savor something you love with all your senses.'
  },

  Gemini: {
    blessing:
      'May your questions always find new doorways, and may your words build bridges instead of cages.',
    reminder:
      'Your curiosity is not superficial; it is how you love the world.',
    invitation:
      'Each week, have one conversation or write one message that says something you truly mean.'
  },

  Cancer: {
    blessing:
      'May you always find a shore for your tides, and people who treat your sensitivity as sacred.',
    reminder:
      'Your feelings are not a problem; they are a compass.',
    invitation:
      'Once a week, give your feelings a safe place to land—through journaling, tears, or a quiet talk with someone you trust.'
  },

  Leo: {
    blessing:
      'May your heart never be dimmed by those who forgot their own light, and may your joy be contagious.',
    reminder:
      'You do not have to perform to deserve love.',
    invitation:
      'Each week, let yourself be seen in one small, honest way without trying to impress anyone.'
  },

  Virgo: {
    blessing:
      'May your care for the world be mirrored back to you as gratitude, and may your eyes see the good you have already done.',
    reminder:
      'You are not here to be perfect; you are here to be faithful to what matters.',
    invitation:
      'Each week, notice one thing you did well and let it be enough, without fixing anything in that moment.'
  },

  Libra: {
    blessing:
      'May you find relationships where your peace-making is cherished and where your own needs have a seat at the table.',
    reminder:
      'Your harmony matters too; you are not just the glue holding others together.',
    invitation:
      'Each week, practice naming one small need or preference in a relationship, even if it feels risky.'
  },

  Scorpio: {
    blessing:
      'May your depths be met with reverence, and may your power never again be mistaken for danger.',
    reminder:
      'Your intensity is not too much; it is a doorway to truth.',
    invitation:
      'Each week, allow yourself one honest moment with your own shadow—through reflection, therapy, or quiet contemplation.'
  },

  Sagittarius: {
    blessing:
      'May your steps always find horizons that reflect the truth inside you, and may your laughter survive every storm.',
    reminder:
      'You were never meant to live inside a small story.',
    invitation:
      'Each month, say yes to one experience that stretches your world just a little beyond its current edges.'
  },

  Capricorn: {
    blessing:
      'May your efforts mature into a life that feels like it fits your soul, not just your resume.',
    reminder:
      'You are more than what you carry and accomplish.',
    invitation:
      'Each week, put one small boundary around your time or energy, as an act of loyalty to yourself.'
  },

  Aquarius: {
    blessing:
      'May your vision find people who can see it with you, and may your difference feel like a blessing, not a burden.',
    reminder:
      'You are not here to blend in; you are here to awaken something new.',
    invitation:
      'Each week, share one idea, perspective, or truth that feels uniquely yours, even if it feels a bit unusual.'
  },

  Pisces: {
    blessing:
      'May your tenderness never again be taken for weakness, and may your dreams find gentle ways to touch the world.',
    reminder:
      'Your sensitivity is a gift of perception, not a flaw.',
    invitation:
      'Each week, give your imagination a home—through art, music, prayer, or simple quiet time with yourself.'
  },

  Default: {
    blessing:
      'May you walk through life knowing that who you are is not an accident, and that your way of being has a place here.',
    reminder:
      'You are allowed to take up space as you are.',
    invitation:
      'Each week, take one small step that feels aligned with your inner truth, even if no one else understands it yet.'
  }
};

/**
 * Build a complete Take-Home Toolkit
 * @param {Object} chart - User's birth chart data
 * @param {Object} analysis - Cathedral analysis results (optional)
 * @returns {Object} - Complete TakeHomeToolkit
 */
export function buildTakeHomeToolkit(chart, analysis = null) {
  // Extract rising sign from chart
  const risingSign = chart?.rising?.sign ||
                     chart?.ascendant?.sign ||
                     extractRisingFromPlanets(chart);

  // Default practices (can be customized based on analysis)
  const strengths = analysis?.strengths || [
    'You have a natural ability to sense what matters beneath the surface.',
    'Your willingness to explore your own patterns shows courage and self-honesty.'
  ];

  const growthAreas = analysis?.growthAreas || [
    'You may sometimes take on emotional weight that is not yours to carry.',
    'You can be hard on yourself when progress feels slow or invisible.'
  ];

  const balancePractices = analysis?.balancePractices || [
    'Pause once a day to ask: "Is this mine to hold?"',
    'Celebrate small, imperfect steps instead of waiting for big milestones.',
    'Practice receiving as often as you give.'
  ];

  const dailyRitual = analysis?.dailyRitual ||
    'Spend 5 minutes each day checking in with your body and breath, noticing how you truly feel without judgment.';

  const weeklyPractice = analysis?.weeklyPractice ||
    'Once a week, choose one small action that honors both your needs and someone else\'s, rather than sacrificing one for the other.';

  const monthlyPilgrimage = analysis?.monthlyPilgrimage ||
    'Once a month, visit a place that feels special or symbolic to you and ask: "What wants to grow next in me?"';

  return {
    strengths,
    growthAreas,
    balancePractices,
    dailyRitual,
    weeklyPractice,
    monthlyPilgrimage,
    risingPartingGift: buildRisingPartingGift(risingSign)
  };
}

/**
 * Try to extract rising sign from planets array if not in standard location
 */
function extractRisingFromPlanets(chart) {
  if (!chart?.planets) return null;

  const ascendant = chart.planets.find(p =>
    p.name?.toLowerCase() === 'ascendant' ||
    p.name?.toLowerCase() === 'rising'
  );

  return ascendant?.sign || null;
}

export { RISING_GIFT_MAP };
