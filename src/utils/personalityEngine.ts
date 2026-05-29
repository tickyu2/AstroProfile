// ============================================================================
// PERSONALITY ENGINE — BaZi-MBTI Hybrid Personality Generator
// ============================================================================
// Maps Ten Gods profiles to MBTI types and generates narrative personality
// reports combining BaZi elemental analysis with Western personality
// frameworks.
// ============================================================================

import type { TenGodProfile, TenGodKey } from './tenGodsEngine';

// ============================================================================
// TYPES
// ============================================================================

export interface MBTIAxes {
  ie: 'I' | 'E';
  ns: 'N' | 'S';
  tf: 'T' | 'F';
  jp: 'J' | 'P';
}

export interface MBTIProfile {
  type: string;
  axes: MBTIAxes;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  relationalStyle: string;
  workStyle: string;
}

export interface PersonalityReport {
  header: {
    dominantGod: TenGodKey;
    mbtiType: string;
    summary: string;
  };
  sections: {
    corePersonality: string;
    strengths: string[];
    weaknesses: string[];
    worldview: string;
    interactionStyle: string;
    emotionalPatterns: string;
    workStyle: string;
    stressPatterns: string;
    growthPath: string;
  };
}

// ============================================================================
// MBTI TYPE PROFILES
// ============================================================================

interface MBTITypeData {
  strengths: string[];
  weaknesses: string[];
  relationalStyle: string;
  workStyle: string;
}

