/**
 * ============================================================================
 * SHEN SHA DETECTION ENGINE (神煞检测引擎)
 * ============================================================================
 *
 * The main engine for detecting Shen Sha (Symbolic Stars) in a BaZi chart.
 *
 * Detection flow:
 * 1. Extract all stems and branches from the four pillars
 * 2. For each star, check if its activation conditions are met
 * 3. Record which pillar(s) activated each star
 * 4. Generate explanation for each hit
 *
 * Created: January 2026
 * Philosophy: Pattern markers, not fortune-telling
 * ============================================================================
 */

import {
  ShenShaDefinition,
  ShenShaCategory,
  ShenShaPolarity,
  SHEN_SHA_LIBRARY,
  CATEGORY_META
} from './shenshaDefs';

import {
  PEACH_BLOSSOM_RULES,
  NOBLEMAN_RULES,
  TAI_JI_NOBLEMAN_RULES,
  ACADEMIC_STAR_RULES,
  LITERARY_STAR_RULES,
  TRAVELING_HORSE_RULES,
  GENERAL_STAR_RULES,
  ARTISTIC_STAR_RULES,
  PROSPERITY_STAR_RULES,
  HEAVENLY_DOCTOR_RULES,
  RED_MATCHMAKER_RULES,
  SKY_HAPPINESS_RULES,
  HEAVENLY_VIRTUE_RULES,
  MOON_VIRTUE_RULES,
  ROBBERY_SHA_RULES,
  CALAMITY_SHA_RULES,
  SOLITARY_STAR_RULES,
  WIDOW_STAR_RULES,
  SALTY_POOL_RULES
} from './shenshaRules';

// ============================================================================
// TYPES
// ============================================================================

export interface FourPillarsInput {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
}

export type PillarName = 'year' | 'month' | 'day' | 'hour';

export interface ShenShaHit {
  // Star info
  key: string;
  han: string;
  label: string;
  pinyin: string;
  category: ShenShaCategory;
  polarity: ShenShaPolarity;

  // Detection info
  pillar: PillarName;
  activatingElement: string;  // The stem or branch that activated it
  reason: string;

  // Full definition reference
  definition: ShenShaDefinition;
}

export interface ShenShaResult {
  // All detected stars
  hits: ShenShaHit[];

  // Grouped by category
  byCategory: Record<ShenShaCategory, ShenShaHit[]>;

  // Grouped by pillar
  byPillar: Record<PillarName, ShenShaHit[]>;

  // Summary counts
  totalHits: number;
  auspiciousCount: number;
  inauspiciousCount: number;
  neutralCount: number;

  // Key insights
  dominantCategory: ShenShaCategory | null;
  notableStars: ShenShaHit[];  // Most significant stars

  // Explanation
  summary: string;
  explanation: string;
}

// ============================================================================
// MAIN DETECTION ENGINE
// ============================================================================

/**
 * Detect all Shen Sha stars in a BaZi chart
 *
 * @param pillars - The four pillars with stems and branches
 * @returns ShenShaResult with all detected stars and analysis
 */
