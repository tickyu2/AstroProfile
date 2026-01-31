/**
 * Tropical Zodiac Constants
 *
 * Centralized constants for the Tropical Seasons visualization.
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

// =============================================================================
// SIGN GLYPHS
// =============================================================================

export const SIGN_GLYPHS: Record<string, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

// =============================================================================
// SIGN TOOLTIPS
// =============================================================================

export interface SignTooltipData {
  season: string;
  element: string;
  mode: string;
  dateRange: string;
  headline: string;
  description: string;
  color: string;
}

export const SIGN_TOOLTIPS: Record<string, SignTooltipData> = {
  Aries: {
    season: 'Spring Equinox',
    element: 'Fire',
    mode: 'Beginning',
    dateRange: 'Mar 21 – Apr 19',
    headline: 'Initiates growth.',
    description: 'Born as light begins increasing. Acts first, leads instinctively, thrives on momentum and new beginnings.',
    color: '#ef4444',
  },
  Taurus: {
    season: 'Mid-Spring',
    element: 'Earth',
    mode: 'Core',
    dateRange: 'Apr 20 – May 20',
    headline: 'Stabilizes growth.',
    description: 'Born when life is flourishing. Builds security, values comfort, and makes progress tangible and lasting.',
    color: '#22c55e',
  },
  Gemini: {
    season: 'Late Spring',
    element: 'Air',
    mode: 'Transition',
    dateRange: 'May 21 – Jun 20',
    headline: 'Connects and adapts.',
    description: 'Born as spring shifts toward summer. Learns quickly, communicates ideas, and bridges people and information.',
    color: '#38bdf8',
  },
  Cancer: {
    season: 'Summer Solstice',
    element: 'Water',
    mode: 'Beginning',
    dateRange: 'Jun 21 – Jul 22',
    headline: 'Protects what has grown.',
    description: 'Born at peak light. Nurtures emotionally, values home and memory, and creates safety through care.',
    color: '#8b5cf6',
  },
  Leo: {
    season: 'Mid-Summer',
    element: 'Fire',
    mode: 'Core',
    dateRange: 'Jul 23 – Aug 22',
    headline: 'Expresses vitality.',
    description: 'Born during full radiance. Leads through warmth, creativity, and confidence; shines by being fully authentic.',
    color: '#ef4444',
  },
  Virgo: {
    season: 'Late Summer',
    element: 'Earth',
    mode: 'Transition',
    dateRange: 'Aug 23 – Sep 22',
    headline: 'Refines and improves.',
    description: 'Born as harvest approaches. Analyzes, organizes, and turns growth into usefulness and service.',
    color: '#22c55e',
  },
  Libra: {
    season: 'Autumn Equinox',
    element: 'Air',
    mode: 'Beginning',
    dateRange: 'Sep 23 – Oct 22',
    headline: 'Initiates balance.',
    description: 'Born at equal light and dark. Seeks harmony, fairness, and partnership; understands life through relationships.',
    color: '#38bdf8',
  },
  Scorpio: {
    season: 'Mid-Autumn',
    element: 'Water',
    mode: 'Core',
    dateRange: 'Oct 23 – Nov 21',
    headline: 'Deepens and transforms.',
    description: 'Born as days darken. Forms intense bonds, uncovers truth, and catalyzes emotional rebirth.',
    color: '#8b5cf6',
  },
  Sagittarius: {
    season: 'Late Autumn',
    element: 'Fire',
    mode: 'Transition',
    dateRange: 'Nov 22 – Dec 21',
    headline: 'Expands perspective.',
    description: 'Born as autumn gives way to winter. Explores meaning, seeks truth, and looks beyond current limits.',
    color: '#ef4444',
  },
  Capricorn: {
    season: 'Winter Solstice',
    element: 'Earth',
    mode: 'Beginning',
    dateRange: 'Dec 22 – Jan 19',
    headline: 'Builds structure.',
    description: 'Born at deepest darkness. Values discipline, responsibility, and long-term achievement to ensure survival.',
    color: '#22c55e',
  },
  Aquarius: {
    season: 'Mid-Winter',
    element: 'Air',
    mode: 'Core',
    dateRange: 'Jan 20 – Feb 18',
    headline: 'Sustains vision.',
    description: "Born in winter's clarity. Thinks independently, challenges norms, and commits to collective progress.",
    color: '#38bdf8',
  },
  Pisces: {
    season: 'Late Winter',
    element: 'Water',
    mode: 'Transition',
    dateRange: 'Feb 19 – Mar 20',
    headline: 'Dissolves and unifies.',
    description: 'Born as the cycle ends. Feels deeply, merges boundaries, and prepares the way for renewal.',
    color: '#8b5cf6',
  },
};

// =============================================================================
// ELEMENT TOOLTIPS
// =============================================================================

export interface ElementTooltipData {
  icon: string;
  title: string;
  headline: string;
  description: string;
  drives: string[];
  signs: string[];
  color: string;
}

export const ELEMENT_TOOLTIPS: Record<string, ElementTooltipData> = {
  Fire: {
    icon: '🔥',
    title: 'Energy of Inspiration',
    headline: 'Acts through passion and will.',
    description: 'Motivated by excitement, purpose, and momentum. Needs action to feel alive.',
    drives: ['Action', 'Courage', 'Enthusiasm'],
    signs: ['Aries', 'Leo', 'Sagittarius'],
    color: '#ef4444',
  },
  Earth: {
    icon: '🌿',
    title: 'Energy of Manifestation',
    headline: 'Acts through results and stability.',
    description: 'Motivated by security, usefulness, and tangible progress. Needs structure to feel safe.',
    drives: ['Building', 'Practicality', 'Reliability'],
    signs: ['Taurus', 'Virgo', 'Capricorn'],
    color: '#22c55e',
  },
  Air: {
    icon: '⚡',
    title: 'Energy of Connection',
    headline: 'Acts through thought and communication.',
    description: 'Motivated by ideas, dialogue, and understanding. Needs mental stimulation to thrive.',
    drives: ['Thinking', 'Relating', 'Innovating'],
    signs: ['Gemini', 'Libra', 'Aquarius'],
    color: '#38bdf8',
  },
  Water: {
    icon: '💧',
    title: 'Energy of Emotion',
    headline: 'Acts through feeling and intuition.',
    description: 'Motivated by emotional depth, bonding, and meaning. Needs connection to feel whole.',
    drives: ['Sensitivity', 'Empathy', 'Intuition'],
    signs: ['Cancer', 'Scorpio', 'Pisces'],
    color: '#8b5cf6',
  },
};

// =============================================================================
// MODALITY TOOLTIPS
// =============================================================================

export interface ModalityTooltipData {
  icon: string;
  label: string;
  title: string;
  description: string;
  strength: string;
  challenge: string;
  signs: string[];
  color: string;
}

export const MODALITY_TOOLTIPS: Record<string, ModalityTooltipData> = {
  Cardinal: {
    icon: '▶️',
    label: 'BEGINNING',
    title: 'Initiates movement.',
    description: 'Energized by starting, leading, and activating change. Thrives when something new begins.',
    strength: 'Momentum · Leadership',
    challenge: "Finishing what's started",
    signs: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    color: '#ec4899',
  },
  Fixed: {
    icon: '⏺',
    label: 'CORE',
    title: 'Sustains momentum.',
    description: 'Energized by consistency, mastery, and endurance. Thrives when maintaining and strengthening.',
    strength: 'Loyalty · Stability',
    challenge: 'Letting go or adapting',
    signs: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    color: '#f59e0b',
  },
  Mutable: {
    icon: '🔄',
    label: 'TRANSITION',
    title: 'Adapts and bridges.',
    description: 'Energized by flexibility, learning, and change. Thrives when adjusting and connecting phases.',
    strength: 'Versatility · Insight',
    challenge: 'Grounding and focus',
    signs: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
    color: '#14b8a6',
  },
};

// =============================================================================
// CELESTIAL EVENTS (Equinoxes & Solstices)
// =============================================================================

export interface CelestialEventData {
  id: string;
  angle: number;
  label: string;
  icon: string;
  color: string;
  sign: string;
  symbol: string;
  date: string;
  tagline: string;
  description: string;
  keywords: string[];
  imprint: string;
  lightPhase: string;
}

export const CELESTIAL_EVENTS: CelestialEventData[] = [
  {
    id: 'spring-equinox',
    angle: 0,
    label: 'Spring Equinox',
    icon: '🌸',
    color: '#4ade80',
    sign: 'Aries',
    symbol: '♈',
    date: 'March 20–21',
    tagline: 'Birth of Light',
    description: 'Day = Night → Growth begins',
    keywords: ['Initiation', 'Courage', 'Emergence'],
    imprint: '"I must act to exist." — Instinct before reflection.',
    lightPhase: 'Light is increasing → life pushes upward',
  },
  {
    id: 'summer-solstice',
    angle: 90,
    label: 'Summer Solstice',
    icon: '☀️',
    color: '#fbbf24',
    sign: 'Cancer',
    symbol: '♋',
    date: 'June 20–21',
    tagline: 'Peak Light',
    description: 'Longest day → Protect what has grown',
    keywords: ['Nurture', 'Safety', 'Emotional bonding'],
    imprint: '"What I love must be kept safe." — Protection becomes necessary.',
    lightPhase: 'Maximum light → protect what has grown',
  },
  {
    id: 'autumn-equinox',
    angle: 180,
    label: 'Autumn Equinox',
    icon: '🍂',
    color: '#f97316',
    sign: 'Libra',
    symbol: '♎',
    date: 'September 22–23',
    tagline: 'Balance Point',
    description: 'Day = Night → Awareness of the Other',
    keywords: ['Partnership', 'Fairness', 'Reciprocity'],
    imprint: '"I must relate to survive." — Social intelligence is survival.',
    lightPhase: 'Light begins decreasing → social awareness',
  },
  {
    id: 'winter-solstice',
    angle: 270,
    label: 'Winter Solstice',
    icon: '❄️',
    color: '#94a3b8',
    sign: 'Capricorn',
    symbol: '♑',
    date: 'December 21–22',
    tagline: 'Rebirth of Light',
    description: 'Darkest day → Structure ensures survival',
    keywords: ['Discipline', 'Responsibility', 'Legacy'],
    imprint: '"I must build to endure." — Systems replace abundance.',
    lightPhase: 'Darkness peaks → discipline creates survival',
  },
];

// =============================================================================
// SEASON FLOW PULSE COLORS
// =============================================================================

export const SEASON_PULSE_COLORS = [
  { startAngle: 0, color: '#4ade80', opacity: 0.8 },           // Spring green
  { startAngle: Math.PI / 2, color: '#fbbf24', opacity: 0.8 }, // Summer gold
  { startAngle: Math.PI, color: '#f97316', opacity: 0.8 },     // Autumn orange
  { startAngle: 3 * Math.PI / 2, color: '#94a3b8', opacity: 0.8 }, // Winter silver
];

// =============================================================================
// ASPECT TOOLTIPS
// =============================================================================

export type AspectKey = 'conjunction' | 'semi-sextile' | 'sextile' | 'square' | 'trine' | 'quincunx' | 'opposition';

export interface AspectTooltipData {
  name: string;
  degrees: number;
  symbol: string;
  vibe: string;
  function: string;
  useConsciously: string;
  watchFor: string;
  tooltip: string;
  color: string;
}

export const ASPECT_TOOLTIPS: Record<AspectKey, AspectTooltipData> = {
  conjunction: {
    name: 'Conjunction',
    degrees: 0,
    symbol: '☌',
    vibe: 'The Unified Seed',
    function: 'Blending — two energies fuse into one',
    useConsciously: 'Treat it as a new cycle. Clarify which energy is leading.',
    watchFor: 'Identity blur, overwhelm, or power imbalance',
    tooltip: 'Conjunction (0°): Fusion. Two energies blend completely — intense, focused, and sometimes hard to separate.',
    color: '#fbbf24',  // Amber
  },
  'semi-sextile': {
    name: 'Semi-sextile',
    degrees: 30,
    symbol: '⚺',
    vibe: 'The Adjacent Shift',
    function: 'Subtle contrast — side-by-side signs with different instincts',
    useConsciously: 'Translate gently. Find shared values.',
    watchFor: 'Misunderstanding due to different pacing or priorities',
    tooltip: 'Semi-sextile (30°): Quiet contrast. Close proximity, different languages — requires gentle translation.',
    color: '#94a3b8',  // Slate
  },
  sextile: {
    name: 'Sextile',
    degrees: 60,
    symbol: '⚹',
    vibe: 'The Opportunity',
    function: 'Cooperative — energies support each other if activated',
    useConsciously: 'Say yes. Initiate collaboration.',
    watchFor: 'Missed chances due to passivity',
    tooltip: 'Sextile (60°): Opportunity. Energies complement each other — support flows if you engage.',
    color: '#4ade80',  // Green
  },
  square: {
    name: 'Square',
    degrees: 90,
    symbol: '□',
    vibe: 'The Turning Point',
    function: 'Friction — tension that forces growth',
    useConsciously: 'Name the tension. Choose growth over avoidance.',
    watchFor: 'Power struggles, stuck patterns, reactive conflict',
    tooltip: 'Square (90°): Friction. Energies clash — challenge that demands action and maturity.',
    color: '#ef4444',  // Red
  },
  trine: {
    name: 'Trine',
    degrees: 120,
    symbol: '△',
    vibe: 'The Golden Triangle',
    function: 'Harmony — effortless flow between same-element signs',
    useConsciously: "Don't coast. Use the ease to build mastery.",
    watchFor: 'Complacency, underuse of natural gifts',
    tooltip: 'Trine (120°): Harmony. Natural flow between same-element signs — easy, lucky, and often underutilized.',
    color: '#3b82f6',  // Blue
  },
  quincunx: {
    name: 'Quincunx',
    degrees: 150,
    symbol: '⚻',
    vibe: 'The Adjustment',
    function: 'Awkward — no shared element or modality',
    useConsciously: 'Accept differences. Build bridges.',
    watchFor: 'Chronic misalignment, frustration, or confusion',
    tooltip: 'Quincunx (150°): Adjustment. Energies don\'t naturally align — requires persistent compromise and translation.',
    color: '#a855f7',  // Purple
  },
  opposition: {
    name: 'Opposition',
    degrees: 180,
    symbol: '☍',
    vibe: 'The Mirror',
    function: 'Polarity — two sides of the same coin',
    useConsciously: 'Balance. Learn from the other side.',
    watchFor: 'Projection, tug-of-war, overcompensation',
    tooltip: 'Opposition (180°): Mirror. Energies reflect and challenge each other — tension that teaches balance.',
    color: '#ec4899',  // Pink
  },
};

// =============================================================================
// WHEEL EDUCATION SYSTEM - Study from Outside In
// =============================================================================

export interface WheelLayerData {
  id: string;
  name: string;
  ring: number;
  icon: string;
  tagline: string;
  description: string;
  keyQuestion: string;
  howItRelates: string;
  howToUse: string;
}

export const WHEEL_LAYERS: WheelLayerData[] = [
  {
    id: 'seasons',
    name: 'Seasons',
    ring: 1,
    icon: '🌍',
    tagline: 'The Four Survival Imperatives',
    description: 'The outer ring shows Earth\'s relationship with the Sun—the cosmic clock that determines when you were born and what survival imperative shaped your psychology. Four seasons mark four challenges that shaped human consciousness over millions of years.',
    keyQuestion: 'What time of year were you born, and what survival instinct does it activate?',
    howItRelates: 'The season you were born into imprinted a core belief about what you must do to survive. Spring children feel they must act. Summer children feel they must protect. Autumn children feel they must relate. Winter children feel they must build.',
    howToUse: 'Notice when you feel most alive—does it match your season\'s imperative? Understanding your seasonal drive helps you stop fighting your nature and start working with it.',
  },
  {
    id: 'modalities',
    name: 'Modalities',
    ring: 2,
    icon: '⚡',
    tagline: 'The Three Engines of Momentum',
    description: 'Every season follows a three-act pattern—like a wave building, cresting, and dissolving. Where you were born in your season\'s wave determines how you naturally move through life. Beginning (Cardinal) initiates. Core (Fixed) sustains. Transition (Mutable) adapts.',
    keyQuestion: 'Do you start things, maintain things, or change things?',
    howItRelates: 'Your modality is your natural rhythm. Beginning types feel restless unless launching something new. Core types feel anxious unless maintaining what matters. Transition types feel stuck unless adapting to change.',
    howToUse: 'In conflicts, ask: "Am I frustrated because someone has a different engine?" Beginners get impatient with maintainers. Maintainers feel abandoned by adapters. Adapters feel trapped by beginners. Understanding this prevents 90% of relationship friction.',
  },
  {
    id: 'elements',
    name: 'Elements',
    ring: 3,
    icon: '🔥',
    tagline: 'The Four Fuels — How You Process Reality',
    description: 'Imagine four people witnessing the same sunset: Fire feels inspired ("Let\'s go somewhere!"), Earth feels present ("Temperature dropped—need a sweater?"), Air feels curious ("Why do sunsets look redder near the ocean?"), Water feels moved (tears up quietly). Your element is your default operating system.',
    keyQuestion: 'What fuels you? Inspiration, Results, Ideas, or Connection?',
    howItRelates: 'Your element explains why some environments drain you and others energize you. Fire needs action. Earth needs structure. Air needs stimulation. Water needs connection. Knowing your fuel prevents burnout.',
    howToUse: 'When exhausted, check: "Am I getting my elemental fuel?" Fire without action dies. Earth without results panics. Air without ideas suffocates. Water without connection withers. Feed your element first.',
  },
  {
    id: 'signs',
    name: 'Zodiac Signs',
    ring: 4,
    icon: '✨',
    tagline: 'Your Complete Constitutional Address',
    description: 'Each of the 12 signs represents a unique fusion of Season + Modality + Element—your GPS coordinates in time. Aries = Spring + Beginning + Fire = "The Spark that Ignites Growth." Pisces = Winter + Transition + Water = "The Ocean that Dissolves for Rebirth."',
    keyQuestion: 'What is your Season + Modality + Element combination?',
    howItRelates: 'Your sign isn\'t a fortune—it\'s a formula. Understanding the three ingredients that create your sign explains WHY you feel the way you do, not just WHAT you supposedly are.',
    howToUse: 'When someone frustrates you, decode their formula. A Scorpio (Autumn + Core + Water) isn\'t being "intense" to annoy you—they\'re being a Fixed Water sign: deep, sustained, and emotionally committed. The formula removes judgment and reveals nature.',
  },
];

// =============================================================================
// SUMMARY TABLE - Element × Modality × Season (Legacy - keep for backward compatibility)
// =============================================================================

export interface SummaryTableCell {
  sign: string;
  symbol: string;
  season: string;
  role: string;
}

export interface SummaryTableRow {
  element: string;
  icon: string;
  color: string;
  cardinal: SummaryTableCell;
  fixed: SummaryTableCell;
  mutable: SummaryTableCell;
}

export const SUMMARY_TABLE: SummaryTableRow[] = [
  {
    element: 'Fire',
    icon: '🔥',
    color: '#ef4444',
    cardinal: { sign: 'Aries', symbol: '♈', season: 'Spring', role: 'Spark' },
    fixed: { sign: 'Leo', symbol: '♌', season: 'Summer', role: 'Radiance' },
    mutable: { sign: 'Sagittarius', symbol: '♐', season: 'Autumn', role: 'Torch' },
  },
  {
    element: 'Earth',
    icon: '🌿',
    color: '#22c55e',
    cardinal: { sign: 'Capricorn', symbol: '♑', season: 'Winter', role: 'Structure' },
    fixed: { sign: 'Taurus', symbol: '♉', season: 'Spring', role: 'Stability' },
    mutable: { sign: 'Virgo', symbol: '♍', season: 'Summer', role: 'Refinement' },
  },
  {
    element: 'Air',
    icon: '💨',
    color: '#38bdf8',
    cardinal: { sign: 'Libra', symbol: '♎', season: 'Autumn', role: 'Balance' },
    fixed: { sign: 'Aquarius', symbol: '♒', season: 'Winter', role: 'Vision' },
    mutable: { sign: 'Gemini', symbol: '♊', season: 'Spring', role: 'Curiosity' },
  },
  {
    element: 'Water',
    icon: '💧',
    color: '#8b5cf6',
    cardinal: { sign: 'Cancer', symbol: '♋', season: 'Summer', role: 'Care' },
    fixed: { sign: 'Scorpio', symbol: '♏', season: 'Autumn', role: 'Depth' },
    mutable: { sign: 'Pisces', symbol: '♓', season: 'Winter', role: 'Release' },
  },
];

// =============================================================================
// SEASONAL SUMMARY TABLE - The "Meat & Potatoes" Version
// =============================================================================
// Organized by SEASONAL CYCLE (Spring→Summer→Autumn→Winter)
// Color-coordinated with the wheel. Rich "Ah Ha moment" content.
// =============================================================================

export const SEASON_COLORS = {
  Spring: { color: '#4ade80', icon: '🌸', label: 'Spring', dates: 'Mar 20 – Jun 20' },
  Summer: { color: '#fbbf24', icon: '☀️', label: 'Summer', dates: 'Jun 21 – Sep 22' },
  Autumn: { color: '#f97316', icon: '🍂', label: 'Autumn', dates: 'Sep 23 – Dec 20' },
  Winter: { color: '#94a3b8', icon: '❄️', label: 'Winter', dates: 'Dec 21 – Mar 19' },
} as const;

export interface SeasonalSignCell {
  sign: string;
  symbol: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  modalityRole: string;
  // The "Ah Ha Moment" content
  survivalGift: string;      // What they bring to survival
  seasonalRole: string;      // Their role in that season
  coreInsight: string;       // The deeper truth about them
}

export interface SeasonalTableRow {
  element: string;
  icon: string;
  color: string;
  // Signs in SEASONAL ORDER (Spring → Summer → Autumn → Winter)
  // null means this element has no sign in that season
  spring: SeasonalSignCell | null;
  summer: SeasonalSignCell | null;
  autumn: SeasonalSignCell | null;
  winter: SeasonalSignCell | null;
}

export const SEASONAL_SUMMARY_TABLE: SeasonalTableRow[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FIRE ROW: Aries (Spring) → Leo (Summer) → Sagittarius (Autumn) → [none]
  // ═══════════════════════════════════════════════════════════════════════════
  {
    element: 'Fire',
    icon: '🔥',
    color: '#ef4444',
    spring: {
      sign: 'Aries',
      symbol: '♈',
      modality: 'Cardinal',
      modalityRole: 'Initiator',
      survivalGift: 'First to move when opportunity appears',
      seasonalRole: 'The Spark that ignites spring\'s new growth',
      coreInsight: 'When everyone hesitates, Aries acts. They teach us that sometimes the risk of waiting exceeds the risk of moving.',
    },
    summer: {
      sign: 'Leo',
      symbol: '♌',
      modality: 'Fixed',
      modalityRole: 'Sustainer',
      survivalGift: 'Keeps the fire burning when others tire',
      seasonalRole: 'The Heart of summer\'s full expression',
      coreInsight: 'Leo reminds us that visibility isn\'t vanity—it\'s how warmth reaches others. Their shine is a service.',
    },
    autumn: {
      sign: 'Sagittarius',
      symbol: '♐',
      modality: 'Mutable',
      modalityRole: 'Transformer',
      survivalGift: 'Carries wisdom forward into new territories',
      seasonalRole: 'The Torch that lights the way through harvest',
      coreInsight: 'Sagittarius proves that endings are also beginnings in disguise. Their restlessness is actually vision.',
    },
    winter: null, // Fire rests in winter—and that's the teaching
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EARTH ROW: Taurus (Spring) → Virgo (Summer) → [none] → Capricorn (Winter)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    element: 'Earth',
    icon: '🌿',
    color: '#22c55e',
    spring: {
      sign: 'Taurus',
      symbol: '♉',
      modality: 'Fixed',
      modalityRole: 'Sustainer',
      survivalGift: 'Builds what lasts; turns seeds into harvests',
      seasonalRole: 'The Roots that anchor spring\'s growth',
      coreInsight: 'Taurus knows that rushing growth kills it. Their "stubbornness" is actually patience with a pulse.',
    },
    summer: {
      sign: 'Virgo',
      symbol: '♍',
      modality: 'Mutable',
      modalityRole: 'Transformer',
      survivalGift: 'Separates wheat from chaff; improves everything',
      seasonalRole: 'The Harvest that refines summer\'s abundance',
      coreInsight: 'Virgo\'s criticism is love wearing work clothes. They make things better because they believe things CAN be better.',
    },
    autumn: null, // Earth consolidates in autumn—quietly
    winter: {
      sign: 'Capricorn',
      symbol: '♑',
      modality: 'Cardinal',
      modalityRole: 'Initiator',
      survivalGift: 'Builds structures that survive the coldest tests',
      seasonalRole: 'The Mountain that stands when all else falls',
      coreInsight: 'Capricorn starts building when others retreat. Their ambition isn\'t cold—it\'s survival wisdom from the bones.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AIR ROW: Gemini (Spring) → [none] → Libra (Autumn) → Aquarius (Winter)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    element: 'Air',
    icon: '💨',
    color: '#38bdf8',
    spring: {
      sign: 'Gemini',
      symbol: '♊',
      modality: 'Mutable',
      modalityRole: 'Transformer',
      survivalGift: 'Spots connections others miss; spreads vital news',
      seasonalRole: 'The Wind that cross-pollinates spring',
      coreInsight: 'Gemini\'s "scattered" mind is actually a parallel processor. They see the whole network while we see nodes.',
    },
    summer: null, // Air rises above summer's heat
    autumn: {
      sign: 'Libra',
      symbol: '♎',
      modality: 'Cardinal',
      modalityRole: 'Initiator',
      survivalGift: 'Creates alliances when resources tighten',
      seasonalRole: 'The Balance that weighs autumn\'s harvest',
      coreInsight: 'Libra\'s indecision is actually fairness computing. They see all sides because they value all sides.',
    },
    winter: {
      sign: 'Aquarius',
      symbol: '♒',
      modality: 'Fixed',
      modalityRole: 'Sustainer',
      survivalGift: 'Innovates solutions when old ways fail',
      seasonalRole: 'The Vision that sees past winter',
      coreInsight: 'Aquarius\' detachment isn\'t coldness—it\'s altitude. From up there, they see patterns we can\'t.',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WATER ROW: [none] → Cancer (Summer) → Scorpio (Autumn) → Pisces (Winter)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    element: 'Water',
    icon: '💧',
    color: '#8b5cf6',
    spring: null, // Water gathers in spring—underground
    summer: {
      sign: 'Cancer',
      symbol: '♋',
      modality: 'Cardinal',
      modalityRole: 'Initiator',
      survivalGift: 'Creates sanctuary; protects what matters most',
      seasonalRole: 'The Tide that nurtures summer\'s young',
      coreInsight: 'Cancer\'s "clinginess" is actually fierce protection. They remember what others forget: we survive together or not at all.',
    },
    autumn: {
      sign: 'Scorpio',
      symbol: '♏',
      modality: 'Fixed',
      modalityRole: 'Sustainer',
      survivalGift: 'Guards the treasures others overlook',
      seasonalRole: 'The Depth that holds autumn\'s secrets',
      coreInsight: 'Scorpio\'s intensity is intimacy without compromise. They demand truth because they can handle it.',
    },
    winter: {
      sign: 'Pisces',
      symbol: '♓',
      modality: 'Mutable',
      modalityRole: 'Transformer',
      survivalGift: 'Dissolves what must end; dreams what comes next',
      seasonalRole: 'The Ocean that carries winter to spring',
      coreInsight: 'Pisces\' "escapism" is actually dimensional travel. They visit realms the rest of us only glimpse in dreams.',
    },
  },
];

// =============================================================================
// SEASONAL TABLE EMPTY CELL INSIGHTS
// =============================================================================
// When an element has no sign in a season, that's meaningful too
// =============================================================================

export const SEASONAL_ABSENCE_INSIGHTS: Record<string, Record<string, string>> = {
  Fire: {
    Winter: 'Fire has no winter sign. This is wisdom: flames cannot burn year-round without consuming themselves. Fire people should rest in winter, not fight against it.',
  },
  Earth: {
    Autumn: 'Earth has no autumn sign. This is wisdom: the soil needs no spokesperson during harvest—its work speaks through what grows. Earth people can trust their past efforts in autumn.',
  },
  Air: {
    Summer: 'Air has no summer sign. This is wisdom: hot air rises and disperses. Air people may feel "ungrounded" in summer—and that\'s their nature, not a flaw.',
  },
  Water: {
    Spring: 'Water has no spring sign. This is wisdom: melting snow becomes the streams of spring without needing to lead the parade. Water people feed spring\'s growth from below.',
  },
};

// =============================================================================
// SEASONAL WISDOM - The Outer Ring
// =============================================================================

export interface SeasonWisdomData {
  season: string;
  icon: string;
  title: string;
  survivalImperative: string;
  lightCycle: string;
  psychologicalImprint: string;
  coreMantra: string;
  signs: string[];
  color: string;
  howItRelates: string;
  howToUse: string;
  environmentalReality: string[];
  threeActStructure: {
    beginning: string;
    core: string;
    transition: string;
  };
}

export const SEASON_WISDOM: Record<string, SeasonWisdomData> = {
  Spring: {
    season: 'Spring',
    icon: '🌸',
    title: 'The Birth of Light',
    survivalImperative: 'Act now — the window for growth is opening.',
    lightCycle: 'Light begins increasing → life pushes upward',
    psychologicalImprint: 'Those born in spring carry an instinct to initiate, to be first, to act before reflecting.',
    coreMantra: '"I must act to exist."',
    signs: ['Aries', 'Taurus', 'Gemini'],
    color: '#4ade80',
    howItRelates: 'If you were born in spring, you carry an urgency in your bones. You sense when it\'s time to move before anyone else does. Waiting feels unnatural. Hesitation feels like missing the window. Your body knows: opportunities don\'t wait.',
    howToUse: 'When you feel restless, honor it—your spring energy is telling you something needs to begin. But also notice: spring energy excels at starting, not necessarily finishing. Partner with Summer or Winter types who can help sustain what you initiate.',
    environmentalReality: [
      'Light is increasing after months of darkness',
      'Life is breaking dormancy everywhere',
      'Nothing is guaranteed—everything must fight to exist',
      'Speed and action determine who survives',
    ],
    threeActStructure: {
      beginning: 'Aries ignites the spark—raw action, pure initiative',
      core: 'Taurus stabilizes the growth—making it tangible and lasting',
      transition: 'Gemini adapts and connects—preparing for summer\'s protection phase',
    },
  },
  Summer: {
    season: 'Summer',
    icon: '☀️',
    title: 'Peak Radiance',
    survivalImperative: 'Protect what has grown — abundance must be guarded.',
    lightCycle: 'Maximum light → protect and nurture',
    psychologicalImprint: 'Those born in summer carry an instinct to nurture, express, and perfect what exists.',
    coreMantra: '"What I love must be kept safe."',
    signs: ['Cancer', 'Leo', 'Virgo'],
    color: '#fbbf24',
    howItRelates: 'If you were born in summer, you feel responsible for protecting what matters. You notice when someone isn\'t being cared for. You feel the impulse to create safety, to express fully, and to refine until things are right. Abandonment and neglect trigger you deeply.',
    howToUse: 'When you feel protective or critical, recognize your summer instinct at work. Your gift is nurturing excellence into being. But watch for: over-protecting until others can\'t grow, or perfecting until nothing is ever good enough. Let go sometimes.',
    environmentalReality: [
      'Light is at its peak—the longest days of the year',
      'Life has grown and abundance is everywhere',
      'What exists must now be defended from loss',
      'Expression and radiance are at their maximum',
    ],
    threeActStructure: {
      beginning: 'Cancer initiates protection—emotional safety, home, belonging',
      core: 'Leo sustains radiance—full creative expression, unwavering warmth',
      transition: 'Virgo refines and prepares—analyzing what\'s worth keeping for autumn',
    },
  },
  Autumn: {
    season: 'Autumn',
    icon: '🍂',
    title: 'The Balance Point',
    survivalImperative: 'Form alliances — survival requires cooperation.',
    lightCycle: 'Light begins decreasing → social awareness awakens',
    psychologicalImprint: 'Those born in autumn carry an instinct for relationship, depth, and finding meaning beyond the self.',
    coreMantra: '"I must relate to survive."',
    signs: ['Libra', 'Scorpio', 'Sagittarius'],
    color: '#f97316',
    howItRelates: 'If you were born in autumn, you understand that no one makes it alone. You sense social dynamics, feel the importance of deep bonds, and search for meaning in connection. Isolation feels dangerous. Shallow relationships feel pointless.',
    howToUse: 'When you feel the pull toward partnership or depth, trust it—your autumn instinct knows that winter is coming. Your gift is seeing what connects people and finding meaning in relationship. But watch for: losing yourself in others, or going so deep you can\'t resurface.',
    environmentalReality: [
      'Light and darkness are equal at the equinox',
      'Resources are decreasing—scarcity approaches',
      'Cooperation becomes essential for survival',
      'What isn\'t shared may be lost',
    ],
    threeActStructure: {
      beginning: 'Libra initiates partnership—seeking balance, fairness, connection',
      core: 'Scorpio sustains depth—forging unbreakable bonds through intensity',
      transition: 'Sagittarius seeks meaning—finding truth that transcends the darkness ahead',
    },
  },
  Winter: {
    season: 'Winter',
    icon: '❄️',
    title: 'The Rebirth of Light',
    survivalImperative: 'Build structures — systems ensure survival through scarcity.',
    lightCycle: 'Darkness peaks then light returns → discipline creates survival',
    psychologicalImprint: 'Those born in winter carry an instinct to build, innovate, and transcend limitations.',
    coreMantra: '"I must build to endure."',
    signs: ['Capricorn', 'Aquarius', 'Pisces'],
    color: '#94a3b8',
    howItRelates: 'If you were born in winter, you understand that survival isn\'t guaranteed. You naturally think in systems, long-term structures, and "what if" scenarios. Chaos and waste disturb you. You feel compelled to build something that lasts beyond you.',
    howToUse: 'When you feel the need to create structure or question existing systems, honor it—your winter instinct is preparing for survival. Your gift is building for the long term. But watch for: becoming so focused on the future that you miss present joy, or so disciplined that you forget to live.',
    environmentalReality: [
      'Darkness is at its peak—the longest nights of the year',
      'Resources are scarce—nothing is wasted',
      'Only what is built with discipline survives',
      'But light begins returning—hope exists',
    ],
    threeActStructure: {
      beginning: 'Capricorn initiates structure—building systems that ensure survival',
      core: 'Aquarius sustains vision—holding the blueprint for collective progress',
      transition: 'Pisces dissolves boundaries—preparing for spring\'s rebirth by letting go',
    },
  },
};

// =============================================================================
// ELEMENTAL EDUCATION - Fire, Earth, Air, Water
// =============================================================================

export interface ElementEducationData {
  element: string;
  icon: string;
  title: string;
  theDrive: string;
  thePhysics: string;
  thePsychology: string;
  essence: string;
  coreFunction: string;
  sunsetResponse: string;
  motivatedBy: string;
  needs: string;
  atBest: string;
  underStress: string;
  bottomLine: string;
  inRelationships: string;
  signs: string[];
  color: string;
  modalityExpressions: {
    cardinal: {
      sign: string;
      role: string;
      image: string;
      description: string;
    };
    fixed: {
      sign: string;
      role: string;
      image: string;
      description: string;
    };
    mutable: {
      sign: string;
      role: string;
      image: string;
      description: string;
    };
  };
}

export const ELEMENT_EDUCATION: Record<string, ElementEducationData> = {
  Fire: {
    element: 'Fire',
    icon: '🔥',
    title: 'The Fuel of Spirit',
    theDrive: 'To exist, to express, to inspire',
    thePhysics: 'Fire is the only element that rises and shines. It consumes fuel to create heat and light. It cannot be contained—it must move.',
    thePsychology: 'Fire signs don\'t wait for data (Earth), social consensus (Air), or emotional permission (Water). They act on an inner spark—intuition, impulse, excitement.',
    essence: 'Fire is the energy of action, will, and inspiration. It moves outward, initiates, and transforms.',
    coreFunction: 'Acts through passion and will.',
    sunsetResponse: '"This is amazing! Let\'s go somewhere!"',
    motivatedBy: 'Passion, purpose, excitement, momentum',
    needs: 'Action to feel alive — boredom is death',
    atBest: 'Courageous, inspiring, warm, enthusiastic, visionary',
    underStress: 'Impulsive, dominating, burning out, impatient, reckless',
    bottomLine: 'Fire needs action to feel alive. Boredom is death. Excitement is oxygen.',
    inRelationships: 'Fire loves with passion and directness. They bring warmth and enthusiasm but need freedom to burn. Partners must not try to contain them.',
    signs: ['Aries', 'Leo', 'Sagittarius'],
    color: '#ef4444',
    modalityExpressions: {
      cardinal: {
        sign: 'Aries',
        role: 'The Match Strike — Ignition',
        image: 'A spark plug or flamethrower',
        description: 'Fire at its most raw. Spring fire that breaks through frozen ground. Explosive, sudden, hot. Acts first, thinks later. Pure initiative.',
      },
      fixed: {
        sign: 'Leo',
        role: 'The Hearth — Radiance',
        image: 'The Sun or a bonfire that lasts all night',
        description: 'Fire sustained into steady warmth. Summer fire at full power. Radiates outward, draws others in. Creative expression that commands attention.',
      },
      mutable: {
        sign: 'Sagittarius',
        role: 'The Torch — Exploration',
        image: 'A lantern on a journey or wildfire spreading',
        description: 'Fire that travels. Autumn fire seeking new fuel. Spreading light and wisdom across distances. Philosophical quest.',
      },
    },
  },
  Earth: {
    element: 'Earth',
    icon: '🌿',
    title: 'The Fuel of Substance',
    theDrive: 'To build, to stabilize, to manifest',
    thePhysics: 'Earth is solid. It resists gravity and provides a platform for life. It is tangible, measurable, real.',
    thePsychology: 'Earth signs rely on sensation and practicality. If they can\'t touch it, measure it, or use it, they\'re skeptical. They trust what works, what lasts, what produces results.',
    essence: 'Earth is the energy of form, stability, and results. It builds, preserves, and makes things real.',
    coreFunction: 'Acts through results and stability.',
    sunsetResponse: '"The temperature dropped 5 degrees. Should I get a sweater?"',
    motivatedBy: 'Security, usefulness, tangible progress',
    needs: 'Structure to feel safe — chaos is threatening',
    atBest: 'Reliable, grounded, practical, productive, patient',
    underStress: 'Rigid, materialistic, stubborn, fearful of change, workaholic',
    bottomLine: 'Earth needs results to feel secure. Chaos is threatening. Progress is proof of worth.',
    inRelationships: 'Earth loves through consistency and acts of service. They build lasting partnerships but need stability. Partners must appreciate their reliability.',
    signs: ['Taurus', 'Virgo', 'Capricorn'],
    color: '#22c55e',
    modalityExpressions: {
      cardinal: {
        sign: 'Capricorn',
        role: 'The Mountain — Structure',
        image: 'A skyscraper or mountain peak',
        description: 'Earth that builds empires. Winter earth that must create systems for survival. Building upward against gravity. Discipline becomes achievement.',
      },
      fixed: {
        sign: 'Taurus',
        role: 'The Garden — Abundance',
        image: 'A lush forest or a bank vault',
        description: 'Earth in full bloom. Spring earth enjoying what grows. Fertile, unmoving, productive soil. Accumulates value, creates beauty. Sensory mastery.',
      },
      mutable: {
        sign: 'Virgo',
        role: 'The Harvest — Refinement',
        image: 'A craftsman\'s workbench or organized library',
        description: 'Earth at the threshold of change. Late summer earth preparing for autumn. Sorting wheat from chaff. Analyzes, improves, serves.',
      },
    },
  },
  Air: {
    element: 'Air',
    icon: '💨',
    title: 'The Fuel of Intellect',
    theDrive: 'To connect, to communicate, to understand',
    thePhysics: 'Air expands to fill any container. It is invisible but moves everything else. It has no form but creates patterns.',
    thePsychology: 'Air signs detach from emotion to see the "bird\'s-eye view" of systems and relationships. They rely on logic, pattern recognition, and social connection. They think before they feel.',
    essence: 'Air is the energy of thought, communication, and relationship. It connects, circulates, and questions.',
    coreFunction: 'Acts through thought and communication.',
    sunsetResponse: '"Why do sunsets look redder near the ocean?"',
    motivatedBy: 'Ideas, dialogue, understanding, fairness',
    needs: 'Mental stimulation to thrive — silence is suffocation',
    atBest: 'Intelligent, communicative, fair, innovative, articulate',
    underStress: 'Detached, over-analytical, scattered, avoidant of emotion, cold',
    bottomLine: 'Air needs mental stimulation to thrive. Silence feels like suffocation. Dialogue is oxygen.',
    inRelationships: 'Air loves through conversation and mental connection. They bring ideas and fairness but need intellectual engagement. Partners must communicate.',
    signs: ['Gemini', 'Libra', 'Aquarius'],
    color: '#38bdf8',
    modalityExpressions: {
      cardinal: {
        sign: 'Libra',
        role: 'The Breeze — Balance',
        image: 'A conversation starting or a bridge being built',
        description: 'Air that initiates connection. Autumn air aware that survival requires others. Moving toward another person. Creates harmony, seeks justice.',
      },
      fixed: {
        sign: 'Aquarius',
        role: 'The Atmosphere — Vision',
        image: 'The ozone layer (protecting all) or a constant radio signal',
        description: 'Air sustained into consistent flow. Winter air carrying ideas across distance. Holding a fixed vision of the future. Innovates, challenges, liberates.',
      },
      mutable: {
        sign: 'Gemini',
        role: 'The Wind — Exchange',
        image: 'Pollination of flowers or the internet',
        description: 'Air in constant motion. Late spring air cross-pollinating. Moving information rapidly from A to B. Gathers, connects, adapts.',
      },
    },
  },
  Water: {
    element: 'Water',
    icon: '💧',
    title: 'The Fuel of Soul',
    theDrive: 'To feel, to heal, to merge',
    thePhysics: 'Water flows and takes the shape of its container. It has no rigid form, but given time, it can erode rock. It connects everything through osmosis.',
    thePsychology: 'Water signs process life through an emotional filter. They sense the "vibe" before the facts. They rely on feeling and memory. Intuition is data. Connection is survival.',
    essence: 'Water is the energy of feeling, intuition, and depth. It bonds, heals, and transforms through emotion.',
    coreFunction: 'Acts through feeling and intuition.',
    sunsetResponse: '[tears up quietly, overwhelmed by beauty]',
    motivatedBy: 'Emotional depth, bonding, meaning, healing',
    needs: 'Connection to feel whole — isolation is death',
    atBest: 'Empathetic, intuitive, nurturing, profound, healing',
    underStress: 'Moody, clingy, manipulative, overwhelmed by feeling, escapist',
    bottomLine: 'Water needs connection to feel whole. Emotional isolation is death. Depth is home.',
    inRelationships: 'Water loves through emotional bonding and intuition. They bring depth and care but need emotional safety. Partners must be emotionally available.',
    signs: ['Cancer', 'Scorpio', 'Pisces'],
    color: '#8b5cf6',
    modalityExpressions: {
      cardinal: {
        sign: 'Cancer',
        role: 'The River Source — Nurture',
        image: 'A mountain spring or the womb',
        description: 'Water that initiates emotional bonds. Summer solstice water protecting what it loves. Active protection and nurturing. Creates home, provides care.',
      },
      fixed: {
        sign: 'Scorpio',
        role: 'The Ice/Geyser — Depth',
        image: 'Deep ocean trench or glacier',
        description: 'Water sustained into unfathomable depth. Still on surface, infinite pressure underneath. Autumn water that transforms through intensity. Penetrates, bonds, regenerates.',
      },
      mutable: {
        sign: 'Pisces',
        role: 'The Mist — Transcendence',
        image: 'Fog, clouds, or the vast ocean',
        description: 'Water without boundaries. Late winter water dissolving all separation. Connecting everything to everything else. Feels everything, heals, transcends.',
      },
    },
  },
};

// =============================================================================
// MODALITY EDUCATION - Cardinal, Fixed, Mutable
// =============================================================================

export interface ModalityEducationData {
  modality: string;
  icon: string;
  label: string;
  title: string;
  metaphor: string;
  essence: string;
  seasonalRole: string;
  dayRange: string;
  energyPattern: string;
  strength: string;
  challenge: string;
  howYouMove: string;
  realLifeExample: string;
  inRelationships: string;
  theShadow: string;
  signs: string[];
  color: string;
}

export const MODALITY_EDUCATION: Record<string, ModalityEducationData> = {
  Cardinal: {
    modality: 'Cardinal',
    icon: '▶️',
    label: 'BEGINNING',
    title: 'The Spark Plug',
    metaphor: 'You are the match strike at the start of each season.',
    essence: 'Cardinal signs begin each season. They carry the raw, urgent energy of something new starting—like a rocket launch, the first domino, or opening night.',
    seasonalRole: 'Days 1-30 of each season — when the shift happens',
    dayRange: 'Days 1-30',
    energyPattern: 'Explosive, directional, launching — energy bursts forward and activates change',
    strength: 'Pioneering momentum, natural leadership, courage to begin what others fear',
    challenge: 'Finishing what you start before the next beginning calls to you',
    howYouMove: 'You don\'t need permission to begin. You feel the opening of a new chapter before anyone else, and you charge into it instinctively. Starting is oxygen. Stagnation is death.',
    realLifeExample: 'The friend who starts the group chat, suggests the road trip, launches the business—then hands it off once momentum is established.',
    inRelationships: 'You initiate connection with passion and directness. Partners need to keep up with your momentum and not feel threatened by your independence. You fall in love fast and expect action, not endless processing.',
    theShadow: 'Beginning types can sprint so fast they forget to look where they\'re going. Your engine is designed for the launch, not the marathon. Learn when sustaining matters more than starting over.',
    signs: ['Aries', 'Cancer', 'Libra', 'Capricorn'],
    color: '#ec4899',
  },
  Fixed: {
    modality: 'Fixed',
    icon: '⏺',
    label: 'CORE',
    title: 'The Engine',
    metaphor: 'You are the steady flame that burns at the heart of each season.',
    essence: 'Fixed signs occupy the middle of each season. They embody the full power of that season sustained—like bedrock, the sun at noon, or a beating heart.',
    seasonalRole: 'Days 31-60 of each season — when energy reaches full power',
    dayRange: 'Days 31-60',
    energyPattern: 'Sustained, concentrated, unwavering — energy holds steady and deepens mastery',
    strength: 'Unshakeable loyalty, perfecting mastery, radiating consistency others depend on',
    challenge: 'Knowing when to let go, even when you\'ve invested everything',
    howYouMove: 'You don\'t just start things—you make them last. Once you commit, you\'re all in. You build, you perfect, you sustain. Where others see "stuck," you see "committed."',
    realLifeExample: 'The friend who remembers everyone\'s birthday for 20 years, who perfects their craft for decades, who stays loyal when everyone else has left.',
    inRelationships: 'You love through consistency and presence. You need partners who appreciate your loyalty and won\'t pressure you to change faster than you\'re ready. Once committed, you\'re unshakeable.',
    theShadow: 'Core types can hold on so tightly to what\'s good they miss what could be better. Your engine resists change even when change would help you grow. Learn that releasing isn\'t betraying.',
    signs: ['Taurus', 'Leo', 'Scorpio', 'Aquarius'],
    color: '#f59e0b',
  },
  Mutable: {
    modality: 'Mutable',
    icon: '🔄',
    label: 'TRANSITION',
    title: 'The Bridge',
    metaphor: 'You are the wind that carries one season into the next.',
    essence: 'Mutable signs end each season. They carry the wisdom of what\'s ending and prepare for what\'s coming—like a river finding new paths, wind changing direction, or a chameleon.',
    seasonalRole: 'Days 61-90 of each season — when transformation begins',
    dayRange: 'Days 61-90',
    energyPattern: 'Flexible, adaptive, connecting — energy adjusts and bridges between phases',
    strength: 'Versatile wisdom, synthesizing insight, seeing connections others miss',
    challenge: 'Grounding yourself when everything is shifting around you',
    howYouMove: 'You thrive in the space between. Where others see endings or rigid categories, you see connections and possibilities. You translate, adapt, and prepare the world for what\'s next.',
    realLifeExample: 'The friend who speaks three languages, thrives in chaos, can talk to anyone anywhere, and somehow always knows what\'s coming next.',
    inRelationships: 'You love through mental connection and adaptability. You need partners who can keep up intellectually and won\'t cage your need for variety. You get bored before you get bitter.',
    theShadow: 'Transition types can pollinate so many flowers they forget to plant their own garden. Your engine is always moving to the next thing before deepening the current thing. Learn that commitment isn\'t a cage.',
    signs: ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'],
    color: '#14b8a6',
  },
};

// =============================================================================
// SIGN SEASONAL MEANING - How Each Sign Expresses Its Element × Modality
// =============================================================================

export interface SignSeasonalData {
  sign: string;
  symbol: string;
  element: string;
  modality: string;
  season: string;
  seasonPhase: string;
  elementRole: string;
  survivalInstinct: string;
  keyPhrase: string;
  seasonalMeaning: string;
  // Enhanced constitutional profile fields
  bornAt: string;
  environmentalReality: string[];
  psychologicalImprint: string;
  whyThisWay: string[];
  theFormula: {
    season: string;
    element: string;
    modality: string;
    result: string;
  };
  atBest: string[];
  underStress: string[];
  needs: string[];
  fears: string[];
  inRelationships: string;
  careerStrengths: string[];
  theShadow: string;
}

export const SIGN_SEASONAL_MEANINGS: Record<string, SignSeasonalData> = {
  Aries: {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    season: 'Spring',
    seasonPhase: 'Beginning of Spring',
    elementRole: 'The Spark',
    survivalInstinct: 'Act first — the window is now',
    keyPhrase: 'I initiate',
    seasonalMeaning: 'Born as light returns after winter darkness. Carries the primal urge to break through, to be first, to act before thinking. Pure life force pushing upward.',
    bornAt: 'The Spring Equinox—when day and night are perfectly equal and light begins winning',
    environmentalReality: [
      'Light is increasing after months of darkness',
      'Life is breaking dormancy everywhere',
      'Nothing is guaranteed—everything must fight to exist',
      'Speed and action determine who survives',
    ],
    psychologicalImprint: '"I must act to exist."',
    whyThisWay: [
      'Waiting feels like death',
      'Hesitation feels unnatural',
      'Instinct comes before reflection',
      'Courage is prioritized over caution',
    ],
    theFormula: {
      season: 'Spring (emergence energy)',
      element: 'Fire (inspiration fuel)',
      modality: 'Cardinal (initiating momentum)',
      result: 'The Match Strike That Ignites Growth',
    },
    atBest: ['Courageous', 'Pioneering', 'Enthusiastic', 'Direct', 'Honest'],
    underStress: ['Impulsive', 'Impatient', 'Combative', 'Self-focused', 'Reckless'],
    needs: ['Action', 'Challenge', 'Freedom', 'New beginnings', 'Autonomy'],
    fears: ['Stagnation', 'Weakness', 'Being controlled', 'Missing opportunities', 'Irrelevance'],
    inRelationships: 'Aries initiates connection with passion and directness. They need partners who can keep up with their momentum and won\'t be threatened by their independence. They fall in love fast and expect action, not endless processing.',
    careerStrengths: ['Entrepreneurship', 'Leadership', 'Crisis management', 'Starting ventures', 'Sales'],
    theShadow: 'Aries can sprint so fast they forget to look where they\'re going. Their Beginning momentum is designed for the launch, not the marathon. They may abandon what they start when the excitement fades.',
  },
  Taurus: {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    season: 'Spring',
    seasonPhase: 'Middle of Spring',
    elementRole: 'The Garden',
    survivalInstinct: 'Secure what\'s growing — build value',
    keyPhrase: 'I stabilize',
    seasonalMeaning: 'Born when spring is in full bloom. Carries the instinct to enjoy, accumulate, and make growth tangible. The builder who turns momentum into lasting form.',
    bornAt: 'Mid-Spring—when life is lush, warm, and fully established',
    environmentalReality: [
      'Growth is abundant and reliable',
      'Life has taken root and is flourishing',
      'Comfort and sensory pleasure are possible',
      'What exists now must be secured',
    ],
    psychologicalImprint: '"I must stabilize what has begun."',
    whyThisWay: [
      'Takes Aries\'s spark and builds something permanent',
      'Refuses to rush or be rushed',
      'Trusts what can be touched, tasted, felt',
      'Loyalty and consistency are survival skills',
    ],
    theFormula: {
      season: 'Spring (emergence energy)',
      element: 'Earth (manifestation fuel)',
      modality: 'Fixed (sustaining momentum)',
      result: 'The Soil That Makes Growth Permanent',
    },
    atBest: ['Reliable', 'Patient', 'Sensual', 'Grounded', 'Loyal'],
    underStress: ['Stubborn', 'Possessive', 'Materialistic', 'Resistant to change', 'Indulgent'],
    needs: ['Stability', 'Beauty', 'Physical comfort', 'Tangible progress', 'Security'],
    fears: ['Change', 'Scarcity', 'Being rushed', 'Loss of security', 'Chaos'],
    inRelationships: 'Taurus loves through consistency and physical presence. They need partners who appreciate their loyalty and won\'t pressure them to change faster than they\'re ready. Once committed, they\'re unshakeable.',
    careerStrengths: ['Finance', 'Craftsmanship', 'Design', 'Food/hospitality', 'Real estate'],
    theShadow: 'Taurus can hold on so tightly to what\'s good they miss what could be better. Their Fixed nature resists change even when change would help them grow. Comfort can become a cage.',
  },
  Gemini: {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    season: 'Spring',
    seasonPhase: 'End of Spring',
    elementRole: 'The Breeze',
    survivalInstinct: 'Gather information — adapt to change',
    keyPhrase: 'I connect',
    seasonalMeaning: 'Born as spring transitions to summer. Carries the instinct to learn quickly, share information, and bridge different worlds. The messenger preparing for the next phase.',
    bornAt: 'Late Spring—as the season prepares to become Summer',
    environmentalReality: [
      'Energy is buzzing, shifting, quickening',
      'Everything is moving and changing',
      'Information and pollination are essential',
      'Adaptability determines success',
    ],
    psychologicalImprint: '"I must connect and adapt."',
    whyThisWay: [
      'Born at the bridge between seasons',
      'Carries information from flower to flower',
      'Thrives in variety and movement',
      'Can\'t commit to one thing when everything is interesting',
    ],
    theFormula: {
      season: 'Spring (emergence energy)',
      element: 'Air (connection fuel)',
      modality: 'Mutable (adaptive momentum)',
      result: 'The Wind That Carries Spring Into Summer',
    },
    atBest: ['Curious', 'Articulate', 'Versatile', 'Witty', 'Quick-minded'],
    underStress: ['Scattered', 'Superficial', 'Anxious', 'Restless', 'Two-faced'],
    needs: ['Variety', 'Conversation', 'Learning', 'Mental stimulation', 'Freedom'],
    fears: ['Boredom', 'Being trapped', 'Missing information', 'Silence', 'Stagnation'],
    inRelationships: 'Gemini loves through conversation and mental connection. They need partners who can keep up intellectually and won\'t cage their curiosity. They get bored before they get bitter.',
    careerStrengths: ['Communication', 'Writing', 'Teaching', 'Sales', 'Journalism', 'Translation'],
    theShadow: 'Gemini can pollinate so many flowers they forget to plant their own garden. Their Mutable nature means always moving to the next thing before deepening the current thing.',
  },
  Cancer: {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    season: 'Summer',
    seasonPhase: 'Beginning of Summer',
    elementRole: 'The Spring',
    survivalInstinct: 'Protect what has grown — create safety',
    keyPhrase: 'I nurture',
    seasonalMeaning: 'Born at peak light, the summer solstice. Carries the instinct to protect, nurture, and create emotional safety. When abundance peaks, protection becomes essential.',
    bornAt: 'The Summer Solstice—the longest day, when light reaches its peak and must now be protected',
    environmentalReality: [
      'Light is at maximum—this is the peak',
      'What has grown is now vulnerable',
      'Protection becomes the primary drive',
      'Emotional bonds ensure collective survival',
    ],
    psychologicalImprint: '"What I love must be kept safe."',
    whyThisWay: [
      'Born when abundance peaks and loss becomes possible',
      'Feels responsible for protecting what matters',
      'Creates emotional safety before all else',
      'Memory and nostalgia serve protective instinct',
    ],
    theFormula: {
      season: 'Summer (protection energy)',
      element: 'Water (emotional fuel)',
      modality: 'Cardinal (initiating momentum)',
      result: 'The River Source That Initiates Care',
    },
    atBest: ['Nurturing', 'Protective', 'Intuitive', 'Loyal', 'Emotionally intelligent'],
    underStress: ['Moody', 'Clingy', 'Manipulative', 'Defensive', 'Living in the past'],
    needs: ['Emotional security', 'Home', 'Family', 'Belonging', 'To be needed'],
    fears: ['Abandonment', 'Rejection', 'Emotional exposure', 'Homelessness', 'Being forgotten'],
    inRelationships: 'Cancer loves through care and emotional attunement. They need partners who value home and emotional safety. They remember everything and expect loyalty in return.',
    careerStrengths: ['Caregiving', 'Real estate', 'Hospitality', 'Counseling', 'History', 'Food'],
    theShadow: 'Cancer can protect so fiercely they smother what they love. Their Cardinal Water energy can become controlling disguised as caring. They may use guilt as a tool.',
  },
  Leo: {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    season: 'Summer',
    seasonPhase: 'Middle of Summer',
    elementRole: 'The Flame',
    survivalInstinct: 'Radiate — express your full power',
    keyPhrase: 'I create',
    seasonalMeaning: 'Born during summer\'s full radiance. Carries the instinct to shine, create, and express without apology. The sustained warmth that draws others into its orbit.',
    bornAt: 'Mid-Summer—when the Sun is fully dominant and life celebrates its peak',
    environmentalReality: [
      'Light and warmth are at full strength',
      'Life is celebrating at its maximum expression',
      'Radiance draws everything toward it',
      'This is the time to shine, not hide',
    ],
    psychologicalImprint: '"I must radiate to exist."',
    whyThisWay: [
      'Born when the Sun rules absolutely',
      'Carries summer\'s confidence and warmth',
      'Needs to be seen and appreciated',
      'Creative expression is as essential as breathing',
    ],
    theFormula: {
      season: 'Summer (radiance energy)',
      element: 'Fire (inspiration fuel)',
      modality: 'Fixed (sustaining momentum)',
      result: 'The Hearth That Sustains Warmth',
    },
    atBest: ['Generous', 'Creative', 'Warm', 'Confident', 'Inspiring'],
    underStress: ['Arrogant', 'Dramatic', 'Attention-seeking', 'Dominating', 'Fragile ego'],
    needs: ['Recognition', 'Appreciation', 'Creative expression', 'Loyalty', 'Admiration'],
    fears: ['Being ignored', 'Mediocrity', 'Humiliation', 'Irrelevance', 'Criticism'],
    inRelationships: 'Leo loves with generosity and grand gestures. They need partners who appreciate their warmth and won\'t compete for the spotlight. Loyalty is non-negotiable.',
    careerStrengths: ['Entertainment', 'Leadership', 'Teaching', 'Performance', 'Marketing', 'Design'],
    theShadow: 'Leo can become so focused on being seen that they forget to see others. Their Fixed Fire can demand constant validation. Generosity may come with strings attached.',
  },
  Virgo: {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    season: 'Summer',
    seasonPhase: 'End of Summer',
    elementRole: 'The Harvest',
    survivalInstinct: 'Analyze and refine — prepare for scarcity',
    keyPhrase: 'I perfect',
    seasonalMeaning: 'Born as summer ends and harvest begins. Carries the instinct to analyze, organize, and turn abundance into usefulness. The editor who refines before winter comes.',
    bornAt: 'Late Summer—as the harvest approaches and preparation becomes urgent',
    environmentalReality: [
      'Abundance must now be processed',
      'What isn\'t refined will be wasted',
      'Analysis determines what survives',
      'Service to the whole becomes critical',
    ],
    psychologicalImprint: '"I must perfect what exists."',
    whyThisWay: [
      'Born when the harvest must be sorted',
      'Sees flaws that others miss',
      'Feels compelled to improve and serve',
      'Believes perfection is protection against chaos',
    ],
    theFormula: {
      season: 'Summer (refinement energy)',
      element: 'Earth (practical fuel)',
      modality: 'Mutable (adaptive momentum)',
      result: 'The Harvest That Refines for Survival',
    },
    atBest: ['Analytical', 'Helpful', 'Precise', 'Modest', 'Health-conscious'],
    underStress: ['Critical', 'Anxious', 'Perfectionist', 'Self-doubting', 'Nitpicking'],
    needs: ['Order', 'Usefulness', 'Improvement', 'Health', 'To serve'],
    fears: ['Chaos', 'Uselessness', 'Illness', 'Imperfection', 'Being criticized'],
    inRelationships: 'Virgo loves through acts of service and practical support. They need partners who appreciate their attention to detail and won\'t dismiss their need for order.',
    careerStrengths: ['Healthcare', 'Analysis', 'Editing', 'Nutrition', 'Organization', 'Quality control'],
    theShadow: 'Virgo can analyze so much they forget to live. Their Mutable Earth can become paralyzed by imperfection. Helpful criticism can become hurtful.',
  },
  Libra: {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    season: 'Autumn',
    seasonPhase: 'Beginning of Autumn',
    elementRole: 'The Bridge',
    survivalInstinct: 'Form partnerships — survival requires others',
    keyPhrase: 'I balance',
    seasonalMeaning: 'Born at the autumn equinox, day equals night. Carries the instinct to connect, balance, and understand through relationship. When light diminishes, social bonds become survival.',
    bornAt: 'The Autumn Equinox—when day and night are perfectly equal and awareness of the Other awakens',
    environmentalReality: [
      'Light and dark are in perfect balance',
      'Decline is beginning—resources will decrease',
      'Cooperation becomes essential for survival',
      'What isn\'t shared may be lost',
    ],
    psychologicalImprint: '"I must relate to survive."',
    whyThisWay: [
      'Born at the balance point of the year',
      'Sees both sides of every equation',
      'Believes fairness is survival strategy',
      'Partnership is not optional—it\'s essential',
    ],
    theFormula: {
      season: 'Autumn (relationship energy)',
      element: 'Air (connection fuel)',
      modality: 'Cardinal (initiating momentum)',
      result: 'The Breeze That Initiates Partnership',
    },
    atBest: ['Diplomatic', 'Fair', 'Charming', 'Harmonious', 'Aesthetic'],
    underStress: ['Indecisive', 'People-pleasing', 'Avoidant', 'Superficial', 'Passive-aggressive'],
    needs: ['Harmony', 'Partnership', 'Beauty', 'Fairness', 'Peace'],
    fears: ['Conflict', 'Loneliness', 'Injustice', 'Ugliness', 'Being disliked'],
    inRelationships: 'Libra loves through partnership and compromise. They need partners who value fairness and appreciate beauty. They\'d rather bend than break a relationship.',
    careerStrengths: ['Law', 'Diplomacy', 'Design', 'Counseling', 'Art', 'Mediation'],
    theShadow: 'Libra can balance so much for others they forget their own center. Their Cardinal Air may initiate relationships to avoid being alone. Harmony can become avoidance.',
  },
  Scorpio: {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    season: 'Autumn',
    seasonPhase: 'Middle of Autumn',
    elementRole: 'The Well',
    survivalInstinct: 'Go deep — transformation through intensity',
    keyPhrase: 'I transform',
    seasonalMeaning: 'Born as darkness deepens and leaves fall. Carries the instinct to penetrate surface appearances, form intense bonds, and transform through crisis. Death and rebirth energy.',
    bornAt: 'Mid-Autumn—when darkness is winning and only what\'s deep survives',
    environmentalReality: [
      'Darkness is increasing rapidly',
      'Surface appearances are falling away (leaves)',
      'Only what has roots will survive',
      'Death and transformation are visible everywhere',
    ],
    psychologicalImprint: '"I must go deep to survive."',
    whyThisWay: [
      'Born when everything shallow dies',
      'Trusts only what survives scrutiny',
      'Intensity is a survival strategy',
      'Transformation through crisis is natural',
    ],
    theFormula: {
      season: 'Autumn (transformation energy)',
      element: 'Water (emotional fuel)',
      modality: 'Fixed (sustaining momentum)',
      result: 'The Ice That Sustains Depth',
    },
    atBest: ['Perceptive', 'Loyal', 'Transformative', 'Passionate', 'Resilient'],
    underStress: ['Jealous', 'Secretive', 'Manipulative', 'Vengeful', 'Obsessive'],
    needs: ['Depth', 'Truth', 'Intensity', 'Loyalty', 'Control'],
    fears: ['Betrayal', 'Vulnerability', 'Superficiality', 'Loss of control', 'Being exposed'],
    inRelationships: 'Scorpio loves with total intensity or not at all. They need partners who can handle depth and won\'t betray trust. Once wounded, they never forget.',
    careerStrengths: ['Psychology', 'Research', 'Investigation', 'Surgery', 'Finance', 'Crisis management'],
    theShadow: 'Scorpio can go so deep they forget there\'s a surface. Their Fixed Water may hold grudges forever. Intensity can become obsession. Protection can become control.',
  },
  Sagittarius: {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    season: 'Autumn',
    seasonPhase: 'End of Autumn',
    elementRole: 'The Torch',
    survivalInstinct: 'Seek meaning — find truth beyond limits',
    keyPhrase: 'I explore',
    seasonalMeaning: 'Born as autumn gives way to winter. Carries the instinct to find meaning, explore horizons, and carry light into darkness. The philosopher preparing for the long night.',
    bornAt: 'Late Autumn—as the year prepares for its darkest chapter and meaning must be found',
    environmentalReality: [
      'Darkness is approaching its peak',
      'Physical expansion contracts; mental expansion begins',
      'Meaning and philosophy become essential',
      'The torch must be carried forward',
    ],
    psychologicalImprint: '"I must find meaning beyond this."',
    whyThisWay: [
      'Born when physical limits are reached',
      'Seeks truth that transcends circumstance',
      'Optimism is a survival strategy for dark times',
      'Adventure is how they find answers',
    ],
    theFormula: {
      season: 'Autumn (transcendence energy)',
      element: 'Fire (inspiration fuel)',
      modality: 'Mutable (adaptive momentum)',
      result: 'The Torch That Carries Light Into Darkness',
    },
    atBest: ['Optimistic', 'Philosophical', 'Adventurous', 'Honest', 'Generous'],
    underStress: ['Tactless', 'Restless', 'Preachy', 'Commitment-phobic', 'Exaggerating'],
    needs: ['Freedom', 'Meaning', 'Adventure', 'Truth', 'Expansion'],
    fears: ['Confinement', 'Meaninglessness', 'Boredom', 'Routine', 'Small-mindedness'],
    inRelationships: 'Sagittarius loves through shared adventures and philosophical connection. They need partners who value freedom and won\'t try to cage them. They need room to roam.',
    careerStrengths: ['Teaching', 'Travel', 'Publishing', 'Philosophy', 'Law', 'Sports'],
    theShadow: 'Sagittarius can seek meaning so far away they miss what\'s right here. Their Mutable Fire may promise more than it delivers. Truth-telling can become tactlessness.',
  },
  Capricorn: {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    season: 'Winter',
    seasonPhase: 'Beginning of Winter',
    elementRole: 'The Foundation',
    survivalInstinct: 'Build systems — structure ensures survival',
    keyPhrase: 'I achieve',
    seasonalMeaning: 'Born at the winter solstice, the darkest moment. Carries the instinct to build, structure, and create lasting systems. When resources are scarce, discipline is survival.',
    bornAt: 'The Winter Solstice—the darkest day, when only structure ensures survival',
    environmentalReality: [
      'Darkness is at its maximum',
      'Resources are at their scarcest',
      'Only discipline and structure ensure survival',
      'But light begins returning—hope exists',
    ],
    psychologicalImprint: '"I must build to endure."',
    whyThisWay: [
      'Born when nothing is given freely',
      'Believes effort is the only guarantee',
      'Builds systems because systems survive',
      'Takes responsibility because someone must',
    ],
    theFormula: {
      season: 'Winter (structure energy)',
      element: 'Earth (practical fuel)',
      modality: 'Cardinal (initiating momentum)',
      result: 'The Mountain That Initiates Structure',
    },
    atBest: ['Disciplined', 'Responsible', 'Ambitious', 'Patient', 'Wise'],
    underStress: ['Cold', 'Pessimistic', 'Workaholic', 'Status-obsessed', 'Controlling'],
    needs: ['Achievement', 'Structure', 'Respect', 'Legacy', 'Authority'],
    fears: ['Failure', 'Chaos', 'Poverty', 'Disrespect', 'Uselessness'],
    inRelationships: 'Capricorn loves through commitment and providing. They need partners who respect their ambition and understand their need for achievement. They show love through building.',
    careerStrengths: ['Management', 'Finance', 'Government', 'Architecture', 'Engineering', 'CEO'],
    theShadow: 'Capricorn can build so much they forget why they started. Their Cardinal Earth may sacrifice joy for achievement. Responsibility can become burden they resent.',
  },
  Aquarius: {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    season: 'Winter',
    seasonPhase: 'Middle of Winter',
    elementRole: 'The Current',
    survivalInstinct: 'Innovate — progress serves the collective',
    keyPhrase: 'I know',
    seasonalMeaning: 'Born in winter\'s clarity. Carries the instinct to think independently, challenge convention, and serve collective progress. Fixed air that sustains vision across time.',
    bornAt: 'Mid-Winter—when survival requires innovation and collective thinking',
    environmentalReality: [
      'Scarcity forces innovation',
      'Individual survival depends on collective',
      'Old ways must be questioned',
      'Vision must be sustained through darkness',
    ],
    psychologicalImprint: '"I must innovate for the collective."',
    whyThisWay: [
      'Born when individual solutions fail',
      'Sees systems that others don\'t see',
      'Believes progress serves everyone',
      'Challenges convention because survival demands it',
    ],
    theFormula: {
      season: 'Winter (innovation energy)',
      element: 'Air (intellectual fuel)',
      modality: 'Fixed (sustaining momentum)',
      result: 'The Atmosphere That Sustains Vision',
    },
    atBest: ['Innovative', 'Humanitarian', 'Independent', 'Visionary', 'Original'],
    underStress: ['Detached', 'Eccentric', 'Rebellious', 'Emotionally unavailable', 'Contrarian'],
    needs: ['Freedom', 'Intellectual stimulation', 'Community', 'Uniqueness', 'Progress'],
    fears: ['Conformity', 'Emotional demands', 'Limitation', 'Being ordinary', 'Stagnation'],
    inRelationships: 'Aquarius loves through intellectual connection and friendship. They need partners who respect their independence and share their values. Emotional demands may feel suffocating.',
    careerStrengths: ['Technology', 'Social causes', 'Science', 'Innovation', 'Humanitarian work', 'Networks'],
    theShadow: 'Aquarius can think so globally they forget the person in front of them. Their Fixed Air may become rigid in ideas while demanding others change. Detachment can become coldness.',
  },
  Pisces: {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    season: 'Winter',
    seasonPhase: 'End of Winter',
    elementRole: 'The Ocean',
    survivalInstinct: 'Dissolve boundaries — prepare for rebirth',
    keyPhrase: 'I believe',
    seasonalMeaning: 'Born as winter yields to spring. Carries the instinct to dissolve, transcend, and prepare for renewal. The mystic who feels the entire cycle completing.',
    bornAt: 'Late Winter—as the cycle prepares to end and begin again',
    environmentalReality: [
      'The old cycle is ending',
      'Boundaries between seasons dissolve',
      'What was separate merges',
      'Rebirth requires release of what was',
    ],
    psychologicalImprint: '"I must dissolve to transform."',
    whyThisWay: [
      'Born at the end of the entire cycle',
      'Feels everything and everyone',
      'Boundaries seem arbitrary',
      'Knows that endings are beginnings',
    ],
    theFormula: {
      season: 'Winter (transcendence energy)',
      element: 'Water (emotional fuel)',
      modality: 'Mutable (adaptive momentum)',
      result: 'The Mist That Dissolves for Rebirth',
    },
    atBest: ['Compassionate', 'Intuitive', 'Creative', 'Spiritual', 'Healing'],
    underStress: ['Escapist', 'Confused', 'Victim mentality', 'Boundary-less', 'Addictive'],
    needs: ['Transcendence', 'Creative expression', 'Spiritual connection', 'Solitude', 'Beauty'],
    fears: ['Harsh reality', 'Being trapped in the mundane', 'Emotional overwhelm', 'Cruelty', 'Disconnection from the divine'],
    inRelationships: 'Pisces loves through empathy and spiritual connection. They need partners who appreciate their sensitivity and won\'t exploit their compassion. They merge completely or not at all.',
    careerStrengths: ['Arts', 'Healing', 'Spirituality', 'Music', 'Film', 'Counseling', 'Charity'],
    theShadow: 'Pisces can dissolve so completely they forget who they are. Their Mutable Water may escape rather than face reality. Compassion can become enabling or martyrdom.',
  },
};

// =============================================================================
// SEASONAL SURVIVAL BIBLE - The Mirror
// =============================================================================
// "Your rhythm is not a flaw. It's a function."
// =============================================================================

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type ResonanceState = 'Aligned' | 'Neutral' | 'Challenged';

/**
 * SEASONAL_PROFILE - The Canonical Mapping
 *
 * Each sign has a home season (where they lead naturally) and a challenging
 * season (where they operate outside their natural rhythm).
 *
 * This is ecological truth, not opinion.
 */