const MBTI_PROFILES: Record<string, MBTITypeData> = {
  INTJ: {
    strengths: ['Strategic long-term planning', 'Independent and self-driven', 'Analytical problem solving', 'High standards of competence'],
    weaknesses: ['Can appear cold or dismissive', 'Impatient with inefficiency', 'Overly critical of others', 'Difficulty expressing emotions'],
    relationalStyle: 'Selective and loyal; prefers deep one-on-one connections over wide social circles.',
    workStyle: 'Works best autonomously with clear objectives and minimal oversight.',
  },
  INFJ: {
    strengths: ['Deep empathy and intuition', 'Strong moral compass', 'Creative vision for the future', 'Ability to inspire others'],
    weaknesses: ['Prone to burnout from absorbing others\' emotions', 'Perfectionistic tendencies', 'Can withdraw under stress', 'Difficulty setting boundaries'],
    relationalStyle: 'Seeks meaningful, soulful connections and struggles with superficial interaction.',
    workStyle: 'Thrives in purpose-driven roles where they can make a tangible difference.',
  },
  INTP: {
    strengths: ['Exceptional logical analysis', 'Innovative and original thinking', 'Objective and fair-minded', 'Intellectually curious'],
    weaknesses: ['Can be absent-minded about practical matters', 'Struggles with emotional expression', 'Prone to overthinking', 'May neglect social obligations'],
    relationalStyle: 'Values intellectual compatibility and needs ample personal space.',
    workStyle: 'Excels in unstructured environments where they can explore ideas freely.',
  },
  INFP: {
    strengths: ['Rich inner life and creativity', 'Deeply compassionate', 'Authentic and principled', 'Adaptable and open-minded'],
    weaknesses: ['Overly idealistic expectations', 'Sensitive to criticism', 'Difficulty with mundane tasks', 'Can be indecisive'],
    relationalStyle: 'Craves genuine emotional connection and loyalty above all else.',
    workStyle: 'Needs work aligned with personal values; wilts in rigid or impersonal settings.',
  },
  ENTJ: {
    strengths: ['Natural leadership and decisiveness', 'Strategic and goal-oriented', 'Confident under pressure', 'Efficient at organizing people'],
    weaknesses: ['Can be domineering or impatient', 'May overlook emotional nuances', 'Intolerant of perceived incompetence', 'Workaholic tendencies'],
    relationalStyle: 'Leads in relationships; respects partners who can hold their own.',
    workStyle: 'Drives projects forward relentlessly and expects the same from others.',
  },
  ENFJ: {
    strengths: ['Charismatic and inspiring', 'Excellent at reading people', 'Organized and reliable', 'Genuinely invested in others\' growth'],
    weaknesses: ['Can be overly self-sacrificing', 'May manipulate through charm', 'Takes criticism personally', 'Struggles to prioritize own needs'],
    relationalStyle: 'Naturally nurturing; creates harmony and brings out the best in people.',
    workStyle: 'Excels in collaborative, people-centered roles with clear impact.',
  },
  ENTP: {
    strengths: ['Quick-witted and resourceful', 'Thrives on intellectual debate', 'Visionary and innovative', 'Adaptable to new situations'],
    weaknesses: ['Easily bored by routine', 'Can be argumentative', 'May start more than they finish', 'Insensitive to others\' feelings'],
    relationalStyle: 'Energized by stimulating conversation; needs a partner who can keep up.',
    workStyle: 'Best in dynamic environments with novel challenges and brainstorming.',
  },
  ENFP: {
    strengths: ['Enthusiastic and inspiring', 'Deeply curious about people', 'Creative and imaginative', 'Excellent at seeing possibilities'],
    weaknesses: ['Struggles with follow-through', 'Easily overwhelmed by obligations', 'Can be people-pleasing', 'Difficulty with routine tasks'],
    relationalStyle: 'Warm and affirming; forms connections quickly but needs depth to stay engaged.',
    workStyle: 'Flourishes in creative, flexible roles with meaningful human interaction.',
  },
  ISTJ: {
    strengths: ['Dependable and thorough', 'Excellent attention to detail', 'Strong sense of duty', 'Practical and grounded'],
    weaknesses: ['Resistant to change', 'Can be overly rigid', 'Difficulty expressing feelings', 'May judge unconventional approaches'],
    relationalStyle: 'Shows love through actions and reliability rather than words.',
    workStyle: 'Excels in structured environments with clear procedures and expectations.',
  },
  ISFJ: {
    strengths: ['Loyal and devoted', 'Attentive to others\' needs', 'Patient and meticulous', 'Quietly supportive'],
    weaknesses: ['Difficulty saying no', 'Suppresses own needs', 'Resistant to unfamiliar situations', 'Takes on too much responsibility'],
    relationalStyle: 'Deeply caring and protective; remembers the details that matter to loved ones.',
    workStyle: 'Thrives in stable roles where they can serve and support others consistently.',
  },
  ISTP: {
    strengths: ['Cool-headed in crises', 'Skilled hands-on problem solver', 'Independent and self-reliant', 'Observant and analytical'],
    weaknesses: ['Emotionally reserved', 'Can be risk-seeking', 'Difficulty with long-term planning', 'May seem detached or aloof'],
    relationalStyle: 'Shows affection through shared activities and practical help.',
    workStyle: 'Prefers hands-on, flexible work with tangible results and minimal bureaucracy.',
  },
  ISFP: {
    strengths: ['Gentle and considerate', 'Artistic sensibility', 'Lives authentically in the moment', 'Quietly passionate'],
    weaknesses: ['Avoids confrontation', 'Unpredictable under stress', 'Difficulty with abstract planning', 'Can be overly private'],
    relationalStyle: 'Expresses love through actions and creative gestures; needs personal freedom.',
    workStyle: 'Best in flexible, aesthetic, or care-oriented roles with personal autonomy.',
  },
  ESTJ: {
    strengths: ['Organized and efficient', 'Clear communicator', 'Takes charge naturally', 'Committed to standards'],
    weaknesses: ['Can be inflexible and bossy', 'Impatient with ambiguity', 'May dismiss feelings as irrelevant', 'Overly focused on rules'],
    relationalStyle: 'Provides structure and stability; expresses care through responsibility.',
    workStyle: 'Drives results through clear processes, delegation, and accountability.',
  },
  ESFJ: {
    strengths: ['Warm and supportive', 'Strong social awareness', 'Reliable and conscientious', 'Creates inclusive environments'],
    weaknesses: ['Overly dependent on approval', 'Avoids necessary conflict', 'Can be controlling through care', 'Sensitive to social rejection'],
    relationalStyle: 'Nurtures through practical care and social inclusion; needs appreciation.',
    workStyle: 'Excels in team-oriented roles with clear social purpose and recognition.',
  },
  ESTP: {
    strengths: ['Energetic and action-oriented', 'Excellent at reading situations', 'Persuasive and charming', 'Thrives under pressure'],
    weaknesses: ['Impatient with theory', 'Risk-prone and impulsive', 'May overlook long-term consequences', 'Difficulty with routine commitments'],
    relationalStyle: 'Exciting and spontaneous; keeps things lively but may resist deep vulnerability.',
    workStyle: 'Best in fast-paced environments requiring quick decisions and adaptability.',
  },
  ESFP: {
    strengths: ['Magnetic and fun-loving', 'Generous and warm-hearted', 'Observant and present', 'Natural entertainer'],
    weaknesses: ['Avoids serious or negative topics', 'Difficulty with long-term planning', 'Easily distracted', 'Sensitive to criticism'],
    relationalStyle: 'Brings joy and spontaneity; needs a partner who appreciates living in the moment.',
    workStyle: 'Thrives in social, hands-on roles with variety and positive energy.',
  },
};

// ============================================================================
// TEN GOD PERSONALITY NARRATIVES
// ============================================================================

const GOD_NARRATIVES: Record<TenGodKey, string> = {
  friend:
    'You possess a strong sense of self-identity and gravitate toward equals. Your personality radiates steadiness and self-assurance, drawing people who share your values and temperament.',
  robWealth:
    'You are fiercely competitive and driven to prove yourself through action. Your charisma commands attention, and you thrive when challenging the status quo or outperforming rivals.',
  eatingGod:
    'You express yourself with grace and creative ease. A natural artist or communicator, you find joy in sharing ideas, crafting beauty, and bringing a gentle warmth to everything you touch.',
  hurtingOfficer:
    'You are bold, outspoken, and intellectually rebellious. Conventional wisdom rarely satisfies you — you need to test, question, and reinvent. Your brilliance shines brightest when you break new ground.',
  directWealth:
    'You are methodical, responsible, and focused on tangible results. You build wealth and stability through diligence and careful planning, earning trust through consistent follow-through.',
  indirectWealth:
    'You are entrepreneurial, socially agile, and drawn to opportunity. Resourceful and generous, you navigate complex social and financial landscapes with instinctive ease.',
  directOfficer:
    'You embody discipline, integrity, and respect for structure. Others look to you for moral clarity and dependable leadership. You lead by example and hold yourself to exacting standards.',
  sevenKillings:
    'You are intense, ambitious, and unafraid of power. Your drive to dominate and transform is relentless — you thrive in high-stakes environments where lesser wills falter.',
  directResource:
    'You are thoughtful, scholarly, and drawn to traditional wisdom. You absorb knowledge deeply and express yourself with precision, preferring substance over flash.',
  indirectResource:
    'You are unconventional, introspective, and drawn to hidden knowledge. Your mind works in leaps and patterns others miss, giving you a unique and sometimes enigmatic perspective.',
};

