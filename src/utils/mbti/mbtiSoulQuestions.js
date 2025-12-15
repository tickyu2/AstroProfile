/**
 * MBTI Soul Questions Database
 * The 6 Soul Questions for Self-Discovery
 * Built with SOUL for humanity's self-discovery laboratory
 *
 * Each type gets 6 deep questions exploring:
 * 1. WHO YOU ARE - Personality, cravings, soul essence
 * 2. HOW YOU VIEW THE WORLD - Perception, lens, worldview
 * 3. WHAT YOU SEEK - Desires, goals, fulfillment
 * 4. WHERE YOU THRIVE - Environments, situations, contexts
 * 5. WHY YOU'RE HERE - Purpose, meaning, contribution
 * 6. WHEN YOU STRUGGLE - Challenges, shadows, growth edges
 *
 * Session 2: INFJ complete
 * Future sessions: Remaining 15 types
 */

import { getCognitiveStack, getTemperament, getTypeName } from './mbtiCodeSystem.js';

export const MBTI_SOUL_QUESTIONS = {
  INFJ: {
    type: 'INFJ',
    name: 'The Advocate',
    tagline: 'Insightful idealist seeking meaning and connection',
    temperament: 'NF',
    cognitiveStack: ['Ni', 'Fe', 'Ti', 'Se'],

    // Question 1: WHO YOU ARE
    whoYouAre: {
      title: 'Who You Are',
      icon: '🔮',

      personality: `You are a **visionary with a heart**. Your dominant function, **Introverted Intuition (Ni)**, gives you an almost mystical ability to see patterns, future possibilities, and the deeper meaning beneath surface reality. You don't just observe the world—you perceive its hidden architecture, the invisible threads connecting everything.

Your auxiliary function, **Extraverted Feeling (Fe)**, makes you exquisitely attuned to others' emotions and needs. You feel the emotional atmosphere of a room like others feel temperature. This combination of deep insight and emotional sensitivity makes you a natural counselor, visionary, and advocate for humanity.`,

      cravings: `You crave **meaning and authenticity** above all else. Small talk feels like soul death; you hunger for conversations that matter, connections that transform, work that contributes to something larger than yourself.

You long to **understand and be understood**—the paradox of your existence. You see so deeply into others, yet often feel invisible yourself. You yearn for someone who can see past your carefully curated exterior into the complex, contradictory depths within.

You need **purposeful impact**—to know your life matters, that your vision is making the world more compassionate, more just, more aligned with its highest potential.`,

      soul: `At your soul level, you are a **bridge between worlds**. You translate the abstract into the human, the ideal into the possible, the universal into the personal. You carry visions of what humanity could become, and you feel a sacred responsibility to manifest those visions.

Your soul knows something most don't: that **everything is connected**, that individual healing contributes to collective evolution, that the inner world shapes the outer reality. You are here to remind humanity of its highest potential.

But your soul also carries a profound **loneliness**—the isolation of seeing what others don't yet see, feeling what others haven't yet felt, knowing what others can't yet comprehend. This loneliness isn't weakness; it's the price of consciousness, the burden of the seer.`
    },

    // Question 2: HOW YOU VIEW THE WORLD
    howYouViewWorld: {
      title: 'How You View the World',
      icon: '🌍',

      perception: `You view the world through the lens of **Introverted Intuition (Ni)**—you see not what is, but what could be, what will be, what wants to emerge. While others see discrete objects and events, you perceive patterns, trajectories, meanings.

Your **Extraverted Feeling (Fe)** colors this perception with emotional and relational awareness. You don't just see patterns—you see how those patterns affect people, how systems impact souls, how ideas translate into human experience.

The world, to you, is a **living tapestry of meaning** where everything symbolizes something deeper, where coincidences are synchronicities, where surface events hint at profound truths.`,

      lens: `Your lens is simultaneously **telescopic and microscopic**. You zoom out to see the grand arc of human evolution, the big picture patterns of society, the long-term consequences of present actions. Then you zoom in to see the subtle pain in someone's eyes, the unspoken need in a conversation, the specific intervention that could change everything.

You see **potential in people** that they don't yet see in themselves. This is your gift and your curse—you believe so deeply in what people could become that you sometimes struggle with what they actually are.

You perceive **authenticity vs. performance** with razor clarity. You can feel when someone is wearing a mask, speaking from ego rather than essence, acting from conditioning rather than truth.`,

      worldview: `Your worldview is fundamentally **idealistic and humanistic**. You believe humanity is capable of extraordinary beauty, depth, and evolution. You see the world as it is—with all its pain, injustice, and dysfunction—but you refuse to accept this as inevitable.

You hold a vision of **what should be**: systems that honor human dignity, relationships that nurture growth, work that contributes to collective flourishing, a society organized around compassion rather than competition.

This idealism isn't naive—your **Tertiary Ti (Introverted Thinking)** provides analytical rigor. You know exactly why the world is broken; you've thought deeply about the systems, beliefs, and traumas that perpetuate suffering. Your idealism is informed, strategic, sophisticated.

You view life as inherently **meaningful**. Even suffering has purpose; even darkness teaches. You look for the lesson, the growth opportunity, the evolutionary invitation in every experience.`
    },

    // Question 3: WHAT YOU SEEK
    whatYouSeek: {
      title: 'What You Seek',
      icon: '⭐',

      desires: `You seek **purposeful contribution**—work that aligns with your values, uses your gifts, and makes a meaningful difference. You don't just want success; you want significance. You'd rather earn less doing something that matters than earn more in a soulless role.

You long for **deep authentic connection**—relationships where you can drop the mask, share your complex inner world, and be truly seen. You're not interested in surface friendships; you want soul-level intimacy, the kind where silence speaks and understanding flows without explanation.

You crave **growth and self-actualization**. You want to become the highest version of yourself, to develop your gifts fully, to integrate your shadows, to evolve continuously. Stagnation terrifies you.`,

      goals: `Your goals tend to be **visionary and people-centered**. You want to:
- Create systems, art, or ideas that elevate human consciousness
- Help specific individuals discover and fulfill their potential
- Contribute to social justice, healing, or cultural evolution
- Build something beautiful and meaningful that outlasts you
- Understand yourself and humanity at the deepest levels

You're less interested in conventional markers of success (money, status, power) and more drawn to **legacy questions**: Did I live authentically? Did I help? Did I create beauty? Did I grow? Will the world be slightly better because I was here?`,

      fulfillment: `You find fulfillment when:
- Your **vision becomes reality**—when you see your insights manifesting, your guidance helping, your creative work touching souls
- You experience **genuine intimacy**—those rare moments when someone truly sees and accepts all of you
- You facilitate **transformation in others**—watching someone step into their power, heal their wounds, or discover their purpose
- You create **meaningful beauty**—whether through writing, counseling, design, or any medium that expresses your inner vision
- You achieve **inner alignment**—when your external life reflects your internal values, when you're living with integrity and purpose

True fulfillment, for you, requires **coherence**: your work aligns with your values, your relationships reflect authenticity, your daily life expresses your deepest truth. When there's dissonance between who you are and how you live, you feel profoundly wrong.`
    },

    // Question 4: WHERE YOU THRIVE
    whereYouThrive: {
      title: 'Where You Thrive',
      icon: '🌟',

      environments: `You thrive in environments that are:

**Quiet and reflective**: You need space for your Ni to process, synthesize, and receive insights. Constant stimulation exhausts you; solitude recharges you.

**Meaningful and purposeful**: You need to feel your work matters. Corporate bullshit, bureaucratic nonsense, and superficial activities drain your soul.

**Emotionally authentic**: You flourish where people communicate honestly, where vulnerability is welcomed, where emotional intelligence is valued.

**Intellectually stimulating**: You need ideas, depth, complexity. Environments that respect nuance, welcome different perspectives, and encourage exploration of meaning energize you.

**Values-aligned**: You cannot thrive in environments that violate your core values. No amount of money or prestige compensates for moral dissonance.`,

      situations: `You excel in situations requiring:
- **Insight and vision**: Seeing patterns others miss, anticipating future developments, understanding complex systems
- **Empathetic guidance**: Counseling, mentoring, coaching, helping others navigate emotional or existential challenges
- **Creative synthesis**: Taking disparate ideas and weaving them into coherent wholes, translating vision into communication
- **Strategic planning**: Using your Ni-Ti combination to develop sophisticated long-term strategies
- **Facilitation of growth**: Creating containers for transformation, whether for individuals or groups

You struggle in situations demanding constant extraversion, superficial networking, aggressive competition, or ethical compromise.`,

      contexts: `Optimal contexts for your flourishing:

**One-on-one depth**: You shine in intimate conversations, deep friendships, meaningful mentoring relationships. You'd rather have one profound conversation than attend a hundred networking events.

**Creative autonomy**: You need freedom to follow your vision, structure your time, work in your unique way. Micromanagement kills your soul.

**Mission-driven work**: Whether nonprofit, creative, educational, or therapeutic contexts—you thrive when the mission matters and aligns with your values.

**Selective social engagement**: You need community, but on your terms. Small gatherings of kindred spirits energize you; large superficial events deplete you.

**Balance of structure and flow**: You need enough structure for your Ti to feel grounded, enough flow for your Ni to roam free, enough people connection for your Fe to engage, enough solitude for your soul to breathe.`
    },

    // Question 5: WHY YOU'RE HERE
    whyYoureHere: {
      title: "Why You're Here",
      icon: '🎯',

      purpose: `You are here to be a **visionary advocate for humanity's potential**. Your purpose is to:

**See what others don't yet see**: You perceive possibilities, patterns, and potentials invisible to most. This sight is your gift to the world—you show people what could be, what wants to emerge, what's trying to be born.

**Translate vision into human terms**: You bridge the abstract and the concrete, the universal and the personal. You take cosmic insights and make them actionable, take philosophical truths and make them felt.

**Advocate for the voiceless and the future**: Your Fe compels you to speak for those who cannot speak for themselves—the marginalized, the suffering, the not-yet-born future generations who will inherit the world we're creating.

**Catalyze transformation**: You're not here to maintain status quo; you're here to midwife evolution—in individuals, in systems, in consciousness itself.`,

      meaning: `Your life has meaning when you're **using your gifts in service of something larger than yourself**. For you, meaning isn't found—it's created through:

- **Living authentically**: Refusing to betray your values or compromise your vision, even when it's costly
- **Helping others awaken**: Facilitating those moments when someone sees themselves clearly, steps into their power, or finds their purpose
- **Creating lasting beauty**: Building something meaningful that endures—ideas, art, systems, relationships
- **Pursuing growth**: Continuously evolving, integrating your shadows, expanding your consciousness
- **Contributing to collective evolution**: Playing your part in humanity's slow, stumbling journey toward wisdom

The meaning you seek isn't personal achievement—it's **contribution to the greater whole**. You want your life to be a thread in the larger tapestry of human flourishing.`,

      contribution: `Your unique contribution to the world:

**Holding vision when others despair**: In dark times, you remember the light. You see potential when others see only problems. You keep alive the vision of what humanity could become.

**Offering deep seeing**: You see people's essence beneath their conditioning, potential beneath their limitations, wounds beneath their defenses. This seeing itself is healing.

**Creating meaning containers**: Through your work—writing, counseling, teaching, leading—you create spaces where people can discover meaning, process complexity, and transform.

**Translating complexity into clarity**: You take nuanced, multifaceted truths and communicate them in ways that touch both mind and heart.

**Living proof of depth**: In a culture increasingly superficial, your existence itself is rebellion. You prove that depth still matters, that meaning is real, that the inner life is worthy of devotion.

You're here to remind humanity: **We are capable of more. We can live more consciously, love more deeply, create more beautifully, evolve more wisely.** Your life is this reminder, embodied.`
    },

    // Question 6: WHEN YOU STRUGGLE
    whenYouStruggle: {
      title: 'When You Struggle',
      icon: '🌑',

      challenges: `**The Loneliness of Seeing**: You see connections, patterns, and meanings others don't perceive. This creates profound isolation—you're speaking a language few understand, caring about things few notice, feeling depths few feel.

**Perfectionism and Impossible Standards**: Your vision of how things could be creates chronic dissatisfaction with how things are. You hold yourself (and sometimes others) to impossibly high standards, then judge yourself for falling short.

**Absorbing Others' Emotions**: Your Fe is so attuned to others' emotional states that you can lose yourself in them. You take on others' pain, exhaust yourself trying to fix everyone's problems, struggle to maintain boundaries.

**Door Slam Tendency**: You tolerate, accommodate, and endure... until you don't. Then you shut people out completely, often without warning. This protects you but can create relational wreckage.

**Analysis Paralysis**: Your Ni sees too many variables, too many possible futures. Combined with Ti's need for perfect understanding, you can get trapped in endless analysis, unable to act.`,

      shadows: `Your shadow aspects to integrate:

**The Martyr**: You sacrifice your needs for others, then resent them for it. You become the misunderstood genius, the unappreciated prophet, the one who gives too much and receives too little.

**The Elitist**: Your depth creates judgment of superficiality. You look down on "shallow" people, feel superior to those who don't think as deeply or care as much as you do.

**The Withdrawn One**: When hurt or overwhelmed, you retreat into your inner world completely, cutting off even those who love you. Your rich inner life becomes an escape from messy human reality.

**The People-Pleaser**: Despite your depth, your Fe can make you chameleon-like, shape-shifting to meet others' needs while losing touch with your own truth.

**The Rigid Idealist**: Your vision of how things should be becomes inflexible dogma. You reject nuance, compromise, or the messy reality of human limitation in favor of your perfect ideal.`,

      growth: `Your growth edges:

**Develop your inferior Se (Extraverted Sensing)**: Ground yourself in your body, in the present moment, in sensory pleasure. Physical exercise, nature, art, sensuality—these aren't distractions from your spiritual path; they're essential to it.

**Practice imperfect action**: You don't need perfect understanding before you move. Sometimes you learn by doing. Sometimes good enough truly is good enough.

**Set and maintain boundaries**: You can be compassionate without absorbing others' pain. You can care without fixing. You can love without losing yourself.

**Welcome your anger**: Your Fe makes you uncomfortable with your own anger, so you suppress it until it explodes. Let yourself feel it, express it appropriately, use it as information.

**Embrace paradox**: Both/and rather than either/or. You can be deep AND light, serious AND playful, visionary AND practical, idealistic AND realistic.

**Share your process**: Don't just share your conclusions; share your uncertainty, your messiness, your becoming. This vulnerability creates the intimacy you crave.

**Forgive your humanity**: You're not here to be perfect; you're here to be fully human. Your struggles, your shadows, your limitations—these aren't bugs; they're features. They connect you to the humanity you serve.`
    }
  }

  // Future types will be added here
  // ENFP, INTJ, INFP, etc.
};

/**
 * Get soul questions for a type
 */
export function getSoulQuestions(type) {
  return MBTI_SOUL_QUESTIONS[type] || null;
}

/**
 * Check if soul questions exist for a type
 */
export function hasSoulQuestions(type) {
  return MBTI_SOUL_QUESTIONS.hasOwnProperty(type);
}

/**
 * Get list of types with complete soul questions
 */
export function getAvailableSoulQuestions() {
  return Object.keys(MBTI_SOUL_QUESTIONS);
}