export const SEASONAL_PROFILE: Record<string, { home: Season; challenge: Season }> = {
  // Spring-born: Home in Spring, Challenged in Winter
  Aries: { home: 'Spring', challenge: 'Winter' },
  Taurus: { home: 'Spring', challenge: 'Winter' },
  Gemini: { home: 'Spring', challenge: 'Winter' },

  // Summer-born: Home in Summer, Challenged in Winter
  Cancer: { home: 'Summer', challenge: 'Winter' },
  Leo: { home: 'Summer', challenge: 'Winter' },
  Virgo: { home: 'Summer', challenge: 'Winter' },

  // Autumn-born: Home in Autumn, Challenged in Spring
  Libra: { home: 'Autumn', challenge: 'Spring' },
  Scorpio: { home: 'Autumn', challenge: 'Spring' },
  Sagittarius: { home: 'Autumn', challenge: 'Spring' },

  // Winter-born: Home in Winter, Challenged in Summer
  Capricorn: { home: 'Winter', challenge: 'Summer' },
  Aquarius: { home: 'Winter', challenge: 'Summer' },
  Pisces: { home: 'Winter', challenge: 'Summer' },
};

/**
 * getSeasonalResonance - Determines how aligned a sign is with the current season
 *
 * @param natalSeason - The season the person was born in
 * @param currentSeason - The current season
 * @returns ResonanceState - Aligned, Neutral, or Challenged
 */