// ============================================================================
// WORLDVIEW MAPPINGS
// ============================================================================

const GOD_WORLDVIEW: Record<TenGodKey, string> = {
  friend:
    'Values loyalty, equality, and self-reliance above all. The world is best navigated among trusted peers who share a common code.',
  robWealth:
    'Values freedom, competition, and personal sovereignty. Life is a contest, and respect is earned through bold action and decisive wins.',
  eatingGod:
    'Values beauty, self-expression, and the pleasures of creation. The world is a canvas — meaning comes from what you bring into it.',
  hurtingOfficer:
    'Values truth, innovation, and intellectual independence. The world improves only when its assumptions are challenged and its boundaries pushed.',
  directWealth:
    'Values stability, responsibility, and material security. The good life is built through discipline, honest work, and careful stewardship.',
  indirectWealth:
    'Values opportunity, social connection, and generosity. The world rewards those who move nimbly, share freely, and seize the moment.',
  directOfficer:
    'Values order, honor, and public service. Society depends on principled people who uphold standards and lead with moral authority.',
  sevenKillings:
    'Values power, transformation, and decisive action. The world belongs to those with the will to reshape it.',
  directResource:
    'Values knowledge, tradition, and intellectual depth. Understanding comes through patient study and respect for those who came before.',
  indirectResource:
    'Values insight, originality, and hidden truth. The most important knowledge lies beneath the surface, accessible only to those who think differently.',
};

// ============================================================================
// INTERACTION STYLE MAPPINGS
// ============================================================================

const GOD_INTERACTION: Record<TenGodKey, string> = {
  friend:
    'Relates as an equal among equals — cooperative, fair, and straightforward. Uncomfortable with hierarchy and prefers mutual respect.',
  robWealth:
    'Relates with competitive warmth — generous with allies but quick to assert dominance. Social dynamics are always partly a test of strength.',
  eatingGod:
    'Relates with gentle charm and expressive warmth. Puts others at ease through humor, creativity, and an inviting openness.',
  hurtingOfficer:
    'Relates through provocative honesty and intellectual sparring. Can be abrasive, but earns respect through sheer originality and fearlessness.',
  directWealth:
    'Relates through dependability and practical support. Shows care by being useful, reliable, and financially responsible.',
  indirectWealth:
    'Relates through social grace and networking. Charismatic and easy-going in groups, connecting people and circulating with effortless charm.',
  directOfficer:
    'Relates with formality, respect, and clear expectations. Earns trust through consistency and principled conduct.',
  sevenKillings:
    'Relates with intensity and directness. Commands respect through presence and decisiveness — people either follow or step aside.',
  directResource:
    'Relates as a teacher, mentor, or wise counsel. Patient and considerate, offering guidance with warmth and intellectual generosity.',
  indirectResource:
    'Relates selectively and on their own terms. Can appear distant or eccentric, but those who earn their trust find a uniquely insightful companion.',
};

// ============================================================================
// EMOTIONAL PATTERNS MAPPINGS
// ============================================================================

const GOD_EMOTIONS: Record<TenGodKey, string> = {
  friend:
    'Processes emotions internally with stoic self-reliance. Rarely asks for help, preferring to work through feelings independently before sharing.',
  robWealth:
    'Channels emotions into action and competition. Frustration becomes fuel; vulnerability is quickly converted into determination.',
  eatingGod:
    'Flows with emotions freely and expressively. Finds catharsis through creative output — writing, art, cooking, or any form of making.',
  hurtingOfficer:
    'Processes emotions through sharp analysis and verbal expression. May intellectualize feelings or use wit as a defense mechanism.',
  directWealth:
    'Manages emotions with discipline and restraint. Focuses on practical solutions rather than dwelling on feelings.',
  indirectWealth:
    'Diffuses emotional tension through social engagement and optimism. Prefers to keep things light and redirect negative energy outward.',
  directOfficer:
    'Contains emotions behind a composed exterior. Feels deeply but expresses through duty and responsible action rather than open vulnerability.',
  sevenKillings:
    'Experiences emotions with volcanic intensity. Can suppress for long periods, then release with overwhelming force when pushed too far.',
  directResource:
    'Processes emotions thoughtfully and gradually. Seeks comfort in familiar routines, wise counsel, and the solace of learning.',
  indirectResource:
    'Experiences emotions as private, sometimes mystical inner events. May struggle to articulate what they feel, retreating into solitude to process.',
};

// ============================================================================
// WORK STYLE MAPPINGS
// ============================================================================

