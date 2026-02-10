/**
 * relationshipRituals.ts
 *
 * Generates relationship rituals aligned with each chamber's
 * psychological function. Rituals are simple, symbolic, and
 * designed to strengthen the specific energy of each chamber.
 *
 * Rituals adapt based on chamber scores — weaker chambers
 * get "healing" rituals, stronger ones get "deepening" rituals.
 *
 * GENESIS AstroProfile - February 2026
 */

// =============================================================================
// TYPES
// =============================================================================

export interface RelationshipRitual {
  chamber: string;
  chamberIcon: string;
  title: string;
  intent: string;
  instructions: string[];
  color: string;
}

// =============================================================================
// RITUAL TEMPLATES
// =============================================================================

interface RitualTemplate {
  strong: { title: string; intent: string; instructions: string[] };
  growing: { title: string; intent: string; instructions: string[] };
}

const RITUAL_TEMPLATES: Record<string, RitualTemplate> = {
  core: {
    strong: {
      title: 'The Mirror of Recognition',
      intent: 'Deepen the mutual recognition at the heart of your bond.',
      instructions: [
        'Sit facing each other in silence for two minutes, simply seeing.',
        'Each person names one truth they\u2019ve discovered about themselves through this relationship.',
        'Close by acknowledging one shared value you both hold sacred.',
      ],
    },
    growing: {
      title: 'The Identity Bridge',
      intent: 'Strengthen the foundation of mutual understanding.',
      instructions: [
        'Each person writes down three words that describe who they are becoming.',
        'Exchange the papers and read them aloud to each other.',
        'Discuss: where do these identities overlap? Where do they diverge \u2014 and how does that serve you both?',
      ],
    },
  },
  passion: {
    strong: {
      title: 'The Spark Ceremony',
      intent: 'Honor and deepen the desire that flows between you.',
      instructions: [
        'Each person names one desire they want to explore together.',
        'Hold hands and breathe together for 30 seconds in silence.',
        'Name one small action you\u2019ll take this week to nurture attraction.',
      ],
    },
    growing: {
      title: 'The Warmth Rekindling',
      intent: 'Gently reawaken the chemistry that lives beneath the surface.',
      instructions: [
        'Each person recalls a moment when they felt most drawn to the other.',
        'Share these moments with each other \u2014 the more specific, the better.',
        'Choose one sensory experience to share this week (a meal, music, a walk).',
      ],
    },
  },
  communication: {
    strong: {
      title: 'The Dialogue Deepening',
      intent: 'Take your natural communication to a more intentional level.',
      instructions: [
        'Each person speaks for 90 seconds on something they\u2019ve been thinking about but haven\u2019t said.',
        'The listener reflects back the essence \u2014 not the words, but the feeling beneath them.',
        'Close by naming one communication strength you appreciate in the other.',
      ],
    },
    growing: {
      title: 'The Listening Bridge',
      intent: 'Build the muscle of truly hearing each other.',
      instructions: [
        'Each person speaks for 60 seconds without interruption on any topic.',
        'The listener summarizes what they heard in one sentence.',
        'Discuss: what did it feel like to be fully heard? What habit would you like to change?',
      ],
    },
  },
  growth: {
    strong: {
      title: 'The Builder\u2019s Oath',
      intent: 'Celebrate and strengthen the shared vision you\u2019re constructing.',
      instructions: [
        'Write down one long-term goal you share as a partnership.',
        'Exchange the papers and add one supportive step to each other\u2019s vision.',
        'Set a date to revisit progress \u2014 the ritual of return is the ritual of commitment.',
      ],
    },
    growing: {
      title: 'The Seed Planting',
      intent: 'Begin building toward a shared future, one small step at a time.',
      instructions: [
        'Each person names one area where they\u2019d like the relationship to grow.',
        'Together, choose the smallest possible action toward one of those areas.',
        'Write it down and place it somewhere you\u2019ll both see it this week.',
      ],
    },
  },
  transformation: {
    strong: {
      title: 'The Shadow Lantern',
      intent: 'Honor the transformative depth that lives in this bond.',
      instructions: [
        'Each person names one fear or pattern they\u2019re in the process of releasing.',
        'Symbolically place it into an imaginary lantern held between you.',
        'Visualize the lantern rising and dissolving into light \u2014 the release is the ritual.',
      ],
    },
    growing: {
      title: 'The Threshold Crossing',
      intent: 'Create a safe container for the changes this bond asks of you.',
      instructions: [
        'Each person names one change this relationship has asked of them.',
        'Acknowledge the difficulty with honesty \u2014 transformation is not comfortable.',
        'Together, name one thing you\u2019re willing to let go of for the sake of deeper truth.',
      ],
    },
  },
};

// =============================================================================
// GENERATOR
// =============================================================================

const CHAMBER_META: Record<string, { icon: string; color: string }> = {
  core:           { icon: '\u2609', color: '#f97316' },
  passion:        { icon: '\u2640', color: '#ec4899' },
  communication:  { icon: '\u263F', color: '#f59e0b' },
  growth:         { icon: '\u2643', color: '#14b8a6' },
  transformation: { icon: '\u2645', color: '#a855f7' },
};

/**
 * Generate rituals for all chambers.
 * Score threshold: >= 55 gets "strong" ritual, < 55 gets "growing" ritual.
 */
export function buildRelationshipRituals(
  chambers: { key: string; label: string; score: number }[],
): RelationshipRitual[] {
  return chambers
    .filter(ch => ch.key in RITUAL_TEMPLATES)
    .map(ch => {
      const template = RITUAL_TEMPLATES[ch.key];
      const variant = ch.score >= 55 ? template.strong : template.growing;
      const meta = CHAMBER_META[ch.key] || { icon: '\u2022', color: '#9ca3af' };

      return {
        chamber: ch.label,
        chamberIcon: meta.icon,
        title: variant.title,
        intent: variant.intent,
        instructions: variant.instructions,
        color: meta.color,
      };
    });
}