export function getSeasonalResonance(
  natalSeason: Season,
  currentSeason: Season
): ResonanceState {
  if (natalSeason === currentSeason) return 'Aligned';

  // Opposite seasons create challenge
  if (
    (natalSeason === 'Spring' && currentSeason === 'Autumn') ||
    (natalSeason === 'Autumn' && currentSeason === 'Spring') ||
    (natalSeason === 'Summer' && currentSeason === 'Winter') ||
    (natalSeason === 'Winter' && currentSeason === 'Summer')
  ) return 'Challenged';

  return 'Neutral';
}

/**
 * getSignSeason - Returns the natal season for a given sign
 */
export function getSignSeason(sign: string): Season {
  const signData = SIGN_SEASONAL_MEANINGS[sign];
  return (signData?.season as Season) || 'Spring';
}

/**
 * getCurrentSeason - Returns the current season based on date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Approximate tropical season boundaries
  // Spring: Mar 20 - Jun 20
  // Summer: Jun 21 - Sep 22
  // Autumn: Sep 23 - Dec 21
  // Winter: Dec 22 - Mar 19

  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
    return 'Spring';
  }
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 22)) {
    return 'Summer';
  }
  if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day <= 21)) {
    return 'Autumn';
  }
  return 'Winter';
}

// =============================================================================
// SEASONAL RESONANCE NARRATIVES
// =============================================================================

export interface SeasonalResonanceNarrative {
  state: ResonanceState;
  icon: string;
  color: string;
  title: string;
  validation: string;
  guidance: {
    leanInto: string[];
    release: string[];
  };
}

/**
 * SEASONAL_RESONANCE_NARRATIVES - The Mirror Content
 *
 * These narratives validate the user's experience and provide gentle guidance.
 * No judgment. Just truth.
 */
