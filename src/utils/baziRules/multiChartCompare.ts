/**
 * ============================================
 * MULTI-CHART COMPARISON ENGINE
 * Technical Comparison Across Multiple Charts
 *
 * Compare BaZi charts to find:
 * - Shared interactions
 * - Differing structures
 * - Element harmony/conflict
 * - Timing synchronization
 * ============================================
 */

import { GrowthStage } from './growthStages';
import { FollowStructureType } from './followStructure';
import { ShenShaHit } from './shenSha';

// ==================== TYPES ====================

export interface ChartData {
  id: string;
  name?: string;
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  dayMasterElement: string;
  dayMasterStrength: number;
  elementBalance: Record<string, number>;
  tenGodCounts?: Record<string, number>;
  structureType?: string;
  followStructure?: FollowStructureType;
  shenShaHits?: ShenShaHit[];
  growthStages?: Record<string, GrowthStage>;
}

export interface InteractionComparison {
  type: 'clash' | 'combination' | 'harm' | 'punishment';
  participants: string[];
  chartsInvolved: string[];
  significance: 'high' | 'medium' | 'low';
}

export interface ElementComparison {
  element: string;
  chartValues: Record<string, number>;
  average: number;
  variance: number;
  status: 'harmonious' | 'varied' | 'conflicting';
}

export interface ChartComparison {
  chartIds: string[];
  chartNames: string[];

  // Element analysis
  elementComparisons: ElementComparison[];
  dominantElements: string[];
  deficientElements: string[];

  // Structure analysis
  structures: Record<string, string>;
  sharedStructureType?: string;
  structureDiversity: number; // 0-1, 0 = all same, 1 = all different

  // Interaction analysis
  sharedInteractions: InteractionComparison[];
  uniqueInteractions: Record<string, InteractionComparison[]>;

  // Day Master analysis
  dayMasterHarmony: number; // -100 to 100
  dayMasterElements: Record<string, string>;

  // Overall compatibility
  overallScore: number; // 0-100
  summary: string;
  summaryZh: string;
}

// ==================== COMPARISON FUNCTIONS ====================

/**
 * Compare multiple charts
 */
export function compareCharts(charts: ChartData[]): ChartComparison {
  if (charts.length < 2) {
    throw new Error('Need at least 2 charts to compare');
  }

  const chartIds = charts.map(c => c.id);
  const chartNames = charts.map(c => c.name || c.id);

  // Element analysis
  const elementComparisons = compareElements(charts);
  const { dominant, deficient } = identifyDominantDeficient(elementComparisons);

  // Structure analysis
  const structures = extractStructures(charts);
  const { shared, diversity } = analyzeStructureDiversity(structures);

  // Day Master analysis
  const dmElements = extractDayMasterElements(charts);
  const dmHarmony = calculateDayMasterHarmony(charts);

  // Interaction analysis
  const { shared: sharedInt, unique: uniqueInt } = analyzeInteractions(charts);

  // Overall score
  const overallScore = calculateOverallScore(
    elementComparisons,
    dmHarmony,
    diversity,
    sharedInt.length
  );

  // Generate summaries
  const { summary, summaryZh } = generateSummary(
    charts,
    elementComparisons,
    dmHarmony,
    shared,
    overallScore
  );

  return {
    chartIds,
    chartNames,
    elementComparisons,
    dominantElements: dominant,
    deficientElements: deficient,
    structures,
    sharedStructureType: shared,
    structureDiversity: diversity,
    sharedInteractions: sharedInt,
    uniqueInteractions: uniqueInt,
    dayMasterHarmony: dmHarmony,
    dayMasterElements: dmElements,
    overallScore,
    summary,
    summaryZh
  };
}

/**
 * Compare element distributions across charts
 */