const GOD_WORK: Record<TenGodKey, string> = {
  friend:
    'Works best alongside trusted peers in collaborative, non-hierarchical settings. Consistent and reliable, but needs autonomy to stay engaged.',
  robWealth:
    'Works with competitive intensity and entrepreneurial flair. Thrives when there are clear benchmarks to beat and rewards for outperformance.',
  eatingGod:
    'Works with creative flow and attention to aesthetics. Produces best work when given freedom to explore and express without rigid deadlines.',
  hurtingOfficer:
    'Works with innovative urgency, questioning standard methods and proposing radical improvements. Highly productive but may clash with authority.',
  directWealth:
    'Works systematically with meticulous attention to detail and bottom-line results. Excel at budgeting, planning, and long-term execution.',
  indirectWealth:
    'Works across multiple ventures and social circles simultaneously. Excels in sales, networking, and roles requiring social intelligence and adaptability.',
  directOfficer:
    'Works within clear structures, following protocol and upholding standards. Naturally gravitates toward management, governance, and institutional leadership.',
  sevenKillings:
    'Works with relentless drive and high-pressure tolerance. Excels in turnaround situations, crisis management, and roles demanding ruthless efficiency.',
  directResource:
    'Works methodically with deep expertise. Excels in research, education, and any role requiring mastery of a specialized body of knowledge.',
  indirectResource:
    'Works in bursts of unconventional insight. Best suited for roles requiring pattern recognition, strategic thinking, or creative problem-solving.',
};

// ============================================================================
// STRESS PATTERN MAPPINGS
// ============================================================================

const GOD_STRESS: Record<TenGodKey, string> = {
  friend:
    'Stressed by isolation, betrayal by peers, or situations where their identity and values are undermined. Retreats into rigid self-reliance.',
  robWealth:
    'Stressed by loss of control, public failure, or being outperformed. May become aggressive, reckless, or excessively competitive.',
  eatingGod:
    'Stressed by creative suppression, rigid environments, or emotional invalidation. Becomes withdrawn, lethargic, or escapist.',
  hurtingOfficer:
    'Stressed by censorship, intellectual stagnation, or being forced into conformity. Becomes caustic, rebellious, or self-destructive.',
  directWealth:
    'Stressed by financial instability, disorganization, or broken commitments. Becomes anxious, controlling, or obsessively detail-focused.',
  indirectWealth:
    'Stressed by monotony, social rejection, or being pinned down by obligations. Becomes scattered, impulsive, or superficially charming.',
  directOfficer:
    'Stressed by chaos, moral compromise, or loss of reputation. Becomes rigid, judgmental, or paralyzed by indecision.',
  sevenKillings:
    'Stressed by powerlessness, slow bureaucracy, or perceived weakness. Becomes domineering, paranoid, or explosively confrontational.',
  directResource:
    'Stressed by information overload, intellectual disrespect, or loss of mentorship. Becomes overly cautious, pedantic, or withdrawn.',
  indirectResource:
    'Stressed by forced social conformity, lack of intellectual stimulation, or being misunderstood. Becomes reclusive, paranoid, or coldly detached.',
};

// ============================================================================
// GROWTH PATH MAPPINGS
// ============================================================================

const GOD_GROWTH: Record<TenGodKey, string> = {
  friend:
    'Growth comes through embracing vulnerability, accepting help, and expanding beyond the comfort of familiar peers. Learn to lead, not just belong.',
  robWealth:
    'Growth comes through channeling competitive fire into collaboration and learning to celebrate others\' successes alongside your own.',
  eatingGod:
    'Growth comes through disciplining creative gifts with structure and follow-through. Learn to finish what you start and share your work with the world.',
  hurtingOfficer:
    'Growth comes through tempering brilliance with diplomacy. Learn that influence requires trust, and trust requires restraint.',
  directWealth:
    'Growth comes through loosening control and embracing calculated risk. Not everything valuable can be measured or planned.',
  indirectWealth:
    'Growth comes through deepening commitments and sitting with discomfort rather than networking past it. Depth over breadth.',
  directOfficer:
    'Growth comes through embracing flexibility, accepting imperfection, and learning that the spirit of the law matters more than the letter.',
  sevenKillings:
    'Growth comes through learning patience, cultivating empathy, and understanding that true power includes the power to be gentle.',
  directResource:
    'Growth comes through applying knowledge in the real world. Move from understanding to action, from study to lived experience.',
  indirectResource:
    'Growth comes through grounding unconventional insights in human connection. Share your inner world — let others in.',
};

// ============================================================================
// STRENGTHS / WEAKNESSES BY DOMINANT GOD
// ============================================================================

