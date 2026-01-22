/**
 * pilgrimJourneys.ts
 *
 * Multi-path initiatory system for guided Cathedral exploration.
 * Each path is a different sequence of chambers fed into the Pilgrim Journey engine.
 *
 * Paths:
 * - Beginner's Path: Gentle introduction
 * - Karmic Depth Path: Deep Vedic/ancestral exploration
 * - Forecast Path: Future-oriented timeline journey
 * - Healer's Path: Support and challenges focus
 * - Full Pilgrimage: Complete cathedral walkthrough
 */

export interface PilgrimStep {
  id: string;
  title: string;
  description: string;
  targetId: string;
  highlight?: string;
}

export interface PilgrimJourney {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  steps: PilgrimStep[];
}

/* -----------------------------------------
   1. BEGINNER'S PATH
   Gentle introduction to the Cathedral
------------------------------------------ */
export const BeginnersPath: PilgrimJourney = {
  id: "beginners",
  name: "Beginner's Path",
  description: "A gentle introduction to the relationship's core identity and foundations.",
  icon: "🌱",
  duration: "~5 min",
  steps: [
    {
      id: "origin",
      title: "1. Polarity Origin",
      description: "Every relationship has a core energetic signature. This score represents the dynamic tension and magnetic pull between two souls.",
      targetId: "polarity-score",
    },
    {
      id: "archetype",
      title: "2. Archetype Identity",
      description: "Your relationship expresses a mythic pattern — an archetype that shapes how you grow together and what lessons you're learning.",
      targetId: "archetype",
    },
    {
      id: "support",
      title: "3. What Supports You",
      description: "These are the natural strengths that hold your bond together — the places where energy flows easily.",
      targetId: "support",
    },
    {
      id: "challenges",
      title: "4. What Challenges You",
      description: "Growth edges and friction points. These aren't obstacles — they're invitations to evolve together.",
      targetId: "challenges",
    },
  ],
};

/* -----------------------------------------
   2. KARMIC DEPTH PATH
   Deep Vedic, ancestral, karmic storyline
------------------------------------------ */
export const KarmicDepthPath: PilgrimJourney = {
  id: "karmic-depth",
  name: "Karmic Depth Path",
  description: "A deep dive into karmic, ancestral, and Vedic layers of the relationship.",
  icon: "🔮",
  duration: "~8 min",
  steps: [
    {
      id: "nakshatra",
      title: "1. Moon Nakshatra",
      description: "The Moon's Nakshatra reveals the soul's emotional home — its deepest patterns of feeling, nurturing, and instinctual response.",
      targetId: "vedic-nakshatra",
    },
    {
      id: "dasha",
      title: "2. Dasha Timeline",
      description: "The Vimshottari Dasha system maps 120 years of planetary chapters. Each Mahadasha brings specific karmic themes to the foreground.",
      targetId: "vedic-dasha",
    },
    {
      id: "grahas",
      title: "3. Graha Dignities",
      description: "The nine Grahas (planets) hold different levels of strength based on their sign placement. Strong planets express easily; weak ones require conscious work.",
      targetId: "vedic-grahas",
    },
    {
      id: "evolution",
      title: "4. Archetype Evolution",
      description: "Watch how the relationship transforms across time. The archetype shifts as planetary cycles change, revealing new chapters in your shared story.",
      targetId: "evolution",
    },
  ],
};

/* -----------------------------------------
   3. FORECAST PATH
   Future-oriented, predictive, timeline-based
------------------------------------------ */
export const ForecastPath: PilgrimJourney = {
  id: "forecast",
  name: "Forecast Path",
  description: "A forward-looking journey through future archetypes and planetary timelines.",
  icon: "🔭",
  duration: "~6 min",
  steps: [
    {
      id: "current-archetype",
      title: "1. Current Archetype",
      description: "Begin with where you are now. Your current archetype shapes the quality of your interactions and the themes you're living.",
      targetId: "archetype",
    },
    {
      id: "forecast-timeline",
      title: "2. Forecast Timeline",
      description: "See the next three archetypes your relationship will express. Each future phase brings new opportunities and challenges.",
      targetId: "forecast",
    },
    {
      id: "evolution",
      title: "3. Evolution Timeline",
      description: "The broader arc of your relationship's growth. See how you've evolved and where you're heading.",
      targetId: "evolution",
    },
    {
      id: "vedic-dasha",
      title: "4. Vedic Dasha Influence",
      description: "The upcoming Mahadashas and Antardashas shape the quality of your shared experience. Saturn brings discipline, Venus brings pleasure, and so on.",
      targetId: "vedic-dasha",
    },
  ],
};