export const SEASONAL_RESONANCE_NARRATIVES: Record<Season, Record<Season, SeasonalResonanceNarrative>> = {
  // Spring-born in each season
  Spring: {
    Spring: {
      state: 'Aligned',
      icon: '🌱',
      color: '#4ade80',
      title: 'Your Home Season',
      validation: 'You were born when growth was visible and effort produced results. Now is your natural time to lead, initiate, and build. Your nervous system feels supported. This is when your instincts are most reliable.',
      guidance: {
        leanInto: [
          'Start the projects you\'ve been contemplating',
          'Trust your urgency—it\'s aligned with nature',
          'Lead where others hesitate',
          'Let your momentum carry others forward',
        ],
        release: [
          'Guilt about moving faster than others',
          'Waiting for permission to begin',
          'Over-planning when action is called for',
        ],
      },
    },
    Summer: {
      state: 'Neutral',
      icon: '☀️',
      color: '#fbbf24',
      title: 'Adjacent Season',
      validation: 'Summer follows your natural spring energy. The growth you initiated is now being protected and sustained. You may feel others taking the lead on nurturing what you started—this is natural, not rejection.',
      guidance: {
        leanInto: [
          'Let others sustain what you initiated',
          'Enjoy the fruits of earlier action',
          'Rest without guilt—you earned it',
          'Support those in their home season',
        ],
        release: [
          'The need to keep starting new things',
          'Frustration when growth plateaus',
          'Impatience with sustained effort',
        ],
      },
    },
    Autumn: {
      state: 'Challenged',
      icon: '🍂',
      color: '#f97316',
      title: 'Opposite Season',
      validation: 'Autumn asks for partnership, depth, and letting go—the opposite of spring\'s independent action. You may feel the urge to start new things while the season asks you to deepen existing bonds. This tension is real, not imagined.',
      guidance: {
        leanInto: [
          'Slow down without feeling defeated',
          'Deepen one relationship instead of starting many',
          'Find meaning in what already exists',
          'Let autumn types lead for now',
        ],
        release: [
          'The need to always be first',
          'Judgment of others\' slower pace',
          'Resistance to partnership and cooperation',
        ],
      },
    },
    Winter: {
      state: 'Challenged',
      icon: '❄️',
      color: '#94a3b8',
      title: 'Your Challenging Season',
      validation: 'Winter asks for patience without visible progress—the hardest thing for spring energy. You were built to grow, not to endure. This season may feel like waiting without building. The discomfort is natural, not a flaw.',
      guidance: {
        leanInto: [
          'Preparation over action',
          'Planning without executing yet',
          'Storing energy for spring\'s return',
          'Trusting that dormancy serves growth',
        ],
        release: [
          'Pressure to be productive',
          'Guilt about slowing down',
          'Forcing growth in frozen ground',
        ],
      },
    },
  },

  // Summer-born in each season
  Summer: {
    Spring: {
      state: 'Neutral',
      icon: '🌱',
      color: '#4ade80',
      title: 'Adjacent Season',
      validation: 'Spring initiates what you will protect. You may feel others racing ahead while you\'re preparing to nurture. This is natural—your time to lead comes next.',
      guidance: {
        leanInto: [
          'Let spring types do the initiating',
          'Prepare to receive what they start',
          'Build your nest for what\'s coming',
          'Trust your protective instincts are preparing',
        ],
        release: [
          'Frustration with others\' recklessness',
          'The need to protect what hasn\'t grown yet',
          'Rushing your own readiness',
        ],
      },
    },
    Summer: {
      state: 'Aligned',
      icon: '☀️',
      color: '#fbbf24',
      title: 'Your Home Season',
      validation: 'You were born at peak light, when abundance needed protection. Now is your natural time to nurture, sustain, and perfect. Your instinct to care and express is fully supported by the season.',
      guidance: {
        leanInto: [
          'Protect what has grown',
          'Express yourself fully',
          'Nurture your people and projects',
          'Let your warmth draw others in',
        ],
        release: [
          'Fear of being too much',
          'Holding back your radiance',
          'Apologizing for taking care of others',
        ],
      },
    },
    Autumn: {
      state: 'Neutral',
      icon: '🍂',
      color: '#f97316',
      title: 'Adjacent Season',
      validation: 'Autumn begins releasing what you protected. Watching things let go can feel like loss to summer energy. Remember: autumn\'s release makes space for future growth.',
      guidance: {
        leanInto: [
          'Allow natural completion',
          'Let autumn types lead the transition',
          'Find peace in what was rather than what remains',
          'Trust that letting go isn\'t abandonment',
        ],
        release: [
          'The urge to protect everything forever',
          'Grief over natural endings',
          'Resistance to change',
        ],
      },
    },
    Winter: {
      state: 'Challenged',
      icon: '❄️',
      color: '#94a3b8',
      title: 'Your Challenging Season',
      validation: 'Winter\'s coldness challenges your warmth. You were built to nurture, not to endure scarcity. The season may feel emotionally draining. This isn\'t weakness—it\'s seasonal mismatch.',
      guidance: {
        leanInto: [
          'Conserve your warmth for those closest',
          'Accept help from winter types',
          'Let structure replace constant nurturing',
          'Trust that spring will restore your energy',
        ],
        release: [
          'Guilt about not caring for everyone',
          'The need to be constantly giving',
          'Fighting the natural contraction',
        ],
      },
    },
  },

  // Autumn-born in each season
  Autumn: {
    Spring: {
      state: 'Challenged',
      icon: '🌱',
      color: '#4ade80',
      title: 'Your Challenging Season',
      validation: 'Spring\'s individual action challenges your partnership instinct. You were built to relate, not to race ahead alone. The season may feel naive or rushed to you. This tension is valid.',
      guidance: {
        leanInto: [
          'Let spring types lead the charge',
          'Observe rather than judge the rush',
          'Find partners for your autumn projects',
          'Trust that your depth will be needed later',
        ],
        release: [
          'Frustration with others\' independence',
          'The need to immediately deepen every connection',
          'Judgment of surface-level enthusiasm',
        ],
      },
    },
    Summer: {
      state: 'Neutral',
      icon: '☀️',
      color: '#fbbf24',
      title: 'Adjacent Season',
      validation: 'Summer sustains what autumn will deepen. You may find summer\'s constant radiance overwhelming. Your time for intensity comes next—be patient.',
      guidance: {
        leanInto: [
          'Enjoy the abundance without needing depth',
          'Let summer types maintain the warmth',
          'Store observations for autumn\'s analysis',
          'Rest in simplicity before complexity',
        ],
        release: [
          'The need to make everything meaningful immediately',
          'Exhaustion from sustained brightness',
          'Judgment of summer\'s apparent superficiality',
        ],
      },
    },
    Autumn: {
      state: 'Aligned',
      icon: '🍂',
      color: '#f97316',
      title: 'Your Home Season',
      validation: 'You were born when light and dark balanced, when partnership became survival. Now is your natural time to connect deeply, transform, and find meaning. Your instincts for relationship and depth are fully supported.',
      guidance: {
        leanInto: [
          'Deepen your important relationships',
          'Lead the transitions others resist',
          'Find meaning in complexity',
          'Transform what needs to change',
        ],
        release: [
          'Fear of going too deep',
          'Apologizing for your intensity',
          'Pretending things are simpler than they are',
        ],
      },
    },
    Winter: {
      state: 'Neutral',
      icon: '❄️',
      color: '#94a3b8',
      title: 'Adjacent Season',
      validation: 'Winter builds structure from autumn\'s transformation. You may find winter\'s coldness isolating after autumn\'s partnership focus. The bonds you forged will sustain through the scarcity.',
      guidance: {
        leanInto: [
          'Let winter types build the structures',
          'Trust the bonds you\'ve already formed',
          'Accept that some relating must pause',
          'Preserve depth over breadth',
        ],
        release: [
          'The need for constant connection',
          'Resistance to solitude',
          'Fear that distance means disconnection',
        ],
      },
    },
  },

  // Winter-born in each season
  Winter: {
    Spring: {
      state: 'Neutral',
      icon: '🌱',
      color: '#4ade80',
      title: 'Adjacent Season',
      validation: 'Spring releases what winter conserved. Watching others spend freely what you saved can feel wasteful. Remember: the structures you built make spring\'s growth possible.',
      guidance: {
        leanInto: [
          'Let spring types spend the stored energy',
          'Watch your plans become action',
          'Trust the foundation you built',
          'Allow controlled expansion',
        ],
        release: [
          'The urge to control the spending',
          'Judgment of spring\'s apparent waste',
          'Fear that growth will undo your work',
        ],
      },
    },
    Summer: {
      state: 'Challenged',
      icon: '☀️',
      color: '#fbbf24',
      title: 'Your Challenging Season',
      validation: 'Summer\'s constant light and warmth challenges your need for structure and shade. You were built to endure, not to radiate. The season may feel overwhelming or draining. This isn\'t coldness—it\'s energy conservation.',
      guidance: {
        leanInto: [
          'Find shade and structure within the abundance',
          'Let summer types handle the constant warmth',
          'Maintain your routines despite the chaos',
          'Trust that winter will restore your rhythm',
        ],
        release: [
          'Pressure to be constantly warm and available',
          'Guilt about needing solitude in social seasons',
          'The expectation to enjoy peak light',
        ],
      },
    },
    Autumn: {
      state: 'Neutral',
      icon: '🍂',
      color: '#f97316',
      title: 'Adjacent Season',
      validation: 'Autumn prepares for your home season. The letting go you witness is making space for your structured leadership. Your time is approaching—prepare.',
      guidance: {
        leanInto: [
          'Observe autumn\'s transitions',
          'Plan for winter\'s leadership role',
          'Accept the partnerships autumn offers',
          'Let meaning emerge before building on it',
        ],
        release: [
          'Impatience with the transition process',
          'The urge to structure before things settle',
          'Resistance to emotional complexity',
        ],
      },
    },
    Winter: {
      state: 'Aligned',
      icon: '❄️',
      color: '#94a3b8',
      title: 'Your Home Season',
      validation: 'You were born when survival required discipline and every choice mattered. Now is your natural time to build, structure, and lead through scarcity. Your instincts for long-term thinking are fully supported.',
      guidance: {
        leanInto: [
          'Build the systems others will need',
          'Lead where structure is required',
          'Trust your endurance',
          'Plan for the long term without apology',
        ],
        release: [
          'Guilt about thriving when others struggle',
          'Pressure to be warm and sunny',
          'Apologizing for your discipline',
        ],
      },
    },
  },
};