const GOD_STRENGTHS: Record<TenGodKey, string[]> = {
  friend:        ['Self-assured and grounded', 'Loyal to core principles', 'Calm under pressure', 'Naturally cooperative'],
  robWealth:     ['Boldly competitive', 'Charismatic and magnetic', 'Decisive under pressure', 'Protective of allies'],
  eatingGod:     ['Creatively gifted', 'Emotionally intelligent', 'Warm and approachable', 'Finds joy in everyday life'],
  hurtingOfficer:['Brilliantly innovative', 'Fearlessly honest', 'Intellectually sharp', 'Challenges stagnation'],
  directWealth:  ['Financially astute', 'Methodical and disciplined', 'Trustworthy and consistent', 'Excellent at planning'],
  indirectWealth:['Socially perceptive', 'Entrepreneurial instinct', 'Adaptable and resourceful', 'Generous with connections'],
  directOfficer: ['Principled and honorable', 'Natural leader', 'Reliable under pressure', 'Commands respect effortlessly'],
  sevenKillings: ['Intensely driven', 'Thrives in adversity', 'Strategic and decisive', 'Fearless in pursuit of goals'],
  directResource:['Deeply knowledgeable', 'Patient and thoughtful', 'Excellent mentor', 'Values intellectual rigor'],
  indirectResource:['Uniquely insightful', 'Pattern-recognition genius', 'Independent thinker', 'Sees what others miss'],
};

const GOD_WEAKNESSES: Record<TenGodKey, string[]> = {
  friend:        ['Overly self-reliant', 'Resistant to outside help', 'Can be passive', 'May avoid necessary conflict'],
  robWealth:     ['Aggressively competitive', 'Can be domineering', 'Risk-prone', 'Struggles with vulnerability'],
  eatingGod:     ['Lacks discipline', 'Avoids confrontation', 'Can be self-indulgent', 'Underestimates practical demands'],
  hurtingOfficer:['Abrasive and tactless', 'Dismissive of authority', 'Emotionally volatile', 'Burns bridges unnecessarily'],
  directWealth:  ['Overly cautious', 'Can be rigid', 'Materialistic tendencies', 'Neglects emotional needs'],
  indirectWealth:['Scattered focus', 'Commitment-averse', 'Superficially charming', 'Avoids deep emotional work'],
  directOfficer: ['Inflexible and judgmental', 'Overly concerned with status', 'Suppresses emotions', 'Rigid adherence to rules'],
  sevenKillings: ['Ruthlessly controlling', 'Paranoid under stress', 'Intimidating to others', 'Difficulty trusting'],
  directResource:['Overly cautious', 'Pedantic tendencies', 'Avoids action in favor of study', 'Dependent on mentors or tradition'],
  indirectResource:['Socially withdrawn', 'Emotionally opaque', 'Overthinks decisions', 'Can seem arrogant or eccentric'],
};

// ============================================================================
// SUMMARY TEMPLATES
// ============================================================================

const GOD_SUMMARY: Record<TenGodKey, string> = {
  friend:         'A steady, self-assured individual who values loyalty and peer-based connection.',
  robWealth:      'A bold, competitive spirit who leads through action and thrives on challenge.',
  eatingGod:      'A creative, gentle soul who expresses themselves through beauty and warmth.',
  hurtingOfficer: 'A brilliant rebel who questions everything and pushes boundaries fearlessly.',
  directWealth:   'A disciplined builder who creates security through careful, methodical effort.',
  indirectWealth: 'A resourceful social navigator who turns connections into opportunity.',
  directOfficer:  'A principled leader who upholds order, honor, and institutional integrity.',
  sevenKillings:  'An intense powerhouse who transforms environments through sheer force of will.',
  directResource: 'A thoughtful scholar who finds strength in deep knowledge and patient wisdom.',
  indirectResource:'An unconventional visionary who perceives patterns invisible to others.',
};

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

function getQiShare(profile: TenGodProfile, key: TenGodKey): number {
  return profile.gods[key].shareOfTotalQi;
}

function sumQi(profile: TenGodProfile, ...keys: TenGodKey[]): number {
  return keys.reduce((sum, k) => sum + getQiShare(profile, k), 0);
}

function buildExplanation(axes: MBTIAxes, profile: TenGodProfile): string {
  const companionQi = sumQi(profile, 'friend', 'robWealth').toFixed(2);
  const wealthQi = sumQi(profile, 'directWealth', 'indirectWealth').toFixed(2);
  const ieLine = `I/E: Companion (${companionQi}) ${axes.ie === 'I' ? '>' : '<'} Wealth (${wealthQi}) → ${axes.ie}`;

  const nQi = sumQi(profile, 'indirectResource', 'hurtingOfficer').toFixed(2);
  const sQi = sumQi(profile, 'directResource', 'directWealth').toFixed(2);
  const nsLine = `N/S: IndirectResource+HurtingOfficer (${nQi}) ${axes.ns === 'N' ? '>' : '<'} DirectResource+DirectWealth (${sQi}) → ${axes.ns}`;

  const tQi = sumQi(profile, 'directOfficer', 'sevenKillings', 'directWealth').toFixed(2);
  const fQi = sumQi(profile, 'eatingGod', 'directResource', 'indirectResource').toFixed(2);
  const tfLine = `T/F: Officer+Killings+DirectWealth (${tQi}) ${axes.tf === 'T' ? '>' : '<'} EatingGod+Resources (${fQi}) → ${axes.tf}`;

  const jQi = sumQi(profile, 'directOfficer', 'directWealth').toFixed(2);
  const pQi = sumQi(profile, 'hurtingOfficer', 'indirectWealth').toFixed(2);
  const jpLine = `J/P: DirectOfficer+DirectWealth (${jQi}) ${axes.jp === 'J' ? '>' : '<'} HurtingOfficer+IndirectWealth (${pQi}) → ${axes.jp}`;

  return [ieLine, nsLine, tfLine, jpLine].join('\n');
}