/* -----------------------------------------
   4. HEALER'S PATH
   Focus on support, challenges, and growth
------------------------------------------ */
export const HealersPath: PilgrimJourney = {
  id: "healers",
  name: "Healer's Path",
  description: "A therapeutic journey focusing on strengths, challenges, and conscious growth.",
  icon: "💚",
  duration: "~7 min",
  steps: [
    {
      id: "archetype",
      title: "1. Your Relational Pattern",
      description: "The archetype reveals your shared mythology — the story you're living together. Awareness is the first step to transformation.",
      targetId: "archetype",
    },
    {
      id: "support",
      title: "2. Your Natural Gifts",
      description: "These strengths are your relationship's medicine. When you're struggling, return to these foundational supports.",
      targetId: "support",
    },
    {
      id: "challenges",
      title: "3. Your Growth Edges",
      description: "Challenges aren't problems to solve — they're invitations to grow. Each friction point holds a lesson.",
      targetId: "challenges",
    },
    {
      id: "yin-yang",
      title: "4. Energetic Balance",
      description: "The Yin/Yang heatmap shows where your energies complement or clash. Balance requires honoring both forces.",
      targetId: "yin-yang",
    },
    {
      id: "vedic-synthesis",
      title: "5. Soul-Level Integration",
      description: "The Vedic synthesis reveals the deeper purpose of your connection — the karmic work you've come together to do.",
      targetId: "vedic-synthesis",
    },
  ],
};

/* -----------------------------------------
   5. FULL PILGRIMAGE
   Complete cathedral walkthrough
------------------------------------------ */
export const FullPilgrimage: PilgrimJourney = {
  id: "full",
  name: "Full Pilgrimage",
  description: "The complete ceremonial journey through every chamber of the Cathedral.",
  icon: "⛪",
  duration: "~15 min",
  steps: [
    {
      id: "polarity",
      title: "1. The Polarity Origin",
      description: "Begin at the heart — the core polarity score that defines the energetic signature of this relationship.",
      targetId: "polarity-score",
    },
    {
      id: "archetype",
      title: "2. The Archetype Altar",
      description: "The mythic pattern that gives meaning to your shared journey.",
      targetId: "archetype",
    },
    {
      id: "evolution",
      title: "3. The Evolution Corridor",
      description: "Walk through time and see how your archetype has transformed across planetary chapters.",
      targetId: "evolution",
    },
    {
      id: "forecast",
      title: "4. The Oracle Chamber",
      description: "Glimpse the future archetypes waiting to emerge in your relationship.",
      targetId: "forecast",
    },
    {
      id: "yin-yang",
      title: "5. The Balance Hall",
      description: "The Yin/Yang heatmap reveals the dance of opposing forces in your connection.",
      targetId: "yin-yang",
    },
    {
      id: "diff",
      title: "6. The Mirror Gallery",
      description: "Compare archetypes and see the different paths relationships can take.",
      targetId: "diff",
    },
    {
      id: "nakshatra",
      title: "7. The Lunar Sanctuary",
      description: "Enter the Vedic wing — the Moon's Nakshatra reveals the soul's emotional foundation.",
      targetId: "vedic-nakshatra",
    },
    {
      id: "dasha",
      title: "8. The Timeline Crypt",
      description: "The Dasha system maps 120 years of planetary karma. Each chapter has its own flavor.",
      targetId: "vedic-dasha",
    },
    {
      id: "grahas",
      title: "9. The Planetary Council",
      description: "The nine Grahas sit in council. Their dignities reveal where strength and weakness live.",
      targetId: "vedic-grahas",
    },
    {
      id: "support",
      title: "10. The Garden of Gifts",
      description: "What naturally supports this relationship — the soil in which love grows.",
      targetId: "support",
    },
    {
      id: "challenges",
      title: "11. The Trial Chamber",
      description: "The challenges that forge deeper connection through conscious work.",
      targetId: "challenges",
    },
    {
      id: "synthesis",
      title: "12. The Integration Chapel",
      description: "All threads weave together. The relationship reveals its wholeness.",
      targetId: "vedic-synthesis",
    },
  ],
};