// =============================================================================
// SEASONAL APPRECIATION STATEMENTS - For Pod/Compatibility View
// =============================================================================

export interface SeasonalAppreciationStatement {
  forSign: string;
  whenTheyAre: string;
  statement: string;
  reframe: string;
}

/**
 * Generate appreciation statements that reframe differences as seasonal functions.
 * "They're not difficult—they're seasonal."
 */
export function generateSeasonalAppreciation(
  signA: string,
  signB: string,
  currentSeason: Season
): { aToB: SeasonalAppreciationStatement; bToA: SeasonalAppreciationStatement } {
  const seasonA = getSignSeason(signA);
  const seasonB = getSignSeason(signB);
  const resonanceA = getSeasonalResonance(seasonA, currentSeason);
  const resonanceB = getSeasonalResonance(seasonB, currentSeason);

  const statements = {
    // A understanding B
    aToB: generateStatementForPair(signA, signB, seasonA, seasonB, resonanceB, currentSeason),
    // B understanding A
    bToA: generateStatementForPair(signB, signA, seasonB, seasonA, resonanceA, currentSeason),
  };

  return statements;
}

function generateStatementForPair(
  observerSign: string,
  observedSign: string,
  observerSeason: Season,
  observedSeason: Season,
  observedResonance: ResonanceState,
  currentSeason: Season
): SeasonalAppreciationStatement {
  // If observed is challenged this season
  if (observedResonance === 'Challenged') {
    return {
      forSign: observerSign,
      whenTheyAre: `${observedSign} is in their challenging season`,
      statement: `When ${observedSign} slows down in ${currentSeason}, they are conserving energy—not withdrawing from you.`,
      reframe: `Their ${observedSeason} nature needs extra support during ${currentSeason}. This is seasonal mismatch, not character flaw.`,
    };
  }

  // If observed is aligned this season
  if (observedResonance === 'Aligned') {
    return {
      forSign: observerSign,
      whenTheyAre: `${observedSign} is in their home season`,
      statement: `When ${observedSign} takes the lead in ${currentSeason}, they are following their natural rhythm—not trying to control you.`,
      reframe: `Let them lead during ${currentSeason}. Their ${observedSeason} instincts are most reliable now.`,
    };
  }

  // Neutral
  return {
    forSign: observerSign,
    whenTheyAre: `${observedSign} is in a neutral season`,
    statement: `${observedSign} is operating at a steady pace during ${currentSeason}.`,
    reframe: `This is a good time for balanced collaboration. Neither of you is at your peak or valley.`,
  };
}

