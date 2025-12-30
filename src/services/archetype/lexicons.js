/**
 * ============================================================================
 * GENESIS ARCHETYPE LEXICONS
 * ============================================================================
 *
 * Word patterns and lexicons for signal detection in text analysis.
 * Based on GENESIS Cathedral Emotional Architecture.
 *
 * Used by SignalExtractor to identify emotional, cognitive, relational,
 * and motivational patterns in user messages.
 *
 * Part of: GENESIS Archetype Detection System
 * Created: December 29, 2024
 * ============================================================================
 */

export const LEXICONS = {
  // =========================================================================
  // INTENSITY MARKERS
  // =========================================================================
  intensity_high: [
    'absolutely', 'extremely', 'incredibly', 'very', 'really',
    'totally', 'completely', 'entirely', 'desperately', 'urgent',
    'so much', 'deeply', 'profoundly', 'intensely', 'overwhelming'
  ],

  intensity_low: [
    'maybe', 'perhaps', 'might', 'possibly', 'somewhat',
    'kind of', 'sort of', 'a bit', 'slightly', 'a little',
    'not really', 'barely', 'hardly'
  ],

  // =========================================================================
  // PRIMARY EMOTIONS
  // =========================================================================
  joy: [
    'happy', 'joy', 'excited', 'love', 'wonderful', 'amazing', 'great',
    'fantastic', 'beautiful', 'grateful', 'blessed', 'delighted',
    'thrilled', 'ecstatic', 'peaceful', 'content', 'fulfilled'
  ],

  anger: [
    'angry', 'mad', 'furious', 'frustrated', 'rage', 'pissed',
    'annoyed', 'irritated', 'resentful', 'bitter', 'hostile',
    'fed up', 'sick of', 'hate', 'disgusted'
  ],

  fear: [
    'scared', 'afraid', 'terrified', 'anxious', 'worried', 'nervous', 'panic',
    'frightened', 'fearful', 'dread', 'apprehensive', 'uneasy',
    'paranoid', 'insecure', 'threatened'
  ],

  sadness: [
    'sad', 'depressed', 'unhappy', 'miserable', 'heartbroken',
    'devastated', 'grief', 'mourning', 'melancholy', 'hopeless',
    'empty', 'numb', 'lonely', 'isolated', 'abandoned'
  ],

  // =========================================================================
  // EMOTIONAL STATES
  // =========================================================================
  pain: [
    'hurt', 'pain', 'broken', 'wounded', 'suffering', 'ache',
    'damaged', 'scarred', 'trauma', 'bleeding', 'crushed',
    'shattered', 'torn', 'bruised'
  ],

  growth: [
    'grow', 'learn', 'develop', 'evolve', 'transform', 'progress',
    'improve', 'change', 'expand', 'become', 'mature', 'heal',
    'breakthrough', 'insight', 'realize', 'understand'
  ],

  connection: [
    'together', 'with', 'us', 'we', 'share', 'connect', 'belong',
    'bond', 'close', 'intimate', 'relationship', 'attached',
    'love', 'care', 'support', 'understand'
  ],

  boundary: [
    'no', 'stop', 'enough', 'boundary', 'limit', 'space', 'protect',
    'distance', 'separate', 'leave', 'away', 'done', 'finished',
    'refuse', 'reject', 'back off'
  ],

  // =========================================================================
  // TEMPORAL FOCUS
  // =========================================================================
  past_focus: [
    'was', 'were', 'had', 'did', 'before', 'ago', 'yesterday',
    'used to', 'back then', 'remember', 'memory', 'past',
    'history', 'previous', 'once', 'when i was'
  ],

  future_focus: [
    'will', 'going to', 'plan to', 'want to', 'tomorrow', 'next',
    'future', 'soon', 'eventually', 'someday', 'hope to',
    'dream of', 'aspire', 'goal', 'vision'
  ],

  // =========================================================================
  // COGNITIVE PATTERNS
  // =========================================================================
  uncertainty: [
    "don't know", 'not sure', 'maybe', 'confused', 'uncertain',
    'unsure', 'unclear', "can't decide", 'lost', 'doubt',
    'wondering', 'question', 'puzzled', 'torn'
  ],

  analytical: [
    'analyze', 'logic', 'reason', 'because', 'therefore', 'fact',
    'think', 'consider', 'evaluate', 'assess', 'examine',
    'data', 'evidence', 'proof', 'conclude'
  ],

  intuitive: [
    'feel', 'sense', 'gut', 'intuition', 'instinct', 'vibe',
    'just know', 'something tells me', 'heart', 'soul',
    'inner voice', 'hunch', 'feeling'
  ],

  binary: [
    'always', 'never', 'everyone', 'no one', 'everything', 'nothing',
    'all', 'none', 'every', 'completely', 'totally', 'absolutely',
    'must', 'have to', 'should'
  ],

  nuanced: [
    'both', 'and', 'however', 'although', 'complex', 'depends',
    'sometimes', 'often', 'usually', 'partly', 'somewhat',
    'on one hand', 'but also', 'perspective'
  ],

  meta_cognitive: [
    'thinking about', 'realize', 'notice', 'aware', 'recognize',
    'understand now', 'see that', 'it occurs to me', 'dawned on me',
    'reflecting', 'observing myself', 'watching'
  ],

  pattern_seeking: [
    'pattern', 'again', 'repeating', 'same', 'familiar',
    'cycle', 'always do', 'every time', 'tendency', 'habit',
    'keeps happening', 'theme', 'recurring'
  ],

  integration: [
    'together', 'whole', 'complete', 'integrate', 'unify',
    'connect', 'synthesis', 'balance', 'harmony', 'align',
    'merge', 'combine', 'both/and'
  ],

  // =========================================================================
  // RELATIONAL INDICATORS
  // =========================================================================
  trust: [
    'trust', 'safe', 'comfortable', 'open', 'honest', 'genuine',
    'authentic', 'real', 'true', 'reliable', 'depend',
    'count on', 'believe in'
  ],

  vulnerability: [
    'vulnerable', 'exposed', 'admit', 'confess', 'reveal',
    'open up', 'share', 'scared to say', 'hard to admit',
    'embarrassed', 'ashamed', 'afraid to'
  ],

  defensiveness: [
    'but', 'actually', "don't understand", 'not what i meant',
    "that's not", 'you always', "you don't", 'whatever',
    'fine', 'okay fine', 'never mind'
  ],

  // =========================================================================
  // MOTIVATIONAL PATTERNS
  // =========================================================================
  approach: [
    'want', 'desire', 'pursue', 'seek', 'achieve', 'strive',
    'reach', 'get', 'gain', 'attain', 'toward', 'aim',
    'goal', 'dream', 'hope'
  ],

  avoidance: [
    'avoid', 'escape', 'prevent', 'stop', "don't want",
    'away from', 'get rid of', 'leave', 'run', 'hide',
    'protect from', 'fear of'
  ],

  urgency: [
    'urgent', 'now', 'immediately', 'asap', 'hurry', 'rush',
    'right away', 'emergency', "can't wait", 'desperate',
    'critical', 'time sensitive'
  ],

  purpose: [
    'purpose', 'mission', 'calling', 'meant to', 'goal',
    'destiny', 'path', 'journey', 'reason', 'why i',
    'what i was born to', 'life work'
  ],

  // =========================================================================
  // AGENCY INDICATORS
  // =========================================================================
  high_agency: [
    'i will', "i'm going to", 'i can', 'i choose', 'i decide',
    'i want', 'i need to', 'i must', 'my choice', 'my decision',
    'taking control', 'i am able'
  ],

  low_agency: [
    "i can't", 'i have to', 'i should', 'no choice', 'stuck',
    'trapped', 'forced', 'helpless', 'powerless', 'victim',
    'nothing i can do', 'out of my control'
  ],

  // =========================================================================
  // SELF-REFERENCE PATTERNS
  // =========================================================================
  self_critical: [
    'stupid', 'idiot', 'worthless', 'failure', 'loser',
    'not good enough', 'mess up', 'screw up', 'my fault',
    'i always', 'i never', 'what\'s wrong with me'
  ],

  self_compassion: [
    'it\'s okay', 'be kind to myself', 'human', 'learning',
    'growing', 'doing my best', 'allowed to', 'give myself',
    'forgive myself', 'patient with'
  ]
};

