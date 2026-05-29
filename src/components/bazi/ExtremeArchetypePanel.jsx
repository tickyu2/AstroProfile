/**
 * ArchetypePanel — Renders for ALL DM Strength levels.
 *
 * 5 bands: Extreme Overweak (<10), Weak (10–40), Balanced (40–60),
 * Strong (60–90), Extreme Overstrong (>90).
 *
 * Renders 4 collapsible sections:
 *   1. Archetype Card — mythic identity with narrative, strengths, needs, tagline
 *   2. Career Recommendation — Ten-God-dependent career mapping
 *   3. Bracelet Prescription — element targets & stone strategy
 *   4. Life Strategy Guide — psychological/metaphysical guidance
 */

import React, { useState } from 'react';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEM_COLORS = {
  Wood: '#22c55e', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#a1a1aa', Water: '#3b82f6',
};

/** Element that generates (母) the given element */
const MOTHER = { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' };

/** Element produced (子) by the given element */
const CHILD = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };

/** Element controlled by the given element */
const CONTROLS = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

/** Element that controls the given element */
const CONTROLLED_BY = { Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth' };

// ============================================================================
// EXTREME ARCHETYPE DATA
// ============================================================================

/**
 * Returns archetype data for DM < 10 based on dominant Ten God category.
 */
const OVERWEAK_ARCHETYPES = {
  output: {
    name: 'The Ultra-Supported Prodigy',
    icon: '🌠',
    color: '#a855f7',
    tagline: 'When supported, they become unstoppable.',
    narrative: 'A person whose internal Qi is nearly zero — but whose responsiveness to external Qi is unmatched. This archetype becomes extraordinary when placed inside the right system, team, or mentorship structure. They are not self-powered; they are amplifiers. With dominant Output energy, their talent explodes under coaching, sponsorship, and institutional backing.',
    strengths: ['Learns at hyperspeed', 'Absorbs coaching like water', 'Performs exceptionally under guided structure', 'Can reach elite levels with the right environment'],
    needs: ['Strong mentors & coaches', 'Stable routines', 'Institutional support', 'External accountability'],
    careers: ['Athlete', 'Performer', 'Model', 'Dancer', 'Actor', 'Musician', 'Content creator', 'Influencer'],
    careerWhy: 'They shine when coached, trained, and externally structured. Elite performers with external support.',
  },
  resource: {
    name: 'The Eternal Student',
    icon: '📚',
    color: '#22c55e',
    tagline: 'Growth through guided absorption.',
    narrative: 'Nearly zero internal Qi meets dominant Resource — a person who grows through learning, mentorship, and accumulation of knowledge. Their sensitivity to teaching is unmatched. They absorb knowledge like dry earth absorbs rain, building deep expertise over decades under patient guidance.',
    strengths: ['Deep learning ability', 'Knowledge retention at extreme levels', 'Mentor magnetism', 'Patient, deep specialization'],
    needs: ['Patient mentors', 'Academic environments', 'Time to develop', 'Intellectual freedom'],
    careers: ['Academic', 'Researcher', 'Analyst', 'Librarian', 'Archivist', 'Psychologist', 'Spiritual practitioner'],
    careerWhy: 'They thrive in learning environments with mentors. Lifelong learners with deep specialization.',
  },
  companion: {
    name: 'The Pack Runner',
    icon: '🤝',
    color: '#3b82f6',
    tagline: 'Strength through the collective.',
    narrative: 'Nearly zero internal Qi but surrounded by Companion energy — this person\'s power comes entirely from their group, team, or tribe. Alone they are fragile. Together they are formidable. They channel group Qi better than anyone, making them irreplaceable in ensemble roles.',
    strengths: ['Team synergy amplifier', 'Loyalty and trust-building', 'Collaborative instinct', 'Peer-powered performance'],
    needs: ['Strong partners & teams', 'Group environments', 'Shared goals and identity', 'Never works alone'],
    careers: ['Team athlete', 'Collaborative creative', 'Group performer', 'Community organizer', 'Partnership-based business'],
    careerWhy: 'They need group structure and peer synergy. Team-based success is their design.',
  },
  authority: {
    name: 'The Reluctant Leader',
    icon: '🏛️',
    color: '#ef4444',
    tagline: 'Forged by pressure, not by choice.',
    narrative: 'Nearly zero internal Qi under dominant Officer pressure — thrust into authority by circumstance, not ambition. This is the crisis specialist: overwhelmed alone, but extraordinarily responsive inside structured, high-pressure systems with clear rules. They rise through duty, not desire.',
    strengths: ['Duty-driven crisis response', 'Institutional awareness', 'Responsive to pressure systems', 'Excels in structured authority'],
    needs: ['Clear mandate', 'Institutional backing', 'Strong advisors', 'Structured chain of command'],
    careers: ['Emergency responder', 'Military roles', 'Structured corporate roles', 'Government positions', 'Compliance & regulation'],
    careerWhy: 'They excel in high-pressure systems with clear rules. Crisis-performance specialists.',
  },
  wealth: {
    name: 'The Lucky Channel',
    icon: '💫',
    color: '#f59e0b',
    tagline: 'Wealth flows through them, not from them.',
    narrative: 'Nearly zero internal Qi yet dominant Wealth — opportunity flows through this person like water through a channel. They don\'t generate wealth; they attract it through presence, charm, and magnetism. Brand ambassadors, influencers, people who embody luck as a skill.',
    strengths: ['Wealth magnetism', 'Brand appeal & social capital', 'Opportunity attraction', 'Environmental sensitivity to value'],
    needs: ['Financial advisors', 'Wealth managers', 'Stable partners', 'Spending discipline'],
    careers: ['Influencer', 'Brand ambassador', 'Sales', 'Marketing', 'PR', 'Entertainment', 'Speculative careers'],
    careerWhy: 'They attract opportunities rather than generate them. Opportunity magnets.',
  },
};

const OVERSTRONG_ARCHETYPES = {
  output: {
    name: 'The Unstoppable Engine',
    icon: '🌋',
    color: '#ef4444',
    tagline: 'Production without limit.',
    narrative: 'Extreme internal Qi meets dominant Output — a creative force that produces at superhuman scale. This person generates endlessly without external fuel. The danger is not burnout but overflow: drowning others in the volume of their creation. They must learn to channel, not contain.',
    strengths: ['Inexhaustible creative stamina', 'Self-powered production machine', 'Dominates any creative field', 'Never needs external motivation'],
    needs: ['Channels for massive output', 'Audience and distribution', 'Collaborators who can keep up', 'Physical release valves'],
    careers: ['Prolific artist', 'Serial entrepreneur', 'High-output content creator', 'Inventor', 'Composer', 'Director'],
    careerWhy: 'Raw creative force that produces at scale. Self-powered engines that never stop.',
  },
  resource: {
    name: 'The Immovable Sage',
    icon: '🗿',
    color: '#22c55e',
    tagline: 'Over-rooted. Seek challenges, not comfort.',
    narrative: 'Extreme internal Qi reinforced by dominant Resource — so deeply rooted that stagnation becomes the threat. This person has immense knowledge and stability but risks becoming a fortress that never opens its gates. They must actively seek disruption to grow.',
    strengths: ['Unshakable expertise', 'Institutional trust', 'Patient beyond measure', 'Deep teaching ability'],
    needs: ['Active disruption', 'New challenges', 'Avoid over-support', 'Must share knowledge outward'],
    careers: ['Master practitioner', 'Senior mentor', 'Institutional builder', 'Policy architect', 'Professor emeritus'],
    careerWhy: 'Deeply rooted wisdom that must be expressed outward to avoid stagnation.',
  },
  companion: {
    name: 'The Lone Wolf',
    icon: '🐺',
    color: '#f97316',
    tagline: 'Independence weaponized.',
    narrative: 'Extreme internal Qi amplified by Companion — fierce independence and competitive drive taken to the absolute extreme. This person doesn\'t just lead; they dominate. The danger is isolation: their strength repels collaborators. They must learn to share power.',
    strengths: ['Extreme independence', 'Competitive dominance', 'Self-reliance under any pressure', 'Commanding presence'],
    needs: ['Worthy rivals', 'Humility practice', 'Partnership skills', 'Channel aggression constructively'],
    careers: ['Solo entrepreneur', 'Competitive athlete', 'Self-made mogul', 'Solo performer', 'Independent consultant'],
    careerWhy: 'Solo operators who dominate through sheer force of will.',
  },
  authority: {
    name: 'The Absolute Commander',
    icon: '👑',
    color: '#a855f7',
    tagline: 'Born to command. Must learn to listen.',
    narrative: 'Extreme internal Qi under dominant Officer — born authority that assumes control instinctively. This person doesn\'t earn leadership; they radiate it. The danger is tyranny: so much power combined with so much structure can become rigid and oppressive.',
    strengths: ['Natural authority presence', 'Extreme pressure tolerance', 'Decisive under crisis', 'Institutional leadership'],
    needs: ['Checks and balances', 'Trusted advisors', 'Empathy development', 'Legacy focus over power focus'],
    careers: ['CEO', 'Military commander', 'Political leader', 'Judge', 'Institutional head', 'Crisis commander'],
    careerWhy: 'Born leaders who naturally assume control at the highest levels.',
  },
  wealth: {
    name: 'The Empire Architect',
    icon: '🏗️',
    color: '#f59e0b',
    tagline: 'Builds empires. Must avoid hoarding.',
    narrative: 'Extreme internal Qi controlling dominant Wealth — the capacity to manage and multiply resources at a scale most people cannot comprehend. This person builds lasting structures of wealth and influence. The danger is obsessive accumulation without distribution.',
    strengths: ['Resource mastery at scale', 'Long-term strategic vision', 'Deal-making instinct', 'Wealth multiplication ability'],
    needs: ['Philanthropic outlets', 'Generosity practice', 'Strategic partners', 'Purpose beyond accumulation'],
    careers: ['Tycoon', 'Investor', 'Business mogul', 'Real estate developer', 'Fund manager', 'Industrial builder'],
    careerWhy: 'Empire builders who create lasting wealth structures at scale.',
  },
};

const WEAK_ARCHETYPES = {
  output: {
    name: 'The Supported Prodigy',
    icon: '🌟',
    color: '#a855f7',
    tagline: 'When supported, they become unstoppable.',
    narrative: 'A weaker DM with dominant Output energy — extraordinary talent that flourishes with coaching, sponsorship, and institutional backing. Not fully self-powered, but highly responsive to external structure. Elite athletes, coached performers, and mentored creatives thrive here.',
    strengths: ['Highly coachable', 'Absorbs training rapidly', 'Thrives with structure', 'Performs under pressure'],
    needs: ['Mentors & coaches', 'Institutional support', 'Structured environments', 'External validation'],
    careers: ['Athlete', 'Performer', 'Actor', 'Musician', 'Content creator', 'Coached professional'],
    careerWhy: 'They shine when coached, trained, and externally structured. Talent that explodes with the right support.',
  },
  resource: {
    name: 'The Eternal Student',
    icon: '📚',
    color: '#22c55e',
    tagline: 'Growth through guided absorption.',
    narrative: 'A weaker DM with dominant Resource — growth through learning, mentorship, and knowledge. They absorb teaching deeply and build expertise over time. Patient development under wise guidance produces remarkable depth.',
    strengths: ['Deep learning ability', 'Knowledge retention', 'Mentor magnetism', 'Patient specialization'],
    needs: ['Patient mentors', 'Academic environments', 'Time to develop', 'Intellectual freedom'],
    careers: ['Academic', 'Researcher', 'Analyst', 'Psychologist', 'Counselor', 'Writer'],
    careerWhy: 'They thrive in learning environments with mentors. Lifelong learners who build deep expertise.',
  },
  companion: {
    name: 'The Pack Runner',
    icon: '🤝',
    color: '#3b82f6',
    tagline: 'Strength through the collective.',
    narrative: 'A weaker DM with dominant Companion — power comes from groups, teams, and partnerships. They channel collective energy effectively and shine in ensemble roles. Team-based success is their natural design.',
    strengths: ['Team synergy', 'Loyalty and trust', 'Collaborative instinct', 'Peer motivation'],
    needs: ['Strong partners', 'Team environments', 'Shared goals', 'Collective identity'],
    careers: ['Team athlete', 'Collaborative creative', 'Community organizer', 'Partnership business'],
    careerWhy: 'They need group structure and peer synergy. Team-based success is their design.',
  },
  authority: {
    name: 'The Reluctant Leader',
    icon: '🏛️',
    color: '#ef4444',
    tagline: 'Forged by pressure, not by choice.',
    narrative: 'A weaker DM under dominant Officer pressure — thrust into authority by circumstance rather than ambition. They rise through duty and institutional need, excelling in structured, high-pressure systems with clear rules.',
    strengths: ['Duty-driven', 'Responsive to pressure', 'Institutional awareness', 'Crisis leadership'],
    needs: ['Clear mandate', 'Institutional backing', 'Strong advisors', 'Structured authority'],
    careers: ['Government roles', 'Structured corporate', 'Compliance', 'Emergency response', 'Legal'],
    careerWhy: 'They excel in high-pressure systems with clear rules and institutional backing.',
  },
  wealth: {
    name: 'The Lucky Channel',
    icon: '💫',
    color: '#f59e0b',
    tagline: 'Wealth flows through them, not from them.',
    narrative: 'A weaker DM with dominant Wealth — opportunity flows through this person via presence and social connection. They attract wealth through charm, networking, and environmental awareness rather than brute force.',
    strengths: ['Wealth magnetism', 'Social capital', 'Opportunity attraction', 'Brand appeal'],
    needs: ['Financial advisors', 'Stable partners', 'Spending discipline', 'Wealth managers'],
    careers: ['Sales', 'Marketing', 'Influencer', 'Brand ambassador', 'PR', 'Entertainment'],
    careerWhy: 'They attract opportunities rather than generate them. Natural opportunity magnets.',
  },
};

const BALANCED_ARCHETYPES = {
  output: {
    name: 'The Versatile Creator',
    icon: '🎨',
    color: '#a855f7',
    tagline: 'Flexible creativity that adapts to any medium.',
    narrative: 'A balanced DM with dominant Output — creative flexibility that adapts across disciplines. Neither fragile nor overwhelming, this person can both self-generate and receive support. Multi-disciplinary artists, portfolio careerists, and adaptive performers live here.',
    strengths: ['Adaptability', 'Multi-talent', 'Creative flexibility', 'Balanced expression'],
    needs: ['Variety', 'Multiple outlets', 'Avoid over-specialization', 'Cross-pollination'],
    careers: ['Multi-discipline creative', 'Designer', 'Writer-director', 'Portfolio careerist', 'Teacher-artist'],
    careerWhy: 'Flexible creativity that adapts to any medium. Multi-disciplinary talent.',
  },
  resource: {
    name: 'The Adaptive Learner',
    icon: '🔬',
    color: '#22c55e',
    tagline: 'Steady growth through continuous learning.',
    narrative: 'A balanced DM with dominant Resource — steady growth through continuous, self-directed learning. They combine personal drive with receptivity to teaching, making them effective interdisciplinary thinkers and late bloomers.',
    strengths: ['Continuous growth', 'Cross-domain thinking', 'Resilient learning', 'Practical wisdom'],
    needs: ['New challenges', 'Diverse inputs', 'Mentorship both ways', 'Applied learning'],
    careers: ['Consultant', 'Cross-functional lead', 'Educator', 'Interdisciplinary researcher'],
    careerWhy: 'Continuous learners who bridge disciplines. Practical wisdom applied across domains.',
  },
  companion: {
    name: 'The Adaptive Navigator',
    icon: '🧭',
    color: '#3b82f6',
    tagline: 'Maximum flexibility through balance.',
    narrative: 'A balanced DM with dominant Companion — maximum flexibility and environmental reading. Generalists, portfolio careerists, and people who thrive by adapting to circumstances. They lead through consensus, not force.',
    strengths: ['Flexibility', 'Environmental reading', 'Balanced judgment', 'Steady growth'],
    needs: ['Diverse opportunities', 'Room to explore', 'Avoid narrow specialization', 'Periodic reinvention'],
    careers: ['Generalist', 'Manager', 'Entrepreneur', 'Consultant', 'Mediator'],
    careerWhy: 'Maximum flexibility. Generalists who thrive by reading the environment and adapting.',
  },
  authority: {
    name: 'The Steady Commander',
    icon: '⚖️',
    color: '#ef4444',
    tagline: 'Authority through balance, not force.',
    narrative: 'A balanced DM with dominant Officer — authority that comes from fairness and consistency rather than raw power. They make good managers, mediators, and institutional leaders who command respect through reliability.',
    strengths: ['Fair leadership', 'Consistency', 'Institutional trust', 'Balanced authority'],
    needs: ['Clear structure', 'Team respect', 'Avoid burnout', 'Maintain boundaries'],
    careers: ['Manager', 'HR director', 'Mediator', 'Policy maker', 'School principal', 'Judge'],
    careerWhy: 'Fair authority through consistency. Institutional leaders who earn respect.',
  },
  wealth: {
    name: 'The Steady Builder',
    icon: '🏠',
    color: '#f59e0b',
    tagline: 'Building wealth through patience and consistency.',
    narrative: 'A balanced DM with dominant Wealth — steady accumulation through patience, discipline, and consistent effort. Not flashy but deeply reliable. They build lasting structures of value through methodical work.',
    strengths: ['Patience', 'Financial discipline', 'Consistent effort', 'Long-term vision'],
    needs: ['Clear goals', 'Patient growth', 'Avoid get-rich-quick', 'Strategic planning'],
    careers: ['Finance', 'Accounting', 'Real estate', 'Small business owner', 'Investment advisor'],
    careerWhy: 'Steady builders who accumulate through patience and consistency.',
  },
};

const STRONG_ARCHETYPES = {
  output: {
    name: 'The Creative Powerhouse',
    icon: '🔥',
    color: '#ef4444',
    tagline: 'Production without burnout.',
    narrative: 'A strong DM with dominant Output — raw creative force that produces at scale without external fuel. Prolific artists, high-output entrepreneurs, and performers who generate endlessly. Self-powered and self-directed.',
    strengths: ['Prolific output', 'Stamina', 'Creative endurance', 'Self-driven production'],
    needs: ['Creative outlets', 'Audience', 'Channels for output', 'Avoid stagnation'],
    careers: ['Prolific artist', 'Serial entrepreneur', 'Content creator', 'Director', 'Composer'],
    careerWhy: 'Raw creative force that produces at scale. Self-powered and endlessly productive.',
  },
  resource: {
    name: 'The Grounded Sage',
    icon: '🌳',
    color: '#22c55e',
    tagline: 'Deep roots, wide reach.',
    narrative: 'A strong DM with dominant Resource — deeply rooted wisdom combined with strength to teach and lead. Master practitioners, senior mentors, and institutional builders who share knowledge from a position of strength.',
    strengths: ['Deep expertise', 'Teaching ability', 'Institutional trust', 'Patient authority'],
    needs: ['Avoid over-support', 'Seek challenges', 'Share knowledge', 'Prevent stagnation'],
    careers: ['Master practitioner', 'Senior mentor', 'Professor', 'Institutional builder', 'Author'],
    careerWhy: 'Deep expertise expressed through teaching and institutional leadership.',
  },
  companion: {
    name: 'The Alpha Competitor',
    icon: '⚔️',
    color: '#f97316',
    tagline: 'Independence as a superpower.',
    narrative: 'A strong DM with dominant Companion — fierce independence and competitive drive. Solo entrepreneurs, competitive athletes, and self-made leaders who dominate through sheer force of will and personal conviction.',
    strengths: ['Independence', 'Competitive fire', 'Self-reliance', 'Leadership presence'],
    needs: ['Worthy rivals', 'Clear goals', 'Avoid isolation', 'Channel aggression'],
    careers: ['Solo entrepreneur', 'Competitive athlete', 'Self-made leader', 'Independent consultant'],
    careerWhy: 'Solo operators who dominate through sheer force of will.',
  },
  authority: {
    name: 'The Natural Commander',
    icon: '👑',
    color: '#a855f7',
    tagline: 'Born to lead, built to endure.',
    narrative: 'A strong DM with dominant Officer — born leadership that thrives under authority and pressure. They naturally assume control, handle crisis well, and build lasting institutions. CEOs, military leaders, and political figures.',
    strengths: ['Authority presence', 'Pressure tolerance', 'Decision making', 'Institutional leadership'],
    needs: ['Positions of power', 'Clear hierarchy', 'Respect from peers', 'Legacy building'],
    careers: ['CEO', 'Military leader', 'Political figure', 'Senior executive', 'Crisis commander'],
    careerWhy: 'Born leaders who naturally assume control at the highest levels.',
  },
  wealth: {
    name: 'The Empire Builder',
    icon: '🏗️',
    color: '#f59e0b',
    tagline: 'Builds empires from nothing.',
    narrative: 'A strong DM with dominant Wealth — the capacity to control, manage, and multiply resources at scale. Business moguls, investors, and deal-makers who build lasting wealth structures through force of will.',
    strengths: ['Resource management', 'Business acumen', 'Deal-making', 'Long-term vision'],
    needs: ['Investment opportunities', 'Financial growth', 'Strategic partners', 'Avoid hoarding'],
    careers: ['Tycoon', 'Investor', 'Business mogul', 'Real estate developer', 'Fund manager'],
    careerWhy: 'Empire builders who create lasting wealth structures at scale.',
  },
};

// ============================================================================
// BRACELET PRESCRIPTION DATA
// ============================================================================

function getBraceletPrescription(dmElement, band) {
  const mother = MOTHER[dmElement];
  const child = CHILD[dmElement];
  const controlled = CONTROLS[dmElement];
  const controller = CONTROLLED_BY[dmElement];

  if (band === 'overweak' || band === 'weak') {
    const isExtreme = band === 'overweak';
    return {
      goal: isExtreme ? 'Support the DM directly — stabilize, not activate.' : 'Strengthen the DM — gentle support and nourishment.',
      collapseMode: isExtreme ? 'Critical Collapse' : 'Deficiency',
      targets: [
        { element: mother, role: 'Resource (母)', pct: isExtreme ? 70 : 55, color: ELEM_COLORS[mother] },
        { element: dmElement, role: 'Companion (比)', pct: isExtreme ? 30 : 30, color: ELEM_COLORS[dmElement] },
        ...(!isExtreme ? [{ element: child, role: 'Output (食伤)', pct: 15, color: ELEM_COLORS[child] }] : []),
      ],
      avoid: isExtreme ? [
        { element: child, reason: 'Output — too draining' },
        { element: controlled, reason: 'Wealth — too draining' },
        { element: controller, reason: 'Officer — too oppressive' },
      ] : [
        { element: controller, reason: 'Officer — adds pressure to a weak DM' },
      ],
      stoneStyle: isExtreme ? 'Soft, stable, nurturing stones. Avoid high-Qi activating stones.' : 'Supportive, grounding stones with gentle activation.',
      sequence: 'Start with Resource, end with Companion. Supportive rhythm.',
      wrist: 'Left (吸氣 absorb) — pulls Qi inward to strengthen.',
    };
  }

  if (band === 'balanced') {
    return {
      goal: 'Maintain equilibrium — fine-tune, not overhaul.',
      collapseMode: 'Balanced',
      targets: [
        { element: child, role: 'Output (食伤)', pct: 30, color: ELEM_COLORS[child] },
        { element: mother, role: 'Resource (印)', pct: 25, color: ELEM_COLORS[mother] },
        { element: controlled, role: 'Wealth (财)', pct: 25, color: ELEM_COLORS[controlled] },
        { element: dmElement, role: 'Companion (比)', pct: 20, color: ELEM_COLORS[dmElement] },
      ],
      avoid: [],
      stoneStyle: 'Balanced mix of all elements. Harmonizing stones that maintain equilibrium.',
      sequence: 'Alternating pattern. No single element dominates.',
      wrist: 'Either wrist — balanced Qi flows both ways.',
    };
  }

  // Strong or Overstrong
  const isExtreme = band === 'overstrong';
  return {
    goal: isExtreme ? 'Drain the DM — express, release, exhaust excess Qi.' : 'Channel excess — productive expression and controlled release.',
    collapseMode: isExtreme ? 'Overflow State' : 'Excess',
    targets: [
      { element: child, role: 'Output (食伤)', pct: isExtreme ? 50 : 40, color: ELEM_COLORS[child] },
      { element: controlled, role: 'Wealth (财)', pct: 30, color: ELEM_COLORS[controlled] },
      { element: controller, role: 'Officer (官杀)', pct: isExtreme ? 20 : 15, color: ELEM_COLORS[controller] },
      ...(!isExtreme ? [{ element: mother, role: 'Resource (印)', pct: 15, color: ELEM_COLORS[mother] }] : []),
    ],
    avoid: isExtreme ? [
      { element: mother, reason: 'Resource — feeds excess' },
      { element: dmElement, reason: 'Companion — amplifies overflow' },
    ] : [],
    stoneStyle: isExtreme ? 'Active, expressive, high-Qi stones. Channel excess outward.' : 'Expressive stones with moderate grounding. Productive release.',
    sequence: 'Start with Output, move through Wealth. Channeling rhythm.',
    wrist: 'Right (出氣 release) — pushes Qi outward to express.',
  };
}

// ============================================================================
// LIFE STRATEGY DATA
// ============================================================================

const LIFE_STRATEGIES = {
  overweak: [
    { icon: '🌱', title: 'You are not built to self-generate Qi', text: 'Your power comes from mentors, teams, systems, institutions, structure, and environment. This is not a weakness — it is a design.' },
    { icon: '🧭', title: 'Stop trying to "do it alone"', text: 'You thrive when someone guides you, trains you, structures your path, invests in you. You are an amplifier, not a generator.' },
    { icon: '🧩', title: 'Choose environments, not goals', text: 'Your success depends more on the system you join, the coach you follow, the team you\'re part of, and the structure you adopt — than on personal willpower.' },
    { icon: '🔥', title: 'Avoid high-pressure independence', text: 'Solo entrepreneurship, unstructured careers, chaotic environments, and self-directed paths drain you instantly. Avoid them.' },
    { icon: '🌟', title: 'With support, you outperform Strong DM charts', text: 'Weak DM charts often produce prodigies, performers, influencers, athletes, and public figures — because they channel external Qi better than anyone.' },
  ],
  weak: [
    { icon: '🌱', title: 'Seek supportive environments', text: 'You perform best with structure, mentorship, and institutional backing. Find the right team and coach — they multiply your natural talent.' },
    { icon: '🧭', title: 'Build partnerships before going solo', text: 'Your strength grows through collaboration. Solo paths are possible but harder — always have a support network in place first.' },
    { icon: '🧩', title: 'Your sensitivity is a strength', text: 'You absorb and respond to environmental Qi better than strong DM charts. Use this to read situations, adapt quickly, and seize opportunities others miss.' },
    { icon: '🔥', title: 'Pace yourself through pressure', text: 'High-pressure periods drain you faster. Build recovery time into your schedule and avoid sustained overextension.' },
    { icon: '🌟', title: 'Growth is your story arc', text: 'Weak DM charts often show dramatic growth over time. Your early years may feel harder, but your trajectory accelerates with the right support.' },
  ],
  balanced: [
    { icon: '⚖️', title: 'Balance is your superpower', text: 'You can both generate and receive. Both lead and follow. Both create and absorb. This flexibility is rare — use it deliberately.' },
    { icon: '🧭', title: 'Avoid extremes', text: 'Your chart is designed for equilibrium. Extreme careers, extreme lifestyles, or extreme personalities will feel unnatural. Seek the middle path.' },
    { icon: '🧩', title: 'Adapt to the situation', text: 'You have the rare ability to read what a situation needs and become it. In a team of strong leaders, you stabilize. In a team of followers, you lead.' },
    { icon: '🔥', title: 'Your risk is mediocrity, not failure', text: 'With no extreme push, you might coast. Consciously choose challenges and growth edges — balance should fuel exploration, not complacency.' },
    { icon: '🌟', title: 'You are the universal adapter', text: 'Balanced charts succeed in the widest range of careers and relationships. Your challenge is choosing, not qualifying.' },
  ],
  strong: [
    { icon: '🔥', title: 'You are self-powered', text: 'Your internal Qi is substantial. You can drive projects, lead teams, and sustain effort without external support. Channel this productively.' },
    { icon: '🧭', title: 'Seek challenges, not comfort', text: 'You grow through resistance and competition. Comfortable, supportive environments risk stagnation. Push yourself toward growth edges.' },
    { icon: '🧩', title: 'Express outward', text: 'Your Qi needs productive outlets — creation, leadership, competition, service. Without expression channels, excess energy becomes frustration.' },
    { icon: '⚖️', title: 'Watch for stubbornness', text: 'Strong DM charts can become rigid. Practice flexibility, listen to others, and remain open to course corrections.' },
    { icon: '🌟', title: 'Your strength attracts responsibility', text: 'People naturally look to you for leadership and decisions. Embrace this, but learn to delegate and trust others with important tasks.' },
  ],
  overstrong: [
    { icon: '🌋', title: 'You are an engine with no off switch', text: 'Your internal Qi is overwhelming. The challenge is not generating power — it\'s channeling it without destroying yourself or others.' },
    { icon: '🧭', title: 'Seek resistance, not support', text: 'You thrive when challenged, opposed, tested, and pushed. Comfort zones become stagnation traps for you.' },
    { icon: '🧩', title: 'Express outward constantly', text: 'Your excess Qi must flow out through creation, leadership, competition, or service. Bottled energy becomes destructive.' },
    { icon: '🔥', title: 'Avoid over-supportive environments', text: 'Too much Resource or Companion energy makes you rigid, stubborn, or explosive. Seek healthy friction and opposition.' },
    { icon: '🌟', title: 'Your greatest danger is your greatest gift', text: 'Extreme DM strength can build empires or burn bridges. The difference is conscious channeling. Learn when to push and when to release.' },
  ],
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function SectionHeader({ title, subtitle, expanded, onToggle, borderColor }) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="text-left">
        <div className="text-[11px] font-bold text-white uppercase tracking-wider">{title}</div>
        {subtitle && <div className="text-[9px] text-white/50 mt-0.5">{subtitle}</div>}
      </div>
      <span className="text-white/40 text-xs">{expanded ? '▲' : '▼'}</span>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExtremeArchetypePanel({ dmElement, dmScore, isYang, userTfq }) {
  const [expandedSections, setExpandedSections] = useState({ card: true, career: false, bracelet: false, strategy: false });

  if (dmScore == null || dmElement == null) return null;

  const toggle = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Determine band
  const band = dmScore < 10 ? 'overweak' : dmScore < 40 ? 'weak' : dmScore < 60 ? 'balanced' : dmScore < 90 ? 'strong' : 'overstrong';
  const BAND_CONFIG = {
    overweak:   { label: 'Extreme Overweak',  color: '#ef4444', archetypes: OVERWEAK_ARCHETYPES },
    weak:       { label: 'Weak',              color: '#f97316', archetypes: WEAK_ARCHETYPES },
    balanced:   { label: 'Balanced',          color: '#3b82f6', archetypes: BALANCED_ARCHETYPES },
    strong:     { label: 'Strong',            color: '#22c55e', archetypes: STRONG_ARCHETYPES },
    overstrong: { label: 'Extreme Overstrong', color: '#a855f7', archetypes: OVERSTRONG_ARCHETYPES },
  };
  const config = BAND_CONFIG[band];
  const bandLabel = config.label;
  const bandColor = config.color;

  // Determine dominant Ten God category from TFQ
  const catElements = {
    output: CHILD[dmElement],
    resource: MOTHER[dmElement],
    companion: dmElement,
    authority: CONTROLLED_BY[dmElement],
    wealth: CONTROLS[dmElement],
  };
  const catQi = {};
  Object.entries(catElements).forEach(([cat, el]) => { catQi[cat] = userTfq?.[el] || 0; });
  const dominantCat = Object.entries(catQi).sort((a, b) => b[1] - a[1])[0]?.[0] || 'output';

  const archetypes = config.archetypes;
  const arch = archetypes[dominantCat] || archetypes.output;
  const prescription = getBraceletPrescription(dmElement, band);
  const lifeStrategy = LIFE_STRATEGIES[band];
  const allCats = Object.entries(catQi).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-xl border overflow-hidden mt-4" style={{ borderColor: bandColor + '30' }}>
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-white/10" style={{ backgroundColor: bandColor + '10' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{arch.icon}</span>
          <div>
            <div className="text-sm font-bold" style={{ color: bandColor }}>
              DM Archetype — {bandLabel}
            </div>
            <div className="text-[10px] text-white/60 mt-0.5">
              DM Strength <span className="font-bold text-white">{dmScore.toFixed(0)}</span>/100 ·{' '}
              <span style={{ color: ELEM_COLORS[dmElement] }} className="font-semibold">{isYang ? 'Yang' : 'Yin'} {dmElement}</span> ·{' '}
              Dominant: {archetypes[dominantCat]?.name || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 1: Archetype Card ── */}
      <SectionHeader
        title="1. Archetype Card"
        subtitle={`${arch.name} — "${arch.tagline}"`}
        expanded={expandedSections.card}
        onToggle={() => toggle('card')}
        borderColor={arch.color}
      />
      {expandedSections.card && (
        <div className="px-4 py-3 space-y-3 border-b border-white/5">
          {/* Identity banner */}
          <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: arch.color + '10', border: `1px solid ${arch.color}30` }}>
            <span className="text-3xl">{arch.icon}</span>
            <div>
              <div className="text-[13px] font-bold" style={{ color: arch.color }}>{arch.name}</div>
              <div className="text-[10px] text-white/50">{bandLabel} · {isYang ? 'Yang' : 'Yin'} {dmElement} · Dominant {dominantCat.charAt(0).toUpperCase() + dominantCat.slice(1)}</div>
            </div>
          </div>
          {/* Narrative */}
          <div className="text-[10px] text-white/80 leading-relaxed">{arch.narrative}</div>
          {/* Strengths + Needs grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/20 bg-green-900/[0.06] p-2.5">
              <div className="text-[9px] font-bold text-green-400 mb-1 uppercase tracking-wider">Strengths</div>
              {arch.strengths.map(s => (
                <div key={s} className="text-[9px] text-white/70 mb-0.5">+ {s}</div>
              ))}
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-900/[0.06] p-2.5">
              <div className="text-[9px] font-bold text-amber-400 mb-1 uppercase tracking-wider">Needs</div>
              {arch.needs.map(n => (
                <div key={n} className="text-[9px] text-white/70 mb-0.5">! {n}</div>
              ))}
            </div>
          </div>
          {/* Tagline */}
          <div className="text-center py-2 rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="text-[11px] font-semibold text-white/90 italic">"{arch.tagline}"</div>
          </div>
        </div>
      )}

      {/* ── Section 2: Career Recommendation ── */}
      <SectionHeader
        title="2. Career Recommendation"
        subtitle="Ten-God-dependent career mapping"
        expanded={expandedSections.career}
        onToggle={() => toggle('career')}
        borderColor="#f59e0b"
      />
      {expandedSections.career && (
        <div className="px-4 py-3 space-y-3 border-b border-white/5">
          {/* Dominant career block */}
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: arch.color + '30' }}>
            <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: arch.color + '10' }}>
              <span className="text-lg">{arch.icon}</span>
              <div>
                <div className="text-[11px] font-bold" style={{ color: arch.color }}>{arch.name}</div>
                <div className="text-[9px] text-white/50">Dominant: {dominantCat.charAt(0).toUpperCase() + dominantCat.slice(1)} ({catQi[dominantCat]?.toFixed(3)} Qi)</div>
              </div>
            </div>
            <div className="px-3 py-2 space-y-1.5">
              <div className="text-[10px] text-white/80">{arch.careerWhy}</div>
              <div className="flex flex-wrap gap-1">
                {arch.careers.map(c => (
                  <span key={c} className="text-[9px] px-2 py-0.5 rounded-full border border-white/15 bg-white/[0.04] text-white/80">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* All categories ranked */}
          <div className="text-[9px] font-bold text-white/50 uppercase tracking-wider mt-2">All Career Forces — Ranked by Qi</div>
          {allCats.map(([catKey, qi]) => {
            const a = archetypes[catKey];
            if (!a) return null;
            const isDominant = catKey === dominantCat;
            return (
              <div key={catKey} className={`rounded-lg border px-3 py-2 ${isDominant ? '' : 'border-white/8 bg-white/[0.01]'}`}
                style={isDominant ? { borderColor: a.color + '40', backgroundColor: a.color + '08' } : undefined}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{a.icon}</span>
                    <div>
                      <span className="text-[10px] font-bold" style={{ color: a.color }}>{a.name}</span>
                      <span className="text-[9px] text-white/40 ml-1.5">{catKey}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/60">{qi.toFixed(3)} Qi</div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {a.careers.slice(0, 4).map(c => (
                    <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/60">{c}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Section 3: Bracelet Prescription ── */}
      <SectionHeader
        title="3. Bracelet Prescription"
        subtitle={`${prescription.collapseMode} — ${prescription.goal}`}
        expanded={expandedSections.bracelet}
        onToggle={() => toggle('bracelet')}
        borderColor="#ec4899"
      />
      {expandedSections.bracelet && (
        <div className="px-4 py-3 space-y-3 border-b border-white/5">
          {/* Goal */}
          <div className="rounded-lg border border-pink-500/20 bg-pink-900/[0.06] px-3 py-2">
            <div className="text-[9px] font-bold text-pink-400 uppercase tracking-wider mb-1">Primary Goal</div>
            <div className="text-[10px] text-white/80">{prescription.goal}</div>
            <div className="text-[9px] text-white/50 mt-1">Collapse Mode: <span className="text-pink-300 font-semibold">{prescription.collapseMode}</span></div>
          </div>

          {/* Element Targets */}
          <div>
            <div className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-1.5">Element Targets</div>
            <div className="space-y-1">
              {prescription.targets.map(t => (
                <div key={t.element} className="flex items-center justify-between rounded px-2.5 py-1.5 bg-white/[0.03] border border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.element}</span>
                    <span className="text-[9px] text-white/50">{t.role}</span>
                  </div>
                  <span className="text-[11px] font-bold text-white">{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid */}
          <div>
            <div className="text-[9px] font-bold text-red-400/70 uppercase tracking-wider mb-1.5">Avoid</div>
            <div className="space-y-0.5">
              {prescription.avoid.map(a => (
                <div key={a.element} className="flex items-center gap-2 text-[9px] text-red-300/70 px-2">
                  <span className="text-red-500">✕</span>
                  <span className="font-semibold" style={{ color: ELEM_COLORS[a.element] }}>{a.element}</span>
                  <span className="text-white/40">— {a.reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2 text-[9px]">
            <div className="rounded border border-white/10 bg-white/[0.02] p-2">
              <div className="font-bold text-white/50 mb-0.5">Stone Style</div>
              <div className="text-white/70">{prescription.stoneStyle}</div>
            </div>
            <div className="rounded border border-white/10 bg-white/[0.02] p-2">
              <div className="font-bold text-white/50 mb-0.5">Sequence</div>
              <div className="text-white/70">{prescription.sequence}</div>
            </div>
            <div className="rounded border border-white/10 bg-white/[0.02] p-2">
              <div className="font-bold text-white/50 mb-0.5">Wrist</div>
              <div className="text-white/70">{prescription.wrist}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 4: Life Strategy Guide ── */}
      <SectionHeader
        title="4. Life Strategy Guide"
        subtitle={band === 'overweak' || band === 'weak' ? 'Amplifier design — external power' : band === 'balanced' ? 'Adaptive design — flexibility as strength' : 'Engine design — channel the power'}
        expanded={expandedSections.strategy}
        onToggle={() => toggle('strategy')}
        borderColor="#22d3ee"
      />
      {expandedSections.strategy && (
        <div className="px-4 py-3 space-y-2">
          {lifeStrategy.map((item, i) => (
            <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{item.icon}</span>
                <span className="text-[10px] font-bold text-cyan-300">{i + 1}. {item.title}</span>
              </div>
              <div className="text-[9px] text-white/70 leading-relaxed ml-6">{item.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