// =============================================================================
// POD LEADERSHIP ROTATION - "In this season, let them lead"
// =============================================================================

export interface SeasonalLeadershipGuidance {
  currentSeason: Season;
  naturalLeaders: string[];  // Signs in their home season
  needsSupport: string[];    // Signs in their challenged season
  leadershipAdvice: string;
  supportAdvice: string;
}

export function getPodLeadershipGuidance(
  signs: string[],
  currentSeason: Season
): SeasonalLeadershipGuidance {
  const naturalLeaders: string[] = [];
  const needsSupport: string[] = [];

  signs.forEach(sign => {
    const signSeason = getSignSeason(sign);
    const resonance = getSeasonalResonance(signSeason, currentSeason);

    if (resonance === 'Aligned') {
      naturalLeaders.push(sign);
    } else if (resonance === 'Challenged') {
      needsSupport.push(sign);
    }
  });

  const seasonDescriptions: Record<Season, { leaderAdvice: string; supportAdvice: string }> = {
    Spring: {
      leaderAdvice: 'Spring energy leads now—let initiators start new things.',
      supportAdvice: 'Autumn signs may feel rushed; give them time to find meaning.',
    },
    Summer: {
      leaderAdvice: 'Summer energy sustains now—let nurturers protect what\'s grown.',
      supportAdvice: 'Winter signs may feel drained; honor their need for shade and structure.',
    },
    Autumn: {
      leaderAdvice: 'Autumn energy deepens now—let transformers lead difficult conversations.',
      supportAdvice: 'Spring signs may feel impatient; help them see value in slowing down.',
    },
    Winter: {
      leaderAdvice: 'Winter energy builds now—let strategists create lasting structures.',
      supportAdvice: 'Summer signs may feel cold; offer warmth without expecting full radiance.',
    },
  };

  return {
    currentSeason,
    naturalLeaders,
    needsSupport,
    leadershipAdvice: seasonDescriptions[currentSeason].leaderAdvice,
    supportAdvice: seasonDescriptions[currentSeason].supportAdvice,
  };
}