// =========================================================================
// ARCHETYPE VISUAL CONFIGURATION
// =========================================================================
export const ARCHETYPE_COLORS = {
  seed: '#8B5CF6',        // Purple - Beginning
  mirror: '#3B82F6',      // Blue - Reflection
  mender: '#10B981',      // Green - Healing
  librarian: '#F59E0B',   // Amber - Memory
  conductor: '#EAB308',   // Yellow - Structure
  companion: '#EC4899',   // Pink - Connection
  guardian: '#7C3AED',    // Deep Purple - Protection
  flamebearer: '#EF4444', // Red - Drive
  guide: '#14B8A6',       // Teal - Integration
};

export const ARCHETYPE_ICONS = {
  seed: '🌱',
  mirror: '🪞',
  mender: '💚',
  librarian: '📚',
  conductor: '🎼',
  companion: '🤝',
  guardian: '🛡️',
  flamebearer: '🔥',
  guide: '✨',
};

export const ARCHETYPE_NAMES = {
  seed: 'Seed',
  mirror: 'Mirror',
  mender: 'Mender',
  librarian: 'Librarian',
  conductor: 'Conductor',
  companion: 'Companion',
  guardian: 'Guardian',
  flamebearer: 'Flamebearer',
  guide: 'Guide',
};

export const ARCHETYPE_DESCRIPTIONS = {
  seed: 'Beginning, exploration, possibility',
  mirror: 'Reflection, truth-seeking, clarity',
  mender: 'Healing, tenderness, repair',
  librarian: 'Memory, pattern, continuity',
  conductor: 'Alignment, structure, organization',
  companion: 'Connection, warmth, togetherness',
  guardian: 'Boundaries, protection, sovereignty',
  flamebearer: 'Purpose, drive, momentum',
  guide: 'Integration, wholeness, wisdom',
};