function compareElements(charts: ChartData[]): ElementComparison[] {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return elements.map(element => {
    const chartValues: Record<string, number> = {};
    let sum = 0;

    charts.forEach(chart => {
      const value = chart.elementBalance[element] ?? 20;
      chartValues[chart.id] = value;
      sum += value;
    });

    const average = sum / charts.length;

    // Calculate variance
    let varianceSum = 0;
    charts.forEach(chart => {
      const value = chartValues[chart.id];
      varianceSum += Math.pow(value - average, 2);
    });
    const variance = Math.sqrt(varianceSum / charts.length);

    // Determine status
    let status: 'harmonious' | 'varied' | 'conflicting';
    if (variance < 5) {
      status = 'harmonious';
    } else if (variance < 15) {
      status = 'varied';
    } else {
      status = 'conflicting';
    }

    return {
      element,
      chartValues,
      average,
      variance,
      status
    };
  });
}

function identifyDominantDeficient(comparisons: ElementComparison[]): { dominant: string[]; deficient: string[] } {
  const dominant = comparisons
    .filter(c => c.average >= 25)
    .map(c => c.element);

  const deficient = comparisons
    .filter(c => c.average <= 15)
    .map(c => c.element);

  return { dominant, deficient };
}

function extractStructures(charts: ChartData[]): Record<string, string> {
  const structures: Record<string, string> = {};
  charts.forEach(chart => {
    structures[chart.id] = chart.structureType || 'Unknown';
  });
  return structures;
}

function analyzeStructureDiversity(structures: Record<string, string>): { shared?: string; diversity: number } {
  const types = Object.values(structures);
  const uniqueTypes = [...new Set(types)];

  const diversity = (uniqueTypes.length - 1) / Math.max(types.length - 1, 1);

  if (uniqueTypes.length === 1) {
    return { shared: uniqueTypes[0], diversity: 0 };
  }

  return { diversity };
}

function extractDayMasterElements(charts: ChartData[]): Record<string, string> {
  const elements: Record<string, string> = {};
  charts.forEach(chart => {
    elements[chart.id] = chart.dayMasterElement;
  });
  return elements;
}

function calculateDayMasterHarmony(charts: ChartData[]): number {
  if (charts.length < 2) return 0;

  let totalHarmony = 0;
  let comparisons = 0;

  for (let i = 0; i < charts.length; i++) {
    for (let j = i + 1; j < charts.length; j++) {
      const harmony = calculatePairHarmony(
        charts[i].dayMasterElement,
        charts[j].dayMasterElement
      );
      totalHarmony += harmony;
      comparisons++;
    }
  }

  return Math.round(totalHarmony / comparisons);
}

function calculatePairHarmony(element1: string, element2: string): number {
  const PRODUCES: Record<string, string> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood'
  };
  const CONTROLS: Record<string, string> = {
    Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire'
  };

  if (element1 === element2) return 80; // Same element - good
  if (PRODUCES[element1] === element2 || PRODUCES[element2] === element1) return 70; // Production - good
  if (CONTROLS[element1] === element2 || CONTROLS[element2] === element1) return 30; // Control - challenging

  return 50; // Neutral
}

function analyzeInteractions(charts: ChartData[]): {
  shared: InteractionComparison[];
  unique: Record<string, InteractionComparison[]>;
} {
  // Simplified interaction analysis
  const shared: InteractionComparison[] = [];
  const unique: Record<string, InteractionComparison[]> = {};

  // Check for common branch patterns
  const branchSets = charts.map(c => new Set([
    c.yearBranch, c.monthBranch, c.dayBranch, c.hourBranch
  ]));

  // Find clashing pairs common to multiple charts
  const clashPairs = [
    ['Zi', 'Wu'], ['Chou', 'Wei'], ['Yin', 'Shen'],
    ['Mao', 'You'], ['Chen', 'Xu'], ['Si', 'Hai']
  ];

  clashPairs.forEach(([a, b]) => {
    const chartsWithPair = charts.filter((chart, idx) =>
      branchSets[idx].has(a) && branchSets[idx].has(b)
    );

    if (chartsWithPair.length > 1) {
      shared.push({
        type: 'clash',
        participants: [a, b],
        chartsInvolved: chartsWithPair.map(c => c.id),
        significance: 'high'
      });
    } else if (chartsWithPair.length === 1) {
      const chartId = chartsWithPair[0].id;
      if (!unique[chartId]) unique[chartId] = [];
      unique[chartId].push({
        type: 'clash',
        participants: [a, b],
        chartsInvolved: [chartId],
        significance: 'medium'
      });
    }
  });

  return { shared, unique };
}