/* -----------------------------------------
   6. ARCHITECT PATH
   Systems-level view for builders and designers
------------------------------------------ */
export const ArchitectPath: PilgrimJourney = {
  id: "architect",
  name: "Architect Path",
  description: "A systems-level walk through the Cathedral's architecture for builders and designers.",
  icon: "🏛️",
  duration: "~7 min",
  steps: [
    {
      id: "polarity-score-arch",
      title: "1. Polarity Engine",
      description: "See how the polarity score and archetype sit at the core of the system — the primary calculation that drives all downstream outputs.",
      targetId: "polarity-score",
    },
    {
      id: "evolution-arch",
      title: "2. Lifecycle Engine",
      description: "Observe how the Evolution Timeline encodes temporal state transitions. Each archetype phase is a node in the relationship's state machine.",
      targetId: "evolution",
    },
    {
      id: "forecast-arch",
      title: "3. Forecast Engine",
      description: "Study how forecasts are derived from dashas, transits, and polarity geometry. The predictive layer synthesizes multiple data sources.",
      targetId: "forecast",
    },
    {
      id: "vedic-arch",
      title: "4. Vedic Engine",
      description: "Inspect the Vedic Dashboard as the sidereal backbone of the Cathedral — Nakshatra, Dasha, and Graha calculations form the karmic substrate.",
      targetId: "vedic-nakshatra",
    },
    {
      id: "diff-arch",
      title: "5. Diff & Narrative Engine",
      description: "See how narrative diffs compare trajectories and archetypes across relationships. The comparison layer enables multi-relationship analysis.",
      targetId: "diff",
    },
  ],
};

/* -----------------------------------------
   7. SOVEREIGN PATH
   Self-mastery, autonomy, and destiny
------------------------------------------ */
export const SovereignPath: PilgrimJourney = {
  id: "sovereign",
  name: "Sovereign Path",
  description: "A journey into self-mastery, autonomy, and destiny within the relationship field.",
  icon: "👑",
  duration: "~8 min",
  steps: [
    {
      id: "archetype-sovereign",
      title: "1. Core Archetype",
      description: "Understand the archetype as a mirror of your own sovereign pattern. The relationship reflects who you're becoming.",
      targetId: "archetype",
    },
    {
      id: "support-sovereign",
      title: "2. Inner Resources",
      description: "See what supports this relationship as reflections of your inner strengths. What you cultivate together, you cultivate within.",
      targetId: "support",
    },
    {
      id: "challenges-sovereign",
      title: "3. Initiations",
      description: "Reframe challenges as initiations into greater autonomy and clarity. Each difficulty is a threshold crossing.",
      targetId: "challenges",
    },
    {
      id: "vedic-lagna-sovereign",
      title: "4. Vedic Lagna & Moon",
      description: "Visit the Vedic Dashboard to see how Lagna and Moon describe your path of sovereignty — your rising nature and emotional truth.",
      targetId: "vedic-nakshatra",
    },
    {
      id: "forecast-sovereign",
      title: "5. Destiny Windows",
      description: "Look at the Forecast Timeline as windows of choice and self-authorship. The future is not fixed — it's a field of possibility.",
      targetId: "forecast",
    },
  ],
};

/* -----------------------------------------
   8. TWIN FLAME PATH
   Polarity, magnetism, karmic mirroring
------------------------------------------ */
export const TwinFlamePath: PilgrimJourney = {
  id: "twin-flame",
  name: "Twin Flame Path",
  description: "A journey through polarity, magnetism, and karmic mirroring for intense soul connections.",
  icon: "🔥",
  duration: "~8 min",
  steps: [
    {
      id: "polarity-twin",
      title: "1. Magnetic Polarity",
      description: "Begin with the polarity score and archetype to feel the charge of this bond. Twin flames carry intense magnetic signatures.",
      targetId: "polarity-score",
    },
    {
      id: "yin-yang-twin",
      title: "2. Yin/Yang Geometry",
      description: "Study the Yin/Yang Heatmap as the energetic wiring of your magnetism. Opposites attract, but they also transform.",
      targetId: "yin-yang",
    },
    {
      id: "evolution-twin",
      title: "3. Karmic Mirrors Over Time",
      description: "Walk the Evolution Timeline to see how mirroring deepens or resolves. Twin flame bonds evolve through reflection.",
      targetId: "evolution",
    },
    {
      id: "vedic-nakshatra-twin",
      title: "4. Nakshatra Soul Threads",
      description: "Enter the Vedic Dashboard to feel the Nakshatra-level soul resonance. The Moon's mansion reveals where your souls first met.",
      targetId: "vedic-nakshatra",
    },
    {
      id: "diff-twin",
      title: "5. Parallel Timelines",
      description: "If comparing relationships, use the diff chambers to sense which bond carries true twin-flame intensity versus soulmate harmony.",
      targetId: "diff",
    },
  ],
};

/* -----------------------------------------
   EXPORT ALL JOURNEYS
------------------------------------------ */
export const AllJourneys: PilgrimJourney[] = [
  BeginnersPath,
  KarmicDepthPath,
  ForecastPath,
  HealersPath,
  FullPilgrimage,
  ArchitectPath,
  SovereignPath,
  TwinFlamePath,
];

export default AllJourneys;
