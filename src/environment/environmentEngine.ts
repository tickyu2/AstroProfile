/**
 * ============================================================================
 * ENVIRONMENTAL ENGINE (环境引擎)
 * ============================================================================
 *
 * Main engine combining Feng Shui, Qi Men Dun Jia, and Date Selection
 * into a unified Environmental Snapshot.
 *
 * Formula:
 *   Environmental Score = 0.4 × QiMen + 0.3 × FengShui + 0.3 × DateSelection
 *
 * Adjustments:
 * - +10 if Nobleman direction aligns with Useful God
 * - +8 if Qi Men palace supports Day Master
 * - -12 if clash animal matches year branch
 * - -15 if Sha direction hits personal direction
 * - +15 if Qi Men formation is auspicious
 * - -20 if Fu Yin or Fan Yin formation
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ActivityCategory,
  CompassDirection,
  ComputeEnvironmentOptions,
  EnvironmentalResult,
  EnvironmentalSnapshot,
  EnvironmentalSubject,
  EnvironmentalTier
} from './environmentTypes';

import { computeFengShuiDirections, scoreFengShuiAlignment } from './fengShuiEngine';
import { computeQiMenChart, scoreQiMenAlignment } from './qiMenEngine';
import { computeDateSelection, scoreDateSelection } from './dateSelectionEngine';

// ============================================================================
// SCORING WEIGHTS
// ============================================================================

const SCORING_WEIGHTS = {
  qiMen: 0.4,
  fengShui: 0.3,
  dateSelection: 0.3
};

const ADJUSTMENTS = {
  noblemanUsefulGodAlign: 10,
  qiMenDayMasterSupport: 8,
  clashAnimalPenalty: -12,
  shaDirectionPenalty: -15,
  auspiciousFormationBonus: 15,
  fuYinFanYinPenalty: -20
};

// ============================================================================
// MAIN ENGINE
// ============================================================================

/**
 * Compute complete environmental snapshot
 */