function getSecondaryGod(profile: TenGodProfile): TenGodKey {
  return profile.dominant.length > 1 ? profile.dominant[1] : profile.dominant[0];
}

function buildCorePersonality(profile: TenGodProfile): string {
  const dom = profile.dominant[0];
  const sec = getSecondaryGod(profile);
  const domNarr = GOD_NARRATIVES[dom];
  const secNarr = GOD_NARRATIVES[sec];
  if (dom === sec) return domNarr;
  return `${domNarr} This core nature is tempered by a secondary influence: ${secNarr.charAt(0).toLowerCase()}${secNarr.slice(1)}`;
}

function buildStrengths(profile: TenGodProfile): string[] {
  const dom = profile.dominant[0];
  const sec = getSecondaryGod(profile);
  const primary = GOD_STRENGTHS[dom];
  if (dom === sec) return primary;
  const secondary = GOD_STRENGTHS[sec];
  return [...primary.slice(0, 3), secondary[0]];
}

function buildWeaknesses(profile: TenGodProfile): string[] {
  const dom = profile.dominant[0];
  const sec = getSecondaryGod(profile);
  const primary = GOD_WEAKNESSES[dom];
  if (dom === sec) return primary;
  const secondary = GOD_WEAKNESSES[sec];
  return [...primary.slice(0, 3), secondary[0]];
}

function buildWorldview(profile: TenGodProfile): string {
  return GOD_WORLDVIEW[profile.dominant[0]];
}

function buildInteractionStyle(profile: TenGodProfile): string {
  return GOD_INTERACTION[profile.dominant[0]];
}

function buildEmotionalPatterns(profile: TenGodProfile): string {
  return GOD_EMOTIONS[profile.dominant[0]];
}

function buildWorkStyle(profile: TenGodProfile): string {
  return GOD_WORK[profile.dominant[0]];
}

function buildStressPatterns(profile: TenGodProfile): string {
  return GOD_STRESS[profile.dominant[0]];
}