function calculateOverallScore(
  elementComparisons: ElementComparison[],
  dmHarmony: number,
  structureDiversity: number,
  sharedInteractionsCount: number
): number {
  // Element harmony contribution (0-40)
  const harmonious = elementComparisons.filter(e => e.status === 'harmonious').length;
  const elementScore = (harmonious / 5) * 40;

  // Day Master harmony contribution (0-30)
  const dmScore = ((dmHarmony + 100) / 200) * 30;

  // Structure similarity contribution (0-20)
  const structureScore = (1 - structureDiversity) * 20;

  // Shared interactions contribution (0-10)
  const interactionScore = Math.min(sharedInteractionsCount * 5, 10);

  return Math.round(elementScore + dmScore + structureScore + interactionScore);
}

function generateSummary(
  charts: ChartData[],
  elementComparisons: ElementComparison[],
  dmHarmony: number,
  sharedStructure: string | undefined,
  overallScore: number
): { summary: string; summaryZh: string } {
  const names = charts.map(c => c.name || c.id).join(', ');

  let summary = `Comparing ${charts.length} charts (${names}). `;
  let summaryZh = `比较${charts.length}个命盘（${names}）。`;

  // Overall assessment
  if (overallScore >= 70) {
    summary += 'Overall high compatibility. ';
    summaryZh += '整体兼容性高。';
  } else if (overallScore >= 50) {
    summary += 'Moderate compatibility with some differences. ';
    summaryZh += '中等兼容性，有些差异。';
  } else {
    summary += 'Significant differences between charts. ';
    summaryZh += '命盘之间存在显著差异。';
  }

  // Day Master harmony
  if (dmHarmony >= 70) {
    summary += 'Day Masters are harmonious. ';
    summaryZh += '日主和谐。';
  } else if (dmHarmony <= 30) {
    summary += 'Day Masters have challenging relationships. ';
    summaryZh += '日主关系有挑战。';
  }

  // Structure
  if (sharedStructure) {
    summary += `All share ${sharedStructure} structure.`;
    summaryZh += `都是${sharedStructure}格局。`;
  }

  return { summary, summaryZh };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get quick compatibility score between two charts
 */
export function getQuickCompatibility(chart1: ChartData, chart2: ChartData): number {
  const comparison = compareCharts([chart1, chart2]);
  return comparison.overallScore;
}

/**
 * Find the most compatible pair in a group
 */
export function findMostCompatiblePair(charts: ChartData[]): {
  chart1: string;
  chart2: string;
  score: number;
} {
  let bestPair = { chart1: '', chart2: '', score: 0 };

  for (let i = 0; i < charts.length; i++) {
    for (let j = i + 1; j < charts.length; j++) {
      const score = getQuickCompatibility(charts[i], charts[j]);
      if (score > bestPair.score) {
        bestPair = { chart1: charts[i].id, chart2: charts[j].id, score };
      }
    }
  }

  return bestPair;
}

/**
 * Find charts that clash with each other
 */
export function findClashingCharts(charts: ChartData[]): Array<{ chart1: string; chart2: string; reason: string }> {
  const clashing: Array<{ chart1: string; chart2: string; reason: string }> = [];

  for (let i = 0; i < charts.length; i++) {
    for (let j = i + 1; j < charts.length; j++) {
      const score = getQuickCompatibility(charts[i], charts[j]);
      if (score < 40) {
        clashing.push({
          chart1: charts[i].id,
          chart2: charts[j].id,
          reason: 'Low overall compatibility'
        });
      }
    }
  }

  return clashing;
}

// ==================== EXPORTS ====================

export {
  compareCharts,
  getQuickCompatibility,
  findMostCompatiblePair,
  findClashingCharts
};
