/**
 * seasonalLenses.ts — Seasonal story overlays for the Branch Wheel's Month mode.
 *
 * Each lens maps the 12 Earthly Branches (by index 0–11) to a real-world
 * seasonal cycle. The first lens: Gray Whale lifecycle / migration.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SeasonalEntry {
  icon: string;
  month: string;
  title: string;
  phase: string;
  phaseColor: string;
  location: string;
  motherKg: number;
  motherPct: number;
  stat: string;
  story: string;
  baziNote: string;
  baby?: {
    weightKg: number;
    lengthM: number;
    ageWeeks: number;
    summary: string;
  };
}

export interface SeasonalLens {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  data: Record<number, SeasonalEntry>;
}

// ---------------------------------------------------------------------------
// Gray Whale Lens — mapped by branch index (0=Rat … 11=Pig)
// ---------------------------------------------------------------------------

const WHALE_DATA: Record<number, SeasonalEntry> = {
  // 0 — Rat (子) — December
  0: {
    icon: '🎯',
    month: 'December',
    title: 'Approaching Baja — First Births',
    phase: 'Migration',
    phaseColor: '#0984e3',
    location: 'San Diego → Baja Norte',
    motherKg: 28000,
    motherPct: 78,
    stat: '28,000 kg — 78% · Fetus: ~900 kg · First births in Baja beginning',
    story: 'Around mid-December, she crosses the US-Mexico border south of San Diego. The water is 2°C warmer. Something shifts in her swimming cadence. The fetus now weighs 800–900 kg and is in its final exponential growth phase — 98% of total fetal energy cost concentrates in the last 100 days. She can sense the lagoon ahead like a frequency she\'s been tuned to for 20 years. First births occur late December to early January for the earliest-arriving mothers.',
    baziNote: 'Pure Water. Rat = life in total darkness, maximum potential.',
  },

  // 1 — Ox (丑) — January
  1: {
    icon: '🐋',
    month: 'January',
    title: 'PEAK BIRTHS — Frozen Treasury Opens',
    phase: 'Birth',
    phaseColor: '#ff9f43',
    location: 'Laguna Ojo de Liebre / San Ignacio',
    motherKg: 25500,
    motherPct: 71,
    stat: '25,500 kg — 71% · BIRTH · Calf: 500–680 kg',
    story: 'Around mid-January, peak arrivals at the lagoons. Pregnant females come first. The water is turbid gray, warm, twice the salinity of open ocean. January 15–20 sees the first major wave of births — Ox branch energy fully open. The calf emerges fluke-first. The mother lifts it on her back and flukes for its first breath. 12,500 miles of purpose resolves into this one moment, in this one protected lagoon, at this one surface.',
    baziNote: '丑 Ox IS the gray whale. Earth 60% holding Water 30%. Birth made physical.',
    baby: {
      weightKg: 590,
      lengthM: 4.5,
      ageWeeks: 0,
      summary: 'First breath. Dark gray-black skin, no blubber, eyes wide open. Nurses dozens of times per day. Stays within one body-length of mother.',
    },
  },

  // 2 — Tiger (寅) — February
  2: {
    icon: '🍼',
    month: 'February',
    title: 'Peak Nursing — Friendly Whale Encounters',
    phase: 'Nursing',
    phaseColor: '#fd79a8',
    location: 'All Three Baja Lagoons',
    motherKg: 24000,
    motherPct: 67,
    stat: '24,000 kg — 67% · 50 gal/day milk · Calf doubling weight',
    story: 'Around mid-February, the ABSOLUTE PEAK of gray whale calving. All three lagoons are filled with mother-calf pairs. The mother is losing weight fastest now — producing up to 50 gallons of 53%-fat milk per day while eating almost nothing. The calf is gaining 60–70 lbs per day. The \'friendly whale\' encounters peak here: mothers bring calves to the wooden pangas, calves press soft rostrums against human hands. The Frozen Treasury is fully open.',
    baziNote: 'Tiger = Yang Wood. Spring breaks through. Calf pushing upward.',
    baby: {
      weightKg: 1200,
      lengthM: 5.0,
      ageWeeks: 4,
      summary: 'Peak growth rate: 60–70 lbs/day. First barnacle larvae collecting. Approaches boats with curiosity — mother initiates these contacts.',
    },
  },

  // 3 — Rabbit (卯) — March
  3: {
    icon: '⬆️',
    month: 'March',
    title: 'Northbound Begins — Shore Hugging',
    phase: 'Nursing',
    phaseColor: '#fd79a8',
    location: 'Baja → California Coast',
    motherKg: 22500,
    motherPct: 63,
    stat: '22,500 kg — 63% · Nursing on migration · Shore within 1–2 miles',
    story: 'Around mid-March, the northbound migration begins. Mother-calf pairs are last to leave — giving calves maximum time to build blubber. She swims within 1–2 miles of shore, close enough to protect against orcas and great whites hunting in deeper water. She is still losing mass while nursing on the move. Tiger energy: upward, determined, breaking through toward spring. The calf drafts in her wake, learning the coastline by swimming it.',
    baziNote: 'Yin Wood. Gentle coastal travel. Calf learning the geography of its life.',
    baby: {
      weightKg: 1800,
      lengthM: 5.5,
      ageWeeks: 8,
      summary: 'Drafts in mother\'s wake (30% energy saving). First spy-hopping. Learning: shore = right side, deep water = left side, danger.',
    },
  },

  // 4 — Dragon (辰) — April
  4: {
    icon: '📉',
    month: 'April',
    title: 'ABSOLUTE MINIMUM — Skinny Whale',
    phase: 'Weight Minimum',
    phaseColor: '#e17055',
    location: 'Oregon / Washington Coast',
    motherKg: 22000,
    motherPct: 61,
    stat: '22,000 kg — 61% · ABSOLUTE MINIMUM · Calf: ~2,700 kg',
    story: 'Around mid-April, she reaches her absolute minimum weight — the low point of the entire 2-year cycle. Six months of fasting combined with nursing a rapidly growing calf has cost her 14,000 kg. This is the \'skinny whale\' period documented by NOAA drone surveys. Yin Wood energy: gentle, careful, coastal. She and the calf hug the shore together. Both vulnerable, both moving north. Both alive.',
    baziNote: 'Dragon treasury opens. Earth emerging from Water. First calf foraging attempts.',
    baby: {
      weightKg: 2400,
      lengthM: 6.0,
      ageWeeks: 13,
      summary: 'Weight 4× birth. First barnacles visible. First breaching — launching full body out of water. First foraging attempts in shallows.',
    },
  },

  // 5 — Snake (巳) — May
  5: {
    icon: '🌱',
    month: 'May',
    title: 'Recovery Begins — First Feeding',
    phase: 'Recovery',
    phaseColor: '#55efc4',
    location: 'British Columbia / SE Alaska',
    motherKg: 22800,
    motherPct: 63,
    stat: '22,800 kg — 63% · Feeding resumes · Calf: ~3,400 kg',
    story: 'Around mid-May, she reaches the first opportunistic feeding zones along the BC and SE Alaska coast. She scoops sediment in shallow bays between migration segments. The calf watches and begins its first clumsy attempts at bottom-rolling — tilting sideways in the shallows, mouth open, confused by the mud. She gains weight for the first time in 7 months. Small gains, but the direction has reversed. Dragon energy: Earth emerging from water, transition toward summer.',
    baziNote: 'Snake Fire ignites. Calf\'s first real meal from the Earth floor.',
    baby: {
      weightKg: 3000,
      lengthM: 6.5,
      ageWeeks: 17,
      summary: 'First foraging practice — tilts sideways, rolls in sediment. Baleen still too short to filter well, but motion is correct. Explores 500m independently.',
    },
  },

  // 6 — Horse (午) — June
  6: {
    icon: '🐟',
    month: 'June',
    title: 'Alaska Feeding — Metabolism Rising',
    phase: 'Recovery',
    phaseColor: '#55efc4',
    location: 'Gulf of Alaska / Kodiak',
    motherKg: 24500,
    motherPct: 68,
    stat: '24,500 kg — 68% · Calf: ~4,200 kg · Nursing reduces to twice daily',
    story: 'Around mid-June, she enters true feeding waters. The Gulf of Alaska\'s shallow bays offer amphipod-rich sediment. Both mother and calf feed independently for stretches of hours. The calf\'s nursing frequency has dropped by 50% from its January peak. She is rebuilding slowly — the biological math is hard: nursing still costs her 3× more energy per day than she gains from feeding. Snake energy: Yin Fire activating, metabolism rising.',
    baziNote: 'Horse = Yang Fire maximum. Full metabolic flame. Full energy IN for both.',
    baby: {
      weightKg: 3700,
      lengthM: 7.0,
      ageWeeks: 21,
      summary: 'First successful independent foraging. Amphipods and benthic crustaceans. Right-side rolling habit establishing — learned from watching mother.',
    },
  },

  // 7 — Goat (未) — July
  7: {
    icon: '🌊',
    month: 'July',
    title: 'Arctic Full Feeding — Calf Mirrors',
    phase: 'Recovery',
    phaseColor: '#55efc4',
    location: 'Bering Sea feeding grounds',
    motherKg: 27000,
    motherPct: 75,
    stat: '27,000 kg — 75% · Full Arctic feeding · Calf mirrors her technique',
    story: 'Around mid-July, she reaches the prime Arctic feeding grounds. The 24-hour Arctic summer daylight means she can feed continuously. The amphipod density here is 10,000× greater than California waters. Her weight gain accelerates — but she is still nursing. The calf follows her, watching her technique: roll right, open mouth, push mud through baleen, lick food off plates with the tongue. It practices alongside her. Horse energy: Fire maximum, full metabolic flame, feeding at peak intensity.',
    baziNote: 'Goat grazes in late summer. Earth+Fire transition. Calf discovers its own hunger.',
    baby: {
      weightKg: 4300,
      lengthM: 7.5,
      ageWeeks: 25,
      summary: 'Spends more time feeding than nursing. Feeds alongside mother in 3°C Arctic water. Nursing less than once per day.',
    },
  },

  // 8 — Monkey (申) — August
  8: {
    icon: '🔄',
    month: 'August',
    title: 'WEANING + MATING — Cycle Restarts',
    phase: 'Arctic Peak',
    phaseColor: '#1dd1a1',
    location: 'Chukchi / Northern Bering Sea',
    motherKg: 33000,
    motherPct: 92,
    stat: '33,000 kg — 92% · WEANING · MATING · Cycle begins again',
    story: 'Around mid-August — exactly 12 months after the previous cycle\'s weaning — the calf separates for the last time. The mother is free to feed without the nursing drain for the first time since conception, 14 months ago. Her weight climbs 2,000–3,000 kg in the final weeks of August alone. She mates again. The invisible Fire of the next calf\'s embryo sparks in the Dog branch. The Frozen Treasury seals itself again, preparing its next unsealing in 丑 Ox, 16 months from now.',
    baziNote: 'Metal = clean, irreversible separation. Yang Metal severs the nursing bond.',
    baby: {
      weightKg: 5200,
      lengthM: 8.0,
      ageWeeks: 29,
      summary: 'WEANED. 8.7× birth weight. Mother stops presenting for nursing. Calf feeds independently. Will make first solo migration in October.',
    },
  },

  // 9 — Rooster (酉) — September
  9: {
    icon: '⚡',
    month: 'September',
    title: 'Peak Feeding — Building for Winter',
    phase: 'Arctic Peak',
    phaseColor: '#1dd1a1',
    location: 'Northern Bering Sea',
    motherKg: 34500,
    motherPct: 96,
    stat: '34,500 kg — 96% of peak · MATING · New pregnancy begins',
    story: 'Around mid-September, the calf makes its final separation. No ceremony — it forages in the same waters, independent for the first time. The mother continues feeding furiously. She mates, usually with multiple males over several days. Inside her, invisible and metabolically negligible, the next calf\'s story has begun. Yang Metal energy: precision, completion, harvest. She carries invisible Fire within her Metal season.',
    baziNote: 'Rooster at dawn of next cycle. Both feeding furiously and alone.',
  },

  // 10 — Dog (戌) — October
  10: {
    icon: '🌊',
    month: 'October',
    title: 'DEPARTURE — Pregnant, Alone',
    phase: 'Departure',
    phaseColor: '#74b9ff',
    location: 'Unimak Pass, Aleutians',
    motherKg: 33000,
    motherPct: 92,
    stat: '33,000 kg — 92% · FASTING BEGINS · 6,200 miles ahead',
    story: 'Around mid-October, the sea surface drops another degree. The ice shelf edges south ten miles overnight. Her body knows before her mind does. She surfaces once from a long dive, orients south by the coastline\'s magnetic signature, and does not turn north again for six months. She passes through Unimak Pass into the open Pacific. Single as a Pringle. The Dog branch holds hidden Fire within Earth — the invisible embryo within her blubber.',
    baziNote: 'Dog guards the threshold. Earth+Metal+hidden Fire = invisible embryo beginning.',
  },

  // 11 — Pig (亥) — November
  11: {
    icon: '🌑',
    month: 'November',
    title: 'Deep Southbound — Night and Day',
    phase: 'Migration',
    phaseColor: '#0984e3',
    location: 'Oregon Coast (Depoe Bay)',
    motherKg: 30500,
    motherPct: 85,
    stat: '30,500 kg — 85% · Fetus: ~200 kg · Oregon passing',
    story: 'Around mid-November, she passes Oregon at 75 miles per day, night and day, without stopping. She has eaten almost nothing since Unimak Pass. The growing fetus is now 180–250 kg and its daily energy demand is visible on her body. Her blubber pays the invoice. Whale watching season opens at Depoe Bay. Humans see her blow from shore: two puffs, sometimes heart-shaped, then she\'s gone south. Pure Pig energy: Water fully unleashed.',
    baziNote: 'Pig = Water unleashed. She swims through pure Water energy, night and day.',
  },
};

// ---------------------------------------------------------------------------
// Branch names for display (ordered by cycle starting at Dog = departure)
// ---------------------------------------------------------------------------

const BRANCH_NAMES: Record<number, string> = {
  0: '子 Rat', 1: '丑 Ox', 2: '寅 Tiger', 3: '卯 Rabbit',
  4: '辰 Dragon', 5: '巳 Snake', 6: '午 Horse', 7: '未 Goat',
  8: '申 Monkey', 9: '酉 Rooster', 10: '戌 Dog', 11: '亥 Pig',
};

// Cycle order: Dog → Pig → Rat → Ox → Tiger → ... → Rooster (lifecycle order)
const LIFECYCLE_ORDER = [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Build markdown string for a seasonal lens for use in FloatingMdWindow */
export function buildLensMarkdown(lens: SeasonalLens): string {
  const lines: string[] = [];
  lines.push(`# ${lens.icon} ${lens.label}`);
  lines.push(`*${lens.subtitle}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const idx of LIFECYCLE_ORDER) {
    const e = lens.data[idx];
    if (!e) continue;
    const branch = BRANCH_NAMES[idx] || '';
    lines.push(`## ${e.icon} ${e.month} — ${branch}`);
    lines.push(`**${e.title}** · *${e.phase}*`);
    lines.push('');
    lines.push(`**Mother:** ${(e.motherKg / 1000).toFixed(1)}t (${e.motherPct}% of peak) · ${e.location}`);
    if (e.baby) {
      lines.push(`**Calf:** ${(e.baby.weightKg / 1000).toFixed(1)}t · ${e.baby.lengthM}m · ${e.baby.ageWeeks === 0 ? 'Newborn' : `~${e.baby.ageWeeks} weeks`}`);
    }
    lines.push('');
    lines.push(e.story);
    if (e.baby) {
      lines.push('');
      lines.push(`> 🐣 **Calf:** ${e.baby.summary}`);
    }
    lines.push('');
    lines.push(`> ☯ ${e.baziNote}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Lens registry — add future lenses here
// ---------------------------------------------------------------------------

export const SEASONAL_LENSES: SeasonalLens[] = [
  {
    id: 'whale',
    label: 'Gray Whale',
    icon: '🐋',
    subtitle: 'Eschrichtius robustus — 12,500-mile migration',
    data: WHALE_DATA,
  },
  // Future: { id: 'plant', label: 'Plant Lifecycle', icon: '🌱', ... }
];