function buildGrowthPath(profile: TenGodProfile): string {
  return GOD_GROWTH[profile.dominant[0]];
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Computes a BaZi-derived MBTI type from a Ten Gods profile.
 * Maps the relative qi shares of specific god pairings onto the four MBTI axes.
 */
export function computeMBTI(profile: TenGodProfile): MBTIProfile {
  const ie: 'I' | 'E' = sumQi(profile, 'friend', 'robWealth') > sumQi(profile, 'directWealth', 'indirectWealth') ? 'I' : 'E';
  const ns: 'N' | 'S' = sumQi(profile, 'indirectResource', 'hurtingOfficer') > sumQi(profile, 'directResource', 'directWealth') ? 'N' : 'S';
  const tf: 'T' | 'F' = sumQi(profile, 'directOfficer', 'sevenKillings', 'directWealth') > sumQi(profile, 'eatingGod', 'directResource', 'indirectResource') ? 'T' : 'F';
  const jp: 'J' | 'P' = sumQi(profile, 'directOfficer', 'directWealth') > sumQi(profile, 'hurtingOfficer', 'indirectWealth') ? 'J' : 'P';

  const axes: MBTIAxes = { ie, ns, tf, jp };
  const type = `${ie}${ns}${tf}${jp}`;
  const explanation = buildExplanation(axes, profile);
  const typeData = MBTI_PROFILES[type];

  return {
    type,
    axes,
    explanation,
    strengths: typeData.strengths,
    weaknesses: typeData.weaknesses,
    relationalStyle: typeData.relationalStyle,
    workStyle: typeData.workStyle,
  };
}

/**
 * Generates a 1-2 sentence personality narrative based on the dominant Ten God.
 */
export function generatePersonalityNarrative(profile: TenGodProfile): string {
  return GOD_NARRATIVES[profile.dominant[0]];
}

/**
 * Builds a comprehensive personality report combining BaZi Ten Gods analysis
 * with MBTI-style personality profiling.
 */
export function generatePersonalityReport(profile: TenGodProfile): PersonalityReport {
  const mbti = computeMBTI(profile);
  const dominant = profile.dominant[0];

  return {
    header: {
      dominantGod: dominant,
      mbtiType: mbti.type,
      summary: GOD_SUMMARY[dominant],
    },
    sections: {
      corePersonality: buildCorePersonality(profile),
      strengths: buildStrengths(profile),
      weaknesses: buildWeaknesses(profile),
      worldview: buildWorldview(profile),
      interactionStyle: buildInteractionStyle(profile),
      emotionalPatterns: buildEmotionalPatterns(profile),
      workStyle: buildWorkStyle(profile),
      stressPatterns: buildStressPatterns(profile),
      growthPath: buildGrowthPath(profile),
    },
  };
}

// ============================================================================
// PERSONALITY ARCHETYPE
// ============================================================================

export type ArchetypeKey =
  | 'visionary_rebel'
  | 'nurturing_teacher'
  | 'strategic_leader'
  | 'creative_artist'
  | 'practical_manager'
  | 'mystic_seeker'
  | 'warrior_transformer'
  | 'connector_networker'
  | 'independent_maverick';

export interface PersonalityArchetype {
  key: ArchetypeKey;
  label: string;
  summary: string;
  gifts: string[];
  shadows: string[];
}

const ARCHETYPE_MAP: Record<string, PersonalityArchetype> = {
  hurtingOfficer: {
    key: 'visionary_rebel',
    label: 'The Visionary Rebel',
    summary: 'You challenge norms, disrupt stale systems, and see futures others can\'t yet imagine.',
    gifts: ['Innovation', 'Courage to question', 'Creative problem-solving'],
    shadows: ['Restlessness', 'Authority conflict', 'Over-intensity'],
  },
  eatingGod: {
    key: 'creative_artist',
    label: 'The Creative Artist',
    summary: 'You process life through beauty, feeling, and expression.',
    gifts: ['Empathy', 'Aesthetic sense', 'Emotional intelligence'],
    shadows: ['Over-indulgence', 'Avoidance of discomfort', 'Inconsistency'],
  },
  directResource: {
    key: 'nurturing_teacher',
    label: 'The Nurturing Teacher',
    summary: 'You hold space for others to grow, learn, and feel safe.',
    gifts: ['Patience', 'Supportiveness', 'Deep learning ability'],
    shadows: ['Over-sacrifice', 'Difficulty setting boundaries', 'Over-protection'],
  },
  directOfficer: {
    key: 'strategic_leader',
    label: 'The Strategic Leader',
    summary: 'You bring order, ethics, and structured authority to every situation.',
    gifts: ['Integrity', 'Discipline', 'Institutional trust'],
    shadows: ['Rigidity', 'Perfectionism', 'Difficulty delegating'],
  },
  sevenKillings: {
    key: 'warrior_transformer',
    label: 'The Warrior Transformer',
    summary: 'You move through intensity and crisis to catalyze change.',
    gifts: ['Resilience', 'Bravery', 'Decisiveness under pressure'],
    shadows: ['Chronic stress', 'Rigidity', 'Over-control'],
  },
  directWealth: {
    key: 'practical_manager',
    label: 'The Practical Manager',
    summary: 'You bring order, structure, and reliability to the material world.',
    gifts: ['Discipline', 'Follow-through', 'Stability'],
    shadows: ['Rigidity', 'Over-work', 'Risk aversion'],
  },
  indirectResource: {
    key: 'mystic_seeker',
    label: 'The Mystic Seeker',
    summary: 'You live in patterns, symbols, and inner worlds.',
    gifts: ['Intuition', 'Pattern recognition', 'Depth'],
    shadows: ['Withdrawal', 'Over-idealism', 'Escapism'],
  },
  indirectWealth: {
    key: 'connector_networker',
    label: 'The Connector Networker',
    summary: 'You thrive in movement, opportunity, and human connection.',
    gifts: ['Social intelligence', 'Adaptability', 'Opportunism'],
    shadows: ['Scattered focus', 'Impulsivity', 'Over-extension'],
  },
  friend: {
    key: 'independent_maverick',
    label: 'The Independent Maverick',
    summary: 'You define yourself on your own terms and value autonomy above all.',
    gifts: ['Self-reliance', 'Initiative', 'Courage to stand alone'],
    shadows: ['Stubbornness', 'Difficulty compromising', 'Ego clashes'],
  },
  robWealth: {
    key: 'independent_maverick',
    label: 'The Independent Maverick',
    summary: 'You define yourself through action, competition, and bold initiative.',
    gifts: ['Competitive drive', 'Resourcefulness', 'Bold action'],
    shadows: ['Rivalry', 'Impulsive risk-taking', 'Difficulty sharing credit'],
  },
};

export function generatePersonalityArchetype(
  profile: TenGodProfile,
  mbti: MBTIProfile
): PersonalityArchetype {
  const dominant = Object.values(profile.gods)
    .sort((a, b) => b.shareOfTotalQi - a.shareOfTotalQi)[0];

  return ARCHETYPE_MAP[dominant.key] || {
    key: 'visionary_rebel' as ArchetypeKey,
    label: 'The Visionary Rebel',
    summary: `Your BaZi-MBTI type (${mbti.type}) leans toward innovation, independence, and non-conformity.`,
    gifts: ['Original thinking', 'Flexibility', 'Creative risk-taking'],
    shadows: ['Inconsistency', 'Difficulty with routine', 'Impatience'],
  };
}

// ============================================================================
// LIFE-PATH / DESTINY NARRATIVE
// ============================================================================

export interface LifePathNarrative {
  coreTheme: string;
  earlyLife: string;
  midLife: string;
  laterLife: string;
  keyLessons: string;
}

export function generateLifePathNarrative(profile: TenGodProfile): LifePathNarrative {
  const g = profile.gods;
  const qi = (k: TenGodKey) => g[k].shareOfTotalQi;

  const outputQi = qi('eatingGod') + qi('hurtingOfficer');
  const wealthQi = qi('directWealth') + qi('indirectWealth');
  const officerQi = qi('directOfficer') + qi('sevenKillings');
  const resourceQi = qi('directResource') + qi('indirectResource');
  const companionQi = qi('friend') + qi('robWealth');

  let coreTheme = 'A life path of balancing self, others, and purpose.';
  if (outputQi > wealthQi && outputQi > officerQi)
    coreTheme = 'A life path centered on expression, creativity, and sharing your inner world.';
  else if (wealthQi > outputQi && wealthQi > officerQi)
    coreTheme = 'A life path centered on building, managing, and circulating resources.';
  else if (officerQi > wealthQi && officerQi > outputQi)
    coreTheme = 'A life path centered on responsibility, leadership, and navigating pressure.';
  else if (resourceQi > companionQi)
    coreTheme = 'A life path centered on learning, healing, and supporting others.';
  else if (companionQi > resourceQi)
    coreTheme = 'A life path centered on identity, independence, and defining your own path.';

  return {
    coreTheme,
    earlyLife: resourceQi > outputQi
      ? 'Early life emphasizes learning, adaptation, and absorbing influences from family and environment.'
      : 'Early life emphasizes experimentation, expression, and testing boundaries.',
    midLife: wealthQi + officerQi > outputQi + resourceQi
      ? 'Mid-life focuses on responsibility, work, and building tangible structures in the world.'
      : 'Mid-life focuses on creativity, relationships, and refining your unique contribution.',
    laterLife: resourceQi > wealthQi
      ? 'Later life leans toward teaching, mentoring, and integrating wisdom.'
      : 'Later life leans toward enjoying the fruits of your efforts and simplifying priorities.',
    keyLessons: companionQi > officerQi
      ? 'Key lessons revolve around collaboration, compromise, and balancing independence with connection.'
      : 'Key lessons revolve around balancing duty with self-care and softening rigid expectations.',
  };
}

// ============================================================================
// CAREER SPECIALIZATION ENGINE
// ============================================================================

export interface CareerCluster {
  key: string;
  label: string;
  description: string;
  bestFor: TenGodKey[];
}

export interface CareerProfile {
  dominantClusters: CareerCluster[];
  narrative: string;
}

const CAREER_CLUSTERS: CareerCluster[] = [
  {
    key: 'creative_arts',
    label: 'Creative & Artistic Fields',
    description: 'Design, media, writing, performance, content creation, storytelling.',
    bestFor: ['eatingGod', 'hurtingOfficer', 'indirectResource'],
  },
  {
    key: 'analysis_research',
    label: 'Analysis & Research',
    description: 'Data, research, strategy, systems thinking, investigation.',
    bestFor: ['directResource', 'indirectResource', 'directOfficer'],
  },
  {
    key: 'leadership_management',
    label: 'Leadership & Management',
    description: 'Team leadership, operations, organizational design, executive roles.',
    bestFor: ['directOfficer', 'sevenKillings', 'directWealth'],
  },
  {
    key: 'entrepreneurship_sales',
    label: 'Entrepreneurship & Sales',
    description: 'Startups, business building, sales, negotiation, deal-making.',
    bestFor: ['robWealth', 'indirectWealth', 'friend'],
  },
  {
    key: 'healing_support',
    label: 'Healing & Support',
    description: 'Therapy, coaching, healthcare, education, social work.',
    bestFor: ['directResource', 'eatingGod', 'friend'],
  },
];

export function generateCareerProfile(profile: TenGodProfile): CareerProfile {
  const topGods = Object.values(profile.gods)
    .sort((a, b) => b.shareOfTotalQi - a.shareOfTotalQi)
    .slice(0, 3)
    .map(g => g.key);

  const scoredClusters = CAREER_CLUSTERS.map(cluster => {
    const overlap = cluster.bestFor.filter(g => topGods.includes(g)).length;
    return { cluster, score: overlap };
  }).sort((a, b) => b.score - a.score);

  const dominantClusters = scoredClusters
    .filter(c => c.score > 0)
    .slice(0, 3)
    .map(c => c.cluster);

  const narrative = dominantClusters.length === 0
    ? 'Your chart supports a wide range of paths. Focus on environments that honor your values and energy patterns.'
    : `Your strongest career environments are: ${dominantClusters.map(c => c.label).join(', ')}. These align with your natural Ten Gods strengths and elemental distribution.`;

  return { dominantClusters, narrative };
}

// ============================================================================
// LIFE BLUEPRINT — UNIFIED OUTPUT
// ============================================================================

export interface LifeBlueprint {
  archetype: PersonalityArchetype;
  lifePath: LifePathNarrative;
  career: CareerProfile;
  summary: string;
  highlights: string[];
}

export function generateLifeBlueprint(
  profile: TenGodProfile,
  mbti: MBTIProfile
): LifeBlueprint {
  const archetype = generatePersonalityArchetype(profile, mbti);
  const lifePath = generateLifePathNarrative(profile);
  const career = generateCareerProfile(profile);

  const summary = [
    `You embody the ${archetype.label}, a pattern shaped by your dominant Ten God and elemental distribution.`,
    lifePath.coreTheme,
    career.narrative,
  ].join(' ');

  const highlights = [
    archetype.summary,
    lifePath.keyLessons,
    career.narrative,
  ];

  return { archetype, lifePath, career, summary, highlights };
}