// =============================================================================
// SEASONAL SURVIVAL BIBLE - The Complete Mirror
// =============================================================================

export interface SeasonalMirrorReading {
  sign: string;
  natalSeason: Season;
  currentSeason: Season;
  resonance: ResonanceState;
  narrative: SeasonalResonanceNarrative;
  homeSeasonDescription: string;
  challengeSeasonDescription: string;
}

/**
 * getSeasonalMirrorReading - The complete mirror for a single user
 *
 * Returns everything needed to show someone their seasonal truth:
 * - Who they are (natal season)
 * - Where they are (current season)
 * - How they feel (resonance)
 * - What to do (guidance)
 */
export function getSeasonalMirrorReading(
  sign: string,
  currentDate: Date = new Date()
): SeasonalMirrorReading {
  const natalSeason = getSignSeason(sign);
  const currentSeason = getCurrentSeason(currentDate);
  const resonance = getSeasonalResonance(natalSeason, currentSeason);
  const narrative = SEASONAL_RESONANCE_NARRATIVES[natalSeason][currentSeason];
  const profile = SEASONAL_PROFILE[sign];

  const homeDescriptions: Record<Season, string> = {
    Spring: 'This is when your nervous system feels supported. Growth is visible, effort produces results, and your instincts to initiate are aligned with nature.',
    Summer: 'This is when your nervous system feels supported. Abundance surrounds you, nurturing is valued, and your instincts to protect are aligned with nature.',
    Autumn: 'This is when your nervous system feels supported. Partnership matters, depth is honored, and your instincts to connect are aligned with nature.',
    Winter: 'This is when your nervous system feels supported. Structure is valued, discipline is rewarded, and your instincts to build are aligned with nature.',
  };

  const challengeDescriptions: Record<Season, string> = {
    Spring: 'This season asks you to operate outside your natural rhythm. The rush to action may feel exhausting or pointless. Support—not self-criticism—is needed.',
    Summer: 'This season asks you to operate outside your natural rhythm. The constant warmth and social demands may feel draining. Support—not self-criticism—is needed.',
    Autumn: 'This season asks you to operate outside your natural rhythm. The emphasis on depth and partnership may feel overwhelming. Support—not self-criticism—is needed.',
    Winter: 'This season asks you to operate outside your natural rhythm. The scarcity and coldness may feel isolating. Support—not self-criticism—is needed.',
  };

  return {
    sign,
    natalSeason,
    currentSeason,
    resonance,
    narrative,
    homeSeasonDescription: homeDescriptions[profile.home],
    challengeSeasonDescription: challengeDescriptions[profile.challenge],
  };
}

// =============================================================================
// ELEMENT × SEASON FLOW - Re-exports from elementFlowConstants.ts
// =============================================================================

export {
  // Types
  type ElementFlowPhase,
  type ElementSeasonPhase,
  type ElementFlowData,
  type SeasonalImbalanceData,
  type ElementCompensationTip,
  type PersonalSeasonalState,
  // Constants
  ELEMENT_FLOWS,
  ELEMENT_SEASON_PRESENCE,
  SEASONAL_IMBALANCE_INSIGHTS,
  ELEMENT_COMPENSATION_TIPS,
  ELEMENT_DORMANT_SEASON,
  // Functions
  getElementFlowPhase,
  getSeasonElementBreakdown,
  getPersonalCompensationTip,
  getCurrentSeasonalImbalance,
  getPersonalSeasonalState,
  getSeasonalImbalance,
} from './elementFlowConstants';