export function computeEnvironmentalSnapshot(
  options: ComputeEnvironmentOptions
): EnvironmentalResult {
  try {
    const {
      timestamp,
      subject,
      includeHourlyBreakdown = true,
      includeQiMenDetails = true
    } = options;

    const date = timestamp.split('T')[0];
    const hour = new Date(timestamp).getHours();

    // Compute all three systems
    const fengShui = computeFengShuiDirections(subject, timestamp);
    const qiMen = computeQiMenChart(timestamp);
    const dateSelection = computeDateSelection(date, subject);

    // Get base scores
    const fengShuiScore = scoreFengShuiAlignment(fengShui, subject);
    const qiMenScore = scoreQiMenAlignment(qiMen);
    const dateSelectionScore = scoreDateSelection(dateSelection);

    // Calculate weighted base score
    let environmentalScore =
      SCORING_WEIGHTS.qiMen * qiMenScore +
      SCORING_WEIGHTS.fengShui * fengShuiScore +
      SCORING_WEIGHTS.dateSelection * dateSelectionScore;

    // Apply adjustments
    const { adjustedScore, adjustmentNotes } = applyAdjustments(
      environmentalScore,
      fengShui,
      qiMen,
      dateSelection,
      subject
    );

    environmentalScore = Math.round(adjustedScore);

    // Determine tier
    const tier = getTierFromScore(environmentalScore);

    // Combine directions
    const { bestDirections, avoidDirections } = combineDirections(
      fengShui,
      qiMen,
      dateSelection
    );

    // Combine activities
    const { bestActivities, avoidActivities } = combineActivities(
      dateSelection,
      qiMen
    );

    // Generate summary narrative
    const { summary, summaryChinese } = generateSummary(
      tier,
      fengShui,
      qiMen,
      dateSelection
    );

    // Combine notes
    const notes = [
      ...fengShui.notes,
      ...qiMen.notes,
      ...dateSelection.notes,
      ...adjustmentNotes
    ];

    const notesChinese = [
      ...qiMen.notesChinese,
      ...dateSelection.notesChinese
    ];

    const snapshot: EnvironmentalSnapshot = {
      timestamp,
      date,
      hour,
      fengShui,
      qiMen,
      dateSelection,
      environmentalScore,
      tier,
      fengShuiScore: Math.round(fengShuiScore),
      qiMenScore: Math.round(qiMenScore),
      dateSelectionScore: Math.round(dateSelectionScore),
      bestDirections,
      avoidDirections,
      bestActivities,
      avoidActivities,
      summary,
      summaryChinese,
      notes,
      notesChinese
    };

    return {
      success: true,
      data: snapshot
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Apply scoring adjustments
 */
function applyAdjustments(
  baseScore: number,
  fengShui: ReturnType<typeof computeFengShuiDirections>,
  qiMen: ReturnType<typeof computeQiMenChart>,
  dateSelection: ReturnType<typeof computeDateSelection>,
  subject: EnvironmentalSubject
): { adjustedScore: number; adjustmentNotes: string[] } {
  let score = baseScore;
  const notes: string[] = [];

  // Check Nobleman-Useful God alignment
  const elementDirections: Record<string, CompassDirection[]> = {
    Wood: ['E', 'SE'],
    Fire: ['S'],
    Earth: ['SW', 'NE'],
    Metal: ['W', 'NW'],
    Water: ['N']
  };

  const usefulGodDirs = elementDirections[subject.usefulGodElement] || [];
  const noblemanDirs = fengShui.nobleman.map(n => n.direction);

  if (noblemanDirs.some(d => usefulGodDirs.includes(d))) {
    score += ADJUSTMENTS.noblemanUsefulGodAlign;
    notes.push('Bonus: Nobleman direction aligns with Useful God');
  }

  // Check Qi Men palace Day Master support
  const dayMasterElement = subject.dayMasterElement;
  const keyPalaceElement = getQiMenPalaceElement(qiMen.keyPalace.number);

  if (keyPalaceElement === dayMasterElement || producesElement(keyPalaceElement, dayMasterElement)) {
    score += ADJUSTMENTS.qiMenDayMasterSupport;
    notes.push('Bonus: Qi Men key palace supports Day Master');
  }

  // Check clash animal penalty
  if (dateSelection.clashAnimal && subject.yearBranch) {
    const yearAnimal = getAnimalFromBranch(subject.yearBranch);
    if (yearAnimal === dateSelection.clashAnimal) {
      score += ADJUSTMENTS.clashAnimalPenalty;
      notes.push('Penalty: Day clashes with your zodiac animal');
    }
  }

  // Check Sha direction penalty
  if (subject.personalNoblemanDirections.includes(dateSelection.shaDirection)) {
    score += ADJUSTMENTS.shaDirectionPenalty;
    notes.push('Penalty: Sha direction hits your personal direction');
  }

  // Check Qi Men formation bonuses/penalties
  if (qiMen.formationNature === 'auspicious') {
    score += ADJUSTMENTS.auspiciousFormationBonus;
    notes.push(`Bonus: Auspicious Qi Men formation (${qiMen.formationChinese})`);
  }

  if (qiMen.formation === 'FuYin' || qiMen.formation === 'FanYin') {
    score += ADJUSTMENTS.fuYinFanYinPenalty;
    notes.push(`Penalty: ${qiMen.formationChinese} formation - expect delays/reversals`);
  }

  return {
    adjustedScore: Math.max(0, Math.min(100, score)),
    adjustmentNotes: notes
  };
}

/**
 * Get element for a Qi Men palace
 */
function getQiMenPalaceElement(palace: number): string {
  const palaceElements: Record<number, string> = {
    1: 'Water', 2: 'Earth', 3: 'Wood', 4: 'Wood',
    5: 'Earth', 6: 'Metal', 7: 'Metal', 8: 'Earth', 9: 'Fire'
  };
  return palaceElements[palace] || 'Earth';
}

/**
 * Check if element A produces element B
 */
function producesElement(a: string, b: string): boolean {
  const produces: Record<string, string> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  return produces[a] === b;
}

/**
 * Get zodiac animal from branch
 */
function getAnimalFromBranch(branch: string): string {
  const branchAnimals: Record<string, string> = {
    Zi: 'Rat', Chou: 'Ox', Yin: 'Tiger', Mao: 'Rabbit',
    Chen: 'Dragon', Si: 'Snake', Wu: 'Horse', Wei: 'Goat',
    Shen: 'Monkey', You: 'Rooster', Xu: 'Dog', Hai: 'Pig'
  };
  return branchAnimals[branch] || '';
}

/**
 * Get environmental tier from score
 */
function getTierFromScore(score: number): EnvironmentalTier {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'mixed';
  if (score >= 30) return 'caution';
  return 'challenging';
}

/**
 * Combine directions from all sources
 */
function combineDirections(
  fengShui: ReturnType<typeof computeFengShuiDirections>,
  qiMen: ReturnType<typeof computeQiMenChart>,
  dateSelection: ReturnType<typeof computeDateSelection>
): { bestDirections: CompassDirection[]; avoidDirections: CompassDirection[] } {
  const bestSet = new Set<CompassDirection>();
  const avoidSet = new Set<CompassDirection>();

  // Add Feng Shui best
  for (const dir of fengShui.bestDirections) {
    bestSet.add(dir);
  }

  // Add Qi Men best
  for (const dir of qiMen.bestDirections) {
    bestSet.add(dir);
  }

  // Add avoid directions
  for (const dir of fengShui.avoidDirections) {
    avoidSet.add(dir);
    bestSet.delete(dir); // Avoid takes precedence
  }

  for (const dir of qiMen.avoidDirections) {
    avoidSet.add(dir);
    bestSet.delete(dir);
  }

  // Add Sha direction
  avoidSet.add(dateSelection.shaDirection);
  bestSet.delete(dateSelection.shaDirection);

  return {
    bestDirections: Array.from(bestSet),
    avoidDirections: Array.from(avoidSet)
  };
}

/**
 * Combine activities from sources
 */
function combineActivities(
  dateSelection: ReturnType<typeof computeDateSelection>,
  qiMen: ReturnType<typeof computeQiMenChart>
): { bestActivities: ActivityCategory[]; avoidActivities: ActivityCategory[] } {
  // Start with date selection suitable/avoid
  const bestActivities = [...dateSelection.suitable];
  const avoidActivities = [...dateSelection.avoid];

  // Qi Men adjustments based on rating
  if (qiMen.rating === 'inauspicious') {
    // Move some activities to avoid
    const cautionActivities: ActivityCategory[] = ['signing', 'investment', 'openBusiness'];
    for (const act of cautionActivities) {
      if (bestActivities.includes(act)) {
        const idx = bestActivities.indexOf(act);
        bestActivities.splice(idx, 1);
        if (!avoidActivities.includes(act)) {
          avoidActivities.push(act);
        }
      }
    }
  }

  if (qiMen.rating === 'auspicious') {
    // Promote some activities
    const promoteActivities: ActivityCategory[] = ['meeting', 'negotiation', 'travel'];
    for (const act of promoteActivities) {
      if (!bestActivities.includes(act) && !avoidActivities.includes(act)) {
        bestActivities.push(act);
      }
    }
  }

  return { bestActivities, avoidActivities };
}

/**
 * Generate summary narrative
 */
function generateSummary(
  tier: EnvironmentalTier,
  fengShui: ReturnType<typeof computeFengShuiDirections>,
  qiMen: ReturnType<typeof computeQiMenChart>,
  dateSelection: ReturnType<typeof computeDateSelection>
): { summary: string; summaryChinese: string } {
  const tierDescriptions: Record<EnvironmentalTier, { en: string; zh: string }> = {
    excellent: { en: 'Excellent environmental alignment', zh: '环境能量极佳' },
    good: { en: 'Good environmental support', zh: '环境支持良好' },
    mixed: { en: 'Mixed environmental energies', zh: '环境能量起伏' },
    caution: { en: 'Cautious environmental conditions', zh: '环境需谨慎' },
    challenging: { en: 'Challenging environmental factors', zh: '环境挑战较大' }
  };

  let summary = `${tierDescriptions[tier].en}. `;
  let summaryChinese = `${tierDescriptions[tier].zh}。`;

  // Add key insights
  if (qiMen.formation !== 'None') {
    summary += `Qi Men: ${qiMen.formationChinese}. `;
    summaryChinese += `奇门：${qiMen.formationChinese}。`;
  }

  summary += `${dateSelection.officerChinese} day (${dateSelection.officer}). `;
  summaryChinese += `${dateSelection.officerChinese}日。`;

  if (fengShui.nobleman.length > 0) {
    const nobleDir = fengShui.nobleman[0].directionChinese;
    summary += `Nobleman in ${nobleDir}. `;
    summaryChinese += `贵人在${nobleDir}。`;
  }

  return { summary, summaryChinese };
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export { computeFengShuiDirections } from './fengShuiEngine';
export { computeQiMenChart } from './qiMenEngine';
export { computeDateSelection } from './dateSelectionEngine';

