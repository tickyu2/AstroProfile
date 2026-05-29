/**
 * Extended Cusp Profiles — Deep mythic-psychological narratives
 * for each of the 36 zodiac positions.
 *
 * Keyed by cusp ID (matches westernZodiacCusps.json positions[].id)
 */

const CUSP_EXTENDED_PROFILES = {
  'aries-blend-back': {
    elementalRatio: { Fire: 0.70, Water: 0.30 },
    ratioNote: "Fire is dominant, but Water carries Pisces' emotional intuition.",
    coreIdentity: `This archetype carries the first spark of spring, but it still remembers the ocean it rose from. Psychologically, it blends Aries' raw ignition with Pisces' emotional intuition.

Mythically, this is the moment when the flame is born from mist — a warrior emerging from a dream, carrying softness inside their fire.

People born here feel like sensitive fighters — bold, instinctive, but guided by an inner tide.`,
    psychologicalProfile: [
      { title: 'Intuitive Impulse', text: "They don't act randomly — they act when something feels right." },
      { title: 'Empathic Courage', text: "They fight for others, not just themselves." },
      { title: 'Emotional Instinct', text: "Their gut reactions are infused with feeling and imagination." },
      { title: 'Soft-Edged Assertiveness', text: "They can be direct without being harsh." },
      { title: 'Creative Fire', text: "Their ideas come in flashes — poetic, symbolic, visionary." },
    ],
    mythicSignature: `This archetype is the torch lit underwater — a paradox that shouldn't exist, yet does.

Their mythic image is a warrior stepping out of the sea, carrying a flame that refuses to die.

They are the dreamer who charges, the poet who leads, the fighter with a heart tuned to the unseen.`,
    shadowPatterns: [
      { title: 'Emotional Impulsivity', text: "Acting on emotion before grounding it." },
      { title: 'Misunderstood Duality', text: "Feeling misunderstood because they're both fierce and gentle." },
      { title: 'Surrender vs Assertion', text: "Internal conflict between surrender and assertion." },
      { title: 'Fantasy Escape', text: "Escaping into fantasy when overwhelmed." },
      { title: 'Unprocessed Decisions', text: "Impulsive decisions fueled by unprocessed feelings." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let intuition choose the direction",
        "Let fire carry you there",
      ],
      conclusion: "When they trust their inner compass and channel it through bold action, they become visionary leaders who move others with both power and compassion.",
      lifeTheme: "Turning inner visions into outer action.",
    },
  },

  'aries-pure': {
    elementalRatio: { Fire: 1.00 },
    ratioNote: "Undiluted Fire — the first, purest spark of the zodiac.",
    coreIdentity: `Pure Aries is the first spark of the zodiac, the moment the world shifts from stillness to motion. Psychologically, this archetype embodies initiative, courage, and unfiltered will.

Mythically, this is the cosmic ignition — the flame that begins the cycle, the warrior who steps forward before anyone else even realizes there is a path.

People born here feel like living momentum — direct, bold, and unapologetically alive.`,
    psychologicalProfile: [
      { title: 'Instinctive Action', text: "They move first, think later — and often that's exactly what's needed." },
      { title: 'Pure Willpower', text: "Their energy is clean, sharp, and forward-moving." },
      { title: 'Direct Expression', text: "They say what they mean, without ornament or hesitation." },
      { title: 'Courage as Default', text: "Fear registers, but it doesn't stop them." },
      { title: 'Life as a Series of Beginnings', text: "They thrive on fresh starts, challenges, and new terrain." },
    ],
    mythicSignature: `Pure Aries is the sacred spark, the flame that leaps from the void.

Their mythic image is a warrior with a burning spear, eyes fixed on the horizon, heart beating with the rhythm of beginnings.

They are the trailblazer, the initiator, the first heartbeat of spring.`,
    shadowPatterns: [
      { title: 'Impatience', text: "Impatience with slower rhythms." },
      { title: 'Recklessness', text: "Acting before considering consequences." },
      { title: 'Burnout', text: "Burning out from constant forward motion." },
      { title: 'Blunt Honesty', text: "Conflict that arises from blunt honesty." },
      { title: 'Unfinished Starts', text: "Difficulty finishing what they start." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Courage is strongest when it is aimed",
        "Sustaining the flame matters as much as lighting it",
      ],
      conclusion: "When they learn to direct their fire with intention and patience, they become not just initiators, but completers — the rarest and most powerful kind of Aries.",
      lifeTheme: "Begin boldly — and learn to sustain the flame.",
    },
  },

  'aries-blend-forward': {
    elementalRatio: { Fire: 0.65, Earth: 0.35 },
    ratioNote: "Fire is dominant, but Earth introduces grounding, endurance, and practical force.",
    coreIdentity: `This archetype blends Aries' fierce ignition with Taurus' stabilizing force.

Mythically, this is the moment when fire meets soil, creating embers that last, strength that moves with purpose, and passion that knows how to hold its ground.

People born here feel like warriors with roots — driven, bold, but anchored.`,
    psychologicalProfile: [
      { title: 'Directed Willpower', text: "Unlike pure Aries, their fire has focus." },
      { title: 'Enduring Drive', text: "They don't just start — they push through obstacles with stubborn determination." },
      { title: 'Physical Presence', text: "Strong body, strong instincts, strong boundaries." },
      { title: 'Practical Courage', text: "They take risks that make sense, not chaos-driven leaps." },
      { title: 'Territory-Claiming Energy', text: "They want to build something real, something lasting." },
    ],
    mythicSignature: `This archetype is the ember that refuses to die, the flame that sinks into the Earth and becomes a forge.

Their mythic image is a warrior planting a flag into solid ground, claiming space with both fire and weight.

They are the builder-fighter, the steadfast initiator, the force that begins and endures.`,
    shadowPatterns: [
      { title: 'Stubbornness Disguised', text: "Stubbornness disguised as determination." },
      { title: 'Rigid Commitment', text: "Difficulty shifting direction once committed." },
      { title: 'Blocked Temper', text: "Temper when blocked." },
      { title: 'Overattachment', text: "Overattachment to goals or territory." },
      { title: 'Slow Adaptation', text: "Slow to adapt." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Strength is not just force — it is consistency",
        "Fire starts it, Earth sustains it",
      ],
      conclusion: "When they channel their fire into enduring structures, they become one of the most effective archetypes in the zodiac — initiators who finish what they start.",
      lifeTheme: "Channel fire into something that lasts.",
    },
  },

  'taurus-blend-back': {
    elementalRatio: { Earth: 0.65, Fire: 0.35 },
    ratioNote: "Taurus is dominant, Aries is the influence.",
    coreIdentity: `This archetype carries the rare fusion of Earth's patience and Fire's ignition. Psychologically, it blends Taurus' grounded, sensual stability with Aries' raw, initiating force.

Mythically, this is the moment when the soil warms enough to sprout, when the Earth remembers its volcanic origins and begins to push upward with purpose.

People born in this window feel like builders with a heartbeat of fire — steady, loyal, grounded, yet capable of sudden bursts of courage and creation.`,
    psychologicalProfile: [
      { title: 'Initiating Endurance', text: "They don't just start things (Aries) or finish things (Taurus) — they do both, which is extremely rare." },
      { title: 'Embodied Willpower', text: "Their decisions come from the body: a gut-level \"yes\" that becomes unstoppable momentum." },
      { title: 'Sensual Drive', text: "They crave physicality — touch, texture, comfort, beauty — but with a spark that makes them pursue what they desire." },
      { title: 'Grounded Passion', text: "They feel deeply, but their emotions move through action, not chaos." },
      { title: 'Slow Burn Motivation', text: "They warm up slowly, but once activated, they become a force of nature." },
    ],
    mythicSignature: `This archetype is the forge — Earth heated by Fire until it becomes something strong, shaped, and purposeful.

They are the artisan-warrior, the settler who claims land and cultivates it, the builder who carries a torch inside their chest.

Their mythic image is a hammer striking molten metal, each blow shaping destiny with patience and heat.`,
    shadowPatterns: [
      { title: 'Internal Friction', text: "Fire wants speed. Earth wants stability. They often feel torn between \"go now\" and \"wait.\"" },
      { title: 'Temper Under Pressure', text: "Normally calm, but when pushed too far, the Aries spark erupts — volcanic, not scattered." },
      { title: 'Self-Impatience', text: "They get frustrated with their own natural pace — wanting results faster than Taurus typically allows." },
      { title: 'Territorial Attachment', text: "They can become overly protective of what they've built — passionate but territorial." },
      { title: 'Selective Bonding', text: "A specialist, not a universal connector. They bond deeply with a few, not many — intense but selective. Not everyone can handle the heat inside the mountain." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn to honor both rhythms — and accept that their narrow compatibility band is a feature, not a flaw:",
      bullets: [
        "Aries gives them ignition — the courage to begin",
        "Taurus gives them endurance — the patience to finish",
        "Their selectivity is a gift — few connections, but unbreakable ones",
      ],
      conclusion: "When they stop fighting the tension and instead use Fire to start and Earth to finish, they become one of the most powerful creators in the zodiac. They are the forge — Earth heated by Fire until it becomes something strong, shaped, and purposeful.",
      lifeTheme: "Build what matters — and build it to last. The right people will feel the warmth.",
    },
  },

  'taurus-pure': {
    elementalRatio: { Earth: 1.00 },
    ratioNote: "Undiluted Earth — the densest, slowest, most stable point in the zodiac.",
    coreIdentity: `Pure Taurus is the moment the Earth becomes fully awake — warm, fertile, steady, and unhurried. Psychologically, this archetype embodies presence, patience, and embodied intelligence.

Mythically, this is the deep soil that remembers every seed planted in it. It is the archetype of continuity, sensuality, and enduring creation.

People born here feel like living anchors — grounded, calm, and deeply connected to the physical world.`,
    psychologicalProfile: [
      { title: 'Embodied Awareness', text: "They think with their senses — touch, taste, texture, rhythm. Their intuition is physical, not abstract." },
      { title: 'Steady Momentum', text: "Once they begin something, they move with unstoppable consistency." },
      { title: 'Pleasure-Driven Motivation', text: "They pursue what feels good, beautiful, or meaningful — and they build their life around comfort, stability, and quality." },
      { title: 'Unshakeable Presence', text: "They don't rush. They don't panic. They don't scatter. They hold their ground." },
      { title: 'Value-Oriented Mindset', text: "They instinctively understand worth — money, resources, time, relationships." },
    ],
    mythicSignature: `Pure Taurus is the Sacred Earth — the field that grows what is tended, the stone that holds memory, the body that knows its own wisdom.

Their mythic image is a great ox moving through a field, slow, powerful, unstoppable, shaping the land with every step.

They are the keeper of the garden, the guardian of the hearth, the builder of permanence.`,
    shadowPatterns: [
      { title: 'Stubbornness as Self-Protection', text: "They resist change not out of fear — but because they know how much energy change requires." },
      { title: 'Comfort Over Growth', text: "They may choose the familiar even when it limits them." },
      { title: 'Possessiveness', text: "They hold tightly to people, routines, and objects." },
      { title: 'Inertia', text: "Starting is the hardest part — but once they start, they finish." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Stability is a foundation — not a cage",
        "Small, intentional changes unlock mastery",
      ],
      conclusion: "When they allow small, intentional changes, their natural endurance transforms into mastery.",
      lifeTheme: "Build slowly. Build beautifully. Build forever.",
    },
  },

  'gemini-blend-back': {
    elementalRatio: { Air: 0.65, Earth: 0.35 },
    ratioNote: "Air is dominant, but Earth introduces grounding, patience, and practical thinking.",
    coreIdentity: `This archetype blends Gemini's airy curiosity with Taurus' earthy steadiness. Psychologically, it creates a mind that is quick but not scattered, curious but not chaotic, playful but anchored.

Mythically, this is the moment when the breeze moves across warm soil, carrying stories, scents, and ideas that take root.

People born here feel like communicators with weight, thinkers who build, teachers who embody what they speak.`,
    psychologicalProfile: [
      { title: 'Practical Curiosity', text: "They explore ideas, but always ask: \"How does this matter in the real world?\"" },
      { title: 'Steady Mind', text: "Unlike pure Gemini, their thoughts don't scatter — they land." },
      { title: 'Patient Communicator', text: "They explain things clearly, calmly, and with grounded examples." },
      { title: 'Reliable Social Presence', text: "They show up when they say they will — a rare trait for an Air-dominant archetype." },
      { title: 'Builder of Ideas', text: "They don't just talk — they construct." },
    ],
    mythicSignature: `This archetype is the Dust Devil — Earth lifted by Air, matter animated by thought.

Their mythic image is a storyteller carving symbols into clay, words becoming form, ideas becoming structure.

They are the artisan-messenger, the grounded thinker, the builder of meaning.`,
    shadowPatterns: [
      { title: 'Material Overthinking', text: "Overthinking material concerns." },
      { title: 'Earth-Air Friction', text: "Internal tug-of-war between routine and novelty." },
      { title: 'Calculated Communication', text: "Can become too strategic in how they speak." },
      { title: 'Gear-Shifting Difficulty', text: "Difficulty shifting gears quickly." },
      { title: 'Idea Attachment', text: "Attachment to familiar ideas." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let curiosity move you",
        "Let Earth hold you",
      ],
      conclusion: "When they balance mental exploration with grounded embodiment, they become rare communicators who make abstract ideas real.",
      lifeTheme: "Make ideas tangible.",
    },
  },

  'gemini-pure': {
    elementalRatio: { Air: 1.00 },
    ratioNote: "Undiluted Air — pure thought, communication, and mental agility.",
    coreIdentity: `Pure Gemini is the zodiac's wind in motion — curiosity, connection, language, and mental agility in their purest form. Psychologically, this archetype embodies adaptability, communication, and restless intelligence.

Mythically, this is the divine messenger, the spark of thought that leaps between worlds, the voice that carries stories across the sky.

People born here feel like living networks — quick, bright, and always in motion.`,
    psychologicalProfile: [
      { title: 'Mental Agility', text: "They think fast, speak fast, learn fast." },
      { title: 'Curiosity as Lifeblood', text: "Every question leads to another question." },
      { title: 'Social Fluidity', text: "They adapt to any room, any person, any situation." },
      { title: 'Dual Awareness', text: "They see both sides of everything — a blessing and a burden." },
      { title: 'Playful Intelligence', text: "Their mind dances; their words sparkle." },
    ],
    mythicSignature: `Pure Gemini is the Sacred Wind, the breath of the gods, the whisper that becomes a story.

Their mythic image is a winged messenger carrying twin scrolls, one for truth, one for possibility.

They are the trickster-teacher, the story-weaver, the mind in motion.`,
    shadowPatterns: [
      { title: 'Scattered Focus', text: "Too many interests, not enough depth." },
      { title: 'Inconsistency', text: "Difficulty maintaining routines or commitments." },
      { title: 'Overthinking', text: "The mind that never stops can exhaust itself." },
      { title: 'Emotional Detachment', text: "Living in the head at the expense of the heart." },
      { title: 'Commitment Difficulty', text: "Choosing one path feels like losing all the others." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Depth is found by returning to what matters",
        "Words have weight when spoken with presence",
      ],
      conclusion: "When they learn to go deep instead of wide, they become the zodiac's most luminous communicators and connectors.",
      lifeTheme: "Connect, communicate, and illuminate.",
    },
  },

  'cancer-blend-back': {
    elementalRatio: { Water: 0.65, Air: 0.35 },
    ratioNote: "Water is dominant, but Air introduces curiosity, communication, and mental agility.",
    coreIdentity: `This archetype blends Cancer's emotional depth with Gemini's airy curiosity. Psychologically, it creates a person who feels in words and thinks in moods.

Mythically, this is the moment when the tide meets the wind, carrying memories, stories, and emotional truths across the shoreline.

People born here feel like narrators of the heart, translating emotion into language and language into connection.`,
    psychologicalProfile: [
      { title: 'Emotional Storytelling', text: "They express feelings through words, metaphors, and shared memories." },
      { title: 'Intuitive Communication', text: "They sense what others need to hear — and when." },
      { title: 'Adaptive Sensitivity', text: "They shift their emotional tone to match the environment." },
      { title: 'Memory-Driven Thinking', text: "Their mind stores emotional details with photographic clarity." },
      { title: 'Connector of People', text: "They bring groups together through shared stories and emotional resonance." },
    ],
    mythicSignature: `This archetype is the Mist-Messenger — Air infused with Water, thought infused with feeling.

Their mythic image is a figure writing messages in the sand, each wave carrying the story farther.

They are the empathic storyteller, the keeper of emotional lore, the voice of the inner tide.`,
    shadowPatterns: [
      { title: 'Mood-Driven Communication', text: "Their message shifts with their emotional state." },
      { title: 'Taking Things Personally', text: "Difficulty separating critique from rejection." },
      { title: 'Emotional Over-Identification', text: "Losing themselves in others' feelings." },
      { title: 'Boundary Confusion', text: "Difficulty separating their feelings from others'." },
      { title: 'Over-Accommodation', text: "Changing their truth to keep the peace." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Feel deeply, but speak from clarity",
        "Emotional truth and intellectual honesty can coexist",
      ],
      conclusion: "When they anchor their emotional intelligence in clear communication, they become the zodiac's most gifted emotional translators.",
      lifeTheme: "Give voice to the emotional world.",
    },
  },

  'cancer-pure': {
    elementalRatio: { Water: 1.00 },
    ratioNote: "Undiluted Water — pure emotion, intuition, and protective instinct.",
    coreIdentity: `Pure Cancer is the zodiac's tide of emotion, the archetype of intuition, protection, memory, and inner life. Psychologically, this archetype embodies empathy, nurturing, and emotional intelligence.

Mythically, this is the Moon's reflection on the ocean, the pull of tides, the instinct to shelter and to belong.

People born here feel like living harbors — safe, deep, and profoundly attuned to the emotional currents around them.`,
    psychologicalProfile: [
      { title: 'Emotional Intuition', text: "They sense what others feel before it's spoken." },
      { title: 'Protective Instinct', text: "They guard loved ones fiercely and quietly." },
      { title: 'Memory-Rooted Identity', text: "Their past shapes their present more than any other sign." },
      { title: 'Nurturing Presence', text: "They create emotional safety wherever they go." },
      { title: 'Inner-World Depth', text: "Their imagination is oceanic — symbolic, mythic, dreamlike." },
    ],
    mythicSignature: `Pure Cancer is the Sacred Tide, the Moon's pull on the human heart.

Their mythic image is a guardian standing at the edge of the sea, holding a lantern that glows with memory.

They are the healer, the protector, the keeper of the emotional realm.`,
    shadowPatterns: [
      { title: 'Mood Swings', text: "Emotional tides shift without warning." },
      { title: 'Emotional Withdrawal', text: "Retreating into their shell when hurt." },
      { title: 'Over-Attachment', text: "Holding too tightly to people and the past." },
      { title: 'Past Anchoring', text: "Difficulty letting go of what was." },
      { title: 'Emotional Absorption', text: "Taking on others' emotional burdens as their own." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Sensitivity is a strength — when it flows, not when it floods",
        "Letting go is not betrayal; it is trust",
      ],
      conclusion: "When they learn to honor their emotional depth while releasing what no longer serves them, they become the zodiac's most profound healers and protectors.",
      lifeTheme: "Nurture what matters, release what no longer belongs.",
    },
  },

  'leo-blend-back': {
    elementalRatio: { Fire: 0.65, Water: 0.35 },
    ratioNote: "Fire is dominant, but Water introduces emotional depth and protective instinct.",
    coreIdentity: `This archetype blends Leo's radiant fire with Cancer's emotional depth. Psychologically, it creates a person who leads with warmth, protects with pride, and expresses emotion through presence.

Mythically, this is the moment when the Sun dips into the sea, creating a glow that is both fierce and tender.

People born here feel like guardians with a spotlight, hearts that shine, leaders who nurture.`,
    psychologicalProfile: [
      { title: 'Emotional Leadership', text: "They guide others through care, not dominance." },
      { title: 'Warm Expression', text: "Their feelings show in their eyes, voice, and gestures." },
      { title: 'Protective Radiance', text: "They defend loved ones with fierce loyalty and visible devotion." },
      { title: 'Creative Sensitivity', text: "Their art, style, and presence carry emotional resonance." },
      { title: 'Heart-Centered Confidence', text: "Their courage comes from caring deeply." },
    ],
    mythicSignature: `This archetype is the Hearth-Sun — Fire held in a vessel of Water, warmth that gathers people close.

Their mythic image is a lion standing at the shoreline, mane glowing with sunset light, guarding its pride with both strength and tenderness.

They are the radiant protector, the emotional leader, the heart-fire guardian.`,
    shadowPatterns: [
      { title: 'Emotional Dramatization', text: "Feelings can become performances." },
      { title: 'Overprotectiveness', text: "Guarding so fiercely it becomes controlling." },
      { title: 'Pride in Caretaking', text: "Tying self-worth to being needed." },
      { title: 'Criticism Sensitivity', text: "Taking feedback as personal attack." },
      { title: 'Difficulty Receiving', text: "They give endlessly but struggle to accept help." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Shine without burning",
        "Protect without controlling",
      ],
      conclusion: "When they balance their radiant confidence with emotional vulnerability, they become magnetic leaders who inspire through warmth and authenticity.",
      lifeTheme: "Lead with heart, and let warmth be your strength.",
    },
  },

  'leo-pure': {
    elementalRatio: { Fire: 1.00 },
    ratioNote: "Undiluted Fire — pure creative force, confidence, and solar radiance.",
    coreIdentity: `Pure Leo is the zodiac's solar heart, the archetype of creativity, courage, presence, and self-expression. Psychologically, this archetype embodies confidence, generosity, and radiant identity.

Mythically, this is the Sun at its zenith, the moment the world is illuminated, the force that inspires life to grow toward the light.

People born here feel like living suns — warm, bold, magnetic, and unmistakably themselves.`,
    psychologicalProfile: [
      { title: 'Creative Vitality', text: "They express themselves naturally — through art, style, humor, or presence." },
      { title: 'Courageous Heart', text: "They move toward what they desire with open-chested bravery." },
      { title: 'Magnetic Presence', text: "People notice them without trying." },
      { title: 'Generous Spirit', text: "They uplift others with warmth and encouragement." },
      { title: 'Identity as Purpose', text: "They live life as a stage for becoming who they truly are." },
    ],
    mythicSignature: `Pure Leo is the Sacred Sun, the source of light, warmth, and creative force.

Their mythic image is a lion crowned in golden fire, standing at the center of the world, illuminating everything around it.

They are the sovereign, the creator, the heart of the zodiac.`,
    shadowPatterns: [
      { title: 'Ego Inflation', text: "Confidence can become arrogance without self-awareness." },
      { title: 'Validation Need', text: "Craving applause and recognition to feel worthy." },
      { title: 'Dramatic Reactions', text: "Small events can become large performances." },
      { title: 'Spotlight Difficulty', text: "Difficulty sharing the stage with others." },
      { title: 'Pride Blocking Vulnerability', text: "Refusing to show weakness even when it's needed." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "True radiance comes from authenticity, not performance",
        "The brightest light illuminates others, not just itself",
      ],
      conclusion: "When they learn to shine from genuine self-expression rather than the need for validation, they become the zodiac's most inspiring and generous presence.",
      lifeTheme: "Shine from the heart.",
    },
  },

  'virgo-blend-back': {
    elementalRatio: { Earth: 0.65, Fire: 0.35 },
    ratioNote: "Earth is dominant, but Fire introduces confidence, expression, and creative boldness.",
    coreIdentity: `This archetype blends Virgo's earthy precision with Leo's fiery confidence. Psychologically, it creates a person who is disciplined yet expressive, analytical yet bold, humble yet radiant.

Mythically, this is the moment when the Sun ripens the grain, where fire becomes form, and creativity becomes craftsmanship.

People born here feel like artisans with a spotlight, creators who refine, perfectionists who shine.`,
    psychologicalProfile: [
      { title: 'Confident Precision', text: "They refine their work with Virgo's detail and Leo's pride." },
      { title: 'Purposeful Expression', text: "Their creativity is structured, intentional, and skillful." },
      { title: 'Warm Competence', text: "They help others with both kindness and authority." },
      { title: 'Disciplined Passion', text: "They pursue mastery with steady fire." },
      { title: 'Leadership Through Skill', text: "They lead not by force, but by being the most capable person in the room." },
    ],
    mythicSignature: `This archetype is the Solar Artisan — Fire guided by Earth, passion shaped into mastery.

Their mythic image is a craftsperson forging golden tools, each strike of the hammer glowing with sunlight.

They are the disciplined creator, the refined leader, the flame that builds.`,
    shadowPatterns: [
      { title: 'Perfectionism Paralysis', text: "The need for flawlessness can freeze creative flow." },
      { title: 'Productivity Pride', text: "Tying self-worth to output and competence." },
      { title: 'Overworking', text: "Pushing creative impulses past the point of joy." },
      { title: 'Difficulty Relaxing', text: "Rest feels like wasted time." },
      { title: 'Hot Criticism', text: "Feedback delivered with too much intensity." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let discipline support creativity, not suffocate it",
        "Imperfection is part of the craft",
      ],
      conclusion: "When they allow their precision to be warmed by Leo's confidence without being consumed by it, they become master creators whose work endures and inspires.",
      lifeTheme: "Shape the fire into something lasting.",
    },
  },

  'virgo-pure': {
    elementalRatio: { Earth: 1.00 },
    ratioNote: "Undiluted Earth — pure refinement, precision, and devotion to mastery.",
    coreIdentity: `Pure Virgo is the zodiac's sacred order, the archetype of refinement, service, discernment, and mastery. Psychologically, this archetype embodies precision, humility, and devotion to improvement.

Mythically, this is the harvest season, the moment the world is sorted, organized, purified, and prepared.

People born here feel like living instruments of refinement — clear, capable, observant, and quietly powerful.`,
    psychologicalProfile: [
      { title: 'Analytical Clarity', text: "They see patterns, flaws, and solutions instantly." },
      { title: 'Devotion to Mastery', text: "They improve everything they touch — including themselves." },
      { title: 'Service as Purpose', text: "They feel most alive when they are useful." },
      { title: 'Embodied Intelligence', text: "Their mind and hands work together with precision." },
      { title: 'Quiet Strength', text: "They influence through competence, not noise." },
    ],
    mythicSignature: `Pure Virgo is the Sacred Grain, the harvest sorted by careful hands, the order that sustains life.

Their mythic image is a priestess of the harvest, holding a sheaf of wheat, eyes sharp with discernment.

They are the healer, the craftsperson, the guardian of purity and precision.`,
    shadowPatterns: [
      { title: 'Perfectionism', text: "The standard is always higher than what's achievable." },
      { title: 'Self-Criticism', text: "Their harshest judge lives inside their own mind." },
      { title: 'Overthinking', text: "Analysis that loops without resolution." },
      { title: 'Trust Difficulty', text: "Difficulty trusting others' competence." },
      { title: 'Disorder Anxiety', text: "Chaos in the environment creates inner turmoil." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Perfection is a direction, not a destination",
        "Good enough is sometimes the highest wisdom",
      ],
      conclusion: "When they learn to honor their precision without being enslaved by it, they become the zodiac's most effective healers, teachers, and craftspeople.",
      lifeTheme: "Refine what matters.",
    },
  },

  'libra-blend-back': {
    elementalRatio: { Air: 0.65, Earth: 0.35 },
    ratioNote: "Air is dominant, but Earth introduces precision, discernment, and analytical grounding.",
    coreIdentity: `This archetype blends Libra's airy harmony with Virgo's earthy precision. Psychologically, it creates a person who is graceful yet analytical, fair-minded yet detail-oriented, socially fluid yet grounded in discernment.

Mythically, this is the moment when the breeze moves through the harvest, bringing refinement, clarity, and balance to the world.

People born here feel like designers of harmony, mediators who understand nuance, artists who perfect their craft.`,
    psychologicalProfile: [
      { title: 'Aesthetic Precision', text: "They refine beauty with Virgo's meticulous eye." },
      { title: 'Diplomatic Intelligence', text: "They communicate with tact, clarity, and fairness." },
      { title: 'Balanced Judgment', text: "They weigh options carefully before acting." },
      { title: 'Service-Oriented Harmony', text: "They help others find equilibrium through thoughtful support." },
      { title: 'Collaborative Skill', text: "They work well with others, blending logic with charm." },
    ],
    mythicSignature: `This archetype is the Balanced Scythe — Air guided by Earth, harmony shaped by precision.

Their mythic image is a craftsperson carving symmetrical patterns, each line both functional and beautiful.

They are the refined diplomat, the harmonizing analyst, the designer of order and elegance.`,
    shadowPatterns: [
      { title: 'Over-Accommodation', text: "Adjusting too much to please others." },
      { title: 'Indecision', text: "Weighing options endlessly without committing." },
      { title: 'Relationship Perfectionism', text: "Expecting flawlessness in partnerships." },
      { title: 'People-Pleasing', text: "Sacrificing their standards to maintain harmony." },
      { title: 'Assertion Difficulty', text: "Difficulty asserting their own needs." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Harmony is strongest when it includes your own voice",
        "Discernment and grace are not opposites",
      ],
      conclusion: "When they balance their diplomatic grace with Virgo's analytical clarity, they become the zodiac's most refined and effective mediators.",
      lifeTheme: "Refine the world with grace.",
    },
  },

  'libra-pure': {
    elementalRatio: { Air: 1.00 },
    ratioNote: "Undiluted Air — pure balance, beauty, and relational intelligence.",
    coreIdentity: `Pure Libra is the zodiac's principle of balance, the archetype of beauty, justice, connection, and relational intelligence. Psychologically, this archetype embodies equilibrium, aesthetic awareness, and social grace.

Mythically, this is the moment of perfect symmetry, the still point between seasons, the cosmic breath held in poised harmony.

People born here feel like living bridges — balancing opposites, smoothing tensions, and elevating interactions.`,
    psychologicalProfile: [
      { title: 'Relational Intelligence', text: "They understand people, dynamics, and social flow intuitively." },
      { title: 'Aesthetic Sensitivity', text: "Beauty, symmetry, and elegance matter deeply to them." },
      { title: 'Diplomatic Presence', text: "They bring calm and fairness wherever they go." },
      { title: 'Balanced Mind', text: "They see multiple perspectives simultaneously." },
      { title: 'Creative Harmony', text: "Their art, style, and choices reflect inner equilibrium." },
    ],
    mythicSignature: `Pure Libra is the Sacred Scales, the cosmic balance that holds the world in symmetry.

Their mythic image is a figure holding golden scales, eyes soft, posture poised, weighing truth with grace.

They are the harmonizer, the mediator, the artist of equilibrium.`,
    shadowPatterns: [
      { title: 'Indecision', text: "Seeing all sides can make choosing impossible." },
      { title: 'Conflict Avoidance', text: "Peace at any price — even at the cost of truth." },
      { title: 'Over-Idealization', text: "Romanticizing relationships beyond what they are." },
      { title: 'People-Pleasing', text: "Losing themselves in the effort to make everyone happy." },
      { title: 'Direction Difficulty', text: "Difficulty choosing a path when all paths look balanced." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Balance is not neutrality — it is conscious choice",
        "True harmony requires honest friction sometimes",
      ],
      conclusion: "When they learn to make decisive choices while honoring their need for beauty and fairness, they become the zodiac's most graceful and effective leaders.",
      lifeTheme: "Create harmony through truth.",
    },
  },

  'scorpio-blend-back': {
    elementalRatio: { Water: 0.65, Air: 0.35 },
    ratioNote: "Water is dominant, but Air introduces charm, diplomacy, and social grace.",
    coreIdentity: `This archetype blends Scorpio's emotional depth with Libra's airy charm. Psychologically, it creates a person who is magnetic yet diplomatic, intense yet graceful, perceptive yet socially fluid.

Mythically, this is the moment when the wind ripples the deep lake, revealing hidden truths through subtle movement.

People born here feel like soft-spoken power, the kind of presence that disarms, observes, and understands everything.`,
    psychologicalProfile: [
      { title: 'Subtle Influence', text: "They persuade through elegance, not force." },
      { title: 'Social Intuition', text: "They read motives, moods, and micro-expressions instantly." },
      { title: 'Graceful Depth', text: "They can discuss difficult truths without creating conflict." },
      { title: 'Magnetic Presence', text: "People feel drawn to them without knowing why." },
      { title: 'Strategic Harmony', text: "They maintain peace while quietly steering outcomes." },
    ],
    mythicSignature: `This archetype is the Silk-Veiled Depth — Air moving across Water, revealing what lies beneath.

Their mythic image is a diplomat standing beside a still lake, seeing both the surface and the depths.

They are the disarming strategist, the shadow-aware mediator, the charming truth-seer.`,
    shadowPatterns: [
      { title: 'Subtle Manipulation', text: "Using charm as a tool for control." },
      { title: 'Emotional Withdrawal', text: "Hiding behind a graceful facade." },
      { title: 'Conflict Avoidance', text: "Fear of direct confrontation despite sensing everything." },
      { title: 'Motive Over-Analysis', text: "Over-analyzing everyone's intentions." },
      { title: 'Trust Difficulty', text: "Difficulty trusting others' intentions fully." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Truth spoken with grace transforms everything",
        "Directness and diplomacy can coexist",
      ],
      conclusion: "When they allow their depth to speak directly rather than through subtle maneuvering, they become the zodiac's most powerful and trusted communicators.",
      lifeTheme: "Reveal depth without losing harmony.",
    },
  },

  'scorpio-pure': {
    elementalRatio: { Water: 1.00 },
    ratioNote: "Undiluted Water — pure depth, transformation, and emotional truth.",
    coreIdentity: `Pure Scorpio is the zodiac's deepest well, the archetype of transformation, intensity, intuition, and emotional truth. Psychologically, this archetype embodies penetration, loyalty, and inner power.

Mythically, this is the underworld river, the force that strips away illusion, the guardian of secrets and rebirth.

People born here feel like living thresholds — they sense what others hide, they move through life with emotional x-ray vision, and they transform everything they touch.`,
    psychologicalProfile: [
      { title: 'Emotional Penetration', text: "They see motives, wounds, and truths beneath the surface." },
      { title: 'Transformational Drive', text: "They crave depth, meaning, and evolution." },
      { title: 'Unshakeable Loyalty', text: "Their bonds are few but absolute." },
      { title: 'Inner Strength', text: "They endure what others cannot." },
      { title: 'Magnetic Intensity', text: "Their presence is powerful, even in silence." },
    ],
    mythicSignature: `Pure Scorpio is the Sacred Depth, the river that flows beneath the world.

Their mythic image is a guardian holding a torch in a cavern, illuminating hidden chambers of the psyche.

They are the alchemist, the seer, the transformer.`,
    shadowPatterns: [
      { title: 'Emotional Extremes', text: "All-or-nothing intensity in feelings and bonds." },
      { title: 'Obsession', text: "Fixating on people, ideas, or outcomes past the point of health." },
      { title: 'Suspicion', text: "Seeing betrayal where none exists." },
      { title: 'Control Tendencies', text: "Needing to steer situations and people." },
      { title: 'Difficulty Letting Go', text: "Holding onto pain, grudges, or attachments long past their time." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Power is safest when shared, not hoarded",
        "Letting go is the deepest form of strength",
      ],
      conclusion: "When they learn to release as powerfully as they hold, they become the zodiac's most profound healers and transformers — alchemists who turn darkness into gold.",
      lifeTheme: "Transform, heal, and rise.",
    },
  },

  'sagittarius-blend-back': {
    elementalRatio: { Fire: 0.65, Water: 0.35 },
    ratioNote: "Fire is dominant, but Water introduces emotional depth, intensity, and psychological awareness.",
    coreIdentity: `This archetype blends Sagittarius' fiery quest for truth with Scorpio's emotional intensity and depth. Psychologically, it creates a person who is philosophical yet penetrating, adventurous yet introspective, bold yet psychologically aware.

Mythically, this is the moment when a torch is carried into the underworld, where exploration meets transformation, and curiosity meets shadow.

People born here feel like explorers of the psyche, seekers who want to understand not just the world — but the hidden forces beneath it.`,
    psychologicalProfile: [
      { title: 'Penetrating Curiosity', text: "They don't just ask questions — they ask the questions that matter." },
      { title: 'Emotional Insight', text: "They read motives and patterns with uncanny accuracy." },
      { title: 'Transformational Honesty', text: "Their truths cut deep, but they liberate." },
      { title: 'Adventurous Intensity', text: "They pursue meaning with fire and depth." },
      { title: 'Restless Depth', text: "They crave both expansion and emotional truth." },
    ],
    mythicSignature: `This archetype is the Torch-Bearer, Fire descending into Water, illumination entering the depths.

Their mythic image is a wanderer holding a flame in a cavern, seeking wisdom in the shadows.

They are the shadow-seeker, the philosopher of intensity, the explorer of hidden truths.`,
    shadowPatterns: [
      { title: 'Wounding Bluntness', text: "Speaking truth without considering its impact." },
      { title: 'Emotional Volatility', text: "Intensity that swings between expansion and contraction." },
      { title: 'Truth Obsession', text: "Needing to expose what's hidden, even when it's not their place." },
      { title: 'Trust Difficulty', text: "Difficulty trusting others' surface presentation." },
      { title: 'Relationship Restlessness', text: "Craving both depth and freedom simultaneously." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Truth is strongest when delivered with compassion",
        "Depth and freedom are not opposites",
      ],
      conclusion: "When they balance their penetrating insight with Sagittarian openness, they become visionary truth-tellers who illuminate the human experience.",
      lifeTheme: "Illuminate the depths.",
    },
  },

  'sagittarius-pure': {
    elementalRatio: { Fire: 1.00 },
    ratioNote: "Undiluted Fire — pure expansion, exploration, and truth-seeking.",
    coreIdentity: `Pure Sagittarius is the zodiac's flame of expansion, the archetype of exploration, meaning, freedom, and cosmic perspective. Psychologically, this archetype embodies optimism, curiosity, and truth-seeking.

Mythically, this is the arrow shot into the sky, the quest for wisdom, the fire that refuses to be contained.

People born here feel like living horizons — always moving, learning, and reaching for something greater.`,
    psychologicalProfile: [
      { title: 'Philosophical Mind', text: "They search for meaning in every experience." },
      { title: 'Adventurous Spirit', text: "They crave movement, novelty, and open space." },
      { title: 'Truth-Driven Expression', text: "They speak honestly, sometimes too honestly." },
      { title: 'Optimistic Fire', text: "They see possibilities where others see limits." },
      { title: 'Freedom as Lifeblood', text: "They need autonomy to thrive." },
    ],
    mythicSignature: `Pure Sagittarius is the Sacred Arrow, the flame that leaps toward the unknown.

Their mythic image is a centaur archer aiming at the stars, eyes bright with vision.

They are the wanderer, the teacher, the seeker of cosmic truth.`,
    shadowPatterns: [
      { title: 'Restlessness', text: "Difficulty staying in one place, one job, one relationship." },
      { title: 'Over-Idealism', text: "Expecting the world to match their vision." },
      { title: 'Bluntness', text: "Honesty that wounds without intending to." },
      { title: 'Responsibility Avoidance', text: "Freedom-seeking that dodges commitment." },
      { title: 'Commitment Difficulty', text: "Choosing one path feels like closing all others." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Freedom grows stronger with purpose",
        "Depth is found by staying, not just seeking",
      ],
      conclusion: "When they learn to aim their arrow with intention rather than scatter their fire in all directions, they become the zodiac's most inspiring teachers and visionaries.",
      lifeTheme: "Seek truth, expand the world.",
    },
  },

  'capricorn-blend-back': {
    elementalRatio: { Earth: 0.65, Fire: 0.35 },
    ratioNote: "Earth is dominant, but Fire introduces vision, idealism, and adventurous ambition.",
    coreIdentity: `This archetype blends Capricorn's disciplined Earth with Sagittarius' visionary Fire. Psychologically, it creates a person who is ambitious yet idealistic, structured yet adventurous, practical yet inspired.

Mythically, this is the moment when the mountain meets the horizon, where the climber looks up and sees not just the next step — but the entire world waiting to be explored.

People born here feel like architects of possibility, builders who dream, leaders who plan with fire in their chest.`,
    psychologicalProfile: [
      { title: 'Strategic Vision', text: "They see the long-term path with clarity and purpose." },
      { title: 'Disciplined Optimism', text: "They believe in possibilities — but they also build the scaffolding." },
      { title: 'Purpose-Driven Ambition', text: "They don't chase status; they chase meaning." },
      { title: 'Adventurous Responsibility', text: "They take risks, but calculated ones." },
      { title: 'Leadership Through Wisdom', text: "They guide others with experience and philosophical insight." },
    ],
    mythicSignature: `This archetype is the Mountain Torch, Fire climbing Earth, vision becoming structure.

Their mythic image is a traveler planting a flag on a high peak, surveying the world with clarity and purpose.

They are the vision-builder, the strategic explorer, the architect of meaning.`,
    shadowPatterns: [
      { title: 'Over-Commitment', text: "Taking on too many goals simultaneously." },
      { title: 'Workaholic Tendencies', text: "Turning every adventure into a project." },
      { title: 'Harsh Self-Judgment', text: "Measuring themselves against impossible standards." },
      { title: 'Rigid Ideals', text: "Turning ideals into inflexible rules." },
      { title: 'Difficulty Relaxing', text: "Rest feels like wasted opportunity." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let purpose guide ambition, not pressure",
        "The journey is as valuable as the summit",
      ],
      conclusion: "When they balance their structural discipline with Sagittarian vision, they become master builders of meaningful legacies.",
      lifeTheme: "Build the path to your horizon.",
    },
  },

  'capricorn-pure': {
    elementalRatio: { Earth: 1.00 },
    ratioNote: "Undiluted Earth — pure discipline, structure, and long-term mastery.",
    coreIdentity: `Pure Capricorn is the zodiac's pillar of endurance, the archetype of mastery, responsibility, structure, and long-term vision. Psychologically, this archetype embodies discipline, integrity, and strategic ambition.

Mythically, this is the mountain peak, the place where the world is seen clearly, where effort becomes legacy.

People born here feel like living foundations — steady, wise, and built for the long climb.`,
    psychologicalProfile: [
      { title: 'Strategic Mind', text: "They think in timelines, systems, and long arcs." },
      { title: 'Enduring Willpower', text: "They persist through difficulty with quiet strength." },
      { title: 'Self-Mastery', text: "They refine themselves with discipline and intention." },
      { title: 'Leadership Through Competence', text: "They earn respect through action, not words." },
      { title: 'Legacy Orientation', text: "They build what lasts — careers, structures, families, systems." },
    ],
    mythicSignature: `Pure Capricorn is the Sacred Mountain, the summit reached through discipline and clarity.

Their mythic image is a solitary figure climbing toward the peak, carrying the weight of purpose with dignity.

They are the strategist, the builder, the guardian of long-term vision.`,
    shadowPatterns: [
      { title: 'Workaholism', text: "Work becomes identity; rest becomes guilt. Saturn demands output, not rest." },
      { title: 'Emotional Suppression', text: "Feelings are filed away as inefficiency. Warmth exists but is buried deep — others may feel shut out before they're let in." },
      { title: 'Earned, Not Given', text: "Capricorn does not 'click' — it 'builds.' Compatibility is earned through shared work, shared goals, shared hardship. This takes time most won't give." },
      { title: 'Over-Responsibility', text: "Carrying burdens that aren't theirs to carry, because no one else meets their standard." },
      { title: 'Harsh Self-Criticism', text: "Their inner judge is relentless. The mountain measures itself against impossible peaks." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn that having zero instant connections is not a flaw — it is the architecture of depth:",
      bullets: [
        "Strength includes softness — the mountain can shelter, not just stand",
        "Earned compatibility runs deeper than instant attraction",
        "The right people will climb — and those who reach the summit stay forever",
      ],
      conclusion: "When they learn to rest without guilt and lead without rigidity, they become the zodiac's most enduring and trusted leaders. Capricorn is not the lover of the moment — it is the architect of time.",
      lifeTheme: "Build with purpose, lead with integrity. The summit is lonely, but the view is forever.",
    },
  },

  'aquarius-blend-back': {
    elementalRatio: { Air: 0.65, Earth: 0.35 },
    ratioNote: "Air is dominant, but Earth introduces discipline, strategy, and structural grounding.",
    coreIdentity: `This archetype blends Aquarius' visionary Air with Capricorn's disciplined Earth. Psychologically, it creates a person who is innovative yet grounded, rebellious yet responsible, future-minded yet strategic.

Mythically, this is the moment when the wind carves the mountain, where ideas gain structure, and revolution gains a blueprint.

People born here feel like engineers of the future, inventors who build, reformers who understand systems deeply enough to change them.`,
    psychologicalProfile: [
      { title: 'Practical Innovation', text: "They generate ideas that can actually be executed." },
      { title: 'Strategic Idealism', text: "They dream big — but with a plan." },
      { title: 'Independent Thinking', text: "They resist conformity and carve their own path." },
      { title: 'Systemic Awareness', text: "They understand how institutions work and how to improve them." },
      { title: 'Quiet Authority', text: "Their leadership is calm, rational, and visionary." },
    ],
    mythicSignature: `This archetype is the Wind-Carved Peak, Air shaping Earth, innovation shaping structure.

Their mythic image is an architect drawing blueprints on a mountaintop, the wind carrying their ideas into the future.

They are the structured visionary, the system reformer, the builder of tomorrow.`,
    shadowPatterns: [
      { title: 'Over-Detachment', text: "Intellectualizing emotions instead of feeling them." },
      { title: 'Cold Rationality', text: "Logic that excludes compassion." },
      { title: 'Purposeless Rebellion', text: "Opposing tradition without building alternatives." },
      { title: 'Intimacy Difficulty', text: "Difficulty with emotional closeness." },
      { title: 'Disguised Rigidity', text: "Rigidity disguised as innovation." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Reform is strongest when rooted in humanity",
        "Structure and innovation are partners, not enemies",
      ],
      conclusion: "When they balance their visionary thinking with Capricorn's patient discipline, they become architects of systems that genuinely serve the future.",
      lifeTheme: "Shape the future with clarity.",
    },
  },

  'aquarius-pure': {
    elementalRatio: { Air: 1.00 },
    ratioNote: "Undiluted Air — pure innovation, rebellion, and collective vision.",
    coreIdentity: `Pure Aquarius is the zodiac's electric mind, the archetype of innovation, rebellion, vision, and collective consciousness. Psychologically, this archetype embodies originality, detachment, and future-orientation.

Mythically, this is the lightning bolt, the sudden insight, the shift in paradigm that changes everything.

People born here feel like living catalysts — disruptive, brilliant, and impossible to predict.`,
    psychologicalProfile: [
      { title: 'Revolutionary Thinking', text: "They see what others cannot imagine." },
      { title: 'Collective Vision', text: "They care about humanity as a whole, not just individuals." },
      { title: 'Emotional Detachment', text: "They observe feelings rather than drown in them." },
      { title: 'Unconventional Identity', text: "They refuse to be defined by norms." },
      { title: 'Intellectual Freedom', text: "Their mind must roam, explore, and invent." },
    ],
    mythicSignature: `Pure Aquarius is the Sacred Lightning, the spark that breaks the old pattern and reveals the new.

Their mythic image is a figure holding a vessel of starlight, pouring innovation into the world.

They are the rebel, the visionary, the awakener.`,
    shadowPatterns: [
      { title: 'Emotional Distance', text: "Keeping people at arm's length to maintain freedom." },
      { title: 'Contrarian Behavior', text: "Opposing for the sake of opposing." },
      { title: 'Intimacy Difficulty', text: "Closeness feels like confinement." },
      { title: 'Over-Intellectualization', text: "Thinking about feelings instead of feeling them." },
      { title: 'Purposeless Rebellion', text: "Rebellion without a constructive alternative." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Connection strengthens innovation",
        "The heart is as revolutionary as the mind",
      ],
      conclusion: "When they learn to connect their brilliant minds with genuine human warmth, they become the zodiac's most transformative visionaries.",
      lifeTheme: "Awaken the world to what it can become.",
    },
  },

  'pisces-blend-back': {
    elementalRatio: { Water: 0.65, Air: 0.35 },
    ratioNote: "Water is dominant, but Air introduces vision, conceptual thinking, and future-orientation.",
    coreIdentity: `This archetype blends Pisces' emotional intuition with Aquarius' visionary intellect. Psychologically, it creates a person who is dreamy yet conceptual, sensitive yet inventive, intuitive yet future-minded.

Mythically, this is the moment when the tide meets the starlit wind, where imagination becomes vision, and emotion becomes insight.

People born here feel like cosmic translators, bridging the mystical and the intellectual, the emotional and the futuristic.`,
    psychologicalProfile: [
      { title: 'Intuitive Intelligence', text: "Ideas arrive as symbols, dreams, or sudden clarity." },
      { title: 'Empathic Vision', text: "They sense the emotional direction of the collective." },
      { title: 'Dream-Driven Innovation', text: "Their creativity is surreal, boundary-breaking, and ahead of its time." },
      { title: 'Fluid Identity', text: "They shift between roles and perspectives with ease." },
      { title: 'Humanitarian Sensitivity', text: "They care deeply about the world's emotional and spiritual wellbeing." },
    ],
    mythicSignature: `This archetype is the Star-Mist, Air infused with Water, mind infused with imagination.

Their mythic image is a figure pouring starlight into the ocean, merging cosmic vision with emotional depth.

They are the visionary dreamer, the mystic innovator, the seer of future tides.`,
    shadowPatterns: [
      { title: 'Dissociation', text: "Drifting away from reality into abstract worlds." },
      { title: 'Ungrounded Idealism', text: "Idealism without practical foundation." },
      { title: 'Emotional Confusion', text: "Difficulty distinguishing their feelings from the collective mood." },
      { title: 'Escapism', text: "Retreating into imagination when reality is harsh." },
      { title: 'Path Commitment', text: "Difficulty committing to one direction." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Dreams become real when given form",
        "Vision needs a vessel to change the world",
      ],
      conclusion: "When they ground their visionary imagination in practical action, they become extraordinary creators who bridge the mystical and the real.",
      lifeTheme: "Imagine the future — then shape it.",
    },
  },

  'pisces-pure': {
    elementalRatio: { Water: 1.00 },
    ratioNote: "Undiluted Water — pure intuition, compassion, and transcendent imagination.",
    coreIdentity: `Pure Pisces is the zodiac's oceanic consciousness, the archetype of intuition, compassion, imagination, and transcendence. Psychologically, this archetype embodies empathy, sensitivity, and spiritual depth.

Mythically, this is the primordial sea, the dream before creation, the place where all boundaries dissolve.

People born here feel like living tides — fluid, emotional, symbolic, and deeply connected to the unseen.`,
    psychologicalProfile: [
      { title: 'Emotional Intuition', text: "They sense what others feel without being told." },
      { title: 'Symbolic Mind', text: "Their thoughts come in images, metaphors, and dreams." },
      { title: 'Compassionate Presence', text: "They soothe, heal, and understand without judgment." },
      { title: 'Boundary-Fluid Identity', text: "They merge with environments, people, and moods." },
      { title: 'Creative Depth', text: "Their imagination is limitless, mythic, and poetic." },
    ],
    mythicSignature: `Pure Pisces is the Sacred Ocean, the source of dreams, healing, and spiritual truth.

Their mythic image is a figure floating in moonlit water, eyes closed, sensing the entire world through feeling.

They are the mystic, the healer, the dream-bearer.`,
    shadowPatterns: [
      { title: 'Emotional Overwhelm', text: "Absorbing too much from the world around them." },
      { title: 'Escapism', text: "Retreating into fantasy, substances, or dissociation." },
      { title: 'Lack of Boundaries', text: "Losing themselves in others' needs and emotions." },
      { title: 'Idealization', text: "Seeing people and situations as they wish they were, not as they are." },
      { title: 'Pain Absorption', text: "Taking on others' suffering as their own." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Compassion needs boundaries to stay pure",
        "The ocean is strongest when it has a shore",
      ],
      conclusion: "When they learn to hold their sensitivity within healthy boundaries, they become the zodiac's most profound healers, artists, and spiritual guides.",
      lifeTheme: "Feel deeply, heal gently, dream boldly.",
    },
  },

  'pisces-blend-forward': {
    elementalRatio: { Water: 0.65, Fire: 0.35 },
    ratioNote: "Water is dominant, but Fire introduces courage, impulse, and primal ignition.",
    coreIdentity: `This archetype blends Pisces' emotional intuition with Aries' primal ignition. Psychologically, it creates a person who is sensitive yet bold, dreamy yet decisive, intuitive yet action-oriented.

Mythically, this is the moment when the ocean begins to boil, when winter's last dream ignites into spring's first spark.

People born here feel like mystics with momentum, visionaries who act, dreamers who leap.`,
    psychologicalProfile: [
      { title: 'Intuitive Action', text: "They don't \"decide\" — they sense the right moment and move." },
      { title: 'Emotional Courage', text: "Feelings don't slow them down; they fuel their motion." },
      { title: 'Identity in Flux', text: "They oscillate between softness and assertion." },
      { title: 'Vision-Driven Motivation', text: "They need a dream to chase, not just a task." },
      { title: 'High Sensitivity + High Impulse', text: "A rare combination that creates brilliance and volatility." },
    ],
    mythicSignature: `This archetype is the Steam-Flame, Water meeting Fire, spirit becoming action.

Their mythic image is a warrior rising from mist, carrying a flame that was born in a dream.

They are the ignited mystic, the dream-charged warrior, the poet who leaps.`,
    shadowPatterns: [
      { title: 'Ungrounded Emotion', text: "Acting before grounding their emotions." },
      { title: 'Misunderstood Duality', text: "Feeling misunderstood for being both gentle and fierce." },
      { title: 'Impulsive Overwhelm', text: "Emotional overwhelm turning into impulsive decisions." },
      { title: 'Surrender vs Assertion', text: "Internal conflict between surrender and assertion." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let intuition choose the direction",
        "Let courage carry you there",
      ],
      conclusion: "When they trust their inner compass and channel it through bold action, they become visionary leaders who close the zodiac's circle — ending one cycle and igniting the next.",
      lifeTheme: "Turn visions into beginnings.",
    },
  },

  'aquarius-blend-forward': {
    elementalRatio: { Air: 0.65, Water: 0.35 },
    ratioNote: "Air is dominant, but Water introduces intuition, emotional depth, and mystical perception.",
    coreIdentity: `This archetype blends Aquarius' visionary intellect with Pisces' intuitive depth. Psychologically, it creates a person who is imaginative yet analytical, idealistic yet inventive, emotionally perceptive yet mentally free.

Mythically, this is the moment when the wind meets the mist, where ideas become dreams, and dreams become visions.

People born here feel like cosmic translators, bridging logic and intuition, technology and spirituality, future and myth.`,
    psychologicalProfile: [
      { title: 'Intuitive Intelligence', text: "Ideas arrive as visions, symbols, or sudden clarity." },
      { title: 'Empathic Detachment', text: "They feel deeply but process intellectually." },
      { title: 'Dream-Driven Innovation', text: "Their creativity is surreal, futuristic, and boundary-breaking." },
      { title: 'Collective Sensitivity', text: "They sense the emotional atmosphere of groups and societies." },
      { title: 'Fluid Identity', text: "They shift between roles, worlds, and perspectives with ease." },
    ],
    mythicSignature: `This archetype is the Star-Mist, Air infused with Water, mind infused with imagination.

Their mythic image is a figure pouring starlight into the ocean, merging cosmic vision with emotional depth.

They are the mystic innovator, the dream-scientist, the visionary empath.`,
    shadowPatterns: [
      { title: 'Dissociation', text: "Drifting away from reality into abstract worlds." },
      { title: 'Ungrounded Idealism', text: "Idealism without practical foundation." },
      { title: 'Emotional Confusion', text: "Difficulty distinguishing their feelings from others'." },
      { title: 'Fantasy Escapism', text: "Escaping into imagination when reality is harsh." },
      { title: 'Path Commitment', text: "Difficulty committing to one direction." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Dreams become real when given structure",
        "Intuition and logic are partners, not rivals",
      ],
      conclusion: "When they ground their visionary imagination in practical action, they become the zodiac's most extraordinary creators — people who bring the impossible into reality.",
      lifeTheme: "Imagine the future — then bring it into form.",
    },
  },

  'capricorn-blend-forward': {
    elementalRatio: { Earth: 0.65, Air: 0.35 },
    ratioNote: "Earth is dominant, but Air introduces innovation, independent thinking, and futuristic vision.",
    coreIdentity: `This archetype blends Capricorn's structural Earth with Aquarius' visionary Air. Psychologically, it creates a person who is practical yet futuristic, disciplined yet inventive, grounded yet unconventional.

Mythically, this is the moment when the mountain peak catches the wind, where structure meets innovation, and tradition meets revolution.

People born here feel like engineers of the future, builders who innovate, leaders who reform systems from the inside out.`,
    psychologicalProfile: [
      { title: 'Innovative Strategy', text: "They see how to improve systems, not just maintain them." },
      { title: 'Grounded Vision', text: "Their ideas are futuristic — but executable." },
      { title: 'Independent Thinking', text: "They resist conformity and carve their own path." },
      { title: 'Humanitarian Structure', text: "They build for the collective, not just themselves." },
      { title: 'Reformist Leadership', text: "They modernize institutions with clarity and purpose." },
    ],
    mythicSignature: `This archetype is the Wind-Carved Peak, Air shaping Earth, innovation shaping structure.

Their mythic image is an architect drawing blueprints on a mountaintop, the wind carrying their ideas into the future.

They are the innovative architect, the system reformer, the builder of tomorrow.`,
    shadowPatterns: [
      { title: 'Over-Detachment', text: "Intellectualizing emotions instead of feeling them." },
      { title: 'Cold Rationality', text: "Logic that excludes compassion." },
      { title: 'Rebellion for Its Own Sake', text: "Opposing tradition without building alternatives." },
      { title: 'Intimacy Difficulty', text: "Difficulty with emotional closeness." },
      { title: 'Disguised Rigidity', text: "Rigidity disguised as innovation." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Innovation thrives when grounded in humanity",
        "The future is built on trust, not just technology",
      ],
      conclusion: "When they balance their structural discipline with Aquarian vision, they become architects of systems that serve both progress and people.",
      lifeTheme: "Build the future with clarity.",
    },
  },

  'sagittarius-blend-forward': {
    elementalRatio: { Fire: 0.65, Earth: 0.35 },
    ratioNote: "Fire is dominant, but Earth introduces discipline, structure, and strategic ambition.",
    coreIdentity: `This archetype blends Sagittarius' fiery expansion with Capricorn's earthy discipline. Psychologically, it creates a person who is ambitious yet visionary, adventurous yet structured, idealistic yet grounded.

Mythically, this is the moment when the arrow lands and becomes a path, where inspiration becomes strategy, and exploration becomes achievement.

People born here feel like builders of horizons, explorers who turn dreams into plans, wanderers who leave monuments behind.`,
    psychologicalProfile: [
      { title: 'Strategic Vision', text: "They dream big — but they also map the steps." },
      { title: 'Disciplined Ambition', text: "They pursue goals with fire and endurance." },
      { title: 'Grounded Optimism', text: "They believe in possibilities, but with realism." },
      { title: 'Purposeful Exploration', text: "They travel, study, and grow with intention." },
      { title: 'Leadership Through Wisdom', text: "They guide others with experience and insight." },
    ],
    mythicSignature: `This archetype is the Mountain-Path Flame, Fire climbing Earth, vision becoming structure.

Their mythic image is a traveler planting a flag on a high peak, surveying the world with clarity and purpose.

They are the disciplined explorer, the strategic visionary, the builder of meaning.`,
    shadowPatterns: [
      { title: 'Workaholic Tendencies', text: "Turning every adventure into a project." },
      { title: 'Over-Commitment', text: "Taking on too many goals simultaneously." },
      { title: 'Harsh Self-Judgment', text: "Measuring themselves against impossible standards." },
      { title: 'Difficulty Relaxing', text: "Rest feels like wasted opportunity." },
      { title: 'Rigid Ideals', text: "Turning ideals into inflexible rules." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let purpose guide ambition, not pressure",
        "The journey is as valuable as the summit",
      ],
      conclusion: "When they balance their visionary fire with Capricorn's patience, they become master builders of meaningful legacies.",
      lifeTheme: "Build the path to your horizon.",
    },
  },

  'scorpio-blend-forward': {
    elementalRatio: { Water: 0.65, Fire: 0.35 },
    ratioNote: "Water is dominant, but Fire introduces truth-seeking, adventure, and philosophical boldness.",
    coreIdentity: `This archetype blends Scorpio's emotional depth with Sagittarius' fiery truth-seeking. Psychologically, it creates a person who is intense yet adventurous, probing yet outspoken, private yet philosophical.

Mythically, this is the moment when a torch is carried into the underworld, revealing hidden truths with bold illumination.

People born here feel like explorers of the psyche, philosophers of shadow, seekers who want to understand the meaning behind everything.`,
    psychologicalProfile: [
      { title: 'Bold Insight', text: "They speak truths others avoid." },
      { title: 'Philosophical Depth', text: "They search for meaning in emotional experiences." },
      { title: 'Adventurous Intuition', text: "They follow instinct into unknown territory." },
      { title: 'Transformational Honesty', text: "Their words can catalyze change — or rupture." },
      { title: 'Restless Intensity', text: "They crave both depth and expansion." },
    ],
    mythicSignature: `This archetype is the Torch-Bearer, Fire descending into Water, illumination entering the depths.

Their mythic image is a wanderer holding a flame in a cavern, seeking wisdom in the shadows.

They are the truth-seeker, the shadow explorer, the philosopher of intensity.`,
    shadowPatterns: [
      { title: 'Wounding Bluntness', text: "Speaking truth without considering its impact." },
      { title: 'Relationship Restlessness', text: "Craving both depth and freedom simultaneously." },
      { title: 'Emotional Volatility', text: "Intensity that swings between expansion and contraction." },
      { title: 'Transformation Idealization', text: "Expecting every experience to be meaningful." },
      { title: 'Grounding Difficulty', text: "Difficulty staying rooted when the horizon calls." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Truth is strongest when delivered with compassion",
        "Depth and freedom are not opposites",
      ],
      conclusion: "When they balance their penetrating insight with Sagittarian openness, they become visionary truth-tellers who illuminate the human experience.",
      lifeTheme: "Illuminate the depths.",
    },
  },

  'libra-blend-forward': {
    elementalRatio: { Air: 0.65, Water: 0.35 },
    ratioNote: "Air is dominant, but Water introduces emotional depth, intuition, and penetrating perception.",
    coreIdentity: `This archetype blends Libra's airy diplomacy with Scorpio's emotional depth. Psychologically, it creates a person who is perceptive yet graceful, charming yet intense, harmonizing yet penetrating.

Mythically, this is the moment when the breeze carries the scent of deep waters, where harmony meets truth, and beauty meets shadow.

People born here feel like emotional diplomats, mediators who sense the undercurrents, artists who reveal hidden truths.`,
    psychologicalProfile: [
      { title: 'Deep Perception', text: "They read emotional subtext instantly." },
      { title: 'Magnetic Charm', text: "Their presence is warm, alluring, and quietly powerful." },
      { title: 'Truth-Seeking Harmony', text: "They don't want superficial peace — they want authentic connection." },
      { title: 'Emotional Intelligence', text: "They navigate feelings with grace and insight." },
      { title: 'Transformational Relationships', text: "Their bonds change people — and themselves." },
    ],
    mythicSignature: `This archetype is the Moonlit Mirror — Air reflecting Water, mind reflecting emotion.

Their mythic image is a diplomat standing beside a still lake, seeing both the surface and the depths.

They are the intuitive harmonizer, the shadow-aware mediator, the artist of emotional truth.`,
    shadowPatterns: [
      { title: 'Motive Over-Analysis', text: "Over-analyzing emotional motives in others." },
      { title: 'Trust Conflict', text: "Fear of conflict mixed with fear of betrayal." },
      { title: 'Trust Difficulty', text: "Difficulty letting others in fully." },
      { title: 'Hidden Intensity', text: "Emotional intensity concealed behind charm." },
      { title: 'Subtle Manipulation', text: "Using diplomacy as a tool for control." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Harmony is strongest when it includes the depths",
        "Vulnerability is not weakness — it is the deepest form of trust",
      ],
      conclusion: "When they allow their diplomatic grace to embrace emotional truth rather than hide from it, they become the zodiac's most powerful emotional healers and truth-tellers.",
      lifeTheme: "Reveal truth with grace.",
    },
  },

  'virgo-blend-forward': {
    elementalRatio: { Earth: 0.65, Air: 0.35 },
    ratioNote: "Earth is dominant, but Air introduces harmony, diplomacy, and aesthetic sensibility.",
    coreIdentity: `This archetype blends Virgo's earthy precision with Libra's airy harmony. Psychologically, it creates a person who is analytical yet diplomatic, precise yet graceful, practical yet aesthetic.

Mythically, this is the moment when the harvest meets the breeze, where order becomes elegance, and refinement becomes art.

People born here feel like designers of balance, analysts who beautify, problem-solvers who harmonize.`,
    psychologicalProfile: [
      { title: 'Aesthetic Precision', text: "They refine not just for function — but for beauty." },
      { title: 'Diplomatic Intelligence', text: "They communicate with tact, clarity, and fairness." },
      { title: 'Balanced Judgment', text: "They weigh options carefully before acting." },
      { title: 'Social Grace', text: "They bring calm, order, and harmony to groups." },
      { title: 'Collaborative Skill', text: "They work well with others, blending logic with charm." },
    ],
    mythicSignature: `This archetype is the Balanced Scythe — Earth guided by Air, precision shaped by harmony.

Their mythic image is a craftsperson carving symmetrical patterns, each line both functional and beautiful.

They are the harmonizing analyst, the refined diplomat, the designer of order and elegance.`,
    shadowPatterns: [
      { title: 'Over-Accommodation', text: "Adjusting too much to please others." },
      { title: 'Indecision', text: "Weighing options endlessly without committing." },
      { title: 'Relationship Perfectionism', text: "Expecting flawlessness in partnerships." },
      { title: 'People-Pleasing', text: "Sacrificing their standards to maintain harmony." },
      { title: 'Assertion Difficulty', text: "Difficulty asserting their own needs." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Harmony is strongest when it includes your own voice",
        "Grace and honesty can coexist",
      ],
      conclusion: "When they balance their analytical precision with diplomatic grace, they become the zodiac's most elegant problem-solvers — people who refine the world with beauty and truth.",
      lifeTheme: "Refine the world with grace.",
    },
  },

  'leo-blend-forward': {
    elementalRatio: { Fire: 0.65, Earth: 0.35 },
    ratioNote: "Fire is dominant, but Earth introduces precision, discipline, and craftsmanship.",
    coreIdentity: `This archetype blends Leo's fiery creativity with Virgo's earthy precision. Psychologically, it creates a person who is expressive yet disciplined, confident yet humble, creative yet detail-oriented.

Mythically, this is the moment when the Sun ripens the harvest, where fire becomes form, and inspiration becomes craft.

People born here feel like artists with technique, leaders who refine, creators who perfect.`,
    psychologicalProfile: [
      { title: 'Focused Creativity', text: "Their ideas don't just shine — they are shaped, polished, and executed." },
      { title: 'Humble Confidence', text: "They radiate warmth without arrogance." },
      { title: 'Service-Oriented Leadership', text: "They lead by example, not demand." },
      { title: 'Craftsmanship', text: "They take pride in the details of their work." },
      { title: 'Purposeful Expression', text: "Their creativity always has intention and structure." },
    ],
    mythicSignature: `This archetype is the Solar Artisan — Fire guided by Earth, passion shaped into mastery.

Their mythic image is a lion forging golden tools, crafting beauty with strength and precision.

They are the disciplined creator, the refined leader, the flame that builds.`,
    shadowPatterns: [
      { title: 'Perfectionism', text: "The need for flawlessness can paralyze creative flow." },
      { title: 'Self-Criticism', text: "Holding themselves to impossible standards." },
      { title: 'Overworking', text: "Pushing creative impulses past the point of joy." },
      { title: 'Difficulty Relaxing', text: "Rest feels like wasted time." },
      { title: 'Productivity Pride', text: "Tying self-worth to output rather than being." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let discipline support creativity, not suffocate it",
        "Imperfection is part of the craft",
      ],
      conclusion: "When they allow their fire to be guided by precision without being extinguished by it, they become master creators — artists whose work endures.",
      lifeTheme: "Shape the fire into something lasting.",
    },
  },

  'cancer-blend-forward': {
    elementalRatio: { Water: 0.65, Fire: 0.35 },
    ratioNote: "Water is dominant, but Fire introduces warmth, confidence, and expressive courage.",
    coreIdentity: `This archetype blends Cancer's emotional depth with Leo's fiery confidence. Psychologically, it creates a person who is warm yet sensitive, protective yet expressive, emotional yet bold.

Mythically, this is the moment when the Moon meets the Sun, creating a glow that is both soft and radiant.

People born here feel like guardians with a spotlight, nurturers who lead, hearts that shine.`,
    psychologicalProfile: [
      { title: 'Warm Leadership', text: "They guide others with care, not dominance." },
      { title: 'Expressive Emotion', text: "They don't just feel — they show what they feel." },
      { title: 'Protective Pride', text: "They defend loved ones with fierce loyalty." },
      { title: 'Creative Sensitivity', text: "Their art, style, and presence carry emotional resonance." },
      { title: 'Heart-Centered Confidence', text: "Their courage comes from caring deeply." },
    ],
    mythicSignature: `This archetype is the Hearth Flame — Fire held in a protective vessel, warmth that gathers people close.

Their mythic image is a guardian holding a torch, lighting the way for their tribe.

They are the radiant nurturer, the emotional leader, the heart-fire protector.`,
    shadowPatterns: [
      { title: 'Emotional Dramatization', text: "Feelings can become performances." },
      { title: 'Overprotectiveness', text: "Guarding so fiercely it becomes controlling." },
      { title: 'Pride in Caretaking', text: "Tying self-worth to being needed." },
      { title: 'Difficulty Receiving', text: "They give endlessly but struggle to accept help." },
      { title: 'Criticism Sensitivity', text: "Taking feedback as personal attack." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Shine without burning",
        "Protect without controlling",
      ],
      conclusion: "When they balance their nurturing instinct with confident self-expression, they become magnetic leaders who inspire through warmth and authenticity.",
      lifeTheme: "Lead with heart, and let warmth be your strength.",
    },
  },

  'gemini-blend-forward': {
    elementalRatio: { Air: 0.65, Water: 0.35 },
    ratioNote: "Air is dominant, but Water introduces emotional intuition and empathic depth.",
    coreIdentity: `This archetype blends Gemini's airy intellect with Cancer's emotional intuition. Psychologically, it creates a mind that feels while it thinks, a communicator who listens between the lines, a storyteller who weaves emotion into language.

Mythically, this is the moment when the wind carries the scent of the sea, thought touched by feeling, logic softened by empathy.

People born here feel like emotional translators — they give words to what others feel.`,
    psychologicalProfile: [
      { title: 'Emotional Intelligence', text: "They read people instantly — tone, mood, subtext, energy." },
      { title: 'Nurturing Communication', text: "Their words comfort, soothe, and connect." },
      { title: 'Intuitive Thinking', text: "Ideas come through feeling, not just logic." },
      { title: 'Adaptive Sensitivity', text: "They shift their communication style to match the emotional environment." },
      { title: 'Memory-Rich Mind', text: "They remember stories, voices, and emotional details." },
    ],
    mythicSignature: `This archetype is the Mist-Bearer — Air infused with Water, thought infused with emotion.

Their mythic image is a storyteller by the shoreline, speaking truths carried by the tide.

They are the empathic communicator, the emotional interpreter, the voice of the heart-mind.`,
    shadowPatterns: [
      { title: 'Mood-Driven Thinking', text: "Their logic can be hijacked by emotional states." },
      { title: 'Emotional Overwhelm', text: "Absorbing too much from others." },
      { title: 'Taking Things Personally', text: "Difficulty separating critique from rejection." },
      { title: 'Boundary Blurring', text: "Difficulty separating self from others." },
      { title: 'Over-Accommodation', text: "Changing their message to please the listener." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Feel deeply, speak clearly",
        "Empathy and honesty can coexist",
      ],
      conclusion: "When they honor both their intellectual clarity and emotional depth, they become the zodiac's most powerful empathic communicators.",
      lifeTheme: "Give voice to the emotional world.",
    },
  },

  'taurus-blend-forward': {
    elementalRatio: { Earth: 0.65, Air: 0.35 },
    ratioNote: "Earth remains dominant, but Air introduces movement, curiosity, and mental agility.",
    coreIdentity: `This archetype blends Taurus' grounded, sensual stability with Gemini's airy curiosity and mental quickness.

Mythically, this is the moment when a warm breeze moves across the fields, carrying ideas, stories, and possibilities.

People born here feel like builders who speak, artisans who teach, creators who communicate.`,
    psychologicalProfile: [
      { title: 'Practical Intelligence', text: "They don't just think — they apply. Ideas become tools. Concepts become structures." },
      { title: 'Earthy Wit', text: "Their humor is grounded, observational, charming." },
      { title: 'Patient Communicator', text: "They explain things clearly, calmly, and with real-world examples." },
      { title: 'Adaptable Stability', text: "They stay rooted, but they can pivot when needed — a rare trait for Taurus." },
      { title: 'Social Craftsmanship', text: "They build relationships the way they build objects: with care, consistency, and attention to detail." },
    ],
    mythicSignature: `This archetype is the Dust Devil — Earth lifted by Air, matter animated by thought, stability infused with movement.

Their mythic image is a sculptor speaking to their clay, shaping with hands and words at the same time.

They are the artisan-messenger, the grounded storyteller, the builder of ideas and relationships.`,
    shadowPatterns: [
      { title: 'Earth-Air Friction', text: "Part of them wants routine. Part of them wants novelty. This creates internal tug-of-war." },
      { title: 'Overthinking Material Concerns', text: "They can become anxious about money, resources, or security." },
      { title: 'Calculating Tendencies', text: "They may analyze people or situations too strategically." },
      { title: 'Scattered Focus', text: "Air pulls them in many directions; Earth tries to hold them still." },
    ],
    growthPath: {
      intro: "Their evolution begins when they learn:",
      bullets: [
        "Let curiosity guide the mind",
        "Let Earth guide the hands",
      ],
      conclusion: "When they balance thought with embodiment, they become one of the zodiac's most gifted communicators and creators.",
      lifeTheme: "Make ideas tangible.",
    },
  },
};

export default CUSP_EXTENDED_PROFILES;