export function detectShenSha(pillars: FourPillarsInput): ShenShaResult {
  const hits: ShenShaHit[] = [];

  // Extract all branches for quick lookup
  const branches: Record<PillarName, string> = {
    year: pillars.yearBranch,
    month: pillars.monthBranch,
    day: pillars.dayBranch,
    hour: pillars.hourBranch
  };

  const stems: Record<PillarName, string> = {
    year: pillars.yearStem,
    month: pillars.monthStem,
    day: pillars.dayStem,
    hour: pillars.hourStem
  };

  const allBranches = Object.values(branches);
  const allStems = Object.values(stems);

  // ─────────────────────────────────────────────────────────────────
  // DETECT RELATIONSHIP STARS
  // ─────────────────────────────────────────────────────────────────

  // Peach Blossom (桃花) - Based on Year/Day Branch
  const peachBlossomBranch = PEACH_BLOSSOM_RULES[pillars.yearBranch];
  if (peachBlossomBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === peachBlossomBranch) {
        hits.push(createHit('peach_blossom', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Peach Blossom at ${peachBlossomBranch}, found in ${pillar} pillar`));
      }
    }
  }

  // Also check Day Branch for Peach Blossom
  const peachBlossomFromDay = PEACH_BLOSSOM_RULES[pillars.dayBranch];
  if (peachBlossomFromDay && peachBlossomFromDay !== peachBlossomBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === peachBlossomFromDay && pillar !== 'day') {
        hits.push(createHit('peach_blossom', pillar, branch,
          `Day Branch ${pillars.dayBranch} → Peach Blossom at ${peachBlossomFromDay}, found in ${pillar} pillar`));
      }
    }
  }

  // Red Matchmaker (红鸾) - Based on Year Branch
  const redMatchmakerBranch = RED_MATCHMAKER_RULES[pillars.yearBranch];
  if (redMatchmakerBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === redMatchmakerBranch) {
        hits.push(createHit('red_matchmaker', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Red Matchmaker at ${redMatchmakerBranch}`));
      }
    }
  }

  // Sky Happiness (天喜) - Based on Year Branch
  const skyHappinessBranch = SKY_HAPPINESS_RULES[pillars.yearBranch];
  if (skyHappinessBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === skyHappinessBranch) {
        hits.push(createHit('sky_happiness', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Sky Happiness at ${skyHappinessBranch}`));
      }
    }
  }

  // Salty Pool (咸池) - Same as Peach Blossom, different interpretation
  if (peachBlossomBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === peachBlossomBranch) {
        hits.push(createHit('salty_pool', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Salty Pool at ${peachBlossomBranch}`));
      }
    }
  }

  // Solitary Star (孤辰) - Based on Year Branch
  const solitaryBranch = SOLITARY_STAR_RULES[pillars.yearBranch];
  if (solitaryBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === solitaryBranch) {
        hits.push(createHit('solitary_star', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Solitary Star at ${solitaryBranch}`));
      }
    }
  }

  // Widow Star (寡宿) - Based on Year Branch
  const widowBranch = WIDOW_STAR_RULES[pillars.yearBranch];
  if (widowBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === widowBranch) {
        hits.push(createHit('widow_star', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Widow Star at ${widowBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT INTELLIGENCE STARS
  // ─────────────────────────────────────────────────────────────────

  // Academic Star (文昌) - Based on Day Stem
  const academicBranch = ACADEMIC_STAR_RULES[pillars.dayStem];
  if (academicBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === academicBranch) {
        hits.push(createHit('academic_star', pillar, branch,
          `Day Stem ${pillars.dayStem} → Academic Star at ${academicBranch}`));
      }
    }
  }

  // Literary Star (文曲) - Based on Day Stem
  const literaryBranch = LITERARY_STAR_RULES[pillars.dayStem];
  if (literaryBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === literaryBranch) {
        hits.push(createHit('literary_star', pillar, branch,
          `Day Stem ${pillars.dayStem} → Literary Star at ${literaryBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT NOBLEMAN STARS
  // ─────────────────────────────────────────────────────────────────

  // Heavenly Nobleman (天乙贵人) - Based on Day Stem
  const noblemanBranches = NOBLEMAN_RULES[pillars.dayStem];
  if (noblemanBranches) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (noblemanBranches.includes(branch)) {
        hits.push(createHit('heavenly_nobleman', pillar, branch,
          `Day Stem ${pillars.dayStem} → Nobleman at ${noblemanBranches.join('/')}, found ${branch}`));
      }
    }
  }

  // Tai Ji Nobleman (太极贵人) - Based on Day Stem
  const taiJiBranches = TAI_JI_NOBLEMAN_RULES[pillars.dayStem];
  if (taiJiBranches) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (taiJiBranches.includes(branch)) {
        hits.push(createHit('tai_ji_nobleman', pillar, branch,
          `Day Stem ${pillars.dayStem} → Tai Ji Nobleman at ${taiJiBranches.join('/')}, found ${branch}`));
      }
    }
  }

  // Heavenly Virtue (天德) - Based on Month Branch, checks for stem
  const virtueElement = HEAVENLY_VIRTUE_RULES[pillars.monthBranch];
  if (virtueElement) {
    for (const [pillar, stem] of Object.entries(stems) as [PillarName, string][]) {
      if (stem === virtueElement) {
        hits.push(createHit('heavenly_virtue', pillar, stem,
          `Month Branch ${pillars.monthBranch} → Heavenly Virtue at ${virtueElement}`));
      }
    }
  }

  // Moon Virtue (月德) - Based on Month Branch, checks for stem
  const moonVirtueElement = MOON_VIRTUE_RULES[pillars.monthBranch];
  if (moonVirtueElement) {
    for (const [pillar, stem] of Object.entries(stems) as [PillarName, string][]) {
      if (stem === moonVirtueElement) {
        hits.push(createHit('moon_virtue', pillar, stem,
          `Month Branch ${pillars.monthBranch} → Moon Virtue at ${moonVirtueElement}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT MOVEMENT STARS
  // ─────────────────────────────────────────────────────────────────

  // Traveling Horse (驿马) - Based on Year/Day Branch
  const travelingHorseBranch = TRAVELING_HORSE_RULES[pillars.yearBranch];
  if (travelingHorseBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === travelingHorseBranch) {
        hits.push(createHit('traveling_horse', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Traveling Horse at ${travelingHorseBranch}`));
      }
    }
  }

  // General Star (将星) - Based on Year/Day Branch
  const generalBranch = GENERAL_STAR_RULES[pillars.yearBranch];
  if (generalBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === generalBranch) {
        hits.push(createHit('general_star', pillar, branch,
          `Year Branch ${pillars.yearBranch} → General Star at ${generalBranch}`));
      }
    }
  }

  // Artistic Star / Canopy (华盖) - Based on Year/Day Branch
  const artisticBranch = ARTISTIC_STAR_RULES[pillars.yearBranch];
  if (artisticBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === artisticBranch) {
        hits.push(createHit('artistic_star', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Artistic Star at ${artisticBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT WEALTH STARS
  // ─────────────────────────────────────────────────────────────────

  // Prosperity Star (禄神) - Based on Day Stem
  const prosperityBranch = PROSPERITY_STAR_RULES[pillars.dayStem];
  if (prosperityBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === prosperityBranch) {
        hits.push(createHit('prosperity_star', pillar, branch,
          `Day Stem ${pillars.dayStem} → Prosperity Star (Lu) at ${prosperityBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT SPIRITUAL STARS
  // ─────────────────────────────────────────────────────────────────

  // Heavenly Doctor (天医) - Based on Month Branch
  const doctorBranch = HEAVENLY_DOCTOR_RULES[pillars.monthBranch];
  if (doctorBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === doctorBranch) {
        hits.push(createHit('heavenly_doctor', pillar, branch,
          `Month Branch ${pillars.monthBranch} → Heavenly Doctor at ${doctorBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // DETECT CHALLENGE STARS
  // ─────────────────────────────────────────────────────────────────

  // Robbery Sha (劫煞) - Based on Year/Day Branch
  const robberyBranch = ROBBERY_SHA_RULES[pillars.yearBranch];
  if (robberyBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === robberyBranch) {
        hits.push(createHit('robbery_sha', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Robbery Sha at ${robberyBranch}`));
      }
    }
  }

  // Calamity Sha (灾煞) - Based on Year/Day Branch
  const calamityBranch = CALAMITY_SHA_RULES[pillars.yearBranch];
  if (calamityBranch) {
    for (const [pillar, branch] of Object.entries(branches) as [PillarName, string][]) {
      if (branch === calamityBranch) {
        hits.push(createHit('calamity_sha', pillar, branch,
          `Year Branch ${pillars.yearBranch} → Calamity Sha at ${calamityBranch}`));
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // BUILD RESULT
  // ─────────────────────────────────────────────────────────────────

  return buildShenShaResult(hits, pillars);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a ShenShaHit from detection
 */
function createHit(
  key: string,
  pillar: PillarName,
  activatingElement: string,
  reason: string
): ShenShaHit {
  const definition = SHEN_SHA_LIBRARY[key];
  if (!definition) {
    throw new Error(`Unknown Shen Sha key: ${key}`);
  }

  return {
    key,
    han: definition.han,
    label: definition.label,
    pinyin: definition.pinyin,
    category: definition.category,
    polarity: definition.polarity,
    pillar,
    activatingElement,
    reason,
    definition
  };
}

/**
 * Build the complete ShenShaResult from hits
 */
function buildShenShaResult(hits: ShenShaHit[], pillars: FourPillarsInput): ShenShaResult {
  // Group by category
  const byCategory: Record<ShenShaCategory, ShenShaHit[]> = {
    relationship: [],
    intelligence: [],
    nobleman: [],
    movement: [],
    wealth: [],
    challenge: [],
    spiritual: []
  };

  // Group by pillar
  const byPillar: Record<PillarName, ShenShaHit[]> = {
    year: [],
    month: [],
    day: [],
    hour: []
  };

  // Count by polarity
  let auspiciousCount = 0;
  let inauspiciousCount = 0;
  let neutralCount = 0;

  for (const hit of hits) {
    byCategory[hit.category].push(hit);
    byPillar[hit.pillar].push(hit);

    if (hit.polarity === 'auspicious') auspiciousCount++;
    else if (hit.polarity === 'inauspicious') inauspiciousCount++;
    else neutralCount++;
  }

  // Find dominant category
  let dominantCategory: ShenShaCategory | null = null;
  let maxCount = 0;
  for (const [category, categoryHits] of Object.entries(byCategory)) {
    if (categoryHits.length > maxCount) {
      maxCount = categoryHits.length;
      dominantCategory = category as ShenShaCategory;
    }
  }

  // Identify notable stars (Nobleman and major beneficial/challenging stars)
  const notableStars = hits.filter(hit =>
    hit.key === 'heavenly_nobleman' ||
    hit.key === 'peach_blossom' ||
    hit.key === 'traveling_horse' ||
    hit.key === 'academic_star' ||
    hit.key === 'prosperity_star' ||
    hit.key === 'general_star'
  );

  // Generate summary and explanation
  const summary = generateSummary(hits, byCategory, auspiciousCount, inauspiciousCount);
  const explanation = generateExplanation(hits, pillars, byCategory, byPillar);

  return {
    hits,
    byCategory,
    byPillar,
    totalHits: hits.length,
    auspiciousCount,
    inauspiciousCount,
    neutralCount,
    dominantCategory: dominantCategory && maxCount > 0 ? dominantCategory : null,
    notableStars,
    summary,
    explanation
  };
}

/**
 * Generate brief summary
 */
function generateSummary(
  hits: ShenShaHit[],
  byCategory: Record<ShenShaCategory, ShenShaHit[]>,
  auspicious: number,
  inauspicious: number
): string {
  if (hits.length === 0) {
    return 'No major Shen Sha detected in this chart.';
  }

  const parts: string[] = [];

  parts.push(`${hits.length} Shen Sha detected`);

  if (auspicious > 0) {
    parts.push(`${auspicious} auspicious`);
  }
  if (inauspicious > 0) {
    parts.push(`${inauspicious} require awareness`);
  }

  // Mention notable categories
  const notableCategories = Object.entries(byCategory)
    .filter(([_, hits]) => hits.length >= 2)
    .map(([cat, _]) => CATEGORY_META[cat as ShenShaCategory].label);

  if (notableCategories.length > 0) {
    parts.push(`Strong in: ${notableCategories.join(', ')}`);
  }

  return parts.join('. ') + '.';
}

/**
 * Generate detailed explanation
 */
function generateExplanation(
  hits: ShenShaHit[],
  pillars: FourPillarsInput,
  byCategory: Record<ShenShaCategory, ShenShaHit[]>,
  byPillar: Record<PillarName, ShenShaHit[]>
): string {
  if (hits.length === 0) {
    return `
${'═'.repeat(60)}
SHEN SHA ANALYSIS (神煞)
${'═'.repeat(60)}

No major Shen Sha (Symbolic Stars) were detected in this chart.

This doesn't mean the chart lacks significance - it simply means
the classical symbolic stars don't prominently appear. Other chart
factors (elements, Ten Gods, Structure) provide the main indicators.
`;
  }

  let explanation = `
${'═'.repeat(60)}
SHEN SHA ANALYSIS (神煞)
${'═'.repeat(60)}

Shen Sha are symbolic stars - pattern markers that highlight
tendencies, opportunities, and areas for awareness.

CHART: ${pillars.yearStem}${pillars.yearBranch} ${pillars.monthStem}${pillars.monthBranch} ${pillars.dayStem}${pillars.dayBranch} ${pillars.hourStem}${pillars.hourBranch}

${'─'.repeat(50)}
DETECTED STARS (${hits.length} total)
${'─'.repeat(50)}

`;

  // List by category
  for (const [category, categoryHits] of Object.entries(byCategory)) {
    if (categoryHits.length === 0) continue;

    const meta = CATEGORY_META[category as ShenShaCategory];
    explanation += `\n${meta.icon} ${meta.han} (${meta.label})\n`;
    explanation += `${'─'.repeat(40)}\n`;

    for (const hit of categoryHits) {
      const polarityIcon = hit.polarity === 'auspicious' ? '+' :
                           hit.polarity === 'inauspicious' ? '!' : '~';
      explanation += `[${polarityIcon}] ${hit.han} (${hit.label})\n`;
      explanation += `    Pillar: ${hit.pillar.charAt(0).toUpperCase() + hit.pillar.slice(1)}\n`;
      explanation += `    ${hit.reason}\n`;
      explanation += `    → ${hit.definition.description}\n\n`;
    }
  }

  // Summary by pillar
  explanation += `
${'─'.repeat(50)}
DISTRIBUTION BY PILLAR
${'─'.repeat(50)}
`;

  for (const [pillar, pillarHits] of Object.entries(byPillar)) {
    if (pillarHits.length === 0) continue;
    const pillarLabel = pillar.charAt(0).toUpperCase() + pillar.slice(1);
    explanation += `${pillarLabel}: ${pillarHits.map(h => h.han).join(', ')}\n`;
  }

  explanation += `
${'─'.repeat(50)}
INTERPRETATION NOTES
${'─'.repeat(50)}

• Auspicious stars (+) indicate natural gifts or areas of support
• Awareness stars (!) indicate areas requiring conscious attention
• Neutral stars (~) depend on how you use their energy

Remember: Shen Sha are tendencies, not destinies. They highlight
patterns that can be developed, mitigated, or channeled consciously.
`;

  return explanation.trim();
}

// ============================================================================
// QUICK HELPERS
// ============================================================================

/**
 * Quick check if chart has a specific star
 */
export function hasStarInChart(pillars: FourPillarsInput, starKey: string): boolean {
  const result = detectShenSha(pillars);
  return result.hits.some(hit => hit.key === starKey);
}

/**
 * Get stars of a specific category
 */
export function getStarsInCategory(
  pillars: FourPillarsInput,
  category: ShenShaCategory
): ShenShaHit[] {
  const result = detectShenSha(pillars);
  return result.byCategory[category];
}

/**
 * Check if chart has Heavenly Nobleman (most important benefactor star)
 */
export function hasNobleman(pillars: FourPillarsInput): boolean {
  return hasStarInChart(pillars, 'heavenly_nobleman');
}

/**
 * Check if chart has Peach Blossom
 */
export function hasPeachBlossom(pillars: FourPillarsInput): boolean {
  return hasStarInChart(pillars, 'peach_blossom');
}

/**
 * Check if chart has Traveling Horse
 */
export function hasTravelingHorse(pillars: FourPillarsInput): boolean {
  return hasStarInChart(pillars, 'traveling_horse');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  detectShenSha,
  hasStarInChart,
  getStarsInCategory,
  hasNobleman,
  hasPeachBlossom,
  hasTravelingHorse
};
